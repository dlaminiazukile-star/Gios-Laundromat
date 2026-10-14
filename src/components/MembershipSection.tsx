import React, { useState } from 'react';
import {
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Clock,
  Calendar,
  User,
  ShieldCheck,
  CreditCard,
  Phone,
  ArrowRight,
  Search,
  X,
  Package,
  Layers,
  Award,
  Zap,
} from 'lucide-react';
import { MembershipPackage, MemberSubscription } from '../types';
import { BUSINESS_INFO, MEMBERSHIP_PACKAGES } from '../data/servicesData';
import { GioLogo } from './GioLogo';

interface MembershipSectionProps {
  subscriptions: MemberSubscription[];
  onAddSubscription: (newSub: MemberSubscription) => void;
  onOpenBookingWithMember: (memberNumber: string) => void;
}

export const MembershipSection: React.FC<MembershipSectionProps> = ({
  subscriptions,
  onAddSubscription,
  onOpenBookingWithMember,
}) => {
  // Modal states
  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);
  const [selectedPlanForJoin, setSelectedPlanForJoin] = useState<MembershipPackage>(MEMBERSHIP_PACKAGES[1]);
  const [isLookupModalOpen, setIsLookupModalOpen] = useState(false);
  const [lookupQuery, setLookupQuery] = useState('');
  const [lookedUpMember, setLookedUpMember] = useState<MemberSubscription | null>(null);
  const [lookupError, setLookupError] = useState<string | null>(null);

  // Join Form State
  const [custName, setCustName] = useState('');
  const [custPhone, setCustPhone] = useState('');
  const [custEmail, setCustEmail] = useState('');
  const [custAddress, setCustAddress] = useState('');
  const [custSuburb, setCustSuburb] = useState('Scottsville');
  const [newJoinedMember, setNewJoinedMember] = useState<MemberSubscription | null>(null);

  // Open Join Modal for specific plan
  const handleOpenJoin = (pkg: MembershipPackage) => {
    setSelectedPlanForJoin(pkg);
    setNewJoinedMember(null);
    setIsJoinModalOpen(true);
  };

  // Submit Join Registration
  const handleRegisterSubscription = (e: React.FormEvent) => {
    e.preventDefault();
    if (!custName || !custPhone || !custAddress) return;

    // Generate unique membership number: GIO + 5 digits
    const randomDigits = Math.floor(10000 + Math.random() * 90000);
    const membershipNumber = `GIO0${randomDigits.toString().slice(-4)}`;

    const now = new Date();
    const renewalDate = new Date();
    renewalDate.setDate(now.getDate() + 30);

    const newSub: MemberSubscription = {
      membershipNumber,
      customerName: custName,
      phone: custPhone,
      email: custEmail || `${custPhone.replace(/[^0-9]/g, '')}@giosmember.co.za`,
      address: custAddress,
      suburb: custSuburb,
      tierId: selectedPlanForJoin.id,
      packageName: selectedPlanForJoin.name,
      monthlyFee: selectedPlanForJoin.monthlyFee,
      totalKgAllowance: selectedPlanForJoin.monthlyKgAllowance,
      usedKg: 0,
      remainingKg: selectedPlanForJoin.monthlyKgAllowance,
      maxBookingsPerMonth: selectedPlanForJoin.maxBookingsPerMonth,
      usedBookingsCount: 0,
      status: 'active',
      paymentStatus: 'paid',
      billingCycleStartDate: now.toISOString().split('T')[0],
      renewalDate: renewalDate.toISOString().split('T')[0],
      lastPaymentDate: now.toISOString().split('T')[0],
      paymentMethod: 'Speedpoint Card Machine on Delivery',
      overageKgUsed: 0,
      overageCharges: 0,
    };

    onAddSubscription(newSub);
    setNewJoinedMember(newSub);

    // Reset inputs
    setCustName('');
    setCustPhone('');
    setCustEmail('');
    setCustAddress('');
  };

  // Handle Member Lookup
  const handleSearchMember = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setLookupError(null);
    const clean = lookupQuery.trim().toUpperCase().replace(/[^A-Z0-9]/g, '');

    if (!clean) {
      setLookupError('Please enter your Membership Number (e.g. GIO04081) or phone number.');
      return;
    }

    const found = subscriptions.find(
      (s) =>
        s.membershipNumber.toUpperCase() === clean ||
        s.membershipNumber.toUpperCase() === `GIO${clean}` ||
        s.phone.replace(/[^0-9]/g, '').includes(clean)
    );

    if (found) {
      setLookedUpMember(found);
      setLookupError(null);
    } else {
      setLookedUpMember(null);
      setLookupError(
        `No membership profile found for "${lookupQuery}". Try demo number "GIO04081" or check with Gio's support.`
      );
    }
  };

  return (
    <section id="memberships" className="py-20 sm:py-28 bg-slate-950 text-white relative overflow-hidden">
      {/* Background Accent Glows */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#00AEEF]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-400/20 text-[#00AEEF] text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Clean Without Limit · Membership Packages</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black font-display tracking-tight text-white">
            GIO’S LAUNDROMAT <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00AEEF] via-sky-300 to-amber-300">
              MEMBERSHIP PACKAGES
            </span>
          </h2>

          <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
            Eliminate laundry hassles with automated monthly allowance packages. Each member receives a unique membership number, priority booking, and member rates on extra laundry.
          </p>

          {/* Member Quick Actions Bar */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={() => {
                setLookupQuery('GIO04081');
                setIsLookupModalOpen(true);
              }}
              className="px-4 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-sky-300 border border-slate-700 text-xs sm:text-sm font-semibold flex items-center gap-2 transition-all shadow-sm cursor-pointer"
            >
              <Search className="w-4 h-4 text-[#00AEEF]" />
              <span>Already a Member? Check Allowance</span>
            </button>
            <span className="text-slate-600 hidden sm:inline">|</span>
            <span className="text-xs text-slate-400">
              Demo Member Profile: <strong className="text-white">GIO04081</strong>
            </span>
          </div>
        </div>

        {/* 3 Packages Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-14 items-stretch">
          {MEMBERSHIP_PACKAGES.map((pkg) => {
            const isComfort = pkg.id === 'comfort';

            return (
              <div
                key={pkg.id}
                className={`relative rounded-3xl p-6 sm:p-8 flex flex-col justify-between transition-all duration-300 ${
                  isComfort
                    ? 'bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 border-2 border-[#00AEEF] shadow-2xl shadow-sky-500/20 md:-translate-y-2'
                    : 'bg-slate-900/90 border border-slate-800 hover:border-slate-700 shadow-xl'
                }`}
              >
                {/* Popular Badge */}
                {isComfort && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-[#00AEEF] to-sky-400 text-slate-950 text-xs font-black uppercase tracking-wider px-4 py-1 rounded-full shadow-md flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5 fill-current" />
                    <span>Most Popular Choice</span>
                  </div>
                )}

                <div>
                  {/* Header Title */}
                  <div className="border-b border-slate-800 pb-5">
                    <span className="text-xs font-bold uppercase tracking-wider text-sky-400">
                      {pkg.targetAudience}
                    </span>
                    <h3 className="text-2xl font-black font-display text-white mt-1">
                      {pkg.name}
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">{pkg.subtitle}</p>

                    {/* Price Lockup */}
                    <div className="mt-5 flex items-baseline gap-1">
                      <span className="text-4xl sm:text-5xl font-black font-display text-white tabular-nums">
                        R{pkg.monthlyFee}
                      </span>
                      <span className="text-slate-400 text-sm font-semibold">/ month</span>
                    </div>

                    <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-sky-500/10 border border-sky-400/20 text-[#00AEEF] text-xs font-bold">
                      <Package className="w-3.5 h-3.5" />
                      <span>Up to {pkg.monthlyKgAllowance} kg Wash-and-Fold / mo</span>
                    </div>
                  </div>

                  {/* Bullet Features */}
                  <div className="py-6 space-y-3.5">
                    <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      Package Inclusions:
                    </p>

                    <ul className="space-y-3 text-xs sm:text-sm text-slate-300">
                      {pkg.features.map((feat, idx) => (
                        <li key={idx} className="flex items-start gap-2.5">
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                          <span>{feat}</span>
                        </li>
                      ))}

                      {pkg.maxBookingsPerMonth ? (
                        <li className="flex items-start gap-2.5 text-slate-300 font-medium">
                          <Calendar className="w-4 h-4 text-[#00AEEF] shrink-0 mt-0.5" />
                          <span>Maximum {pkg.maxBookingsPerMonth} bookings per month</span>
                        </li>
                      ) : (
                        <li className="flex items-start gap-2.5 text-sky-300 font-semibold">
                          <Zap className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                          <span>Priority booking windows &amp; flexible collections</span>
                        </li>
                      )}
                    </ul>

                    {/* Terms */}
                    <div className="pt-4 border-t border-slate-800/80 space-y-1.5 text-[11px] text-slate-400">
                      {pkg.terms.map((term, tIdx) => (
                        <p key={tIdx} className="flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-slate-600" />
                          <span>{term}</span>
                        </p>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Card CTA Button */}
                <div className="pt-4">
                  <button
                    onClick={() => handleOpenJoin(pkg)}
                    className={`w-full py-3.5 px-6 rounded-2xl font-bold text-sm transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer shadow-lg active:scale-95 ${
                      isComfort
                        ? 'bg-[#00AEEF] hover:bg-sky-400 text-slate-950 shadow-sky-500/20 font-black'
                        : 'bg-white hover:bg-slate-100 text-slate-950 font-bold'
                    }`}
                  >
                    <span>Subscribe to {pkg.name}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                  <p className="text-[10px] text-center text-slate-500 mt-2">
                    Pay on first delivery via Speedpoint card machine or cash
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* How Gio's System Handles Memberships Callout */}
        <div className="mt-16 bg-slate-900/60 border border-slate-800 rounded-3xl p-6 sm:p-8">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-2 max-w-2xl">
              <div className="flex items-center gap-2 text-amber-400 font-bold text-xs uppercase tracking-wider">
                <ShieldCheck className="w-4 h-4" />
                <span>How Gio’s Automated Membership Engine Works</span>
              </div>
              <h4 className="text-xl sm:text-2xl font-black font-display text-white">
                Unique Membership Number · Automatic Kilogram Tracking
              </h4>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                When you subscribe, you receive a personal profile with a unique membership number (e.g. <strong className="text-white">GIO04081</strong>). Gio's system tracks your allowance, alerts you before you run out, calculates member-discounted rates for extra wash, and notifies you when renewal is due.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
              <button
                onClick={() => {
                  setLookupQuery('GIO04081');
                  handleSearchMember();
                  setIsLookupModalOpen(true);
                }}
                className="px-5 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 border border-slate-700 transition-colors cursor-pointer"
              >
                <User className="w-4 h-4 text-[#00AEEF]" />
                <span>View Member Profile (GIO04081)</span>
              </button>
              <button
                onClick={() => handleOpenJoin(MEMBERSHIP_PACKAGES[1])}
                className="px-5 py-3 rounded-2xl bg-[#00AEEF] hover:bg-sky-400 text-slate-950 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <Sparkles className="w-4 h-4" />
                <span>Join a Plan Today</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* MODAL 1: JOIN / SUBSCRIBE MODAL                           */}
      {/* ======================================================== */}
      {isJoinModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 text-slate-900 my-8">
            <div className="flex items-center justify-between border-b border-slate-200 pb-4">
              <div>
                <h3 className="text-lg font-black font-display text-slate-900">
                  Subscribe to {selectedPlanForJoin.name}
                </h3>
                <p className="text-xs text-slate-500">
                  R{selectedPlanForJoin.monthlyFee} / month · Up to {selectedPlanForJoin.monthlyKgAllowance} kg wash-and-fold
                </p>
              </div>
              <button
                onClick={() => setIsJoinModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {!newJoinedMember ? (
              <form onSubmit={handleRegisterSubscription} className="space-y-4 pt-4">
                {/* Select Package Selector */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Selected Membership Package
                  </label>
                  <select
                    value={selectedPlanForJoin.id}
                    onChange={(e) => {
                      const p = MEMBERSHIP_PACKAGES.find((pkg) => pkg.id === e.target.value);
                      if (p) setSelectedPlanForJoin(p);
                    }}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-sm font-bold bg-white"
                  >
                    {MEMBERSHIP_PACKAGES.map((pkg) => (
                      <option key={pkg.id} value={pkg.id}>
                        {pkg.name} — R{pkg.monthlyFee}/month ({pkg.monthlyKgAllowance} kg allowance)
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Siphesihle Zondi"
                    value={custName}
                    onChange={(e) => setCustName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      WhatsApp Phone *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="082 123 4567"
                      value={custPhone}
                      onChange={(e) => setCustPhone(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      PMB Suburb *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Scottsville"
                      value={custSuburb}
                      onChange={(e) => setCustSuburb(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Street Address (For Doorstep Pickups) *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 14 Ridge Road, Complex 4B"
                    value={custAddress}
                    onChange={(e) => setCustAddress(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm"
                  />
                </div>

                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-xs space-y-1.5 text-slate-700">
                  <div className="flex justify-between font-bold text-slate-900">
                    <span>Monthly Subscription Fee:</span>
                    <span className="text-[#00AEEF] text-base font-black">
                      R{selectedPlanForJoin.monthlyFee}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500">
                    • Allowance: {selectedPlanForJoin.monthlyKgAllowance} kg included per monthly billing cycle.
                  </p>
                  <p className="text-[11px] text-slate-500">
                    • Collection &amp; delivery charged separately. Unused allowance expires monthly.
                  </p>
                  <p className="text-[11px] text-emerald-600 font-semibold">
                    • Payment due on delivery via Speedpoint card machine or cash.
                  </p>
                </div>

                <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200">
                  <button
                    type="button"
                    onClick={() => setIsJoinModalOpen(false)}
                    className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl bg-[#00AEEF] hover:bg-sky-500 text-slate-950 font-black text-xs shadow-md shadow-sky-200 transition-all cursor-pointer"
                  >
                    Activate Membership
                  </button>
                </div>
              </form>
            ) : (
              <div className="space-y-5 pt-4 text-center">
                <div className="w-16 h-16 rounded-3xl bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
                  <CheckCircle2 className="w-8 h-8" />
                </div>

                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">
                    Membership Successfully Activated!
                  </span>
                  <h4 className="text-2xl font-black font-display text-slate-900 mt-1">
                    Welcome to {newJoinedMember.packageName}
                  </h4>
                  <p className="text-xs text-slate-500 mt-1">
                    Your unique Gio’s membership profile is active in our Pietermaritzburg system.
                  </p>
                </div>

                {/* Unique Membership Number Card */}
                <div className="bg-slate-900 text-white rounded-2xl p-5 space-y-2 border border-slate-800">
                  <span className="text-xs text-slate-400 font-medium">Your Unique Membership Number:</span>
                  <p className="text-3xl font-black text-[#00AEEF] tracking-widest font-display">
                    {newJoinedMember.membershipNumber}
                  </p>
                  <p className="text-xs text-slate-300">
                    Monthly Allowance: <strong className="text-white">{newJoinedMember.totalKgAllowance} kg</strong> wash-and-fold
                  </p>
                  <p className="text-[11px] text-slate-400">
                    Valid through: {newJoinedMember.renewalDate}
                  </p>
                </div>

                <div className="flex flex-col gap-2 pt-2">
                  <button
                    onClick={() => {
                      setIsJoinModalOpen(false);
                      onOpenBookingWithMember(newJoinedMember.membershipNumber);
                    }}
                    className="w-full py-3 rounded-xl bg-[#00AEEF] hover:bg-sky-400 text-slate-950 font-black text-xs sm:text-sm shadow-md transition-colors cursor-pointer"
                  >
                    Book Your First Member Pickup Now
                  </button>

                  <button
                    onClick={() => setIsJoinModalOpen(false)}
                    className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition-colors cursor-pointer"
                  >
                    Close
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL 2: MEMBER LOOKUP & LIVE ALLOWANCE TRACKER          */}
      {/* ======================================================== */}
      {isLookupModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 text-slate-900 my-8">
            <div className="flex items-center justify-between border-b border-slate-200 pb-4">
              <div>
                <h3 className="text-lg font-black font-display text-slate-900">
                  Member Profile &amp; Allowance Tracker
                </h3>
                <p className="text-xs text-slate-500">
                  View your remaining kilograms, booking count, and renewal status
                </p>
              </div>
              <button
                onClick={() => setIsLookupModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Search Input Box */}
            <form onSubmit={handleSearchMember} className="pt-4 flex gap-2">
              <input
                type="text"
                placeholder="Enter Member Number (e.g. GIO04081) or Phone..."
                value={lookupQuery}
                onChange={(e) => setLookupQuery(e.target.value)}
                className="flex-1 px-3 py-2 rounded-xl border border-slate-300 text-sm font-semibold focus:border-[#00AEEF] focus:outline-none uppercase"
              />
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-[#00AEEF] hover:bg-sky-500 text-slate-950 font-bold text-xs cursor-pointer"
              >
                Check
              </button>
            </form>

            {lookupError && (
              <p className="mt-2 text-xs text-rose-600 font-medium">{lookupError}</p>
            )}

            {/* Display Found Member Profile */}
            {lookedUpMember && (
              <div className="mt-6 space-y-4 pt-4 border-t border-slate-200 animate-fadeIn">
                {/* Member Profile Card */}
                <div className="bg-slate-900 text-white p-5 rounded-2xl space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                        Member #{lookedUpMember.membershipNumber}
                      </span>
                      <h4 className="text-lg font-black text-white font-display">
                        {lookedUpMember.customerName}
                      </h4>
                    </div>

                    <span
                      className={`text-xs font-bold px-2.5 py-1 rounded-full border ${
                        lookedUpMember.status === 'active'
                          ? 'bg-emerald-500/20 text-emerald-300 border-emerald-400/30'
                          : lookedUpMember.status === 'payment_pending'
                          ? 'bg-amber-500/20 text-amber-300 border-amber-400/30'
                          : 'bg-rose-500/20 text-rose-300 border-rose-400/30'
                      }`}
                    >
                      {lookedUpMember.status.toUpperCase()}
                    </span>
                  </div>

                  <p className="text-xs text-slate-300">
                    Plan: <strong className="text-white">{lookedUpMember.packageName}</strong> (R{lookedUpMember.monthlyFee}/month)
                  </p>

                  {/* KILOGRAM ALLOWANCE METER */}
                  <div className="space-y-1.5 pt-2 border-t border-slate-800">
                    <div className="flex justify-between text-xs font-bold">
                      <span className="text-slate-300">Kilograms Allowance Meter:</span>
                      <span className="text-[#00AEEF] tabular-nums">
                        {lookedUpMember.remainingKg.toFixed(1)} kg remaining of {lookedUpMember.totalKgAllowance} kg
                      </span>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full bg-slate-800 rounded-full h-3 overflow-hidden p-0.5 border border-slate-700">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          lookedUpMember.remainingKg <= 3
                            ? 'bg-gradient-to-r from-amber-500 to-rose-500'
                            : 'bg-gradient-to-r from-sky-400 to-emerald-400'
                        }`}
                        style={{
                          width: `${Math.min(
                            100,
                            Math.max(
                              5,
                              ((lookedUpMember.totalKgAllowance - lookedUpMember.remainingKg) /
                                lookedUpMember.totalKgAllowance) *
                                100
                            )
                          )}%`,
                        }}
                      />
                    </div>

                    <div className="flex justify-between text-[10px] text-slate-400">
                      <span>Used: {lookedUpMember.usedKg.toFixed(1)} kg</span>
                      <span>Total Allowance: {lookedUpMember.totalKgAllowance} kg</span>
                    </div>
                  </div>

                  {/* LOW ALLOWANCE ALERT NOTIFICATION */}
                  {lookedUpMember.remainingKg <= 4 && lookedUpMember.remainingKg > 0 && (
                    <div className="bg-amber-500/20 border border-amber-400/30 rounded-xl p-3 flex items-start gap-2 text-xs text-amber-200">
                      <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold">Allowance Running Low:</span> You have only {lookedUpMember.remainingKg.toFixed(1)} kg remaining this month. Additional laundry will be charged at member discounted pricing.
                      </div>
                    </div>
                  )}

                  {/* OVERAGE ALERT */}
                  {lookedUpMember.overageKgUsed > 0 && (
                    <div className="bg-rose-500/20 border border-rose-400/30 rounded-xl p-3 flex items-start gap-2 text-xs text-rose-200">
                      <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold">Allowance Exceeded:</span> {lookedUpMember.overageKgUsed} kg extra laundry used. Member overage fee calculated: R{lookedUpMember.overageCharges}.
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800 text-[11px] text-slate-300">
                    <div>
                      <span>Bookings Used:</span>{' '}
                      <strong className="text-white">
                        {lookedUpMember.usedBookingsCount}
                        {lookedUpMember.maxBookingsPerMonth
                          ? ` / ${lookedUpMember.maxBookingsPerMonth}`
                          : ' (Flexible)'}
                      </strong>
                    </div>
                    <div>
                      <span>Next Renewal Date:</span>{' '}
                      <strong className="text-white">{lookedUpMember.renewalDate}</strong>
                    </div>
                  </div>
                </div>

                {/* Direct Action */}
                <button
                  onClick={() => {
                    setIsLookupModalOpen(false);
                    onOpenBookingWithMember(lookedUpMember.membershipNumber);
                  }}
                  className="w-full py-3 rounded-xl bg-[#00AEEF] hover:bg-sky-400 text-slate-950 font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md cursor-pointer transition-colors"
                >
                  <Package className="w-4 h-4" />
                  <span>Book Pickup Using Member Allowance ({lookedUpMember.membershipNumber})</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
};
