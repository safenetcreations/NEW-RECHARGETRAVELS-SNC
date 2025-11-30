import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Check, CreditCard, Calendar, Users, MapPin,
    ChevronRight, ChevronLeft, Loader2, Shield,
    MessageCircle, Star, Clock, Info
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/contexts/AuthContext';

interface TourConfig {
    id: string;
    title: string;
    image: string;
    price: number;
    duration: string;
    rating: number;
    reviews: number;
    highlights?: string[];
    pickupOptions?: { id: string; label: string; time: string; additionalCost: number }[];
}

interface BookingWizardProps {
    tour: TourConfig;
    onClose: () => void;
}

export const BookingWizard: React.FC<BookingWizardProps> = ({ tour, onClose }) => {
    const { user } = useAuth();
    const { toast } = useToast();
    const [currentStep, setCurrentStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [bookingRef, setBookingRef] = useState<string | null>(null);

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: user?.email || '',
        countryCode: '+94',
        phone: '',
        tourDate: '',
        pickupOption: tour.pickupOptions?.[0]?.id || 'default',
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
        agreeTerms: false
    });

    // Calculate totals
    const getPricing = () => {
        const pickup = tour.pickupOptions?.find(p => p.id === formData.pickupOption);
        const pickupCost = (pickup?.additionalCost || 0) * (formData.adults + formData.children);

        // Assuming child price is 50% of adult price for now, or use tour specific if available
        const childPrice = tour.price * 0.5;

        const subtotal =
            (formData.adults * tour.price) +
            (formData.children * childPrice);

        return {
            subtotal,
            pickupCost,
            total: subtotal + pickupCost,
            childPrice
        };
    };

    const pricing = getPricing();

    const handleInputChange = (field: string, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const updateCount = (type: 'adults' | 'children' | 'infants', delta: number) => {
        setFormData(prev => ({
            ...prev,
            [type]: Math.max(type === 'adults' ? 1 : 0, prev[type] + delta)
        }));
    };

    const validateStep = (step: number) => {
        if (step === 1) {
            return formData.firstName && formData.lastName && formData.email && formData.phone;
        }
        if (step === 2) {
            return formData.tourDate;
        }
        if (step === 3) {
            if (formData.paymentMethod === 'card') {
                return formData.cardNumber && formData.cardExpiry && formData.cardCvc && formData.cardName && formData.agreeTerms;
            }
            return formData.agreeTerms;
        }
        return true;
    };

    const handleNext = () => {
        if (validateStep(currentStep)) {
            setCurrentStep(prev => prev + 1);
        } else {
            toast({
                title: "Validation Error",
                description: "Please fill in all required fields",
                variant: "destructive"
            });
        }
    };

    const handleSubmit = async () => {
        if (!validateStep(3)) return;

        setLoading(true);
        try {
            // Create booking in Firestore
            const bookingData = {
                tourId: tour.id,
                tourTitle: tour.title,
                userId: user?.uid || 'guest',
                ...formData,
                totalPrice: pricing.total,
                status: 'confirmed',
                createdAt: Timestamp.now(),
                bookingRef: `RT-${Date.now().toString(36).toUpperCase()}`
            };

            const docRef = await addDoc(collection(db, 'cultural_bookings'), bookingData);
            setBookingRef(bookingData.bookingRef);

            // Move to confirmation step
            setCurrentStep(4);
        } catch (error) {
            console.error('Booking error:', error);
            toast({
                title: "Booking Failed",
                description: "There was an error processing your booking. Please try again.",
                variant: "destructive"
            });
        } finally {
            setLoading(false);
        }
    };

    // Render Steps
    const renderStep1 = () => (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="space-y-2">
                <h2 className="text-2xl font-serif text-[#0d5c46]">Contact Details</h2>
                <p className="text-gray-600">We'll use this information to send you confirmation.</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label>First Name *</Label>
                    <Input
                        value={formData.firstName}
                        onChange={(e) => handleInputChange('firstName', e.target.value)}
                        placeholder="Enter your first name"
                        className="border-gray-300 focus:border-[#0d5c46]"
                    />
                </div>
                <div className="space-y-2">
                    <Label>Last Name *</Label>
                    <Input
                        value={formData.lastName}
                        onChange={(e) => handleInputChange('lastName', e.target.value)}
                        placeholder="Enter your last name"
                        className="border-gray-300 focus:border-[#0d5c46]"
                    />
                </div>
                <div className="col-span-2 space-y-2">
                    <Label>Email Address *</Label>
                    <Input
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        placeholder="your.email@example.com"
                        className="border-gray-300 focus:border-[#0d5c46]"
                    />
                </div>
                <div className="col-span-2 space-y-2">
                    <Label>Phone Number *</Label>
                    <div className="flex gap-2">
                        <Select
                            value={formData.countryCode}
                            onValueChange={(val) => handleInputChange('countryCode', val)}
                        >
                            <SelectTrigger className="w-[120px]">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="bg-white">
                                <SelectItem value="+94">🇱🇰 +94</SelectItem>
                                <SelectItem value="+1">🇺🇸 +1</SelectItem>
                                <SelectItem value="+44">🇬🇧 +44</SelectItem>
                                <SelectItem value="+61">🇦🇺 +61</SelectItem>
                            </SelectContent>
                        </Select>
                        <Input
                            type="tel"
                            value={formData.phone}
                            onChange={(e) => handleInputChange('phone', e.target.value)}
                            placeholder="77 123 4567"
                            className="flex-1 border-gray-300 focus:border-[#0d5c46]"
                        />
                    </div>
                </div>
            </div>
        </div>
    );

    const renderStep2 = () => (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="space-y-2">
                <h2 className="text-2xl font-serif text-[#0d5c46]">Activity Details</h2>
                <p className="text-gray-600">Select your preferred date and group size.</p>
            </div>

            <div className="space-y-4">
                <div className="space-y-2">
                    <Label>Select Date *</Label>
                    <Input
                        type="date"
                        value={formData.tourDate}
                        onChange={(e) => handleInputChange('tourDate', e.target.value)}
                        min={new Date().toISOString().split('T')[0]}
                        className="border-gray-300 focus:border-[#0d5c46]"
                    />
                </div>

                {tour.pickupOptions && tour.pickupOptions.length > 0 && (
                    <div className="space-y-2">
                        <Label>Pickup Location</Label>
                        <div className="grid gap-2">
                            {tour.pickupOptions.map((opt) => (
                                <div
                                    key={opt.id}
                                    onClick={() => handleInputChange('pickupOption', opt.id)}
                                    className={`flex items-center justify-between p-3 border rounded-lg cursor-pointer transition-all ${formData.pickupOption === opt.id
                                        ? 'border-[#0d5c46] bg-green-50'
                                        : 'border-gray-200 hover:border-[#0d5c46]'
                                        }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${formData.pickupOption === opt.id ? 'border-[#0d5c46]' : 'border-gray-400'
                                            }`}>
                                            {formData.pickupOption === opt.id && <div className="w-2 h-2 rounded-full bg-[#0d5c46]" />}
                                        </div>
                                        <div>
                                            <div className="font-medium">{opt.label}</div>
                                            <div className="text-xs text-gray-500">Pickup: {opt.time}</div>
                                        </div>
                                    </div>
                                    {opt.additionalCost > 0 && (
                                        <div className="text-sm font-medium text-[#0d5c46]">
                                            +${opt.additionalCost}/pp
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                <div className="space-y-2">
                    <Label>Pickup Address</Label>
                    <Input
                        value={formData.pickupAddress}
                        onChange={(e) => handleInputChange('pickupAddress', e.target.value)}
                        placeholder="Enter your hotel name or address"
                        className="border-gray-300 focus:border-[#0d5c46]"
                    />
                </div>

                <div className="space-y-4 pt-4 border-t">
                    <h3 className="font-medium">Number of Travelers</h3>

                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                            <div className="font-medium">Adults</div>
                            <div className="text-xs text-gray-500">Age 13+</div>
                        </div>
                        <div className="flex items-center gap-4">
                            <span className="font-medium text-[#0d5c46]">${tour.price}</span>
                            <div className="flex items-center gap-3">
                                <button
                                    onClick={() => updateCount('adults', -1)}
                                    className="w-8 h-8 rounded-full border border-[#0d5c46] text-[#0d5c46] flex items-center justify-center hover:bg-[#0d5c46] hover:text-white transition-colors"
                                >-</button>
                                <span className="w-4 text-center font-medium">{formData.adults}</span>
                                <button
                                    onClick={() => updateCount('adults', 1)}
                                    className="w-8 h-8 rounded-full border border-[#0d5c46] text-[#0d5c46] flex items-center justify-center hover:bg-[#0d5c46] hover:text-white transition-colors"
                                >+</button>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                            <div className="font-medium">Children</div>
                            <div className="text-xs text-gray-500">Age 3-12</div>
                        </div>
                        <div className="flex items-center gap-4">
                            <span className="font-medium text-[#0d5c46]">${pricing.childPrice}</span>
                            <div className="flex items-center gap-3">
                                <button
                                    onClick={() => updateCount('children', -1)}
                                    className="w-8 h-8 rounded-full border border-[#0d5c46] text-[#0d5c46] flex items-center justify-center hover:bg-[#0d5c46] hover:text-white transition-colors"
                                >-</button>
                                <span className="w-4 text-center font-medium">{formData.children}</span>
                                <button
                                    onClick={() => updateCount('children', 1)}
                                    className="w-8 h-8 rounded-full border border-[#0d5c46] text-[#0d5c46] flex items-center justify-center hover:bg-[#0d5c46] hover:text-white transition-colors"
                                >+</button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="space-y-2">
                    <Label>Special Requests</Label>
                    <Textarea
                        value={formData.specialRequests}
                        onChange={(e) => handleInputChange('specialRequests', e.target.value)}
                        placeholder="Dietary requirements, mobility needs, etc..."
                        className="border-gray-300 focus:border-[#0d5c46]"
                    />
                </div>
            </div>
        </div>
    );

    const renderStep3 = () => (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="space-y-2">
                <h2 className="text-2xl font-serif text-[#0d5c46]">Payment Details</h2>
                <p className="text-gray-600">Secure your booking with a payment method.</p>
            </div>

            <div className="bg-gray-50 p-4 rounded-xl space-y-3">
                <h3 className="font-medium mb-2">Price Breakdown</h3>
                <div className="flex justify-between text-sm">
                    <span>Adults x {formData.adults}</span>
                    <span>${formData.adults * tour.price}</span>
                </div>
                {formData.children > 0 && (
                    <div className="flex justify-between text-sm">
                        <span>Children x {formData.children}</span>
                        <span>${formData.children * pricing.childPrice}</span>
                    </div>
                )}
                {pricing.pickupCost > 0 && (
                    <div className="flex justify-between text-sm text-gray-600">
                        <span>Pickup Surcharge</span>
                        <span>${pricing.pickupCost}</span>
                    </div>
                )}
                <div className="flex justify-between font-bold text-lg pt-3 border-t border-gray-200 text-[#0d5c46]">
                    <span>Total</span>
                    <span>${pricing.total}</span>
                </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
                {['card', 'paypal', 'bank'].map((method) => (
                    <div
                        key={method}
                        onClick={() => handleInputChange('paymentMethod', method)}
                        className={`p-3 border rounded-lg cursor-pointer text-center transition-all ${formData.paymentMethod === method
                            ? 'border-[#0d5c46] bg-green-50'
                            : 'border-gray-200 hover:border-[#0d5c46]'
                            }`}
                    >
                        <div className="text-xl mb-1">
                            {method === 'card' && '💳'}
                            {method === 'paypal' && '🅿️'}
                            {method === 'bank' && '🏦'}
                        </div>
                        <div className="text-xs font-medium capitalize">{method}</div>
                    </div>
                ))}
            </div>

            {formData.paymentMethod === 'card' && (
                <div className="space-y-4 p-4 border rounded-xl bg-white">
                    <div className="space-y-2">
                        <Label>Card Number</Label>
                        <Input
                            value={formData.cardNumber}
                            onChange={(e) => handleInputChange('cardNumber', e.target.value)}
                            placeholder="0000 0000 0000 0000"
                            maxLength={19}
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Expiry</Label>
                            <Input
                                value={formData.cardExpiry}
                                onChange={(e) => handleInputChange('cardExpiry', e.target.value)}
                                placeholder="MM/YY"
                                maxLength={5}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>CVC</Label>
                            <Input
                                value={formData.cardCvc}
                                onChange={(e) => handleInputChange('cardCvc', e.target.value)}
                                placeholder="123"
                                maxLength={4}
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label>Name on Card</Label>
                        <Input
                            value={formData.cardName}
                            onChange={(e) => handleInputChange('cardName', e.target.value)}
                            placeholder="JOHN DOE"
                        />
                    </div>
                </div>
            )}

            <div className="flex items-start gap-2 pt-2">
                <Checkbox
                    id="terms"
                    checked={formData.agreeTerms}
                    onCheckedChange={(checked) => handleInputChange('agreeTerms', checked)}
                />
                <label htmlFor="terms" className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    I agree to the Terms & Conditions and Cancellation Policy
                </label>
            </div>

            <div className="flex items-center gap-2 p-3 bg-green-50 rounded-lg text-sm text-green-800">
                <Shield className="w-4 h-4" />
                <span>Free cancellation up to 24 hours before the experience starts</span>
            </div>
        </div>
    );

    const renderConfirmation = () => (
        <div className="text-center space-y-6 py-8 animate-in zoom-in duration-500">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto text-green-600">
                <Check className="w-10 h-10" />
            </div>

            <div>
                <h2 className="text-3xl font-serif text-[#0d5c46] mb-2">Booking Confirmed!</h2>
                <p className="text-gray-600">Reference: <span className="font-mono font-bold text-black">{bookingRef}</span></p>
            </div>

            <div className="bg-gray-50 p-6 rounded-xl text-left max-w-md mx-auto space-y-4">
                <div className="flex justify-between border-b pb-2">
                    <span className="text-gray-600">Date</span>
                    <span className="font-medium">{formData.tourDate}</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                    <span className="text-gray-600">Travelers</span>
                    <span className="font-medium">{formData.adults} Adults, {formData.children} Kids</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                    <span className="text-gray-600">Total Paid</span>
                    <span className="font-medium text-[#0d5c46]">${pricing.total}</span>
                </div>
                <div className="pt-2 text-sm text-gray-500 text-center">
                    A confirmation email has been sent to {formData.email}
                </div>
            </div>

            <div className="flex justify-center gap-4">
                <Button variant="outline" onClick={() => window.print()}>
                    Print Confirmation
                </Button>
                <Button onClick={onClose} className="bg-[#0d5c46] hover:bg-[#0a4a38]">
                    Done
                </Button>
            </div>
        </div>
    );

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 overflow-y-auto">
            <div className="bg-white rounded-2xl w-full max-w-5xl min-h-[600px] shadow-2xl flex flex-col md:flex-row overflow-hidden">

                {/* Left Side - Form */}
                <div className="flex-1 p-6 md:p-8 flex flex-col">
                    {currentStep < 4 && (
                        <div className="mb-8">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex gap-2">
                                    {[1, 2, 3].map(step => (
                                        <div
                                            key={step}
                                            className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${step === currentStep
                                                ? 'bg-[#0d5c46] text-white'
                                                : step < currentStep
                                                    ? 'bg-green-100 text-green-800'
                                                    : 'bg-gray-100 text-gray-400'
                                                }`}
                                        >
                                            {step < currentStep ? <Check className="w-4 h-4" /> : step}
                                        </div>
                                    ))}
                                </div>
                                <Button variant="ghost" size="icon" onClick={onClose}>
                                    <Check className="w-5 h-5 rotate-45" /> {/* X icon workaround */}
                                </Button>
                            </div>
                        </div>
                    )}

                    <div className="flex-1">
                        {currentStep === 1 && renderStep1()}
                        {currentStep === 2 && renderStep2()}
                        {currentStep === 3 && renderStep3()}
                        {currentStep === 4 && renderConfirmation()}
                    </div>

                    {currentStep < 4 && (
                        <div className="flex justify-between mt-8 pt-6 border-t">
                            <Button
                                variant="outline"
                                onClick={() => currentStep === 1 ? onClose() : setCurrentStep(prev => prev - 1)}
                            >
                                {currentStep === 1 ? 'Cancel' : 'Back'}
                            </Button>

                            <Button
                                onClick={currentStep === 3 ? handleSubmit : handleNext}
                                disabled={loading}
                                className="bg-[#0d5c46] hover:bg-[#0a4a38] min-w-[120px]"
                            >
                                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : (
                                    currentStep === 3 ? 'Complete Booking' : 'Continue'
                                )}
                            </Button>
                        </div>
                    )}
                </div>

                {/* Right Side - Summary */}
                <div className="w-full md:w-[380px] bg-gray-50 p-6 md:p-8 border-l border-gray-200 hidden md:block">
                    <div className="sticky top-8">
                        <div className="rounded-xl overflow-hidden mb-6 shadow-md">
                            <img src={tour.image} alt={tour.title} className="w-full h-48 object-cover" />
                            <div className="p-4 bg-white">
                                <div className="flex items-center gap-1 text-yellow-500 mb-1">
                                    <Star className="w-4 h-4 fill-current" />
                                    <span className="font-bold text-gray-900">{tour.rating}</span>
                                    <span className="text-gray-500 text-sm">({tour.reviews} reviews)</span>
                                </div>
                                <h3 className="font-serif font-bold text-lg leading-tight mb-2">{tour.title}</h3>
                                <div className="flex items-center gap-4 text-sm text-gray-600">
                                    <div className="flex items-center gap-1">
                                        <Clock className="w-4 h-4" />
                                        {tour.duration}
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Users className="w-4 h-4" />
                                        Private Tour
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                                <h4 className="font-medium mb-3">Booking Summary</h4>
                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Date</span>
                                        <span className="font-medium">{formData.tourDate || 'Not selected'}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Travelers</span>
                                        <span className="font-medium">{formData.adults} Adults, {formData.children} Kids</span>
                                    </div>
                                    <div className="pt-2 mt-2 border-t flex justify-between font-bold text-[#0d5c46]">
                                        <span>Total</span>
                                        <span>${pricing.total}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-green-50 p-4 rounded-xl border border-green-100">
                                <div className="flex items-start gap-3">
                                    <div className="p-2 bg-white rounded-full text-[#0d5c46]">
                                        <MessageCircle className="w-4 h-4" />
                                    </div>
                                    <div>
                                        <h4 className="font-medium text-sm text-[#0d5c46]">Need Help?</h4>
                                        <p className="text-xs text-green-700 mt-1">
                                            Our travel experts are available 24/7 to assist you.
                                        </p>
                                        <a href="#" className="text-xs font-bold text-[#0d5c46] mt-2 block hover:underline">
                                            Chat on WhatsApp
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
