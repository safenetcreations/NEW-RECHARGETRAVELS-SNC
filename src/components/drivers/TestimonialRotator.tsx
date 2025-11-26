
import React, { useState, useEffect } from 'react'
import { Star, ChevronLeft, ChevronRight } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

interface Testimonial {
  id: string
  name: string
  photo: string
  rating: number
  comment: string
  date: string
  tripType: string
}

interface TestimonialRotatorProps {
  testimonials: Testimonial[]
  autoRotate?: boolean
  rotationInterval?: number
}

const TestimonialRotator: React.FC<TestimonialRotatorProps> = ({ 
  testimonials, 
  autoRotate = true, 
  rotationInterval = 5000 
}) => {
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    if (!autoRotate || testimonials.length <= 1) return

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length)
    }, rotationInterval)

    return () => clearInterval(interval)
  }, [autoRotate, rotationInterval, testimonials.length])

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length)
  }

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length)
  }

  const goToTestimonial = (index: number) => {
    setCurrentIndex(index)
  }

  if (!testimonials.length) return null

  const currentTestimonial = testimonials[currentIndex]

  return (
    <div className="relative">
      <Card className="border-0 shadow-lg">
        <CardContent className="p-8">
          <div className="text-center">
            {/* Rating Stars */}
            <div className="flex justify-center mb-4">
              {[...Array(currentTestimonial.rating)].map((_, i) => (
                <Star key={i} className="w-6 h-6 text-yellow-400 fill-current" />
              ))}
            </div>
            
            {/* Quote */}
            <blockquote className="text-xl text-gray-700 leading-relaxed mb-6 min-h-[3.5rem] flex items-center justify-center">
              <span>"{currentTestimonial.comment}"</span>
            </blockquote>
            
            {/* Author */}
            <div className="flex items-center justify-center space-x-4">
              <img 
                src={currentTestimonial.photo}
                alt={currentTestimonial.name}
                className="w-12 h-12 rounded-full object-cover border-2 border-gray-200"
              />
              <div className="text-left">
                <div className="font-medium text-gray-900">{currentTestimonial.name}</div>
                <div className="text-sm text-gray-500">{currentTestimonial.tripType}</div>
                <div className="text-xs text-gray-400">
                  {new Date(currentTestimonial.date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long'
                  })}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Navigation Controls */}
      {testimonials.length > 1 && (
        <>
          {/* Arrow Navigation */}
          <Button
            variant="ghost"
            size="sm"
            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white shadow-md"
            onClick={prevTestimonial}
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white shadow-md"
            onClick={nextTestimonial}
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
          
          {/* Dot Indicators */}
          <div className="flex justify-center mt-6 space-x-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => goToTestimonial(index)}
                className={`w-3 h-3 rounded-full transition-colors duration-200 ${
                  index === currentIndex ? 'bg-orange-600' : 'bg-gray-300 hover:bg-gray-400'
                }`}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>
        </>
      )}
      
      {/* Progress Bar (if auto-rotating) */}
      {autoRotate && testimonials.length > 1 && (
        <div className="mt-4 w-full bg-gray-200 h-1 rounded-full overflow-hidden">
          <div 
            className="h-full bg-orange-600 transition-all ease-linear"
            style={{
              width: '100%',
              animation: `progress ${rotationInterval}ms linear infinite`
            }}
          />
        </div>
      )}
      
      <style>{`
        @keyframes progress {
          0% { width: 0%; }
          100% { width: 100%; }
        }
      `}</style>
    </div>
  )
}

export default TestimonialRotator
