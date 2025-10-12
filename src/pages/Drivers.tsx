import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { User, Star, Clock, MapPin, Phone, Mail } from 'lucide-react'
import DriverBookingModal from '@/components/drivers/DriverBookingModal'
import { useAuth } from '@/hooks/useAuth'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import type { Driver } from '@/types/vehicle'

const Drivers = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [selectedDriver, setSelectedDriver] = useState<Driver | null>(null)
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false)

  const handleBookDriver = (driver?: Driver) => {
    if (!user) {
      toast.info('Please log in to book a driver')
      navigate('/login')
      return
    }

    if (driver) {
      setSelectedDriver(driver)
      setIsBookingModalOpen(true)
    } else {
      // For general booking, redirect to the external system
      window.open('https://5175-ihuevp7ppcg62zq6vuhli-17906309.manusvm.computer/booking', '_blank')
    }
  }

  const driverFeatures = [
    'Professional licensed drivers',
    'Local area expertise',
    'Multilingual support',
    'Safe and reliable service',
    '24/7 availability',
    'Competitive rates'
  ]

  const sampleDrivers: Driver[] = [
    {
      id: '1',
      name: 'Nilan Perera',
      photo_url: null,
      phone: '+94 77 123 4567',
      email: 'nilan@example.com',
      languages: ['English', 'Sinhala', 'Tamil'],
      bio: 'Experienced wildlife tour guide specializing in cultural sites',
      experience_years: 8,
      rating: 4.9,
      total_reviews: 45,
      license_number: 'DL123456',
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: '2',
      name: 'Karthik Silva',
      photo_url: null,
      phone: '+94 77 234 5678',
      email: 'karthik@example.com',
      languages: ['English', 'Sinhala'],
      bio: 'Professional driver specializing in airport transfers and city tours',
      experience_years: 12,
      rating: 4.8,
      total_reviews: 62,
      license_number: 'DL234567',
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: '3',
      name: 'Chaminda Rajapaksa',
      photo_url: null,
      phone: '+94 77 345 6789',
      email: 'chaminda@example.com',
      languages: ['English', 'Sinhala', 'German'],
      bio: 'Adventure tour specialist with focus on beach and mountain tours',
      experience_years: 6,
      rating: 4.9,
      total_reviews: 38,
      license_number: 'DL345678',
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  ]

  return (
    <>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-teal-green to-peacock-teal text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 font-playfair">
            Professional Drivers in Sri Lanka
          </h1>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Book experienced, licensed drivers for your Sri Lankan adventure. 
            Safe, reliable, and knowledgeable local guides at your service.
          </p>
          <Button 
            size="lg" 
            className="bg-sunset-orange hover:bg-yellow-500 text-white font-semibold px-8 py-3"
            onClick={() => handleBookDriver()}
          >
            Book a Driver Now
          </Button>
        </div>
      </section>

      {/* Why Choose Our Drivers */}
      <section className="py-16 bg-soft-beige">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-granite-gray mb-4 font-playfair">
              Why Choose Our Professional Drivers?
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Our carefully selected drivers provide more than just transportation - 
              they're your local guides to discovering the best of Sri Lanka.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {driverFeatures.map((feature, index) => (
              <Card key={index} className="text-center">
                <CardContent className="pt-6">
                  <User className="h-12 w-12 text-teal-green mx-auto mb-4" />
                  <p className="font-medium text-granite-gray">{feature}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Drivers */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-granite-gray mb-4 font-playfair">
              Meet Our Top-Rated Drivers
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Experienced professionals who know Sri Lanka like the back of their hand.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {sampleDrivers.map((driver) => (
              <Card key={driver.id} className="overflow-hidden">
                <div className="aspect-square bg-gray-100 flex items-center justify-center">
                  <User className="h-24 w-24 text-gray-400" />
                </div>
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-2">{driver.name}</h3>
                  <div className="flex items-center mb-2">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
                    <span className="font-medium">{driver.rating}</span>
                    <span className="text-gray-500 ml-2">• {driver.experience_years} years experience</span>
                  </div>
                  <div className="mb-3">
                    <p className="text-sm text-gray-600 mb-1">Languages:</p>
                    <p className="text-sm font-medium">{driver.languages.join(', ')}</p>
                  </div>
                  <div className="mb-4">
                    <p className="text-sm text-gray-600 mb-1">Specialization:</p>
                    <p className="text-sm font-medium">{driver.bio}</p>
                  </div>
                  <Button 
                    className="w-full bg-teal-green hover:bg-teal-700"
                    onClick={() => handleBookDriver(driver)}
                  >
                    Book {driver.name}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Booking CTA Section */}
      <section className="py-16 bg-gradient-to-r from-sunset-orange to-yellow-400 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4 font-playfair">
            Ready to Book Your Driver?
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Get instant quotes, compare drivers, and book your perfect travel companion 
            for your Sri Lankan journey.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button 
              size="lg" 
              className="bg-white text-sunset-orange hover:bg-gray-100 font-semibold px-8 py-3"
              onClick={() => handleBookDriver()}
            >
              Book Now - Get Instant Quote
            </Button>
            <div className="flex items-center space-x-4 text-white/90">
              <div className="flex items-center">
                <Phone className="h-4 w-4 mr-1" />
                <span>+94 7777 21 999</span>
              </div>
              <div className="flex items-center">
                <Mail className="h-4 w-4 mr-1" />
                <span>drivers@rechargetravels.com</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-granite-gray mb-4 font-playfair">
              How Driver Booking Works
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-teal-green text-white rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                1
              </div>
              <h3 className="text-xl font-semibold mb-2">Choose Your Driver</h3>
              <p className="text-gray-600">Browse profiles, read reviews, and select the perfect driver for your needs.</p>
            </div>
            <div className="text-center">
              <div className="bg-peacock-teal text-white rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                2
              </div>
              <h3 className="text-xl font-semibold mb-2">Book & Confirm</h3>
              <p className="text-gray-600">Select dates, confirm details, and secure your booking with instant confirmation.</p>
            </div>
            <div className="text-center">
              <div className="bg-sunset-orange text-white rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                3
              </div>
              <h3 className="text-xl font-semibold mb-2">Enjoy Your Journey</h3>
              <p className="text-gray-600">Meet your driver and explore Sri Lanka with a knowledgeable local guide.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Driver Booking Modal */}
      {selectedDriver && (
        <DriverBookingModal
          driver={selectedDriver}
          vehicleId="sample-vehicle-id" // This would be selected by the user
          isOpen={isBookingModalOpen}
          onClose={() => {
            setIsBookingModalOpen(false)
            setSelectedDriver(null)
          }}
        />
      )}
    </>
  )
}

export default Drivers
