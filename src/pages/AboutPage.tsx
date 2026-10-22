import React from 'react';
import { PageType } from '../types';
import { SCHOOL_INFO, HEADTEACHER_WELCOME_SPEECH } from '../data/schoolData';
import { 
  BookOpen, 
  Target, 
  Eye, 
  Award, 
  ShieldCheck, 
  Volume2, 
  CheckCircle2, 
  Users, 
  HeartHandshake, 
  Compass,
  ArrowRight
} from 'lucide-react';

interface AboutPageProps {
  onNavigate: (page: PageType) => void;
  onOpenTTS: () => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ onNavigate, onOpenTTS }) => {
  const coreValues = [
    {
      arabic: 'التقوى (Taqwa)',
      title: 'God-Consciousness',
      description: 'Living with constant awareness of the Creator, anchoring every thought, examination effort, and interpersonal relationship in righteous moral accountability.'
    },
    {
      arabic: 'الإتقان (Itqan)',
      title: 'Academic Excellence & Rigor',
      description: 'Striving for meticulous perfection in scholarship, science practicals, critical problem-solving, and continuous learning.'
    },
    {
      arabic: 'الأمانة (Amanah)',
      title: 'Integrity & Trustworthiness',
      description: 'Upholding strict honesty in examinations, transparent administration, and reliable stewardship of community trust.'
    },
    {
      arabic: 'الأدب (Adab)',
      title: 'Discipline & Mutual Respect',
      description: 'Cultivating noble character, humility, courteous speech, reverent deference to teachers, and compassion toward peers.'
    },
    {
      arabic: 'الخدمة (Khidmah)',
      title: 'Selfless Community Service',
      description: 'Instilling the spirit of contributing meaningfully to Mbarara City, the Ankole sub-region, Uganda, and the global Ummah.'
    }
  ];

  const leadershipTeam = [
    {
      name: SCHOOL_INFO.headteacher,
      role: 'Headteacher & Director of Studies',
      qualifications: 'PhD (Ed. Mgt), M.Ed (MUST), BA Ed (Mak)',
      bio: 'Over 25 years of secondary education leadership in Uganda, pioneering the seamless integration of UNEB sciences with Islamic values.',
      image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400'
    },
    {
      name: SCHOOL_INFO.deputyAcademics,
      role: 'Deputy Headteacher (Academics)',
      qualifications: 'BSc Ed (Physics/Math - Makerere)',
      bio: 'Expert in the New Lower Secondary Curriculum and UNEB assessment standards, championing science practical excellence in Western Uganda.',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400'
    },
    {
      name: SCHOOL_INFO.deanIslamicAffairs,
      role: 'Dean of Islamic Affairs & Resident Imam',
      qualifications: 'BA Shariah & Islamic Jurisprudence (Islamic Univ. of Madinah)',
      bio: 'Oversees the spiritual curriculum, daily congregational prayers, Friday Juma\'at sermons, and the school Tahfiz (Quran memorization) program.',
      image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=400'
    }
  ];

  return (
    <div className="space-y-16 sm:space-y-20 pb-16">
      {/* Header Banner */}
      <section className="bg-gradient-to-r from-emerald-950 via-slate-900 to-emerald-900 text-white py-16 px-4 sm:px-6 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:20px_20px] pointer-events-none"></div>
        <div className="max-w-7xl mx-auto relative z-10 text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <span className="text-amber-400 font-bold text-xs uppercase tracking-widest bg-emerald-900/80 px-3 py-1 rounded-full border border-emerald-700">
              About Shuhadae Islamic Secondary School
            </span>
            <h1 className="text-3xl sm:text-5xl font-black tracking-tight mt-3">
              Heritage of Academic Rigor & Noble Character
            </h1>
            <p className="text-emerald-100/90 text-sm sm:text-base max-w-2xl mt-2">
              Located in Nyamitanga Division, Mbarara City, Western Uganda. Serving the nation since 1998 with uncompromised dedication.
            </p>
          </div>

          <button
            onClick={onOpenTTS}
            className="shrink-0 px-4 py-2.5 bg-emerald-800 hover:bg-emerald-700 text-amber-300 font-bold rounded-xl text-xs flex items-center gap-2 border border-emerald-600 shadow-md transition-colors"
          >
            <Volume2 className="w-4 h-4" />
            <span>Listen to Speech (TTS)</span>
          </button>
        </div>
      </section>

      {/* Vision & Mission Cards */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between transition-colors">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 flex items-center justify-center font-bold mb-4 border border-transparent dark:border-emerald-800">
                <Eye className="w-6 h-6 text-emerald-800 dark:text-emerald-400" />
              </div>
              <h2 className="text-xl font-black text-slate-900 dark:text-white mb-2">Our Vision</h2>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                To be the leading secondary institution of academic distinction, moral rectitude, and holistic human transformation in Western Uganda and the wider East African region.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 text-xs font-mono font-bold text-emerald-700 dark:text-emerald-400">
              Motto: "Knowledge, Faith and Integrity"
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between transition-colors">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-amber-100 dark:bg-amber-950/80 text-amber-900 dark:text-amber-300 flex items-center justify-center font-bold mb-4 border border-transparent dark:border-amber-800">
                <Target className="w-6 h-6 text-amber-800 dark:text-amber-400" />
              </div>
              <h2 className="text-xl font-black text-slate-900 dark:text-white mb-2">Our Mission</h2>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                To provide accessible, high-caliber O-Level and A-Level education grounded in authentic Islamic morals, equipping young men and women with scientific intellect, ethical resilience, and leadership qualities.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 text-xs font-mono font-bold text-amber-700 dark:text-amber-400">
              Guidance: "Nurturing Mind, Soul and Character"
            </div>
          </div>
        </div>
      </section>

      {/* SCHOOL HISTORY SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="bg-slate-50 dark:bg-slate-900/60 rounded-3xl p-8 sm:p-12 border border-slate-200 dark:border-slate-800 transition-colors">
          <div className="max-w-3xl">
            <span className="text-emerald-700 dark:text-emerald-400 font-extrabold text-xs uppercase tracking-widest">
              Founding Story & Growth
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight mt-2 mb-6">
              Our Journey in Nyamitanga, Mbarara City
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 text-slate-700 dark:text-slate-300 text-xs sm:text-sm leading-relaxed">
            <div className="lg:col-span-7 space-y-4">
              <p>
                <strong>Shuhadae Islamic Secondary School</strong> was established in 1998 by a dedicated consortium of Muslim educationists and community elders in Mbarara. The founding vision was clear: to fill a crucial void in Western Uganda for an institution that delivers top-tier secular academics without compromising Islamic values, prayers, and dietary standards.
              </p>
              <p>
                Located in Nyamitanga Division, just 2 kilometers off the Mbarara–Isingiro Highway, the school has grown from a humble enrollment of 80 learners into a thriving educational center of over 1,250 day and boarding students from across Uganda, Rwanda, Tanzania, and the East African diaspora.
              </p>
              <p>
                Over the past two and a half decades, Shuhadae has built ultra-modern science laboratories, expanded the school mosque, established high-speed ICT centers, and consistently produced candidates who feature among the top Division One performers in Mbarara District and the Ankole region.
              </p>
            </div>

            <div className="lg:col-span-5 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
              <h3 className="font-extrabold text-slate-900 dark:text-white text-sm uppercase tracking-wide border-b border-slate-100 dark:border-slate-800 pb-2">
                Milestones at a Glance
              </h3>
              <div className="space-y-3 text-xs">
                <div className="flex items-start gap-3">
                  <span className="font-mono font-bold text-emerald-800 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-950/80 px-2 py-0.5 rounded border border-transparent dark:border-emerald-800">1998</span>
                  <p className="text-slate-700 dark:text-slate-300">Inception with O-Level classes in Nyamitanga</p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="font-mono font-bold text-emerald-800 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-950/80 px-2 py-0.5 rounded border border-transparent dark:border-emerald-800">2004</span>
                  <p className="text-slate-700 dark:text-slate-300">Accredited UNEB Examination Center status (U0842)</p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="font-mono font-bold text-emerald-800 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-950/80 px-2 py-0.5 rounded border border-transparent dark:border-emerald-800">2009</span>
                  <p className="text-slate-700 dark:text-slate-300">Introduction of Advanced Level (A-Level) Sciences & Arts combinations</p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="font-mono font-bold text-emerald-800 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-950/80 px-2 py-0.5 rounded border border-transparent dark:border-emerald-800">2018</span>
                  <p className="text-slate-700 dark:text-slate-300">Commissioning of Modern School Mosque & Tahfiz Quran Wing</p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="font-mono font-bold text-emerald-800 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-950/80 px-2 py-0.5 rounded border border-transparent dark:border-emerald-800">2024</span>
                  <p className="text-slate-700 dark:text-slate-300">Over 98% First & Second grade passes in UCE national exams</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CORE VALUES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-emerald-700 dark:text-emerald-400 font-extrabold text-xs uppercase tracking-widest bg-emerald-100 dark:bg-emerald-950/80 px-3 py-1 rounded-full border border-transparent dark:border-emerald-800">
            Our Guiding Creed
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight mt-3">
            Core Values That Anchor Shuhadae
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {coreValues.map((val, idx) => (
            <div key={idx} className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs hover:border-emerald-600 dark:hover:border-emerald-500 transition-colors">
              <span className="text-emerald-800 dark:text-emerald-400 font-serif font-bold text-xs block mb-1">
                {val.arabic}
              </span>
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white mb-2">
                {val.title}
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                {val.description}
              </p>
            </div>
          ))}

          {/* Bonus summary card */}
          <div className="bg-gradient-to-br from-emerald-900 to-slate-900 text-white p-6 rounded-3xl flex flex-col justify-between border-2 border-amber-400">
            <div>
              <span className="text-amber-400 font-mono font-bold text-xs uppercase">
                The Shuhadae Seal
              </span>
              <h3 className="text-base font-extrabold mt-1 mb-2">
                A Holistic Sanctuary for Learners
              </h3>
              <p className="text-xs text-emerald-100 leading-relaxed">
                Where parents rest assured that their child will graduate not only with a first-grade slip, but with manners and reverence for Allah.
              </p>
            </div>
            <button
              onClick={() => onNavigate('admissions')}
              className="mt-4 py-2 px-3 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold rounded-xl text-xs transition-colors self-start"
            >
              Apply for 2025/2026
            </button>
          </div>
        </div>
      </section>

      {/* SPIRITUAL AND MORAL ENVIRONMENT (DEEN & DAWAH) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 sm:p-12 border border-emerald-900/20 dark:border-slate-800 shadow-lg transition-colors">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-4">
              <span className="text-emerald-800 dark:text-emerald-300 font-extrabold text-xs uppercase tracking-widest bg-emerald-50 dark:bg-emerald-950/80 px-3 py-1 rounded-full border border-emerald-200 dark:border-emerald-800">
                Spiritual & Moral Environment
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
                Deen and Dawah Alongside World-Class Academics
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                At Shuhadae, Islamic values are not an extracurricular hobby; they are the bedrock of our campus culture. Every student is nurtured in an atmosphere that fosters piety, humility, and moral discipline.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs text-slate-700 dark:text-slate-300">
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                  <strong className="block text-slate-900 dark:text-white mb-1">5 Daily Congregational Prayers:</strong>
                  Fajr, Dhuhr, Asr, Maghrib, and Isha performed punctually in the school mosque under teacher supervision.
                </div>
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                  <strong className="block text-slate-900 dark:text-white mb-1">Tahfiz (Quran Memorization):</strong>
                  Dedicated afternoon circles for students striving to complete Juz' or full Holy Quran memorization with Tajweed.
                </div>
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                  <strong className="block text-slate-900 dark:text-white mb-1">Modest Dress Culture:</strong>
                  Strict adherence to Islamic attire, including the hijab and veil for female students and neat modest attire for boys.
                </div>
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                  <strong className="block text-slate-900 dark:text-white mb-1">100% Halal Nutrition:</strong>
                  All meals prepared under strict Halal certification, with nutritious posho, beans, meat, and fresh fruits.
                </div>
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="rounded-2xl overflow-hidden shadow-xl border-2 border-emerald-800/40">
                <img
                  src="https://images.unsplash.com/photo-1584281722572-c516bcfa1c91?auto=format&fit=crop&q=80&w=800"
                  alt="Students attending prayer and Islamic gathering"
                  className="w-full h-72 sm:h-80 object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* LEADERSHIP TEAM */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-emerald-700 dark:text-emerald-400 font-extrabold text-xs uppercase tracking-widest bg-emerald-100 dark:bg-emerald-950/80 px-3 py-1 rounded-full border border-transparent dark:border-emerald-800">
            Administration
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight mt-3">
            Dedicated School Leadership
          </h2>
          <p className="text-slate-600 dark:text-slate-300 text-xs sm:text-sm mt-1">
            Seasoned Ugandan educators and Islamic scholars steering Shuhadae toward higher heights.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {leadershipTeam.map((leader, idx) => (
            <div key={idx} className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs text-center flex flex-col justify-between transition-colors">
              <div>
                <div className="w-28 h-28 mx-auto rounded-2xl overflow-hidden border-2 border-emerald-600 shadow-md mb-4">
                  <img src={leader.image} alt={leader.name} className="w-full h-full object-cover" />
                </div>
                <h3 className="font-extrabold text-base text-slate-900 dark:text-white">{leader.name}</h3>
                <p className="text-xs font-bold text-emerald-700 dark:text-emerald-400 mt-0.5">{leader.role}</p>
                <p className="text-[11px] font-mono text-slate-500 dark:text-slate-400 mt-1">{leader.qualifications}</p>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mt-3">
                  {leader.bio}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
