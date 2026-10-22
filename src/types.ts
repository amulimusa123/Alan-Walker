export type PageType = 
  | 'home' 
  | 'about' 
  | 'academics' 
  | 'admissions' 
  | 'campus-life' 
  | 'alumni' 
  | 'contact';

export type UserRole = 'student' | 'parent' | 'staff' | 'alumni' | 'admin';

export interface AdminAccount {
  id: string;
  username: string;
  fullName: string;
  title: string;
  email?: string;
  phone?: string;
  password?: string;
  createdAt: string;
  isPrimary: boolean;
  isOwner?: boolean;
}

export interface ExaminationAssessmentGrade {
  subject: string;
  score: number;
  grade: string;
  remarks: string;
}

export interface ExaminationAssessment {
  term: string;
  academicYear: string;
  examTitle: string;
  status: string; // e.g. "Promoted to S.5 UACE" or "Academic Term in Progress"
  classTeacherRemarks?: string;
  headteacherRemarks?: string;
  grades: ExaminationAssessmentGrade[];
  uploadedAt: string;
  uploadedBy?: string;
  fileAttachmentName?: string;
  fileAttachmentUrl?: string;
}

export interface StudentProfile {
  id: string;
  fullName: string;
  indexNumber: string;
  admissionNumber: string;
  className: string;
  stream: string;
  section: 'Boarding' | 'Day';
  house: string;
  guardianName: string;
  guardianPhone: string;
  feesTotal: number;
  feesPaid: number;
  feesBalance: number;
  recentGrades: ExaminationAssessmentGrade[];
  aggregates: number;
  division: string;
  prayerAttendance: number; // percentage
  quranProgress: string;
  conductRemarks: string;
  examinationAssessment?: ExaminationAssessment;
  studentStudyNotes?: string;
  studentAcademicGoals?: string;
  studentFeedback?: string;
  studentPreferredCombination?: string;
  studentTargetAggregates?: number;
  studentActionPlan?: string;
  studentNotesSavedAt?: string;
}

export interface SubjectCombination {
  code: string;
  name: string;
  category: 'Sciences' | 'Arts' | 'Economics & Vocational';
  subjects: string[];
  subsidiaries: string[];
  careerPaths: string[];
  cutoff: string;
}

export interface FeeStructureItem {
  item: string;
  s1_s4_day: number;
  s1_s4_boarding: number;
  s5_s6_day: number;
  s5_s6_boarding: number;
  frequency: string;
}

export interface AlumniProfile {
  id: string;
  fullName: string;
  completionYear: string;
  combinationOrStream: string;
  currentProfession: string;
  organization: string;
  location: string;
  quote: string;
  avatar: string;
}

export type GalleryCategory = 
  | 'facilities' 
  | 'labs' 
  | 'classrooms' 
  | 'dormitories' 
  | 'dining' 
  | 'sports' 
  | 'islamic' 
  | 'clubs';

export interface GalleryItem {
  id: string;
  title: string;
  category: 'facilities' | 'labs' | 'classrooms' | 'dormitories' | 'dining' | 'sports' | 'islamic' | 'clubs' | string;
  itemType?: 'facility' | 'activity';
  description: string;
  image: string;
  facilityOrActivity?: string;
  dateCaptured?: string;
  uploadedBy?: string;
  featured?: boolean;
  tags?: string[];
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  content: string;
  timestamp: string;
}

export type CalendarCategory = 
  | 'term' 
  | 'exam' 
  | 'visitation' 
  | 'islamic' 
  | 'sports' 
  | 'meeting' 
  | 'holiday';

export type TargetAudience = 
  | 'All Learners' 
  | 'S.1-S.3 O-Level' 
  | 'S.4 UCE Candidates' 
  | 'S.5 A-Level' 
  | 'S.6 UACE Candidates' 
  | 'Parents & Guardians' 
  | 'Teaching Staff';

export interface CalendarEvent {
  id: string;
  title: string;
  startDate: string; // YYYY-MM-DD
  endDate?: string;   // YYYY-MM-DD
  startTime?: string;
  endTime?: string;
  category: CalendarCategory;
  targetAudience: TargetAudience;
  termId: 'term-1' | 'term-2' | 'term-3';
  venue: string;
  description: string;
  isKeyDate?: boolean;
  isExamPeriod?: boolean;
  coordinator?: string;
  requirements?: string[];
  paperCodes?: string[];
}

export interface AcademicTerm {
  id: 'term-1' | 'term-2' | 'term-3';
  name: string;
  year: number;
  theme: string;
  startDate: string;
  endDate: string;
  durationWeeks: number;
  reportingContinuers: string;
  reportingFreshers: string;
  midTermBreak: { start: string; end: string };
  examPeriod: { name: string; start: string; end: string };
  closingDate: string;
  feesDeadline: string;
  status: 'completed' | 'ongoing' | 'upcoming';
}

export interface ExamSchedulePaper {
  id?: string;
  date: string;
  time: string;
  paper: string;
  code: string;
}

export interface ExamSchedule {
  id: string;
  name: string;
  shortLabel: string;
  examType: 'mock' | 'uneb' | 'terminal';
  targetClass: string;
  targetDate: string; // ISO string e.g. 2026-11-02T08:30:00
  briefingDate: string;
  venue: string;
  supervisor: string;
  papersCount: number;
  highlightSubject: string;
  description: string;
  status?: 'scheduled' | 'ongoing' | 'completed';
  papers: ExamSchedulePaper[];
}

export type UserStatus = 'active' | 'suspended' | 'pending';

export interface SchoolUser {
  id: string;
  role: UserRole;
  fullName: string;
  username: string;
  password?: string;
  email?: string;
  phone?: string;
  status: UserStatus;
  createdAt: string;
  avatar?: string;
  notes?: string;

  // Student specific
  className?: string;
  stream?: string;
  section?: 'Boarding' | 'Day';
  indexNumber?: string;
  admissionNumber?: string;
  house?: string;
  guardianName?: string;
  guardianPhone?: string;
  feesTotal?: number;
  feesPaid?: number;
  feesBalance?: number;
  division?: string;
  aggregates?: number;
  prayerAttendance?: number;
  quranProgress?: string;
  examinationAssessment?: ExaminationAssessment;
  recentGrades?: ExaminationAssessmentGrade[];
  studentStudyNotes?: string;
  studentAcademicGoals?: string;
  studentFeedback?: string;
  studentPreferredCombination?: string;
  studentTargetAggregates?: number;
  studentActionPlan?: string;
  studentNotesSavedAt?: string;

  // Parent specific
  linkedStudentName?: string;
  linkedStudentAdmission?: string;
  relationship?: 'Father' | 'Mother' | 'Guardian';

  // Staff specific
  employeeId?: string;
  department?: 'Sciences' | 'Humanities' | 'Languages' | 'Islamic Studies' | 'Vocational & Arts' | 'Administration' | 'Office of the Director of Studies (DOS)';
  teachingSubjects?: string[];
  classesTaught?: string[];
  staffTitle?: string;

  // Admin specific
  adminTitle?: string;
  isPrimaryAdmin?: boolean;
  isOwner?: boolean;

  // Alumni specific
  completionYear?: string;
  combination?: string;
  currentProfession?: string;
  organization?: string;
}

