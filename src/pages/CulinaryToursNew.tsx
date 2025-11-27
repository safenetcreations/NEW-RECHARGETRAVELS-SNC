import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Calendar, MapPin, Users, Star, ChefHat, Flame, Utensils, 
  Clock, Heart, Share2, Filter, Search, Play, X,
  Check, Award, Globe, Leaf, ShoppingBag, Camera, TrendingUp, MessageCircle 
} from 'lucide-react';
import { collection, getDocs, query, where, orderBy, addDoc, updateDoc, doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface CulinaryTour {
  id: string;
  title: string;
  description: string;
  location: string;
  duration: string;
  price: number;
  image: string;
  rating: number;
  reviews: number;
  category: string;
  highlights: string[];
  difficulty: string;
  maxGroupSize: number;
  included: string[];
  menu?: string[];
  chef?: string;
  featured?: boolean;
  videoUrl?: string;
  gallery?: string[];
  availability?: string;
}

interface Review {
  id: string;
  tourId: string;
  userName: string;
  userAvatar?: string;
  rating: number;
  comment: string;
  date: string;
  helpful: number;
}

interface Booking {
  tourId: string;
  tourTitle: string;
  date: string;
  guests: number;
  specialRequests?: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
}

const CulinaryToursNew = () => {
  const [tours, setTours] = useState<CulinaryTour[]>([]);
  const [filteredTours, setFilteredTours] = useState<CulinaryTour[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [priceFilter, setPriceFilter] = useState('all');
  const [selectedTour, setSelectedTour] = useState<CulinaryTour | null>(null);
  const [bookingDialogOpen, setBookingDialogOpen] = useState(false);
  const [wishlist, setWishlist] = useState<string[]>([]);
  
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  // Fetch tours from Firebase
  useEffect(() => {
    fetchTours();
    fetchReviews();
  }, []);

  // Filter tours whenever filters change
  useEffect(() => {
    filterTours();
  }, [tours, selectedCategory, searchQuery, priceFilter]);

  const fetchTours = async () => {
    try {
      setLoading(true);
      const toursRef = collection(db, 'culinary_tours');
      const q = query(toursRef, where('is_active', '==', true), orderBy('featured', 'desc'));
      const snapshot = await getDocs(q);
      
      const toursData: CulinaryTour[] = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as CulinaryTour));

      // If no tours in Firebase, use default data
      if (toursData.length === 0) {
        setTours(defaultCulinaryTours);
      } else {
        setTours(toursData);
      }
    } catch (error) {
      console.error('Error fetching tours:', error);
      setTours(defaultCulinaryTours);
      toast({
        title: "Info",
        description: "Using default tour data",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchReviews = async () => {
    try {
      const reviewsRef = collection(db, 'culinary_reviews');
      const q = query(reviewsRef, orderBy('date', 'desc'));
      const snapshot = await getDocs(q);
      
      const reviewsData: Review[] = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      } as Review));

      setReviews(reviewsData);
    } catch (error) {
      console.error('Error fetching reviews:', error);
    }
  };

  const filterTours = () => {
    let filtered = [...tours];

    // Category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(tour => tour.category === selectedCategory);
    }

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(tour => 
        tour.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tour.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tour.location.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Price filter
    if (priceFilter !== 'all') {
      switch (priceFilter) {
        case 'budget':
          filtered = filtered.filter(tour => tour.price < 50);
          break;
        case 'mid':
          filtered = filtered.filter(tour => tour.price >= 50 && tour.price < 100);
          break;
        case 'premium':
          filtered = filtered.filter(tour => tour.price >= 100);
          break;
      }
    }

    setFilteredTours(filtered);
  };

  const handleBooking = async (bookingData: Booking) => {
    try {
      if (!user) {
        toast({
          title: "Login Required",
          description: "Please login to book a culinary experience",
          variant: "destructive",
        });
        navigate('/login');
        return;
      }

      const bookingsRef = collection(db, 'culinary_bookings');
      await addDoc(bookingsRef, {
        ...bookingData,
        userId: user.uid,
        status: 'pending',
        createdAt: new Date().toISOString(),
      });

      toast({
        title: "Booking Submitted!",
        description: "Your culinary experience has been booked. We'll contact you soon.",
      });

      setBookingDialogOpen(false);
    } catch (error) {
      console.error('Error creating booking:', error);
      toast({
        title: "Error",
        description: "Failed to submit booking. Please try again.",
        variant: "destructive",
      });
    }
  };

  const toggleWishlist = (tourId: string) => {
    setWishlist(prev => 
      prev.includes(tourId) 
        ? prev.filter(id => id !== tourId)
        : [...prev, tourId]
    );
    
    toast({
      title: wishlist.includes(tourId) ? "Removed from wishlist" : "Added to wishlist",
    });
  };

  const getTourReviews = (tourId: string) => {
    return reviews.filter(review => review.tourId === tourId);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 flex items-center justify-center">
        <div className="text-center">
          <ChefHat className="w-16 h-16 mx-auto mb-4 text-orange-600 animate-bounce" />
          <p className="text-xl font-semibold text-gray-700">Loading Culinary Adventures...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Culinary Tours in Sri Lanka - Authentic Food Experiences | Recharge Travels</title>
        <meta name="description" content="Discover Sri Lanka's rich culinary heritage through authentic cooking classes, street food tours, spice garden visits, and fine dining experiences. Book your culinary adventure today!" />
        <meta name="keywords" content="Sri Lankan food tours, cooking classes Sri Lanka, spice tours, food experiences, culinary tourism" />
        <meta property="og:title" content="Culinary Tours in Sri Lanka - Recharge Travels" />
        <meta property="og:description" content="Savor the authentic flavors and spices of Sri Lankan cuisine with our culinary tours." />
        <meta property="og:type" content="website" />
      </Helmet>
      
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50">
        <Header />
        
        {/* Hero Section */}
        <section className="relative h-[90vh] flex items-center justify-center overflow-hidden">
          <div 
            className="absolute inset-0 bg-cover bg-center transform scale-105"
            style={{
              backgroundImage: `url('https://images.unsplash.com/photo-1596040033229-a9821ebd058d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80')`,
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-b from-orange-900/70 via-orange-800/60 to-orange-900/80" />
          </div>
          
          <div className="relative z-10 text-center text-white px-4 max-w-5xl mx-auto">
            <div className="mb-6 flex justify-center gap-2 animate-fade-in">
              <Badge className="bg-orange-500/90 text-white px-4 py-2 text-sm backdrop-blur-sm">
                <Award className="w-4 h-4 mr-2 inline" />
                Award Winning Experiences
              </Badge>
              <Badge className="bg-amber-500/90 text-white px-4 py-2 text-sm backdrop-blur-sm">
                <TrendingUp className="w-4 h-4 mr-2 inline" />
                100+ Happy Foodies
              </Badge>
            </div>
            
            <h1 className="text-7xl md:text-8xl font-cinzel font-bold mb-6 animate-fade-in leading-tight">
              Flavors of
              <span className="block bg-gradient-to-r from-yellow-300 via-amber-200 to-orange-300 bg-clip-text text-transparent">
                Ceylon
              </span>
            </h1>
            
            <p className="text-2xl md:text-3xl font-playfair mb-8 animate-fade-in opacity-90 leading-relaxed">
              Embark on a gastronomic odyssey through Sri Lanka's<br />
              aromatic spice gardens and ancient culinary traditions
            </p>
            
            <div className="flex flex-wrap justify-center gap-4 animate-scale-in">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white px-10 py-7 text-lg rounded-full shadow-2xl transform hover:scale-105 transition-all duration-300"
                onClick={() => document.getElementById('experiences')?.scrollIntoView({ behavior: 'smooth' })}
              >
                <ChefHat className="mr-2 w-5 h-5" />
                Explore Experiences
              </Button>
              
              <Button 
                size="lg" 
                variant="outline"
                className="bg-white/10 backdrop-blur-md border-2 border-white/50 text-white hover:bg-white/20 px-10 py-7 text-lg rounded-full shadow-2xl transform hover:scale-105 transition-all duration-300"
              >
                <Play className="mr-2 w-5 h-5" />
                Watch Video Tour
              </Button>
            </div>
            
            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-8 mt-16 max-w-3xl mx-auto">
              {[
                { icon: ChefHat, label: 'Expert Chefs', value: '25+' },
                { icon: Globe, label: 'Locations', value: '15+' },
                { icon: Star, label: 'Rating', value: '4.9' }
              ].map((stat, idx) => (
                <div key={idx} className="text-center backdrop-blur-md bg-white/10 rounded-2xl p-6 transform hover:scale-110 transition-all duration-300">
                  <stat.icon className="w-10 h-10 mx-auto mb-3 text-amber-300" />
                  <div className="text-4xl font-bold mb-1">{stat.value}</div>
                  <div className="text-sm opacity-90">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
            <ChefHat className="w-10 h-10 text-white" />
          </div>
        </section>

        {/* Search & Filter Bar */}
        <section className="sticky top-16 z-40 bg-white/95 backdrop-blur-lg shadow-lg border-b border-orange-100">
          <div className="container mx-auto px-4 py-6">
            <div className="flex flex-wrap gap-4 items-center justify-between">
              {/* Search */}
              <div className="relative flex-1 min-w-[250px]">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  placeholder="Search culinary experiences..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 pr-4 py-6 rounded-full border-2 border-orange-200 focus:border-orange-500 bg-white shadow-sm"
                />
              </div>

              {/* Filters */}
              <div className="flex gap-3 flex-wrap">
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-[180px] rounded-full border-2 border-orange-200 bg-white shadow-sm">
                    <Filter className="w-4 h-4 mr-2" />
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="cooking-class">Cooking Classes</SelectItem>
                    <SelectItem value="street-food">Street Food Tours</SelectItem>
                    <SelectItem value="fine-dining">Fine Dining</SelectItem>
                    <SelectItem value="spice-garden">Spice Gardens</SelectItem>
                    <SelectItem value="tea-experience">Tea Experiences</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={priceFilter} onValueChange={setPriceFilter}>
                  <SelectTrigger className="w-[160px] rounded-full border-2 border-orange-200 bg-white shadow-sm">
                    <SelectValue placeholder="Price Range" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Prices</SelectItem>
                    <SelectItem value="budget">Under $50</SelectItem>
                    <SelectItem value="mid">$50 - $100</SelectItem>
                    <SelectItem value="premium">$100+</SelectItem>
                  </SelectContent>
                </Select>

                <Badge className="px-4 py-2 bg-orange-100 text-orange-800 text-sm">
                  {filteredTours.length} {filteredTours.length === 1 ? 'Experience' : 'Experiences'}
                </Badge>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Tours */}
        <section id="experiences" className="py-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <Badge className="mb-4 px-6 py-2 bg-gradient-to-r from-orange-500 to-amber-500 text-white text-sm">
                CURATED EXPERIENCES
              </Badge>
              <h2 className="text-6xl font-cinzel font-bold bg-gradient-to-r from-orange-800 via-amber-700 to-orange-600 bg-clip-text text-transparent mb-6">
                Culinary Adventures
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto font-playfair leading-relaxed">
                From bustling street markets to intimate cooking sessions with master chefs,
                discover the rich tapestry of Sri Lankan gastronomy
              </p>
            </div>

            <Tabs defaultValue="all" className="space-y-8">
              <TabsList className="grid w-full max-w-3xl mx-auto grid-cols-3 md:grid-cols-6 gap-2 bg-white/50 p-2 rounded-2xl">
                <TabsTrigger value="all" className="rounded-xl">All</TabsTrigger>
                <TabsTrigger value="cooking" className="rounded-xl">Cooking</TabsTrigger>
                <TabsTrigger value="street" className="rounded-xl">Street Food</TabsTrigger>
                <TabsTrigger value="fine" className="rounded-xl">Fine Dining</TabsTrigger>
                <TabsTrigger value="spice" className="rounded-xl">Spice Tours</TabsTrigger>
                <TabsTrigger value="tea" className="rounded-xl">Tea</TabsTrigger>
              </TabsList>

              <TabsContent value="all" className="space-y-8">
                <TourGrid tours={filteredTours} onSelectTour={setSelectedTour} wishlist={wishlist} onToggleWishlist={toggleWishlist} />
              </TabsContent>
            </Tabs>
          </div>
        </section>

        {/* Why Choose Us */}
        <section className="py-20 bg-gradient-to-br from-orange-900 to-amber-800 text-white relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-96 h-96 bg-yellow-400 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-orange-400 rounded-full blur-3xl"></div>
          </div>
          
          <div className="container mx-auto px-4 relative z-10">
            <div className="text-center mb-16">
              <h2 className="text-5xl font-cinzel font-bold mb-6">Why Our Culinary Tours?</h2>
              <p className="text-xl opacity-90 max-w-2xl mx-auto">
                Experience authentic Sri Lankan cuisine with expert guidance and exclusive access
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                { 
                  icon: Award, 
                  title: 'Expert Chefs', 
                  description: 'Learn from award-winning local chefs with decades of experience' 
                },
                { 
                  icon: Leaf, 
                  title: 'Fresh Ingredients', 
                  description: 'Organic produce from local markets and our own spice gardens' 
                },
                { 
                  icon: Users, 
                  title: 'Small Groups', 
                  description: 'Intimate experiences with maximum 8-10 participants' 
                },
                { 
                  icon: Check, 
                  title: 'Authentic Recipes', 
                  description: 'Traditional family recipes passed down through generations' 
                }
              ].map((feature, idx) => (
                <Card key={idx} className="bg-white/10 backdrop-blur-lg border-white/20 hover:bg-white/20 transition-all duration-300 transform hover:scale-105">
                  <CardContent className="p-8 text-center">
                    <feature.icon className="w-16 h-16 mx-auto mb-4 text-amber-300" />
                    <h3 className="text-2xl font-bold mb-3">{feature.title}</h3>
                    <p className="opacity-90">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-5xl font-cinzel font-bold text-gray-900 mb-6">What Food Lovers Say</h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Real experiences from travelers who've tasted Sri Lanka
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {defaultReviews.slice(0, 3).map((review, idx) => (
                <Card key={idx} className="hover:shadow-2xl transition-all duration-300 border-2 border-orange-100">
                  <CardContent className="p-8">
                    <div className="flex items-center mb-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-amber-500 rounded-full flex items-center justify-center text-white font-bold text-lg mr-4">
                        {review.userName[0]}
                      </div>
                      <div>
                        <div className="font-bold text-gray-900">{review.userName}</div>
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className={`w-4 h-4 ${i < review.rating ? 'text-yellow-500 fill-current' : 'text-gray-300'}`} />
                          ))}
                        </div>
                      </div>
                    </div>
                    <p className="text-gray-700 leading-relaxed mb-4">{review.comment}</p>
                    <p className="text-sm text-gray-500">{review.date}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-20 bg-gradient-to-r from-orange-600 via-amber-600 to-orange-500 text-white">
          <div className="container mx-auto px-4 text-center">
            <ChefHat className="w-20 h-20 mx-auto mb-6 animate-bounce" />
            <h2 className="text-5xl font-cinzel font-bold mb-6">Ready to Taste Sri Lanka?</h2>
            <p className="text-2xl mb-8 opacity-90 max-w-2xl mx-auto">
              Join us for an unforgettable culinary journey through the flavors of Ceylon
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button 
                size="lg" 
                className="bg-white text-orange-600 hover:bg-gray-100 px-10 py-7 text-lg rounded-full shadow-2xl transform hover:scale-105 transition-all duration-300"
                onClick={() => document.getElementById('experiences')?.scrollIntoView({ behavior: 'smooth' })}
              >
                Book Your Experience
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                className="border-2 border-white text-white hover:bg-white/10 px-10 py-7 text-lg rounded-full shadow-2xl transform hover:scale-105 transition-all duration-300"
              >
                <MessageCircle className="mr-2 w-5 h-5" />
                Chat with Expert
              </Button>
            </div>
          </div>
        </section>
      </div>

      <Footer />

      {/* Booking Dialog */}
      {selectedTour && (
        <BookingDialog
          tour={selectedTour}
          open={bookingDialogOpen}
          onOpenChange={setBookingDialogOpen}
          onBook={handleBooking}
        />
      )}
    </>
  );
};

// Tour Grid Component
const TourGrid = ({ tours, onSelectTour, wishlist, onToggleWishlist }: any) => {
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
      {tours.map((tour: CulinaryTour) => (
        <Card 
          key={tour.id} 
          className="group hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 bg-white border-2 border-orange-100 overflow-hidden"
        >
          <div className="relative overflow-hidden h-64">
            <img 
              src={tour.image} 
              alt={tour.title}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            {/* Badges */}
            <div className="absolute top-4 left-4 flex gap-2">
              {tour.featured && (
                <Badge className="bg-gradient-to-r from-yellow-500 to-amber-500 text-white">
                  <Award className="w-3 h-3 mr-1" />
                  Featured
                </Badge>
              )}
              <Badge className="bg-orange-600 text-white">
                {tour.category}
              </Badge>
            </div>

            {/* Wishlist */}
            <button
              onClick={() => onToggleWishlist(tour.id)}
              className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full p-2 hover:bg-white transition-all duration-300 transform hover:scale-110"
            >
              <Heart 
                className={`w-5 h-5 ${wishlist.includes(tour.id) ? 'text-red-500 fill-current' : 'text-gray-600'}`} 
              />
            </button>

            {/* Rating */}
            <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-full px-4 py-2 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
              <Star className="w-4 h-4 text-yellow-500 fill-current" />
              <span className="font-semibold text-gray-900">{tour.rating}</span>
              <span className="text-sm text-gray-600">({tour.reviews})</span>
            </div>
          </div>

          <CardHeader className="pb-3">
            <CardTitle className="text-2xl font-cinzel text-gray-900 group-hover:text-orange-600 transition-colors">
              {tour.title}
            </CardTitle>
            <div className="flex items-center text-gray-600">
              <MapPin className="w-4 h-4 mr-2 text-orange-500" />
              <span className="text-sm">{tour.location}</span>
            </div>
          </CardHeader>

          <CardContent className="space-y-4">
            <p className="text-gray-600 leading-relaxed line-clamp-2">
              {tour.description}
            </p>

            {/* Tour Details */}
            <div className="flex flex-wrap gap-3 text-sm text-gray-600">
              <div className="flex items-center">
                <Clock className="w-4 h-4 mr-1 text-orange-500" />
                {tour.duration}
              </div>
              <div className="flex items-center">
                <Users className="w-4 h-4 mr-1 text-orange-500" />
                Max {tour.maxGroupSize}
              </div>
              {tour.chef && (
                <div className="flex items-center">
                  <ChefHat className="w-4 h-4 mr-1 text-orange-500" />
                  {tour.chef}
                </div>
              )}
            </div>

            {/* Highlights */}
            <div className="flex flex-wrap gap-2">
              {tour.highlights.slice(0, 3).map((highlight, i) => (
                <Badge key={i} variant="outline" className="text-xs border-orange-300 text-orange-700">
                  {highlight}
                </Badge>
              ))}
            </div>

            {/* Price & Book */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-200">
              <div className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">
                ${tour.price}
                <span className="text-sm font-normal text-gray-500">/person</span>
              </div>
              <Dialog>
                <DialogTrigger asChild>
                  <Button 
                    className="bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white rounded-full px-6 shadow-lg transform hover:scale-105 transition-all duration-300"
                    onClick={() => onSelectTour(tour)}
                  >
                    Book Now
                  </Button>
                </DialogTrigger>
                <BookingDialogContent tour={tour} />
              </Dialog>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

// Booking Dialog Component
const BookingDialogContent = ({ tour }: { tour: CulinaryTour }) => {
  const [bookingData, setBookingData] = useState({
    date: '',
    guests: 1,
    contactName: '',
    contactEmail: '',
    contactPhone: '',
    specialRequests: '',
  });

  return (
    <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle className="text-2xl font-cinzel">{tour.title}</DialogTitle>
        <DialogDescription>
          Complete your booking for this culinary experience
        </DialogDescription>
      </DialogHeader>

      <div className="space-y-6 py-4">
        {/* Tour Summary */}
        <div className="bg-orange-50 rounded-lg p-4 border border-orange-200">
          <div className="flex justify-between items-start mb-3">
            <div>
              <div className="font-semibold text-gray-900">{tour.location}</div>
              <div className="text-sm text-gray-600">{tour.duration}</div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-orange-600">${tour.price}</div>
              <div className="text-sm text-gray-600">per person</div>
            </div>
          </div>
          
          {tour.highlights && (
            <div className="flex flex-wrap gap-2 mt-3">
              {tour.highlights.slice(0, 4).map((highlight, i) => (
                <Badge key={i} className="bg-orange-100 text-orange-800 text-xs">
                  <Check className="w-3 h-3 mr-1" />
                  {highlight}
                </Badge>
              ))}
            </div>
          )}
        </div>

        {/* Booking Form */}
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Date</label>
              <Input 
                type="date" 
                value={bookingData.date}
                onChange={(e) => setBookingData({...bookingData, date: e.target.value})}
                className="border-orange-200 focus:border-orange-500"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Number of Guests</label>
              <Input 
                type="number" 
                min="1" 
                max={tour.maxGroupSize}
                value={bookingData.guests}
                onChange={(e) => setBookingData({...bookingData, guests: parseInt(e.target.value)})}
                className="border-orange-200 focus:border-orange-500"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Full Name</label>
            <Input 
              placeholder="Your full name"
              value={bookingData.contactName}
              onChange={(e) => setBookingData({...bookingData, contactName: e.target.value})}
              className="border-orange-200 focus:border-orange-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Email</label>
              <Input 
                type="email"
                placeholder="your@email.com"
                value={bookingData.contactEmail}
                onChange={(e) => setBookingData({...bookingData, contactEmail: e.target.value})}
                className="border-orange-200 focus:border-orange-500"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Phone</label>
              <Input 
                type="tel"
                placeholder="+94 XX XXX XXXX"
                value={bookingData.contactPhone}
                onChange={(e) => setBookingData({...bookingData, contactPhone: e.target.value})}
                className="border-orange-200 focus:border-orange-500"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Special Requests (Optional)</label>
            <Textarea 
              placeholder="Dietary restrictions, allergies, or special requirements..."
              rows={3}
              value={bookingData.specialRequests}
              onChange={(e) => setBookingData({...bookingData, specialRequests: e.target.value})}
              className="border-orange-200 focus:border-orange-500 resize-none"
            />
          </div>
        </div>

        {/* Total Price */}
        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
          <div className="flex justify-between items-center mb-2">
            <span className="text-gray-600">Price per person</span>
            <span className="font-semibold">${tour.price}</span>
          </div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-gray-600">Number of guests</span>
            <span className="font-semibold">× {bookingData.guests}</span>
          </div>
          <div className="border-t border-gray-300 pt-2 mt-2">
            <div className="flex justify-between items-center">
              <span className="text-lg font-bold">Total</span>
              <span className="text-2xl font-bold text-orange-600">
                ${tour.price * bookingData.guests}
              </span>
            </div>
          </div>
        </div>

        <Button 
          className="w-full bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white py-6 text-lg rounded-full shadow-lg"
        >
          Confirm Booking
        </Button>
      </div>
    </DialogContent>
  );
};

const BookingDialog = ({ tour, open, onOpenChange, onBook }: any) => {
  return null; // Placeholder, actual implementation in BookingDialogContent
};

// Default data (fallback)
const defaultCulinaryTours: CulinaryTour[] = [
  {
    id: '1',
    title: "Colombo Street Food Safari",
    location: "Colombo",
    image: "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?ixlib=rb-4.0.3",
    description: "Navigate bustling markets and street corners to taste authentic kottu, hoppers, and tropical fruits in Sri Lanka's vibrant capital.",
    highlights: ["Kottu Roti", "Hoppers", "Fresh Juices", "Local Markets"],
    price: 45,
    rating: 4.8,
    reviews: 124,
    category: "street-food",
    duration: "4 hours",
    difficulty: "Easy",
    maxGroupSize: 10,
    included: ["Local guide", "All food tastings", "Transportation", "Market tour"],
    chef: "Chef Perera",
    featured: true,
  },
  {
    id: '2',
    title: "Royal Palace Dining Experience",
    location: "Kandy",
    image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?ixlib=rb-4.0.3",
    description: "Experience a regal feast with traditional Kandyan cuisine served on banana leaves in an authentic palace setting.",
    highlights: ["Royal Recipes", "Banana Leaf Serving", "Cultural Performance", "Palace Setting"],
    price: 125,
    rating: 4.9,
    reviews: 89,
    category: "fine-dining",
    duration: "3 hours",
    difficulty: "Easy",
    maxGroupSize: 8,
    included: ["Royal menu", "Cultural show", "Traditional setting", "Welcome drink"],
    chef: "Chef Ranjith",
    featured: true,
  },
  {
    id: '3',
    title: "Spice Garden Tour & Cooking Class",
    location: "Matale",
    image: "https://images.unsplash.com/photo-1506976785307-8732e854ad03?ixlib=rb-4.0.3",
    description: "Walk through aromatic spice gardens, learn about Ceylon's spice heritage, and cook authentic curries with fresh ingredients.",
    highlights: ["Spice Garden Walk", "Hands-on Cooking", "Farm Lunch", "Recipe Book"],
    price: 75,
    rating: 4.7,
    reviews: 156,
    category: "cooking-class",
    duration: "5 hours",
    difficulty: "Moderate",
    maxGroupSize: 12,
    included: ["Spice tour", "Cooking class", "Lunch", "Spice samples"],
    chef: "Chef Kumari",
    featured: true,
  },
  {
    id: '4',
    title: "Ceylon Tea Plantation High Tea",
    location: "Nuwara Eliya",
    image: "https://images.unsplash.com/photo-1571934811356-5cc061b6821f?ixlib=rb-4.0.3",
    description: "Savor colonial-style high tea with Ceylon's finest teas and traditional cakes in the misty hill country.",
    highlights: ["Ceylon Tea", "Colonial Setting", "Fresh Scones", "Mountain Views"],
    price: 55,
    rating: 4.6,
    reviews: 98,
    category: "tea-experience",
    duration: "2.5 hours",
    difficulty: "Easy",
    maxGroupSize: 15,
    included: ["Tea tasting", "High tea menu", "Factory tour", "Scenic views"],
    featured: false,
  },
  {
    id: '5',
    title: "Fisherman's Feast",
    location: "Negombo",
    image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?ixlib=rb-4.0.3",
    description: "Join local fishermen for the catch of the day and learn to prepare fresh seafood curries by the beach.",
    highlights: ["Fresh Seafood", "Fishing Experience", "Coastal Cooking", "Beach Setting"],
    price: 85,
    rating: 4.8,
    reviews: 72,
    category: "cooking-class",
    duration: "6 hours",
    difficulty: "Moderate",
    maxGroupSize: 8,
    included: ["Fishing trip", "Cooking class", "Lunch", "Beach access"],
    chef: "Chef Fernando",
  },
  {
    id: '6',
    title: "Village Home Cooking",
    location: "Rural Villages",
    image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?ixlib=rb-4.0.3",
    description: "Learn family recipes passed down through generations in authentic village homes with local families.",
    highlights: ["Family Recipes", "Village Life", "Traditional Methods", "Home Setting"],
    price: 65,
    rating: 4.9,
    reviews: 134,
    category: "cooking-class",
    duration: "5 hours",
    difficulty: "Easy",
    maxGroupSize: 6,
    included: ["Village tour", "Cooking session", "Traditional meal", "Cultural immersion"],
    featured: false,
  },
];

const defaultReviews: Review[] = [
  {
    id: '1',
    tourId: '1',
    userName: 'Sarah Johnson',
    rating: 5,
    comment: 'An absolutely incredible experience! Chef Perera showed us hidden gems in Colombo that we would never have found on our own. The kottu was the best I\'ve ever tasted!',
    date: 'November 2024',
    helpful: 24,
  },
  {
    id: '2',
    tourId: '2',
    userName: 'Michael Chen',
    rating: 5,
    comment: 'The Royal Palace Dining was magical. The combination of authentic cuisine, traditional dance, and the stunning palace setting made this an unforgettable evening.',
    date: 'October 2024',
    helpful: 18,
  },
  {
    id: '3',
    tourId: '3',
    userName: 'Emma Williams',
    rating: 5,
    comment: 'Chef Kumari is amazing! Learning to cook in the spice garden surrounded by cinnamon and cardamom plants was a dream. The recipes are now family favorites at home.',
    date: 'November 2024',
    helpful: 31,
  },
];

export default CulinaryToursNew;
