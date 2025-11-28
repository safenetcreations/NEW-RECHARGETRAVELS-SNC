
import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { 
  Star, Shield, Car, Users, MapPin, Clock, Phone, Mail, 
  CheckCircle, Award, Globe, Calendar, ArrowLeft, Play 
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import DriverBookingModal from '@/components/drivers/DriverBookingModal'

interface ProviderProfile {
  id: string
  name: string
  slug: string
  type: 'company' | 'independent'
  rating: number
  reviewCount: number
  startingRate: number
  description: string
  longDescription: string
  profileImage: string
  heroVideo?: string
  heroImage: string
  verified: boolean
  responseTime: string
  languages: string[]
  specialties: string[]
  credentials: {
    registration?: string
    insurance: string
    license: string
    experience: string
    fleetSize?: number
  }
  vehicles: {
    id: string
    type: string
    make: string
    model: string
    seats: number
    features: string[]
    images: string[]
    dailyRate: number
  }[]
  services: {
    category: string
    items: string[]
  }[]
  testimonials: {
    id: string
    name: string
    photo: string
    rating: number
    comment: string
    date: string
    tripType: string
  }[]
  contact: {
    phone: string
    whatsapp: string
    email: string
  }
  location: string
  coverage: string[]
}

const mockProvider: ProviderProfile = {
  id: '1',
  name: 'Kenny - Trusted Local Guide',
  slug: 'kenny-trusted-local-guide',
  type: 'independent',
  rating: 4.9,
  reviewCount: 89,
  startingRate: 65,
  description: 'Independent owner-operator with 8 years experience',
  longDescription: 'Born and raised in Kandy, Kenny has been sharing the beauty of Sri Lanka with travelers for over 8 years. As an independent owner-operator, he offers personalized service with deep local knowledge and genuine passion for his country. Kenny specializes in photography tours, cultural experiences, and off-the-beaten-path adventures that larger companies often miss.',
  profileImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop',
  heroImage: 'https://images.unsplash.com/photo-1588001400947-6385aef4ab0e?w=1200&h=600&fit=crop',
  heroVideo: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4',
  verified: true,
  responseTime: '< 30 mins',
  languages: ['English', 'Sinhala', 'German'],
  specialties: ['Photography Tours', 'Ancient Cities', 'Local Cuisine', 'Hidden Gems'],
  credentials: {
    license: 'Professional Driving License (8 years)',
    insurance: 'Comprehensive Vehicle & Passenger Insurance',
    experience: '8+ Years guiding international tourists',
  },
  vehicles: [
    {
      id: '1',
      type: 'SUV',
      make: 'Toyota',
      model: 'Prado',
      seats: 7,
      features: ['A/C', 'Wi-Fi', 'USB Charging', 'Cooler Box'],
      images: ['https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=400&h=300&fit=crop'],
      dailyRate: 75
    },
    {
      id: '2',
      type: 'Sedan',
      make: 'Honda',
      model: 'Civic',
      seats: 4,
      features: ['A/C', 'GPS', 'USB Charging'],
      images: ['https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=400&h=300&fit=crop'],
      dailyRate: 55
    }
  ],
  services: [
    {
      category: 'Guide Services',
      items: ['Historical narratives', 'Photography assistance', 'Local restaurant recommendations', 'Cultural etiquette guidance']
    },
    {
      category: 'Special Arrangements',
      items: ['Temple visit coordination', 'Local family visits', 'Spice garden tours', 'Gem mining experiences']
    },
    {
      category: 'Photography Services',
      items: ['Golden hour shoots', 'Drone photography (licensed)', 'Cultural portrait sessions', 'Landscape composition guidance']
    }
  ],
  testimonials: [
    {
      id: '1',
      name: 'Sarah Johnson',
      photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=60&h=60&fit=crop',
      rating: 5,
      comment: 'Kenny made our Sri Lanka trip absolutely magical! His knowledge of photography spots and local culture is incredible. We discovered places we never would have found otherwise.',
      date: '2024-01-15',
      tripType: 'Photography Tour'
    },
    {
      id: '2',
      name: 'Michael Schmidt',
      photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=60&h=60&fit=crop',
      rating: 5,
      comment: 'Fantastic experience with Kenny. His German was helpful for my family, and he showed us authentic Sri Lankan cuisine spots. Highly recommended!',
      date: '2024-01-08',
      tripType: 'Cultural Tour'
    }
  ],
  contact: {
    phone: '+94 77 772 1999',
    whatsapp: '+94 77 772 1999',
    email: 'kenny@srilankaguide.lk'
  },
  location: 'Based in Kandy',
  coverage: ['Central Province', 'Cultural Triangle', 'Hill Country', 'Western Province']
}

const DriverGuideProfile = () => {
  const { slug } = useParams()
  const [provider, setProvider] = useState<ProviderProfile | null>(null)
  const [activeVehicle, setActiveVehicle] = useState(0)
  const [showBookingModal, setShowBookingModal] = useState(false)
  const [activeTestimonial, setActiveTestimonial] = useState(0)

  useEffect(() => {
    // In real implementation, fetch provider by slug
    setProvider(mockProvider)
  }, [slug])

  useEffect(() => {
    const interval = setInterval(() => {
      if (provider) {
        setActiveTestimonial((prev) => (prev + 1) % provider.testimonials.length)
      }
    }, 5000)
    return () => clearInterval(interval)
  }, [provider])

  if (!provider) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": provider.name,
    "description": provider.description,
    "image": provider.profileImage,
    "telephone": provider.contact.phone,
    "email": provider.contact.email,
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": provider.rating,
      "reviewCount": provider.reviewCount
    },
    "priceRange": `$${provider.startingRate}+`,
    "serviceType": "Private Driver and Guide Services"
  }

  return (
    <>
      <Helmet>
        <title>{provider.name} - Private Driver & Guide Sri Lanka</title>
        <meta name="description" content={`${provider.description}. Rated ${provider.rating}/5 by ${provider.reviewCount} travelers. Starting from $${provider.startingRate}/day.`} />
        <script type="application/ld+json">
          {JSON.stringify(jsonLd)}
        </script>
      </Helmet>

      <div className="min-h-screen bg-background">
        {/* Navigation */}
        <div className="bg-white shadow-sm">
          <div className="container mx-auto px-4 py-4">
            <Link to="/tours/driver-guide" className="flex items-center text-gray-600 hover:text-orange-600">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Driver & Guide Services
            </Link>
          </div>
        </div>

        {/* Hero Section */}
        <section className="relative h-[60vh] overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent z-10" />
          
          {provider.heroVideo ? (
            <div className="relative w-full h-full">
              <img 
                src={provider.heroImage}
                alt={`${provider.name} in action`}
                className="w-full h-full object-cover"
              />
              <Button 
                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20 bg-white/20 hover:bg-white/30 backdrop-blur-sm"
                size="lg"
              >
                <Play className="w-6 h-6 mr-2" />
                Watch Video
              </Button>
            </div>
          ) : (
            <img 
              src={provider.heroImage}
              alt={`${provider.name} in action`}
              className="w-full h-full object-cover"
            />
          )}

          <div className="absolute bottom-0 left-0 right-0 z-20 p-8">
            <div className="container mx-auto">
              <div className="flex items-end justify-between">
                <div className="text-white">
                  <div className="flex items-center mb-4">
                    <img 
                      src={provider.profileImage}
                      alt={provider.name}
                      className="w-20 h-20 rounded-full border-4 border-white mr-6"
                    />
                    <div>
                      <h1 className="text-4xl font-bold mb-2">{provider.name}</h1>
                      <div className="flex items-center space-x-4">
                        <Badge 
                          className={provider.type === 'company' ? 'bg-blue-600' : 'bg-green-600'}
                        >
                          {provider.type === 'company' ? 'Registered Company' : 'Owner-Operator'}
                        </Badge>
                        {provider.verified && (
                          <div className="flex items-center">
                            <CheckCircle className="w-5 h-5 text-green-400 mr-1" />
                            <span>Verified</span>
                          </div>
                        )}
                        <div className="flex items-center">
                          <Star className="w-5 h-5 text-yellow-400 fill-current mr-1" />
                          <span className="font-medium">{provider.rating}</span>
                          <span className="ml-1 opacity-80">({provider.reviewCount} reviews)</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="text-right text-white">
                  <div className="text-3xl font-bold">${provider.startingRate}<span className="text-lg font-normal">/day</span></div>
                  <div className="text-sm opacity-80">Starting rate</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Main Content */}
            <div className="lg:col-span-2">
              <Tabs defaultValue="about" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="about">About</TabsTrigger>
                  <TabsTrigger value="vehicles">Vehicles</TabsTrigger>
                  <TabsTrigger value="services">Services</TabsTrigger>
                  <TabsTrigger value="reviews">Reviews</TabsTrigger>
                </TabsList>

                <TabsContent value="about" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>About {provider.name}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-700 leading-relaxed mb-6">
                        {provider.longDescription}
                      </p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <h4 className="font-semibold mb-3">Languages</h4>
                          <div className="flex flex-wrap gap-2">
                            {provider.languages.map((lang, index) => (
                              <Badge key={index} variant="secondary">
                                <Globe className="w-3 h-3 mr-1" />
                                {lang}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        
                        <div>
                          <h4 className="font-semibold mb-3">Specialties</h4>
                          <div className="flex flex-wrap gap-2">
                            {provider.specialties.map((specialty, index) => (
                              <Badge key={index} variant="outline">
                                {specialty}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Credentials & Verification</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {Object.entries(provider.credentials).map(([key, value]) => (
                          <div key={key} className="flex items-start">
                            <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5" />
                            <div>
                              <div className="font-medium capitalize">{key.replace(/([A-Z])/g, ' $1')}</div>
                              <div className="text-gray-600">{value}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="vehicles" className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {provider.vehicles.map((vehicle, index) => (
                      <Card key={vehicle.id}>
                        <CardHeader>
                          <CardTitle className="flex items-center justify-between">
                            <span>{vehicle.make} {vehicle.model}</span>
                            <Badge>{vehicle.type}</Badge>
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <img 
                            src={vehicle.images[0]}
                            alt={`${vehicle.make} ${vehicle.model}`}
                            className="w-full h-48 object-cover rounded-lg mb-4"
                          />
                          
                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center">
                                <Users className="w-4 h-4 mr-2 text-gray-500" />
                                <span>{vehicle.seats} seats</span>
                              </div>
                              <div className="text-2xl font-bold text-orange-600">
                                ${vehicle.dailyRate}<span className="text-sm font-normal text-gray-600">/day</span>
                              </div>
                            </div>
                            
                            <div>
                              <h5 className="font-medium mb-2">Features</h5>
                              <div className="flex flex-wrap gap-2">
                                {vehicle.features.map((feature, i) => (
                                  <Badge key={i} variant="secondary" className="text-xs">
                                    {feature}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="services" className="space-y-6">
                  {provider.services.map((service, index) => (
                    <Card key={index}>
                      <CardHeader>
                        <CardTitle>{service.category}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {service.items.map((item, i) => (
                            <div key={i} className="flex items-center">
                              <CheckCircle className="w-4 h-4 text-green-500 mr-3" />
                              <span>{item}</span>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </TabsContent>

                <TabsContent value="reviews" className="space-y-6">
                  <div className="grid grid-cols-1 gap-6">
                    {provider.testimonials.map((testimonial) => (
                      <Card key={testimonial.id}>
                        <CardContent className="pt-6">
                          <div className="flex items-start space-x-4">
                            <img 
                              src={testimonial.photo}
                              alt={testimonial.name}
                              className="w-12 h-12 rounded-full object-cover"
                            />
                            <div className="flex-1">
                              <div className="flex items-center justify-between mb-2">
                                <div>
                                  <div className="font-medium">{testimonial.name}</div>
                                  <div className="text-sm text-gray-500">{testimonial.tripType}</div>
                                </div>
                                <div className="flex items-center">
                                  {[...Array(testimonial.rating)].map((_, i) => (
                                    <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                                  ))}
                                </div>
                              </div>
                              <p className="text-gray-700 leading-relaxed">
                                {testimonial.comment}
                              </p>
                              <div className="text-sm text-gray-500 mt-2">
                                {new Date(testimonial.date).toLocaleDateString()}
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Booking Card */}
              <Card className="sticky top-6">
                <CardHeader>
                  <CardTitle>Book {provider.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-orange-600">
                        ${provider.startingRate}<span className="text-lg font-normal text-gray-600">/day</span>
                      </div>
                      <div className="text-sm text-gray-500">Starting rate</div>
                    </div>
                    
                    <Button 
                      className="w-full bg-orange-600 hover:bg-orange-700"
                      size="lg"
                      onClick={() => setShowBookingModal(true)}
                    >
                      <Calendar className="w-4 h-4 mr-2" />
                      Book Your Trip
                    </Button>
                    
                    <div className="text-center text-sm text-gray-600">
                      <Clock className="w-4 h-4 inline mr-1" />
                      Response time: {provider.responseTime}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Contact Card */}
              <Card>
                <CardHeader>
                  <CardTitle>Contact Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <Phone className="w-4 h-4 mr-3 text-gray-500" />
                      <span>{provider.contact.phone}</span>
                    </div>
                    <div className="flex items-center">
                      <Mail className="w-4 h-4 mr-3 text-gray-500" />
                      <span>{provider.contact.email}</span>
                    </div>
                    <div className="flex items-center">
                      <MapPin className="w-4 h-4 mr-3 text-gray-500" />
                      <span>{provider.location}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Coverage Area */}
              <Card>
                <CardHeader>
                  <CardTitle>Coverage Areas</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {provider.coverage.map((area, index) => (
                      <div key={index} className="flex items-center">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                        <span>{area}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* Rotating Testimonials */}
        <section className="bg-gray-50 py-16">
          <div className="container mx-auto px-4">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">What Travelers Say</h2>
            </div>
            
            <div className="max-w-4xl mx-auto">
              <Card className="border-0 shadow-lg">
                <CardContent className="p-8">
                  <div className="text-center">
                    <div className="flex justify-center mb-4">
                      {[...Array(provider.testimonials[activeTestimonial].rating)].map((_, i) => (
                        <Star key={i} className="w-6 h-6 text-yellow-400 fill-current" />
                      ))}
                    </div>
                    <blockquote className="text-xl text-gray-700 leading-relaxed mb-6">
                      "{provider.testimonials[activeTestimonial].comment}"
                    </blockquote>
                    <div className="flex items-center justify-center space-x-4">
                      <img 
                        src={provider.testimonials[activeTestimonial].photo}
                        alt={provider.testimonials[activeTestimonial].name}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                      <div>
                        <div className="font-medium">{provider.testimonials[activeTestimonial].name}</div>
                        <div className="text-sm text-gray-500">{provider.testimonials[activeTestimonial].tripType}</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <div className="flex justify-center mt-6 space-x-2">
                {provider.testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveTestimonial(index)}
                    className={`w-3 h-3 rounded-full transition-colors ${
                      index === activeTestimonial ? 'bg-orange-600' : 'bg-gray-300'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Booking Modal */}
      {showBookingModal && (
        <DriverBookingModal
          driver={{
            id: provider.id,
            name: provider.name,
            rating: provider.rating,
            languages: provider.languages,
            photo_url: provider.profileImage,
            phone: null,
            email: null,
            bio: provider.specialties.join(', '),
            experience_years: parseInt(provider.credentials.experience.replace(/\D/g, '')) || 5,
            total_reviews: provider.reviewCount || 0,
            license_number: null,
            is_active: true,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }}
          vehicleId={provider.vehicles[0]?.id}
          isOpen={showBookingModal}
          onClose={() => setShowBookingModal(false)}
        />
      )}
    </>
  )
}

export default DriverGuideProfile
