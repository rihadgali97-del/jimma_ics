import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  Send,
  Building,
  CheckCircle2,
  HelpCircle,
} from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';

export const ContactPage: React.FC = () => {
  const { addToast } = useApp();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [department, setDepartment] = useState('General Secretariat');
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone || !message) {
      addToast('Missing Required Fields', 'Please complete all form fields.', 'warning');
      return;
    }

    addToast('Message Delivered', 'Your message has been dispatched to the Jimma Islamic Council Secretariat.', 'success');
    setName('');
    setPhone('');
    setMessage('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header */}
      <div className="border-b border-stone-200 dark:border-stone-800 pb-6">
        <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider mb-2">
          <Phone className="w-4 h-4" />
          <span>Council Secretariat HQ</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-serif font-bold text-stone-900 dark:text-stone-100">
          Contact & Council Desks
        </h1>
        <p className="text-stone-500 dark:text-stone-400 text-sm sm:text-base mt-1 max-w-2xl">
          Get in touch with executive officers, district coordinators, or religious desk representatives.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Contact Form */}
        <div className="lg:col-span-7">
          <Card className="space-y-6">
            <h3 className="font-serif font-bold text-xl text-stone-900 dark:text-stone-100">
              Send an Official Inquiry
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                    Your Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Brother Ahmed Kebede"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                    Phone / Telegram *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="e.g. +251 91 234 5678"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 outline-hidden font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                  Target Department / Council Desk
                </label>
                <select
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-900 dark:text-stone-100"
                >
                  <option value="General Secretariat">General Secretariat</option>
                  <option value="Madrasa Education Board">Madrasa Education Board</option>
                  <option value="Zakat & Waqf Affairs">Zakat & Waqf Affairs</option>
                  <option value="Ulema & Fatwa Advisory Panel">Ulema & Fatwa Advisory Panel</option>
                  <option value="Civic & Nikah Registration">Civic & Nikah Registration</option>
                  <option value="Mosque Expansion & Engineering">Mosque Expansion & Engineering</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                  Inquiry Message *
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="Describe your inquiry, proposal, or question in detail..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 outline-hidden"
                />
              </div>

              <Button
                variant="primary"
                type="submit"
                icon={<Send className="w-4 h-4" />}
                className="w-full justify-center text-sm font-semibold"
              >
                Dispatch Inquiry
              </Button>
            </form>
          </Card>
        </div>

        {/* Right: Council Headquarter Info */}
        <div className="lg:col-span-5 space-y-6">
          <Card className="space-y-4">
            <h3 className="font-serif font-bold text-lg text-stone-900 dark:text-stone-100">
              Headquarters Location & Visiting Hours
            </h3>

            <div className="space-y-3 text-xs text-stone-600 dark:text-stone-300">
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                <div>
                  <span className="font-bold text-stone-900 dark:text-stone-100 block">
                    Central Council Complex
                  </span>
                  <span>Grand Anwar Mosque Complex, Main Avenue, Jimma, Oromia, Ethiopia</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
                <div>
                  <span className="font-bold text-stone-900 dark:text-stone-100 block">
                    Official Working Hours
                  </span>
                  <span>Monday – Friday: 8:30 AM – 4:30 PM</span>
                  <span className="block text-[11px] text-stone-400">
                    Saturday: 9:00 AM – 1:00 PM (Public Halaqah only) • Sunday: Closed
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone className="w-4 h-4 text-blue-600 mt-0.5 shrink-0" />
                <div>
                  <span className="font-bold text-stone-900 dark:text-stone-100 block">
                    Council Switchboard
                  </span>
                  <span className="font-mono">+251 47 111 2345 / +251 91 765 4321</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Mail className="w-4 h-4 text-purple-600 mt-0.5 shrink-0" />
                <div>
                  <span className="font-bold text-stone-900 dark:text-stone-100 block">
                    Official Email
                  </span>
                  <span className="font-mono">secretariat@jimmaislamiccouncil.org</span>
                </div>
              </div>
            </div>
          </Card>

          {/* Regional District Liaison Desks */}
          <Card className="space-y-3">
            <h4 className="font-serif font-bold text-sm text-stone-900 dark:text-stone-100">
              Sub-Zonal District Desks
            </h4>
            <div className="space-y-2 text-xs">
              <div className="p-2.5 rounded-xl bg-stone-50 dark:bg-stone-800/60 border border-stone-100 dark:border-stone-700/60 flex items-center justify-between">
                <div>
                  <span className="font-semibold text-stone-800 dark:text-stone-200 block">Agaro Town Desk</span>
                  <span className="text-[11px] text-stone-400">Nur Mosque Complex</span>
                </div>
                <span className="font-mono text-[11px] text-emerald-600">+251 47 222 1010</span>
              </div>

              <div className="p-2.5 rounded-xl bg-stone-50 dark:bg-stone-800/60 border border-stone-100 dark:border-stone-700/60 flex items-center justify-between">
                <div>
                  <span className="font-semibold text-stone-800 dark:text-stone-200 block">Mana / Yebu Desk</span>
                  <span className="text-[11px] text-stone-400">Bilal Center</span>
                </div>
                <span className="font-mono text-[11px] text-emerald-600">+251 47 333 4512</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
