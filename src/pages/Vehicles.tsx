
import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Calendar, Users, Luggage, Car, MapPin, Star, Filter } from 'lucide-react'
import { getVehicles, getVehicleCategories } from '@/lib/vehicle-service'
import type { Vehicle, VehicleCategory, VehicleFilters } from '@/types/vehicle'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'

const Vehicles = () => {
  const navigate = useNavigate()
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [categories, setCategories] = useState<VehicleCategory[]>([])
  const [loading, setLoading] = useState(true)
  const [showFilters, setShowFilters] = useState(false)
  const [filters, setFilters] = useState<VehicleFilters>({
    category: [],
    minSeats: null,
    maxSeats: null,
    minLuggage: null,
    maxLuggage: null,
    features: [],
    location: '',
    startDate: null,
    endDate: null,
    maxPrice: null
  })

  useEffect(() => {
    loadInitialData()
  }, [])

  useEffect(() => {
    loadVehicles()
  }, [filters])

  const loadInitialData = async () => {
    try {
      const [vehiclesData, categoriesData] = await Promise.all([
        getVehicles(),
        getVehicleCategories()
      ])
      setVehicles(vehiclesData)
      setCategories(categoriesData)
    } catch (error) {
      console.error('Error loading data:', error)
      toast.error('Failed to load vehicles')
    } finally {
      setLoading(false)
    }
  }

  const loadVehicles = async () => {
    try {
      const vehiclesData = await getVehicles(filters)
      setVehicles(vehiclesData)
    } catch (error) {
      console.error('Error loading vehicles:', error)
      toast.error('Failed to load vehicles')
    }
  }

  const handleCategoryFilter = (categoryId: string) => {
    setFilters(prev => ({
      ...prev,
      category: prev.category.includes(categoryId)
        ? prev.category.filter(id => id !== categoryId)
        : [...prev.category, categoryId]
    }))
  }

  const handleFeatureFilter = (feature: string) => {
    setFilters(prev => ({
      ...prev,
      features: prev.features.includes(feature)
        ? prev.features.filter(f => f !== feature)
        : [...prev.features, feature]
    }))
  }

  const clearFilters = () => {
    setFilters({
      category: [],
      minSeats: null,
      maxSeats: null,
      minLuggage: null,
      maxLuggage: null,
      features: [],
      location: '',
      startDate: null,
      endDate: null,
      maxPrice: null
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Car className="h-12 w-12 animate-spin mx-auto mb-4 text-wild-orange" />
          <p className="text-granite-gray">Loading vehicles...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-jungle-green/5 to-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-jungle-green to-jungle-green/80 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold font-chakra mb-4">
              Book Vehicles with Professional Drivers
            </h1>
            <p className="text-xl mb-8 font-inter opacity-90">
              Explore Sri Lanka safely and comfortably with our experienced drivers and well-maintained vehicles
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              {categories.map(category => (
                <Button
                  key={category.id}
                  variant="outline"
                  className="border-white text-white hover:bg-white hover:text-jungle-green"
                  onClick={() => navigate(`/vehicles/category/${category.name.toLowerCase()}`)}
                >
                  <span className="mr-2">{category.icon}</span>
                  {category.name}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className="lg:w-1/4">
            <Card className="sticky top-4">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Filter className="h-5 w-5" />
                    Filters
                  </CardTitle>
                  <Button variant="ghost" size="sm" onClick={clearFilters}>
                    Clear
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Vehicle Categories */}
                <div>
                  <h4 className="font-semibold mb-3">Vehicle Type</h4>
                  <div className="space-y-2">
                    {categories.map(category => (
                      <div key={category.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={category.id}
                          checked={filters.category.includes(category.id)}
                          onCheckedChange={() => handleCategoryFilter(category.id)}
                        />
                        <label htmlFor={category.id} className="text-sm flex items-center gap-2">
                          <span>{category.icon}</span>
                          {category.name}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Passenger Capacity */}
                <div>
                  <h4 className="font-semibold mb-3">Passenger Capacity</h4>
                  <div className="flex gap-2">
                    <Input
                      type="number"
                      placeholder="Min"
                      value={filters.minSeats || ''}
                      onChange={(e) => setFilters(prev => ({
                        ...prev,
                        minSeats: e.target.value ? parseInt(e.target.value) : null
                      }))}
                    />
                    <Input
                      type="number"
                      placeholder="Max"
                      value={filters.maxSeats || ''}
                      onChange={(e) => setFilters(prev => ({
                        ...prev,
                        maxSeats: e.target.value ? parseInt(e.target.value) : null
                      }))}
                    />
                  </div>
                </div>

                {/* Features */}
                <div>
                  <h4 className="font-semibold mb-3">Features</h4>
                  <div className="space-y-2">
                    {[
                      { key: 'has_ac', label: 'Air Conditioning' },
                      { key: 'has_wifi', label: 'WiFi' },
                      { key: 'has_child_seat', label: 'Child Seat Available' }
                    ].map(feature => (
                      <div key={feature.key} className="flex items-center space-x-2">
                        <Checkbox
                          id={feature.key}
                          checked={filters.features.includes(feature.key)}
                          onCheckedChange={() => handleFeatureFilter(feature.key)}
                        />
                        <label htmlFor={feature.key} className="text-sm">
                          {feature.label}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Max Price */}
                <div>
                  <h4 className="font-semibold mb-3">Max Daily Rate (USD)</h4>
                  <Input
                    type="number"
                    placeholder="Enter max price"
                    value={filters.maxPrice || ''}
                    onChange={(e) => setFilters(prev => ({
                      ...prev,
                      maxPrice: e.target.value ? parseInt(e.target.value) : null
                    }))}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Vehicle Grid */}
          <div className="lg:w-3/4">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-granite-gray">
                Available Vehicles ({vehicles.length})
              </h2>
              <Button
                variant="outline"
                className="lg:hidden"
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter className="h-4 w-4 mr-2" />
                Filters
              </Button>
            </div>

            {vehicles.length === 0 ? (
              <Card className="p-8 text-center">
                <Car className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                <h3 className="text-xl font-semibold mb-2">No vehicles found</h3>
                <p className="text-gray-600 mb-4">Try adjusting your filters to see more options</p>
                <Button onClick={clearFilters}>Clear Filters</Button>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
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
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Vehicles
