import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Users,
  Plus,
  Search,
  BookOpen,
  Award,
  Calendar,
  ExternalLink,
  ShieldCheck,
} from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';

export const AdminUlemaPage: React.FC = () => {
  const { ulema } = useApp();
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = ulema.filter(
    (u) =>
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.councilRole.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.district.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-serif font-bold text-stone-900 dark:text-stone-100">
            Supreme Ulema & Fatwa Council
          </h1>
          <p className="text-stone-500 dark:text-stone-400 text-xs sm:text-sm">
            Roster of certified scholars, Muftis, Shari'ah arbitration panel, and Halal oversight.
          </p>
        </div>
      </div>

      <div className="bg-white dark:bg-stone-900 p-4 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-xs">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search scholar, council role, district..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 outline-hidden"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((u) => (
          <Card key={u.id} className="space-y-3 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <Badge variant="blue">{u.councilRole}</Badge>
                <span className="text-xs text-stone-400">{u.district}</span>
              </div>
              <h3 className="font-serif font-bold text-lg text-stone-900 dark:text-stone-100 mt-2">
                {u.name}
              </h3>
              <p className="text-xs font-semibold text-emerald-700 dark:text-emerald-400">
                {u.title}
              </p>
              <p className="text-xs text-stone-500 mt-1 line-clamp-2">{u.bio}</p>

              <div className="mt-3 pt-2 border-t border-stone-100 dark:border-stone-800 text-xs space-y-1">
                <div className="text-stone-500">
                  Alma Mater: <span className="font-medium text-stone-800 dark:text-stone-200">{u.qualification}</span>
                </div>
                <div className="text-stone-500">
                  Office Hours: <span className="font-medium text-stone-800 dark:text-stone-200">{u.officeHours}</span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between text-xs text-stone-400">
              <span>{u.contactPhone}</span>
              <span className="font-mono text-emerald-600">Active Duty</span>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
