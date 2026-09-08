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
  X,
  GraduationCap,
  Briefcase,
  Building2,
  FileCheck,
  Compass,
  Layers
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
  const [explanationMode, setExplanationMode] = useState<'both' | 'beginner' | 'professional'>('both');

  const framework = frameworks.find((f) => f.id === frameworkId) || frameworks[0];
  const lesson = framework?.lessons.find((l) => l.id === lessonId) || framework?.lessons[0];

  if (!framework || !lesson) return null;

  const isCompleted = isLessonCompleted(lesson.id);

  // Find next lesson
  const allLessons = framework.lessons;
  const currentIdx = allLessons.findIndex((l) => l.id === lesson.id);
  const prevLesson = currentIdx > 0 ? allLessons[currentIdx - 1] : null;
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

  // Beginner explanation fallback
  const beginnerText = lesson.beginnerExplanation || 
    `Think of ${lesson.title} like a standard safety inspection. Just like a building needs clear fire exits, smoke detectors, and emergency lighting so anyone inside is safe, digital systems require clear, straightforward safeguards so private customer information and critical operations are protected at all times without confusion.`;

  // Professional explanation fallback
  const professionalText = lesson.professionalExplanation ||
    `From an enterprise GRC and Lead Auditor standpoint, ${lesson.title} establishes demonstrable accountability. Organizations must prove operating effectiveness across the entire audit observation period with immutable audit logs, documented policy approvals, segregated duties, and tested technical controls aligned with ${framework.code}.`;

  // Real world example resolution
  const realWorld = lesson.realWorldExample
    ? {
        title: lesson.realWorldExample.title,
        scenario: lesson.realWorldExample.scenario,
        implementation: ('implementation' in lesson.realWorldExample && lesson.realWorldExample.implementation)
          ? lesson.realWorldExample.implementation
          : 'Deployed automated configuration enforcement, identity verification gates, and continuous evidence ingestion pipelines.',
        outcome: ('outcome' in lesson.realWorldExample && lesson.realWorldExample.outcome)
          ? lesson.realWorldExample.outcome
          : 'Eliminated unapproved privileged access exceptions, reduced audit evidence gathering time by 80%, and passed external auditor sampling with zero findings.',
        lessonLearned: lesson.realWorldExample.lessonLearned
      }
    : (lesson.caseStudy ? {
        title: lesson.caseStudy.title,
        scenario: lesson.caseStudy.scenario,
        implementation: 'Deployed automated configuration enforcement, identity verification gates, and continuous evidence ingestion pipelines.',
        outcome: 'Eliminated unapproved privileged access exceptions, reduced audit evidence gathering time by 80%, and passed external auditor sampling with zero findings.',
        lessonLearned: lesson.caseStudy.lessonLearned
      } : null);

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in duration-300">
      
      {/* Navigation Header */}
      <div className="flex items-center justify-between">
        <button
          id="btn-back-to-framework-details"
          onClick={() => setCurrentTab('framework-details')}
          className="flex items-center gap-1.5 text-xs font-semibold text-text-muted hover:text-text-primary transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to {framework.shortName} Modules</span>
        </button>

        <button
          id="btn-ask-ai-lesson"
          onClick={() => openAiModal({ framework: framework.title, topic: lesson.title })}
          className="flex items-center gap-1.5 rounded-xl border border-white/15 bg-white/5 px-3 py-1.5 text-xs font-semibold text-primary-light hover:bg-white/10 transition-all backdrop-blur-sm"
        >
          <Sparkles className="h-3.5 w-3.5 text-primary-light" />
          <span>Ask ComplyAI About Lesson</span>
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

      {/* Dual Explanation Perspective Tabs */}
      <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur-xl shadow-lg space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
          <div className="flex items-center gap-2">
            <Compass className="h-4 w-4 text-primary-light" />
            <h3 className="font-heading text-sm font-bold text-text-primary">
              Core Concept Explanations
            </h3>
          </div>

          {/* Mode Switcher */}
          <div className="flex rounded-xl bg-white/5 p-1 border border-white/10 shrink-0">
            <button
              onClick={() => setExplanationMode('both')}
              className={`rounded-lg px-3 py-1 text-[11px] font-bold transition-all ${
                explanationMode === 'both'
                  ? 'bg-primary text-white shadow-sm'
                  : 'text-text-muted hover:text-text-primary'
              }`}
            >
              Dual Perspective
            </button>
            <button
              onClick={() => setExplanationMode('beginner')}
              className={`rounded-lg px-3 py-1 text-[11px] font-bold transition-all ${
                explanationMode === 'beginner'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-text-muted hover:text-emerald-300'
              }`}
            >
              Beginner View
            </button>
            <button
              onClick={() => setExplanationMode('professional')}
              className={`rounded-lg px-3 py-1 text-[11px] font-bold transition-all ${
                explanationMode === 'professional'
                  ? 'bg-sky-600 text-white shadow-sm'
                  : 'text-text-muted hover:text-sky-300'
              }`}
            >
              Enterprise View
            </button>
          </div>
        </div>

        {/* Explanations Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
          {/* Beginner Explanation */}
          {(explanationMode === 'both' || explanationMode === 'beginner') && (
            <div className={`rounded-2xl border border-emerald-500/30 bg-emerald-500/5 p-5 space-y-2 backdrop-blur-sm ${
              explanationMode === 'beginner' ? 'md:col-span-2' : ''
            }`}>
              <div className="flex items-center gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-emerald-500/20 text-emerald-400">
                  <GraduationCap className="h-3.5 w-3.5" />
                </span>
                <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                  Beginner-Friendly Explanation
                </h4>
              </div>
              <p className="text-xs text-text-secondary leading-relaxed pt-1">
                {beginnerText}
              </p>
            </div>
          )}

          {/* Professional / Enterprise Explanation */}
          {(explanationMode === 'both' || explanationMode === 'professional') && (
            <div className={`rounded-2xl border border-sky-500/30 bg-sky-500/5 p-5 space-y-2 backdrop-blur-sm ${
              explanationMode === 'professional' ? 'md:col-span-2' : ''
            }`}>
              <div className="flex items-center gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-sky-500/20 text-sky-400">
                  <Briefcase className="h-3.5 w-3.5" />
                </span>
                <h4 className="text-xs font-bold uppercase tracking-wider text-sky-400">
                  Professional & Auditor Explanation
                </h4>
              </div>
              <p className="text-xs text-text-secondary leading-relaxed pt-1">
                {professionalText}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Main Body Markdown Content */}
      <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 sm:p-8 backdrop-blur-xl shadow-lg space-y-6">
        <div className="flex items-center gap-2 border-b border-white/10 pb-3">
          <BookOpen className="h-4 w-4 text-primary-light" />
          <h3 className="font-heading text-sm font-bold text-text-primary">
            Curriculum Deep Dive
          </h3>
        </div>

        <div className="prose prose-invert prose-headings:font-heading prose-headings:font-bold prose-h3:text-primary-light prose-a:text-primary-light max-w-none text-text-secondary leading-relaxed space-y-4">
          <ReactMarkdown>{lesson.bodyMarkdown}</ReactMarkdown>
        </div>

        {/* Real-World Implementation Example Box */}
        {realWorld && (
          <div className="rounded-3xl border border-primary/30 bg-primary/10 p-6 space-y-4 backdrop-blur-sm">
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-primary/30 px-3 py-0.5 text-[10px] font-bold text-primary-light uppercase border border-primary/40 flex items-center gap-1.5">
                <Building2 className="h-3 w-3" />
                Real-World Implementation Case Study
              </span>
            </div>

            <h4 className="font-heading text-base font-bold text-text-primary">
              {realWorld.title}
            </h4>

            <div className="space-y-3 text-xs text-text-secondary">
              <div>
                <span className="font-semibold text-text-primary block mb-0.5">
                  1. The Enterprise Scenario & Challenge:
                </span>
                <p className="leading-relaxed pl-2 border-l-2 border-white/20">
                  {realWorld.scenario}
                </p>
              </div>

              <div>
                <span className="font-semibold text-text-primary block mb-0.5">
                  2. Controls Deployed & Architecture Implemented:
                </span>
                <p className="leading-relaxed pl-2 border-l-2 border-primary-light/40">
                  {realWorld.implementation}
                </p>
              </div>

              <div>
                <span className="font-semibold text-text-primary block mb-0.5">
                  3. Measurable Outcome & Audit Result:
                </span>
                <p className="leading-relaxed pl-2 border-l-2 border-emerald-500/40">
                  {realWorld.outcome}
                </p>
              </div>
            </div>

            <div className="mt-3 rounded-2xl bg-black/40 border border-white/10 p-3.5 text-xs text-amber-300 flex items-start gap-2">
              <Lightbulb className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <strong>Key Takeaway & Auditor Advice:</strong> {realWorld.lessonLearned}
              </div>
            </div>
          </div>
        )}

        {/* Key Takeaways Box */}
        {lesson.keyTakeaways && lesson.keyTakeaways.length > 0 && (
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 space-y-3 backdrop-blur-sm">
            <h4 className="text-xs font-bold uppercase tracking-wider text-text-primary flex items-center gap-2">
              <FileCheck className="h-4 w-4 text-emerald-400" />
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
          <div className="pt-4 border-t border-white/10">
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
                  id={`checkpoint-option-${idx}`}
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
              id="btn-submit-checkpoint"
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
                  id="btn-mark-completed"
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
        {prevLesson ? (
          <button
            onClick={() => {
              setSelectedLessonId(prevLesson.id);
              setSelectedCheckpointAnswer(null);
              setHasSubmittedCheckpoint(false);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="w-full sm:w-auto flex items-center gap-1.5 text-xs font-semibold text-text-muted hover:text-text-primary"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Previous: {prevLesson.title}</span>
          </button>
        ) : (
          <button
            onClick={() => setCurrentTab('framework-details')}
            className="w-full sm:w-auto text-xs font-semibold text-text-muted hover:text-text-primary"
          >
            &larr; Back to Modules
          </button>
        )}

        {nextLesson ? (
          <button
            id="btn-next-lesson"
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
