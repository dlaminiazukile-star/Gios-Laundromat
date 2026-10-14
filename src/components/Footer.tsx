import React from 'react';
import { Sparkles, MapPin, Phone, Mail, Clock, CreditCard, Lock } from 'lucide-react';
import { BUSINESS_INFO } from '../data/servicesData';
import { GioLogo } from './GioLogo';

interface FooterProps {
  onOpenBooking: () => void;
  onOpenTracking: () => void;
  onSecretStaffTrigger?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenBooking, onOpenTracking, onSecretStaffTrigger }) => {
  return (
    <footer className="bg-slate-950 text-white border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-slate-900 border border-slate-800 p-3 rounded-2xl inline-block shadow-sm">
              <GioLogo size="sm" variant="light" />
            </div>

            <p className="text-slate-400 text-sm max-w-sm leading-relaxed">
              Clean Without Limits · We Pick Up. We Clean. We Deliver. You Relax.
              <br />
              Premium door-to-door laundry, dry cleaning, and professional shoe spa clinic based exclusively in Pietermaritzburg.
            </p>

            <div className="pt-2 text-xs text-slate-400 space-y-2">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-sky-400 shrink-0" />
                <span>Pietermaritzburg Hub: Shop 4, Victoria Centre, 170 Victoria Rd</span>
              </div>
              <div className="flex items-start gap-2">
                <Clock className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <p>Pickups: Mon – Sat 09h00–12h00 &amp; 14h00–17h00</p>
                  <p className="text-amber-300/90 font-medium">Sundays: Deliveries Only (No Pickups)</p>
                </div>
              </div>
            </div>
          </div>

          {/* Services Links */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold uppercase tracking-wider text-slate-200 font-display">
              Rate Card &amp; Rates
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <a href="#pricing-card" className="hover:text-white transition-colors">
                  Wash and Dry (R29/kg)
                </a>
              </li>
              <li>
                <a href="#pricing-card" className="hover:text-white transition-colors">
                  Wash, Dry, Iron (R37/kg)
                </a>
              </li>
              <li>
                <a href="#pricing-card" className="hover:text-white transition-colors">
                  Dry Only (R20/kg)
                </a>
              </li>
              <li>
                <a href="#pricing-card" className="hover:text-white transition-colors">
                  Shoe Spa (From only R50/pair)
                </a>
              </li>
              <li>
                <a href="#pricing-card" className="hover:text-white transition-colors">
                  Luxury King Blanket (R180)
                </a>
              </li>
              <li>
                <a href="#pricing-card" className="hover:text-white transition-colors">
                  School Blazers (R70 each)
                </a>
              </li>
              <li>
                <a href="#pricing-card" className="hover:text-white transition-colors">
                  Uniforms (R25/kg)
                </a>
              </li>
            </ul>
          </div>

          {/* Quick Actions */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold uppercase tracking-wider text-slate-200 font-display">
              Customer Hub
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <button onClick={onOpenBooking} className="hover:text-white text-left transition-colors">
                  Schedule Doorstep Pickup
                </button>
              </li>
              <li>
                <button onClick={onOpenTracking} className="hover:text-white text-left transition-colors">
                  Track Live Order Status
                </button>
              </li>
              <li>
                <a href="#calculator" className="hover:text-white transition-colors">
                  Interactive Price Calculator
                </a>
              </li>
              <li>
                <a href="#coverage" className="hover:text-white transition-colors">
                  Pietermaritzburg Suburbs Covered
                </a>
              </li>
              <li>
                <a href="#faq" className="hover:text-white transition-colors">
                  Frequently Asked Questions
                </a>
              </li>
            </ul>
          </div>

          {/* Payment & Contact */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold uppercase tracking-wider text-slate-200 font-display">
              Payment on Delivery
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              No online credit card entry needed. Pay securely when we deliver your fresh clothes at your doorstep.
            </p>
            <div className="flex items-center gap-2 pt-1 text-xs text-slate-300">
              <CreditCard className="w-4 h-4 text-lime-400 shrink-0" />
              <span>Speedpoint: Visa, Mastercard, Apple Pay, Samsung Pay &amp; Cash</span>
            </div>

            <div className="pt-2">
              <a
                href={`tel:${BUSINESS_INFO.phone}`}
                className="inline-flex items-center gap-2 text-xs font-semibold text-sky-400 hover:text-sky-300"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>{BUSINESS_INFO.phone}</span>
              </a>
            </div>
          </div>
        </div>

        {/* SEO Keywords & Quiet Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p className="flex items-center gap-2">
            <span>&copy; {new Date().getFullYear()} {BUSINESS_INFO.name}. All rights reserved. Registered in KwaZulu-Natal, South Africa.</span>
            {onSecretStaffTrigger && (
              <button
                onClick={onSecretStaffTrigger}
                title="Staff Access Gate"
                className="text-slate-800 hover:text-slate-400 transition-colors p-1 rounded focus:outline-none"
                aria-label="Staff Access"
              >
                <Lock className="w-3 h-3 opacity-60 hover:opacity-100" />
              </button>
            )}
          </p>
          <div className="flex items-center gap-3 text-[11px] text-slate-400">
            <span>laundry service Pietermaritzburg</span>
            <span>·</span>
            <span>sneaker cleaning PMB</span>
            <span>·</span>
            <span>shoe spa Pietermaritzburg</span>
            <span>·</span>
            <span>wash and fold Scottsville</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
