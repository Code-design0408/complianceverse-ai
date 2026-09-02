import React, { useState } from 'react';
import {
  ArrowLeft,
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
  Check
} from 'lucide-react';
import { useAuthAndData } from '../context/AuthAndDataContext';
import { SUGGESTED_FRAMEWORK_VIDEOS } from '../data/videoResources';
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

  const [activeSubTab, setActiveSubTab] = useState<'modules' | 'controls' | 'suggestions'>('modules');
  const [controlSearch, setControlSearch] = useState('');
  const [videoSearch, setVideoSearch] = useState('');
  const [videoDifficulty, setVideoDifficulty] = useState<string>('All');
  const [selectedVideoModal, setSelectedVideoModal] = useState<FrameworkVideoResource | null>(null);

  const framework = frameworks.find((f) => f.id === frameworkId) || frameworks[0];

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
          onClick={() => setCurrentTab('library')}
          className="flex items-center gap-2 text-xs font-semibold text-text-muted hover:text-text-primary transition-colors group"
        >
          <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
          <span>Back to Frameworks Catalog</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={() =>
              openAiModal({
                framework: framework.code,
                topic: 'Framework Overview and Auditor Preparation Strategy',
                prompt: `Explain the core audit requirements and best implementation practices for ${framework.title}.`,
              })
            }
            className="flex items-center gap-1.5 rounded-xl border border-primary/40 bg-primary/20 px-3.5 py-1.5 text-xs font-bold text-primary-light hover:bg-primary/30 transition-all backdrop-blur-md"
          >
            <Sparkles className="h-3.5 w-3.5 animate-pulse" />
            <span>Ask ComplyAI</span>
          </button>

          <button
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
              Curriculum Mastery Progress ({completedCount}/{totalLessons} Lessons)
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

      {/* Tab Switcher: Modules vs Controls vs Suggested Videos (YouTube) */}
      <div className="flex flex-wrap border-b border-white/10 gap-1">
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

      {/* Sub-Tab 1: Modules & Lessons */}
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
                        onClick={() => {
                          setSelectedLessonId(lesson.id);
                          setCurrentTab('lesson');
                        }}
                        className="flex items-center justify-between p-4 sm:px-6 hover:bg-white/[0.05] cursor-pointer transition-colors group"
                      >
                        <div className="flex items-center gap-4">
                          <div
                            className={`flex h-9 w-9 items-center justify-center rounded-xl border transition-all ${
                              isDone
                                ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                                : 'bg-white/5 text-text-muted border-white/10 group-hover:border-primary-light/40 group-hover:text-primary-light'
                            }`}
                          >
                            {isDone ? (
                              <CheckCircle2 className="h-4 w-4" />
                            ) : (
                              <FileText className="h-4 w-4" />
                            )}
                          </div>

                          <div>
                            <h4 className="text-xs sm:text-sm font-bold text-text-primary group-hover:text-primary-light transition-colors">
                              {lesson.title}
                            </h4>
                            <p className="text-[11px] text-text-muted mt-0.5 line-clamp-1">
                              {lesson.summary}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 shrink-0">
                          <span className="text-[11px] text-text-muted flex items-center gap-1 hidden sm:flex">
                            <Clock className="h-3.5 w-3.5" />
                            {lesson.estimatedMinutes} mins
                          </span>
                          <ChevronRight className="h-4 w-4 text-text-muted group-hover:text-primary-light group-hover:translate-x-1 transition-all" />
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

      {/* Sub-Tab 2: Audit Controls Checklist */}
      {activeSubTab === 'controls' && (
        <div className="space-y-4">
          <div className="relative max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" />
            <input
              type="text"
              value={controlSearch}
              onChange={(e) => setControlSearch(e.target.value)}
              placeholder="Search controls by code, domain, or requirement..."
              className="w-full rounded-2xl border border-white/10 bg-white/[0.04] pl-10 pr-4 py-2.5 text-xs text-text-primary placeholder:text-text-muted focus:border-primary-light focus:outline-none backdrop-blur-md shadow-inner"
            />
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/[0.04] overflow-hidden backdrop-blur-xl shadow-lg">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-white/[0.05] border-b border-white/10 text-text-muted uppercase font-semibold">
                  <tr>
                    <th className="px-4 py-3">Control Code</th>
                    <th className="px-4 py-3">Domain / Category</th>
                    <th className="px-4 py-3">Control Title</th>
                    <th className="px-4 py-3">Implementation Guidance & Auditor Focus</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {filteredControls.map((ctl) => (
                    <tr key={ctl.id} className="hover:bg-white/[0.03] transition-colors">
                      <td className="px-4 py-3 font-mono font-bold text-primary-light whitespace-nowrap">
                        {ctl.code}
                      </td>
                      <td className="px-4 py-3 text-text-secondary whitespace-nowrap">
                        <span className="rounded-full bg-white/5 px-2.5 py-0.5 border border-white/10">
                          {ctl.domain}
                        </span>
                      </td>
                      <td className="px-4 py-3 font-semibold text-text-primary">
                        {ctl.title}
                      </td>
                      <td className="px-4 py-3 text-text-muted leading-relaxed">
                        {ctl.guidance}
                      </td>
                    </tr>
                  ))}
                  {filteredControls.length === 0 && (
                    <tr>
                      <td colSpan={4} className="px-4 py-8 text-center text-text-muted">
                        No controls found matching your search term.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Sub-Tab 3: SUGGESTED VIDEO GUIDES & YOUTUBE TUTORIALS */}
      {activeSubTab === 'suggestions' && (
        <div className="space-y-6 animate-in fade-in">
          
          {/* Header Banner */}
          <div className="rounded-3xl border border-rose-500/20 bg-gradient-to-r from-rose-500/15 via-white/[0.03] to-black/40 p-6 backdrop-blur-2xl shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1 max-w-2xl">
              <div className="flex items-center gap-2">
                <Youtube className="h-5 w-5 text-rose-500" />
                <h3 className="font-heading text-lg font-bold text-text-primary">
                  {framework.code} Compliance YouTube Suggestions & Deep-Dive Guides
                </h3>
              </div>
              <p className="text-xs text-text-secondary leading-relaxed">
                Hand-picked video tutorials and auditor masterclasses for {framework.title}. Watch key technical demonstrations on access reviews, evidence collection, and audit preparation directly on YouTube.
              </p>
            </div>

            <a
              href={`https://www.youtube.com/results?search_query=${encodeURIComponent(framework.title + ' compliance audit tutorial')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 rounded-2xl bg-rose-600 hover:bg-rose-700 px-4 py-2.5 text-xs font-bold text-white transition-all shadow-lg shadow-rose-600/20 border border-white/10 shrink-0 self-start md:self-auto"
            >
              <Youtube className="h-4 w-4" />
              <span>Search More on YouTube</span>
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </div>

          {/* Search & Filter Bar */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" />
              <input
                type="text"
                value={videoSearch}
                onChange={(e) => setVideoSearch(e.target.value)}
                placeholder={`Search ${framework.code} video guides by topic, criteria, or keyword...`}
                className="w-full rounded-2xl border border-white/10 bg-white/[0.04] pl-10 pr-4 py-2.5 text-xs text-text-primary placeholder:text-text-muted focus:border-rose-400 focus:outline-none backdrop-blur-md"
              />
            </div>

            <div className="flex items-center gap-1.5">
              {['All', 'Beginner', 'Intermediate', 'Advanced'].map((diff) => (
                <button
                  key={diff}
                  onClick={() => setVideoDifficulty(diff)}
                  className={`rounded-xl px-3 py-2 text-xs font-medium transition-all backdrop-blur-md ${
                    videoDifficulty === diff
                      ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 font-bold'
                      : 'bg-white/[0.04] text-text-secondary border border-white/10 hover:bg-white/[0.08]'
                  }`}
                >
                  {diff}
                </button>
              ))}
            </div>
          </div>

          {/* Video Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredVideos.map((vid) => (
              <div
                key={vid.id}
                className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 flex flex-col justify-between hover:border-rose-500/40 hover:bg-white/[0.07] hover:shadow-2xl hover:shadow-rose-500/10 transition-all backdrop-blur-xl group"
              >
                <div className="space-y-4">
                  {/* Top metadata */}
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5 text-xs font-bold text-rose-400 bg-rose-500/15 border border-rose-500/25 px-2.5 py-1 rounded-full">
                      <Youtube className="h-3.5 w-3.5" />
                      <span>{vid.duration}</span>
                    </span>

                    <div className="flex items-center gap-2">
                      <span className="rounded-full bg-white/5 border border-white/10 px-2.5 py-0.5 text-[10px] font-semibold text-text-muted">
                        {vid.difficulty}
                      </span>
                      <span className="text-[11px] text-text-secondary font-medium">
                        {vid.channel}
                      </span>
                    </div>
                  </div>

                  {/* Title & Description */}
                  <div>
                    <h4 className="font-heading text-base font-bold text-text-primary group-hover:text-rose-300 transition-colors leading-snug">
                      {vid.title}
                    </h4>
                    <p className="text-xs text-text-secondary mt-2 leading-relaxed">
                      {vid.description}
                    </p>
                  </div>

                  {/* Key Topics Covered */}
                  <div className="space-y-1.5 pt-1">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-text-muted">
                      Key Auditor Criteria & Topics:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {vid.keyTopics.map((topic, i) => (
                        <span
                          key={i}
                          className="rounded-lg bg-white/5 border border-white/10 px-2 py-0.5 text-[10px] text-text-secondary"
                        >
                          {topic}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Auditor Takeaway Callout */}
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

                {/* Video Actions */}
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

            {filteredVideos.length === 0 && (
              <div className="col-span-2 rounded-3xl border border-white/10 bg-white/[0.04] p-12 text-center text-text-muted space-y-3">
                <Youtube className="h-8 w-8 text-rose-500 mx-auto opacity-50" />
                <p className="text-sm">No suggested video guides match your current filter.</p>
                <button
                  onClick={() => {
                    setVideoSearch('');
                    setVideoDifficulty('All');
                  }}
                  className="text-xs text-rose-400 hover:underline font-semibold"
                >
                  Reset filters
                </button>
              </div>
            )}
          </div>

        </div>
      )}

    </div>
  );
};
