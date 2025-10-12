
import { useState, useRef } from 'react'
import { Helmet } from 'react-helmet-async'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { 
  Plane, 
  Crown, 
  Star, 
  Car, 
  MapPin,
  Clock,
  Users,
  CheckCircle,
  ArrowRight,
  Phone,
  Calendar,
  Gem,
  Wine,
  Castle,
  Sparkles,
  Award,
  Anchor,
  Navigation,
  Shield,
  Mountain,
  Utensils,
  Camera,
  Settings,
  Zap
} from 'lucide-react'
import { toast } from 'sonner'

const LuxuryTours = () => {
  const [selectedExperience, setSelectedExperience] = useState<string | null>(null)
  const [isBookingOpen, setIsBookingOpen] = useState(false)
  const [travelerCount, setTravelerCount] = useState(2)
  const [selectedDate, setSelectedDate] = useState('')
  const [selectedServices, setSelectedServices] = useState<string[]>([])
  const bookingRef = useRef<HTMLDivElement>(null)

  const handleExperienceSelect = (experienceName: string) => {
    setSelectedExperience(experienceName)
    toast.success(`${experienceName} selected! Configure your bespoke journey.`)
    setIsBookingOpen(true)
  }

  const handleServiceToggle = (service: string) => {
    setSelectedServices(prev => 
      prev.includes(service) 
        ? prev.filter(s => s !== service)
        : [...prev, service]
    )
  }

  const helicopterFleet = [
    {
      id: 'executive-4',
      name: 'Executive Bell 429',
      description: '4-seat luxury helicopter with panoramic windows',
      features: ['Champagne service', 'Noise-cancelling headsets', 'Leather appointments', 'Climate control'],
      price: 2500,
      image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800'
    },
    {
      id: 'vip-8',
      name: 'VIP Airbus H145',
      description: '8-seat ultra-luxury helicopter with private lounge',
      features: ['Private bar', 'Massage seats', 'Satellite WiFi', 'Personal attendant'],
      price: 4500,
      image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800'
    }
  ]

  const yachtCollection = [
    {
      id: 'superyacht-80',
      name: 'Oceanic Majesty',
      length: '80ft',
      description: 'Ultra-luxury super yacht with private crew',
      features: ['Personal chef', 'Spa therapist', 'Jet ski garage', 'Helipad'],
      price: 8500,
      image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800'
    },
    {
      id: 'megayacht-120',
      name: 'Ceylon Pearl',
      length: '120ft',
      description: 'Mega yacht with underwater dining room',
      features: ['Submarine dock', 'Michelin chef', 'Spa suite', 'Cinema room'],
      price: 15000,
      image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800'
    }
  ]

  const luxuryVehicles = [
    {
      id: 'rolls-cullinan',
      brand: 'Rolls-Royce',
      model: 'Cullinan',
      description: 'The ultimate luxury SUV with bespoke interior',
      features: ['Massage seats', 'Champagne cooler', 'Starlight headliner', 'Personal chauffeur'],
      price: 800,
      image: 'https://images.unsplash.com/photo-1563720360172-67b8f3dce741?w=800'
    },
    {
      id: 'bentley-bentayga',
      brand: 'Bentley',
      model: 'Bentayga Speed',
      description: 'Performance luxury SUV with diamond-quilted leather',
      features: ['Naim audio', 'Wellness seating', 'Bentley champagne', 'Privacy glass'],
      price: 750,
      image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800'
    },
    {
      id: 'maybach-s-class',
      brand: 'Mercedes-Maybach',
      model: 'S-Class',
      description: 'The pinnacle of automotive luxury and comfort',
      features: ['Executive lounge', 'Burmester 4D sound', 'Champagne flutes', 'Massage function'],
      price: 650,
      image: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800'
    }
  ]

  const dreamJourneys = [
    {
      id: 'coastal-extravaganza',
      title: 'Coastal Extravaganza',
      duration: '3 Days',
      price: 25000,
      highlights: ['Helicopter beach-hopping', 'Super-yacht sunset gala', 'Michelin-chef beach dinner'],
      description: 'Experience Sri Lanka\'s coastline from sky and sea',
      itinerary: {
        'Day 1': ['Private helicopter transfer to Mirissa', 'Whale watching from super-yacht', 'Sunset champagne cruise'],
        'Day 2': ['Helicopter tour of southern beaches', 'Private island lunch', 'Underwater dining experience'],
        'Day 3': ['Morning yacht sailing', 'Beach villa relaxation', 'Farewell gala dinner']
      },
      image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800'
    },
    {
      id: 'heritage-sky',
      title: 'Heritage in the Sky',
      duration: '4 Days',
      price: 35000,
      highlights: ['VIP temple blessings by helicopter', 'Private museum openings', 'Candlelit jungle retreat'],
      description: 'Cultural immersion with exclusive aerial access',
      itinerary: {
        'Day 1': ['Helicopter to Sigiriya Rock', 'Private archaeological tour', 'Luxury tent accommodation'],
        'Day 2': ['Temple of the Tooth VIP blessing', 'Royal Botanical Gardens', 'Cultural performance'],
        'Day 3': ['Helicopter to Anuradhapura', 'Ancient city private tour', 'Jungle retreat arrival'],
        'Day 4': ['Wildlife helicopter safari', 'Spa treatments', 'Departure transfer']
      },
      image: 'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800'
    },
    {
      id: 'ultimate-escape',
      title: 'Ultimate Island Escape',
      duration: '5 Days',
      price: 50000,
      highlights: ['Round-island helicopter loop', 'Secluded island resort', 'Deep-sea submersible dive'],
      description: 'The most exclusive Sri Lankan adventure possible',
      itinerary: {
        'Day 1': ['Helicopter island circumnavigation', 'Private island arrival', 'Over-water villa check-in'],
        'Day 2': ['Submersible reef exploration', 'Underwater photography', 'Private beach dinner'],
        'Day 3': ['Helicopter wildlife safari', 'Tea estate visit', 'Mountain retreat'],
        'Day 4': ['Adventure activities', 'Spa wellness day', 'Sunset yacht cruise'],
        'Day 5': ['Final helicopter tour', 'Shopping experience', 'Private jet departure']
      },
      image: 'https://images.unsplash.com/photo-1549366021-9f761d040a94?w=800'
    }
  ]

  const conciergeServices = [
    { name: 'Private Chef', icon: <Utensils className="w-6 h-6" />, description: 'Michelin-starred cuisine' },
    { name: 'Personal Shopper', icon: <Gem className="w-6 h-6" />, description: 'Luxury brand access' },
    { name: 'Security Detail', icon: <Shield className="w-6 h-6" />, description: 'Discreet protection' },
    { name: 'Event Planning', icon: <Crown className="w-6 h-6" />, description: 'Bespoke celebrations' },
    { name: 'Spa & Wellness', icon: <Sparkles className="w-6 h-6" />, description: 'Personal therapists' },
    { name: 'Photography', icon: <Camera className="w-6 h-6" />, description: 'Professional documentation' }
  ]

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "TouristTrip",
    "name": "Ultra-Luxury Helicopters, Yachts & 7-Star Villas Sri Lanka",
    "description": "Design your private billionaire journey in Sri Lanka: VIP helicopters, super-yachts, ultra-luxury vehicles, 7-star estates, and white-glove concierge.",
    "provider": {
      "@type": "Organization",
      "name": "Recharge Travels"
    },
    "offers": dreamJourneys.map(journey => ({
      "@type": "Offer",
      "name": journey.title,
      "price": journey.price,
      "priceCurrency": "USD",
      "availability": "InStock"
    }))
  }

  return (
    <>
      <Helmet>
        <title>Ultra-Luxury Helicopters, Yachts & 7-Star Villas Sri Lanka – Recharge Travels</title>
        <meta 
          name="description" 
          content="Design your private billionaire journey in Sri Lanka: VIP helicopters, super-yachts, ultra-luxury vehicles, 7-star estates, and white-glove concierge." 
        />
        <meta name="keywords" content="luxury helicopter Sri Lanka, super yacht charter, 7-star villas, ultra-luxury vehicles, billionaire experiences, VIP travel" />
        <link rel="canonical" href={`${window.location.origin}/tours/luxury`} />
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      </Helmet>
      
      <Header />

      {/* Floating Enquire Button */}
      <Dialog open={isBookingOpen} onOpenChange={setIsBookingOpen}>
        <DialogTrigger asChild>
          <Button className="fixed top-24 right-6 z-50 bg-gradient-to-r from-slate-900 to-black text-amber-400 border-2 border-amber-400 hover:bg-black font-bold px-6 py-3 shadow-2xl">
            <Crown className="w-5 h-5 mr-2" />
            Enquire Now
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-2xl bg-gradient-to-b from-slate-900 to-black text-white border-2 border-amber-400">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-amber-400 mb-4">Configure Your Billionaire Journey</DialogTitle>
          </DialogHeader>
          <div className="space-y-6">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-amber-300 mb-2">Traveler Count</label>
                <div className="flex items-center gap-4">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => setTravelerCount(Math.max(1, travelerCount - 1))}
                    className="border-amber-400 text-amber-400"
                  >
                    -
                  </Button>
                  <span className="text-xl font-bold">{travelerCount} Guests</span>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => setTravelerCount(travelerCount + 1)}
                    className="border-amber-400 text-amber-400"
                  >
                    +
                  </Button>
                </div>
              </div>
              <div>
                <label className="block text-amber-300 mb-2">Preferred Start Date</label>
                <input 
                  type="date" 
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full p-3 bg-slate-800 border border-amber-400 rounded text-white"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-amber-300 mb-4">Desired Experiences</label>
              <div className="grid grid-cols-2 gap-3">
                {['Helicopter', 'Super-Yacht', '7-Star Villa', 'Luxury Vehicle', 'Private Chef', 'Security Detail'].map((service) => (
                  <Button
                    key={service}
                    variant={selectedServices.includes(service) ? "default" : "outline"}
                    onClick={() => handleServiceToggle(service)}
                    className={selectedServices.includes(service) 
                      ? "bg-amber-400 text-black" 
                      : "border-amber-400 text-amber-400 hover:bg-amber-400 hover:text-black"
                    }
                  >
                    {service}
                  </Button>
                ))}
              </div>
            </div>
            
            <div>
              <label className="block text-amber-300 mb-2">Special Requests</label>
              <textarea 
                className="w-full p-3 bg-slate-800 border border-amber-400 rounded text-white h-24"
                placeholder="Describe your dream luxury experience in Sri Lanka..."
              />
            </div>
            
            <div className="flex gap-4">
              <Button 
                className="flex-1 bg-gradient-to-r from-amber-400 to-yellow-500 text-black font-bold py-4 text-lg hover:from-yellow-500 hover:to-amber-400"
                onClick={() => {
                  toast.success("Luxury concierge will contact you within 30 minutes!")
                  setIsBookingOpen(false)
                }}
              >
                <Crown className="w-5 h-5 mr-2" />
                Submit Inquiry
              </Button>
              <Button 
                variant="outline" 
                className="border-amber-400 text-amber-400 hover:bg-amber-400 hover:text-black px-8"
              >
                <Phone className="w-5 h-5 mr-2" />
                Call Now
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Cinematic Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-b from-slate-900 via-black to-slate-900">
        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          {/* Helicopter Animation */}
          <div className="absolute top-1/4 left-0 w-32 h-20 opacity-30 animate-[slide-right_25s_linear_infinite]">
            <Plane className="w-full h-full text-amber-400 transform rotate-12" />
          </div>
          
          {/* Yacht Animation */}
          <div className="absolute bottom-1/3 right-0 w-40 h-16 opacity-20 animate-[slide-left_30s_linear_infinite]">
            <Anchor className="w-full h-full text-blue-400" />
          </div>
          
          {/* Floating Luxury Elements */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {[...Array(12)].map((_, i) => (
              <div
                key={i}
                className="absolute animate-float-luxury opacity-20"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${i * 2}s`,
                  animationDuration: `${15 + Math.random() * 10}s`
                }}
              >
                {i % 4 === 0 ? (
                  <Crown className="w-8 h-8 text-amber-400" />
                ) : i % 4 === 1 ? (
                  <Gem className="w-6 h-6 text-blue-300" />
                ) : i % 4 === 2 ? (
                  <Wine className="w-7 h-7 text-purple-300" />
                ) : (
                  <Sparkles className="w-5 h-5 text-amber-300" />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Hero Content */}
        <div className="relative z-20 text-center px-4 max-w-6xl mx-auto">
          <div className="animate-fade-in">
            {/* Luxury Crown Emblem */}
            <div className="flex justify-center items-center mb-8">
              <div className="relative">
                <Crown className="w-32 h-32 text-amber-400 animate-pulse" />
                <div className="absolute inset-0 rounded-full border-4 border-amber-400/30 animate-spin"></div>
              </div>
            </div>
            
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif font-bold text-white mb-6 tracking-wider">
              <span className="block text-amber-400 animate-shimmer bg-gradient-to-r from-amber-300 via-yellow-400 to-amber-300 bg-clip-text text-transparent bg-size-200 animate-gradient-x">
                Sri Lanka's Ultimate
              </span>
              <span className="block text-white text-4xl md:text-5xl lg:text-6xl font-light mt-4">
                Billionaire Experiences
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-slate-300 font-light mb-8 max-w-4xl mx-auto leading-relaxed">
              Private Helicopters • 7-Star Super-Yachts • Ultra-Luxury Vehicles • White-Glove Concierge
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Button 
                size="lg"
                onClick={() => setIsBookingOpen(true)}
                className="bg-gradient-to-r from-slate-900 to-black text-amber-400 border-4 border-amber-400 hover:bg-black font-bold px-12 py-6 text-xl rounded-none shadow-[inset_0_2px_4px_rgba(255,215,0,0.3)] relative overflow-hidden group"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-amber-400/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                <Crown className="w-6 h-6 mr-3 relative z-10" />
                <span className="relative z-10">Enquire Your Private Journey</span>
                <ArrowRight className="w-6 h-6 ml-3 relative z-10" />
              </Button>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce text-amber-400">
          <div className="flex flex-col items-center">
            <span className="text-sm mb-2">Experience Ultimate Luxury</span>
            <div className="w-6 h-10 border-2 border-amber-400 rounded-full flex justify-center">
              <div className="w-1 h-3 bg-amber-400 rounded-full mt-2 animate-pulse"></div>
            </div>
          </div>
        </div>
      </section>

      {/* VIP Helicopter Fleet */}
      <section className="py-20 bg-gradient-to-b from-black to-slate-900 text-white relative">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-amber-400 to-transparent"></div>
        
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <div className="flex items-center justify-center mb-6">
              <div className="h-px bg-amber-400 flex-1 max-w-32"></div>
              <Plane className="w-8 h-8 text-amber-400 mx-6" />
              <div className="h-px bg-amber-400 flex-1 max-w-32"></div>
            </div>
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-amber-400 mb-6">
              VIP Helicopter Transfers & Tours
            </h2>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto">
              Executive aircraft with champagne service and panoramic windows
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {helicopterFleet.map((helicopter) => (
              <Card key={helicopter.id} className="bg-gradient-to-br from-slate-800 to-black border-2 border-amber-400/30 hover:border-amber-400 transition-all duration-300 transform hover:-translate-y-4 hover:shadow-2xl overflow-hidden group">
                <div className="relative h-64 overflow-hidden">
                  <img 
                    src={helicopter.image} 
                    alt={`${helicopter.name} luxury helicopter`}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                  <div className="absolute top-4 right-4">
                    <Badge className="bg-amber-400 text-black font-semibold px-3 py-1">
                      <Plane className="w-3 h-3 mr-1" />
                      VIP Fleet
                    </Badge>
                  </div>
                  <div className="absolute bottom-4 left-4 text-white">
                    <h3 className="text-2xl font-serif font-bold">{helicopter.name}</h3>
                    <p className="text-slate-300">{helicopter.description}</p>
                  </div>
                </div>

                <CardContent className="p-6 space-y-4">
                  <ul className="space-y-2">
                    {helicopter.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm">
                        <CheckCircle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                        <span className="text-slate-300">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="border-t border-slate-700 pt-4">
                    <div className="flex items-center justify-between mb-4">
                      <div className="text-2xl font-bold text-amber-400">
                        ${helicopter.price.toLocaleString()}
                        <span className="text-sm font-normal text-slate-400">/hour</span>
                      </div>
                      <div className="flex items-center text-amber-400">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-current" />
                        ))}
                      </div>
                    </div>
                    <Button 
                      onClick={() => handleExperienceSelect(helicopter.name)}
                      className="w-full bg-gradient-to-r from-amber-400 to-yellow-500 text-black font-semibold hover:from-yellow-500 hover:to-amber-400 transition-all duration-300 hover:scale-105"
                    >
                      View Helicopter Fleet
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Super-Yacht Collection */}
      <section className="py-20 bg-gradient-to-b from-slate-900 to-black text-white relative">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-blue-400 to-transparent"></div>
        
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <div className="flex items-center justify-center mb-6">
              <div className="h-px bg-blue-400 flex-1 max-w-32"></div>
              <Anchor className="w-8 h-8 text-blue-400 mx-6" />
              <div className="h-px bg-blue-400 flex-1 max-w-32"></div>
            </div>
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-blue-400 mb-6">
              Super-Yacht & Catamaran Charters
            </h2>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto">
              80-120 ft ultra-luxury yachts with private crew and sea-plane docking
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {yachtCollection.map((yacht) => (
              <Card key={yacht.id} className="bg-gradient-to-br from-slate-800 to-black border-2 border-blue-400/30 hover:border-blue-400 transition-all duration-300 transform hover:-translate-y-4 hover:shadow-2xl overflow-hidden group">
                <div className="relative h-64 overflow-hidden">
                  <img 
                    src={yacht.image} 
                    alt={`${yacht.name} luxury yacht`}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                  <div className="absolute top-4 right-4">
                    <Badge className="bg-blue-400 text-black font-semibold px-3 py-1">
                      <Anchor className="w-3 h-3 mr-1" />
                      {yacht.length}
                    </Badge>
                  </div>
                  <div className="absolute bottom-4 left-4 text-white">
                    <h3 className="text-2xl font-serif font-bold">{yacht.name}</h3>
                    <p className="text-slate-300">{yacht.description}</p>
                  </div>
                </div>

                <CardContent className="p-6 space-y-4">
                  <ul className="space-y-2">
                    {yacht.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm">
                        <CheckCircle className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
                        <span className="text-slate-300">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="border-t border-slate-700 pt-4">
                    <div className="flex items-center justify-between mb-4">
                      <div className="text-2xl font-bold text-blue-400">
                        ${yacht.price.toLocaleString()}
                        <span className="text-sm font-normal text-slate-400">/day</span>
                      </div>
                      <div className="flex items-center text-blue-400">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-current" />
                        ))}
                      </div>
                    </div>
                    <Button 
                      onClick={() => handleExperienceSelect(yacht.name)}
                      className="w-full bg-gradient-to-r from-blue-400 to-cyan-500 text-black font-semibold hover:from-cyan-500 hover:to-blue-400 transition-all duration-300 hover:scale-105"
                    >
                      Explore Yacht Collection
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Hyper-Luxury Vehicle Fleet */}
      <section className="py-20 bg-gradient-to-b from-black to-slate-900 text-white relative">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-purple-400 to-transparent"></div>
        
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <div className="flex items-center justify-center mb-6">
              <div className="h-px bg-purple-400 flex-1 max-w-32"></div>
              <Car className="w-8 h-8 text-purple-400 mx-6" />
              <div className="h-px bg-purple-400 flex-1 max-w-32"></div>
            </div>
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-purple-400 mb-6">
              Hyper-Luxury Land Fleet
            </h2>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto">
              Premium vehicles with massage seats, champagne service, and personal chauffeurs
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {luxuryVehicles.map((vehicle) => (
              <Card key={vehicle.id} className="bg-gradient-to-br from-slate-800 to-black border-2 border-purple-400/30 hover:border-purple-400 transition-all duration-300 transform hover:-translate-y-4 hover:shadow-2xl overflow-hidden group">
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src={vehicle.image} 
                    alt={`${vehicle.brand} ${vehicle.model} luxury vehicle`}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                  <div className="absolute top-4 right-4">
                    <Badge className="bg-purple-400 text-black font-semibold px-2 py-1 text-xs">
                      <Car className="w-3 h-3 mr-1" />
                      Ultra-Luxury
                    </Badge>
                  </div>
                </div>

                <CardContent className="p-4 space-y-3">
                  <div>
                    <h3 className="text-lg font-serif font-bold text-purple-400">{vehicle.brand}</h3>
                    <p className="text-white font-semibold">{vehicle.model}</p>
                    <p className="text-slate-400 text-sm">{vehicle.description}</p>
                  </div>
                  
                  <ul className="space-y-1">
                    {vehicle.features.slice(0, 3).map((feature, index) => (
                      <li key={index} className="flex items-start gap-2 text-xs">
                        <CheckCircle className="w-3 h-3 text-purple-400 flex-shrink-0 mt-0.5" />
                        <span className="text-slate-300">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="border-t border-slate-700 pt-3">
                    <div className="flex items-center justify-between mb-3">
                      <div className="text-xl font-bold text-purple-400">
                        ${vehicle.price}
                        <span className="text-xs font-normal text-slate-400">/day</span>
                      </div>
                    </div>
                    <Button 
                      onClick={() => handleExperienceSelect(`${vehicle.brand} ${vehicle.model}`)}
                      className="w-full bg-gradient-to-r from-purple-400 to-pink-500 text-black font-semibold hover:from-pink-500 hover:to-purple-400 transition-all duration-300 text-sm py-2"
                    >
                      Select Chauffeur Vehicle
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Bespoke Concierge Services */}
      <section className="py-20 bg-gradient-to-b from-slate-900 to-black text-white relative">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-emerald-400 to-transparent"></div>
        
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <div className="flex items-center justify-center mb-6">
              <div className="h-px bg-emerald-400 flex-1 max-w-32"></div>
              <Settings className="w-8 h-8 text-emerald-400 mx-6" />
              <div className="h-px bg-emerald-400 flex-1 max-w-32"></div>
            </div>
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-emerald-400 mb-6">
              Bespoke Concierge & White-Glove Services
            </h2>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto">
              24/7 personalized services crafted for the most discerning travelers
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {conciergeServices.map((service, index) => (
              <Card key={index} className="bg-gradient-to-br from-slate-800 to-black border-2 border-emerald-400/30 hover:border-emerald-400 transition-all duration-300 transform hover:-translate-y-2 hover:shadow-xl">
                <CardContent className="p-6 text-center">
                  <div className="flex justify-center mb-4 text-emerald-400">
                    {service.icon}
                  </div>
                  <h3 className="text-xl font-serif font-bold text-emerald-400 mb-2">{service.name}</h3>
                  <p className="text-slate-300 text-sm">{service.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <Button 
              onClick={() => setIsBookingOpen(true)}
              className="bg-gradient-to-r from-emerald-400 to-green-500 text-black font-bold px-8 py-4 text-lg hover:from-green-500 hover:to-emerald-400 transition-all duration-300"
            >
              <Settings className="w-5 h-5 mr-2" />
              Customize My Concierge
            </Button>
          </div>
        </div>
      </section>

      {/* Dream Journey Itineraries */}
      <section className="py-20 bg-gradient-to-b from-black to-slate-900 text-white relative">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-amber-400 to-transparent"></div>
        
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <div className="flex items-center justify-center mb-6">
              <div className="h-px bg-amber-400 flex-1 max-w-32"></div>
              <MapPin className="w-8 h-8 text-amber-400 mx-6" />
              <div className="h-px bg-amber-400 flex-1 max-w-32"></div>
            </div>
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-amber-400 mb-6">
              Curated Dream Journeys
            </h2>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto">
              Three signature experiences designed for the ultimate luxury traveler
            </p>
          </div>

          <div className="space-y-12">
            {dreamJourneys.map((journey, index) => (
              <Card key={journey.id} className="bg-gradient-to-r from-slate-900 to-black border-2 border-amber-400/30 hover:border-amber-400 transition-all duration-300 overflow-hidden">
                <div className="md:flex">
                  <div className="md:w-1/3 relative h-64 md:h-auto">
                    <img 
                      src={journey.image} 
                      alt={`${journey.title} luxury experience`}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black/50"></div>
                    <div className="absolute top-4 left-4">
                      <div className="text-4xl font-bold text-amber-400 font-serif">
                        {String(index + 1).padStart(2, '0')}
                      </div>
                    </div>
                  </div>
                  
                  <CardContent className="md:w-2/3 p-8 space-y-6">
                    <div>
                      <h3 className="text-3xl font-serif font-bold text-amber-400 mb-2">{journey.title}</h3>
                      <p className="text-slate-300 text-lg mb-4">{journey.description}</p>
                      <div className="flex items-center gap-4 text-sm text-slate-400">
                        <div className="flex items-center">
                          <Clock className="w-4 h-4 mr-1" />
                          {journey.duration}
                        </div>
                        <div className="text-2xl font-bold text-amber-400">
                          ${journey.price.toLocaleString()}
                        </div>
                      </div>
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-bold text-amber-300 mb-3">Experience Highlights</h4>
                        <ul className="space-y-2">
                          {journey.highlights.map((highlight, idx) => (
                            <li key={idx} className="flex items-start gap-2 text-sm">
                              <Star className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                              <span className="text-slate-300">{highlight}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <div>
                        <h4 className="font-bold text-amber-300 mb-3">Sample Itinerary</h4>
                        <div className="space-y-2 max-h-32 overflow-y-auto">
                          {Object.entries(journey.itinerary).slice(0, 3).map(([day, activities]) => (
                            <div key={day} className="text-sm">
                              <span className="font-semibold text-amber-400">{day}:</span>
                              <span className="text-slate-300 ml-2">{activities[0]}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex gap-4">
                      <Button 
                        onClick={() => handleExperienceSelect(journey.title)}
                        className="bg-gradient-to-r from-amber-400 to-yellow-500 text-black font-semibold hover:from-yellow-500 hover:to-amber-400 transition-all duration-300"
                      >
                        Request Full Itinerary
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </div>
                  </CardContent>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20 bg-gradient-to-r from-slate-900 via-black to-slate-900 text-white relative">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23D4AF37' fill-opacity='0.05'%3E%3Cpath d='M30 30c0-16.569-13.431-30-30-30v60c16.569 0 30-13.431 30-30z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}></div>
        </div>
        
        <div className="container mx-auto px-4 text-center relative z-10">
          <Crown className="w-20 h-20 text-amber-400 mx-auto mb-8 animate-pulse" />
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-amber-400 mb-6">
            Your Billionaire Journey Awaits
          </h2>
          <p className="text-xl mb-8 opacity-90 max-w-3xl mx-auto leading-relaxed">
            Experience Sri Lanka like never before with our ultra-luxury concierge service. 
            Every detail crafted to perfection, every moment designed for extraordinary memories.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Button 
              size="lg"
              onClick={() => setIsBookingOpen(true)}
              className="bg-gradient-to-r from-amber-400 to-yellow-500 text-black font-bold px-12 py-6 text-xl hover:from-yellow-500 hover:to-amber-400 transition-all duration-300 transform hover:scale-105 shadow-2xl"
            >
              <Crown className="w-6 h-6 mr-3" />
              Begin Your Journey
              <ArrowRight className="w-6 h-6 ml-3" />
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              className="border-2 border-amber-400 text-amber-400 hover:bg-amber-400 hover:text-black font-bold px-8 py-6 text-xl transition-all duration-300"
            >
              <Phone className="w-5 h-5 mr-2" />
              Speak to Concierge
            </Button>
          </div>
        </div>
      </section>

      {/* Luxury Features Bar */}
      <section className="bg-gradient-to-r from-amber-900 via-yellow-800 to-amber-900 py-8 border-t-4 border-amber-400">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="flex flex-col items-center">
              <Crown className="w-8 h-8 text-amber-300 mb-2" />
              <span className="text-white font-semibold text-sm md:text-base">Ultra-Luxury</span>
              <span className="text-amber-200 text-xs">Concierge Service</span>
            </div>
            <div className="flex flex-col items-center">
              <Shield className="w-8 h-8 text-amber-300 mb-2" />
              <span className="text-white font-semibold text-sm md:text-base">Private & Secure</span>
              <span className="text-amber-200 text-xs">VIP Protection</span>
            </div>
            <div className="flex flex-col items-center">
              <Star className="w-8 h-8 text-amber-300 mb-2" />
              <span className="text-white font-semibold text-sm md:text-base">Bespoke Experiences</span>
              <span className="text-amber-200 text-xs">Tailored to You</span>
            </div>
            <div className="flex flex-col items-center">
              <Award className="w-8 h-8 text-amber-300 mb-2" />
              <span className="text-white font-semibold text-sm md:text-base">Award Winning</span>
              <span className="text-amber-200 text-xs">Travel Excellence</span>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  )
}

export default LuxuryTours
