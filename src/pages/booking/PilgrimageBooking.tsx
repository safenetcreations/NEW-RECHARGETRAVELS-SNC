import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

const PilgrimageBooking: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // Get tour details from URL params
  const tourName = searchParams.get('package') || 'Sacred Pilgrimage Tour';
  const basePrice = parseFloat(searchParams.get('price') || '189');
  const duration = searchParams.get('duration') || '2 Days';

  const [currentStep, setCurrentStep] = useState(1);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [bookingReference, setBookingReference] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    countryCode: '+94',
    phone: '',
    tourDate: '',
    pickupOption: 'colombo',
    pickupAddress: '',
    adults: 2,
    children: 0,
    infants: 0,
    specialRequests: '',
    paymentMethod: 'card',
    cardNumber: '',
    cardExpiry: '',
    cardCvc: '',
    cardName: '',
    agreeTerms: false,
  });

  const [errors, setErrors] = useState<{ [key: string]: boolean }>({});

  // Tour Configuration
  const TOUR_CONFIG = {
    title: tourName,
    rating: 5.0,
    reviewCount: 127,
    duration: duration,
    image: 'https://images.unsplash.com/photo-1588416936097-41850ab3d86d?w=800',
    pricing: { adult: basePrice, child: basePrice * 0.5, infant: 0, symbol: '$' },
    pickupOptions: [
      { id: 'colombo', label: 'Pickup from Colombo', time: '4:00 AM', additionalCost: 0 },
      { id: 'kandy', label: 'Pickup from Kandy', time: '2:00 AM', additionalCost: 0 },
      { id: 'airport', label: 'Airport Pickup (BIA)', time: '3:30 AM', additionalCost: 15 },
    ],
    highlights: [
      'Visit sacred Buddhist temples',
      'Private tour - only your group',
      'Professional guide included',
      'All entrance fees included',
    ],
  };

  // Generate dates for next 90 days
  const availableDates = Array.from({ length: 90 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() + i + 1);
    return {
      value: date.toISOString().split('T')[0],
      label: date.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }),
    };
  });

  // Calculate pricing
  const calculateTotal = () => {
    const pickup = TOUR_CONFIG.pickupOptions.find((p) => p.id === formData.pickupOption);
    const pickupCost = (pickup?.additionalCost || 0) * (formData.adults + formData.children);
    const subtotal = formData.adults * TOUR_CONFIG.pricing.adult + formData.children * TOUR_CONFIG.pricing.child;
    return { subtotal, pickupCost, total: subtotal + pickupCost };
  };

  const pricing = calculateTotal();
  const selectedPickup = TOUR_CONFIG.pickupOptions.find((p) => p.id === formData.pickupOption);

  // Validation
  const validateStep = (step: number): boolean => {
    const newErrors: { [key: string]: boolean } = {};

    if (step === 1) {
      if (!formData.firstName.trim()) newErrors.firstName = true;
      if (!formData.lastName.trim()) newErrors.lastName = true;
      if (!formData.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = true;
      if (!formData.phone.trim()) newErrors.phone = true;
    }

    if (step === 2) {
      if (!formData.tourDate) newErrors.tourDate = true;
    }

    if (step === 3) {
      if (formData.paymentMethod === 'card') {
        if (!formData.cardNumber.trim()) newErrors.cardNumber = true;
        if (!formData.cardExpiry.trim()) newErrors.cardExpiry = true;
        if (!formData.cardCvc.trim()) newErrors.cardCvc = true;
        if (!formData.cardName.trim()) newErrors.cardName = true;
      }
      if (!formData.agreeTerms) newErrors.agreeTerms = true;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      if (currentStep < 3) {
        setCurrentStep(currentStep + 1);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        submitBooking();
      }
    }
  };

  const previousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const submitBooking = async () => {
    if (!validateStep(3)) return;
    setIsProcessing(true);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    const ref = `RT-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substr(2, 4).toUpperCase()}`;
    setBookingReference(ref);
    setIsConfirmed(true);
    setIsProcessing(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const updateCount = (type: 'adults' | 'children' | 'infants', delta: number) => {
    const min = type === 'adults' ? 1 : 0;
    const max = 15;
    setFormData((prev) => ({
      ...prev,
      [type]: Math.max(min, Math.min(max, prev[type] + delta)),
    }));
  };

  // Get travelers string
  let travelersText = `${formData.adults} Adult${formData.adults !== 1 ? 's' : ''}`;
  if (formData.children > 0) travelersText += `, ${formData.children} Child${formData.children !== 1 ? 'ren' : ''}`;
  if (formData.infants > 0) travelersText += `, ${formData.infants} Infant${formData.infants !== 1 ? 's' : ''}`;

  const styles = `
    .booking-page * { margin: 0; padding: 0; box-sizing: border-box; }
    .booking-page { font-family: 'DM Sans', -apple-system, BlinkMacSystemFont, sans-serif; background: linear-gradient(135deg, #f8faf9 0%, #e8f4ec 100%); min-height: 100vh; color: #1a2e35; }
    .booking-page .booking-header { background: white; border-bottom: 1px solid rgba(0,0,0,0.08); position: sticky; top: 0; z-index: 100; }
    .booking-page .header-content { max-width: 1200px; margin: 0 auto; padding: 1rem 1.5rem; display: flex; justify-content: space-between; align-items: center; }
    .booking-page .logo { display: flex; align-items: center; gap: 0.5rem; font-weight: 700; font-size: 1.25rem; color: #0d5c46; text-decoration: none; }
    .booking-page .logo-icon { font-size: 1.5rem; }
    .booking-page .secure-badge { display: flex; align-items: center; gap: 0.5rem; font-size: 0.875rem; color: #0d5c46; background: #e8f5e9; padding: 0.5rem 1rem; border-radius: 2rem; }
    .booking-page .booking-main { max-width: 1200px; margin: 0 auto; padding: 2rem 1.5rem; }
    .booking-page .progress-container { margin-bottom: 2rem; }
    .booking-page .progress-steps { display: flex; justify-content: center; gap: 1rem; position: relative; }
    .booking-page .progress-steps::before { content: ''; position: absolute; top: 20px; left: 25%; right: 25%; height: 2px; background: #e0e0e0; z-index: 0; }
    .booking-page .progress-step { display: flex; flex-direction: column; align-items: center; gap: 0.5rem; z-index: 1; flex: 1; max-width: 200px; }
    .booking-page .step-number { width: 40px; height: 40px; border-radius: 50%; background: white; border: 2px solid #e0e0e0; display: flex; align-items: center; justify-content: center; font-weight: 600; color: #999; transition: all 0.3s ease; }
    .booking-page .progress-step.active .step-number { background: #0d5c46; border-color: #0d5c46; color: white; }
    .booking-page .progress-step.completed .step-number { background: #4caf50; border-color: #4caf50; color: white; }
    .booking-page .step-label { font-size: 0.875rem; color: #666; text-align: center; }
    .booking-page .progress-step.active .step-label { color: #0d5c46; font-weight: 600; }
    .booking-page .booking-content { display: grid; grid-template-columns: 1fr 380px; gap: 2rem; align-items: start; }
    .booking-page .form-column { background: white; border-radius: 16px; padding: 2rem; box-shadow: 0 4px 20px rgba(0,0,0,0.06); }
    .booking-page .step-header { margin-bottom: 2rem; }
    .booking-page .step-header h2 { font-family: 'Playfair Display', serif; font-size: 1.75rem; color: #0d5c46; margin-bottom: 0.5rem; }
    .booking-page .step-header p { color: #666; }
    .booking-page .form-section { margin-bottom: 2rem; }
    .booking-page .form-section h3 { font-size: 1.1rem; margin-bottom: 1rem; color: #1a2e35; }
    .booking-page .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
    .booking-page .form-group { margin-bottom: 1rem; }
    .booking-page .form-group.full-width { grid-column: 1 / -1; }
    .booking-page .form-group label { display: block; font-size: 0.875rem; font-weight: 500; margin-bottom: 0.5rem; color: #333; }
    .booking-page .form-group input, .booking-page .form-group select, .booking-page .form-group textarea { width: 100%; padding: 0.875rem 1rem; border: 2px solid #e0e0e0; border-radius: 10px; font-size: 1rem; font-family: inherit; transition: all 0.2s ease; background: white; }
    .booking-page .form-group input:focus, .booking-page .form-group select:focus, .booking-page .form-group textarea:focus { outline: none; border-color: #0d5c46; box-shadow: 0 0 0 3px rgba(13, 92, 70, 0.1); }
    .booking-page .form-group input.error, .booking-page .form-group select.error { border-color: #e53935; }
    .booking-page .error-text { color: #e53935; font-size: 0.8rem; margin-top: 0.25rem; }
    .booking-page .hint { color: #888; font-size: 0.8rem; margin-top: 0.25rem; display: block; }
    .booking-page .phone-input { display: flex; gap: 0.5rem; }
    .booking-page .country-select { width: 110px !important; flex-shrink: 0; }
    .booking-page .pickup-options { display: flex; flex-direction: column; gap: 0.75rem; }
    .booking-page .pickup-option { display: flex; align-items: center; padding: 1rem; border: 2px solid #e0e0e0; border-radius: 10px; cursor: pointer; transition: all 0.2s ease; }
    .booking-page .pickup-option:hover { border-color: #0d5c46; background: #f8faf9; }
    .booking-page .pickup-option.selected { border-color: #0d5c46; background: linear-gradient(135deg, #e8f5e9 0%, #f1f8f4 100%); }
    .booking-page .pickup-option input[type="radio"] { margin-right: 1rem; accent-color: #0d5c46; transform: scale(1.2); width: auto; }
    .booking-page .option-content { flex: 1; display: flex; justify-content: space-between; align-items: center; }
    .booking-page .option-main { display: flex; flex-direction: column; }
    .booking-page .option-label { font-weight: 500; }
    .booking-page .option-time { font-size: 0.875rem; color: #666; }
    .booking-page .option-cost { font-size: 0.875rem; color: #0d5c46; font-weight: 600; }
    .booking-page .traveler-counts { display: flex; flex-direction: column; gap: 1rem; }
    .booking-page .traveler-row { display: flex; align-items: center; padding: 1rem; background: #f8f9fa; border-radius: 10px; }
    .booking-page .traveler-info { flex: 1; display: flex; flex-direction: column; }
    .booking-page .traveler-type { font-weight: 500; }
    .booking-page .traveler-age { font-size: 0.8rem; color: #666; }
    .booking-page .traveler-price { color: #0d5c46; font-weight: 500; margin-right: 1.5rem; }
    .booking-page .counter { display: flex; align-items: center; gap: 0.75rem; }
    .booking-page .counter button { width: 36px; height: 36px; border: 2px solid #0d5c46; border-radius: 50%; background: white; color: #0d5c46; font-size: 1.25rem; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all 0.2s ease; }
    .booking-page .counter button:hover { background: #0d5c46; color: white; }
    .booking-page .counter span { font-size: 1.1rem; font-weight: 600; min-width: 2rem; text-align: center; }
    .booking-page .payment-methods { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem; }
    .booking-page .payment-method { display: flex; padding: 1rem; border: 2px solid #e0e0e0; border-radius: 10px; cursor: pointer; transition: all 0.2s ease; }
    .booking-page .payment-method:hover { border-color: #0d5c46; }
    .booking-page .payment-method.selected { border-color: #0d5c46; background: linear-gradient(135deg, #e8f5e9 0%, #f1f8f4 100%); }
    .booking-page .payment-method input { display: none; }
    .booking-page .method-content { display: flex; flex-direction: column; align-items: center; width: 100%; gap: 0.5rem; }
    .booking-page .method-icon { font-size: 1.5rem; }
    .booking-page .method-label { font-weight: 500; font-size: 0.9rem; }
    .booking-page .card-brands { display: flex; gap: 0.5rem; font-size: 0.7rem; color: #666; }
    .booking-page .price-breakdown { background: #f8f9fa; border-radius: 12px; padding: 1.5rem; margin-bottom: 2rem; }
    .booking-page .price-breakdown h3 { margin-bottom: 1rem; }
    .booking-page .breakdown-items { display: flex; flex-direction: column; gap: 0.5rem; }
    .booking-page .breakdown-item { display: flex; justify-content: space-between; padding: 0.5rem 0; }
    .booking-page .breakdown-total { display: flex; justify-content: space-between; padding-top: 1rem; margin-top: 0.5rem; border-top: 2px solid #e0e0e0; font-size: 1.25rem; font-weight: 700; color: #0d5c46; }
    .booking-page .card-details { background: #f8f9fa; border-radius: 12px; padding: 1.5rem; }
    .booking-page .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
    .booking-page .checkbox-label { display: flex; align-items: flex-start; gap: 0.75rem; cursor: pointer; font-size: 0.9rem; line-height: 1.5; }
    .booking-page .checkbox-label input[type="checkbox"] { width: 20px; height: 20px; margin-top: 2px; accent-color: #0d5c46; }
    .booking-page .checkbox-label a { color: #0d5c46; text-decoration: underline; }
    .booking-page .policy-box { display: flex; gap: 1rem; padding: 1rem; background: #f1f8f4; border-radius: 10px; margin-top: 1rem; }
    .booking-page .policy-icon { font-size: 1.5rem; }
    .booking-page .policy-content strong { display: block; margin-bottom: 0.25rem; }
    .booking-page .policy-content p { font-size: 0.875rem; color: #666; }
    .booking-page .form-navigation { display: flex; justify-content: space-between; margin-top: 2rem; padding-top: 2rem; border-top: 1px solid #e0e0e0; }
    .booking-page .btn { display: inline-flex; align-items: center; gap: 0.5rem; padding: 1rem 1.5rem; border-radius: 10px; font-size: 1rem; font-weight: 600; cursor: pointer; transition: all 0.2s ease; border: none; text-decoration: none; }
    .booking-page .btn-primary { background: linear-gradient(135deg, #0d5c46 0%, #1a7f5f 100%); color: white; margin-left: auto; }
    .booking-page .btn-primary:hover { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(13, 92, 70, 0.3); }
    .booking-page .btn-secondary { background: white; color: #333; border: 2px solid #e0e0e0; }
    .booking-page .btn-secondary:hover { border-color: #999; }
    .booking-page .btn:disabled { opacity: 0.7; cursor: not-allowed; }
    .booking-page .spinner { width: 20px; height: 20px; border: 2px solid rgba(255,255,255,0.3); border-top-color: white; border-radius: 50%; animation: spin 0.8s linear infinite; display: inline-block; margin-right: 8px; }
    @keyframes spin { to { transform: rotate(360deg); } }
    .booking-page .summary-column { position: sticky; top: 100px; }
    .booking-page .booking-summary { background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.08); }
    .booking-page .summary-header { position: relative; height: 180px; overflow: hidden; }
    .booking-page .summary-image { width: 100%; height: 100%; object-fit: cover; }
    .booking-page .summary-overlay { position: absolute; bottom: 0; left: 0; right: 0; padding: 1rem; background: linear-gradient(transparent, rgba(0,0,0,0.7)); }
    .booking-page .tour-rating { display: flex; align-items: center; gap: 0.25rem; color: white; font-size: 0.9rem; }
    .booking-page .stars { color: #ffc107; }
    .booking-page .rating-value { font-weight: 600; }
    .booking-page .review-count { opacity: 0.8; }
    .booking-page .summary-content { padding: 1.5rem; }
    .booking-page .tour-title { font-family: 'Playfair Display', serif; font-size: 1.25rem; color: #1a2e35; margin-bottom: 0.25rem; }
    .booking-page .tour-operator { color: #666; font-size: 0.9rem; margin-bottom: 1rem; }
    .booking-page .tour-meta { display: flex; gap: 1rem; margin-bottom: 1rem; }
    .booking-page .meta-item { display: flex; align-items: center; gap: 0.5rem; font-size: 0.875rem; color: #666; }
    .booking-page .summary-divider { height: 1px; background: #e0e0e0; margin: 1rem 0; }
    .booking-page .summary-details { display: flex; flex-direction: column; gap: 0.75rem; }
    .booking-page .detail-row { display: flex; justify-content: space-between; font-size: 0.9rem; }
    .booking-page .detail-label { color: #666; }
    .booking-page .detail-value { font-weight: 500; text-align: right; display: flex; flex-direction: column; }
    .booking-page .detail-value small { font-weight: 400; color: #888; font-size: 0.8rem; }
    .booking-page .summary-price { background: #f8f9fa; margin: 0 -1.5rem; padding: 1rem 1.5rem; }
    .booking-page .price-row { display: flex; justify-content: space-between; padding: 0.25rem 0; font-size: 0.9rem; }
    .booking-page .price-row.total { font-size: 1.1rem; font-weight: 700; padding-top: 0.75rem; margin-top: 0.5rem; border-top: 1px solid #e0e0e0; }
    .booking-page .total-amount { color: #0d5c46; font-size: 1.25rem; }
    .booking-page .summary-highlights { margin-top: 1rem; }
    .booking-page .summary-highlights h4 { font-size: 0.9rem; margin-bottom: 0.75rem; }
    .booking-page .summary-highlights ul { list-style: none; font-size: 0.85rem; }
    .booking-page .summary-highlights li { padding: 0.25rem 0; padding-left: 1.25rem; position: relative; color: #666; }
    .booking-page .summary-highlights li::before { content: '✓'; position: absolute; left: 0; color: #4caf50; font-weight: bold; }
    .booking-page .summary-support { margin-top: 1.5rem; padding-top: 1.5rem; border-top: 1px solid #e0e0e0; text-align: center; }
    .booking-page .summary-support p { font-size: 0.85rem; color: #666; margin-bottom: 0.75rem; }
    .booking-page .whatsapp-link { display: inline-flex; align-items: center; gap: 0.5rem; padding: 0.75rem 1.5rem; background: #25d366; color: white; border-radius: 25px; text-decoration: none; font-weight: 500; font-size: 0.9rem; transition: all 0.2s ease; }
    .booking-page .whatsapp-link:hover { transform: translateY(-2px); box-shadow: 0 4px 12px rgba(37, 211, 102, 0.3); }
    .booking-page .booking-footer { background: white; border-top: 1px solid #e0e0e0; margin-top: 3rem; }
    .booking-page .footer-content { max-width: 1200px; margin: 0 auto; padding: 1.5rem; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem; }
    .booking-page .trust-badges { display: flex; gap: 1.5rem; font-size: 0.85rem; color: #666; }
    .booking-page .footer-links { display: flex; gap: 1.5rem; }
    .booking-page .footer-links a { color: #666; text-decoration: none; font-size: 0.85rem; }
    .booking-page .footer-links a:hover { color: #0d5c46; }
    .booking-page .confirmation-section { text-align: center; padding: 3rem; }
    .booking-page .success-icon { width: 80px; height: 80px; background: #4caf50; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 1.5rem; color: white; font-size: 2.5rem; }
    .booking-page .confirmation-section h1 { font-family: 'Playfair Display', serif; font-size: 2rem; color: #0d5c46; margin-bottom: 1rem; }
    .booking-page .booking-ref { font-size: 1.1rem; color: #333; margin-bottom: 0.5rem; }
    .booking-page .confirmation-email { color: #666; }
    .booking-page .confirmation-details { text-align: left; margin-top: 2rem; padding-top: 2rem; border-top: 1px solid #e0e0e0; }
    .booking-page .detail-section { margin-bottom: 2rem; }
    .booking-page .detail-section h3 { font-size: 1.1rem; margin-bottom: 1rem; color: #1a2e35; }
    .booking-page .info-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 1rem; }
    .booking-page .info-item { padding: 1rem; background: #f8f9fa; border-radius: 8px; }
    .booking-page .info-item .label { display: block; font-size: 0.8rem; color: #666; margin-bottom: 0.25rem; }
    .booking-page .info-item .value { font-weight: 600; color: #1a2e35; }
    .booking-page .next-steps { padding-left: 1.5rem; text-align: left; }
    .booking-page .next-steps li { padding: 0.5rem 0; color: #666; }
    .booking-page .action-buttons { display: flex; gap: 1rem; justify-content: center; margin: 2rem 0; flex-wrap: wrap; }
    @media (max-width: 968px) { .booking-page .booking-content { grid-template-columns: 1fr; } .booking-page .summary-column { order: -1; } }
    @media (max-width: 768px) { .booking-page .form-grid { grid-template-columns: 1fr; } .booking-page .booking-main { padding: 1rem; } .booking-page .form-column { padding: 1.5rem; } .booking-page .progress-steps::before { display: none; } .booking-page .step-label { font-size: 0.75rem; } .booking-page .info-grid { grid-template-columns: 1fr; } .booking-page .payment-methods { grid-template-columns: 1fr; } }
  `;

  return (
    <>
      <style>{styles}</style>
      <Helmet>
        <title>Book {tourName} - Recharge Travels</title>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Playfair+Display:wght@600;700&display=swap" rel="stylesheet" />
      </Helmet>

      <div className="booking-page">
        {/* Header */}
        <header className="booking-header">
          <div className="header-content">
            <a href="/" className="logo">
              <span className="logo-icon">🌴</span>
              <span className="logo-text">Recharge Travels</span>
            </a>
            <div className="secure-badge">🔒 Secure Booking</div>
          </div>
        </header>

        <main className="booking-main">
          {/* Progress Steps - Hide on confirmation */}
          {!isConfirmed && (
            <div className="progress-container">
              <div className="progress-steps">
                {['Contact Details', 'Activity Details', 'Payment'].map((label, index) => (
                  <div key={index} className={`progress-step ${currentStep === index + 1 ? 'active' : ''} ${currentStep > index + 1 ? 'completed' : ''}`}>
                    <div className="step-number">{currentStep > index + 1 ? '✓' : index + 1}</div>
                    <div className="step-label">{label}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="booking-content">
            {/* Form Column */}
            <div className="form-column">
              {/* Confirmation Section */}
              {isConfirmed ? (
                <div className="confirmation-section">
                  <div className="success-icon">✓</div>
                  <h1>Booking Confirmed!</h1>
                  <p className="booking-ref">Reference: <strong>{bookingReference}</strong></p>
                  <p className="confirmation-email">A confirmation email has been sent to <strong>{formData.email}</strong></p>

                  <div className="confirmation-details">
                    <div className="detail-section">
                      <h3>📅 Schedule</h3>
                      <div className="info-grid">
                        <div className="info-item">
                          <span className="label">Date</span>
                          <span className="value">{formData.tourDate ? new Date(formData.tourDate).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' }) : ''}</span>
                        </div>
                        <div className="info-item">
                          <span className="label">Pickup Time</span>
                          <span className="value">{selectedPickup?.time}</span>
                        </div>
                        <div className="info-item">
                          <span className="label">Travelers</span>
                          <span className="value">{travelersText}</span>
                        </div>
                        <div className="info-item">
                          <span className="label">Total Paid</span>
                          <span className="value" style={{ color: '#0d5c46' }}>${pricing.total.toFixed(2)}</span>
                        </div>
                      </div>
                    </div>

                    <div className="detail-section">
                      <h3>📋 What's Next?</h3>
                      <ol className="next-steps">
                        <li>Check your email for the detailed confirmation</li>
                        <li>Our team will contact you via WhatsApp 24 hours before the tour</li>
                        <li>Be ready at the pickup location at the scheduled time</li>
                        <li>Bring your booking reference and ID</li>
                      </ol>
                    </div>

                    <div className="action-buttons">
                      <button className="btn btn-primary" onClick={() => window.print()}>🖨️ Print Confirmation</button>
                      <button className="btn btn-secondary" onClick={() => navigate('/experiences/pilgrimage-tours')}>Book Another Tour</button>
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  {/* Step 1: Contact Details */}
                  {currentStep === 1 && (
                    <div className="form-step">
                      <div className="step-header">
                        <h2>Contact Details</h2>
                        <p>We'll use this information to send you confirmation and updates about your booking.</p>
                      </div>

                      <div className="form-grid">
                        <div className="form-group">
                          <label>First Name *</label>
                          <input type="text" value={formData.firstName} onChange={(e) => setFormData({ ...formData, firstName: e.target.value })} className={errors.firstName ? 'error' : ''} placeholder="Enter your first name" />
                          {errors.firstName && <span className="error-text">First name is required</span>}
                        </div>

                        <div className="form-group">
                          <label>Last Name *</label>
                          <input type="text" value={formData.lastName} onChange={(e) => setFormData({ ...formData, lastName: e.target.value })} className={errors.lastName ? 'error' : ''} placeholder="Enter your last name" />
                          {errors.lastName && <span className="error-text">Last name is required</span>}
                        </div>

                        <div className="form-group full-width">
                          <label>Email Address *</label>
                          <input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className={errors.email ? 'error' : ''} placeholder="your.email@example.com" />
                          {errors.email && <span className="error-text">Please enter a valid email</span>}
                          <span className="hint">Confirmation will be sent to this email</span>
                        </div>

                        <div className="form-group full-width">
                          <label>Phone Number *</label>
                          <div className="phone-input">
                            <select value={formData.countryCode} onChange={(e) => setFormData({ ...formData, countryCode: e.target.value })} className="country-select">
                              <option value="+94">🇱🇰 +94</option>
                              <option value="+1">🇺🇸 +1</option>
                              <option value="+44">🇬🇧 +44</option>
                              <option value="+61">🇦🇺 +61</option>
                              <option value="+49">🇩🇪 +49</option>
                              <option value="+33">🇫🇷 +33</option>
                              <option value="+91">🇮🇳 +91</option>
                            </select>
                            <input type="tel" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} className={errors.phone ? 'error' : ''} placeholder="77 123 4567" />
                          </div>
                          {errors.phone && <span className="error-text">Phone number is required</span>}
                          <span className="hint">For WhatsApp communication about your booking</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Step 2: Activity Details */}
                  {currentStep === 2 && (
                    <div className="form-step">
                      <div className="step-header">
                        <h2>Activity Details</h2>
                        <p>Select your preferred date, pickup location, and number of travelers.</p>
                      </div>

                      <div className="form-section">
                        <h3>📅 Select Date</h3>
                        <div className="form-group">
                          <select value={formData.tourDate} onChange={(e) => setFormData({ ...formData, tourDate: e.target.value })} className={errors.tourDate ? 'error' : ''}>
                            <option value="">Choose a date...</option>
                            {availableDates.map((date) => (
                              <option key={date.value} value={date.value}>{date.label}</option>
                            ))}
                          </select>
                          {errors.tourDate && <span className="error-text">Please select a date</span>}
                        </div>
                      </div>

                      <div className="form-section">
                        <h3>📍 Pickup Location</h3>
                        <div className="pickup-options">
                          {TOUR_CONFIG.pickupOptions.map((opt) => (
                            <label key={opt.id} className={`pickup-option ${formData.pickupOption === opt.id ? 'selected' : ''}`} onClick={() => setFormData({ ...formData, pickupOption: opt.id })}>
                              <input type="radio" name="pickup" value={opt.id} checked={formData.pickupOption === opt.id} onChange={() => {}} />
                              <div className="option-content">
                                <div className="option-main">
                                  <span className="option-label">{opt.label}</span>
                                  <span className="option-time">Pickup: {opt.time}</span>
                                </div>
                                {opt.additionalCost > 0 && <span className="option-cost">+${opt.additionalCost}/person</span>}
                              </div>
                            </label>
                          ))}
                        </div>

                        <div className="form-group" style={{ marginTop: '1rem' }}>
                          <label>Hotel/Address for Pickup</label>
                          <input type="text" value={formData.pickupAddress} onChange={(e) => setFormData({ ...formData, pickupAddress: e.target.value })} placeholder="Enter your hotel name or address" />
                          <span className="hint">Our driver will pick you up from this location</span>
                        </div>
                      </div>

                      <div className="form-section">
                        <h3>👥 Number of Travelers</h3>
                        <div className="traveler-counts">
                          <div className="traveler-row">
                            <div className="traveler-info">
                              <span className="traveler-type">Adults</span>
                              <span className="traveler-age">Age 13+</span>
                            </div>
                            <div className="traveler-price">${TOUR_CONFIG.pricing.adult} each</div>
                            <div className="counter">
                              <button type="button" onClick={() => updateCount('adults', -1)}>−</button>
                              <span>{formData.adults}</span>
                              <button type="button" onClick={() => updateCount('adults', 1)}>+</button>
                            </div>
                          </div>

                          <div className="traveler-row">
                            <div className="traveler-info">
                              <span className="traveler-type">Children</span>
                              <span className="traveler-age">Age 3-12</span>
                            </div>
                            <div className="traveler-price">${TOUR_CONFIG.pricing.child} each</div>
                            <div className="counter">
                              <button type="button" onClick={() => updateCount('children', -1)}>−</button>
                              <span>{formData.children}</span>
                              <button type="button" onClick={() => updateCount('children', 1)}>+</button>
                            </div>
                          </div>

                          <div className="traveler-row">
                            <div className="traveler-info">
                              <span className="traveler-type">Infants</span>
                              <span className="traveler-age">Under 3</span>
                            </div>
                            <div className="traveler-price">Free</div>
                            <div className="counter">
                              <button type="button" onClick={() => updateCount('infants', -1)}>−</button>
                              <span>{formData.infants}</span>
                              <button type="button" onClick={() => updateCount('infants', 1)}>+</button>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="form-section">
                        <h3>📝 Special Requests (Optional)</h3>
                        <div className="form-group">
                          <textarea value={formData.specialRequests} onChange={(e) => setFormData({ ...formData, specialRequests: e.target.value })} rows={3} placeholder="Any dietary requirements, mobility needs, or special requests..." />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Step 3: Payment */}
                  {currentStep === 3 && (
                    <div className="form-step">
                      <div className="step-header">
                        <h2>Payment Details</h2>
                        <p>Complete your booking with secure payment.</p>
                      </div>

                      <div className="price-breakdown">
                        <h3>Price Breakdown</h3>
                        <div className="breakdown-items">
                          {formData.adults > 0 && <div className="breakdown-item"><span>Adults × {formData.adults}</span><span>${(formData.adults * TOUR_CONFIG.pricing.adult).toFixed(2)}</span></div>}
                          {formData.children > 0 && <div className="breakdown-item"><span>Children × {formData.children}</span><span>${(formData.children * TOUR_CONFIG.pricing.child).toFixed(2)}</span></div>}
                          {formData.infants > 0 && <div className="breakdown-item"><span>Infants × {formData.infants}</span><span>Free</span></div>}
                          {pricing.pickupCost > 0 && <div className="breakdown-item"><span>Pickup surcharge</span><span>${pricing.pickupCost.toFixed(2)}</span></div>}
                        </div>
                        <div className="breakdown-total">
                          <span>Total</span>
                          <span>${pricing.total.toFixed(2)}</span>
                        </div>
                      </div>

                      <div className="form-section">
                        <h3>💳 Payment Method</h3>
                        <div className="payment-methods">
                          {[
                            { id: 'card', icon: '💳', label: 'Credit/Debit Card', brands: ['VISA', 'MC', 'AMEX'] },
                            { id: 'paypal', icon: '🅿️', label: 'PayPal' },
                            { id: 'bank', icon: '🏦', label: 'Bank Transfer' },
                          ].map((method) => (
                            <label key={method.id} className={`payment-method ${formData.paymentMethod === method.id ? 'selected' : ''}`} onClick={() => setFormData({ ...formData, paymentMethod: method.id as any })}>
                              <input type="radio" name="paymentMethod" value={method.id} checked={formData.paymentMethod === method.id} onChange={() => {}} />
                              <div className="method-content">
                                <span className="method-icon">{method.icon}</span>
                                <span className="method-label">{method.label}</span>
                                {method.brands && <div className="card-brands">{method.brands.map((b) => <span key={b}>{b}</span>)}</div>}
                              </div>
                            </label>
                          ))}
                        </div>
                      </div>

                      {formData.paymentMethod === 'card' && (
                        <div className="form-section card-details">
                          <div className="form-group full-width">
                            <label>Card Number *</label>
                            <input type="text" value={formData.cardNumber} onChange={(e) => { let v = e.target.value.replace(/\s+/g, '').replace(/[^0-9]/gi, ''); let f = v.match(/.{1,4}/g)?.join(' ') || v; setFormData({ ...formData, cardNumber: f }); }} className={errors.cardNumber ? 'error' : ''} placeholder="1234 5678 9012 3456" maxLength={19} />
                            {errors.cardNumber && <span className="error-text">Card number is required</span>}
                          </div>

                          <div className="form-row">
                            <div className="form-group">
                              <label>Expiry Date *</label>
                              <input type="text" value={formData.cardExpiry} onChange={(e) => { let v = e.target.value.replace(/\D/g, ''); if (v.length >= 2) v = v.substring(0, 2) + '/' + v.substring(2, 4); setFormData({ ...formData, cardExpiry: v }); }} className={errors.cardExpiry ? 'error' : ''} placeholder="MM/YY" maxLength={5} />
                              {errors.cardExpiry && <span className="error-text">Expiry date is required</span>}
                            </div>

                            <div className="form-group">
                              <label>CVC *</label>
                              <input type="text" value={formData.cardCvc} onChange={(e) => setFormData({ ...formData, cardCvc: e.target.value.replace(/\D/g, '') })} className={errors.cardCvc ? 'error' : ''} placeholder="123" maxLength={4} />
                              {errors.cardCvc && <span className="error-text">CVC is required</span>}
                            </div>
                          </div>

                          <div className="form-group full-width">
                            <label>Name on Card *</label>
                            <input type="text" value={formData.cardName} onChange={(e) => setFormData({ ...formData, cardName: e.target.value })} className={errors.cardName ? 'error' : ''} placeholder="JOHN DOE" />
                            {errors.cardName && <span className="error-text">Name on card is required</span>}
                          </div>
                        </div>
                      )}

                      <div className="form-section">
                        <label className="checkbox-label">
                          <input type="checkbox" checked={formData.agreeTerms} onChange={(e) => setFormData({ ...formData, agreeTerms: e.target.checked })} />
                          <span>I agree to the <a href="/terms" target="_blank">Terms & Conditions</a> and <a href="/cancellation-policy" target="_blank">Cancellation Policy</a></span>
                        </label>
                        {errors.agreeTerms && <span className="error-text">You must agree to the terms</span>}
                      </div>

                      <div className="policy-box">
                        <div className="policy-icon">✅</div>
                        <div className="policy-content">
                          <strong>Cancellation Policy</strong>
                          <p>Free cancellation up to 24 hours before the experience starts</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Navigation Buttons */}
                  <div className="form-navigation">
                    {currentStep > 1 && <button className="btn btn-secondary" onClick={previousStep}>← Back</button>}
                    <button className="btn btn-primary" onClick={nextStep} disabled={isProcessing}>
                      {isProcessing && <span className="spinner"></span>}
                      {isProcessing ? 'Processing...' : currentStep === 3 ? 'Complete Booking ✓' : 'Continue →'}
                    </button>
                  </div>
                </>
              )}
            </div>

            {/* Summary Column */}
            <div className="summary-column">
              <div className="booking-summary">
                <div className="summary-header">
                  <img src={TOUR_CONFIG.image} alt="Tour" className="summary-image" />
                  <div className="summary-overlay">
                    <div className="tour-rating">
                      <span className="stars">★</span>
                      <span className="rating-value">{TOUR_CONFIG.rating}</span>
                      <span className="review-count">({TOUR_CONFIG.reviewCount} reviews)</span>
                    </div>
                  </div>
                </div>

                <div className="summary-content">
                  <h3 className="tour-title">{TOUR_CONFIG.title}</h3>
                  <p className="tour-operator">by Recharge Travels</p>

                  <div className="tour-meta">
                    <span className="meta-item">⏱️ {TOUR_CONFIG.duration}</span>
                    <span className="meta-item">👥 Private Tour</span>
                  </div>

                  <div className="summary-divider"></div>

                  <div className="summary-details">
                    <div className="detail-row">
                      <span className="detail-label">📅 Date</span>
                      <span className="detail-value">{formData.tourDate ? new Date(formData.tourDate).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }) : 'Not selected'}</span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-label">📍 Pickup</span>
                      <span className="detail-value">{selectedPickup?.label || 'Not selected'}<small>{selectedPickup?.time}</small></span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-label">👥 Travelers</span>
                      <span className="detail-value">{travelersText}</span>
                    </div>
                  </div>

                  <div className="summary-divider"></div>

                  <div className="summary-price">
                    <div className="price-row subtotal">
                      <span>Subtotal</span>
                      <span>${pricing.subtotal.toFixed(2)}</span>
                    </div>
                    {pricing.pickupCost > 0 && (
                      <div className="price-row">
                        <span>Pickup surcharge</span>
                        <span>${pricing.pickupCost.toFixed(2)}</span>
                      </div>
                    )}
                    <div className="price-row total">
                      <span>Total</span>
                      <span className="total-amount">${pricing.total.toFixed(2)}</span>
                    </div>
                  </div>

                  <div className="summary-highlights">
                    <h4>✨ Highlights</h4>
                    <ul>
                      {TOUR_CONFIG.highlights.slice(0, 3).map((h, i) => <li key={i}>{h}</li>)}
                    </ul>
                  </div>

                  <div className="summary-support">
                    <p>Need help? Contact us</p>
                    <a href="https://wa.me/94771234567" className="whatsapp-link">💬 WhatsApp Support</a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>

        {/* Footer */}
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
    </>
  );
};

export default PilgrimageBooking;
