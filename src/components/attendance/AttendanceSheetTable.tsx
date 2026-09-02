import React, { useState } from 'react';
import {
  CheckCircle2,
  XCircle,
  Clock,
  HelpCircle,
  Phone,
  MessageSquare,
  BookOpen,
  Sparkles,
  ChevronDown,
  Info,
  Check,
  AlertCircle,
  LayoutGrid,
  List,
} from 'lucide-react';
import { StudentAttendanceEntry, AttendanceStatus } from '../../types';
import { Badge } from '../ui/Badge';

interface AttendanceSheetTableProps {
  entries: StudentAttendanceEntry[];
  onUpdateEntry: (studentId: string, updates: Partial<StudentAttendanceEntry>) => void;
  onSendSingleSms: (entry: StudentAttendanceEntry) => void;
  activeFilter: string;
  searchTerm: string;
}

export const AttendanceSheetTable: React.FC<AttendanceSheetTableProps> = ({
  entries,
  onUpdateEntry,
  onSendSingleSms,
  activeFilter,
  searchTerm,
}) => {
  const [viewFormat, setViewFormat] = useState<'auto' | 'cards' | 'table'>('auto');

  const filteredEntries = entries.filter((entry) => {
    // Search filter
    const term = (searchTerm || '').toLowerCase();
    const matchSearch =
      (entry.studentName || '').toLowerCase().includes(term) ||
      (entry.arabicName && entry.arabicName.includes(term)) ||
      (entry.guardianName || '').toLowerCase().includes(term) ||
      (entry.guardianPhone || '').includes(term);

    if (!matchSearch) return false;

    // Status filter
    if (activeFilter === 'all') return true;
    if (activeFilter === 'needs_sabaq') return !entry.sabaqRecited;
    return entry.status === activeFilter;
  });

  const handleStatusChange = (studentId: string, status: AttendanceStatus) => {
    const nowTime = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    const updates: Partial<StudentAttendanceEntry> = {
      status,
    };

    if (status === 'Present') {
      updates.arrivalTime = nowTime;
      updates.lateMinutes = 0;
      updates.absenceReason = undefined;
    } else if (status === 'Late') {
      updates.arrivalTime = nowTime;
      updates.lateMinutes = 15;
      updates.absenceReason = undefined;
    } else if (status === 'Absent') {
      updates.arrivalTime = undefined;
      updates.lateMinutes = undefined;
      updates.absenceReason = 'Unexcused';
      updates.sabaqRecited = false;
      updates.sabaqRating = 'Not Recited';
    } else if (status === 'Excused') {
      updates.arrivalTime = undefined;
      updates.lateMinutes = undefined;
      updates.absenceReason = 'Illness/Medical';
      updates.sabaqRecited = false;
    }

    onUpdateEntry(studentId, updates);
  };

  return (
    <div className="bg-white rounded-xl border border-stone-200 shadow-xs overflow-hidden">
      {/* Mobile / Desktop View Mode Ribbon */}
      <div className="px-4 py-2.5 bg-stone-50 border-b border-stone-200 flex items-center justify-between gap-2 text-xs text-stone-600">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-stone-800">
            {filteredEntries.length} Student{filteredEntries.length !== 1 ? 's' : ''} Listed
          </span>
          {activeFilter !== 'all' && (
            <span className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-medium">
              Filter: {activeFilter}
            </span>
          )}
        </div>

        {/* View Switcher Controls */}
        <div className="flex items-center gap-1 bg-stone-200/80 p-0.5 rounded-lg">
          <button
            type="button"
            onClick={() => setViewFormat('auto')}
            className={`px-2 py-1 rounded-md text-[11px] font-medium transition-colors cursor-pointer ${
              viewFormat === 'auto'
                ? 'bg-white text-stone-900 shadow-xs font-semibold'
                : 'text-stone-600 hover:text-stone-900'
            }`}
            title="Auto-switch based on screen size"
          >
            Auto
          </button>
          <button
            type="button"
            onClick={() => setViewFormat('cards')}
            className={`px-2 py-1 rounded-md text-[11px] font-medium flex items-center gap-1 transition-colors cursor-pointer ${
              viewFormat === 'cards'
                ? 'bg-white text-stone-900 shadow-xs font-semibold'
                : 'text-stone-600 hover:text-stone-900'
            }`}
            title="Card View (Mobile Optimized)"
          >
            <LayoutGrid className="w-3 h-3" />
            <span className="hidden sm:inline">Cards</span>
          </button>
          <button
            type="button"
            onClick={() => setViewFormat('table')}
            className={`px-2 py-1 rounded-md text-[11px] font-medium flex items-center gap-1 transition-colors cursor-pointer ${
              viewFormat === 'table'
                ? 'bg-white text-stone-900 shadow-xs font-semibold'
                : 'text-stone-600 hover:text-stone-900'
            }`}
            title="Matrix Table View"
          >
            <List className="w-3 h-3" />
            <span className="hidden sm:inline">Table</span>
          </button>
        </div>
      </div>

      {filteredEntries.length === 0 ? (
        <div className="py-12 px-4 text-center text-stone-500">
          <div className="flex flex-col items-center justify-center">
            <Info className="w-8 h-8 text-stone-400 mb-2" />
            <p className="font-semibold text-stone-800">No students matched this filter</p>
            <p className="text-xs text-stone-500 mt-1">
              Try selecting "All Students" or clearing your search term.
            </p>
          </div>
        </div>
      ) : (
        <>
          {/* MOBILE CARD VIEW (Active on mobile or when 'cards' view is chosen) */}
          <div
            className={`divide-y divide-stone-200 p-3 space-y-3 ${
              viewFormat === 'table'
                ? 'hidden'
                : viewFormat === 'cards'
                ? 'block'
                : 'block md:hidden'
            }`}
          >
            {filteredEntries.map((entry, index) => {
              const isLate = entry.status === 'Late';
              const isAbsent = entry.status === 'Absent';
              const isExcused = entry.status === 'Excused';
              const isPresent = entry.status === 'Present';

              return (
                <div
                  key={`card-${entry.studentId}`}
                  className={`p-3.5 rounded-xl border transition-all space-y-3 ${
                    isAbsent
                      ? 'bg-rose-50/40 border-rose-200'
                      : isLate
                      ? 'bg-amber-50/40 border-amber-200'
                      : isExcused
                      ? 'bg-blue-50/40 border-blue-200'
                      : 'bg-stone-50/50 border-stone-200'
                  }`}
                >
                  {/* Header: Student Name, Gender, Index */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-start gap-2.5 min-w-0">
                      <div
                        className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${
                          entry.gender === 'Female'
                            ? 'bg-purple-100 text-purple-800 border border-purple-200'
                            : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                        }`}
                      >
                        {entry.studentName.charAt(0)}
                      </div>
                      <div className="min-w-0">
                        <div className="font-bold text-sm text-stone-900 flex items-center gap-1.5 flex-wrap">
                          <span>{entry.studentName}</span>
                          {entry.arabicName && (
                            <span className="font-serif text-xs text-stone-500 font-normal">
                              ({entry.arabicName})
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-stone-500 flex items-center gap-1 flex-wrap mt-0.5">
                          <span>Guardian: <strong className="text-stone-700">{entry.guardianName}</strong></span>
                          <span>•</span>
                          <a
                            href={`tel:${entry.guardianPhone}`}
                            className="inline-flex items-center gap-0.5 text-emerald-700 font-mono text-[11px]"
                          >
                            <Phone className="w-3 h-3" />
                            {entry.guardianPhone}
                          </a>
                        </div>
                      </div>
                    </div>
                    <span className="text-[11px] font-mono font-bold text-stone-400">
                      #{index + 1}
                    </span>
                  </div>

                  {/* 4 Status Toggle Buttons for Mobile Touch */}
                  <div className="grid grid-cols-4 gap-1.5 pt-1">
                    <button
                      type="button"
                      onClick={() => handleStatusChange(entry.studentId, 'Present')}
                      className={`min-h-[44px] px-2 py-2 rounded-lg text-xs font-bold flex flex-col items-center justify-center gap-1 transition-all cursor-pointer ${
                        isPresent
                          ? 'bg-emerald-700 text-white shadow-xs'
                          : 'bg-white text-stone-700 border border-stone-200 hover:bg-stone-100'
                      }`}
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Present</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleStatusChange(entry.studentId, 'Absent')}
                      className={`min-h-[44px] px-2 py-2 rounded-lg text-xs font-bold flex flex-col items-center justify-center gap-1 transition-all cursor-pointer ${
                        isAbsent
                          ? 'bg-rose-700 text-white shadow-xs'
                          : 'bg-white text-stone-700 border border-stone-200 hover:bg-stone-100'
                      }`}
                    >
                      <XCircle className="w-4 h-4" />
                      <span>Absent</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleStatusChange(entry.studentId, 'Late')}
                      className={`min-h-[44px] px-2 py-2 rounded-lg text-xs font-bold flex flex-col items-center justify-center gap-1 transition-all cursor-pointer ${
                        isLate
                          ? 'bg-amber-600 text-white shadow-xs'
                          : 'bg-white text-stone-700 border border-stone-200 hover:bg-stone-100'
                      }`}
                    >
                      <Clock className="w-4 h-4" />
                      <span>Late</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleStatusChange(entry.studentId, 'Excused')}
                      className={`min-h-[44px] px-2 py-2 rounded-lg text-xs font-bold flex flex-col items-center justify-center gap-1 transition-all cursor-pointer ${
                        isExcused
                          ? 'bg-blue-600 text-white shadow-xs'
                          : 'bg-white text-stone-700 border border-stone-200 hover:bg-stone-100'
                      }`}
                    >
                      <HelpCircle className="w-4 h-4" />
                      <span>Excused</span>
                    </button>
                  </div>

                  {/* Contextual Late / Absence options */}
                  {isLate && (
                    <div className="flex items-center gap-2 text-xs bg-amber-50 text-amber-900 p-2 rounded-lg border border-amber-200">
                      <Clock className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                      <span>Arrived:</span>
                      <input
                        type="text"
                        value={entry.arrivalTime || '08:15 AM'}
                        onChange={(e) => onUpdateEntry(entry.studentId, { arrivalTime: e.target.value })}
                        className="w-20 px-1.5 py-0.5 bg-white border border-amber-300 rounded text-xs text-center font-mono font-medium"
                      />
                      <span className="text-[11px]">Late:</span>
                      <input
                        type="number"
                        min={1}
                        max={180}
                        value={entry.lateMinutes || 15}
                        onChange={(e) => onUpdateEntry(entry.studentId, { lateMinutes: Number(e.target.value) })}
                        className="w-12 px-1 py-0.5 bg-white border border-amber-300 rounded text-xs text-center font-mono font-medium"
                      />
                      <span>m</span>
                    </div>
                  )}

                  {(isAbsent || isExcused) && (
                    <div className="flex items-center gap-2 text-xs bg-white p-2 rounded-lg border border-stone-200">
                      <span className="text-stone-500 font-medium">Reason:</span>
                      <select
                        value={entry.absenceReason || (isExcused ? 'Illness/Medical' : 'Unexcused')}
                        onChange={(e) =>
                          onUpdateEntry(entry.studentId, {
                            absenceReason: e.target.value as any,
                          })
                        }
                        className="flex-1 text-xs py-1 px-2 bg-stone-50 border border-stone-300 rounded-md text-stone-800"
                      >
                        <option value="Unexcused">Unexcused Absence</option>
                        <option value="Illness/Medical">Illness / Medical Leave</option>
                        <option value="Family Matter">Family Matter / Travel</option>
                        <option value="Weather/Transport">Rain / Transport Issue</option>
                        <option value="Council Excused">Council Program Duty</option>
                        <option value="Other">Other Reason</option>
                      </select>
                    </div>
                  )}

                  {/* Daily Sabaq Recitation Checklist & Quality */}
                  <div className="bg-white p-2.5 rounded-lg border border-stone-200 space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="flex items-center gap-2 cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={entry.sabaqRecited}
                          onChange={(e) =>
                            onUpdateEntry(entry.studentId, {
                              sabaqRecited: e.target.checked,
                              sabaqRating: e.target.checked
                                ? entry.sabaqRating === 'Not Recited' || !entry.sabaqRating
                                  ? 'Very Good'
                                  : entry.sabaqRating
                                : 'Not Recited',
                            })
                          }
                          className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 border-stone-300"
                        />
                        <span
                          className={`text-xs font-bold ${
                            entry.sabaqRecited ? 'text-emerald-900' : 'text-stone-500'
                          }`}
                        >
                          {entry.sabaqRecited ? '✓ Sabaq Recited' : 'Sabaq Pending'}
                        </span>
                      </label>

                      {entry.sabaqRecited && (
                        <select
                          value={entry.sabaqRating || 'Very Good'}
                          onChange={(e) =>
                            onUpdateEntry(entry.studentId, {
                              sabaqRating: e.target.value as any,
                            })
                          }
                          className="text-[11px] py-1 px-1.5 bg-stone-50 border border-stone-300 rounded font-medium text-stone-800"
                        >
                          <option value="Excellent">Mumtaz ⭐⭐⭐</option>
                          <option value="Very Good">Jayyid Jiddan ⭐⭐</option>
                          <option value="Good">Jayyid ⭐</option>
                          <option value="Needs Revision">Needs Revision</option>
                        </select>
                      )}
                    </div>

                    {entry.currentLesson && (
                      <div className="text-[11px] text-stone-500 truncate flex items-center gap-1">
                        <BookOpen className="w-3 h-3 text-stone-400 shrink-0" />
                        <span>{entry.currentLesson}</span>
                      </div>
                    )}
                  </div>

                  {/* SMS and Remarks */}
                  <div className="flex items-center justify-between gap-2 pt-1">
                    {entry.parentNotified ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full">
                        <Check className="w-3 h-3" /> SMS Dispatched
                      </span>
                    ) : isAbsent ? (
                      <button
                        type="button"
                        onClick={() => onSendSingleSms(entry)}
                        className="inline-flex items-center gap-1 text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 px-3 py-1 rounded-full transition-colors cursor-pointer"
                      >
                        <MessageSquare className="w-3.5 h-3.5" /> Send SMS Alert
                      </button>
                    ) : (
                      <span className="text-[11px] text-stone-500">Regular Attendance</span>
                    )}

                    <input
                      type="text"
                      placeholder="Add note..."
                      value={entry.notes || ''}
                      onChange={(e) =>
                        onUpdateEntry(entry.studentId, { notes: e.target.value })
                      }
                      className="flex-1 text-xs px-2 py-1 bg-white border border-stone-200 rounded text-stone-700 placeholder:text-stone-400 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* DESKTOP TABLE VIEW (Active on tablet/desktop or when 'table' view is chosen) */}
          <div
            className={`overflow-x-auto ${
              viewFormat === 'cards'
                ? 'hidden'
                : viewFormat === 'table'
                ? 'block'
                : 'hidden md:block'
            }`}
          >
            <table className="w-full text-left border-collapse min-w-[900px]">
              <thead>
                <tr className="bg-stone-50/90 text-[11px] font-semibold text-stone-600 uppercase tracking-wider border-b border-stone-200">
                  <th className="py-3 px-4 w-12 text-center">#</th>
                  <th className="py-3 px-4 min-w-[220px]">Student & Guardian Record</th>
                  <th className="py-3 px-4 w-[280px]">Attendance Status</th>
                  <th className="py-3 px-4 min-w-[200px]">Daily Sabaq / Hifz</th>
                  <th className="py-3 px-4 min-w-[180px]">Guardian SMS & Remarks</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 text-sm">
                {filteredEntries.map((entry, index) => {
                  const isLate = entry.status === 'Late';
                  const isAbsent = entry.status === 'Absent';
                  const isExcused = entry.status === 'Excused';
                  const isPresent = entry.status === 'Present';

                  return (
                    <tr
                      key={`table-${entry.studentId}`}
                      className={`transition-colors hover:bg-stone-50/60 ${
                        isAbsent
                          ? 'bg-rose-50/20'
                          : isLate
                          ? 'bg-amber-50/20'
                          : isExcused
                          ? 'bg-blue-50/20'
                          : ''
                      }`}
                    >
                      {/* Index */}
                      <td className="py-3.5 px-4 text-center text-xs font-mono text-stone-600">
                        {index + 1}
                      </td>

                      {/* Student Info */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-start gap-3">
                          <div
                            className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${
                              entry.gender === 'Female'
                                ? 'bg-purple-100 text-purple-800 border border-purple-200'
                                : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                            }`}
                          >
                            {entry.studentName.charAt(0)}
                          </div>
                          <div className="min-w-0">
                            <div className="font-semibold text-stone-900 flex items-center gap-2 flex-wrap">
                              <span className="truncate">{entry.studentName}</span>
                              {entry.arabicName && (
                                <span className="font-serif text-xs text-stone-500 font-normal">
                                  ({entry.arabicName})
                                </span>
                              )}
                            </div>
                            <div className="text-xs text-stone-500 mt-0.5 flex items-center gap-2 flex-wrap">
                              <span>Guardian: <strong className="font-medium text-stone-700">{entry.guardianName}</strong></span>
                              <span className="text-stone-300">•</span>
                              <a
                                href={`tel:${entry.guardianPhone}`}
                                className="inline-flex items-center gap-1 text-emerald-700 hover:text-emerald-800 hover:underline font-mono text-[11px]"
                              >
                                <Phone className="w-3 h-3" />
                                {entry.guardianPhone}
                              </a>
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Attendance Status Buttons */}
                      <td className="py-3.5 px-4">
                        <div className="space-y-2">
                          {/* 4 Status Toggle Pills */}
                          <div className="inline-flex p-1 bg-stone-100 rounded-lg border border-stone-200 gap-1">
                            <button
                              type="button"
                              onClick={() => handleStatusChange(entry.studentId, 'Present')}
                              className={`px-2.5 py-1 rounded-md text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer ${
                                isPresent
                                  ? 'bg-emerald-700 text-white shadow-xs'
                                  : 'text-stone-600 hover:bg-stone-200'
                              }`}
                              title="Mark Present"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>Present</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => handleStatusChange(entry.studentId, 'Absent')}
                              className={`px-2.5 py-1 rounded-md text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer ${
                                isAbsent
                                  ? 'bg-rose-700 text-white shadow-xs'
                                  : 'text-stone-600 hover:bg-stone-200'
                              }`}
                              title="Mark Absent"
                            >
                              <XCircle className="w-3.5 h-3.5" />
                              <span>Absent</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => handleStatusChange(entry.studentId, 'Late')}
                              className={`px-2.5 py-1 rounded-md text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer ${
                                isLate
                                  ? 'bg-amber-600 text-white shadow-xs'
                                  : 'text-stone-600 hover:bg-stone-200'
                              }`}
                              title="Mark Late"
                            >
                              <Clock className="w-3.5 h-3.5" />
                              <span>Late</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => handleStatusChange(entry.studentId, 'Excused')}
                              className={`px-2.5 py-1 rounded-md text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer ${
                                isExcused
                                  ? 'bg-blue-600 text-white shadow-xs'
                                  : 'text-stone-600 hover:bg-stone-200'
                              }`}
                              title="Mark Excused"
                            >
                              <HelpCircle className="w-3.5 h-3.5" />
                              <span>Excused</span>
                            </button>
                          </div>

                          {/* Extra Contextual Details based on status */}
                          {isLate && (
                            <div className="flex items-center gap-2 text-xs bg-amber-50 text-amber-900 p-1.5 rounded-md border border-amber-200">
                              <Clock className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                              <span>Arrived at:</span>
                              <input
                                type="text"
                                value={entry.arrivalTime || '08:15 AM'}
                                onChange={(e) => onUpdateEntry(entry.studentId, { arrivalTime: e.target.value })}
                                className="w-20 px-1.5 py-0.5 bg-white border border-amber-300 rounded text-xs text-center font-mono font-medium focus:ring-1 focus:ring-amber-500"
                              />
                              <div className="flex items-center gap-1 text-[11px] text-amber-700">
                                <span>Late:</span>
                                <input
                                  type="number"
                                  min={1}
                                  max={180}
                                  value={entry.lateMinutes || 15}
                                  onChange={(e) => onUpdateEntry(entry.studentId, { lateMinutes: Number(e.target.value) })}
                                  className="w-12 px-1 py-0.5 bg-white border border-amber-300 rounded text-xs text-center font-mono font-medium"
                                />
                                <span>min</span>
                              </div>
                            </div>
                          )}

                          {(isAbsent || isExcused) && (
                            <div className="flex items-center gap-2 text-xs">
                              <span className="text-stone-500 text-[11px] font-medium">Reason:</span>
                              <select
                                value={entry.absenceReason || (isExcused ? 'Illness/Medical' : 'Unexcused')}
                                onChange={(e) =>
                                  onUpdateEntry(entry.studentId, {
                                    absenceReason: e.target.value as any,
                                  })
                                }
                                className="text-xs py-1 px-2 bg-white border border-stone-300 rounded-md text-stone-700 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                              >
                                <option value="Unexcused">Unexcused Absence</option>
                                <option value="Illness/Medical">Illness / Medical Leave</option>
                                <option value="Family Matter">Family Matter / Travel</option>
                                <option value="Weather/Transport">Rain / Transport Issue</option>
                                <option value="Council Excused">Council Program Duty</option>
                                <option value="Other">Other Reason</option>
                              </select>
                            </div>
                          )}
                        </div>
                      </td>

                      {/* Sabaq / Hifz Daily Recitation */}
                      <td className="py-3.5 px-4">
                        <div className="space-y-1.5">
                          <label className="flex items-center gap-2 cursor-pointer select-none">
                            <input
                              type="checkbox"
                              checked={entry.sabaqRecited}
                              onChange={(e) =>
                                onUpdateEntry(entry.studentId, {
                                  sabaqRecited: e.target.checked,
                                  sabaqRating: e.target.checked
                                    ? entry.sabaqRating === 'Not Recited' || !entry.sabaqRating
                                      ? 'Very Good'
                                      : entry.sabaqRating
                                    : 'Not Recited',
                                })
                              }
                              className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 border-stone-300"
                            />
                            <span
                              className={`text-xs font-semibold ${
                                entry.sabaqRecited ? 'text-emerald-900' : 'text-stone-500'
                              }`}
                            >
                              {entry.sabaqRecited ? '✓ Sabaq Recited' : 'Sabaq Pending'}
                            </span>
                          </label>

                          {entry.sabaqRecited && (
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <span className="text-[11px] text-stone-500">Quality:</span>
                              <select
                                value={entry.sabaqRating || 'Very Good'}
                                onChange={(e) =>
                                  onUpdateEntry(entry.studentId, {
                                    sabaqRating: e.target.value as any,
                                  })
                                }
                                className="text-[11px] py-0.5 px-1.5 bg-white border border-stone-300 rounded font-medium text-stone-800"
                              >
                                <option value="Excellent">Mumtaz (Excellent ⭐⭐⭐)</option>
                                <option value="Very Good">Jayyid Jiddan (Very Good ⭐⭐)</option>
                                <option value="Good">Jayyid (Good ⭐)</option>
                                <option value="Needs Revision">Needs Revision (Makhalif)</option>
                              </select>
                            </div>
                          )}

                          {entry.currentLesson && (
                            <div className="text-[11px] text-stone-500 truncate flex items-center gap-1">
                              <BookOpen className="w-3 h-3 text-stone-400 shrink-0" />
                              <span>{entry.currentLesson}</span>
                            </div>
                          )}
                        </div>
                      </td>

                      {/* Guardian SMS & Remarks */}
                      <td className="py-3.5 px-4">
                        <div className="space-y-1.5">
                          <div className="flex items-center gap-2">
                            {entry.parentNotified ? (
                              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                                <Check className="w-3 h-3" /> SMS Dispatched
                              </span>
                            ) : isAbsent ? (
                              <button
                                type="button"
                                onClick={() => onSendSingleSms(entry)}
                                className="inline-flex items-center gap-1 text-[11px] font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 px-2 py-0.5 rounded-full transition-colors cursor-pointer"
                                title="Send SMS notification to guardian"
                              >
                                <MessageSquare className="w-3 h-3" /> Send SMS Alert
                              </button>
                            ) : (
                              <span className="text-[11px] text-stone-600">
                                Regular Attendance
                              </span>
                            )}
                          </div>

                          {/* Inline Note */}
                          <div className="relative">
                            <input
                              type="text"
                              placeholder="Add remark / note..."
                              value={entry.notes || ''}
                              onChange={(e) =>
                                onUpdateEntry(entry.studentId, { notes: e.target.value })
                              }
                              className="w-full text-xs px-2 py-1 bg-stone-50 border border-stone-200 rounded text-stone-700 placeholder:text-stone-400 focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
                            />
                          </div>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* Footer Legend */}
      <div className="p-3 bg-stone-50 border-t border-stone-200 flex flex-wrap items-center justify-between gap-3 text-xs text-stone-500">
        <div className="flex items-center gap-4 flex-wrap">
          <span className="font-semibold text-stone-700">Legend:</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-600" /> Present (حاضر)</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-rose-600" /> Absent (غائب)</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-600" /> Late (متأخر)</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-blue-600" /> Excused (معذور)</span>
        </div>
        <div>
          Showing <strong>{filteredEntries.length}</strong> of <strong>{entries.length}</strong> registered students
        </div>
      </div>
    </div>
  );
};
