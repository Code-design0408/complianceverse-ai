import React, { useState } from 'react';
import {
  ShieldCheck,
  Lock,
  Mail,
  User,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  Eye,
  EyeOff,
  UserCheck,
  BookOpen,
  Award,
  Zap,
  Info,
  RefreshCw,
  Layers,
  ChevronRight,
  Database,
  CloudCheck,
  Copy,
  Check,
  Terminal,
  Code
} from 'lucide-react';
import { useAuthAndData } from '../context/AuthAndDataContext';
import { UserRole } from '../types';
import { SUPABASE_SQL_SCHEMA } from '../services/supabase';

interface AuthPageProps {
  onSuccess?: () => void;
  defaultTab?: 'login' | 'signup' | 'demo';
  onExploreLanding?: () => void;
}

export const AuthPage: React.FC<AuthPageProps> = ({
  onSuccess,
  defaultTab = 'signup',
  onExploreLanding
}) => {
  const {
    signup,
    loginWithCredentials,
    loginAs,
    startFreshUser,
    isSupabaseActive,
    supabaseSyncStatus,
    lastCloudSyncTime,
  } = useAuthAndData();

  const [activeTab, setActiveTab] = useState<'login' | 'signup' | 'demo'>(defaultTab);
  const [isLoading, setIsLoading] = useState(false);

  // Sign Up Form State
  const [signupName, setSignupName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupRole, setSignupRole] = useState<UserRole>('student');
  const [targetFramework, setTargetFramework] = useState('soc2');
  const [startWithZero, setStartWithZero] = useState(true);
  const [showSignupPassword, setShowSignupPassword] = useState(false);

  // Sign In Form State
  const [loginEmail, setLoginEmail] = useState('alex.vance@example-cloud.io');
  const [loginPassword, setLoginPassword] = useState('AuditorPass2026!');
  const [loginRole, setLoginRole] = useState<UserRole>('student');
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  const [formError, setFormError] = useState<string | null>(null);
  const [showSchemaModal, setShowSchemaModal] = useState(false);
  const [copiedSchema, setCopiedSchema] = useState(false);

  const handleCopySchema = () => {
    navigator.clipboard.writeText(SUPABASE_SQL_SCHEMA);
    setCopiedSchema(true);
    setTimeout(() => setCopiedSchema(false), 2500);
  };

  // Handle Signup
  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!signupName.trim()) {
      setFormError('Please enter your full name');
      return;
    }
    if (!signupEmail.trim() || !signupEmail.includes('@')) {
      setFormError('Please enter a valid work or academic email address');
      return;
    }
    if (signupPassword.length < 6) {
      setFormError('Password must be at least 6 characters');
      return;
    }

    setIsLoading(true);
    try {
      const res = await signup(signupName, signupEmail, signupRole, startWithZero, signupPassword);
      if (!res.success) {
        setFormError(res.error || 'Failed to create account');
        setIsLoading(false);
        return;
      }
      if (onSuccess) onSuccess();
    } catch (err: any) {
      setFormError(err.message || 'An error occurred during sign up');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Login
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!loginEmail.trim() || !loginEmail.includes('@')) {
      setFormError('Please enter a valid email address');
      return;
    }

    setIsLoading(true);
    try {
      const res = await loginWithCredentials(loginEmail, loginRole, loginPassword);
      if (!res.success) {
        setFormError(res.error || 'Failed to sign in. Please verify your credentials.');
        setIsLoading(false);
        return;
      }
      if (onSuccess) onSuccess();
    } catch (err: any) {
      setFormError(err.message || 'An error occurred during login');
    } finally {
      setIsLoading(false);
    }
  };

  // Quick 1-Click Persona
  const handleSelectPersona = (role: UserRole, name?: string, email?: string, fresh: boolean = false) => {
    if (fresh) {
      startFreshUser(role, name || 'New Auditor', email || 'auditor@example.com');
    } else {
      loginAs(role, name, email);
    }
    if (onSuccess) onSuccess();
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 sm:px-6 lg:px-8 bg-background relative overflow-hidden">
      {/* Ambient background glows */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-96 h-96 bg-accent/15 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-2xl relative z-10 space-y-6">
        
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center h-14 w-14 rounded-2xl bg-gradient-to-br from-primary via-primary-dark to-black p-0.5 shadow-xl shadow-primary/30 ring-1 ring-white/20 mb-2">
            <div className="h-full w-full rounded-[14px] bg-[#0d0d14] flex items-center justify-center backdrop-blur-md">
              <ShieldCheck className="h-7 w-7 text-primary-light" />
            </div>
          </div>

          <h1 className="font-heading text-3xl sm:text-4xl font-extrabold text-text-primary tracking-tight">
            C.<span className="text-primary-light">V</span>
          </h1>
          <p className="text-xs sm:text-sm text-text-secondary max-w-md mx-auto">
            Cybersecurity & GRC Compliance Certification Platform
          </p>

          {/* Supabase Status Pill */}
          <div className="flex items-center justify-center gap-2 pt-1">
            {isSupabaseActive ? (
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 backdrop-blur-md">
                <Database className="h-3.5 w-3.5" />
                <span>Supabase Database & Auth Connected</span>
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping" />
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setShowSchemaModal(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold bg-primary/10 border border-primary/25 text-primary-light hover:bg-primary/20 transition-all backdrop-blur-md"
              >
                <Database className="h-3.5 w-3.5" />
                <span>Supabase Ready (Local & Cloud Sync)</span>
                <Code className="h-3 w-3 text-primary-light/70 ml-0.5" />
              </button>
            )}
          </div>
        </div>

        {/* Main Auth Container */}
        <div className="rounded-3xl border border-white/15 bg-white/[0.04] p-6 sm:p-8 backdrop-blur-2xl shadow-2xl space-y-6">
          
          {/* Mode Switcher Tabs */}
          <div className="grid grid-cols-3 gap-1 rounded-2xl bg-white/[0.04] p-1 border border-white/10 backdrop-blur-md">
            <button
              type="button"
              id="auth-tab-signup"
              onClick={() => {
                setActiveTab('signup');
                setFormError(null);
              }}
              className={`rounded-xl py-2.5 text-xs font-bold transition-all ${
                activeTab === 'signup'
                  ? 'bg-primary text-white shadow-md shadow-primary/20 border border-white/15'
                  : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              Sign Up (Start Fresh)
            </button>

            <button
              type="button"
              id="auth-tab-login"
              onClick={() => {
                setActiveTab('login');
                setFormError(null);
              }}
              className={`rounded-xl py-2.5 text-xs font-bold transition-all ${
                activeTab === 'login'
                  ? 'bg-primary text-white shadow-md shadow-primary/20 border border-white/15'
                  : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              Sign In
            </button>

            <button
              type="button"
              id="auth-tab-demo"
              onClick={() => {
                setActiveTab('demo');
                setFormError(null);
              }}
              className={`rounded-xl py-2.5 text-xs font-bold transition-all ${
                activeTab === 'demo'
                  ? 'bg-primary text-white shadow-md shadow-primary/20 border border-white/15'
                  : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              1-Click Demo
            </button>
          </div>

          {/* Form Error Banner */}
          {formError && (
            <div className="rounded-2xl border border-rose-500/30 bg-rose-500/10 p-3 text-xs text-rose-300 flex items-center gap-2 animate-in fade-in">
              <Info className="h-4 w-4 shrink-0 text-rose-400" />
              <span>{formError}</span>
            </div>
          )}

          {/* Tab 1: SIGN UP (NEW USER STARTS WITH 0) */}
          {activeTab === 'signup' && (
            <form onSubmit={handleSignupSubmit} className="space-y-4 animate-in fade-in">
              
              {/* Fresh Start Callout */}
              <div className="rounded-2xl border border-primary/30 bg-primary/10 p-3.5 flex items-start gap-3 backdrop-blur-sm">
                <Sparkles className="h-4 w-4 text-primary-light shrink-0 mt-0.5 animate-pulse" />
                <div className="text-xs space-y-0.5">
                  <p className="font-bold text-text-primary">
                    New Auditor Zero-Baseline Setup
                  </p>
                  <p className="text-text-secondary text-[11px] leading-relaxed">
                    By default, new accounts start at <strong>0 XP, 0 completed lessons, 0% framework readiness</strong> so you can track genuine learning progress from Day 0.
                  </p>
                </div>
              </div>

              {/* Full Name */}
              <div className="space-y-1">
                <label className="block text-xs font-semibold text-text-secondary">
                  Full Legal / Professional Name
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" />
                  <input
                    type="text"
                    id="signup-name-input"
                    required
                    placeholder="e.g. Jordan Hayes"
                    value={signupName}
                    onChange={(e) => setSignupName(e.target.value)}
                    className="w-full rounded-2xl border border-white/10 bg-white/[0.04] pl-10 pr-4 py-2.5 text-xs text-text-primary placeholder:text-text-muted focus:border-primary-light focus:outline-none backdrop-blur-md"
                  />
                </div>
              </div>

              {/* Email */}
              <div className="space-y-1">
                <label className="block text-xs font-semibold text-text-secondary">
                  Corporate / Academic Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" />
                  <input
                    type="email"
                    id="signup-email-input"
                    required
                    placeholder="jordan.hayes@company.io"
                    value={signupEmail}
                    onChange={(e) => setSignupEmail(e.target.value)}
                    className="w-full rounded-2xl border border-white/10 bg-white/[0.04] pl-10 pr-4 py-2.5 text-xs text-text-primary placeholder:text-text-muted focus:border-primary-light focus:outline-none backdrop-blur-md"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-1">
                <label className="block text-xs font-semibold text-text-secondary">
                  Security Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" />
                  <input
                    type={showSignupPassword ? 'text' : 'password'}
                    id="signup-password-input"
                    required
                    placeholder="Create a strong password (min. 6 chars)"
                    value={signupPassword}
                    onChange={(e) => setSignupPassword(e.target.value)}
                    className="w-full rounded-2xl border border-white/10 bg-white/[0.04] pl-10 pr-10 py-2.5 text-xs text-text-primary placeholder:text-text-muted focus:border-primary-light focus:outline-none backdrop-blur-md"
                  />
                  <button
                    type="button"
                    onClick={() => setShowSignupPassword(!showSignupPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary"
                  >
                    {showSignupPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {/* Role Selection */}
              <div className="space-y-1.5 pt-1">
                <label className="block text-xs font-semibold text-text-secondary">
                  Select Auditor Profile & Role
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setSignupRole('student')}
                    className={`p-3 rounded-2xl border text-left transition-all backdrop-blur-sm ${
                      signupRole === 'student'
                        ? 'border-primary-light bg-primary/25 text-white shadow-md'
                        : 'border-white/10 bg-white/[0.03] text-text-secondary hover:border-white/20'
                    }`}
                  >
                    <span className="block text-xs font-bold">Student / Analyst</span>
                    <span className="block text-[10px] text-text-muted mt-0.5">Learn & prepare for exams</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSignupRole('instructor')}
                    className={`p-3 rounded-2xl border text-left transition-all backdrop-blur-sm ${
                      signupRole === 'instructor'
                        ? 'border-primary-light bg-primary/25 text-white shadow-md'
                        : 'border-white/10 bg-white/[0.03] text-text-secondary hover:border-white/20'
                    }`}
                  >
                    <span className="block text-xs font-bold">Lead Auditor</span>
                    <span className="block text-[10px] text-text-muted mt-0.5">Author tests & audit metrics</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSignupRole('admin')}
                    className={`p-3 rounded-2xl border text-left transition-all backdrop-blur-sm ${
                      signupRole === 'admin'
                        ? 'border-primary-light bg-primary/25 text-white shadow-md'
                        : 'border-white/10 bg-white/[0.03] text-text-secondary hover:border-white/20'
                    }`}
                  >
                    <span className="block text-xs font-bold">Administrator</span>
                    <span className="block text-[10px] text-text-muted mt-0.5">Full platform governance</span>
                  </button>
                </div>
              </div>

              {/* Primary Target Framework */}
              <div className="space-y-1">
                <label className="block text-xs font-semibold text-text-secondary">
                  Primary Target Framework
                </label>
                <select
                  value={targetFramework}
                  onChange={(e) => setTargetFramework(e.target.value)}
                  className="w-full rounded-2xl border border-white/10 bg-[#0f0f14] px-3.5 py-2.5 text-xs text-text-primary focus:border-primary-light focus:outline-none backdrop-blur-md"
                >
                  <option value="soc2">SOC 2 Type II (Trust Services Criteria)</option>
                  <option value="iso27001">ISO/IEC 27001:2022 (ISMS & Annex A)</option>
                  <option value="nist">NIST CSF 2.0 (Cybersecurity Framework)</option>
                  <option value="hipaa">HIPAA Security & Privacy Rules</option>
                  <option value="pci">PCI-DSS v4.0 (Payment Card Security)</option>
                  <option value="gdpr">GDPR (EU General Data Protection Regulation)</option>
                </select>
              </div>

              {/* Start with 0 Toggle (Mandatory / Checked by Default) */}
              <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/[0.03] border border-white/10 backdrop-blur-sm">
                <input
                  type="checkbox"
                  id="start-with-zero-checkbox"
                  checked={startWithZero}
                  onChange={(e) => setStartWithZero(e.target.checked)}
                  className="h-4 w-4 rounded text-primary focus:ring-primary-light border-white/20 bg-white/5 cursor-pointer"
                />
                <label htmlFor="start-with-zero-checkbox" className="text-xs cursor-pointer select-none">
                  <span className="font-bold text-text-primary block">
                    Initialize with 0 Progress (Clean Slate)
                  </span>
                  <span className="text-[11px] text-text-muted block">
                    Start at Level 1, 0 XP, and empty completion history.
                  </span>
                </label>
              </div>

              {/* Submit button */}
              <button
                type="submit"
                id="signup-submit-btn"
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-2 rounded-2xl bg-primary py-3 text-xs font-bold text-white hover:bg-primary-dark transition-all shadow-lg shadow-primary/25 border border-white/15 mt-2 disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="h-4 w-4 animate-spin" />
                    <span>Connecting to Supabase Auth...</span>
                  </>
                ) : (
                  <>
                    <span>Create Account & Start Learning</span>
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </form>
          )}

          {/* Tab 2: SIGN IN (EXISTING USER) */}
          {activeTab === 'login' && (
            <form onSubmit={handleLoginSubmit} className="space-y-4 animate-in fade-in">
              
              {/* Email */}
              <div className="space-y-1">
                <label className="block text-xs font-semibold text-text-secondary">
                  Auditor Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" />
                  <input
                    type="email"
                    id="login-email-input"
                    required
                    placeholder="alex.vance@example-cloud.io"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    className="w-full rounded-2xl border border-white/10 bg-white/[0.04] pl-10 pr-4 py-2.5 text-xs text-text-primary placeholder:text-text-muted focus:border-primary-light focus:outline-none backdrop-blur-md"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-1">
                <label className="block text-xs font-semibold text-text-secondary">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" />
                  <input
                    type={showLoginPassword ? 'text' : 'password'}
                    id="login-password-input"
                    required
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    className="w-full rounded-2xl border border-white/10 bg-white/[0.04] pl-10 pr-10 py-2.5 text-xs text-text-primary focus:border-primary-light focus:outline-none backdrop-blur-md"
                  />
                  <button
                    type="button"
                    onClick={() => setShowLoginPassword(!showLoginPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary"
                  >
                    {showLoginPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {/* Role Selection for Login */}
              <div className="space-y-1">
                <label className="block text-xs font-semibold text-text-secondary">
                  Role Session Type
                </label>
                <select
                  value={loginRole}
                  onChange={(e) => setLoginRole(e.target.value as UserRole)}
                  className="w-full rounded-2xl border border-white/10 bg-[#0f0f14] px-3.5 py-2.5 text-xs text-text-primary focus:border-primary-light focus:outline-none backdrop-blur-md"
                >
                  <option value="student">Student / GRC Analyst</option>
                  <option value="instructor">Instructor / Lead Auditor</option>
                  <option value="admin">Platform Administrator</option>
                </select>
              </div>

              <div className="flex items-center justify-between text-xs text-text-muted">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="h-3.5 w-3.5 rounded text-primary focus:ring-primary border-white/20 bg-white/5"
                  />
                  <span>Remember this session</span>
                </label>

                <button
                  type="button"
                  onClick={() => handleSelectPersona('student', 'New Auditor', 'auditor@example.com', true)}
                  className="text-primary-light hover:underline font-semibold"
                >
                  Or Start Fresh with 0 XP
                </button>
              </div>

              {/* Submit */}
              <button
                type="submit"
                id="login-submit-btn"
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-2 rounded-2xl bg-primary py-3 text-xs font-bold text-white hover:bg-primary-dark transition-all shadow-lg shadow-primary/25 border border-white/15 mt-2 disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="h-4 w-4 animate-spin" />
                    <span>Signing in via Supabase...</span>
                  </>
                ) : (
                  <>
                    <span>Sign In to Auditor Console</span>
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </form>
          )}

          {/* Tab 3: 1-CLICK DEMO PERSONAS */}
          {activeTab === 'demo' && (
            <div className="space-y-3 animate-in fade-in">
              <p className="text-xs text-text-secondary">
                Select a simulated auditor persona to immediately explore C.V without manual sign up:
              </p>

              {/* Persona 1: Clean Slate (0 Progress) */}
              <button
                type="button"
                id="demo-fresh-user-btn"
                onClick={() => handleSelectPersona('student', 'Taylor Reed', 'taylor.reed@auditor.io', true)}
                className="w-full flex items-center justify-between p-3.5 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 hover:bg-emerald-500/15 hover:border-emerald-500/50 transition-all text-left group backdrop-blur-sm"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                    <Sparkles className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-text-primary">Taylor Reed (Fresh User)</span>
                      <span className="rounded-full bg-emerald-500/20 px-2 py-0.2 text-[9px] font-bold text-emerald-300 uppercase">
                        0 XP Baseline
                      </span>
                    </div>
                    <p className="text-[11px] text-text-muted">
                      Start with clean 0 lessons, 0 exams, and 0% progress
                    </p>
                  </div>
                </div>
                <ChevronRight className="h-4 w-4 text-emerald-400 group-hover:translate-x-1 transition-transform" />
              </button>

              {/* Persona 2: Alex Vance (Standard Student) */}
              <button
                type="button"
                onClick={() => handleSelectPersona('student', 'Alex Vance', 'alex.vance@example-cloud.io', false)}
                className="w-full flex items-center justify-between p-3.5 rounded-2xl border border-white/10 bg-white/[0.03] hover:bg-white/[0.07] hover:border-primary-light/40 transition-all text-left group backdrop-blur-sm"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/20 text-primary-light border border-primary/30">
                    <User className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-text-primary">Alex Vance</span>
                      <span className="rounded-full bg-white/10 px-2 py-0.2 text-[9px] font-bold text-text-muted uppercase">
                        Student (150 XP)
                      </span>
                    </div>
                    <p className="text-[11px] text-text-muted">
                      3 completed lessons, 1 passed SOC 2 exam
                    </p>
                  </div>
                </div>
                <ChevronRight className="h-4 w-4 text-text-muted group-hover:text-primary-light group-hover:translate-x-1 transition-all" />
              </button>

              {/* Persona 3: Dr. Marcus Reyes (Lead Auditor / Instructor) */}
              <button
                type="button"
                onClick={() => handleSelectPersona('instructor', 'Dr. Marcus Reyes, CISA', 'marcus.reyes@grc-academy.edu', false)}
                className="w-full flex items-center justify-between p-3.5 rounded-2xl border border-white/10 bg-white/[0.03] hover:bg-white/[0.07] hover:border-primary-light/40 transition-all text-left group backdrop-blur-sm"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/20 text-primary-light border border-primary/30">
                    <UserCheck className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-text-primary">Dr. Marcus Reyes, CISA</span>
                      <span className="rounded-full bg-primary/20 text-primary-light px-2 py-0.2 text-[9px] font-bold uppercase">
                        Instructor / Lead Auditor
                      </span>
                    </div>
                    <p className="text-[11px] text-text-muted">
                      Access to Question Bank Editor and Analytics
                    </p>
                  </div>
                </div>
                <ChevronRight className="h-4 w-4 text-text-muted group-hover:text-primary-light group-hover:translate-x-1 transition-all" />
              </button>

              {/* Persona 4: Sarah Chen (Admin) */}
              <button
                type="button"
                onClick={() => handleSelectPersona('admin', 'Sarah Chen', 'admin.sarah@cv.internal', false)}
                className="w-full flex items-center justify-between p-3.5 rounded-2xl border border-white/10 bg-white/[0.03] hover:bg-white/[0.07] hover:border-primary-light/40 transition-all text-left group backdrop-blur-sm"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-accent/20 text-accent-light border border-accent/30">
                    <ShieldCheck className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-text-primary">Sarah Chen</span>
                      <span className="rounded-full bg-accent/20 text-accent-light px-2 py-0.2 text-[9px] font-bold uppercase">
                        Platform Admin
                      </span>
                    </div>
                    <p className="text-[11px] text-text-muted">
                      Full system administration and user management
                    </p>
                  </div>
                </div>
                <ChevronRight className="h-4 w-4 text-text-muted group-hover:text-primary-light group-hover:translate-x-1 transition-all" />
              </button>
            </div>
          )}

        </div>

        {/* Explore Public Overview / Landing Option */}
        {onExploreLanding && (
          <div className="text-center pt-1">
            <button
              type="button"
              id="auth-explore-landing-btn"
              onClick={onExploreLanding}
              className="inline-flex items-center gap-2 text-xs font-semibold text-text-secondary hover:text-primary-light transition-all hover:underline"
            >
              <BookOpen className="h-3.5 w-3.5 text-primary-light" />
              <span>Want to learn more first? View Public Platform Overview</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        )}

        {/* Supabase Schema Helper Modal */}
        {showSchemaModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in">
            <div className="w-full max-w-2xl rounded-3xl border border-white/15 bg-[#0d0d14] p-6 shadow-2xl space-y-4 max-h-[85vh] overflow-y-auto">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-primary/20 text-primary-light border border-primary/30">
                    <Database className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-text-primary">Supabase Database Setup</h3>
                    <p className="text-[11px] text-text-muted">Table schemas and RLS security policies</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setShowSchemaModal(false)}
                  className="rounded-xl border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-text-muted hover:text-white"
                >
                  Close
                </button>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-4 text-xs text-text-secondary space-y-2">
                <p>
                  To sync user progress, profiles, exam results, and gap assessments to your own Supabase project:
                </p>
                <ol className="list-decimal list-inside space-y-1 text-text-muted text-[11px]">
                  <li>Go to your project at <strong>supabase.com</strong></li>
                  <li>Open the <strong>SQL Editor</strong> in the left sidebar</li>
                  <li>Click <strong>New Query</strong>, paste the schema below, and click <strong>Run</strong></li>
                  <li>Set <code className="text-primary-light font-mono">VITE_SUPABASE_URL</code> & <code className="text-primary-light font-mono">VITE_SUPABASE_ANON_KEY</code> in project secrets</li>
                </ol>
              </div>

              <div className="relative">
                <div className="flex items-center justify-between pb-1 text-xs text-text-muted font-mono">
                  <span>supabase-schema.sql</span>
                  <button
                    type="button"
                    onClick={handleCopySchema}
                    className="flex items-center gap-1 text-[11px] text-primary-light hover:underline font-semibold"
                  >
                    {copiedSchema ? (
                      <>
                        <Check className="h-3.5 w-3.5 text-emerald-400" />
                        <span className="text-emerald-400">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="h-3.5 w-3.5" />
                        <span>Copy SQL</span>
                      </>
                    )}
                  </button>
                </div>
                <pre className="rounded-2xl border border-white/10 bg-black/60 p-4 font-mono text-[11px] text-primary-light overflow-x-auto max-h-60 leading-relaxed">
                  {SUPABASE_SQL_SCHEMA}
                </pre>
              </div>
            </div>
          </div>
        )}

        {/* Security & Compliance Attestation Footer */}
        <div className="text-center text-[11px] text-text-muted flex items-center justify-center gap-2">
          <ShieldCheck className="h-3.5 w-3.5 text-primary-light" />
          <span>Protected by SOC 2 Type II & ISO/IEC 27001 Compliance Standards Simulation</span>
        </div>

      </div>
    </div>
  );
};
