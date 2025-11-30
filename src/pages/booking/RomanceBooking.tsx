import React, { useState, useMemo } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Heart, Calendar, Users, Phone, Mail, User, CheckCircle, ArrowRight, ArrowLeft, Shield, Check, Home, Printer, MapPin, Sparkles, MessageCircle } from 'lucide-react';
import { submitRomanceBooking } from '@/services/romanceService';

const COUNTRY_CODES = [
  { code: '+1', country: 'US/Canada' }, { code: '+44', country: 'UK' }, { code: '+61', country: 'Australia' },
  { code: '+49', country: 'Germany' }, { code: '+33', country: 'France' }, { code: '+91', country: 'India' },
  { code: '+94', country: 'Sri Lanka' }, { code: '+971', country: 'UAE' }, { code: '+65', country: 'Singapore' },
];

interface FormData {
  firstName: string; lastName: string; email: string; countryCode: string; phone: string; country: string;
  eventDate: string; guests: number; venue: string; specialRequests: string; addOns: string[];
  agreeTerms: boolean;
}

const RomanceBooking: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  const bookingType = (searchParams.get('type') || 'wedding') as 'wedding' | 'honeymoon';
  const packageId = searchParams.get('packageId') || '';
  const packageName = searchParams.get('package') || (bookingType === 'wedding' ? 'Wedding Package' : 'Honeymoon Package');
  const packagePrice = parseInt(searchParams.get('price') || '0');
  const packageImage = searchParams.get('image') || 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=800';
  const weddingType = searchParams.get('weddingType') || '';
  const nights = parseInt(searchParams.get('nights') || '7');
  const venues = (searchParams.get('venues') || '').split(',').filter(Boolean);

  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingRef, setBookingRef] = useState('');
  const [errors, setErrors] = useState<Record<string, boolean>>({});

  const [formData, setFormData] = useState<FormData>({
    firstName: '', lastName: '', email: '', countryCode: '+1', phone: '', country: '',
    eventDate: '', guests: bookingType === 'wedding' ? 50 : 2, venue: venues[0] || '',
    specialRequests: '', addOns: [], agreeTerms: false,
  });

  const addOnOptions = bookingType === 'wedding' 
    ? [{ id: 'photo', label: 'Professional Photography', price: 500 }, { id: 'video', label: 'Videography', price: 800 }, { id: 'drone', label: 'Drone Coverage', price: 300 }, { id: 'flowers', label: 'Premium Flowers', price: 400 }, { id: 'cake', label: 'Wedding Cake', price: 350 }, { id: 'music', label: 'Live Band', price: 600 }]
    : [{ id: 'spa', label: 'Couples Spa Package', price: 200 }, { id: 'dinner', label: 'Private Candlelit Dinner', price: 150 }, { id: 'cruise', label: 'Sunset Cruise', price: 250 }, { id: 'tour', label: 'Private Day Tour', price: 180 }, { id: 'upgrade', label: 'Room Upgrade', price: 300 }];

  const availableDates = useMemo(() => {
    const dates = [];
    const today = new Date();
    const daysAhead = bookingType === 'wedding' ? 180 : 14;
    for (let i = daysAhead; i <= (bookingType === 'wedding' ? 365 : 180); i++) {
      const date = new Date(today); date.setDate(date.getDate() + i);
      dates.push({ value: date.toISOString().split('T')[0], label: date.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) });
    }
    return dates;
  }, [bookingType]);

  const calculateTotal = () => {
    const addOnsTotal = formData.addOns.reduce((sum, id) => sum + (addOnOptions.find(a => a.id === id)?.price || 0), 0);
    const basePrice = packagePrice || (bookingType === 'wedding' ? 5000 : 2500);
    return { basePrice, addOnsTotal, total: basePrice + addOnsTotal };
  };
  const pricing = calculateTotal();

  const updateField = (field: keyof FormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: false }));
  };

  const toggleAddOn = (id: string) => {
    setFormData(prev => ({ ...prev, addOns: prev.addOns.includes(id) ? prev.addOns.filter(a => a !== id) : [...prev.addOns, id] }));
  };

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, boolean> = {};
    if (step === 1) {
      if (!formData.firstName.trim()) newErrors.firstName = true;
      if (!formData.lastName.trim()) newErrors.lastName = true;
      if (!formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) newErrors.email = true;
      if (!formData.phone.trim()) newErrors.phone = true;
      if (!formData.country.trim()) newErrors.country = true;
    }
    if (step === 2) {
      if (!formData.eventDate) newErrors.eventDate = true;
      if (formData.guests < 1) newErrors.guests = true;
    }
    if (step === 3) {
      if (!formData.agreeTerms) newErrors.agreeTerms = true;
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => { if (validateStep(currentStep)) { setCurrentStep(prev => prev + 1); window.scrollTo({ top: 0, behavior: 'smooth' }); } };
  const prevStep = () => { setCurrentStep(prev => prev - 1); window.scrollTo({ top: 0, behavior: 'smooth' }); };

  const submitBooking = async () => {
    if (!validateStep(3)) return;
    setIsSubmitting(true);
    
    const result = await submitRomanceBooking({
      bookingRef: '', type: bookingType, packageId, packageName, packagePrice: pricing.basePrice,
      firstName: formData.firstName, lastName: formData.lastName, email: formData.email,
      phone: `${formData.countryCode} ${formData.phone}`, country: formData.country,
      eventDate: formData.eventDate, guests: formData.guests, weddingType, venue: formData.venue,
      nights: bookingType === 'honeymoon' ? nights : undefined, specialRequests: formData.specialRequests,
      addOns: formData.addOns, status: 'pending', totalAmount: pricing.total,
    });

    if (result.success) {
      setBookingRef(result.bookingRef);
      setCurrentStep(4);
    }
    setIsSubmitting(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const isWedding = bookingType === 'wedding';
  const themeColor = isWedding ? '#be185d' : '#e11d48';
  const themeBg = isWedding ? 'linear-gradient(135deg, #fdf2f8 0%, #fce7f3 100%)' : 'linear-gradient(135deg, #fff1f2 0%, #ffe4e6 100%)';

  return (
    <div className="min-h-screen" style={{ fontFamily: "'DM Sans', sans-serif", background: themeBg, color: '#1a1a1a' }}>
      <Helmet><title>Book {packageName} - Recharge Travels</title></Helmet>

      <header className="bg-white border-b border-pink-100 sticky top-0 z-50">
        <div className="max-w-[1200px] mx-auto px-6 py-4 flex justify-between items-center">
          <Link to="/" className="flex items-center gap-2 font-bold text-xl no-underline" style={{ color: themeColor }}>
            <Heart className="w-6 h-6" fill={themeColor} /><span>Recharge Travels</span>
          </Link>
          <div className="flex items-center gap-2 text-sm px-4 py-2 rounded-full" style={{ background: '#fce7f3', color: themeColor }}>
            <Shield className="w-4 h-4" />Secure Booking
          </div>
        </div>
      </header>

      <main className="max-w-[1200px] mx-auto px-6 py-8">
        {currentStep < 4 && (
          <div className="mb-8">
            <div className="flex justify-center gap-4 relative">
              <div className="absolute top-5 left-1/4 right-1/4 h-0.5 bg-pink-200 -z-0" />
              {[{ num: 1, label: 'Contact Details' }, { num: 2, label: `${isWedding ? 'Wedding' : 'Trip'} Details` }, { num: 3, label: 'Review & Confirm' }].map(step => (
                <div key={step.num} className="flex flex-col items-center gap-2 z-10 flex-1 max-w-[200px]">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all ${currentStep === step.num ? 'text-white' : currentStep > step.num ? 'bg-green-500 text-white' : 'bg-white border-2 border-pink-200 text-pink-300'}`} style={currentStep === step.num ? { background: themeColor } : {}}>
                    {currentStep > step.num ? <Check className="w-5 h-5" /> : step.num}
                  </div>
                  <span className={`text-sm text-center ${currentStep === step.num ? 'font-semibold' : 'text-gray-500'}`} style={currentStep === step.num ? { color: themeColor } : {}}>{step.label}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-8 items-start">
          <div className="bg-white rounded-2xl p-8 shadow-lg">
            {/* STEP 1 */}
            {currentStep === 1 && (
              <div>
                <h2 className="text-2xl font-bold mb-2" style={{ color: themeColor }}>Contact Details</h2>
                <p className="text-gray-500 mb-6">We'll use this to send your confirmation and updates.</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">First Name *</label>
                    <input type="text" value={formData.firstName} onChange={e => updateField('firstName', e.target.value)} placeholder="Your first name" className={`w-full px-4 py-3 border-2 rounded-xl ${errors.firstName ? 'border-red-500' : 'border-gray-200'} focus:outline-none focus:border-pink-400`} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Last Name *</label>
                    <input type="text" value={formData.lastName} onChange={e => updateField('lastName', e.target.value)} placeholder="Your last name" className={`w-full px-4 py-3 border-2 rounded-xl ${errors.lastName ? 'border-red-500' : 'border-gray-200'} focus:outline-none focus:border-pink-400`} />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium mb-2">Email *</label>
                    <input type="email" value={formData.email} onChange={e => updateField('email', e.target.value)} placeholder="your@email.com" className={`w-full px-4 py-3 border-2 rounded-xl ${errors.email ? 'border-red-500' : 'border-gray-200'} focus:outline-none focus:border-pink-400`} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Phone *</label>
                    <div className="flex gap-2">
                      <select value={formData.countryCode} onChange={e => updateField('countryCode', e.target.value)} className="px-3 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-pink-400">
                        {COUNTRY_CODES.map(c => <option key={c.code} value={c.code}>{c.code}</option>)}
                      </select>
                      <input type="tel" value={formData.phone} onChange={e => updateField('phone', e.target.value)} placeholder="Phone number" className={`flex-1 px-4 py-3 border-2 rounded-xl ${errors.phone ? 'border-red-500' : 'border-gray-200'} focus:outline-none focus:border-pink-400`} />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Country *</label>
                    <input type="text" value={formData.country} onChange={e => updateField('country', e.target.value)} placeholder="Your country" className={`w-full px-4 py-3 border-2 rounded-xl ${errors.country ? 'border-red-500' : 'border-gray-200'} focus:outline-none focus:border-pink-400`} />
                  </div>
                </div>
                <div className="flex justify-end mt-8">
                  <button onClick={nextStep} className="flex items-center gap-2 px-8 py-3 text-white font-semibold rounded-xl transition-all hover:opacity-90" style={{ background: themeColor }}>
                    Continue <ArrowRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 2 */}
            {currentStep === 2 && (
              <div>
                <h2 className="text-2xl font-bold mb-2" style={{ color: themeColor }}>{isWedding ? 'Wedding' : 'Trip'} Details</h2>
                <p className="text-gray-500 mb-6">Tell us about your {isWedding ? 'special day' : 'romantic getaway'}.</p>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">{isWedding ? 'Wedding Date' : 'Check-in Date'} *</label>
                    <select value={formData.eventDate} onChange={e => updateField('eventDate', e.target.value)} className={`w-full px-4 py-3 border-2 rounded-xl ${errors.eventDate ? 'border-red-500' : 'border-gray-200'} focus:outline-none focus:border-pink-400`}>
                      <option value="">Select a date</option>
                      {availableDates.map(d => <option key={d.value} value={d.value}>{d.label}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">{isWedding ? 'Number of Guests' : 'Travelers'} *</label>
                    <div className="flex items-center gap-4">
                      <button onClick={() => updateField('guests', Math.max(isWedding ? 2 : 1, formData.guests - (isWedding ? 10 : 1)))} className="w-10 h-10 rounded-full border-2 border-gray-200 flex items-center justify-center text-xl hover:border-pink-400">-</button>
                      <span className="text-2xl font-semibold w-20 text-center">{formData.guests}</span>
                      <button onClick={() => updateField('guests', Math.min(isWedding ? 200 : 10, formData.guests + (isWedding ? 10 : 1)))} className="w-10 h-10 rounded-full border-2 border-gray-200 flex items-center justify-center text-xl hover:border-pink-400">+</button>
                    </div>
                  </div>
                  {isWedding && venues.length > 0 && (
                    <div>
                      <label className="block text-sm font-medium mb-2">Preferred Venue</label>
                      <select value={formData.venue} onChange={e => updateField('venue', e.target.value)} className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-pink-400">
                        {venues.map(v => <option key={v} value={v}>{v}</option>)}
                      </select>
                    </div>
                  )}
                  <div>
                    <label className="block text-sm font-medium mb-3">Optional Add-Ons</label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {addOnOptions.map(addon => (
                        <label key={addon.id} className={`flex items-center gap-3 p-4 border-2 rounded-xl cursor-pointer transition-all ${formData.addOns.includes(addon.id) ? 'border-pink-400 bg-pink-50' : 'border-gray-200 hover:border-pink-200'}`}>
                          <input type="checkbox" checked={formData.addOns.includes(addon.id)} onChange={() => toggleAddOn(addon.id)} className="w-5 h-5 accent-pink-500" />
                          <div className="flex-1"><div className="font-medium">{addon.label}</div><div className="text-sm text-gray-500">+${addon.price}</div></div>
                        </label>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Special Requests</label>
                    <textarea value={formData.specialRequests} onChange={e => updateField('specialRequests', e.target.value)} rows={3} placeholder={isWedding ? 'Any specific requirements for your wedding...' : 'Any special requests for your honeymoon...'} className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl resize-none focus:outline-none focus:border-pink-400" />
                  </div>
                </div>
                <div className="flex justify-between mt-8">
                  <button onClick={prevStep} className="flex items-center gap-2 px-6 py-3 border-2 border-gray-200 rounded-xl hover:bg-gray-50"><ArrowLeft className="w-5 h-5" /> Back</button>
                  <button onClick={nextStep} className="flex items-center gap-2 px-8 py-3 text-white font-semibold rounded-xl hover:opacity-90" style={{ background: themeColor }}>Continue <ArrowRight className="w-5 h-5" /></button>
                </div>
              </div>
            )}

            {/* STEP 3 */}
            {currentStep === 3 && (
              <div>
                <h2 className="text-2xl font-bold mb-2" style={{ color: themeColor }}>Review Your Booking</h2>
                <p className="text-gray-500 mb-6">Please review all details before confirming.</p>
                <div className="space-y-6">
                  <div className="bg-pink-50 rounded-xl p-6">
                    <h3 className="font-semibold mb-4">Contact Information</h3>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div><span className="text-gray-500">Name:</span> {formData.firstName} {formData.lastName}</div>
                      <div><span className="text-gray-500">Email:</span> {formData.email}</div>
                      <div><span className="text-gray-500">Phone:</span> {formData.countryCode} {formData.phone}</div>
                      <div><span className="text-gray-500">Country:</span> {formData.country}</div>
                    </div>
                  </div>
                  <div className="bg-pink-50 rounded-xl p-6">
                    <h3 className="font-semibold mb-4">{isWedding ? 'Wedding' : 'Trip'} Details</h3>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div><span className="text-gray-500">Date:</span> {formData.eventDate}</div>
                      <div><span className="text-gray-500">{isWedding ? 'Guests' : 'Travelers'}:</span> {formData.guests}</div>
                      {isWedding && formData.venue && <div><span className="text-gray-500">Venue:</span> {formData.venue}</div>}
                      {!isWedding && <div><span className="text-gray-500">Nights:</span> {nights}</div>}
                    </div>
                    {formData.addOns.length > 0 && <div className="mt-4"><span className="text-gray-500">Add-ons:</span> {formData.addOns.map(id => addOnOptions.find(a => a.id === id)?.label).join(', ')}</div>}
                    {formData.specialRequests && <div className="mt-4"><span className="text-gray-500">Special Requests:</span> {formData.specialRequests}</div>}
                  </div>
                  <label className={`flex items-start gap-3 p-4 border-2 rounded-xl cursor-pointer ${errors.agreeTerms ? 'border-red-500' : 'border-gray-200'}`}>
                    <input type="checkbox" checked={formData.agreeTerms} onChange={e => updateField('agreeTerms', e.target.checked)} className="w-5 h-5 mt-0.5 accent-pink-500" />
                    <span className="text-sm">I agree to the <a href="#" className="underline" style={{ color: themeColor }}>Terms & Conditions</a> and <a href="#" className="underline" style={{ color: themeColor }}>Privacy Policy</a>. I understand this is a booking enquiry and final confirmation will be provided by the team.</span>
                  </label>
                </div>
                <div className="flex justify-between mt-8">
                  <button onClick={prevStep} className="flex items-center gap-2 px-6 py-3 border-2 border-gray-200 rounded-xl hover:bg-gray-50"><ArrowLeft className="w-5 h-5" /> Back</button>
                  <button onClick={submitBooking} disabled={isSubmitting} className="flex items-center gap-2 px-8 py-3 text-white font-semibold rounded-xl hover:opacity-90 disabled:opacity-50" style={{ background: themeColor }}>
                    {isSubmitting ? 'Submitting...' : 'Confirm Booking'} <CheckCircle className="w-5 h-5" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 4 - CONFIRMATION */}
            {currentStep === 4 && (
              <div className="text-center py-8">
                <div className="w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center" style={{ background: themeColor }}>
                  <CheckCircle className="w-10 h-10 text-white" />
                </div>
                <h2 className="text-3xl font-bold mb-2" style={{ color: themeColor }}>Booking Submitted!</h2>
                <p className="text-gray-600 mb-6">Your {isWedding ? 'wedding' : 'honeymoon'} enquiry has been received.</p>
                <div className="bg-pink-50 rounded-xl p-6 mb-6 inline-block">
                  <p className="text-sm text-gray-500 mb-1">Booking Reference</p>
                  <p className="text-2xl font-bold" style={{ color: themeColor }}>{bookingRef}</p>
                </div>
                <p className="text-gray-600 mb-8">Our romance specialists will contact you within 24 hours to confirm details and discuss your requirements.</p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link to="/romance/honeymoons-weddings" className="flex items-center justify-center gap-2 px-6 py-3 border-2 rounded-xl hover:bg-gray-50" style={{ borderColor: themeColor, color: themeColor }}>
                    <Home className="w-5 h-5" /> Back to Romance
                  </Link>
                  <button onClick={() => window.open('https://wa.me/94777721999', '_blank')} className="flex items-center justify-center gap-2 px-6 py-3 text-white rounded-xl hover:opacity-90" style={{ background: themeColor }}>
                    <MessageCircle className="w-5 h-5" /> Chat on WhatsApp
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          {currentStep < 4 && (
            <div className="lg:sticky lg:top-24 space-y-6">
              <div className="bg-white rounded-2xl overflow-hidden shadow-lg">
                <img src={packageImage} alt={packageName} className="w-full h-48 object-cover" />
                <div className="p-6">
                  <div className="text-xs font-semibold uppercase tracking-wide mb-2" style={{ color: themeColor }}>{isWedding ? weddingType || 'Wedding' : 'Honeymoon'} Package</div>
                  <h3 className="text-xl font-bold mb-4">{packageName}</h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between"><span className="text-gray-500">Package Price</span><span className="font-semibold">${pricing.basePrice.toLocaleString()}</span></div>
                    {formData.addOns.length > 0 && <div className="flex justify-between"><span className="text-gray-500">Add-ons</span><span className="font-semibold">+${pricing.addOnsTotal.toLocaleString()}</span></div>}
                    <div className="border-t pt-3 flex justify-between text-lg"><span className="font-bold">Total</span><span className="font-bold" style={{ color: themeColor }}>${pricing.total.toLocaleString()}</span></div>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-2xl p-6 shadow-lg">
                <h4 className="font-semibold mb-4 flex items-center gap-2"><Sparkles className="w-5 h-5" style={{ color: themeColor }} />What's Next?</h4>
                <ul className="space-y-3 text-sm text-gray-600">
                  <li className="flex items-start gap-2"><Check className="w-4 h-4 mt-0.5 text-green-500" />Submit your booking enquiry</li>
                  <li className="flex items-start gap-2"><Check className="w-4 h-4 mt-0.5 text-green-500" />Our team reviews within 24hrs</li>
                  <li className="flex items-start gap-2"><Check className="w-4 h-4 mt-0.5 text-green-500" />Receive detailed quote & itinerary</li>
                  <li className="flex items-start gap-2"><Check className="w-4 h-4 mt-0.5 text-green-500" />Confirm & pay deposit</li>
                </ul>
              </div>
              <div className="text-center text-sm text-gray-500">
                <p>Need help? <a href="tel:+94777721999" className="font-semibold" style={{ color: themeColor }}>+94 777 721 999</a></p>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default RomanceBooking;
