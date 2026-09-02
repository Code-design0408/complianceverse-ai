export type UserRole = 'student' | 'instructor' | 'admin';

export type UserLevel = 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert' | 'Lead Auditor';

export interface UserProfile {
  uid: string;
  name: string;
  email: string;
  avatarUrl?: string;
  role: UserRole;
  level: UserLevel;
  xp: number;
  streakDays: number;
  lastActiveDate: string;
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

export type FrameworkCategory = 'Security & Privacy' | 'Cloud & SaaS' | 'Healthcare' | 'Financial & Payments' | 'Governance & Risk';

export interface ControlItem {
  id: string;
  code: string;
  title: string;
  description?: string;
  domain: string;
  guidance: string;
  implemented?: boolean;
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
  xpReward: number; // typically 500
}

export interface QuestionItem {
  id: string;
  frameworkId: string;
  domain: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  sourceStandard?: string;
}

export type ExamQuestion = QuestionItem;

export type ExamType = 'quick' | 'standard' | 'professional' | 'custom';

export interface ExamConfig {
  type: ExamType;
  title: string;
  questionCount: number;
  timeLimitMinutes: number;
  passingScorePercent: number; // default 75%
  xpPassReward: number;
  frameworkId?: string; // optional: if specific to a framework
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
    selectedOptionIndex: number;
    selectedOptionText: string;
    correctOptionIndex: number;
    correctOptionText: string;
    isCorrect: boolean;
    explanation: string;
    domain: string;
  }[];
  domainBreakdown: Record<string, { total: number; correct: number; percentage: number }>;
}

export interface BadgeItem {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: 'framework' | 'exam' | 'streak' | 'mastery';
  unlockedAt?: string;
  criteria: string;
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

export interface LearningPath {
  id: string;
  title: string;
  roleTarget: string;
  description: string;
  estimatedWeeks: number;
  modulesIncluded: { frameworkId: string; moduleId: string }[];
  milestones: string[];
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  actionSuggestions?: string[];
  referenceControls?: string[];
}
