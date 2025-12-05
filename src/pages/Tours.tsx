
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { MapPin, Clock, Users, Star, Calendar, Sparkles, Badge, Heart, ArrowUpRight, Compass, Landmark, TreePine, Camera, GemIcon } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { useTours } from '@/hooks/useTours'
import LoadingSpinner from '@/components/LoadingSpinner'
import BookingModal from '@/components/BookingModal'
import { SEOMetaTags } from '@/components/seo/SEOMetaTags'
import { SEOSchema } from '@/components/seo/SEOSchema'
import AISEOSchema from '@/components/seo/AISEOSchema'
import AIOptimizedFAQ from '@/components/seo/AIOptimizedFAQ'
import { toursByCategory } from '@/components/header/navigation/menuData'
import { cn } from '@/lib/utils'

// AI-Optimized FAQs for Tours page
const toursFAQs = [
  {
    question: "What types of tours does Recharge Travels offer in Sri Lanka?",
    answer: "Recharge Travels offers 8 main tour categories in Sri Lanka: Cultural & Heritage tours (Sigiriya, Kandy, ancient cities), Wildlife Safaris (Yala, Udawalawe, Wilpattu), Hill Country tours (tea estates, Ella, Nuwara Eliya), Beach & Coastal tours, Honeymoon & Romance packages, Ayurveda & Wellness retreats, Culinary & Tea tours, and Photography & Specialty tours. All tours include SLTDA-certified guides, transport, and 24/7 support.",
    category: "Tours"
  },
  {
    question: "How much do Sri Lanka tour packages cost?",
    answer: "Sri Lanka tour packages from Recharge Travels range from $50-200 per person per day depending on the experience level. Budget-friendly day tours start at $50, mid-range multi-day tours average $100-150/day, and luxury private tours range from $200-400/day. Prices include accommodation, transport, guide services, and most entrance fees. Group tours offer additional savings of 15-20%.",
    category: "Pricing"
  },
  {
    question: "What is included in Recharge Travels tour packages?",
    answer: "All Recharge Travels tour packages include: private or semi-private transport with English-speaking driver, SLTDA-certified tour guides, accommodation (3-5 star depending on package), daily breakfast, national park and site entrance fees, airport pickup/dropoff, 24/7 local support, and complimentary bottled water. Lunch and dinner are available as add-ons.",
    category: "Inclusions"
  },
  {
    question: "How do I book a tour with Recharge Travels?",
    answer: "Book your Sri Lanka tour in 3 easy steps: 1) Browse our tours and select your preferred package, 2) Fill out the booking form with your dates and group size, 3) Receive instant confirmation via email. We accept credit cards, PayPal, and bank transfers. A 20% deposit secures your booking, with the balance due 14 days before your tour.",
    category: "Booking"
  },
  {
    question: "What is the best time to visit Sri Lanka for tours?",
    answer: "Sri Lanka offers year-round touring opportunities. The best time depends on your destination: West and South coasts are ideal December-April, East coast is best April-September, and Hill Country is pleasant January-April. Cultural Triangle sites are accessible year-round. Wildlife safaris peak February-July during dry season when animals gather at water holes.",
    category: "Planning"
  },
  {
    question: "Can I customize my Sri Lanka tour itinerary?",
    answer: "Yes, all Recharge Travels tours are fully customizable. Our travel designers will work with you to adjust destinations, duration, accommodation level, activities, and pace. Simply select 'Customize This Tour' on any package or contact us with your preferences. Custom itineraries are typically finalized within 24-48 hours.",
    category: "Customization"
  }
]

const Tours = () => {
  const navigate = useNavigate()
  const [searchTerm, setSearchTerm] = useState('')
  const [priceRange, setPriceRange] = useState('')
  const [duration, setDuration] = useState('')
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false)
  const [selectedTour, setSelectedTour] = useState<any>(null)

  const { filteredTours, filters, setFilters, isLoading } = useTours()

  // Apply local filters
  const locallyFilteredTours = filteredTours.filter(tour => {
    const matchesSearch = tour.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tour.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesPrice = !priceRange ||
      (priceRange === 'under-50' && tour.price_per_person < 50) ||
      (priceRange === '50-100' && tour.price_per_person >= 50 && tour.price_per_person <= 100) ||
      (priceRange === 'over-100' && tour.price_per_person > 100)
    const matchesDuration = !duration ||
      (duration === 'half-day' && tour.duration_days <= 1) ||
      (duration === 'full-day' && tour.duration_days > 1 && tour.duration_days <= 2) ||
      (duration === 'multi-day' && tour.duration_days > 2)
    return matchesSearch && matchesPrice && matchesDuration
  })

  const handleClearFilters = () => {
    setSearchTerm('')
    setPriceRange('')
    setDuration('')
    setFilters({
      destination: '',
      tourType: '',
      difficulty: '',
      duration: '',
      priceRange: [0, 2000]
    })
  }

  const handleBookTour = (tour: any) => {
    setSelectedTour(tour)
    setIsBookingModalOpen(true)
  }

  const tourPillars = [
    {
      title: 'Cultural & Heritage',
      href: '/tours/cultural',
      description: 'Sigiriya, Kandy, Anuradhapura, and UNESCO temples with expert guides.'
    },
    {
      title: 'Wildlife & Parks',
      href: '/tours/wildtours',
      description: 'Yala, Wilpattu, and national parks with safari jeeps and rangers.'
    },
    {
      title: 'Hill Country',
      href: '/tours/hill-country',
      description: 'Tea country train rides, waterfalls, and misty viewpoints in Ella and Nuwara Eliya.'
    },
    {
      title: 'Beach & Coast',
      href: '/tours/beach-tours',
      description: 'South and east coast beaches, sunsets, whale watching, and surfing escapes.'
    },
    {
      title: 'Honeymoon & Romance',
      href: '/tours/honeymoon',
      description: 'Private drivers, boutique stays, and curated experiences for couples.'
    },
    {
      title: 'Ayurveda & Wellness',
      href: '/tours/ayurveda-wellness',
      description: 'Retreats, spas, and mindful journeys with licensed Ayurveda doctors.'
    },
    {
      title: 'Culinary & Tea',
      href: '/tours/culinary',
      description: 'Market walks, cooking classes, and tea tasting across the island.'
    },
    {
      title: 'Photography & Speciality',
      href: '/tours/photography',
      description: 'Guided shoots, birding hides, and golden-hour itineraries.'
    }
  ]

  if (isLoading) {
    return <LoadingSpinner fullScreen message="Loading tours..." />
  }

  return (
    <>
      {/* SEO Meta Tags */}
      <SEOMetaTags
        title="Sri Lanka Tours & Travel Packages - Best Deals 2025"
        description="Discover amazing Sri Lanka tour packages. Cultural tours, wildlife safaris, beach holidays & adventure tours. SLTDA certified. Book online with best prices guaranteed!"
        keywords="Sri Lanka tours, tour packages Sri Lanka, Sri Lanka travel, cultural tours, wildlife safaris, beach holidays, adventure tours, Sri Lanka vacation packages"
        image="https://www.rechargetravels.com/images/tours-hero.jpg"
        url="https://www.rechargetravels.com/tours"
      />

      {/* Schema Markup for Tours */}
      <SEOSchema
        type="LocalBusiness"
        data={{
          name: "Recharge Travels - Sri Lanka Tours",
          description: "Premium tour operator in Sri Lanka offering cultural tours, wildlife safaris, beach holidays and personalized travel experiences since 2014.",
          image: "https://www.rechargetravels.com/images/tours-hero.jpg",
        }}
      />

      {/* AI-Optimized SEO Schema */}
      <AISEOSchema
        pageType="tour"
        title="Sri Lanka Tours & Travel Packages 2025 | Recharge Travels"
        description="Book Sri Lanka tour packages from $50/day. 8 tour categories including cultural heritage, wildlife safaris, beach holidays, and luxury experiences. SLTDA certified, 10+ years experience, 4.9★ rating."
        url="/tours"
        rating={4.9}
        reviewCount={500}
        price="50"
        faqs={toursFAQs}
        breadcrumbs={[
          { name: "Home", url: "/" },
          { name: "Tours", url: "/tours" }
        ]}
      />

      {/* Enhanced Hero Section */}
      <section className="relative bg-gradient-to-br from-emerald-600 via-green-700 to-teal-800 text-white py-20 overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-indigo-600/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-tr from-purple-400/10 to-pink-600/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="mb-6">
            <span className="inline-flex items-center px-4 py-2 bg-white/20 backdrop-blur-sm text-white text-sm font-semibold rounded-full shadow-lg border border-white/30">
              <Sparkles className="w-4 h-4 mr-2 text-amber-300" />
              Recharge Travels & Tours
            </span>
          </div>

          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            <span className="block text-white drop-shadow-lg">Our Sri Lanka Tours</span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto text-green-100">
            Handcrafted experiences by Recharge Travels. From cultural heritage to wildlife safaris, explore Sri Lanka with our expert local guides.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
            <button
              type="button"
              onClick={() => {
                const element = document.getElementById('tours-grid')
                if (element) {
                  element.scrollIntoView({ behavior: 'smooth', block: 'start' })
                }
              }}
              className="inline-flex items-center bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-8 py-4 rounded-xl text-lg font-semibold shadow-xl transform hover:scale-105 transition-all duration-300 cursor-pointer"
            >
              <Calendar className="w-5 h-5 mr-2" />
              Browse Our Tours
            </button>
            <button
              type="button"
              onClick={() => navigate('/tours/tripadvisor')}
              className="inline-flex items-center border-2 border-white text-white hover:bg-white hover:text-green-800 px-8 py-4 rounded-xl text-lg font-semibold backdrop-blur-sm transition-all duration-300 cursor-pointer"
            >
              View on TripAdvisor
              <ArrowUpRight className="w-5 h-5 ml-2" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
              <div className="text-2xl font-bold mb-1">{locallyFilteredTours.length}+</div>
              <div className="text-green-100 text-sm">Our Tours</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
              <div className="text-2xl font-bold mb-1">10+ Years</div>
              <div className="text-green-100 text-sm">Experience</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
              <div className="text-2xl font-bold mb-1">4.9★</div>
              <div className="text-green-100 text-sm">Rating</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
              <div className="text-2xl font-bold mb-1">SLTDA</div>
              <div className="text-green-100 text-sm">Certified</div>
            </div>
          </div>
        </div>
      </section>

      {/* Tour Pillar Links */}
      <section className="bg-white py-12 border-b border-slate-200">
        <div className="container mx-auto px-4">
          <div className="flex flex-col gap-3 text-center mb-8">
            <p className="text-xs font-bold uppercase tracking-[0.3em] text-slate-500">Tour Pillars</p>
            <h2 className="text-3xl font-bold text-slate-900">Explore Tours by Theme</h2>
            <p className="text-slate-600 max-w-3xl mx-auto">
              Jump straight to the tour themes most relevant to your trip and discover their child pages.
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {tourPillars.map(pillar => (
              <Link
                key={pillar.href}
                to={pillar.href}
                className={cn(
                  "group rounded-2xl border border-slate-200 bg-slate-50 hover:border-orange-300 hover:bg-orange-50 transition-all duration-300 p-5 text-left shadow-sm hover:-translate-y-1"
                )}
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-bold text-slate-900 group-hover:text-orange-600">{pillar.title}</h3>
                  <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-orange-500" />
                </div>
                <p className="text-sm text-slate-600">{pillar.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* All Tour Categories Section */}
      <section id="tours-grid" className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Explore All Sri Lanka Tours
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Browse our complete collection of handcrafted tour experiences across Sri Lanka
            </p>
          </div>

          {/* Tour Categories */}
          {Object.entries(toursByCategory).map(([categoryKey, category]) => {
            const categoryIcons: Record<string, React.ReactNode> = {
              adventure: <Compass className="w-6 h-6" />,
              cultural: <Landmark className="w-6 h-6" />,
              nature: <TreePine className="w-6 h-6" />,
              specialty: <Camera className="w-6 h-6" />,
              luxury: <GemIcon className="w-6 h-6" />
            };

            const categoryColors: Record<string, string> = {
              adventure: "from-orange-500 to-red-500",
              cultural: "from-purple-500 to-indigo-500",
              nature: "from-green-500 to-emerald-500",
              specialty: "from-blue-500 to-cyan-500",
              luxury: "from-amber-500 to-yellow-500"
            };

            // Unique images for each tour
            const tourImages: Record<string, string> = {
              // Adventure & Wildlife
              "Wildlife Safaris": "https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=400&h=300&fit=crop",
              "National Parks": "https://images.unsplash.com/photo-1516426122078-c23e76319801?w=400&h=300&fit=crop",
              "Whale Watching": "https://images.unsplash.com/photo-1568430462989-44163eb1752f?w=400&h=300&fit=crop",
              "Water Sports": "https://images.unsplash.com/photo-1530053969600-caed2596d242?w=400&h=300&fit=crop",
              // Cultural & Heritage
              "Cultural Tours": "https://images.unsplash.com/photo-1588598198321-9735fd52dc37?w=400&h=300&fit=crop",
              "Ramayana Trail": "https://images.unsplash.com/photo-1609766857041-ed402ea8069a?w=400&h=300&fit=crop",
              "Pilgrimage Tours": "https://images.unsplash.com/photo-1590123292671-ea32fa193ebe?w=400&h=300&fit=crop",
              "Cooking Classes": "https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=400&h=300&fit=crop",
              // Nature & Scenic
              "Hill Country Tours": "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop",
              "Beach Tours": "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&h=300&fit=crop",
              "Eco-Tourism": "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=300&fit=crop",
              "Tea Trails": "https://images.unsplash.com/photo-1582650625119-3a31f8fa2699?w=400&h=300&fit=crop",
              // Special Interest
              "Photography Tours": "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=400&h=300&fit=crop",
              "Culinary Tours": "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&h=300&fit=crop",
              "Train Journeys": "https://images.unsplash.com/photo-1474487548417-781cb71495f3?w=400&h=300&fit=crop",
              "Hot Air Balloon": "https://images.unsplash.com/photo-1507608616759-54f48f0af0ee?w=400&h=300&fit=crop",
              "TripAdvisor Tours": "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=400&h=300&fit=crop",
              // Luxury & Wellness
              "Luxury Tours": "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=400&h=300&fit=crop",
              "Private Charters": "https://images.unsplash.com/photo-1540946485063-a40da27545f8?w=400&h=300&fit=crop",
              "Ayurveda Wellness": "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=400&h=300&fit=crop",
              "Honeymoon Tours": "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=400&h=300&fit=crop",
              "Private Tours": "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop"
            };

            return (
              <div key={categoryKey} className="mb-12">
                {/* Category Header */}
                <div className="flex items-center gap-3 mb-6">
                  <div className={`p-3 rounded-xl bg-gradient-to-r ${categoryColors[categoryKey]} text-white`}>
                    {categoryIcons[categoryKey]}
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">{category.title}</h3>
                  <div className="flex-1 h-px bg-gradient-to-r from-gray-300 to-transparent ml-4"></div>
                </div>

                {/* Tour Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {category.tours.map((tour) => (
                    <Link key={tour.href} to={tour.href}>
                      <Card className="group h-full overflow-hidden hover:shadow-2xl transition-all duration-300 border-0 shadow-lg hover:scale-[1.02] cursor-pointer">
                        <div className="relative h-44 overflow-hidden">
                          <img
                            src={tourImages[tour.title] || "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop"}
                            alt={tour.title}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>

                          {/* Category Badge */}
                          <div className="absolute top-3 left-3">
                            <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold text-white bg-gradient-to-r ${categoryColors[categoryKey]}`}>
                              {categoryIcons[categoryKey]}
                              {category.title.split(' ')[0]}
                            </span>
                          </div>

                          {/* Tour Title Overlay */}
                          <div className="absolute bottom-3 left-3 right-3">
                            <h4 className="text-lg font-bold text-white drop-shadow-lg">
                              {tour.title}
                            </h4>
                          </div>
                        </div>

                        <CardContent className="p-4">
                          <p className="text-gray-600 text-sm line-clamp-2 mb-3">
                            {tour.description}
                          </p>

                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1 text-sm text-gray-500">
                              <MapPin className="w-4 h-4 text-green-600" />
                              <span>Sri Lanka</span>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-green-600 hover:text-green-700 hover:bg-green-50 p-0"
                            >
                              Explore →
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Filters Section */}
      <section className="bg-white shadow-sm border-b py-6">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Input
                type="text"
                placeholder="Search tours, destinations, experiences..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>
            <div>
              <select
                value={priceRange}
                onChange={(e) => setPriceRange(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="">All Prices</option>
                <option value="under-50">Under $50</option>
                <option value="50-100">$50 - $100</option>
                <option value="over-100">Over $100</option>
              </select>
            </div>
            <div>
              <select
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="">All Durations</option>
                <option value="half-day">Half Day (≤1 day)</option>
                <option value="full-day">Full Day (1-2 days)</option>
                <option value="multi-day">Multi Day (2+ days)</option>
              </select>
            </div>
            <div>
              <Button className="w-full" onClick={handleClearFilters}>
                Clear Filters
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Tours Grid */}
      <section id="filtered-tours" className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {locallyFilteredTours.map((tour) => (
              <Card key={tour.id} className="group overflow-hidden hover:shadow-2xl transition-all duration-300 border-0 shadow-lg hover:scale-[1.02] relative">
                {/* Popular Badge */}
                <div className="absolute top-4 left-4 z-10">
                  <span className="bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                    <Badge className="w-3 h-3 mr-1" />
                    POPULAR
                  </span>
                </div>

                {/* Wishlist Button */}
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute top-4 right-4 z-10 bg-white/80 hover:bg-white/90 rounded-full p-2 shadow-lg"
                >
                  <Heart className="w-4 h-4 text-gray-600 hover:text-red-500 transition-colors" />
                </Button>

                <div className="relative h-56 bg-gradient-to-r from-blue-400 to-purple-600 overflow-hidden">
                  <img
                    src={tour.images?.[0] || "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop"}
                    alt={tour.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>

                  {/* Floating Price Tag */}
                  <div className="absolute bottom-4 left-4">
                    <div className="bg-white rounded-xl px-4 py-2 shadow-lg">
                      <div className="text-2xl font-bold text-green-600">
                        ${tour.price_per_person}
                        <span className="text-sm font-normal text-gray-500">/person</span>
                      </div>
                    </div>
                  </div>
                </div>

                <CardHeader className="pb-3">
                  <CardTitle className="text-xl font-bold text-gray-900 group-hover:text-green-600 transition-colors">
                    {tour.title}
                  </CardTitle>

                  {/* Rating */}
                  {(tour as any).rating && (
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${i < Math.floor((tour as any).rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
                          />
                        ))}
                      </div>
                      <span className="font-semibold text-gray-800">{(tour as any).rating}</span>
                      {(tour as any).reviews && (
                        <span className="text-gray-500 text-sm">({(tour as any).reviews} reviews)</span>
                      )}
                    </div>
                  )}

                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <div className="flex items-center space-x-1 bg-gray-100 px-2 py-1 rounded-lg">
                      <Clock className="h-4 w-4 text-blue-600" />
                      <span className="font-medium">{tour.duration_days} {tour.duration_days === 1 ? 'day' : 'days'}</span>
                    </div>
                    <div className="flex items-center space-x-1 bg-gray-100 px-2 py-1 rounded-lg">
                      <Users className="h-4 w-4 text-purple-600" />
                      <span className="font-medium">Max {tour.max_group_size || 10}</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-1 text-sm text-gray-600">
                    <MapPin className="h-4 w-4 text-green-600" />
                    <span className="font-medium">{tour.destination}</span>
                  </div>
                </CardHeader>

                <CardContent className="pt-0">
                  <p className="text-gray-600 mb-4 line-clamp-3">{tour.description}</p>

                  <div className="mb-6">
                    <span className="inline-block bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 text-xs font-semibold px-3 py-1 rounded-full mr-2 mb-2">
                      {tour.category}
                    </span>
                    <span className="inline-block bg-gradient-to-r from-green-100 to-green-200 text-green-800 text-xs font-semibold px-3 py-1 rounded-full">
                      {tour.difficulty_level}
                    </span>
                  </div>

                  {/* Enhanced Action Buttons */}
                  <div className="flex flex-col gap-3">
                    <Button
                      onClick={() => handleBookTour(tour)}
                      className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold py-3 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                    >
                      <Calendar className="w-4 h-4 mr-2" />
                      Book This Tour
                    </Button>
                    <div className="flex gap-2">
                      <Link to={`/tours/${tour.id}`} className="flex-1">
                        <Button variant="outline" className="w-full border-2 border-gray-300 hover:border-green-500 hover:text-green-600 font-medium py-2 rounded-xl transition-all duration-300">
                          View Details
                        </Button>
                      </Link>
                      <Button
                        variant="outline"
                        className="px-4 border-2 border-gray-300 hover:border-blue-500 hover:text-blue-600 rounded-xl transition-all duration-300"
                      >
                        <Star className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Trust Indicators */}
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <div className="flex items-center space-x-1">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                        <span>Free Cancellation</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse delay-300"></div>
                        <span>Instant Confirmation</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {locallyFilteredTours.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg">No tours found matching your criteria.</p>
              <Button
                className="mt-4"
                onClick={handleClearFilters}
              >
                Clear All Filters
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* TripAdvisor Tours Section */}
      <section className="py-16 bg-gradient-to-br from-emerald-900 via-emerald-800 to-teal-900">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
              <img
                src="https://static.tacdn.com/img2/brand_refresh/Tripadvisor_logoset_solid_green.svg"
                alt="TripAdvisor"
                className="h-5 w-5"
              />
              <span className="text-white font-semibold text-sm">Verified Reviews</span>
            </div>

            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Book on TripAdvisor
            </h2>
            <p className="text-lg text-emerald-100 mb-8 max-w-2xl mx-auto">
              See all our tours with verified reviews, real ratings, and secure booking directly on TripAdvisor. USD pricing available.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/tours/tripadvisor">
                <Button
                  size="lg"
                  className="bg-white text-emerald-900 hover:bg-emerald-50 px-8 py-4 rounded-xl text-lg font-semibold shadow-xl"
                >
                  <img
                    src="https://static.tacdn.com/img2/brand_refresh/Tripadvisor_logoset_solid_green.svg"
                    alt=""
                    className="h-5 w-5 mr-2"
                  />
                  View TripAdvisor Tours
                  <ArrowUpRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <a
                href="https://www.tripadvisor.com/Attraction_Review-g293962-d10049587-Reviews-Recharge_Travels_And_Tours-Colombo_Western_Province.html"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button
                  variant="outline"
                  size="lg"
                  className="border-2 border-white text-white hover:bg-white/10 px-8 py-4 rounded-xl text-lg font-semibold"
                >
                  Visit Our TripAdvisor Profile
                  <ArrowUpRight className="w-5 h-5 ml-2" />
                </Button>
              </a>
            </div>

            <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                <div className="text-2xl font-bold text-white">23+</div>
                <div className="text-sm text-emerald-200">Tours Listed</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                <div className="text-2xl font-bold text-white">4.7★</div>
                <div className="text-sm text-emerald-200">Average Rating</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                <div className="text-2xl font-bold text-white">USD</div>
                <div className="text-sm text-emerald-200">Currency</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                <div className="text-2xl font-bold text-white">Secure</div>
                <div className="text-sm text-emerald-200">Booking</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* AI-Optimized FAQ Section */}
      <AIOptimizedFAQ
        faqs={toursFAQs}
        title="Frequently Asked Questions About Sri Lanka Tours"
        description="Get answers to common questions about booking tours, pricing, and what to expect on your Sri Lanka adventure."
        pageUrl="/tours"
        showCategories={true}
      />

      {/* Booking Modal */}
      <BookingModal
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
        type="tour"
        itemTitle={selectedTour?.title}
        itemId={selectedTour?.id}
        price={selectedTour?.price_per_person}
      />
    </>
  )
}

export default Tours
