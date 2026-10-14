import React from 'react';
import { Sparkles, ArrowRight, Shirt, Bed, Briefcase, Footprints, Check } from 'lucide-react';
import { GioLogo } from './GioLogo';

interface PricingBoardProps {
  onSelectService: (serviceId: string) => void;
  onOpenBooking: () => void;
}

export const PricingBoard: React.FC<PricingBoardProps> = ({
  onSelectService,
  onOpenBooking,
}) => {
  return (
    <section id="pricing-card" className="py-16 sm:py-24 bg-gradient-to-b from-slate-900 via-sky-950 to-slate-900 text-white relative overflow-hidden border-b border-slate-800">
      {/* Decorative background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-sky-500/10 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/20 text-sky-300 text-xs font-semibold mb-3 border border-sky-400/30">
            <Sparkles className="w-3.5 h-3.5 text-sky-400" />
            <span>Official Rate Card · Pietermaritzburg</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black font-display tracking-tight text-white">
            Our Services &amp; Transparent Rates
          </h2>
          <p className="text-slate-300 mt-3 text-base">
            Clean Without Limits. Honest per-kg washing, flat-rate blanket bundles, school blazer dry cleaning, and shoe spa care from only R50.
          </p>
        </div>

        {/* Realistic Styled Flyer Board Layout */}
        <div className="max-w-4xl mx-auto bg-gradient-to-b from-[#091E42] via-[#0E3A73] to-[#0284C7] rounded-3xl overflow-hidden shadow-2xl border border-sky-500/30 p-6 sm:p-10 text-white space-y-10">
          
          {/* Header Brand Lockup */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6 border-b border-white/20 pb-8">
            <div className="bg-white px-5 py-3 rounded-2xl shadow-lg">
              <GioLogo variant="dark" size="md" />
            </div>
            <div className="text-center sm:text-right">
              <span className="text-xs font-bold uppercase tracking-widest text-sky-300">
                Doorstep Pick-Up &amp; Delivery
              </span>
              <p className="text-xl sm:text-2xl font-black font-display text-white mt-0.5">
                Pietermaritzburg Rate Card
              </p>
              <p className="text-xs text-sky-200">
                🎁 100% FREE pickup &amp; delivery for first-time customers &amp; orders over R200 · Pay on delivery
              </p>
            </div>
          </div>

          {/* Section 1: Essential Laundry (Per KG) */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center text-sky-300">
                <Shirt className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-2xl font-extrabold font-display tracking-tight text-white">
                  Essential
                </h3>
                <p className="text-xs text-sky-200">Everyday wash, dry, and ironing per kilogram</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Wash, Dry, Iron */}
              <div
                onClick={() => onSelectService('wash-dry-iron')}
                className="bg-white/10 hover:bg-white/15 backdrop-blur-md rounded-2xl p-5 border border-white/15 transition-all cursor-pointer flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-baseline justify-between mb-2">
                    <h4 className="font-bold text-white text-base">Wash, Dry, Iron</h4>
                    <span className="bg-white text-[#091E42] font-black text-sm px-3 py-1 rounded-lg tabular-nums shadow-sm">
                      R37 <span className="text-xs font-semibold">/kg</span>
                    </span>
                  </div>
                  <p className="text-xs text-slate-200 leading-relaxed">
                    Full luxury treatment: washed with eco detergents, tumble dried, and hand-pressed with steam.
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-xs text-sky-300 font-semibold group-hover:text-white transition-colors">
                  <span>Add to Order</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>

              {/* Wash and Dry */}
              <div
                onClick={() => onSelectService('wash-dry')}
                className="bg-white/10 hover:bg-white/15 backdrop-blur-md rounded-2xl p-5 border border-white/15 transition-all cursor-pointer flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-baseline justify-between mb-2">
                    <h4 className="font-bold text-white text-base">Wash and Dry</h4>
                    <span className="bg-white text-[#091E42] font-black text-sm px-3 py-1 rounded-lg tabular-nums shadow-sm">
                      R29 <span className="text-xs font-semibold">/kg</span>
                    </span>
                  </div>
                  <p className="text-xs text-slate-200 leading-relaxed">
                    Everyday load: lights and darks separated, hygienically dried, and neatly packaged.
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-xs text-sky-300 font-semibold group-hover:text-white transition-colors">
                  <span>Add to Order</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>

              {/* Dry only */}
              <div
                onClick={() => onSelectService('dry-only')}
                className="bg-white/10 hover:bg-white/15 backdrop-blur-md rounded-2xl p-5 border border-white/15 transition-all cursor-pointer flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-baseline justify-between mb-2">
                    <h4 className="font-bold text-white text-base">Dry Only</h4>
                    <span className="bg-white text-[#091E42] font-black text-sm px-3 py-1 rounded-lg tabular-nums shadow-sm">
                      R20 <span className="text-xs font-semibold">/kg</span>
                    </span>
                  </div>
                  <p className="text-xs text-slate-200 leading-relaxed">
                    High-efficiency tumble drying. Perfect when rainy weather prevents line drying.
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-xs text-sky-300 font-semibold group-hover:text-white transition-colors">
                  <span>Add to Order</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Blanket Bundles (Fixed Per Item) */}
          <div className="space-y-4 pt-4 border-t border-white/15">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center text-sky-300">
                <Bed className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-2xl font-extrabold font-display tracking-tight text-white">
                  Blanket Bundles
                </h3>
                <p className="text-xs text-sky-200">Flat rates for heavy blankets &amp; duvets washed in industrial drums</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Luxury */}
              <div
                onClick={() => onSelectService('blanket-luxury')}
                className="bg-white/10 hover:bg-white/15 rounded-2xl p-4 border border-white/15 transition-all cursor-pointer flex flex-col justify-between group"
              >
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-amber-300">King &amp; Queen</span>
                  <h4 className="font-bold text-white text-sm mt-0.5">Luxury Blanket</h4>
                  <p className="text-xs text-slate-200 mt-1">2-ply mink &amp; winter blankets fluffed &amp; sanitized.</p>
                </div>
                <div className="mt-4 flex items-center justify-between pt-2 border-t border-white/10">
                  <span className="text-xl font-black text-white tabular-nums">R180</span>
                  <span className="text-[11px] text-sky-300 font-semibold group-hover:text-white">Book →</span>
                </div>
              </div>

              {/* Snuggle */}
              <div
                onClick={() => onSelectService('blanket-snuggle')}
                className="bg-white/10 hover:bg-white/15 rounded-2xl p-4 border border-white/15 transition-all cursor-pointer flex flex-col justify-between group"
              >
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-sky-300">Double Size</span>
                  <h4 className="font-bold text-white text-sm mt-0.5">Snuggle Blanket</h4>
                  <p className="text-xs text-slate-200 mt-1">Double bed blankets, winter throws &amp; comforters.</p>
                </div>
                <div className="mt-4 flex items-center justify-between pt-2 border-t border-white/10">
                  <span className="text-xl font-black text-white tabular-nums">R150</span>
                  <span className="text-[11px] text-sky-300 font-semibold group-hover:text-white">Book →</span>
                </div>
              </div>

              {/* Cozy */}
              <div
                onClick={() => onSelectService('blanket-cozy')}
                className="bg-white/10 hover:bg-white/15 rounded-2xl p-4 border border-white/15 transition-all cursor-pointer flex flex-col justify-between group"
              >
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-sky-300">Single Size</span>
                  <h4 className="font-bold text-white text-sm mt-0.5">Cozy Blanket</h4>
                  <p className="text-xs text-slate-200 mt-1">Single bed blankets and kids warm wraps.</p>
                </div>
                <div className="mt-4 flex items-center justify-between pt-2 border-t border-white/10">
                  <span className="text-xl font-black text-white tabular-nums">R110</span>
                  <span className="text-[11px] text-sky-300 font-semibold group-hover:text-white">Book →</span>
                </div>
              </div>

              {/* Duvet */}
              <div
                onClick={() => onSelectService('blanket-duvet')}
                className="bg-white/10 hover:bg-white/15 rounded-2xl p-4 border border-white/15 transition-all cursor-pointer flex flex-col justify-between group"
              >
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-sky-300">All Sizes</span>
                  <h4 className="font-bold text-white text-sm mt-0.5">Duvet Inner</h4>
                  <p className="text-xs text-slate-200 mt-1">Feather and microfibre inners sanitized at 60°C.</p>
                </div>
                <div className="mt-4 flex items-center justify-between pt-2 border-t border-white/10">
                  <span className="text-xl font-black text-white tabular-nums">R100</span>
                  <span className="text-[11px] text-sky-300 font-semibold group-hover:text-white">Book →</span>
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: Dry Cleaning & Uniforms */}
          <div className="space-y-4 pt-4 border-t border-white/15">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center text-sky-300">
                <Briefcase className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-2xl font-extrabold font-display tracking-tight text-white">
                  Dry Cleaning &amp; Uniforms
                </h3>
                <p className="text-xs text-sky-200">School blazers, chef whites, medical lab coats, and trousers</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Blazer School */}
              <div
                onClick={() => onSelectService('dc-blazer')}
                className="bg-white/10 hover:bg-white/15 rounded-2xl p-5 border border-white/15 transition-all cursor-pointer flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-baseline justify-between mb-2">
                    <h4 className="font-bold text-white text-base">Blazer School</h4>
                    <span className="bg-white text-[#091E42] font-black text-sm px-3 py-1 rounded-lg tabular-nums shadow-sm">
                      R70 <span className="text-xs font-semibold">each</span>
                    </span>
                  </div>
                  <p className="text-xs text-slate-200 leading-relaxed">
                    Maritzburg College, Girls High, St Charles, Epworth, etc. Badge preservation and stain treatment.
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-xs text-sky-300 font-semibold group-hover:text-white transition-colors">
                  <span>Add School Blazer</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>

              {/* Trousers, uniform */}
              <div
                onClick={() => onSelectService('dc-uniform')}
                className="bg-white/10 hover:bg-white/15 rounded-2xl p-5 border border-white/15 transition-all cursor-pointer flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-baseline justify-between mb-2">
                    <h4 className="font-bold text-white text-base">Trousers, Uniform</h4>
                    <span className="bg-white text-[#091E42] font-black text-sm px-3 py-1 rounded-lg tabular-nums shadow-sm">
                      R25 <span className="text-xs font-semibold">/kg</span>
                    </span>
                  </div>
                  <p className="text-xs text-slate-200 leading-relaxed">
                    Work uniforms, corporate slacks, security wear, and school trousers hand-pressed with sharp creases.
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-xs text-sky-300 font-semibold group-hover:text-white transition-colors">
                  <span>Add Uniforms</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>

              {/* Lab coats and chef coat */}
              <div
                onClick={() => onSelectService('dc-lab-chef')}
                className="bg-white/10 hover:bg-white/15 rounded-2xl p-5 border border-white/15 transition-all cursor-pointer flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-baseline justify-between mb-2">
                    <h4 className="font-bold text-white text-base">Lab Coats &amp; Chef Coats</h4>
                    <span className="bg-white text-[#091E42] font-black text-sm px-3 py-1 rounded-lg tabular-nums shadow-sm">
                      R19 <span className="text-xs font-semibold">/kg</span>
                    </span>
                  </div>
                  <p className="text-xs text-slate-200 leading-relaxed">
                    Medical doctor/nursing coats, Grey's/Edendale hospital gear, and restaurant kitchen jackets.
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-xs text-sky-300 font-semibold group-hover:text-white transition-colors">
                  <span>Add Coats</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          </div>

          {/* Section 4: Shoe Spa (From Only R50) */}
          <div className="pt-4 border-t border-white/15 bg-white/10 rounded-3xl p-6 sm:p-8 space-y-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-white text-[#00AEEF] flex items-center justify-center font-bold shrink-0 shadow-lg">
                  <Footprints className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-300">
                    Sneaker &amp; Footwear Clinic
                  </span>
                  <h3 className="text-2xl font-black font-display text-white mt-0.5">
                    Shoe Spa · From Only <span className="text-amber-300">R50</span>
                  </h3>
                  <p className="text-xs sm:text-sm text-sky-100 mt-1 max-w-xl">
                    Hand-brushed sneaker revitalization, delicate mesh foam baths, and botanical UV deodorizing. Quick Refresh from R50, Deep Spa R90. Hand cleaned with specialized brushes—never in a machine!
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <a
                  href="#shoe-spa"
                  className="px-4 py-3 rounded-xl bg-white/15 hover:bg-white/25 text-white font-bold text-xs transition-colors"
                >
                  View Past Results
                </a>
                <button
                  onClick={onOpenBooking}
                  className="px-6 py-3.5 rounded-xl bg-white text-[#091E42] hover:bg-sky-50 font-extrabold text-sm shadow-xl transition-all flex items-center gap-2 cursor-pointer"
                >
                  <span>Book Shoe Spa</span>
                  <ArrowRight className="w-4 h-4 text-[#00AEEF]" />
                </button>
              </div>
            </div>

            {/* Real Treatment Photo Strip */}
            <div className="pt-3 border-t border-white/10">
              <div className="flex items-center justify-between mb-2.5">
                <span className="text-[11px] font-bold uppercase tracking-wider text-amber-300 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-amber-400" />
                  <span>Real Sneaker Spa Treatments Hand-Crafted in PMB:</span>
                </span>
                <a href="#shoe-spa" className="text-[11px] text-sky-200 hover:text-white underline font-semibold">
                  Inspect All 5 Patient Cases →
                </a>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
                {[
                  {
                    img: '/src/assets/images/jordan_low_restored_1791920472974.jpg',
                    title: "Air Jordan 1 Low",
                    tag: "Restored Leather"
                  },
                  {
                    img: '/src/assets/images/runner_mesh_clean_1791920473884.jpg',
                    title: "Chunky Mesh Runners",
                    tag: "Ultrasonic Foam"
                  },
                  {
                    img: '/src/assets/images/jordan_pair_tongue_1791920474499.jpg',
                    title: "Jordan Tongues & Laces",
                    tag: "Jumpman Detailing"
                  },
                  {
                    img: '/src/assets/images/hightop_red_swoosh_1791920474885.jpg',
                    title: "Vintage High-Top",
                    tag: "Deconstructed Deep"
                  },
                  {
                    img: '/src/assets/images/hightop_before_clean_1791920474171.jpg',
                    title: "Patient Intake Photo",
                    tag: "Before Treatment"
                  },
                ].map((item, i) => (
                  <a
                    key={i}
                    href="#shoe-spa"
                    className="group relative rounded-xl overflow-hidden aspect-[4/3] bg-slate-900 border border-white/20 hover:border-amber-400 transition-all block"
                  >
                    <img
                      src={item.img}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-2 text-left">
                      <span className="text-[9px] font-extrabold text-amber-300 uppercase leading-none">
                        {item.tag}
                      </span>
                      <p className="text-[10px] font-bold text-white truncate leading-tight mt-0.5">
                        {item.title}
                      </p>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
