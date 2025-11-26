
import React, { useState } from 'react'
import { Helmet } from 'react-helmet-async'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import SimpleHotelGrid from '@/components/hotels/SimpleHotelGrid'
import HotelSearch from '@/components/hotels/HotelSearch'
import { Button } from '@/components/ui/button'
import { Search, Sparkles, MapPin, Calendar, Users, Star, Crown } from 'lucide-react'

const Hotels = () => {
  const [showSearch, setShowSearch] = useState(false)

  return (
    <>
      <Helmet>
        <title>Luxury Hotels & Resorts in Sri Lanka - Recharge Travels</title>
        <meta name="description" content="Discover premium hotels, luxury resorts, boutique accommodations and budget-friendly stays in Sri Lanka. From beachfront cabanas to mountain retreats." />
        <meta name="keywords" content="Sri Lanka hotels, luxury resorts, boutique hotels, budget accommodation, beach hotels, mountain hotels" />
      </Helmet>
      
      <Header />
      
      <div className="min-h-screen bg-soft-beige">
        {/* Enhanced Hero Section */}
        <div className="relative bg-gradient-to-br from-teal-600 via-blue-700 to-indigo-800 text-white py-24 overflow-hidden">
          {/* Background Elements */}
          <div className="absolute inset-0">
            <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-yellow-400/20 to-orange-600/20 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-tr from-purple-400/10 to-pink-600/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
          </div>

          <div className="container mx-auto px-4 relative z-10">
            <div className="text-center">
              <div className="mb-6">
                <span className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-yellow-500 to-orange-500 text-white text-sm font-semibold rounded-full shadow-lg">
                  <Crown className="w-4 h-4 mr-2" />
                  ✨ Luxury Hotel Sale - Up to 40% Off Premium Stays!
                </span>
              </div>

              <h1 className="text-4xl md:text-6xl font-bold font-playfair mb-6 bg-gradient-to-r from-white via-blue-100 to-teal-100 bg-clip-text text-transparent">
                Luxury Hotels & Resorts
              </h1>
              <h2 className="text-3xl md:text-4xl font-bold font-playfair mb-6 text-teal-100">
                in Beautiful Sri Lanka
              </h2>
              <p className="text-xl md:text-2xl mb-8 max-w-4xl mx-auto font-inter text-blue-100">
                From luxury beach resorts to charming boutique hotels and wellness retreats. 
                Discover our curated selection of exceptional Sri Lankan accommodations with instant booking and best price guarantee.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-10">
                <Button 
                  className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-8 py-4 rounded-xl text-lg font-semibold shadow-xl transform hover:scale-105 transition-all duration-300"
                >
                  <Calendar className="w-5 h-5 mr-2" />
                  Book Hotel Now
                </Button>
                <Button 
                  onClick={() => setShowSearch(!showSearch)}
                  variant="outline"
                  className="border-2 border-white text-white hover:bg-white hover:text-teal-800 px-8 py-4 rounded-xl text-lg font-semibold backdrop-blur-sm"
                >
                  <Search className="w-5 h-5 mr-2" />
                  {showSearch ? 'Hide' : 'Advanced'} Search
                </Button>
              </div>

              {/* Trust Indicators */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                  <div className="text-2xl font-bold mb-2">500+</div>
                  <div className="text-teal-100 text-sm">Premium Hotels</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                  <div className="text-2xl font-bold mb-2">100K+</div>
                  <div className="text-teal-100 text-sm">Happy Guests</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                  <div className="text-2xl font-bold mb-2">4.8★</div>
                  <div className="text-teal-100 text-sm">Average Rating</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                  <div className="text-2xl font-bold mb-2">24/7</div>
                  <div className="text-teal-100 text-sm">Support</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Search Section (toggleable) */}
        {showSearch && (
          <div className="bg-white border-b py-8">
            <div className="container mx-auto px-4">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Find Your Perfect Hotel</h2>
                <p className="text-gray-600">Search by name, location, or use our advanced filters</p>
              </div>
              <HotelSearch />
            </div>
          </div>
        )}

        {/* Main Hotels Display - Now shows curated content by default */}
        {!showSearch && <SimpleHotelGrid />}
      </div>

      <Footer />
    </>
  )
}

export default Hotels
