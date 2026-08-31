import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { useLanguage } from '../../context/LanguageContext';
import { BookOpen, Search, Filter, Users, MapPin, Award, CheckCircle2, ArrowRight } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';

export const MadrasasPage: React.FC = () => {
  const { madrasas } = useApp();
  const { t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('All');
  const [selectedLevel, setSelectedLevel] = useState('All');

  const districts = ['All', ...Array.from(new Set(madrasas.map((m) => m.district)))];
  const levels = ['All', 'Primary Madrasa', 'Intermediate Tahfeez', 'Advanced Shari\'ah College'];

  const filtered = madrasas.filter((m) => {
    const matchSearch =
      m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.district.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.headTeacher.toLowerCase().includes(searchTerm.toLowerCase());
    const matchDistrict = selectedDistrict === 'All' || m.district === selectedDistrict;
    const matchLevel = selectedLevel === 'All' || m.level === selectedLevel;
    return matchSearch && matchDistrict && matchLevel;
  });

  const totalEnrolled = madrasas.reduce((acc, m) => acc + m.totalStudents, 0);
  const totalGrads = madrasas.reduce((acc, m) => acc + m.hifzGraduatesCount, 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="border-b border-stone-200 dark:border-stone-800 pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wider mb-2">
            <BookOpen className="w-4 h-4" />
            <span>Islamic Education Board</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-stone-900 dark:text-stone-100">
            Madrasas & Quranic Centers
          </h1>
          <p className="text-stone-500 dark:text-stone-400 text-sm sm:text-base mt-1 max-w-2xl">
            Accredited Islamic education institutions, Tahfeez halaqat, and Arabic language academies across Jimma Zone.
          </p>
        </div>

        {/* Quick summary numbers */}
        <div className="flex items-center gap-3 bg-amber-50 dark:bg-amber-950/40 p-3 rounded-2xl border border-amber-200 dark:border-amber-900/60 text-xs">
          <div>
            <span className="text-stone-500 block text-[10px] uppercase">Total Enrolled</span>
            <span className="font-bold text-stone-900 dark:text-stone-100 font-mono text-sm">
              {totalEnrolled.toLocaleString()} Students
            </span>
          </div>
          <div className="h-6 w-px bg-amber-300 dark:bg-amber-800" />
          <div>
            <span className="text-stone-500 block text-[10px] uppercase">Huffaz Produced</span>
            <span className="font-bold text-emerald-600 font-mono text-sm">
              {totalGrads}+ Graduates
            </span>
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white dark:bg-stone-900 p-4 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-xs flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search madrasa, head teacher, district..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 outline-hidden text-stone-900 dark:text-stone-100"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
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

          <select
            value={selectedLevel}
            onChange={(e) => setSelectedLevel(e.target.value)}
            className="px-3 py-2 text-xs sm:text-sm rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-800 dark:text-stone-200"
          >
            {levels.map((l) => (
              <option key={l} value={l}>
                {l}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Madrasa Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((madrasa) => (
          <Card key={madrasa.id} hoverEffect className="flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <Badge variant="gold">{madrasa.level}</Badge>
                <span className="text-xs text-stone-400 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-amber-500" />
                  {madrasa.district}
                </span>
              </div>

              <h3 className="font-serif font-bold text-lg text-stone-900 dark:text-stone-100">
                {madrasa.name}
              </h3>
              <p className="text-xs text-stone-500 dark:text-stone-400 mt-1 line-clamp-2 leading-relaxed">
                {madrasa.description}
              </p>

              {/* Stats & Head Teacher */}
              <div className="mt-4 pt-3 border-t border-stone-100 dark:border-stone-800 space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-stone-500">Head Teacher:</span>
                  <span className="font-semibold text-stone-800 dark:text-stone-200 truncate max-w-[180px]">
                    {madrasa.headTeacher}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500">Students Enrolled:</span>
                  <span className="font-mono font-bold text-emerald-700 dark:text-emerald-400">
                    {madrasa.totalStudents} (Boys: {madrasa.maleStudents}, Girls: {madrasa.femaleStudents})
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500">Shift & Timings:</span>
                  <span className="text-stone-800 dark:text-stone-200 font-medium">
                    {madrasa.shift}
                  </span>
                </div>
              </div>

              {/* Subjects Pills */}
              <div className="mt-3 flex flex-wrap gap-1">
                {madrasa.curriculum.slice(0, 3).map((sub) => (
                  <span
                    key={sub}
                    className="text-[10px] px-2 py-0.5 rounded-md bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300"
                  >
                    {sub}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-6 pt-3 border-t border-stone-100 dark:border-stone-800 flex items-center gap-2">
              <Link to={`/madrasas/${madrasa.id}`} className="w-full">
                <Button variant="secondary" size="sm" className="w-full justify-center text-xs">
                  Inspect Madrasa
                </Button>
              </Link>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
