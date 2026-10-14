import React from 'react';
import { Calendar, MessageCircle, ShieldCheck, Clock, CreditCard, Sparkles } from 'lucide-react';
import { BUSINESS_INFO } from '../data/servicesData';
import { GioLogo } from './GioLogo';

interface HeroProps {
  onOpenBooking: () => void;
  onOpenCalculator: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onOpenBooking, onOpenCalculator }) => {
  const whatsappUrl = `https://wa.me/${BUSINESS_INFO.whatsappRaw}?text=${encodeURIComponent(
    "Hi Gio's Laundromat! I would like to schedule a laundry & sneaker spa pickup in Pietermaritzburg."
  )}`;

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-sky-50/70 via-white to-slate-50 pt-6 pb-16 lg:pt-10 lg:pb-24 border-b border-slate-200">
      {/* Subtle decorative bubble elements */}
      <div className="absolute top-12 left-10 w-72 h-72 bg-sky-200/40 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-cyan-200/30 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Proposition & CTAs */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            {/* Business Logo & Badge Lockup */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <div className="bg-white px-4 py-2 rounded-2xl shadow-sm border border-slate-200 inline-flex items-center">
                <GioLogo size="sm" variant="dark" />
              </div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs sm:text-sm font-bold shadow-sm">
                <Sparkles className="w-4 h-4 text-emerald-600" />
                <span>🎁 Free Pickup &amp; Delivery for First-Time Customers!</span>
              </div>
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight font-display text-balance">
              Laundry Day? <span className="text-sky-600">We Got It.</span>
            </h1>

            {/* Subheading */}
            <p className="text-lg sm:text-xl text-slate-600 max-w-2xl font-normal leading-relaxed mx-auto lg:mx-0">
              Pick-up &amp; Delivery Laundry + Professional Shoe Spa in{' '}
              <strong className="text-slate-800 font-semibold">Pietermaritzburg</strong>. Fresh clothes, spotless sneakers, booked in 30 seconds.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 sm:gap-4 pt-2">
              <button
                onClick={onOpenBooking}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-xl bg-sky-600 hover:bg-sky-700 active:bg-sky-800 text-white font-semibold text-base shadow-lg shadow-sky-600/20 hover:shadow-sky-600/30 transition-all duration-200"
              >
                <Calendar className="w-5 h-5" />
                <span>Schedule Pickup</span>
              </button>

              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-semibold text-base shadow-sm transition-all duration-200"
              >
                <MessageCircle className="w-5 h-5 text-white" />
                <span>WhatsApp Us</span>
              </a>

              <button
                onClick={onOpenCalculator}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-5 py-3.5 rounded-xl bg-white border border-slate-300 hover:border-slate-400 text-slate-700 hover:text-slate-900 font-medium text-sm transition-colors"
              >
                <span>Calculate Price</span>
              </button>
            </div>

            {/* Trust Markers Bar */}
            <div className="pt-6 border-t border-slate-200/80 grid grid-cols-2 sm:grid-cols-4 gap-4 text-left">
              <div className="flex items-start gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-sky-100 flex items-center justify-center text-sky-700 shrink-0 mt-0.5">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900">24 – 48 Hrs</p>
                  <p className="text-xs text-slate-500">Fast doorstep return</p>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-700 shrink-0 mt-0.5">
                  <CreditCard className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900">Pay on Delivery</p>
                  <p className="text-xs text-slate-500">Card machine or cash</p>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center text-amber-700 shrink-0 mt-0.5">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900">Shoe Spa Lab</p>
                  <p className="text-xs text-slate-500">Hand cleaned by pros</p>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-800 shrink-0 mt-0.5">
                  <Sparkles className="w-4 h-4 text-emerald-700" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900">1st Order Free</p>
                  <p className="text-xs text-slate-500">Pick-up &amp; delivery</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Hero Visual Image Card */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl shadow-sky-950/10 border border-slate-200 bg-white">
              <img
                src="/src/assets/images/hero_laundry_shoes_1791137012366.jpg"
                alt="Fresh neatly folded laundry and pristine cleaned sneaker in modern studio"
                className="w-full h-80 sm:h-96 object-cover"
                referrerPolicy="no-referrer"
              />

              {/* Float badge 1: Real-time status */}
              <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-md rounded-xl p-3.5 border border-slate-200 shadow-lg flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
                  <div>
                    <p className="text-xs font-bold text-slate-900">Drivers On Route across PMB</p>
                    <p className="text-xs text-slate-500">Pickup slots: 09h00–12h00 &amp; 14h00–17h00 (Mon–Sat)</p>
                  </div>
                </div>
                <button
                  onClick={onOpenBooking}
                  className="text-xs font-semibold text-sky-600 hover:text-sky-700 bg-sky-50 hover:bg-sky-100 px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap"
                >
                  Book Slot →
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
