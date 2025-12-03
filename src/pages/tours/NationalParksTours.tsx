// National Parks Tours Page - Full Booking Integration
// /tours/wildtours/parks

import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';
import {
  MapPin,
  Clock,
  DollarSign,
  Star,
  Users,
  Calendar,
  TreePine,
  Mountain,
  Binoculars,
  Camera,
  ArrowRight,
  Phone,
  Mail,
  User,
  Globe,
  MessageCircle,
  CheckCircle2,
  Loader2,
  Shield,
  Car,
  Sun,
  Sunrise,
  Sunset,
  Play,
  Eye,
  X
} from 'lucide-react';
import { nationalParks, type NationalPark } from '@/data/wildlifeToursData';
import {
  getNationalParkTours,
  createParkBooking,
  type NationalParkTour,
  type BookingFormData
} from '@/services/nationalParksBookingService';
import {
  COMPANY,
  createBreadcrumbSchema,
  createOrganizationSchema,
  createCollectionPageSchema,
  createHowToSchema,
  createSpeakableSchema
} from '@/utils/schemaMarkup';

// Booking validation schema
const bookingSchema = z.object({
  tourId: z.string().min(1, 'Please select a tour'),
  tourTitle: z.string().min(1),
  parkName: z.string().min(1),
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email'),
  phone: z.string().min(8, 'Please enter a valid phone number'),
  whatsappNumber: z.string().optional(),
  nationality: z.string().min(2, 'Please select your nationality'),
  travelDate: z.string().min(1, 'Please select a travel date'),
  safariTime: z.enum(['morning', 'afternoon', 'fullday']),
  adults: z.number().min(1, 'At least 1 adult required').max(15),
  children: z.number().min(0).max(10),
  infants: z.number().min(0).max(5),
  vehicleType: z.enum(['shared', 'private']),
  includeGuide: z.boolean(),
  pickupLocation: z.string().min(2, 'Pickup location is required'),
  dropoffLocation: z.string().optional(),
  hotelName: z.string().optional(),
  specialRequests: z.string().optional(),
  dietaryRequirements: z.string().optional(),
  agreeToTerms: z.boolean().refine(val => val === true, 'You must agree to terms')
});

// Countries list
const countries = [
  'United States', 'United Kingdom', 'Canada', 'Australia', 'Germany', 'France',
  'Netherlands', 'Belgium', 'Switzerland', 'Austria', 'Italy', 'Spain',
  'India', 'China', 'Japan', 'South Korea', 'Singapore', 'Malaysia',
  'Thailand', 'Indonesia', 'Philippines', 'Vietnam', 'New Zealand',
  'South Africa', 'Brazil', 'Mexico', 'Russia', 'UAE', 'Saudi Arabia',
  'Sri Lanka', 'Other'
].sort();

// Park categories with icons
const parkCategories = [
  { value: 'all', label: 'All Parks', icon: TreePine },
  { value: 'yala', label: 'Yala National Park', icon: Binoculars },
  { value: 'udawalawe', label: 'Udawalawe', icon: Mountain },
  { value: 'wilpattu', label: 'Wilpattu', icon: TreePine },
  { value: 'minneriya', label: 'Minneriya', icon: Mountain },
  { value: 'bundala', label: 'Bundala', icon: Camera },
  { value: 'horton-plains', label: 'Horton Plains', icon: Mountain },
  { value: 'sinharaja', label: 'Sinharaja', icon: TreePine }
];

const NationalParksTours = () => {
  const { toast } = useToast();
  const navigate = useNavigate();

  // State
  const [tours, setTours] = useState<NationalParkTour[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedPark, setSelectedPark] = useState<NationalPark | null>(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedTour, setSelectedTour] = useState<NationalParkTour | NationalPark | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [totalPrice, setTotalPrice] = useState(0);

  // Form setup
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors }
  } = useForm<BookingFormData>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      adults: 2,
      children: 0,
      infants: 0,
      safariTime: 'morning',
      vehicleType: 'shared',
      includeGuide: true,
      agreeToTerms: false
    }
  });

  const adults = watch('adults');
  const children = watch('children');
  const vehicleType = watch('vehicleType');
  const includeGuide = watch('includeGuide');
  const safariTime = watch('safariTime');

  // Fetch tours from Firebase
  useEffect(() => {
    const fetchTours = async () => {
      setLoading(true);
      try {
        const fetchedTours = await getNationalParkTours(selectedCategory === 'all' ? undefined : selectedCategory);
        setTours(fetchedTours);
      } catch (error) {
        console.error('Error fetching tours:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchTours();
  }, [selectedCategory]);

  // Calculate price when inputs change
  useEffect(() => {
    if (!selectedTour) return;

    const basePrice = ('fees' in selectedTour)
      ? selectedTour.fees.entrance_fee + selectedTour.fees.jeep_hire
      : (selectedTour as NationalParkTour).price || 85;

    let total = basePrice * (adults || 0);
    total += basePrice * (children || 0) * 0.5;

    if (vehicleType === 'private') total += 50;
    if (includeGuide) total += 25;
    if (safariTime === 'fullday') total *= 1.5;

    setTotalPrice(Math.round(total));
  }, [adults, children, vehicleType, includeGuide, safariTime, selectedTour]);

  // Get minimum date (tomorrow)
  const getMinDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  };

  // Open booking modal
  const openBookingModal = (item: NationalPark | NationalParkTour) => {
    setSelectedTour(item);
    const parkName = 'slug' in item ? item.name : (item as NationalParkTour).parkName || (item as NationalParkTour).title;
    const tourTitle = 'slug' in item ? `${item.name} Safari Experience` : (item as NationalParkTour).title;

    setValue('tourId', 'slug' in item ? item.id : (item as NationalParkTour).id || '');
    setValue('tourTitle', tourTitle);
    setValue('parkName', parkName);
    setShowBookingModal(true);
  };

  // Submit booking
  const onSubmit = async (data: BookingFormData) => {
    setIsSubmitting(true);

    try {
      // Create mock tour object for the service
      const tourForBooking = {
        id: data.tourId,
        title: data.tourTitle,
        parkName: data.parkName,
        price: totalPrice / (data.adults + data.children * 0.5),
        pricePerPerson: totalPrice / (data.adults + data.children * 0.5)
      } as NationalParkTour;

      const result = await createParkBooking(data, tourForBooking);

      if (result.success) {
        toast({
          title: 'Safari Booked Successfully!',
          description: `Your booking reference is ${result.bookingRef}. We'll contact you shortly with confirmation details.`,
          duration: 6000
        });

        setShowBookingModal(false);
        reset();

        // Navigate to confirmation or WhatsApp
        const whatsappMessage = encodeURIComponent(
          `Hi! I just booked a safari at ${data.parkName}.\n\nBooking Ref: ${result.bookingRef}\nDate: ${data.travelDate}\nGuests: ${data.adults} adults, ${data.children} children\n\nPlease confirm my booking.`
        );
        window.open(`https://wa.me/94777721999?text=${whatsappMessage}`, '_blank');
      } else {
        toast({
          title: 'Booking Failed',
          description: result.message,
          variant: 'destructive'
        });
      }
    } catch (error) {
      console.error('Booking error:', error);
      toast({
        title: 'Error',
        description: 'Something went wrong. Please try again or contact us directly.',
        variant: 'destructive'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Filter parks by category
  const filteredParks = selectedCategory === 'all'
    ? nationalParks
    : nationalParks.filter(park =>
      park.slug.toLowerCase().includes(selectedCategory.toLowerCase()) ||
      park.name.toLowerCase().includes(selectedCategory.toLowerCase())
    );

  // Structured data for SEO
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "TouristAttraction",
    "name": "Sri Lanka National Parks Safari Tours",
    "description": "Book wildlife safari tours at Yala, Udawalawe, Wilpattu, Minneriya and more Sri Lanka national parks. See leopards, elephants, and exotic birds.",
    "image": "https://images.unsplash.com/photo-1549366021-9f761d040a94?w=1200",
    "offers": nationalParks.map(park => ({
      "@type": "Offer",
      "name": `${park.name} Safari`,
      "price": park.fees.entrance_fee + park.fees.jeep_hire,
      "priceCurrency": "USD",
      "availability": "InStock"
    }))
  };

  return (
    <>
      <Helmet>
        <title>National Parks Safari Tours Sri Lanka | Book Wildlife Safaris | Recharge Travels</title>
        <meta
          name="description"
          content="Book wildlife safari tours at Yala, Udawalawe, Wilpattu, Minneriya national parks. See leopards, elephants & exotic birds. Best prices guaranteed. Book online now!"
        />
        <meta name="keywords" content="Sri Lanka safari, Yala national park, Udawalawe elephants, Wilpattu leopards, wildlife tours, book safari online, Minneriya, leopard safari" />
        <meta property="og:title" content="National Parks Safari Tours Sri Lanka | Recharge Travels" />
        <meta property="og:description" content="Book wildlife safari tours at Yala, Udawalawe, Wilpattu, Minneriya national parks. See leopards, elephants & exotic birds." />
        <meta property="og:image" content="https://images.unsplash.com/photo-1549366021-9f761d040a94?w=1200" />
        <meta property="og:url" content="https://www.rechargetravels.com/tours/wildtours/parks" />
        <meta property="og:type" content="website" />
        <meta property="og:locale" content="en_US" />
        <meta property="og:site_name" content="Recharge Travels" />
        <meta name="twitter:card" content="summary_large_image" />
        <link rel="canonical" href="https://www.rechargetravels.com/tours/wildtours/parks" />

        {/* Main Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>

        {/* Breadcrumb Schema */}
        <script type="application/ld+json">
          {JSON.stringify(createBreadcrumbSchema([
            { name: 'Home', url: COMPANY.url },
            { name: 'Tours', url: `${COMPANY.url}/tours` },
            { name: 'Wildlife Tours', url: `${COMPANY.url}/tours/wildtours` },
            { name: 'National Parks', url: `${COMPANY.url}/tours/wildtours/parks` }
          ]))}
        </script>

        {/* Organization Schema */}
        <script type="application/ld+json">
          {JSON.stringify(createOrganizationSchema())}
        </script>

        {/* HowTo Schema - Book Safari */}
        <script type="application/ld+json">
          {JSON.stringify(createHowToSchema(
            'How to Book a Safari in Sri Lanka',
            'Complete guide to booking a wildlife safari at Sri Lanka national parks including Yala, Udawalawe, Wilpattu, and Minneriya.',
            [
              { name: 'Choose Your Park', text: 'Select from Yala (best for leopards), Udawalawe (elephants), Wilpattu (pristine wilderness), Minneriya (elephant gathering), or Bundala (birds).' },
              { name: 'Select Safari Time', text: 'Morning safaris (5:30 AM) offer best wildlife sightings. Afternoon safaris (2:00 PM) have great light. Full-day includes lunch.' },
              { name: 'Book Online or Call', text: 'Use the booking form above or call Recharge Travels at +94777721999. WhatsApp available for instant confirmation.' },
              { name: 'Choose Your Vehicle', text: 'Private jeep ($50+ surcharge) for flexibility, or shared safari for budget-friendly option. All jeeps are 4x4 with experienced trackers.' },
              { name: 'Confirm & Prepare', text: 'Receive email confirmation with itinerary. Bring binoculars, camera, hat, sunscreen, and neutral-colored clothing.' }
            ],
            { totalTime: 'PT6H', estimatedCost: '65', currency: 'USD' }
          ))}
        </script>

        {/* Speakable Schema for Voice Search */}
        <script type="application/ld+json">
          {JSON.stringify(createSpeakableSchema(
            'https://www.rechargetravels.com/tours/wildtours/parks',
            ['h1', '.hero-description', '.safari-intro']
          ))}
        </script>

        {/* Collection Page Schema with Safari Tours */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            "@id": "https://www.rechargetravels.com/tours/wildtours/parks#collection",
            "name": "Sri Lanka National Parks Safari Tours",
            "description": "Browse and book wildlife safari tours at all major Sri Lanka national parks. Yala, Udawalawe, Wilpattu, Minneriya, Bundala safaris available.",
            "url": "https://www.rechargetravels.com/tours/wildtours/parks",
            "image": "https://images.unsplash.com/photo-1549366021-9f761d040a94?w=1200",
            "mainEntity": {
              "@type": "ItemList",
              "itemListElement": nationalParks.map((park, index) => ({
                "@type": "ListItem",
                "position": index + 1,
                "item": {
                  "@type": "TouristTrip",
                  "name": `${park.name} Safari`,
                  "description": park.description,
                  "image": park.image,
                  "offers": {
                    "@type": "Offer",
                    "price": park.fees.entrance_fee + park.fees.jeep_hire,
                    "priceCurrency": "USD",
                    "availability": "https://schema.org/InStock"
                  },
                  "touristType": "Wildlife Tourism"
                }
              }))
            },
            "provider": {
              "@type": "TravelAgency",
              "name": COMPANY.name,
              "url": COMPANY.url,
              "telephone": COMPANY.phone
            },
            "aggregateRating": {
              "@type": "AggregateRating",
              "ratingValue": 4.9,
              "reviewCount": 847,
              "bestRating": 5,
              "worstRating": 1
            }
          })}
        </script>

        {/* FAQ Schema for Safari Tours */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": [
              {
                "@type": "Question",
                "name": "What is the best national park for leopard sighting in Sri Lanka?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Yala National Park has the highest density of leopards in the world. Block 1 offers the best sightings, especially during morning safaris (5:30 AM). Book early as Yala has daily visitor limits."
                }
              },
              {
                "@type": "Question",
                "name": "When is the best time for safari in Sri Lanka?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "The dry season (February-October) is best for wildlife viewing. Morning safaris (5:30-10:00 AM) offer optimal conditions. The Minneriya elephant gathering is spectacular from July to October."
                }
              },
              {
                "@type": "Question",
                "name": "How much does a safari cost in Sri Lanka?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Safari costs vary by park. Expect $65-150 per person including entrance fees, jeep hire, and tracker. Private jeeps cost more but offer flexibility. Contact Recharge Travels at +94777721999 for best rates."
                }
              },
              {
                "@type": "Question",
                "name": "What should I bring on a safari in Sri Lanka?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Essential items: binoculars, camera with zoom lens, hat, sunscreen, insect repellent, water, and neutral-colored clothing. Early morning can be cool, so bring a light jacket."
                }
              }
            ]
          })}
        </script>
      </Helmet>

      <Header />

      {/* Hero Section */}
      <section className="relative min-h-[70vh] overflow-hidden bg-gradient-to-br from-emerald-900 via-green-800 to-teal-900">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1549366021-9f761d040a94?w=1920"
            alt="Sri Lanka Safari"
            className="w-full h-full object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        </div>

        <div className="relative z-10 container mx-auto px-4 py-24 flex items-center min-h-[70vh]">
          <div className="max-w-4xl">
            <Badge className="mb-4 bg-amber-500/90 text-white border-0">
              <Binoculars className="w-4 h-4 mr-2" />
              Wildlife Safari Tours
            </Badge>
            <h1 className="text-5xl md:text-7xl font-playfair font-bold text-white mb-6">
              Sri Lanka National Parks
              <span className="block text-amber-400">Safari Adventures</span>
            </h1>
            <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-2xl font-montserrat">
              Experience world-class wildlife at Yala, Udawalawe, Wilpattu & more.
              Book your safari online with instant confirmation.
            </p>

            {/* Quick Stats */}
            <div className="flex flex-wrap gap-6 mb-8">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg px-6 py-3">
                <div className="text-3xl font-bold text-amber-400">{nationalParks.length}+</div>
                <div className="text-white/80 text-sm">National Parks</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg px-6 py-3">
                <div className="text-3xl font-bold text-amber-400">100+</div>
                <div className="text-white/80 text-sm">Wildlife Species</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg px-6 py-3">
                <div className="text-3xl font-bold text-amber-400">4.9/5</div>
                <div className="text-white/80 text-sm">Customer Rating</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg px-6 py-3">
                <div className="text-3xl font-bold text-amber-400">24/7</div>
                <div className="text-white/80 text-sm">Support</div>
              </div>
            </div>

            <div className="flex flex-wrap gap-4">
              <Button
                size="lg"
                onClick={() => document.getElementById('parks-grid')?.scrollIntoView({ behavior: 'smooth' })}
                className="bg-amber-500 hover:bg-amber-600 text-black font-semibold px-8 py-6 text-lg rounded-full"
              >
                <Calendar className="w-5 h-5 mr-2" />
                Book Safari Now
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-gray-900 px-8 py-6 text-lg rounded-full"
                asChild
              >
                <a href="https://wa.me/94777721999?text=Hi! I want to book a safari tour" target="_blank">
                  <MessageCircle className="w-5 h-5 mr-2" />
                  WhatsApp Us
                </a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Category Filter */}
      <section className="py-8 bg-gradient-to-b from-emerald-50 to-white sticky top-0 z-40 shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap gap-3 justify-center">
            {parkCategories.map((cat) => {
              const Icon = cat.icon;
              return (
                <Button
                  key={cat.value}
                  variant={selectedCategory === cat.value ? 'default' : 'outline'}
                  onClick={() => setSelectedCategory(cat.value)}
                  className={`rounded-full ${selectedCategory === cat.value
                      ? 'bg-emerald-600 hover:bg-emerald-700'
                      : 'border-emerald-200 hover:bg-emerald-50'
                    }`}
                >
                  <Icon className="w-4 h-4 mr-2" />
                  {cat.label}
                </Button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Parks Grid */}
      <section id="parks-grid" className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-playfair font-bold text-gray-900 mb-4">
              Choose Your Safari Destination
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Each park offers unique wildlife experiences. Click "Book Safari" to reserve your spot.
            </p>
          </div>

          {loading ? (
            <div className="flex justify-center py-16">
              <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredParks.map((park) => (
                <Card
                  key={park.id}
                  className="overflow-hidden hover:shadow-2xl transition-all duration-300 group border-2 border-transparent hover:border-emerald-200"
                >
                  {/* Image */}
                  <div className="relative h-56 overflow-hidden">
                    <img
                      src={park.images[0]}
                      alt={park.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                    {/* Badges */}
                    <div className="absolute top-4 left-4 flex gap-2">
                      <Badge className="bg-emerald-500 text-white">
                        {park.classification}
                      </Badge>
                      {park.featured && (
                        <Badge className="bg-amber-500 text-white">
                          <Star className="w-3 h-3 mr-1" />
                          Featured
                        </Badge>
                      )}
                    </div>

                    {/* Price Badge */}
                    <div className="absolute bottom-4 right-4">
                      <Badge className="bg-white text-emerald-700 text-lg font-bold px-4 py-2">
                        From ${park.fees.entrance_fee + park.fees.jeep_hire}
                      </Badge>
                    </div>

                    {/* Province */}
                    <div className="absolute bottom-4 left-4 text-white flex items-center">
                      <MapPin className="w-4 h-4 mr-1" />
                      {park.province}
                    </div>
                  </div>

                  <CardContent className="p-6">
                    <h3 className="text-2xl font-playfair font-bold text-gray-900 mb-2">
                      {park.name}
                    </h3>
                    <p className="text-gray-600 mb-4 line-clamp-2">
                      {park.description}
                    </p>

                    {/* Key Attractions */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {park.attractions.slice(0, 4).map((attraction, idx) => (
                        <Badge key={idx} variant="secondary" className="capitalize">
                          {attraction}
                        </Badge>
                      ))}
                    </div>

                    {/* Info Grid */}
                    <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
                      <div className="flex items-center text-gray-600">
                        <Clock className="w-4 h-4 mr-2 text-emerald-600" />
                        {park.operatingHours.split(' - ')[0]}
                      </div>
                      <div className="flex items-center text-gray-600">
                        <MapPin className="w-4 h-4 mr-2 text-emerald-600" />
                        {park.location.distanceFromColombo}km
                      </div>
                      <div className="flex items-center text-gray-600">
                        <Calendar className="w-4 h-4 mr-2 text-emerald-600" />
                        {park.bestTimeToVisit.split(' ')[0]}
                      </div>
                      <div className="flex items-center text-amber-600 font-medium">
                        <Star className="w-4 h-4 mr-2 fill-amber-400" />
                        {park.featured ? 'Top Rated' : 'Popular'}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3">
                      <Button
                        className="flex-1 bg-emerald-600 hover:bg-emerald-700"
                        onClick={() => openBookingModal(park)}
                      >
                        <Calendar className="w-4 h-4 mr-2" />
                        Book Safari
                      </Button>
                      <Button
                        variant="outline"
                        className="border-emerald-200"
                        asChild
                      >
                        <Link to={`/tours/wildtours/parks/${park.slug}`}>
                          <Eye className="w-4 h-4" />
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Why Book With Us */}
      <section className="py-16 bg-gradient-to-r from-emerald-600 to-teal-600 text-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-playfair font-bold mb-4">
              Why Book Your Safari With Us?
            </h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8" />
              </div>
              <h3 className="font-bold mb-2">Secure Booking</h3>
              <p className="text-white/80 text-sm">Safe & encrypted payments</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <DollarSign className="w-8 h-8" />
              </div>
              <h3 className="font-bold mb-2">Best Price</h3>
              <p className="text-white/80 text-sm">Price match guarantee</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8" />
              </div>
              <h3 className="font-bold mb-2">Expert Guides</h3>
              <p className="text-white/80 text-sm">Certified wildlife experts</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageCircle className="w-8 h-8" />
              </div>
              <h3 className="font-bold mb-2">24/7 Support</h3>
              <p className="text-white/80 text-sm">WhatsApp assistance</p>
            </div>
          </div>
        </div>
      </section>

      {/* Booking Modal */}
      <Dialog open={showBookingModal} onOpenChange={setShowBookingModal}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-playfair flex items-center gap-2">
              <TreePine className="w-6 h-6 text-emerald-600" />
              Book Safari - {selectedTour && ('slug' in selectedTour ? selectedTour.name : selectedTour.title)}
            </DialogTitle>
            <DialogDescription>
              Complete your booking details below. All fields marked * are required.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 mt-4">
            {/* Price Summary */}
            <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl p-4 border border-emerald-100">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-gray-600">Estimated Total</p>
                  <p className="text-3xl font-bold text-emerald-600">
                    ${totalPrice}
                    <span className="text-sm font-normal text-gray-500 ml-1">USD</span>
                  </p>
                </div>
                <div className="text-right text-sm text-gray-600">
                  <p>Adults: {adults || 0}</p>
                  <p>Children: {children || 0}</p>
                </div>
              </div>
            </div>

            {/* Safari Details */}
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-emerald-600" />
                Safari Details
              </h3>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Travel Date *</Label>
                  <Input
                    type="date"
                    min={getMinDate()}
                    {...register('travelDate')}
                    className={errors.travelDate ? 'border-red-500' : ''}
                  />
                  {errors.travelDate && (
                    <p className="text-red-500 text-xs mt-1">{errors.travelDate.message}</p>
                  )}
                </div>

                <div>
                  <Label>Safari Time *</Label>
                  <Select
                    defaultValue="morning"
                    onValueChange={(val) => setValue('safariTime', val as 'morning' | 'afternoon' | 'fullday')}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="morning">
                        <span className="flex items-center gap-2">
                          <Sunrise className="w-4 h-4" /> Morning (6AM-12PM)
                        </span>
                      </SelectItem>
                      <SelectItem value="afternoon">
                        <span className="flex items-center gap-2">
                          <Sunset className="w-4 h-4" /> Afternoon (2PM-6PM)
                        </span>
                      </SelectItem>
                      <SelectItem value="fullday">
                        <span className="flex items-center gap-2">
                          <Sun className="w-4 h-4" /> Full Day (+50%)
                        </span>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label>Adults *</Label>
                  <Select
                    defaultValue="2"
                    onValueChange={(val) => setValue('adults', parseInt(val))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(n => (
                        <SelectItem key={n} value={n.toString()}>{n}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Children (5-12)</Label>
                  <Select
                    defaultValue="0"
                    onValueChange={(val) => setValue('children', parseInt(val))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {[0, 1, 2, 3, 4, 5].map(n => (
                        <SelectItem key={n} value={n.toString()}>{n}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Infants (0-4)</Label>
                  <Select
                    defaultValue="0"
                    onValueChange={(val) => setValue('infants', parseInt(val))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {[0, 1, 2, 3].map(n => (
                        <SelectItem key={n} value={n.toString()}>{n}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Vehicle & Guide */}
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                <Car className="w-5 h-5 text-emerald-600" />
                Vehicle & Guide Options
              </h3>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Vehicle Type *</Label>
                  <Select
                    defaultValue="shared"
                    onValueChange={(val) => setValue('vehicleType', val as 'shared' | 'private')}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="shared">Shared Jeep</SelectItem>
                      <SelectItem value="private">Private Jeep (+$50)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-end">
                  <label className="flex items-center gap-2 cursor-pointer p-3 border rounded-lg hover:bg-gray-50">
                    <Checkbox
                      checked={includeGuide}
                      onCheckedChange={(checked) => setValue('includeGuide', checked as boolean)}
                    />
                    <span>Expert Guide (+$25)</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Personal Details */}
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                <User className="w-5 h-5 text-emerald-600" />
                Personal Details
              </h3>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>First Name *</Label>
                  <Input
                    {...register('firstName')}
                    placeholder="John"
                    className={errors.firstName ? 'border-red-500' : ''}
                  />
                  {errors.firstName && (
                    <p className="text-red-500 text-xs mt-1">{errors.firstName.message}</p>
                  )}
                </div>
                <div>
                  <Label>Last Name *</Label>
                  <Input
                    {...register('lastName')}
                    placeholder="Doe"
                    className={errors.lastName ? 'border-red-500' : ''}
                  />
                  {errors.lastName && (
                    <p className="text-red-500 text-xs mt-1">{errors.lastName.message}</p>
                  )}
                </div>
              </div>

              <div>
                <Label>Email Address *</Label>
                <Input
                  type="email"
                  {...register('email')}
                  placeholder="john@example.com"
                  className={errors.email ? 'border-red-500' : ''}
                />
                {errors.email && (
                  <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Phone / WhatsApp *</Label>
                  <Input
                    {...register('phone')}
                    placeholder="+1 234 567 8900"
                    className={errors.phone ? 'border-red-500' : ''}
                  />
                  {errors.phone && (
                    <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>
                  )}
                </div>
                <div>
                  <Label>Nationality *</Label>
                  <Select onValueChange={(val) => setValue('nationality', val)}>
                    <SelectTrigger className={errors.nationality ? 'border-red-500' : ''}>
                      <SelectValue placeholder="Select country" />
                    </SelectTrigger>
                    <SelectContent>
                      {countries.map(country => (
                        <SelectItem key={country} value={country}>{country}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.nationality && (
                    <p className="text-red-500 text-xs mt-1">{errors.nationality.message}</p>
                  )}
                </div>
              </div>

              <div>
                <Label>Pickup Location / Hotel Name *</Label>
                <Input
                  {...register('pickupLocation')}
                  placeholder="e.g., Cinnamon Wild Yala, Tissamaharama"
                  className={errors.pickupLocation ? 'border-red-500' : ''}
                />
                {errors.pickupLocation && (
                  <p className="text-red-500 text-xs mt-1">{errors.pickupLocation.message}</p>
                )}
              </div>

              <div>
                <Label>Special Requests</Label>
                <Textarea
                  {...register('specialRequests')}
                  placeholder="Any special requirements, dietary needs, accessibility needs..."
                  rows={3}
                />
              </div>
            </div>

            {/* Terms */}
            <div className="space-y-3 pt-4 border-t">
              <div className="flex items-start gap-2">
                <Checkbox
                  id="terms"
                  onCheckedChange={(checked) => setValue('agreeToTerms', checked as boolean)}
                />
                <label htmlFor="terms" className="text-sm text-gray-600 leading-tight">
                  I agree to the{' '}
                  <Link to="/terms" className="text-emerald-600 hover:underline">Terms & Conditions</Link>
                  {' '}and{' '}
                  <Link to="/privacy" className="text-emerald-600 hover:underline">Cancellation Policy</Link>
                </label>
              </div>
              {errors.agreeToTerms && (
                <p className="text-red-500 text-xs">{errors.agreeToTerms.message}</p>
              )}
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white py-6 text-lg font-semibold"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-5 h-5 mr-2" />
                  Confirm Safari Booking - ${totalPrice}
                </>
              )}
            </Button>

            {/* Trust Indicators */}
            <div className="flex items-center justify-center gap-4 pt-4 text-xs text-gray-500">
              <span className="flex items-center gap-1">
                <Shield className="w-4 h-4 text-emerald-600" />
                Secure Booking
              </span>
              <span className="flex items-center gap-1">
                <DollarSign className="w-4 h-4 text-emerald-600" />
                Best Price
              </span>
              <span className="flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Instant Confirmation
              </span>
            </div>

            {/* WhatsApp CTA */}
            <div className="text-center pt-4 border-t">
              <p className="text-sm text-gray-600 mb-2">Need help with your booking?</p>
              <a
                href="https://wa.me/94777721999?text=Hi, I need help booking a safari"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-green-600 hover:text-green-700 font-medium"
              >
                <MessageCircle className="w-5 h-5" />
                Chat on WhatsApp
              </a>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <Footer />
    </>
  );
};

export default NationalParksTours;
