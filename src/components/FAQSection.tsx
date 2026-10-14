import React, { useState } from 'react';
import { ChevronDown, HelpCircle, MessageCircle } from 'lucide-react';
import { FAQS, BUSINESS_INFO } from '../data/servicesData';

export const FAQSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  const whatsappUrl = `https://wa.me/${BUSINESS_INFO.whatsappRaw}?text=${encodeURIComponent(
    "Hi Gio's Laundromat, I have a question about your laundry and shoe cleaning services."
  )}`;

  return (
    <section id="faq" className="py-16 sm:py-24 bg-slate-50 border-b border-slate-200">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-100 text-sky-800 text-xs font-semibold mb-2">
            <HelpCircle className="w-3.5 h-3.5 text-sky-600" />
            <span>Got Questions?</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-display">
            Frequently Asked Questions
          </h2>
          <p className="text-slate-600 text-sm mt-2">
            Everything you need to know about our doorstep laundry service and sneaker spa.
          </p>
        </div>

        <div className="space-y-3">
          {FAQS.map((faq, idx) => {
            const isOpen = openIndex === idx;

            return (
              <div
                key={idx}
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm transition-colors"
              >
                <button
                  type="button"
                  onClick={() => toggle(idx)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 font-semibold text-slate-900 hover:text-sky-600 transition-colors"
                >
                  <span className="text-sm sm:text-base font-display">{faq.q}</span>
                  <ChevronDown
                    className={`w-5 h-5 text-slate-400 transition-transform duration-200 shrink-0 ${
                      isOpen ? 'rotate-180 text-sky-600' : ''
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 bg-sky-50/30">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* WhatsApp help banner */}
        <div className="mt-12 bg-white rounded-2xl p-6 border border-slate-200 text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
          <div>
            <h3 className="text-base font-bold text-slate-900 font-display">
              Have a special garment or question not answered here?
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Our Pietermaritzburg team is active on WhatsApp 7 days a week.
            </p>
          </div>

          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-semibold text-xs sm:text-sm shadow-sm transition-colors whitespace-nowrap"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Chat on WhatsApp</span>
          </a>
        </div>
      </div>
    </section>
  );
};
