
import React from 'react'
import { Link } from 'react-router-dom'
import { Star, Clock, CheckCircle } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

interface Provider {
  id: string
  name: string
  slug: string
  type: 'company' | 'independent'
  rating: number
  reviewCount: number
  startingRate: number
  vehicleTypes: string[]
  specialties: string[]
  profileImage: string
  description: string
  verified: boolean
  responseTime: string
}

interface ProviderCardProps {
  provider: Provider
  onBookNow?: (providerId: string) => void
}

const ProviderCard: React.FC<ProviderCardProps> = ({ provider, onBookNow }) => {
  return (
    <Card className="hover:shadow-xl transition-shadow duration-300 bg-white h-full">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-4">
            <img 
              src={provider.profileImage} 
              alt={provider.name}
              className="w-16 h-16 rounded-full object-cover border-2 border-gray-200"
            />
            <div>
              <CardTitle className="text-lg font-bold text-gray-900 line-clamp-1">
                {provider.name}
              </CardTitle>
              <div className="flex items-center mt-1 space-x-2">
                <Badge 
                  variant={provider.type === 'company' ? 'default' : 'secondary'}
                  className={provider.type === 'company' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'}
                >
                  {provider.type === 'company' ? 'Registered Company' : 'Owner-Operator'}
                </Badge>
                {provider.verified && (
                  <CheckCircle className="w-4 h-4 text-green-500" />
                )}
              </div>
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <p className="text-gray-600 text-sm line-clamp-2 leading-relaxed">
          {provider.description}
        </p>
        
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Star className="w-4 h-4 text-yellow-400 fill-current" />
              <span className="ml-1 font-medium text-sm">{provider.rating}</span>
              <span className="text-gray-500 text-xs ml-1">({provider.reviewCount})</span>
            </div>
            <div className="flex items-center text-xs text-gray-600">
              <Clock className="w-3 h-3 mr-1" />
              {provider.responseTime}
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex flex-wrap gap-1">
              {provider.vehicleTypes.slice(0, 2).map((vehicle, index) => (
                <Badge key={index} variant="outline" className="text-xs px-2 py-0.5">
                  {vehicle}
                </Badge>
              ))}
              {provider.vehicleTypes.length > 2 && (
                <Badge variant="outline" className="text-xs px-2 py-0.5">
                  +{provider.vehicleTypes.length - 2}
                </Badge>
              )}
            </div>
            
            <div className="flex flex-wrap gap-1">
              {provider.specialties.slice(0, 2).map((specialty, index) => (
                <Badge key={index} variant="secondary" className="text-xs px-2 py-0.5">
                  {specialty}
                </Badge>
              ))}
              {provider.specialties.length > 2 && (
                <Badge variant="secondary" className="text-xs px-2 py-0.5">
                  +{provider.specialties.length - 2}
                </Badge>
              )}
            </div>
          </div>
        </div>
        
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div>
            <span className="text-xl font-bold text-orange-600">
              ${provider.startingRate}
            </span>
            <span className="text-gray-600 text-sm">/day</span>
          </div>
          <div className="flex space-x-2">
            <Link to={`/tours/driver-guide/${provider.slug}`}>
              <Button variant="outline" size="sm" className="text-xs px-3 py-1.5">
                View Profile
              </Button>
            </Link>
            <Button 
              size="sm" 
              className="bg-orange-600 hover:bg-orange-700 text-xs px-3 py-1.5"
              onClick={() => onBookNow?.(provider.id)}
            >
              Book Now
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default ProviderCard
