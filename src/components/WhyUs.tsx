import React from 'react';
import { Clock, ShieldCheck, Sparkles, Scale, HeartHandshake, CheckCircle2 } from 'lucide-react';

export const WhyUs: React.FC = () => {
  const points = [
    {
      title: 'Always On-Time Doorstep Pickups',
      description: 'We respect your day. Live SMS/WhatsApp alerts when your courier is 10 minutes away, with flexible morning to evening slots.',
      icon: Clock,
      color: 'bg-sky-100 text-sky-700',
    },
    {
      title: 'Affordable & Honest Per-KG Rates',
      description: 'No guessing basket sizes. We weigh your laundry right in front of you on certified mobile digital scales. Wash & dry from only R29/kg; wash, dry, iron R37/kg.',
      icon: Scale,
      color: 'bg-emerald-100 text-emerald-700',
    },
    {
      title: 'Certified Shoe Spa Technicians',
      description: 'Sneaker collectors and leather specialists hand-clean every sole and stitch. No machine shortcuts that ruin glue and shape.',
      icon: ShieldCheck,
      color: 'bg-amber-100 text-amber-700',
    },
    {
      title: 'Eco-Friendly, Hypoallergenic Formula',
      description: 'Phosphate-free biodegradable detergents that keep linens fluffy, skin happy, and local PMB waterways clean.',
      icon: Sparkles,
      color: 'bg-cyan-100 text-cyan-700',
    },
    {
      title: 'We Handle Everything. You Relax.',
      description: 'From your doorstep hamper into protective bio-bags, washed, folded, and returned crisp. Spend your weekend doing what you love.',
      icon: HeartHandshake,
      color: 'bg-purple-100 text-purple-700',
    },
  ];

  return (
    <section className="py-16 sm:py-24 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Visual Asset */}
          <div className="lg:col-span-5 relative order-2 lg:order-1">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-slate-200 bg-slate-100">
              <img
                src="/src/assets/images/delivery_service_van_1791137038486.jpg"
                alt="Gio's Laundromat delivery driver bringing clean laundry and sneakers to a home in Pietermaritzburg"
                className="w-full h-80 sm:h-96 object-cover"
                referrerPolicy="no-referrer"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent flex items-end p-6">
                <div className="text-white space-y-1">
                  <p className="text-xs font-bold text-lime-400 uppercase tracking-wider">
                    Local Pietermaritzburg Team
                  </p>
                  <p className="text-sm font-semibold">
                    Proudly serving Pietermaritzburg with reliable daily routes.
                  </p>
                </div>
              </div>
            </div>

            {/* Float Metric Card */}
            <div className="hidden sm:flex absolute -bottom-6 -right-6 bg-white rounded-2xl p-4 border border-slate-200 shadow-xl items-center gap-3 max-w-xs">
              <div className="w-10 h-10 rounded-xl bg-lime-100 text-lime-800 flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-900">Over 14,000+ Clean KGs</p>
                <p className="text-[11px] text-slate-500">Delivered across PMB with 5-star smiles</p>
              </div>
            </div>
          </div>

          {/* Right Column: Copy & Value Props */}
          <div className="lg:col-span-7 space-y-6 order-1 lg:order-2">
            <div>
              <span className="text-xs sm:text-sm font-bold uppercase tracking-wider text-sky-600">
                The Fresh &amp; Fly Promise
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-display mt-1">
                Why Thousands in Pietermaritzburg Trust Us
              </h2>
              <p className="text-slate-600 text-base mt-2">
                We're not an anonymous app; we're your friendly neighborhood laundry crew who treats your clothes and sneakers like our own.
              </p>
            </div>

            <div className="space-y-4 pt-2">
              {points.map((pt, idx) => {
                const Icon = pt.icon;
                return (
                  <div key={idx} className="flex items-start gap-3.5">
                    <div className={`w-9 h-9 rounded-xl ${pt.color} flex items-center justify-center shrink-0 mt-0.5`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-sm sm:text-base font-bold text-slate-900 font-display">
                        {pt.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mt-0.5">
                        {pt.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
