export interface ServiceItem {
  id: string;
  name: string;
  category: 'laundry' | 'shoe_spa' | 'home_fabrics' | 'dry_cleaning';
  shortDesc: string;
  unit: string;
  pricePerUnit: number;
  minUnit?: number;
  popular?: boolean;
  features: string[];
  iconName: string;
}

export type OrderStatus =
  | 'new_request'
  | 'verification_pending'
  | 'verified'
  | 'pickup_scheduled'
  | 'collected'
  | 'processing'
  | 'ready'
  | 'delivered'
  | 'payment_outstanding'
  | 'completed'
  | 'confirmed'
  | 'picked_up'
  | 'in_cleaning'
  | 'quality_checked'
  | 'out_for_delivery';

export interface OrderTimelineStep {
  status: OrderStatus;
  label: string;
  description: string;
  timestamp?: string;
  completed: boolean;
  current: boolean;
}

export interface ShoePhotoUpload {
  id: string;
  dataUrl: string;
  fileName: string;
  notes: string;
}

export interface OrderItem {
  serviceId: string;
  serviceName: string;
  quantity: number;
  unitPrice: number;
  unit: string;
  total: number;
}

export type PaymentMethodOption =
  | 'Cash on Delivery'
  | 'EFT Bank Transfer'
  | 'Speedpoint Card Machine on Delivery';

export type PaymentStatus = 'outstanding' | 'paid' | 'verified';

export interface PaymentAuditRecord {
  amountReceived: number;
  date: string;
  time: string;
  orderId: string;
  customerName: string;
  confirmedBy: string;
  paymentMethod: string;
  notes?: string;
  receiptNumber?: string;
}

export interface LaundryOrder {
  id: string;
  customerName: string;
  phone: string;
  email?: string;
  address: string;
  suburb: string;
  city: 'Pietermaritzburg';
  pickupDate: string;
  pickupTimeSlot: string;
  specialInstructions?: string;
  status: OrderStatus;
  createdAt: string;
  estimatedDelivery: string;
  items: OrderItem[];
  subtotal: number;
  deliveryFee: number;
  isExpress: boolean;
  expressFee: number;
  total: number;
  paymentMethod: PaymentMethodOption | string;
  paymentStatus?: PaymentStatus;
  cashReceivedRecord?: PaymentAuditRecord;
  eftDetailsSent?: boolean;
  eftDetailsSentAt?: string;
  shoePhotos?: ShoePhotoUpload[];
  driverName?: string;
  driverVehicle?: string;
  timeline: OrderTimelineStep[];
  weighedWeightKg?: number;
  isWeighed?: boolean;
  invoiceIssued?: boolean;
  invoiceIssuedAt?: string;
  invoiceIssuedBy?: string;
  isFirstTimeCustomer?: boolean;
  memberNumber?: string;
  membershipTier?: 'essential' | 'comfort' | 'family';
  isMemberBooking?: boolean;
  memberKgCovered?: number;
  memberOverageKg?: number;
  memberOverageFee?: number;
}

export type MembershipTier = 'essential' | 'comfort' | 'family';

export interface MembershipPackage {
  id: MembershipTier;
  name: string;
  subtitle: string;
  targetAudience: string;
  monthlyFee: number;
  monthlyKgAllowance: number;
  maxBookingsPerMonth: number | null;
  priorityScheduling: boolean;
  memberOverAllowanceRate: number;
  features: string[];
  terms: string[];
  popular?: boolean;
}

export type SubscriptionStatus = 'active' | 'payment_pending' | 'expired' | 'cancelled';
export type SubscriptionPaymentStatus = 'paid' | 'unpaid' | 'overdue';

export interface MemberSubscription {
  membershipNumber: string; // e.g. GIO04081
  customerName: string;
  phone: string;
  email: string;
  address: string;
  suburb: string;
  tierId: MembershipTier;
  packageName: string;
  monthlyFee: number;
  totalKgAllowance: number;
  usedKg: number;
  remainingKg: number;
  maxBookingsPerMonth: number | null;
  usedBookingsCount: number;
  status: SubscriptionStatus;
  paymentStatus: SubscriptionPaymentStatus;
  billingCycleStartDate: string;
  renewalDate: string;
  lastPaymentDate?: string;
  paymentMethod?: string;
  notes?: string;
  overageKgUsed: number;
  overageCharges: number;
}

export interface SuburbCoverage {
  name: string;
  city: 'Pietermaritzburg';
  postalCode: string;
  pickupDays: string;
  turnaroundHours: string;
  freePickupEligible: boolean;
}
