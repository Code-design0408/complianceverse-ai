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
export const SUPABASE_SQL_SCHEMA = `-- C.V GRC & Cybersecurity Learning Platform - Supabase Database Schema
-- Copy and run this script inside your Supabase Project's SQL Editor (https://supabase.com/dashboard/project/_/sql)

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Create Profiles Table (Synced with Supabase Auth users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
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
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable RLS for Profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Profiles are viewable by everyone" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

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
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (
    id,
    name,
    email,
    role,
    level,
    xp,
    streak_days,
    total_lessons_completed,
    total_exams_completed,
    average_score,
    job_title
  )
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'role', 'student'),
    'Beginner',
    0,
    1,
    0,
    0,
    0,
    COALESCE(NEW.raw_user_meta_data->>'jobTitle', 'Compliance & Security Learner')
  )
  ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    role = EXCLUDED.role;

  INSERT INTO public.user_progress (
    user_id,
    completed_lessons,
    completed_modules,
    completed_frameworks,
    unlocked_badges
  )
  VALUES (
    NEW.id,
    '[]'::jsonb,
    '[]'::jsonb,
    '[]'::jsonb,
    '["badge-welcome"]'::jsonb
  )
  ON CONFLICT (user_id) DO NOTHING;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Indexes
CREATE INDEX IF NOT EXISTS idx_exam_results_user ON public.exam_results(user_id);
CREATE INDEX IF NOT EXISTS idx_gap_assessments_user ON public.gap_assessments(user_id);
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
            role: userData.role,
            jobTitle: userData.jobTitle || '',
          },
        },
      });

      if (error) throw error;

      // Also create/upsert profile record in public.profiles if user session is available
      if (data.user) {
        await supabaseDbService.upsertProfile({
          uid: data.user.id,
          name: userData.name,
          email: email,
          role: userData.role,
          level: 'Beginner',
          xp: 0,
          streakDays: 1,
          lastActiveDate: new Date().toISOString().split('T')[0],
          totalLessonsCompleted: 0,
          totalExamsCompleted: 0,
          averageScore: 0,
          createdAt: new Date().toISOString(),
          jobTitle: userData.jobTitle || 'Security Analyst / Auditor',
        }).catch(err => {
          // Non-blocking since the database trigger on_auth_user_created handles it automatically
          console.warn('Direct profile upsert attempt:', err);
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
      return data?.session?.user?.id || null;
    } catch {
      return null;
    }
  },

  // Save or update user profile
  async upsertProfile(profile: UserProfile): Promise<boolean> {
    const client = getSupabase();
    if (!client) return false;

    // Verify authenticated session before writing to RLS-protected table
    const activeUserId = await this.getActiveSessionUserId();
    if (!activeUserId || activeUserId !== profile.uid) {
      // Local/demo user or unauthenticated session; skip cloud write cleanly
      return false;
    }

    try {
      const { error } = await client
        .from('profiles')
        .upsert({
          id: profile.uid,
          name: profile.name,
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
          updated_at: new Date().toISOString(),
        }, { onConflict: 'id' });

      if (error) {
        console.warn('Supabase upsertProfile note:', error.message);
        return false;
      }
      return true;
    } catch (err) {
      console.warn('Supabase upsertProfile error:', err);
      return false;
    }
  },

  // Fetch user profile from Supabase
  async getProfile(userId: string): Promise<UserProfile | null> {
    const client = getSupabase();
    if (!client) return null;

    try {
      const { data, error } = await client
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error || !data) return null;

      return {
        uid: data.id,
        name: data.name,
        email: data.email,
        role: data.role || 'student',
        level: data.level || 'Beginner',
        xp: Number(data.xp) || 0,
        streakDays: Number(data.streak_days) || 1,
        lastActiveDate: data.last_active_date || new Date().toISOString().split('T')[0],
        totalLessonsCompleted: Number(data.total_lessons_completed) || 0,
        totalExamsCompleted: Number(data.total_exams_completed) || 0,
        averageScore: Number(data.average_score) || 0,
        createdAt: data.created_at || new Date().toISOString(),
        jobTitle: data.job_title,
        company: data.company,
        experienceLevel: data.experience_level,
        bio: data.bio,
      };
    } catch (err) {
      console.warn('Supabase getProfile error:', err);
      return null;
    }
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
};
