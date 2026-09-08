import React, { useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Play,
  Sparkles,
  ShieldCheck,
  Award,
  Layers,
  Clock,
  ChevronRight,
  FileText,
  Search,
  CheckSquare,
  Video,
  ExternalLink,
  Youtube,
  GraduationCap,
  Lightbulb,
  Filter,
  Check,
  Compass,
  AlertTriangle,
  Target,
  FileCheck,
  Flame,
  ShieldAlert,
  HelpCircle
} from 'lucide-react';
import { useAuthAndData } from '../context/AuthAndDataContext';
import { SUGGESTED_FRAMEWORK_VIDEOS } from '../data/videoResources';
import { FRAMEWORK_DEEP_DIVES } from '../data/frameworkDeepDives';
import { FrameworkVideoResource } from '../types';

interface FrameworkDetailsPageProps {
  frameworkId: string;
  setCurrentTab: (tab: string) => void;
  setSelectedLessonId: (id: string) => void;
}

export const FrameworkDetailsPage: React.FC<FrameworkDetailsPageProps> = ({
  frameworkId,
  setCurrentTab,
  setSelectedLessonId,
}) => {
  const {
    frameworks,
    completedLessonIds,
    completedModuleIds,
    startExam,
    openAiModal,
  } = useAuthAndData();

  const [activeSubTab, setActiveSubTab] = useState<'deepDive' | 'modules' | 'controls' | 'suggestions'>('deepDive');
  const [controlSearch, setControlSearch] = useState('');
  const [videoSearch, setVideoSearch] = useState('');
  const [videoDifficulty, setVideoDifficulty] = useState<string>('All');
  const [selectedVideoModal, setSelectedVideoModal] = useState<FrameworkVideoResource | null>(null);

  const framework = frameworks.find((f) => f.id === frameworkId) || frameworks[0];
  const deepDive = framework?.deepDive || (framework ? FRAMEWORK_DEEP_DIVES[framework.id] : null);

  if (!framework) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-12 text-center text-text-muted">
        Framework not found.
      </div>
    );
  }

  const totalLessons = framework.lessons.length;
  const completedCount = framework.lessons.filter((l) =>
    completedLessonIds.includes(l.id)
  ).length;
  const progressPct = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;

  const filteredControls = (framework.controls || []).filter(
    (ctl) =>
      ctl.code.toLowerCase().includes(controlSearch.toLowerCase()) ||
      ctl.title.toLowerCase().includes(controlSearch.toLowerCase()) ||
      ctl.domain.toLowerCase().includes(controlSearch.toLowerCase()) ||
      ctl.guidance.toLowerCase().includes(controlSearch.toLowerCase())
  );

  const videoSuggestions = framework.suggestedVideos && framework.suggestedVideos.length > 0
    ? framework.suggestedVideos
    : (SUGGESTED_FRAMEWORK_VIDEOS[framework.id] || []);

  const filteredVideos = videoSuggestions.filter((vid) => {
    const matchesSearch = vid.title.toLowerCase().includes(videoSearch.toLowerCase()) ||
      vid.description.toLowerCase().includes(videoSearch.toLowerCase()) ||
      vid.channel.toLowerCase().includes(videoSearch.toLowerCase()) ||
      vid.keyTopics.some(t => t.toLowerCase().includes(videoSearch.toLowerCase()));
    const matchesDiff = videoDifficulty === 'All' || vid.difficulty === videoDifficulty;
    return matchesSearch && matchesDiff;
  });

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in duration-300">
      
      {/* Back Navigation Bar */}
      <div className="flex items-center justify-between">
        <button
          id="btn-back-to-catalog"
          onClick={() => setCurrentTab('library')}
          className="flex items-center gap-2 text-xs font-semibold text-text-muted hover:text-text-primary transition-colors group"
        >
          <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
          <span>Back to Frameworks Catalog</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            id="btn-ask-ai-framework"
            onClick={() =>
              openAiModal({
                framework: framework.code,
                topic: 'Framework Deep Dive and Audit Readiness Strategy',
                prompt: `Explain the core audit requirements, scoping boundaries, and best implementation practices for ${framework.title}.`,
              })
            }
            className="flex items-center gap-1.5 rounded-xl border border-primary/40 bg-primary/20 px-3.5 py-1.5 text-xs font-bold text-primary-light hover:bg-primary/30 transition-all backdrop-blur-md"
          >
            <Sparkles className="h-3.5 w-3.5 animate-pulse" />
            <span>Ask ComplyAI</span>
          </button>

          <button
            id="btn-launch-mock-exam"
            onClick={() => {
              startExam('quick', framework.id);
              setCurrentTab('active-exam');
            }}
            className="flex items-center gap-1.5 rounded-xl bg-primary px-4 py-1.5 text-xs font-bold text-white hover:bg-primary-dark transition-all shadow-md shadow-primary/20 border border-white/15"
          >
            <Play className="h-3.5 w-3.5 fill-current" />
            <span>Launch Mock Exam</span>
          </button>
        </div>
      </div>

      {/* Hero Header Card */}
      <div className="rounded-3xl border border-white/15 bg-gradient-to-br from-white/[0.08] via-white/[0.03] to-black/50 p-6 sm:p-8 backdrop-blur-2xl shadow-2xl space-y-6">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
          <div className="space-y-3 max-w-3xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-primary/20 border border-primary/30 px-3 py-1 text-xs font-bold text-primary-light uppercase tracking-wider backdrop-blur-sm">
                {framework.code}
              </span>
              <span className="rounded-full bg-white/5 border border-white/10 px-3 py-1 text-xs text-text-muted">
                {framework.version}
              </span>
              <span className="rounded-full bg-white/5 border border-white/10 px-3 py-1 text-xs text-text-secondary">
                {framework.category}
              </span>
            </div>

            <h1 className="font-heading text-2xl sm:text-4xl font-extrabold text-text-primary">
              {framework.title}
            </h1>

            <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">
              {framework.overview}
            </p>

            <div className="pt-2 text-xs text-text-muted flex items-center gap-2">
              <span className="font-semibold text-text-primary">Target Audience:</span>
              <span>{framework.targetAudience}</span>
            </div>
          </div>

          {/* Quick Metrics Badges */}
          <div className="flex md:flex-col gap-2 shrink-0">
            <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-3 text-center min-w-[100px] backdrop-blur-md">
              <span className="block text-xl font-bold font-mono text-primary-light">
                {framework.modules.length}
              </span>
              <span className="block text-[10px] uppercase font-semibold text-text-muted">
                Modules
              </span>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-3 text-center min-w-[100px] backdrop-blur-md">
              <span className="block text-xl font-bold font-mono text-primary-light">
                {framework.totalControls}
              </span>
              <span className="block text-[10px] uppercase font-semibold text-text-muted">
                Controls
              </span>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-3 text-center min-w-[100px] backdrop-blur-md">
              <span className="block text-xl font-bold font-mono text-emerald-400">
                +{framework.xpReward}
              </span>
              <span className="block text-[10px] uppercase font-semibold text-text-muted">
                Max XP
              </span>
            </div>
          </div>
        </div>

        {/* Framework Mastery Progress Bar */}
        <div className="border-t border-white/10 pt-4 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-text-secondary">
              Curriculum Mastery Progress ({completedCount}/{totalLessons} Lessons Completed)
            </span>
            <span className="font-mono font-bold text-primary-light">{progressPct}%</span>
          </div>
          <div className="h-2.5 w-full bg-black/40 border border-white/5 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-primary to-accent-light rounded-full transition-all duration-500"
              style={{ width: `${progressPct}%` }}
            />
          </div>
        </div>
      </div>

      {/* Tab Switcher: Deep Dive vs Modules vs Controls vs Suggested Videos */}
      <div className="flex flex-wrap border-b border-white/10 gap-1">
        <button
          id="tab-framework-deepdive"
          onClick={() => setActiveSubTab('deepDive')}
          className={`flex items-center gap-2 px-5 py-3 text-xs font-bold border-b-2 transition-all ${
            activeSubTab === 'deepDive'
              ? 'border-primary-light text-primary-light bg-white/[0.04]'
              : 'border-transparent text-text-muted hover:text-text-primary'
          }`}
        >
          <Compass className="h-4 w-4" />
          <span>Framework Deep Dive & Architecture</span>
        </button>

        <button
          id="tab-framework-modules"
          onClick={() => setActiveSubTab('modules')}
          className={`flex items-center gap-2 px-5 py-3 text-xs font-bold border-b-2 transition-all ${
            activeSubTab === 'modules'
              ? 'border-primary-light text-primary-light bg-white/[0.04]'
              : 'border-transparent text-text-muted hover:text-text-primary'
          }`}
        >
          <BookOpen className="h-4 w-4" />
          <span>Curriculum Modules ({framework.modules.length})</span>
        </button>

        <button
          id="tab-framework-controls"
          onClick={() => setActiveSubTab('controls')}
          className={`flex items-center gap-2 px-5 py-3 text-xs font-bold border-b-2 transition-all ${
            activeSubTab === 'controls'
              ? 'border-primary-light text-primary-light bg-white/[0.04]'
              : 'border-transparent text-text-muted hover:text-text-primary'
          }`}
        >
          <ShieldCheck className="h-4 w-4" />
          <span>Audit Controls Checklist ({framework.controls?.length || 0})</span>
        </button>

        <button
          id="tab-framework-suggestions"
          onClick={() => setActiveSubTab('suggestions')}
          className={`flex items-center gap-2 px-5 py-3 text-xs font-bold border-b-2 transition-all ${
            activeSubTab === 'suggestions'
              ? 'border-rose-500 text-rose-400 bg-rose-500/[0.08]'
              : 'border-transparent text-text-muted hover:text-rose-300'
          }`}
        >
          <Youtube className="h-4 w-4 text-rose-500" />
          <span>Suggested Video Guides ({videoSuggestions.length})</span>
        </button>
      </div>

      {/* =========================================================================
          SUB-TAB 0: FRAMEWORK DEEP DIVE & ARCHITECTURE
      ========================================================================= */}
      {activeSubTab === 'deepDive' && deepDive && (
        <div className="space-y-8 animate-in fade-in">
          
          {/* Executive Overview & Core Purpose Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Core Purpose Card */}
            <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 space-y-3 backdrop-blur-xl shadow-lg">
              <div className="flex items-center gap-2">
                <Target className="h-5 w-5 text-primary-light" />
                <h3 className="font-heading text-base font-bold text-text-primary">
                  Core Purpose & Regulatory Mandate
                </h3>
              </div>
              <p className="text-xs text-text-secondary leading-relaxed">
                {deepDive.corePurpose || deepDive.purpose || framework.overview}
              </p>
            </div>

            {/* Who Needs It Card */}
            <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 space-y-3 backdrop-blur-xl shadow-lg">
              <div className="flex items-center gap-2">
                <Award className="h-5 w-5 text-amber-400" />
                <h3 className="font-heading text-base font-bold text-text-primary">
                  Who Needs It & Commercial Triggers
                </h3>
              </div>
              <ul className="space-y-2 text-xs text-text-secondary">
                {(deepDive.whoNeedsIt || (deepDive.whoUsesIt ? [deepDive.whoUsesIt] : ['Enterprise B2B SaaS and cloud vendors', 'Regulated financial and healthcare service providers', 'Organizations managing critical customer assets'])).map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <Check className="h-3.5 w-3.5 text-emerald-400 shrink-0 mt-0.5" />
                    <span className="leading-snug">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

          </div>

          {/* Key Components, Clauses & Domains */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-heading text-lg font-bold text-text-primary flex items-center gap-2">
                  <Layers className="h-5 w-5 text-primary-light" />
                  <span>Key Components, Domains & Control Themes</span>
                </h3>
                <p className="text-xs text-text-muted mt-0.5">
                  The structural building blocks and regulatory requirements of {framework.shortName}.
                </p>
              </div>
              <span className="text-xs font-mono text-text-muted bg-white/5 px-3 py-1 rounded-xl border border-white/10">
                {deepDive.keyComponents?.length || 0} Core Areas
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {(deepDive.keyComponents || []).map((comp, idx) => (
                <div
                  key={idx}
                  className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 space-y-3 hover:border-primary-light/40 hover:bg-white/[0.06] transition-all backdrop-blur-xl group"
                >
                  <div className="flex items-center justify-between">
                    <h4 className="font-heading text-sm font-bold text-text-primary group-hover:text-primary-light transition-colors">
                      {comp.title}
                    </h4>
                    {comp.code && (
                      <span className="rounded-lg bg-primary/20 border border-primary/30 px-2 py-0.5 text-[10px] font-mono font-bold text-primary-light">
                        {comp.code}
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-text-secondary leading-relaxed">
                    {comp.description}
                  </p>

                  <div className="space-y-1.5 pt-2 border-t border-white/5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-text-muted block">
                      Core Elements:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {(comp.keyItems || comp.items || []).map((item, itemIdx) => (
                        <span
                          key={itemIdx}
                          className="rounded-lg bg-white/5 border border-white/10 px-2 py-0.5 text-[11px] text-text-secondary"
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Step-by-Step Implementation Roadmap */}
          <div className="space-y-4">
            <div>
              <h3 className="font-heading text-lg font-bold text-text-primary flex items-center gap-2">
                <Compass className="h-5 w-5 text-primary-light" />
                <span>Step-by-Step Implementation Roadmap</span>
              </h3>
              <p className="text-xs text-text-muted mt-0.5">
                Sequential phases required to operationalize controls and achieve certification readiness.
              </p>
            </div>

            <div className="space-y-3">
              {(deepDive.implementationSteps || [
                'Define ISMS and scoping perimeter with executive charter and RACI matrix.',
                'Perform asset inventory, classification, and comprehensive threat modeling.',
                'Conduct baseline gap assessment and formal Statement of Applicability.',
                'Deploy required technical safeguards, CI/CD automated controls, and IAM policies.',
                'Execute independent internal audit walkthroughs and corrective action closures.',
                'Engage accredited external certification body for Stage 1 and Stage 2 assessment.'
              ]).map((step, idx) => (
                <div
                  key={idx}
                  className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 flex items-start gap-3.5 backdrop-blur-sm hover:bg-white/[0.05] transition-all"
                >
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-xl bg-primary text-white font-mono font-bold text-xs shadow-md shadow-primary/20">
                    {idx + 1}
                  </span>
                  <div className="text-xs text-text-secondary leading-relaxed pt-1">
                    {step}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Common Audit Pitfalls & Auditor Red Flags */}
          <div className="rounded-3xl border border-rose-500/20 bg-rose-500/5 p-6 space-y-4 backdrop-blur-xl shadow-lg">
            <div className="flex items-center gap-2">
              <ShieldAlert className="h-5 w-5 text-rose-400" />
              <h3 className="font-heading text-base font-bold text-rose-300">
                Common Audit Pitfalls & Qualified Report Risks
              </h3>
            </div>
            <p className="text-xs text-text-secondary">
              Deficiencies that routinely cause external CPA and ISO auditors to issue audit findings or qualified opinions:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
              {(deepDive.commonAuditPitfalls || [
                'Untracked manual changes pushed straight to production without PR approvals or ticket references.',
                'Deprovisioning latency exceeding 24 hours for departed personnel with active SSO or SaaS tokens.',
                'Annual disaster recovery simulation tests lacking verified RTO/RPO restoration evidence.',
                'Vendor risk reviews conducted once at contract signing with zero recurring annual reassessments.'
              ]).map((pitfall, idx) => (
                <div
                  key={idx}
                  className="rounded-2xl border border-rose-500/20 bg-black/40 p-3.5 text-xs text-text-secondary flex items-start gap-2.5 backdrop-blur-sm"
                >
                  <AlertTriangle className="h-4 w-4 text-rose-400 shrink-0 mt-0.5" />
                  <span className="leading-snug">{pitfall}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Practical Auditor Pro-Tips */}
          <div className="rounded-3xl border border-primary/30 bg-primary/10 p-6 space-y-4 backdrop-blur-xl shadow-lg">
            <div className="flex items-center gap-2">
              <Lightbulb className="h-5 w-5 text-amber-400" />
              <h3 className="font-heading text-base font-bold text-primary-light">
                Lead Auditor Insights & Practical Pro-Tips
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {(deepDive.practicalTips || [
                'Map controls across frameworks early: a single MFA policy simultaneously satisfies ISO 27001, SOC 2, and NIST CSF.',
                'Automate evidence collection using read-only API connectors rather than taking manual screenshots.',
                'Coach system owners to answer auditor sample questions directly without speculating or expanding scope.',
                'Maintain an active risk register with quarterly leadership sign-offs and explicit risk treatment decisions.'
              ]).map((tip, idx) => (
                <div
                  key={idx}
                  className="rounded-2xl border border-white/10 bg-black/40 p-3.5 text-xs text-text-secondary flex items-start gap-2.5 backdrop-blur-sm"
                >
                  <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span className="leading-snug">{tip}</span>
                </div>
              ))}
            </div>
          </div>

          {/* CTA Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 rounded-3xl border border-white/15 bg-white/[0.04] p-6 backdrop-blur-xl">
            <div>
              <h4 className="font-heading text-base font-bold text-text-primary">
                Ready to begin {framework.shortName} lessons?
              </h4>
              <p className="text-xs text-text-muted mt-0.5">
                Explore interactive lessons, checkpoints, and real-world implementation case studies.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setActiveSubTab('modules')}
                className="flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-xs font-bold text-white hover:bg-primary-dark transition-all shadow-md shadow-primary/20 border border-white/15"
              >
                <span>Go to Curriculum Modules</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

        </div>
      )}

      {/* =========================================================================
          SUB-TAB 1: MODULES & LESSONS
      ========================================================================= */}
      {activeSubTab === 'modules' && (
        <div className="space-y-6">
          {framework.modules.map((mod, modIdx) => {
            const modLessons = framework.lessons.filter((l) => l.moduleId === mod.id);
            const isModComplete = modLessons.length > 0 && modLessons.every((l) => completedLessonIds.includes(l.id));

            return (
              <div
                key={mod.id}
                className="rounded-3xl border border-white/10 bg-white/[0.04] overflow-hidden shadow-lg backdrop-blur-xl"
              >
                {/* Module Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white/[0.04] px-6 py-4 border-b border-white/10">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-primary-light uppercase tracking-wider">
                        Module {modIdx + 1}
                      </span>
                      {isModComplete && (
                        <span className="flex items-center gap-1 text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
                          <CheckCircle2 className="h-3 w-3" /> Completed
                        </span>
                      )}
                    </div>
                    <h3 className="font-heading text-lg font-bold text-text-primary mt-0.5">
                      {mod.title}
                    </h3>
                    <p className="text-xs text-text-secondary mt-1">
                      {mod.description}
                    </p>
                  </div>

                  <span className="text-xs font-mono font-semibold text-text-muted shrink-0 self-start sm:self-auto bg-white/5 px-2.5 py-1 rounded-lg border border-white/10">
                    +{mod.xpReward || 100} XP
                  </span>
                </div>

                {/* Lessons in Module */}
                <div className="divide-y divide-white/5">
                  {modLessons.map((lesson) => {
                    const isDone = completedLessonIds.includes(lesson.id);

                    return (
                      <div
                        key={lesson.id}
                        id={`lesson-item-${lesson.id}`}
                        onClick={() => {
                          setSelectedLessonId(lesson.id);
                          setCurrentTab('lesson');
                        }}
                        className="group flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-5 hover:bg-white/[0.06] cursor-pointer transition-all"
                      >
                        <div className="flex items-start sm:items-center gap-3.5">
                          <div
                            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl border transition-all ${
                              isDone
                                ? 'border-emerald-500/40 bg-emerald-500/15 text-emerald-400'
                                : 'border-white/10 bg-white/5 text-text-muted group-hover:border-primary-light/40 group-hover:text-primary-light'
                            }`}
                          >
                            {isDone ? (
                              <Check className="h-4 w-4 stroke-[3]" />
                            ) : (
                              <BookOpen className="h-4 w-4" />
                            )}
                          </div>

                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="font-heading text-sm font-bold text-text-primary group-hover:text-primary-light transition-colors">
                                {lesson.title}
                              </h4>
                              <span className="rounded-full bg-white/5 border border-white/10 px-2 py-0.5 text-[10px] text-text-muted">
                                {lesson.difficulty}
                              </span>
                            </div>
                            <p className="text-xs text-text-secondary mt-0.5 line-clamp-1">
                              {lesson.summary}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 self-end sm:self-auto text-xs">
                          <span className="flex items-center gap-1 text-text-muted font-mono">
                            <Clock className="h-3.5 w-3.5" />
                            <span>{lesson.estimatedMinutes}m</span>
                          </span>

                          <span className="font-mono font-semibold text-primary-light bg-primary/20 border border-primary/30 px-2 py-0.5 rounded-md">
                            +{lesson.xpReward} XP
                          </span>

                          <div className="flex h-7 w-7 items-center justify-center rounded-xl bg-white/5 border border-white/10 group-hover:bg-primary group-hover:text-white group-hover:border-primary transition-all">
                            <ChevronRight className="h-4 w-4" />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* =========================================================================
          SUB-TAB 2: CONTROLS CHECKLIST
      ========================================================================= */}
      {activeSubTab === 'controls' && (
        <div className="space-y-6">
          
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" />
              <input
                type="text"
                value={controlSearch}
                onChange={(e) => setControlSearch(e.target.value)}
                placeholder="Search audit controls (e.g., CC6.1, A.5.15, Access Control, Encryption)..."
                className="w-full rounded-2xl border border-white/10 bg-white/[0.04] pl-10 pr-4 py-2.5 text-xs text-text-primary placeholder:text-text-muted focus:border-primary-light focus:outline-none backdrop-blur-md"
              />
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/[0.04] overflow-hidden shadow-xl backdrop-blur-xl">
            <div className="divide-y divide-white/5">
              {filteredControls.map((ctl) => (
                <div key={ctl.id} className="p-5 hover:bg-white/[0.03] transition-colors space-y-2">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-xs text-primary-light bg-primary/20 border border-primary/30 px-2.5 py-0.5 rounded-lg">
                        {ctl.code}
                      </span>
                      <h4 className="font-heading text-sm font-bold text-text-primary">
                        {ctl.title}
                      </h4>
                    </div>

                    <span className="rounded-full bg-white/5 border border-white/10 px-2.5 py-0.5 text-[10px] font-semibold text-text-muted">
                      {ctl.domain}
                    </span>
                  </div>

                  <p className="text-xs text-text-secondary leading-relaxed pl-1">
                    {ctl.guidance}
                  </p>
                </div>
              ))}

              {filteredControls.length === 0 && (
                <div className="p-12 text-center text-text-muted text-xs">
                  No controls matched your search query "{controlSearch}".
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          SUB-TAB 3: SUGGESTED YOUTUBE VIDEO GUIDES
      ========================================================================= */}
      {activeSubTab === 'suggestions' && (
        <div className="space-y-6">
          
          <div className="rounded-3xl border border-rose-500/20 bg-rose-500/5 p-6 backdrop-blur-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Youtube className="h-5 w-5 text-rose-500" />
                <h3 className="font-heading text-base font-bold text-text-primary">
                  Suggested YouTube Guides & Masterclasses for {framework.shortName}
                </h3>
              </div>
              <p className="text-xs text-text-secondary max-w-xl leading-relaxed">
                Watch curated video resources to reinforce control requirements, technical evidence gathering, and auditor interview preparation.
              </p>
            </div>

            <a
              href={`https://www.youtube.com/results?search_query=${encodeURIComponent(framework.title + ' audit masterclass')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 rounded-2xl bg-rose-600 hover:bg-rose-700 px-4 py-2 text-xs font-bold text-white transition-all shadow-md shadow-rose-600/20 shrink-0 self-start sm:self-auto"
            >
              <Youtube className="h-4 w-4" />
              <span>Search YouTube Hub</span>
              <ExternalLink className="h-3 w-3" />
            </a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredVideos.map((vid) => (
              <div
                key={vid.id}
                className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 flex flex-col justify-between hover:border-rose-500/40 hover:bg-white/[0.07] hover:shadow-xl hover:shadow-rose-500/10 transition-all backdrop-blur-xl group"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5 text-xs font-bold text-rose-400 bg-rose-500/15 border border-rose-500/25 px-2.5 py-0.5 rounded-full">
                      <Youtube className="h-3 w-3" />
                      <span>{vid.duration}</span>
                    </span>
                    <span className="rounded-full bg-white/5 border border-white/10 px-2.5 py-0.5 text-[10px] font-semibold text-text-muted">
                      {vid.difficulty}
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-text-muted block mb-0.5">
                      By {vid.channel}
                    </span>
                    <h4 className="font-heading text-base font-bold text-text-primary group-hover:text-rose-300 transition-colors leading-snug">
                      {vid.title}
                    </h4>
                    <p className="text-xs text-text-secondary mt-1.5 line-clamp-3 leading-relaxed">
                      {vid.description}
                    </p>
                  </div>

                  <div className="rounded-2xl border border-primary/20 bg-primary/10 p-3 flex items-start gap-2.5 text-xs">
                    <Lightbulb className="h-4 w-4 text-primary-light shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-primary-light block text-[11px]">
                        Lead Auditor Takeaway:
                      </span>
                      <p className="text-text-secondary text-[11px] leading-relaxed mt-0.5">
                        {vid.auditorTakeaway}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-white/10 flex items-center gap-2">
                  <a
                    href={vid.youtubeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-rose-600 hover:bg-rose-700 py-2.5 text-xs font-bold text-white transition-all shadow-md shadow-rose-600/20 border border-white/15"
                  >
                    <Youtube className="h-4 w-4" />
                    <span>Watch on YouTube</span>
                    <ExternalLink className="h-3 w-3" />
                  </a>

                  <button
                    onClick={() =>
                      openAiModal({
                        framework: framework.code,
                        topic: vid.title,
                        prompt: `Summarize the essential audit controls and implementation guidance for the topic: "${vid.title}". Specific topics: ${vid.keyTopics.join(', ')}.`,
                      })
                    }
                    className="px-3 py-2.5 rounded-xl border border-white/10 bg-white/5 text-xs font-medium text-text-secondary hover:text-text-primary hover:bg-white/10 hover:border-white/20 transition-all flex items-center gap-1 backdrop-blur-sm"
                    title="Generate AI Study Notes for this video"
                  >
                    <Sparkles className="h-3.5 w-3.5 text-primary-light" />
                    <span>AI Notes</span>
                  </button>
                </div>
              </div>
            ))}
          </div>

        </div>
      )}

    </div>
  );
};
