import React from 'react';
import { X, Printer, CheckCircle2, CreditCard, Sparkles, MapPin, Phone, Mail, Banknote, Check } from 'lucide-react';
import { LaundryOrder } from '../types';
import { BUSINESS_INFO } from '../data/servicesData';
import { GioLogo } from './GioLogo';

interface InvoiceModalProps {
  order: LaundryOrder | null;
  onClose: () => void;
}

export const InvoiceModal: React.FC<InvoiceModalProps> = ({ order, onClose }) => {
  if (!order) return null;

  const handlePrint = () => {
    window.print();
  };

  const isCash = order.paymentMethod === 'Cash on Delivery';
  const isEft = order.paymentMethod === 'EFT Bank Transfer' || order.paymentMethod === 'EFT';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl overflow-hidden my-8 border border-slate-200">
        {/* Top actions bar */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-900 text-white border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-sky-400" />
            <span className="text-sm font-bold font-display">
              Tax Invoice #{order.id}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Save PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Invoice Container */}
        <div id="printable-invoice" className="p-8 sm:p-12 text-slate-800 space-y-8 bg-white">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6 border-b border-slate-200 pb-8">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="bg-slate-900 px-3 py-1.5 rounded-xl shadow-sm inline-flex items-center">
                  <GioLogo size="sm" variant="light" />
                </div>
              </div>
              <p className="text-xs text-slate-500 max-w-sm leading-relaxed mt-2">
                {BUSINESS_INFO.tagline}
                <br />
                {BUSINESS_INFO.address}
                <br />
                Phone / WhatsApp: {BUSINESS_INFO.phone} | {BUSINESS_INFO.email}
              </p>
            </div>

            <div className="sm:text-right space-y-1">
              <span className="inline-block px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wider">
                {order.invoiceIssued ? 'Official Tax Invoice (Issued)' : 'Pickup Estimate'}
              </span>
              <p className="text-xl font-bold font-display text-slate-900">
                #{order.id}
              </p>
              <p className="text-xs text-slate-500">
                Date: {order.createdAt}
              </p>
              {order.invoiceIssued && (
                <div className="text-[11px] text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-md text-left sm:text-right mt-1">
                  <span className="font-bold">✓ Weighed &amp; Issued by Staff</span>
                  {order.invoiceIssuedBy && <span className="block text-slate-600">Issuer: {order.invoiceIssuedBy}</span>}
                  {order.invoiceIssuedAt && <span className="block text-slate-500">{order.invoiceIssuedAt}</span>}
                </div>
              )}

              {/* Exact Payment Method and Status Header */}
              {isCash && (
                <div className="pt-2 text-left sm:text-right space-y-1 text-xs">
                  <p className="font-bold text-slate-800">
                    Payment Method: <span className="text-amber-900 bg-amber-100 px-2 py-0.5 rounded font-black tracking-wide uppercase">CASH ON DELIVERY</span>
                  </p>
                  <p className="font-bold">
                    Payment Status:{' '}
                    {order.cashReceivedRecord || order.paymentStatus === 'paid' ? (
                      <span className="text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded font-black tracking-wide uppercase">CASH RECEIVED ✓</span>
                    ) : (
                      <span className="text-rose-800 bg-rose-100 px-2 py-0.5 rounded font-black tracking-wide uppercase">OUTSTANDING</span>
                    )}
                  </p>
                </div>
              )}

              {isEft && (
                <div className="pt-2 text-left sm:text-right space-y-1 text-xs">
                  <p className="font-bold text-slate-800">
                    Payment Method: <span className="text-sky-900 bg-sky-100 px-2 py-0.5 rounded font-black tracking-wide uppercase">EFT</span>
                  </p>
                  <p className="font-bold">
                    Payment Status:{' '}
                    {order.paymentStatus === 'paid' ? (
                      <span className="text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded font-black tracking-wide uppercase">PAID &amp; VERIFIED ✓</span>
                    ) : (
                      <span className="text-rose-800 bg-rose-100 px-2 py-0.5 rounded font-black tracking-wide uppercase">OUTSTANDING</span>
                    )}
                  </p>
                </div>
              )}

              {!isCash && !isEft && (
                <div className="pt-2 text-left sm:text-right space-y-1 text-xs">
                  <p className="font-bold text-slate-800">
                    Payment Method: <span className="text-slate-800 bg-slate-100 px-2 py-0.5 rounded font-bold uppercase">{order.paymentMethod || 'Speedpoint Card on Delivery'}</span>
                  </p>
                  <p className="text-xs font-semibold text-emerald-700">
                    Payment Status: <span className="underline">Due on Delivery</span>
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Customer & Pickup Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 bg-slate-50 p-6 rounded-2xl border border-slate-200 text-xs sm:text-sm">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                Billed &amp; Delivered To:
              </p>
              <p className="font-bold text-slate-900 text-base">{order.customerName}</p>
              <p className="text-slate-600">{order.phone}</p>
              {order.email && <p className="text-slate-600">{order.email}</p>}
              <p className="text-slate-800 mt-1 font-medium">
                {order.address}, {order.suburb}, {order.city}
              </p>
            </div>

            <div className="sm:text-right space-y-1">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                Pickup &amp; Handover Schedule:
              </p>
              <p className="text-slate-700">
                Scheduled Date: <strong className="text-slate-900">{order.pickupDate}</strong>
              </p>
              <p className="text-slate-700">
                Time Window: <strong className="text-slate-900">{order.pickupTimeSlot}</strong>
              </p>
              <p className="text-slate-700">
                Service Speed: <strong>{order.isExpress ? 'Express Rush (24h)' : 'Standard (24-48h)'}</strong>
              </p>
              {order.driverName && (
                <p className="text-slate-500 text-xs pt-1">
                  Courier: {order.driverName} ({order.driverVehicle})
                </p>
              )}
            </div>
          </div>

          {/* Line Items Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead>
                <tr className="border-b-2 border-slate-200 text-slate-400 text-xs uppercase tracking-wider">
                  <th className="py-3 font-bold">Service Description</th>
                  <th className="py-3 text-center font-bold">Quantity</th>
                  <th className="py-3 text-right font-bold">Unit Price</th>
                  <th className="py-3 text-right font-bold">Amount (ZAR)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {order.items.map((item, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/50">
                    <td className="py-3.5 pr-4 font-semibold text-slate-900">
                      {item.serviceName}
                    </td>
                    <td className="py-3.5 px-2 text-center text-slate-600 tabular-nums">
                      {item.quantity} {item.unit}
                    </td>
                    <td className="py-3.5 px-2 text-right text-slate-600 tabular-nums">
                      R{item.unitPrice}
                    </td>
                    <td className="py-3.5 pl-4 text-right font-bold text-slate-900 tabular-nums">
                      R{item.total}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Financial Calculation Summary */}
          <div className="border-t border-slate-200 pt-4 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6">
            <div className="max-w-xs space-y-2 text-xs text-slate-500">
              <p className="font-bold text-slate-700 uppercase tracking-wider">
                Payment Verification:
              </p>
              {isCash && (
                <p>
                  Payment Method: <strong>CASH ON DELIVERY</strong>. Driver collects cash upon handover. Admin then marks <strong>CASH RECEIVED ✓</strong>.
                </p>
              )}
              {isEft && (
                <p>
                  Payment Method: <strong>EFT</strong>. FNB Gold Business Account 63111341466. Invoice sent automatically once certified weighing is complete.
                </p>
              )}
              {!isCash && !isEft && (
                <p>
                  Payment collected upon safe delivery via mobile Speedpoint (Visa, Mastercard, Apple Pay, Google Pay).
                </p>
              )}
            </div>

            <div className="w-full sm:w-64 space-y-2 text-xs sm:text-sm">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal</span>
                <span className="font-semibold tabular-nums">R{order.subtotal}</span>
              </div>

              {order.isExpress && (
                <div className="flex justify-between text-amber-700">
                  <span>Express Rush (+30%)</span>
                  <span className="font-semibold tabular-nums">+R{order.expressFee}</span>
                </div>
              )}

              <div className="flex justify-between text-slate-600 items-center">
                <span>Pickup &amp; Delivery</span>
                {order.deliveryFee === 0 ? (
                  <span className="text-emerald-600 font-bold">
                    {order.isFirstTimeCustomer ? 'FREE (1st-Time Customer Special)' : 'FREE (Over R200)'}
                  </span>
                ) : (
                  <span className="font-semibold tabular-nums">R{order.deliveryFee}</span>
                )}
              </div>

              <div className="border-t-2 border-slate-900 pt-3 flex justify-between items-baseline">
                <span className="text-sm font-black uppercase text-slate-900">
                  Total Due:
                </span>
                <span className="text-2xl font-black text-sky-700 font-display tabular-nums">
                  R{order.total}
                </span>
              </div>
            </div>
          </div>

          {/* Dedicated Payment Notice Cards */}
          {isCash && order.cashReceivedRecord && (
            <div className="bg-emerald-50 border-2 border-emerald-400 rounded-2xl p-5 space-y-3">
              <div className="flex items-center justify-between border-b border-emerald-200 pb-2">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  <span className="font-black text-emerald-950 uppercase tracking-wide text-sm">
                    CASH RECEIVED ✓
                  </span>
                </div>
                <span className="text-xs font-bold text-emerald-800 bg-white px-2.5 py-0.5 rounded-full border border-emerald-300">
                  Receipt #{order.cashReceivedRecord.receiptNumber || `CR-${order.id.replace(/[^0-9]/g, '')}`}
                </span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs text-emerald-950">
                <div className="bg-white/80 p-2.5 rounded-xl border border-emerald-200">
                  <span className="text-[10px] text-emerald-700 uppercase font-bold block">Amount Received</span>
                  <strong className="text-base font-black text-emerald-900">R{order.cashReceivedRecord.amountReceived}</strong>
                </div>
                <div className="bg-white/80 p-2.5 rounded-xl border border-emerald-200">
                  <span className="text-[10px] text-emerald-700 uppercase font-bold block">Date</span>
                  <strong className="text-slate-900">{order.cashReceivedRecord.date}</strong>
                </div>
                <div className="bg-white/80 p-2.5 rounded-xl border border-emerald-200">
                  <span className="text-[10px] text-emerald-700 uppercase font-bold block">Time</span>
                  <strong className="text-slate-900">{order.cashReceivedRecord.time}</strong>
                </div>
                <div className="bg-white/80 p-2.5 rounded-xl border border-emerald-200">
                  <span className="text-[10px] text-emerald-700 uppercase font-bold block">Order</span>
                  <strong className="text-slate-900">#{order.cashReceivedRecord.orderId}</strong>
                </div>
                <div className="bg-white/80 p-2.5 rounded-xl border border-emerald-200">
                  <span className="text-[10px] text-emerald-700 uppercase font-bold block">Customer</span>
                  <strong className="text-slate-900">{order.cashReceivedRecord.customerName}</strong>
                </div>
                <div className="bg-white/80 p-2.5 rounded-xl border border-emerald-200">
                  <span className="text-[10px] text-emerald-700 uppercase font-bold block">Person Who Confirmed</span>
                  <strong className="text-emerald-900">{order.cashReceivedRecord.confirmedBy}</strong>
                </div>
              </div>
            </div>
          )}

          {isCash && !order.cashReceivedRecord && (
            <div className="bg-amber-50 border-2 border-amber-300 rounded-2xl p-5 space-y-2">
              <div className="flex items-center justify-between border-b border-amber-200 pb-2">
                <div className="flex items-center gap-2">
                  <Banknote className="w-5 h-5 text-amber-700" />
                  <span className="font-black text-amber-950 uppercase tracking-wide text-sm">
                    Payment Method: CASH ON DELIVERY
                  </span>
                </div>
                <span className="text-xs font-black bg-amber-200 text-amber-900 px-2.5 py-0.5 rounded uppercase">
                  Payment Status: OUTSTANDING
                </span>
              </div>
              <p className="text-xs text-amber-900 leading-relaxed">
                The driver / authorized staff member collects the cash upon delivery.
              </p>
              <p className="text-[11px] text-slate-700">
                Then the admin marks: <strong>CASH RECEIVED ✓</strong>. The system records amount received, date, time, order #{order.id}, customer {order.customerName}, and person who confirmed payment.
              </p>
            </div>
          )}

          {isEft && (
            <div className="bg-sky-50 border-2 border-sky-400 rounded-2xl p-5 space-y-3">
              <div className="flex items-center justify-between border-b border-sky-200 pb-2">
                <div className="flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-sky-700" />
                  <span className="font-black text-slate-900 uppercase tracking-wide text-sm">
                    Gold Business Account 63111341466
                  </span>
                </div>
                <span className="text-xs font-bold bg-sky-200 text-sky-900 px-2.5 py-0.5 rounded uppercase">
                  Payment Method: EFT
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs bg-white p-4 rounded-xl border border-sky-200 font-mono">
                <div>
                  <p className="text-[10px] text-slate-400 uppercase font-sans font-medium">Payment Method</p>
                  <p className="font-black text-slate-900 text-sm">EFT</p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 uppercase font-sans font-medium">Bank</p>
                  <p className="font-black text-slate-900 text-sm">FNB</p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 uppercase font-sans font-medium">Account Holder</p>
                  <p className="font-black text-slate-900 text-sm">Gio’s Laundromat</p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 uppercase font-sans font-medium">Account Number</p>
                  <p className="font-black text-sky-700 text-sm tracking-wider">63111341466</p>
                </div>
                <div className="sm:col-span-2 pt-2 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <p className="text-[10px] text-slate-400 uppercase font-sans font-bold">Reference (Mandatory)</p>
                    <p className="font-black text-base text-slate-900 bg-sky-50 px-2.5 py-1 rounded border border-sky-200 inline-block mt-0.5">
                      {order.id}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] text-slate-400 uppercase font-sans font-bold">Payment Status</p>
                    <span className={`text-xs font-black uppercase px-2 py-0.5 rounded ${order.paymentStatus === 'paid' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'}`}>
                      {order.paymentStatus === 'paid' ? 'PAID & VERIFIED ✓' : 'OUTSTANDING'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-emerald-50 border border-emerald-300 p-2.5 rounded-xl text-xs text-emerald-950 font-bold flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <p>
                  THE INVOICE SHALL AUTOMATICALLY BE SENT TO YOU ONCE WEIGHING IS COMPLETE!
                </p>
              </div>
            </div>
          )}

          {!isCash && !isEft && (
            <div className="bg-sky-50 border border-sky-200 rounded-2xl p-4 flex items-center gap-3">
              <CreditCard className="w-6 h-6 text-sky-600 shrink-0" />
              <div className="text-xs text-sky-900">
                <p className="font-bold">No Online Card Payment Required</p>
                <p className="text-sky-800">
                  Our driver brings a Speedpoint card machine for wireless tap-to-pay or accepts exact cash when handing over your items.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer actions */}
        <div className="px-8 py-4 bg-slate-100 border-t border-slate-200 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-700 text-xs sm:text-sm font-semibold hover:bg-slate-50 transition-colors"
          >
            Close
          </button>
          <button
            onClick={handlePrint}
            className="px-5 py-2.5 rounded-xl bg-sky-600 text-white text-xs sm:text-sm font-semibold hover:bg-sky-700 transition-colors flex items-center gap-2"
          >
            <Printer className="w-4 h-4" />
            <span>Print Invoice</span>
          </button>
        </div>
      </div>
    </div>
  );
};
