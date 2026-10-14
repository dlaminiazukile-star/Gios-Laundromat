import React, { useState, useId } from 'react';
import { Calculator, ArrowRight, RefreshCw, Zap, ShieldCheck, Sparkles } from 'lucide-react';
import { BUSINESS_INFO } from '../data/servicesData';
import { OrderItem } from '../types';

interface PriceCalculatorProps {
  onLoadIntoBooking: (items: OrderItem[], isExpress: boolean) => void;
}

export const PriceCalculator: React.FC<PriceCalculatorProps> = ({
  onLoadIntoBooking,
}) => {
  const washDryIronId = useId();
  const washDryId = useId();
  const dryOnlyId = useId();
  const uniformsId = useId();

  // Essential Laundry (kg)
  const [washDryIronKg, setWashDryIronKg] = useState<number>(0);
  const [washDryKg, setWashDryKg] = useState<number>(5);
  const [dryOnlyKg, setDryOnlyKg] = useState<number>(0);

  // Blanket Bundles (count)
  const [blanketLuxuryCount, setBlanketLuxuryCount] = useState<number>(0); // R180
  const [blanketSnuggleCount, setBlanketSnuggleCount] = useState<number>(0); // R150
  const [blanketCozyCount, setBlanketCozyCount] = useState<number>(0); // R110
  const [duvetCount, setDuvetCount] = useState<number>(0); // R100

  // Dry Cleaning & Uniforms
  const [schoolBlazersCount, setSchoolBlazersCount] = useState<number>(0); // R70
  const [uniformsKg, setUniformsKg] = useState<number>(0); // R25
  const [labChefKg, setLabChefKg] = useState<number>(0); // R19

  // Shoe Spa
  const [shoeRefreshPairs, setShoeRefreshPairs] = useState<number>(1); // R50
  const [shoeDeepPairs, setShoeDeepPairs] = useState<number>(0); // R90

  const [isExpress, setIsExpress] = useState<boolean>(false);
  const [isFirstTimeCustomer, setIsFirstTimeCustomer] = useState<boolean>(true);

  // Exact flyer rates
  const RATE_WASH_DRY_IRON = 37;
  const RATE_WASH_DRY = 29;
  const RATE_DRY_ONLY = 20;

  const RATE_BLANKET_LUXURY = 180;
  const RATE_BLANKET_SNUGGLE = 150;
  const RATE_BLANKET_COZY = 110;
  const RATE_DUVET = 100;

  const RATE_SCHOOL_BLAZER = 70;
  const RATE_UNIFORMS = 25;
  const RATE_LAB_CHEF = 19;

  const RATE_SHOE_REFRESH = 50;
  const RATE_SHOE_DEEP = 90;

  // Costs
  const costWashDryIron = washDryIronKg * RATE_WASH_DRY_IRON;
  const costWashDry = washDryKg * RATE_WASH_DRY;
  const costDryOnly = dryOnlyKg * RATE_DRY_ONLY;

  const costBlanketLuxury = blanketLuxuryCount * RATE_BLANKET_LUXURY;
  const costBlanketSnuggle = blanketSnuggleCount * RATE_BLANKET_SNUGGLE;
  const costBlanketCozy = blanketCozyCount * RATE_BLANKET_COZY;
  const costDuvet = duvetCount * RATE_DUVET;

  const costSchoolBlazers = schoolBlazersCount * RATE_SCHOOL_BLAZER;
  const costUniforms = uniformsKg * RATE_UNIFORMS;
  const costLabChef = labChefKg * RATE_LAB_CHEF;

  const costShoeRefresh = shoeRefreshPairs * RATE_SHOE_REFRESH;
  const costShoeDeep = shoeDeepPairs * RATE_SHOE_DEEP;

  const subtotal =
    costWashDryIron +
    costWashDry +
    costDryOnly +
    costBlanketLuxury +
    costBlanketSnuggle +
    costBlanketCozy +
    costDuvet +
    costSchoolBlazers +
    costUniforms +
    costLabChef +
    costShoeRefresh +
    costShoeDeep;

  const expressFee = isExpress && subtotal > 0 ? Math.round(subtotal * 0.3) : 0;
  const isFreeDelivery =
    isFirstTimeCustomer ||
    subtotal >= BUSINESS_INFO.freeDeliveryThreshold ||
    subtotal === 0;
  const deliveryFee = isFreeDelivery ? 0 : BUSINESS_INFO.standardDeliveryFee;
  const total = subtotal + expressFee + deliveryFee;

  const handleApplyToBooking = () => {
    const selectedItems: OrderItem[] = [];

    if (washDryIronKg > 0) {
      selectedItems.push({
        serviceId: 'wash-dry-iron',
        serviceName: 'Wash, Dry, Iron',
        quantity: washDryIronKg,
        unitPrice: RATE_WASH_DRY_IRON,
        unit: 'kg',
        total: costWashDryIron,
      });
    }
    if (washDryKg > 0) {
      selectedItems.push({
        serviceId: 'wash-dry',
        serviceName: 'Wash and Dry',
        quantity: washDryKg,
        unitPrice: RATE_WASH_DRY,
        unit: 'kg',
        total: costWashDry,
      });
    }
    if (dryOnlyKg > 0) {
      selectedItems.push({
        serviceId: 'dry-only',
        serviceName: 'Dry Only',
        quantity: dryOnlyKg,
        unitPrice: RATE_DRY_ONLY,
        unit: 'kg',
        total: costDryOnly,
      });
    }
    if (blanketLuxuryCount > 0) {
      selectedItems.push({
        serviceId: 'blanket-luxury',
        serviceName: 'Luxury Blanket – King & Queen',
        quantity: blanketLuxuryCount,
        unitPrice: RATE_BLANKET_LUXURY,
        unit: 'blanket',
        total: costBlanketLuxury,
      });
    }
    if (blanketSnuggleCount > 0) {
      selectedItems.push({
        serviceId: 'blanket-snuggle',
        serviceName: 'Snuggle Blanket – Double',
        quantity: blanketSnuggleCount,
        unitPrice: RATE_BLANKET_SNUGGLE,
        unit: 'blanket',
        total: costBlanketSnuggle,
      });
    }
    if (blanketCozyCount > 0) {
      selectedItems.push({
        serviceId: 'blanket-cozy',
        serviceName: 'Cozy Blanket – Single',
        quantity: blanketCozyCount,
        unitPrice: RATE_BLANKET_COZY,
        unit: 'blanket',
        total: costBlanketCozy,
      });
    }
    if (duvetCount > 0) {
      selectedItems.push({
        serviceId: 'blanket-duvet',
        serviceName: 'Duvet Inner',
        quantity: duvetCount,
        unitPrice: RATE_DUVET,
        unit: 'duvet',
        total: costDuvet,
      });
    }
    if (schoolBlazersCount > 0) {
      selectedItems.push({
        serviceId: 'dc-blazer',
        serviceName: 'School Blazer Dry Clean',
        quantity: schoolBlazersCount,
        unitPrice: RATE_SCHOOL_BLAZER,
        unit: 'blazer',
        total: costSchoolBlazers,
      });
    }
    if (uniformsKg > 0) {
      selectedItems.push({
        serviceId: 'dc-uniform',
        serviceName: 'Trousers & Uniforms',
        quantity: uniformsKg,
        unitPrice: RATE_UNIFORMS,
        unit: 'kg',
        total: costUniforms,
      });
    }
    if (labChefKg > 0) {
      selectedItems.push({
        serviceId: 'dc-lab-chef',
        serviceName: 'Lab Coats & Chef Coats',
        quantity: labChefKg,
        unitPrice: RATE_LAB_CHEF,
        unit: 'kg',
        total: costLabChef,
      });
    }
    if (shoeRefreshPairs > 0) {
      selectedItems.push({
        serviceId: 'shoe-spa-essential',
        serviceName: 'Shoe Spa Quick Refresh',
        quantity: shoeRefreshPairs,
        unitPrice: RATE_SHOE_REFRESH,
        unit: 'pair',
        total: costShoeRefresh,
      });
    }
    if (shoeDeepPairs > 0) {
      selectedItems.push({
        serviceId: 'shoe-spa-deep',
        serviceName: 'Shoe Spa Deep Restoration',
        quantity: shoeDeepPairs,
        unitPrice: RATE_SHOE_DEEP,
        unit: 'pair',
        total: costShoeDeep,
      });
    }

    onLoadIntoBooking(selectedItems, isExpress);
  };

  const handleReset = () => {
    setWashDryIronKg(0);
    setWashDryKg(5);
    setDryOnlyKg(0);
    setBlanketLuxuryCount(0);
    setBlanketSnuggleCount(0);
    setBlanketCozyCount(0);
    setDuvetCount(0);
    setSchoolBlazersCount(0);
    setUniformsKg(0);
    setLabChefKg(0);
    setShoeRefreshPairs(1);
    setShoeDeepPairs(0);
    setIsExpress(false);
  };

  return (
    <section id="calculator" className="py-16 sm:py-24 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-100 text-sky-800 text-xs font-semibold mb-2">
            <Calculator className="w-3.5 h-3.5 text-sky-600" />
            <span>Instant Estimator</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-display">
            Interactive Price Calculator
          </h2>
          <p className="text-slate-600 mt-2 text-base">
            Select items from Gio's official price card for an instant estimate in South African Rands (ZAR).
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Controls Column */}
          <div className="lg:col-span-7 bg-slate-50 rounded-2xl p-6 sm:p-8 border border-slate-200 space-y-7">
            {/* 1. Essential Section */}
            <div>
              <div className="border-b border-slate-200 pb-2 mb-4">
                <span className="text-xs font-bold uppercase tracking-wider text-sky-600">
                  1. Essential Laundry (Per KG)
                </span>
              </div>

              {/* Wash, Dry, Iron */}
              <div className="mb-5">
                <div className="flex items-center justify-between mb-2">
                  <label htmlFor={washDryIronId} className="text-sm font-bold text-slate-900">
                    Wash, Dry, Iron <span className="text-xs font-normal text-slate-500">(R37 / kg)</span>
                  </label>
                  <span className="text-sm font-extrabold text-sky-600 font-display tabular-nums">
                    {washDryIronKg} kg {washDryIronKg > 0 ? `· R${costWashDryIron}` : ''}
                  </span>
                </div>
                <input
                  id={washDryIronId}
                  type="range"
                  min="0"
                  max="20"
                  step="1"
                  value={washDryIronKg}
                  onChange={(e) => setWashDryIronKg(Number(e.target.value))}
                  className="w-full h-2.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-sky-600"
                />
              </div>

              {/* Wash and Dry */}
              <div className="mb-5">
                <div className="flex items-center justify-between mb-2">
                  <label htmlFor={washDryId} className="text-sm font-bold text-slate-900">
                    Wash and Dry <span className="text-xs font-normal text-slate-500">(R29 / kg)</span>
                  </label>
                  <span className="text-sm font-extrabold text-sky-600 font-display tabular-nums">
                    {washDryKg} kg {washDryKg > 0 ? `· R${costWashDry}` : ''}
                  </span>
                </div>
                <input
                  id={washDryId}
                  type="range"
                  min="0"
                  max="20"
                  step="1"
                  value={washDryKg}
                  onChange={(e) => setWashDryKg(Number(e.target.value))}
                  className="w-full h-2.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-sky-600"
                />
              </div>

              {/* Dry Only */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label htmlFor={dryOnlyId} className="text-sm font-bold text-slate-900">
                    Dry Only <span className="text-xs font-normal text-slate-500">(R20 / kg)</span>
                  </label>
                  <span className="text-sm font-extrabold text-sky-600 font-display tabular-nums">
                    {dryOnlyKg} kg {dryOnlyKg > 0 ? `· R${costDryOnly}` : ''}
                  </span>
                </div>
                <input
                  id={dryOnlyId}
                  type="range"
                  min="0"
                  max="20"
                  step="1"
                  value={dryOnlyKg}
                  onChange={(e) => setDryOnlyKg(Number(e.target.value))}
                  className="w-full h-2.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-sky-600"
                />
              </div>
            </div>

            {/* 2. Blanket Bundles (Fixed Per Item) */}
            <div>
              <div className="border-b border-slate-200 pb-2 mb-4">
                <span className="text-xs font-bold uppercase tracking-wider text-sky-600">
                  2. Blanket Bundles
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Luxury King & Queen */}
                <div className="bg-white p-3.5 rounded-xl border border-slate-200 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold text-slate-900">Luxury (King &amp; Queen)</p>
                    <p className="text-[11px] text-slate-500">R180 each</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setBlanketLuxuryCount(Math.max(0, blanketLuxuryCount - 1))}
                      className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold flex items-center justify-center text-xs"
                    >
                      -
                    </button>
                    <span className="w-5 text-center font-bold text-slate-900 tabular-nums text-xs">
                      {blanketLuxuryCount}
                    </span>
                    <button
                      type="button"
                      onClick={() => setBlanketLuxuryCount(blanketLuxuryCount + 1)}
                      className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold flex items-center justify-center text-xs"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Snuggle Double */}
                <div className="bg-white p-3.5 rounded-xl border border-slate-200 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold text-slate-900">Snuggle (Double size)</p>
                    <p className="text-[11px] text-slate-500">R150 each</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setBlanketSnuggleCount(Math.max(0, blanketSnuggleCount - 1))}
                      className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold flex items-center justify-center text-xs"
                    >
                      -
                    </button>
                    <span className="w-5 text-center font-bold text-slate-900 tabular-nums text-xs">
                      {blanketSnuggleCount}
                    </span>
                    <button
                      type="button"
                      onClick={() => setBlanketSnuggleCount(blanketSnuggleCount + 1)}
                      className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold flex items-center justify-center text-xs"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Cozy Single */}
                <div className="bg-white p-3.5 rounded-xl border border-slate-200 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold text-slate-900">Cozy (Single size)</p>
                    <p className="text-[11px] text-slate-500">R110 each</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setBlanketCozyCount(Math.max(0, blanketCozyCount - 1))}
                      className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold flex items-center justify-center text-xs"
                    >
                      -
                    </button>
                    <span className="w-5 text-center font-bold text-slate-900 tabular-nums text-xs">
                      {blanketCozyCount}
                    </span>
                    <button
                      type="button"
                      onClick={() => setBlanketCozyCount(blanketCozyCount + 1)}
                      className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold flex items-center justify-center text-xs"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Duvet Inner */}
                <div className="bg-white p-3.5 rounded-xl border border-slate-200 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold text-slate-900">Duvet Inner / Comforter</p>
                    <p className="text-[11px] text-slate-500">R100 each</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setDuvetCount(Math.max(0, duvetCount - 1))}
                      className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold flex items-center justify-center text-xs"
                    >
                      -
                    </button>
                    <span className="w-5 text-center font-bold text-slate-900 tabular-nums text-xs">
                      {duvetCount}
                    </span>
                    <button
                      type="button"
                      onClick={() => setDuvetCount(duvetCount + 1)}
                      className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold flex items-center justify-center text-xs"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* 3. Dry Cleaning & Uniforms */}
            <div>
              <div className="border-b border-slate-200 pb-2 mb-4">
                <span className="text-xs font-bold uppercase tracking-wider text-sky-600">
                  3. Dry Cleaning &amp; Uniforms
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* School Blazer */}
                <div className="bg-white p-3.5 rounded-xl border border-slate-200 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold text-slate-900">School Blazer</p>
                    <p className="text-[11px] text-slate-500">R70 each</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setSchoolBlazersCount(Math.max(0, schoolBlazersCount - 1))}
                      className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold flex items-center justify-center text-xs"
                    >
                      -
                    </button>
                    <span className="w-5 text-center font-bold text-slate-900 tabular-nums text-xs">
                      {schoolBlazersCount}
                    </span>
                    <button
                      type="button"
                      onClick={() => setSchoolBlazersCount(schoolBlazersCount + 1)}
                      className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold flex items-center justify-center text-xs"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Trousers, uniform */}
                <div className="bg-white p-3.5 rounded-xl border border-slate-200 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold text-slate-900">Trousers, Uniform</p>
                    <p className="text-[11px] text-slate-500">R25 / kg</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setUniformsKg(Math.max(0, uniformsKg - 1))}
                      className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold flex items-center justify-center text-xs"
                    >
                      -
                    </button>
                    <span className="w-5 text-center font-bold text-slate-900 tabular-nums text-xs">
                      {uniformsKg}
                    </span>
                    <button
                      type="button"
                      onClick={() => setUniformsKg(uniformsKg + 1)}
                      className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold flex items-center justify-center text-xs"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Lab & Chef Coats */}
                <div className="bg-white p-3.5 rounded-xl border border-slate-200 flex items-center justify-between sm:col-span-2">
                  <div>
                    <p className="text-xs font-bold text-slate-900">Lab Coats &amp; Chef Coats</p>
                    <p className="text-[11px] text-slate-500">R19 / kg</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setLabChefKg(Math.max(0, labChefKg - 1))}
                      className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold flex items-center justify-center text-xs"
                    >
                      -
                    </button>
                    <span className="w-5 text-center font-bold text-slate-900 tabular-nums text-xs">
                      {labChefKg}
                    </span>
                    <button
                      type="button"
                      onClick={() => setLabChefKg(labChefKg + 1)}
                      className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold flex items-center justify-center text-xs"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* 4. Shoe Spa (From only R50) */}
            <div>
              <div className="border-b border-slate-200 pb-2 mb-4">
                <span className="text-xs font-bold uppercase tracking-wider text-sky-600">
                  4. Shoe Spa (From Only R50)
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Refresh */}
                <div className="bg-white p-3.5 rounded-xl border border-slate-200 flex flex-col justify-between">
                  <div>
                    <p className="text-xs font-bold text-slate-900">Shoe Spa Refresh</p>
                    <p className="text-[11px] text-amber-600 font-bold">R50 / pair</p>
                  </div>
                  <div className="flex items-center justify-between mt-3">
                    <button
                      type="button"
                      onClick={() => setShoeRefreshPairs(Math.max(0, shoeRefreshPairs - 1))}
                      className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs"
                    >
                      -
                    </button>
                    <span className="font-bold text-slate-900 tabular-nums text-xs">
                      {shoeRefreshPairs}
                    </span>
                    <button
                      type="button"
                      onClick={() => setShoeRefreshPairs(shoeRefreshPairs + 1)}
                      className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Deep Restoration */}
                <div className="bg-white p-3.5 rounded-xl border border-slate-200 flex flex-col justify-between">
                  <div>
                    <p className="text-xs font-bold text-slate-900">Deep Restoration</p>
                    <p className="text-[11px] text-slate-500">R90 / pair</p>
                  </div>
                  <div className="flex items-center justify-between mt-3">
                    <button
                      type="button"
                      onClick={() => setShoeDeepPairs(Math.max(0, shoeDeepPairs - 1))}
                      className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs"
                    >
                      -
                    </button>
                    <span className="font-bold text-slate-900 tabular-nums text-xs">
                      {shoeDeepPairs}
                    </span>
                    <button
                      type="button"
                      onClick={() => setShoeDeepPairs(shoeDeepPairs + 1)}
                      className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* First-Time Customer Special Promo Toggle */}
            <div className="bg-emerald-50 border border-emerald-300 rounded-xl p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-emerald-500 text-white flex items-center justify-center shrink-0">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <p className="text-sm font-bold text-slate-900">First-Time Customer Special</p>
                    <span className="bg-emerald-600 text-white text-[10px] font-black uppercase px-2 py-0.2 rounded-full">100% Free Delivery</span>
                  </div>
                  <p className="text-xs text-slate-600">Doorstep pickup &amp; delivery are completely free on your first booking!</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsFirstTimeCustomer(!isFirstTimeCustomer)}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  isFirstTimeCustomer ? 'bg-emerald-600' : 'bg-slate-300'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    isFirstTimeCustomer ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* Express Toggle */}
            <div className="bg-amber-50 border border-amber-200/80 rounded-xl p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-amber-400 text-slate-950 flex items-center justify-center shrink-0">
                  <Zap className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-900">Express Same-Day Turnaround</p>
                  <p className="text-xs text-slate-600">Delivered within 12–24 hours (+30% rush fee)</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsExpress(!isExpress)}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  isExpress ? 'bg-amber-500' : 'bg-slate-300'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    isExpress ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Estimate Summary Receipt Card */}
          <div className="lg:col-span-5 bg-gradient-to-b from-[#091E42] to-slate-950 text-white rounded-2xl p-6 sm:p-8 shadow-xl space-y-6">
            <div className="flex items-center justify-between border-b border-sky-800/80 pb-4">
              <div>
                <h3 className="text-lg font-bold font-display">Estimate Summary</h3>
                <p className="text-xs text-sky-300">Gio's Laundromat · Pietermaritzburg</p>
              </div>
              <button
                onClick={handleReset}
                className="text-xs text-sky-300 hover:text-white flex items-center gap-1 transition-colors"
              >
                <RefreshCw className="w-3 h-3" />
                <span>Reset</span>
              </button>
            </div>

            {/* Itemized list */}
            <div className="space-y-2 text-xs sm:text-sm">
              {washDryIronKg > 0 && (
                <div className="flex justify-between text-sky-100">
                  <span>Wash, Dry, Iron ({washDryIronKg}kg @ R37)</span>
                  <span className="font-semibold tabular-nums">R{costWashDryIron}</span>
                </div>
              )}
              {washDryKg > 0 && (
                <div className="flex justify-between text-sky-100">
                  <span>Wash and Dry ({washDryKg}kg @ R29)</span>
                  <span className="font-semibold tabular-nums">R{costWashDry}</span>
                </div>
              )}
              {dryOnlyKg > 0 && (
                <div className="flex justify-between text-sky-100">
                  <span>Dry Only ({dryOnlyKg}kg @ R20)</span>
                  <span className="font-semibold tabular-nums">R{costDryOnly}</span>
                </div>
              )}
              {blanketLuxuryCount > 0 && (
                <div className="flex justify-between text-sky-100">
                  <span>Luxury King/Queen ({blanketLuxuryCount}x @ R180)</span>
                  <span className="font-semibold tabular-nums">R{costBlanketLuxury}</span>
                </div>
              )}
              {blanketSnuggleCount > 0 && (
                <div className="flex justify-between text-sky-100">
                  <span>Snuggle Double ({blanketSnuggleCount}x @ R150)</span>
                  <span className="font-semibold tabular-nums">R{costBlanketSnuggle}</span>
                </div>
              )}
              {blanketCozyCount > 0 && (
                <div className="flex justify-between text-sky-100">
                  <span>Cozy Single ({blanketCozyCount}x @ R110)</span>
                  <span className="font-semibold tabular-nums">R{costBlanketCozy}</span>
                </div>
              )}
              {duvetCount > 0 && (
                <div className="flex justify-between text-sky-100">
                  <span>Duvet Inner ({duvetCount}x @ R100)</span>
                  <span className="font-semibold tabular-nums">R{costDuvet}</span>
                </div>
              )}
              {schoolBlazersCount > 0 && (
                <div className="flex justify-between text-sky-100">
                  <span>School Blazer ({schoolBlazersCount}x @ R70)</span>
                  <span className="font-semibold tabular-nums">R{costSchoolBlazers}</span>
                </div>
              )}
              {uniformsKg > 0 && (
                <div className="flex justify-between text-sky-100">
                  <span>Uniforms &amp; Trousers ({uniformsKg}kg @ R25)</span>
                  <span className="font-semibold tabular-nums">R{costUniforms}</span>
                </div>
              )}
              {labChefKg > 0 && (
                <div className="flex justify-between text-sky-100">
                  <span>Lab/Chef Coats ({labChefKg}kg @ R19)</span>
                  <span className="font-semibold tabular-nums">R{costLabChef}</span>
                </div>
              )}
              {shoeRefreshPairs > 0 && (
                <div className="flex justify-between text-sky-100">
                  <span>Shoe Spa Refresh ({shoeRefreshPairs} pair @ R50)</span>
                  <span className="font-semibold tabular-nums">R{costShoeRefresh}</span>
                </div>
              )}
              {shoeDeepPairs > 0 && (
                <div className="flex justify-between text-sky-100">
                  <span>Deep Shoe Spa ({shoeDeepPairs} pair @ R90)</span>
                  <span className="font-semibold tabular-nums">R{costShoeDeep}</span>
                </div>
              )}

              {subtotal === 0 && (
                <p className="text-xs text-sky-300 italic py-2">
                  Select your items on the left to see the instant estimate.
                </p>
              )}

              <div className="border-t border-sky-800/80 pt-3 space-y-2">
                <div className="flex justify-between text-xs text-sky-200">
                  <span>Subtotal</span>
                  <span className="font-semibold tabular-nums">R{subtotal}</span>
                </div>

                {isExpress && (
                  <div className="flex justify-between text-xs text-amber-300">
                    <span>Express Rush Surcharge (+30%)</span>
                    <span className="font-semibold tabular-nums">+R{expressFee}</span>
                  </div>
                )}

                <div className="flex justify-between text-xs text-sky-200 items-center">
                  <span>Doorstep Pickup &amp; Delivery</span>
                  {deliveryFee === 0 ? (
                    <span className="text-lime-400 font-bold">
                      {isFirstTimeCustomer ? 'FREE (1st-Time Special)' : 'FREE (Over R200)'}
                    </span>
                  ) : (
                    <span className="font-semibold tabular-nums">R{deliveryFee} (Orders under R200)</span>
                  )}
                </div>
              </div>

              {/* Total Callout */}
              <div className="border-t border-sky-700 pt-4 flex items-baseline justify-between">
                <div>
                  <p className="text-xs uppercase tracking-wider text-sky-300 font-bold">Total Estimated</p>
                  <p className="text-[11px] text-sky-300">Pay on delivery (Card/Cash)</p>
                </div>
                <div className="text-right">
                  <span className="text-3xl sm:text-4xl font-black text-white font-display tabular-nums">
                    R{total}
                  </span>
                </div>
              </div>
            </div>

            {/* Load to booking button */}
            <button
              onClick={handleApplyToBooking}
              disabled={subtotal === 0}
              className={`w-full py-3.5 px-5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-md ${
                subtotal > 0
                  ? 'bg-[#00AEEF] hover:bg-sky-400 text-slate-950 cursor-pointer shadow-sky-900/40'
                  : 'bg-slate-700 text-slate-400 cursor-not-allowed'
              }`}
            >
              <span>Load Into Booking Form</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            {/* Trust badge */}
            <div className="flex items-center gap-2 text-xs text-sky-200/80 justify-center">
              <ShieldCheck className="w-4 h-4 text-[#00AEEF]" />
              <span>Speedpoint card machine or cash upon delivery</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
