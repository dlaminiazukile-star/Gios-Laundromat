import React, { useState } from 'react';
import { Phone, MessageCircle, Menu, X, Sparkles, Package, ShieldCheck } from 'lucide-react';
import { BUSINESS_INFO } from '../data/servicesData';
import { GioLogo } from './GioLogo';

interface NavbarProps {
  onOpenBooking: () => void;
  onOpenTracking: () => void;
  onSecretStaffTrigger?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenBooking, onOpenTracking, onSecretStaffTrigger }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [logoClickCount, setLogoClickCount] = useState(0);

  const handleLogoClick = (e: React.MouseEvent) => {
    // If user clicks 3 times quickly, trigger secret staff modal
    const newCount = logoClickCount + 1;
    setLogoClickCount(newCount);
    if (newCount >= 3) {
      setLogoClickCount(0);
      onSecretStaffTrigger?.();
    } else {
      setTimeout(() => setLogoClickCount(0), 1200);
    }
  };

  const whatsappUrl = `https://wa.me/${BUSINESS_INFO.whatsappRaw}?text=${encodeURIComponent(
    "Hi Gio's Laundromat! I would like to schedule a laundry or sneaker spa pickup in Pietermaritzburg."
  )}`;

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      {/* Top Announcement Bar */}
      <div className="bg-[#00AEEF] text-white text-xs font-medium py-1.5 px-4 text-center flex items-center justify-center gap-3">
        <span className="flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-amber-300" />
          <span>FREE Pickup &amp; Delivery over R200 across Pietermaritzburg</span>
        </span>
        <span className="hidden sm:inline text-sky-100">|</span>
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="hidden sm:inline-flex items-center gap-1 hover:text-amber-200 transition-colors"
        >
          <MessageCircle className="w-3 h-3 text-emerald-300" />
          <span>WhatsApp: {BUSINESS_INFO.phone}</span>
        </a>
      </div>

      {/* Main Navigation: 3-Zone Contract */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Zone 1: Single brand mark */}
        <button
          onClick={handleLogoClick}
          className="flex items-center gap-2 group py-1 text-left cursor-pointer focus:outline-none"
          title="Gio's Laundromat"
        >
          <GioLogo size="sm" variant="dark" />
        </button>

        {/* Zone 2: Clean text navigation links */}
        <nav className="hidden lg:flex items-center gap-7 text-sm font-medium text-slate-600">
          <a href="#pricing-card" className="hover:text-[#00AEEF] transition-colors font-semibold text-slate-800">Rate Card</a>
          <a href="#services" className="hover:text-[#00AEEF] transition-colors">Services</a>
          <a href="#memberships" className="hover:text-[#00AEEF] transition-colors font-semibold text-sky-700 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Memberships</span>
          </a>
          <a href="#calculator" className="hover:text-[#00AEEF] transition-colors">Price Calculator</a>
          <a href="#shoe-spa" className="hover:text-[#00AEEF] transition-colors">Shoe Spa (From R50)</a>
          <a href="#how-it-works" className="hover:text-[#00AEEF] transition-colors">How It Works</a>
          <a href="#coverage" className="hover:text-[#00AEEF] transition-colors">PMB Suburbs</a>
          <a href="#faq" className="hover:text-[#00AEEF] transition-colors">FAQ</a>
        </nav>

        {/* Zone 3: Primary customer actions (Admin button completely removed from landing page) */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={onOpenTracking}
            className="flex items-center gap-1.5 px-3 py-2 text-xs sm:text-sm font-medium text-slate-700 hover:text-[#00AEEF] hover:bg-sky-50 rounded-lg transition-colors whitespace-nowrap"
          >
            <Package className="w-4 h-4 text-[#00AEEF]" />
            <span>Track Order</span>
          </button>

          <button
            onClick={onOpenBooking}
            className="px-4 py-2 text-xs sm:text-sm font-semibold text-white bg-[#00AEEF] hover:bg-sky-500 active:bg-sky-600 rounded-lg shadow-sm shadow-sky-200 transition-colors whitespace-nowrap"
          >
            Book Pickup
          </button>

          {/* Mobile hamburger button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer (Clean, no admin button) */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-slate-200 px-4 pt-2 pb-6 space-y-3">
          <div className="flex flex-col space-y-2 text-base font-medium text-slate-700">
            <a
              href="#pricing-card"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg hover:bg-sky-50 hover:text-sky-600 transition-colors"
            >
              Rate Card &amp; Specials
            </a>
            <a
              href="#services"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg hover:bg-sky-50 hover:text-sky-600 transition-colors"
            >
              Services &amp; Rates
            </a>
            <a
              href="#memberships"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg hover:bg-sky-50 hover:text-[#00AEEF] font-bold text-sky-700 flex items-center justify-between transition-colors"
            >
              <span>Clean Without Limits Memberships</span>
              <span className="text-[10px] bg-sky-100 text-[#00AEEF] px-2 py-0.5 rounded-full font-extrabold uppercase">From R299</span>
            </a>
            <a
              href="#calculator"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg hover:bg-sky-50 hover:text-sky-600 transition-colors"
            >
              Instant Price Calculator
            </a>
            <a
              href="#shoe-spa"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg hover:bg-sky-50 hover:text-sky-600 transition-colors"
            >
              Sneaker &amp; Shoe Spa
            </a>
            <a
              href="#how-it-works"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg hover:bg-sky-50 hover:text-sky-600 transition-colors"
            >
              How It Works (3 Steps)
            </a>
            <a
              href="#coverage"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg hover:bg-sky-50 hover:text-sky-600 transition-colors"
            >
              Pietermaritzburg Suburbs Covered
            </a>
            <a
              href="#faq"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg hover:bg-sky-50 hover:text-sky-600 transition-colors"
            >
              FAQ &amp; Payment Methods
            </a>
          </div>

          <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white font-medium text-sm transition-colors shadow-sm"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Chat on WhatsApp</span>
            </a>
            <a
              href={`tel:${BUSINESS_INFO.phone}`}
              className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 font-medium text-sm transition-colors"
            >
              <Phone className="w-4 h-4 text-slate-600" />
              <span>Call Us: {BUSINESS_INFO.phone}</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
};
