import React, { useState } from 'react';
import { PageType, UserRole } from '../types';
import { CampusPhotoGallery } from '../components/CampusPhotoGallery';
import { 
  Sparkles, 
  Camera, 
  Users, 
  Trophy, 
  HeartHandshake, 
  BookOpen, 
  Calendar, 
  ArrowRight,
  ShieldCheck
} from 'lucide-react';

interface CampusLifePageProps {
  onNavigate: (page: PageType) => void;
  onOpenVisualizer: () => void;
  currentUser?: { name: string; role: UserRole } | null;
  onOpenLogin?: () => void;
}

export const CampusLifePage: React.FC<CampusLifePageProps> = ({
  onNavigate,
  onOpenVisualizer,
  currentUser,
  onOpenLogin,
}) => {
  const clubs = [
    {
      name: 'Debating & Public Speaking Society',
      description: 'Developing articulate, confident critical thinkers representing Shuhadae in national and regional inter-school debate tournaments.',
      icon: '🎙️'
    },
    {
      name: 'Science & Robotics Innovators Club',
      description: 'Hands-on practical experiments, science fairs, solar energy prototypes, and mathematics olympiads.',
      icon: '🔬'
    },
    {
      name: 'Tahfiz & Quran Recitation Circle',
      description: 'Daily Tajweed practice and Hifz circles under the mentorship of resident Islamic scholars and Sheikhs.',
      icon: '📖'
    },
    {
      name: 'Uganda Red Cross & First Aid Society',
      description: 'Equipping students with emergency first aid, hygiene awareness, and community health volunteerism in Mbarara.',
      icon: '🩺'
    },
    {
      name: 'Shuhadae Scout Troop',
      description: 'Instilling leadership, outdoor survival, endurance, discipline, and community development service.',
      icon: '🏕️'
    },
    {
      name: 'Environmental & Agro-Green Club',
      description: 'Managing the school banana and vegetable farm in Nyamitanga, teaching modern sustainable agricultural practices.',
      icon: '🌱'
    }
  ];

  return (
    <div className="space-y-16 sm:space-y-20 pb-16">
      {/* Header Banner */}
      <section className="bg-gradient-to-r from-emerald-950 via-slate-900 to-emerald-900 text-white py-16 px-4 sm:px-6 relative overflow-hidden">
        <div className="max-w-7xl mx-auto relative z-10 text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <span className="text-amber-400 font-bold text-xs uppercase tracking-widest bg-emerald-900/80 px-3 py-1 rounded-full border border-emerald-700">
              Vibrant Campus Life
            </span>
            <h1 className="text-3xl sm:text-5xl font-black tracking-tight mt-3">
              Holistic Student Experience in Nyamitanga
            </h1>
            <p className="text-emerald-100/90 text-sm sm:text-base max-w-2xl mt-2">
              Beyond books: modern dormitories, wholesome halal dining, spirited sports, and uplifting Islamic traditions.
            </p>
          </div>

          <button
            onClick={onOpenVisualizer}
            className="shrink-0 px-4 py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-2 shadow-md transition-all active:scale-95 cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-slate-950" />
            <span>AI Visual Studio (1K/2K/4K)</span>
          </button>
        </div>
      </section>

      {/* DYNAMIC CAMPUS PHOTO GALLERY */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <CampusPhotoGallery
          currentUser={currentUser}
          onOpenLogin={onOpenLogin}
        />
      </section>

      {/* ANNUAL HAFLA & SPEECH DAY SPOTLIGHT */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="bg-gradient-to-br from-emerald-900 via-slate-900 to-emerald-950 text-white rounded-3xl p-8 sm:p-12 border-2 border-amber-400 shadow-xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-4">
              <span className="text-amber-400 font-bold text-xs uppercase tracking-wider bg-emerald-950/80 px-3 py-1 rounded-full border border-emerald-700">
                School Tradition
              </span>
              <h2 className="text-2xl sm:text-4xl font-black">
                The Annual Hafla & Khatma Quran Graduation
              </h2>
              <p className="text-xs sm:text-sm text-emerald-100 leading-relaxed">
                The most anticipated event on the Shuhadae calendar, bringing together parents, regional Islamic leaders, Ministry of Education officials, and alumni. Students who successfully memorize portions of the Holy Quran are crowned alongside academic award winners in a day of solemn celebration and communal pride.
              </p>
              <div className="flex flex-wrap gap-4 text-xs font-semibold text-amber-300 pt-2">
                <span>✓ Academic Merit Trophies</span>
                <span>✓ Hifz Quran Recitation Showcases</span>
                <span>✓ Speeches by Eminent Scholars</span>
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="rounded-2xl overflow-hidden shadow-2xl border-4 border-amber-400/50">
                <img
                  src="https://images.unsplash.com/photo-1584281722572-c516bcfa1c91?auto=format&fit=crop&q=80&w=800"
                  alt="Annual Hafla Ceremony"
                  className="w-full h-64 object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CO-CURRICULAR CLUBS & SOCIETIES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-emerald-700 dark:text-emerald-400 font-extrabold text-xs uppercase tracking-widest bg-emerald-100 dark:bg-emerald-950/80 px-3 py-1 rounded-full border border-transparent dark:border-emerald-800">
            Co-Curriculars
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight mt-3">
            Active Clubs & Societies
          </h2>
          <p className="text-slate-600 dark:text-slate-300 text-xs sm:text-sm mt-1">
            Fostering communication, creative problem-solving, and civic responsibility outside the classroom.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {clubs.map((club, idx) => (
            <div
              key={idx}
              className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs hover:border-emerald-600 dark:hover:border-emerald-500 transition-colors"
            >
              <div className="text-3xl mb-3">{club.icon}</div>
              <h3 className="font-extrabold text-sm text-slate-900 dark:text-white mb-2">
                {club.name}
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                {club.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 text-center">
        <button
          onClick={() => onNavigate('contact')}
          className="px-6 py-3.5 bg-emerald-800 hover:bg-emerald-900 text-white font-bold rounded-2xl text-sm shadow-md transition-all inline-flex items-center gap-2"
        >
          <span>Schedule an In-Person Campus Tour in Nyamitanga</span>
          <ArrowRight className="w-4 h-4 text-amber-300" />
        </button>
      </section>
    </div>
  );
};
