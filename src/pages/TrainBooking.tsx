import { useState, useEffect } from 'react';
import { Search, Train, MapPin, Clock, Calendar, Users, ChevronRight, Star, Info, AlertCircle, Camera, Mountain, Waves, Eye } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import ComprehensiveSEO from '@/components/seo/ComprehensiveSEO';
import { useToast } from '@/hooks/use-toast';
import { trainBookingService, TrainRoute, TrainBookingPageContent } from '@/services/trainBookingService';

// Icon mapping
const iconMap: Record<string, React.ComponentType<any>> = {
  Mountain, Train, Waves, Eye, Camera, Star, Clock, AlertCircle, Info
};

const TrainBooking = () => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRoute, setSelectedRoute] = useState<TrainRoute | null>(null);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Data states
  const [routes, setRoutes] = useState<TrainRoute[]>([]);
  const [pageContent, setPageContent] = useState<TrainBookingPageContent | null>(null);

  // Booking form state
  const [bookingData, setBookingData] = useState({
    fullName: '',
    email: '',
    phone: '',
    travelDate: '',
    passengers: '1',
    ticketClass: '2nd Class',
    handDelivery: false,
    passportNumber: '',
    hotelAddress: '',
    specialRequests: ''
  });

  const ticketClasses = trainBookingService.getTicketClasses();
  const categories = trainBookingService.getCategories();

  // Load data from Firebase
  useEffect(() => {
    const loadData = async () => {
      try {
        const [routesData, contentData] = await Promise.all([
          trainBookingService.getRoutes(),
          trainBookingService.getPageContent()
        ]);
        setRoutes(routesData);
        setPageContent(contentData);
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Filter routes based on search and category
  const filteredRoutes = routes.filter(route => {
    const matchesSearch = route.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         route.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         route.departureStation.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         route.arrivalStation.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || route.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleBookNow = (route: TrainRoute) => {
    setSelectedRoute(route);
    setShowBookingForm(true);
    setBookingData(prev => ({
      ...prev,
      ticketClass: route.bestClass
    }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmitBooking = async (e: React.FormEvent) => {
    e.preventDefault();

    if (bookingData.handDelivery && !bookingData.passportNumber) {
      toast({
        title: "Passport Required",
        description: "Please enter your passport number for ticket hand delivery service",
        variant: "destructive"
      });
      return;
    }

    if (!selectedRoute) return;

    setSubmitting(true);

    try {
      // Save booking to Firebase
      const booking = await trainBookingService.createBooking({
        route: {
          id: selectedRoute.id,
          name: selectedRoute.name,
          departureStation: selectedRoute.departureStation,
          arrivalStation: selectedRoute.arrivalStation
        },
        customerInfo: {
          fullName: bookingData.fullName,
          email: bookingData.email,
          phone: bookingData.phone,
          passportNumber: bookingData.passportNumber || undefined
        },
        travelDetails: {
          travelDate: bookingData.travelDate,
          passengers: parseInt(bookingData.passengers),
          ticketClass: bookingData.ticketClass,
          handDelivery: bookingData.handDelivery,
          hotelAddress: bookingData.hotelAddress || undefined,
          specialRequests: bookingData.specialRequests || undefined
        },
        pricing: {
          estimatedPrice: selectedRoute.priceRange,
          deliveryFee: bookingData.handDelivery ? 2000 : 0
        },
        status: 'pending'
      });

      toast({
        title: "Booking Request Submitted!",
        description: (
          <div>
            <p>Reference: <strong>{booking.bookingReference}</strong></p>
            <p className="mt-1">We'll confirm your {selectedRoute.name} train booking within 24 hours via email/phone.</p>
          </div>
        ),
      });

      // Reset form
      setShowBookingForm(false);
      setBookingData({
        fullName: '',
        email: '',
        phone: '',
        travelDate: '',
        passengers: '1',
        ticketClass: '2nd Class',
        handDelivery: false,
        passportNumber: '',
        hotelAddress: '',
        specialRequests: ''
      });
    } catch (error) {
      console.error('Error submitting booking:', error);
      toast({
        title: "Booking Failed",
        description: "There was an error submitting your booking. Please try again.",
        variant: "destructive"
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-orange-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-red-600 mx-auto mb-6"></div>
          <p className="text-xl text-gray-600">Loading train routes...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <ComprehensiveSEO
        title={pageContent?.seo.title || "Sri Lanka Train Booking - Scenic Railway Journeys | Recharge Travels"}
        description={pageContent?.seo.description || "Book famous Sri Lankan train routes - Kandy to Ella, Colombo to Galle coastal line, and more scenic railway journeys."}
        keywords={pageContent?.seo.keywords || [
          'Sri Lanka train booking',
          'Kandy to Ella train',
          'Sri Lanka railway'
        ]}
        canonicalUrl="/train-booking"
      />

      <Header />

      {/* Hero Section - Sri Lankan Railway Style */}
      <section className="relative py-20 bg-gradient-to-br from-red-800 via-red-700 to-orange-600 overflow-hidden">
        <div
          className="absolute inset-0 opacity-20 bg-cover bg-center"
          style={{ backgroundImage: `url('${pageContent?.hero.backgroundImage || 'https://i.imgur.com/cTqS05p.jpeg'}')` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-red-900/90 to-transparent"></div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-4xl mx-auto text-center text-white">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-6 py-2 rounded-full mb-6">
              <Train className="w-5 h-5" />
              <span className="font-semibold">{pageContent?.hero.subtitle || 'Sri Lanka Railways - Scenic Journeys'}</span>
            </div>

            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              {pageContent?.hero.title || 'Book Your Train Journey Through Paradise'}
            </h1>

            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              {pageContent?.hero.description || "Experience the world's most scenic train routes through Sri Lanka's breathtaking hill country, coastal lines, and tea plantations. We handle the booking for you!"}
            </p>

            <div className="flex flex-wrap justify-center gap-4 text-sm">
              {(pageContent?.hero.badges || [
                { icon: 'Star', text: 'Famous Scenic Routes' },
                { icon: 'Clock', text: 'Manual Booking Service' },
                { icon: 'AlertCircle', text: 'Live Updates' }
              ]).map((badge, idx) => {
                const BadgeIcon = iconMap[badge.icon] || Star;
                return (
                  <div key={idx} className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg">
                    <BadgeIcon className="w-4 h-4 text-yellow-300" />
                    <span>{badge.text}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Booking Form Modal */}
      {showBookingForm && selectedRoute && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl shadow-2xl max-w-3xl w-full my-8">
            {/* Form Header */}
            <div className="bg-gradient-to-r from-red-700 to-orange-600 p-6 rounded-t-3xl text-white">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-2xl font-bold mb-2">{selectedRoute.name}</h3>
                  <p className="text-white/90 flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    {selectedRoute.departureStation} → {selectedRoute.arrivalStation}
                  </p>
                  <p className="text-sm text-white/80 mt-2">
                    <Clock className="w-4 h-4 inline mr-1" />
                    Duration: {selectedRoute.duration} • Distance: {selectedRoute.distance}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowBookingForm(false)}
                  className="text-white hover:bg-white/20"
                >
                  ✕
                </Button>
              </div>
            </div>

            {/* Form Content */}
            <form onSubmit={handleSubmitBooking} className="p-6 space-y-6">
              {/* Personal Information */}
              <div>
                <h4 className="font-semibold text-lg mb-4 flex items-center gap-2">
                  <Users className="w-5 h-5 text-red-600" />
                  Passenger Information
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="fullName">Full Name *</Label>
                    <Input
                      id="fullName"
                      required
                      value={bookingData.fullName}
                      onChange={(e) => setBookingData({...bookingData, fullName: e.target.value})}
                      placeholder="As per passport/ID"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      required
                      value={bookingData.email}
                      onChange={(e) => setBookingData({...bookingData, email: e.target.value})}
                      placeholder="your@email.com"
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input
                      id="phone"
                      type="tel"
                      required
                      value={bookingData.phone}
                      onChange={(e) => setBookingData({...bookingData, phone: e.target.value})}
                      placeholder="+94 XXX XXX XXX"
                    />
                  </div>
                  <div>
                    <Label htmlFor="passengers">Number of Passengers *</Label>
                    <Input
                      id="passengers"
                      type="number"
                      min="1"
                      max="10"
                      required
                      value={bookingData.passengers}
                      onChange={(e) => setBookingData({...bookingData, passengers: e.target.value})}
                    />
                  </div>
                </div>
              </div>

              {/* Travel Details */}
              <div>
                <h4 className="font-semibold text-lg mb-4 flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-red-600" />
                  Travel Details
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="travelDate">Travel Date *</Label>
                    <Input
                      id="travelDate"
                      type="date"
                      required
                      min={new Date().toISOString().split('T')[0]}
                      value={bookingData.travelDate}
                      onChange={(e) => setBookingData({...bookingData, travelDate: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="ticketClass">Ticket Class *</Label>
                    <select
                      id="ticketClass"
                      required
                      value={bookingData.ticketClass}
                      onChange={(e) => setBookingData({...bookingData, ticketClass: e.target.value})}
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-red-500"
                    >
                      {ticketClasses.map(cls => (
                        <option key={cls} value={cls}>{cls}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-start gap-2">
                    <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div className="text-sm text-blue-800">
                      <p className="font-semibold mb-1">Best Time: {selectedRoute.bestTime}</p>
                      <p>Recommended Class: {selectedRoute.bestClass}</p>
                      <p>Price Range: {selectedRoute.priceRange}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Hand Delivery Option */}
              <div>
                <div className="flex items-start gap-3 p-4 bg-orange-50 rounded-lg border border-orange-200">
                  <input
                    type="checkbox"
                    id="handDelivery"
                    checked={bookingData.handDelivery}
                    onChange={(e) => setBookingData({...bookingData, handDelivery: e.target.checked})}
                    className="mt-1"
                  />
                  <div>
                    <Label htmlFor="handDelivery" className="font-semibold cursor-pointer">
                      Ticket Hand Delivery to Hotel (Additional LKR 2,000)
                    </Label>
                    <p className="text-sm text-gray-600 mt-1">
                      We'll deliver physical tickets to your hotel before your journey
                    </p>
                  </div>
                </div>

                {bookingData.handDelivery && (
                  <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                    <div>
                      <Label htmlFor="passportNumber">Passport Number * (Required for ticket collection)</Label>
                      <Input
                        id="passportNumber"
                        required
                        value={bookingData.passportNumber}
                        onChange={(e) => setBookingData({...bookingData, passportNumber: e.target.value})}
                        placeholder="A12345678"
                      />
                    </div>
                    <div>
                      <Label htmlFor="hotelAddress">Hotel Name & Address *</Label>
                      <Input
                        id="hotelAddress"
                        required
                        value={bookingData.hotelAddress}
                        onChange={(e) => setBookingData({...bookingData, hotelAddress: e.target.value})}
                        placeholder="Hotel name and city"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Special Requests */}
              <div>
                <Label htmlFor="specialRequests">Special Requests (Optional)</Label>
                <textarea
                  id="specialRequests"
                  value={bookingData.specialRequests}
                  onChange={(e) => setBookingData({...bookingData, specialRequests: e.target.value})}
                  placeholder="Window seat preference, dietary requirements, accessibility needs, etc."
                  rows={3}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-red-500"
                />
              </div>

              {/* Submit Button */}
              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowBookingForm(false)}
                  className="flex-1"
                  disabled={submitting}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700"
                  disabled={submitting}
                >
                  {submitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Train className="w-4 h-4 mr-2" />
                      Submit Booking Request
                    </>
                  )}
                </Button>
              </div>

              <p className="text-xs text-gray-500 text-center">
                * We'll confirm availability and send payment details within 24 hours
              </p>
            </form>
          </div>
        </div>
      )}

      {/* Search and Filter Section */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            {/* Search Bar */}
            <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="Search routes, stations, or destinations..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-12 py-6 text-lg"
                  />
                </div>
                <Button className="bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 px-8 py-6">
                  <Search className="w-5 h-5 mr-2" />
                  Search Routes
                </Button>
              </div>
            </div>

            {/* Category Filters */}
            <div className="flex flex-wrap gap-3 mb-8">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-6 py-3 rounded-full font-semibold transition-all ${
                    selectedCategory === category
                      ? 'bg-gradient-to-r from-red-600 to-orange-600 text-white shadow-lg scale-105'
                      : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>

            {/* Results Count */}
            <p className="text-gray-600 mb-6">
              Found <span className="font-bold text-red-600">{filteredRoutes.length}</span> routes
            </p>
          </div>
        </div>
      </section>

      {/* Train Routes Grid */}
      <section className="py-12">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {filteredRoutes.map((route) => {
                const IconComponent = iconMap[route.icon] || Train;
                return (
                  <div
                    key={route.id}
                    className="bg-white rounded-3xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 group"
                  >
                    {/* Route Image */}
                    <div className="relative h-64 overflow-hidden">
                      <img
                        src={route.image}
                        alt={route.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>

                      {/* Route Badge */}
                      <div className="absolute top-4 left-4 flex gap-2">
                        <span className="bg-red-600 text-white px-4 py-1 rounded-full text-sm font-semibold">
                          {route.category}
                        </span>
                        {route.popularity && (
                          <span className="bg-orange-500 text-white px-4 py-1 rounded-full text-sm font-semibold flex items-center gap-1">
                            <Star className="w-3 h-3" />
                            {route.popularity}
                          </span>
                        )}
                      </div>

                      {/* Route Name Overlay */}
                      <div className="absolute bottom-4 left-4 right-4">
                        <h3 className="text-2xl font-bold text-white mb-1 flex items-center gap-2">
                          <IconComponent className="w-6 h-6" />
                          {route.name}
                        </h3>
                        <div className="flex items-center gap-4 text-white/90 text-sm">
                          <span className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            {route.distance}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {route.duration}
                          </span>
                          <span className="flex items-center gap-1">
                            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                            {route.rating}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Route Details */}
                    <div className="p-6">
                      <p className="text-gray-700 mb-4">{route.description}</p>

                      {/* Route Info */}
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div className="bg-gray-50 p-3 rounded-lg">
                          <p className="text-xs text-gray-500 mb-1">From</p>
                          <p className="font-semibold text-gray-900">{route.departureStation}</p>
                        </div>
                        <div className="bg-gray-50 p-3 rounded-lg">
                          <p className="text-xs text-gray-500 mb-1">To</p>
                          <p className="font-semibold text-gray-900">{route.arrivalStation}</p>
                        </div>
                      </div>

                      {/* Highlights */}
                      <div className="mb-4">
                        <p className="text-sm font-semibold text-gray-700 mb-2">Highlights:</p>
                        <div className="flex flex-wrap gap-2">
                          {route.highlights.map((highlight, idx) => (
                            <span
                              key={idx}
                              className="text-xs bg-orange-100 text-orange-800 px-3 py-1 rounded-full"
                            >
                              {highlight}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Scenic Stops */}
                      <div className="mb-4">
                        <p className="text-sm font-semibold text-gray-700 mb-2">Scenic Stops:</p>
                        <p className="text-sm text-gray-600">
                          {route.scenicStops.join(' • ')}
                        </p>
                      </div>

                      {/* Price & Class Info */}
                      <div className="bg-gradient-to-r from-red-50 to-orange-50 p-4 rounded-xl mb-4">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm text-gray-600">Price Range</span>
                          <span className="font-bold text-red-600">{route.priceRange}</span>
                        </div>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm text-gray-600">Best Class</span>
                          <span className="font-semibold text-gray-900">{route.bestClass}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">Frequency</span>
                          <span className="font-semibold text-gray-900">{route.frequency}</span>
                        </div>
                      </div>

                      {/* Book Now Button */}
                      <Button
                        onClick={() => handleBookNow(route)}
                        className="w-full bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 py-6 text-lg group"
                      >
                        Book This Journey
                        <ChevronRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Important Information Section */}
      <section className="py-16 bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">Important Information</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {(pageContent?.importantInfo || [
                {
                  id: '1',
                  icon: 'AlertCircle',
                  title: 'Booking Process',
                  items: [
                    'Submit booking request online',
                    'We check availability manually',
                    'Confirmation within 24 hours',
                    'Payment details sent via email',
                    'Tickets delivered or ready at station'
                  ]
                },
                {
                  id: '2',
                  icon: 'Info',
                  title: 'Best Booking Tips',
                  items: [
                    'Book at least 7-14 days in advance',
                    'Observation cars fill up quickly',
                    'Early morning trains offer best views',
                    'Window seats recommended for photos',
                    'Bring snacks and water'
                  ]
                },
                {
                  id: '3',
                  icon: 'Clock',
                  title: 'What to Expect',
                  items: [
                    'Trains may run late (be flexible)',
                    'Carriages can be crowded',
                    'Doors stay open for photos',
                    'Basic facilities on board',
                    'Stunning scenery guaranteed'
                  ]
                },
                {
                  id: '4',
                  icon: 'Camera',
                  title: 'Photography Tips',
                  items: [
                    'Best shots from open doorways',
                    'Nine Arch Bridge: get off at Demodara',
                    'Morning light ideal for landscapes',
                    'Keep camera secure while hanging out',
                    'Video the entire journey'
                  ]
                }
              ]).map((info) => {
                const InfoIcon = iconMap[info.icon] || Info;
                return (
                  <div key={info.id} className="bg-white p-6 rounded-2xl shadow-lg">
                    <InfoIcon className="w-8 h-8 text-red-600 mb-3" />
                    <h3 className="font-bold text-lg mb-2">{info.title}</h3>
                    <ul className="text-sm text-gray-600 space-y-2">
                      {info.items.map((item, idx) => (
                        <li key={idx}>• {item}</li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
};

export default TrainBooking;
