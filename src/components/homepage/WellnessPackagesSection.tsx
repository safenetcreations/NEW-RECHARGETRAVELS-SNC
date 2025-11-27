import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Flower2,
  Waves,
  Leaf,
  Heart,
  Star,
  ArrowRight,
  Clock,
  Users
} from 'lucide-react'
import { Link } from 'react-router-dom'

const WellnessPackagesSection = () => {
  const [hoveredCard, setHoveredCard] = useState<string | null>(null)

  const wellnessPackages = [
    {
      id: 'ayurveda-sanctuary',
      title: 'Ayurvedic Healing Sanctuary',
      description: 'Ancient healing wisdom meets modern luxury wellness',
      duration: '10 Days / 9 Nights',
      maxGuests: 6,
      price: 1850,
      image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=600',
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
      image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600',
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
      image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=600',
      gradient: 'from-purple-600 to-indigo-600',
      theme: 'spiritual'
    }
  ]

  return (
    <section className="py-20 bg-gradient-to-b from-emerald-50 to-teal-50">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="flex justify-center items-center mb-6">
            <Flower2 className="w-12 h-12 text-emerald-600 mr-3" />
            <Leaf className="w-10 h-10 text-teal-600 mr-3" />
            <Heart className="w-12 h-12 text-pink-600" />
          </div>
          <h2 className="text-4xl md:text-5xl font-cinzel font-bold text-emerald-900 mb-6">
            Signature Wellness Retreats
          </h2>
          <p className="text-xl text-emerald-800 max-w-3xl mx-auto font-montserrat leading-relaxed">
            Transform your wellbeing with authentic Sri Lankan wellness experiences.
            Ancient healing traditions meet modern luxury in serene natural settings.
          </p>
        </div>

        {/* Wellness Packages Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {wellnessPackages.map((pkg) => (
            <Card
              key={pkg.id}
              className="overflow-hidden hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 bg-white border-2 border-emerald-200 group"
              onMouseEnter={() => setHoveredCard(pkg.id)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <div className="relative h-48 overflow-hidden">
                <img
                  src={pkg.image}
                  alt={pkg.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className={`absolute inset-0 bg-gradient-to-t ${pkg.gradient} opacity-60`}></div>

                {/* Floating Badge */}
                <div className="absolute top-4 right-4">
                  <Badge className="bg-white/95 text-emerald-800 font-semibold px-3 py-1 shadow-lg">
                    <Flower2 className="w-3 h-3 mr-1" />
                    {pkg.theme === 'healing' ? 'Healing' : pkg.theme === 'luxury' ? 'Luxury' : 'Spiritual'}
                  </Badge>
                </div>

                {/* Content Overlay */}
                <div className="absolute bottom-4 left-4 right-4">
                  <h3 className="text-xl font-cinzel font-bold text-white mb-1 drop-shadow-lg">{pkg.title}</h3>
                  <p className="text-white/95 text-sm font-montserrat drop-shadow line-clamp-2">{pkg.description}</p>
                </div>
              </div>

              <CardContent className="p-6">
                <div className="flex items-center justify-between text-sm text-emerald-700 mb-4">
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-1" />
                    {pkg.duration}
                  </div>
                  <div className="flex items-center">
                    <Users className="w-4 h-4 mr-1" />
                    Up to {pkg.maxGuests}
                  </div>
                </div>

                <div className="flex items-center justify-between mb-4">
                  <div>
                    <div className="text-2xl font-bold text-emerald-900">
                      ${pkg.price}
                    </div>
                    <span className="text-sm text-gray-500">per person</span>
                  </div>
                  <div className="flex items-center text-yellow-500">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3 h-3 fill-current" />
                    ))}
                  </div>
                </div>

                <Link to={`/experiences/wellness`} className="block">
                  <Button
                    className={`w-full bg-gradient-to-r ${pkg.gradient} text-white font-semibold transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl`}
                  >
                    Discover Wellness
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <div className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl p-8 text-white shadow-2xl">
            <Waves className="w-16 h-16 text-emerald-300 mx-auto mb-6 animate-pulse" />
            <h3 className="text-3xl font-cinzel font-bold mb-4">
              Begin Your Healing Journey
            </h3>
            <p className="text-lg mb-6 opacity-90 max-w-2xl mx-auto font-montserrat leading-relaxed">
              Transform your life through ancient wisdom and modern wellness practices.
              Experience authentic Ayurvedic healing in Sri Lanka's most serene sanctuaries.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/experiences/wellness">
                <Button
                  size="lg"
                  className="bg-white text-emerald-600 hover:bg-emerald-50 font-semibold px-8 py-3 transition-all duration-300 transform hover:scale-105 shadow-xl"
                >
                  <Heart className="w-5 h-5 mr-2" />
                  Explore All Wellness Retreats
                </Button>
              </Link>
              <Button
                variant="outline"
                size="lg"
                className="border-2 border-white text-white hover:bg-white hover:text-emerald-600 font-semibold px-8 py-3 transition-all duration-300"
              >
                <Flower2 className="w-5 h-5 mr-2" />
                Book Wellness Consultation
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default WellnessPackagesSection