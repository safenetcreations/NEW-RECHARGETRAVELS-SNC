
import { useState, useRef } from 'react'
import { Helmet } from 'react-helmet-async'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Leaf, 
  Globe, 
  Heart, 
  Users,
  TreePine,
  Recycle,
  Sprout,
  MapPin,
  Clock,
  Star,
  CheckCircle,
  ArrowRight,
  Phone,
  Flower2,
  Mountain
} from 'lucide-react'
import { toast } from 'sonner'

const Ecotourism = () => {
  const [selectedTour, setSelectedTour] = useState<string | null>(null)
  const bookingRef = useRef<HTMLDivElement>(null)

  const handleBookingStart = () => {
    bookingRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const handleTourSelect = (tourName: string) => {
    setSelectedTour(tourName)
    toast.success(`${tourName} selected! Support conservation below.`)
    bookingRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const ecoExperiences = [
    {
      id: 'community-village',
      title: 'Community Village Immersion',
      description: 'Live with local families and support village development',
      duration: '5 Days / 4 Nights',
      maxGuests: 8,
      price: 320,
      impact: 'Supports 15 local families',
      features: [
        'Homestay with village families',
        'Traditional cooking classes',
        'Organic farming participation',
        'Local craft workshops',
        'Community project involvement',
        'Cultural exchange programs'
      ],
      image: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=800',
      gradient: 'from-green-600 to-emerald-600'
    },
    {
      id: 'conservation-project',
      title: 'Wildlife Conservation Project',
      description: 'Participate in elephant and leopard conservation efforts',
      duration: '7 Days / 6 Nights',
      maxGuests: 6,
      price: 480,
      impact: 'Protects 500 acres of habitat',
      features: [
        'Elephant research participation',
        'Wildlife monitoring activities',
        'Habitat restoration work',
        'Conservation education programs',
        'Anti-poaching patrol support',
        'Scientific data collection'
      ],
      image: 'https://images.unsplash.com/photo-1549366021-9f761d040a94?w=800',
      gradient: 'from-emerald-600 to-teal-600'
    },
    {
      id: 'rainforest-restoration',
      title: 'Rainforest Restoration Camp',
      description: 'Help restore Sri Lanka\'s ancient rainforest ecosystems',
      duration: '6 Days / 5 Nights',
      maxGuests: 10,
      price: 380,
      impact: 'Plants 200 native trees',
      features: [
        'Tree planting activities',
        'Endemic species monitoring',
        'Stream restoration work',
        'Eco-lodge accommodation',
        'Guided nature walks',
        'Environmental education'
      ],
      image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800',
      gradient: 'from-green-700 to-lime-600'
    }
  ]

  return (
    <>
      <Helmet>
        <title>Eco-Tourism Sri Lanka - Sustainable Travel & Conservation Projects | Recharge Travels</title>
        <meta name="description" content="Sustainable travel experiences supporting conservation and local communities in Sri Lanka. Make a positive impact while exploring." />
      </Helmet>
      
      <Header />

      {/* Cinematic Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-r from-green-900/90 via-emerald-900/70 to-transparent z-10"></div>
          <img 
            src="https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1920"
            alt="Rainforest Conservation"
            className="w-full h-full object-cover animate-slow-pan"
          />
        </div>

        {/* Floating Nature Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(12)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-dust-mote opacity-40"
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${i * 2}s`,
                animationDuration: `${12 + Math.random() * 8}s`
              }}
            >
              <Leaf className="w-6 h-6 text-green-300" />
            </div>
          ))}
        </div>

        {/* Hero Content */}
        <div className="relative z-20 text-center px-4 max-w-6xl mx-auto">
          <div className="animate-fade-in">
            <div className="flex justify-center items-center mb-8">
              <TreePine className="w-16 h-16 text-green-300 mr-4 animate-bounce" />
              <Globe className="w-20 h-20 text-white animate-stone-glow" />
              <Sprout className="w-16 h-16 text-green-300 ml-4 animate-pulse" />
            </div>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-cinzel font-bold text-white mb-6 tracking-wider">
              ECO
              <span className="block text-green-300 animate-copper-glow">TOURISM</span>
              <span className="block text-2xl md:text-3xl lg:text-4xl font-light opacity-90">
                Travel That Makes a Difference
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-white/90 font-montserrat mb-12 max-w-4xl mx-auto leading-relaxed">
              Experience Sri Lanka's natural wonders while actively contributing to conservation efforts 
              and supporting local communities through sustainable tourism practices.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Button 
                size="lg"
                onClick={handleBookingStart}
                className="bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:from-emerald-500 hover:to-green-500 font-semibold px-12 py-4 text-lg transition-all duration-300 transform hover:scale-105"
              >
                <Heart className="w-6 h-6 mr-3" />
                Start Sustainable Journey
                <ArrowRight className="w-6 h-6 ml-3" />
              </Button>
              <Button 
                variant="outline"
                size="lg"
                className="border-2 border-white text-white hover:bg-white hover:text-green-600 font-semibold px-8 py-4 text-lg transition-all duration-300"
              >
                <Phone className="w-5 h-5 mr-2" />
                Learn About Impact
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Conservation Impact */}
      <section className="py-20 bg-gradient-to-b from-green-900 to-emerald-900 text-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-cinzel font-bold text-green-300 mb-6">
              Your Impact on Conservation
            </h2>
            <p className="text-xl text-white/90 max-w-4xl mx-auto font-montserrat leading-relaxed">
              Every eco-tourism experience directly supports conservation efforts and sustainable development
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <Users className="w-12 h-12 text-blue-400" />,
                title: 'Community Empowerment',
                description: 'Direct income to local families through homestays, guided tours, and craft sales, creating sustainable livelihoods'
              },
              {
                icon: <TreePine className="w-12 h-12 text-green-400" />,
                title: 'Habitat Protection',
                description: 'Tourism revenue funds protected area management, anti-poaching efforts, and ecosystem restoration projects'
              },
              {
                icon: <Recycle className="w-12 h-12 text-yellow-400" />,
                title: 'Sustainable Practices',
                description: 'Zero-waste tourism, renewable energy use, and local resource conservation reducing environmental footprint'
              }
            ].map((impact, index) => (
              <Card key={index} className="bg-green-800/30 border-green-300/30 text-white text-center hover:shadow-2xl transition-all duration-300 hover:-translate-y-4">
                <CardContent className="p-8">
                  <div className="flex justify-center mb-6">
                    {impact.icon}
                  </div>
                  <h3 className="text-2xl font-cinzel font-bold text-green-300 mb-4">{impact.title}</h3>
                  <p className="text-white/80 font-montserrat leading-relaxed">{impact.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Eco Experiences */}
      <section className="py-20 bg-gradient-to-b from-green-50 to-emerald-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-cinzel font-bold text-green-900 mb-6">
              Sustainable Travel Experiences
            </h2>
            <p className="text-xl text-green-800 max-w-3xl mx-auto font-montserrat">
              Meaningful adventures that protect nature and empower communities
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {ecoExperiences.map((experience) => (
              <Card 
                key={experience.id} 
                className="overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-4 bg-white border-2 border-green-200"
              >
                <div className="relative h-64 overflow-hidden">
                  <img 
                    src={experience.image} 
                    alt={experience.title}
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                  />
                  <div className={`absolute inset-0 bg-gradient-to-t ${experience.gradient} opacity-60`}></div>
                  <div className="absolute top-4 right-4">
                    <Badge className="bg-green-500 text-white font-semibold px-3 py-1">
                      <Leaf className="w-3 h-3 mr-1" />
                      Eco-Friendly
                    </Badge>
                  </div>
                  <div className="absolute bottom-4 left-4 right-4">
                    <h3 className="text-2xl font-cinzel font-bold text-white mb-2">{experience.title}</h3>
                    <p className="text-white/90 text-sm font-montserrat">{experience.description}</p>
                  </div>
                </div>

                <CardContent className="p-6 space-y-4">
                  <div className="flex items-center justify-between text-sm text-green-700">
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      {experience.duration}
                    </div>
                    <div className="flex items-center">
                      <Users className="w-4 h-4 mr-1" />
                      Up to {experience.maxGuests} guests
                    </div>
                  </div>

                  <div className="bg-green-100 p-3 rounded-lg border-l-4 border-green-500">
                    <p className="text-green-800 font-semibold text-sm">
                      <Globe className="w-4 h-4 inline mr-2" />
                      Impact: {experience.impact}
                    </p>
                  </div>

                  <ul className="space-y-2">
                    {experience.features.slice(0, 4).map((feature, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm font-montserrat">
                        <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="border-t pt-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="text-3xl font-bold text-green-900">
                        ${experience.price}
                        <span className="text-sm font-normal text-slate-500">/person</span>
                      </div>
                      <div className="flex items-center text-yellow-500">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-current" />
                        ))}
                      </div>
                    </div>
                    <Button 
                      onClick={() => handleTourSelect(experience.title)}
                      className={`w-full bg-gradient-to-r ${experience.gradient} text-white font-semibold transition-all duration-300 hover:scale-105`}
                    >
                      Join Conservation Effort
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Booking Section */}
      <section ref={bookingRef} className="py-20 bg-gradient-to-r from-green-600 to-emerald-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <Globe className="w-16 h-16 text-green-300 mx-auto mb-8 animate-stone-glow" />
          <h2 className="text-4xl md:text-5xl font-cinzel font-bold mb-6">
            Travel with Purpose
          </h2>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto font-montserrat">
            Join us in creating positive change through responsible and sustainable tourism
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Button 
              size="lg"
              className="bg-white text-green-600 hover:bg-gray-100 font-semibold px-8 py-4 text-lg transition-all duration-300 transform hover:scale-105"
            >
              <Phone className="w-5 h-5 mr-2" />
              Plan Eco Adventure
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              className="border-2 border-white text-white hover:bg-white hover:text-green-600 font-semibold px-8 py-4 text-lg transition-all duration-300"
            >
              <Mountain className="w-5 h-5 mr-2" />
              View Impact Projects
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </>
  )
}

export default Ecotourism
