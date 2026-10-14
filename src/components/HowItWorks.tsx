import React from 'react';
import { CalendarCheck, Truck, Sparkles, ArrowRight, ShieldCheck } from 'lucide-react';

interface HowItWorksProps {
  onOpenBooking: () => void;
}

export const HowItWorks: React.FC<HowItWorksProps> = ({ onOpenBooking }) => {
  const steps = [
    {
      number: '01',
      title: 'Schedule a Pickup',
      subtitle: 'On WhatsApp or Website',
      description:
        'Choose your date, pickup slot (09h00–12h00 or 14h00–17h00 Mon–Sat), and services. 100% FREE pickup & delivery for all first-time customers! (Sundays: deliveries only).',
      icon: CalendarCheck,
      color: 'bg-sky-500 text-white',
      badge: 'Step 1',
    },
    {
      number: '02',
      title: 'We Collect at Your Door',
      subtitle: 'Home or Office',
      description:
        'Our friendly courier arrives with branded bags. We weigh your wash on certified mobile digital scales at your door. Official tax invoice is issued once weighed.',
      icon: Truck,
      color: 'bg-cyan-600 text-white',
      badge: 'Step 2',
    },
    {
      number: '03',
      title: 'Delivered Fresh & Clean',
      subtitle: 'In 24 – 48 Hours',
      description:
        'Clothes return crisply folded and fresh. Shoes arrive spotless and deodorized. Pay conveniently at your door with card machine or cash.',
      icon: Sparkles,
      color: 'bg-emerald-600 text-white',
      badge: 'Step 3',
    },
  ];

  return (
    <section id="how-it-works" className="py-16 sm:py-20 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <p className="text-xs sm:text-sm font-bold uppercase tracking-wider text-sky-600 mb-2">
            Effortless Convenience
          </p>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-display">
            How It Works in 3 Simple Steps
          </h2>
          <p className="text-slate-600 mt-3 text-base">
            No hauling heavy baskets. No sitting in laundromat chairs. No ruined sneakers. We handle everything door-to-door.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {/* Connector line on desktop */}
          <div className="hidden md:block absolute top-1/2 left-1/6 right-1/6 h-0.5 bg-gradient-to-r from-sky-200 via-cyan-200 to-emerald-200 -translate-y-8 -z-0" />

          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div
                key={idx}
                className="relative bg-slate-50 hover:bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 hover:border-sky-300 hover:shadow-xl transition-all duration-300 group z-10 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div
                      className={`w-14 h-14 rounded-2xl ${step.color} flex items-center justify-center shadow-md group-hover:scale-105 transition-transform duration-300`}
                    >
                      <Icon className="w-7 h-7" />
                    </div>
                    <span className="text-3xl font-black text-slate-300 font-display tracking-tight group-hover:text-sky-400 transition-colors">
                      {step.number}
                    </span>
                  </div>

                  <p className="text-xs font-bold text-sky-600 uppercase tracking-wider mb-1">
                    {step.badge}
                  </p>
                  <h3 className="text-xl font-bold text-slate-900 mb-1 font-display">
                    {step.title}
                  </h3>
                  <p className="text-xs font-semibold text-slate-500 mb-3">
                    {step.subtitle}
                  </p>
                  <p className="text-slate-600 text-sm leading-relaxed">
                    {step.description}
                  </p>
                </div>

                <div className="pt-6 mt-4 border-t border-slate-200/80 flex items-center text-xs font-semibold text-sky-700">
                  <span>Fast &amp; Reliable</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-1 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-12 text-center">
          <button
            onClick={onOpenBooking}
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-semibold text-sm shadow-md shadow-sky-200 transition-colors"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Schedule Your Pickup Today</span>
          </button>
        </div>
      </div>
    </section>
  );
};
