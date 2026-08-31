import React from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { useLanguage } from '../../context/LanguageContext';
import {
  LayoutDashboard,
  Building,
  BookOpen,
  GraduationCap,
  Users2,
  CalendarCheck2,
  Users,
  WalletCards,
  FileCheck2,
  HeartHandshake,
  HandHeart,
  Calendar,
  FileText,
  ShieldCheck,
  Landmark,
  ArrowLeft,
  X,
  ExternalLink,
  MessageSquare,
  Radio,
  MapPin,
} from 'lucide-react';
import { Badge } from '../ui/Badge';

interface AdminSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({ isOpen, onClose }) => {
  const { currentUser, expenseApprovals, serviceRequests } = useApp();
  const { language } = useLanguage();
  const navigate = useNavigate();

  const pendingExpensesCount = expenseApprovals.filter(
    (e) => e.status === 'Pending' || e.status === 'Under Review'
  ).length;

  const pendingServicesCount = serviceRequests.filter(
    (s) => s.status === 'Submitted' || s.status === 'In Review'
  ).length;

  const navGroups = [
    {
      title: 'Main Operations',
      items: [
        { label: 'Executive Overview', path: '/admin', icon: <LayoutDashboard className="w-4 h-4" />, end: true },
        { label: 'Mosques Registry', path: '/admin/mosques', icon: <Building className="w-4 h-4" /> },
        { label: 'Madrasas & Centers', path: '/admin/madrasas', icon: <BookOpen className="w-4 h-4" /> },
      ],
    },
    {
      title: 'Islamic Education',
      items: [
        { label: 'Students & Hifz Records', path: '/admin/students', icon: <GraduationCap className="w-4 h-4" /> },
        { label: 'Teachers & Mu’allims', path: '/admin/teachers', icon: <Users2 className="w-4 h-4" /> },
        { label: 'Daily Attendance Sheet', path: '/admin/attendance', icon: <CalendarCheck2 className="w-4 h-4" /> },
        { label: 'Ulema & Fatwa Board', path: '/admin/ulema', icon: <Users className="w-4 h-4" /> },
      ],
    },
    {
      title: 'Finance & Endowment',
      items: [
        { label: 'Financial Control Center', path: '/admin/finance', icon: <WalletCards className="w-4 h-4" />, end: true },
        {
          label: 'Expense Approvals',
          path: '/admin/finance/approvals',
          icon: <FileCheck2 className="w-4 h-4" />,
          badge: pendingExpensesCount > 0 ? pendingExpensesCount : undefined,
          badgeVariant: 'amber' as const,
        },
        { label: 'Donations & Zakat Logs', path: '/admin/finance/donations', icon: <HeartHandshake className="w-4 h-4" /> },
      ],
    },
    {
      title: 'Community Services',
      items: [
        {
          label: 'SMS & Telegram Gateway',
          path: '/admin/gateway',
          icon: <Radio className="w-4 h-4 text-emerald-500" />,
          badge: 'Live',
          badgeVariant: 'emerald' as const,
        },
        {
          label: 'Service Requests Desk',
          path: '/admin/services',
          icon: <HandHeart className="w-4 h-4" />,
          badge: pendingServicesCount > 0 ? pendingServicesCount : undefined,
          badgeVariant: 'blue' as const,
        },
        { label: 'Interactive GIS Map', path: '/map', icon: <MapPin className="w-4 h-4 text-amber-500" /> },
        { label: 'Events & Programs', path: '/admin/events', icon: <Calendar className="w-4 h-4" /> },
        { label: 'Council Documents', path: '/admin/documents', icon: <FileText className="w-4 h-4" /> },
        { label: 'Staff & Role Access', path: '/admin/users', icon: <ShieldCheck className="w-4 h-4" /> },
      ],
    },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-stone-950/60 lg:hidden backdrop-blur-xs"
          onClick={onClose}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 left-0 z-40 h-screen w-72 bg-stone-900 text-stone-300 border-r border-stone-800 flex flex-col justify-between transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Sidebar Header */}
        <div>
          <div className="p-5 border-b border-stone-800 flex items-center justify-between">
            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-xl bg-emerald-800 text-amber-300 flex items-center justify-center border border-amber-400/40 shadow-sm shrink-0">
                <Landmark className="w-5 h-5 text-amber-300" />
              </div>
              <div className="flex flex-col">
                <span className="font-serif font-bold text-white tracking-tight leading-none text-base">
                  Jimma Council
                </span>
                <span className="text-[10px] text-amber-400 font-medium uppercase tracking-wider mt-1">
                  Admin System
                </span>
              </div>
            </Link>
            <button
              onClick={onClose}
              className="lg:hidden p-1.5 rounded-lg text-stone-400 hover:text-white hover:bg-stone-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Current User Role Pill */}
          <div className="mx-4 mt-4 p-3 rounded-xl bg-stone-800/80 border border-stone-700/80 flex items-center justify-between">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-full bg-emerald-950 text-emerald-300 flex items-center justify-center font-bold text-xs border border-emerald-700/60 shrink-0">
                {currentUser.name.charAt(0)}
              </div>
              <div className="min-w-0">
                <div className="text-xs font-semibold text-white truncate">{currentUser.name}</div>
                <div className="text-[10px] text-amber-400 truncate">{currentUser.role}</div>
              </div>
            </div>
            <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0 animate-pulse" />
          </div>

          {/* Nav List */}
          <nav className="mt-4 px-3 space-y-6 overflow-y-auto max-h-[calc(100vh-250px)] pb-6">
            {navGroups.map((group) => (
              <div key={group.title} className="space-y-1">
                <div className="px-3 text-[10px] font-bold uppercase tracking-wider text-stone-400 mb-1.5">
                  {group.title}
                </div>
                {group.items.map((item) => (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    end={item.end}
                    onClick={() => {
                      if (window.innerWidth < 1024) onClose();
                    }}
                    className={({ isActive }) =>
                      `flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-colors ${
                        isActive
                          ? 'bg-emerald-900/90 text-amber-300 font-bold border border-emerald-700/60 shadow-xs'
                          : 'text-stone-300 hover:bg-stone-800 hover:text-white'
                      }`
                    }
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="shrink-0">{item.icon}</span>
                      <span>{item.label}</span>
                    </div>
                    {item.badge !== undefined && (
                      <span className="px-1.5 py-0.5 text-[10px] font-bold rounded-md bg-amber-500 text-stone-950">
                        {item.badge}
                      </span>
                    )}
                  </NavLink>
                ))}
              </div>
            ))}
          </nav>
        </div>

        {/* Sidebar Footer: Back to Public Portal */}
        <div className="p-4 border-t border-stone-800 bg-stone-950/60">
          <Link
            to="/"
            className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-semibold transition-colors border border-stone-700"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-amber-400" />
            <span>Return to Public Portal</span>
          </Link>
        </div>
      </aside>
    </>
  );
};
