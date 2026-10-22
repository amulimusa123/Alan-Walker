import React, { useState, useEffect } from 'react';
import { PageType } from '../types';
import { FEE_STRUCTURE, ONE_OFF_REQUIREMENTS, PAYMENT_METHODS, SCHOOL_INFO } from '../data/schoolData';
import { 
  FileText, 
  CheckCircle2, 
  Download, 
  CreditCard, 
  Send, 
  Printer, 
  ArrowRight,
  ShieldCheck,
  Building,
  User,
  Phone,
  Mail,
  Calendar,
  AlertCircle,
  Database,
  History
} from 'lucide-react';
import { 
  saveOfflineAdmission, 
  getStoredAdmissions, 
  OfflineAdmissionApplication 
} from '../services/offlineStorage';

interface AdmissionsPageProps {
  onNavigate: (page: PageType) => void;
}

export const AdmissionsPage: React.FC<AdmissionsPageProps> = ({ onNavigate }) => {
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [activeSlip, setActiveSlip] = useState<OfflineAdmissionApplication | null>(null);
  const [storedApplications, setStoredApplications] = useState<OfflineAdmissionApplication[]>([]);
  const [showHistory, setShowHistory] = useState(false);

  const [formData, setFormData] = useState({
    studentName: '',
    gender: 'Male',
    applyingFor: 'Senior One (S.1)',
    section: 'Boarding',
    pleOrUceScore: '',
    previousSchool: '',
    guardianName: '',
    guardianPhone: '',
    guardianEmail: '',
    preferredCombination: '',
  });

  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    setStoredApplications(getStoredAdmissions());
  }, [formSubmitted]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    if (!formData.studentName.trim() || !formData.guardianPhone.trim()) {
      setFormError('Please provide both the student full name and guardian contact phone number.');
      return;
    }

    // Save into persistent local storage engine
    const saved = saveOfflineAdmission({
      studentName: formData.studentName.trim(),
      gender: formData.gender,
      applyingFor: formData.applyingFor,
      section: formData.section,
      pleOrUceScore: formData.pleOrUceScore.trim(),
      previousSchool: formData.previousSchool.trim(),
      guardianName: formData.guardianName.trim(),
      guardianPhone: formData.guardianPhone.trim(),
      guardianEmail: formData.guardianEmail.trim(),
      preferredCombination: formData.preferredCombination.trim(),
    });

    setActiveSlip(saved);
    setFormSubmitted(true);
    setStoredApplications(getStoredAdmissions());
  };

  const handlePrintSlip = () => {
    window.print();
  };

  return (
    <div className="space-y-16 sm:space-y-20 pb-16">
      {/* Header Banner */}
      <section className="bg-gradient-to-r from-emerald-950 via-slate-900 to-emerald-900 text-white py-16 px-4 sm:px-6 relative overflow-hidden">
        <div className="max-w-7xl mx-auto relative z-10 text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <span className="text-amber-400 font-bold text-xs uppercase tracking-widest bg-emerald-900/80 px-3 py-1 rounded-full border border-emerald-700">
              Admissions Desk • Academic Year 2025/2026
            </span>
            <h1 className="text-3xl sm:text-5xl font-black tracking-tight mt-3">
              Join Our Community of Distinction
            </h1>
            <p className="text-emerald-100/90 text-sm sm:text-base max-w-2xl mt-2">
              Transparent requirements, competitive fees in Ugandan Shillings (UGX), and immediate offline application processing for S.1, S.5, and transfer learners.
            </p>
          </div>

          <a
            href={`tel:${SCHOOL_INFO.phonePrimary.replace(/\s+/g, '')}`}
            className="shrink-0 px-5 py-3 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-2 shadow-md transition-colors"
          >
            <Phone className="w-4 h-4" />
            <span>Admissions Helpline: {SCHOOL_INFO.phonePrimary}</span>
          </a>
        </div>
      </section>

      {/* STEP-BY-STEP ADMISSION REQUIREMENTS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-emerald-700 dark:text-emerald-400 font-extrabold text-xs uppercase tracking-widest bg-emerald-100 dark:bg-emerald-950/80 px-3 py-1 rounded-full border border-transparent dark:border-emerald-800">
            Enrollment Criteria
          </span>
          <h2 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight mt-3">
            Step-by-Step Admission Requirements
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Senior 1 */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-7 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4 transition-colors">
            <span className="text-xs font-bold text-emerald-800 dark:text-emerald-300 uppercase bg-emerald-100 dark:bg-emerald-950/80 px-2.5 py-1 rounded-md border border-transparent dark:border-emerald-800">
              Senior One (S.1) Entry
            </span>
            <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
              PLE Leavers Admission
            </h3>
            <ul className="text-xs text-slate-600 dark:text-slate-300 space-y-2">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                <span>PLE Result Slip or verified pass slip with <strong>Aggregates 4 to 16</strong>.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                <span>Original Primary Leaving Certificate or testimonial from primary school.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                <span>Letter of recommendation from primary headteacher or local Imam / LC1.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                <span>2 recent passport-size photos and photocopy of birth certificate.</span>
              </li>
            </ul>
          </div>

          {/* Senior 5 */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-7 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4 transition-colors">
            <span className="text-xs font-bold text-amber-900 dark:text-amber-300 uppercase bg-amber-100 dark:bg-amber-950/80 px-2.5 py-1 rounded-md border border-transparent dark:border-amber-800">
              Senior Five (S.5) Entry
            </span>
            <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
              UCE Leavers Admission
            </h3>
            <ul className="text-xs text-slate-600 dark:text-slate-300 space-y-2">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                <span>UCE Result Slip with <strong>Division 1 or Division 2</strong>.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                <span>Credits in subjects relevant to preferred combination (e.g., Credits in Biology & Chemistry for BCM).</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                <span>Valid O-Level Leaving Certificate and conduct testimonial.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                <span>2 passport-size photographs and identification copies.</span>
              </li>
            </ul>
          </div>

          {/* Transfer */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-7 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4 transition-colors">
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-md border border-transparent dark:border-slate-700">
              S.2, S.3 & S.6 Transfers
            </span>
            <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
              Mid-Level Transfer Students
            </h3>
            <ul className="text-xs text-slate-600 dark:text-slate-300 space-y-2">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-slate-600 dark:text-slate-400 shrink-0 mt-0.5" />
                <span>Original report cards from the previous two academic terms.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-slate-600 dark:text-slate-400 shrink-0 mt-0.5" />
                <span>Official clearance and transfer letter from former school headteacher.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-slate-600 dark:text-slate-400 shrink-0 mt-0.5" />
                <span>UNEB New Lower Secondary Curriculum continuous assessment learner portfolio.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-slate-600 dark:text-slate-400 shrink-0 mt-0.5" />
                <span>Personal interview with the student and parent/guardian at school campus.</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* COMPREHENSIVE FEE STRUCTURE TABLE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden transition-colors">
          <div className="p-6 sm:p-8 bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-emerald-700 dark:text-emerald-400 font-bold text-xs uppercase tracking-wider">
                Official Tuition & Boarding Fees
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mt-1">
                Termly Fee Structure (UGX)
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Approved by the Board of Governors • No hidden mid-term charges
              </p>
            </div>

            <button
              onClick={() => window.print()}
              className="self-start sm:self-auto px-4 py-2 bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 dark:hover:bg-slate-700 text-white font-bold rounded-xl text-xs flex items-center gap-2 transition-colors cursor-pointer border border-transparent dark:border-slate-700"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Fee Structure</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-emerald-900 dark:bg-emerald-950 text-white uppercase font-bold tracking-wider">
                <tr>
                  <th className="py-4 px-6">Fee Item Description</th>
                  <th className="py-4 px-4">S.1 – S.4 (Day)</th>
                  <th className="py-4 px-4">S.1 – S.4 (Boarding)</th>
                  <th className="py-4 px-4">S.5 – S.6 (Day)</th>
                  <th className="py-4 px-4">S.5 – S.6 (Boarding)</th>
                  <th className="py-4 px-4">Frequency</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                {FEE_STRUCTURE.map((item, idx) => {
                  const isTotal = idx === FEE_STRUCTURE.length - 1;
                  return (
                    <tr
                      key={idx}
                      className={
                        isTotal
                          ? 'bg-emerald-50/80 dark:bg-emerald-950/60 font-black text-emerald-950 dark:text-emerald-200 text-sm'
                          : 'hover:bg-slate-50 dark:hover:bg-slate-800/50 text-slate-700 dark:text-slate-300 font-medium'
                      }
                    >
                      <td className="py-3.5 px-6 font-bold text-slate-900 dark:text-white">{item.item}</td>
                      <td className="py-3.5 px-4 font-mono text-slate-700 dark:text-slate-300">
                        {item.s1_s4_day > 0 ? `UGX ${item.s1_s4_day.toLocaleString()}` : '—'}
                      </td>
                      <td className="py-3.5 px-4 font-mono font-bold text-emerald-900 dark:text-emerald-400">
                        UGX {item.s1_s4_boarding.toLocaleString()}
                      </td>
                      <td className="py-3.5 px-4 font-mono text-slate-700 dark:text-slate-300">
                        {item.s5_s6_day > 0 ? `UGX ${item.s5_s6_day.toLocaleString()}` : '—'}
                      </td>
                      <td className="py-3.5 px-4 font-mono font-bold text-emerald-900 dark:text-emerald-400">
                        UGX {item.s5_s6_boarding.toLocaleString()}
                      </td>
                      <td className="py-3.5 px-4 text-slate-500 dark:text-slate-400 text-[11px] font-sans">
                        {item.frequency}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* One-off Requirements */}
        <div className="mt-8 bg-slate-50 dark:bg-slate-900/60 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 transition-colors">
          <h3 className="font-extrabold text-slate-900 dark:text-white text-sm uppercase tracking-wide mb-3">
            One-Off Admission Packages & Requirements
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
            {ONE_OFF_REQUIREMENTS.map((req, i) => (
              <div key={i} className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex justify-between items-center transition-colors">
                <div>
                  <p className="font-bold text-slate-800 dark:text-slate-200">{req.item}</p>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400">{req.when}</span>
                </div>
                <span className="font-mono font-extrabold text-emerald-800 dark:text-emerald-400 shrink-0 ml-2">
                  {req.cost}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Banking and SchoolPay Details */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          {PAYMENT_METHODS.map((method, idx) => (
            <div key={idx} className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between transition-colors">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Building className="w-4 h-4 text-emerald-700 dark:text-emerald-400" />
                  <h4 className="font-bold text-xs text-slate-900 dark:text-white">{method.name}</h4>
                </div>
                <p className="font-mono text-sm font-black text-emerald-800 dark:text-emerald-400 mb-1">
                  {method.accountNumber || method.code}
                </p>
                <p className="text-xs text-slate-600 dark:text-slate-300 mb-2">{method.accountName}</p>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 border-t border-slate-100 dark:border-slate-800 pt-2 italic">
                {method.instructions}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ONLINE APPLICATION / INQUIRY FORM (OFFLINE STORAGE READY) */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 sm:p-10 border border-slate-200 dark:border-slate-800 shadow-xl transition-colors">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8 pb-4 border-b border-slate-100 dark:border-slate-800">
            <div>
              <span className="text-emerald-700 dark:text-emerald-400 font-extrabold text-xs uppercase tracking-widest bg-emerald-100 dark:bg-emerald-950/80 px-3 py-1 rounded-full border border-transparent dark:border-emerald-800">
                Direct Application Portal (Offline Supported)
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight mt-2">
                Online Student Admission Form
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Submissions are securely stored in your browser's offline storage and immediately generate a printable slip.
              </p>
            </div>

            {storedApplications.length > 0 && (
              <button
                onClick={() => setShowHistory(!showHistory)}
                className="shrink-0 px-3 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-colors"
              >
                <History className="w-3.5 h-3.5 text-emerald-700 dark:text-emerald-400" />
                <span>Saved Slips ({storedApplications.length})</span>
              </button>
            )}
          </div>

          {/* Stored Applications Drawer */}
          {showHistory && storedApplications.length > 0 && (
            <div className="mb-8 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-2 text-xs">
              <h4 className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                <Database className="w-3.5 h-3.5 text-emerald-700 dark:text-emerald-400" />
                <span>Previously Submitted Applications (Stored Locally)</span>
              </h4>
              <div className="divide-y divide-slate-200 dark:divide-slate-700">
                {storedApplications.map((app) => (
                  <div key={app.id} className="py-2.5 flex items-center justify-between flex-wrap gap-2">
                    <div>
                      <strong className="text-slate-900 dark:text-white block">{app.studentName}</strong>
                      <span className="text-[11px] text-slate-500 dark:text-slate-400">
                        {app.applicationNumber} · {app.applyingFor} ({app.section}) · Score: {app.pleOrUceScore}
                      </span>
                    </div>
                    <button
                      onClick={() => {
                        setActiveSlip(app);
                        setFormSubmitted(true);
                      }}
                      className="px-2.5 py-1 bg-emerald-800 hover:bg-emerald-700 text-white rounded-lg text-[11px] font-bold cursor-pointer transition-colors"
                    >
                      View & Print Slip
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {!formSubmitted ? (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              {formError && (
                <div className="p-3 bg-red-50 dark:bg-red-950/60 text-red-700 dark:text-red-300 text-xs rounded-xl flex items-center gap-2 border border-red-200 dark:border-red-800">
                  <AlertCircle className="w-4 h-4 shrink-0 text-red-600 dark:text-red-400" />
                  <span>{formError}</span>
                </div>
              )}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Student Full Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.studentName}
                    onChange={(e) => setFormData({ ...formData, studentName: e.target.value })}
                    placeholder="Enter student full name"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 focus:ring-2 focus:ring-emerald-600 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 text-xs font-medium"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Gender *</label>
                  <select
                    value={formData.gender}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 focus:ring-2 focus:ring-emerald-600 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-medium"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Applying For Class *</label>
                  <select
                    value={formData.applyingFor}
                    onChange={(e) => setFormData({ ...formData, applyingFor: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 focus:ring-2 focus:ring-emerald-600 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-medium"
                  >
                    <option value="Senior One (S.1)">Senior One (S.1)</option>
                    <option value="Senior Two (S.2)">Senior Two (S.2 Transfer)</option>
                    <option value="Senior Three (S.3)">Senior Three (S.3 Transfer)</option>
                    <option value="Senior Five (S.5)">Senior Five (S.5 UACE)</option>
                    <option value="Senior Six (S.6)">Senior Six (S.6 Transfer)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Boarding or Day Section *</label>
                  <select
                    value={formData.section}
                    onChange={(e) => setFormData({ ...formData, section: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 focus:ring-2 focus:ring-emerald-600 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-medium"
                  >
                    <option value="Boarding">Boarding Section (Halal Hostels)</option>
                    <option value="Day">Day Scholar</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">PLE Aggregates / UCE Division *</label>
                  <input
                    type="text"
                    required
                    value={formData.pleOrUceScore}
                    onChange={(e) => setFormData({ ...formData, pleOrUceScore: e.target.value })}
                    placeholder="Enter PLE aggregates or UCE division"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 focus:ring-2 focus:ring-emerald-600 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 text-xs font-medium"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Previous School Attended</label>
                  <input
                    type="text"
                    value={formData.previousSchool}
                    onChange={(e) => setFormData({ ...formData, previousSchool: e.target.value })}
                    placeholder="Enter previous school name"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 focus:ring-2 focus:ring-emerald-600 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Parent/Guardian Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.guardianName}
                    onChange={(e) => setFormData({ ...formData, guardianName: e.target.value })}
                    placeholder="Enter parent/guardian full name"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 focus:ring-2 focus:ring-emerald-600 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 text-xs"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Guardian Phone (MTN/Airtel) *</label>
                  <input
                    type="tel"
                    required
                    value={formData.guardianPhone}
                    onChange={(e) => setFormData({ ...formData, guardianPhone: e.target.value })}
                    placeholder="Enter guardian phone number"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 focus:ring-2 focus:ring-emerald-600 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 text-xs font-mono font-medium"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Email Address</label>
                  <input
                    type="email"
                    value={formData.guardianEmail}
                    onChange={(e) => setFormData({ ...formData, guardianEmail: e.target.value })}
                    placeholder="Enter email address"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 focus:ring-2 focus:ring-emerald-600 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 text-xs"
                  />
                </div>
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  className="w-full py-3.5 bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold rounded-xl text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>Submit Admission Application (Stored Locally in Browser)</span>
                </button>
              </div>
            </form>
          ) : (
            /* Admission Slip Preview upon Submission */
            <div className="p-6 bg-slate-50 dark:bg-slate-800/80 rounded-2xl border-2 border-emerald-600 space-y-4 transition-colors">
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700 pb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-800 text-amber-300 flex items-center justify-center font-serif font-black">
                    S
                  </div>
                  <div>
                    <h3 className="font-black text-slate-900 dark:text-white text-sm">{SCHOOL_INFO.name}</h3>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">Official Online Admission Slip • 2025/2026</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="bg-emerald-100 dark:bg-emerald-950 text-emerald-900 dark:text-emerald-300 border border-transparent dark:border-emerald-800 font-bold px-2.5 py-1 rounded-full text-xs block">
                    Verified Application
                  </span>
                  <span className="font-mono text-[10px] text-slate-500 dark:text-slate-400">
                    Ref: {activeSlip?.applicationNumber || 'SISS-2026-REG'}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-slate-500 dark:text-slate-400 block">Applicant:</span>
                  <strong className="text-slate-900 dark:text-white">{activeSlip?.studentName || formData.studentName}</strong>
                </div>
                <div>
                  <span className="text-slate-500 dark:text-slate-400 block">Applying Class:</span>
                  <strong className="text-slate-900 dark:text-white">{activeSlip?.applyingFor || formData.applyingFor} ({activeSlip?.section || formData.section})</strong>
                </div>
                <div>
                  <span className="text-slate-500 dark:text-slate-400 block">PLE / UCE Score:</span>
                  <strong className="text-emerald-700 dark:text-emerald-400">{activeSlip?.pleOrUceScore || formData.pleOrUceScore}</strong>
                </div>
                <div>
                  <span className="text-slate-500 dark:text-slate-400 block">Parent Contact:</span>
                  <strong className="text-slate-900 dark:text-white">{activeSlip?.guardianName || formData.guardianName} ({activeSlip?.guardianPhone || formData.guardianPhone})</strong>
                </div>
              </div>

              <div className="p-3 bg-emerald-50 dark:bg-emerald-950/70 border border-transparent dark:border-emerald-800 rounded-xl text-xs text-emerald-900 dark:text-emerald-200">
                Alhamdullilah! Your admission details have been saved securely in your browser's local storage. Please print or present this reference slip along with your original PLE / UCE results at the school admissions office in Nyamitanga, Mbarara or call 0705 705 967 to confirm your interview slot.
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={handlePrintSlip}
                  className="flex-1 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
                >
                  <Printer className="w-4 h-4" />
                  <span>Print Official Slip</span>
                </button>
                <button
                  onClick={() => setFormSubmitted(false)}
                  className="px-4 py-2.5 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer transition-colors"
                >
                  New Application
                </button>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};
