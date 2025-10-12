
import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { Car, Star, Shield, Users, MapPin, Clock, CheckCircle } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

interface Provider {
  id: string
  name: string
  slug: string
  type: 'company' | 'independent'
  rating: number
  reviewCount: number
  startingRate: number
  vehicleTypes: string[]
  languages: string[]
  specialties: string[]
  profileImage: string
  description: string
  verified: boolean
  responseTime: string
}

const mockProviders: Provider[] = [
  {
    id: '1',
    name: 'Sri Lankan Personal Drivers',
    slug: 'sri-lankan-personal-drivers',
    type: 'company',
    rating: 4.8,
    reviewCount: 156,
    startingRate: 85,
    vehicleTypes: ['Luxury SUV', 'Sedan', 'Van'],
    languages: ['English', 'Sinhala', 'Tamil'],
    specialties: ['Cultural Tours', 'Wildlife Safari', 'Hill Country'],
    profileImage: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=100&h=100&fit=crop',
    description: 'Registered company with 15+ vehicles and professional drivers',
    verified: true,
    responseTime: '< 1 hour'
  },
  {
    id: '2',
    name: 'Kenny - Trusted Local Guide',
    slug: 'kenny-trusted-local-guide',
    type: 'independent',
    rating: 4.9,
    reviewCount: 89,
    startingRate: 65,
    vehicleTypes: ['SUV', 'Sedan'],
    languages: ['English', 'Sinhala', 'German'],
    specialties: ['Photography Tours', 'Ancient Cities', 'Local Cuisine'],
    profileImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
    description: 'Independent owner-operator with 8 years experience',
    verified: true,
    responseTime: '< 30 mins'
  },
  {
    id: '3',
    name: 'Ceylon Explorer Tours',
    slug: 'ceylon-explorer-tours',
    type: 'company',
    rating: 4.7,
    reviewCount: 203,
    startingRate: 95,
    vehicleTypes: ['Luxury Van', 'SUV', 'Minibus'],
    languages: ['English', 'Sinhala', 'French'],
    specialties: ['Luxury Tours', 'Beach Circuits', 'Corporate Travel'],
    profileImage: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=100&h=100&fit=crop',
    description: 'Premium tour company with 20+ fleet and multilingual guides',
    verified: true,
    responseTime: '< 2 hours'
  },
  {
    id: '4',
    name: 'Ravi - Mountain Specialist',
    slug: 'ravi-mountain-specialist',
    type: 'independent',
    rating: 4.9,
    reviewCount: 67,
    startingRate: 70,
    vehicleTypes: ['4WD SUV', 'Jeep'],
    languages: ['English', 'Sinhala'],
    specialties: ['Hill Country', 'Tea Plantations', 'Hiking Tours'],
    profileImage: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop',
    description: 'Hill country expert with specialized off-road vehicles',
    verified: true,
    responseTime: '< 45 mins'
  }
]

const DriverGuideServices = () => {
  const [activeTab, setActiveTab] = useState<'all' | 'company' | 'independent'>('all')
  const [providers, setProviders] = useState<Provider[]>(mockProviders)

  const filteredProviders = providers.filter(provider => 
    activeTab === 'all' || provider.type === activeTab
  )

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": "Private Driver & Guide Services Sri Lanka",
    "description": "Professional private drivers and guides for custom Sri Lanka tours",
    "provider": {
      "@type": "Organization",
      "name": "Recharge Travels"
    },
    "serviceType": "Private Transportation and Guide Services",
    "areaServed": {
      "@type": "Country",
      "name": "Sri Lanka"
    }
  }

  return (
    <>
      <Helmet>
        <title>Private Driver & Guide Sri Lanka – Corporate Fleets & Independent Experts</title>
        <meta name="description" content="Book a registered company or local owner-operator for a private, flexible tour with English-speaking guide. Choose from vetted fleets or independent drivers." />
        <meta name="keywords" content="Sri Lanka private driver, personal guide, car hire with driver, Sri Lanka tours, independent guide, company driver" />
        <meta property="og:title" content="Private Driver & Guide Services Sri Lanka" />
        <meta property="og:description" content="Choose from vetted companies or independent guides for your custom Sri Lanka journey" />
        <meta property="og:type" content="website" />
        <script type="application/ld+json">
          {JSON.stringify(jsonLd)}
        </script>
      </Helmet>

      <div className="min-h-screen bg-background">
        {/* Hero Section with Cinemagraph Effect */}
        <section className="relative h-[70vh] overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/30 z-10" />
          
          {/* Animated Background */}
          <div className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-80"
               style={{
                 backgroundImage: `url('https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1600&h=800&fit=crop')`,
                 animation: 'subtle-zoom 20s ease-in-out infinite alternate'
               }}>
            {/* Animated Vehicle */}
            <div className="absolute top-1/2 left-0 w-16 h-8 bg-white/20 rounded transform -translate-y-1/2"
                 style={{ animation: 'drive-across 15s linear infinite' }}>
              <Car className="w-6 h-6 text-white/80 mt-1 ml-5" />
            </div>
          </div>

          {/* Map Texture Overlay */}
          <div className="absolute inset-0 opacity-10 z-5"
               style={{
                 backgroundImage: `url('https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=1600&h=800&fit=crop')`,
                 backgroundSize: 'cover',
                 backgroundPosition: 'center'
               }} />

          <div className="relative z-20 container mx-auto px-4 h-full flex items-center">
            <div className="max-w-3xl text-white">
              <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
                Private Driver & Guide Services
                <span className="block text-3xl md:text-4xl font-normal text-orange-400 mt-2">
                  Flexibility Meets Local Expertise
                </span>
              </h1>
              <p className="text-xl md:text-2xl mb-8 text-white/90">
                Choose from vetted companies or independent guides for your custom Sri Lanka journey
              </p>
              <div className="flex flex-wrap gap-4">
                <Button size="lg" className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-3">
                  Browse Providers
                </Button>
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-black px-8 py-3">
                  How It Works
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Provider Spectrum & Filters */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Choose Your Perfect Travel Partner
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                Whether you prefer the reliability of established companies or the personal touch of independent operators, 
                we have verified providers to match your travel style and budget.
              </p>
            </div>

            {/* Filter Tabs */}
            <div className="flex justify-center mb-12">
              <div className="bg-white rounded-lg p-2 shadow-lg">
                <button
                  onClick={() => setActiveTab('all')}
                  className={`px-6 py-3 rounded-md font-medium transition-all ${
                    activeTab === 'all' 
                      ? 'bg-orange-600 text-white shadow-md' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  All Providers
                </button>
                <button
                  onClick={() => setActiveTab('company')}
                  className={`px-6 py-3 rounded-md font-medium transition-all ml-2 ${
                    activeTab === 'company' 
                      ? 'bg-orange-600 text-white shadow-md' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <Shield className="w-4 h-4 inline mr-2" />
                  Company-Backed
                </button>
                <button
                  onClick={() => setActiveTab('independent')}
                  className={`px-6 py-3 rounded-md font-medium transition-all ml-2 ${
                    activeTab === 'independent' 
                      ? 'bg-orange-600 text-white shadow-md' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <Users className="w-4 h-4 inline mr-2" />
                  Independent Operators
                </button>
              </div>
            </div>

            {/* Providers Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProviders.map((provider) => (
                <Card key={provider.id} className="hover:shadow-xl transition-shadow duration-300 bg-white">
                  <CardHeader className="pb-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-4">
                        <img 
                          src={provider.profileImage} 
                          alt={provider.name}
                          className="w-16 h-16 rounded-full object-cover"
                        />
                        <div>
                          <CardTitle className="text-lg font-bold text-gray-900">
                            {provider.name}
                          </CardTitle>
                          <div className="flex items-center mt-1">
                            <Badge 
                              variant={provider.type === 'company' ? 'default' : 'secondary'}
                              className={provider.type === 'company' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'}
                            >
                              {provider.type === 'company' ? 'Registered Company' : 'Owner-Operator'}
                            </Badge>
                            {provider.verified && (
                              <CheckCircle className="w-4 h-4 text-green-500 ml-2" />
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent>
                    <p className="text-gray-600 mb-4 line-clamp-2">
                      {provider.description}
                    </p>
                    
                    <div className="space-y-3 mb-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <Star className="w-4 h-4 text-yellow-400 fill-current" />
                          <span className="ml-1 font-medium">{provider.rating}</span>
                          <span className="text-gray-500 text-sm ml-1">({provider.reviewCount} reviews)</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <Clock className="w-4 h-4 mr-1" />
                          {provider.responseTime}
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap gap-1">
                        {provider.vehicleTypes.slice(0, 2).map((vehicle, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {vehicle}
                          </Badge>
                        ))}
                        {provider.vehicleTypes.length > 2 && (
                          <Badge variant="outline" className="text-xs">
                            +{provider.vehicleTypes.length - 2} more
                          </Badge>
                        )}
                      </div>
                      
                      <div className="flex flex-wrap gap-1">
                        {provider.specialties.slice(0, 2).map((specialty, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {specialty}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between pt-4 border-t">
                      <div>
                        <span className="text-2xl font-bold text-orange-600">
                          ${provider.startingRate}
                        </span>
                        <span className="text-gray-600 text-sm">/day</span>
                      </div>
                      <div className="space-x-2">
                        <Link to={`/tours/driver-guide/${provider.slug}`}>
                          <Button variant="outline" size="sm">
                            View Profile
                          </Button>
                        </Link>
                        <Button size="sm" className="bg-orange-600 hover:bg-orange-700">
                          Book Now
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Why Choose Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Why Choose Our Driver & Guide Network
              </h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-8 h-8 text-orange-600" />
                </div>
                <h3 className="text-xl font-bold mb-2">Verified & Insured</h3>
                <p className="text-gray-600">All providers undergo background checks and maintain proper insurance coverage</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MapPin className="w-8 h-8 text-orange-600" />
                </div>
                <h3 className="text-xl font-bold mb-2">Local Expertise</h3>
                <p className="text-gray-600">Native knowledge of hidden gems, local customs, and authentic experiences</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-orange-600" />
                </div>
                <h3 className="text-xl font-bold mb-2">Flexible Options</h3>
                <p className="text-gray-600">From budget-friendly independents to luxury company fleets</p>
              </div>
            </div>
          </div>
        </section>
      </div>

      <style>{`
        @keyframes drive-across {
          0% { left: -10%; }
          100% { left: 110%; }
        }
        
        @keyframes subtle-zoom {
          0% { transform: scale(1); }
          100% { transform: scale(1.05); }
        }
        
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </>
  )
}

export default DriverGuideServices
