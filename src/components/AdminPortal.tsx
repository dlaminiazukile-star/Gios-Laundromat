import React, { useState, useMemo } from 'react';
import {
  Package,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  Truck,
  Sparkles,
  AlertCircle,
  FileText,
  MessageCircle,
  Phone,
  Edit,
  Trash2,
  Plus,
  X,
  Save,
  Download,
  ArrowRight,
  ExternalLink,
  ChevronDown,
  User,
  MapPin,
  Calendar,
  CreditCard,
  Camera,
  RefreshCw,
  LogOut,
  Lock,
  Scale,
  LayoutDashboard,
  Kanban,
  Check,
  ChevronRight,
  SlidersHorizontal,
  Flame,
  Award,
  Users,
  DollarSign,
  TrendingUp,
  BarChart3,
  Bell,
  Send,
  Zap,
  ShieldCheck,
  AlertTriangle,
  Banknote,
  Receipt,
  Printer,
  Copy,
} from 'lucide-react';
import {
  LaundryOrder,
  OrderItem,
  OrderStatus,
  OrderTimelineStep,
  MemberSubscription,
  MembershipPackage,
  PaymentAuditRecord,
} from '../types';
import { BUSINESS_INFO, SERVICES, SUBURBS_COVERAGE, MEMBERSHIP_PACKAGES } from '../data/servicesData';
import { GioLogo } from './GioLogo';

interface AdminPortalProps {
  orders: LaundryOrder[];
  subscriptions: MemberSubscription[];
  onUpdateOrder: (updatedOrder: LaundryOrder) => void;
  onDeleteOrder: (orderId: string) => void;
  onAddOrder: (newOrder: LaundryOrder) => void;
  onViewInvoice: (order: LaundryOrder) => void;
  onCloseAdmin: () => void;
  onLogoutAdmin?: () => void;
  onUpdateSubscription: (updatedSub: MemberSubscription) => void;
  onAddSubscription: (newSub: MemberSubscription) => void;
  onDeleteSubscription: (memberNumber: string) => void;
}

export interface FounderStageConfig {
  value: OrderStatus;
  label: string;
  shortLabel: string;
  badgeClass: string;
  dotClass: string;
  bgLight: string;
  description: string;
}

export const FOUNDER_STAGES: FounderStageConfig[] = [
  {
    value: 'new_request',
    label: 'New requests',
    shortLabel: 'New',
    badgeClass: 'bg-indigo-100 text-indigo-800 border-indigo-200',
    dotClass: 'bg-indigo-600',
    bgLight: 'bg-indigo-50/50',
    description: 'Fresh online booking submitted by customer',
  },
  {
    value: 'verification_pending',
    label: 'Verification pending',
    shortLabel: 'Verifying',
    badgeClass: 'bg-amber-100 text-amber-900 border-amber-200',
    dotClass: 'bg-amber-600',
    bgLight: 'bg-amber-50/50',
    description: 'Address, phone, or gate access code review',
  },
  {
    value: 'verified',
    label: 'Verified',
    shortLabel: 'Verified',
    badgeClass: 'bg-blue-100 text-blue-900 border-blue-200',
    dotClass: 'bg-blue-600',
    bgLight: 'bg-blue-50/50',
    description: 'Booking approved for dispatch run',
  },
  {
    value: 'pickup_scheduled',
    label: 'Pickup scheduled',
    shortLabel: 'Scheduled',
    badgeClass: 'bg-sky-100 text-sky-900 border-sky-200',
    dotClass: 'bg-sky-600',
    bgLight: 'bg-sky-50/50',
    description: 'Locked in timeslot with courier van',
  },
  {
    value: 'collected',
    label: 'Collected',
    shortLabel: 'Collected',
    badgeClass: 'bg-purple-100 text-purple-900 border-purple-200',
    dotClass: 'bg-purple-600',
    bgLight: 'bg-purple-50/50',
    description: 'Collected & weighed on digital scales',
  },
  {
    value: 'processing',
    label: 'Processing',
    shortLabel: 'Processing',
    badgeClass: 'bg-cyan-100 text-cyan-900 border-cyan-200',
    dotClass: 'bg-cyan-600',
    bgLight: 'bg-cyan-50/50',
    description: 'Eco drum wash, blanket sanitizing & Shoe Spa',
  },
  {
    value: 'ready',
    label: 'Ready',
    shortLabel: 'Ready',
    badgeClass: 'bg-teal-100 text-teal-900 border-teal-200',
    dotClass: 'bg-teal-600',
    bgLight: 'bg-teal-50/50',
    description: 'Hand steam ironed, inspected & packaged',
  },
  {
    value: 'delivered',
    label: 'Delivered',
    shortLabel: 'Delivered',
    badgeClass: 'bg-lime-100 text-lime-900 border-lime-300',
    dotClass: 'bg-lime-600',
    bgLight: 'bg-lime-50/50',
    description: 'Handed over at customer doorstep',
  },
  {
    value: 'payment_outstanding',
    label: 'Payment outstanding',
    shortLabel: 'Payment Due',
    badgeClass: 'bg-rose-100 text-rose-900 border-rose-200',
    dotClass: 'bg-rose-600',
    bgLight: 'bg-rose-50/50',
    description: 'Speedpoint slip or cash awaiting reconciliation',
  },
  {
    value: 'completed',
    label: 'Completed',
    shortLabel: 'Completed',
    badgeClass: 'bg-emerald-100 text-emerald-900 border-emerald-200',
    dotClass: 'bg-emerald-600',
    bgLight: 'bg-emerald-50/50',
    description: 'Delivery signed for and payment settled',
  },
];

// Helper to normalize any legacy status to the 10 founder stages
export const normalizeStatus = (status: OrderStatus): OrderStatus => {
  switch (status) {
    case 'confirmed':
      return 'pickup_scheduled';
    case 'picked_up':
      return 'collected';
    case 'in_cleaning':
      return 'processing';
    case 'quality_checked':
      return 'ready';
    case 'out_for_delivery':
      return 'ready';
    default:
      return status;
  }
};

// Next stage in the linear lifecycle
export const getNextStage = (current: OrderStatus): OrderStatus | null => {
  const norm = normalizeStatus(current);
  const sequence: OrderStatus[] = [
    'new_request',
    'verification_pending',
    'verified',
    'pickup_scheduled',
    'collected',
    'processing',
    'ready',
    'delivered',
    'payment_outstanding',
    'completed',
  ];
  const idx = sequence.indexOf(norm);
  if (idx >= 0 && idx < sequence.length - 1) {
    return sequence[idx + 1];
  }
  return null;
};

export const AdminPortal: React.FC<AdminPortalProps> = ({
  orders,
  subscriptions,
  onUpdateOrder,
  onDeleteOrder,
  onAddOrder,
  onViewInvoice,
  onCloseAdmin,
  onLogoutAdmin,
  onUpdateSubscription,
  onAddSubscription,
  onDeleteSubscription,
}) => {
  // Navigation tabs: 'dashboard' | 'today' | 'pipeline' | 'memberships'
  const [activeTab, setActiveTab] = useState<'dashboard' | 'today' | 'pipeline' | 'memberships'>('dashboard');

  // Search & Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [todayTimeSlotFilter, setTodayTimeSlotFilter] = useState<string>('all');
  const [subSearchTerm, setSubSearchTerm] = useState('');
  const [subTierFilter, setSubTierFilter] = useState<string>('all');

  // Modal states
  const [editingOrder, setEditingOrder] = useState<LaundryOrder | null>(null);
  const [isNewOrderModalOpen, setIsNewOrderModalOpen] = useState(false);
  const [photoViewerOrder, setPhotoViewerOrder] = useState<LaundryOrder | null>(null);

  // Digital Scale & Official Invoice Issuance Modal
  const [weighingOrder, setWeighingOrder] = useState<LaundryOrder | null>(null);
  const [weighedItems, setWeighedItems] = useState<OrderItem[]>([]);
  const [scaleIssuer, setScaleIssuer] = useState<string>('Sipho M. (Courier Mobile Unit)');
  const [scaleNotes, setScaleNotes] = useState<string>('');
  const [sendWhatsAppOnIssue, setSendWhatsAppOnIssue] = useState<boolean>(true);

  // Cash Payment Recording Modal state (CASH RECEIVED ✓ workflow)
  const [cashRecordingOrder, setCashRecordingOrder] = useState<LaundryOrder | null>(null);
  const [cashReceivedAmount, setCashReceivedAmount] = useState<number>(0);
  const [cashReceivedDate, setCashReceivedDate] = useState<string>('');
  const [cashReceivedTime, setCashReceivedTime] = useState<string>('');
  const [cashConfirmedBy, setCashConfirmedBy] = useState<string>('Founder / Admin (Gio)');
  const [cashReceiptNumber, setCashReceiptNumber] = useState<string>('');
  const [cashNotes, setCashNotes] = useState<string>('');
  const [cashAutoAdvanceCompleted, setCashAutoAdvanceCompleted] = useState<boolean>(true);

  // Cash Receipt View Modal
  const [cashReceiptViewOrder, setCashReceiptViewOrder] = useState<LaundryOrder | null>(null);

  // Subscription Modals
  const [isNewSubModalOpen, setIsNewSubModalOpen] = useState(false);
  const [editingSub, setEditingSub] = useState<MemberSubscription | null>(null);

  // New Subscription Form State
  const [newSubName, setNewSubName] = useState('');
  const [newSubPhone, setNewSubPhone] = useState('');
  const [newSubEmail, setNewSubEmail] = useState('');
  const [newSubAddress, setNewSubAddress] = useState('');
  const [newSubSuburb, setNewSubSuburb] = useState('Scottsville');
  const [newSubTier, setNewSubTier] = useState<'essential' | 'comfort' | 'family'>('comfort');
  const [newSubPaymentStatus, setNewSubPaymentStatus] = useState<'paid' | 'unpaid'>('paid');
  const [newSubNotes, setNewSubNotes] = useState('');

  // Helper to determine if an order belongs to today's operations
  const todayDateStr = useMemo(() => new Date().toISOString().split('T')[0], []);

  const isTodayOrder = (order: LaundryOrder): boolean => {
    return (
      order.pickupDate === todayDateStr ||
      order.createdAt.startsWith(todayDateStr) ||
      order.createdAt.toLowerCase().includes('today') ||
      order.pickupDate.toLowerCase().includes('today')
    );
  };

  // Open weighing & official invoice issuance modal
  const handleOpenWeighingModal = (order: LaundryOrder) => {
    setWeighingOrder(order);
    setWeighedItems(order.items.map((i) => ({ ...i })));
    setScaleIssuer(order.invoiceIssuedBy || order.driverName || 'Sipho M. (Courier Mobile Unit)');
    setScaleNotes(order.specialInstructions || '');
    setSendWhatsAppOnIssue(true);
  };

  // Open Cash Received Recording Modal
  const handleOpenCashRecordingModal = (order: LaundryOrder) => {
    const now = new Date();
    const dateFormatted = now.toLocaleDateString('en-ZA', { day: '2-digit', month: 'short', year: 'numeric' });
    const timeFormatted = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    const defaultReceipt = `CR-${order.id.replace(/[^0-9]/g, '') || Math.floor(1000 + Math.random() * 9000)}`;

    setCashRecordingOrder(order);
    setCashReceivedAmount(order.total);
    setCashReceivedDate(dateFormatted);
    setCashReceivedTime(timeFormatted);
    setCashConfirmedBy(order.driverName ? `${order.driverName} & Admin` : 'Founder / Admin (Gio)');
    setCashReceiptNumber(defaultReceipt);
    setCashNotes('Driver collected exact cash upon handover. Verified & recorded by Admin.');
    setCashAutoAdvanceCompleted(
      normalizeStatus(order.status) === 'delivered' || normalizeStatus(order.status) === 'payment_outstanding'
    );
  };

  // Confirm and save Cash Received
  const handleConfirmCashReceived = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cashRecordingOrder) return;

    const auditRecord: PaymentAuditRecord = {
      amountReceived: cashReceivedAmount,
      date: cashReceivedDate,
      time: cashReceivedTime,
      orderId: cashRecordingOrder.id,
      customerName: cashRecordingOrder.customerName,
      confirmedBy: cashConfirmedBy,
      paymentMethod: 'CASH ON DELIVERY',
      receiptNumber: cashReceiptNumber,
      notes: cashNotes,
    };

    const newStatus: OrderStatus = cashAutoAdvanceCompleted ? 'completed' : cashRecordingOrder.status;

    const updatedTimeline: OrderTimelineStep[] = [
      ...cashRecordingOrder.timeline.map((t) => ({ ...t, current: false })),
      {
        status: 'completed',
        label: 'CASH RECEIVED ✓',
        description: `R${cashReceivedAmount} cash confirmed received by ${cashConfirmedBy} on ${cashReceivedDate} at ${cashReceivedTime}. Official voucher #${cashReceiptNumber}.`,
        timestamp: `${cashReceivedDate}, ${cashReceivedTime}`,
        completed: true,
        current: true,
      },
    ];

    const updatedOrder: LaundryOrder = {
      ...cashRecordingOrder,
      paymentStatus: 'paid',
      cashReceivedRecord: auditRecord,
      status: newStatus,
      timeline: updatedTimeline,
    };

    onUpdateOrder(updatedOrder);
    setCashRecordingOrder(null);
  };

  // Revoke Cash Received record
  const handleRevokeCashReceived = (order: LaundryOrder) => {
    if (!window.confirm(`Revoke cash receipt record for Order #${order.id}?`)) return;
    const updatedOrder: LaundryOrder = {
      ...order,
      paymentStatus: 'outstanding',
      cashReceivedRecord: undefined,
    };
    onUpdateOrder(updatedOrder);
    if (cashReceiptViewOrder?.id === order.id) {
      setCashReceiptViewOrder(null);
    }
  };

  // Quick verify EFT payment
  const handleVerifyEftPayment = (order: LaundryOrder) => {
    const now = new Date();
    const timeFormatted = `${now.toLocaleDateString('en-ZA', { day: '2-digit', month: 'short' })}, ${String(
      now.getHours()
    ).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    const updatedTimeline: OrderTimelineStep[] = [
      ...order.timeline.map((t) => ({ ...t, current: false })),
      {
        status: 'completed',
        label: 'EFT Payment Verified ✓',
        description: `EFT transfer of R${order.total} confirmed in FNB Gold Business Account 63111341466 (Ref: ${order.id}).`,
        timestamp: `Today, ${timeFormatted}`,
        completed: true,
        current: true,
      },
    ];

    const updatedOrder: LaundryOrder = {
      ...order,
      paymentStatus: 'paid',
      timeline: updatedTimeline,
    };

    onUpdateOrder(updatedOrder);
  };

  // Render payment badge and quick action for an order
  const renderPaymentStatusBadge = (order: LaundryOrder, isCompact: boolean = false) => {
    const isCash = order.paymentMethod === 'Cash on Delivery';
    const isEft = order.paymentMethod === 'EFT Bank Transfer' || order.paymentMethod === 'EFT';

    if (isCash) {
      if (order.cashReceivedRecord || order.paymentStatus === 'paid') {
        return (
          <button
            type="button"
            onClick={() => order.cashReceivedRecord && setCashReceiptViewOrder(order)}
            className="inline-flex items-center gap-1 text-[10px] font-black bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-400/40 px-2 py-0.5 rounded-full transition-colors cursor-pointer"
            title="Cash received & verified. Click to view official receipt voucher."
          >
            <CheckCircle2 className="w-3 h-3 text-emerald-400" />
            <span>CASH RECEIVED ✓</span>
          </button>
        );
      }
      return (
        <div className={`flex ${isCompact ? 'flex-col gap-1' : 'flex-col items-end gap-1'} mt-1`}>
          <span className="text-[10px] font-extrabold text-amber-300 bg-amber-950/70 border border-amber-400/40 px-1.5 py-0.5 rounded uppercase">
            CASH: OUTSTANDING
          </span>
          <button
            type="button"
            onClick={() => handleOpenCashRecordingModal(order)}
            className="inline-flex items-center gap-1 text-[10px] font-black bg-emerald-500 hover:bg-emerald-400 text-slate-950 px-2 py-1 rounded-lg shadow-sm shadow-emerald-500/20 transition-all cursor-pointer font-display uppercase tracking-wide"
            title="Driver collects cash. Mark CASH RECEIVED ✓ and record details."
          >
            <Banknote className="w-3 h-3" />
            <span>Mark CASH RECEIVED ✓</span>
          </button>
        </div>
      );
    }

    if (isEft) {
      if (order.paymentStatus === 'paid') {
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-sky-950/80 border border-sky-400/40 text-sky-300 px-2 py-0.5 rounded-full">
            <CheckCircle2 className="w-3 h-3 text-sky-400" />
            <span>EFT: PAID &amp; VERIFIED</span>
          </span>
        );
      }
      return (
        <div className={`flex ${isCompact ? 'flex-col gap-1' : 'flex-col items-end gap-1'} mt-1`}>
          <span className="text-[10px] font-bold text-sky-300 bg-sky-950/70 border border-sky-400/40 px-1.5 py-0.5 rounded uppercase">
            EFT: OUTSTANDING
          </span>
          <button
            type="button"
            onClick={() => handleVerifyEftPayment(order)}
            className="inline-flex items-center gap-1 text-[10px] font-bold bg-sky-500 hover:bg-sky-400 text-slate-950 px-2 py-0.5 rounded-md transition-colors cursor-pointer"
            title="Verify EFT transfer received in FNB Gold Business Account 63111341466"
          >
            <span>Verify EFT</span>
          </button>
        </div>
      );
    }

    return (
      <span className="text-[10px] text-slate-400 block mt-0.5">
        Card on Delivery
      </span>
    );
  };

  const handleUpdateWeighedItemQty = (index: number, newQty: number) => {
    setWeighedItems((prev) => {
      const copy = [...prev];
      if (newQty <= 0) {
        copy.splice(index, 1);
      } else {
        copy[index] = {
          ...copy[index],
          quantity: newQty,
          total: Math.round(newQty * copy[index].unitPrice),
        };
      }
      return copy;
    });
  };

  const handleAddServiceToWeighedItems = (serviceId: string) => {
    const s = SERVICES.find((item) => item.id === serviceId);
    if (!s) return;
    const initialQty = s.category === 'laundry' ? 5 : 1;
    setWeighedItems((prev) => [
      ...prev,
      {
        serviceId: s.id,
        serviceName: s.name,
        quantity: initialQty,
        unitPrice: s.pricePerUnit,
        unit: s.unit,
        total: Math.round(initialQty * s.pricePerUnit),
      },
    ]);
  };

  const handleConfirmWeighingAndIssueInvoice = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!weighingOrder) return;

    const subtotal = weighedItems.reduce((sum, item) => sum + item.total, 0);
    const deliveryFee = weighingOrder.isFirstTimeCustomer || subtotal >= 200 ? 0 : 40;
    const expressFee = weighingOrder.isExpress ? Math.round(subtotal * 0.3) : 0;
    const grandTotal = subtotal + deliveryFee + expressFee;

    const totalKg = weighedItems
      .filter((i) => i.unit === 'kg')
      .reduce((sum, i) => sum + i.quantity, 0);

    const now = new Date();
    const timeFormatted = `${now.toLocaleDateString('en-ZA', { day: '2-digit', month: 'short' })}, ${String(
      now.getHours()
    ).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    const isEft = weighingOrder.paymentMethod === 'EFT Bank Transfer' || weighingOrder.paymentMethod === 'EFT';
    const isCash = weighingOrder.paymentMethod === 'Cash on Delivery';

    // Timeline updates
    const updatedTimeline: OrderTimelineStep[] = weighingOrder.timeline.map((step) => {
      if (step.status === 'collected' || step.status === 'picked_up') {
        return {
          ...step,
          label: 'Collected & Weighed on Digital Scales',
          description: `Collected & certified by ${scaleIssuer}. Total: ${
            totalKg > 0 ? totalKg.toFixed(1) + ' kg' : 'Verified'
          }. Official tax invoice issued${isEft ? ' and automatically sent to customer with FNB EFT details' : ''}.`,
          timestamp: timeFormatted,
          completed: true,
          current: true,
        };
      }
      return step;
    });

    const updatedOrder: LaundryOrder = {
      ...weighingOrder,
      status: 'collected',
      items: weighedItems,
      subtotal,
      deliveryFee,
      expressFee,
      total: grandTotal,
      isWeighed: true,
      weighedWeightKg: totalKg > 0 ? parseFloat(totalKg.toFixed(1)) : undefined,
      invoiceIssued: true,
      invoiceIssuedAt: timeFormatted,
      invoiceIssuedBy: scaleIssuer,
      eftDetailsSent: isEft ? true : weighingOrder.eftDetailsSent,
      eftDetailsSentAt: isEft ? timeFormatted : weighingOrder.eftDetailsSentAt,
      specialInstructions: scaleNotes || weighingOrder.specialInstructions,
      timeline: updatedTimeline,
    };

    onUpdateOrder(updatedOrder);
    setWeighingOrder(null);

    // If staff wants to notify customer on WhatsApp (automatically sending invoice & EFT details upon weighing)
    if (sendWhatsAppOnIssue) {
      const itemsSummary = weighedItems.map((i) => `${i.quantity} ${i.unit} ${i.serviceName}`).join(', ');
      let text = '';
      if (isEft) {
        text = `*GIO'S LAUNDROMAT - OFFICIAL TAX INVOICE & EFT DETAILS*\n\nHi ${updatedOrder.customerName}!\n\nYour laundry has been collected and certified on digital scales (${
          totalKg > 0 ? totalKg.toFixed(1) + ' kg' : 'verified'
        }).\n\nOfficial Invoice Total: *R${updatedOrder.total}*\nItems: ${itemsSummary}\n\n*EFT PAYMENT DETAILS:*\nBank: FNB\nAccount Holder: Gio’s Laundromat\nAccount Type: Gold Business Account\nAccount Number: 63111341466\nReference: *${updatedOrder.id}*\n\nYour official tax invoice has been generated and sent automatically upon certified weighing completion! Please reply with your proof of payment once transferred. Thank you!`;
      } else if (isCash) {
        text = `*GIO'S LAUNDROMAT - OFFICIAL TAX INVOICE*\n\nHi ${updatedOrder.customerName}!\n\nYour laundry has been collected and certified on digital scales (${
          totalKg > 0 ? totalKg.toFixed(1) + ' kg' : 'verified'
        }).\n\nOfficial Invoice Total: *R${updatedOrder.total}*\nItems: ${itemsSummary}\n\n*Payment Method: CASH ON DELIVERY*\n*Payment Status: OUTSTANDING*\n\nOur driver/staff member will collect the cash upon delivery. Then our admin marks: CASH RECEIVED ✓. Thank you!`;
      } else {
        text = `Hi ${updatedOrder.customerName}! Your laundry has been collected and weighed on certified digital scales (${
          totalKg > 0 ? totalKg.toFixed(1) + ' kg' : 'verified'
        }). Your official Gio's Laundromat tax invoice total is R${updatedOrder.total} (${itemsSummary}). Payment is due upon delivery via Speedpoint card machine.`;
      }

      const cleanPhone = updatedOrder.phone.replace(/[^0-9]/g, '');
      const targetPhone = cleanPhone.startsWith('0')
        ? `27${cleanPhone.slice(1)}`
        : cleanPhone.startsWith('27')
        ? cleanPhone
        : BUSINESS_INFO.whatsappRaw;
      const waUrl = `https://wa.me/${targetPhone}?text=${encodeURIComponent(text)}`;
      window.open(waUrl, '_blank');
    }

    // Immediately open invoice view for staff to review or print
    onViewInvoice(updatedOrder);
  };

  // Advance status handler with rich timeline
  const handleQuickStatusChange = (order: LaundryOrder, newStatus: OrderStatus) => {
    const now = new Date();
    const timeString = `${String(now.getHours()).padStart(2, '0')}:${String(
      now.getMinutes()
    ).padStart(2, '0')}`;

    const stageConfig = FOUNDER_STAGES.find((s) => s.value === newStatus);
    const stageLabel = stageConfig ? stageConfig.label : newStatus;

    const exists = order.timeline.some((s) => s.status === newStatus);
    let updatedTimeline = order.timeline.map((step) => {
      if (step.status === newStatus) {
        return {
          ...step,
          completed: true,
          current: true,
          timestamp: step.timestamp || `Today, ${timeString}`,
        };
      }
      return {
        ...step,
        current: false,
      };
    });

    if (!exists) {
      updatedTimeline.push({
        status: newStatus,
        label: stageLabel,
        description: stageConfig?.description || `Status moved to ${stageLabel}`,
        timestamp: `Today, ${timeString}`,
        completed: true,
        current: true,
      });
    }

    const updatedOrder: LaundryOrder = {
      ...order,
      status: newStatus,
      timeline: updatedTimeline,
    };

    onUpdateOrder(updatedOrder);
  };

  // WhatsApp Customer Status Message tailored to the 10 stages
  const getWhatsAppStatusUrl = (order: LaundryOrder) => {
    const norm = normalizeStatus(order.status);
    let statusText = '';
    switch (norm) {
      case 'new_request':
        statusText = `we have received your booking request for ${order.pickupDate} during ${order.pickupTimeSlot}. Our dispatch team is reviewing your pickup window.`;
        break;
      case 'verification_pending':
        statusText = `your booking is currently under verification. Our dispatch coordinator is checking courier route schedules for ${order.suburb}.`;
        break;
      case 'verified':
        statusText = `your booking is VERIFIED and approved! We have reserved your pickup slot (${order.pickupTimeSlot}) on ${order.pickupDate}.`;
        break;
      case 'pickup_scheduled':
        statusText = `your pickup is SCHEDULED with courier ${order.driverName || 'Sipho'} (${order.driverVehicle || 'Toyota Proace'}). Driver will arrive with certified digital scales.`;
        break;
      case 'collected':
        statusText = `your laundry has been COLLECTED safely and weighed on certified digital scales. Official tax invoice total: R${order.total}.`;
        break;
      case 'processing':
        statusText = `your garments & footwear are now in PROCESSING at our central hub! Undergoing eco-friendly drum washing, blanket sanitation, and sneaker spa rejuvenation.`;
        break;
      case 'ready':
        statusText = `your order is READY! Clean, hand-steamed, fresh, and packaged for doorstep handover. Courier dispatch is preparing for delivery.`;
        break;
      case 'delivered':
        statusText = `your order #${order.id} has been DELIVERED to your doorstep! Thank you for choosing Gio's Laundromat.`;
        break;
      case 'payment_outstanding':
        statusText = `your order #${order.id} is delivered. Friendly reminder that payment of R${order.total} is due via Speedpoint card machine or cash. Thank you!`;
        break;
      case 'completed':
        statusText = `your order #${order.id} is COMPLETED and paid in full. Thank you for your support of Gio's Laundromat! Have a fresh day!`;
        break;
      default:
        statusText = `your order status has been updated to: ${order.status}.`;
    }

    const cleanPhone = order.phone.replace(/[^0-9]/g, '');
    const targetPhone = cleanPhone.startsWith('0')
      ? `27${cleanPhone.slice(1)}`
      : cleanPhone.startsWith('27')
      ? cleanPhone
      : BUSINESS_INFO.whatsappRaw;

    const message = `Hi ${order.customerName}! Update from *Gio's Laundromat* (Order #${order.id}):\n\n${statusText}\n\nAny questions? Feel free to reply here!`;

    return `https://wa.me/${targetPhone}?text=${encodeURIComponent(message)}`;
  };

  // WhatsApp Notification generator for Subscriptions
  const getSubWhatsAppUrl = (
    sub: MemberSubscription,
    type: 'low_allowance' | 'renewal' | 'unpaid' | 'general'
  ) => {
    let msg = '';
    const pkg = MEMBERSHIP_PACKAGES.find((p) => p.id === sub.tierId);
    const overageRate = pkg?.memberOverAllowanceRate || 24;

    switch (type) {
      case 'low_allowance':
        msg = `Hi ${sub.customerName}! Friendly update from *Gio's Laundromat* regarding Membership #${sub.membershipNumber} (${sub.packageName}):\n\nYour monthly wash allowance currently has *${sub.remainingKg.toFixed(1)} kg remaining* out of your ${sub.totalKgAllowance} kg package.\n\nAny extra laundry this month will be billed at your special member rate of *R${overageRate}/kg*. Reply here anytime to schedule your next pickup!`;
        break;
      case 'renewal':
        msg = `Hi ${sub.customerName}! Notice from *Gio's Laundromat* (Membership #${sub.membershipNumber}):\n\nYour monthly *${sub.packageName}* membership (R${sub.monthlyFee}/month) renewal is scheduled for *${sub.renewalDate}*.\n\nReply 'CONFIRM' to renew your monthly wash allowance, or let us know if you would like to adjust your package!`;
        break;
      case 'unpaid':
        msg = `Hi ${sub.customerName}! Friendly reminder from *Gio's Laundromat* regarding Membership #${sub.membershipNumber} (${sub.packageName}):\n\nYour monthly subscription fee of *R${sub.monthlyFee}* is pending payment. You can settle securely at your doorstep via our mobile Speedpoint card machine or cash on your next pickup. Thank you!`;
        break;
      default:
        msg = `Hi ${sub.customerName}! Greetings from Gio's Laundromat. Your Membership #${sub.membershipNumber} is active with ${sub.remainingKg.toFixed(1)} kg allowance remaining. How can we serve you today?`;
    }

    const cleanPhone = sub.phone.replace(/[^0-9]/g, '');
    const targetPhone = cleanPhone.startsWith('0')
      ? `27${cleanPhone.slice(1)}`
      : cleanPhone.startsWith('27')
      ? cleanPhone
      : BUSINESS_INFO.whatsappRaw;

    return `https://wa.me/${targetPhone}?text=${encodeURIComponent(msg)}`;
  };

  // Export to CSV
  const handleExportCSV = () => {
    const headers = [
      'Order ID',
      'Date Created',
      'Customer Name',
      'Phone',
      'City',
      'Suburb',
      'Address',
      'Status',
      'Items Count',
      'Subtotal',
      'Delivery Fee',
      'Total (ZAR)',
      'Payment Method',
      'Driver',
      'Member Number',
      'First Time Customer',
      'Invoiced',
    ];

    const rows = orders.map((o) => [
      o.id,
      o.createdAt,
      `"${o.customerName.replace(/"/g, '""')}"`,
      `"${o.phone}"`,
      o.city,
      `"${o.suburb}"`,
      `"${o.address.replace(/"/g, '""')}"`,
      o.status,
      o.items.length,
      o.subtotal,
      o.deliveryFee,
      o.total,
      `"${o.paymentMethod}"`,
      `"${o.driverName || 'Unassigned'}"`,
      o.memberNumber || 'N/A',
      o.isFirstTimeCustomer ? 'YES' : 'NO',
      o.invoiceIssued ? 'YES' : 'NO',
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `gios_laundromat_orders_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Save edited order
  const handleSaveEditedOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingOrder) return;

    const newSubtotal = editingOrder.items.reduce((sum, item) => sum + item.total, 0);
    const newExpressFee =
      editingOrder.isExpress && newSubtotal > 0 ? Math.round(newSubtotal * 0.3) : 0;
    const newDeliveryFee =
      editingOrder.isFirstTimeCustomer || newSubtotal >= BUSINESS_INFO.freeDeliveryThreshold
        ? 0
        : BUSINESS_INFO.standardDeliveryFee;
    const newTotal = newSubtotal + newExpressFee + newDeliveryFee;

    const finalizedOrder: LaundryOrder = {
      ...editingOrder,
      subtotal: newSubtotal,
      expressFee: newExpressFee,
      deliveryFee: newDeliveryFee,
      total: newTotal,
    };

    onUpdateOrder(finalizedOrder);
    setEditingOrder(null);
  };

  const handleAddItemToEditing = (serviceId: string) => {
    if (!editingOrder) return;
    const s = SERVICES.find((item) => item.id === serviceId);
    if (!s) return;

    const defaultQty = s.category === 'laundry' ? 5 : 1;
    const newItem: OrderItem = {
      serviceId: s.id,
      serviceName: s.name,
      quantity: defaultQty,
      unitPrice: s.pricePerUnit,
      unit: s.unit,
      total: defaultQty * s.pricePerUnit,
    };

    setEditingOrder({
      ...editingOrder,
      items: [...editingOrder.items, newItem],
    });
  };

  const handleUpdateItemInEditing = (index: number, newQty: number, newUnitPrice?: number) => {
    if (!editingOrder) return;
    const updated = [...editingOrder.items];
    const target = updated[index];
    if (!target) return;

    if (newQty <= 0) {
      updated.splice(index, 1);
    } else {
      const price = newUnitPrice !== undefined ? newUnitPrice : target.unitPrice;
      updated[index] = {
        ...target,
        quantity: newQty,
        unitPrice: price,
        total: Math.round(newQty * price),
      };
    }

    setEditingOrder({
      ...editingOrder,
      items: updated,
    });
  };

  // Manual new order form state
  const [newCustName, setNewCustName] = useState('');
  const [newCustPhone, setNewCustPhone] = useState('');
  const [newCustAddress, setNewCustAddress] = useState('');
  const [newCustSuburb, setNewCustSuburb] = useState('Scottsville');
  const [newCustServiceId, setNewCustServiceId] = useState('wash-dry');
  const [newCustQty, setNewCustQty] = useState(5);
  const [newCustTimeSlot, setNewCustTimeSlot] = useState('Morning (09h00 – 12h00)');
  const [newCustExpress, setNewCustExpress] = useState(false);
  const [newCustNotes, setNewCustNotes] = useState('');
  const [newCustFirstTime, setNewCustFirstTime] = useState(true);

  const handleCreateNewOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCustName || !newCustPhone || !newCustAddress) return;

    const service = SERVICES.find((s) => s.id === newCustServiceId) || SERVICES[0];
    const itemTotal = newCustQty * service.pricePerUnit;
    const subtotal = itemTotal;
    const expressFee = newCustExpress ? Math.round(subtotal * 0.3) : 0;
    const deliveryFee =
      newCustFirstTime || subtotal >= BUSINESS_INFO.freeDeliveryThreshold
        ? 0
        : BUSINESS_INFO.standardDeliveryFee;
    const total = subtotal + expressFee + deliveryFee;

    const orderId = `GIO-${Math.floor(1000 + Math.random() * 9000)}`;
    const now = new Date();
    const timeFormatted = `${now.toLocaleDateString('en-ZA', { day: '2-digit', month: 'short' })}, ${String(
      now.getHours()
    ).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    const newOrder: LaundryOrder = {
      id: orderId,
      customerName: newCustName,
      phone: newCustPhone,
      address: newCustAddress,
      suburb: newCustSuburb,
      city: 'Pietermaritzburg',
      pickupDate: todayDateStr,
      pickupTimeSlot: newCustTimeSlot,
      specialInstructions: newCustNotes || undefined,
      status: 'new_request',
      createdAt: `Today, ${timeFormatted}`,
      estimatedDelivery: 'Within 24-48 Hours',
      items: [
        {
          serviceId: service.id,
          serviceName: service.name,
          quantity: newCustQty,
          unitPrice: service.pricePerUnit,
          unit: service.unit,
          total: itemTotal,
        },
      ],
      subtotal,
      deliveryFee,
      isExpress: newCustExpress,
      expressFee,
      total,
      paymentMethod: 'Speedpoint Card Machine on Delivery',
      driverName: 'Sipho Madlala (Assigned)',
      driverVehicle: 'White Toyota Proace (KZN 482 PM)',
      isFirstTimeCustomer: newCustFirstTime,
      isWeighed: false,
      invoiceIssued: false,
      timeline: [
        {
          status: 'new_request',
          label: 'New Request Received',
          description: 'Created by Founder Command Center',
          timestamp: `Today, ${timeFormatted}`,
          completed: true,
          current: true,
        },
      ],
    };

    onAddOrder(newOrder);
    setIsNewOrderModalOpen(false);

    // Reset inputs
    setNewCustName('');
    setNewCustPhone('');
    setNewCustAddress('');
    setNewCustNotes('');
  };

  // Handle Create Subscription
  const handleCreateNewSubscription = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubName || !newSubPhone || !newSubAddress) return;

    const pkg = MEMBERSHIP_PACKAGES.find((p) => p.id === newSubTier) || MEMBERSHIP_PACKAGES[1];
    const randomDigits = Math.floor(1000 + Math.random() * 9000);
    const membershipNumber = `GIO0${randomDigits}`;

    const now = new Date();
    const renewalDate = new Date();
    renewalDate.setDate(now.getDate() + 30);

    const newSub: MemberSubscription = {
      membershipNumber,
      customerName: newSubName,
      phone: newSubPhone,
      email: newSubEmail || `${newSubPhone.replace(/[^0-9]/g, '')}@giosmember.co.za`,
      address: newSubAddress,
      suburb: newSubSuburb,
      tierId: pkg.id,
      packageName: pkg.name,
      monthlyFee: pkg.monthlyFee,
      totalKgAllowance: pkg.monthlyKgAllowance,
      usedKg: 0,
      remainingKg: pkg.monthlyKgAllowance,
      maxBookingsPerMonth: pkg.maxBookingsPerMonth,
      usedBookingsCount: 0,
      status: 'active',
      paymentStatus: newSubPaymentStatus,
      billingCycleStartDate: now.toISOString().split('T')[0],
      renewalDate: renewalDate.toISOString().split('T')[0],
      lastPaymentDate: newSubPaymentStatus === 'paid' ? now.toISOString().split('T')[0] : undefined,
      notes: newSubNotes,
      overageKgUsed: 0,
      overageCharges: 0,
    };

    onAddSubscription(newSub);
    setIsNewSubModalOpen(false);

    // Reset form
    setNewSubName('');
    setNewSubPhone('');
    setNewSubEmail('');
    setNewSubAddress('');
    setNewSubNotes('');
  };

  // Handle Edit Subscription Save
  const handleSaveEditedSubscription = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSub) return;
    onUpdateSubscription(editingSub);
    setEditingSub(null);
  };

  // Orders calculations
  const todayOrders = useMemo(() => orders.filter(isTodayOrder), [orders, todayDateStr]);
  const activeTodayCount = todayOrders.length;
  const todayCompletedCount = todayOrders.filter((o) => normalizeStatus(o.status) === 'completed').length;
  const todayCollectedRev = todayOrders
    .filter((o) => normalizeStatus(o.status) === 'completed')
    .reduce((sum, o) => sum + o.total, 0);
  const todayPendingRev = todayOrders
    .filter((o) => normalizeStatus(o.status) !== 'completed')
    .reduce((sum, o) => sum + o.total, 0);

  // Filtered orders for dashboard view
  const filteredOrders = useMemo(() => {
    return orders.filter((o) => {
      const norm = normalizeStatus(o.status);
      const matchesSearch =
        o.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        o.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        o.phone.toLowerCase().includes(searchTerm.toLowerCase()) ||
        o.suburb.toLowerCase().includes(searchTerm.toLowerCase()) ||
        o.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (o.memberNumber && o.memberNumber.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesStatus =
        statusFilter === 'all' ||
        norm === statusFilter ||
        o.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [orders, searchTerm, statusFilter]);

  // Filtered today's bookings
  const filteredTodayOrders = useMemo(() => {
    return todayOrders.filter((o) => {
      const norm = normalizeStatus(o.status);
      const matchesSearch =
        o.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        o.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        o.suburb.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesSlot =
        todayTimeSlotFilter === 'all' ||
        o.pickupTimeSlot.toLowerCase().includes(todayTimeSlotFilter.toLowerCase());

      const matchesStatus =
        statusFilter === 'all' ||
        norm === statusFilter ||
        o.status === statusFilter;

      return matchesSearch && matchesSlot && matchesStatus;
    });
  }, [todayOrders, searchTerm, todayTimeSlotFilter, statusFilter]);

  // Subscriptions Analytics & Calculations
  const activeSubscribers = subscriptions.filter((s) => s.status === 'active').length;
  const subMRR = subscriptions
    .filter((s) => s.status === 'active' || s.paymentStatus === 'paid')
    .reduce((sum, s) => sum + s.monthlyFee, 0);
  const totalAllocatedKg = subscriptions.reduce((sum, s) => sum + s.totalKgAllowance, 0);
  const totalUsedKg = subscriptions.reduce((sum, s) => sum + s.usedKg, 0);
  const capacityUtilization = totalAllocatedKg > 0 ? Math.round((totalUsedKg / totalAllocatedKg) * 100) : 0;
  const totalOverageRevenue = subscriptions.reduce((sum, s) => sum + s.overageCharges, 0);
  // Estimated detergent + utilities cost: R7.50 / kg
  const estimatedVariableCost = Math.round(totalUsedKg * 7.5);
  const netGrossProfit = subMRR + totalOverageRevenue - estimatedVariableCost;
  const grossMargin = subMRR + totalOverageRevenue > 0 ? Math.round((netGrossProfit / (subMRR + totalOverageRevenue)) * 100) : 0;

  // Automated Subscription Alerts
  const lowAllowanceMembers = subscriptions.filter((s) => s.remainingKg <= 4 && s.status === 'active');
  const renewalDueMembers = subscriptions.filter((s) => s.paymentStatus === 'unpaid' || s.status === 'payment_pending');
  const expiredMembers = subscriptions.filter((s) => s.status === 'expired' || s.paymentStatus === 'overdue');

  // Filtered subscriptions list
  const filteredSubscriptions = useMemo(() => {
    return subscriptions.filter((sub) => {
      const matchesSearch =
        sub.membershipNumber.toLowerCase().includes(subSearchTerm.toLowerCase()) ||
        sub.customerName.toLowerCase().includes(subSearchTerm.toLowerCase()) ||
        sub.phone.toLowerCase().includes(subSearchTerm.toLowerCase()) ||
        sub.suburb.toLowerCase().includes(subSearchTerm.toLowerCase());

      const matchesTier = subTierFilter === 'all' || sub.tierId === subTierFilter;
      return matchesSearch && matchesTier;
    });
  }, [subscriptions, subSearchTerm, subTierFilter]);

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 pb-20 selection:bg-[#00AEEF] selection:text-white">
      {/* Top Founder Navigation & Command Bar */}
      <header className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-md border-b border-slate-800 shadow-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
          {/* Brand & Command Center Title */}
          <div className="flex items-center gap-3">
            <div className="bg-slate-900 border border-slate-700/80 p-2 rounded-2xl shadow-inner flex items-center">
              <GioLogo size="sm" variant="light" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg sm:text-xl font-black text-white font-display tracking-tight uppercase">
                  FOUNDER / ADMIN PORTAL
                </h1>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-[#00AEEF] text-slate-950 shadow-sm uppercase tracking-wider">
                  Command Center
                </span>
              </div>
              <p className="text-xs text-slate-400 font-medium">
                This is your command center · Real-time Pietermaritzburg Dispatch
              </p>
            </div>
          </div>

          {/* Quick Header Actions */}
          <div className="flex items-center gap-2.5">
            {activeTab === 'memberships' ? (
              <button
                onClick={() => setIsNewSubModalOpen(true)}
                className="px-3.5 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs sm:text-sm flex items-center gap-1.5 transition-all shadow-md active:scale-95 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span className="hidden sm:inline">Add Member</span>
                <span className="sm:hidden">Add</span>
              </button>
            ) : (
              <button
                onClick={() => setIsNewOrderModalOpen(true)}
                className="px-3.5 py-2 rounded-xl bg-[#00AEEF] hover:bg-sky-400 text-slate-950 font-bold text-xs sm:text-sm flex items-center gap-1.5 transition-all shadow-md shadow-sky-500/20 active:scale-95 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span className="hidden sm:inline">New Booking</span>
                <span className="sm:hidden">New</span>
              </button>
            )}

            <button
              onClick={handleExportCSV}
              className="hidden md:inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs sm:text-sm font-semibold border border-slate-700 transition-colors cursor-pointer"
              title="Export all orders to CSV spreadsheet"
            >
              <Download className="w-3.5 h-3.5" />
              <span>CSV</span>
            </button>

            <button
              onClick={onCloseAdmin}
              className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs sm:text-sm font-semibold transition-colors flex items-center gap-1.5 border border-slate-700 cursor-pointer"
              title="Return to customer storefront preview"
            >
              <span className="hidden sm:inline">Storefront</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>

            {onLogoutAdmin && (
              <button
                onClick={onLogoutAdmin}
                className="px-3 py-2 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 text-rose-300 text-xs sm:text-sm font-semibold transition-colors flex items-center gap-1.5 border border-rose-500/30 cursor-pointer"
                title="Lock Command Center & Sign Out"
              >
                <Lock className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Lock</span>
              </button>
            )}
          </div>
        </div>

        {/* View Mode Tabs Ribbon */}
        <div className="bg-slate-950/60 border-t border-slate-800/80">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between overflow-x-auto scrollbar-none py-2 gap-3">
            <div className="flex items-center gap-2">
              {/* Tab 1: Dashboard */}
              <button
                onClick={() => {
                  setActiveTab('dashboard');
                  setStatusFilter('all');
                }}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                  activeTab === 'dashboard'
                    ? 'bg-[#00AEEF] text-slate-950 shadow-md shadow-sky-500/20'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <LayoutDashboard className="w-4 h-4" />
                <span>Dashboard</span>
              </button>

              {/* Tab 2: Today's Bookings */}
              <button
                onClick={() => {
                  setActiveTab('today');
                  setStatusFilter('all');
                }}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer relative ${
                  activeTab === 'today'
                    ? 'bg-[#00AEEF] text-slate-950 shadow-md shadow-sky-500/20'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <Calendar className="w-4 h-4" />
                <span>Today’s Bookings</span>
                <span
                  className={`text-[10px] font-black px-1.5 py-0.5 rounded-full ${
                    activeTab === 'today'
                      ? 'bg-slate-950 text-white'
                      : 'bg-sky-500/20 text-sky-400 border border-sky-400/30'
                  }`}
                >
                  {todayOrders.length}
                </span>
              </button>

              {/* Tab 3: Command Pipeline (Kanban) */}
              <button
                onClick={() => {
                  setActiveTab('pipeline');
                  setStatusFilter('all');
                }}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                  activeTab === 'pipeline'
                    ? 'bg-[#00AEEF] text-slate-950 shadow-md shadow-sky-500/20'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <Kanban className="w-4 h-4" />
                <span>Command Pipeline</span>
              </button>

              {/* Tab 4: Subscriptions & Memberships */}
              <button
                onClick={() => {
                  setActiveTab('memberships');
                }}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer relative ${
                  activeTab === 'memberships'
                    ? 'bg-amber-400 text-slate-950 shadow-md shadow-amber-500/20 font-black'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <Award className="w-4 h-4" />
                <span>Memberships &amp; Subscriptions</span>
                <span
                  className={`text-[10px] font-black px-1.5 py-0.5 rounded-full ${
                    activeTab === 'memberships'
                      ? 'bg-slate-950 text-amber-300'
                      : 'bg-amber-500/20 text-amber-300 border border-amber-400/30'
                  }`}
                >
                  {subscriptions.length}
                </span>
              </button>
            </div>

            {/* Hub Operating Badge */}
            <div className="hidden md:flex items-center gap-3 text-xs text-slate-400">
              <span className="inline-flex items-center gap-1.5 text-emerald-400">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span className="font-semibold">Central PMB Hub Active</span>
              </span>
              <span>·</span>
              <span>Mon – Sat: 09h00–12h00 &amp; 14h00–17h00</span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 space-y-6">
        {/* ======================================================== */}
        {/* TAB 4: MEMBERSHIPS & SUBSCRIPTIONS COMMAND CENTER        */}
        {/* ======================================================== */}
        {activeTab === 'memberships' && (
          <div className="space-y-6 animate-fadeIn">
            {/* Subscription Executive Revenue, Usage & Profitability Ribbon */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              <div className="bg-slate-800/90 border border-slate-700/80 p-4 rounded-2xl shadow-sm">
                <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400">
                  Active Subscribers
                </span>
                <p className="text-2xl font-black text-white font-display tabular-nums mt-1">
                  {activeSubscribers}
                </p>
                <span className="text-[11px] text-slate-400 font-medium">
                  {subscriptions.length} total enrolled
                </span>
              </div>

              <div className="bg-slate-800/90 border border-slate-700/80 p-4 rounded-2xl shadow-sm">
                <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400">
                  Monthly Revenue (MRR)
                </span>
                <p className="text-2xl font-black text-emerald-400 font-display tabular-nums mt-1">
                  R{subMRR}
                </p>
                <span className="text-[11px] text-slate-400 font-medium">
                  Recurring subscription fee
                </span>
              </div>

              <div className="bg-slate-800/90 border border-slate-700/80 p-4 rounded-2xl shadow-sm">
                <span className="text-[11px] font-bold uppercase tracking-wider text-sky-400">
                  Laundry Capacity (KG)
                </span>
                <p className="text-2xl font-black text-sky-400 font-display tabular-nums mt-1">
                  {totalUsedKg.toFixed(1)} <span className="text-sm font-normal text-slate-400">/ {totalAllocatedKg}kg</span>
                </p>
                <span className="text-[11px] text-slate-400 font-medium">
                  {capacityUtilization}% allowance used
                </span>
              </div>

              <div className="bg-slate-800/90 border border-slate-700/80 p-4 rounded-2xl shadow-sm">
                <span className="text-[11px] font-bold uppercase tracking-wider text-purple-400">
                  Overage Charges
                </span>
                <p className="text-2xl font-black text-purple-400 font-display tabular-nums mt-1">
                  +R{totalOverageRevenue}
                </p>
                <span className="text-[11px] text-slate-400 font-medium">
                  Additional laundry billed
                </span>
              </div>

              <div className="bg-slate-800/90 border border-slate-700/80 p-4 rounded-2xl shadow-sm">
                <span className="text-[11px] font-bold uppercase tracking-wider text-cyan-400">
                  Estimated Net Profit
                </span>
                <p className="text-2xl font-black text-cyan-400 font-display tabular-nums mt-1">
                  R{netGrossProfit}
                </p>
                <span className="text-[11px] text-emerald-400 font-bold">
                  {grossMargin}% Gross Margin
                </span>
              </div>

              <div className="bg-slate-800/90 border border-slate-700/80 p-4 rounded-2xl shadow-sm">
                <span className="text-[11px] font-bold uppercase tracking-wider text-rose-400">
                  Action Triggers
                </span>
                <p className="text-2xl font-black text-rose-400 font-display tabular-nums mt-1">
                  {lowAllowanceMembers.length + renewalDueMembers.length + expiredMembers.length}
                </p>
                <span className="text-[11px] text-amber-300 font-medium">
                  Alerts requiring contact
                </span>
              </div>
            </div>

            {/* AUTOMATED NOTIFICATION & ALERT PANELS */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Alert 1: Low Allowance Warning */}
              <div className="bg-amber-950/40 border border-amber-500/40 rounded-2xl p-4.5 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="w-5 h-5 text-amber-400" />
                    <h4 className="font-bold text-sm text-white font-display">
                      Low Allowance Warning ({lowAllowanceMembers.length})
                    </h4>
                  </div>
                  <span className="text-[10px] font-bold uppercase bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-full border border-amber-500/30">
                    &le; 4 kg left
                  </span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  These subscribers have less than 4 kg remaining. One-click WhatsApp alert notifies them before overage occurs.
                </p>

                <div className="space-y-2 pt-1">
                  {lowAllowanceMembers.map((m) => (
                    <div
                      key={m.membershipNumber}
                      className="bg-slate-900/90 border border-amber-500/30 rounded-xl p-2.5 flex items-center justify-between gap-2"
                    >
                      <div>
                        <p className="text-xs font-bold text-white">{m.customerName}</p>
                        <p className="text-[10px] text-amber-300 font-semibold">
                          #{m.membershipNumber} · {m.remainingKg.toFixed(1)} kg remaining
                        </p>
                      </div>
                      <a
                        href={getSubWhatsAppUrl(m, 'low_allowance')}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-2.5 py-1 rounded-lg bg-amber-400 hover:bg-amber-300 text-slate-950 text-[11px] font-bold flex items-center gap-1 transition-colors"
                        title="Send low allowance warning on WhatsApp"
                      >
                        <Send className="w-3 h-3" />
                        <span>Notify</span>
                      </a>
                    </div>
                  ))}
                  {lowAllowanceMembers.length === 0 && (
                    <p className="text-xs text-slate-500 italic py-2">No members low on allowance.</p>
                  )}
                </div>
              </div>

              {/* Alert 2: Renewal Reminders Due */}
              <div className="bg-sky-950/40 border border-sky-500/40 rounded-2xl p-4.5 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Clock className="w-5 h-5 text-sky-400" />
                    <h4 className="font-bold text-sm text-white font-display">
                      Renewal Reminders ({renewalDueMembers.length})
                    </h4>
                  </div>
                  <span className="text-[10px] font-bold uppercase bg-sky-500/20 text-sky-300 px-2 py-0.5 rounded-full border border-sky-500/30">
                    Due Soon
                  </span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Subscribers approaching monthly billing renewal. Send renewal reminder to lock in next month's recurring booking.
                </p>

                <div className="space-y-2 pt-1">
                  {renewalDueMembers.map((m) => (
                    <div
                      key={m.membershipNumber}
                      className="bg-slate-900/90 border border-sky-500/30 rounded-xl p-2.5 flex items-center justify-between gap-2"
                    >
                      <div>
                        <p className="text-xs font-bold text-white">{m.customerName}</p>
                        <p className="text-[10px] text-sky-300 font-semibold">
                          #{m.membershipNumber} · Due: {m.renewalDate}
                        </p>
                      </div>
                      <a
                        href={getSubWhatsAppUrl(m, 'renewal')}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-2.5 py-1 rounded-lg bg-sky-400 hover:bg-sky-300 text-slate-950 text-[11px] font-bold flex items-center gap-1 transition-colors"
                        title="Send renewal reminder on WhatsApp"
                      >
                        <Send className="w-3 h-3" />
                        <span>Remind</span>
                      </a>
                    </div>
                  ))}
                  {renewalDueMembers.length === 0 && (
                    <p className="text-xs text-slate-500 italic py-2">No renewals pending.</p>
                  )}
                </div>
              </div>

              {/* Alert 3: Flagged Expired / Unpaid */}
              <div className="bg-rose-950/40 border border-rose-500/40 rounded-2xl p-4.5 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-rose-400" />
                    <h4 className="font-bold text-sm text-white font-display">
                      Flagged Unpaid / Expired ({expiredMembers.length})
                    </h4>
                  </div>
                  <span className="text-[10px] font-bold uppercase bg-rose-500/20 text-rose-300 px-2 py-0.5 rounded-full border border-rose-500/30">
                    Overdue
                  </span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Accounts flagged for overdue payment or expired subscription cycle. Record Speedpoint payment or contact.
                </p>

                <div className="space-y-2 pt-1">
                  {expiredMembers.map((m) => (
                    <div
                      key={m.membershipNumber}
                      className="bg-slate-900/90 border border-rose-500/30 rounded-xl p-2.5 flex items-center justify-between gap-2"
                    >
                      <div>
                        <p className="text-xs font-bold text-white">{m.customerName}</p>
                        <p className="text-[10px] text-rose-300 font-semibold">
                          #{m.membershipNumber} · R{m.monthlyFee} unpaid
                        </p>
                      </div>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => {
                            onUpdateSubscription({
                              ...m,
                              paymentStatus: 'paid',
                              status: 'active',
                              lastPaymentDate: new Date().toISOString().split('T')[0],
                            });
                          }}
                          className="px-2 py-1 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-[10px] font-bold"
                          title="Record payment received via Speedpoint/Cash"
                        >
                          Mark Paid
                        </button>
                        <a
                          href={getSubWhatsAppUrl(m, 'unpaid')}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-rose-300"
                        >
                          <Send className="w-3 h-3" />
                        </a>
                      </div>
                    </div>
                  ))}
                  {expiredMembers.length === 0 && (
                    <p className="text-xs text-slate-500 italic py-2">All memberships in good standing.</p>
                  )}
                </div>
              </div>
            </div>

            {/* MASTER SUBSCRIBERS DIRECTORY TABLE */}
            <div className="bg-slate-800/90 border border-slate-700/80 rounded-2xl shadow-xl overflow-hidden space-y-4 p-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-700/80 pb-4">
                <div className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-amber-400" />
                  <h3 className="font-bold text-white font-display text-base">
                    Subscribers Roster &amp; Allowance Tracking ({filteredSubscriptions.length})
                  </h3>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  {/* Search input */}
                  <div className="relative">
                    <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Search member #, name, phone..."
                      value={subSearchTerm}
                      onChange={(e) => setSubSearchTerm(e.target.value)}
                      className="pl-8 pr-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  {/* Tier filter */}
                  <select
                    value={subTierFilter}
                    onChange={(e) => setSubTierFilter(e.target.value)}
                    className="px-2.5 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-xs font-semibold text-slate-200 cursor-pointer"
                  >
                    <option value="all">All Plans</option>
                    <option value="essential">Gio's Essential (R299)</option>
                    <option value="comfort">Gio's Comfort (R599)</option>
                    <option value="family">Gio's Family (R999)</option>
                  </select>

                  <button
                    onClick={() => setIsNewSubModalOpen(true)}
                    className="px-3 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Member</span>
                  </button>
                </div>
              </div>

              {/* Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs sm:text-sm text-slate-200">
                  <thead className="bg-slate-950/70 text-slate-400 uppercase text-[11px] font-bold tracking-wider border-b border-slate-700">
                    <tr>
                      <th className="py-3 px-4">Member ID &amp; Customer</th>
                      <th className="py-3 px-4">Plan &amp; Payment</th>
                      <th className="py-3 px-4">Kilogram Allowance Meter</th>
                      <th className="py-3 px-4">Bookings &amp; Renewal</th>
                      <th className="py-3 px-4">Overage (ZAR)</th>
                      <th className="py-3 px-4 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-700/50">
                    {filteredSubscriptions.map((sub) => {
                      const percentageUsed = Math.min(
                        100,
                        Math.round((sub.usedKg / (sub.totalKgAllowance || 1)) * 100)
                      );
                      const isLow = sub.remainingKg <= 4 && sub.status === 'active';

                      return (
                        <tr key={sub.membershipNumber} className="hover:bg-slate-700/30 transition-colors">
                          {/* Member ID & Customer */}
                          <td className="py-4 px-4">
                            <span className="font-black text-amber-400 font-display text-sm">
                              #{sub.membershipNumber}
                            </span>
                            <p className="font-bold text-white text-sm mt-0.5">{sub.customerName}</p>
                            <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                              <Phone className="w-3 h-3 text-slate-500" />
                              <span>{sub.phone}</span>
                            </p>
                            <p className="text-[11px] text-slate-400 max-w-[200px] truncate mt-0.5">
                              {sub.address}, <strong className="text-slate-300">{sub.suburb}</strong>
                            </p>
                          </td>

                          {/* Plan & Payment */}
                          <td className="py-4 px-4">
                            <p className="font-bold text-white text-xs sm:text-sm">{sub.packageName}</p>
                            <p className="text-xs text-sky-400 font-semibold tabular-nums">
                              R{sub.monthlyFee} / month
                            </p>
                            <div className="mt-1 flex items-center gap-1.5">
                              <span
                                className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full border ${
                                  sub.paymentStatus === 'paid'
                                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                                    : sub.paymentStatus === 'unpaid'
                                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                                    : 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                                }`}
                              >
                                {sub.paymentStatus.toUpperCase()}
                              </span>

                              {sub.paymentStatus !== 'paid' && (
                                <button
                                  onClick={() => {
                                    onUpdateSubscription({
                                      ...sub,
                                      paymentStatus: 'paid',
                                      status: 'active',
                                      lastPaymentDate: todayDateStr,
                                    });
                                  }}
                                  className="text-[10px] font-bold text-emerald-400 hover:underline"
                                  title="Mark as paid via Speedpoint"
                                >
                                  Mark Paid
                                </button>
                              )}
                            </div>
                          </td>

                          {/* Allowance Meter */}
                          <td className="py-4 px-4 min-w-[180px]">
                            <div className="space-y-1">
                              <div className="flex justify-between text-xs font-semibold">
                                <span className={isLow ? 'text-amber-400 font-bold' : 'text-slate-300'}>
                                  {sub.remainingKg.toFixed(1)} kg left
                                </span>
                                <span className="text-slate-400 text-[11px]">
                                  {sub.usedKg.toFixed(1)} / {sub.totalKgAllowance} kg
                                </span>
                              </div>

                              {/* Progress bar */}
                              <div className="w-full bg-slate-900 rounded-full h-2.5 overflow-hidden border border-slate-700">
                                <div
                                  className={`h-full rounded-full transition-all ${
                                    isLow
                                      ? 'bg-gradient-to-r from-amber-400 to-rose-400'
                                      : 'bg-gradient-to-r from-sky-400 to-emerald-400'
                                  }`}
                                  style={{ width: `${percentageUsed}%` }}
                                />
                              </div>

                              {isLow && (
                                <p className="text-[10px] text-amber-300 font-semibold flex items-center gap-1">
                                  <AlertCircle className="w-3 h-3" />
                                  <span>Allowance running low!</span>
                                </p>
                              )}
                            </div>
                          </td>

                          {/* Bookings & Renewal */}
                          <td className="py-4 px-4">
                            <p className="text-xs text-slate-300">
                              Bookings:{' '}
                              <strong className="text-white">
                                {sub.usedBookingsCount}
                                {sub.maxBookingsPerMonth
                                  ? ` / ${sub.maxBookingsPerMonth}`
                                  : ' (Flexible)'}
                              </strong>
                            </p>
                            <p className="text-[11px] text-slate-400 mt-1">
                              Renews: <strong className="text-slate-200">{sub.renewalDate}</strong>
                            </p>
                          </td>

                          {/* Overage Charges */}
                          <td className="py-4 px-4">
                            {sub.overageKgUsed > 0 ? (
                              <div>
                                <span className="text-xs font-bold text-rose-400">
                                  +{sub.overageKgUsed} kg extra
                                </span>
                                <p className="text-xs font-black text-white tabular-nums">
                                  +R{sub.overageCharges}
                                </p>
                              </div>
                            ) : (
                              <span className="text-xs text-slate-500">None</span>
                            )}
                          </td>

                          {/* Actions */}
                          <td className="py-4 px-4 text-center">
                            <div className="flex items-center justify-center gap-1">
                              {/* WhatsApp Contact */}
                              <a
                                href={getSubWhatsAppUrl(sub, isLow ? 'low_allowance' : 'general')}
                                target="_blank"
                                rel="noopener noreferrer"
                                title="Send WhatsApp alert or update"
                                className="p-1.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-400/30 transition-colors"
                              >
                                <MessageCircle className="w-4 h-4" />
                              </a>

                              {/* Edit Subscription */}
                              <button
                                onClick={() => setEditingSub(sub)}
                                title="Edit subscriber allowance & notes"
                                className="p-1.5 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-200 transition-colors cursor-pointer"
                              >
                                <Edit className="w-4 h-4" />
                              </button>

                              {/* Delete Subscription */}
                              <button
                                onClick={() => {
                                  if (
                                    window.confirm(
                                      `Are you sure you want to remove subscription #${sub.membershipNumber} for ${sub.customerName}?`
                                    )
                                  ) {
                                    onDeleteSubscription(sub.membershipNumber);
                                  }
                                }}
                                title="Remove subscription"
                                className="p-1.5 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/30 transition-colors cursor-pointer"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {filteredSubscriptions.length === 0 && (
                <div className="py-12 text-center text-slate-400">
                  <Award className="w-10 h-10 text-slate-600 mx-auto mb-2" />
                  <p className="font-semibold text-white">No subscribers match your search.</p>
                  <p className="text-xs text-slate-400 mt-1">Try clearing filters or add a new subscriber.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* KPI METRICS RIBBON (Command Center Health - Always shown for Dashboard/Today/Pipeline) */}
        {activeTab !== 'memberships' && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            <div className="bg-slate-800/90 border border-slate-700/80 p-4 rounded-2xl shadow-sm">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Today’s Bookings
              </span>
              <p className="text-2xl font-black text-white font-display tabular-nums mt-1">
                {activeTodayCount}
              </p>
              <span className="text-[11px] text-sky-400 font-semibold">
                {todayCompletedCount} Completed
              </span>
            </div>

            <div className="bg-slate-800/90 border border-slate-700/80 p-4 rounded-2xl shadow-sm">
              <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400">
                Verification / Scheduled
              </span>
              <p className="text-2xl font-black text-amber-400 font-display tabular-nums mt-1">
                {
                  orders.filter(
                    (o) =>
                      normalizeStatus(o.status) === 'new_request' ||
                      normalizeStatus(o.status) === 'verification_pending' ||
                      normalizeStatus(o.status) === 'verified' ||
                      normalizeStatus(o.status) === 'pickup_scheduled'
                  ).length
                }
              </p>
              <span className="text-[11px] text-slate-400 font-medium">Pending Pickup</span>
            </div>

            <div className="bg-slate-800/90 border border-slate-700/80 p-4 rounded-2xl shadow-sm">
              <span className="text-[11px] font-bold uppercase tracking-wider text-cyan-400">
                Collected &amp; In Spa
              </span>
              <p className="text-2xl font-black text-cyan-400 font-display tabular-nums mt-1">
                {
                  orders.filter(
                    (o) =>
                      normalizeStatus(o.status) === 'collected' ||
                      normalizeStatus(o.status) === 'processing'
                  ).length
                }
              </p>
              <span className="text-[11px] text-slate-400 font-medium">Drum wash &amp; clinic</span>
            </div>

            <div className="bg-slate-800/90 border border-slate-700/80 p-4 rounded-2xl shadow-sm">
              <span className="text-[11px] font-bold uppercase tracking-wider text-teal-400">
                Ready &amp; Delivered
              </span>
              <p className="text-2xl font-black text-teal-400 font-display tabular-nums mt-1">
                {
                  orders.filter(
                    (o) =>
                      normalizeStatus(o.status) === 'ready' ||
                      normalizeStatus(o.status) === 'delivered'
                  ).length
                }
              </p>
              <span className="text-[11px] text-slate-400 font-medium">Handover stage</span>
            </div>

            <div className="bg-slate-800/90 border border-slate-700/80 p-4 rounded-2xl shadow-sm">
              <span className="text-[11px] font-bold uppercase tracking-wider text-rose-400">
                Payment Outstanding
              </span>
              <p className="text-2xl font-black text-rose-400 font-display tabular-nums mt-1">
                {orders.filter((o) => normalizeStatus(o.status) === 'payment_outstanding').length}
              </p>
              <span className="text-[11px] text-rose-300 font-medium">
                R
                {orders
                  .filter((o) => normalizeStatus(o.status) === 'payment_outstanding')
                  .reduce((s, o) => s + o.total, 0)}{' '}
                Due
              </span>
            </div>

            <div className="bg-slate-800/90 border border-slate-700/80 p-4 rounded-2xl shadow-sm">
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400">
                Today’s Revenue
              </span>
              <p className="text-2xl font-black text-emerald-400 font-display tabular-nums mt-1">
                R{todayCollectedRev}
              </p>
              <span className="text-[11px] text-slate-400 font-medium">
                +R{todayPendingRev} in pipeline
              </span>
            </div>
          </div>
        )}

        {/* 10-STAGE COMMAND CENTER STATUS STRIP (For Dashboard, Today, Pipeline) */}
        {activeTab !== 'memberships' && (
          <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-4 shadow-sm space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-700/60 pb-2.5">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-[#00AEEF]" />
                <h2 className="text-xs sm:text-sm font-bold text-white uppercase tracking-wider">
                  10-Stage Dispatch Pipeline {activeTab === 'today' ? "(Today's Bookings)" : '(All Orders)'}
                </h2>
              </div>
              <div className="text-xs text-slate-400 flex items-center gap-2">
                <span>Click any stage below to filter view instantly:</span>
                {statusFilter !== 'all' && (
                  <button
                    onClick={() => setStatusFilter('all')}
                    className="text-xs text-[#00AEEF] hover:underline font-bold cursor-pointer"
                  >
                    Show All ({activeTab === 'today' ? todayOrders.length : orders.length})
                  </button>
                )}
              </div>
            </div>

            {/* 10 Lifecycle Stages Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-5 lg:grid-cols-10 gap-2">
              {FOUNDER_STAGES.map((stg, i) => {
                const currentList = activeTab === 'today' ? todayOrders : orders;
                const count = currentList.filter(
                  (o) => normalizeStatus(o.status) === stg.value || o.status === stg.value
                ).length;
                const isSelected = statusFilter === stg.value;

                return (
                  <button
                    key={stg.value}
                    onClick={() => setStatusFilter(isSelected ? 'all' : stg.value)}
                    className={`p-2.5 rounded-xl text-left border transition-all cursor-pointer relative group ${
                      isSelected
                        ? 'bg-slate-900 border-[#00AEEF] shadow-md shadow-sky-500/20 ring-1 ring-[#00AEEF]'
                        : 'bg-slate-900/60 border-slate-700/60 hover:bg-slate-900/90 hover:border-slate-600'
                    }`}
                    title={`${stg.label}: ${stg.description}`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] font-bold text-slate-400">
                        #{i + 1}
                      </span>
                      <span
                        className={`w-2 h-2 rounded-full ${stg.dotClass} ${
                          count > 0 ? 'ring-2 ring-white/20' : 'opacity-40'
                        }`}
                      />
                    </div>
                    <p className="text-xs font-bold text-white truncate leading-tight">
                      {stg.label}
                    </p>
                    <div className="flex items-center justify-between mt-1">
                      <span
                        className={`text-sm font-black font-display tabular-nums ${
                          count > 0 ? 'text-[#00AEEF]' : 'text-slate-500'
                        }`}
                      >
                        {count}
                      </span>
                      {count > 0 && (
                        <span className="text-[9px] text-slate-400 uppercase font-semibold">
                          active
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* VIEW 1: TODAY'S BOOKINGS (COMMAND CENTER VIEW)            */}
        {/* ======================================================== */}
        {activeTab === 'today' && (
          <div className="space-y-6 animate-fadeIn">
            {/* Today's Route & Dispatch Banner */}
            <div className="bg-gradient-to-r from-sky-950/80 via-slate-900 to-indigo-950/80 border border-sky-500/30 rounded-2xl p-5 shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <Flame className="w-5 h-5 text-amber-400" />
                  <h3 className="text-base sm:text-lg font-black text-white font-display">
                    Today’s Bookings &amp; Courier Dispatch Command
                  </h3>
                  <span className="bg-sky-500/20 text-sky-300 text-xs font-bold px-2 py-0.5 rounded-full border border-sky-400/30">
                    {todayOrders.length} Bookings Scheduled
                  </span>
                </div>
                <p className="text-xs text-slate-300 mt-1">
                  Assigned Courier: <strong className="text-white">Sipho Madlala</strong> · Van:{' '}
                  <strong className="text-white">Toyota Proace (KZN 482 PM)</strong> · Certified Digital Scales:{' '}
                  <span className="text-emerald-400 font-bold">Calibrated</span> · Mobile Speedpoint:{' '}
                  <span className="text-emerald-400 font-bold">Online</span>
                </p>
              </div>

              {/* Time Slot Filter Pills */}
              <div className="flex items-center gap-2 shrink-0">
                <span className="text-xs font-bold text-slate-400">Pickup Slot:</span>
                <button
                  onClick={() => setTodayTimeSlotFilter('all')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    todayTimeSlotFilter === 'all'
                      ? 'bg-[#00AEEF] text-slate-950 font-black'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  All ({todayOrders.length})
                </button>
                <button
                  onClick={() => setTodayTimeSlotFilter('Morning')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    todayTimeSlotFilter === 'Morning'
                      ? 'bg-amber-400 text-slate-950 font-black'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  Morning (09h00–12h00)
                </button>
                <button
                  onClick={() => setTodayTimeSlotFilter('Afternoon')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    todayTimeSlotFilter === 'Afternoon'
                      ? 'bg-sky-400 text-slate-950 font-black'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  Afternoon (14h00–17h00)
                </button>
              </div>
            </div>

            {/* Today's Orders Listing Table */}
            <div className="bg-slate-800/90 border border-slate-700/80 rounded-2xl shadow-xl overflow-hidden">
              <div className="p-4 border-b border-slate-700/80 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-[#00AEEF]" />
                  <h3 className="font-bold text-white font-display text-sm sm:text-base">
                    Today’s Bookings Schedule ({filteredTodayOrders.length})
                  </h3>
                </div>
                <div className="text-xs text-slate-400">
                  Step orders through stages as driver collects, weighs, washes &amp; delivers
                </div>
              </div>

              {filteredTodayOrders.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs sm:text-sm text-slate-200">
                    <thead className="bg-slate-950/70 text-slate-400 uppercase text-[11px] font-bold tracking-wider border-b border-slate-700">
                      <tr>
                        <th className="py-3 px-4">Order &amp; Slot</th>
                        <th className="py-3 px-4">Customer &amp; Location</th>
                        <th className="py-3 px-4">Services / Items</th>
                        <th className="py-3 px-4">Current Stage</th>
                        <th className="py-3 px-4 text-right">Total &amp; Weighing</th>
                        <th className="py-3 px-4 text-center">Stage Advance &amp; Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-700/50">
                      {filteredTodayOrders.map((order) => {
                        const norm = normalizeStatus(order.status);
                        const stage = FOUNDER_STAGES.find((s) => s.value === norm) || FOUNDER_STAGES[0];
                        const nextStage = getNextStage(norm);
                        const nextConfig = nextStage ? FOUNDER_STAGES.find((s) => s.value === nextStage) : null;

                        return (
                          <tr key={order.id} className="hover:bg-slate-700/30 transition-colors">
                            {/* Order & Slot */}
                            <td className="py-4 px-4">
                              <div className="flex items-center gap-1.5 flex-wrap">
                                <span className="font-black text-white font-display text-sm">
                                  #{order.id}
                                </span>
                                {order.memberNumber && (
                                  <span className="bg-amber-500/20 text-amber-300 text-[10px] font-bold px-1.5 py-0.5 rounded border border-amber-400/30">
                                    MEMBER #{order.memberNumber}
                                  </span>
                                )}
                                {order.isFirstTimeCustomer && (
                                  <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-bold px-1.5 py-0.5 rounded border border-emerald-400/30">
                                    1st-TIME FREE DEL
                                  </span>
                                )}
                                {order.isExpress && (
                                  <span className="bg-amber-500/20 text-amber-300 text-[10px] font-bold px-1.5 py-0.5 rounded border border-amber-400/30">
                                    EXPRESS
                                  </span>
                                )}
                              </div>
                              <p className="text-[11px] font-bold text-sky-400 mt-1 flex items-center gap-1">
                                <Clock className="w-3 h-3 text-sky-400" />
                                <span>{order.pickupTimeSlot}</span>
                              </p>
                              <p className="text-[10px] text-slate-400 mt-0.5">
                                Booked: {order.createdAt}
                              </p>
                            </td>

                            {/* Customer & Location */}
                            <td className="py-4 px-4">
                              <p className="font-bold text-white text-sm">{order.customerName}</p>
                              <a
                                href={`tel:${order.phone}`}
                                className="text-xs text-sky-400 hover:text-sky-300 flex items-center gap-1 mt-0.5"
                              >
                                <Phone className="w-3 h-3" />
                                <span>{order.phone}</span>
                              </a>
                              <p className="text-xs text-slate-300 mt-1 font-medium">
                                {order.address},{' '}
                                <strong className="text-white">{order.suburb}</strong>
                              </p>
                              {order.specialInstructions && (
                                <p className="text-[11px] text-amber-300 italic mt-0.5 max-w-[220px] truncate">
                                  Note: {order.specialInstructions}
                                </p>
                              )}
                            </td>

                            {/* Services */}
                            <td className="py-4 px-4">
                              <div className="space-y-1">
                                {order.items.map((item, idx) => (
                                  <div key={idx} className="text-xs text-slate-300">
                                    <span className="font-bold text-white tabular-nums">
                                      {item.quantity} {item.unit}
                                    </span>{' '}
                                    · {item.serviceName}
                                  </div>
                                ))}
                              </div>
                              {order.isMemberBooking && (
                                <p className="text-[11px] text-emerald-400 font-semibold mt-1">
                                  Covered by Allowance: {order.memberKgCovered} kg
                                </p>
                              )}
                              {order.shoePhotos && order.shoePhotos.length > 0 && (
                                <button
                                  onClick={() => setPhotoViewerOrder(order)}
                                  className="inline-flex items-center gap-1 text-[11px] text-sky-400 hover:text-sky-300 font-medium mt-1 underline"
                                >
                                  <Camera className="w-3 h-3" />
                                  <span>{order.shoePhotos.length} Shoe Photo(s)</span>
                                </button>
                              )}
                            </td>

                            {/* Current Stage */}
                            <td className="py-4 px-4">
                              <div className="space-y-1.5">
                                <span
                                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold border ${stage.badgeClass}`}
                                >
                                  <span className={`w-2 h-2 rounded-full ${stage.dotClass}`} />
                                  <span>{stage.label}</span>
                                </span>

                                <select
                                  value={norm}
                                  onChange={(e) =>
                                    handleQuickStatusChange(order, e.target.value as OrderStatus)
                                  }
                                  className="w-full text-xs font-semibold bg-slate-900 border border-slate-700 text-slate-200 rounded-lg px-2 py-1 cursor-pointer focus:border-[#00AEEF]"
                                  title="Change to any of the 10 stages"
                                >
                                  {FOUNDER_STAGES.map((s) => (
                                    <option key={s.value} value={s.value}>
                                      {s.label}
                                    </option>
                                  ))}
                                </select>
                              </div>
                            </td>

                            {/* Total & Weighing */}
                            <td className="py-4 px-4 text-right">
                              <p className="font-black text-white font-display text-base tabular-nums">
                                R{order.total}
                              </p>
                              <p className="text-[10px] text-slate-400">
                                {order.deliveryFee === 0 ? (
                                  order.isFirstTimeCustomer ? '1st-Time Free' : 'Free Del'
                                ) : (
                                  `+R${order.deliveryFee} Del`
                                )}
                              </p>
                              <div className="mt-1">
                                {order.invoiceIssued ? (
                                  <span
                                    className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-300 bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-500/30"
                                    title={`Weighed on certified digital scale by ${order.invoiceIssuedBy || 'Staff'}`}
                                  >
                                    <Scale className="w-3 h-3 text-emerald-400" />
                                    <span>
                                      {order.weighedWeightKg ? `${order.weighedWeightKg} kg` : 'Invoiced'}
                                    </span>
                                  </span>
                                ) : (
                                  <button
                                    onClick={() => handleOpenWeighingModal(order)}
                                    className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-300 bg-amber-950/60 hover:bg-amber-900/60 px-2 py-0.5 rounded-full border border-amber-500/30 transition-colors"
                                  >
                                    <Scale className="w-3 h-3 text-amber-400" />
                                    <span>Weigh on Scale</span>
                                  </button>
                                )}
                              </div>
                              <div className="mt-1.5 pt-1.5 border-t border-slate-700/40">
                                {renderPaymentStatusBadge(order)}
                              </div>
                            </td>

                            {/* Actions & Next Stage Advance */}
                            <td className="py-4 px-4 text-center">
                              <div className="flex flex-col items-center gap-1.5">
                                {nextConfig && (
                                  <button
                                    onClick={() => handleQuickStatusChange(order, nextConfig.value)}
                                    className="w-full px-2.5 py-1 rounded-lg bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-1 transition-all shadow-sm cursor-pointer"
                                    title={`Advance to ${nextConfig.label}`}
                                  >
                                    <span>Advance: {nextConfig.shortLabel}</span>
                                    <ChevronRight className="w-3.5 h-3.5" />
                                  </button>
                                )}

                                <div className="flex items-center gap-1">
                                  {order.paymentMethod === 'Cash on Delivery' && !order.cashReceivedRecord && order.paymentStatus !== 'paid' && (
                                    <button
                                      onClick={() => handleOpenCashRecordingModal(order)}
                                      title="Mark CASH RECEIVED ✓ (Record driver cash collection)"
                                      className="p-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 transition-colors cursor-pointer"
                                    >
                                      <Banknote className="w-4 h-4" />
                                    </button>
                                  )}

                                  <button
                                    onClick={() => handleOpenWeighingModal(order)}
                                    title="Weigh garments on digital scale & issue official tax invoice"
                                    className="p-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-400/30 transition-colors cursor-pointer"
                                  >
                                    <Scale className="w-4 h-4" />
                                  </button>

                                  <a
                                    href={getWhatsAppStatusUrl(order)}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    title="Send WhatsApp update to customer"
                                    className="p-1.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-400/30 transition-colors cursor-pointer"
                                  >
                                    <MessageCircle className="w-4 h-4" />
                                  </a>

                                  <button
                                    onClick={() => onViewInvoice(order)}
                                    title="View / Print Tax Invoice"
                                    className="p-1.5 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-200 transition-colors cursor-pointer"
                                  >
                                    <FileText className="w-4 h-4" />
                                  </button>

                                  <button
                                    onClick={() => setEditingOrder(order)}
                                    title="Edit details"
                                    className="p-1.5 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-200 transition-colors cursor-pointer"
                                  >
                                    <Edit className="w-4 h-4" />
                                  </button>
                                </div>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="py-16 text-center text-slate-400">
                  <Calendar className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                  <p className="text-base font-bold text-white">No bookings match the selected criteria.</p>
                  <p className="text-xs text-slate-400 mt-1">
                    Try clearing the time slot filter or create a new booking using the + New Booking button above.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* VIEW 2: DASHBOARD (ALL ORDERS & MASTER COMMAND TABLE)    */}
        {/* ======================================================== */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6 animate-fadeIn">
            {/* Search & Filter Header */}
            <div className="bg-slate-800/90 border border-slate-700/80 rounded-2xl p-4 sm:p-5 shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row items-center gap-3">
                <div className="relative flex-1 w-full">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search by Order #, member code, customer name, phone, PMB suburb..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder:text-slate-500 text-sm focus:border-[#00AEEF] focus:outline-none"
                  />
                </div>

                <div className="bg-slate-900 text-sky-400 border border-slate-700 px-3.5 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-[#00AEEF]" />
                  <span>Pietermaritzburg Central Operations</span>
                </div>
              </div>

              {/* Status Filter Tab Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                <span className="text-xs font-bold text-slate-400 mr-1.5 shrink-0">
                  Quick Filter:
                </span>
                <button
                  onClick={() => setStatusFilter('all')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold shrink-0 transition-all cursor-pointer ${
                    statusFilter === 'all'
                      ? 'bg-[#00AEEF] text-slate-950 font-black'
                      : 'bg-slate-900 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  All Orders ({orders.length})
                </button>
                {FOUNDER_STAGES.map((opt) => {
                  const count = orders.filter((o) => normalizeStatus(o.status) === opt.value).length;
                  return (
                    <button
                      key={opt.value}
                      onClick={() => setStatusFilter(opt.value)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold shrink-0 transition-all cursor-pointer ${
                        statusFilter === opt.value
                          ? 'bg-[#00AEEF] text-slate-950 font-black'
                          : 'bg-slate-900 text-slate-300 hover:bg-slate-700'
                      }`}
                    >
                      {opt.label} ({count})
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Master Orders Table */}
            <div className="bg-slate-800/90 border border-slate-700/80 rounded-2xl shadow-xl overflow-hidden">
              <div className="p-4 border-b border-slate-700/80 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Package className="w-5 h-5 text-[#00AEEF]" />
                  <h3 className="font-bold text-white font-display text-sm sm:text-base">
                    Master Orders Registry ({filteredOrders.length})
                  </h3>
                </div>
                <div className="text-xs text-slate-400">
                  Click status to jump to any stage or advance sequentially
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs sm:text-sm text-slate-200">
                  <thead className="bg-slate-950/70 text-slate-400 uppercase text-[11px] font-bold tracking-wider border-b border-slate-700">
                    <tr>
                      <th className="py-3 px-4">Order ID &amp; Pickup</th>
                      <th className="py-3 px-4">Customer &amp; Location</th>
                      <th className="py-3 px-4">Services / Weight</th>
                      <th className="py-3 px-4">Lifecycle Stage</th>
                      <th className="py-3 px-4 text-right">Total &amp; Invoice</th>
                      <th className="py-3 px-4 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-700/50">
                    {filteredOrders.map((order) => {
                      const norm = normalizeStatus(order.status);
                      const stage = FOUNDER_STAGES.find((s) => s.value === norm) || FOUNDER_STAGES[0];
                      const nextStage = getNextStage(norm);
                      const nextConfig = nextStage ? FOUNDER_STAGES.find((s) => s.value === nextStage) : null;

                      return (
                        <tr key={order.id} className="hover:bg-slate-700/30 transition-colors">
                          {/* Order & Date */}
                          <td className="py-3.5 px-4">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <span className="font-black text-white font-display text-sm">
                                #{order.id}
                              </span>
                              {order.memberNumber && (
                                <span className="bg-amber-500/20 text-amber-300 text-[10px] font-bold px-1.5 py-0.5 rounded border border-amber-400/30">
                                  MEMBER #{order.memberNumber}
                                </span>
                              )}
                              {order.isFirstTimeCustomer && (
                                <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-bold px-1.5 py-0.5 rounded border border-emerald-400/30">
                                  1st-TIME
                                </span>
                              )}
                              {order.isExpress && (
                                <span className="bg-amber-500/20 text-amber-300 text-[10px] font-bold px-1.5 py-0.5 rounded border border-amber-400/30">
                                  EXPRESS
                                </span>
                              )}
                            </div>
                            <p className="text-[11px] text-slate-400 mt-1">
                              Pickup: {order.pickupDate}
                            </p>
                            <p className="text-[11px] text-sky-400 font-medium">
                              {order.pickupTimeSlot}
                            </p>
                            {order.shoePhotos && order.shoePhotos.length > 0 && (
                              <button
                                onClick={() => setPhotoViewerOrder(order)}
                                className="inline-flex items-center gap-1 text-[11px] text-sky-400 hover:text-sky-300 font-medium mt-1 underline"
                              >
                                <Camera className="w-3 h-3" />
                                <span>{order.shoePhotos.length} Shoe Photo(s)</span>
                              </button>
                            )}
                          </td>

                          {/* Customer */}
                          <td className="py-3.5 px-4">
                            <p className="font-bold text-white">{order.customerName}</p>
                            <a
                              href={`tel:${order.phone}`}
                              className="text-xs text-sky-400 hover:text-sky-300 flex items-center gap-1 mt-0.5"
                            >
                              <Phone className="w-3 h-3 text-slate-400" />
                              <span>{order.phone}</span>
                            </a>
                            <p className="text-[11px] text-slate-300 mt-1 max-w-[200px] truncate">
                              {order.address},{' '}
                              <strong className="text-white">{order.suburb}</strong>
                            </p>
                            {order.specialInstructions && (
                              <p className="text-[11px] text-amber-300 italic mt-0.5 max-w-[200px] truncate">
                                Note: {order.specialInstructions}
                              </p>
                            )}
                          </td>

                          {/* Services */}
                          <td className="py-3.5 px-4">
                            <div className="space-y-1">
                              {order.items.map((item, i) => (
                                <div key={i} className="text-xs text-slate-300">
                                  <span className="font-bold text-white tabular-nums">
                                    {item.quantity} {item.unit}
                                  </span>{' '}
                                  · {item.serviceName}
                                </div>
                              ))}
                            </div>
                            {order.isMemberBooking && (
                              <p className="text-[11px] text-emerald-400 font-semibold mt-1">
                                Allowance: {order.memberKgCovered} kg covered (R0)
                              </p>
                            )}
                          </td>

                          {/* Stage */}
                          <td className="py-3.5 px-4">
                            <div className="space-y-1.5">
                              <span
                                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold border ${stage.badgeClass}`}
                              >
                                <span className={`w-2 h-2 rounded-full ${stage.dotClass}`} />
                                <span>{stage.label}</span>
                              </span>

                              <select
                                value={norm}
                                onChange={(e) =>
                                  handleQuickStatusChange(order, e.target.value as OrderStatus)
                                }
                                className="w-full text-xs font-semibold bg-slate-900 border border-slate-700 text-slate-200 rounded-lg px-2 py-1 cursor-pointer focus:border-[#00AEEF]"
                              >
                                {FOUNDER_STAGES.map((s) => (
                                  <option key={s.value} value={s.value}>
                                    {s.label}
                                  </option>
                                ))}
                              </select>

                              <div className="text-[11px] text-slate-400 flex items-center gap-1">
                                <Truck className="w-3 h-3 text-slate-400" />
                                <span>
                                  {order.driverName || 'Sipho M.'} ({order.driverVehicle || 'Proace Van'})
                                </span>
                              </div>
                            </div>
                          </td>

                          {/* Total & Invoice Status */}
                          <td className="py-3.5 px-4 text-right">
                            <p className="font-black text-white font-display text-base tabular-nums">
                              R{order.total}
                            </p>
                            <p className="text-[10px] text-slate-400">
                              {order.deliveryFee === 0 ? (
                                order.isFirstTimeCustomer ? '1st-Time Free Del' : 'Free Delivery'
                              ) : (
                                `+R${order.deliveryFee} Del`
                              )}
                            </p>
                            <div className="mt-1">
                              {order.invoiceIssued ? (
                                <span
                                  className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-300 bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-500/30"
                                  title={`Verified on digital scale by ${order.invoiceIssuedBy || 'Staff'} on ${order.invoiceIssuedAt || 'Pickup'}`}
                                >
                                  <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                                  <span>
                                    Invoiced {order.weighedWeightKg ? `(${order.weighedWeightKg}kg)` : ''}
                                  </span>
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-300 bg-amber-950/60 px-2 py-0.5 rounded-full border border-amber-500/30">
                                  <Scale className="w-3 h-3 text-amber-400" />
                                  <span>Pending Scale Weighing</span>
                                </span>
                              )}
                            </div>
                            <div className="mt-1.5 pt-1.5 border-t border-slate-700/40">
                              {renderPaymentStatusBadge(order)}
                            </div>
                          </td>

                          {/* Actions */}
                          <td className="py-3.5 px-4 text-center">
                            <div className="flex flex-col items-center gap-1">
                              {nextConfig && (
                                <button
                                  onClick={() => handleQuickStatusChange(order, nextConfig.value)}
                                  className="w-full px-2 py-1 rounded-lg bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-[11px] flex items-center justify-center gap-1 transition-all cursor-pointer"
                                  title={`Advance to ${nextConfig.label}`}
                                >
                                  <span>Next: {nextConfig.shortLabel}</span>
                                  <ChevronRight className="w-3.5 h-3.5" />
                                </button>
                              )}

                              <div className="flex items-center justify-center gap-1">
                                {order.paymentMethod === 'Cash on Delivery' && !order.cashReceivedRecord && order.paymentStatus !== 'paid' && (
                                  <button
                                    onClick={() => handleOpenCashRecordingModal(order)}
                                    title="Mark CASH RECEIVED ✓ (Record driver cash collection)"
                                    className="p-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 transition-colors cursor-pointer"
                                  >
                                    <Banknote className="w-4 h-4" />
                                  </button>
                                )}

                                <button
                                  onClick={() => handleOpenWeighingModal(order)}
                                  title="Weigh garments on digital scale & issue official tax invoice"
                                  className="p-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-400/30 transition-colors cursor-pointer"
                                >
                                  <Scale className="w-4 h-4" />
                                </button>

                                <a
                                  href={getWhatsAppStatusUrl(order)}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  title="Send status update to customer on WhatsApp"
                                  className="p-1.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-400/30 transition-colors cursor-pointer"
                                >
                                  <MessageCircle className="w-4 h-4" />
                                </a>

                                <button
                                  onClick={() => onViewInvoice(order)}
                                  title="View / Print Tax Invoice"
                                  className="p-1.5 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-200 transition-colors"
                                >
                                  <FileText className="w-4 h-4" />
                                </button>

                                <button
                                  onClick={() => setEditingOrder(order)}
                                  title="Edit Order Details"
                                  className="p-1.5 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-200 transition-colors"
                                >
                                  <Edit className="w-4 h-4" />
                                </button>

                                <button
                                  onClick={() => {
                                    if (
                                      window.confirm(
                                        `Are you sure you want to delete order #${order.id} for ${order.customerName}?`
                                      )
                                    ) {
                                      onDeleteOrder(order.id);
                                    }
                                  }}
                                  title="Delete Order"
                                  className="p-1.5 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/30 transition-colors"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {filteredOrders.length === 0 && (
                <div className="py-12 text-center text-slate-400">
                  <Package className="w-10 h-10 text-slate-600 mx-auto mb-2" />
                  <p className="font-semibold text-white">No orders match your filter criteria.</p>
                  <p className="text-xs text-slate-400 mt-1">Try clearing filters or search terms.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* VIEW 3: COMMAND PIPELINE (KANBAN COLUMNS ACROSS 10 STAGES) */}
        {/* ======================================================== */}
        {activeTab === 'pipeline' && (
          <div className="space-y-4 animate-fadeIn">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white font-display">
                  10-Stage Visual Kanban Board
                </h3>
                <p className="text-xs text-slate-400">
                  Track every order as it flows from initial online request to final paid completion
                </p>
              </div>
              <div className="text-xs text-slate-400">
                Total Orders: <strong className="text-white">{orders.length}</strong>
              </div>
            </div>

            {/* Kanban Columns Horizontal Scroller */}
            <div className="flex gap-4 overflow-x-auto pb-6 pt-2">
              {FOUNDER_STAGES.map((stg, colIdx) => {
                const colOrders = orders.filter(
                  (o) => normalizeStatus(o.status) === stg.value || o.status === stg.value
                );
                const nextStage = getNextStage(stg.value);
                const nextConfig = nextStage ? FOUNDER_STAGES.find((s) => s.value === nextStage) : null;

                return (
                  <div
                    key={stg.value}
                    className="w-72 shrink-0 bg-slate-800/90 border border-slate-700/80 rounded-2xl flex flex-col max-h-[75vh] shadow-lg"
                  >
                    {/* Column Header */}
                    <div className="p-3.5 border-b border-slate-700/80 bg-slate-900/60 rounded-t-2xl flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold text-slate-500">
                          #{colIdx + 1}
                        </span>
                        <span className={`w-2 h-2 rounded-full ${stg.dotClass}`} />
                        <h4 className="text-xs font-bold text-white truncate max-w-[140px]">
                          {stg.label}
                        </h4>
                      </div>
                      <span className="text-xs font-black font-display text-sky-400 bg-sky-950/60 px-2 py-0.5 rounded-full border border-sky-400/20">
                        {colOrders.length}
                      </span>
                    </div>

                    {/* Column Body Cards */}
                    <div className="p-3 space-y-3 overflow-y-auto flex-1 scrollbar-thin">
                      {colOrders.map((order) => (
                        <div
                          key={order.id}
                          className="bg-slate-900 border border-slate-700/90 hover:border-sky-500/60 p-3.5 rounded-xl shadow-sm space-y-2.5 transition-all"
                        >
                          <div className="flex items-start justify-between gap-1">
                            <div>
                              <span className="text-xs font-black text-white font-display">
                                #{order.id}
                              </span>
                              {order.memberNumber && (
                                <span className="ml-1.5 bg-amber-500/20 text-amber-300 text-[9px] font-bold px-1 rounded">
                                  MEMBER
                                </span>
                              )}
                              <p className="text-xs font-bold text-slate-200 mt-0.5">
                                {order.customerName}
                              </p>
                            </div>
                            <span className="text-xs font-extrabold text-white tabular-nums">
                              R{order.total}
                            </span>
                          </div>

                          <div className="text-[11px] text-slate-300">
                            <p className="text-sky-400 font-semibold">{order.suburb}</p>
                            <p className="text-slate-400 text-[10px]">Slot: {order.pickupTimeSlot}</p>
                          </div>

                          <div className="text-[11px] text-slate-400 border-t border-slate-800 pt-2 space-y-0.5">
                            {order.items.slice(0, 2).map((it, idx) => (
                              <p key={idx} className="truncate">
                                • {it.quantity} {it.unit} {it.serviceName}
                              </p>
                            ))}
                            {order.items.length > 2 && (
                              <p className="text-[10px] text-slate-500">
                                +{order.items.length - 2} more item(s)
                              </p>
                            )}
                          </div>

                          {/* Payment Badge & Cash Received Action */}
                          <div className="pt-2 border-t border-slate-800">
                            {renderPaymentStatusBadge(order, true)}
                          </div>

                          {/* Quick Advance Button inside card */}
                          {nextConfig && (
                            <button
                              onClick={() => handleQuickStatusChange(order, nextConfig.value)}
                              className="w-full mt-1 px-2.5 py-1.5 rounded-lg bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-1 transition-all shadow-sm cursor-pointer"
                            >
                              <span>Move to {nextConfig.shortLabel}</span>
                              <ChevronRight className="w-3.5 h-3.5" />
                            </button>
                          )}

                          {/* Card mini-actions */}
                          <div className="flex items-center justify-between pt-1 border-t border-slate-800/80">
                            <button
                              onClick={() => handleOpenWeighingModal(order)}
                              title="Weigh garments on digital scale & issue tax invoice"
                              className="text-[10px] font-semibold text-amber-300 hover:underline flex items-center gap-1"
                            >
                              <Scale className="w-3 h-3" />
                              <span>{order.invoiceIssued ? 'Weighed' : 'Weigh'}</span>
                            </button>

                            <div className="flex items-center gap-1">
                              <a
                                href={getWhatsAppStatusUrl(order)}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-emerald-400"
                                title="WhatsApp"
                              >
                                <MessageCircle className="w-3 h-3" />
                              </a>
                              <button
                                onClick={() => onViewInvoice(order)}
                                className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300"
                                title="Invoice"
                              >
                                <FileText className="w-3 h-3" />
                              </button>
                              <button
                                onClick={() => setEditingOrder(order)}
                                className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300"
                                title="Edit"
                              >
                                <Edit className="w-3 h-3" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}

                      {colOrders.length === 0 && (
                        <div className="py-8 text-center text-slate-500 text-xs">
                          No orders in this stage
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </main>

      {/* ======================================================== */}
      {/* MODAL: ADD NEW MEMBER SUBSCRIPTION                       */}
      {/* ======================================================== */}
      {isNewSubModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 text-slate-900 my-8">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div>
                <h3 className="font-bold font-display text-slate-900 text-lg">
                  Register New Member Profile
                </h3>
                <p className="text-xs text-slate-500">
                  Assign membership plan, unique member #, and monthly wash allowance
                </p>
              </div>
              <button
                onClick={() => setIsNewSubModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateNewSubscription} className="space-y-4 pt-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Membership Package *
                </label>
                <select
                  value={newSubTier}
                  onChange={(e) =>
                    setNewSubTier(e.target.value as 'essential' | 'comfort' | 'family')
                  }
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-sm font-bold bg-white"
                >
                  {MEMBERSHIP_PACKAGES.map((pkg) => (
                    <option key={pkg.id} value={pkg.id}>
                      {pkg.name} — R{pkg.monthlyFee}/month ({pkg.monthlyKgAllowance} kg allowance)
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Member Full Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Siphesihle Zondi"
                  value={newSubName}
                  onChange={(e) => setNewSubName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Phone / WhatsApp *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="082 123 4567"
                    value={newSubPhone}
                    onChange={(e) => setNewSubPhone(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    PMB Suburb *
                  </label>
                  <select
                    value={newSubSuburb}
                    onChange={(e) => setNewSubSuburb(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm bg-white"
                  >
                    {SUBURBS_COVERAGE.map((sub) => (
                      <option key={sub.name} value={sub.name}>
                        {sub.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Street Address (Pickup Location) *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 14 Ridge Road, Complex 4B"
                  value={newSubAddress}
                  onChange={(e) => setNewSubAddress(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Initial Monthly Payment Status
                </label>
                <select
                  value={newSubPaymentStatus}
                  onChange={(e) => setNewSubPaymentStatus(e.target.value as 'paid' | 'unpaid')}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold bg-white"
                >
                  <option value="paid">Paid (Speedpoint / Cash collected)</option>
                  <option value="unpaid">Unpaid (Awaiting doorstep payment on 1st delivery)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Founder Notes (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Prefers morning pickups, baby clothing hypoallergenic"
                  value={newSubNotes}
                  onChange={(e) => setNewSubNotes(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsNewSubModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs shadow-md cursor-pointer"
                >
                  Enroll &amp; Issue Member #
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL: EDIT MEMBER ALLOWANCE & SUBSCRIPTION               */}
      {/* ======================================================== */}
      {editingSub && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 text-slate-900 my-8">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div>
                <h3 className="font-bold font-display text-slate-900 text-lg">
                  Edit Member #{editingSub.membershipNumber}
                </h3>
                <p className="text-xs text-slate-500">{editingSub.customerName} · {editingSub.packageName}</p>
              </div>
              <button
                onClick={() => setEditingSub(null)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEditedSubscription} className="space-y-4 pt-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Used Kilograms (kg)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    value={editingSub.usedKg}
                    onChange={(e) => {
                      const newUsed = parseFloat(e.target.value) || 0;
                      const rem = Math.max(0, editingSub.totalKgAllowance - newUsed);
                      const overage = Math.max(0, newUsed - editingSub.totalKgAllowance);
                      const pkg = MEMBERSHIP_PACKAGES.find((p) => p.id === editingSub.tierId);
                      const rate = pkg?.memberOverAllowanceRate || 24;

                      setEditingSub({
                        ...editingSub,
                        usedKg: newUsed,
                        remainingKg: rem,
                        overageKgUsed: overage,
                        overageCharges: Math.round(overage * rate),
                      });
                    }}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm font-bold text-center"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Total Allowance (kg)
                  </label>
                  <input
                    type="number"
                    value={editingSub.totalKgAllowance}
                    onChange={(e) => {
                      const newTotal = parseFloat(e.target.value) || 0;
                      setEditingSub({
                        ...editingSub,
                        totalKgAllowance: newTotal,
                        remainingKg: Math.max(0, newTotal - editingSub.usedKg),
                      });
                    }}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm font-bold text-center"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Payment Status
                  </label>
                  <select
                    value={editingSub.paymentStatus}
                    onChange={(e) =>
                      setEditingSub({
                        ...editingSub,
                        paymentStatus: e.target.value as 'paid' | 'unpaid' | 'overdue',
                        status: e.target.value === 'paid' ? 'active' : editingSub.status,
                      })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold bg-white"
                  >
                    <option value="paid">Paid</option>
                    <option value="unpaid">Unpaid / Renewal Due</option>
                    <option value="overdue">Overdue</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Membership Status
                  </label>
                  <select
                    value={editingSub.status}
                    onChange={(e) =>
                      setEditingSub({
                        ...editingSub,
                        status: e.target.value as 'active' | 'payment_pending' | 'expired' | 'cancelled',
                      })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold bg-white"
                  >
                    <option value="active">Active</option>
                    <option value="payment_pending">Payment Pending</option>
                    <option value="expired">Expired</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Next Renewal Date
                </label>
                <input
                  type="date"
                  value={editingSub.renewalDate}
                  onChange={(e) => setEditingSub({ ...editingSub, renewalDate: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Notes / Special Instructions
                </label>
                <input
                  type="text"
                  value={editingSub.notes || ''}
                  onChange={(e) => setEditingSub({ ...editingSub, notes: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setEditingSub(null)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-[#00AEEF] hover:bg-sky-500 text-slate-950 font-bold text-xs cursor-pointer"
                >
                  Save Member Profile
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL 1: DIGITAL SCALE WEIGHING & OFFICIAL INVOICE       */}
      {/* ======================================================== */}
      {weighingOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl my-8 border border-slate-200 space-y-6 text-slate-900">
            <div className="flex items-center justify-between border-b border-slate-200 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-600 flex items-center justify-center">
                  <Scale className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold font-display text-slate-900">
                    Doorstep Weighing &amp; Official Tax Invoice Issuance
                  </h3>
                  <p className="text-xs text-slate-500">
                    Order #{weighingOrder.id} · Customer: <strong className="text-slate-800">{weighingOrder.customerName}</strong>
                  </p>
                </div>
              </div>
              <button
                onClick={() => setWeighingOrder(null)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleConfirmWeighingAndIssueInvoice} className="space-y-5">
              <div className="bg-sky-50 border border-sky-200 rounded-2xl p-4 text-xs text-sky-900 flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 text-[#00AEEF] shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold">Transparent Operating Procedure:</p>
                  <p className="mt-0.5 text-sky-800">
                    No automatic guesswork invoices. Our courier brings certified digital scales to the doorstep, weighs items with the customer, and our staff or founder confirms the weight before issuing the verified tax invoice.
                  </p>
                </div>
              </div>

              {/* Items Table */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                    Weighed Items &amp; Counts
                  </h4>
                  <select
                    className="px-2.5 py-1 text-xs border border-slate-300 rounded-lg bg-white text-slate-700 font-medium cursor-pointer"
                    defaultValue=""
                    onChange={(e) => {
                      if (e.target.value) {
                        handleAddServiceToWeighedItems(e.target.value);
                        e.target.value = '';
                      }
                    }}
                  >
                    <option value="" disabled>
                      + Add Additional Items
                    </option>
                    {SERVICES.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name} (R{s.pricePerUnit}/{s.unit})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                  {weighedItems.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                    >
                      <div>
                        <p className="font-semibold text-slate-900 text-xs">{item.serviceName}</p>
                        <p className="text-[11px] text-slate-500">Rate: R{item.unitPrice}/{item.unit}</p>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1.5">
                          <label className="text-[11px] font-bold text-slate-700">
                            {item.unit === 'kg' ? 'Digital Scale (kg):' : `Quantity (${item.unit}):`}
                          </label>
                          <input
                            type="number"
                            step={item.unit === 'kg' ? '0.1' : '1'}
                            min="0.1"
                            value={item.quantity}
                            onChange={(e) =>
                              handleUpdateWeighedItemQty(idx, parseFloat(e.target.value) || 0)
                            }
                            className="w-20 px-2 py-1.5 rounded-lg border border-slate-300 text-xs font-black text-center bg-white text-slate-900 focus:ring-2 focus:ring-[#00AEEF]"
                          />
                        </div>

                        <div className="w-20 text-right font-extrabold text-slate-900 text-xs tabular-nums">
                          R{item.total}
                        </div>

                        <button
                          type="button"
                          onClick={() => handleUpdateWeighedItemQty(idx, 0)}
                          className="p-1 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded transition-colors"
                          title="Remove item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Staff / Driver issuer details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-200">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Weighed &amp; Issued By (Staff / Courier)
                  </label>
                  <input
                    type="text"
                    value={scaleIssuer}
                    onChange={(e) => setScaleIssuer(e.target.value)}
                    placeholder="e.g. Sipho M. (Courier Mobile Unit)"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-medium"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Verification Note (Optional)
                  </label>
                  <input
                    type="text"
                    value={scaleNotes}
                    onChange={(e) => setScaleNotes(e.target.value)}
                    placeholder="e.g. Weighed on certified digital scale at doorstep"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                  />
                </div>
              </div>

              {/* Financial Calculation Summary */}
              {(() => {
                const subtotal = weighedItems.reduce((sum, item) => sum + item.total, 0);
                const deliveryFee = weighingOrder.isFirstTimeCustomer || subtotal >= 200 ? 0 : 40;
                const expressFee = weighingOrder.isExpress ? Math.round(subtotal * 0.3) : 0;
                const grandTotal = subtotal + deliveryFee + expressFee;
                const totalKg = weighedItems
                  .filter((i) => i.unit === 'kg')
                  .reduce((sum, i) => sum + i.quantity, 0);

                return (
                  <div className="bg-slate-900 text-white rounded-2xl p-4 space-y-2">
                    <div className="flex justify-between text-xs text-slate-300">
                      <span>Total Laundry Weighed:</span>
                      <strong className="text-white">{totalKg.toFixed(1)} kg</strong>
                    </div>
                    <div className="flex justify-between text-xs text-slate-300">
                      <span>Subtotal:</span>
                      <span>R{subtotal}</span>
                    </div>
                    {weighingOrder.isExpress && (
                      <div className="flex justify-between text-xs text-amber-300">
                        <span>Express Rush Surcharge (+30%):</span>
                        <span>+R{expressFee}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-xs text-slate-300">
                      <span>Pickup &amp; Delivery Fee:</span>
                      <span>
                        {deliveryFee === 0
                          ? weighingOrder.isFirstTimeCustomer
                            ? 'FREE (1st-Time Customer Special)'
                            : 'FREE (over R200)'
                          : `R${deliveryFee}`}
                      </span>
                    </div>
                    <div className="border-t border-slate-800 pt-2 flex justify-between items-baseline">
                      <span className="text-sm font-bold uppercase text-white">Official Tax Invoice Total:</span>
                      <span className="text-2xl font-black text-[#00AEEF] tabular-nums font-display">
                        R{grandTotal}
                      </span>
                    </div>
                  </div>
                );
              })()}

              {/* EFT Automated Invoice Notice */}
              {(weighingOrder.paymentMethod === 'EFT Bank Transfer' || weighingOrder.paymentMethod === 'EFT') && (
                <div className="bg-sky-50 border-2 border-sky-400 rounded-2xl p-4 text-xs space-y-2">
                  <div className="flex items-center justify-between border-b border-sky-200 pb-1.5">
                    <span className="font-black text-slate-900 uppercase">
                      Payment Method: EFT (FNB Gold Business Account)
                    </span>
                    <span className="bg-sky-200 text-sky-900 font-bold px-2 py-0.5 rounded text-[10px] uppercase font-mono">
                      Ref: #{weighingOrder.id}
                    </span>
                  </div>
                  <div className="p-2.5 bg-emerald-50 border border-emerald-300 rounded-xl flex items-start gap-2 text-emerald-950 font-bold text-xs">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>THE INVOICE SHALL AUTOMATICALLY BE SENT TO THEM ONCE WEIGHING IS COMPLETE!</span>
                  </div>
                  <div className="text-[11px] text-slate-700 font-mono bg-white p-2.5 rounded-xl border border-sky-200 grid grid-cols-2 gap-1.5">
                    <div>Bank: <strong>FNB</strong></div>
                    <div>Account Holder: <strong>Gio’s Laundromat</strong></div>
                    <div>Account Number: <strong className="text-sky-700">63111341466</strong></div>
                    <div>Reference: <strong>{weighingOrder.id}</strong></div>
                  </div>
                </div>
              )}

              {/* Cash On Delivery Notice */}
              {weighingOrder.paymentMethod === 'Cash on Delivery' && (
                <div className="bg-amber-50 border-2 border-amber-300 rounded-2xl p-4 text-xs space-y-1.5 text-amber-950">
                  <div className="flex items-center justify-between border-b border-amber-200 pb-1">
                    <span className="font-black text-amber-950 uppercase">Payment Method: CASH ON DELIVERY</span>
                    <span className="bg-amber-200 text-amber-900 font-bold px-2 py-0.5 rounded text-[10px] uppercase">Payment Status: OUTSTANDING</span>
                  </div>
                  <p className="text-slate-700 leading-relaxed text-[11px]">
                    The driver / authorized staff member collects the cash upon delivery. Then the admin marks: <strong>CASH RECEIVED ✓</strong>.
                  </p>
                </div>
              )}

              {/* Send WhatsApp checkbox */}
              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="wa-notify"
                  checked={sendWhatsAppOnIssue}
                  onChange={(e) => setSendWhatsAppOnIssue(e.target.checked)}
                  className="w-4 h-4 rounded text-[#00AEEF] focus:ring-[#00AEEF]"
                />
                <label htmlFor="wa-notify" className="text-xs text-slate-700 cursor-pointer select-none">
                  Open WhatsApp to automatically send invoice &amp; weight confirmation to customer (<strong className="text-slate-900">{weighingOrder.phone}</strong>)
                </label>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setWeighingOrder(null)}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={weighedItems.length === 0}
                  className="px-6 py-2.5 rounded-xl bg-[#00AEEF] hover:bg-sky-500 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-md shadow-sky-200 transition-colors disabled:opacity-50 cursor-pointer"
                >
                  <Scale className="w-4 h-4" />
                  <span>Confirm Weighing &amp; Issue Official Invoice</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL 2: EDIT ORDER DETAILS                               */}
      {/* ======================================================== */}
      {editingOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl my-8 border border-slate-200 space-y-6 text-slate-900">
            <div className="flex items-center justify-between border-b border-slate-200 pb-4">
              <div>
                <h3 className="text-xl font-bold font-display text-slate-900">
                  Edit Order #{editingOrder.id}
                </h3>
                <p className="text-xs text-slate-500">
                  Update customer details, driver assignments, weighed kg, and items.
                </p>
              </div>
              <button
                onClick={() => setEditingOrder(null)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEditedOrder} className="space-y-6 text-xs sm:text-sm">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Customer Name
                  </label>
                  <input
                    type="text"
                    value={editingOrder.customerName}
                    onChange={(e) =>
                      setEditingOrder({ ...editingOrder, customerName: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Phone / WhatsApp
                  </label>
                  <input
                    type="text"
                    value={editingOrder.phone}
                    onChange={(e) => setEditingOrder({ ...editingOrder, phone: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Current Lifecycle Stage (10 Stages)
                  </label>
                  <select
                    value={normalizeStatus(editingOrder.status)}
                    onChange={(e) => {
                      const newStat = e.target.value as OrderStatus;
                      handleQuickStatusChange(editingOrder, newStat);
                      setEditingOrder({ ...editingOrder, status: newStat });
                    }}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm bg-white font-semibold"
                  >
                    {FOUNDER_STAGES.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Pickup Time Slot
                  </label>
                  <select
                    value={editingOrder.pickupTimeSlot}
                    onChange={(e) =>
                      setEditingOrder({ ...editingOrder, pickupTimeSlot: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm bg-white"
                  >
                    <option value="Morning (09h00 – 12h00)">Morning (09h00 am – 12h00)</option>
                    <option value="Afternoon (14h00 – 17h00)">Afternoon (14h00 – 17h00)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Assigned Driver
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Sipho Madlala (Toyota Proace)"
                    value={editingOrder.driverName || ''}
                    onChange={(e) =>
                      setEditingOrder({ ...editingOrder, driverName: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    First-Time Customer
                  </label>
                  <div className="flex items-center gap-2 mt-2">
                    <input
                      type="checkbox"
                      id="edit-first-time"
                      checked={Boolean(editingOrder.isFirstTimeCustomer)}
                      onChange={(e) =>
                        setEditingOrder({ ...editingOrder, isFirstTimeCustomer: e.target.checked })
                      }
                      className="w-4 h-4 rounded text-[#00AEEF]"
                    />
                    <label htmlFor="edit-first-time" className="text-xs font-semibold text-slate-700">
                      Eligible for 100% Free Doorstep Pickup &amp; Delivery
                    </label>
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Physical Delivery Address
                  </label>
                  <input
                    type="text"
                    value={editingOrder.address}
                    onChange={(e) =>
                      setEditingOrder({ ...editingOrder, address: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm"
                  />
                </div>
              </div>

              {/* Items & Weighed KG adjustment */}
              <div className="space-y-3 pt-2 border-t border-slate-200">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-slate-900 uppercase text-xs tracking-wider">
                    Order Items (Adjust Weighed KGs or Pairs)
                  </h4>
                  <select
                    className="px-2 py-1 text-xs border border-slate-300 rounded-lg bg-white"
                    defaultValue=""
                    onChange={(e) => {
                      if (e.target.value) {
                        handleAddItemToEditing(e.target.value);
                        e.target.value = '';
                      }
                    }}
                  >
                    <option value="" disabled>
                      + Add Service Item
                    </option>
                    {SERVICES.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name} (R{s.pricePerUnit}/{s.unit})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  {editingOrder.items.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                    >
                      <span className="font-semibold text-slate-800 text-xs">
                        {item.serviceName}
                      </span>

                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1">
                          <label className="text-[11px] text-slate-500">Qty ({item.unit}):</label>
                          <input
                            type="number"
                            step="0.5"
                            min="0"
                            value={item.quantity}
                            onChange={(e) =>
                              handleUpdateItemInEditing(idx, parseFloat(e.target.value) || 0)
                            }
                            className="w-16 px-2 py-1 rounded border border-slate-300 text-xs font-bold text-center bg-white"
                          />
                        </div>

                        <div className="flex items-center gap-1">
                          <label className="text-[11px] text-slate-500">Unit Price:</label>
                          <input
                            type="number"
                            value={item.unitPrice}
                            onChange={(e) =>
                              handleUpdateItemInEditing(
                                idx,
                                item.quantity,
                                parseFloat(e.target.value) || 0
                              )
                            }
                            className="w-16 px-2 py-1 rounded border border-slate-300 text-xs font-bold text-center bg-white"
                          />
                        </div>

                        <span className="font-extrabold text-slate-900 text-xs w-16 text-right tabular-nums">
                          R{item.total}
                        </span>

                        <button
                          type="button"
                          onClick={() => handleUpdateItemInEditing(idx, 0)}
                          className="p-1 text-rose-500 hover:text-rose-700"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setEditingOrder(null)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-[#00AEEF] hover:bg-sky-500 text-slate-950 font-bold text-xs shadow-md shadow-sky-200"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL 3: CREATE MANUAL ORDER TICKET                       */}
      {/* ======================================================== */}
      {isNewOrderModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4 text-slate-900 my-8">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div>
                <h3 className="font-bold font-display text-slate-900 text-lg">
                  Create New Customer Booking
                </h3>
                <p className="text-xs text-slate-500">
                  Register manual phone or walk-in pickup for Pietermaritzburg
                </p>
              </div>
              <button
                onClick={() => setIsNewOrderModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateNewOrder} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Customer Full Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Nomvula Sithole"
                  value={newCustName}
                  onChange={(e) => setNewCustName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Phone / WhatsApp *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="082 123 4567"
                    value={newCustPhone}
                    onChange={(e) => setNewCustPhone(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    PMB Suburb
                  </label>
                  <select
                    value={newCustSuburb}
                    onChange={(e) => setNewCustSuburb(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm bg-white"
                  >
                    {SUBURBS_COVERAGE.map((sub) => (
                      <option key={sub.name} value={sub.name}>
                        {sub.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Street Address *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 24 West Street, Suite 4"
                  value={newCustAddress}
                  onChange={(e) => setNewCustAddress(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Primary Service
                  </label>
                  <select
                    value={newCustServiceId}
                    onChange={(e) => setNewCustServiceId(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm bg-white"
                  >
                    {SERVICES.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name} (R{s.pricePerUnit}/{s.unit})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Quantity (kg or pairs)
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={newCustQty}
                    onChange={(e) => setNewCustQty(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Pickup Time Slot
                </label>
                <select
                  value={newCustTimeSlot}
                  onChange={(e) => setNewCustTimeSlot(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm bg-white"
                >
                  <option value="Morning (09h00 – 12h00)">Morning (09h00 am – 12h00)</option>
                  <option value="Afternoon (14h00 – 17h00)">Afternoon (14h00 – 17h00)</option>
                </select>
                <p className="text-[11px] text-slate-500 mt-1">
                  Operating schedule: Mon – Sat (09h00–12h00 &amp; 14h00–17h00). Sunday: Deliveries only.
                </p>
              </div>

              <div className="flex items-center justify-between pt-1">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="new-first-time"
                    checked={newCustFirstTime}
                    onChange={(e) => setNewCustFirstTime(e.target.checked)}
                    className="w-4 h-4 rounded text-[#00AEEF]"
                  />
                  <label htmlFor="new-first-time" className="text-xs font-semibold text-emerald-700">
                    First-Time Customer (100% Free Pickup &amp; Delivery)
                  </label>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="new-express"
                    checked={newCustExpress}
                    onChange={(e) => setNewCustExpress(e.target.checked)}
                    className="w-4 h-4 rounded text-amber-600"
                  />
                  <label htmlFor="new-express" className="text-xs font-semibold text-slate-700">
                    Express Rush (+30%)
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Notes / Gate Code
                </label>
                <input
                  type="text"
                  placeholder="e.g. Boom gate code *2819*, call on arrival"
                  value={newCustNotes}
                  onChange={(e) => setNewCustNotes(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsNewOrderModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-[#00AEEF] hover:bg-sky-500 text-slate-950 font-bold text-xs shadow-md shadow-sky-200 cursor-pointer"
                >
                  Create Booking Ticket
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL 4: SHOE CONDITION PHOTOS INSPECTION                 */}
      {/* ======================================================== */}
      {photoViewerOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 space-y-4 text-slate-900">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div>
                <h3 className="font-bold font-display text-slate-900 text-base">
                  Shoe Condition Photos for #{photoViewerOrder.id}
                </h3>
                <p className="text-xs text-slate-500">Customer: {photoViewerOrder.customerName}</p>
              </div>
              <button
                onClick={() => setPhotoViewerOrder(null)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[60vh] overflow-y-auto p-2">
              {photoViewerOrder.shoePhotos?.map((p) => (
                <div
                  key={p.id}
                  className="bg-slate-50 rounded-2xl p-3 border border-slate-200 space-y-2"
                >
                  <img
                    src={p.dataUrl}
                    alt="Shoe inspection"
                    className="w-full h-48 object-cover rounded-xl"
                  />
                  <p className="text-xs font-semibold text-slate-800">{p.notes}</p>
                  <p className="text-[10px] text-slate-500">{p.fileName}</p>
                </div>
              ))}
            </div>

            <div className="text-right pt-2 border-t border-slate-100">
              <button
                onClick={() => setPhotoViewerOrder(null)}
                className="px-4 py-2 rounded-xl bg-slate-900 text-white font-semibold text-xs cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL 5: RECORD CASH RECEIVED ✓                          */}
      {/* ======================================================== */}
      {cashRecordingOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border-2 border-emerald-500 space-y-5 text-slate-900 my-8">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                  <Banknote className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold font-display text-slate-900 text-lg flex items-center gap-1.5">
                    <span>Mark: CASH RECEIVED ✓</span>
                  </h3>
                  <p className="text-xs text-slate-500">
                    Order #{cashRecordingOrder.id} · {cashRecordingOrder.customerName}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setCashRecordingOrder(null)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="bg-emerald-50 border border-emerald-300 rounded-2xl p-4 text-xs text-emerald-950 space-y-1">
              <p className="font-bold flex items-center gap-1.5 text-emerald-900">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Cash Collection Workflow:</span>
              </p>
              <p className="text-slate-700 leading-relaxed text-[11px]">
                The driver / authorized staff member collects the cash. Then the admin marks <strong>CASH RECEIVED ✓</strong>.
              </p>
              <p className="text-[11px] text-emerald-900 font-medium">
                The system automatically records: <strong>Amount received</strong>, <strong>Date</strong>, <strong>Time</strong>, <strong>Order #{cashRecordingOrder.id}</strong>, <strong>Customer {cashRecordingOrder.customerName}</strong>, and <strong>Person who confirmed payment</strong>.
              </p>
            </div>

            <form onSubmit={handleConfirmCashReceived} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Order
                  </label>
                  <input
                    type="text"
                    disabled
                    value={`#${cashRecordingOrder.id}`}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold bg-slate-100 text-slate-600 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Customer
                  </label>
                  <input
                    type="text"
                    disabled
                    value={cashRecordingOrder.customerName}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold bg-slate-100 text-slate-700"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Amount Received (ZAR) *
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-black text-slate-400">R</span>
                  <input
                    type="number"
                    step="1"
                    min="1"
                    required
                    value={cashReceivedAmount}
                    onChange={(e) => setCashReceivedAmount(parseFloat(e.target.value) || 0)}
                    className="w-full pl-8 pr-4 py-2.5 rounded-xl border-2 border-emerald-500 text-lg font-black text-emerald-900 bg-emerald-50/40 focus:ring-2 focus:ring-emerald-400 focus:outline-none tabular-nums"
                  />
                </div>
                <p className="text-[11px] text-slate-500 mt-1">
                  Expected order total: R{cashRecordingOrder.total}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Date *
                  </label>
                  <input
                    type="text"
                    required
                    value={cashReceivedDate}
                    onChange={(e) => setCashReceivedDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Time *
                  </label>
                  <input
                    type="text"
                    required
                    value={cashReceivedTime}
                    onChange={(e) => setCashReceivedTime(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Person Who Confirmed Payment *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Founder / Admin (Gio) or Sipho M. (Courier)"
                  value={cashConfirmedBy}
                  onChange={(e) => setCashConfirmedBy(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-900"
                />
                <div className="flex flex-wrap gap-1.5 mt-2">
                  <span className="text-[10px] text-slate-500 self-center mr-1">Quick Select:</span>
                  {[
                    'Founder / Admin (Gio)',
                    cashRecordingOrder.driverName ? `${cashRecordingOrder.driverName} (Driver)` : 'Sipho M. (Courier)',
                    'Thabo N. (Hub Staff)',
                    'Authorized Cashier',
                  ].map((staff) => (
                    <button
                      key={staff}
                      type="button"
                      onClick={() => setCashConfirmedBy(staff)}
                      className={`text-[10px] px-2 py-0.5 rounded-full border transition-colors cursor-pointer ${
                        cashConfirmedBy === staff
                          ? 'bg-emerald-600 text-white border-emerald-600 font-bold'
                          : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200'
                      }`}
                    >
                      {staff}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Voucher / Receipt #
                  </label>
                  <input
                    type="text"
                    value={cashReceiptNumber}
                    onChange={(e) => setCashReceiptNumber(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Advance to Completed
                  </label>
                  <div className="flex items-center gap-2 mt-2">
                    <input
                      type="checkbox"
                      id="cash-advance-completed"
                      checked={cashAutoAdvanceCompleted}
                      onChange={(e) => setCashAutoAdvanceCompleted(e.target.checked)}
                      className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500"
                    />
                    <label htmlFor="cash-advance-completed" className="text-xs font-bold text-emerald-900 cursor-pointer">
                      Mark Completed
                    </label>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Cash Handover Notes (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Exact cash collected by driver and handed to hub"
                  value={cashNotes}
                  onChange={(e) => setCashNotes(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setCashRecordingOrder(null)}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs flex items-center gap-2 shadow-lg shadow-emerald-600/30 transition-all cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>CASH RECEIVED ✓</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL 6: CASH AUDIT RECEIPT VOUCHER                      */}
      {/* ======================================================== */}
      {cashReceiptViewOrder && cashReceiptViewOrder.cashReceivedRecord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border-2 border-emerald-500 space-y-5 text-slate-900 my-8">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
                  <Receipt className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-black font-display text-slate-900 text-lg uppercase tracking-wide">
                    Official Cash Receipt Voucher
                  </h3>
                  <p className="text-xs text-slate-500">
                    Receipt #{cashReceiptViewOrder.cashReceivedRecord.receiptNumber || `CR-${cashReceiptViewOrder.id}`}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setCashReceiptViewOrder(null)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="bg-emerald-50 border-2 border-emerald-400 rounded-2xl p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-emerald-200 pb-2">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  <span className="font-black text-emerald-950 uppercase tracking-wider text-sm">
                    CASH RECEIVED ✓
                  </span>
                </div>
                <span className="text-xs font-black text-emerald-800 bg-white px-2.5 py-1 rounded-full border border-emerald-300 font-mono">
                  #{cashReceiptViewOrder.cashReceivedRecord.receiptNumber || `CR-${cashReceiptViewOrder.id}`}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="bg-white p-3 rounded-xl border border-emerald-200">
                  <span className="text-[10px] text-emerald-700 uppercase font-bold block">Amount Received</span>
                  <strong className="text-lg font-black text-emerald-900 tabular-nums">
                    R{cashReceiptViewOrder.cashReceivedRecord.amountReceived}
                  </strong>
                </div>
                <div className="bg-white p-3 rounded-xl border border-emerald-200">
                  <span className="text-[10px] text-emerald-700 uppercase font-bold block">Payment Method</span>
                  <strong className="text-sm font-bold text-slate-900">
                    CASH ON DELIVERY
                  </strong>
                </div>
                <div className="bg-white p-3 rounded-xl border border-emerald-200">
                  <span className="text-[10px] text-emerald-700 uppercase font-bold block">Date</span>
                  <strong className="text-sm font-bold text-slate-900">
                    {cashReceiptViewOrder.cashReceivedRecord.date}
                  </strong>
                </div>
                <div className="bg-white p-3 rounded-xl border border-emerald-200">
                  <span className="text-[10px] text-emerald-700 uppercase font-bold block">Time</span>
                  <strong className="text-sm font-bold text-slate-900 font-mono">
                    {cashReceiptViewOrder.cashReceivedRecord.time}
                  </strong>
                </div>
                <div className="bg-white p-3 rounded-xl border border-emerald-200">
                  <span className="text-[10px] text-emerald-700 uppercase font-bold block">Order</span>
                  <strong className="text-sm font-bold text-slate-900 font-mono">
                    #{cashReceiptViewOrder.cashReceivedRecord.orderId}
                  </strong>
                </div>
                <div className="bg-white p-3 rounded-xl border border-emerald-200">
                  <span className="text-[10px] text-emerald-700 uppercase font-bold block">Customer</span>
                  <strong className="text-sm font-bold text-slate-900">
                    {cashReceiptViewOrder.cashReceivedRecord.customerName}
                  </strong>
                </div>
                <div className="col-span-2 bg-white p-3 rounded-xl border border-emerald-200">
                  <span className="text-[10px] text-emerald-700 uppercase font-bold block">Person Who Confirmed Payment</span>
                  <strong className="text-sm font-extrabold text-emerald-950">
                    {cashReceiptViewOrder.cashReceivedRecord.confirmedBy}
                  </strong>
                  {cashReceiptViewOrder.cashReceivedRecord.notes && (
                    <p className="text-[11px] text-slate-600 mt-1 italic">
                      Note: {cashReceiptViewOrder.cashReceivedRecord.notes}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-200">
              <button
                type="button"
                onClick={() => handleRevokeCashReceived(cashReceiptViewOrder)}
                className="text-xs font-bold text-rose-600 hover:text-rose-800 hover:underline cursor-pointer"
              >
                Revoke Cash Receipt
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => onViewInvoice(cashReceiptViewOrder)}
                  className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>View Tax Invoice</span>
                </button>
                <button
                  type="button"
                  onClick={() => setCashReceiptViewOrder(null)}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs cursor-pointer"
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
