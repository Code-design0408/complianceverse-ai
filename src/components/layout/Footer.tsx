import React from 'react';
import { Shield, Lock, AlertCircle, FileCheck, CheckCircle2, Globe, Linkedin, ExternalLink } from 'lucide-react';
import { useAuthAndData } from '../../context/AuthAndDataContext';

interface FooterProps {
  setCurrentTab: (tab: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ setCurrentTab }) => {
  const { isAuthenticated, openAuthPrompt } = useAuthAndData();

  const handleModuleClick = (tab: string, moduleName: string) => {
    if (!isAuthenticated) {
      openAuthPrompt({
        title: 'Sign Up or Log In Required',
        message: `Please sign up or log in first to access ${moduleName} and interactive platform learning modules.`,
        targetTab: tab,
      });
      return;
    }
    setCurrentTab(tab);
  };

  const frameworksList = [
    { name: 'SOC 2 Type II', id: 'soc2' },
    { name: 'ISO/IEC 27001:2022', id: 'iso27001' },
    { name: 'NIST CSF 2.0', id: 'nistcsf' },
    { name: 'HIPAA Security', id: 'hipaa' },
    { name: 'PCI-DSS v4.0', id: 'pcidss' },
    { name: 'GDPR Privacy', id: 'gdpr' },
  ];

  return (
    <footer className="border-t border-white/10 bg-white/[0.03] backdrop-blur-xl pt-12 pb-8 text-text-secondary mt-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-8 border-b border-white/10">
          
          {/* Col 1: Platform identity & Creator */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-primary via-primary-dark to-black p-0.5 shadow-md shadow-primary/25 border border-white/15">
                <div className="flex h-full w-full items-center justify-center rounded-[10px] bg-[#0a0a10]">
                  <Shield className="h-4 w-4 text-primary-light" />
                </div>
              </div>
              <div>
                <span className="font-heading font-extrabold text-text-primary text-base tracking-tight">
                  ComplianceVerse <span className="text-primary-light">AI</span>
                </span>
                <span className="block text-[11px] text-text-muted">
                  Cybersecurity • Compliance • AI • GRC
                </span>
              </div>
            </div>

            <p className="text-xs text-text-muted max-w-md leading-relaxed">
              The premier interactive learning management and exam certification simulator for cybersecurity, privacy, and GRC professionals. Master SOC 2, ISO 27001, NIST CSF, HIPAA, PCI-DSS, and GDPR with deterministic scoring and AI-guided remediation.
            </p>

            {/* Creator Links & Attribution */}
            <div className="pt-1 flex flex-wrap items-center gap-3">
              <span className="text-xs font-semibold text-text-primary">
                Created by Nandani Dodeja
              </span>
              <div className="flex items-center gap-2">
                <a
                  href="https://nandani-dodeja-portfolio.vercel.app/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 px-2.5 py-1 text-[11px] font-medium text-text-secondary hover:text-primary-light transition-all"
                  aria-label="View Creator Portfolio"
                >
                  <Globe className="h-3 w-3 text-primary-light" />
                  <span>Portfolio</span>
                  <ExternalLink className="h-2.5 w-2.5 opacity-60" />
                </a>
                <a
                  href="https://www.linkedin.com/in/nandani-dodeja-28b81339a"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 px-2.5 py-1 text-[11px] font-medium text-text-secondary hover:text-primary-light transition-all"
                  aria-label="Connect on LinkedIn"
                >
                  <Linkedin className="h-3 w-3 text-[#0A66C2]" />
                  <span>LinkedIn</span>
                  <ExternalLink className="h-2.5 w-2.5 opacity-60" />
                </a>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 pt-2">
              {frameworksList.map((f) => (
                <button
                  key={f.id}
                  onClick={() => {
                    if (!isAuthenticated) {
                      openAuthPrompt({
                        title: 'Sign Up or Log In Required',
                        message: `Please sign up or log in first to access ${f.name} platform modules and study tracks.`,
                        targetTab: 'framework-details',
                        frameworkId: f.id,
                      });
                    } else {
                      setCurrentTab('library');
                    }
                  }}
                  className="inline-flex items-center gap-1 rounded-lg bg-white/5 border border-white/10 px-2.5 py-1 text-[11px] text-text-secondary font-mono backdrop-blur-sm hover:border-primary/40 hover:text-primary-light hover:bg-white/10 transition-all cursor-pointer"
                >
                  <CheckCircle2 className="h-3 w-3 text-emerald-400" />
                  {f.name}
                </button>
              ))}
            </div>
          </div>

          {/* Col 2: Navigation Links */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-text-primary mb-3">
              Platform Modules
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  id="footer-nav-dashboard"
                  onClick={() => handleModuleClick('dashboard', 'the Auditor Dashboard')}
                  className="hover:text-primary-light transition-colors text-left"
                >
                  Auditor Dashboard
                </button>
              </li>
              <li>
                <button
                  id="footer-nav-library"
                  onClick={() => handleModuleClick('library', 'the Framework Curriculum')}
                  className="hover:text-primary-light transition-colors text-left"
                >
                  Framework Curriculum
                </button>
              </li>
              <li>
                <button
                  id="footer-nav-exams"
                  onClick={() => handleModuleClick('exams', 'Certification Exams')}
                  className="hover:text-primary-light transition-colors text-left"
                >
                  Certification Exams
                </button>
              </li>
              <li>
                <button
                  id="footer-nav-gap"
                  onClick={() => handleModuleClick('gap-analysis', 'the Gap Assessment Tool')}
                  className="hover:text-primary-light transition-colors text-left"
                >
                  Gap Assessment Tool
                </button>
              </li>
              <li>
                <button
                  id="footer-nav-comparison"
                  onClick={() => handleModuleClick('comparison', 'the Cross-Framework Matrix')}
                  className="hover:text-primary-light transition-colors text-left"
                >
                  Cross-Framework Matrix
                </button>
              </li>
              <li>
                <button
                  id="footer-nav-analytics"
                  onClick={() => handleModuleClick('analytics', 'Audit Readiness Analytics')}
                  className="hover:text-primary-light transition-colors text-left"
                >
                  Audit Readiness Analytics
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Certification Engine */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-text-primary mb-3">
              Certification Engine
            </h4>
            <ul className="space-y-2 text-xs">
              <li className="flex items-center gap-1.5 text-text-muted">
                <Lock className="h-3.5 w-3.5 text-primary-light" />
                <span>Deterministic Scoring Engine</span>
              </li>
              <li className="flex items-center gap-1.5 text-text-muted">
                <FileCheck className="h-3.5 w-3.5 text-primary-light" />
                <span>75% Passing Threshold Standard</span>
              </li>
              <li className="flex items-center gap-1.5 text-text-muted">
                <Shield className="h-3.5 w-3.5 text-primary-light" />
                <span>Zero Client-Side API Key Exposure</span>
              </li>
              <li className="flex items-center gap-1.5 text-text-muted">
                <CheckCircle2 className="h-3.5 w-3.5 text-primary-light" />
                <span>Gemini 3.7 Flash Backend Agent</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Disclaimer & Copyright */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-text-muted">
          <div className="flex items-center gap-2 max-w-2xl">
            <AlertCircle className="h-4 w-4 text-amber-400 shrink-0" />
            <p className="text-[11px] leading-tight">
              <strong>Educational Disclaimer:</strong> ComplianceVerse AI is an educational and decision-support platform created by Nandani Dodeja. It does not constitute legal advice, official certification, formal audit, or regulatory approval.
            </p>
          </div>
          <p className="text-[11px] shrink-0 text-center sm:text-right">
            &copy; 2026 ComplianceVerse AI. Created by Nandani Dodeja.
          </p>
        </div>
      </div>
    </footer>
  );
};

