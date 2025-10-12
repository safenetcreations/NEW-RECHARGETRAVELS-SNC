
import { useState } from 'react'
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
import SEOHead from '@/components/cms/SEOHead'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import CircuitBuilder from '@/components/cultural/CircuitBuilder'
import BookingEngine from '@/components/cultural/BookingEngine'
import InteractiveMap from '@/components/cultural/InteractiveMap'

const CulturalTours = () => {
  const [selectedCurrency, setSelectedCurrency] = useState('USD')
  const [selectedLanguage, setSelectedLanguage] = useState('EN')
  const [selectedCircuit, setSelectedCircuit] = useState<string[]>([])
  const [selectedDuration, setSelectedDuration] = useState('7')

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
      `}</style>

      {/* Cinematic Hero Section with Video */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Video Background */}
        <div className="absolute inset-0 z-0">
          <div 
            className="absolute inset-0 bg-cover bg-center heritage-video"
            style={{ 
              backgroundImage: 'linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.3)), url(https://images.unsplash.com/photo-1494891848038-7bd202a2afeb?auto=format&fit=crop&w=1920&q=80)',
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/50" />
        </div>

        {/* Floating dust motes */}
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="dust-mote"
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 15}s`,
              animationDuration: `${15 + Math.random() * 10}s`
            }}
          />
        ))}

        <div className="relative text-center px-6 md:px-10 max-w-6xl space-y-10 z-10">
          {/* Language & Currency Selector */}
          <div className="flex justify-center gap-6 mb-8">
            <div className="flex items-center bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 border border-amber-400/30">
              <Globe className="w-4 h-4 mr-2 text-amber-400" />
              <select 
                value={selectedLanguage} 
                onChange={(e) => setSelectedLanguage(e.target.value)}
                className="bg-transparent text-white text-sm border-none focus:outline-none"
              >
                {languages.map(lang => (
                  <option key={lang.code} value={lang.code} className="bg-gray-800">
                    {lang.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-center bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 border border-amber-400/30">
              <DollarSign className="w-4 h-4 mr-2 text-amber-400" />
              <select 
                value={selectedCurrency} 
                onChange={(e) => setSelectedCurrency(e.target.value)}
                className="bg-transparent text-white text-sm border-none focus:outline-none"
              >
                {currencies.map(curr => (
                  <option key={curr} value={curr} className="bg-gray-800">
                    {curr}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-8">
            <h1 className="font-cinzel text-5xl md:text-7xl tracking-tight text-white drop-shadow-2xl leading-tight">
              Journey Through Sri Lanka's
              <span className="block text-amber-400 text-shadow-lg font-playfair glow-effect">
                2,500‑Year Cultural Legacy
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-white/90 max-w-4xl mx-auto leading-relaxed font-montserrat font-light">
              Explore the UNESCO‑listed Cultural Triangle & Beyond in 7–14 Day Circuits
            </p>
          </div>

          <div className="pt-8">
            <Button 
              onClick={() => document.getElementById('circuit-overview')?.scrollIntoView({ behavior: 'smooth' })}
              size="lg"
              className="px-12 py-6 text-xl rounded-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 transition-all duration-500 text-white font-semibold shadow-2xl transform hover:scale-105 border-2 border-amber-400/30 font-montserrat glow-effect"
            >
              <Church className="w-6 h-6 mr-3" />
              Explore 8-Site Cultural Circuit
            </Button>
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
