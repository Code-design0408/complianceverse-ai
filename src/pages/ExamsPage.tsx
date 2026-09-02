import React, { useState } from 'react';
import {
  CheckSquare,
  Clock,
  Award,
  Play,
  ArrowRight,
  ShieldCheck,
  RotateCcw,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  FileCheck,
  ChevronRight,
  Sparkles,
  HelpCircle
} from 'lucide-react';
import { useAuthAndData } from '../context/AuthAndDataContext';
import { ExamType, ExamResult } from '../types';

interface ExamsPageProps {
  setCurrentTab: (tab: string) => void;
  setExamResultForReview: (result: ExamResult) => void;
}

export const ExamsPage: React.FC<ExamsPageProps> = ({
  setCurrentTab,
  setExamResultForReview,
}) => {
  const {
    frameworks,
    startExam,
    activeExamSession,
    cancelActiveExam,
    examHistory,
    setLastExamResult,
  } = useAuthAndData();

  const [selectedFrameworkFilter, setSelectedFrameworkFilter] = useState<string>('all');

  const handleLaunchExam = (type: ExamType) => {
    const fwId = selectedFrameworkFilter === 'all' ? undefined : selectedFrameworkFilter;
    startExam(type, fwId);
    setCurrentTab('active-exam');
  };

  const handleReviewPastExam = (res: ExamResult) => {
    setLastExamResult(res);
    setExamResultForReview(res);
    setCurrentTab('exam-results');
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-border/40 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary/20 text-primary-light">
              <CheckSquare className="h-4 w-4" />
            </div>
            <h1 className="font-heading text-2xl sm:text-3xl font-extrabold text-text-primary">
              Certification Exam Simulator
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-text-muted mt-1">
            Test your knowledge against rigorous, randomized multi-choice certification assessments with deterministic scoring.
          </p>
        </div>

        {/* Framework Filter Dropdown */}
        <div className="flex items-center gap-2">
          <label className="text-xs font-semibold text-text-muted uppercase">Scope:</label>
          <select
            value={selectedFrameworkFilter}
            onChange={(e) => setSelectedFrameworkFilter(e.target.value)}
            className="rounded-xl border border-border bg-card-bg px-3.5 py-2 text-xs font-medium text-text-primary focus:border-primary focus:outline-none"
          >
            <option value="all">Comprehensive (All 6 Frameworks)</option>
            {frameworks.map((f) => (
              <option key={f.id} value={f.id}>
                {f.shortName} Assessment
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Active Exam in progress banner */}
      {activeExamSession && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 rounded-2xl border border-amber-500/50 bg-amber-500/10 p-5 backdrop-blur-md animate-in fade-in">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-500/20 text-amber-400">
              <Clock className="h-5 w-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="rounded bg-amber-500/20 px-2 py-0.5 text-[10px] font-bold text-amber-300 uppercase">
                  Active Session
                </span>
                <h4 className="text-sm font-bold text-text-primary">
                  {activeExamSession.title}
                </h4>
              </div>
              <p className="text-xs text-text-secondary mt-0.5">
                {Object.keys(activeExamSession.selectedAnswers).length} of {activeExamSession.questions.length} Questions Answered • Autosaved
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={() => setCurrentTab('active-exam')}
              className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 rounded-xl bg-amber-500 px-4 py-2 text-xs font-bold text-black hover:bg-amber-400 transition-all shadow-md shadow-amber-500/20"
            >
              <Play className="h-3.5 w-3.5 fill-current" />
              <span>Resume Exam</span>
            </button>
            <button
              onClick={() => cancelActiveExam()}
              className="rounded-xl border border-border bg-card-bg px-3 py-2 text-xs font-medium text-text-muted hover:text-rose-400 hover:border-rose-500/40 transition-all"
            >
              Discard Session
            </button>
          </div>
        </div>
      )}

      {/* 3 Exam Tier Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Tier 1: Quick Sprint */}
        <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 flex flex-col justify-between hover:border-primary-light/40 backdrop-blur-xl shadow-lg hover:shadow-2xl transition-all group">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="rounded-full bg-primary/20 border border-primary/30 px-3 py-0.5 text-xs font-bold text-primary-light uppercase">
                Quick Sprint
              </span>
              <span className="text-xs font-mono font-semibold text-text-muted">15 Mins</span>
            </div>

            <div>
              <h3 className="font-heading text-lg font-bold text-text-primary">
                10-Question Knowledge Check
              </h3>
              <p className="text-xs text-text-secondary mt-1.5 leading-relaxed">
                Ideal for rapid daily practice and testing retention on newly studied framework concepts.
              </p>
            </div>

            <div className="space-y-2 pt-2 text-xs text-text-muted border-t border-white/10">
              <div className="flex items-center justify-between">
                <span>Passing Threshold:</span>
                <span className="font-bold text-text-primary">75% (8/10)</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Reward on Pass:</span>
                <span className="font-mono font-bold text-primary-light">+100 XP</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Questions:</span>
                <span className="text-text-primary">10 Randomized MCQs</span>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4">
            <button
              onClick={() => handleLaunchExam('quick')}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-primary py-3 text-xs font-bold text-white hover:bg-primary-dark transition-all shadow-md shadow-primary/20 border border-white/15"
            >
              <Play className="h-4 w-4 fill-current" />
              <span>Start Quick Sprint</span>
            </button>
          </div>
        </div>

        {/* Tier 2: Standard Assessment */}
        <div className="rounded-3xl border border-[#A5002D]/40 bg-gradient-to-b from-[#7A0019]/30 via-white/[0.04] to-black/60 p-6 flex flex-col justify-between hover:border-primary-light hover:shadow-2xl hover:shadow-[#7A0019]/20 backdrop-blur-2xl transition-all group relative overflow-hidden shadow-xl">
          <div className="absolute top-0 right-0 bg-primary px-3 py-0.5 text-[10px] font-bold text-white rounded-bl-xl uppercase tracking-wider border-b border-l border-white/15">
            Most Popular
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="rounded-full bg-primary/20 border border-primary/40 px-3 py-0.5 text-xs font-bold text-primary-light uppercase">
                Standard Certification
              </span>
              <span className="text-xs font-mono font-semibold text-text-muted">35 Mins</span>
            </div>

            <div>
              <h3 className="font-heading text-lg font-bold text-text-primary">
                25-Question Mock Audit
              </h3>
              <p className="text-xs text-text-secondary mt-1.5 leading-relaxed">
                Comprehensive evaluation covering technical controls, administrative safeguards, and incident response SLAs.
              </p>
            </div>

            <div className="space-y-2 pt-2 text-xs text-text-muted border-t border-white/10">
              <div className="flex items-center justify-between">
                <span>Passing Threshold:</span>
                <span className="font-bold text-text-primary">75% (19/25)</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Reward on Pass:</span>
                <span className="font-mono font-bold text-primary-light">+250 XP</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Questions:</span>
                <span className="text-text-primary">25 Cross-Domain MCQs</span>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4">
            <button
              onClick={() => handleLaunchExam('standard')}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-primary py-3 text-xs font-bold text-white hover:bg-primary-dark transition-all shadow-lg shadow-primary/30 border border-white/15"
            >
              <Play className="h-4 w-4 fill-current" />
              <span>Start Standard Exam</span>
            </button>
          </div>
        </div>

        {/* Tier 3: Professional Lead Auditor Exam */}
        <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 flex flex-col justify-between hover:border-accent-light/40 backdrop-blur-xl shadow-lg hover:shadow-2xl transition-all group">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="rounded-full bg-accent/20 border border-accent/30 px-3 py-0.5 text-xs font-bold text-accent-light uppercase">
                Lead Auditor
              </span>
              <span className="text-xs font-mono font-semibold text-text-muted">65 Mins</span>
            </div>

            <div>
              <h3 className="font-heading text-lg font-bold text-text-primary">
                50-Question Pro Simulation
              </h3>
              <p className="text-xs text-text-secondary mt-1.5 leading-relaxed">
                Exhaustive multi-framework audit simulation with high-complexity scenarios and edge-case exceptions.
              </p>
            </div>

            <div className="space-y-2 pt-2 text-xs text-text-muted border-t border-white/10">
              <div className="flex items-center justify-between">
                <span>Passing Threshold:</span>
                <span className="font-bold text-text-primary">75% (38/50)</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Reward on Pass:</span>
                <span className="font-mono font-bold text-primary-light">+500 XP & Badge</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Questions:</span>
                <span className="text-text-primary">50 In-Depth MCQs</span>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4">
            <button
              onClick={() => handleLaunchExam('professional')}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-primary py-3 text-xs font-bold text-white hover:bg-primary-dark transition-all shadow-md shadow-primary/20 border border-white/15"
            >
              <Play className="h-4 w-4 fill-current" />
              <span>Start Pro Simulation</span>
            </button>
          </div>
        </div>

      </div>

      {/* Exam Standards Callout */}
      <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 backdrop-blur-md">
        <div className="flex items-start gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/20 text-primary-light border border-primary/30">
            <FileCheck className="h-5 w-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-text-primary">
              Deterministic Scoring & Real-Time Auto-Save
            </h4>
            <p className="text-xs text-text-secondary mt-0.5 max-w-2xl leading-relaxed">
              Every assessment is evaluated deterministically using standard formula: <code className="font-mono text-primary-light font-bold">(Correct Answers / Total Questions) * 100</code>. If you accidentally navigate away, your answers remain saved in browser storage.
            </p>
          </div>
        </div>
      </div>

      {/* Historical Attempts Table */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-heading text-lg font-bold text-text-primary">
              Assessment History
            </h3>
            <p className="text-xs text-text-muted">
              Review past exam attempts, score breakdowns, and mistake explanations.
            </p>
          </div>
          <span className="text-xs font-semibold text-text-muted">
            {examHistory.length} Total Submissions
          </span>
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/[0.03] backdrop-blur-xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-white/[0.05] border-b border-white/10 text-text-muted uppercase font-semibold">
                <tr>
                  <th className="px-4 py-3">Exam Title & Type</th>
                  <th className="px-4 py-3">Score & Accuracy</th>
                  <th className="px-4 py-3">Result</th>
                  <th className="px-4 py-3">XP Earned</th>
                  <th className="px-4 py-3">Time Spent</th>
                  <th className="px-4 py-3">Completed Date</th>
                  <th className="px-4 py-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {examHistory.map((item) => (
                  <tr key={item.id} className="hover:bg-white/[0.05] transition-colors">
                    <td className="px-4 py-3 font-semibold text-text-primary">
                      <div>{item.frameworkTitle || 'Compliance Assessment'}</div>
                      <span className="text-[10px] font-mono text-text-muted uppercase">{item.examType}</span>
                    </td>
                    <td className="px-4 py-3 font-mono font-bold text-text-primary">
                      {item.scorePercentage}% ({item.correctAnswers}/{item.totalQuestions})
                    </td>
                    <td className="px-4 py-3">
                      {item.passed ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-0.5 text-[11px] font-bold text-emerald-400">
                          <CheckCircle2 className="h-3 w-3" />
                          <span>PASSED</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 rounded-full bg-rose-500/10 border border-rose-500/30 px-2.5 py-0.5 text-[11px] font-bold text-rose-400">
                          <XCircle className="h-3 w-3" />
                          <span>FAILED (&lt;75%)</span>
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 font-mono font-bold text-primary-light">
                      +{item.xpEarned} XP
                    </td>
                    <td className="px-4 py-3 text-text-muted">
                      {Math.floor(item.timeSpentSeconds / 60)}m {item.timeSpentSeconds % 60}s
                    </td>
                    <td className="px-4 py-3 text-text-muted">
                      {new Date(item.completedAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => handleReviewPastExam(item)}
                        className="rounded-xl bg-white/5 border border-white/10 px-3 py-1 text-xs font-semibold text-text-secondary hover:text-primary-light hover:border-primary-light/40 hover:bg-white/10 transition-all"
                      >
                        Review Breakdown &rarr;
                      </button>
                    </td>
                  </tr>
                ))}
                {examHistory.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-4 py-8 text-center text-text-muted">
                      No completed exams yet. Launch your first mock exam above!
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

    </div>
  );
};
