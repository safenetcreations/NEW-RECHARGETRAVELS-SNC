
import { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight, Play } from 'lucide-react'
import { Button } from '@/components/ui/button'

const heroImages = [
  {
    src: 'https://images.unsplash.com/photo-1549366021-9f761d040a94?w=1920',
    alt: 'Safari jeep in Yala National Park',
    caption: 'Premium Safari Vehicles'
  },
  {
    src: 'https://images.unsplash.com/photo-1518877593221-1f28583780b4?w=1920',
    alt: 'Blue whale breaching in Sri Lankan waters',
    caption: 'Magnificent Blue Whales'
  },
  {
    src: 'https://images.unsplash.com/photo-1583212292454-1fe6229603b7?w=1920',
    alt: 'Pod of dolphins jumping in formation',
    caption: 'Playful Dolphin Encounters'
  }
]

interface WildToursHeroProps {
  onBookingStart: () => void
}

const WildToursHero = ({ onBookingStart }: WildToursHeroProps) => {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)

  useEffect(() => {
    if (!isAutoPlaying) return

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroImages.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [isAutoPlaying])

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroImages.length)
    setIsAutoPlaying(false)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + heroImages.length) % heroImages.length)
    setIsAutoPlaying(false)
  }

  return (
    <section className="relative h-screen overflow-hidden">
      {/* Image Carousel */}
      <div className="relative h-full">
        {heroImages.map((image, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentSlide ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <img
              src={image.src}
              alt={image.alt}
              className="w-full h-full object-cover"
              loading={index === 0 ? 'eager' : 'lazy'}
            />
            <div className="absolute inset-0 bg-black/40" />
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-all duration-300"
        aria-label="Previous image"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>
      
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-all duration-300"
        aria-label="Next image"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Slide Indicators */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex space-x-3">
        {heroImages.map((_, index) => (
          <button
            key={index}
            onClick={() => {
              setCurrentSlide(index)
              setIsAutoPlaying(false)
            }}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentSlide ? 'bg-white' : 'bg-white/50'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Content Overlay */}
      <div className="absolute inset-0 z-10 flex items-center justify-center">
        <div className="text-center text-white px-4 max-w-4xl">
          <h1 className="text-5xl md:text-7xl font-playfair font-bold mb-6 leading-tight">
            Experience Sri Lanka's
            <span className="block text-amber-400">Wild Side</span>
          </h1>
          
          <p className="text-xl md:text-2xl mb-4 font-montserrat leading-relaxed max-w-3xl mx-auto">
            Your Way, Your Budget
          </p>
          
          <p className="text-lg mb-8 opacity-90 font-montserrat max-w-2xl mx-auto leading-relaxed">
            Choose from Semi-Luxury experiences with private guides and boutique lodges, 
            or Budget-Friendly adventures with shared tours and authentic guesthouses.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button 
              size="lg"
              onClick={onBookingStart}
              className="bg-amber-500 hover:bg-amber-600 text-black font-semibold px-8 py-4 text-lg transition-all duration-300 transform hover:scale-105"
            >
              Start Your Adventure
            </Button>
            
            <Button 
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-black px-8 py-4 text-lg transition-all duration-300"
            >
              <Play className="w-5 h-5 mr-2" />
              Watch Preview
            </Button>
          </div>
        </div>
      </div>

      {/* Current Image Caption */}
      <div className="absolute bottom-20 left-8 z-10 text-white">
        <p className="text-sm font-montserrat opacity-80">
          {heroImages[currentSlide].caption}
        </p>
      </div>
    </section>
  )
}

export default WildToursHero
