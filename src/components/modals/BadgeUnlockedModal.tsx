import React, { useEffect } from 'react';
import {
  Award,
  Sparkles,
  X,
  ShieldCheck,
  Flame,
  BookOpen,
  CheckCircle2,
  Zap,
  Crown,
  FileCheck,
  Search,
  Lock,
  Target
} from 'lucide-react';
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

  const renderBadgeIcon = (iconName: string) => {
    const iconClass = "h-8 w-8 animate-bounce";
    switch (iconName) {
      case 'Flame': return <Flame className={iconClass} />;
      case 'ShieldCheck': return <ShieldCheck className={iconClass} />;
      case 'BookOpen': return <BookOpen className={iconClass} />;
      case 'Zap': return <Zap className={iconClass} />;
      case 'Crown': return <Crown className={iconClass} />;
      case 'FileCheck': return <FileCheck className={iconClass} />;
      case 'Search': return <Search className={iconClass} />;
      case 'Lock': return <Lock className={iconClass} />;
      case 'Target': return <Target className={iconClass} />;
      case 'CheckCircle2': return <CheckCircle2 className={iconClass} />;
      default: return <Award className={iconClass} />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
      <div className="relative w-full max-w-sm rounded-3xl border border-white/20 bg-[#0f0f13]/95 p-6 sm:p-8 text-center shadow-2xl backdrop-blur-2xl shadow-amber-500/10 animate-in zoom-in-95">
        
        <button
          onClick={clearRecentBadge}
          className="absolute top-4 right-4 p-1.5 rounded-xl text-text-muted hover:text-text-primary hover:bg-white/5 transition-colors"
          aria-label="Close notification"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-500/20 border border-amber-500/40 text-amber-400 mb-4 shadow-lg shadow-amber-500/20 backdrop-blur-sm">
          {renderBadgeIcon(recentBadgeUnlocked.icon)}
        </div>

        <div className="flex items-center justify-center gap-2 mb-2">
          <span className="rounded-full bg-amber-500/20 border border-amber-500/30 px-3 py-1 text-[11px] font-bold text-amber-300 uppercase tracking-wider backdrop-blur-sm">
            Achievement Unlocked
          </span>
          {recentBadgeUnlocked.category && (
            <span className="rounded-full bg-white/10 border border-white/10 px-2.5 py-0.5 text-[10px] font-medium text-text-secondary capitalize">
              {recentBadgeUnlocked.category}
            </span>
          )}
        </div>

        <h3 className="text-lg font-bold text-text-primary mt-2">
          {recentBadgeUnlocked.title}
        </h3>

        <p className="text-xs text-text-secondary mt-1.5 leading-relaxed">
          {recentBadgeUnlocked.description}
        </p>

        {recentBadgeUnlocked.xpReward && (
          <div className="mt-3.5 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
            <Zap className="h-3.5 w-3.5 fill-emerald-400/30" />
            <span>+{recentBadgeUnlocked.xpReward} XP Reward Added</span>
          </div>
        )}

        <div className="mt-4 rounded-xl bg-white/[0.04] border border-white/10 p-2.5 flex items-center justify-center gap-2 text-xs font-mono text-amber-300 backdrop-blur-sm">
          <Sparkles className="h-4 w-4 flex-shrink-0" />
          <span className="text-left text-[11px]">Criteria: {recentBadgeUnlocked.criteria}</span>
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
