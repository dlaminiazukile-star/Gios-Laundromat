import React, { useState } from 'react';
import {
  Package,
  Search,
  CheckCircle2,
  Clock,
  Truck,
  FileText,
  MessageCircle,
  Phone,
  Sparkles,
  MapPin,
  Calendar,
  AlertCircle,
  CreditCard,
  Scale,
} from 'lucide-react';
import { LaundryOrder, OrderTimelineStep } from '../types';
import { BUSINESS_INFO } from '../data/servicesData';

interface TrackingDashboardProps {
  orders: LaundryOrder[];
  selectedOrderId?: string;
  onSelectOrder: (orderId: string) => void;
  onViewInvoice: (order: LaundryOrder) => void;
}

export const TrackingDashboard: React.FC<TrackingDashboardProps> = ({
  orders,
  selectedOrderId,
  onSelectOrder,
  onViewInvoice,
}) => {
  const [searchInput, setSearchInput] = useState('');
  const [searchNotFound, setSearchNotFound] = useState(false);

  // Active tracked order
  const activeOrder =
    orders.find((o) => o.id.toLowerCase() === (selectedOrderId || '').toLowerCase()) ||
    orders[0];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchNotFound(false);
    const clean = searchInput.trim().toUpperCase().replace('#', '');
    const found = orders.find(
      (o) =>
        o.id.toUpperCase() === clean ||
        o.id.toUpperCase() === `GIO-${clean}` ||
        o.id.toUpperCase() === `FF-${clean}` ||
        o.phone.includes(clean)
    );

    if (found) {
      onSelectOrder(found.id);
      setSearchInput('');
    } else {
      setSearchNotFound(true);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'new_request':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-indigo-100 text-indigo-800 text-xs font-bold">
            <Clock className="w-3.5 h-3.5" />
            <span>New Request</span>
          </span>
        );
      case 'verification_pending':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-bold">
            <AlertCircle className="w-3.5 h-3.5" />
            <span>Verification Pending</span>
          </span>
        );
      case 'verified':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-bold">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Verified &amp; Approved</span>
          </span>
        );
      case 'pickup_scheduled':
      case 'confirmed':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-sky-100 text-sky-800 text-xs font-bold">
            <Calendar className="w-3.5 h-3.5" />
            <span>Pickup Scheduled</span>
          </span>
        );
      case 'collected':
      case 'picked_up':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-purple-100 text-purple-800 text-xs font-bold">
            <Truck className="w-3.5 h-3.5" />
            <span>Collected · In Transit</span>
          </span>
        );
      case 'processing':
      case 'in_cleaning':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-cyan-100 text-cyan-800 text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Processing · Eco Wash &amp; Spa</span>
          </span>
        );
      case 'ready':
      case 'quality_checked':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-teal-100 text-teal-800 text-xs font-bold">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Ready &amp; Packaged</span>
          </span>
        );
      case 'out_for_delivery':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-lime-100 text-lime-900 text-xs font-bold animate-pulse">
            <Truck className="w-3.5 h-3.5" />
            <span>Out for Delivery</span>
          </span>
        );
      case 'delivered':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-lime-100 text-lime-900 text-xs font-bold">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Delivered</span>
          </span>
        );
      case 'payment_outstanding':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-rose-100 text-rose-800 text-xs font-bold">
            <CreditCard className="w-3.5 h-3.5" />
            <span>Payment Outstanding</span>
          </span>
        );
      case 'completed':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Completed &amp; Paid</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-slate-100 text-slate-800 text-xs font-bold">
            <span>{status}</span>
          </span>
        );
    }
  };

  const getDriverWhatsApp = (order: LaundryOrder) => {
    const text = `Hi Gio's Laundromat, checking on order #${order.id} for ${order.customerName}.`;
    return `https://wa.me/${BUSINESS_INFO.whatsappRaw}?text=${encodeURIComponent(text)}`;
  };

  return (
    <section id="tracking" className="py-16 sm:py-24 bg-slate-900 text-white border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-500/20 text-sky-300 text-xs font-semibold mb-2 border border-sky-400/30">
            <Package className="w-3.5 h-3.5 text-sky-400" />
            <span>Live Order Tracking</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold font-display">
            Real-Time Laundry &amp; Shoe Status
          </h2>
          <p className="text-slate-300 text-sm mt-2">
            Track your garments and footwear every step from your doorstep to our specialized spa and back.
          </p>
        </div>

        {/* Search Bar & Order Switcher */}
        <div className="max-w-2xl mx-auto mb-10">
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Enter Order # (e.g. FF-8429, FF-6120) or phone number..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-slate-800/90 border border-slate-700 rounded-xl text-white placeholder-slate-400 text-sm focus:border-sky-500 focus:outline-none"
              />
            </div>
            <button
              type="submit"
              className="px-6 py-3 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-sm transition-colors whitespace-nowrap"
            >
              Track
            </button>
          </form>

          {searchNotFound && (
            <p className="text-xs text-rose-400 mt-2 flex items-center gap-1.5 justify-center">
              <AlertCircle className="w-3.5 h-3.5" />
              <span>Order reference not found. Try demo orders below or book a new pickup!</span>
            </p>
          )}

          {/* Quick Order Tabs */}
          <div className="flex items-center justify-center gap-2 mt-4 flex-wrap">
            <span className="text-xs text-slate-400">Available Orders:</span>
            {orders.map((o) => (
              <button
                key={o.id}
                onClick={() => onSelectOrder(o.id)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors tabular-nums ${
                  activeOrder?.id === o.id
                    ? 'bg-sky-500 text-slate-950'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                #{o.id} ({o.customerName.split(' ')[0]})
              </button>
            ))}
          </div>
        </div>

        {/* Active Order Card */}
        {activeOrder ? (
          <div className="bg-slate-800/90 border border-slate-700 rounded-3xl p-6 sm:p-10 shadow-2xl space-y-8">
            {/* Header info */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-700 pb-6">
              <div>
                <div className="flex items-center gap-3 flex-wrap">
                  <h3 className="text-2xl font-black font-display text-white">
                    Order #{activeOrder.id}
                  </h3>
                  {getStatusBadge(activeOrder.status)}
                  {activeOrder.isFirstTimeCustomer && (
                    <span className="bg-emerald-500/20 text-emerald-300 text-[11px] font-bold px-2.5 py-0.5 rounded-full border border-emerald-500/40">
                      🎉 1st-Time Customer (Free Delivery)
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  Customer: <span className="text-white font-medium">{activeOrder.customerName}</span> ·{' '}
                  <span className="text-sky-300">{activeOrder.suburb}, {activeOrder.city}</span>
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                {activeOrder.invoiceIssued ? (
                  <button
                    onClick={() => onViewInvoice(activeOrder)}
                    className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs sm:text-sm border border-slate-600 transition-colors flex items-center gap-2"
                  >
                    <FileText className="w-4 h-4 text-sky-400" />
                    <span>View Official Tax Invoice</span>
                  </button>
                ) : (
                  <div className="px-3.5 py-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-medium flex items-center gap-2">
                    <Scale className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>Invoice pending doorstep weighing</span>
                  </div>
                )}

                <a
                  href={getDriverWhatsApp(activeOrder)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-semibold text-xs sm:text-sm transition-colors flex items-center gap-2 shadow-sm"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>WhatsApp Updates</span>
                </a>
              </div>
            </div>

            {/* Visual Timeline Stepper */}
            <div>
              <p className="text-xs uppercase tracking-wider font-bold text-sky-400 mb-6">
                Milestone Progress
              </p>

              <div className="relative">
                {/* Horizontal line on lg */}
                <div className="hidden lg:block absolute top-5 left-8 right-8 h-1 bg-slate-700 -z-0" />

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-6 relative z-10">
                  {activeOrder.timeline.map((step: OrderTimelineStep, sidx: number) => {
                    const isDone = step.completed;
                    const isCurrent = step.current;

                    return (
                      <div key={sidx} className="flex flex-col items-start lg:items-center text-left lg:text-center">
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold mb-3 border-2 transition-all ${
                            isDone
                              ? 'bg-emerald-500 border-emerald-400 text-white'
                              : isCurrent
                              ? 'bg-sky-500 border-white text-slate-950 animate-pulse shadow-lg shadow-sky-500/50'
                              : 'bg-slate-800 border-slate-600 text-slate-400'
                          }`}
                        >
                          {isDone ? <CheckCircle2 className="w-5 h-5" /> : sidx + 1}
                        </div>

                        <p className={`text-xs font-bold ${isCurrent ? 'text-sky-300 font-extrabold' : 'text-white'}`}>
                          {step.label}
                        </p>
                        <p className="text-[11px] text-slate-400 mt-1 leading-tight">
                          {step.description}
                        </p>
                        {step.timestamp && (
                          <span className="text-[10px] text-sky-400 font-mono mt-1">
                            {step.timestamp}
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Courier & Items Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 border-t border-slate-700 text-xs sm:text-sm">
              {/* Courier info */}
              <div className="bg-slate-900/60 p-4 rounded-2xl border border-slate-700/80 space-y-2">
                <p className="text-xs uppercase font-bold text-sky-400 tracking-wider">
                  Assigned Courier
                </p>
                <div className="flex items-center gap-3 pt-1">
                  <div className="w-10 h-10 rounded-xl bg-sky-500/20 text-sky-400 flex items-center justify-center shrink-0">
                    <Truck className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-bold text-white">{activeOrder.driverName || 'Sipho Madlala'}</p>
                    <p className="text-xs text-slate-400">{activeOrder.driverVehicle || 'White Toyota Proace Van'}</p>
                  </div>
                </div>
                <p className="text-xs text-slate-300 pt-1">
                  Estimated Delivery:{' '}
                  <strong className="text-white">{activeOrder.estimatedDelivery}</strong>
                </p>
              </div>

              {/* Items Breakdown */}
              <div className="bg-slate-900/60 p-4 rounded-2xl border border-slate-700/80 space-y-2">
                <p className="text-xs uppercase font-bold text-sky-400 tracking-wider">
                  Items in Care ({activeOrder.items.length})
                </p>
                <div className="space-y-1.5 pt-1">
                  {activeOrder.items.map((item, idx) => (
                    <div key={idx} className="flex justify-between text-xs">
                      <span className="text-slate-300 truncate max-w-[180px]">
                        {item.quantity} {item.unit} · {item.serviceName}
                      </span>
                      <span className="font-semibold text-white tabular-nums">
                        R{item.total}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Handover & Payment Notice */}
              <div className="bg-slate-900/60 p-4 rounded-2xl border border-slate-700/80 space-y-2.5">
                <p className="text-xs uppercase font-bold text-sky-400 tracking-wider">
                  Doorstep Payment &amp; Invoice Status
                </p>
                <div className="flex items-start gap-2 pt-1 text-slate-300">
                  <CreditCard className="w-4 h-4 text-lime-400 shrink-0 mt-0.5" />
                  <div className="text-xs space-y-1">
                    <p>
                      {activeOrder.invoiceIssued ? (
                        <>
                          Verified Total: <strong className="text-white tabular-nums text-base">R{activeOrder.total}</strong>
                        </>
                      ) : (
                        <>
                          Estimated Total: <strong className="text-white tabular-nums text-base">R{activeOrder.total}</strong>
                        </>
                      )}
                    </p>
                    <p className="text-slate-400 text-[11px]">
                      {activeOrder.invoiceIssued
                        ? `Official invoice verified and issued by staff. Pay on handover via Speedpoint card machine or cash.`
                        : `Final total confirmed when courier weighs your clothes on mobile digital scales.`}
                    </p>
                  </div>
                </div>

                {activeOrder.invoiceIssued ? (
                  <button
                    onClick={() => onViewInvoice(activeOrder)}
                    className="text-xs font-semibold text-sky-400 hover:text-sky-300 underline block pt-1"
                  >
                    View official itemized invoice →
                  </button>
                ) : (
                  <div className="pt-1.5 flex items-center gap-1.5 text-xs text-amber-300/90 font-medium">
                    <Scale className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <span>Official tax invoice will be issued by staff after doorstep weighing.</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-12 text-slate-400">
            No order found. Enter your order reference above.
          </div>
        )}
      </div>
    </section>
  );
};
