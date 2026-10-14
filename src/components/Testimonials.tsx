import React from 'react';
import { Star, Quote, CheckCircle } from 'lucide-react';
import { TESTIMONIALS } from '../data/servicesData';

export const Testimonials: React.FC = () => {
  return (
    <section className="py-16 sm:py-24 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <p className="text-xs sm:text-sm font-bold uppercase tracking-wider text-sky-600 mb-2">
            Real Customer Stories
          </p>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-display">
            Loved Across Pietermaritzburg
          </h2>
          <p className="text-slate-600 text-base mt-2">
            See what your neighbors in Scottsville, Montrose, Chase Valley, and Hayfields say about our doorstep laundry and shoe spa.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {TESTIMONIALS.map((t) => (
            <div
              key={t.id}
              className="bg-slate-50 rounded-2xl p-6 sm:p-8 border border-slate-200 hover:border-sky-300 hover:shadow-lg transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                {/* 5-star rating */}
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(t.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                  <span className="text-xs font-bold text-slate-700 ml-2">5.0 / 5.0</span>
                </div>

                <p className="text-slate-700 text-sm leading-relaxed mb-6 italic">
                  "{t.quote}"
                </p>
              </div>

              <div className="pt-4 border-t border-slate-200/80">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 font-display flex items-center gap-1">
                      <span>{t.name}</span>
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-600 inline" />
                    </h3>
                    <p className="text-xs text-slate-500">{t.suburb}</p>
                  </div>
                  <span className="text-[11px] text-sky-700 font-medium bg-sky-50 px-2 py-0.5 rounded border border-sky-100">
                    {t.serviceUsed}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
