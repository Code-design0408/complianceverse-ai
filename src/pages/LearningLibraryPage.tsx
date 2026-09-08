import React, { useState } from 'react';
import {
  BookOpen,
  Search,
  Filter,
  ShieldCheck,
  Award,
  Layers,
  ArrowRight,
  Clock,
  CheckCircle2,
  Sparkles,
  Compass,
  Play,
  Youtube,
  ExternalLink,
  Lightbulb,
  Check,
  Lock,
  ChevronRight,
  X,
  Target,
  FileCheck,
  Flame,
  GraduationCap
} from 'lucide-react';
import { useAuthAndData } from '../context/AuthAndDataContext';
import { SUGGESTED_FRAMEWORK_VIDEOS } from '../data/videoResources';
import { LearningPath, LearningPathLevel } from '../types';

interface LearningLibraryPageProps {
  setCurrentTab: (tab: string) => void;
  setSelectedFrameworkId: (id: string) => void;
  setSelectedLessonId?: (id: string) => void;
}

export const LearningLibraryPage: React.FC<LearningLibraryPageProps> = ({
  setCurrentTab,
  setSelectedFrameworkId,
  setSelectedLessonId,
}) => {
  const { frameworks, completedLessonIds, learningPaths, startExam, openAiModal } = useAuthAndData();

  const [activeView, setActiveView] = useState<'frameworks' | 'paths' | 'videos'>('frameworks');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [videoFrameworkFilter, setVideoFrameworkFilter] = useState('All');
  
  // Learning Path Level Filter
  const [selectedPathLevel, setSelectedPathLevel] = useState<string>('All');
  const [selectedPathForModal, setSelectedPathForModal] = useState<LearningPath | null>(null);
  const [pathModalTab, setPathModalTab] = useState<'overview' | 'curriculum'>('overview');

  const categories = ['All', 'Cloud & SaaS', 'Security & Privacy', 'Cybersecurity', 'Governance & Risk', 'Financial & Payments'];

  const filteredFrameworks = frameworks.filter((f) => {
    const matchesSearch = f.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || f.category.toLowerCase().includes(selectedCategory.toLowerCase());
    return matchesSearch && matchesCategory;
  });

  const allVideos = Object.values(SUGGESTED_FRAMEWORK_VIDEOS).flat();
  const filteredVideos = allVideos.filter((v) => {
    const matchesSearch = v.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.channel.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.keyTopics.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesFramework = videoFrameworkFilter === 'All' || v.frameworkId === videoFrameworkFilter;
    return matchesSearch && matchesFramework;
  });

  const filteredLearningPaths = learningPaths.filter((p) => {
    const matchesLevel = selectedPathLevel === 'All' || p.level === selectedPathLevel;
    const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.roleTarget.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesLevel && matchesSearch;
  });

  // Level badge styling helper
  const getLevelBadge = (level?: LearningPathLevel | string) => {
    switch (level) {
      case 'Beginner':
        return {
          label: 'Level 1 — Beginner',
          color: 'text-emerald-400 bg-emerald-500/15 border-emerald-500/30',
          dotColor: 'bg-emerald-400'
        };
      case 'Intermediate':
        return {
          label: 'Level 2 — Intermediate',
          color: 'text-sky-400 bg-sky-500/15 border-sky-500/30',
          dotColor: 'bg-sky-400'
        };
      case 'Advanced':
        return {
          label: 'Level 3 — Advanced',
          color: 'text-violet-400 bg-violet-500/15 border-violet-500/30',
          dotColor: 'bg-violet-400'
        };
      case 'Expert':
        return {
          label: 'Level 4 — Expert',
          color: 'text-amber-400 bg-amber-500/15 border-amber-500/30',
          dotColor: 'bg-amber-400'
        };
      default:
        return {
          label: 'Core Pathway',
          color: 'text-primary-light bg-primary/15 border-primary/30',
          dotColor: 'bg-primary-light'
        };
    }
  };

  const handleLaunchModule = (frameworkId?: string, targetLessonId?: string) => {
    if (selectedPathForModal) {
      setSelectedPathForModal(null);
    }
    if (frameworkId) {
      setSelectedFrameworkId(frameworkId);
      if (targetLessonId && setSelectedLessonId) {
        setSelectedLessonId(targetLessonId);
        setCurrentTab('lesson');
      } else {
        setCurrentTab('framework-details');
      }
    } else {
      setSelectedFrameworkId('iso27001');
      setCurrentTab('framework-details');
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in duration-300">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary/20 text-primary-light border border-primary/30">
              <BookOpen className="h-4 w-4" />
            </div>
            <h1 className="font-heading text-2xl sm:text-3xl font-extrabold text-text-primary">
              Curriculum & Learning Architecture
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-text-muted mt-1">
            Master enterprise Cybersecurity, GRC, Risk Management, and Security Frameworks through structured 4-level learning paths and deep-dive standards.
          </p>
        </div>

        {/* View Switcher Tabs */}
        <div className="flex rounded-2xl bg-white/[0.04] p-1 border border-white/10 shrink-0 self-start md:self-auto backdrop-blur-md">
          <button
            id="tab-view-frameworks"
            onClick={() => setActiveView('frameworks')}
            className={`rounded-xl px-4 py-1.5 text-xs font-bold transition-all ${
              activeView === 'frameworks'
                ? 'bg-primary text-white shadow-md shadow-primary/20 border border-white/15'
                : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            Framework Explorer ({frameworks.length})
          </button>
          <button
            id="tab-view-paths"
            onClick={() => setActiveView('paths')}
            className={`rounded-xl px-4 py-1.5 text-xs font-bold transition-all ${
              activeView === 'paths'
                ? 'bg-primary text-white shadow-md shadow-primary/20 border border-white/15'
                : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            Learning Paths ({learningPaths.length})
          </button>
          <button
            id="tab-view-videos"
            onClick={() => setActiveView('videos')}
            className={`rounded-xl px-4 py-1.5 text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeView === 'videos'
                ? 'bg-rose-600 text-white shadow-md shadow-rose-600/20 border border-white/15'
                : 'text-text-secondary hover:text-rose-300'
            }`}
          >
            <Youtube className="h-3.5 w-3.5" />
            <span>Video Guides ({allVideos.length})</span>
          </button>
        </div>
      </div>

      {/* =========================================================================
          VIEW 1: FRAMEWORKS EXPLORER
      ========================================================================= */}
      {activeView === 'frameworks' && (
        <div className="space-y-6">
          
          {/* Search & Category Filter Bar */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" />
              <input
                id="search-frameworks"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search standards (e.g., ISO 27001, NIST CSF, SOC 2, CIS Controls, GDPR, PCI DSS)..."
                className="w-full rounded-2xl border border-white/10 bg-white/[0.04] pl-10 pr-4 py-2.5 text-xs text-text-primary placeholder:text-text-muted focus:border-primary-light focus:outline-none backdrop-blur-md shadow-inner"
              />
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1 sm:pb-0">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`rounded-xl px-3.5 py-2 text-xs font-medium whitespace-nowrap transition-all backdrop-blur-md ${
                    selectedCategory === cat
                      ? 'bg-primary/30 text-primary-light border border-primary/50 font-bold shadow-sm'
                      : 'bg-white/[0.04] text-text-secondary border border-white/10 hover:border-white/20 hover:bg-white/[0.08]'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Framework Cards Grid */}
          {filteredFrameworks.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredFrameworks.map((f) => {
                const totalLessons = f.lessons.length;
                const completedCount = f.lessons.filter(l => completedLessonIds.includes(l.id)).length;
                const pct = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;
                const isAllDone = pct === 100 && totalLessons > 0;
                const videoCount = (f.suggestedVideos || SUGGESTED_FRAMEWORK_VIDEOS[f.id] || []).length;

                return (
                  <div
                    key={f.id}
                    id={`framework-card-${f.id}`}
                    className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 flex flex-col justify-between hover:border-primary-light/40 hover:bg-white/[0.07] hover:shadow-2xl hover:shadow-primary/10 transition-all group backdrop-blur-xl"
                  >
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="rounded-full bg-primary/20 border border-primary/30 px-3 py-1 text-xs font-bold text-primary-light uppercase tracking-wider backdrop-blur-sm">
                          {f.code}
                        </span>
                        <span className="text-[11px] font-mono text-text-muted">
                          {f.version}
                        </span>
                      </div>

                      <div>
                        <h3 className="font-heading text-lg font-bold text-text-primary group-hover:text-primary-light transition-colors">
                          {f.title}
                        </h3>
                        <p className="text-xs text-text-secondary mt-1.5 line-clamp-3 leading-relaxed">
                          {f.description}
                        </p>
                      </div>

                      <div className="flex flex-wrap gap-2 pt-1 text-[11px] text-text-muted">
                        <span className="rounded-lg bg-white/5 px-2.5 py-0.5 border border-white/10 backdrop-blur-sm">
                          {f.modules.length} Modules
                        </span>
                        <span className="rounded-lg bg-white/5 px-2.5 py-0.5 border border-white/10 backdrop-blur-sm">
                          {f.totalControls} Controls
                        </span>
                        <span className="rounded-lg bg-rose-500/10 px-2.5 py-0.5 border border-rose-500/20 text-rose-300 font-semibold flex items-center gap-1 backdrop-blur-sm">
                          <Youtube className="h-3 w-3" />
                          {videoCount} Videos
                        </span>
                        <span className="rounded-lg bg-white/5 px-2.5 py-0.5 border border-white/10 text-primary-light font-mono font-semibold backdrop-blur-sm">
                          +{f.xpReward} XP
                        </span>
                      </div>
                    </div>

                    {/* Progress & Actions */}
                    <div className="mt-6 pt-4 border-t border-white/10 space-y-3">
                      <div>
                        <div className="flex items-center justify-between text-xs mb-1">
                          <span className="text-text-muted">Mastery Progress</span>
                          <span className="font-mono font-bold text-text-primary">{pct}%</span>
                        </div>
                        <div className="h-2 w-full bg-black/40 border border-white/5 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-500 ${
                              isAllDone ? 'bg-emerald-500' : 'bg-primary'
                            }`}
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </div>

                      <div className="flex items-center gap-2 pt-1">
                        <button
                          id={`btn-study-${f.id}`}
                          onClick={() => {
                            setSelectedFrameworkId(f.id);
                            setCurrentTab('framework-details');
                          }}
                          className="flex-1 flex items-center justify-center gap-1.5 rounded-xl bg-primary py-2.5 text-xs font-bold text-white hover:bg-primary-dark transition-all shadow-md shadow-primary/20 border border-white/15"
                        >
                          <span>Explore Deep Dive</span>
                          <ArrowRight className="h-3.5 w-3.5" />
                        </button>

                        <button
                          onClick={() => {
                            startExam('quick', f.id);
                            setCurrentTab('active-exam');
                          }}
                          className="px-3 py-2.5 rounded-xl border border-white/10 bg-white/5 text-xs font-medium text-text-secondary hover:text-text-primary hover:bg-white/10 hover:border-white/20 transition-all flex items-center gap-1 backdrop-blur-sm"
                          title="Quick 10-Q Mock Audit"
                        >
                          <Play className="h-3.5 w-3.5 text-primary-light" />
                          <span>Exam</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-12 text-center backdrop-blur-xl">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/5 border border-white/10 text-text-muted mx-auto mb-3">
                <Search className="h-6 w-6" />
              </div>
              <h3 className="text-base font-bold text-text-primary">No Matching Frameworks Found</h3>
              <p className="text-xs text-text-muted mt-1 max-w-sm mx-auto">
                No standards matched your search "{searchQuery}". Try clearing filters or searching for terms like "ISO 27001", "SOC 2", or "NIST CSF".
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('All');
                }}
                className="mt-4 rounded-xl bg-white/10 px-4 py-2 text-xs font-bold text-text-primary hover:bg-white/20 transition-all border border-white/15"
              >
                Reset Search Filters
              </button>
            </div>
          )}

        </div>
      )}

      {/* =========================================================================
          VIEW 2: STRUCTURED 4-LEVEL LEARNING PATHS
      ========================================================================= */}
      {activeView === 'paths' && (
        <div className="space-y-6 animate-in fade-in">
          
          {/* Header Banner */}
          <div className="rounded-3xl border border-white/15 bg-gradient-to-r from-primary/25 via-white/[0.04] to-black/40 p-6 backdrop-blur-2xl shadow-xl">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <Compass className="h-5 w-5 text-primary-light" />
                  <h3 className="font-heading text-lg font-bold text-text-primary">
                    Structured Enterprise Learning Paths
                  </h3>
                </div>
                <p className="text-xs text-text-secondary max-w-2xl leading-relaxed">
                  Engineered curriculum spanning 4 sequential proficiency tiers: from foundational threat modeling and compliance lifecycles up to high-stakes incident command and executive GRC board strategy.
                </p>
              </div>

              <div className="flex items-center gap-2 text-xs font-mono text-text-muted bg-white/5 px-4 py-2 rounded-2xl border border-white/10 shrink-0">
                <Flame className="h-4 w-4 text-amber-400" />
                <span>19 Paths Available</span>
              </div>
            </div>
          </div>

          {/* Level Filter Tabs Bar & Search */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" />
              <input
                id="search-learning-paths"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search learning paths by topic or target job role..."
                className="w-full rounded-2xl border border-white/10 bg-white/[0.04] pl-10 pr-4 py-2.5 text-xs text-text-primary placeholder:text-text-muted focus:border-primary-light focus:outline-none backdrop-blur-md"
              />
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1 sm:pb-0">
              {[
                { id: 'All', label: 'All Levels (19)' },
                { id: 'Beginner', label: 'Level 1 — Beginner (4)' },
                { id: 'Intermediate', label: 'Level 2 — Intermediate (5)' },
                { id: 'Advanced', label: 'Level 3 — Advanced (5)' },
                { id: 'Expert', label: 'Level 4 — Expert (5)' }
              ].map((lvl) => (
                <button
                  key={lvl.id}
                  id={`filter-level-${lvl.id}`}
                  onClick={() => setSelectedPathLevel(lvl.id)}
                  className={`rounded-xl px-3.5 py-2 text-xs font-semibold whitespace-nowrap transition-all backdrop-blur-md ${
                    selectedPathLevel === lvl.id
                      ? 'bg-primary text-white font-bold shadow-md shadow-primary/20 border border-white/15'
                      : 'bg-white/[0.04] text-text-secondary border border-white/10 hover:bg-white/[0.08] hover:text-text-primary'
                  }`}
                >
                  {lvl.label}
                </button>
              ))}
            </div>
          </div>

          {/* Learning Paths Grid */}
          {filteredLearningPaths.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredLearningPaths.map((path) => {
                const badge = getLevelBadge(path.level);
                const pct = path.progressPercentage || 0;
                const hours = path.estimatedHours || 6;
                const modules = path.modulesCount || path.curriculumModules?.length || 5;

                return (
                  <div
                    key={path.id}
                    id={`path-card-${path.id}`}
                    className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 flex flex-col justify-between hover:border-primary-light/40 hover:bg-white/[0.07] hover:shadow-2xl hover:shadow-primary/10 transition-all backdrop-blur-xl group"
                  >
                    <div className="space-y-4">
                      {/* Badge & Timing */}
                      <div className="flex items-center justify-between">
                        <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider border flex items-center gap-1.5 ${badge.color}`}>
                          <span className={`h-1.5 w-1.5 rounded-full ${badge.dotColor}`} />
                          {badge.label}
                        </span>

                        <div className="flex items-center gap-1 text-xs text-text-muted font-mono">
                          <Clock className="h-3 w-3" />
                          <span>{path.estimatedTime || `${hours} Hours`}</span>
                        </div>
                      </div>

                      {/* Title & Role */}
                      <div>
                        <h3 className="font-heading text-lg font-bold text-text-primary group-hover:text-primary-light transition-colors">
                          {path.title}
                        </h3>
                        <p className="text-xs text-primary-light font-medium mt-0.5">
                          Target: {path.roleTarget}
                        </p>
                        <p className="text-xs text-text-secondary mt-2 leading-relaxed line-clamp-3">
                          {path.description}
                        </p>
                      </div>

                      {/* Milestones Preview */}
                      {path.milestones && path.milestones.length > 0 && (
                        <div className="space-y-1.5 pt-1">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-text-muted block">
                            Key Milestones ({path.milestones.length}):
                          </span>
                          <div className="space-y-1">
                            {path.milestones.slice(0, 2).map((m, idx) => (
                              <div key={idx} className="flex items-start gap-1.5 text-xs text-text-secondary">
                                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0 mt-0.5" />
                                <span className="line-clamp-1">{m}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Progress bar */}
                      <div className="pt-2">
                        <div className="flex items-center justify-between text-xs mb-1">
                          <span className="text-text-muted">{modules} Modules</span>
                          <span className="font-mono font-bold text-text-primary">{pct}% Complete</span>
                        </div>
                        <div className="h-1.5 w-full bg-black/40 border border-white/5 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-primary to-accent-light rounded-full transition-all duration-500"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="mt-6 pt-4 border-t border-white/10 flex items-center gap-2">
                      <button
                        id={`btn-overview-${path.id}`}
                        onClick={() => {
                          setSelectedPathForModal(path);
                          setPathModalTab('overview');
                        }}
                        className="flex-1 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 py-2.5 text-xs font-semibold text-text-secondary hover:text-text-primary transition-all flex items-center justify-center gap-1.5 backdrop-blur-sm"
                      >
                        <Layers className="h-3.5 w-3.5 text-primary-light" />
                        <span>Curriculum</span>
                      </button>

                      <button
                        id={`btn-start-${path.id}`}
                        onClick={() => {
                          const firstMod = path.curriculumModules?.[0];
                          const targetFw = firstMod?.frameworkId || path.modulesIncluded?.[0]?.frameworkId || 'iso27001';
                          const targetLesson = firstMod?.targetLessonId;
                          handleLaunchModule(targetFw, targetLesson);
                        }}
                        className="flex-1 flex items-center justify-center gap-1.5 rounded-xl bg-primary py-2.5 text-xs font-bold text-white hover:bg-primary-dark transition-all shadow-md shadow-primary/20 border border-white/15"
                      >
                        <span>{pct > 0 ? 'Continue' : 'Start Path'}</span>
                        <ArrowRight className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-12 text-center backdrop-blur-xl">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/5 border border-white/10 text-text-muted mx-auto mb-3">
                <Compass className="h-6 w-6" />
              </div>
              <h3 className="text-base font-bold text-text-primary">No Learning Paths Found</h3>
              <p className="text-xs text-text-muted mt-1 max-w-sm mx-auto">
                No learning pathways matched your level selection or search query "{searchQuery}".
              </p>
              <button
                onClick={() => {
                  setSelectedPathLevel('All');
                  setSearchQuery('');
                }}
                className="mt-4 rounded-xl bg-white/10 px-4 py-2 text-xs font-bold text-text-primary hover:bg-white/20 transition-all border border-white/15"
              >
                Show All Learning Paths
              </button>
            </div>
          )}

        </div>
      )}

      {/* =========================================================================
          VIEW 3: SUGGESTED YOUTUBE VIDEO GUIDES CATALOG
      ========================================================================= */}
      {activeView === 'videos' && (
        <div className="space-y-6 animate-in fade-in">
          
          {/* Header */}
          <div className="rounded-3xl border border-rose-500/20 bg-gradient-to-r from-rose-500/15 via-white/[0.04] to-black/40 p-6 backdrop-blur-2xl shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Youtube className="h-5 w-5 text-rose-500" />
                <h3 className="font-heading text-lg font-bold text-text-primary">
                  Curated Compliance Video Suggestions & Technical Masterclasses
                </h3>
              </div>
              <p className="text-xs text-text-secondary max-w-2xl leading-relaxed">
                Watch in-depth explanations on SOC 2 Trust Services Criteria, ISO 27001 ISMS implementation, NIST CSF 2.0 Govern function, HIPAA technical safeguards, and PCI-DSS 4.0 scoping.
              </p>
            </div>

            <a
              href="https://www.youtube.com/results?search_query=cybersecurity+grc+compliance+auditor+masterclass"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 rounded-2xl bg-rose-600 hover:bg-rose-700 px-4 py-2.5 text-xs font-bold text-white transition-all shadow-lg shadow-rose-600/20 border border-white/10 shrink-0 self-start md:self-auto"
            >
              <Youtube className="h-4 w-4" />
              <span>Browse YouTube Hub</span>
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </div>

          {/* Framework Filter Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search videos by compliance framework, criteria, or auditor topic..."
                className="w-full rounded-2xl border border-white/10 bg-white/[0.04] pl-10 pr-4 py-2.5 text-xs text-text-primary placeholder:text-text-muted focus:border-rose-400 focus:outline-none backdrop-blur-md"
              />
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1 sm:pb-0">
              {[
                { id: 'All', label: 'All Standards' },
                { id: 'iso27001', label: 'ISO 27001' },
                { id: 'nistcsf', label: 'NIST CSF' },
                { id: 'soc2', label: 'SOC 2' },
                { id: 'gdpr', label: 'GDPR' },
                { id: 'pcidss', label: 'PCI DSS' },
                { id: 'cis-controls', label: 'CIS Controls' },
              ].map((fw) => (
                <button
                  key={fw.id}
                  onClick={() => setVideoFrameworkFilter(fw.id)}
                  className={`rounded-xl px-3 py-2 text-xs font-medium whitespace-nowrap transition-all backdrop-blur-md ${
                    videoFrameworkFilter === fw.id
                      ? 'bg-rose-500/25 text-rose-300 border border-rose-500/40 font-bold'
                      : 'bg-white/[0.04] text-text-secondary border border-white/10 hover:bg-white/[0.08]'
                  }`}
                >
                  {fw.label}
                </button>
              ))}
            </div>
          </div>

          {/* Videos Grid */}
          {filteredVideos.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredVideos.map((vid) => {
                const matchedFw = frameworks.find(f => f.id === vid.frameworkId);
                return (
                  <div
                    key={vid.id}
                    className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 flex flex-col justify-between hover:border-rose-500/40 hover:bg-white/[0.07] hover:shadow-2xl hover:shadow-rose-500/10 transition-all backdrop-blur-xl group"
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
                        <span className="text-[10px] font-bold uppercase tracking-wider text-primary-light block mb-1">
                          {matchedFw?.code || vid.frameworkId.toUpperCase()} Compliance
                        </span>
                        <h4 className="font-heading text-base font-bold text-text-primary group-hover:text-rose-300 transition-colors leading-snug">
                          {vid.title}
                        </h4>
                        <p className="text-xs text-text-secondary mt-1.5 line-clamp-3 leading-relaxed">
                          {vid.description}
                        </p>
                      </div>

                      <div className="rounded-2xl border border-primary/20 bg-primary/10 p-3 text-xs flex items-start gap-2">
                        <Lightbulb className="h-4 w-4 text-primary-light shrink-0 mt-0.5" />
                        <p className="text-[11px] text-text-secondary line-clamp-2">
                          <strong>Key Takeaway:</strong> {vid.auditorTakeaway || vid.description}
                        </p>
                      </div>
                    </div>

                    <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between">
                      <span className="text-xs text-text-muted font-medium">
                        By {vid.channel}
                      </span>
                      
                      <a
                        href={vid.youtubeUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 px-3 py-1.5 text-xs font-bold text-white transition-all shadow-md shadow-rose-600/20"
                      >
                        <Play className="h-3 w-3 fill-current" />
                        <span>Watch Guide</span>
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-12 text-center backdrop-blur-xl">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/5 border border-white/10 text-text-muted mx-auto mb-3">
                <Youtube className="h-6 w-6 text-rose-500" />
              </div>
              <h3 className="text-base font-bold text-text-primary">No Matching Video Guides</h3>
              <p className="text-xs text-text-muted mt-1 max-w-sm mx-auto">
                No videos matched your filter criteria. Try clearing search filters to see all video suggestions.
              </p>
            </div>
          )}

        </div>
      )}

      {/* =========================================================================
          INTERACTIVE LEARNING PATH OVERVIEW & CURRICULUM MODAL
      ========================================================================= */}
      {selectedPathForModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
          <div className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-3xl border border-white/15 bg-[#12080C] p-6 sm:p-8 shadow-2xl space-y-6">
            
            {/* Close Button */}
            <button
              id="btn-close-path-modal"
              onClick={() => setSelectedPathForModal(null)}
              className="absolute top-5 right-5 h-8 w-8 rounded-full bg-white/10 flex items-center justify-center text-text-muted hover:text-white hover:bg-white/20 transition-all border border-white/10"
            >
              <X className="h-4 w-4" />
            </button>

            {/* Modal Header */}
            <div className="space-y-3 pr-10">
              <div className="flex flex-wrap items-center gap-2">
                <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider border ${getLevelBadge(selectedPathForModal.level).color}`}>
                  {getLevelBadge(selectedPathForModal.level).label}
                </span>
                <span className="rounded-full bg-white/5 px-2.5 py-0.5 text-[11px] text-text-muted border border-white/10">
                  {selectedPathForModal.estimatedTime || `${selectedPathForModal.estimatedHours} Hours`}
                </span>
                <span className="rounded-full bg-primary/20 px-2.5 py-0.5 text-[11px] text-primary-light border border-primary/30 font-medium">
                  {selectedPathForModal.modulesCount || selectedPathForModal.curriculumModules?.length || 5} Modules
                </span>
              </div>

              <h2 className="font-heading text-2xl font-extrabold text-text-primary">
                {selectedPathForModal.title}
              </h2>

              <p className="text-xs text-primary-light font-medium">
                Target Role: {selectedPathForModal.roleTarget}
              </p>

              <p className="text-xs text-text-secondary leading-relaxed">
                {selectedPathForModal.description}
              </p>
            </div>

            {/* Tab Navigation in Modal */}
            <div className="flex border-b border-white/10 gap-1">
              <button
                id="btn-path-modal-tab-overview"
                onClick={() => setPathModalTab('overview')}
                className={`px-4 py-2.5 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 ${
                  pathModalTab === 'overview'
                    ? 'border-primary-light text-primary-light bg-white/[0.03]'
                    : 'border-transparent text-text-muted hover:text-text-primary'
                }`}
              >
                <Target className="h-3.5 w-3.5" />
                <span>Overview & Objectives</span>
              </button>

              <button
                id="btn-path-modal-tab-curriculum"
                onClick={() => setPathModalTab('curriculum')}
                className={`px-4 py-2.5 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 ${
                  pathModalTab === 'curriculum'
                    ? 'border-primary-light text-primary-light bg-white/[0.03]'
                    : 'border-transparent text-text-muted hover:text-text-primary'
                }`}
              >
                <GraduationCap className="h-3.5 w-3.5" />
                <span>Curriculum Modules ({selectedPathForModal.curriculumModules?.length || 5})</span>
              </button>
            </div>

            {/* Modal Body: Overview */}
            {pathModalTab === 'overview' && (
              <div className="space-y-6 animate-in fade-in">
                {/* Why It Matters Callout */}
                {selectedPathForModal.overview?.whyItMatters && (
                  <div className="rounded-2xl border border-primary/30 bg-primary/10 p-4 space-y-1 backdrop-blur-sm">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-primary-light flex items-center gap-1">
                      <Sparkles className="h-3.5 w-3.5 text-amber-400" />
                      Why This Learning Path Matters:
                    </span>
                    <p className="text-xs text-text-secondary leading-relaxed">
                      {selectedPathForModal.overview.whyItMatters}
                    </p>
                  </div>
                )}

                {/* What You Will Learn */}
                {selectedPathForModal.overview?.whatYouWillLearn && (
                  <div className="space-y-2.5">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-text-primary flex items-center gap-1.5">
                      <FileCheck className="h-4 w-4 text-emerald-400" />
                      What You Will Learn:
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {selectedPathForModal.overview.whatYouWillLearn.map((item, idx) => (
                        <div
                          key={idx}
                          className="rounded-2xl border border-white/10 bg-white/[0.03] p-3 text-xs text-text-secondary flex items-start gap-2 backdrop-blur-sm"
                        >
                          <Check className="h-3.5 w-3.5 text-emerald-400 shrink-0 mt-0.5" />
                          <span className="leading-snug">{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Learning Objectives */}
                {selectedPathForModal.overview?.learningObjectives && (
                  <div className="space-y-2.5">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-text-primary flex items-center gap-1.5">
                      <Target className="h-4 w-4 text-sky-400" />
                      Measurable Learning Objectives:
                    </h4>
                    <ul className="space-y-2 text-xs text-text-secondary">
                      {selectedPathForModal.overview.learningObjectives.map((obj, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-primary/20 text-primary-light text-[10px] font-bold mt-0.5">
                            {idx + 1}
                          </span>
                          <span className="leading-relaxed">{obj}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {/* Modal Body: Curriculum Modules */}
            {pathModalTab === 'curriculum' && (
              <div className="space-y-3 animate-in fade-in">
                {selectedPathForModal.curriculumModules && selectedPathForModal.curriculumModules.length > 0 ? (
                  selectedPathForModal.curriculumModules.map((mod, idx) => {
                    const isCompleted = mod.status === 'completed';
                    const isCurrent = mod.status === 'current';
                    const isLocked = mod.status === 'locked';

                    return (
                      <div
                        key={mod.id}
                        className={`rounded-2xl border p-4 transition-all ${
                          isCurrent
                            ? 'border-primary-light/50 bg-primary/10 shadow-lg'
                            : isCompleted
                            ? 'border-emerald-500/30 bg-emerald-500/5'
                            : 'border-white/10 bg-white/[0.03]'
                        }`}
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="text-[10px] font-mono font-bold text-primary-light uppercase">
                                Module {mod.order || idx + 1}
                              </span>
                              {isCompleted && (
                                <span className="rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-bold px-2 py-0.5 border border-emerald-500/30 flex items-center gap-1">
                                  <CheckCircle2 className="h-2.5 w-2.5" /> Completed
                                </span>
                              )}
                              {isCurrent && (
                                <span className="rounded-full bg-primary/30 text-primary-light text-[10px] font-bold px-2 py-0.5 border border-primary/50">
                                  In Progress
                                </span>
                              )}
                            </div>

                            <h5 className="text-sm font-bold text-text-primary">
                              {mod.title}
                            </h5>

                            <p className="text-xs text-text-secondary leading-relaxed">
                              {mod.description}
                            </p>

                            <div className="flex items-center gap-3 text-[11px] text-text-muted pt-1">
                              <span className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                <span>{mod.durationMinutes} Mins</span>
                              </span>
                              <span>•</span>
                              <span>{mod.lessonsCount} Lessons</span>
                            </div>
                          </div>

                          <div className="shrink-0 self-start sm:self-auto">
                            {isLocked ? (
                              <span className="flex items-center gap-1 text-xs text-text-muted bg-white/5 px-3 py-1.5 rounded-xl border border-white/10">
                                <Lock className="h-3 w-3" /> Locked
                              </span>
                            ) : (
                              <button
                                onClick={() => handleLaunchModule(mod.frameworkId, mod.targetLessonId)}
                                className={`flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-bold transition-all ${
                                  isCurrent
                                    ? 'bg-primary text-white shadow-md shadow-primary/20 hover:bg-primary-dark border border-white/15'
                                    : 'bg-white/10 text-text-primary hover:bg-white/20 border border-white/15'
                                }`}
                              >
                                <span>{isCompleted ? 'Review' : 'Launch'}</span>
                                <ArrowRight className="h-3 w-3" />
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <p className="text-xs text-text-muted py-6 text-center">
                    Curriculum modules are being initialized.
                  </p>
                )}
              </div>
            )}

            {/* Modal Bottom Footer Actions */}
            <div className="pt-4 border-t border-white/10 flex items-center justify-between">
              <span className="text-xs text-text-muted font-mono">
                {selectedPathForModal.progressPercentage || 0}% Progress
              </span>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setSelectedPathForModal(null)}
                  className="rounded-xl px-4 py-2 text-xs font-semibold text-text-secondary hover:text-white transition-colors"
                >
                  Close
                </button>

                <button
                  onClick={() => {
                    const firstMod = selectedPathForModal.curriculumModules?.[0];
                    const targetFw = firstMod?.frameworkId || selectedPathForModal.modulesIncluded?.[0]?.frameworkId || 'iso27001';
                    const targetLesson = firstMod?.targetLessonId;
                    handleLaunchModule(targetFw, targetLesson);
                  }}
                  className="rounded-xl bg-primary px-5 py-2 text-xs font-bold text-white hover:bg-primary-dark transition-all shadow-md shadow-primary/20 border border-white/15 flex items-center gap-1.5"
                >
                  <span>Start Learning Track</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
