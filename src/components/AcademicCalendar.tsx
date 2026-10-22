import React, { useState, useMemo } from 'react';
import { 
  Calendar as CalendarIcon, 
  Clock, 
  MapPin, 
  User, 
  FileText, 
  ChevronLeft, 
  ChevronRight, 
  Search, 
  Filter, 
  Download, 
  Printer, 
  CheckCircle2, 
  AlertCircle, 
  BookOpen, 
  GraduationCap, 
  Sparkles, 
  X,
  ExternalLink,
  Flame,
  Award,
  Layers,
  CalendarDays
} from 'lucide-react';
import { 
  ACADEMIC_TERMS, 
  CALENDAR_EVENTS, 
  CALENDAR_CATEGORIES, 
  TARGET_AUDIENCE_OPTIONS 
} from '../data/calendarData';
import { CalendarEvent, AcademicTerm, TargetAudience, CalendarCategory } from '../types';

export const AcademicCalendar: React.FC = () => {
  // Current date in simulation context: mid-October 2026
  const TODAY_STR = '2026-10-14';
  const today = new Date('2026-10-14T00:00:00');

  // View state: 'grid' (Month view), 'terms' (Term breakdown), 'agenda' (Chronological list), 'exams' (Exam period focus)
  const [viewMode, setViewMode] = useState<'grid' | 'terms' | 'agenda' | 'exams'>('grid');

  // Month navigation for Grid view (defaults to October 2026)
  const [currentYear, setCurrentYear] = useState<number>(2026);
  const [currentMonth, setCurrentMonth] = useState<number>(9); // 0-indexed (9 = October)

  // Filters
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedAudience, setSelectedAudience] = useState<string>('all');
  const [selectedTermId, setSelectedTermId] = useState<string>('term-3');

  // Selected date for day popup / details
  const [selectedDateStr, setSelectedDateStr] = useState<string | null>(null);

  // Selected single event for modal
  const [activeModalEvent, setActiveModalEvent] = useState<CalendarEvent | null>(null);

  // Success message after exporting .ics
  const [exportNotice, setExportNotice] = useState<string | null>(null);

  // Navigation handlers for month
  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(prev => prev - 1);
    } else {
      setCurrentMonth(prev => prev - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(prev => prev + 1);
    } else {
      setCurrentMonth(prev => prev + 1);
    }
  };

  const handleJumpToToday = () => {
    setCurrentYear(2026);
    setCurrentMonth(9); // October
    setSelectedDateStr(TODAY_STR);
  };

  // Month names
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  // Helper: days in current month
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayOfWeek = new Date(currentYear, currentMonth, 1).getDay(); // 0 is Sunday

  // Filtered events
  const filteredEvents = useMemo(() => {
    return CALENDAR_EVENTS.filter(event => {
      // Search
      if (searchTerm.trim()) {
        const query = searchTerm.toLowerCase();
        const matchesTitle = event.title.toLowerCase().includes(query);
        const matchesDesc = event.description.toLowerCase().includes(query);
        const matchesVenue = event.venue.toLowerCase().includes(query);
        const matchesPapers = event.paperCodes?.some(p => p.toLowerCase().includes(query));
        if (!matchesTitle && !matchesDesc && !matchesVenue && !matchesPapers) return false;
      }

      // Category filter
      if (selectedCategory !== 'all' && event.category !== selectedCategory) {
        return false;
      }

      // Audience filter
      if (selectedAudience !== 'all' && event.targetAudience !== selectedAudience) {
        return false;
      }

      // Term filter (when in agenda mode if term filter is applied)
      if (selectedTermId !== 'all' && event.termId !== selectedTermId) {
        return false;
      }

      return true;
    }).sort((a, b) => a.startDate.localeCompare(b.startDate));
  }, [searchTerm, selectedCategory, selectedAudience, selectedTermId]);

  // Events grouped by date string (YYYY-MM-DD)
  const eventsByDate = useMemo(() => {
    const map = new Map<string, CalendarEvent[]>();
    CALENDAR_EVENTS.forEach(ev => {
      // Single day or spans range
      if (ev.endDate && ev.endDate !== ev.startDate) {
        // Multi-day: add to all days in range (up to 35 days max)
        const start = new Date(ev.startDate);
        const end = new Date(ev.endDate);
        const curr = new Date(start);
        let safety = 0;
        while (curr <= end && safety < 60) {
          const dStr = curr.toISOString().slice(0, 10);
          const list = map.get(dStr) || [];
          list.push(ev);
          map.set(dStr, list);
          curr.setDate(curr.getDate() + 1);
          safety++;
        }
      } else {
        const list = map.get(ev.startDate) || [];
        list.push(ev);
        map.set(ev.startDate, list);
      }
    });
    return map;
  }, []);

  // Events for selected date
  const selectedDateEvents = useMemo(() => {
    if (!selectedDateStr) return [];
    return eventsByDate.get(selectedDateStr) || [];
  }, [selectedDateStr, eventsByDate]);

  // Exam period events specifically
  const examEvents = useMemo(() => {
    return CALENDAR_EVENTS.filter(e => e.isExamPeriod || e.category === 'exam');
  }, []);

  // Next upcoming major milestone from today
  const nextMilestone = useMemo(() => {
    return CALENDAR_EVENTS
      .filter(e => e.startDate >= TODAY_STR && e.isKeyDate)
      .sort((a, b) => a.startDate.localeCompare(b.startDate))[0] || CALENDAR_EVENTS[0];
  }, [TODAY_STR]);

  // Generate iCal (.ics) string for a single event
  const generateICS = (ev: CalendarEvent): string => {
    const startFormatted = ev.startDate.replace(/-/g, '');
    const endFormatted = (ev.endDate || ev.startDate).replace(/-/g, '');
    return [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Shuhadae Islamic Secondary School//Academic Calendar//EN',
      'CALSCALE:GREGORIAN',
      'BEGIN:VEVENT',
      `UID:${ev.id}@shuhadaeislamicssmbarara.com`,
      `DTSTAMP:${new Date().toISOString().replace(/[-:]/g, '').split('.')[0]}Z`,
      `DTSTART;VALUE=DATE:${startFormatted}`,
      `DTEND;VALUE=DATE:${endFormatted}`,
      `SUMMARY:${ev.title}`,
      `DESCRIPTION:${ev.description.replace(/\n/g, '\\n')}`,
      `LOCATION:${ev.venue}`,
      'STATUS:CONFIRMED',
      'END:VEVENT',
      'END:VCALENDAR'
    ].join('\r\n');
  };

  // Generate full calendar .ics
  const generateFullICS = (): string => {
    const lines = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Shuhadae Islamic Secondary School//Academic Calendar 2026//EN',
      'CALSCALE:GREGORIAN',
      'X-WR-CALNAME:Shuhadae Islamic SS Academic Calendar 2026',
      'X-WR-TIMEZONE:Africa/Kampala',
    ];

    CALENDAR_EVENTS.forEach(ev => {
      const startFormatted = ev.startDate.replace(/-/g, '');
      const endFormatted = (ev.endDate || ev.startDate).replace(/-/g, '');
      lines.push(
        'BEGIN:VEVENT',
        `UID:${ev.id}@shuhadaeislamicssmbarara.com`,
        `DTSTAMP:${new Date().toISOString().replace(/[-:]/g, '').split('.')[0]}Z`,
        `DTSTART;VALUE=DATE:${startFormatted}`,
        `DTEND;VALUE=DATE:${endFormatted}`,
        `SUMMARY:${ev.title}`,
        `DESCRIPTION:${ev.description.replace(/\n/g, '\\n')}`,
        `LOCATION:${ev.venue}`,
        'STATUS:CONFIRMED',
        'END:VEVENT'
      );
    });

    lines.push('END:VCALENDAR');
    return lines.join('\r\n');
  };

  const handleDownloadSingleICS = (ev: CalendarEvent) => {
    const icsContent = generateICS(ev);
    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${ev.id}-shuhadae-calendar.ics`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    setExportNotice(`Exported "${ev.title}" to iCal file (.ics)`);
    setTimeout(() => setExportNotice(null), 4000);
  };

  const handleDownloadFullCalendar = () => {
    const icsContent = generateFullICS();
    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `shuhadae-academic-calendar-2026.ics`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    setExportNotice(`Downloaded full 2026 Academic Calendar (.ics) for Google Calendar/Outlook/Apple Calendar.`);
    setTimeout(() => setExportNotice(null), 5000);
  };

  const handleGoogleCalendarLink = (ev: CalendarEvent) => {
    const startFormatted = ev.startDate.replace(/-/g, '') + 'T060000Z';
    const endFormatted = (ev.endDate || ev.startDate).replace(/-/g, '') + 'T150000Z';
    const title = encodeURIComponent(ev.title);
    const details = encodeURIComponent(`${ev.description}\n\nTarget: ${ev.targetAudience}\nCoordinator: ${ev.coordinator || 'Administration'}`);
    const location = encodeURIComponent(`${ev.venue}, Shuhadae Islamic SS Mbarara`);
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${startFormatted}/${endFormatted}&details=${details}&location=${location}`;
  };

  // Color helper for categories
  const getCategoryTheme = (category: CalendarCategory) => {
    switch (category) {
      case 'term':
        return { dot: 'bg-emerald-600', text: 'text-emerald-800 dark:text-emerald-300', border: 'border-emerald-200 dark:border-emerald-800', bg: 'bg-emerald-50 dark:bg-emerald-950/80' };
      case 'exam':
        return { dot: 'bg-rose-600', text: 'text-rose-800 dark:text-rose-300', border: 'border-rose-200 dark:border-rose-800', bg: 'bg-rose-50 dark:bg-rose-950/80' };
      case 'visitation':
        return { dot: 'bg-amber-500', text: 'text-amber-800 dark:text-amber-300', border: 'border-amber-200 dark:border-amber-800', bg: 'bg-amber-50 dark:bg-amber-950/80' };
      case 'islamic':
        return { dot: 'bg-teal-600', text: 'text-teal-800 dark:text-teal-300', border: 'border-teal-200 dark:border-teal-800', bg: 'bg-teal-50 dark:bg-teal-950/80' };
      case 'sports':
        return { dot: 'bg-blue-600', text: 'text-blue-800 dark:text-blue-300', border: 'border-blue-200 dark:border-blue-800', bg: 'bg-blue-50 dark:bg-blue-950/80' };
      case 'meeting':
        return { dot: 'bg-indigo-600', text: 'text-indigo-800 dark:text-indigo-300', border: 'border-indigo-200 dark:border-indigo-800', bg: 'bg-indigo-50 dark:bg-indigo-950/80' };
      case 'holiday':
        return { dot: 'bg-slate-600', text: 'text-slate-800 dark:text-slate-200', border: 'border-slate-200 dark:border-slate-700', bg: 'bg-slate-100 dark:bg-slate-800' };
      default:
        return { dot: 'bg-slate-600', text: 'text-slate-700 dark:text-slate-200', border: 'border-slate-200 dark:border-slate-700', bg: 'bg-slate-50 dark:bg-slate-800' };
    }
  };

  // Format date helper
  const formatDateLabel = (dateStr: string) => {
    const d = new Date(dateStr + 'T00:00:00');
    return d.toLocaleDateString('en-GB', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden transition-colors" id="academic-calendar-section">
      {/* SECTION HEADER BANNER */}
      <div className="p-6 sm:p-8 bg-gradient-to-r from-emerald-950 via-slate-900 to-emerald-900 text-white relative">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-300">
              <CalendarDays className="w-4 h-4 text-amber-400" />
              <span>Official Academic Almanac & Almanac Schedules</span>
              <span aria-hidden="true">·</span>
              <span className="font-mono text-amber-300">2026 Academic Year</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              Interactive Academic Calendar & Term Timetable
            </h2>
            <p className="text-xs sm:text-sm text-emerald-100/80 max-w-2xl leading-relaxed">
              Explore key school dates, term start & end times, UNEB UCE/UACE examination windows, promotional assessments, visitation schedules, and Islamic milestones.
            </p>
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              onClick={handleDownloadFullCalendar}
              className="px-3.5 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs rounded-xl transition-all shadow-xs flex items-center gap-2 cursor-pointer active:scale-95"
              title="Download entire 2026 school calendar in .ics format"
            >
              <Download className="w-3.5 h-3.5 text-slate-950" />
              <span>Sync All to Calendar (.ics)</span>
            </button>

            <button
              onClick={() => window.print()}
              className="px-3.5 py-2 bg-emerald-800/80 hover:bg-emerald-700 text-white font-semibold text-xs rounded-xl border border-emerald-600/60 transition-all flex items-center gap-2 cursor-pointer"
              title="Print official academic schedule"
            >
              <Printer className="w-3.5 h-3.5 text-emerald-200" />
              <span>Print Schedule</span>
            </button>
          </div>
        </div>

        {/* Current Term & Upcoming Milestone Ticker */}
        <div className="mt-6 pt-4 border-t border-emerald-800/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-emerald-200">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="font-bold text-white">Current Session:</span>
            <span>Term III 2026 (Ongoing · Sept 14 – Dec 4)</span>
          </div>

          {nextMilestone && (
            <div className="flex items-center gap-2 bg-emerald-900/80 px-3 py-1.5 rounded-lg border border-emerald-700/60">
              <Flame className="w-3.5 h-3.5 text-amber-400" />
              <span className="text-amber-300 font-bold">Upcoming Key Milestone:</span>
              <span className="text-white truncate max-w-xs">{nextMilestone.title}</span>
              <span className="text-emerald-300 font-mono text-[11px]">({formatDateLabel(nextMilestone.startDate)})</span>
            </div>
          )}
        </div>
      </div>

      {/* SUCCESS NOTIFICATION TOAST */}
      {exportNotice && (
        <div className="bg-emerald-800 text-white px-4 py-2.5 text-xs font-semibold flex items-center justify-between transition-all">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-300" />
            <span>{exportNotice}</span>
          </div>
          <button 
            onClick={() => setExportNotice(null)} 
            className="p-1 hover:text-emerald-200 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* MAIN CONTROLS & SEGMENTED VIEW SELECTOR */}
      <div className="p-4 sm:p-6 border-b border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/90 transition-colors">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Segmented View Mode Tabs */}
          <div className="inline-flex p-1 bg-slate-200/80 dark:bg-slate-800 rounded-xl max-w-fit">
            <button
              onClick={() => setViewMode('grid')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                viewMode === 'grid'
                  ? 'bg-white dark:bg-slate-700 text-emerald-950 dark:text-emerald-200 shadow-xs'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <CalendarIcon className="w-3.5 h-3.5" />
              <span>Month Calendar Grid</span>
            </button>

            <button
              onClick={() => setViewMode('terms')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                viewMode === 'terms'
                  ? 'bg-white dark:bg-slate-700 text-emerald-950 dark:text-emerald-200 shadow-xs'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Term Breakdowns</span>
            </button>

            <button
              onClick={() => setViewMode('agenda')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                viewMode === 'agenda'
                  ? 'bg-white dark:bg-slate-700 text-emerald-950 dark:text-emerald-200 shadow-xs'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              <span>Key Dates Timeline</span>
            </button>

            <button
              onClick={() => setViewMode('exams')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                viewMode === 'exams'
                  ? 'bg-white dark:bg-slate-700 text-emerald-950 dark:text-emerald-200 shadow-xs'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <GraduationCap className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" />
              <span>Exam Periods Focus</span>
            </button>
          </div>

          {/* Quick Search & Filters */}
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Search Input */}
            <div className="relative min-w-[200px] flex-1 sm:flex-initial">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search dates, exams, subjects..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 text-xs bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-hidden focus:ring-2 focus:ring-emerald-700"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>

            {/* Category Select */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="py-1.5 px-3 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs text-slate-700 dark:text-slate-200 font-medium focus:outline-hidden focus:ring-2 focus:ring-emerald-700"
            >
              <option value="all">All Categories</option>
              {CALENDAR_CATEGORIES.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.label}</option>
              ))}
            </select>

            {/* Audience Select */}
            <select
              value={selectedAudience}
              onChange={(e) => setSelectedAudience(e.target.value)}
              className="py-1.5 px-3 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs text-slate-700 dark:text-slate-200 font-medium focus:outline-hidden focus:ring-2 focus:ring-emerald-700"
            >
              <option value="all">All Classes / Audiences</option>
              {TARGET_AUDIENCE_OPTIONS.map(opt => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* VIEW 1: MONTHLY CALENDAR GRID */}
      {viewMode === 'grid' && (
        <div className="p-4 sm:p-6 space-y-6">
          {/* Calendar Header Navigator */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <h3 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white">
                {monthNames[currentMonth]} {currentYear}
              </h3>
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium hidden sm:inline">
                {currentMonth >= 8 && currentMonth <= 11 ? 'Term III Session' : currentMonth >= 4 && currentMonth <= 7 ? 'Term II Session' : 'Term I Session'}
              </span>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={handleJumpToToday}
                className="px-2.5 py-1 text-xs font-bold text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/80 hover:bg-emerald-100 dark:hover:bg-emerald-900 rounded-lg transition-all cursor-pointer mr-1 border border-transparent dark:border-emerald-800"
              >
                Today (Oct 2026)
              </button>
              <button
                onClick={handlePrevMonth}
                aria-label="Previous month"
                className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={handleNextMonth}
                aria-label="Next month"
                className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Grid View Table */}
          <div className="border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden bg-white dark:bg-slate-900 transition-colors">
            {/* Day of Week Headers */}
            <div className="grid grid-cols-7 bg-slate-100/90 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-800 text-center py-2.5 text-xs font-bold text-slate-700 dark:text-slate-300">
              <span className="text-rose-700 dark:text-rose-400">Sun</span>
              <span>Mon</span>
              <span>Tue</span>
              <span>Wed</span>
              <span>Thu</span>
              <span>Fri</span>
              <span className="text-emerald-800 dark:text-emerald-400">Sat</span>
            </div>

            {/* Day Cells */}
            <div className="grid grid-cols-7 auto-rows-fr divide-x divide-y divide-slate-100 dark:divide-slate-800">
              {/* Empty leading slots */}
              {Array.from({ length: firstDayOfWeek }).map((_, idx) => (
                <div key={`empty-${idx}`} className="min-h-[75px] sm:min-h-[95px] bg-slate-50/50 dark:bg-slate-950/40 p-1.5 sm:p-2 text-slate-300 dark:text-slate-600 text-xs select-none">
                </div>
              ))}

              {/* Days of the Month */}
              {Array.from({ length: daysInMonth }).map((_, idx) => {
                const dayNum = idx + 1;
                const mStr = String(currentMonth + 1).padStart(2, '0');
                const dStr = String(dayNum).padStart(2, '0');
                const dateKey = `${currentYear}-${mStr}-${dStr}`;
                const isToday = dateKey === TODAY_STR;
                const isSelected = dateKey === selectedDateStr;
                const dayEvents = eventsByDate.get(dateKey) || [];

                return (
                  <div
                    key={dateKey}
                    onClick={() => {
                      setSelectedDateStr(dateKey);
                      if (dayEvents.length === 1) {
                        setActiveModalEvent(dayEvents[0]);
                      }
                    }}
                    className={`min-h-[75px] sm:min-h-[95px] p-1.5 sm:p-2 transition-all cursor-pointer flex flex-col justify-between ${
                      isSelected 
                        ? 'bg-emerald-50/90 dark:bg-emerald-950/60 ring-2 ring-emerald-700 ring-inset' 
                        : isToday 
                        ? 'bg-amber-50/70 dark:bg-amber-950/30' 
                        : 'hover:bg-slate-50 dark:hover:bg-slate-800/60'
                    }`}
                  >
                    {/* Date Number Header */}
                    <div className="flex items-center justify-between">
                      <span className={`text-xs font-bold rounded-md px-1.5 py-0.5 inline-block ${
                        isToday 
                          ? 'bg-amber-400 text-slate-950 font-black shadow-xs' 
                          : 'text-slate-800 dark:text-slate-200'
                      }`}>
                        {dayNum}
                      </span>
                      {isToday && (
                        <span className="text-[10px] font-black text-amber-700 dark:text-amber-400 tracking-wider hidden sm:inline">
                          TODAY
                        </span>
                      )}
                    </div>

                    {/* Event indicators / chips inside cell */}
                    <div className="mt-1 space-y-1 overflow-hidden">
                      {dayEvents.slice(0, 2).map((ev) => {
                        const theme = getCategoryTheme(ev.category);
                        return (
                          <div
                            key={ev.id}
                            onClick={(e) => {
                              e.stopPropagation();
                              setActiveModalEvent(ev);
                            }}
                            className={`text-[10px] truncate px-1.5 py-0.5 rounded-sm border ${theme.bg} ${theme.border} ${theme.text} font-medium flex items-center gap-1 hover:brightness-95`}
                            title={`${ev.title} (${ev.startTime || 'All day'})`}
                          >
                            <span className={`w-1.5 h-1.5 rounded-full ${theme.dot} shrink-0`}></span>
                            <span className="truncate">{ev.title}</span>
                          </div>
                        );
                      })}

                      {dayEvents.length > 2 && (
                        <div className="text-[9px] text-slate-500 dark:text-slate-400 font-bold px-1">
                          +{dayEvents.length - 2} more
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Selected Date Details Panel (when a day is clicked) */}
          {selectedDateStr && (
            <div className="bg-slate-50 dark:bg-slate-800/80 rounded-2xl p-4 sm:p-5 border border-slate-200 dark:border-slate-700 space-y-3 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CalendarDays className="w-4 h-4 text-emerald-700 dark:text-emerald-400" />
                  <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">
                    Events Scheduled for {formatDateLabel(selectedDateStr)}
                  </h4>
                </div>
                <button
                  onClick={() => setSelectedDateStr(null)}
                  className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 text-xs font-semibold cursor-pointer"
                >
                  Clear Selection
                </button>
              </div>

              {selectedDateEvents.length === 0 ? (
                <p className="text-xs text-slate-500 dark:text-slate-400 italic py-2">
                  No special examinations or school-wide events scheduled for this specific date. Regular academic lessons and prep routine follow standard timetable.
                </p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                  {selectedDateEvents.map(ev => {
                    const theme = getCategoryTheme(ev.category);
                    return (
                      <div
                        key={ev.id}
                        onClick={() => setActiveModalEvent(ev)}
                        className={`p-3.5 rounded-xl border ${theme.border} bg-white dark:bg-slate-900 shadow-xs hover:border-emerald-600 dark:hover:border-emerald-500 transition-all cursor-pointer flex flex-col justify-between`}
                      >
                        <div>
                          <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 mb-1">
                            <span className={`font-bold ${theme.text}`}>
                              {CALENDAR_CATEGORIES.find(c => c.id === ev.category)?.label}
                            </span>
                            {ev.startTime && (
                              <span className="font-mono">{ev.startTime}</span>
                            )}
                          </div>
                          <h5 className="font-extrabold text-sm text-slate-900 dark:text-white mb-1 leading-snug">
                            {ev.title}
                          </h5>
                          <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2">
                            {ev.description}
                          </p>
                        </div>

                        <div className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px]">
                          <span className="text-slate-500 dark:text-slate-400 font-medium truncate max-w-[180px]">
                            📍 {ev.venue}
                          </span>
                          <span className="text-emerald-700 dark:text-emerald-400 font-bold hover:underline">
                            View Details →
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* Category Color Legend */}
          <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600 dark:text-slate-300 pt-2 border-t border-slate-100 dark:border-slate-800">
            <span className="font-bold text-slate-700 dark:text-slate-200">Category Legend:</span>
            {CALENDAR_CATEGORIES.map(cat => {
              const theme = getCategoryTheme(cat.id);
              return (
                <div key={cat.id} className="flex items-center gap-1.5">
                  <span className={`w-2.5 h-2.5 rounded-full ${theme.dot}`}></span>
                  <span>{cat.label}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* VIEW 2: TERM BREAKDOWNS & ROADMAPS */}
      {viewMode === 'terms' && (
        <div className="p-4 sm:p-6 space-y-6">
          <div className="max-w-2xl">
            <h3 className="text-lg font-black text-slate-900 dark:text-white">
              Uganda Ministry of Education 2026 Academic Terms
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
              Detailed reporting times, mid-term break schedules, promotional exam windows, and closing times for all three terms at Shuhadae Islamic Secondary School.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {ACADEMIC_TERMS.map((term) => {
              const isOngoing = term.status === 'ongoing';
              const isCompleted = term.status === 'completed';

              return (
                <div
                  key={term.id}
                  className={`rounded-2xl p-6 border transition-all flex flex-col justify-between ${
                    isOngoing
                      ? 'bg-emerald-950 text-white border-2 border-amber-400 shadow-md relative'
                      : 'bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 border-slate-200 dark:border-slate-800'
                  }`}
                >
                  <div>
                    {/* Status Indicator */}
                    <div className="flex items-center justify-between mb-3">
                      <span className={`text-xs font-black uppercase tracking-wider ${
                        isOngoing ? 'text-amber-400' : isCompleted ? 'text-slate-500 dark:text-slate-400' : 'text-emerald-700 dark:text-emerald-400'
                      }`}>
                        {term.name}
                      </span>
                      <span className={`text-[11px] font-bold px-2 py-0.5 rounded-md ${
                        isOngoing
                          ? 'bg-amber-400 text-slate-950'
                          : isCompleted
                          ? 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-transparent dark:border-slate-700'
                          : 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-transparent dark:border-emerald-800'
                      }`}>
                        {isOngoing ? 'CURRENTLY ACTIVE' : isCompleted ? 'CONCLUDED' : 'UPCOMING'}
                      </span>
                    </div>

                    <h4 className={`text-base font-extrabold mb-1 ${isOngoing ? 'text-white' : 'text-slate-900 dark:text-white'}`}>
                      {term.theme}
                    </h4>

                    {/* Duration & dates */}
                    <div className={`text-xs font-mono mb-4 pb-3 border-b ${
                      isOngoing ? 'border-emerald-800 text-emerald-300' : 'border-slate-100 dark:border-slate-800 text-slate-500 dark:text-slate-400'
                    }`}>
                      {formatDateLabel(term.startDate)} – {formatDateLabel(term.endDate)} ({term.durationWeeks} Weeks)
                    </div>

                    {/* Breakdown Checklist */}
                    <div className="space-y-3 text-xs">
                      <div>
                        <span className={`font-bold block text-[11px] ${isOngoing ? 'text-emerald-300' : 'text-slate-500 dark:text-slate-400'}`}>
                          Reporting Times:
                        </span>
                        <p className={isOngoing ? 'text-emerald-100' : 'text-slate-700 dark:text-slate-300'}>
                          {term.reportingContinuers}
                        </p>
                      </div>

                      <div>
                        <span className={`font-bold block text-[11px] ${isOngoing ? 'text-emerald-300' : 'text-slate-500 dark:text-slate-400'}`}>
                          Mid-Term Break:
                        </span>
                        <p className={isOngoing ? 'text-emerald-100' : 'text-slate-700 dark:text-slate-300'}>
                          {formatDateLabel(term.midTermBreak.start)} to {formatDateLabel(term.midTermBreak.end)}
                        </p>
                      </div>

                      <div>
                        <span className={`font-bold block text-[11px] ${isOngoing ? 'text-amber-300' : 'text-rose-700 dark:text-rose-400'}`}>
                          Major Exam Period:
                        </span>
                        <p className={`font-medium ${isOngoing ? 'text-white' : 'text-slate-800 dark:text-slate-200'}`}>
                          {term.examPeriod.name}
                        </p>
                        <span className={`text-[11px] font-mono ${isOngoing ? 'text-emerald-300' : 'text-slate-500 dark:text-slate-400'}`}>
                          {formatDateLabel(term.examPeriod.start)} – {formatDateLabel(term.examPeriod.end)}
                        </span>
                      </div>

                      <div>
                        <span className={`font-bold block text-[11px] ${isOngoing ? 'text-emerald-300' : 'text-slate-500 dark:text-slate-400'}`}>
                          Fees Clearance Deadline:
                        </span>
                        <p className={isOngoing ? 'text-emerald-100' : 'text-slate-700 dark:text-slate-300'}>
                          {term.feesDeadline}
                        </p>
                      </div>

                      <div>
                        <span className={`font-bold block text-[11px] ${isOngoing ? 'text-emerald-300' : 'text-slate-500 dark:text-slate-400'}`}>
                          Term Closes:
                        </span>
                        <p className={isOngoing ? 'text-emerald-100' : 'text-slate-700 dark:text-slate-300'}>
                          {term.closingDate}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className={`mt-6 pt-3 border-t text-[11px] flex items-center justify-between ${
                    isOngoing ? 'border-emerald-800' : 'border-slate-100 dark:border-slate-800'
                  }`}>
                    <span className={isOngoing ? 'text-emerald-300' : 'text-slate-500 dark:text-slate-400'}>
                      {isOngoing ? 'Week 5 of 12 (Term III)' : 'UNEB Approved'}
                    </span>
                    <button
                      onClick={() => {
                        setSelectedTermId(term.id);
                        setViewMode('agenda');
                      }}
                      className={`font-bold underline cursor-pointer ${
                        isOngoing ? 'text-amber-400 hover:text-amber-300' : 'text-emerald-800 dark:text-emerald-400 hover:text-emerald-900 dark:hover:text-emerald-300'
                      }`}
                    >
                      View All Term Events →
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* VIEW 3: KEY DATES TIMELINE & AGENDA LIST */}
      {viewMode === 'agenda' && (
        <div className="p-4 sm:p-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-lg font-black text-slate-900 dark:text-white">
                Chronological Key Dates & Events Directory
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Displaying {filteredEvents.length} events matching your current filters.
              </p>
            </div>

            {/* Term Filter Pills */}
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400 mr-1">Term:</span>
              {[
                { id: 'all', label: 'All Terms' },
                { id: 'term-3', label: 'Term III (Active)' },
                { id: 'term-2', label: 'Term II' },
                { id: 'term-1', label: 'Term I' },
              ].map(t => (
                <button
                  key={t.id}
                  onClick={() => setSelectedTermId(t.id)}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    selectedTermId === t.id
                      ? 'bg-emerald-800 dark:bg-emerald-700 text-white shadow-xs'
                      : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          {filteredEvents.length === 0 ? (
            <div className="text-center py-12 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700">
              <CalendarIcon className="w-8 h-8 text-slate-400 mx-auto mb-2" />
              <h4 className="font-bold text-slate-700 dark:text-slate-300 text-sm">No events found matching your criteria</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Try resetting the category or search filters above.</p>
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory('all');
                  setSelectedAudience('all');
                  setSelectedTermId('all');
                }}
                className="mt-3 px-3 py-1.5 bg-emerald-800 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold cursor-pointer transition-colors"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredEvents.map((ev) => {
                const theme = getCategoryTheme(ev.category);
                const isPast = ev.startDate < TODAY_STR;
                const isToday = ev.startDate === TODAY_STR || (ev.endDate && ev.startDate <= TODAY_STR && ev.endDate >= TODAY_STR);

                return (
                  <div
                    key={ev.id}
                    onClick={() => setActiveModalEvent(ev)}
                    className={`p-4 sm:p-5 rounded-2xl border transition-all cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-4 hover:shadow-sm ${
                      isToday 
                        ? 'bg-amber-50/80 dark:bg-amber-950/40 border-amber-300 dark:border-amber-600' 
                        : isPast 
                        ? 'bg-slate-50/70 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 opacity-80' 
                        : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-emerald-600 dark:hover:border-emerald-500'
                    }`}
                  >
                    {/* Left: Date badge & time */}
                    <div className="flex items-start gap-4">
                      <div className="min-w-[85px] text-center p-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shrink-0">
                        <span className="text-[10px] font-bold uppercase text-slate-500 dark:text-slate-400 block">
                          {new Date(ev.startDate + 'T00:00:00').toLocaleDateString('en-GB', { month: 'short' })}
                        </span>
                        <span className="text-xl font-black text-slate-900 dark:text-white block leading-tight">
                          {new Date(ev.startDate + 'T00:00:00').getDate()}
                        </span>
                        <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono block">
                          {new Date(ev.startDate + 'T00:00:00').toLocaleDateString('en-GB', { weekday: 'short' })}
                        </span>
                      </div>

                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-xs">
                          <span className={`font-bold ${theme.text}`}>
                            {CALENDAR_CATEGORIES.find(c => c.id === ev.category)?.label}
                          </span>
                          <span aria-hidden="true" className="text-slate-400 dark:text-slate-600">·</span>
                          <span className="text-slate-500 dark:text-slate-400">
                            Audience: <strong className="text-slate-700 dark:text-slate-200">{ev.targetAudience}</strong>
                          </span>
                          {ev.isKeyDate && (
                            <>
                              <span aria-hidden="true" className="text-slate-400 dark:text-slate-600">·</span>
                              <span className="text-amber-700 dark:text-amber-400 font-extrabold text-[11px]">★ Key Date</span>
                            </>
                          )}
                        </div>

                        <h4 className="text-base font-extrabold text-slate-900 dark:text-white">
                          {ev.title}
                        </h4>

                        <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 max-w-2xl">
                          {ev.description}
                        </p>

                        <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 dark:text-slate-400 pt-1">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5 text-slate-400" />
                            <span>{ev.startTime ? `${ev.startTime}${ev.endTime ? ` – ${ev.endTime}` : ''}` : 'Scheduled Day'}</span>
                          </span>
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5 text-slate-400" />
                            <span>{ev.venue}</span>
                          </span>
                          {ev.endDate && ev.endDate !== ev.startDate && (
                            <span className="font-mono text-[11px] text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/80 px-2 py-0.5 rounded-sm border border-transparent dark:border-emerald-800">
                              Duration: Until {formatDateLabel(ev.endDate)}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Right: Quick actions */}
                    <div className="flex items-center gap-2 self-end md:self-center shrink-0">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDownloadSingleICS(ev);
                        }}
                        className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 transition-all cursor-pointer"
                        title="Download iCal (.ics)"
                      >
                        <Download className="w-3.5 h-3.5" />
                      </button>

                      <a
                        href={handleGoogleCalendarLink(ev)}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="px-3 py-1.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 dark:bg-emerald-700 dark:hover:bg-emerald-600 text-white font-bold text-xs flex items-center gap-1 transition-all"
                      >
                        <span>Google Cal</span>
                        <ExternalLink className="w-3 h-3 text-emerald-300" />
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* VIEW 4: EXAM PERIODS FOCUS */}
      {viewMode === 'exams' && (
        <div className="p-4 sm:p-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-rose-700 dark:text-rose-400">
                <GraduationCap className="w-4 h-4 text-rose-600 dark:text-rose-400" />
                <span>UNEB Standards & Academic Evaluations</span>
              </div>
              <h3 className="text-xl font-black text-slate-900 dark:text-white mt-0.5">
                Examination Windows & Candidate Briefing Sessions
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 max-w-2xl">
                Official national examinations (UNEB UCE & UACE), joint inter-school mocks, and lower secondary promotional assessments for the 2026 academic calendar.
              </p>
            </div>

            <div className="p-3 bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-900 rounded-2xl text-xs text-rose-900 dark:text-rose-200">
              <span className="font-bold block">UNEB Examination Center:</span>
              <span className="font-mono font-black text-sm text-rose-950 dark:text-rose-100">U0842</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {examEvents.map(exam => {
              const isPast = exam.startDate < TODAY_STR;
              const isToday = exam.startDate === TODAY_STR || (exam.endDate && exam.startDate <= TODAY_STR && exam.endDate >= TODAY_STR);

              return (
                <div
                  key={exam.id}
                  onClick={() => setActiveModalEvent(exam)}
                  className="bg-white dark:bg-slate-900 rounded-2xl p-5 border-2 border-slate-200 dark:border-slate-800 hover:border-rose-400 dark:hover:border-rose-500 transition-all shadow-xs flex flex-col justify-between cursor-pointer"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-extrabold text-rose-700 dark:text-rose-400 uppercase">
                        {exam.targetAudience}
                      </span>
                      <span className={`text-[11px] font-mono font-bold px-2 py-0.5 rounded-md ${
                        isToday ? 'bg-amber-400 text-slate-950' : isPast ? 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400' : 'bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-300 border border-transparent dark:border-rose-800'
                      }`}>
                        {isToday ? 'IN PROGRESS' : isPast ? 'CONCLUDED' : 'UPCOMING'}
                      </span>
                    </div>

                    <h4 className="text-base font-extrabold text-slate-900 dark:text-white">
                      {exam.title}
                    </h4>

                    <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-100 dark:border-slate-700 text-xs space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500 dark:text-slate-400 font-medium">Dates:</span>
                        <span className="font-bold text-slate-800 dark:text-slate-200 font-mono">
                          {formatDateLabel(exam.startDate)} {exam.endDate ? `– ${formatDateLabel(exam.endDate)}` : ''}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500 dark:text-slate-400 font-medium">Exam Venue:</span>
                        <span className="font-semibold text-slate-700 dark:text-slate-300">{exam.venue}</span>
                      </div>
                      {exam.startTime && (
                        <div className="flex items-center justify-between">
                          <span className="text-slate-500 dark:text-slate-400 font-medium">Session Hours:</span>
                          <span className="font-mono text-slate-700 dark:text-slate-300">{exam.startTime} – {exam.endTime}</span>
                        </div>
                      )}
                    </div>

                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                      {exam.description}
                    </p>

                    {/* Paper codes if present */}
                    {exam.paperCodes && exam.paperCodes.length > 0 && (
                      <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                        <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block mb-1">Key Subject Codes:</span>
                        <div className="flex flex-wrap gap-1.5">
                          {exam.paperCodes.map((code, idx) => (
                            <span key={idx} className="font-mono text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 px-2 py-0.5 rounded-md border border-slate-200 dark:border-slate-700">
                              {code}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                    <span className="text-slate-500 dark:text-slate-400 text-[11px]">
                      Coordinator: <strong>{exam.coordinator || 'Dean of Studies'}</strong>
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveModalEvent(exam);
                      }}
                      className="font-bold text-rose-700 dark:text-rose-400 hover:text-rose-900 dark:hover:text-rose-300 cursor-pointer"
                    >
                      View Instructions →
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* EVENT DETAILS MODAL / DRAWER */}
      {activeModalEvent && (
        <div 
          role="dialog"
          aria-modal="true"
          aria-labelledby="calendar-modal-title"
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setActiveModalEvent(null)}
        >
          <div 
            className="bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full p-6 sm:p-7 text-slate-800 dark:text-slate-200 shadow-2xl border border-emerald-950/20 dark:border-slate-800 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-start justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
              <div>
                <span className="text-xs font-bold text-emerald-800 dark:text-emerald-400 uppercase tracking-wide">
                  {CALENDAR_CATEGORIES.find(c => c.id === activeModalEvent.category)?.label}
                </span>
                <h3 id="calendar-modal-title" className="text-lg sm:text-xl font-black text-slate-900 dark:text-white mt-1">
                  {activeModalEvent.title}
                </h3>
              </div>
              <button
                onClick={() => setActiveModalEvent(null)}
                aria-label="Close dialog"
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="py-4 space-y-4 text-xs">
              {/* Event Time & Location Card */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
                <div>
                  <span className="text-slate-400 dark:text-slate-500 font-bold block text-[10px] uppercase">Scheduled Date:</span>
                  <span className="font-extrabold text-slate-900 dark:text-white text-sm">
                    {formatDateLabel(activeModalEvent.startDate)}
                  </span>
                  {activeModalEvent.endDate && activeModalEvent.endDate !== activeModalEvent.startDate && (
                    <span className="block text-slate-500 dark:text-slate-400 text-[11px]">
                      Through {formatDateLabel(activeModalEvent.endDate)}
                    </span>
                  )}
                </div>

                <div>
                  <span className="text-slate-400 dark:text-slate-500 font-bold block text-[10px] uppercase">Hours / Time:</span>
                  <span className="font-mono font-bold text-slate-800 dark:text-slate-200 text-sm">
                    {activeModalEvent.startTime ? `${activeModalEvent.startTime}${activeModalEvent.endTime ? ` – ${activeModalEvent.endTime}` : ''}` : 'School Working Hours'}
                  </span>
                </div>

                <div>
                  <span className="text-slate-400 dark:text-slate-500 font-bold block text-[10px] uppercase">Venue:</span>
                  <span className="font-medium text-slate-800 dark:text-slate-200">
                    {activeModalEvent.venue}
                  </span>
                </div>

                <div>
                  <span className="text-slate-400 dark:text-slate-500 font-bold block text-[10px] uppercase">Target Audience:</span>
                  <span className="font-bold text-emerald-800 dark:text-emerald-400">
                    {activeModalEvent.targetAudience}
                  </span>
                </div>
              </div>

              {/* Description */}
              <div>
                <h4 className="font-extrabold text-slate-900 dark:text-white mb-1">Details & Context:</h4>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-xs">
                  {activeModalEvent.description}
                </p>
              </div>

              {/* Coordinator */}
              {activeModalEvent.coordinator && (
                <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400 pt-1">
                  <User className="w-4 h-4 text-slate-400" />
                  <span>Official In-Charge: <strong className="text-slate-800 dark:text-slate-200">{activeModalEvent.coordinator}</strong></span>
                </div>
              )}

              {/* Requirements Checklist */}
              {activeModalEvent.requirements && activeModalEvent.requirements.length > 0 && (
                <div className="pt-2">
                  <h4 className="font-extrabold text-slate-900 dark:text-white mb-2 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    <span>Candidate / Learner Requirements:</span>
                  </h4>
                  <ul className="space-y-1.5 bg-emerald-50/60 dark:bg-emerald-950/40 p-3 rounded-xl border border-emerald-100 dark:border-emerald-800">
                    {activeModalEvent.requirements.map((req, i) => (
                      <li key={i} className="flex items-start gap-2 text-slate-700 dark:text-slate-300">
                        <span className="text-emerald-700 dark:text-emerald-400 font-bold">•</span>
                        <span>{req}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Paper Codes */}
              {activeModalEvent.paperCodes && activeModalEvent.paperCodes.length > 0 && (
                <div>
                  <h4 className="font-extrabold text-slate-900 dark:text-white mb-1.5">Scheduled Examination Papers:</h4>
                  <div className="flex flex-wrap gap-1.5">
                    {activeModalEvent.paperCodes.map((code, idx) => (
                      <span key={idx} className="font-mono text-xs bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700">
                        {code}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Modal Actions */}
            <div className="border-t border-slate-100 dark:border-slate-800 pt-4 flex flex-wrap items-center gap-2.5">
              <button
                onClick={() => handleDownloadSingleICS(activeModalEvent)}
                className="flex-1 py-2.5 px-3 bg-emerald-800 hover:bg-emerald-900 dark:bg-emerald-700 dark:hover:bg-emerald-600 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer active:scale-95"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download .ics file</span>
              </button>

              <a
                href={handleGoogleCalendarLink(activeModalEvent)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-2.5 px-3 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Add to Google Cal</span>
              </a>

              <button
                onClick={() => setActiveModalEvent(null)}
                className="py-2.5 px-4 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 font-semibold rounded-xl text-xs cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
