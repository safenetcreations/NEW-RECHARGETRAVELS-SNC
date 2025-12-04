
import { useEffect, useMemo, useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Building2, 
  Clock, 
  Users, 
  Star, 
  Calendar, 
  ArrowRight, 
  MapPin, 
  Crown, 
  Camera, 
  Heart,
  Flower,
  Mountain,
  TreePine,
  Waves,
  Globe,
  Languages,
  DollarSign,
  Shield,
  Gem,
  Sparkles,
  Award,
  Briefcase,
  Headphones,
  Phone,
  Mail,
  Download,
  Scroll,
  Church,
  Compass,
  BookOpen,
  Plus,
  Minus,
  Calculator,
  Route,
  Train,
  ChefHat,
  Palette,
  Music,
  Home
} from 'lucide-react'
import { toast } from 'sonner'
import SEOHead from '@/components/cms/SEOHead'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import CircuitBuilder from '@/components/cultural/CircuitBuilder'
import BookingEngine from '@/components/cultural/BookingEngine'
import InteractiveMap from '@/components/cultural/InteractiveMap'
import { Link } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { culturalToursService, CulturalTour } from '@/services/culturalToursService'

const fallbackTours: CulturalTour[] = [
  {
    id: 'classic-triangle',
    title: 'Classic Cultural Triangle',
    description: 'Sigiriya, Kandy, and Dambulla with premium guides and heritage stays',
    location: 'Sigiriya • Kandy • Dambulla',
    duration: '7 Days',
    price: 135,
    image: 'https://images.unsplash.com/photo-1494891848038-7bd202a2afeb?w=900',
    rating: 4.9,
    reviews: 124,
    category: 'ancient-city',
    difficulty: 'Easy',
    maxGroupSize: 8,
    highlights: ['Lion Rock sunrise climb', 'Temple of the Tooth puja', 'Dambulla cave temples'],
    included: ['Private vehicle & driver', 'Premium entrance fees', 'Daily breakfast'],
    pickupOptions: [
      { id: 'colombo', label: 'Colombo Pickup', time: '6:30 AM', additionalCost: 0 },
      { id: 'airport', label: 'BIA Airport', time: '6:00 AM', additionalCost: 25 }
    ]
  },
  {
    id: 'unesco-eight-site',
    title: 'UNESCO Eight-Site Circuit',
    description: 'All UNESCO cultural sites plus heritage tea highlands and Galle Fort',
    location: 'Islandwide',
    duration: '10 Days',
    price: 165,
    image: 'https://images.unsplash.com/photo-1582378546012-2ac65a47a76b?w=900',
    rating: 4.8,
    reviews: 96,
    category: 'multi-day',
    difficulty: 'Moderate',
    maxGroupSize: 10,
    highlights: ['Sigiriya & Polonnaruwa', 'Anuradhapura sacred sites', 'Galle Fort sunset walk'],
    included: ['Private chauffeur guide', 'Handpicked heritage hotels', 'Daily breakfast & two dinners'],
    pickupOptions: [
      { id: 'colombo-hq', label: 'Colombo City Hotels', time: '7:00 AM', additionalCost: 0 },
      { id: 'kandy', label: 'Kandy Pickup', time: '9:00 AM', additionalCost: 0 }
    ]
  },
  {
    id: 'heritage-coast-highlands',
    title: 'Heritage Coast & Highlands',
    description: 'Galle Fort, hill country rail journey, and Kandyan temple evenings',
    location: 'Galle • Ella • Kandy',
    duration: '8 Days',
    price: 145,
    image: 'https://images.unsplash.com/photo-1566552273-6cff54c8d4c7?w=900',
    rating: 4.7,
    reviews: 78,
    category: 'heritage-stay',
    difficulty: 'Easy',
    maxGroupSize: 12,
    highlights: ['Galle lighthouse sunset', 'Ella train ride', 'Temple of the Tooth evening puja'],
    included: ['Boutique stays', 'Rail tickets', 'Local cultural host'],
    pickupOptions: [
      { id: 'galle', label: 'Galle Fort Hotels', time: '8:00 AM', additionalCost: 0 },
      { id: 'mirissa', label: 'Mirissa/Southern Beaches', time: '7:30 AM', additionalCost: 15 }
    ]
  }
]

const CulturalTours = () => {
  const [selectedCurrency, setSelectedCurrency] = useState('USD')
  const [selectedLanguage, setSelectedLanguage] = useState('EN')
  const [selectedCircuit, setSelectedCircuit] = useState<string[]>([])
  const [selectedDuration, setSelectedDuration] = useState('7')
  const { user } = useAuth()

  const bookingSectionRef = useRef<HTMLDivElement | null>(null)
  const heroBackground = useMemo(
    () =>
      "url(https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=2100&q=80&sat=-15)",
    []
  )
  const [tours, setTours] = useState<CulturalTour[]>(fallbackTours)
  const [loadingTours, setLoadingTours] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState<string>('all')
  const [bookingForm, setBookingForm] = useState({
    tourId: fallbackTours[0]?.id || '',
    date: '',
    adults: 2,
    children: 0,
    pickupOption: fallbackTours[0]?.pickupOptions?.[0]?.id || '',
    pickupLocation: '',
    contactName: user?.displayName || '',
    contactEmail: user?.email || '',
    contactPhone: '',
    specialRequests: ''
  })

  const relatedTours = [
    { title: 'Wildlife & Parks', href: '/tours/wildtours' },
    { title: 'Hill Country', href: '/tours/hill-country' },
    { title: 'Beach & Coast', href: '/tours/beach-tours' }
  ]

  // Classic 8-Site Circuit data
  const circuitSites = [
    {
      id: 'sigiriya',
      name: 'Sigiriya Rock Fortress',
      description: 'Ancient rock citadel with 1,500-year-old frescoes',
      image: 'https://images.unsplash.com/photo-1494891848038-7bd202a2afeb?w=600',
      duration: '4 hours',
      highlights: ['Lion Rock climb', 'Ancient frescoes', 'Mirror Wall graffiti'],
      coordinates: { lat: 7.9569, lng: 80.7603 }
    },
    {
      id: 'kandy-temple',
      name: 'Temple of the Tooth Relic, Kandy',
      description: 'Sacred Buddhist temple housing the tooth relic of Buddha',
      image: 'https://images.unsplash.com/photo-1582378546012-2ac65a47a76b?w=600',
      duration: '3 hours',
      highlights: ['Sacred tooth relic', 'Evening ceremonies', 'Royal palace'],
      coordinates: { lat: 7.2936, lng: 80.6350 }
    },
    {
      id: 'dambulla',
      name: 'Dambulla Cave Temple',
      description: '2,000-year-old cave temple with Buddhist art',
      image: 'https://images.unsplash.com/photo-1578761499019-d31ad8bba9b7?w=600',
      duration: '3 hours',
      highlights: ['Cave frescoes', 'Buddha statues', 'Golden temple'],
      coordinates: { lat: 7.8567, lng: 80.6509 }
    },
    {
      id: 'galle-fort',
      name: 'Galle Fort',
      description: 'Dutch colonial fortification from 17th century',
      image: 'https://images.unsplash.com/photo-1566552273-6cff54c8d4c7?w=600',
      duration: '4 hours',
      highlights: ['Dutch architecture', 'Lighthouse', 'Historic ramparts'],
      coordinates: { lat: 6.0329, lng: 80.2168 }
    },
    {
      id: 'anuradhapura',
      name: 'Ancient City of Anuradhapura',
      description: 'First capital of Sri Lanka with sacred Bodhi Tree',
      image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600',
      duration: '6 hours',
      highlights: ['Sacred Bodhi Tree', 'Ancient stupas', 'Monastery ruins'],
      coordinates: { lat: 8.3114, lng: 80.4037 }
    },
    {
      id: 'polonnaruwa',
      name: 'Ancient City of Polonnaruwa',
      description: 'Medieval capital with royal palace ruins',
      image: 'https://images.unsplash.com/photo-1466442929976-97f336a657be?w=600',
      duration: '5 hours',
      highlights: ['Royal palace', 'Gal Vihara statues', 'Parakrama Samudraya'],
      coordinates: { lat: 7.9403, lng: 81.0188 }
    },
    {
      id: 'sinharaja',
      name: 'Sinharaja Forest Reserve',
      description: 'UNESCO biosphere reserve with endemic species',
      image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=600',
      duration: '8 hours',
      highlights: ['Endemic birds', 'Canopy walk', 'Medicinal plants'],
      coordinates: { lat: 6.4047, lng: 80.4206 }
    },
    {
      id: 'central-highlands',
      name: 'Central Highlands',
      description: 'Tea plantations and scenic mountain railways',
      image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=600',
      duration: '2 days',
      highlights: ['Tea factories', 'Kandy-Ella train', 'Hill country views'],
      coordinates: { lat: 6.9497, lng: 80.7891 }
    }
  ]

  const signatureActivities = [
    {
      id: 'kandyan-dance',
      title: 'Kandyan Dance & Rituals',
      description: 'Experience authentic traditional performances with master dancers',
      image: 'https://images.unsplash.com/photo-1524863479829-916d8e77f114?w=600',
      duration: '2 hours',
      inclusions: ['Traditional costumes', 'Fire dance', 'Drum ensemble', 'Cultural guide'],
      price: { USD: 45, EUR: 40, GBP: 35 }
    },
    {
      id: 'culinary-village',
      title: 'Culinary & Village Immersion',
      description: 'Cook traditional Sri Lankan dishes with village families',
      image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600',
      duration: '4 hours',
      inclusions: ['Cooking class', 'Family meal', 'Spice garden tour', 'Recipe book'],
      price: { USD: 65, EUR: 58, GBP: 50 }
    },
    {
      id: 'artisan-workshops',
      title: 'Artisan Workshops',
      description: 'Learn traditional crafts from master artisans',
      image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600',
      duration: '3 hours',
      inclusions: ['Mask carving', 'Batik printing', 'Wood crafts', 'Take-home items'],
      price: { USD: 55, EUR: 48, GBP: 42 }
    },
    {
      id: 'tea-railway',
      title: 'Tea Plantation & Rail Journey',
      description: 'Scenic train ride through tea country with factory visits',
      image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=600',
      duration: '8 hours',
      inclusions: ['Train tickets', 'Tea factory tour', 'Tasting session', 'Lunch'],
      price: { USD: 85, EUR: 75, GBP: 65 }
    }
  ]

  const itineraryOptions = [
    {
      duration: '7',
      title: '7-Day Classic Triangle',
      description: 'Essential cultural sites with comfortable pacing',
      highlights: ['Kandy & Temple', 'Sigiriya Rock', 'Dambulla Caves', 'Polonnaruwa'],
      dailyRate: { USD: 120, EUR: 108, GBP: 95 },
      pdf: '/itineraries/7-day-cultural-circuit.pdf'
    },
    {
      duration: '10',
      title: '10-Day Heritage Explorer',
      description: 'Comprehensive tour including Anuradhapura and Galle',
      highlights: ['All 8 circuit sites', 'Village homestay', 'Artisan workshops', 'Tea country'],
      dailyRate: { USD: 140, EUR: 126, GBP: 110 },
      pdf: '/itineraries/10-day-heritage-explorer.pdf'
    },
    {
      duration: '14',
      title: '14-Day Cultural Immersion',
      description: 'Deep cultural experience with extended activities',
      highlights: ['Complete circuit', 'Festival participation', 'Monastery stays', 'Cooking classes'],
      dailyRate: { USD: 160, EUR: 144, GBP: 125 },
      pdf: '/itineraries/14-day-cultural-immersion.pdf'
    }
  ]

  const currencies = ['USD', 'EUR', 'GBP']
  const languages = [
    { code: 'EN', name: 'English' },
    { code: 'DE', name: 'Deutsch' },
    { code: 'FR', name: 'Français' },
    { code: 'ES', name: 'Español' }
  ]

  useEffect(() => {
    const loadTours = async () => {
      setLoadingTours(true)
      try {
        const liveTours = await culturalToursService.getActiveTours()
        const data = liveTours.length ? liveTours : fallbackTours
        setTours(data)
        setBookingForm(prev => ({
          ...prev,
          tourId: data[0]?.id || '',
          pickupOption: data[0]?.pickupOptions?.[0]?.id || ''
        }))
      } catch (error) {
        console.error('Error loading cultural tours:', error)
      } finally {
        setLoadingTours(false)
      }
    }

    loadTours()
  }, [])

  useEffect(() => {
    if (user) {
      setBookingForm(prev => ({
        ...prev,
        contactName: prev.contactName || user.displayName || '',
        contactEmail: prev.contactEmail || user.email || ''
      }))
    }
  }, [user])

  const scrollToBooking = () => {
    bookingSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const selectedTour = useMemo(
    () => tours.find(tour => tour.id === bookingForm.tourId) || tours[0],
    [bookingForm.tourId, tours]
  )

  const pickupOption = useMemo(
    () => selectedTour?.pickupOptions?.find(opt => opt.id === bookingForm.pickupOption),
    [selectedTour, bookingForm.pickupOption]
  )

  const currencyMultiplier = useMemo(() => {
    if (selectedCurrency === 'EUR') return 0.92
    if (selectedCurrency === 'GBP') return 0.79
    return 1
  }, [selectedCurrency])

  const basePrice = selectedTour?.price || 0
  const currencySymbol = selectedCurrency === 'USD' ? '$' : selectedCurrency === 'EUR' ? '€' : '£'
  const totalPrice = useMemo(() => {
    const guests = bookingForm.adults + bookingForm.children
    const pickupTotal = (pickupOption?.additionalCost || 0) * guests
    const childrenTotal = basePrice * 0.5 * bookingForm.children
    return Math.round((basePrice * bookingForm.adults + childrenTotal + pickupTotal) * currencyMultiplier)
  }, [basePrice, bookingForm.adults, bookingForm.children, currencyMultiplier, pickupOption])

  const filteredTours = useMemo(() => {
    return tours.filter(tour => {
      const titleText = tour.title?.toLowerCase() || ''
      const locationText = tour.location?.toLowerCase() || ''
      const descriptionText = tour.description?.toLowerCase() || ''
      const matchesSearch =
        titleText.includes(searchTerm.toLowerCase()) ||
        locationText.includes(searchTerm.toLowerCase()) ||
        descriptionText.includes(searchTerm.toLowerCase())

      const matchesCategory = categoryFilter === 'all' || tour.category === categoryFilter
      return matchesSearch && matchesCategory
    })
  }, [tours, searchTerm, categoryFilter])

  const handleBookingChange = (field: string, value: any) => {
    setBookingForm(prev => ({ ...prev, [field]: value }))
  }

  const handleSelectTour = (tourId: string) => {
    const tour = tours.find(t => t.id === tourId)
    setBookingForm(prev => ({
      ...prev,
      tourId,
      pickupOption: tour?.pickupOptions?.[0]?.id || ''
    }))
    scrollToBooking()
  }

  const handleSubmitBooking = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!bookingForm.date || !bookingForm.contactName || !bookingForm.contactEmail) {
      toast.error('Please add your date, name, and email to book.')
      return
    }

    if (!selectedTour) {
      toast.error('Please select a tour to book.')
      return
    }

    try {
      await culturalToursService.createBooking({
        tourId: selectedTour.id,
        tourTitle: selectedTour.title,
        date: bookingForm.date,
        adults: bookingForm.adults,
        children: bookingForm.children,
        pickupOption: pickupOption?.label || bookingForm.pickupOption,
        pickupAddress: bookingForm.pickupLocation,
        specialRequests: bookingForm.specialRequests,
        contactName: bookingForm.contactName,
        contactEmail: bookingForm.contactEmail,
        contactPhone: bookingForm.contactPhone,
        totalPrice: totalPrice,
        currency: selectedCurrency,
        userId: user?.uid || 'guest'
      })

      toast.success('Booking received! Our team will confirm within 24 hours.')
      setBookingForm(prev => ({
        ...prev,
        date: '',
        specialRequests: '',
        pickupOption: selectedTour.pickupOptions?.[0]?.id || '',
        pickupLocation: '',
        contactName: prev.contactName,
        contactEmail: prev.contactEmail,
        contactPhone: ''
      }))
    } catch (error) {
      console.error('Booking error:', error)
      toast.error('Unable to save your booking. Please try again.')
    }
  }

  const handleAddToCircuit = (siteId: string) => {
    setSelectedCircuit(prev => 
      prev.includes(siteId) 
        ? prev.filter(id => id !== siteId)
        : [...prev, siteId]
    )
  }

  const calculatePrice = () => {
    const selectedItinerary = itineraryOptions.find(opt => opt.duration === selectedDuration)
    if (!selectedItinerary) return 0
    return selectedItinerary.dailyRate[selectedCurrency] * parseInt(selectedDuration)
  }

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "TouristTrip",
    "name": "Cultural & Heritage Tours Sri Lanka – UNESCO Circuit & Classic Itineraries",
    "description": "Explore Sri Lanka's 2,500-year cultural legacy through UNESCO World Heritage sites. Cultural Triangle tours from Sigiriya to Kandy temple circuit with luxury heritage experiences.",
    "provider": {
      "@type": "Organization",
      "name": "Recharge Travels",
      "url": "https://rechargetravels.lk"
    },
    "touristType": "Cultural Heritage Enthusiasts",
    "itinerary": {
      "@type": "ItemList",
      "itemListElement": circuitSites.map((site, index) => ({
        "@type": "TouristAttraction",
        "position": index + 1,
        "name": site.name,
        "description": site.description
      }))
    },
    "offers": {
      "@type": "Offer",
      "priceCurrency": "USD",
      "price": "120",
      "availability": "https://schema.org/InStock",
      "validFrom": new Date().toISOString(),
      "validThrough": new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString()
    }
  }

  return (
    <>
      <SEOHead
        title="Cultural & Heritage Tours Sri Lanka – UNESCO Circuit & Classic Itineraries | Recharge Travels"
        description="Explore Sri Lanka's 2,500-year cultural legacy through UNESCO World Heritage sites. Cultural Triangle tours from Sigiriya to Kandy temple circuit with luxury heritage experiences and classic itineraries."
        structuredData={structuredData}
        canonicalUrl={`${window.location.origin}/tours/cultural`}
      />

      <Header />

      {/* Breadcrumb and related links */}
      <div className="bg-slate-50 border-b border-slate-200">
        <div className="container mx-auto px-4 py-4 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div className="text-sm text-slate-600 flex items-center gap-2">
            <Link to="/tours" className="text-emerald-700 font-semibold hover:text-emerald-800">Tours</Link>
            <span aria-hidden>›</span>
            <span className="text-slate-900 font-semibold">Cultural & Heritage</span>
          </div>
          <div className="flex flex-wrap gap-3 text-xs">
            {relatedTours.map(link => (
              <Link
                key={link.href}
                to={link.href}
                className="rounded-full border border-slate-200 bg-white px-3 py-1 font-semibold text-slate-700 hover:border-emerald-400 hover:text-emerald-700 transition"
              >
                Related: {link.title}
              </Link>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes dust-mote {
          0% { transform: translate(0, 100vh) scale(0); opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { transform: translate(0, -100vh) scale(1); opacity: 0; }
        }
        @keyframes slow-pan {
          0% { transform: scale(1.1) translateX(0); }
          100% { transform: scale(1.2) translateX(-20px); }
        }
        @keyframes heritage-glow {
          0%, 100% { box-shadow: 0 0 30px rgba(207, 181, 59, 0.3); }
          50% { box-shadow: 0 0 50px rgba(207, 181, 59, 0.6); }
        }
        .dust-mote {
          position: absolute;
          width: 4px;
          height: 4px;
          background: rgba(207, 181, 59, 0.6);
          border-radius: 50%;
          animation: dust-mote 15s linear infinite;
        }
        .heritage-video {
          animation: slow-pan 30s ease-in-out infinite alternate;
        }
        .glow-effect {
          animation: heritage-glow 4s ease-in-out infinite;
        }
        .dust-mote, .heritage-video {
          pointer-events: none;
        }
      `}</style>

      {/* Cinematic Hero Section */}
      <section className="relative isolate min-h-[90vh] flex items-center overflow-hidden text-white bg-slate-950">
        <div className="absolute inset-0 pointer-events-none -z-10">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: heroBackground, transform: 'scale(1.05)' }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/70 via-slate-900/45 to-amber-900/45" />
          <div className="absolute inset-y-0 left-0 w-2/5 bg-gradient-to-r from-black/55 via-black/25 to-transparent" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_20%,rgba(251,191,36,0.12),transparent_30%),radial-gradient(circle_at_82%_12%,rgba(249,115,22,0.16),transparent_26%)]" />
        </div>

        <div className="relative container mx-auto px-6 md:px-12 lg:px-16 grid grid-cols-1 lg:grid-cols-[1.2fr_0.9fr] gap-10 items-center z-20 pointer-events-auto">
          <div className="space-y-8 text-white">
            <div className="flex flex-wrap items-center gap-3">
              <Badge className="bg-amber-500 text-slate-900 font-semibold px-3 py-1 rounded-full">
                UNESCO Heritage Circuit
              </Badge>
              <Badge variant="outline" className="border-white/30 text-white">
                7–14 Day Journeys
              </Badge>
              <Badge variant="outline" className="border-white/30 text-white">
                Private Guides
              </Badge>
            </div>

            <div className="space-y-4">
              <p className="text-sm uppercase tracking-[0.25em] text-amber-200/90">
                Cultural & Heritage | Sri Lanka
              </p>
              <h1 className="font-cinzel text-5xl md:text-6xl xl:text-7xl leading-tight drop-shadow-2xl">
                Walk the Ancient Kingdoms
                <span className="block text-amber-300 font-playfair glow-effect">
                  Sigiriya • Anuradhapura • Kandy • Galle
                </span>
              </h1>
              <p className="text-xl md:text-2xl text-amber-50/90 max-w-3xl leading-relaxed font-montserrat">
                Tailored cultural circuits with heritage stays, private archaeologist guides, and seamless transfers across the Cultural Triangle.
              </p>
            </div>

            <div className="flex flex-wrap gap-6">
              <div className="flex items-center gap-3">
                <Shield className="w-6 h-6 text-amber-300" />
                <div>
                  <p className="text-sm text-white/70">Govt. Licensed</p>
                  <p className="text-lg font-semibold">Trusted Cultural Hosts</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Crown className="w-6 h-6 text-amber-300" />
                <div>
                  <p className="text-sm text-white/70">Premium Access</p>
                  <p className="text-lg font-semibold">Sunrise & After‑hours</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="w-6 h-6 text-amber-300" />
                <div>
                  <p className="text-sm text-white/70">Concierge</p>
                  <p className="text-lg font-semibold">24/7 Cultural Desk</p>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                onClick={() => document.getElementById('circuit-overview')?.scrollIntoView({ behavior: 'smooth' })}
                size="lg"
                className="px-10 py-5 text-lg rounded-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 transition-all duration-400 text-white font-semibold shadow-2xl border-2 border-amber-300/40 font-montserrat"
              >
                <Church className="w-5 h-5 mr-2" />
                View Cultural Circuit
              </Button>
              <Button
                onClick={scrollToBooking}
                size="lg"
                variant="outline"
                className="px-10 py-5 text-lg rounded-full border-2 border-amber-200/60 text-white bg-white/10 backdrop-blur-sm hover:bg-white/15 font-semibold shadow-xl font-montserrat"
              >
                <Calendar className="w-5 h-5 mr-2" />
                Book a Cultural Tour
              </Button>
            </div>

            <div className="flex flex-wrap items-center gap-4 text-sm text-white/80">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                Small groups & private parties
              </div>
              <div className="flex items-center gap-2">
                <Train className="w-4 h-4" />
                Scenic rail + chauffeur transfers
              </div>
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4" />
                Safety-first, fully insured
              </div>
            </div>
          </div>

          <Card className="bg-white/95 backdrop-blur border-amber-100 shadow-2xl">
            <CardHeader className="pb-4">
              <CardTitle className="text-2xl font-cinzel text-slate-900 flex items-center gap-2">
                Plan Your Circuit
                <Badge className="bg-amber-100 text-amber-700 border-amber-200">Live Pricing</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-600">Language</label>
                  <select
                    value={selectedLanguage}
                    onChange={(e) => setSelectedLanguage(e.target.value)}
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm"
                  >
                    {languages.map(lang => (
                      <option key={lang.code} value={lang.code}>
                        {lang.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-600">Currency</label>
                  <select
                    value={selectedCurrency}
                    onChange={(e) => setSelectedCurrency(e.target.value)}
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm"
                  >
                    {currencies.map(curr => (
                      <option key={curr} value={curr}>
                        {curr}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-amber-50 border border-amber-100">
                <div className="flex items-center justify-between text-sm text-slate-700">
                  <span>Classic Triangle (7 days)</span>
                  <span className="font-semibold text-amber-700">{currencySymbol}{Math.round(120 * currencyMultiplier)}/day</span>
                </div>
                <div className="flex items-center justify-between text-sm text-slate-700 mt-2">
                  <span>Heritage Explorer (10 days)</span>
                  <span className="font-semibold text-amber-700">{currencySymbol}{Math.round(140 * currencyMultiplier)}/day</span>
                </div>
                <div className="mt-3 text-xs text-slate-500">
                  All packages include private vehicle, expert cultural guide, entrance fees, and heritage stays.
                </div>
              </div>

              <Button
                className="w-full bg-amber-500 hover:bg-amber-600 text-white font-semibold py-3"
                onClick={scrollToBooking}
              >
                Start Booking
              </Button>
              <p className="text-xs text-slate-500 text-center">
                Confirmed by our cultural concierge within 24 hours.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Admin Managed Tours + Booking Form */}
      <section ref={bookingSectionRef} id="cultural-booking" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-10 items-start">
            <div className="flex-1 space-y-6 w-full">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <div className="text-sm font-semibold text-amber-600 uppercase tracking-[0.2em] mb-2">
                    Live From Admin Panel
                  </div>
                  <h2 className="text-4xl font-cinzel text-gray-900">Book Cultural Heritage Tours</h2>
                  <p className="text-gray-600 font-montserrat mt-2">
                    Tours and bookings stay in sync with the Cultural Admin Panel. New tours added in admin show up here automatically.
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                  <input
                    type="text"
                    placeholder="Search tours or locations..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full sm:w-64 border border-slate-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-sm"
                  />
                  <select
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    className="w-full sm:w-48 border border-slate-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-sm bg-white"
                  >
                    <option value="all">All categories</option>
                    <option value="temple-tour">Temples</option>
                    <option value="heritage-stay">Heritage stays</option>
                    <option value="ancient-city">Ancient cities</option>
                    <option value="pilgrimage">Pilgrimage</option>
                    <option value="multi-day">Multi-day circuits</option>
                  </select>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-5">
                {loadingTours && (
                  <>
                    {[0, 1].map((idx) => (
                      <div key={idx} className="border border-slate-200 rounded-xl p-5 animate-pulse bg-slate-50">
                        <div className="h-40 bg-slate-200 rounded-lg mb-4" />
                        <div className="h-4 bg-slate-200 rounded w-2/3 mb-2" />
                        <div className="h-4 bg-slate-100 rounded w-1/2 mb-4" />
                        <div className="h-3 bg-slate-100 rounded w-full mb-2" />
                        <div className="h-3 bg-slate-100 rounded w-5/6" />
                      </div>
                    ))}
                  </>
                )}

                {!loadingTours && filteredTours.map(tour => (
                  <Card key={tour.id} className="overflow-hidden hover:shadow-xl transition-all duration-300 border-slate-100">
                    <div className="relative">
                      <img
                        src={tour.image}
                        alt={tour.title}
                        className="w-full h-48 object-cover"
                      />
                      {tour.category && (
                        <Badge className="absolute top-4 left-4 bg-amber-500 text-white">
                          {tour.category.replace('-', ' ')}
                        </Badge>
                      )}
                      {tour.featured && (
                        <Badge className="absolute top-4 right-4 bg-emerald-600 text-white">
                          Featured
                        </Badge>
                      )}
                    </div>
                    <CardContent className="p-5 space-y-3">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <h3 className="text-xl font-cinzel text-gray-900">{tour.title}</h3>
                          <div className="text-sm text-gray-600 flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-amber-500" />
                            {tour.location}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-amber-600">
                            {currencySymbol}{Math.round((tour.price || 0) * currencyMultiplier)}
                          </div>
                          <div className="text-xs text-gray-500">per person</div>
                        </div>
                      </div>

                      <p className="text-sm text-gray-600 font-montserrat leading-relaxed">
                        {tour.description}
                      </p>

                      <div className="flex flex-wrap gap-2">
                        {tour.highlights?.slice(0, 3).map((highlight, idx) => (
                          <Badge key={idx} variant="outline" className="border-amber-100 text-amber-700 bg-amber-50">
                            <Sparkles className="w-3 h-3 mr-1 text-amber-500" />
                            {highlight}
                          </Badge>
                        ))}
                      </div>

                      <div className="flex items-center justify-between pt-2 text-sm text-gray-600">
                        <span className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-amber-500" />
                          {tour.duration || 'Flexible'}
                        </span>
                        <span className="flex items-center gap-2">
                          <Star className="w-4 h-4 text-yellow-500" />
                          {tour.rating?.toFixed(1) || '4.8'} ({tour.reviews || 12}+)
                        </span>
                      </div>

                      <div className="pt-2 flex gap-2">
                        <Button
                          variant="outline"
                          className="flex-1"
                          onClick={() => document.getElementById('circuit-overview')?.scrollIntoView({ behavior: 'smooth' })}
                        >
                          View circuit
                        </Button>
                        <Button
                          className="flex-1 bg-amber-500 hover:bg-amber-600 text-white"
                          onClick={() => handleSelectTour(tour.id)}
                        >
                          Book this tour
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                {!loadingTours && filteredTours.length === 0 && (
                  <div className="col-span-2 text-center border border-dashed border-amber-200 rounded-xl p-6 text-gray-600 bg-amber-50/50">
                    No tours match your filters yet. Clear search to view all cultural experiences.
                  </div>
                )}
              </div>
            </div>

            <div className="w-full lg:w-[420px]">
              <Card className="shadow-2xl border-amber-200/60 sticky top-6">
                <CardHeader className="border-b border-amber-100 pb-4">
                  <CardTitle className="text-2xl font-cinzel text-gray-900">
                    Book & Reserve
                  </CardTitle>
                  <CardDescription className="text-gray-600">
                    Confirm your cultural circuit instantly. Admins see this booking under Cultural → Bookings.
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-4">
                  <form className="space-y-4" onSubmit={handleSubmitBooking}>
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-gray-800">Tour</label>
                      <select
                        value={bookingForm.tourId}
                        onChange={(e) => handleSelectTour(e.target.value)}
                        className="w-full border border-slate-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-sm bg-white"
                      >
                        {tours.map(tour => (
                          <option key={tour.id} value={tour.id}>
                            {tour.title} • {tour.location}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-800">Start date</label>
                        <input
                          type="date"
                          value={bookingForm.date}
                          onChange={(e) => handleBookingChange('date', e.target.value)}
                          min={new Date().toISOString().split('T')[0]}
                          className="w-full border border-slate-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-sm"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-800">Adults</label>
                        <input
                          type="number"
                          min={1}
                          value={bookingForm.adults}
                          onChange={(e) => handleBookingChange('adults', Math.max(1, parseInt(e.target.value) || 1))}
                          className="w-full border border-slate-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-sm"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-800">Children</label>
                        <input
                          type="number"
                          min={0}
                          value={bookingForm.children}
                          onChange={(e) => handleBookingChange('children', Math.max(0, parseInt(e.target.value) || 0))}
                          className="w-full border border-slate-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-sm"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-800">Pickup</label>
                        {selectedTour?.pickupOptions?.length ? (
                          <select
                            value={bookingForm.pickupOption}
                            onChange={(e) => handleBookingChange('pickupOption', e.target.value)}
                            className="w-full border border-slate-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-sm bg-white"
                          >
                            {selectedTour.pickupOptions.map(opt => (
                              <option key={opt.id} value={opt.id}>
                                {opt.label} ({opt.time}) {opt.additionalCost ? `+${currencySymbol}${Math.round(opt.additionalCost * currencyMultiplier)}` : ''}
                              </option>
                            ))}
                          </select>
                        ) : (
                          <input
                            type="text"
                            disabled
                            value="Pickup arranged after confirmation"
                            className="w-full border border-slate-200 rounded-lg px-3 py-2 bg-slate-50 text-sm text-gray-600"
                          />
                        )}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-gray-800">Pickup address / hotel</label>
                      <input
                        type="text"
                        placeholder="Hotel or address for pickup"
                        value={bookingForm.pickupLocation}
                        onChange={(e) => handleBookingChange('pickupLocation', e.target.value)}
                        className="w-full border border-slate-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-sm"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-gray-800">Your details</label>
                      <input
                        type="text"
                        placeholder="Full name"
                        value={bookingForm.contactName}
                        onChange={(e) => handleBookingChange('contactName', e.target.value)}
                        className="w-full border border-slate-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-sm mb-2"
                      />
                      <input
                        type="email"
                        placeholder="Email"
                        value={bookingForm.contactEmail}
                        onChange={(e) => handleBookingChange('contactEmail', e.target.value)}
                        className="w-full border border-slate-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-sm mb-2"
                      />
                      <input
                        type="tel"
                        placeholder="Phone / WhatsApp"
                        value={bookingForm.contactPhone}
                        onChange={(e) => handleBookingChange('contactPhone', e.target.value)}
                        className="w-full border border-slate-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-sm"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-gray-800">Special requests</label>
                      <textarea
                        rows={3}
                        value={bookingForm.specialRequests}
                        onChange={(e) => handleBookingChange('specialRequests', e.target.value)}
                        className="w-full border border-slate-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-sm"
                        placeholder="Tell us about cultural interests, dietary needs, or preferred guides"
                      />
                    </div>

                    <div className="p-4 rounded-xl bg-amber-50 border border-amber-100 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-700">Guests</span>
                        <span className="font-semibold text-gray-900">
                          {bookingForm.adults + bookingForm.children} traveler(s)
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-700">Tour rate</span>
                        <span className="font-semibold text-gray-900">
                          {currencySymbol}{Math.round(basePrice * currencyMultiplier)} x adults
                        </span>
                      </div>
                      {bookingForm.children > 0 && (
                        <div className="flex items-center justify-between text-sm text-gray-700">
                          <span>Children (50%)</span>
                          <span className="font-semibold text-gray-900">
                            {currencySymbol}{Math.round(basePrice * 0.5 * currencyMultiplier)} x {bookingForm.children}
                          </span>
                        </div>
                      )}
                      {pickupOption?.additionalCost ? (
                        <div className="flex items-center justify-between text-sm text-gray-700">
                          <span>Pickup</span>
                          <span className="font-semibold text-gray-900">
                            +{currencySymbol}{Math.round(pickupOption.additionalCost * currencyMultiplier)} per guest
                          </span>
                        </div>
                      ) : null}
                      <div className="flex items-center justify-between pt-2 border-t border-amber-100">
                        <span className="text-base font-semibold text-gray-900">Total</span>
                        <span className="text-2xl font-bold text-amber-700">
                          {currencySymbol}{totalPrice.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-gray-600 pt-1">
                        <Shield className="w-4 h-4 text-amber-500" />
                        <span>Secure request – no payment collected online</span>
                      </div>
                    </div>

                    <Button
                      type="submit"
                      className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-semibold py-3"
                    >
                      Book Cultural Tour
                    </Button>
                    <div className="text-xs text-gray-500 text-center">
                      We confirm within 24 hours. Admins see this booking under Cultural &gt; Bookings.
                    </div>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Circuit Overview with Interactive Timeline */}
      <section id="circuit-overview" className="py-24 bg-gradient-to-br from-amber-50 to-orange-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-cinzel text-gray-900 mb-8">
              Classic 8-Site Cultural Circuit
            </h2>
            <div className="w-32 h-1 bg-gradient-to-r from-transparent via-amber-500 to-transparent mx-auto mb-8"></div>
            <p className="text-2xl text-gray-700 max-w-4xl mx-auto leading-relaxed font-montserrat mb-6">
              UNESCO World Heritage sites connected in a seamless cultural journey
            </p>
            <div className="text-xl font-bold text-amber-600 mb-8">
              Rates from $80–200/day | 7–14 Day Packages
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
            {circuitSites.map((site, index) => (
              <Card key={site.id} className="overflow-hidden group hover:shadow-xl transition-all duration-500 border-0 bg-white transform hover:scale-105">
                <div className="relative">
                  <img
                    src={site.image}
                    alt={site.name}
                    className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute top-4 left-4 bg-amber-500/90 text-white px-3 py-1 rounded-full text-sm font-semibold">
                    Site {index + 1}
                  </div>
                  <div className="absolute bottom-4 right-4 bg-white/90 text-gray-800 px-3 py-1 rounded-full text-sm">
                    {site.duration}
                  </div>
                </div>
                
                <CardContent className="p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-2 font-cinzel">{site.name}</h3>
                  <p className="text-gray-600 text-sm mb-4 font-montserrat">{site.description}</p>
                  
                  <div className="space-y-2 mb-4">
                    {site.highlights.map((highlight, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-xs text-gray-500">
                        <Star className="w-3 h-3 text-amber-500" />
                        <span>{highlight}</span>
                      </div>
                    ))}
                  </div>
                  
                  <Button 
                    onClick={() => handleAddToCircuit(site.id)}
                    variant={selectedCircuit.includes(site.id) ? "default" : "outline"} 
                    className="w-full text-sm"
                  >
                    {selectedCircuit.includes(site.id) ? (
                      <>
                        <Minus className="w-4 h-4 mr-2" />
                        Remove from Circuit
                      </>
                    ) : (
                      <>
                        <Plus className="w-4 h-4 mr-2" />
                        Add to My Circuit
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Signature Activities Sections */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-cinzel text-gray-900 mb-8">
              Signature Cultural Activities
            </h2>
            <div className="w-32 h-1 bg-gradient-to-r from-transparent via-amber-500 to-transparent mx-auto mb-8"></div>
            <p className="text-2xl text-gray-700 max-w-4xl mx-auto font-montserrat">
              Immersive experiences that bring Sri Lankan culture to life
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-6xl mx-auto">
            {signatureActivities.map((activity) => (
              <Card key={activity.id} className="overflow-hidden group hover:shadow-xl transition-all duration-500">
                <div className="relative">
                  <img
                    src={activity.image}
                    alt={activity.title}
                    className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute top-4 right-4 bg-amber-500/90 text-white px-3 py-2 rounded-full">
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span className="text-sm font-semibold">{activity.duration}</span>
                    </div>
                  </div>
                </div>
                
                <CardContent className="p-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-4 font-cinzel">{activity.title}</h3>
                  <p className="text-gray-600 mb-6 leading-relaxed font-montserrat">{activity.description}</p>
                  
                  <div className="mb-6">
                    <h4 className="font-semibold text-gray-900 mb-3 font-montserrat">Includes:</h4>
                    <div className="grid grid-cols-2 gap-2">
                      {activity.inclusions.map((item, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-sm text-gray-600">
                          <Sparkles className="w-3 h-3 text-amber-500" />
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between pt-6 border-t border-gray-200">
                    <div>
                      <span className="text-2xl font-bold text-amber-600 font-montserrat">
                        {selectedCurrency === 'USD' ? '$' : selectedCurrency === 'EUR' ? '€' : '£'}
                        {activity.price[selectedCurrency]}
                      </span>
                      <span className="text-sm text-gray-500 block font-montserrat">per person</span>
                    </div>
                    <Button 
                      className="bg-amber-500 hover:bg-amber-600 text-white font-montserrat"
                    >
                      Add to My Circuit
                      <Plus className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Detailed Itinerary Previews */}
      <section className="py-24 bg-gradient-to-br from-gray-50 to-amber-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-cinzel text-gray-900 mb-8">
              Detailed Itinerary Options
            </h2>
            <div className="w-32 h-1 bg-gradient-to-r from-transparent via-amber-500 to-transparent mx-auto mb-8"></div>
            <p className="text-2xl text-gray-700 max-w-4xl mx-auto font-montserrat">
              Choose your perfect cultural journey duration
            </p>
          </div>

          <Tabs defaultValue="7" className="max-w-6xl mx-auto">
            <TabsList className="grid w-full grid-cols-3 mb-12">
              <TabsTrigger value="7" className="text-lg py-3">7 Days</TabsTrigger>
              <TabsTrigger value="10" className="text-lg py-3">10 Days</TabsTrigger>
              <TabsTrigger value="14" className="text-lg py-3">14 Days</TabsTrigger>
            </TabsList>
            
            {itineraryOptions.map((option) => (
              <TabsContent key={option.duration} value={option.duration}>
                <Card className="bg-white shadow-xl">
                  <CardHeader className="text-center pb-8">
                    <CardTitle className="text-3xl font-cinzel text-gray-900 mb-4">
                      {option.title}
                    </CardTitle>
                    <CardDescription className="text-xl text-gray-600 font-montserrat">
                      {option.description}
                    </CardDescription>
                    <div className="text-2xl font-bold text-amber-600 mt-4">
                      {selectedCurrency === 'USD' ? '$' : selectedCurrency === 'EUR' ? '€' : '£'}
                      {option.dailyRate[selectedCurrency]} per day
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-8">
                    <div className="grid md:grid-cols-2 gap-8">
                      <div>
                        <h4 className="font-bold text-gray-900 mb-4 font-montserrat">Tour Highlights:</h4>
                        <div className="space-y-3">
                          {option.highlights.map((highlight, idx) => (
                            <div key={idx} className="flex items-center gap-3">
                              <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center">
                                <span className="text-amber-600 font-bold text-sm">{idx + 1}</span>
                              </div>
                              <span className="text-gray-700 font-montserrat">{highlight}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div className="space-y-6">
                        <div className="bg-amber-50 p-6 rounded-lg">
                          <h4 className="font-bold text-gray-900 mb-3 font-montserrat">Package Includes:</h4>
                          <div className="space-y-2 text-sm text-gray-600">
                            <div className="flex items-center gap-2">
                              <Home className="w-4 h-4 text-amber-500" />
                              <span>Heritage accommodation</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Users className="w-4 h-4 text-amber-500" />
                              <span>Expert cultural guide</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Route className="w-4 h-4 text-amber-500" />
                              <span>Private transportation</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <ChefHat className="w-4 h-4 text-amber-500" />
                              <span>Traditional meals</span>
                            </div>
                          </div>
                        </div>
                        
                        <Button 
                          className="w-full bg-amber-500 hover:bg-amber-600 text-white font-semibold py-3"
                          onClick={() => window.open(option.pdf, '_blank')}
                        >
                          <Download className="w-5 h-5 mr-2" />
                          Download Full PDF Itinerary
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </section>

      {/* Interactive Map Section */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-cinzel text-gray-900 mb-8">
              Interactive Cultural Circuit Map
            </h2>
            <div className="w-32 h-1 bg-gradient-to-r from-transparent via-amber-500 to-transparent mx-auto mb-8"></div>
            <p className="text-2xl text-gray-700 max-w-4xl mx-auto font-montserrat">
              Explore the route and plan your cultural journey
            </p>
          </div>

          <InteractiveMap sites={circuitSites} />
        </div>
      </section>

      {/* Floating Booking Engine */}
      <BookingEngine 
        selectedCurrency={selectedCurrency}
        calculatePrice={calculatePrice}
        itineraryOptions={itineraryOptions}
        selectedDuration={selectedDuration}
        setSelectedDuration={setSelectedDuration}
      />

      <Footer />
    </>
  )
}

export default CulturalTours
