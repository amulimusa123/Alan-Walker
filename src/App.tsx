import React, { useState, useEffect } from 'react';
import { PageType, UserRole } from './types';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { PortalLogin } from './components/PortalLogin';
import { PortalDashboard } from './components/PortalDashboard';
import { AdminDashboard } from './components/AdminDashboard';
import { GeminiChatbot } from './components/GeminiChatbot';
import { TTSPlayer } from './components/TTSPlayer';
import { CampusVisualizer } from './components/CampusVisualizer';
import { OfflineStatusBar } from './components/OfflineStatusBar';
import { initOfflineStorage, clearStoredSession, getStoredSession, saveStoredSession } from './services/offlineStorage';

import { HomePage } from './pages/HomePage';
import { AboutPage } from './pages/AboutPage';
import { AcademicsPage } from './pages/AcademicsPage';
import { AdmissionsPage } from './pages/AdmissionsPage';
import { CampusLifePage } from './pages/CampusLifePage';
import { AlumniPage } from './pages/AlumniPage';
import { ContactPage } from './pages/ContactPage';


export default function App() {
  // Requirement: "add login page as the first page"
  // Default to the login page on first entry unless a specific hash is present.
  const [viewState, setViewState] = useState<'login' | 'portal' | 'page'>('login');
  const [currentPage, setCurrentPage] = useState<PageType>('home');
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<{ name: string; role: UserRole; username?: string; id?: string } | null>(null);
  const [adminStudentPreview, setAdminStudentPreview] = useState<boolean>(false);

  // Modals for Gemini features
  const [isTTSOpen, setIsTTSOpen] = useState<boolean>(false);
  const [isVisualizerOpen, setIsVisualizerOpen] = useState<boolean>(false);

  // Initialize offline storage on mount and restore active session if available
  useEffect(() => {
    initOfflineStorage();
    const stored = getStoredSession();
    if (stored) {
      setIsLoggedIn(true);
      setCurrentUser(stored as any);
      if (window.location.hash === '#portal') {
        setViewState('portal');
      }
    }
  }, []);

  // Sync state with browser URL hash
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '').toLowerCase();
      if (!hash || hash === 'login') {
        setViewState('login');
      } else if (hash === 'portal') {
        if (!isLoggedIn) {
          setViewState('login');
        } else {
          setViewState('portal');
        }
      } else if (['home', 'about', 'academics', 'admissions', 'campus-life', 'alumni', 'contact'].includes(hash)) {
        setCurrentPage(hash as PageType);
        setViewState('page');
      }
    };

    // On initial mount
    if (window.location.hash) {
      handleHashChange();
    } else {
      // User requested login page as first page
      setViewState('login');
    }

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [isLoggedIn]);

  const updateHash = (newHash: string) => {
    window.location.hash = newHash;
  };

  const handleLoginSuccess = (user: { name: string; role: UserRole; username?: string; id?: string }) => {
    setIsLoggedIn(true);
    setCurrentUser(user);
    saveStoredSession(user);
    setViewState('portal');
    updateHash('portal');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleContinueToWebsite = () => {
    setViewState('page');
    setCurrentPage('home');
    updateHash('home');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigate = (page: PageType) => {
    setCurrentPage(page);
    setViewState('page');
    updateHash(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenPortalLogin = () => {
    if (isLoggedIn) {
      setViewState('portal');
      updateHash('portal');
    } else {
      setViewState('login');
      updateHash('login');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLogout = () => {
    clearStoredSession();
    setIsLoggedIn(false);
    setCurrentUser(null);
    setViewState('login');
    updateHash('login');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleTogglePortalView = () => {
    if (viewState === 'portal') {
      setViewState('page');
      updateHash(currentPage);
    } else {
      if (!isLoggedIn) {
        setViewState('login');
        updateHash('login');
      } else {
        setViewState('portal');
        updateHash('portal');
      }
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col font-sans bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 antialiased selection:bg-emerald-800 selection:text-white transition-colors duration-200">
      {/* Offline Connectivity Status Bar */}
      <OfflineStatusBar />

      {/* 1. INITIAL LOGIN PAGE VIEW */}
      {viewState === 'login' && (
        <PortalLogin
          onLoginSuccess={handleLoginSuccess}
          onContinueToWebsite={handleContinueToWebsite}
          onNavigateToPage={handleNavigate}
        />
      )}

      {/* 2. AUTHENTICATED PORTAL VIEW (Admin or Student) */}
      {viewState === 'portal' && (
        <>
          {currentUser?.role === 'admin' && !adminStudentPreview ? (
            <AdminDashboard
              currentUser={currentUser}
              onLogout={handleLogout}
              onGoToWebsite={() => {
                setViewState('page');
                updateHash(currentPage);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onViewStudentPortal={() => setAdminStudentPreview(true)}
            />
          ) : (
            <div>
              {/* If Admin is in Student Preview mode, show switcher bar */}
              {currentUser?.role === 'admin' && adminStudentPreview && (
                <div className="bg-amber-400 text-slate-950 px-4 py-2 text-xs font-black flex items-center justify-between sticky top-16 z-40 shadow-md">
                  <span>👀 Admin Preview Mode: Viewing student portal experience</span>
                  <button
                    onClick={() => setAdminStudentPreview(false)}
                    className="bg-slate-950 text-amber-300 hover:bg-slate-900 px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer"
                  >
                    ← Return to Admin Console
                  </button>
                </div>
              )}
              <PortalDashboard
                currentUser={currentUser || { name: 'Portal User', role: 'student' }}
                onLogout={handleLogout}
                onGoToWebsite={() => {
                  setViewState('page');
                  updateHash(currentPage);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              />
            </div>
          )}
        </>
      )}

      {/* 3. PUBLIC SCHOOL WEBPAGES */}
      {viewState === 'page' && (
        <>
          {/* Top Banner Notice when logged in */}
          {isLoggedIn && (
            <div className="bg-amber-400 text-slate-950 px-4 py-1.5 text-xs font-bold text-center flex items-center justify-center gap-2 shadow-xs">
              <span>Logged in as {currentUser?.name} ({currentUser?.role})</span>
              <span>•</span>
              <button
                onClick={() => {
                  setViewState('portal');
                  updateHash('portal');
                }}
                className="underline hover:text-emerald-950 font-black cursor-pointer"
              >
                {currentUser?.role === 'admin' ? 'Open Admin Console' : 'Open Student Portal Dashboard'}
              </button>
            </div>
          )}

          {/* Primary Navigation Header */}
          <Header
            currentPage={currentPage}
            onNavigate={handleNavigate}
            isLoggedIn={isLoggedIn}
            currentUser={currentUser}
            onOpenPortal={handleOpenPortalLogin}
            onLogout={handleLogout}
            isPortalView={false}
            onTogglePortalView={handleTogglePortalView}
            onOpenTTS={() => setIsTTSOpen(true)}
          />

          {/* Main Page Body */}
          <main className="flex-1">
            {currentPage === 'home' && (
              <HomePage
                onNavigate={handleNavigate}
                onOpenPortal={handleOpenPortalLogin}
                onOpenTTS={() => setIsTTSOpen(true)}
                onOpenVisualizer={() => setIsVisualizerOpen(true)}
              />
            )}

            {currentPage === 'about' && (
              <AboutPage
                onNavigate={handleNavigate}
                onOpenTTS={() => setIsTTSOpen(true)}
              />
            )}

            {currentPage === 'academics' && (
              <AcademicsPage onNavigate={handleNavigate} />
            )}

            {currentPage === 'admissions' && (
              <AdmissionsPage onNavigate={handleNavigate} />
            )}

            {currentPage === 'campus-life' && (
              <CampusLifePage
                onNavigate={handleNavigate}
                onOpenVisualizer={() => setIsVisualizerOpen(true)}
                currentUser={currentUser}
                onOpenLogin={handleOpenPortalLogin}
              />
            )}

            {currentPage === 'alumni' && (
              <AlumniPage onNavigate={handleNavigate} />
            )}

            {currentPage === 'contact' && (
              <ContactPage onNavigate={handleNavigate} />
            )}
          </main>

          {/* Comprehensive Footer */}
          <Footer
            onNavigate={handleNavigate}
            onOpenPortal={handleOpenPortalLogin}
          />
        </>
      )}



      {/* Floating Gemini AI Counselor Chatbot */}
      <GeminiChatbot />

      {/* Text-to-Speech (gemini-3.8-flash-tts) Modal */}
      <TTSPlayer
        isOpen={isTTSOpen}
        onClose={() => setIsTTSOpen(false)}
      />

      {/* High-Resolution Campus Visualizer (gemini-3-pro-image-preview 1K, 2K, 4K) Modal */}
      <CampusVisualizer
        isOpen={isVisualizerOpen}
        onClose={() => setIsVisualizerOpen(false)}
      />
    </div>
  );
}
