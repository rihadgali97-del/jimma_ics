import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';
import { useApp } from '../../context/AppContext';
import { LanguageSelector } from '../common/LanguageSelector';
import {
  Menu,
  X,
  Search,
  Moon,
  Sun,
  Shield,
  HeartHandshake,
  LogIn,
  ChevronDown,
  Building,
  BookOpen,
  Users,
  Calendar,
  FileText,
  HandHeart,
  Landmark,
  Compass,
  Scale,
  Calculator,
} from 'lucide-react';
import { Button } from '../ui/Button';

export const Header: React.FC = () => {
  const { t, language, isRTL } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const { setIsSearchOpen, currentUser } = useApp();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [institutionsDropdown, setInstitutionsDropdown] = useState(false);

  const navLinks = [
    { label: t('home'), path: '/' },
    { label: t('about'), path: '/about' },
    {
      label: 'Institutions',
      isDropdown: true,
      children: [
        { label: t('mosques'), path: '/mosques', icon: <Building className="w-4 h-4 text-emerald-600" /> },
        { label: t('madrasas'), path: '/madrasas', icon: <BookOpen className="w-4 h-4 text-amber-600" /> },
        { label: t('ulema'), path: '/ulema', icon: <Users className="w-4 h-4 text-blue-600" /> },
        { label: t('gisMap'), path: '/map', icon: <Compass className="w-4 h-4 text-teal-600" /> },
      ],
    },
    { label: t('gisMap'), path: '/map' },
    { label: t('services'), path: '/services' },
    { label: t('events'), path: '/events' },
    { label: t('announcements'), path: '/announcements' },
    { label: t('transparency'), path: '/transparency' },
    { label: t('contact'), path: '/contact' },
  ];

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <header className="sticky top-0 z-30 bg-white/95 dark:bg-stone-900/95 backdrop-blur-md border-b border-stone-200/80 dark:border-stone-800 transition-colors">
      {/* Top institutional strip */}
      <div className="bg-emerald-950 text-emerald-100 text-xs py-1.5 px-4 sm:px-8 border-b border-emerald-900/80">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="font-serif tracking-wider text-amber-300 hidden sm:inline font-medium">
              بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
            </span>
            <span className="text-emerald-300 hidden md:inline">•</span>
            <span className="text-stone-300 font-sans truncate">
              Jimma Zone Islamic Affairs Supreme Council • Oromia, Ethiopia
            </span>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/services?tab=zakat"
              className="hidden lg:flex items-center gap-1 text-amber-300 hover:text-amber-200 font-semibold transition-colors"
            >
              <Calculator className="w-3.5 h-3.5" />
              <span>Zakat Calculator</span>
            </Link>
            <span className="text-emerald-800 hidden lg:inline">|</span>
            <Link
              to="/donate"
              className="flex items-center gap-1 text-amber-300 hover:text-amber-200 font-semibold transition-colors"
            >
              <HeartHandshake className="w-3.5 h-3.5" />
              <span>{t('donate')}</span>
            </Link>
            <span className="text-emerald-800">|</span>
            <Link
              to="/admin"
              className="flex items-center gap-1 text-emerald-200 hover:text-white transition-colors"
            >
              <Shield className="w-3.5 h-3.5 text-emerald-400" />
              <span>Admin Portal ({currentUser.role.split(' ')[0]})</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Main navigation bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo & Brand Identity */}
          <Link to="/" className="flex items-center gap-3 group">
            {/* Emblem / Star Icon */}
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-800 to-emerald-950 text-amber-300 flex items-center justify-center shadow-md border border-amber-400/40 group-hover:scale-105 transition-transform shrink-0">
              <Landmark className="w-6 h-6 text-amber-300" />
            </div>

            <div className="flex flex-col">
              <span className="font-serif font-bold text-lg sm:text-xl text-stone-900 dark:text-stone-100 tracking-tight leading-none group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors">
                {language === 'ar' ? 'مجلس الشؤون الإسلامية' : language === 'om' ? 'Majiilisa Jimmaa' : 'Jimma Islamic Council'}
              </span>
              <span className="text-[11px] font-sans text-stone-500 dark:text-stone-400 mt-1 uppercase tracking-wider font-semibold">
                Digital Management Platform
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden xl:flex items-center gap-1">
            {navLinks.map((link) => {
              if (link.isDropdown && link.children) {
                const isAnyChildActive = link.children.some((c) => isActive(c.path));
                return (
                  <div
                    key={link.label}
                    className="relative"
                    onMouseEnter={() => setInstitutionsDropdown(true)}
                    onMouseLeave={() => setInstitutionsDropdown(false)}
                  >
                    <button
                      className={`flex items-center gap-1 px-3.5 py-2 rounded-xl text-sm font-medium transition-colors ${
                        isAnyChildActive
                          ? 'text-emerald-800 dark:text-emerald-300 font-semibold bg-emerald-50 dark:bg-emerald-950/40'
                          : 'text-stone-700 dark:text-stone-300 hover:text-emerald-700 dark:hover:text-emerald-400 hover:bg-stone-50 dark:hover:bg-stone-800/50'
                      }`}
                    >
                      <span>{link.label}</span>
                      <ChevronDown className="w-3.5 h-3.5 opacity-70" />
                    </button>

                    {institutionsDropdown && (
                      <div className="absolute top-full left-0 w-56 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-xl p-2 z-50 animate-in fade-in zoom-in-95 duration-100">
                        {link.children.map((child) => (
                          <Link
                            key={child.path}
                            to={child.path}
                            onClick={() => setInstitutionsDropdown(false)}
                            className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm transition-colors ${
                              isActive(child.path)
                                ? 'bg-emerald-50 text-emerald-900 dark:bg-emerald-950/60 dark:text-emerald-200 font-semibold'
                                : 'text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800'
                            }`}
                          >
                            {child.icon}
                            <span>{child.label}</span>
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                );
              }

              return (
                <Link
                  key={link.path}
                  to={link.path!}
                  className={`px-3 py-2 rounded-xl text-sm font-medium transition-colors ${
                    isActive(link.path!)
                      ? 'text-emerald-800 dark:text-emerald-300 font-semibold bg-emerald-50 dark:bg-emerald-950/40'
                      : 'text-stone-700 dark:text-stone-300 hover:text-emerald-700 dark:hover:text-emerald-400 hover:bg-stone-50 dark:hover:bg-stone-800/50'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Right Action Icons: Search, Language, Theme, Donate CTA, Mobile Menu */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Search Trigger */}
            <button
              onClick={() => setIsSearchOpen(true)}
              className="flex items-center gap-2 px-3 py-2 text-xs sm:text-sm text-stone-500 hover:text-stone-800 dark:text-stone-400 dark:hover:text-stone-100 bg-stone-100/80 dark:bg-stone-800/80 hover:bg-stone-200/80 rounded-xl border border-stone-200/60 dark:border-stone-700/60 transition-colors"
              title="Search Council Records (Ctrl+K)"
            >
              <Search className="w-4 h-4 text-emerald-700 dark:text-emerald-400" />
              <span className="hidden md:inline font-sans">{t('search')}</span>
              <kbd className="hidden lg:inline-block px-1.5 py-0.5 text-[10px] font-mono text-stone-400 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 rounded-sm">
                ⌘K
              </kbd>
            </button>

            {/* Language Selector */}
            <LanguageSelector compact />

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl text-stone-600 hover:text-stone-900 dark:text-stone-300 dark:hover:text-white bg-stone-100 dark:bg-stone-800 hover:bg-stone-200/80 transition-colors"
              aria-label="Toggle Theme"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* Donate CTA */}
            <Link to="/donate" className="hidden sm:inline-flex">
              <Button
                variant="gold"
                size="sm"
                icon={<HeartHandshake className="w-4 h-4" />}
                className="font-bold shadow-sm"
              >
                {t('donate')}
              </Button>
            </Link>

            {/* Mobile Hamburger Menu */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="xl:hidden p-2 rounded-xl text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
              aria-label="Toggle Mobile Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="xl:hidden bg-white dark:bg-stone-900 border-b border-stone-200 dark:border-stone-800 px-4 py-6 animate-in slide-in-from-top-2 duration-150 shadow-xl max-h-[80vh] overflow-y-auto">
          <nav className="space-y-1">
            <Link
              to="/"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-4 py-2.5 rounded-xl text-base font-medium text-stone-800 dark:text-stone-200 hover:bg-emerald-50 dark:hover:bg-emerald-950/40"
            >
              {t('home')}
            </Link>
            <Link
              to="/about"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-4 py-2.5 rounded-xl text-base font-medium text-stone-800 dark:text-stone-200 hover:bg-emerald-50 dark:hover:bg-emerald-950/40"
            >
              {t('about')}
            </Link>

            {/* Institutions Group */}
            <div className="pt-2 pb-1 px-4 text-xs font-bold uppercase tracking-wider text-stone-400">
              Institutions & Directory
            </div>
            <Link
              to="/mosques"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-stone-700 dark:text-stone-300 hover:bg-emerald-50 dark:hover:bg-emerald-950/40"
            >
              <Building className="w-4 h-4 text-emerald-600" />
              <span>{t('mosques')} Directory</span>
            </Link>
            <Link
              to="/madrasas"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-stone-700 dark:text-stone-300 hover:bg-amber-50 dark:hover:bg-amber-950/40"
            >
              <BookOpen className="w-4 h-4 text-amber-600" />
              <span>{t('madrasas')} & Hifz</span>
            </Link>
            <Link
              to="/ulema"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-stone-700 dark:text-stone-300 hover:bg-blue-50 dark:hover:bg-blue-950/40"
            >
              <Users className="w-4 h-4 text-blue-600" />
              <span>{t('ulema')} Scholars</span>
            </Link>
            <Link
              to="/map"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-emerald-800 dark:text-emerald-300 bg-emerald-50/80 dark:bg-emerald-950/40"
            >
              <Compass className="w-4 h-4 text-emerald-600" />
              <span className="font-bold">{t('gisMap')} (Interactive 18 Woredas)</span>
            </Link>

            {/* Services & Community */}
            <div className="pt-3 pb-1 px-4 text-xs font-bold uppercase tracking-wider text-stone-400">
              Community & Governance
            </div>
            <Link
              to="/services"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-4 py-2.5 rounded-xl text-base font-medium text-stone-800 dark:text-stone-200 hover:bg-emerald-50 dark:hover:bg-emerald-950/40"
            >
              {t('services')} (Nikah, Zakat, Janazah)
            </Link>
            <Link
              to="/events"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-4 py-2.5 rounded-xl text-base font-medium text-stone-800 dark:text-stone-200 hover:bg-emerald-50 dark:hover:bg-emerald-950/40"
            >
              {t('events')}
            </Link>
            <Link
              to="/announcements"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-4 py-2.5 rounded-xl text-base font-medium text-stone-800 dark:text-stone-200 hover:bg-emerald-50 dark:hover:bg-emerald-950/40"
            >
              {t('announcements')}
            </Link>
            <Link
              to="/transparency"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-4 py-2.5 rounded-xl text-base font-medium text-stone-800 dark:text-stone-200 hover:bg-emerald-50 dark:hover:bg-emerald-950/40"
            >
              {t('transparency')} & Reports
            </Link>
            <Link
              to="/contact"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-4 py-2.5 rounded-xl text-base font-medium text-stone-800 dark:text-stone-200 hover:bg-emerald-50 dark:hover:bg-emerald-950/40"
            >
              {t('contact')}
            </Link>

            {/* Mobile Actions */}
            <div className="pt-4 mt-2 border-t border-stone-100 dark:border-stone-800 space-y-2">
              <Link
                to="/donate"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full flex items-center justify-center gap-2 py-3 bg-amber-600 text-white font-bold rounded-xl text-sm shadow-sm"
              >
                <HeartHandshake className="w-4 h-4" />
                <span>{t('donateNowBtn')}</span>
              </Link>
              <Link
                to="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full flex items-center justify-center gap-2 py-3 bg-emerald-800 text-white font-bold rounded-xl text-sm shadow-sm"
              >
                <Shield className="w-4 h-4 text-emerald-300" />
                <span>Open Admin Portal</span>
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};
