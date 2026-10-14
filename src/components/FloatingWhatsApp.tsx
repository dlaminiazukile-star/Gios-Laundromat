import React, { useState } from 'react';
import { MessageCircle, X, Sparkles } from 'lucide-react';
import { BUSINESS_INFO } from '../data/servicesData';

export const FloatingWhatsApp: React.FC = () => {
  const [tooltipOpen, setTooltipOpen] = useState(true);

  const whatsappUrl = `https://wa.me/${BUSINESS_INFO.whatsappRaw}?text=${encodeURIComponent(
    "Hi Gio's Laundromat! I need a laundry or sneaker spa pickup in Pietermaritzburg."
  )}`;

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-3 select-none">
      {/* Friendly Tooltip Bubble */}
      {tooltipOpen && (
        <div className="relative bg-white rounded-2xl p-3.5 shadow-2xl border border-slate-200 text-slate-800 max-w-xs animate-bounce-subtle">
          <button
            onClick={() => setTooltipOpen(false)}
            className="absolute -top-2 -right-2 w-5 h-5 bg-slate-200 text-slate-600 rounded-full flex items-center justify-center hover:bg-slate-300 transition-colors"
            aria-label="Close message"
          >
            <X className="w-3 h-3" />
          </button>
          <div className="flex items-start gap-2.5">
            <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 shrink-0 mt-0.5">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900">Need fresh clothes or clean kicks?</p>
              <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">
                Drop us a WhatsApp for quick pickup scheduling or condition quotes!
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Floating Action Button */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp"
        className="w-14 h-14 rounded-full bg-emerald-500 hover:bg-emerald-600 active:scale-95 text-white flex items-center justify-center shadow-xl shadow-emerald-500/30 transition-all group"
      >
        <MessageCircle className="w-7 h-7 text-white group-hover:scale-110 transition-transform" />
      </a>
    </div>
  );
};
