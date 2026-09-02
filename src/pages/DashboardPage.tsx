import React from 'react';
import {
  ShieldCheck,
  Flame,
  Award,
  Sparkles,
  BookOpen,
  CheckSquare,
  ArrowRight,
  TrendingUp,
  Clock,
  Play,
  CheckCircle2,
  AlertCircle,
  BarChart3,
  Lightbulb,
  Compass,
  FileText
} from 'lucide-react';
import { useAuthAndData } from '../context/AuthAndDataContext';

interface DashboardPageProps {
  setCurrentTab: (tab: string) => void;
  setSelectedFrameworkId: (id: string) => void;
  setSelectedLessonId: (id: string) => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  setCurrentTab,
  setSelectedFrameworkId,
  setSelectedLessonId,
}) => {
  const {
    user,
    frameworks,
    completedLessonIds,
    examHistory,
    activeExamSession,
    unlockedBadgeIds,
    badges,
    openAiModal,
  } = useAuthAndData();

  // Calculate Next Level XP Threshold
  const levelThresholds: Record<string, { nextLevel: string; xpNeeded: number }> = {
    Beginner: { nextLevel: 'Intermediate', xpNeeded: 250 },
    Intermediate: { nextLevel: 'Advanced', xpNeeded: 600 },
    Advanced: { nextLevel: 'Expert', xpNeeded: 1200 },
    Expert: { nextLevel: 'Lead Auditor', xpNeeded: 2000 },
    'Lead Auditor': { nextLevel: 'Master Compliance Fellow', xpNeeded: 3500 },
  };

  const currentLevelInfo = levelThresholds[user.level] || { nextLevel: 'Master', xpNeeded: 5000 };
  const currentLevelMinXp = user.level === 'Beginner' ? 0 : user.level === 'Intermediate' ? 250 : user.level === 'Advanced' ? 600 : user.level === 'Expert' ? 1200 : 2000;
  const xpInCurrentLevel = Math.max(0, user.xp - currentLevelMinXp);
  const xpRequiredForLevel = Math.max(1, currentLevelInfo.xpNeeded - currentLevelMinXp);
  const levelProgressPercentage = Math.min(100, Math.round((xpInCurrentLevel / xpRequiredForLevel) * 100));

  // Find next uncompleted lesson to recommend
  let nextLessonToStudy: { framework: any; module: any; lesson: any } | null = null;
  for (const f of frameworks) {
    for (const m of f.modules) {
      for (const l of f.lessons.filter(less => less.moduleId === m.id)) {
        if (!completedLessonIds.includes(l.id)) {
          nextLessonToStudy = { framework: f, module: m, lesson: l };
          break;
        }
      }
      if (nextLessonToStudy) break;
    }
    if (nextLessonToStudy) break;
  }

  // Calculate Overall Compliance Readiness (%)
  const totalLessonsInPlatform = frameworks.reduce((acc, f) => acc + f.lessons.length, 0);
  const readinessPercentage = totalLessonsInPlatform > 0
    ? Math.round((completedLessonIds.length / totalLessonsInPlatform) * 100)
    : 0;

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in duration-300">
      
      {/* Top Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl border border-[#A5002D]/40 bg-gradient-to-r from-[#7A0019]/30 via-white/[0.04] to-black/60 p-6 sm:p-8 shadow-2xl shadow-[#7A0019]/15 backdrop-blur-2xl">
        <div className="absolute -right-10 -bottom-10 h-64 w-64 rounded-full bg-primary/20 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-primary/20 border border-primary/40 px-3 py-0.5 text-xs font-bold text-primary-light uppercase tracking-wider">
                Auditor Level: {user.level}
              </span>
              <div className="flex items-center gap-1 text-amber-400 font-semibold text-xs bg-amber-500/10 border border-amber-500/30 px-2.5 py-0.5 rounded-full backdrop-blur-sm">
                <Flame className="h-3.5 w-3.5 fill-amber-400/30 text-amber-400" />
                <span>{user.streakDays}-Day Learning Streak</span>
              </div>
            </div>

            <h1 className="font-heading text-2xl sm:text-3xl font-extrabold text-text-primary tracking-tight">
              Welcome back, {user.name}
            </h1>
            {user.jobTitle && (
              <p className="text-xs font-semibold text-primary-light flex flex-wrap items-center gap-1.5">
                <span>{user.jobTitle}</span>
                {user.company && <span>• {user.company}</span>}
                {user.experienceLevel && <span className="capitalize bg-primary/20 border border-primary/30 px-2 py-0.2 rounded-full text-[10px] text-white">• {user.experienceLevel} level</span>}
              </p>
            )}
            <p className="text-xs sm:text-sm text-text-secondary max-w-xl">
              You are currently on track to pass your audit simulations. Complete lessons and take mock exams to level up to <strong className="text-primary-light">{currentLevelInfo.nextLevel}</strong>.
            </p>
          </div>

          {/* Level Progress Widget */}
          <div className="w-full lg:w-72 rounded-2xl bg-white/[0.06] border border-white/15 p-4 backdrop-blur-xl shrink-0 shadow-lg">
            <div className="flex items-center justify-between text-xs font-semibold mb-1.5">
              <span className="text-text-secondary">Progress to {currentLevelInfo.nextLevel}</span>
              <span className="font-mono text-primary-light font-bold">{levelProgressPercentage}%</span>
            </div>
            <div className="h-2.5 w-full overflow-hidden rounded-full bg-black/40 border border-white/10">
              <div
                className="h-full bg-gradient-to-r from-primary to-accent-light transition-all duration-500 rounded-full shadow-sm"
                style={{ width: `${levelProgressPercentage}%` }}
              />
            </div>
            <div className="mt-2 flex items-center justify-between text-[11px] text-text-muted">
              <span>{user.xp} XP current</span>
              <span>{currentLevelInfo.xpNeeded} XP goal</span>
            </div>
          </div>
        </div>
      </div>

      {/* Active Exam Alert if in progress */}
      {activeExamSession && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 rounded-2xl border border-amber-500/40 bg-amber-500/10 p-4 sm:p-5 backdrop-blur-xl animate-pulse">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
              <Clock className="h-5 w-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-text-primary">
                Unfinished Exam Session in Progress
              </h4>
              <p className="text-xs text-text-secondary">
                {activeExamSession.title} ({activeExamSession.questions.length} Questions) • Auto-saved in local cache.
              </p>
            </div>
          </div>
          <button
            onClick={() => setCurrentTab('exams')}
            className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl bg-amber-500 px-4 py-2 text-xs font-bold text-black hover:bg-amber-400 transition-all shadow-md shadow-amber-500/20"
          >
            <span>Resume Exam Session</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* 4 Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Stat 1: Total XP */}
        <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 backdrop-blur-xl hover:border-primary-light/40 transition-all shadow-sm">
          <div className="flex items-center justify-between text-text-muted text-xs font-semibold mb-2">
            <span>Total Experience</span>
            <Award className="h-4 w-4 text-primary-light" />
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold font-mono text-text-primary">
            {user.xp.toLocaleString()} <span className="text-xs font-sans text-primary-light">XP</span>
          </p>
          <p className="text-[11px] text-text-muted mt-1">Rank: <span className="text-text-secondary font-medium">{user.level}</span></p>
        </div>

        {/* Stat 2: Lessons Completed */}
        <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 backdrop-blur-xl hover:border-primary-light/40 transition-all shadow-sm">
          <div className="flex items-center justify-between text-text-muted text-xs font-semibold mb-2">
            <span>Lessons Completed</span>
            <BookOpen className="h-4 w-4 text-accent-light" />
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold font-mono text-text-primary">
            {completedLessonIds.length} <span className="text-xs font-sans text-text-muted">/ {totalLessonsInPlatform}</span>
          </p>
          <p className="text-[11px] text-emerald-400 mt-1 flex items-center gap-1">
            <CheckCircle2 className="h-3 w-3 shrink-0" />
            <span>{readinessPercentage}% Curriculum done</span>
          </p>
        </div>

        {/* Stat 3: Mock Exams & Avg Score */}
        <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 backdrop-blur-xl hover:border-primary-light/40 transition-all shadow-sm">
          <div className="flex items-center justify-between text-text-muted text-xs font-semibold mb-2">
            <span>Average Exam Score</span>
            <TrendingUp className="h-4 w-4 text-emerald-400" />
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold font-mono text-text-primary">
            {user.averageScore}%
          </p>
          <p className="text-[11px] text-text-muted mt-1">
            {examHistory.length} {examHistory.length === 1 ? 'Exam' : 'Exams'} Completed
          </p>
        </div>

        {/* Stat 4: Unlocked Badges */}
        <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 backdrop-blur-xl hover:border-primary-light/40 transition-all shadow-sm">
          <div className="flex items-center justify-between text-text-muted text-xs font-semibold mb-2">
            <span>Badges Unlocked</span>
            <Sparkles className="h-4 w-4 text-amber-400" />
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold font-mono text-text-primary">
            {unlockedBadgeIds.length} <span className="text-xs font-sans text-text-muted">/ {badges.length}</span>
          </p>
          <p className="text-[11px] text-amber-400 mt-1">Top Auditor Honors</p>
        </div>
      </div>

      {/* Main Content 2-Column: Left = Continue Learning & Frameworks; Right = Quick Exam & AI Coach */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column (2 spans) */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Continue Learning Spotlight */}
          {nextLessonToStudy ? (
            <div className="rounded-3xl border border-[#A5002D]/30 bg-gradient-to-br from-[#7A0019]/25 via-white/[0.04] to-black/50 p-6 shadow-xl backdrop-blur-xl">
              <div className="flex items-center justify-between mb-3">
                <span className="rounded-full bg-primary/20 border border-primary/40 px-3 py-0.5 text-[10px] font-bold text-primary-light uppercase tracking-wider">
                  Continue Where You Left Off
                </span>
                <span className="text-xs text-text-muted flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5" />
                  <span>~{nextLessonToStudy.lesson.estimatedMinutes} mins</span>
                </span>
              </div>

              <h3 className="font-heading text-lg font-bold text-text-primary">
                {nextLessonToStudy.lesson.title}
              </h3>
              <p className="text-xs text-text-secondary mt-1.5 line-clamp-2">
                {nextLessonToStudy.lesson.summary}
              </p>

              <div className="mt-4 flex items-center justify-between pt-3 border-t border-white/10">
                <div className="flex items-center gap-2 text-xs text-text-muted">
                  <span className="font-semibold text-text-primary">{nextLessonToStudy.framework.shortName}</span>
                  <span>•</span>
                  <span>{nextLessonToStudy.module.title}</span>
                </div>
                <button
                  onClick={() => {
                    setSelectedFrameworkId(nextLessonToStudy!.framework.id);
                    setSelectedLessonId(nextLessonToStudy!.lesson.id);
                    setCurrentTab('lesson');
                  }}
                  className="flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-xs font-bold text-white hover:bg-primary-dark transition-all shadow-lg shadow-primary/30 border border-white/15"
                >
                  <Play className="h-3.5 w-3.5 fill-current" />
                  <span>Resume Lesson (+50 XP)</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="rounded-3xl border border-emerald-500/40 bg-emerald-500/10 p-6 text-center backdrop-blur-xl">
              <CheckCircle2 className="h-10 w-10 text-emerald-400 mx-auto mb-2" />
              <h3 className="text-base font-bold text-text-primary">All Platform Lessons Completed!</h3>
              <p className="text-xs text-text-muted mt-1">Take professional mock exams to validate your multi-framework mastery.</p>
            </div>
          )}

          {/* Framework Progress Breakdown */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-heading text-lg font-bold text-text-primary">
                  Core Framework Tracks
                </h3>
                <p className="text-xs text-text-muted">
                  Track your mastery across industry compliance and cybersecurity standards.
                </p>
              </div>
              <button
                onClick={() => setCurrentTab('library')}
                className="text-xs font-semibold text-primary-light hover:underline flex items-center gap-1"
              >
                <span>View All (6)</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {frameworks.map((f) => {
                const totalLessons = f.lessons.length;
                const completedCount = f.lessons.filter(l => completedLessonIds.includes(l.id)).length;
                const pct = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;
                return (
                  <div
                    key={f.id}
                    className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 hover:border-[#A5002D]/50 hover:bg-white/[0.07] backdrop-blur-xl transition-all group flex flex-col justify-between shadow-sm"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="rounded-full bg-primary/20 border border-primary/30 px-2.5 py-0.5 text-[10px] font-bold text-primary-light uppercase">
                          {f.code}
                        </span>
                        <span className="text-xs font-mono font-bold text-text-primary">
                          {pct}%
                        </span>
                      </div>

                      <h4 className="font-heading text-sm font-bold text-text-primary group-hover:text-primary-light transition-colors">
                        {f.title}
                      </h4>
                      <p className="text-[11px] text-text-muted mt-1 line-clamp-2">
                        {f.description}
                      </p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-white/10 space-y-2">
                      <div className="h-1.5 w-full bg-black/40 border border-white/5 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary rounded-full transition-all duration-300"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      <div className="flex items-center justify-between text-[10px] text-text-muted">
                        <span>{completedCount} / {totalLessons} Lessons</span>
                        <button
                          onClick={() => {
                            setSelectedFrameworkId(f.id);
                            setCurrentTab('framework-details');
                          }}
                          className="font-bold text-text-primary hover:text-primary-light"
                        >
                          Study &rarr;
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

        {/* Right Column (1 span) */}
        <div className="space-y-6">
          
          {/* Quick Mock Exam Launcher */}
          <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 space-y-4 backdrop-blur-xl shadow-lg">
            <div>
              <div className="flex items-center justify-between">
                <span className="rounded-full bg-accent/20 border border-accent/30 px-2.5 py-0.5 text-[10px] font-bold text-accent-light uppercase">
                  Exam Simulator
                </span>
                <span className="text-xs font-mono text-text-muted">75% Passing Mark</span>
              </div>
              <h3 className="font-heading text-base font-bold text-text-primary mt-2">
                Launch Certification Mock Exam
              </h3>
              <p className="text-xs text-text-muted mt-1">
                Evaluate your readiness with randomized, timed multi-choice audits.
              </p>
            </div>

            <div className="space-y-2.5">
              <button
                onClick={() => setCurrentTab('exams')}
                className="w-full flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.03] p-3 text-left hover:border-primary-light/50 hover:bg-white/[0.08] transition-all group backdrop-blur-sm"
              >
                <div>
                  <h4 className="text-xs font-bold text-text-primary group-hover:text-primary-light">
                    10-Question Quick Sprint
                  </h4>
                  <p className="text-[11px] text-text-muted">15 Mins • +100 XP on passing</p>
                </div>
                <Play className="h-4 w-4 text-text-muted group-hover:text-primary-light" />
              </button>

              <button
                onClick={() => setCurrentTab('exams')}
                className="w-full flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.03] p-3 text-left hover:border-primary-light/50 hover:bg-white/[0.08] transition-all group backdrop-blur-sm"
              >
                <div>
                  <h4 className="text-xs font-bold text-text-primary group-hover:text-primary-light">
                    25-Question Standard Exam
                  </h4>
                  <p className="text-[11px] text-text-muted">35 Mins • +250 XP on passing</p>
                </div>
                <Play className="h-4 w-4 text-text-muted group-hover:text-primary-light" />
              </button>

              <button
                onClick={() => setCurrentTab('exams')}
                className="w-full flex items-center justify-between rounded-xl border border-primary/40 bg-gradient-to-r from-primary/20 via-primary/10 to-transparent p-3 text-left hover:border-primary transition-all group backdrop-blur-sm"
              >
                <div>
                  <h4 className="text-xs font-bold text-text-primary group-hover:text-primary-light">
                    50-Question Professional Audit
                  </h4>
                  <p className="text-[11px] text-primary-light font-semibold">65 Mins • +500 XP & Lead Auditor Badge</p>
                </div>
                <Play className="h-4 w-4 text-primary-light" />
              </button>
            </div>
          </div>

          {/* AI Coach Card */}
          <div className="rounded-3xl border border-[#A5002D]/30 bg-gradient-to-b from-[#7A0019]/25 via-white/[0.03] to-black/60 p-6 space-y-3 backdrop-blur-xl shadow-lg">
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-xl bg-primary/20 text-primary-light border border-white/10">
                <Sparkles className="h-4 w-4" />
              </div>
              <h3 className="font-heading text-sm font-bold text-text-primary">
                Comply AI Tutor
              </h3>
            </div>
            <p className="text-xs text-text-secondary leading-relaxed">
              Need help understanding complex security controls like SOC 2 CC6.1, ISO 27001 Annex A.5.7, or PCI-DSS script integrity? Ask Comply AI anytime for instant clarity.
            </p>
            <button
              onClick={() => openAiModal()}
              className="w-full flex items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/10 hover:bg-white/15 py-2.5 text-xs font-bold text-white transition-all shadow-md backdrop-blur-sm"
            >
              <Sparkles className="h-3.5 w-3.5 text-primary-light" />
              <span>Ask Comply AI a Question</span>
            </button>
          </div>

          {/* Badges Showcase */}
          <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur-xl shadow-lg">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-heading text-sm font-bold text-text-primary">
                Recent Badges
              </h3>
              <span className="text-[11px] text-text-muted">{unlockedBadgeIds.length} Unlocked</span>
            </div>

            <div className="grid grid-cols-4 gap-2">
              {badges.map((b) => {
                const isUnlocked = unlockedBadgeIds.includes(b.id);
                return (
                  <div
                    key={b.id}
                    className={`flex flex-col items-center justify-center rounded-xl border p-2 text-center transition-all ${
                      isUnlocked
                        ? 'border-amber-500/40 bg-amber-500/10 text-amber-300 backdrop-blur-sm shadow-sm'
                        : 'border-white/5 bg-white/[0.02] text-text-muted opacity-40'
                    }`}
                    title={`${b.title}: ${b.description}`}
                  >
                    <Award className="h-6 w-6 mb-1" />
                    <span className="text-[9px] font-bold truncate max-w-full">{b.title}</span>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
