import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Bell,
  BellRing,
  Mail,
  CheckCircle2,
  Globe,
  Sparkles,
  Sliders,
  Send,
  ShieldCheck,
} from 'lucide-react';
import { Button } from '../ui/Button';

interface EventNotificationBannerProps {
  onOpenPreferences: () => void;
}

export const EventNotificationBanner: React.FC<EventNotificationBannerProps> = ({
  onOpenPreferences,
}) => {
  const { eventSubscriptions, saveEventSubscription, addToast } = useApp();
  const primarySub = eventSubscriptions[0];

  const [quickEmail, setQuickEmail] = useState(primarySub?.email || '');
  const [browserGranted, setBrowserGranted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      setBrowserGranted(Notification.permission === 'granted');
    }
  }, []);

  const handleQuickSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickEmail.trim() || !quickEmail.includes('@')) {
      addToast('Valid Email Required', 'Please enter a valid email to receive community event alerts.', 'error');
      return;
    }

    setIsSubmitting(true);
    saveEventSubscription({
      email: quickEmail.trim(),
      name: 'Community Member',
      enableEmail: true,
      enableBrowser: browserGranted,
      categories: primarySub?.categories || ['All'],
      districts: primarySub?.districts || ['All'],
      reminderTiming: primarySub?.reminderTiming || '24h_before',
      specificEventIds: primarySub?.specificEventIds || [],
    });
    setIsSubmitting(false);
  };

  const handleToggleBrowserPush = async () => {
    if (typeof window === 'undefined' || !('Notification' in window)) {
      addToast('Not Supported', 'Browser alerts are not supported on this device/browser.', 'info');
      return;
    }

    try {
      const perm = await Notification.requestPermission();
      if (perm === 'granted') {
        setBrowserGranted(true);
        saveEventSubscription({
          email: quickEmail.trim() || primarySub?.email || '',
          name: primarySub?.name || 'Community Member',
          enableEmail: primarySub ? primarySub.enableEmail : !!quickEmail.trim(),
          enableBrowser: true,
          categories: primarySub?.categories || ['All'],
          districts: primarySub?.districts || ['All'],
          reminderTiming: primarySub?.reminderTiming || '24h_before',
          specificEventIds: primarySub?.specificEventIds || [],
        });
        addToast(
          'Browser Notifications Activated! 🔔',
          'You will receive instant alerts for upcoming gatherings.',
          'success'
        );
        try {
          new Notification('Jimma Islamic Council • Alerts Active', {
            body: 'You will receive reminders for upcoming community events and conferences.',
            icon: '/favicon.ico',
          });
        } catch {
          // ignore
        }
      } else {
        setBrowserGranted(false);
        addToast('Permission Blocked', 'Browser notifications were declined in your browser settings.', 'info');
      }
    } catch {
      addToast('Browser Notification Note', 'Open app in standalone window to grant push notification permissions.', 'info');
    }
  };

  const isSubscribed = primarySub && (primarySub.enableEmail || primarySub.enableBrowser);

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-stone-900 via-stone-900 to-emerald-950 text-white p-5 sm:p-7 border border-stone-800 shadow-md">
      <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        
        {/* Left Info Column */}
        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/30 text-xs font-semibold">
            <BellRing className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
            <span>Event Alerts & Reminder Service</span>
          </div>

          <h3 className="text-lg sm:text-xl font-serif font-bold text-white tracking-tight">
            Never Miss a Scholar Conference, Tahfeez Championship, or Youth Workshop
          </h3>

          <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
            Subscribe to automated alerts before major gatherings begin. Choose email bulletins, instant browser push notifications, or customize by district and event type.
          </p>

          {isSubscribed && (
            <div className="inline-flex items-center gap-2 pt-1 text-xs text-emerald-400">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>
                Active subscription registered{primarySub.email ? ` for ${primarySub.email}` : ''}
                {primarySub.enableBrowser ? ' • Browser Push Active' : ''}
              </span>
            </div>
          )}
        </div>

        {/* Right Action Column: Quick Input or Controls */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
          {!isSubscribed ? (
            <form onSubmit={handleQuickSubscribe} className="flex flex-col sm:flex-row items-center gap-2">
              <div className="relative w-full sm:w-64">
                <Mail className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  placeholder="Enter email for event alerts..."
                  value={quickEmail}
                  onChange={(e) => setQuickEmail(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-stone-950/80 border border-stone-700 text-stone-200 placeholder-stone-400 outline-hidden focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <Button
                type="submit"
                variant="gold"
                size="sm"
                disabled={isSubmitting}
                icon={<Bell className="w-3.5 h-3.5" />}
                className="w-full sm:w-auto text-xs whitespace-nowrap font-bold"
              >
                Subscribe
              </Button>
            </form>
          ) : (
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleToggleBrowserPush}
                icon={<Globe className="w-3.5 h-3.5 text-emerald-400" />}
                className="text-xs bg-stone-800/80 border-stone-700 hover:bg-stone-700 text-stone-200"
              >
                {browserGranted ? 'Push Enabled' : 'Enable Browser Push'}
              </Button>
            </div>
          )}

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onOpenPreferences}
            icon={<Sliders className="w-3.5 h-3.5 text-amber-400" />}
            className="text-xs bg-white/5 border-white/20 hover:bg-white/10 text-white"
          >
            Preferences & Filters
          </Button>
        </div>

      </div>
    </div>
  );
};
