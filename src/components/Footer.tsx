import React from 'react';
import { PageType } from '../types';
import { SCHOOL_INFO } from '../data/schoolData';
import { 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  MessageSquare, 
  ShieldCheck, 
  Award, 
  ArrowRight,
  Heart
} from 'lucide-react';

interface FooterProps {
  onNavigate: (page: PageType) => void;
  onOpenPortal: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, onOpenPortal }) => {
  return (
    <footer className="bg-slate-950 text-slate-300 pt-16 pb-12 border-t-4 border-emerald-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-slate-800">
          {/* Column 1: School Identity */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-emerald-600 to-emerald-900 border border-amber-400/50 flex items-center justify-center text-amber-300 font-serif font-black text-xl shadow-inner">
                S
              </div>
              <div>
                <h3 className="text-white font-extrabold text-base tracking-tight">
                  Shuhadae Islamic
                </h3>
                <p className="text-emerald-400 text-xs font-semibold">Secondary School, Mbarara</p>
              </div>
            </div>

            <p className="text-slate-400 text-xs leading-relaxed">
              A premier co-educational Islamic and secular secondary institution in Western Uganda, empowering students with academic rigor, noble moral discipline, and profound spiritual grounding.
            </p>

            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs space-y-1">
              <div className="flex items-center justify-between text-slate-400">
                <span>UNEB Center No:</span>
                <span className="text-amber-400 font-mono font-bold">{SCHOOL_INFO.unebCenterNumber}</span>
              </div>
              <div className="flex items-center justify-between text-slate-400">
                <span>Ministry Reg No:</span>
                <span className="text-emerald-400 font-mono font-medium">{SCHOOL_INFO.ministryRegNumber}</span>
              </div>
              <div className="flex items-center justify-between text-slate-400">
                <span>Classification:</span>
                <span className="text-white font-medium">O & A-Level Day & Boarding</span>
              </div>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="space-y-4">
            <h4 className="text-white font-bold text-sm uppercase tracking-wider flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-400"></span>
              <span>Quick Navigation</span>
            </h4>
            <ul className="space-y-2 text-xs">
              {[
                { label: 'Home Page', page: 'home' as PageType },
                { label: 'About School & History', page: 'about' as PageType },
                { label: 'Academic Calendar & Term Dates', page: 'academics' as PageType },
                { label: 'Curriculum & Combinations', page: 'academics' as PageType },
                { label: 'Admissions & Term Fees', page: 'admissions' as PageType },
                { label: 'Campus Life & Halal Hostels', page: 'campus-life' as PageType },
                { label: 'Old Boys & Girls Network', page: 'alumni' as PageType },
                { label: 'Directions & Contact Details', page: 'contact' as PageType },
              ].map((item) => (
                <li key={item.label}>
                  <button
                    onClick={() => {
                      onNavigate(item.page);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="hover:text-amber-300 transition-colors flex items-center gap-1.5 group text-left"
                  >
                    <ArrowRight className="w-3 h-3 text-slate-600 group-hover:text-amber-400 transition-transform group-hover:translate-x-1" />
                    <span>{item.label}</span>
                  </button>
                </li>
              ))}
              <li>
                <button
                  onClick={onOpenPortal}
                  className="text-amber-400 hover:text-amber-300 font-bold transition-colors flex items-center gap-1.5"
                >
                  <ArrowRight className="w-3 h-3 text-amber-400" />
                  <span>Student & Parent Portal</span>
                </button>
              </li>

            </ul>
          </div>

          {/* Column 3: Contact & Location */}
          <div className="space-y-4">
            <h4 className="text-white font-bold text-sm uppercase tracking-wider flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              <span>Location & Contacts</span>
            </h4>
            <div className="space-y-3 text-xs text-slate-400">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                <div>
                  <p className="text-white font-medium">Nyamitanga Division, Mbarara City</p>
                  <p className="text-slate-400 text-[11px] mt-0.5">2 km off Mbarara–Isingiro Highway</p>
                  <p className="text-slate-500 text-[11px]">{SCHOOL_INFO.poBox}</p>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <Phone className="w-4 h-4 text-amber-400 mt-0.5 shrink-0" />
                <div>
                  <p className="text-slate-300 font-semibold">
                    Admin: <a href={`tel:${SCHOOL_INFO.phonePrimary.replace(/\s+/g, '')}`} className="hover:text-amber-300 underline">{SCHOOL_INFO.phonePrimary}</a>
                  </p>
                  <p className="text-slate-400 text-[11px]">
                    Alumni Lines: {SCHOOL_INFO.phoneAlumni1} / {SCHOOL_INFO.phoneAlumni2}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-emerald-400 shrink-0" />
                <a href={`mailto:${SCHOOL_INFO.email}`} className="text-slate-300 hover:text-amber-300 text-xs">
                  {SCHOOL_INFO.email}
                </a>
              </div>

              <div className="flex items-center gap-2.5">
                <Clock className="w-4 h-4 text-slate-500 shrink-0" />
                <span>Mon – Fri: 8:00 AM – 5:00 PM | Sat: 9:00 AM – 1:00 PM</span>
              </div>
            </div>
          </div>

          {/* Column 4: WhatsApp & Community */}
          <div className="space-y-4">
            <h4 className="text-white font-bold text-sm uppercase tracking-wider flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span>Quick Admissions Desk</span>
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Need immediate admission assistance for S.1, S.5, or mid-term transfers? Chat directly with the admissions officer.
            </p>

            <a
              href="https://wa.me/256705705967?text=Assalamu%20Alaikum.%20I%20would%20like%20to%20inquire%20about%20admission%20requirements%20and%20fees%20at%20Shuhadae%20Islamic%20SS."
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs transition-colors shadow-md"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Direct WhatsApp Chat (0705 705 967)</span>
            </a>

            <div className="pt-2">
              <div className="flex items-center gap-2 text-xs text-emerald-300 bg-emerald-950/60 p-2.5 rounded-lg border border-emerald-800/50">
                <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0" />
                <span>UNEB Recognized • Islamic Council of Uganda Registered</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Credits */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <div>
            © {new Date().getFullYear()} {SCHOOL_INFO.name}. All rights reserved.
          </div>
          <div className="flex items-center gap-4 text-[11px]">
            <span>Nyamitanga, Mbarara City, Uganda</span>
            <span>•</span>
            <span className="font-serif italic text-emerald-400">"Knowledge, Faith and Integrity"</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
