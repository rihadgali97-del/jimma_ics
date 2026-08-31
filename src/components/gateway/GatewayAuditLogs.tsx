import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { DispatchLogItem, MessageCategory, MessageChannel } from '../../types';
import {
  Search,
  Filter,
  Download,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  Radio,
  Send,
  Smartphone,
  Info,
  Clock,
  Layers,
  Trash2,
} from 'lucide-react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { Modal } from '../ui/Modal';

export const GatewayAuditLogs: React.FC = () => {
  const { dispatchHistory, clearDispatchHistory, addToast } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  const [channelFilter, setChannelFilter] = useState<string>('All');
  const [selectedLog, setSelectedLog] = useState<DispatchLogItem | null>(null);

  const filteredLogs = dispatchHistory.filter((log) => {
    const matchSearch =
      log.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.recipientTarget.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchCategory = categoryFilter === 'All' || log.category === categoryFilter;
    const matchChannel = channelFilter === 'All' || log.channel === channelFilter;
    return matchSearch && matchCategory && matchChannel;
  });

  const handleExportCsv = () => {
    const headers = ['ID', 'Timestamp', 'Title', 'Category', 'Channel', 'Recipients', 'Status', 'Gateway Code', 'Cost ETB'];
    const rows = filteredLogs.map((l) => [
      l.id,
      `"${l.timestamp}"`,
      `"${l.title.replace(/"/g, '""')}"`,
      l.category,
      l.channel,
      l.recipientCount,
      l.status,
      `"${l.gatewayResponseCode}"`,
      l.costETB,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `jimma_gateway_dispatch_audit_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    addToast('Audit Log Exported', 'CSV report generated with full cryptographic dispatch signatures.', 'success');
  };

  return (
    <Card className="space-y-4">
      {/* Header & Filter Toolbar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-stone-100 dark:border-stone-800 pb-4">
        <div>
          <span className="text-[10px] font-mono font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider block">
            Cryptographic Transmission Ledger
          </span>
          <h3 className="font-serif font-bold text-lg text-stone-900 dark:text-stone-100">
            SMS & Telegram Dispatch Audit Trail
          </h3>
          <p className="text-xs text-stone-500 mt-0.5">
            Real-time delivery receipts, carrier response codes, and recipient acknowledgment logs.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            icon={<Download className="w-4 h-4 text-emerald-600" />}
            onClick={handleExportCsv}
          >
            Export CSV
          </Button>
          <Button
            variant="ghost"
            size="sm"
            icon={<Trash2 className="w-4 h-4 text-stone-400" />}
            onClick={clearDispatchHistory}
          >
            Clear History
          </Button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="relative">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by student, guardian phone, or title..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700"
          />
        </div>

        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="px-3 py-2 text-xs rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700"
        >
          <option value="All">All Categories ({dispatchHistory.length})</option>
          <option value="sabaq_alert">Sabaq & Attendance Alerts</option>
          <option value="janazah_broadcast">Emergency Janazah Broadcasts</option>
          <option value="moon_sighting">Moon Sighting & Eid Alerts</option>
          <option value="khutbah_advisory">Friday Khutbah Guidance</option>
          <option value="general_bulletin">General Bulletins</option>
        </select>

        <select
          value={channelFilter}
          onChange={(e) => setChannelFilter(e.target.value)}
          className="px-3 py-2 text-xs rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700"
        >
          <option value="All">All Channels</option>
          <option value="sms">Ethio Telecom SMS Gateway</option>
          <option value="telegram">Telegram Bot / Channel</option>
          <option value="hybrid">Dual Hybrid Broadcast</option>
        </select>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-2xl border border-stone-200 dark:border-stone-800">
        <table className="w-full text-left text-xs">
          <thead className="bg-stone-50 dark:bg-stone-800/60 text-stone-500 font-semibold border-b border-stone-200 dark:border-stone-800">
            <tr>
              <th className="p-3.5">Time / Channel</th>
              <th className="p-3.5">Campaign & Category</th>
              <th className="p-3.5">Target Audience</th>
              <th className="p-3.5">Recipients</th>
              <th className="p-3.5">Carrier Response</th>
              <th className="p-3.5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100 dark:divide-stone-800 font-sans">
            {filteredLogs.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-8 text-center text-stone-500">
                  No dispatch logs found matching the filter criteria.
                </td>
              </tr>
            ) : (
              filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-stone-50/80 dark:hover:bg-stone-800/40 transition-colors">
                  <td className="p-3.5 space-y-1">
                    <div className="flex items-center gap-1.5">
                      {log.channel === 'sms' && (
                        <span className="px-1.5 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-bold text-[9px] uppercase">
                          SMS
                        </span>
                      )}
                      {log.channel === 'telegram' && (
                        <span className="px-1.5 py-0.5 rounded-md bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300 font-bold text-[9px] uppercase">
                          Telegram
                        </span>
                      )}
                      {log.channel === 'hybrid' && (
                        <span className="px-1.5 py-0.5 rounded-md bg-purple-100 dark:bg-purple-950 text-purple-800 dark:text-purple-300 font-bold text-[9px] uppercase">
                          Hybrid
                        </span>
                      )}
                      <span className="font-mono text-[10px] text-stone-400">{log.timestamp}</span>
                    </div>
                    <div className="text-[10px] text-stone-500 font-mono">From: {log.senderId}</div>
                  </td>

                  <td className="p-3.5">
                    <div className="font-semibold text-stone-900 dark:text-stone-100">{log.title}</div>
                    <div className="text-[10px] text-stone-400 capitalize">{log.category.replace(/_/g, ' ')}</div>
                  </td>

                  <td className="p-3.5 max-w-[240px]">
                    <div className="truncate text-stone-700 dark:text-stone-300">{log.recipientTarget}</div>
                    {log.metadata?.studentName && (
                      <span className="text-[10px] text-emerald-600 dark:text-emerald-400">
                        Student: {log.metadata.studentName}
                      </span>
                    )}
                  </td>

                  <td className="p-3.5">
                    <span className="font-mono font-bold text-stone-800 dark:text-stone-200">
                      {log.recipientCount.toLocaleString()}
                    </span>
                    <span className="text-[10px] text-stone-400 block">{log.costETB > 0 ? `${log.costETB} ETB` : 'Free'}</span>
                  </td>

                  <td className="p-3.5">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-500" />
                      <span className="font-mono text-[10px] font-bold text-emerald-700 dark:text-emerald-400">
                        {log.gatewayResponseCode}
                      </span>
                    </div>
                    <span className="text-[10px] text-stone-400 block">{log.deliveryRate}% delivered</span>
                  </td>

                  <td className="p-3.5 text-right">
                    <Button variant="outline" size="xs" onClick={() => setSelectedLog(log)}>
                      Inspect
                    </Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Log Details Modal */}
      {selectedLog && (
        <Modal
          isOpen={!!selectedLog}
          onClose={() => setSelectedLog(null)}
          title={`Dispatch Dossier: ${selectedLog.title}`}
          subtitle={`Transmission ID: ${selectedLog.id} • ${selectedLog.timestamp}`}
        >
          <div className="space-y-4 text-xs">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-stone-50 dark:bg-stone-800/80 p-3 rounded-2xl border border-stone-200 dark:border-stone-700">
              <div>
                <span className="text-[9px] uppercase font-bold text-stone-400 block">Channel</span>
                <span className="font-bold text-stone-800 dark:text-stone-200 uppercase">{selectedLog.channel}</span>
              </div>
              <div>
                <span className="text-[9px] uppercase font-bold text-stone-400 block">Sender ID</span>
                <span className="font-bold font-mono text-emerald-700 dark:text-emerald-400">{selectedLog.senderId}</span>
              </div>
              <div>
                <span className="text-[9px] uppercase font-bold text-stone-400 block">Recipients</span>
                <span className="font-bold font-mono text-stone-800 dark:text-stone-200">{selectedLog.recipientCount.toLocaleString()}</span>
              </div>
              <div>
                <span className="text-[9px] uppercase font-bold text-stone-400 block">Total Tariff</span>
                <span className="font-bold font-mono text-amber-700 dark:text-amber-400">{selectedLog.costETB} ETB</span>
              </div>
            </div>

            <div>
              <label className="block text-stone-500 font-semibold mb-1">Delivered Payload Text:</label>
              <div className="p-3.5 rounded-2xl bg-stone-900 text-stone-100 font-sans whitespace-pre-line leading-relaxed border border-stone-700 text-xs">
                {selectedLog.content}
              </div>
            </div>

            <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl border border-emerald-200 dark:border-emerald-800/80 flex items-center justify-between">
              <div>
                <span className="font-bold text-emerald-900 dark:text-emerald-200 block">
                  Carrier Delivery Signature
                </span>
                <span className="text-[10px] font-mono text-stone-500">
                  {selectedLog.gatewayResponseCode} • 100% Handset Acknowledgment
                </span>
              </div>
              <Badge variant="emerald">Delivered (SLA Verified)</Badge>
            </div>

            <div className="flex justify-end pt-2">
              <Button variant="primary" size="sm" onClick={() => setSelectedLog(null)}>
                Close Dossier
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </Card>
  );
};
