
import { useState, useRef } from 'react'
import { Helmet } from 'react-helmet-async'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  MapPin, 
  Clock, 
  Star, 
  Heart, 
  Mountain,
  TreePine,
  Compass,
  BookOpen,
  ArrowRight,
  Eye,
  Crown,
  Flame
} from 'lucide-react'
import { toast } from 'sonner'

const RamayanaTrail = () => {
  const [selectedSite, setSelectedSite] = useState<string | null>(null)
  const bookingRef = useRef<HTMLDivElement>(null)

  const handleBookingStart = () => {
    bookingRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const handleSiteSelect = (siteName: string) => {
    setSelectedSite(siteName)
    toast.success(`${siteName} selected! Plan your pilgrimage below.`)
    bookingRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const sacredSites = [
    {
      id: 'sita-eliya',
      title: 'Sita Eliya',
      description: 'Where Sita was held captive, surrounded by beautiful gardens',
      location: 'Nuwara Eliya',
      significance: 'Sita\'s residence during her captivity in Lanka',
      duration: 'Half Day',
      highlights: [
        'Sita\'s meditation spot',
        'Ancient temple ruins',
        'Sacred garden walks',
        'Traditional storytelling',
        'Meditation sessions'
      ],
      image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800',
      mythElement: '🏰'
    },
    {
      id: 'ravana-falls',
      title: 'Ravana Falls',
      description: 'The waterfall where Sita used to bathe during her captivity',
      location: 'Ella',
      significance: 'Sacred bathing place of Sita Devi',
      duration: '2-3 Hours',
      highlights: [
        'Majestic waterfall views',
        'Natural bathing pools',
        'Cave temple visits',
        'Spiritual ceremonies',
        'Photography sessions'
      ],
      image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=800',
      mythElement: '💧'
    },
    {
      id: 'ashok-vatika',
      title: 'Ashok Vatika',
      description: 'The garden where Hanuman first met Sita',
      location: 'Hakgala',
      significance: 'Meeting place of Hanuman and Sita',
      duration: 'Full Day',
      highlights: [
        'Ancient Ashoka trees',
        'Botanical garden tour',
        'Hanuman shrine visit',
        'Guided epic narration',
        'Cultural performances'
      ],
      image: 'https://images.unsplash.com/photo-1588392382834-a891154bca4d?w=800',
      mythElement: '🐒'
    },
    {
      id: 'ravana-cave',
      title: 'Ravana Cave',
      description: 'The mystical cave complex of King Ravana',
      location: 'Ella',
      significance: 'Ravana\'s meditation and strategic planning center',
      duration: 'Half Day',
      highlights: [
        'Underground cave system',
        'Ancient inscriptions',
        'Echo chambers',
        'Mystical atmosphere',
        'Archaeological insights'
      ],
      image: 'https://images.unsplash.com/photo-1485736231968-0c8ad5c9e174?w=800',
      mythElement: '🏔️'
    },
    {
      id: 'divurumpola',
      title: 'Divurumpola',
      description: 'Where Sita proved her purity through the fire ordeal',
      location: 'Matale',
      significance: 'Site of Sita\'s Agni Pariksha (fire test)',
      duration: 'Half Day',
      highlights: [
        'Sacred fire ceremony site',
        'Ancient temple complex',
        'Purity ritual ceremonies',
        'Spiritual counseling',
        'Vedic fire rituals'
      ],
      image: 'https://images.unsplash.com/photo-1537884944318-390069bb8665?w=800',
      mythElement: '🔥'
    },
    {
      id: 'rumassala',
      title: 'Rumassala',
      description: 'The hill of medicinal herbs brought by Hanuman',
      location: 'Galle',
      significance: 'Sanjeevani mountain piece dropped by Hanuman',
      duration: '2-3 Hours',
      highlights: [
        'Medicinal plant sanctuary',
        'Ayurvedic herb walks',
        'Hanuman temple visit',
        'Healing workshops',
        'Panoramic ocean views'
      ],
      image: 'https://images.unsplash.com/photo-1567306226416-28f0efdc88ce?w=800',
      mythElement: '🌿'
    }
  ]

  const pilgrimagePackages = [
    {
      id: 'complete-trail',
      title: 'Complete Ramayana Trail',
      duration: '7 Days / 6 Nights',
      sites: 'All 6 Sacred Sites',
      price: 450,
      includes: ['Professional guide', 'Temple offerings', 'Cultural performances', 'Spiritual ceremonies']
    },
    {
      id: 'essential-sites',
      title: 'Essential Sacred Sites',
      duration: '4 Days / 3 Nights',
      sites: 'Top 4 Sites',
      price: 280,
      includes: ['Expert storyteller', 'Temple visits', 'Meditation sessions', 'Local ceremonies']
    },
    {
      id: 'spiritual-weekend',
      title: 'Spiritual Weekend',
      duration: '2 Days / 1 Night',
      sites: '2 Major Sites',
      price: 150,
      includes: ['Guided tours', 'Temple prayers', 'Cultural insights', 'Sacred offerings']
    }
  ]

  return (
    <>
      <Helmet>
        <title>Ramayana Trail Tours in Sri Lanka - Sacred Pilgrimage Journey | Recharge Travels</title>
        <meta name="description" content="Follow the sacred footsteps of Sita and explore the mythological sites of the Ramayana epic in Sri Lanka. Spiritual pilgrimage tours with expert guides." />
        <meta name="keywords" content="Ramayana trail Sri Lanka, Sita Eliya, Ravana Falls, Ashok Vatika, spiritual tours, pilgrimage, Hindu mythology" />
      </Helmet>
      
      <Header />
      
      {/* Epic Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-r from-orange-900/90 via-red-900/70 to-transparent z-10"></div>
          <img 
            src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920"
            alt="Ancient Temple"
            className="w-full h-full object-cover animate-slow-pan"
          />
        </div>

        {/* Mystical Floating Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(10)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-dust-mote opacity-40"
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${i * 2}s`,
                animationDuration: `${18 + Math.random() * 12}s`
              }}
            >
              <div className="text-2xl">🕉️</div>
            </div>
          ))}
        </div>

        {/* Hero Content */}
        <div className="relative z-20 text-center px-4 max-w-6xl mx-auto">
          <div className="animate-fade-in">
            <div className="text-6xl mb-8 animate-pulse">🏛️</div>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-cinzel font-bold text-white mb-6 tracking-wider">
              RAMAYANA
              <span className="block text-yellow-400 animate-stone-glow">TRAIL</span>
              <span className="block text-2xl md:text-3xl lg:text-4xl font-light opacity-90">
                Sacred Pilgrimage of Lanka
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-white/90 font-montserrat mb-12 max-w-4xl mx-auto leading-relaxed">
              Follow the divine footsteps of Sita Devi through the mythological landscapes of Lanka. 
              Experience the epic tale where gods walked among mortals and legends were born.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Button 
                size="lg"
                onClick={handleBookingStart}
                className="bg-gradient-to-r from-orange-600 to-red-600 text-white hover:from-red-600 hover:to-orange-600 font-semibold px-12 py-4 text-lg transition-all duration-300 transform hover:scale-105 shadow-heritage"
              >
                <BookOpen className="w-6 h-6 mr-3" />
                Begin Sacred Journey
                <ArrowRight className="w-6 h-6 ml-3" />
              </Button>
              <Button 
                variant="outline"
                size="lg"
                className="border-2 border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-black font-semibold px-8 py-4 text-lg transition-all duration-300"
              >
                <Eye className="w-5 h-5 mr-2" />
                Explore Sacred Sites
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Epic Story Introduction */}
      <section className="py-20 bg-gradient-to-b from-orange-900 to-red-900 text-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <div className="text-5xl mb-6">📖</div>
            <h2 className="text-4xl md:text-5xl font-cinzel font-bold text-yellow-400 mb-6">
              The Epic of Lanka
            </h2>
            <p className="text-xl text-white/90 max-w-4xl mx-auto font-montserrat leading-relaxed">
              Thousands of years ago, the beautiful island of Lanka witnessed one of history's greatest epics. 
              Walk in the footsteps of divine beings and experience the places where love, devotion, 
              courage, and righteousness shaped the destiny of nations.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                character: 'Sita Devi',
                description: 'The embodiment of purity and devotion, whose strength during captivity inspires pilgrims',
                symbol: '👸',
                virtue: 'Purity & Devotion'
              },
              {
                character: 'Hanuman',
                description: 'The divine messenger whose courage and loyalty saved the day',
                symbol: '🐒',
                virtue: 'Courage & Loyalty'
              },
              {
                character: 'Ravana',
                description: 'The learned king whose pride led to his downfall, teaching us humility',
                symbol: '👑',
                virtue: 'Knowledge & Humility'
              }
            ].map((character, index) => (
              <Card key={index} className="bg-orange-800/30 border-yellow-400/30 text-white text-center hover:shadow-2xl transition-all duration-300 hover:-translate-y-4">
                <CardContent className="p-8">
                  <div className="text-4xl mb-4">{character.symbol}</div>
                  <h3 className="text-2xl font-cinzel font-bold text-yellow-400 mb-4">{character.character}</h3>
                  <p className="text-white/80 font-montserrat mb-4 leading-relaxed">{character.description}</p>
                  <Badge className="bg-yellow-400 text-black font-semibold">
                    {character.virtue}
                  </Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Sacred Sites */}
      <section className="py-20 bg-gradient-to-b from-amber-50 to-orange-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-cinzel font-bold text-orange-900 mb-6">
              Sacred Sites of the Ramayana
            </h2>
            <p className="text-xl text-orange-800 max-w-3xl mx-auto font-montserrat">
              Discover the locations where the epic tale of Ramayana unfolded in Sri Lanka
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {sacredSites.map((site) => (
              <Card 
                key={site.id} 
                className="overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-4 bg-white border-2 border-orange-200"
              >
                <div className="relative h-56 overflow-hidden">
                  <img 
                    src={site.image} 
                    alt={site.title}
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                  />
                  <div className="absolute top-4 right-4">
                    <div className="text-3xl bg-white/90 rounded-full p-2">
                      {site.mythElement}
                    </div>
                  </div>
                  <div className="absolute bottom-4 left-4 right-4">
                    <Badge className="bg-orange-600 text-white mb-2">
                      <Clock className="w-3 h-3 mr-1" />
                      {site.duration}
                    </Badge>
                    <h3 className="text-xl font-cinzel font-bold text-white mb-1">{site.title}</h3>
                    <p className="text-white/90 text-sm font-montserrat">{site.description}</p>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                </div>

                <CardContent className="p-6 space-y-4">
                  <div className="flex items-center text-sm text-orange-700">
                    <MapPin className="w-4 h-4 mr-2" />
                    <span className="font-semibold">{site.location}</span>
                  </div>

                  <p className="text-orange-800 font-medium text-sm bg-orange-100 p-3 rounded-lg border-l-4 border-orange-400">
                    <strong>Significance:</strong> {site.significance}
                  </p>

                  <ul className="space-y-1">
                    {site.highlights.slice(0, 3).map((highlight, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm font-montserrat">
                        <Star className="w-4 h-4 text-yellow-500 flex-shrink-0 mt-0.5" />
                        <span>{highlight}</span>
                      </li>
                    ))}
                  </ul>

                  <Button 
                    onClick={() => handleSiteSelect(site.title)}
                    className="w-full bg-gradient-to-r from-orange-600 to-red-600 text-white hover:from-red-600 hover:to-orange-600 font-semibold transition-all duration-300 hover:scale-105"
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    Visit This Sacred Site
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pilgrimage Packages */}
      <section className="py-20 bg-gradient-to-r from-orange-900 to-red-900 text-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <div className="text-5xl mb-6">🛤️</div>
            <h2 className="text-4xl md:text-5xl font-cinzel font-bold text-yellow-400 mb-6">
              Pilgrimage Packages
            </h2>
            <p className="text-xl text-white/90 max-w-3xl mx-auto font-montserrat">
              Choose your spiritual journey based on time and devotion
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {pilgrimagePackages.map((pkg) => (
              <Card key={pkg.id} className="bg-orange-800/30 border-yellow-400/30 text-white hover:shadow-2xl transition-all duration-300 hover:-translate-y-4">
                <CardHeader className="text-center">
                  <CardTitle className="text-2xl font-cinzel text-yellow-400">{pkg.title}</CardTitle>
                  <div className="text-white/80 font-montserrat">
                    <div className="flex items-center justify-center gap-4 text-sm mt-2">
                      <span className="flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        {pkg.duration}
                      </span>
                      <span className="flex items-center">
                        <MapPin className="w-4 h-4 mr-1" />
                        {pkg.sites}
                      </span>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-6">
                  <ul className="space-y-2">
                    {pkg.includes.map((item, index) => (
                      <li key={index} className="flex items-center gap-2 text-sm font-montserrat">
                        <Star className="w-4 h-4 text-yellow-400 flex-shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="border-t border-yellow-400/30 pt-6">
                    <div className="text-center mb-4">
                      <div className="text-3xl font-bold text-yellow-400">
                        ${pkg.price}
                        <span className="text-sm font-normal text-white/70">/person</span>
                      </div>
                    </div>
                    <Button 
                      onClick={() => handleSiteSelect(pkg.title)}
                      className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 text-black hover:from-orange-500 hover:to-yellow-500 font-semibold transition-all duration-300 hover:scale-105"
                    >
                      <BookOpen className="w-4 h-4 mr-2" />
                      Begin This Journey
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Booking Section */}
      <section ref={bookingRef} className="py-20 bg-gradient-to-r from-yellow-600 to-orange-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <div className="text-6xl mb-8">🕉️</div>
          <h2 className="text-4xl md:text-5xl font-cinzel font-bold mb-6">
            Begin Your Sacred Pilgrimage
          </h2>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto font-montserrat">
            Let the ancient wisdom guide your journey through the sacred lands of Lanka
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Button 
              size="lg"
              className="bg-white text-orange-600 hover:bg-gray-100 font-semibold px-8 py-4 text-lg transition-all duration-300 transform hover:scale-105"
            >
              <BookOpen className="w-5 h-5 mr-2" />
              Plan Sacred Journey
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              className="border-2 border-white text-white hover:bg-white hover:text-orange-600 font-semibold px-8 py-4 text-lg transition-all duration-300"
            >
              <Compass className="w-5 h-5 mr-2" />
              Consult Spiritual Guide
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </>
  )
}

export default RamayanaTrail
