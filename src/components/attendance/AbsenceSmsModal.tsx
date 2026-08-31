import React, { useState } from 'react';
import {
  MessageSquare,
  Radio,
  AlertTriangle,
  CheckCircle2,
  Phone,
  ShieldCheck,
  Send,
  Sparkles,
} from 'lucide-react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { DailyAttendanceSession, StudentAttendanceEntry } from '../../types';
import { useApp } from '../../context/AppContext';

interface AbsenceSmsModalProps {
  isOpen: boolean;
  onClose: () => void;
  session: DailyAttendanceSession;
  singleStudent?: StudentAttendanceEntry | null;
}

export const AbsenceSmsModal: React.FC<AbsenceSmsModalProps> = ({
  isOpen,
  onClose,
  session,
  singleStudent,
}) => {
  const { gatewayStats, sendAbsenceSmsAlerts, addToast, currentUser } = useApp();
  const [filterType, setFilterType] = useState<'Absent' | 'Late' | 'All'>('Absent');
  const [isSending, setIsSending] = useState(false);
  const [customRemark, setCustomRemark] = useState('');

  // Target recipients
  const targets = singleStudent
    ? [singleStudent]
    : session.entries.filter((e) => {
        if (filterType === 'Absent') return e.status === 'Absent';
        if (filterType === 'Late') return e.status === 'Late';
        return e.status === 'Absent' || e.status === 'Late';
      });

  const costPerMsg = 0.35;
  const estimatedCost = Math.round(targets.length * costPerMsg * 100) / 100;

  const sampleStudent = targets[0] || singleStudent || session.entries[0];
  const sampleMessage = `Assalamu Alaikum Haji ${sampleStudent?.guardianName || 'Guardian'}. This is an official notice from ${session.madrasaName} (Jimma Zone Islamic Affairs Supreme Council). Your child, ${sampleStudent?.studentName || 'Student'}, was recorded as ${sampleStudent?.status?.toUpperCase() || 'ABSENT'} for the ${session.shift} Tahfeez session on ${session.hijriDate} (${session.date}). ${customRemark ? `Note: ${customRemark}. ` : ''}For inquiries, contact the Council Desk at +251 47 111 8290.`;

  const handleSend = async () => {
    if (targets.length === 0) {
      addToast('No Recipients', 'No students match the criteria for SMS dispatch.', 'warning');
      return;
    }

    if (gatewayStats.smsBalanceETB < estimatedCost) {
      addToast(
        'Insufficient SMS Balance',
        `Current balance is ${gatewayStats.smsBalanceETB} ETB, but ${estimatedCost} ETB is required. Please top up via Telebirr in Communications Gateway.`,
        'error'
      );
      return;
    }

    setIsSending(true);
    try {
      await sendAbsenceSmsAlerts(session.id, singleStudent ? (singleStudent.status as any) : filterType);
      onClose();
    } catch (err) {
      addToast('Dispatch Error', 'Failed to communicate with SMS Gateway API.', 'error');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        singleStudent
          ? `Send Absence SMS: ${singleStudent.studentName}`
          : 'Broadcast Absence & Tardiness Alerts to Guardians'
      }
      size="lg"
    >
      <div className="space-y-5">
        {/* Gateway Banner */}
        <div className="p-3.5 bg-emerald-950 text-emerald-100 rounded-xl flex items-center justify-between border border-emerald-800">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-emerald-800 text-amber-300 flex items-center justify-center shrink-0">
              <Radio className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-semibold text-emerald-300 uppercase tracking-wider">
                Ethio Telecom Official SMS Gateway
              </div>
              <div className="text-xs text-white">
                Shortcode Sender ID: <span className="font-mono text-amber-300 font-bold">{gatewayStats.ethioShortCode}</span>
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-[10px] text-emerald-300">Live Gateway Balance</div>
            <div className="text-sm font-bold font-mono text-white">
              {gatewayStats.smsBalanceETB.toLocaleString()} ETB
            </div>
          </div>
        </div>

        {/* Target Filter (if batch) */}
        {!singleStudent && (
          <div>
            <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-2">
              Select Recipient Group
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setFilterType('Absent')}
                className={`p-3 rounded-lg border text-left cursor-pointer transition-all ${
                  filterType === 'Absent'
                    ? 'border-rose-500 bg-rose-50 text-rose-900 ring-2 ring-rose-400'
                    : 'border-stone-200 bg-white text-stone-700 hover:bg-stone-50'
                }`}
              >
                <div className="font-bold text-xs">Unexcused Absentees</div>
                <div className="text-[11px] text-stone-500 mt-0.5">
                  {session.entries.filter((e) => e.status === 'Absent').length} Student(s)
                </div>
              </button>

              <button
                type="button"
                onClick={() => setFilterType('Late')}
                className={`p-3 rounded-lg border text-left cursor-pointer transition-all ${
                  filterType === 'Late'
                    ? 'border-amber-500 bg-amber-50 text-amber-900 ring-2 ring-amber-400'
                    : 'border-stone-200 bg-white text-stone-700 hover:bg-stone-50'
                }`}
              >
                <div className="font-bold text-xs">Late Arrivals</div>
                <div className="text-[11px] text-stone-500 mt-0.5">
                  {session.entries.filter((e) => e.status === 'Late').length} Student(s)
                </div>
              </button>

              <button
                type="button"
                onClick={() => setFilterType('All')}
                className={`p-3 rounded-lg border text-left cursor-pointer transition-all ${
                  filterType === 'All'
                    ? 'border-stone-900 bg-stone-900 text-white ring-2 ring-stone-700'
                    : 'border-stone-200 bg-white text-stone-700 hover:bg-stone-50'
                }`}
              >
                <div className="font-bold text-xs">All Irregular (Abs + Late)</div>
                <div className="text-[11px] mt-0.5 opacity-80">
                  {session.entries.filter((e) => e.status === 'Absent' || e.status === 'Late').length} Total
                </div>
              </button>
            </div>
          </div>
        )}

        {/* Recipients List Preview */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-semibold text-stone-700 uppercase tracking-wider">
              Recipients Queue ({targets.length})
            </label>
            <span className="text-xs text-stone-500">
              Rate: 0.35 ETB / SMS
            </span>
          </div>

          {targets.length === 0 ? (
            <div className="p-4 bg-stone-50 rounded-lg border border-stone-200 text-center text-xs text-stone-500">
              No students found for the selected filter.
            </div>
          ) : (
            <div className="max-h-36 overflow-y-auto border border-stone-200 rounded-lg divide-y divide-stone-100 bg-stone-50/50">
              {targets.map((t) => (
                <div key={t.studentId} className="p-2.5 px-3 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-semibold text-stone-900">{t.studentName}</span>
                    <span className="text-stone-500 ml-2">Guardian: {t.guardianName}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-stone-600">{t.guardianPhone}</span>
                    <span
                      className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                        t.status === 'Absent'
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {t.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Custom Mu'allim Remark */}
        <div>
          <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
            Optional Teacher/Mu'allim Remark
          </label>
          <input
            type="text"
            placeholder="e.g. Please bring excuse note tomorrow morning before Fajr Halaqah"
            value={customRemark}
            onChange={(e) => setCustomRemark(e.target.value)}
            className="w-full text-xs p-2.5 bg-white border border-stone-300 rounded-lg text-stone-800 focus:ring-1 focus:ring-emerald-500"
          />
        </div>

        {/* Live SMS Template Preview */}
        <div>
          <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5">
            Ethio Telecom SMS Live Preview
          </label>
          <div className="p-3.5 bg-stone-900 text-stone-100 rounded-xl font-mono text-xs leading-relaxed border border-stone-800 shadow-inner">
            <div className="text-[10px] text-amber-400 font-sans font-bold uppercase tracking-wider mb-1.5 flex items-center justify-between">
              <span>SMS Body ({sampleMessage.length} chars • 1 segment)</span>
              <span>Sender: {gatewayStats.ethioShortCode}</span>
            </div>
            <p className="text-stone-200 select-all">{sampleMessage}</p>
          </div>
        </div>

        {/* Cost Summary & Actions */}
        <div className="pt-2 border-t border-stone-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="text-xs text-stone-600">
            Total Dispatch Cost:{' '}
            <strong className="text-emerald-700 font-mono text-sm font-bold">
              {estimatedCost} ETB
            </strong>{' '}
            for {targets.length} parent(s)
          </div>

          <div className="flex items-center gap-2 justify-end">
            <Button variant="outline" size="sm" onClick={onClose} disabled={isSending}>
              Cancel
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={handleSend}
              disabled={isSending || targets.length === 0}
              className="flex items-center gap-2 bg-emerald-800 hover:bg-emerald-900"
            >
              {isSending ? (
                <span>Transmitting via Ethio Telecom...</span>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>
                    Send SMS ({targets.length})
                  </span>
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};
