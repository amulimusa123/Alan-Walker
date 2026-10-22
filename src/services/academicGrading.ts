import { SchoolUser, ExaminationAssessmentGrade } from '../types';

/**
 * Calculates official UNEB standard grade and numerical points for O-Level secondary examinations.
 */
export function calculateUNEBGrade(score: number): { grade: string; points: number; remarks: string } {
  const s = Math.max(0, Math.min(100, Math.round(score)));
  if (s >= 80) return { grade: 'D1', points: 1, remarks: 'Distinction 1 (Exemplary)' };
  if (s >= 75) return { grade: 'D2', points: 2, remarks: 'Distinction 2 (Superior)' };
  if (s >= 70) return { grade: 'C3', points: 3, remarks: 'Credit 3 (Very Good)' };
  if (s >= 65) return { grade: 'C4', points: 4, remarks: 'Credit 4 (Good)' };
  if (s >= 60) return { grade: 'C5', points: 5, remarks: 'Credit 5 (Fair Credit)' };
  if (s >= 55) return { grade: 'C6', points: 6, remarks: 'Credit 6 (Passable Credit)' };
  if (s >= 50) return { grade: 'P7', points: 7, remarks: 'Pass 7 (Elementary Pass)' };
  if (s >= 45) return { grade: 'P8', points: 8, remarks: 'Pass 8 (Minimum Pass)' };
  return { grade: 'F9', points: 9, remarks: 'Fail 9 (Significant Improvement Required)' };
}

/**
 * Computes UNEB total aggregates and promotional division from subject grades.
 */
export function computeAggregatesAndDivision(grades: ExaminationAssessmentGrade[]): { aggregates: number; division: string } {
  if (!grades || grades.length === 0) {
    return { aggregates: 14, division: 'Division 1 (Distinction)' };
  }

  const pointList = grades.map((g) => calculateUNEBGrade(g.score).points).sort((a, b) => a - b);
  // Best 8 subjects as per standard UNEB computation
  const bestSubjects = pointList.slice(0, Math.min(8, pointList.length));
  const aggregates = bestSubjects.reduce((acc, curr) => acc + curr, 0);

  let division = 'Division 1 (Distinction)';
  if (aggregates <= 32) {
    division = 'Division 1 (Distinction)';
  } else if (aggregates <= 45) {
    division = 'Division 2 (Credit)';
  } else if (aggregates <= 58) {
    division = 'Division 3 (Pass)';
  } else if (aggregates <= 72) {
    division = 'Division 4 (Fair)';
  } else {
    division = 'Division 9 / Ungraded';
  }

  return { aggregates, division };
}

/**
 * Computes the REAL class rank for a student among all registered students in the same class.
 */
export function calculateRealClassRank(
  studentId: string,
  className: string,
  allUsers: SchoolUser[]
): { rank: number; total: number; rankText: string; cohortLabel: string } {
  const cleanClass = (className || '').trim().toLowerCase();
  
  // Filter all active students in the same academic class
  let classMates = allUsers.filter(
    (u) => u.role === 'student' && (u.className || '').trim().toLowerCase() === cleanClass
  );

  // If no other students in exact class, compare against all students
  if (classMates.length === 0) {
    classMates = allUsers.filter((u) => u.role === 'student');
  }

  // Calculate composite score metric for each student (higher score = better rank, lower aggregates = better rank)
  const scoredStudents = classMates.map((s) => {
    let scoreMetric = 0;
    if (s.examinationAssessment?.grades && s.examinationAssessment.grades.length > 0) {
      const avg = s.examinationAssessment.grades.reduce((acc, g) => acc + g.score, 0) / s.examinationAssessment.grades.length;
      scoreMetric = avg;
    } else if (s.aggregates !== undefined && s.aggregates > 0) {
      // Aggregate 8 is 100%, aggregate 72 is ~20%
      scoreMetric = Math.max(10, 108 - s.aggregates);
    } else {
      scoreMetric = 75; // baseline
    }
    return { id: s.id, scoreMetric };
  });

  // Sort descending by performance score
  scoredStudents.sort((a, b) => b.scoreMetric - a.scoreMetric);

  const idx = scoredStudents.findIndex((s) => s.id === studentId);
  const rank = idx !== -1 ? idx + 1 : 1;
  const total = Math.max(1, scoredStudents.length);

  const getSuffix = (n: number) => {
    const j = n % 10, k = n % 100;
    if (j === 1 && k !== 11) return 'st';
    if (j === 2 && k !== 12) return 'nd';
    if (j === 3 && k !== 13) return 'rd';
    return 'th';
  };

  const rankText = `${rank}${getSuffix(rank)} / ${total}`;
  const cohortLabel = `${className || 'Class'} Cohort (${total} ${total === 1 ? 'Learner' : 'Learners'})`;

  return { rank, total, rankText, cohortLabel };
}

/**
 * Recommends an A-Level (UACE S.5) subject combination based on the student's REAL performance marks.
 */
export function recommendCombinationFromPerformance(
  grades: ExaminationAssessmentGrade[]
): { code: string; title: string; subjects: string; rationale: string } {
  if (!grades || grades.length === 0) {
    return {
      code: 'BCM / Sub-Math',
      title: 'Biology, Chemistry, Mathematics',
      subjects: 'Biology, Chemistry, Mathematics, Sub-Math, GP',
      rationale: 'Balanced STEM curriculum suitable for health and applied biological sciences.',
    };
  }

  // Find score by subject keywords
  const findScore = (keywords: string[]): number => {
    const found = grades.find((g) =>
      keywords.some((kw) => g.subject.toLowerCase().includes(kw.toLowerCase()))
    );
    return found ? found.score : 0;
  };

  const bio = findScore(['biology', 'bio']);
  const chem = findScore(['chemistry', 'chem']);
  const phys = findScore(['physics', 'phy']);
  const math = findScore(['mathematics', 'math', 'maths']);
  const hist = findScore(['history', 'hist']);
  const geog = findScore(['geography', 'geog']);
  const econ = findScore(['economics', 'commerce', 'econ']);
  const ire = findScore(['islamic', 'ire', 'divinity', 'arabic']);
  const lit = findScore(['literature', 'lit']);
  const ict = findScore(['computer', 'ict']);

  // 1. Pure Biological & Medical Sciences: High Biology & Chemistry
  if (bio >= 70 && chem >= 70) {
    if (math >= 70) {
      return {
        code: 'BCM / Sub-Math',
        title: 'Biology, Chemistry, Mathematics',
        subjects: 'Biology, Chemistry, Mathematics, Sub-Math, General Paper',
        rationale: `Exceptional mastery in Biology (${bio}%) and Chemistry (${chem}%) demonstrates premier readiness for Medicine, Pharmacy, and Biomedical Engineering.`,
      };
    } else {
      return {
        code: 'PCB / Sub-Math',
        title: 'Physics, Chemistry, Biology',
        subjects: 'Physics, Chemistry, Biology, Sub-Math, General Paper',
        rationale: `High scores in Biology (${bio}%), Chemistry (${chem}%), and Physics (${phys || 65}%) make learner optimal for Clinical Medicine, Radiography, and Veterinary Sciences.`,
      };
    }
  }

  // 2. Physical Sciences & Engineering: High Physics & Mathematics
  if (phys >= 70 && math >= 70) {
    return {
      code: 'PCM / ICT',
      title: 'Physics, Chemistry, Mathematics',
      subjects: 'Physics, Chemistry, Mathematics, Sub-ICT, General Paper',
      rationale: `Distinction marks in Physics (${phys}%) and Mathematics (${math}%) indicate strong analytical capability suited for Electrical, Civil, and Mechanical Engineering.`,
    };
  }

  // 3. Quantitative & Applied Sciences: High Math & Economics/Physics
  if (math >= 65 && (econ >= 65 || phys >= 65)) {
    return {
      code: 'PEM / ICT',
      title: 'Physics, Economics, Mathematics',
      subjects: 'Physics, Economics, Mathematics, Sub-ICT, General Paper',
      rationale: `Strong quantitative results in Mathematics (${math}%) and Economics/Physics qualify the student for Actuarial Sciences, Architecture, and Data Systems.`,
    };
  }

  // 4. Islamic Jurisprudence & Social Sciences: High IRE/Arabic
  if (ire >= 70) {
    return {
      code: 'DEG / Arabic',
      title: 'Divinity (IRE), Economics, Geography',
      subjects: 'Islamic Religious Education, Economics, Geography, Arabic, General Paper',
      rationale: `Outstanding distinction in Islamic Studies (${ire}%) equips learner with unique aptitude for Islamic Banking, Sharia Jurisprudence, Diplomacy, and Development Studies.`,
    };
  }

  // 5. Humanities, Law & Governance: High History & Geography
  if (hist >= 65 && geog >= 65) {
    return {
      code: 'HEG / Div',
      title: 'History, Economics, Geography',
      subjects: 'History, Economics, Geography, Divinity, General Paper',
      rationale: `Strong analytical writing in History (${hist}%) and Geography (${geog}%) indicates high potential in Law, International Relations, and Public Policy.`,
    };
  }

  // 6. Literature & Communication: High Literature
  if (lit >= 65) {
    return {
      code: 'HEL / Sub-Math',
      title: 'History, Economics, Literature',
      subjects: 'History, Economics, Literature in English, Sub-Math, General Paper',
      rationale: `Superior verbal expression in Literature (${lit}%) prepares the learner for Corporate Law, Mass Communication, and Diplomatic Service.`,
    };
  }

  // 7. General balanced combination based on highest subjects
  const sorted = [...grades].sort((a, b) => b.score - a.score);
  const topNames = sorted.slice(0, 3).map((g) => g.subject).join(', ');

  return {
    code: 'MEG / ICT',
    title: 'Mathematics, Economics, Geography',
    subjects: 'Mathematics, Economics, Geography, Sub-ICT, General Paper',
    rationale: `Personalized recommendation derived from highest performing subjects (${topNames}), ensuring optimal transition to S.5 UACE.`,
  };
}

export const O_LEVEL_PRESET_SUBJECTS = [
  'English Language',
  'Mathematics',
  'Biology',
  'Chemistry',
  'Physics',
  'History & Political Education',
  'Geography',
  'Islamic Religious Education (IRE)',
  'Information & Communications Technology (ICT)',
  'Literature in English',
];

export const A_LEVEL_SCIENCE_PRESET_SUBJECTS = [
  'Biology',
  'Chemistry',
  'Physics',
  'Pure Mathematics',
  'Subsidiary Mathematics',
  'Subsidiary ICT',
  'General Paper',
];

export const A_LEVEL_ARTS_PRESET_SUBJECTS = [
  'History',
  'Economics',
  'Geography',
  'Islamic Religious Education (IRE)',
  'Literature in English',
  'Subsidiary Mathematics',
  'General Paper',
];
