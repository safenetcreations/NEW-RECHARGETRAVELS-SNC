import { useState } from 'react'
import { MapPin, Navigation, Clock } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

interface PhotoLocation {
  name: string
  lat: number
  lng: number
}

interface MeetingPoint {
  name: string
  lat: number
  lng: number
}

interface PhotoLocationMapProps {
  locations: any[] | null
  meetingPoint: MeetingPoint
}

const PhotoLocationMap = ({ locations, meetingPoint }: PhotoLocationMapProps) => {
  const [selectedLocation, setSelectedLocation] = useState<PhotoLocation | null>(null)

  // Parse locations from JSON
  const photoLocations: PhotoLocation[] = locations && Array.isArray(locations) 
    ? locations.filter(loc => loc && typeof loc === 'object' && loc.name && loc.lat && loc.lng)
    : []

  // Add meeting point to the list if it's valid
  const allLocations = [
    ...(meetingPoint.lat && meetingPoint.lng ? [{ 
      name: `Meeting Point: ${meetingPoint.name}`, 
      lat: meetingPoint.lat, 
      lng: meetingPoint.lng,
      isMeetingPoint: true 
    }] : []),
    ...photoLocations.map(loc => ({ ...loc, isMeetingPoint: false }))
  ]

  const handleLocationClick = (location: PhotoLocation) => {
    setSelectedLocation(location)
    // In a real implementation, this would center the map on the location
  }

  const openInGoogleMaps = (location: PhotoLocation) => {
    const url = `https://maps.google.com/?q=${location.lat},${location.lng}`
    window.open(url, '_blank')
  }

  if (allLocations.length === 0) {
    return (
      <div className="text-center py-8">
        <MapPin className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
        <p className="text-muted-foreground">Location details will be provided upon booking.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Map Placeholder */}
      <div className="relative aspect-[16/9] bg-muted rounded-lg overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <MapPin className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">Interactive Map</h3>
            <p className="text-muted-foreground max-w-md">
              Map integration coming soon. For now, use the location list below to navigate to each photo spot.
            </p>
          </div>
        </div>
        
        {/* Overlay with location pins */}
        <div className="absolute inset-4 grid grid-cols-2 md:grid-cols-3 gap-2">
          {allLocations.slice(0, 6).map((location, index) => (
            <div
              key={index}
              className={`relative bg-white/90 backdrop-blur-sm rounded-lg p-3 cursor-pointer hover:bg-white transition-all ${
                selectedLocation?.name === location.name ? 'ring-2 ring-primary' : ''
              }`}
              onClick={() => handleLocationClick(location)}
            >
              <div className="flex items-center gap-2">
                <MapPin className={`w-4 h-4 ${location.isMeetingPoint ? 'text-green-600' : 'text-primary'}`} />
                <span className="text-sm font-medium text-foreground truncate">
                  {location.name}
                </span>
              </div>
              {location.isMeetingPoint && (
                <Badge variant="secondary" className="mt-1 text-xs">
                  Start Here
                </Badge>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Location List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {allLocations.map((location, index) => (
          <Card 
            key={index} 
            className={`cursor-pointer transition-all hover:shadow-md ${
              selectedLocation?.name === location.name ? 'ring-2 ring-primary' : ''
            }`}
            onClick={() => handleLocationClick(location)}
          >
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <MapPin className={`w-5 h-5 ${location.isMeetingPoint ? 'text-green-600' : 'text-primary'}`} />
                {location.name}
                {location.isMeetingPoint && (
                  <Badge variant="secondary" className="text-xs">
                    Meeting Point
                  </Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-3">
                <div className="text-sm text-muted-foreground">
                  <p>Coordinates: {location.lat.toFixed(4)}, {location.lng.toFixed(4)}</p>
                </div>
                
                <div className="flex gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      openInGoogleMaps(location)
                    }}
                    className="flex items-center gap-1 text-sm text-primary hover:underline"
                  >
                    <Navigation className="w-4 h-4" />
                    Get Directions
                  </button>
                </div>

                {location.isMeetingPoint && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="w-4 h-4" />
                    <span>Tour starts here - arrive 15 minutes early</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Travel Times Widget */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Estimated Travel Times
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm">
            <p className="text-muted-foreground">
              Travel times between photo locations are included in the tour duration. 
              Our experienced guides know the best routes and will ensure efficient movement between spots.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Between locations:</span>
                <span className="font-medium">5-20 minutes</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Photo time per location:</span>
                <span className="font-medium">30-60 minutes</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default PhotoLocationMap