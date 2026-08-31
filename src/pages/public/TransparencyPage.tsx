import React from 'react';
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
} from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { IncomeExpenseChart, FundDistributionCard } from '../../components/charts/FinancialCharts';

export const TransparencyPage: React.FC = () => {
  const { funds, transactions, documents, addToast } = useApp();

  const totalAllocated = funds.reduce((acc, f) => acc + f.allocatedETB, 0);
  const totalDisbursed = funds.reduce((acc, f) => acc + f.disbursedETB, 0);

  const handleDownload = (title: string) => {
    addToast('Document Download Started', `Downloading official report: "${title}"`, 'success');
  };

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
            Real-time multi-fund accounting, annual external audit statements, and verifiable donation flows.
          </p>
        </div>

        <Badge variant="emerald" size="md">
          Audited by Chartered Accountants
        </Badge>
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
            <span>Disbursed to mosques & students</span>
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
        <h3 className="font-serif font-bold text-xl text-stone-900 dark:text-stone-100">
          Official Audit Statements & Governance Charters
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {documents.map((doc) => (
            <Card key={doc.id} className="flex flex-col justify-between">
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

              <div className="mt-4 pt-3 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between">
                <span className="text-[11px] text-stone-400 font-mono">Issued: {doc.date}</span>
                <Button
                  variant="outline"
                  size="sm"
                  icon={<Download className="w-3.5 h-3.5" />}
                  onClick={() => handleDownload(doc.title)}
                  className="text-xs"
                >
                  Download {doc.fileType}
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Recent Ledger Transactions */}
      <Card className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-serif font-bold text-lg text-stone-900 dark:text-stone-100">
              Recent General Ledger Activities
            </h3>
            <p className="text-xs text-stone-500">
              Live synchronized transaction feed from Jimma central treasury.
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-50 dark:bg-stone-800 text-stone-500 uppercase text-[10px] font-bold">
              <tr>
                <th className="p-3">Ref No</th>
                <th className="p-3">Date</th>
                <th className="p-3">Type</th>
                <th className="p-3">Fund</th>
                <th className="p-3">Description</th>
                <th className="p-3 text-right">Amount (ETB)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 dark:divide-stone-800 font-medium">
              {transactions.slice(0, 6).map((tx) => (
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
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};
