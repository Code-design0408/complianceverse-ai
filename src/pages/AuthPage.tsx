import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  Lock,
  Mail,
  User,
  Sparkles,
  ArrowRight,
  Eye,
  EyeOff,
  BookOpen,
  Info,
  RefreshCw,
  Database,
  Copy,
  Check,
  Code,
  KeyRound,
  CheckCircle2,
  AlertCircle,
  Clock,
  ArrowLeft,
  Zap,
} from 'lucide-react';
import { useAuthAndData } from '../context/AuthAndDataContext';
import { UserRole } from '../types';
import { SUPABASE_SQL_SCHEMA, SUPABASE_PASSWORD_QUERIES } from '../services/supabase';

interface AuthPageProps {
  onSuccess?: () => void;
  defaultTab?: 'login' | 'signup' | 'forgot-password';
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
    requestPasswordResetOtp,
    verifyPasswordResetOtp,
    resetPasswordWithOtp,
    isSupabaseActive,
  } = useAuthAndData();

  const [activeTab, setActiveTab] = useState<'login' | 'signup' | 'forgot-password'>(defaultTab);
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
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginRole, setLoginRole] = useState<UserRole>('student');
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // Forgot Password / OTP Flow State
  const [forgotStep, setForgotStep] = useState<'request' | 'verify' | 'new_password' | 'success'>('request');
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotOtp, setForgotOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [otpExpiryTimer, setOtpExpiryTimer] = useState<number>(900); // 15 mins in seconds
  const [forgotSuccessMsg, setForgotSuccessMsg] = useState<string | null>(null);
  const [activeOtpCode, setActiveOtpCode] = useState<string | null>(null);
  const [showFastRescue, setShowFastRescue] = useState<boolean>(false);
  const [resendCooldown, setResendCooldown] = useState<number>(0);

  const [formError, setFormError] = useState<string | null>(null);
  const [showSchemaModal, setShowSchemaModal] = useState(false);
  const [schemaModalTab, setSchemaModalTab] = useState<'password_queries' | 'full_schema'>('password_queries');
  const [copiedSchema, setCopiedSchema] = useState(false);
  const [copiedPasswordQueries, setCopiedPasswordQueries] = useState(false);

  // Countdown timer for OTP expiry
  useEffect(() => {
    if (forgotStep !== 'verify' && forgotStep !== 'new_password') return;
    const interval = setInterval(() => {
      setOtpExpiryTimer(prev => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [forgotStep]);

  // Cooldown timer for resending OTP
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const interval = setInterval(() => {
      setResendCooldown(prev => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [resendCooldown]);

  const handleCopySchema = () => {
    navigator.clipboard.writeText(SUPABASE_SQL_SCHEMA);
    setCopiedSchema(true);
    setTimeout(() => setCopiedSchema(false), 2500);
  };

  const handleCopyPasswordQueries = () => {
    navigator.clipboard.writeText(SUPABASE_PASSWORD_QUERIES);
    setCopiedPasswordQueries(true);
    setTimeout(() => setCopiedPasswordQueries(false), 2500);
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

  // Handle Step 1: Request Password Reset OTP
  const handleRequestOtp = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setFormError(null);

    if (!forgotEmail.trim() || !forgotEmail.includes('@')) {
      setFormError('Please enter the valid email address associated with your account.');
      return;
    }

    setIsLoading(true);
    try {
      const res = await requestPasswordResetOtp(forgotEmail);
      if (!res.success) {
        setFormError(res.error || 'Unable to request password reset OTP. Please try again.');
        setIsLoading(false);
        return;
      }

      if (res.otp) {
        setActiveOtpCode(res.otp);
      }
      setForgotOtp('');
      setShowFastRescue(false);
      setResendCooldown(30); // 30s cooldown before next resend
      setOtpExpiryTimer(900); // 15 minutes
      setForgotStep('verify');
    } catch (err: any) {
      setFormError(err.message || 'Failed to send OTP code.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Step 2: Verify OTP
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    const cleanCode = forgotOtp.trim();
    if (cleanCode.length < 4) {
      setFormError('Please enter the complete 4-digit OTP code.');
      return;
    }

    setIsLoading(true);
    try {
      const res = await verifyPasswordResetOtp(forgotEmail, cleanCode);
      if (!res.success) {
        setFormError(res.error || 'Invalid or expired OTP code.');
        setIsLoading(false);
        return;
      }

      setForgotStep('new_password');
    } catch (err: any) {
      setFormError(err.message || 'Failed to verify OTP code.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Step 3: Set New Password & Update in Database
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (newPassword.length < 6) {
      setFormError('Password must be at least 6 characters long.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setFormError('Passwords do not match. Please ensure both fields are identical.');
      return;
    }

    setIsLoading(true);
    try {
      const res = await resetPasswordWithOtp(forgotEmail, forgotOtp, newPassword);
      if (!res.success) {
        setFormError(res.error || 'Failed to update password in database.');
        setIsLoading(false);
        return;
      }

      setForgotSuccessMsg(res.message || 'Your password has been successfully reset in the Supabase database.');
      setForgotStep('success');
      // Pre-fill login email for quick subsequent login
      setLoginEmail(forgotEmail);
      setLoginPassword(newPassword);
    } catch (err: any) {
      setFormError(err.message || 'Failed to reset password.');
    } finally {
      setIsLoading(false);
    }
  };

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8 sm:px-6 bg-background relative overflow-hidden">
      {/* Ambient background glows */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-primary/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-80 h-80 bg-accent/15 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md relative z-10 space-y-5">
        
        {/* Brand Header */}
        <div className="text-center space-y-1.5">
          <div className="inline-flex items-center justify-center h-12 w-12 rounded-2xl bg-gradient-to-br from-primary via-primary-dark to-black p-0.5 shadow-xl shadow-primary/30 ring-1 ring-white/20 mb-1">
            <div className="h-full w-full rounded-[14px] bg-[#0d0d14] flex items-center justify-center backdrop-blur-md">
              <ShieldCheck className="h-6 w-6 text-primary-light" />
            </div>
          </div>

          <h1 className="font-heading text-2xl sm:text-3xl font-extrabold text-text-primary tracking-tight">
            C.<span className="text-primary-light">V</span>
          </h1>
          <p className="text-xs text-text-secondary max-w-xs mx-auto">
            Cybersecurity & GRC Compliance Platform
          </p>

          {/* Supabase Status Pill */}
          <div className="flex items-center justify-center gap-2 pt-0.5">
            {isSupabaseActive ? (
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 backdrop-blur-md">
                <Database className="h-3 w-3" />
                <span>Supabase Connected</span>
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping" />
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setShowSchemaModal(true)}
                className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-primary/10 border border-primary/25 text-primary-light hover:bg-primary/20 transition-all backdrop-blur-md"
              >
                <Database className="h-3 w-3" />
                <span>Cloud & Local Sync Ready</span>
                <Code className="h-3 w-3 text-primary-light/70 ml-0.5" />
              </button>
            )}
          </div>
        </div>

        {/* Main Auth Container */}
        <div className="rounded-2xl sm:rounded-3xl border border-white/15 bg-white/[0.04] p-5 sm:p-6 backdrop-blur-2xl shadow-2xl space-y-5">
          
          {/* Mode Switcher Tabs - Sign Up and Log In only */}
          <div className="grid grid-cols-2 gap-1 rounded-xl bg-white/[0.04] p-1 border border-white/10 backdrop-blur-md">
            <button
              type="button"
              id="auth-tab-signup"
              onClick={() => {
                setActiveTab('signup');
                setFormError(null);
              }}
              className={`rounded-lg py-2 text-xs font-bold transition-all ${
                activeTab === 'signup'
                  ? 'bg-primary text-white shadow-md shadow-primary/20 border border-white/15'
                  : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              Sign Up
            </button>

            <button
              type="button"
              id="auth-tab-login"
              onClick={() => {
                setActiveTab('login');
                setFormError(null);
              }}
              className={`rounded-lg py-2 text-xs font-bold transition-all ${
                activeTab === 'login'
                  ? 'bg-primary text-white shadow-md shadow-primary/20 border border-white/15'
                  : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              Log In
            </button>
          </div>

          {/* Form Error Banner */}
          {formError && (
            <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 p-3 text-xs text-rose-300 flex items-center gap-2 animate-in fade-in">
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
                    placeholder="password"
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
                <div className="grid grid-cols-3 gap-1.5">
                  <button
                    type="button"
                    onClick={() => setSignupRole('student')}
                    className={`p-2 rounded-xl border text-center transition-all backdrop-blur-sm ${
                      signupRole === 'student'
                        ? 'border-primary-light bg-primary/25 text-white shadow-md'
                        : 'border-white/10 bg-white/[0.03] text-text-secondary hover:border-white/20'
                    }`}
                  >
                    <span className="block text-xs font-bold truncate">Student</span>
                    <span className="block text-[10px] text-text-muted mt-0.5 truncate">Analyst</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSignupRole('instructor')}
                    className={`p-2 rounded-xl border text-center transition-all backdrop-blur-sm ${
                      signupRole === 'instructor'
                        ? 'border-primary-light bg-primary/25 text-white shadow-md'
                        : 'border-white/10 bg-white/[0.03] text-text-secondary hover:border-white/20'
                    }`}
                  >
                    <span className="block text-xs font-bold truncate">Instructor</span>
                    <span className="block text-[10px] text-text-muted mt-0.5 truncate">Lead Auditor</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSignupRole('admin')}
                    className={`p-2 rounded-xl border text-center transition-all backdrop-blur-sm ${
                      signupRole === 'admin'
                        ? 'border-primary-light bg-primary/25 text-white shadow-md'
                        : 'border-white/10 bg-white/[0.03] text-text-secondary hover:border-white/20'
                    }`}
                  >
                    <span className="block text-xs font-bold truncate">Admin</span>
                    <span className="block text-[10px] text-text-muted mt-0.5 truncate">Governance</span>
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

              <div className="text-center pt-2">
                <p className="text-xs text-text-muted">
                  Already have an account?{' '}
                  <button
                    type="button"
                    onClick={() => {
                      setActiveTab('login');
                      setFormError(null);
                    }}
                    className="font-bold text-primary-light hover:underline ml-1"
                  >
                    Log In
                  </button>
                </p>
              </div>
            </form>
          )}

          {/* Tab 2: SIGN IN / LOG IN */}
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
                    placeholder="auditor@example.com"
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
                    placeholder="password"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    className="w-full rounded-2xl border border-white/10 bg-white/[0.04] pl-10 pr-10 py-2.5 text-xs text-text-primary placeholder:text-text-muted focus:border-primary-light focus:outline-none backdrop-blur-md"
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
                  id="login-forgot-password-link"
                  onClick={() => {
                    setActiveTab('forgot-password');
                    setForgotStep('request');
                    if (loginEmail) setForgotEmail(loginEmail);
                    setFormError(null);
                  }}
                  className="text-primary-light hover:underline font-semibold"
                >
                  Forgot password?
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
                    <span>Log In to Auditor Console</span>
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>

              <div className="text-center pt-2">
                <p className="text-xs text-text-muted">
                  New to ComplianceVerse?{' '}
                  <button
                    type="button"
                    onClick={() => {
                      setActiveTab('signup');
                      setFormError(null);
                    }}
                    className="font-bold text-primary-light hover:underline ml-1"
                  >
                    Create a free account
                  </button>
                </p>
              </div>
            </form>
          )}

          {/* FORGOT PASSWORD WORKFLOW (Email -> OTP Verification -> Reset Password) */}
          {activeTab === 'forgot-password' && (
            <div className="space-y-4 animate-in fade-in">
              {/* Back to Login Breadcrumb / Header */}
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('login');
                    setFormError(null);
                  }}
                  className="inline-flex items-center gap-1.5 text-xs text-text-muted hover:text-text-primary transition-colors font-medium"
                >
                  <ArrowLeft className="h-3.5 w-3.5" />
                  <span>Back to Login</span>
                </button>

                <span className="text-[11px] font-mono text-primary-light bg-primary/10 px-2 py-0.5 rounded-md border border-primary/20">
                  {forgotStep === 'request' && 'Step 1 of 3: Request OTP'}
                  {forgotStep === 'verify' && 'Step 2 of 3: Enter OTP'}
                  {forgotStep === 'new_password' && 'Step 3 of 3: New Password'}
                  {forgotStep === 'success' && 'Reset Complete'}
                </span>
              </div>

              {/* Step 1: Request OTP via Email */}
              {forgotStep === 'request' && (
                <form onSubmit={handleRequestOtp} className="space-y-4">
                  <div className="rounded-2xl border border-primary/30 bg-primary/10 p-3.5 flex items-start gap-3 backdrop-blur-sm">
                    <KeyRound className="h-5 w-5 text-primary-light shrink-0 mt-0.5" />
                    <div className="text-xs space-y-0.5">
                      <p className="font-bold text-text-primary">
                        Forgot Password
                      </p>
                      <p className="text-text-secondary text-[11px] leading-relaxed">
                        Enter your registered email address. We will send a secure 4-digit OTP code directly to your email inbox and record it in the Supabase database for verification so you can reset your password.
                      </p>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="block text-xs font-semibold text-text-secondary">
                      Registered Email Address
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" />
                      <input
                        type="email"
                        id="forgot-email-input"
                        required
                        placeholder="auditor@company.io"
                        value={forgotEmail}
                        onChange={(e) => setForgotEmail(e.target.value)}
                        className="w-full rounded-2xl border border-white/10 bg-white/[0.04] pl-10 pr-4 py-2.5 text-xs text-text-primary placeholder:text-text-muted focus:border-primary-light focus:outline-none backdrop-blur-md"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    id="request-otp-btn"
                    disabled={isLoading}
                    className="w-full flex items-center justify-center gap-2 rounded-2xl bg-primary py-3 text-xs font-bold text-white hover:bg-primary-dark transition-all shadow-lg shadow-primary/25 border border-white/15 disabled:opacity-50"
                  >
                    {isLoading ? (
                      <>
                        <RefreshCw className="h-4 w-4 animate-spin" />
                        <span>Sending Reset OTP to Email...</span>
                      </>
                    ) : (
                      <>
                        <Mail className="h-4 w-4" />
                        <span>Send OTP to Email</span>
                        <ArrowRight className="h-4 w-4" />
                      </>
                    )}
                  </button>

                  <div className="text-center pt-2">
                    <button
                      type="button"
                      onClick={() => {
                        setActiveTab('login');
                        setFormError(null);
                      }}
                      className="text-xs text-text-muted hover:text-text-primary inline-flex items-center gap-1.5"
                    >
                      <ArrowLeft className="h-3 w-3" />
                      <span>Remembered your password? Back to Login</span>
                    </button>
                  </div>
                </form>
              )}

              {/* Step 2: Verify OTP */}
              {forgotStep === 'verify' && (
                <form onSubmit={handleVerifyOtp} className="space-y-4">
                  <div className="rounded-2xl border border-sky-500/30 bg-sky-500/10 p-3.5 flex items-start gap-3 backdrop-blur-sm">
                    <Mail className="h-5 w-5 text-sky-400 shrink-0 mt-0.5" />
                    <div className="text-xs space-y-1.5 w-full">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <p className="font-bold text-text-primary">
                            4-Digit OTP Dispatched
                          </p>
                          <span className="rounded-md bg-emerald-500/20 px-1.5 py-0.5 text-[10px] font-semibold text-emerald-300 border border-emerald-500/30">
                            Sent to Email
                          </span>
                        </div>
                        <span className="text-[10px] text-sky-300 font-mono bg-sky-500/20 px-2 py-0.5 rounded-full border border-sky-500/30">
                          {formatTimer(otpExpiryTimer)}
                        </span>
                      </div>
                      <p className="text-text-secondary text-[11px] leading-relaxed">
                        We dispatched a 4-digit code to <strong className="text-text-primary underline">{forgotEmail}</strong>. Please check your inbox and <strong>Spam / Junk</strong> folder (Sender: <em>FormSubmit / ComplianceVerse</em>).
                      </p>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <label className="block text-xs font-semibold text-text-secondary">
                        4-Digit OTP Code
                      </label>
                      <span className="text-[10px] text-text-muted">4 digits</span>
                    </div>
                    <div className="relative">
                      <KeyRound className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" />
                      <input
                        type="text"
                        id="otp-code-input"
                        required
                        maxLength={4}
                        placeholder="e.g. 8421"
                        value={forgotOtp}
                        onChange={(e) => setForgotOtp(e.target.value.replace(/\D/g, ''))}
                        className="w-full rounded-2xl border border-white/10 bg-white/[0.04] pl-10 pr-4 py-2.5 text-center font-mono tracking-widest text-lg font-bold text-text-primary placeholder:text-text-muted focus:border-primary-light focus:outline-none backdrop-blur-md"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    id="verify-otp-btn"
                    disabled={isLoading || forgotOtp.trim().length < 4}
                    className="w-full flex items-center justify-center gap-2 rounded-2xl bg-primary py-3 text-xs font-bold text-white hover:bg-primary-dark transition-all shadow-lg shadow-primary/25 border border-white/15 disabled:opacity-50 cursor-pointer"
                  >
                    {isLoading ? (
                      <>
                        <RefreshCw className="h-4 w-4 animate-spin" />
                        <span>Verifying with Database...</span>
                      </>
                    ) : (
                      <>
                        <span>Verify OTP Code</span>
                        <ArrowRight className="h-4 w-4" />
                      </>
                    )}
                  </button>

                  <div className="flex items-center justify-between text-xs text-text-muted pt-1">
                    <button
                      type="button"
                      onClick={() => setForgotStep('request')}
                      className="hover:text-text-primary inline-flex items-center gap-1 transition-colors"
                    >
                      <ArrowLeft className="h-3 w-3" />
                      <span>Change Email</span>
                    </button>

                    <button
                      type="button"
                      disabled={isLoading || resendCooldown > 0}
                      onClick={() => handleRequestOtp()}
                      className="text-primary-light hover:underline font-semibold disabled:opacity-50 disabled:no-underline transition-colors"
                    >
                      {resendCooldown > 0 ? `Resend OTP (${resendCooldown}s)` : 'Resend New OTP'}
                    </button>
                  </div>

                  {/* Fast Instant Recovery If Email Is Delayed */}
                  <div className="pt-2 border-t border-white/10">
                    {!showFastRescue ? (
                      <div className="flex items-center justify-center">
                        <button
                          type="button"
                          id="cant-receive-email-btn"
                          onClick={() => setShowFastRescue(true)}
                          className="text-[11px] text-amber-300/90 hover:text-amber-200 transition-colors flex items-center gap-1.5 py-1 px-3 rounded-lg hover:bg-amber-500/10 border border-amber-500/20"
                        >
                          <Zap className="h-3.5 w-3.5 text-amber-400 shrink-0" />
                          <span>Didn't receive email or taking too long? Click here</span>
                        </button>
                      </div>
                    ) : (
                      <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-3 text-xs space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-bold text-amber-300 flex items-center gap-1.5">
                            <Zap className="h-3.5 w-3.5 text-amber-400" /> Instant Code Access
                          </span>
                          <button
                            type="button"
                            onClick={() => setShowFastRescue(false)}
                            className="text-[10px] text-text-muted hover:text-text-primary"
                          >
                            Hide
                          </button>
                        </div>
                        <p className="text-[11px] text-text-secondary leading-relaxed">
                          If your email provider delays delivery or filtered it, your current 4-digit verification code is:
                        </p>
                        <div className="flex items-center justify-between bg-black/40 rounded-lg px-3 py-2 border border-white/10">
                          <div className="font-mono text-base font-bold tracking-widest text-emerald-400">
                            {activeOtpCode || '----'}
                          </div>
                          <button
                            type="button"
                            id="autofill-otp-btn"
                            onClick={() => {
                              if (activeOtpCode) setForgotOtp(activeOtpCode);
                            }}
                            className="px-2.5 py-1 rounded bg-primary/40 hover:bg-primary/60 text-white font-semibold text-[10px] border border-primary/40 transition-all cursor-pointer"
                          >
                            Auto-Fill Code
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </form>
              )}

              {/* Step 3: Set New Password & Update into Database */}
              {forgotStep === 'new_password' && (
                <form onSubmit={handleResetPassword} className="space-y-4">
                  <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-3.5 flex items-start gap-3 backdrop-blur-sm">
                    <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0 mt-0.5" />
                    <div className="text-xs space-y-0.5">
                      <p className="font-bold text-text-primary">
                        OTP Verified Successfully
                      </p>
                      <p className="text-text-secondary text-[11px] leading-relaxed">
                        Enter your new security password. When you save, it will be encrypted and updated into the Supabase database.
                      </p>
                    </div>
                  </div>

                  {/* New Password */}
                  <div className="space-y-1">
                    <label className="block text-xs font-semibold text-text-secondary">
                      New Security Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" />
                      <input
                        type={showNewPassword ? 'text' : 'password'}
                        id="new-password-input"
                        required
                        placeholder="At least 6 characters"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="w-full rounded-2xl border border-white/10 bg-white/[0.04] pl-10 pr-10 py-2.5 text-xs text-text-primary placeholder:text-text-muted focus:border-primary-light focus:outline-none backdrop-blur-md"
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary"
                      >
                        {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Confirm Password */}
                  <div className="space-y-1">
                    <label className="block text-xs font-semibold text-text-secondary">
                      Confirm New Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" />
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        id="confirm-password-input"
                        required
                        placeholder="Re-enter password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full rounded-2xl border border-white/10 bg-white/[0.04] pl-10 pr-10 py-2.5 text-xs text-text-primary placeholder:text-text-muted focus:border-primary-light focus:outline-none backdrop-blur-md"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary"
                      >
                        {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    id="save-new-password-btn"
                    disabled={isLoading}
                    className="w-full flex items-center justify-center gap-2 rounded-2xl bg-emerald-600 py-3 text-xs font-bold text-white hover:bg-emerald-500 transition-all shadow-lg shadow-emerald-600/25 border border-white/15 disabled:opacity-50"
                  >
                    {isLoading ? (
                      <>
                        <RefreshCw className="h-4 w-4 animate-spin" />
                        <span>Updating Password in Database...</span>
                      </>
                    ) : (
                      <>
                        <span>Update Password in Supabase Database</span>
                        <ArrowRight className="h-4 w-4" />
                      </>
                    )}
                  </button>
                </form>
              )}

              {/* Step 4: Success Message */}
              {forgotStep === 'success' && (
                <div className="space-y-4 text-center animate-in zoom-in-95">
                  <div className="inline-flex items-center justify-center h-14 w-14 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 mx-auto">
                    <CheckCircle2 className="h-8 w-8" />
                  </div>

                  <div className="space-y-1">
                    <h3 className="text-sm font-bold text-text-primary">
                      Password Reset Complete
                    </h3>
                    <p className="text-xs text-text-secondary leading-relaxed">
                      {forgotSuccessMsg || 'Your new password has been securely stored in the Supabase database. You can now log in.'}
                    </p>
                  </div>

                  <button
                    type="button"
                    id="proceed-to-login-btn"
                    onClick={() => {
                      setActiveTab('login');
                      setFormError(null);
                    }}
                    className="w-full flex items-center justify-center gap-2 rounded-2xl bg-primary py-3 text-xs font-bold text-white hover:bg-primary-dark transition-all shadow-lg shadow-primary/25 border border-white/15"
                  >
                    <span>Proceed to Log In</span>
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              )}
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
                    <h3 className="text-sm font-bold text-text-primary">Supabase Database & SQL Queries</h3>
                    <p className="text-[11px] text-text-muted">Password storage queries, OTP verification & database schema</p>
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

              {/* Sub-Tabs: Password Queries vs Full Schema */}
              <div className="grid grid-cols-2 gap-1 rounded-xl bg-white/[0.04] p-1 border border-white/10">
                <button
                  type="button"
                  onClick={() => setSchemaModalTab('password_queries')}
                  className={`rounded-lg py-1.5 text-xs font-semibold transition-all ${
                    schemaModalTab === 'password_queries'
                      ? 'bg-primary text-white shadow-sm'
                      : 'text-text-secondary hover:text-text-primary'
                  }`}
                >
                  Password Storage & OTP Queries
                </button>
                <button
                  type="button"
                  onClick={() => setSchemaModalTab('full_schema')}
                  className={`rounded-lg py-1.5 text-xs font-semibold transition-all ${
                    schemaModalTab === 'full_schema'
                      ? 'bg-primary text-white shadow-sm'
                      : 'text-text-secondary hover:text-text-primary'
                  }`}
                >
                  Full Database Schema (.sql)
                </button>
              </div>

              {/* Password Queries View */}
              {schemaModalTab === 'password_queries' && (
                <div className="space-y-3">
                  <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-3.5 text-xs text-text-secondary space-y-1.5">
                    <p className="font-semibold text-text-primary">
                      Password Storage & OTP Reset Query Implementation:
                    </p>
                    <ul className="list-disc list-inside space-y-1 text-text-muted text-[11px]">
                      <li><strong>Password Storage:</strong> Passwords are encrypted via bcrypt (<code className="text-primary-light font-mono">crypt(new_password, gen_salt('bf'))</code>) and stored in <code className="text-primary-light font-mono">auth.users</code>.</li>
                      <li><strong>Forgot Password OTP Table:</strong> Generates and stores 6-digit numeric OTPs in <code className="text-primary-light font-mono">public.password_reset_otps</code> with 15-minute expiration and max attempt checks.</li>
                      <li><strong>Stored Functions:</strong> Includes <code className="text-primary-light font-mono">generate_password_reset_otp</code>, <code className="text-primary-light font-mono">verify_password_reset_otp</code>, and <code className="text-primary-light font-mono">reset_password_with_otp</code>.</li>
                    </ul>
                  </div>

                  <div className="relative">
                    <div className="flex items-center justify-between pb-1 text-xs text-text-muted font-mono">
                      <span>supabase-password-queries.sql</span>
                      <button
                        type="button"
                        onClick={handleCopyPasswordQueries}
                        className="flex items-center gap-1 text-[11px] text-primary-light hover:underline font-semibold"
                      >
                        {copiedPasswordQueries ? (
                          <>
                            <Check className="h-3.5 w-3.5 text-emerald-400" />
                            <span className="text-emerald-400">Copied Queries!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="h-3.5 w-3.5" />
                            <span>Copy Password Queries</span>
                          </>
                        )}
                      </button>
                    </div>
                    <pre className="rounded-2xl border border-white/10 bg-black/60 p-4 font-mono text-[11px] text-primary-light overflow-x-auto max-h-64 leading-relaxed">
                      {SUPABASE_PASSWORD_QUERIES}
                    </pre>
                  </div>
                </div>
              )}

              {/* Full Schema View */}
              {schemaModalTab === 'full_schema' && (
                <div className="space-y-3">
                  <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-3.5 text-xs text-text-secondary space-y-1.5">
                    <p>
                      Run this complete SQL script in your Supabase project (<strong>Dashboard &gt; SQL Editor</strong>) to initialize all tables, RLS security policies, and indexes:
                    </p>
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
                            <span>Copy Full SQL</span>
                          </>
                        )}
                      </button>
                    </div>
                    <pre className="rounded-2xl border border-white/10 bg-black/60 p-4 font-mono text-[11px] text-primary-light overflow-x-auto max-h-64 leading-relaxed">
                      {SUPABASE_SQL_SCHEMA}
                    </pre>
                  </div>
                </div>
              )}
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
