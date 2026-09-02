import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { CouncilEvent, EventRegistration } from '../../types';
import {
  Calendar,
  Plus,
  Users,
  Search,
  CheckCircle2,
  Clock,
  MapPin,
  Download,
  Edit,
  Trash2,
  Ticket,
  Send,
  CalendarCheck2,
  Sparkles,
  QrCode,
  ShieldCheck,
  Building,
  Radio,
  Share2,
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Card } from '../../components/ui/Card';
import { CreateEventModal } from '../../components/events/CreateEventModal';
import { EventAttendeesModal } from '../../components/events/EventAttendeesModal';
import { EventPassModal } from '../../components/events/EventPassModal';

export const AdminEventsPage: React.FC = () => {
  const {
    events,
    deleteEvent,
    updateEvent,
    eventRegistrations,
    addToast,
  } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');

  // Modals
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<CouncilEvent | undefined>(undefined);
  const [attendeesEvent, setAttendeesEvent] = useState<CouncilEvent | null>(null);
  const [passData, setPassData] = useState<{
    event: CouncilEvent;
    registration: EventRegistration;
  } | null>(null);

  const categories = [
    'All',
    'Quran Competition',
    'Ulema Conference',
    'Youth Workshop',
    'Lecture',
    'Ramadan Program',
    'Community Gathering',
  ];

  const filteredEvents = events.filter((e) => {
    const s = (searchTerm || '').toLowerCase();
    const matchesSearch =
      (e.title || '').toLowerCase().includes(s) ||
      (e.arabicTitle && e.arabicTitle.includes(searchTerm)) ||
      (e.location || '').toLowerCase().includes(s) ||
      (e.speaker || '').toLowerCase().includes(s);

    const matchesCat = selectedCategory === 'All' || e.category === selectedCategory;
    const matchesStatus = selectedStatus === 'All' || e.status === selectedStatus;

    return matchesSearch && matchesCat && matchesStatus;
  });

  // Global KPIs
  const totalCapacity = events.reduce((sum, e) => sum + (e.maxCapacity || 0), 0);
  const totalSeatsBooked = events.reduce((sum, e) => sum + (e.attendeesCount || 0), 0);
  const totalCheckedIn = eventRegistrations.filter((r) => r.status === 'Checked-In').length;
  const activeRegistrationsOpen = events.filter((e) => e.registrationOpen).length;

  const handleToggleRegistration = (event: CouncilEvent) => {
    updateEvent(event.id, { registrationOpen: !event.registrationOpen });
    addToast(
      'Registration Status Updated',
      `Public registration for "${event.title}" is now ${!event.registrationOpen ? 'OPEN' : 'PAUSED'}.`,
      'info'
    );
  };

  const handleDeleteEvent = (id: string, title: string) => {
    if (window.confirm(`Are you sure you want to remove "${title}" from the council schedule?`)) {
      deleteEvent(id);
    }
  };

  const handleExportAllRegistrations = () => {
    const headers = ['Event ID', 'Event Title', 'Pass Number', 'Attendee Full Name', 'Phone', 'District', 'Madrasa / Org', 'Seats', 'Status', 'Registered Date'];
    const rows = eventRegistrations.map((r) => [
      r.eventId,
      `"${r.eventTitle}"`,
      r.passNumber,
      `"${r.fullName}"`,
      r.phone,
      r.district,
      `"${r.organizationOrMadrasa || ''}"`,
      r.attendeesCount,
      r.status,
      r.createdAt,
    ]);

    const csvContent = [headers.join(','), ...rows.map((row) => row.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `All_Council_Event_Registrations_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
    addToast('All Registrations Exported', `Downloaded CSV for ${eventRegistrations.length} registrations.`, 'success');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Top Header & Scheduling Trigger */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-amber-500 uppercase tracking-wider">
            <Calendar className="w-4 h-4" />
            <span>Council Directorate for Community Gatherings & Tahfeez</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900 dark:text-stone-100">
            Events & Programs Management
          </h1>
          <p className="text-stone-500 text-xs sm:text-sm mt-0.5">
            Administer community conferences, manage gate attendance rosters, issue digital passes, and publish hourly program agendas.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleExportAllRegistrations}
            icon={<Download className="w-4 h-4" />}
            className="text-xs"
          >
            Export All Registrations
          </Button>

          <Button
            variant="gold"
            size="sm"
            onClick={() => {
              setEditingEvent(undefined);
              setIsCreateOpen(true);
            }}
            icon={<Plus className="w-4 h-4" />}
            className="text-xs"
          >
            Schedule New Program
          </Button>
        </div>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-sm space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-stone-500">Scheduled Gatherings</span>
            <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <Calendar className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-serif font-bold text-stone-900 dark:text-stone-100">{events.length}</p>
          <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
            {activeRegistrationsOpen} Gatherings RSVP Open
          </p>
        </div>

        <div className="p-4 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-sm space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-stone-500">Confirmed Attendees</span>
            <div className="w-8 h-8 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-serif font-bold text-stone-900 dark:text-stone-100">
            {totalSeatsBooked.toLocaleString()}
          </p>
          <p className="text-[11px] text-stone-500">
            Total Capacity: {totalCapacity.toLocaleString()} seats
          </p>
        </div>

        <div className="p-4 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-sm space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-stone-500">Verified Gate Check-Ins</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-serif font-bold text-emerald-600 dark:text-emerald-400">
            {totalCheckedIn}
          </p>
          <p className="text-[11px] text-stone-500">
            Pass verification active
          </p>
        </div>

        <div className="p-4 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-sm space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-stone-500">Total Issued Passes</span>
            <div className="w-8 h-8 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center">
              <Ticket className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-serif font-bold text-stone-900 dark:text-stone-100">
            {eventRegistrations.length}
          </p>
          <p className="text-[11px] text-stone-500">
            Across all council programs
          </p>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white dark:bg-stone-900 p-4 rounded-3xl border border-stone-200 dark:border-stone-800 shadow-sm flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search event by name, speaker, venue..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 outline-hidden"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 text-xs sm:text-sm rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-800 dark:text-stone-200"
          >
            {categories.map((c) => (
              <option key={c} value={c}>
                {c === 'All' ? 'All Categories' : c}
              </option>
            ))}
          </select>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3 py-2 text-xs sm:text-sm rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-800 dark:text-stone-200"
          >
            <option value="All">All Statuses</option>
            <option value="Upcoming">Upcoming</option>
            <option value="Completed">Completed</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Events Table / Card Roster */}
      <div className="bg-white dark:bg-stone-900 rounded-3xl border border-stone-200 dark:border-stone-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-50 dark:bg-stone-800/80 text-stone-600 dark:text-stone-400 font-semibold border-b border-stone-200 dark:border-stone-800">
              <tr>
                <th className="p-4">Program & Logistics</th>
                <th className="p-4">Category & Format</th>
                <th className="p-4">Date & Hijri</th>
                <th className="p-4">Keynote / Lead Scholar</th>
                <th className="p-4">RSVP / Capacity</th>
                <th className="p-4">Registration</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 dark:divide-stone-800">
              {filteredEvents.map((event) => {
                const eventRegs = eventRegistrations.filter((r) => r.eventId === event.id);
                const capacityPercent = Math.min(
                  100,
                  Math.round(((event.attendeesCount || 0) / (event.maxCapacity || 1)) * 100)
                );

                return (
                  <tr
                    key={event.id}
                    className="hover:bg-stone-50/80 dark:hover:bg-stone-800/40 transition-colors"
                  >
                    {/* Program info */}
                    <td className="p-4 max-w-xs">
                      <div className="flex items-start gap-3">
                        <img
                          src={event.image}
                          alt={event.title}
                          className="w-12 h-12 rounded-xl object-cover shrink-0 border border-stone-200 dark:border-stone-700"
                        />
                        <div className="min-w-0">
                          <h4 className="font-serif font-bold text-stone-900 dark:text-stone-100 text-xs sm:text-sm line-clamp-1">
                            {event.title}
                          </h4>
                          {event.arabicTitle && (
                            <p className="text-[11px] font-serif text-amber-600 dark:text-amber-400 truncate">
                              {event.arabicTitle}
                            </p>
                          )}
                          <p className="text-[11px] text-stone-500 truncate flex items-center gap-1 mt-0.5">
                            <MapPin className="w-3 h-3 text-emerald-500 shrink-0" />
                            <span>{event.location}</span>
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Category & Format */}
                    <td className="p-4">
                      <div className="space-y-1">
                        <Badge variant="gold">{event.category}</Badge>
                        <div>
                          <span className="text-[10px] font-medium text-stone-500">
                            {event.format || 'In-Person'}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Date */}
                    <td className="p-4">
                      <div className="space-y-0.5">
                        <p className="font-mono font-bold text-stone-800 dark:text-stone-200">{event.date}</p>
                        <p className="text-[11px] text-amber-600 dark:text-amber-400 font-serif">{event.hijriDate}</p>
                        <p className="text-[10px] text-stone-500">{event.time}</p>
                      </div>
                    </td>

                    {/* Keynote */}
                    <td className="p-4 max-w-[180px]">
                      <div className="space-y-0.5">
                        <p className="font-medium text-stone-900 dark:text-stone-100 truncate">{event.speaker}</p>
                        <p className="text-[10px] text-stone-500 truncate">{event.organizer}</p>
                      </div>
                    </td>

                    {/* Capacity */}
                    <td className="p-4 min-w-[140px]">
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="font-bold text-stone-800 dark:text-stone-200">
                            {event.attendeesCount} / {event.maxCapacity}
                          </span>
                          <span className="text-stone-500">{capacityPercent}%</span>
                        </div>
                        <div className="w-full bg-stone-200 dark:bg-stone-700 h-1.5 rounded-full overflow-hidden">
                          <div
                            className="bg-emerald-500 h-full rounded-full"
                            style={{ width: `${capacityPercent}%` }}
                          />
                        </div>
                        <p className="text-[10px] text-stone-500">
                          {eventRegs.length} Registered Passes
                        </p>
                      </div>
                    </td>

                    {/* Registration Status Toggle */}
                    <td className="p-4">
                      <button
                        onClick={() => handleToggleRegistration(event)}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-[10px] font-bold transition-colors ${
                          event.registrationOpen
                            ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20'
                            : 'bg-stone-200 dark:bg-stone-800 text-stone-500 border border-stone-300 dark:border-stone-700 hover:bg-stone-300'
                        }`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${event.registrationOpen ? 'bg-emerald-500' : 'bg-stone-400'}`} />
                        <span>{event.registrationOpen ? 'Open (Live)' : 'Paused'}</span>
                      </button>
                    </td>

                    {/* Actions */}
                    <td className="p-4 text-right">
                      <div className="inline-flex items-center gap-1.5">
                        <Button
                          variant="primary"
                          size="sm"
                          icon={<Users className="w-3.5 h-3.5" />}
                          onClick={() => setAttendeesEvent(event)}
                          className="text-[11px] py-1 bg-amber-600 hover:bg-amber-700 text-white"
                        >
                          Check-In ({eventRegs.length})
                        </Button>

                        <button
                          onClick={() => {
                            setEditingEvent(event);
                            setIsCreateOpen(true);
                          }}
                          className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
                          title="Edit Event Logistics"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => handleDeleteEvent(event.id, event.title)}
                          className="p-1.5 rounded-lg text-stone-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
                          title="Delete Gathering"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modals */}
      <CreateEventModal
        isOpen={isCreateOpen}
        onClose={() => {
          setIsCreateOpen(false);
          setEditingEvent(undefined);
        }}
        initialEvent={editingEvent}
      />

      {attendeesEvent && (
        <EventAttendeesModal
          event={attendeesEvent}
          isOpen={!!attendeesEvent}
          onClose={() => setAttendeesEvent(null)}
          onOpenPass={(reg) => {
            setPassData({ event: attendeesEvent, registration: reg });
          }}
        />
      )}

      {passData && (
        <EventPassModal
          event={passData.event}
          registration={passData.registration}
          isOpen={!!passData}
          onClose={() => setPassData(null)}
        />
      )}

    </div>
  );
};
