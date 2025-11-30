import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { doc, getDoc, addDoc, collection } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { BeachTour, Booking } from '@/types/beachTour';
import { Button } from '@/components/ui/button';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import BookingDialogContent from '@/components/tours/BookingDialogContent';
import { Loader2, MapPin, Clock, Users, Star, CheckCircle2, ShieldCheck, Calendar as CalendarIcon } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/AuthContext';

const TourDetail = () => {
  const { id } = useParams();
  const [tour, setTour] = useState<BeachTour | null>(null);
  const [loading, setLoading] = useState(true);
  const [bookingDialogOpen, setBookingDialogOpen] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    const fetchTour = async () => {
      if (!id) return;
      try {
        // Try fetching from beach_tours
        const docRef = doc(db, 'beach_tours', id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setTour({ id: docSnap.id, ...docSnap.data() } as BeachTour);
        } else {
          // Fallback: Check if it's in default data (if we had access to it here)
          // For now, just show not found
          console.log("Tour not found in beach_tours");
        }
      } catch (error) {
        console.error("Error fetching tour:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTour();
  }, [id]);

  const handleBooking = async (data: Booking) => {
    try {
      // Create Booking in Firestore
      const bookingRef = await addDoc(collection(db, 'beach_bookings'), {
        ...data,
        userId: user?.uid || 'guest',
        status: 'pending',
        paymentStatus: 'pending_payment',
        createdAt: new Date(),
        totalAmount: tour ? tour.price * data.guests : 0
      });

      // Close the dialog
      setBookingDialogOpen(false);

      // Show success message
      toast({
        title: "✅ Booking Request Received!",
        description: `Your booking (${bookingRef.id}) has been submitted. Our team will contact you shortly to confirm payment details.`,
        duration: 6000,
      });

      console.log('Booking created:', bookingRef.id);

    } catch (error) {
      console.error("Error saving booking:", error);
      toast({
        title: "Booking Failed",
        description: "There was an error saving your booking. Please try again.",
        variant: "destructive"
      });
    }
  };

  if (loading) return <div className="flex justify-center items-center h-screen"><Loader2 className="animate-spin w-10 h-10 text-blue-600" /></div>;
  if (!tour) return <div className="flex justify-center items-center h-screen">Tour not found</div>;

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-50 pb-20">
        {/* Hero Section */}
        <div className="relative h-[60vh]">
          <img src={tour.image} alt={tour.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex items-end">
            <div className="container mx-auto px-4 pb-12 text-white">
              <div className="flex items-center gap-2 mb-4">
                <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium uppercase tracking-wide">
                  {tour.category}
                </span>
                {tour.featured && (
                  <span className="bg-amber-500 text-white px-3 py-1 rounded-full text-sm font-medium uppercase tracking-wide flex items-center gap-1">
                    <Star className="w-3 h-3 fill-current" /> Featured
                  </span>
                )}
              </div>
              <h1 className="text-4xl md:text-6xl font-bold mb-4 font-serif">{tour.title}</h1>
              <div className="flex items-center gap-6 text-lg opacity-90">
                <span className="flex items-center gap-2"><MapPin className="w-5 h-5" /> {tour.location}</span>
                <span className="flex items-center gap-2"><Star className="w-5 h-5 text-yellow-400 fill-current" /> {tour.rating} ({tour.reviews} reviews)</span>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 -mt-10 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Quick Stats */}
              <div className="bg-white rounded-2xl p-8 shadow-sm grid grid-cols-3 gap-4 border border-gray-100">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-blue-50 rounded-xl text-blue-600">
                    <Clock className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Duration</p>
                    <p className="font-semibold text-gray-900">{tour.duration}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-green-50 rounded-xl text-green-600">
                    <Users className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Group Size</p>
                    <p className="font-semibold text-gray-900">Max {tour.maxGroupSize}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-amber-50 rounded-xl text-amber-600">
                    <CalendarIcon className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Best Season</p>
                    <p className="font-semibold text-gray-900">{tour.bestSeason || 'All Year'}</p>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
                <h2 className="text-2xl font-bold mb-6 text-gray-900">Experience Overview</h2>
                <p className="text-gray-600 leading-relaxed text-lg">{tour.description}</p>

                <div className="mt-8">
                  <h3 className="text-lg font-bold mb-4 text-gray-900">Highlights</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    {tour.highlights.map((highlight, idx) => (
                      <div key={idx} className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-blue-500 mt-0.5 shrink-0" />
                        <span className="text-gray-700">{highlight}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Itinerary (if available) */}
              {tour.itinerary && (
                <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
                  <h2 className="text-2xl font-bold mb-6 text-gray-900">Itinerary</h2>
                  <div className="space-y-6">
                    {tour.itinerary.map((item, idx) => (
                      <div key={idx} className="flex gap-4">
                        <div className="flex flex-col items-center">
                          <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-sm">
                            {item.day}
                          </div>
                          {idx !== tour.itinerary!.length - 1 && (
                            <div className="w-0.5 h-full bg-blue-100 my-2"></div>
                          )}
                        </div>
                        <div>
                          <h3 className="font-bold text-lg text-gray-900 mb-2">{item.title}</h3>
                          <p className="text-gray-600">{item.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 sticky top-24">
                <div className="mb-6 pb-6 border-b border-gray-100">
                  <span className="text-gray-500 block mb-1">Starting from</span>
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-bold text-blue-900">${tour.price}</span>
                    <span className="text-gray-500">/ person</span>
                  </div>
                </div>

                <Dialog open={bookingDialogOpen} onOpenChange={setBookingDialogOpen}>
                  <DialogTrigger asChild>
                    <Button className="w-full py-6 text-lg font-bold bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5 mb-6">
                      Book This Tour
                    </Button>
                  </DialogTrigger>
                  <BookingDialogContent tour={tour} onBook={handleBooking} />
                </Dialog>

                <div className="space-y-4">
                  <h3 className="font-semibold text-gray-900">What's Included</h3>
                  <ul className="space-y-3">
                    {tour.inclusions.slice(0, 5).map((inc, i) => (
                      <li key={i} className="flex items-start gap-3 text-sm text-gray-600">
                        <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                        {inc}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-6 pt-6 border-t border-gray-100 bg-blue-50/50 -mx-6 -mb-6 p-6 rounded-b-2xl">
                  <div className="flex items-center gap-3 text-sm text-blue-800">
                    <ShieldCheck className="w-5 h-5" />
                    <span className="font-medium">Best Price Guarantee</span>
                  </div>
                  <p className="text-xs text-blue-600/70 mt-1 ml-8">
                    Found a lower price? We'll match it.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default TourDetail;
