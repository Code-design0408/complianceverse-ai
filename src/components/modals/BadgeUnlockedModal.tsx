import React, { useEffect } from 'react';
import { Award, Sparkles, X, CheckCircle2 } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useAuthAndData } from '../../context/AuthAndDataContext';

export const BadgeUnlockedModal: React.FC = () => {
  const { recentBadgeUnlocked, clearRecentBadge } = useAuthAndData();

  useEffect(() => {
    if (recentBadgeUnlocked) {
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#7A0019', '#A5002D', '#D4AF37', '#10B981', '#FFFFFF'],
        });
      } catch (err) {
        // Safe fallback if confetti isn't supported in environment
      }
    }
  }, [recentBadgeUnlocked]);

  if (!recentBadgeUnlocked) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
      <div className="relative w-full max-w-sm rounded-3xl border border-white/20 bg-[#0f0f13]/95 p-6 sm:p-8 text-center shadow-2xl backdrop-blur-2xl shadow-amber-500/10 animate-in zoom-in-95">
        
        <button
          onClick={clearRecentBadge}
          className="absolute top-4 right-4 p-1 rounded-xl text-text-muted hover:text-text-primary"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-500/20 border border-amber-500/40 text-amber-400 mb-4 shadow-lg shadow-amber-500/20 backdrop-blur-sm">
          <Award className="h-8 w-8 animate-bounce" />
        </div>

        <span className="rounded-full bg-amber-500/20 border border-amber-500/30 px-3 py-1 text-[11px] font-bold text-amber-300 uppercase tracking-wider backdrop-blur-sm">
          Achievement Unlocked!
        </span>

        <h3 className="text-lg font-bold text-text-primary mt-3">
          {recentBadgeUnlocked.title}
        </h3>

        <p className="text-xs text-text-secondary mt-1 leading-relaxed">
          {recentBadgeUnlocked.description}
        </p>

        <div className="mt-4 rounded-xl bg-white/[0.04] border border-white/10 p-2.5 flex items-center justify-center gap-2 text-xs font-mono text-amber-300 backdrop-blur-sm">
          <Sparkles className="h-4 w-4" />
          <span>Criteria: {recentBadgeUnlocked.criteria}</span>
        </div>

        <button
          onClick={clearRecentBadge}
          className="mt-6 w-full rounded-xl bg-primary py-2.5 text-xs font-bold text-white hover:bg-primary-dark transition-all shadow-md shadow-primary/20"
        >
          Continue Learning
        </button>
      </div>
    </div>
  );
};
