import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import {
  ChefHat, MapPin, Clock, Users, Star, Calendar, Search, Filter,
  Heart, Play, Check, X, ArrowRight, Loader2, Phone, MessageCircle,
  Utensils, Flame, Globe, Award, Camera, ShoppingBag
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { db } from '@/lib/firebase';
import { collection, getDocs, addDoc, query, Timestamp } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { sendBookingConfirmation } from '@/services/notificationService';

// Types
interface CulinaryTour {
  id: string;
  title: string;
  subtitle?: string;
  description: string;
  location: string;
  duration: string;
  price: number;
  originalPrice?: number;
  image: string;
  gallery?: string[];
  rating: number;
  reviews: number;
  category: string;
  highlights: string[];
  included: string[];
  excluded?: string[];
  itinerary?: { title: string; description: string }[];
  maxGroupSize: number;
  difficulty: string;
  languages?: string[];
  startTime?: string;
  featured?: boolean;
  isActive?: boolean;
}

interface BookingForm {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  nationality: string;
  travelDate: string;
  adults: number;
  children: number;
  pickupLocation: string;
  dietaryRequirements: string;
  specialRequests: string;
}

// Default tours data
const DEFAULT_TOURS: CulinaryTour[] = [
  {
    id: 'colombo-street-food',
    title: 'Colombo Street Food Safari',
    subtitle: 'Taste authentic flavors of Sri Lanka\'s capital',
    description: 'Embark on a gastronomic adventure through Colombo\'s bustling streets. Visit hidden gems, taste 10+ authentic dishes, and learn about Sri Lankan culinary traditions from a local food expert.',
    location: 'Colombo',
    duration: '4 hours',
    price: 65,
    originalPrice: 85,
    image: 'https://images.unsplash.com/photo-1567337710282-00832b415979?w=800',
    gallery: ['https://images.unsplash.com/photo-1596797038530-2c107229654b?w=800', 'https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?w=800'],
    rating: 4.9,
    reviews: 127,
    category: 'street-food',
    highlights: ['Visit 6+ authentic food stalls', 'Taste 10+ Sri Lankan dishes', 'Learn about local spices', 'Small group (max 8)', 'Vegetarian options available'],
    included: ['All food tastings', 'Bottled water', 'Local guide', 'Market visits', 'Recipe cards'],
    excluded: ['Hotel pickup', 'Alcoholic beverages', 'Tips'],
    maxGroupSize: 8,
    difficulty: 'Easy',
    languages: ['English', 'Sinhala'],
    startTime: '10:00 AM',
    featured: true,
    isActive: true
  },
  {
    id: 'village-cooking-class',
    title: 'Village Cooking Class',
    subtitle: 'Learn authentic recipes in a rural home',
    description: 'Step into a traditional Sri Lankan kitchen and learn to cook authentic dishes from a local family. Shop at the market, pick fresh ingredients from the garden, and master the art of Sri Lankan cooking.',
    location: 'Kandy',
    duration: '6 hours',
    price: 95,
    image: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=800',
    gallery: ['https://images.unsplash.com/photo-1507048331197-7d4ac70811cf?w=800'],
    rating: 4.8,
    reviews: 89,
    category: 'cooking-class',
    highlights: ['Visit local market', 'Pick fresh ingredients', 'Cook 5 traditional dishes', 'Learn family recipes', 'Enjoy lunch together'],
    included: ['All ingredients', 'Cooking instruction', 'Full lunch', 'Recipe booklet', 'Apron to keep', 'Hotel pickup in Kandy'],
    excluded: ['Drinks', 'Tips'],
    maxGroupSize: 6,
    difficulty: 'Easy',
    startTime: '9:00 AM',
    featured: true,
    isActive: true
  },
  {
    id: 'tea-plantation-experience',
    title: 'Tea Plantation Experience',
    subtitle: 'From leaf to cup in Sri Lanka\'s hill country',
    description: 'Discover the world of Ceylon Tea in the misty hills of Nuwara Eliya. Tour a working plantation, learn the art of tea picking, visit a factory, and enjoy a traditional high tea with stunning mountain views.',
    location: 'Nuwara Eliya',
    duration: '5 hours',
    price: 75,
    image: 'https://images.unsplash.com/photo-1582793988951-9aed5509eb97?w=800',
    rating: 4.7,
    reviews: 156,
    category: 'tea-experience',
    highlights: ['Tour working plantation', 'Try tea picking', 'Factory visit', 'Tea tasting session', 'High tea with views'],
    included: ['Plantation tour', 'Factory visit', 'High tea', 'Tea gift pack', 'Guide'],
    excluded: ['Transport', 'Tips'],
    maxGroupSize: 10,
    difficulty: 'Easy',
    startTime: '10:00 AM',
    featured: false,
    isActive: true
  },
  {
    id: 'seafood-beach-bbq',
    title: 'Seafood Beach BBQ',
    subtitle: 'Fresh catch cooked on the shore',
    description: 'Join local fishermen for an unforgettable beach BBQ experience. Watch the catch come in, help prepare the freshest seafood, and dine under the stars on Mirissa\'s beautiful beach.',
    location: 'Mirissa',
    duration: '4 hours',
    price: 85,
    image: 'https://images.unsplash.com/photo-1559742811-822873691df8?w=800',
    rating: 4.9,
    reviews: 78,
    category: 'seafood',
    highlights: ['Meet local fishermen', 'Select fresh catch', 'Beach BBQ cooking', 'Sunset dining', 'Unlimited seafood'],
    included: ['All seafood', 'Sides & salads', 'Soft drinks', 'Beach setup', 'Local guide'],
    excluded: ['Transport', 'Alcohol', 'Tips'],
    maxGroupSize: 12,
    difficulty: 'Easy',
    startTime: '4:00 PM',
    featured: true,
    isActive: true
  },
  {
    id: 'spice-garden-tour',
    title: 'Spice Garden & Cooking',
    subtitle: 'Explore the flavors of Ceylon spices',
    description: 'Visit an authentic spice garden in Matale and discover the secrets behind Sri Lanka\'s famous spices. Learn about medicinal properties, watch cooking demonstrations, and create your own spice blend.',
    location: 'Matale',
    duration: '3 hours',
    price: 45,
    image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=800',
    rating: 4.6,
    reviews: 203,
    category: 'spice-tour',
    highlights: ['Guided garden tour', 'Learn 20+ spices', 'Cooking demo', 'Create spice blend', 'Ayurveda introduction'],
    included: ['Garden tour', 'Spice samples', 'Cooking demo', 'Light refreshments', 'Spice gift'],
    excluded: ['Transport', 'Full meal'],
    maxGroupSize: 15,
    difficulty: 'Easy',
    startTime: '9:00 AM or 2:00 PM',
    featured: false,
    isActive: true
  },
  {
    id: 'galle-fort-food-walk',
    title: 'Galle Fort Food Walk',
    subtitle: 'Colonial heritage meets local flavors',
    description: 'Explore the UNESCO-listed Galle Fort while sampling its culinary delights. From Dutch-era cafes to hidden local eateries, discover the unique fusion of colonial and Sri Lankan cuisine.',
    location: 'Galle',
    duration: '3.5 hours',
    price: 55,
    image: 'https://images.unsplash.com/photo-1552566626-52f8b828add9?w=800',
    rating: 4.8,
    reviews: 92,
    category: 'food-walk',
    highlights: ['6 food stops', 'Historic fort tour', 'Colonial cafes', 'Local street food', 'Sunset views'],
    included: ['All food tastings', 'Water', 'Guide', 'Fort history tour'],
    excluded: ['Transport', 'Tips'],
    maxGroupSize: 10,
    difficulty: 'Easy',
    startTime: '4:00 PM',
    featured: false,
    isActive: true
  }
];

const CATEGORIES = [
  { id: 'all', label: 'All Experiences', icon: ChefHat },
  { id: 'street-food', label: 'Street Food', icon: Utensils },
  { id: 'cooking-class', label: 'Cooking Class', icon: Flame },
  { id: 'tea-experience', label: 'Tea Experience', icon: Globe },
  { id: 'seafood', label: 'Seafood', icon: ShoppingBag },
  { id: 'spice-tour', label: 'Spice Tours', icon: Award }
];

const CulinaryToursNew = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [tours, setTours] = useState<CulinaryTour[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTour, setSelectedTour] = useState<CulinaryTour | null>(null);
  const [showBooking, setShowBooking] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState<string | null>(null);
  const [confirmedBookingDetails, setConfirmedBookingDetails] = useState<{
    ref: string;
    tourTitle: string;
    tourLocation: string;
    date: string;
    adults: number;
    children: number;
    total: number;
    name: string;
    email: string;
    phone: string;
  } | null>(null);
  
  const [booking, setBooking] = useState<BookingForm>({
    customerName: '', customerEmail: '', customerPhone: '', nationality: '',
    travelDate: '', adults: 2, children: 0, pickupLocation: '',
    dietaryRequirements: '', specialRequests: ''
  });

  useEffect(() => { loadTours(); }, []);

  const loadTours = async () => {
    setLoading(true);
    try {
      // Simple query without composite index requirement
      const q = query(collection(db, 'culinary_tours'));
      const snap = await getDocs(q);
      if (snap.empty) {
        setTours(DEFAULT_TOURS);
      } else {
        // Filter and sort in JS to avoid index requirement
        const toursData = snap.docs
          .map(d => ({ id: d.id, ...d.data() } as CulinaryTour))
          .filter(t => t.isActive !== false)
          .sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
        setTours(toursData.length > 0 ? toursData : DEFAULT_TOURS);
      }
    } catch (e) {
      console.error('Tour fetch error:', e);
      setTours(DEFAULT_TOURS);
    }
    setLoading(false);
  };

  const filteredTours = tours.filter(t => {
    if (selectedCategory !== 'all' && t.category !== selectedCategory) return false;
    if (searchQuery && !t.title.toLowerCase().includes(searchQuery.toLowerCase()) && !t.location.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const featuredTours = tours.filter(t => t.featured);

  const updateBooking = (field: string, value: any) => setBooking(prev => ({ ...prev, [field]: value }));

  const handleBooking = async () => {
    if (!selectedTour || !booking.customerName || !booking.customerEmail || !booking.customerPhone || !booking.travelDate) {
      toast({ title: 'Please fill all required fields', variant: 'destructive' });
      return;
    }

    setSubmitting(true);
    try {
      const total = (booking.adults * selectedTour.price) + (booking.children * selectedTour.price * 0.5);
      const bookingRef = `CUL-${Date.now().toString(36).toUpperCase()}`;
      
      await addDoc(collection(db, 'culinary_bookings'), {
        bookingRef,
        tourId: selectedTour.id,
        tourTitle: selectedTour.title,
        tourCategory: 'culinary',
        ...booking,
        totalAmountUSD: total,
        pricePerPerson: selectedTour.price,
        status: 'pending',
        paymentStatus: 'unpaid',
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      });

      // Send notifications
      try {
        await sendBookingConfirmation({
          bookingRef,
          tourTitle: selectedTour.title,
          customerName: booking.customerName,
          customerEmail: booking.customerEmail,
          customerPhone: booking.customerPhone,
          travelDate: booking.travelDate,
          travellers: booking.adults + booking.children,
          totalAmount: total
        });
      } catch (e) { console.error('Notification error:', e); }

      // Save confirmed booking details for WhatsApp message
      setConfirmedBookingDetails({
        ref: bookingRef,
        tourTitle: selectedTour.title,
        tourLocation: selectedTour.location,
        date: booking.travelDate,
        adults: booking.adults,
        children: booking.children,
        total: total,
        name: booking.customerName,
        email: booking.customerEmail,
        phone: booking.customerPhone
      });

      setBookingSuccess(bookingRef);
    } catch (e) {
      console.error(e);
      toast({ title: 'Booking failed', variant: 'destructive' });
    }
    setSubmitting(false);
  };

  const openBooking = (tour: CulinaryTour) => {
    setSelectedTour(tour);
    setShowBooking(true);
    setBookingSuccess(null);
    setBooking({ customerName: '', customerEmail: '', customerPhone: '', nationality: '', travelDate: '', adults: 2, children: 0, pickupLocation: '', dietaryRequirements: '', specialRequests: '' });
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 to-orange-50"><Loader2 className="w-10 h-10 animate-spin text-amber-500" /></div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-orange-50">
      <Helmet><title>Culinary Tours Sri Lanka | Food Experiences | Recharge Travels</title></Helmet>
      <Header />

      {/* HERO */}
      <section className="relative py-20 px-4 bg-gradient-to-r from-amber-600 via-orange-500 to-red-500 z-0">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1567337710282-00832b415979?w=1920')] bg-cover bg-center opacity-20 z-0" />
        <div className="container mx-auto max-w-6xl relative z-10">
          <div className="text-center text-white">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <Badge className="bg-white/20 text-white mb-4"><ChefHat className="w-4 h-4 mr-1" />Culinary Experiences</Badge>
            </motion.div>
            <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-4xl md:text-6xl font-bold mb-4">
              Taste Sri Lanka
            </motion.h1>
            <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="text-xl text-white/90 max-w-2xl mx-auto mb-8">
              From street food safaris to cooking classes with local families, discover the authentic flavors of Ceylon
            </motion.p>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="flex flex-col sm:flex-row gap-4 justify-center max-w-xl mx-auto">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input placeholder="Search experiences..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="pl-10 h-12 bg-white/95 border-0 text-gray-800" />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="py-8 px-4 bg-white border-b relative z-0">
        <div className="container mx-auto max-w-6xl">
          <div className="flex gap-2 overflow-x-auto pb-2">
            {CATEGORIES.map(cat => (
              <Button key={cat.id} variant={selectedCategory === cat.id ? 'default' : 'outline'} onClick={() => setSelectedCategory(cat.id)} className={selectedCategory === cat.id ? 'bg-amber-500 hover:bg-amber-600' : ''}>
                <cat.icon className="w-4 h-4 mr-2" />{cat.label}
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURED */}
      {selectedCategory === 'all' && featuredTours.length > 0 && (
        <section className="py-12 px-4">
          <div className="container mx-auto max-w-6xl">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2"><Star className="w-6 h-6 text-amber-500" />Featured Experiences</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {featuredTours.slice(0, 2).map(tour => (
                <Card key={tour.id} className="overflow-hidden border-0 shadow-xl hover:shadow-2xl transition-all group">
                  <div className="relative h-64 cursor-pointer" onClick={() => openBooking(tour)}>
                    <img src={tour.image} alt={tour.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                    <Badge className="absolute top-4 left-4 bg-amber-500">Featured</Badge>
                    {tour.originalPrice && <Badge className="absolute top-4 right-4 bg-red-500">Save ${tour.originalPrice - tour.price}</Badge>}
                    <div className="absolute bottom-4 left-4 right-4 text-white">
                      <h3 className="text-2xl font-bold mb-1">{tour.title}</h3>
                      <p className="text-white/80 text-sm mb-2">{tour.subtitle}</p>
                      <div className="flex items-center gap-4 text-sm">
                        <span className="flex items-center gap-1"><MapPin className="w-4 h-4" />{tour.location}</span>
                        <span className="flex items-center gap-1"><Clock className="w-4 h-4" />{tour.duration}</span>
                        <span className="flex items-center gap-1"><Star className="w-4 h-4 fill-yellow-400" />{tour.rating}</span>
                      </div>
                    </div>
                  </div>
                  <CardContent className="p-4 flex justify-between items-center">
                    <div>
                      <span className="text-2xl font-bold text-amber-600">${tour.price}</span>
                      {tour.originalPrice && <span className="text-gray-400 line-through ml-2">${tour.originalPrice}</span>}
                      <span className="text-gray-500 text-sm"> / person</span>
                    </div>
                    <Button className="bg-amber-500 hover:bg-amber-600 relative z-10" onClick={(e) => { e.stopPropagation(); openBooking(tour); }}>Book Now <ArrowRight className="w-4 h-4 ml-2" /></Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ALL TOURS */}
      <section className="py-12 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">{selectedCategory === 'all' ? 'All Experiences' : CATEGORIES.find(c => c.id === selectedCategory)?.label} ({filteredTours.length})</h2>
          </div>
          
          {filteredTours.length === 0 ? (
            <Card className="p-12 text-center"><p className="text-gray-500">No experiences found. Try different filters.</p></Card>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTours.map(tour => (
                <motion.div key={tour.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                  <Card className="overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all h-full flex flex-col">
                    <div className="relative h-48 cursor-pointer" onClick={() => openBooking(tour)}>
                      <img src={tour.image} alt={tour.title} className="w-full h-full object-cover hover:scale-105 transition-transform" />
                      <div className="absolute top-3 right-3 flex gap-2">
                        <Badge className="bg-white/90 text-gray-800">{tour.difficulty}</Badge>
                      </div>
                      <div className="absolute bottom-3 left-3">
                        <Badge className="bg-amber-500 text-white">{tour.category.replace('-', ' ')}</Badge>
                      </div>
                    </div>
                    <CardContent className="p-4 flex-1 flex flex-col">
                      <h3 className="font-bold text-lg mb-1 cursor-pointer hover:text-amber-600" onClick={() => openBooking(tour)}>{tour.title}</h3>
                      <div className="flex items-center gap-3 text-sm text-gray-500 mb-3">
                        <span className="flex items-center gap-1"><MapPin className="w-4 h-4" />{tour.location}</span>
                        <span className="flex items-center gap-1"><Clock className="w-4 h-4" />{tour.duration}</span>
                      </div>
                      <p className="text-gray-600 text-sm mb-4 line-clamp-2 flex-1">{tour.description}</p>
                      <div className="flex items-center justify-between pt-3 border-t">
                        <div>
                          <span className="text-xl font-bold text-amber-600">${tour.price}</span>
                          <span className="text-gray-500 text-sm"> / person</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="flex items-center gap-1 text-sm"><Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />{tour.rating} ({tour.reviews})</span>
                        </div>
                      </div>
                      <Button className="w-full mt-4 bg-amber-500 hover:bg-amber-600 relative z-10" onClick={(e) => { e.stopPropagation(); e.preventDefault(); openBooking(tour); }}>Book Experience</Button>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* WHY CHOOSE */}
      <section className="py-16 px-4 bg-white">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose Our <span className="text-amber-500">Culinary Tours</span></h2>
          <div className="grid md:grid-cols-4 gap-6">
            {[
              { icon: Award, title: 'Local Experts', desc: 'Tours led by passionate local foodies' },
              { icon: Users, title: 'Small Groups', desc: 'Intimate experiences (max 8-12)' },
              { icon: Globe, title: 'Authentic', desc: 'Real local food, no tourist traps' },
              { icon: Camera, title: 'Memorable', desc: 'Insta-worthy moments guaranteed' }
            ].map((item, i) => (
              <Card key={i} className="text-center border-0 shadow-lg">
                <CardContent className="p-6">
                  <div className="w-14 h-14 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <item.icon className="w-7 h-7 text-amber-600" />
                  </div>
                  <h3 className="font-bold mb-2">{item.title}</h3>
                  <p className="text-gray-600 text-sm">{item.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 px-4 bg-amber-500">
        <div className="container mx-auto max-w-4xl text-center text-white">
          <h2 className="text-2xl font-bold mb-4">Can't Decide? Let Us Help!</h2>
          <p className="mb-6 text-amber-100">Our food experts can recommend the perfect culinary experience for you</p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Button size="lg" className="bg-white text-amber-600 hover:bg-amber-50" onClick={() => window.open('https://wa.me/94777721999?text=Hi! I need help choosing a culinary tour', '_blank')}>
              <MessageCircle className="w-5 h-5 mr-2" />WhatsApp Us
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 bg-transparent">
              <Phone className="w-5 h-5 mr-2" />+94 777 721 999
            </Button>
          </div>
        </div>
      </section>

      {/* CUSTOM BOOKING MODAL - No Dialog component */}
      <AnimatePresence>
        {showBooking && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowBooking(false)}
              style={{
                position: 'fixed',
                inset: 0,
                backgroundColor: 'rgba(0,0,0,0.6)',
                zIndex: 99998,
                backdropFilter: 'blur(4px)'
              }}
            />
            {/* Modal Container - Scrollable */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowBooking(false)}
              style={{
                position: 'fixed',
                inset: 0,
                zIndex: 99999,
                display: 'flex',
                alignItems: 'flex-start',
                justifyContent: 'center',
                padding: '20px',
                overflowY: 'auto'
              }}
            >
              <motion.div
                initial={{ scale: 0.95, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.95, y: 20 }}
                onClick={(e) => e.stopPropagation()}
                style={{
                  width: '100%',
                  maxWidth: '500px',
                  margin: '40px auto',
                  background: 'linear-gradient(to bottom right, #fffbeb, #fef9c3, #ffedd5)',
                  borderRadius: '12px',
                  padding: '24px',
                  boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                  position: 'relative'
                }}
              >
              {/* Close Button */}
              <button
                onClick={() => setShowBooking(false)}
                style={{
                  position: 'absolute',
                  top: '16px',
                  right: '16px',
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '4px'
                }}
              >
                <X className="w-5 h-5 text-amber-700" />
              </button>

              {/* Title */}
              <h2 className="text-xl font-bold text-amber-900 mb-4">
                {bookingSuccess ? '🎉 Booking Confirmed!' : `Book: ${selectedTour?.title}`}
              </h2>

              {bookingSuccess && confirmedBookingDetails ? (
                <div className="text-center py-6">
                  <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Check className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">Thank You!</h3>
                  <p className="text-lg font-mono text-amber-600 mb-2">{confirmedBookingDetails.ref}</p>
                  <p className="text-gray-600 mb-6">Your booking has been confirmed!</p>
                  <div className="flex gap-3 justify-center flex-wrap">
                    <Button variant="outline" className="bg-white" onClick={() => { setShowBooking(false); setBookingSuccess(null); setConfirmedBookingDetails(null); }}>Close</Button>
                    <Button className="bg-green-500 hover:bg-green-600 text-white" onClick={() => {
                      const d = confirmedBookingDetails;
                      const msg = `🍽️ *Culinary Tour Booking Confirmed!*

📋 *Booking Ref:* ${d.ref}
🎯 *Tour:* ${d.tourTitle}
📍 *Location:* ${d.tourLocation}
📅 *Date:* ${d.date}
👥 *Guests:* ${d.adults} adults${d.children > 0 ? `, ${d.children} children` : ''}
💰 *Total:* $${d.total.toFixed(0)}

👤 *Name:* ${d.name}
📧 *Email:* ${d.email}
📱 *Phone:* ${d.phone}

Thank you for booking with Recharge Travels! 🙏`;
                      window.open(`https://wa.me/94777721999?text=${encodeURIComponent(msg)}`, '_blank');
                    }}>
                      <MessageCircle className="w-4 h-4 mr-2" />Save to WhatsApp
                    </Button>
                  </div>
                </div>
              ) : selectedTour && (
                <div className="space-y-4">
                  {/* Tour Info */}
                  <div className="p-4 rounded-lg flex gap-4 border border-amber-300" style={{ background: 'linear-gradient(to right, #fef3c7, #fef9c3)' }}>
                    <img src={selectedTour.image} alt="" className="w-20 h-20 rounded-lg object-cover shadow-md" />
                    <div>
                      <h4 className="font-semibold text-amber-900">{selectedTour.title}</h4>
                      <p className="text-sm text-amber-700">{selectedTour.location} • {selectedTour.duration}</p>
                      <p className="text-amber-600 font-bold text-lg">${selectedTour.price} / person</p>
                    </div>
                  </div>

                  {/* Form */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="col-span-2"><label className="text-sm font-medium block mb-1 text-amber-800">Full Name *</label><Input value={booking.customerName} onChange={e => updateBooking('customerName', e.target.value)} className="bg-white border-amber-200 focus:border-amber-400" /></div>
                    <div><label className="text-sm font-medium block mb-1 text-amber-800">Email *</label><Input type="email" value={booking.customerEmail} onChange={e => updateBooking('customerEmail', e.target.value)} className="bg-white border-amber-200 focus:border-amber-400" /></div>
                    <div><label className="text-sm font-medium block mb-1 text-amber-800">Phone *</label><Input value={booking.customerPhone} onChange={e => updateBooking('customerPhone', e.target.value)} className="bg-white border-amber-200 focus:border-amber-400" /></div>
                    <div><label className="text-sm font-medium block mb-1 text-amber-800">Date *</label><Input type="date" value={booking.travelDate} onChange={e => updateBooking('travelDate', e.target.value)} className="bg-white border-amber-200 focus:border-amber-400" /></div>
                    <div><label className="text-sm font-medium block mb-1 text-amber-800">Nationality</label><Input value={booking.nationality} onChange={e => updateBooking('nationality', e.target.value)} className="bg-white border-amber-200 focus:border-amber-400" /></div>
                    <div><label className="text-sm font-medium block mb-1 text-amber-800">Adults</label>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" className="bg-white border-amber-300 hover:bg-amber-100" onClick={() => updateBooking('adults', Math.max(1, booking.adults - 1))}>-</Button>
                        <span className="w-8 text-center font-semibold text-amber-900">{booking.adults}</span>
                        <Button variant="outline" size="sm" className="bg-white border-amber-300 hover:bg-amber-100" onClick={() => updateBooking('adults', booking.adults + 1)}>+</Button>
                      </div>
                    </div>
                    <div><label className="text-sm font-medium block mb-1 text-amber-800">Children</label>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" className="bg-white border-amber-300 hover:bg-amber-100" onClick={() => updateBooking('children', Math.max(0, booking.children - 1))}>-</Button>
                        <span className="w-8 text-center font-semibold text-amber-900">{booking.children}</span>
                        <Button variant="outline" size="sm" className="bg-white border-amber-300 hover:bg-amber-100" onClick={() => updateBooking('children', booking.children + 1)}>+</Button>
                      </div>
                    </div>
                    <div className="col-span-2"><label className="text-sm font-medium block mb-1 text-amber-800">Pickup Location</label><Input value={booking.pickupLocation} onChange={e => updateBooking('pickupLocation', e.target.value)} className="bg-white border-amber-200 focus:border-amber-400" /></div>
                    <div className="col-span-2"><label className="text-sm font-medium block mb-1 text-amber-800">Special Requests</label><Textarea value={booking.specialRequests} onChange={e => updateBooking('specialRequests', e.target.value)} rows={2} className="bg-white border-amber-200 focus:border-amber-400" /></div>
                  </div>

                  {/* Total */}
                  <div className="p-4 rounded-lg flex justify-between items-center border border-amber-300" style={{ background: '#fef3c7' }}>
                    <span className="text-amber-800 font-medium">Total ({booking.adults} adults{booking.children > 0 ? `, ${booking.children} children` : ''})</span>
                    <span className="text-2xl font-bold text-amber-700">${((booking.adults * selectedTour.price) + (booking.children * selectedTour.price * 0.5)).toFixed(0)}</span>
                  </div>

                  <div className="flex gap-3">
                    <Button variant="outline" className="flex-1 border-amber-300 hover:bg-amber-100 text-amber-800 bg-white" onClick={() => setShowBooking(false)}>Cancel</Button>
                    <Button className="flex-1 text-white bg-amber-500 hover:bg-amber-600" onClick={handleBooking} disabled={submitting}>
                      {submitting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                      {submitting ? 'Booking...' : 'Confirm Booking'}
                    </Button>
                  </div>
                </div>
              )}
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
};

export default CulinaryToursNew;
