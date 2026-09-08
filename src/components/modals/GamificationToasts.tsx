import React, { useEffect } from 'react';
import { Zap, Flame, Crown, Award, X } from 'lucide-react';
import { useAuthAndData } from '../../context/AuthAndDataContext';

export const GamificationToasts: React.FC = () => {
  const { gamificationToasts, dismissGamificationToast } = useAuthAndData();

  useEffect(() => {
    if (gamificationToasts.length === 0) return;

    const timer = setTimeout(() => {
      // Dismiss the oldest toast after 4 seconds
      const oldest = gamificationToasts[gamificationToasts.length - 1];
      if (oldest) {
        dismissGamificationToast(oldest.id);
      }
    }, 4500);

    return () => clearTimeout(timer);
  }, [gamificationToasts, dismissGamificationToast]);

  if (gamificationToasts.length === 0) return null;

  return (
    <div
      id="gamification-toast-container"
      className="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none"
    >
      {gamificationToasts.slice(0, 3).map((toast) => {
        const isLevel = toast.type === 'level';
        const isBadge = toast.type === 'badge';
        const isStreak = toast.type === 'streak';

        let borderClass = 'border-white/10';
        let bgGradient = 'from-[#141724]/95 to-[#0e1017]/95';
        let iconBg = 'bg-primary/20 text-primary-light border-primary/30';
        let IconComponent = Zap;

        if (isLevel) {
          borderClass = 'border-amber-500/40 shadow-amber-500/10';
          bgGradient = 'from-[#1c150b]/95 to-[#120d06]/95';
          iconBg = 'bg-amber-500/20 text-amber-300 border-amber-500/40';
          IconComponent = Crown;
        } else if (isBadge) {
          borderClass = 'border-indigo-500/40 shadow-indigo-500/10';
          bgGradient = 'from-[#101426]/95 to-[#0b0c17]/95';
          iconBg = 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40';
          IconComponent = Award;
        } else if (isStreak) {
          borderClass = 'border-orange-500/40 shadow-orange-500/10';
          bgGradient = 'from-[#1d1209]/95 to-[#110a05]/95';
          iconBg = 'bg-orange-500/20 text-orange-300 border-orange-500/40';
          IconComponent = Flame;
        }

        return (
          <div
            key={toast.id}
            id={`toast-${toast.id}`}
            className={`pointer-events-auto flex items-start gap-3 p-3.5 rounded-2xl border ${borderClass} bg-gradient-to-br ${bgGradient} backdrop-blur-xl shadow-2xl shadow-black/60 transition-all duration-300 animate-in slide-in-from-bottom-3 fade-in`}
          >
            <div className={`p-2 rounded-xl border ${iconBg} flex-shrink-0 mt-0.5 shadow-sm`}>
              <IconComponent className="h-4 w-4" />
            </div>

            <div className="flex-1 min-w-0 pr-1">
              <div className="flex items-center justify-between gap-2">
                <h4 className="text-xs font-bold text-text-primary truncate">
                  {toast.title}
                </h4>
                {toast.xpAmount && (
                  <span className="flex-shrink-0 px-2 py-0.5 rounded-md bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 font-mono text-[10px] font-bold">
                    +{toast.xpAmount} XP
                  </span>
                )}
              </div>
              <p className="text-[11px] text-text-secondary mt-0.5 leading-tight line-clamp-2">
                {toast.message}
              </p>
            </div>

            <button
              onClick={() => dismissGamificationToast(toast.id)}
              className="p-1 rounded-lg text-text-muted hover:text-text-primary hover:bg-white/5 transition-colors flex-shrink-0"
              aria-label="Dismiss toast"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
