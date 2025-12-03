import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Flower2,
  Leaf,
  Heart,
  Sparkles,
  ArrowRight,
  Check,
  Star,
  TreePine,
  Droplets,
  Sun
} from 'lucide-react'
import { Link } from 'react-router-dom'

const WellnessPackagesSection = () => {
  const [hoveredCard, setHoveredCard] = useState<string | null>(null)

  const wellnessExperiences = [
    {
      id: 'wellness',
      title: 'Wellness & Spa Retreats',
      subtitle: 'Rejuvenate Body & Mind',
      description: 'Escape to Sri Lanka\'s most luxurious wellness sanctuaries. Experience world-class spa treatments, yoga sessions, meditation practices, and holistic healing in breathtaking natural settings.',
      image: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=800&q=80',
      link: '/experiences/wellness',
      gradient: 'from-teal-500 via-emerald-500 to-green-600',
      bgGradient: 'from-teal-50 to-emerald-50',
      iconBg: 'bg-gradient-to-br from-teal-500 to-emerald-600',
      icon: Droplets,
      highlights: [
        'Luxury Spa Treatments',
        'Yoga & Meditation',
        'Detox Programs',
        'Mindfulness Retreats',
        'Natural Hot Springs',
        'Wellness Cuisine'
      ],
      stats: { rating: '4.9', reviews: '850+', experiences: '25+' }
    },
    {
      id: 'ayurveda',
      title: 'Ayurveda Healing',
      subtitle: 'Ancient Wisdom, Modern Wellness',
      description: 'Discover the transformative power of 5,000-year-old Ayurvedic traditions. Our certified practitioners offer authentic treatments, personalized therapies, and healing programs in serene heritage retreats.',
      image: 'https://images.unsplash.com/photo-1600334089648-b0d9d3028eb2?w=800&q=80',
      link: '/experiences/ayurveda',
      gradient: 'from-amber-500 via-orange-500 to-yellow-600',
      bgGradient: 'from-amber-50 to-orange-50',
      iconBg: 'bg-gradient-to-br from-amber-500 to-orange-600',
      icon: Leaf,
      highlights: [
        'Panchakarma Detox',
        'Herbal Treatments',
        'Dosha Balancing',
        'Therapeutic Massages',
        'Ayurvedic Cuisine',
        'Wellness Consultation'
      ],
      stats: { rating: '4.9', reviews: '720+', experiences: '18+' }
    }
  ]

  return (
    <section className="py-24 bg-gradient-to-b from-white via-emerald-50/30 to-white relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-br from-emerald-200/30 to-teal-200/30 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-br from-amber-200/30 to-orange-200/30 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-br from-green-100/20 to-teal-100/20 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-100 to-teal-100 px-6 py-2 rounded-full mb-6">
            <Sparkles className="w-5 h-5 text-emerald-600" />
            <span className="text-emerald-700 font-semibold text-sm uppercase tracking-wider">Transform Your Wellbeing</span>
          </div>

          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            <span className="bg-gradient-to-r from-emerald-700 via-teal-600 to-green-700 bg-clip-text text-transparent">
              Wellness & Healing
            </span>
            <br />
            <span className="text-gray-800">Experiences</span>
          </h2>

          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Embark on a transformative journey through Sri Lanka's finest wellness retreats.
            From ancient Ayurvedic traditions to modern spa luxury, discover your path to renewal.
          </p>
        </div>

        {/* Two Column Wellness Cards */}
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 max-w-7xl mx-auto">
          {wellnessExperiences.map((experience) => {
            const IconComponent = experience.icon
            const isHovered = hoveredCard === experience.id

            return (
              <div
                key={experience.id}
                className="group relative"
                onMouseEnter={() => setHoveredCard(experience.id)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                {/* Card Container */}
                <div className={`relative bg-white rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-gray-100`}>

                  {/* Image Section */}
                  <div className="relative h-72 lg:h-80 overflow-hidden">
                    <img
                      src={experience.image}
                      alt={experience.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    {/* Gradient Overlay */}
                    <div className={`absolute inset-0 bg-gradient-to-t ${experience.gradient} opacity-60 group-hover:opacity-70 transition-opacity duration-500`}></div>

                    {/* Floating Icon Badge */}
                    <div className="absolute top-6 left-6">
                      <div className={`${experience.iconBg} p-4 rounded-2xl shadow-lg transform group-hover:scale-110 transition-transform duration-300`}>
                        <IconComponent className="w-8 h-8 text-white" />
                      </div>
                    </div>

                    {/* Rating Badge */}
                    <div className="absolute top-6 right-6 bg-white/95 backdrop-blur-sm rounded-xl px-4 py-2 shadow-lg">
                      <div className="flex items-center gap-1">
                        <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                        <span className="font-bold text-gray-800">{experience.stats.rating}</span>
                        <span className="text-gray-500 text-sm">({experience.stats.reviews})</span>
                      </div>
                    </div>

                    {/* Title Overlay */}
                    <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 via-black/40 to-transparent">
                      <p className="text-emerald-300 font-semibold text-sm mb-1 uppercase tracking-wider">{experience.subtitle}</p>
                      <h3 className="text-3xl font-bold text-white drop-shadow-lg">{experience.title}</h3>
                    </div>
                  </div>

                  {/* Content Section */}
                  <div className={`p-8 bg-gradient-to-br ${experience.bgGradient}`}>
                    <p className="text-gray-700 leading-relaxed mb-6">
                      {experience.description}
                    </p>

                    {/* Highlights Grid */}
                    <div className="grid grid-cols-2 gap-3 mb-8">
                      {experience.highlights.map((highlight, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                          <div className={`w-5 h-5 rounded-full bg-gradient-to-r ${experience.gradient} flex items-center justify-center flex-shrink-0`}>
                            <Check className="w-3 h-3 text-white" />
                          </div>
                          <span className="text-gray-700 text-sm font-medium">{highlight}</span>
                        </div>
                      ))}
                    </div>

                    {/* Stats Row */}
                    <div className="flex items-center justify-between py-4 border-t border-gray-200/50 mb-6">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-gray-800">{experience.stats.experiences}</div>
                        <div className="text-xs text-gray-500 uppercase tracking-wider">Experiences</div>
                      </div>
                      <div className="w-px h-10 bg-gray-200"></div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-gray-800">{experience.stats.reviews}</div>
                        <div className="text-xs text-gray-500 uppercase tracking-wider">Happy Guests</div>
                      </div>
                      <div className="w-px h-10 bg-gray-200"></div>
                      <div className="text-center">
                        <div className="flex items-center justify-center gap-1">
                          <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                          <span className="text-2xl font-bold text-gray-800">{experience.stats.rating}</span>
                        </div>
                        <div className="text-xs text-gray-500 uppercase tracking-wider">Rating</div>
                      </div>
                    </div>

                    {/* CTA Button */}
                    <Link to={experience.link} className="block">
                      <Button
                        className={`w-full bg-gradient-to-r ${experience.gradient} text-white font-bold py-6 text-lg rounded-xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-300 group/btn`}
                      >
                        <span>Explore {experience.id === 'ayurveda' ? 'Ayurveda' : 'Wellness'}</span>
                        <ArrowRight className="w-5 h-5 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                      </Button>
                    </Link>
                  </div>
                </div>

                {/* Decorative Corner Elements */}
                <div className={`absolute -bottom-4 -right-4 w-24 h-24 bg-gradient-to-br ${experience.gradient} opacity-20 rounded-full blur-2xl group-hover:opacity-40 transition-opacity duration-500`}></div>
              </div>
            )
          })}
        </div>

        {/* Bottom CTA Section */}
        <div className="mt-20 text-center">
          <div className="relative inline-block">
            {/* Decorative elements */}
            <div className="absolute -top-6 -left-6 w-12 h-12 bg-gradient-to-br from-emerald-400/30 to-teal-400/30 rounded-full blur-xl"></div>
            <div className="absolute -bottom-6 -right-6 w-16 h-16 bg-gradient-to-br from-amber-400/30 to-orange-400/30 rounded-full blur-xl"></div>

            <div className="relative bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 rounded-3xl p-10 lg:p-12 shadow-2xl overflow-hidden">
              {/* Pattern overlay */}
              <div className="absolute inset-0 opacity-10">
                <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '24px 24px' }}></div>
              </div>

              <div className="relative z-10 max-w-3xl mx-auto">
                <div className="flex items-center justify-center gap-4 mb-6">
                  <Flower2 className="w-10 h-10 text-emerald-200" />
                  <TreePine className="w-8 h-8 text-teal-200" />
                  <Sun className="w-10 h-10 text-amber-200" />
                </div>

                <h3 className="text-3xl lg:text-4xl font-bold text-white mb-4">
                  Begin Your Healing Journey
                </h3>
                <p className="text-lg text-emerald-100 mb-8 leading-relaxed">
                  Not sure which wellness experience is right for you? Our wellness experts
                  can help you choose the perfect retreat based on your needs and preferences.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link to="/experiences/wellness">
                    <Button
                      size="lg"
                      className="bg-white text-emerald-700 hover:bg-emerald-50 font-bold px-8 py-6 text-lg rounded-xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
                    >
                      <Heart className="w-5 h-5 mr-2" />
                      View All Wellness
                    </Button>
                  </Link>
                  <Link to="/experiences/ayurveda">
                    <Button
                      size="lg"
                      className="bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:from-amber-600 hover:to-orange-600 font-bold px-8 py-6 text-lg rounded-xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
                    >
                      <Leaf className="w-5 h-5 mr-2" />
                      Explore Ayurveda
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default WellnessPackagesSection