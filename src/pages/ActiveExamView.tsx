import React, { useState, useEffect } from 'react';
import {
  Clock,
  Flag,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  AlertTriangle,
  Send,
  X,
  HelpCircle,
  ShieldCheck,
  RotateCcw
} from 'lucide-react';
import { useAuthAndData } from '../context/AuthAndDataContext';
import { ExamResult } from '../types';

interface ActiveExamViewProps {
  setCurrentTab: (tab: string) => void;
  setExamResultForReview: (result: ExamResult) => void;
}

export const ActiveExamView: React.FC<ActiveExamViewProps> = ({
  setCurrentTab,
  setExamResultForReview,
}) => {
  const {
    activeExamSession,
    saveActiveExamAnswer,
    toggleFlagQuestion,
    updateActiveExamTimer,
    submitActiveExam,
    cancelActiveExam,
  } = useAuthAndData();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Time remaining timer
  useEffect(() => {
    if (!activeExamSession) return;

    const interval = setInterval(() => {
      const remaining = activeExamSession.timeRemainingSeconds - 1;
      updateActiveExamTimer(remaining);

      if (remaining <= 0) {
        clearInterval(interval);
        handleAutoSubmit();
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [activeExamSession?.timeRemainingSeconds]);

  if (!activeExamSession) {
    return (
      <div className="mx-auto max-w-xl text-center py-20">
        <h3 className="text-lg font-bold text-text-primary">No Active Exam Session</h3>
        <button
          onClick={() => setCurrentTab('exams')}
          className="mt-4 rounded-xl bg-primary px-4 py-2 text-xs font-bold text-white"
        >
          Return to Exams
        </button>
      </div>
    );
  }

  const { questions, selectedAnswers, flaggedQuestions, timeLimitSeconds, timeRemainingSeconds, title } = activeExamSession;
  const currentQuestion = questions[currentIndex];
  const totalQuestions = questions.length;
  const answeredCount = Object.keys(selectedAnswers).length;
  const unansweredCount = totalQuestions - answeredCount;
  const flaggedCount = Object.values(flaggedQuestions).filter(Boolean).length;

  const formatTimer = (seconds: number) => {
    const m = Math.floor(Math.max(0, seconds) / 60);
    const s = Math.max(0, seconds) % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const isLowTime = timeRemainingSeconds < 300; // < 5 mins

  const handleSelectOption = (optIdx: number) => {
    saveActiveExamAnswer(currentQuestion.id, optIdx);
  };

  const handleAutoSubmit = async () => {
    const timeSpent = timeLimitSeconds - activeExamSession.timeRemainingSeconds;
    try {
      const res = await submitActiveExam(timeSpent);
      setExamResultForReview(res);
      setCurrentTab('exam-results');
    } catch (e) {
      console.error('Error submitting exam:', e);
    }
  };

  const handleConfirmSubmit = async () => {
    setIsSubmitting(true);
    const timeSpent = timeLimitSeconds - activeExamSession.timeRemainingSeconds;
    try {
      const res = await submitActiveExam(timeSpent);
      setExamResultForReview(res);
      setCurrentTab('exam-results');
    } catch (e) {
      console.error('Error submitting exam:', e);
    } finally {
      setIsSubmitting(false);
      setShowSubmitModal(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex flex-col justify-between py-4 sm:py-6 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-6">
      
      {/* Top Fixed Progress & Timer Bar */}
      <div className="rounded-2xl border border-white/10 bg-white/[0.05] backdrop-blur-xl p-4 shadow-lg flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/20 text-primary-light font-bold border border-primary/30">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <div>
            <h2 className="font-heading text-sm sm:text-base font-bold text-text-primary">
              {title}
            </h2>
            <div className="flex items-center gap-2 text-xs text-text-muted">
              <span>Question {currentIndex + 1} of {totalQuestions}</span>
              <span>•</span>
              <span className="font-mono text-emerald-400 font-semibold">{answeredCount} Answered</span>
            </div>
          </div>
        </div>

        {/* Timer & Submit CTA */}
        <div className="flex items-center justify-between sm:justify-end gap-4 w-full sm:w-auto">
          <div
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl border font-mono text-sm font-bold transition-all backdrop-blur-md ${
              isLowTime
                ? 'border-rose-500/60 bg-rose-500/20 text-rose-300 animate-pulse'
                : 'border-white/10 bg-white/5 text-text-primary'
            }`}
          >
            <Clock className={`h-4 w-4 ${isLowTime ? 'text-rose-400' : 'text-primary-light'}`} />
            <span>{formatTimer(timeRemainingSeconds)}</span>
          </div>

          <button
            onClick={() => setShowSubmitModal(true)}
            className="flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-xs font-bold text-white hover:bg-primary-dark transition-all shadow-md shadow-primary/20 border border-white/15"
          >
            <Send className="h-3.5 w-3.5" />
            <span>Finish & Submit</span>
          </button>
        </div>
      </div>

      {/* Main Examination Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 flex-1 items-start">
        
        {/* Left: Question Presentation Area (3 cols) */}
        <div className="lg:col-span-3 rounded-3xl border border-white/10 bg-white/[0.04] p-6 sm:p-8 space-y-6 flex flex-col justify-between min-h-[500px] backdrop-blur-2xl shadow-xl">
          
          <div className="space-y-4">
            {/* Domain Pill & Flag Button */}
            <div className="flex items-center justify-between">
              <span className="rounded-full bg-white/5 border border-white/10 px-3 py-1 text-xs font-semibold text-text-secondary backdrop-blur-md">
                Domain: {currentQuestion.domain || 'General Compliance'}
              </span>

              <button
                onClick={() => toggleFlagQuestion(currentQuestion.id)}
                className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-semibold transition-all backdrop-blur-md ${
                  flaggedQuestions[currentQuestion.id]
                    ? 'bg-amber-500/20 border border-amber-500/40 text-amber-300'
                    : 'bg-white/5 border border-white/10 text-text-muted hover:text-text-primary hover:bg-white/10'
                }`}
              >
                <Flag className="h-3.5 w-3.5" />
                <span>{flaggedQuestions[currentQuestion.id] ? 'Flagged for Review' : 'Flag Question'}</span>
              </button>
            </div>

            {/* Question Text */}
            <h3 className="font-heading text-base sm:text-lg font-bold text-text-primary leading-relaxed pt-2">
              <span className="text-primary-light mr-2 font-mono font-extrabold">Q{currentIndex + 1}.</span>
              {currentQuestion.question}
            </h3>

            {/* Options List */}
            <div className="space-y-3 pt-2">
              {currentQuestion.options.map((option, idx) => {
                const isSelected = selectedAnswers[currentQuestion.id] === idx;
                return (
                  <button
                    key={idx}
                    onClick={() => handleSelectOption(idx)}
                    className={`w-full text-left p-4 rounded-2xl border transition-all text-xs sm:text-sm flex items-start gap-3.5 backdrop-blur-md ${
                      isSelected
                        ? 'border-[#A5002D] bg-[#7A0019]/40 text-white font-semibold shadow-lg shadow-[#7A0019]/20 ring-1 ring-[#A5002D]'
                        : 'border-white/10 bg-white/[0.03] text-text-secondary hover:border-primary-light/40 hover:bg-white/[0.07]'
                    }`}
                  >
                    <span
                      className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-xl text-xs font-bold font-mono ${
                        isSelected
                          ? 'bg-primary text-white shadow-sm'
                          : 'bg-white/10 text-text-muted border border-white/10'
                      }`}
                    >
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <span className="flex-1 leading-relaxed pt-0.5">{option}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Bottom Pagination & Nav */}
          <div className="flex items-center justify-between pt-6 border-t border-white/10">
            <button
              onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
              disabled={currentIndex === 0}
              className="flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-xs font-bold text-text-secondary hover:text-text-primary hover:border-white/20 transition-all disabled:opacity-30 disabled:cursor-not-allowed backdrop-blur-sm"
            >
              <ChevronLeft className="h-4 w-4" />
              <span>Previous</span>
            </button>

            <span className="text-xs font-mono text-text-muted hidden sm:inline">
              {currentIndex + 1} / {totalQuestions}
            </span>

            {currentIndex < totalQuestions - 1 ? (
              <button
                onClick={() => setCurrentIndex((prev) => Math.min(totalQuestions - 1, prev + 1))}
                className="flex items-center gap-1.5 rounded-xl bg-primary px-5 py-2.5 text-xs font-bold text-white hover:bg-primary-dark transition-all shadow-md shadow-primary/20 border border-white/15"
              >
                <span>Next</span>
                <ChevronRight className="h-4 w-4" />
              </button>
            ) : (
              <button
                onClick={() => setShowSubmitModal(true)}
                className="flex items-center gap-1.5 rounded-xl bg-emerald-600 px-5 py-2.5 text-xs font-bold text-white hover:bg-emerald-700 transition-all shadow-md shadow-emerald-900/30 border border-emerald-400/20"
              >
                <span>Submit Exam</span>
                <CheckCircle2 className="h-4 w-4" />
              </button>
            )}
          </div>

        </div>

        {/* Right: Question Navigator Grid (1 col) */}
        <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 space-y-5 backdrop-blur-xl shadow-lg">
          <div>
            <h4 className="font-heading text-sm font-bold text-text-primary">
              Question Navigator
            </h4>
            <p className="text-[11px] text-text-muted mt-0.5">
              Jump directly to any question.
            </p>
          </div>

          {/* Quick Legend */}
          <div className="grid grid-cols-3 gap-2 text-[10px] text-text-muted pb-2 border-b border-white/10">
            <div className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-primary" />
              <span>Answered</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
              <span>Flagged</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
              <span>Pending</span>
            </div>
          </div>

          {/* 5-Column Grid of Buttons */}
          <div className="grid grid-cols-5 gap-2 max-h-[350px] overflow-y-auto pr-1">
            {questions.map((q, idx) => {
              const isAnswered = selectedAnswers[q.id] !== undefined;
              const isFlagged = flaggedQuestions[q.id];
              const isCurrent = idx === currentIndex;

              let btnStyle = 'bg-white/5 border-white/10 text-text-muted hover:border-primary-light/40 hover:bg-white/10';
              if (isAnswered) {
                btnStyle = 'bg-primary text-white border-primary/50 font-bold shadow-sm';
              }
              if (isFlagged) {
                btnStyle = 'bg-amber-500/20 text-amber-300 border-amber-500/40 font-bold';
              }
              if (isCurrent) {
                btnStyle += ' ring-2 ring-primary-light ring-offset-2 ring-offset-black';
              }

              return (
                <button
                  key={q.id}
                  onClick={() => setCurrentIndex(idx)}
                  className={`flex h-8 w-8 items-center justify-center rounded-xl border text-xs font-mono transition-all backdrop-blur-sm ${btnStyle}`}
                >
                  {idx + 1}
                </button>
              );
            })}
          </div>

          {/* Summary counters */}
          <div className="rounded-2xl bg-white/[0.04] border border-white/10 p-3 space-y-1 text-xs backdrop-blur-sm">
            <div className="flex justify-between text-text-muted">
              <span>Answered:</span>
              <span className="font-bold font-mono text-emerald-400">{answeredCount}</span>
            </div>
            <div className="flex justify-between text-text-muted">
              <span>Flagged:</span>
              <span className="font-bold font-mono text-amber-400">{flaggedCount}</span>
            </div>
            <div className="flex justify-between text-text-muted">
              <span>Unanswered:</span>
              <span className="font-bold font-mono text-rose-400">{unansweredCount}</span>
            </div>
          </div>
        </div>

      </div>

      {/* Confirmation Submit Modal */}
      {showSubmitModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl animate-in fade-in">
          <div className="w-full max-w-md rounded-3xl border border-white/15 bg-[#0a0a0e]/95 p-6 space-y-5 shadow-2xl shadow-black/80 backdrop-blur-2xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="font-heading text-base font-bold text-text-primary">
                Confirm Exam Submission
              </h3>
              <button onClick={() => setShowSubmitModal(false)} className="text-text-muted hover:text-text-primary">
                <X className="h-4 w-4" />
              </button>
            </div>

            <p className="text-xs text-text-secondary leading-relaxed">
              Are you sure you want to finish this assessment? Your answers will be graded immediately using the deterministic scoring engine.
            </p>

            <div className="rounded-2xl bg-white/[0.04] border border-white/10 p-4 space-y-2 text-xs backdrop-blur-sm">
              <div className="flex justify-between">
                <span className="text-text-muted">Total Questions:</span>
                <span className="font-bold text-text-primary">{totalQuestions}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-muted">Answered:</span>
                <span className="font-bold text-emerald-400">{answeredCount}</span>
              </div>
              {unansweredCount > 0 && (
                <div className="flex justify-between text-amber-400 font-semibold">
                  <span>Unanswered Questions:</span>
                  <span>{unansweredCount}</span>
                </div>
              )}
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => setShowSubmitModal(false)}
                className="flex-1 rounded-xl border border-white/10 bg-white/5 py-2.5 text-xs font-semibold text-text-secondary hover:text-text-primary hover:bg-white/10 transition-all"
              >
                Return to Exam
              </button>
              <button
                onClick={handleConfirmSubmit}
                disabled={isSubmitting}
                className="flex-1 rounded-xl bg-primary py-2.5 text-xs font-bold text-white hover:bg-primary-dark transition-all disabled:opacity-50 shadow-md shadow-primary/20 border border-white/15"
              >
                {isSubmitting ? 'Grading Assessment...' : 'Yes, Submit & Grade'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
