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
  const [expandedNotesStudentId, setExpandedNotesStudentId] = useState<string | null>(null);

  const filteredEntries = entries.filter((entry) => {
    // Search filter
    const term = searchTerm.toLowerCase();
    const matchSearch =
      entry.studentName.toLowerCase().includes(term) ||
      (entry.arabicName && entry.arabicName.includes(term)) ||
      entry.guardianName.toLowerCase().includes(term) ||
      entry.guardianPhone.includes(term);

    if (!matchSearch) return false;

    // Status filter
    if (activeFilter === 'all') return true;
    if (activeFilter === 'needs_sabaq') return !entry.sabaqRecited;
    return entry.status === activeFilter;
  });

  const getStatusBadge = (status: AttendanceStatus) => {
    switch (status) {
      case 'Present':
        return <Badge variant="emerald">Present</Badge>;
      case 'Absent':
        return <Badge variant="rose">Absent</Badge>;
      case 'Late':
        return <Badge variant="amber">Late</Badge>;
      case 'Excused':
        return <Badge variant="blue">Excused</Badge>;
    }
  };

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
      <div className="overflow-x-auto">
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
            {filteredEntries.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-12 text-center text-stone-500">
                  <div className="flex flex-col items-center justify-center">
                    <Info className="w-8 h-8 text-stone-400 mb-2" />
                    <p className="font-semibold text-stone-800">No students matched this filter</p>
                    <p className="text-xs text-stone-500 mt-1">
                      Try selecting "All Students" or clearing your search term.
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              filteredEntries.map((entry, index) => {
                const isLate = entry.status === 'Late';
                const isAbsent = entry.status === 'Absent';
                const isExcused = entry.status === 'Excused';
                const isPresent = entry.status === 'Present';

                return (
                  <tr
                    key={entry.studentId}
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
              })
            )}
          </tbody>
        </table>
      </div>

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
