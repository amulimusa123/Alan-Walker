import React, { useState } from 'react';
import { PageType } from '../types';
import { ALUMNI_PROFILES, SCHOOL_INFO } from '../data/schoolData';
import { 
  Users, 
  Award, 
  HeartHandshake, 
  Calendar, 
  Phone, 
  Send, 
  CheckCircle2, 
  Building, 
  BookOpen, 
  ArrowRight
} from 'lucide-react';

interface AlumniPageProps {
  onNavigate: (page: PageType) => void;
}

export const AlumniPage: React.FC<AlumniPageProps> = ({ onNavigate }) => {
  const [registered, setRegistered] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    completionYear: '',
    combination: '',
    profession: '',
    phone: '',
    email: '',
    currentLocation: '',
  });

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setRegistered(true);
  };

  return (
    <div className="space-y-16 sm:space-y-20 pb-16">
      {/* Header Banner */}
      <section className="bg-gradient-to-r from-emerald-950 via-slate-900 to-emerald-900 text-white py-16 px-4 sm:px-6 relative overflow-hidden">
        <div className="max-w-7xl mx-auto relative z-10 text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <span className="text-amber-400 font-bold text-xs uppercase tracking-widest bg-emerald-900/80 px-3 py-1 rounded-full border border-emerald-700">
              Shuhadae Islamic Alumni Association (SHIBA)
            </span>
            <h1 className="text-3xl sm:text-5xl font-black tracking-tight mt-3">
              Old Boys & Old Girls (OBs & OGs)
            </h1>
            <p className="text-emerald-100/90 text-sm sm:text-base max-w-2xl mt-2">
              Connecting generations of leaders, doctors, engineers, and scholars who walked the halls of Nyamitanga.
            </p>
          </div>

          <div className="shrink-0 p-4 rounded-2xl bg-emerald-900/80 border border-emerald-700 text-xs space-y-1 text-center sm:text-left">
            <span className="text-amber-300 font-bold block">Alumni Executive Contacts:</span>
            <p className="font-mono text-emerald-100">
              <a href={`tel:${SCHOOL_INFO.phoneAlumni1.replace(/\s+/g, '')}`} className="hover:underline">{SCHOOL_INFO.phoneAlumni1}</a> /{' '}
              <a href={`tel:${SCHOOL_INFO.phoneAlumni2.replace(/\s+/g, '')}`} className="hover:underline">{SCHOOL_INFO.phoneAlumni2}</a>
            </p>
          </div>
        </div>
      </section>

      {/* FEATURED ALUMNI SUCCESS STORIES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-emerald-700 dark:text-emerald-400 font-extrabold text-xs uppercase tracking-widest bg-emerald-100 dark:bg-emerald-950/80 px-3 py-1 rounded-full border border-transparent dark:border-emerald-800">
            Impact
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight mt-3">
            Spotlight on Notable OBs & OGs
          </h2>
          <p className="text-slate-600 dark:text-slate-300 text-xs sm:text-sm mt-1">
            Alumni flying the Shuhadae banner high across healthcare, engineering, legal practice, and academia.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {ALUMNI_PROFILES.map((alumnus) => (
            <div
              key={alumnus.id}
              className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-xs hover:border-emerald-600 dark:hover:border-emerald-500 hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 rounded-2xl overflow-hidden border-2 border-emerald-600 shadow-sm shrink-0">
                    <img
                      src={alumnus.avatar}
                      alt={alumnus.fullName}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="font-black text-base text-slate-900 dark:text-white">{alumnus.fullName}</h3>
                    <p className="text-xs font-bold text-emerald-800 dark:text-emerald-400">{alumnus.currentProfession}</p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">{alumnus.organization}</p>
                  </div>
                </div>

                <div className="mb-3">
                  <span className="text-[11px] bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-mono font-bold px-2.5 py-0.5 rounded border border-transparent dark:border-slate-700">
                    {alumnus.completionYear} • {alumnus.combinationOrStream}
                  </span>
                </div>

                <blockquote className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed italic border-l-2 border-amber-400 pl-3">
                  "{alumnus.quote}"
                </blockquote>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400">
                Location: {alumnus.location}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ONGOING ALUMNI DEVELOPMENT PROJECTS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="bg-slate-50 dark:bg-slate-900/60 rounded-3xl p-8 sm:p-12 border border-slate-200 dark:border-slate-800 transition-colors">
          <div className="max-w-2xl mb-8">
            <span className="text-emerald-700 dark:text-emerald-400 font-extrabold text-xs uppercase tracking-widest">
              Giving Back
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mt-1">
              Active School Development Projects
            </h2>
            <p className="text-slate-600 dark:text-slate-300 text-xs sm:text-sm mt-1">
              Joint initiatives organized by the Alumni Executive to empower current learners in Nyamitanga.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-3 transition-colors">
              <span className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 flex items-center justify-center font-bold border border-transparent dark:border-emerald-800">
                🕌
              </span>
              <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">
                School Mosque Expansion & Wudhu Plaza
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                Expanding the student prayer hall to comfortably accommodate 1,400 worshippers for Friday Juma'at and daily Tahfiz sessions with modern ablution amenities.
              </p>
              <div className="pt-2 text-xs font-mono font-bold text-emerald-800 dark:text-emerald-400">
                Target: UGX 45M • 68% Raised
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-3 transition-colors">
              <span className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-950/80 text-amber-900 dark:text-amber-300 flex items-center justify-center font-bold border border-transparent dark:border-amber-800">
                🔬
              </span>
              <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">
                Advanced Biology & Physics Lab Equipment
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                Procuring digital microscopes, spectrum analyzers, and modern spectrophotometers to keep Shuhadae sciences ahead of national competition.
              </p>
              <div className="pt-2 text-xs font-mono font-bold text-amber-800 dark:text-amber-400">
                Target: UGX 28M • 82% Raised
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-3 transition-colors">
              <span className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 flex items-center justify-center font-bold border border-transparent dark:border-slate-700">
                🤝
              </span>
              <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">
                Needy Orphans & Star Scholar Bursary Fund
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                Providing full tuition, boarding, and uniform packages for bright students from impoverished backgrounds across Western Uganda.
              </p>
              <div className="pt-2 text-xs font-mono font-bold text-slate-800 dark:text-slate-200">
                14 Students Sponsored Annually
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ALUMNI REGISTRATION & DIRECTORY FORM */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6">
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 sm:p-10 border border-slate-200 dark:border-slate-800 shadow-xl transition-colors">
          <div className="text-center max-w-lg mx-auto mb-6">
            <span className="text-emerald-700 dark:text-emerald-400 font-extrabold text-xs uppercase tracking-widest bg-emerald-100 dark:bg-emerald-950/80 px-3 py-1 rounded-full border border-transparent dark:border-emerald-800">
              Reconnect With Us
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight mt-2">
              Join the Shuhadae Alumni Directory
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Update your contacts to receive reunion invitations, career mentorship opportunities, and newsletter digests.
            </p>
          </div>

          {!registered ? (
            <form onSubmit={handleRegister} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Full Name (As at School) *</label>
                  <input
                    type="text"
                    required
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    placeholder="Enter full name as at school"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 focus:ring-2 focus:ring-emerald-600 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 text-xs"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Year of Completion *</label>
                  <input
                    type="text"
                    required
                    value={formData.completionYear}
                    onChange={(e) => setFormData({ ...formData, completionYear: e.target.value })}
                    placeholder="Enter completion year (e.g. S.4 or S.6)"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 focus:ring-2 focus:ring-emerald-600 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Stream / A-Level Combination</label>
                  <input
                    type="text"
                    value={formData.combination}
                    onChange={(e) => setFormData({ ...formData, combination: e.target.value })}
                    placeholder="Enter combination or stream"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 focus:ring-2 focus:ring-emerald-600 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 text-xs"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Current Profession / Business *</label>
                  <input
                    type="text"
                    required
                    value={formData.profession}
                    onChange={(e) => setFormData({ ...formData, profession: e.target.value })}
                    placeholder="Enter current profession or occupation"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 focus:ring-2 focus:ring-emerald-600 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">WhatsApp Phone Number *</label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="Enter phone or WhatsApp number"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 focus:ring-2 focus:ring-emerald-600 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 text-xs font-mono"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Current Residence / City</label>
                  <input
                    type="text"
                    value={formData.currentLocation}
                    onChange={(e) => setFormData({ ...formData, currentLocation: e.target.value })}
                    placeholder="Enter current city or location"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 focus:ring-2 focus:ring-emerald-600 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 text-xs"
                  />
                </div>
              </div>

              <div className="pt-3">
                <button
                  type="submit"
                  className="w-full py-3.5 bg-emerald-700 hover:bg-emerald-800 text-white font-black rounded-xl text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>Register into Alumni Database</span>
                </button>
              </div>
            </form>
          ) : (
            <div className="p-6 bg-emerald-50 dark:bg-emerald-950/70 border-2 border-emerald-600 rounded-2xl text-center space-y-3 transition-colors">
              <CheckCircle2 className="w-10 h-10 text-emerald-600 dark:text-emerald-400 mx-auto" />
              <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                Welcome Back, Old Boy / Old Girl!
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 max-w-md mx-auto">
                Your profile has been recorded in the official Shuhadae Islamic Alumni Directory. You will be added to the official regional chapter WhatsApp forum and receive invitations to the upcoming Grand Reunion.
              </p>
              <div className="pt-2 text-xs font-mono font-bold text-emerald-800 dark:text-emerald-300">
                Alumni Executive Lines: {SCHOOL_INFO.phoneAlumni1} / {SCHOOL_INFO.phoneAlumni2}
              </div>
              <button
                onClick={() => setRegistered(false)}
                className="mt-3 px-4 py-2 bg-emerald-800 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl cursor-pointer transition-colors"
              >
                Register Another Alumnus
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};
