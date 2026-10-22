import React, { useState, useEffect, useMemo } from 'react';
import { 
  AdminAccount, 
  StudentProfile, 
  SchoolUser, 
  UserRole, 
  UserStatus, 
  ExamSchedule, 
  ExamSchedulePaper,
  ExaminationAssessment,
  ExaminationAssessmentGrade 
} from '../types';
import { SCHOOL_INFO, DEMO_STUDENT } from '../data/schoolData';
import { 
  ShieldCheck, 
  Users, 
  UserPlus, 
  Trash2, 
  Key, 
  CheckCircle2, 
  AlertCircle, 
  FileText, 
  CreditCard, 
  Calendar, 
  Clock, 
  Download, 
  Printer, 
  BookOpen, 
  GraduationCap, 
  Camera, 
  LogOut, 
  Globe, 
  Eye, 
  Layers,
  Lock,
  Phone,
  Mail,
  User,
  Plus,
  Edit3,
  Search,
  Filter,
  Check,
  X,
  RefreshCw,
  Sparkles,
  Award,
  ChevronRight,
  Flame,
  CalendarDays,
  ShieldAlert,
  UserCheck,
  FileUp,
  Target,
  TrendingUp,
  BookmarkCheck
} from 'lucide-react';
import { 
  calculateUNEBGrade, 
  computeAggregatesAndDivision, 
  calculateRealClassRank, 
  recommendCombinationFromPerformance,
  O_LEVEL_PRESET_SUBJECTS,
  A_LEVEL_SCIENCE_PRESET_SUBJECTS,
  A_LEVEL_ARTS_PRESET_SUBJECTS
} from '../services/academicGrading';
import { 
  getStoredAdmissions, 
  getStoredPayments, 
  getStoredStudentProfile, 
  saveStoredStudentProfile,
  exportOfflineArchive, 
  saveOfflinePayment,
  OfflineAdmissionApplication,
  OfflineFeePayment
} from '../services/offlineStorage';
import { 
  getStoredUsers, 
  saveStoredUsers, 
  addUser, 
  updateUser, 
  deleteUser, 
  toggleUserStatus, 
  resetUsersToDefault,
  removeAllAdminAccounts,
  USERS_UPDATED_EVENT 
} from '../services/userStorage';
import { 
  getStoredExamSchedules, 
  saveStoredExamSchedules, 
  updateExamSchedule, 
  addExamSchedule, 
  deleteExamSchedule, 
  resetExamSchedulesToDefault,
  EXAMS_UPDATED_EVENT 
} from '../services/examStorage';
import { ExamCountdownTimer } from './ExamCountdownTimer';
import { CampusPhotoGallery } from './CampusPhotoGallery';

interface AdminDashboardProps {
  currentUser: { name: string; role: 'admin' | string };
  onLogout: () => void;
  onGoToWebsite: () => void;
  onViewStudentPortal: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  currentUser,
  onLogout,
  onGoToWebsite,
  onViewStudentPortal,
}) => {
  // Tabs
  const [activeTab, setActiveTab] = useState<'users' | 'exams' | 'admissions' | 'finance' | 'academics' | 'gallery'>('users');

  // School Users State
  const [users, setUsers] = useState<SchoolUser[]>(getStoredUsers());
  const [userRoleFilter, setUserRoleFilter] = useState<string>('all');
  const [userSearchTerm, setUserSearchTerm] = useState<string>('');

  // Exam Schedules State
  const [examSchedules, setExamSchedules] = useState<ExamSchedule[]>(getStoredExamSchedules());

  // Other school records
  const [admissions, setAdmissions] = useState<OfflineAdmissionApplication[]>(getStoredAdmissions());
  const [payments, setPayments] = useState<OfflineFeePayment[]>(getStoredPayments());
  const [student, setStudent] = useState<StudentProfile>(getStoredStudentProfile());

  // Academic Assessment Management State
  const studentUsers = useMemo(() => users.filter((u) => u.role === 'student'), [users]);
  const [selectedAcademicClassFilter, setSelectedAcademicClassFilter] = useState<string>('all');
  const [selectedAcademicStudentId, setSelectedAcademicStudentId] = useState<string>('');
  const [isAssessmentModalOpen, setIsAssessmentModalOpen] = useState<boolean>(false);
  const [assessmentTargetStudent, setAssessmentTargetStudent] = useState<SchoolUser | null>(null);
  const [assessmentForm, setAssessmentForm] = useState<{
    examTitle: string;
    term: string;
    academicYear: string;
    status: string;
    grades: ExaminationAssessmentGrade[];
    classTeacherRemarks: string;
    headteacherRemarks: string;
    fileAttachmentName: string;
  }>({
    examTitle: 'Term I Official UNEB Assessment 2026',
    term: 'Term I',
    academicYear: '2026',
    status: 'Promoted to S.5 UACE',
    grades: [],
    classTeacherRemarks: '',
    headteacherRemarks: '',
    fileAttachmentName: 'SISS-Official-Assessment-Slip-2026.pdf',
  });
  const [assessmentSuccessMsg, setAssessmentSuccessMsg] = useState<string | null>(null);
  const [assessmentErrorMsg, setAssessmentErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (!selectedAcademicStudentId && studentUsers.length > 0) {
      setSelectedAcademicStudentId(studentUsers[0].id);
    }
  }, [studentUsers, selectedAcademicStudentId]);

  // Modals & Forms
  const [showUserModal, setShowUserModal] = useState<boolean>(false);
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [userFormData, setUserFormData] = useState<Partial<SchoolUser>>({
    role: 'student',
    status: 'active',
    fullName: '',
    username: '',
    password: '',
    email: '',
    phone: '',
    className: 'Senior Four',
    stream: '',
    section: 'Boarding',
    house: '',
    guardianName: '',
    guardianPhone: '',
    feesTotal: 0,
    feesPaid: 0,
    feesBalance: 0,
    department: 'Sciences',
    staffTitle: '',
    adminTitle: 'School Administrator',
    completionYear: '',
    notes: '',
  });
  const [userModalError, setUserModalError] = useState<string | null>(null);
  const [userModalSuccess, setUserModalSuccess] = useState<string | null>(null);

  // User Deletion Modal
  const [userToDelete, setUserToDelete] = useState<SchoolUser | null>(null);
  const [userDeleteError, setUserDeleteError] = useState<string | null>(null);

  // Exam Countdown Modal
  const [showExamModal, setShowExamModal] = useState<boolean>(false);
  const [editingExamId, setEditingExamId] = useState<string | null>(null);
  const [examFormData, setExamFormData] = useState<Partial<ExamSchedule>>({
    name: '',
    shortLabel: '',
    examType: 'mock',
    targetClass: '',
    targetDate: '',
    briefingDate: '',
    venue: '',
    supervisor: '',
    papersCount: 0,
    highlightSubject: '',
    description: '',
    papers: [],
  });
  const [examModalError, setExamModalError] = useState<string | null>(null);
  const [examModalSuccess, setExamModalSuccess] = useState<string | null>(null);

  // Individual paper draft inside Exam modal
  const [paperDraft, setPaperDraft] = useState<ExamSchedulePaper>({
    date: '',
    time: '',
    paper: '',
    code: '',
  });

  // Exam Deletion Confirmation
  const [examToDelete, setExamToDelete] = useState<ExamSchedule | null>(null);

  // Sync event listeners
  useEffect(() => {
    const syncUsers = () => setUsers(getStoredUsers());
    const syncExams = () => setExamSchedules(getStoredExamSchedules());
    const syncStorage = () => {
      setUsers(getStoredUsers());
      setExamSchedules(getStoredExamSchedules());
      setAdmissions(getStoredAdmissions());
      setPayments(getStoredPayments());
      setStudent(getStoredStudentProfile());
    };

    window.addEventListener(USERS_UPDATED_EVENT, syncUsers);
    window.addEventListener(EXAMS_UPDATED_EVENT, syncExams);
    window.addEventListener('storage', syncStorage);
    return () => {
      window.removeEventListener(USERS_UPDATED_EVENT, syncUsers);
      window.removeEventListener(EXAMS_UPDATED_EVENT, syncExams);
      window.removeEventListener('storage', syncStorage);
    };
  }, []);

  // Filtered Users List
  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const matchesRole = userRoleFilter === 'all' || u.role === userRoleFilter;
      const term = userSearchTerm.toLowerCase().trim();
      if (!term) return matchesRole;

      const matchesSearch = 
        u.fullName.toLowerCase().includes(term) ||
        u.username.toLowerCase().includes(term) ||
        (u.email && u.email.toLowerCase().includes(term)) ||
        (u.phone && u.phone.includes(term)) ||
        (u.className && u.className.toLowerCase().includes(term)) ||
        (u.indexNumber && u.indexNumber.toLowerCase().includes(term)) ||
        (u.admissionNumber && u.admissionNumber.toLowerCase().includes(term)) ||
        (u.department && u.department.toLowerCase().includes(term)) ||
        (u.staffTitle && u.staffTitle.toLowerCase().includes(term));

      return matchesRole && matchesSearch;
    });
  }, [users, userRoleFilter, userSearchTerm]);

  // User Counts By Role
  const userCounts = useMemo(() => {
    return {
      all: users.length,
      student: users.filter((u) => u.role === 'student').length,
      parent: users.filter((u) => u.role === 'parent').length,
      staff: users.filter((u) => u.role === 'staff').length,
      admin: users.filter((u) => u.role === 'admin').length,
      alumni: users.filter((u) => u.role === 'alumni').length,
    };
  }, [users]);

  // -------------------------------------------------------------------------
  // USER MANAGEMENT HANDLERS
  // -------------------------------------------------------------------------
  const handleOpenAddUser = (initialRole: UserRole = 'student') => {
    setEditingUserId(null);
    setUserModalError(null);
    setUserModalSuccess(null);
    setUserFormData({
      role: initialRole,
      status: 'active',
      fullName: '',
      username: '',
      password: '',
      email: '',
      phone: '',
      className: initialRole === 'student' ? 'Senior One' : '',
      stream: '',
      section: initialRole === 'student' ? 'Day' : undefined,
      house: '',
      guardianName: '',
      guardianPhone: '',
      feesTotal: 0,
      feesPaid: 0,
      feesBalance: 0,
      department: 'Administration',
      staffTitle: '',
      adminTitle: 'School Administrator',
      linkedStudentName: '',
      relationship: 'Guardian',
      completionYear: '',
      currentProfession: '',
      organization: '',
      notes: '',
    });
    setShowUserModal(true);
  };

  const handleOpenEditUser = (user: SchoolUser) => {
    setEditingUserId(user.id);
    setUserModalError(null);
    setUserModalSuccess(null);
    setUserFormData({
      ...user,
      password: user.password || '',
    });
    setShowUserModal(true);
  };

  const handleSaveUser = (e: React.FormEvent) => {
    e.preventDefault();
    setUserModalError(null);
    setUserModalSuccess(null);

    if (!userFormData.fullName?.trim()) {
      setUserModalError('Full name is required.');
      return;
    }
    if (!userFormData.username?.trim()) {
      setUserModalError('Username, Admission number, or ID is required.');
      return;
    }

    if (editingUserId) {
      // Update existing user
      const res = updateUser(editingUserId, userFormData);
      if (!res.success) {
        setUserModalError(res.message);
        return;
      }
      setUserModalSuccess(res.message);
      setUsers(getStoredUsers());
      setTimeout(() => {
        setShowUserModal(false);
      }, 1000);
    } else {
      // Add new user
      const res = addUser({
        role: userFormData.role || 'student',
        fullName: userFormData.fullName.trim(),
        username: userFormData.username.trim(),
        password: userFormData.password?.trim() || 'shuhadae123',
        email: userFormData.email?.trim() || undefined,
        phone: userFormData.phone?.trim() || undefined,
        status: userFormData.status || 'active',
        className: userFormData.className,
        stream: userFormData.stream,
        section: userFormData.section,
        house: userFormData.house,
        indexNumber: userFormData.indexNumber,
        admissionNumber: userFormData.admissionNumber || userFormData.username,
        guardianName: userFormData.guardianName,
        guardianPhone: userFormData.guardianPhone,
        feesTotal: Number(userFormData.feesTotal) || 0,
        feesPaid: Number(userFormData.feesPaid) || 0,
        feesBalance: Math.max(0, (Number(userFormData.feesTotal) || 0) - (Number(userFormData.feesPaid) || 0)),
        department: userFormData.department,
        staffTitle: userFormData.staffTitle,
        adminTitle: userFormData.adminTitle,
        linkedStudentName: userFormData.linkedStudentName,
        linkedStudentAdmission: userFormData.linkedStudentAdmission,
        relationship: userFormData.relationship,
        completionYear: userFormData.completionYear,
        currentProfession: userFormData.currentProfession,
        organization: userFormData.organization,
        notes: userFormData.notes,
      });

      if (!res.success) {
        setUserModalError(res.message);
        return;
      }

      setUserModalSuccess(res.message);
      setUsers(getStoredUsers());
      setTimeout(() => {
        setShowUserModal(false);
      }, 1200);
    }
  };

  const handleToggleStatus = (id: string) => {
    const res = toggleUserStatus(id);
    if (res.success) {
      setUsers(getStoredUsers());
    }
  };

  const handleConfirmDeleteUser = () => {
    if (!userToDelete) return;
    const res = deleteUser(userToDelete.id);
    if (!res.success) {
      setUserDeleteError(res.message);
      return;
    }
    setUsers(getStoredUsers());
    setUserToDelete(null);
    setUserDeleteError(null);
  };

  // -------------------------------------------------------------------------
  // EXAM COUNTDOWN MANAGEMENT HANDLERS
  // -------------------------------------------------------------------------
  const handleOpenAddExam = () => {
    setEditingExamId(null);
    setExamModalError(null);
    setExamModalSuccess(null);
    setExamFormData({
      name: '',
      shortLabel: '',
      examType: 'mock',
      targetClass: '',
      targetDate: '',
      briefingDate: '',
      venue: '',
      supervisor: '',
      papersCount: 0,
      highlightSubject: '',
      description: '',
      papers: [],
    });
    setPaperDraft({ date: '', time: '', paper: '', code: '' });
    setShowExamModal(true);
  };

  const handleOpenEditExam = (exam: ExamSchedule) => {
    setEditingExamId(exam.id);
    setExamModalError(null);
    setExamModalSuccess(null);
    // Format date for datetime-local input (YYYY-MM-DDTHH:mm)
    let formattedDate = exam.targetDate;
    if (formattedDate.length > 16) {
      formattedDate = formattedDate.slice(0, 16);
    }
    setExamFormData({
      ...exam,
      targetDate: formattedDate,
      papers: exam.papers || [],
    });
    setPaperDraft({ date: '', time: '09:00 AM', paper: '', code: '' });
    setShowExamModal(true);
  };

  const handleAddPaperToExam = () => {
    if (!paperDraft.paper.trim() || !paperDraft.code.trim()) {
      setExamModalError('Please enter paper name and paper code.');
      return;
    }
    const newPaper: ExamSchedulePaper = {
      id: `p_${Date.now()}_${Math.floor(100 + Math.random() * 900)}`,
      paper: paperDraft.paper.trim(),
      code: paperDraft.code.trim(),
      date: paperDraft.date.trim() || 'Scheduled Day',
      time: paperDraft.time.trim() || '09:00 AM',
    };
    const currentPapers = examFormData.papers || [];
    setExamFormData({
      ...examFormData,
      papers: [...currentPapers, newPaper],
      papersCount: (examFormData.papersCount || currentPapers.length) + 1,
    });
    setPaperDraft({ date: '', time: '09:00 AM', paper: '', code: '' });
    setExamModalError(null);
  };

  const handleRemovePaperFromExam = (index: number) => {
    const currentPapers = [...(examFormData.papers || [])];
    currentPapers.splice(index, 1);
    setExamFormData({
      ...examFormData,
      papers: currentPapers,
      papersCount: Math.max(0, currentPapers.length),
    });
  };

  const handleSaveExam = (e: React.FormEvent) => {
    e.preventDefault();
    setExamModalError(null);
    setExamModalSuccess(null);

    if (!examFormData.name?.trim()) {
      setExamModalError('Exam title is required.');
      return;
    }
    if (!examFormData.shortLabel?.trim()) {
      setExamModalError('Short tab label is required (e.g. S.4 Mocks).');
      return;
    }
    if (!examFormData.targetDate) {
      setExamModalError('Target exam countdown date and time is required.');
      return;
    }

    if (editingExamId) {
      // Update existing exam
      const res = updateExamSchedule(editingExamId, {
        ...examFormData,
        papersCount: examFormData.papers?.length || examFormData.papersCount || 1,
      });
      if (!res.success) {
        setExamModalError(res.message);
        return;
      }
      setExamModalSuccess(res.message);
      setExamSchedules(getStoredExamSchedules());
      setTimeout(() => {
        setShowExamModal(false);
      }, 1000);
    } else {
      // Add new exam
      const res = addExamSchedule({
        name: examFormData.name.trim(),
        shortLabel: examFormData.shortLabel.trim(),
        examType: examFormData.examType || 'mock',
        targetClass: examFormData.targetClass || 'Senior Four (S.4 Candidates)',
        targetDate: examFormData.targetDate,
        briefingDate: examFormData.briefingDate || 'Pending circular',
        venue: examFormData.venue || 'Main Examination Hall',
        supervisor: examFormData.supervisor || 'Dean of Studies',
        papersCount: examFormData.papers?.length || Number(examFormData.papersCount) || 1,
        highlightSubject: examFormData.highlightSubject || 'Core Subjects',
        description: examFormData.description || 'Academic examination countdown.',
        status: 'scheduled',
        papers: examFormData.papers || [],
      });

      if (!res.success) {
        setExamModalError(res.message);
        return;
      }

      setExamModalSuccess(res.message);
      setExamSchedules(getStoredExamSchedules());
      setTimeout(() => {
        setShowExamModal(false);
      }, 1200);
    }
  };

  const handleConfirmDeleteExam = () => {
    if (!examToDelete) return;
    const res = deleteExamSchedule(examToDelete.id);
    if (res.success) {
      setExamSchedules(getStoredExamSchedules());
      setExamToDelete(null);
    }
  };

  // -------------------------------------------------------------------------
  // OFFICIAL EXAMINATION ASSESSMENT HANDLERS (ADMIN UPLOAD & CERTIFICATION)
  // -------------------------------------------------------------------------
  const handleOpenAssessmentModal = (target: SchoolUser) => {
    setAssessmentTargetStudent(target);
    setAssessmentErrorMsg(null);
    setAssessmentSuccessMsg(null);

    if (target.examinationAssessment && target.examinationAssessment.grades.length > 0) {
      setAssessmentForm({
        examTitle: target.examinationAssessment.examTitle || `${target.className || 'Senior Four'} Official Examination Assessment 2026`,
        term: target.examinationAssessment.term || 'Term I',
        academicYear: target.examinationAssessment.academicYear || '2026',
        status: target.examinationAssessment.status || 'Academic Term in Progress',
        grades: [...target.examinationAssessment.grades],
        classTeacherRemarks: target.examinationAssessment.classTeacherRemarks || target.notes || `${target.fullName} demonstrates consistent academic commitment and disciplined focus.`,
        headteacherRemarks: target.examinationAssessment.headteacherRemarks || `"Commendable progress and exemplary Islamic character." — Headteacher`,
        fileAttachmentName: target.examinationAssessment.fileAttachmentName || 'SISS-Official-Assessment-Slip-2026.pdf',
      });
    } else {
      // Default to standard O-Level preset with realistic starting grades
      const defaultGrades: ExaminationAssessmentGrade[] = O_LEVEL_PRESET_SUBJECTS.map((sub, i) => {
        const defaultScore = [84, 78, 88, 82, 75, 72, 79, 92, 85, 74][i % 10];
        const gradeInfo = calculateUNEBGrade(defaultScore);
        return {
          subject: sub,
          score: defaultScore,
          grade: gradeInfo.grade,
          remarks: gradeInfo.remarks,
        };
      });

      setAssessmentForm({
        examTitle: `${target.className || 'Senior Four'} Official Examination Assessment 2026`,
        term: 'Term I',
        academicYear: '2026',
        status: 'Division 1 Distinction - Promoted',
        grades: defaultGrades,
        classTeacherRemarks: `${target.fullName} demonstrates consistent diligence, sound discipline, and strong analytical capacity.`,
        headteacherRemarks: `"Masha'Allah! An outstanding academic performance and dedicated character." — Ustadh Sulaiman, Headteacher`,
        fileAttachmentName: 'SISS-Official-Assessment-Slip-2026.pdf',
      });
    }

    setIsAssessmentModalOpen(true);
  };

  const handleLoadPresetSubjects = (type: 'olevel' | 'sciences' | 'arts') => {
    let subjectNames = O_LEVEL_PRESET_SUBJECTS;
    if (type === 'sciences') subjectNames = A_LEVEL_SCIENCE_PRESET_SUBJECTS;
    if (type === 'arts') subjectNames = A_LEVEL_ARTS_PRESET_SUBJECTS;

    const grades: ExaminationAssessmentGrade[] = subjectNames.map((sub, i) => {
      const score = [82, 76, 85, 79, 74, 88, 80, 78, 84, 75][i % 10];
      const g = calculateUNEBGrade(score);
      return {
        subject: sub,
        score,
        grade: g.grade,
        remarks: g.remarks,
      };
    });

    setAssessmentForm((prev) => ({
      ...prev,
      grades,
    }));
  };

  const handleAssessmentGradeChange = (
    index: number,
    field: 'subject' | 'score' | 'remarks',
    value: any
  ) => {
    setAssessmentForm((prev) => {
      const updated = [...prev.grades];
      if (field === 'score') {
        const num = Math.max(0, Math.min(100, parseInt(value, 10) || 0));
        const gradeInfo = calculateUNEBGrade(num);
        updated[index] = {
          ...updated[index],
          score: num,
          grade: gradeInfo.grade,
          remarks: gradeInfo.remarks,
        };
      } else {
        updated[index] = {
          ...updated[index],
          [field]: value,
        };
      }
      return { ...prev, grades: updated };
    });
  };

  const handleAddAssessmentSubject = () => {
    const newGrade: ExaminationAssessmentGrade = {
      subject: 'New Subject',
      score: 75,
      grade: 'D2',
      remarks: 'Distinction 2 (Superior)',
    };
    setAssessmentForm((prev) => ({
      ...prev,
      grades: [...prev.grades, newGrade],
    }));
  };

  const handleRemoveAssessmentSubject = (index: number) => {
    setAssessmentForm((prev) => ({
      ...prev,
      grades: prev.grades.filter((_, i) => i !== index),
    }));
  };

  const handleSaveOfficialAssessment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!assessmentTargetStudent) return;
    if (assessmentForm.grades.length === 0) {
      setAssessmentErrorMsg('Please add at least one subject grade before publishing.');
      return;
    }

    const { aggregates, division } = computeAggregatesAndDivision(assessmentForm.grades);
    const newAssessment: ExaminationAssessment = {
      term: assessmentForm.term,
      academicYear: assessmentForm.academicYear,
      examTitle: assessmentForm.examTitle,
      status: assessmentForm.status,
      classTeacherRemarks: assessmentForm.classTeacherRemarks,
      headteacherRemarks: assessmentForm.headteacherRemarks,
      grades: assessmentForm.grades,
      uploadedAt: new Date().toISOString(),
      uploadedBy: currentUser.name || 'School Administrator',
      fileAttachmentName: assessmentForm.fileAttachmentName,
    };

    const res = updateUser(assessmentTargetStudent.id, {
      examinationAssessment: newAssessment,
      recentGrades: newAssessment.grades,
      aggregates,
      division,
    });

    if (res.success) {
      const updatedList = getStoredUsers();
      setUsers(updatedList);
      setAssessmentSuccessMsg(`Official Examination Assessment for "${assessmentTargetStudent.fullName}" published successfully! The student now has immediate read and write access.`);
      setTimeout(() => {
        setIsAssessmentModalOpen(false);
        setAssessmentSuccessMsg(null);
      }, 1500);
    } else {
      setAssessmentErrorMsg(res.message);
    }
  };

  const handleResetExams = () => {
    if (window.confirm('Reset all Mock and UNEB exam countdowns back to official defaults?')) {
      const reset = resetExamSchedulesToDefault();
      setExamSchedules(reset);
    }
  };

  const handleResetUsers = () => {
    if (window.confirm('Reset the user directory back to official demo users? All custom added users will be refreshed.')) {
      const reset = resetUsersToDefault();
      setUsers(reset);
    }
  };

  const handleRemoveAllAdminAccounts = () => {
    if (window.confirm('Are you sure you want to remove all administrator accounts and log out of the administrator console?')) {
      removeAllAdminAccounts();
      onLogout();
    }
  };

  // Helper for role badge styling
  const getRoleBadge = (role: UserRole) => {
    switch (role) {
      case 'admin':
        return { label: 'Administrator', bg: 'bg-purple-100 text-purple-900 border-purple-300' };
      case 'staff':
        return { label: 'Teacher / Staff', bg: 'bg-blue-100 text-blue-900 border-blue-300' };
      case 'student':
        return { label: 'Student', bg: 'bg-emerald-100 text-emerald-900 border-emerald-300' };
      case 'parent':
        return { label: 'Parent / Guardian', bg: 'bg-amber-100 text-amber-900 border-amber-300' };
      case 'alumni':
        return { label: 'Alumni', bg: 'bg-indigo-100 text-indigo-900 border-indigo-300' };
    }
  };

  // Helper for days left
  const calculateDaysLeft = (targetIso: string) => {
    const diff = new Date(targetIso).getTime() - Date.now();
    if (diff <= 0) return 'Underway / Concluded';
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    return `${days}d ${hours}h left`;
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800 pb-20">
      {/* Top Header */}
      <header className="bg-gradient-to-r from-slate-950 via-emerald-950 to-slate-900 text-white border-b-4 border-amber-400 sticky top-0 z-30 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border-2 border-amber-400 flex items-center justify-center font-serif font-black text-amber-300 shadow-inner">
              <ShieldCheck className="w-6 h-6 text-amber-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-extrabold text-sm sm:text-base leading-tight">
                  {SCHOOL_INFO.name}
                </h1>
                <span className="bg-amber-400 text-slate-950 text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider">
                  Super Admin Authority
                </span>
              </div>
              <p className="text-[11px] text-emerald-300 font-mono">
                UNEB Center No: {SCHOOL_INFO.unebCenterNumber} • Nyamitanga, Mbarara City
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={onViewStudentPortal}
              className="bg-emerald-900 hover:bg-emerald-800 text-emerald-100 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 border border-emerald-700 cursor-pointer shadow-xs"
              title="Preview what students and guardians see"
            >
              <Eye className="w-3.5 h-3.5 text-amber-300" />
              <span className="hidden sm:inline">Student Portal View</span>
            </button>

            <button
              onClick={onGoToWebsite}
              className="bg-slate-800 hover:bg-slate-700 text-slate-200 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 border border-slate-700 cursor-pointer"
            >
              <Globe className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline">Public Site</span>
            </button>

            <button
              onClick={onLogout}
              className="bg-red-950/80 hover:bg-red-900 text-red-200 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1 cursor-pointer border border-red-800"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Admin Subheader Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-6 pb-2">
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border-2 border-amber-500 flex items-center justify-center text-amber-600 font-black text-2xl shrink-0 shadow-sm">
              <ShieldCheck className="w-9 h-9" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-xl font-black text-slate-900">{currentUser.name}</h2>
                <span className="bg-emerald-100 text-emerald-900 text-xs px-3 py-0.5 rounded-full font-bold">
                  Authorized Administrator
                </span>
                <span className="bg-amber-100 text-amber-900 text-xs px-2.5 py-0.5 rounded-full font-bold border border-amber-300">
                  Full Authority: Users & Exam Countdowns
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1 flex flex-wrap items-center gap-x-4 gap-y-1">
                <span><strong>Authority:</strong> Edit/Add all users (students, staff, parents, admins, alumni)</span>
                <span><strong>Exams Control:</strong> Edit Mock & UNEB countdowns & timetables</span>
                <span><strong>Storage:</strong> Real-time Local & Cloud Sync</span>
              </p>
            </div>
          </div>

          {/* Quick Action Top Bar */}
          <div className="flex items-center gap-2 flex-wrap self-stretch md:self-auto border-t md:border-t-0 pt-4 md:pt-0">
            <button
              onClick={() => handleOpenAddUser('student')}
              className="px-4 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold shadow-sm transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-98"
            >
              <UserPlus className="w-4 h-4 text-amber-300" />
              <span>+ Add New User</span>
            </button>

            <button
              onClick={handleOpenAddExam}
              className="px-4 py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 rounded-xl text-xs font-black shadow-sm transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-98"
            >
              <Clock className="w-4 h-4 text-slate-950" />
              <span>+ Add Exam Countdown</span>
            </button>

            <button
              onClick={exportOfflineArchive}
              className="px-3 py-2.5 bg-slate-900 hover:bg-slate-800 text-amber-300 rounded-xl text-xs font-bold shadow-sm transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              title="Export complete database backup"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Backup (.json)</span>
            </button>
          </div>
        </div>

        {/* Administration Navigation Tabs */}
        <div className="flex items-center gap-2 mt-6 border-b border-slate-200 overflow-x-auto pb-1 text-xs font-bold">
          <button
            onClick={() => setActiveTab('users')}
            className={`px-4 py-2.5 rounded-t-xl transition-colors flex items-center gap-2 border-b-2 cursor-pointer ${
              activeTab === 'users'
                ? 'bg-white text-emerald-900 border-emerald-600 shadow-xs'
                : 'text-slate-600 hover:text-slate-900 border-transparent hover:bg-slate-200/50'
            }`}
          >
            <Users className="w-4 h-4 text-emerald-700" />
            <span>All Users & Accounts ({users.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('exams')}
            className={`px-4 py-2.5 rounded-t-xl transition-colors flex items-center gap-2 border-b-2 cursor-pointer ${
              activeTab === 'exams'
                ? 'bg-white text-emerald-900 border-emerald-600 shadow-xs'
                : 'text-slate-600 hover:text-slate-900 border-transparent hover:bg-slate-200/50'
            }`}
          >
            <Clock className="w-4 h-4 text-amber-600" />
            <span>Mock & UNEB Exam Countdowns ({examSchedules.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('admissions')}
            className={`px-4 py-2.5 rounded-t-xl transition-colors flex items-center gap-2 border-b-2 cursor-pointer ${
              activeTab === 'admissions'
                ? 'bg-white text-emerald-900 border-emerald-600 shadow-xs'
                : 'text-slate-600 hover:text-slate-900 border-transparent hover:bg-slate-200/50'
            }`}
          >
            <FileText className="w-4 h-4 text-emerald-700" />
            <span>Admissions Queue ({admissions.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('finance')}
            className={`px-4 py-2.5 rounded-t-xl transition-colors flex items-center gap-2 border-b-2 cursor-pointer ${
              activeTab === 'finance'
                ? 'bg-white text-emerald-900 border-emerald-600 shadow-xs'
                : 'text-slate-600 hover:text-slate-900 border-transparent hover:bg-slate-200/50'
            }`}
          >
            <CreditCard className="w-4 h-4 text-emerald-700" />
            <span>Fees & Finance Logs ({payments.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('academics')}
            className={`px-4 py-2.5 rounded-t-xl transition-colors flex items-center gap-2 border-b-2 cursor-pointer ${
              activeTab === 'academics'
                ? 'bg-white text-emerald-900 border-emerald-600 shadow-xs'
                : 'text-slate-600 hover:text-slate-900 border-transparent hover:bg-slate-200/50'
            }`}
          >
            <GraduationCap className="w-4 h-4 text-emerald-700" />
            <span>Student Profiles & Grades</span>
          </button>

          <button
            onClick={() => setActiveTab('gallery')}
            className={`px-4 py-2.5 rounded-t-xl transition-colors flex items-center gap-2 border-b-2 cursor-pointer ${
              activeTab === 'gallery'
                ? 'bg-white text-emerald-900 border-emerald-600 shadow-xs'
                : 'text-slate-600 hover:text-slate-900 border-transparent hover:bg-slate-200/50'
            }`}
          >
            <Camera className="w-4 h-4 text-emerald-700" />
            <span>Campus Photo Gallery & Uploads</span>
          </button>
        </div>

        {/* ========================================================================= */}
        {/* TAB 1: ALL SORTS OF USERS AUTHORITY (ADD, EDIT, DELETE, SUSPEND)           */}
        {/* ========================================================================= */}
        {activeTab === 'users' && (
          <div className="mt-6 space-y-6">
            {/* Quick Stats Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              <div 
                onClick={() => setUserRoleFilter('all')}
                className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
                  userRoleFilter === 'all' 
                    ? 'bg-emerald-900 text-white border-emerald-700 shadow-md scale-102' 
                    : 'bg-white text-slate-800 border-slate-200 hover:border-emerald-400'
                }`}
              >
                <div className="text-[11px] font-bold uppercase tracking-wider opacity-80">All Users</div>
                <div className="text-2xl font-black mt-1">{userCounts.all}</div>
                <div className="text-[10px] mt-0.5 opacity-70">Total in system</div>
              </div>

              <div 
                onClick={() => setUserRoleFilter('student')}
                className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
                  userRoleFilter === 'student' 
                    ? 'bg-emerald-800 text-white border-emerald-600 shadow-md scale-102' 
                    : 'bg-white text-slate-800 border-slate-200 hover:border-emerald-400'
                }`}
              >
                <div className="text-[11px] font-bold uppercase tracking-wider opacity-80">Students</div>
                <div className="text-2xl font-black mt-1 text-emerald-600 dark:text-emerald-300">
                  {userCounts.student}
                </div>
                <div className="text-[10px] mt-0.5 opacity-70">O-Level & A-Level</div>
              </div>

              <div 
                onClick={() => setUserRoleFilter('staff')}
                className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
                  userRoleFilter === 'staff' 
                    ? 'bg-blue-800 text-white border-blue-600 shadow-md scale-102' 
                    : 'bg-white text-slate-800 border-slate-200 hover:border-blue-400'
                }`}
              >
                <div className="text-[11px] font-bold uppercase tracking-wider opacity-80">Teachers / Staff</div>
                <div className="text-2xl font-black mt-1 text-blue-600 dark:text-blue-300">
                  {userCounts.staff}
                </div>
                <div className="text-[10px] mt-0.5 opacity-70">Academic & Non-Teaching</div>
              </div>

              <div 
                onClick={() => setUserRoleFilter('parent')}
                className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
                  userRoleFilter === 'parent' 
                    ? 'bg-amber-800 text-white border-amber-600 shadow-md scale-102' 
                    : 'bg-white text-slate-800 border-slate-200 hover:border-amber-400'
                }`}
              >
                <div className="text-[11px] font-bold uppercase tracking-wider opacity-80">Parents</div>
                <div className="text-2xl font-black mt-1 text-amber-600 dark:text-amber-300">
                  {userCounts.parent}
                </div>
                <div className="text-[10px] mt-0.5 opacity-70">Guardians Linked</div>
              </div>

              <div 
                onClick={() => setUserRoleFilter('admin')}
                className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
                  userRoleFilter === 'admin' 
                    ? 'bg-purple-800 text-white border-purple-600 shadow-md scale-102' 
                    : 'bg-white text-slate-800 border-slate-200 hover:border-purple-400'
                }`}
              >
                <div className="text-[11px] font-bold uppercase tracking-wider opacity-80">Admins</div>
                <div className="text-2xl font-black mt-1 text-purple-600 dark:text-purple-300">
                  {userCounts.admin}
                </div>
                <div className="text-[10px] mt-0.5 opacity-70">Privileged Accounts</div>
              </div>

              <div 
                onClick={() => setUserRoleFilter('alumni')}
                className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
                  userRoleFilter === 'alumni' 
                    ? 'bg-indigo-800 text-white border-indigo-600 shadow-md scale-102' 
                    : 'bg-white text-slate-800 border-slate-200 hover:border-indigo-400'
                }`}
              >
                <div className="text-[11px] font-bold uppercase tracking-wider opacity-80">Alumni</div>
                <div className="text-2xl font-black mt-1 text-indigo-600 dark:text-indigo-300">
                  {userCounts.alumni}
                </div>
                <div className="text-[10px] mt-0.5 opacity-70">Graduates Directory</div>
              </div>
            </div>

            {/* User Search & Role Bar */}
            <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-200 flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="relative w-full md:w-96">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={userSearchTerm}
                  onChange={(e) => setUserSearchTerm(e.target.value)}
                  placeholder="Search by name, username, index, phone, class..."
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-xs bg-slate-50 focus:outline-hidden focus:ring-2 focus:ring-emerald-600 focus:bg-white transition-all"
                />
                {userSearchTerm && (
                  <button
                    onClick={() => setUserSearchTerm('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Add User Buttons with Quick Role Picks */}
              <div className="flex items-center gap-2 flex-wrap w-full md:w-auto justify-end">
                {userRoleFilter === 'admin' && (
                  <button
                    onClick={handleRemoveAllAdminAccounts}
                    className="px-3 py-2 rounded-xl text-xs font-semibold text-red-600 hover:bg-red-50 border border-red-200 flex items-center gap-1.5 cursor-pointer"
                    title="Remove all registered administrator accounts and log out"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Remove All Admins</span>
                  </button>
                )}

                <button
                  onClick={handleResetUsers}
                  className="px-3 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 border border-slate-200 flex items-center gap-1.5 cursor-pointer"
                  title="Reset user database to default demo roster"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Reset Defaults</span>
                </button>

                <div className="inline-flex rounded-xl shadow-xs">
                  <button
                    onClick={() => handleOpenAddUser('student')}
                    className="px-3.5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-l-xl flex items-center gap-1.5 transition-colors cursor-pointer border-r border-emerald-800"
                  >
                    <UserPlus className="w-3.5 h-3.5 text-amber-300" />
                    <span>+ Add Student</span>
                  </button>
                  <button
                    onClick={() => handleOpenAddUser('staff')}
                    className="px-3 py-2 bg-blue-700 hover:bg-blue-800 text-white text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer border-r border-blue-800"
                  >
                    <span>+ Staff</span>
                  </button>
                  <button
                    onClick={() => {
                      handleOpenAddUser('admin');
                      setUserFormData((prev) => ({
                        ...prev,
                        role: 'admin',
                        adminTitle: 'Director of Studies (DOS)',
                        department: 'Office of the Director of Studies (DOS)',
                      }));
                    }}
                    className="px-3 py-2 bg-indigo-700 hover:bg-indigo-800 text-white text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer border-r border-indigo-800"
                  >
                    <span>+ D.O.S</span>
                  </button>
                  <button
                    onClick={() => handleOpenAddUser('parent')}
                    className="px-3 py-2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer border-r border-amber-700"
                  >
                    <span>+ Parent</span>
                  </button>
                  <button
                    onClick={() => handleOpenAddUser('admin')}
                    className="px-3 py-2 bg-purple-700 hover:bg-purple-800 text-white text-xs font-bold rounded-r-xl flex items-center gap-1 transition-colors cursor-pointer"
                  >
                    <span>+ Admin</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Users Table / Directory */}
            <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="p-5 border-b border-slate-200 flex items-center justify-between flex-wrap gap-3 bg-slate-50/50">
                <div>
                  <h3 className="font-extrabold text-sm sm:text-base text-slate-900 flex items-center gap-2">
                    <Users className="w-4 h-4 text-emerald-700" />
                    <span>User Accounts Directory</span>
                    <span className="bg-emerald-100 text-emerald-900 text-xs px-2.5 py-0.5 rounded-full font-mono">
                      Showing {filteredUsers.length} of {users.length}
                    </span>
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    As Administrator, you have full authority to modify credentials, change passwords, and add or delete any user.
                  </p>
                </div>
              </div>

              {filteredUsers.length === 0 ? (
                <div className="p-12 text-center text-slate-500 space-y-3">
                  <UserCheck className="w-12 h-12 mx-auto text-slate-300" />
                  <p className="font-bold text-sm">No users found matching your search criteria.</p>
                  <button
                    onClick={() => { setUserRoleFilter('all'); setUserSearchTerm(''); }}
                    className="px-4 py-2 bg-emerald-700 text-white rounded-xl text-xs font-bold hover:bg-emerald-800 cursor-pointer"
                  >
                    Clear Filters
                  </button>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-100 text-slate-600 uppercase text-[10px] tracking-wider font-extrabold border-b border-slate-200">
                      <tr>
                        <th className="py-3 px-4">User & Role</th>
                        <th className="py-3 px-4">Identifier / Username</th>
                        <th className="py-3 px-4">Role-Specific Details</th>
                        <th className="py-3 px-4">Contact Info</th>
                        <th className="py-3 px-4">Status</th>
                        <th className="py-3 px-4 text-right">Admin Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredUsers.map((u) => {
                        const badge = getRoleBadge(u.role);
                        return (
                          <tr key={u.id} className="hover:bg-slate-50/80 transition-colors">
                            {/* User & Role */}
                            <td className="py-3.5 px-4">
                              <div className="flex items-center gap-3">
                                <div className="w-9 h-9 rounded-xl bg-slate-100 border border-slate-300 flex items-center justify-center font-black text-slate-700 text-xs shrink-0">
                                  {u.fullName.charAt(0)}
                                </div>
                                <div>
                                  <div className="font-bold text-slate-900 flex items-center gap-1.5">
                                    <span>{u.fullName}</span>
                                    {u.isPrimaryAdmin && (
                                      <span className="text-[9px] bg-amber-400 text-slate-950 font-black px-1.5 py-0.2 rounded">
                                        Primary
                                      </span>
                                    )}
                                  </div>
                                  <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-full border mt-0.5 ${badge.bg}`}>
                                    {badge.label}
                                  </span>
                                </div>
                              </div>
                            </td>

                            {/* Identifier / Username */}
                            <td className="py-3.5 px-4 font-mono">
                              <div className="font-semibold text-slate-800">{u.username}</div>
                              {u.indexNumber && (
                                <div className="text-[10px] text-slate-500">Index: {u.indexNumber}</div>
                              )}
                              {u.admissionNumber && u.admissionNumber !== u.username && (
                                <div className="text-[10px] text-slate-500">Adm: {u.admissionNumber}</div>
                              )}
                            </td>

                            {/* Role Specific Details */}
                            <td className="py-3.5 px-4">
                              {u.role === 'student' && (
                                <div>
                                  <span className="font-semibold text-slate-800">
                                    {u.className ? `${u.className}${u.stream ? ` (${u.stream})` : ''}` : (u.stream ? `Stream: ${u.stream}` : 'Class Unassigned')}
                                  </span>
                                  <div className="text-[11px] text-slate-500 mt-0.5">
                                    {u.section ? `${u.section} • ` : ''}Fees Bal: <strong className={u.feesBalance && u.feesBalance > 0 ? 'text-red-600' : 'text-emerald-700'}>UGX {u.feesBalance ? u.feesBalance.toLocaleString() : '0'}</strong>
                                  </div>
                                </div>
                              )}

                              {u.role === 'staff' && (
                                <div>
                                  <span className="font-semibold text-slate-800">
                                    {u.staffTitle || 'Staff Member'}
                                  </span>
                                  <div className="text-[11px] text-slate-500 mt-0.5">
                                    {u.department ? `Dept: ${u.department}` : 'Academics'}
                                  </div>
                                </div>
                              )}

                              {u.role === 'parent' && (
                                <div>
                                  <span className="font-semibold text-slate-800">
                                    {u.relationship || 'Guardian / Parent'}
                                  </span>
                                  <div className="text-[11px] text-slate-500 mt-0.5">
                                    {u.linkedStudentName ? `Learner: ${u.linkedStudentName}` : 'No learner linked'}
                                  </div>
                                </div>
                              )}

                              {u.role === 'admin' && (
                                <div>
                                  <span className="font-semibold text-slate-800">
                                    {u.adminTitle || 'School Administrator'}
                                  </span>
                                  <div className="text-[11px] text-slate-500 mt-0.5">
                                    Full Management Authority
                                  </div>
                                </div>
                              )}

                              {u.role === 'alumni' && (
                                <div>
                                  <span className="font-semibold text-slate-800">
                                    {u.currentProfession || 'Alumnus'}
                                  </span>
                                  <div className="text-[11px] text-slate-500 mt-0.5">
                                    {[u.completionYear ? `Class of ${u.completionYear}` : '', u.organization].filter(Boolean).join(' • ') || 'Alumni Network'}
                                  </div>
                                </div>
                              )}
                            </td>

                            {/* Contact Info */}
                            <td className="py-3.5 px-4">
                              <div className="text-slate-700 flex items-center gap-1.5">
                                <Phone className="w-3 h-3 text-slate-400 shrink-0" />
                                <span>{u.phone || 'No phone'}</span>
                              </div>
                              {u.email && (
                                <div className="text-slate-500 text-[10px] flex items-center gap-1.5 mt-0.5 truncate max-w-xs">
                                  <Mail className="w-3 h-3 text-slate-400 shrink-0" />
                                  <span className="truncate">{u.email}</span>
                                </div>
                              )}
                            </td>

                            {/* Status */}
                            <td className="py-3.5 px-4">
                              <button
                                onClick={() => handleToggleStatus(u.id)}
                                className={`px-2.5 py-1 rounded-full text-[10px] font-bold border transition-colors cursor-pointer flex items-center gap-1 ${
                                  u.status === 'active'
                                    ? 'bg-emerald-50 text-emerald-700 border-emerald-300 hover:bg-emerald-100'
                                    : 'bg-red-50 text-red-700 border-red-300 hover:bg-red-100'
                                }`}
                                title="Click to toggle Active/Suspended status"
                              >
                                <span className={`w-1.5 h-1.5 rounded-full ${u.status === 'active' ? 'bg-emerald-600' : 'bg-red-600'}`} />
                                <span className="capitalize">{u.status}</span>
                              </button>
                            </td>

                            {/* Actions */}
                            <td className="py-3.5 px-4 text-right">
                              <div className="flex items-center justify-end gap-1.5">
                                {u.role === 'student' && (
                                  <button
                                    onClick={() => {
                                      handleOpenAssessmentModal(u);
                                      setSelectedAcademicStudentId(u.id);
                                    }}
                                    className="p-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-800 border border-blue-200 transition-colors cursor-pointer"
                                    title="Upload / Publish Official Examination Assessment for this Student"
                                  >
                                    <Award className="w-3.5 h-3.5 text-blue-700" />
                                  </button>
                                )}

                                <button
                                  onClick={() => handleOpenEditUser(u)}
                                  className="p-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 transition-colors cursor-pointer"
                                  title="Edit User Details, Role, Password & Profile"
                                >
                                  <Edit3 className="w-3.5 h-3.5" />
                                </button>

                                <button
                                  onClick={() => {
                                    setUserToDelete(u);
                                    setUserDeleteError(null);
                                  }}
                                  className="p-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 transition-colors cursor-pointer"
                                  title="Delete User"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 2: MOCK & UNEB EXAM COUNTDOWN MANAGEMENT (Core User Requirement)       */}
        {/* ========================================================================= */}
        {activeTab === 'exams' && (
          <div className="mt-6 space-y-6">
            {/* Top Overview & Action Bar */}
            <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-emerald-900 text-white rounded-3xl p-6 sm:p-8 border-2 border-emerald-700/60 shadow-xl relative overflow-hidden">
              <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400 text-slate-950 text-xs font-black uppercase tracking-wider mb-2">
                    <Clock className="w-3.5 h-3.5 animate-spin" />
                    <span>Official Examination Timetable Authority</span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-black text-white">
                    Edit Mock & UNEB Exam Countdowns
                  </h3>
                  <p className="text-xs text-emerald-200 mt-1 max-w-2xl leading-relaxed">
                    Set and update the exact dates, times, venues, supervisors, and timetable papers for <strong>Senior Four UCE Mocks & UNEB Finals</strong>, <strong>Senior Six UACE Mocks & UNEB Finals</strong>, and <strong>Terminal Promotional Examinations</strong>. Any update dynamically changes the live countdown timers across the whole school website and portal.
                  </p>
                </div>

                <div className="flex items-center gap-2 flex-wrap self-stretch md:self-auto">
                  <button
                    onClick={handleOpenAddExam}
                    className="px-4 py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-extrabold rounded-xl shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
                  >
                    <Plus className="w-4 h-4 text-slate-950" />
                    <span>+ Create New Exam Countdown</span>
                  </button>

                  <button
                    onClick={handleResetExams}
                    className="px-3 py-2.5 bg-slate-900/80 hover:bg-slate-800 text-amber-300 text-xs font-bold rounded-xl border border-emerald-700/70 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                    title="Reset countdowns to official UNEB 2026 timetable"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Reset UNEB Defaults</span>
                  </button>
                </div>
              </div>
            </div>

            {/* List of Mock & UNEB Exams for Editing */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {examSchedules.map((exam) => {
                const isUneb = exam.examType === 'uneb';
                const isMock = exam.examType === 'mock';
                const daysRemaining = calculateDaysLeft(exam.targetDate);

                return (
                  <div 
                    key={exam.id}
                    className="bg-white rounded-3xl p-5 sm:p-6 shadow-sm border border-slate-200 hover:border-emerald-500 transition-all flex flex-col justify-between"
                  >
                    <div>
                      {/* Top Badges */}
                      <div className="flex items-center justify-between gap-2 mb-3">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider border ${
                          isUneb 
                            ? 'bg-red-50 text-red-800 border-red-300' 
                            : isMock 
                              ? 'bg-amber-50 text-amber-800 border-amber-300' 
                              : 'bg-blue-50 text-blue-800 border-blue-300'
                        }`}>
                          {isUneb ? 'UNEB National Final' : isMock ? 'Joint Mock Series' : 'Promotional Series'}
                        </span>

                        <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-slate-100 text-emerald-800 border border-slate-200">
                          {daysRemaining}
                        </span>
                      </div>

                      {/* Title & Target Class */}
                      <h4 className="text-base font-black text-slate-900 leading-snug">
                        {exam.name}
                      </h4>
                      <p className="text-xs text-amber-700 font-bold mt-0.5">
                        Tab Label: "{exam.shortLabel}" • Target: {exam.targetClass}
                      </p>

                      {/* Details Strip */}
                      <div className="mt-3.5 space-y-1.5 text-xs text-slate-600 bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
                        <div className="flex items-center justify-between">
                          <span className="text-slate-500 font-medium">Countdown Target:</span>
                          <strong className="text-slate-900 font-mono">
                            {new Date(exam.targetDate).toLocaleString('en-GB', {
                              dateStyle: 'medium',
                              timeStyle: 'short',
                            })}
                          </strong>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-slate-500 font-medium">Official Briefing:</span>
                          <span className="text-slate-800 font-semibold">{exam.briefingDate}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-slate-500 font-medium">Exam Venue:</span>
                          <span className="text-slate-800 truncate max-w-xs">{exam.venue}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-slate-500 font-medium">Chief Supervisor:</span>
                          <span className="text-slate-800">{exam.supervisor}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-slate-500 font-medium">Scheduled Papers:</span>
                          <span className="font-bold text-emerald-800">{exam.papers?.length || exam.papersCount} Papers Listed</span>
                        </div>
                      </div>

                      <p className="text-xs text-slate-500 mt-2.5 line-clamp-2 italic">
                        "{exam.description}"
                      </p>
                    </div>

                    {/* Action Buttons */}
                    <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between gap-2">
                      <div className="text-[11px] text-slate-400 font-mono">
                        ID: {exam.id}
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleOpenEditExam(exam)}
                          className="px-3.5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-xs active:scale-95"
                        >
                          <Edit3 className="w-3.5 h-3.5 text-amber-300" />
                          <span>Edit Countdown & Timetable</span>
                        </button>

                        <button
                          onClick={() => setExamToDelete(exam)}
                          className="p-2 bg-red-50 hover:bg-red-100 text-red-700 rounded-xl text-xs transition-colors cursor-pointer border border-red-200"
                          title="Delete Exam Countdown"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Live Preview of Exam Countdown Timer */}
            <div className="mt-8">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-xs font-extrabold text-slate-600 uppercase tracking-wider flex items-center gap-1.5">
                  <Eye className="w-4 h-4 text-emerald-600" />
                  <span>Live Preview of Public & Student Exam Countdown Timer</span>
                </h4>
                <span className="text-[11px] text-slate-500">
                  Reflects all changes made above in real time
                </span>
              </div>
              <ExamCountdownTimer />
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 3: ADMISSIONS QUEUE                                                    */}
        {/* ========================================================================= */}
        {activeTab === 'admissions' && (
          <div className="mt-6 bg-white rounded-3xl p-6 shadow-sm border border-slate-200">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-extrabold text-slate-900">
                  Admissions Applications Queue ({admissions.length})
                </h3>
                <p className="text-xs text-slate-500">
                  Submitted candidate admission requests stored locally and online.
                </p>
              </div>
            </div>

            {admissions.length === 0 ? (
              <div className="p-10 text-center text-slate-500">
                <FileText className="w-10 h-10 mx-auto text-slate-300 mb-2" />
                <p className="text-xs">No pending admissions applications at the moment.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {admissions.map((adm) => (
                  <div key={adm.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-sm text-slate-900">{adm.studentName}</h4>
                      <p className="text-xs text-slate-500">
                        App No: {adm.applicationNumber} • Class: {adm.applyingFor} • Guardian: {adm.guardianName} ({adm.guardianPhone})
                      </p>
                    </div>
                    <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                      Received
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 4: FEES & FINANCE LOGS                                                 */}
        {/* ========================================================================= */}
        {activeTab === 'finance' && (
          <div className="mt-6 bg-white rounded-3xl p-6 shadow-sm border border-slate-200">
            <h3 className="text-base font-extrabold text-slate-900 mb-2">School Fees & Payment Logs</h3>
            <p className="text-xs text-slate-500 mb-4">Recorded student fee transactions</p>

            <div className="divide-y divide-slate-100">
              {payments.map((p) => (
                <div key={p.id} className="py-3 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-slate-900">{p.receiptNumber}</span>
                    <p className="text-slate-500 text-[11px]">{p.paymentMethod} • Ref: {p.referenceNumber} • {p.date}</p>
                  </div>
                  <div className="text-right">
                    <span className="font-black text-emerald-800 text-sm">UGX {p.amount.toLocaleString()}</span>
                    <p className="text-[10px] text-emerald-600 font-bold">{p.status}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 5: OFFICIAL EXAMINATION ASSESSMENTS & ACADEMIC REGISTRY (ADMINISTRATOR UPLOAD) */}
        {/* ========================================================================= */}
        {activeTab === 'academics' && (() => {
          const selectedStudent = users.find((u) => u.id === selectedAcademicStudentId && u.role === 'student') || studentUsers[0];
          const filteredStudents = studentUsers.filter((s) => {
            if (selectedAcademicClassFilter === 'all') return true;
            return (s.className || '').toLowerCase() === selectedAcademicClassFilter.toLowerCase();
          });

          const selectedRank = selectedStudent
            ? calculateRealClassRank(selectedStudent.id, selectedStudent.className || '', users)
            : { rank: 1, total: 1, rankText: '1st / 1', cohortLabel: 'Cohort' };

          const activeGrades = selectedStudent?.examinationAssessment?.grades && selectedStudent.examinationAssessment.grades.length > 0
            ? selectedStudent.examinationAssessment.grades
            : (selectedStudent?.recentGrades || DEMO_STUDENT.recentGrades);

          const selectedRec = recommendCombinationFromPerformance(activeGrades);

          return (
            <div className="mt-6 space-y-6">
              {/* Header Card */}
              <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-900 text-[10px] font-bold uppercase tracking-wider">
                      Academic Registry & Upload Center
                    </span>
                    <span className="text-xs text-slate-500 font-mono">
                      {studentUsers.length} Students Registered
                    </span>
                  </div>
                  <h3 className="text-lg font-black text-slate-900 mt-1">
                    Official Examination Assessments & UNEB Grading
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Upload and certify official terminal / mock examination assessments for learners. Students and parents retain active read and write permissions to reflect on results and set target aggregates.
                  </p>
                </div>

                {selectedStudent && (
                  <button
                    onClick={() => handleOpenAssessmentModal(selectedStudent)}
                    className="px-4 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold shadow-md transition-all flex items-center gap-2 cursor-pointer active:scale-95 shrink-0"
                  >
                    <FileUp className="w-4 h-4" />
                    <span>Upload / Edit Assessment for {selectedStudent.fullName.split(' ')[0]}</span>
                  </button>
                )}
              </div>

              {/* Class Filter & Student Selection Toolbar */}
              <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="flex items-center gap-1.5 overflow-x-auto max-w-full pb-1 sm:pb-0">
                  <span className="text-xs font-bold text-slate-500 mr-2 shrink-0">Class:</span>
                  {['all', 'Senior One', 'Senior Two', 'Senior Three', 'Senior Four', 'Senior Five', 'Senior Six'].map((cls) => (
                    <button
                      key={cls}
                      onClick={() => setSelectedAcademicClassFilter(cls)}
                      className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors whitespace-nowrap cursor-pointer ${
                        selectedAcademicClassFilter === cls
                          ? 'bg-emerald-700 text-white shadow-xs'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {cls === 'all' ? 'All Classes' : cls}
                    </button>
                  ))}
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <label className="text-xs font-bold text-slate-600 whitespace-nowrap">Learner:</label>
                  <select
                    value={selectedAcademicStudentId || (selectedStudent ? selectedStudent.id : '')}
                    onChange={(e) => setSelectedAcademicStudentId(e.target.value)}
                    className="w-full sm:w-64 text-xs p-2 rounded-xl border border-slate-300 font-semibold bg-white focus:border-emerald-600 outline-none"
                  >
                    {filteredStudents.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.fullName} ({s.className || 'Senior Four'} {s.stream ? `• ${s.stream}` : ''})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {selectedStudent ? (
                <div className="space-y-6">
                  {/* Selected Student Banner Card */}
                  <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200">
                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-100 pb-5">
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-2xl bg-emerald-100 border-2 border-emerald-600 flex items-center justify-center text-emerald-950 font-black text-2xl shrink-0">
                          {selectedStudent.fullName.charAt(0)}
                        </div>
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <h4 className="text-lg font-black text-slate-900">{selectedStudent.fullName}</h4>
                            <span className="bg-emerald-100 text-emerald-900 text-xs px-2.5 py-0.5 rounded-full font-bold">
                              {selectedStudent.className} {selectedStudent.stream}
                            </span>
                            <span className="bg-amber-100 text-amber-900 text-xs px-2.5 py-0.5 rounded-full font-bold">
                              {selectedStudent.section || 'Boarding'}
                            </span>
                          </div>
                          <p className="text-xs text-slate-500 mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 font-mono">
                            <span>Index: {selectedStudent.indexNumber || selectedStudent.username}</span>
                            <span>Admission: {selectedStudent.admissionNumber || selectedStudent.username}</span>
                            <span>House: {selectedStudent.house || 'School Residence'}</span>
                            <span>Guardian: {selectedStudent.guardianName || 'None'} ({selectedStudent.guardianPhone || 'N/A'})</span>
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-col items-start md:items-end gap-1.5 shrink-0">
                        {selectedStudent.examinationAssessment ? (
                          <span className="px-3 py-1 bg-emerald-100 border border-emerald-300 text-emerald-900 rounded-full font-bold text-xs flex items-center gap-1.5">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                            <span>Official Assessment Published</span>
                          </span>
                        ) : (
                          <span className="px-3 py-1 bg-amber-100 border border-amber-300 text-amber-900 rounded-full font-bold text-xs flex items-center gap-1.5">
                            <AlertCircle className="w-3.5 h-3.5 text-amber-700" />
                            <span>Awaiting Official Upload</span>
                          </span>
                        )}
                        <span className="text-[11px] text-slate-400">
                          {selectedStudent.examinationAssessment?.uploadedAt 
                            ? `Uploaded on ${new Date(selectedStudent.examinationAssessment.uploadedAt).toLocaleDateString()}` 
                            : 'No formal assessment uploaded yet'}
                        </span>
                      </div>
                    </div>

                    {/* 3 Metric Cards: Real Rank, Aggregates/Division, Recommended Combination */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-5">
                      <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
                        <div className="text-xs font-bold text-slate-500 uppercase flex items-center justify-between">
                          <span>Real Class Rank</span>
                          <span className="text-[10px] bg-blue-100 text-blue-800 font-bold px-1.5 py-0.2 rounded">Live</span>
                        </div>
                        <div className="text-2xl font-black text-slate-900 mt-1.5">{selectedRank.rankText}</div>
                        <div className="text-xs font-semibold text-blue-700 mt-0.5">{selectedRank.cohortLabel}</div>
                      </div>

                      <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
                        <div className="text-xs font-bold text-slate-500 uppercase flex items-center justify-between">
                          <span>Official UNEB Aggregates</span>
                          <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.2 rounded">Best 8</span>
                        </div>
                        <div className="text-2xl font-black text-emerald-800 mt-1.5">
                          {selectedStudent.aggregates ?? computeAggregatesAndDivision(activeGrades).aggregates} Aggregates
                        </div>
                        <div className="text-xs font-semibold text-emerald-700 mt-0.5">
                          {selectedStudent.division || computeAggregatesAndDivision(activeGrades).division}
                        </div>
                      </div>

                      <div className="bg-amber-50/50 p-4 rounded-2xl border border-amber-200">
                        <div className="text-xs font-bold text-amber-900 uppercase flex items-center justify-between">
                          <span>Recommended Combination</span>
                          <span className="text-[10px] bg-amber-200 text-amber-900 font-bold px-1.5 py-0.2 rounded">From Marks</span>
                        </div>
                        <div className="text-xl font-black text-amber-700 mt-1.5">{selectedRec.code}</div>
                        <div className="text-xs font-semibold text-slate-700 mt-0.5 truncate">{selectedRec.title}</div>
                      </div>
                    </div>

                    {/* Official Examination Subject Grades Table */}
                    <div className="mt-6 border border-slate-200 rounded-2xl overflow-hidden">
                      <div className="p-3.5 bg-slate-100 border-b border-slate-200 flex items-center justify-between flex-wrap gap-2">
                        <div className="flex items-center gap-2">
                          <GraduationCap className="w-4 h-4 text-emerald-700" />
                          <h5 className="font-extrabold text-xs text-slate-800 uppercase tracking-wide">
                            {selectedStudent.examinationAssessment?.examTitle || `${selectedStudent.className} Official Assessment Matrix`}
                          </h5>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-[11px] text-slate-500">
                            Status: <strong className="text-slate-800">{selectedStudent.examinationAssessment?.status || 'Academic Term in Progress'}</strong>
                          </span>
                          <button
                            onClick={() => handleOpenAssessmentModal(selectedStudent)}
                            className="px-2.5 py-1 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-[11px] font-bold transition-colors cursor-pointer"
                          >
                            Update Assessment
                          </button>
                        </div>
                      </div>

                      <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs">
                          <thead className="bg-slate-50 text-slate-600 uppercase font-bold border-b border-slate-200">
                            <tr>
                              <th className="py-2.5 px-4">Subject</th>
                              <th className="py-2.5 px-4 text-center">Score (%)</th>
                              <th className="py-2.5 px-4 text-center">UNEB Grade</th>
                              <th className="py-2.5 px-4">Teacher Comments & Competencies</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100">
                            {(activeGrades as ExaminationAssessmentGrade[]).map((g: ExaminationAssessmentGrade, idx: number) => (
                              <tr key={idx} className="hover:bg-slate-50">
                                <td className="py-2.5 px-4 font-bold text-slate-800">{g.subject}</td>
                                <td className="py-2.5 px-4 font-semibold text-center">{g.score}%</td>
                                <td className="py-2.5 px-4 text-center">
                                  <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                                    g.grade === 'D1' || g.grade === 'D2'
                                      ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                                      : g.grade.startsWith('C')
                                      ? 'bg-blue-100 text-blue-900 border border-blue-300'
                                      : 'bg-amber-100 text-amber-900 border border-amber-300'
                                  }`}>
                                    {g.grade}
                                  </span>
                                </td>
                                <td className="py-2.5 px-4 text-slate-600">{g.remarks}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>

                      {/* Official Remarks */}
                      <div className="p-4 bg-slate-50 border-t border-slate-200 text-xs space-y-2">
                        <div>
                          <strong className="text-slate-800">Class Teacher / DOS Remarks:</strong>{' '}
                          <span className="text-slate-600 italic">
                            {selectedStudent.examinationAssessment?.classTeacherRemarks || selectedStudent.notes || `${selectedStudent.fullName} exhibits strong diligence and positive academic demeanor.`}
                          </span>
                        </div>
                        <div>
                          <strong className="text-slate-800">Headteacher's Official Endorsement:</strong>{' '}
                          <span className="text-emerald-900 font-medium italic">
                            {selectedStudent.examinationAssessment?.headteacherRemarks || `"Promoted with commendation for discipline and academic focus." — Headteacher`}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* TWO-WAY COLLABORATION: Learner's Written Reflection & Academic Goals */}
                    <div className="mt-6 bg-gradient-to-br from-emerald-50/60 to-teal-50/40 rounded-2xl p-5 border-2 border-emerald-600/30">
                      <div className="flex items-center justify-between flex-wrap gap-2 mb-3">
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                          <h5 className="font-black text-xs text-emerald-950 uppercase tracking-wide">
                            Learner's Two-Way Response & Reflection (Read & Write Permission Active)
                          </h5>
                        </div>
                        <span className="text-[11px] font-bold text-slate-500 bg-white px-2.5 py-0.5 rounded-lg border border-slate-200">
                          {selectedStudent.studentNotesSavedAt ? `Submitted: ${selectedStudent.studentNotesSavedAt}` : 'Awaiting Student Submission'}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                        <div className="bg-white p-3.5 rounded-xl border border-slate-200">
                          <span className="text-[11px] font-bold text-slate-500 uppercase block">Learner Target Aggregates</span>
                          <span className="text-lg font-black text-emerald-800 mt-1 block">
                            {selectedStudent.studentTargetAggregates ? `Aggregate ${selectedStudent.studentTargetAggregates}` : 'Not set yet'}
                          </span>
                          <span className="text-[11px] text-slate-500">
                            Goal: {selectedStudent.studentAcademicGoals || 'Standard Division 1'}
                          </span>
                        </div>

                        <div className="bg-white p-3.5 rounded-xl border border-slate-200">
                          <span className="text-[11px] font-bold text-slate-500 uppercase block">Learner Preferred Combination</span>
                          <span className="text-base font-black text-amber-700 mt-1 block">
                            {selectedStudent.studentPreferredCombination || `${selectedRec.code} (Pending learner choice)`}
                          </span>
                          <span className="text-[11px] text-slate-500">
                            Recommended: {selectedRec.code}
                          </span>
                        </div>

                        <div className="bg-white p-3.5 rounded-xl border border-slate-200">
                          <span className="text-[11px] font-bold text-slate-500 uppercase block">Note to Director of Studies (DOS)</span>
                          <p className="text-slate-700 italic mt-1 line-clamp-3">
                            {selectedStudent.studentFeedback ? `"${selectedStudent.studentFeedback}"` : 'No inquiry submitted by learner.'}
                          </p>
                        </div>
                      </div>

                      <div className="mt-3 bg-white p-3.5 rounded-xl border border-slate-200 text-xs">
                        <strong className="text-slate-800 block mb-1">Learner's Self-Reflection & Study Notes:</strong>
                        <p className="text-slate-600 leading-relaxed italic">
                          {selectedStudent.studentStudyNotes || 'The learner has not written self-reflection notes yet. The student portal remains equipped with active read and write capability to edit notes anytime.'}
                        </p>
                      </div>

                      {selectedStudent.studentActionPlan && (
                        <div className="mt-2 bg-white p-3.5 rounded-xl border border-slate-200 text-xs">
                          <strong className="text-slate-800 block mb-1">Learner's Subject Improvement Action Plan:</strong>
                          <p className="text-slate-600 leading-relaxed italic">
                            "{selectedStudent.studentActionPlan}"
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-white rounded-3xl p-12 text-center border border-slate-200">
                  <GraduationCap className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                  <p className="text-sm font-bold text-slate-700">No students found matching class filter.</p>
                </div>
              )}
            </div>
          );
        })()}

        {/* ========================================================================= */}
        {/* TAB 6: CAMPUS PHOTO GALLERY & UPLOADS (ADMIN AUTHENTICATED)                */}
        {/* ========================================================================= */}
        {activeTab === 'gallery' && (
          <div className="mt-6">
            <CampusPhotoGallery
              currentUser={{ name: currentUser.name, role: 'admin' }}
              onOpenLogin={() => {}}
            />
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* MODAL: CREATE / EDIT USER MODAL                                            */}
      {/* ========================================================================= */}
      {showUserModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-xl w-full shadow-2xl border border-emerald-900/30 overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-emerald-950 via-emerald-900 to-slate-900 text-white p-5 flex items-center justify-between border-b-4 border-amber-400">
              <div className="flex items-center gap-2.5">
                <UserPlus className="w-5 h-5 text-amber-400" />
                <div>
                  <h3 className="font-black text-sm">
                    {editingUserId ? 'Edit School User Profile' : 'Add New User to School Directory'}
                  </h3>
                  <p className="text-[10px] text-emerald-200">
                    Manage students, parents, teachers, staff, admins, and alumni
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowUserModal(false)}
                className="text-emerald-300 hover:text-white p-1 rounded-lg cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSaveUser} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
              {userModalError && (
                <div className="p-3 bg-red-50 text-red-700 text-xs rounded-xl flex items-center gap-2 border border-red-200">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{userModalError}</span>
                </div>
              )}

              {userModalSuccess && (
                <div className="p-3 bg-emerald-50 text-emerald-800 text-xs rounded-xl flex items-center gap-2 border border-emerald-200">
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                  <span>{userModalSuccess}</span>
                </div>
              )}

              {/* Role Selection */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-bold text-slate-700">
                    User Role & Category <span className="text-red-500">*</span>
                  </label>
                  <span className="text-[10px] text-emerald-700 font-semibold">Select via dropdown menu or quick pills</span>
                </div>
                
                {/* Role Dropdown Menu */}
                <div className="mb-2">
                  <select
                    value={
                      userFormData.role === 'admin' && userFormData.adminTitle === 'Director of Studies (DOS)'
                        ? 'dos'
                        : userFormData.role
                    }
                    onChange={(e) => {
                      const val = e.target.value;
                      if (val === 'dos') {
                        setUserFormData({
                          ...userFormData,
                          role: 'admin',
                          adminTitle: 'Director of Studies (DOS)',
                          department: 'Office of the Director of Studies (DOS)',
                        });
                      } else {
                        setUserFormData({
                          ...userFormData,
                          role: val as UserRole,
                        });
                      }
                    }}
                    className="w-full px-3 py-2 rounded-xl border border-emerald-300 text-xs bg-emerald-50/60 font-bold text-emerald-950 focus:outline-hidden focus:ring-2 focus:ring-emerald-600 shadow-2xs"
                  >
                    <option value="student">Student (Academic Learner)</option>
                    <option value="dos">Director of Studies (DOS) - Academics & Exam Authority</option>
                    <option value="staff">Staff (Teacher / Faculty Member)</option>
                    <option value="admin">Administrator (Deputy / Bursar / IT)</option>
                    <option value="parent">Parent / Guardian</option>
                    <option value="alumni">Alumni (Old Boy / Old Girl)</option>
                  </select>
                </div>

                <div className="grid grid-cols-3 sm:grid-cols-6 gap-1.5 text-xs">
                  {(['student', 'dos', 'staff', 'admin', 'parent', 'alumni'] as (UserRole | 'dos')[]).map((r) => {
                    const isSelected = r === 'dos'
                      ? (userFormData.role === 'admin' && userFormData.adminTitle === 'Director of Studies (DOS)')
                      : (userFormData.role === r && userFormData.adminTitle !== 'Director of Studies (DOS)');
                    return (
                      <button
                        key={r}
                        type="button"
                        onClick={() => {
                          if (r === 'dos') {
                            setUserFormData({
                              ...userFormData,
                              role: 'admin',
                              adminTitle: 'Director of Studies (DOS)',
                              department: 'Office of the Director of Studies (DOS)',
                            });
                          } else {
                            setUserFormData({ ...userFormData, role: r as UserRole });
                          }
                        }}
                        className={`py-1.5 px-2 rounded-xl border font-bold capitalize transition-all cursor-pointer text-center text-[11px] ${
                          isSelected
                            ? 'bg-emerald-800 text-white border-emerald-900 shadow-xs scale-102'
                            : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        {r === 'dos' ? 'D.O.S' : r}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Full Name & Username */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={userFormData.fullName || ''}
                    onChange={(e) => setUserFormData({ ...userFormData, fullName: e.target.value })}
                    placeholder="Enter full name"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-slate-50 focus:outline-hidden focus:ring-2 focus:ring-emerald-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Username / ID / Index <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={userFormData.username || ''}
                    onChange={(e) => setUserFormData({ ...userFormData, username: e.target.value })}
                    placeholder="Enter username, index, or registration ID"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-slate-50 font-mono focus:outline-hidden focus:ring-2 focus:ring-emerald-600"
                  />
                </div>
              </div>

              {/* Password & Status */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Password / Security PIN
                  </label>
                  <input
                    type="text"
                    value={userFormData.password || ''}
                    onChange={(e) => setUserFormData({ ...userFormData, password: e.target.value })}
                    placeholder="Enter custom PIN (or leave blank for default)"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-slate-50 focus:outline-hidden focus:ring-2 focus:ring-emerald-600 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Account Status
                  </label>
                  <select
                    value={userFormData.status || 'active'}
                    onChange={(e) => setUserFormData({ ...userFormData, status: e.target.value as UserStatus })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-slate-50 focus:outline-hidden focus:ring-2 focus:ring-emerald-600 font-medium"
                  >
                    <option value="active">Active (Full Access)</option>
                    <option value="suspended">Suspended (Blocked Access)</option>
                    <option value="pending">Pending Verification</option>
                  </select>
                </div>
              </div>

              {/* Phone & Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={userFormData.phone || ''}
                    onChange={(e) => setUserFormData({ ...userFormData, phone: e.target.value })}
                    placeholder="Enter phone number"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-slate-50 focus:outline-hidden focus:ring-2 focus:ring-emerald-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={userFormData.email || ''}
                    onChange={(e) => setUserFormData({ ...userFormData, email: e.target.value })}
                    placeholder="Enter email address"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-slate-50 focus:outline-hidden focus:ring-2 focus:ring-emerald-600"
                  />
                </div>
              </div>

              {/* ROLE SPECIFIC FIELDS */}
              {userFormData.role === 'student' && (
                <div className="p-3.5 bg-emerald-50/60 rounded-2xl border border-emerald-200/60 space-y-3">
                  <h4 className="text-xs font-extrabold text-emerald-900 uppercase tracking-wider">
                    Student Academic Information
                  </h4>
                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-0.5">Class</label>
                      <select
                        value={userFormData.className || ''}
                        onChange={(e) => setUserFormData({ ...userFormData, className: e.target.value })}
                        className="w-full px-2 py-1.5 rounded-lg border border-slate-300 text-xs bg-white"
                      >
                        <option value="">Select Class...</option>
                        <option value="Senior One">Senior One (S.1)</option>
                        <option value="Senior Two">Senior Two (S.2)</option>
                        <option value="Senior Three">Senior Three (S.3)</option>
                        <option value="Senior Four">Senior Four (S.4)</option>
                        <option value="Senior Five">Senior Five (S.5)</option>
                        <option value="Senior Six">Senior Six (S.6)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-0.5">Stream</label>
                      <input
                        type="text"
                        value={userFormData.stream || ''}
                        onChange={(e) => setUserFormData({ ...userFormData, stream: e.target.value })}
                        placeholder="Enter stream (e.g. Green, Blue)"
                        className="w-full px-2 py-1.5 rounded-lg border border-slate-300 text-xs bg-white"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-0.5">Section</label>
                      <select
                        value={userFormData.section || 'Day'}
                        onChange={(e) => setUserFormData({ ...userFormData, section: e.target.value as 'Boarding' | 'Day' })}
                        className="w-full px-2 py-1.5 rounded-lg border border-slate-300 text-xs bg-white"
                      >
                        <option value="Day">Day</option>
                        <option value="Boarding">Boarding</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-0.5">Guardian Name</label>
                      <input
                        type="text"
                        value={userFormData.guardianName || ''}
                        onChange={(e) => setUserFormData({ ...userFormData, guardianName: e.target.value })}
                        placeholder="Enter guardian full name"
                        className="w-full px-2 py-1.5 rounded-lg border border-slate-300 text-xs bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-0.5">Guardian Phone</label>
                      <input
                        type="tel"
                        value={userFormData.guardianPhone || ''}
                        onChange={(e) => setUserFormData({ ...userFormData, guardianPhone: e.target.value })}
                        placeholder="Enter guardian phone number"
                        className="w-full px-2 py-1.5 rounded-lg border border-slate-300 text-xs bg-white"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-0.5">Total Fees (UGX)</label>
                      <input
                        type="number"
                        value={userFormData.feesTotal || 0}
                        onChange={(e) => setUserFormData({ ...userFormData, feesTotal: Number(e.target.value) })}
                        className="w-full px-2 py-1.5 rounded-lg border border-slate-300 text-xs bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-0.5">Fees Paid (UGX)</label>
                      <input
                        type="number"
                        value={userFormData.feesPaid || 0}
                        onChange={(e) => setUserFormData({ ...userFormData, feesPaid: Number(e.target.value) })}
                        className="w-full px-2 py-1.5 rounded-lg border border-slate-300 text-xs bg-white"
                      />
                    </div>
                  </div>
                </div>
              )}

              {userFormData.role === 'staff' && (
                <div className="p-3.5 bg-blue-50/60 rounded-2xl border border-blue-200/60 space-y-3">
                  <h4 className="text-xs font-extrabold text-blue-900 uppercase tracking-wider">
                    Staff Designation & Department
                  </h4>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-0.5">Department</label>
                      <select
                        value={userFormData.department || 'Office of the Director of Studies (DOS)'}
                        onChange={(e) => setUserFormData({ ...userFormData, department: e.target.value as any })}
                        className="w-full px-2 py-1.5 rounded-lg border border-slate-300 text-xs bg-white"
                      >
                        <option value="Office of the Director of Studies (DOS)">Office of the Director of Studies (DOS)</option>
                        <option value="Sciences">Sciences</option>
                        <option value="Humanities">Humanities</option>
                        <option value="Languages">Languages</option>
                        <option value="Islamic Studies">Islamic Studies</option>
                        <option value="Vocational & Arts">Vocational & Arts</option>
                        <option value="Administration">Administration</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-0.5">Staff Title</label>
                      <select
                        value={userFormData.staffTitle || 'Director of Studies (DOS)'}
                        onChange={(e) => setUserFormData({ ...userFormData, staffTitle: e.target.value })}
                        className="w-full px-2 py-1.5 rounded-lg border border-slate-300 text-xs bg-white font-medium"
                      >
                        <option value="Director of Studies (DOS)">Director of Studies (DOS)</option>
                        <option value="Deputy Director of Studies (Deputy DOS)">Deputy Director of Studies (Deputy DOS)</option>
                        <option value="Head of Department (HOD)">Head of Department (HOD)</option>
                        <option value="Teacher">Teacher / Subject Master</option>
                        <option value="Class Teacher">Class Teacher</option>
                        <option value="Senior Chemistry Master">Senior Chemistry Master</option>
                        <option value="Senior Biology Master">Senior Biology Master</option>
                        <option value="Senior Physics Master">Senior Physics Master</option>
                        <option value="Senior Mathematics Master">Senior Mathematics Master</option>
                        <option value="Islamic Affairs Instructor">Islamic Affairs & Tahfiz Instructor</option>
                        <option value="Laboratory Custodian">Laboratory Custodian</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {userFormData.role === 'admin' && (
                <div className="p-3.5 bg-purple-50/60 rounded-2xl border border-purple-200/60 space-y-3">
                  <h4 className="text-xs font-extrabold text-purple-900 uppercase tracking-wider">
                    Admin Title & Privileges
                  </h4>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-0.5">Administrative Designation</label>
                    <select
                      value={userFormData.adminTitle || 'Director of Studies (DOS)'}
                      onChange={(e) => setUserFormData({ ...userFormData, adminTitle: e.target.value })}
                      className="w-full px-2.5 py-2 rounded-xl border border-slate-300 text-xs bg-white font-medium"
                    >
                      <option value="Director of Studies (DOS)">Director of Studies (DOS)</option>
                      <option value="Headteacher & Principal">Headteacher & Principal</option>
                      <option value="Deputy Headteacher (Academics)">Deputy Headteacher (Academics)</option>
                      <option value="Deputy Headteacher (Administration)">Deputy Headteacher (Administration)</option>
                      <option value="School Bursar & Finance Controller">School Bursar & Finance Controller</option>
                      <option value="IT & Systems Administrator">IT & Systems Administrator</option>
                    </select>
                  </div>
                </div>
              )}

              {userFormData.role === 'parent' && (
                <div className="p-3.5 bg-amber-50/60 rounded-2xl border border-amber-200/60 space-y-3">
                  <h4 className="text-xs font-extrabold text-amber-900 uppercase tracking-wider">
                    Parent / Guardian Linkage
                  </h4>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-0.5">Linked Student Name</label>
                      <input
                        type="text"
                        value={userFormData.linkedStudentName || ''}
                        onChange={(e) => setUserFormData({ ...userFormData, linkedStudentName: e.target.value })}
                        placeholder="Enter linked student name"
                        className="w-full px-2 py-1.5 rounded-lg border border-slate-300 text-xs bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-0.5">Relationship</label>
                      <select
                        value={userFormData.relationship || 'Mother'}
                        onChange={(e) => setUserFormData({ ...userFormData, relationship: e.target.value as any })}
                        className="w-full px-2 py-1.5 rounded-lg border border-slate-300 text-xs bg-white"
                      >
                        <option value="Father">Father</option>
                        <option value="Mother">Mother</option>
                        <option value="Guardian">Guardian</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* Submit Buttons */}
              <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowUserModal(false)}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white font-bold rounded-xl text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
                >
                  <Check className="w-4 h-4 text-amber-300" />
                  <span>{editingUserId ? 'Save User Changes' : 'Confirm & Create User'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: EDIT / CREATE MOCK & UNEB EXAM COUNTDOWN (Core User Requirement)     */}
      {/* ========================================================================= */}
      {showExamModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-emerald-900/30 overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-emerald-900 text-white p-5 flex items-center justify-between border-b-4 border-amber-400">
              <div className="flex items-center gap-2.5">
                <Clock className="w-5 h-5 text-amber-400" />
                <div>
                  <h3 className="font-black text-sm">
                    {editingExamId ? 'Edit Exam Countdown & UNEB Timetable' : 'Add New Exam Countdown'}
                  </h3>
                  <p className="text-[10px] text-emerald-200">
                    Live timer dates will automatically sync across the entire school app
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowExamModal(false)}
                className="text-emerald-300 hover:text-white p-1 rounded-lg cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSaveExam} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
              {examModalError && (
                <div className="p-3 bg-red-50 text-red-700 text-xs rounded-xl flex items-center gap-2 border border-red-200">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{examModalError}</span>
                </div>
              )}

              {examModalSuccess && (
                <div className="p-3 bg-emerald-50 text-emerald-800 text-xs rounded-xl flex items-center gap-2 border border-emerald-200">
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                  <span>{examModalSuccess}</span>
                </div>
              )}

              {/* Exam Name & Short Label */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Exam Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={examFormData.name || ''}
                    onChange={(e) => setExamFormData({ ...examFormData, name: e.target.value })}
                    placeholder="Enter examination title"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-slate-50 focus:outline-hidden focus:ring-2 focus:ring-emerald-600 font-semibold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Short Tab Label <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={examFormData.shortLabel || ''}
                    onChange={(e) => setExamFormData({ ...examFormData, shortLabel: e.target.value })}
                    placeholder="Enter short tab label"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-slate-50 focus:outline-hidden focus:ring-2 focus:ring-emerald-600 font-bold"
                  />
                </div>
              </div>

              {/* Exam Type & Target Class */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Exam Category
                  </label>
                  <select
                    value={examFormData.examType || 'mock'}
                    onChange={(e) => setExamFormData({ ...examFormData, examType: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-slate-50 focus:outline-hidden focus:ring-2 focus:ring-emerald-600 font-medium"
                  >
                    <option value="uneb">UNEB National Final Examination</option>
                    <option value="mock">Joint Mock Examination (MJMSS / Ankole)</option>
                    <option value="terminal">End of Term Promotional Assessment</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Target Class / Candidates
                  </label>
                  <input
                    type="text"
                    value={examFormData.targetClass || ''}
                    onChange={(e) => setExamFormData({ ...examFormData, targetClass: e.target.value })}
                    placeholder="Enter target candidate class"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-slate-50 focus:outline-hidden focus:ring-2 focus:ring-emerald-600"
                  />
                </div>
              </div>

              {/* CRITICAL: Target Countdown Date & Time (HTML datetime-local) */}
              <div className="p-4 bg-amber-50 rounded-2xl border-2 border-amber-300 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-black text-amber-950">
                    Target Countdown Date & Start Time <span className="text-red-600">*</span>
                  </label>
                  <span className="text-[11px] font-mono font-bold text-amber-900 bg-amber-200/60 px-2 py-0.5 rounded">
                    {calculateDaysLeft(examFormData.targetDate || '')}
                  </span>
                </div>
                <input
                  type="datetime-local"
                  required
                  value={examFormData.targetDate || ''}
                  onChange={(e) => setExamFormData({ ...examFormData, targetDate: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl border border-amber-400 text-xs bg-white font-mono font-bold text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                />
                <p className="text-[10px] text-amber-800">
                  Select the exact date and hour when Paper 1 begins. The live countdown ticker calculates remaining days, hours, and minutes from this timestamp.
                </p>
              </div>

              {/* Briefing Date, Venue & Supervisor */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Official Briefing Date & Time
                  </label>
                  <input
                    type="text"
                    value={examFormData.briefingDate || ''}
                    onChange={(e) => setExamFormData({ ...examFormData, briefingDate: e.target.value })}
                    placeholder="Enter briefing date and time"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-slate-50 focus:outline-hidden focus:ring-2 focus:ring-emerald-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Chief Invigilator / Supervisor
                  </label>
                  <input
                    type="text"
                    value={examFormData.supervisor || ''}
                    onChange={(e) => setExamFormData({ ...examFormData, supervisor: e.target.value })}
                    placeholder="Enter chief supervisor / invigilator"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-slate-50 focus:outline-hidden focus:ring-2 focus:ring-emerald-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Exam Center / Venue
                  </label>
                  <input
                    type="text"
                    value={examFormData.venue || ''}
                    onChange={(e) => setExamFormData({ ...examFormData, venue: e.target.value })}
                    placeholder="Enter exam venue or hall"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-slate-50 focus:outline-hidden focus:ring-2 focus:ring-emerald-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Highlight Focus Subjects
                  </label>
                  <input
                    type="text"
                    value={examFormData.highlightSubject || ''}
                    onChange={(e) => setExamFormData({ ...examFormData, highlightSubject: e.target.value })}
                    placeholder="Enter highlight focus subjects"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-slate-50 focus:outline-hidden focus:ring-2 focus:ring-emerald-600"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Candidate Instructions / Description
                </label>
                <textarea
                  rows={2}
                  value={examFormData.description || ''}
                  onChange={(e) => setExamFormData({ ...examFormData, description: e.target.value })}
                  placeholder="Enter syllabus notes, instructions, or candidate guidelines..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-slate-50 focus:outline-hidden focus:ring-2 focus:ring-emerald-600"
                />
              </div>

              {/* Papers Timetable Manager */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                    <FileText className="w-4 h-4 text-emerald-700" />
                    <span>Exam Papers Timetable ({examFormData.papers?.length || 0} Papers)</span>
                  </h4>
                </div>

                {/* Existing Papers List */}
                {examFormData.papers && examFormData.papers.length > 0 && (
                  <div className="space-y-1.5 max-h-40 overflow-y-auto">
                    {examFormData.papers.map((p, idx) => (
                      <div 
                        key={p.id || idx}
                        className="p-2 rounded-xl bg-white border border-slate-200 flex items-center justify-between text-xs"
                      >
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-[10px] bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded font-bold">
                            {p.code}
                          </span>
                          <span className="font-bold text-slate-900">{p.paper}</span>
                          <span className="text-[10px] text-slate-500">({p.date} • {p.time})</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemovePaperFromExam(idx)}
                          className="text-red-500 hover:text-red-700 p-1 cursor-pointer"
                          title="Remove Paper"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Add Paper Row */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-slate-200">
                  <input
                    type="text"
                    value={paperDraft.paper}
                    onChange={(e) => setPaperDraft({ ...paperDraft, paper: e.target.value })}
                    placeholder="Paper title"
                    className="px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs bg-white"
                  />
                  <input
                    type="text"
                    value={paperDraft.code}
                    onChange={(e) => setPaperDraft({ ...paperDraft, code: e.target.value })}
                    placeholder="Paper code"
                    className="px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs bg-white font-mono"
                  />
                  <input
                    type="text"
                    value={paperDraft.date}
                    onChange={(e) => setPaperDraft({ ...paperDraft, date: e.target.value })}
                    placeholder="Exam date"
                    className="px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs bg-white"
                  />
                  <div className="flex items-center gap-1">
                    <input
                      type="text"
                      value={paperDraft.time}
                      onChange={(e) => setPaperDraft({ ...paperDraft, time: e.target.value })}
                      placeholder="Start time"
                      className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs bg-white"
                    />
                    <button
                      type="button"
                      onClick={handleAddPaperToExam}
                      className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-bold shrink-0 cursor-pointer"
                    >
                      + Add
                    </button>
                  </div>
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowExamModal(false)}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black rounded-xl text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
                >
                  <Check className="w-4 h-4 text-slate-950" />
                  <span>{editingExamId ? 'Save Countdown Changes' : 'Confirm & Publish Countdown'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: DELETE USER CONFIRMATION                                           */}
      {/* ========================================================================= */}
      {userToDelete && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in">
            <div className="bg-red-600 text-white p-5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-amber-300" />
                <h3 className="font-extrabold text-sm">Delete User Account</h3>
              </div>
              <button
                onClick={() => setUserToDelete(null)}
                className="text-white/80 hover:text-white cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="p-6">
              {userDeleteError && (
                <div className="mb-4 p-3 rounded-xl bg-red-50 text-red-700 text-xs flex items-center gap-2 border border-red-200">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{userDeleteError}</span>
                </div>
              )}

              <p className="text-sm text-slate-800 font-semibold mb-2">
                Are you sure you want to permanently delete this account?
              </p>
              
              <div className="bg-slate-100 p-3.5 rounded-xl text-xs font-mono mb-4 border border-slate-200">
                <p className="font-bold text-slate-900">{userToDelete.fullName}</p>
                <p className="text-slate-600 font-sans">
                  Role: <span className="capitalize font-bold">{userToDelete.role}</span> • Identifier: @{userToDelete.username}
                </p>
              </div>

              <div className="flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setUserToDelete(null)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleConfirmDeleteUser}
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-red-600 hover:bg-red-700 text-white shadow-md cursor-pointer active:scale-95"
                >
                  Confirm Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: DELETE EXAM COUNTDOWN CONFIRMATION                                 */}
      {/* ========================================================================= */}
      {examToDelete && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in">
            <div className="bg-red-600 text-white p-5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-amber-300" />
                <h3 className="font-extrabold text-sm">Delete Exam Countdown</h3>
              </div>
              <button
                onClick={() => setExamToDelete(null)}
                className="text-white/80 hover:text-white cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="p-6">
              <p className="text-sm text-slate-800 font-semibold mb-2">
                Are you sure you want to remove the countdown timer for:
              </p>
              
              <div className="bg-slate-100 p-3.5 rounded-xl text-xs font-mono mb-4 border border-slate-200">
                <p className="font-bold text-slate-900">{examToDelete.name}</p>
                <p className="text-slate-600 font-sans">
                  Target: {examToDelete.targetClass} • Date: {examToDelete.targetDate}
                </p>
              </div>

              <div className="flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setExamToDelete(null)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleConfirmDeleteExam}
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-red-600 hover:bg-red-700 text-white shadow-md cursor-pointer active:scale-95"
                >
                  Confirm Remove
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: UPLOAD / PUBLISH OFFICIAL EXAMINATION ASSESSMENT                   */}
      {/* ========================================================================= */}
      {isAssessmentModalOpen && assessmentTargetStudent && (() => {
        const stats = computeAggregatesAndDivision(assessmentForm.grades);
        const previewRank = calculateRealClassRank(assessmentTargetStudent.id, assessmentTargetStudent.className || '', users);
        const previewComb = recommendCombinationFromPerformance(assessmentForm.grades);

        return (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
            <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-slate-200 animate-in fade-in my-auto">
              {/* Modal Header */}
              <div className="bg-gradient-to-r from-emerald-950 via-emerald-900 to-teal-950 text-white p-5 flex items-center justify-between sticky top-0 z-10 border-b border-emerald-800">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center font-black shrink-0">
                    <FileUp className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-sm sm:text-base leading-tight">
                      Upload Official Examination Assessment
                    </h3>
                    <p className="text-xs text-emerald-200">
                      Learner: <strong className="text-white">{assessmentTargetStudent.fullName}</strong> • {assessmentTargetStudent.className} {assessmentTargetStudent.stream} • Index: {assessmentTargetStudent.indexNumber || assessmentTargetStudent.username}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsAssessmentModalOpen(false)}
                  className="text-white/80 hover:text-white p-2 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Form Content */}
              <form onSubmit={handleSaveOfficialAssessment} className="p-5 sm:p-6 space-y-6">
                {assessmentErrorMsg && (
                  <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{assessmentErrorMsg}</span>
                  </div>
                )}

                {assessmentSuccessMsg && (
                  <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs rounded-xl flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                    <span>{assessmentSuccessMsg}</span>
                  </div>
                )}

                {/* Live Real-Time Statistics Preview */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-200">
                  <div>
                    <span className="text-[10px] font-bold text-slate-500 uppercase block">Computed Aggregates</span>
                    <span className="text-2xl font-black text-emerald-800 block mt-0.5">{stats.aggregates}</span>
                    <span className="text-xs font-semibold text-emerald-600">{stats.division}</span>
                  </div>

                  <div>
                    <span className="text-[10px] font-bold text-slate-500 uppercase block">Class Rank Projection</span>
                    <span className="text-2xl font-black text-slate-900 block mt-0.5">{previewRank.rankText}</span>
                    <span className="text-xs font-semibold text-blue-600">{previewRank.cohortLabel}</span>
                  </div>

                  <div>
                    <span className="text-[10px] font-bold text-amber-900 uppercase block">Recommended S.5 Combination</span>
                    <span className="text-xl font-black text-amber-700 block mt-0.5">{previewComb.code}</span>
                    <span className="text-[11px] text-slate-600 truncate block">{previewComb.title}</span>
                  </div>
                </div>

                {/* Metadata Fields */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700">Academic Term</label>
                    <select
                      value={assessmentForm.term}
                      onChange={(e) => setAssessmentForm({ ...assessmentForm, term: e.target.value })}
                      className="w-full text-xs p-2.5 rounded-xl border border-slate-300 bg-white font-semibold outline-none focus:border-emerald-600"
                    >
                      <option value="Term I">Term I</option>
                      <option value="Term II">Term II</option>
                      <option value="Term III">Term III (Promotional)</option>
                      <option value="UNEB Mock">UNEB Mock Examination</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700">Academic Year</label>
                    <input
                      type="text"
                      value={assessmentForm.academicYear}
                      onChange={(e) => setAssessmentForm({ ...assessmentForm, academicYear: e.target.value })}
                      placeholder="2026"
                      className="w-full text-xs p-2.5 rounded-xl border border-slate-300 font-semibold outline-none focus:border-emerald-600"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700">Official Promotional Status</label>
                    <select
                      value={assessmentForm.status}
                      onChange={(e) => setAssessmentForm({ ...assessmentForm, status: e.target.value })}
                      className="w-full text-xs p-2.5 rounded-xl border border-slate-300 bg-white font-semibold outline-none focus:border-emerald-600"
                    >
                      <option value="Division 1 Distinction - Promoted">Division 1 Distinction - Promoted</option>
                      <option value="Promoted to S.5 UACE">Promoted to S.5 UACE</option>
                      <option value="Academic Term in Progress">Academic Term in Progress</option>
                      <option value="Division 2 Credit - Promoted">Division 2 Credit - Promoted</option>
                      <option value="Recommended for S.5 Science Wing">Recommended for S.5 Science Wing</option>
                      <option value="Recommended for S.5 Arts & Humanities">Recommended for S.5 Arts & Humanities</option>
                      <option value="Promotional Evaluation Pending">Promotional Evaluation Pending</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700">Examination Assessment Title</label>
                    <input
                      type="text"
                      value={assessmentForm.examTitle}
                      onChange={(e) => setAssessmentForm({ ...assessmentForm, examTitle: e.target.value })}
                      placeholder="e.g. Senior Four Term I UNEB Pre-Candidate Assessment 2026"
                      className="w-full text-xs p-2.5 rounded-xl border border-slate-300 font-semibold outline-none focus:border-emerald-600"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700">Certified Attachment / PDF Slip File</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={assessmentForm.fileAttachmentName}
                        onChange={(e) => setAssessmentForm({ ...assessmentForm, fileAttachmentName: e.target.value })}
                        placeholder="e.g. SISS-Official-Assessment-2026.pdf"
                        className="w-full text-xs p-2.5 rounded-xl border border-slate-300 outline-none focus:border-emerald-600"
                      />
                      <button
                        type="button"
                        onClick={() => setAssessmentForm({ ...assessmentForm, fileAttachmentName: `SISS-${(assessmentTargetStudent.className || 'S4').replace(/\s+/g, '')}-${assessmentTargetStudent.fullName.split(' ')[0]}-Official-Report.pdf` })}
                        className="px-3 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl whitespace-nowrap cursor-pointer"
                        title="Generate Official File Name"
                      >
                        Auto Name
                      </button>
                    </div>
                  </div>
                </div>

                {/* Preset Buttons & Subject Marks Table */}
                <div className="space-y-3 pt-2">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-slate-200 pb-2">
                    <div>
                      <h4 className="font-extrabold text-xs text-slate-800 uppercase tracking-wide">
                        Subject Marks & UNEB Grade Matrix
                      </h4>
                      <p className="text-[11px] text-slate-500">
                        Enter percentage marks (0-100%). UNEB standard grade points (D1-F9) and aggregates update automatically.
                      </p>
                    </div>

                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-[11px] font-bold text-slate-400">Presets:</span>
                      <button
                        type="button"
                        onClick={() => handleLoadPresetSubjects('olevel')}
                        className="px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-lg text-[11px] font-bold cursor-pointer"
                      >
                        + O-Level Core (10)
                      </button>
                      <button
                        type="button"
                        onClick={() => handleLoadPresetSubjects('sciences')}
                        className="px-2.5 py-1 bg-blue-50 hover:bg-blue-100 text-blue-800 border border-blue-200 rounded-lg text-[11px] font-bold cursor-pointer"
                      >
                        + A-Level Sciences
                      </button>
                      <button
                        type="button"
                        onClick={() => handleLoadPresetSubjects('arts')}
                        className="px-2.5 py-1 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 rounded-lg text-[11px] font-bold cursor-pointer"
                      >
                        + A-Level Arts
                      </button>
                    </div>
                  </div>

                  <div className="border border-slate-200 rounded-2xl overflow-hidden">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-100 text-slate-700 uppercase font-bold border-b border-slate-200">
                        <tr>
                          <th className="py-2.5 px-3">Subject Name</th>
                          <th className="py-2.5 px-3 w-24 text-center">Score (%)</th>
                          <th className="py-2.5 px-3 w-28 text-center">UNEB Grade</th>
                          <th className="py-2.5 px-3">Subject Teacher Remarks</th>
                          <th className="py-2.5 px-3 w-12 text-center">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {assessmentForm.grades.map((g, idx) => (
                          <tr key={idx} className="hover:bg-slate-50">
                            <td className="p-2">
                              <input
                                type="text"
                                value={g.subject}
                                onChange={(e) => handleAssessmentGradeChange(idx, 'subject', e.target.value)}
                                className="w-full p-1.5 border border-slate-200 rounded-lg text-xs font-semibold focus:border-emerald-600 outline-none"
                              />
                            </td>
                            <td className="p-2 text-center">
                              <input
                                type="number"
                                min="0"
                                max="100"
                                value={g.score}
                                onChange={(e) => handleAssessmentGradeChange(idx, 'score', e.target.value)}
                                className="w-16 p-1.5 border border-slate-200 rounded-lg text-xs font-bold text-center focus:border-emerald-600 outline-none"
                              />
                            </td>
                            <td className="p-2 text-center">
                              <span className={`px-2 py-1 rounded-full font-bold text-[11px] inline-block ${
                                g.grade === 'D1' || g.grade === 'D2'
                                  ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                                  : g.grade.startsWith('C')
                                  ? 'bg-blue-100 text-blue-900 border border-blue-300'
                                  : 'bg-amber-100 text-amber-900 border border-amber-300'
                              }`}>
                                {g.grade}
                              </span>
                            </td>
                            <td className="p-2">
                              <input
                                type="text"
                                value={g.remarks}
                                onChange={(e) => handleAssessmentGradeChange(idx, 'remarks', e.target.value)}
                                placeholder="Teacher remarks..."
                                className="w-full p-1.5 border border-slate-200 rounded-lg text-xs focus:border-emerald-600 outline-none"
                              />
                            </td>
                            <td className="p-2 text-center">
                              <button
                                type="button"
                                onClick={() => handleRemoveAssessmentSubject(idx)}
                                className="p-1 text-red-500 hover:text-red-700 hover:bg-red-50 rounded cursor-pointer"
                                title="Remove Subject"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <button
                    type="button"
                    onClick={handleAddAssessmentSubject}
                    className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl flex items-center gap-1.5 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Another Subject</span>
                  </button>
                </div>

                {/* Remarks */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
                      <span>Class Teacher / Director of Studies (DOS) Remarks</span>
                      <button
                        type="button"
                        onClick={() => setAssessmentForm({ ...assessmentForm, classTeacherRemarks: `${assessmentTargetStudent.fullName} exhibits outstanding discipline and mastery of syllabus competencies. Recommended for S.5.` })}
                        className="text-[10px] text-emerald-700 hover:underline"
                      >
                        Default Remark
                      </button>
                    </label>
                    <textarea
                      rows={3}
                      value={assessmentForm.classTeacherRemarks}
                      onChange={(e) => setAssessmentForm({ ...assessmentForm, classTeacherRemarks: e.target.value })}
                      placeholder="Official academic remarks from DOS or Class Teacher..."
                      className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:border-emerald-600 outline-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
                      <span>Headteacher's Official Endorsement</span>
                      <button
                        type="button"
                        onClick={() => setAssessmentForm({ ...assessmentForm, headteacherRemarks: `"Masha'Allah! An exemplary performance. Continue striving for excellence and righteousness." — Ustadh Sulaiman, Headteacher` })}
                        className="text-[10px] text-emerald-700 hover:underline"
                      >
                        Default Remark
                      </button>
                    </label>
                    <textarea
                      rows={3}
                      value={assessmentForm.headteacherRemarks}
                      onChange={(e) => setAssessmentForm({ ...assessmentForm, headteacherRemarks: e.target.value })}
                      placeholder="Official seal and comment from the Headteacher..."
                      className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:border-emerald-600 outline-none"
                    />
                  </div>
                </div>

                {/* Submit Actions */}
                <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
                  <button
                    type="button"
                    onClick={() => setIsAssessmentModalOpen(false)}
                    className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl text-xs font-bold bg-emerald-700 hover:bg-emerald-800 text-white shadow-md cursor-pointer active:scale-95 flex items-center gap-2"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Publish Official Assessment to Student Portal</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        );
      })()}
    </div>
  );
};
