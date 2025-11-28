
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Phone, Car, Clock, Shield, MapPin, Users, Star, Sparkles, Calendar } from 'lucide-react'
import { LoadScript } from '@react-google-maps/api'
import TransportBookingForm from '@/components/TransportBookingForm'
import { GOOGLE_MAPS_API_KEY, googleMapsLibraries, isDemoMode } from '@/lib/googleMapsConfig'
import { SEOMetaTags } from '@/components/seo/SEOMetaTags'
import { SEOSchema } from '@/components/seo/SEOSchema'

const TransportContent = () => {
  const vehicleTypes = [
    { id: 'sedan', name: 'Sedan (1-2 passengers)', price: 'From $25' },
    { id: 'minivan', name: 'Minivan (3-6 passengers)', price: 'From $35' },
    { id: 'hiace', name: 'HIACE HIGH ROOF VAN (7-9 passengers)', price: 'From $50' },
    { id: 'minibus', name: 'Mini Bus (10-15 passengers)', price: 'From $60' },
    { id: 'minicoach', name: 'Mini Coach (16+ passengers)', price: 'From $100' }
  ]

  return (
    <>
      {/* SEO Meta Tags */}
      <SEOMetaTags
        title="Sri Lanka Transport Services - Airport Transfers & Car Rentals"
        description="Premium transport services across Sri Lanka. Airport transfers, private drivers, car rentals. 24/7 service, modern fleet, professional drivers. Book online now!"
        keywords="Sri Lanka transport, airport transfer Colombo, car rental Sri Lanka, private driver, taxi service, vehicle hire, Colombo airport taxi"
        image="https://www.rechargetravels.com/images/transport-hero.jpg"
        url="https://www.rechargetravels.com/transport"
      />

      {/* Schema Markup */}
      <SEOSchema
        type="LocalBusiness"
        data={{
          name: "Recharge Travels - Transport Services",
          description: "Premium transport and car rental services in Sri Lanka with professional drivers and modern fleet. Available 24/7.",
          image: "https://www.rechargetravels.com/images/transport-hero.jpg",
        }}
      />

      {/* Enhanced Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-600 via-indigo-700 to-purple-800 text-white py-24 overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-yellow-400/20 to-orange-600/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-tr from-green-400/10 to-blue-600/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="mb-6">
            <span className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-orange-500 to-red-500 text-white text-sm font-semibold rounded-full shadow-lg">
              <Sparkles className="w-4 h-4 mr-2" />
              🚗 New Customer Special - 30% Off First Ride!
            </span>
          </div>

          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white via-blue-100 to-indigo-100 bg-clip-text text-transparent">
            Premium Transport Services
          </h1>
          <h2 className="text-2xl md:text-3xl font-bold mb-6 text-blue-100">
            Across Beautiful Sri Lanka
          </h2>
          <p className="text-xl md:text-2xl mb-10 max-w-4xl mx-auto text-blue-100">
            Safe, comfortable, and punctual transport solutions. From airport transfers to custom journeys with professional drivers and modern vehicles.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button
              className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-8 py-4 rounded-xl text-lg font-semibold shadow-xl transform hover:scale-105 transition-all duration-300"
            >
              <Calendar className="w-5 h-5 mr-2" />
              Book Transport Now
            </Button>
            <a
              href="https://wa.me/94777721999"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center border-2 border-white text-white hover:bg-white hover:text-blue-800 px-8 py-4 rounded-xl text-lg font-semibold backdrop-blur-sm transition-all"
            >
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
              WhatsApp +94 77 772 1999
            </a>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
              <Car className="w-8 h-8 mx-auto mb-2 text-blue-200" />
              <div className="text-2xl font-bold mb-1">200+</div>
              <div className="text-blue-100 text-sm">Modern Vehicles</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
              <Users className="w-8 h-8 mx-auto mb-2 text-green-200" />
              <div className="text-2xl font-bold mb-1">25K+</div>
              <div className="text-blue-100 text-sm">Happy Customers</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
              <Star className="w-8 h-8 mx-auto mb-2 text-yellow-200" />
              <div className="text-2xl font-bold mb-1">4.9★</div>
              <div className="text-blue-100 text-sm">Customer Rating</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
              <Clock className="w-8 h-8 mx-auto mb-2 text-purple-200" />
              <div className="text-2xl font-bold mb-1">24/7</div>
              <div className="text-blue-100 text-sm">Available</div>
            </div>
          </div>
        </div>
      </section>

      {/* Booking Form Section */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

              {/* Booking Form */}
              <div className="lg:col-span-2">
                <TransportBookingForm />
              </div>

              {/* Sidebar */}
              <div className="space-y-6">

                {/* Enhanced Vehicle Types */}
                <Card className="border-0 shadow-xl">
                  <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-t-lg">
                    <CardTitle className="flex items-center">
                      <Car className="w-5 h-5 mr-2" />
                      Premium Vehicle Fleet
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      {vehicleTypes.map((vehicle, index) => (
                        <div key={vehicle.id} className="group hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 rounded-xl p-4 border border-gray-200 hover:border-blue-300 transition-all duration-300 cursor-pointer">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
                                <Users className="w-5 h-5 text-white" />
                              </div>
                              <div>
                                <div className="font-semibold text-gray-900 group-hover:text-blue-700">{vehicle.name}</div>
                                <div className="text-sm text-gray-600">{vehicle.price}</div>
                              </div>
                            </div>
                            <Button
                              size="sm"
                              variant="outline"
                              className="opacity-0 group-hover:opacity-100 transition-opacity border-blue-500 text-blue-600 hover:bg-blue-500 hover:text-white"
                            >
                              Select
                            </Button>
                          </div>
                          {index === 0 && (
                            <div className="mt-2">
                              <span className="inline-block bg-gradient-to-r from-green-500 to-emerald-600 text-white text-xs px-2 py-1 rounded-full">
                                Most Popular
                              </span>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Enhanced Contact Info */}
                <Card className="border-0 shadow-xl bg-gradient-to-br from-green-50 to-emerald-50">
                  <CardHeader className="bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-t-lg">
                    <CardTitle className="flex items-center">
                      <Phone className="h-5 w-5 mr-2" />
                      24/7 Support Available
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <a href="https://wa.me/94777721999" target="_blank" rel="noopener noreferrer" className="flex items-center space-x-3 bg-white rounded-lg p-3 shadow-sm hover:shadow-md transition-shadow">
                        <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                          <svg className="h-5 w-5 text-white" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900">+94 77 772 1999</div>
                          <div className="text-sm text-gray-600">WhatsApp Available</div>
                        </div>
                      </a>
                      <p className="text-sm text-gray-700 bg-white rounded-lg p-3 shadow-sm">
                        <Clock className="w-4 h-4 inline mr-2 text-green-600" />
                        Available 24/7 for urgent bookings and customer support.
                      </p>
                      <a href="https://wa.me/94777721999" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 shadow-lg text-white py-3 rounded-lg font-medium transition-all">
                        <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                        Chat on WhatsApp
                      </a>
                    </div>
                  </CardContent>
                </Card>

                {/* Enhanced Features */}
                <Card className="border-0 shadow-xl bg-gradient-to-br from-purple-50 to-indigo-50">
                  <CardHeader className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-t-lg">
                    <CardTitle className="flex items-center">
                      <Shield className="h-5 w-5 mr-2" />
                      Premium Service Features
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="grid grid-cols-1 gap-3">
                      {[
                        { icon: Users, text: "Professional Licensed Drivers", color: "text-blue-600" },
                        { icon: Car, text: "Modern, Clean & Air-Conditioned", color: "text-green-600" },
                        { icon: MapPin, text: "Real-Time GPS Tracking", color: "text-purple-600" },
                        { icon: Shield, text: "Fixed Transparent Pricing", color: "text-orange-600" },
                        { icon: Clock, text: "24/7 Customer Support", color: "text-red-600" },
                        { icon: Star, text: "Flight Monitoring for Pickups", color: "text-yellow-600" },
                      ].map((feature, index) => (
                        <div key={index} className="flex items-center space-x-3 bg-white rounded-lg p-3 shadow-sm hover:shadow-md transition-shadow">
                          <feature.icon className={`w-5 h-5 ${feature.color}`} />
                          <span className="text-sm font-medium text-gray-800">{feature.text}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

const Transport = () => {
  // If no API key or demo mode, render without LoadScript wrapper
  if (!GOOGLE_MAPS_API_KEY || isDemoMode()) {
    return <TransportContent />
  }

  return (
    <LoadScript
      googleMapsApiKey={GOOGLE_MAPS_API_KEY}
      libraries={googleMapsLibraries}
      loadingElement={<div className="min-h-screen flex items-center justify-center">Loading...</div>}
    >
      <TransportContent />
    </LoadScript>
  )
}

export default Transport
