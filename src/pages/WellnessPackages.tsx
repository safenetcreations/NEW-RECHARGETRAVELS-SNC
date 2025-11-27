
import { useState, useRef } from 'react'
import { Helmet } from 'react-helmet-async'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Flower2, 
  Waves, 
  Leaf, 
  Heart, 
  Sparkles,
  Clock,
  Users,
  Star,
  CheckCircle,
  ArrowRight,
  Phone,
  TreePine,
  Sun,
  Moon,
  Flower,
  Zap
} from 'lucide-react'
import { toast } from 'sonner'

const WellnessPackages = () => {
  const [selectedPackage, setSelectedPackage] = useState<string | null>(null)
  const bookingRef = useRef<HTMLDivElement>(null)

  const handleBookingStart = () => {
    bookingRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const handlePackageSelect = (packageName: string) => {
    setSelectedPackage(packageName)
    toast.success(`${packageName} selected! Begin your wellness transformation below.`)
    bookingRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const wellnessPackages = [
    {
      id: 'ayurveda-sanctuary',
      title: 'Ayurvedic Healing Sanctuary',
      description: 'Ancient healing wisdom meets modern luxury wellness',
      duration: '10 Days / 9 Nights',
      maxGuests: 6,
      price: 1850,
      features: [
        'Personal Ayurvedic physician consultation',
        'Traditional Panchakarma detox treatments',
        'Herbal steam baths and oil therapies',
        'Yoga and meditation sessions',
        'Organic sattvic cuisine program',
        'Luxury wellness resort accommodation'
      ],
      image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=800',
      gradient: 'from-emerald-600 to-teal-600',
      theme: 'healing'
    },
    {
      id: 'spa-paradise',
      title: 'Luxury Spa Paradise',
      description: 'Indulgent spa treatments in tropical wellness sanctuaries',
      duration: '7 Days / 6 Nights',
      maxGuests: 8,
      price: 1280,
      features: [
        'Daily signature spa treatments',
        'Hot stone and aromatherapy massages',
        'Tropical fruit and flower baths',
        'Infinity pool meditation sessions',
        'Wellness chef-prepared cuisine',
        'Private meditation pavilions'
      ],
      image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800',
      gradient: 'from-pink-500 to-rose-500',
      theme: 'luxury'
    },
    {
      id: 'mindfulness-retreat',
      title: 'Mindfulness & Inner Peace Retreat',
      description: 'Spiritual awakening through meditation and mindfulness',
      duration: '5 Days / 4 Nights',
      maxGuests: 12,
      price: 750,
      features: [
        'Buddhist monastery meditation sessions',
        'Vipassana and mindfulness training',
        'Silent contemplation periods',
        'Dharma teachings with monks',
        'Temple ceremony participation',
        'Digital detox immersion'
      ],
      image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800',
      gradient: 'from-purple-600 to-indigo-600',
      theme: 'spiritual'
    }
  ]

  return (
    <>
      <Helmet>
        <title>Wellness Retreats Sri Lanka - Ayurveda, Spa & Mindfulness Journeys | Recharge Travels</title>
        <meta name="description" content="Transform your wellbeing with authentic Sri Lankan wellness experiences. Ayurvedic healing, luxury spa treatments, and mindfulness retreats in serene natural settings." />
        <meta name="keywords" content="Sri Lanka wellness retreats, Ayurveda treatments, luxury spa packages, mindfulness meditation, detox programs, spiritual healing" />
        <link rel="canonical" href={`${window.location.origin}/experiences/wellness`} />
      </Helmet>
      
      <Header />

      {/* Cinematic Wellness Sanctuary Hero */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Serene Garden Background */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-900/85 via-teal-900/70 to-transparent z-10"></div>
          <img 
            src="https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=1920"
            alt="Serene Wellness Garden"
            className="w-full h-full object-cover animate-slow-pan"
          />
        </div>

        {/* Floating Lotus Petals and Healing Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-15">
          {[...Array(15)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-dust-mote opacity-40"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${i * 2}s`,
                animationDuration: `${18 + Math.random() * 12}s`
              }}
            >
              {i % 4 === 0 ? (
                <Flower2 className="w-8 h-8 text-pink-300" />
              ) : i % 4 === 1 ? (
                <Leaf className="w-6 h-6 text-emerald-300" />
              ) : i % 4 === 2 ? (
                <Sparkles className="w-5 h-5 text-yellow-300" />
              ) : (
                <div className="w-6 h-6 rounded-full bg-white/30 animate-pulse" />
              )}
            </div>
          ))}
        </div>

        {/* Hero Content */}
        <div className="relative z-20 text-center px-4 max-w-6xl mx-auto">
          <div className="animate-fade-in">
            <div className="flex justify-center items-center mb-8">
              <Sun className="w-16 h-16 text-yellow-300 mr-4 animate-pulse" />
              <Flower2 className="w-24 h-24 text-white animate-stone-glow" />
              <Moon className="w-16 h-16 text-blue-300 ml-4 animate-pulse" />
            </div>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-cinzel font-bold text-white mb-6 tracking-wider">
              WELLNESS
              <span className="block text-emerald-300 animate-copper-glow">SANCTUARY</span>
              <span className="block text-2xl md:text-3xl lg:text-4xl font-light opacity-90">
                Ancient Healing, Modern Luxury
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-white/90 font-montserrat mb-12 max-w-4xl mx-auto leading-relaxed">
              Embark on a transformative journey of healing and renewal. Experience authentic Ayurvedic wisdom, 
              luxury spa treatments, and mindful living in Sri Lanka's most serene wellness sanctuaries.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Button 
                size="lg"
                onClick={handleBookingStart}
                className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white hover:from-teal-500 hover:to-emerald-500 font-semibold px-12 py-4 text-lg transition-all duration-300 transform hover:scale-105 shadow-xl"
              >
                <Heart className="w-6 h-6 mr-3" />
                Begin Wellness Journey
                <ArrowRight className="w-6 h-6 ml-3" />
              </Button>
              <Button 
                variant="outline"
                size="lg"
                className="border-2 border-white text-white hover:bg-white hover:text-emerald-600 font-semibold px-8 py-4 text-lg transition-all duration-300"
              >
                <Phone className="w-5 h-5 mr-2" />
                Wellness Consultation
              </Button>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce text-white z-20">
          <div className="flex flex-col items-center">
            <span className="text-sm font-montserrat mb-2 opacity-80">Discover Healing</span>
            <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center">
              <div className="w-1 h-3 bg-white rounded-full mt-2 animate-pulse"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Wellness Philosophy - 5000 Years of Healing */}
      <section className="py-20 bg-gradient-to-b from-emerald-900 to-teal-900 text-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Flower2 className="w-16 h-16 text-emerald-300 mx-auto mb-8 animate-pulse" />
            <h2 className="text-4xl md:text-5xl font-cinzel font-bold text-emerald-300 mb-6">
              5,000 Years of Healing Wisdom
            </h2>
            <p className="text-xl text-white/90 max-w-4xl mx-auto font-montserrat leading-relaxed">
              Sri Lanka's ancient wellness traditions, rooted in Ayurveda and Buddhist mindfulness, 
              offer profound healing for mind, body, and spirit in the modern world.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <Sun className="w-12 h-12 text-yellow-400" />,
                title: 'Ayurvedic Medicine',
                description: 'Personalized treatments based on your unique constitution (dosha) using ancient herbal wisdom and therapeutic practices',
                benefits: ['Detoxification', 'Stress Relief', 'Immunity Boost', 'Energy Balance']
              },
              {
                icon: <Waves className="w-12 h-12 text-blue-400" />,
                title: 'Therapeutic Treatments',
                description: 'Traditional massage techniques, herbal steam baths, and oil therapies designed to restore physical and mental harmony',
                benefits: ['Muscle Relief', 'Circulation', 'Skin Health', 'Mental Clarity']
              },
              {
                icon: <Moon className="w-12 h-12 text-purple-400" />,
                title: 'Mindful Living',
                description: 'Buddhist meditation practices, yoga, and mindfulness techniques for lasting inner peace and spiritual growth',
                benefits: ['Mental Peace', 'Emotional Balance', 'Spiritual Growth', 'Life Purpose']
              }
            ].map((philosophy, index) => (
              <Card key={index} className="bg-emerald-800/30 border-emerald-300/30 text-white hover:shadow-2xl transition-all duration-300 hover:-translate-y-4">
                <CardContent className="p-8 text-center">
                  <div className="flex justify-center mb-6">
                    {philosophy.icon}
                  </div>
                  <h3 className="text-2xl font-cinzel font-bold text-emerald-300 mb-4">{philosophy.title}</h3>
                  <p className="text-white/80 font-montserrat leading-relaxed mb-6">{philosophy.description}</p>
                  <div className="grid grid-cols-2 gap-2">
                    {philosophy.benefits.map((benefit, idx) => (
                      <Badge key={idx} className="bg-emerald-700/50 text-emerald-100 text-xs">
                        {benefit}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Wellness Packages */}
      <section className="py-20 bg-gradient-to-b from-emerald-50 to-teal-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-cinzel font-bold text-emerald-900 mb-6">
              Transformative Wellness Experiences
            </h2>
            <p className="text-xl text-emerald-800 max-w-3xl mx-auto font-montserrat">
              Choose your path to healing and renewal with our authentic wellness programs
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {wellnessPackages.map((pkg) => (
              <Card 
                key={pkg.id} 
                className="overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-4 bg-white border-2 border-emerald-200 group"
              >
                <div className="relative h-72 overflow-hidden">
                  <img 
                    src={pkg.image} 
                    alt={pkg.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className={`absolute inset-0 bg-gradient-to-t ${pkg.gradient} opacity-70`}></div>
                  
                  {/* Floating Badge */}
                  <div className="absolute top-4 right-4">
                    <Badge className="bg-white/95 text-emerald-800 font-semibold px-3 py-1 shadow-lg">
                      <Zap className="w-3 h-3 mr-1" />
                      {pkg.theme === 'healing' ? 'Healing' : pkg.theme === 'luxury' ? 'Luxury' : 'Spiritual'}
                    </Badge>
                  </div>
                  
                  {/* Content Overlay */}
                  <div className="absolute bottom-4 left-4 right-4">
                    <h3 className="text-2xl font-cinzel font-bold text-white mb-2 drop-shadow-lg">{pkg.title}</h3>
                    <p className="text-white/95 text-sm font-montserrat drop-shadow">{pkg.description}</p>
                  </div>
                  
                  {/* Animated Overlay on Hover */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>

                <CardContent className="p-6 space-y-4">
                  <div className="flex items-center justify-between text-sm text-emerald-700">
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      {pkg.duration}
                    </div>
                    <div className="flex items-center">
                      <Users className="w-4 h-4 mr-1" />
                      Up to {pkg.maxGuests} guests
                    </div>
                  </div>

                  <ul className="space-y-2.5">
                    {pkg.features.slice(0, 4).map((feature, index) => (
                      <li key={index} className="flex items-start gap-2.5 text-sm font-montserrat">
                        <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                    {pkg.features.length > 4 && (
                      <li className="text-xs text-emerald-600 font-medium">
                        +{pkg.features.length - 4} more healing experiences...
                      </li>
                    )}
                  </ul>

                  <div className="border-t border-emerald-100 pt-6">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <div className="text-3xl font-bold text-emerald-900">
                          ${pkg.price}
                        </div>
                        <span className="text-sm text-gray-500">per person</span>
                      </div>
                      <div className="flex items-center text-yellow-500">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-current" />
                        ))}
                      </div>
                    </div>
                    <Button 
                      onClick={() => handlePackageSelect(pkg.title)}
                      className={`w-full bg-gradient-to-r ${pkg.gradient} text-white font-semibold transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl`}
                    >
                      Begin Transformation
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
      <section ref={bookingRef} className="py-20 bg-gradient-to-r from-emerald-600 to-teal-600 text-white relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='4'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}></div>
        </div>
        
        <div className="container mx-auto px-4 text-center relative z-10">
          <Flower2 className="w-16 h-16 text-emerald-300 mx-auto mb-8 animate-pulse" />
          <h2 className="text-4xl md:text-5xl font-cinzel font-bold mb-6">
            Begin Your Healing Journey
          </h2>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto font-montserrat leading-relaxed">
            Transform your life through ancient wisdom and modern wellness practices. 
            Your journey to optimal wellbeing starts here.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Button 
              size="lg"
              className="bg-white text-emerald-600 hover:bg-emerald-50 font-semibold px-8 py-4 text-lg transition-all duration-300 transform hover:scale-105 shadow-xl"
            >
              <Phone className="w-5 h-5 mr-2" />
              Book Wellness Retreat
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              className="border-2 border-white text-white hover:bg-white hover:text-emerald-600 font-semibold px-8 py-4 text-lg transition-all duration-300"
            >
              <TreePine className="w-5 h-5 mr-2" />
              Explore All Programs
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </>
  )
}

export default WellnessPackages
