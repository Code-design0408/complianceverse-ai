import React, { useState, useMemo } from 'react';
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
  HelpCircle,
  Search,
  SlidersHorizontal,
  Flame,
  Target,
  Layers,
  GraduationCap,
  Zap,
  BookOpen
} from 'lucide-react';
import { useAuthAndData } from '../context/AuthAndDataContext';
import { ExamType, ExamResult, AssessmentTrack, DifficultyLevel } from '../types';
import { ASSESSMENT_TRACKS } from '../data/assessmentQuestions';

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
    questions,
  } = useAuthAndData();

  const [selectedFrameworkFilter, setSelectedFrameworkFilter] = useState<string>('all');
  const [selectedDifficultyFilter, setSelectedDifficultyFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'tracks' | 'formats' | 'history'>('tracks');

  // Filtered tracks
  const filteredTracks = useMemo(() => {
    return ASSESSMENT_TRACKS.filter((track) => {
      // Framework filter
      if (selectedFrameworkFilter !== 'all') {
        if (track.frameworkId !== selectedFrameworkFilter) return false;
      }
      // Difficulty filter
      if (selectedDifficultyFilter !== 'all') {
        if (track.difficulty.toLowerCase() !== selectedDifficultyFilter.toLowerCase()) return false;
      }
      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = track.title.toLowerCase().includes(q);
        const matchDesc = track.description.toLowerCase().includes(q);
        const matchFw = track.frameworkTitle.toLowerCase().includes(q);
        const matchAudience = track.targetAudience.toLowerCase().includes(q);
        if (!matchTitle && !matchDesc && !matchFw && !matchAudience) return false;
      }
      return true;
    });
  }, [selectedFrameworkFilter, selectedDifficultyFilter, searchQuery]);

  // Telemetry stats
  const totalExams = examHistory.length;
  const passedExams = examHistory.filter(e => e.passed).length;
  const passRate = totalExams > 0 ? Math.round((passedExams / totalExams) * 100) : 0;
  const avgScore = totalExams > 0
    ? Math.round(examHistory.reduce((acc, curr) => acc + curr.scorePercentage, 0) / totalExams)
    : 0;
  const totalXpEarned = examHistory.reduce((acc, curr) => acc + curr.xpEarned, 0);

  const handleLaunchTrack = (track: AssessmentTrack) => {
    // Select questions specific to this track's framework or topic
    let trackPool = questions.filter(q => q.frameworkId === track.frameworkId);
    if (trackPool.length === 0) {
      trackPool = questions;
    }

    startExam({
      examType: track.examType || 'standard',
      frameworkId: track.frameworkId,
      questionCount: track.questionCount,
      durationMinutes: track.durationMinutes,
      title: track.title,
      specificQuestions: trackPool,
    });
    setCurrentTab('active-exam');
  };

  const handleLaunchCustomFormat = (
    type: ExamType,
    opts?: { isUntimed?: boolean; scenarioOnly?: boolean; count?: number; duration?: number; title?: string }
  ) => {
    const fwId = selectedFrameworkFilter === 'all' ? undefined : selectedFrameworkFilter;
    let pool = [...questions];
    if (fwId) {
      pool = pool.filter(q => q.frameworkId === fwId);
      if (pool.length === 0) pool = [...questions];
    }
    if (opts?.scenarioOnly) {
      const scenarioPool = pool.filter(q => q.questionType === 'scenario' || !!q.scenarioText);
      if (scenarioPool.length > 0) pool = scenarioPool;
    }

    startExam({
      examType: type,
      frameworkId: fwId,
      questionCount: opts?.count,
      durationMinutes: opts?.duration,
      title: opts?.title,
      isUntimed: opts?.isUntimed,
      specificQuestions: pool,
    });
    setCurrentTab('active-exam');
  };

  const handleReviewPastExam = (res: ExamResult) => {
    setLastExamResult(res);
    setExamResultForReview(res);
    setCurrentTab('exam-results');
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in duration-300">
      
      {/* Header & Mission Statement */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-border/40 pb-6">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/20 text-primary-light border border-primary/30">
              <CheckSquare className="h-5 w-5" />
            </div>
            <h1 className="font-heading text-2xl sm:text-3xl font-extrabold text-text-primary">
              Assessment & Certification Simulator
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-text-muted mt-1 max-w-3xl">
            Test your knowledge against rigorous, randomized assessments with deterministic grading, scenario-based audit dilemmas, and AI tutor explanations.
          </p>
        </div>

        {/* View Switcher Tabs */}
        <div className="flex items-center gap-1 bg-white/[0.04] p-1 rounded-2xl border border-white/10">
          <button
            onClick={() => setActiveTab('tracks')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'tracks'
                ? 'bg-primary text-white shadow-md'
                : 'text-text-muted hover:text-text-primary'
            }`}
          >
            Curated Tracks ({ASSESSMENT_TRACKS.length})
          </button>
          <button
            onClick={() => setActiveTab('formats')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'formats'
                ? 'bg-primary text-white shadow-md'
                : 'text-text-muted hover:text-text-primary'
            }`}
          >
            Quick Exam Formats
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'history'
                ? 'bg-primary text-white shadow-md'
                : 'text-text-muted hover:text-text-primary'
            }`}
          >
            Exam History ({totalExams})
          </button>
        </div>
      </div>

      {/* Performance Telemetry Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 backdrop-blur-md">
          <div className="flex items-center justify-between text-xs text-text-muted">
            <span className="font-semibold">Exams Completed</span>
            <Target className="h-4 w-4 text-primary-light" />
          </div>
          <div className="font-heading text-2xl font-black text-text-primary mt-1">
            {totalExams}
          </div>
          <span className="text-[10px] text-text-muted">Formal attempts logged</span>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 backdrop-blur-md">
          <div className="flex items-center justify-between text-xs text-text-muted">
            <span className="font-semibold">Pass Rate</span>
            <Award className="h-4 w-4 text-emerald-400" />
          </div>
          <div className="font-heading text-2xl font-black text-emerald-400 mt-1">
            {passRate}%
          </div>
          <span className="text-[10px] text-text-muted">Threshold: ≥75% passing</span>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 backdrop-blur-md">
          <div className="flex items-center justify-between text-xs text-text-muted">
            <span className="font-semibold">Average Score</span>
            <GraduationCap className="h-4 w-4 text-amber-400" />
          </div>
          <div className="font-heading text-2xl font-black text-amber-300 mt-1">
            {avgScore}%
          </div>
          <span className="text-[10px] text-text-muted">Across all domains</span>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 backdrop-blur-md">
          <div className="flex items-center justify-between text-xs text-text-muted">
            <span className="font-semibold">Assessment XP</span>
            <Zap className="h-4 w-4 text-primary-light" />
          </div>
          <div className="font-heading text-2xl font-black text-primary-light mt-1">
            +{totalXpEarned} XP
          </div>
          <span className="text-[10px] text-text-muted">Contributed to level progression</span>
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
                  Active Session {activeExamSession.isPaused ? '• Paused' : ''}
                </span>
                <h4 className="text-sm font-bold text-text-primary">
                  {activeExamSession.title}
                </h4>
              </div>
              <p className="text-xs text-text-secondary mt-0.5">
                {Object.keys(activeExamSession.selectedAnswers).length} of {activeExamSession.questions.length} Questions Answered • Autosaved
                {activeExamSession.isUntimed ? ' • Untimed Practice' : ''}
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

      {/* VIEW 1: CURATED ASSESSMENT TRACKS */}
      {activeTab === 'tracks' && (
        <div className="space-y-6">
          {/* Filters Bar */}
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 bg-white/[0.02] border border-white/10 p-4 rounded-2xl backdrop-blur-md">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search assessments by topic, standard, or role..."
                className="w-full rounded-xl border border-white/10 bg-white/5 pl-10 pr-4 py-2 text-xs text-text-primary placeholder:text-text-muted focus:border-primary focus:outline-none"
              />
            </div>

            {/* Framework Filter */}
            <div className="flex items-center gap-2">
              <label className="text-xs font-semibold text-text-muted shrink-0">Framework:</label>
              <select
                value={selectedFrameworkFilter}
                onChange={(e) => setSelectedFrameworkFilter(e.target.value)}
                className="rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-xs font-medium text-text-primary focus:border-primary focus:outline-none"
              >
                <option value="all">All Frameworks & Topics</option>
                <option value="cybersecurity_fundamentals">Cybersecurity Core</option>
                <option value="compliance_fundamentals">GRC Fundamentals</option>
                <option value="risk_management">Risk Management</option>
                {frameworks.map((f) => (
                  <option key={f.id} value={f.id}>
                    {f.shortName}
                  </option>
                ))}
              </select>
            </div>

            {/* Difficulty Filter */}
            <div className="flex items-center gap-2">
              <label className="text-xs font-semibold text-text-muted shrink-0">Difficulty:</label>
              <select
                value={selectedDifficultyFilter}
                onChange={(e) => setSelectedDifficultyFilter(e.target.value)}
                className="rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-xs font-medium text-text-primary focus:border-primary focus:outline-none"
              >
                <option value="all">All Difficulties</option>
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
                <option value="expert">Expert</option>
              </select>
            </div>
          </div>

          {/* Tracks Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTracks.map((track) => {
              const diffColors: Record<DifficultyLevel, string> = {
                Beginner: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
                Intermediate: 'bg-primary/10 text-primary-light border-primary/30',
                Advanced: 'bg-amber-500/10 text-amber-300 border-amber-500/30',
                Expert: 'bg-rose-500/10 text-rose-400 border-rose-500/30',
              };

              return (
                <div
                  key={track.id}
                  className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 flex flex-col justify-between hover:border-primary-light/40 backdrop-blur-xl shadow-lg hover:shadow-2xl transition-all group relative overflow-hidden"
                >
                  {track.isPopular && (
                    <div className="absolute top-0 right-0 bg-primary px-3 py-0.5 text-[9px] font-bold text-white rounded-bl-xl uppercase tracking-wider border-b border-l border-white/15 flex items-center gap-1">
                      <Flame className="h-2.5 w-2.5 fill-current" />
                      <span>Popular Track</span>
                    </div>
                  )}

                  <div className="space-y-4">
                    {/* Tags row */}
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={`rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${diffColors[track.difficulty] || 'text-text-muted border-white/10'}`}>
                        {track.difficulty}
                      </span>
                      <span className="rounded-full bg-white/5 border border-white/10 px-2.5 py-0.5 text-[10px] font-semibold text-text-secondary">
                        {track.frameworkTitle}
                      </span>
                    </div>

                    {/* Title & Description */}
                    <div>
                      <h3 className="font-heading text-base font-bold text-text-primary group-hover:text-primary-light transition-colors leading-snug">
                        {track.title}
                      </h3>
                      <p className="text-xs text-text-secondary mt-2 leading-relaxed line-clamp-3">
                        {track.description}
                      </p>
                    </div>

                    {/* Target Audience */}
                    <div className="text-[11px] text-text-muted">
                      <strong className="text-text-secondary">Audience:</strong> {track.targetAudience}
                    </div>

                    {/* Meta stats list */}
                    <div className="space-y-1.5 pt-3 text-xs text-text-muted border-t border-white/10">
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-1.5">
                          <CheckSquare className="h-3.5 w-3.5 text-primary-light" />
                          Questions:
                        </span>
                        <span className="font-bold text-text-primary">
                          {track.questionCount} Questions (MCQ, T/F, Scenarios)
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-1.5">
                          <Clock className="h-3.5 w-3.5 text-text-muted" />
                          Duration:
                        </span>
                        <span className="font-bold text-text-primary">{track.durationMinutes} Minutes</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-1.5">
                          <Target className="h-3.5 w-3.5 text-emerald-400" />
                          Passing Threshold:
                        </span>
                        <span className="font-bold text-text-primary">{track.passingScorePercent}%</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-1.5">
                          <Zap className="h-3.5 w-3.5 text-primary-light" />
                          Reward:
                        </span>
                        <span className="font-mono font-bold text-primary-light">+{track.xpReward} XP</span>
                      </div>
                    </div>
                  </div>

                  {/* Launch action */}
                  <div className="mt-6 pt-3">
                    <button
                      onClick={() => handleLaunchTrack(track)}
                      className="w-full flex items-center justify-center gap-2 rounded-xl bg-primary py-2.5 text-xs font-bold text-white hover:bg-primary-dark transition-all shadow-md shadow-primary/20 border border-white/15"
                    >
                      <Play className="h-3.5 w-3.5 fill-current" />
                      <span>Launch Assessment Track</span>
                    </button>
                  </div>
                </div>
              );
            })}

            {filteredTracks.length === 0 && (
              <div className="col-span-full rounded-3xl border border-white/10 bg-white/[0.02] p-12 text-center text-text-muted">
                <Search className="h-8 w-8 text-primary-light mx-auto mb-2 opacity-60" />
                <h4 className="text-sm font-bold text-text-primary">No Matching Assessment Tracks</h4>
                <p className="text-xs text-text-muted mt-1 max-w-sm mx-auto">
                  Try adjusting your framework, difficulty, or search term filters above.
                </p>
                <button
                  onClick={() => {
                    setSelectedFrameworkFilter('all');
                    setSelectedDifficultyFilter('all');
                    setSearchQuery('');
                  }}
                  className="mt-4 rounded-xl bg-white/10 px-4 py-2 text-xs font-semibold text-text-primary hover:bg-white/20 transition-all"
                >
                  Reset Filters
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* VIEW 2: STANDARD EXAM FORMATS & CUSTOM DRILLS */}
      {activeTab === 'formats' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Format 1: Quick Sprint */}
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
                    10-Question Rapid Drill
                  </h3>
                  <p className="text-xs text-text-secondary mt-1.5 leading-relaxed">
                    Designed for swift daily practice, testing recall on key control statements, definitions, and audit responsibilities.
                  </p>
                </div>

                <div className="space-y-2 pt-2 text-xs text-text-muted border-t border-white/10">
                  <div className="flex items-center justify-between">
                    <span>Passing Score:</span>
                    <span className="font-bold text-text-primary">75% (8/10)</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Reward on Pass:</span>
                    <span className="font-mono font-bold text-primary-light">+150 XP</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Question Formats:</span>
                    <span className="text-text-primary">MCQ & True/False</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4">
                <button
                  onClick={() => handleLaunchCustomFormat('quick', { count: 10, duration: 15, title: 'Quick Sprint Knowledge Check' })}
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-primary py-3 text-xs font-bold text-white hover:bg-primary-dark transition-all shadow-md shadow-primary/20 border border-white/15"
                >
                  <Play className="h-4 w-4 fill-current" />
                  <span>Start 10-Q Sprint</span>
                </button>
              </div>
            </div>

            {/* Format 2: Standard Assessment */}
            <div className="rounded-3xl border border-[#A5002D]/40 bg-gradient-to-b from-[#7A0019]/30 via-white/[0.04] to-black/60 p-6 flex flex-col justify-between hover:border-primary-light hover:shadow-2xl hover:shadow-[#7A0019]/20 backdrop-blur-2xl transition-all group relative overflow-hidden shadow-xl">
              <div className="absolute top-0 right-0 bg-primary px-3 py-0.5 text-[10px] font-bold text-white rounded-bl-xl uppercase tracking-wider border-b border-l border-white/15">
                Standard Benchmark
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="rounded-full bg-primary/20 border border-primary/40 px-3 py-0.5 text-xs font-bold text-primary-light uppercase">
                    Standard Exam
                  </span>
                  <span className="text-xs font-mono font-semibold text-text-muted">30 Mins</span>
                </div>

                <div>
                  <h3 className="font-heading text-lg font-bold text-text-primary">
                    20-Question Comprehensive Exam
                  </h3>
                  <p className="text-xs text-text-secondary mt-1.5 leading-relaxed">
                    Balanced evaluation covering technical controls, administrative safeguards, IAM, encryption, and incident response SLAs.
                  </p>
                </div>

                <div className="space-y-2 pt-2 text-xs text-text-muted border-t border-white/10">
                  <div className="flex items-center justify-between">
                    <span>Passing Score:</span>
                    <span className="font-bold text-text-primary">75% (15/20)</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Reward on Pass:</span>
                    <span className="font-mono font-bold text-primary-light">+300 XP</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Question Formats:</span>
                    <span className="text-text-primary">MCQ, T/F & Scenarios</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4">
                <button
                  onClick={() => handleLaunchCustomFormat('standard', { count: 20, duration: 30, title: 'Standard 20-Question Certification Exam' })}
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-primary py-3 text-xs font-bold text-white hover:bg-primary-dark transition-all shadow-lg shadow-primary/30 border border-white/15"
                >
                  <Play className="h-4 w-4 fill-current" />
                  <span>Start Standard Exam</span>
                </button>
              </div>
            </div>

            {/* Format 3: Professional Simulation */}
            <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 flex flex-col justify-between hover:border-accent-light/40 backdrop-blur-xl shadow-lg hover:shadow-2xl transition-all group">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="rounded-full bg-accent/20 border border-accent/30 px-3 py-0.5 text-xs font-bold text-accent-light uppercase">
                    Lead Auditor
                  </span>
                  <span className="text-xs font-mono font-semibold text-text-muted">60 Mins</span>
                </div>

                <div>
                  <h3 className="font-heading text-lg font-bold text-text-primary">
                    50-Question Pro Simulation
                  </h3>
                  <p className="text-xs text-text-secondary mt-1.5 leading-relaxed">
                    Exhaustive multi-framework audit simulation with high-complexity scenarios, audit dilemmas, and edge-case exceptions.
                  </p>
                </div>

                <div className="space-y-2 pt-2 text-xs text-text-muted border-t border-white/10">
                  <div className="flex items-center justify-between">
                    <span>Passing Score:</span>
                    <span className="font-bold text-text-primary">75% (38/50)</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Reward on Pass:</span>
                    <span className="font-mono font-bold text-primary-light">+500 XP & Badge</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Question Formats:</span>
                    <span className="text-text-primary">Cross-Framework Pool</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4">
                <button
                  onClick={() => handleLaunchCustomFormat('professional', { count: 50, duration: 60, title: '50-Question Lead Auditor Simulation' })}
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-primary py-3 text-xs font-bold text-white hover:bg-primary-dark transition-all shadow-md shadow-primary/20 border border-white/15"
                >
                  <Play className="h-4 w-4 fill-current" />
                  <span>Start Pro Simulation</span>
                </button>
              </div>
            </div>

          </div>

          {/* Secondary Specialized Drills: Scenario Lab & Untimed Practice */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            {/* Drill 1: Scenario-Only Lab */}
            <div className="rounded-3xl border border-amber-500/30 bg-gradient-to-br from-amber-500/10 via-white/[0.02] to-black/60 p-6 flex flex-col justify-between backdrop-blur-xl">
              <div>
                <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider">
                  <BookOpen className="h-4 w-4" />
                  <span>Real-World Case Studies</span>
                </div>
                <h4 className="font-heading text-base font-bold text-text-primary mt-2">
                  100% Scenario-Based Audit Dilemma Lab
                </h4>
                <p className="text-xs text-text-secondary mt-1.5 leading-relaxed">
                  Focus exclusively on enterprise scenarios: rogue developers, unencrypted snapshot leaks, expired TLS certs, and third-party vendor breaches.
                </p>
              </div>

              <div className="mt-4 pt-3 flex items-center justify-between border-t border-white/10">
                <span className="text-xs font-mono text-text-muted">10 Scenarios • 30 Mins • +400 XP</span>
                <button
                  onClick={() => handleLaunchCustomFormat('scenario', { scenarioOnly: true, count: 10, duration: 30, title: 'Scenario Audit Dilemma Lab' })}
                  className="rounded-xl bg-amber-500 px-4 py-2 text-xs font-bold text-black hover:bg-amber-400 transition-all shadow-md shadow-amber-500/20"
                >
                  Launch Scenario Lab &rarr;
                </button>
              </div>
            </div>

            {/* Drill 2: Untimed Self-Paced Practice */}
            <div className="rounded-3xl border border-emerald-500/30 bg-gradient-to-br from-emerald-500/10 via-white/[0.02] to-black/60 p-6 flex flex-col justify-between backdrop-blur-xl">
              <div>
                <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider">
                  <CheckCircle2 className="h-4 w-4" />
                  <span>Stress-Free Study Mode</span>
                </div>
                <h4 className="font-heading text-base font-bold text-text-primary mt-2">
                  Untimed Practice Drill
                </h4>
                <p className="text-xs text-text-secondary mt-1.5 leading-relaxed">
                  No countdown pressure or ticking timers. Review question scenarios at your own pace with full navigation and deterministic review at completion.
                </p>
              </div>

              <div className="mt-4 pt-3 flex items-center justify-between border-t border-white/10">
                <span className="text-xs font-mono text-text-muted">15 Questions • Untimed • +200 XP</span>
                <button
                  onClick={() => handleLaunchCustomFormat('standard', { isUntimed: true, count: 15, title: 'Untimed Practice & Study Drill' })}
                  className="rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white hover:bg-emerald-700 transition-all shadow-md shadow-emerald-900/30"
                >
                  Launch Untimed Drill &rarr;
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 3: HISTORICAL ATTEMPTS TABLE */}
      {activeTab === 'history' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-heading text-lg font-bold text-text-primary">
                Your Assessment History
              </h3>
              <p className="text-xs text-text-muted">
                Detailed audit trail of past exams, accuracy breakdowns, and AI mistake analyses.
              </p>
            </div>
            <span className="text-xs font-semibold text-text-muted">
              {examHistory.length} Submissions
            </span>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/[0.03] backdrop-blur-xl shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-white/[0.05] border-b border-white/10 text-text-muted uppercase font-semibold">
                  <tr>
                    <th className="px-4 py-3">Assessment Title</th>
                    <th className="px-4 py-3">Format / Type</th>
                    <th className="px-4 py-3">Score & Accuracy</th>
                    <th className="px-4 py-3">Result</th>
                    <th className="px-4 py-3">XP Earned</th>
                    <th className="px-4 py-3">Time Spent</th>
                    <th className="px-4 py-3">Date Completed</th>
                    <th className="px-4 py-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {examHistory.map((item) => (
                    <tr key={item.id} className="hover:bg-white/[0.05] transition-colors">
                      <td className="px-4 py-3 font-semibold text-text-primary">
                        <div>{item.frameworkTitle || 'Compliance Assessment'}</div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="rounded-full bg-white/5 border border-white/10 px-2 py-0.5 text-[10px] font-mono text-text-muted uppercase">
                          {item.examType}
                        </span>
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
                          Review Performance &rarr;
                        </button>
                      </td>
                    </tr>
                  ))}
                  {examHistory.length === 0 && (
                    <tr>
                      <td colSpan={8} className="px-6 py-12 text-center text-text-muted">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/5 border border-white/10 text-text-muted mx-auto mb-3">
                          <CheckSquare className="h-6 w-6 text-primary-light" />
                        </div>
                        <p className="text-sm font-bold text-text-primary">No Exam Attempts Logged Yet</p>
                        <p className="text-xs text-text-muted mt-1 max-w-sm mx-auto">
                          Launch your first curated track or standard assessment above to start building your verified compliance record.
                        </p>
                        <button
                          onClick={() => setActiveTab('tracks')}
                          className="mt-4 rounded-xl bg-primary px-4 py-2 text-xs font-bold text-white hover:bg-primary-dark transition-all shadow-md shadow-primary/20 border border-white/15"
                        >
                          Browse Curated Tracks
                        </button>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Standards & Security Governance Note */}
      <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 backdrop-blur-md">
        <div className="flex items-start gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/20 text-primary-light border border-primary/30">
            <FileCheck className="h-5 w-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-text-primary">
              Deterministic Exam Scoring & State Persistence
            </h4>
            <p className="text-xs text-text-secondary mt-0.5 max-w-2xl leading-relaxed">
              Assessment scoring is calculated deterministically via <code className="font-mono text-primary-light font-bold">Math.round((Correct / Total) * 100)</code> with cloud synchronization to Supabase <code className="font-mono text-primary-light">exam_results</code>. Your active progress is continuously auto-saved.
            </p>
          </div>
        </div>
      </div>

    </div>
  );
};

