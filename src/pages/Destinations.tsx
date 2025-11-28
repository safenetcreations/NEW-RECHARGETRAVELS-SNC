import React, { useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'
import { MapPin, Mountain, Waves, Sun, Compass, Building2, ArrowRight, Star, Clock, Users } from 'lucide-react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { destinationsByRegion } from '@/components/header/navigation/menuData'

// Enhanced destination data with images
const destinationImages: Record<string, { image: string; highlights: string[]; bestTime: string }> = {
  // Northern
  'jaffna': { 
    image: 'https://images.unsplash.com/photo-1609921141835-ed42426faa5f?w=600&h=400&fit=crop',
    highlights: ['Nallur Temple', 'Jaffna Fort', 'Unique Cuisine'],
    bestTime: 'Jan - Sep'
  },
  'delft-island': { 
    image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=600&h=400&fit=crop',
    highlights: ['Wild Ponies', 'Dutch Ruins', 'Pristine Beaches'],
    bestTime: 'Mar - Sep'
  },
  'mullaitivu': { 
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&h=400&fit=crop',
    highlights: ['Pristine Beaches', 'Fishing Villages', 'War Memorials'],
    bestTime: 'Mar - Sep'
  },
  'mannar': { 
    image: 'https://images.unsplash.com/photo-1624719573151-83bb9c88a6f1?w=600&h=400&fit=crop',
    highlights: ['Baobab Trees', 'Bird Sanctuary', 'Adam\'s Bridge'],
    bestTime: 'Feb - Sep'
  },
  'vavuniya': { 
    image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&h=400&fit=crop',
    highlights: ['Tamil Culture', 'Hindu Temples', 'Local Markets'],
    bestTime: 'Year Round'
  },
  // Central
  'kandy': { 
    image: 'https://images.unsplash.com/photo-1588598198321-9735fd0f5073?w=600&h=400&fit=crop',
    highlights: ['Temple of Tooth', 'Botanical Gardens', 'Kandy Lake'],
    bestTime: 'Jan - Apr'
  },
  'nuwaraeliya': { 
    image: 'https://images.unsplash.com/photo-1605538883669-825200433431?w=600&h=400&fit=crop',
    highlights: ['Tea Estates', 'Gregory Lake', 'Cool Climate'],
    bestTime: 'Feb - May'
  },
  'ella': { 
    image: 'https://images.unsplash.com/photo-1586861635167-e5223aadc9fe?w=600&h=400&fit=crop',
    highlights: ['Nine Arch Bridge', 'Little Adam\'s Peak', 'Ravana Falls'],
    bestTime: 'Jan - Mar'
  },
  'hatton': { 
    image: 'https://images.unsplash.com/photo-1596895111956-bf1cf0599ce5?w=600&h=400&fit=crop',
    highlights: ['Adam\'s Peak', 'Tea Plantations', 'Scenic Trains'],
    bestTime: 'Dec - May'
  },
  'adams-peak': { 
    image: 'https://images.unsplash.com/photo-1609921141835-ed42426faa5f?w=600&h=400&fit=crop',
    highlights: ['Sacred Footprint', 'Sunrise Trek', 'Pilgrimage'],
    bestTime: 'Dec - May'
  },
  'badulla': { 
    image: 'https://images.unsplash.com/photo-1609177225088-e482d69e7a7f?w=600&h=400&fit=crop',
    highlights: ['Dunhinda Falls', 'Temple Tours', 'Train Journey'],
    bestTime: 'Jan - Apr'
  },
  'sigiriya': { 
    image: 'https://images.unsplash.com/photo-1588598137318-6cd0e2e4f2f3?w=600&h=400&fit=crop',
    highlights: ['Lion Rock', 'Ancient Frescoes', 'Water Gardens'],
    bestTime: 'Jan - Apr'
  },
  'dambulla': { 
    image: 'https://images.unsplash.com/photo-1612449956144-e8e27b842902?w=600&h=400&fit=crop',
    highlights: ['Cave Temples', 'Golden Buddha', 'UNESCO Site'],
    bestTime: 'Feb - Sep'
  },
  'polonnaruwa': { 
    image: 'https://images.unsplash.com/photo-1588598137318-6cd0e2e4f2f3?w=600&h=400&fit=crop',
    highlights: ['Gal Vihara', 'Ancient Ruins', 'Cycling Tours'],
    bestTime: 'Feb - Sep'
  },
  'anuradhapura': { 
    image: 'https://images.unsplash.com/photo-1586765226855-e59dd4401b8a?w=600&h=400&fit=crop',
    highlights: ['Sri Maha Bodhi', 'Ancient Stupas', 'Sacred City'],
    bestTime: 'Feb - Sep'
  },
  'kurunegala': { 
    image: 'https://images.unsplash.com/photo-1606820246174-bc6c7f7c2f28?w=600&h=400&fit=crop',
    highlights: ['Elephant Rock', 'Lake Views', 'Temple Visits'],
    bestTime: 'Year Round'
  },
  'ratnapura': { 
    image: 'https://images.unsplash.com/photo-1602407294553-6ac9170b3ed0?w=600&h=400&fit=crop',
    highlights: ['Gem Mining', 'Waterfalls', 'Rainforest'],
    bestTime: 'Dec - Apr'
  },
  // Southern
  'galle': { 
    image: 'https://images.unsplash.com/photo-1569154941061-e231b4725ef1?w=600&h=400&fit=crop',
    highlights: ['Dutch Fort', 'Lighthouse', 'Colonial Streets'],
    bestTime: 'Dec - Apr'
  },
  'mirissa': { 
    image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=600&h=400&fit=crop',
    highlights: ['Whale Watching', 'Coconut Tree Hill', 'Beach Life'],
    bestTime: 'Nov - Apr'
  },
  'weligama': { 
    image: 'https://images.unsplash.com/photo-1539979611693-e7d7db50e4e6?w=600&h=400&fit=crop',
    highlights: ['Surfing', 'Stilt Fishermen', 'Beach Bars'],
    bestTime: 'Nov - Apr'
  },
  'hikkaduwa': { 
    image: 'https://images.unsplash.com/photo-1519452575417-564c1401ecc0?w=600&h=400&fit=crop',
    highlights: ['Coral Reefs', 'Nightlife', 'Turtle Beach'],
    bestTime: 'Nov - Apr'
  },
  'bentota': { 
    image: 'https://images.unsplash.com/photo-1585409677983-0f6c41ca1c4b?w=600&h=400&fit=crop',
    highlights: ['Luxury Resorts', 'River Safari', 'Water Sports'],
    bestTime: 'Nov - Apr'
  },
  'tangalle': { 
    image: 'https://images.unsplash.com/photo-1590523741831-ab7e8b8f9c7f?w=600&h=400&fit=crop',
    highlights: ['Turtle Nesting', 'Secret Beaches', 'Luxury Stays'],
    bestTime: 'Nov - Apr'
  },
  'matara': { 
    image: 'https://images.unsplash.com/photo-1601401828718-23dd19408305?w=600&h=400&fit=crop',
    highlights: ['Dutch Fort', 'Beach Temple', 'Colonial Heritage'],
    bestTime: 'Nov - Apr'
  },
  'hambantota': { 
    image: 'https://images.unsplash.com/photo-1619537903549-0981a665b60b?w=600&h=400&fit=crop',
    highlights: ['Safari Gateway', 'Port City', 'Beaches'],
    bestTime: 'Year Round'
  },
  // Eastern
  'trincomalee': { 
    image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=600&h=400&fit=crop',
    highlights: ['Nilaveli Beach', 'Hot Springs', 'Natural Harbor'],
    bestTime: 'Apr - Sep'
  },
  'arugam-bay': { 
    image: 'https://images.unsplash.com/photo-1502680390469-be75c86b636f?w=600&h=400&fit=crop',
    highlights: ['World-Class Surf', 'Beach Vibes', 'Lagoon Safari'],
    bestTime: 'Apr - Oct'
  },
  'batticaloa': { 
    image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&h=400&fit=crop',
    highlights: ['Singing Fish', 'Lagoon', 'Peaceful Beaches'],
    bestTime: 'Apr - Sep'
  },
  // Western
  'colombo': { 
    image: 'https://images.unsplash.com/photo-1577717903315-1691ae25ab3f?w=600&h=400&fit=crop',
    highlights: ['Galle Face', 'Shopping', 'Fine Dining'],
    bestTime: 'Year Round'
  },
  'negombo': { 
    image: 'https://images.unsplash.com/photo-1597660952261-aa0aaccd46d1?w=600&h=400&fit=crop',
    highlights: ['Beach Gateway', 'Fish Market', 'Dutch Canal'],
    bestTime: 'Nov - Apr'
  },
  'wadduwa': { 
    image: 'https://images.unsplash.com/photo-1540202404-a2f29016b523?w=600&h=400&fit=crop',
    highlights: ['Ayurveda', 'Golden Beach', 'Relaxation'],
    bestTime: 'Nov - Apr'
  },
  'kalpitiya': { 
    image: 'https://images.unsplash.com/photo-1530053969600-caed2596d242?w=600&h=400&fit=crop',
    highlights: ['Kitesurfing', 'Dolphins', 'Lagoon Safari'],
    bestTime: 'May - Oct'
  },
  'puttalam': { 
    image: 'https://images.unsplash.com/photo-1577640128125-85d724d47ce2?w=600&h=400&fit=crop',
    highlights: ['Bird Watching', 'Salt Pans', 'Lagoons'],
    bestTime: 'Year Round'
  }
}

const regionIcons: Record<string, React.ReactNode> = {
  northern: <Compass className="w-5 h-5" />,
  central: <Mountain className="w-5 h-5" />,
  southern: <Waves className="w-5 h-5" />,
  eastern: <Sun className="w-5 h-5" />,
  western: <Building2 className="w-5 h-5" />
}

const regionColors: Record<string, { bg: string; text: string; gradient: string; border: string }> = {
  northern: { 
    bg: 'from-amber-500 to-orange-500', 
    text: 'text-amber-700', 
    gradient: 'from-amber-50 to-orange-50',
    border: 'border-amber-200'
  },
  central: { 
    bg: 'from-emerald-500 to-green-600', 
    text: 'text-emerald-700', 
    gradient: 'from-emerald-50 to-green-50',
    border: 'border-emerald-200'
  },
  southern: { 
    bg: 'from-blue-500 to-cyan-500', 
    text: 'text-blue-700', 
    gradient: 'from-blue-50 to-cyan-50',
    border: 'border-blue-200'
  },
  eastern: { 
    bg: 'from-purple-500 to-indigo-500', 
    text: 'text-purple-700', 
    gradient: 'from-purple-50 to-indigo-50',
    border: 'border-purple-200'
  },
  western: { 
    bg: 'from-rose-500 to-pink-500', 
    text: 'text-rose-700', 
    gradient: 'from-rose-50 to-pink-50',
    border: 'border-rose-200'
  }
}

const regionDescriptions: Record<string, string> = {
  northern: 'Explore the cultural heart of Tamil Sri Lanka with ancient temples, unique cuisine, and untouched islands',
  central: 'Discover misty mountains, ancient kingdoms, sacred temples, and world-famous tea plantations',
  southern: 'Golden beaches, historic forts, whale watching, and the best of Sri Lankan coastal life',
  eastern: 'Pristine beaches, world-class surf breaks, and tranquil lagoons await on the sunrise coast',
  western: 'Modern capital city vibes, beach gateways, and convenient airport connections'
}

const Destinations = () => {
  const [activeRegion, setActiveRegion] = useState<string>('northern')
  const [searchTerm, setSearchTerm] = useState('')

  const regions = Object.entries(destinationsByRegion)
  const totalDestinations = Object.values(destinationsByRegion).reduce(
    (acc, region) => acc + region.destinations.length, 0
  )

  // Filter destinations based on search
  const getFilteredDestinations = (regionKey: string) => {
    const region = destinationsByRegion[regionKey as keyof typeof destinationsByRegion]
    if (!searchTerm) return region.destinations
    return region.destinations.filter(dest => 
      dest.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dest.description.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }

  // Get slug from href
  const getSlug = (href: string) => {
    const parts = href.split('/')
    return parts[parts.length - 1]
  }

  return (
    <>
      <Helmet>
        <title>Explore All Destinations in Sri Lanka | Recharge Travels</title>
        <meta
          name="description"
          content="Discover Sri Lanka's top destinations by region - Northern, Central, Southern, Eastern & Western. Plan your perfect trip with our comprehensive destination guide."
        />
        <meta property="og:title" content="Explore All Destinations in Sri Lanka | Recharge Travels" />
        <meta property="og:description" content="Discover Sri Lanka's top destinations by region. From Jaffna's Tamil heritage to Galle's colonial charm." />
        <link rel="canonical" href="https://www.rechargetravels.com/destinations" />
      </Helmet>

      <Header />

      <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 pt-24 pb-16">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1586861635167-e5223aadc9fe?w=1920&h=600&fit=crop')] bg-cover bg-center opacity-20"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-slate-900/50"></div>
          
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 px-4 py-2 text-sm text-amber-300 mb-6">
                <MapPin className="w-4 h-4" />
                <span>{totalDestinations}+ Handpicked Destinations Across Sri Lanka</span>
              </div>
              
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6">
                Discover Sri Lanka
                <span className="block mt-2 bg-gradient-to-r from-amber-400 via-orange-400 to-rose-400 bg-clip-text text-transparent">
                  One Region at a Time
                </span>
              </h1>
              
              <p className="text-lg text-gray-300 max-w-2xl mx-auto mb-8">
                From the cultural treasures of the North to the golden beaches of the South, 
                explore every corner of this island paradise
              </p>

              {/* Search Bar */}
              <div className="max-w-xl mx-auto">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search destinations..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-6 py-4 pl-14 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-400/50 focus:border-amber-400/50"
                  />
                  <MapPin className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Region Tabs */}
        <section className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex overflow-x-auto scrollbar-hide py-4 gap-2 sm:gap-3 justify-start sm:justify-center">
              {regions.map(([key, region]) => (
                <button
                  key={key}
                  onClick={() => setActiveRegion(key)}
                  className={`flex items-center gap-2 px-4 sm:px-6 py-3 rounded-full text-sm font-semibold whitespace-nowrap transition-all duration-300 ${
                    activeRegion === key
                      ? `bg-gradient-to-r ${regionColors[key].bg} text-white shadow-lg scale-105`
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {regionIcons[key]}
                  <span className="hidden sm:inline">{region.title}</span>
                  <span className="sm:hidden">{key.charAt(0).toUpperCase() + key.slice(1)}</span>
                  <span className={`ml-1 px-2 py-0.5 rounded-full text-xs ${
                    activeRegion === key 
                      ? 'bg-white/20' 
                      : 'bg-gray-200'
                  }`}>
                    {region.destinations.length}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Active Region Content */}
        <section className="py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Region Header */}
            <div className={`rounded-2xl p-6 sm:p-8 mb-8 bg-gradient-to-r ${regionColors[activeRegion].gradient} border ${regionColors[activeRegion].border}`}>
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <div className={`p-2 rounded-xl bg-gradient-to-r ${regionColors[activeRegion].bg} text-white`}>
                      {regionIcons[activeRegion]}
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
                      {destinationsByRegion[activeRegion as keyof typeof destinationsByRegion].title}
                    </h2>
                  </div>
                  <p className="text-gray-600 max-w-2xl">
                    {regionDescriptions[activeRegion]}
                  </p>
                </div>
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-sm">
                    <MapPin className="w-4 h-4 text-gray-500" />
                    <span className="font-semibold text-gray-900">
                      {getFilteredDestinations(activeRegion).length} Destinations
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Destination Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {getFilteredDestinations(activeRegion).map((destination) => {
                const slug = getSlug(destination.href)
                const imageData = destinationImages[slug] || {
                  image: 'https://images.unsplash.com/photo-1586861635167-e5223aadc9fe?w=600&h=400&fit=crop',
                  highlights: ['Explore', 'Discover', 'Experience'],
                  bestTime: 'Year Round'
                }

                return (
                  <Link
                    key={destination.href}
                    to={destination.href}
                    className="group relative bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-500 hover:-translate-y-2"
                  >
                    {/* Image */}
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={imageData.image}
                        alt={destination.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
                      
                      {/* Best Time Badge */}
                      <div className="absolute top-3 right-3">
                        <div className="flex items-center gap-1 px-2 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-medium text-gray-700">
                          <Clock className="w-3 h-3" />
                          {imageData.bestTime}
                        </div>
                      </div>

                      {/* Region Badge */}
                      <div className="absolute top-3 left-3">
                        <div className={`px-2 py-1 rounded-full text-xs font-semibold text-white bg-gradient-to-r ${regionColors[activeRegion].bg}`}>
                          {activeRegion.charAt(0).toUpperCase() + activeRegion.slice(1)}
                        </div>
                      </div>

                      {/* Title Overlay */}
                      <div className="absolute bottom-0 left-0 right-0 p-4">
                        <h3 className="text-xl font-bold text-white mb-1 group-hover:text-amber-300 transition-colors">
                          {destination.title}
                        </h3>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-4">
                      <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                        {destination.description}
                      </p>

                      {/* Highlights */}
                      <div className="flex flex-wrap gap-1.5 mb-4">
                        {imageData.highlights.map((highlight, idx) => (
                          <span
                            key={idx}
                            className={`px-2 py-1 rounded-full text-xs font-medium ${regionColors[activeRegion].text} bg-gradient-to-r ${regionColors[activeRegion].gradient}`}
                          >
                            {highlight}
                          </span>
                        ))}
                      </div>

                      {/* CTA */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1 text-sm text-gray-500">
                          <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                          <span>4.8</span>
                          <span className="text-gray-300">•</span>
                          <Users className="w-4 h-4" />
                          <span>Popular</span>
                        </div>
                        <div className={`flex items-center gap-1 text-sm font-semibold ${regionColors[activeRegion].text} group-hover:gap-2 transition-all`}>
                          Explore
                          <ArrowRight className="w-4 h-4" />
                        </div>
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>

            {/* No Results */}
            {getFilteredDestinations(activeRegion).length === 0 && (
              <div className="text-center py-16">
                <div className="mx-auto w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <MapPin className="w-10 h-10 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No destinations found</h3>
                <p className="text-gray-600">Try adjusting your search term</p>
                <button
                  onClick={() => setSearchTerm('')}
                  className="mt-4 px-6 py-2 bg-amber-500 text-white rounded-full font-medium hover:bg-amber-600 transition-colors"
                >
                  Clear Search
                </button>
              </div>
            )}
          </div>
        </section>

        {/* All Regions Overview */}
        <section className="py-12 bg-gradient-to-b from-white to-slate-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Explore All Regions</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Click on any region to discover its unique destinations
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              {regions.map(([key, region]) => (
                <button
                  key={key}
                  onClick={() => {
                    setActiveRegion(key)
                    window.scrollTo({ top: 400, behavior: 'smooth' })
                  }}
                  className={`group p-6 rounded-2xl border-2 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${
                    activeRegion === key 
                      ? `${regionColors[key].border} bg-gradient-to-br ${regionColors[key].gradient}` 
                      : 'border-gray-200 bg-white hover:border-gray-300'
                  }`}
                >
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 bg-gradient-to-r ${regionColors[key].bg} text-white`}>
                    {regionIcons[key]}
                  </div>
                  <h3 className="font-bold text-gray-900 mb-1">{region.title}</h3>
                  <p className="text-sm text-gray-600 mb-3">{region.destinations.length} destinations</p>
                  <div className="flex flex-wrap gap-1">
                    {region.destinations.slice(0, 3).map((d, i) => (
                      <span key={i} className="text-xs text-gray-500">{d.title}{i < 2 ? ',' : ''}</span>
                    ))}
                    {region.destinations.length > 3 && (
                      <span className="text-xs text-gray-400">+{region.destinations.length - 3} more</span>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold text-white mb-4">
              Not sure where to start?
            </h2>
            <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
              Let our Sri Lanka travel experts help you plan the perfect itinerary 
              connecting these amazing destinations into one unforgettable journey.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/book-now"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold rounded-full hover:shadow-lg hover:shadow-amber-500/30 transition-all hover:-translate-y-1"
              >
                Plan My Trip
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                to="/tours"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/10 border border-white/20 text-white font-semibold rounded-full hover:bg-white/20 transition-all"
              >
                Browse Tour Packages
              </Link>
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </>
  )
}

export default Destinations