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

  return (
    <header className="lg:hidden sticky top-0 z-30 flex h-14 w-full items-center justify-between border-b border-white/10 bg-[#050508]/80 px-4 backdrop-blur-2xl">
      {/* Left: Mobile hamburger & mini logo */}
      <div className="flex items-center gap-2.5">
        <button
          id="mobile-sidebar-toggle"
          onClick={onOpenMobileMenu}
          className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-text-secondary hover:text-text-primary hover:bg-white/10 transition-all"
          aria-label="Open sidebar menu"
        >
          <Menu className="h-5 w-5" />
        </button>

        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-xl bg-primary/20 border border-primary/30 text-primary-light">
            <ShieldCheck className="h-4 w-4" />
          </div>
          <span className="font-heading text-sm font-bold text-text-primary">
            C.<span className="text-primary-light">V</span>
          </span>
        </div>
      </div>

      {/* Right: Quick actions (Streak & Comply AI) */}
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1 rounded-xl bg-white/5 border border-white/10 px-2 py-1 text-xs text-amber-400 font-medium">
          <Flame className="h-3.5 w-3.5 fill-amber-400/30" />
          <span>{user.streakDays}d</span>
        </div>

        <button
          onClick={() => openAiModal()}
          className="flex items-center gap-1 rounded-xl border border-white/15 bg-white/5 px-2.5 py-1 text-xs font-semibold text-primary-light hover:bg-white/10 transition-all"
        >
          <Sparkles className="h-3.5 w-3.5 animate-pulse" />
          <span>AI</span>
        </button>
      </div>
    </header>
  );
};
