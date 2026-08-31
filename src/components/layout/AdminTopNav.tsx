import React, { useState } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';
import { LanguageSelector } from '../common/LanguageSelector';
import {
  Menu,
  Search,
  Moon,
  Sun,
  Bell,
  UserCheck,
  ChevronRight,
  Shield,
  HeartHandshake,
  CheckCircle2,
} from 'lucide-react';
import { Badge } from '../ui/Badge';

export const AdminTopNav: React.FC<{ onMenuToggle: () => void }> = ({ onMenuToggle }) => {
  const { currentUser, switchRole, allUsers, setIsSearchOpen, toasts, expenseApprovals, serviceRequests } = useApp();
  const { theme, toggleTheme } = useTheme();
  const { t } = useLanguage();
  const location = useLocation();
  const navigate = useNavigate();

  const [notificationsOpen, setNotificationsOpen] = useState(false);

  // Generate breadcrumb from path
  const pathParts = location.pathname.split('/').filter(Boolean);
  const breadcrumbs = pathParts.map((part, idx) => {
    const url = `/${pathParts.slice(0, idx + 1).join('/')}`;
    const name = part.charAt(0).toUpperCase() + part.slice(1);
    return { name, url };
  });

  const pendingItems = [
    ...expenseApprovals
      .filter((e) => e.status === 'Pending')
      .map((e) => ({
        id: e.id,
        title: `Expense Approval: ${e.title}`,
        time: e.submittedDate,
        type: 'expense',
        link: '/admin/finance/approvals',
      })),
    ...serviceRequests
      .filter((s) => s.status === 'Submitted')
      .map((s) => ({
        id: s.id,
        title: `New Service Request: ${s.serviceName}`,
        time: s.submissionDate,
        type: 'service',
        link: '/admin/services',
      })),
  ];

  return (
    <header className="sticky top-0 z-30 bg-white/95 dark:bg-stone-900/95 backdrop-blur-md border-b border-stone-200 dark:border-stone-800 h-16 flex items-center justify-between px-4 sm:px-6 lg:px-8">
      {/* Left: Mobile Toggle & Breadcrumb */}
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuToggle}
          className="lg:hidden p-2 rounded-xl text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800"
          aria-label="Toggle Navigation Sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Breadcrumb */}
        <nav className="hidden sm:flex items-center gap-1.5 text-xs text-stone-500 dark:text-stone-400">
          <Link to="/admin" className="hover:text-emerald-700 dark:hover:text-emerald-400 font-semibold">
            Council Admin
          </Link>
          {breadcrumbs.slice(1).map((crumb, idx) => (
            <React.Fragment key={crumb.url}>
              <ChevronRight className="w-3 h-3 text-stone-400" />
              <span
                className={
                  idx === breadcrumbs.length - 2
                    ? 'font-bold text-stone-900 dark:text-stone-100'
                    : 'hover:text-stone-700 dark:hover:text-stone-300'
                }
              >
                {crumb.name}
              </span>
            </React.Fragment>
          ))}
        </nav>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Global Search Button */}
        <button
          onClick={() => setIsSearchOpen(true)}
          className="flex items-center gap-2 px-3 py-1.5 text-xs text-stone-500 hover:text-stone-800 dark:text-stone-400 dark:hover:text-stone-200 bg-stone-100 dark:bg-stone-800 rounded-xl border border-stone-200 dark:border-stone-700"
        >
          <Search className="w-3.5 h-3.5 text-emerald-600" />
          <span className="hidden md:inline font-sans">Quick Search</span>
          <kbd className="hidden lg:inline px-1 py-0.5 text-[9px] font-mono bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 rounded-xs">
            ⌘K
          </kbd>
        </button>

        {/* Notifications Dropdown */}
        <div className="relative">
          <button
            onClick={() => setNotificationsOpen(!notificationsOpen)}
            className="relative p-2 rounded-xl text-stone-600 hover:text-stone-900 dark:text-stone-300 dark:hover:text-white bg-stone-100 dark:bg-stone-800 hover:bg-stone-200/80 transition-colors"
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
            {pendingItems.length > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-amber-500 text-stone-950 rounded-full text-[10px] font-bold flex items-center justify-center animate-pulse">
                {pendingItems.length}
              </span>
            )}
          </button>

          {notificationsOpen && (
            <div className="absolute right-0 mt-2 w-80 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-xl p-3 z-50 animate-in fade-in zoom-in-95">
              <div className="flex items-center justify-between border-b border-stone-100 dark:border-stone-800 pb-2 mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300">
                  Action Required ({pendingItems.length})
                </span>
                <span className="text-[10px] text-stone-400">Live Council Queue</span>
              </div>
              <div className="space-y-1 max-h-64 overflow-y-auto">
                {pendingItems.length === 0 ? (
                  <div className="p-4 text-center text-xs text-stone-400">
                    <CheckCircle2 className="w-6 h-6 text-emerald-500 mx-auto mb-1" />
                    All tasks reviewed and up to date!
                  </div>
                ) : (
                  pendingItems.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => {
                        navigate(item.link);
                        setNotificationsOpen(false);
                      }}
                      className="w-full text-left p-2 rounded-xl hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
                    >
                      <div className="text-xs font-semibold text-stone-800 dark:text-stone-200 line-clamp-1">
                        {item.title}
                      </div>
                      <div className="text-[10px] text-stone-400 mt-0.5">{item.time}</div>
                    </button>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Language Selector */}
        <LanguageSelector compact />

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-xl text-stone-600 hover:text-stone-900 dark:text-stone-300 dark:hover:text-white bg-stone-100 dark:bg-stone-800 transition-colors"
        >
          {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
        </button>
      </div>
    </header>
  );
};
