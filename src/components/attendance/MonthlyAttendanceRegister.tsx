import React, { useState } from 'react';
import {
  Calendar,
  AlertTriangle,
  Download,
  CheckCircle2,
  XCircle,
  Clock,
  HelpCircle,
  Search,
  Filter,
} from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { StudentAttendanceEntry } from '../../types';
import { useApp } from '../../context/AppContext';

interface MonthlyAttendanceRegisterProps {
  madrasaName: string;
  className: string;
  entries: StudentAttendanceEntry[];
}

export const MonthlyAttendanceRegister: React.FC<MonthlyAttendanceRegisterProps> = ({
  madrasaName,
  className,
  entries,
}) => {
  const { addToast } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [chronicOnly, setChronicOnly] = useState(false);

  // Generate 30 days of Safar 1448
  const daysInMonth = Array.from({ length: 30 }, (_, i) => i + 1);

  // Deterministic mock daily attendance pattern for 30 days per student
  const getDayStatus = (studentId: string, day: number, studentIndex: number) => {
    // Weekend days (Fridays & Saturdays: days 5,6, 12,13, 19,20, 26,27)
    const isFriday = day % 7 === 5;
    const isSaturday = day % 7 === 6;
    if (isFriday) return 'OFF'; // Jummah off

    // Seeded pseudo pattern
    const seed = (studentIndex * 13 + day * 7) % 31;
    if (seed === 0) return 'A'; // Absent
    if (seed === 1 || seed === 2) return 'L'; // Late
    if (seed === 3) return 'E'; // Excused
    return 'P'; // Present
  };

  const filteredEntries = entries.filter((entry, idx) => {
    const term = (searchTerm || '').toLowerCase();
    const matchSearch =
      (entry.studentName || '').toLowerCase().includes(term) ||
      (entry.guardianName || '').toLowerCase().includes(term);

    // Calculate 30-day absence count
    let absentCount = 0;
    daysInMonth.forEach((d) => {
      if (getDayStatus(entry.studentId, d, idx) === 'A') absentCount++;
    });

    if (chronicOnly && absentCount < 2) return false;
    return matchSearch;
  });

  const exportMonthlyCsv = () => {
    let csv = `Student Name,Guardian,Phone,Total Present,Total Absent,Total Late,Attendance Rate\n`;
    entries.forEach((e, idx) => {
      let p = 0, a = 0, l = 0;
      daysInMonth.forEach((d) => {
        const st = getDayStatus(e.studentId, d, idx);
        if (st === 'P') p++;
        if (st === 'A') a++;
        if (st === 'L') l++;
      });
      const activeDays = p + a + l;
      const rate = activeDays > 0 ? Math.round(((p + l * 0.5) / activeDays) * 100) : 100;
      csv += `"${e.studentName}","${e.guardianName}","${e.guardianPhone}",${p},${a},${l},${rate}%\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `monthly-attendance-${(madrasaName || 'madrasa').replace(/\s+/g, '-').toLowerCase()}-safar-1448.csv`;
    link.click();
    URL.revokeObjectURL(url);
    addToast('CSV Exported', 'Monthly 30-Day Attendance Matrix downloaded.', 'success');
  };

  return (
    <div className="space-y-4">
      {/* Header and filters */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-xl border border-stone-200 shadow-xs">
        <div>
          <h3 className="font-bold font-serif text-base text-stone-900 flex items-center gap-2">
            <span>Monthly Attendance Sheet: Safar 1448 AH</span>
            <span className="text-xs font-normal text-stone-500 font-sans">(August / September 2026)</span>
          </h3>
          <p className="text-xs text-stone-500 mt-0.5">
            {madrasaName} • {className}
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-stone-400" />
            <input
              type="text"
              placeholder="Search student..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="text-xs pl-8 pr-3 py-1.5 bg-stone-50 border border-stone-300 rounded-lg text-stone-900 focus:bg-white"
            />
          </div>

          <button
            type="button"
            onClick={() => setChronicOnly(!chronicOnly)}
            className={`text-xs px-3 py-1.5 rounded-lg border font-medium flex items-center gap-1.5 cursor-pointer transition-colors ${
              chronicOnly
                ? 'bg-rose-50 border-rose-300 text-rose-800'
                : 'bg-white border-stone-300 text-stone-700 hover:bg-stone-50'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
            <span>Chronic Absentees (&gt;2 Absences)</span>
          </button>

          <Button
            variant="outline"
            size="sm"
            onClick={exportMonthlyCsv}
            className="flex items-center gap-1.5 text-xs bg-white"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </Button>
        </div>
      </div>

      {/* 30-Day Grid Table */}
      <div className="bg-white rounded-xl border border-stone-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-stone-100 text-stone-700 border-b border-stone-300 text-[10px] font-bold uppercase">
                <th className="py-2.5 px-3 sticky left-0 bg-stone-100 z-10 w-48 border-r border-stone-300">
                  Student Name
                </th>
                {daysInMonth.map((d) => (
                  <th
                    key={d}
                    className={`py-2 px-1 text-center min-w-[24px] border-r border-stone-200 ${
                      d === 18 ? 'bg-amber-100 text-amber-900 font-black' : ''
                    }`}
                    title={`Day ${d} Safar`}
                  >
                    {d}
                  </th>
                ))}
                <th className="py-2.5 px-2 text-center w-16 border-r border-stone-200">Pres.</th>
                <th className="py-2.5 px-2 text-center w-16 border-r border-stone-200">Abs.</th>
                <th className="py-2.5 px-3 text-center w-20">Rate</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {filteredEntries.map((entry, idx) => {
                let p = 0, a = 0, l = 0, eCount = 0;
                daysInMonth.forEach((d) => {
                  const st = getDayStatus(entry.studentId, d, idx);
                  if (st === 'P') p++;
                  if (st === 'A') a++;
                  if (st === 'L') l++;
                  if (st === 'E') eCount++;
                });
                const totalActive = p + a + l + eCount;
                const rate = totalActive > 0 ? Math.round(((p + l * 0.5 + eCount * 0.8) / totalActive) * 100) : 100;
                const isChronic = a >= 2;

                return (
                  <tr key={entry.studentId} className={isChronic ? 'bg-rose-50/30' : 'hover:bg-stone-50/60'}>
                    <td className="py-2 px-3 font-semibold text-stone-900 sticky left-0 bg-white z-10 border-r border-stone-200 truncate max-w-[200px]">
                      <div className="flex items-center gap-1.5">
                        {isChronic && (
                          <span title="Chronic absence alert" className="text-rose-600">
                            ⚠️
                          </span>
                        )}
                        <span className="truncate">{entry.studentName}</span>
                      </div>
                    </td>

                    {/* Day Cells */}
                    {daysInMonth.map((d) => {
                      const st = getDayStatus(entry.studentId, d, idx);
                      const isToday = d === 18;

                      return (
                        <td
                          key={d}
                          className={`p-1 text-center font-mono font-bold text-[10px] border-r border-stone-100 ${
                            isToday ? 'ring-1 ring-amber-400 font-black' : ''
                          }`}
                        >
                          {st === 'P' && (
                            <span className="w-5 h-5 mx-auto rounded bg-emerald-100 text-emerald-800 flex items-center justify-center">
                              P
                            </span>
                          )}
                          {st === 'A' && (
                            <span className="w-5 h-5 mx-auto rounded bg-rose-600 text-white flex items-center justify-center font-bold">
                              A
                            </span>
                          )}
                          {st === 'L' && (
                            <span className="w-5 h-5 mx-auto rounded bg-amber-200 text-amber-900 flex items-center justify-center">
                              L
                            </span>
                          )}
                          {st === 'E' && (
                            <span className="w-5 h-5 mx-auto rounded bg-blue-100 text-blue-800 flex items-center justify-center">
                              E
                            </span>
                          )}
                          {st === 'OFF' && (
                            <span className="text-stone-300 text-[9px] font-normal">
                              —
                            </span>
                          )}
                        </td>
                      );
                    })}

                    <td className="py-2 px-2 text-center font-mono font-bold text-emerald-800 border-r border-stone-200">
                      {p}
                    </td>
                    <td className="py-2 px-2 text-center font-mono font-bold text-rose-800 border-r border-stone-200">
                      {a}
                    </td>
                    <td className="py-2 px-3 text-center">
                      <span
                        className={`inline-block px-2 py-0.5 rounded-full font-bold text-[11px] font-mono ${
                          rate >= 90
                            ? 'bg-emerald-100 text-emerald-800'
                            : rate >= 80
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {rate}%
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Legend */}
        <div className="p-3 bg-stone-50 border-t border-stone-200 flex flex-wrap items-center justify-between gap-3 text-xs text-stone-600">
          <div className="flex items-center gap-4 flex-wrap">
            <span className="font-semibold text-stone-700">Keys:</span>
            <span className="flex items-center gap-1"><span className="w-4 h-4 rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold flex items-center justify-center">P</span> Present</span>
            <span className="flex items-center gap-1"><span className="w-4 h-4 rounded bg-rose-600 text-white text-[10px] font-bold flex items-center justify-center">A</span> Absent</span>
            <span className="flex items-center gap-1"><span className="w-4 h-4 rounded bg-amber-200 text-amber-900 text-[10px] font-bold flex items-center justify-center">L</span> Late</span>
            <span className="flex items-center gap-1"><span className="w-4 h-4 rounded bg-blue-100 text-blue-800 text-[10px] font-bold flex items-center justify-center">E</span> Excused</span>
            <span className="flex items-center gap-1"><span className="text-stone-400 font-mono">—</span> Jummah / Weekend Off</span>
          </div>
          <div className="text-[11px] text-stone-500">
            Day 18 Safar 1448 is marked in gold highlight (Today).
          </div>
        </div>
      </div>
    </div>
  );
};
