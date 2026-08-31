import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { Users, Search, Filter, BookOpen, Award, MapPin, Phone, HelpCircle, ArrowRight } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';

export const UlemaPage: React.FC = () => {
  const { ulema } = useApp();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpec, setSelectedSpec] = useState('All');
  const [selectedDistrict, setSelectedDistrict] = useState('All');

  const specializations = ['All', 'Fiqh & Usul al-Fiqh', 'Hadith Sciences', 'Tafsir & Quranic Sciences', 'Zakat & Islamic Finance', 'Arabic Linguistics'];
  const districts = ['All', ...Array.from(new Set(ulema.map((u) => u.district)))];

  const filtered = ulema.filter((u) => {
    const matchSearch =
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.specializations.some((s) => s.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchSpec = selectedSpec === 'All' || u.specializations.includes(selectedSpec);
    const matchDistrict = selectedDistrict === 'All' || u.district === selectedDistrict;
    return matchSearch && matchSpec && matchDistrict;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="border-b border-stone-200 dark:border-stone-800 pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-700 dark:text-blue-400 uppercase tracking-wider mb-2">
            <Users className="w-4 h-4" />
            <span>Scholarly Authority</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-stone-900 dark:text-stone-100">
            Ulema & Fatwa Board of Jimma Zone
          </h1>
          <p className="text-stone-500 dark:text-stone-400 text-sm sm:text-base mt-1 max-w-2xl">
            Vetted Islamic jurists, Muftis, Hadith scholars, and community arbitrators serving the Jimma Islamic Supreme Council.
          </p>
        </div>

        <Button
          variant="gold"
          size="sm"
          icon={<HelpCircle className="w-4 h-4" />}
          onClick={() => navigate('/services')}
        >
          Submit Fatwa Inquiry
        </Button>
      </div>

      {/* Filter & Search */}
      <div className="bg-white dark:bg-stone-900 p-4 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-xs flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search scholar name, specialization..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 outline-hidden text-stone-900 dark:text-stone-100"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          <select
            value={selectedSpec}
            onChange={(e) => setSelectedSpec(e.target.value)}
            className="px-3 py-2 text-xs sm:text-sm rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-800 dark:text-stone-200"
          >
            {specializations.map((s) => (
              <option key={s} value={s}>
                {s === 'All' ? 'All Disciplines' : s}
              </option>
            ))}
          </select>

          <select
            value={selectedDistrict}
            onChange={(e) => setSelectedDistrict(e.target.value)}
            className="px-3 py-2 text-xs sm:text-sm rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-800 dark:text-stone-200"
          >
            {districts.map((d) => (
              <option key={d} value={d}>
                {d === 'All' ? 'All Districts' : d}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Scholars Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((scholar) => (
          <Card key={scholar.id} hoverEffect className="flex flex-col justify-between">
            <div>
              <div className="flex items-start justify-between gap-2 mb-3">
                <div className="w-12 h-12 rounded-2xl bg-emerald-900 text-amber-300 flex items-center justify-center font-serif text-lg font-bold border border-emerald-700">
                  {scholar.name.split(' ')[1]?.charAt(0) || 'S'}
                </div>
                <div className="text-right">
                  <Badge variant="blue">{scholar.councilRole}</Badge>
                  <span className="text-[11px] text-stone-400 block mt-1">
                    {scholar.district}
                  </span>
                </div>
              </div>

              <h3 className="font-serif font-bold text-lg text-stone-900 dark:text-stone-100">
                {scholar.name}
              </h3>
              <p className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 mt-0.5">
                {scholar.title}
              </p>
              <p className="text-xs text-stone-500 dark:text-stone-400 mt-2 leading-relaxed line-clamp-2">
                {scholar.bio}
              </p>

              {/* Specializations & Sanad */}
              <div className="mt-4 pt-3 border-t border-stone-100 dark:border-stone-800 space-y-2 text-xs">
                <div>
                  <span className="text-[10px] uppercase font-bold text-stone-400 block">
                    Specializations
                  </span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {scholar.specializations.map((s) => (
                      <span
                        key={s}
                        className="text-[10px] px-2 py-0.5 rounded-md bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-1">
                  <span className="text-stone-500">Academic Sanad / Alma Mater:</span>
                  <span className="font-medium text-stone-800 dark:text-stone-200 block truncate">
                    {scholar.qualification}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-3 border-t border-stone-100 dark:border-stone-800">
              <Link to={`/ulema/${scholar.id}`}>
                <Button variant="secondary" size="sm" className="w-full justify-center text-xs">
                  View Full Scholar Dossier
                </Button>
              </Link>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
