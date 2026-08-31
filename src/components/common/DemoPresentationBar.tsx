import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';
import {
  Sparkles,
  ChevronRight,
  UserCheck,
  Moon,
  Sun,
  Layers,
  ChevronDown,
  X,
  Compass,
} from 'lucide-react';

export const DemoPresentationBar: React.FC = () => {
  const { currentUser, switchRole, allUsers, addToast } = useApp();
  const { theme, toggleTheme } = useTheme();
  const { language, setLanguage } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();

  const [isOpen, setIsOpen] = useState(false);
  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);

  const demoTourSteps = [
    { step: 1, label: '1. Public Homepage', path: '/' },
    { step: 2, label: '2. Council Statistics', path: '/#stats' },
    { step: 3, label: '3. Mosque Directory', path: '/mosques' },
    { step: 4, label: '4. Mosque Detail (Grand Anwar)', path: '/mosques/mosque-1' },
    { step: 5, label: '5. Madrasa & Imam View', path: '/mosques/mosque-1' },
    { step: 6, label: '6. Madrasa Directory', path: '/madrasas' },
    { step: 7, label: '7. Student Directory (Admin)', path: '/admin/students' },
    { step: 8, label: '8. Student Profile (Ahmed Mohammed)', path: '/admin/students/student-1' },
    { step: 9, label: '9. Quran / Hifz Tracker', path: '/admin/students/student-1' },
    { step: 10, label: '10. Admin Executive Dashboard', path: '/admin' },
    { step: 11, label: '11. Finance Control Center', path: '/admin/finance' },
    { step: 12, label: '12. Expense Approval Flow', path: '/admin/finance/approvals' },
    { step: 13, label: '13. Public Donations Portal', path: '/donate' },
    { step: 14, label: '14. Service Request Workflow', path: '/admin/services' },
    { step: 15, label: '15. Public Transparency Portal', path: '/transparency' },
    { step: 16, label: '16. Teacher Daily Attendance Sheet', path: '/admin/attendance' },
    { step: 17, label: '17. Ulema Scholar Directory', path: '/ulema' },
    { step: 18, label: '18. Interactive Jimma Zone GIS Map', path: '/map' },
    { step: 19, label: '19. SMS & Telegram Gateway Simulation', path: '/admin/gateway' },
    { step: 20, label: '20. Strategic Council Roadmap', path: '/about' },
  ];

  const handleJump = (path: string, label: string) => {
    navigate(path);
    setIsOpen(false);
    addToast('Demo Step Activated', `Navigated to: ${label}`, 'info');
  };

  if (isMinimized) {
    return (
      <div className="fixed bottom-4 left-4 z-50">
        <button
          onClick={() => setIsMinimized(false)}
          className="flex items-center gap-2 px-3.5 py-2 bg-emerald-900 text-amber-300 rounded-full shadow-xl border border-amber-400/40 text-xs font-semibold hover:bg-emerald-800 transition-all cursor-pointer"
        >
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>Demo Tour Assistant</span>
        </button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-3 left-1/2 -translate-x-1/2 z-40 w-[95%] max-w-4xl bg-stone-900/95 dark:bg-stone-950/95 text-stone-200 border border-amber-500/30 rounded-2xl shadow-2xl backdrop-blur-md px-3.5 py-2.5 flex flex-wrap items-center justify-between gap-3 text-xs">
      {/* Left: Badge & Step Quick Jump */}
      <div className="flex items-center gap-2">
        <span className="flex items-center gap-1.5 px-2.5 py-1 bg-amber-500/20 text-amber-300 font-bold tracking-wider rounded-lg border border-amber-500/30 uppercase text-[10px]">
          <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
          Presentation Tour
        </span>

        {/* Quick Demo Dropdown */}
        <div className="relative">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-stone-800 hover:bg-stone-700 text-stone-100 rounded-xl border border-stone-700 transition-colors font-medium"
          >
            <Compass className="w-3.5 h-3.5 text-emerald-400" />
            <span>18 Presentation Steps</span>
            <ChevronDown className="w-3 h-3 text-stone-400" />
          </button>

          {isOpen && (
            <div className="absolute bottom-full mb-2 left-0 w-80 max-h-96 overflow-y-auto bg-stone-900 border border-stone-700 rounded-2xl shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95">
              <div className="px-3 py-1.5 text-[11px] font-bold text-amber-400 uppercase tracking-wider border-b border-stone-800 flex justify-between items-center">
                <span>Demo Walkthrough Highlights</span>
                <span className="text-[10px] text-stone-400 font-normal">Click to jump</span>
              </div>
              <div className="divide-y divide-stone-800/60 mt-1">
                {demoTourSteps.map((s) => {
                  const isCurrent = location.pathname === s.path.split('#')[0];
                  return (
                    <button
                      key={s.step}
                      onClick={() => handleJump(s.path, s.label)}
                      className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between transition-colors rounded-lg ${
                        isCurrent
                          ? 'bg-emerald-950/80 text-emerald-300 font-semibold'
                          : 'text-stone-300 hover:bg-stone-800 hover:text-white'
                      }`}
                    >
                      <span>{s.label}</span>
                      <ChevronRight className="w-3 h-3 text-stone-500" />
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Center: Active Role Switcher */}
      <div className="flex items-center gap-2">
        <div className="relative">
          <button
            onClick={() => setShowRoleMenu(!showRoleMenu)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-stone-800 hover:bg-stone-700 text-stone-200 rounded-xl border border-stone-700 font-medium"
          >
            <UserCheck className="w-3.5 h-3.5 text-amber-400" />
            <span>Role:</span>
            <span className="text-amber-300 font-semibold">{currentUser.role}</span>
            <ChevronDown className="w-3 h-3 text-stone-400" />
          </button>

          {showRoleMenu && (
            <div className="absolute bottom-full mb-2 left-0 sm:right-0 sm:left-auto w-64 bg-stone-900 border border-stone-700 rounded-2xl shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95">
              <div className="px-3 py-1.5 text-[11px] font-bold text-amber-400 uppercase tracking-wider border-b border-stone-800">
                Switch Demo User Role
              </div>
              <div className="mt-1 space-y-0.5 max-h-60 overflow-y-auto">
                {allUsers.map((u) => (
                  <button
                    key={u.id}
                    onClick={() => {
                      switchRole(u.role);
                      setShowRoleMenu(false);
                    }}
                    className={`w-full text-left px-3 py-2 text-xs rounded-lg transition-colors flex items-center justify-between ${
                      currentUser.role === u.role
                        ? 'bg-amber-950/70 text-amber-300 font-bold'
                        : 'text-stone-300 hover:bg-stone-800'
                    }`}
                  >
                    <div>
                      <div className="font-semibold">{u.name}</div>
                      <div className="text-[10px] text-stone-400">{u.role}</div>
                    </div>
                    {currentUser.role === u.role && (
                      <span className="w-2 h-2 rounded-full bg-amber-400" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Quick Portal Switch */}
        {location.pathname.startsWith('/admin') ? (
          <button
            onClick={() => navigate('/')}
            className="hidden sm:flex items-center gap-1 px-3 py-1.5 bg-emerald-800 hover:bg-emerald-700 text-white rounded-xl font-medium transition-colors cursor-pointer"
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Public Site</span>
          </button>
        ) : (
          <button
            onClick={() => navigate('/admin')}
            className="hidden sm:flex items-center gap-1 px-3 py-1.5 bg-emerald-800 hover:bg-emerald-700 text-white rounded-xl font-medium transition-colors cursor-pointer"
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Admin Portal</span>
          </button>
        )}
      </div>

      {/* Right: Language / Theme / Minimize */}
      <div className="flex items-center gap-1.5">
        {/* Language Quick Toggle */}
        <div className="flex items-center bg-stone-800 rounded-xl p-0.5 border border-stone-700">
          {(['en', 'om', 'ar'] as const).map((lang) => (
            <button
              key={lang}
              onClick={() => setLanguage(lang)}
              className={`px-2 py-1 rounded-lg text-[11px] font-semibold transition-colors uppercase ${
                language === lang
                  ? 'bg-amber-500 text-stone-950 shadow-xs'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              {lang}
            </button>
          ))}
        </div>

        {/* Dark/Light Toggle */}
        <button
          onClick={toggleTheme}
          className="p-1.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 transition-colors"
          title="Toggle Theme"
        >
          {theme === 'dark' ? <Sun className="w-3.5 h-3.5 text-amber-400" /> : <Moon className="w-3.5 h-3.5" />}
        </button>

        {/* Minimize Button */}
        <button
          onClick={() => setIsMinimized(true)}
          className="p-1.5 rounded-xl text-stone-400 hover:text-stone-200 hover:bg-stone-800 transition-colors"
          title="Minimize Demo Bar"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
