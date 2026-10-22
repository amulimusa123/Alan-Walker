import React, { useState } from 'react';
import { PageType } from '../types';
import { SCHOOL_INFO } from '../data/schoolData';
import { 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  MessageSquare, 
  Send, 
  CheckCircle2, 
  Navigation, 
  Compass, 
  Building,
  ArrowRight
} from 'lucide-react';

interface ContactPageProps {
  onNavigate: (page: PageType) => void;
}

export const ContactPage: React.FC<ContactPageProps> = ({ onNavigate }) => {
  const [formSent, setFormSent] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    subject: 'Admissions Inquiry',
    message: '',
  });

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    setFormSent(true);
  };

  return (
    <div className="space-y-16 sm:space-y-20 pb-16">
      {/* Header Banner */}
      <section className="bg-gradient-to-r from-emerald-950 via-slate-900 to-emerald-900 text-white py-16 px-4 sm:px-6 relative overflow-hidden">
        <div className="max-w-7xl mx-auto relative z-10 text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <span className="text-amber-400 font-bold text-xs uppercase tracking-widest bg-emerald-900/80 px-3 py-1 rounded-full border border-emerald-700">
              Get in Touch with Administration
            </span>
            <h1 className="text-3xl sm:text-5xl font-black tracking-tight mt-3">
              Contact & Visit Shuhadae Islamic SS
            </h1>
            <p className="text-emerald-100/90 text-sm sm:text-base max-w-2xl mt-2">
              We welcome prospective parents, transferring students, alumni, and partners to our campus in Nyamitanga Division, Mbarara City.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 shrink-0">
            <a
              href={`tel:${SCHOOL_INFO.phonePrimary.replace(/\s+/g, '')}`}
              className="px-5 py-3 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow-md transition-colors"
            >
              <Phone className="w-4 h-4" />
              <span>Click to Call (0705 705 967)</span>
            </a>

            <a
              href="https://wa.me/256705705967?text=Assalamu%20Alaikum.%20I%20would%20like%20to%20inquire%20about%20visiting%20Shuhadae%20Islamic%20SS."
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow-md transition-colors"
            >
              <MessageSquare className="w-4 h-4" />
              <span>WhatsApp Chat</span>
            </a>
          </div>
        </div>
      </section>

      {/* CONTACT INFORMATION CARDS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Card 1: Physical Campus Address */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between transition-colors">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/60 flex items-center justify-center font-bold mb-4">
                <MapPin className="w-6 h-6 text-emerald-800 dark:text-emerald-400" />
              </div>
              <h3 className="font-extrabold text-sm text-slate-900 dark:text-white mb-1">Campus Location</h3>
              <p className="text-xs text-slate-700 dark:text-slate-300 font-medium">{SCHOOL_INFO.location}</p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">{SCHOOL_INFO.directionsHint}</p>
              <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-2">{SCHOOL_INFO.poBox}</p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-[11px] text-emerald-700 dark:text-emerald-400 font-bold flex items-center gap-1">
              <Navigation className="w-3.5 h-3.5" />
              <span>Western Uganda</span>
            </div>
          </div>

          {/* Card 2: Phone Numbers */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between transition-colors">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-amber-100 dark:bg-amber-950/80 text-amber-900 dark:text-amber-400 border border-amber-200 dark:border-amber-800/60 flex items-center justify-center font-bold mb-4">
                <Phone className="w-6 h-6 text-amber-800 dark:text-amber-400" />
              </div>
              <h3 className="font-extrabold text-sm text-slate-900 dark:text-white mb-1">Phone Numbers</h3>
              <div className="space-y-1.5 text-xs">
                <div>
                  <span className="text-slate-500 dark:text-slate-400 block text-[10px] uppercase font-bold">Admin & Bursar:</span>
                  <a href={`tel:${SCHOOL_INFO.phonePrimary.replace(/\s+/g, '')}`} className="font-mono font-bold text-slate-900 dark:text-emerald-300 hover:text-emerald-700 dark:hover:text-emerald-400">
                    {SCHOOL_INFO.phonePrimary}
                  </a>
                </div>
                <div>
                  <span className="text-slate-500 dark:text-slate-400 block text-[10px] uppercase font-bold">Alumni Relations:</span>
                  <p className="font-mono text-slate-700 dark:text-slate-300">
                    {SCHOOL_INFO.phoneAlumni1} / {SCHOOL_INFO.phoneAlumni2}
                  </p>
                </div>
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400">
              Direct Mobile / MTN lines
            </div>
          </div>

          {/* Card 3: Email & Digital */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between transition-colors">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-300 border border-slate-200 dark:border-slate-700 flex items-center justify-center font-bold mb-4">
                <Mail className="w-6 h-6 text-slate-800 dark:text-slate-300" />
              </div>
              <h3 className="font-extrabold text-sm text-slate-900 dark:text-white mb-1">Email & Portal</h3>
              <div className="space-y-1 text-xs">
                <p className="text-slate-500 dark:text-slate-400 text-[10px] uppercase font-bold">Official Inquiries:</p>
                <a href={`mailto:${SCHOOL_INFO.email}`} className="font-semibold text-emerald-800 dark:text-emerald-400 hover:underline break-all block">
                  {SCHOOL_INFO.email}
                </a>
                <p className="text-slate-500 dark:text-slate-400 text-[10px] uppercase font-bold pt-2">Examination Center:</p>
                <p className="font-mono text-slate-800 dark:text-slate-200 font-bold">UNEB {SCHOOL_INFO.unebCenterNumber}</p>
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400">
              Responses within 24 hours
            </div>
          </div>

          {/* Card 4: Operating Hours */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between transition-colors">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/60 flex items-center justify-center font-bold mb-4">
                <Clock className="w-6 h-6 text-emerald-700 dark:text-emerald-400" />
              </div>
              <h3 className="font-extrabold text-sm text-slate-900 dark:text-white mb-1">Office Hours</h3>
              <div className="space-y-1 text-xs text-slate-600 dark:text-slate-300">
                <p><strong className="text-slate-900 dark:text-white">Monday – Friday:</strong> 8:00 AM – 5:00 PM</p>
                <p><strong className="text-slate-900 dark:text-white">Saturday:</strong> 9:00 AM – 1:00 PM</p>
                <p><strong className="text-slate-900 dark:text-white">Sunday:</strong> Visitation by Appointment</p>
                <p className="text-[11px] text-emerald-700 dark:text-emerald-400 font-semibold pt-1">
                  Friday Juma'at Prayer: 1:00 PM – 2:00 PM
                </p>
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400">
              Admissions open weekdays
            </div>
          </div>
        </div>
      </section>

      {/* INTERACTIVE DIRECTIONS & EMBEDDED MAP GUIDE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden transition-colors">
          <div className="p-6 sm:p-8 bg-slate-50 dark:bg-slate-800/70 border-b border-slate-200 dark:border-slate-800">
            <span className="text-emerald-700 dark:text-emerald-400 font-bold text-xs uppercase tracking-wider">
              Travel Directions
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mt-1">
              How to Reach Our Nyamitanga Campus from Mbarara Town
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Simple landmark-by-landmark guide for visiting parents and public transport travelers.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
            {/* Step-by-step driving / boda directions */}
            <div className="lg:col-span-5 p-6 sm:p-8 space-y-4 border-b lg:border-b-0 lg:border-r border-slate-200 dark:border-slate-800 text-xs">
              <div className="flex items-start gap-3">
                <div className="w-7 h-7 rounded-full bg-emerald-800 dark:bg-emerald-700 text-amber-300 flex items-center justify-center font-black shrink-0">
                  1
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white text-sm">Depart Mbarara Town Center</h4>
                  <p className="text-slate-600 dark:text-slate-300 mt-0.5">
                    Start from Mbarara High Street / Independence Monument. Head south toward the River Rwizi bridge along Kabale / Isingiro road.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-7 h-7 rounded-full bg-emerald-800 dark:bg-emerald-700 text-amber-300 flex items-center justify-center font-black shrink-0">
                  2
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white text-sm">Cross River Rwizi Bridge</h4>
                  <p className="text-slate-600 dark:text-slate-300 mt-0.5">
                    Proceed 1 km past the bridge into Nyamitanga Division. At the junction, follow the Mbarara–Isingiro Highway.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-7 h-7 rounded-full bg-emerald-800 dark:bg-emerald-700 text-amber-300 flex items-center justify-center font-black shrink-0">
                  3
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white text-sm">Branch 2 km Off Highway</h4>
                  <p className="text-slate-600 dark:text-slate-300 mt-0.5">
                    Branch off onto the well-graded school feeder road signposted with <em>Shuhadae Islamic Secondary School</em> billboards, climbing gently toward the serene educational hill.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-7 h-7 rounded-full bg-emerald-800 dark:bg-emerald-700 text-amber-300 flex items-center justify-center font-black shrink-0">
                  4
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white text-sm">Arrive at Main Gate & Security Check</h4>
                  <p className="text-slate-600 dark:text-slate-300 mt-0.5">
                    Report to the main security gate. Visitor parking and the administration block reception are straight ahead.
                  </p>
                </div>
              </div>

              <div className="p-3 bg-amber-50 dark:bg-amber-950/40 rounded-xl border border-amber-200 dark:border-amber-800/60 text-amber-900 dark:text-amber-200 mt-4">
                <strong>Public Boda-Boda Hint:</strong> Tell any rider in Mbarara town: <em>"Shuhadae Islamic Secondary School, Nyamitanga"</em> (approx. UGX 2,000 – 3,000 from town center).
              </div>
            </div>

            {/* Simulated Clean Interactive Map View */}
            <div className="lg:col-span-7 bg-slate-900 dark:bg-slate-950 relative min-h-[380px] p-6 flex flex-col justify-between text-white border-t lg:border-t-0 border-slate-800">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span className="font-bold text-emerald-200">Interactive Location Cartography</span>
                </div>
                <span className="text-slate-400 font-mono text-[11px]">Lat: -0.6225° S, Lon: 30.6582° E</span>
              </div>

              {/* Graphical Schematic of Nyamitanga & Route */}
              <div className="my-auto py-6 text-center space-y-4">
                <div className="inline-block p-4 rounded-3xl bg-emerald-950/90 border-2 border-amber-400 shadow-2xl">
                  <Building className="w-10 h-10 text-amber-400 mx-auto mb-2" />
                  <h4 className="font-black text-base text-white">{SCHOOL_INFO.name}</h4>
                  <p className="text-xs text-emerald-300 font-medium">Nyamitanga Division, Mbarara City</p>
                  <p className="text-[11px] text-slate-400 mt-1">2 km off Mbarara–Isingiro Highway</p>
                </div>

                <div className="flex items-center justify-center gap-3 text-xs text-slate-300">
                  <span className="px-3 py-1 rounded-full bg-slate-800 border border-slate-700">
                    River Rwizi Bridge: 1.5 km
                  </span>
                  <span className="px-3 py-1 rounded-full bg-slate-800 border border-slate-700">
                    Mbarara Town Center: 3.5 km
                  </span>
                </div>
              </div>

              {/* External Navigation Link */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-800 text-xs">
                <span className="text-slate-400">Open in external GPS mapping application:</span>
                <a
                  href="https://maps.google.com/?q=Nyamitanga+Mbarara+Uganda"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-600 text-white font-bold rounded-lg text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <MapPin className="w-3.5 h-3.5" />
                  <span>Google Maps Directions</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CONTACT & CAMPUS VISIT FORM */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6">
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 sm:p-10 border border-slate-200 dark:border-slate-800 shadow-xl transition-colors">
          <div className="text-center max-w-lg mx-auto mb-6">
            <span className="text-emerald-700 dark:text-emerald-300 font-extrabold text-xs uppercase tracking-widest bg-emerald-100 dark:bg-emerald-950/80 px-3 py-1 rounded-full border border-transparent dark:border-emerald-800/60">
              Send an Inquiry
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight mt-2">
              Book a Visit or Request Prospectus
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Our admissions team will promptly reply with requirement documents or confirm your campus tour.
            </p>
          </div>

          {!formSent ? (
            <form onSubmit={handleSendMessage} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Your Full Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Enter your full name"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 focus:ring-2 focus:ring-emerald-600 dark:focus:ring-emerald-500 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs placeholder-slate-400 dark:placeholder-slate-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Phone Number (MTN / Airtel) *</label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="Enter your phone number"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 focus:ring-2 focus:ring-emerald-600 dark:focus:ring-emerald-500 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs placeholder-slate-400 dark:placeholder-slate-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Email Address</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="Enter your email address"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 focus:ring-2 focus:ring-emerald-600 dark:focus:ring-emerald-500 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs placeholder-slate-400 dark:placeholder-slate-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Inquiry Purpose *</label>
                  <select
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 focus:ring-2 focus:ring-emerald-600 dark:focus:ring-emerald-500 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-medium"
                  >
                    <option value="Senior 1 PLE Admission">Senior 1 PLE Admission</option>
                    <option value="Senior 5 UACE Combination">Senior 5 UACE Combination</option>
                    <option value="Director of Studies (DOS) - Academics & UNEB Exams">Director of Studies (DOS) - Academics & UNEB Exams</option>
                    <option value="Mid-term Transfer Request">Mid-term Transfer Request</option>
                    <option value="Book In-Person Campus Tour">Book In-Person Campus Tour</option>
                    <option value="Alumni Reconnection">Alumni Reconnection</option>
                    <option value="General Administration">General Administration</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Message / Student Details *</label>
                <textarea
                  required
                  rows={4}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Enter your message or questions here..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 focus:ring-2 focus:ring-emerald-600 dark:focus:ring-emerald-500 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs placeholder-slate-400 dark:placeholder-slate-500"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3.5 bg-emerald-700 hover:bg-emerald-800 dark:bg-emerald-600 dark:hover:bg-emerald-500 text-white font-black rounded-xl text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>Send Message to Admissions Desk</span>
                </button>
              </div>
            </form>
          ) : (
            <div className="p-6 bg-emerald-50 dark:bg-emerald-950/60 border-2 border-emerald-600 dark:border-emerald-500 rounded-2xl text-center space-y-3">
              <CheckCircle2 className="w-10 h-10 text-emerald-600 dark:text-emerald-400 mx-auto" />
              <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                Message Dispatched Successfully!
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 max-w-md mx-auto">
                Thank you for reaching out to Shuhadae Islamic Secondary School. Our admissions desk at Nyamitanga has received your inquiry and will contact you via {formData.phone || 'phone'} shortly.
              </p>
              <button
                onClick={() => setFormSent(false)}
                className="mt-2 px-4 py-2 bg-emerald-800 hover:bg-emerald-700 dark:bg-emerald-600 dark:hover:bg-emerald-500 text-white text-xs font-bold rounded-xl cursor-pointer"
              >
                Send Another Inquiry
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};
