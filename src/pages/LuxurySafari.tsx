
import { useState, useRef } from 'react'
import { Helmet } from 'react-helmet-async'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel'
import { 
  Crown, 
  Camera, 
  MapPin, 
  Clock, 
  Users, 
  Star, 
  Binoculars,
  TreePine,
  Heart,
  Award,
  CheckCircle,
  ArrowRight,
  Phone,
  Calendar,
  Download,
  Moon,
  Sun,
  Shield
} from 'lucide-react'
import { toast } from 'sonner'

const LuxurySafari = () => {
  const [selectedPackage, setSelectedPackage] = useState<string | null>(null)
  const [selectedDates, setSelectedDates] = useState<{ start: Date | null, end: Date | null }>({ start: null, end: null })
  const [partySize, setPartySize] = useState(2)
  const bookingRef = useRef<HTMLDivElement>(null)

  const handleBookingStart = () => {
    bookingRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const handlePackageSelect = (packageName: string) => {
    setSelectedPackage(packageName)
    toast.success(`${packageName} selected! Complete your booking below.`)
    bookingRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const wildlifeEncounters = [
    {
      id: 'leopard-tracking',
      title: 'Private Leopard Tracking',
      description: 'Exclusive morning drives with expert trackers through Yala\'s prime leopard territory.',
      details: 'Experience the thrill of tracking Sri Lanka\'s elusive leopards in their natural habitat with our certified wildlife experts.',
      features: ['Expert tracker guide', 'Private vehicle', 'Early morning departure'],
      image: 'https://images.unsplash.com/photo-1549366021-9f761d040a94?w=800',
      price: 450
    },
    {
      id: 'elephant-conservation',
      title: 'Elephant Conservation Safari',
      description: 'Behind-the-scenes access to elephant rescue centers and conservation efforts.',
      details: 'Meet rescued elephants and learn about conservation efforts from dedicated veterinarians and researchers.',
      features: ['Conservation center visit', 'Meet rescued elephants', 'Educational experience'],
      image: 'https://images.unsplash.com/photo-1472396961693-142e6e269027?w=800',
      price: 350
    },
    {
      id: 'night-safari',
      title: 'Nocturnal Night Safaris',
      description: 'Spotlight-guided after-dark game drives to discover Sri Lanka\'s nocturnal wildlife.',
      details: 'Experience the magic of the African night with specialized equipment and expert guides.',
      features: ['Night vision equipment', 'Spotlight tracking', 'Nocturnal species focus'],
      image: 'https://images.unsplash.com/photo-1493962853295-0fd70327578a?w=800',
      price: 400
    }
  ]

  const luxuryLodges = [
    {
      id: 'tented-paradise',
      name: 'Yala Tented Paradise',
      description: 'Luxury tented camp with private plunge pools overlooking the savannah',
      amenities: ['Private plunge pool', 'Open-air dining', 'Spa treatments', 'Butler service'],
      rate: 850,
      image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800',
      rating: 5
    },
    {
      id: 'wilderness-retreat',
      name: 'Udawalawe Wilderness Retreat',
      description: 'Boutique eco-lodge with panoramic views of the national park',
      amenities: ['Infinity pool', 'Wildlife viewing deck', 'Gourmet cuisine', 'Nature walks'],
      rate: 650,
      image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800',
      rating: 5
    },
    {
      id: 'safari-pavilion',
      name: 'Sigiriya Safari Pavilion',
      description: 'Exclusive pavilion-style accommodations with cultural immersion',
      amenities: ['Cultural experiences', 'Private chef', 'Helicopter transfers', 'Ancient site access'],
      rate: 1200,
      image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800',
      rating: 5
    }
  ]

  const safariItineraries = [
    {
      id: '2-day',
      title: '2-Day Leopard Discovery',
      duration: '2 Days / 1 Night',
      price: 1800,
      highlights: ['Yala National Park game drives', 'Luxury tented accommodation', 'Private guide'],
      dailyProgram: {
        'Day 1': ['Morning: Arrival and luxury lodge check-in', 'Afternoon: First game drive in Yala', 'Evening: Bush dinner under the stars'],
        'Day 2': ['Early morning: Leopard tracking expedition', 'Breakfast: Bush breakfast in the wild', 'Afternoon: Departure']
      }
    },
    {
      id: '4-day',
      title: '4-Day Wildlife Immersion',
      duration: '4 Days / 3 Nights',
      price: 3600,
      highlights: ['Multiple park visits', 'Elephant conservation experience', 'Night safari adventures'],
      dailyProgram: {
        'Day 1': ['Arrival at Yala', 'Afternoon game drive', 'Welcome dinner'],
        'Day 2': ['Full day Yala exploration', 'Bush breakfast', 'Evening at leisure'],
        'Day 3': ['Transfer to Udawalawe', 'Elephant conservation visit', 'Night safari'],
        'Day 4': ['Morning game drive', 'Brunch and departure']
      }
    },
    {
      id: '6-day',
      title: '6-Day Ultimate Safari',
      duration: '6 Days / 5 Nights',
      price: 6500,
      highlights: ['All major parks', 'Cultural heritage sites', 'Helicopter transfers', 'Private chef'],
      dailyProgram: {
        'Day 1': ['Arrival and luxury accommodation', 'Evening game drive'],
        'Day 2': ['Full day Yala exploration', 'Leopard tracking specialist'],
        'Day 3': ['Helicopter transfer to Udawalawe', 'Elephant sanctuary visit'],
        'Day 4': ['Cultural excursion to Sigiriya', 'Ancient fortress exploration'],
        'Day 5': ['Minneriya National Park', 'Elephant gathering experience'],
        'Day 6': ['Final game drive', 'Departure']
      }
    }
  ]

  const testimonials = [
    {
      id: 1,
      name: 'Lord & Lady Hamilton',
      location: 'United Kingdom',
      rating: 5,
      quote: 'An absolutely extraordinary experience. The level of luxury and attention to detail exceeded our expectations. Seeing leopards in their natural habitat was magical.',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150'
    },
    {
      id: 2,
      name: 'Mr. & Mrs. Patterson',
      location: 'Australia',
      rating: 5,
      quote: 'The private guides were incredibly knowledgeable, and our lodge was pure paradise. Every moment was perfectly orchestrated for an unforgettable safari.',
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150'
    },
    {
      id: 3,
      name: 'The Morrison Family',
      location: 'Canada',
      rating: 5,
      quote: 'Sri Lanka\'s wildlife is spectacular, and this luxury safari made it accessible in the most comfortable way. Our children still talk about the elephant encounter.',
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150'
    }
  ]

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "TouristTrip",
    "name": "Luxury Safari Tours Sri Lanka",
    "description": "Experience Sri Lanka's premier luxury safaris with private game drives, exclusive bush lodges, and curated wildlife encounters.",
    "provider": {
      "@type": "Organization",
      "name": "Recharge Travels"
    },
    "offers": safariItineraries.map(itinerary => ({
      "@type": "Offer",
      "name": itinerary.title,
      "price": itinerary.price,
      "priceCurrency": "USD",
      "availability": "InStock"
    }))
  }

  return (
    <>
      <Helmet>
        <title>Luxury Safari Tours Sri Lanka – Private Leopard & Elephant Safaris | Recharge Travels</title>
        <meta 
          name="description" 
          content="Experience Sri Lanka's premier luxury safaris with private game drives, exclusive bush lodges, and curated wildlife encounters. Book your premium wildlife adventure today." 
        />
        <meta name="keywords" content="luxury safari Sri Lanka, private leopard tracking, elephant conservation, exclusive bush lodges, premium wildlife tours" />
        <link rel="canonical" href={`${window.location.origin}/tours/luxury-safari`} />
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      </Helmet>

      <Header />

      {/* Enhanced Hero Section with Video-like Animation */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Animated Safari Background */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-r from-green-900/80 via-amber-900/60 to-green-800/80 z-10"></div>
          <div 
            className="w-full h-full bg-cover bg-center animate-slow-pan"
            style={{
              backgroundImage: `url("https://images.unsplash.com/photo-1549366021-9f761d040a94?w=1920")`,
              backgroundSize: '120%'
            }}
          />
          
          {/* Floating Safari Vehicle Animation */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute bottom-1/3 left-0 w-24 h-16 opacity-30 animate-[slide-right_20s_linear_infinite]">
              <div className="w-full h-full bg-gradient-to-r from-yellow-600 to-amber-500 rounded-lg transform rotate-12"></div>
            </div>
          </div>

          {/* Floating Wildlife Elements */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="absolute animate-dust-mote opacity-20"
                style={{
                  left: `${Math.random() * 100}%`,
                  animationDelay: `${i * 3}s`,
                  animationDuration: `${20 + Math.random() * 15}s`
                }}
              >
                <TreePine className="w-8 h-8 text-green-400" />
              </div>
            ))}
          </div>
        </div>

        {/* Hero Content with Safari Theme */}
        <div className="relative z-20 text-center px-4 max-w-6xl mx-auto">
          <div className="animate-fade-in">
            {/* Binocular Vignette Frame */}
            <div className="relative mb-8">
              <Binoculars className="w-24 h-24 text-amber-400 mx-auto mb-6 animate-stone-glow" />
              <div className="absolute inset-0 rounded-full border-4 border-amber-400/30 animate-pulse"></div>
            </div>
            
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-playfair font-bold text-white mb-6 tracking-wide">
              <span className="block text-amber-300 animate-copper-glow">LUXURY SAFARI</span>
              <span className="block text-white text-3xl md:text-4xl lg:text-5xl font-light">
                Experiences in Sri Lanka
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-white/90 font-montserrat mb-12 max-w-4xl mx-auto leading-relaxed">
              Private Game Drives, Exclusive Lodges & Curated Wildlife Encounters
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Button 
                size="lg"
                onClick={handleBookingStart}
                className="bg-gradient-to-r from-amber-600 to-yellow-700 text-black hover:from-yellow-700 hover:to-amber-600 font-bold px-12 py-6 text-xl rounded-none border-4 border-amber-800 shadow-[inset_0_2px_4px_rgba(255,255,255,0.3)] relative overflow-hidden group"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                <Crown className="w-6 h-6 mr-3 relative z-10" />
                <span className="relative z-10">Reserve Your Private Safari</span>
                <ArrowRight className="w-6 h-6 ml-3 relative z-10" />
              </Button>
              
              <Button 
                variant="outline"
                size="lg"
                className="border-3 border-amber-400 text-amber-300 hover:bg-amber-400 hover:text-black font-semibold px-8 py-6 text-xl bg-black/30 backdrop-blur-sm"
              >
                <Phone className="w-5 h-5 mr-2" />
                Speak to Safari Expert
              </Button>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce text-amber-300">
          <div className="flex flex-col items-center">
            <span className="text-sm font-montserrat mb-2">Discover Premium Safaris</span>
            <div className="w-6 h-10 border-2 border-amber-300 rounded-full flex justify-center">
              <div className="w-1 h-3 bg-amber-300 rounded-full mt-2 animate-pulse"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Signature Wildlife Encounters */}
      <section className="py-20 bg-gradient-to-b from-green-900 to-green-800 text-white relative">
        {/* Decorative Border */}
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-amber-600 via-yellow-500 to-amber-600"></div>
        
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <div className="flex items-center justify-center mb-6">
              <div className="h-px bg-amber-400 flex-1 max-w-32"></div>
              <Camera className="w-8 h-8 text-amber-400 mx-6" />
              <div className="h-px bg-amber-400 flex-1 max-w-32"></div>
            </div>
            <h2 className="text-4xl md:text-5xl font-playfair font-bold text-amber-300 mb-6">
              Signature Wildlife Encounters
            </h2>
            <p className="text-xl text-white/80 max-w-3xl mx-auto font-montserrat">
              Exclusive access to Sri Lanka's most spectacular wildlife experiences
            </p>
          </div>

          <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-8">
            {wildlifeEncounters.map((encounter) => (
              <Card key={encounter.id} className="bg-gradient-to-b from-amber-50 to-yellow-50 border-4 border-amber-600/30 hover:border-amber-500 transition-all duration-300 transform hover:-translate-y-4 hover:shadow-2xl relative overflow-hidden group">
                {/* Leather-stitched Border Effect */}
                <div className="absolute inset-0 border-2 border-amber-800 rounded-lg pointer-events-none opacity-50"></div>
                <div className="absolute inset-2 border border-amber-600 rounded-lg pointer-events-none opacity-30"></div>
                
                <div className="relative h-64 overflow-hidden">
                  <img 
                    src={encounter.image} 
                    alt={encounter.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  <div className="absolute top-4 right-4">
                    <Badge className="bg-amber-600 text-white font-semibold px-3 py-1">
                      <Crown className="w-3 h-3 mr-1" />
                      Premium
                    </Badge>
                  </div>
                </div>

                <CardHeader>
                  <CardTitle className="text-2xl font-playfair text-green-900">{encounter.title}</CardTitle>
                  <p className="text-green-700 font-montserrat leading-relaxed">{encounter.description}</p>
                </CardHeader>

                <CardContent className="space-y-6">
                  <p className="text-green-800 font-montserrat text-sm leading-relaxed">{encounter.details}</p>
                  
                  <ul className="space-y-2">
                    {encounter.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm font-montserrat">
                        <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                        <span className="text-green-800">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="border-t border-amber-200 pt-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="text-2xl font-bold text-green-900">
                        ${encounter.price}
                        <span className="text-sm font-normal text-green-600">/person</span>
                      </div>
                      <div className="flex items-center text-amber-500">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-current" />
                        ))}
                      </div>
                    </div>
                    <Button 
                      onClick={() => handlePackageSelect(encounter.title)}
                      className="w-full bg-gradient-to-r from-green-700 to-green-600 text-white hover:from-green-600 hover:to-green-500 font-semibold transition-all duration-300 hover:scale-105"
                    >
                      Learn More
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Luxury Safari Lodges Carousel */}
      <section className="py-20 bg-gradient-to-b from-amber-50 to-yellow-50 relative">
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-green-600 via-amber-500 to-green-600"></div>
        
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <div className="flex items-center justify-center mb-6">
              <div className="h-px bg-green-600 flex-1 max-w-32"></div>
              <Crown className="w-8 h-8 text-green-600 mx-6" />
              <div className="h-px bg-green-600 flex-1 max-w-32"></div>
            </div>
            <h2 className="text-4xl md:text-5xl font-playfair font-bold text-green-900 mb-6">
              Luxury Safari Lodges
            </h2>
            <p className="text-xl text-green-700 max-w-3xl mx-auto font-montserrat">
              5★ tented camps and boutique lodges with unparalleled comfort in the wilderness
            </p>
          </div>

          <div className="relative max-w-6xl mx-auto">
            <Carousel className="w-full">
              <CarouselContent>
                {luxuryLodges.map((lodge) => (
                  <CarouselItem key={lodge.id} className="md:basis-1/2 lg:basis-1/3">
                    <Card className="bg-white border-4 border-green-600/20 hover:border-green-500 transition-all duration-300 transform hover:-translate-y-2 hover:shadow-2xl relative overflow-hidden group">
                      {/* Wood-grain Border Effect */}
                      <div className="absolute inset-0 bg-gradient-to-br from-amber-100 via-transparent to-amber-50 opacity-30 pointer-events-none"></div>
                      
                      <div className="relative h-64 overflow-hidden">
                        <img 
                          src={lodge.image} 
                          alt={lodge.name}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                        <div className="absolute top-4 right-4">
                          <div className="flex items-center text-amber-400">
                            {[...Array(lodge.rating)].map((_, i) => (
                              <Star key={i} className="w-4 h-4 fill-current" />
                            ))}
                          </div>
                        </div>
                        <div className="absolute bottom-4 left-4 text-white">
                          <h3 className="text-xl font-playfair font-bold">{lodge.name}</h3>
                        </div>
                      </div>

                      <CardContent className="p-6 space-y-4">
                        <p className="text-green-700 font-montserrat leading-relaxed">{lodge.description}</p>
                        
                        <div className="space-y-2">
                          <h4 className="font-bold text-green-900 mb-2">Exclusive Amenities:</h4>
                          {lodge.amenities.map((amenity, index) => (
                            <div key={index} className="flex items-center gap-2 text-sm font-montserrat">
                              <Shield className="w-4 h-4 text-green-600" />
                              <span className="text-green-800">{amenity}</span>
                            </div>
                          ))}
                        </div>

                        <div className="border-t border-green-200 pt-4">
                          <div className="flex items-center justify-between mb-4">
                            <div className="text-2xl font-bold text-green-900">
                              ${lodge.rate}
                              <span className="text-sm font-normal text-green-600">/night</span>
                            </div>
                          </div>
                          <Button 
                            className="w-full bg-gradient-to-r from-amber-600 to-yellow-600 text-black hover:from-yellow-600 hover:to-amber-600 font-semibold py-3 rounded-none border-2 border-amber-800 relative overflow-hidden group"
                          >
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                            <span className="relative z-10">Check Availability</span>
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="left-4 bg-green-800 border-green-700 text-white hover:bg-green-700" />
              <CarouselNext className="right-4 bg-green-800 border-green-700 text-white hover:bg-green-700" />
            </Carousel>
          </div>
        </div>
      </section>

      {/* Curated Safari Itineraries */}
      <section className="py-20 bg-gradient-to-b from-green-800 to-green-900 text-white relative">
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-amber-600 via-yellow-500 to-amber-600"></div>
        
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <div className="flex items-center justify-center mb-6">
              <div className="h-px bg-amber-400 flex-1 max-w-32"></div>
              <MapPin className="w-8 h-8 text-amber-400 mx-6" />
              <div className="h-px bg-amber-400 flex-1 max-w-32"></div>
            </div>
            <h2 className="text-4xl md:text-5xl font-playfair font-bold text-amber-300 mb-6">
              Curated Safari Itineraries
            </h2>
            <p className="text-xl text-white/80 max-w-3xl mx-auto font-montserrat">
              Meticulously planned expeditions for the ultimate wildlife experience
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <Tabs defaultValue="2-day" className="w-full">
              <TabsList className="grid w-full grid-cols-3 bg-green-700/50 border border-amber-400/30">
                {safariItineraries.map((itinerary) => (
                  <TabsTrigger 
                    key={itinerary.id} 
                    value={itinerary.id}
                    className="data-[state=active]:bg-amber-600 data-[state=active]:text-black font-semibold"
                  >
                    {itinerary.duration}
                  </TabsTrigger>
                ))}
              </TabsList>
              
              {safariItineraries.map((itinerary) => (
                <TabsContent key={itinerary.id} value={itinerary.id} className="space-y-6">
                  <Card className="bg-gradient-to-br from-amber-50 to-yellow-50 border-4 border-amber-600/30 text-green-900">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-3xl font-playfair">{itinerary.title}</CardTitle>
                        <Badge className="bg-green-700 text-white px-4 py-2 text-lg">
                          ${itinerary.price} per person
                        </Badge>
                      </div>
                      <div className="flex flex-wrap gap-2 mt-4">
                        {itinerary.highlights.map((highlight, index) => (
                          <Badge key={index} variant="outline" className="border-green-600 text-green-700">
                            {highlight}
                          </Badge>
                        ))}
                      </div>
                    </CardHeader>
                    
                    <CardContent className="space-y-6">
                      <Accordion type="single" collapsible className="w-full">
                        {Object.entries(itinerary.dailyProgram).map(([day, activities]) => (
                          <AccordionItem key={day} value={day} className="border-green-200">
                            <AccordionTrigger className="text-lg font-bold text-green-800 hover:text-green-900">
                              {day}
                            </AccordionTrigger>
                            <AccordionContent className="space-y-2">
                              {activities.map((activity, index) => (
                                <div key={index} className="flex items-start gap-3">
                                  <Clock className="w-4 h-4 text-green-600 mt-1 flex-shrink-0" />
                                  <span className="text-green-800 font-montserrat">{activity}</span>
                                </div>
                              ))}
                            </AccordionContent>
                          </AccordionItem>
                        ))}
                      </Accordion>
                      
                      <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-green-200">
                        <Button 
                          onClick={() => handlePackageSelect(itinerary.title)}
                          className="bg-gradient-to-r from-green-700 to-green-600 text-white hover:from-green-600 hover:to-green-500 font-semibold px-8 py-3"
                        >
                          Book This Itinerary
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                        <Button 
                          variant="outline" 
                          className="border-green-600 text-green-700 hover:bg-green-50 font-semibold px-6 py-3"
                        >
                          <Download className="w-4 h-4 mr-2" />
                          Download PDF
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              ))}
            </Tabs>
          </div>
        </div>
      </section>

      {/* Guest Testimonials with Portrait Medallions */}
      <section className="py-20 bg-gradient-to-b from-amber-50 to-yellow-50 relative">
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-green-600 via-amber-500 to-green-600"></div>
        
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <div className="flex items-center justify-center mb-6">
              <div className="h-px bg-green-600 flex-1 max-w-32"></div>
              <Heart className="w-8 h-8 text-green-600 mx-6" />
              <div className="h-px bg-green-600 flex-1 max-w-32"></div>
            </div>
            <h2 className="text-4xl md:text-5xl font-playfair font-bold text-green-900 mb-6">
              Distinguished Guest Experiences
            </h2>
            <p className="text-xl text-green-700 max-w-3xl mx-auto font-montserrat">
              What our discerning travelers say about their luxury safari adventures
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {testimonials.map((testimonial) => (
              <Card key={testimonial.id} className="bg-gradient-to-br from-white to-amber-50/50 border-4 border-amber-600/20 hover:border-amber-500 transition-all duration-300 hover:shadow-2xl relative overflow-hidden group">
                {/* Wood-grain Background Effect */}
                <div className="absolute inset-0 opacity-10 bg-gradient-to-br from-amber-200 via-yellow-100 to-amber-100"></div>
                
                <CardContent className="p-8 text-center relative">
                  {/* Portrait Medallion */}
                  <div className="relative mb-6">
                    <div className="w-24 h-24 mx-auto rounded-full overflow-hidden border-4 border-amber-600 shadow-lg">
                      <img 
                        src={testimonial.image} 
                        alt={testimonial.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-amber-600 text-white px-3 py-1 rounded-full text-xs font-semibold">
                      <div className="flex items-center gap-1">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <Star key={i} className="w-3 h-3 fill-current" />
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <blockquote className="text-green-800 font-serif text-lg italic leading-relaxed mb-6 relative">
                    <span className="text-6xl text-amber-600/30 absolute -top-4 -left-2">"</span>
                    {testimonial.quote}
                    <span className="text-6xl text-amber-600/30 absolute -bottom-8 -right-2">"</span>
                  </blockquote>
                  
                  <div className="space-y-1">
                    <p className="font-bold text-green-900 text-lg font-playfair">{testimonial.name}</p>
                    <p className="text-green-600 font-montserrat">{testimonial.location}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced Booking Engine */}
      <section ref={bookingRef} className="py-20 bg-gradient-to-r from-green-900 to-green-800 text-white relative">
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-amber-600 via-yellow-500 to-amber-600"></div>
        
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Binoculars className="w-20 h-20 text-amber-400 mx-auto mb-8 animate-stone-glow" />
            <h2 className="text-4xl md:text-5xl font-playfair font-bold text-amber-300 mb-6">
              Reserve Your Luxury Safari Experience
            </h2>
            <p className="text-xl mb-8 opacity-90 max-w-3xl mx-auto font-montserrat leading-relaxed">
              Our safari concierge will craft your perfect wildlife adventure with personalized service and attention to every detail
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <Card className="bg-gradient-to-br from-amber-50 to-yellow-50 border-4 border-amber-600/30 text-green-900">
              <CardHeader>
                <CardTitle className="text-2xl font-playfair text-center">Safari Booking Engine</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <label className="block text-sm font-semibold text-green-800">Safari Dates</label>
                    <div className="flex gap-2">
                      <Button variant="outline" className="flex-1 justify-start border-green-300 text-green-700 hover:bg-green-50">
                        <Calendar className="w-4 h-4 mr-2" />
                        Check-in Date
                      </Button>
                      <Button variant="outline" className="flex-1 justify-start border-green-300 text-green-700 hover:bg-green-50">
                        <Calendar className="w-4 h-4 mr-2" />
                        Check-out Date
                      </Button>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <label className="block text-sm font-semibold text-green-800">Party Size</label>
                    <div className="flex items-center gap-4">
                      <Button variant="outline" size="sm" className="border-green-300 text-green-700">-</Button>
                      <span className="text-lg font-semibold">{partySize} Guests</span>
                      <Button variant="outline" size="sm" className="border-green-300 text-green-700">+</Button>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="block text-sm font-semibold text-green-800">Safari Package</label>
                  <select className="w-full p-3 border-2 border-green-300 rounded-lg focus:border-green-500 focus:outline-none">
                    <option>Select Safari Package</option>
                    {safariItineraries.map((itinerary) => (
                      <option key={itinerary.id} value={itinerary.id}>
                        {itinerary.title} - ${itinerary.price}/person
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-4">
                  <label className="block text-sm font-semibold text-green-800">Lodge Preference</label>
                  <select className="w-full p-3 border-2 border-green-300 rounded-lg focus:border-green-500 focus:outline-none">
                    <option>Select Lodge Tier</option>
                    {luxuryLodges.map((lodge) => (
                      <option key={lodge.id} value={lodge.id}>
                        {lodge.name} - ${lodge.rate}/night
                      </option>
                    ))}
                  </select>
                </div>

                <div className="bg-green-100 p-6 rounded-lg border-2 border-green-300">
                  <div className="flex justify-between items-center text-lg font-semibold">
                    <span>Estimated Total:</span>
                    <span className="text-2xl text-green-800">$3,200</span>
                  </div>
                  <p className="text-sm text-green-600 mt-2">*Final pricing will be customized based on your preferences</p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                  <Button 
                    size="lg"
                    className="flex-1 bg-gradient-to-r from-amber-600 to-yellow-600 text-black hover:from-yellow-600 hover:to-amber-600 font-bold py-4 text-lg rounded-none border-4 border-amber-800 relative overflow-hidden group"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                    <Crown className="w-5 h-5 mr-2 relative z-10" />
                    <span className="relative z-10">Confirm Your Safari</span>
                  </Button>
                  <Button 
                    variant="outline" 
                    size="lg"
                    className="border-2 border-green-600 text-green-700 hover:bg-green-50 font-semibold py-4 text-lg"
                  >
                    <Phone className="w-5 h-5 mr-2" />
                    Call Safari Expert
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <Footer />
    </>
  )
}

export default LuxurySafari
