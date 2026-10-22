import React, { useState } from 'react';
import { PageType } from '../types';
import { SUBJECT_COMBINATIONS, SCHOOL_INFO } from '../data/schoolData';
import { 
  GraduationCap, 
  BookOpen, 
  Award, 
  FlaskConical, 
  Laptop, 
  Library, 
  CheckCircle2, 
  ArrowRight,
  TrendingUp,
  FileText
} from 'lucide-react';
import { ExamCountdownTimer } from '../components/ExamCountdownTimer';
import { AcademicCalendar } from '../components/AcademicCalendar';

interface AcademicsPageProps {
  onNavigate: (page: PageType) => void;
}

export const AcademicsPage: React.FC<AcademicsPageProps> = ({ onNavigate }) => {
  const [selectedCategory, setSelectedCategory] = useState<'All' | 'Sciences' | 'Arts' | 'Economics & Vocational'>('All');

  const filteredCombinations = selectedCategory === 'All'
    ? SUBJECT_COMBINATIONS
    : SUBJECT_COMBINATIONS.filter(c => c.category === selectedCategory);

  return (
    <div className="space-y-16 sm:space-y-20 pb-16">
      {/* Header Banner */}
      <section className="bg-gradient-to-r from-emerald-950 via-slate-900 to-emerald-900 text-white py-16 px-4 sm:px-6 relative overflow-hidden">
        <div className="max-w-7xl mx-auto relative z-10 text-center sm:text-left">
          <span className="text-amber-400 font-bold text-xs uppercase tracking-widest bg-emerald-900/80 px-3 py-1 rounded-full border border-emerald-700">
            Academics & Examination Standards
          </span>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight mt-3">
            Excellence Across Lower & Upper Secondary
          </h1>
          <p className="text-emerald-100/90 text-sm sm:text-base max-w-2xl mt-2">
            Equipping learners with rigorous competencies, hands-on scientific mastery, and stellar UNEB national examination results.
          </p>
        </div>
      </section>

      {/* LOWER SECONDARY (NLSC) SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 sm:p-12 border border-slate-200 dark:border-slate-800 shadow-sm transition-colors">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-4">
              <span className="text-emerald-800 dark:text-emerald-300 font-bold text-xs uppercase bg-emerald-100 dark:bg-emerald-950/80 px-3 py-1 rounded-md border border-transparent dark:border-emerald-800">
                Senior 1 to Senior 4 (O-Level)
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
                The New Lower Secondary Curriculum (NLSC)
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                Shuhadae has been a regional pioneer in adopting Uganda's competence-based lower secondary curriculum. We transition students from rote memorization into real-world application, critical thinking, and collaborative project assessment.
              </p>

              <div className="space-y-2.5 text-xs text-slate-700 dark:text-slate-300 pt-2">
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 mt-0.5 shrink-0" />
                  <div>
                    <strong className="text-slate-900 dark:text-white block">Continuous Assessment (20% - 30% UNEB Score):</strong>
                    Learner activities of integration, project portfolios, and terminal scores systematically tracked on the UNEB portal.
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 mt-0.5 shrink-0" />
                  <div>
                    <strong className="text-slate-900 dark:text-white block">DIT Vocational Certification:</strong>
                    Alongside UNEB UCE, learners earn vocational qualifications from the Directorate of Industrial Training in ICT, Tailoring, and Modern Agriculture.
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 mt-0.5 shrink-0" />
                  <div>
                    <strong className="text-slate-900 dark:text-white block">Core O-Level Subjects:</strong>
                    English, Mathematics, Physics, Chemistry, Biology, Geography, History & Political Education, Islamic Religious Education (IRE), Arabic Language, ICT, and Physical Education.
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="rounded-2xl overflow-hidden shadow-lg border-2 border-emerald-700/30">
                <img
                  src="https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&q=80&w=800"
                  alt="Students engaged in collaborative group work"
                  className="w-full h-80 object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* UPPER SECONDARY (UACE COMBINATIONS) SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-3xl mx-auto mb-10">
          <span className="text-emerald-700 dark:text-emerald-400 font-extrabold text-xs uppercase tracking-widest bg-emerald-100 dark:bg-emerald-950/80 px-3 py-1 rounded-full border border-transparent dark:border-emerald-800">
            Senior 5 & Senior 6 (A-Level)
          </span>
          <h2 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight mt-3">
            UACE Subject Combinations (Arts & Sciences)
          </h2>
          <p className="text-slate-600 dark:text-slate-300 text-xs sm:text-sm mt-2">
            Tailored 3-principal combinations with General Paper and Subsidiary Mathematics or Subsidiary ICT, leading directly into premier university faculties.
          </p>

          {/* Category Filter Tabs */}
          <div className="flex items-center justify-center gap-2 mt-6 flex-wrap">
            {(['All', 'Sciences', 'Arts', 'Economics & Vocational'] as const).map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-emerald-800 dark:bg-emerald-700 text-white shadow-md'
                    : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Combinations Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredCombinations.map((combo) => (
            <div
              key={combo.code}
              className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs hover:border-emerald-600 dark:hover:border-emerald-500 hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="font-mono text-xs font-black bg-emerald-100 dark:bg-emerald-950/80 text-emerald-900 dark:text-emerald-300 px-2.5 py-1 rounded-lg border border-transparent dark:border-emerald-800">
                    {combo.code}
                  </span>
                  <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase">
                    {combo.category}
                  </span>
                </div>

                <h3 className="font-extrabold text-sm text-slate-900 dark:text-white mb-2">
                  {combo.name}
                </h3>

                <div className="space-y-2 text-xs text-slate-600 dark:text-slate-300">
                  <div>
                    <span className="font-bold text-slate-700 dark:text-slate-200 block text-[11px]">Principals:</span>
                    <span>{combo.subjects.join(', ')}</span>
                  </div>

                  <div>
                    <span className="font-bold text-slate-700 dark:text-slate-200 block text-[11px]">Subsidiaries:</span>
                    <span className="text-slate-500 dark:text-slate-400">{combo.subsidiaries.join(' + ')}</span>
                  </div>

                  <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                    <span className="font-bold text-emerald-800 dark:text-emerald-400 block text-[11px]">Target Careers:</span>
                    <ul className="list-disc list-inside text-[11px] text-slate-600 dark:text-slate-300 space-y-0.5">
                      {combo.careerPaths.slice(0, 3).map((cp, idx) => (
                        <li key={idx}>{cp}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px]">
                <span className="text-slate-500 dark:text-slate-400 font-medium">Cut-off:</span>
                <span className="font-bold text-slate-800 dark:text-slate-100 font-mono">{combo.cutoff}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* INTERACTIVE ACADEMIC CALENDAR & TERM DATES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <AcademicCalendar />
      </section>

      {/* UPCOMING O-LEVEL & A-LEVEL MOCK EXAMS COUNTDOWN */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <ExamCountdownTimer />
      </section>

      {/* NATIONAL EXAMINATION ACHIEVEMENTS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="bg-gradient-to-br from-slate-900 via-emerald-950 to-slate-950 text-white rounded-3xl p-8 sm:p-12 border-2 border-amber-400 shadow-xl">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-amber-400 font-mono font-bold text-xs uppercase tracking-wider">
              Proven Track Record
            </span>
            <h2 className="text-2xl sm:text-4xl font-black mt-2">
              UNEB UCE & UACE Distinction Highlights
            </h2>
            <p className="text-xs sm:text-sm text-emerald-200 mt-2">
              Ranked among top performing secondary schools in Mbarara District with consistently stellar university placement.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div className="p-6 rounded-2xl bg-slate-900/80 border border-emerald-700/60">
              <TrendingUp className="w-8 h-8 text-amber-400 mx-auto mb-2" />
              <div className="text-3xl font-black text-amber-300">98.4%</div>
              <h3 className="font-extrabold text-sm mt-1">Division 1 & 2 in UCE</h3>
              <p className="text-[11px] text-slate-300 mt-1">
                Zero Division 4 or 9 candidates in the last 5 consecutive exam cycles.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900/80 border border-emerald-700/60">
              <Award className="w-8 h-8 text-amber-400 mx-auto mb-2" />
              <div className="text-3xl font-black text-amber-300">18 - 20 Pts</div>
              <h3 className="font-extrabold text-sm mt-1">Star UACE Results</h3>
              <p className="text-[11px] text-slate-300 mt-1">
                Multiple students scoring straight distinctions (AAA) in BCM, PCB, and HEG combinations.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900/80 border border-emerald-700/60">
              <GraduationCap className="w-8 h-8 text-amber-400 mx-auto mb-2" />
              <div className="text-3xl font-black text-amber-300">96%</div>
              <h3 className="font-extrabold text-sm mt-1">University Intake</h3>
              <p className="text-[11px] text-slate-300 mt-1">
                Direct government and private sponsorship into MUST, Makerere, Kyambogo, and IUIU.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* LEARNING FACILITIES: LABS, ICT & LIBRARY */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-emerald-700 dark:text-emerald-400 font-extrabold text-xs uppercase tracking-widest bg-emerald-100 dark:bg-emerald-950/80 px-3 py-1 rounded-full border border-transparent dark:border-emerald-800">
            Infrastructure
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight mt-3">
            First-Class Academic Facilities
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4 transition-colors">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 flex items-center justify-center font-bold border border-transparent dark:border-emerald-800">
              <FlaskConical className="w-6 h-6 text-emerald-800 dark:text-emerald-400" />
            </div>
            <h3 className="font-extrabold text-base text-slate-900 dark:text-white">3 Science Laboratories</h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Dedicated, fully stocked laboratories for Physics, Chemistry, and Biology featuring piped gas manifolds, optical compound microscopes, precision balances, and chemical stores meeting UNEB practical inspection standards.
            </p>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4 transition-colors">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 flex items-center justify-center font-bold border border-transparent dark:border-emerald-800">
              <Laptop className="w-6 h-6 text-emerald-800 dark:text-emerald-400" />
            </div>
            <h3 className="font-extrabold text-base text-slate-900 dark:text-white">Modern ICT & Computer Lab</h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              60 networked workstations connected to high-speed broadband, providing hands-on coding, digital literacy, Sub-ICT examinations, and e-research for both O-Level and A-Level classes.
            </p>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4 transition-colors">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 flex items-center justify-center font-bold border border-transparent dark:border-emerald-800">
              <Library className="w-6 h-6 text-emerald-800 dark:text-emerald-400" />
            </div>
            <h3 className="font-extrabold text-base text-slate-900 dark:text-white">Stocked Academic Library</h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              A quiet, conducive reading sanctuary stocked with curriculum textbooks, past UNEB exam papers, international scientific journals, and authentic Islamic reference books and Tafsir.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 text-center">
        <button
          onClick={() => onNavigate('admissions')}
          className="px-6 py-3.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-2xl text-sm shadow-md transition-all inline-flex items-center gap-2 active:scale-95"
        >
          <span>Enroll into Shuhadae Academic Programs</span>
          <ArrowRight className="w-4 h-4 text-amber-300" />
        </button>
      </section>
    </div>
  );
};
