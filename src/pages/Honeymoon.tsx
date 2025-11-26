
import { useState, useRef } from 'react'
import { Helmet } from 'react-helmet-async'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel'
import { 
  Heart, 
  Star, 
  Camera, 
  MapPin,
  Clock,
  Users,
  CheckCircle,
  ArrowRight,
  Phone,
  Sparkles,
  Crown,
  Flower2,
  Calendar,
  Music,
  Utensils,
  Car,
  Waves,
  Palmtree,
  Gift,
  Download,
  MessageCircle,
  Eye,
  Building,
  Plane
} from 'lucide-react'
import { toast } from 'sonner'

const Honeymoon = () => {
  const [selectedPackage, setSelectedPackage] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState('5-day')
  const bookingRef = useRef<HTMLDivElement>(null)
  const [bookingData, setBookingData] = useState({
    checkIn: '',
    packageType: 'honeymoon',
    guests: 2
  })

  const handleBookingStart = () => {
    bookingRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const handlePackageSelect = (packageName: string) => {
    setSelectedPackage(packageName)
    toast.success(`${packageName} selected! Plan your romantic celebration below.`)
    bookingRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const weddingExperiences = [
    {
      id: 'beachfront-vows',
      title: 'Beachfront Vow Renewal',
      description: 'Flower-strewn aisle on pristine sand with private officiant',
      image: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=800',
      features: ['Private beach ceremony', 'Floral aisle decoration', 'Professional officiant', 'Sunset timing']
    },
    {
      id: 'elephant-ceremony',
      title: 'Elephant-Led Ceremony',
      description: 'Traditional ceremony with decorated elephant and music ensemble',
      image: 'https://images.unsplash.com/photo-1551969014-7d2c4cddf0b6?w=800',
      features: ['Decorated elephant entrance', 'Traditional music ensemble', 'Floral saddle', 'Cultural performers']
    },
    {
      id: 'yacht-reception',
      title: 'Sunset Yacht Reception',
      description: 'Champagne toast aboard luxury yacht with live quartet',
      image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800',
      features: ['Private luxury yacht', 'Live string quartet', 'Champagne service', 'Gourmet catering']
    }
  ]

  const honeymoonRetreats = [
    {
      id: 'villa-paradise',
      title: 'Overwater Villa Paradise',
      description: 'Private plunge pool with direct ocean access',
      image: 'https://images.unsplash.com/photo-1544551763-77ef2d0cfc6c?w=800',
      features: ['Private plunge pool', 'Butler service', 'Ocean views', 'Couples spa']
    },
    {
      id: 'jungle-sanctuary',
      title: 'Jungle Tree House Sanctuary',
      description: 'Elevated luxury amidst ancient rainforest',
      image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800',
      features: ['Treetop dining', 'Wildlife viewing', 'Infinity pool', 'Spa treatments']
    },
    {
      id: 'beach-pavilion',
      title: 'Private Beach Pavilion',
      description: 'Exclusive beachfront with personal chef service',
      image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800',
      features: ['Private beach access', 'Personal chef', 'Candlelit dinners', 'Water sports']
    }
  ]

  const packageInclusions = [
    { icon: <Crown className="w-6 h-6" />, title: 'Ceremony Setup', description: 'Chairs, arch, and décor' },
    { icon: <Camera className="w-6 h-6" />, title: 'Photography & Video', description: 'Professional documentation' },
    { icon: <Flower2 className="w-6 h-6" />, title: 'Floral Arrangements', description: 'Bridal bouquet and decorations' },
    { icon: <Music className="w-6 h-6" />, title: 'Live Entertainment', description: 'Music and dance performances' },
    { icon: <Utensils className="w-6 h-6" />, title: 'Gourmet Dining', description: 'Multi-course meals and cake' },
    { icon: <Car className="w-6 h-6" />, title: 'Luxury Transport', description: 'Private transfers included' }
  ]

  const itineraries = {
    '5-day': [
      { day: 1, title: 'Arrival & Welcome', activities: 'Airport transfer, villa check-in, welcome dinner' },
      { day: 2, title: 'Beach Ceremony', activities: 'Morning spa, ceremony setup, beachfront vows, celebration dinner' },
      { day: 3, title: 'Cultural Immersion', activities: 'Temple visit, elephant sanctuary, traditional performances' },
      { day: 4, title: 'Island Adventure', activities: 'Yacht excursion, snorkeling, sunset cocktails' },
      { day: 5, title: 'Farewell', activities: 'Couples massage, departure transfers' }
    ],
    '7-day': [
      { day: 1, title: 'Grand Arrival', activities: 'VIP airport service, luxury villa, champagne reception' },
      { day: 2, title: 'Wellness Day', activities: 'Spa treatments, yoga session, healthy cuisine' },
      { day: 3, title: 'Wedding Ceremony', activities: 'Preparation, elephant-led ceremony, feast celebration' },
      { day: 4, title: 'Cultural Journey', activities: 'Ancient temples, local artisans, traditional dance' },
      { day: 5, title: 'Safari Adventure', activities: 'Wildlife park, leopard spotting, bush dinner' },
      { day: 6, title: 'Ocean Bliss', activities: 'Yacht charter, water sports, seafood BBQ' },
      { day: 7, title: 'Romantic Farewell', activities: 'Final spa session, farewell dinner, departure' }
    ],
    '10-day': [
      { day: 1, title: 'Royal Welcome', activities: 'Presidential suite check-in, private butler introduction' },
      { day: 2, title: 'Colombo Exploration', activities: 'City tour, luxury shopping, fine dining' },
      { day: 3, title: 'Hill Country Journey', activities: 'Train to Kandy, tea plantation, cultural show' },
      { day: 4, title: 'Sigiriya Adventure', activities: 'Ancient rock fortress, cave temples, village experience' },
      { day: 5, title: 'Wedding Preparation', activities: 'Rehearsal, spa day, pre-wedding celebrations' },
      { day: 6, title: 'Grand Wedding', activities: 'Elephant ceremony, traditional feast, festivities' },
      { day: 7, title: 'Beach Retreat', activities: 'Transfer to coast, overwater villa, relaxation' },
      { day: 8, title: 'Marine Safari', activities: 'Whale watching, coral diving, beach picnic' },
      { day: 9, title: 'Wellness & Romance', activities: 'Couples treatments, private dining, stargazing' },
      { day: 10, title: 'Golden Farewell', activities: 'Memory book creation, final celebrations, departure' }
    ]
  }

  const testimonials = [
    {
      couple: 'Sarah & Michael',
      quote: 'The elephant ceremony was beyond magical - truly unforgettable!',
      image: 'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?w=400'
    },
    {
      couple: 'Priya & James',
      quote: 'Our beachfront vows at sunset were absolutely perfect.',
      image: 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=400'
    },
    {
      couple: 'Emma & David',
      quote: 'The yacht reception exceeded all our dreams and expectations.',
      image: 'https://images.unsplash.com/photo-1537633552985-df8429e8048b?w=400'
    },
    {
      couple: 'Ananya & Robert',
      quote: 'Ten days of pure romance in the most beautiful settings.',
      image: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=400'
    }
  ]

  const calculatePrice = () => {
    const basePrice = bookingData.packageType === 'wedding' ? 8500 : 
                     bookingData.packageType === 'combined' ? 12000 : 3500
    return basePrice * bookingData.guests
  }

  return (
    <>
      <Helmet>
        <title>Sri Lanka Luxury Honeymoon & Wedding Packages – Beach, Elephant & Villas | Recharge Travels</title>
        <meta name="description" content="Celebrate your love with luxury beach wedding Sri Lanka, elephant ceremony, honeymoon villas, and romantic packages. Beachfront vows, cultural traditions, and exclusive retreats await." />
        <meta name="keywords" content="beach wedding Sri Lanka, elephant ceremony, honeymoon villas, luxury packages, romantic getaway, destination wedding, cultural wedding, luxury honeymoon" />
        <link rel="canonical" href={`${window.location.origin}/tours/honeymoon`} />
        
        {/* JSON-LD Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Event",
            "name": "Sri Lanka Luxury Wedding & Honeymoon Packages",
            "description": "Luxury beach and elephant wedding ceremonies with honeymoon packages in Sri Lanka",
            "location": {
              "@type": "Place",
              "name": "Sri Lanka",
              "address": "Sri Lanka"
            },
            "offers": {
              "@type": "Offer",
              "priceCurrency": "USD",
              "price": "3500",
              "availability": "https://schema.org/InStock"
            }
          })}
        </script>
      </Helmet>

      <Header />

      {/* Hero Section - Bridal Couple on Beach with Decorated Elephant */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Main Hero Background */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-r from-rose-200/60 via-champagne-200/40 to-peach-200/60 z-10"></div>
          <img 
            src="https://images.unsplash.com/photo-1519741497674-611481863552?w=1920"
            alt="Bride and groom on beach with elephant at sunset"
            className="w-full h-full object-cover animate-slow-pan"
          />
        </div>

        {/* Decorative Floating Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-15">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-dust-mote opacity-30"
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${i * 3}s`,
                animationDuration: `${20 + Math.random() * 15}s`
              }}
            >
              {i % 4 === 0 ? (
                <Heart className="w-4 h-4 text-rose-300" />
              ) : i % 4 === 1 ? (
                <Sparkles className="w-3 h-3 text-champagne-300" />
              ) : i % 4 === 2 ? (
                <Flower2 className="w-5 h-5 text-peach-300" />
              ) : (
                <Crown className="w-4 h-4 text-gold" />
              )}
            </div>
          ))}
        </div>

        {/* Palm Leaf Border Decorations */}
        <div className="absolute top-0 left-0 w-full h-20 bg-gradient-to-b from-palmtree-pattern opacity-20 z-5"></div>
        <div className="absolute bottom-0 left-0 w-full h-20 bg-gradient-to-t from-palmtree-pattern opacity-20 z-5"></div>

        {/* Hero Content */}
        <div className="relative z-20 text-center px-4 max-w-6xl mx-auto">
          <div className="animate-fade-in">
            <div className="flex justify-center items-center mb-8">
              <Flower2 className="w-12 h-12 text-peach-400 mr-4 animate-pulse" />
              <Crown className="w-16 h-16 text-gold animate-stone-glow" />
              <Flower2 className="w-12 h-12 text-peach-400 ml-4 animate-pulse" />
            </div>
            
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif font-bold text-champagne-800 mb-6 tracking-wider drop-shadow-lg">
              Celebrate Your Love
              <span className="block text-4xl md:text-5xl lg:text-6xl font-light text-peach-700 mt-4">
                in Sri Lanka
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-champagne-700 font-sans mb-12 max-w-4xl mx-auto leading-relaxed">
              Luxury Wedding & Honeymoon Packages on Beach and Safari
            </p>
            
            <Button 
              size="lg"
              onClick={handleBookingStart}
              className="bg-gradient-to-r from-peach-400 via-champagne-400 to-rose-400 text-champagne-900 hover:from-rose-400 hover:to-peach-400 font-semibold px-16 py-6 text-xl transition-all duration-300 transform hover:scale-105 rounded-full shadow-2xl border-2 border-gold/30"
              style={{
                background: 'linear-gradient(45deg, #ffd1dc, #f5deb3, #ffb6c1)',
                boxShadow: '0 8px 32px rgba(255, 215, 0, 0.3), inset 0 2px 8px rgba(255, 255, 255, 0.3)'
              }}
            >
              <Sparkles className="w-6 h-6 mr-3" />
              Explore Packages
              <ArrowRight className="w-6 h-6 ml-3" />
            </Button>
          </div>
        </div>
      </section>

      {/* Signature Wedding Experiences */}
      <section className="py-20 bg-gradient-to-b from-champagne-50 to-peach-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <div className="flex justify-center mb-6">
              <div className="w-24 h-1 bg-gradient-to-r from-peach-400 to-champagne-400"></div>
              <Crown className="w-8 h-8 text-gold mx-4" />
              <div className="w-24 h-1 bg-gradient-to-r from-champagne-400 to-peach-400"></div>
            </div>
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-champagne-800 mb-6">
              Signature Wedding Experiences
            </h2>
            <p className="text-xl text-champagne-700 max-w-3xl mx-auto font-sans">
              Choose from our collection of extraordinary ceremony experiences
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {weddingExperiences.map((experience) => (
              <Card 
                key={experience.id} 
                className="overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-4 bg-white/90 backdrop-blur-sm border-2 border-gold/20"
              >
                <div className="relative h-64 overflow-hidden">
                  <img 
                    src={experience.image} 
                    alt={experience.title}
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-champagne-900/60 to-transparent"></div>
                  <div className="absolute top-4 right-4">
                    <Badge className="bg-gold/90 text-champagne-900 font-semibold px-3 py-1">
                      <Crown className="w-3 h-3 mr-1" />
                      Signature
                    </Badge>
                  </div>
                  <div className="absolute bottom-4 left-4 right-4">
                    <h3 className="text-2xl font-serif font-bold text-white mb-2">{experience.title}</h3>
                    <p className="text-white/90 text-sm font-sans">{experience.description}</p>
                  </div>
                </div>

                <CardContent className="p-6 space-y-4">
                  <ul className="space-y-2">
                    {experience.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm font-sans">
                        <CheckCircle className="w-4 h-4 text-gold flex-shrink-0 mt-0.5" />
                        <span className="text-champagne-700">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Button 
                    onClick={() => handlePackageSelect(experience.title)}
                    className="w-full bg-gradient-to-r from-peach-400 to-champagne-400 text-champagne-900 font-semibold transition-all duration-300 hover:scale-105"
                  >
                    View Details
                    <Eye className="w-4 h-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Honeymoon Retreats Carousel */}
      <section className="py-20 bg-gradient-to-b from-peach-50 to-rose-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <div className="flex justify-center mb-6">
              <div className="w-24 h-1 bg-gradient-to-r from-rose-400 to-peach-400"></div>
              <Heart className="w-8 h-8 text-rose-500 mx-4" />
              <div className="w-24 h-1 bg-gradient-to-r from-peach-400 to-rose-400"></div>
            </div>
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-rose-800 mb-6">
              Honeymoon Retreats
            </h2>
            <p className="text-xl text-rose-700 max-w-3xl mx-auto font-sans">
              Luxury villas and over-water bungalows for ultimate romance
            </p>
          </div>

          <Carousel className="max-w-6xl mx-auto">
            <CarouselContent>
              {honeymoonRetreats.map((retreat) => (
                <CarouselItem key={retreat.id} className="md:basis-1/2 lg:basis-1/3">
                  <Card className="overflow-hidden bg-white/90 backdrop-blur-sm border-2 border-rose-200/50">
                    <div className="relative h-48 overflow-hidden">
                      <img 
                        src={retreat.image} 
                        alt={retreat.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-rose-900/50 to-transparent"></div>
                    </div>
                    <CardContent className="p-6">
                      <h3 className="text-xl font-serif font-bold text-rose-800 mb-2">{retreat.title}</h3>
                      <p className="text-rose-600 mb-4 font-sans">{retreat.description}</p>
                      <ul className="space-y-1 mb-4">
                        {retreat.features.slice(0, 2).map((feature, index) => (
                          <li key={index} className="flex items-center gap-2 text-sm">
                            <CheckCircle className="w-3 h-3 text-rose-500" />
                            <span className="text-rose-600">{feature}</span>
                          </li>
                        ))}
                      </ul>
                      <Button className="w-full bg-gradient-to-r from-rose-400 to-pink-400 text-white">
                        Check Availability
                        <Calendar className="w-4 h-4 ml-2" />
                      </Button>
                    </CardContent>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </div>
      </section>

      {/* Customizable Packages */}
      <section className="py-20 bg-gradient-to-b from-rose-50 to-champagne-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <div className="flex justify-center mb-6">
              <div className="w-24 h-1 bg-gradient-to-r from-champagne-400 to-gold"></div>
              <Gift className="w-8 h-8 text-gold mx-4" />
              <div className="w-24 h-1 bg-gradient-to-r from-gold to-champagne-400"></div>
            </div>
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-champagne-800 mb-6">
              Customizable Packages
            </h2>
            <p className="text-xl text-champagne-700 max-w-3xl mx-auto font-sans">
              Build your perfect celebration with our comprehensive services
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {packageInclusions.map((inclusion, index) => (
              <div key={index} className="text-center p-6 bg-white/80 rounded-lg border-2 border-gold/20 hover:shadow-lg transition-all">
                <div className="flex justify-center mb-4 text-gold">
                  {inclusion.icon}
                </div>
                <h3 className="text-lg font-serif font-bold text-champagne-800 mb-2">{inclusion.title}</h3>
                <p className="text-champagne-700 font-sans text-sm">{inclusion.description}</p>
              </div>
            ))}
          </div>

          <div className="text-center">
            <Button 
              size="lg"
              className="bg-gradient-to-r from-gold to-champagne-400 text-champagne-900 font-semibold px-12 py-4 text-lg transition-all duration-300 hover:scale-105"
            >
              <Gift className="w-6 h-6 mr-3" />
              Build Your Package
            </Button>
          </div>
        </div>
      </section>

      {/* Sample Itineraries */}
      <section className="py-20 bg-gradient-to-b from-champagne-50 to-peach-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <div className="flex justify-center mb-6">
              <div className="w-24 h-1 bg-gradient-to-r from-peach-400 to-champagne-400"></div>
              <MapPin className="w-8 h-8 text-peach-500 mx-4" />
              <div className="w-24 h-1 bg-gradient-to-r from-champagne-400 to-peach-400"></div>
            </div>
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-peach-800 mb-6">
              Sample Itineraries
            </h2>
            <p className="text-xl text-peach-700 max-w-3xl mx-auto font-sans">
              Carefully crafted journeys for every celebration timeline
            </p>
          </div>

          {/* Tabs */}
          <div className="flex justify-center mb-8">
            <div className="bg-white/80 rounded-full p-2 border-2 border-peach-200">
              {['5-day', '7-day', '10-day'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-6 py-3 rounded-full font-semibold transition-all ${
                    activeTab === tab 
                      ? 'bg-gradient-to-r from-peach-400 to-champagne-400 text-white shadow-lg' 
                      : 'text-peach-700 hover:bg-peach-100'
                  }`}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)} Journey
                </button>
              ))}
            </div>
          </div>

          {/* Itinerary Content */}
          <div className="max-w-4xl mx-auto">
            <div className="grid gap-4">
              {itineraries[activeTab as keyof typeof itineraries].map((day) => (
                <div key={day.day} className="bg-white/90 rounded-lg p-6 border-l-4 border-peach-400">
                  <div className="flex items-start gap-4">
                    <div className="bg-peach-400 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm">
                      {day.day}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-serif font-bold text-peach-800 text-lg mb-2">{day.title}</h3>
                      <p className="text-peach-700 font-sans">{day.activities}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="text-center mt-8">
              <Button className="bg-gradient-to-r from-peach-400 to-champagne-400 text-white font-semibold">
                <Download className="w-4 h-4 mr-2" />
                Download PDF Itinerary
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials & Gallery */}
      <section className="py-20 bg-gradient-to-b from-peach-50 to-rose-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <div className="flex justify-center mb-6">
              <div className="w-24 h-1 bg-gradient-to-r from-rose-400 to-gold"></div>
              <Camera className="w-8 h-8 text-gold mx-4" />
              <div className="w-24 h-1 bg-gradient-to-r from-gold to-rose-400"></div>
            </div>
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-rose-800 mb-6">
              Love Stories & Memories
            </h2>
            <p className="text-xl text-rose-700 max-w-3xl mx-auto font-sans">
              Real couples sharing their magical Sri Lankan celebrations
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="group cursor-pointer">
                <div className="relative overflow-hidden rounded-lg transform rotate-1 group-hover:rotate-0 transition-all duration-300 shadow-lg">
                  <img 
                    src={testimonial.image} 
                    alt={`${testimonial.couple} wedding photo`}
                    className="w-full h-64 object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="absolute bottom-4 left-4 right-4 text-white">
                      <p className="font-serif italic text-sm mb-2">"{testimonial.quote}"</p>
                      <p className="font-sans font-semibold text-xs">— {testimonial.couple}</p>
                    </div>
                  </div>
                  {/* Golden Polaroid Frame Effect */}
                  <div className="absolute -bottom-2 -left-2 -right-2 -top-2 border-4 border-gold/30 rounded-lg -z-10"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sticky Booking Engine Footer */}
      <div 
        ref={bookingRef}
        className="fixed bottom-0 left-0 right-0 z-50 bg-gradient-to-r from-champagne-800/95 to-rose-800/95 backdrop-blur-md border-t-2 border-gold/30 p-4 shadow-2xl"
      >
        <div className="container mx-auto">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="flex flex-col">
                <label className="text-xs text-champagne-200 mb-1">Check-in Date</label>
                <input
                  type="date"
                  value={bookingData.checkIn}
                  onChange={(e) => setBookingData({...bookingData, checkIn: e.target.value})}
                  className="px-3 py-2 rounded-md border border-gold/30 bg-white/90 text-champagne-900 text-sm"
                />
              </div>
              
              <div className="flex flex-col">
                <label className="text-xs text-champagne-200 mb-1">Package Type</label>
                <select
                  value={bookingData.packageType}
                  onChange={(e) => setBookingData({...bookingData, packageType: e.target.value})}
                  className="px-3 py-2 rounded-md border border-gold/30 bg-white/90 text-champagne-900 text-sm"
                >
                  <option value="honeymoon">Honeymoon</option>
                  <option value="wedding">Wedding</option>
                  <option value="combined">Combined</option>
                </select>
              </div>
              
              <div className="flex flex-col">
                <label className="text-xs text-champagne-200 mb-1">Guests</label>
                <input
                  type="number"
                  min="2"
                  max="50"
                  value={bookingData.guests}
                  onChange={(e) => setBookingData({...bookingData, guests: parseInt(e.target.value)})}
                  className="px-3 py-2 rounded-md border border-gold/30 bg-white/90 text-champagne-900 text-sm w-20"
                />
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="text-xs text-champagne-200">Starting from</div>
                <div className="text-2xl font-bold text-white">${calculatePrice().toLocaleString()}</div>
              </div>
              
              <Button 
                size="lg"
                className="bg-gradient-to-r from-gold to-champagne-400 text-champagne-900 font-bold px-8 py-3 text-lg transition-all duration-300 hover:scale-105 shadow-xl"
              >
                <Heart className="w-5 h-5 mr-2" />
                Start My Celebration
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Add bottom padding to account for sticky footer */}
      <div className="h-24"></div>

      <Footer />
    </>
  )
}

export default Honeymoon
