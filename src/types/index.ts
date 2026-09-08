export type UserRole = 'student' | 'instructor' | 'admin';

export type UserLevel =
  | 'Compliance Explorer'
  | 'Security Learner'
  | 'Risk Analyst'
  | 'Compliance Specialist'
  | 'GRC Professional'
  | 'Security Strategist'
  | 'Enterprise Compliance Expert'
  | 'Beginner'
  | 'Intermediate'
  | 'Advanced'
  | 'Expert'
  | 'Lead Auditor';

export type DifficultyLevel = 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';

export interface UserLevelInfo {
  level: number;
  title: UserLevel;
  minXp: number;
  maxXp: number;
  badgeIcon: string;
  description: string;
}

export const USER_LEVEL_THRESHOLDS: UserLevelInfo[] = [
  {
    level: 1,
    title: 'Compliance Explorer',
    minXp: 0,
    maxXp: 500,
    badgeIcon: 'Compass',
    description: 'Starting the compliance and information security journey.',
  },
  {
    level: 2,
    title: 'Security Learner',
    minXp: 500,
    maxXp: 1500,
    badgeIcon: 'Shield',
    description: 'Acquiring cybersecurity fundamentals and core standards.',
  },
  {
    level: 3,
    title: 'Risk Analyst',
    minXp: 1500,
    maxXp: 3000,
    badgeIcon: 'SlidersHorizontal',
    description: 'Analyzing risk registers, threat vectors, and control testing.',
  },
  {
    level: 4,
    title: 'Compliance Specialist',
    minXp: 3000,
    maxXp: 5000,
    badgeIcon: 'CheckCircle',
    description: 'Implementing technical safeguards and audit evidence procedures.',
  },
  {
    level: 5,
    title: 'GRC Professional',
    minXp: 5000,
    maxXp: 8000,
    badgeIcon: 'Award',
    description: 'Governing multi-framework architectures and cross-mapping.',
  },
  {
    level: 6,
    title: 'Security Strategist',
    minXp: 8000,
    maxXp: 12000,
    badgeIcon: 'Zap',
    description: 'Designing enterprise compliance roadmaps and risk strategies.',
  },
  {
    level: 7,
    title: 'Enterprise Compliance Expert',
    minXp: 12000,
    maxXp: 25000,
    badgeIcon: 'Crown',
    description: 'Executive audit defense, continuous compliance mastery.',
  },
];

export function getUserLevelDetails(xp: number) {
  const safeXp = Math.max(0, xp || 0);
  let currentLevel = USER_LEVEL_THRESHOLDS[0];
  let nextLevel: UserLevelInfo | null = USER_LEVEL_THRESHOLDS[1];

  for (let i = USER_LEVEL_THRESHOLDS.length - 1; i >= 0; i--) {
    if (safeXp >= USER_LEVEL_THRESHOLDS[i].minXp) {
      currentLevel = USER_LEVEL_THRESHOLDS[i];
      nextLevel = i < USER_LEVEL_THRESHOLDS.length - 1 ? USER_LEVEL_THRESHOLDS[i + 1] : null;
      break;
    }
  }

  const xpInCurrentLevel = safeXp - currentLevel.minXp;
  const xpSpan = nextLevel ? nextLevel.minXp - currentLevel.minXp : 10000;
  const progressPercent = nextLevel
    ? Math.min(100, Math.max(0, Math.round((xpInCurrentLevel / xpSpan) * 100)))
    : 100;
  const remainingXp = nextLevel ? Math.max(0, nextLevel.minXp - safeXp) : 0;

  return {
    currentLevel,
    nextLevel,
    levelNumber: currentLevel.level,
    levelTitle: currentLevel.title,
    currentXp: safeXp,
    targetXp: nextLevel ? nextLevel.minXp : currentLevel.maxXp,
    xpInCurrentLevel,
    xpSpan,
    progressPercent,
    remainingXp,
  };
}

export interface GamificationToast {
  id: string;
  type: 'xp' | 'badge' | 'level' | 'streak';
  title: string;
  message: string;
  icon?: string;
  xpAmount?: number;
  timestamp: number;
}

export interface UserProfile {
  uid: string;
  name: string;
  email: string;
  avatarUrl?: string;
  role: UserRole;
  level: UserLevel;
  levelNumber?: number;
  xp: number;
  streakDays: number;
  longestStreak?: number;
  lastActiveDate: string;
  lastDailyBonusDate?: string;
  totalLessonsCompleted: number;
  totalExamsCompleted: number;
  averageScore: number;
  createdAt: string;
  // Professional details
  jobTitle?: string;
  company?: string;
  experienceLevel?: 'entry' | 'intermediate' | 'senior' | 'lead';
  bio?: string;
}

export type FrameworkCategory =
  | 'Security & Privacy'
  | 'Cloud & SaaS'
  | 'Healthcare'
  | 'Financial & Payments'
  | 'Governance & Risk'
  | 'Cybersecurity'
  | 'Compliance'
  | 'Privacy'
  | 'Risk Management';

export interface ControlItem {
  id: string;
  code: string;
  title: string;
  description?: string;
  domain: string;
  guidance: string;
  implemented?: boolean;
}

export interface RealWorldExample {
  title: string;
  scenario: string;
  implementation?: string;
  outcome?: string;
  lessonLearned: string;
}

export interface LessonContent {
  id: string;
  moduleId: string;
  frameworkId: string;
  title: string;
  estimatedMinutes: number;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  summary: string;
  bodyMarkdown: string;
  beginnerExplanation?: string;
  professionalExplanation?: string;
  realWorldExample?: RealWorldExample | { title: string; scenario: string; lessonLearned: string };
  keyTakeaways: string[];
  securityControls: string[];
  caseStudy?: {
    title: string;
    scenario: string;
    lessonLearned: string;
  };
  checkpointQuestion: {
    question: string;
    options: string[];
    correctIndex: number;
    explanation: string;
  };
  xpReward: number; // typically 50
}

export interface ModuleItem {
  id: string;
  frameworkId: string;
  title: string;
  description: string;
  order: number;
  lessonIds: string[];
  xpReward: number; // typically 100
}

export interface FrameworkVideoResource {
  id: string;
  frameworkId: string;
  title: string;
  channel: string;
  duration: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  description: string;
  youtubeUrl: string;
  keyTopics: string[];
  auditorTakeaway: string;
}

export interface FrameworkDeepDiveComponent {
  title: string;
  code?: string;
  description: string;
  items?: string[];
  keyItems?: string[];
}

export interface FrameworkDeepDive {
  frameworkId?: string;
  title?: string;
  overview?: string;
  corePurpose?: string;
  purpose?: string;
  whoNeedsIt?: string[];
  whoUsesIt?: string;
  keyComponents: FrameworkDeepDiveComponent[];
  implementationSteps?: string[];
  commonAuditPitfalls?: string[];
  practicalTips?: string[];
  beginnerExplanation?: string;
  professionalExplanation?: string;
  realWorldExample?: {
    organizationType?: string;
    scenario: string;
    implementation?: string;
    outcome?: string;
    lessonLearned?: string;
  };
  keyTakeaways?: string[];
}

export interface FrameworkItem {
  id: string;
  code: string;
  title: string;
  shortName: string;
  category: FrameworkCategory;
  version: string;
  description: string;
  overview: string;
  badgeIcon: string;
  color: string;
  targetAudience: string;
  totalControls: number;
  modules: ModuleItem[];
  lessons: LessonContent[];
  controls: ControlItem[];
  suggestedVideos?: FrameworkVideoResource[];
  deepDive?: FrameworkDeepDive;
  xpReward: number; // typically 500
}

export type QuestionType = 'multiple_choice' | 'true_false' | 'scenario';

export interface QuestionItem {
  id: string;
  frameworkId: string;
  domain: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
  questionType?: QuestionType;
  scenarioText?: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  sourceStandard?: string;
  tags?: string[];
}

export type ExamQuestion = QuestionItem;

export type ExamType = 'quick' | 'standard' | 'professional' | 'custom' | 'scenario' | 'framework';

export interface AssessmentTrack {
  id: string;
  title: string;
  frameworkId: string;
  frameworkTitle: string;
  category: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
  description: string;
  questionCount: number;
  durationMinutes: number;
  passingScorePercent: number;
  xpReward: number;
  supportedTypes: QuestionType[];
  targetAudience: string;
  examType: ExamType;
  isPopular?: boolean;
}

export interface ExamConfig {
  type: ExamType;
  title: string;
  questionCount: number;
  timeLimitMinutes: number;
  passingScorePercent: number; // default 75%
  xpPassReward: number;
  frameworkId?: string; // optional: if specific to a framework
  isUntimed?: boolean;
}

export interface ExamSession {
  examId: string;
  examType: ExamType;
  title: string;
  frameworkId?: string;
  questions: QuestionItem[];
  shuffledOptionOrders: number[][]; // stores mapped option indices per question
  selectedAnswers: Record<string, number>; // questionId -> chosen index (relative to shuffled options)
  flaggedQuestions: Record<string, boolean>;
  startTime: number;
  timeLimitSeconds: number;
  timeRemainingSeconds: number;
  isUntimed?: boolean;
  isPaused?: boolean;
  isSubmitted: boolean;
}

export interface ExamResult {
  id: string;
  userId: string;
  examType: ExamType;
  frameworkId?: string;
  frameworkTitle?: string;
  totalQuestions: number;
  correctAnswers: number;
  scorePercentage: number;
  passed: boolean;
  xpEarned: number;
  timeSpentSeconds: number;
  completedAt: string;
  answers: {
    questionId: string;
    questionText: string;
    questionType?: QuestionType | string;
    scenarioText?: string;
    selectedOptionIndex: number;
    selectedOptionText: string;
    correctOptionIndex: number;
    correctOptionText: string;
    isCorrect: boolean;
    explanation: string;
    domain: string;
    sourceStandard?: string;
  }[];
  domainBreakdown: Record<string, { total: number; correct: number; percentage: number }>;
  typeBreakdown?: Record<string, { total: number; correct: number; percentage: number }>;
}

export type BadgeCategory =
  | 'learning'
  | 'assessment'
  | 'consistency'
  | 'specialist'
  | 'framework'
  | 'exam'
  | 'streak'
  | 'mastery';

export interface BadgeItem {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: BadgeCategory;
  unlockedAt?: string;
  criteria: string;
  xpReward?: number;
  targetCount?: number;
  metricType?: 'lessons' | 'paths' | 'frameworks' | 'exams' | 'streak' | 'score' | 'specialist';
}

export type ComplianceStatus = 'compliant' | 'partially_compliant' | 'planned' | 'not_started';

export interface GapAnalysisItem {
  id: string;
  frameworkId: string;
  controlCode: string;
  title: string;
  description: string;
  status: ComplianceStatus;
  riskLevel: 'critical' | 'high' | 'medium' | 'low';
  notes?: string;
}

export interface GapAssessmentItem {
  id: string;
  frameworkId: string;
  controlCode: string;
  controlTitle: string;
  category: string;
  status: 'not_started' | 'planned' | 'partially_compliant' | 'fully_compliant';
  notes: string;
  evidenceRef?: string;
  riskLevel: 'Low' | 'Medium' | 'High' | 'Critical';
}

export type LearningPathLevel = 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';

export interface LearningPathModule {
  id: string;
  title: string;
  subtitle?: string;
  description: string;
  order: number;
  durationMinutes: number;
  lessonsCount: number;
  status: 'completed' | 'current' | 'locked' | 'available';
  frameworkId?: string;
  targetLessonId?: string;
}

export interface LearningPathOverview {
  whatYouWillLearn: string[];
  whyItMatters: string;
  learningObjectives: string[];
  estimatedCompletionTime: string;
  difficulty: LearningPathLevel;
}

export interface LearningPath {
  id: string;
  title: string;
  roleTarget: string;
  description: string;
  estimatedWeeks: number;
  modulesIncluded: { frameworkId: string; moduleId: string }[];
  milestones: string[];
  level?: LearningPathLevel;
  difficulty?: LearningPathLevel;
  estimatedTime?: string;
  estimatedHours?: number;
  modulesCount?: number;
  progressPercentage?: number;
  overview?: LearningPathOverview;
  curriculumModules?: LearningPathModule[];
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  actionSuggestions?: string[];
  referenceControls?: string[];
}
