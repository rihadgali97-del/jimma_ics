import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useLanguage } from '../../context/LanguageContext';
import {
  HeartHandshake,
  CheckCircle2,
  Receipt,
  Download,
  Printer,
  ShieldCheck,
  Building,
  BookOpen,
  Sparkles,
  Lock,
} from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { IslamicPattern } from '../../components/common/IslamicPattern';
import { Donation } from '../../types';

export const DonatePage: React.FC = () => {
  const { funds, addDonation } = useApp();
  const { t, language } = useLanguage();

  const [selectedFundId, setSelectedFundId] = useState(funds[0]?.id || 'fund-1');
  const [amount, setAmount] = useState<number>(1000);
  const [customAmount, setCustomAmount] = useState('');
  const [donorName, setDonorName] = useState('');
  const [donorPhone, setDonorPhone] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'Telebirr' | 'CBE Birr' | 'Awash Bank' | 'Bank Transfer'>('Telebirr');
  const [completedDonation, setCompletedDonation] = useState<Donation | null>(null);

  const presetAmounts = [500, 1000, 2500, 5000, 10000];

  const selectedFund = funds.find((f) => f.id === selectedFundId) || funds[0];

  const handleSelectPreset = (val: number) => {
    setAmount(val);
    setCustomAmount('');
  };

  const handleCustomChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setCustomAmount(val);
    const num = parseFloat(val);
    if (!isNaN(num) && num > 0) {
      setAmount(num);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (amount <= 0) return;

    const donationResult = addDonation({
      donorName: isAnonymous ? 'Anonymous Donor' : donorName || 'Generous Benefactor',
      donorPhone: donorPhone || '+251 91 234 5678',
      amountETB: amount,
      fundId: selectedFund.id,
      fundName: selectedFund.name,
      paymentMethod,
      isAnonymous,
    });

    setCompletedDonation(donationResult);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-950/60 border border-amber-300 dark:border-amber-800 text-amber-900 dark:text-amber-300 text-xs font-bold uppercase tracking-wider">
          <HeartHandshake className="w-3.5 h-3.5" />
          <span>Sadaqah Jariyah & Zakat ul-Mal</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-serif font-bold text-stone-900 dark:text-stone-100">
          Jimma Islamic Council Donation Portal
        </h1>
        <p className="text-stone-600 dark:text-stone-300 text-sm sm:text-base leading-relaxed">
          Support verified mosques, student Quranic memorization, orphan care, and social welfare programs
          with direct, accountable, and audited digital channels.
        </p>
      </div>

      {completedDonation ? (
        /* Instant Donation Receipt & Certificate Card */
        <div className="max-w-2xl mx-auto space-y-6 animate-in fade-in zoom-in-95 duration-200">
          <div className="bg-white dark:bg-stone-900 p-8 rounded-3xl border-2 border-emerald-500 shadow-2xl relative overflow-hidden space-y-6">
            <IslamicPattern opacity={0.05} />

            {/* Receipt Top Header */}
            <div className="text-center border-b border-stone-200 dark:border-stone-800 pb-6 relative z-10">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 flex items-center justify-center mx-auto mb-3">
                <CheckCircle2 className="w-8 h-8 text-emerald-600" />
              </div>
              <span className="font-serif text-sm text-amber-600 dark:text-amber-400 font-bold block mb-1">
                جزاكم الله خيراً • Jazakallahu Khayran
              </span>
              <h2 className="text-2xl font-serif font-bold text-stone-900 dark:text-stone-100">
                Official Donation Receipt & Certificate
              </h2>
              <p className="text-xs text-stone-500 mt-1">
                Jimma Zone Islamic Affairs Supreme Council • Financial Registry
              </p>
            </div>

            {/* Receipt Summary Grid */}
            <div className="grid grid-cols-2 gap-4 text-xs relative z-10 p-4 rounded-2xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200/80 dark:border-stone-700">
              <div>
                <span className="text-stone-400 block text-[10px] uppercase font-bold">
                  Receipt Number
                </span>
                <span className="font-mono font-bold text-stone-900 dark:text-stone-100 text-sm">
                  {completedDonation.receiptNo}
                </span>
              </div>
              <div>
                <span className="text-stone-400 block text-[10px] uppercase font-bold">
                  Date of Issue
                </span>
                <span className="font-mono text-stone-800 dark:text-stone-200">
                  {completedDonation.date}
                </span>
              </div>
              <div>
                <span className="text-stone-400 block text-[10px] uppercase font-bold">
                  Donor
                </span>
                <span className="font-semibold text-stone-900 dark:text-stone-100">
                  {completedDonation.donorName}
                </span>
              </div>
              <div>
                <span className="text-stone-400 block text-[10px] uppercase font-bold">
                  Payment Method
                </span>
                <span className="font-semibold text-stone-800 dark:text-stone-200">
                  {completedDonation.paymentMethod} (Confirmed)
                </span>
              </div>
              <div className="col-span-2 pt-2 border-t border-stone-200 dark:border-stone-700 flex items-center justify-between">
                <div>
                  <span className="text-stone-400 block text-[10px] uppercase font-bold">
                    Designated Fund
                  </span>
                  <span className="font-bold text-emerald-700 dark:text-emerald-400 text-sm">
                    {completedDonation.fundName}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-stone-400 block text-[10px] uppercase font-bold">
                    Amount Received
                  </span>
                  <span className="text-2xl font-bold font-mono text-stone-900 dark:text-stone-100">
                    {completedDonation.amountETB.toLocaleString()} ETB
                  </span>
                </div>
              </div>
            </div>

            {/* Legal / Religious Note */}
            <div className="text-[11px] text-stone-500 dark:text-stone-400 leading-relaxed text-center relative z-10 pt-2">
              "Those who spend their wealth in the cause of Allah and do not follow up their spending with reminders or hurtful words will have their reward with their Lord." — Surah Al-Baqarah 2:262
            </div>

            {/* Actions */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-stone-200 dark:border-stone-800 relative z-10">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCompletedDonation(null)}
              >
                Make Another Donation
              </Button>
              <div className="flex items-center gap-2">
                <Button
                  variant="secondary"
                  size="sm"
                  icon={<Printer className="w-4 h-4" />}
                  onClick={handlePrint}
                >
                  Print Receipt
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  icon={<Download className="w-4 h-4" />}
                  onClick={handlePrint}
                >
                  Save Certificate (PDF)
                </Button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Standard Donation Form */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left 7 cols: Interactive Form */}
          <div className="lg:col-span-7 space-y-6">
            <Card className="space-y-6">
              <h3 className="font-serif font-bold text-xl text-stone-900 dark:text-stone-100">
                1. Select Designated Council Fund
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {funds.map((f) => {
                  const isSelected = selectedFundId === f.id;
                  return (
                    <button
                      key={f.id}
                      type="button"
                      onClick={() => setSelectedFundId(f.id)}
                      className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                        isSelected
                          ? 'border-emerald-600 bg-emerald-50/70 dark:bg-emerald-950/40 ring-2 ring-emerald-500'
                          : 'border-stone-200 dark:border-stone-700 bg-stone-50/50 dark:bg-stone-800/40 hover:border-stone-300'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-serif font-bold text-sm text-stone-900 dark:text-stone-100">
                          {f.name}
                        </span>
                        {isSelected && (
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        )}
                      </div>
                      <p className="text-[11px] text-stone-500 dark:text-stone-400 line-clamp-2">
                        {f.description}
                      </p>
                      <span className="text-[10px] font-mono text-emerald-700 dark:text-emerald-400 font-bold block mt-2">
                        Goal: {(f.targetETB / 1000000).toFixed(1)}M ETB
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Amount Selection */}
              <div className="space-y-3 pt-2">
                <h3 className="font-serif font-bold text-xl text-stone-900 dark:text-stone-100">
                  2. Choose Donation Amount (ETB)
                </h3>

                <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                  {presetAmounts.map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => handleSelectPreset(preset)}
                      className={`py-3 rounded-xl font-mono text-sm font-bold border transition-all cursor-pointer ${
                        amount === preset && !customAmount
                          ? 'bg-amber-600 text-white border-amber-600 shadow-sm'
                          : 'bg-stone-50 dark:bg-stone-800 border-stone-200 dark:border-stone-700 text-stone-800 dark:text-stone-200 hover:border-stone-400'
                      }`}
                    >
                      {preset.toLocaleString()}
                    </button>
                  ))}
                </div>

                <div className="relative pt-1">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-mono font-bold text-stone-400">
                    ETB
                  </span>
                  <input
                    type="number"
                    min="50"
                    placeholder="Or enter custom amount in Ethiopian Birr..."
                    value={customAmount}
                    onChange={handleCustomChange}
                    className="w-full pl-12 pr-4 py-3 text-sm rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 outline-hidden font-mono"
                  />
                </div>
              </div>

              {/* Donor Details & Payment Options */}
              <form onSubmit={handleSubmit} className="space-y-4 pt-2">
                <h3 className="font-serif font-bold text-xl text-stone-900 dark:text-stone-100">
                  3. Donor Details & Payment Gateway
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      disabled={isAnonymous}
                      placeholder="e.g. Hajji Mohammed Amin"
                      value={donorName}
                      onChange={(e) => setDonorName(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 outline-hidden disabled:opacity-50"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                      Phone Number (for SMS Receipt)
                    </label>
                    <input
                      type="tel"
                      placeholder="e.g. +251 91 123 4567"
                      value={donorPhone}
                      onChange={(e) => setDonorPhone(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 outline-hidden font-mono"
                    />
                  </div>
                </div>

                <label className="flex items-center gap-2 text-xs text-stone-600 dark:text-stone-300 cursor-pointer pt-1">
                  <input
                    type="checkbox"
                    checked={isAnonymous}
                    onChange={(e) => setIsAnonymous(e.target.checked)}
                    className="rounded-sm text-emerald-600 focus:ring-emerald-500 w-4 h-4"
                  />
                  <span>Give anonymously (Name will be hidden on public donor roll)</span>
                </label>

                {/* Payment Gateway selector */}
                <div className="pt-2">
                  <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1.5">
                    Select Ethiopian Payment Gateway
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {(['Telebirr', 'CBE Birr', 'Awash Bank', 'Bank Transfer'] as const).map((method) => (
                      <button
                        key={method}
                        type="button"
                        onClick={() => setPaymentMethod(method)}
                        className={`p-3 rounded-xl border text-xs font-bold transition-all cursor-pointer text-center ${
                          paymentMethod === method
                            ? 'bg-emerald-800 text-white border-emerald-800 shadow-sm'
                            : 'bg-stone-50 dark:bg-stone-800 border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300 hover:border-stone-400'
                        }`}
                      >
                        {method}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-4">
                  <Button
                    variant="gold"
                    size="lg"
                    type="submit"
                    icon={<HeartHandshake className="w-5 h-5" />}
                    className="w-full justify-center text-base font-bold shadow-lg"
                  >
                    Confirm Donation of {amount.toLocaleString()} ETB
                  </Button>
                </div>
              </form>
            </Card>
          </div>

          {/* Right 5 cols: Transparency Guarantee & Impact breakdown */}
          <div className="lg:col-span-5 space-y-6">
            <Card className="bg-emerald-950 text-emerald-100 border-emerald-800 space-y-4">
              <div className="flex items-center gap-2 text-amber-300 text-xs font-bold uppercase tracking-wider">
                <ShieldCheck className="w-4 h-4" />
                <span>100% Shari'ah Trust Policy</span>
              </div>
              <h3 className="font-serif font-bold text-xl text-white">
                Council Waqf & Zakat Guarantee
              </h3>
              <p className="text-xs text-stone-300 leading-relaxed">
                All donations to Jimma Islamic Council are ring-fenced and audited quarterly by an independent
                Shari'ah board and financial auditors.
              </p>

              <div className="space-y-2 pt-2 text-xs border-t border-emerald-900">
                <div className="flex items-center gap-2 text-emerald-200">
                  <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>Direct allocation with zero administrative skimming</span>
                </div>
                <div className="flex items-center gap-2 text-emerald-200">
                  <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>Instant verified digital receipt with tracking code</span>
                </div>
                <div className="flex items-center gap-2 text-emerald-200">
                  <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>Audited quarterly reports published to public ledger</span>
                </div>
              </div>
            </Card>

            <Card className="space-y-4">
              <h4 className="font-serif font-bold text-base text-stone-900 dark:text-stone-100">
                Direct Impact of Your Sadaqah
              </h4>
              <div className="space-y-3 text-xs text-stone-600 dark:text-stone-300">
                <div className="p-3 rounded-xl bg-stone-50 dark:bg-stone-800/60 border border-stone-100 dark:border-stone-700/60">
                  <span className="font-bold text-emerald-700 dark:text-emerald-400">500 ETB:</span> Provides Quran copies and textbooks for two madrasa students.
                </div>
                <div className="p-3 rounded-xl bg-stone-50 dark:bg-stone-800/60 border border-stone-100 dark:border-stone-700/60">
                  <span className="font-bold text-amber-700 dark:text-amber-400">2,500 ETB:</span> One month full sponsorship (meals + boarding) for an orphan Hifz student.
                </div>
                <div className="p-3 rounded-xl bg-stone-50 dark:bg-stone-800/60 border border-stone-100 dark:border-stone-700/60">
                  <span className="font-bold text-blue-700 dark:text-blue-400">10,000 ETB:</span> Acoustic system maintenance and prayer carpet for rural district mosque.
                </div>
              </div>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
};
