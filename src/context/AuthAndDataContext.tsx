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
  GapAssessmentItem,
  GapAnalysisItem,
  ComplianceStatus,
  LearningPath
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

  // Exam System
  questions: QuestionItem[];
  examHistory: ExamResult[];
  activeExamSession: ExamSession | null;
  startExam: (examType: 'quick' | 'standard' | 'professional' | 'custom', frameworkId?: string) => ExamSession;
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
}

const STORAGE_KEYS = {
  USER: 'complianceverse_user_v3',
  COMPLETED_LESSONS: 'complianceverse_completed_lessons_v3',
  COMPLETED_MODULES: 'complianceverse_completed_modules_v3',
  COMPLETED_FRAMEWORKS: 'complianceverse_completed_frameworks_v3',
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
  level: 'Beginner',
  xp: 0,
  streakDays: 0,
  lastActiveDate: new Date().toISOString().split('T')[0],
  totalLessonsCompleted: 0,
  totalExamsCompleted: 0,
  averageScore: 0,
  createdAt: new Date().toISOString(),
};

function calculateLevelFromXp(xp: number): UserLevel {
  if (xp >= 2000) return 'Lead Auditor';
  if (xp >= 1200) return 'Expert';
  if (xp >= 600) return 'Advanced';
  if (xp >= 250) return 'Intermediate';
  return 'Beginner';
}

function computeNewStreak(prevStreak: number = 0, lastActiveDate?: string): { streakDays: number; lastActiveDate: string } {
  const today = new Date().toISOString().split('T')[0];
  if (!lastActiveDate || prevStreak === 0) {
    return { streakDays: 1, lastActiveDate: today };
  }
  if (lastActiveDate === today) {
    return { streakDays: prevStreak, lastActiveDate: today };
  }
  const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
  if (lastActiveDate === yesterday) {
    return { streakDays: prevStreak + 1, lastActiveDate: today };
  }
  return { streakDays: 1, lastActiveDate: today };
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

  // Comply AI global modal state
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [aiModalInitialPrompt, setAiModalInitialPrompt] = useState('');
  const [aiModalContext, setAiModalContext] = useState<{ framework?: string; topic?: string } | undefined>(undefined);

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

  // Lesson & Progress Tracking
  const completeLesson = useCallback((lessonId: string, frameworkId: string, moduleId: string) => {
    let earnedXp = 0;
    const newBadges: BadgeItem[] = [];

    if (!completedLessonIds.includes(lessonId)) {
      earnedXp += 50;
      const nextLessons = [...completedLessonIds, lessonId];
      setCompletedLessonIds(nextLessons);

      const framework = frameworks.find(f => f.id === frameworkId);
      const mod = framework?.modules.find(m => m.id === moduleId);
      let nextModules = [...completedModuleIds];

      if (mod && !completedModuleIds.includes(moduleId)) {
        const allLessonsDone = mod.lessonIds.every(lid => nextLessons.includes(lid));
        if (allLessonsDone) {
          earnedXp += 100;
          nextModules.push(moduleId);
          setCompletedModuleIds(nextModules);
        }
      }

      let nextFrameworks = [...completedFrameworkIds];
      if (framework && !completedFrameworkIds.includes(frameworkId)) {
        const allFrameworkLessonsDone = framework.lessons.every(l => nextLessons.includes(l.id));
        if (allFrameworkLessonsDone) {
          earnedXp += 500;
          nextFrameworks.push(frameworkId);
          setCompletedFrameworkIds(nextFrameworks);
        }
      }

      // Badge Checks
      const newUnlockedBadgeIds = [...unlockedBadgeIds];
      const checkAndUnlock = (badgeId: string) => {
        if (!newUnlockedBadgeIds.includes(badgeId)) {
          newUnlockedBadgeIds.push(badgeId);
          const badge = INITIAL_BADGES.find(b => b.id === badgeId);
          if (badge) {
            newBadges.push(badge);
            setRecentBadgeUnlocked(badge);
          }
        }
      };

      if (nextLessons.length >= 1) checkAndUnlock('badge-first-lesson');
      const soc2CompletedCount = nextLessons.filter(id => id.startsWith('soc2')).length;
      if (soc2CompletedCount >= 3) checkAndUnlock('badge-soc2-scout');
      const isoCompletedCount = nextLessons.filter(id => id.startsWith('iso')).length;
      if (isoCompletedCount >= 3) checkAndUnlock('badge-iso-champion');

      setUnlockedBadgeIds(newUnlockedBadgeIds);

      setUser(prev => {
        const nextXp = prev.xp + earnedXp;
        const nextLevel = calculateLevelFromXp(nextXp);
        if (nextXp >= 1500) checkAndUnlock('badge-lead-auditor');
        const streakInfo = computeNewStreak(prev.streakDays, prev.lastActiveDate);
        const nextUser = {
          ...prev,
          xp: nextXp,
          level: nextLevel,
          streakDays: streakInfo.streakDays,
          lastActiveDate: streakInfo.lastActiveDate,
          totalLessonsCompleted: nextLessons.length,
        };

        // Async Cloud Sync
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
    }

    return { xpEarned: earnedXp, newBadges };
  }, [completedLessonIds, completedModuleIds, completedFrameworkIds, frameworks, unlockedBadgeIds, isSupabaseActive]);

  const isLessonCompleted = (lessonId: string) => completedLessonIds.includes(lessonId);
  const isModuleCompleted = (moduleId: string) => completedModuleIds.includes(moduleId);
  const isFrameworkCompleted = (frameworkId: string) => completedFrameworkIds.includes(frameworkId);

  // Exam Engine
  const startExam = (examType: 'quick' | 'standard' | 'professional' | 'custom', frameworkId?: string): ExamSession => {
    let pool = [...questions];
    if (frameworkId) {
      pool = pool.filter(q => q.frameworkId === frameworkId);
      if (pool.length === 0) pool = [...questions];
    }

    let count = 10;
    let timeLimitMinutes = 15;
    if (examType === 'standard') {
      count = 25;
      timeLimitMinutes = 35;
    } else if (examType === 'professional') {
      count = 50;
      timeLimitMinutes = 65;
    }

    const shuffledQuestions = pool.sort(() => Math.random() - 0.5).slice(0, Math.min(count, pool.length));

    while (shuffledQuestions.length < count && pool.length > 0) {
      const clone = { ...pool[shuffledQuestions.length % pool.length], id: `q-dup-${Date.now()}-${shuffledQuestions.length}` };
      shuffledQuestions.push(clone);
    }

    const session: ExamSession = {
      examId: 'session-' + Date.now(),
      examType,
      title: frameworkId ? `${frameworks.find(f => f.id === frameworkId)?.shortName || 'Framework'} Assessment` : `${examType.toUpperCase()} Compliance Assessment`,
      frameworkId,
      questions: shuffledQuestions,
      shuffledOptionOrders: shuffledQuestions.map(q => q.options.map((_, i) => i)),
      selectedAnswers: {},
      flaggedQuestions: {},
      startTime: Date.now(),
      timeLimitSeconds: timeLimitMinutes * 60,
      timeRemainingSeconds: timeLimitMinutes * 60,
      isSubmitted: false,
    };

    setActiveExamSession(session);
    return session;
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

    const detailedAnswers = examQuestions.map(q => {
      const chosen = selectedAnswers[q.id];
      const isCorrect = chosen !== undefined && chosen === q.correctIndex;
      if (isCorrect) correctCount += 1;

      const domain = q.domain || 'General Compliance';
      if (!domainStats[domain]) domainStats[domain] = { total: 0, correct: 0 };
      domainStats[domain].total += 1;
      if (isCorrect) domainStats[domain].correct += 1;

      return {
        questionId: q.id,
        questionText: q.question,
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

    let xpEarned = 25;
    if (passed) {
      if (examType === 'professional' || total >= 50) xpEarned = 500;
      else if (examType === 'standard' || total >= 25) xpEarned = 250;
      else xpEarned = 100;
      if (scorePercentage === 100) xpEarned += 50;
    }

    const domainBreakdown: Record<string, { total: number; correct: number; percentage: number }> = {};
    for (const [domain, stats] of Object.entries(domainStats)) {
      domainBreakdown[domain] = {
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
    };

    setExamHistory(prev => [result, ...prev]);
    setActiveExamSession(null);
    setLastExamResult(result);

    const newUnlocked = [...unlockedBadgeIds];
    if (passed && !newUnlocked.includes('badge-exam-pass')) {
      newUnlocked.push('badge-exam-pass');
      const b = INITIAL_BADGES.find(i => i.id === 'badge-exam-pass');
      if (b) setRecentBadgeUnlocked(b);
    }
    if (scorePercentage === 100 && !newUnlocked.includes('badge-exam-perfect')) {
      newUnlocked.push('badge-exam-perfect');
      const b = INITIAL_BADGES.find(i => i.id === 'badge-exam-perfect');
      if (b) setRecentBadgeUnlocked(b);
    }
    setUnlockedBadgeIds(newUnlocked);

    setUser(prev => {
      const nextXp = prev.xp + xpEarned;
      const nextExamsCount = prev.totalExamsCompleted + 1;
      const currentAvg = prev.averageScore || 80;
      const newAvg = Math.round((currentAvg * prev.totalExamsCompleted + scorePercentage) / nextExamsCount);
      const streakInfo = computeNewStreak(prev.streakDays, prev.lastActiveDate);
      const updatedUser = {
        ...prev,
        xp: nextXp,
        level: calculateLevelFromXp(nextXp),
        streakDays: streakInfo.streakDays,
        lastActiveDate: streakInfo.lastActiveDate,
        totalExamsCompleted: nextExamsCount,
        averageScore: newAvg,
      };

      if (isSupabaseActive) {
        supabaseDbService.upsertProfile(updatedUser).catch(console.warn);
        supabaseDbService.saveExamResult(result, prev.uid).catch(console.warn);
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
        questions,
        examHistory,
        activeExamSession,
        startExam,
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
