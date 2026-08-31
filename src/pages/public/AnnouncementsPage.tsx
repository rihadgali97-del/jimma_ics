import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Bell,
  Search,
  Calendar,
  AlertTriangle,
  FileText,
  Share2,
  Building,
} from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';

export const AnnouncementsPage: React.FC = () => {
  const { announcements, addToast } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPriority, setSelectedPriority] = useState('All');

  const filtered = announcements.filter((a) => {
    const matchSearch =
      a.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.author.toLowerCase().includes(searchTerm.toLowerCase());
    const matchPriority = selectedPriority === 'All' || a.priority === selectedPriority;
    return matchSearch && matchPriority;
  });

  const handleShare = (title: string) => {
    navigator.clipboard.writeText(window.location.href);
    addToast('Notice Copied', `Link to "${title}" copied to clipboard.`, 'info');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="border-b border-stone-200 dark:border-stone-800 pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wider mb-2">
            <Bell className="w-4 h-4" />
            <span>Council Secretariat</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-stone-900 dark:text-stone-100">
            Official Announcements & Directives
          </h1>
          <p className="text-stone-500 dark:text-stone-400 text-sm sm:text-base mt-1 max-w-2xl">
            Official circulars, Ramadan and Eid moon sighting declarations, and administrative notices from the Jimma Islamic Supreme Council.
          </p>
        </div>
      </div>

      {/* Filter & Search */}
      <div className="bg-white dark:bg-stone-900 p-4 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-xs flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search circulars and notices..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 outline-hidden"
          />
        </div>

        <select
          value={selectedPriority}
          onChange={(e) => setSelectedPriority(e.target.value)}
          className="px-3 py-2 text-xs sm:text-sm rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-800 dark:text-stone-200"
        >
          <option value="All">All Priorities</option>
          <option value="High">Urgent Directives</option>
          <option value="Normal">General Notices</option>
        </select>
      </div>

      {/* Announcements List */}
      <div className="space-y-4">
        {filtered.map((item) => (
          <Card
            key={item.id}
            className={`space-y-4 ${
              item.priority === 'High'
                ? 'border-amber-300 dark:border-amber-900/80 bg-amber-50/20 dark:bg-amber-950/10'
                : ''
            }`}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-100 dark:border-stone-800 pb-3">
              <div className="flex items-center gap-2">
                <Badge variant={item.priority === 'High' ? 'gold' : 'slate'}>
                  {item.priority === 'High' ? 'Priority Circular' : 'Notice'}
                </Badge>
                <span className="text-xs text-stone-400 font-mono">Date: {item.date}</span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                icon={<Share2 className="w-3.5 h-3.5" />}
                onClick={() => handleShare(item.title)}
                className="text-xs self-start sm:self-auto"
              >
                Share
              </Button>
            </div>

            <div>
              <h3 className="font-serif font-bold text-xl text-stone-900 dark:text-stone-100">
                {item.title}
              </h3>
              <p className="text-stone-600 dark:text-stone-300 text-xs sm:text-sm leading-relaxed mt-2">
                {item.content}
              </p>
            </div>

            <div className="pt-2 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between text-xs text-stone-400">
              <span>Authority: {item.author}</span>
              <span>Audience: {item.targetAudience}</span>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
