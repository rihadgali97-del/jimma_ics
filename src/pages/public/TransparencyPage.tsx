import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  ShieldCheck,
  FileText,
  Download,
  CheckCircle2,
  TrendingUp,
  Wallet,
  ArrowUpRight,
  ArrowDownRight,
  Filter,
  Search,
  Printer,
  Calendar,
  ExternalLink,
  Info,
} from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { IncomeExpenseChart, FundDistributionCard } from '../../components/charts/FinancialCharts';

export const TransparencyPage: React.FC = () => {
  const { funds, transactions, documents, addToast } = useApp();

  const [selectedFundFilter, setSelectedFundFilter] = useState('All');
  const [transactionSearch, setTransactionSearch] = useState('');
  const [selectedTypeFilter, setSelectedTypeFilter] = useState<'All' | 'Income' | 'Expense'>('All');
  const [activeDocForPreview, setActiveDocForPreview] = useState<any | null>(null);

  const totalAllocated = funds.reduce((acc, f) => acc + f.allocatedETB, 0);
  const totalDisbursed = funds.reduce((acc, f) => acc + f.disbursedETB, 0);

  const handleDownload = (doc: any) => {
    // Generate simple simulated download file
    const content = `JIMMA ZONE ISLAMIC AFFAIRS SUPREME COUNCIL\nOFFICIAL PUBLIC AUDIT & GOVERNANCE RECORD\n\nTitle: ${doc.title}\nCategory: ${doc.category}\nDate of Issue: ${doc.date}\nFile Reference: ${doc.id}\nVerification Hash: JZ-SHA256-${Math.random().toString(36).substring(2, 10).toUpperCase()}\n\nDescription:\n${doc.description}\n\nStatus: Certified Public Document`;
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${doc.title.replace(/\s+/g, '_')}_AuditDoc.txt`;
    link.click();
    URL.revokeObjectURL(url);

    addToast('Document Downloaded', `Exported: "${doc.title}"`, 'success');
  };

  const filteredTransactions = transactions.filter((tx) => {
    const matchesSearch =
      tx.referenceNo.toLowerCase().includes(transactionSearch.toLowerCase()) ||
      tx.description.toLowerCase().includes(transactionSearch.toLowerCase()) ||
      tx.fundName.toLowerCase().includes(transactionSearch.toLowerCase());
    const matchesFund = selectedFundFilter === 'All' || tx.fundName === selectedFundFilter;
    const matchesType = selectedTypeFilter === 'All' || tx.type === selectedTypeFilter;
    return matchesSearch && matchesFund && matchesType;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header */}
      <div className="border-b border-stone-200 dark:border-stone-800 pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-teal-700 dark:text-teal-400 uppercase tracking-wider mb-2">
            <ShieldCheck className="w-4 h-4" />
            <span>Open Governance Ledger</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-stone-900 dark:text-stone-100">
            Financial Transparency & Public Audits
          </h1>
          <p className="text-stone-500 dark:text-stone-400 text-sm sm:text-base mt-1 max-w-2xl">
            Real-time multi-fund accounting, annual external audit statements, and verifiable donation flows for the Jimma Muslim Community.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="emerald" size="md">
            Audited by Chartered Accountants
          </Badge>
          <Button
            variant="outline"
            size="sm"
            icon={<Printer className="w-3.5 h-3.5" />}
            onClick={() => window.print()}
            className="text-xs"
          >
            Print Ledger
          </Button>
        </div>
      </div>

      {/* Top 3 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <Card className="space-y-1">
          <span className="text-xs font-bold text-stone-400 uppercase tracking-wider">
            Total Fund Inflow / Balance
          </span>
          <div className="text-3xl font-serif font-bold text-stone-900 dark:text-stone-100 font-mono">
            ETB {(totalAllocated / 1000000).toFixed(2)}M
          </div>
          <p className="text-xs text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
            <ArrowUpRight className="w-4 h-4" />
            <span>Across 5 active charitable funds</span>
          </p>
        </Card>

        <Card className="space-y-1">
          <span className="text-xs font-bold text-stone-400 uppercase tracking-wider">
            Community Disbursals
          </span>
          <div className="text-3xl font-serif font-bold text-stone-900 dark:text-stone-100 font-mono">
            ETB {(totalDisbursed / 1000000).toFixed(2)}M
          </div>
          <p className="text-xs text-amber-600 dark:text-amber-400 flex items-center gap-1">
            <ArrowDownRight className="w-4 h-4" />
            <span>Disbursed to mosques, schools & students</span>
          </p>
        </Card>

        <Card className="space-y-1">
          <span className="text-xs font-bold text-stone-400 uppercase tracking-wider">
            Execution Efficiency
          </span>
          <div className="text-3xl font-serif font-bold text-emerald-700 dark:text-emerald-400 font-mono">
            96.4%
          </div>
          <p className="text-xs text-stone-500 dark:text-stone-400">
            Direct program expenditure ratio
          </p>
        </Card>
      </div>

      {/* Financial Trajectory Chart & Fund Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8">
          <Card className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-serif font-bold text-lg text-stone-900 dark:text-stone-100">
                  12-Month Inflow & Outflow Trajectory
                </h3>
                <p className="text-xs text-stone-500">
                  Monthly revenues, Zakat donations, and programmatic expenses in Jimma Zone.
                </p>
              </div>
            </div>
            <IncomeExpenseChart />
          </Card>
        </div>

        <div className="lg:col-span-4">
          <Card className="space-y-4">
            <h3 className="font-serif font-bold text-lg text-stone-900 dark:text-stone-100">
              Active Fund Allocations
            </h3>
            <FundDistributionCard funds={funds} />
          </Card>
        </div>
      </div>

      {/* Downloadable Audit Reports & Documents */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-serif font-bold text-xl text-stone-900 dark:text-stone-100">
            Official Audit Statements & Governance Charters
          </h3>
          <span className="text-xs text-stone-400">Certified PDFs & Reports</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {documents.map((doc) => (
            <Card key={doc.id} className="flex flex-col justify-between hover:border-emerald-300 dark:hover:border-emerald-700 transition-colors">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Badge variant="slate">{doc.category}</Badge>
                  <span className="text-[11px] text-stone-400 font-mono">{doc.fileSize}</span>
                </div>
                <h4 className="font-serif font-bold text-base text-stone-900 dark:text-stone-100">
                  {doc.title}
                </h4>
                <p className="text-xs text-stone-500 dark:text-stone-400 line-clamp-2">
                  {doc.description}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between gap-2">
                <span className="text-[11px] text-stone-400 font-mono">Issued: {doc.date}</span>
                <div className="flex items-center gap-1.5">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setActiveDocForPreview(doc)}
                    className="text-xs"
                  >
                    Preview
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    icon={<Download className="w-3.5 h-3.5" />}
                    onClick={() => handleDownload(doc)}
                    className="text-xs"
                  >
                    {doc.fileType}
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Interactive Public General Ledger Table */}
      <Card className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-100 dark:border-stone-800 pb-4">
          <div>
            <h3 className="font-serif font-bold text-lg text-stone-900 dark:text-stone-100">
              Interactive General Ledger Feed
            </h3>
            <p className="text-xs text-stone-500">
              Filtered view of incoming donations, Awqaf rents, and charitable disbursals.
            </p>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative w-full sm:w-48">
              <Search className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search transactions..."
                value={transactionSearch}
                onChange={(e) => setTransactionSearch(e.target.value)}
                className="w-full pl-7 pr-2.5 py-1.5 text-xs rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 outline-hidden"
              />
            </div>

            <select
              value={selectedTypeFilter}
              onChange={(e: any) => setSelectedTypeFilter(e.target.value)}
              className="px-2.5 py-1.5 text-xs rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-800 dark:text-stone-200"
            >
              <option value="All">All Types</option>
              <option value="Income">Income (+)</option>
              <option value="Expense">Disbursals (-)</option>
            </select>

            <select
              value={selectedFundFilter}
              onChange={(e) => setSelectedFundFilter(e.target.value)}
              className="px-2.5 py-1.5 text-xs rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-800 dark:text-stone-200"
            >
              <option value="All">All Funds</option>
              {funds.map((f) => (
                <option key={f.id} value={f.name}>
                  {f.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-50 dark:bg-stone-800 text-stone-500 uppercase text-[10px] font-bold">
              <tr>
                <th className="p-3">Ref No</th>
                <th className="p-3">Date</th>
                <th className="p-3">Type</th>
                <th className="p-3">Fund Category</th>
                <th className="p-3">Description & Beneficiary</th>
                <th className="p-3 text-right">Amount (ETB)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 dark:divide-stone-800 font-medium">
              {filteredTransactions.length > 0 ? (
                filteredTransactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-stone-50/50 dark:hover:bg-stone-800/50">
                    <td className="p-3 font-mono text-stone-500">{tx.referenceNo}</td>
                    <td className="p-3 font-mono">{tx.date}</td>
                    <td className="p-3">
                      <Badge variant={tx.type === 'Income' ? 'emerald' : 'rose'}>
                        {tx.type}
                      </Badge>
                    </td>
                    <td className="p-3 font-semibold text-stone-800 dark:text-stone-200">
                      {tx.fundName}
                    </td>
                    <td className="p-3 text-stone-600 dark:text-stone-400 truncate max-w-xs">
                      {tx.description}
                    </td>
                    <td
                      className={`p-3 text-right font-mono font-bold ${
                        tx.type === 'Income'
                          ? 'text-emerald-700 dark:text-emerald-400'
                          : 'text-rose-700 dark:text-rose-400'
                      }`}
                    >
                      {tx.type === 'Income' ? '+' : '-'}
                      {tx.amountETB.toLocaleString()}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="p-6 text-center text-stone-400">
                    No transactions match your current search and filter criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Document Preview Modal */}
      {activeDocForPreview && (
        <Modal
          isOpen={!!activeDocForPreview}
          onClose={() => setActiveDocForPreview(null)}
          title={activeDocForPreview.title}
          size="md"
        >
          <div className="space-y-4">
            <div className="p-3 bg-stone-50 dark:bg-stone-800 rounded-xl border border-stone-200 dark:border-stone-700 text-xs space-y-1.5">
              <div className="flex justify-between">
                <span className="text-stone-400">Category:</span>
                <span className="font-semibold text-stone-900 dark:text-stone-100">{activeDocForPreview.category}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-400">Date of Ratification:</span>
                <span className="font-semibold text-stone-900 dark:text-stone-100">{activeDocForPreview.date}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-400">File Size:</span>
                <span className="font-semibold text-stone-900 dark:text-stone-100">{activeDocForPreview.fileSize} ({activeDocForPreview.fileType})</span>
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-xs text-stone-700 dark:text-stone-300 uppercase tracking-wider mb-1">
                Document Summary & Executive Brief
              </h4>
              <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 leading-relaxed">
                {activeDocForPreview.description}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/80 flex items-start gap-2.5 text-xs text-emerald-800 dark:text-emerald-300">
              <ShieldCheck className="w-4 h-4 shrink-0 text-emerald-600 mt-0.5" />
              <span>
                This document is certified authentic by the Jimma Zone Supreme Islamic Council Governance Board and external chartered auditors.
              </span>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button variant="secondary" size="sm" onClick={() => setActiveDocForPreview(null)}>
                Close
              </Button>
              <Button
                variant="primary"
                size="sm"
                icon={<Download className="w-3.5 h-3.5" />}
                onClick={() => {
                  handleDownload(activeDocForPreview);
                  setActiveDocForPreview(null);
                }}
              >
                Download File
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
