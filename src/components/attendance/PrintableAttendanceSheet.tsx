import React from 'react';
import { Printer, Download, X, Landmark, BookOpen, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { DailyAttendanceSession } from '../../types';

interface PrintableAttendanceSheetProps {
  isOpen: boolean;
  onClose: () => void;
  session: DailyAttendanceSession;
}

export const PrintableAttendanceSheet: React.FC<PrintableAttendanceSheetProps> = ({
  isOpen,
  onClose,
  session,
}) => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Official Council Daily Attendance Register (Print / PDF Export)"
      size="xl"
    >
      <div className="space-y-4">
        {/* Action Header */}
        <div className="flex items-center justify-between p-3 bg-stone-100 rounded-lg text-xs text-stone-700">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-700" />
            <span>
              Official standardized format compliant with Jimma Zone Islamic Education Directorate guidelines.
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handlePrint}
              className="flex items-center gap-1.5 bg-white shadow-xs"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Official Sheet</span>
            </Button>
          </div>
        </div>

        {/* The Printable Container */}
        <div
          id="printable-attendance-register"
          className="p-8 bg-white border-2 border-stone-800 rounded-lg text-stone-900 font-serif print:m-0 print:p-4 print:border-none shadow-sm"
        >
          {/* Header Bismillah & Seal */}
          <div className="text-center pb-4 border-b-2 border-stone-800">
            <div className="text-sm font-arabic font-bold text-stone-800 mb-1">
              بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
            </div>
            <div className="text-xs uppercase tracking-widest text-stone-600 font-sans font-bold">
              Federal Democratic Republic of Ethiopia • Oromia Region
            </div>
            <div className="text-lg font-bold font-serif tracking-tight text-stone-950 uppercase mt-0.5">
              Jimma Zone Islamic Affairs Supreme Council
            </div>
            <div className="text-sm font-arabic text-stone-800 font-bold">
              المجلس الأعلى للشؤون الإسلامية لمنطقة جيما — إدارة التعليم القرآني والتحفيظ
            </div>
            <div className="text-xs font-sans font-semibold text-emerald-800 uppercase tracking-wider mt-1">
              Official Daily Madrasa Attendance & Hifz Register • كشف الحضور والتحفيظ اليومي
            </div>
          </div>

          {/* Session Metadata Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 py-3 border-b border-stone-300 text-xs font-sans">
            <div>
              <span className="text-stone-500 block text-[10px] uppercase">Madrasa & Center</span>
              <strong className="text-stone-900">{session.madrasaName}</strong>
            </div>
            <div>
              <span className="text-stone-500 block text-[10px] uppercase">Halaqah / Class</span>
              <strong className="text-stone-900">{session.className}</strong>
            </div>
            <div>
              <span className="text-stone-500 block text-[10px] uppercase">Halaqah Mu'allim</span>
              <strong className="text-stone-900">{session.teacherName}</strong>
            </div>
            <div>
              <span className="text-stone-500 block text-[10px] uppercase">Shift & Date</span>
              <strong className="text-stone-900">{session.shift} • {session.hijriDate} ({session.date})</strong>
            </div>
          </div>

          {/* Summary Box */}
          <div className="my-3 p-2.5 bg-stone-50 border border-stone-300 rounded grid grid-cols-5 text-center text-xs font-sans">
            <div>
              <span className="text-stone-500 block text-[10px]">Total Enrolled</span>
              <strong className="text-stone-900 text-sm">{session.totalStudents}</strong>
            </div>
            <div>
              <span className="text-emerald-700 block text-[10px] font-bold">Present (حاضر)</span>
              <strong className="text-emerald-800 text-sm">{session.presentCount}</strong>
            </div>
            <div>
              <span className="text-rose-700 block text-[10px] font-bold">Absent (غائب)</span>
              <strong className="text-rose-800 text-sm">{session.absentCount}</strong>
            </div>
            <div>
              <span className="text-amber-700 block text-[10px] font-bold">Late (متأخر)</span>
              <strong className="text-amber-800 text-sm">{session.lateCount}</strong>
            </div>
            <div>
              <span className="text-blue-700 block text-[10px] font-bold">Attendance Rate</span>
              <strong className="text-stone-900 text-sm">{session.attendanceRate}%</strong>
            </div>
          </div>

          {/* Student Roster Table */}
          <div className="mt-3 overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs border border-stone-800 font-sans">
              <thead>
                <tr className="bg-stone-100 text-[10px] uppercase font-bold text-stone-800 border-b border-stone-800">
                  <th className="p-1.5 border-r border-stone-400 w-8 text-center">#</th>
                  <th className="p-1.5 border-r border-stone-400">Student Name (الاسم)</th>
                  <th className="p-1.5 border-r border-stone-400 w-24 text-center">Status</th>
                  <th className="p-1.5 border-r border-stone-400 w-24 text-center">Arrival Time</th>
                  <th className="p-1.5 border-r border-stone-400 min-w-[140px]">Today's Sabaq (الدرس)</th>
                  <th className="p-1.5 border-r border-stone-400 w-24 text-center">Recited?</th>
                  <th className="p-1.5 border-r border-stone-400">Guardian / Contact</th>
                  <th className="p-1.5">Mu'allim Remark</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-300">
                {session.entries.map((e, idx) => (
                  <tr key={e.studentId} className={idx % 2 === 1 ? 'bg-stone-50/50' : 'bg-white'}>
                    <td className="p-1.5 text-center font-mono border-r border-stone-300">{idx + 1}</td>
                    <td className="p-1.5 border-r border-stone-300 font-medium">
                      <div>{e.studentName}</div>
                      {e.arabicName && <div className="text-[10px] text-stone-500 font-arabic">{e.arabicName}</div>}
                    </td>
                    <td className="p-1.5 text-center font-bold border-r border-stone-300">
                      {e.status === 'Present' && <span className="text-emerald-700">✓ Present</span>}
                      {e.status === 'Absent' && <span className="text-rose-700">✗ ABSENT</span>}
                      {e.status === 'Late' && <span className="text-amber-700">△ Late ({e.lateMinutes || 15}m)</span>}
                      {e.status === 'Excused' && <span className="text-blue-700">○ Excused</span>}
                    </td>
                    <td className="p-1.5 text-center font-mono border-r border-stone-300">
                      {e.arrivalTime || '—'}
                    </td>
                    <td className="p-1.5 border-r border-stone-300 text-[11px]">
                      {e.currentLesson || 'Surah review'}
                    </td>
                    <td className="p-1.5 text-center border-r border-stone-300 font-semibold">
                      {e.sabaqRecited ? (
                        <span className="text-emerald-700">Yes ({e.sabaqRating || 'Good'})</span>
                      ) : (
                        <span className="text-stone-400">No</span>
                      )}
                    </td>
                    <td className="p-1.5 border-r border-stone-300 text-[11px]">
                      <div>{e.guardianName}</div>
                      <div className="font-mono text-stone-500 text-[10px]">{e.guardianPhone}</div>
                    </td>
                    <td className="p-1.5 text-[11px] text-stone-600">
                      {e.notes || e.absenceReason || '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Session Notes & Signature Footer */}
          <div className="mt-4 pt-3 border-t border-stone-400 text-xs font-sans">
            <div className="mb-4">
              <span className="font-bold text-stone-800">Mu'allim Daily Remarks: </span>
              <span className="text-stone-700 italic">{session.notes || 'Halaqah conducted satisfactorily.'}</span>
            </div>

            <div className="grid grid-cols-3 gap-6 pt-4 border-t border-stone-300">
              <div className="text-center">
                <div className="h-12 border-b border-dashed border-stone-400 mb-1" />
                <div className="font-bold text-stone-900">{session.teacherName}</div>
                <div className="text-[10px] text-stone-500">Halaqah Sheikh / Mu'allim (توقيع المعلم)</div>
              </div>

              <div className="text-center">
                <div className="h-12 border-b border-dashed border-stone-400 mb-1" />
                <div className="font-bold text-stone-900">Sheikh Abdullah Al-Jimmawi</div>
                <div className="text-[10px] text-stone-500">Madrasa Headmaster / Mudir (مدير المركز)</div>
              </div>

              <div className="text-center relative">
                <div className="h-12 border-b border-dashed border-stone-400 mb-1 flex items-center justify-center">
                  <div className="w-10 h-10 rounded-full border border-emerald-700/50 flex items-center justify-center text-[8px] text-emerald-800 font-bold uppercase opacity-60">
                    Council Seal
                  </div>
                </div>
                <div className="font-bold text-stone-900">Education Directorate Inspector</div>
                <div className="text-[10px] text-stone-500">Jimma Supreme Council (مفتش المجلس)</div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Controls */}
        <div className="flex justify-end gap-2 pt-2 border-t border-stone-200">
          <Button variant="outline" size="sm" onClick={onClose}>
            Close
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={handlePrint}
            className="flex items-center gap-1.5 bg-emerald-800 hover:bg-emerald-900"
          >
            <Printer className="w-4 h-4" />
            <span>Print Sheet</span>
          </Button>
        </div>
      </div>
    </Modal>
  );
};
