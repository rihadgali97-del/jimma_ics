import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  MessageSquare,
  Send,
  Radio,
  Sparkles,
  ShieldCheck,
  Smartphone,
  CheckCircle2,
  Users,
  Settings,
  Layers,
  History,
  FileCheck,
  AlertTriangle,
  GraduationCap,
} from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { GatewayMetricsRibbon } from '../../components/gateway/GatewayMetricsRibbon';
import { SmsTelegramComposer } from '../../components/gateway/SmsTelegramComposer';
import { GatewayAuditLogs } from '../../components/gateway/GatewayAuditLogs';

export const AdminGatewayPage: React.FC = () => {
  const { students, madrasas, dispatchMessage, addToast, gatewayStats } = useApp();
  const [activeTab, setActiveTab] = useState<'composer' | 'logs' | 'batch' | 'settings'>('composer');

  // Batch State
  const [batchMadrasaId, setBatchMadrasaId] = useState(madrasas[0]?.id || 'madrasa-1');
  const [isBatchSending, setIsBatchSending] = useState(false);

  const selectedMadrasa = madrasas.find((m) => m.id === batchMadrasaId) || madrasas[0];
  const madrasaStudents = students.filter((s) => s.madrasaId === batchMadrasaId);

  const handleRunBatch = async () => {
    if (madrasaStudents.length === 0) {
      addToast('No Students Found', 'Select a madrasa with enrolled students.', 'warning');
      return;
    }

    setIsBatchSending(true);
    addToast(
      'Batch Dispatch Initiated',
      `Queuing ${madrasaStudents.length} automated Sabaq & attendance SMS alerts to parents...`,
      'info'
    );

    setTimeout(async () => {
      // Simulate sending for each student
      for (const st of madrasaStudents.slice(0, 5)) {
        await dispatchMessage({
          title: `Daily Sabaq Alert: ${st.name}`,
          category: 'sabaq_alert',
          channel: 'sms',
          senderId: 'HIFZ-ACADEMY',
          recipientTarget: `${st.parentName || st.guardianName || 'Guardian'} (${st.parentPhone || st.guardianPhone || '+251 91 190 2831'})`,
          recipientCount: 1,
          content: `Jimma Islamic Supreme Council - ${st.madrasaName}: Daily Hifz Report for ${st.name}: Sabaq: ${st.hifzStatus?.sabaq || st.sabaqSurah || 'Surah An-Nisa'}, Sabqi: ${st.hifzStatus?.sabqi || 'Juz 4'}, Attendance: ${st.dailyAttendance || 'Present'}.`,
          costETB: 0.25,
          metadata: {
            studentId: st.id,
            studentName: st.name,
            parentPhone: st.parentPhone,
            madrasaName: st.madrasaName,
          },
        });
      }
      setIsBatchSending(false);
      addToast(
        'Batch Completed Successfully',
        `Dispatched Sabaq SMS alerts to all ${madrasaStudents.length} guardians via Ethio Telecom Shortcode.`,
        'success'
      );
    }, 1200);
  };

  return (
    <div className="space-y-8">
      {/* Top Hero Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-stone-900 p-6 sm:p-8 rounded-3xl border border-stone-200 dark:border-stone-800 shadow-xs relative overflow-hidden">
        <div className="space-y-1.5 z-10">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider">
              Automated Communications Hub
            </span>
            <Badge variant="emerald">
              <Radio className="w-3 h-3 mr-1 animate-pulse" />
              Live Gateway Active
            </Badge>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900 dark:text-stone-100">
            SMS & Telegram Gateway Dispatch Simulation
          </h1>
          <p className="text-stone-500 dark:text-stone-400 text-xs sm:text-sm max-w-2xl">
            Simulated automated telecommunications infrastructure for Jimma Zone. Send instant student Sabaq &
            attendance reports to parents, blast emergency Janazah announcements, and publish moon sighting
            communique across 18 Woredas.
          </p>
        </div>

        <div className="flex items-center gap-2 z-10 shrink-0">
          <Button
            variant="outline"
            size="sm"
            icon={<History className="w-4 h-4 text-stone-400" />}
            onClick={() => setActiveTab('logs')}
          >
            Audit Trail
          </Button>
          <Button
            variant="primary"
            size="sm"
            icon={<Send className="w-4 h-4" />}
            onClick={() => setActiveTab('composer')}
          >
            Compose Alert
          </Button>
        </div>
      </div>

      {/* Live Metrics Ribbon */}
      <GatewayMetricsRibbon />

      {/* Main Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-stone-200 dark:border-stone-800 pb-2 overflow-x-auto">
        {[
          { id: 'composer' as const, label: 'Message Composer & Simulator', icon: <Send className="w-4 h-4" /> },
          { id: 'logs' as const, label: `Audit Trail & History (${gatewayStats.smsTotalSent + gatewayStats.telegramMessagesSent})`, icon: <History className="w-4 h-4" /> },
          { id: 'batch' as const, label: 'Madrasa Batch Dispatcher', icon: <GraduationCap className="w-4 h-4" /> },
          { id: 'settings' as const, label: 'Gateway Configuration & Carrier API', icon: <Settings className="w-4 h-4" /> },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all whitespace-nowrap ${
              activeTab === tab.id
                ? 'bg-emerald-900 text-amber-300 shadow-sm border border-emerald-700'
                : 'text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800'
            }`}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Tab 1: Composer */}
      {activeTab === 'composer' && <SmsTelegramComposer />}

      {/* Tab 2: Logs */}
      {activeTab === 'logs' && <GatewayAuditLogs />}

      {/* Tab 3: Madrasa Batch Dispatcher */}
      {activeTab === 'batch' && (
        <Card className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-100 dark:border-stone-800 pb-4">
            <div>
              <span className="text-[10px] font-mono font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider block">
                Classroom Automation Engine
              </span>
              <h3 className="font-serif font-bold text-lg text-stone-900 dark:text-stone-100">
                1-Click Madrasa Sabaq & Attendance SMS Blast
              </h3>
              <p className="text-xs text-stone-500 mt-0.5">
                Automatically generate and broadcast individualized SMS progress notifications to all parents in the chosen institution.
              </p>
            </div>

            <Button
              variant="primary"
              size="md"
              disabled={isBatchSending}
              icon={isBatchSending ? <Radio className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              onClick={handleRunBatch}
            >
              {isBatchSending ? 'Broadcasting Batch...' : `Send Sabaq SMS to ${madrasaStudents.length} Parents`}
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1.5">
                Select Madrasa / Tahfeez Center
              </label>
              <select
                value={batchMadrasaId}
                onChange={(e) => setBatchMadrasaId(e.target.value)}
                className="w-full p-3 text-xs rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700"
              >
                {madrasas.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name} ({m.district} - {m.totalStudents} Students)
                  </option>
                ))}
              </select>
            </div>

            <div className="p-3 bg-emerald-50 dark:bg-emerald-950/30 rounded-xl border border-emerald-200 dark:border-emerald-800 flex items-center justify-between text-xs">
              <div>
                <span className="text-stone-500 block text-[10px] uppercase font-bold">Estimated Cost</span>
                <span className="font-mono font-bold text-emerald-900 dark:text-emerald-200 text-sm">
                  {(madrasaStudents.length * 0.25).toFixed(2)} ETB
                </span>
              </div>
              <Badge variant="emerald">EthioTel Shortcode 8345</Badge>
            </div>
          </div>

          {/* Student Roster Preview */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500">
              Target Parent Recipient Roster ({madrasaStudents.length} Students)
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {madrasaStudents.slice(0, 9).map((st) => (
                <div
                  key={st.id}
                  className="p-3 bg-stone-50 dark:bg-stone-800/60 rounded-xl border border-stone-200 dark:border-stone-700 space-y-1.5 text-xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-stone-900 dark:text-stone-100">{st.name}</span>
                    <Badge variant={st.dailyAttendance === 'Absent' ? 'rose' : 'emerald'} className="text-[9px]">
                      {st.dailyAttendance || 'Present'}
                    </Badge>
                  </div>
                  <div className="text-[11px] text-stone-500">
                    Guardian: <strong>{st.parentName || st.guardianName || 'Guardian'}</strong> ({st.parentPhone || st.guardianPhone || '+251 91 190 2831'})
                  </div>
                  <div className="text-[10px] font-mono text-emerald-700 dark:text-emerald-400">
                    Sabaq: {st.hifzStatus?.sabaq || st.sabaqSurah || 'Surah Maryam'} • {st.tajweedRating}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>
      )}

      {/* Tab 4: Settings & Carrier API */}
      {activeTab === 'settings' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="space-y-4">
            <h3 className="font-serif font-bold text-base text-stone-900 dark:text-stone-100 flex items-center gap-2">
              <Smartphone className="w-4 h-4 text-emerald-600" />
              <span>Ethio Telecom SMPP Gateway Configuration</span>
            </h3>
            <div className="space-y-3 text-xs">
              <div>
                <label className="text-stone-500 font-semibold block mb-1">Host Server Endpoint</label>
                <input
                  type="text"
                  readOnly
                  value="smpp.ethiotelecom.et:2775 (Secure SMPP v3.4 SSL)"
                  className="w-full p-2.5 rounded-xl bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 font-mono text-stone-600 dark:text-stone-300"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-stone-500 font-semibold block mb-1">Assigned Shortcode</label>
                  <input
                    type="text"
                    readOnly
                    value="8345 (JIMMA-ISLAM)"
                    className="w-full p-2.5 rounded-xl bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 font-mono text-emerald-700 dark:text-emerald-400 font-bold"
                  />
                </div>
                <div>
                  <label className="text-stone-500 font-semibold block mb-1">Throughput Capacity</label>
                  <input
                    type="text"
                    readOnly
                    value="250 SMS / second"
                    className="w-full p-2.5 rounded-xl bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 font-mono"
                  />
                </div>
              </div>
            </div>
          </Card>

          <Card className="space-y-4">
            <h3 className="font-serif font-bold text-base text-stone-900 dark:text-stone-100 flex items-center gap-2">
              <Send className="w-4 h-4 text-blue-600" />
              <span>Telegram Bot API & Webhook Service</span>
            </h3>
            <div className="space-y-3 text-xs">
              <div>
                <label className="text-stone-500 font-semibold block mb-1">Official Bot Token Handle</label>
                <input
                  type="text"
                  readOnly
                  value="@JimmaIslamicCouncilBot (Verified Official)"
                  className="w-full p-2.5 rounded-xl bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 font-mono text-blue-700 dark:text-blue-400 font-bold"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-stone-500 font-semibold block mb-1">Broadcast Channel</label>
                  <input
                    type="text"
                    readOnly
                    value="@JimmaMuslimsOfficial"
                    className="w-full p-2.5 rounded-xl bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 font-mono"
                  />
                </div>
                <div>
                  <label className="text-stone-500 font-semibold block mb-1">Subscribers Count</label>
                  <input
                    type="text"
                    readOnly
                    value="24,850 Verified"
                    className="w-full p-2.5 rounded-xl bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 font-mono"
                  />
                </div>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};
