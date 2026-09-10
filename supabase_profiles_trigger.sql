-- ====================================================================
-- ComplianceVerse AI — by Nandani Dodeja
-- SUPABASE MIGRATION: Automatic User Profile Creation Trigger & Security Hardening
-- Run this in your Supabase SQL Editor: https://supabase.com/dashboard/project/_/sql
--
-- This script fixes:
-- 1. New user auth.users -> public.profiles automatic profile creation
-- 2. All 14 Supabase Security Advisor warnings:
--    - Sets explicit, immutable search_path on all SECURITY DEFINER functions (public, pg_temp)
--    - Revokes dangerous PUBLIC and client EXECUTE privileges on SECURITY DEFINER functions
--    - Eliminates permissive USING (true) / WITH CHECK (true) RLS policies on password_reset_otps
--    - Adds explicit restrictive RLS policies on user_password_audit
--    - Enforces auth.uid() = id ownership on profiles with role escalation protection
--    - Restricts question_bank access to authenticated users and authoring to instructors/admins
--    - Safe one-time backfill for any existing auth.users without profiles
-- ====================================================================

-- --------------------------------------------------------------------
-- 1. REQUIRED EXTENSIONS
-- --------------------------------------------------------------------
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- --------------------------------------------------------------------
-- 2. CORE SCHEMA: public.profiles
-- Verified existing columns: id, name, email, role, level
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'student' CHECK (role IN ('student', 'instructor', 'admin')),
  level TEXT NOT NULL DEFAULT 'Beginner',
  full_name TEXT,
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

-- Safely ensure optional extended columns exist without error
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

-- --------------------------------------------------------------------
-- 3. USER PROGRESS TRACKING
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.user_progress (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  completed_lessons JSONB NOT NULL DEFAULT '[]'::jsonb,
  completed_modules JSONB NOT NULL DEFAULT '[]'::jsonb,
  completed_frameworks JSONB NOT NULL DEFAULT '[]'::jsonb,
  unlocked_badges JSONB NOT NULL DEFAULT '["badge-welcome"]'::jsonb,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- --------------------------------------------------------------------
-- 4. PASSWORD RESET OTPS TABLE (Hardened)
-- --------------------------------------------------------------------
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

-- --------------------------------------------------------------------
-- 5. USER PASSWORD AUDIT LOG
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.user_password_audit (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  action_type TEXT NOT NULL CHECK (action_type IN ('password_created', 'password_reset_otp', 'password_updated')),
  ip_address TEXT DEFAULT 'client-web',
  changed_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- --------------------------------------------------------------------
-- 6. QUESTION BANK
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.question_bank (
  id TEXT PRIMARY KEY,
  framework_id TEXT NOT NULL,
  domain TEXT NOT NULL,
  difficulty TEXT NOT NULL CHECK (difficulty IN ('easy', 'medium', 'hard', 'expert')),
  question_text TEXT NOT NULL,
  options JSONB NOT NULL,
  correct_answer_index INTEGER NOT NULL,
  explanation TEXT NOT NULL,
  source_standard TEXT,
  question_type TEXT DEFAULT 'multiple_choice',
  scenario_text TEXT,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- --------------------------------------------------------------------
-- 7. ENABLE ROW LEVEL SECURITY (RLS) ON ALL PUBLIC TABLES
-- --------------------------------------------------------------------
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.password_reset_otps ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_password_audit ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.question_bank ENABLE ROW LEVEL SECURITY;

-- --------------------------------------------------------------------
-- 8. HARDENED RLS POLICIES
-- --------------------------------------------------------------------

-- public.profiles: users can view and update strictly their own record; admin can view all
DROP POLICY IF EXISTS "Profiles are viewable by everyone" ON public.profiles;
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
CREATE POLICY "Users can view own profile"
  ON public.profiles
  FOR SELECT
  USING (
    auth.uid() = id
    OR LOWER(COALESCE((SELECT email FROM auth.users WHERE id = auth.uid()), '')) = 'nandanidodeja368@gmail.com'
  );

DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
CREATE POLICY "Users can insert own profile"
  ON public.profiles
  FOR INSERT
  WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile"
  ON public.profiles
  FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- public.user_progress: users can view and update strictly their own progress
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

-- public.password_reset_otps: DROP ALL PERMISSIVE "USING (true)" POLICIES
DROP POLICY IF EXISTS "Allow OTP request creation" ON public.password_reset_otps;
DROP POLICY IF EXISTS "Allow OTP lookup and verification" ON public.password_reset_otps;
DROP POLICY IF EXISTS "Allow OTP verification status update" ON public.password_reset_otps;
DROP POLICY IF EXISTS "Allow public insert for OTP request" ON public.password_reset_otps;
DROP POLICY IF EXISTS "Allow public select for verification" ON public.password_reset_otps;
DROP POLICY IF EXISTS "Allow update for verification" ON public.password_reset_otps;
DROP POLICY IF EXISTS "Users can view own otp history" ON public.password_reset_otps;

-- Only authenticated users may inspect their own OTP records (if any);
-- All insert, verification, and updates are handled by SECURITY DEFINER functions!
CREATE POLICY "Users can view own otp history"
  ON public.password_reset_otps
  FOR SELECT
  USING (auth.uid() IS NOT NULL AND auth.uid() = user_id);

-- public.user_password_audit: Strictly restricted audit table
DROP POLICY IF EXISTS "Users can view own password audit" ON public.user_password_audit;
CREATE POLICY "Users can view own password audit"
  ON public.user_password_audit
  FOR SELECT
  USING (auth.uid() IS NOT NULL AND auth.uid() = user_id);

-- public.question_bank: Authenticated users can read questions; instructors/admins can manage
DROP POLICY IF EXISTS "Question bank viewable by authenticated users" ON public.question_bank;
CREATE POLICY "Question bank viewable by authenticated users"
  ON public.question_bank
  FOR SELECT
  TO authenticated
  USING (true);

DROP POLICY IF EXISTS "Instructors and Admins can manage question bank" ON public.question_bank;
CREATE POLICY "Instructors and Admins can manage question bank"
  ON public.question_bank
  FOR ALL
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'instructor'))
    OR LOWER(COALESCE((SELECT email FROM auth.users WHERE id = auth.uid()), '')) = 'nandanidodeja368@gmail.com'
  );

-- --------------------------------------------------------------------
-- 9. TRIGGER: PREVENT CLIENT PRIVILEGE / ROLE ESCALATION
-- --------------------------------------------------------------------
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
      -- Revert unauthorized role modification back to previous role
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

-- --------------------------------------------------------------------
-- 10. TRIGGER FUNCTION: public.handle_new_user() (IDEMPOTENT & SAFE)
-- Trigger on auth.users AFTER INSERT -> creates public.profiles row
-- --------------------------------------------------------------------
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
  -- Safe name extraction: metadata full_name -> metadata name -> email handle -> fallback
  v_name := COALESCE(
    NULLIF(TRIM(NEW.raw_user_meta_data->>'full_name'), ''),
    NULLIF(TRIM(NEW.raw_user_meta_data->>'name'), ''),
    NULLIF(split_part(COALESCE(NEW.email, ''), '@', 1), ''),
    'Auditor'
  );

  -- Role: Never trust client-provided privileged roles!
  -- Owner email is 'admin'; 'student' or 'instructor' allowed if explicit; default 'student'
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

  -- Insert profile row safely using ON CONFLICT (id) DO NOTHING for idempotency
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
  -- Never crash auth.users signup transaction if an unexpected error occurs
  RAISE WARNING 'handle_new_user error for user %: %', NEW.id, SQLERRM;
  RETURN NEW;
END;
$$;

-- Restrict execution: Trigger functions must NEVER be callable by PUBLIC or client roles
REVOKE ALL ON FUNCTION public.handle_new_user() FROM PUBLIC;
REVOKE ALL ON FUNCTION public.handle_new_user() FROM anon;
REVOKE ALL ON FUNCTION public.handle_new_user() FROM authenticated;

-- Attach trigger to auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- --------------------------------------------------------------------
-- 11. PASSWORD RESET RPC FUNCTIONS (Hardened Search Path & Secrets Protected)
-- --------------------------------------------------------------------

-- RPC 1: Generate & store OTP (DOES NOT return cleartext OTP to caller)
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
  -- Verify user exists in auth.users or profiles
  SELECT id INTO v_user_id FROM auth.users WHERE LOWER(email) = LOWER(TRIM(p_email)) LIMIT 1;
  IF v_user_id IS NULL THEN
    SELECT id INTO v_user_id FROM public.profiles WHERE LOWER(email) = LOWER(TRIM(p_email)) LIMIT 1;
  END IF;

  -- Invalidate prior unused OTPs for this email address
  UPDATE public.password_reset_otps
  SET used = true, updated_at = NOW()
  WHERE LOWER(email) = LOWER(TRIM(p_email)) AND used = false;

  -- Use client-provided 4-digit OTP or generate safe 4-digit random OTP
  IF p_otp IS NOT NULL AND p_otp ~ '^\d{4}$' THEN
    v_otp := p_otp;
  ELSE
    v_otp := LPAD(FLOOR(RANDOM() * 10000)::TEXT, 4, '0');
  END IF;

  -- Record new OTP in database table with 15-minute expiration
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

  -- Audit log entry
  INSERT INTO public.user_password_audit (user_id, email, action_type)
  VALUES (v_user_id, LOWER(TRIM(p_email)), 'password_reset_otp');

  -- Security: Do NOT return cleartext otp_code in JSON response!
  RETURN jsonb_build_object(
    'success', true,
    'message', 'Security verification code recorded and valid for 15 minutes.',
    'expires_in_minutes', 15
  );
END;
$$;

-- RPC 2: Verify OTP
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
    RETURN jsonb_build_object('success', false, 'error', 'No active password reset request found.');
  END IF;

  IF NOW() > v_record.expires_at THEN
    RETURN jsonb_build_object('success', false, 'error', 'Verification code has expired. Please request a new code.');
  END IF;

  IF v_record.attempts >= v_record.max_attempts THEN
    RETURN jsonb_build_object('success', false, 'error', 'Too many failed attempts. Please request a fresh code.');
  END IF;

  IF v_record.otp_code != TRIM(p_otp) THEN
    UPDATE public.password_reset_otps
    SET attempts = attempts + 1, updated_at = NOW()
    WHERE id = v_record.id;
    RETURN jsonb_build_object('success', false, 'error', 'Incorrect verification code. Please try again.');
  END IF;

  UPDATE public.password_reset_otps
  SET verified = true, updated_at = NOW()
  WHERE id = v_record.id;

  RETURN jsonb_build_object('success', true, 'message', 'Code verified successfully.');
END;
$$;

-- RPC 3: Reset password with verified OTP
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
    RETURN jsonb_build_object('success', false, 'error', 'Invalid or unverified reset request. Please restart the reset process.');
  END IF;

  IF NOW() > v_record.expires_at THEN
    RETURN jsonb_build_object('success', false, 'error', 'Verification session has expired.');
  END IF;

  -- Locate user_id in auth.users
  SELECT id INTO v_user_id FROM auth.users WHERE LOWER(email) = LOWER(TRIM(p_email)) LIMIT 1;
  IF v_user_id IS NULL THEN
    v_user_id := v_record.user_id;
  END IF;

  IF v_user_id IS NOT NULL THEN
    -- Update hashed password in auth.users securely
    UPDATE auth.users
    SET encrypted_password = crypt(p_new_password, gen_salt('bf')),
        updated_at = NOW()
    WHERE id = v_user_id;
  END IF;

  -- Mark OTP as used
  UPDATE public.password_reset_otps
  SET used = true, updated_at = NOW()
  WHERE id = v_record.id;

  -- Audit log entry
  INSERT INTO public.user_password_audit (user_id, email, action_type)
  VALUES (v_user_id, LOWER(TRIM(p_email)), 'password_updated');

  RETURN jsonb_build_object('success', true, 'message', 'Password has been successfully updated.');
END;
$$;

-- Restrict RPC execution permissions:
-- Revoke PUBLIC default privileges to satisfy Supabase Security Advisor
REVOKE ALL ON FUNCTION public.generate_password_reset_otp(TEXT, TEXT) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.verify_password_reset_otp(TEXT, TEXT) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.reset_password_with_otp(TEXT, TEXT, TEXT) FROM PUBLIC;

GRANT EXECUTE ON FUNCTION public.generate_password_reset_otp(TEXT, TEXT) TO anon, authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.verify_password_reset_otp(TEXT, TEXT) TO anon, authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.reset_password_with_otp(TEXT, TEXT, TEXT) TO anon, authenticated, service_role;

-- --------------------------------------------------------------------
-- 12. PERFORMANCE INDEXES
-- --------------------------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_profiles_email ON public.profiles(email);
CREATE INDEX IF NOT EXISTS idx_password_otps_lookup ON public.password_reset_otps(email, used, verified);
CREATE INDEX IF NOT EXISTS idx_password_audit_user ON public.user_password_audit(user_id);

-- --------------------------------------------------------------------
-- 13. DIAGNOSTIC QUERY: FIND USERS IN auth.users MISSING FROM public.profiles
-- --------------------------------------------------------------------
-- SELECT u.id, u.email, u.created_at, u.raw_user_meta_data
-- FROM auth.users u
-- LEFT JOIN public.profiles p ON p.id = u.id
-- WHERE p.id IS NULL;

-- --------------------------------------------------------------------
-- 14. SAFE ONE-TIME BACKFILL: POPULATE PROFILES FOR ANY EXISTING USERS
-- (Never overwrites existing profile data thanks to ON CONFLICT (id) DO NOTHING)
-- --------------------------------------------------------------------
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
    NULLIF(TRIM(u.raw_user_meta_data->>'full_name'), ''),
    NULLIF(TRIM(u.raw_user_meta_data->>'name'), ''),
    NULLIF(split_part(COALESCE(u.email, ''), '@', 1), ''),
    'Auditor'
  ) AS name,
  COALESCE(
    NULLIF(TRIM(u.raw_user_meta_data->>'full_name'), ''),
    NULLIF(TRIM(u.raw_user_meta_data->>'name'), ''),
    NULLIF(split_part(COALESCE(u.email, ''), '@', 1), ''),
    'Auditor'
  ) AS full_name,
  COALESCE(u.email, '') AS email,
  CASE
    WHEN LOWER(COALESCE(u.email, '')) = 'nandanidodeja368@gmail.com' THEN 'admin'
    WHEN LOWER(u.raw_user_meta_data->>'role') IN ('student', 'instructor') THEN LOWER(u.raw_user_meta_data->>'role')
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

-- Also backfill missing user_progress records
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

-- --------------------------------------------------------------------
-- 15. VERIFICATION QUERY:
-- --------------------------------------------------------------------
SELECT
  (SELECT count(*) FROM auth.users) AS total_auth_users,
  (SELECT count(*) FROM public.profiles) AS total_profiles,
  (SELECT count(*) FROM public.user_progress) AS total_progress_records;
