import React from 'react';
import {
  Users,
  CheckCircle2,
  XCircle,
  Clock,
  HelpCircle,
  BookOpen,
  AlertTriangle,
} from 'lucide-react';
import { Card } from '../ui/Card';
import { DailyAttendanceSession } from '../../types';

interface AttendanceStatsBarProps {
  session: DailyAttendanceSession;
  activeFilter: string;
  onFilterChange: (filter: string) => void;
}

export const AttendanceStatsBar: React.FC<AttendanceStatsBarProps> = ({
  session,
  activeFilter,
  onFilterChange,
}) => {
  const total = session.entries.length;
  const present = session.entries.filter((e) => e.status === 'Present').length;
  const absent = session.entries.filter((e) => e.status === 'Absent').length;
  const late = session.entries.filter((e) => e.status === 'Late').length;
  const excused = session.entries.filter((e) => e.status === 'Excused').length;
  const sabaqRecited = session.entries.filter((e) => e.sabaqRecited).length;

  const presentRate = total > 0 ? Math.round((present / total) * 100) : 0;
  const sabaqRate = total > 0 ? Math.round((sabaqRecited / total) * 100) : 0;

  const filters = [
    { id: 'all', label: 'All Students', count: total },
    { id: 'Present', label: 'Present', count: present, color: 'text-emerald-700 bg-emerald-50 border-emerald-200' },
    { id: 'Absent', label: 'Absent', count: absent, color: 'text-rose-700 bg-rose-50 border-rose-200', alert: absent > 0 },
    { id: 'Late', label: 'Late', count: late, color: 'text-amber-700 bg-amber-50 border-amber-200' },
    { id: 'Excused', label: 'Excused', count: excused, color: 'text-blue-700 bg-blue-50 border-blue-200' },
    { id: 'needs_sabaq', label: 'Sabaq Pending', count: total - sabaqRecited, color: 'text-purple-700 bg-purple-50 border-purple-200' },
  ];

  return (
    <div className="space-y-4">
      {/* 4 Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        {/* Total Roster */}
        <Card className="p-4 bg-white border-stone-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider">
              Enrolled in Halaqah
            </span>
            <div className="w-8 h-8 rounded-lg bg-stone-100 text-stone-600 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-serif text-stone-900">{total}</span>
            <span className="text-xs text-stone-500">Students</span>
          </div>
          <div className="mt-2 text-[11px] text-stone-600 truncate font-medium">
            {session.className}
          </div>
        </Card>

        {/* Present */}
        <Card className="p-4 bg-emerald-50/50 border-emerald-200/80 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-emerald-800 uppercase tracking-wider">
              Present Today
            </span>
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-serif text-emerald-900">{present}</span>
            <span className="text-xs font-semibold text-emerald-700">({presentRate}%)</span>
          </div>
          <div className="mt-2 w-full bg-emerald-200/70 h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-emerald-600 h-full rounded-full transition-all duration-300"
              style={{ width: `${presentRate}%` }}
            />
          </div>
        </Card>

        {/* Absent */}
        <Card className={`p-4 shadow-xs transition-colors ${absent > 0 ? 'bg-rose-50/80 border-rose-200' : 'bg-white border-stone-200'}`}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-rose-800 uppercase tracking-wider">
              Absent
            </span>
            <div className="w-8 h-8 rounded-lg bg-rose-100 text-rose-700 flex items-center justify-center">
              <XCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-serif text-rose-900">{absent}</span>
            {absent > 0 && (
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-rose-700 bg-rose-100/90 px-1.5 py-0.5 rounded-md">
                <AlertTriangle className="w-3 h-3" /> Alert Parents
              </span>
            )}
          </div>
          <div className="mt-2 text-[11px] text-stone-600">
            {absent === 0 ? 'Full attendance achieved' : `${absent} guardian notification${absent > 1 ? 's' : ''} ready`}
          </div>
        </Card>

        {/* Late & Excused */}
        <Card className="p-4 bg-white border-stone-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider">
              Late & Excused
            </span>
            <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-3">
            <div>
              <span className="text-xl font-bold text-amber-800">{late}</span>
              <span className="text-xs text-amber-700 ml-1">Late</span>
            </div>
            <div className="text-stone-300">|</div>
            <div>
              <span className="text-xl font-bold text-blue-800">{excused}</span>
              <span className="text-xs text-blue-700 ml-1">Excused</span>
            </div>
          </div>
          <div className="mt-2 text-[11px] text-stone-600">
            Avg late: 18 min
          </div>
        </Card>

        {/* Sabaq Delivery Rate */}
        <Card className="p-4 bg-amber-50/40 border-amber-200/70 shadow-xs col-span-2 sm:col-span-2 lg:col-span-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-amber-900 uppercase tracking-wider">
              Daily Sabaq Recited
            </span>
            <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center">
              <BookOpen className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-serif text-amber-950">{sabaqRecited}</span>
            <span className="text-xs font-semibold text-amber-800">/ {total} ({sabaqRate}%)</span>
          </div>
          <div className="mt-2 w-full bg-amber-200/80 h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-amber-600 h-full rounded-full transition-all duration-300"
              style={{ width: `${sabaqRate}%` }}
            />
          </div>
        </Card>
      </div>

      {/* Filter Chips Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
        <span className="text-stone-500 font-medium shrink-0 flex items-center gap-1 mr-1">
          Filter View:
        </span>
        {filters.map((f) => {
          const isActive = activeFilter === f.id;
          return (
            <button
              key={f.id}
              onClick={() => onFilterChange(f.id)}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all flex items-center gap-1.5 border whitespace-nowrap cursor-pointer ${
                isActive
                  ? 'bg-stone-900 text-white border-stone-900 shadow-xs'
                  : f.color || 'bg-white text-stone-700 border-stone-200 hover:bg-stone-50'
              }`}
            >
              <span>{f.label}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                  isActive ? 'bg-stone-700 text-stone-200' : 'bg-stone-100 text-stone-700'
                }`}
              >
                {f.count}
              </span>
              {f.alert && !isActive && (
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
