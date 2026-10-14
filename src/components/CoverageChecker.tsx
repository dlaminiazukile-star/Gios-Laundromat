import React, { useState } from 'react';
import { MapPin, Search, CheckCircle2, Clock, Sparkles } from 'lucide-react';
import { SUBURBS_COVERAGE, BUSINESS_INFO } from '../data/servicesData';

export const CoverageChecker: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredSuburbs = SUBURBS_COVERAGE.filter((sub) => {
    return (
      sub.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sub.postalCode.includes(searchTerm)
    );
  });

  return (
    <section id="coverage" className="py-16 sm:py-24 bg-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-100 text-sky-800 text-xs font-semibold mb-2">
            <MapPin className="w-3.5 h-3.5 text-sky-600" />
            <span>Pietermaritzburg Service Coverage</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-display">
            Covering Greater Pietermaritzburg
          </h2>
          <p className="text-slate-600 text-base mt-2">
            Check your suburb below for scheduled doorstep pickup days and delivery turnaround. Pickups operate Monday to Saturday (09h00–12h00 &amp; 14h00–17h00), with Sundays reserved for deliveries only. 100% FREE pickup &amp; delivery for all first-time customers and all orders over R200 across PMB.
          </p>
        </div>

        {/* Filter bar */}
        <div className="max-w-2xl mx-auto mb-8 flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search your PMB suburb (e.g. Scottsville, Hilton, Montrose, Hayfields)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-300 rounded-xl text-sm focus:border-sky-500 focus:ring-2 focus:ring-sky-100 text-slate-800"
            />
          </div>

          <div className="bg-sky-50 text-sky-800 border border-sky-200 px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap">
            {filteredSuburbs.length} PMB Suburbs Covered
          </div>
        </div>

        {/* Suburbs Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredSuburbs.map((sub, idx) => (
            <div
              key={idx}
              className="bg-white p-4 rounded-xl border border-slate-200 hover:border-sky-300 hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between">
                  <h3 className="font-bold text-slate-900 text-sm">{sub.name}</h3>
                  <span className="text-[11px] font-mono font-medium text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                    {sub.postalCode}
                  </span>
                </div>
                <p className="text-xs text-sky-700 font-medium mt-0.5">
                  {sub.city} Region
                </p>
              </div>

              <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-500 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  <span>{sub.turnaroundHours}</span>
                </span>
                <span className="text-emerald-700 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Free &gt; R200</span>
                </span>
              </div>
            </div>
          ))}
        </div>

        {filteredSuburbs.length === 0 && (
          <div className="text-center py-8 text-slate-500 text-sm">
            Don't see your suburb? WhatsApp us directly at{' '}
            <a
              href={`https://wa.me/${BUSINESS_INFO.whatsappRaw}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sky-600 font-bold underline"
            >
              {BUSINESS_INFO.phone}
            </a>{' '}
            and we'll arrange a custom pickup route!
          </div>
        )}
      </div>
    </section>
  );
};
