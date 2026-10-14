import React, { useState } from 'react';
import {
  Sparkles,
  ShieldCheck,
  Sun,
  Droplets,
  Wind,
  ArrowRight,
  CheckCircle2,
  ZoomIn,
  X,
  Layers,
  ChevronRight,
  Eye,
} from 'lucide-react';

interface ShoeSpaGalleryProps {
  onBookShoeSpa: () => void;
}

interface PastTreatmentPhoto {
  id: string;
  image: string;
  title: string;
  subtitle: string;
  description: string;
  treatmentType: 'R50 Quick Refresh' | 'R90 Deep Restoration' | 'Condition Intake';
  tag: string;
  badgeColor: string;
  details: string[];
}

export const ShoeSpaGallery: React.FC<ShoeSpaGalleryProps> = ({ onBookShoeSpa }) => {
  const [sliderPos, setSliderPos] = useState<number>(50);
  const [activeCase, setActiveCase] = useState<'hightop' | 'jordan'>('hightop');
  const [lightboxPhoto, setLightboxPhoto] = useState<PastTreatmentPhoto | null>(null);

  // Before / After slider cases
  const sliderCases = {
    hightop: {
      name: 'Vintage High-Top Blazer Mid (Red Swoosh)',
      category: 'R90 Deep Restoration Treatment',
      beforeImage: '/src/assets/images/hightop_before_clean_1791920474171.jpg',
      afterImage: '/src/assets/images/hightop_red_swoosh_1791920474885.jpg',
      beforeLabel: 'BEFORE · Heavy Soil, Muddy Toes & Oxidized Collar',
      afterLabel: 'AFTER · Complete Deconstruct Cleanse & Supple Leather',
      summary:
        'Patient presented with ground-in mud on toe-box, stained grey laces, and darkened ankle padding. Underwent foaming enzyme bath, nylon canvas deep scrub, and red leather swoosh conditioning.',
    },
    jordan: {
      name: 'Air Jordan 1 Low (Wolf Grey & White)',
      category: 'R90 Deep Restoration Treatment',
      beforeImage: '/src/assets/images/sneaker_dirty_before_1791137049111.jpg',
      afterImage: '/src/assets/images/jordan_low_restored_1791920472974.jpg',
      beforeLabel: 'BEFORE · Road Dust, Scuffed Midsole & Dull Leather',
      afterLabel: 'AFTER · Crisp Factory White Midsole & Restored Laces',
      summary:
        'Wolf Grey leather treated with pH-balanced foam, sole oxidation treatment, and factory-style flat lace rewiring with botanical insole deodorizing.',
    },
  };

  // Real Past Treatments Gallery from user photos
  const pastTreatments: PastTreatmentPhoto[] = [
    {
      id: 'jordan-side',
      image: '/src/assets/images/jordan_low_restored_1791920472974.jpg',
      title: "Air Jordan 1 Low 'Wolf Grey'",
      subtitle: 'Side Profile Restoration',
      description:
        'Restored Wolf Grey leather panels, gleaming white midsole, pristine translucent sole edges, and hand-washed pure white flat laces.',
      treatmentType: 'R90 Deep Restoration',
      tag: 'Restored & Protected',
      badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-400/40',
      details: [
        'Gentle leather brush & deep dirt extraction',
        'Midsole whitening with oxidation reversal',
        'Lace detangle & optical brightener soak',
        'Repel water-resistant nano barrier applied',
      ],
    },
    {
      id: 'retro-runners',
      image: '/src/assets/images/runner_mesh_clean_1791920473884.jpg',
      title: 'Chunky Retro Athletic Mesh Runners',
      subtitle: 'Mesh Foam Purge & Collar Sanitization',
      description:
        'Intricate dual-layer white mesh completely purged of embedded red soil and street grit; chunky foam midsoles restored to bright white.',
      treatmentType: 'R50 Quick Refresh',
      tag: 'Deep Foam Cleansed',
      badgeColor: 'bg-sky-500/20 text-sky-300 border-sky-400/40',
      details: [
        'Ultrasonic breathable mesh scrubbing',
        'Silver metallic accents hand-buffed',
        'Chunky midsole pressure foam wipe',
        'Interior collar bacteria extraction',
      ],
    },
    {
      id: 'jordan-tongue',
      image: '/src/assets/images/jordan_pair_tongue_1791920474499.jpg',
      title: 'Air Jordan 1 Low Tongue & Toe Symmetry',
      subtitle: 'Top-Down Jumpman Detailing',
      description:
        'Pristine embroidered silver Jumpman tongue emblems, perforated toe ventilation holes cleared of debris, and fresh lace symmetrical alignment.',
      treatmentType: 'R90 Deep Restoration',
      tag: 'Pristine Detailing',
      badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-400/40',
      details: [
        'Jumpman nylon tongue foam purge',
        'Toe-box micro-perforation clearing',
        'Lace relacing & symmetry alignment',
        'Botanical UV-C antimicrobial sanitization',
      ],
    },
    {
      id: 'hightop-after',
      image: '/src/assets/images/hightop_red_swoosh_1791920474885.jpg',
      title: 'Vintage High-Top Blazer Mid (Red Swoosh)',
      subtitle: 'Deconstructed Deep Restoration Result',
      description:
        'Full eyelet and collar deconstruction. The bold red Nike Swoosh gleams against supple bright white leather with clean vintage canvas tongue.',
      treatmentType: 'R90 Deep Restoration',
      tag: 'Complete Revival',
      badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-400/40',
      details: [
        'Complete unlacing & tongue extraction wash',
        'Vintage leather conditioning & buffing',
        'Red swoosh color preservation treatment',
        'Heel collar foam dust & sweat removal',
      ],
    },
    {
      id: 'hightop-before',
      image: '/src/assets/images/hightop_before_clean_1791920474171.jpg',
      title: 'High-Top Patient Intake (Initial Condition)',
      subtitle: 'Before Heavy Grime Extraction',
      description:
        'Documented intake photo showing severe mud encrustation, blackened laces, and yellowed collars before our multi-stage restoration protocol.',
      treatmentType: 'Condition Intake',
      tag: 'Before Treatment',
      badgeColor: 'bg-rose-500/20 text-rose-300 border-rose-400/40',
      details: [
        'Severe toe-box mud encrustation',
        'Heavily oxidized & darkened laces',
        'Discolored ankle collar padding',
        'Ground-in PMB red clay and road grit',
      ],
    },
  ];

  const currentCase = sliderCases[activeCase];

  return (
    <section id="shoe-spa" className="py-16 sm:py-24 bg-slate-900 text-white border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-500/20 text-sky-300 text-xs font-semibold mb-3 border border-sky-400/30">
            <Sparkles className="w-3.5 h-3.5 text-sky-400" />
            <span>Sneaker &amp; Footwear Clinic · Pietermaritzburg</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-display tracking-tight text-white">
            The Shoe Spa: Real Past Treatments &amp; Results
          </h2>
          <p className="text-slate-300 mt-3 text-base sm:text-lg">
            Don't throw away dirty or yellowed kicks. Browse actual client sneakers treated at our PMB lab—hand cleaned by certified shoe craftsmen, never put in washing machines.
          </p>
        </div>

        {/* ======================================================== */}
        {/* INTERACTIVE BEFORE & AFTER SLIDER                        */}
        {/* ======================================================== */}
        <div className="max-w-4xl mx-auto space-y-4">
          {/* Case Switcher Tabs */}
          <div className="flex items-center justify-center gap-2 sm:gap-3 flex-wrap">
            <span className="text-xs font-bold text-slate-400 mr-1">Case Study:</span>
            <button
              onClick={() => {
                setActiveCase('hightop');
                setSliderPos(50);
              }}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-2 ${
                activeCase === 'hightop'
                  ? 'bg-[#00AEEF] text-slate-950 shadow-md shadow-sky-500/20'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700'
              }`}
            >
              <span>Nike High-Top (Red Swoosh)</span>
              <span className="text-[10px] bg-slate-950/40 text-current px-1.5 py-0.5 rounded">R90</span>
            </button>
            <button
              onClick={() => {
                setActiveCase('jordan');
                setSliderPos(50);
              }}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-2 ${
                activeCase === 'jordan'
                  ? 'bg-[#00AEEF] text-slate-950 shadow-md shadow-sky-500/20'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700'
              }`}
            >
              <span>Air Jordan 1 Low (Wolf Grey)</span>
              <span className="text-[10px] bg-slate-950/40 text-current px-1.5 py-0.5 rounded">R90</span>
            </button>
          </div>

          {/* Slider Container */}
          <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-slate-700 select-none bg-slate-950 aspect-[4/3] sm:aspect-[16/10]">
            {/* AFTER Image (Full background) */}
            <img
              src={currentCase.afterImage}
              alt={currentCase.afterLabel}
              className="absolute inset-0 w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="absolute top-4 right-4 bg-emerald-600/90 text-white text-xs font-bold px-3 py-1.5 rounded-full backdrop-blur-sm shadow-md border border-emerald-400/40 flex items-center gap-1.5 z-10">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-200" />
              <span>{currentCase.afterLabel}</span>
            </div>

            {/* BEFORE Image (Clipped by slider width) */}
            <div
              className="absolute inset-y-0 left-0 overflow-hidden"
              style={{ width: `${sliderPos}%` }}
            >
              <img
                src={currentCase.beforeImage}
                alt={currentCase.beforeLabel}
                className="absolute inset-0 w-full h-full object-cover max-w-none"
                style={{ width: '100%', minWidth: '100%' }}
                referrerPolicy="no-referrer"
              />
              <div className="absolute top-4 left-4 bg-slate-900/90 text-amber-300 text-xs font-bold px-3 py-1.5 rounded-full backdrop-blur-sm border border-amber-400/40 shadow-md z-10">
                {currentCase.beforeLabel}
              </div>
            </div>

            {/* Slider Divider Line */}
            <div
              className="absolute inset-y-0 w-1 bg-white cursor-ew-resize shadow-2xl z-20 flex items-center justify-center"
              style={{ left: `calc(${sliderPos}% - 2px)` }}
            >
              <div className="w-10 h-10 rounded-full bg-white text-slate-950 flex items-center justify-center shadow-2xl border-2 border-[#00AEEF] font-black text-sm select-none">
                ↔
              </div>
            </div>

            {/* Transparent Drag Input */}
            <input
              type="range"
              min="0"
              max="100"
              value={sliderPos}
              onChange={(e) => setSliderPos(Number(e.target.value))}
              aria-label="Drag to compare before and after sneaker treatment"
              className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize z-30"
            />

            {/* Bottom Hint Ribbon */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-slate-950/85 backdrop-blur-md px-4 py-1.5 rounded-full text-xs font-medium text-slate-200 border border-slate-700 pointer-events-none flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#00AEEF] animate-pulse" />
              <span>Drag slider left or right to inspect the restoration difference</span>
            </div>
          </div>

          {/* Transformation Narrative Card */}
          <div className="bg-slate-800/90 rounded-2xl p-4 sm:p-5 border border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <h4 className="font-bold text-white text-base font-display">{currentCase.name}</h4>
                <span className="text-[10px] font-black text-[#00AEEF] bg-sky-950/60 border border-sky-400/30 px-2 py-0.5 rounded-full">
                  {currentCase.category}
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed max-w-2xl">
                {currentCase.summary}
              </p>
            </div>
            <button
              onClick={onBookShoeSpa}
              className="shrink-0 px-4 py-2.5 rounded-xl bg-[#00AEEF] hover:bg-sky-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-md transition-colors cursor-pointer"
            >
              <span>Book This Service</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* ======================================================== */}
        {/* REAL PAST SNEAKER SPA TREATMENTS GALLERY GRID            */}
        {/* ======================================================== */}
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 border-b border-slate-800 pb-4">
            <div>
              <div className="inline-flex items-center gap-1 text-xs font-bold text-[#00AEEF] uppercase tracking-wider">
                <Layers className="w-3.5 h-3.5" />
                <span>Patient Archive</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-white font-display mt-0.5">
                Past Sneaker Spa Transformations
              </h3>
              <p className="text-xs sm:text-sm text-slate-400 mt-1">
                Click any treatment below to inspect high-resolution details and craftsmanship protocols
              </p>
            </div>
            <span className="text-xs text-slate-400">
              Showing 5 documented client restorations
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {pastTreatments.map((photo) => (
              <div
                key={photo.id}
                onClick={() => setLightboxPhoto(photo)}
                className="group bg-slate-800/90 rounded-2xl overflow-hidden border border-slate-700/80 hover:border-[#00AEEF] transition-all duration-300 flex flex-col justify-between cursor-pointer shadow-lg hover:shadow-sky-500/10"
              >
                {/* Photo with Overlay */}
                <div className="relative aspect-[4/3] bg-slate-950 overflow-hidden">
                  <img
                    src={photo.image}
                    alt={photo.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                  {/* Status Badge */}
                  <div className="absolute top-3 left-3">
                    <span
                      className={`inline-flex items-center gap-1 text-[11px] font-extrabold px-2.5 py-1 rounded-full border backdrop-blur-md shadow-md ${photo.badgeColor}`}
                    >
                      <span>{photo.tag}</span>
                    </span>
                  </div>

                  {/* Tier Pill */}
                  <div className="absolute top-3 right-3">
                    <span className="text-[10px] font-bold bg-slate-950/80 text-white px-2 py-1 rounded-md border border-slate-700 backdrop-blur-sm">
                      {photo.treatmentType}
                    </span>
                  </div>

                  {/* Hover Inspect Cue */}
                  <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 text-white font-bold text-xs backdrop-blur-[2px]">
                    <ZoomIn className="w-5 h-5 text-[#00AEEF]" />
                    <span>Click to Inspect Detailing</span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-sky-400">
                      {photo.subtitle}
                    </span>
                    <h4 className="text-base font-bold text-white font-display mt-0.5 group-hover:text-[#00AEEF] transition-colors">
                      {photo.title}
                    </h4>
                    <p className="text-xs text-slate-300 mt-1.5 leading-relaxed line-clamp-2">
                      {photo.description}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-700/80 flex items-center justify-between text-xs">
                    <span className="text-slate-400 text-[11px]">Hand-detailed in PMB</span>
                    <span className="text-[#00AEEF] font-bold flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                      <span>View Breakdown</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ======================================================== */}
        {/* SNEAKER SPA PACKAGES & PRICING CALLOUT                   */}
        {/* ======================================================== */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-800/60 rounded-3xl p-6 sm:p-8 border border-slate-700">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 text-xs font-black uppercase text-amber-300">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Transparent Service Menu</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-black text-white font-display">
              Two Specialized Sneaker Spa Tiers
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Every single pair is hand-washed with premium bristle brushes matching the material: soft horsehair for delicate mesh, stiff hog hair for rubber soles, and microfiber cloth for smooth leather.
            </p>
            <div className="flex items-center gap-2 pt-2">
              <span className="text-xs font-semibold text-emerald-400">✓ Free pickup on orders over R200</span>
              <span className="text-slate-500">·</span>
              <span className="text-xs font-semibold text-emerald-400">✓ First-Time Customers Get 100% Free Doorstep Delivery</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* R50 Card */}
            <div className="bg-slate-900/90 rounded-2xl p-5 border border-slate-700 flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-sky-400">
                  Tier 1
                </span>
                <h4 className="font-bold text-white text-base font-display mt-0.5">
                  Shoe Spa Quick Refresh
                </h4>
                <div className="flex items-baseline gap-1 mt-2 mb-3">
                  <span className="text-3xl font-black text-white font-display">R50</span>
                  <span className="text-xs text-slate-400">/ pair</span>
                </div>
                <ul className="text-xs text-slate-300 space-y-1.5">
                  <li className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>Exterior uppers foam scrub</span>
                  </li>
                  <li className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>Midsole dirt &amp; mud wipe</span>
                  </li>
                  <li className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>Lace cleansing &amp; untangle</span>
                  </li>
                  <li className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>Deodorizing botanical spray</span>
                  </li>
                </ul>
              </div>
              <button
                onClick={onBookShoeSpa}
                className="mt-5 w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs border border-slate-600 transition-colors cursor-pointer"
              >
                Book R50 Refresh
              </button>
            </div>

            {/* R90 Card */}
            <div className="bg-gradient-to-b from-sky-950/80 to-slate-900 rounded-2xl p-5 border-2 border-[#00AEEF] flex flex-col justify-between shadow-lg shadow-sky-500/10">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase tracking-wider text-[#00AEEF]">
                    Tier 2 · Most Popular
                  </span>
                  <span className="bg-[#00AEEF] text-slate-950 text-[9px] font-black px-1.5 py-0.5 rounded">
                    FULL SPA
                  </span>
                </div>
                <h4 className="font-bold text-white text-base font-display mt-0.5">
                  Shoe Spa Deep Restoration
                </h4>
                <div className="flex items-baseline gap-1 mt-2 mb-3">
                  <span className="text-3xl font-black text-[#00AEEF] font-display">R90</span>
                  <span className="text-xs text-slate-400">/ pair</span>
                </div>
                <ul className="text-xs text-slate-200 space-y-1.5">
                  <li className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#00AEEF] shrink-0" />
                    <span>Complete unlaced deconstruction</span>
                  </li>
                  <li className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#00AEEF] shrink-0" />
                    <span>Sole de-yellowing &amp; whitening</span>
                  </li>
                  <li className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#00AEEF] shrink-0" />
                    <span>Insole bacteria extraction</span>
                  </li>
                  <li className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#00AEEF] shrink-0" />
                    <span>UV antimicrobial chamber bath</span>
                  </li>
                </ul>
              </div>
              <button
                onClick={onBookShoeSpa}
                className="mt-5 w-full py-2.5 rounded-xl bg-[#00AEEF] hover:bg-sky-400 text-slate-950 font-black text-xs shadow-md transition-colors cursor-pointer"
              >
                Book R90 Deep Spa
              </button>
            </div>
          </div>
        </div>

        {/* Global CTA */}
        <div className="text-center pt-4">
          <button
            onClick={onBookShoeSpa}
            className="inline-flex items-center gap-2.5 px-8 py-4 rounded-2xl bg-[#00AEEF] hover:bg-sky-400 text-slate-950 font-black text-sm sm:text-base shadow-xl shadow-sky-500/25 transition-all duration-200 hover:scale-[1.02] cursor-pointer"
          >
            <span>Book Your Sneaker Spa Treatment (From R50)</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* ======================================================== */}
      {/* LIGHTBOX MODAL: FULL PHOTO INSPECTION & DETAILS          */}
      {/* ======================================================== */}
      {lightboxPhoto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
          <div className="relative max-w-3xl w-full bg-slate-900 rounded-3xl overflow-hidden shadow-2xl border border-slate-700 my-8 text-white">
            {/* Header */}
            <div className="flex items-center justify-between p-4 sm:p-5 border-b border-slate-800 bg-slate-950/70">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#00AEEF]" />
                <span className="text-sm font-bold font-display text-white">
                  Past Sneaker Spa Treatment Inspection
                </span>
              </div>
              <button
                onClick={() => setLightboxPhoto(null)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Photo View */}
            <div className="relative aspect-[4/3] sm:aspect-[16/10] bg-black">
              <img
                src={lightboxPhoto.image}
                alt={lightboxPhoto.title}
                className="w-full h-full object-contain"
                referrerPolicy="no-referrer"
              />
              <div className="absolute top-4 left-4">
                <span
                  className={`inline-flex items-center gap-1 text-xs font-bold px-3 py-1 rounded-full border backdrop-blur-md ${lightboxPhoto.badgeColor}`}
                >
                  {lightboxPhoto.tag}
                </span>
              </div>
            </div>

            {/* Treatment Breakdown */}
            <div className="p-6 space-y-4 bg-slate-900">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
                <div>
                  <span className="text-xs font-bold text-[#00AEEF] uppercase tracking-wider">
                    {lightboxPhoto.subtitle}
                  </span>
                  <h3 className="text-xl font-bold font-display text-white mt-0.5">
                    {lightboxPhoto.title}
                  </h3>
                </div>
                <span className="px-3 py-1 rounded-full bg-sky-950 text-sky-300 border border-sky-400/30 text-xs font-bold w-fit">
                  {lightboxPhoto.treatmentType}
                </span>
              </div>

              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                {lightboxPhoto.description}
              </p>

              {/* Protocol Checklist */}
              <div className="bg-slate-950/60 rounded-2xl p-4 border border-slate-800">
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2.5">
                  Applied Craftsman Protocol:
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-300">
                  {lightboxPhoto.details.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  onClick={() => setLightboxPhoto(null)}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs transition-colors cursor-pointer"
                >
                  Close Inspection
                </button>
                <button
                  onClick={() => {
                    setLightboxPhoto(null);
                    onBookShoeSpa();
                  }}
                  className="px-5 py-2.5 rounded-xl bg-[#00AEEF] hover:bg-sky-400 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-md transition-colors cursor-pointer"
                >
                  <span>Book Sneaker Spa</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
