import React, { useState } from 'react';
import {
  Users,
  CheckCircle2,
  XCircle,
  Clock,
  MapPin,
  Briefcase,
  Search,
  Plus,
  Filter,
  Phone,
  ShieldCheck,
  Check,
} from 'lucide-react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { Modal } from '../ui/Modal';
import { StaffAttendanceEntry } from '../../types';
import { useApp } from '../../context/AppContext';

export const StaffAttendanceTab: React.FC = () => {
  const { staffAttendanceList, updateStaffAttendanceRecord, addStaffAttendanceRecord, addToast } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [deptFilter, setDeptFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Form state
  const [staffName, setStaffName] = useState('');
  const [role, setRole] = useState('');
  const [department, setDepartment] = useState('Education Directorate');
  const [phone, setPhone] = useState('');
  const [status, setStatus] = useState<StaffAttendanceEntry['status']>('Present');
  const [clockInTime, setClockInTime] = useState('08:00 AM');
  const [location, setLocation] = useState('Council Main Secretariat');
  const [workSummary, setWorkSummary] = useState('');

  const departments = [
    'All',
    'Executive Secretariat',
    'Shariah & Fatwa Board',
    'Education Directorate',
    'Finance & Endowment',
    'Mosque & Waqf Affairs',
    'Social Services & Zakat',
  ];

  const filteredStaff = staffAttendanceList.filter((s) => {
    const term = (searchTerm || '').toLowerCase();
    const matchSearch =
      (s.staffName || '').toLowerCase().includes(term) ||
      (s.arabicName && s.arabicName.includes(term)) ||
      (s.role || '').toLowerCase().includes(term) ||
      (s.location || '').toLowerCase().includes(term);

    const matchDept = deptFilter === 'All' || s.department === deptFilter;
    const matchStatus = statusFilter === 'All' || s.status === statusFilter;

    return matchSearch && matchDept && matchStatus;
  });

  const presentCount = staffAttendanceList.filter((s) => s.status === 'Present').length;
  const fieldCount = staffAttendanceList.filter((s) => s.status === 'Field Duty / Inspection').length;
  const leaveCount = staffAttendanceList.filter((s) => s.status === 'On Leave' || s.status === 'Excused').length;
  const absentCount = staffAttendanceList.filter((s) => s.status === 'Absent' || s.status === 'Late').length;

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!staffName || !role) {
      addToast('Missing Details', 'Please specify staff member name and role title.', 'warning');
      return;
    }

    addStaffAttendanceRecord({
      staffId: `staff-${Date.now()}`,
      staffName,
      role,
      department,
      phone: phone || '+251 91 000 0000',
      status,
      clockInTime: status === 'Present' || status === 'Field Duty / Inspection' ? clockInTime : undefined,
      location,
      workSummary,
      recordedBy: 'Council Biometric & Desk Officer',
    });

    setIsAddModalOpen(false);
    setStaffName('');
    setRole('');
    setWorkSummary('');
  };

  const getStatusBadge = (st: StaffAttendanceEntry['status']) => {
    switch (st) {
      case 'Present':
        return <Badge variant="emerald">✓ Present (On Desk)</Badge>;
      case 'Field Duty / Inspection':
        return <Badge variant="blue">🚗 Field Duty / Mosque Inspection</Badge>;
      case 'On Leave':
        return <Badge variant="stone">○ On Approved Leave</Badge>;
      case 'Late':
        return <Badge variant="amber">△ Late Arrival</Badge>;
      case 'Excused':
        return <Badge variant="purple">○ Excused</Badge>;
      case 'Absent':
        return <Badge variant="rose">✗ Unexcused Absent</Badge>;
    }
  };

  return (
    <div className="space-y-5">
      {/* Stats row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <Card className="p-4 bg-white border-stone-200 shadow-xs">
          <div className="text-xs text-stone-500 font-semibold uppercase">Total Council Staff</div>
          <div className="text-2xl font-bold font-serif text-stone-900 mt-1">{staffAttendanceList.length}</div>
          <div className="text-[11px] text-stone-600 mt-1">Logged on 18 Safar 1448</div>
        </Card>

        <Card className="p-4 bg-emerald-50/60 border-emerald-200 shadow-xs">
          <div className="text-xs text-emerald-800 font-semibold uppercase">On Desk (Headquarters)</div>
          <div className="text-2xl font-bold font-serif text-emerald-900 mt-1">{presentCount}</div>
          <div className="text-[11px] text-emerald-700 mt-1">Biometric verified</div>
        </Card>

        <Card className="p-4 bg-blue-50/60 border-blue-200 shadow-xs">
          <div className="text-xs text-blue-800 font-semibold uppercase">Field / Woreda Duty</div>
          <div className="text-2xl font-bold font-serif text-blue-900 mt-1">{fieldCount}</div>
          <div className="text-[11px] text-blue-700 mt-1">Mosque & Madrasa visits</div>
        </Card>

        <Card className="p-4 bg-stone-50 border-stone-200 shadow-xs">
          <div className="text-xs text-stone-600 font-semibold uppercase">On Leave / Absent</div>
          <div className="text-2xl font-bold font-serif text-stone-800 mt-1">{leaveCount + absentCount}</div>
          <div className="text-[11px] text-stone-500 mt-1">{leaveCount} approved leave</div>
        </Card>
      </div>

      {/* Filter and search bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-xl border border-stone-200 shadow-xs">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
          <input
            type="text"
            placeholder="Search staff, role title, or duty location..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs bg-stone-50 border border-stone-300 rounded-lg text-stone-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
          />
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <select
            value={deptFilter}
            onChange={(e) => setDeptFilter(e.target.value)}
            className="text-xs py-2 px-3 bg-white border border-stone-300 rounded-lg text-stone-700 focus:outline-none focus:ring-1 focus:ring-emerald-500"
          >
            {departments.map((d) => (
              <option key={d} value={d}>
                {d === 'All' ? 'All Directorates' : d}
              </option>
            ))}
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="text-xs py-2 px-3 bg-white border border-stone-300 rounded-lg text-stone-700 focus:outline-none focus:ring-1 focus:ring-emerald-500"
          >
            <option value="All">All Statuses</option>
            <option value="Present">Present (On Desk)</option>
            <option value="Field Duty / Inspection">Field Duty</option>
            <option value="On Leave">On Leave</option>
            <option value="Late">Late</option>
            <option value="Absent">Absent</option>
          </select>

          <Button
            variant="primary"
            size="sm"
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-1.5 bg-emerald-800 hover:bg-emerald-900 text-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Log Staff Sign-In</span>
          </Button>
        </div>
      </div>

      {/* Staff Roster Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredStaff.map((staff) => (
          <Card key={staff.id} className="p-4 bg-white border-stone-200 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3">
                <img
                  src={
                    staff.avatar ||
                    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80'
                  }
                  alt={staff.staffName}
                  className="w-11 h-11 rounded-full object-cover border border-stone-200 shrink-0"
                />
                <div>
                  <h4 className="font-bold text-sm text-stone-900 flex items-center gap-2">
                    <span>{staff.staffName}</span>
                  </h4>
                  {staff.arabicName && (
                    <div className="text-xs text-stone-500 font-serif">{staff.arabicName}</div>
                  )}
                  <div className="text-xs font-semibold text-emerald-800 mt-0.5">{staff.role}</div>
                  <div className="text-[11px] text-stone-500">{staff.department}</div>
                </div>
              </div>
              <div className="text-right shrink-0">{getStatusBadge(staff.status)}</div>
            </div>

            {/* Duty details */}
            <div className="mt-3 pt-3 border-t border-stone-100 space-y-1.5 text-xs text-stone-600">
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                <span className="text-stone-500">Location:</span>
                <strong className="text-stone-800 truncate">{staff.location}</strong>
              </div>

              {staff.clockInTime && (
                <div className="flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span className="text-stone-500">Clock-In Time:</span>
                  <span className="font-mono font-medium text-emerald-800">{staff.clockInTime}</span>
                </div>
              )}

              {staff.workSummary && (
                <div className="flex items-start gap-2 bg-stone-50 p-2 rounded-lg border border-stone-200 mt-2 text-[11px]">
                  <Briefcase className="w-3.5 h-3.5 text-stone-400 shrink-0 mt-0.5" />
                  <span className="text-stone-700 italic">{staff.workSummary}</span>
                </div>
              )}
            </div>

            {/* Quick Status Adjuster */}
            <div className="mt-3 pt-2.5 border-t border-stone-100 flex items-center justify-between text-xs">
              <div className="flex items-center gap-1.5">
                <span className="text-[11px] text-stone-400">Quick set:</span>
                <button
                  type="button"
                  onClick={() => updateStaffAttendanceRecord(staff.id, { status: 'Present', clockInTime: '08:00 AM' })}
                  className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 cursor-pointer"
                >
                  Desk
                </button>
                <button
                  type="button"
                  onClick={() => updateStaffAttendanceRecord(staff.id, { status: 'Field Duty / Inspection' })}
                  className="px-2 py-0.5 rounded text-[10px] font-semibold bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 cursor-pointer"
                >
                  Field
                </button>
                <button
                  type="button"
                  onClick={() => updateStaffAttendanceRecord(staff.id, { status: 'On Leave' })}
                  className="px-2 py-0.5 rounded text-[10px] font-semibold bg-stone-100 text-stone-700 hover:bg-stone-200 border border-stone-200 cursor-pointer"
                >
                  Leave
                </button>
              </div>

              <a
                href={`tel:${staff.phone}`}
                className="inline-flex items-center gap-1 text-[11px] text-emerald-700 hover:underline font-mono"
              >
                <Phone className="w-3 h-3" />
                {staff.phone}
              </a>
            </div>
          </Card>
        ))}
      </div>

      {/* Add Staff Sign-in Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Log Staff Sign-In / Field Assignment"
      >
        <form onSubmit={handleAddSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
              Staff Member Name *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Ustadh Khalid Ibrahim"
              value={staffName}
              onChange={(e) => setStaffName(e.target.value)}
              className="w-full text-xs p-2.5 bg-stone-50 border border-stone-300 rounded-lg text-stone-900 focus:bg-white focus:ring-1 focus:ring-emerald-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
                Official Title / Role *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Madrasa Curriculum Inspector"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full text-xs p-2.5 bg-stone-50 border border-stone-300 rounded-lg text-stone-900 focus:bg-white focus:ring-1 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
                Directorate
              </label>
              <select
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="w-full text-xs p-2.5 bg-white border border-stone-300 rounded-lg text-stone-900"
              >
                {departments.filter((d) => d !== 'All').map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
                Attendance Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as any)}
                className="w-full text-xs p-2.5 bg-white border border-stone-300 rounded-lg text-stone-900"
              >
                <option value="Present">Present (Headquarters Desk)</option>
                <option value="Field Duty / Inspection">Field Duty / Mosque Inspection</option>
                <option value="On Leave">Approved Leave</option>
                <option value="Late">Late Arrival</option>
                <option value="Excused">Excused</option>
                <option value="Absent">Absent</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
                Clock-In Time
              </label>
              <input
                type="text"
                value={clockInTime}
                onChange={(e) => setClockInTime(e.target.value)}
                className="w-full text-xs p-2.5 bg-stone-50 border border-stone-300 rounded-lg text-stone-900 font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
              Duty / Work Location
            </label>
            <input
              type="text"
              placeholder="e.g. Council Main Secretariat or Agaro Grand Mosque"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full text-xs p-2.5 bg-stone-50 border border-stone-300 rounded-lg text-stone-900 focus:bg-white"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
              Daily Mission / Work Assignment Summary
            </label>
            <textarea
              rows={2}
              placeholder="Summary of today's key administrative or inspection tasks..."
              value={workSummary}
              onChange={(e) => setWorkSummary(e.target.value)}
              className="w-full text-xs p-2.5 bg-stone-50 border border-stone-300 rounded-lg text-stone-900 focus:bg-white"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-stone-200">
            <Button variant="outline" size="sm" type="button" onClick={() => setIsAddModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" type="submit" className="bg-emerald-800 hover:bg-emerald-900">
              Save Attendance
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
