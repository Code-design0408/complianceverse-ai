import React, { useState, useEffect, useMemo } from 'react';
import {
  CheckCircle2,
  XCircle,
  Award,
  Sparkles,
  RotateCcw,
  ArrowRight,
  BookOpen,
  HelpCircle,
  Bot,
  Clock,
  BarChart3,
  Lightbulb,
  Check,
  X,
  Filter,
  Building,
  Target,
  Zap,
  ShieldCheck,
  Layers,
  GraduationCap
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { ExamResult } from '../types';
import { apiService } from '../services/apiService';
import { useAuthAndData } from '../context/AuthAndDataContext';

interface ExamResultsPageProps {
  examResult: ExamResult | null;
  setCurrentTab: (tab: string) => void;
}

export const ExamResultsPage: React.FC<ExamResultsPageProps> = ({
  examResult,
  setCurrentTab,
}) => {
  const { startExam, lastExamResult } = useAuthAndData();
  const result = examResult || lastExamResult;

  const [aiExplanations, setAiExplanations] = useState<Record<string, string>>({});
  const [loadingAiId, setLoadingAiId] = useState<string | null>(null);
  const [reviewFilter, setReviewFilter] = useState<'all' | 'incorrect' | 'correct' | 'scenario'>('all');

  useEffect(() => {
    if (result && result.passed) {
      try {
        confetti({
          particleCount: 100,
          spread: 80,
          origin: { y: 0.5 },
          colors: ['#7A0019', '#A5002D', '#10B981', '#F59E0B', '#FFFFFF'],
        });
      } catch {
        // Safe confetti fallback
      }
    }
  }, [result?.passed]);

  // Identify weak domain for remediation recommendation
  const weakDomain = useMemo(() => {
    if (!result?.domainBreakdown) return null;
    const entries = Object.entries(result.domainBreakdown);
    if (entries.length === 0) return null;
    // Sort ascending by percentage
    entries.sort((a, b) => a[1].percentage - b[1].percentage);
    if (entries[0][1].percentage < 75) {
      return {
        domain: entries[0][0],
        percentage: entries[0][1].percentage,
        total: entries[0][1].total,
        correct: entries[0][1].correct,
      };
    }
    return null;
  }, [result?.domainBreakdown]);

  // Filter questions for detailed review
  const filteredAnswers = useMemo(() => {
    if (!result?.answers) return [];
    return result.answers.filter((ans) => {
      if (reviewFilter === 'incorrect') return !ans.isCorrect;
      if (reviewFilter === 'correct') return ans.isCorrect;
      if (reviewFilter === 'scenario') return !!ans.scenarioText;
      return true;
    });
  }, [result?.answers, reviewFilter]);

  if (!result) {
    return (
      <div className="mx-auto max-w-md text-center py-20">
        <h3 className="text-base font-bold text-text-primary">No Exam Result Selected</h3>
        <button
          onClick={() => setCurrentTab('exams')}
          className="mt-4 rounded-xl bg-primary px-4 py-2 text-xs font-bold text-white"
        >
          View Exam History
        </button>
      </div>
    );
  }

  const handleRequestAiExplanation = async (answer: any) => {
    setLoadingAiId(answer.questionId);
    try {
      const res = await apiService.explainExamMistake({
        questionText: answer.questionText,
        scenarioText: answer.scenarioText,
        selectedAnswer: answer.selectedOptionText,
        correctAnswer: answer.correctOptionText,
        explanation: answer.explanation,
        domain: answer.domain,
        framework: result.frameworkTitle,
      });
      setAiExplanations((prev) => ({
        ...prev,
        [answer.questionId]: res.debrief || res.explanation,
      }));
    } catch (e) {
      console.error('Error fetching AI explanation:', e);
    } finally {
      setLoadingAiId(null);
    }
  };

  const handleRetake = () => {
    startExam({
      examType: result.examType,
      frameworkId: result.frameworkId,
      questionCount: result.totalQuestions,
      title: result.frameworkTitle ? `${result.frameworkTitle} Retake` : 'Assessment Retake',
    });
    setCurrentTab('active-exam');
  };

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in duration-300">
      
      {/* Top Banner: Pass / Fail */}
      <div
        className={`rounded-3xl border p-6 sm:p-8 text-center space-y-4 shadow-2xl backdrop-blur-2xl ${
          result.passed
            ? 'border-emerald-500/40 bg-gradient-to-b from-emerald-500/15 via-white/[0.03] to-black/60 shadow-emerald-500/10'
            : 'border-rose-500/40 bg-gradient-to-b from-rose-500/15 via-white/[0.03] to-black/60 shadow-rose-500/10'
        }`}
      >
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border shadow-lg backdrop-blur-md">
          {result.passed ? (
            <div className="flex h-full w-full items-center justify-center rounded-2xl bg-emerald-500/20 border-emerald-500/40 text-emerald-400">
              <Award className="h-9 w-9 animate-bounce" />
            </div>
          ) : (
            <div className="flex h-full w-full items-center justify-center rounded-2xl bg-rose-500/20 border-rose-500/40 text-rose-400">
              <XCircle className="h-9 w-9" />
            </div>
          )}
        </div>

        <div>
          <span
            className={`rounded-full px-3.5 py-1 text-[11px] font-bold uppercase tracking-wider backdrop-blur-sm ${
              result.passed
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                : 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
            }`}
          >
            {result.passed ? 'Assessment Passed (≥75%)' : 'Did Not Meet 75% Passing Threshold'}
          </span>

          <h1 className="font-heading text-3xl sm:text-4xl font-extrabold text-text-primary mt-3">
            Score: <span className="font-mono text-primary-light">{result.scorePercentage}%</span>
          </h1>

          <p className="text-xs sm:text-sm text-text-secondary max-w-md mx-auto mt-2">
            {result.passed
              ? `Congratulations! You answered ${result.correctAnswers} out of ${result.totalQuestions} questions correctly and demonstrated verified compliance competency.`
              : `You answered ${result.correctAnswers} of ${result.totalQuestions} correctly. Review your question breakdown, explore AI mistake debriefs, and study recommended remediation areas below.`}
          </p>
        </div>

        {/* 3 Metrics Pills */}
        <div className="grid grid-cols-3 gap-3 max-w-lg mx-auto pt-2">
          <div className="rounded-2xl bg-white/[0.04] border border-white/10 p-3 backdrop-blur-md">
            <span className="text-[10px] text-text-muted uppercase font-semibold block">Experience</span>
            <span className="font-mono text-sm font-bold text-primary-light">+{result.xpEarned} XP</span>
          </div>
          <div className="rounded-2xl bg-white/[0.04] border border-white/10 p-3 backdrop-blur-md">
            <span className="text-[10px] text-text-muted uppercase font-semibold block">Accuracy</span>
            <span className="font-mono text-sm font-bold text-text-primary">{result.correctAnswers}/{result.totalQuestions}</span>
          </div>
          <div className="rounded-2xl bg-white/[0.04] border border-white/10 p-3 backdrop-blur-md">
            <span className="text-[10px] text-text-muted uppercase font-semibold block">Time Spent</span>
            <span className="font-mono text-sm font-bold text-text-primary">
              {Math.floor(result.timeSpentSeconds / 60)}m {result.timeSpentSeconds % 60}s
            </span>
          </div>
        </div>

        {/* Actions Bar */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-4 border-t border-white/10">
          <button
            onClick={handleRetake}
            className="flex items-center gap-1.5 rounded-xl bg-primary px-5 py-2.5 text-xs font-bold text-white hover:bg-primary-dark transition-all shadow-md shadow-primary/20 border border-white/15"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Retake Assessment</span>
          </button>

          <button
            onClick={() => setCurrentTab('gap-analysis')}
            className="flex items-center gap-1.5 rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 text-xs font-medium text-text-primary hover:border-primary-light/40 hover:bg-white/10 transition-all backdrop-blur-sm"
          >
            <span>Update Gap Analysis</span>
          </button>

          <button
            onClick={() => setCurrentTab('exams')}
            className="rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-xs font-medium text-text-muted hover:text-text-primary hover:bg-white/10 transition-all backdrop-blur-sm"
          >
            Browse All Tracks
          </button>
        </div>
      </div>

      {/* Remediation & Targeted Study Recommendation */}
      {weakDomain && (
        <div className="rounded-3xl border border-amber-500/40 bg-gradient-to-r from-amber-500/15 via-white/[0.02] to-black/40 p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 backdrop-blur-xl">
          <div className="flex items-start gap-3.5">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-amber-500/20 text-amber-300 border border-amber-500/40">
              <Lightbulb className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="rounded bg-amber-500/20 text-amber-300 border border-amber-500/40 px-2 py-0.5 text-[10px] font-bold uppercase">
                  Targeted Remediation Plan
                </span>
              </div>
              <h4 className="text-sm font-bold text-text-primary mt-1">
                Domain Gap Identified: <span className="text-amber-300">{weakDomain.domain}</span> ({weakDomain.percentage}% accuracy)
              </h4>
              <p className="text-xs text-text-secondary mt-0.5 leading-relaxed max-w-xl">
                You scored below the 75% threshold in this domain ({weakDomain.correct} of {weakDomain.total} correct). We recommend reviewing the foundational controls and learning paths before attempting the certification simulator again.
              </p>
            </div>
          </div>

          <button
            onClick={() => setCurrentTab('frameworks')}
            className="rounded-xl bg-amber-500 px-4 py-2 text-xs font-bold text-black hover:bg-amber-400 transition-all shadow-md shadow-amber-500/20 shrink-0"
          >
            Review Framework Controls &rarr;
          </button>
        </div>
      )}

      {/* Question Type Performance Breakdown */}
      {result.typeBreakdown && Object.keys(result.typeBreakdown).length > 0 && (
        <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 space-y-4 backdrop-blur-xl shadow-lg">
          <div className="flex items-center gap-2">
            <Layers className="h-4 w-4 text-primary-light" />
            <h3 className="font-heading text-base font-bold text-text-primary">
              Question Format Breakdown
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {Object.entries(result.typeBreakdown).map(([typeKey, stats]) => {
              const labelMap: Record<string, string> = {
                multiple_choice: 'Multiple Choice',
                true_false: 'True / False',
                scenario: 'Scenario-Based',
              };
              const title = labelMap[typeKey] || typeKey;

              return (
                <div key={typeKey} className="rounded-2xl bg-white/[0.03] border border-white/10 p-4 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-text-primary">{title}</span>
                    <span className="font-mono font-bold text-primary-light">{stats.percentage}%</span>
                  </div>
                  <div className="h-2 w-full bg-black/40 border border-white/5 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        stats.percentage >= 75 ? 'bg-emerald-500' : stats.percentage >= 50 ? 'bg-amber-500' : 'bg-rose-500'
                      }`}
                      style={{ width: `${stats.percentage}%` }}
                    />
                  </div>
                  <div className="text-[11px] text-text-muted">
                    {stats.correct} of {stats.total} correct
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Domain Mastery Breakdown */}
      {result.domainBreakdown && Object.keys(result.domainBreakdown).length > 0 && (
        <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 space-y-4 backdrop-blur-xl shadow-lg">
          <div className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4 text-primary-light" />
            <h3 className="font-heading text-base font-bold text-text-primary">
              Domain Mastery Breakdown
            </h3>
          </div>

          <div className="space-y-3">
            {Object.entries(result.domainBreakdown).map(([domain, stats]) => (
              <div key={domain} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-text-secondary">{domain}</span>
                  <span className="font-mono text-text-muted">
                    {stats.correct}/{stats.total} ({stats.percentage}%)
                  </span>
                </div>
                <div className="h-2 w-full bg-black/40 border border-white/5 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      stats.percentage >= 75 ? 'bg-emerald-500' : stats.percentage >= 50 ? 'bg-amber-500' : 'bg-rose-500'
                    }`}
                    style={{ width: `${stats.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Question-by-Question Review with Filters */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h3 className="font-heading text-lg font-bold text-text-primary">
              Detailed Answer Review
            </h3>
            <p className="text-xs text-text-muted">
              Inspect question rationale, standard citations, and Comply AI auditor debriefs.
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 bg-white/[0.04] p-1 rounded-2xl border border-white/10 text-xs">
            <button
              onClick={() => setReviewFilter('all')}
              className={`px-3 py-1 rounded-xl font-semibold transition-all ${
                reviewFilter === 'all' ? 'bg-primary text-white' : 'text-text-muted hover:text-text-primary'
              }`}
            >
              All ({result.answers?.length || 0})
            </button>
            <button
              onClick={() => setReviewFilter('incorrect')}
              className={`px-3 py-1 rounded-xl font-semibold transition-all ${
                reviewFilter === 'incorrect' ? 'bg-rose-500 text-white' : 'text-text-muted hover:text-text-primary'
              }`}
            >
              Incorrect ({result.totalQuestions - result.correctAnswers})
            </button>
            <button
              onClick={() => setReviewFilter('correct')}
              className={`px-3 py-1 rounded-xl font-semibold transition-all ${
                reviewFilter === 'correct' ? 'bg-emerald-600 text-white' : 'text-text-muted hover:text-text-primary'
              }`}
            >
              Correct ({result.correctAnswers})
            </button>
            <button
              onClick={() => setReviewFilter('scenario')}
              className={`px-3 py-1 rounded-xl font-semibold transition-all ${
                reviewFilter === 'scenario' ? 'bg-amber-500 text-black' : 'text-text-muted hover:text-text-primary'
              }`}
            >
              Scenarios
            </button>
          </div>
        </div>

        <div className="space-y-4">
          {filteredAnswers.map((ans, idx) => {
            const isCorrect = ans.isCorrect;
            const aiExpl = aiExplanations[ans.questionId];
            const isLoadingThis = loadingAiId === ans.questionId;
            const isScenario = !!ans.scenarioText;

            return (
              <div
                key={ans.questionId || idx}
                className={`rounded-3xl border p-5 space-y-3 transition-all backdrop-blur-xl ${
                  isCorrect
                    ? 'border-white/10 bg-white/[0.03]'
                    : 'border-rose-500/30 bg-rose-500/[0.04]'
                }`}
              >
                {/* Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-text-muted">
                      Q{idx + 1}.
                    </span>
                    <span className="rounded-full bg-white/5 px-2.5 py-0.5 text-[10px] text-text-muted border border-white/10 backdrop-blur-sm">
                      {ans.domain}
                    </span>
                    {isScenario && (
                      <span className="rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 px-2 py-0.5 text-[10px] font-bold uppercase">
                        Scenario Case
                      </span>
                    )}
                  </div>

                  <span
                    className={`inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full border backdrop-blur-sm ${
                      isCorrect
                        ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30'
                        : 'text-rose-400 bg-rose-500/10 border-rose-500/30'
                    }`}
                  >
                    {isCorrect ? <Check className="h-3 w-3" /> : <X className="h-3 w-3" />}
                    <span>{isCorrect ? 'Correct' : 'Incorrect'}</span>
                  </span>
                </div>

                {/* Scenario Text (if applicable) */}
                {isScenario && (
                  <div className="rounded-2xl border border-amber-500/30 bg-amber-500/5 p-4 text-xs text-text-secondary leading-relaxed">
                    <div className="flex items-center gap-1.5 font-bold text-amber-400 mb-1 text-[11px] uppercase">
                      <Building className="h-3.5 w-3.5" />
                      <span>Audit Scenario Background:</span>
                    </div>
                    {ans.scenarioText}
                  </div>
                )}

                {/* Question */}
                <h4 className="text-sm font-bold text-text-primary leading-relaxed">
                  {ans.questionText}
                </h4>

                {/* Answer comparison */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs pt-1">
                  <div className={`p-3 rounded-2xl border backdrop-blur-sm ${
                    isCorrect
                      ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-300'
                      : 'border-rose-500/40 bg-rose-500/10 text-rose-300'
                  }`}>
                    <span className="text-[10px] font-bold uppercase tracking-wider block opacity-75">
                      Your Selected Answer:
                    </span>
                    <p className="font-semibold mt-0.5">{ans.selectedOptionText}</p>
                  </div>

                  {!isCorrect && (
                    <div className="p-3 rounded-2xl border border-emerald-500/40 bg-emerald-500/10 text-emerald-300 backdrop-blur-sm">
                      <span className="text-[10px] font-bold uppercase tracking-wider block opacity-75">
                        Standard Correct Answer:
                      </span>
                      <p className="font-semibold mt-0.5">{ans.correctOptionText}</p>
                    </div>
                  )}
                </div>

                {/* Standard Explanation */}
                <div className="rounded-2xl bg-white/[0.03] p-3 text-xs text-text-secondary leading-relaxed border border-white/10 backdrop-blur-sm">
                  <strong className="text-text-primary block mb-1">Standard Regulatory Guidance:</strong>
                  {ans.explanation}
                </div>

                {/* Comply AI Mistake Debrief Button */}
                {!isCorrect && (
                  <div>
                    {!aiExpl ? (
                      <button
                        onClick={() => handleRequestAiExplanation(ans)}
                        disabled={isLoadingThis}
                        className="flex items-center gap-1.5 rounded-xl border border-white/15 bg-primary/20 px-3.5 py-2 text-xs font-bold text-primary-light hover:bg-primary/30 transition-all disabled:opacity-50 backdrop-blur-sm"
                      >
                        <Sparkles className="h-3.5 w-3.5 animate-pulse" />
                        <span>{isLoadingThis ? 'Comply AI Analyzing Mistake...' : 'Explain Mistake with Comply AI'}</span>
                      </button>
                    ) : (
                      <div className="rounded-2xl border border-primary/40 bg-gradient-to-br from-primary/20 to-black/60 p-4 text-xs text-text-secondary space-y-1.5 animate-in fade-in backdrop-blur-md">
                        <div className="flex items-center gap-1.5 font-bold text-primary-light">
                          <Bot className="h-4 w-4" />
                          <span>Comply AI Auditor Analysis</span>
                        </div>
                        <p className="whitespace-pre-wrap leading-relaxed text-text-primary/90">{aiExpl}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}

          {filteredAnswers.length === 0 && (
            <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-8 text-center text-xs text-text-muted">
              No questions matched the selected filter.
            </div>
          )}
        </div>
      </div>

    </div>
  );
};
