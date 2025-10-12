
import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Crown, Star, Globe, Calendar, ArrowRight, Play } from 'lucide-react'

const LuxuryHero = () => {
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0)

  const luxuryVideos = [
    '/videos/luxury/sri-lanka-helicopter-luxury.mp4',
    '/videos/luxury/private-beach-villa.mp4',  
    '/videos/luxury/royal-temple-ceremony.mp4'
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentVideoIndex((prev) => (prev + 1) % luxuryVideos.length)
    }, 8000)
    return () => clearInterval(interval)
  }, [])

  return (
    <section className="relative min-h-screen overflow-hidden bg-navy">
      {/* Video Background */}
      <div className="absolute inset-0 w-full h-full">
        <div className="relative w-full h-full">
          {/* Fallback background image */}
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-opacity duration-1000"
            style={{ 
              backgroundImage: `url('https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&h=1080&fit=crop&crop=center')`
            }}
          />
          
          {/* Video overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-navy/80 via-navy/60 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-navy/90 via-transparent to-navy/40" />
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 h-screen flex items-center">
        <div className="max-w-4xl">
          {/* Premium Badge */}
          <div className="flex items-center space-x-4 mb-8">
            <Badge className="bg-gradient-to-r from-gold to-amber-500 text-navy font-semibold px-6 py-2 text-sm">
              <Crown className="w-4 h-4 mr-2" />
              Ultra-Luxury Experiences
            </Badge>
            <div className="flex items-center space-x-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-5 h-5 fill-gold text-gold" />
              ))}
              <span className="text-gold font-medium ml-2">Exclusive</span>
            </div>
          </div>

          {/* Main Headline */}
          <h1 className="text-7xl md:text-8xl lg:text-9xl font-bold text-white mb-8 leading-none font-playfair">
            Million Dollar
            <span className="block text-transparent bg-gradient-to-r from-gold via-amber-400 to-gold bg-clip-text">
              Sri Lanka
            </span>
          </h1>

          {/* Subheadline */}
          <p className="text-2xl md:text-3xl text-ivory/90 mb-8 leading-relaxed max-w-3xl">
            Bespoke luxury experiences crafted exclusively for ultra-high-net-worth individuals. 
            From private jet arrivals to presidential suite accommodations.
          </p>

          {/* Key Features */}
          <div className="flex flex-wrap gap-6 mb-12 text-ivory/80">
            <div className="flex items-center space-x-2">
              <Globe className="w-5 h-5 text-gold" />
              <span className="font-medium">Private Jet Transfers</span>
            </div>
            <div className="flex items-center space-x-2">
              <Crown className="w-5 h-5 text-gold" />
              <span className="font-medium">7-Star Villa Collection</span>
            </div>
            <div className="flex items-center space-x-2">
              <Star className="w-5 h-5 text-gold" />
              <span className="font-medium">24/7 Personal Concierge</span>
            </div>
          </div>

          {/* Call to Action */}
          <div className="flex flex-col sm:flex-row gap-6">
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-gold to-amber-500 text-navy font-bold px-12 py-4 text-lg hover:shadow-2xl hover:scale-105 transition-all duration-300"
            >
              Begin Your Journey
              <ArrowRight className="w-6 h-6 ml-2" />
            </Button>
            
            <Button 
              size="lg"
              variant="outline" 
              className="border-2 border-gold text-gold hover:bg-gold hover:text-navy font-semibold px-12 py-4 text-lg transition-all duration-300"
            >
              <Play className="w-5 h-5 mr-2" />
              Watch Experiences
            </Button>
          </div>

          {/* Premium Pricing Indicator */}
          <div className="mt-12 flex items-center space-x-8 text-ivory/70">
            <div className="text-center">
              <div className="text-3xl font-bold text-gold">$25K+</div>
              <div className="text-sm">Starting Experiences</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-gold">$500K+</div>
              <div className="text-sm">Ultimate Packages</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-gold">∞</div>
              <div className="text-sm">Fully Bespoke</div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-gold animate-bounce">
        <div className="flex flex-col items-center space-y-2">
          <div className="w-6 h-10 border-2 border-gold rounded-full flex justify-center">
            <div className="w-1 h-3 bg-gold rounded-full mt-2 animate-pulse"></div>
          </div>
          <span className="text-xs font-medium">Discover Luxury</span>
        </div>
      </div>
    </section>
  )
}

export default LuxuryHero
