import React, { useState, useEffect } from 'react';
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
  X
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
        question: answer.questionText,
        selectedOption: answer.selectedOptionText,
        correctOption: answer.correctOptionText,
        standardExplanation: answer.explanation,
        frameworkTitle: result.frameworkTitle,
      });
      setAiExplanations((prev) => ({
        ...prev,
        [answer.questionId]: res.explanation,
      }));
    } catch (e) {
      console.error('Error fetching AI explanation:', e);
    } finally {
      setLoadingAiId(null);
    }
  };

  const handleRetake = () => {
    startExam(result.examType, result.frameworkId);
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
              ? `Congratulations! You answered ${result.correctAnswers} out of ${result.totalQuestions} questions correctly and demonstrated compliance proficiency.`
              : `You answered ${result.correctAnswers} of ${result.totalQuestions} correctly. Review the domain breakdown and AI mistake debriefs below to master these concepts.`}
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
            onClick={() => setCurrentTab('dashboard')}
            className="rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-xs font-medium text-text-muted hover:text-text-primary hover:bg-white/10 transition-all backdrop-blur-sm"
          >
            Auditor Dashboard
          </button>
        </div>
      </div>

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

      {/* Question-by-Question Review */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-heading text-lg font-bold text-text-primary">
            Detailed Answer Review
          </h3>
          <span className="text-xs text-text-muted">
            {result.answers?.length || 0} Questions Evaluated
          </span>
        </div>

        <div className="space-y-4">
          {result.answers?.map((ans, idx) => {
            const isCorrect = ans.isCorrect;
            const aiExpl = aiExplanations[ans.questionId];
            const isLoadingThis = loadingAiId === ans.questionId;

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

                {/* Explanation */}
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
        </div>
      </div>

    </div>
  );
};
