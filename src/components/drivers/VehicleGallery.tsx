
import React, { useState } from 'react'
import { Users, ChevronLeft, ChevronRight } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

interface Vehicle {
  id: string
  type: string
  make: string
  model: string
  seats: number
  features: string[]
  images: string[]
  dailyRate: number
}

interface VehicleGalleryProps {
  vehicles: Vehicle[]
  onSelectVehicle?: (vehicleId: string) => void
  selectedVehicleId?: string
}

const VehicleGallery: React.FC<VehicleGalleryProps> = ({ 
  vehicles, 
  onSelectVehicle, 
  selectedVehicleId 
}) => {
  const [currentImageIndex, setCurrentImageIndex] = useState<{ [key: string]: number }>({})

  const nextImage = (vehicleId: string, maxImages: number) => {
    setCurrentImageIndex(prev => ({
      ...prev,
      [vehicleId]: ((prev[vehicleId] || 0) + 1) % maxImages
    }))
  }

  const prevImage = (vehicleId: string, maxImages: number) => {
    setCurrentImageIndex(prev => ({
      ...prev,
      [vehicleId]: ((prev[vehicleId] || 0) - 1 + maxImages) % maxImages
    }))
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {vehicles.map((vehicle) => {
        const currentIndex = currentImageIndex[vehicle.id] || 0
        const isSelected = selectedVehicleId === vehicle.id
        
        return (
          <Card 
            key={vehicle.id} 
            className={`cursor-pointer transition-all duration-200 ${
              isSelected ? 'ring-2 ring-orange-500 shadow-lg' : 'hover:shadow-lg'
            }`}
            onClick={() => onSelectVehicle?.(vehicle.id)}
          >
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="text-lg">{vehicle.make} {vehicle.model}</span>
                <Badge variant={isSelected ? 'default' : 'secondary'}>
                  {vehicle.type}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {/* Image Gallery */}
              <div className="relative mb-4 rounded-lg overflow-hidden bg-gray-100">
                <img 
                  src={vehicle.images[currentIndex]}
                  alt={`${vehicle.make} ${vehicle.model}`}
                  className="w-full h-48 object-cover"
                />
                
                {vehicle.images.length > 1 && (
                  <>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white"
                      onClick={(e) => {
                        e.stopPropagation()
                        prevImage(vehicle.id, vehicle.images.length)
                      }}
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white"
                      onClick={(e) => {
                        e.stopPropagation()
                        nextImage(vehicle.id, vehicle.images.length)
                      }}
                    >
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                    
                    {/* Image indicators */}
                    <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-1">
                      {vehicle.images.map((_, index) => (
                        <div
                          key={index}
                          className={`w-2 h-2 rounded-full ${
                            index === currentIndex ? 'bg-white' : 'bg-white/50'
                          }`}
                        />
                      ))}
                    </div>
                  </>
                )}
              </div>
              
              {/* Vehicle Details */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Users className="w-4 h-4 mr-2 text-gray-500" />
                    <span className="text-sm font-medium">{vehicle.seats} seats</span>
                  </div>
                  <div className="text-right">
                    <div className="text-xl font-bold text-orange-600">
                      ${vehicle.dailyRate}
                    </div>
                    <div className="text-xs text-gray-600">/day</div>
                  </div>
                </div>
                
                <div>
                  <h5 className="font-medium mb-2 text-sm">Features</h5>
                  <div className="flex flex-wrap gap-1">
                    {vehicle.features.map((feature, i) => (
                      <Badge key={i} variant="outline" className="text-xs px-2 py-0.5">
                        {feature}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                {isSelected && (
                  <div className="mt-3 p-2 bg-orange-50 rounded-md">
                    <div className="text-sm text-orange-800 font-medium">
                      ✓ Selected Vehicle
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}

export default VehicleGallery
