
import { useState, useRef } from 'react'
import { Helmet } from 'react-helmet-async'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Camera, 
  Aperture,
  Focus,
  Image,
  MapPin, 
  Clock, 
  Users, 
  Star,
  CheckCircle,
  ArrowRight,
  Zap,
  Sun,
  Moon,
  Mountain
} from 'lucide-react'
import { toast } from 'sonner'

const Photography = () => {
  const [selectedTour, setSelectedTour] = useState<string | null>(null)
  const bookingRef = useRef<HTMLDivElement>(null)

  const handleBookingStart = () => {
    bookingRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const handleTourSelect = (tourName: string) => {
    setSelectedTour(tourName)
    toast.success(`${tourName} selected! Complete your booking below.`)
    bookingRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const photographyTours = [
    {
      id: 'cultural-temples',
      title: 'Cultural & Temple Photography',
      description: 'Capture sacred architecture and ancient traditions',
      duration: '4-6 days',
      skillLevel: 'All Levels',
      price: 280,
      locations: 'Kandy, Anuradhapura, Polonnaruwa',
      highlights: [
        'Golden hour temple photography',
        'Traditional ceremony documentation',
        'Architectural detail workshops',
        'Local portrait sessions',
        'Post-processing tutorials'
      ],
      image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800',
      gradient: 'from-orange-600 to-red-600'
    },
    {
      id: 'wildlife-nature',
      title: 'Wildlife & Nature Photography',
      description: 'Leopards, elephants, and exotic birds in their habitat',
      duration: '3-5 days',
      skillLevel: 'Intermediate',
      price: 350,
      locations: 'Yala, Wilpattu, Udawalawe',
      highlights: [
        'Big cat tracking techniques',
        'Bird photography masterclass',
        'Telephoto lens workshops',
        'Wildlife behavior insights',
        'Night photography sessions'
      ],
      image: 'https://images.unsplash.com/photo-1549366021-9f761d040a94?w=800',
      gradient: 'from-green-600 to-emerald-600'
    },
    {
      id: 'scenic-trains',
      title: 'Scenic Train Journey Photography',
      description: 'Tea plantations and mountain vistas from iconic railways',
      duration: '2-3 days',
      skillLevel: 'Beginner',
      price: 180,
      locations: 'Ella, Nuwara Eliya, Kandy',
      highlights: [
        'Train composition techniques',
        'Landscape photography basics',
        'Tea plantation portraits',
        'Mountain vista captures',
        'Travel photography tips'
      ],
      image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=800',
      gradient: 'from-blue-600 to-cyan-600'
    },
    {
      id: 'street-local',
      title: 'Street & Local Life Photography',
      description: 'Urban culture and authentic moments',
      duration: '3-4 days',
      skillLevel: 'All Levels',
      price: 220,
      locations: 'Colombo, Galle, Negombo',
      highlights: [
        'Market photography ethics',
        'Candid street techniques',
        'Cultural sensitivity training',
        'Urban composition skills',
        'People photography workshops'
      ],
      image: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=800',
      gradient: 'from-purple-600 to-pink-600'
    }
  ]

  return (
    <>
      <Helmet>
        <title>Photography Tours Sri Lanka - Temples, Wildlife, Trains & Street Life | Recharge Travels</title>
        <meta name="description" content="Professional photography tours in Sri Lanka. Capture temples, wildlife, scenic trains, and street life with expert guides and premium equipment rental." />
        <meta name="keywords" content="Sri Lanka photography tours, temple photography, wildlife photography, train photography, street photography, camera rental" />
      </Helmet>

      <Header />

      {/* Cinematic Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-transparent z-10"></div>
          <img 
            src="https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=1920"
            alt="Photography in Sri Lanka"
            className="w-full h-full object-cover animate-slow-pan"
          />
        </div>

        {/* Floating Camera Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-dust-mote opacity-30"
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${i * 3}s`,
                animationDuration: `${12 + Math.random() * 8}s`
              }}
            >
              <Camera className="w-8 h-8 text-white" />
            </div>
          ))}
        </div>

        {/* Hero Content */}
        <div className="relative z-20 text-center px-4 max-w-6xl mx-auto">
          <div className="animate-fade-in">
            <div className="flex justify-center items-center mb-8">
              <Aperture className="w-16 h-16 text-white mr-4 animate-spin-slow" />
              <Camera className="w-20 h-20 text-white animate-pulse" />
              <Focus className="w-16 h-16 text-white ml-4 animate-ping" />
            </div>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-cinzel font-bold text-white mb-6 tracking-wider">
              CAPTURE
              <span className="block text-yellow-400">SRI LANKA</span>
              <span className="block text-2xl md:text-3xl lg:text-4xl font-light opacity-90">
                From Sacred Stones to City Streets
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-white/90 font-montserrat mb-12 max-w-4xl mx-auto leading-relaxed">
              Professional photography tours combining expert guidance, premium equipment, 
              and access to Sri Lanka's most photogenic locations.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Button 
                size="lg"
                onClick={handleBookingStart}
                className="bg-gradient-to-r from-yellow-500 to-orange-500 text-black hover:from-orange-500 hover:to-yellow-500 font-semibold px-12 py-4 text-lg transition-all duration-300 transform hover:scale-105"
              >
                <Camera className="w-6 h-6 mr-3" />
                Explore Photo Tours
                <ArrowRight className="w-6 h-6 ml-3" />
              </Button>
              <Button 
                variant="outline"
                size="lg"
                className="border-2 border-white text-white hover:bg-white hover:text-black font-semibold px-8 py-4 text-lg transition-all duration-300"
              >
                <Image className="w-5 h-5 mr-2" />
                View Gallery
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Photography Categories */}
      <section className="py-20 bg-gradient-to-b from-slate-900 to-slate-800">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-cinzel font-bold text-white mb-6">
              Photography Tour Categories
            </h2>
            <p className="text-xl text-white/80 max-w-3xl mx-auto font-montserrat">
              Specialized tours designed for different photography interests and skill levels
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {[
              { icon: <Sun className="w-8 h-8" />, title: 'Golden Hour', desc: 'Temple & landscape magic' },
              { icon: <Moon className="w-8 h-8" />, title: 'Night Photography', desc: 'Stars & urban lights' },
              { icon: <Mountain className="w-8 h-8" />, title: 'Landscape', desc: 'Mountains & coastlines' },
              { icon: <Zap className="w-8 h-8" />, title: 'Action Shots', desc: 'Wildlife & street life' }
            ].map((category, index) => (
              <Card key={index} className="bg-slate-800/50 border-yellow-400/20 text-white text-center hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
                <CardContent className="p-6">
                  <div className="text-yellow-400 mb-4 flex justify-center">
                    {category.icon}
                  </div>
                  <h3 className="font-cinzel font-semibold text-lg mb-2">{category.title}</h3>
                  <p className="text-white/70 text-sm font-montserrat">{category.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Photography Tours */}
      <section className="py-20 bg-gradient-to-b from-amber-50 to-orange-50">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-8">
            {photographyTours.map((tour) => (
              <Card 
                key={tour.id} 
                className="overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 bg-white"
              >
                <div className="relative h-64 overflow-hidden">
                  <img 
                    src={tour.image} 
                    alt={tour.title}
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                  />
                  <div className={`absolute inset-0 bg-gradient-to-t ${tour.gradient} opacity-60`}></div>
                  <div className="absolute top-4 right-4">
                    <Badge className="bg-white/90 text-black font-semibold">
                      {tour.skillLevel}
                    </Badge>
                  </div>
                  <div className="absolute bottom-4 left-4 text-white">
                    <h3 className="text-2xl font-cinzel font-bold mb-2">{tour.title}</h3>
                    <p className="text-white/90 font-montserrat">{tour.description}</p>
                  </div>
                </div>

                <CardContent className="p-6 space-y-4">
                  <div className="flex items-center justify-between text-sm text-slate-600">
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      {tour.duration}
                    </div>
                    <div className="flex items-center">
                      <MapPin className="w-4 h-4 mr-1" />
                      {tour.locations}
                    </div>
                  </div>

                  <ul className="space-y-2">
                    {tour.highlights.slice(0, 3).map((highlight, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm font-montserrat">
                        <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                        <span>{highlight}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="border-t pt-4">
                    <div className="flex items-center justify-between mb-4">
                      <div className="text-2xl font-bold text-slate-900">
                        ${tour.price}
                        <span className="text-sm font-normal text-slate-500">/person</span>
                      </div>
                      <div className="flex items-center text-yellow-500">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-current" />
                        ))}
                      </div>
                    </div>
                    <Button 
                      onClick={() => handleTourSelect(tour.title)}
                      className="w-full bg-gradient-to-r from-slate-800 to-slate-700 text-white hover:from-slate-700 hover:to-slate-600 font-semibold transition-all duration-300 hover:scale-105"
                    >
                      <Camera className="w-4 h-4 mr-2" />
                      Book This Tour
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Equipment & Services */}
      <section className="py-20 bg-gradient-to-r from-slate-900 to-slate-800 text-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Camera className="w-16 h-16 text-yellow-400 mx-auto mb-8" />
            <h2 className="text-4xl md:text-5xl font-cinzel font-bold text-yellow-400 mb-6">
              Professional Equipment & Services
            </h2>
            <p className="text-xl text-white/80 max-w-3xl mx-auto font-montserrat">
              Premium gear rental and expert guidance included with every tour
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: 'Premium Camera Gear',
                items: ['Canon & Nikon DSLR/Mirrorless', 'Professional telephoto lenses', 'Tripods & stabilizers', 'Drone photography equipment']
              },
              {
                title: 'Expert Guidance',
                items: ['Professional photographer guides', 'Technical workshops', 'Composition masterclasses', 'Post-processing tutorials']
              },
              {
                title: 'Additional Services',
                items: ['Image editing sessions', 'Portfolio reviews', 'Print services available', 'Social media optimization']
              }
            ].map((service, index) => (
              <Card key={index} className="bg-slate-800/50 border-yellow-400/20 text-white">
                <CardHeader>
                  <CardTitle className="text-yellow-400 font-cinzel">{service.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {service.items.map((item, i) => (
                      <li key={i} className="flex items-center gap-2 font-montserrat">
                        <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
                        <span className="text-sm">{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Booking Section */}
      <section ref={bookingRef} className="py-20 bg-gradient-to-r from-yellow-600 to-orange-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <Aperture className="w-16 h-16 text-white mx-auto mb-8 animate-spin-slow" />
          <h2 className="text-4xl md:text-5xl font-cinzel font-bold mb-6">
            Ready to Capture Sri Lanka?
          </h2>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto font-montserrat">
            Join our photography tours and return home with stunning images and enhanced skills
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Button 
              size="lg"
              className="bg-white text-orange-600 hover:bg-gray-100 font-semibold px-8 py-4 text-lg transition-all duration-300 transform hover:scale-105"
            >
              <Camera className="w-5 h-5 mr-2" />
              Book Photography Tour
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              className="border-2 border-white text-white hover:bg-white hover:text-orange-600 font-semibold px-8 py-4 text-lg transition-all duration-300"
            >
              <Image className="w-5 h-5 mr-2" />
              View Sample Gallery
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </>
  )
}

export default Photography
