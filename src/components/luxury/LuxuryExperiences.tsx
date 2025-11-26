
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Crown, Building2, Camera, Utensils, Waves, Mountain, Leaf, 
  Star, Users, Clock, MapPin, ArrowRight, Gem, Heart, Shield
} from 'lucide-react'

const LuxuryExperiences = () => {
  const experienceCategories = [
    {
      title: 'Cultural Immersion',
      icon: Building2,
      color: 'from-purple-600 to-indigo-800',
      experiences: [
        {
          name: 'Private Temple Ceremonies',
          description: 'Exclusive access to sacred temple rituals with resident monks',
          duration: '3-4 hours',
          participants: 'Up to 8',
          price: 5000,
          image: 'https://images.unsplash.com/photo-1580477667995-2b94f01c9516?w=600&h=400&fit=crop',
          highlights: ['High Monk Blessings', 'Sacred Chanting', 'Private Meditation', 'Cultural Education']
        },
        {
          name: 'Royal Palace Audiences',
          description: 'Private meetings with cultural dignitaries and historians',
          duration: '2-3 hours',
          participants: 'Up to 6',
          price: 8000,
          image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=600&h=400&fit=crop',
          highlights: ['Cultural Dignitaries', 'Historical Insights', 'Royal Protocols', 'Private Archives']
        },
        {
          name: 'Master Craftsman Workshops',
          description: 'Learn traditional arts from renowned Sri Lankan masters',
          duration: '4-6 hours',
          participants: 'Up to 4',
          price: 3500,
          image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&h=400&fit=crop',
          highlights: ['Gem Cutting', 'Wood Carving', 'Traditional Dance', 'Batik Creation']
        }
      ]
    },
    {
      title: 'Adventure Luxury',
      icon: Mountain,
      color: 'from-green-600 to-emerald-800',
      experiences: [
        {
          name: 'Helicopter Elephant Safari',
          description: 'Aerial wildlife viewing followed by exclusive ground encounters',
          duration: '6-8 hours',
          participants: 'Up to 6',
          price: 12000,
          image: 'https://images.unsplash.com/photo-1549366021-9f761d040a94?w=600&h=400&fit=crop',
          highlights: ['Helicopter Safari', 'Elephant Encounters', 'Expert Guides', 'Luxury Picnic']
        },
        {
          name: 'Private Hot Air Balloon',
          description: 'Sunrise balloon flights over ancient cities and landscapes',
          duration: '4-5 hours',
          participants: 'Up to 4',
          price: 8500,
          image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=400&fit=crop',
          highlights: ['Sunrise Views', 'Ancient Cities', 'Champagne Service', 'Professional Photos']
        },
        {
          name: 'Exclusive Diving Expeditions',
          description: 'Private diving to underwater temples and coral reefs',
          duration: '8-10 hours',
          participants: 'Up to 8',
          price: 6500,
          image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=600&h=400&fit=crop',
          highlights: ['Underwater Temples', 'Coral Gardens', 'Marine Biologist', 'Luxury Yacht']
        }
      ]
    },
    {
      title: 'Wellness & Spirituality',
      icon: Leaf,
      color: 'from-teal-600 to-cyan-800',
      experiences: [
        {
          name: 'Royal Ayurveda Retreat',
          description: 'Traditional healing treatments using ancient royal recipes',
          duration: '3-7 days',
          participants: 'Up to 2',
          price: 15000,
          image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=600&h=400&fit=crop',
          highlights: ['Royal Treatments', 'Ancient Recipes', 'Master Practitioners', 'Private Pavilion']
        },
        {
          name: 'Meditation with Buddhist Masters',
          description: 'Private meditation sessions with renowned Buddhist teachers',
          duration: '2-4 hours',
          participants: 'Up to 6',
          price: 4500,
          image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=600&h=400&fit=crop',
          highlights: ['Buddhist Masters', 'Sacred Locations', 'Personal Guidance', 'Spiritual Insights']
        },
        {
          name: 'Traditional Healing Ceremonies',
          description: 'Authentic spiritual healing rituals with village shamans',
          duration: '4-6 hours',
          participants: 'Up to 4',
          price: 3000,
          image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=400&fit=crop',
          highlights: ['Village Shamans', 'Healing Rituals', 'Sacred Plants', 'Spiritual Cleansing']
        }
      ]
    },
    {
      title: 'Culinary Excellence',
      icon: Utensils,
      color: 'from-orange-600 to-red-800',
      experiences: [
        {
          name: 'Michelin Chef Residencies',
          description: 'Private cooking experiences with world-renowned chefs',
          duration: '4-6 hours',
          participants: 'Up to 8',
          price: 10000,
          image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&h=400&fit=crop',
          highlights: ['Michelin Chefs', 'Local Ingredients', 'Private Kitchen', 'Wine Pairings']
        },
        {
          name: 'Royal Feast Recreations',
          description: 'Historical royal banquets recreated with authentic recipes',
          duration: '3-4 hours',
          participants: 'Up to 12',
          price: 7500,
          image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&h=400&fit=crop',
          highlights: ['Royal Recipes', 'Historical Context', 'Traditional Service', 'Cultural Performance']
        },
        {
          name: 'Tea Estate Master Classes',
          description: 'Private tea tasting and blending with estate masters',
          duration: '4-5 hours',
          participants: 'Up to 6',
          price: 4000,
          image: 'https://images.unsplash.com/photo-1545048702-79362596cdc9?w=600&h=400&fit=crop',
          highlights: ['Tea Masters', 'Estate Tours', 'Custom Blending', 'Luxury Accommodation']
        }
      ]
    }
  ]

  const exclusiveServices = [
    {
      title: 'Personal Documentation',
      description: 'Professional photography and videography of your experiences',
      icon: Camera,
      features: ['Professional Crew', 'Cinematic Quality', 'Same-Day Editing', 'Private Gallery']
    },
    {
      title: 'Cultural Concierge',
      description: 'Expert cultural guidance and protocol assistance',
      icon: Crown,
      features: ['Cultural Expert', 'Protocol Guidance', 'Language Support', 'Insider Access']
    },
    {
      title: 'Privacy & Security',
      description: 'Discreet security and complete privacy protection',
      icon: Shield,
      features: ['Security Detail', 'Privacy Protection', 'Confidentiality', 'Emergency Response']
    },
    {
      title: 'Custom Experiences',
      description: 'Bespoke experiences designed around your interests',
      icon: Heart,
      features: ['Personal Curation', 'Unlimited Customization', 'Unique Access', 'Exclusive Arrangements']
    }
  ]

  return (
    <section className="py-32 bg-gradient-to-b from-white to-ivory">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-20">
          <Badge className="bg-gradient-to-r from-purple-600 to-indigo-700 text-white font-semibold px-6 py-2 mb-6">
            <Gem className="w-4 h-4 mr-2" />
            Exclusive Experiences
          </Badge>
          <h2 className="text-6xl md:text-7xl font-bold text-navy mb-8 font-playfair">
            Unforgettable Moments
          </h2>
          <p className="text-2xl text-slate-600 max-w-4xl mx-auto leading-relaxed">
            Immerse yourself in Sri Lanka's rich heritage with experiences that money can't usually buy. 
            Each moment is crafted to create lasting memories and profound connections.
          </p>
        </div>

        {/* Experience Categories */}
        <div className="space-y-24">
          {experienceCategories.map((category, categoryIndex) => {
            const IconComponent = category.icon
            
            return (
              <div key={category.title} className="space-y-12">
                {/* Category Header */}
                <div className="text-center">
                  <div className={`w-20 h-20 bg-gradient-to-r ${category.color} rounded-full flex items-center justify-center mx-auto mb-6`}>
                    <IconComponent className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="text-4xl font-bold text-navy mb-4 font-playfair">{category.title}</h3>
                </div>

                {/* Experiences Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {category.experiences.map((experience, experienceIndex) => (
                    <Card key={experience.name} className="overflow-hidden hover:shadow-2xl transition-all duration-500 hover:scale-105 bg-white border-0 shadow-xl">
                      {/* Experience Image */}
                      <div className="relative h-64 overflow-hidden">
                        <img
                          src={experience.image}
                          alt={experience.name}
                          className="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                        <div className="absolute top-4 left-4">
                          <Badge className="bg-gradient-to-r from-gold to-amber-500 text-navy font-semibold">
                            Exclusive
                          </Badge>
                        </div>
                        <div className="absolute bottom-4 left-4 text-white">
                          <div className="text-2xl font-bold">${experience.price.toLocaleString()}</div>
                          <div className="text-sm opacity-80">per experience</div>
                        </div>
                      </div>

                      <CardHeader>
                        <CardTitle className="text-xl font-bold text-navy font-playfair">
                          {experience.name}
                        </CardTitle>
                        <CardDescription className="text-slate-600">
                          {experience.description}
                        </CardDescription>
                        <div className="flex items-center space-x-4 text-sm text-slate-500 mt-2">
                          <div className="flex items-center space-x-1">
                            <Clock className="w-4 h-4" />
                            <span>{experience.duration}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Users className="w-4 h-4" />
                            <span>{experience.participants}</span>
                          </div>
                        </div>
                      </CardHeader>

                      <CardContent className="space-y-4">
                        {/* Highlights */}
                        <div className="space-y-2">
                          <h4 className="font-semibold text-navy">Exclusive Highlights:</h4>
                          <div className="grid grid-cols-2 gap-2">
                            {experience.highlights.map((highlight, idx) => (
                              <div key={idx} className="flex items-center space-x-2">
                                <Star className="w-3 h-3 text-gold" />
                                <span className="text-sm text-slate-600">{highlight}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* CTA Button */}
                        <Button className="w-full bg-gradient-to-r from-navy to-slate-800 text-white font-semibold hover:shadow-xl transition-all duration-300 mt-6">
                          Reserve Experience
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )
          })}
        </div>

        {/* Exclusive Services */}
        <div className="mt-32">
          <div className="text-center mb-16">
            <h3 className="text-4xl font-bold text-navy mb-6 font-playfair">Exclusive Services</h3>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Every experience is enhanced with our signature services designed to ensure 
              perfection in every detail and complete satisfaction in every moment.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {exclusiveServices.map((service, index) => {
              const IconComponent = service.icon
              
              return (
                <Card key={service.title} className="text-center hover:shadow-xl transition-all duration-300 bg-white border-gold/20">
                  <CardHeader>
                    <div className="w-16 h-16 bg-gradient-to-r from-gold to-amber-500 rounded-full flex items-center justify-center mx-auto mb-4">
                      <IconComponent className="w-8 h-8 text-navy" />
                    </div>
                    <CardTitle className="text-lg font-semibold text-navy">{service.title}</CardTitle>
                    <CardDescription className="text-slate-600">
                      {service.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {service.features.map((feature, idx) => (
                        <div key={idx} className="flex items-center justify-center space-x-2">
                          <div className="w-1.5 h-1.5 bg-gold rounded-full"></div>
                          <span className="text-sm text-slate-600">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>

        {/* Call to Action */}
        <div className="mt-20 text-center">
          <div className="bg-gradient-to-r from-navy to-slate-800 rounded-3xl p-12 text-white">
            <h3 className="text-4xl font-bold mb-6 font-playfair">Create Your Perfect Experience</h3>
            <p className="text-xl text-ivory/80 mb-8 max-w-2xl mx-auto">
              Our experience curators will design the perfect combination of cultural immersion, 
              adventure, wellness, and culinary excellence tailored to your personal interests.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-gradient-to-r from-gold to-amber-500 text-navy font-bold px-8 py-3 hover:shadow-xl transition-all duration-300">
                <Crown className="w-5 h-5 mr-2" />
                Curate My Journey
              </Button>
              <Button size="lg" variant="outline" className="border-2 border-gold text-gold hover:bg-gold hover:text-navy font-semibold px-8 py-3 transition-all duration-300">
                Explore All Experiences
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default LuxuryExperiences
