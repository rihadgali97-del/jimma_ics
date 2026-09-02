import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import {
  Wallet,
  Plus,
  ArrowUpRight,
  ArrowDownRight,
  Search,
  Filter,
  Printer,
  Download,
  ShieldCheck,
  CheckCircle2,
  FileSpreadsheet,
  HeartHandshake,
} from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { IncomeExpenseChart, FundDistributionCard } from '../../components/charts/FinancialCharts';

export const AdminFinancePage: React.FC = () => {
  const navigate = useNavigate();
  const { funds, transactions, addTransaction, addToast } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFund, setSelectedFund] = useState('All');
  const [selectedType, setSelectedType] = useState('All');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isStatementModalOpen, setIsStatementModalOpen] = useState(false);

  // New Transaction Form state
  const [type, setType] = useState<'Income' | 'Expense'>('Income');
  const [fundId, setFundId] = useState(funds[0]?.id || 'fund-1');
  const [amountETB, setAmountETB] = useState<number>(5000);
  const [category, setCategory] = useState('Sadaqah & Community Contribution');
  const [description, setDescription] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('Telebirr');
  const [recordedBy, setRecordedBy] = useState('Treasury Officer (Hajji Kassim)');

  const fundNames = ['All', ...funds.map((f) => f.name)];

  const filtered = transactions.filter((tx) => {
    const s = (searchTerm || '').toLowerCase();
    const matchSearch =
      (tx.description || '').toLowerCase().includes(s) ||
      (tx.referenceNo || '').toLowerCase().includes(s) ||
      (tx.category || '').toLowerCase().includes(s);
    const matchFund = selectedFund === 'All' || tx.fundName === selectedFund;
    const matchType = selectedType === 'All' || tx.type === selectedType;
    return matchSearch && matchFund && matchType;
  });

  const totalInflow = transactions
    .filter((t) => t.type === 'Income')
    .reduce((acc, t) => acc + t.amountETB, 0);

  const totalOutflow = transactions
    .filter((t) => t.type === 'Expense')
    .reduce((acc, t) => acc + t.amountETB, 0);

  const netTreasury = totalInflow - totalOutflow;

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description || amountETB <= 0) {
      addToast('Missing Details', 'Please specify amount and transaction description.', 'warning');
      return;
    }

    const chosenFund = funds.find((f) => f.id === fundId) || funds[0];

    addTransaction({
      type,
      fundId: chosenFund.id,
      fundName: chosenFund.name,
      amountETB: Number(amountETB),
      category,
      description,
      paymentMethod,
      recordedBy,
    });

    setIsAddModalOpen(false);
    setDescription('');
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-teal-700 dark:text-teal-400 uppercase tracking-wider mb-1">
            <Wallet className="w-4 h-4" />
            <span>Islamic Council Treasury & Zakat Ledger</span>
          </div>
          <h1 className="text-2xl font-serif font-bold text-stone-900 dark:text-stone-100">
            Treasury Management & General Ledger
          </h1>
          <p className="text-stone-500 dark:text-stone-400 text-xs sm:text-sm">
            Multi-fund accounting, live donation receipts, mosque grants, and audited balance sheets.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="secondary"
            size="sm"
            icon={<HeartHandshake className="w-4 h-4 text-emerald-600" />}
            onClick={() => navigate('/admin/finance/donations')}
          >
            Donations & Zakat Logs
          </Button>
          <Button
            variant="outline"
            size="sm"
            icon={<FileSpreadsheet className="w-4 h-4" />}
            onClick={() => setIsStatementModalOpen(true)}
          >
            Financial Statement
          </Button>
          <Button
            variant="primary"
            size="sm"
            icon={<Plus className="w-4 h-4" />}
            onClick={() => setIsAddModalOpen(true)}
          >
            Record Transaction
          </Button>
        </div>
      </div>

      {/* 3 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <Card className="space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-stone-400 uppercase">
              Total Inflow (Revenue)
            </span>
            <div className="p-1.5 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-700">
              <ArrowUpRight className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-serif font-bold text-stone-900 dark:text-stone-100 font-mono">
            ETB {(totalInflow / 1000000).toFixed(2)}M
          </div>
          <p className="text-xs text-stone-500">Zakat, Sadaqah, Waqf investments</p>
        </Card>

        <Card className="space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-stone-400 uppercase">
              Total Disbursed (Grants)
            </span>
            <div className="p-1.5 rounded-lg bg-amber-100 dark:bg-amber-950 text-amber-700">
              <ArrowDownRight className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-serif font-bold text-stone-900 dark:text-stone-100 font-mono">
            ETB {(totalOutflow / 1000000).toFixed(2)}M
          </div>
          <p className="text-xs text-stone-500">Madrasas, students, mosque renovations</p>
        </Card>

        <Card className="space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-stone-400 uppercase">
              Active Fund Reserve
            </span>
            <Badge variant="emerald">Healthy</Badge>
          </div>
          <div className="text-2xl sm:text-3xl font-serif font-bold text-emerald-700 dark:text-emerald-400 font-mono">
            ETB {(netTreasury / 1000000).toFixed(2)}M
          </div>
          <p className="text-xs text-stone-500">Shari'ah compliant balance</p>
        </Card>
      </div>

      {/* Trajectory & Fund Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8">
          <Card className="space-y-4">
            <h3 className="font-serif font-bold text-lg text-stone-900 dark:text-stone-100">
              12-Month Inflow & Outflow Trend
            </h3>
            <IncomeExpenseChart />
          </Card>
        </div>

        <div className="lg:col-span-4">
          <Card className="space-y-4">
            <h3 className="font-serif font-bold text-lg text-stone-900 dark:text-stone-100">
              Active Fund Balances
            </h3>
            <FundDistributionCard funds={funds} />
          </Card>
        </div>
      </div>

      {/* Ledger Filter & Search */}
      <div className="bg-white dark:bg-stone-900 p-4 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-xs flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search ref #, description, category..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 outline-hidden"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          <select
            value={selectedFund}
            onChange={(e) => setSelectedFund(e.target.value)}
            className="px-3 py-2 text-xs sm:text-sm rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-800 dark:text-stone-200"
          >
            {fundNames.map((fn) => (
              <option key={fn} value={fn}>
                {fn === 'All' ? 'All Funds' : fn}
              </option>
            ))}
          </select>

          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="px-3 py-2 text-xs sm:text-sm rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-800 dark:text-stone-200"
          >
            <option value="All">All Types</option>
            <option value="Income">Inflow (Income)</option>
            <option value="Expense">Disbursement (Expense)</option>
          </select>
        </div>
      </div>

      {/* General Ledger Table */}
      <Card className="p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-50 dark:bg-stone-800 text-stone-500 uppercase text-[10px] font-bold border-b border-stone-200 dark:border-stone-700">
              <tr>
                <th className="p-3.5">Ref No</th>
                <th className="p-3.5">Date</th>
                <th className="p-3.5">Type</th>
                <th className="p-3.5">Designated Fund</th>
                <th className="p-3.5">Description</th>
                <th className="p-3.5">Method</th>
                <th className="p-3.5 text-right">Amount (ETB)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 dark:divide-stone-800 font-medium">
              {filtered.map((tx) => (
                <tr key={tx.id} className="hover:bg-stone-50/50 dark:hover:bg-stone-800/50">
                  <td className="p-3.5 font-mono text-stone-500">{tx.referenceNo}</td>
                  <td className="p-3.5 font-mono">{tx.date}</td>
                  <td className="p-3.5">
                    <Badge variant={tx.type === 'Income' ? 'emerald' : 'rose'}>
                      {tx.type}
                    </Badge>
                  </td>
                  <td className="p-3.5 font-semibold text-stone-800 dark:text-stone-200">
                    {tx.fundName}
                  </td>
                  <td className="p-3.5 text-stone-600 dark:text-stone-300 max-w-sm truncate">
                    {tx.description}
                  </td>
                  <td className="p-3.5 text-stone-500 font-mono text-[11px]">
                    {tx.paymentMethod}
                  </td>
                  <td
                    className={`p-3.5 text-right font-mono font-bold text-sm ${
                      tx.type === 'Income'
                        ? 'text-emerald-700 dark:text-emerald-400'
                        : 'text-rose-700 dark:text-rose-400'
                    }`}
                  >
                    {tx.type === 'Income' ? '+' : '-'}
                    {tx.amountETB.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Record Transaction Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Record General Ledger Entry"
        subtitle="Add verified cash, digital transfer, or grant disbursal to council records."
      >
        <form onSubmit={handleAddSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                Transaction Type *
              </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as any)}
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700"
              >
                <option value="Income">Income (Revenue / Donation)</option>
                <option value="Expense">Expense (Grant Disbursal / Operations)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                Designated Fund *
              </label>
              <select
                value={fundId}
                onChange={(e) => setFundId(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700"
              >
                {funds.map((f) => (
                  <option key={f.id} value={f.id}>
                    {f.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                Amount (ETB) *
              </label>
              <input
                type="number"
                min="10"
                required
                value={amountETB}
                onChange={(e) => setAmountETB(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                Payment Channel
              </label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700"
              >
                <option value="Telebirr">Telebirr</option>
                <option value="CBE Birr">CBE Birr</option>
                <option value="Bank Transfer">Bank Transfer (Commercial Bank of Ethiopia)</option>
                <option value="Awash Bank">Awash Bank</option>
                <option value="Cash Receipt">Cash Treasury Receipt</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
              Transaction Category / Purpose
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Mosque Acoustic Renovation Grant"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
              Detailed Ledger Description *
            </label>
            <textarea
              rows={2}
              required
              placeholder="Provide context, donor names, or voucher reference..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-stone-100 dark:border-stone-800">
            <Button variant="ghost" type="button" onClick={() => setIsAddModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              Post to Ledger
            </Button>
          </div>
        </form>
      </Modal>

      {/* Financial Statement Summary Modal */}
      <Modal
        isOpen={isStatementModalOpen}
        onClose={() => setIsStatementModalOpen(false)}
        title="Official Financial Statement (Q1 2026)"
        subtitle="Jimma Zone Islamic Affairs Supreme Council Treasury Balance Sheet"
      >
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700 space-y-4 text-xs">
            <div className="flex justify-between border-b border-stone-200 dark:border-stone-700 pb-3">
              <div>
                <h4 className="font-serif font-bold text-base text-stone-900 dark:text-stone-100">
                  Jimma Islamic Supreme Council
                </h4>
                <p className="text-[11px] text-stone-500">Period: Jan 01, 2026 – Mar 31, 2026</p>
              </div>
              <Badge variant="emerald">Audited Statement</Badge>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between font-semibold">
                <span>Total Gross Receipts (Inflows):</span>
                <span className="font-mono text-emerald-700">ETB {totalInflow.toLocaleString()}</span>
              </div>
              <div className="flex justify-between font-semibold">
                <span>Total Disbursals (Outflows):</span>
                <span className="font-mono text-rose-700">ETB {totalOutflow.toLocaleString()}</span>
              </div>
              <div className="flex justify-between font-bold text-sm pt-2 border-t border-stone-200 dark:border-stone-700">
                <span>Net Treasury Balance:</span>
                <span className="font-mono text-stone-900 dark:text-stone-100">
                  ETB {netTreasury.toLocaleString()}
                </span>
              </div>
            </div>

            <div className="pt-2 border-t border-stone-200 dark:border-stone-700 text-[11px] text-stone-400">
              Certified by Jimma Shari'ah Financial Audit Committee & Independent Chartered Accountants.
            </div>
          </div>

          <div className="flex items-center justify-between">
            <Button variant="ghost" onClick={() => setIsStatementModalOpen(false)}>
              Close
            </Button>
            <div className="flex gap-2">
              <Button
                variant="secondary"
                size="sm"
                icon={<Printer className="w-4 h-4" />}
                onClick={handlePrint}
              >
                Print Statement
              </Button>
              <Button
                variant="primary"
                size="sm"
                icon={<Download className="w-4 h-4" />}
                onClick={handlePrint}
              >
                Export PDF
              </Button>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};
