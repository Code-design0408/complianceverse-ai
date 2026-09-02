import React, { useState } from 'react';
import {
  ShieldCheck,
  Sparkles,
  BookOpen,
  CheckSquare,
  SlidersHorizontal,
  Layers,
  ArrowRight,
  Award,
  Zap,
  CheckCircle2,
  Lock,
  Cpu,
  Globe2,
  HelpCircle,
  FileText,
  Target,
  Users,
  Compass,
  ChevronRight,
  Activity,
  Play,
  RotateCcw
} from 'lucide-react';
import { useAuthAndData } from '../context/AuthAndDataContext';
import { UserRole } from '../types';

interface WelcomePageProps {
  setCurrentTab: (tab: string) => void;
  setSelectedFrameworkId?: (id: string) => void;
}

export const WelcomePage: React.FC<WelcomePageProps> = ({
  setCurrentTab,
  setSelectedFrameworkId
}) => {
  const { user, isAuthenticated, completedLessonIds, frameworks, openAiModal } = useAuthAndData();

  // Role path recommendation state
  const [selectedRolePath, setSelectedRolePath] = useState<'auditor' | 'devsecops' | 'privacy' | 'beginner'>('auditor');
  
  // Interactive mini diagnostic state
  const [quizQuestionIndex, setQuizQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizScore, setQuizScore] = useState(0);

  const roleRoadmaps = {
    auditor: {
      title: 'Information Security & GRC Auditor',
      tagline: 'Lead SOC 2 Type II, ISO 27001:2022, and PCI-DSS external audit engagements.',
      badge: 'Audit Lead Track',
      color: 'from-amber-500/20 to-orange-500/10 border-amber-500/30 text-amber-400',
      icon: ShieldCheck,
      recommendedFrameworks: ['soc2', 'iso27001', 'pci-dss'],
      focusAreas: [
        'Evidence collection & sampling methodologies',
        'Trust Services Criteria (TSC) CC6.1 - CC8.1 testing',
        'Management assertions & auditor opinion reporting'
      ],
      suggestedNextTab: 'gap-analysis'
    },
    devsecops: {
      title: 'Cloud Security & DevSecOps Engineer',
      tagline: 'Implement technical controls, zero trust IAM, and automated CI/CD compliance gates.',
      badge: 'Engineering Track',
      color: 'from-cyan-500/20 to-blue-500/10 border-cyan-500/30 text-cyan-400',
      icon: Cpu,
      recommendedFrameworks: ['nist-csf', 'soc2', 'pci-dss'],
      focusAreas: [
        'NIST CSF 2.0 PR.AC & PR.DS technical implementation',
        'TLS 1.3 encryption & immutable audit logging',
        'Automated vulnerability scanning & container security'
      ],
      suggestedNextTab: 'library'
    },
    privacy: {
      title: 'Data Privacy & Legal Compliance Officer',
      tagline: 'Master EU GDPR, HIPAA Security & Privacy Rules, and cross-border data protection.',
      badge: 'Privacy & Governance Track',
      color: 'from-emerald-500/20 to-teal-500/10 border-emerald-500/30 text-emerald-400',
      icon: Lock,
      recommendedFrameworks: ['gdpr', 'hipaa', 'iso27001'],
      focusAreas: [
        'Data Protection Impact Assessments (DPIA) & ROPA',
        '72-Hour breach notification protocols & patient rights',
        'Third-party Business Associate Agreements (BAA)'
      ],
      suggestedNextTab: 'matrix'
    },
    beginner: {
      title: 'Cybersecurity & GRC Career Starter',
      tagline: 'Start from fundamental security concepts and build your certified portfolio.',
      badge: 'Zero to Hero',
      color: 'from-purple-500/20 to-pink-500/10 border-purple-500/30 text-purple-400',
      icon: Compass,
      recommendedFrameworks: ['soc2', 'nist-csf', 'iso27001'],
      focusAreas: [
        'Core CIA Triad (Confidentiality, Integrity, Availability)',
        'Understanding compliance vs security posture',
        'Earning your first verified auditor badge'
      ],
      suggestedNextTab: 'dashboard'
    }
  };

  const diagnosticQuestions = [
    {
      framework: 'SOC 2 & ISO 27001',
      question: 'Which of the following describes the difference between SOC 2 Type I and Type II reports?',
      options: [
        'Type I evaluates security controls at a single point in time, while Type II tests operational effectiveness over 3–12 months.',
        'Type I is for healthcare only, while Type II is for financial institutions.',
        'Type I is self-assessed, whereas Type II requires government accreditation.',
        'Type I is purely cloud-based, while Type II applies only to on-premises data centers.'
      ],
      correctAnswer: 0,
      explanation: 'SOC 2 Type I evaluates the design of controls at a specific date, whereas Type II proves operational effectiveness over a continuous audit window (typically 6 or 12 months).'
    },
    {
      framework: 'EU GDPR',
      question: 'Under GDPR Article 33, within what timeframe must a supervisory authority be notified of a high-risk personal data breach?',
      options: [
        'Within 24 hours of discovery',
        'Without undue delay, and where feasible, within 72 hours of becoming aware',
        'Within 30 business days after internal forensic completion',
        'Only during the annual regulatory filing cycle'
      ],
      correctAnswer: 1,
      explanation: 'GDPR Article 33 mandates reporting personal data breaches to the relevant supervisory authority without undue delay and not later than 72 hours after becoming aware.'
    },
    {
      framework: 'PCI-DSS v4.0',
      question: 'What is the primary objective of PCI-DSS Requirement 3 under version 4.0?',
      options: [
        'Assign a unique ID to each person with computer access',
        'Protect stored account data (SAD & primary account numbers) through strong cryptography',
        'Track and monitor all access to network resources and cardholder data',
        'Install and maintain firewall configurations to protect cardholder data'
      ],
      correctAnswer: 1,
      explanation: 'PCI-DSS Requirement 3 explicitly mandates protecting stored cardholder data (PAN, SAD) using AES-256 encryption, truncation, or hashing.'
    }
  ];

  const handleDiagnosticAnswer = (index: number) => {
    if (quizSubmitted) return;
    setSelectedAnswer(index);
  };

  const handleDiagnosticSubmit = () => {
    if (selectedAnswer === null) return;
    setQuizSubmitted(true);
    if (selectedAnswer === diagnosticQuestions[quizQuestionIndex].correctAnswer) {
      setQuizScore(prev => prev + 1);
    }
  };

  const handleNextDiagnosticQuestion = () => {
    if (quizQuestionIndex < diagnosticQuestions.length - 1) {
      setQuizQuestionIndex(prev => prev + 1);
      setSelectedAnswer(null);
      setQuizSubmitted(false);
    }
  };

  const handleResetDiagnostic = () => {
    setQuizQuestionIndex(0);
    setSelectedAnswer(null);
    setQuizSubmitted(false);
    setQuizScore(0);
  };

  const activePathData = roleRoadmaps[selectedRolePath];

  return (
    <div className="min-h-screen bg-background text-text-primary px-4 py-8 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-10">
      {/* 0. Onboarding Journey Steps Banner */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 sm:p-4 rounded-2xl bg-surface border border-white/10 shadow-lg">
        <div className="flex items-center gap-2.5 sm:gap-3">
          <div className="flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs font-bold text-white shadow-sm ring-2 ring-primary-light/40">
              1
            </span>
            <span className="text-xs font-bold text-text-primary">Step 1: Welcome & Roadmap</span>
          </div>
          <ArrowRight className="h-3.5 w-3.5 text-text-muted" />
          <div className="flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white/10 text-xs font-bold text-text-secondary">
              2
            </span>
            <span className="text-xs font-medium text-text-secondary">Step 2: Sign Up or Log In</span>
          </div>
          <ArrowRight className="h-3.5 w-3.5 text-text-muted hidden md:inline" />
          <div className="hidden md:flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white/10 text-xs font-bold text-text-muted">
              3
            </span>
            <span className="text-xs font-medium text-text-muted">Step 3: Certification Hub</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {!isAuthenticated ? (
            <>
              <button
                id="welcome-top-signup-btn"
                onClick={() => setCurrentTab('signup')}
                className="inline-flex items-center gap-1.5 rounded-xl bg-primary hover:bg-primary-light px-3.5 py-1.5 text-xs font-bold text-white shadow-md shadow-primary/20 transition-all"
              >
                <Sparkles className="h-3.5 w-3.5" />
                <span>Sign Up / Create Account</span>
                <ArrowRight className="h-3 w-3" />
              </button>
              <button
                id="welcome-top-login-btn"
                onClick={() => setCurrentTab('login')}
                className="inline-flex items-center gap-1.5 rounded-xl border border-white/15 bg-white/5 hover:bg-white/10 px-3 py-1.5 text-xs font-semibold text-text-secondary hover:text-white transition-all"
              >
                <Lock className="h-3 w-3 text-primary-light" />
                <span>Log In</span>
              </button>
            </>
          ) : (
            <button
              id="welcome-top-dashboard-btn"
              onClick={() => setCurrentTab('dashboard')}
              className="inline-flex items-center gap-1.5 rounded-xl bg-primary hover:bg-primary-light px-3.5 py-1.5 text-xs font-bold text-white shadow-md transition-all"
            >
              <span>Go to My Dashboard</span>
              <ArrowRight className="h-3 w-3" />
            </button>
          )}
        </div>
      </div>

      {/* 1. Hero Welcome Header */}
      <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-surface via-[#101018] to-surface-dark p-6 sm:p-10 shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-64 h-64 bg-accent-cyan/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-5">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3.5 py-1 text-xs font-semibold text-primary-light">
            <Sparkles className="h-3.5 w-3.5 animate-pulse" />
            <span>Interactive GRC & Cybersecurity Academy</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight font-heading leading-tight">
            Welcome to <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-light via-accent-cyan to-white">ComplianceVerse AI</span>
          </h1>

          <p className="text-base sm:text-lg text-text-secondary leading-relaxed">
            Your end-to-end command center for mastering information security compliance frameworks, simulated auditor exams, dynamic gap remediations, and real-time AI compliance guidance.
          </p>

          <div className="flex flex-wrap items-center gap-3.5 pt-2">
            {!isAuthenticated ? (
              <>
                <button
                  id="welcome-hero-signup-btn"
                  onClick={() => setCurrentTab('signup')}
                  className="inline-flex items-center gap-2 rounded-xl bg-primary hover:bg-primary-light px-5 py-3 text-sm font-bold text-white shadow-lg shadow-primary/30 hover:scale-[1.02] transition-all"
                >
                  <Sparkles className="h-4 w-4" />
                  <span>Get Started — Sign Up</span>
                  <ArrowRight className="h-4 w-4" />
                </button>

                <button
                  id="welcome-hero-login-btn"
                  onClick={() => setCurrentTab('login')}
                  className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/5 hover:bg-white/10 px-5 py-3 text-sm font-semibold text-text-primary transition-all"
                >
                  <Lock className="h-4 w-4 text-primary-light" />
                  <span>Log In to Existing Profile</span>
                </button>
              </>
            ) : (
              <button
                id="welcome-start-learning-btn"
                onClick={() => setCurrentTab('library')}
                className="inline-flex items-center gap-2 rounded-xl bg-primary hover:bg-primary-light px-5 py-3 text-sm font-bold text-white shadow-lg shadow-primary/30 hover:scale-[1.02] transition-all"
              >
                <BookOpen className="h-4 w-4" />
                <span>Explore 6 Frameworks</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            )}

            <button
              id="welcome-mock-exams-btn"
              onClick={() => setCurrentTab('exams')}
              className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 hover:bg-white/10 px-5 py-3 text-sm font-semibold text-text-primary transition-all"
            >
              <CheckSquare className="h-4 w-4 text-accent-cyan" />
              <span>Practice Exam Simulations</span>
            </button>

            <button
              id="welcome-open-ai-btn"
              onClick={() => openAiModal()}
              className="inline-flex items-center gap-2 rounded-xl border border-primary/40 bg-primary/10 hover:bg-primary/20 px-4 py-3 text-sm font-semibold text-primary-light transition-all"
            >
              <Sparkles className="h-4 w-4" />
              <span>Ask ComplyAI Auditor</span>
            </button>
          </div>

          {/* Quick Stats Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-white/10">
            <div className="bg-black/30 border border-white/5 rounded-xl p-3">
              <span className="block text-2xl font-black text-text-primary">6</span>
              <span className="text-xs text-text-muted">Global Frameworks</span>
            </div>
            <div className="bg-black/30 border border-white/5 rounded-xl p-3">
              <span className="block text-2xl font-black text-primary-light">36+</span>
              <span className="text-xs text-text-muted">Interactive Lessons</span>
            </div>
            <div className="bg-black/30 border border-white/5 rounded-xl p-3">
              <span className="block text-2xl font-black text-accent-cyan">180+</span>
              <span className="text-xs text-text-muted">Audit Exam Questions</span>
            </div>
            <div className="bg-black/30 border border-white/5 rounded-xl p-3">
              <span className="block text-2xl font-black text-emerald-400">100%</span>
              <span className="text-xs text-text-muted">Cloud & Local Resilient</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Personalized Learning Track Selector */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-primary-light">
              <Target className="h-4 w-4" />
              <span>Personalized Onboarding</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-text-primary mt-1">
              Choose Your Compliance Career Track
            </h2>
          </div>
          <p className="text-xs text-text-muted max-w-sm">
            Select your professional role to see tailored framework priorities and study milestones.
          </p>
        </div>

        {/* Role Tab Buttons */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            { id: 'auditor', label: 'GRC Auditor', icon: ShieldCheck },
            { id: 'devsecops', label: 'DevSecOps & Cloud', icon: Cpu },
            { id: 'privacy', label: 'Privacy & Legal', icon: Lock },
            { id: 'beginner', label: 'Career Starter', icon: Compass },
          ].map((item) => {
            const Icon = item.icon;
            const isSelected = selectedRolePath === item.id;
            return (
              <button
                key={item.id}
                id={`welcome-role-track-${item.id}`}
                onClick={() => setSelectedRolePath(item.id as any)}
                className={`flex items-center gap-3 p-4 rounded-2xl border text-left transition-all ${
                  isSelected
                    ? 'border-primary bg-primary/15 shadow-lg shadow-primary/10 ring-1 ring-primary-light'
                    : 'border-white/10 bg-surface hover:bg-surface-hover hover:border-white/20'
                }`}
              >
                <div className={`p-2.5 rounded-xl border ${isSelected ? 'bg-primary text-white border-primary-light' : 'bg-black/40 text-text-secondary border-white/5'}`}>
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <span className="block text-sm font-bold text-text-primary">{item.label}</span>
                  <span className="text-[11px] text-text-muted">Recommended roadmap</span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Selected Role Detail Card */}
        <div className={`rounded-3xl border bg-gradient-to-r p-6 sm:p-8 transition-all ${activePathData.color}`}>
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-4 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/20 bg-black/40 text-xs font-bold text-white">
                <activePathData.icon className="h-3.5 w-3.5" />
                <span>{activePathData.badge}</span>
              </div>

              <h3 className="text-xl sm:text-2xl font-bold text-white">
                {activePathData.title}
              </h3>
              <p className="text-sm text-white/80 leading-relaxed">
                {activePathData.tagline}
              </p>

              <div className="space-y-2 pt-2">
                <span className="text-xs font-bold uppercase tracking-wider text-white/90">
                  Key Competencies & Practical Drills:
                </span>
                <ul className="space-y-1.5">
                  {activePathData.focusAreas.map((area, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-xs sm:text-sm text-white/80">
                      <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                      <span>{area}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Recommended Framework Cards & Action */}
            <div className="lg:w-80 shrink-0 bg-black/50 backdrop-blur-md rounded-2xl border border-white/15 p-5 space-y-4">
              <span className="text-xs font-bold text-text-secondary uppercase tracking-wider block">
                Primary Framework Targets:
              </span>
              <div className="space-y-2">
                {activePathData.recommendedFrameworks.map((fwId) => {
                  const fw = frameworks.find(f => f.id === fwId);
                  if (!fw) return null;
                  return (
                    <div
                      key={fwId}
                      onClick={() => {
                        if (setSelectedFrameworkId) setSelectedFrameworkId(fwId);
                        setCurrentTab('framework-details');
                      }}
                      className="flex items-center justify-between p-2.5 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 hover:border-primary/50 cursor-pointer transition-all group"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="px-2.5 py-1 rounded-lg bg-primary/20 border border-primary/30 flex items-center justify-center text-xs font-bold text-primary-light whitespace-nowrap shrink-0">
                          {fw.shortName || fw.code}
                        </div>
                        <div className="truncate">
                          <span className="block text-xs font-bold text-text-primary truncate">{fw.title}</span>
                          <span className="text-[10px] text-text-muted">{fw.lessons.length} Lessons</span>
                        </div>
                      </div>
                      <ChevronRight className="h-4 w-4 text-text-muted group-hover:text-primary-light group-hover:translate-x-0.5 transition-all shrink-0" />
                    </div>
                  );
                })}
              </div>

              <button
                id="welcome-launch-role-path-btn"
                onClick={() => setCurrentTab(activePathData.suggestedNextTab)}
                className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-white hover:bg-white/90 text-black px-4 py-2.5 text-xs font-bold shadow-md transition-all"
              >
                <span>Launch {activePathData.badge}</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Interactive Frameworks Showcase */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-accent-cyan">
              <Globe2 className="h-4 w-4" />
              <span>Core Curriculum</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-text-primary mt-1">
              6 Enterprise Standards Covered In-Depth
            </h2>
          </div>
          <button
            onClick={() => setCurrentTab('library')}
            className="hidden sm:inline-flex items-center gap-1.5 text-xs font-bold text-primary-light hover:underline"
          >
            <span>View Full Catalog</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {frameworks.map((fw) => {
            const completedCount = completedLessonIds.filter(l => l.startsWith(fw.id)).length;
            const progressPct = fw.lessons.length > 0 ? Math.round((completedCount / fw.lessons.length) * 100) : 0;

            return (
              <div
                key={fw.id}
                className="group relative rounded-2xl border border-white/10 bg-surface p-5 hover:border-primary/50 hover:bg-surface-hover transition-all flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <div className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-primary/25 to-primary-dark/35 border border-primary/40 flex items-center justify-center text-xs font-black tracking-wide text-primary-light whitespace-nowrap shadow-sm">
                      {fw.shortName || fw.code}
                    </div>
                    <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-text-muted whitespace-nowrap">
                      {fw.category}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-base font-bold text-text-primary group-hover:text-primary-light transition-colors">
                      {fw.title}
                    </h3>
                    <p className="text-xs text-text-secondary line-clamp-2 mt-1">
                      {fw.description}
                    </p>
                  </div>

                  {/* Progress bar */}
                  <div className="space-y-1.5 pt-1">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-text-muted">Mastery Readiness</span>
                      <span className="font-bold text-primary-light">{progressPct}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-black/40 rounded-full overflow-hidden border border-white/5">
                      <div
                        className="h-full bg-gradient-to-r from-primary to-accent-cyan transition-all duration-500"
                        style={{ width: `${progressPct}%` }}
                      />
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 mt-3 border-t border-white/5 text-xs">
                  <span className="text-text-muted font-medium">
                    {fw.lessons.length} Modules • {fw.modules?.length || 4} Sections
                  </span>
                  <button
                    id={`welcome-explore-${fw.id}-btn`}
                    onClick={() => {
                      if (setSelectedFrameworkId) setSelectedFrameworkId(fw.id);
                      setCurrentTab('framework-details');
                    }}
                    className="inline-flex items-center gap-1 font-bold text-primary-light hover:underline"
                  >
                    <span>Learn</span>
                    <ArrowRight className="h-3 w-3" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. Interactive Diagnostic Readiness Check */}
      <div className="rounded-3xl border border-white/10 bg-surface p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-amber-400">
              <Zap className="h-4 w-4" />
              <span>Interactive Knowledge Check</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-text-primary mt-1">
              Test Your GRC Knowledge (Diagnostic Mini-Lab)
            </h2>
          </div>

          <div className="flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-xl bg-black/40 border border-white/10 text-text-muted">
            <span>Question {quizQuestionIndex + 1} of {diagnosticQuestions.length}</span>
            <span className="text-primary-light font-bold">• Score: {quizScore}/{diagnosticQuestions.length}</span>
          </div>
        </div>

        {/* Current Question Body */}
        <div className="space-y-4 bg-black/30 rounded-2xl border border-white/5 p-5 sm:p-6">
          <div className="inline-block px-2.5 py-0.5 rounded-md bg-primary/20 border border-primary/30 text-[11px] font-bold text-primary-light">
            {diagnosticQuestions[quizQuestionIndex].framework}
          </div>

          <p className="text-base sm:text-lg font-semibold text-text-primary">
            {diagnosticQuestions[quizQuestionIndex].question}
          </p>

          <div className="space-y-2.5 pt-2">
            {diagnosticQuestions[quizQuestionIndex].options.map((option, idx) => {
              const isSelected = selectedAnswer === idx;
              const isCorrect = idx === diagnosticQuestions[quizQuestionIndex].correctAnswer;
              
              let optionStyle = 'border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20 text-text-secondary';
              if (isSelected && !quizSubmitted) {
                optionStyle = 'border-primary bg-primary/20 text-white ring-1 ring-primary-light';
              } else if (quizSubmitted) {
                if (isCorrect) {
                  optionStyle = 'border-emerald-500/60 bg-emerald-500/20 text-emerald-300 font-semibold';
                } else if (isSelected && !isCorrect) {
                  optionStyle = 'border-rose-500/60 bg-rose-500/20 text-rose-300';
                }
              }

              return (
                <button
                  key={idx}
                  id={`diagnostic-opt-${idx}`}
                  disabled={quizSubmitted}
                  onClick={() => handleDiagnosticAnswer(idx)}
                  className={`w-full flex items-start gap-3 p-3.5 rounded-xl border text-left text-xs sm:text-sm transition-all ${optionStyle}`}
                >
                  <div className="h-5 w-5 rounded-md border border-white/20 flex items-center justify-center shrink-0 text-xs font-bold text-white/80">
                    {String.fromCharCode(65 + idx)}
                  </div>
                  <span className="flex-1 leading-relaxed">{option}</span>
                  {quizSubmitted && isCorrect && (
                    <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Explanation Box on Submit */}
          {quizSubmitted && (
            <div className="mt-4 p-4 rounded-xl border border-primary/30 bg-primary/10 text-xs sm:text-sm text-text-primary space-y-1 animate-in fade-in">
              <span className="font-bold text-primary-light block">Auditor Analysis & Explanation:</span>
              <p className="text-text-secondary leading-relaxed">
                {diagnosticQuestions[quizQuestionIndex].explanation}
              </p>
            </div>
          )}

          {/* Action Buttons for Quiz */}
          <div className="flex items-center justify-between pt-3">
            <button
              onClick={handleResetDiagnostic}
              className="inline-flex items-center gap-1.5 text-xs text-text-muted hover:text-text-primary transition-colors"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>Restart Diagnostic</span>
            </button>

            {!quizSubmitted ? (
              <button
                id="diagnostic-submit-btn"
                disabled={selectedAnswer === null}
                onClick={handleDiagnosticSubmit}
                className="inline-flex items-center gap-2 rounded-xl bg-primary hover:bg-primary-light disabled:opacity-40 px-4 py-2 text-xs font-bold text-white transition-all"
              >
                <span>Submit Answer</span>
                <CheckCircle2 className="h-3.5 w-3.5" />
              </button>
            ) : quizQuestionIndex < diagnosticQuestions.length - 1 ? (
              <button
                id="diagnostic-next-btn"
                onClick={handleNextDiagnosticQuestion}
                className="inline-flex items-center gap-2 rounded-xl bg-white hover:bg-white/90 text-black px-4 py-2 text-xs font-bold transition-all"
              >
                <span>Next Question</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            ) : (
              <button
                id="diagnostic-full-exams-btn"
                onClick={() => setCurrentTab('exams')}
                className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black px-4 py-2 text-xs font-bold transition-all shadow-md"
              >
                <span>Take Full Proctored Mock Exam</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 5. Platform Core Features Grid */}
      <div className="space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-primary-light">
            Comprehensive Toolkit
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-text-primary">
            Built for Real-World Audit Preparation
          </h2>
          <p className="text-xs sm:text-sm text-text-secondary">
            Everything you need to study, practice, simulate, and prove compliance competency.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div
            onClick={() => openAiModal()}
            className="rounded-2xl border border-white/10 bg-surface p-5 hover:border-primary/50 hover:bg-surface-hover cursor-pointer transition-all space-y-3 group"
          >
            <div className="h-10 w-10 rounded-xl bg-primary/20 border border-primary/30 flex items-center justify-center text-primary-light group-hover:scale-105 transition-transform">
              <Sparkles className="h-5 w-5" />
            </div>
            <h3 className="text-sm font-bold text-text-primary group-hover:text-primary-light">
              ComplyAI Auditor Bot
            </h3>
            <p className="text-xs text-text-muted leading-relaxed">
              Instant AI chat, scenario generation, and mistake analysis grounded in exact standard clauses.
            </p>
          </div>

          <div
            onClick={() => setCurrentTab('exams')}
            className="rounded-2xl border border-white/10 bg-surface p-5 hover:border-accent-cyan/50 hover:bg-surface-hover cursor-pointer transition-all space-y-3 group"
          >
            <div className="h-10 w-10 rounded-xl bg-accent-cyan/20 border border-accent-cyan/30 flex items-center justify-center text-accent-cyan group-hover:scale-105 transition-transform">
              <CheckSquare className="h-5 w-5" />
            </div>
            <h3 className="text-sm font-bold text-text-primary group-hover:text-accent-cyan">
              Mock Certification Exams
            </h3>
            <p className="text-xs text-text-muted leading-relaxed">
              Timed, proctored mock exams with comprehensive score breakdowns and certificate generation.
            </p>
          </div>

          <div
            onClick={() => setCurrentTab('gap-analysis')}
            className="rounded-2xl border border-white/10 bg-surface p-5 hover:border-amber-500/50 hover:bg-surface-hover cursor-pointer transition-all space-y-3 group"
          >
            <div className="h-10 w-10 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 group-hover:scale-105 transition-transform">
              <SlidersHorizontal className="h-5 w-5" />
            </div>
            <h3 className="text-sm font-bold text-text-primary group-hover:text-amber-400">
              Dynamic Gap Lab
            </h3>
            <p className="text-xs text-text-muted leading-relaxed">
              Interactive audit checklist with evidence logs, remediations, and real-time posture scores.
            </p>
          </div>

          <div
            onClick={() => setCurrentTab('matrix')}
            className="rounded-2xl border border-white/10 bg-surface p-5 hover:border-purple-500/50 hover:bg-surface-hover cursor-pointer transition-all space-y-3 group"
          >
            <div className="h-10 w-10 rounded-xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-purple-400 group-hover:scale-105 transition-transform">
              <Layers className="h-5 w-5" />
            </div>
            <h3 className="text-sm font-bold text-text-primary group-hover:text-purple-400">
              Cross-Standard Matrix
            </h3>
            <p className="text-xs text-text-muted leading-relaxed">
              Map overlapping controls across SOC 2, ISO 27001, HIPAA, and GDPR to audit once, comply many.
            </p>
          </div>
        </div>
      </div>

      {/* 6. Quick Action Bottom Callout */}
      <div className="rounded-3xl border border-primary/30 bg-gradient-to-r from-primary/20 via-surface to-accent-cyan/10 p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6 shadow-xl">
        <div className="space-y-1.5">
          <h3 className="text-xl font-bold text-text-primary">
            {!isAuthenticated
              ? 'Ready to begin your verified audit certification journey?'
              : 'Ready to jump back into your compliance training?'}
          </h3>
          <p className="text-xs sm:text-sm text-text-secondary">
            {!isAuthenticated
              ? 'Create a fresh auditor account to track real-time XP, earn verified badges, and back up mock exam certificates.'
              : 'Your progress, gap remediations, and certificates are automatically synchronized.'}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {!isAuthenticated ? (
            <>
              <button
                id="welcome-cta-signup-btn"
                onClick={() => setCurrentTab('signup')}
                className="inline-flex items-center gap-2 rounded-xl bg-primary hover:bg-primary-light px-5 py-2.5 text-xs sm:text-sm font-bold text-white shadow-lg shadow-primary/25 transition-all"
              >
                <Sparkles className="h-4 w-4" />
                <span>Create Free Account / Sign Up</span>
                <ArrowRight className="h-4 w-4" />
              </button>

              <button
                id="welcome-cta-login-btn"
                onClick={() => setCurrentTab('login')}
                className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/5 hover:bg-white/10 px-4 py-2.5 text-xs sm:text-sm font-semibold text-text-primary transition-all"
              >
                <Lock className="h-4 w-4 text-primary-light" />
                <span>Log In</span>
              </button>
            </>
          ) : (
            <>
              <button
                id="welcome-cta-dashboard-btn"
                onClick={() => setCurrentTab('dashboard')}
                className="inline-flex items-center gap-2 rounded-xl bg-primary hover:bg-primary-light px-5 py-2.5 text-xs sm:text-sm font-bold text-white shadow-lg shadow-primary/25 transition-all"
              >
                <span>Open Dashboard</span>
                <ArrowRight className="h-4 w-4" />
              </button>

              <button
                id="welcome-cta-explore-btn"
                onClick={() => setCurrentTab('library')}
                className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 hover:bg-white/10 px-4 py-2.5 text-xs sm:text-sm font-semibold text-text-primary transition-all"
              >
                <span>Browse Lessons</span>
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
