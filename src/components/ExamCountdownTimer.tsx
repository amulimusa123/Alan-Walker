import React, { useState, useEffect } from 'react';
import { 
  Clock, 
  Calendar, 
  AlertCircle, 
  BookOpen, 
  CheckCircle2, 
  Sparkles, 
  FileText, 
  ChevronRight,
  ShieldAlert,
  Flame,
  Award,
  Edit3,
  CalendarDays
} from 'lucide-react';
import { ExamSchedule } from '../types';
import { getStoredExamSchedules, EXAMS_UPDATED_EVENT } from '../services/examStorage';

interface ExamCountdownTimerProps {
  onOpenAdminEditor?: () => void;
  showAdminShortcut?: boolean;
}

export const ExamCountdownTimer: React.FC<ExamCountdownTimerProps> = ({
  onOpenAdminEditor,
  showAdminShortcut = false,
}) => {
  const [schedules, setSchedules] = useState<ExamSchedule[]>(getStoredExamSchedules());
  const [selectedExamId, setSelectedExamId] = useState<string>('uce-uneb');
  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
    isPast: boolean;
  }>({ days: 0, hours: 0, minutes: 0, seconds: 0, isPast: false });
  const [showTimetable, setShowTimetable] = useState(false);

  // Sync schedules whenever storage changes or admin updates
  useEffect(() => {
    const handleSync = () => {
      const updated = getStoredExamSchedules();
      setSchedules(updated);
      // Ensure active exam exists
      if (!updated.some((e) => e.id === selectedExamId) && updated.length > 0) {
        setSelectedExamId(updated[0].id);
      }
    };

    window.addEventListener(EXAMS_UPDATED_EVENT, handleSync);
    window.addEventListener('storage', handleSync);
    return () => {
      window.removeEventListener(EXAMS_UPDATED_EVENT, handleSync);
      window.removeEventListener('storage', handleSync);
    };
  }, [selectedExamId]);

  const activeExam: ExamSchedule = 
    schedules.find((e) => e.id === selectedExamId) || 
    schedules[0] || {
      id: 'default',
      name: 'Academic Examinations',
      shortLabel: 'Exams',
      examType: 'mock',
      targetClass: 'All Candidates',
      targetDate: new Date().toISOString(),
      briefingDate: 'Pending schedule',
      venue: 'Main Hall',
      supervisor: 'Dean of Studies',
      papersCount: 0,
      highlightSubject: 'All Subjects',
      description: 'Scheduled academic assessment',
      papers: []
    };

  useEffect(() => {
    const calculateTime = () => {
      const targetTime = new Date(activeExam.targetDate).getTime();
      const now = new Date().getTime();
      const difference = targetTime - now;

      if (difference <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, isPast: true });
      } else {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        setTimeLeft({ days, hours, minutes, seconds, isPast: false });
      }
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);
    return () => clearInterval(interval);
  }, [activeExam]);

  const getExamBadge = (type: string) => {
    switch (type) {
      case 'uneb':
        return { label: 'UNEB National Final', bg: 'bg-red-500/20 text-red-300 border-red-500/40' };
      case 'mock':
        return { label: 'Joint Mock Examination', bg: 'bg-amber-500/20 text-amber-300 border-amber-500/40' };
      default:
        return { label: 'Terminal Assessment', bg: 'bg-blue-500/20 text-blue-300 border-blue-500/40' };
    }
  };

  const badge = getExamBadge(activeExam.examType);

  return (
    <div className="bg-gradient-to-br from-emerald-950 via-slate-900 to-emerald-900 text-white rounded-3xl p-5 sm:p-7 shadow-xl border-2 border-emerald-600/50 relative overflow-hidden mb-6">
      {/* Background Decorative Accents */}
      <div className="absolute top-0 right-0 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none -ml-20 -mb-20"></div>

      {/* Header with Switcher Tabs */}
      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-emerald-800/60">
        <div>
          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
            <span className="px-3 py-0.5 rounded-full bg-amber-400 text-slate-950 text-[11px] font-black uppercase tracking-wider flex items-center gap-1 shadow-sm">
              <Clock className="w-3 h-3 animate-pulse" />
              <span>Academic Exam Countdown</span>
            </span>
            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${badge.bg}`}>
              {badge.label}
            </span>
            <span className="text-emerald-300 text-xs font-mono">
              UNEB Center: U0842 • 2026 Series
            </span>
          </div>

          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <span>{activeExam.name}</span>
          </h2>
          <p className="text-xs text-emerald-200 mt-0.5">
            Target: <strong className="text-amber-300">{activeExam.targetClass}</strong> • {activeExam.venue}
          </p>
        </div>

        {/* Exam Selectors + Admin Shortcut */}
        <div className="flex items-center gap-2 flex-wrap self-start md:self-auto">
          <div className="flex items-center gap-1.5 bg-slate-950/70 p-1.5 rounded-2xl border border-emerald-700/60 overflow-x-auto no-scrollbar max-w-full">
            {schedules.map((exam) => (
              <button
                key={exam.id}
                onClick={() => setSelectedExamId(exam.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                  selectedExamId === exam.id
                    ? 'bg-amber-400 text-slate-950 shadow-md scale-102 font-extrabold'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
                }`}
              >
                {exam.shortLabel}
              </button>
            ))}
          </div>

          {showAdminShortcut && onOpenAdminEditor && (
            <button
              onClick={onOpenAdminEditor}
              className="px-3 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-extrabold flex items-center gap-1.5 shadow-md cursor-pointer transition-all active:scale-95 shrink-0"
              title="Admin: Edit Mock & UNEB Countdown Dates"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Edit Countdowns</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Countdown Display */}
      <div className="relative z-10 py-6">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 max-w-3xl mx-auto">
          {/* Days */}
          <div className="bg-slate-900/90 backdrop-blur-md rounded-2xl p-4 sm:p-5 border border-emerald-500/40 text-center shadow-lg relative group hover:border-amber-400 transition-colors">
            <div className="text-3xl sm:text-5xl font-black text-amber-400 font-mono tracking-tight group-hover:scale-105 transition-transform">
              {timeLeft.isPast ? '00' : String(timeLeft.days).padStart(2, '0')}
            </div>
            <div className="text-[11px] sm:text-xs font-extrabold uppercase tracking-widest text-emerald-200 mt-1">
              Days
            </div>
            <div className="text-[9px] text-slate-400 mt-0.5 font-medium">
              {timeLeft.isPast ? 'Exam In Progress' : 'Until First Paper'}
            </div>
          </div>

          {/* Hours */}
          <div className="bg-slate-900/90 backdrop-blur-md rounded-2xl p-4 sm:p-5 border border-emerald-500/40 text-center shadow-lg relative group hover:border-amber-400 transition-colors">
            <div className="text-3xl sm:text-5xl font-black text-white font-mono tracking-tight group-hover:scale-105 transition-transform">
              {timeLeft.isPast ? '00' : String(timeLeft.hours).padStart(2, '0')}
            </div>
            <div className="text-[11px] sm:text-xs font-extrabold uppercase tracking-widest text-emerald-200 mt-1">
              Hours
            </div>
            <div className="text-[9px] text-slate-400 mt-0.5 font-medium">Prep Time</div>
          </div>

          {/* Minutes */}
          <div className="bg-slate-900/90 backdrop-blur-md rounded-2xl p-4 sm:p-5 border border-emerald-500/40 text-center shadow-lg relative group hover:border-amber-400 transition-colors">
            <div className="text-3xl sm:text-5xl font-black text-white font-mono tracking-tight group-hover:scale-105 transition-transform">
              {timeLeft.isPast ? '00' : String(timeLeft.minutes).padStart(2, '0')}
            </div>
            <div className="text-[11px] sm:text-xs font-extrabold uppercase tracking-widest text-emerald-200 mt-1">
              Minutes
            </div>
            <div className="text-[9px] text-slate-400 mt-0.5 font-medium">Revision Sessions</div>
          </div>

          {/* Seconds */}
          <div className="bg-slate-900/90 backdrop-blur-md rounded-2xl p-4 sm:p-5 border border-amber-500/50 text-center shadow-lg relative group hover:border-amber-400 transition-colors bg-gradient-to-b from-slate-900 to-emerald-950">
            <div className="text-3xl sm:text-5xl font-black text-emerald-400 font-mono tracking-tight animate-pulse group-hover:scale-105 transition-transform">
              {timeLeft.isPast ? '00' : String(timeLeft.seconds).padStart(2, '0')}
            </div>
            <div className="text-[11px] sm:text-xs font-extrabold uppercase tracking-widest text-amber-300 mt-1">
              Seconds
            </div>
            <div className="text-[9px] text-emerald-300/80 mt-0.5 font-medium">Live Ticker</div>
          </div>
        </div>

        {/* Date Details Bar */}
        <div className="mt-4 max-w-3xl mx-auto flex flex-wrap items-center justify-between text-xs text-emerald-200/90 bg-slate-950/50 px-4 py-2 rounded-xl border border-emerald-800/40 gap-2">
          <div>
            <span className="text-slate-400">Target Start:</span>{' '}
            <strong className="text-white font-mono">
              {new Date(activeExam.targetDate).toLocaleDateString('en-GB', {
                weekday: 'short',
                day: 'numeric',
                month: 'short',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </strong>
          </div>
          <div>
            <span className="text-slate-400">Official Briefing:</span>{' '}
            <strong className="text-amber-300">{activeExam.briefingDate}</strong>
          </div>
          <div>
            <span className="text-slate-400">Supervisor:</span>{' '}
            <strong className="text-white">{activeExam.supervisor}</strong>
          </div>
        </div>

        {/* Quick Islamic Dua & Motivation Strip */}
        <div className="mt-4 p-3.5 rounded-2xl bg-emerald-900/70 border border-emerald-700/50 max-w-3xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center font-bold text-sm shrink-0">
              🤲
            </div>
            <div>
              <div className="text-xs font-serif italic text-amber-300">
                "رَّبِّ زِدْنِي عِلْمًا" — "O my Lord, increase me in knowledge." (Surah Ta-Ha 20:114)
              </div>
              <div className="text-[11px] text-emerald-100">
                {activeExam.description}
              </div>
            </div>
          </div>

          <button
            onClick={() => setShowTimetable(!showTimetable)}
            className="px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-amber-300 text-xs font-bold border border-emerald-700/70 flex items-center gap-1.5 transition-colors cursor-pointer shrink-0"
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>{showTimetable ? 'Hide Timetable' : 'View Timetable'}</span>
          </button>
        </div>
      </div>

      {/* Expandable Timetable & Instructions */}
      {showTimetable && (
        <div className="relative z-10 mt-2 pt-4 border-t border-emerald-800/60 animate-in fade-in duration-200">
          <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-amber-300 flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-amber-400" />
              <span>{activeExam.shortLabel} — Key Examination Timetable</span>
            </h4>
            <span className="text-[11px] text-emerald-200">
              Briefing: <strong>{activeExam.briefingDate}</strong>
            </span>
          </div>

          {activeExam.papers && activeExam.papers.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2.5 text-xs">
              {activeExam.papers.map((p, idx) => (
                <div 
                  key={p.id || idx}
                  className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-700/70 flex items-center justify-between gap-2"
                >
                  <div>
                    <div className="font-bold text-white flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                      <span>{p.paper}</span>
                    </div>
                    <div className="text-[10px] text-slate-400 mt-0.5">
                      {p.date} • {p.time}
                    </div>
                  </div>
                  <span className="font-mono text-[10px] bg-emerald-950 text-emerald-300 px-2 py-0.5 rounded border border-emerald-800 shrink-0">
                    {p.code}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-4 bg-slate-900/60 rounded-xl text-center text-xs text-slate-400">
              No individual paper breakdown uploaded yet for this exam schedule.
            </div>
          )}

          {/* Candidate Rules Checklist */}
          <div className="mt-3 p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-[11px] text-slate-300 grid sm:grid-cols-3 gap-2">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>Valid School Identity Card & Index Slip required</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>Non-programmable calculators & mathematical sets only</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>Punctuality: Assemble 30 minutes before reading time</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
