import React from 'react';
import { PageType } from '../types';
import { SCHOOL_INFO, QUICK_STATS, HEADTEACHER_WELCOME_SPEECH } from '../data/schoolData';
import { 
  GraduationCap, 
  BookOpen, 
  Award, 
  ArrowRight, 
  CheckCircle2, 
  Phone, 
  MessageSquare, 
  Volume2, 
  ShieldCheck, 
  Sparkles, 
  Users, 
  MapPin, 
  Compass, 
  Clock,
  HeartHandshake,
  Calendar,
  CalendarDays
} from 'lucide-react';

interface HomePageProps {
  onNavigate: (page: PageType) => void;
  onOpenPortal: () => void;
  onOpenTTS: () => void;
  onOpenVisualizer: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  onNavigate,
  onOpenPortal,
  onOpenTTS,
  onOpenVisualizer,
}) => {
  return (
    <div className="space-y-16 sm:space-y-24 pb-16">
      {/* HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-br from-emerald-950 via-slate-900 to-emerald-900 text-white pt-12 pb-20 sm:pt-20 sm:pb-28">
        {/* Subtle Islamic Motif Background Overlay */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#34d399_1.5px,transparent_1.5px)] [background-size:28px_28px] pointer-events-none"></div>
        <div className="absolute top-1/4 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-10 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Column: School Value Proposition */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-800/80 border border-emerald-600/60 text-xs font-semibold text-emerald-200 shadow-sm">
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping"></span>
                <span>Admissions Ongoing for S.1 & S.5 • 2025/2026 Academic Year</span>
              </div>

              {/* Catchy Headline */}
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.12]">
                Nurturing Academic Distinction{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-amber-200 to-emerald-300">
                  Grounded in Noble Islamic Morals
                </span>
              </h1>

              {/* Subtitle / Overview */}
              <p className="text-sm sm:text-base lg:text-lg text-emerald-100/90 leading-relaxed max-w-2xl mx-auto lg:mx-0">
                Welcome to <strong>{SCHOOL_INFO.name}</strong>, situated in Nyamitanga Division, Mbarara City (2 km off Mbarara–Isingiro Highway). We offer exceptional O-Level and A-Level secular education seamlessly integrated with authentic Islamic spiritual values, first-class boarding facilities, and dedicated mentorship.
              </p>

              {/* Prominent CTAs */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 pt-2">
                <button
                  onClick={() => onNavigate('admissions')}
                  className="px-6 py-3.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black rounded-xl text-sm shadow-lg hover:shadow-amber-500/20 transition-all flex items-center gap-2 active:scale-95"
                >
                  <GraduationCap className="w-4 h-4 text-slate-950" />
                  <span>Apply Now / Admissions</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  onClick={() => onNavigate('admissions')}
                  className="px-5 py-3.5 bg-emerald-800/90 hover:bg-emerald-700 text-white font-bold rounded-xl text-sm border border-emerald-600/60 shadow-md transition-all flex items-center gap-2"
                >
                  <BookOpen className="w-4 h-4 text-amber-300" />
                  <span>View Fee Structure</span>
                </button>

                <a
                  href="https://wa.me/256705705967?text=Assalamu%20Alaikum.%20I%20am%20inquiring%20about%20admissions%20at%20Shuhadae%20Islamic%20Secondary%20School%20Mbarara."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-sm shadow-md transition-all flex items-center gap-2"
                >
                  <MessageSquare className="w-4 h-4 text-white" />
                  <span>Chat on WhatsApp</span>
                </a>

                <button
                  onClick={onOpenTTS}
                  className="px-4 py-3.5 bg-slate-900/90 hover:bg-slate-800 text-emerald-200 hover:text-white font-semibold rounded-xl text-sm border border-slate-700 shadow-md transition-all flex items-center gap-1.5"
                  title="Listen to Headteacher Welcome Address"
                >
                  <Volume2 className="w-4 h-4 text-amber-400" />
                  <span>Audio Speech (TTS)</span>
                </button>
              </div>

              {/* Trust Badges */}
              <div className="pt-4 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs text-emerald-200/80">
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-amber-400" />
                  <span>UNEB Center U0842</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Co-Educational Day & Boarding</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-amber-400" />
                  <span>Mbarara City, Western Uganda</span>
                </span>
              </div>
            </div>

            {/* Right Column: Hero Visual Showcase */}
            <div className="lg:col-span-5">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-emerald-700/40 bg-slate-900 group">
                <img
                  src="https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&q=80&w=1000"
                  alt="Shuhadae Islamic Secondary School Campus"
                  className="w-full h-80 sm:h-96 object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent"></div>

                {/* Floating Highlight Card */}
                <div className="absolute bottom-4 left-4 right-4 p-4 rounded-2xl bg-slate-900/90 backdrop-blur-md border border-emerald-600/40 text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-amber-400 text-xs font-bold uppercase tracking-wider block">
                        Ranked Top Performers
                      </span>
                      <h4 className="font-extrabold text-sm text-white">
                        Mbarara District UNEB Exams
                      </h4>
                    </div>
                    <span className="px-2.5 py-1 rounded-full bg-emerald-600 text-[11px] font-bold">
                      98.4% Div 1 & 2
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-300 mt-1">
                    Delivering consistent distinctions in Sciences (Biology, Chemistry, Physics, Math) and Arts (IRE, History, Economics).
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* QUICK STATS BAR */}
      <section className="-mt-10 sm:-mt-14 max-w-7xl mx-auto px-4 sm:px-6 relative z-20">
        <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 transition-colors">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 text-center divide-y lg:divide-y-0 lg:divide-x divide-slate-100 dark:divide-slate-800">
            {QUICK_STATS.map((stat, idx) => (
              <div key={idx} className="pt-4 lg:pt-0 lg:px-4 first:pt-0">
                <div className="text-2xl sm:text-3xl lg:text-4xl font-black text-emerald-800 dark:text-emerald-400 tracking-tight">
                  {stat.value}
                </div>
                <div className="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-white mt-1">
                  {stat.label}
                </div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 font-medium">
                  {stat.sub}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* THREE PILLARS OF SHUHADAE EXCELLENCE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-emerald-700 dark:text-emerald-400 font-extrabold text-xs uppercase tracking-widest bg-emerald-100 dark:bg-emerald-950/80 px-3 py-1 rounded-full border border-transparent dark:border-emerald-800">
            Our Foundation
          </span>
          <h2 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight mt-3">
            Why Discerning Parents in Uganda Choose Shuhadae
          </h2>
          <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base mt-2">
            Combining national examination excellence with timeless Islamic upbringing to develop balanced future leaders.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Card 1: Academic Rigor */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-7 border border-slate-200 dark:border-slate-800 shadow-xs hover:shadow-lg hover:border-emerald-500 dark:hover:border-emerald-500 transition-all group flex flex-col justify-between">
            <div>
              <div className="w-14 h-14 rounded-2xl bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 flex items-center justify-center font-bold text-xl mb-5 group-hover:scale-110 transition-transform">
                <GraduationCap className="w-7 h-7 text-emerald-800 dark:text-emerald-400" />
              </div>
              <h3 className="text-lg font-extrabold text-slate-900 dark:text-white mb-2">
                Premier O & A-Level Curriculum
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                Implementing the New Lower Secondary Curriculum (NLSC) with practical project assessments, alongside stellar UACE Science (BCM, PCB, PEM, PCM) and Arts combinations tailored for direct university admission into MUST and Makerere.
              </p>
            </div>
            <button
              onClick={() => onNavigate('academics')}
              className="mt-6 text-xs font-bold text-emerald-800 dark:text-emerald-400 hover:text-emerald-900 dark:hover:text-emerald-300 flex items-center gap-1.5 cursor-pointer"
            >
              <span>Explore Curriculum & Combinations</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Card 2: Islamic Morals & Deen */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-7 border border-slate-200 dark:border-slate-800 shadow-xs hover:shadow-lg hover:border-emerald-500 dark:hover:border-emerald-500 transition-all group flex flex-col justify-between">
            <div>
              <div className="w-14 h-14 rounded-2xl bg-amber-100 dark:bg-amber-950/80 text-amber-900 dark:text-amber-300 flex items-center justify-center font-bold text-xl mb-5 group-hover:scale-110 transition-transform">
                <BookOpen className="w-7 h-7 text-amber-800 dark:text-amber-400" />
              </div>
              <h3 className="text-lg font-extrabold text-slate-900 dark:text-white mb-2">
                Spiritual Nurturing & Tarbiyyah
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                All 5 daily congregational prayers observed in the school mosque, Friday Juma'at services, after-school Quran memorization (Tahfiz), and constant character molding to produce God-fearing learners with exemplary Adab.
              </p>
            </div>
            <button
              onClick={() => onNavigate('about')}
              className="mt-6 text-xs font-bold text-emerald-800 dark:text-emerald-400 hover:text-emerald-900 dark:hover:text-emerald-300 flex items-center gap-1.5 cursor-pointer"
            >
              <span>Discover Our Spiritual Environment</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Card 3: Boarding & Modern Facilities */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-7 border border-slate-200 dark:border-slate-800 shadow-xs hover:shadow-lg hover:border-emerald-500 dark:hover:border-emerald-500 transition-all group flex flex-col justify-between">
            <div>
              <div className="w-14 h-14 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 flex items-center justify-center font-bold text-xl mb-5 group-hover:scale-110 transition-transform">
                <ShieldCheck className="w-7 h-7 text-slate-800 dark:text-slate-200" />
              </div>
              <h3 className="text-lg font-extrabold text-slate-900 dark:text-white mb-2">
                Secure Boarding & Wholesome Halal Diet
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                Separate boys and girls boarding dormitories with resident wardens and matrons, 24/7 security, clean water systems, balanced halal nutrition, and an infirmary with registered nursing staff.
              </p>
            </div>
            <button
              onClick={() => onNavigate('campus-life')}
              className="mt-6 text-xs font-bold text-emerald-800 dark:text-emerald-400 hover:text-emerald-900 dark:hover:text-emerald-300 flex items-center gap-1.5 cursor-pointer"
            >
              <span>View Hostels & Campus Gallery</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </section>

      {/* HEADTEACHER'S MESSAGE SPOTLIGHT WITH TTS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="bg-gradient-to-br from-emerald-900 via-emerald-950 to-slate-900 text-white rounded-3xl p-8 sm:p-12 shadow-xl border-4 border-emerald-700/30">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-4 text-center">
              <div className="w-36 h-36 sm:w-44 sm:h-44 mx-auto rounded-3xl overflow-hidden border-4 border-amber-400 shadow-xl mb-4">
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400"
                  alt="Headteacher Hajji Dr. Sulaiman Bukenya"
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="font-black text-lg text-white">{SCHOOL_INFO.headteacher}</h3>
              <p className="text-amber-400 text-xs font-semibold">{SCHOOL_INFO.headteacherTitle}</p>
              <div className="mt-3">
                <button
                  onClick={onOpenTTS}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-800 hover:bg-emerald-700 text-amber-300 text-xs font-bold transition-colors"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                  <span>Listen to Welcome Speech</span>
                </button>
              </div>
            </div>

            <div className="lg:col-span-8 space-y-4">
              <span className="text-amber-400 text-xs font-bold uppercase tracking-wider block">
                Leadership Message
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-white">
                "We Mould the Mind, Foster the Character, and Preserve the Soul."
              </h2>
              <blockquote className="text-emerald-100 text-xs sm:text-sm leading-relaxed italic border-l-2 border-amber-400 pl-4 py-1">
                "At Shuhadae Islamic Secondary School, our conviction is firm: that true academic excellence cannot be divorced from moral rectitude. We prepare our sons and daughters not just to pass examinations, but to navigate the modern world with unshakeable Islamic faith, intellectual rigor, and self-discipline."
              </blockquote>
              <div className="pt-2 flex flex-wrap gap-4">
                <button
                  onClick={() => onNavigate('about')}
                  className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs transition-colors"
                >
                  Read Full History & Leadership Note
                </button>
                <button
                  onClick={() => onNavigate('admissions')}
                  className="px-5 py-2.5 bg-emerald-800 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs transition-colors border border-emerald-600/50"
                >
                  Admissions Procedures 2025/2026
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* QUICK ACADEMIC SNAPSHOT & COMBINATIONS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="bg-slate-50 dark:bg-slate-900/60 rounded-3xl p-8 sm:p-10 border border-slate-200 dark:border-slate-800 transition-colors">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div>
              <span className="text-emerald-700 dark:text-emerald-400 font-extrabold text-xs uppercase tracking-widest">
                Academic Offerings
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mt-1">
                Lower & Upper Secondary Programs
              </h2>
            </div>
            <button
              onClick={() => onNavigate('academics')}
              className="self-start sm:self-auto px-4 py-2 bg-emerald-800 hover:bg-emerald-900 dark:bg-emerald-700 dark:hover:bg-emerald-600 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <span>View All Subject Combinations</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
              <span className="text-xs font-bold text-emerald-800 dark:text-emerald-300 uppercase bg-emerald-100 dark:bg-emerald-950/80 px-2.5 py-1 rounded-md border border-transparent dark:border-emerald-800">
                Senior 1 to Senior 4 (UCE)
              </span>
              <h3 className="text-lg font-extrabold text-slate-900 dark:text-white mt-3 mb-2">
                New Lower Secondary Curriculum (NLSC)
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
                Learner-centered learning emphasizing critical thinking, hands-on scientific projects, DIT vocational certification, ICT integration, and UNEB national exams.
              </p>
              <ul className="text-xs text-slate-700 dark:text-slate-300 space-y-1.5">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span>Continuous Assessment (30% NLSC UNEB Score)</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span>Compulsory Islamic Religious Education (IRE) & Arabic Option</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span>Fully equipped Physics, Biology, and Chemistry laboratories</span>
                </li>
              </ul>
            </div>

            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
              <span className="text-xs font-bold text-amber-900 dark:text-amber-300 uppercase bg-amber-100 dark:bg-amber-950/80 px-2.5 py-1 rounded-md border border-transparent dark:border-amber-800">
                Senior 5 to Senior 6 (UACE)
              </span>
              <h3 className="text-lg font-extrabold text-slate-900 dark:text-white mt-3 mb-2">
                Advanced Level Arts & Science Combinations
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
                Specialized principal combinations preparing candidates for premier faculties at Makerere University, Mbarara University of Science & Technology (MUST), and IUIU.
              </p>
              <div className="flex flex-wrap gap-2 text-xs font-bold font-mono">
                {['BCM/ICT', 'PCB/Sub-Math', 'PEM/ICT', 'PCM/ICT', 'HEG/Div', 'DEG/Arabic', 'HEL/Sub-Math', 'MEA/ICT'].map((c, i) => (
                  <span key={i} className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700">
                    {c}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ACADEMIC CALENDAR & KEY DATES SPOTLIGHT */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-emerald-900 text-white rounded-3xl p-8 sm:p-10 border border-emerald-800 shadow-md">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-3 max-w-2xl">
              <div className="flex items-center gap-2 text-xs font-bold text-amber-300">
                <CalendarDays className="w-4 h-4 text-amber-400" />
                <span>2026 Academic Year Almanac</span>
                <span aria-hidden="true">·</span>
                <span className="text-emerald-300">Term III In Progress</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-white">
                Interactive Academic Calendar & Term Timetable
              </h2>
              <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed">
                Stay updated with official school term start and closing dates, UNEB UCE & UACE national examination periods, promotional assessment timetables, and parents visitation days. Sync directly to your Google or Apple Calendar with one click.
              </p>
              
              <div className="flex flex-wrap items-center gap-4 text-xs text-emerald-200/90 pt-1">
                <span>✓ Term I, II & III Roadmaps</span>
                <span>✓ National & Joint Mocks</span>
                <span>✓ Downloadable .ics Files</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
              <button
                onClick={() => onNavigate('academics')}
                className="px-6 py-3.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black rounded-xl text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2 active:scale-95 cursor-pointer"
              >
                <Calendar className="w-4 h-4 text-slate-950" />
                <span>Open Interactive Calendar</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* CALL TO ACTION BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="bg-gradient-to-r from-emerald-800 via-emerald-900 to-slate-950 text-white rounded-3xl p-8 sm:p-12 shadow-2xl relative overflow-hidden text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-6 border-2 border-amber-400">
          <div className="space-y-2 max-w-2xl">
            <h2 className="text-2xl sm:text-3xl font-black">
              Begin Your Journey of Faith & Distinction
            </h2>
            <p className="text-xs sm:text-sm text-emerald-100 leading-relaxed">
              Admissions for Senior One, Senior Five, and transferring students are ongoing. Download the application forms, view term fee requirements, or consult our admissions desk today.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
            <button
              onClick={() => onNavigate('admissions')}
              className="w-full sm:w-auto px-6 py-3 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black rounded-xl text-xs sm:text-sm shadow-md transition-all active:scale-95"
            >
              Apply Online Now
            </button>
            <a
              href={`tel:${SCHOOL_INFO.phonePrimary.replace(/\s+/g, '')}`}
              className="w-full sm:w-auto px-5 py-3 bg-emerald-700/80 hover:bg-emerald-600 text-white font-bold rounded-xl text-xs sm:text-sm border border-emerald-500/60 transition-all text-center"
            >
              Call {SCHOOL_INFO.phonePrimary}
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};
