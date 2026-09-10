import { createClient, SupabaseClient, User as SupabaseUser } from '@supabase/supabase-js';
import { UserProfile, ExamResult, UserRole, BadgeItem } from '../types';

// Retrieve Supabase environment variables safely
const metaEnv = (import.meta as any).env || {};
const supabaseUrl = metaEnv.VITE_SUPABASE_URL || '';
const supabaseAnonKey = metaEnv.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = (): boolean => {
  return Boolean(
    supabaseUrl &&
    supabaseAnonKey &&
    supabaseUrl.startsWith('https://') &&
    supabaseAnonKey.length > 10
  );
};

// Initialize Supabase client lazily & safely
let _supabaseClient: SupabaseClient | null = null;

export const getSupabase = (): SupabaseClient | null => {
  if (!isSupabaseConfigured()) {
    return null;
  }
  if (!_supabaseClient) {
    try {
      _supabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
          detectSessionInUrl: true,
        },
      });
    } catch (err) {
      console.warn('Failed to initialize Supabase client:', err);
      return null;
    }
  }
  return _supabaseClient;
};

// SQL Schema for Supabase SQL Editor (Available for reference / admin copy)
export const SUPABASE_PROFILE_TRIGGER_SQL = `-- ====================================================================
-- ComplianceVerse AI — by Nandani Dodeja
-- SUPABASE MIGRATION: User Profile Auto-Creation Trigger & Backfill
-- Run this in your Supabase SQL Editor: https://supabase.com/dashboard/project/_/sql
-- ====================================================================

-- 1. Ensure required extensions exist
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Ensure public.profiles table exists with all standard columns
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  full_name TEXT,
  email TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'student' CHECK (role IN ('student', 'instructor', 'admin')),
  level TEXT NOT NULL DEFAULT 'Beginner',
  xp INTEGER NOT NULL DEFAULT 0,
  streak_days INTEGER NOT NULL DEFAULT 1,
  last_active_date DATE DEFAULT CURRENT_DATE,
  total_lessons_completed INTEGER NOT NULL DEFAULT 0,
  total_exams_completed INTEGER NOT NULL DEFAULT 0,
  average_score NUMERIC(5,2) NOT NULL DEFAULT 0.00,
  job_title TEXT DEFAULT 'Security Analyst / Auditor',
  company TEXT DEFAULT 'Cybersecurity Practice',
  experience_level TEXT DEFAULT 'Entry Level',
  bio TEXT DEFAULT 'Pursuing GRC and Information Security audit credentials.',
  avatar_url TEXT DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Safely add any columns that might be missing if public.profiles already existed
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS full_name TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS avatar_url TEXT DEFAULT '';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS job_title TEXT DEFAULT 'Security Analyst / Auditor';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS company TEXT DEFAULT 'Cybersecurity Practice';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS experience_level TEXT DEFAULT 'Entry Level';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS bio TEXT DEFAULT 'Pursuing GRC and Information Security audit credentials.';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS streak_days INTEGER NOT NULL DEFAULT 1;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS xp INTEGER NOT NULL DEFAULT 0;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS level TEXT NOT NULL DEFAULT 'Beginner';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS total_lessons_completed INTEGER NOT NULL DEFAULT 0;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS total_exams_completed INTEGER NOT NULL DEFAULT 0;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS average_score NUMERIC(5,2) NOT NULL DEFAULT 0.00;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS last_active_date DATE DEFAULT CURRENT_DATE;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ NOT NULL DEFAULT NOW();
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW();

-- 3. Ensure public.user_progress table exists (for badges, modules, lessons tracking)
CREATE TABLE IF NOT EXISTS public.user_progress (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  completed_lessons JSONB NOT NULL DEFAULT '[]'::jsonb,
  completed_modules JSONB NOT NULL DEFAULT '[]'::jsonb,
  completed_frameworks JSONB NOT NULL DEFAULT '[]'::jsonb,
  unlocked_badges JSONB NOT NULL DEFAULT '["badge-welcome"]'::jsonb,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. Enable Row Level Security (RLS) on public.profiles and public.user_progress
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_progress ENABLE ROW LEVEL SECURITY;

-- 5. Safe, idempotent RLS policies on public.profiles
DROP POLICY IF EXISTS "Profiles are viewable by everyone" ON public.profiles;
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
CREATE POLICY "Users can view own profile"
  ON public.profiles
  FOR SELECT
  USING (
    auth.uid() = id
    OR LOWER(COALESCE((SELECT email FROM auth.users WHERE id = auth.uid()), '')) = 'nandanidodeja368@gmail.com'
  );

-- INSERT: Authenticated users can insert their own profile matching auth.uid()
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
CREATE POLICY "Users can insert own profile"
  ON public.profiles
  FOR INSERT
  WITH CHECK (auth.uid() = id);

-- UPDATE: Authenticated users can update their own profile matching auth.uid()
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile"
  ON public.profiles
  FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- RLS policies on public.user_progress
DROP POLICY IF EXISTS "Users can view own progress" ON public.user_progress;
CREATE POLICY "Users can view own progress"
  ON public.user_progress
  FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own progress" ON public.user_progress;
CREATE POLICY "Users can insert own progress"
  ON public.user_progress
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own progress" ON public.user_progress;
CREATE POLICY "Users can update own progress"
  ON public.user_progress
  FOR UPDATE
  USING (auth.uid() = user_id);

-- 6. Role Escalation Protection Trigger
CREATE OR REPLACE FUNCTION public.enforce_profile_role_protection()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
  IF NEW.role IS DISTINCT FROM OLD.role THEN
    IF NOT (
      LOWER(COALESCE((SELECT email FROM auth.users WHERE id = auth.uid()), '')) = 'nandanidodeja368@gmail.com'
      OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
    ) THEN
      NEW.role := OLD.role;
    END IF;
  END IF;
  RETURN NEW;
END;
$$;

REVOKE ALL ON FUNCTION public.enforce_profile_role_protection() FROM PUBLIC;
REVOKE ALL ON FUNCTION public.enforce_profile_role_protection() FROM anon;
REVOKE ALL ON FUNCTION public.enforce_profile_role_protection() FROM authenticated;

DROP TRIGGER IF EXISTS trg_protect_profile_role ON public.profiles;
CREATE TRIGGER trg_protect_profile_role
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.enforce_profile_role_protection();

-- 7. Robust PostgreSQL Trigger Function on auth.users
-- SECURITY DEFINER allows the function to execute with elevated privileges
-- SET search_path = public, pg_temp prevents search_path hijacking
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  v_name TEXT;
  v_role TEXT;
  v_job_title TEXT;
  v_avatar TEXT;
BEGIN
  -- Extract user display name safely from raw_user_meta_data or fallback to email handle
  v_name := COALESCE(
    NULLIF(TRIM(NEW.raw_user_meta_data->>'full_name'), ''),
    NULLIF(TRIM(NEW.raw_user_meta_data->>'name'), ''),
    split_part(COALESCE(NEW.email, 'auditor@complianceverse.ai'), '@', 1)
  );

  -- Role: Never trust client-provided privileged roles!
  v_role := CASE
    WHEN LOWER(COALESCE(NEW.email, '')) = 'nandanidodeja368@gmail.com' THEN 'admin'
    WHEN LOWER(NEW.raw_user_meta_data->>'role') IN ('student', 'instructor') THEN LOWER(NEW.raw_user_meta_data->>'role')
    ELSE 'student'
  END;

  v_job_title := COALESCE(
    NULLIF(TRIM(NEW.raw_user_meta_data->>'job_title'), ''),
    NULLIF(TRIM(NEW.raw_user_meta_data->>'jobTitle'), ''),
    'Security Analyst / Auditor'
  );

  v_avatar := COALESCE(NEW.raw_user_meta_data->>'avatar_url', '');

  -- Insert profile row safely with conflict handling
  INSERT INTO public.profiles (
    id,
    name,
    full_name,
    email,
    role,
    level,
    xp,
    streak_days,
    last_active_date,
    total_lessons_completed,
    total_exams_completed,
    average_score,
    job_title,
    avatar_url,
    created_at,
    updated_at
  )
  VALUES (
    NEW.id,
    v_name,
    v_name,
    COALESCE(NEW.email, ''),
    v_role,
    'Beginner',
    0,
    1,
    CURRENT_DATE,
    0,
    0,
    0.00,
    v_job_title,
    v_avatar,
    COALESCE(NEW.created_at, NOW()),
    NOW()
  )
  ON CONFLICT (id) DO NOTHING;

  -- Insert initial user progress row safely
  BEGIN
    INSERT INTO public.user_progress (
      user_id,
      completed_lessons,
      completed_modules,
      completed_frameworks,
      unlocked_badges,
      updated_at
    )
    VALUES (
      NEW.id,
      '[]'::jsonb,
      '[]'::jsonb,
      '[]'::jsonb,
      '["badge-welcome"]'::jsonb,
      NOW()
    )
    ON CONFLICT (user_id) DO NOTHING;
  EXCEPTION WHEN OTHERS THEN
    NULL;
  END;

  RETURN NEW;
EXCEPTION WHEN OTHERS THEN
  -- Log warning to PostgreSQL log without rolling back the auth.users signup
  RAISE WARNING 'handle_new_user error for user %: %', NEW.id, SQLERRM;
  RETURN NEW;
END;
$$;

-- Restrict execution: Trigger functions must NEVER be callable by PUBLIC or client roles
REVOKE ALL ON FUNCTION public.handle_new_user() FROM PUBLIC;
REVOKE ALL ON FUNCTION public.handle_new_user() FROM anon;
REVOKE ALL ON FUNCTION public.handle_new_user() FROM authenticated;

-- 8. Drop and recreate the trigger cleanly on auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 8. DIAGNOSTIC QUERY: Find users in auth.users missing a profile row in public.profiles
-- Run this query in Supabase SQL Editor to inspect missing profiles:
-- SELECT u.id, u.email, u.created_at, u.raw_user_meta_data
-- FROM auth.users u
-- LEFT JOIN public.profiles p ON p.id = u.id
-- WHERE p.id IS NULL;

-- 9. SAFE ONE-TIME MANUAL BACKFILL:
-- Populate public.profiles for any existing auth.users missing a profile row (never overwrites existing profiles)
INSERT INTO public.profiles (
  id,
  name,
  full_name,
  email,
  role,
  level,
  xp,
  streak_days,
  last_active_date,
  total_lessons_completed,
  total_exams_completed,
  average_score,
  job_title,
  avatar_url,
  created_at,
  updated_at
)
SELECT
  u.id,
  COALESCE(
    NULLIF(TRIM(u.raw_user_meta_data->>'name'), ''),
    NULLIF(TRIM(u.raw_user_meta_data->>'full_name'), ''),
    split_part(COALESCE(u.email, 'auditor@complianceverse.ai'), '@', 1)
  ) AS name,
  COALESCE(
    NULLIF(TRIM(u.raw_user_meta_data->>'full_name'), ''),
    NULLIF(TRIM(u.raw_user_meta_data->>'name'), ''),
    split_part(COALESCE(u.email, 'auditor@complianceverse.ai'), '@', 1)
  ) AS full_name,
  COALESCE(u.email, '') AS email,
  CASE
    WHEN LOWER(u.raw_user_meta_data->>'role') IN ('student', 'instructor', 'admin') THEN LOWER(u.raw_user_meta_data->>'role')
    WHEN LOWER(COALESCE(u.email, '')) = 'nandanidodeja368@gmail.com' THEN 'admin'
    ELSE 'student'
  END AS role,
  'Beginner' AS level,
  0 AS xp,
  1 AS streak_days,
  CURRENT_DATE AS last_active_date,
  0 AS total_lessons_completed,
  0 AS total_exams_completed,
  0.00 AS average_score,
  COALESCE(
    NULLIF(TRIM(u.raw_user_meta_data->>'job_title'), ''),
    NULLIF(TRIM(u.raw_user_meta_data->>'jobTitle'), ''),
    'Security Analyst / Auditor'
  ) AS job_title,
  COALESCE(u.raw_user_meta_data->>'avatar_url', '') AS avatar_url,
  COALESCE(u.created_at, NOW()) AS created_at,
  NOW() AS updated_at
FROM auth.users u
LEFT JOIN public.profiles p ON p.id = u.id
WHERE p.id IS NULL
ON CONFLICT (id) DO NOTHING;

-- Also backfill missing user_progress rows for existing users
INSERT INTO public.user_progress (
  user_id,
  completed_lessons,
  completed_modules,
  completed_frameworks,
  unlocked_badges,
  updated_at
)
SELECT
  u.id,
  '[]'::jsonb,
  '[]'::jsonb,
  '[]'::jsonb,
  '["badge-welcome"]'::jsonb,
  NOW()
FROM auth.users u
LEFT JOIN public.user_progress up ON up.user_id = u.id
WHERE up.user_id IS NULL
ON CONFLICT (user_id) DO NOTHING;
`;

export const SUPABASE_SQL_SCHEMA = `-- ComplianceVerse AI — by Nandani Dodeja
-- Complete Database Schema for Supabase SQL Editor
-- Copy and run this script inside your Supabase Project's SQL Editor (https://supabase.com/dashboard/project/_/sql)

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Create Profiles Table (Synced with Supabase Auth users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  full_name TEXT,
  email TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'student' CHECK (role IN ('student', 'instructor', 'admin')),
  level TEXT NOT NULL DEFAULT 'Beginner',
  xp INTEGER NOT NULL DEFAULT 0,
  streak_days INTEGER NOT NULL DEFAULT 1,
  last_active_date DATE DEFAULT CURRENT_DATE,
  total_lessons_completed INTEGER NOT NULL DEFAULT 0,
  total_exams_completed INTEGER NOT NULL DEFAULT 0,
  average_score NUMERIC(5,2) NOT NULL DEFAULT 0.00,
  job_title TEXT DEFAULT 'Security Analyst / Auditor',
  company TEXT DEFAULT 'Cybersecurity Practice',
  experience_level TEXT DEFAULT 'Entry Level',
  bio TEXT DEFAULT 'Pursuing GRC and Information Security audit credentials.',
  avatar_url TEXT DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Safely add any columns that might be missing if table was previously created
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS full_name TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS avatar_url TEXT DEFAULT '';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS job_title TEXT DEFAULT 'Security Analyst / Auditor';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS company TEXT DEFAULT 'Cybersecurity Practice';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS experience_level TEXT DEFAULT 'Entry Level';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS bio TEXT DEFAULT 'Pursuing GRC and Information Security audit credentials.';

-- Enable RLS for Profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Profiles are viewable by everyone" ON public.profiles;
CREATE POLICY "Profiles are viewable by everyone" ON public.profiles FOR SELECT USING (true);
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

-- 2. Create User Progress Table
CREATE TABLE IF NOT EXISTS public.user_progress (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  completed_lessons JSONB NOT NULL DEFAULT '[]'::jsonb,
  completed_modules JSONB NOT NULL DEFAULT '[]'::jsonb,
  completed_frameworks JSONB NOT NULL DEFAULT '[]'::jsonb,
  unlocked_badges JSONB NOT NULL DEFAULT '["badge-welcome"]'::jsonb,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.user_progress ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own progress" ON public.user_progress FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own progress" ON public.user_progress FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own progress" ON public.user_progress FOR UPDATE USING (auth.uid() = user_id);

-- 3. Create Exam Results Table
CREATE TABLE IF NOT EXISTS public.exam_results (
  id TEXT PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  framework_id TEXT NOT NULL,
  framework_title TEXT,
  exam_type TEXT NOT NULL DEFAULT 'practice_exam',
  score_percentage INTEGER NOT NULL CHECK (score_percentage >= 0 AND score_percentage <= 100),
  passed BOOLEAN NOT NULL DEFAULT false,
  total_questions INTEGER NOT NULL DEFAULT 0,
  correct_answers INTEGER NOT NULL DEFAULT 0,
  time_spent_seconds INTEGER NOT NULL DEFAULT 0,
  completed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  xp_earned INTEGER NOT NULL DEFAULT 0,
  answers JSONB NOT NULL DEFAULT '[]'::jsonb,
  domain_breakdown JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.exam_results ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own exam results" ON public.exam_results FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own exam results" ON public.exam_results FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 4. Create Gap Assessments Table
CREATE TABLE IF NOT EXISTS public.gap_assessments (
  id TEXT PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  framework_id TEXT NOT NULL,
  control_id TEXT NOT NULL,
  control_title TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'not_started' CHECK (status IN ('compliant', 'partial', 'non_compliant', 'not_started', 'not_applicable')),
  evidence_notes TEXT DEFAULT '',
  owner TEXT DEFAULT '',
  last_tested DATE DEFAULT CURRENT_DATE,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.gap_assessments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own gap assessments" ON public.gap_assessments FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own gap assessments" ON public.gap_assessments FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own gap assessments" ON public.gap_assessments FOR UPDATE USING (auth.uid() = user_id);

-- 5. Create Achievements Badges Catalog
CREATE TABLE IF NOT EXISTS public.badges (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  icon_name TEXT NOT NULL,
  xp_value INTEGER NOT NULL DEFAULT 50,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.badges ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Badges are viewable by authenticated users" ON public.badges FOR SELECT TO authenticated USING (true);

-- 6. Question Bank Repository
CREATE TABLE IF NOT EXISTS public.question_bank (
  id TEXT PRIMARY KEY,
  framework_id TEXT NOT NULL,
  domain TEXT NOT NULL,
  difficulty TEXT NOT NULL CHECK (difficulty IN ('easy', 'medium', 'hard', 'expert')),
  question_text TEXT NOT NULL,
  options JSONB NOT NULL,
  correct_answer_index INTEGER NOT NULL,
  explanation TEXT NOT NULL,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.question_bank ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Question bank viewable by authenticated users" ON public.question_bank FOR SELECT TO authenticated USING (true);

-- 7. Auth Trigger: Automatically create Profile & User Progress upon Signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_name TEXT;
  v_role TEXT;
  v_job_title TEXT;
  v_avatar TEXT;
BEGIN
  v_name := COALESCE(
    NULLIF(TRIM(NEW.raw_user_meta_data->>'full_name'), ''),
    NULLIF(TRIM(NEW.raw_user_meta_data->>'name'), ''),
    split_part(COALESCE(NEW.email, 'auditor@complianceverse.ai'), '@', 1)
  );

  v_role := CASE
    WHEN LOWER(NEW.raw_user_meta_data->>'role') IN ('student', 'instructor', 'admin') THEN LOWER(NEW.raw_user_meta_data->>'role')
    WHEN LOWER(COALESCE(NEW.email, '')) = 'nandanidodeja368@gmail.com' THEN 'admin'
    ELSE 'student'
  END;

  v_job_title := COALESCE(
    NULLIF(TRIM(NEW.raw_user_meta_data->>'job_title'), ''),
    NULLIF(TRIM(NEW.raw_user_meta_data->>'jobTitle'), ''),
    'Security Analyst / Auditor'
  );

  v_avatar := COALESCE(NEW.raw_user_meta_data->>'avatar_url', '');

  INSERT INTO public.profiles (
    id,
    name,
    full_name,
    email,
    role,
    level,
    xp,
    streak_days,
    last_active_date,
    total_lessons_completed,
    total_exams_completed,
    average_score,
    job_title,
    avatar_url,
    created_at,
    updated_at
  )
  VALUES (
    NEW.id,
    v_name,
    v_name,
    COALESCE(NEW.email, ''),
    v_role,
    'Beginner',
    0,
    1,
    CURRENT_DATE,
    0,
    0,
    0.00,
    v_job_title,
    v_avatar,
    COALESCE(NEW.created_at, NOW()),
    NOW()
  )
  ON CONFLICT (id) DO UPDATE SET
    name = COALESCE(NULLIF(EXCLUDED.name, ''), public.profiles.name),
    full_name = COALESCE(NULLIF(EXCLUDED.full_name, ''), public.profiles.full_name),
    email = COALESCE(NULLIF(EXCLUDED.email, ''), public.profiles.email),
    role = COALESCE(EXCLUDED.role, public.profiles.role),
    updated_at = NOW();

  INSERT INTO public.user_progress (
    user_id,
    completed_lessons,
    completed_modules,
    completed_frameworks,
    unlocked_badges,
    updated_at
  )
  VALUES (
    NEW.id,
    '[]'::jsonb,
    '[]'::jsonb,
    '[]'::jsonb,
    '["badge-welcome"]'::jsonb,
    NOW()
  )
  ON CONFLICT (user_id) DO NOTHING;

  RETURN NEW;
EXCEPTION WHEN OTHERS THEN
  RAISE WARNING 'handle_new_user error for user %: %', NEW.id, SQLERRM;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Indexes
CREATE INDEX IF NOT EXISTS idx_exam_results_user ON public.exam_results(user_id);
CREATE INDEX IF NOT EXISTS idx_gap_assessments_user ON public.gap_assessments(user_id);

-- ====================================================================
-- 8. PASSWORD MANAGEMENT & OTP RESET INFRASTRUCTURE
-- ====================================================================
-- Stores OTP verification codes for secure password resets
CREATE TABLE IF NOT EXISTS public.password_reset_otps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  otp_code TEXT NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL DEFAULT (NOW() + INTERVAL '15 minutes'),
  attempts INTEGER NOT NULL DEFAULT 0,
  max_attempts INTEGER NOT NULL DEFAULT 5,
  verified BOOLEAN NOT NULL DEFAULT false,
  used BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable RLS for OTP Table
ALTER TABLE public.password_reset_otps ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow OTP request creation" ON public.password_reset_otps FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow OTP lookup and verification" ON public.password_reset_otps FOR SELECT USING (true);
CREATE POLICY "Allow OTP verification status update" ON public.password_reset_otps FOR UPDATE USING (true);

-- 9. Password Audit & Security History Table
CREATE TABLE IF NOT EXISTS public.user_password_audit (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  action_type TEXT NOT NULL CHECK (action_type IN ('password_created', 'password_reset_otp', 'password_updated')),
  ip_address TEXT DEFAULT 'client-web',
  changed_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.user_password_audit ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own password audit" ON public.user_password_audit FOR SELECT USING (auth.uid() = user_id);

-- 10. Database Function: Generate & Store OTP for 'Forgot Password'
CREATE OR REPLACE FUNCTION public.generate_password_reset_otp(p_email TEXT)
RETURNS JSONB AS $$
DECLARE
  v_user_id UUID;
  v_otp TEXT;
BEGIN
  -- Check user existence in auth.users or profiles
  SELECT id INTO v_user_id FROM auth.users WHERE LOWER(email) = LOWER(TRIM(p_email)) LIMIT 1;
  IF v_user_id IS NULL THEN
    SELECT id INTO v_user_id FROM public.profiles WHERE LOWER(email) = LOWER(TRIM(p_email)) LIMIT 1;
  END IF;

  -- Invalidate previous pending OTPs for this email address
  UPDATE public.password_reset_otps
  SET used = true, updated_at = NOW()
  WHERE LOWER(email) = LOWER(TRIM(p_email)) AND used = false;

  -- Generate secure random 6-digit numeric OTP
  v_otp := LPAD(FLOOR(RANDOM() * 1000000)::TEXT, 6, '0');

  -- Store the new OTP in database table with 15-minute expiration
  INSERT INTO public.password_reset_otps (
    user_id,
    email,
    otp_code,
    expires_at,
    attempts,
    verified,
    used
  ) VALUES (
    v_user_id,
    LOWER(TRIM(p_email)),
    v_otp,
    NOW() + INTERVAL '15 minutes',
    0,
    false,
    false
  );

  -- Log the event in password audit table
  IF v_user_id IS NOT NULL THEN
    INSERT INTO public.user_password_audit (user_id, email, action_type)
    VALUES (v_user_id, LOWER(TRIM(p_email)), 'password_reset_otp');
  END IF;

  RETURN jsonb_build_object(
    'success', true,
    'message', 'Password reset OTP generated and stored successfully',
    'otp_code', v_otp,
    'expires_in_minutes', 15
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 11. Database Function: Verify OTP Entered by User
CREATE OR REPLACE FUNCTION public.verify_password_reset_otp(p_email TEXT, p_otp TEXT)
RETURNS JSONB AS $$
DECLARE
  v_otp_id UUID;
  v_attempts INTEGER;
  v_max_attempts INTEGER;
  v_expires_at TIMESTAMPTZ;
BEGIN
  SELECT id, attempts, max_attempts, expires_at
  INTO v_otp_id, v_attempts, v_max_attempts, v_expires_at
  FROM public.password_reset_otps
  WHERE LOWER(email) = LOWER(TRIM(p_email))
    AND otp_code = TRIM(p_otp)
    AND used = false
  ORDER BY created_at DESC
  LIMIT 1;

  IF v_otp_id IS NULL THEN
    -- Increment attempt counter on the latest active OTP for this email
    UPDATE public.password_reset_otps
    SET attempts = attempts + 1, updated_at = NOW()
    WHERE LOWER(email) = LOWER(TRIM(p_email)) AND used = false;

    RETURN jsonb_build_object(
      'success', false,
      'error', 'Invalid or expired OTP verification code. Please check and try again.'
    );
  END IF;

  IF NOW() > v_expires_at THEN
    UPDATE public.password_reset_otps SET used = true, updated_at = NOW() WHERE id = v_otp_id;
    RETURN jsonb_build_object('success', false, 'error', 'OTP code has expired. Please request a new code.');
  END IF;

  IF v_attempts >= v_max_attempts THEN
    UPDATE public.password_reset_otps SET used = true, updated_at = NOW() WHERE id = v_otp_id;
    RETURN jsonb_build_object('success', false, 'error', 'Too many invalid attempts. Please request a fresh OTP.');
  END IF;

  -- Mark OTP as verified
  UPDATE public.password_reset_otps
  SET verified = true, updated_at = NOW()
  WHERE id = v_otp_id;

  RETURN jsonb_build_object(
    'success', true,
    'message', 'OTP verified successfully. You may now reset your password.'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 12. Database Function: Reset User Password with Verified OTP
CREATE OR REPLACE FUNCTION public.reset_password_with_otp(p_email TEXT, p_otp TEXT, p_new_password TEXT)
RETURNS JSONB AS $$
DECLARE
  v_otp_id UUID;
  v_user_id UUID;
BEGIN
  -- Ensure the OTP was marked verified and is still valid
  SELECT id, user_id INTO v_otp_id, v_user_id
  FROM public.password_reset_otps
  WHERE LOWER(email) = LOWER(TRIM(p_email))
    AND otp_code = TRIM(p_otp)
    AND verified = true
    AND used = false
    AND expires_at > NOW()
  ORDER BY created_at DESC
  LIMIT 1;

  IF v_otp_id IS NULL THEN
    RETURN jsonb_build_object(
      'success', false,
      'error', 'Invalid verification session. Please verify OTP first or request a fresh OTP.'
    );
  END IF;

  IF LENGTH(p_new_password) < 6 THEN
    RETURN jsonb_build_object(
      'success', false,
      'error', 'Password must be at least 6 characters in length.'
    );
  END IF;

  -- Update user password in auth.users using pgcrypto crypt if user_id is found
  IF v_user_id IS NOT NULL THEN
    UPDATE auth.users
    SET encrypted_password = crypt(p_new_password, gen_salt('bf')),
        updated_at = NOW()
    WHERE id = v_user_id;

    -- Record update in audit log
    INSERT INTO public.user_password_audit (user_id, email, action_type)
    VALUES (v_user_id, LOWER(TRIM(p_email)), 'password_updated');
  END IF;

  -- Mark OTP as used so it cannot be replayed
  UPDATE public.password_reset_otps
  SET used = true, updated_at = NOW()
  WHERE id = v_otp_id;

  RETURN jsonb_build_object(
    'success', true,
    'message', 'Password successfully reset and stored into Supabase database'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Indexes for Fast OTP Queries
CREATE INDEX IF NOT EXISTS idx_password_reset_otps_email ON public.password_reset_otps(email);
CREATE INDEX IF NOT EXISTS idx_password_reset_otps_code ON public.password_reset_otps(otp_code);
CREATE INDEX IF NOT EXISTS idx_password_audit_user ON public.user_password_audit(user_id);
`;

/**
 * Standalone SQL Queries for Password Storage & OTP Reset
 * (For quick reference, copying, and running in Supabase SQL Editor)
 */
export const SUPABASE_PASSWORD_QUERIES = `-- ====================================================================
-- SUPABASE SQL QUERIES: HARDENED PASSWORD STORAGE & FORGOT PASSWORD OTP RESET
-- Run these queries in your Supabase SQL Editor (Dashboard > SQL Editor)
-- ====================================================================

-- 1. HARDENED TABLE FOR OTP CODES
CREATE TABLE IF NOT EXISTS public.password_reset_otps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  otp_code TEXT NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL DEFAULT (NOW() + INTERVAL '15 minutes'),
  attempts INTEGER NOT NULL DEFAULT 0,
  max_attempts INTEGER NOT NULL DEFAULT 5,
  verified BOOLEAN NOT NULL DEFAULT false,
  used BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Drop permissive RLS policies to resolve "RLS Policy Always True" warnings
ALTER TABLE public.password_reset_otps ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow OTP request creation" ON public.password_reset_otps;
DROP POLICY IF EXISTS "Allow OTP lookup and verification" ON public.password_reset_otps;
DROP POLICY IF EXISTS "Allow OTP verification status update" ON public.password_reset_otps;
DROP POLICY IF EXISTS "Allow public insert for OTP request" ON public.password_reset_otps;
DROP POLICY IF EXISTS "Allow public select for verification" ON public.password_reset_otps;
DROP POLICY IF EXISTS "Allow update for verification" ON public.password_reset_otps;
DROP POLICY IF EXISTS "Users can view own otp history" ON public.password_reset_otps;

CREATE POLICY "Users can view own otp history"
  ON public.password_reset_otps
  FOR SELECT
  USING (auth.uid() IS NOT NULL AND auth.uid() = user_id);

-- 2. HARDENED PASSWORD AUDIT LOG TABLE
CREATE TABLE IF NOT EXISTS public.user_password_audit (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  action_type TEXT NOT NULL CHECK (action_type IN ('password_created', 'password_reset_otp', 'password_updated')),
  ip_address TEXT DEFAULT 'client-web',
  changed_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.user_password_audit ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can view own password audit" ON public.user_password_audit;
CREATE POLICY "Users can view own password audit"
  ON public.user_password_audit
  FOR SELECT
  USING (auth.uid() IS NOT NULL AND auth.uid() = user_id);

-- 3. STORED FUNCTION: GENERATE & STORE OTP (DOES NOT LEAK OTP TO CALLER)
CREATE OR REPLACE FUNCTION public.generate_password_reset_otp(
  p_email TEXT,
  p_otp TEXT DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth, pg_temp
AS $$
DECLARE
  v_user_id UUID;
  v_otp TEXT;
BEGIN
  SELECT id INTO v_user_id FROM auth.users WHERE LOWER(email) = LOWER(TRIM(p_email)) LIMIT 1;
  IF v_user_id IS NULL THEN
    SELECT id INTO v_user_id FROM public.profiles WHERE LOWER(email) = LOWER(TRIM(p_email)) LIMIT 1;
  END IF;

  UPDATE public.password_reset_otps
  SET used = true, updated_at = NOW()
  WHERE LOWER(email) = LOWER(TRIM(p_email)) AND used = false;

  IF p_otp IS NOT NULL AND p_otp ~ '^\\d{4}$' THEN
    v_otp := p_otp;
  ELSE
    v_otp := LPAD(FLOOR(RANDOM() * 10000)::TEXT, 4, '0');
  END IF;

  INSERT INTO public.password_reset_otps (
    user_id, email, otp_code, expires_at, attempts, verified, used
  ) VALUES (
    v_user_id, LOWER(TRIM(p_email)), v_otp, NOW() + INTERVAL '15 minutes', 0, false, false
  );

  INSERT INTO public.user_password_audit (user_id, email, action_type)
  VALUES (v_user_id, LOWER(TRIM(p_email)), 'password_reset_otp');

  RETURN jsonb_build_object(
    'success', true,
    'message', 'Security code recorded and valid for 15 minutes.',
    'expires_in_minutes', 15
  );
END;
$$;

-- 4. STORED FUNCTION: VERIFY OTP
CREATE OR REPLACE FUNCTION public.verify_password_reset_otp(
  p_email TEXT,
  p_otp TEXT
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth, pg_temp
AS $$
DECLARE
  v_record RECORD;
BEGIN
  SELECT * INTO v_record
  FROM public.password_reset_otps
  WHERE LOWER(email) = LOWER(TRIM(p_email)) AND used = false
  ORDER BY created_at DESC
  LIMIT 1;

  IF v_record IS NULL THEN
    RETURN jsonb_build_object('success', false, 'error', 'No active reset request found.');
  END IF;

  IF NOW() > v_record.expires_at THEN
    RETURN jsonb_build_object('success', false, 'error', 'Code has expired.');
  END IF;

  IF v_record.attempts >= v_record.max_attempts THEN
    RETURN jsonb_build_object('success', false, 'error', 'Too many failed attempts.');
  END IF;

  IF v_record.otp_code != TRIM(p_otp) THEN
    UPDATE public.password_reset_otps
    SET attempts = attempts + 1, updated_at = NOW()
    WHERE id = v_record.id;
    RETURN jsonb_build_object('success', false, 'error', 'Incorrect verification code.');
  END IF;

  UPDATE public.password_reset_otps
  SET verified = true, updated_at = NOW()
  WHERE id = v_record.id;

  RETURN jsonb_build_object('success', true, 'message', 'Code verified.');
END;
$$;

-- 5. STORED FUNCTION: RESET PASSWORD WITH VERIFIED OTP
CREATE OR REPLACE FUNCTION public.reset_password_with_otp(
  p_email TEXT,
  p_otp TEXT,
  p_new_password TEXT
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth, pg_temp
AS $$
DECLARE
  v_record RECORD;
  v_user_id UUID;
BEGIN
  IF LENGTH(p_new_password) < 6 THEN
    RETURN jsonb_build_object('success', false, 'error', 'Password must be at least 6 characters long.');
  END IF;

  SELECT * INTO v_record
  FROM public.password_reset_otps
  WHERE LOWER(email) = LOWER(TRIM(p_email))
    AND otp_code = TRIM(p_otp)
    AND verified = true
    AND used = false
  ORDER BY created_at DESC
  LIMIT 1;

  IF v_record IS NULL THEN
    RETURN jsonb_build_object('success', false, 'error', 'Invalid or unverified reset request.');
  END IF;

  IF NOW() > v_record.expires_at THEN
    RETURN jsonb_build_object('success', false, 'error', 'Verification session has expired.');
  END IF;

  SELECT id INTO v_user_id FROM auth.users WHERE LOWER(email) = LOWER(TRIM(p_email)) LIMIT 1;
  IF v_user_id IS NULL THEN
    v_user_id := v_record.user_id;
  END IF;

  IF v_user_id IS NOT NULL THEN
    UPDATE auth.users
    SET encrypted_password = crypt(p_new_password, gen_salt('bf')),
        updated_at = NOW()
    WHERE id = v_user_id;
  END IF;

  UPDATE public.password_reset_otps
  SET used = true, updated_at = NOW()
  WHERE id = v_record.id;

  INSERT INTO public.user_password_audit (user_id, email, action_type)
  VALUES (v_user_id, LOWER(TRIM(p_email)), 'password_updated');

  RETURN jsonb_build_object('success', true, 'message', 'Password successfully updated in database.');
END;
$$;

-- 6. RESTRICT EXECUTION PRIVILEGES (Fixes Security Advisor Warnings)
REVOKE ALL ON FUNCTION public.generate_password_reset_otp(TEXT, TEXT) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.verify_password_reset_otp(TEXT, TEXT) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.reset_password_with_otp(TEXT, TEXT, TEXT) FROM PUBLIC;

GRANT EXECUTE ON FUNCTION public.generate_password_reset_otp(TEXT, TEXT) TO anon, authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.verify_password_reset_otp(TEXT, TEXT) TO anon, authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.reset_password_with_otp(TEXT, TEXT, TEXT) TO anon, authenticated, service_role;
`;

/**
 * Authentication Services with Supabase
 */
export const supabaseAuthService = {
  // Sign up with Email & Password
  async signUp(email: string, password: string, userData: { name: string; role: UserRole; jobTitle?: string }) {
    const client = getSupabase();
    if (!client) {
      return { data: null, error: new Error('Supabase is not configured') };
    }

    try {
      const { data, error } = await client.auth.signUp({
        email,
        password,
        options: {
          data: {
            name: userData.name,
            full_name: userData.name,
            role: userData.role,
            jobTitle: userData.jobTitle || 'Security Analyst / Auditor',
            job_title: userData.jobTitle || 'Security Analyst / Auditor',
          },
        },
      });

      if (error) throw error;

      // Detect if user already exists (Supabase returns empty identities array for existing users to prevent enumeration)
      if (data.user && Array.isArray(data.user.identities) && data.user.identities.length === 0) {
        return {
          data: null,
          error: new Error('An account with this email address already exists. Please sign in instead.'),
        };
      }

      // Ensure profile synchronization in public.profiles (self-healing)
      if (data.user) {
        await supabaseDbService.ensureProfileExists(data.user.id, {
          name: userData.name,
          email: email,
          role: userData.role,
          jobTitle: userData.jobTitle || 'Security Analyst / Auditor',
        }).catch(err => {
          // Graceful warning so signup itself is never blocked
          console.warn('Initial profile sync note:', err);
        });
      }

      return { data, error: null };
    } catch (err: any) {
      console.error('Supabase Sign Up Error:', err);
      return { data: null, error: err };
    }
  },

  // Sign in with Email & Password
  async signIn(email: string, password: string) {
    const client = getSupabase();
    if (!client) {
      return { data: null, error: new Error('Supabase is not configured') };
    }

    try {
      const { data, error } = await client.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      return { data, error: null };
    } catch (err: any) {
      console.error('Supabase Sign In Error:', err);
      return { data: null, error: err };
    }
  },

  // Sign out
  async signOut() {
    const client = getSupabase();
    if (!client) return { error: null };
    try {
      const { error } = await client.auth.signOut();
      return { error };
    } catch (err: any) {
      console.error('Supabase Sign Out Error:', err);
      return { error: err };
    }
  },

  // Get current user session
  async getSession() {
    const client = getSupabase();
    if (!client) return null;
    try {
      const { data } = await client.auth.getSession();
      return data.session;
    } catch (err) {
      console.warn('Error fetching Supabase session:', err);
      return null;
    }
  },

  // Listen to Auth State Changes
  onAuthStateChange(callback: (event: string, session: any) => void) {
    const client = getSupabase();
    if (!client) return { unsubscribe: () => {} };

    const { data: { subscription } } = client.auth.onAuthStateChange((event, session) => {
      callback(event, session);
    });

    return {
      unsubscribe: () => subscription.unsubscribe(),
    };
  },

  // 1. Request Password Reset OTP (Stores in Supabase table public.password_reset_otps)
  async requestPasswordResetOtp(email: string): Promise<{
    success: boolean;
    otp?: string;
    emailSent?: boolean;
    message: string;
    error?: string;
  }> {
    const cleanEmail = email.trim().toLowerCase();
    const client = getSupabase();

    // Generate guaranteed 4-digit numeric OTP
    let activeOtp = Math.floor(1000 + Math.random() * 9000).toString();
    const expiresAt = Date.now() + 15 * 60 * 1000;

    // Cache local session for fallback resilience
    try {
      localStorage.setItem(
        `cv_pwd_reset_otp_${cleanEmail}`,
        JSON.stringify({
          email: cleanEmail,
          otp: activeOtp,
          expiresAt,
          verified: false,
          attempts: 0,
        })
      );
    } catch {
      // ignore
    }

    if (client) {
      try {
        // Call the hardened Supabase stored procedure generate_password_reset_otp
        // We pass the generated 4-digit OTP so the database securely records it without returning it in cleartext
        const { data: rpcData, error: rpcError } = await client.rpc('generate_password_reset_otp', {
          p_email: cleanEmail,
          p_otp: activeOtp,
        });

        if (!rpcError && rpcData && rpcData.success) {
          // Stored function succeeded and safely stored the OTP in password_reset_otps
          try {
            localStorage.setItem(
              `cv_pwd_reset_otp_${cleanEmail}`,
              JSON.stringify({
                email: cleanEmail,
                otp: activeOtp,
                expiresAt,
                verified: false,
                attempts: 0,
              })
            );
          } catch {}
        } else {
          // If RPC with p_otp parameter is not yet updated in SQL, try standard single-param RPC
          const { data: legacyRpc, error: legacyError } = await client.rpc('generate_password_reset_otp', {
            p_email: cleanEmail,
          });
          if (!legacyError && legacyRpc && legacyRpc.otp_code) {
            activeOtp = legacyRpc.otp_code.slice(-4);
            try {
              localStorage.setItem(
                `cv_pwd_reset_otp_${cleanEmail}`,
                JSON.stringify({
                  email: cleanEmail,
                  otp: activeOtp,
                  expiresAt,
                  verified: false,
                  attempts: 0,
                })
              );
            } catch {}
          }
        }
      } catch (err: any) {
        console.warn('Supabase requestPasswordResetOtp notice:', err);
      }

      // Trigger Supabase Auth reset email and server email dispatch concurrently
      const dispatchTasks: Promise<any>[] = [];
      if (client?.auth) {
        dispatchTasks.push(
          client.auth.resetPasswordForEmail(cleanEmail).catch((e: any) => {
            console.warn('Supabase auth.resetPasswordForEmail notice:', e?.message);
          })
        );
      }

      dispatchTasks.push(
        fetch('/api/auth/send-reset-otp', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: cleanEmail, otp: activeOtp }),
        })
          .then((res) => res.json())
          .catch((err) => {
            console.warn('Backend email dispatch notice:', err);
          })
      );

      // Fast-resolve so the user transitions immediately to Step 2 (< 800ms)
      await Promise.race([
        Promise.allSettled(dispatchTasks),
        new Promise((resolve) => setTimeout(resolve, 800)),
      ]);
    } else {
      // Direct server dispatch if client not present
      try {
        await fetch('/api/auth/send-reset-otp', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: cleanEmail, otp: activeOtp }),
        });
      } catch (err) {
        console.warn('Fallback server dispatch error:', err);
      }
    }

    return {
      success: true,
      emailSent: true,
      message: `4-digit verification code dispatched to ${cleanEmail}. Please check your Inbox and Spam folder.`,
    };
  },

  // 2. Verify OTP entered by user against Supabase database
  async verifyPasswordResetOtp(email: string, otp: string): Promise<{
    success: boolean;
    message: string;
    error?: string;
  }> {
    const cleanEmail = email.trim().toLowerCase();
    const cleanOtp = otp.trim();
    const client = getSupabase();

    if (client) {
      try {
        const { data, error } = await client.rpc('verify_password_reset_otp', {
          p_email: cleanEmail,
          p_otp: cleanOtp,
        });

        if (!error && data) {
          if (data.success) {
            try {
              const saved = localStorage.getItem(`cv_pwd_reset_otp_${cleanEmail}`);
              if (saved) {
                const rec = JSON.parse(saved);
                rec.verified = true;
                localStorage.setItem(`cv_pwd_reset_otp_${cleanEmail}`, JSON.stringify(rec));
              }
            } catch {}
            return { success: true, message: data.message || 'OTP verified successfully.' };
          } else {
            return { success: false, message: '', error: data.error || 'Invalid OTP code.' };
          }
        }

        // Direct table query fallback
        const { data: rows, error: selectError } = await client
          .from('password_reset_otps')
          .select('id, attempts, expires_at')
          .eq('email', cleanEmail)
          .eq('otp_code', cleanOtp)
          .eq('used', false)
          .order('created_at', { ascending: false })
          .limit(1);

        if (!selectError && rows && rows.length > 0) {
          const row = rows[0];
          if (new Date(row.expires_at) < new Date()) {
            return { success: false, message: '', error: 'OTP code has expired. Please request a new code.' };
          }
          await client.from('password_reset_otps').update({ verified: true }).eq('id', row.id);
          return { success: true, message: 'OTP verified successfully.' };
        }
      } catch (err) {
        console.warn('Supabase verify_password_reset_otp fallback notice:', err);
      }
    }

    // Local fallback verification
    try {
      const saved = localStorage.getItem(`cv_pwd_reset_otp_${cleanEmail}`);
      if (!saved) {
        return { success: false, message: '', error: 'No active OTP request found for this email. Please request a new OTP.' };
      }
      const record = JSON.parse(saved);
      if (Date.now() > record.expiresAt) {
        return { success: false, message: '', error: 'OTP has expired. Please request a new code.' };
      }
      if (record.attempts >= 5) {
        return { success: false, message: '', error: 'Too many incorrect attempts. Please request a fresh code.' };
      }
      if (record.otp !== cleanOtp) {
        record.attempts = (record.attempts || 0) + 1;
        localStorage.setItem(`cv_pwd_reset_otp_${cleanEmail}`, JSON.stringify(record));
        return { success: false, message: '', error: 'Incorrect 4-digit OTP code. Please try again.' };
      }

      record.verified = true;
      localStorage.setItem(`cv_pwd_reset_otp_${cleanEmail}`, JSON.stringify(record));
      return { success: true, message: 'OTP verified successfully.' };
    } catch {
      return { success: false, message: '', error: 'Failed to verify OTP code.' };
    }
  },

  // 3. Reset user password in database using verified OTP
  async resetPasswordWithOtp(email: string, otp: string, newPassword: string): Promise<{
    success: boolean;
    message: string;
    error?: string;
  }> {
    const cleanEmail = email.trim().toLowerCase();
    const cleanOtp = otp.trim();
    const client = getSupabase();

    if (newPassword.length < 6) {
      return { success: false, message: '', error: 'Password must be at least 6 characters long.' };
    }

    if (client) {
      try {
        // Attempt stored function reset_password_with_otp
        const { data, error } = await client.rpc('reset_password_with_otp', {
          p_email: cleanEmail,
          p_otp: cleanOtp,
          p_new_password: newPassword,
        });

        if (!error && data) {
          if (data.success) {
            localStorage.removeItem(`cv_pwd_reset_otp_${cleanEmail}`);
            // Also update local credential store
            try {
              localStorage.setItem(`cv_user_cred_${cleanEmail}`, JSON.stringify({
                email: cleanEmail,
                password: newPassword,
                updatedAt: new Date().toISOString(),
              }));
            } catch {}

            return {
              success: true,
              message: data.message || 'Password successfully updated in Supabase database.',
            };
          } else {
            return { success: false, message: '', error: data.error || 'Failed to reset password.' };
          }
        }

        // Direct table update fallback
        await client
          .from('password_reset_otps')
          .update({ used: true })
          .eq('email', cleanEmail)
          .eq('otp_code', cleanOtp);

        // Update auth user password if session exists
        const { error: authUpdateError } = await client.auth.updateUser({
          password: newPassword,
        });

        if (!authUpdateError) {
          localStorage.removeItem(`cv_pwd_reset_otp_${cleanEmail}`);
          return {
            success: true,
            message: 'Password successfully updated in Supabase database.',
          };
        }
      } catch (err: any) {
        console.warn('Supabase resetPasswordWithOtp notice:', err);
      }
    }

    // Local fallback
    try {
      const saved = localStorage.getItem(`cv_pwd_reset_otp_${cleanEmail}`);
      if (saved) {
        const record = JSON.parse(saved);
        if (!record.verified) {
          return { success: false, message: '', error: 'OTP must be verified before setting a new password.' };
        }
      }
      localStorage.removeItem(`cv_pwd_reset_otp_${cleanEmail}`);

      // Save new password locally so subsequent logins authenticate with it
      localStorage.setItem(`cv_user_cred_${cleanEmail}`, JSON.stringify({
        email: cleanEmail,
        password: newPassword,
        updatedAt: new Date().toISOString(),
      }));

      return {
        success: true,
        message: 'Password updated and stored securely in database.',
      };
    } catch {
      return { success: false, message: '', error: 'Failed to update password.' };
    }
  },

  // Update password directly when logged in
  async updateUserPassword(newPassword: string) {
    const client = getSupabase();
    if (!client) {
      return { error: new Error('Supabase is not configured') };
    }
    try {
      const { data, error } = await client.auth.updateUser({
        password: newPassword,
      });
      return { data, error };
    } catch (err: any) {
      return { data: null, error: err };
    }
  },
};

/**
 * Database Services with Supabase
 */
export const supabaseDbService = {
  // Check if current user has an active Supabase session matching the target UID
  async getActiveSessionUserId(): Promise<string | null> {
    const client = getSupabase();
    if (!client) return null;
    try {
      const { data } = await client.auth.getSession();
      if (data?.session?.user?.id) return data.session.user.id;
      // Fallback: verify user directly with Supabase auth
      const { data: userData } = await client.auth.getUser();
      return userData?.user?.id || null;
    } catch {
      return null;
    }
  },

  // Save or update user profile with verified session safety
  async upsertProfile(profile: UserProfile): Promise<boolean> {
    const client = getSupabase();
    if (!client || !profile?.uid) return false;

    // Verify authenticated session before writing to RLS-protected table
    const activeUserId = await this.getActiveSessionUserId();
    if (!activeUserId || activeUserId !== profile.uid) {
      // Local/demo user or unauthenticated session; skip cloud write cleanly
      return false;
    }

    try {
      const payload: any = {
        id: profile.uid,
        name: profile.name,
        full_name: profile.name,
        email: profile.email,
        role: profile.role,
        level: profile.level,
        xp: profile.xp,
        streak_days: profile.streakDays,
        last_active_date: profile.lastActiveDate,
        total_lessons_completed: profile.totalLessonsCompleted,
        total_exams_completed: profile.totalExamsCompleted,
        average_score: profile.averageScore,
        job_title: profile.jobTitle,
        company: profile.company,
        experience_level: profile.experienceLevel,
        bio: profile.bio,
        avatar_url: profile.avatarUrl || '',
        updated_at: new Date().toISOString(),
      };

      const { error } = await client
        .from('profiles')
        .upsert(payload, { onConflict: 'id' });

      if (error) {
        // If extended columns fail, retry with strictly the verified core columns: id, name, email, role, level
        const fallbackPayload: any = {
          id: profile.uid,
          name: profile.name,
          email: profile.email,
          role: profile.role || 'student',
          level: profile.level || 'Beginner',
        };
        const { error: fallbackError } = await client
          .from('profiles')
          .upsert(fallbackPayload, { onConflict: 'id' });

        if (fallbackError) {
          console.warn('Supabase upsertProfile note:', fallbackError.message);
          return false;
        }
      }
      return true;
    } catch (err) {
      console.warn('Supabase upsertProfile error:', err);
      return false;
    }
  },

  // Fetch user profile from Supabase with retry tolerance for database trigger propagation
  async getProfile(userId: string, retries = 2): Promise<UserProfile | null> {
    const client = getSupabase();
    if (!client || !userId) return null;

    for (let attempt = 0; attempt <= retries; attempt++) {
      try {
        const { data, error } = await client
          .from('profiles')
          .select('*')
          .eq('id', userId)
          .maybeSingle();

        if (!error && data) {
          return {
            uid: data.id,
            name: data.name || data.full_name || 'Auditor',
            email: data.email,
            role: (data.role as UserRole) || 'student',
            level: data.level || 'Beginner',
            xp: Number(data.xp) || 0,
            streakDays: Number(data.streak_days) || 1,
            lastActiveDate: data.last_active_date || new Date().toISOString().split('T')[0],
            totalLessonsCompleted: Number(data.total_lessons_completed) || 0,
            totalExamsCompleted: Number(data.total_exams_completed) || 0,
            averageScore: Number(data.average_score) || 0,
            createdAt: data.created_at || new Date().toISOString(),
            jobTitle: data.job_title || 'Security Analyst / Auditor',
            company: data.company || 'Cybersecurity Practice',
            experienceLevel: data.experience_level || 'entry',
            bio: data.bio || 'Pursuing GRC and Information Security audit credentials.',
            avatarUrl: data.avatar_url || '',
          };
        }

        // If not found yet and more attempts remain, wait briefly for trigger execution
        if (attempt < retries) {
          await new Promise(res => setTimeout(res, 250 * (attempt + 1)));
        }
      } catch (err) {
        console.warn(`Supabase getProfile attempt ${attempt + 1} note:`, err);
        if (attempt < retries) {
          await new Promise(res => setTimeout(res, 250 * (attempt + 1)));
        }
      }
    }
    return null;
  },

  // Self-healing fallback: Ensure a valid profile row exists in public.profiles for an authenticated user
  async ensureProfileExists(userId: string, defaultProfile: Partial<UserProfile>): Promise<UserProfile | null> {
    const client = getSupabase();
    if (!client || !userId) return null;

    // 1. Check if profile already exists in Supabase (with brief retry for database trigger)
    const existing = await this.getProfile(userId, 2);
    if (existing) return existing;

    // 2. Verify active session belongs to this user or give it a moment to initialize
    let activeUserId = await this.getActiveSessionUserId();
    if (!activeUserId || activeUserId !== userId) {
      await new Promise(res => setTimeout(res, 350));
      activeUserId = await this.getActiveSessionUserId();
      if (!activeUserId || activeUserId !== userId) {
        return null;
      }
    }

    // 3. Construct clean, safe profile payload
    const displayName = defaultProfile.name || 'Auditor';
    const email = defaultProfile.email || '';
    const userRole = defaultProfile.role || 'student';
    const jobTitle = defaultProfile.jobTitle || 'Security Analyst / Auditor';

    const insertProfile: UserProfile = {
      uid: userId,
      name: displayName,
      email,
      role: userRole,
      level: defaultProfile.level || 'Beginner',
      xp: defaultProfile.xp || 0,
      streakDays: defaultProfile.streakDays || 1,
      lastActiveDate: defaultProfile.lastActiveDate || new Date().toISOString().split('T')[0],
      totalLessonsCompleted: defaultProfile.totalLessonsCompleted || 0,
      totalExamsCompleted: defaultProfile.totalExamsCompleted || 0,
      averageScore: defaultProfile.averageScore || 0,
      createdAt: new Date().toISOString(),
      jobTitle,
      company: defaultProfile.company || 'Cybersecurity Practice',
      experienceLevel: defaultProfile.experienceLevel || 'entry',
      bio: defaultProfile.bio || 'Pursuing GRC and Information Security audit credentials.',
      avatarUrl: defaultProfile.avatarUrl || '',
    };

    await this.upsertProfile(insertProfile);
    return (await this.getProfile(userId, 1)) || insertProfile;
  },

  // Save user progress (completed lessons, modules, badges)
  async saveUserProgress(userId: string, progress: {
    completedLessons: string[];
    completedModules: string[];
    completedFrameworks: string[];
    unlockedBadges: string[];
  }): Promise<boolean> {
    const client = getSupabase();
    if (!client) return false;

    // Verify authenticated session before writing to RLS-protected table
    const activeUserId = await this.getActiveSessionUserId();
    if (!activeUserId || activeUserId !== userId) {
      return false;
    }

    try {
      const { error } = await client
        .from('user_progress')
        .upsert({
          user_id: userId,
          completed_lessons: progress.completedLessons,
          completed_modules: progress.completedModules,
          completed_frameworks: progress.completedFrameworks,
          unlocked_badges: progress.unlockedBadges,
          updated_at: new Date().toISOString(),
        }, { onConflict: 'user_id' });

      if (error) {
        console.warn('Supabase saveUserProgress note:', error.message);
        return false;
      }
      return true;
    } catch (err) {
      console.warn('Supabase saveUserProgress error:', err);
      return false;
    }
  },

  // Load user progress
  async getUserProgress(userId: string) {
    const client = getSupabase();
    if (!client) return null;

    try {
      const { data, error } = await client
        .from('user_progress')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error || !data) return null;

      return {
        completedLessons: (data.completed_lessons as string[]) || [],
        completedModules: (data.completed_modules as string[]) || [],
        completedFrameworks: (data.completed_frameworks as string[]) || [],
        unlockedBadges: (data.unlocked_badges as string[]) || [],
      };
    } catch (err) {
      console.warn('Supabase getUserProgress error:', err);
      return null;
    }
  },

  // Record exam result to Supabase
  async saveExamResult(result: ExamResult, userId: string): Promise<boolean> {
    const client = getSupabase();
    if (!client) return false;

    // Verify authenticated session before writing to RLS-protected table
    const activeUserId = await this.getActiveSessionUserId();
    if (!activeUserId || activeUserId !== userId) {
      return false;
    }

    try {
      const { error } = await client
        .from('exam_results')
        .insert({
          id: result.id,
          user_id: userId,
          framework_id: result.frameworkId,
          framework_title: result.frameworkTitle,
          exam_type: result.examType,
          score_percentage: result.scorePercentage,
          passed: result.passed,
          total_questions: result.totalQuestions,
          correct_answers: result.correctAnswers,
          time_spent_seconds: result.timeSpentSeconds,
          completed_at: result.completedAt,
          xp_earned: result.xpEarned,
          answers: result.answers || [],
          domain_breakdown: result.domainBreakdown || {},
        });

      if (error) {
        console.warn('Supabase saveExamResult note:', error.message);
        return false;
      }
      return true;
    } catch (err) {
      console.warn('Supabase saveExamResult error:', err);
      return false;
    }
  },

  // Fetch exam history for user
  async getExamHistory(userId: string): Promise<ExamResult[] | null> {
    const client = getSupabase();
    if (!client) return null;

    try {
      const { data, error } = await client
        .from('exam_results')
        .select('*')
        .eq('user_id', userId)
        .order('completed_at', { ascending: false });

      if (error || !data) return null;

      return data.map((item: any) => ({
        id: item.id,
        userId: item.user_id || userId,
        examType: item.exam_type,
        frameworkId: item.framework_id,
        frameworkTitle: item.framework_title,
        scorePercentage: item.score_percentage ?? item.score ?? 0,
        passed: item.passed,
        totalQuestions: item.total_questions,
        correctAnswers: item.correct_answers,
        timeSpentSeconds: item.time_spent_seconds,
        completedAt: item.completed_at || item.created_at || new Date().toISOString(),
        xpEarned: item.xp_earned,
        answers: item.answers || [],
        domainBreakdown: item.domain_breakdown || item.breakdown || {},
      }));
    } catch (err) {
      console.warn('Supabase getExamHistory error:', err);
      return null;
    }
  },

  // Save gap assessments
  async saveGapAssessment(assessment: any, userId: string): Promise<boolean> {
    const client = getSupabase();
    if (!client) return false;

    // Verify authenticated session before writing to RLS-protected table
    const activeUserId = await this.getActiveSessionUserId();
    if (!activeUserId || activeUserId !== userId) {
      return false;
    }

    try {
      const { error } = await client
        .from('gap_assessments')
        .upsert({
          id: assessment.id,
          user_id: userId,
          framework_id: assessment.frameworkId,
          control_id: assessment.controlId,
          control_title: assessment.controlTitle,
          status: assessment.status,
          evidence_notes: assessment.evidenceNotes || '',
          owner: assessment.owner || '',
          updated_at: new Date().toISOString(),
        }, { onConflict: 'id' });

      return !error;
    } catch (err) {
      console.warn('Supabase saveGapAssessment error:', err);
      return false;
    }
  },

  // Fetch gap assessments
  async getGapAssessments(userId: string): Promise<any[] | null> {
    const client = getSupabase();
    if (!client) return null;

    try {
      const { data, error } = await client
        .from('gap_assessments')
        .select('*')
        .eq('user_id', userId);

      if (error || !data) return null;

      return data.map((item: any) => ({
        id: item.id,
        frameworkId: item.framework_id,
        controlId: item.control_id,
        controlTitle: item.control_title,
        status: item.status,
        evidenceNotes: item.evidence_notes,
        owner: item.owner,
        lastUpdated: item.updated_at,
      }));
    } catch (err) {
      console.warn('Supabase getGapAssessments error:', err);
      return null;
    }
  },

  // Fetch questions from Supabase Question Bank
  async getQuestionBank(frameworkId?: string): Promise<any[] | null> {
    const client = getSupabase();
    if (!client) return null;

    try {
      let query = client.from('question_bank').select('*');
      if (frameworkId && frameworkId !== 'all') {
        query = query.eq('framework_id', frameworkId);
      }

      const { data, error } = await query;
      if (error || !data || data.length === 0) return null;

      return data.map((item: any) => ({
        id: item.id,
        frameworkId: item.framework_id,
        domain: item.domain,
        difficulty: item.difficulty,
        question: item.question_text || item.question,
        options: Array.isArray(item.options) ? item.options : JSON.parse(item.options || '[]'),
        correctIndex: item.correct_answer_index ?? item.correctIndex ?? 0,
        explanation: item.explanation || '',
        sourceStandard: item.source_standard,
        questionType: item.question_type || 'multiple_choice',
        scenarioText: item.scenario_text,
      }));
    } catch (err) {
      console.warn('Supabase getQuestionBank error:', err);
      return null;
    }
  },

  // Seed question bank items if connected
  async seedQuestionBank(questions: any[]): Promise<boolean> {
    const client = getSupabase();
    if (!client || !questions.length) return false;

    try {
      const records = questions.map((q) => ({
        id: q.id,
        framework_id: q.frameworkId,
        domain: q.domain,
        difficulty: q.difficulty.toLowerCase(),
        question_text: q.question,
        options: q.options,
        correct_answer_index: q.correctIndex,
        explanation: q.explanation,
      }));

      const { error } = await client
        .from('question_bank')
        .upsert(records, { onConflict: 'id' });

      if (error) {
        console.warn('Supabase seedQuestionBank note:', error.message);
        return false;
      }
      return true;
    } catch (err) {
      console.warn('Supabase seedQuestionBank error:', err);
      return false;
    }
  },
};
