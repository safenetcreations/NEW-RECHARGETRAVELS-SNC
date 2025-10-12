import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Camera, Binoculars, TreePine, Phone, Mail, MapPin, Clock, Users, Star, Calendar, ArrowRight, Compass, Award, Shield, Eye } from 'lucide-react'
import SEOHead from '@/components/cms/SEOHead'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
// QuickBookingForm component removed

const LuxurySafariExpeditions = () => {
  const [selectedTour, setSelectedTour] = useState<string>('')

  const handleQuickBookingStart = (destination: string, date: Date) => {
    setTimeout(() => {
      document.getElementById('safari-packages')?.scrollIntoView({ behavior: 'smooth' })
    }, 100)
  }

  const handleBookTour = (tourId: string) => {
    setSelectedTour(tourId)
    alert('Thank you! Your luxury safari booking request has been submitted. Our expedition coordinator will contact you shortly.')
  }

  // Signature Safari Encounters - Premium Experiences
  const signatureEncounters = [
    {
      id: 'private-leopard-tracking',
      title: 'Private Leopard Tracking',
      description: 'Exclusive dawn expedition with Sri Lanka\'s leading leopard specialist in Yala\'s Block I',
      duration: '6 Hours',
      price: '$650',
      image: 'https://images.unsplash.com/photo-1549366021-9f761d040a94?w=600',
      highlights: ['Private vehicle & guide', 'Dawn photography session', 'Leopard behavior insights', 'Luxury bush breakfast'],
      difficulty: 'Moderate'
    },
    {
      id: 'early-morning-elephant',
      title: 'Early-Morning Elephant Safari',
      description: 'Witness the ancient elephant gathering ritual at Minneriya\'s sacred waters',
      duration: '5 Hours',
      price: '$480',
      image: 'https://images.unsplash.com/photo-1564760055775-d63b17a55c44?w=600',
      highlights: ['300+ wild elephants', 'Naturalist commentary', 'Traditional Sri Lankan breakfast', 'Conservation talk'],
      difficulty: 'Easy'
    },
    {
      id: 'nocturnal-wildlife',
      title: 'Nocturnal Wildlife Jeep Ride',
      description: 'After-dark adventure through Wilpattu\'s mysterious lakes and ancient pathways',
      duration: '4 Hours',
      price: '$420',
      image: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?w=600',
      highlights: ['Night vision equipment', 'Sloth bear spotting', 'Star gazing session', 'Traditional dinner'],
      difficulty: 'Moderate'
    }
  ]

  // Safari Routes - Premium Destinations
  const safariRoutes = [
    {
      id: 'yala-leopard-corridor',
      title: 'Yala Leopard Corridor',
      description: 'The world\'s highest leopard density sanctuary',
      duration: '2-3 days',
      highlights: ['40+ leopards', 'Ancient rock formations', 'Coastal wilderness'],
      image: 'https://images.unsplash.com/photo-1549366021-9f761d040a94?w=400'
    },
    {
      id: 'wilpattu-wilderness',
      title: 'Wilpattu Wilderness Circuit',
      description: 'Sri Lanka\'s largest and most pristine national park',
      duration: '2-4 days',
      highlights: ['Natural lakes', 'Sloth bears', 'Ancient ruins'],
      image: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?w=400'
    },
    {
      id: 'horton-plains-highland',
      title: 'Horton Plains Highland Safari',
      description: 'Cloud forest expedition to World\'s End precipice',
      duration: '1-2 days',
      highlights: ['Endemic species', 'World\'s End viewpoint', 'Baker\'s Falls'],
      image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400'
    },
    {
      id: 'gal-oya-canoe',
      title: 'Gal Oya Canoe Safari',
      description: 'Unique water safari with swimming elephants',
      duration: '2-3 days',
      highlights: ['Swimming elephants', 'Vedda culture', 'Remote wilderness'],
      image: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?w=400'
    }
  ]

  // Luxury Safari Lodges
  const luxuryLodges = [
    {
      id: 'cinnamon-wild',
      name: 'Cinnamon Wild Yala',
      category: 'Luxury Safari Lodge',
      location: 'Yala National Park',
      rate: '$380/night',
      description: 'Beachfront luxury lodge with direct park access',
      image: 'https://images.unsplash.com/photo-1520637836862-4d197d17c90a?w=400',
      amenities: ['Private beach', 'Spa treatments', 'Game drives', 'Nature walks']
    },
    {
      id: 'jetwing-yala',
      name: 'Jetwing Yala',
      category: 'Eco-Luxury Resort',
      location: 'Yala Buffer Zone',
      rate: '$420/night',
      description: 'Award-winning sustainable luxury with stunning architecture',
      image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400',
      amenities: ['Infinity pool', 'Wildlife viewing deck', 'Spa', 'Fine dining']
    },
    {
      id: 'leopard-trails',
      name: 'Leopard Trails Camp',
      category: 'Luxury Tented Camp',
      location: 'Wilpattu National Park',
      rate: '$550/night',
      description: 'Exclusive tented camp for the ultimate wilderness experience',
      image: 'https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?w=400',
      amenities: ['Luxury tents', 'Private guides', 'Bush dining', 'Star gazing']
    }
  ]

  // Sample Itineraries
  const itineraries = [
    {
      title: '3-Day Leopard Quest',
      duration: '3 Days / 2 Nights',
      price: '$1,850',
      highlights: ['Yala Block I exclusive access', 'Private leopard specialist', 'Luxury lodge accommodation']
    },
    {
      title: '5-Day Wild Ceylon Explorer',
      duration: '5 Days / 4 Nights',
      price: '$2,950',
      highlights: ['Multiple national parks', 'Elephant gathering', 'Canoe safari experience']
    },
    {
      title: '7-Day Complete Safari Circuit',
      duration: '7 Days / 6 Nights',
      price: '$4,200',
      highlights: ['All major parks', 'Cultural immersion', 'Beach extension']
    }
  ]

  // Guest Testimonials
  const testimonials = [
    {
      id: 1,
      name: 'James & Sarah Wellington',
      location: 'London, UK',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
      quote: 'The private leopard tracking experience exceeded all expectations. Seeing these magnificent cats in their natural habitat was truly life-changing.'
    },
    {
      id: 2,
      name: 'Dr. Maria Rodriguez',
      location: 'Barcelona, Spain',
      image: 'https://images.unsplash.com/photo-1494790108755-2616b2e8bb9e?w=150',
      quote: 'As a wildlife photographer, I\'ve been on safaris worldwide. The expertise and access provided here is unmatched.'
    },
    {
      id: 3,
      name: 'Robert Chen',
      location: 'Singapore',
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150',
      quote: 'The luxury safari lodges combined with unparalleled wildlife access create an experience that rivals any African safari.'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-900 via-amber-900 to-stone-800">
      <SEOHead 
        title="Luxury Safari Expeditions Sri Lanka - Exclusive Wildlife Adventures | Recharge Travels"
        description="Experience Sri Lanka's most exclusive luxury safari expeditions. Private leopard tracking, elephant encounters, and premium wildlife lodges with expert naturalist guides."
        canonicalUrl="https://rechargetravels.com/exotic-pages/luxury-safari-expeditions"
        ogImage="https://images.unsplash.com/photo-1549366021-9f761d040a94"
      />
      
      <Header />

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background Video Effect */}
        <div className="absolute inset-0">
          <div 
            className="w-full h-full bg-cover bg-center animate-slowPan"
            style={{
              backgroundImage: `linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.5)), url('https://images.unsplash.com/photo-1549366021-9f761d040a94?w=1920')`
            }}
          />
          
          {/* Floating mist layers */}
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-1/4 left-0 w-full h-32 bg-gradient-to-r from-transparent via-white to-transparent animate-mistDrift" />
            <div className="absolute top-1/2 right-0 w-full h-24 bg-gradient-to-l from-transparent via-amber-200 to-transparent animate-mistDrift" style={{ animationDelay: '2s' }} />
          </div>
          
          {/* Botanical sketch overlay */}
          <div className="absolute inset-0 opacity-10 bg-repeat" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M30 30c0-11.046-8.954-20-20-20s-20 8.954-20 20 8.954 20 20 20 20-8.954 20-20z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")` }} />
        </div>

        {/* Content */}
        <div className="relative z-10 text-center px-4 max-w-6xl mx-auto">
          <div className="mb-8">
            <Badge className="bg-amber-600/20 text-amber-300 border-amber-400/30 mb-6 px-6 py-2 text-lg">
              Exotic Pages Collection
            </Badge>
            <h1 className="text-6xl md:text-8xl font-playfair font-bold leading-tight">
              Luxury Safari
              <span className="block text-amber-300">Expeditions</span>
            </h1>
            <p className="text-xl md:text-2xl text-stone-300 mt-8 max-w-3xl mx-auto leading-relaxed">
              Embark on exclusive wildlife adventures through Sri Lanka's pristine wilderness. 
              Private leopard encounters, elephant sanctuaries, and luxury safari lodges await.
            </p>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12 mb-12">
            <div className="text-center">
              <div className="text-3xl font-bold text-amber-300">40+</div>
              <div className="text-stone-300">Leopards in Yala</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-amber-300">300+</div>
              <div className="text-stone-300">Wild Elephants</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-amber-300">15+</div>
              <div className="text-stone-300">National Parks</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-amber-300">24/7</div>
              <div className="text-stone-300">Expert Guides</div>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-amber-600 hover:bg-amber-700 text-white px-8 py-4 text-lg safari-bronze"
              onClick={() => document.getElementById('signature-encounters')?.scrollIntoView({ behavior: 'smooth' })}
            >
              <Binoculars className="mr-2" />
              Explore Expeditions
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="border-amber-400 text-amber-300 hover:bg-amber-600/20 px-8 py-4 text-lg"
              onClick={() => document.getElementById('quick-booking')?.scrollIntoView({ behavior: 'smooth' })}
            >
              <Calendar className="mr-2" />
              Book Your Safari
            </Button>
          </div>
        </div>
      </section>

      {/* Signature Safari Encounters */}
      <section id="signature-encounters" className="py-20 bg-gradient-to-br from-amber-50 to-stone-100">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-playfair font-bold text-stone-800 mb-6">
              Signature Safari Encounters
            </h2>
            <p className="text-xl text-stone-600 max-w-3xl mx-auto">
              Exclusive wildlife experiences curated by Sri Lanka's leading naturalists and conservation experts
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {signatureEncounters.map((encounter) => (
              <Card key={encounter.id} className="overflow-hidden hover:shadow-2xl transition-all duration-300 border-0 safari-leather">
                <div className="relative">
                  <img 
                    src={encounter.image} 
                    alt={encounter.title}
                    className="w-full h-64 object-cover"
                  />
                  <div className="absolute top-4 right-4">
                    <Badge className="bg-amber-600 text-white">{encounter.difficulty}</Badge>
                  </div>
                </div>
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-bold text-stone-800">{encounter.title}</h3>
                    <span className="text-2xl font-bold text-amber-600">{encounter.price}</span>
                  </div>
                  <p className="text-stone-600 mb-4">{encounter.description}</p>
                  
                  <div className="flex items-center gap-4 mb-4 text-sm text-stone-500">
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {encounter.duration}
                    </span>
                  </div>

                  <div className="space-y-2 mb-6">
                    {encounter.highlights.map((highlight, index) => (
                      <div key={index} className="flex items-center gap-2 text-sm text-stone-600">
                        <Award className="w-4 h-4 text-amber-600" />
                        {highlight}
                      </div>
                    ))}
                  </div>

                  <Button 
                    className="w-full bg-amber-600 hover:bg-amber-700 text-white"
                    onClick={() => handleBookTour(encounter.id)}
                  >
                    Book This Experience
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Safari Routes */}
      <section className="py-20 bg-gradient-to-br from-stone-800 to-amber-900">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-playfair font-bold text-white mb-6">
              Premium Safari Routes
            </h2>
            <p className="text-xl text-stone-300 max-w-3xl mx-auto">
              Explore Sri Lanka's most pristine wilderness areas with our carefully curated safari circuits
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {safariRoutes.map((route) => (
              <Card key={route.id} className="overflow-hidden hover:shadow-2xl transition-all duration-300 border-0 bg-stone-900/50 text-white">
                <div className="relative">
                  <img 
                    src={route.image} 
                    alt={route.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <h3 className="text-lg font-bold text-white mb-2">{route.title}</h3>
                    <p className="text-stone-300 text-sm">{route.description}</p>
                  </div>
                </div>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-3 text-sm text-amber-300">
                    <Clock className="w-4 h-4" />
                    {route.duration}
                  </div>
                  
                  <div className="space-y-1 mb-4">
                    {route.highlights.map((highlight, index) => (
                      <div key={index} className="flex items-center gap-2 text-sm text-stone-300">
                        <Eye className="w-3 h-3 text-amber-400" />
                        {highlight}
                      </div>
                    ))}
                  </div>

                  <Button 
                    variant="outline" 
                    className="w-full border-amber-400 text-amber-300 hover:bg-amber-600/20"
                  >
                    Learn More
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Luxury Safari Lodges */}
      <section className="py-20 bg-gradient-to-br from-stone-100 to-amber-100">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-playfair font-bold text-stone-800 mb-6">
              Luxury Safari Lodges
            </h2>
            <p className="text-xl text-stone-600 max-w-3xl mx-auto">
              Retreat to exclusive lodges where comfort meets wilderness, offering unparalleled access to Sri Lanka's wildlife
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {luxuryLodges.map((lodge) => (
              <Card key={lodge.id} className="overflow-hidden hover:shadow-2xl transition-all duration-300 border-0 safari-leather">
                <div className="relative">
                  <img 
                    src={lodge.image} 
                    alt={lodge.name}
                    className="w-full h-64 object-cover"
                  />
                  <div className="absolute top-4 left-4">
                    <Badge className="bg-amber-600 text-white">{lodge.category}</Badge>
                  </div>
                  <div className="absolute top-4 right-4">
                    <Badge className="bg-stone-800 text-amber-300 font-bold">{lodge.rate}</Badge>
                  </div>
                </div>
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold text-stone-800 mb-2">{lodge.name}</h3>
                  <div className="flex items-center gap-2 mb-4 text-stone-600">
                    <MapPin className="w-4 h-4" />
                    {lodge.location}
                  </div>
                  <p className="text-stone-600 mb-4">{lodge.description}</p>
                  
                  <div className="grid grid-cols-2 gap-2 mb-6">
                    {lodge.amenities.map((amenity, index) => (
                      <div key={index} className="flex items-center gap-2 text-sm text-stone-600">
                        <Shield className="w-3 h-3 text-amber-600" />
                        {amenity}
                      </div>
                    ))}
                  </div>

                  <Button 
                    className="w-full bg-amber-600 hover:bg-amber-700 text-white"
                    onClick={() => handleBookTour(lodge.id)}
                  >
                    Reserve Your Stay
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Sample Itineraries */}
      <section className="py-20 bg-gradient-to-br from-amber-900 to-stone-800">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-playfair font-bold text-white mb-6">
              Luxury Safari Itineraries
            </h2>
            <p className="text-xl text-stone-300 max-w-3xl mx-auto">
              Carefully crafted expeditions combining the best wildlife experiences with luxury accommodations
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {itineraries.map((itinerary, index) => (
              <Card key={index} className="overflow-hidden hover:shadow-2xl transition-all duration-300 border-0 bg-stone-900/50 text-white safari-leather">
                <CardContent className="p-8">
                  <h3 className="text-2xl font-bold text-amber-300 mb-4">{itinerary.title}</h3>
                  <div className="flex items-center gap-2 mb-4 text-stone-300">
                    <Clock className="w-5 h-5" />
                    {itinerary.duration}
                  </div>
                  <div className="text-3xl font-bold text-white mb-6">{itinerary.price}</div>
                  
                  <div className="space-y-3 mb-8">
                    {itinerary.highlights.map((highlight, idx) => (
                      <div key={idx} className="flex items-center gap-3 text-stone-300">
                        <Compass className="w-4 h-4 text-amber-400" />
                        {highlight}
                      </div>
                    ))}
                  </div>

                  <Button 
                    className="w-full bg-amber-600 hover:bg-amber-700 text-white"
                    onClick={() => handleBookTour(`itinerary-${index}`)}
                  >
                    Download Itinerary
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Guest Testimonials */}
      <section className="py-20 bg-gradient-to-br from-stone-100 to-amber-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-playfair font-bold text-stone-800 mb-6">
              Safari Expedition Testimonials
            </h2>
            <p className="text-xl text-stone-600 max-w-3xl mx-auto">
              Hear from our guests about their extraordinary wildlife encounters
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial) => (
              <Card key={testimonial.id} className="overflow-hidden hover:shadow-xl transition-all duration-300 border-0 safari-parchment">
                <CardContent className="p-8 text-center">
                  <div className="w-20 h-20 rounded-full overflow-hidden mx-auto mb-6 ring-4 ring-amber-400/30">
                    <img 
                      src={testimonial.image} 
                      alt={testimonial.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <blockquote className="text-stone-700 italic mb-6 text-lg leading-relaxed">
                    "{testimonial.quote}"
                  </blockquote>
                  <div className="flex justify-center mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <h4 className="font-bold text-stone-800">{testimonial.name}</h4>
                  <p className="text-stone-600">{testimonial.location}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Quick Booking Section */}
      <section id="quick-booking" className="py-20 safari-leather">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-playfair font-bold text-stone-800 mb-6">
              Book Your Luxury Safari Expedition
            </h2>
            <p className="text-xl text-stone-600">
              Begin your exclusive wildlife adventure with our safari specialists
            </p>
          </div>
          
          <div className="text-center p-8 bg-white/80 rounded-lg">
            <p className="text-stone-600">Booking form will be available soon. Please contact us directly.</p>
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
          50% { transform: translateY(-10px); }
        }
        
        .animate-slowPan {
          animation: slowPan 20s ease-in-out infinite alternate;
        }
        
        .animate-mistDrift {
          animation: mistDrift 15s linear infinite;
        }
        
        .safari-leather {
          background: linear-gradient(135deg, 
            #f5f5dc 0%, 
            #e6d3a3 25%, 
            #ddbf94 50%, 
            #d4a574 75%, 
            #c8956d 100%
          );
          box-shadow: inset 0 2px 4px rgba(0,0,0,0.1);
        }
        
        .safari-bronze {
          background: linear-gradient(135deg, #cd7f32, #b8860b);
          box-shadow: 0 4px 15px rgba(205, 127, 50, 0.3);
        }
        
        .safari-parchment {
          background: linear-gradient(135deg, 
            #fdf6e3 0%, 
            #f5ead6 50%, 
            #ebd8b7 100%
          );
          position: relative;
        }
        
        .safari-parchment::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-image: 
            radial-gradient(circle at 25% 25%, rgba(139, 69, 19, 0.1) 2px, transparent 2px),
            radial-gradient(circle at 75% 75%, rgba(160, 82, 45, 0.1) 1px, transparent 1px);
          background-size: 30px 30px, 20px 20px;
          pointer-events: none;
        }
      `}</style>

      {/* Schema.org JSON-LD */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "TouristTrip",
          "name": "Luxury Safari Expeditions Sri Lanka",
          "description": "Exclusive luxury safari expeditions in Sri Lanka featuring private leopard tracking, elephant encounters, and premium wildlife lodges.",
          "provider": {
            "@type": "Organization",
            "name": "Recharge Travels",
            "url": "https://rechargetravels.com"
          },
          "offers": signatureEncounters.map(encounter => ({
            "@type": "Offer",
            "name": encounter.title,
            "description": encounter.description,
            "price": encounter.price,
            "priceCurrency": "USD"
          })),
          "touristType": "Luxury Wildlife Enthusiasts",
          "itinerary": {
            "@type": "ItemList",
            "itemListElement": itineraries.map((itinerary, index) => ({
              "@type": "ListItem",
              "position": index + 1,
              "item": {
                "@type": "TouristTrip",
                "name": itinerary.title,
                "duration": itinerary.duration,
                "offers": {
                  "@type": "Offer",
                  "price": itinerary.price,
                  "priceCurrency": "USD"
                }
              }
            }))
          }
        })}
      </script>
    </div>
  )
}

export default LuxurySafariExpeditions