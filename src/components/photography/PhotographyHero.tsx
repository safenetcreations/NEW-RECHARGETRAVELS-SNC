import { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'

const PhotographyHero = () => {
  const [currentSlide, setCurrentSlide] = useState(0)

  const heroSlides = [
    {
      image: '/images/photography/temple-golden-hour.jpg',
      title: 'Sacred Temple Architecture',
      subtitle: 'Golden hour light on ancient stone carvings'
    },
    {
      image: '/images/photography/leopard-portrait.jpg',
      title: 'Wildlife in Yala',
      subtitle: 'Close-up encounters with Sri Lankan leopards'
    },
    {
      image: '/images/photography/train-tea-hills.jpg',
      title: 'Hill Country Trains',
      subtitle: 'Scenic railways winding through tea plantations'
    },
    {
      image: '/images/photography/pettah-market.jpg',
      title: 'Colombo Street Life',
      subtitle: 'Candid moments in Pettah\'s bustling markets'
    }
  ]

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [heroSlides.length])

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length)
  }

  return (
    <section className="relative h-screen overflow-hidden">
      {/* Image Carousel */}
      <div className="relative w-full h-full">
        {heroSlides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentSlide ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <img
              src={slide.image}
              alt={slide.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/40" />
          </div>
        ))}
      </div>

      {/* Content Overlay */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center text-white px-4 max-w-4xl">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 animate-fade-in">
            Capture Sri Lanka
          </h1>
          <p className="text-xl md:text-3xl mb-4 font-light">
            From Sacred Stones to City Streets
          </p>
          <p className="text-lg md:text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            {heroSlides[currentSlide].subtitle}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-3">
              Explore Photography Tours
            </Button>
            <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-black px-8 py-3">
              View Sample Shots
            </Button>
          </div>
        </div>
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full p-3 transition-all duration-200"
        aria-label="Previous slide"
      >
        <ChevronLeft className="w-6 h-6 text-white" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full p-3 transition-all duration-200"
        aria-label="Next slide"
      >
        <ChevronRight className="w-6 h-6 text-white" />
      </button>

      {/* Slide Indicators */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex space-x-2">
        {heroSlides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-200 ${
              index === currentSlide 
                ? 'bg-white scale-110' 
                : 'bg-white/50 hover:bg-white/75'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Slide Title */}
      <div className="absolute bottom-20 left-8 text-white">
        <h2 className="text-2xl font-bold mb-2">{heroSlides[currentSlide].title}</h2>
        <p className="text-white/90">{heroSlides[currentSlide].subtitle}</p>
      </div>
    </section>
  )
}

export default PhotographyHero