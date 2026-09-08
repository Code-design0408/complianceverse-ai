/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ShieldAlert } from 'lucide-react';
import { AuthAndDataProvider, useAuthAndData } from './context/AuthAndDataContext';
import { Sidebar } from './components/layout/Sidebar';
import { MobileHeader } from './components/layout/MobileHeader';
import { Footer } from './components/layout/Footer';
import { ComplyAIAssistantModal } from './components/modals/ComplyAIAssistantModal';
import { BadgeUnlockedModal } from './components/modals/BadgeUnlockedModal';
import { GamificationToasts } from './components/modals/GamificationToasts';
import { AuthPromptModal } from './components/modals/AuthPromptModal';

// Pages
import { LandingPage } from './pages/LandingPage';
import { WelcomePage } from './pages/WelcomePage';
import { DashboardPage } from './pages/DashboardPage';
import { LearningLibraryPage } from './pages/LearningLibraryPage';
import { FrameworkDetailsPage } from './pages/FrameworkDetailsPage';
import { LessonPage } from './pages/LessonPage';
import { ExamsPage } from './pages/ExamsPage';
import { ActiveExamView } from './pages/ActiveExamView';
import { ExamResultsPage } from './pages/ExamResultsPage';
import { GapAnalysisPage } from './pages/GapAnalysisPage';
import { FrameworkComparisonPage } from './pages/FrameworkComparisonPage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { AdminPage } from './pages/AdminPage';
import { SettingsPage } from './pages/SettingsPage';
import { AuthPage } from './pages/AuthPage';
import { ExamResult } from './types';

const MainAppContent: React.FC = () => {
  const { frameworks, isAuthenticated } = useAuthAndData();
  const [currentTab, setCurrentTab] = useState<string>(() => {
    const saved = localStorage.getItem('complianceverse_auth_state_v3');
    const isAuth = saved !== null ? JSON.parse(saved) : false;
    return isAuth ? 'dashboard' : 'welcome';
  });
  const [selectedFrameworkId, setSelectedFrameworkId] = useState<string>(frameworks[0]?.id || 'soc2');
  const [selectedLessonId, setSelectedLessonId] = useState<string>(frameworks[0]?.lessons[0]?.id || 'soc2-1');
  const [examResultForReview, setExamResultForReview] = useState<ExamResult | null>(null);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState<boolean>(false);

  const renderActiveView = () => {
    // If not authenticated and attempting to view any protected module tab directly, show prompt banner
    const isPublicTab = ['welcome', 'landing', 'auth', 'login', 'signup'].includes(currentTab);
    if (!isAuthenticated && !isPublicTab) {
      return (
        <div className="min-h-[75vh] flex items-center justify-center p-6 text-center">
          <div className="max-w-md w-full rounded-3xl border border-white/15 bg-[#0e0e14]/90 p-8 backdrop-blur-2xl shadow-2xl space-y-4">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/20 border border-primary/40 text-primary-light">
              <ShieldAlert className="h-7 w-7" />
            </div>
            <h2 className="text-xl font-bold text-text-primary">Sign Up or Log In Required</h2>
            <p className="text-xs text-text-secondary leading-relaxed">
              Please sign up or log in first to access this platform module, take certification exams, and track compliance progress.
            </p>
            <div className="pt-3 space-y-2.5">
              <button
                id="view-guard-signup-btn"
                onClick={() => setCurrentTab('signup')}
                className="w-full py-3 px-4 rounded-xl bg-primary hover:bg-primary-dark text-xs font-bold text-white transition-all shadow-lg shadow-primary/25 border border-white/15 cursor-pointer"
              >
                Create Free Account / Sign Up
              </button>
              <button
                id="view-guard-login-btn"
                onClick={() => setCurrentTab('login')}
                className="w-full py-2.5 px-4 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-bold text-text-primary transition-all border border-white/10 cursor-pointer"
              >
                Log In to Existing Account
              </button>
              <button
                id="view-guard-welcome-btn"
                onClick={() => setCurrentTab('welcome')}
                className="text-xs text-text-muted hover:text-text-secondary pt-2 block mx-auto transition-colors cursor-pointer"
              >
                Return to Welcome Overview
              </button>
            </div>
          </div>
        </div>
      );
    }

    switch (currentTab) {
      case 'landing':
        return <LandingPage setCurrentTab={setCurrentTab} />;
      case 'welcome':
        return (
          <WelcomePage
            setCurrentTab={setCurrentTab}
            setSelectedFrameworkId={setSelectedFrameworkId}
          />
        );
      case 'dashboard':
        return (
          <DashboardPage
            setCurrentTab={setCurrentTab}
            setSelectedFrameworkId={setSelectedFrameworkId}
            setSelectedLessonId={setSelectedLessonId}
          />
        );
      case 'library':
        return (
          <LearningLibraryPage
            setCurrentTab={setCurrentTab}
            setSelectedFrameworkId={setSelectedFrameworkId}
            setSelectedLessonId={setSelectedLessonId}
          />
        );
      case 'framework-details':
        return (
          <FrameworkDetailsPage
            frameworkId={selectedFrameworkId}
            setCurrentTab={setCurrentTab}
            setSelectedLessonId={setSelectedLessonId}
          />
        );
      case 'lesson':
        return (
          <LessonPage
            frameworkId={selectedFrameworkId}
            lessonId={selectedLessonId}
            setCurrentTab={setCurrentTab}
            setSelectedLessonId={setSelectedLessonId}
          />
        );
      case 'exams':
        return (
          <ExamsPage
            setCurrentTab={setCurrentTab}
            setExamResultForReview={setExamResultForReview}
          />
        );
      case 'active-exam':
        return (
          <ActiveExamView
            setCurrentTab={setCurrentTab}
            setExamResultForReview={setExamResultForReview}
          />
        );
      case 'exam-results':
        return (
          <ExamResultsPage
            examResult={examResultForReview}
            setCurrentTab={setCurrentTab}
          />
        );
      case 'gap-analysis':
        return <GapAnalysisPage setCurrentTab={setCurrentTab} />;
      case 'matrix':
      case 'comparison':
        return <FrameworkComparisonPage />;
      case 'analytics':
        return <AnalyticsPage setCurrentTab={setCurrentTab} />;
      case 'admin':
        return <AdminPage />;
      case 'settings':
        return <SettingsPage />;
      case 'auth':
      case 'login':
        return (
          <AuthPage
            onSuccess={() => setCurrentTab('dashboard')}
            onExploreLanding={() => setCurrentTab('welcome')}
            defaultTab="login"
          />
        );
      case 'signup':
        return (
          <AuthPage
            onSuccess={() => setCurrentTab('dashboard')}
            onExploreLanding={() => setCurrentTab('welcome')}
            defaultTab="signup"
          />
        );
      default:
        return (
          <DashboardPage
            setCurrentTab={setCurrentTab}
            setSelectedFrameworkId={setSelectedFrameworkId}
            setSelectedLessonId={setSelectedLessonId}
          />
        );
    }
  };

  const isExamActive = currentTab === 'active-exam';
  const isAuthView = currentTab === 'auth' || currentTab === 'login' || currentTab === 'signup';

  return (
    <div className="min-h-screen bg-background text-text-primary selection:bg-primary/30 selection:text-white flex flex-col">
      {/* Sidebar is hidden during pure unauthenticated Auth screen to provide a focused onboarding flow */}
      {!isAuthView && (
        <Sidebar
          currentTab={currentTab}
          setCurrentTab={setCurrentTab}
          isCollapsed={isSidebarCollapsed}
          setIsCollapsed={setIsSidebarCollapsed}
          isMobileOpen={isMobileSidebarOpen}
          setIsMobileOpen={setIsMobileSidebarOpen}
        />
      )}

      {/* Main Content Area */}
      <div
        className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ${
          isAuthView
            ? 'pl-0'
            : isSidebarCollapsed
            ? 'lg:pl-[76px]'
            : 'lg:pl-64'
        }`}
      >
        {/* Mobile Header with Hamburger Toggle */}
        {!isAuthView && (
          <MobileHeader
            currentTab={currentTab}
            onOpenMobileMenu={() => setIsMobileSidebarOpen(true)}
          />
        )}

        {/* Main Page Content Body */}
        <main className="flex-1 w-full">
          {renderActiveView()}
        </main>

        {/* Footer (hidden during active exam and pure auth view to avoid clutter) */}
        {!isExamActive && !isAuthView && <Footer setCurrentTab={setCurrentTab} />}
      </div>

      {/* Global Modals & Notifications */}
      <ComplyAIAssistantModal />
      <BadgeUnlockedModal />
      <GamificationToasts />
      <AuthPromptModal onNavigate={setCurrentTab} onSelectFramework={setSelectedFrameworkId} />
    </div>
  );
};

export default function App() {
  return (
    <AuthAndDataProvider>
      <MainAppContent />
    </AuthAndDataProvider>
  );
}
