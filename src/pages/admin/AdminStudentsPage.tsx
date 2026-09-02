import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import {
  GraduationCap,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  BookOpen,
  ArrowRight,
  Sparkles,
  ExternalLink,
  Award,
  CalendarCheck2,
} from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { CourseCertificateModal } from '../../components/certificates/CourseCertificateModal';
import { Student } from '../../types';

export const AdminStudentsPage: React.FC = () => {
  const { students, madrasas, addStudent, updateStudentProgress, addToast } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMadrasa, setSelectedMadrasa] = useState('All');
  const [selectedLevel, setSelectedLevel] = useState('All');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [certificateStudent, setCertificateStudent] = useState<Student | null>(null);

  // Add student form state
  const [name, setName] = useState('');
  const [age, setAge] = useState(14);
  const [gender, setGender] = useState<'Male' | 'Female'>('Male');
  const [madrasaId, setMadrasaId] = useState(madrasas[0]?.id || 'mad-1');
  const [guardianName, setGuardianName] = useState('');
  const [guardianPhone, setGuardianPhone] = useState('');
  const [currentJuz, setCurrentJuz] = useState(1);
  const [quranJuzCompleted, setQuranJuzCompleted] = useState(0);
  const [level, setLevel] = useState('Intermediate Tahfeez');
  const [tajweedRating, setTajweedRating] = useState<'Excellent' | 'Very Good' | 'Good' | 'Needs Revision'>('Very Good');

  const madrasaList = ['All', ...Array.from(new Set(students.map((s) => s.madrasaName)))];
  const levels = ['All', 'Nazira (Recitation)', 'Intermediate Tahfeez', 'Full Hifz Revision (Khatm)'];

  const filtered = students.filter((s) => {
    const term = (searchTerm || '').toLowerCase();
    const matchSearch =
      (s.name || '').toLowerCase().includes(term) ||
      (s.guardianName || '').toLowerCase().includes(term) ||
      (s.madrasaName || '').toLowerCase().includes(term);
    const matchMad = selectedMadrasa === 'All' || s.madrasaName === selectedMadrasa;
    const matchLev = selectedLevel === 'All' || s.level === selectedLevel;
    return matchSearch && matchMad && matchLev;
  });

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !guardianName || !guardianPhone) {
      addToast('Missing Required Information', 'Please provide student name, guardian name, and phone.', 'warning');
      return;
    }

    const selectedM = madrasas.find((m) => m.id === madrasaId) || madrasas[0];

    addStudent({
      name,
      age: Number(age),
      gender,
      madrasaId: selectedM.id,
      madrasaName: selectedM.name,
      enrollmentDate: new Date().toISOString().split('T')[0],
      guardianName,
      guardianPhone,
      currentJuz: Number(currentJuz),
      currentJuzProgress: 20,
      quranJuzCompleted: Number(quranJuzCompleted),
      sabaqSurah: 'Surah Al-Baqarah',
      sabaqAyahStart: 1,
      sabaqAyahEnd: 25,
      sabaqiJuz: Math.max(1, Number(quranJuzCompleted)),
      manzilJuz: 'Juz 1',
      dailyAttendance: 'Present',
      tajweedRating,
      level,
      status: 'Active',
    });

    setIsAddModalOpen(false);
    setName('');
    setGuardianName('');
    setGuardianPhone('');
    setCurrentJuz(1);
    setQuranJuzCompleted(0);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider mb-1">
            <GraduationCap className="w-4 h-4" />
            <span>Islamic Education Board • Quranic Hifz Desk</span>
          </div>
          <h1 className="text-2xl font-serif font-bold text-stone-900 dark:text-stone-100">
            Tahfeez Students & Hifz Progress Portal
          </h1>
          <p className="text-stone-500 dark:text-stone-400 text-xs sm:text-sm">
            Live monitoring of daily Sabaq, Sabaqi, Manzil, and 30-Juz completion status across Jimma Zone.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <Link to="/admin/attendance">
            <Button
              variant="outline"
              size="sm"
              icon={<CalendarCheck2 className="w-4 h-4 text-emerald-600" />}
            >
              Daily Attendance Sheet
            </Button>
          </Link>
          <Button
            variant="primary"
            size="sm"
            icon={<Plus className="w-4 h-4" />}
            onClick={() => setIsAddModalOpen(true)}
          >
            Enroll New Student
          </Button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white dark:bg-stone-900 p-4 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-xs flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search student, guardian, madrasa..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 outline-hidden"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          <select
            value={selectedMadrasa}
            onChange={(e) => setSelectedMadrasa(e.target.value)}
            className="px-3 py-2 text-xs sm:text-sm rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-800 dark:text-stone-200"
          >
            {madrasaList.map((m) => (
              <option key={m} value={m}>
                {m === 'All' ? 'All Madrasas' : m}
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
                {l === 'All' ? 'All Levels' : l}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Students Table */}
      <Card className="p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-50 dark:bg-stone-800 text-stone-500 uppercase text-[10px] font-bold border-b border-stone-200 dark:border-stone-700">
              <tr>
                <th className="p-3.5">Student Profile</th>
                <th className="p-3.5">Madrasa & Level</th>
                <th className="p-3.5">Hifz Progress (30 Juz)</th>
                <th className="p-3.5">Current Sabaq</th>
                <th className="p-3.5">Tajweed Rating</th>
                <th className="p-3.5">Today's Attendance</th>
                <th className="p-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 dark:divide-stone-800">
              {filtered.map((s) => {
                const percentage = Math.round((s.quranJuzCompleted / 30) * 100);
                return (
                  <tr key={s.id} className="hover:bg-stone-50/50 dark:hover:bg-stone-800/50">
                    {/* Student Name */}
                    <td className="p-3.5">
                      <div className="font-serif font-bold text-sm text-stone-900 dark:text-stone-100">
                        {s.name}
                      </div>
                      <span className="text-[10px] text-stone-400 font-mono">
                        Age: {s.age} • {s.gender} • ID: {s.id}
                      </span>
                    </td>

                    {/* Madrasa */}
                    <td className="p-3.5">
                      <div className="font-semibold text-stone-800 dark:text-stone-200 truncate max-w-[170px]">
                        {s.madrasaName}
                      </div>
                      <Badge variant="slate" size="sm">
                        {s.level}
                      </Badge>
                    </td>

                    {/* 30 Juz Progress Bar */}
                    <td className="p-3.5 min-w-[180px]">
                      <div className="flex items-center justify-between text-[11px] mb-1 font-mono">
                        <span className="font-bold text-emerald-700 dark:text-emerald-400">
                          {s.quranJuzCompleted} / 30 Juz
                        </span>
                        <span className="text-stone-400">{percentage}%</span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-stone-100 dark:bg-stone-800 overflow-hidden">
                        <div
                          className="h-full bg-emerald-600 rounded-full transition-all duration-300"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                      <span className="text-[10px] text-stone-400 block mt-0.5">
                        Current: Juz {s.currentJuz} ({s.currentJuzProgress}%)
                      </span>
                    </td>

                    {/* Sabaq details */}
                    <td className="p-3.5">
                      <div className="font-semibold text-stone-800 dark:text-stone-200">
                        {s.sabaqSurah}
                      </div>
                      <span className="text-[10px] text-stone-400 font-mono">
                        Ayah {s.sabaqAyahStart}–{s.sabaqAyahEnd}
                      </span>
                    </td>

                    {/* Tajweed */}
                    <td className="p-3.5">
                      <Badge
                        variant={
                          s.tajweedRating === 'Excellent'
                            ? 'gold'
                            : s.tajweedRating === 'Very Good'
                            ? 'emerald'
                            : 'slate'
                        }
                      >
                        {s.tajweedRating}
                      </Badge>
                    </td>

                    {/* Attendance */}
                    <td className="p-3.5">
                      <Badge
                        variant={
                          s.dailyAttendance === 'Present'
                            ? 'emerald'
                            : s.dailyAttendance === 'Excused'
                            ? 'gold'
                            : 'rose'
                        }
                      >
                        {s.dailyAttendance}
                      </Badge>
                    </td>

                    {/* Actions */}
                    <td className="p-3.5 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          icon={<Award className="w-3.5 h-3.5 text-amber-600" />}
                          onClick={() => setCertificateStudent(s)}
                          className="text-xs text-amber-700 dark:text-amber-400 border-amber-300 dark:border-amber-700/60"
                        >
                          Certificate (PDF)
                        </Button>
                        <Link to={`/admin/students/${s.id}`}>
                          <Button
                            variant="secondary"
                            size="sm"
                            icon={<ExternalLink className="w-3.5 h-3.5" />}
                            className="text-xs"
                          >
                            Progress Dossier
                          </Button>
                        </Link>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Enroll Student Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Enroll Tahfeez Student in Central Registry"
        subtitle="Register standard student file with daily Sabaq and 30-Juz progress ledger."
      >
        <form onSubmit={handleAddSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
              Student Full Name *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Zakariya Mustefa Kemal"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 outline-hidden"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                Age *
              </label>
              <input
                type="number"
                min="5"
                max="30"
                value={age}
                onChange={(e) => setAge(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 outline-hidden font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                Gender *
              </label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value as any)}
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                Madrasa *
              </label>
              <select
                value={madrasaId}
                onChange={(e) => setMadrasaId(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700"
              >
                {madrasas.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                Guardian Full Name *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Hajji Mustefa Kemal"
                value={guardianName}
                onChange={(e) => setGuardianName(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                Guardian Phone (SMS alerts) *
              </label>
              <input
                type="tel"
                required
                placeholder="e.g. +251 91 765 4321"
                value={guardianPhone}
                onChange={(e) => setGuardianPhone(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 outline-hidden font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                Completed Juz (0 - 30)
              </label>
              <input
                type="number"
                min="0"
                max="30"
                value={quranJuzCompleted}
                onChange={(e) => setQuranJuzCompleted(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 outline-hidden font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                Currently Memorizing Juz
              </label>
              <input
                type="number"
                min="1"
                max="30"
                value={currentJuz}
                onChange={(e) => setCurrentJuz(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 outline-hidden font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                Tajweed Proficiency
              </label>
              <select
                value={tajweedRating}
                onChange={(e) => setTajweedRating(e.target.value as any)}
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700"
              >
                <option value="Excellent">Excellent</option>
                <option value="Very Good">Very Good</option>
                <option value="Good">Good</option>
                <option value="Needs Revision">Needs Revision</option>
              </select>
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-stone-100 dark:border-stone-800">
            <Button variant="ghost" type="button" onClick={() => setIsAddModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              Enroll Student
            </Button>
          </div>
        </form>
      </Modal>

      {/* Course Completion & Sanad Certificate Generator Modal */}
      {certificateStudent && (
        <CourseCertificateModal
          isOpen={!!certificateStudent}
          onClose={() => setCertificateStudent(null)}
          student={certificateStudent}
        />
      )}
    </div>
  );
};
