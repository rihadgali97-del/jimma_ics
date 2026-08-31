export type Language = 'en' | 'om' | 'ar';

export type UserRole =
  | 'Super Admin'
  | 'Council Director'
  | 'Finance Officer'
  | 'Education Officer'
  | 'Mosque Officer'
  | 'Ulema Coordinator'
  | 'Madrasa Administrator'
  | 'Teacher'
  | 'Imam'
  | 'Auditor'
  | string;

export type StaffStatus = 'Active' | 'On Leave' | 'Suspended' | 'Pending Invitation';

export type StaffDepartment =
  | 'Executive Secretariat'
  | 'Shariah & Fatwa Board'
  | 'Education Directorate'
  | 'Finance & Endowment'
  | 'Mosque & Waqf Affairs'
  | 'Social Services & Zakat'
  | 'IT & Media Communications';

export interface User {
  id: string;
  name: string;
  arabicName?: string;
  email: string;
  role: UserRole;
  title?: string;
  department?: StaffDepartment | string;
  avatar?: string;
  phone: string;
  district?: string;
  status?: StaffStatus;
  joinedDate?: string;
  lastLogin?: string;
  twoFactorEnabled?: boolean;
  accessLevel?: string;
  permissions: string[];
  customPermissions?: string[];
  notes?: string;
}

export interface PermissionItem {
  id: string;
  name: string;
  description: string;
  module: string;
  risk: 'Low' | 'Medium' | 'High' | 'Critical';
}

export interface PermissionCategory {
  id: string;
  name: string;
  arabicName?: string;
  description: string;
  iconName: string;
  permissions: PermissionItem[];
}

export interface RoleDefinition {
  id: string;
  name: string;
  arabicName?: string;
  department: StaffDepartment | string;
  description: string;
  isSystemRole: boolean;
  privilegeLevel: 'Critical' | 'High' | 'Medium' | 'Standard';
  defaultDashboard: string;
  color: string;
  assignedUsersCount?: number;
  permissions: string[];
  createdAt: string;
  updatedAt: string;
}

export interface SecurityAuditLog {
  id: string;
  timestamp: string;
  hijriDate?: string;
  actorName: string;
  actorEmail: string;
  actorRole: string;
  action: string;
  target: string;
  category: 'Auth' | 'Role_Change' | 'Permission_Override' | 'Staff_Record' | 'Finance_Security' | 'System_Config';
  status: 'Success' | 'Warning' | 'Blocked';
  ipAddress: string;
  details: string;
}

export interface Mosque {
  id: string;
  name: string;
  arabicName?: string;
  district: string;
  subCityOrWoreda: string;
  address: string;
  imam: string;
  deputyImam?: string;
  muazzin?: string;
  committeeChairman: string;
  establishedYear: number;
  capacity: number;
  students: number;
  status: 'active' | 'renovation' | 'planned';
  facilities: string[];
  hasMadrasa: boolean;
  madrasaId?: string;
  contactPhone: string;
  image: string;
  jummahAttendance: number;
  monthlyExpensesETB: number;
  coordinates?: { lat: number; lng: number };
  description: string;
}

export interface Madrasa {
  id: string;
  name: string;
  arabicName?: string;
  mosqueId: string;
  mosqueName: string;
  district: string;
  headTeacher: string;
  establishedYear: number;
  totalStudents: number;
  totalTeachers: number;
  levels: string[]; // e.g. ['Level 1 (Tahfeez)', 'Level 2 (Tajweed & Fiqh)', 'Level 3 (Alimiyyah Prep)']
  programs: string[];
  status: 'active' | 'in-session' | 'recess';
  shifts: ('Morning' | 'Afternoon' | 'Weekend')[];
  contactPhone: string;
  image: string;
  description: string;
  accreditationStatus: 'Fully Accredited' | 'Provisional' | 'Under Review';
}

export interface Student {
  id: string;
  name: string;
  arabicName?: string;
  gender: 'Male' | 'Female';
  age: number;
  madrasaId: string;
  madrasaName: string;
  className: string;
  teacherId: string;
  teacherName: string;
  enrollmentDate: string;
  attendanceRate: number; // percentage e.g. 94
  quranJuzCompleted: number; // 0 to 30
  currentJuz: number;
  currentJuzProgress: number; // percentage e.g. 75
  hifzStatus: {
    sabaq: string; // current new lesson e.g. "Surah An-Nisa: 1-15"
    sabqi: string; // recent review e.g. "Juz 4"
    manzil: string; // long term retention e.g. "Juz 1 to 3"
  };
  tajweedRating: 'Excellent' | 'Good' | 'Needs Practice' | 'Very Good' | 'Needs Revision';
  examScoreAvg: number; // out of 100
  parentName: string;
  parentPhone: string;
  guardianName?: string;
  guardianPhone?: string;
  sabaqSurah?: string;
  sabaqAyahStart?: number;
  sabaqAyahEnd?: number;
  sabaqiJuz?: number;
  manzilJuz?: string;
  dailyAttendance?: 'Present' | 'Absent' | 'Late' | 'Excused';
  level?: string;
  status: 'Active' | 'On Leave' | 'Graduated';
  avatar?: string;
}

export interface Teacher {
  id: string;
  name: string;
  madrasaId: string;
  madrasaName: string;
  qualification: string;
  specialization: string;
  experienceYears: number;
  studentsCount: number;
  phone: string;
  email: string;
  status: 'Active' | 'On Leave';
  avatar?: string;
}

export interface Ulema {
  id: string;
  name: string;
  arabicName?: string;
  title: string; // e.g. "Sheikh", "Mufti", "Ustadh", "Dr."
  specializations: string[]; // ['Tafseer', 'Fiqh & Fatwa', 'Hadith Sciences', 'Family Counselling', 'Waqf & Inheritance']
  district: string;
  assignedMosqueId?: string;
  assignedMosqueName?: string;
  qualifications: string[];
  languages: string[];
  areasOfService: string[];
  biography: string;
  contactPhone: string;
  email: string;
  status: 'Active' | 'Senior Advisor' | 'Visiting Scholar';
  avatar: string;
  yearsOfDawah: number;
}

export interface Transaction {
  id: string;
  referenceNo: string;
  date: string;
  type: 'Income' | 'Expense' | 'Transfer' | 'Disbursement';
  fundId: string;
  fundName: string;
  category: string;
  amountETB: number;
  description: string;
  paymentMethod: 'Telebirr' | 'CBE Birr' | 'Bank Transfer' | 'Cash' | 'Cheque';
  status: 'Completed' | 'Pending' | 'Flagged';
  recordedBy: string;
  approvedBy?: string;
  receiptUrl?: string;
}

export interface Donation {
  id: string;
  receiptNo: string;
  donorName: string;
  isAnonymous: boolean;
  phone?: string;
  email?: string;
  amountETB: number;
  fundId: string;
  fundName: string;
  date: string;
  paymentMethod: 'Telebirr' | 'CBE Birr' | 'Bank Transfer' | 'Cash';
  status: 'Completed' | 'Processing' | 'Refunded';
  notes?: string;
  certificateIssued: boolean;
}

export interface Fund {
  id: string;
  name: string;
  description: string;
  allocatedETB: number;
  disbursedETB: number;
  targetETB: number;
  color: string;
}

export interface ExpenseApproval {
  id: string;
  requestNo: string;
  title: string;
  category: string;
  amountETB: number;
  requestedBy: string;
  role: string;
  date: string;
  status: 'Pending Review' | 'Finance Approved' | 'Council Director Approved' | 'Rejected' | 'Disbursed';
  description: string;
  justification: string;
  fundId: string;
  fundName: string;
  comments?: string[];
}

export interface ServiceRequest {
  id: string;
  trackingNo: string;
  serviceType: 'Nikah Services' | 'Janazah Support' | 'Zakat Assistance' | 'Islamic Counselling' | 'Halal Certification Guidance' | 'Madrasa Registration' | 'Mosque Land & Waqf Support' | 'Orphan Sponsorship';
  applicantName: string;
  applicantPhone: string;
  applicantDistrict: string;
  submissionDate: string;
  status: 'Submitted' | 'Under Review' | 'Approved' | 'Disbursed' | 'Completed' | 'Rejected';
  assignedOfficer: string;
  notes: string;
  documentsCount: number;
  priority: 'Normal' | 'Urgent' | 'High';
}

export interface EventScheduleItem {
  time: string;
  activity: string;
  speaker?: string;
  hall?: string;
  notes?: string;
}

export interface EventSpeaker {
  name: string;
  title: string;
  role: string;
  avatar?: string;
  organization?: string;
}

export interface EventRegistration {
  id: string;
  eventId: string;
  eventTitle: string;
  eventDate: string;
  fullName: string;
  phone: string;
  email?: string;
  district: string;
  organizationOrMadrasa?: string;
  attendeesCount: number;
  notes?: string;
  passNumber: string;
  status: 'Confirmed' | 'Checked-In' | 'Cancelled';
  createdAt: string;
}

export interface CouncilEvent {
  id: string;
  title: string;
  arabicTitle?: string;
  category: 'Lecture' | 'Quran Competition' | 'Ramadan Program' | 'Ulema Conference' | 'Youth Workshop' | 'Community Gathering';
  date: string;
  hijriDate: string;
  time: string;
  location: string;
  venueDetails?: string;
  district: string;
  organizer: string;
  speaker: string;
  description: string;
  attendeesCount: number;
  maxCapacity: number;
  isFeatured: boolean;
  image: string;
  registrationOpen: boolean;
  status?: 'Upcoming' | 'In Progress' | 'Completed' | 'Postponed' | 'Cancelled';
  format?: 'In-Person' | 'Hybrid' | 'Live Stream';
  entryFee?: 'Free' | string;
  targetAudience?: string;
  livestreamUrl?: string;
  contactPhone?: string;
  contactEmail?: string;
  schedule?: EventScheduleItem[];
  speakersList?: EventSpeaker[];
  tags?: string[];
  materials?: { title: string; fileType: string; size: string; downloadUrl?: string }[];
}

export interface Announcement {
  id: string;
  title: string;
  category: 'Official Communique' | 'Moon Sighting' | 'Zakat Nisab' | 'Academic Calendar' | 'Council Advisory';
  publishDate: string;
  hijriDate: string;
  author: string;
  summary: string;
  content: string;
  isPinned: boolean;
  district?: string;
  readTime: string;
}

export interface CouncilDocument {
  id: string;
  title: string;
  category: 'Annual Report' | 'Financial Audit' | 'Bylaws & Governance' | 'Curriculum Guide' | 'Form & Application' | 'Press Release';
  owner: 'Council Secretariat' | 'Finance Directorate' | 'Education Board' | 'Shariah Board' | 'Mosque Affairs';
  uploadedBy: string;
  uploadDate: string;
  fileSize: string;
  fileType: 'PDF' | 'DOCX' | 'XLSX';
  downloadUrl: string;
  status: 'Public' | 'Official Archive' | 'Confidential';
  downloadsCount: number;
}

export type AttendanceStatus = 'Present' | 'Absent' | 'Late' | 'Excused';

export interface AttendanceRecord {
  studentId: string;
  studentName: string;
  status: AttendanceStatus;
  notes?: string;
}

export interface StudentAttendanceEntry {
  studentId: string;
  studentName: string;
  arabicName?: string;
  gender: 'Male' | 'Female';
  age?: number;
  guardianName: string;
  guardianPhone: string;
  status: AttendanceStatus;
  arrivalTime?: string;
  lateMinutes?: number;
  sabaqRecited: boolean;
  sabaqRating?: 'Excellent' | 'Very Good' | 'Good' | 'Needs Revision' | 'Not Recited';
  currentLesson?: string;
  absenceReason?: 'Illness/Medical' | 'Family Matter' | 'Unexcused' | 'Weather/Transport' | 'Council Excused' | 'Other';
  parentNotified: boolean;
  notes?: string;
}

export interface DailyAttendanceSession {
  id: string;
  date: string;
  hijriDate: string;
  madrasaId: string;
  madrasaName: string;
  className: string;
  teacherId: string;
  teacherName: string;
  shift: 'Morning' | 'Afternoon' | 'Evening' | 'Weekend';
  totalStudents: number;
  presentCount: number;
  absentCount: number;
  lateCount: number;
  excusedCount: number;
  attendanceRate: number; // percentage e.g. 92.5
  status: 'Draft' | 'Submitted' | 'Verified by Supervisor';
  recordedBy: string;
  submittedAt: string;
  notes?: string;
  entries: StudentAttendanceEntry[];
}

export interface StaffAttendanceEntry {
  id: string;
  staffId: string;
  staffName: string;
  arabicName?: string;
  role: string;
  department: string;
  phone: string;
  avatar?: string;
  status: 'Present' | 'Absent' | 'Late' | 'On Leave' | 'Field Duty / Inspection' | 'Excused';
  clockInTime?: string;
  clockOutTime?: string;
  lateMinutes?: number;
  location: string;
  workSummary?: string;
  recordedBy: string;
}

// SMS / Telegram Gateway Types
export type MessageChannel = 'sms' | 'telegram' | 'hybrid';

export type MessageCategory =
  | 'sabaq_alert'
  | 'janazah_broadcast'
  | 'prayer_announcement'
  | 'moon_sighting'
  | 'khutbah_advisory'
  | 'general_bulletin';

export type MessageDeliveryStatus = 'queued' | 'transmitting' | 'delivered' | 'delivered_partial' | 'failed';

export interface DispatchLogItem {
  id: string;
  timestamp: string;
  title: string;
  category: MessageCategory;
  channel: MessageChannel;
  senderId: string;
  recipientTarget: string;
  recipientCount: number;
  content: string;
  status: MessageDeliveryStatus;
  gatewayResponseCode: string;
  costETB: number;
  deliveryRate: number;
  metadata?: {
    studentId?: string;
    studentName?: string;
    parentPhone?: string;
    madrasaName?: string;
    woreda?: string;
    mosqueName?: string;
    deceasedName?: string;
    janazahTime?: string;
    cemetery?: string;
    prayerName?: string;
  };
}

export interface GatewayChannelStats {
  smsBalanceETB: number;
  smsTotalSent: number;
  smsSuccessRate: number;
  ethioShortCode: string;
  telegramBotUsername: string;
  telegramChannelName: string;
  telegramSubscribers: number;
  telegramMessagesSent: number;
}

