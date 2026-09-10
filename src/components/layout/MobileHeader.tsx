import React from 'react';
import { Menu, ShieldCheck, Sparkles, Flame } from 'lucide-react';
import { useAuthAndData } from '../../context/AuthAndDataContext';

interface MobileHeaderProps {
  onOpenMobileMenu: () => void;
  currentTab: string;
}

export const MobileHeader: React.FC<MobileHeaderProps> = ({
  onOpenMobileMenu,
  currentTab
}) => {
  const { user, openAiModal } = useAuthAndData();

  const getTabTitle = (tab: string) => {
    switch (tab) {
      case 'dashboard': return 'Dashboard';
      case 'library': return 'Frameworks';
      case 'exams': return 'Exams & Certs';
      case 'active-exam': return 'Active Exam';
      case 'exam-results': return 'Exam Breakdown';
      case 'gap-analysis': return 'Gap Analysis';
      case 'matrix': return 'Cross-Matrix';
      case 'analytics': return 'Analytics';
      case 'welcome': return 'Welcome Guide';
      case 'settings': return 'Settings';
      case 'admin': return 'Instructor Hub';
      case 'framework-details': return 'Curriculum';
      case 'lesson': return 'Interactive Lesson';
      default: return 'ComplianceVerse AI';
    }
  };

  return (
    <header className="lg:hidden sticky top-0 z-30 flex h-14 w-full items-center justify-between border-b border-white/10 bg-[#050508]/90 px-3.5 backdrop-blur-2xl">
      {/* Left: Mobile hamburger & mini logo */}
      <div className="flex items-center gap-2">
        <button
          id="mobile-sidebar-toggle"
          onClick={onOpenMobileMenu}
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-text-secondary hover:text-text-primary hover:bg-white/10 transition-all focus:outline-none focus:ring-1 focus:ring-primary-light"
          aria-label="Open navigation menu"
        >
          <Menu className="h-5 w-5" />
        </button>

        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-xl bg-primary/20 border border-primary/30 text-primary-light">
            <ShieldCheck className="h-4 w-4" />
          </div>
          <div className="flex flex-col">
            <span className="font-heading text-xs font-bold text-text-primary leading-tight">
              {getTabTitle(currentTab)}
            </span>
            <span className="text-[9px] text-text-muted leading-tight">
              ComplianceVerse AI • by Nandani Dodeja
            </span>
          </div>
        </div>
      </div>

      {/* Right: Quick actions (Streak & Comply AI) */}
      <div className="flex items-center gap-1.5">
        <div className="flex items-center gap-1 rounded-xl bg-white/5 border border-white/10 px-2 py-1.5 text-xs text-amber-400 font-medium" title={`${user.streakDays}-Day Learning Streak`}>
          <Flame className="h-3.5 w-3.5 fill-amber-400/30 text-amber-400" />
          <span className="font-mono text-xs">{user.streakDays}d</span>
        </div>

        <button
          onClick={() => openAiModal()}
          className="flex items-center gap-1.5 rounded-xl border border-primary/40 bg-primary/20 px-2.5 py-1.5 text-xs font-semibold text-primary-light hover:bg-primary/30 transition-all min-h-[36px]"
          aria-label="Open Comply AI Assistant"
        >
          <Sparkles className="h-3.5 w-3.5 animate-pulse text-primary-light" />
          <span className="text-xs font-bold">AI</span>
        </button>
      </div>
    </header>
  );
};

