
import React, { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { MapPin, Route, Clock, Star, Navigation } from 'lucide-react'

interface Site {
  id: string
  name: string
  description: string
  duration: string
  highlights: string[]
  coordinates: { lat: number; lng: number }
  image: string
}

interface InteractiveMapProps {
  sites: Site[]
}

const InteractiveMap: React.FC<InteractiveMapProps> = ({ sites }) => {
  const [selectedSite, setSelectedSite] = useState<Site | null>(null)
  const [userLocation, setUserLocation] = useState('')
  const [routeInfo, setRouteInfo] = useState<{distance: string; duration: string} | null>(null)

  const calculateRoute = () => {
    if (!userLocation) {
      alert('Please enter your location first')
      return
    }
    
    // Simulate route calculation
    setRouteInfo({
      distance: '245 km',
      duration: '4h 30min'
    })
  }

  const centerCoordinates = {
    lat: 7.5,
    lng: 80.5
  }

  return (
    <div className="space-y-6">
      {/* Location Input */}
      <Card>
        <CardContent className="p-6">
          <div className="flex gap-4 items-end">
            <div className="flex-1">
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Calculate Distance From Your Location
              </label>
              <input
                type="text"
                placeholder="Enter your city or address..."
                value={userLocation}
                onChange={(e) => setUserLocation(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
              />
            </div>
            <Button
              onClick={calculateRoute}
              className="bg-amber-500 hover:bg-amber-600 text-white"
            >
              <Navigation className="w-4 h-4 mr-2" />
              Calculate Route
            </Button>
          </div>
          
          {routeInfo && (
            <div className="mt-4 p-4 bg-amber-50 rounded-lg border border-amber-200">
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <Route className="w-4 h-4 text-amber-600" />
                  <span className="font-semibold">Distance:</span>
                  <span>{routeInfo.distance}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-amber-600" />
                  <span className="font-semibold">Drive Time:</span>
                  <span>{routeInfo.duration}</span>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Map Container */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Interactive Map */}
        <div className="lg:col-span-2">
          <Card className="h-96">
            <CardContent className="p-0 relative h-full">
              {/* Map placeholder with cultural circuit route */}
              <div className="absolute inset-0 bg-gradient-to-br from-green-100 to-blue-100 rounded-lg">
                <div 
                  className="absolute inset-0 bg-cover bg-center rounded-lg opacity-70"
                  style={{
                    backgroundImage: 'url(https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=800&h=400&fit=crop)'
                  }}
                />
                
                {/* Cultural Triangle Route Overlay */}
                <svg 
                  className="absolute inset-0 w-full h-full"
                  viewBox="0 0 400 300"
                  style={{ zIndex: 10 }}
                >
                  {/* Route lines connecting cultural sites */}
                  <path
                    d="M 80 150 Q 150 100 220 130 Q 280 160 320 140 Q 350 120 380 100"
                    stroke="#f59e0b"
                    strokeWidth="3"
                    fill="none"
                    className="animate-pulse"
                  />
                  <path
                    d="M 80 150 Q 120 200 180 220 Q 240 240 300 210 Q 340 190 380 180"
                    stroke="#f59e0b"
                    strokeWidth="3"
                    fill="none"
                    className="animate-pulse"
                  />
                </svg>
                
                {/* Site markers */}
                {sites.map((site, index) => (
                  <button
                    key={site.id}
                    onClick={() => setSelectedSite(site)}
                    className="absolute transform -translate-x-1/2 -translate-y-1/2 group hover:scale-110 transition-transform"
                    style={{
                      left: `${20 + (index * 12)}%`,
                      top: `${30 + (index % 3 * 20)}%`
                    }}
                  >
                    <div className="w-8 h-8 bg-amber-500 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg group-hover:bg-amber-600">
                      {index + 1}
                    </div>
                    <div className="absolute top-10 left-1/2 transform -translate-x-1/2 bg-white px-2 py-1 rounded shadow-lg text-xs font-semibold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                      {site.name}
                    </div>
                  </button>
                ))}
                
                {/* Legend */}
                <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm p-3 rounded-lg shadow-lg">
                  <div className="text-xs font-semibold text-gray-900 mb-2">Cultural Triangle Route</div>
                  <div className="flex items-center gap-2 text-xs text-gray-600">
                    <div className="w-3 h-3 bg-amber-500 rounded-full"></div>
                    <span>UNESCO Heritage Sites</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Site Information Panel */}
        <div className="space-y-4">
          {selectedSite ? (
            <Card>
              <CardContent className="p-6">
                <img
                  src={selectedSite.image}
                  alt={selectedSite.name}
                  className="w-full h-32 object-cover rounded-lg mb-4"
                />
                <h3 className="text-lg font-bold text-gray-900 mb-2">{selectedSite.name}</h3>
                <p className="text-sm text-gray-600 mb-4">{selectedSite.description}</p>
                
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Clock className="w-4 h-4 text-amber-500" />
                    <span>{selectedSite.duration}</span>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-semibold text-gray-900 mb-2">Highlights:</h4>
                    <div className="space-y-1">
                      {selectedSite.highlights.map((highlight, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-xs text-gray-600">
                          <Star className="w-3 h-3 text-amber-500" />
                          <span>{highlight}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="pt-3 border-t border-gray-200">
                    <Badge variant="outline" className="text-xs">
                      Site {sites.findIndex(s => s.id === selectedSite.id) + 1} of {sites.length}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="p-6 text-center">
                <MapPin className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Explore Cultural Sites</h3>
                <p className="text-sm text-gray-600">
                  Click on any numbered marker to learn more about each UNESCO World Heritage site
                </p>
              </CardContent>
            </Card>
          )}
          
          {/* Quick Stats */}
          <Card>
            <CardContent className="p-6">
              <h4 className="font-semibold text-gray-900 mb-4">Circuit Overview</h4>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Sites:</span>
                  <span className="font-semibold">{sites.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">UNESCO Sites:</span>
                  <span className="font-semibold">6</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Recommended Duration:</span>
                  <span className="font-semibold">7-14 days</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Best Season:</span>
                  <span className="font-semibold">Dec - Apr</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default InteractiveMap
