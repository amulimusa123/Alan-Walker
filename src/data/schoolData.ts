import { StudentProfile, SubjectCombination, FeeStructureItem, AlumniProfile, GalleryItem } from '../types';

export const SCHOOL_INFO = {
  name: "Shuhadae Islamic Secondary School",
  motto: "Knowledge, Faith and Integrity",
  arabicMotto: "العلم والإيمان والنزاهة",
  location: "Nyamitanga Division, Mbarara City, Western Uganda",
  directionsHint: "About 2 km off the Mbarara–Isingiro Highway, near Nyamitanga Hill",
  phonePrimary: "0705 705 967",
  phoneAlumni1: "0702 365 176",
  phoneAlumni2: "0755 260 894",
  email: "info@shuhadaeislamicssmbarara.com",
  unebCenterNumber: "U0842",
  ministryRegNumber: "PSS/S/241",
  poBox: "P.O. Box 718, Mbarara, Uganda",
  established: "1998",
  studentBody: "1,250+ Students",
  staffCount: "68 Teaching & Support Staff",
  headteacher: "Hajji Dr. Sulaiman Bukenya",
  headteacherTitle: "Headteacher & Director of Studies",
  deputyAcademics: "Tr. Haruna Kigozi",
  deanIslamicAffairs: "Sheikh Abdul-Rahman Kateregga",
};

export const QUICK_STATS = [
  { value: "Top 5", label: "Ranked in Mbarara District", sub: "UNEB UCE & UACE Performance" },
  { value: "98.4%", label: "Division 1 & 2 Pass Rate", sub: "UCE Class of 2024" },
  { value: "96%", label: "Direct University Admissions", sub: "Makerere, MUST, IUIU & Kyambogo" },
  { value: "1,250+", label: "Enrolled Learners", sub: "O-Level & A-Level Day & Boarding" },
  { value: "100%", label: "Halal Islamic Environment", sub: "5 Daily Congregational Prayers" },
];

export const DEMO_STUDENT: StudentProfile = {
  id: "STD-2024-045",
  fullName: "Farooq Kateregga",
  indexNumber: "U0842/045",
  admissionNumber: "SISS/2022/1089",
  className: "Senior Four",
  stream: "Green",
  section: "Boarding",
  house: "Umar Ibn Al-Khattab House",
  guardianName: "Aisha Nakato",
  guardianPhone: "0772 458 912",
  feesTotal: 950000,
  feesPaid: 800000,
  feesBalance: 150000,
  aggregates: 12,
  division: "Division 1 (Distinction)",
  prayerAttendance: 98,
  quranProgress: "Surah Al-Kahf completed, Juzu 15 Tajweed certification",
  conductRemarks: "Exemplary character, punctual for Tahajjud and classroom preps. Dedicated prefect of Library & Academics.",
  recentGrades: [
    { subject: "Mathematics", score: 91, grade: "D1", remarks: "Exceptional calculus & geometry" },
    { subject: "Physics", score: 82, grade: "D2", remarks: "Strong practical lab assessment" },
    { subject: "Chemistry", score: 85, grade: "D1", remarks: "Commendable titration skills" },
    { subject: "Biology", score: 88, grade: "D1", remarks: "Mastery of physiology & genetics" },
    { subject: "Islamic Religious Ed (IRE)", score: 96, grade: "D1", remarks: "Top in class, profound Fiqh insights" },
    { subject: "English Language", score: 78, grade: "D2", remarks: "Good composition & grammar" },
    { subject: "History & Political Ed", score: 80, grade: "D2", remarks: "Deep analysis of East African treaties" },
    { subject: "Geography", score: 84, grade: "D2", remarks: "Excellent map work & physical geography" },
  ],
};

export const SUBJECT_COMBINATIONS: SubjectCombination[] = [
  {
    code: "BCM/ICT",
    name: "Biology, Chemistry, Mathematics",
    category: "Sciences",
    subjects: ["Biology", "Chemistry", "Mathematics"],
    subsidiaries: ["ICT", "General Paper"],
    careerPaths: ["Human Medicine & Surgery", "Pharmacy", "Biomedical Engineering", "Dentistry"],
    cutoff: "Points: 12-18 at UCE"
  },
  {
    code: "PCB/Sub-Math",
    name: "Physics, Chemistry, Biology",
    category: "Sciences",
    subjects: ["Physics", "Chemistry", "Biology"],
    subsidiaries: ["Sub-Mathematics", "General Paper"],
    careerPaths: ["Medicine", "Radiography", "Veterinary Medicine", "Laboratory Sciences"],
    cutoff: "Points: 12-16 at UCE"
  },
  {
    code: "PEM/ICT",
    name: "Physics, Economics, Mathematics",
    category: "Sciences",
    subjects: ["Physics", "Economics", "Mathematics"],
    subsidiaries: ["ICT", "General Paper"],
    careerPaths: ["Civil / Electrical Engineering", "Actuarial Science", "Architecture", "Data Science"],
    cutoff: "Points: 14-20 at UCE"
  },
  {
    code: "PCM/ICT",
    name: "Physics, Chemistry, Mathematics",
    category: "Sciences",
    subjects: ["Physics", "Chemistry", "Mathematics"],
    subsidiaries: ["ICT", "General Paper"],
    careerPaths: ["Mechanical Engineering", "Industrial Chemistry", "Petroleum Geosciences"],
    cutoff: "Points: 12-18 at UCE"
  },
  {
    code: "HEG/Div",
    name: "History, Economics, Geography",
    category: "Arts",
    subjects: ["History", "Economics", "Geography"],
    subsidiaries: ["Sub-ICT / Divinity", "General Paper"],
    careerPaths: ["Law", "International Relations", "Public Administration", "Urban Planning"],
    cutoff: "Points: 16-24 at UCE"
  },
  {
    code: "DEG/Arabic",
    name: "Divinity (IRE), Economics, Geography",
    category: "Arts",
    subjects: ["Islamic Religious Education", "Economics", "Geography"],
    subsidiaries: ["Arabic Language", "General Paper"],
    careerPaths: ["Islamic Banking & Finance", "Shariah Law", "Diplomacy", "Development Studies"],
    cutoff: "Points: 18-26 at UCE"
  },
  {
    code: "HEL/Sub-Math",
    name: "History, Economics, Literature",
    category: "Arts",
    subjects: ["History", "Economics", "Literature in English"],
    subsidiaries: ["Sub-Mathematics", "General Paper"],
    careerPaths: ["Mass Communication / Journalism", "Corporate Law", "Diplomatic Service"],
    cutoff: "Points: 16-24 at UCE"
  },
  {
    code: "MEA/ICT",
    name: "Mathematics, Economics, Art & Design",
    category: "Economics & Vocational",
    subjects: ["Mathematics", "Economics", "Art & Design"],
    subsidiaries: ["ICT", "General Paper"],
    careerPaths: ["Architecture", "Industrial Design", "Financial Analytics", "Advertising"],
    cutoff: "Points: 18-26 at UCE"
  }
];

export const FEE_STRUCTURE: FeeStructureItem[] = [
  { item: "Tuition & Instruction Fee", s1_s4_day: 380000, s1_s4_boarding: 450000, s5_s6_day: 420000, s5_s6_boarding: 520000, frequency: "Per Term" },
  { item: "Boarding & Accommodation (Halal meals, utility)", s1_s4_day: 0, s1_s4_boarding: 350000, s5_s6_day: 0, s5_s6_boarding: 380000, frequency: "Per Term" },
  { item: "Science Lab & Practical Consumables", s1_s4_day: 50000, s1_s4_boarding: 50000, s5_s6_day: 70000, s5_s6_boarding: 70000, frequency: "Per Term" },
  { item: "Computer / ICT & Internet Access", s1_s4_day: 40000, s1_s4_boarding: 40000, s5_s6_day: 40000, s5_s6_boarding: 40000, frequency: "Per Term" },
  { item: "School Mosque & Islamic Tarbiyyah Welfare", s1_s4_day: 20000, s1_s4_boarding: 20000, s5_s6_day: 20000, s5_s6_boarding: 20000, frequency: "Per Term" },
  { item: "Medical & First Aid Infirmary Cover", s1_s4_day: 30000, s1_s4_boarding: 40000, s5_s6_day: 30000, s5_s6_boarding: 40000, frequency: "Per Term" },
  { item: "Total Fees Per Term (UGX)", s1_s4_day: 520000, s1_s4_boarding: 950000, s5_s6_day: 580000, s5_s6_boarding: 1050000, frequency: "Payable via Bank / MoMo" },
];

export const ONE_OFF_REQUIREMENTS = [
  { item: "Full Uniform Package (2 pairs trousers/skirts, 2 shirts, 1 sweater, 2 hijab veils for girls, sports kit, tie)", cost: "UGX 220,000", when: "Once on Admission" },
  { item: "School Development Fund", cost: "UGX 80,000", when: "Once per Academic Year" },
  { item: "Identity Card & Medical File", cost: "UGX 25,000", when: "On Admission" },
  { item: "UNEB Registration Fee (S.4 and S.6 Candidates only)", cost: "According to UNEB circular (Approx UGX 165,000 - 180,000)", when: "Candidate Year" },
];

export const PAYMENT_METHODS = [
  {
    name: "Centenary Bank (Main Collection A/C)",
    accountNumber: "3100084200",
    accountName: "Shuhadae Islamic Secondary School Mbarara",
    branch: "Mbarara Branch (High Street)",
    instructions: "Quote Student Name and Class on bank deposit slip."
  },
  {
    name: "Stanbic Bank Uganda",
    accountNumber: "903001842099",
    accountName: "Shuhadae Islamic Sec School",
    branch: "Mbarara Main Branch",
    instructions: "Available via Stanbic Bank Agents across Uganda."
  },
  {
    name: "MTN Mobile Money / Airtel Money (SchoolPay)",
    code: "School Pay Code: 418290",
    accountName: "Dial *165*4*3*1# or *185*6*2#",
    instructions: "Enter Student Payment Code (available on admission letter)."
  }
];

export const ALUMNI_PROFILES: AlumniProfile[] = [
  {
    id: "alm-1",
    fullName: "Dr. Faridah Nabukenya, MBChB",
    completionYear: "Class of 2014 (PCB/Sub-Math)",
    combinationOrStream: "UACE 19 Points",
    currentProfession: "Medical Officer & Pediatric Specialist",
    organization: "Mbarara Regional Referral Hospital / MUST Faculty of Medicine",
    location: "Mbarara, Uganda",
    quote: "Shuhadae instilled in me the discipline of balancing demanding science practicals with daily prayers. The teachers believed in me when I was in S.5 and that laid the groundwork for my medical degree.",
    avatar: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=300"
  },
  {
    id: "alm-2",
    fullName: "Eng. Bashir Mugerwa, BEng",
    completionYear: "Class of 2016 (PEM/ICT)",
    combinationOrStream: "UACE 18 Points",
    currentProfession: "Highway & Structural Engineer",
    organization: "Uganda National Roads Authority (UNRA)",
    location: "Kampala / Western Region",
    quote: "The analytical foundation I gained from the mathematics and physics departments at Shuhadae was world-class. Our school compound in Nyamitanga was our sanctuary for hard work.",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=300"
  },
  {
    id: "alm-3",
    fullName: "Adv. Zainab Kyomugisha, LLB, Dip. LP",
    completionYear: "Class of 2018 (HEG/Div)",
    combinationOrStream: "UACE 19 Points",
    currentProfession: "Advocate & Legal Counsel",
    organization: "High Court of Uganda & Islamic Finance Advisory",
    location: "Kampala, Uganda",
    quote: "The debating club and Islamic jurisprudence discussions at Shuhadae shaped my career in law. Alhamdullilah for the noble foundation.",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=300"
  },
  {
    id: "alm-4",
    fullName: "Sheikh Dr. Haroun Ssenyonga, PhD",
    completionYear: "Class of 2010 (DEG/Arabic)",
    combinationOrStream: "UACE 20 Points",
    currentProfession: "Lecturer of Islamic Studies & Dean of Students",
    organization: "Islamic University in Uganda (IUIU)",
    location: "Mbale / Kampala",
    quote: "Shuhadae is not just a school; it is a center of Tarbiyyah where students emerge with character and secular brilliance in equal measure.",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=300"
  }
];

export const GALLERY_ITEMS: GalleryItem[] = [
  {
    id: "gal-1",
    title: "Senior Four Science Practical Laboratory",
    category: "labs",
    description: "Equipped with modern titration apparatus, optical microscopes, and chemical reagents for UNEB UCE and UACE examinations.",
    image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: "gal-2",
    title: "Annual Hafla & Khatma Quran Graduation",
    category: "islamic",
    description: "Celebrating students who completed memorization of the Holy Quran alongside stellar academic grades, attended by dignitaries from Mbarara and beyond.",
    image: "https://images.unsplash.com/photo-1584281722572-c516bcfa1c91?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: "gal-3",
    title: "Learner-Centered Modern Classrooms",
    category: "classrooms",
    description: "Spacious, ventilated classrooms tailored for the New Lower Secondary Curriculum project presentations and collaborative study.",
    image: "https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: "gal-4",
    title: "Modern Boarding Hostels & Dormitories",
    category: "dormitories",
    description: "Separate self-contained wings for boys and girls with 24/7 security, solar backup lighting, clean water supply, and resident matrons.",
    image: "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: "gal-5",
    title: "Inter-House Football & Athletics Tournament",
    category: "sports",
    description: "Fostering physical fitness, discipline, and sportsmanship on the school sports grounds overlooking Nyamitanga.",
    image: "https://images.unsplash.com/photo-1526232761682-d26e03ac148e?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: "gal-6",
    title: "School Dining Hall & Halal Kitchen",
    category: "dining",
    description: "Wholesome, balanced, and strictly Halal meals prepared daily, including special Friday and Eid feasts.",
    image: "https://images.unsplash.com/photo-1577495508048-b635879837f1?auto=format&fit=crop&q=80&w=800"
  }
];

export const SCHOOL_ANTHEM = {
  title: "The Anthem of Shuhadae Islamic Secondary School",
  verses: [
    "Arise, O sons and daughters of Shuhadae,\nUnder the green banner of faith and truth,\nIn Nyamitanga where wisdom shines bright,\nWe march forward into glorious light.",
    "With Taqwa as our unyielding shield,\nAnd knowledge our sword upon the field,\nFrom O-Level to A-Level we strive with pride,\nWith Allah's guidance by our side.",
    "Oh Shuhadae, our noble home,\nIn Mbarara where honor stands alone,\nKnowledge, Faith, and Integrity our creed,\nIn every thought, in every deed!"
  ]
};

export const HEADTEACHER_WELCOME_SPEECH = `Assalamu Alaikum Warahmatullah Wabarakatuh.

On behalf of the Board of Governors, Academic Staff, and Student Community, it is my great honor to welcome you to Shuhadae Islamic Secondary School, located in Nyamitanga Division, Mbarara City.

At Shuhadae, we hold a steadfast conviction: that true education is not merely the accumulation of certificates, but the harmonious nurturing of the intellect, character, and soul. We provide a rigorous secular academic curriculum—both under the New Lower Secondary Curriculum and the Advanced Level combinations—firmly anchored in noble Islamic morals and discipline.

Our students consistently achieve stellar Division One outcomes in UNEB examinations and gain admission into premier universities such as MUST, Makerere, and IUIU. Concurrently, our graduates carry the virtues of Taqwa, integrity, and humility into society.

Whether you are a parent seeking an exemplary boarding environment for your child, or a prospective student eager to excel, we welcome you to join our family. May Allah bless your educational journey.`;
