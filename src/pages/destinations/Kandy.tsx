
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Crown, 
  Flower, 
  Music, 
  MapPin,
  Calendar,
  Clock,
  Star,
  ChevronDown,
  Wifi,
  Train,
  Utensils,
  Camera,
  Hotel,
  Heart,
  Users,
  DollarSign,
  Info,
  Sun,
  Cloud,
  Navigation,
  Building,
  ShoppingBag,
  TreePine,
  Mountain,
  Sparkles
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Link, useNavigate } from 'react-router-dom';
import DestinationMap from '@/components/destinations/DestinationMap';
import WeatherWidget from '@/components/destinations/WeatherWidget';
import { getDestinationBySlug } from '@/services/destinationContentService';
import {
  COMPANY,
  createTouristAttractionSchema,
  createBreadcrumbSchema,
  createOrganizationSchema,
  createHowToSchema,
  createSpeakableSchema
} from '@/utils/schemaMarkup';

// Kandy coordinates
const KANDY_CENTER = { lat: 7.2906, lng: 80.6337 };

interface HeroSlide {
  image: string;
  title: string;
  subtitle: string;
}

interface Attraction {
  name: string;
  description: string;
  image: string;
  category: string;
  rating: number;
  duration: string;
  price: string;
}

interface Activity {
  name: string;
  description: string;
  icon: any;
  price: string;
  duration: string;
  popular?: boolean;
}

interface DestinationInfo {
  population: string;
  area: string;
  elevation: string;
  bestTime: string;
  language: string;
  currency: string;
}

interface WeatherInfo {
  temperature: string;
  humidity: string;
  rainfall: string;
  season: string;
}

interface Restaurant {
  name: string;
  description: string;
  image: string;
  cuisine: string;
  priceRange: string;
  rating: number;
  address: string;
}

interface HotelItem {
  name: string;
  description: string;
  image: string;
  starRating: number;
  priceRange: string;
  amenities: string[];
  address: string;
}

interface TravelTip {
  title: string;
  content: string;
  icon?: string;
  category: string;
}

interface CTASection {
  title: string;
  subtitle: string;
  buttonText: string;
}

const Kandy = () => {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [selectedTab, setSelectedTab] = useState('attractions');

  const [heroSlides, setHeroSlides] = useState<HeroSlide[]>([
    {
      image: "https://images.unsplash.com/photo-1580541832626-2a7131ee809f?auto=format&fit=crop&q=80",
      title: "Discover Kandy",
      subtitle: "The Cultural Capital of Sri Lanka"
    },
    {
      image: "https://images.unsplash.com/photo-1595658658481-d53d3f999875?auto=format&fit=crop&q=80",
      title: "Sacred Temple of the Tooth",
      subtitle: "A UNESCO World Heritage Site"
    },
    {
      image: "https://images.unsplash.com/photo-1627894483216-2138af692e32?auto=format&fit=crop&q=80",
      title: "Hill Country Paradise",
      subtitle: "Where Culture Meets Nature"
    },
    {
      image: "https://images.unsplash.com/photo-1586077427825-15dca6b44dba?auto=format&fit=crop&q=80",
      title: "Kandy Lake",
      subtitle: "Serene Waters in the Heart of the City"
    },
    {
      image: "https://images.unsplash.com/photo-1588598198321-39f8c2be97ba?auto=format&fit=crop&q=80",
      title: "Royal Botanical Gardens",
      subtitle: "Peradeniya's Natural Splendor"
    }
  ]);

  const [attractions, setAttractions] = useState<Attraction[]>([
    {
      name: "Temple of the Tooth",
      description: "Sacred Buddhist temple housing the tooth relic of Buddha. A UNESCO World Heritage Site and the most important religious site in Sri Lanka",
      image: "https://images.unsplash.com/photo-1586077427825-15dca6b44dba?auto=format&fit=crop&q=80",
      category: "Religious Sites",
      rating: 4.9,
      duration: "2-3 hours",
      price: "$10"
    },
    {
      name: "Royal Botanical Gardens",
      description: "Stunning 147-acre botanical gardens featuring over 4000 species of plants, including orchids, spices, and medicinal plants",
      image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&q=80",
      category: "Nature & Gardens",
      rating: 4.7,
      duration: "3-4 hours",
      price: "$8"
    },
    {
      name: "Kandy Lake",
      description: "Artificial lake in the heart of the city built by the last Sinhalese king. Perfect for evening walks and scenic views",
      image: "https://images.unsplash.com/photo-1580387820444-8fded71cea81?auto=format&fit=crop&q=80",
      category: "Nature & Lakes",
      rating: 4.5,
      duration: "1-2 hours",
      price: "Free"
    },
    {
      name: "Bahiravokanda Vihara Buddha",
      description: "Giant Buddha statue overlooking the city of Kandy. Offers panoramic views of the entire Kandy valley",
      image: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&q=80",
      category: "Religious Sites",
      rating: 4.6,
      duration: "1-2 hours",
      price: "$3"
    },
    {
      name: "Cultural Dance Show",
      description: "Traditional Kandyan dance performances featuring fire dancing, drum performances, and acrobatic displays",
      image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&q=80",
      category: "Cultural Shows",
      rating: 4.8,
      duration: "1.5 hours",
      price: "$15"
    },
    {
      name: "Ceylon Tea Museum",
      description: "Learn about Sri Lanka's famous tea industry in this converted tea factory, including tea tasting sessions",
      image: "https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9?auto=format&fit=crop&q=80",
      category: "Museums",
      rating: 4.4,
      duration: "2 hours",
      price: "$5"
    }
  ]);

  const [activities, setActivities] = useState<Activity[]>([
    {
      name: "Temple & Culture Tour",
      description: "Comprehensive tour of sacred sites and cultural landmarks",
      icon: Crown,
      price: "From $45",
      duration: "Full Day",
      popular: true
    },
    {
      name: "Tea Plantation Visit",
      description: "Tour working tea estates and enjoy tastings",
      icon: TreePine,
      price: "From $30",
      duration: "Half Day"
    },
    {
      name: "Scenic Train Ride",
      description: "Famous train journey through hill country",
      icon: Train,
      price: "From $25",
      duration: "3 hours"
    },
    {
      name: "Traditional Cooking Class",
      description: "Learn to prepare authentic Sri Lankan dishes",
      icon: Utensils,
      price: "From $35",
      duration: "4 hours"
    },
    {
      name: "Nature Walk & Hiking",
      description: "Explore Udawatta Kele Sanctuary trails",
      icon: Mountain,
      price: "From $20",
      duration: "3 hours"
    },
    {
      name: "Night Photography Tour",
      description: "Capture illuminated temples and city lights",
      icon: Camera,
      price: "From $40",
      duration: "3 hours"
    }
  ]);

  const [destinationInfo, setDestinationInfo] = useState<DestinationInfo>({
    population: "125,400",
    area: "26.55 km²",
    elevation: "500 m",
    bestTime: "January to April",
    language: "Sinhala, Tamil, English",
    currency: "Sri Lankan Rupee (LKR)"
  });

  const [weatherInfo, setWeatherInfo] = useState<WeatherInfo>({
    temperature: "20-28°C",
    humidity: "75-85%",
    rainfall: "Moderate",
    season: "Tropical Highland"
  });

  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [hotels, setHotels] = useState<HotelItem[]>([]);
  const [travelTips, setTravelTips] = useState<TravelTip[]>([]);
  const [ctaSection, setCtaSection] = useState<CTASection>({
    title: "Ready to Explore Kandy?",
    subtitle:
      "Immerse yourself in Sri Lanka's cultural heritage with our expert guides and exclusive tours",
    buttonText: "Book Now",
  });

  // Load content from Firestore destination document
  useEffect(() => {
    const loadContent = async () => {
      try {
        const data = await getDestinationBySlug('kandy');

        if (data) {
          if (data.heroSlides && data.heroSlides.length) {
            setHeroSlides(data.heroSlides as HeroSlide[]);
          }
          if (data.attractions && data.attractions.length) {
            setAttractions(data.attractions as Attraction[]);
          }
          if (data.activities && data.activities.length) {
            setActivities(
              (data.activities as any[]).map((activity) => ({
                ...activity,
                icon: getIconComponent(activity.icon),
              }))
            );
          }
          if (data.destinationInfo) {
            setDestinationInfo(data.destinationInfo as DestinationInfo);
          }
          if (data.weatherInfo) {
            setWeatherInfo(data.weatherInfo as WeatherInfo);
          }
          if (data.restaurants) {
            setRestaurants(data.restaurants as Restaurant[]);
          }
          if (data.hotels) {
            setHotels(data.hotels as HotelItem[]);
          }
          if (data.travelTips) {
            setTravelTips(data.travelTips as TravelTip[]);
          }
          if (data.ctaSection) {
            setCtaSection(data.ctaSection as CTASection);
          }
        }
      } catch (error) {
        console.error('Error loading destination content:', error);
      }
    };

    loadContent();
  }, []);

  // Helper function to get icon component from string
  const getIconComponent = (iconName: string) => {
    const iconMap: { [key: string]: any } = {
      'Crown': Crown,
      'TreePine': TreePine,
      'Train': Train,
      'Utensils': Utensils,
      'Mountain': Mountain,
      'Camera': Camera,
      'Flower': Flower,
      'Music': Music,
      'Navigation': Navigation
    };
    return iconMap[iconName] || Crown;
  };

  // Auto-rotate hero slides
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [heroSlides.length]);

  const handleBooking = (service: string = 'Kandy Tour', tourData?: { id: string; name: string; description: string; duration: string; price: number; features: string[]; image?: string }) => {
    const params = new URLSearchParams({
      title: tourData?.name || service,
      id: tourData?.id || service.toLowerCase().replace(/\s+/g, '-'),
      duration: tourData?.duration || 'Full Day',
      price: String(tourData?.price || 65),
      image: tourData?.image || 'https://images.unsplash.com/photo-1580541832626-2a7131ee809f?w=800',
      subtitle: `Kandy - ${tourData?.name || service}`
    });
    navigate(`/book-tour?${params.toString()}`);
  };
  return (
    <>
      <Helmet>
        <title>Kandy - Cultural Capital of Sri Lanka | Sacred Sites, Tours & Travel Guide</title>
        <meta name="description" content="Discover Kandy's Temple of the Tooth, botanical gardens, and cultural heritage. Plan your visit to Sri Lanka's hill capital with our complete travel guide." />
        <meta name="keywords" content="Kandy, Temple of the Tooth, Sri Lanka, UNESCO, cultural heritage, Peradeniya Gardens, Esala Perahera, travel, tours" />
        <meta property="og:title" content="Kandy - Cultural Capital of Sri Lanka | Recharge Travels" />
        <meta property="og:description" content="Discover Kandy's Temple of the Tooth, botanical gardens, and cultural heritage. Plan your visit to Sri Lanka's hill capital." />
        <meta property="og:image" content={heroSlides[0]?.image || 'https://i.imgur.com/AEnBWJf.jpeg'} />
        <meta property="og:url" content="https://www.rechargetravels.com/destinations/kandy" />
        <meta property="og:type" content="place" />
        <meta property="og:locale" content="en_US" />
        <meta property="og:site_name" content="Recharge Travels" />
        <meta name="twitter:card" content="summary_large_image" />
        <link rel="canonical" href="https://www.rechargetravels.com/destinations/kandy" />

        {/* TouristAttraction Schema */}
        <script type="application/ld+json">
          {JSON.stringify(createTouristAttractionSchema({
            name: 'Kandy - Cultural Capital of Sri Lanka',
            description: "Discover Kandy's Temple of the Tooth, botanical gardens, and cultural heritage. The last royal capital of Sri Lanka and UNESCO World Heritage Site.",
            image: heroSlides.map(s => s.image),
            latitude: KANDY_CENTER.lat,
            longitude: KANDY_CENTER.lng,
            address: 'Kandy, Central Province, Sri Lanka',
            openingHours: 'Mo-Su 05:30-20:00',
            priceRange: 'LKR 1500',
            rating: { value: 4.8, count: 3256 },
            url: 'https://www.rechargetravels.com/destinations/kandy'
          }))}
        </script>

        {/* Breadcrumb Schema */}
        <script type="application/ld+json">
          {JSON.stringify(createBreadcrumbSchema([
            { name: 'Home', url: COMPANY.url },
            { name: 'Destinations', url: `${COMPANY.url}/about/sri-lanka` },
            { name: 'Kandy', url: `${COMPANY.url}/destinations/kandy` }
          ]))}
        </script>

        {/* Organization Schema */}
        <script type="application/ld+json">
          {JSON.stringify(createOrganizationSchema())}
        </script>

        {/* HowTo Schema - Visit Guide */}
        <script type="application/ld+json">
          {JSON.stringify(createHowToSchema(
            'How to Visit Kandy and Temple of the Tooth',
            'Complete guide to visiting Kandy, the cultural capital of Sri Lanka. Home to the sacred Temple of the Tooth Relic.',
            [
              { name: 'Plan Your Visit', text: 'Best time to visit is during puja ceremonies (5:30 AM, 9:30 AM, 6:30 PM). The Esala Perahera festival in July/August is spectacular.' },
              { name: 'Book Transportation', text: 'Kandy is 115km from Colombo. Take the scenic train (3.5 hours) or book a private transfer with Recharge Travels at +94777721999.' },
              { name: 'Visit Temple of the Tooth', text: 'Entry: LKR 1500 for foreigners. Dress modestly (covered shoulders/knees). Remove shoes before entering. Photography restricted in some areas.' },
              { name: 'Explore Peradeniya Gardens', text: 'Visit the Royal Botanical Gardens (entry LKR 1500). Best time: early morning. Famous for orchids, spices, and giant bamboo.' },
              { name: 'Experience Cultural Shows', text: 'Watch traditional Kandyan dance performances at Cultural Centre (7:00 PM daily). Fire walking and drumming included.' }
            ],
            { totalTime: 'PT6H', estimatedCost: '1500', currency: 'LKR' }
          ))}
        </script>

        {/* Speakable Schema for Voice Search */}
        <script type="application/ld+json">
          {JSON.stringify(createSpeakableSchema(
            'https://www.rechargetravels.com/destinations/kandy',
            ['h1', '.hero-subtitle', '.destination-description']
          ))}
        </script>

        {/* UNESCO World Heritage Site Schema */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": ["City", "TouristDestination"],
            "@id": "https://www.rechargetravels.com/destinations/kandy#city",
            "name": "Kandy",
            "alternateName": ["Maha Nuvara", "Senkadagalapura", "Cultural Capital of Sri Lanka"],
            "description": "Kandy is the cultural capital of Sri Lanka, home to the sacred Temple of the Tooth Relic. A UNESCO World Heritage Site surrounded by mountains and the beautiful Kandy Lake.",
            "image": heroSlides.map(s => s.image),
            "url": "https://www.rechargetravels.com/destinations/kandy",
            "telephone": COMPANY.phone,
            "geo": {
              "@type": "GeoCoordinates",
              "latitude": 7.2906,
              "longitude": 80.6337,
              "elevation": "465 meters"
            },
            "address": {
              "@type": "PostalAddress",
              "addressLocality": "Kandy",
              "addressRegion": "Central Province",
              "addressCountry": "LK"
            },
            "containsPlace": [
              {
                "@type": "TouristAttraction",
                "name": "Temple of the Tooth Relic",
                "description": "Sacred Buddhist temple housing the tooth relic of Buddha"
              },
              {
                "@type": "Park",
                "name": "Royal Botanical Gardens, Peradeniya",
                "description": "Largest botanical garden in Sri Lanka"
              }
            ],
            "aggregateRating": {
              "@type": "AggregateRating",
              "ratingValue": 4.8,
              "reviewCount": 3256,
              "bestRating": 5,
              "worstRating": 1
            },
            "award": "UNESCO World Heritage Site (1988)",
            "containedInPlace": {
              "@type": "Country",
              "name": "Sri Lanka"
            },
            "touristType": ["Cultural Tourism", "Religious Tourism", "Heritage Tourism", "Nature Tourism"]
          })}
        </script>
      </Helmet>
      
      <Header />
      
      <div className="min-h-screen bg-background">
        {/* Hero Section */}
        <section className="relative aspect-video max-h-[80vh] overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0, scale: 1.1 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.5 }}
              className="absolute inset-0"
            >
              <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/60 z-10" />
              <img
                src={heroSlides[currentSlide].image}
                alt={heroSlides[currentSlide].title}
                className="w-full h-full object-cover"
              />
            </motion.div>
          </AnimatePresence>

          <div className="relative z-20 h-full flex items-center justify-center text-center text-white">
            <div className="max-w-4xl mx-auto px-4">
              <motion.h1
                key={`title-${currentSlide}`}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="text-5xl md:text-7xl font-bold mb-4"
              >
                {heroSlides[currentSlide].title}
              </motion.h1>
              <motion.p
                key={`subtitle-${currentSlide}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="text-xl md:text-2xl mb-8"
              >
                {heroSlides[currentSlide].subtitle}
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="flex gap-4 justify-center"
              >
                <Button size="lg" onClick={() => handleBooking()}>
                  Book Your Experience
                </Button>
                <Button asChild size="lg" variant="outline" className="bg-white/10 backdrop-blur-sm">
                  <Link to="/travel-guide">
                    <Info className="w-4 h-4 mr-2" />
                    Travel Guide
                  </Link>
                </Button>
              </motion.div>
            </div>
          </div>

          {/* Slide Indicators */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex gap-2 z-30">
            {heroSlides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-2 h-2 rounded-full transition-all ${
                  currentSlide === index ? 'w-8 bg-white' : 'bg-white/50'
                }`}
              />
            ))}
          </div>
        </section>

        {/* Quick Info Section */}
        <section className="bg-gray-50 py-12">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
              <div className="text-center">
                <Users className="w-8 h-8 mx-auto mb-2 text-amber-600" />
                <h3 className="font-semibold">Population</h3>
                <p className="text-gray-600">{destinationInfo.population}</p>
              </div>
              <div className="text-center">
                <MapPin className="w-8 h-8 mx-auto mb-2 text-amber-600" />
                <h3 className="font-semibold">Area</h3>
                <p className="text-gray-600">{destinationInfo.area}</p>
              </div>
              <div className="text-center">
                <Mountain className="w-8 h-8 mx-auto mb-2 text-amber-600" />
                <h3 className="font-semibold">Elevation</h3>
                <p className="text-gray-600">{destinationInfo.elevation}</p>
              </div>
              <div className="text-center">
                <Sun className="w-8 h-8 mx-auto mb-2 text-amber-600" />
                <h3 className="font-semibold">Best Time</h3>
                <p className="text-gray-600">{destinationInfo.bestTime}</p>
              </div>
              <div className="text-center">
                <Info className="w-8 h-8 mx-auto mb-2 text-amber-600" />
                <h3 className="font-semibold">Language</h3>
                <p className="text-gray-600">{destinationInfo.language}</p>
              </div>
              <div className="text-center">
                <DollarSign className="w-8 h-8 mx-auto mb-2 text-amber-600" />
                <h3 className="font-semibold">Currency</h3>
                <p className="text-gray-600">{destinationInfo.currency}</p>
              </div>
            </div>
          </div>
        </section>

        {/* Tab Navigation */}
        <section className="sticky top-0 z-40 bg-white shadow-md">
          <div className="container mx-auto px-4">
            <div className="flex space-x-8 overflow-x-auto">
              {['attractions', 'activities', 'hotels', 'restaurants', 'map', 'weather'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setSelectedTab(tab)}
                  className={`py-4 px-2 capitalize whitespace-nowrap border-b-2 transition-colors ${
                    selectedTab === tab
                      ? 'border-amber-600 text-amber-600'
                      : 'border-transparent text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Content Sections */}
        <section className="container mx-auto px-4 py-12">
          {/* Attractions Tab */}
          {selectedTab === 'attractions' && (
            <div>
              <h2 className="text-3xl font-bold mb-8">Top Attractions in Kandy</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {attractions.map((attraction, index) => (
                  <Card key={index} className="overflow-hidden hover:shadow-xl transition-shadow">
                    <div className="aspect-w-16 aspect-h-9 relative h-48">
                      <img 
                        src={attraction.image} 
                        alt={attraction.name}
                        className="w-full h-full object-cover"
                      />
                      <Badge className="absolute top-4 right-4 bg-white/90 text-gray-800">
                        {attraction.category}
                      </Badge>
                    </div>
                    <CardContent className="p-6">
                      <h3 className="text-xl font-bold mb-2">{attraction.name}</h3>
                      <p className="text-gray-600 mb-4">{attraction.description}</p>
                      
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <span className="flex items-center gap-1">
                            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                            {attraction.rating}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {attraction.duration}
                          </span>
                          <span className="flex items-center gap-1">
                            <DollarSign className="w-4 h-4" />
                            {attraction.price}
                          </span>
                        </div>
                      </div>
                      
                      <Button 
                        className="w-full"
                        onClick={() => handleBooking(attraction.name)}
                      >
                        Book Now
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Activities Tab */}
          {selectedTab === 'activities' && (
            <div>
              <h2 className="text-3xl font-bold mb-8">Things to Do in Kandy</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {activities.map((activity, index) => (
                  <Card key={index} className={`hover:shadow-lg transition-shadow ${activity.popular ? 'border-amber-500 border-2' : ''}`}>
                    {activity.popular && (
                      <div className="bg-amber-500 text-white text-center py-2 text-sm font-semibold">
                        MOST POPULAR
                      </div>
                    )}
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <activity.icon className="w-12 h-12 text-amber-600" />
                        <Badge variant="secondary">{activity.duration}</Badge>
                      </div>
                      <CardTitle className="mt-4">{activity.name}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600 mb-4">{activity.description}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-2xl font-bold text-amber-600">{activity.price}</span>
                        <Button onClick={() => handleBooking(activity.name)}>
                          Book Now
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Hotels Tab */}
          {selectedTab === 'hotels' && (
            <div>
              <h2 className="text-3xl font-bold mb-8">Where to Stay in Kandy</h2>
              {hotels.length === 0 ? (
                <div className="text-center py-12">
                  <Hotel className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                  <h3 className="text-xl font-semibold mb-2">Hotels Coming Soon</h3>
                  <p className="text-gray-600">
                    We're working on bringing you the best hotel recommendations in Kandy
                  </p>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {hotels.map((hotel, index) => (
                    <Card
                      key={index}
                      className="overflow-hidden hover:shadow-xl transition-shadow"
                    >
                      <div className="h-48 relative">
                        <img
                          src={hotel.image}
                          alt={hotel.name}
                          className="w-full h-full object-cover"
                        />
                        <Badge className="absolute top-4 left-4 bg-black/70 text-white">
                          {hotel.starRating}-star
                        </Badge>
                      </div>
                      <CardContent className="p-6 space-y-3">
                        <h3 className="text-xl font-bold">{hotel.name}</h3>
                        <p className="text-gray-600 text-sm">{hotel.description}</p>
                        <p className="text-sm text-gray-500">{hotel.address}</p>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-amber-600 font-semibold">
                            {hotel.priceRange}
                          </span>
                        </div>
                        {hotel.amenities.length > 0 && (
                          <div className="mt-2 flex flex-wrap gap-1">
                            {hotel.amenities.map((amenity, i) => (
                              <Badge
                                key={i}
                                variant="outline"
                                className="text-xs text-gray-600 border-gray-200"
                              >
                                {amenity}
                              </Badge>
                            ))}
                          </div>
                        )}
                        <Button
                          className="w-full mt-3"
                          onClick={() => handleBooking(hotel.name)}
                        >
                          Book This Stay
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Restaurants Tab */}
          {selectedTab === 'restaurants' && (
            <div>
              <h2 className="text-3xl font-bold mb-8">Where to Eat in Kandy</h2>
              {restaurants.length === 0 ? (
                <div className="text-center py-12">
                  <Utensils className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                  <h3 className="text-xl font-semibold mb-2">Restaurants Coming Soon</h3>
                  <p className="text-gray-600">
                    Discover the best dining experiences in Kandy
                  </p>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {restaurants.map((restaurant, index) => (
                    <Card
                      key={index}
                      className="overflow-hidden hover:shadow-xl transition-shadow"
                    >
                      <div className="h-40 relative">
                        <img
                          src={restaurant.image}
                          alt={restaurant.name}
                          className="w-full h-full object-cover"
                        />
                        <Badge className="absolute top-4 left-4 bg-black/70 text-white">
                          {restaurant.cuisine}
                        </Badge>
                      </div>
                      <CardContent className="p-6 space-y-3">
                        <h3 className="text-xl font-bold">{restaurant.name}</h3>
                        <p className="text-gray-600 text-sm">{restaurant.description}</p>
                        <p className="text-sm text-gray-500">{restaurant.address}</p>
                        <div className="flex items-center justify-between mt-2 text-sm text-gray-600">
                          <span>{restaurant.priceRange}</span>
                          <span className="flex items-center gap-1">
                            <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                            {restaurant.rating.toFixed(1)}
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Map Tab */}
          {selectedTab === 'map' && (
            <div>
              <h2 className="text-3xl font-bold mb-8">Explore Kandy Map</h2>
              <p className="text-gray-600 mb-8 text-center max-w-2xl mx-auto">
                Discover temples, gardens, and cultural landmarks across Kandy
              </p>
              <div className="grid lg:grid-cols-3 gap-8">
                {/* Interactive Map */}
                <div className="lg:col-span-2">
                  <Card className="overflow-hidden h-[500px]">
                    <DestinationMap
                      destinationName="Kandy"
                      center={KANDY_CENTER}
                      attractions={[
                        { name: 'Temple of the Tooth', description: 'Sacred Buddhist temple', coordinates: { lat: 7.2936, lng: 80.6413 } },
                        { name: 'Royal Botanical Gardens', description: 'Famous Peradeniya gardens', coordinates: { lat: 7.2690, lng: 80.5958 } },
                        { name: 'Kandy Lake', description: 'Scenic lake in city center', coordinates: KANDY_CENTER },
                        { name: 'Bahiravokanda Buddha', description: 'Giant Buddha statue', coordinates: { lat: 7.2975, lng: 80.6292 } },
                        { name: 'Ceylon Tea Museum', description: 'Tea history museum', coordinates: { lat: 7.2650, lng: 80.6100 } },
                        { name: 'Udawatta Kele Sanctuary', description: 'Forest reserve', coordinates: { lat: 7.2980, lng: 80.6400 } },
                      ]}
                      height="500px"
                    />
                  </Card>
                </div>

                {/* Weather Widget */}
                <div className="lg:col-span-1">
                  <WeatherWidget
                    locationName="Kandy"
                    latitude={KANDY_CENTER.lat}
                    longitude={KANDY_CENTER.lng}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Weather Tab */}
          {selectedTab === 'weather' && (
            <div>
              <h2 className="text-3xl font-bold mb-8">Weather in Kandy</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card>
                  <CardHeader>
                    <Sun className="w-8 h-8 text-orange-500 mb-2" />
                    <CardTitle>Temperature</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold">{weatherInfo.temperature}</p>
                    <p className="text-gray-600">Cooler climate</p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <Cloud className="w-8 h-8 text-blue-500 mb-2" />
                    <CardTitle>Humidity</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold">{weatherInfo.humidity}</p>
                    <p className="text-gray-600">Highland climate</p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <Cloud className="w-8 h-8 text-gray-500 mb-2" />
                    <CardTitle>Rainfall</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold">{weatherInfo.rainfall}</p>
                    <p className="text-gray-600">Oct-Dec & May-Jul peaks</p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <Calendar className="w-8 h-8 text-green-500 mb-2" />
                    <CardTitle>Best Time</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold">{destinationInfo.bestTime}</p>
                    <p className="text-gray-600">Dry season</p>
                  </CardContent>
                </Card>
              </div>
              {travelTips.length > 0 && (
                <div className="mt-10">
                  <h3 className="text-2xl font-bold mb-4">Travel Tips for Kandy</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    {travelTips.map((tip, index) => (
                      <Card key={index} className="border border-dashed">
                        <CardContent className="p-4 space-y-1">
                          <p className="text-sm font-semibold text-amber-700">
                            {tip.title}
                          </p>
                          <p className="text-sm text-gray-600">{tip.content}</p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </section>

        {/* CTA Section */}
        <section className="bg-gradient-to-r from-amber-600 to-orange-600 py-16">
          <div className="container mx-auto px-4 text-center text-white">
            <h2 className="text-4xl font-bold mb-4">{ctaSection.title}</h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              {ctaSection.subtitle}
            </p>
            <div className="flex gap-4 justify-center">
              <Button size="lg" variant="secondary" onClick={() => handleBooking()}>
                {ctaSection.buttonText}
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="bg-white/10 backdrop-blur-sm text-white border-white hover:bg-white/20"
              >
                <Link to="/book-now">
                  Contact Us
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </div>

      <Footer />

      {/* WhatsApp Float Button */}
      <a
        href="https://wa.me/94777721999?text=Hi! I'm interested in booking a Kandy tour."
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-lg transition-all hover:scale-110"
        aria-label="Contact via WhatsApp"
      >
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
        </svg>
      </a>
    </>
  );
};

export default Kandy;
