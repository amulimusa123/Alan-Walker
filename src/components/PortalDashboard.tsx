import React, { useState, useEffect, useMemo } from 'react';
import { UserRole, StudentProfile } from '../types';
import { SCHOOL_INFO, PAYMENT_METHODS } from '../data/schoolData';
import { 
  GraduationCap, 
  CreditCard, 
  BookOpen, 
  Calendar, 
  User, 
  CheckCircle2, 
  Download, 
  LogOut, 
  Globe, 
  Clock, 
  Award,
  AlertCircle,
  FileCheck,
  Building,
  Plus,
  Printer,
  History,
  ShieldCheck,
  Target,
  Save,
  Send,
  Sparkles,
  Check,
  FileText,
  FileUp,
  BookmarkCheck
} from 'lucide-react';
import { 
  getStoredStudentProfile, 
  saveStoredStudentProfile, 
  getStoredPayments, 
  saveOfflinePayment,
  OfflineFeePayment 
} from '../services/offlineStorage';
import { getStoredUsers, updateUser } from '../services/userStorage';
import { 
  calculateRealClassRank, 
  recommendCombinationFromPerformance, 
  computeAggregatesAndDivision 
} from '../services/academicGrading';
import { DEMO_STUDENT } from '../data/schoolData';
import { ExamCountdownTimer } from './ExamCountdownTimer';
import { AcademicCalendar } from './AcademicCalendar';

interface PortalDashboardProps {
  currentUser: { name: string; role: UserRole; username?: string; id?: string };
  onLogout: () => void;
  onGoToWebsite: () => void;
}

export const PortalDashboard: React.FC<PortalDashboardProps> = ({
  currentUser,
  onLogout,
  onGoToWebsite,
}) => {
  const [activeTab, setActiveTab] = useState<'academics' | 'fees' | 'islamic' | 'timetable'>('academics');

  const resolveCurrentStudent = (): StudentProfile => {
    try {
      const allUsers = getStoredUsers();

      // 1. If currentUser is a student, look up their exact user record
      if (currentUser.role === 'student') {
        const match = allUsers.find(
          (u) =>
            u.role === 'student' &&
            ((currentUser.id && u.id === currentUser.id) ||
             (currentUser.username && (u.username.toLowerCase() === currentUser.username.toLowerCase() || u.indexNumber?.toLowerCase() === currentUser.username.toLowerCase())) ||
             u.fullName.toLowerCase() === currentUser.name.toLowerCase())
        );
        if (match) {
          const activeGrades = match.examinationAssessment?.grades && match.examinationAssessment.grades.length > 0
            ? match.examinationAssessment.grades
            : (match.recentGrades || DEMO_STUDENT.recentGrades);
          const computedStats = computeAggregatesAndDivision(activeGrades);

          return {
            id: match.id,
            fullName: match.fullName,
            indexNumber: match.indexNumber || match.username,
            admissionNumber: match.admissionNumber || match.username,
            className: match.className || 'Senior Four',
            stream: match.stream || '',
            section: match.section || 'Day',
            house: match.house || 'Campus Hall',
            guardianName: match.guardianName || 'Parent / Guardian',
            guardianPhone: match.guardianPhone || '',
            feesTotal: match.feesTotal ?? 950000,
            feesPaid: match.feesPaid ?? 0,
            feesBalance: match.feesBalance ?? Math.max(0, (match.feesTotal ?? 950000) - (match.feesPaid ?? 0)),
            recentGrades: activeGrades,
            aggregates: match.aggregates ?? computedStats.aggregates,
            division: match.division || computedStats.division,
            prayerAttendance: match.prayerAttendance ?? 100,
            quranProgress: match.quranProgress || 'Standard Quran & Tajweed',
            conductRemarks: match.notes || `${match.fullName} demonstrates consistent discipline and positive academic spirit.`,
            examinationAssessment: match.examinationAssessment,
            studentStudyNotes: match.studentStudyNotes || '',
            studentAcademicGoals: match.studentAcademicGoals || '',
            studentFeedback: match.studentFeedback || '',
            studentPreferredCombination: match.studentPreferredCombination || '',
            studentTargetAggregates: match.studentTargetAggregates,
            studentActionPlan: match.studentActionPlan || '',
            studentNotesSavedAt: match.studentNotesSavedAt,
          };
        }
      }

      // 2. If currentUser is a parent, find their linked student
      if (currentUser.role === 'parent') {
        const parentUser = allUsers.find(
          (u) =>
            u.role === 'parent' &&
            ((currentUser.id && u.id === currentUser.id) ||
             (currentUser.username && u.username === currentUser.username) ||
             u.fullName.toLowerCase() === currentUser.name.toLowerCase())
        );
        if (parentUser?.linkedStudentName) {
          const linkedStudent = allUsers.find(
            (u) =>
              u.role === 'student' &&
              (u.fullName.toLowerCase() === parentUser.linkedStudentName?.toLowerCase() ||
               u.admissionNumber === parentUser.linkedStudentAdmission)
          );
          if (linkedStudent) {
            const activeGrades = linkedStudent.examinationAssessment?.grades && linkedStudent.examinationAssessment.grades.length > 0
              ? linkedStudent.examinationAssessment.grades
              : (linkedStudent.recentGrades || DEMO_STUDENT.recentGrades);
            const computedStats = computeAggregatesAndDivision(activeGrades);

            return {
              id: linkedStudent.id,
              fullName: linkedStudent.fullName,
              indexNumber: linkedStudent.indexNumber || linkedStudent.username,
              admissionNumber: linkedStudent.admissionNumber || linkedStudent.username,
              className: linkedStudent.className || 'Senior Four',
              stream: linkedStudent.stream || '',
              section: linkedStudent.section || 'Boarding',
              house: linkedStudent.house || 'Campus Hall',
              guardianName: parentUser.fullName,
              guardianPhone: parentUser.phone || '',
              feesTotal: linkedStudent.feesTotal ?? 950000,
              feesPaid: linkedStudent.feesPaid ?? 0,
              feesBalance: linkedStudent.feesBalance ?? Math.max(0, (linkedStudent.feesTotal ?? 950000) - (linkedStudent.feesPaid ?? 0)),
              recentGrades: activeGrades,
              aggregates: linkedStudent.aggregates ?? computedStats.aggregates,
              division: linkedStudent.division || computedStats.division,
              prayerAttendance: linkedStudent.prayerAttendance ?? 100,
              quranProgress: linkedStudent.quranProgress || 'Standard Quran Curriculum',
              conductRemarks: linkedStudent.notes || `${linkedStudent.fullName} shows excellent character and focus under parental supervision.`,
              examinationAssessment: linkedStudent.examinationAssessment,
              studentStudyNotes: linkedStudent.studentStudyNotes || '',
              studentAcademicGoals: linkedStudent.studentAcademicGoals || '',
              studentFeedback: linkedStudent.studentFeedback || '',
              studentPreferredCombination: linkedStudent.studentPreferredCombination || '',
              studentTargetAggregates: linkedStudent.studentTargetAggregates,
              studentActionPlan: linkedStudent.studentActionPlan || '',
              studentNotesSavedAt: linkedStudent.studentNotesSavedAt,
            };
          }
        }
      }
    } catch (e) {
      console.warn('Error resolving current student profile:', e);
    }

    return getStoredStudentProfile();
  };

  const [student, setStudent] = useState<StudentProfile>(resolveCurrentStudent());
  const [payments, setPayments] = useState<OfflineFeePayment[]>(getStoredPayments());
  const [showPayModal, setShowPayModal] = useState(false);
  const [payAmount, setPayAmount] = useState('');
  const [payChannel, setPayChannel] = useState('Centenary Bank Mbarara Branch');
  const [payRef, setPayRef] = useState('');

  // Learner Write-In State (Students have Read & Write permissions)
  const [studyNotes, setStudyNotes] = useState(student.studentStudyNotes || '');
  const [academicGoals, setAcademicGoals] = useState(student.studentAcademicGoals || '');
  const [actionPlan, setActionPlan] = useState(student.studentActionPlan || '');
  const [preferredComb, setPreferredComb] = useState(student.studentPreferredCombination || '');
  const [targetAggregates, setTargetAggregates] = useState<number | ''>(student.studentTargetAggregates ?? '');
  const [studentFeedbackMsg, setStudentFeedbackMsg] = useState(student.studentFeedback || '');
  const [saveSuccessMsg, setSaveSuccessMsg] = useState<string | null>(null);
  const [isSavingNotes, setIsSavingNotes] = useState(false);

  // Real Class Rank computed dynamically among enrolled students in this class
  const classRankInfo = useMemo(() => {
    const allUsers = getStoredUsers();
    return calculateRealClassRank(student.id, student.className, allUsers);
  }, [student.id, student.className, student.aggregates, student.recentGrades, student.examinationAssessment]);

  // Recommended S.5 Combination computed dynamically based on real marks
  const recommendedComb = useMemo(() => {
    const activeGrades = student.examinationAssessment?.grades && student.examinationAssessment.grades.length > 0
      ? student.examinationAssessment.grades
      : student.recentGrades;
    return recommendCombinationFromPerformance(activeGrades);
  }, [student.examinationAssessment, student.recentGrades]);

  useEffect(() => {
    const refreshed = resolveCurrentStudent();
    setStudent(refreshed);
    setPayments(getStoredPayments());
    setStudyNotes(refreshed.studentStudyNotes || '');
    setAcademicGoals(refreshed.studentAcademicGoals || '');
    setActionPlan(refreshed.studentActionPlan || '');
    setPreferredComb(refreshed.studentPreferredCombination || '');
    setTargetAggregates(refreshed.studentTargetAggregates ?? '');
    setStudentFeedbackMsg(refreshed.studentFeedback || '');
  }, [currentUser]);

  const handleSaveStudentNotes = () => {
    setIsSavingNotes(true);
    const now = new Date().toLocaleString('en-UG', { dateStyle: 'medium', timeStyle: 'short' });
    const updates = {
      studentStudyNotes: studyNotes,
      studentAcademicGoals: academicGoals,
      studentActionPlan: actionPlan,
      studentPreferredCombination: preferredComb,
      studentTargetAggregates: targetAggregates !== '' ? Number(targetAggregates) : undefined,
      studentFeedback: studentFeedbackMsg,
      studentNotesSavedAt: now,
    };

    updateUser(student.id, updates);
    const updatedStudent: StudentProfile = {
      ...student,
      ...updates,
    };
    setStudent(updatedStudent);
    saveStoredStudentProfile(updatedStudent);
    setIsSavingNotes(false);
    setSaveSuccessMsg('Your academic reflections, revision plan, and combination choices have been saved successfully to your student file!');
    setTimeout(() => setSaveSuccessMsg(null), 6000);
  };

  const handlePrintReport = () => {
    window.print();
  };

  const handleMakePayment = (e: React.FormEvent) => {
    e.preventDefault();
    const amountNum = parseInt(payAmount) || 0;
    if (amountNum <= 0) return;

    saveOfflinePayment({
      studentIndex: student.indexNumber,
      amount: amountNum,
      paymentMethod: payChannel,
      referenceNumber: payRef || `MBR-${Math.floor(10000 + Math.random() * 90000)}`,
      date: new Date().toISOString().slice(0, 10),
      status: 'Confirmed',
    });

    setStudent(getStoredStudentProfile());
    setPayments(getStoredPayments());
    setShowPayModal(false);
    setPayRef('');
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800 pb-16">
      {/* Top Portal Navigation */}
      <header className="bg-emerald-950 text-white border-b-4 border-amber-400 sticky top-0 z-30 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-800 border border-amber-400 flex items-center justify-center font-serif font-black text-amber-300">
              S
            </div>
            <div>
              <h1 className="font-extrabold text-sm sm:text-base leading-tight">
                {SCHOOL_INFO.name}
              </h1>
              <p className="text-[11px] text-emerald-300 font-mono">
                Student Portal • UNEB Center No: {SCHOOL_INFO.unebCenterNumber}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={onGoToWebsite}
              className="bg-emerald-800 hover:bg-emerald-700 text-emerald-100 hover:text-white px-3 py-1.5 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 border border-emerald-700 cursor-pointer"
            >
              <Globe className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline">Public Website</span>
            </button>

            <button
              onClick={onLogout}
              className="bg-red-900/60 hover:bg-red-800 text-red-200 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1 cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Student Header Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-6 pb-2">
        <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-sm border border-slate-200 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-emerald-100 border-2 border-emerald-600 flex items-center justify-center text-emerald-900 font-black text-2xl shrink-0">
              {student.fullName.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-xl font-black text-slate-900">{student.fullName}</h2>
                <span className="bg-emerald-100 text-emerald-900 text-xs px-2.5 py-0.5 rounded-full font-bold">
                  {student.className} {student.stream}
                </span>
                <span className="bg-amber-100 text-amber-900 text-xs px-2.5 py-0.5 rounded-full font-bold">
                  {student.section}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1 flex flex-wrap items-center gap-x-4 gap-y-1">
                <span><strong>UNEB Index:</strong> {student.indexNumber}</span>
                <span><strong>Admission No:</strong> {student.admissionNumber}</span>
                <span><strong>House:</strong> {student.house}</span>
                <span><strong>Guardian:</strong> {student.guardianName} ({student.guardianPhone})</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-stretch md:self-auto border-t md:border-t-0 pt-3 md:pt-0">
            <button
              onClick={handlePrintReport}
              className="w-full md:w-auto px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold shadow-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Print Official Report Card</span>
            </button>
          </div>
        </div>

        {/* Dashboard Tabs */}
        <div className="flex items-center gap-2 mt-6 border-b border-slate-200 overflow-x-auto pb-1 text-xs font-bold">
          <button
            onClick={() => setActiveTab('academics')}
            className={`px-4 py-2.5 rounded-t-xl transition-colors flex items-center gap-2 border-b-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'academics'
                ? 'bg-white text-emerald-900 border-emerald-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900 border-transparent'
            }`}
          >
            <GraduationCap className="w-4 h-4 text-emerald-700" />
            <span>Academic Marks & Results Slip</span>
          </button>

          <button
            onClick={() => setActiveTab('fees')}
            className={`px-4 py-2.5 rounded-t-xl transition-colors flex items-center gap-2 border-b-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'fees'
                ? 'bg-white text-emerald-900 border-emerald-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900 border-transparent'
            }`}
          >
            <CreditCard className="w-4 h-4 text-emerald-700" />
            <span>School Fees & Payment Slips</span>
          </button>

          <button
            onClick={() => setActiveTab('islamic')}
            className={`px-4 py-2.5 rounded-t-xl transition-colors flex items-center gap-2 border-b-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'islamic'
                ? 'bg-white text-emerald-900 border-emerald-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900 border-transparent'
            }`}
          >
            <BookOpen className="w-4 h-4 text-emerald-700" />
            <span>Tarbiyyah & Tahfiz Record</span>
          </button>

          <button
            onClick={() => setActiveTab('timetable')}
            className={`px-4 py-2.5 rounded-t-xl transition-colors flex items-center gap-2 border-b-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'timetable'
                ? 'bg-white text-emerald-900 border-emerald-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900 border-transparent'
            }`}
          >
            <Calendar className="w-4 h-4 text-emerald-700" />
            <span>Terminal Calendar & Prep Timetable</span>
          </button>
        </div>
      </div>

      {/* Tab Contents */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        {/* Countdown Timer for Upcoming O-Level / A-Level Mock Exams */}
        <ExamCountdownTimer />

        {/* ACADEMICS TAB */}
        {activeTab === 'academics' && (
          <div className="space-y-6">
            {/* Top Academic Stats Cards with Real Computations */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs relative overflow-hidden">
                <div className="flex items-center justify-between">
                  <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">UNEB Aggregate & Division</div>
                  <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                    {student.division.includes('Division 1') ? 'Distinction' : 'UNEB Standard'}
                  </span>
                </div>
                <div className="text-3xl font-black text-emerald-800 mt-2">{student.aggregates}</div>
                <div className="text-xs font-bold text-emerald-700 mt-1">{student.division}</div>
                <p className="text-[11px] text-slate-400 mt-1">Computed from best 8 subject aggregates</p>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs relative overflow-hidden">
                <div className="flex items-center justify-between">
                  <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Class Rank</div>
                  <span className="text-[10px] font-bold bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full flex items-center gap-1">
                    <Award className="w-3 h-3" />
                    <span>Real Ranking</span>
                  </span>
                </div>
                <div className="text-3xl font-black text-slate-900 mt-2">{classRankInfo.rankText}</div>
                <div className="text-xs font-bold text-blue-700 mt-1">
                  {classRankInfo.cohortLabel}
                </div>
                <p className="text-[11px] text-slate-400 mt-1">
                  Ranked among active students in {student.className}
                </p>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-amber-200 bg-amber-50/20 shadow-xs relative overflow-hidden">
                <div className="flex items-center justify-between">
                  <div className="text-xs font-bold text-amber-900 uppercase tracking-wider">Recommended S.5 Combination</div>
                  <span className="text-[10px] font-bold bg-amber-200/80 text-amber-950 px-2 py-0.5 rounded-full flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-amber-700" />
                    <span>Based on Performance</span>
                  </span>
                </div>
                <div className="text-2xl font-black text-amber-700 mt-2">{recommendedComb.code}</div>
                <div className="text-xs font-bold text-slate-800 mt-0.5 truncate">{recommendedComb.title}</div>
                <p className="text-[11px] text-slate-600 mt-1 leading-snug line-clamp-2">
                  {recommendedComb.rationale}
                </p>
              </div>
            </div>

            {/* Official Examination Assessment Uploaded by Administrator */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
              <div className="p-4 sm:p-5 bg-gradient-to-r from-emerald-900 via-emerald-800 to-teal-900 text-white flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="px-2.5 py-0.5 bg-amber-400 text-slate-950 font-black text-[10px] uppercase rounded-full tracking-wide flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      Official School Assessment
                    </span>
                    <span className="text-xs text-emerald-200 font-mono">
                      {student.examinationAssessment ? `${student.examinationAssessment.term} ${student.examinationAssessment.academicYear}` : 'Current Academic Record'}
                    </span>
                  </div>
                  <h3 className="text-base font-black text-white mt-1">
                    {student.examinationAssessment?.examTitle || `${student.className} Official Examination Assessment`}
                  </h3>
                  <p className="text-xs text-emerald-200/90 mt-0.5">
                    {student.examinationAssessment?.uploadedBy 
                      ? `Uploaded & Certified by: ${student.examinationAssessment.uploadedBy} on ${new Date(student.examinationAssessment.uploadedAt).toLocaleDateString()}` 
                      : 'Certified by the Academic Dean & Office of the Director of Studies (DOS)'}
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
                  <span className="px-3 py-1 bg-white/15 border border-white/20 text-white rounded-full font-bold text-xs backdrop-blur-xs">
                    Status: {student.examinationAssessment?.status || 'Academic Term in Progress'}
                  </span>
                  {student.examinationAssessment?.fileAttachmentName && (
                    <div className="px-3 py-1 bg-amber-400/90 text-slate-950 rounded-full font-bold text-xs flex items-center gap-1.5 shadow-xs">
                      <FileText className="w-3.5 h-3.5" />
                      <span className="truncate max-w-[150px]">{student.examinationAssessment.fileAttachmentName}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Assessment Marks Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-100 text-slate-700 uppercase font-bold border-b border-slate-200">
                    <tr>
                      <th className="py-3 px-4">Subject</th>
                      <th className="py-3 px-4 text-center">Score (%)</th>
                      <th className="py-3 px-4 text-center">UNEB Grade</th>
                      <th className="py-3 px-4">Subject Teacher Remarks & Competencies</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {student.recentGrades.map((grade, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3.5 px-4 font-bold text-slate-900">{grade.subject}</td>
                        <td className="py-3.5 px-4 font-semibold text-center">{grade.score}%</td>
                        <td className="py-3.5 px-4 text-center">
                          <span className={`px-2.5 py-0.5 rounded-full font-bold text-[11px] ${
                            grade.grade === 'D1' || grade.grade === 'D2' 
                              ? 'bg-emerald-100 text-emerald-900 border border-emerald-300' 
                              : grade.grade.startsWith('C')
                              ? 'bg-blue-100 text-blue-900 border border-blue-300'
                              : 'bg-amber-100 text-amber-900 border border-amber-300'
                          }`}>
                            {grade.grade}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-slate-600">{grade.remarks}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Official Comments Section */}
              <div className="p-5 bg-slate-50 border-t border-slate-200 text-xs space-y-3">
                <div className="p-3 bg-white rounded-xl border border-slate-200">
                  <div className="flex items-center gap-1.5 font-bold text-slate-800 mb-1">
                    <User className="w-3.5 h-3.5 text-emerald-700" />
                    <span>Class Teacher / Director of Studies (DOS) Remarks:</span>
                  </div>
                  <p className="text-slate-600 italic">
                    {student.examinationAssessment?.classTeacherRemarks || student.conductRemarks || `"${student.fullName} demonstrates commendable consistency in academics and Islamic discipline. A hardworking learner with positive character."`}
                  </p>
                </div>

                <div className="p-3 bg-emerald-50/50 rounded-xl border border-emerald-100">
                  <div className="flex items-center gap-1.5 font-bold text-emerald-950 mb-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
                    <span>Headteacher's Official Endorsement & Stamp:</span>
                  </div>
                  <p className="text-emerald-900/90 italic">
                    {student.examinationAssessment?.headteacherRemarks || `"Masha'Allah! Continue striving for academic excellence, punctual prayer attendance, and steadfast character." — Ustadh Sulaiman, Headteacher`}
                  </p>
                </div>
              </div>
            </div>

            {/* ===================================================================== */}
            {/* LEARNER WRITE-IN WORKSPACE (Students retain active read & write permission) */}
            {/* ===================================================================== */}
            <div className="bg-white rounded-2xl border-2 border-emerald-600/30 shadow-md p-5 sm:p-6 space-y-5">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
                    <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                      <FileCheck className="w-5 h-5 text-emerald-700" />
                      <span>Learner Academic Write-In Workspace</span>
                    </h3>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    <strong>Read & Write Permission Active:</strong> You can record your personal academic reflections, set your target UNEB aggregates, draft revision plans, and submit your preferred A-Level combinations directly to the Director of Studies (DOS).
                  </p>
                </div>

                {student.studentNotesSavedAt && (
                  <div className="text-[11px] font-semibold text-slate-500 bg-slate-100 px-3 py-1 rounded-lg">
                    Last updated: {student.studentNotesSavedAt}
                  </div>
                )}
              </div>

              {saveSuccessMsg && (
                <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs rounded-xl flex items-center gap-2 font-medium">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{saveSuccessMsg}</span>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* 1. Academic Self-Reflection & Notes */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-emerald-700" />
                    <span>My Academic Reflection & Exam Assessment Notes (Write)</span>
                  </label>
                  <textarea
                    rows={4}
                    value={studyNotes}
                    onChange={(e) => setStudyNotes(e.target.value)}
                    placeholder="Reflect on your exam results: What went well? Which topics were straightforward, and what revisions do you need to focus on next?"
                    className="w-full text-xs p-3 rounded-xl border border-slate-300 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 outline-none leading-relaxed"
                  />
                </div>

                {/* 2. Subject Improvement & Revision Action Plan */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <Target className="w-3.5 h-3.5 text-blue-700" />
                    <span>Subject Improvement & Action Plan (Write)</span>
                  </label>
                  <textarea
                    rows={4}
                    value={actionPlan}
                    onChange={(e) => setActionPlan(e.target.value)}
                    placeholder="e.g. In Physics, solve 3 past paper questions daily. In Chemistry, attend practical prep sessions on Saturday morning. Consult Mathematics teacher on calculus."
                    className="w-full text-xs p-3 rounded-xl border border-slate-300 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 outline-none leading-relaxed"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                {/* 3. Target Aggregates */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-800">Next Target Aggregate</label>
                  <input
                    type="number"
                    min="8"
                    max="72"
                    value={targetAggregates}
                    onChange={(e) => setTargetAggregates(e.target.value ? parseInt(e.target.value, 10) : '')}
                    placeholder="e.g. 8 or 10"
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 outline-none"
                  />
                  <span className="text-[10px] text-slate-500">Target for next terminal/UNEB exam</span>
                </div>

                {/* 4. Target Division / Academic Goal */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-800">Target Division / Standard</label>
                  <input
                    type="text"
                    value={academicGoals}
                    onChange={(e) => setAcademicGoals(e.target.value)}
                    placeholder="e.g. Division 1 (Distinction)"
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 outline-none"
                  />
                  <span className="text-[10px] text-slate-500">Desired promotional division</span>
                </div>

                {/* 5. Preferred S.5 Subject Combination */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-800 flex items-center justify-between">
                    <span>Preferred S.5 Combination</span>
                    <span className="text-[10px] text-emerald-700 font-bold">Your Choice</span>
                  </label>
                  <select
                    value={preferredComb || recommendedComb.code}
                    onChange={(e) => setPreferredComb(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 outline-none bg-white font-semibold"
                  >
                    <option value={recommendedComb.code}>
                      ★ {recommendedComb.code} ({recommendedComb.title}) [Recommended for You]
                    </option>
                    <optgroup label="A-Level Sciences">
                      <option value="BCM / Sub-Math">BCM / Sub-Math (Biology, Chemistry, Mathematics)</option>
                      <option value="PCB / Sub-Math">PCB / Sub-Math (Physics, Chemistry, Biology)</option>
                      <option value="PCM / ICT">PCM / ICT (Physics, Chemistry, Mathematics)</option>
                      <option value="PEM / ICT">PEM / ICT (Physics, Economics, Mathematics)</option>
                    </optgroup>
                    <optgroup label="A-Level Arts & Humanities">
                      <option value="DEG / Arabic">DEG / Arabic (Divinity/IRE, Economics, Geography)</option>
                      <option value="HEG / Div">HEG / Div (History, Economics, Geography)</option>
                      <option value="HEL / Sub-Math">HEL / Sub-Math (History, Economics, Literature)</option>
                      <option value="MEG / ICT">MEG / ICT (Mathematics, Economics, Geography)</option>
                    </optgroup>
                  </select>
                  <span className="text-[10px] text-slate-500">Informed by your performance recommendation</span>
                </div>
              </div>

              {/* 6. Message / Feedback to Director of Studies (DOS) */}
              <div className="space-y-1.5 pt-2">
                <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <Send className="w-3.5 h-3.5 text-emerald-700" />
                  <span>Note or Question for the Director of Studies (DOS) / Class Teacher</span>
                </label>
                <input
                  type="text"
                  value={studentFeedbackMsg}
                  onChange={(e) => setStudentFeedbackMsg(e.target.value)}
                  placeholder="Ask for revision materials, discuss subject combinations, or request academic consultation..."
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 outline-none"
                />
              </div>

              {/* Save Button */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-slate-200">
                <p className="text-[11px] text-slate-500">
                  Reflections and preferences are stored in your official school profile and viewable by your teachers and guardians.
                </p>
                <button
                  type="button"
                  onClick={handleSaveStudentNotes}
                  disabled={isSavingNotes}
                  className="w-full sm:w-auto px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 active:scale-95 text-white font-bold text-xs rounded-xl shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  <span>{isSavingNotes ? 'Saving to Records...' : 'Save My Learner Reflection & Academic Plan'}</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* FEES TAB */}
        {activeTab === 'fees' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
                <div className="text-xs font-bold text-slate-500 uppercase">Term Total Fees</div>
                <div className="text-2xl font-black text-slate-900 mt-1">
                  UGX {student.feesTotal.toLocaleString()}
                </div>
                <div className="text-xs text-slate-500 mt-0.5">
                  {student.section} Section • {student.className}
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
                <div className="text-xs font-bold text-slate-500 uppercase">Amount Cleared</div>
                <div className="text-2xl font-black text-emerald-700 mt-1">
                  UGX {student.feesPaid.toLocaleString()}
                </div>
                <div className="text-xs text-emerald-600 mt-0.5">
                  {Math.round((student.feesPaid / student.feesTotal) * 100)}% Cleared
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-amber-200 bg-amber-50/50 shadow-xs">
                <div className="text-xs font-bold text-amber-800 uppercase">Outstanding Balance</div>
                <div className="text-2xl font-black text-amber-900 mt-1">
                  UGX {student.feesBalance.toLocaleString()}
                </div>
                <div className="text-xs text-amber-700 mt-0.5">
                  {student.feesBalance === 0 ? '✓ Fees fully cleared!' : 'Due before terminal examinations'}
                </div>
              </div>
            </div>

            {/* Payment Action Bar */}
            <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
              <div>
                <h4 className="font-extrabold text-sm text-slate-900">Need to record a fee payment?</h4>
                <p className="text-xs text-slate-500">Record a bank slip or mobile money payment into your browser records.</p>
              </div>
              <button
                onClick={() => setShowPayModal(true)}
                className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Record Bank / MoMo Slip</span>
              </button>
            </div>

            {/* Payment History List */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6">
              <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wide mb-3 flex items-center gap-2">
                <History className="w-4 h-4 text-emerald-700" />
                <span>Verified Fee Payment History (Cached in Browser)</span>
              </h3>
              <div className="divide-y divide-slate-100 text-xs">
                {payments.map((p) => (
                  <div key={p.id} className="py-3 flex items-center justify-between flex-wrap gap-2">
                    <div>
                      <strong className="text-slate-900 block text-sm">UGX {p.amount.toLocaleString()}</strong>
                      <span className="text-slate-500 text-[11px]">
                        {p.paymentMethod} · Ref: {p.referenceNumber} · {p.date}
                      </span>
                    </div>
                    <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-900 font-bold text-[10px]">
                      {p.status} ({p.receiptNumber})
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Payment Methods Box */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6">
              <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wide mb-4">
                Approved Payment Channels for Shuhadae Islamic SS
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {PAYMENT_METHODS.map((method, idx) => (
                  <div key={idx} className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <Building className="w-4 h-4 text-emerald-700" />
                        <h4 className="font-bold text-xs text-slate-900">{method.name}</h4>
                      </div>
                      <p className="font-mono text-sm font-bold text-emerald-800 mb-1">
                        {method.accountNumber || method.code}
                      </p>
                      <p className="text-[11px] text-slate-600 mb-2">{method.accountName}</p>
                    </div>
                    <p className="text-[10px] text-slate-500 border-t border-slate-200 pt-2 italic">
                      {method.instructions}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ISLAMIC TARBIYYAH TAB */}
        {activeTab === 'islamic' && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-800 font-bold">
                  🕌
                </div>
                <div>
                  <h3 className="font-extrabold text-slate-900 text-base">
                    Spiritual, Tahfiz & Character Assessment
                  </h3>
                  <p className="text-xs text-slate-500">Monitored by the Department of Islamic Affairs & School Mosque Warden</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-700">Congregational Prayer Attendance:</span>
                    <span className="font-extrabold text-emerald-700">{student.prayerAttendance}%</span>
                  </div>
                  <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                    <div className="bg-emerald-600 h-full rounded-full" style={{ width: `${student.prayerAttendance}%` }}></div>
                  </div>
                  <p className="text-[11px] text-slate-500">
                    Consistently punctual for Fajr and Isha congregational prayers in the school mosque.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1 text-xs">
                  <span className="font-bold text-slate-700">Holy Quran Hifz Progress:</span>
                  <p className="text-emerald-900 font-semibold">{student.quranProgress}</p>
                  <p className="text-[11px] text-slate-500">
                    Enrolled in the after-school Tahfiz specialization with Ustadh Bilal.
                  </p>
                </div>
              </div>

              <div className="mt-5 p-4 rounded-xl bg-emerald-50/60 border border-emerald-200 text-xs text-emerald-950">
                <strong className="block mb-1 text-emerald-900">Moral Conduct & Adab Report:</strong>
                {student.conductRemarks}
              </div>
            </div>
          </div>
        )}

        {/* TIMETABLE & ACADEMIC CALENDAR TAB */}
        {activeTab === 'timetable' && (
          <div className="space-y-6">
            <ExamCountdownTimer />
            <AcademicCalendar />

            <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6">
              <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wide mb-3">
                Daily Boarding Routine & Prep Timetable
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
                {[
                  { time: '5:00 AM – 5:45 AM', task: 'Fajr Adhan, Congregational Prayer & Quran Recitation' },
                  { time: '6:00 AM – 7:00 AM', task: 'Morning Shower & Halal Breakfast in Dining Hall' },
                  { time: '7:30 AM – 8:00 AM', task: 'Morning Assembly & Roll Call' },
                  { time: '8:00 AM – 1:00 PM', task: 'Core Academic Lessons & Science Lab Practicals' },
                  { time: '1:00 PM – 2:00 PM', task: 'Dhuhr Prayer & Wholesome Lunch' },
                  { time: '2:00 PM – 4:30 PM', task: 'Afternoon Lessons, ICT Lab & Project Work' },
                  { time: '4:45 PM – 6:15 PM', task: 'Asr Prayer, Sports, Football & Co-curriculars' },
                  { time: '7:00 PM – 9:30 PM', task: 'Maghrib, Dinner, Isha Prayer & Evening Preps' },
                ].map((item, i) => (
                  <div key={i} className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                    <span className="font-mono text-emerald-700 font-bold block mb-1">{item.time}</span>
                    <p className="text-slate-700 font-medium">{item.task}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Record Fee Payment Modal */}
      {showPayModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 text-slate-800 shadow-2xl border border-emerald-900/20">
            <h3 className="font-extrabold text-base text-slate-900 mb-2">Record Fee Deposit</h3>
            <p className="text-xs text-slate-500 mb-4">Record your bank deposit slip or SchoolPay code to update local records.</p>
            
            <form onSubmit={handleMakePayment} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Amount to Pay (UGX):</label>
                <input
                  type="number"
                  required
                  placeholder="Enter amount to pay"
                  value={payAmount}
                  onChange={(e) => setPayAmount(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 font-mono font-bold"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Payment Channel:</label>
                <select
                  value={payChannel}
                  onChange={(e) => setPayChannel(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 font-medium"
                >
                  <option value="Centenary Bank Mbarara Branch">Centenary Bank (A/C: 3100084200)</option>
                  <option value="Stanbic Bank Uganda">Stanbic Bank (A/C: 903001842099)</option>
                  <option value="MTN SchoolPay (Code: 418290)">MTN SchoolPay (Code: 418290)</option>
                  <option value="Airtel Money SchoolPay">Airtel Money SchoolPay</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Bank Slip / Transaction Reference:</label>
                <input
                  type="text"
                  placeholder="Enter bank slip or transaction reference"
                  value={payRef}
                  onChange={(e) => setPayRef(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 font-mono"
                />
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white font-bold rounded-xl cursor-pointer"
                >
                  Confirm & Save
                </button>
                <button
                  type="button"
                  onClick={() => setShowPayModal(false)}
                  className="px-3 py-2.5 border border-slate-200 text-slate-600 rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
