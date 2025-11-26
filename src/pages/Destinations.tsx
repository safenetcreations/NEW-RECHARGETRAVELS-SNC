import React, { useState, useEffect } from 'react'
import { Helmet } from 'react-helmet-async'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { MapPin, Clock, Star, Search, Filter, Users, Utensils, Camera, Hotel } from 'lucide-react'
import LoadingSpinner from '@/components/LoadingSpinner'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { cmsService } from '@/services/cmsService'
import type { FeaturedDestination } from '@/types/cms'

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
  const [destinations, setDestinations] = useState<FeaturedDestination[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadDestinations = async () => {
      try {
        setIsLoading(true)
        setError(null)
        const data = await cmsService.featuredDestinations.getAll()
        setDestinations(data)
      } catch (err: any) {
        console.error('Failed to load destinations:', err)
        setError('Failed to load destinations')
      } finally {
        setIsLoading(false)
      }
    }

    loadDestinations()
  }, [])

  // Filter cities
  const filteredDestinations = destinations.filter(destination => {
    const search = searchTerm.toLowerCase()
    const matchesSearch =
      destination.name.toLowerCase().includes(search) ||
      (destination.title || '').toLowerCase().includes(search) ||
      (destination.description || '').toLowerCase().includes(search) ||
      (destination.category || '').toLowerCase().includes(search)
    
    const matchesProvince = !selectedProvince || destination.category === selectedProvince
    
    return matchesSearch && matchesProvince
  })

  // Get unique provinces
  const provinces = Array.from(
    new Set(
      destinations
        .map(destination => destination.category)
        .filter(Boolean)
    )
  ) as string[]

  const handleClearFilters = () => {
    setSearchTerm('')
    setSelectedProvince('')
  }

  const handleDestinationExplore = (link: string) => {
    if (!link) return
    if (link.startsWith('http')) {
      window.location.href = link
    } else {
      window.location.href = link
    }
  }
  return (
    <>
      <Helmet>
        <title>Discover Sri Lanka's Top Cities – Restaurants, Activities & Bookings | Recharge Travels</title>
        <meta
          name="description"
          content="Discover Sri Lanka's Top Cities—dine, explore, play & book your own way. From Colombo's dining scene to Kandy's temples, explore and book individual experiences without bundling into fixed tour packages."
        />
        <meta
          property="og:title"
          content="Discover Sri Lanka's Top Cities – Restaurants, Activities & Bookings"
        />
        <meta
          property="og:description"
          content="Discover Sri Lanka's Top Cities—dine, explore, play & book your own way. Book restaurants, experiences, hotels."
        />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "TouristDestination",
            "name": "Sri Lanka Cities Directory",
            "description": "Explore Sri Lanka's top cities and book individual experiences",
            "url": "https://preview--rechargetravels.lovable.app/destinations",
          })}
        </script>
      </Helmet>

      <Header />

      <div className="min-h-screen rt-section-bg flex flex-col">
        <main className="flex-1">
          <section className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 pt-8 pb-10 space-y-8">
            {/* Hero + search / filters */}
            <div className="grid gap-8 lg:grid-cols-[minmax(0,1.7fr)_minmax(0,1.1fr)] items-start">
              <div className="space-y-6">
                <div className="inline-flex items-center gap-2 rounded-full bg-slate-900 text-amber-200 px-3.5 py-1.5 text-[11px] font-medium shadow-md shadow-slate-900/40">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                  <span>Handpicked destinations across Sri Lanka</span>
                </div>

                <div className="space-y-3">
                  <h1 className="text-3xl sm:text-4xl lg:text-5xl font-semibold text-slate-900 tracking-tight">
                    Discover Sri Lanka,
                    <span className="inline-block bg-gradient-to-r from-orange-500 via-amber-400 to-emerald-500 bg-clip-text text-transparent ml-1">
                      one destination at a time
                    </span>
                  </h1>
                  <p className="text-sm sm:text-base text-slate-600 max-w-xl leading-relaxed">
                    From misty tea hills to golden beaches and wildlife-rich national parks, explore Sri
                    Lanka through curated regions, styles, and travel moods—designed for slow, meaningful
                    journeys.
                  </p>
                </div>

                {/* Search / primary filters */}
                <div className="rt-card p-4 sm:p-5 flex flex-col gap-4">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-2 text-xs text-slate-600">
                      <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-amber-100 text-[11px] text-amber-800">
                        🔍
                      </span>
                      <span>Search by destination, vibe, or region</span>
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-slate-500">
                      <span className="inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
                      <span>Live availability with instant confirmation</span>
                    </div>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-[minmax(0,1.8fr)_minmax(0,1.1fr)]">
                    <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3.5 py-2.5">
                      <span className="text-slate-400 text-sm">Search</span>
                      <input
                        type="text"
                        placeholder={'Try Ella hikes or South Coast beaches'}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="flex-1 border-none bg-transparent text-xs sm:text-[13px] text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-0"
                      />
                    </div>
                    <div className="flex gap-2">
                      <button className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-2 text-[11px] font-medium text-slate-700">
                        <span className="text-xs">☀️</span>
                        Travel month
                      </button>
                      <button className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-2 text-[11px] font-medium text-slate-700">
                        <span className="text-xs">👨‍👩‍👧</span>
                        Trip style
                      </button>
                    </div>
                  </div>

                  {/* Quick pills */}
                  <div className="flex flex-wrap gap-2 pt-1">
                    <button
                      className={`rt-tag px-3 py-1 text-[11px] font-medium flex items-center gap-1.5 ${
                        !selectedProvince ? 'rt-tag--active' : ''
                      }`}
                      onClick={handleClearFilters}
                    >
                      <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                      All destinations
                    </button>
                    {provinces.slice(0, 5).map((province) => (
                      <button
                        key={province}
                        className={`rt-tag px-3 py-1 text-[11px] text-slate-600 ${
                          selectedProvince === province ? 'rt-tag--active' : ''
                        }`}
                        onClick={() =>
                          setSelectedProvince((prev) => (prev === province ? '' : province))
                        }
                      >
                        {province}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Mini stats */}
                <div className="flex flex-wrap gap-4 text-xs text-slate-600">
                  <div className="flex items-center gap-2">
                    <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-emerald-100 text-[13px] text-emerald-800">
                      ★
                    </span>
                    <span>
                      4.9 / 5 traveller rating
                      <span className="text-slate-400"> · Sri Lanka DMC</span>
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-orange-100 text-[13px] text-orange-800">
                      ⏱
                    </span>
                    <span>Average trip length: 10–14 nights</span>
                  </div>
                </div>
              </div>

              {/* Highlight / summary panel */}
              <aside className="space-y-4 lg:space-y-5">
                <div className="rt-card p-4 sm:p-5 flex flex-col gap-4 relative overflow-hidden">
                  <div className="absolute -right-10 -bottom-10 h-40 w-40 rounded-full bg-gradient-to-tr from-orange-400/10 via-amber-300/10 to-emerald-400/10" />
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-amber-700">
                        Curated overview
                      </p>
                      <h2 className="mt-1 text-base font-semibold text-slate-900">
                        {(destinations?.length || 18) + '+'} handpicked destinations across Sri Lanka
                      </h2>
                    </div>
                    <span className="inline-flex h-8 w-8 items-center justify-center rounded-2xl bg-slate-900 text-[15px] text-amber-200 shadow-md shadow-slate-900/40">
                      🌏
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Explore tea-covered hills, UNESCO heritage cities, surf-ready beaches and
                    wildlife-rich national parks—each destination paired with stays, experiences and
                    transfer suggestions.
                  </p>
                  <div className="grid grid-cols-3 gap-3 text-[11px] text-slate-600">
                    <div className="space-y-1">
                      <p className="text-[10px] uppercase tracking-[0.16em] text-slate-400">
                        Hill country
                      </p>
                      <p className="text-sm font-semibold text-slate-900">Ella · Nuwara Eliya</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[10px] uppercase tracking-[0.16em] text-slate-400">
                        South &amp; west
                      </p>
                      <p className="text-sm font-semibold text-slate-900">Galle · Mirissa</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[10px] uppercase tracking-[0.16em] text-slate-400">
                        Wildlife
                      </p>
                      <p className="text-sm font-semibold text-slate-900">Yala · Wilpattu</p>
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                    <div className="flex -space-x-2">
                      <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500 text-[11px] text-white ring-2 ring-amber-50">
                        T
                      </span>
                      <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-amber-400 text-[11px] text-slate-900 ring-2 ring-amber-50">
                        S
                      </span>
                      <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-slate-900 text-[11px] text-amber-200 ring-2 ring-amber-50">
                        L
                      </span>
                    </div>
                    <button className="rt-blur-panel inline-flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-medium text-slate-800">
                      Build route from map
                      <span className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-slate-900 text-[10px] text-amber-200">
                        ↗
                      </span>
                    </button>
                  </div>
                </div>
              </aside>
            </div>

            {/* Destinations grid */}
            <section className="space-y-4 mt-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="space-y-1">
                  <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-slate-500">
                    Browse destinations
                  </p>
                  <div className="flex items-center gap-2 text-sm text-slate-700">
                    <span className="font-semibold text-slate-900">Featured regions &amp; stays</span>
                    <span className="inline-flex h-1 w-1 rounded-full bg-slate-300" />
                    <span className="text-xs text-slate-500">
                      Tap into a card to view suggested routes
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-[11px] text-slate-600">
                  <button className="rt-tag px-3 py-1 flex items-center gap-1.5">
                    <span className="text-xs">⇅</span>
                    Sort by popularity
                  </button>
                  <button className="rt-tag px-3 py-1 flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                    Ideal for first-timers
                  </button>
                </div>
              </div>

              {isLoading && (
                <div className="py-10">
                  <LoadingSpinner
                    fullScreen={false}
                    message="Loading destinations..."
                    variant="travel"
                  />
                </div>
              )}

              {!isLoading && error && (
                <div className="text-sm text-red-600">{error}</div>
              )}

              {filteredDestinations.length === 0 && !isLoading && !error && (
                <div className="text-center py-16">
                  <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
                    <MapPin className="h-12 w-12 text-gray-400" />
                  </div>
                  <h3 className="text-2xl font-poppins font-semibold text-gray-900 mb-4">
                    No cities found
                  </h3>
                  <p className="text-gray-600 text-lg mb-6 max-w-md mx-auto">
                    We couldn't find any cities matching your criteria. Try adjusting your search.
                  </p>
                  <Button onClick={handleClearFilters} className="btn-primary">
                    Clear All Filters
                  </Button>
                </div>
              )}

              <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                {filteredDestinations.map((destination) => (
                  <article key={destination.id} className="rt-card overflow-hidden flex flex-col">
                    <div className="relative h-44 sm:h-48 overflow-hidden">
                      <img
                        src={destination.image}
                        alt={destination.name}
                        className="h-full w-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/15 to-transparent" />
                      <div className="absolute left-3 right-3 bottom-3 flex items-end justify-between gap-3">
                        <div>
                          {destination.category && (
                            <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-amber-200">
                              {destination.category}
                            </p>
                          )}
                          <h3 className="text-sm sm:text-base font-semibold text-white">
                            {destination.name}
                          </h3>
                        </div>
                        {destination.popularActivities && destination.popularActivities.length > 0 && (
                          <div className="rt-chip-badge px-2.5 py-1 text-[11px] font-medium flex items-center gap-1.5">
                            <span className="text-[12px]">🌿</span>
                            {destination.popularActivities[0]}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="p-4 sm:p-4.5 flex-1 flex flex-col gap-3">
                      <p className="text-xs text-slate-600 leading-relaxed">
                        {destination.description}
                      </p>
                      <div className="flex flex-wrap items-center justify-between gap-3 text-[11px] text-slate-600">
                        <div className="flex flex-wrap gap-1.5">
                          {destination.duration && (
                            <span className="rt-badge-soft px-2 py-1">{destination.duration}</span>
                          )}
                          {destination.features &&
                            destination.features.slice(0, 2).map((feature) => (
                              <span key={feature} className="rt-badge-soft px-2 py-1">
                                {feature}
                              </span>
                            ))}
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-emerald-100 text-[11px] text-emerald-700">
                            ★
                          </span>
                          <span>{destination.rating ? destination.rating.toFixed(1) : '4.8'}</span>
                        </div>
                      </div>
                      <div className="mt-1 flex items-center justify-between gap-3 text-[11px] text-slate-700">
                        <span>
                          {destination.bestTimeToVisit ||
                            'Great year-round with seasonal highlights'}
                        </span>
                        <button
                          className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-amber-700"
                          onClick={() => handleDestinationExplore(destination.link)}
                        >
                          View details
                          <span className="text-[12px]">↗</span>
                        </button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </section>

            {/* CTA strip */}
            <section className="mt-8 mb-3">
              <div className="rt-card px-4 sm:px-6 py-4 sm:py-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-amber-700">
                    Not sure where to start?
                  </p>
                  <p className="text-sm text-slate-700">
                    Share your dates and travel style—we'll map 2–3 routes that connect these destinations
                    into one balanced Sri Lanka trip.
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                  <button
                    className="inline-flex items-center justify-center gap-1.5 rt-gradient-pill px-4 py-2 text-xs font-semibold text-slate-900 shadow-md shadow-orange-400/40"
                    onClick={() => {
                      window.location.href = '/book-now'
                    }}
                  >
                    Talk to a Sri Lanka specialist
                    <span className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-slate-900/10 text-[10px]">
                      →
                    </span>
                  </button>
                  <button
                    className="inline-flex items-center justify-center gap-1.5 rounded-full rt-tag px-3.5 py-2 text-[11px] font-medium text-slate-700"
                    onClick={() => {
                      window.location.href = '/travel-guide'
                    }}
                  >
                    Download sample itineraries
                  </button>
                </div>
              </div>
            </section>
          </section>
        </main>

        <Footer />
      </div>
    </>
  )
}

export default Destinations