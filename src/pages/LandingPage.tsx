import React from 'react';
import {
  ShieldCheck,
  Sparkles,
  BookOpen,
  CheckSquare,
  Award,
  SlidersHorizontal,
  Layers,
  ArrowRight,
  UserCheck,
  GraduationCap,
  ShieldAlert,
  Flame,
  CheckCircle2,
  Lock,
  Compass,
  Globe,
  Linkedin,
  ExternalLink,
  User
} from 'lucide-react';
import { useAuthAndData } from '../context/AuthAndDataContext';
import { UserRole } from '../types';

interface LandingPageProps {
  setCurrentTab: (tab: string) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ setCurrentTab }) => {
  const { isAuthenticated, frameworks, openAuthPrompt } = useAuthAndData();

  const handleGetStarted = () => {
    if (isAuthenticated) {
      setCurrentTab('dashboard');
    } else {
      openAuthPrompt({
        title: 'Sign Up or Log In Required',
        message: 'Please sign up or log in first to launch the Auditor Dashboard and track your progress.',
        targetTab: 'dashboard',
      });
    }
  };

  const featureCards = [
    {
      title: 'Interactive Framework Mastery',
      desc: 'Deep-dive into SOC 2 Type II, ISO 27001:2022, NIST CSF 2.0, HIPAA, PCI-DSS v4.0, and GDPR with structured lessons and real-world case studies.',
      icon: BookOpen,
      badge: '6 Frameworks'
    },
    {
      title: 'Deterministic Exam Engine',
      desc: 'Timed 10, 25, and 50-question mock audits with 75% passing thresholds, instant domain breakdowns, and automated XP rewards.',
      icon: CheckSquare,
      badge: 'Certified Simulation'
    },
    {
      title: 'Comply AI Educational Copilot',
      desc: 'Powered by Gemini 3.7 Flash on a secure server-side backend. Ask complex control questions, generate practice audit dilemmas, and get instant mistake debriefs.',
      icon: Sparkles,
      badge: 'Server-Side AI'
    },
    {
      title: 'Compliance Gap Analysis',
      desc: 'Assess your organization’s control maturity across frameworks, calculate readiness percentages, and generate 4-step AI remediation roadmaps.',
      icon: SlidersHorizontal,
      badge: 'Maturity Tracker'
    },
    {
      title: 'Cross-Framework Mapping Matrix',
      desc: 'Compare security and privacy controls side-by-side across SOC 2, ISO 27001, NIST CSF, HIPAA, and PCI-DSS to eliminate duplicate audit overhead.',
      icon: Layers,
      badge: 'Mapping Engine'
    },
    {
      title: 'Gamified GRC Career Progression',
      desc: 'Level up from Beginner to Lead Auditor. Earn badges, maintain daily study streaks, and unlock achievements as you master security controls.',
      icon: Award,
      badge: 'Badges & XP'
    }
  ];

  return (
    <div className="min-h-screen">
      
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28">
        {/* Glow ambient effects */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 h-96 w-96 rounded-full bg-primary/20 blur-3xl -z-10 pointer-events-none" />
        <div className="absolute top-1/3 right-10 h-72 w-72 rounded-full bg-primary-dark/20 blur-3xl -z-10 pointer-events-none" />

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          
          {/* Top Pill */}
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/40 bg-gradient-to-r from-primary/20 via-primary-dark/30 to-primary/10 px-4 py-1.5 text-xs font-semibold text-primary-light shadow-sm shadow-primary/20 mb-6 animate-in fade-in slide-in-from-bottom-2">
            <Sparkles className="h-3.5 w-3.5 text-primary-light animate-pulse" />
            <span>ComplianceVerse AI — Created by Nandani Dodeja</span>
          </div>

          {/* Main Title */}
          <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-text-primary max-w-4xl mx-auto leading-tight">
            ComplianceVerse <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-light via-primary to-accent-light">AI</span>
            <span className="block text-2xl sm:text-3xl lg:text-4xl font-bold text-text-secondary mt-3">
              AI-Powered Cybersecurity, Risk & GRC Learning
            </span>
          </h1>

          {/* Subtitle */}
          <p className="mt-6 text-base sm:text-lg text-text-secondary max-w-2xl mx-auto leading-relaxed">
            The comprehensive training simulator for cloud security, GRC analysts, and IT auditors created by <span className="text-text-primary font-semibold">Nandani Dodeja</span>. Master SOC 2, ISO 27001, NIST CSF, HIPAA, and PCI-DSS with deterministic exam scoring, gap analysis, and real-world audit scenarios.
          </p>

          {/* Auth & Tour Actions */}
          <div className="mt-10 max-w-xl mx-auto">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                id="hero-signup-fresh-btn"
                onClick={() => setCurrentTab('auth')}
                className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-2xl bg-primary px-6 py-3.5 text-xs font-bold text-white hover:bg-primary-dark transition-all shadow-xl shadow-primary/30 border border-white/20"
              >
                <Sparkles className="h-4 w-4 text-white animate-pulse" />
                <span>Create New Account</span>
                <ArrowRight className="h-4 w-4" />
              </button>

              <button
                id="hero-welcome-guide-btn"
                onClick={() => setCurrentTab('welcome')}
                className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-2xl border border-primary/40 bg-primary/10 hover:bg-primary/20 px-6 py-3.5 text-xs font-bold text-primary-light transition-all backdrop-blur-md"
              >
                <BookOpen className="h-4 w-4" />
                <span>Academy Tour</span>
              </button>

              <button
                id="hero-signin-btn"
                onClick={() => setCurrentTab('auth')}
                className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-2xl border border-white/15 bg-white/[0.05] hover:bg-white/10 px-5 py-3.5 text-xs font-bold text-text-primary transition-all backdrop-blur-md"
              >
                <Lock className="h-4 w-4 text-primary-light" />
                <span>Log In</span>
              </button>
            </div>
          </div>

          {/* Framework Badges Bar */}
          <div className="mt-14 pt-8 border-t border-white/10 flex flex-wrap items-center justify-center gap-3">
            {frameworks.map((f) => (
              <div
                key={f.id}
                onClick={() => {
                  if (!isAuthenticated) {
                    openAuthPrompt({
                      title: 'Sign Up or Log In Required',
                      message: `Please sign up or log in first to access ${f.shortName || f.title} platform modules.`,
                      targetTab: 'library',
                    });
                  } else {
                    setCurrentTab('library');
                  }
                }}
                className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-2 backdrop-blur-md hover:border-primary-light/40 hover:bg-white/[0.08] transition-all shadow-sm cursor-pointer"
              >
                <ShieldCheck className="h-4 w-4 text-primary-light" />
                <div className="text-left">
                  <span className="text-xs font-bold text-text-primary block">{f.code}</span>
                  <span className="text-[10px] text-text-muted">{f.category}</span>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* Feature Grid */}
      <section className="py-16 bg-white/[0.02] border-y border-white/10 backdrop-blur-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold text-primary-light uppercase tracking-wider">
              Complete GRC Learning Architecture
            </span>
            <h2 className="font-heading text-2xl sm:text-3xl font-bold text-text-primary mt-2">
              Everything Needed to Pass Real Enterprise Audits
            </h2>
            <p className="text-xs sm:text-sm text-text-muted mt-2">
              Designed according to official AICPA, ISO/IEC, NIST, HHS, and PCI Security Standards Council criteria.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featureCards.map((feat, index) => {
              const Icon = feat.icon;
              return (
                <div
                  key={index}
                  className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur-xl hover:border-primary-light/40 hover:bg-white/[0.07] hover:shadow-2xl hover:shadow-black/40 transition-all group shadow-sm"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/15 text-primary-light border border-primary/25 group-hover:bg-primary/25 transition-all">
                      <Icon className="h-5 w-5" />
                    </div>
                    <span className="rounded-full bg-white/5 border border-white/10 px-3 py-0.5 text-[10px] font-semibold text-text-secondary">
                      {feat.badge}
                    </span>
                  </div>

                  <h3 className="font-heading font-bold text-text-primary text-base mb-2">
                    {feat.title}
                  </h3>
                  <p className="text-xs text-text-secondary leading-relaxed">
                    {feat.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* About Project & Creator Section */}
      <section className="py-16 border-t border-white/10 bg-white/[0.02]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3.5 py-1 text-xs font-semibold text-primary-light mb-3">
              <User className="h-3.5 w-3.5" />
              <span>Project & Creator Information</span>
            </div>
            <h2 className="font-heading text-2xl sm:text-3xl font-extrabold text-text-primary">
              About ComplianceVerse AI
            </h2>
            <p className="mt-3 text-sm text-text-secondary leading-relaxed">
              An independent, purpose-built educational platform engineered to make modern cybersecurity frameworks, GRC workflows, and audit simulations accessible and rigorous.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {/* Project Specs */}
            <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-xl shadow-xl space-y-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/20 text-primary-light border border-primary/30">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <h3 className="font-heading text-base font-bold text-text-primary">The Project</h3>
              <p className="text-xs text-text-muted leading-relaxed">
                <strong className="text-text-primary font-semibold">ComplianceVerse AI</strong> is an interactive cybersecurity, compliance, risk, and GRC learning platform designed to bridge technical security and audit governance.
              </p>
            </div>

            {/* Creator Attribution */}
            <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-xl shadow-xl space-y-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/20 text-primary-light border border-primary/30">
                <User className="h-5 w-5" />
              </div>
              <h3 className="font-heading text-base font-bold text-text-primary">Creator & Developer</h3>
              <p className="text-xs text-text-muted leading-relaxed">
                Created and developed by <strong className="text-text-primary font-semibold">Nandani Dodeja</strong> as a modern, full-featured educational software product with real-time AI assistance and deterministic certification assessments.
              </p>
            </div>

            {/* Verified Professional Links */}
            <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-xl shadow-xl space-y-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/20 text-primary-light border border-primary/30">
                <Globe className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-heading text-base font-bold text-text-primary">Creator Profile</h3>
                <p className="text-xs text-text-muted mt-1">
                  Connect with Nandani Dodeja or explore the developer portfolio:
                </p>
              </div>

              <div className="flex flex-col gap-2 pt-1">
                <a
                  href="https://nandani-dodeja-portfolio.vercel.app/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 px-3.5 py-2 text-xs font-semibold text-text-primary hover:text-primary-light transition-all"
                >
                  <span className="flex items-center gap-2">
                    <Globe className="h-3.5 w-3.5 text-primary-light" />
                    <span>View Creator Portfolio</span>
                  </span>
                  <ExternalLink className="h-3 w-3 opacity-60" />
                </a>

                <a
                  href="https://www.linkedin.com/in/nandani-dodeja-28b81339a"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 px-3.5 py-2 text-xs font-semibold text-text-primary hover:text-primary-light transition-all"
                >
                  <span className="flex items-center gap-2">
                    <Linkedin className="h-3.5 w-3.5 text-[#0A66C2]" />
                    <span>Connect on LinkedIn</span>
                  </span>
                  <ExternalLink className="h-3 w-3 opacity-60" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom CTA Banner */}
      <section className="py-16 text-center">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl border border-[#A5002D]/40 bg-gradient-to-br from-[#7A0019]/30 via-white/[0.04] to-black/60 p-8 sm:p-12 shadow-2xl shadow-black/80 backdrop-blur-2xl">
            <h2 className="font-heading text-2xl sm:text-3xl font-extrabold text-text-primary">
              Ready to Accelerate Your Compliance Career?
            </h2>
            <p className="text-sm text-text-secondary max-w-xl mx-auto mt-3 mb-8">
              Join thousands of engineers, founders, and security practitioners mastering the global standards of trust.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={handleGetStarted}
                className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-bold text-white hover:bg-primary-dark shadow-lg shadow-primary/25 border border-white/15 transition-all"
              >
                <span>Launch Auditor Dashboard</span>
                <ArrowRight className="h-4 w-4" />
              </button>
              <button
                onClick={() => {
                  if (!isAuthenticated) {
                    openAuthPrompt({
                      title: 'Sign Up or Log In Required',
                      message: 'Please sign up or log in first to browse frameworks and platform curriculum modules.',
                      targetTab: 'library',
                    });
                  } else {
                    setCurrentTab('library');
                  }
                }}
                className="w-full sm:w-auto rounded-xl border border-white/15 bg-white/10 px-6 py-3 text-sm font-medium text-text-primary hover:bg-white/15 transition-all backdrop-blur-sm"
              >
                Browse All Frameworks
              </button>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};
