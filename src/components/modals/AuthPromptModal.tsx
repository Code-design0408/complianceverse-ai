import React from 'react';
import { Lock, ShieldCheck, ArrowRight, X, Sparkles, CheckCircle2 } from 'lucide-react';
import { useAuthAndData } from '../../context/AuthAndDataContext';

interface AuthPromptModalProps {
  onNavigate?: (tab: string) => void;
  onSelectFramework?: (id: string) => void;
}

export const AuthPromptModal: React.FC<AuthPromptModalProps> = ({
  onNavigate,
  onSelectFramework,
}) => {
  const { isAuthPromptOpen, authPromptInfo, closeAuthPrompt } = useAuthAndData();

  if (!isAuthPromptOpen) return null;

  const handleAction = (tab: 'signup' | 'login') => {
    if (authPromptInfo?.frameworkId && onSelectFramework) {
      onSelectFramework(authPromptInfo.frameworkId);
    }
    closeAuthPrompt();
    if (onNavigate) {
      onNavigate(tab);
    }
  };

  const title = authPromptInfo?.title || 'Sign Up or Log In Required';
  const message =
    authPromptInfo?.message ||
    'Please sign up or log in first to access platform modules, study compliance frameworks, and track your certification progress.';

  return (
    <div
      id="auth-prompt-modal-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in"
      onClick={closeAuthPrompt}
    >
      <div
        id="auth-prompt-modal-content"
        className="relative w-full max-w-md rounded-3xl border border-white/20 bg-[#0f0f15]/95 p-6 sm:p-7 shadow-2xl backdrop-blur-2xl shadow-primary/20 animate-in zoom-in-95 text-left"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          id="auth-prompt-close-btn"
          type="button"
          onClick={closeAuthPrompt}
          className="absolute top-4 right-4 p-1.5 rounded-xl text-text-muted hover:text-text-primary hover:bg-white/10 transition-colors"
          aria-label="Close"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Icon & Badge */}
        <div className="flex items-center gap-3 mb-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/30 via-primary-dark/40 to-black border border-primary/40 text-primary-light shadow-lg shadow-primary/20">
            <Lock className="h-6 w-6 text-primary-light" />
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-primary/15 border border-primary/30 text-[10px] font-bold text-primary-light uppercase tracking-wider">
              <ShieldCheck className="h-3 w-3" />
              <span>Auditor Authentication</span>
            </div>
            <h3 className="text-lg font-bold text-text-primary mt-1">
              {title}
            </h3>
          </div>
        </div>

        {/* Description */}
        <p className="text-xs text-text-secondary leading-relaxed mb-5">
          {message}
        </p>

        {/* Perks Checklist */}
        <div className="space-y-2 mb-6 rounded-2xl bg-white/[0.03] border border-white/10 p-3.5 text-xs text-text-secondary">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
            <span>Access all 6 Compliance Framework Modules (SOC 2, ISO, NIST...)</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
            <span>Interactive timed exams with instant scoring & badge rewards</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
            <span>Cloud & local sync for daily study streaks & learning history</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2.5">
          <button
            id="auth-prompt-signup-btn"
            type="button"
            onClick={() => handleAction('signup')}
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-primary py-3 px-4 text-xs font-bold text-white hover:bg-primary-dark transition-all shadow-lg shadow-primary/25 border border-white/15 cursor-pointer"
          >
            <span>Create Free Account / Sign Up</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>

          <button
            id="auth-prompt-login-btn"
            type="button"
            onClick={() => handleAction('login')}
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] py-2.5 px-4 text-xs font-bold text-text-primary transition-all border border-white/15 cursor-pointer"
          >
            <span>Log In to Existing Account</span>
          </button>
        </div>

        {/* Dismiss footnote */}
        <div className="text-center mt-4">
          <button
            id="auth-prompt-dismiss-btn"
            type="button"
            onClick={closeAuthPrompt}
            className="text-[11px] text-text-muted hover:text-text-secondary transition-colors"
          >
            Continue browsing overview
          </button>
        </div>
      </div>
    </div>
  );
};
