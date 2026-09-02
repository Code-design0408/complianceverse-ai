import React from 'react';
import { Shield, Lock, AlertCircle, FileCheck, CheckCircle2 } from 'lucide-react';

interface FooterProps {
  setCurrentTab: (tab: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ setCurrentTab }) => {
  return (
    <footer className="border-t border-white/10 bg-white/[0.03] backdrop-blur-xl pt-12 pb-8 text-text-secondary mt-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-8 border-b border-white/10">
          
          {/* Col 1: Platform identity */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-xl bg-primary/20 text-primary-light border border-white/15 backdrop-blur-sm">
                <Shield className="h-4 w-4" />
              </div>
              <span className="font-heading font-bold text-text-primary text-base">
                C.<span className="text-primary-light">V</span>
              </span>
            </div>
            <p className="text-xs text-text-muted max-w-md leading-relaxed">
              The premier interactive learning management and exam certification simulator for cybersecurity, privacy, and GRC professionals. Master SOC 2, ISO 27001, NIST CSF, HIPAA, PCI-DSS, and GDPR with deterministic scoring and AI-guided remediation.
            </p>
            <div className="flex flex-wrap gap-2 pt-1">
              {['SOC 2 Type II', 'ISO/IEC 27001:2022', 'NIST CSF 2.0', 'HIPAA Security', 'PCI-DSS v4.0', 'GDPR Privacy'].map((f) => (
                <span key={f} className="inline-flex items-center gap-1 rounded-lg bg-white/5 border border-white/10 px-2.5 py-1 text-[11px] text-text-secondary font-mono backdrop-blur-sm">
                  <CheckCircle2 className="h-3 w-3 text-emerald-400" />
                  {f}
                </span>
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
                <button onClick={() => setCurrentTab('dashboard')} className="hover:text-primary-light transition-colors">
                  Auditor Dashboard
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentTab('library')} className="hover:text-primary-light transition-colors">
                  Framework Curriculum
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentTab('exams')} className="hover:text-primary-light transition-colors">
                  Certification Exams
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentTab('gap-analysis')} className="hover:text-primary-light transition-colors">
                  Gap Assessment Tool
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentTab('comparison')} className="hover:text-primary-light transition-colors">
                  Cross-Framework Matrix
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentTab('analytics')} className="hover:text-primary-light transition-colors">
                  Audit Readiness Analytics
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Compliance & Standards */}
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
              <strong>Educational Disclaimer:</strong> C.V provides educational guidance, practice assessments, and learning simulations. This platform does not constitute official legal, regulatory, certified CPA audit, or formal certification attestation.
            </p>
          </div>
          <p className="text-[11px] shrink-0">
            &copy; {new Date().getFullYear()} C.V. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};
