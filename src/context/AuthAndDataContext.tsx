import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import {
  UserProfile,
  UserRole,
  UserLevel,
  FrameworkItem,
  QuestionItem,
  BadgeItem,
  ExamResult,
  ExamSession,
  ExamType,
  GapAssessmentItem,
  GapAnalysisItem,
  ComplianceStatus,
  LearningPath,
  GamificationToast,
  getUserLevelDetails
} from '../types';
import {
  INITIAL_FRAMEWORKS,
  QUESTION_BANK,
  INITIAL_BADGES,
  INITIAL_GAP_ASSESSMENTS,
  LEARNING_PATHS
} from '../data/demoContent';
import {
  isSupabaseConfigured,
  supabaseAuthService,
  supabaseDbService,
} from '../services/supabase';

interface AuthAndDataContextType {
  // User & Auth
  user: UserProfile;
  role: UserRole;
  isAuthenticated: boolean;
  setUserRole: (role: UserRole) => void;
  updateUserProfile: (updates: Partial<UserProfile>) => void;
  loginAs: (role: UserRole, customName?: string, customEmail?: string) => void;
  signup: (name: string, email: string, role: UserRole, startWithZero?: boolean, password?: string) => Promise<{ success: boolean; error?: string }>;
  loginWithCredentials: (email: string, role?: UserRole, password?: string) => Promise<{ success: boolean; error?: string }>;
  startFreshUser: (role?: UserRole, name?: string, email?: string) => void;
  logout: () => Promise<void>;
  requestPasswordResetOtp: (email: string) => Promise<{ success: boolean; otp?: string; message: string; error?: string }>;
  verifyPasswordResetOtp: (email: string, otp: string) => Promise<{ success: boolean; message: string; error?: string }>;
  resetPasswordWithOtp: (email: string, otp: string, newPassword: string) => Promise<{ success: boolean; message: string; error?: string }>;

  // Supabase Status & Cloud Sync
  isSupabaseActive: boolean;
  supabaseSyncStatus: 'idle' | 'syncing' | 'synced' | 'error';
  lastCloudSyncTime: string | null;
  syncDataToCloud: () => Promise<boolean>;

  // Frameworks & Lessons
  frameworks: FrameworkItem[];
  completedLessonIds: string[];
  completedModuleIds: string[];
  completedFrameworkIds: string[];
  completeLesson: (lessonId: string, frameworkId: string, moduleId: string) => { xpEarned: number; newBadges: BadgeItem[] };
  isLessonCompleted: (lessonId: string) => boolean;
  isModuleCompleted: (moduleId: string) => boolean;
  isFrameworkCompleted: (frameworkId: string) => boolean;

  // Learning Paths Completion
  completedLearningPathIds: string[];
  completeLearningPath: (pathId: string) => { xpEarned: number; newBadges: BadgeItem[] };
  isLearningPathCompleted: (pathId: string) => boolean;

  // Custom XP Awarding
  awardCustomXp: (amount: number, reason: string) => void;

  // Gamification Toasts & Feedback
  gamificationToasts: GamificationToast[];
  triggerGamificationToast: (toast: Omit<GamificationToast, 'id' | 'timestamp'>) => void;
  dismissGamificationToast: (id: string) => void;

  // Exam System
  questions: QuestionItem[];
  examHistory: ExamResult[];
  activeExamSession: ExamSession | null;
  startExam: (
    paramOrType: ExamType | {
      examType: ExamType;
      frameworkId?: string;
      questionCount?: number;
      durationMinutes?: number;
      title?: string;
      isUntimed?: boolean;
      specificQuestions?: QuestionItem[];
    },
    frameworkId?: string
  ) => ExamSession;
  togglePauseExamTimer: () => void;
  saveActiveExamAnswer: (questionId: string, optionIndex: number) => void;
  toggleFlagQuestion: (questionId: string) => void;
  updateActiveExamTimer: (secondsRemaining: number) => void;
  submitActiveExam: (timeSpentSeconds: number) => Promise<ExamResult>;
  cancelActiveExam: () => void;
  lastExamResult: ExamResult | null;
  setLastExamResult: (result: ExamResult | null) => void;

  // Gamification & Badges
  badges: BadgeItem[];
  unlockedBadgeIds: string[];
  recentBadgeUnlocked: BadgeItem | null;
  clearRecentBadge: () => void;

  // Gap Analysis & Learning Paths
  gapItems: GapAnalysisItem[];
  gapAssessments: GapAssessmentItem[];
  updateGapItemStatus: (id: string, status: ComplianceStatus) => void;
  addGapItem: (item: Omit<GapAnalysisItem, 'id'>) => void;
  updateGapAssessment: (id: string, updates: Partial<GapAssessmentItem>) => void;
  addGapAssessment: (item: Omit<GapAssessmentItem, 'id'>) => void;
  learningPaths: LearningPath[];

  // Admin / Instructor Operations
  addQuestion: (newQuestion: Omit<QuestionItem, 'id'>) => void;
  addCustomQuestion: (newQuestion: Omit<QuestionItem, 'id'>) => void;
  deleteQuestion: (id: string) => void;
  resetAllDemoData: () => void;
  resetToDemoData: () => void;

  // AI Modal Global Controls
  isAiModalOpen: boolean;
  openAiModal: (context?: { framework?: string; topic?: string; prompt?: string }) => void;
  closeAiModal: () => void;
  aiModalInitialPrompt: string;
  aiModalContext: { framework?: string; topic?: string } | undefined;

  // Auth Prompt Alert / Modal Controls
  isAuthPromptOpen: boolean;
  authPromptInfo: { title?: string; message?: string; targetTab?: string; frameworkId?: string } | null;
  openAuthPrompt: (info?: { title?: string; message?: string; targetTab?: string; frameworkId?: string }) => void;
  closeAuthPrompt: () => void;
}

const STORAGE_KEYS = {
  USER: 'complianceverse_user_v3',
  COMPLETED_LESSONS: 'complianceverse_completed_lessons_v3',
  COMPLETED_MODULES: 'complianceverse_completed_modules_v3',
  COMPLETED_FRAMEWORKS: 'complianceverse_completed_frameworks_v3',
  COMPLETED_PATHS: 'complianceverse_completed_paths_v3',
  EXAM_HISTORY: 'complianceverse_exam_history_v3',
  ACTIVE_EXAM: 'complianceverse_active_exam_v3',
  UNLOCKED_BADGES: 'complianceverse_unlocked_badges_v3',
  GAP_ASSESSMENTS: 'complianceverse_gap_assessments_v3',
  CUSTOM_QUESTIONS: 'complianceverse_custom_questions_v3',
  AUTH_STATE: 'complianceverse_auth_state_v3',
};

// Clean legacy localStorage keys from prior mock versions
try {
  const legacyKeys = [
    'complianceverse_user',
    'complianceverse_user_v1',
    'complianceverse_user_v2',
    'complianceverse_auth_state',
    'complianceverse_auth_state_v1',
    'complianceverse_auth_state_v2',
    'complianceverse_completed_lessons_v2',
    'complianceverse_completed_modules_v2',
    'complianceverse_completed_frameworks_v2',
    'complianceverse_exam_history_v2',
    'complianceverse_active_exam_v2',
    'complianceverse_unlocked_badges_v2',
  ];
  legacyKeys.forEach(k => localStorage.removeItem(k));
} catch {
  // Ignore in SSR or restricted environments
}

const DEFAULT_USER: UserProfile = {
  uid: '',
  name: 'Auditor',
  email: '',
  role: 'student',
  level: 'Compliance Explorer',
  levelNumber: 1,
  xp: 0,
  streakDays: 0,
  longestStreak: 0,
  lastActiveDate: new Date().toISOString().split('T')[0],
  lastDailyBonusDate: '',
  totalLessonsCompleted: 0,
  totalExamsCompleted: 0,
  averageScore: 0,
  createdAt: new Date().toISOString(),
};

function calculateLevelFromXp(xp: number): UserLevel {
  return getUserLevelDetails(xp).levelTitle;
}

function computeNewStreak(
  prevStreak: number = 0,
  prevLongest: number = 0,
  lastActiveDate?: string
): { streakDays: number; longestStreak: number; lastActiveDate: string; isNewActiveDay: boolean } {
  const today = new Date().toISOString().split('T')[0];
  if (!lastActiveDate || prevStreak === 0) {
    const s = 1;
    return {
      streakDays: s,
      longestStreak: Math.max(prevLongest || 0, s),
      lastActiveDate: today,
      isNewActiveDay: true,
    };
  }
  if (lastActiveDate === today) {
    return {
      streakDays: prevStreak,
      longestStreak: Math.max(prevLongest || 0, prevStreak),
      lastActiveDate: today,
      isNewActiveDay: false,
    };
  }
  const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
  const s = lastActiveDate === yesterday ? prevStreak + 1 : 1;
  return {
    streakDays: s,
    longestStreak: Math.max(prevLongest || 0, s),
    lastActiveDate: today,
    isNewActiveDay: true,
  };
}

const AuthAndDataContext = createContext<AuthAndDataContextType | undefined>(undefined);

export const AuthAndDataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Load State from LocalStorage
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.AUTH_STATE);
    return saved !== null ? JSON.parse(saved) : false;
  });

  const [user, setUser] = useState<UserProfile>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.USER);
    return saved ? JSON.parse(saved) : DEFAULT_USER;
  });

  const [frameworks] = useState<FrameworkItem[]>(INITIAL_FRAMEWORKS);

  const [completedLessonIds, setCompletedLessonIds] = useState<string[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.COMPLETED_LESSONS);
    return saved ? JSON.parse(saved) : [];
  });

  const [completedModuleIds, setCompletedModuleIds] = useState<string[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.COMPLETED_MODULES);
    return saved ? JSON.parse(saved) : [];
  });

  const [completedFrameworkIds, setCompletedFrameworkIds] = useState<string[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.COMPLETED_FRAMEWORKS);
    return saved ? JSON.parse(saved) : [];
  });

  const [questions, setQuestions] = useState<QuestionItem[]>(() => {
    const custom = localStorage.getItem(STORAGE_KEYS.CUSTOM_QUESTIONS);
    if (custom) {
      try {
        const parsed = JSON.parse(custom);
        return [...QUESTION_BANK, ...parsed];
      } catch {
        return QUESTION_BANK;
      }
    }
    return QUESTION_BANK;
  });

  const [examHistory, setExamHistory] = useState<ExamResult[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.EXAM_HISTORY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return [];
      }
    }
    return [];
  });

  const [activeExamSession, setActiveExamSession] = useState<ExamSession | null>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.ACTIVE_EXAM);
    return saved ? JSON.parse(saved) : null;
  });

  const [lastExamResult, setLastExamResult] = useState<ExamResult | null>(null);

  const [unlockedBadgeIds, setUnlockedBadgeIds] = useState<string[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.UNLOCKED_BADGES);
    return saved ? JSON.parse(saved) : ['badge-welcome'];
  });

  const [recentBadgeUnlocked, setRecentBadgeUnlocked] = useState<BadgeItem | null>(null);

  const [gapAssessments, setGapAssessments] = useState<GapAssessmentItem[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.GAP_ASSESSMENTS);
    return saved ? JSON.parse(saved) : INITIAL_GAP_ASSESSMENTS;
  });

  const [completedLearningPathIds, setCompletedLearningPathIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.COMPLETED_PATHS);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [gamificationToasts, setGamificationToasts] = useState<GamificationToast[]>([]);

  // Comply AI global modal state
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [aiModalInitialPrompt, setAiModalInitialPrompt] = useState('');
  const [aiModalContext, setAiModalContext] = useState<{ framework?: string; topic?: string } | undefined>(undefined);

  // Auth Prompt Alert / Modal state
  const [isAuthPromptOpen, setIsAuthPromptOpen] = useState(false);
  const [authPromptInfo, setAuthPromptInfo] = useState<{
    title?: string;
    message?: string;
    targetTab?: string;
    frameworkId?: string;
  } | null>(null);

  // Supabase State
  const isSupabaseActive = isSupabaseConfigured();
  const [supabaseSyncStatus, setSupabaseSyncStatus] = useState<'idle' | 'syncing' | 'synced' | 'error'>('idle');
  const [lastCloudSyncTime, setLastCloudSyncTime] = useState<string | null>(null);

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.AUTH_STATE, JSON.stringify(isAuthenticated));
  }, [isAuthenticated]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.COMPLETED_LESSONS, JSON.stringify(completedLessonIds));
  }, [completedLessonIds]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.COMPLETED_MODULES, JSON.stringify(completedModuleIds));
  }, [completedModuleIds]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.COMPLETED_FRAMEWORKS, JSON.stringify(completedFrameworkIds));
  }, [completedFrameworkIds]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.COMPLETED_PATHS, JSON.stringify(completedLearningPathIds));
  }, [completedLearningPathIds]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.EXAM_HISTORY, JSON.stringify(examHistory));
  }, [examHistory]);

  useEffect(() => {
    if (activeExamSession) {
      localStorage.setItem(STORAGE_KEYS.ACTIVE_EXAM, JSON.stringify(activeExamSession));
    } else {
      localStorage.removeItem(STORAGE_KEYS.ACTIVE_EXAM);
    }
  }, [activeExamSession]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.UNLOCKED_BADGES, JSON.stringify(unlockedBadgeIds));
  }, [unlockedBadgeIds]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.GAP_ASSESSMENTS, JSON.stringify(gapAssessments));
  }, [gapAssessments]);

  const dismissGamificationToast = useCallback((id: string) => {
    setGamificationToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const triggerGamificationToast = useCallback((toast: Omit<GamificationToast, 'id' | 'timestamp'>) => {
    const newToast: GamificationToast = {
      ...toast,
      id: 'toast-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
      timestamp: Date.now(),
    };
    setGamificationToasts(prev => [newToast, ...prev.slice(0, 4)]);
  }, []);

  // Initial Supabase Session Sync on Load
  useEffect(() => {
    if (!isSupabaseActive) return;

    const loadCloudData = async () => {
      try {
        setSupabaseSyncStatus('syncing');
        const session = await supabaseAuthService.getSession();
        if (session && session.user) {
          const cloudProfile = await supabaseDbService.getProfile(session.user.id);
          if (cloudProfile) {
            setUser(cloudProfile);
            setIsAuthenticated(true);
          } else {
            // Profile might not exist yet, push current
            await supabaseDbService.upsertProfile({
              ...user,
              uid: session.user.id,
              email: session.user.email || user.email,
            });
          }

          // Fetch cloud progress
          const progress = await supabaseDbService.getUserProgress(session.user.id);
          if (progress) {
            if (progress.completedLessons.length > 0) setCompletedLessonIds(progress.completedLessons);
            if (progress.completedModules.length > 0) setCompletedModuleIds(progress.completedModules);
            if (progress.completedFrameworks.length > 0) setCompletedFrameworkIds(progress.completedFrameworks);
            if (progress.unlockedBadges.length > 0) setUnlockedBadgeIds(progress.unlockedBadges);
          }

          // Fetch cloud exam history
          const cloudExams = await supabaseDbService.getExamHistory(session.user.id);
          if (cloudExams && cloudExams.length > 0) {
            setExamHistory(cloudExams);
          }

          setLastCloudSyncTime(new Date().toLocaleTimeString());
          setSupabaseSyncStatus('synced');
        } else {
          setSupabaseSyncStatus('idle');
        }
      } catch (err) {
        console.warn('Supabase initial sync error:', err);
        setSupabaseSyncStatus('error');
      }
    };

    loadCloudData();

    // Listen for auth changes
    const { unsubscribe } = supabaseAuthService.onAuthStateChange(async (_event, session) => {
      if (session && session.user) {
        setIsAuthenticated(true);
      }
    });

    return () => {
      unsubscribe();
    };
  }, [isSupabaseActive]);

  // Push full state to Supabase Cloud
  const syncDataToCloud = async (): Promise<boolean> => {
    if (!isSupabaseActive) return false;
    setSupabaseSyncStatus('syncing');
    try {
      await supabaseDbService.upsertProfile(user);
      await supabaseDbService.saveUserProgress(user.uid, {
        completedLessons: completedLessonIds,
        completedModules: completedModuleIds,
        completedFrameworks: completedFrameworkIds,
        unlockedBadges: unlockedBadgeIds,
      });
      setLastCloudSyncTime(new Date().toLocaleTimeString());
      setSupabaseSyncStatus('synced');
      return true;
    } catch (err) {
      console.warn('Sync to cloud error:', err);
      setSupabaseSyncStatus('error');
      return false;
    }
  };

  // Auth Operations
  const setUserRole = (role: UserRole) => {
    setUser(prev => {
      const next = { ...prev, role };
      if (isSupabaseActive) {
        supabaseDbService.upsertProfile(next).catch(console.warn);
      }
      return next;
    });
  };

  const updateUserProfile = (updates: Partial<UserProfile>) => {
    setUser(prev => {
      const updated = { ...prev, ...updates };
      if (updates.xp !== undefined) {
        updated.level = calculateLevelFromXp(updated.xp);
      }
      if (isSupabaseActive) {
        supabaseDbService.upsertProfile(updated).catch(console.warn);
      }
      return updated;
    });
  };

  const loginAs = (role: UserRole, customName?: string, customEmail?: string) => {
    setUser(prev => {
      const updatedUser: UserProfile = {
        ...prev,
        uid: prev.uid || `usr-${role}-${Date.now().toString(36)}`,
        name: customName || (prev.name && prev.name !== 'New Auditor' ? prev.name : 'Auditor'),
        email: customEmail || prev.email || '',
        role,
      };
      if (isSupabaseActive && prev.uid) {
        supabaseDbService.upsertProfile(updatedUser).catch(console.warn);
      }
      return updatedUser;
    });
    setIsAuthenticated(true);
  };

  const signup = async (
    name: string,
    email: string,
    role: UserRole,
    startWithZero: boolean = true,
    password?: string
  ): Promise<{ success: boolean; error?: string }> => {
    let finalUid = `usr-${Date.now().toString(36)}`;
    const cleanEmail = email.trim();
    const cleanName = name.trim() || (cleanEmail ? cleanEmail.split('@')[0].replace(/[._]/g, ' ') : 'Auditor');
    const formattedName = cleanName.charAt(0).toUpperCase() + cleanName.slice(1);

    // Try Supabase Sign Up if configured and password provided
    if (isSupabaseActive && password) {
      setSupabaseSyncStatus('syncing');
      const { data, error } = await supabaseAuthService.signUp(cleanEmail, password, { name: formattedName, role });
      if (error) {
        setSupabaseSyncStatus('error');
        return { success: false, error: error.message };
      }
      if (data?.user) {
        finalUid = data.user.id;
      }
      setSupabaseSyncStatus('synced');
    }

    const freshUser: UserProfile = {
      uid: finalUid,
      name: formattedName,
      email: cleanEmail,
      role,
      level: 'Beginner',
      xp: 0,
      streakDays: 0,
      lastActiveDate: new Date().toISOString().split('T')[0],
      totalLessonsCompleted: 0,
      totalExamsCompleted: 0,
      averageScore: 0,
      createdAt: new Date().toISOString(),
    };

    if (startWithZero) {
      setCompletedLessonIds([]);
      setCompletedModuleIds([]);
      setCompletedFrameworkIds([]);
      setExamHistory([]);
      setActiveExamSession(null);
      setLastExamResult(null);
      setUnlockedBadgeIds(['badge-welcome']);
    }

    setUser(freshUser);
    setIsAuthenticated(true);

    if (isSupabaseActive) {
      supabaseDbService.upsertProfile(freshUser).catch(console.warn);
      supabaseDbService.saveUserProgress(finalUid, {
        completedLessons: startWithZero ? [] : completedLessonIds,
        completedModules: startWithZero ? [] : completedModuleIds,
        completedFrameworks: startWithZero ? [] : completedFrameworkIds,
        unlockedBadges: ['badge-welcome'],
      }).catch(console.warn);
    }

    if (password) {
      try {
        localStorage.setItem(
          `cv_user_cred_${cleanEmail.toLowerCase()}`,
          JSON.stringify({
            email: cleanEmail.toLowerCase(),
            password,
            updatedAt: new Date().toISOString(),
          })
        );
      } catch {}
    }

    return { success: true };
  };

  const loginWithCredentials = async (
    email: string,
    role: UserRole = 'student',
    password?: string
  ): Promise<{ success: boolean; error?: string }> => {
    const cleanEmail = email.trim();
    const derivedName = cleanEmail.split('@')[0]?.replace(/[._]/g, ' ') || 'Auditor';
    const formattedName = derivedName.charAt(0).toUpperCase() + derivedName.slice(1);

    // If Supabase is active and password is provided, perform real Supabase sign-in
    if (isSupabaseActive && password) {
      setSupabaseSyncStatus('syncing');
      const { data, error } = await supabaseAuthService.signIn(cleanEmail, password);
      if (error) {
        setSupabaseSyncStatus('error');
        return { success: false, error: error.message };
      }

      if (data?.user) {
        const cloudProfile = await supabaseDbService.getProfile(data.user.id);
        if (cloudProfile) {
          setUser(cloudProfile);
        } else {
          const newProfile: UserProfile = {
            uid: data.user.id,
            name: formattedName,
            email: cleanEmail,
            role: role || 'student',
            level: 'Beginner',
            xp: 0,
            streakDays: 0,
            lastActiveDate: new Date().toISOString().split('T')[0],
            totalLessonsCompleted: 0,
            totalExamsCompleted: 0,
            averageScore: 0,
            createdAt: new Date().toISOString(),
          };
          setUser(newProfile);
          supabaseDbService.upsertProfile(newProfile).catch(console.warn);
        }

        // Pull user progress
        const cloudProgress = await supabaseDbService.getUserProgress(data.user.id);
        if (cloudProgress) {
          if (cloudProgress.completedLessons) setCompletedLessonIds(cloudProgress.completedLessons);
          if (cloudProgress.completedModules) setCompletedModuleIds(cloudProgress.completedModules);
          if (cloudProgress.completedFrameworks) setCompletedFrameworkIds(cloudProgress.completedFrameworks);
          if (cloudProgress.unlockedBadges) setUnlockedBadgeIds(cloudProgress.unlockedBadges);
        }

        // Pull exam history
        const cloudExams = await supabaseDbService.getExamHistory(data.user.id);
        if (cloudExams) setExamHistory(cloudExams);
      }
      setSupabaseSyncStatus('synced');
      setIsAuthenticated(true);
      return { success: true };
    }

    // Local / fallback credential check if password was configured
    if (!isSupabaseActive && password) {
      try {
        const savedCred = localStorage.getItem(`cv_user_cred_${cleanEmail.toLowerCase()}`);
        if (savedCred) {
          const parsed = JSON.parse(savedCred);
          if (parsed.password && parsed.password !== password) {
            return {
              success: false,
              error: 'Incorrect password. If you forgot your password, please use "Forgot Password" to receive a reset OTP.',
            };
          }
        }
      } catch {}
    }

    // Local / fallback login
    setUser(prev => ({
      ...prev,
      uid: prev.uid || `usr-${Date.now().toString(36)}`,
      name: prev.name && prev.name !== 'New Auditor' ? prev.name : formattedName,
      email: cleanEmail,
      role: role || prev.role || 'student',
    }));
    setIsAuthenticated(true);
    return { success: true };
  };

  // Supabase Database OTP Password Reset Methods
  const requestPasswordResetOtp = async (email: string) => {
    return await supabaseAuthService.requestPasswordResetOtp(email);
  };

  const verifyPasswordResetOtp = async (email: string, otp: string) => {
    return await supabaseAuthService.verifyPasswordResetOtp(email, otp);
  };

  const resetPasswordWithOtp = async (email: string, otp: string, newPassword: string) => {
    return await supabaseAuthService.resetPasswordWithOtp(email, otp, newPassword);
  };

  const startFreshUser = (role: UserRole = 'student', name?: string, email?: string) => {
    signup(name || 'Auditor', email || '', role, true);
  };

  const logout = async () => {
    if (isSupabaseActive) {
      await supabaseAuthService.signOut().catch(console.warn);
    }
    setIsAuthenticated(false);
    setUser(DEFAULT_USER);
    setCompletedLessonIds([]);
    setCompletedModuleIds([]);
    setCompletedFrameworkIds([]);
    setExamHistory([]);
    setActiveExamSession(null);
    setLastExamResult(null);
    setUnlockedBadgeIds(['badge-welcome']);
    localStorage.removeItem(STORAGE_KEYS.USER);
    localStorage.removeItem(STORAGE_KEYS.AUTH_STATE);
    localStorage.removeItem(STORAGE_KEYS.COMPLETED_LESSONS);
    localStorage.removeItem(STORAGE_KEYS.COMPLETED_MODULES);
    localStorage.removeItem(STORAGE_KEYS.COMPLETED_FRAMEWORKS);
    localStorage.removeItem(STORAGE_KEYS.EXAM_HISTORY);
    localStorage.removeItem(STORAGE_KEYS.ACTIVE_EXAM);
  };

  // Lesson & Progress Tracking (Idempotent XP & Achievement evaluation)
  const completeLesson = useCallback((lessonId: string, frameworkId: string, moduleId: string) => {
    // Idempotency check: if already completed, do not re-reward XP or duplicate badges
    if (completedLessonIds.includes(lessonId)) {
      return { xpEarned: 0, newBadges: [] };
    }

    let earnedXp = 50; // Base lesson completion
    const nextLessons = [...completedLessonIds, lessonId];
    setCompletedLessonIds(nextLessons);

    const framework = frameworks.find(f => f.id === frameworkId);
    const mod = framework?.modules.find(m => m.id === moduleId);
    let nextModules = [...completedModuleIds];

    if (mod && !completedModuleIds.includes(moduleId)) {
      const allLessonsDone = mod.lessonIds.every(lid => nextLessons.includes(lid));
      if (allLessonsDone) {
        earnedXp += 100; // Module completion bonus
        nextModules.push(moduleId);
        setCompletedModuleIds(nextModules);
        triggerGamificationToast({
          type: 'xp',
          title: '+100 XP: Module Completed',
          message: `Finished all controls in ${mod.title}`,
          xpAmount: 100,
        });
      }
    }

    let nextFrameworks = [...completedFrameworkIds];
    if (framework && !completedFrameworkIds.includes(frameworkId)) {
      const allFrameworkLessonsDone = framework.lessons.every(l => nextLessons.includes(l.id));
      if (allFrameworkLessonsDone) {
        earnedXp += 500; // Framework completion bonus
        nextFrameworks.push(frameworkId);
        setCompletedFrameworkIds(nextFrameworks);
        triggerGamificationToast({
          type: 'xp',
          title: '+500 XP: Framework Mastered',
          message: `Completed full syllabus for ${framework.name}`,
          xpAmount: 500,
        });
      }
    }

    // Badge Evaluation
    const newlyUnlockedBadges: BadgeItem[] = [];
    const newUnlockedBadgeIds = [...unlockedBadgeIds];

    const checkAndUnlock = (badgeId: string) => {
      if (!newUnlockedBadgeIds.includes(badgeId)) {
        newUnlockedBadgeIds.push(badgeId);
        const badge = INITIAL_BADGES.find(b => b.id === badgeId);
        if (badge) {
          newlyUnlockedBadges.push(badge);
          setRecentBadgeUnlocked(badge);
          earnedXp += (badge.xpReward || 50);
          triggerGamificationToast({
            type: 'badge',
            title: `🏆 Badge Earned: ${badge.title}`,
            message: `${badge.description} (+${badge.xpReward || 50} XP)`,
            icon: badge.icon,
            xpAmount: badge.xpReward || 50,
          });
        }
      }
    };

    // 1. Learning Badges checks
    if (nextLessons.length >= 1) checkAndUnlock('badge-first-lesson');
    if (nextLessons.length >= 5) checkAndUnlock('badge-knowledge-builder');

    // Distinct frameworks studied
    const distinctFrameworks = new Set(
      nextLessons.map(id => {
        const fw = frameworks.find(f => f.lessons.some(l => l.id === id));
        return fw ? fw.id : null;
      }).filter(Boolean)
    );
    if (distinctFrameworks.size >= 3) checkAndUnlock('badge-framework-explorer');

    // Specialist Badges checks
    const isoCount = nextLessons.filter(id => id.startsWith('iso') || id.includes('27001')).length;
    if (isoCount >= 3) {
      checkAndUnlock('badge-iso-explorer');
      checkAndUnlock('badge-iso-champion');
    }
    const nistCount = nextLessons.filter(id => id.startsWith('nist') || id.includes('nist')).length;
    if (nistCount >= 3) checkAndUnlock('badge-nist-navigator');
    const privacyCount = nextLessons.filter(id => id.startsWith('gdpr') || id.includes('privacy') || id.includes('gdpr')).length;
    if (privacyCount >= 2) checkAndUnlock('badge-privacy-advocate');
    const riskCount = nextLessons.filter(id => id.startsWith('risk') || id.includes('risk') || id.includes('iso-31000')).length;
    if (riskCount >= 2) checkAndUnlock('badge-risk-hunter');
    const soc2Count = nextLessons.filter(id => id.startsWith('soc2') || id.includes('soc2')).length;
    if (soc2Count >= 3) checkAndUnlock('badge-soc2-scout');

    setUser(prev => {
      const streakInfo = computeNewStreak(prev.streakDays, prev.longestStreak, prev.lastActiveDate);

      // Streak badges check
      if (streakInfo.streakDays >= 3) checkAndUnlock('badge-consistent-learner');
      if (streakInfo.streakDays >= 7) checkAndUnlock('badge-7day-learner');
      if (streakInfo.streakDays >= 30) checkAndUnlock('badge-30day-commitment');

      // Daily learning activity bonus (+25 XP)
      let dailyBonus = 0;
      let nextDailyBonusDate = prev.lastDailyBonusDate;
      if (streakInfo.isNewActiveDay && prev.lastDailyBonusDate !== streakInfo.lastActiveDate) {
        dailyBonus = 25;
        nextDailyBonusDate = streakInfo.lastActiveDate;
        triggerGamificationToast({
          type: 'streak',
          title: `🔥 Active Streak: ${streakInfo.streakDays} Day${streakInfo.streakDays > 1 ? 's' : ''}`,
          message: '+25 XP Daily learning activity bonus verified.',
          xpAmount: 25,
        });
      }

      const totalXpToAdd = earnedXp + dailyBonus;
      const prevLevelInfo = getUserLevelDetails(prev.xp);
      const nextXp = prev.xp + totalXpToAdd;
      const nextLevelInfo = getUserLevelDetails(nextXp);

      if (nextXp >= 5000) checkAndUnlock('badge-lead-auditor');

      // Toast for base lesson completion
      triggerGamificationToast({
        type: 'xp',
        title: '+50 XP: Lesson Mastered',
        message: `Verified compliance audit progress. Total XP: ${nextXp.toLocaleString()}`,
        xpAmount: 50,
      });

      // Level progression promotion
      if (nextLevelInfo.levelNumber > prevLevelInfo.levelNumber) {
        triggerGamificationToast({
          type: 'level',
          title: `🎖️ Level Up: ${nextLevelInfo.levelTitle}`,
          message: `Congratulations! You reached Level ${nextLevelInfo.levelNumber}.`,
          icon: 'Crown',
        });
      }

      setUnlockedBadgeIds(newUnlockedBadgeIds);

      const nextUser: UserProfile = {
        ...prev,
        xp: nextXp,
        level: nextLevelInfo.levelTitle,
        levelNumber: nextLevelInfo.levelNumber,
        streakDays: streakInfo.streakDays,
        longestStreak: streakInfo.longestStreak,
        lastActiveDate: streakInfo.lastActiveDate,
        lastDailyBonusDate: nextDailyBonusDate,
        totalLessonsCompleted: nextLessons.length,
      };

      // Async Cloud Sync to Supabase
      if (isSupabaseActive) {
        supabaseDbService.upsertProfile(nextUser).catch(console.warn);
        supabaseDbService.saveUserProgress(prev.uid, {
          completedLessons: nextLessons,
          completedModules: nextModules,
          completedFrameworks: nextFrameworks,
          unlockedBadges: newUnlockedBadgeIds,
        }).catch(console.warn);
      }

      return nextUser;
    });

    return { xpEarned, newBadges: newlyUnlockedBadges };
  }, [completedLessonIds, completedModuleIds, completedFrameworkIds, frameworks, unlockedBadgeIds, isSupabaseActive, triggerGamificationToast]);

  // Complete Learning Path (Idempotent +500 XP & Badge)
  const completeLearningPath = useCallback((pathId: string) => {
    if (completedLearningPathIds.includes(pathId)) {
      return { xpEarned: 0, newBadges: [] };
    }

    const nextPaths = [...completedLearningPathIds, pathId];
    setCompletedLearningPathIds(nextPaths);

    let earnedXp = 500; // Learning path completion bonus
    const newlyUnlockedBadges: BadgeItem[] = [];
    const newUnlockedBadgeIds = [...unlockedBadgeIds];

    const checkAndUnlock = (badgeId: string) => {
      if (!newUnlockedBadgeIds.includes(badgeId)) {
        newUnlockedBadgeIds.push(badgeId);
        const badge = INITIAL_BADGES.find(b => b.id === badgeId);
        if (badge) {
          newlyUnlockedBadges.push(badge);
          setRecentBadgeUnlocked(badge);
          earnedXp += (badge.xpReward || 50);
          triggerGamificationToast({
            type: 'badge',
            title: `🏆 Badge Earned: ${badge.title}`,
            message: `${badge.description} (+${badge.xpReward || 50} XP)`,
            icon: badge.icon,
            xpAmount: badge.xpReward || 50,
          });
        }
      }
    };

    if (nextPaths.length >= 1) checkAndUnlock('badge-compliance-explorer');

    setUser(prev => {
      const streakInfo = computeNewStreak(prev.streakDays, prev.longestStreak, prev.lastActiveDate);
      let dailyBonus = 0;
      let nextDailyBonusDate = prev.lastDailyBonusDate;
      if (streakInfo.isNewActiveDay && prev.lastDailyBonusDate !== streakInfo.lastActiveDate) {
        dailyBonus = 25;
        nextDailyBonusDate = streakInfo.lastActiveDate;
      }

      const totalXpToAdd = earnedXp + dailyBonus;
      const prevLevelInfo = getUserLevelDetails(prev.xp);
      const nextXp = prev.xp + totalXpToAdd;
      const nextLevelInfo = getUserLevelDetails(nextXp);

      triggerGamificationToast({
        type: 'xp',
        title: '+500 XP: Learning Path Mastered',
        message: `Milestone verified! Total XP: ${nextXp.toLocaleString()}`,
        xpAmount: 500,
      });

      if (nextLevelInfo.levelNumber > prevLevelInfo.levelNumber) {
        triggerGamificationToast({
          type: 'level',
          title: `🎖️ Level Up: ${nextLevelInfo.levelTitle}`,
          message: `Congratulations! You reached Level ${nextLevelInfo.levelNumber}.`,
          icon: 'Crown',
        });
      }

      setUnlockedBadgeIds(newUnlockedBadgeIds);

      const nextUser: UserProfile = {
        ...prev,
        xp: nextXp,
        level: nextLevelInfo.levelTitle,
        levelNumber: nextLevelInfo.levelNumber,
        streakDays: streakInfo.streakDays,
        longestStreak: streakInfo.longestStreak,
        lastActiveDate: streakInfo.lastActiveDate,
        lastDailyBonusDate: nextDailyBonusDate,
      };

      if (isSupabaseActive) {
        supabaseDbService.upsertProfile(nextUser).catch(console.warn);
      }

      return nextUser;
    });

    return { xpEarned, newBadges: newlyUnlockedBadges };
  }, [completedLearningPathIds, unlockedBadgeIds, isSupabaseActive, triggerGamificationToast]);

  const isLearningPathCompleted = (pathId: string) => completedLearningPathIds.includes(pathId);

  // Custom XP Awarding (Idempotent / Server-verified)
  const awardCustomXp = useCallback((amount: number, reason: string) => {
    if (amount <= 0) return;
    setUser(prev => {
      const prevLevelInfo = getUserLevelDetails(prev.xp);
      const nextXp = prev.xp + amount;
      const nextLevelInfo = getUserLevelDetails(nextXp);
      const streakInfo = computeNewStreak(prev.streakDays, prev.longestStreak, prev.lastActiveDate);

      triggerGamificationToast({
        type: 'xp',
        title: `+${amount} XP Awarded`,
        message: reason,
        xpAmount: amount,
      });

      if (nextLevelInfo.levelNumber > prevLevelInfo.levelNumber) {
        triggerGamificationToast({
          type: 'level',
          title: `🎖️ Level Up: ${nextLevelInfo.levelTitle}`,
          message: `You advanced to Level ${nextLevelInfo.levelNumber}!`,
          icon: 'Crown',
        });
      }

      const updatedUser: UserProfile = {
        ...prev,
        xp: nextXp,
        level: nextLevelInfo.levelTitle,
        levelNumber: nextLevelInfo.levelNumber,
        streakDays: streakInfo.streakDays,
        longestStreak: streakInfo.longestStreak,
        lastActiveDate: streakInfo.lastActiveDate,
      };

      if (isSupabaseActive) {
        supabaseDbService.upsertProfile(updatedUser).catch(console.warn);
      }
      return updatedUser;
    });
  }, [isSupabaseActive, triggerGamificationToast]);

  const isLessonCompleted = (lessonId: string) => completedLessonIds.includes(lessonId);
  const isModuleCompleted = (moduleId: string) => completedModuleIds.includes(moduleId);
  const isFrameworkCompleted = (frameworkId: string) => completedFrameworkIds.includes(frameworkId);

  // Exam Engine
  const startExam = (
    paramOrType: ExamType | {
      examType: ExamType;
      frameworkId?: string;
      questionCount?: number;
      durationMinutes?: number;
      title?: string;
      isUntimed?: boolean;
      specificQuestions?: QuestionItem[];
    },
    frameworkIdParam?: string
  ): ExamSession => {
    let examType: ExamType = 'quick';
    let frameworkId: string | undefined = undefined;
    let customQuestionCount: number | undefined = undefined;
    let customDurationMinutes: number | undefined = undefined;
    let customTitle: string | undefined = undefined;
    let isUntimed = false;
    let specificQuestions: QuestionItem[] | undefined = undefined;

    if (typeof paramOrType === 'object') {
      examType = paramOrType.examType;
      frameworkId = paramOrType.frameworkId;
      customQuestionCount = paramOrType.questionCount;
      customDurationMinutes = paramOrType.durationMinutes;
      customTitle = paramOrType.title;
      isUntimed = !!paramOrType.isUntimed;
      specificQuestions = paramOrType.specificQuestions;
    } else {
      examType = paramOrType;
      frameworkId = frameworkIdParam;
    }

    let pool = specificQuestions && specificQuestions.length > 0 ? [...specificQuestions] : [...questions];
    if (frameworkId && frameworkId !== 'all' && (!specificQuestions || specificQuestions.length === 0)) {
      const filtered = pool.filter(q => q.frameworkId === frameworkId);
      if (filtered.length > 0) {
        pool = filtered;
      }
    }

    let count = customQuestionCount || 10;
    let timeLimitMinutes = customDurationMinutes || 15;

    if (!customQuestionCount) {
      if (examType === 'standard') {
        count = 25;
        timeLimitMinutes = 35;
      } else if (examType === 'professional') {
        count = 50;
        timeLimitMinutes = 65;
      } else if (examType === 'scenario') {
        count = 10;
        timeLimitMinutes = 30;
      }
    }

    const shuffledQuestions = pool.sort(() => Math.random() - 0.5).slice(0, Math.min(count, pool.length));

    while (shuffledQuestions.length < count && pool.length > 0) {
      const clone = { ...pool[shuffledQuestions.length % pool.length], id: `q-dup-${Date.now()}-${shuffledQuestions.length}` };
      shuffledQuestions.push(clone);
    }

    const computedTitle = customTitle || (frameworkId && frameworkId !== 'all'
      ? `${frameworks.find(f => f.id === frameworkId)?.shortName || 'Framework'} Assessment`
      : `${examType.toUpperCase()} Compliance Assessment`);

    const session: ExamSession = {
      examId: 'session-' + Date.now(),
      examType,
      title: computedTitle,
      frameworkId,
      questions: shuffledQuestions,
      shuffledOptionOrders: shuffledQuestions.map(q => q.options.map((_, i) => i)),
      selectedAnswers: {},
      flaggedQuestions: {},
      startTime: Date.now(),
      timeLimitSeconds: timeLimitMinutes * 60,
      timeRemainingSeconds: timeLimitMinutes * 60,
      isUntimed,
      isPaused: false,
      isSubmitted: false,
    };

    setActiveExamSession(session);
    return session;
  };

  const togglePauseExamTimer = () => {
    setActiveExamSession(prev => {
      if (!prev) return null;
      return {
        ...prev,
        isPaused: !prev.isPaused,
      };
    });
  };

  const saveActiveExamAnswer = (questionId: string, optionIndex: number) => {
    setActiveExamSession(prev => {
      if (!prev) return null;
      return {
        ...prev,
        selectedAnswers: {
          ...prev.selectedAnswers,
          [questionId]: optionIndex,
        },
      };
    });
  };

  const toggleFlagQuestion = (questionId: string) => {
    setActiveExamSession(prev => {
      if (!prev) return null;
      return {
        ...prev,
        flaggedQuestions: {
          ...prev.flaggedQuestions,
          [questionId]: !prev.flaggedQuestions[questionId],
        },
      };
    });
  };

  const updateActiveExamTimer = (secondsRemaining: number) => {
    setActiveExamSession(prev => {
      if (!prev) return null;
      return {
        ...prev,
        timeRemainingSeconds: Math.max(0, secondsRemaining),
      };
    });
  };

  const submitActiveExam = async (timeSpentSeconds: number): Promise<ExamResult> => {
    if (!activeExamSession) {
      throw new Error('No active exam session to submit');
    }

    const { examType, selectedAnswers, questions: examQuestions, frameworkId, title } = activeExamSession;

    let correctCount = 0;
    const domainStats: Record<string, { total: number; correct: number }> = {};
    const typeStats: Record<string, { total: number; correct: number }> = {};

    const detailedAnswers = examQuestions.map(q => {
      const chosen = selectedAnswers[q.id];
      const isCorrect = chosen !== undefined && chosen === q.correctIndex;
      if (isCorrect) correctCount += 1;

      const domain = q.domain || 'General Compliance';
      if (!domainStats[domain]) domainStats[domain] = { total: 0, correct: 0 };
      domainStats[domain].total += 1;
      if (isCorrect) domainStats[domain].correct += 1;

      const qType = q.questionType || (q.options.length === 2 && q.options[0].toLowerCase().includes('true') ? 'true_false' : (q.scenarioText ? 'scenario' : 'multiple_choice'));
      if (!typeStats[qType]) typeStats[qType] = { total: 0, correct: 0 };
      typeStats[qType].total += 1;
      if (isCorrect) typeStats[qType].correct += 1;

      return {
        questionId: q.id,
        questionText: q.question,
        questionType: qType,
        scenarioText: q.scenarioText,
        sourceStandard: q.sourceStandard,
        selectedOptionIndex: chosen ?? -1,
        selectedOptionText: chosen !== undefined && q.options[chosen] ? q.options[chosen] : 'No answer provided',
        correctOptionIndex: q.correctIndex,
        correctOptionText: q.options[q.correctIndex],
        isCorrect,
        explanation: q.explanation,
        domain,
      };
    });

    const total = examQuestions.length;
    const scorePercentage = total > 0 ? Math.round((correctCount / total) * 100) : 0;
    const passed = scorePercentage >= 75;

    let xpEarned = passed ? 150 : 50;
    if (passed) {
      if (examType === 'professional' || total >= 50) xpEarned = 500;
      else if (examType === 'scenario' || total >= 30) xpEarned = 400;
      else if (examType === 'standard' || total >= 20) xpEarned = 300;
      if (scorePercentage >= 90) xpEarned += 100; // Excellence bonus
      if (scorePercentage === 100) xpEarned += 50; // Perfect score bonus
    }

    const domainBreakdown: Record<string, { total: number; correct: number; percentage: number }> = {};
    for (const [domain, stats] of Object.entries(domainStats)) {
      domainBreakdown[domain] = {
        total: stats.total,
        correct: stats.correct,
        percentage: stats.total > 0 ? Math.round((stats.correct / stats.total) * 100) : 0,
      };
    }

    const typeBreakdown: Record<string, { total: number; correct: number; percentage: number }> = {};
    for (const [tKey, stats] of Object.entries(typeStats)) {
      typeBreakdown[tKey] = {
        total: stats.total,
        correct: stats.correct,
        percentage: stats.total > 0 ? Math.round((stats.correct / stats.total) * 100) : 0,
      };
    }

    const result: ExamResult = {
      id: 'result-' + Date.now(),
      userId: user.uid,
      examType,
      frameworkId,
      frameworkTitle: title,
      totalQuestions: total,
      correctAnswers: correctCount,
      scorePercentage,
      passed,
      xpEarned,
      timeSpentSeconds,
      completedAt: new Date().toISOString(),
      answers: detailedAnswers,
      domainBreakdown,
      typeBreakdown,
    };

    setExamHistory(prev => [result, ...prev]);
    setActiveExamSession(null);
    setLastExamResult(result);

    // Assessment Badge Checks
    const newlyUnlockedBadges: BadgeItem[] = [];
    const newUnlocked = [...unlockedBadgeIds];

    const checkAndUnlockBadge = (bId: string) => {
      if (!newUnlocked.includes(bId)) {
        newUnlocked.push(bId);
        const b = INITIAL_BADGES.find(i => i.id === bId);
        if (b) {
          newlyUnlockedBadges.push(b);
          setRecentBadgeUnlocked(b);
          xpEarned += (b.xpReward || 50);
          triggerGamificationToast({
            type: 'badge',
            title: `🏆 Badge Earned: ${b.title}`,
            message: `${b.description} (+${b.xpReward || 50} XP)`,
            icon: b.icon,
            xpAmount: b.xpReward || 50,
          });
        }
      }
    };

    checkAndUnlockBadge('badge-assessment-starter');
    if (passed) checkAndUnlockBadge('badge-exam-pass');
    if (scorePercentage >= 80) checkAndUnlockBadge('badge-knowledge-master');
    if (scorePercentage >= 90) {
      const prior90Count = examHistory.filter(e => e.scorePercentage >= 90).length;
      if (prior90Count >= 1) checkAndUnlockBadge('badge-assessment-expert');
    }
    if (scorePercentage === 100) checkAndUnlockBadge('badge-exam-perfect');

    setUnlockedBadgeIds(newUnlocked);

    setUser(prev => {
      const nextExamsCount = prev.totalExamsCompleted + 1;
      const currentAvg = prev.averageScore || 80;
      const newAvg = Math.round((currentAvg * prev.totalExamsCompleted + scorePercentage) / nextExamsCount);
      const streakInfo = computeNewStreak(prev.streakDays, prev.longestStreak, prev.lastActiveDate);

      let dailyBonus = 0;
      let nextDailyBonusDate = prev.lastDailyBonusDate;
      if (streakInfo.isNewActiveDay && prev.lastDailyBonusDate !== streakInfo.lastActiveDate) {
        dailyBonus = 25;
        nextDailyBonusDate = streakInfo.lastActiveDate;
        triggerGamificationToast({
          type: 'streak',
          title: `🔥 Daily Streak: ${streakInfo.streakDays} Day${streakInfo.streakDays > 1 ? 's' : ''}`,
          message: '+25 XP Daily learning activity bonus.',
          xpAmount: 25,
        });
      }

      const totalXpToAdd = xpEarned + dailyBonus;
      const prevLevelInfo = getUserLevelDetails(prev.xp);
      const nextXp = prev.xp + totalXpToAdd;
      const nextLevelInfo = getUserLevelDetails(nextXp);

      if (nextXp >= 5000) checkAndUnlockBadge('badge-lead-auditor');

      triggerGamificationToast({
        type: 'xp',
        title: passed ? `+${xpEarned} XP: Exam Passed (${scorePercentage}%)` : `+${xpEarned} XP: Assessment Completed`,
        message: passed ? 'Excellent compliance audit knowledge demonstrated.' : 'Review explanations and retake to improve score.',
        xpAmount: xpEarned,
      });

      if (nextLevelInfo.levelNumber > prevLevelInfo.levelNumber) {
        triggerGamificationToast({
          type: 'level',
          title: `🎖️ Level Up: ${nextLevelInfo.levelTitle}`,
          message: `Congratulations! You reached Level ${nextLevelInfo.levelNumber}.`,
          icon: 'Crown',
        });
      }

      const updatedUser = {
        ...prev,
        xp: nextXp,
        level: nextLevelInfo.levelTitle,
        levelNumber: nextLevelInfo.levelNumber,
        streakDays: streakInfo.streakDays,
        longestStreak: streakInfo.longestStreak,
        lastActiveDate: streakInfo.lastActiveDate,
        lastDailyBonusDate: nextDailyBonusDate,
        totalExamsCompleted: nextExamsCount,
        averageScore: newAvg,
      };

      if (isSupabaseActive) {
        supabaseDbService.upsertProfile(updatedUser).catch(console.warn);
        supabaseDbService.saveExamResult(result, prev.uid).catch(console.warn);
        supabaseDbService.saveUserProgress(prev.uid, {
          unlockedBadges: newUnlocked,
        }).catch(console.warn);
      }

      return updatedUser;
    });

    return result;
  };

  const cancelActiveExam = () => {
    setActiveExamSession(null);
  };

  const clearRecentBadge = () => {
    setRecentBadgeUnlocked(null);
  };

  // Gap Analysis Items (normalized)
  const gapItems: GapAnalysisItem[] = gapAssessments.map(g => ({
    id: g.id,
    frameworkId: g.frameworkId,
    controlCode: g.controlCode,
    title: g.controlTitle,
    description: g.notes || 'Standard control verification',
    status: (g.status === 'fully_compliant' ? 'compliant' : g.status) as ComplianceStatus,
    riskLevel: (g.riskLevel ? g.riskLevel.toLowerCase() : 'high') as any,
  }));

  const updateGapItemStatus = (id: string, status: ComplianceStatus) => {
    const rawStatus = status === 'compliant' ? 'fully_compliant' : status;
    updateGapAssessment(id, { status: rawStatus as any });
  };

  const addGapItem = (item: Omit<GapAnalysisItem, 'id'>) => {
    const rawStatus = item.status === 'compliant' ? 'fully_compliant' : item.status;
    addGapAssessment({
      frameworkId: item.frameworkId,
      controlCode: item.controlCode,
      controlTitle: item.title,
      category: 'General Security',
      status: rawStatus as any,
      notes: item.description,
      riskLevel: (item.riskLevel.charAt(0).toUpperCase() + item.riskLevel.slice(1)) as any,
    });
  };

  const updateGapAssessment = (id: string, updates: Partial<GapAssessmentItem>) => {
    setGapAssessments(prev => {
      const next = prev.map(item => item.id === id ? { ...item, ...updates } : item);
      if (isSupabaseActive) {
        const target = next.find(item => item.id === id);
        if (target) supabaseDbService.saveGapAssessment(target, user.uid).catch(console.warn);
      }
      return next;
    });
  };

  const addGapAssessment = (item: Omit<GapAssessmentItem, 'id'>) => {
    const newItem: GapAssessmentItem = {
      ...item,
      id: 'gap-' + Date.now(),
    };
    setGapAssessments(prev => {
      const next = [newItem, ...prev];
      if (isSupabaseActive) {
        supabaseDbService.saveGapAssessment(newItem, user.uid).catch(console.warn);
      }
      return next;
    });
  };

  // Question Bank Operations
  const addQuestion = (newQ: Omit<QuestionItem, 'id'>) => {
    const item: QuestionItem = {
      ...newQ,
      id: 'q-custom-' + Date.now(),
    };
    const nextList = [item, ...questions];
    setQuestions(nextList);
    const customOnly = nextList.filter(q => q.id.startsWith('q-custom-'));
    localStorage.setItem(STORAGE_KEYS.CUSTOM_QUESTIONS, JSON.stringify(customOnly));
  };

  const deleteQuestion = (id: string) => {
    const nextList = questions.filter(q => q.id !== id);
    setQuestions(nextList);
    const customOnly = nextList.filter(q => q.id.startsWith('q-custom-'));
    localStorage.setItem(STORAGE_KEYS.CUSTOM_QUESTIONS, JSON.stringify(customOnly));
  };

  const resetAllDemoData = () => {
    localStorage.clear();
    setUser(DEFAULT_USER);
    setCompletedLessonIds([]);
    setCompletedModuleIds([]);
    setCompletedFrameworkIds([]);
    setExamHistory([]);
    setActiveExamSession(null);
    setUnlockedBadgeIds(['badge-welcome']);
    setGapAssessments(INITIAL_GAP_ASSESSMENTS);
    setQuestions(QUESTION_BANK);
  };

  const resetToDemoData = resetAllDemoData;

  // AI Modal Controls
  const openAiModal = (context?: { framework?: string; topic?: string; prompt?: string }) => {
    if (context?.prompt) setAiModalInitialPrompt(context.prompt);
    else setAiModalInitialPrompt('');
    setAiModalContext({ framework: context?.framework, topic: context?.topic });
    setIsAiModalOpen(true);
  };

  const closeAiModal = () => {
    setIsAiModalOpen(false);
  };

  // Auth Prompt Alert / Modal Controls
  const openAuthPrompt = (info?: {
    title?: string;
    message?: string;
    targetTab?: string;
    frameworkId?: string;
  }) => {
    setAuthPromptInfo(info || null);
    setIsAuthPromptOpen(true);
  };

  const closeAuthPrompt = () => {
    setIsAuthPromptOpen(false);
    setAuthPromptInfo(null);
  };

  return (
    <AuthAndDataContext.Provider
      value={{
        user,
        role: user.role,
        isAuthenticated,
        setUserRole,
        updateUserProfile,
        loginAs,
        signup,
        loginWithCredentials,
        startFreshUser,
        logout,
        requestPasswordResetOtp,
        verifyPasswordResetOtp,
        resetPasswordWithOtp,
        isSupabaseActive,
        supabaseSyncStatus,
        lastCloudSyncTime,
        syncDataToCloud,
        frameworks,
        completedLessonIds,
        completedModuleIds,
        completedFrameworkIds,
        completeLesson,
        isLessonCompleted,
        isModuleCompleted,
        isFrameworkCompleted,
        completedLearningPathIds,
        completeLearningPath,
        isLearningPathCompleted,
        awardCustomXp,
        gamificationToasts,
        triggerGamificationToast,
        dismissGamificationToast,
        questions,
        examHistory,
        activeExamSession,
        startExam,
        togglePauseExamTimer,
        saveActiveExamAnswer,
        toggleFlagQuestion,
        updateActiveExamTimer,
        submitActiveExam,
        cancelActiveExam,
        lastExamResult,
        setLastExamResult,
        badges: INITIAL_BADGES,
        unlockedBadgeIds,
        recentBadgeUnlocked,
        clearRecentBadge,
        gapItems,
        gapAssessments,
        updateGapItemStatus,
        addGapItem,
        updateGapAssessment,
        addGapAssessment,
        learningPaths: LEARNING_PATHS,
        addQuestion,
        addCustomQuestion: addQuestion,
        deleteQuestion,
        resetAllDemoData,
        resetToDemoData: resetAllDemoData,
        isAiModalOpen,
        openAiModal,
        closeAiModal,
        aiModalInitialPrompt,
        aiModalContext,
        isAuthPromptOpen,
        authPromptInfo,
        openAuthPrompt,
        closeAuthPrompt,
      }}
    >
      {children}
    </AuthAndDataContext.Provider>
  );
};

export const useAuthAndData = (): AuthAndDataContextType => {
  const context = useContext(AuthAndDataContext);
  if (!context) {
    throw new Error('useAuthAndData must be used within an AuthAndDataProvider');
  }
  return context;
};
