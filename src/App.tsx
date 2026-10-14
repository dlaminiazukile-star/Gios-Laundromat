import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { HowItWorks } from './components/HowItWorks';
import { PricingBoard } from './components/PricingBoard';
import { ServicesSection } from './components/ServicesSection';
import { PriceCalculator } from './components/PriceCalculator';
import { ShoeSpaGallery } from './components/ShoeSpaGallery';
import { WhyUs } from './components/WhyUs';
import { BookingForm } from './components/BookingForm';
import { TrackingDashboard } from './components/TrackingDashboard';
import { CoverageChecker } from './components/CoverageChecker';
import { Testimonials } from './components/Testimonials';
import { FAQSection } from './components/FAQSection';
import { FloatingWhatsApp } from './components/FloatingWhatsApp';
import { Footer } from './components/Footer';
import { InvoiceModal } from './components/InvoiceModal';
import { AdminPortal } from './components/AdminPortal';
import { StaffAuthModal } from './components/StaffAuthModal';
import { MembershipSection } from './components/MembershipSection';
import { INITIAL_DEMO_ORDERS, INITIAL_DEMO_SUBSCRIPTIONS, SERVICES } from './data/servicesData';
import { LaundryOrder, OrderItem, MemberSubscription } from './types';

export default function App() {
  // Orders list initialized from localStorage if available, or pre-seeded demo orders
  const [orders, setOrders] = useState<LaundryOrder[]>(() => {
    try {
      const saved = localStorage.getItem('fresh_fly_orders');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // Fallback
    }
    return INITIAL_DEMO_ORDERS;
  });

  // Subscriptions list initialized from localStorage if available, or pre-seeded demo members
  const [subscriptions, setSubscriptions] = useState<MemberSubscription[]>(() => {
    try {
      const saved = localStorage.getItem('gio_subscriptions');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // Fallback
    }
    return INITIAL_DEMO_SUBSCRIPTIONS;
  });

  const [selectedOrderId, setSelectedOrderId] = useState<string>('FF-8429');
  const [activeInvoiceOrder, setActiveInvoiceOrder] = useState<LaundryOrder | null>(null);
  const [isAdminViewOpen, setIsAdminViewOpen] = useState<boolean>(false);
  const [isStaffAuthModalOpen, setIsStaffAuthModalOpen] = useState<boolean>(false);

  // Preselected items passed from calculator or service card to booking form
  const [bookingPrefillItems, setBookingPrefillItems] = useState<OrderItem[]>([]);
  const [bookingPrefillExpress, setBookingPrefillExpress] = useState<boolean>(false);
  const [bookingMemberNumber, setBookingMemberNumber] = useState<string>('');

  // Staff and Admin Alternative Access Handlers
  const handleOpenStaffAccess = () => {
    const isAuth = sessionStorage.getItem('gio_staff_authenticated') === 'true';
    if (isAuth) {
      setIsAdminViewOpen(true);
    } else {
      setIsStaffAuthModalOpen(true);
    }
  };

  const handleStaffAuthSuccess = () => {
    setIsStaffAuthModalOpen(false);
    setIsAdminViewOpen(true);
  };

  const handleStaffLogout = () => {
    sessionStorage.removeItem('gio_staff_authenticated');
    setIsAdminViewOpen(false);
    if (window.location.hash === '#admin' || window.location.hash === '#staff') {
      window.history.replaceState(null, '', window.location.pathname);
    }
  };

  // Listen for direct URL routes (#admin, #staff, ?admin) and keyboard shortcut (Ctrl+Shift+A)
  useEffect(() => {
    const checkStaffRoute = () => {
      const hash = window.location.hash.toLowerCase();
      const params = new URLSearchParams(window.location.search);
      if (hash === '#admin' || hash === '#staff' || params.has('admin') || params.has('staff')) {
        handleOpenStaffAccess();
      }
    };

    checkStaffRoute();
    window.addEventListener('hashchange', checkStaffRoute);

    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'A' || e.key === 'a')) {
        e.preventDefault();
        handleOpenStaffAccess();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('hashchange', checkStaffRoute);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // Sync orders to localStorage whenever updated
  useEffect(() => {
    try {
      localStorage.setItem('fresh_fly_orders', JSON.stringify(orders));
    } catch {
      // ignore
    }
  }, [orders]);

  // Sync subscriptions to localStorage whenever updated
  useEffect(() => {
    try {
      localStorage.setItem('gio_subscriptions', JSON.stringify(subscriptions));
    } catch {
      // ignore
    }
  }, [subscriptions]);

  const scrollToBooking = () => {
    const el = document.getElementById('booking-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToTracking = () => {
    const el = document.getElementById('tracking');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToCalculator = () => {
    const el = document.getElementById('calculator');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleCalculatorLoad = (items: OrderItem[], isExpress: boolean) => {
    setBookingPrefillItems(items);
    setBookingPrefillExpress(isExpress);
    scrollToBooking();
  };

  const handleSelectServiceForCalculator = (_serviceId: string) => {
    scrollToCalculator();
  };

  const handleOpenBookingWithService = (serviceId: string) => {
    const s = SERVICES.find((item) => item.id === serviceId);
    if (s) {
      const initialQty = s.category === 'laundry' ? 5 : 1;
      setBookingPrefillItems([
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
    scrollToBooking();
  };

  const handleOrderCreated = (newOrder: LaundryOrder) => {
    setOrders((prev) => [newOrder, ...prev]);
    setSelectedOrderId(newOrder.id);
  };

  const handleUpdateOrder = (updatedOrder: LaundryOrder) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === updatedOrder.id ? updatedOrder : o))
    );
    if (selectedOrderId === updatedOrder.id) {
      setSelectedOrderId(updatedOrder.id);
    }
  };

  const handleDeleteOrder = (orderId: string) => {
    setOrders((prev) => prev.filter((o) => o.id !== orderId));
  };

  const handleAddOrder = (newOrder: LaundryOrder) => {
    setOrders((prev) => [newOrder, ...prev]);
    setSelectedOrderId(newOrder.id);
  };

  const handleViewInvoice = (order: LaundryOrder) => {
    setActiveInvoiceOrder(order);
  };

  const handleTrackOrder = (orderId: string) => {
    setSelectedOrderId(orderId);
    scrollToTracking();
  };

  // Subscription management handlers
  const handleUpdateSubscription = (updatedSub: MemberSubscription) => {
    setSubscriptions((prev) =>
      prev.map((s) => (s.membershipNumber === updatedSub.membershipNumber ? updatedSub : s))
    );
  };

  const handleAddSubscription = (newSub: MemberSubscription) => {
    setSubscriptions((prev) => [newSub, ...prev]);
  };

  const handleDeleteSubscription = (memberNumber: string) => {
    setSubscriptions((prev) => prev.filter((s) => s.membershipNumber !== memberNumber));
  };

  const handleDeductMemberAllowance = (
    memberNumber: string,
    coveredKg: number,
    overageKg: number,
    overageFee: number
  ) => {
    setSubscriptions((prev) =>
      prev.map((sub) => {
        if (sub.membershipNumber.toUpperCase() === memberNumber.toUpperCase()) {
          const newUsedKg = sub.usedKg + coveredKg + overageKg;
          const newRemainingKg = Math.max(0, sub.remainingKg - coveredKg);
          const newOverageKgUsed = (sub.overageKgUsed || 0) + overageKg;
          const newOverageCharges = (sub.overageCharges || 0) + overageFee;
          const newUsedBookingsCount = sub.usedBookingsCount + 1;
          return {
            ...sub,
            usedKg: Number(newUsedKg.toFixed(1)),
            remainingKg: Number(newRemainingKg.toFixed(1)),
            overageKgUsed: Number(newOverageKgUsed.toFixed(1)),
            overageCharges: newOverageCharges,
            usedBookingsCount: newUsedBookingsCount,
          };
        }
        return sub;
      })
    );
  };

  // If in Admin Mode, show full operations dashboard
  if (isAdminViewOpen) {
    return (
      <div className="min-h-screen bg-slate-100 selection:bg-sky-200 selection:text-sky-900">
        <AdminPortal
          orders={orders}
          subscriptions={subscriptions}
          onUpdateOrder={handleUpdateOrder}
          onDeleteOrder={handleDeleteOrder}
          onAddOrder={handleAddOrder}
          onViewInvoice={handleViewInvoice}
          onCloseAdmin={() => setIsAdminViewOpen(false)}
          onLogoutAdmin={handleStaffLogout}
          onUpdateSubscription={handleUpdateSubscription}
          onAddSubscription={handleAddSubscription}
          onDeleteSubscription={handleDeleteSubscription}
        />

        {/* View Printable Invoice Modal */}
        <InvoiceModal
          order={activeInvoiceOrder}
          onClose={() => setActiveInvoiceOrder(null)}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 selection:bg-sky-200 selection:text-sky-900">
      {/* Navigation (Customer clean navigation, no public admin button) */}
      <Navbar
        onOpenBooking={scrollToBooking}
        onOpenTracking={scrollToTracking}
        onSecretStaffTrigger={handleOpenStaffAccess}
      />

      {/* Main Content */}
      <main className="flex-grow">
        {/* 1. Hero Section */}
        <Hero
          onOpenBooking={scrollToBooking}
          onOpenCalculator={scrollToCalculator}
        />

        {/* 2. How It Works (3 Steps) */}
        <HowItWorks onOpenBooking={scrollToBooking} />

        {/* 3. Official Rate Card & Transparent Rates (from flyer/image) */}
        <PricingBoard
          onSelectService={handleOpenBookingWithService}
          onOpenBooking={scrollToBooking}
        />

        {/* 4. Core Services & Rates */}
        <ServicesSection
          onSelectServiceForCalculator={handleSelectServiceForCalculator}
          onOpenBookingWithService={handleOpenBookingWithService}
        />

        {/* 5. GIO'S LAUNDROMAT: Clean Without Limit Membership Packages */}
        <MembershipSection
          subscriptions={subscriptions}
          onAddSubscription={handleAddSubscription}
          onOpenBookingWithMember={(memberNum) => {
            setBookingMemberNumber(memberNum);
            scrollToBooking();
          }}
        />

        {/* 6. Interactive Price Calculator */}
        <PriceCalculator
          onLoadIntoBooking={handleCalculatorLoad}
        />

        {/* 7. Shoe Spa Before/After Interactive Restoration Gallery */}
        <ShoeSpaGallery onBookShoeSpa={scrollToBooking} />

        {/* 8. Why Us / Trust Proposition */}
        <WhyUs />

        {/* 9. Online Booking Form with Shoe Photo Upload, Member Allowance, & WhatsApp Link */}
        <BookingForm
          key={`${bookingPrefillItems.length}-${bookingPrefillExpress}-${bookingMemberNumber}`}
          initialItems={bookingPrefillItems}
          initialExpress={bookingPrefillExpress}
          subscriptions={subscriptions}
          initialMemberNumber={bookingMemberNumber}
          onOrderCreated={handleOrderCreated}
          onTrackOrder={handleTrackOrder}
          onDeductMemberAllowance={handleDeductMemberAllowance}
        />

        {/* 8. User Dashboard to Track Order Status in Real Time */}
        <TrackingDashboard
          orders={orders}
          selectedOrderId={selectedOrderId}
          onSelectOrder={(id) => setSelectedOrderId(id)}
          onViewInvoice={handleViewInvoice}
        />

        {/* 9. Suburb Coverage Checker (Pietermaritzburg) */}
        <CoverageChecker />

        {/* 10. Verified 5-Star Testimonials */}
        <Testimonials />

        {/* 11. Frequently Asked Questions */}
        <FAQSection />
      </main>

      {/* Footer (No public admin button, discreet lock only) */}
      <Footer
        onOpenBooking={scrollToBooking}
        onOpenTracking={scrollToTracking}
        onSecretStaffTrigger={handleOpenStaffAccess}
      />

      {/* Floating WhatsApp Action Button */}
      <FloatingWhatsApp />

      {/* Staff & Admin Access Passcode Gate Modal */}
      <StaffAuthModal
        isOpen={isStaffAuthModalOpen}
        onClose={() => setIsStaffAuthModalOpen(false)}
        onSuccess={handleStaffAuthSuccess}
      />

      {/* View Printable Invoice Modal */}
      <InvoiceModal
        order={activeInvoiceOrder}
        onClose={() => setActiveInvoiceOrder(null)}
      />
    </div>
  );
}
