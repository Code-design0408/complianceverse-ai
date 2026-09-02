import React, { useState } from 'react';
import {
  BarChart3,
  TrendingUp,
  Award,
  Sparkles,
  CheckCircle2,
  Clock,
  Flame,
  Bot,
  Layers,
  BookOpen,
  ArrowRight
} from 'lucide-react';
import { useAuthAndData } from '../context/AuthAndDataContext';
import { apiService } from '../services/apiService';

interface AnalyticsPageProps {
  setCurrentTab: (tab: string) => void;
}

export const AnalyticsPage: React.FC<AnalyticsPageProps> = ({ setCurrentTab }) => {
  const {
    user,
    frameworks,
    completedLessonIds,
    examHistory,
    unlockedBadgeIds,
    badges,
    openAiModal,
  } = useAuthAndData();

  const [aiStudyPlan, setAiStudyPlan] = useState<string | null>(null);
  const [isGeneratingPlan, setIsGeneratingPlan] = useState(false);

  const totalLessons = frameworks.reduce((acc, f) => acc + f.lessons.length, 0);
  const completionPercentage = totalLessons > 0 ? Math.round((completedLessonIds.length / totalLessons) * 100) : 0;

  // Framework breakdown
  const frameworkStats = frameworks.map((f) => {
    const fTotal = f.lessons.length;
    const fDone = f.lessons.filter((l) => completedLessonIds.includes(l.id)).length;
    const fPct = fTotal > 0 ? Math.round((fDone / fTotal) * 100) : 0;
    return {
      title: f.shortName,
      completed: fDone,
      total: fTotal,
      percentage: fPct,
      code: f.code,
    };
  });

  const handleGenerateStudyPlan = async () => {
    setIsGeneratingPlan(true);
    try {
      const res = await apiService.sendMessageToComplyAI({
        message: `I am currently at level "${user.level}" with ${user.xp} XP and an average exam score of ${user.averageScore}%. I have completed ${completedLessonIds.length} out of ${totalLessons} lessons. Please give me a 3-point personalized high-impact study recommendation for this week to accelerate my auditor certification.`,
      });
      setAiStudyPlan(res.reply);
    } catch (e) {
      console.error('Error generating study plan:', e);
      setAiStudyPlan('Focus on completing SOC 2 and ISO 27001 foundational modules first, then attempt a 25-Question Standard Exam to validate domain retention.');
    } finally {
      setIsGeneratingPlan(false);
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-border/40 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary/20 text-primary-light">
              <BarChart3 className="h-4 w-4" />
            </div>
            <h1 className="font-heading text-2xl sm:text-3xl font-extrabold text-text-primary">
              Performance Analytics & Audit Readiness
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-text-muted mt-1">
            Real-time telemetry tracking your curriculum completion, exam score trends, and AI-driven study recommendations.
          </p>
        </div>

        <button
          onClick={handleGenerateStudyPlan}
          disabled={isGeneratingPlan}
          className="flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-xs font-bold text-white hover:bg-primary-dark transition-all shadow-md shadow-primary/20 disabled:opacity-50 self-start md:self-auto"
        >
          <Sparkles className="h-4 w-4" />
          <span>{isGeneratingPlan ? 'Analyzing Telemetry...' : 'Generate AI Study Plan'}</span>
        </button>
      </div>

      {/* Top Metrics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-5 backdrop-blur-xl shadow-lg">
          <span className="text-xs font-semibold text-text-muted block mb-1">Overall Curriculum</span>
          <p className="font-mono text-2xl font-bold text-text-primary">
            {completionPercentage}%
          </p>
          <p className="text-[11px] text-emerald-400 mt-1">
            {completedLessonIds.length} of {totalLessons} Lessons Done
          </p>
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-5 backdrop-blur-xl shadow-lg">
          <span className="text-xs font-semibold text-text-muted block mb-1">Average Exam Score</span>
          <p className="font-mono text-2xl font-bold text-primary-light">
            {user.averageScore}%
          </p>
          <p className="text-[11px] text-text-muted mt-1">
            {examHistory.length} Total Assessments
          </p>
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-5 backdrop-blur-xl shadow-lg">
          <span className="text-xs font-semibold text-text-muted block mb-1">Active Study Streak</span>
          <p className="font-mono text-2xl font-bold text-amber-400 flex items-center gap-1.5">
            <Flame className="h-5 w-5 fill-amber-400/30" />
            <span>{user.streakDays} Days</span>
          </p>
          <p className="text-[11px] text-text-muted mt-1">
            Daily Goal: Active
          </p>
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-5 backdrop-blur-xl shadow-lg">
          <span className="text-xs font-semibold text-text-muted block mb-1">Total Experience</span>
          <p className="font-mono text-2xl font-bold text-text-primary">
            {user.xp} <span className="text-xs font-sans text-primary-light">XP</span>
          </p>
          <p className="text-[11px] text-text-muted mt-1">
            Auditor Rank: {user.level}
          </p>
        </div>

      </div>

      {/* AI Personalized Study Plan Box */}
      {aiStudyPlan && (
        <div className="rounded-3xl border border-white/15 bg-gradient-to-r from-primary/25 via-white/[0.04] to-black/50 p-6 sm:p-8 space-y-3 backdrop-blur-2xl shadow-xl animate-in fade-in">
          <div className="flex items-center gap-2 text-primary-light font-bold text-sm">
            <Bot className="h-5 w-5" />
            <span>Personalized AI Study Recommendations</span>
          </div>
          <div className="text-xs text-text-secondary whitespace-pre-wrap leading-relaxed">
            {aiStudyPlan}
          </div>
        </div>
      )}

      {/* 2-Column Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Left: Framework Completion Breakdown */}
        <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 sm:p-8 space-y-6 backdrop-blur-xl shadow-lg">
          <div>
            <h3 className="font-heading text-base font-bold text-text-primary">
              Framework Mastery Breakdown
            </h3>
            <p className="text-xs text-text-muted mt-0.5">
              Progress across each certification standard.
            </p>
          </div>

          <div className="space-y-4">
            {frameworkStats.map((stat) => (
              <div key={stat.title} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-text-primary">{stat.title}</span>
                    <span className="text-[10px] text-text-muted font-mono">({stat.code})</span>
                  </div>
                  <span className="font-mono text-text-muted font-semibold">
                    {stat.completed}/{stat.total} ({stat.percentage}%)
                  </span>
                </div>
                <div className="h-2 w-full bg-black/40 border border-white/5 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-primary to-accent-light rounded-full transition-all duration-500"
                    style={{ width: `${stat.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Exam Progression History Trend */}
        <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 sm:p-8 space-y-6 backdrop-blur-xl shadow-lg">
          <div>
            <h3 className="font-heading text-base font-bold text-text-primary">
              Exam Score Progression
            </h3>
            <p className="text-xs text-text-muted mt-0.5">
              Historical results of recent certification assessments.
            </p>
          </div>

          {examHistory.length > 0 ? (
            <div className="space-y-3">
              {examHistory.slice(0, 5).map((exam, idx) => (
                <div
                  key={exam.id}
                  className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 flex items-center justify-between gap-4 backdrop-blur-sm"
                >
                  <div>
                    <span className="text-xs font-bold text-text-primary block">
                      {exam.frameworkTitle || 'Comprehensive Audit'}
                    </span>
                    <span className="text-[10px] text-text-muted">
                      {new Date(exam.completedAt).toLocaleDateString()} • {exam.examType.toUpperCase()}
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className={`font-mono text-sm font-bold ${
                      exam.passed ? 'text-emerald-400' : 'text-rose-400'
                    }`}>
                      {exam.scorePercentage}%
                    </span>
                    <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold border ${
                      exam.passed ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' : 'bg-rose-500/20 text-rose-300 border-rose-500/30'
                    }`}>
                      {exam.passed ? 'PASSED' : 'FAILED'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-8 text-center text-text-muted space-y-2 backdrop-blur-sm">
              <Clock className="h-8 w-8 mx-auto text-text-muted" />
              <p className="text-xs">No exam telemetry recorded yet.</p>
              <button
                onClick={() => setCurrentTab('exams')}
                className="text-xs font-bold text-primary-light hover:underline"
              >
                Launch your first exam &rarr;
              </button>
            </div>
          )}
        </div>

      </div>

      {/* Badges and Honors Matrix */}
      <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 sm:p-8 space-y-6 backdrop-blur-xl shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-heading text-base font-bold text-text-primary">
              Badges & Milestones ({unlockedBadgeIds.length} of {badges.length} Unlocked)
            </h3>
            <p className="text-xs text-text-muted mt-0.5">
              Earn honors by completing lessons, passing exams, and maintaining streaks.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {badges.map((b) => {
            const isUnlocked = unlockedBadgeIds.includes(b.id);
            return (
              <div
                key={b.id}
                className={`rounded-2xl border p-4 flex items-start gap-3 transition-all backdrop-blur-sm ${
                  isUnlocked
                    ? 'border-amber-500/40 bg-amber-500/10 text-text-primary shadow-sm'
                    : 'border-white/5 bg-white/[0.02] opacity-40 text-text-muted'
                }`}
              >
                <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border ${
                  isUnlocked
                    ? 'bg-amber-500/20 border-amber-500/40 text-amber-400'
                    : 'bg-white/5 border-white/10 text-text-muted'
                }`}>
                  <Award className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-heading text-xs font-bold">{b.title}</h4>
                  <p className="text-[11px] text-text-secondary mt-0.5 leading-snug">{b.description}</p>
                  <span className="text-[9px] font-mono text-primary-light block mt-1">Goal: {b.criteria}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};
