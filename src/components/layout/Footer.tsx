import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import {
  Landmark,
  MapPin,
  Phone,
  Mail,
  Clock,
  Shield,
  HeartHandshake,
  ExternalLink,
  ChevronRight,
} from 'lucide-react';
import { IslamicPattern } from '../common/IslamicPattern';

export const Footer: React.FC = () => {
  const { t, language } = useLanguage();

  return (
    <footer className="relative bg-stone-950 text-stone-300 pt-16 pb-24 border-t border-stone-800 overflow-hidden">
      {/* Decorative Islamic Star Pattern Watermark */}
      <IslamicPattern opacity={0.03} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8 pb-12 border-b border-stone-800/80">
          {/* Col 1: Brand & Civic Identity */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-900 text-amber-300 flex items-center justify-center border border-amber-400/40 shadow-lg">
                <Landmark className="w-6 h-6 text-amber-300" />
              </div>
              <div>
                <h3 className="font-serif font-bold text-lg text-white tracking-tight">
                  {language === 'ar'
                    ? 'مجلس الشؤون الإسلامية لمنطقة جيما'
                    : language === 'om'
                    ? 'Majiilisa Dhimmoota Islaamummaa Godina Jimmaa'
                    : 'Jimma Zone Islamic Affairs Supreme Council'}
                </h3>
                <p className="text-xs text-amber-400 font-sans">
                  Serving 18 Districts • Islamic Education • Zakat & Community Development
                </p>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-stone-400 leading-relaxed">
              Official digital institutional infrastructure for Jimma Zone, coordinating
              mosque administration, traditional and modern madrasa curricula, Fatwa guidance,
              Zakat disbursals, and public social welfare services.
            </p>

            <div className="pt-2 text-xs text-stone-400 space-y-1.5">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Central Secretariat Building, Grand Mosque Ave, Jimma City, Oromia, Ethiopia</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-amber-400 shrink-0" />
                <span>+251 47 111 8842 / +251 47 111 9020</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-blue-400 shrink-0" />
                <span>secretariat@jimmaislamiccouncil.org</span>
              </div>
            </div>
          </div>

          {/* Col 2: Institutional Portals */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 font-sans">
              Institutions
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm">
              <li>
                <Link to="/mosques" className="text-stone-400 hover:text-white transition-colors flex items-center gap-1.5">
                  <ChevronRight className="w-3.5 h-3.5 text-stone-600" />
                  <span>Mosques Directory (128+)</span>
                </Link>
              </li>
              <li>
                <Link to="/madrasas" className="text-stone-400 hover:text-white transition-colors flex items-center gap-1.5">
                  <ChevronRight className="w-3.5 h-3.5 text-stone-600" />
                  <span>Madrasas & Hifz Centers</span>
                </Link>
              </li>
              <li>
                <Link to="/ulema" className="text-stone-400 hover:text-white transition-colors flex items-center gap-1.5">
                  <ChevronRight className="w-3.5 h-3.5 text-stone-600" />
                  <span>Ulema Scholars Directory</span>
                </Link>
              </li>
              <li>
                <Link to="/map" className="text-emerald-400 hover:text-emerald-300 font-semibold transition-colors flex items-center gap-1.5">
                  <ChevronRight className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Interactive GIS Map (18 Woredas)</span>
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-stone-400 hover:text-white transition-colors flex items-center gap-1.5">
                  <ChevronRight className="w-3.5 h-3.5 text-stone-600" />
                  <span>Executive Leadership</span>
                </Link>
              </li>
              <li>
                <Link to="/admin/attendance" className="text-stone-400 hover:text-white transition-colors flex items-center gap-1.5">
                  <ChevronRight className="w-3.5 h-3.5 text-stone-600" />
                  <span>Teacher Attendance Sheet</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Public Services & Welfare */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400 font-sans">
              Public Services
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm">
              <li>
                <Link to="/services" className="text-stone-400 hover:text-white transition-colors flex items-center gap-1.5">
                  <ChevronRight className="w-3.5 h-3.5 text-stone-600" />
                  <span>Nikah Registration & Certificate</span>
                </Link>
              </li>
              <li>
                <Link to="/services" className="text-stone-400 hover:text-white transition-colors flex items-center gap-1.5">
                  <ChevronRight className="w-3.5 h-3.5 text-stone-600" />
                  <span>Zakat Calculator & Distribution</span>
                </Link>
              </li>
              <li>
                <Link to="/services" className="text-stone-400 hover:text-white transition-colors flex items-center gap-1.5">
                  <ChevronRight className="w-3.5 h-3.5 text-stone-600" />
                  <span>Janazah & Burial Coordination</span>
                </Link>
              </li>
              <li>
                <Link to="/services" className="text-stone-400 hover:text-white transition-colors flex items-center gap-1.5">
                  <ChevronRight className="w-3.5 h-3.5 text-stone-600" />
                  <span>Fatwa & Shari'ah Inquiries</span>
                </Link>
              </li>
              <li>
                <Link to="/donate" className="text-stone-400 hover:text-white transition-colors flex items-center gap-1.5">
                  <ChevronRight className="w-3.5 h-3.5 text-stone-600" />
                  <span>Public Donation Portal</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Governance & Transparency */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-blue-400 font-sans">
              Governance
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm">
              <li>
                <Link to="/transparency" className="text-stone-400 hover:text-white transition-colors flex items-center gap-1.5">
                  <ChevronRight className="w-3.5 h-3.5 text-stone-600" />
                  <span>Financial Transparency Reports</span>
                </Link>
              </li>
              <li>
                <Link to="/announcements" className="text-stone-400 hover:text-white transition-colors flex items-center gap-1.5">
                  <ChevronRight className="w-3.5 h-3.5 text-stone-600" />
                  <span>Official Council Declarations</span>
                </Link>
              </li>
              <li>
                <Link to="/events" className="text-stone-400 hover:text-white transition-colors flex items-center gap-1.5">
                  <ChevronRight className="w-3.5 h-3.5 text-stone-600" />
                  <span>Conferences & Mawlid Programs</span>
                </Link>
              </li>
              <li>
                <Link to="/admin" className="text-amber-400 hover:text-amber-300 font-semibold transition-colors flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5" />
                  <span>Council Management Portal</span>
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Row */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-500">
          <div>
            © 2026 Jimma Zone Islamic Affairs Supreme Council. All rights reserved.
          </div>
          <div className="flex items-center gap-4">
            <span className="text-stone-400">
              Verified Shari'ah Oversight Board • Jimma, Oromia, Ethiopia
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
