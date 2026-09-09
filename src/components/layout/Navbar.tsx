import React, { useState } from 'react';
import {
  ShieldCheck,
  Flame,
  Sparkles,
  BookOpen,
  CheckSquare,
  BarChart3,
  SlidersHorizontal,
  Layers,
  Settings,
  LogOut,
  UserCheck,
  GraduationCap,
  ShieldAlert,
  ChevronDown,
  Menu,
  X,
  Bot
} from 'lucide-react';
import { useAuthAndData } from '../../context/AuthAndDataContext';
import { UserRole } from '../../types';

interface NavbarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentTab, setCurrentTab }) => {
  const {
    user,
    isAuthenticated,
    setUserRole,
    logout,
    openAiModal,
    openAuthPrompt,
    activeExamSession,
    isMasterAdmin,
    isMasterAdminUnlocked
  } = useAuthAndData();

  const [isRoleMenuOpen, setIsRoleMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'library', label: 'Frameworks', icon: BookOpen },
    { id: 'exams', label: 'Exams & Certs', icon: CheckSquare, badge: activeExamSession ? 'Active' : undefined },
    { id: 'gap-analysis', label: 'Gap Analysis', icon: SlidersHorizontal },
    { id: 'comparison', label: 'Matrix', icon: Layers },
    { id: 'analytics', label: 'Analytics', icon: ShieldCheck },
  ];

  // If master admin or owner, add Admin panel link
  const isOwner = isMasterAdmin || isMasterAdminUnlocked || user.email?.toLowerCase() === 'nandanidodeja368@gmail.com' || user.role === 'admin';
  if (isOwner) {
    navItems.push({ id: 'admin', label: 'Admin Console', icon: UserCheck, badge: 'OWNER' });
  }

  const handleRoleChange = (newRole: UserRole) => {
    setUserRole(newRole);
    setIsRoleMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/10 bg-[#050505]/70 backdrop-blur-2xl transition-all">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Brand / Logo */}
        <div className="flex items-center gap-3">
          <button
            id="brand-logo-btn"
            onClick={() => setCurrentTab('dashboard')}
            className="flex items-center gap-2.5 text-left group focus:outline-none"
          >
            <div className="relative flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-primary via-primary-dark to-black p-0.5 shadow-lg shadow-primary/25 ring-1 ring-white/15 group-hover:ring-primary-light transition-all">
              <div className="flex h-full w-full items-center justify-center rounded-[14px] bg-background-elevated/90 backdrop-blur-md">
                <ShieldCheck className="h-5 w-5 text-primary-light group-hover:scale-110 transition-transform" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-heading text-lg font-bold tracking-tight text-text-primary">
                  C.<span className="text-primary-light">V</span>
                </span>
                <span className="rounded-full bg-primary/20 border border-primary/30 px-2 py-0.5 text-[9px] font-bold text-primary-light tracking-wider uppercase">
                  GRC
                </span>
              </div>
              <p className="text-[11px] text-text-muted hidden sm:block">
                SOC 2 • ISO 27001 • NIST CSF • HIPAA • PCI-DSS
              </p>
            </div>
          </button>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                id={`nav-link-${item.id}`}
                onClick={() => {
                  if (!isAuthenticated) {
                    openAuthPrompt({
                      title: 'Sign Up or Log In Required',
                      message: `Please sign up or log in first to access ${item.label} and platform modules.`,
                      targetTab: item.id,
                    });
                    return;
                  }
                  setCurrentTab(item.id);
                }}
                className={`relative flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-xl transition-all ${
                  isActive
                    ? 'text-primary-light bg-white/[0.08] border border-white/15 shadow-sm backdrop-blur-md'
                    : 'text-text-secondary hover:text-text-primary hover:bg-white/[0.04] border border-transparent'
                }`}
              >
                <Icon className={`h-4 w-4 ${isActive ? 'text-primary-light' : 'text-text-muted'}`} />
                <span>{item.label}</span>
                {item.badge && (
                  <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                    item.badge === 'Active'
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30 animate-pulse'
                      : 'bg-primary/20 text-primary-light border border-primary/30'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Right Action Section: Comply AI, Gamification Stats & Profile */}
        <div className="flex items-center gap-2 sm:gap-3">
          
          {/* Comply AI Quick Copilot Button */}
          <button
            id="comply-ai-nav-trigger"
            onClick={() => {
              if (!isAuthenticated) {
                openAuthPrompt({
                  title: 'Sign Up or Log In Required',
                  message: 'Please sign up or log in first to consult the Comply AI Copilot.',
                  targetTab: 'welcome',
                });
                return;
              }
              openAiModal();
            }}
            className="flex items-center gap-1.5 rounded-xl border border-white/15 bg-white/5 backdrop-blur-md px-3 py-1.5 text-xs font-semibold text-primary-light hover:border-primary-light/50 hover:bg-white/10 transition-all shadow-sm group"
          >
            <Sparkles className="h-3.5 w-3.5 text-primary-light animate-pulse" />
            <span className="hidden sm:inline">Comply AI</span>
            <span className="sm:hidden">AI</span>
          </button>

          {/* User Gamification Stats */}
          {isAuthenticated && (
            <div className="hidden md:flex items-center gap-2 rounded-xl bg-white/5 border border-white/10 backdrop-blur-md px-3 py-1 text-xs">
              {/* Streak */}
              <div className="flex items-center gap-1 text-amber-400 font-medium" title={`${user.streakDays} Day Active Learning Streak`}>
                <Flame className="h-3.5 w-3.5 fill-amber-400/30 text-amber-400" />
                <span>{user.streakDays}d</span>
              </div>
              <div className="h-3 w-px bg-white/15" />
              {/* Level & XP */}
              <div className="flex items-center gap-1.5" title={`Level: ${user.level}`}>
                <span className="text-[11px] font-semibold text-text-secondary">{user.level}</span>
                <span className="font-mono text-primary-light font-bold">
                  {user.xp.toLocaleString()} XP
                </span>
              </div>
            </div>
          )}

          {/* User Section */}
          {isAuthenticated ? (
            <div className="relative">
              <button
                id="user-profile-menu-btn"
                onClick={() => setIsRoleMenuOpen(!isRoleMenuOpen)}
                className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 backdrop-blur-md px-2.5 py-1.5 text-xs text-text-primary hover:border-white/20 hover:bg-white/10 transition-all"
              >
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/25 border border-primary/40 text-primary-light font-bold text-xs">
                  {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                </div>
                <span className="hidden sm:inline font-medium max-w-[90px] truncate">{user.name || 'My Account'}</span>
                <ChevronDown className="h-3.5 w-3.5 text-text-muted" />
              </button>

              {isRoleMenuOpen && (
                <div className="absolute right-0 mt-2 w-64 rounded-2xl border border-white/15 bg-[#0a0a0e]/95 p-2 shadow-2xl backdrop-blur-2xl z-50 animate-in fade-in slide-in-from-top-2">
                  <div className="px-3 py-2 border-b border-white/10">
                    <p className="text-xs font-semibold text-text-primary">{user.name || 'Auditor'}</p>
                    {user.email && <p className="text-[11px] text-text-muted truncate">{user.email}</p>}
                    <div className="mt-1.5 flex items-center justify-between text-[10px]">
                      <span className="rounded-full bg-primary/20 border border-primary/30 px-2 py-0.5 font-bold uppercase text-primary-light">
                        {user.role}
                      </span>
                      <span className="font-mono text-text-secondary">{user.xp} XP</span>
                    </div>
                  </div>

                  <div className="py-1">
                    <button
                      id="settings-menu-item"
                      onClick={() => {
                        setCurrentTab('settings');
                        setIsRoleMenuOpen(false);
                      }}
                      className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-xs text-text-secondary hover:bg-white/10 hover:text-text-primary transition-all"
                    >
                      <Settings className="h-3.5 w-3.5" />
                      <span>Settings & Preferences</span>
                    </button>
                    <button
                      id="logout-menu-item"
                      onClick={() => {
                        logout();
                        setIsRoleMenuOpen(false);
                        setCurrentTab('welcome');
                      }}
                      className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-xs text-rose-400 hover:bg-rose-500/10 transition-all"
                    >
                      <LogOut className="h-3.5 w-3.5" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button
                id="nav-login-btn"
                onClick={() => setCurrentTab('login')}
                className="rounded-xl border border-white/15 bg-white/5 hover:bg-white/10 px-3 py-1.5 text-xs font-semibold text-text-primary transition-all backdrop-blur-md"
              >
                Log In
              </button>
              <button
                id="nav-signup-btn"
                onClick={() => setCurrentTab('signup')}
                className="rounded-xl bg-primary hover:bg-primary-dark px-3 py-1.5 text-xs font-bold text-white transition-all shadow-md shadow-primary/20 border border-white/15"
              >
                Sign Up
              </button>
            </div>
          )}

          {/* Mobile Hamburger Menu Toggle */}
          <button
            id="mobile-menu-toggle"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden flex items-center justify-center p-2 rounded-xl text-text-secondary hover:text-text-primary hover:bg-white/10 transition-all"
            aria-label="Toggle Navigation Menu"
          >
            {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden border-b border-white/10 bg-[#0a0a0e]/95 px-4 py-3 shadow-xl backdrop-blur-2xl">
          <div className="flex flex-col gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    if (!isAuthenticated) {
                      openAuthPrompt({
                        title: 'Sign Up or Log In Required',
                        message: `Please sign up or log in first to access ${item.label} and interactive modules.`,
                        targetTab: item.id,
                      });
                      return;
                    }
                    setCurrentTab(item.id);
                  }}
                  className={`flex items-center justify-between rounded-xl px-3 py-2.5 text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-primary/20 text-primary-light border border-primary/30'
                      : 'text-text-secondary hover:bg-white/5 hover:text-text-primary'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`h-4 w-4 ${isActive ? 'text-primary-light' : 'text-text-muted'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className="rounded-full bg-primary/20 px-2 py-0.5 text-[10px] font-bold text-primary-light">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </header>
  );
};
