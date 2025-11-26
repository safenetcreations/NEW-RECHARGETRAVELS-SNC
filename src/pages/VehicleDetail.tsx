
import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Calendar, Users, Luggage, Car, MapPin, Star, Phone, Mail, Clock, DollarSign } from 'lucide-react'
import { getVehicle } from '@/lib/vehicle-service'
import type { Vehicle } from '@/types/vehicle'
import { toast } from 'sonner'
import VehicleBookingModal from '@/components/vehicles/VehicleBookingModal'

const VehicleDetail = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [vehicle, setVehicle] = useState<Vehicle | null>(null)
  const [loading, setLoading] = useState(true)
  const [showBookingModal, setShowBookingModal] = useState(false)
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)

  useEffect(() => {
    if (id) {
      loadVehicle()
    }
  }, [id])

  const loadVehicle = async () => {
    if (!id) return
    
    try {
      const vehicleData = await getVehicle(id)
      setVehicle(vehicleData)
    } catch (error) {
      console.error('Error loading vehicle:', error)
      toast.error('Failed to load vehicle details')
      navigate('/vehicles')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Car className="h-12 w-12 animate-spin mx-auto mb-4 text-wild-orange" />
          <p className="text-granite-gray">Loading vehicle details...</p>
        </div>
      </div>
    )
  }

  if (!vehicle) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Car className="h-16 w-16 mx-auto mb-4 text-gray-400" />
          <h2 className="text-2xl font-semibold mb-2">Vehicle not found</h2>
          <Button onClick={() => navigate('/vehicles')}>
            Back to Vehicles
          </Button>
        </div>
      </div>
    )
  }

  const hasImages = vehicle.image_urls && vehicle.image_urls.length > 0

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Back Button */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <Button variant="ghost" onClick={() => navigate('/vehicles')}>
            ← Back to Vehicles
          </Button>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Images and Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Image Gallery */}
            <Card>
              <CardContent className="p-0">
                <div className="aspect-video bg-gray-200 relative">
                  {hasImages ? (
                    <img
                      src={vehicle.image_urls[selectedImageIndex]}
                      alt={`${vehicle.make} ${vehicle.model}`}
                      className="w-full h-full object-cover rounded-t-lg"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center rounded-t-lg">
                      <Car className="h-24 w-24 text-gray-400" />
                    </div>
                  )}
                  <div className="absolute top-4 left-4">
                    <Badge variant="secondary" className="text-lg">
                      {vehicle.category?.icon} {vehicle.category?.name}
                    </Badge>
                  </div>
                </div>
                
                {hasImages && vehicle.image_urls.length > 1 && (
                  <div className="p-4">
                    <div className="flex gap-2 overflow-x-auto">
                      {vehicle.image_urls.map((url, index) => (
                        <button
                          key={index}
                          onClick={() => setSelectedImageIndex(index)}
                          className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 ${
                            selectedImageIndex === index ? 'border-wild-orange' : 'border-gray-200'
                          }`}
                        >
                          <img
                            src={url}
                            alt={`${vehicle.make} ${vehicle.model} ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Vehicle Details */}
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">
                  {vehicle.make} {vehicle.model}
                </CardTitle>
                {vehicle.year && (
                  <p className="text-lg text-gray-600">{vehicle.year}</p>
                )}
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Specifications */}
                <div>
                  <h3 className="font-semibold text-lg mb-3">Specifications</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="flex items-center gap-2">
                      <Users className="h-5 w-5 text-wild-orange" />
                      <div>
                        <p className="font-medium">{vehicle.seats}</p>
                        <p className="text-sm text-gray-600">Passengers</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Luggage className="h-5 w-5 text-wild-orange" />
                      <div>
                        <p className="font-medium">{vehicle.luggage_capacity}</p>
                        <p className="text-sm text-gray-600">Luggage</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-5 w-5 text-wild-orange" />
                      <div>
                        <p className="font-medium">${vehicle.daily_rate}</p>
                        <p className="text-sm text-gray-600">Per Day</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-5 w-5 text-wild-orange" />
                      <div>
                        <p className="font-medium">${vehicle.extra_km_rate}</p>
                        <p className="text-sm text-gray-600">Per Extra KM</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Features */}
                <div>
                  <h3 className="font-semibold text-lg mb-3">Features & Amenities</h3>
                  <div className="flex flex-wrap gap-2">
                    {vehicle.has_ac && (
                      <Badge variant="outline" className="flex items-center gap-1">
                        ❄️ Air Conditioning
                      </Badge>
                    )}
                    {vehicle.has_wifi && (
                      <Badge variant="outline" className="flex items-center gap-1">
                        📶 WiFi
                      </Badge>
                    )}
                    {vehicle.has_child_seat && (
                      <Badge variant="outline" className="flex items-center gap-1">
                        👶 Child Seat Available
                      </Badge>
                    )}
                    {vehicle.features?.map((feature, index) => (
                      <Badge key={index} variant="outline">
                        {feature}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Description */}
                {vehicle.description && (
                  <div>
                    <h3 className="font-semibold text-lg mb-3">Description</h3>
                    <p className="text-gray-700 leading-relaxed">{vehicle.description}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Available Drivers */}
            {vehicle.drivers && vehicle.drivers.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Available Drivers</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4">
                    {vehicle.drivers.map((driverAssignment: any) => {
                      const driver = driverAssignment.driver
                      return (
                        <div key={driver.id} className="flex items-center gap-4 p-4 border rounded-lg">
                          <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                            {driver.photo_url ? (
                              <img
                                src={driver.photo_url}
                                alt={driver.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <span className="text-xl">{driver.name[0]}</span>
                            )}
                          </div>
                          <div className="flex-1">
                            <h4 className="font-semibold">{driver.name}</h4>
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                              <span>{driver.rating.toFixed(1)} ({driver.total_reviews} reviews)</span>
                            </div>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {driver.languages.map((lang: string, index: number) => (
                                <Badge key={index} variant="outline" className="text-xs">
                                  {lang}
                                </Badge>
                              ))}
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-sm text-gray-600">{driver.experience_years} years exp.</p>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => navigate(`/drivers/${driver.id}`)}
                            >
                              View Profile
                            </Button>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right Column - Booking Card */}
          <div className="lg:col-span-1">
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle className="text-center">Book This Vehicle</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center border-b pb-4">
                  <p className="text-3xl font-bold text-wild-orange">
                    ${vehicle.daily_rate}
                  </p>
                  <p className="text-sm text-gray-600">per day</p>
                  {vehicle.extra_km_rate > 0 && (
                    <p className="text-sm text-gray-600 mt-1">
                      + ${vehicle.extra_km_rate} per extra km
                    </p>
                  )}
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Vehicle Type:</span>
                    <span className="font-medium">{vehicle.category?.name}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Passengers:</span>
                    <span className="font-medium">{vehicle.seats} seats</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Luggage:</span>
                    <span className="font-medium">{vehicle.luggage_capacity} pieces</span>
                  </div>
                </div>

                <Button
                  onClick={() => setShowBookingModal(true)}
                  className="w-full bg-wild-orange hover:bg-wild-orange/90 text-white font-semibold py-3"
                  size="lg"
                >
                  Book Now
                </Button>

                <div className="text-center pt-2">
                  <p className="text-xs text-gray-500">
                    All bookings include professional driver
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      {showBookingModal && (
        <VehicleBookingModal
          vehicle={vehicle}
          isOpen={showBookingModal}
          onClose={() => setShowBookingModal(false)}
        />
      )}
    </div>
  )
}

export default VehicleDetail
