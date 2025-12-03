
import { useState, useEffect, useMemo } from 'react'
import { Helmet } from 'react-helmet-async'
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
import { getFleetPageSettings, type FleetPageSettings } from '@/services/fleetPageService'

const Vehicles = () => {
  const navigate = useNavigate()
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [categories, setCategories] = useState<VehicleCategory[]>([])
  const [pageSettings, setPageSettings] = useState<FleetPageSettings | null>(null)
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

  const [galleryIndex, setGalleryIndex] = useState<Record<string, number>>({})

  const totalVehicles = vehicles.length
  const totalSeats = vehicles.reduce((sum, v) => sum + (v.seats || 0), 0)
  const acCount = vehicles.filter(v => v.has_ac).length

  const heroCategories = useMemo(
    () =>
      (categories || [])
        .filter((cat) => cat.is_hero)
        .sort((a, b) => (a.hero_order ?? 999) - (b.hero_order ?? 999))
        .slice(0, 4),
    [categories]
  )

  const heroImageTiles = useMemo(() => {
    const tiles: { url: string; label: string }[] = []

    heroCategories.forEach(cat => {
      ;(cat.hero_images || []).forEach(url => {
        if (tiles.length < 4) {
          tiles.push({ url, label: cat.name })
        }
      })
    })

    const fallbackImages: { url: string; label: string }[] = [
      {
        url: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=800&auto=format&fit=crop',
        label: 'Business sedan'
      },
      {
        url: 'https://images.unsplash.com/photo-1525609004556-c46c7d6cf023?w=800&auto=format&fit=crop',
        label: 'Family van'
      },
      {
        url: 'https://images.unsplash.com/photo-1502877338535-766e1452684a?w=800&auto=format&fit=crop',
        label: 'SUV on scenic road'
      },
      {
        url: 'https://images.unsplash.com/photo-1541417904950-b855846fe074?w=800&auto=format&fit=crop',
        label: 'Premium interior'
      }
    ]

    let i = 0
    while (tiles.length < 4 && i < fallbackImages.length) {
      tiles.push(fallbackImages[i])
      i++
    }

    return tiles
  }, [heroCategories])

  useEffect(() => {
    loadInitialData()
  }, [])

  useEffect(() => {
    loadVehicles()
  }, [filters])

  const loadInitialData = async () => {
    try {
      const [vehiclesData, categoriesData, settings] = await Promise.all([
        getVehicles(),
        getVehicleCategories(),
        getFleetPageSettings()
      ])
      setVehicles(vehiclesData)
      setCategories(categoriesData)
      setPageSettings(settings)
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

  if (loading || !pageSettings) {
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
    <>
      <Helmet>
        <title>{pageSettings.seoTitle}</title>
        <meta name="description" content={pageSettings.seoDescription} />
        <link rel="canonical" href="https://www.rechargetravels.com/vehicles" />
        <meta property="og:title" content={pageSettings.seoTitle} />
        <meta property="og:description" content={pageSettings.seoDescription} />
        <meta property="og:type" content="website" />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-b from-jungle-green/5 to-white">
        <section className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 pt-28 pb-16 md:pt-32 md:pb-20">
          <div className="absolute inset-0 opacity-40 bg-[radial-gradient(circle_at_0%_0%,rgba(234,179,8,0.2),transparent_60%),radial-gradient(circle_at_100%_100%,rgba(249,115,22,0.18),transparent_55%)]" />
          <div className="container mx-auto px-4 relative z-10">
            <div className="grid md:grid-cols-2 gap-10 items-center">
              <div>
                <p className="text-xs font-semibold tracking-[0.25em] uppercase text-amber-300 mb-3">
                  {pageSettings.heroBadge}
                </p>
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white mb-4">
                  {pageSettings.heroTitle}
                </h1>
                <p className="text-slate-300 text-base sm:text-lg mb-6">
                  {pageSettings.heroSubtitle}
                </p>

                <div className="flex flex-wrap items-center gap-4 mb-8">
                  <Button
                    size="lg"
                    className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold rounded-full px-6"
                    onClick={() => navigate(pageSettings.heroPrimaryCtaLink || '/vehicle-rental')}
                  >
                    {pageSettings.heroPrimaryCtaLabel}
                  </Button>
                  <button
                    type="button"
                    className="inline-flex items-center text-sm font-medium text-amber-300 hover:text-amber-200"
                    onClick={() => {
                      const el = document.getElementById('fleet-list')
                      if (el) el.scrollIntoView({ behavior: 'smooth' })
                    }}
                  >
                    Browse full fleet
                    <span className="ml-1">↓</span>
                  </button>
                </div>

                <div className="grid grid-cols-3 gap-4 text-sm text-slate-200">
                  <div>
                    <p className="text-xs uppercase tracking-wide text-slate-400">Vehicles</p>
                    <p className="text-lg font-semibold">{totalVehicles || pageSettings.statsVehiclesFallback}</p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-wide text-slate-400">Total seats</p>
                    <p className="text-lg font-semibold">{totalSeats || pageSettings.statsSeatsFallback}</p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-wide text-slate-400">A/C vehicles</p>
                    <p className="text-lg font-semibold">{acCount || pageSettings.statsAcFallback}</p>
                  </div>
                </div>
              </div>

              <div className="hidden md:block">
                <div className="relative rounded-3xl overflow-hidden border border-slate-800 bg-slate-900/60 shadow-2xl">
                  <div className="grid grid-cols-2 gap-1 h-full">
                    <div className="space-y-1">
                      <img
                        src={heroImageTiles[0]?.url}
                        alt={heroImageTiles[0]?.label || 'Fleet vehicle'}
                        className="h-32 lg:h-40 w-full object-cover"
                      />
                      <img
                        src={heroImageTiles[1]?.url}
                        alt={heroImageTiles[1]?.label || 'Fleet vehicle'}
                        className="h-32 lg:h-40 w-full object-cover"
                      />
                    </div>
                    <div className="space-y-1">
                      <img
                        src={heroImageTiles[2]?.url}
                        alt={heroImageTiles[2]?.label || 'Fleet vehicle'}
                        className="h-40 lg:h-52 w-full object-cover"
                      />
                      <img
                        src={heroImageTiles[3]?.url}
                        alt={heroImageTiles[3]?.label || 'Fleet vehicle'}
                        className="h-24 lg:h-28 w-full object-cover"
                      />
                    </div>
                  </div>
                  <div className="absolute bottom-4 left-4 bg-black/70 rounded-2xl px-4 py-3 text-sm text-slate-100 flex items-center gap-3">
                    <Car className="w-5 h-5 text-amber-400" />
                    <div>
                      <p className="font-semibold">{pageSettings.heroOverlayTitle}</p>
                      <p className="text-xs text-slate-400">{pageSettings.heroOverlaySubtitle}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-white py-10 border-b border-slate-100">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-6">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-slate-900">{pageSettings.sectionTitle}</h2>
                <p className="text-slate-600 mt-1">{pageSettings.sectionSubtitle}</p>
              </div>
              <div className="flex flex-wrap gap-2 text-xs text-slate-500">
                <div className="inline-flex items-center gap-1 bg-slate-50 px-3 py-1 rounded-full">
                  <Users className="w-3 h-3" />
                  <span>{pageSettings.badge1Label}</span>
                </div>
                <div className="inline-flex items-center gap-1 bg-slate-50 px-3 py-1 rounded-full">
                  <Luggage className="w-3 h-3" />
                  <span>{pageSettings.badge2Label}</span>
                </div>
                <div className="inline-flex items-center gap-1 bg-slate-50 px-3 py-1 rounded-full">
                  <Star className="w-3 h-3" />
                  <span>{pageSettings.badge3Label}</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {(heroCategories.length ? heroCategories.slice(0, 3) : []).map((cat) => {
                const mainImage = cat.hero_images?.[0] ||
                  'https://images.unsplash.com/photo-1511919884226-fd3cad34687c?w=800&auto=format&fit=crop'
                const slug = (cat.slug || cat.name || '').toLowerCase()

                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => navigate(`/vehicles/category/${slug}`)}
                    className="group text-left rounded-2xl border border-slate-200 bg-slate-50 hover:bg-slate-100 transition-colors overflow-hidden"
                  >
                    <div className="h-40 overflow-hidden">
                      <img
                        src={mainImage}
                        alt={cat.name}
                        className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    <div className="p-4 space-y-1">
                      <p className="text-xs uppercase tracking-wide text-slate-500 flex items-center gap-1">
                        <span>{cat.icon || '🚘'}</span>
                        <span>{cat.name}</span>
                      </p>
                      <h3 className="text-lg font-semibold text-slate-900">
                        {cat.description || 'Curated vehicles for this travel style.'}
                      </h3>
                    </div>
                  </button>
                )
              })}

              {heroCategories.length === 0 && (
                <p className="text-sm text-slate-500 col-span-1 md:col-span-3">
                  Configure fleet hero categories in the admin panel to showcase featured vehicle types here.
                </p>
              )}
            </div>
          </div>
        </section>

        <div id="fleet-list" className="container mx-auto px-4 py-8">
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
                {vehicles.map(vehicle => {
                  const images = vehicle.image_urls || []
                  const activeIndex = galleryIndex[vehicle.id] ?? 0
                  const safeIndex = activeIndex >= 0 && activeIndex < images.length ? activeIndex : 0
                  const mainImage = images[safeIndex]

                  return (
                    <Card key={vehicle.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                      <div className="px-3 pt-3">
                        <div className="aspect-video bg-gray-200 relative rounded-xl overflow-hidden">
                          {mainImage ? (
                            <img
                              src={mainImage}
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

                        {images.length > 1 && (
                          <div className="mt-2 flex gap-2 overflow-x-auto pb-1">
                            {images.slice(0, 6).map((url, idx) => (
                              <button
                                key={idx}
                                type="button"
                                onClick={() =>
                                  setGalleryIndex(prev => ({
                                    ...prev,
                                    [vehicle.id]: idx
                                  }))
                                }
                                className={`flex-shrink-0 w-14 h-14 rounded-md overflow-hidden border ${
                                  safeIndex === idx
                                    ? 'border-wild-orange shadow-sm'
                                    : 'border-gray-200 hover:border-gray-300'
                                }`}
                              >
                                <img
                                  src={url}
                                  alt={`${vehicle.make} ${vehicle.model} ${idx + 1}`}
                                  className="w-full h-full object-cover"
                                />
                              </button>
                            ))}
                          </div>
                        )}
                      </div>

                      <CardContent className="p-4 pt-3">
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
                  )
                })}
              </div>
            )}
          </div>
        </div>
      </div>
      </div>
    </>
  )
}

export default Vehicles
