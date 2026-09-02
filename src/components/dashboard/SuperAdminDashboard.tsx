import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  ShieldAlert,
  Building,
  GraduationCap,
  HeartHandshake,
  Wallet,
  Users,
  Radio,
  FileText,
  Activity,
  ArrowUpRight,
  Sparkles,
  MapPin,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Scale,
  DollarSign,
  Award,
} from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { Link } from 'react-router-dom';
import { IncomeExpenseChart, FundDistributionCard } from '../charts/FinancialCharts';

export const SuperAdminDashboard: React.FC = () => {
  const {
    mosques,
    madrasas,
    students,
    teachers,
    funds,
    expenseApprovals,
    donations,
    zakatDistributions,
    securityLogs,
    switchRole,
    currentUser,
    allUsers,
  } = useApp();

  const totalTreasury = funds.reduce((acc, f) => acc + (f.allocatedETB || 0), 0);
  const pendingApprovals = expenseApprovals.filter(
    (e) => e.status === 'Pending' || e.status === 'Under Review'
  );

  return (
    <div className="space-y-8">
      {/* Executive Command Header */}
      <div className="bg-stone-900 text-stone-100 p-6 sm:p-8 rounded-3xl border border-stone-800 shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold uppercase tracking-wider">
                Supreme Executive Secretariat
              </span>
              <span className="text-xs text-stone-400 font-mono">Tier-1 Authority</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white">
              Jimma Zone Islamic Affairs Council Command Matrix
            </h2>
            <p className="text-xs sm:text-sm text-stone-300 max-w-2xl leading-relaxed">
              Unified governance console supervising 18 Woredas, 180+ Mosques, 42 Quranic Madrasas, Shari'ah & Fatwa Assemblies, and Zakat Welfare Funds.
            </p>
          </div>

          {/* Quick Impersonation / View-As Role Bar */}
          <div className="bg-stone-800/90 border border-stone-700/80 p-3.5 rounded-2xl space-y-2">
            <div className="text-[11px] font-bold text-amber-400 uppercase tracking-wider flex items-center justify-between">
              <span>Simulate Role Dashboard</span>
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            </div>
            <div className="grid grid-cols-2 gap-1.5 text-xs">
              <button
                onClick={() => switchRole('Finance Officer')}
                className="px-2.5 py-1.5 rounded-lg bg-stone-700 hover:bg-emerald-800 text-stone-200 hover:text-white transition-colors text-left font-medium"
              >
                Finance Dashboard →
              </button>
              <button
                onClick={() => switchRole('Zakat & Welfare Inspector')}
                className="px-2.5 py-1.5 rounded-lg bg-stone-700 hover:bg-purple-800 text-stone-200 hover:text-white transition-colors text-left font-medium"
              >
                Zakat & Welfare →
              </button>
              <button
                onClick={() => switchRole('Education Officer')}
                className="px-2.5 py-1.5 rounded-lg bg-stone-700 hover:bg-purple-800 text-stone-200 hover:text-white transition-colors text-left font-medium"
              >
                Education Desk →
              </button>
              <button
                onClick={() => switchRole('Imam')}
                className="px-2.5 py-1.5 rounded-lg bg-stone-700 hover:bg-emerald-800 text-stone-200 hover:text-white transition-colors text-left font-medium"
              >
                Mosque & Imam →
              </button>
              <button
                onClick={() => switchRole('Teacher')}
                className="px-2.5 py-1.5 rounded-lg bg-stone-700 hover:bg-amber-800 text-stone-200 hover:text-white transition-colors text-left font-medium"
              >
                Teacher Workbench →
              </button>
              <button
                onClick={() => switchRole('Ulema Coordinator')}
                className="px-2.5 py-1.5 rounded-lg bg-stone-700 hover:bg-amber-800 text-stone-200 hover:text-white transition-colors text-left font-medium"
              >
                Ulema & Fatwa →
              </button>
              <button
                onClick={() => switchRole('IT & Media Officer')}
                className="px-2.5 py-1.5 rounded-lg bg-stone-700 hover:bg-sky-800 text-stone-200 hover:text-white transition-colors text-left font-medium"
              >
                Media & Broadcast →
              </button>
              <button
                onClick={() => switchRole('Auditor')}
                className="px-2.5 py-1.5 rounded-lg bg-stone-700 hover:bg-sky-800 text-stone-200 hover:text-white transition-colors text-left font-medium"
              >
                Audit & Compliance →
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 6 Executive Directorate Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <Card className="space-y-1.5 p-4">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-stone-400 uppercase">Mosques</span>
            <Building className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-serif font-bold text-stone-900 dark:text-stone-100 font-mono">
            {mosques.length}
          </div>
          <div className="text-[11px] text-stone-500">18 Woredas active</div>
        </Card>

        <Card className="space-y-1.5 p-4">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-stone-400 uppercase">Madrasas</span>
            <GraduationCap className="w-4 h-4 text-purple-600" />
          </div>
          <div className="text-2xl font-serif font-bold text-stone-900 dark:text-stone-100 font-mono">
            {madrasas.length}
          </div>
          <div className="text-[11px] text-stone-500">{students.length} students</div>
        </Card>

        <Card className="space-y-1.5 p-4">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-stone-400 uppercase">Treasury Reserves</span>
            <Wallet className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-serif font-bold text-emerald-700 dark:text-emerald-400 font-mono">
            {(totalTreasury / 1000000).toFixed(2)}M
          </div>
          <div className="text-[11px] text-stone-500">ETB across 6 funds</div>
        </Card>

        <Card className="space-y-1.5 p-4">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-stone-400 uppercase">Zakat Disbursed</span>
            <HeartHandshake className="w-4 h-4 text-purple-600" />
          </div>
          <div className="text-2xl font-serif font-bold text-purple-700 dark:text-purple-400 font-mono">
            {zakatDistributions.length + 85}
          </div>
          <div className="text-[11px] text-stone-500">Verified families</div>
        </Card>

        <Card className="space-y-1.5 p-4">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-stone-400 uppercase">Ulema & Scholars</span>
            <Scale className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-serif font-bold text-amber-700 dark:text-amber-400 font-mono">
            48
          </div>
          <div className="text-[11px] text-stone-500">Active Muftis</div>
        </Card>

        <Card className="space-y-1.5 p-4">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-stone-400 uppercase">Audit Score</span>
            <Activity className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-serif font-bold text-blue-700 dark:text-blue-400 font-mono">
            99.2%
          </div>
          <div className="text-[11px] text-stone-500">Clean Opinion</div>
        </Card>
      </div>

      {/* Main Row: Financial Flow & Zone GIS Quick Action */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left 7 cols: Financial Health & Pending Executive Approvals */}
        <div className="lg:col-span-7 space-y-6">
          <Card className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-serif font-bold text-lg text-stone-900 dark:text-stone-100">
                  Revenue & Expenditure Overview (2026)
                </h3>
                <p className="text-xs text-stone-500">Zone-wide operational cash flow trajectory</p>
              </div>
              <Link to="/admin/finance">
                <Button variant="ghost" size="sm" className="text-xs">
                  Finance Center →
                </Button>
              </Link>
            </div>
            <IncomeExpenseChart />
          </Card>

          {/* Pending Level 1 & 2 Approvals */}
          <Card className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-serif font-bold text-base text-stone-900 dark:text-stone-100 flex items-center gap-2">
                <FileText className="w-5 h-5 text-amber-600" />
                <span>Executive Expense & Grant Authorization Queue</span>
              </h3>
              <Badge variant="gold">{pendingApprovals.length} Pending</Badge>
            </div>

            <div className="space-y-2.5 text-xs">
              {pendingApprovals.slice(0, 3).map((req) => (
                <div
                  key={req.id}
                  className="p-3 rounded-xl bg-stone-50 dark:bg-stone-800/50 border border-stone-200 dark:border-stone-700 flex items-center justify-between"
                >
                  <div>
                    <div className="font-semibold text-stone-900 dark:text-stone-100">
                      {req.title}
                    </div>
                    <div className="text-[10px] text-stone-400">
                      {req.requestedBy} • {req.department}
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="font-mono font-bold text-stone-900 dark:text-stone-100 block">
                      ETB {req.amountETB.toLocaleString()}
                    </span>
                    <Badge variant="gold">{req.status}</Badge>
                  </div>
                </div>
              ))}
            </div>

            <Link to="/admin/finance/approvals" className="block pt-1">
              <Button variant="outline" size="sm" className="w-full justify-center text-xs">
                Open Full Approval Desk
              </Button>
            </Link>
          </Card>
        </div>

        {/* Right 5 cols: GIS Map Shortcut & Security Event Stream */}
        <div className="lg:col-span-5 space-y-6">
          {/* GIS Interactive Zone Map Portal */}
          <div className="p-5 rounded-3xl bg-emerald-950 text-emerald-100 border border-emerald-800/80 space-y-3 shadow-md">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-300">
                Geographic Information System
              </span>
              <Badge variant="emerald">Live Map</Badge>
            </div>
            <h4 className="font-serif font-bold text-lg text-white">
              Interactive Jimma Zone GIS Explorer
            </h4>
            <p className="text-xs text-emerald-200/80 leading-relaxed">
              Explore 180+ Geocoded Mosques, Tahfeez Madrasas, and Zakat distribution hubs across 18 Jimma Zone Woredas.
            </p>
            <Link to="/map" className="block pt-1">
              <Button
                variant="outline"
                size="sm"
                className="w-full justify-center text-xs bg-emerald-900/60 text-white border-emerald-700 hover:bg-emerald-800"
                icon={<MapPin className="w-4 h-4 text-emerald-300" />}
              >
                Launch Zone GIS Map
              </Button>
            </Link>
          </div>

          {/* Live Security Log Feed */}
          <Card className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-serif font-bold text-base text-stone-900 dark:text-stone-100">
                Real-Time Security & Audit Feed
              </h3>
              <Link to="/admin/staff">
                <Button variant="ghost" size="sm" className="text-xs">
                  Staff & Roles →
                </Button>
              </Link>
            </div>

            <div className="space-y-2 text-xs">
              {securityLogs.slice(0, 4).map((log) => (
                <div
                  key={log.id}
                  className="p-2.5 rounded-xl bg-stone-50 dark:bg-stone-800/50 border border-stone-100 dark:border-stone-800 space-y-1"
                >
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-stone-900 dark:text-stone-100 truncate">
                      {log.action}
                    </span>
                    <Badge variant={log.status === 'Success' ? 'emerald' : 'gold'}>
                      {log.status}
                    </Badge>
                  </div>
                  <div className="text-[10px] text-stone-400 truncate">
                    Actor: {log.actorName} ({log.actorRole}) • {log.timestamp.split('T')[0]}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
