import React, { useState } from 'react';
import {
  Calendar,
  Clock,
  MapPin,
  User,
  Phone,
  MessageCircle,
  Camera,
  Upload,
  X,
  CheckCircle,
  FileText,
  CreditCard,
  Plus,
  Trash2,
  Sparkles,
  Scale,
  AlertCircle,
  Award,
  Zap,
  Banknote,
  Copy,
  Check,
} from 'lucide-react';
import { BUSINESS_INFO, SERVICES, SUBURBS_COVERAGE, MEMBERSHIP_PACKAGES } from '../data/servicesData';
import { LaundryOrder, OrderItem, ShoePhotoUpload, OrderTimelineStep, MemberSubscription, PaymentMethodOption } from '../types';

interface BookingFormProps {
  initialItems?: OrderItem[];
  initialExpress?: boolean;
  subscriptions?: MemberSubscription[];
  initialMemberNumber?: string;
  onOrderCreated: (newOrder: LaundryOrder) => void;
  onViewInvoice?: (order: LaundryOrder) => void;
  onTrackOrder: (orderId: string) => void;
  onDeductMemberAllowance?: (
    memberNumber: string,
    coveredKg: number,
    overageKg: number,
    overageFee: number
  ) => void;
}

export const BookingForm: React.FC<BookingFormProps> = ({
  initialItems = [],
  initialExpress = false,
  subscriptions = [],
  initialMemberNumber = '',
  onOrderCreated,
  onViewInvoice,
  onTrackOrder,
  onDeductMemberAllowance,
}) => {
  // Member state
  const [memberNumberInput, setMemberNumberInput] = useState(initialMemberNumber);
  const [isMemberMode, setIsMemberMode] = useState(Boolean(initialMemberNumber));

  // Form fields
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const city = 'Pietermaritzburg' as const;
  const [suburb, setSuburb] = useState('Scottsville');
  const [pickupDate, setPickupDate] = useState(() => {
    // Tomorrow as default (skip Sunday to Monday since Sundays are delivery-only)
    const d = new Date();
    d.setDate(d.getDate() + 1);
    if (d.getDay() === 0) {
      d.setDate(d.getDate() + 1);
    }
    return d.toISOString().split('T')[0];
  });
  const [pickupTimeSlot, setPickupTimeSlot] = useState('Morning (09h00 – 12h00)');

  const isSelectedDateSunday = () => {
    if (!pickupDate) return false;
    const d = new Date(pickupDate + 'T00:00:00');
    return d.getDay() === 0;
  };
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [isExpress, setIsExpress] = useState(initialExpress);

  // Selected Services
  const [selectedItems, setSelectedItems] = useState<OrderItem[]>(() => {
    if (initialItems.length > 0) return initialItems;
    // Default starting selection
    return [
      {
        serviceId: 'wash-dry',
        serviceName: 'Wash and Dry',
        quantity: 5,
        unitPrice: 29,
        unit: 'kg',
        total: 145,
      },
    ];
  });

  // Shoe Photo Uploads for condition check
  const [shoePhotos, setShoePhotos] = useState<ShoePhotoUpload[]>([]);
  const [photoNoteInput, setPhotoNoteInput] = useState('');

  // First-time customer promotion (Free doorstep pickup & delivery)
  const [isFirstTimeCustomer, setIsFirstTimeCustomer] = useState(true);

  // Payment method selection
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethodOption>('Cash on Delivery');
  const [copiedEft, setCopiedEft] = useState(false);

  // Submission state
  const [submittedOrder, setSubmittedOrder] = useState<LaundryOrder | null>(null);
  const [validationError, setValidationError] = useState('');

  // Look up verified subscriber
  const verifiedMember = React.useMemo(() => {
    if (!memberNumberInput.trim()) return null;
    const clean = memberNumberInput.trim().toUpperCase();
    return subscriptions.find((s) => s.membershipNumber.toUpperCase() === clean) || null;
  }, [memberNumberInput, subscriptions]);

  // If member is verified, auto-fill contact fields if empty
  React.useEffect(() => {
    if (verifiedMember) {
      if (!name) setName(verifiedMember.customerName);
      if (!phone) setPhone(verifiedMember.phone);
      if (!address) setAddress(verifiedMember.address);
      if (!suburb) setSuburb(verifiedMember.suburb);
    }
  }, [verifiedMember]);

  // Update memberNumberInput if initialMemberNumber changes
  React.useEffect(() => {
    if (initialMemberNumber) {
      setMemberNumberInput(initialMemberNumber);
      setIsMemberMode(true);
    }
  }, [initialMemberNumber]);

  // Calculate Member Allowance coverage vs Regular Subtotal
  const pkgConfig = React.useMemo(() => {
    if (!verifiedMember) return null;
    return MEMBERSHIP_PACKAGES.find((p) => p.id === verifiedMember.tierId) || null;
  }, [verifiedMember]);

  // Compute laundry weight (wash & fold items)
  const laundryItems = selectedItems.filter((i) => i.unit === 'kg');
  const totalLaundryKg = laundryItems.reduce((acc, i) => acc + i.quantity, 0);

  const memberCoveredKg = verifiedMember
    ? Math.min(totalLaundryKg, verifiedMember.remainingKg)
    : 0;
  const memberOverageKg = verifiedMember
    ? Math.max(0, totalLaundryKg - verifiedMember.remainingKg)
    : 0;
  const memberRate = pkgConfig?.memberOverAllowanceRate || 24;
  const memberOverageFee = Math.round(memberOverageKg * memberRate);

  const nonLaundrySubtotal = selectedItems
    .filter((i) => i.unit !== 'kg')
    .reduce((acc, item) => acc + item.total, 0);

  // Subtotal:
  // If member: non-laundry items + member overage fee (covered kg is R0)
  // Else: standard item sum
  const subtotal = verifiedMember
    ? nonLaundrySubtotal + memberOverageFee
    : selectedItems.reduce((acc, item) => acc + item.total, 0);

  const expressFee = isExpress && subtotal > 0 ? Math.round(subtotal * 0.3) : 0;
  const isFreeDelivery = isFirstTimeCustomer || subtotal >= BUSINESS_INFO.freeDeliveryThreshold;
  const deliveryFee = isFreeDelivery ? 0 : BUSINESS_INFO.standardDeliveryFee;
  const total = subtotal + expressFee + deliveryFee;

  // Filter suburbs by city
  const availableSuburbs = SUBURBS_COVERAGE.filter((s) => s.city === city);

  // Handle service toggle/quantity change
  const handleToggleService = (serviceId: string) => {
    const existing = selectedItems.find((i) => i.serviceId === serviceId);
    if (existing) {
      setSelectedItems(selectedItems.filter((i) => i.serviceId !== serviceId));
    } else {
      const s = SERVICES.find((item) => item.id === serviceId);
      if (!s) return;
      const initialQty = s.category === 'laundry' ? 5 : 1;
      setSelectedItems([
        ...selectedItems,
        {
          serviceId: s.id,
          serviceName: s.name,
          quantity: initialQty,
          unitPrice: s.pricePerUnit,
          unit: s.unit,
          total: initialQty * s.pricePerUnit,
        },
      ]);
    }
  };

  const handleUpdateQuantity = (serviceId: string, newQty: number) => {
    if (newQty <= 0) {
      setSelectedItems(selectedItems.filter((i) => i.serviceId !== serviceId));
      return;
    }
    setSelectedItems(
      selectedItems.map((item) => {
        if (item.serviceId === serviceId) {
          return {
            ...item,
            quantity: newQty,
            total: newQty * item.unitPrice,
          };
        }
        return item;
      })
    );
  };

  // Photo upload handling (FileReader dataUrl)
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      const newPhoto: ShoePhotoUpload = {
        id: `photo-${Date.now()}`,
        dataUrl,
        fileName: file.name,
        notes: photoNoteInput || 'Pre-cleaning condition check',
      };
      setShoePhotos((prev) => [...prev, newPhoto]);
      setPhotoNoteInput('');
    };
    reader.readAsDataURL(file);
  };

  const handleRemovePhoto = (id: string) => {
    setShoePhotos(shoePhotos.filter((p) => p.id !== id));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError('');

    if (!name.trim()) {
      setValidationError('Please enter your full name.');
      return;
    }
    if (!phone.trim() || phone.length < 9) {
      setValidationError('Please enter a valid South African phone number (e.g. 082 123 4567).');
      return;
    }
    if (!address.trim()) {
      setValidationError('Please enter your physical street address.');
      return;
    }
    if (isSelectedDateSunday()) {
      setValidationError('Sundays are strictly reserved for Deliveries Only (no pickups). Please choose a pickup date from Monday to Saturday.');
      return;
    }
    if (selectedItems.length === 0) {
      setValidationError('Please select at least one service for your pickup.');
      return;
    }

    const orderId = `GIO-${Math.floor(1000 + Math.random() * 9000)}`;
    const now = new Date();
    const dateFormatted = `${now.toISOString().split('T')[0]} ${String(now.getHours()).padStart(2, '0')}:${String(
      now.getMinutes()
    ).padStart(2, '0')}`;

    const timeline: OrderTimelineStep[] = [
      {
        status: 'confirmed',
        label: 'Order Scheduled',
        description: `Pickup confirmed for ${pickupDate} during ${pickupTimeSlot}`,
        timestamp: 'Just now',
        completed: true,
        current: true,
      },
      {
        status: 'picked_up',
        label: 'Doorstep Collection',
        description: 'Courier en route to collect laundry bags & shoes',
        completed: false,
        current: false,
      },
      {
        status: 'in_cleaning',
        label: 'Eco Wash & Shoe Spa',
        description: 'Garments sorted and washed; footwear in specialized spa treatment',
        completed: false,
        current: false,
      },
      {
        status: 'quality_checked',
        label: 'Steam Pressing & Inspection',
        description: 'Final quality control, fresh folding and UV sanitization',
        completed: false,
        current: false,
      },
      {
        status: 'out_for_delivery',
        label: 'Out for Delivery',
        description: 'Courier dispatched to your address with mobile card machine',
        completed: false,
        current: false,
      },
      {
        status: 'delivered',
        label: 'Delivered Fresh & Clean',
        description: 'Order handed over; payment receipt issued',
        completed: false,
        current: false,
      },
    ];

    const newOrder: LaundryOrder = {
      id: orderId,
      customerName: name,
      phone,
      email: email || undefined,
      address,
      suburb,
      city,
      pickupDate,
      pickupTimeSlot,
      specialInstructions: specialInstructions || undefined,
      status: 'new_request',
      createdAt: dateFormatted,
      estimatedDelivery: isExpress ? 'Within 24 Hours' : 'Within 48 Hours',
      items: selectedItems,
      subtotal,
      deliveryFee,
      isExpress,
      expressFee,
      total,
      paymentMethod: selectedPaymentMethod,
      paymentStatus: 'outstanding',
      shoePhotos: shoePhotos.length > 0 ? shoePhotos : undefined,
      driverName: 'Sipho M. (Area Courier)',
      driverVehicle: 'Toyota Proace Van',
      timeline,
      isWeighed: false,
      invoiceIssued: false,
      isFirstTimeCustomer,
      memberNumber: verifiedMember ? verifiedMember.membershipNumber : undefined,
      membershipTier: verifiedMember ? verifiedMember.tierId : undefined,
      isMemberBooking: Boolean(verifiedMember),
      memberKgCovered: verifiedMember ? memberCoveredKg : undefined,
      memberOverageKg: verifiedMember && memberOverageKg > 0 ? memberOverageKg : undefined,
      memberOverageFee: verifiedMember && memberOverageFee > 0 ? memberOverageFee : undefined,
    };

    if (verifiedMember && onDeductMemberAllowance) {
      onDeductMemberAllowance(verifiedMember.membershipNumber, memberCoveredKg, memberOverageKg, memberOverageFee);
    }

    onOrderCreated(newOrder);
    setSubmittedOrder(newOrder);
  };

  // WhatsApp message builder
  const getWhatsAppMessageUrl = (order: LaundryOrder) => {
    const itemsList = order.items
      .map((i) => `• ${i.serviceName}: ${i.quantity} ${i.unit} (R${i.total})`)
      .join('\n');

    const paymentInfoMsg = order.paymentMethod === 'Cash on Delivery'
      ? `*Payment Method:* CASH ON DELIVERY\n*Payment Status:* OUTSTANDING (Driver collects cash on delivery; Admin marks CASH RECEIVED ✓)`
      : order.paymentMethod === 'EFT Bank Transfer'
      ? `*Payment Method:* EFT\n*Bank:* FNB\n*Account Holder:* Gio’s Laundromat\n*Account Number:* 63111341466\n*Account Type:* Gold Business Account\n*Reference:* ${order.id}\n_(Official invoice will automatically be sent once certified weighing is complete)_`
      : `*Payment Method:* Speedpoint Mobile Card Machine on Delivery`;

    const msg = `*NEW BOOKING #${order.id} - GIO'S LAUNDROMAT (PMB)*
---------------------------
*Customer:* ${order.customerName}
*Phone:* ${order.phone}
*Address:* ${order.address}, ${order.suburb} (Pietermaritzburg)
${order.isMemberBooking ? `*Gio's Membership:* ${order.memberNumber} (${order.memberKgCovered}kg covered by monthly allowance)` : ''}
*Pickup Date:* ${order.pickupDate}
*Time Slot:* ${order.pickupTimeSlot}
*First-Time Customer Promo:* ${order.isFirstTimeCustomer ? 'YES (100% Free Doorstep Pickup & Delivery Applied)' : 'Returning Customer'}
*Express:* ${order.isExpress ? 'YES (Same-Day / 24hr)' : 'Standard (24-48hr)'}

*Services Requested:*
${itemsList}

${order.isMemberBooking ? `*Allowance Applied:* ${order.memberKgCovered} kg wash-and-fold covered (R0)\n${order.memberOverageKg ? `*Overage Laundry:* ${order.memberOverageKg} kg @ Member Rate = +R${order.memberOverageFee}\n` : ''}` : ''}*Subtotal:* R${order.subtotal}
*Delivery:* ${order.deliveryFee === 0 ? (order.isFirstTimeCustomer ? 'FREE (First-Time Customer Special)' : 'FREE (Over R200 in PMB)') : `R${order.deliveryFee}`}
*Total Estimated Due:* R${order.total}
${paymentInfoMsg}

*Special Notes:* ${order.specialInstructions || 'None'}
${order.shoePhotos && order.shoePhotos.length > 0 ? `*Shoe Photos:* ${order.shoePhotos.length} photo(s) submitted for condition check` : ''}`;

    return `https://wa.me/${BUSINESS_INFO.whatsappRaw}?text=${encodeURIComponent(msg)}`;
  };

  return (
    <section id="booking-section" className="py-16 sm:py-24 bg-sky-50/50 border-b border-slate-200">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {submittedOrder ? (
          /* Confirmation State */
          <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200 shadow-xl text-center space-y-6 animate-fade-in">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle className="w-10 h-10" />
            </div>

            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                Booking Confirmed · Order #{submittedOrder.id}
              </span>
              <h2 className="text-3xl font-extrabold text-slate-900 font-display">
                You're All Set, {submittedOrder.customerName}!
              </h2>
              <p className="text-slate-600 max-w-lg mx-auto text-sm">
                We've scheduled our driver to collect your laundry &amp; shoes on{' '}
                <strong className="text-slate-900">{submittedOrder.pickupDate}</strong> during{' '}
                <strong className="text-slate-900">{submittedOrder.pickupTimeSlot}</strong>.
              </p>
            </div>

            {/* Quick summary ticket */}
            <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200 text-left max-w-lg mx-auto space-y-3 text-xs sm:text-sm">
              <div className="flex justify-between border-b border-slate-200 pb-2">
                <span className="text-slate-500">Pickup Address:</span>
                <span className="font-semibold text-slate-800 text-right">
                  {submittedOrder.address}, {submittedOrder.suburb}
                </span>
              </div>
              <div className="flex justify-between border-b border-slate-200 pb-2">
                <span className="text-slate-500">Estimated Total:</span>
                <span className="font-bold text-sky-700 text-base tabular-nums">
                  R{submittedOrder.total}
                </span>
              </div>
              {submittedOrder.isFirstTimeCustomer && (
                <div className="flex justify-between border-b border-slate-200 pb-2 bg-emerald-50/80 -mx-2 px-2 py-1.5 rounded-lg border border-emerald-200/60">
                  <span className="text-emerald-800 font-semibold flex items-center gap-1 text-xs">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                    <span>First-Time Customer Promo:</span>
                  </span>
                  <span className="font-bold text-emerald-700 text-xs">
                    100% FREE Pickup &amp; Delivery Applied
                  </span>
                </div>
              )}

              {/* Specific Payment Method Card on Confirmation */}
              {submittedOrder.paymentMethod === 'Cash on Delivery' && (
                <div className="bg-amber-50 rounded-xl p-3.5 border border-amber-300 space-y-1.5 text-xs text-amber-950">
                  <div className="flex items-center justify-between border-b border-amber-200 pb-1">
                    <span className="font-bold uppercase text-[11px] text-amber-900">Payment Method: CASH ON DELIVERY</span>
                    <span className="bg-amber-200 text-amber-900 px-2 py-0.5 rounded text-[10px] font-black uppercase">
                      Payment Status: OUTSTANDING
                    </span>
                  </div>
                  <p className="text-slate-700 leading-relaxed text-[11px]">
                    The driver / authorized staff member collects the cash upon handover.
                  </p>
                  <p className="text-[11px] text-amber-900 font-medium">
                    Then the admin marks: <strong>CASH RECEIVED ✓</strong> (recording amount received, date, time, order #{submittedOrder.id}, customer, and person who confirmed payment).
                  </p>
                </div>
              )}

              {submittedOrder.paymentMethod === 'EFT Bank Transfer' && (
                <div className="bg-sky-50 rounded-xl p-4 border-2 border-sky-400 space-y-2.5 text-xs">
                  <div className="flex items-center justify-between border-b border-sky-200 pb-1">
                    <span className="font-black text-slate-900 text-xs uppercase tracking-wide">
                      Gold Business Account 63111341466
                    </span>
                    <span className="bg-sky-200 text-sky-900 px-2 py-0.5 rounded text-[10px] font-bold">
                      Payment Method: EFT
                    </span>
                  </div>

                  <div className="bg-white p-2.5 rounded-lg border border-sky-200 space-y-1 font-mono text-[11px] text-slate-800">
                    <div className="flex justify-between">
                      <span className="text-slate-500 font-sans">Bank:</span>
                      <strong className="text-slate-900">FNB</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500 font-sans">Account Holder:</span>
                      <strong className="text-slate-900">Gio’s Laundromat</strong>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-500 font-sans">Account Number:</span>
                      <strong className="text-sky-700 text-xs">63111341466</strong>
                    </div>
                    <div className="flex justify-between items-center pt-1 border-t border-slate-100">
                      <span className="text-slate-500 font-sans font-bold">Reference:</span>
                      <strong className="bg-sky-50 px-2 py-0.5 rounded border border-sky-200 text-slate-900 text-xs">
                        {submittedOrder.id}
                      </strong>
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-2 pt-0.5">
                    <button
                      type="button"
                      onClick={() => {
                        navigator.clipboard.writeText(`Bank: FNB\nAccount Holder: Gio's Laundromat\nAccount Number: 63111341466\nAccount Type: Gold Business Account\nReference: ${submittedOrder.id}`);
                        setCopiedEft(true);
                        setTimeout(() => setCopiedEft(false), 2000);
                      }}
                      className="px-2.5 py-1 rounded-lg bg-sky-100 hover:bg-sky-200 text-sky-800 font-bold text-[11px] flex items-center gap-1 cursor-pointer transition-colors"
                    >
                      {copiedEft ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedEft ? 'Copied Details!' : 'Copy Bank Details'}</span>
                    </button>
                    <span className="text-[10px] text-sky-800 font-semibold">Ref: {submittedOrder.id}</span>
                  </div>

                  <div className="p-2 rounded-lg bg-emerald-50 border border-emerald-300 text-[11px] text-emerald-950 font-bold flex items-start gap-1.5">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                    <span>THE INVOICE SHALL AUTOMATICALLY BE SENT TO YOU ONCE WEIGHING IS COMPLETE!</span>
                  </div>
                </div>
              )}

              {submittedOrder.paymentMethod === 'Speedpoint Card Machine on Delivery' && (
                <div className="flex items-center gap-2 text-slate-600 pt-1">
                  <CreditCard className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span className="text-xs font-medium">
                    Speedpoint card machine will be brought by driver for wireless tap-to-pay on delivery.
                  </span>
                </div>
              )}

              {/* Doorstep Weighing & Staff Tax Invoice Notice */}
              <div className="mt-3 pt-3 border-t border-slate-200 bg-sky-50/80 -mx-2 p-3 rounded-xl border border-sky-200/80 flex items-start gap-2.5">
                <Scale className="w-4 h-4 text-[#00AEEF] shrink-0 mt-0.5" />
                <div className="text-xs text-slate-700 space-y-0.5">
                  <p className="font-bold text-slate-900">
                    Doorstep Certified Digital Scale Weighing
                  </p>
                  <p className="text-slate-600 leading-relaxed text-[11px]">
                    Our courier will weigh your garments on certified digital scales at your doorstep. Your official tax invoice will be issued by staff once collection &amp; weighing are verified.
                  </p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <a
                href={getWhatsAppMessageUrl(submittedOrder)}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-sm shadow-md transition-colors"
              >
                <MessageCircle className="w-4 h-4 text-white" />
                <span>Send Booking to WhatsApp</span>
              </a>

              <button
                onClick={() => onTrackOrder(submittedOrder.id)}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-[#00AEEF] hover:bg-sky-500 text-white font-bold text-sm shadow-sm transition-colors"
              >
                <span>Track Live Pickup</span>
              </button>
            </div>

            <p className="text-xs text-slate-500 pt-2">
              A copy has also been saved to your browser session for live order tracking.
            </p>
          </div>
        ) : (
          /* Main Form */
          <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-xl space-y-8">
            <div className="text-center max-w-xl mx-auto">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-100 text-sky-800 text-xs font-semibold mb-2">
                <Sparkles className="w-3.5 h-3.5 text-sky-600" />
                <span>30-Second Schedule</span>
              </div>
              <h2 className="text-3xl font-extrabold text-slate-900 font-display">
                Schedule Your Laundry &amp; Shoe Pickup
              </h2>
              <p className="text-slate-600 text-sm mt-1">
                Enter your details below. We'll send our driver to your door anywhere in Pietermaritzburg.
              </p>
            </div>

            {validationError && (
              <div className="bg-rose-50 border border-rose-200 text-rose-700 text-xs sm:text-sm p-4 rounded-xl flex items-center gap-2">
                <span className="font-bold">Notice:</span> {validationError}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-8">
              {/* First-Time Customer Special Offer Banner */}
              <div className="bg-gradient-to-r from-emerald-500/15 via-sky-500/10 to-emerald-500/15 border-2 border-emerald-400/80 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm">
                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                    <Sparkles className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-extrabold text-slate-900 text-sm sm:text-base">
                        First-Time Customer?
                      </span>
                      <span className="bg-emerald-600 text-white text-[11px] font-black uppercase px-2.5 py-0.5 rounded-full tracking-wider shadow-sm">
                        100% Free Pickup &amp; Delivery
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed">
                      First time using Gio's Laundromat? Doorstep pick-up and delivery are <strong className="text-emerald-700">100% FREE</strong> across Pietermaritzburg on your first booking!
                    </p>
                  </div>
                </div>

                <label className="flex items-center gap-2.5 bg-white px-3.5 py-2 rounded-xl border border-emerald-300 shadow-sm cursor-pointer hover:border-emerald-500 transition-colors shrink-0 self-end sm:self-center">
                  <input
                    type="checkbox"
                    checked={isFirstTimeCustomer}
                    onChange={(e) => setIsFirstTimeCustomer(e.target.checked)}
                    className="w-4 h-4 text-emerald-600 focus:ring-emerald-500 rounded cursor-pointer"
                  />
                  <span className="text-xs font-bold text-slate-800 whitespace-nowrap">
                    I am a First-Time Customer
                  </span>
                </label>
              </div>

              {/* Step 1: Customer Contact */}
              <div className="space-y-4">
                {/* Gio's Membership Profile & Allowance Card */}
                <div className="bg-gradient-to-r from-sky-950 via-slate-900 to-sky-950 border border-sky-500/40 rounded-2xl p-4 sm:p-5 text-white space-y-3 shadow-md">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <Award className="w-5 h-5 text-amber-400" />
                      <span className="font-bold text-sm text-white font-display">
                        Gio's Member? Apply Monthly Wash Allowance
                      </span>
                    </div>
                    <label className="flex items-center gap-2 text-xs text-sky-200 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={isMemberMode}
                        onChange={(e) => {
                          setIsMemberMode(e.target.checked);
                          if (!e.target.checked) setMemberNumberInput('');
                        }}
                        className="w-4 h-4 rounded text-[#00AEEF] focus:ring-[#00AEEF]"
                      />
                      <span>I have a Membership Code</span>
                    </label>
                  </div>

                  {isMemberMode && (
                    <div className="space-y-3 pt-1">
                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder="Enter Membership # (e.g. GIO04081)"
                          value={memberNumberInput}
                          onChange={(e) => setMemberNumberInput(e.target.value.toUpperCase())}
                          className="flex-1 px-3.5 py-2.5 bg-slate-800/90 border border-slate-700 rounded-xl text-xs sm:text-sm font-bold text-white placeholder:text-slate-500 focus:border-[#00AEEF] focus:outline-none uppercase"
                        />
                      </div>

                      {verifiedMember ? (
                        <div className="bg-emerald-950/70 border border-emerald-500/40 rounded-xl p-3.5 space-y-2 text-xs text-emerald-200">
                          <div className="flex items-center justify-between">
                            <span className="font-black text-emerald-300 flex items-center gap-1.5 text-sm">
                              <CheckCircle className="w-4 h-4 text-emerald-400" />
                              <span>Verified: {verifiedMember.customerName} ({verifiedMember.packageName})</span>
                            </span>
                            <span className="font-bold text-white tabular-nums bg-emerald-900/60 px-2 py-0.5 rounded-full border border-emerald-500/30">
                              {verifiedMember.remainingKg.toFixed(1)} kg remaining
                            </span>
                          </div>
                          <div className="text-[11px] text-slate-300 space-y-0.5">
                            <p>
                              • Wash Allowance: <strong className="text-white">{memberCoveredKg.toFixed(1)} kg</strong> covered at <strong className="text-emerald-400">R0</strong>
                            </p>
                            {memberOverageKg > 0 && (
                              <p className="text-amber-300 font-semibold">
                                • Extra laundry: {memberOverageKg.toFixed(1)} kg @ discounted member rate R{memberRate}/kg = +R{memberOverageFee}
                              </p>
                            )}
                            <p className="text-slate-400">
                              • Collection &amp; delivery charged separately as per membership terms.
                            </p>
                          </div>
                        </div>
                      ) : memberNumberInput.trim() ? (
                        <p className="text-xs text-amber-300">
                          Searching for #{memberNumberInput}... Try demo subscriber <strong className="text-white">GIO04081</strong>.
                        </p>
                      ) : (
                        <p className="text-[11px] text-slate-400">
                          Enter your membership code (e.g. GIO04081) to automatically apply your monthly allowance.
                        </p>
                      )}
                    </div>
                  )}
                </div>

                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 pb-2">
                  <User className="w-4 h-4 text-sky-600" />
                  <span>1. Contact &amp; Location Details</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Lindiwe Dlamini"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-sky-500 focus:ring-2 focus:ring-sky-200 text-sm text-slate-900 transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      WhatsApp / Phone Number *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="e.g. 082 345 6789"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-sky-500 focus:ring-2 focus:ring-sky-200 text-sm text-slate-900 transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Email Address (Optional)
                    </label>
                    <input
                      type="email"
                      placeholder="For invoice copy"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-sky-500 focus:ring-2 focus:ring-sky-200 text-sm text-slate-900 transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Service Region
                    </label>
                    <div className="px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-bold text-slate-800 flex items-center justify-between">
                      <span>Pietermaritzburg &amp; Surrounds</span>
                      <span className="text-[10px] bg-sky-100 text-sky-800 font-bold px-2 py-0.5 rounded">PMB ONLY</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Suburb / Area *
                    </label>
                    <select
                      value={suburb}
                      onChange={(e) => setSuburb(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-sky-500 focus:ring-2 focus:ring-sky-200 text-sm text-slate-900 bg-white"
                    >
                      {availableSuburbs.map((sub) => (
                        <option key={sub.name} value={sub.name}>
                          {sub.name} ({sub.turnaroundHours})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Street Address &amp; House/Unit No. *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. 14 Ridge Road, Complex Unit 3B"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-sky-500 focus:ring-2 focus:ring-sky-200 text-sm text-slate-900 transition-colors"
                    />
                  </div>
                </div>
              </div>

              {/* Step 2: Date & Time Window */}
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 pb-2">
                  <Calendar className="w-4 h-4 text-sky-600" />
                  <span>2. Schedule Date &amp; Time</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Pickup Date *
                    </label>
                    <input
                      type="date"
                      required
                      min={new Date().toISOString().split('T')[0]}
                      value={pickupDate}
                      onChange={(e) => {
                        setPickupDate(e.target.value);
                        if (validationError) setValidationError('');
                      }}
                      className={`w-full px-3.5 py-2.5 rounded-xl border text-sm text-slate-900 bg-white ${
                        isSelectedDateSunday()
                          ? 'border-amber-400 focus:border-amber-500 focus:ring-amber-200'
                          : 'border-slate-300 focus:border-sky-500 focus:ring-2 focus:ring-sky-200'
                      }`}
                    />
                    {isSelectedDateSunday() && (
                      <div className="mt-2 p-2.5 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 flex items-start gap-2 animate-shake">
                        <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                        <div>
                          <p className="font-bold">Sundays are Deliveries Only</p>
                          <p className="text-[11px] text-amber-800">
                            No collections/pickups operate on Sundays. Please choose a date from Monday to Saturday.
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Preferred Pickup Time Slot *
                    </label>
                    <select
                      value={pickupTimeSlot}
                      onChange={(e) => setPickupTimeSlot(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-sky-500 focus:ring-2 focus:ring-sky-200 text-sm text-slate-900 bg-white font-medium"
                    >
                      <option value="Morning (09h00 – 12h00)">Morning (09h00 am – 12h00)</option>
                      <option value="Afternoon (14h00 – 17h00)">Afternoon (14h00 – 17h00)</option>
                    </select>
                    <p className="text-[11px] text-slate-500 mt-1.5 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-[#00AEEF] shrink-0" />
                      <span>Mon – Sat pickup hours: 09h00–12h00 &amp; 14h00–17h00</span>
                    </p>
                  </div>
                </div>
              </div>

              {/* Step 3: Select Services */}
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center justify-between border-b border-slate-100 pb-2">
                  <span className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-sky-600" />
                    <span>3. Choose Your Services &amp; Quantities</span>
                  </span>
                  <span className="text-xs font-normal text-slate-500">
                    Weights finalized on certified mobile scales at your door
                  </span>
                </h3>

                <div className="space-y-3">
                  {SERVICES.map((s) => {
                    const isSelected = selectedItems.some((i) => i.serviceId === s.id);
                    const currentItem = selectedItems.find((i) => i.serviceId === s.id);

                    return (
                      <div
                        key={s.id}
                        className={`rounded-2xl p-4 border transition-all ${
                          isSelected
                            ? 'bg-sky-50/60 border-sky-400 shadow-sm'
                            : 'bg-white border-slate-200 hover:border-slate-300'
                        } flex flex-col sm:flex-row sm:items-center justify-between gap-3`}
                      >
                        <div className="flex items-start gap-3">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => handleToggleService(s.id)}
                            className="w-5 h-5 rounded text-sky-600 focus:ring-sky-500 mt-1 cursor-pointer"
                          />
                          <div>
                            <p className="text-sm font-bold text-slate-900">{s.name}</p>
                            <p className="text-xs text-slate-500">{s.shortDesc}</p>
                            <p className="text-xs font-semibold text-sky-700 mt-0.5">
                              R{s.pricePerUnit} per {s.unit}
                            </p>
                          </div>
                        </div>

                        {isSelected && currentItem && (
                          <div className="flex items-center gap-3 self-end sm:self-center bg-white px-3 py-1.5 rounded-xl border border-slate-200">
                            <span className="text-xs font-medium text-slate-600">Qty ({s.unit}):</span>
                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                onClick={() => handleUpdateQuantity(s.id, currentItem.quantity - 1)}
                                className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-slate-200 font-bold text-slate-700 flex items-center justify-center text-xs"
                              >
                                -
                              </button>
                              <span className="font-bold text-slate-900 text-sm tabular-nums w-6 text-center">
                                {currentItem.quantity}
                              </span>
                              <button
                                type="button"
                                onClick={() => handleUpdateQuantity(s.id, currentItem.quantity + 1)}
                                className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-slate-200 font-bold text-slate-700 flex items-center justify-center text-xs"
                              >
                                +
                              </button>
                            </div>
                            <span className="font-extrabold text-slate-900 text-xs sm:text-sm tabular-nums ml-2">
                              R{currentItem.total}
                            </span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Step 4: Photo Upload for Shoe Condition Assessment */}
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center justify-between border-b border-slate-100 pb-2">
                  <span className="flex items-center gap-2">
                    <Camera className="w-4 h-4 text-sky-600" />
                    <span>4. Shoe Spa Condition Photos (Optional)</span>
                  </span>
                  <span className="text-xs font-normal text-slate-500">
                    Snap or upload for instant condition assessment
                  </span>
                </h3>

                <p className="text-xs text-slate-600">
                  Sending sneakers, suede boots, or heels? Upload a quick photo of scuffs, soles, or stains so our craftsmen can prepare the exact cleaning formula in advance.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-start">
                  <div className="border-2 border-dashed border-slate-300 hover:border-sky-400 rounded-2xl p-5 text-center cursor-pointer transition-colors relative bg-slate-50">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoUpload}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <Upload className="w-8 h-8 text-sky-500 mx-auto mb-2" />
                    <p className="text-xs font-bold text-slate-800">
                      Tap or Drag Photo of Your Shoes
                    </p>
                    <p className="text-[11px] text-slate-500 mt-1">PNG, JPG, HEIC up to 10MB</p>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Notes on Shoe Condition (Optional)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Nike Jordan 4 sole yellowing, coffee stain on toe"
                      value={photoNoteInput}
                      onChange={(e) => setPhotoNoteInput(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-sky-500 text-xs text-slate-900"
                    />
                    <p className="text-[11px] text-slate-400 mt-1">
                      You can also hand them directly to the courier during pickup.
                    </p>
                  </div>
                </div>

                {/* Uploaded Photos Preview List */}
                {shoePhotos.length > 0 && (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
                    {shoePhotos.map((photo) => (
                      <div
                        key={photo.id}
                        className="relative rounded-xl overflow-hidden border border-slate-200 bg-white p-2 group shadow-sm"
                      >
                        <img
                          src={photo.dataUrl}
                          alt="Shoe condition upload"
                          className="w-full h-24 object-cover rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemovePhoto(photo.id)}
                          className="absolute top-3 right-3 w-6 h-6 rounded-full bg-slate-900/80 text-white flex items-center justify-center hover:bg-rose-600 transition-colors"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                        <p className="text-[11px] text-slate-600 truncate mt-1.5 font-medium">
                          {photo.notes}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Step 5: Special Instructions */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Special Instructions / Gate Code / Delicate Care Notes
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. Ring intercom #104, please use hypoallergenic wash for baby clothes, separate delicate blouses."
                  value={specialInstructions}
                  onChange={(e) => setSpecialInstructions(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-sky-500 focus:ring-2 focus:ring-sky-200 text-xs sm:text-sm text-slate-900 transition-colors"
                />
              </div>

              {/* Step 5: Select Payment Method */}
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center justify-between border-b border-slate-100 pb-2">
                  <span className="flex items-center gap-2">
                    <CreditCard className="w-4 h-4 text-sky-600" />
                    <span>5. Choose Payment Method</span>
                  </span>
                  <span className="text-xs font-normal text-slate-500">
                    Cash on delivery, EFT transfer, or card machine
                  </span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {/* Option 1: Cash on Delivery */}
                  <div
                    onClick={() => setSelectedPaymentMethod('Cash on Delivery')}
                    className={`rounded-2xl p-4 border-2 cursor-pointer transition-all ${
                      selectedPaymentMethod === 'Cash on Delivery'
                        ? 'bg-amber-50/80 border-amber-500 shadow-sm ring-2 ring-amber-400/40'
                        : 'bg-white border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
                        <Banknote className="w-4 h-4" />
                      </div>
                      <input
                        type="radio"
                        name="bookingPaymentMethod"
                        checked={selectedPaymentMethod === 'Cash on Delivery'}
                        onChange={() => setSelectedPaymentMethod('Cash on Delivery')}
                        className="w-4 h-4 text-amber-600 focus:ring-amber-500"
                      />
                    </div>
                    <p className="text-xs font-black text-slate-900 uppercase tracking-wide">
                      Cash on Delivery
                    </p>
                    <span className="inline-block mt-1 text-[10px] font-black uppercase px-2 py-0.5 rounded bg-amber-200 text-amber-900">
                      Payment Status: OUTSTANDING
                    </span>
                    <p className="text-[11px] text-slate-600 mt-2 leading-relaxed">
                      Driver collects cash upon handover. Admin marks <strong>CASH RECEIVED ✓</strong> recording amount, date, time, order, customer, and confirmed staff.
                    </p>
                  </div>

                  {/* Option 2: EFT Bank Transfer */}
                  <div
                    onClick={() => setSelectedPaymentMethod('EFT Bank Transfer')}
                    className={`rounded-2xl p-4 border-2 cursor-pointer transition-all ${
                      selectedPaymentMethod === 'EFT Bank Transfer'
                        ? 'bg-sky-50/80 border-[#00AEEF] shadow-sm ring-2 ring-[#00AEEF]/40'
                        : 'bg-white border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="w-8 h-8 rounded-lg bg-sky-100 text-[#00AEEF] flex items-center justify-center font-bold">
                        <CreditCard className="w-4 h-4" />
                      </div>
                      <input
                        type="radio"
                        name="bookingPaymentMethod"
                        checked={selectedPaymentMethod === 'EFT Bank Transfer'}
                        onChange={() => setSelectedPaymentMethod('EFT Bank Transfer')}
                        className="w-4 h-4 text-sky-600 focus:ring-sky-500"
                      />
                    </div>
                    <p className="text-xs font-black text-slate-900 uppercase tracking-wide">
                      EFT Bank Transfer
                    </p>
                    <span className="inline-block mt-1 text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-sky-100 text-sky-800">
                      FNB Gold Business
                    </span>
                    <p className="text-[11px] text-slate-600 mt-2 leading-relaxed">
                      Gold Business Account 63111341466. <strong>The invoice shall automatically be sent to you once weighing is complete!</strong>
                    </p>
                  </div>

                  {/* Option 3: Speedpoint Card Machine */}
                  <div
                    onClick={() => setSelectedPaymentMethod('Speedpoint Card Machine on Delivery')}
                    className={`rounded-2xl p-4 border-2 cursor-pointer transition-all ${
                      selectedPaymentMethod === 'Speedpoint Card Machine on Delivery'
                        ? 'bg-emerald-50/80 border-emerald-500 shadow-sm ring-2 ring-emerald-400/40'
                        : 'bg-white border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                        <CreditCard className="w-4 h-4" />
                      </div>
                      <input
                        type="radio"
                        name="bookingPaymentMethod"
                        checked={selectedPaymentMethod === 'Speedpoint Card Machine on Delivery'}
                        onChange={() => setSelectedPaymentMethod('Speedpoint Card Machine on Delivery')}
                        className="w-4 h-4 text-emerald-600 focus:ring-emerald-500"
                      />
                    </div>
                    <p className="text-xs font-black text-slate-900 uppercase tracking-wide">
                      Speedpoint Machine
                    </p>
                    <span className="inline-block mt-1 text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                      Tap-to-Pay on Delivery
                    </span>
                    <p className="text-[11px] text-slate-600 mt-2 leading-relaxed">
                      Driver carries wireless mobile card terminal (Visa, Mastercard, Apple Pay, Samsung Pay) at your door.
                    </p>
                  </div>
                </div>

                {/* EFT Preview Card when EFT is selected */}
                {selectedPaymentMethod === 'EFT Bank Transfer' && (
                  <div className="p-4 rounded-2xl bg-sky-50 border-2 border-sky-400 space-y-2.5 animate-fadeIn">
                    <div className="flex items-center justify-between border-b border-sky-200 pb-1.5">
                      <span className="font-black text-slate-900 text-xs uppercase tracking-wide">
                        Gold Business Account 63111341466
                      </span>
                      <span className="bg-sky-200 text-sky-900 px-2.5 py-0.5 rounded font-black text-[10px] uppercase">
                        Payment Method: EFT
                      </span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 font-mono text-xs bg-white p-3 rounded-xl border border-sky-200">
                      <div>
                        <span className="text-[10px] font-sans text-slate-400 block font-medium">Bank</span>
                        <strong className="text-slate-900">FNB</strong>
                      </div>
                      <div>
                        <span className="text-[10px] font-sans text-slate-400 block font-medium">Account Holder</span>
                        <strong className="text-slate-900">Gio’s Laundromat</strong>
                      </div>
                      <div>
                        <span className="text-[10px] font-sans text-slate-400 block font-medium">Account Number</span>
                        <strong className="text-sky-700 font-bold">63111341466</strong>
                      </div>
                      <div>
                        <span className="text-[10px] font-sans text-slate-400 block font-medium">Reference</span>
                        <strong className="text-slate-900">Order ID (Auto)</strong>
                      </div>
                    </div>

                    <div className="bg-emerald-50 border border-emerald-300 p-2.5 rounded-xl text-xs text-emerald-950 font-bold flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>THE INVOICE SHALL AUTOMATICALLY BE SENT TO YOU ONCE WEIGHING IS COMPLETE!</span>
                    </div>
                  </div>
                )}

                {/* Cash on Delivery Callout when Cash is selected */}
                {selectedPaymentMethod === 'Cash on Delivery' && (
                  <div className="p-4 rounded-2xl bg-amber-50 border border-amber-300 space-y-1.5 text-xs text-amber-950 animate-fadeIn">
                    <div className="flex items-center justify-between border-b border-amber-200 pb-1">
                      <span className="font-black text-amber-900 uppercase">Payment Method: CASH ON DELIVERY</span>
                      <span className="bg-amber-200 text-amber-900 px-2 py-0.5 rounded text-[10px] font-black uppercase">
                        Payment Status: OUTSTANDING
                      </span>
                    </div>
                    <p className="text-slate-700 leading-relaxed text-[11px]">
                      The driver / authorized staff member collects the cash.
                    </p>
                    <p className="text-[11px] text-amber-900 font-bold">
                      Then the admin marks: <strong>CASH RECEIVED ✓</strong>. The system records amount received, date, time, order, customer, and person who confirmed payment.
                    </p>
                  </div>
                )}
              </div>

              {/* Pricing & Handover Summary Box */}
              <div className="bg-slate-900 text-white rounded-2xl p-6 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
                  <div>
                    <p className="text-xs uppercase tracking-wider text-sky-400 font-bold">
                      Estimated Total Due on Delivery
                    </p>
                    {verifiedMember ? (
                      <div className="text-xs text-slate-300 mt-1 space-y-0.5">
                        <p className="text-emerald-400 font-semibold flex items-center gap-1">
                          <CheckCircle className="w-3.5 h-3.5" />
                          <span>Member Plan: {memberCoveredKg.toFixed(1)} kg Wash-and-Fold Covered (R0)</span>
                        </p>
                        {memberOverageKg > 0 && (
                          <p className="text-amber-300">
                            +{memberOverageKg.toFixed(1)} kg additional laundry @ Member Rate R{memberRate}/kg = +R{memberOverageFee}
                          </p>
                        )}
                        <p className="text-[11px] text-slate-400">
                          Collection &amp; delivery charged separately · Speedpoint on delivery
                        </p>
                      </div>
                    ) : (
                      <p className="text-xs text-slate-400">
                        Free pickup over R200 · Payment upon delivery via card machine or cash
                      </p>
                    )}
                  </div>
                  <div className="text-right">
                    <span className="text-3xl font-black font-display text-white tabular-nums">
                      R{total}
                    </span>
                    {deliveryFee === 0 ? (
                      isFirstTimeCustomer ? (
                        <p className="text-xs text-lime-400 font-bold flex items-center justify-end gap-1">
                          <Sparkles className="w-3 h-3 text-lime-400" />
                          <span>100% FREE (1st-Time Special)</span>
                        </p>
                      ) : (
                        <p className="text-xs text-lime-400 font-semibold">Free Delivery (Over R200)</p>
                      )
                    ) : (
                      <p className="text-xs text-amber-300">Includes R{deliveryFee} delivery fee</p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-3 text-xs text-slate-300">
                  <CreditCard className="w-5 h-5 text-lime-400 shrink-0" />
                  <span>
                    <strong>No online payment required.</strong> Our driver carries a mobile Speedpoint device for Visa, Mastercard, Apple Pay, Samsung Pay, or cash.
                  </span>
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex flex-col sm:flex-row items-center gap-3">
                <button
                  type="submit"
                  className="w-full sm:flex-1 py-4 px-6 rounded-xl bg-sky-600 hover:bg-sky-700 active:bg-sky-800 text-white font-bold text-base shadow-lg shadow-sky-600/20 transition-all flex items-center justify-center gap-2"
                >
                  <Calendar className="w-5 h-5" />
                  <span>Confirm Pickup Schedule</span>
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </section>
  );
};
