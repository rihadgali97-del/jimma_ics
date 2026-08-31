import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Users,
  Plus,
  Search,
  BookOpen,
  Award,
  Calendar,
  CheckCircle2,
  DollarSign,
} from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';

export const AdminTeachersPage: React.FC = () => {
  const { teachers, madrasas, addToast } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Form
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [madrasaId, setMadrasaId] = useState(madrasas[0]?.id || 'mad-1');
  const [specialization, setSpecialization] = useState('Hifz & Tajweed');
  const [sanad, setSanad] = useState('Hafs an Asim (Shatibiyyah)');
  const [experienceYears, setExperienceYears] = useState(8);
  const [salaryETB, setSalaryETB] = useState(8500);

  const filtered = teachers.filter(
    (t) =>
      t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.madrasaName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.specialization.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone) {
      addToast('Missing Fields', 'Please complete all teacher information.', 'warning');
      return;
    }

    addToast('Teacher Registered', `Ustadh ${name} added to the central faculty registry.`, 'success');
    setIsAddModalOpen(false);
    setName('');
    setPhone('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-serif font-bold text-stone-900 dark:text-stone-100">
            Madrasa Faculty & Mu'allim Registry
          </h1>
          <p className="text-stone-500 dark:text-stone-400 text-xs sm:text-sm">
            Managing certified Quran teachers, Sanad qualifications, student allocations, and council stipends.
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          icon={<Plus className="w-4 h-4" />}
          onClick={() => setIsAddModalOpen(true)}
        >
          Register Mu'allim
        </Button>
      </div>

      {/* Search */}
      <div className="bg-white dark:bg-stone-900 p-4 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-xs">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search teacher, madrasa, specialization..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 outline-hidden"
          />
        </div>
      </div>

      {/* Teachers Table */}
      <Card className="p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-50 dark:bg-stone-800 text-stone-500 uppercase text-[10px] font-bold border-b border-stone-200 dark:border-stone-700">
              <tr>
                <th className="p-3.5">Teacher Name</th>
                <th className="p-3.5">Assigned Madrasa</th>
                <th className="p-3.5">Specialization</th>
                <th className="p-3.5">Sanad / License</th>
                <th className="p-3.5">Experience</th>
                <th className="p-3.5">Students Assigned</th>
                <th className="p-3.5">Council Honorarium</th>
                <th className="p-3.5">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 dark:divide-stone-800">
              {filtered.map((t) => (
                <tr key={t.id} className="hover:bg-stone-50/50 dark:hover:bg-stone-800/50">
                  <td className="p-3.5">
                    <div className="font-serif font-bold text-sm text-stone-900 dark:text-stone-100">
                      {t.name}
                    </div>
                    <span className="text-[10px] text-stone-400 font-mono">{t.phone}</span>
                  </td>
                  <td className="p-3.5 font-medium text-stone-800 dark:text-stone-200">
                    {t.madrasaName}
                  </td>
                  <td className="p-3.5">
                    <Badge variant="blue">{t.specialization}</Badge>
                  </td>
                  <td className="p-3.5 text-stone-600 dark:text-stone-400 max-w-xs truncate">
                    {t.sanad}
                  </td>
                  <td className="p-3.5 font-mono text-stone-700 dark:text-stone-300">
                    {t.experienceYears} Years
                  </td>
                  <td className="p-3.5 font-mono font-bold text-emerald-700 dark:text-emerald-400">
                    {t.assignedStudentsCount} Students
                  </td>
                  <td className="p-3.5 font-mono font-bold text-stone-900 dark:text-stone-100">
                    {t.salaryETB.toLocaleString()} ETB / mo
                  </td>
                  <td className="p-3.5">
                    <Badge variant={t.status === 'Active' ? 'emerald' : 'gold'}>
                      {t.status}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Add Teacher Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Register Faculty Teacher"
        subtitle="Add accredited Quranic Mu'allim with Sanad verification."
      >
        <form onSubmit={handleAddSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
              Teacher Full Name *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Ustadh Idris Mohammed"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 outline-hidden"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                Phone Number *
              </label>
              <input
                type="tel"
                required
                placeholder="e.g. +251 91 123 4567"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 outline-hidden font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                Assigned Madrasa
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

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                Specialization
              </label>
              <input
                type="text"
                value={specialization}
                onChange={(e) => setSpecialization(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                Sanad License
              </label>
              <input
                type="text"
                value={sanad}
                onChange={(e) => setSanad(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 outline-hidden"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-stone-100 dark:border-stone-800">
            <Button variant="ghost" type="button" onClick={() => setIsAddModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              Register Mu'allim
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
