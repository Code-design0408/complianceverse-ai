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
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
  Bot,
  Award,
  Zap,
  ShieldAlert,
  Lock
} from 'lucide-react';
import { useAuthAndData } from '../../context/AuthAndDataContext';
import { UserRole } from '../../types';

interface SidebarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
  isMobileOpen: boolean;
  setIsMobileOpen: (open: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  setCurrentTab,
  isCollapsed,
  setIsCollapsed,
  isMobileOpen,
  setIsMobileOpen,
}) => {
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

  const navItems = [
    { id: 'welcome', label: 'Welcome Guide', icon: Sparkles, desc: 'Tour & career roadmaps' },
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3, desc: 'Overview & progress' },
    { id: 'library', label: 'Frameworks', icon: BookOpen, desc: '6 Core GRC Standards' },
    { id: 'exams', label: 'Exams & Certs', icon: CheckSquare, badge: activeExamSession ? 'Active' : undefined, desc: 'Simulated practice & testing' },
    { id: 'gap-analysis', label: 'Gap Analysis', icon: SlidersHorizontal, desc: 'Readiness & remediation' },
    { id: 'matrix', label: 'Cross-Matrix', icon: Layers, desc: 'Unified control mapping' },
    { id: 'analytics', label: 'Analytics', icon: ShieldCheck, desc: 'Audit readiness telemetry' },
  ];

  // Admin Side - Accessible ONLY to Owner (Nandani Dodeja / Master Admin)
  const isOwnerAdmin = isMasterAdmin || isMasterAdminUnlocked || user.email?.toLowerCase() === 'nandanidodeja368@gmail.com' || user.role === 'admin';
  if (isOwnerAdmin) {
    navItems.push({
      id: 'admin',
      label: 'Admin Control Center',
      icon: ShieldAlert,
      badge: 'OWNER',
      desc: 'Live user activity monitoring'
    });
  }

  const handleRoleChange = (newRole: UserRole) => {
    setUserRole(newRole);
    setIsRoleMenuOpen(false);
  };

  const handleNavClick = (tabId: string) => {
    if (!isAuthenticated && tabId !== 'welcome' && tabId !== 'landing') {
      openAuthPrompt({
        title: 'Sign Up or Log In Required',
        message: 'Please sign up or log in first to access platform modules, exams, and auditor tools.',
        targetTab: tabId,
      });
      return;
    }
    setCurrentTab(tabId);
    if (isMobileOpen) {
      setIsMobileOpen(false);
    }
  };

  const sidebarContent = (
    <div className="flex h-full flex-col justify-between overflow-y-auto overflow-x-hidden p-3.5 scrollbar-thin scrollbar-thumb-white/10">
      {/* Top Section: Brand & Navigation */}
      <div className="space-y-4">
        {/* Brand Header */}
        <div className="flex items-center justify-between px-1.5 py-1">
          <button
            id="sidebar-brand-btn"
            onClick={() => handleNavClick(isAuthenticated ? 'dashboard' : 'welcome')}
            className={`flex items-center gap-3 text-left group focus:outline-none transition-all ${
              isCollapsed ? 'justify-center w-full' : ''
            }`}
            aria-label="Go to ComplianceVerse AI Dashboard"
          >
            <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-primary via-primary-dark to-black p-0.5 shadow-lg shadow-primary/25 ring-1 ring-white/15 group-hover:ring-primary-light transition-all">
              <div className="flex h-full w-full items-center justify-center rounded-[14px] bg-[#0c0c12]/90 backdrop-blur-md">
                <ShieldCheck className="h-5 w-5 text-primary-light group-hover:scale-110 transition-transform" />
              </div>
            </div>

            {!isCollapsed && (
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <span className="font-heading text-base font-extrabold tracking-tight text-text-primary truncate">
                    C.<span className="text-primary-light">V</span>
                  </span>
                  <span className="rounded-full bg-primary/20 border border-primary/30 px-1.5 py-0.2 text-[9px] font-bold text-primary-light tracking-wider uppercase">
                    GRC AI
                  </span>
                </div>
                <p className="text-[10px] text-text-muted truncate">
                  Enterprise Security & Audit
                </p>
              </div>
            )}
          </button>

          {/* Desktop Collapse / Expand Toggle Button */}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hidden lg:flex h-8 w-8 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-text-muted hover:text-text-primary hover:bg-white/10 transition-all focus:outline-none focus:ring-1 focus:ring-primary-light"
            title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </button>

          {/* Mobile Close Button (Minimum 44px touch area) */}
          <button
            onClick={() => setIsMobileOpen(false)}
            className="lg:hidden flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-text-muted hover:text-text-primary hover:bg-white/10 transition-all focus:outline-none"
            aria-label="Close menu"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* AI Assistant Quick Trigger Banner */}
        <div className="px-1">
          <button
            id="sidebar-comply-ai-btn"
            onClick={() => openAiModal()}
            className={`w-full flex items-center rounded-2xl border border-primary/40 bg-gradient-to-r from-primary/20 via-white/[0.04] to-black/40 text-primary-light hover:border-primary-light/60 hover:bg-primary/25 transition-all shadow-md shadow-primary/10 backdrop-blur-md group ${
              isCollapsed ? 'justify-center p-2.5 min-h-[44px]' : 'justify-between px-3 py-2.5 min-h-[44px]'
            }`}
            title="Ask Comply AI Assistant"
            aria-label="Open Comply AI Assistant"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-xl bg-primary/30 border border-primary/40 text-primary-light shadow-sm group-hover:scale-105 transition-transform">
                <Sparkles className="h-3.5 w-3.5 animate-pulse" />
              </div>
              {!isCollapsed && (
                <div className="text-left min-w-0">
                  <span className="block text-xs font-bold text-text-primary leading-tight">
                    Comply AI Copilot
                  </span>
                  <span className="block text-[10px] text-primary-light/80 leading-tight truncate">
                    Instant standard guidance
                  </span>
                </div>
              )}
            </div>
            {!isCollapsed && (
              <Zap className="h-3.5 w-3.5 text-primary-light/60 group-hover:text-primary-light transition-colors shrink-0" />
            )}
          </button>
        </div>

        {/* Navigation Group */}
        <div className="space-y-1 pt-1">
          {!isCollapsed && (
            <span className="px-2.5 text-[10px] font-bold uppercase tracking-wider text-text-muted">
              Main Modules
            </span>
          )}

          <nav className="space-y-1 pt-1" aria-label="Main Navigation">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;

              return (
                <button
                  key={item.id}
                  id={`sidebar-nav-${item.id}`}
                  onClick={() => handleNavClick(item.id)}
                  title={isCollapsed ? item.label : undefined}
                  aria-current={isActive ? 'page' : undefined}
                  className={`relative flex w-full items-center rounded-2xl transition-all min-h-[42px] focus:outline-none focus:ring-1 focus:ring-primary-light ${
                    isCollapsed
                      ? 'justify-center p-2.5'
                      : 'justify-between px-3 py-2.5 text-left'
                  } ${
                    isActive
                      ? 'bg-primary/20 text-white font-semibold border border-primary/40 shadow-sm shadow-primary/10 backdrop-blur-md'
                      : 'text-text-secondary hover:text-text-primary hover:bg-white/[0.04] border border-transparent'
                  }`}
                >
                  {/* Active Indicator Bar on left for expanded sidebar */}
                  {isActive && !isCollapsed && (
                    <span className="absolute left-0 top-2 bottom-2 w-1 rounded-r-full bg-primary-light shadow-sm" />
                  )}

                  <div className="flex items-center gap-3 min-w-0">
                    <Icon
                      className={`h-4 w-4 shrink-0 transition-colors ${
                        isActive ? 'text-primary-light' : 'text-text-muted'
                      }`}
                    />
                    {!isCollapsed && (
                      <div className="min-w-0">
                        <span className="block text-xs font-medium leading-tight truncate">
                          {item.label}
                        </span>
                        <span className="block text-[10px] text-text-muted leading-tight truncate">
                          {item.desc}
                        </span>
                      </div>
                    )}
                  </div>

                  {!isCollapsed && item.badge && (
                    <span
                      className={`rounded-full px-2 py-0.5 text-[9px] font-bold shrink-0 ${
                        item.badge === 'Active'
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30 animate-pulse'
                          : 'bg-primary/20 text-primary-light border border-primary/30'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* User Study Progression Status Card */}
        {isAuthenticated && !isCollapsed && (
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-3 space-y-2 backdrop-blur-md shadow-inner">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-text-secondary">Study Streak</span>
              <div className="flex items-center gap-1 text-amber-400 font-bold font-mono">
                <Flame className="h-3.5 w-3.5 fill-amber-400/30" />
                <span>{user.streakDays} Days</span>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs pt-1 border-t border-white/5">
              <span className="text-[11px] text-text-muted truncate">{user.level}</span>
              <span className="font-mono text-[11px] font-bold text-primary-light shrink-0">
                {user.xp.toLocaleString()} XP
              </span>
            </div>

            {/* Quick mini progress meter */}
            <div className="h-1.5 w-full bg-black/40 border border-white/5 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-primary to-accent-light rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, (user.xp % 1000) / 10)}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Bottom Section: Profile, Role Switcher & Settings */}
      <div className="space-y-2 pt-4 border-t border-white/10">
        
        {/* Settings button */}
        <button
          id="sidebar-settings-btn"
          onClick={() => handleNavClick('settings')}
          className={`flex w-full items-center rounded-2xl transition-all min-h-[40px] focus:outline-none focus:ring-1 focus:ring-primary-light ${
            isCollapsed ? 'justify-center p-2.5' : 'gap-3 px-3 py-2 text-left'
          } ${
            currentTab === 'settings'
              ? 'bg-white/10 text-text-primary border border-white/15'
              : 'text-text-secondary hover:text-text-primary hover:bg-white/[0.04]'
          }`}
          title={isCollapsed ? "Settings" : undefined}
          aria-label="Settings and Preferences"
        >
          <Settings className="h-4 w-4 shrink-0 text-text-muted" />
          {!isCollapsed && <span className="text-xs font-medium">Settings & Preferences</span>}
        </button>

        {/* User Profile Card & Auth Section */}
        {isAuthenticated ? (
          <div className="relative">
            <button
              id="sidebar-user-menu-btn"
              onClick={() => setIsRoleMenuOpen(!isRoleMenuOpen)}
              className={`flex w-full items-center rounded-2xl border border-white/10 bg-white/[0.04] p-2 hover:border-white/20 hover:bg-white/[0.08] transition-all backdrop-blur-sm min-h-[44px] focus:outline-none focus:ring-1 focus:ring-primary-light ${
                isCollapsed ? 'justify-center' : 'justify-between'
              }`}
              title={isCollapsed ? `${user.name || 'Auditor'} (${user.role})` : undefined}
              aria-expanded={isRoleMenuOpen}
              aria-label="User profile menu"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-primary/25 border border-primary/40 text-primary-light font-bold text-xs">
                  {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                </div>
                {!isCollapsed && (
                  <div className="text-left min-w-0">
                    <span className="block text-xs font-bold text-text-primary truncate">
                      {user.name || 'Auditor'}
                    </span>
                    <span className="block text-[10px] text-primary-light uppercase font-semibold truncate">
                      {user.role}
                    </span>
                  </div>
                )}
              </div>
              {!isCollapsed && (
                <ChevronDown className="h-3.5 w-3.5 text-text-muted shrink-0" />
              )}
            </button>

            {/* Account Dropdown Popover */}
            {isRoleMenuOpen && (
              <div className={`absolute bottom-full mb-2 ${isCollapsed ? 'left-14 w-60' : 'left-0 right-0'} rounded-3xl border border-white/15 bg-[#0e0e14]/95 p-3 shadow-2xl backdrop-blur-2xl z-50 animate-in fade-in slide-in-from-bottom-2`}>
                <div className="px-2 py-1.5 border-b border-white/10">
                  <p className="text-xs font-bold text-text-primary truncate">{user.name || 'Auditor'}</p>
                  {user.email && <p className="text-[10px] text-text-muted truncate">{user.email}</p>}
                  <div className="mt-1.5 flex items-center justify-between text-[10px]">
                    <span className="rounded-full bg-primary/20 border border-primary/30 px-2 py-0.5 font-bold uppercase text-primary-light">
                      {user.role}
                    </span>
                    <span className="font-mono text-text-secondary">{user.xp} XP</span>
                  </div>
                </div>

                {/* Settings & Sign Out */}
                <div className="pt-2 space-y-1">
                  <button
                    id="sidebar-settings-btn"
                    onClick={() => {
                      handleNavClick('settings');
                      setIsRoleMenuOpen(false);
                    }}
                    className="flex w-full items-center gap-2 rounded-xl px-2.5 py-2 text-xs text-text-secondary hover:bg-white/10 hover:text-text-primary transition-all"
                  >
                    <Settings className="h-3.5 w-3.5" />
                    <span>Settings & Profile</span>
                  </button>
                  <button
                    id="sidebar-logout-btn"
                    onClick={() => {
                      logout();
                      setIsRoleMenuOpen(false);
                      handleNavClick('welcome');
                    }}
                    className="flex w-full items-center gap-2 rounded-xl px-2.5 py-2 text-xs text-rose-400 hover:bg-rose-500/10 transition-all"
                  >
                    <LogOut className="h-3.5 w-3.5" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-1.5">
            <button
              id="sidebar-login-btn"
              onClick={() => setCurrentTab('login')}
              className={`flex w-full items-center rounded-2xl border border-primary/40 bg-primary/20 hover:bg-primary/30 text-primary-light transition-all min-h-[40px] font-semibold text-xs ${
                isCollapsed ? 'justify-center p-2.5' : 'justify-center gap-2 px-3 py-2'
              }`}
            >
              <Sparkles className="h-3.5 w-3.5" />
              {!isCollapsed && <span>Sign In / Sign Up</span>}
            </button>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar (Fixed Left) */}
      <aside
        id="app-sidebar-desktop"
        className={`hidden lg:flex flex-col fixed top-0 bottom-0 left-0 z-40 border-r border-white/10 bg-[#050508]/80 backdrop-blur-2xl transition-all duration-300 ${
          isCollapsed ? 'w-[76px]' : 'w-64'
        }`}
      >
        {sidebarContent}
      </aside>

      {/* Mobile Drawer (Overlay) */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          {/* Backdrop blur */}
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm animate-in fade-in"
            onClick={() => setIsMobileOpen(false)}
          />

          {/* Drawer panel */}
          <div className="relative w-72 max-w-[85vw] bg-[#07070b]/95 border-r border-white/15 backdrop-blur-2xl shadow-2xl h-full z-10 animate-in slide-in-from-left duration-200">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
};

