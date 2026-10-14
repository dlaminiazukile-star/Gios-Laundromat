import React from 'react';
import { Shirt, Sparkles, Briefcase, Footprints, ShieldCheck, Bed, Zap, Check, ArrowRight } from 'lucide-react';
import { SERVICES } from '../data/servicesData';
import { ServiceItem } from '../types';

interface ServicesSectionProps {
  onSelectServiceForCalculator: (serviceId: string) => void;
  onOpenBookingWithService: (serviceId: string) => void;
}

export const ServicesSection: React.FC<ServicesSectionProps> = ({
  onSelectServiceForCalculator,
  onOpenBookingWithService,
}) => {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Shirt':
        return Shirt;
      case 'Sparkles':
        return Sparkles;
      case 'Briefcase':
        return Briefcase;
      case 'Footprints':
        return Footprints;
      case 'ShieldCheck':
        return ShieldCheck;
      case 'Bed':
        return Bed;
      default:
        return Sparkles;
    }
  };

  return (
    <section id="services" className="py-16 sm:py-24 bg-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div className="max-w-2xl">
            <span className="text-xs sm:text-sm font-bold uppercase tracking-wider text-sky-600">
              Our Professional Care
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-1 font-display">
              Services Tailored for Busy South Africans
            </h2>
            <p className="text-slate-600 mt-2 text-base">
              Transparent, per-kg and per-pair pricing. No hidden fees. We treat your everyday threads and rare grails with certified specialist care.
            </p>
          </div>

          <div className="mt-4 md:mt-0 flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-500">Need it fast?</span>
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-bold border border-amber-200">
              <Zap className="w-3.5 h-3.5 text-amber-600" />
              Express Same-Day Available
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {SERVICES.map((service: ServiceItem) => {
            const Icon = getIcon(service.iconName);
            const isShoe = service.category === 'shoe_spa';

            return (
              <div
                key={service.id}
                className={`relative rounded-2xl bg-white border ${
                  service.popular ? 'border-sky-400 ring-2 ring-sky-100' : 'border-slate-200'
                } p-6 sm:p-7 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group`}
              >
                {service.popular && (
                  <span className="absolute -top-3 right-6 bg-gradient-to-r from-sky-600 to-cyan-500 text-white text-[11px] font-bold px-3 py-0.5 rounded-full shadow-sm">
                    Most Popular
                  </span>
                )}

                <div>
                  <div className="flex items-start justify-between mb-4">
                    <div
                      className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                        isShoe
                          ? 'bg-amber-50 text-amber-600 border border-amber-200'
                          : 'bg-sky-50 text-sky-600 border border-sky-200'
                      }`}
                    >
                      <Icon className="w-6 h-6" />
                    </div>

                    <div className="text-right">
                      <p className="text-2xl font-extrabold text-slate-900 font-display tabular-nums">
                        R{service.pricePerUnit}
                      </p>
                      <p className="text-xs font-medium text-slate-500">
                        per {service.unit}
                        {service.minUnit && service.minUnit > 1 ? ` (min ${service.minUnit}${service.unit})` : ''}
                      </p>
                    </div>
                  </div>

                  <h3 className="text-xl font-bold text-slate-900 mb-2 font-display">
                    {service.name}
                  </h3>
                  <p className="text-slate-600 text-sm mb-5 leading-relaxed">
                    {service.shortDesc}
                  </p>

                  <div className="space-y-2 mb-6">
                    {service.features.map((feat, fidx) => (
                      <div key={fidx} className="flex items-start gap-2 text-xs text-slate-700">
                        <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center gap-2">
                  <button
                    onClick={() => onSelectServiceForCalculator(service.id)}
                    className="flex-1 py-2 px-3 text-xs font-semibold text-slate-700 hover:text-sky-600 bg-slate-100 hover:bg-sky-50 rounded-lg transition-colors text-center"
                  >
                    Calculate Cost
                  </button>
                  <button
                    onClick={() => onOpenBookingWithService(service.id)}
                    className="py-2 px-3 text-xs font-semibold text-white bg-sky-600 hover:bg-sky-700 rounded-lg transition-colors flex items-center gap-1 shadow-sm"
                  >
                    <span>Book</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Express Callout Banner */}
        <div className="mt-12 rounded-2xl bg-gradient-to-r from-sky-900 to-slate-900 text-white p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="space-y-1 text-center md:text-left">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 text-xs font-semibold mb-2">
              <Zap className="w-3.5 h-3.5" />
              <span>Emergency Laundry &amp; Sneaker Urgent Service</span>
            </div>
            <h3 className="text-2xl font-bold font-display">
              Need It Same-Day? We've Got You Covered
            </h3>
            <p className="text-sky-200 text-sm max-w-xl">
              Book before 09:30 AM in Pietermaritzburg, and receive your clothes washed, folded, or sneakers freshened by that evening (+30% rush fee).
            </p>
          </div>

          <button
            onClick={() => onOpenBookingWithService('wash-dry')}
            className="shrink-0 px-6 py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-sm shadow-md transition-colors"
          >
            Request Express Service
          </button>
        </div>
      </div>
    </section>
  );
};
