import React, { useState, useEffect } from 'react';
import { useSearchParams, useLocation } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { useLanguage } from '../../context/LanguageContext';
import {
  HandHeart,
  FileCheck2,
  Clock,
  CheckCircle2,
  Search,
  ArrowRight,
  ShieldAlert,
  Send,
  Building,
  UserCheck,
  Calculator,
  Scale,
  Sparkles,
  HeartHandshake,
} from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { ServiceItem } from '../../data/mockServices';
import { ZakatCalculator } from '../../components/services/ZakatCalculator';
import { IslamicPattern } from '../../components/common/IslamicPattern';

export const ServicesPage: React.FC = () => {
  const { publicServices, serviceRequests, submitServiceRequest, addToast } = useApp();
  const { t } = useLanguage();
  const [searchParams, setSearchParams] = useSearchParams();

  const [selectedService, setSelectedService] = useState<ServiceItem | null>(null);
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'catalogue' | 'zakat' | 'track'>('catalogue');
  const [trackQuery, setTrackQuery] = useState('');
  const [searchedRequest, setSearchedRequest] = useState<any>(null);

  useEffect(() => {
    const tabParam = searchParams.get('tab');
    if (tabParam === 'zakat') {
      setActiveTab('zakat');
    } else if (tabParam === 'track') {
      setActiveTab('track');
    }
  }, [searchParams]);

  // Form state
  const [applicantName, setApplicantName] = useState('');
  const [phone, setPhone] = useState('');
  const [district, setDistrict] = useState('Jimma Central');
  const [details, setDetails] = useState('');

  const openApplication = (service: ServiceItem) => {
    setSelectedService(service);
    setIsApplyModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedService || !applicantName || !phone) {
      addToast('Missing Fields', 'Please fill in applicant name and phone number.', 'warning');
      return;
    }

    const newReq = submitServiceRequest({
      serviceId: selectedService.id,
      serviceName: selectedService.title,
      applicantName,
      phone,
      district,
      details: details || `Standard application for ${selectedService.title}`,
      documentsAttached: selectedService.requiredDocuments.slice(0, 2),
    });

    setIsApplyModalOpen(false);
    setApplicantName('');
    setPhone('');
    setDetails('');
    setTrackQuery(newReq.trackingNo);
    setActiveTab('track');
    setSearchedRequest(newReq);
  };

  const handleTrack = (e: React.FormEvent) => {
    e.preventDefault();
    const found = serviceRequests.find(
      (r) => r.trackingNo.toLowerCase() === trackQuery.toLowerCase().trim()
    );
    if (found) {
      setSearchedRequest(found);
    } else {
      setSearchedRequest(null);
      addToast('Tracking No Not Found', `No application with ID "${trackQuery}" was located.`, 'warning');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="border-b border-stone-200 dark:border-stone-800 pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider mb-2">
            <HandHeart className="w-4 h-4" />
            <span>Public Civic Desk & Shari'ah Services</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-stone-900 dark:text-stone-100">
            Council Public Services & Civic Affairs
          </h1>
          <p className="text-stone-500 dark:text-stone-400 text-sm sm:text-base mt-1 max-w-2xl">
            Official marriage certifications, Zakat evaluations & calculators, Janazah dispatch, and Fatwa inquiry processing.
          </p>
        </div>

        {/* Tab switch: Catalogue, Zakat Calculator, or Tracking */}
        <div className="flex flex-wrap items-center bg-stone-100 dark:bg-stone-800 p-1 rounded-2xl border border-stone-200 dark:border-stone-700">
          <button
            onClick={() => {
              setActiveTab('catalogue');
              setSearchParams({});
            }}
            className={`px-3.5 py-2 text-xs font-semibold rounded-xl transition-all ${
              activeTab === 'catalogue'
                ? 'bg-white dark:bg-stone-900 text-emerald-800 dark:text-emerald-300 shadow-xs'
                : 'text-stone-600 dark:text-stone-400 hover:text-stone-900'
            }`}
          >
            Services Catalogue
          </button>
          <button
            onClick={() => {
              setActiveTab('zakat');
              setSearchParams({ tab: 'zakat' });
            }}
            className={`px-3.5 py-2 text-xs font-semibold rounded-xl transition-all flex items-center gap-1.5 ${
              activeTab === 'zakat'
                ? 'bg-emerald-700 text-white shadow-xs font-bold'
                : 'text-emerald-700 dark:text-emerald-400 hover:text-emerald-800'
            }`}
          >
            <Calculator className="w-3.5 h-3.5" />
            <span>Zakat Calculator</span>
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse hidden sm:inline-block" />
          </button>
          <button
            onClick={() => {
              setActiveTab('track');
              setSearchParams({ tab: 'track' });
            }}
            className={`px-3.5 py-2 text-xs font-semibold rounded-xl transition-all ${
              activeTab === 'track'
                ? 'bg-white dark:bg-stone-900 text-emerald-800 dark:text-emerald-300 shadow-xs'
                : 'text-stone-600 dark:text-stone-400 hover:text-stone-900'
            }`}
          >
            Track Application ({serviceRequests.length})
          </button>
        </div>
      </div>

      {/* Mode 1: Catalogue */}
      {activeTab === 'catalogue' && (
        <div className="space-y-8">
          {/* Featured Zakat Calculator Banner */}
          <div className="bg-gradient-to-r from-emerald-950 via-stone-900 to-emerald-950 rounded-3xl p-6 sm:p-7 border border-emerald-800/80 shadow-xl relative overflow-hidden text-stone-100 flex flex-col md:flex-row items-center justify-between gap-6">
            <IslamicPattern opacity={0.05} />
            <div className="relative z-10 space-y-2 max-w-2xl">
              <div className="flex items-center gap-2">
                <Badge variant="gold">Interactive Shari'ah Tool</Badge>
                <span className="text-[11px] text-amber-300 font-mono">Gold & Silver Nisab • Coffee Ushr • Livestock</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-serif font-bold text-white">
                Need to Calculate Your Zakat or Agricultural Harvest (Ushr)?
              </h3>
              <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
                Use the official Jimma Islamic Council Zakat Calculator to input bank savings, 21k/24k gold,
                business stock at wholesale value, and Limmu/Agaro coffee harvests to instantly verify your Nisab and obligation.
              </p>
            </div>

            <div className="relative z-10 flex sm:flex-row md:flex-col items-center gap-2 shrink-0 w-full md:w-auto">
              <Button
                variant="gold"
                size="md"
                className="w-full sm:w-auto md:w-full text-xs font-bold"
                icon={<Calculator className="w-4 h-4" />}
                onClick={() => {
                  setActiveTab('zakat');
                  setSearchParams({ tab: 'zakat' });
                }}
              >
                Launch Zakat Calculator
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {publicServices.map((service) => (
              <Card key={service.id} hoverEffect className="flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <Badge variant="teal">{service.category}</Badge>
                    <span className="text-xs text-stone-400 flex items-center gap-1 font-mono">
                      <Clock className="w-3.5 h-3.5" />
                      {service.turnaroundTime}
                    </span>
                  </div>

                  <h3 className="font-serif font-bold text-lg text-stone-900 dark:text-stone-100">
                    {service.title}
                  </h3>
                  <p className="text-xs text-stone-600 dark:text-stone-400 mt-2 leading-relaxed">
                    {service.description}
                  </p>

                  {/* Required Docs List */}
                  <div className="mt-4 pt-3 border-t border-stone-100 dark:border-stone-800 space-y-2 text-xs">
                    <span className="text-[10px] uppercase font-bold text-stone-400 block">
                      Required Documents
                    </span>
                    <div className="space-y-1">
                      {service.requiredDocuments.map((doc) => (
                        <div key={doc} className="flex items-center gap-1.5 text-stone-600 dark:text-stone-300">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          <span className="truncate">{doc}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between gap-2">
                  <div>
                    <span className="text-[10px] text-stone-400 uppercase block">Fee</span>
                    <span className="font-mono font-bold text-stone-900 dark:text-stone-100 text-xs">
                      {service.feeETB === 0 ? 'Free of Charge' : `${service.feeETB} ETB`}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {service.id === 'srv-2' && (
                      <Button
                        variant="outline"
                        size="sm"
                        icon={<Calculator className="w-3.5 h-3.5 text-amber-600" />}
                        onClick={() => {
                          setActiveTab('zakat');
                          setSearchParams({ tab: 'zakat' });
                        }}
                        className="text-xs"
                      >
                        Calculator
                      </Button>
                    )}
                    <Button
                      variant="primary"
                      size="sm"
                      icon={<ArrowRight className="w-4 h-4" />}
                      iconPosition="right"
                      onClick={() => openApplication(service)}
                      className="text-xs"
                    >
                      Apply Online
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Mode 2: Interactive Zakat Calculator */}
      {activeTab === 'zakat' && (
        <ZakatCalculator />
      )}

      {/* Mode 3: Tracking Desk */}
      {activeTab === 'track' && (
        <div className="max-w-3xl mx-auto space-y-6">
          <Card className="space-y-4">
            <h3 className="font-serif font-bold text-lg text-stone-900 dark:text-stone-100">
              Track Your Council Service Application
            </h3>
            <p className="text-xs text-stone-500">
              Enter your tracking code (e.g. "REQ-2026-001") to check approval, review status, and assigned desk officer.
            </p>

            <form onSubmit={handleTrack} className="flex gap-2">
              <input
                type="text"
                placeholder="Enter Tracking No (e.g. REQ-2026-001)..."
                value={trackQuery}
                onChange={(e) => setTrackQuery(e.target.value)}
                className="flex-1 px-4 py-2.5 text-sm rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 outline-hidden font-mono"
              />
              <Button variant="primary" type="submit">
                Track
              </Button>
            </form>
          </Card>

          {searchedRequest && (
            <Card className="space-y-5 border-emerald-500/40">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-stone-100 dark:border-stone-800 pb-3">
                <div>
                  <span className="text-xs font-mono text-stone-400 block">
                    Tracking #{searchedRequest.trackingNo}
                  </span>
                  <h4 className="font-serif font-bold text-lg text-stone-900 dark:text-stone-100">
                    {searchedRequest.serviceName}
                  </h4>
                </div>
                <Badge
                  variant={
                    searchedRequest.status === 'Completed'
                      ? 'emerald'
                      : searchedRequest.status === 'Approved'
                      ? 'teal'
                      : searchedRequest.status === 'In Review'
                      ? 'blue'
                      : 'gold'
                  }
                  size="md"
                >
                  Status: {searchedRequest.status}
                </Badge>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs">
                <div>
                  <span className="text-stone-400 block text-[10px] uppercase">Applicant</span>
                  <span className="font-semibold text-stone-800 dark:text-stone-200">
                    {searchedRequest.applicantName}
                  </span>
                </div>
                <div>
                  <span className="text-stone-400 block text-[10px] uppercase">Contact Phone</span>
                  <span className="font-mono text-stone-800 dark:text-stone-200">
                    {searchedRequest.phone}
                  </span>
                </div>
                <div>
                  <span className="text-stone-400 block text-[10px] uppercase">District Desk</span>
                  <span className="font-medium text-stone-800 dark:text-stone-200">
                    {searchedRequest.district}
                  </span>
                </div>
                <div>
                  <span className="text-stone-400 block text-[10px] uppercase">Submission Date</span>
                  <span className="font-mono text-stone-800 dark:text-stone-200">
                    {searchedRequest.submissionDate}
                  </span>
                </div>
                <div className="col-span-2">
                  <span className="text-stone-400 block text-[10px] uppercase">Assigned Council Officer</span>
                  <span className="font-semibold text-emerald-700 dark:text-emerald-400">
                    {searchedRequest.assignedOfficer}
                  </span>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700 text-xs">
                <span className="font-bold text-stone-700 dark:text-stone-300 block mb-1">
                  Application Details:
                </span>
                <p className="text-stone-600 dark:text-stone-400 leading-relaxed">
                  {searchedRequest.details}
                </p>
              </div>
            </Card>
          )}
        </div>
      )}

      {/* Service Application Modal */}
      {selectedService && (
        <Modal
          isOpen={isApplyModalOpen}
          onClose={() => setIsApplyModalOpen(false)}
          title={`Apply for: ${selectedService.title}`}
          subtitle={`Processing Time: ${selectedService.turnaroundTime} • Standard Shari'ah Compliance Review`}
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                Applicant Full Name *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Ustadh Fuad Mohammed"
                value={applicantName}
                onChange={(e) => setApplicantName(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 outline-hidden focus:border-emerald-500 text-stone-900 dark:text-stone-100"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  required
                  placeholder="e.g. +251 91 765 4321"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 outline-hidden text-stone-900 dark:text-stone-100 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                  District Desk *
                </label>
                <select
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-900 dark:text-stone-100"
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
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                Specific Request Notes / Case Summary
              </label>
              <textarea
                rows={3}
                placeholder="Provide any relevant details, names of witnesses, or specific dates..."
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 outline-hidden text-stone-900 dark:text-stone-100"
              />
            </div>

            <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-900 dark:text-emerald-200 space-y-1">
              <div className="font-bold">Required to present at interview:</div>
              <ul className="list-disc list-inside space-y-0.5 text-[11px] text-emerald-800 dark:text-emerald-300">
                {selectedService.requiredDocuments.map((doc) => (
                  <li key={doc}>{doc}</li>
                ))}
              </ul>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-stone-100 dark:border-stone-800">
              <Button
                variant="ghost"
                type="button"
                onClick={() => setIsApplyModalOpen(false)}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                type="submit"
                icon={<Send className="w-4 h-4" />}
              >
                Submit Application
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
