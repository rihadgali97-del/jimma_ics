import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { useLanguage } from '../../context/LanguageContext';
import {
  Building,
  BookOpen,
  GraduationCap,
  Users,
  Wallet,
  FileCheck2,
  TrendingUp,
  AlertCircle,
  ArrowUpRight,
  Plus,
  Compass,
  ArrowRight,
  ShieldCheck,
  CalendarCheck2,
} from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { IncomeExpenseChart, FundDistributionCard } from '../../components/charts/FinancialCharts';
import { JimmaDistrictMap } from '../../components/charts/JimmaDistrictMap';

export const AdminDashboardPage: React.FC = () => {
  const {
    mosques,
    madrasas,
    students,
    teachers,
    ulema,
    funds,
    transactions,
    serviceRequests,
  } = useApp();
  const navigate = useNavigate();

  const totalFunds = funds.reduce((acc, f) => acc + f.allocatedETB, 0);
  const pendingRequests = serviceRequests.filter((r) => r.status === 'Pending' || r.status === 'In Review');

  const stats = [
    {
      title: 'Registered Mosques',
      value: mosques.length,
      unit: 'across 18 districts',
      icon: <Building className="w-5 h-5 text-emerald-600" />,
      color: 'emerald',
      link: '/admin/mosques',
    },
    {
      title: 'Madrasas & Centers',
      value: madrasas.length,
      unit: 'standardized curriculum',
      icon: <BookOpen className="w-5 h-5 text-amber-600" />,
      color: 'amber',
      link: '/admin/madrasas',
    },
    {
      title: 'Tahfeez Students',
      value: students.length,
      unit: 'active daily tracking',
      icon: <GraduationCap className="w-5 h-5 text-blue-600" />,
      color: 'blue',
      link: '/admin/students',
    },
    {
      title: 'Verified Ulema',
      value: ulema.length,
      unit: 'Fatwa & advisory panel',
      icon: <Users className="w-5 h-5 text-purple-600" />,
      color: 'purple',
      link: '/admin/ulema',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-stone-900 p-6 rounded-3xl border border-stone-200 dark:border-stone-800 shadow-xs">
        <div>
          <span className="text-xs font-mono font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider block">
            Executive Command & Monitoring Desk
          </span>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900 dark:text-stone-100">
            Jimma Islamic Council Management Portal
          </h1>
          <p className="text-stone-500 dark:text-stone-400 text-xs sm:text-sm mt-1">
            Real-time oversight of mosques, Quranic institutions, community finances, and public civic requests.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Link to="/admin/resources">
            <Button variant="outline" size="sm" icon={<BookOpen className="w-4 h-4 text-emerald-600" />}>
              Khutbahs & Materials
            </Button>
          </Link>
          <Link to="/admin/attendance">
            <Button variant="outline" size="sm" icon={<CalendarCheck2 className="w-4 h-4 text-emerald-600" />}>
              Daily Attendance
            </Button>
          </Link>
          <Link to="/admin/students">
            <Button variant="outline" size="sm" icon={<GraduationCap className="w-4 h-4 text-blue-600" />}>
              Hifz Tracker
            </Button>
          </Link>
          <Link to="/admin/finance">
            <Button variant="primary" size="sm" icon={<Wallet className="w-4 h-4" />}>
              Treasury Ledger
            </Button>
          </Link>
        </div>
      </div>

      {/* 4 Core Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {stats.map((st) => (
          <Link key={st.title} to={st.link} className="block group">
            <Card hoverEffect className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-stone-500 dark:text-stone-400">
                  {st.title}
                </span>
                <div className="p-2 rounded-xl bg-stone-100 dark:bg-stone-800 group-hover:scale-110 transition-transform">
                  {st.icon}
                </div>
              </div>
              <div className="text-3xl font-serif font-bold text-stone-900 dark:text-stone-100 font-mono">
                {st.value}
              </div>
              <div className="text-xs text-stone-400 flex items-center justify-between pt-1 border-t border-stone-100 dark:border-stone-800">
                <span>{st.unit}</span>
                <ArrowRight className="w-3.5 h-3.5 text-stone-300 group-hover:text-emerald-600 transition-colors" />
              </div>
            </Card>
          </Link>
        ))}
      </div>

      {/* District Operations Map & Fund Status */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8">
          <Card className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-serif font-bold text-lg text-stone-900 dark:text-stone-100">
                  District Coverage & Institution Distribution
                </h3>
                <p className="text-xs text-stone-500">
                  Interactive distribution of mosques, madrasas, and students across Jimma Zone districts.
                </p>
              </div>
            </div>
            <JimmaDistrictMap />
          </Card>
        </div>

        <div className="lg:col-span-4 space-y-6">
          {/* Civic Services Queue Widget */}
          <Card className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-serif font-bold text-base text-stone-900 dark:text-stone-100">
                Pending Service Requests
              </h3>
              <Badge variant="gold">{pendingRequests.length} Action Needed</Badge>
            </div>

            <div className="space-y-3">
              {pendingRequests.slice(0, 3).map((req) => (
                <div
                  key={req.id}
                  className="p-3 rounded-xl bg-stone-50 dark:bg-stone-800/60 border border-stone-100 dark:border-stone-700/60 space-y-1 text-xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-stone-800 dark:text-stone-200">
                      {req.applicantName}
                    </span>
                    <Badge variant={req.status === 'Pending' ? 'gold' : 'blue'}>
                      {req.status}
                    </Badge>
                  </div>
                  <div className="text-stone-500">{req.serviceName} • {req.district}</div>
                </div>
              ))}
            </div>

            <Link to="/admin/services">
              <Button variant="secondary" size="sm" className="w-full justify-center text-xs">
                Open Services Queue ({serviceRequests.length})
              </Button>
            </Link>
          </Card>

          {/* Quick Treasury Card */}
          <Card className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-stone-400 uppercase">
                Active Treasury Balance
              </span>
              <Badge variant="emerald">Live Synced</Badge>
            </div>
            <div className="text-2xl font-serif font-bold text-emerald-800 dark:text-emerald-400 font-mono">
              ETB {(totalFunds / 1000000).toFixed(2)}M
            </div>
            <p className="text-[11px] text-stone-500">
              Allocated across 5 active funds with strict Shari'ah oversight.
            </p>
          </Card>
        </div>
      </div>

      {/* Financial Trajectory Chart & Recent Transactions */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8">
          <Card className="space-y-4">
            <h3 className="font-serif font-bold text-lg text-stone-900 dark:text-stone-100">
              Council Revenue & Expense Flow (12-Month Trajectory)
            </h3>
            <IncomeExpenseChart />
          </Card>
        </div>

        <div className="lg:col-span-4">
          <Card className="space-y-4">
            <h3 className="font-serif font-bold text-lg text-stone-900 dark:text-stone-100">
              Fund Reserves Breakdown
            </h3>
            <FundDistributionCard funds={funds} />
          </Card>
        </div>
      </div>
    </div>
  );
};
