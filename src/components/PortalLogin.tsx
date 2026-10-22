import React, { useState, useEffect } from 'react';
import { PageType, UserRole, AdminAccount } from '../types';
import { SCHOOL_INFO, DEMO_STUDENT } from '../data/schoolData';
import { 
  GraduationCap, 
  UserCheck, 
  ShieldCheck, 
  Lock, 
  ArrowRight, 
  Compass, 
  Phone, 
  AlertCircle,
  CheckCircle2,
  BookOpen,
  Briefcase,
  Home,
  FileText,
  Sparkles,
  Users,
  MapPin,
  UserPlus,
  Key,
  ShieldAlert,
  User,
  Calendar,
  Trash2
} from 'lucide-react';
import { 
  getStoredAdmins, 
  createAdminAccount, 
  verifyAdminCredentials, 
  getAdminCapacity, 
  removeAllAdmins,
  MASTER_SECURITY_PASSCODE,
  MASTER_OWNER_ADMIN
} from '../services/offlineStorage';
import { verifyUserCredentials, getStoredUsers } from '../services/userStorage';
import { ThemeToggle } from '../context/ThemeContext';

interface PortalLoginProps {
  onLoginSuccess: (user: { name: string; role: UserRole; username?: string; id?: string; user?: any }) => void;
  onContinueToWebsite: () => void;
  onNavigateToPage?: (page: PageType) => void;
}

export const PortalLogin: React.FC<PortalLoginProps> = ({
  onLoginSuccess,
  onContinueToWebsite,
  onNavigateToPage,
}) => {
  const [activeTab, setActiveTab] = useState<UserRole>('student');
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Admin Account Management states
  const [admins, setAdmins] = useState<AdminAccount[]>(getStoredAdmins());
  const [adminMode, setAdminMode] = useState<'login' | 'create'>('login');
  const [adminFullName, setAdminFullName] = useState('');
  const [adminUsername, setAdminUsername] = useState('');
  const [adminTitle, setAdminTitle] = useState('Director of Studies (DOS)');
  const [adminPhone, setAdminPhone] = useState('');
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [adminPasswordConfirm, setAdminPasswordConfirm] = useState('');
  const [adminSuccessMsg, setAdminSuccessMsg] = useState<string | null>(null);

  // Master Security Passkey Protection states
  const [masterPasscodeAttempt, setMasterPasscodeAttempt] = useState('');
  const [showPasscodeModal, setShowPasscodeModal] = useState(false);
  const [passcodeError, setPasscodeError] = useState<string | null>(null);

  useEffect(() => {
    const list = getStoredAdmins();
    setAdmins(list);
    // Keep adminMode permanently in 'login' to protect against unauthorized account creation
    setAdminMode('login');
  }, [activeTab]);

  const handleTabChange = (role: UserRole) => {
    setActiveTab(role);
    setError(null);
    setAdminSuccessMsg(null);
    setIdentifier('');
    setPassword('');
    setAdminMode('login');
    if (role === 'admin') {
      const current = getStoredAdmins();
      setAdmins(current);
    }
  };

  const handleUnlockWithPasscode = (e: React.FormEvent) => {
    e.preventDefault();
    setPasscodeError(null);
    if (masterPasscodeAttempt.trim() === MASTER_SECURITY_PASSCODE) {
      setShowPasscodeModal(false);
      setAdminMode('create');
      setError(null);
      setAdminSuccessMsg('Master Passkey verified. You may now provision an authorized administrator.');
    } else {
      setPasscodeError('Invalid Master Security Passkey. Public administrator registration is forbidden.');
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!identifier.trim()) {
      setError(
        activeTab === 'admin'
          ? 'Please enter your Admin Username or ID.'
          : 'Please provide your UNEB Index, Admission Number, or Phone.'
      );
      return;
    }
    if (!password.trim() || password.length < 4) {
      setError('Please enter a valid PIN or password (at least 4 characters).');
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      const cleanId = identifier.trim();

      if (activeTab === 'admin') {
        const verifyRes = verifyAdminCredentials(cleanId, password);
        if (!verifyRes.success || !verifyRes.admin) {
          setError(verifyRes.message || 'Invalid administrator username or security PIN.');
          return;
        }
        const adm = verifyRes.admin;
        onLoginSuccess({
          name: `${adm.fullName} (${adm.title})`,
          role: 'admin',
          username: adm.username,
          id: adm.id,
        });
        return;
      }

      // Check stored users directory first (Students, Parents, Teachers, Alumni)
      const userRes = verifyUserCredentials(cleanId, password, activeTab);
      if (userRes.user) {
        if (userRes.user.status === 'suspended') {
          setError('This account has been temporarily suspended by the school administration.');
          return;
        }
        onLoginSuccess({
          name: userRes.user.fullName,
          role: userRes.user.role,
          username: userRes.user.username,
          id: userRes.user.id,
          user: userRes.user,
        });
        return;
      }

      // Fallback for demo logins
      if (activeTab === 'student') {
        const studentName = cleanId.toUpperCase() === 'U0842/045' || cleanId.toLowerCase().includes('farooq')
          ? DEMO_STUDENT.fullName
          : `Student (${cleanId.toUpperCase()})`;
        onLoginSuccess({ name: studentName, role: 'student', username: cleanId });
      } else if (activeTab === 'parent') {
        onLoginSuccess({ name: cleanId.startsWith('07') ? `Guardian (${cleanId})` : cleanId, role: 'parent', username: cleanId });
      } else if (activeTab === 'staff') {
        onLoginSuccess({ name: `Staff Member (${cleanId})`, role: 'staff', username: cleanId });
      } else {
        onLoginSuccess({ name: `Alumnus (${cleanId})`, role: 'alumni', username: cleanId });
      }
    }, 500);
  };

  const handleCreateAdminSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setAdminSuccessMsg(null);

    if (!adminFullName.trim()) {
      setError('Please provide administrator full name.');
      return;
    }
    if (!adminUsername.trim()) {
      setError('Please choose an admin username or ID (e.g. admin, headteacher).');
      return;
    }
    if (!adminPassword || adminPassword.length < 4) {
      setError('Security PIN or password must be at least 4 characters long.');
      return;
    }
    if (adminPassword !== adminPasswordConfirm) {
      setError('Password confirmation does not match.');
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      const result = createAdminAccount({
        fullName: adminFullName.trim(),
        username: adminUsername.trim(),
        title: adminTitle.trim() || 'School Administrator',
        phone: adminPhone.trim() || undefined,
        email: adminEmail.trim() || undefined,
        password: adminPassword.trim(),
      }, masterPasscodeAttempt);

      if (!result.success || !result.admin) {
        setError(result.message);
        return;
      }

      setAdminSuccessMsg(result.message);
      const updated = getStoredAdmins();
      setAdmins(updated);

      // Auto-authenticate immediately into Admin Console!
      setTimeout(() => {
        onLoginSuccess({
          name: `${result.admin!.fullName} (${result.admin!.title})`,
          role: 'admin',
          username: result.admin!.username,
          id: result.admin!.id,
        });
      }, 1000);
    }, 500);
  };

  const directPages: { id: PageType; label: string; icon: React.ReactNode }[] = [
    { id: 'home', label: 'Home', icon: <Home className="w-3.5 h-3.5" /> },
    { id: 'about', label: 'About', icon: <BookOpen className="w-3.5 h-3.5" /> },
    { id: 'academics', label: 'Academics', icon: <GraduationCap className="w-3.5 h-3.5" /> },
    { id: 'admissions', label: 'Admissions & Fees', icon: <FileText className="w-3.5 h-3.5" /> },
    { id: 'campus-life', label: 'Campus Life', icon: <Sparkles className="w-3.5 h-3.5" /> },
    { id: 'alumni', label: 'Alumni', icon: <Users className="w-3.5 h-3.5" /> },
    { id: 'contact', label: 'Contact', icon: <MapPin className="w-3.5 h-3.5" /> },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-emerald-950 to-slate-950 flex flex-col justify-between py-6 px-4 sm:px-6 relative overflow-hidden">
      {/* Background Decorative Patterns */}
      <div className="absolute inset-0 opacity-5 pointer-events-none bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:24px_24px]"></div>
      <div className="absolute -top-32 -right-32 w-96 h-96 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>

      {/* Top Banner Navigation: Skip to Public Website */}
      <div className="max-w-4xl mx-auto w-full flex flex-col sm:flex-row items-center justify-between text-xs text-emerald-200/90 mb-4 gap-3 z-10">
        <div className="flex items-center gap-2">
          <span className="font-serif italic text-amber-300 font-bold text-sm">بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</span>
          <span className="hidden sm:inline text-slate-400">| Nyamitanga, Mbarara City</span>
        </div>

        {/* Quick webpage pills and theme switcher */}
        <div className="flex items-center gap-2 flex-wrap justify-center">
          <ThemeToggle variant="pill" />

          {onNavigateToPage && (
            <button
              onClick={() => onNavigateToPage('academics')}
              className="inline-flex items-center gap-1.5 bg-emerald-800/80 hover:bg-emerald-700 text-emerald-100 hover:text-white px-3.5 py-1.5 rounded-full font-bold text-xs border border-emerald-600/50 shadow-md transition-all active:scale-95 cursor-pointer"
            >
              <Calendar className="w-3.5 h-3.5 text-amber-300" />
              <span>Academic Calendar 2026</span>
            </button>
          )}

          <button
            onClick={onContinueToWebsite}
            className="inline-flex items-center gap-1.5 bg-amber-400 hover:bg-amber-300 text-slate-950 px-3.5 py-1.5 rounded-full font-bold shadow-md transition-all active:scale-95 cursor-pointer"
          >
            <Compass className="w-3.5 h-3.5" />
            <span>Enter Public School Website</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Direct Webpages Navigator Bar on Login Page */}
      <div className="max-w-4xl mx-auto w-full mb-4 z-10 hidden sm:block">
        <div className="bg-emerald-950/70 backdrop-blur-md rounded-2xl p-2 border border-emerald-800/60 shadow-lg flex items-center justify-between gap-1 overflow-x-auto text-[11px]">
          <span className="text-amber-300 font-bold px-3 shrink-0 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>Jump to Webpage:</span>
          </span>
          <div className="flex items-center gap-1 overflow-x-auto">
            {directPages.map((dp) => (
              <button
                key={dp.id}
                onClick={() => onNavigateToPage ? onNavigateToPage(dp.id) : onContinueToWebsite()}
                className="px-2.5 py-1 rounded-lg text-emerald-100 hover:text-white hover:bg-emerald-800/80 transition-colors flex items-center gap-1 whitespace-nowrap font-medium cursor-pointer"
              >
                {dp.icon}
                <span>{dp.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Authentication Card */}
      <div className="max-w-md w-full mx-auto bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-emerald-900/20 dark:border-slate-800 overflow-hidden z-10 transition-colors">
        {/* Header Branding */}
        <div className="bg-gradient-to-r from-emerald-900 via-emerald-800 to-slate-900 text-white p-6 sm:p-7 text-center relative border-b-4 border-amber-400">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-slate-950/80 border-2 border-amber-400 shadow-lg mb-3">
            <span className="text-amber-400 font-serif font-black text-2xl">S</span>
          </div>

          <h1 className="text-xl sm:text-2xl font-black tracking-tight leading-tight">
            {SCHOOL_INFO.name}
          </h1>
          <p className="text-emerald-200 text-xs font-semibold mt-1">
            Academic & Student Information Portal (ASIP)
          </p>
          <div className="inline-block mt-2 px-2.5 py-0.5 rounded-full bg-emerald-950/80 border border-emerald-700/60 text-[10px] text-amber-300 font-mono">
            UNEB Center No: {SCHOOL_INFO.unebCenterNumber} • Nyamitanga
          </div>
        </div>

        {/* Role Tabs: 5 Roles (Student, Parent, Staff, Alumni, Admin) */}
        <div className="grid grid-cols-5 bg-slate-100 dark:bg-slate-800/90 p-1.5 border-b border-slate-200 dark:border-slate-700 text-xs font-bold text-center">
          {[
            { role: 'student' as UserRole, label: 'Student', icon: <GraduationCap className="w-3.5 h-3.5" /> },
            { role: 'parent' as UserRole, label: 'Parent', icon: <UserCheck className="w-3.5 h-3.5" /> },
            { role: 'staff' as UserRole, label: 'Staff', icon: <Briefcase className="w-3.5 h-3.5" /> },
            { role: 'alumni' as UserRole, label: 'Alumni', icon: <BookOpen className="w-3.5 h-3.5" /> },
            { 
              role: 'admin' as UserRole, 
              label: 'Admin', 
              icon: <ShieldCheck className="w-3.5 h-3.5" /> 
            },
          ].map((tab) => (
            <button
              key={tab.role}
              onClick={() => handleTabChange(tab.role)}
              className={`py-2 px-1 rounded-xl flex flex-col items-center justify-center gap-1 transition-all relative cursor-pointer ${
                activeTab === tab.role
                  ? tab.role === 'admin'
                    ? 'bg-amber-400 text-slate-950 shadow-xs font-black'
                    : 'bg-white dark:bg-slate-900 text-emerald-900 dark:text-emerald-300 shadow-xs font-extrabold border border-slate-200/80 dark:border-slate-700'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-slate-700/50'
              }`}
            >
              {tab.icon}
              <span className="text-[10px] truncate max-w-full">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Card Body */}
        <div className="p-6 sm:p-7">
          {/* ============================================================== */}
          {/* ADMIN TAB CONTENT */}
          {/* ============================================================== */}
          {activeTab === 'admin' ? (
            <div>
              {/* Admin Mode Header */}
              <div className="mb-4 text-center">
                <h2 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center justify-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-amber-500" />
                  <span>
                    {adminMode === 'create'
                      ? 'Authorized Administrator Provisioning'
                      : 'School Administrator Gateway'}
                  </span>
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  {adminMode === 'create'
                    ? 'Provision authorized secondary administrators under Platform Owner authority.'
                    : 'Access restricted to authorized school executives and the Platform Owner.'}
                </p>
              </div>

              {/* Security Shield Banner: Explains Access Control */}
              <div className="mb-4 p-3 bg-slate-100 dark:bg-slate-800/90 rounded-2xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs space-y-1">
                <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white">
                  <Lock className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                  <span>Administrative Access Control Active</span>
                </div>
                <p className="text-[11px] leading-relaxed text-slate-600 dark:text-slate-400">
                  Public administrator self-registration is <strong>strictly locked</strong> to prevent unauthorized account creation. All privileged operations require verified administrative credentials or Master Owner authorization.
                </p>
              </div>

              {/* Platform Owner One-Click Fast Access Badge (For Alan Walker) */}
              {adminMode === 'login' && (
                <div className="mb-4 p-3.5 bg-gradient-to-r from-amber-500/10 via-amber-400/5 to-emerald-500/10 dark:from-amber-950/40 dark:to-emerald-950/40 rounded-2xl border border-amber-300/80 dark:border-amber-700/60 shadow-xs">
                  <div className="flex items-center justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
                        <span className="text-[10px] font-black uppercase tracking-wider text-amber-800 dark:text-amber-300">
                          Platform Owner & Super Admin
                        </span>
                      </div>
                      <div className="font-extrabold text-xs text-slate-900 dark:text-white mt-0.5">
                        Alan Walker <span className="font-mono text-slate-500 dark:text-slate-400 font-normal">(@alanwalkr)</span>
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400">
                        alanwalkr83@gmail.com
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        setIdentifier('alanwalkr');
                        setPassword('alanwalkr2026!');
                        setError(null);
                        setAdminSuccessMsg('Platform Owner credentials loaded. Click "Log in to Administrator Console" below.');
                      }}
                      className="px-3 py-1.5 bg-amber-400 hover:bg-amber-300 text-slate-950 rounded-xl text-xs font-black shadow-xs transition-all active:scale-95 cursor-pointer flex items-center gap-1 shrink-0"
                      title="Quick fill master administrator credentials"
                    >
                      <Key className="w-3.5 h-3.5 text-slate-950" />
                      <span>Owner Access</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Success Notification */}
              {adminSuccessMsg && (
                <div className="mb-4 p-3 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-200 text-xs rounded-xl flex items-center gap-2 border border-emerald-200 dark:border-emerald-800">
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
                  <span>{adminSuccessMsg}</span>
                </div>
              )}

              {/* Error Notification */}
              {error && (
                <div className="mb-4 p-3 rounded-xl bg-red-50 dark:bg-red-950/50 text-red-700 dark:text-red-300 text-xs flex items-center gap-2 border border-red-200 dark:border-red-800">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {/* ADMIN CREATION FORM */}
              {adminMode === 'create' ? (
                <form onSubmit={handleCreateAdminSubmit} className="space-y-3.5 text-xs">
                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Administrator Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={adminFullName}
                      onChange={(e) => setAdminFullName(e.target.value)}
                      placeholder="Enter administrator full name"
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-hidden focus:ring-2 focus:ring-emerald-600 font-medium"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2.5">
                    <div>
                      <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                        Admin Username <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={adminUsername}
                        onChange={(e) => setAdminUsername(e.target.value)}
                        placeholder="Enter admin username"
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-hidden focus:ring-2 focus:ring-emerald-600 font-mono"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                        Role Title <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={adminTitle}
                        onChange={(e) => setAdminTitle(e.target.value)}
                        className="w-full px-2.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-emerald-600 font-medium"
                      >
                        <option value="Director of Studies (DOS)">Director of Studies (DOS)</option>
                        <option value="Headteacher / Principal">Headteacher / Principal</option>
                        <option value="Deputy Headteacher (Academics)">Deputy Headteacher (Academics)</option>
                        <option value="Deputy Headteacher (Administration)">Deputy Headteacher (Administration)</option>
                        <option value="School Bursar & Finance Officer">School Bursar & Finance Officer</option>
                        <option value="System & IT Administrator">IT & Systems Administrator</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2.5">
                    <div>
                      <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        value={adminPhone}
                        onChange={(e) => setAdminPhone(e.target.value)}
                        placeholder="Enter phone number"
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-hidden focus:ring-2 focus:ring-emerald-600"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                        Email Address
                      </label>
                      <input
                        type="email"
                        value={adminEmail}
                        onChange={(e) => setAdminEmail(e.target.value)}
                        placeholder="Enter email address"
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-hidden focus:ring-2 focus:ring-emerald-600"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2.5">
                    <div>
                      <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                        Security PIN / Password <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="password"
                        required
                        value={adminPassword}
                        onChange={(e) => setAdminPassword(e.target.value)}
                        placeholder="Create security PIN"
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-hidden focus:ring-2 focus:ring-emerald-600"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                        Confirm PIN <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="password"
                        required
                        value={adminPasswordConfirm}
                        onChange={(e) => setAdminPasswordConfirm(e.target.value)}
                        placeholder="Confirm security PIN"
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-hidden focus:ring-2 focus:ring-emerald-600"
                      />
                    </div>
                  </div>

                  <div className="pt-2 flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setAdminMode('login');
                        setError(null);
                        setAdminSuccessMsg(null);
                      }}
                      className="w-1/3 py-2.5 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 font-bold rounded-xl text-xs transition-colors cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-2/3 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white font-bold rounded-xl text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98 disabled:opacity-75"
                    >
                      {isLoading ? (
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      ) : (
                        <>
                          <ShieldCheck className="w-4 h-4 text-amber-300" />
                          <span>Provision Authorized Admin</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              ) : (
                /* ADMIN LOGIN FORM */
                <form onSubmit={handleLogin} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                      Admin Username or ID
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        required
                        value={identifier}
                        onChange={(e) => setIdentifier(e.target.value)}
                        placeholder="Enter registered admin username"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-sm focus:outline-hidden focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 font-medium"
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                        Admin Security PIN / Password
                      </label>
                    </div>
                    <div className="relative">
                      <input
                        type="password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter administrator PIN"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-sm focus:outline-hidden focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 font-medium"
                      />
                      <Lock className="w-4 h-4 text-slate-400 absolute right-3.5 top-3" />
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-400">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" defaultChecked className="rounded text-emerald-600 focus:ring-emerald-500" />
                      <span>Keep signed in on this workstation</span>
                    </label>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-amber-300 font-bold rounded-xl text-sm shadow-md transition-all flex items-center justify-center gap-2 active:scale-98 disabled:opacity-75 cursor-pointer"
                  >
                    {isLoading ? (
                      <div className="w-5 h-5 border-2 border-amber-300 border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <>
                        <ShieldCheck className="w-4 h-4 text-amber-400" />
                        <span>Log in to Administrator Console</span>
                      </>
                    )}
                  </button>

                  {/* Master Security Passkey Gateway Trigger (Strictly Protected) */}
                  <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-700 text-center">
                    <button
                      type="button"
                      onClick={() => {
                        setShowPasscodeModal(true);
                        setPasscodeError(null);
                        setMasterPasscodeAttempt('');
                      }}
                      className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 hover:text-emerald-700 dark:hover:text-emerald-300 flex items-center justify-center gap-1.5 mx-auto transition-colors cursor-pointer"
                      title="Enter Master Security Passkey to provision administrator access"
                    >
                      <Lock className="w-3 h-3 text-slate-400" />
                      <span>Authorized Owner Provisioning & Recovery Gate</span>
                    </button>
                  </div>
                </form>
              )}

              {/* Master Passkey Verification Modal */}
              {showPasscodeModal && (
                <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
                  <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-sm w-full p-6 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4">
                    <div className="text-center space-y-1">
                      <div className="w-12 h-12 bg-amber-100 dark:bg-amber-950/80 rounded-2xl flex items-center justify-center mx-auto text-amber-600 dark:text-amber-400 mb-2 border border-amber-300 dark:border-amber-700">
                        <ShieldAlert className="w-6 h-6" />
                      </div>
                      <h3 className="font-black text-sm text-slate-900 dark:text-white">
                        Master Security Passkey Required
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        Administrator account provisioning is restricted. Please enter the Master Platform Passkey to continue.
                      </p>
                    </div>

                    {passcodeError && (
                      <div className="p-2.5 bg-red-50 dark:bg-red-950/50 text-red-700 dark:text-red-300 text-xs rounded-xl flex items-center gap-2 border border-red-200 dark:border-red-800">
                        <AlertCircle className="w-4 h-4 shrink-0" />
                        <span>{passcodeError}</span>
                      </div>
                    )}

                    <form onSubmit={handleUnlockWithPasscode} className="space-y-3">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                          Master Security Passkey
                        </label>
                        <input
                          type="password"
                          required
                          value={masterPasscodeAttempt}
                          onChange={(e) => setMasterPasscodeAttempt(e.target.value)}
                          placeholder="Enter Master Security Passkey"
                          className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white font-mono focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                        />
                        <div className="mt-1 text-[10px] text-slate-400">
                          Platform Owner default: <code className="font-mono text-amber-600 dark:text-amber-400 font-bold">SHUHADAE-OWNER-2026</code>
                        </div>
                      </div>

                      <div className="flex items-center justify-end gap-2 pt-2">
                        <button
                          type="button"
                          onClick={() => {
                            setShowPasscodeModal(false);
                            setPasscodeError(null);
                          }}
                          className="px-3 py-1.5 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 cursor-pointer"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="px-4 py-1.5 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 cursor-pointer shadow-xs active:scale-95"
                        >
                          Verify & Unlock
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* ============================================================== */
            /* STUDENT, PARENT, STAFF, ALUMNI LOGIN */
            /* ============================================================== */
            <div>
              <div className="mb-4 text-center">
                <h2 className="text-sm font-bold text-slate-800 dark:text-white">
                  {activeTab === 'student' && 'Student Academic Portal Access'}
                  {activeTab === 'parent' && 'Parent / Guardian Ward Tracker'}
                  {activeTab === 'staff' && 'Teaching & Administration Gateway'}
                  {activeTab === 'alumni' && 'OBs & OGs Network Portal'}
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  {activeTab === 'student' && 'Enter your UNEB Index No. or School Admission ID'}
                  {activeTab === 'parent' && 'Enter your registered Mobile Number or Ward Code'}
                  {activeTab === 'staff' && 'Enter your Staff ID and Academic PIN'}
                  {activeTab === 'alumni' && 'Enter your Alumni Registration ID or Year'}
                </p>
              </div>

              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    {activeTab === 'student' && 'UNEB Index / Admission Number'}
                    {activeTab === 'parent' && 'Registered Guardian Phone Number'}
                    {activeTab === 'staff' && 'Staff Employment Code'}
                    {activeTab === 'alumni' && 'Alumni ID / Phone Number'}
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      value={identifier}
                      onChange={(e) => setIdentifier(e.target.value)}
                      placeholder={
                        activeTab === 'student'
                          ? 'Enter UNEB index or admission number'
                          : activeTab === 'parent'
                          ? 'Enter registered guardian phone'
                          : activeTab === 'staff'
                          ? 'Enter staff employment code'
                          : 'Enter alumni ID or phone number'
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-sm focus:outline-hidden focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 font-medium"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                      Access PIN / Password
                    </label>
                    <button 
                      type="button" 
                      onClick={() => setError('Please call the School IT department on 0705 705 967 to reset your portal PIN.')} 
                      className="text-[11px] text-emerald-700 dark:text-emerald-400 hover:underline cursor-pointer"
                    >
                      Forgot PIN?
                    </button>
                  </div>
                  <div className="relative">
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your security PIN"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-sm focus:outline-hidden focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 font-medium"
                    />
                    <Lock className="w-4 h-4 text-slate-400 absolute right-3.5 top-3" />
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-400">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" defaultChecked className="rounded text-emerald-600 focus:ring-emerald-500" />
                    <span>Keep me signed in on this device</span>
                  </label>
                </div>

                {error && (
                  <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/50 text-red-700 dark:text-red-300 text-xs flex items-center gap-2 border border-red-200 dark:border-red-800">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 bg-emerald-800 hover:bg-emerald-900 text-white font-bold rounded-xl text-sm shadow-md transition-all flex items-center justify-center gap-2 active:scale-98 disabled:opacity-75 cursor-pointer"
                >
                  {isLoading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <>
                      <ShieldCheck className="w-4 h-4 text-amber-300" />
                      <span>Log in to {activeTab.toUpperCase()} Portal</span>
                    </>
                  )}
                </button>
              </form>
            </div>
          )}

          {/* Security Section */}
          <div className="mt-5 pt-4 border-t border-slate-200 dark:border-slate-700">
            <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400 font-semibold">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>Official ASIP Secured Gateway • UNEB Center U0842</span>
            </div>
          </div>
        </div>

        {/* Footer Gateway to Website */}
        <div className="bg-slate-50 dark:bg-slate-800/80 p-4 border-t border-slate-200 dark:border-slate-700 text-center">
          <p className="text-xs text-slate-600 dark:text-slate-300 mb-2">
            Looking for school admissions, fees, curriculum, or contact details?
          </p>
          <button
            onClick={onContinueToWebsite}
            className="w-full py-2.5 px-4 bg-slate-900 hover:bg-slate-800 dark:bg-emerald-700 dark:hover:bg-emerald-600 text-white font-bold rounded-xl text-xs transition-colors flex items-center justify-center gap-2 shadow-sm cursor-pointer"
          >
            <span>Proceed to Full Public School Website</span>
            <ArrowRight className="w-3.5 h-3.5 text-amber-400" />
          </button>
        </div>
      </div>

      {/* Bottom Information */}
      <div className="max-w-md mx-auto text-center text-xs text-slate-400 mt-6 z-10 space-y-1">
        <p>Shuhadae Islamic Secondary School • Nyamitanga, Mbarara City, Uganda</p>
        <p className="text-[11px] text-slate-500">
          Support Desk: <a href="tel:0705705967" className="text-emerald-400 hover:underline">{SCHOOL_INFO.phonePrimary}</a> | WhatsApp: +256 705 705 967
        </p>
      </div>
    </div>
  );
};
