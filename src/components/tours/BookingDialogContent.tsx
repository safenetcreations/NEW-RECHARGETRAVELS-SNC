import React, { useState } from 'react';
import { DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Palmtree, Calendar, Users, Mail, Phone, Check } from 'lucide-react';
import { BeachTour, Booking } from '@/types/beachTour';

interface BookingDialogContentProps {
    tour: BeachTour;
    onBook: (data: Booking) => void;
}

const BookingDialogContent: React.FC<BookingDialogContentProps> = ({ tour, onBook }) => {
    const [bookingData, setBookingData] = useState<Booking>({
        tourId: tour.id,
        tourTitle: tour.title,
        date: '',
        guests: 1,
        contactName: '',
        contactEmail: '',
        contactPhone: '',
        specialRequests: ''
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onBook(bookingData);
    };

    return (
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto bg-[#fffdf5] border-amber-100 shadow-2xl">
            <DialogHeader className="border-b border-amber-100 pb-4">
                <DialogTitle className="text-2xl font-serif text-blue-900 flex items-center gap-2">
                    <Palmtree className="w-6 h-6 text-amber-500" />
                    Book Your Escape
                </DialogTitle>
                <DialogDescription className="text-blue-600/80">
                    {tour.title}
                </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                {/* Price Summary Card */}
                <div className="bg-white/50 border border-amber-100 p-4 rounded-xl shadow-sm">
                    <div className="flex justify-between items-center mb-1">
                        <span className="text-sm text-gray-500">Price per person</span>
                        <span className="font-medium text-blue-900">${tour.price}</span>
                    </div>
                    <div className="flex justify-between items-center text-lg font-bold text-blue-900">
                        <span>Total Estimate</span>
                        <span>${tour.price * bookingData.guests}</span>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</label>
                        <div className="relative">
                            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <Input
                                type="date"
                                required
                                className="pl-9 bg-white border-amber-200 focus:border-blue-500 focus:ring-blue-200"
                                value={bookingData.date}
                                onChange={e => setBookingData({ ...bookingData, date: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Guests</label>
                        <div className="relative">
                            <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <Input
                                type="number"
                                min="1"
                                max={tour.maxGroupSize}
                                required
                                className="pl-9 bg-white border-amber-200 focus:border-blue-500 focus:ring-blue-200"
                                value={bookingData.guests}
                                onChange={e => setBookingData({ ...bookingData, guests: parseInt(e.target.value) })}
                            />
                        </div>
                    </div>
                </div>

                <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Contact Details</label>
                    <div className="grid gap-3">
                        <div className="relative">
                            <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <Input
                                required
                                placeholder="Full Name"
                                className="pl-9 bg-white border-amber-200 focus:border-blue-500 focus:ring-blue-200"
                                value={bookingData.contactName}
                                onChange={e => setBookingData({ ...bookingData, contactName: e.target.value })}
                            />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <Input
                                    type="email"
                                    required
                                    placeholder="Email Address"
                                    className="pl-9 bg-white border-amber-200 focus:border-blue-500 focus:ring-blue-200"
                                    value={bookingData.contactEmail}
                                    onChange={e => setBookingData({ ...bookingData, contactEmail: e.target.value })}
                                />
                            </div>
                            <div className="relative">
                                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <Input
                                    type="tel"
                                    required
                                    placeholder="WhatsApp Number"
                                    className="pl-9 bg-white border-amber-200 focus:border-blue-500 focus:ring-blue-200"
                                    value={bookingData.contactPhone}
                                    onChange={e => setBookingData({ ...bookingData, contactPhone: e.target.value })}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Special Requests</label>
                    <Textarea
                        placeholder="Dietary restrictions, pickup location, or any special requirements..."
                        className="bg-white border-amber-200 focus:border-blue-500 focus:ring-blue-200 min-h-[80px]"
                        value={bookingData.specialRequests}
                        onChange={e => setBookingData({ ...bookingData, specialRequests: e.target.value })}
                    />
                </div>

                <Button type="submit" className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white font-bold py-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5">
                    Confirm Beach Getaway
                </Button>

                <p className="text-xs text-center text-gray-400 flex items-center justify-center gap-1">
                    <Check className="w-3 h-3" /> Secure booking powered by Recharge Travels
                </p>
            </form>
        </DialogContent>
    );
};

export default BookingDialogContent;
