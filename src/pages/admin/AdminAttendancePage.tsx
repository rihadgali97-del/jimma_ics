import React, { useState, useMemo } from 'react';
import {
  CalendarCheck2,
  Users,
  Search,
  Printer,
  Download,
  MessageSquare,
  Sparkles,
  Save,
  CheckCircle2,
  Clock,
  BookOpen,
  Building,
  ChevronRight,
  ShieldCheck,
  Calendar,
  Layers,
  History,
  Send,
  AlertTriangle,
  UserCheck,
  ArrowRight,
  RefreshCw,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { AttendanceStatsBar } from '../../components/attendance/AttendanceStatsBar';
import { AttendanceSheetTable } from '../../components/attendance/AttendanceSheetTable';
import { AbsenceSmsModal } from '../../components/attendance/AbsenceSmsModal';
import { PrintableAttendanceSheet } from '../../components/attendance/PrintableAttendanceSheet';
import { StaffAttendanceTab } from '../../components/attendance/StaffAttendanceTab';
import { MonthlyAttendanceRegister } from '../../components/attendance/MonthlyAttendanceRegister';
import { DailyAttendanceSession, StudentAttendanceEntry, AttendanceStatus } from '../../types';

export const AdminAttendancePage: React.FC = () => {
  const {
    madrasas,
    students,
    teachers,
    dailyAttendanceSessions,
    saveDailyAttendanceSession,
    updateStudentAttendanceEntry,
    batchMarkAttendance,
    addToast,
    currentUser,
  } = useApp();

  // Active view tab: 'daily' | 'monthly' | 'staff' | 'history'
  const [activeTab, setActiveTab] = useState<'daily' | 'monthly' | 'staff' | 'history'>('daily');

  // Selected Date & Shift
  const [selectedDate, setSelectedDate] = useState('2026-08-31');
  const [selectedHijri, setSelectedHijri] = useState('18 Safar 1448 AH');
  const [selectedShift, setSelectedShift] = useState<'Morning' | 'Afternoon' | 'Evening' | 'Weekend'>('Morning');

  // Selected Madrasa and Class
  const [selectedMadrasaId, setSelectedMadrasaId] = useState<string>(
    dailyAttendanceSessions[0]?.madrasaId || madrasas[0]?.id || 'madrasa-1'
  );
  const [selectedClass, setSelectedClass] = useState<string>(
    dailyAttendanceSessions[0]?.className || 'Level 3 - Hifz Track'
  );

  // Filters & Search
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');

  // Modals state
  const [isSmsModalOpen, setIsSmsModalOpen] = useState(false);
  const [singleSmsStudent, setSingleSmsStudent] = useState<StudentAttendanceEntry | null>(null);
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);

  const selectedMadrasa = madrasas.find((m) => m.id === selectedMadrasaId) || madrasas[0];

  // Available classes for selected madrasa
  const availableClasses = useMemo(() => {
    const fromSessions = dailyAttendanceSessions
      .filter((s) => s.madrasaId === selectedMadrasaId)
      .map((s) => s.className);
    const fromStudents = students
      .filter((s) => s.madrasaId === selectedMadrasaId)
      .map((s) => s.className);
    const combined = Array.from(new Set([...fromSessions, ...fromStudents]));
    return combined.length > 0 ? combined : ['Level 1 (Tahfeez)', 'Level 2 (Tajweed)', 'Level 3 (Alimiyyah)'];
  }, [dailyAttendanceSessions, students, selectedMadrasaId]);

  // Find or create current active session
  const currentSession = useMemo(() => {
    const existing = dailyAttendanceSessions.find(
      (s) =>
        s.date === selectedDate &&
        s.madrasaId === selectedMadrasaId &&
        s.className === selectedClass &&
        s.shift === selectedShift
    );

    if (existing) return existing;

    // Build session dynamically from matching students
    const matchingStudents = students.filter(
      (s) => s.madrasaId === selectedMadrasaId && (s.className === selectedClass || !selectedClass)
    );

    const targetStudents = matchingStudents.length > 0 ? matchingStudents : students.slice(0, 10);
    const teacher = teachers.find((t) => t.madrasaId === selectedMadrasaId) || teachers[0];

    const newEntries: StudentAttendanceEntry[] = targetStudents.map((st, idx) => ({
      studentId: st.id,
      studentName: st.name,
      arabicName: st.arabicName,
      gender: st.gender,
      age: st.age,
      guardianName: st.guardianName || st.parentName || 'Guardian',
      guardianPhone: st.guardianPhone || st.parentPhone || '+251 91 000 0000',
      status: idx % 11 === 0 ? 'Absent' : idx % 17 === 0 ? 'Late' : 'Present',
      arrivalTime: idx % 17 === 0 ? '08:20 AM' : '07:45 AM',
      lateMinutes: idx % 17 === 0 ? 20 : undefined,
      sabaqRecited: idx % 11 !== 0,
      sabaqRating: idx % 5 === 0 ? 'Excellent' : 'Very Good',
      currentLesson: st.hifzStatus?.sabaq || 'Surah Al-Baqarah: 1-25',
      absenceReason: idx % 11 === 0 ? 'Unexcused' : undefined,
      parentNotified: false,
      notes: '',
    }));

    const present = newEntries.filter((e) => e.status === 'Present').length;
    const absent = newEntries.filter((e) => e.status === 'Absent').length;
    const late = newEntries.filter((e) => e.status === 'Late').length;
    const excused = newEntries.filter((e) => e.status === 'Excused').length;
    const total = newEntries.length;
    const rate = total > 0 ? Math.round(((present + late * 0.5) / total) * 1000) / 10 : 0;

    const dynamicSession: DailyAttendanceSession = {
      id: `session-${selectedDate.replace(/-/g, '')}-${selectedMadrasaId}-${selectedClass.replace(/\s+/g, '-').toLowerCase()}`,
      date: selectedDate,
      hijriDate: selectedHijri,
      madrasaId: selectedMadrasaId,
      madrasaName: selectedMadrasa?.name || 'Madrasa',
      className: selectedClass,
      teacherId: teacher?.id || 'teacher-1',
      teacherName: teacher?.name || 'Ustadh Yusuf Ali Al-Jimmawi',
      shift: selectedShift,
      totalStudents: total,
      presentCount: present,
      absentCount: absent,
      lateCount: late,
      excusedCount: excused,
      attendanceRate: rate,
      status: 'Draft',
      recordedBy: currentUser.name,
      submittedAt: `${selectedDate} 08:30 AM`,
      notes: 'Daily Tahfeez & Tajweed recitation roll-call.',
      entries: newEntries,
    };

    return dynamicSession;
  }, [
    dailyAttendanceSessions,
    selectedDate,
    selectedHijri,
    selectedMadrasaId,
    selectedClass,
    selectedShift,
    students,
    teachers,
    selectedMadrasa,
    currentUser,
  ]);

  const handleUpdateEntry = (studentId: string, updates: Partial<StudentAttendanceEntry>) => {
    // If current session exists in AppContext, update it
    const existing = dailyAttendanceSessions.find((s) => s.id === currentSession.id);
    if (!existing) {
      // Save initial then update
      const initial = { ...currentSession };
      saveDailyAttendanceSession(initial);
    }
    updateStudentAttendanceEntry(currentSession.id, studentId, updates);
  };

  const handleBatchMark = (status: AttendanceStatus) => {
    const existing = dailyAttendanceSessions.find((s) => s.id === currentSession.id);
    if (!existing) {
      saveDailyAttendanceSession(currentSession);
    }
    batchMarkAttendance(currentSession.id, status);
  };

  const handleSaveAndSubmit = () => {
    saveDailyAttendanceSession({
      ...currentSession,
      status: 'Verified by Supervisor',
      submittedAt: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
    });
  };

  const handleOpenSingleSms = (entry: StudentAttendanceEntry) => {
    setSingleSmsStudent(entry);
    setIsSmsModalOpen(true);
  };

  const handleOpenBatchSms = () => {
    setSingleSmsStudent(null);
    setIsSmsModalOpen(true);
  };

  const unnotifiedAbsenteesCount = currentSession.entries.filter(
    (e) => e.status === 'Absent' && !e.parentNotified
  ).length;

  const exportDailyCsv = () => {
    let csv = `Student ID,Student Name,Arabic Name,Gender,Status,Arrival Time,Late Minutes,Sabaq Recited,Sabaq Rating,Current Lesson,Absence Reason,Guardian,Phone,SMS Sent,Notes\n`;
    currentSession.entries.forEach((e) => {
      csv += `"${e.studentId}","${e.studentName}","${e.arabicName || ''}","${e.gender}","${e.status}","${e.arrivalTime || ''}","${e.lateMinutes || 0}","${e.sabaqRecited ? 'Yes' : 'No'}","${e.sabaqRating || ''}","${e.currentLesson || ''}","${e.absenceReason || ''}","${e.guardianName}","${e.guardianPhone}","${e.parentNotified ? 'Yes' : 'No'}","${e.notes || ''}"\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `daily-attendance-${currentSession.madrasaName.replace(/\s+/g, '-').toLowerCase()}-${selectedDate}.csv`;
    link.click();
    URL.revokeObjectURL(url);
    addToast('CSV Downloaded', 'Daily attendance sheet exported.', 'success');
  };

  return (
    <div className="space-y-6">
      {/* Top Page Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-gradient-to-r from-stone-900 via-stone-850 to-emerald-950 p-6 rounded-2xl text-white shadow-md border border-stone-800">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-emerald-800/80 text-amber-300 text-xs font-semibold border border-amber-400/30">
            <CalendarCheck2 className="w-3.5 h-3.5 text-amber-300" />
            <span>Jimma Zone Islamic Education Directorate</span>
          </div>
          <h1 className="text-2xl font-bold font-serif tracking-tight text-white flex items-center gap-3">
            <span>Daily Attendance Sheet</span>
            <span className="text-xs font-normal text-emerald-300 font-arabic font-sans">
              (سجل الحضور والغياب اليومي)
            </span>
          </h1>
          <p className="text-xs text-stone-300 max-w-2xl">
            Real-time multi-madrasa roll call, Quran Tahfeez & Sabaq recitation tracking, automatic Ethio Telecom parent SMS broadcast, and official Council attendance registers.
          </p>
        </div>

        {/* Top Quick Actions */}
        <div className="flex items-center gap-2 flex-wrap">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsPrintModalOpen(true)}
            className="flex items-center gap-1.5 bg-stone-800/90 text-stone-100 hover:bg-stone-700 border-stone-700 text-xs shadow-xs"
          >
            <Printer className="w-3.5 h-3.5 text-amber-300" />
            <span>Print Sheet</span>
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={exportDailyCsv}
            className="flex items-center gap-1.5 bg-stone-800/90 text-stone-100 hover:bg-stone-700 border-stone-700 text-xs shadow-xs"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </Button>

          <Button
            variant="primary"
            size="sm"
            onClick={handleSaveAndSubmit}
            className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-sm"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save & Submit Sheet</span>
          </Button>
        </div>
      </div>

      {/* Navigation View Switcher Tabs */}
      <div className="flex items-center gap-2 border-b border-stone-200 overflow-x-auto pb-2">
        <button
          type="button"
          onClick={() => setActiveTab('daily')}
          className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'daily'
              ? 'bg-emerald-800 text-white shadow-xs'
              : 'text-stone-600 hover:bg-stone-100'
          }`}
        >
          <CalendarCheck2 className="w-4 h-4" />
          <span>Interactive Daily Roll-Call</span>
          <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-emerald-950 text-amber-300 font-mono">
            {currentSession.entries.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('monthly')}
          className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'monthly'
              ? 'bg-emerald-800 text-white shadow-xs'
              : 'text-stone-600 hover:bg-stone-100'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>Monthly 30-Day Matrix</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('staff')}
          className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'staff'
              ? 'bg-emerald-800 text-white shadow-xs'
              : 'text-stone-600 hover:bg-stone-100'
          }`}
        >
          <UserCheck className="w-4 h-4" />
          <span>Council Staff & Mu’allims</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('history')}
          className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'history'
              ? 'bg-emerald-800 text-white shadow-xs'
              : 'text-stone-600 hover:bg-stone-100'
          }`}
        >
          <History className="w-4 h-4" />
          <span>Archived Daily Sessions</span>
          <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-stone-200 text-stone-700 font-mono">
            {dailyAttendanceSessions.length}
          </span>
        </button>
      </div>

      {/* Main Content Area */}
      {activeTab === 'daily' && (
        <div className="space-y-5">
          {/* Madrasa, Class, Date, & Shift Selection Bar */}
          <Card className="p-4 bg-white border-stone-200 shadow-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
              {/* Madrasa Selector */}
              <div>
                <label className="block text-[11px] font-bold text-stone-600 uppercase tracking-wider mb-1">
                  Madrasa / Quranic Center
                </label>
                <select
                  value={selectedMadrasaId}
                  onChange={(e) => {
                    setSelectedMadrasaId(e.target.value);
                  }}
                  className="w-full text-xs p-2.5 bg-stone-50 border border-stone-300 rounded-lg text-stone-900 font-medium focus:bg-white focus:ring-1 focus:ring-emerald-500"
                >
                  {madrasas.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Class / Halaqah Selector */}
              <div>
                <label className="block text-[11px] font-bold text-stone-600 uppercase tracking-wider mb-1">
                  Halaqah / Class Level
                </label>
                <select
                  value={selectedClass}
                  onChange={(e) => setSelectedClass(e.target.value)}
                  className="w-full text-xs p-2.5 bg-stone-50 border border-stone-300 rounded-lg text-stone-900 font-medium focus:bg-white focus:ring-1 focus:ring-emerald-500"
                >
                  {availableClasses.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              {/* Date & Hijri */}
              <div>
                <label className="block text-[11px] font-bold text-stone-600 uppercase tracking-wider mb-1">
                  Attendance Date (Hijri / Gregorian)
                </label>
                <div className="flex items-center gap-1.5">
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => {
                      setSelectedDate(e.target.value);
                      if (e.target.value === '2026-08-31') setSelectedHijri('18 Safar 1448 AH');
                      else setSelectedHijri('19 Safar 1448 AH');
                    }}
                    className="w-full text-xs p-2.5 bg-stone-50 border border-stone-300 rounded-lg text-stone-900 font-mono font-medium focus:bg-white"
                  />
                </div>
              </div>

              {/* Shift */}
              <div>
                <label className="block text-[11px] font-bold text-stone-600 uppercase tracking-wider mb-1">
                  Daily Shift
                </label>
                <div className="grid grid-cols-3 gap-1">
                  {(['Morning', 'Afternoon', 'Weekend'] as const).map((shift) => (
                    <button
                      key={shift}
                      type="button"
                      onClick={() => setSelectedShift(shift)}
                      className={`py-2 px-2 text-xs font-semibold rounded-lg border transition-colors cursor-pointer text-center ${
                        selectedShift === shift
                          ? 'bg-emerald-800 text-white border-emerald-800 shadow-xs'
                          : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
                      }`}
                    >
                      {shift}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Quick Session Header Banner */}
            <div className="mt-4 pt-3 border-t border-stone-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-stone-600">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-semibold text-stone-900">{selectedMadrasa?.name}</span>
                <span className="text-stone-300">•</span>
                <span className="text-emerald-800 font-medium">Ustadh: {currentSession.teacherName}</span>
                <span className="text-stone-300">•</span>
                <span className="text-amber-800 font-mono font-medium">{currentSession.hijriDate}</span>
                <Badge variant={currentSession.status === 'Verified by Supervisor' ? 'emerald' : 'stone'}>
                  {currentSession.status}
                </Badge>
              </div>

              <div className="text-[11px] text-stone-600">
                Last updated at <strong className="font-mono text-stone-800">{currentSession.submittedAt}</strong>
              </div>
            </div>
          </Card>

          {/* Real-Time Stats Banner */}
          <AttendanceStatsBar
            session={currentSession}
            activeFilter={activeFilter}
            onFilterChange={setActiveFilter}
          />

          {/* Quick Action Bar (Mark All, SMS Alert, Search) */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-stone-100/80 p-3.5 rounded-xl border border-stone-200">
            {/* Search Input */}
            <div className="relative flex-1 max-w-sm">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
              <input
                type="text"
                placeholder="Search student by name, guardian, or phone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 text-xs bg-white border border-stone-300 rounded-lg text-stone-900 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>

            {/* Fast Batch Controls */}
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[11px] font-semibold text-stone-500 uppercase mr-1">
                Batch Tools:
              </span>

              <button
                type="button"
                onClick={() => handleBatchMark('Present')}
                className="px-2.5 py-1.5 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 text-emerald-800 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                title="Mark all students as Present"
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Mark All Present</span>
              </button>

              <button
                type="button"
                onClick={() => handleBatchMark('Late')}
                className="px-2.5 py-1.5 bg-amber-50 hover:bg-amber-100 border border-amber-300 text-amber-800 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                title="Mark all students as Late"
              >
                <Clock className="w-3.5 h-3.5 text-amber-600" />
                <span>Mark Late</span>
              </button>

              {/* SMS Alert Trigger Button */}
              <button
                type="button"
                onClick={handleOpenBatchSms}
                className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                title="Send Ethio Telecom SMS to Parents of Absentees"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Notify Absentees via SMS</span>
                {unnotifiedAbsenteesCount > 0 && (
                  <span className="px-1.5 py-0.2 rounded-full bg-white text-rose-700 text-[10px] font-black">
                    {unnotifiedAbsenteesCount}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Interactive Attendance Table */}
          <AttendanceSheetTable
            entries={currentSession.entries}
            onUpdateEntry={handleUpdateEntry}
            onSendSingleSms={handleOpenSingleSms}
            activeFilter={activeFilter}
            searchTerm={searchTerm}
          />
        </div>
      )}

      {/* Monthly Tab */}
      {activeTab === 'monthly' && (
        <MonthlyAttendanceRegister
          madrasaName={selectedMadrasa?.name || 'Grand Anwar Madrasa'}
          className={selectedClass}
          entries={currentSession.entries}
        />
      )}

      {/* Staff Tab */}
      {activeTab === 'staff' && <StaffAttendanceTab />}

      {/* Archived Sessions Tab */}
      {activeTab === 'history' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold font-serif text-base text-stone-900">
                Archived Daily Attendance Registers
              </h3>
              <p className="text-xs text-stone-500">
                All finalized and supervisor-verified attendance registers for Jimma Zone Islamic centers.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {dailyAttendanceSessions.map((session) => (
              <Card key={session.id} className="p-4 bg-white border-stone-200 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <Badge variant={session.status === 'Verified by Supervisor' ? 'emerald' : 'stone'}>
                      {session.status}
                    </Badge>
                    <h4 className="font-bold text-sm text-stone-900 mt-2 line-clamp-1">
                      {session.madrasaName}
                    </h4>
                    <div className="text-xs text-emerald-800 font-semibold mt-0.5">
                      {session.className} ({session.shift})
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold font-mono text-stone-900">
                      {session.attendanceRate}%
                    </div>
                    <div className="text-[10px] text-stone-500">Attendance</div>
                  </div>
                </div>

                <div className="mt-3 pt-3 border-t border-stone-100 text-xs text-stone-600 space-y-1">
                  <div className="flex items-center justify-between">
                    <span>Date:</span>
                    <strong className="text-stone-800 font-mono">{session.hijriDate} ({session.date})</strong>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Mu'allim / Sheikh:</span>
                    <span className="text-stone-800">{session.teacherName}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Roster Breakdown:</span>
                    <span className="font-mono text-[11px]">
                      <strong className="text-emerald-700">{session.presentCount}P</strong> /{' '}
                      <strong className="text-rose-700">{session.absentCount}A</strong> /{' '}
                      <strong className="text-amber-700">{session.lateCount}L</strong>
                    </span>
                  </div>
                </div>

                <div className="mt-4 pt-2 border-t border-stone-100 flex items-center justify-between">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSelectedMadrasaId(session.madrasaId);
                      setSelectedClass(session.className);
                      setSelectedShift(session.shift);
                      setSelectedDate(session.date);
                      setActiveTab('daily');
                    }}
                    className="text-xs flex items-center gap-1"
                  >
                    <span>Inspect Sheet</span>
                    <ArrowRight className="w-3 h-3" />
                  </Button>

                  <button
                    type="button"
                    onClick={() => {
                      setSelectedMadrasaId(session.madrasaId);
                      setSelectedClass(session.className);
                      setIsPrintModalOpen(true);
                    }}
                    className="p-1.5 text-stone-500 hover:text-stone-900 rounded-md hover:bg-stone-100"
                    title="Print Archive"
                  >
                    <Printer className="w-4 h-4" />
                  </button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Modal 1: Absence SMS Broadcast */}
      <AbsenceSmsModal
        isOpen={isSmsModalOpen}
        onClose={() => {
          setIsSmsModalOpen(false);
          setSingleSmsStudent(null);
        }}
        session={currentSession}
        singleStudent={singleSmsStudent}
      />

      {/* Modal 2: Printable Official Register */}
      <PrintableAttendanceSheet
        isOpen={isPrintModalOpen}
        onClose={() => setIsPrintModalOpen(false)}
        session={currentSession}
      />
    </div>
  );
};
