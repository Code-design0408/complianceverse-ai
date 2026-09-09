import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  ShieldAlert,
  ShieldCheck,
  Search,
  CheckCircle2,
  Trash2,
  RefreshCw,
  UserCheck,
  Award,
  BookOpen,
  Database,
  FileQuestion,
  X,
  Lock,
  Unlock,
  KeyRound,
  Download,
  Users,
  Activity,
  AlertTriangle,
  HelpCircle,
  Eye,
  FileDown,
  ChevronDown,
  ChevronRight,
  Filter,
  Check,
  Clock,
  Sparkles,
  Zap,
  Plus,
  ArrowRight,
  UserX,
  ExternalLink
} from 'lucide-react';
import { useAuthAndData } from '../context/AuthAndDataContext';
import { UserActivityLog, TrackedUserSummary, AdminTelemetryStats, ActivityCategory, UserRole, QuestionItem } from '../types';
import { activityLogger, MASTER_ADMIN_EMAIL } from '../services/activityLogger';

export const AdminPage: React.FC = () => {
  const {
    user,
    role,
    loginAs,
    questions,
    addCustomQuestion,
    resetToDemoData,
    frameworks,
    isMasterAdmin,
    isMasterAdminUnlocked,
    unlockMasterAdmin,
    lockMasterAdmin,
    loginAsMasterAdmin,
  } = useAuthAndData();

  // Active Admin Sub-Tab
  const [activeTab, setActiveTab] = useState<'activity' | 'users' | 'questions' | 'simulator'>('activity');

  // Master Admin Passcode Modal / Gate state
  const [passcodeAttempt, setPasscodeAttempt] = useState('');
  const [passcodeError, setPasscodeError] = useState('');
  const [isVerifyingOwner, setIsVerifyingOwner] = useState(false);

  // Activity stream state
  const [activities, setActivities] = useState<UserActivityLog[]>([]);
  const [totalActivitiesCount, setTotalActivitiesCount] = useState(0);
  const [isLoadingActivities, setIsLoadingActivities] = useState(false);
  const [autoRefreshEnabled, setAutoRefreshEnabled] = useState(true);
  const [lastRefreshedAt, setLastRefreshedAt] = useState<Date>(new Date());

  // Activity filter states
  const [activitySearch, setActivitySearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedUserFilter, setSelectedUserFilter] = useState<string>('all');
  const [selectedActionFilter, setSelectedActionFilter] = useState<string>('all');
  const [activeLogDetail, setActiveLogDetail] = useState<UserActivityLog | null>(null);

  // Users management state
  const [trackedUsers, setTrackedUsers] = useState<TrackedUserSummary[]>([]);
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);
  const [userSearch, setUserSearch] = useState('');
  const [updatingUserEmail, setUpdatingUserEmail] = useState<string | null>(null);

  // Telemetry stats
  const [telemetryStats, setTelemetryStats] = useState<AdminTelemetryStats>({
    totalUsers: 5,
    totalActivities: 0,
    examsCompleted: 0,
    examsCanceled: 0,
    aiQueriesCount: 0,
    averagePassRate: 85,
    todayActivitiesCount: 0,
  });

  // Question Management State
  const [questionSearch, setQuestionSearch] = useState('');
  const [selectedFwFilter, setSelectedFwFilter] = useState('all');
  const [showAddQuestionModal, setShowAddQuestionModal] = useState(false);
  const [newFwId, setNewFwId] = useState(frameworks[0]?.id || 'soc2');
  const [newQuestionText, setNewQuestionText] = useState('');
  const [newDomain, setNewDomain] = useState('Logical Access');
  const [newOptions, setNewOptions] = useState(['', '', '', '']);
  const [newCorrectIdx, setNewCorrectIdx] = useState(0);
  const [newExplanation, setNewExplanation] = useState('');
  const [newDifficulty, setNewDifficulty] = useState<'Beginner' | 'Intermediate' | 'Advanced'>('Intermediate');

  const pollIntervalRef = useRef<any>(null);

  // Load telemetry stats
  const fetchStats = useCallback(async () => {
    try {
      const stats = await activityLogger.getStats();
      setTelemetryStats(stats);
    } catch (err) {
      console.warn('Failed to fetch stats:', err);
    }
  }, []);

  // Load activities
  const fetchActivities = useCallback(async (showLoading = false) => {
    if (showLoading) setIsLoadingActivities(true);
    try {
      const res = await activityLogger.getActivities({
        search: activitySearch,
        category: selectedCategory,
        userEmail: selectedUserFilter === 'all' ? undefined : selectedUserFilter,
        action: selectedActionFilter === 'all' ? undefined : selectedActionFilter,
        limit: 150,
      });
      setActivities(res.activities);
      setTotalActivitiesCount(res.totalCount);
      setLastRefreshedAt(new Date());
    } catch (err) {
      console.warn('Failed to fetch activities:', err);
    } finally {
      if (showLoading) setIsLoadingActivities(false);
    }
  }, [activitySearch, selectedCategory, selectedUserFilter, selectedActionFilter]);

  // Load tracked users
  const fetchUsers = useCallback(async (showLoading = false) => {
    if (showLoading) setIsLoadingUsers(true);
    try {
      const usersList = await activityLogger.getUsers();
      setTrackedUsers(usersList);
    } catch (err) {
      console.warn('Failed to fetch users:', err);
    } finally {
      if (showLoading) setIsLoadingUsers(false);
    }
  }, []);

  // Initial load
  useEffect(() => {
    fetchStats();
    fetchActivities(true);
    fetchUsers(true);
  }, [fetchStats, fetchActivities, fetchUsers]);

  // Auto-refresh interval (every 6 seconds)
  useEffect(() => {
    if (autoRefreshEnabled) {
      pollIntervalRef.current = setInterval(() => {
        fetchActivities(false);
        fetchStats();
      }, 6000);
    } else if (pollIntervalRef.current) {
      clearInterval(pollIntervalRef.current);
    }

    return () => {
      if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
    };
  }, [autoRefreshEnabled, fetchActivities, fetchStats]);

  // Handle owner unlock
  const handleUnlockPasscode = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setPasscodeError('');

    if (
      passcodeAttempt.trim() === 'admin2026' ||
      passcodeAttempt.trim() === 'cv-master-2026' ||
      passcodeAttempt.trim().toLowerCase() === 'nandani'
    ) {
      unlockMasterAdmin(passcodeAttempt.trim());
      setPasscodeAttempt('');
    } else {
      setPasscodeError('Invalid administrative passcode. Enter "admin2026" or authenticate as Nandani Dodeja.');
    }
  };

  const handleOneClickOwnerAuth = () => {
    setIsVerifyingOwner(true);
    setTimeout(() => {
      loginAsMasterAdmin();
      setIsVerifyingOwner(false);
    }, 400);
  };

  // Toggle user status (Active vs Suspended)
  const handleToggleUserStatus = async (userItem: TrackedUserSummary) => {
    const nextStatus = userItem.status === 'suspended' ? 'active' : 'suspended';
    setUpdatingUserEmail(userItem.email);
    try {
      const ok = await activityLogger.setUserStatus(userItem.email, nextStatus);
      if (ok) {
        setTrackedUsers((prev) =>
          prev.map((u) => (u.email === userItem.email ? { ...u, status: nextStatus } : u))
        );
        fetchActivities(false);
      }
    } finally {
      setUpdatingUserEmail(null);
    }
  };

  // Filter activities specifically by user
  const handleInspectUserActivities = (email: string) => {
    setSelectedUserFilter(email);
    setActiveTab('activity');
  };

  // Purge activities
  const handleClearActivities = async () => {
    if (!window.confirm('Are you sure you want to purge all user activity logs? This will wipe the audit trail.')) {
      return;
    }
    const ok = await activityLogger.clearActivities(MASTER_ADMIN_EMAIL);
    if (ok) {
      setActivities([]);
      setTotalActivitiesCount(0);
      fetchStats();
    }
  };

  // Export Activities to CSV
  const handleExportCSV = () => {
    if (activities.length === 0) return;
    const headers = ['ID', 'Timestamp', 'User Email', 'User Name', 'User Role', 'Category', 'Action', 'Summary', 'IP Address'];
    const rows = activities.map((a) => [
      `"${a.id}"`,
      `"${a.timestamp}"`,
      `"${a.userEmail}"`,
      `"${a.userName}"`,
      `"${a.userRole}"`,
      `"${a.category}"`,
      `"${a.action}"`,
      `"${a.summary.replace(/"/g, '""')}"`,
      `"${a.ipAddress || '127.0.0.1'}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `complianceverse_activity_audit_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Export Activities to JSON
  const handleExportJSON = () => {
    if (activities.length === 0) return;
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(activities, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `complianceverse_audit_log_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Question Creation Handler
  const handleCreateQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQuestionText || newOptions.some((o) => !o.trim())) return;

    addCustomQuestion({
      frameworkId: newFwId,
      question: newQuestionText,
      domain: newDomain,
      options: newOptions,
      correctIndex: newCorrectIdx,
      explanation: newExplanation,
      difficulty: newDifficulty,
    });

    setNewQuestionText('');
    setNewOptions(['', '', '', '']);
    setNewExplanation('');
    setShowAddQuestionModal(false);
  };

  const handleOptionChange = (idx: number, val: string) => {
    const next = [...newOptions];
    next[idx] = val;
    setNewOptions(next);
  };

  const filteredQuestions = questions.filter((q) => {
    const matchesSearch =
      q.question.toLowerCase().includes(questionSearch.toLowerCase()) ||
      q.domain.toLowerCase().includes(questionSearch.toLowerCase());
    const matchesFw = selectedFwFilter === 'all' || q.frameworkId === selectedFwFilter;
    return matchesSearch && matchesFw;
  });

  const filteredUsers = trackedUsers.filter((u) => {
    if (!userSearch) return true;
    const q = userSearch.toLowerCase();
    return u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q) || u.role.toLowerCase().includes(q);
  });

  // Color mappings for activity category
  const getCategoryBadge = (category: ActivityCategory) => {
    switch (category) {
      case 'exam':
        return 'bg-amber-500/15 border-amber-500/30 text-amber-300';
      case 'ai':
        return 'bg-purple-500/15 border-purple-500/30 text-purple-300';
      case 'learning':
        return 'bg-blue-500/15 border-blue-500/30 text-blue-300';
      case 'auth':
        return 'bg-emerald-500/15 border-emerald-500/30 text-emerald-300';
      case 'compliance':
        return 'bg-rose-500/15 border-rose-500/30 text-rose-300';
      case 'admin':
        return 'bg-indigo-500/15 border-indigo-500/30 text-indigo-300';
      default:
        return 'bg-white/10 border-white/20 text-white';
    }
  };

  // Helper for formatting relative time
  const formatRelativeTime = (timestamp: string) => {
    try {
      const diffMs = Date.now() - new Date(timestamp).getTime();
      const diffSec = Math.floor(diffMs / 1000);
      if (diffSec < 60) return `${diffSec}s ago`;
      const diffMin = Math.floor(diffSec / 60);
      if (diffMin < 60) return `${diffMin}m ago`;
      const diffHours = Math.floor(diffMin / 60);
      if (diffHours < 24) return `${diffHours}h ago`;
      return new Date(timestamp).toLocaleDateString();
    } catch {
      return timestamp;
    }
  };

  // ==========================================
  // MASTER ADMIN ACCESS GATE
  // ==========================================
  const isOwnerAccessGranted = isMasterAdmin || isMasterAdminUnlocked;

  if (!isOwnerAccessGranted) {
    return (
      <div className="mx-auto max-w-4xl px-4 sm:px-6 py-12 animate-in fade-in duration-300">
        <div className="relative rounded-3xl border border-primary/30 bg-neutral-950/80 p-6 sm:p-10 shadow-2xl backdrop-blur-2xl overflow-hidden">
          
          {/* Ambient Glow */}
          <div className="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-primary/20 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-purple-600/15 blur-3xl pointer-events-none" />

          <div className="relative z-10 space-y-6">
            
            {/* Header / Lock badge */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
              <div className="flex items-center gap-3.5">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-primary via-primary-dark to-black p-0.5 shadow-lg shadow-primary/30">
                  <div className="flex h-full w-full items-center justify-center rounded-[14px] bg-[#0d0d14]">
                    <Lock className="h-6 w-6 text-primary-light animate-pulse" />
                  </div>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="font-heading text-xl sm:text-2xl font-extrabold text-text-primary">
                      Owner-Only Administrative Console
                    </h2>
                    <span className="rounded-full bg-primary/20 border border-primary/30 px-2.5 py-0.5 text-[10px] font-extrabold text-primary-light uppercase tracking-wider">
                      PRIVATE
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-text-muted mt-0.5">
                    Restricted platform supervision: managed solely by the application owner.
                  </p>
                </div>
              </div>
            </div>

            {/* Explanatory Callout */}
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 space-y-3">
              <div className="flex items-start gap-3">
                <ShieldCheck className="h-5 w-5 text-primary-light shrink-0 mt-0.5" />
                <div className="text-xs text-text-secondary leading-relaxed space-y-2">
                  <p>
                    <strong className="text-text-primary">Welcome, Owner.</strong> This console is built to give you omniscient visibility across all your registered learners and visitors.
                  </p>
                  <p>
                    Once authenticated, you will be able to monitor:
                  </p>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-text-muted pt-1">
                    <li className="flex items-center gap-1.5">
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                      <span><strong>Real-time User Activity Logs</strong> (Live stream)</span>
                    </li>
                    <li className="flex items-center gap-1.5">
                      <CheckCircle2 className="h-3.5 w-3.5 text-amber-400 shrink-0" />
                      <span><strong>Exam Cancellations & Exit Diagnostics</strong></span>
                    </li>
                    <li className="flex items-center gap-1.5">
                      <CheckCircle2 className="h-3.5 w-3.5 text-purple-400 shrink-0" />
                      <span><strong>Comply AI Interactions & Scenarios</strong></span>
                    </li>
                    <li className="flex items-center gap-1.5">
                      <CheckCircle2 className="h-3.5 w-3.5 text-blue-400 shrink-0" />
                      <span><strong>User Directory & Status (Active / Suspend)</strong></span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Owner Authorization Card */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              
              {/* Option 1: 1-Click Authenticate as Owner */}
              <div className="rounded-2xl border border-primary/30 bg-primary/10 p-5 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Award className="h-4 w-4 text-primary-light" />
                    <h3 className="font-bold text-sm text-text-primary">Authenticate as Owner</h3>
                  </div>
                  <p className="text-xs text-text-muted">
                    Sign in with the verified platform administrator email:
                  </p>
                  <div className="rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-xs font-mono text-primary-light truncate">
                    {MASTER_ADMIN_EMAIL}
                  </div>
                </div>

                <button
                  onClick={handleOneClickOwnerAuth}
                  disabled={isVerifyingOwner}
                  className="flex items-center justify-center gap-2 rounded-xl bg-primary hover:bg-primary-dark text-white text-xs font-bold py-2.5 px-4 transition-all shadow-lg shadow-primary/25 disabled:opacity-50"
                >
                  {isVerifyingOwner ? (
                    <RefreshCw className="h-4 w-4 animate-spin" />
                  ) : (
                    <Unlock className="h-4 w-4" />
                  )}
                  <span>Authenticate & Enter Console</span>
                </button>
              </div>

              {/* Option 2: Enter Master Passcode */}
              <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-5 flex flex-col justify-between space-y-4">
                <form onSubmit={handleUnlockPasscode} className="space-y-3">
                  <div className="flex items-center gap-2">
                    <KeyRound className="h-4 w-4 text-accent-light" />
                    <h3 className="font-bold text-sm text-text-primary">Master Passcode Unlock</h3>
                  </div>
                  <p className="text-xs text-text-muted">
                    Enter the master override security passcode to unlock full access:
                  </p>
                  
                  <div>
                    <input
                      type="password"
                      value={passcodeAttempt}
                      onChange={(e) => setPasscodeAttempt(e.target.value)}
                      placeholder="Enter security passcode (e.g. admin2026)"
                      className="w-full rounded-xl border border-white/15 bg-black/40 px-3 py-2 text-xs text-text-primary placeholder:text-text-muted focus:border-primary-light focus:outline-none font-mono"
                    />
                    {passcodeError && (
                      <p className="text-[11px] text-rose-400 mt-1.5 flex items-center gap-1">
                        <AlertTriangle className="h-3 w-3 shrink-0" />
                        <span>{passcodeError}</span>
                      </p>
                    )}
                  </div>

                  <button
                    type="submit"
                    className="w-full flex items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/10 hover:bg-white/15 text-text-primary text-xs font-bold py-2.5 px-4 transition-all"
                  >
                    <Unlock className="h-3.5 w-3.5" />
                    <span>Unlock with Passcode</span>
                  </button>
                </form>
              </div>

            </div>

          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // UNLOCKED MASTER ADMIN CONSOLE VIEW
  // ==========================================
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-6 animate-in fade-in duration-300">
      
      {/* Top Banner: Master Admin Verification Status */}
      <div className="rounded-2xl border border-emerald-500/30 bg-gradient-to-r from-emerald-950/40 via-neutral-900/60 to-black/80 px-4 sm:px-6 py-3.5 backdrop-blur-xl shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-400 ring-1 ring-emerald-500/40">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs sm:text-sm font-extrabold text-white">
                Master Administrator Session Active
              </span>
              <span className="rounded-full bg-emerald-500/20 border border-emerald-500/40 px-2 py-0.5 text-[9px] font-bold text-emerald-300 uppercase tracking-wide">
                OWNER ONLY
              </span>
            </div>
            <p className="text-[11px] text-text-muted flex items-center gap-1.5">
              <span>Managed by: <strong>{MASTER_ADMIN_EMAIL}</strong></span>
              <span>•</span>
              <span className="inline-flex items-center gap-1 text-emerald-400">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping" />
                Live Audit Telemetry Connected
              </span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto">
          <button
            onClick={lockMasterAdmin}
            className="flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 hover:bg-rose-500/20 hover:border-rose-500/30 px-3 py-1.5 text-xs text-text-muted hover:text-rose-300 transition-all"
            title="Lock administrative console"
          >
            <Lock className="h-3.5 w-3.5" />
            <span>Lock Console</span>
          </button>
        </div>
      </div>

      {/* Main Header & Actions */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 border-b border-border/40 pb-5">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary/20 text-primary-light">
              <ShieldAlert className="h-4 w-4" />
            </div>
            <h1 className="font-heading text-2xl sm:text-3xl font-extrabold text-text-primary tracking-tight">
              Administrative Control Center
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-text-muted mt-1">
            Omniscient oversight into user activities, exam cancellations, learning completions, and AI queries.
          </p>
        </div>

        {/* Global Action Toolbar */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Auto refresh toggle */}
          <button
            onClick={() => setAutoRefreshEnabled(!autoRefreshEnabled)}
            className={`flex items-center gap-1.5 rounded-xl border px-3 py-2 text-xs font-semibold transition-all ${
              autoRefreshEnabled
                ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-300'
                : 'border-white/10 bg-white/5 text-text-muted hover:text-text-primary'
            }`}
          >
            <span className={`h-2 w-2 rounded-full ${autoRefreshEnabled ? 'bg-emerald-400 animate-pulse' : 'bg-gray-500'}`} />
            <span>Auto-Refresh: {autoRefreshEnabled ? 'ON (6s)' : 'PAUSED'}</span>
          </button>

          {/* Manual refresh button */}
          <button
            onClick={() => {
              fetchActivities(true);
              fetchUsers(true);
              fetchStats();
            }}
            disabled={isLoadingActivities}
            className="flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-text-primary px-3 py-2 text-xs font-semibold transition-all"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isLoadingActivities ? 'animate-spin text-primary-light' : ''}`} />
            <span>Refresh Feed</span>
          </button>

          {/* Export options */}
          <div className="flex items-center rounded-xl border border-white/10 bg-white/5 p-0.5">
            <button
              onClick={handleExportCSV}
              className="flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs text-text-secondary hover:text-text-primary hover:bg-white/10 transition-all font-medium"
              title="Export all logs to CSV file"
            >
              <Download className="h-3.5 w-3.5" />
              <span>CSV</span>
            </button>
            <button
              onClick={handleExportJSON}
              className="flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs text-text-secondary hover:text-text-primary hover:bg-white/10 transition-all font-medium"
              title="Export all logs to JSON file"
            >
              <FileDown className="h-3.5 w-3.5" />
              <span>JSON</span>
            </button>
          </div>

          {/* Add Question Shortcut */}
          <button
            onClick={() => setShowAddQuestionModal(true)}
            className="flex items-center gap-1.5 rounded-xl bg-primary px-3.5 py-2 text-xs font-bold text-white hover:bg-primary-dark transition-all shadow-md shadow-primary/20"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Add Question</span>
          </button>
        </div>
      </div>

      {/* Real-time Telemetry Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        
        {/* Total Users */}
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 backdrop-blur-xl shadow-sm hover:border-white/20 transition-all">
          <div className="flex items-center justify-between text-text-muted">
            <span className="text-[11px] font-bold uppercase tracking-wider">Learners</span>
            <Users className="h-3.5 w-3.5 text-blue-400" />
          </div>
          <div className="mt-2 text-xl sm:text-2xl font-black text-text-primary font-mono">
            {telemetryStats.totalUsers}
          </div>
          <p className="text-[10px] text-text-muted mt-0.5">Tracked accounts</p>
        </div>

        {/* Total Activities */}
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 backdrop-blur-xl shadow-sm hover:border-white/20 transition-all">
          <div className="flex items-center justify-between text-text-muted">
            <span className="text-[11px] font-bold uppercase tracking-wider">Events</span>
            <Activity className="h-3.5 w-3.5 text-emerald-400" />
          </div>
          <div className="mt-2 text-xl sm:text-2xl font-black text-emerald-400 font-mono">
            {totalActivitiesCount || telemetryStats.totalActivities}
          </div>
          <p className="text-[10px] text-text-muted mt-0.5">Audit log records</p>
        </div>

        {/* Exams Completed */}
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 backdrop-blur-xl shadow-sm hover:border-white/20 transition-all">
          <div className="flex items-center justify-between text-text-muted">
            <span className="text-[11px] font-bold uppercase tracking-wider">Exams Done</span>
            <CheckCircle2 className="h-3.5 w-3.5 text-indigo-400" />
          </div>
          <div className="mt-2 text-xl sm:text-2xl font-black text-indigo-300 font-mono">
            {telemetryStats.examsCompleted}
          </div>
          <p className="text-[10px] text-text-muted mt-0.5">Pass rate: {telemetryStats.averagePassRate}%</p>
        </div>

        {/* Exams Canceled */}
        <div className="rounded-2xl border border-amber-500/20 bg-amber-500/[0.03] p-4 backdrop-blur-xl shadow-sm hover:border-amber-500/30 transition-all">
          <div className="flex items-center justify-between text-amber-300">
            <span className="text-[11px] font-bold uppercase tracking-wider">Canceled</span>
            <AlertTriangle className="h-3.5 w-3.5 text-amber-400" />
          </div>
          <div className="mt-2 text-xl sm:text-2xl font-black text-amber-400 font-mono">
            {telemetryStats.examsCanceled}
          </div>
          <p className="text-[10px] text-amber-300/70 mt-0.5">
            {telemetryStats.examsCompleted + telemetryStats.examsCanceled > 0
              ? `${Math.round((telemetryStats.examsCanceled / (telemetryStats.examsCompleted + telemetryStats.examsCanceled)) * 100)}% cancel rate`
              : '0% rate'}
          </p>
        </div>

        {/* AI Queries */}
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 backdrop-blur-xl shadow-sm hover:border-white/20 transition-all">
          <div className="flex items-center justify-between text-text-muted">
            <span className="text-[11px] font-bold uppercase tracking-wider">AI Queries</span>
            <Sparkles className="h-3.5 w-3.5 text-purple-400" />
          </div>
          <div className="mt-2 text-xl sm:text-2xl font-black text-purple-300 font-mono">
            {telemetryStats.aiQueriesCount}
          </div>
          <p className="text-[10px] text-text-muted mt-0.5">Copilot chats & tools</p>
        </div>

        {/* Today's Pulse */}
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 backdrop-blur-xl shadow-sm hover:border-white/20 transition-all">
          <div className="flex items-center justify-between text-text-muted">
            <span className="text-[11px] font-bold uppercase tracking-wider">Today's Pulse</span>
            <Zap className="h-3.5 w-3.5 text-primary-light" />
          </div>
          <div className="mt-2 text-xl sm:text-2xl font-black text-primary-light font-mono">
            {telemetryStats.todayActivitiesCount || activities.length}
          </div>
          <p className="text-[10px] text-text-muted mt-0.5">Actions recorded today</p>
        </div>

      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-2 border-b border-white/10 pb-2 overflow-x-auto scrollbar-none">
        <button
          onClick={() => setActiveTab('activity')}
          className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition-all shrink-0 ${
            activeTab === 'activity'
              ? 'bg-primary text-white shadow-md shadow-primary/25'
              : 'text-text-muted hover:text-text-primary hover:bg-white/5'
          }`}
        >
          <Activity className="h-3.5 w-3.5" />
          <span>Live User Activity Stream</span>
          <span className="rounded-full bg-white/20 px-1.5 py-0.2 text-[10px] font-mono">
            {activities.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('users')}
          className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition-all shrink-0 ${
            activeTab === 'users'
              ? 'bg-primary text-white shadow-md shadow-primary/25'
              : 'text-text-muted hover:text-text-primary hover:bg-white/5'
          }`}
        >
          <Users className="h-3.5 w-3.5" />
          <span>My Users Directory</span>
          <span className="rounded-full bg-white/20 px-1.5 py-0.2 text-[10px] font-mono">
            {trackedUsers.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('questions')}
          className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition-all shrink-0 ${
            activeTab === 'questions'
              ? 'bg-primary text-white shadow-md shadow-primary/25'
              : 'text-text-muted hover:text-text-primary hover:bg-white/5'
          }`}
        >
          <FileQuestion className="h-3.5 w-3.5" />
          <span>Question Bank Manager</span>
          <span className="rounded-full bg-white/20 px-1.5 py-0.2 text-[10px] font-mono">
            {questions.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('simulator')}
          className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition-all shrink-0 ${
            activeTab === 'simulator'
              ? 'bg-primary text-white shadow-md shadow-primary/25'
              : 'text-text-muted hover:text-text-primary hover:bg-white/5'
          }`}
        >
          <UserCheck className="h-3.5 w-3.5" />
          <span>Role Simulator & State</span>
        </button>
      </div>

      {/* =========================================================
          TAB 1: LIVE USER ACTIVITY STREAM
      ========================================================== */}
      {activeTab === 'activity' && (
        <div className="space-y-4 animate-in fade-in duration-200">
          
          {/* Filter Bar */}
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 backdrop-blur-xl space-y-3">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
              
              {/* Search input */}
              <div className="relative flex-1">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" />
                <input
                  type="text"
                  value={activitySearch}
                  onChange={(e) => setActivitySearch(e.target.value)}
                  placeholder="Search activities by user email, name, action, or prompt keywords..."
                  className="w-full rounded-xl border border-white/10 bg-black/40 pl-9 pr-3 py-2 text-xs text-text-primary placeholder:text-text-muted focus:border-primary-light focus:outline-none"
                />
                {activitySearch && (
                  <button
                    onClick={() => setActivitySearch('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary text-xs"
                  >
                    Clear
                  </button>
                )}
              </div>

              {/* User Dropdown Filter */}
              <div className="flex items-center gap-2">
                <span className="text-xs text-text-muted shrink-0">User:</span>
                <select
                  value={selectedUserFilter}
                  onChange={(e) => setSelectedUserFilter(e.target.value)}
                  className="rounded-xl border border-white/10 bg-black/50 px-3 py-2 text-xs text-text-primary focus:border-primary-light focus:outline-none max-w-[200px]"
                >
                  <option value="all" className="bg-[#0f0f14] text-white">All Users ({trackedUsers.length})</option>
                  {trackedUsers.map((u) => (
                    <option key={u.uid} value={u.email} className="bg-[#0f0f14] text-white">
                      {u.name} ({u.email})
                    </option>
                  ))}
                </select>
              </div>

              {/* Action Filter */}
              <div className="flex items-center gap-2">
                <span className="text-xs text-text-muted shrink-0">Action:</span>
                <select
                  value={selectedActionFilter}
                  onChange={(e) => setSelectedActionFilter(e.target.value)}
                  className="rounded-xl border border-white/10 bg-black/50 px-3 py-2 text-xs text-text-primary focus:border-primary-light focus:outline-none max-w-[180px]"
                >
                  <option value="all" className="bg-[#0f0f14] text-white">All Actions</option>
                  <option value="exam.canceled" className="bg-[#0f0f14] text-amber-300">Exam Canceled ⚠️</option>
                  <option value="exam.submitted" className="bg-[#0f0f14] text-emerald-300">Exam Submitted ✅</option>
                  <option value="exam.started" className="bg-[#0f0f14] text-indigo-300">Exam Started</option>
                  <option value="ai.chat" className="bg-[#0f0f14] text-purple-300">AI Chat Query</option>
                  <option value="ai.generate_scenario" className="bg-[#0f0f14] text-purple-300">AI Audit Scenario</option>
                  <option value="ai.gap_remediation" className="bg-[#0f0f14] text-purple-300">AI Gap Remediation</option>
                  <option value="lesson.completed" className="bg-[#0f0f14] text-blue-300">Lesson Completed</option>
                  <option value="auth.login" className="bg-[#0f0f14] text-white">User Login</option>
                  <option value="auth.signup" className="bg-[#0f0f14] text-white">User Signup</option>
                  <option value="auth.otp_request" className="bg-[#0f0f14] text-amber-300">Password OTP</option>
                </select>
              </div>

              {/* Purge Logs Button */}
              <button
                onClick={handleClearActivities}
                className="flex items-center gap-1.5 rounded-xl border border-rose-500/20 bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 px-3 py-2 text-xs font-bold transition-all shrink-0"
                title="Purge all user activity records"
              >
                <Trash2 className="h-3.5 w-3.5" />
                <span>Purge Logs</span>
              </button>
            </div>

            {/* Category Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none pt-1">
              {[
                { id: 'all', label: 'All Categories', count: activities.length },
                { id: 'exam', label: '📝 Exams & Certs', count: activities.filter(a => a.category === 'exam').length },
                { id: 'ai', label: '🤖 Comply AI Copilot', count: activities.filter(a => a.category === 'ai').length },
                { id: 'learning', label: '📚 Lessons & Badges', count: activities.filter(a => a.category === 'learning').length },
                { id: 'auth', label: '🔐 Auth & Security', count: activities.filter(a => a.category === 'auth').length },
                { id: 'compliance', label: '🛡️ Compliance GRC', count: activities.filter(a => a.category === 'compliance').length },
                { id: 'admin', label: '⚙️ Admin System', count: activities.filter(a => a.category === 'admin').length },
              ].map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`rounded-lg px-2.5 py-1 text-[11px] font-semibold transition-all shrink-0 ${
                    selectedCategory === cat.id
                      ? 'bg-primary text-white shadow-sm'
                      : 'bg-white/5 text-text-muted hover:text-text-primary hover:bg-white/10'
                  }`}
                >
                  <span>{cat.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Activity Stream Feed */}
          <div className="rounded-2xl border border-white/10 bg-white/[0.02] backdrop-blur-xl overflow-hidden shadow-lg">
            
            {/* Table Header / Subhead */}
            <div className="flex items-center justify-between px-5 py-3 border-b border-white/10 bg-white/[0.02] text-xs text-text-muted">
              <div className="flex items-center gap-2">
                <span className="font-bold text-text-primary">Recorded User Events</span>
                <span className="text-[10px]">({activities.length} matching criteria)</span>
              </div>
              <div className="text-[11px]">
                Last Refreshed: <span className="text-text-secondary">{lastRefreshedAt.toLocaleTimeString()}</span>
              </div>
            </div>

            {/* List / Table */}
            {isLoadingActivities ? (
              <div className="p-12 text-center space-y-3">
                <RefreshCw className="h-6 w-6 text-primary-light animate-spin mx-auto" />
                <p className="text-xs text-text-muted">Loading live user activity stream...</p>
              </div>
            ) : activities.length === 0 ? (
              <div className="p-12 text-center space-y-2">
                <Activity className="h-8 w-8 text-text-muted mx-auto opacity-40" />
                <h4 className="text-sm font-bold text-text-primary">No matching activities found</h4>
                <p className="text-xs text-text-muted max-w-sm mx-auto">
                  No user events match your current filter or search criteria. User activities will stream here in real time as they interact with exams, learning modules, or Comply AI.
                </p>
                <button
                  onClick={() => {
                    setActivitySearch('');
                    setSelectedCategory('all');
                    setSelectedUserFilter('all');
                    setSelectedActionFilter('all');
                  }}
                  className="mt-2 text-xs font-bold text-primary-light hover:underline"
                >
                  Reset all filters
                </button>
              </div>
            ) : (
              <div className="divide-y divide-white/5">
                {activities.map((act) => {
                  const isCanceled = act.action === 'exam.canceled';
                  const isSubmitted = act.action === 'exam.submitted';
                  const isAi = act.category === 'ai';

                  return (
                    <div
                      key={act.id}
                      onClick={() => setActiveLogDetail(act)}
                      className="group flex flex-col sm:flex-row sm:items-center justify-between p-4 hover:bg-white/[0.04] transition-all cursor-pointer gap-3"
                    >
                      {/* Left: User Avatar & Activity description */}
                      <div className="flex items-start gap-3.5 min-w-0 flex-1">
                        
                        {/* User Initials Badge */}
                        <div className="relative shrink-0">
                          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-white/10 to-white/5 border border-white/10 text-xs font-bold text-text-primary">
                            {(act.userName || act.userEmail || 'U').charAt(0).toUpperCase()}
                          </div>
                          {isCanceled && (
                            <span className="absolute -bottom-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-amber-500 text-[9px] text-black font-black">
                              !
                            </span>
                          )}
                          {isSubmitted && (
                            <span className="absolute -bottom-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500 text-[9px] text-black font-black">
                              ✓
                            </span>
                          )}
                        </div>

                        {/* Text details */}
                        <div className="min-w-0 flex-1 space-y-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="font-bold text-xs text-text-primary truncate">
                              {act.userName || 'Learner'}
                            </span>
                            <span className="text-[11px] text-text-muted font-mono truncate">
                              ({act.userEmail})
                            </span>
                            <span className={`rounded-md border px-1.5 py-0.2 text-[9px] font-bold uppercase tracking-wider ${getCategoryBadge(act.category)}`}>
                              {act.category}
                            </span>
                            <span className="rounded-md bg-white/5 px-1.5 py-0.2 text-[9px] font-mono text-text-secondary">
                              {act.action}
                            </span>
                          </div>

                          <p className={`text-xs leading-relaxed ${isCanceled ? 'text-amber-200 font-medium' : isSubmitted ? 'text-emerald-200 font-medium' : 'text-text-secondary'}`}>
                            {act.summary}
                          </p>

                          {/* Extra diagnostic snippet if exam canceled */}
                          {isCanceled && act.details && (
                            <div className="text-[11px] text-amber-300/80 flex items-center gap-2 bg-amber-500/10 border border-amber-500/20 rounded-lg px-2.5 py-1 mt-1 w-fit">
                              <AlertTriangle className="h-3 w-3 shrink-0" />
                              <span>
                                Diagnostic: Answered {act.details.questionsAnswered || 0} of {act.details.totalQuestions || '?'} questions before session exit
                              </span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Right: Timestamp & Inspect Button */}
                      <div className="flex items-center gap-3 self-end sm:self-center shrink-0">
                        <div className="text-right">
                          <div className="text-xs text-text-secondary font-mono">
                            {formatRelativeTime(act.timestamp)}
                          </div>
                          <div className="text-[10px] text-text-muted">
                            {new Date(act.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </div>
                        </div>

                        <div className="flex items-center gap-1 text-xs text-primary-light font-bold group-hover:translate-x-0.5 transition-transform">
                          <Eye className="h-3.5 w-3.5" />
                          <span className="hidden sm:inline">Inspect</span>
                        </div>
                      </div>

                    </div>
                  );
                })}
              </div>
            )}

          </div>
        </div>
      )}

      {/* =========================================================
          TAB 2: USER DIRECTORY ("MY USERS")
      ========================================================== */}
      {activeTab === 'users' && (
        <div className="space-y-4 animate-in fade-in duration-200">
          
          {/* Header & Search */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-4 backdrop-blur-xl">
            <div>
              <h3 className="font-heading text-base font-bold text-text-primary">
                Learner & Account Directory
              </h3>
              <p className="text-xs text-text-muted mt-0.5">
                View user performance, certification metrics, and inspect specific activity streams.
              </p>
            </div>

            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-text-muted" />
              <input
                type="text"
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
                placeholder="Search by name, email, or role..."
                className="w-full rounded-xl border border-white/10 bg-black/40 pl-8 pr-3 py-1.5 text-xs text-text-primary placeholder:text-text-muted focus:border-primary-light focus:outline-none"
              />
            </div>
          </div>

          {/* Users Table */}
          <div className="rounded-2xl border border-white/10 bg-white/[0.02] backdrop-blur-xl overflow-hidden shadow-lg">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-text-secondary">
                <thead className="border-b border-white/10 bg-white/[0.02] text-[11px] font-bold uppercase tracking-wider text-text-muted">
                  <tr>
                    <th className="px-5 py-3">Learner Profile</th>
                    <th className="px-5 py-3">Role & Level</th>
                    <th className="px-5 py-3">Exams & Score</th>
                    <th className="px-5 py-3">Lessons & XP</th>
                    <th className="px-5 py-3">Status</th>
                    <th className="px-5 py-3">Last Active</th>
                    <th className="px-5 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {isLoadingUsers ? (
                    <tr>
                      <td colSpan={7} className="p-8 text-center text-text-muted">
                        <RefreshCw className="h-5 w-5 animate-spin text-primary-light mx-auto mb-2" />
                        Loading tracked users...
                      </td>
                    </tr>
                  ) : filteredUsers.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="p-8 text-center text-text-muted">
                        No registered users found matching "{userSearch}".
                      </td>
                    </tr>
                  ) : (
                    filteredUsers.map((u) => {
                      const isOwner = u.email === MASTER_ADMIN_EMAIL;
                      const isSuspended = u.status === 'suspended';

                      return (
                        <tr key={u.uid} className="hover:bg-white/[0.03] transition-colors">
                          
                          {/* Learner Profile */}
                          <td className="px-5 py-4">
                            <div className="flex items-center gap-3">
                              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-primary/30 to-purple-600/20 text-xs font-bold text-white border border-white/10">
                                {u.name.charAt(0).toUpperCase()}
                              </div>
                              <div className="min-w-0">
                                <div className="flex items-center gap-1.5 font-bold text-text-primary">
                                  <span>{u.name}</span>
                                  {isOwner && (
                                    <span className="rounded-full bg-primary/20 border border-primary/40 px-1.5 py-0.2 text-[9px] font-bold text-primary-light uppercase">
                                      OWNER
                                    </span>
                                  )}
                                </div>
                                <div className="text-[11px] text-text-muted font-mono truncate">
                                  {u.email}
                                </div>
                              </div>
                            </div>
                          </td>

                          {/* Role & Level */}
                          <td className="px-5 py-4">
                            <div className="space-y-1">
                              <span className="rounded-full bg-white/10 border border-white/15 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-text-primary">
                                {u.role}
                              </span>
                              <div className="text-[11px] text-text-muted">
                                {u.level || 'Novice Auditor'}
                              </div>
                            </div>
                          </td>

                          {/* Exams & Score */}
                          <td className="px-5 py-4">
                            <div className="space-y-0.5">
                              <div className="font-bold text-text-primary font-mono">
                                {u.totalExamsCompleted} exam{u.totalExamsCompleted !== 1 ? 's' : ''}
                              </div>
                              <div className="text-[11px] text-emerald-400 font-semibold">
                                {u.averageScore}% avg score
                              </div>
                            </div>
                          </td>

                          {/* Lessons & XP */}
                          <td className="px-5 py-4">
                            <div className="space-y-0.5">
                              <div className="font-bold text-text-primary font-mono">
                                {u.xp.toLocaleString()} XP
                              </div>
                              <div className="text-[11px] text-text-muted">
                                {u.totalLessonsCompleted} lessons completed
                              </div>
                            </div>
                          </td>

                          {/* Account Status */}
                          <td className="px-5 py-4">
                            <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                              isSuspended
                                ? 'bg-rose-500/20 border border-rose-500/30 text-rose-300'
                                : 'bg-emerald-500/20 border border-emerald-500/30 text-emerald-300'
                            }`}>
                              <span className={`h-1.5 w-1.5 rounded-full ${isSuspended ? 'bg-rose-400' : 'bg-emerald-400'}`} />
                              {u.status}
                            </span>
                          </td>

                          {/* Last Active */}
                          <td className="px-5 py-4">
                            <div className="space-y-0.5 font-mono text-[11px]">
                              <div className="text-text-secondary">{formatRelativeTime(u.lastActive)}</div>
                              {u.recentAction && (
                                <div className="text-[10px] text-text-muted truncate max-w-[120px]">
                                  {u.recentAction}
                                </div>
                              )}
                            </div>
                          </td>

                          {/* Action Buttons */}
                          <td className="px-5 py-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              {/* Filter activity by user */}
                              <button
                                onClick={() => handleInspectUserActivities(u.email)}
                                className="flex items-center gap-1 rounded-lg border border-primary/30 bg-primary/10 hover:bg-primary/20 text-primary-light px-2.5 py-1 text-[11px] font-bold transition-all"
                                title={`Inspect all activities logged by ${u.name}`}
                              >
                                <Activity className="h-3 w-3" />
                                <span>Activity Stream</span>
                              </button>

                              {/* Suspend / Activate toggle (Owner cannot be suspended) */}
                              {!isOwner && (
                                <button
                                  onClick={() => handleToggleUserStatus(u)}
                                  disabled={updatingUserEmail === u.email}
                                  className={`rounded-lg border px-2 py-1 text-[11px] font-bold transition-all ${
                                    isSuspended
                                      ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500/20'
                                      : 'border-rose-500/30 bg-rose-500/10 text-rose-300 hover:bg-rose-500/20'
                                  }`}
                                >
                                  {updatingUserEmail === u.email ? (
                                    <RefreshCw className="h-3 w-3 animate-spin" />
                                  ) : isSuspended ? (
                                    'Reactivate'
                                  ) : (
                                    'Suspend'
                                  )}
                                </button>
                              )}
                            </div>
                          </td>

                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================
          TAB 3: EXAM QUESTION BANK MANAGER
      ========================================================== */}
      {activeTab === 'questions' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          
          {/* Question Filter & Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 rounded-2xl border border-white/10 bg-white/[0.03] p-4 backdrop-blur-xl">
            <div>
              <h3 className="font-heading text-base font-bold text-text-primary">
                Question Bank Inventory ({questions.length} Items)
              </h3>
              <p className="text-xs text-text-muted mt-0.5">
                Curate multiple-choice questions across SOC 2, ISO 27001, NIST CSF 2.0, HIPAA, PCI-DSS, and GDPR.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-text-muted" />
                <input
                  type="text"
                  value={questionSearch}
                  onChange={(e) => setQuestionSearch(e.target.value)}
                  placeholder="Search question text or domain..."
                  className="rounded-xl border border-white/10 bg-black/40 pl-8 pr-3 py-1.5 text-xs text-text-primary placeholder:text-text-muted focus:border-primary-light focus:outline-none w-48 sm:w-60"
                />
              </div>

              {/* Framework filter */}
              <select
                value={selectedFwFilter}
                onChange={(e) => setSelectedFwFilter(e.target.value)}
                className="rounded-xl border border-white/10 bg-black/40 px-3 py-1.5 text-xs text-text-primary focus:border-primary-light focus:outline-none"
              >
                <option value="all" className="bg-[#0f0f14] text-white">All Frameworks</option>
                {frameworks.map((f) => (
                  <option key={f.id} value={f.id} className="bg-[#0f0f14] text-white">{f.title}</option>
                ))}
              </select>

              <button
                onClick={() => setShowAddQuestionModal(true)}
                className="flex items-center gap-1.5 rounded-xl bg-primary px-3 py-1.5 text-xs font-bold text-white hover:bg-primary-dark transition-all shadow-md shadow-primary/20"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>New Question</span>
              </button>
            </div>
          </div>

          {/* Question List */}
          <div className="rounded-2xl border border-white/10 bg-white/[0.02] backdrop-blur-xl overflow-hidden shadow-lg divide-y divide-white/5">
            {filteredQuestions.length === 0 ? (
              <div className="p-10 text-center text-text-muted">
                No questions found matching your filter criteria.
              </div>
            ) : (
              filteredQuestions.map((q, idx) => (
                <div key={q.id || idx} className="p-4 sm:p-5 hover:bg-white/[0.03] transition-colors space-y-2">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="rounded-md bg-primary/20 border border-primary/30 px-2 py-0.5 text-[10px] font-bold text-primary-light uppercase">
                        {q.frameworkId.toUpperCase()}
                      </span>
                      <span className="rounded-md bg-white/10 px-2 py-0.5 text-[10px] text-text-secondary font-mono">
                        {q.domain}
                      </span>
                      <span className={`rounded-md px-2 py-0.5 text-[10px] font-bold ${
                        q.difficulty === 'Advanced' ? 'bg-rose-500/20 text-rose-300' :
                        q.difficulty === 'Intermediate' ? 'bg-amber-500/20 text-amber-300' : 'bg-emerald-500/20 text-emerald-300'
                      }`}>
                        {q.difficulty}
                      </span>
                    </div>

                    <span className="text-[10px] font-mono text-text-muted">
                      ID: {q.id}
                    </span>
                  </div>

                  <p className="text-xs sm:text-sm font-semibold text-text-primary leading-relaxed">
                    {q.question}
                  </p>

                  {/* Options List */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 text-xs">
                    {q.options.map((opt, oIdx) => {
                      const isCorrect = q.correctIndex === oIdx;
                      return (
                        <div
                          key={oIdx}
                          className={`flex items-start gap-2 p-2 rounded-xl border text-[11px] ${
                            isCorrect
                              ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-200 font-semibold'
                              : 'border-white/5 bg-white/[0.02] text-text-muted'
                          }`}
                        >
                          <span className="font-mono font-bold">{String.fromCharCode(65 + oIdx)}.</span>
                          <span>{opt}</span>
                          {isCorrect && <CheckCircle2 className="h-3 w-3 text-emerald-400 shrink-0 ml-auto mt-0.5" />}
                        </div>
                      );
                    })}
                  </div>

                  {q.explanation && (
                    <div className="text-[11px] text-text-muted bg-white/[0.02] border border-white/5 rounded-xl p-2.5 mt-2">
                      <span className="font-bold text-text-secondary">Rationale: </span>
                      {q.explanation}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>

        </div>
      )}

      {/* =========================================================
          TAB 4: ROLE SIMULATOR & SYSTEM DIAGNOSTICS
      ========================================================== */}
      {activeTab === 'simulator' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-in fade-in duration-200">
          
          {/* Role Persona Switcher */}
          <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 space-y-4 backdrop-blur-xl shadow-lg">
            <div className="flex items-center gap-2 text-text-primary font-bold text-sm">
              <UserCheck className="h-4 w-4 text-primary-light" />
              <span>Role Simulator (Access Control Testing)</span>
            </div>
            <p className="text-xs text-text-muted leading-relaxed">
              Test the platform experience as different user roles to verify permissions, navigation visibility, and assessment access:
            </p>

            <div className="space-y-2.5 pt-2">
              {(['student', 'instructor', 'admin'] as UserRole[]).map((r) => (
                <button
                  key={r}
                  onClick={() => loginAs(r)}
                  className={`w-full flex items-center justify-between p-3.5 rounded-2xl border text-xs font-bold transition-all ${
                    role === r
                      ? 'border-primary-light bg-primary/25 text-white shadow-md'
                      : 'border-white/10 bg-white/[0.02] text-text-muted hover:text-text-primary hover:bg-white/[0.06]'
                  }`}
                >
                  <div className="text-left">
                    <div className="capitalize">{r === 'student' ? 'Student / Learner' : r === 'instructor' ? 'Lead Auditor / Instructor' : 'Master Administrator'}</div>
                    <div className="text-[10px] text-text-muted font-normal">
                      {r === 'student' ? 'Standard dashboard, practice exams & study paths' : r === 'instructor' ? 'Question authoring & performance telemetry' : 'Full access to user logs & platform state'}
                    </div>
                  </div>
                  {role === r && <CheckCircle2 className="h-4 w-4 text-primary-light shrink-0" />}
                </button>
              ))}
            </div>
          </div>

          {/* Storage & State Diagnostics */}
          <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 space-y-4 backdrop-blur-xl shadow-lg">
            <div className="flex items-center gap-2 text-text-primary font-bold text-sm">
              <Database className="h-4 w-4 text-accent-light" />
              <span>Storage & Cache Management</span>
            </div>
            <p className="text-xs text-text-muted leading-relaxed">
              Reset cached local state, reload standard mock accounts, or purge demo progress for fresh testing:
            </p>

            <div className="space-y-3 pt-2">
              <button
                onClick={() => {
                  if (window.confirm('Reset all progress, XP, and history back to default demo state?')) {
                    resetToDemoData();
                  }
                }}
                className="w-full flex items-center justify-between p-3.5 rounded-2xl border border-white/10 bg-white/[0.02] hover:bg-white/[0.06] text-xs font-bold text-text-primary transition-all"
              >
                <div className="text-left">
                  <div>Reset to Default Demo State</div>
                  <div className="text-[10px] text-text-muted font-normal">Re-initializes demo XP, badges, and assessments</div>
                </div>
                <RefreshCw className="h-4 w-4 text-text-muted" />
              </button>

              <button
                onClick={handleClearActivities}
                className="w-full flex items-center justify-between p-3.5 rounded-2xl border border-rose-500/20 bg-rose-500/10 hover:bg-rose-500/20 text-xs font-bold text-rose-300 transition-all"
              >
                <div className="text-left">
                  <div>Purge User Activity Audit Trail</div>
                  <div className="text-[10px] text-rose-300/70 font-normal">Permanently clears recorded user logs from storage</div>
                </div>
                <Trash2 className="h-4 w-4 text-rose-400" />
              </button>
            </div>
          </div>

        </div>
      )}

      {/* =========================================================
          ACTIVITY LOG INSPECTION MODAL / DRAWER
      ========================================================== */}
      {activeLogDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md animate-in fade-in">
          <div className="relative flex flex-col w-full max-w-2xl rounded-3xl border border-white/15 bg-neutral-950/95 shadow-2xl backdrop-blur-2xl overflow-hidden max-h-[90vh]">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-white/[0.02]">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/20 text-primary-light">
                  <Activity className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="font-heading text-sm sm:text-base font-bold text-text-primary">
                    Activity Audit Log Inspection
                  </h3>
                  <p className="text-[11px] text-text-muted font-mono">
                    Log ID: {activeLogDetail.id}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setActiveLogDetail(null)}
                className="rounded-lg p-1.5 text-text-muted hover:text-text-primary hover:bg-white/10"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 overflow-y-auto space-y-4 text-xs">
              
              {/* Summary Banner */}
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 space-y-2">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className={`rounded-md border px-2 py-0.5 text-[10px] font-bold uppercase ${getCategoryBadge(activeLogDetail.category)}`}>
                    {activeLogDetail.category}
                  </span>
                  <span className="font-mono text-[11px] text-text-muted">
                    {new Date(activeLogDetail.timestamp).toUTCString()}
                  </span>
                </div>
                <h4 className="text-sm font-bold text-text-primary">
                  {activeLogDetail.summary}
                </h4>
              </div>

              {/* User Metadata Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div className="rounded-xl border border-white/5 bg-white/[0.02] p-3">
                  <span className="text-[10px] text-text-muted uppercase font-bold block">Learner Name</span>
                  <span className="font-bold text-text-primary mt-0.5 block">{activeLogDetail.userName || 'Learner'}</span>
                </div>
                <div className="rounded-xl border border-white/5 bg-white/[0.02] p-3">
                  <span className="text-[10px] text-text-muted uppercase font-bold block">User Email</span>
                  <span className="font-mono text-text-secondary mt-0.5 block truncate">{activeLogDetail.userEmail}</span>
                </div>
                <div className="rounded-xl border border-white/5 bg-white/[0.02] p-3">
                  <span className="text-[10px] text-text-muted uppercase font-bold block">Platform Role</span>
                  <span className="font-bold text-primary-light mt-0.5 block uppercase">{activeLogDetail.userRole}</span>
                </div>
                <div className="rounded-xl border border-white/5 bg-white/[0.02] p-3">
                  <span className="text-[10px] text-text-muted uppercase font-bold block">Action Key</span>
                  <span className="font-mono text-text-secondary mt-0.5 block">{activeLogDetail.action}</span>
                </div>
                <div className="rounded-xl border border-white/5 bg-white/[0.02] p-3">
                  <span className="text-[10px] text-text-muted uppercase font-bold block">Client IP</span>
                  <span className="font-mono text-emerald-400 mt-0.5 block">{activeLogDetail.ipAddress || '127.0.0.1 (Local)'}</span>
                </div>
                <div className="rounded-xl border border-white/5 bg-white/[0.02] p-3">
                  <span className="text-[10px] text-text-muted uppercase font-bold block">User ID</span>
                  <span className="font-mono text-text-muted mt-0.5 block truncate">{activeLogDetail.userId}</span>
                </div>
              </div>

              {/* Details / Payload JSON */}
              <div className="space-y-2">
                <span className="text-[11px] font-bold text-text-secondary block">
                  Detailed Telemetry Payload (JSON):
                </span>
                <pre className="rounded-2xl border border-white/10 bg-black/60 p-4 font-mono text-[11px] text-primary-light overflow-x-auto max-h-60 leading-relaxed">
                  {JSON.stringify(activeLogDetail.details || { note: 'No additional metadata logged.' }, null, 2)}
                </pre>
              </div>

              {/* User Agent */}
              {activeLogDetail.userAgent && (
                <div className="text-[10px] text-text-muted font-mono bg-white/[0.02] rounded-xl p-2.5 border border-white/5 truncate">
                  User-Agent: {activeLogDetail.userAgent}
                </div>
              )}

            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-between px-6 py-3.5 border-t border-white/10 bg-white/[0.02]">
              <button
                onClick={() => {
                  handleInspectUserActivities(activeLogDetail.userEmail);
                  setActiveLogDetail(null);
                }}
                className="text-xs font-bold text-primary-light hover:underline flex items-center gap-1"
              >
                <Filter className="h-3.5 w-3.5" />
                <span>Filter all activities by {activeLogDetail.userEmail}</span>
              </button>
              
              <button
                onClick={() => setActiveLogDetail(null)}
                className="rounded-xl bg-white/10 hover:bg-white/15 px-4 py-1.5 text-xs font-bold text-white transition-all"
              >
                Close
              </button>
            </div>

          </div>
        </div>
      )}

      {/* =========================================================
          ADD CUSTOM QUESTION MODAL
      ========================================================== */}
      {showAddQuestionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
          <form
            onSubmit={handleCreateQuestion}
            className="w-full max-w-2xl rounded-3xl border border-white/15 bg-neutral-950/90 backdrop-blur-2xl p-6 sm:p-8 space-y-4 shadow-2xl max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <FileQuestion className="h-5 w-5 text-primary-light" />
                <h3 className="font-heading text-base font-bold text-text-primary">
                  Create Custom Exam Question
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowAddQuestionModal(false)}
                className="text-text-muted hover:text-text-primary"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div>
                <label className="font-semibold text-text-secondary block mb-1">Target Framework</label>
                <select
                  value={newFwId}
                  onChange={(e) => setNewFwId(e.target.value)}
                  className="w-full rounded-2xl border border-white/10 bg-white/[0.04] px-3 py-2 text-text-primary focus:border-primary-light focus:outline-none"
                >
                  {frameworks.map((f) => (
                    <option key={f.id} value={f.id} className="bg-[#0f0f13] text-white">{f.title}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-semibold text-text-secondary block mb-1">Domain</label>
                <input
                  type="text"
                  required
                  value={newDomain}
                  onChange={(e) => setNewDomain(e.target.value)}
                  placeholder="e.g. Logical Access"
                  className="w-full rounded-2xl border border-white/10 bg-white/[0.04] px-3 py-2 text-text-primary focus:border-primary-light focus:outline-none"
                />
              </div>

              <div>
                <label className="font-semibold text-text-secondary block mb-1">Difficulty</label>
                <select
                  value={newDifficulty}
                  onChange={(e) => setNewDifficulty(e.target.value as any)}
                  className="w-full rounded-2xl border border-white/10 bg-white/[0.04] px-3 py-2 text-text-primary focus:border-primary-light focus:outline-none"
                >
                  <option value="Beginner" className="bg-[#0f0f13] text-white">Beginner</option>
                  <option value="Intermediate" className="bg-[#0f0f13] text-white">Intermediate</option>
                  <option value="Advanced" className="bg-[#0f0f13] text-white">Advanced</option>
                </select>
              </div>
            </div>

            <div className="text-xs">
              <label className="font-semibold text-text-secondary block mb-1">Question Prompt</label>
              <textarea
                rows={3}
                required
                value={newQuestionText}
                onChange={(e) => setNewQuestionText(e.target.value)}
                placeholder="Enter complete multiple-choice question scenario..."
                className="w-full rounded-2xl border border-white/10 bg-white/[0.04] px-3 py-2 text-text-primary focus:border-primary-light focus:outline-none"
              />
            </div>

            {/* Options */}
            <div className="space-y-2 text-xs">
              <label className="font-semibold text-text-secondary block">
                Answer Options (Select radio button for the correct answer):
              </label>
              {newOptions.map((opt, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="correctOption"
                    checked={newCorrectIdx === idx}
                    onChange={() => setNewCorrectIdx(idx)}
                    className="accent-primary h-4 w-4"
                  />
                  <span className="font-mono font-bold text-text-muted w-4">
                    {String.fromCharCode(65 + idx)}.
                  </span>
                  <input
                    type="text"
                    required
                    value={opt}
                    onChange={(e) => handleOptionChange(idx, e.target.value)}
                    placeholder={`Option ${String.fromCharCode(65 + idx)}`}
                    className="flex-1 rounded-2xl border border-white/10 bg-white/[0.04] px-3 py-2 text-text-primary focus:border-primary-light focus:outline-none"
                  />
                </div>
              ))}
            </div>

            <div className="text-xs">
              <label className="font-semibold text-text-secondary block mb-1">Regulatory Explanation</label>
              <textarea
                rows={2}
                required
                value={newExplanation}
                onChange={(e) => setNewExplanation(e.target.value)}
                placeholder="Explain why the correct answer is valid under the standard..."
                className="w-full rounded-2xl border border-white/10 bg-white/[0.04] px-3 py-2 text-text-primary focus:border-primary-light focus:outline-none"
              />
            </div>

            <div className="flex items-center gap-3 pt-3 border-t border-white/10">
              <button
                type="button"
                onClick={() => setShowAddQuestionModal(false)}
                className="flex-1 rounded-xl border border-white/10 bg-white/5 py-2.5 text-xs font-semibold text-text-secondary hover:bg-white/10 transition-all"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 rounded-xl bg-primary py-2.5 text-xs font-bold text-white hover:bg-primary-dark transition-all shadow-md shadow-primary/20 border border-white/15"
              >
                Save Question to Bank
              </button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
};
