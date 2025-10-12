
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Mountain, 
  Clock, 
  Users, 
  Star, 
  Calendar, 
  ArrowRight, 
  MapPin, 
  TreePine, 
  Camera, 
  Coffee,
  Train,
  Waves,
  Flower,
  Snowflake,
  Leaf,
  Crown,
  Home
} from 'lucide-react'
import SEOHead from '@/components/cms/SEOHead'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

const HillCountryTours = () => {
  const [selectedCategory, setSelectedCategory] = useState('all')

  const signatureExperiences = [
    {
      id: 'private-tea-tasting',
      title: 'Private Tea Tasting with Estate Master',
      description: 'Exclusive sessions with master tea makers at century-old plantations',
      duration: '3 Hours',
      price: '$280',
      rating: 4.9,
      image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400',
      highlights: ['Estate master guidance', 'Private tasting room', 'Tea blending workshop', 'Plantation history'],
      category: 'premium'
    },
    {
      id: 'sunrise-horton-plains',
      title: 'Sunrise Horton Plains Luxury Hike',
      description: 'Private guided trek to Worlds End with gourmet breakfast service',
      duration: '6 Hours',
      price: '$340',
      rating: 4.9,
      image: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400',
      highlights: ['Private guide', 'Gourmet breakfast', 'Worlds End viewing', 'Photography support'],
      category: 'premium'
    },
    {
      id: 'luxury-vintage-train',
      title: 'Luxury Vintage Train Ride through Ella',
      description: 'First-class heritage rail journey with fine dining and scenic views',
      duration: '4 Hours',
      price: '$420',
      rating: 4.8,
      image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400',
      highlights: ['First-class carriages', 'Fine dining service', 'Panoramic windows', 'Heritage experience'],
      category: 'premium'
    }
  ]

  const premiumStays = [
    {
      id: 'tea-estate-bungalow',
      name: 'Heritage Tea Estate Bungalow',
      location: 'Nuwara Eliya',
      rate: '$450/night',
      image: 'https://images.unsplash.com/photo-1578761537730-a6eb9c4c5e8c?w=400',
      amenities: ['Private tea garden', 'Butler service', 'Vintage furnishings', 'Mountain views']
    },
    {
      id: 'colonial-manor',
      name: 'Colonial Hill Manor Retreat',
      location: 'Ella',
      rate: '$380/night', 
      image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400',
      amenities: ['Historic architecture', 'Fine dining', 'Spa services', 'Golf course access']
    },
    {
      id: 'plantation-villa',
      name: 'Luxury Plantation Villa',
      location: 'Haputale',
      rate: '$520/night',
      image: 'https://images.unsplash.com/photo-1578761537730-a6eb9c4c5e8c?w=400',
      amenities: ['Private chef', 'Infinity pool', 'Tea ceremony room', 'Valley views']
    }
  ]

  const scenicRoutes = [
    {
      id: 'ella-rock-sunrise',
      title: 'Ella Rock Sunrise Trek & Estate Breakfast',
      description: 'Dawn hike followed by gourmet breakfast at tea estate',
      image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400',
      duration: '5 hours',
      highlights: ['Sunrise views', 'Gourmet breakfast', 'Tea estate tour']
    },
    {
      id: 'labookellie-waterfall',
      title: 'Labookellie Tea Factory & Waterfall Lunch',
      description: 'Factory tour with cascading waterfall dining experience',
      image: 'https://images.unsplash.com/photo-1578761537730-a6eb9c4c5e8c?w=400',
      duration: '4 hours',
      highlights: ['Factory tour', 'Waterfall dining', 'Tea tasting']
    },
    {
      id: 'nuwara-eliya-golf',
      title: 'Nuwara Eliya Golf & High Tea Colonial Experience',
      description: 'Championship golf followed by traditional high tea service',
      image: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400',
      duration: '6 hours',
      highlights: ['Golf round', 'High tea', 'Colonial club']
    },
    {
      id: 'haputale-sunset',
      title: 'Haputale Edge-of-the-World Sunset Viewing',
      description: 'Exclusive sunset experience at the dramatic cliff edge',
      image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400',
      duration: '3 hours',
      highlights: ['Cliff views', 'Sunset cocktails', 'Photography']
    }
  ]

  const luxuryItineraries = [
    {
      id: 'highland-haven',
      title: '2-Day Highland Tea Haven Retreat',
      description: 'Intimate tea estate experience with luxury accommodation',
      duration: '2 Days',
      price: '$850',
      highlights: ['Tea estate bungalow', 'Private tastings', 'Scenic railways', 'Gourmet dining']
    },
    {
      id: 'tea-trains-odyssey',
      title: '4-Day Tea & Trains Luxury Odyssey',
      description: 'Complete hill country journey combining estates and heritage railways',
      duration: '4 Days', 
      price: '$1,680',
      highlights: ['Multiple estates', 'First-class trains', 'Colonial hotels', 'Private guides']
    },
    {
      id: 'misty-mountains',
      title: '6-Day Misty Mountains & Estate Waterfalls Journey',
      description: 'Grand tour of hill country estates, peaks, and cascading waterfalls',
      duration: '6 Days',
      price: '$2,480',
      highlights: ['Premium accommodations', 'Helicopter transfers', 'Private estates', 'Waterfall dining']
    }
  ]

  const testimonials = [
    {
      name: 'Lord Harrison Pemberton',
      location: 'London, UK',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
      quote: 'The most exquisite tea estate experience I\'ve encountered. The private tastings and colonial ambiance transported us to a bygone era of elegance.'
    },
    {
      name: 'Catherine Van Der Berg',
      location: 'Amsterdam, Netherlands', 
      image: 'https://images.unsplash.com/photo-1494790108755-2616b332c5cd?w=150',
      quote: 'Our vintage train journey through Ella was absolutely magical. The service and attention to detail exceeded our highest expectations.'
    },
    {
      name: 'James Morrison',
      location: 'Sydney, Australia',
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150', 
      quote: 'The luxury tea estate bungalow offered the perfect retreat. Waking up to mist-covered mountains and the aroma of fresh Ceylon tea was unforgettable.'
    }
  ]

  const handleBookTour = (tourId: string) => {
    alert('Thank you for your interest in our luxury hill country retreat! Our estate specialists will contact you shortly to curate your perfect tea plantation experience.')
  }

  const scrollToExperiences = () => {
    document.getElementById('signature-experiences')?.scrollIntoView({ behavior: 'smooth' })
  }

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "TouristTrip",
    "name": "Luxury Hill Country Tours Sri Lanka - Tea Estate Retreats",
    "description": "Exclusive tea estate retreats, high-end Ella experiences, and premium mountain escapes in Sri Lanka's misty hill country",
    "provider": {
      "@type": "Organization", 
      "name": "Recharge Travels"
    },
    "offers": {
      "@type": "Offer",
      "category": "Luxury Hill Country Tours",
      "priceRange": "$280-$2480"
    }
  }

  return (
    <>
      <SEOHead
        title="Luxury Hill Country Tours Sri Lanka – Recharge Travels"
        description="Discover exclusive tea estate retreats, high-end Ella experiences, and premium mountain escapes. Luxury colonial-era inspired getaways in Sri Lanka's misty hill country with private tea tastings and vintage train journeys."
        structuredData={structuredData}
        canonicalUrl={`${window.location.origin}/tours/hill-country`}
      />

      <Header />

      {/* Hero Section - Misty Tea Plantation Cinematic */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background with slow pan and mist effect */}
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ 
            backgroundImage: 'url(https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=1500&q=80)',
            animation: 'slowPan 30s ease-in-out infinite alternate'
          }}
        />
        
        {/* Parallax mist layers */}
        <div className="absolute inset-0 bg-gradient-to-b from-green-50/20 via-transparent to-green-900/40" />
        <div className="absolute inset-0 opacity-30">
          <div 
            className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent"
            style={{ animation: 'mistDrift 20s linear infinite' }}
          />
        </div>

        {/* Vintage botanical sketch overlay */}
        <div 
          className="absolute inset-0 opacity-10 bg-repeat"
          style={{ 
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23000' fill-opacity='0.1'%3E%3Cpath d='M30 30c0-11.046-8.954-20-20-20s-20 8.954-20 20 8.954 20 20 20 20-8.954 20-20zm15 0c0-8.284-6.716-15-15-15s-15 6.716-15 15 6.716 15 15 15 15-6.716 15-15z'/%3E%3C/g%3E%3C/svg%3E")`,
            backgroundSize: '120px 120px'
          }}
        />

        <div className="relative text-center px-6 md:px-10 max-w-6xl space-y-8 z-10">
          {/* Main headline with botanical flourishes */}
          <div className="space-y-6">
            <div className="flex items-center justify-center mb-4">
              <div className="flex items-center space-x-2 text-amber-600">
                <Leaf className="w-6 h-6" />
                <span className="text-sm font-medium tracking-wider uppercase">Estate Approved Luxury</span>
                <Leaf className="w-6 h-6 scale-x-[-1]" />
              </div>
            </div>
            
            <h1 className="font-serif text-5xl md:text-7xl tracking-tight text-white drop-shadow-lg leading-tight">
              Hill Country
              <span className="block text-amber-200 relative">
                Tea Retreats
                <div className="absolute -top-2 -right-2 text-amber-400 opacity-60">
                  <Leaf className="w-8 h-8 transform rotate-12" />
                </div>
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-green-100 max-w-4xl mx-auto leading-relaxed">
              Escape to exclusive tea estate retreats where colonial elegance meets Ceylon's misty mountains. 
              Experience private tastings, vintage railways, and luxury bungalows among rolling plantations.
            </p>
          </div>

          {/* Luxury features */}
          <div className="flex flex-wrap justify-center gap-6 text-sm">
            {[
              { icon: Coffee, text: 'Private Estate Tastings' },
              { icon: Train, text: 'Heritage Railways' },
              { icon: Crown, text: 'Colonial Luxury' },
              { icon: Mountain, text: 'Misty Peaks' }
            ].map((item, index) => (
              <div key={index} className="flex items-center bg-amber-900/30 backdrop-blur-sm px-6 py-3 rounded-full border border-amber-300/20">
                <item.icon className="w-5 h-5 mr-2 text-amber-200" />
                <span className="text-amber-100">{item.text}</span>
              </div>
            ))}
          </div>
          
          <div className="pt-6">
            <Button 
              onClick={scrollToExperiences}
              size="lg"
              className="px-12 py-4 text-lg rounded-full bg-gradient-to-r from-amber-600 to-yellow-600 hover:from-amber-700 hover:to-yellow-700 transition-all duration-300 text-white font-medium shadow-xl transform hover:scale-105 border-2 border-amber-400/30"
            >
              <Leaf className="w-5 h-5 mr-2" />
              Discover Tea Estates
            </Button>
          </div>
        </div>

        {/* Floating tea elements */}
        <div className="absolute top-20 left-10 opacity-20 animate-float text-4xl hidden lg:block">🍃</div>
        <div className="absolute top-32 right-20 opacity-15 animate-bounce text-3xl hidden lg:block" style={{ animationDelay: '1s' }}>🫖</div>
        <div className="absolute bottom-40 left-32 opacity-20 animate-pulse text-3xl hidden lg:block">🌿</div>
        <div className="absolute bottom-20 right-10 opacity-25 animate-float text-2xl hidden lg:block" style={{ animationDelay: '2s' }}>☕</div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-gradient-to-br from-green-50 via-amber-50/30 to-green-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <div className="flex items-center justify-center mb-4">
              <div className="w-16 h-px bg-amber-600"></div>
              <Leaf className="w-6 h-6 mx-3 text-amber-600" />
              <div className="w-16 h-px bg-amber-600"></div>
            </div>
            <h2 className="text-4xl md:text-5xl font-serif text-green-900 mb-6">
              Why Choose Our Tea Estate Retreats?
            </h2>
            <p className="text-xl text-green-700 max-w-3xl mx-auto leading-relaxed">
              Immerse yourself in the refined elegance of Ceylon's colonial tea heritage with exclusive access to century-old plantations
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              {
                icon: Coffee,
                title: 'Master Tea Experiences',
                description: 'Private sessions with estate masters, exclusive tastings of rare Ceylon varieties, and hands-on blending workshops in historic tea rooms'
              },
              {
                icon: Home,
                title: 'Colonial Luxury Stays',
                description: 'Heritage tea bungalows and colonial manor houses with period furnishings, butler service, and panoramic plantation views'
              },
              {
                icon: Crown,
                title: 'Exclusive Access',
                description: 'Private estate tours, vintage train first-class carriages, and gourmet dining experiences unavailable to regular tourists'
              }
            ].map((benefit, index) => (
              <Card key={index} className="bg-white/90 backdrop-blur-sm border-amber-100 hover:shadow-xl transition-all duration-300 relative overflow-hidden">
                {/* Botanical border decoration */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-amber-400 to-transparent"></div>
                <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-green-400 to-transparent"></div>
                
                <CardContent className="p-8 text-center">
                  <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-amber-100 to-green-100 rounded-full flex items-center justify-center">
                    <benefit.icon className="w-8 h-8 text-amber-700" />
                  </div>
                  <h3 className="text-xl font-serif font-semibold text-green-900 mb-4">{benefit.title}</h3>
                  <p className="text-green-700 leading-relaxed">{benefit.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Signature Experiences */}
      <section id="signature-experiences" className="py-20 bg-gradient-to-b from-amber-50/20 to-green-50/20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <div className="flex items-center justify-center mb-4">
              <div className="w-20 h-px bg-amber-600"></div>
              <Crown className="w-8 h-8 mx-4 text-amber-600" />
              <div className="w-20 h-px bg-amber-600"></div>
            </div>
            <h2 className="text-4xl md:text-5xl font-serif text-green-900 mb-6">
              Signature Tea Estate Experiences
            </h2>
            <p className="text-xl text-green-700 max-w-3xl mx-auto">
              Curated luxury experiences that showcase the finest of Ceylon tea culture and colonial heritage
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {signatureExperiences.map((experience) => (
              <Card key={experience.id} className="overflow-hidden group hover:shadow-2xl transition-all duration-500 border-0 bg-gradient-to-b from-white to-amber-50/30 relative">
                {/* Wood grain texture overlay */}
                <div className="absolute inset-0 opacity-10 bg-gradient-to-br from-amber-900/20 via-transparent to-amber-900/10"></div>
                
                <div className="relative">
                  <img
                    src={experience.image}
                    alt={experience.title}
                    className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-4 left-4 bg-amber-600 text-white px-4 py-2 rounded-full text-sm font-medium flex items-center">
                    <Crown className="w-4 h-4 mr-1" />
                    Premium Experience
                  </div>
                  <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm rounded-full px-3 py-2 flex items-center gap-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-semibold">{experience.rating}</span>
                  </div>
                </div>
                
                <CardHeader className="pb-4 relative">
                  <CardTitle className="text-xl font-serif text-green-900 line-clamp-2">{experience.title}</CardTitle>
                  <CardDescription className="text-green-700 line-clamp-2">
                    {experience.description}
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="space-y-4 relative">
                  <div className="flex items-center justify-between text-sm text-green-600">
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {experience.duration}
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      Hill Country
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <p className="text-sm font-semibold text-green-900">Estate Highlights:</p>
                    <div className="flex flex-wrap gap-1">
                      {experience.highlights.map((highlight, index) => (
                        <Badge key={index} variant="outline" className="text-xs border-amber-200 text-amber-800 bg-amber-50">
                          {highlight}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between pt-4 border-t border-amber-100">
                    <div>
                      <span className="text-2xl font-bold text-amber-600">{experience.price}</span>
                      <span className="text-sm text-green-600"> per person</span>
                    </div>
                    <Button 
                      onClick={() => handleBookTour(experience.id)}
                      className="bg-gradient-to-r from-amber-600 to-yellow-600 hover:from-amber-700 hover:to-yellow-700 text-white group/btn border border-amber-400/30"
                    >
                      Reserve Now
                      <ArrowRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Premium Tea Estate Stays */}
      <section className="py-20 bg-gradient-to-br from-green-900/5 to-amber-900/5">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <div className="flex items-center justify-center mb-4">
              <div className="w-20 h-px bg-green-600"></div>
              <Home className="w-8 h-8 mx-4 text-green-600" />
              <div className="w-20 h-px bg-green-600"></div>
            </div>
            <h2 className="text-4xl md:text-5xl font-serif text-green-900 mb-6">
              Premium Tea Estate Stays
            </h2>
            <p className="text-xl text-green-700 max-w-3xl mx-auto">
              Colonial bungalows and heritage manor houses nestled among mist-covered tea plantations
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {premiumStays.map((stay) => (
              <Card key={stay.id} className="overflow-hidden group hover:shadow-2xl transition-all duration-500 bg-white border-amber-100 relative">
                {/* Teak wood texture effect */}
                <div className="absolute inset-0 opacity-5 bg-gradient-to-br from-amber-900 via-amber-800 to-amber-900 pointer-events-none"></div>
                
                <div className="relative">
                  <img
                    src={stay.image}
                    alt={stay.name}
                    className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-4 right-4 bg-amber-600 text-white px-4 py-2 rounded-lg text-lg font-bold">
                    {stay.rate}
                  </div>
                </div>
                
                <CardContent className="p-6 relative">
                  <h3 className="text-xl font-serif font-bold text-green-900 mb-2">{stay.name}</h3>
                  <p className="text-green-600 mb-4 flex items-center">
                    <MapPin className="w-4 h-4 mr-1" />
                    {stay.location}
                  </p>
                  
                  <div className="space-y-2 mb-6">
                    <p className="text-sm font-semibold text-green-900">Estate Amenities:</p>
                    <div className="flex flex-wrap gap-1">
                      {stay.amenities.map((amenity, index) => (
                        <Badge key={index} variant="outline" className="text-xs border-green-200 text-green-700 bg-green-50">
                          {amenity}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <Button 
                    onClick={() => handleBookTour(stay.id)}
                    className="w-full bg-gradient-to-r from-green-700 to-green-600 hover:from-green-800 hover:to-green-700 text-white relative overflow-hidden group/btn"
                  >
                    {/* Engraved wooden plaque effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-amber-900/20 to-amber-800/20 opacity-0 group-hover/btn:opacity-100 transition-opacity"></div>
                    <span className="relative flex items-center justify-center">
                      Reserve Your Cottage
                      <Home className="w-4 h-4 ml-2" />
                    </span>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Scenic Routes & Day Trips */}
      <section className="py-20 bg-gradient-to-b from-amber-50/30 to-green-50/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <div className="flex items-center justify-center mb-4">
              <div className="w-20 h-px bg-amber-600"></div>
              <Camera className="w-8 h-8 mx-4 text-amber-600" />
              <div className="w-20 h-px bg-amber-600"></div>
            </div>
            <h2 className="text-4xl md:text-5xl font-serif text-green-900 mb-6">
              Scenic Routes & Luxury Excursions
            </h2>
            <p className="text-xl text-green-700 max-w-3xl mx-auto">
              Curated day experiences combining natural wonders with refined colonial dining and estate tours
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {scenicRoutes.map((route) => (
              <Card key={route.id} className="overflow-hidden group hover:shadow-xl transition-all duration-300 bg-white/95 backdrop-blur-sm border-green-100 relative">
                {/* Topographical map background effect */}
                <div 
                  className="absolute inset-0 opacity-5 bg-repeat"
                  style={{ 
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23000' fill-opacity='0.05'%3E%3Cpath d='M0 0h40v40H0V0zm20 2.5a17.5 17.5 0 1 0 0 35 17.5 17.5 0 0 0 0-35zm0 3a14.5 14.5 0 1 1 0 29 14.5 14.5 0 0 1 0-29zm0 3a11.5 11.5 0 1 0 0 23 11.5 11.5 0 0 0 0-23z'/%3E%3C/g%3E%3C/svg%3E")`,
                    backgroundSize: '60px 60px'
                  }}
                />
                
                <div className="relative">
                  <img
                    src={route.image}
                    alt={route.title}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-4 left-4 bg-green-600 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center">
                    <Clock className="w-4 h-4 mr-1" />
                    {route.duration}
                  </div>
                </div>
                
                <CardContent className="p-6 relative">
                  <h3 className="text-xl font-serif font-bold text-green-900 mb-3">{route.title}</h3>
                  <p className="text-green-700 mb-4 line-clamp-2">{route.description}</p>
                  
                  <div className="flex flex-wrap gap-2 mb-6">
                    {route.highlights.map((highlight, index) => (
                      <Badge key={index} variant="outline" className="text-xs border-amber-200 text-amber-700 bg-amber-50">
                        {highlight}
                      </Badge>
                    ))}
                  </div>
                  
                  <Button 
                    onClick={() => handleBookTour(route.id)}
                    variant="outline"
                    className="w-full border-green-200 text-green-700 hover:bg-green-50 group/btn relative overflow-hidden"
                  >
                    {/* Tea cup motif effect */}
                    <div className="absolute left-4 top-1/2 transform -translate-y-1/2 opacity-0 group-hover/btn:opacity-20 transition-opacity">
                      <Coffee className="w-4 h-4" />
                    </div>
                    <span className="relative">Learn More</span>
                    <ArrowRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Luxury Itineraries */}
      <section className="py-20 bg-gradient-to-br from-green-900/10 to-amber-900/10">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <div className="flex items-center justify-center mb-4">
              <div className="w-20 h-px bg-green-600"></div>
              <Calendar className="w-8 h-8 mx-4 text-green-600" />
              <div className="w-20 h-px bg-green-600"></div>
            </div>
            <h2 className="text-4xl md:text-5xl font-serif text-green-900 mb-6">
              Luxury Tea Estate Itineraries
            </h2>
            <p className="text-xl text-green-700 max-w-3xl mx-auto">
              Meticulously crafted journeys through Ceylon's tea heritage, combining luxury accommodation with exclusive experiences
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {luxuryItineraries.map((itinerary) => (
              <Card key={itinerary.id} className="overflow-hidden group hover:shadow-xl transition-all duration-300 bg-gradient-to-b from-white to-amber-50/50 border-amber-100 relative">
                {/* Estate document texture */}
                <div className="absolute inset-0 opacity-10">
                  <div className="w-full h-full bg-gradient-to-br from-amber-100 via-transparent to-amber-100"></div>
                  <div className="absolute top-0 left-0 w-full h-px bg-amber-200"></div>
                  <div className="absolute bottom-0 left-0 w-full h-px bg-amber-200"></div>
                </div>
                
                <CardHeader className="pb-4 relative">
                  <div className="flex items-center justify-between mb-2">
                    <Badge className="bg-amber-600 text-white text-xs">
                      {itinerary.duration}
                    </Badge>
                    <div className="text-2xl font-bold text-amber-600">{itinerary.price}</div>
                  </div>
                  <CardTitle className="text-xl font-serif text-green-900 mb-3">{itinerary.title}</CardTitle>
                  <CardDescription className="text-green-700">
                    {itinerary.description}
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="space-y-4 relative">
                  <div className="space-y-2">
                    <p className="text-sm font-semibold text-green-900">Journey Highlights:</p>
                    <div className="space-y-1">
                      {itinerary.highlights.map((highlight, index) => (
                        <div key={index} className="flex items-center text-sm text-green-700">
                          <Leaf className="w-3 h-3 mr-2 text-amber-600" />
                          {highlight}
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t border-amber-100">
                    <Button 
                      onClick={() => handleBookTour(itinerary.id)}
                      className="w-full mb-3 bg-gradient-to-r from-green-700 to-green-600 hover:from-green-800 hover:to-green-700 text-white"
                    >
                      Reserve Journey
                      <Calendar className="w-4 h-4 ml-2" />
                    </Button>
                    
                    <Button 
                      variant="outline"
                      className="w-full border-amber-200 text-amber-700 hover:bg-amber-50 text-sm relative group/pdf"
                    >
                      {/* Estate Approved stamp effect */}
                      <div className="absolute -top-1 -right-1 w-8 h-8 border border-amber-400 rounded-full flex items-center justify-center text-xs text-amber-600 bg-amber-100 opacity-0 group-hover/pdf:opacity-100 transition-opacity transform rotate-12">
                        ✓
                      </div>
                      Download Itinerary PDF
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Guest Testimonials */}
      <section className="py-20 bg-gradient-to-b from-amber-50/50 to-green-50/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <div className="flex items-center justify-center mb-4">
              <div className="w-20 h-px bg-amber-600"></div>
              <Star className="w-8 h-8 mx-4 text-amber-600" />
              <div className="w-20 h-px bg-amber-600"></div>
            </div>
            <h2 className="text-4xl md:text-5xl font-serif text-green-900 mb-6">
              Estate Guest Testimonials
            </h2>
            <p className="text-xl text-green-700 max-w-3xl mx-auto">
              Hear from distinguished guests who have experienced our luxury tea estate retreats
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="overflow-hidden group hover:shadow-xl transition-all duration-300 bg-white border-amber-100 relative">
                {/* Tea-stained parchment background */}
                <div className="absolute inset-0 bg-gradient-to-br from-amber-50/50 via-white to-amber-50/30"></div>
                
                <CardContent className="p-8 text-center relative">
                  {/* Polished brass frame effect */}
                  <div className="relative mb-6">
                    <div className="w-20 h-20 mx-auto rounded-full border-4 border-amber-400 p-1 bg-gradient-to-br from-amber-100 to-amber-200">
                      <img
                        src={testimonial.image}
                        alt={testimonial.name}
                        className="w-full h-full rounded-full object-cover"
                      />
                    </div>
                    {/* Brass shine effect */}
                    <div className="absolute inset-0 w-20 h-20 mx-auto rounded-full bg-gradient-to-tr from-transparent via-yellow-200/20 to-transparent"></div>
                  </div>
                  
                  <blockquote className="text-green-700 mb-6 italic leading-relaxed font-serif text-lg">
                    "{testimonial.quote}"
                  </blockquote>
                  
                  <div className="space-y-1">
                    <p className="font-semibold text-green-900">{testimonial.name}</p>
                    <p className="text-sm text-green-600">{testimonial.location}</p>
                  </div>
                  
                  {/* Five star rating */}
                  <div className="flex justify-center mt-4 space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Booking Form Section */}
      <section className="py-20 bg-gradient-to-br from-green-800 to-green-900 relative overflow-hidden">
        {/* Teak panel texture overlay */}
        <div className="absolute inset-0 opacity-10 bg-gradient-to-br from-amber-900 via-amber-800 to-amber-900"></div>
        
        <div className="container mx-auto px-4 relative">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <div className="flex items-center justify-center mb-4">
                <div className="w-20 h-px bg-amber-400"></div>
                <Calendar className="w-8 h-8 mx-4 text-amber-400" />
                <div className="w-20 h-px bg-amber-400"></div>
              </div>
              <h2 className="text-4xl md:text-5xl font-serif text-white mb-6">
                Book Your Hill Country Escape
              </h2>
              <p className="text-xl text-green-100 max-w-2xl mx-auto">
                Let our estate specialists curate your perfect tea plantation retreat with private tastings, luxury accommodations, and exclusive experiences.
              </p>
            </div>

            {/* Teak-effect booking form container */}
            <Card className="bg-gradient-to-br from-amber-50 to-white border-4 border-amber-200 shadow-2xl relative overflow-hidden">
              {/* Brass corner hardware effect */}
              <div className="absolute top-0 left-0 w-6 h-6 bg-gradient-to-br from-amber-600 to-amber-700 rounded-br-lg"></div>
              <div className="absolute top-0 right-0 w-6 h-6 bg-gradient-to-bl from-amber-600 to-amber-700 rounded-bl-lg"></div>
              <div className="absolute bottom-0 left-0 w-6 h-6 bg-gradient-to-tr from-amber-600 to-amber-700 rounded-tr-lg"></div>
              <div className="absolute bottom-0 right-0 w-6 h-6 bg-gradient-to-tl from-amber-600 to-amber-700 rounded-tl-lg"></div>
              
              <CardContent className="p-8">
                <form className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-green-900 mb-2">Estate Preference</label>
                      <select className="w-full px-4 py-3 border-2 border-amber-200 rounded-lg focus:border-amber-400 focus:outline-none bg-white/90">
                        <option>Select Tea Estate Experience</option>
                        <option>Private Tea Tasting</option>
                        <option>Heritage Railway Journey</option>
                        <option>Colonial Bungalow Retreat</option>
                        <option>Complete Hill Country Tour</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-semibold text-green-900 mb-2">Preferred Dates</label>
                      <input 
                        type="date" 
                        className="w-full px-4 py-3 border-2 border-amber-200 rounded-lg focus:border-amber-400 focus:outline-none bg-white/90"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-green-900 mb-2">Number of Guests</label>
                      <select className="w-full px-4 py-3 border-2 border-amber-200 rounded-lg focus:border-amber-400 focus:outline-none bg-white/90">
                        <option>2 Guests</option>
                        <option>4 Guests</option>
                        <option>6 Guests</option>
                        <option>8+ Guests</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-semibold text-green-900 mb-2">Budget Range</label>
                      <select className="w-full px-4 py-3 border-2 border-amber-200 rounded-lg focus:border-amber-400 focus:outline-none bg-white/90">
                        <option>$500 - $1,000</option>
                        <option>$1,000 - $2,000</option>
                        <option>$2,000 - $5,000</option>
                        <option>$5,000+</option>
                      </select>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-green-900 mb-2">Special Requests</label>
                    <textarea 
                      rows={4}
                      placeholder="Tell us about any special occasions, dietary requirements, or particular interests in tea culture..."
                      className="w-full px-4 py-3 border-2 border-amber-200 rounded-lg focus:border-amber-400 focus:outline-none bg-white/90 resize-none"
                    ></textarea>
                  </div>
                  
                  {/* Carved wood button effect */}
                  <Button 
                    type="submit"
                    size="lg"
                    className="w-full py-4 text-lg font-semibold bg-gradient-to-r from-green-700 to-green-600 hover:from-green-800 hover:to-green-700 text-white rounded-lg relative overflow-hidden group/book shadow-xl"
                  >
                    {/* Polished wood carving effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-amber-900/10 to-amber-800/10 opacity-0 group-hover/book:opacity-100 transition-opacity"></div>
                    <span className="relative flex items-center justify-center">
                      <Leaf className="w-6 h-6 mr-3" />
                      Book Your Hill Country Escape
                      <ArrowRight className="w-6 h-6 ml-3 group-hover/book:translate-x-1 transition-transform" />
                    </span>
                  </Button>
                  
                  <p className="text-center text-sm text-green-700 mt-4">
                    Our tea estate specialists will contact you within 24 hours to discuss your bespoke itinerary
                  </p>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <Footer />

      {/* Custom CSS for animations */}
      <style>{`
        @keyframes slowPan {
          0% { transform: scale(1) translateX(0); }
          100% { transform: scale(1.05) translateX(-20px); }
        }
        
        @keyframes mistDrift {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        
        .animate-float {
          animation: float 4s ease-in-out infinite;
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-15px); }
        }
      `}</style>
    </>
  )
}

export default HillCountryTours
