
import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Users, Luggage, Car, Star } from 'lucide-react'
import { getVehiclesByCategory } from '@/lib/vehicle-service'
import type { Vehicle } from '@/types/vehicle'
import { toast } from 'sonner'

const VehiclesByCategory = () => {
  const { category } = useParams<{ category: string }>()
  const navigate = useNavigate()
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (category) {
      loadVehicles()
    }
  }, [category])

  const loadVehicles = async () => {
    if (!category) return
    
    try {
      const categoryName = category.charAt(0).toUpperCase() + category.slice(1)
      const vehiclesData = await getVehiclesByCategory(categoryName)
      setVehicles(vehiclesData)
    } catch (error) {
      console.error('Error loading vehicles:', error)
      toast.error('Failed to load vehicles')
    } finally {
      setLoading(false)
    }
  }

  const categoryName = category?.charAt(0).toUpperCase() + category?.slice(1)
  const categoryEmojis: { [key: string]: string } = {
    'Car': '🚗',
    'Van': '🚐', 
    'Suv': '🚙',
    'Bus': '🚌'
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Car className="h-12 w-12 animate-spin mx-auto mb-4 text-wild-orange" />
          <p className="text-granite-gray">Loading {categoryName?.toLowerCase()}s...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-jungle-green to-jungle-green/80 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="text-6xl mb-4">{categoryEmojis[categoryName || ''] || '🚗'}</div>
            <h1 className="text-4xl md:text-5xl font-bold font-chakra mb-4">
              {categoryName} Rentals with Driver
            </h1>
            <p className="text-xl opacity-90">
              Professional drivers and well-maintained {categoryName?.toLowerCase()}s for your journey
            </p>
          </div>
        </div>
      </div>

      {/* Back Button */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <Button variant="ghost" onClick={() => navigate('/vehicles')}>
            ← Back to All Vehicles
          </Button>
        </div>
      </div>

      {/* Vehicles Grid */}
      <div className="container mx-auto px-4 py-8">
        {vehicles.length === 0 ? (
          <Card className="p-8 text-center">
            <Car className="h-16 w-16 mx-auto mb-4 text-gray-400" />
            <h3 className="text-xl font-semibold mb-2">No {categoryName?.toLowerCase()}s available</h3>
            <p className="text-gray-600 mb-4">
              We don't have any {categoryName?.toLowerCase()}s available at the moment
            </p>
            <Button onClick={() => navigate('/vehicles')}>
              Browse All Vehicles
            </Button>
          </Card>
        ) : (
          <>
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-granite-gray">
                Available {categoryName}s ({vehicles.length})
              </h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {vehicles.map(vehicle => (
                <Card key={vehicle.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="aspect-video bg-gray-200 relative">
                    {vehicle.image_urls && vehicle.image_urls.length > 0 ? (
                      <img
                        src={vehicle.image_urls[0]}
                        alt={`${vehicle.make} ${vehicle.model}`}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Car className="h-16 w-16 text-gray-400" />
                      </div>
                    )}
                    <div className="absolute top-2 left-2">
                      <Badge variant="secondary">
                        {vehicle.category?.icon} {vehicle.category?.name}
                      </Badge>
                    </div>
                  </div>
                  
                  <CardContent className="p-4">
                    <h3 className="text-lg font-semibold mb-2">
                      {vehicle.make} {vehicle.model}
                    </h3>
                    {vehicle.year && (
                      <p className="text-sm text-gray-600 mb-3">{vehicle.year}</p>
                    )}
                    
                    <div className="flex items-center gap-4 mb-3 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        {vehicle.seats} seats
                      </div>
                      <div className="flex items-center gap-1">
                        <Luggage className="h-4 w-4" />
                        {vehicle.luggage_capacity} bags
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-1 mb-3">
                      {vehicle.has_ac && <Badge variant="outline" className="text-xs">A/C</Badge>}
                      {vehicle.has_wifi && <Badge variant="outline" className="text-xs">WiFi</Badge>}
                      {vehicle.has_child_seat && <Badge variant="outline" className="text-xs">Child Seat</Badge>}
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-2xl font-bold text-wild-orange">
                          ${vehicle.daily_rate}
                        </p>
                        <p className="text-xs text-gray-600">per day</p>
                      </div>
                      <Button 
                        onClick={() => navigate(`/vehicles/${vehicle.id}`)}
                        className="bg-wild-orange hover:bg-wild-orange/90"
                      >
                        View Details
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default VehiclesByCategory
