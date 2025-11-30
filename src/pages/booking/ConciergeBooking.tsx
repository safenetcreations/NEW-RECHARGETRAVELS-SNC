import { useEffect, useMemo, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useToast } from '@/hooks/use-toast';
import { dbService } from '@/lib/firebase-services';
import { paymentGateway } from '@/services/paymentGateway';
import emailService from '@/services/emailService';
import './ConciergeBooking.css';

type PaymentMethod = 'card' | 'paypal' | 'bank';

const BOOKING_CONFIG = {
  hero: {
    title: 'Concierge Booking',
    subtitle: 'Hand-crafted Sri Lanka journeys • Secure checkout',
    image: 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1600&q=80'
  },
  pricing: {
    currency: 'USD',
    symbol: '$',
    adult: 220,
    child: 120
  },
  pickupOptions: [
    { id: 'colombo', label: 'Pickup from Colombo', time: '04:30 AM', additionalCost: 0 },
    { id: 'negombo', label: 'Pickup from Negombo / Airport', time: '04:00 AM', additionalCost: 10 },
    { id: 'jaffna', label: 'Pickup from Jaffna Hotels', time: '07:30 AM', additionalCost: -40 }
  ],
  highlights: [
    'Private charter transfers & bilingual host',
    'Priority access to temples & islands',
    'Chef-crafted slow food experiences',
    'WhatsApp concierge + SendGrid confirmations'
  ]
};

const steps = [
  { id: 1, label: 'Contact Details' },
  { id: 2, label: 'Activity Details' },
  { id: 3, label: 'Payment' }
];

const buildDateList = () => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const list: string[] = [];
  for (let i = 1; i <= 90; i += 1) {
    const date = new Date(today);
    date.setDate(date.getDate() + i);
    list.push(date.toISOString().split('T')[0]);
  }
  return list;
};

const ConciergeBooking = () => {
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [tourDates, setTourDates] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmation, setConfirmation] = useState<{
    reference: string;
    total: string;
    date: string;
    travellers: string;
    paymentMethod: PaymentMethod;
    paymentUrl?: string;
  } | null>(null);

  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    countryCode: '+94',
    phone: '',
    tourDate: '',
    pickupOption: BOOKING_CONFIG.pickupOptions[0].id,
    pickupAddress: '',
    adults: 2,
    children: 0,
    infants: 0,
    specialRequests: '',
    paymentMethod: 'card' as PaymentMethod,
    cardNumber: '',
    cardExpiry: '',
    cardCvc: '',
    cardName: '',
    agreeTerms: false
  });

  useEffect(() => {
    setTourDates(buildDateList());
    document.body.classList.add('booking-page-active');
    return () => {
      document.body.classList.remove('booking-page-active');
    };
  }, []);

  const pickupOption = useMemo(
    () => BOOKING_CONFIG.pickupOptions.find((opt) => opt.id === form.pickupOption),
    [form.pickupOption]
  );

  const travellerSummary = useMemo(() => {
    let summary = `${form.adults} Adult${form.adults === 1 ? '' : 's'}`;
    if (form.children > 0) summary += `, ${form.children} Child${form.children === 1 ? '' : 'ren'}`;
    if (form.infants > 0) summary += `, ${form.infants} Infant${form.infants === 1 ? '' : 's'}`;
    return summary;
  }, [form.adults, form.children, form.infants]);

  const pricing = useMemo(() => {
    const subtotal =
      form.adults * BOOKING_CONFIG.pricing.adult + form.children * BOOKING_CONFIG.pricing.child;
    const pickupCost =
      (pickupOption?.additionalCost || 0) * (form.adults + form.children + form.infants);
    return {
      subtotal,
      pickupCost,
      total: subtotal + pickupCost
    };
  }, [form.adults, form.children, form.infants, pickupOption]);

  const updateForm = (field: keyof typeof form, value: any) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const updateCount = (field: 'adults' | 'children' | 'infants', delta: number) => {
    setForm((prev) => ({
      ...prev,
      [field]: Math.max(field === 'adults' ? 1 : 0, prev[field] + delta)
    }));
  };

  const validateStep = (step: number) => {
    if (step === 1) {
      return form.firstName && form.lastName && form.email && form.phone;
    }
    if (step === 2) {
      return form.tourDate && form.pickupOption && form.pickupAddress;
    }
    if (step === 3) {
      if (!form.agreeTerms) return false;
      if (form.paymentMethod === 'card') {
        return form.cardNumber && form.cardName && form.cardExpiry && form.cardCvc;
      }
      return true;
    }
    return true;
  };

  const goToNextStep = () => {
    if (!validateStep(currentStep)) {
      toast({
        title: 'Incomplete information',
        description: 'Please fill in the required fields before continuing.',
        variant: 'destructive'
      });
      return;
    }
    setCurrentStep((prev) => Math.min(prev + 1, steps.length));
  };

  const goToPreviousStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const submitBooking = async () => {
    if (!validateStep(3)) {
      toast({
        title: 'Payment details missing',
        description: 'Please review your payment information.',
        variant: 'destructive'
      });
      return;
    }

    setIsSubmitting(true);
    const bookingRef = `RT-${Date.now().toString(36).toUpperCase()}`;
    try {
      await dbService.create('global_bookings', {
        bookingRef,
        ...form,
        pricing,
        pickupLabel: pickupOption?.label,
        created_via: 'concierge_form'
      });

      await emailService.sendBookingConfirmation(form.email, {
        customerName: `${form.firstName} ${form.lastName}`,
        confirmationNumber: bookingRef,
        bookingType: 'Concierge Experience',
        travelDate: form.tourDate,
        adults: form.adults,
        children: form.children,
        totalAmount: pricing.total,
        currency: BOOKING_CONFIG.pricing.currency,
        specialRequests: form.specialRequests
      });

      let paymentUrl: string | undefined;
      const paymentPayload = {
        amount: pricing.total,
        currency: BOOKING_CONFIG.pricing.currency,
        orderId: bookingRef,
        returnUrl: window.location.href,
        cancelUrl: window.location.href,
        notifyUrl: window.location.href,
        customerName: `${form.firstName} ${form.lastName}`,
        customerEmail: form.email,
        customerPhone: `${form.countryCode} ${form.phone}`,
        items: `${form.adults} Adults, ${form.children} Children`
      };

      if (form.paymentMethod === 'card') {
        const resp = await paymentGateway.initiateStripePayment(paymentPayload);
        if (resp.success && resp.paymentUrl) {
          paymentUrl = resp.paymentUrl;
        }
      } else if (form.paymentMethod === 'paypal') {
        const resp = await paymentGateway.initiatePayPalPayment(paymentPayload);
        if (resp.success && resp.paymentUrl) {
          paymentUrl = resp.paymentUrl;
        }
      } else {
        const resp = await paymentGateway.initiateBankTransfer('BOC', pricing.total, bookingRef);
        if (!resp.success) {
          throw new Error(resp.error || 'Failed to initiate bank transfer');
        }
      }

      setConfirmation({
        reference: bookingRef,
        total: `${BOOKING_CONFIG.pricing.symbol}${pricing.total.toFixed(2)}`,
        date: form.tourDate,
        travellers: travellerSummary,
        paymentMethod: form.paymentMethod,
        paymentUrl
      });
      if (paymentUrl) {
        window.open(paymentUrl, '_blank', 'noopener');
      }
      setCurrentStep(4);
    } catch (error: any) {
      console.error(error);
      toast({
        title: 'Booking failed',
        description: error?.message || 'We could not process your booking. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderPriceBreakdown = () => {
    const childPrice = BOOKING_CONFIG.pricing.child;
    return (
      <>
        <div className="breakdown-item">
          <span>Adults × {form.adults}</span>
          <span>
            {BOOKING_CONFIG.pricing.symbol}
            {(form.adults * BOOKING_CONFIG.pricing.adult).toFixed(2)}
          </span>
        </div>
        {form.children > 0 && (
          <div className="breakdown-item">
            <span>Children × {form.children}</span>
            <span>
              {BOOKING_CONFIG.pricing.symbol}
              {(form.children * childPrice).toFixed(2)}
            </span>
          </div>
        )}
        {form.infants > 0 && (
          <div className="breakdown-item">
            <span>Infants × {form.infants}</span>
            <span>Free</span>
          </div>
        )}
        {pricing.pickupCost !== 0 && (
          <div className="breakdown-item">
            <span>Pickup surcharge</span>
            <span>
              {pricing.pickupCost > 0 ? '+' : '-'}
              {BOOKING_CONFIG.pricing.symbol}
              {Math.abs(pricing.pickupCost).toFixed(2)}
            </span>
          </div>
        )}
      </>
    );
  };

  return (
    <div className="booking-shell">
      <Helmet>
        <title>Recharge Travels | Concierge Booking</title>
      </Helmet>

      <header className="booking-header">
        <div className="header-content">
          <a href="/" className="logo">
            <span className="logo-mark">
              <svg viewBox="0 0 32 32" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round">
                <path d="M8 22c4.5-6 5.5-10 8-14 2.5 4 3.5 8 8 14" />
                <path d="M16 8v16" />
                <path d="M6 16h20" />
              </svg>
            </span>
            <span>Recharge Travels</span>
          </a>
          <div className="secure-pill">🔐 256-bit Secure Checkout</div>
        </div>
      </header>

      <main className="booking-main">
        <div className="progress-steps">
          {steps.map((stepItem, index) => (
            <div
              key={stepItem.id}
              className={`progress-step ${
                currentStep === stepItem.id
                  ? 'active'
                  : currentStep > stepItem.id
                  ? 'completed'
                  : ''
              }`}
            >
              <div className="step-number">
                {currentStep > stepItem.id ? '✓' : stepItem.id}
              </div>
              <div className="step-label">{stepItem.label}</div>
            </div>
          ))}
        </div>

        <div className="booking-content">
          <div className="form-column">
            <div className={`form-step ${currentStep === 1 ? 'active' : ''}`} id="step1">
              <div className="step-header">
                <h2>Contact Details</h2>
                <p>We’ll use this information for confirmations and concierge updates.</p>
              </div>
              <div className="form-grid">
                <div className="form-group">
                  <label>First Name *</label>
                  <input
                    type="text"
                    value={form.firstName}
                    onChange={(e) => updateForm('firstName', e.target.value)}
                    placeholder="Enter your first name"
                  />
                </div>
                <div className="form-group">
                  <label>Last Name *</label>
                  <input
                    type="text"
                    value={form.lastName}
                    onChange={(e) => updateForm('lastName', e.target.value)}
                    placeholder="Enter your last name"
                  />
                </div>
                <div className="form-group full-width">
                  <label>Email Address *</label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => updateForm('email', e.target.value)}
                    placeholder="your.email@example.com"
                  />
                </div>
                <div className="form-group full-width">
                  <label>Phone Number *</label>
                  <div className="phone-input">
                    <select
                      value={form.countryCode}
                      onChange={(e) => updateForm('countryCode', e.target.value)}
                      className="country-select"
                    >
                      {['+94', '+1', '+44', '+61', '+49', '+33', '+91', '+971'].map((code) => (
                        <option key={code} value={code}>
                          {code}
                        </option>
                      ))}
                    </select>
                    <input
                      type="tel"
                      value={form.phone}
                      onChange={(e) => updateForm('phone', e.target.value)}
                      placeholder="77 123 4567"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className={`form-step ${currentStep === 2 ? 'active' : ''}`} id="step2">
              <div className="step-header">
                <h2>Activity Details</h2>
                <p>Select your preferred date, pickup location, and number of travelers.</p>
              </div>

              <div className="form-section">
                <h3>📅 Select Date</h3>
                <div className="form-group">
                  <select
                    value={form.tourDate}
                    onChange={(e) => updateForm('tourDate', e.target.value)}
                  >
                    <option value="">Choose a date...</option>
                    {tourDates.map((date) => (
                      <option key={date} value={date}>
                        {new Date(date).toLocaleDateString('en-US', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-section">
                <h3>📍 Pickup Location</h3>
                <div className="pickup-options">
                  {BOOKING_CONFIG.pickupOptions.map((option) => (
                    <label
                      key={option.id}
                      className={`pickup-option ${
                        form.pickupOption === option.id ? 'selected' : ''
                      }`}
                    >
                      <input
                        type="radio"
                        name="pickup"
                        checked={form.pickupOption === option.id}
                        onChange={() => updateForm('pickupOption', option.id)}
                      />
                      <div className="option-content">
                        <div className="option-main">
                          <span className="option-label">{option.label}</span>
                          <span className="option-time">Pickup: {option.time}</span>
                        </div>
                        <span className="option-cost">
                          {option.additionalCost === 0
                            ? 'Included'
                            : option.additionalCost > 0
                            ? `+${BOOKING_CONFIG.pricing.symbol}${option.additionalCost}/person`
                            : `-${BOOKING_CONFIG.pricing.symbol}${Math.abs(
                                option.additionalCost
                              )}/person`}
                        </span>
                      </div>
                    </label>
                  ))}
                </div>

                <div className="form-group" style={{ marginTop: '1rem' }}>
                  <label>Hotel/Address for Pickup</label>
                  <input
                    type="text"
                    value={form.pickupAddress}
                    onChange={(e) => updateForm('pickupAddress', e.target.value)}
                    placeholder="Enter your hotel name or address"
                  />
                </div>
              </div>

              <div className="form-section">
                <h3>👥 Number of Travelers</h3>
                <div className="traveler-counts">
                  {([
                    { key: 'adults', label: 'Adults', meta: 'Age 13+', price: `$${BOOKING_CONFIG.pricing.adult} each` },
                    { key: 'children', label: 'Children', meta: 'Age 3-12', price: `$${BOOKING_CONFIG.pricing.child} each` },
                    { key: 'infants', label: 'Infants', meta: 'Under 3', price: 'Free' }
                  ] as const).map((row) => (
                    <div className="traveler-row" key={row.key}>
                      <div className="traveler-info">
                        <span className="traveler-type">{row.label}</span>
                        <span className="traveler-age">{row.meta}</span>
                      </div>
                      <div className="traveler-price">{row.price}</div>
                      <div className="counter">
                        <button type="button" onClick={() => updateCount(row.key, -1)}>
                          −
                        </button>
                        <span>{form[row.key]}</span>
                        <button type="button" onClick={() => updateCount(row.key, 1)}>
                          +
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="form-section">
                <h3>📝 Special Requests (Optional)</h3>
                <div className="form-group">
                  <textarea
                    rows={3}
                    value={form.specialRequests}
                    onChange={(e) => updateForm('specialRequests', e.target.value)}
                    placeholder="Any dietary requirements, mobility needs, or special requests..."
                  />
                </div>
              </div>
            </div>

            <div className={`form-step ${currentStep === 3 ? 'active' : ''}`} id="step3">
              <div className="step-header">
                <h2>Payment Details</h2>
                <p>Complete your booking with secure payment.</p>
              </div>

              <div className="price-breakdown">
                <h3>Price Breakdown</h3>
                <div className="breakdown-items">{renderPriceBreakdown()}</div>
                <div className="breakdown-total">
                  <span>Total</span>
                  <span>
                    {BOOKING_CONFIG.pricing.symbol}
                    {pricing.total.toFixed(2)}
                  </span>
                </div>
              </div>

              <div className="form-section">
                <h3>💳 Payment Method</h3>
                <div className="payment-methods">
                  {(['card', 'paypal', 'bank'] as PaymentMethod[]).map((method) => (
                    <label
                      key={method}
                      className={`payment-method ${
                        form.paymentMethod === method ? 'selected' : ''
                      }`}
                      onClick={() => updateForm('paymentMethod', method)}
                    >
                      <input type="radio" name="paymentMethod" checked={form.paymentMethod === method} readOnly />
                      <div className="method-content">
                        <span className="method-icon">
                          {method === 'card' && '💳'}
                          {method === 'paypal' && '🅿️'}
                          {method === 'bank' && '🏦'}
                        </span>
                        <span className="method-label">
                          {method === 'card'
                            ? 'Credit/Debit'
                            : method === 'paypal'
                            ? 'PayPal'
                            : 'Bank Transfer'}
                        </span>
                        {method === 'card' && (
                          <div className="card-brands">
                            <span>VISA</span>
                            <span>MC</span>
                            <span>AMEX</span>
                          </div>
                        )}
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {form.paymentMethod === 'card' && (
                <div className="form-section card-details">
                  <div className="form-group full-width">
                    <label>Card Number *</label>
                    <input
                      type="text"
                      value={form.cardNumber}
                      onChange={(e) => updateForm('cardNumber', e.target.value)}
                      placeholder="1234 5678 9012 3456"
                      maxLength={19}
                    />
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Expiry Date *</label>
                      <input
                        type="text"
                        value={form.cardExpiry}
                        onChange={(e) => updateForm('cardExpiry', e.target.value)}
                        placeholder="MM/YY"
                        maxLength={5}
                      />
                    </div>
                    <div className="form-group">
                      <label>CVC *</label>
                      <input
                        type="text"
                        value={form.cardCvc}
                        onChange={(e) => updateForm('cardCvc', e.target.value)}
                        placeholder="123"
                        maxLength={4}
                      />
                    </div>
                  </div>
                  <div className="form-group full-width">
                    <label>Name on Card *</label>
                    <input
                      type="text"
                      value={form.cardName}
                      onChange={(e) => updateForm('cardName', e.target.value)}
                      placeholder="JOHN DOE"
                    />
                  </div>
                </div>
              )}

              <div className="form-section">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={form.agreeTerms}
                    onChange={(e) => updateForm('agreeTerms', e.target.checked)}
                  />
                  <span>
                    I agree to the Terms & Conditions and Cancellation Policy
                  </span>
                </label>
                <div className="policy-box">
                  <span className="policy-icon">✅</span>
                  <div className="policy-content">
                    <strong>Cancellation Policy</strong>
                    <p>Free cancellation up to 24 hours before the experience starts</p>
                  </div>
                </div>
              </div>
            </div>

            <div
              className={`confirmation-section ${currentStep === 4 && confirmation ? 'show' : ''}`}
              id="confirmationSection"
            >
              {confirmation && (
                <>
                  <div className="success-icon">✓</div>
                  <h1>Booking Confirmed!</h1>
                  <p className="booking-ref">
                    Reference: <strong>{confirmation.reference}</strong>
                  </p>
                  <p className="confirmation-email">
                    A confirmation email has been sent to <strong>{form.email}</strong>
                  </p>
                  <div className="confirmation-details">
                    <div className="detail-section">
                      <h3>📅 Schedule</h3>
                      <div className="info-grid">
                        <div className="info-item">
                          <span className="label">Date</span>
                          <span className="value">{confirmation.date}</span>
                        </div>
                        <div className="info-item">
                          <span className="label">Travellers</span>
                          <span className="value">{confirmation.travellers}</span>
                        </div>
                        <div className="info-item">
                          <span className="label">Payment</span>
                          <span className="value capitalize">{confirmation.paymentMethod}</span>
                        </div>
                        <div className="info-item">
                          <span className="label">Total Paid</span>
                          <span className="value">{confirmation.total}</span>
                        </div>
                      </div>
                    </div>
                    <div className="action-buttons">
                      <button className="btn btn-primary" onClick={() => window.print()}>
                        🖨️ Print Confirmation
                      </button>
                      {confirmation.paymentUrl && (
                        <button
                          className="btn btn-secondary"
                          onClick={() => window.open(confirmation.paymentUrl, '_blank', 'noopener')}
                        >
                          Open Payment Link
                        </button>
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>

            {currentStep <= 3 && (
              <div className="form-navigation">
                <button
                  className={`btn btn-secondary ${currentStep === 1 ? 'btn-hidden' : ''}`}
                  onClick={goToPreviousStep}
                  type="button"
                  disabled={currentStep === 1}
                >
                  ← Back
                </button>
                {currentStep < 3 && (
                  <button className="btn btn-primary" type="button" onClick={goToNextStep}>
                    Continue →
                  </button>
                )}
                {currentStep === 3 && (
                  <button
                    className="btn btn-primary"
                    type="button"
                    onClick={submitBooking}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Processing…' : 'Complete Booking ✓'}
                  </button>
                )}
              </div>
            )}
          </div>

          <div className="summary-column">
            <div className="booking-summary">
              <div className="summary-header">
                <img src={BOOKING_CONFIG.hero.image} alt="Tour" />
                <div className="summary-overlay">
                  <div className="tour-rating">
                    <span>★★★★★</span>
                    <span className="rating-value">5.0</span>
                    <span className="review-count">(127 reviews)</span>
                  </div>
                </div>
              </div>
              <div className="summary-content">
                <h3 className="tour-title">{BOOKING_CONFIG.hero.title}</h3>
                <p className="tour-operator">by Recharge Travels</p>
                <div className="tour-meta">
                  <span className="meta-item">
                    ⏱️ <span id="summaryDuration">Full-day private</span>
                  </span>
                  <span className="meta-item">👥 {travellerSummary}</span>
                </div>
                <div className="summary-divider" />
                <div className="summary-details">
                  <div className="detail-row">
                    <span className="detail-label">📅 Date</span>
                    <span className="detail-value">
                      {form.tourDate
                        ? new Date(form.tourDate).toLocaleDateString()
                        : 'Not selected'}
                    </span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">📍 Pickup</span>
                    <span className="detail-value">
                      {pickupOption?.label || 'Not selected'}
                      <small>{pickupOption?.time}</small>
                    </span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">👥 Travelers</span>
                    <span className="detail-value">{travellerSummary}</span>
                  </div>
                </div>
                <div className="summary-divider" />
                <div className="summary-price">
                  <div className="price-row">
                    <span>Subtotal</span>
                    <span>
                      {BOOKING_CONFIG.pricing.symbol}
                      {pricing.subtotal.toFixed(2)}
                    </span>
                  </div>
                  {pricing.pickupCost !== 0 && (
                    <div className="price-row">
                      <span>Pickup surcharge</span>
                      <span>
                        {pricing.pickupCost > 0 ? '+' : '-'}
                        {BOOKING_CONFIG.pricing.symbol}
                        {Math.abs(pricing.pickupCost).toFixed(2)}
                      </span>
                    </div>
                  )}
                  <div className="price-row total">
                    <span>Total</span>
                    <span className="total-amount">
                      {BOOKING_CONFIG.pricing.symbol}
                      {pricing.total.toFixed(2)}
                    </span>
                  </div>
                </div>
                <div className="summary-highlights">
                  <h4>✨ Highlights</h4>
                  <ul>
                    {BOOKING_CONFIG.highlights.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
                <div className="summary-support">
                  <p>Need help? Contact us</p>
                  <a href="https://wa.me/94771234567" target="_blank" rel="noreferrer">
                    💬 WhatsApp Support
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="booking-footer">
        <div className="footer-content">
          <div className="trust-badges">
            <span>🔒 256-bit SSL Encrypted</span>
            <span>✓ Verified Operator</span>
            <span>💬 24/7 Support</span>
          </div>
          <div className="footer-links">
            <a href="/terms">Terms & Conditions</a>
            <a href="/privacy">Privacy Policy</a>
            <a href="/contact">Contact Us</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default ConciergeBooking;
