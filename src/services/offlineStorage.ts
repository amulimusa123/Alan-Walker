import { StudentProfile, UserRole, AdminAccount } from '../types';
import { DEMO_STUDENT } from '../data/schoolData';
import { getStoredUsers } from './userStorage';
import { getStoredExamSchedules } from './examStorage';

export interface OfflineAdmissionApplication {
  id: string;
  applicationNumber: string;
  studentName: string;
  gender: string;
  applyingFor: string;
  section: string;
  pleOrUceScore: string;
  previousSchool: string;
  guardianName: string;
  guardianPhone: string;
  guardianEmail: string;
  preferredCombination: string;
  submittedAt: string;
  isSynced: boolean;
  notes?: string;
}

export interface OfflineFeePayment {
  id: string;
  receiptNumber: string;
  studentIndex: string;
  amount: number;
  paymentMethod: string;
  referenceNumber: string;
  date: string;
  status: 'Confirmed' | 'Pending Verification';
}

const STORAGE_KEYS = {
  STUDENT_PROFILE: 'shuhadae_student_profile_v1',
  ADMISSIONS: 'shuhadae_admissions_queue_v1',
  PAYMENTS: 'shuhadae_fee_payments_v1',
  PRAYER_LOGS: 'shuhadae_prayer_logs_v1',
  ACTIVE_USER: 'shuhadae_active_session_v1',
  OFFLINE_CACHE_VERIFIED: 'shuhadae_cache_verified_v1',
  ADMIN_ACCOUNTS: 'shuhadae_admin_accounts_v1',
};

export const MASTER_SECURITY_PASSCODE = 'SHUHADAE-OWNER-2026';

export const MASTER_OWNER_ADMIN: AdminAccount = {
  id: 'adm_owner_primary',
  username: 'alanwalkr',
  fullName: 'Alan Walker',
  title: 'Platform Owner & Master Administrator',
  email: 'alanwalkr83@gmail.com',
  phone: '0705 705 967',
  password: 'alanwalkr2026!',
  createdAt: '2026-01-01T00:00:00Z',
  isPrimary: true,
  isOwner: true,
};

// Initialize default offline data if empty
export function initOfflineStorage(): void {
  try {
    // Seed and preserve the Master Owner admin account
    const existingAdmins = getStoredAdmins();
    if (!existingAdmins.some((a) => a.username.toLowerCase() === 'alanwalkr' || a.email?.toLowerCase() === 'alanwalkr83@gmail.com')) {
      const updatedAdmins = [MASTER_OWNER_ADMIN, ...existingAdmins];
      localStorage.setItem(STORAGE_KEYS.ADMIN_ACCOUNTS, JSON.stringify(updatedAdmins));
    }

    if (!localStorage.getItem(STORAGE_KEYS.STUDENT_PROFILE)) {
      localStorage.setItem(STORAGE_KEYS.STUDENT_PROFILE, JSON.stringify(DEMO_STUDENT));
    }
    if (!localStorage.getItem(STORAGE_KEYS.ADMISSIONS)) {
      localStorage.setItem(STORAGE_KEYS.ADMISSIONS, JSON.stringify([]));
    }
    if (!localStorage.getItem(STORAGE_KEYS.PAYMENTS)) {
      const defaultPayments: OfflineFeePayment[] = [
        {
          id: 'pay-1',
          receiptNumber: 'CENT-MBR-8420-01',
          studentIndex: DEMO_STUDENT.indexNumber,
          amount: 500000,
          paymentMethod: 'Centenary Bank Mbarara Branch',
          referenceNumber: 'DEP-842-99014',
          date: '2026-09-15',
          status: 'Confirmed',
        },
        {
          id: 'pay-2',
          receiptNumber: 'MOMO-SP-418290-02',
          studentIndex: DEMO_STUDENT.indexNumber,
          amount: 300000,
          paymentMethod: 'MTN SchoolPay (418290)',
          referenceNumber: 'MP-202609-8420',
          date: '2026-10-02',
          status: 'Confirmed',
        },
      ];
      localStorage.setItem(STORAGE_KEYS.PAYMENTS, JSON.stringify(defaultPayments));
    }
    // Seed users and exam schedules
    getStoredUsers();
    getStoredExamSchedules();
  } catch (err) {
    console.warn('LocalStorage initialization warning:', err);
  }
}

// Student Profile Offline Access
export function getStoredStudentProfile(): StudentProfile {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.STUDENT_PROFILE);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to read student profile from local storage', e);
  }
  return DEMO_STUDENT;
}

export function saveStoredStudentProfile(profile: StudentProfile): void {
  try {
    localStorage.setItem(STORAGE_KEYS.STUDENT_PROFILE, JSON.stringify(profile));
  } catch (e) {
    console.error('Failed to save student profile', e);
  }
}

// Admission Applications Offline Engine
export function getStoredAdmissions(): OfflineAdmissionApplication[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.ADMISSIONS);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to read admissions from storage', e);
  }
  return [];
}

export function saveOfflineAdmission(
  data: Omit<OfflineAdmissionApplication, 'id' | 'applicationNumber' | 'submittedAt' | 'isSynced'>
): OfflineAdmissionApplication {
  const existing = getStoredAdmissions();
  const timestamp = new Date().toISOString();
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  const applicationNumber = `SISS-${new Date().getFullYear()}-${randomSuffix}`;
  
  const newApp: OfflineAdmissionApplication = {
    ...data,
    id: `adm_${Date.now()}_${randomSuffix}`,
    applicationNumber,
    submittedAt: timestamp,
    isSynced: navigator.onLine,
  };

  existing.unshift(newApp);
  try {
    localStorage.setItem(STORAGE_KEYS.ADMISSIONS, JSON.stringify(existing));
  } catch (e) {
    console.error('Failed to persist admission application offline', e);
  }

  return newApp;
}

// Fee Payments Offline Engine
export function getStoredPayments(): OfflineFeePayment[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.PAYMENTS);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to read payments from storage', e);
  }
  return [];
}

export function saveOfflinePayment(payment: Omit<OfflineFeePayment, 'id' | 'receiptNumber'>): OfflineFeePayment {
  const existing = getStoredPayments();
  const randomNum = Math.floor(10000 + Math.random() * 90000);
  const receiptNumber = `REC-SISS-${randomNum}`;

  const newPayment: OfflineFeePayment = {
    ...payment,
    id: `pay_${Date.now()}`,
    receiptNumber,
  };

  existing.unshift(newPayment);
  try {
    localStorage.setItem(STORAGE_KEYS.PAYMENTS, JSON.stringify(existing));
    
    // Also update student fees balance
    const student = getStoredStudentProfile();
    student.feesPaid += payment.amount;
    student.feesBalance = Math.max(0, student.feesTotal - student.feesPaid);
    saveStoredStudentProfile(student);
  } catch (e) {
    console.error('Failed to persist payment', e);
  }

  return newPayment;
}

// Offline Session Tracking
export function getStoredSession(): { name: string; role: UserRole } | null {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEYS.ACTIVE_USER) || localStorage.getItem(STORAGE_KEYS.ACTIVE_USER);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to get session', e);
  }
  return null;
}

export function saveStoredSession(user: { name: string; role: UserRole }, rememberMe = true): void {
  try {
    const serialized = JSON.stringify(user);
    if (rememberMe) {
      localStorage.setItem(STORAGE_KEYS.ACTIVE_USER, serialized);
    }
    sessionStorage.setItem(STORAGE_KEYS.ACTIVE_USER, serialized);
  } catch (e) {
    console.error('Failed to save session', e);
  }
}

export function clearStoredSession(): void {
  try {
    localStorage.removeItem(STORAGE_KEYS.ACTIVE_USER);
    sessionStorage.removeItem(STORAGE_KEYS.ACTIVE_USER);
  } catch (e) {
    console.error('Failed to clear session', e);
  }
}

// Storage Diagnostics & Export Utility
export function getOfflineStorageDiagnostics(): {
  admissionsCount: number;
  paymentsCount: number;
  approxSizeKb: number;
  isReadyOffline: boolean;
} {
  let size = 0;
  for (const key in localStorage) {
    if (key.startsWith('shuhadae_')) {
      size += (localStorage[key]?.length || 0) * 2;
    }
  }

  return {
    admissionsCount: getStoredAdmissions().length,
    paymentsCount: getStoredPayments().length,
    approxSizeKb: Math.round(size / 1024),
    isReadyOffline: true,
  };
}

// Download Standalone Data Backup for USB flash drive / local disk
export function exportOfflineArchive(): void {
  const student = getStoredStudentProfile();
  const admissions = getStoredAdmissions();
  const payments = getStoredPayments();

  const backupData = {
    institution: 'Shuhadae Islamic Secondary School, Mbarara',
    unebCenter: 'U0842',
    exportedAt: new Date().toISOString(),
    studentRecords: student,
    admissionQueue: admissions,
    feeTransactions: payments,
  };

  const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(backupData, null, 2));
  const downloadAnchor = document.createElement('a');
  downloadAnchor.setAttribute('href', dataStr);
  downloadAnchor.setAttribute('download', `shuhadae_offline_backup_${new Date().toISOString().slice(0, 10)}.json`);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
}

// Download Standalone Single-File index.html Application
export async function downloadOfflineHtmlFile(): Promise<void> {
  try {
    const res = await fetch('/download/index.html');
    if (!res.ok) throw new Error('Network response not ok');
    const htmlText = await res.text();
    const blob = new Blob([htmlText], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'index.html';
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  } catch (err) {
    const a = document.createElement('a');
    a.href = '/download/index.html';
    a.download = 'index.html';
    document.body.appendChild(a);
    a.click();
    a.remove();
  }
}

// -----------------------------------------------------------------
// Admin Accounts System (Multi-Admin Supported with No Limit)
// -----------------------------------------------------------------
export const MAX_ADMIN_ACCOUNTS = 999;

export function getStoredAdmins(): AdminAccount[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.ADMIN_ACCOUNTS);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        if (!parsed.some((a) => a.username.toLowerCase() === 'alanwalkr' || a.email?.toLowerCase() === 'alanwalkr83@gmail.com')) {
          const merged = [MASTER_OWNER_ADMIN, ...parsed];
          localStorage.setItem(STORAGE_KEYS.ADMIN_ACCOUNTS, JSON.stringify(merged));
          return merged;
        }
        return parsed;
      }
    }
  } catch (e) {
    console.error('Failed to read admin accounts', e);
  }
  const initial = [MASTER_OWNER_ADMIN];
  try {
    localStorage.setItem(STORAGE_KEYS.ADMIN_ACCOUNTS, JSON.stringify(initial));
  } catch {}
  return initial;
}

export function getAdminCapacity(): { count: number; max: number; canAdd: boolean } {
  const admins = getStoredAdmins();
  return {
    count: admins.length,
    max: 999,
    canAdd: true,
  };
}

export function createAdminAccount(
  data: Omit<AdminAccount, 'id' | 'createdAt' | 'isPrimary'>,
  masterPasscode?: string
): { success: boolean; message: string; admin?: AdminAccount } {
  // Security Enforcement: Only someone with the Master Security Passkey can create an admin
  const cleanPasscode = (masterPasscode || '').trim();
  if (cleanPasscode !== MASTER_SECURITY_PASSCODE) {
    return {
      success: false,
      message: 'Access Denied: Admin creation requires the Master Security Passkey (SHUHADAE-OWNER-2026). Public self-registration is disabled.',
    };
  }

  const current = getStoredAdmins();
  const cleanUsername = (data.username || '').trim().toLowerCase();
  if (!cleanUsername) {
    return { success: false, message: 'Please provide an admin username or employee code.' };
  }

  if (current.some((a) => a.username.toLowerCase() === cleanUsername)) {
    return { success: false, message: `An administrator with username "${cleanUsername}" is already registered.` };
  }

  const newAdmin: AdminAccount = {
    ...data,
    username: cleanUsername,
    id: `adm_${Date.now()}_${Math.floor(100 + Math.random() * 900)}`,
    createdAt: new Date().toISOString(),
    isPrimary: false,
    isOwner: false,
  };

  const updated = [...current, newAdmin];
  try {
    localStorage.setItem(STORAGE_KEYS.ADMIN_ACCOUNTS, JSON.stringify(updated));
  } catch (e) {
    console.error('Failed to persist admin account', e);
    return { success: false, message: 'Local storage error while creating administrator.' };
  }

  // Attempt sync with server in background
  try {
    fetch('/api/admin/create', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'x-master-passcode': MASTER_SECURITY_PASSCODE,
      },
      body: JSON.stringify({ ...data, masterPasscode: MASTER_SECURITY_PASSCODE }),
    }).catch(() => {});
  } catch {
    // Offline mode
  }

  return {
    success: true,
    message: `Administrator account for "${newAdmin.fullName}" (${newAdmin.title}) created successfully.`,
    admin: newAdmin,
  };
}

export function deleteAdminAccount(adminId: string): { success: boolean; message: string } {
  const current = getStoredAdmins();
  const target = current.find((a) => a.id === adminId);
  if (!target) {
    return { success: false, message: 'Administrator account not found.' };
  }

  // Protect the Master Owner account from deletion
  if (target.isOwner || target.username.toLowerCase() === 'alanwalkr' || target.email?.toLowerCase() === 'alanwalkr83@gmail.com') {
    return { success: false, message: 'Protected Account: The Master Platform Owner account cannot be deleted.' };
  }

  const filtered = current.filter((a) => a.id !== adminId);

  try {
    localStorage.setItem(STORAGE_KEYS.ADMIN_ACCOUNTS, JSON.stringify(filtered));
  } catch (e) {
    console.error('Failed to update admin accounts', e);
    return { success: false, message: 'Storage error while removing administrator.' };
  }

  try {
    fetch('/api/admin/delete', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ adminId }),
    }).catch(() => {});
  } catch {}

  return {
    success: true,
    message: `Administrator "${target.fullName}" removed. (${filtered.length} administrators active).`,
  };
}

export function removeAllAdmins(): { success: boolean; message: string } {
  try {
    // Keep Master Owner intact
    const preserved = [MASTER_OWNER_ADMIN];
    localStorage.setItem(STORAGE_KEYS.ADMIN_ACCOUNTS, JSON.stringify(preserved));
    return { success: true, message: 'Secondary administrators reset. Master Platform Owner remains active and secure.' };
  } catch (e) {
    console.error('Failed to clear admin accounts', e);
    return { success: false, message: 'Error resetting admin accounts.' };
  }
}

export function verifyAdminCredentials(
  usernameAttempt: string,
  passwordAttempt: string
): { success: boolean; message?: string; admin?: AdminAccount } {
  const current = getStoredAdmins();
  const cleanUser = usernameAttempt.trim().toLowerCase();
  const cleanPass = passwordAttempt.trim();

  // Match by username OR email
  const admin = current.find((a) => 
    a.username.toLowerCase() === cleanUser || 
    (a.email && a.email.toLowerCase() === cleanUser)
  );

  // Direct check for Owner
  if (!admin && (cleanUser === 'alanwalkr' || cleanUser === 'alanwalkr83@gmail.com')) {
    if (cleanPass === MASTER_OWNER_ADMIN.password) {
      return { success: true, admin: MASTER_OWNER_ADMIN };
    }
  }

  if (!admin) {
    return {
      success: false,
      message: `No authorized administrator account matching "${cleanUser}". Only verified school administrators and the Platform Owner may log in.`,
    };
  }

  if (admin.password && admin.password !== cleanPass) {
    return {
      success: false,
      message: 'Incorrect administrator security PIN or password. Please verify your credentials.',
    };
  }

  return { success: true, admin };
}
