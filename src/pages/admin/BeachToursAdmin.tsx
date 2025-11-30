import { useState, useEffect } from 'react';
import { Loader2, Compass, Mail, Phone, MapPin, Calendar, Users, DollarSign, CheckCircle, XCircle, Clock, MessageCircle, Eye, Trash2, Filter, Plus, Edit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { collection, getDocs, query, orderBy, doc, updateDoc, deleteDoc, addDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { BeachTour, BeachBooking } from '@/types/beachTour';
import { defaultBeachTours } from '@/data/beachToursData';

const BeachToursAdmin = () => {
    const { toast } = useToast();
    const [loading, setLoading] = useState(true);
    const [bookings, setBookings] = useState<BeachBooking[]>([]);
    const [tours, setTours] = useState<BeachTour[]>([]);
    const [selectedBooking, setSelectedBooking] = useState<BeachBooking | null>(null);
    const [activeTab, setActiveTab] = useState('bookings');

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setLoading(true);
        try {
            // Load Bookings
            const bookingsRef = collection(db, 'beach_bookings');
            const qBookings = query(bookingsRef, orderBy('createdAt', 'desc'));
            const bookingSnap = await getDocs(qBookings);
            const bookingsData = bookingSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as BeachBooking));
            setBookings(bookingsData);

            // Load Tours
            const toursRef = collection(db, 'beach_tours');
            const toursSnap = await getDocs(toursRef);
            const toursData = toursSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as BeachTour));

            if (toursData.length === 0) {
                setTours(defaultBeachTours);
            } else {
                setTours(toursData);
            }

        } catch (e) {
            console.error(e);
            toast({ title: 'Error loading data', variant: 'destructive' });
        }
        setLoading(false);
    };

    const updateBookingStatus = async (id: string, status: BeachBooking['status']) => {
        try {
            await updateDoc(doc(db, 'beach_bookings', id), { status });
            setBookings(prev => prev.map(b => b.id === id ? { ...b, status } : b));
            toast({ title: `Booking status updated to ${status}` });
        } catch (e) {
            toast({ title: 'Error updating status', variant: 'destructive' });
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'pending': return 'bg-yellow-100 text-yellow-800';
            case 'confirmed': return 'bg-green-100 text-green-800';
            case 'cancelled': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const seedTours = async () => {
        try {
            const toursRef = collection(db, 'beach_tours');
            for (const tour of defaultBeachTours) {
                await addDoc(toursRef, tour);
            }
            toast({ title: 'Default tours seeded successfully' });
            loadData();
        } catch (e) {
            console.error(e);
            toast({ title: 'Error seeding tours', variant: 'destructive' });
        }
    };

    if (loading) return <div className="min-h-screen bg-gray-50 flex items-center justify-center"><Loader2 className="w-12 h-12 animate-spin text-blue-600" /></div>;

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white py-8 px-6">
                <div className="max-w-7xl mx-auto">
                    <div className="flex items-center gap-3 mb-2"><Compass className="w-8 h-8" /><h1 className="text-3xl font-bold">Beach Tours Admin</h1></div>
                    <p className="text-blue-100">Manage beach tour bookings and packages</p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 py-8">
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                    <TabsList className="mb-6">
                        <TabsTrigger value="bookings">Bookings</TabsTrigger>
                        <TabsTrigger value="tours">Tours Management</TabsTrigger>
                    </TabsList>

                    <TabsContent value="bookings">
                        <div className="grid lg:grid-cols-2 gap-6">
                            <div className="space-y-4">
                                <h2 className="text-xl font-semibold">Recent Bookings ({bookings.length})</h2>
                                {bookings.length === 0 ? (
                                    <Card><CardContent className="p-8 text-center text-gray-500">No bookings found</CardContent></Card>
                                ) : (
                                    bookings.map(booking => (
                                        <Card key={booking.id} className={`cursor-pointer hover:shadow-lg transition-all ${selectedBooking?.id === booking.id ? 'ring-2 ring-blue-500' : ''}`} onClick={() => setSelectedBooking(booking)}>
                                            <CardContent className="p-4">
                                                <div className="flex items-start justify-between mb-2">
                                                    <div>
                                                        <h3 className="font-semibold text-lg">{booking.customerName}</h3>
                                                        <p className="text-gray-500 text-sm">{booking.tourTitle}</p>
                                                    </div>
                                                    <Badge className={getStatusColor(booking.status)}>{booking.status}</Badge>
                                                </div>
                                                <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                                                    <span className="flex items-center gap-1"><Calendar className="w-4 h-4" />{booking.travelDate}</span>
                                                    <span className="flex items-center gap-1"><Users className="w-4 h-4" />{booking.guests} pax</span>
                                                    <span className="flex items-center gap-1"><DollarSign className="w-4 h-4" />${booking.totalAmount}</span>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))
                                )}
                            </div>

                            <div className="lg:sticky lg:top-6">
                                {selectedBooking ? (
                                    <Card className="border-0 shadow-xl">
                                        <CardHeader className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-t-lg">
                                            <CardTitle className="flex items-center justify-between">
                                                <span>Booking Details</span>
                                                <Badge className={`${getStatusColor(selectedBooking.status)} text-sm`}>{selectedBooking.status}</Badge>
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent className="p-6 space-y-6">
                                            <div>
                                                <h4 className="font-semibold mb-3 flex items-center gap-2"><Mail className="w-4 h-4 text-blue-500" />Customer Info</h4>
                                                <div className="space-y-2 text-sm">
                                                    <div className="flex items-center gap-2"><Users className="w-4 h-4 text-gray-400" />{selectedBooking.customerName}</div>
                                                    <a href={`mailto:${selectedBooking.customerEmail}`} className="flex items-center gap-2 text-blue-600 hover:underline"><Mail className="w-4 h-4" />{selectedBooking.customerEmail}</a>
                                                    <a href={`tel:${selectedBooking.customerPhone}`} className="flex items-center gap-2 text-blue-600 hover:underline"><Phone className="w-4 h-4" />{selectedBooking.customerPhone}</a>
                                                </div>
                                            </div>

                                            <div>
                                                <h4 className="font-semibold mb-3 flex items-center gap-2"><Compass className="w-4 h-4 text-blue-500" />Tour Details</h4>
                                                <div className="bg-gray-50 p-4 rounded-lg space-y-2 text-sm">
                                                    <div className="flex justify-between"><span>Tour:</span> <span className="font-medium">{selectedBooking.tourTitle}</span></div>
                                                    <div className="flex justify-between"><span>Date:</span> <span className="font-medium">{selectedBooking.travelDate}</span></div>
                                                    <div className="flex justify-between"><span>Guests:</span> <span className="font-medium">{selectedBooking.guests}</span></div>
                                                    <div className="flex justify-between border-t pt-2 mt-2"><span>Total Amount:</span> <span className="font-bold text-lg text-blue-600">${selectedBooking.totalAmount}</span></div>
                                                </div>
                                            </div>

                                            {selectedBooking.specialRequests && (
                                                <div>
                                                    <h4 className="font-semibold mb-2">Special Requests</h4>
                                                    <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">{selectedBooking.specialRequests}</p>
                                                </div>
                                            )}

                                            <div className="pt-4 border-t space-y-3">
                                                <div className="flex flex-wrap gap-2">
                                                    {selectedBooking.status === 'pending' && (
                                                        <Button size="sm" className="bg-green-500 hover:bg-green-600" onClick={() => updateBookingStatus(selectedBooking.id!, 'confirmed')}>
                                                            <CheckCircle className="w-4 h-4 mr-1" />Confirm Booking
                                                        </Button>
                                                    )}
                                                    {selectedBooking.status !== 'cancelled' && (
                                                        <Button size="sm" variant="destructive" onClick={() => updateBookingStatus(selectedBooking.id!, 'cancelled')}>
                                                            <XCircle className="w-4 h-4 mr-1" />Cancel Booking
                                                        </Button>
                                                    )}
                                                </div>
                                                <div className="flex gap-2">
                                                    <Button size="sm" variant="outline" onClick={() => window.open(`https://wa.me/${selectedBooking.customerPhone?.replace(/[^0-9]/g, '')}`, '_blank')}>
                                                        <MessageCircle className="w-4 h-4 mr-1" />WhatsApp
                                                    </Button>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ) : (
                                    <Card className="border-0 shadow-lg">
                                        <CardContent className="p-12 text-center text-gray-500">
                                            <Eye className="w-12 h-12 mx-auto mb-4 opacity-30" />
                                            <p>Select a booking to view details</p>
                                        </CardContent>
                                    </Card>
                                )}
                            </div>
                        </div>
                    </TabsContent>

                    <TabsContent value="tours">
                        <div className="space-y-6">
                            <div className="flex justify-between items-center">
                                <h2 className="text-xl font-semibold">Manage Tours ({tours.length})</h2>
                                <Button onClick={seedTours} variant="outline" size="sm">
                                    Seed Default Tours
                                </Button>
                            </div>

                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {tours.map(tour => (
                                    <Card key={tour.id} className="overflow-hidden">
                                        <div className="h-48 overflow-hidden relative">
                                            <img src={tour.image} alt={tour.title} className="w-full h-full object-cover" />
                                            <Badge className="absolute top-2 right-2">{tour.category}</Badge>
                                        </div>
                                        <CardContent className="p-4">
                                            <h3 className="font-bold text-lg mb-1">{tour.title}</h3>
                                            <p className="text-sm text-gray-500 mb-3">{tour.location}</p>
                                            <div className="flex justify-between items-center">
                                                <span className="font-bold text-blue-600">${tour.price}</span>
                                                <Button size="sm" variant="outline"><Edit className="w-4 h-4 mr-1" />Edit</Button>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </div>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
};

export default BeachToursAdmin;
