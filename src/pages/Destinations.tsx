import React, { useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { MapPin, Clock, Star, Search, Filter, Users, Utensils, Camera, Hotel } from 'lucide-react'
import { useCities } from '@/hooks/useCityData'
import LoadingSpinner from '@/components/LoadingSpinner'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

// Top 10 Sri Lankan cities data with enhanced information
const TOP_CITIES = [
  {
    name: 'Colombo',
    slug: 'colombo',
    province: 'Western Province',
    description: 'The bustling commercial capital with colonial architecture, vibrant markets, and world-class dining.',
    highlights: ['Galle Face Green', 'National Museum', 'Pettah Markets'],
    population: '750,000+',
    image: 'https://images.unsplash.com/photo-1577717903315-1691ae25ab3f?w=500&h=300&fit=crop',
    experienceTypes: ['Fine Dining', 'Shopping', 'Museums', 'Nightlife']
  },
  {
    name: 'Kandy',
    slug: 'kandy',
    province: 'Central Province', 
    description: 'Sacred city home to the Temple of the Tooth, surrounded by misty mountains and cultural heritage.',
    highlights: ['Temple of the Tooth', 'Royal Botanical Gardens', 'Kandy Lake'],
    population: '125,000+',
    image: 'https://images.unsplash.com/photo-1588598198321-9735fd0f5073?w=500&h=300&fit=crop',
    experienceTypes: ['Cultural Sites', 'Nature Walks', 'Traditional Arts', 'Sacred Tours']
  },
  {
    name: 'Galle',
    slug: 'galle',
    province: 'Southern Province',
    description: 'Historic port city with Dutch colonial fort, stunning beaches, and charming cobblestone streets.',
    highlights: ['Galle Fort', 'Dutch Reformed Church', 'Lighthouse'],
    population: '100,000+',
    image: 'https://images.unsplash.com/photo-1569154941061-e231b4725ef1?w=500&h=300&fit=crop',
    experienceTypes: ['Historic Tours', 'Beach Activities', 'Art Galleries', 'Sunset Views']
  },
  {
    name: 'Anuradhapura',
    slug: 'anuradhapura',
    province: 'North Central Province',
    description: 'Ancient capital with magnificent stupas, sacred trees, and 2,400 years of Buddhist history.',
    highlights: ['Sri Maha Bodhi', 'Ruwanwelisaya', 'Ancient Reservoirs'],
    population: '60,000+',
    image: 'https://images.unsplash.com/photo-1588001400947-6385aef4ab0e?w=500&h=300&fit=crop',
    experienceTypes: ['Archaeological Sites', 'Spiritual Journeys', 'Cycling Tours', 'Photography']
  },
  {
    name: 'Polonnaruwa',
    slug: 'polonnaruwa', 
    province: 'North Central Province',
    description: 'Medieval capital showcasing exquisite stone carvings, ancient palaces, and UNESCO heritage.',
    highlights: ['Gal Vihara', 'Royal Palace', 'Parakrama Samudra'],
    population: '15,000+',
    image: 'https://images.unsplash.com/photo-1588598137318-6cd0e2e4f2f3?w=500&h=300&fit=crop',
    experienceTypes: ['Ancient Ruins', 'Cultural Learning', 'Nature Reserves', 'Historical Tours']
  },
  {
    name: 'Nuwara Eliya',
    slug: 'nuwara-eliya',
    province: 'Central Province',
    description: 'Cool mountain retreat known as "Little England" with tea plantations and colonial charm.',
    highlights: ['Tea Plantations', 'Victoria Park', 'Lake Gregory'],
    population: '30,000+',
    image: 'https://images.unsplash.com/photo-1605538883669-825200433431?w=500&h=300&fit=crop',
    experienceTypes: ['Tea Estate Tours', 'Cool Climate', 'Hiking Trails', 'Colonial Architecture']
  },
  {
    name: 'Ella',
    slug: 'ella',
    province: 'Uva Province',
    description: 'Mountain village paradise with dramatic viewpoints, waterfalls, and the famous Nine Arch Bridge.',
    highlights: ['Nine Arch Bridge', 'Little Adams Peak', 'Ravana Falls'],
    population: '10,000+',
    image: 'https://images.unsplash.com/photo-1605538883669-825200433431?w=500&h=300&fit=crop',
    experienceTypes: ['Hiking Adventures', 'Railway Journeys', 'Waterfall Visits', 'Instagram Spots']
  },
  {
    name: 'Mirissa',
    slug: 'mirissa',
    province: 'Southern Province',
    description: 'Tropical beach paradise famous for whale watching, pristine sands, and vibrant nightlife.',
    highlights: ['Whale Watching', 'Coconut Tree Hill', 'Secret Beach'],
    population: '5,000+',
    image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=500&h=300&fit=crop',
    experienceTypes: ['Whale Watching', 'Beach Relaxation', 'Water Sports', 'Sunset Parties']
  },
  {
    name: 'Trincomalee',
    slug: 'trincomalee',
    province: 'Eastern Province',
    description: 'Historic port with pristine beaches, hot springs, and one of the world\'s finest natural harbors.',
    highlights: ['Nilaveli Beach', 'Fort Frederick', 'Koneswaram Temple'],
    population: '100,000+',
    image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=500&h=300&fit=crop',
    experienceTypes: ['Beach Paradise', 'Snorkeling', 'Historical Sites', 'Wildlife Watching']
  },
  {
    name: 'Jaffna',
    slug: 'jaffna',
    province: 'Northern Province',
    description: 'Cultural heart of Tamil Sri Lanka with unique cuisine, vibrant festivals, and resilient heritage.',
    highlights: ['Jaffna Fort', 'Nallur Temple', 'Delft Island'],
    population: '90,000+',
    image: 'https://images.unsplash.com/photo-1609921141835-ed42426faa5f?w=500&h=300&fit=crop',
    experienceTypes: ['Tamil Culture', 'Unique Cuisine', 'Island Hopping', 'Festival Celebrations']
  },
  {
    name: 'Sigiriya',
    slug: 'sigiriya',
    province: 'Central Province',
    description: 'Ancient rock fortress and UNESCO World Heritage site with stunning frescoes and gardens.',
    highlights: ['Lion Rock', 'Mirror Wall', 'Water Gardens'],
    population: '15,000+',
    image: 'https://images.unsplash.com/photo-1588598137318-6cd0e2e4f2f3?w=500&h=300&fit=crop',
    experienceTypes: ['Ancient History', 'Rock Climbing', 'Archaeological Sites', 'Sunset Views']
  },
  {
    name: 'Arugam Bay',
    slug: 'arugam-bay',
    province: 'Eastern Province',
    description: 'World-renowned surfing destination with laid-back vibes and pristine beaches.',
    highlights: ['Main Point', 'Whiskey Point', 'Elephant Rock'],
    population: '3,500+',
    image: 'https://images.unsplash.com/photo-1502680390469-be75c86b636f?w=500&h=300&fit=crop',
    experienceTypes: ['Surfing', 'Beach Life', 'Lagoon Safari', 'Nightlife']
  },
  {
    name: 'Weligama',
    slug: 'weligama',
    province: 'Southern Province',
    description: 'Beginner-friendly surf paradise with stilt fishermen and coconut tree hills.',
    highlights: ['Weligama Bay', 'Taprobane Island', 'Snake Island'],
    population: '22,000+',
    image: 'https://images.unsplash.com/photo-1539979611693-e7d7db50e4e6?w=500&h=300&fit=crop',
    experienceTypes: ['Surf Schools', 'Beach Bars', 'Stilt Fishing', 'Island Hopping']
  },
  {
    name: 'Bentota',
    slug: 'bentota',
    province: 'Southern Province',
    description: 'Luxury beach resort town with river safaris, water sports, and romantic getaways.',
    highlights: ['Bentota Beach', 'Madu River', 'Brief Garden'],
    population: '25,000+',
    image: 'https://images.unsplash.com/photo-1585409677983-0f6c41ca1c4b?w=500&h=300&fit=crop',
    experienceTypes: ['Luxury Resorts', 'Water Sports', 'River Safari', 'Spa Retreats']
  },
  {
    name: 'Dambulla',
    slug: 'dambulla',
    province: 'Central Province',
    description: 'Home to the magnificent cave temples with ancient Buddhist murals and statues.',
    highlights: ['Cave Temples', 'Golden Buddha', 'Rose Quartz Mountain'],
    population: '75,000+',
    image: 'https://images.unsplash.com/photo-1609921141835-ed42426faa5f?w=500&h=300&fit=crop',
    experienceTypes: ['Cave Temples', 'Cultural Heritage', 'Village Tours', 'Market Visit']
  },
  {
    name: 'Hikkaduwa',
    slug: 'hikkaduwa',
    province: 'Southern Province',
    description: 'Vibrant beach town famous for coral reefs, surfing, and lively nightlife.',
    highlights: ['Coral Sanctuary', 'Beach Parties', 'Turtle Hatchery'],
    population: '18,000+',
    image: 'https://images.unsplash.com/photo-1519452575417-564c1401ecc0?w=500&h=300&fit=crop',
    experienceTypes: ['Snorkeling', 'Surfing', 'Beach Bars', 'Glass Bottom Boats']
  },
  {
    name: 'Mannar',
    slug: 'mannar',
    province: 'Northern Province',
    description: 'Remote island district known for its unique baobab trees, bird sanctuaries, and ancient trade history.',
    highlights: ['Baobab Trees', 'Adam\'s Bridge', 'Vankalai Sanctuary'],
    population: '100,000+',
    image: 'https://images.unsplash.com/photo-1624719573151-83bb9c88a6f1?w=500&h=300&fit=crop',
    experienceTypes: ['Bird Watching', 'Cultural Heritage', 'Kite Surfing', 'Pearl Diving History']
  },
  {
    name: 'Polonnaruwa',
    slug: 'polonnaruwa',
    province: 'North Central Province',
    description: 'Ancient city with magnificent ruins, royal palaces, and Buddhist temples from the 11th century.',
    highlights: ['Gal Vihara', 'Royal Palace', 'Parakrama Samudra'],
    population: '15,000+',
    image: 'https://images.unsplash.com/photo-1612449956144-e8e27b842902?w=500&h=300&fit=crop',
    experienceTypes: ['Ancient Ruins', 'Cycling Tours', 'Archaeological Sites', 'Lake Views']
  },
  {
    name: 'Anuradhapura',
    slug: 'anuradhapura',
    province: 'North Central Province',
    description: 'Sacred Buddhist city with ancient stupas, the Sri Maha Bodhi tree, and thousands of years of history.',
    highlights: ['Sri Maha Bodhi', 'Ruwanwelisaya', 'Jetavanaramaya'],
    population: '50,000+',
    image: 'https://images.unsplash.com/photo-1586765226855-e59dd4401b8a?w=500&h=300&fit=crop',
    experienceTypes: ['Sacred Sites', 'Buddhist Pilgrimage', 'Ancient Architecture', 'Cultural Tours']
  },
  {
    name: 'Kalpitiya',
    slug: 'kalpitiya',
    province: 'North Western Province',
    description: 'Kitesurfing paradise with pristine lagoons, dolphin watching, and untouched beaches.',
    highlights: ['Kite Surfing', 'Dolphin Watching', 'Bar Reef'],
    population: '40,000+',
    image: 'https://images.unsplash.com/photo-1530053969600-caed2596d242?w=500&h=300&fit=crop',
    experienceTypes: ['Kite Surfing', 'Dolphin Tours', 'Lagoon Safari', 'Beach Camping']
  },
  {
    name: 'Adam\'s Peak',
    slug: 'adams-peak',
    province: 'Sabaragamuwa Province',
    description: 'Sacred mountain pilgrimage site with spectacular sunrise views and spiritual significance.',
    highlights: ['Sacred Footprint', 'Sunrise Trek', 'Butterfly Season'],
    population: '5,000+',
    image: 'https://images.unsplash.com/photo-1609921141835-ed42426faa5f?w=500&h=300&fit=crop',
    experienceTypes: ['Mountain Trekking', 'Pilgrimage', 'Sunrise Views', 'Tea Estate Trails']
  },
  {
    name: 'Wadduwa',
    slug: 'wadduwa',
    province: 'Western Province',
    description: 'Tranquil beach town perfect for relaxation with golden beaches and Ayurvedic wellness centers.',
    highlights: ['Golden Beaches', 'Ayurveda Retreats', 'Water Sports'],
    population: '30,000+',
    image: 'https://images.unsplash.com/photo-1540202404-a2f29016b523?w=500&h=300&fit=crop',
    experienceTypes: ['Beach Relaxation', 'Ayurvedic Spa', 'Water Sports', 'Fishing Villages']
  },
  {
    name: 'Matara',
    slug: 'matara',
    province: 'Southern Province',
    description: 'Southern city with colonial charm blending Dutch fortifications, beaches, and cultural vibrancy.',
    highlights: ['Matara Fort', 'Parey Dewa Temple', 'Polhena Beach'],
    population: '70,000+',
    image: 'https://images.unsplash.com/photo-1601401828718-23dd19408305?w=500&h=300&fit=crop',
    experienceTypes: ['Fort Exploration', 'Cultural Tours', 'Beach Activities', 'Temple Visits']
  },
  {
    name: 'Tangalle',
    slug: 'tangalle',
    province: 'Southern Province',
    description: 'Hidden beachside escape offering untouched beaches, luxury retreats, and sea turtle nesting sites.',
    highlights: ['Tangalle Beach', 'Rekawa Turtle Hatchery', 'Mulkirigala Temple'],
    population: '10,000+',
    image: 'https://images.unsplash.com/photo-1590523741831-ab7e8b8f9c7f?w=500&h=300&fit=crop',
    experienceTypes: ['Beach Retreat', 'Turtle Watching', 'Temple Exploration', 'Peaceful Stays']
  },
  {
    name: 'Negombo',
    slug: 'negombo',
    province: 'Western Province',
    description: 'Beach gateway near the airport, ideal for first or last night stays with canals and seafood markets.',
    highlights: ['Negombo Beach', 'Dutch Canal', 'Fish Market'],
    population: '140,000+',
    image: 'https://images.unsplash.com/photo-1597660952261-aa0aaccd46d1?w=500&h=300&fit=crop',
    experienceTypes: ['Beach Walks', 'Canal Tours', 'Seafood Dining', 'Airport Proximity']
  },
  {
    name: 'Badulla',
    slug: 'badulla',
    province: 'Uva Province',
    description: 'Hill country heritage town marking the end of the scenic railway with temples and waterfalls.',
    highlights: ['Muthiyangana Temple', 'Dunhinda Falls', 'Railway Station'],
    population: '45,000+',
    image: 'https://images.unsplash.com/photo-1609177225088-e482d69e7a7f?w=500&h=300&fit=crop',
    experienceTypes: ['Temple Tours', 'Waterfall Hikes', 'Train Journey', 'Hill Country Views']
  },
  {
    name: 'Ratnapura',
    slug: 'ratnapura',
    province: 'Sabaragamuwa Province',
    description: 'City of gems known for precious stone mining, waterfalls, and gateway to Sinharaja rainforest.',
    highlights: ['Gem Museum', 'Bopath Ella Falls', 'Gem Mining Tours'],
    population: '52,000+',
    image: 'https://images.unsplash.com/photo-1602407294553-6ac9170b3ed0?w=500&h=300&fit=crop',
    experienceTypes: ['Gem Tours', 'Waterfall Visits', 'Rainforest Access', 'Museum Exploration']
  },
  {
    name: 'Puttalam',
    slug: 'puttalam',
    province: 'North Western Province',
    description: 'Coastal area famous for salt production, lagoons, and migratory bird watching opportunities.',
    highlights: ['Puttalam Lagoon', 'Salt Pans', 'Mangrove Forests'],
    population: '45,000+',
    image: 'https://images.unsplash.com/photo-1577640128125-85d724d47ce2?w=500&h=300&fit=crop',
    experienceTypes: ['Bird Watching', 'Lagoon Tours', 'Eco Tourism', 'Salt Pan Visits']
  },
  {
    name: 'Hambantota',
    slug: 'hambantota',
    province: 'Southern Province',
    description: 'Emerging coastal city with modern port facilities, beaches, and gateway to southern parks.',
    highlights: ['Port Area', 'Dry Zone Garden', 'Safari Access'],
    population: '12,000+',
    image: 'https://images.unsplash.com/photo-1619537903549-0981a665b60b?w=500&h=300&fit=crop',
    experienceTypes: ['Port Tours', 'Beach Activities', 'Safari Planning', 'Development Tours']
  },
  {
    name: 'Vavuniya',
    slug: 'vavuniya',
    province: 'Northern Province',
    description: 'Northern gateway city connecting central and northern regions with rich Tamil culture.',
    highlights: ['Vavuniya Museum', 'Local Markets', 'Hindu Temples'],
    population: '100,000+',
    image: 'https://images.unsplash.com/photo-1624719573151-83bb9c88a6f1?w=500&h=300&fit=crop',
    experienceTypes: ['Cultural Tours', 'Market Visits', 'Temple Tours', 'Transit Hub']
  },
  {
    name: 'Kurunegala',
    slug: 'kurunegala',
    province: 'North Western Province',
    description: 'Central hub city known for Elephant Rock, scenic views, and Cultural Triangle access.',
    highlights: ['Elephant Rock', 'Kurunegala Lake', 'Ridi Viharaya'],
    population: '30,000+',
    image: 'https://images.unsplash.com/photo-1606820246174-bc6c7f7c2f28?w=500&h=300&fit=crop',
    experienceTypes: ['Rock Hiking', 'Lake Views', 'Temple Visits', 'Cultural Triangle']
  },
  {
    name: 'Batticaloa',
    slug: 'batticaloa',
    province: 'Eastern Province',
    description: 'Peaceful east coast town with tranquil beaches, singing fish lagoon, and friendly locals.',
    highlights: ['Batticaloa Lighthouse', 'Kallady Bridge', 'Singing Fish Lagoon'],
    population: '90,000+',
    image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=500&h=300&fit=crop',
    experienceTypes: ['Lagoon Tours', 'Beach Relaxation', 'Lighthouse Visits', 'Local Culture']
  }
]

const Destinations = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedProvince, setSelectedProvince] = useState('')
  const { data: cities, isLoading, error } = useCities()

  // Filter cities
  const filteredCities = TOP_CITIES.filter(city => {
    const matchesSearch = city.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         city.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         city.experienceTypes.some(type => type.toLowerCase().includes(searchTerm.toLowerCase()))
    
    const matchesProvince = !selectedProvince || city.province === selectedProvince
    
    return matchesSearch && matchesProvince
  })

  // Get unique provinces
  const provinces = Array.from(new Set(TOP_CITIES.map(city => city.province)))

  const handleClearFilters = () => {
    setSearchTerm('')
    setSelectedProvince('')
  }

  const handleCityExplore = (citySlug: string) => {
    window.location.href = `/destinations/${citySlug}`
  }

  return (
    <>
      <Helmet>
        <title>Discover Sri Lanka's Top Cities – Restaurants, Activities & Bookings | Recharge Travels</title>
        <meta name="description" content="Discover Sri Lanka's Top Cities—dine, explore, play & book your own way. From Colombo's dining scene to Kandy's temples, explore and book individual experiences without bundling into fixed tour packages." />
        <meta property="og:title" content="Discover Sri Lanka's Top Cities – Restaurants, Activities & Bookings" />
        <meta property="og:description" content="Discover Sri Lanka's Top Cities—dine, explore, play & book your own way. Book restaurants, experiences, hotels." />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "TouristDestination",
            "name": "Sri Lanka Cities Directory",
            "description": "Explore Sri Lanka's top cities and book individual experiences",
            "url": "https://preview--rechargetravels.lovable.app/destinations"
          })}
        </script>
      </Helmet>

      <Header />

      <div className="min-h-screen bg-gradient-to-br from-background via-background/90 to-secondary/10">
        {/* Hero Section */}
        <div className="relative gradient-wildlife text-white py-24 overflow-hidden">
          <div className="absolute inset-0 bg-black/30"></div>
          
          {/* Animated Background Elements */}
          <div className="absolute top-10 left-10 wildlife-float opacity-30">
            <MapPin className="h-16 w-16 text-white/40" />
          </div>
          <div className="absolute top-20 right-20 wildlife-bounce opacity-20">
            <Star className="h-12 w-12 text-white/30" />
          </div>
          <div className="absolute bottom-10 left-1/3 wildlife-pulse opacity-25">
            <Utensils className="h-14 w-14 text-white/35" />
          </div>
          
          <div className="container mx-auto px-4 relative z-10">
            <div className="text-center fade-in-up">
              <div className="inline-flex items-center space-x-2 glass rounded-full px-6 py-3 mb-8">
                <Star className="h-5 w-5 text-wild-orange" />
                <span className="text-sm font-poppins font-semibold">Top Destinations</span>
              </div>
              
              <h1 className="text-5xl md:text-6xl mb-6 font-poppins font-bold">
                Discover Sri Lanka's <span className="text-gradient">Top Cities</span>
              </h1>
              <p className="text-xl md:text-2xl max-w-4xl mx-auto leading-relaxed text-white/90 font-inter mb-8">
                Dine, explore, play & book your own way—without bundling into fixed tour packages
              </p>
              <div className="flex flex-wrap justify-center gap-4 text-sm">
                <div className="flex items-center glass rounded-full px-4 py-2">
                  <Utensils className="h-4 w-4 mr-2" />
                  Restaurants
                </div>
                <div className="flex items-center glass rounded-full px-4 py-2">
                  <Camera className="h-4 w-4 mr-2" />
                  Experiences
                </div>
                <div className="flex items-center glass rounded-full px-4 py-2">
                  <Hotel className="h-4 w-4 mr-2" />
                  Hotels
                </div>
                <div className="flex items-center glass rounded-full px-4 py-2">
                  <MapPin className="h-4 w-4 mr-2" />
                  Transport
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="sticky top-16 z-40 glass-dark border-b py-6 backdrop-blur-lg">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="relative group md:col-span-2">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 group-hover:text-primary transition-colors" />
                <Input
                  type="text"
                  placeholder="Search destinations, attractions, or activities..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-12 py-4 rounded-xl border-2 border-gray-200 focus:border-primary transition-all duration-300 bg-white/80 backdrop-blur-sm"
                />
              </div>
              
              <div className="flex gap-4">
                <div className="relative group flex-1">
                  <select
                    value={selectedProvince}
                    onChange={(e) => setSelectedProvince(e.target.value)}
                    className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-primary transition-all duration-300 bg-white/80 backdrop-blur-sm font-poppins"
                  >
                    <option value="">All Provinces</option>
                    {provinces.map(province => (
                      <option key={province} value={province}>{province}</option>
                    ))}
                  </select>
                </div>

                <Button 
                  variant="outline" 
                  onClick={handleClearFilters}
                  className="px-6 py-4 rounded-xl border-2 border-primary text-primary hover:bg-primary hover:text-white transition-all duration-300 font-poppins font-semibold"
                >
                  <Filter className="w-5 h-5" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Cities Grid */}
        <div className="container mx-auto px-4 section-padding">
          {isLoading && (
            <LoadingSpinner fullScreen message="Loading cities..." />
          )}

          {filteredCities.length === 0 && !isLoading && (
            <div className="text-center py-16 fade-in">
              <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
                <MapPin className="h-12 w-12 text-gray-400" />
              </div>
              <h3 className="text-2xl font-poppins font-semibold text-gray-900 mb-4">No cities found</h3>
              <p className="text-gray-600 text-lg mb-6 max-w-md mx-auto">
                We couldn't find any cities matching your criteria. Try adjusting your search.
              </p>
              <Button onClick={handleClearFilters} className="btn-primary">
                Clear All Filters
              </Button>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredCities.map((city, index) => (
              <Card 
                key={city.slug} 
                className="card-interactive shadow-soft hover:shadow-wildlife border-0 fade-in-up group overflow-hidden"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={city.image}
                    alt={`${city.name} cityscape`}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  
                  {/* Province Badge */}
                  <Badge className="absolute top-4 right-4 bg-primary/90 text-white border-0 font-poppins font-semibold backdrop-blur-sm">
                    {city.province.replace(' Province', '')}
                  </Badge>
                  
                  {/* Population Badge */}
                  <div className="absolute top-4 left-4 flex items-center space-x-1 glass rounded-full px-3 py-1">
                    <Users className="h-4 w-4 text-white" />
                    <span className="text-white font-poppins font-semibold text-sm">{city.population}</span>
                  </div>
                </div>

                <CardHeader className="pb-4">
                  <CardTitle className="text-2xl text-gray-900 mb-3 group-hover:text-primary transition-colors">
                    {city.name}
                  </CardTitle>
                  
                  <p className="text-gray-600 mb-4 line-clamp-2 font-inter leading-relaxed">
                    {city.description}
                  </p>

                  {/* Highlights */}
                  <div className="mb-4">
                    <h4 className="text-sm font-semibold text-gray-700 mb-2">Must-See Highlights:</h4>
                    <div className="flex flex-wrap gap-1">
                      {city.highlights.slice(0, 3).map((highlight, idx) => (
                        <Badge 
                          key={idx} 
                          variant="outline" 
                          className="text-xs border-primary/30 text-primary hover:bg-primary hover:text-white transition-colors font-inter"
                        >
                          {highlight}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Experience Types */}
                  <div className="mb-4">
                    <h4 className="text-sm font-semibold text-gray-700 mb-2">Popular Experiences:</h4>
                    <div className="flex flex-wrap gap-1">
                      {city.experienceTypes.slice(0, 3).map((type, idx) => (
                        <Badge 
                          key={idx} 
                          variant="secondary" 
                          className="text-xs font-inter"
                        >
                          {type}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="pt-0">
                  <Button 
                    className="w-full btn-primary group-hover:scale-105 transition-transform duration-300"
                    onClick={() => handleCityExplore(city.slug)}
                  >
                    <Star className="mr-2 h-4 w-4" />
                    Explore {city.name}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Statistics Section */}
          <div className="mt-16 fade-in-up">
            <div className="glass rounded-2xl p-8 border-0 shadow-medium">
              <div className="text-center mb-8">
                <h3 className="text-3xl font-bold text-gray-900 mb-4 font-poppins">Explore Sri Lanka Your Way</h3>
                <p className="text-gray-600 font-inter text-lg">Book individual experiences without being tied to fixed tour packages</p>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                <div className="text-center group">
                  <div className="w-16 h-16 bg-gradient-sunset rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                    <MapPin className="h-8 w-8 text-white" />
                  </div>
                  <div className="text-4xl font-bold text-primary mb-2 font-poppins">10</div>
                  <div className="text-gray-600 font-inter font-medium">Top Cities</div>
                </div>
                
                <div className="text-center group">
                  <div className="w-16 h-16 bg-gradient-forest rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                    <Utensils className="h-8 w-8 text-white" />
                  </div>
                  <div className="text-4xl font-bold text-secondary mb-2 font-poppins">500+</div>
                  <div className="text-gray-600 font-inter font-medium">Restaurants</div>
                </div>
                
                <div className="text-center group">
                  <div className="w-16 h-16 bg-gradient-ocean rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                    <Camera className="h-8 w-8 text-white" />
                  </div>
                  <div className="text-4xl font-bold text-accent mb-2 font-poppins">300+</div>
                  <div className="text-gray-600 font-inter font-medium">Experiences</div>
                </div>

                <div className="text-center group">
                  <div className="w-16 h-16 bg-gradient-purple rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                    <Hotel className="h-8 w-8 text-white" />
                  </div>
                  <div className="text-4xl font-bold text-purple-600 mb-2 font-poppins">200+</div>
                  <div className="text-gray-600 font-inter font-medium">Hotels</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  )
}

export default Destinations