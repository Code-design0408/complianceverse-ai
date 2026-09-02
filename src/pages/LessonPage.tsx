import React, { useState } from 'react';
import {
  ArrowLeft,
  BookOpen,
  CheckCircle2,
  Clock,
  Sparkles,
  ShieldCheck,
  Award,
  AlertCircle,
  HelpCircle,
  ArrowRight,
  Lightbulb,
  Check,
  X
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { useAuthAndData } from '../context/AuthAndDataContext';

interface LessonPageProps {
  frameworkId: string;
  lessonId: string;
  setCurrentTab: (tab: string) => void;
  setSelectedLessonId: (id: string) => void;
}

export const LessonPage: React.FC<LessonPageProps> = ({
  frameworkId,
  lessonId,
  setCurrentTab,
  setSelectedLessonId,
}) => {
  const {
    frameworks,
    completeLesson,
    isLessonCompleted,
    openAiModal,
  } = useAuthAndData();

  const [selectedCheckpointAnswer, setSelectedCheckpointAnswer] = useState<number | null>(null);
  const [hasSubmittedCheckpoint, setHasSubmittedCheckpoint] = useState(false);
  const [completedSuccessAnimation, setCompletedSuccessAnimation] = useState(false);

  const framework = frameworks.find((f) => f.id === frameworkId) || frameworks[0];
  const lesson = framework?.lessons.find((l) => l.id === lessonId) || framework?.lessons[0];

  if (!framework || !lesson) return null;

  const isCompleted = isLessonCompleted(lesson.id);

  // Find next lesson
  const allLessons = framework.lessons;
  const currentIdx = allLessons.findIndex((l) => l.id === lesson.id);
  const nextLesson = currentIdx !== -1 && currentIdx < allLessons.length - 1 ? allLessons[currentIdx + 1] : null;

  const handleCheckpointSubmit = () => {
    if (selectedCheckpointAnswer === null) return;
    setHasSubmittedCheckpoint(true);

    if (lesson.checkpointQuestion && selectedCheckpointAnswer === lesson.checkpointQuestion.correctIndex) {
      if (!isCompleted) {
        completeLesson(lesson.id, framework.id, lesson.moduleId);
        setCompletedSuccessAnimation(true);
      }
    }
  };

  const handleManualComplete = () => {
    if (!isCompleted) {
      completeLesson(lesson.id, framework.id, lesson.moduleId);
      setCompletedSuccessAnimation(true);
    }
  };

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in duration-300">
      
      {/* Navigation Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setCurrentTab('framework-details')}
          className="flex items-center gap-1.5 text-xs font-semibold text-text-muted hover:text-text-primary transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to {framework.shortName} Modules</span>
        </button>

        <button
          onClick={() => openAiModal({ framework: framework.title, topic: lesson.title })}
          className="flex items-center gap-1.5 rounded-xl border border-white/15 bg-white/5 px-3 py-1.5 text-xs font-semibold text-primary-light hover:bg-white/10 transition-all backdrop-blur-sm"
        >
          <Sparkles className="h-3.5 w-3.5" />
          <span>Ask Comply AI about this lesson</span>
        </button>
      </div>

      {/* Lesson Hero */}
      <div className="rounded-3xl border border-white/15 bg-gradient-to-br from-primary/25 via-white/[0.04] to-black/50 p-6 sm:p-8 space-y-4 backdrop-blur-2xl shadow-xl">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-primary/20 border border-primary/40 px-3 py-0.5 text-xs font-bold text-primary-light uppercase backdrop-blur-sm">
              {framework.code}
            </span>
            <span className="rounded-full bg-white/5 px-2.5 py-0.5 text-[11px] text-text-muted border border-white/10">
              {lesson.difficulty}
            </span>
          </div>

          <div className="flex items-center gap-3 text-xs text-text-muted">
            <span className="flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" />
              <span>{lesson.estimatedMinutes} Mins Read</span>
            </span>
            <span className="rounded-lg bg-primary/20 px-2.5 py-0.5 font-mono font-bold text-primary-light border border-primary/30">
              +{lesson.xpReward} XP
            </span>
          </div>
        </div>

        <h1 className="font-heading text-2xl sm:text-3xl font-extrabold text-text-primary">
          {lesson.title}
        </h1>

        <p className="text-xs sm:text-sm text-text-secondary leading-relaxed border-l-2 border-primary-light/60 pl-3">
          {lesson.summary}
        </p>

        {isCompleted && (
          <div className="flex items-center gap-2 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 px-3.5 py-2 text-xs font-semibold text-emerald-300 backdrop-blur-sm">
            <CheckCircle2 className="h-4 w-4 text-emerald-400" />
            <span>You have completed this lesson (+50 XP credited)</span>
          </div>
        )}
      </div>

      {/* Main Body Markdown Content */}
      <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 sm:p-8 backdrop-blur-xl shadow-lg">
        <div className="prose prose-invert prose-headings:font-heading prose-headings:font-bold prose-h3:text-primary-light prose-a:text-primary-light max-w-none text-text-secondary leading-relaxed space-y-4">
          <ReactMarkdown>{lesson.bodyMarkdown}</ReactMarkdown>
        </div>

        {/* Key Takeaways Box */}
        {lesson.keyTakeaways && lesson.keyTakeaways.length > 0 && (
          <div className="mt-8 rounded-2xl border border-primary/40 bg-primary/10 p-5 space-y-3 backdrop-blur-sm">
            <h4 className="text-xs font-bold uppercase tracking-wider text-primary-light flex items-center gap-2">
              <Lightbulb className="h-4 w-4 text-amber-400" />
              Key Auditor Takeaways
            </h4>
            <ul className="space-y-2 text-xs text-text-secondary">
              {lesson.keyTakeaways.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2.5">
                  <Check className="h-3.5 w-3.5 text-emerald-400 shrink-0 mt-0.5" />
                  <span className="leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Relevant Security Controls Pills */}
        {lesson.securityControls && (
          <div className="mt-6 pt-4 border-t border-white/10">
            <p className="text-[11px] font-semibold text-text-muted uppercase tracking-wider mb-2">
              Mapped Security & Privacy Controls:
            </p>
            <div className="flex flex-wrap gap-2">
              {lesson.securityControls.map((sc, idx) => (
                <span
                  key={idx}
                  className="rounded-lg bg-white/5 border border-white/10 px-2.5 py-1 text-xs font-mono text-primary-light font-medium backdrop-blur-sm"
                >
                  {sc}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Case Study Callout */}
        {lesson.caseStudy && (
          <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.03] p-5 space-y-2 backdrop-blur-sm">
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-accent/20 px-2.5 py-0.5 text-[10px] font-bold text-accent-light uppercase border border-accent/30">
                Real-World Audit Case Study
              </span>
            </div>
            <h4 className="text-sm font-bold text-text-primary">
              {lesson.caseStudy.title}
            </h4>
            <p className="text-xs text-text-secondary leading-relaxed">
              {lesson.caseStudy.scenario}
            </p>
            <div className="mt-2 rounded-xl bg-black/40 border border-white/10 p-3 text-xs text-amber-300">
              <strong>Key Lesson:</strong> {lesson.caseStudy.lessonLearned}
            </div>
          </div>
        )}
      </div>

      {/* Interactive Checkpoint Question */}
      {lesson.checkpointQuestion && (
        <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 sm:p-8 space-y-5 backdrop-blur-xl shadow-lg">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <div className="flex items-center gap-2">
              <HelpCircle className="h-5 w-5 text-primary-light" />
              <h3 className="font-heading text-base font-bold text-text-primary">
                Knowledge Checkpoint
              </h3>
            </div>
            <span className="text-xs font-mono text-text-muted">Earn +50 XP</span>
          </div>

          <p className="text-sm font-semibold text-text-primary leading-relaxed">
            {lesson.checkpointQuestion.question}
          </p>

          <div className="space-y-2.5">
            {lesson.checkpointQuestion.options.map((option, idx) => {
              const isSelected = selectedCheckpointAnswer === idx;
              const isCorrect = idx === lesson.checkpointQuestion?.correctIndex;

              let style = 'border-white/10 bg-white/[0.03] hover:border-primary-light/40 hover:bg-white/[0.07] text-text-secondary';
              if (hasSubmittedCheckpoint) {
                if (isCorrect) {
                  style = 'border-emerald-500/60 bg-emerald-500/15 text-emerald-300 font-semibold';
                } else if (isSelected) {
                  style = 'border-rose-500/60 bg-rose-500/15 text-rose-300';
                }
              } else if (isSelected) {
                style = 'border-[#A5002D] bg-[#7A0019]/40 text-white font-medium ring-1 ring-[#A5002D] shadow-lg shadow-[#7A0019]/20';
              }

              return (
                <button
                  key={idx}
                  onClick={() => {
                    if (!hasSubmittedCheckpoint) {
                      setSelectedCheckpointAnswer(idx);
                    }
                  }}
                  className={`w-full text-left p-4 rounded-2xl border transition-all text-xs flex items-start gap-3 backdrop-blur-sm ${style}`}
                >
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-lg bg-white/10 text-[11px] font-bold">
                    {String.fromCharCode(65 + idx)}
                  </span>
                  <span className="flex-1 leading-relaxed">{option}</span>
                </button>
              );
            })}
          </div>

          {/* Action Button */}
          {!hasSubmittedCheckpoint ? (
            <button
              onClick={handleCheckpointSubmit}
              disabled={selectedCheckpointAnswer === null}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-primary py-3 text-xs font-bold text-white hover:bg-primary-dark transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-md shadow-primary/20 border border-white/15"
            >
              <span>Submit Answer & Verify</span>
            </button>
          ) : (
            <div className="space-y-4 animate-in fade-in">
              <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4 text-xs space-y-1.5 backdrop-blur-sm">
                <p className="font-bold text-text-primary flex items-center gap-2">
                  {selectedCheckpointAnswer === lesson.checkpointQuestion.correctIndex ? (
                    <>
                      <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                      <span className="text-emerald-400">Correct! Great comprehension.</span>
                    </>
                  ) : (
                    <>
                      <AlertCircle className="h-4 w-4 text-amber-400" />
                      <span className="text-amber-400">Not quite, review the standard explanation below:</span>
                    </>
                  )}
                </p>
                <p className="text-text-secondary leading-relaxed">
                  {lesson.checkpointQuestion.explanation}
                </p>
              </div>

              {!isCompleted && (
                <button
                  onClick={handleManualComplete}
                  className="w-full rounded-xl bg-emerald-600 py-3 text-xs font-bold text-white hover:bg-emerald-700 transition-all shadow-md shadow-emerald-900/30 border border-emerald-400/20"
                >
                  Mark Lesson Completed (+50 XP)
                </button>
              )}
            </div>
          )}
        </div>
      )}

      {/* Footer Navigation */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-white/10">
        <button
          onClick={() => setCurrentTab('framework-details')}
          className="w-full sm:w-auto text-xs font-semibold text-text-muted hover:text-text-primary"
        >
          &larr; Back to Modules
        </button>

        {nextLesson ? (
          <button
            onClick={() => {
              setSelectedLessonId(nextLesson.id);
              setSelectedCheckpointAnswer(null);
              setHasSubmittedCheckpoint(false);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-xs font-bold text-white hover:bg-primary-dark transition-all shadow-md shadow-primary/20 border border-white/15"
          >
            <span>Next: {nextLesson.title}</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        ) : (
          <button
            onClick={() => setCurrentTab('framework-details')}
            className="w-full sm:w-auto rounded-xl bg-primary px-5 py-2.5 text-xs font-bold text-white hover:bg-primary-dark transition-all border border-white/15"
          >
            Finish Framework Track
          </button>
        )}
      </div>

    </div>
  );
};
