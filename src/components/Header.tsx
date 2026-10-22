import React, { useState } from 'react';
import { PageType, UserRole } from '../types';
import { SCHOOL_INFO } from '../data/schoolData';
import { PWAInstallButton } from './PWAInstallButton';
import { ThemeToggle } from '../context/ThemeContext';
import { 
  Phone, 
  MessageSquare, 
  MapPin, 
  Menu, 
  X, 
  GraduationCap, 
  UserCheck, 
  Sparkles, 
  BookOpen, 
  Compass, 
  Users, 
  FileText,
  LogIn,
  LogOut,
  Volume2
} from 'lucide-react';

interface HeaderProps {
  currentPage: PageType;
  onNavigate: (page: PageType) => void;
  isLoggedIn: boolean;
  currentUser: { name: string; role: UserRole } | null;
  onOpenPortal: () => void;
  onLogout: () => void;
  isPortalView: boolean;
  onTogglePortalView: () => void;
  onOpenTTS: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentPage,
  onNavigate,
  isLoggedIn,
  currentUser,
  onOpenPortal,
  onLogout,
  isPortalView,
  onTogglePortalView,
  onOpenTTS,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks: { id: PageType; label: string; icon: React.ReactNode }[] = [
    { id: 'home', label: 'Home', icon: <Compass className="w-4 h-4" /> },
    { id: 'about', label: 'About Us', icon: <BookOpen className="w-4 h-4" /> },
    { id: 'academics', label: 'Academics', icon: <GraduationCap className="w-4 h-4" /> },
    { id: 'admissions', label: 'Admissions & Fees', icon: <FileText className="w-4 h-4" /> },
    { id: 'campus-life', label: 'Campus Life', icon: <Sparkles className="w-4 h-4" /> },
    { id: 'alumni', label: 'Alumni (OBs/OGs)', icon: <Users className="w-4 h-4" /> },
    { id: 'contact', label: 'Contact Us', icon: <MapPin className="w-4 h-4" /> },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-950/95 backdrop-blur-md border-b border-emerald-900/10 dark:border-emerald-800/30 shadow-sm transition-all">
      {/* Top Bar with Contacts, Islamic Heritage, Dark Mode Toggle & PWA Button */}
      <div className="bg-emerald-900 dark:bg-emerald-950 text-emerald-50 text-xs py-2 px-4 sm:px-6 transition-colors">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-3 sm:gap-6 flex-wrap">
            <span className="font-serif italic text-amber-300 flex items-center gap-1.5 font-medium">
              <span>بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</span>
              <span className="hidden sm:inline text-emerald-200">| {SCHOOL_INFO.arabicMotto}</span>
            </span>
            <div className="hidden md:flex items-center gap-4 text-emerald-200">
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-amber-400" />
                <span>Nyamitanga, Mbarara City (2km off Isingiro Rd)</span>
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>Admissions 2025/2026 Open</span>
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 ml-auto flex-wrap">
            {/* Theme Toggle (Light / Dark Mode) */}
            <ThemeToggle />

            {/* PWA Install Button */}
            <PWAInstallButton />

            <button
              onClick={onOpenTTS}
              className="hidden lg:flex items-center gap-1.5 bg-emerald-800/80 hover:bg-emerald-700 dark:bg-emerald-900/80 dark:hover:bg-emerald-800 text-emerald-100 hover:text-white px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors cursor-pointer border border-emerald-700/40"
              title="Listen to Audio Introduction (Gemini TTS)"
            >
              <Volume2 className="w-3.5 h-3.5 text-amber-300" />
              <span>Listen Speech</span>
            </button>

            <a
              href={`tel:${SCHOOL_INFO.phonePrimary.replace(/\s+/g, '')}`}
              className="flex items-center gap-1 text-emerald-100 hover:text-amber-300 transition-colors"
            >
              <Phone className="w-3.5 h-3.5 text-amber-400" />
              <span className="font-semibold">{SCHOOL_INFO.phonePrimary}</span>
            </a>

            <a
              href="https://wa.me/256705705967?text=Assalamu%20Alaikum.%20I%20am%20inquiring%20about%20admissions%20at%20Shuhadae%20Islamic%20Secondary%20School%20Mbarara."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 bg-emerald-600 hover:bg-emerald-500 text-white px-2.5 py-0.5 rounded-full font-medium transition-colors shadow-2xs"
            >
              <MessageSquare className="w-3 h-3 text-white" />
              <span>WhatsApp</span>
            </a>

            {/* Portal Switcher / Auth status */}
            {isLoggedIn ? (
              <div className="flex items-center gap-2 border-l border-emerald-700 pl-3">
                <button
                  onClick={onTogglePortalView}
                  className="bg-amber-400 hover:bg-amber-300 text-slate-900 font-bold px-2 py-0.5 rounded text-[11px] transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <UserCheck className="w-3 h-3" />
                  {isPortalView ? 'Website View' : currentUser?.role === 'admin' ? 'Admin Console' : 'My Portal'}
                </button>
                <button
                  onClick={onLogout}
                  className="text-emerald-300 hover:text-white cursor-pointer"
                  title="Logout"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <button
                onClick={onOpenPortal}
                className="flex items-center gap-1 bg-amber-500/90 hover:bg-amber-400 text-slate-950 font-bold px-2.5 py-0.5 rounded text-[11px] transition-colors cursor-pointer"
              >
                <LogIn className="w-3 h-3" />
                <span>Portal Login</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-20">
          {/* Logo & School Identity */}
          <div 
            onClick={() => {
              if (isPortalView) onTogglePortalView();
              onNavigate('home');
            }}
            className="flex items-center gap-3.5 cursor-pointer group"
          >
            <div className="w-13 h-13 rounded-2xl bg-gradient-to-br from-emerald-800 via-emerald-900 to-slate-950 p-2 shadow-md border-2 border-amber-400/60 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
              {/* Symbolic School Crescent & Book Crest */}
              <div className="text-center">
                <span className="text-amber-400 font-serif font-black text-xl leading-none block">S</span>
                <span className="text-[9px] tracking-widest text-emerald-200 font-semibold uppercase block">ISS</span>
              </div>
            </div>

            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight group-hover:text-emerald-800 dark:group-hover:text-emerald-400 transition-colors">
                  Shuhadae Islamic
                </span>
                <span className="hidden sm:inline-block bg-emerald-100 dark:bg-emerald-900/60 text-emerald-900 dark:text-emerald-200 border border-emerald-300 dark:border-emerald-700/60 font-bold text-[10px] px-2 py-0.5 rounded uppercase tracking-wider">
                  Secondary School
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium flex items-center gap-1.5 mt-0.5">
                <span className="text-emerald-700 dark:text-emerald-400 font-bold">Nyamitanga, Mbarara City</span>
                <span className="text-slate-300 dark:text-slate-600">•</span>
                <span className="italic text-slate-600 dark:text-slate-300">O & A-Level | UNEB U0842</span>
              </p>
            </div>
          </div>

          {/* Desktop Nav Items */}
          <nav className="hidden xl:flex items-center gap-1">
            {navLinks.map((link) => {
              const active = !isPortalView && currentPage === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => {
                    if (isPortalView) onTogglePortalView();
                    onNavigate(link.id);
                  }}
                  className={`px-3.5 py-2 rounded-lg text-sm font-semibold transition-all duration-150 flex items-center gap-1.5 cursor-pointer ${
                    active
                      ? 'bg-emerald-50 dark:bg-emerald-900/40 text-emerald-900 dark:text-emerald-200 border border-emerald-200 dark:border-emerald-700/50 font-bold shadow-xs'
                      : 'text-slate-600 dark:text-slate-300 hover:text-emerald-800 dark:hover:text-emerald-300 hover:bg-slate-100/70 dark:hover:bg-slate-900/80'
                  }`}
                >
                  {link.label}
                </button>
              );
            })}
          </nav>

          {/* Action CTAs */}
          <div className="hidden sm:flex items-center gap-2.5">
            <button
              onClick={() => {
                if (isPortalView) onTogglePortalView();
                onNavigate('admissions');
              }}
              className="relative inline-flex items-center justify-center px-4 py-2 text-sm font-bold text-white transition-all bg-emerald-700 hover:bg-emerald-800 dark:bg-emerald-600 dark:hover:bg-emerald-500 rounded-xl shadow-sm hover:shadow-emerald-700/20 active:scale-95 cursor-pointer"
            >
              <span>Apply for S.1 / S.5</span>
            </button>

            {isLoggedIn ? (
              <button
                onClick={onTogglePortalView}
                className="px-3.5 py-2 text-xs font-bold rounded-xl border border-emerald-700 dark:border-emerald-600 text-emerald-800 dark:text-emerald-300 hover:bg-emerald-50 dark:hover:bg-emerald-950/60 transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <UserCheck className="w-4 h-4 text-emerald-700 dark:text-emerald-400" />
                <span>{isPortalView ? 'View Public Site' : 'Student Portal'}</span>
              </button>
            ) : (
              <button
                onClick={onOpenPortal}
                className="px-3.5 py-2 text-xs font-bold rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:border-emerald-600 dark:hover:border-emerald-500 hover:text-emerald-800 dark:hover:text-emerald-300 transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <LogIn className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                <span>Portal Gateway</span>
              </button>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <div className="flex items-center gap-2 xl:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-800 focus:outline-hidden cursor-pointer border border-transparent dark:border-slate-800"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="xl:hidden bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 px-4 pt-3 pb-6 shadow-xl animate-in slide-in-from-top-4 duration-200">
          <div className="grid grid-cols-1 gap-1 mb-4">
            {navLinks.map((link) => {
              const active = !isPortalView && currentPage === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => {
                    if (isPortalView) onTogglePortalView();
                    onNavigate(link.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl text-left text-sm font-semibold cursor-pointer ${
                    active
                      ? 'bg-emerald-50 dark:bg-emerald-900/40 text-emerald-900 dark:text-emerald-200 border-l-4 border-emerald-700 dark:border-emerald-500 font-bold'
                      : 'text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-900'
                  }`}
                >
                  <span className={`${active ? 'text-emerald-700 dark:text-emerald-400' : 'text-slate-400'}`}>
                    {link.icon}
                  </span>
                  <span>{link.label}</span>
                </button>
              );
            })}
          </div>

          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-col gap-2.5">
            {/* Theme Toggle in Mobile Menu */}
            <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs">
              <span className="font-semibold text-slate-700 dark:text-slate-300">Theme Appearance:</span>
              <ThemeToggle variant="pill" />
            </div>

            <button
              onClick={() => {
                if (isPortalView) onTogglePortalView();
                onNavigate('admissions');
                setMobileMenuOpen(false);
              }}
              className="w-full py-3 bg-emerald-700 hover:bg-emerald-800 dark:bg-emerald-600 dark:hover:bg-emerald-500 text-white font-bold rounded-xl text-center text-sm shadow-sm cursor-pointer"
            >
              Apply Now / Admissions 2025/2026
            </button>

            <button
              onClick={() => {
                onOpenPortal();
                setMobileMenuOpen(false);
              }}
              className="w-full py-2.5 bg-slate-900 dark:bg-slate-800 text-white font-semibold rounded-xl text-center text-sm flex items-center justify-center gap-2 cursor-pointer border dark:border-slate-700"
            >
              <LogIn className="w-4 h-4 text-amber-400" />
              <span>School Management Portal Login</span>
            </button>

            <div className="flex items-center justify-between px-2 pt-2 text-xs text-slate-500 dark:text-slate-400">
              <span>Tel: {SCHOOL_INFO.phonePrimary}</span>
              <a
                href="https://wa.me/256705705967"
                target="_blank"
                rel="noreferrer"
                className="text-emerald-700 dark:text-emerald-400 font-bold"
              >
                Chat on WhatsApp
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
