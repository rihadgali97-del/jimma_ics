import React, { createContext, useContext, useState } from 'react';
import {
  Mosque,
  Madrasa,
  Student,
  Teacher,
  Ulema,
  Transaction,
  Donation,
  Fund,
  ExpenseApproval,
  ServiceRequest,
  CouncilEvent,
  Announcement,
  CouncilDocument,
  User,
  AttendanceRecord,
  AttendanceStatus,
  DailyAttendanceSession,
  StudentAttendanceEntry,
  StaffAttendanceEntry,
  DispatchLogItem,
  GatewayChannelStats,
  EventRegistration,
  RoleDefinition,
  PermissionCategory,
  SecurityAuditLog,
  CouncilResource,
  ZakatBeneficiaryDistribution,
  AuditDirective,
  AuditChecklistItem,
  CryptographicLedgerBlock,
} from '../types';
import { mockMosques } from '../data/mockMosques';
import { mockMadrasas } from '../data/mockMadrasas';
import { mockStudents, mockTeachers } from '../data/mockStudents';
import { mockUlema } from '../data/mockUlema';
import { mockFunds, mockTransactions, mockDonations, mockExpenseApprovals, mockZakatDistributions } from '../data/mockFinance';
import { mockPublicServices, mockServiceRequests, ServiceItem } from '../data/mockServices';
import { mockEvents, mockAnnouncements, mockDocuments, mockUsers, mockEventRegistrations } from '../data/mockEventsAndDocs';
import { initialCouncilResources } from '../data/mockResources';
import { mockDispatchHistory, initialGatewayStats } from '../data/mockGatewayData';
import { initialStaffMembers, mockRoles, permissionCategories as defaultPermissionCategories, initialSecurityLogs } from '../data/mockStaffAndRoles';
import { initialAttendanceSessions, initialStaffAttendance } from '../data/mockAttendance';
import { mockAuditDirectives, mockAuditChecklist, mockLedgerBlocks } from '../data/mockAuditCompliance';

export interface ToastNotification {
  id: string;
  title: string;
  message: string;
  type: 'success' | 'info' | 'warning' | 'error';
  timestamp: string;
}

interface AppContextType {
  currentUser: User;
  setCurrentUser: (user: User) => void;
  switchRole: (roleName: string) => void;
  allUsers: User[];

  // Staff & RBAC Management
  staffList: User[];
  addStaff: (staff: Omit<User, 'id'>) => User;
  updateStaff: (id: string, updates: Partial<User>) => void;
  deleteStaff: (id: string) => void;
  toggleStaffStatus: (id: string) => void;
  rolesList: RoleDefinition[];
  addRole: (role: Omit<RoleDefinition, 'id' | 'createdAt' | 'updatedAt'>) => RoleDefinition;
  updateRole: (id: string, updates: Partial<RoleDefinition>) => void;
  deleteRole: (id: string) => void;
  permissionCategories: PermissionCategory[];
  securityLogs: SecurityAuditLog[];
  addSecurityLog: (log: Omit<SecurityAuditLog, 'id' | 'timestamp'>) => void;

  // Entities
  mosques: Mosque[];
  addMosque: (mosque: Omit<Mosque, 'id'>) => void;
  updateMosque: (id: string, updates: Partial<Mosque>) => void;

  madrasas: Madrasa[];
  addMadrasa: (madrasa: Omit<Madrasa, 'id'>) => void;

  students: Student[];
  addStudent: (student: any) => void;
  updateStudent: (id: string, updates: Partial<Student>) => void;
  updateStudentProgress: (id: string, updates: any) => void;

  teachers: Teacher[];
  ulema: Ulema[];

  funds: Fund[];
  transactions: Transaction[];
  addTransaction: (tx: Omit<Transaction, 'id' | 'referenceNo'>) => void;

  donations: Donation[];
  addDonation: (donation: Omit<Donation, 'id' | 'receiptNo' | 'date' | 'status' | 'certificateIssued'>) => Donation;
  updateDonation: (id: string, updates: Partial<Donation>) => void;
  deleteDonation: (id: string) => void;
  zakatDistributions: ZakatBeneficiaryDistribution[];
  addZakatDistribution: (item: Omit<ZakatBeneficiaryDistribution, 'id'>) => ZakatBeneficiaryDistribution;
  updateZakatDistribution: (id: string, updates: Partial<ZakatBeneficiaryDistribution>) => void;

  expenseApprovals: ExpenseApproval[];
  updateExpenseStatus: (id: string, status: ExpenseApproval['status'], comment?: string) => void;

  publicServices: ServiceItem[];
  serviceRequests: ServiceRequest[];
  submitServiceRequest: (req: Omit<ServiceRequest, 'id' | 'trackingNo' | 'submissionDate' | 'status' | 'assignedOfficer'>) => ServiceRequest;
  updateServiceRequestStatus: (id: string, status: ServiceRequest['status'], officer?: string) => void;

  events: CouncilEvent[];
  addEvent: (event: Omit<CouncilEvent, 'id'>) => CouncilEvent;
  updateEvent: (id: string, updates: Partial<CouncilEvent>) => void;
  deleteEvent: (id: string) => void;
  eventRegistrations: EventRegistration[];
  registerForEvent: (data: Omit<EventRegistration, 'id' | 'passNumber' | 'status' | 'createdAt'>) => EventRegistration;
  cancelRegistration: (regId: string) => void;
  checkInAttendee: (regId: string) => void;
  announcements: Announcement[];
  documents: CouncilDocument[];

  // Educational Resources, Handbooks & Khutbahs
  resources: CouncilResource[];
  addResource: (resource: Omit<CouncilResource, 'id' | 'uploadDate' | 'downloadsCount'>) => CouncilResource;
  updateResource: (id: string, updates: Partial<CouncilResource>) => void;
  deleteResource: (id: string) => void;
  incrementResourceDownload: (id: string) => void;

  // Gateway & Communications
  gatewayStats: GatewayChannelStats;
  dispatchHistory: DispatchLogItem[];
  dispatchMessage: (item: Omit<DispatchLogItem, 'id' | 'timestamp' | 'status' | 'gatewayResponseCode' | 'deliveryRate'>) => Promise<DispatchLogItem>;
  topUpSmsBalance: (amountETB: number) => void;
  clearDispatchHistory: () => void;

  // Attendance
  attendanceMap: Record<string, 'Present' | 'Absent' | 'Late' | 'Excused'>;
  setStudentAttendance: (studentId: string, status: 'Present' | 'Absent' | 'Late' | 'Excused') => void;
  saveDailyAttendance: (madrasaId: string, date: string) => void;
  dailyAttendanceSessions: DailyAttendanceSession[];
  staffAttendanceList: StaffAttendanceEntry[];
  saveDailyAttendanceSession: (session: DailyAttendanceSession) => void;
  updateStudentAttendanceEntry: (sessionId: string, studentId: string, updates: Partial<StudentAttendanceEntry>) => void;
  batchMarkAttendance: (sessionId: string, status: AttendanceStatus) => void;
  sendAbsenceSmsAlerts: (sessionId: string, filter?: 'Absent' | 'Late' | 'All') => Promise<{ sentCount: number; costETB: number }>;
  updateStaffAttendanceRecord: (id: string, updates: Partial<StaffAttendanceEntry>) => void;
  addStaffAttendanceRecord: (entry: Omit<StaffAttendanceEntry, 'id'>) => StaffAttendanceEntry;

  // Independent Audit & Shariah Compliance
  auditDirectives: AuditDirective[];
  addAuditDirective: (directive: Omit<AuditDirective, 'id' | 'createdDate'>) => AuditDirective;
  updateAuditDirective: (id: string, updates: Partial<AuditDirective>) => void;
  resolveAuditDirective: (id: string, resolutionNote: string) => void;
  escalateAuditDirective: (id: string) => void;
  deleteAuditDirective: (id: string) => void;
  auditChecklist: AuditChecklistItem[];
  updateChecklistStatus: (id: string, status: AuditChecklistItem['status'], note?: string) => void;
  ledgerBlocks: CryptographicLedgerBlock[];
  runForensicReconciliation: () => Promise<{ verifiedBlocks: number; verifiedTxs: number; varianceETB: number; hash: string }>;

  // Toasts
  toasts: ToastNotification[];
  addToast: (title: string, message: string, type?: 'success' | 'info' | 'warning' | 'error') => void;
  removeToast: (id: string) => void;

  // Global Search Modal
  isSearchOpen: boolean;
  setIsSearchOpen: (open: boolean) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User>(initialStaffMembers[0]);
  const [staffList, setStaffList] = useState<User[]>(initialStaffMembers);
  const [rolesList, setRolesList] = useState<RoleDefinition[]>(mockRoles);
  const [permissionCategories] = useState<PermissionCategory[]>(defaultPermissionCategories);
  const [securityLogs, setSecurityLogs] = useState<SecurityAuditLog[]>(initialSecurityLogs);

  const [mosques, setMosques] = useState<Mosque[]>(mockMosques);
  const [madrasas, setMadrasas] = useState<Madrasa[]>(mockMadrasas);
  const [students, setStudents] = useState<Student[]>(mockStudents);
  const [teachers] = useState<Teacher[]>(mockTeachers);
  const [ulema] = useState<Ulema[]>(mockUlema);
  const [funds, setFunds] = useState<Fund[]>(mockFunds);
  const [transactions, setTransactions] = useState<Transaction[]>(mockTransactions);
  const [donations, setDonations] = useState<Donation[]>(mockDonations);
  const [zakatDistributions, setZakatDistributions] = useState<ZakatBeneficiaryDistribution[]>(mockZakatDistributions);
  const [expenseApprovals, setExpenseApprovals] = useState<ExpenseApproval[]>(mockExpenseApprovals);
  const [serviceRequests, setServiceRequests] = useState<ServiceRequest[]>(mockServiceRequests);
  const [events, setEvents] = useState<CouncilEvent[]>(mockEvents);
  const [eventRegistrations, setEventRegistrations] = useState<EventRegistration[]>(mockEventRegistrations);
  const [announcements] = useState<Announcement[]>(mockAnnouncements);
  const [documents] = useState<CouncilDocument[]>(mockDocuments);
  const [resources, setResources] = useState<CouncilResource[]>(initialCouncilResources);
  const [auditDirectives, setAuditDirectives] = useState<AuditDirective[]>(mockAuditDirectives);
  const [auditChecklist, setAuditChecklist] = useState<AuditChecklistItem[]>(mockAuditChecklist);
  const [ledgerBlocks, setLedgerBlocks] = useState<CryptographicLedgerBlock[]>(mockLedgerBlocks);
  const [toasts, setToasts] = useState<ToastNotification[]>([]);
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);

  // Initial Attendance Map initialized to "Present" for all students
  const [attendanceMap, setAttendanceMap] = useState<Record<string, 'Present' | 'Absent' | 'Late' | 'Excused'>>(() => {
    const map: Record<string, 'Present' | 'Absent' | 'Late' | 'Excused'> = {};
    mockStudents.forEach((st, idx) => {
      map[st.id] = idx % 11 === 0 ? 'Absent' : idx % 17 === 0 ? 'Late' : 'Present';
    });
    return map;
  });

  const [dailyAttendanceSessions, setDailyAttendanceSessions] = useState<DailyAttendanceSession[]>(initialAttendanceSessions);
  const [staffAttendanceList, setStaffAttendanceList] = useState<StaffAttendanceEntry[]>(initialStaffAttendance);

  const addToast = (title: string, message: string, type: 'success' | 'info' | 'warning' | 'error' = 'success') => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    const newToast: ToastNotification = {
      id,
      title,
      message,
      type,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setToasts((prev) => [newToast, ...prev].slice(0, 5));
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const switchRole = (roleName: string) => {
    const clean = (str: string) =>
      (str || '')
        .toLowerCase()
        .replace(/&/g, 'and')
        .replace(/[^a-z0-9]/g, '')
        .trim();

    const targetClean = clean(roleName);

    // 1. Exact role string match
    let target =
      staffList.find((u) => u.role === roleName) ||
      mockUsers.find((u) => u.role === roleName);

    // 2. Cleaned / normalized match (e.g. '&' vs 'and', case insensitive)
    if (!target) {
      target =
        staffList.find((u) => clean(u.role) === targetClean) ||
        mockUsers.find((u) => clean(u.role) === targetClean);
    }

    // 3. Keyword / partial inclusion match
    if (!target) {
      target =
        staffList.find((u) => {
          const uClean = clean(u.role);
          return uClean.includes(targetClean) || targetClean.includes(uClean);
        }) ||
        mockUsers.find((u) => {
          const uClean = clean(u.role);
          return uClean.includes(targetClean) || targetClean.includes(uClean);
        });
    }

    // 4. Fallback for role category keywords
    if (!target) {
      if (targetClean.includes('zakat') || targetClean.includes('welfare') || targetClean.includes('inspector')) {
        target = staffList.find((u) => clean(u.role).includes('zakat')) || mockUsers.find((u) => clean(u.role).includes('zakat'));
      } else if (targetClean.includes('audit') || targetClean.includes('compliance')) {
        target = staffList.find((u) => clean(u.role).includes('audit')) || mockUsers.find((u) => clean(u.role).includes('audit'));
      } else if (targetClean.includes('media') || targetClean.includes('broadcast') || targetClean.includes('it')) {
        target = staffList.find((u) => clean(u.role).includes('media') || clean(u.role).includes('it')) || mockUsers.find((u) => clean(u.role).includes('media'));
      } else if (targetClean.includes('imam') || targetClean.includes('mosque')) {
        target = staffList.find((u) => clean(u.role).includes('imam') || clean(u.role).includes('mosque')) || mockUsers.find((u) => clean(u.role).includes('imam'));
      } else if (targetClean.includes('teacher') || targetClean.includes('muallim')) {
        target = staffList.find((u) => clean(u.role).includes('teacher')) || mockUsers.find((u) => clean(u.role).includes('teacher'));
      } else if (targetClean.includes('ulema') || targetClean.includes('fatwa')) {
        target = staffList.find((u) => clean(u.role).includes('ulema')) || mockUsers.find((u) => clean(u.role).includes('ulema'));
      } else if (targetClean.includes('edu')) {
        target = staffList.find((u) => clean(u.role).includes('education')) || mockUsers.find((u) => clean(u.role).includes('education'));
      } else if (targetClean.includes('fin')) {
        target = staffList.find((u) => clean(u.role).includes('finance')) || mockUsers.find((u) => clean(u.role).includes('finance'));
      }
    }

    if (!target) {
      target = staffList[0];
    }

    setCurrentUser(target);
    addToast('Role Switched (Demo)', `Now acting as ${target.name} (${target.role})`, 'info');
  };

  const addSecurityLog = (log: Omit<SecurityAuditLog, 'id' | 'timestamp'>) => {
    const newLog: SecurityAuditLog = {
      ...log,
      id: `log-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      timestamp: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) + ' ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setSecurityLogs((prev) => [newLog, ...prev]);
  };

  const addStaff = (data: Omit<User, 'id'>): User => {
    const newId = `user-${Date.now()}`;
    const newStaff: User = {
      ...data,
      id: newId,
      status: data.status || 'Active',
      joinedDate: data.joinedDate || new Date().toISOString().split('T')[0],
      lastLogin: 'Never logged in',
    };
    setStaffList((prev) => [newStaff, ...prev]);
    addSecurityLog({
      actorName: currentUser.name,
      actorEmail: currentUser.email,
      actorRole: currentUser.role,
      action: 'Staff Account Created',
      target: `${newStaff.name} (${newStaff.role})`,
      category: 'Staff_Record',
      status: 'Success',
      ipAddress: '197.156.104.22 (Council HQ)',
      details: `Assigned department: ${newStaff.department || 'General'}, access level: ${newStaff.accessLevel || 'Standard'}.`,
    });
    addToast('Staff Provisioned', `${newStaff.name} has been enrolled into ${newStaff.department || 'Council Staff'}.`, 'success');
    return newStaff;
  };

  const updateStaff = (id: string, updates: Partial<User>) => {
    setStaffList((prev) =>
      prev.map((s) => (s.id === id ? { ...s, ...updates } : s))
    );
    if (currentUser.id === id) {
      setCurrentUser((prev) => ({ ...prev, ...updates }));
    }
    addSecurityLog({
      actorName: currentUser.name,
      actorEmail: currentUser.email,
      actorRole: currentUser.role,
      action: 'Staff Record Updated',
      target: `User ID: ${id}`,
      category: 'Staff_Record',
      status: 'Success',
      ipAddress: '197.156.104.22 (Council HQ)',
      details: `Updated attributes: ${Object.keys(updates).join(', ')}.`,
    });
    addToast('Staff Profile Updated', 'Modifications successfully saved.', 'success');
  };

  const deleteStaff = (id: string) => {
    const staff = staffList.find((s) => s.id === id);
    if (!staff) return;
    setStaffList((prev) => prev.filter((s) => s.id !== id));
    addSecurityLog({
      actorName: currentUser.name,
      actorEmail: currentUser.email,
      actorRole: currentUser.role,
      action: 'Staff Account Removed',
      target: `${staff.name} (${staff.role})`,
      category: 'Staff_Record',
      status: 'Warning',
      ipAddress: '197.156.104.22 (Council HQ)',
      details: 'Decommissioned user account and revoked all permissions.',
    });
    addToast('Staff Removed', `${staff.name} has been deleted from active personnel.`, 'info');
  };

  const toggleStaffStatus = (id: string) => {
    setStaffList((prev) =>
      prev.map((s) => {
        if (s.id === id) {
          const nextStatus = s.status === 'Active' ? 'Suspended' : 'Active';
          addSecurityLog({
            actorName: currentUser.name,
            actorEmail: currentUser.email,
            actorRole: currentUser.role,
            action: nextStatus === 'Suspended' ? 'Account Suspended' : 'Account Reinstated',
            target: `${s.name} (${s.email})`,
            category: 'Staff_Record',
            status: nextStatus === 'Suspended' ? 'Warning' : 'Success',
            ipAddress: '197.156.104.22 (Council HQ)',
            details: `Status toggled to ${nextStatus}.`,
          });
          addToast(
            'Security Status Changed',
            `${s.name}'s account is now ${nextStatus.toUpperCase()}.`,
            nextStatus === 'Active' ? 'success' : 'warning'
          );
          return { ...s, status: nextStatus };
        }
        return s;
      })
    );
  };

  const addRole = (data: Omit<RoleDefinition, 'id' | 'createdAt' | 'updatedAt'>): RoleDefinition => {
    const newId = `role-${Date.now()}`;
    const now = new Date().toISOString().split('T')[0];
    const newRole: RoleDefinition = {
      ...data,
      id: newId,
      isSystemRole: false,
      createdAt: now,
      updatedAt: now,
    };
    setRolesList((prev) => [...prev, newRole]);
    addSecurityLog({
      actorName: currentUser.name,
      actorEmail: currentUser.email,
      actorRole: currentUser.role,
      action: 'Custom Role Defined',
      target: `Role: ${newRole.name}`,
      category: 'Role_Change',
      status: 'Success',
      ipAddress: '197.156.104.22 (Council HQ)',
      details: `Created with ${newRole.permissions.length} granular permissions in ${newRole.department}.`,
    });
    addToast('Role Created', `Custom role "${newRole.name}" is now available.`, 'success');
    return newRole;
  };

  const updateRole = (id: string, updates: Partial<RoleDefinition>) => {
    const now = new Date().toISOString().split('T')[0];
    setRolesList((prev) =>
      prev.map((r) => (r.id === id ? { ...r, ...updates, updatedAt: now } : r))
    );
    addSecurityLog({
      actorName: currentUser.name,
      actorEmail: currentUser.email,
      actorRole: currentUser.role,
      action: 'Role Matrix Modified',
      target: `Role ID: ${id}`,
      category: 'Role_Change',
      status: 'Success',
      ipAddress: '197.156.104.22 (Council HQ)',
      details: 'Updated permissions or parameters.',
    });
    addToast('Role Matrix Updated', 'Changes to permission profile saved.', 'success');
  };

  const deleteRole = (id: string) => {
    const role = rolesList.find((r) => r.id === id);
    if (!role) return;
    if (role.isSystemRole) {
      addToast('Operation Denied', 'Protected system roles cannot be deleted.', 'error');
      return;
    }
    setRolesList((prev) => prev.filter((r) => r.id !== id));
    addSecurityLog({
      actorName: currentUser.name,
      actorEmail: currentUser.email,
      actorRole: currentUser.role,
      action: 'Custom Role Deleted',
      target: `Role: ${role.name}`,
      category: 'Role_Change',
      status: 'Warning',
      ipAddress: '197.156.104.22 (Council HQ)',
      details: 'Custom role definition removed from council RBAC matrix.',
    });
    addToast('Role Deleted', `"${role.name}" has been removed.`, 'info');
  };

  const addMosque = (data: Omit<Mosque, 'id'>) => {
    const newId = `mosque-${Date.now()}`;
    const newMosque: Mosque = { ...data, id: newId };
    setMosques((prev) => [newMosque, ...prev]);
    addToast('Mosque Registered', `${newMosque.name} has been added to the council registry.`, 'success');
  };

  const updateMosque = (id: string, updates: Partial<Mosque>) => {
    setMosques((prev) => prev.map((m) => (m.id === id ? { ...m, ...updates } : m)));
    addToast('Mosque Updated', 'Changes have been saved to local council state.', 'success');
  };

  const addMadrasa = (data: Omit<Madrasa, 'id'>) => {
    const newId = `madrasa-${Date.now()}`;
    const newMadrasa: Madrasa = { ...data, id: newId };
    setMadrasas((prev) => [newMadrasa, ...prev]);
    addToast('Madrasa Enrolled', `${newMadrasa.name} is now listed in the council directory.`, 'success');
  };

  const addStudent = (data: Omit<Student, 'id'>) => {
    const newId = `student-${Date.now()}`;
    const newStudent: Student = { ...data, id: newId };
    setStudents((prev) => [newStudent, ...prev]);
    addToast('Student Enrolled', `${newStudent.name} registered in ${newStudent.madrasaName}.`, 'success');
  };

  const updateStudent = (id: string, updates: Partial<Student>) => {
    setStudents((prev) => prev.map((s) => (s.id === id ? { ...s, ...updates } : s)));
    addToast('Student Record Updated', 'Hifz progress and details updated successfully.', 'success');
  };

  const addTransaction = (data: Omit<Transaction, 'id' | 'referenceNo'>) => {
    const id = `tx-${Date.now()}`;
    const ref = `TXN-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const newTx: Transaction = {
      ...data,
      id,
      referenceNo: ref,
    };
    setTransactions((prev) => [newTx, ...prev]);

    // Update funds
    if (data.type === 'Income') {
      setFunds((prev) =>
        prev.map((f) => (f.id === data.fundId ? { ...f, allocatedETB: f.allocatedETB + data.amountETB } : f))
      );
    } else if (data.type === 'Expense' || data.type === 'Disbursement') {
      setFunds((prev) =>
        prev.map((f) => (f.id === data.fundId ? { ...f, disbursedETB: f.disbursedETB + data.amountETB } : f))
      );
    }

    addToast('Transaction Recorded', `${ref}: ${data.amountETB.toLocaleString()} ETB allocated to ${data.fundName}`, 'success');
  };

  const addDonation = (data: Omit<Donation, 'id' | 'receiptNo' | 'date' | 'status' | 'certificateIssued'>) => {
    const id = `don-${Date.now()}`;
    const receiptNo = `REC-2026-${Math.floor(5000 + Math.random() * 4999)}`;
    const today = new Date().toISOString().split('T')[0];
    const newDonation: Donation = {
      ...data,
      id,
      receiptNo,
      date: today,
      status: 'Completed',
      certificateIssued: true,
    };
    setDonations((prev) => [newDonation, ...prev]);

    // Update fund balance
    setFunds((prev) =>
      prev.map((f) => (f.id === data.fundId ? { ...f, allocatedETB: f.allocatedETB + data.amountETB } : f))
    );

    // Record as income transaction
    const txId = `tx-${Date.now()}`;
    const ref = `TXN-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const newTx: Transaction = {
      id: txId,
      referenceNo: ref,
      date: today,
      type: 'Income',
      fundId: data.fundId,
      fundName: data.fundName,
      category: 'Public Donation',
      amountETB: data.amountETB,
      description: `Donation from ${data.isAnonymous ? 'Anonymous Donor' : data.donorName} (${receiptNo})`,
      paymentMethod: data.paymentMethod,
      status: 'Completed',
      recordedBy: 'Public Online Portal',
    };
    setTransactions((prev) => [newTx, ...prev]);

    addToast('Donation Received! Jazakallahu Khayran', `Receipt #${receiptNo} generated for ${data.amountETB.toLocaleString()} ETB.`, 'success');
    return newDonation;
  };

  const updateDonation = (id: string, updates: Partial<Donation>) => {
    setDonations((prev) => prev.map((d) => (d.id === id ? { ...d, ...updates } : d)));
    addToast('Donation Updated', 'The donation record has been updated.', 'info');
  };

  const deleteDonation = (id: string) => {
    setDonations((prev) => prev.filter((d) => d.id !== id));
    addToast('Donation Removed', 'The donation entry has been removed from the registry.', 'info');
  };

  const addZakatDistribution = (item: Omit<ZakatBeneficiaryDistribution, 'id'>): ZakatBeneficiaryDistribution => {
    const id = `zdis-${Date.now()}`;
    const newEntry: ZakatBeneficiaryDistribution = { ...item, id };
    setZakatDistributions((prev) => [newEntry, ...prev]);

    // Also record transaction
    addTransaction({
      date: newEntry.lastDisbursalDate || new Date().toISOString().split('T')[0],
      type: 'Disbursement',
      fundId: 'fund-4',
      fundName: 'Zakat & Social Welfare Fund',
      category: `Zakat: ${newEntry.asnafCategory}`,
      amountETB: newEntry.totalDisbursedETB,
      description: `Disbursed to ${newEntry.beneficiaryCount} beneficiaries in ${newEntry.woredaDistrict}`,
      paymentMethod: 'Bank Transfer',
      status: 'Completed',
      recordedBy: newEntry.leadOfficer || currentUser.name,
    });

    addToast('Zakat Disbursed', `Disbursed ${newEntry.totalDisbursedETB.toLocaleString()} ETB for ${newEntry.asnafCategory}.`, 'success');
    return newEntry;
  };

  const updateZakatDistribution = (id: string, updates: Partial<ZakatBeneficiaryDistribution>) => {
    setZakatDistributions((prev) => prev.map((z) => (z.id === id ? { ...z, ...updates } : z)));
    addToast('Zakat Distribution Updated', 'Beneficiary record updated.', 'info');
  };

  const updateExpenseStatus = (id: string, status: ExpenseApproval['status'], comment?: string) => {
    setExpenseApprovals((prev) =>
      prev.map((exp) => {
        if (exp.id === id) {
          const updatedComments = comment ? [...(exp.comments || []), comment] : exp.comments;
          return { ...exp, status, comments: updatedComments };
        }
        return exp;
      })
    );

    // If disbursed, create a disbursement transaction
    const target = expenseApprovals.find((e) => e.id === id);
    if (target && status === 'Disbursed') {
      addTransaction({
        date: new Date().toISOString().split('T')[0],
        type: 'Expense',
        fundId: target.fundId,
        fundName: target.fundName,
        category: target.category,
        amountETB: target.amountETB,
        description: `Disbursed for: ${target.title} (${target.requestNo})`,
        paymentMethod: 'Bank Transfer',
        status: 'Completed',
        recordedBy: currentUser.name,
      });
    }

    addToast('Expense Request Updated', `Status changed to: "${status}"`, 'info');
  };

  const submitServiceRequest = (req: Omit<ServiceRequest, 'id' | 'trackingNo' | 'submissionDate' | 'status' | 'assignedOfficer'>) => {
    const id = `req-${Date.now()}`;
    const trackingNo = `REQ-2026-00${Math.floor(500 + Math.random() * 499)}`;
    const today = new Date().toISOString().split('T')[0];
    const newReq: ServiceRequest = {
      ...req,
      id,
      trackingNo,
      submissionDate: today,
      status: 'Submitted',
      assignedOfficer: 'Pending Council Assignment',
    };
    setServiceRequests((prev) => [newReq, ...prev]);
    addToast('Service Application Submitted', `Tracking #${trackingNo} generated. Council desk will review within 2 business days.`, 'success');
    return newReq;
  };

  const updateServiceRequestStatus = (id: string, status: ServiceRequest['status'], officer?: string) => {
    setServiceRequests((prev) =>
      prev.map((r) => {
        if (r.id === id) {
          return {
            ...r,
            status,
            assignedOfficer: officer || r.assignedOfficer,
          };
        }
        return r;
      })
    );
    addToast('Service Request Updated', `Status updated to ${status}.`, 'info');
  };

  const setStudentAttendance = (studentId: string, status: 'Present' | 'Absent' | 'Late' | 'Excused') => {
    setAttendanceMap((prev) => ({ ...prev, [studentId]: status }));
  };

  const saveDailyAttendance = (madrasaId: string, date: string) => {
    addToast('Attendance Saved', `Daily attendance register for ${date} recorded and synchronized.`, 'success');
  };

  const saveDailyAttendanceSession = (session: DailyAttendanceSession) => {
    setDailyAttendanceSessions((prev) => {
      const exists = prev.findIndex((s) => s.id === session.id);
      if (exists >= 0) {
        const copy = [...prev];
        copy[exists] = session;
        return copy;
      }
      return [session, ...prev];
    });

    // Also update individual students' daily attendance in students state
    setStudents((prev) =>
      prev.map((st) => {
        const entry = session.entries.find((e) => e.studentId === st.id);
        if (entry) {
          return {
            ...st,
            dailyAttendance: entry.status,
          };
        }
        return st;
      })
    );

    addToast(
      'Daily Attendance Sheet Saved',
      `Roll-call for ${session.className} (${session.madrasaName}) logged with ${session.presentCount}/${session.totalStudents} present (${session.attendanceRate}%).`,
      'success'
    );
  };

  const updateStudentAttendanceEntry = (
    sessionId: string,
    studentId: string,
    updates: Partial<StudentAttendanceEntry>
  ) => {
    setDailyAttendanceSessions((prev) =>
      prev.map((session) => {
        if (session.id === sessionId) {
          const updatedEntries = session.entries.map((entry) =>
            entry.studentId === studentId ? { ...entry, ...updates } : entry
          );
          const present = updatedEntries.filter((e) => e.status === 'Present').length;
          const absent = updatedEntries.filter((e) => e.status === 'Absent').length;
          const late = updatedEntries.filter((e) => e.status === 'Late').length;
          const excused = updatedEntries.filter((e) => e.status === 'Excused').length;
          const total = updatedEntries.length;
          const rate = total > 0 ? Math.round(((present + late * 0.5) / total) * 1000) / 10 : 0;

          return {
            ...session,
            entries: updatedEntries,
            presentCount: present,
            absentCount: absent,
            lateCount: late,
            excusedCount: excused,
            attendanceRate: rate,
          };
        }
        return session;
      })
    );
  };

  const batchMarkAttendance = (sessionId: string, status: AttendanceStatus) => {
    setDailyAttendanceSessions((prev) =>
      prev.map((session) => {
        if (session.id === sessionId) {
          const nowTime = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
          const updatedEntries = session.entries.map((entry) => ({
            ...entry,
            status,
            arrivalTime: status === 'Present' ? entry.arrivalTime || nowTime : undefined,
            lateMinutes: status === 'Late' ? entry.lateMinutes || 15 : undefined,
          }));

          const present = updatedEntries.filter((e) => e.status === 'Present').length;
          const absent = updatedEntries.filter((e) => e.status === 'Absent').length;
          const late = updatedEntries.filter((e) => e.status === 'Late').length;
          const excused = updatedEntries.filter((e) => e.status === 'Excused').length;
          const total = updatedEntries.length;
          const rate = total > 0 ? Math.round(((present + late * 0.5) / total) * 1000) / 10 : 0;

          return {
            ...session,
            entries: updatedEntries,
            presentCount: present,
            absentCount: absent,
            lateCount: late,
            excusedCount: excused,
            attendanceRate: rate,
          };
        }
        return session;
      })
    );
    addToast('Batch Status Applied', `All students in session marked as "${status}".`, 'info');
  };

  const sendAbsenceSmsAlerts = async (
    sessionId: string,
    filter: 'Absent' | 'Late' | 'All' = 'Absent'
  ): Promise<{ sentCount: number; costETB: number }> => {
    const session = dailyAttendanceSessions.find((s) => s.id === sessionId);
    if (!session) return { sentCount: 0, costETB: 0 };

    const targetStudents = session.entries.filter((e) => {
      if (filter === 'Absent') return e.status === 'Absent';
      if (filter === 'Late') return e.status === 'Late';
      return e.status === 'Absent' || e.status === 'Late';
    });

    if (targetStudents.length === 0) {
      addToast('No Recipients Found', `No students match the "${filter}" filter in this session.`, 'info');
      return { sentCount: 0, costETB: 0 };
    }

    const costPerMsg = 0.35; // ETB per Ethio Telecom SMS
    const totalCost = Math.round(targetStudents.length * costPerMsg * 100) / 100;

    // Dispatch via Gateway
    await dispatchMessage({
      title: `Daily Absence Notice: ${session.className}`,
      category: 'sabaq_alert',
      channel: 'sms',
      senderId: currentUser.id,
      recipientTarget: `${targetStudents.length} Parent(s) (${session.madrasaName})`,
      recipientCount: targetStudents.length,
      content: `Assalamu Alaikum. This is an official notice from ${session.madrasaName} (Jimma Zone Islamic Affairs Council). Your child was recorded as ABSENT for the ${session.shift} session on ${session.hijriDate} (${session.date}). For inquiries: ${currentUser.phone || '+251 47 111 8290'}.`,
      costETB: totalCost,
    });

    // Mark entries as notified
    setDailyAttendanceSessions((prev) =>
      prev.map((s) => {
        if (s.id === sessionId) {
          const notifiedEntries = s.entries.map((entry) => {
            const isTarget = targetStudents.some((ts) => ts.studentId === entry.studentId);
            return isTarget ? { ...entry, parentNotified: true } : entry;
          });
          return { ...s, entries: notifiedEntries };
        }
        return s;
      })
    );

    addToast(
      'SMS Absence Alerts Dispatched',
      `Sent ${targetStudents.length} automated Ethio Telecom SMS notifications to guardians. Total cost: ${totalCost} ETB.`,
      'success'
    );

    return { sentCount: targetStudents.length, costETB: totalCost };
  };

  const updateStaffAttendanceRecord = (id: string, updates: Partial<StaffAttendanceEntry>) => {
    setStaffAttendanceList((prev) =>
      prev.map((staff) => (staff.id === id ? { ...staff, ...updates } : staff))
    );
    addToast('Staff Attendance Updated', 'Council daily sign-in register updated.', 'info');
  };

  const addStaffAttendanceRecord = (entry: Omit<StaffAttendanceEntry, 'id'>): StaffAttendanceEntry => {
    const newId = `staff-att-${Date.now()}`;
    const newRecord: StaffAttendanceEntry = {
      ...entry,
      id: newId,
    };
    setStaffAttendanceList((prev) => [newRecord, ...prev]);
    addToast('Staff Attendance Logged', `${entry.staffName} marked as ${entry.status}.`, 'success');
    return newRecord;
  };

  const [gatewayStats, setGatewayStats] = useState<GatewayChannelStats>(initialGatewayStats);
  const [dispatchHistory, setDispatchHistory] = useState<DispatchLogItem[]>(mockDispatchHistory);

  const updateStudentProgress = (id: string, updates: any) => {
    setStudents((prev) =>
      prev.map((s) => {
        if (s.id === id) {
          const currentHifz = s.hifzStatus || { sabaq: '', sabqi: '', manzil: '' };
          const newHifz = {
            sabaq: updates.sabaqSurah
              ? `${updates.sabaqSurah}${updates.sabaqAyahStart ? `: ${updates.sabaqAyahStart}-${updates.sabaqAyahEnd}` : ''}`
              : currentHifz.sabaq,
            sabqi: updates.sabaqiJuz ? `Juz ${updates.sabaqiJuz}` : currentHifz.sabqi,
            manzil: updates.manzilJuz || currentHifz.manzil,
          };
          return {
            ...s,
            ...updates,
            hifzStatus: newHifz,
            quranJuzCompleted: updates.quranJuzCompleted !== undefined ? updates.quranJuzCompleted : s.quranJuzCompleted,
            tajweedRating: updates.tajweedRating || s.tajweedRating,
            guardianName: updates.guardianName || s.parentName,
            guardianPhone: updates.guardianPhone || s.parentPhone,
          };
        }
        return s;
      })
    );
  };

  const dispatchMessage = async (
    data: Omit<DispatchLogItem, 'id' | 'timestamp' | 'status' | 'gatewayResponseCode' | 'deliveryRate'>
  ): Promise<DispatchLogItem> => {
    const id = `disp-${Date.now()}`;
    const timestamp = new Date().toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

    const isSms = data.channel === 'sms' || data.channel === 'hybrid';
    const isTelegram = data.channel === 'telegram' || data.channel === 'hybrid';

    const gatewayCode = isSms && isTelegram
      ? 'ETHIO_SMS_BATCH_OK_200 / TG_200_OK'
      : isSms
      ? 'ETHIO_SMS_DELIVRD_200'
      : 'TELEGRAM_BOT_MSG_OK_200';

    const newItem: DispatchLogItem = {
      ...data,
      id,
      timestamp,
      status: 'delivered',
      gatewayResponseCode: gatewayCode,
      deliveryRate: 99.8,
    };

    setDispatchHistory((prev) => [newItem, ...prev]);

    // Update channel stats
    setGatewayStats((prev) => {
      let newBalance = prev.smsBalanceETB;
      let newSmsSent = prev.smsTotalSent;
      let newTgSent = prev.telegramMessagesSent;

      if (isSms) {
        newBalance = Math.max(0, newBalance - data.costETB);
        newSmsSent += data.recipientCount;
      }
      if (isTelegram) {
        newTgSent += 1;
      }

      return {
        ...prev,
        smsBalanceETB: Math.round(newBalance * 100) / 100,
        smsTotalSent: newSmsSent,
        telegramMessagesSent: newTgSent,
      };
    });

    addToast(
      'Gateway Dispatch Successful',
      `${data.title} delivered to ${data.recipientCount.toLocaleString()} recipient(s) via ${data.channel.toUpperCase()}.`,
      'success'
    );

    return newItem;
  };

  const topUpSmsBalance = (amountETB: number) => {
    setGatewayStats((prev) => ({
      ...prev,
      smsBalanceETB: prev.smsBalanceETB + amountETB,
    }));
    addToast(
      'Ethio Telecom SMS Gateway Refilled',
      `Recharged ${amountETB.toLocaleString()} ETB via Telebirr Corporate Merchant API.`,
      'success'
    );
  };

  const clearDispatchHistory = () => {
    setDispatchHistory([]);
    addToast('Audit Logs Cleared', 'Historical dispatch records reset.', 'info');
  };

  const addEvent = (data: Omit<CouncilEvent, 'id'>) => {
    const newId = `event-${Date.now()}`;
    const newEvent: CouncilEvent = {
      ...data,
      id: newId,
      status: data.status || 'Upcoming',
      attendeesCount: data.attendeesCount || 0,
    };
    setEvents((prev) => [newEvent, ...prev]);
    addToast('Council Gathering Scheduled', `"${newEvent.title}" has been published to the community calendar.`, 'success');
    return newEvent;
  };

  const updateEvent = (id: string, updates: Partial<CouncilEvent>) => {
    setEvents((prev) => prev.map((e) => (e.id === id ? { ...e, ...updates } : e)));
    addToast('Program Updated', 'Event logistics, schedule, and capacity updated.', 'success');
  };

  const deleteEvent = (id: string) => {
    setEvents((prev) => prev.filter((e) => e.id !== id));
    addToast('Program Removed', 'Event removed from active schedule.', 'info');
  };

  const registerForEvent = (
    data: Omit<EventRegistration, 'id' | 'passNumber' | 'status' | 'createdAt'>
  ): EventRegistration => {
    const id = `reg-${Date.now()}`;
    const passNumber = `JIC-PASS-${Math.floor(1000 + Math.random() * 8999)}`;
    const today = new Date().toISOString().split('T')[0];

    const newReg: EventRegistration = {
      ...data,
      id,
      passNumber,
      status: 'Confirmed',
      createdAt: today,
    };

    setEventRegistrations((prev) => [newReg, ...prev]);

    // Increase attendee count on the corresponding event
    setEvents((prev) =>
      prev.map((e) =>
        e.id === data.eventId
          ? { ...e, attendeesCount: Math.min(e.maxCapacity, (e.attendeesCount || 0) + (data.attendeesCount || 1)) }
          : e
      )
    );

    addToast(
      'Registration Confirmed! Barakallahu Feekum',
      `Official Pass #${passNumber} issued for ${data.fullName}.`,
      'success'
    );
    return newReg;
  };

  const cancelRegistration = (regId: string) => {
    const reg = eventRegistrations.find((r) => r.id === regId);
    if (reg) {
      setEvents((prev) =>
        prev.map((e) =>
          e.id === reg.eventId
            ? { ...e, attendeesCount: Math.max(0, (e.attendeesCount || 0) - reg.attendeesCount) }
            : e
        )
      );
    }
    setEventRegistrations((prev) => prev.map((r) => (r.id === regId ? { ...r, status: 'Cancelled' } : r)));
    addToast('RSVP Cancelled', 'Registration status updated.', 'info');
  };

  const checkInAttendee = (regId: string) => {
    setEventRegistrations((prev) =>
      prev.map((r) => (r.id === regId ? { ...r, status: 'Checked-In' } : r))
    );
    addToast('Attendee Checked In', 'Pass verified at venue entrance.', 'success');
  };

  // Resource Management Handlers
  const addResource = (
    data: Omit<CouncilResource, 'id' | 'uploadDate' | 'downloadsCount'>
  ): CouncilResource => {
    const newId = `res-${Date.now()}`;
    const today = new Date().toISOString().split('T')[0];
    const newResource: CouncilResource = {
      ...data,
      id: newId,
      uploadDate: today,
      downloadsCount: 0,
    };
    setResources((prev) => [newResource, ...prev]);
    addToast(
      'Resource Published Successfully',
      `"${newResource.title}" is now available in the resource repository.`,
      'success'
    );
    return newResource;
  };

  const updateResource = (id: string, updates: Partial<CouncilResource>) => {
    setResources((prev) =>
      prev.map((r) => (r.id === id ? { ...r, ...updates } : r))
    );
    addToast('Resource Updated', 'The material details and settings have been updated.', 'info');
  };

  const deleteResource = (id: string) => {
    setResources((prev) => prev.filter((r) => r.id !== id));
    addToast('Resource Deleted', 'The selected item was removed from the repository.', 'info');
  };

  const incrementResourceDownload = (id: string) => {
    setResources((prev) =>
      prev.map((r) => (r.id === id ? { ...r, downloadsCount: (r.downloadsCount || 0) + 1 } : r))
    );
  };

  // Independent Audit & Shariah Compliance Methods
  const addAuditDirective = (directive: Omit<AuditDirective, 'id' | 'createdDate'>): AuditDirective => {
    const newId = `AUD-2026-${String(auditDirectives.length + 1).padStart(3, '0')}`;
    const today = new Date().toISOString().split('T')[0];
    const newDirective: AuditDirective = {
      ...directive,
      id: newId,
      createdDate: today,
    };
    setAuditDirectives((prev) => [newDirective, ...prev]);
    addSecurityLog({
      action: 'Create Audit Inquiry Flag',
      actorName: currentUser.name,
      actorEmail: currentUser.email,
      actorRole: currentUser.role,
      target: newId,
      details: `Opened audit inquiry [${newDirective.severity}] for ${newDirective.targetEntity}: "${newDirective.title}"`,
      category: 'Finance_Security',
      status: 'Success',
      ipAddress: '192.168.1.1',
    });
    addToast(
      'Audit Directive Attached',
      `Audit inquiry ${newId} assigned to ${newDirective.assignedAuditor}.`,
      'info'
    );
    return newDirective;
  };

  const updateAuditDirective = (id: string, updates: Partial<AuditDirective>) => {
    setAuditDirectives((prev) =>
      prev.map((d) => (d.id === id ? { ...d, ...updates } : d))
    );
    addToast('Audit Record Updated', 'Audit directive parameters updated successfully.', 'info');
  };

  const resolveAuditDirective = (id: string, resolutionNote: string) => {
    const today = new Date().toISOString().split('T')[0];
    setAuditDirectives((prev) =>
      prev.map((d) =>
        d.id === id
          ? {
              ...d,
              status: 'Resolved',
              resolvedDate: today,
              resolutionNote,
            }
          : d
      )
    );
    addSecurityLog({
      action: 'Resolve Audit Directive',
      actorName: currentUser.name,
      actorEmail: currentUser.email,
      actorRole: currentUser.role,
      target: id,
      details: `Auditor cleared inquiry ${id}. Resolution Note: "${resolutionNote}"`,
      category: 'Finance_Security',
      status: 'Success',
      ipAddress: '192.168.1.1',
    });
    addToast('Audit Finding Resolved', `Audit directive ${id} marked as resolved and sealed.`, 'success');
  };

  const escalateAuditDirective = (id: string) => {
    setAuditDirectives((prev) =>
      prev.map((d) => (d.id === id ? { ...d, status: 'Escalated to Shura' } : d))
    );
    addSecurityLog({
      action: 'Escalate Audit to Shura Council',
      actorName: currentUser.name,
      actorEmail: currentUser.email,
      actorRole: currentUser.role,
      target: id,
      details: `Escalated compliance discrepancy ${id} to Executive Shura Council for emergency ruling.`,
      category: 'Finance_Security',
      status: 'Warning',
      ipAddress: '192.168.1.1',
    });
    addToast(
      'Escalated to Shura Council',
      `Audit inquiry ${id} formally submitted to the Supreme Executive Shura.`,
      'warning'
    );
  };

  const deleteAuditDirective = (id: string) => {
    setAuditDirectives((prev) => prev.filter((d) => d.id !== id));
    addToast('Directive Removed', `Audit record ${id} removed from active review.`, 'info');
  };

  const updateChecklistStatus = (id: string, status: AuditChecklistItem['status'], note?: string) => {
    const today = new Date().toISOString().split('T')[0];
    setAuditChecklist((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              status,
              lastVerified: today,
              verifiedBy: currentUser.name,
              evidenceNote: note || item.evidenceNote,
            }
          : item
      )
    );
    addToast('Governance Checklist Updated', `Compliance standard ${id} updated to [${status}].`, 'success');
  };

  const runForensicReconciliation = async (): Promise<{
    verifiedBlocks: number;
    verifiedTxs: number;
    varianceETB: number;
    hash: string;
  }> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const totalTxCount = transactions.length + 1378;
        const digest = 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855';
        addSecurityLog({
          action: 'Cryptographic Ledger Reconciliation',
          actorName: currentUser.name,
          actorEmail: currentUser.email,
          actorRole: currentUser.role,
          target: 'Global General Ledger & Zakat Sub-Ledger',
          details: `Reconciled ${ledgerBlocks.length} cryptographic blocks (${totalTxCount} transactions). Variance: 0.00 ETB. Digest SHA-256 match 100%.`,
          category: 'Finance_Security',
          status: 'Success',
          ipAddress: '192.168.1.1',
        });
        resolve({
          verifiedBlocks: ledgerBlocks.length,
          verifiedTxs: totalTxCount,
          varianceETB: 0.0,
          hash: digest,
        });
      }, 1500);
    });
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        switchRole,
        allUsers: staffList,
        staffList,
        addStaff,
        updateStaff,
        deleteStaff,
        toggleStaffStatus,
        rolesList,
        addRole,
        updateRole,
        deleteRole,
        permissionCategories,
        securityLogs,
        addSecurityLog,
        mosques,
        addMosque,
        updateMosque,
        madrasas,
        addMadrasa,
        students,
        addStudent,
        updateStudent,
        updateStudentProgress,
        teachers,
        ulema,
        funds,
        transactions,
        addTransaction,
        donations,
        addDonation,
        updateDonation,
        deleteDonation,
        zakatDistributions,
        addZakatDistribution,
        updateZakatDistribution,
        expenseApprovals,
        updateExpenseStatus,
        publicServices: mockPublicServices,
        serviceRequests,
        submitServiceRequest,
        updateServiceRequestStatus,
        events,
        addEvent,
        updateEvent,
        deleteEvent,
        eventRegistrations,
        registerForEvent,
        cancelRegistration,
        checkInAttendee,
        announcements,
        documents,
        resources,
        addResource,
        updateResource,
        deleteResource,
        incrementResourceDownload,
        gatewayStats,
        dispatchHistory,
        dispatchMessage,
        topUpSmsBalance,
        clearDispatchHistory,
        attendanceMap,
        setStudentAttendance,
        saveDailyAttendance,
        dailyAttendanceSessions,
        staffAttendanceList,
        saveDailyAttendanceSession,
        updateStudentAttendanceEntry,
        batchMarkAttendance,
        sendAbsenceSmsAlerts,
        updateStaffAttendanceRecord,
        addStaffAttendanceRecord,
        auditDirectives,
        addAuditDirective,
        updateAuditDirective,
        resolveAuditDirective,
        escalateAuditDirective,
        deleteAuditDirective,
        auditChecklist,
        updateChecklistStatus,
        ledgerBlocks,
        runForensicReconciliation,
        toasts,
        addToast,
        removeToast,
        isSearchOpen,
        setIsSearchOpen,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
