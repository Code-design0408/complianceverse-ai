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
  Lightbulb
} from 'lucide-react';
import { useAuthAndData } from '../context/AuthAndDataContext';
import { SUGGESTED_FRAMEWORK_VIDEOS } from '../data/videoResources';

interface LearningLibraryPageProps {
  setCurrentTab: (tab: string) => void;
  setSelectedFrameworkId: (id: string) => void;
  setSelectedLessonId?: (id: string) => void;
}

export const LearningLibraryPage: React.FC<LearningLibraryPageProps> = ({
  setCurrentTab,
  setSelectedFrameworkId,
}) => {
  const { frameworks, completedLessonIds, learningPaths, startExam, openAiModal } = useAuthAndData();

  const [activeView, setActiveView] = useState<'frameworks' | 'paths' | 'videos'>('frameworks');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [videoFrameworkFilter, setVideoFrameworkFilter] = useState('All');

  const categories = ['All', 'Cloud & SaaS', 'Security & Privacy', 'Governance & Risk', 'Healthcare', 'Financial & Payments'];

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
              Framework Curriculum & Learning Library
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-text-muted mt-1">
            Explore interactive lessons, YouTube video suggestions, case studies, and controls for the world's most critical compliance standards.
          </p>
        </div>

        {/* View Switcher Tabs */}
        <div className="flex rounded-2xl bg-white/[0.04] p-1 border border-white/10 shrink-0 self-start md:self-auto backdrop-blur-md">
          <button
            onClick={() => setActiveView('frameworks')}
            className={`rounded-xl px-4 py-1.5 text-xs font-bold transition-all ${
              activeView === 'frameworks'
                ? 'bg-primary text-white shadow-md shadow-primary/20 border border-white/15'
                : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            Frameworks ({frameworks.length})
          </button>
          <button
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

      {/* View 1: Frameworks Catalog */}
      {activeView === 'frameworks' && (
        <div className="space-y-6">
          
          {/* Search & Category Filter Bar */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search frameworks (e.g., SOC 2, Annex A, NIST, HIPAA, PCI)..."
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
                          {videoCount} Video Guides
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
                          onClick={() => {
                            setSelectedFrameworkId(f.id);
                            setCurrentTab('framework-details');
                          }}
                          className="flex-1 flex items-center justify-center gap-1.5 rounded-xl bg-primary py-2.5 text-xs font-bold text-white hover:bg-primary-dark transition-all shadow-md shadow-primary/20 border border-white/15"
                        >
                          <span>Study Framework</span>
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
                No compliance standards matched your search query "{searchQuery}". Try clearing filters or searching for terms like "Access Control", "SOC 2", or "NIST".
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

      {/* View 2: Role Learning Paths */}
      {activeView === 'paths' && (
        <div className="space-y-6 animate-in fade-in">
          <div className="rounded-3xl border border-white/15 bg-gradient-to-r from-primary/25 via-white/[0.04] to-black/40 p-6 backdrop-blur-2xl shadow-xl">
            <div className="flex items-center gap-2 mb-2">
              <Compass className="h-5 w-5 text-primary-light" />
              <h3 className="font-heading text-base font-bold text-text-primary">
                Structured Career Pathways
              </h3>
            </div>
            <p className="text-xs text-text-secondary max-w-2xl">
              Curated multi-framework learning tracks engineered for specific cybersecurity career roles and enterprise business milestones.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {learningPaths.map((path) => (
              <div
                key={path.id}
                className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 flex flex-col justify-between hover:border-primary-light/40 hover:bg-white/[0.07] transition-all backdrop-blur-xl shadow-lg"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="rounded-full bg-primary/20 border border-primary/30 px-2.5 py-0.5 text-[10px] font-bold text-primary-light uppercase backdrop-blur-sm">
                      {path.estimatedWeeks} Weeks Sprint
                    </span>
                    <span className="text-xs font-semibold text-text-muted">
                      {path.modulesIncluded.length} Modules
                    </span>
                  </div>

                  <div>
                    <h3 className="font-heading text-base font-bold text-text-primary">
                      {path.title}
                    </h3>
                    <p className="text-xs text-primary-light font-medium mt-0.5">
                      Target: {path.roleTarget}
                    </p>
                    <p className="text-xs text-text-secondary mt-2 leading-relaxed">
                      {path.description}
                    </p>
                  </div>

                  <div className="space-y-2 pt-2">
                    <h5 className="text-[11px] font-bold uppercase tracking-wider text-text-muted">
                      Key Sprint Milestones:
                    </h5>
                    <ul className="space-y-1.5 text-xs text-text-secondary">
                      {path.milestones.map((m, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0 mt-0.5" />
                          <span className="leading-tight">{m}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-white/10">
                  <button
                    onClick={() => {
                      const firstModule = path.modulesIncluded[0];
                      setSelectedFrameworkId(firstModule.frameworkId);
                      setCurrentTab('framework-details');
                    }}
                    className="w-full flex items-center justify-center gap-2 rounded-xl bg-primary py-2.5 text-xs font-bold text-white hover:bg-primary-dark transition-all shadow-md shadow-primary/20 border border-white/15"
                  >
                    <span>Start Learning Track</span>
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* View 3: Suggested YouTube Video Guides Catalog */}
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
                { id: 'All', label: 'All Frameworks' },
                { id: 'soc2', label: 'SOC 2' },
                { id: 'iso27001', label: 'ISO 27001' },
                { id: 'nist', label: 'NIST CSF' },
                { id: 'hipaa', label: 'HIPAA' },
                { id: 'pci', label: 'PCI-DSS' },
                { id: 'gdpr', label: 'GDPR' },
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
                          <strong className="text-primary-light">Auditor Tip: </strong>
                          {vid.auditorTakeaway}
                        </p>
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
                        <span>Watch Video</span>
                        <ExternalLink className="h-3 w-3" />
                      </a>

                      <button
                        onClick={() => {
                          setSelectedFrameworkId(vid.frameworkId);
                          setCurrentTab('framework-details');
                        }}
                        className="px-3 py-2.5 rounded-xl border border-white/10 bg-white/5 text-xs font-medium text-text-secondary hover:text-text-primary hover:bg-white/10 transition-all backdrop-blur-sm"
                        title="View Framework"
                      >
                        <span>Details</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-12 text-center backdrop-blur-xl">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/5 border border-white/10 text-text-muted mx-auto mb-3">
                <Youtube className="h-6 w-6 text-rose-400" />
              </div>
              <h3 className="text-base font-bold text-text-primary">No Matching Video Guides Found</h3>
              <p className="text-xs text-text-muted mt-1 max-w-sm mx-auto">
                No video masterclasses matched your search criteria. Try switching the framework filter or clearing the search bar.
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setVideoFrameworkFilter('All');
                }}
                className="mt-4 rounded-xl bg-white/10 px-4 py-2 text-xs font-bold text-text-primary hover:bg-white/20 transition-all border border-white/15"
              >
                Reset Video Filters
              </button>
            </div>
          )}

        </div>
      )}

    </div>
  );
};
