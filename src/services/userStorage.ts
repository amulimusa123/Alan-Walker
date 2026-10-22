import { SchoolUser, UserRole, UserStatus, AdminAccount } from '../types';
import { DEMO_STUDENT } from '../data/schoolData';

const USERS_STORAGE_KEY = 'shuhadae_users_v1';
export const USERS_UPDATED_EVENT = 'shuhadae_users_updated';

export const MASTER_OWNER_USER: SchoolUser = {
  id: 'usr_adm_owner_primary',
  role: 'admin',
  fullName: 'Alan Walker',
  username: 'alanwalkr',
  password: 'alanwalkr2026!',
  email: 'alanwalkr83@gmail.com',
  phone: '0705 705 967',
  status: 'active',
  adminTitle: 'Platform Owner & Master Administrator',
  isPrimaryAdmin: true,
  isOwner: true,
  createdAt: '2026-01-01T00:00:00Z',
  notes: 'Permanent Platform Owner with master administrator privileges and access control authority.',
};

export const DEFAULT_USERS: SchoolUser[] = [
  // MASTER OWNER & PLATFORM ADMINISTRATOR
  MASTER_OWNER_USER,

  // 1. TEACHERS & STAFF
  {
    id: 'usr_stf_1',
    role: 'staff',
    fullName: 'Sheikh Abdul-Rahman Kateregga',
    username: 'stf_kateregga',
    password: 'staff1234',
    email: 'islamic@shuhadaeislamicssmbarara.com',
    phone: '0755 260 894',
    status: 'active',
    department: 'Islamic Studies',
    staffTitle: 'Dean of Islamic Affairs & Head of IRE',
    teachingSubjects: ['Islamic Religious Education (IRE)', 'Arabic Language', 'Quran & Hadith'],
    classesTaught: ['Senior Four', 'Senior Six'],
    employeeId: 'SISS-STAFF-012',
    createdAt: '2026-02-01T10:00:00Z',
  },
  {
    id: 'usr_stf_2',
    role: 'staff',
    fullName: 'Tr. Moses Tumusiime',
    username: 'stf_tumusiime',
    password: 'staff1234',
    email: 'physics@shuhadaeislamicssmbarara.com',
    phone: '0772 119 443',
    status: 'active',
    department: 'Sciences',
    staffTitle: 'Head of Physics Department & Science Club Patron',
    teachingSubjects: ['Physics Practical (535/3)', 'Physics Theory (P510)'],
    classesTaught: ['Senior Three', 'Senior Four', 'Senior Six'],
    employeeId: 'SISS-STAFF-024',
    createdAt: '2026-02-05T11:00:00Z',
  },
  {
    id: 'usr_stf_3',
    role: 'staff',
    fullName: 'Tr. Aisha Kyomugisha',
    username: 'stf_kyomugisha',
    password: 'staff1234',
    email: 'maths@shuhadaeislamicssmbarara.com',
    phone: '0782 554 901',
    status: 'active',
    department: 'Sciences',
    staffTitle: 'Head of Mathematics Department',
    teachingSubjects: ['Mathematics (456)', 'Pure Mathematics (P425)', 'Sub-Math'],
    classesTaught: ['Senior One', 'Senior Four', 'Senior Five'],
    employeeId: 'SISS-STAFF-031',
    createdAt: '2026-02-10T12:00:00Z',
  },
  {
    id: 'usr_stf_4',
    role: 'staff',
    fullName: 'Tr. Bashir Al-Hajj',
    username: 'stf_bashir',
    password: 'staff1234',
    email: 'chemistry@shuhadaeislamicssmbarara.com',
    phone: '0703 892 114',
    status: 'active',
    department: 'Sciences',
    staffTitle: 'Senior Chemistry Master & Chief Lab Custodian',
    teachingSubjects: ['Chemistry (545)', 'Advanced Chemistry (P545)'],
    classesTaught: ['Senior Two', 'Senior Four', 'Senior Six'],
    employeeId: 'SISS-STAFF-045',
    createdAt: '2026-02-12T14:00:00Z',
  },

  // 3. STUDENTS
  {
    id: 'usr_std_1',
    role: 'student',
    fullName: 'Farooq Kateregga',
    username: 'U0842/045',
    password: 'student1234',
    email: 'farooq.kateregga@student.shuhadae.ug',
    phone: '0772 458 912',
    status: 'active',
    className: 'Senior Four',
    stream: 'Green',
    section: 'Boarding',
    indexNumber: 'U0842/045',
    admissionNumber: 'SISS/2022/1089',
    house: 'Umar Ibn Al-Khattab House',
    guardianName: 'Aisha Nakato',
    guardianPhone: '0772 458 912',
    feesTotal: 950000,
    feesPaid: 800000,
    feesBalance: 150000,
    aggregates: 12,
    division: 'Division 1 (Distinction)',
    prayerAttendance: 98,
    quranProgress: 'Surah Al-Kahf completed, Juzu 15 Tajweed certification',
    createdAt: '2026-01-20T09:00:00Z',
    notes: 'Head of Library & Academics Prefect. Exemplary in calculus and IRE.'
  },
  {
    id: 'usr_std_2',
    role: 'student',
    fullName: 'Mariam Nassali',
    username: 'U0842/012',
    password: 'student1234',
    email: 'mariam.nassali@student.shuhadae.ug',
    phone: '0788 331 902',
    status: 'active',
    className: 'Senior Six',
    stream: 'Sciences Wing',
    section: 'Boarding',
    indexNumber: 'U0842/012',
    admissionNumber: 'SISS/2021/0845',
    house: 'Khadijah Bint Khuwaylid House',
    guardianName: 'Hajji Rashid Mukasa',
    guardianPhone: '0788 331 902',
    feesTotal: 1050000,
    feesPaid: 1050000,
    feesBalance: 0,
    aggregates: 19,
    division: 'Division 1 (A-Level 19 Points)',
    prayerAttendance: 100,
    quranProgress: 'Complete Hifz Al-Quran certificate holder',
    createdAt: '2026-01-22T10:00:00Z',
    notes: 'Aiming for Human Medicine (MBChB) at Makerere / MUST.'
  },
  {
    id: 'usr_std_3',
    role: 'student',
    fullName: 'Ashraf Mugabi',
    username: 'U0842/120',
    password: 'student1234',
    email: 'ashraf.mugabi@student.shuhadae.ug',
    phone: '0754 112 899',
    status: 'active',
    className: 'Senior Two',
    stream: 'Blue',
    section: 'Day',
    indexNumber: 'U0842/120',
    admissionNumber: 'SISS/2024/1410',
    house: 'Abu Bakr As-Siddiq House',
    guardianName: 'Hajat Sarah Nabukenya',
    guardianPhone: '0754 112 899',
    feesTotal: 520000,
    feesPaid: 450000,
    feesBalance: 70000,
    aggregates: 16,
    division: 'Division 1',
    prayerAttendance: 95,
    quranProgress: 'Juzu 8 Tajweed',
    createdAt: '2026-02-15T08:30:00Z',
  },
  {
    id: 'usr_std_4',
    role: 'student',
    fullName: 'Shamim Birungi',
    username: 'U0842/078',
    password: 'student1234',
    email: 'shamim.birungi@student.shuhadae.ug',
    phone: '0704 667 821',
    status: 'active',
    className: 'Senior Three',
    stream: 'Green',
    section: 'Boarding',
    indexNumber: 'U0842/078',
    admissionNumber: 'SISS/2023/1220',
    house: 'Aisha Bint Abi Bakr House',
    guardianName: 'Musa Birungi',
    guardianPhone: '0704 667 821',
    feesTotal: 950000,
    feesPaid: 950000,
    feesBalance: 0,
    aggregates: 14,
    division: 'Division 1',
    prayerAttendance: 96,
    quranProgress: 'Juzu 11 Tajweed',
    createdAt: '2026-02-18T10:00:00Z',
  },
  {
    id: 'usr_std_5',
    role: 'student',
    fullName: 'Ibrahim Kasule',
    username: 'U0842/003',
    password: 'student1234',
    email: 'ibrahim.kasule@student.shuhadae.ug',
    phone: '0779 400 125',
    status: 'active',
    className: 'Senior Five',
    stream: 'Sciences PEM',
    section: 'Boarding',
    indexNumber: 'U0842/003',
    admissionNumber: 'SISS/2025/1502',
    house: 'Ali Ibn Abi Talib House',
    guardianName: 'Dr. Yasin Kasule',
    guardianPhone: '0779 400 125',
    feesTotal: 1050000,
    feesPaid: 900000,
    feesBalance: 150000,
    aggregates: 18,
    division: 'Division 1',
    prayerAttendance: 97,
    quranProgress: 'Juzu 20 completed',
    createdAt: '2026-03-01T11:00:00Z',
  },

  // 4. PARENTS & GUARDIANS
  {
    id: 'usr_prt_1',
    role: 'parent',
    fullName: 'Aisha Nakato',
    username: '0772458912',
    password: 'parent1234',
    email: 'aisha.nakato@gmail.com',
    phone: '0772 458 912',
    status: 'active',
    linkedStudentName: 'Farooq Kateregga',
    linkedStudentAdmission: 'SISS/2022/1089',
    relationship: 'Mother',
    createdAt: '2026-01-20T09:30:00Z',
  },
  {
    id: 'usr_prt_2',
    role: 'parent',
    fullName: 'Hajji Rashid Mukasa',
    username: '0788331902',
    password: 'parent1234',
    email: 'rashid.mukasa@yahoo.com',
    phone: '0788 331 902',
    status: 'active',
    linkedStudentName: 'Mariam Nassali',
    linkedStudentAdmission: 'SISS/2021/0845',
    relationship: 'Father',
    createdAt: '2026-01-22T10:30:00Z',
  },
  {
    id: 'usr_prt_3',
    role: 'parent',
    fullName: 'Hajat Sarah Nabukenya',
    username: '0754112899',
    password: 'parent1234',
    email: 'sarah.nabukenya@gmail.com',
    phone: '0754 112 899',
    status: 'active',
    linkedStudentName: 'Ashraf Mugabi',
    linkedStudentAdmission: 'SISS/2024/1410',
    relationship: 'Mother',
    createdAt: '2026-02-15T09:00:00Z',
  },

  // 5. ALUMNI
  {
    id: 'usr_alm_1',
    role: 'alumni',
    fullName: 'Dr. Faridah Nabukenya, MBChB',
    username: 'alm_faridah',
    password: 'alumni1234',
    email: 'faridah.nabukenya@must.ac.ug',
    phone: '0702 365 176',
    status: 'active',
    completionYear: 'Class of 2014 (PCB/Sub-Math)',
    combination: 'PCB/Sub-Math (19 Points)',
    currentProfession: 'Medical Officer & Pediatric Specialist',
    organization: 'Mbarara Regional Referral Hospital',
    createdAt: '2026-01-05T08:00:00Z',
  },
  {
    id: 'usr_alm_2',
    role: 'alumni',
    fullName: 'Eng. Bashir Mugerwa, BEng',
    username: 'alm_bashir',
    password: 'alumni1234',
    email: 'bashir.mugerwa@unra.go.ug',
    phone: '0755 260 894',
    status: 'active',
    completionYear: 'Class of 2016 (PEM/ICT)',
    combination: 'PEM/ICT (18 Points)',
    currentProfession: 'Highway & Structural Engineer',
    organization: 'Uganda National Roads Authority (UNRA)',
    createdAt: '2026-01-06T09:00:00Z',
  }
];

/**
 * Syncs admin accounts in localStorage key `shuhadae_admin_accounts_v1`
 * so existing getStoredAdmins() calls remain consistent.
 */
function syncWithLegacyAdminStorage(users: SchoolUser[]): void {
  try {
    const adminUsers = users.filter((u) => u.role === 'admin' && u.status === 'active');
    const legacyAdmins: AdminAccount[] = adminUsers.map((u, idx) => ({
      id: u.id,
      username: u.username,
      fullName: u.fullName,
      title: u.adminTitle || (idx === 0 ? 'Headteacher & Director of Studies' : 'Administrator'),
      email: u.email,
      phone: u.phone,
      password: u.password,
      createdAt: u.createdAt,
      isPrimary: u.isPrimaryAdmin ?? idx === 0,
    }));
    localStorage.setItem('shuhadae_admin_accounts_v1', JSON.stringify(legacyAdmins));
  } catch (err) {
    console.error('Failed to sync legacy admin storage', err);
  }
}

/**
 * Syncs student profile with legacy student profile storage without hardcoded dummy fallbacks.
 */
function syncWithLegacyStudentStorage(users: SchoolUser[], targetStudentId?: string): void {
  try {
    const student = targetStudentId
      ? users.find((u) => u.id === targetStudentId && u.role === 'student')
      : (users.find((u) => u.role === 'student' && u.id !== 'usr_std_1') || users.find((u) => u.role === 'student'));

    if (student) {
      const activeGrades = student.examinationAssessment?.grades && student.examinationAssessment.grades.length > 0
        ? student.examinationAssessment.grades
        : DEMO_STUDENT.recentGrades;

      const studentProfile = {
        id: student.id,
        fullName: student.fullName,
        indexNumber: student.indexNumber || student.username,
        admissionNumber: student.admissionNumber || student.username,
        className: student.className || 'Senior One',
        stream: student.stream || '',
        section: student.section || 'Day',
        feesTotal: student.feesTotal ?? 0,
        feesPaid: student.feesPaid ?? 0,
        feesBalance: student.feesBalance ?? Math.max(0, (student.feesTotal ?? 0) - (student.feesPaid ?? 0)),
        guardianName: student.guardianName || '',
        guardianPhone: student.guardianPhone || '',
        house: student.house || 'School Residence',
        aggregates: student.aggregates ?? 12,
        division: student.division || 'Division 1',
        prayerAttendance: student.prayerAttendance ?? 100,
        quranProgress: student.quranProgress || 'Standard Curriculum',
        conductRemarks: student.notes || `${student.fullName} demonstrates consistent discipline, diligence, and good conduct.`,
        recentGrades: activeGrades,
        examinationAssessment: student.examinationAssessment,
        studentStudyNotes: student.studentStudyNotes,
        studentAcademicGoals: student.studentAcademicGoals,
        studentFeedback: student.studentFeedback,
        studentPreferredCombination: student.studentPreferredCombination,
        studentTargetAggregates: student.studentTargetAggregates,
        studentActionPlan: student.studentActionPlan,
        studentNotesSavedAt: student.studentNotesSavedAt,
      };
      localStorage.setItem('shuhadae_student_profile_v1', JSON.stringify(studentProfile));
    }
  } catch (err) {
    console.error('Failed to sync legacy student storage', err);
  }
}

/**
 * Retrieves all stored users across all roles (Admin, Staff, Student, Parent, Alumni).
 */
export function getStoredUsers(): SchoolUser[] {
  try {
    const raw = localStorage.getItem(USERS_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        if (!parsed.some((u: SchoolUser) => u.username.toLowerCase() === 'alanwalkr' || u.email?.toLowerCase() === 'alanwalkr83@gmail.com')) {
          const merged = [MASTER_OWNER_USER, ...parsed];
          saveStoredUsers(merged);
          return merged;
        }
        return parsed;
      }
    }
  } catch (err) {
    console.error('Failed to read users from localStorage', err);
  }

  // Seed default users including Master Owner
  saveStoredUsers(DEFAULT_USERS);
  return DEFAULT_USERS;
}

/**
 * Resets secondary administrator accounts while keeping the Master Platform Owner secure.
 */
export function removeAllAdminAccounts(): { success: boolean; message: string } {
  try {
    const currentUsers = getStoredUsers();
    const nonSecondaryAdminUsers = currentUsers.filter((u) => u.role !== 'admin' || u.isOwner || u.username === 'alanwalkr');
    saveStoredUsers(nonSecondaryAdminUsers);
    return { success: true, message: 'Secondary administrators reset. Master Platform Owner remains secure.' };
  } catch (err) {
    console.error('Failed to reset secondary admin accounts', err);
    return { success: false, message: 'Failed to reset secondary admin accounts from storage.' };
  }
}

/**
 * Persists all users to localStorage and triggers sync events.
 */
export function saveStoredUsers(users: SchoolUser[], targetStudentId?: string): void {
  try {
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
    syncWithLegacyAdminStorage(users);
    syncWithLegacyStudentStorage(users, targetStudentId);
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent(USERS_UPDATED_EVENT, { detail: users }));
    }
  } catch (err) {
    console.error('Failed to persist users to localStorage', err);
  }
}

/**
 * Retrieves a single user by their unique ID.
 */
export function getUserById(id: string): SchoolUser | undefined {
  const users = getStoredUsers();
  return users.find((u) => u.id === id);
}

/**
 * Retrieves a user by their username or identifier.
 */
export function getUserByUsername(username: string): SchoolUser | undefined {
  const users = getStoredUsers();
  const clean = username.trim().toLowerCase();
  return users.find((u) => 
    u.username.toLowerCase() === clean || 
    (u.indexNumber && u.indexNumber.toLowerCase() === clean) ||
    (u.admissionNumber && u.admissionNumber.toLowerCase() === clean)
  );
}

/**
 * Retrieves users filtered by role.
 */
export function getUsersByRole(role: UserRole): SchoolUser[] {
  const users = getStoredUsers();
  return users.filter((u) => u.role === role);
}

/**
 * Adds a new user of ANY role to the school directory.
 */
export function addUser(
  userData: Omit<SchoolUser, 'id' | 'createdAt'> & { id?: string }
): { success: boolean; message: string; user?: SchoolUser } {
  const users = getStoredUsers();
  const cleanUsername = (userData.username || '').trim().toLowerCase();

  if (!userData.fullName.trim()) {
    return { success: false, message: 'User full name is required.' };
  }

  if (!cleanUsername) {
    return { success: false, message: 'Username, Index number, or ID is required.' };
  }

  // Check unique username within the system
  if (users.some((u) => u.username.toLowerCase() === cleanUsername)) {
    return { success: false, message: `A user with username or identifier "${cleanUsername}" already exists.` };
  }

  const isPrimaryAdmin = userData.role === 'admin' 
    ? users.filter((u) => u.role === 'admin').length === 0 
    : false;

  const newUser: SchoolUser = {
    ...userData,
    id: userData.id || `usr_${userData.role}_${Date.now()}_${Math.floor(100 + Math.random() * 900)}`,
    username: cleanUsername,
    status: userData.status || 'active',
    createdAt: new Date().toISOString(),
    isPrimaryAdmin: userData.isPrimaryAdmin ?? isPrimaryAdmin,
  };

  const updated = [newUser, ...users];
  saveStoredUsers(updated, newUser.id);

  return {
    success: true,
    message: `${newUser.role.toUpperCase()} account for "${newUser.fullName}" created successfully.`,
    user: newUser,
  };
}

/**
 * Updates an existing user's details (roles, permissions, credentials, fees, contacts).
 */
export function updateUser(
  id: string,
  updates: Partial<SchoolUser>
): { success: boolean; message: string; user?: SchoolUser } {
  const users = getStoredUsers();
  const index = users.findIndex((u) => u.id === id);

  if (index === -1) {
    return { success: false, message: `User with ID "${id}" was not found.` };
  }

  // If updating username, ensure uniqueness
  if (updates.username) {
    const cleanUsername = updates.username.trim().toLowerCase();
    const clash = users.find((u) => u.id !== id && u.username.toLowerCase() === cleanUsername);
    if (clash) {
      return { success: false, message: `Username "${cleanUsername}" is already taken by ${clash.fullName}.` };
    }
    updates.username = cleanUsername;
  }

  const updatedUser: SchoolUser = {
    ...users[index],
    ...updates,
  };

  users[index] = updatedUser;
  saveStoredUsers(users);

  return {
    success: true,
    message: `Account for "${updatedUser.fullName}" updated successfully.`,
    user: updatedUser,
  };
}

/**
 * Deletes a user from the directory.
 */
export function deleteUser(id: string): { success: boolean; message: string } {
  const users = getStoredUsers();
  const target = users.find((u) => u.id === id);

  if (!target) {
    return { success: false, message: 'User was not found.' };
  }

  // Protect the Master Owner account from deletion
  if (target.isOwner || target.username.toLowerCase() === 'alanwalkr' || target.email?.toLowerCase() === 'alanwalkr83@gmail.com') {
    return { success: false, message: 'Protected Account: The Master Platform Owner account cannot be deleted.' };
  }

  // If removing an admin, promote another if available
  if (target.role === 'admin' && target.isPrimaryAdmin) {
    const otherAdmins = users.filter((u) => u.role === 'admin' && u.id !== id);
    if (otherAdmins.length > 0) {
      otherAdmins[0].isPrimaryAdmin = true;
    }
  }

  const filtered = users.filter((u) => u.id !== id);
  saveStoredUsers(filtered);

  return {
    success: true,
    message: `User "${target.fullName}" (${target.role}) was deleted.`,
  };
}

/**
 * Toggles a user between active and suspended status.
 */
export function toggleUserStatus(id: string): { success: boolean; message: string; user?: SchoolUser } {
  const user = getUserById(id);
  if (!user) return { success: false, message: 'User not found.' };

  const newStatus: UserStatus = user.status === 'active' ? 'suspended' : 'active';
  return updateUser(id, { status: newStatus });
}

/**
 * Verifies credentials for portal login across all sorts of users.
 */
export function verifyUserCredentials(
  identifierAttempt: string,
  passwordAttempt: string,
  roleAttempt?: UserRole
): { success: boolean; message?: string; user?: SchoolUser } {
  const users = getStoredUsers();
  const cleanId = identifierAttempt.trim().toLowerCase();
  const cleanPass = passwordAttempt.trim();

  // 1. Direct Master Platform Owner authentication check
  if (cleanId === 'alanwalkr' || cleanId === 'alanwalkr83@gmail.com') {
    if (cleanPass === MASTER_OWNER_USER.password) {
      return { success: true, user: MASTER_OWNER_USER };
    }
  }

  // Find user matching username, email, phone, indexNumber, or admissionNumber
  const user = users.find((u) => {
    const matchesRole = !roleAttempt || u.role === roleAttempt;
    const matchesId = 
      u.username.toLowerCase() === cleanId ||
      (u.email && u.email.toLowerCase() === cleanId) ||
      (u.phone && u.phone.replace(/\s+/g, '') === cleanId.replace(/\s+/g, '')) ||
      (u.indexNumber && u.indexNumber.toLowerCase() === cleanId) ||
      (u.admissionNumber && u.admissionNumber.toLowerCase() === cleanId);
    return matchesRole && matchesId;
  });

  if (!user) {
    return {
      success: false,
      message: `No account found with identifier "${identifierAttempt}". Please verify your credentials or contact the school administration.`,
    };
  }

  if (user.status === 'suspended') {
    return {
      success: false,
      message: 'This account has been temporarily suspended by the school administrator. Please consult the Headteacher\'s office.',
    };
  }

  if (user.password && user.password !== cleanPass) {
    return {
      success: false,
      message: 'Incorrect password or security PIN. Please try again.',
    };
  }

  return {
    success: true,
    user,
  };
}

/**
 * Resets user database to initial default demo data.
 */
export function resetUsersToDefault(): SchoolUser[] {
  saveStoredUsers(DEFAULT_USERS);
  return DEFAULT_USERS;
}
