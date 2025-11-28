
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { MapPin, Clock, Users, Star, Calendar, Sparkles, Badge, Heart } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useTours } from '@/hooks/useTours'
import LoadingSpinner from '@/components/LoadingSpinner'
import BookingModal from '@/components/BookingModal'
import { SEOMetaTags } from '@/components/seo/SEOMetaTags'
import { SEOSchema } from '@/components/seo/SEOSchema'

const Tours = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [priceRange, setPriceRange] = useState('')
  const [duration, setDuration] = useState('')
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false)
  const [selectedTour, setSelectedTour] = useState<any>(null)

  const { filteredTours, filters, setFilters, isLoading } = useTours()

  // Apply local filters
  const locallyFilteredTours = filteredTours.filter(tour => {
    const matchesSearch = tour.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tour.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesPrice = !priceRange ||
      (priceRange === 'under-50' && tour.price_per_person < 50) ||
      (priceRange === '50-100' && tour.price_per_person >= 50 && tour.price_per_person <= 100) ||
      (priceRange === 'over-100' && tour.price_per_person > 100)
    const matchesDuration = !duration ||
      (duration === 'half-day' && tour.duration_days <= 1) ||
      (duration === 'full-day' && tour.duration_days > 1 && tour.duration_days <= 2) ||
      (duration === 'multi-day' && tour.duration_days > 2)
    return matchesSearch && matchesPrice && matchesDuration
  })

  const handleClearFilters = () => {
    setSearchTerm('')
    setPriceRange('')
    setDuration('')
    setFilters({
      destination: '',
      tourType: '',
      difficulty: '',
      duration: '',
      priceRange: [0, 2000]
    })
  }

  const handleBookTour = (tour: any) => {
    setSelectedTour(tour)
    setIsBookingModalOpen(true)
  }

  if (isLoading) {
    return <LoadingSpinner fullScreen message="Loading tours..." />
  }

  return (
    <>
      {/* SEO Meta Tags */}
      <SEOMetaTags
        title="Sri Lanka Tours & Travel Packages - Best Deals 2025"
        description="Discover amazing Sri Lanka tour packages. Cultural tours, wildlife safaris, beach holidays & adventure tours. SLTDA certified. Book online with best prices guaranteed!"
        keywords="Sri Lanka tours, tour packages Sri Lanka, Sri Lanka travel, cultural tours, wildlife safaris, beach holidays, adventure tours, Sri Lanka vacation packages"
        image="https://www.rechargetravels.com/images/tours-hero.jpg"
        url="https://www.rechargetravels.com/tours"
      />

      {/* Schema Markup for Tours */}
      <SEOSchema
        type="LocalBusiness"
        data={{
          name: "Recharge Travels - Sri Lanka Tours",
          description: "Premium tour operator in Sri Lanka offering cultural tours, wildlife safaris, beach holidays and personalized travel experiences since 2014.",
          image: "https://www.rechargetravels.com/images/tours-hero.jpg",
        }}
      />

      {/* Enhanced Hero Section */}
      <section className="relative bg-gradient-to-br from-emerald-600 via-green-700 to-teal-800 text-white py-20 overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-indigo-600/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-tr from-purple-400/10 to-pink-600/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="mb-6">
            <span className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-orange-500 to-red-500 text-white text-sm font-semibold rounded-full shadow-lg">
              <Sparkles className="w-4 h-4 mr-2" />
              🎉 Early Bird Special - Save 25% on All Tours!
            </span>
          </div>

          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white via-blue-100 to-emerald-100 bg-clip-text text-transparent">
            Discover Magical Sri Lanka
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto text-green-100">
            From ancient temples to wildlife safaris, explore the pearl of the Indian Ocean with our expertly guided tours and create memories that last a lifetime.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
            <Button
              size="lg"
              className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-8 py-4 rounded-xl text-lg font-semibold shadow-xl transform hover:scale-105 transition-all duration-300"
            >
              <Calendar className="w-5 h-5 mr-2" />
              Book Tour Now
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="border-2 border-white text-white hover:bg-white hover:text-green-800 px-8 py-4 rounded-xl text-lg font-semibold backdrop-blur-sm"
            >
              View All Tours
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
              <div className="text-3xl font-bold mb-2">150+</div>
              <div className="text-green-100">Curated Tours</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
              <div className="text-3xl font-bold mb-2">50K+</div>
              <div className="text-green-100">Happy Travelers</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
              <div className="text-3xl font-bold mb-2">4.9★</div>
              <div className="text-green-100">Average Rating</div>
            </div>
          </div>
        </div>
      </section>

      {/* Filters Section */}
      <section className="bg-white shadow-sm border-b py-6">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Input
                type="text"
                placeholder="Search tours, destinations, experiences..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>
            <div>
              <select
                value={priceRange}
                onChange={(e) => setPriceRange(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="">All Prices</option>
                <option value="under-50">Under $50</option>
                <option value="50-100">$50 - $100</option>
                <option value="over-100">Over $100</option>
              </select>
            </div>
            <div>
              <select
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="">All Durations</option>
                <option value="half-day">Half Day (≤1 day)</option>
                <option value="full-day">Full Day (1-2 days)</option>
                <option value="multi-day">Multi Day (2+ days)</option>
              </select>
            </div>
            <div>
              <Button className="w-full" onClick={handleClearFilters}>
                Clear Filters
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Tours Grid */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {locallyFilteredTours.map((tour) => (
              <Card key={tour.id} className="group overflow-hidden hover:shadow-2xl transition-all duration-300 border-0 shadow-lg hover:scale-[1.02] relative">
                {/* Popular Badge */}
                <div className="absolute top-4 left-4 z-10">
                  <span className="bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                    <Badge className="w-3 h-3 mr-1" />
                    POPULAR
                  </span>
                </div>

                {/* Wishlist Button */}
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute top-4 right-4 z-10 bg-white/80 hover:bg-white/90 rounded-full p-2 shadow-lg"
                >
                  <Heart className="w-4 h-4 text-gray-600 hover:text-red-500 transition-colors" />
                </Button>

                <div className="relative h-56 bg-gradient-to-r from-blue-400 to-purple-600 overflow-hidden">
                  <img
                    src={tour.images?.[0] || "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop"}
                    alt={tour.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>

                  {/* Floating Price Tag */}
                  <div className="absolute bottom-4 left-4">
                    <div className="bg-white rounded-xl px-4 py-2 shadow-lg">
                      <div className="text-2xl font-bold text-green-600">
                        ${tour.price_per_person}
                        <span className="text-sm font-normal text-gray-500">/person</span>
                      </div>
                    </div>
                  </div>
                </div>

                <CardHeader className="pb-3">
                  <CardTitle className="text-xl font-bold text-gray-900 group-hover:text-green-600 transition-colors">
                    {tour.title}
                  </CardTitle>
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <div className="flex items-center space-x-1 bg-gray-100 px-2 py-1 rounded-lg">
                      <Clock className="h-4 w-4 text-blue-600" />
                      <span className="font-medium">{tour.duration_days} days</span>
                    </div>
                    <div className="flex items-center space-x-1 bg-gray-100 px-2 py-1 rounded-lg">
                      <Users className="h-4 w-4 text-purple-600" />
                      <span className="font-medium">Max {tour.max_group_size || 10}</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-1 text-sm text-gray-600">
                    <MapPin className="h-4 w-4 text-green-600" />
                    <span className="font-medium">{tour.destination}</span>
                  </div>
                </CardHeader>

                <CardContent className="pt-0">
                  <p className="text-gray-600 mb-4 line-clamp-3">{tour.description}</p>

                  <div className="mb-6">
                    <span className="inline-block bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 text-xs font-semibold px-3 py-1 rounded-full mr-2 mb-2">
                      {tour.category}
                    </span>
                    <span className="inline-block bg-gradient-to-r from-green-100 to-green-200 text-green-800 text-xs font-semibold px-3 py-1 rounded-full">
                      {tour.difficulty_level}
                    </span>
                  </div>

                  {/* Enhanced Action Buttons */}
                  <div className="flex flex-col gap-3">
                    <Button
                      onClick={() => handleBookTour(tour)}
                      className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold py-3 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                    >
                      <Calendar className="w-4 h-4 mr-2" />
                      Book This Tour
                    </Button>
                    <div className="flex gap-2">
                      <Link to={`/tours/${tour.id}`} className="flex-1">
                        <Button variant="outline" className="w-full border-2 border-gray-300 hover:border-green-500 hover:text-green-600 font-medium py-2 rounded-xl transition-all duration-300">
                          View Details
                        </Button>
                      </Link>
                      <Button
                        variant="outline"
                        className="px-4 border-2 border-gray-300 hover:border-blue-500 hover:text-blue-600 rounded-xl transition-all duration-300"
                      >
                        <Star className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Trust Indicators */}
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <div className="flex items-center space-x-1">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                        <span>Free Cancellation</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse delay-300"></div>
                        <span>Instant Confirmation</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {locallyFilteredTours.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg">No tours found matching your criteria.</p>
              <Button
                className="mt-4"
                onClick={handleClearFilters}
              >
                Clear All Filters
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* Booking Modal */}
      <BookingModal
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
        type="tour"
        itemTitle={selectedTour?.title}
        itemId={selectedTour?.id}
        price={selectedTour?.price_per_person}
      />
    </>
  )
}

export default Tours
