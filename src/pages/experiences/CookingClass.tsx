import React, { useState, Suspense } from 'react';
import { Helmet } from 'react-helmet-async';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { motion, AnimatePresence } from 'framer-motion';
import {
  UtensilsCrossed,
  Clock,
  MapPin,
  Users,
  ChefHat,
  Star,
  CheckCircle,
  ArrowRight,
  Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

// Lazy load the booking wizard
const MultiStepBookingWizard = React.lazy(() => import('@/components/booking/MultiStepBookingWizard'));

// --- Data ---

interface CookingClassItem {
  id: string;
  city: string;
  title: string;
  description: string;
  price: number;
  duration: string;
  image: string;
  highlights: string[];
  rating: number;
  reviews: number;
}

const CITY_COOKING_CLASSES: CookingClassItem[] = [
  {
    id: 'colombo-cooking',
    city: 'Colombo',
    title: 'Urban Flavors & Seafood Market Tour',
    description: 'Dive into the bustling heart of Colombo. Visit the famous Pettah market to pick fresh seafood and spices, then cook a storm in a modern kitchen.',
    price: 55,
    duration: '4 Hours',
    image: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?q=80&w=600&auto=format&fit=crop',
    highlights: ['Pettah Market Visit', 'Crab Curry Masterclass', 'AC Kitchen'],
    rating: 4.8,
    reviews: 124
  },
  {
    id: 'dambulla-cooking',
    city: 'Dambulla',
    title: 'Village Mud House Cooking',
    description: 'Experience authentic rural life. Cook in a traditional clay house using firewood and clay pots. A truly rustic and grounding experience.',
    price: 45,
    duration: '3 Hours',
    image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?q=80&w=600&auto=format&fit=crop',
    highlights: ['Traditional Clay Pots', 'Organic Garden Picking', 'Village Walk'],
    rating: 4.9,
    reviews: 89
  },
  {
    id: 'kandy-cooking',
    city: 'Kandy',
    title: 'Hill Country Spice Garden Cooking',
    description: 'Surrounded by lush spice gardens, learn the medicinal and culinary uses of fresh spices before grinding them for your curry.',
    price: 50,
    duration: '3.5 Hours',
    image: 'https://images.unsplash.com/photo-1596797038530-2c107229654b?q=80&w=600&auto=format&fit=crop',
    highlights: ['Spice Garden Tour', 'Kandyan Chicken Curry', 'Mountain Views'],
    rating: 4.9,
    reviews: 210
  },
  {
    id: 'jaffna-cooking',
    city: 'Jaffna',
    title: 'Northern Crab Curry & Palmyrah Feast',
    description: 'Discover the distinct flavors of the North. Master the fiery Jaffna Crab Curry and learn to work with Palmyrah flour.',
    price: 60,
    duration: '4 Hours',
    image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?q=80&w=600&auto=format&fit=crop',
    highlights: ['Jaffna Crab Curry', 'Palmyrah Tasting', 'Tamil Cuisine'],
    rating: 5.0,
    reviews: 45
  },
  {
    id: 'nuwara-eliya-cooking',
    city: 'Nuwara Eliya',
    title: 'Tea Country Garden Fresh Cooking',
    description: 'Cook with cool-climate vegetables freshly picked from the garden. Enjoy a cozy meal with a cup of premium Ceylon tea.',
    price: 55,
    duration: '3 Hours',
    image: 'https://images.unsplash.com/photo-1625398407796-82650a8c135f?q=80&w=600&auto=format&fit=crop',
    highlights: ['Farm Fresh Veggies', 'High Tea Experience', 'Colonial Bungalow'],
    rating: 4.7,
    reviews: 76
  },
  {
    id: 'sigiriya-cooking',
    city: 'Sigiriya',
    title: 'Ancient Rock Shadow Traditional Lunch',
    description: 'Cook a grand lunch spread with a view of the Sigiriya Rock Fortress. Learn to make "Ambula" (sour fish curry) and lotus root curry.',
    price: 45,
    duration: '3 Hours',
    image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=600&auto=format&fit=crop',
    highlights: ['Rock Fortress View', 'Lotus Leaf Dining', 'Traditional Sweets'],
    rating: 4.8,
    reviews: 156
  },
  {
    id: 'bentota-cooking',
    city: 'Bentota',
    title: 'Coastal Seafood & Coconut Curry',
    description: 'Fresh from the ocean to the pot. Learn to clean and cook fresh fish, prawns, and calamari with freshly scraped coconut milk.',
    price: 65,
    duration: '4 Hours',
    image: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?q=80&w=600&auto=format&fit=crop',
    highlights: ['Fresh Catch Selection', 'Coconut Scraping', 'Beachside Dining'],
    rating: 4.9,
    reviews: 112
  }
];

const CookingClass = () => {
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [selectedClass, setSelectedClass] = useState<CookingClassItem | null>(null);

  const handleBook = (cookingClass: CookingClassItem) => {
    setSelectedClass(cookingClass);
    setIsBookingModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-stone-50 font-sans text-gray-900">
      <Helmet>
        <title>Sri Lankan Cooking Classes | Authentic Culinary Experiences</title>
        <meta name="description" content="Join authentic cooking classes across Sri Lanka. From Colombo to Kandy, learn to cook traditional curries with local experts." />
      </Helmet>

      <Header />

      {/* Hero Section */}
      <section className="relative h-[60vh] min-h-[500px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?q=80&w=1600&auto=format&fit=crop"
            alt="Sri Lankan Spices"
            className="w-full h-full object-cover"
            loading="eager"
            fetchPriority="high"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-stone-50" />
        </div>

        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto mt-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Badge className="bg-emerald-600 text-white hover:bg-emerald-700 mb-4 px-4 py-1 text-sm uppercase tracking-wider">
              Culinary Adventures
            </Badge>
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 drop-shadow-lg font-serif">
              Taste of Ceylon
            </h1>
            <p className="text-xl md:text-2xl text-white/90 font-light max-w-2xl mx-auto drop-shadow-md">
              Master the art of Sri Lankan cuisine in the country's most iconic cities.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Intro Section */}
      <section className="py-16 px-4 bg-stone-50">
        <div className="max-w-3xl mx-auto text-center">
          <UtensilsCrossed className="w-12 h-12 text-emerald-600 mx-auto mb-6" />
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6 font-serif">
            Cook Like a Local, Eat Like a King
          </h2>
          <p className="text-lg text-gray-600 leading-relaxed">
            Sri Lankan food is a symphony of spices, colors, and flavors. Our cooking classes aren't just about following a recipe; they are about immersing yourself in the culture. Choose your destination and discover the unique regional flavors that make this island a food lover's paradise.
          </p>
        </div>
      </section>

      {/* City Classes Grid */}
      <section className="py-12 px-4 md:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {CITY_COOKING_CLASSES.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="h-full border-none shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden bg-white group flex flex-col">
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                    loading="lazy"
                  />
                  <div className="absolute top-4 left-4">
                    <Badge className="bg-white/90 text-gray-900 hover:bg-white backdrop-blur-sm font-bold shadow-sm">
                      <MapPin className="w-3 h-3 mr-1 text-emerald-600" />
                      {item.city}
                    </Badge>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                    <div className="flex items-center text-white/90 text-sm">
                      <Clock className="w-4 h-4 mr-1" />
                      {item.duration}
                      <span className="mx-2">•</span>
                      <Users className="w-4 h-4 mr-1" />
                      Small Group
                    </div>
                  </div>
                </div>

                <CardContent className="p-6 flex-grow flex flex-col">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center text-amber-500 text-sm font-bold">
                      <Star className="w-4 h-4 fill-current mr-1" />
                      {item.rating} <span className="text-gray-400 font-normal ml-1">({item.reviews})</span>
                    </div>
                    <div className="text-xl font-bold text-emerald-700">
                      ${item.price}
                      <span className="text-sm text-gray-500 font-normal"> / person</span>
                    </div>
                  </div>

                  <h3 className="text-xl font-bold text-gray-900 mb-3 font-serif group-hover:text-emerald-700 transition-colors">
                    {item.title}
                  </h3>

                  <p className="text-gray-600 text-sm mb-6 line-clamp-3 flex-grow">
                    {item.description}
                  </p>

                  <div className="space-y-3 mb-6">
                    {item.highlights.map((highlight, idx) => (
                      <div key={idx} className="flex items-center text-sm text-gray-700">
                        <CheckCircle className="w-4 h-4 text-emerald-500 mr-2 flex-shrink-0" />
                        {highlight}
                      </div>
                    ))}
                  </div>

                  <Button
                    onClick={() => handleBook(item)}
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white shadow-md group-hover:shadow-lg transition-all"
                  >
                    Book Now <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 bg-emerald-900 text-white mt-12">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 font-serif">The Authentic Experience</h2>
            <p className="text-emerald-100 max-w-2xl mx-auto">
              We don't just teach you recipes; we invite you into our kitchens and our hearts.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div className="p-6 rounded-2xl bg-emerald-800/50 backdrop-blur-sm">
              <ChefHat className="w-12 h-12 mx-auto mb-4 text-emerald-300" />
              <h3 className="text-xl font-bold mb-2">Expert Local Chefs</h3>
              <p className="text-emerald-100/80">Learn from home cooks and professional chefs who have mastered these recipes over generations.</p>
            </div>
            <div className="p-6 rounded-2xl bg-emerald-800/50 backdrop-blur-sm">
              <UtensilsCrossed className="w-12 h-12 mx-auto mb-4 text-emerald-300" />
              <h3 className="text-xl font-bold mb-2">Hands-on Learning</h3>
              <p className="text-emerald-100/80">Grind spices, scrape coconut, and cook in clay pots. This is a full sensory experience.</p>
            </div>
            <div className="p-6 rounded-2xl bg-emerald-800/50 backdrop-blur-sm">
              <MapPin className="w-12 h-12 mx-auto mb-4 text-emerald-300" />
              <h3 className="text-xl font-bold mb-2">Stunning Locations</h3>
              <p className="text-emerald-100/80">From village mud houses to colonial bungalows, our settings are as memorable as the food.</p>
            </div>
          </div>
        </div>
      </section>

      <Footer />

      {/* Booking Modal */}
      {isBookingModalOpen && selectedClass && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
            onClick={() => setIsBookingModalOpen(false)}
          />
          <div className="relative w-full max-w-6xl h-[90vh] bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col">
            <Suspense fallback={
              <div className="flex items-center justify-center h-full">
                <Loader2 className="w-12 h-12 text-emerald-600 animate-spin" />
              </div>
            }>
              <MultiStepBookingWizard
                onClose={() => setIsBookingModalOpen(false)}
                initialTripType="experience"
                tourData={{
                  id: selectedClass.id,
                  name: selectedClass.title,
                  price: selectedClass.price,
                  image: selectedClass.image,
                  description: selectedClass.description,
                  duration: selectedClass.duration
                }}
              />
            </Suspense>
          </div>
        </div>
      )}
    </div>
  );
};

export default CookingClass;