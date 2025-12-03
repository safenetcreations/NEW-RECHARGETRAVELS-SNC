import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { WildTourFirestore } from '@/services/firebaseWildToursService';
import { EnhancedTourPackage } from '@/data/wildToursData';
import { CreditCard, Calendar, Lock, ShieldCheck } from 'lucide-react';
import { Label } from '@/components/ui/label';

interface BookingDialogProps {
    tour: WildTourFirestore | EnhancedTourPackage;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onBook: (data: any) => void;
}

export const BookingDialog = ({ tour, open, onOpenChange, onBook }: BookingDialogProps) => {
    const [step, setStep] = useState<'details' | 'payment'>('details');
    const [bookingData, setBookingData] = useState({
        date: '',
        guests: 2,
        contactName: '',
        contactEmail: '',
        contactPhone: '',
        country: '',
        pickupLocation: tour.location,
        specialRequests: ''
    });

    const [paymentData, setPaymentData] = useState({
        cardNumber: '',
        expiry: '',
        cvc: '',
        nameOnCard: ''
    });

    const totalPrice = tour.price * (bookingData.guests || 1);
    const holdingDeposit = Math.round(totalPrice * 0.2);

    const handleDetailsSubmit = () => {
        // Basic Validation
        if (!bookingData.date) {
            alert("Please select a date.");
            return;
        }
        if (!bookingData.contactName || !bookingData.contactEmail || !bookingData.contactPhone) {
            alert("Please fill in your contact details.");
            return;
        }
        if (!bookingData.guests || isNaN(bookingData.guests) || bookingData.guests < 1) {
            alert("Please enter a valid number of guests.");
            return;
        }

        setStep('payment');
    };

    const handleFinalSubmit = () => {
        // Basic Payment Validation (Simulation)
        if (!paymentData.cardNumber || !paymentData.expiry || !paymentData.cvc || !paymentData.nameOnCard) {
            alert("Please fill in payment details.");
            return;
        }

        onBook({
            tourId: tour.id,
            tourTitle: tour.title,
            ...bookingData,
            guests: Number(bookingData.guests),
            totalPrice,
            depositAmount: holdingDeposit,
            paymentStatus: 'paid_deposit', // Simulated
            paymentMethod: 'credit_card'
        });
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-5xl w-[95vw] max-h-[85vh] overflow-y-auto p-0 border-none bg-transparent shadow-none top-12 translate-y-0 sm:top-24">
                <div className="grid lg:grid-cols-[1.05fr_0.95fr] gap-0 rounded-3xl border border-emerald-100 bg-white/95 shadow-2xl">
                    {/* Left Side - Image & Summary */}
                    <div className="relative bg-gradient-to-b from-slate-50 to-white hidden lg:block">
                        <div className="relative h-full w-full overflow-hidden rounded-l-3xl">
                            <img
                                src={tour.image}
                                alt={tour.title}
                                className="h-full w-full object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                            <div className="absolute bottom-8 left-8 text-white">
                                <p className="text-sm uppercase tracking-widest mb-2 opacity-80">
                                    {step === 'details' ? 'Confirm Booking' : 'Secure Payment'}
                                </p>
                                <h3 className="text-3xl font-serif font-bold">{tour.title}</h3>
                                <div className="mt-4 space-y-1 opacity-90 text-sm">
                                    <p>Location: {tour.location}</p>
                                    <p>Duration: {tour.duration}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Side - Form */}
                    <div className="space-y-6 bg-white/90 p-6 lg:p-8">
                        <DialogHeader className="text-left space-y-2">
                            <DialogTitle className="text-2xl font-semibold text-slate-900">
                                {step === 'details' ? 'Reserve your spot' : 'Complete Payment'}
                            </DialogTitle>
                            <DialogDescription className="text-sm text-slate-500">
                                {step === 'details'
                                    ? 'Complete your reservation details below.'
                                    : 'Securely pay the deposit to confirm your booking.'}
                            </DialogDescription>
                        </DialogHeader>

                        {step === 'details' ? (
                            <div className="space-y-4">
                                <div className="grid gap-4 sm:grid-cols-2">
                                    <div className="space-y-2">
                                        <Label className="text-sm font-medium text-slate-600">Preferred date</Label>
                                        <Input
                                            type="date"
                                            value={bookingData.date}
                                            onChange={(e) => setBookingData({ ...bookingData, date: e.target.value })}
                                            className="rounded-xl bg-slate-50"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-sm font-medium text-slate-600">Guests</Label>
                                        <Input
                                            type="number"
                                            min="1"
                                            max={tour.maxParticipants || 20}
                                            value={bookingData.guests}
                                            onChange={(e) => setBookingData({ ...bookingData, guests: parseInt(e.target.value) || 0 })}
                                            className="rounded-xl bg-slate-50"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label className="text-sm font-medium text-slate-600">Full Name</Label>
                                    <Input
                                        placeholder="Your full name"
                                        value={bookingData.contactName}
                                        onChange={(e) => setBookingData({ ...bookingData, contactName: e.target.value })}
                                        className="rounded-xl bg-slate-50"
                                    />
                                </div>

                                <div className="grid gap-4 sm:grid-cols-2">
                                    <div className="space-y-2">
                                        <Label className="text-sm font-medium text-slate-600">Email</Label>
                                        <Input
                                            type="email"
                                            placeholder="you@email.com"
                                            value={bookingData.contactEmail}
                                            onChange={(e) => setBookingData({ ...bookingData, contactEmail: e.target.value })}
                                            className="rounded-xl bg-slate-50"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-sm font-medium text-slate-600">Phone</Label>
                                        <Input
                                            type="tel"
                                            placeholder="+94..."
                                            value={bookingData.contactPhone}
                                            onChange={(e) => setBookingData({ ...bookingData, contactPhone: e.target.value })}
                                            className="rounded-xl bg-slate-50"
                                        />
                                    </div>
                                </div>

                                <div className="grid gap-4 sm:grid-cols-2">
                                    <div className="space-y-2">
                                        <Label className="text-sm font-medium text-slate-600">Country</Label>
                                        <Input
                                            placeholder="Your Country"
                                            value={bookingData.country}
                                            onChange={(e) => setBookingData({ ...bookingData, country: e.target.value })}
                                            className="rounded-xl bg-slate-50"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-sm font-medium text-slate-600">Pickup Location</Label>
                                        <Input
                                            placeholder="Hotel or Airport"
                                            value={bookingData.pickupLocation}
                                            onChange={(e) => setBookingData({ ...bookingData, pickupLocation: e.target.value })}
                                            className="rounded-xl bg-slate-50"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label className="text-sm font-medium text-slate-600">Special Requests</Label>
                                    <Textarea
                                        placeholder="Dietary requirements, etc."
                                        value={bookingData.specialRequests}
                                        onChange={(e) => setBookingData({ ...bookingData, specialRequests: e.target.value })}
                                        className="rounded-xl bg-slate-50"
                                    />
                                </div>

                                <div className="bg-slate-50 p-4 rounded-xl space-y-2 mt-4">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-slate-600">Total Price</span>
                                        <span className="font-semibold">${totalPrice}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-slate-600">Deposit Required (20%)</span>
                                        <span className="font-bold text-green-600">${holdingDeposit}</span>
                                    </div>
                                </div>

                                <Button
                                    className="w-full py-6 text-lg font-semibold bg-green-600 hover:bg-green-700 rounded-xl mt-4"
                                    onClick={handleDetailsSubmit}
                                >
                                    Proceed to Payment
                                </Button>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-sm text-slate-600">Amount to Pay</span>
                                        <span className="text-2xl font-bold text-green-600">${holdingDeposit}</span>
                                    </div>
                                    <p className="text-xs text-slate-500">
                                        Secure 256-bit encrypted payment. Your remaining balance of ${totalPrice - holdingDeposit} is due upon arrival.
                                    </p>
                                </div>

                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <Label className="text-sm font-medium text-slate-600">Card Number</Label>
                                        <div className="relative">
                                            <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                            <Input
                                                placeholder="0000 0000 0000 0000"
                                                value={paymentData.cardNumber}
                                                onChange={(e) => setPaymentData({ ...paymentData, cardNumber: e.target.value })}
                                                className="pl-10 rounded-xl bg-slate-50"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label className="text-sm font-medium text-slate-600">Expiry Date</Label>
                                            <div className="relative">
                                                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                                <Input
                                                    placeholder="MM/YY"
                                                    value={paymentData.expiry}
                                                    onChange={(e) => setPaymentData({ ...paymentData, expiry: e.target.value })}
                                                    className="pl-10 rounded-xl bg-slate-50"
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-sm font-medium text-slate-600">CVC</Label>
                                            <div className="relative">
                                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                                <Input
                                                    placeholder="123"
                                                    value={paymentData.cvc}
                                                    onChange={(e) => setPaymentData({ ...paymentData, cvc: e.target.value })}
                                                    className="pl-10 rounded-xl bg-slate-50"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label className="text-sm font-medium text-slate-600">Name on Card</Label>
                                        <Input
                                            placeholder="John Doe"
                                            value={paymentData.nameOnCard}
                                            onChange={(e) => setPaymentData({ ...paymentData, nameOnCard: e.target.value })}
                                            className="rounded-xl bg-slate-50"
                                        />
                                    </div>
                                </div>

                                <div className="flex items-center gap-2 text-xs text-slate-500 bg-blue-50 p-3 rounded-lg text-blue-700">
                                    <ShieldCheck className="w-4 h-4" />
                                    <span>Payments are secure and encrypted. No real charge will be made (Demo Mode).</span>
                                </div>

                                <div className="flex gap-3">
                                    <Button
                                        variant="outline"
                                        className="flex-1 py-6 rounded-xl"
                                        onClick={() => setStep('details')}
                                    >
                                        Back
                                    </Button>
                                    <Button
                                        className="flex-[2] py-6 text-lg font-semibold bg-green-600 hover:bg-green-700 rounded-xl"
                                        onClick={handleFinalSubmit}
                                    >
                                        Pay & Confirm Booking
                                    </Button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};
