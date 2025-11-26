
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { MapPin, DollarSign, Star, Filter, Map, Grid, Utensils, Clock, Phone, Play, Award, Volume2, VolumeX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { TasteQuiz } from '@/components/restaurants/TasteQuiz';
import { RestaurantCard } from '@/components/restaurants/RestaurantCard';
import { PassportProgress } from '@/components/restaurants/PassportProgress';

interface Restaurant {
  id: string;
  slug: string;
  name: string;
  cuisine: string;
  location: string;
  priceLevel: '$' | '$$' | '$$$';
  rating: number;
  description: string;
  image: string;
  chef?: string;
  specialties: string[];
  hours: string;
  phone: string;
  address: string;
  nearbyAttractions: string[];
  spiceLevel: 'mild' | 'medium' | 'hot';
  atmosphere: 'casual' | 'elegant' | 'adventure';
  ingredients: string[];
  availableTables: number;
  chefVideo?: string;
  signatureDish: string;
  dishImage: string;
}

const restaurantData: Restaurant[] = [
  {
    id: '1',
    slug: 'ministry-of-crab',
    name: 'Ministry of Crab',
    cuisine: 'Seafood',
    location: 'Colombo',
    priceLevel: '$$$',
    rating: 4.8,
    description: 'World-renowned seafood restaurant in a historic Dutch hospital, famous for mud crab preparations.',
    image: '/placeholder.svg',
    chef: 'Dharshan Munidasa',
    specialties: ['Mud Crab', 'Garlic Chili Crab', 'Pepper Crab'],
    hours: '12:00 PM - 3:00 PM, 6:00 PM - 11:00 PM',
    phone: '+94 11 234 2722',
    address: 'Dutch Hospital Shopping Precinct, Colombo 01',
    nearbyAttractions: ['Galle Face Green', 'Colombo Fort', 'Red Mosque'],
    spiceLevel: 'medium',
    atmosphere: 'elegant',
    ingredients: ['seafood', 'coconut'],
    availableTables: 2,
    signatureDish: 'Garlic Chili Crab',
    dishImage: '/placeholder.svg'
  },
  {
    id: '2',
    slug: 'gallery-cafe',
    name: 'The Gallery Café',
    cuisine: 'International',
    location: 'Colombo',
    priceLevel: '$$',
    rating: 4.6,
    description: 'Elegant café in a converted art gallery designed by Geoffrey Bawa, serving contemporary cuisine.',
    image: '/placeholder.svg',
    chef: 'Publis Silva',
    specialties: ['Pan-seared Fish', 'Lamb Rack', 'Chocolate Tart'],
    hours: '10:00 AM - 12:00 AM',
    phone: '+94 11 258 2162',
    address: '2 Alfred House Road, Colombo 03',
    nearbyAttractions: ['National Museum', 'Viharamahadevi Park', 'Race Course'],
    spiceLevel: 'mild',
    atmosphere: 'elegant',
    ingredients: ['vegetarian'],
    availableTables: 5,
    signatureDish: 'Pan-seared Fish',
    dishImage: '/placeholder.svg'
  },
  {
    id: '3',
    slug: 'nuga-gama',
    name: 'Nuga Gama',
    cuisine: 'Sri Lankan',
    location: 'Colombo',
    priceLevel: '$$',
    rating: 4.5,
    description: 'Authentic Sri Lankan village dining experience with traditional recipes and rustic ambiance.',
    image: '/placeholder.svg',
    specialties: ['Rice & Curry', 'Hoppers', 'String Hoppers'],
    hours: '12:00 PM - 3:00 PM, 7:00 PM - 11:00 PM',
    phone: '+94 11 249 1010',
    address: 'Cinnamon Grand Hotel, Galle Road, Colombo 03',
    nearbyAttractions: ['Galle Face Green', 'Beira Lake', 'Seema Malaka Temple'],
    spiceLevel: 'hot',
    atmosphere: 'adventure',
    ingredients: ['curry'],
    availableTables: 3,
    signatureDish: 'Traditional Rice & Curry',
    dishImage: '/placeholder.svg'
  },
  {
    id: '4',
    slug: 'fort-printers',
    name: 'Fort Printers',
    cuisine: 'Fine Dining',
    location: 'Galle',
    priceLevel: '$$$',
    rating: 4.7,
    description: 'Sophisticated restaurant in Galle Fort serving modern interpretations of local flavors.',
    image: '/placeholder.svg',
    chef: 'Kumar de Silva',
    specialties: ['Tuna Carpaccio', 'Coconut Curry', 'Tropical Pavlova'],
    hours: '7:00 AM - 11:00 PM',
    phone: '+94 91 224 7977',
    address: '39 Pedlar Street, Galle Fort',
    nearbyAttractions: ['Galle Fort Walls', 'Dutch Reformed Church', 'Maritime Museum'],
    spiceLevel: 'medium',
    atmosphere: 'elegant',
    ingredients: ['seafood', 'coconut'],
    availableTables: 1,
    signatureDish: 'Tuna Carpaccio',
    dishImage: '/placeholder.svg'
  },
  {
    id: '5',
    slug: 'local-kitchen',
    name: 'Local Kitchen',
    cuisine: 'Street Food',
    location: 'Colombo',
    priceLevel: '$',
    rating: 4.3,
    description: 'Authentic street food experience with traditional kottu, hoppers, and local favorites.',
    image: '/placeholder.svg',
    specialties: ['Kottu Roti', 'Egg Hoppers', 'Fish Buns'],
    hours: '6:00 PM - 2:00 AM',
    phone: '+94 77 123 4567',
    address: 'Galle Road, Bambalapitiya',
    nearbyAttractions: ['Bambalapitiya Beach', 'Liberty Plaza', 'Kollupitiya Market'],
    spiceLevel: 'hot',
    atmosphere: 'adventure',
    ingredients: ['curry'],
    availableTables: 8,
    signatureDish: 'Kottu Roti',
    dishImage: '/placeholder.svg'
  }
];

const cuisineTypes = ['All', 'Sri Lankan', 'Seafood', 'International', 'Fine Dining', 'Street Food'];
const locations = ['All', 'Colombo', 'Galle', 'Kandy', 'Jaffna', 'Ella'];
const priceLevels = ['All', '$', '$$', '$$$'];

const RestaurantGuide: React.FC = () => {
  const [selectedCuisine, setSelectedCuisine] = useState('All');
  const [selectedLocation, setSelectedLocation] = useState('All');
  const [selectedPriceLevel, setSelectedPriceLevel] = useState('All');
  const [viewMode, setViewMode] = useState<'grid' | 'map'>('grid');
  const [tasteProfile, setTasteProfile] = useState<any>(null);
  const [visitedRestaurants, setVisitedRestaurants] = useState<string[]>([]);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [showQuiz, setShowQuiz] = useState(false);

  // Load user preferences from localStorage
  useEffect(() => {
    const savedProfile = localStorage.getItem('tasteProfile');
    const savedVisited = localStorage.getItem('visitedRestaurants');
    
    if (savedProfile) setTasteProfile(JSON.parse(savedProfile));
    if (savedVisited) setVisitedRestaurants(JSON.parse(savedVisited));
  }, []);

  // Save to localStorage when state changes
  useEffect(() => {
    if (tasteProfile) {
      localStorage.setItem('tasteProfile', JSON.stringify(tasteProfile));
    }
  }, [tasteProfile]);

  useEffect(() => {
    localStorage.setItem('visitedRestaurants', JSON.stringify(visitedRestaurants));
  }, [visitedRestaurants]);

  const handleStampRestaurant = (restaurantId: string) => {
    if (!visitedRestaurants.includes(restaurantId)) {
      setVisitedRestaurants([...visitedRestaurants, restaurantId]);
    }
  };

  const calculateMatchScore = (restaurant: Restaurant): number => {
    if (!tasteProfile) return 100;
    
    let score = 0;
    if (restaurant.spiceLevel === tasteProfile.spiceLevel) score += 40;
    if (restaurant.atmosphere === tasteProfile.atmosphere) score += 30;
    if (restaurant.ingredients.some(ing => tasteProfile.ingredients.includes(ing))) score += 30;
    
    return Math.max(score, 60); // Minimum 60% match
  };

  const filteredRestaurants = restaurantData
    .filter(restaurant => {
      return (
        (selectedCuisine === 'All' || restaurant.cuisine === selectedCuisine) &&
        (selectedLocation === 'All' || restaurant.location === selectedLocation) &&
        (selectedPriceLevel === 'All' || restaurant.priceLevel === selectedPriceLevel)
      );
    })
    .sort((a, b) => calculateMatchScore(b) - calculateMatchScore(a));

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": "Sri Lanka's Top 20 Restaurants",
    "description": "Discover and book Sri Lanka's best restaurants, from fine dining to street-food gems",
    "itemListElement": restaurantData.map((restaurant, index) => ({
      "@type": "Restaurant",
      "position": index + 1,
      "name": restaurant.name,
      "servesCuisine": restaurant.cuisine,
      "address": {
        "@type": "PostalAddress",
        "addressLocality": restaurant.location,
        "addressCountry": "Sri Lanka"
      },
      "priceRange": restaurant.priceLevel,
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": restaurant.rating,
        "bestRating": "5"
      }
    }))
  };

  return (
    <>
      <Helmet>
        <title>Top 20 Restaurants in Sri Lanka – Reserve Your Table | Recharge Travels</title>
        <meta 
          name="description" 
          content="Discover and book Sri Lanka's best restaurants, from fine dining to street-food gems across Colombo, Kandy, Galle & beyond. Make your reservation today." 
        />
        <meta property="og:title" content="Sri Lanka's Top 20 Restaurants - Reserve Your Table" />
        <meta property="og:description" content="A culinary journey through the island's finest tables" />
        <meta property="og:type" content="website" />
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      </Helmet>

      <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white">
        {/* Enhanced Cinematic Hero Section */}
        <div className="relative h-screen overflow-hidden">
          {/* Cinemagraph Background with Multiple Layers */}
          <div className="absolute inset-0">
            <div className="relative w-full h-full bg-gradient-to-r from-luxury-mahogany via-luxury-darkwood to-luxury-bronze">
              {/* Steam Animation Layer */}
              <div className="absolute inset-0 opacity-40">
                <div className="steam-effect-1 absolute top-1/4 left-1/4 w-16 h-32 bg-white/20 rounded-full animate-steam-rise" />
                <div className="steam-effect-2 absolute top-1/3 right-1/3 w-12 h-24 bg-white/15 rounded-full animate-steam-rise-delayed" />
                <div className="steam-effect-3 absolute bottom-1/3 left-1/2 w-20 h-36 bg-white/25 rounded-full animate-steam-rise-slow" />
              </div>
              
              {/* Ember Glow Effects */}
              <div className="absolute inset-0 opacity-60">
                <div className="ember-1 absolute top-1/2 left-1/5 w-8 h-8 bg-orange-400 rounded-full animate-ember-glow" />
                <div className="ember-2 absolute top-2/3 right-1/4 w-6 h-6 bg-red-500 rounded-full animate-ember-pulse" />
                <div className="ember-3 absolute bottom-1/4 left-3/4 w-10 h-10 bg-yellow-500 rounded-full animate-ember-flicker" />
              </div>

              {/* Wave Animation for Beachside Effect */}
              <div className="absolute bottom-0 left-0 right-0 h-32 opacity-30">
                <div className="wave-1 absolute bottom-0 w-full h-16 bg-blue-400/30 rounded-t-full animate-wave-gentle" />
                <div className="wave-2 absolute bottom-2 w-full h-12 bg-blue-300/20 rounded-t-full animate-wave-offset" />
              </div>
              
              {/* Texture Overlay */}
              <div className="absolute inset-0 opacity-20 bg-spice-pattern" />
            </div>
          </div>

          {/* Hero Content with Enhanced Typography */}
          <div className="relative z-10 flex items-center justify-center h-full">
            <div className="text-center text-white px-4 max-w-5xl mx-auto">
              <h1 className="text-6xl md:text-8xl font-cinzel font-bold mb-6 animate-fade-in text-luxury-gold golden-emboss">
                Sri Lanka's Top 20 Restaurants
              </h1>
              <p className="text-2xl md:text-3xl mb-8 opacity-90 font-poppins animate-fade-in textured-serif" style={{ animationDelay: '0.3s' }}>
                Taste, Explore & Bookmark the Island's Finest Tables
              </p>
              
              {/* Enhanced CTA with Pulsating Animation */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Button 
                  className="bg-luxury-gold hover:bg-luxury-bronze text-luxury-darkwood px-10 py-6 text-xl font-semibold rounded-xl shadow-copper animate-fade-in pulsating-cta group"
                  style={{ animationDelay: '0.6s' }}
                  onClick={() => document.getElementById('restaurants')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  <Utensils className="mr-3 h-6 w-6 animate-cutlery-spin group-hover:animate-cutlery-dance" />
                  Start Your Culinary Journey
                </Button>
                
                <Button 
                  variant="outline"
                  className="bg-white/10 border-white/30 text-white hover:bg-white/20 px-8 py-6 text-lg"
                  onClick={() => setSoundEnabled(!soundEnabled)}
                >
                  {soundEnabled ? <VolumeX className="mr-2 h-5 w-5" /> : <Volume2 className="mr-2 h-5 w-5" />}
                  {soundEnabled ? 'Mute Ambience' : 'Enable Ambience'}
                </Button>
              </div>
            </div>
          </div>

          {/* Sound Indicator */}
          {soundEnabled && (
            <div className="absolute bottom-8 right-8 text-white/70 text-sm animate-pulse">
              🎵 Ambient sounds playing
            </div>
          )}
        </div>

        {/* Passport Progress Header */}
        <PassportProgress 
          visitedCount={visitedRestaurants.length}
          totalCount={restaurantData.length}
          className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b"
        />

        {/* Interactive Taste Quiz Section */}
        <div className="py-12 bg-gradient-to-r from-luxury-cream to-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-4xl font-cinzel font-bold text-luxury-darkwood mb-4">
              Discover Your Perfect Match
            </h2>
            <p className="text-lg text-luxury-spice mb-8 max-w-2xl mx-auto">
              Take our 3-question taste quiz to get personalized restaurant recommendations tailored to your palate
            </p>
            
            <Dialog open={showQuiz} onOpenChange={setShowQuiz}>
              <DialogTrigger asChild>
                <Button 
                  className="bg-luxury-mahogany hover:bg-luxury-darkwood text-white px-8 py-4 text-lg rounded-lg"
                >
                  <Award className="mr-2 h-5 w-5" />
                  {tasteProfile ? 'Retake Quiz' : 'Take Taste Quiz'}
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle className="text-2xl font-cinzel text-luxury-darkwood">
                    Culinary Taste Quiz
                  </DialogTitle>
                </DialogHeader>
                <TasteQuiz 
                  onComplete={(profile) => {
                    setTasteProfile(profile);
                    setShowQuiz(false);
                  }}
                />
              </DialogContent>
            </Dialog>

            {tasteProfile && (
              <div className="mt-8 p-6 bg-white rounded-xl shadow-lg inline-block">
                <h3 className="text-xl font-bold text-luxury-darkwood mb-2">Your Taste Profile</h3>
                <div className="flex flex-wrap gap-2 justify-center">
                  <Badge variant="secondary">{tasteProfile.spiceLevel} spice</Badge>
                  <Badge variant="secondary">{tasteProfile.atmosphere} dining</Badge>
                  {tasteProfile.ingredients.map((ing: string) => (
                    <Badge key={ing} variant="outline">{ing}</Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Enhanced Filters Section */}
        <div id="restaurants" className="py-12 bg-white">
          <div className="container mx-auto px-4">
            <div className="flex flex-col lg:flex-row items-center justify-between mb-8 space-y-4 lg:space-y-0">
              {/* Filters */}
              <div className="flex flex-wrap items-center gap-4">
                <div className="flex items-center gap-2">
                  <Filter className="h-5 w-5 text-luxury-mahogany" />
                  <span className="font-medium text-luxury-darkwood">Filter by:</span>
                </div>
                
                <select 
                  value={selectedCuisine}
                  onChange={(e) => setSelectedCuisine(e.target.value)}
                  className="px-4 py-2 border border-luxury-bronze rounded-lg focus:ring-2 focus:ring-luxury-saffron focus:border-transparent"
                >
                  {cuisineTypes.map(cuisine => (
                    <option key={cuisine} value={cuisine}>{cuisine} Cuisine</option>
                  ))}
                </select>

                <select 
                  value={selectedLocation}
                  onChange={(e) => setSelectedLocation(e.target.value)}
                  className="px-4 py-2 border border-luxury-bronze rounded-lg focus:ring-2 focus:ring-luxury-saffron focus:border-transparent"
                >
                  {locations.map(location => (
                    <option key={location} value={location}>{location === 'All' ? 'All Locations' : location}</option>
                  ))}
                </select>

                <select 
                  value={selectedPriceLevel}
                  onChange={(e) => setSelectedPriceLevel(e.target.value)}
                  className="px-4 py-2 border border-luxury-bronze rounded-lg focus:ring-2 focus:ring-luxury-saffron focus:border-transparent"
                >
                  {priceLevels.map(price => (
                    <option key={price} value={price}>{price === 'All' ? 'All Prices' : price}</option>
                  ))}
                </select>
              </div>

              {/* View Toggle */}
              <div className="flex items-center bg-luxury-cream rounded-lg p-1">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                  className={viewMode === 'grid' ? 'bg-luxury-mahogany text-white' : 'text-luxury-darkwood'}
                >
                  <Grid className="h-4 w-4 mr-2" />
                  Grid
                </Button>
                <Button
                  variant={viewMode === 'map' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('map')}
                  className={viewMode === 'map' ? 'bg-luxury-mahogany text-white' : 'text-luxury-darkwood'}
                >
                  <Map className="h-4 w-4 mr-2" />
                  Heatmap
                </Button>
              </div>
            </div>

            {/* Results Count with Smart Recommendations */}
            <div className="text-center mb-8">
              <p className="text-luxury-spice text-lg">
                Showing {filteredRestaurants.length} of {restaurantData.length} restaurants
                {tasteProfile && (
                  <span className="block text-sm mt-1 text-luxury-bronze">
                    Sorted by your taste preferences
                  </span>
                )}
              </p>
            </div>

            {/* Interactive Restaurant Grid */}
            {viewMode === 'grid' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {filteredRestaurants.map((restaurant, index) => (
                  <RestaurantCard
                    key={restaurant.id}
                    restaurant={restaurant}
                    matchScore={calculateMatchScore(restaurant)}
                    isVisited={visitedRestaurants.includes(restaurant.id)}
                    onStamp={() => handleStampRestaurant(restaurant.id)}
                    index={index}
                  />
                ))}
              </div>
            ) : (
              /* Enhanced Heatmap View */
              <div className="h-96 bg-gradient-to-br from-luxury-cream to-luxury-bronze/20 rounded-xl flex items-center justify-center relative overflow-hidden">
                {/* Heatmap Background Pattern */}
                <div className="absolute inset-0 opacity-30">
                  {filteredRestaurants.map((restaurant, index) => (
                    <div
                      key={restaurant.id}
                      className={`absolute w-16 h-16 rounded-full animate-pulse heatmap-dot-${restaurant.location.toLowerCase()}`}
                      style={{
                        left: `${20 + (index * 15) % 60}%`,
                        top: `${30 + (index * 20) % 40}%`,
                        animationDelay: `${index * 0.2}s`,
                        background: `radial-gradient(circle, ${
                          restaurant.priceLevel === '$$$' ? '#D4AF37' :
                          restaurant.priceLevel === '$$' ? '#CD7F32' : '#B8860B'
                        }, transparent)`
                      }}
                    />
                  ))}
                </div>
                
                <div className="text-center text-luxury-spice z-10">
                  <Map className="h-16 w-16 mx-auto mb-4 text-luxury-mahogany animate-pulse" />
                  <p className="text-2xl font-bold mb-2">Restaurant Density Heatmap</p>
                  <p className="text-lg">Discover culinary hotspots across Sri Lanka</p>
                  <div className="mt-6 flex justify-center gap-4">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded-full bg-gradient-to-r from-yellow-400 to-yellow-600"></div>
                      <span className="text-sm">Fine Dining</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded-full bg-gradient-to-r from-orange-400 to-orange-600"></div>
                      <span className="text-sm">Casual</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded-full bg-gradient-to-r from-amber-400 to-amber-600"></div>
                      <span className="text-sm">Street Food</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Call to Action Section */}
        <div className="py-16 bg-gradient-to-r from-luxury-mahogany to-luxury-darkwood text-white relative overflow-hidden">
          {/* Background Animation */}
          <div className="absolute inset-0 opacity-20">
            <div className="floating-cutlery absolute top-1/4 left-1/4 text-6xl animate-float-luxury">🍴</div>
            <div className="floating-cutlery absolute top-1/2 right-1/4 text-5xl animate-float-luxury" style={{ animationDelay: '1s' }}>🥘</div>
            <div className="floating-cutlery absolute bottom-1/4 left-1/2 text-7xl animate-float-luxury" style={{ animationDelay: '2s' }}>🍽️</div>
          </div>
          
          <div className="container mx-auto px-4 text-center relative z-10">
            <h2 className="text-3xl md:text-4xl font-cinzel font-bold mb-6">
              Ready to Experience Sri Lanka's Culinary Excellence?
            </h2>
            <p className="text-lg mb-8 opacity-90 max-w-2xl mx-auto">
              From street food adventures to fine dining experiences, discover the flavors that make Sri Lankan cuisine truly extraordinary.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                className="bg-luxury-gold hover:bg-luxury-bronze text-luxury-darkwood px-8 py-4 text-lg font-semibold rounded-lg shadow-copper"
              >
                <Phone className="mr-2 h-5 w-5" />
                Plan Your Culinary Journey
              </Button>
              <Button 
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-luxury-darkwood px-8 py-4 text-lg"
              >
                <Award className="mr-2 h-5 w-5" />
                Share Your Passport
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default RestaurantGuide;
