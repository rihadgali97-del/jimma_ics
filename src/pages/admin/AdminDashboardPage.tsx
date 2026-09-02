import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import {
  UserCheck,
  Sparkles,
  ShieldCheck,
  ChevronDown,
  Layers,
  Building,
  GraduationCap,
  WalletCards,
  BookOpen,
  HeartHandshake,
  Radio,
  FileCheck2,
  Lock,
  ArrowRight,
} from 'lucide-react';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';

// Role-specific Dashboards
import { SuperAdminDashboard } from '../../components/dashboard/SuperAdminDashboard';
import { FinanceDashboard } from '../../components/dashboard/FinanceDashboard';
import { EducationDashboard } from '../../components/dashboard/EducationDashboard';
import { TeacherMadrasaDashboard } from '../../components/dashboard/TeacherMadrasaDashboard';
import { MosqueImamDashboard } from '../../components/dashboard/MosqueImamDashboard';
import { UlemaFatwaDashboard } from '../../components/dashboard/UlemaFatwaDashboard';
import { ZakatWelfareDashboard } from '../../components/dashboard/ZakatWelfareDashboard';
import { MediaBroadcastDashboard } from '../../components/dashboard/MediaBroadcastDashboard';
import { AuditorDashboard } from '../../components/dashboard/AuditorDashboard';

export const AdminDashboardPage: React.FC = () => {
  const { currentUser, switchRole, allUsers, addToast } = useApp();

  // Role workspace modes
  const [selectedDashboardRole, setSelectedDashboardRole] = useState<string>(currentUser.role);
  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);

  // Keep in sync with currentUser.role if changed externally
  useEffect(() => {
    setSelectedDashboardRole(currentUser.role);
  }, [currentUser.role]);

  // Determine which dashboard component to render
  const renderRoleDashboard = () => {
    const role = (selectedDashboardRole || currentUser.role || '').toLowerCase();
    const cleanRole = role.replace(/&/g, 'and');

    // 1. Check explicit active role first
    if (
      cleanRole.includes('zakat') ||
      cleanRole.includes('welfare') ||
      cleanRole.includes('inspector') ||
      cleanRole.includes('social service')
    ) {
      return <ZakatWelfareDashboard />;
    }
    if (cleanRole.includes('auditor') || cleanRole.includes('compliance') || cleanRole.includes('audit')) {
      return <AuditorDashboard />;
    }
    if (
      cleanRole.includes('media') ||
      cleanRole.includes('broadcast') ||
      cleanRole.includes('communications') ||
      cleanRole.includes('it') ||
      cleanRole.includes('radio')
    ) {
      return <MediaBroadcastDashboard />;
    }
    if (
      cleanRole.includes('teacher') ||
      cleanRole.includes('mu’allim') ||
      cleanRole.includes('muallim') ||
      cleanRole.includes('instructor') ||
      cleanRole.includes('madrasa admin')
    ) {
      return <TeacherMadrasaDashboard />;
    }
    if (cleanRole.includes('education') || cleanRole.includes('curriculum')) {
      return <EducationDashboard />;
    }
    if (cleanRole.includes('imam') || cleanRole.includes('mosque')) {
      return <MosqueImamDashboard />;
    }
    if (cleanRole.includes('ulema') || cleanRole.includes('fatwa') || cleanRole.includes('shariah')) {
      return <UlemaFatwaDashboard />;
    }
    if (cleanRole.includes('finance') || cleanRole.includes('treasury') || cleanRole.includes('accountant')) {
      return <FinanceDashboard />;
    }

    // 2. Fallback check by department if role is generic or undefined
    const dept = (currentUser.department || '').toLowerCase();
    if (dept.includes('zakat') || dept.includes('social')) {
      return <ZakatWelfareDashboard />;
    }
    if (dept.includes('audit') || dept.includes('compliance')) {
      return <AuditorDashboard />;
    }
    if (dept.includes('media') || dept.includes('it')) {
      return <MediaBroadcastDashboard />;
    }
    if (dept.includes('shariah') || dept.includes('fatwa')) {
      return <UlemaFatwaDashboard />;
    }
    if (dept.includes('education')) {
      return <EducationDashboard />;
    }
    if (dept.includes('mosque')) {
      return <MosqueImamDashboard />;
    }
    if (dept.includes('finance')) {
      return <FinanceDashboard />;
    }

    // Default: Super Admin / Council Director
    return <SuperAdminDashboard />;
  };

  const roleConfigs = [
    { id: 'Super Admin', label: 'Super Admin', icon: <ShieldCheck className="w-3.5 h-3.5" />, color: 'gold' },
    { id: 'IT & Media Officer', label: 'IT & Media Officer', icon: <Radio className="w-3.5 h-3.5" />, color: 'sky' },
    { id: 'Finance Officer', label: 'Finance Officer', icon: <WalletCards className="w-3.5 h-3.5" />, color: 'emerald' },
    { id: 'Education Officer', label: 'Education Officer', icon: <GraduationCap className="w-3.5 h-3.5" />, color: 'purple' },
    { id: 'Teacher', label: 'Teacher / Mu’allim', icon: <BookOpen className="w-3.5 h-3.5" />, color: 'emerald' },
    { id: 'Imam', label: 'Imam / Mosque Officer', icon: <Building className="w-3.5 h-3.5" />, color: 'emerald' },
    { id: 'Ulema Coordinator', label: 'Ulema & Fatwa Board', icon: <Layers className="w-3.5 h-3.5" />, color: 'amber' },
    { id: 'Zakat & Welfare Inspector', label: 'Zakat & Welfare Inspector', icon: <HeartHandshake className="w-3.5 h-3.5" />, color: 'purple' },
    { id: 'Auditor', label: 'Auditor & Compliance', icon: <Lock className="w-3.5 h-3.5" />, color: 'sky' },
  ];

  const activeRoleBadgeColor = () => {
    const r = (selectedDashboardRole || '').toLowerCase();
    if (r.includes('finance')) return 'blue';
    if (r.includes('education') || r.includes('zakat')) return 'purple';
    if (r.includes('teacher') || r.includes('imam')) return 'emerald';
    if (r.includes('media') || r.includes('it')) return 'blue';
    return 'gold';
  };

  return (
    <div className="space-y-6">
      {/* Top Dynamic Role Control Bar */}
      <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl p-4 sm:p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Left: User context & Role identification */}
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-700 to-emerald-900 text-amber-300 flex items-center justify-center font-serif font-bold text-lg shadow-md shrink-0 border border-amber-400/30">
            {currentUser.name.charAt(0)}
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs text-stone-400">Authenticated as</span>
              <span className="text-sm font-bold text-stone-900 dark:text-stone-100">
                {currentUser.name}
              </span>
              <Badge variant={activeRoleBadgeColor() as any}>
                {selectedDashboardRole}
              </Badge>
            </div>
            <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
              {currentUser.department || 'Jimma Zone Islamic Affairs Council'} • District: {currentUser.district || 'Jimma Central'}
            </p>
          </div>
        </div>

        {/* Right: Instant Workspace Role Switcher */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-semibold text-stone-500 dark:text-stone-400 hidden sm:inline">
            Role Workspace:
          </span>

          <div className="relative">
            <button
              onClick={() => setIsRoleDropdownOpen(!isRoleDropdownOpen)}
              className="flex items-center gap-2 px-3 py-2 bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-200 rounded-xl border border-stone-200 dark:border-stone-700 text-xs font-bold transition-colors cursor-pointer"
            >
              <UserCheck className="w-3.5 h-3.5 text-amber-500" />
              <span>{selectedDashboardRole}</span>
              <ChevronDown className="w-3.5 h-3.5 text-stone-400" />
            </button>

            {isRoleDropdownOpen && (
              <div className="absolute right-0 top-full mt-2 w-72 max-h-96 overflow-y-auto bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl shadow-2xl p-2 z-50 text-xs animate-in fade-in zoom-in-95">
                <div className="px-3 py-1.5 font-bold text-[11px] text-amber-600 dark:text-amber-400 uppercase tracking-wider border-b border-stone-100 dark:border-stone-800">
                  Switch Active Role Dashboard
                </div>
                <div className="mt-1 space-y-1">
                  {roleConfigs.map((r) => (
                    <button
                      key={r.id}
                      onClick={() => {
                        setSelectedDashboardRole(r.id);
                        switchRole(r.id);
                        setIsRoleDropdownOpen(false);
                        addToast('Role Workspace Activated', `Loaded ${r.label} dashboard view.`, 'info');
                      }}
                      className={`w-full text-left px-3 py-2 rounded-xl flex items-center justify-between transition-colors cursor-pointer ${
                        selectedDashboardRole === r.id
                          ? 'bg-amber-100 dark:bg-amber-950/70 text-amber-900 dark:text-amber-300 font-bold'
                          : 'text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        {r.icon}
                        <span>{r.label}</span>
                      </div>
                      {selectedDashboardRole === r.id && (
                        <span className="w-2 h-2 rounded-full bg-amber-500" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Role Quick Selector Pills for Rapid Navigation */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        {roleConfigs.map((cfg) => {
          const isActive = selectedDashboardRole === cfg.id;
          return (
            <button
              key={cfg.id}
              onClick={() => {
                setSelectedDashboardRole(cfg.id);
                switchRole(cfg.id);
                addToast('Role Workspace Switched', `Switched to ${cfg.label} dashboard.`, 'info');
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap flex items-center gap-1.5 transition-all cursor-pointer ${
                isActive
                  ? 'bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 shadow-xs'
                  : 'bg-stone-100 dark:bg-stone-800/80 text-stone-600 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-700'
              }`}
            >
              {cfg.icon}
              <span>{cfg.label}</span>
            </button>
          );
        })}
      </div>

      {/* Main Dynamic Role Dashboard Component */}
      <div className="animate-in fade-in duration-300">
        {renderRoleDashboard()}
      </div>
    </div>
  );
};
