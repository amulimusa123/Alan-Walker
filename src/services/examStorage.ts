import { ExamSchedule } from '../types';
import { DEFAULT_EXAM_SCHEDULES } from '../data/examData';

const EXAMS_STORAGE_KEY = 'shuhadae_exam_schedules_v1';
export const EXAMS_UPDATED_EVENT = 'shuhadae_exams_updated';

/**
 * Initializes and fetches stored exam countdown schedules from localStorage.
 */
export function getStoredExamSchedules(): ExamSchedule[] {
  try {
    const raw = localStorage.getItem(EXAMS_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (err) {
    console.error('Failed to read exam schedules from storage', err);
  }

  // Fallback to default schedules and save
  saveStoredExamSchedules(DEFAULT_EXAM_SCHEDULES);
  return DEFAULT_EXAM_SCHEDULES;
}

/**
 * Persists exam countdown schedules to localStorage and fires sync event.
 */
export function saveStoredExamSchedules(schedules: ExamSchedule[]): void {
  try {
    localStorage.setItem(EXAMS_STORAGE_KEY, JSON.stringify(schedules));
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent(EXAMS_UPDATED_EVENT, { detail: schedules }));
    }
  } catch (err) {
    console.error('Failed to save exam schedules to storage', err);
  }
}

/**
 * Updates a specific exam schedule (target date, briefing date, venue, papers, etc.)
 */
export function updateExamSchedule(
  id: string,
  updates: Partial<ExamSchedule>
): { success: boolean; message: string; exam?: ExamSchedule } {
  const current = getStoredExamSchedules();
  const index = current.findIndex((e) => e.id === id);

  if (index === -1) {
    return { success: false, message: `Exam schedule with ID "${id}" was not found.` };
  }

  const updatedExam: ExamSchedule = {
    ...current[index],
    ...updates,
  };

  current[index] = updatedExam;
  saveStoredExamSchedules(current);

  return {
    success: true,
    message: `Exam countdown for "${updatedExam.name}" updated successfully.`,
    exam: updatedExam,
  };
}

/**
 * Adds a new exam countdown schedule (e.g. specialized mock, practical assessment).
 */
export function addExamSchedule(
  examData: Omit<ExamSchedule, 'id'> & { id?: string }
): { success: boolean; message: string; exam?: ExamSchedule } {
  const current = getStoredExamSchedules();
  const id = examData.id || `exam_${Date.now()}`;

  if (current.some((e) => e.id === id)) {
    return { success: false, message: `An exam with ID "${id}" already exists.` };
  }

  const newExam: ExamSchedule = {
    ...examData,
    id,
    papers: examData.papers || [],
  };

  const updated = [newExam, ...current];
  saveStoredExamSchedules(updated);

  return {
    success: true,
    message: `Exam countdown "${newExam.name}" added successfully.`,
    exam: newExam,
  };
}

/**
 * Deletes an exam schedule by ID.
 */
export function deleteExamSchedule(id: string): { success: boolean; message: string } {
  const current = getStoredExamSchedules();
  const target = current.find((e) => e.id === id);

  if (!target) {
    return { success: false, message: 'Exam schedule not found.' };
  }

  const filtered = current.filter((e) => e.id !== id);
  saveStoredExamSchedules(filtered);

  return {
    success: true,
    message: `Exam countdown for "${target.name}" removed successfully.`,
  };
}

/**
 * Resets exam schedules back to official default UNEB and Mock dates.
 */
export function resetExamSchedulesToDefault(): ExamSchedule[] {
  saveStoredExamSchedules(DEFAULT_EXAM_SCHEDULES);
  return DEFAULT_EXAM_SCHEDULES;
}
