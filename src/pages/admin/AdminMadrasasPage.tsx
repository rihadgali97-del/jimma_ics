import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import {
  BookOpen,
  Plus,
  Search,
  Filter,
  Users,
  GraduationCap,
  ExternalLink,
  MapPin,
} from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';

export const AdminMadrasasPage: React.FC = () => {
  const { madrasas, addMadrasa, addToast } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('All');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Form state
  const [name, setName] = useState('');
  const [district, setDistrict] = useState('Jimma Central');
  const [address, setAddress] = useState('');
  const [level, setLevel] = useState<'Primary Madrasa' | 'Intermediate Tahfeez' | 'Advanced Shari\'ah College'>('Intermediate Tahfeez');
  const [headTeacher, setHeadTeacher] = useState('');
  const [totalStudents, setTotalStudents] = useState(150);
  const [totalTeachers, setTotalTeachers] = useState(6);
  const [shift, setShift] = useState('Morning & Weekend');
  const [description, setDescription] = useState('');

  const districts = ['All', ...Array.from(new Set(madrasas.map((m) => m.district)))];

  const filtered = madrasas.filter((m) => {
    const matchSearch =
      m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.district.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.headTeacher.toLowerCase().includes(searchTerm.toLowerCase());
    const matchDistrict = selectedDistrict === 'All' || m.district === selectedDistrict;
    return matchSearch && matchDistrict;
  });

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !headTeacher) {
      addToast('Missing Required Fields', 'Please complete the madrasa name and head teacher.', 'warning');
      return;
    }

    addMadrasa({
      name,
      district,
      address: address || `${district} Main Center`,
      level,
      headTeacher,
      totalStudents: Number(totalStudents),
      maleStudents: Math.round(Number(totalStudents) * 0.55),
      femaleStudents: Math.round(Number(totalStudents) * 0.45),
      totalTeachers: Number(totalTeachers),
      curriculum: ['Quranic Memorization (Tahfeez)', 'Tajweed Rules', 'Islamic Creed (Aqeedah)', 'Arabic Grammar'],
      hifzGraduatesCount: 12,
      shift,
      description: description || 'Accredited Islamic education institution under Jimma Islamic Council.',
      establishedYear: 2026,
    });

    setIsAddModalOpen(false);
    setName('');
    setHeadTeacher('');
    setDescription('');
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-serif font-bold text-stone-900 dark:text-stone-100">
            Madrasa & Tahfeez Board Administration
          </h1>
          <p className="text-stone-500 dark:text-stone-400 text-xs sm:text-sm">
            Curriculum tracking, institutional accreditation, student rolls, and faculty allocations.
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          icon={<Plus className="w-4 h-4" />}
          onClick={() => setIsAddModalOpen(true)}
        >
          Accredit New Madrasa
        </Button>
      </div>

      {/* Filter & Search */}
      <div className="bg-white dark:bg-stone-900 p-4 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-xs flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search madrasa, head teacher, district..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 outline-hidden"
          />
        </div>

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

      {/* Table */}
      <Card className="p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-50 dark:bg-stone-800 text-stone-500 uppercase text-[10px] font-bold border-b border-stone-200 dark:border-stone-700">
              <tr>
                <th className="p-3.5">Institution Name</th>
                <th className="p-3.5">Level</th>
                <th className="p-3.5">District</th>
                <th className="p-3.5">Head Teacher</th>
                <th className="p-3.5">Enrolled Students</th>
                <th className="p-3.5">Graduated Huffaz</th>
                <th className="p-3.5">Faculty</th>
                <th className="p-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 dark:divide-stone-800">
              {filtered.map((m) => (
                <tr key={m.id} className="hover:bg-stone-50/50 dark:hover:bg-stone-800/50">
                  <td className="p-3.5">
                    <div className="font-serif font-bold text-sm text-stone-900 dark:text-stone-100">
                      {m.name}
                    </div>
                    <span className="text-[10px] text-stone-400 font-mono">ID: {m.id}</span>
                  </td>
                  <td className="p-3.5">
                    <Badge variant="gold">{m.level}</Badge>
                  </td>
                  <td className="p-3.5 text-stone-600 dark:text-stone-300 font-medium">
                    {m.district}
                  </td>
                  <td className="p-3.5 font-medium text-stone-800 dark:text-stone-200">
                    {m.headTeacher}
                  </td>
                  <td className="p-3.5 font-mono font-bold text-emerald-700 dark:text-emerald-400">
                    {m.totalStudents}
                  </td>
                  <td className="p-3.5 font-mono font-bold text-amber-600 dark:text-amber-400">
                    {m.hifzGraduatesCount}+
                  </td>
                  <td className="p-3.5 text-stone-700 dark:text-stone-300">
                    {m.totalTeachers} Mu'allims
                  </td>
                  <td className="p-3.5 text-right">
                    <Link to={`/madrasas/${m.id}`}>
                      <Button variant="ghost" size="sm" icon={<ExternalLink className="w-3.5 h-3.5" />}>
                        View
                      </Button>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Add Madrasa Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Accredit New Madrasa / Quran Center"
        subtitle="Register standard Islamic education facility in the central council directory."
      >
        <form onSubmit={handleAddSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
              Madrasa Official Name *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Bilal ibn Rabah Quranic Academy"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 outline-hidden"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                District *
              </label>
              <select
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700"
              >
                <option value="Jimma Central">Jimma Central</option>
                <option value="Agaro Town">Agaro Town</option>
                <option value="Kersa District">Kersa District</option>
                <option value="Mana District">Mana District</option>
                <option value="Gomma District">Gomma District</option>
                <option value="Limmu Kosa">Limmu Kosa</option>
                <option value="Seka Chekorsa">Seka Chekorsa</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                Academic Level *
              </label>
              <select
                value={level}
                onChange={(e) => setLevel(e.target.value as any)}
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700"
              >
                <option value="Primary Madrasa">Primary Madrasa</option>
                <option value="Intermediate Tahfeez">Intermediate Tahfeez</option>
                <option value="Advanced Shari'ah College">Advanced Shari'ah College</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                Head Teacher / Sheikh *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Ustadh Khalid Ahmed"
                value={headTeacher}
                onChange={(e) => setHeadTeacher(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                Total Enrolled
              </label>
              <input
                type="number"
                min="10"
                value={totalStudents}
                onChange={(e) => setTotalStudents(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 outline-hidden font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                Faculty Teachers
              </label>
              <input
                type="number"
                min="1"
                value={totalTeachers}
                onChange={(e) => setTotalTeachers(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 outline-hidden font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
              Description & Accreditation Remarks
            </label>
            <textarea
              rows={2}
              placeholder="Hafiz training facilities, classroom setup, and boarding capacity..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 outline-hidden"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-stone-100 dark:border-stone-800">
            <Button variant="ghost" type="button" onClick={() => setIsAddModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              Accredit Madrasa
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
