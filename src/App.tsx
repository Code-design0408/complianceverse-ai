/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { AuthAndDataProvider, useAuthAndData } from './context/AuthAndDataContext';
import { Sidebar } from './components/layout/Sidebar';
import { MobileHeader } from './components/layout/MobileHeader';
import { Footer } from './components/layout/Footer';
import { ComplyAIAssistantModal } from './components/modals/ComplyAIAssistantModal';
import { BadgeUnlockedModal } from './components/modals/BadgeUnlockedModal';

// Pages
import { LandingPage } from './pages/LandingPage';
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
  const { frameworks } = useAuthAndData();
  const [currentTab, setCurrentTab] = useState<string>('landing');
  const [selectedFrameworkId, setSelectedFrameworkId] = useState<string>(frameworks[0]?.id || 'soc2');
  const [selectedLessonId, setSelectedLessonId] = useState<string>(frameworks[0]?.lessons[0]?.id || 'soc2-1');
  const [examResultForReview, setExamResultForReview] = useState<ExamResult | null>(null);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState<boolean>(false);

  const renderActiveView = () => {
    switch (currentTab) {
      case 'landing':
        return <LandingPage setCurrentTab={setCurrentTab} />;
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
        return <FrameworkComparisonPage />;
      case 'analytics':
        return <AnalyticsPage setCurrentTab={setCurrentTab} />;
      case 'admin':
        return <AdminPage />;
      case 'settings':
        return <SettingsPage />;
      case 'auth':
      case 'login':
        return <AuthPage onSuccess={() => setCurrentTab('dashboard')} defaultTab="login" />;
      case 'signup':
        return <AuthPage onSuccess={() => setCurrentTab('dashboard')} defaultTab="signup" />;
      default:
        return <DashboardPage setCurrentTab={setCurrentTab} setSelectedFrameworkId={setSelectedFrameworkId} setSelectedLessonId={setSelectedLessonId} />;
    }
  };

  const isExamActive = currentTab === 'active-exam';

  return (
    <div className="min-h-screen bg-background text-text-primary selection:bg-primary/30 selection:text-white flex flex-col">
      {/* Permanent Desktop & Overlay Mobile Sidebar */}
      <Sidebar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        isCollapsed={isSidebarCollapsed}
        setIsCollapsed={setIsSidebarCollapsed}
        isMobileOpen={isMobileSidebarOpen}
        setIsMobileOpen={setIsMobileSidebarOpen}
      />

      {/* Main Content Area (offset by sidebar width on desktop) */}
      <div
        className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ${
          isSidebarCollapsed ? 'lg:pl-[76px]' : 'lg:pl-64'
        }`}
      >
        {/* Mobile Header with Hamburger Toggle */}
        <MobileHeader
          currentTab={currentTab}
          onOpenMobileMenu={() => setIsMobileSidebarOpen(true)}
        />

        {/* Main Page Content Body */}
        <main className="flex-1 w-full">
          {renderActiveView()}
        </main>

        {/* Footer (hidden during active exam to avoid distraction) */}
        {!isExamActive && <Footer setCurrentTab={setCurrentTab} />}
      </div>

      {/* Global Modals */}
      <ComplyAIAssistantModal />
      <BadgeUnlockedModal />
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
