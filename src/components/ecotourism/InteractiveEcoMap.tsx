import { useState } from 'react'
import { MapPin, Home, Leaf, Navigation } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { EcoAccommodation } from '@/hooks/useEcoTours'

interface InteractiveEcoMapProps {
  location: {
    lat: number
    lng: number
    name: string
  }
  accommodations?: EcoAccommodation[]
}

const InteractiveEcoMap = ({ location, accommodations }: InteractiveEcoMapProps) => {
  const [selectedAccommodation, setSelectedAccommodation] = useState<string | null>(null)

  // Mock nearby locations - in a real app, this would be calculated based on coordinates
  const nearbyLocations = [
    { name: "Nearest Town", distance: "15 km", type: "town" },
    { name: "Airport", distance: "45 km", type: "airport" },
    { name: "Railway Station", distance: "20 km", type: "transport" },
    { name: "Medical Center", distance: "12 km", type: "medical" }
  ]

  const getGoogleMapsUrl = () => {
    return `https://www.google.com/maps/search/?api=1&query=${location.lat},${location.lng}`
  }

  const getDirectionsUrl = () => {
    return `https://www.google.com/maps/dir/?api=1&destination=${location.lat},${location.lng}`
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <MapPin className="w-5 h-5 mr-2 text-blue-600" />
            Location & Map
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Map Placeholder - In a real app, integrate with Google Maps API */}
          <div className="relative">
            <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300">
              <div className="text-center">
                <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-500 font-medium">{location.name}</p>
                <p className="text-sm text-gray-400">
                  {location.lat.toFixed(6)}, {location.lng.toFixed(6)}
                </p>
              </div>
            </div>
            
            {/* Map Controls */}
            <div className="absolute top-4 right-4 space-y-2">
              <Button size="sm" variant="secondary" asChild>
                <a href={getGoogleMapsUrl()} target="_blank" rel="noopener noreferrer">
                  <MapPin className="w-4 h-4 mr-1" />
                  View on Maps
                </a>
              </Button>
              <Button size="sm" variant="outline" asChild>
                <a href={getDirectionsUrl()} target="_blank" rel="noopener noreferrer">
                  <Navigation className="w-4 h-4 mr-1" />
                  Get Directions
                </a>
              </Button>
            </div>
          </div>

          {/* Location Details */}
          <div className="mt-4 space-y-4">
            <div>
              <h4 className="font-semibold mb-2">Nearby Locations</h4>
              <div className="grid grid-cols-2 gap-2">
                {nearbyLocations.map((nearby, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <span className="text-sm font-medium">{nearby.name}</span>
                    <Badge variant="outline" className="text-xs">{nearby.distance}</Badge>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Eco Accommodations Map */}
      {accommodations && accommodations.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Home className="w-5 h-5 mr-2 text-green-600" />
              Eco Accommodations Nearby
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {accommodations.map((accommodation) => (
                <div 
                  key={accommodation.id}
                  className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                    selectedAccommodation === accommodation.id 
                      ? 'border-primary bg-primary/5' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => setSelectedAccommodation(
                    selectedAccommodation === accommodation.id ? null : accommodation.id
                  )}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <h4 className="font-semibold">{accommodation.name}</h4>
                        <Badge variant="outline" className="text-xs">
                          <Leaf className="w-3 h-3 mr-1" />
                          {accommodation.type.replace('_', ' ')}
                        </Badge>
                      </div>
                      
                      <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                        {accommodation.description}
                      </p>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <MapPin className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-muted-foreground">
                            {accommodation.location}
                          </span>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold text-primary">
                            ${accommodation.price_per_night}
                          </div>
                          <div className="text-xs text-muted-foreground">per night</div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {selectedAccommodation === accommodation.id && (
                    <div className="mt-3 pt-3 border-t border-gray-200">
                      <div className="space-y-2">
                        <div>
                          <span className="text-sm font-medium">Sustainability Features:</span>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {accommodation.sustainability_features.slice(0, 3).map((feature, index) => (
                              <Badge key={index} variant="secondary" className="text-xs">
                                {feature}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        
                        <div>
                          <span className="text-sm font-medium">Amenities:</span>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {accommodation.amenities.slice(0, 4).map((amenity, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {amenity}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        
                        {accommodation.rating > 0 && (
                          <div className="flex items-center space-x-1">
                            <span className="text-sm font-medium">Rating:</span>
                            <div className="flex items-center">
                              {Array.from({ length: 5 }).map((_, i) => (
                                <span 
                                  key={i} 
                                  className={`text-sm ${i < accommodation.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                                >
                                  ★
                                </span>
                              ))}
                              <span className="text-sm text-muted-foreground ml-1">
                                ({accommodation.rating})
                              </span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
            
            <div className="mt-4 p-3 bg-green-50 rounded-lg">
              <p className="text-sm text-green-700">
                <Leaf className="w-4 h-4 inline mr-1" />
                All listed accommodations meet our sustainability criteria and support local communities.
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

export default InteractiveEcoMap