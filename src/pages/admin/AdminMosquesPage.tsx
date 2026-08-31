import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import {
  Building,
  Plus,
  Search,
  Filter,
  MapPin,
  Users,
  Edit,
  Trash2,
  ExternalLink,
  CheckCircle2,
} from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';

export const AdminMosquesPage: React.FC = () => {
  const { mosques, addMosque, addToast } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('All');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // New Mosque Form state
  const [name, setName] = useState('');
  const [district, setDistrict] = useState('Jimma Central');
  const [address, setAddress] = useState('');
  const [imam, setImam] = useState('');
  const [capacity, setCapacity] = useState(1000);
  const [status, setStatus] = useState<'Active' | 'Under Renovation' | 'Expanding'>('Active');
  const [madrasaName, setMadrasaName] = useState('');
  const [description, setDescription] = useState('');

  const districts = ['All', ...Array.from(new Set(mosques.map((m) => m.district)))];

  const filtered = mosques.filter((m) => {
    const matchSearch =
      m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.district.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.imam.toLowerCase().includes(searchTerm.toLowerCase());
    const matchDistrict = selectedDistrict === 'All' || m.district === selectedDistrict;
    return matchSearch && matchDistrict;
  });

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !imam || !address) {
      addToast('Missing Required Fields', 'Please complete the mosque name, imam, and address.', 'warning');
      return;
    }

    addMosque({
      name,
      district,
      address,
      imam,
      capacity: Number(capacity),
      status,
      madrasaName: madrasaName || undefined,
      description: description || 'Registered Jumu\'ah mosque under Jimma Islamic Council jurisdiction.',
      facilities: ['Ablution Area', 'Women Section', 'Quran Library', 'Sound System'],
      establishedYear: 2026,
    });

    setIsAddModalOpen(false);
    setName('');
    setAddress('');
    setImam('');
    setDescription('');
    setMadrasaName('');
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-serif font-bold text-stone-900 dark:text-stone-100">
            Mosque Registry & Operations
          </h1>
          <p className="text-stone-500 dark:text-stone-400 text-xs sm:text-sm">
            Manage all 128+ registered mosques, prayer halls, and administrative profiles in Jimma Zone.
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          icon={<Plus className="w-4 h-4" />}
          onClick={() => setIsAddModalOpen(true)}
        >
          Register New Mosque
        </Button>
      </div>

      {/* Filter & Search */}
      <div className="bg-white dark:bg-stone-900 p-4 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-xs flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search mosque, imam, district..."
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

      {/* Mosques Table */}
      <Card className="p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-50 dark:bg-stone-800 text-stone-500 uppercase text-[10px] font-bold border-b border-stone-200 dark:border-stone-700">
              <tr>
                <th className="p-3.5">Mosque Name</th>
                <th className="p-3.5">District & Location</th>
                <th className="p-3.5">Imam Khatib</th>
                <th className="p-3.5">Capacity</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5">Linked Madrasa</th>
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
                  <td className="p-3.5 text-stone-600 dark:text-stone-300">
                    <div className="font-semibold">{m.district}</div>
                    <span className="text-[11px] text-stone-400">{m.address}</span>
                  </td>
                  <td className="p-3.5 font-medium text-stone-800 dark:text-stone-200">
                    {m.imam}
                  </td>
                  <td className="p-3.5 font-mono font-bold text-emerald-700 dark:text-emerald-400">
                    {m.capacity.toLocaleString()}
                  </td>
                  <td className="p-3.5">
                    <Badge variant={m.status === 'Active' ? 'emerald' : 'gold'}>
                      {m.status}
                    </Badge>
                  </td>
                  <td className="p-3.5 text-stone-600 dark:text-stone-400 truncate max-w-[150px]">
                    {m.madrasaName || 'Halaqah Circle'}
                  </td>
                  <td className="p-3.5 text-right">
                    <Link to={`/mosques/${m.id}`}>
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

      {/* Add Mosque Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Register New Mosque in Jimma Zone"
        subtitle="Add official record to council directory with linked imam and capacity."
      >
        <form onSubmit={handleAddSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
              Mosque Official Name *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Masjid Al-Rahma"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 outline-hidden"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                District Jurisdiction *
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
                Specific Address *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Kebele 04, Market Road"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 outline-hidden"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                Chief Imam Khatib *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Sheikh Ahmed Ali"
                value={imam}
                onChange={(e) => setImam(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                Prayer Capacity
              </label>
              <input
                type="number"
                min="50"
                value={capacity}
                onChange={(e) => setCapacity(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 outline-hidden font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                Operational Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as any)}
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700"
              >
                <option value="Active">Active</option>
                <option value="Under Renovation">Under Renovation</option>
                <option value="Expanding">Expanding</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
              Linked Madrasa / Quran Center (Optional)
            </label>
            <input
              type="text"
              placeholder="e.g. Dar al-Arqam Tahfeez Academy"
              value={madrasaName}
              onChange={(e) => setMadrasaName(e.target.value)}
              className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 outline-hidden"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
              Historical & Facility Description
            </label>
            <textarea
              rows={2}
              placeholder="Summary of community services, prayer halls, and endowments..."
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
              Register Mosque
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
