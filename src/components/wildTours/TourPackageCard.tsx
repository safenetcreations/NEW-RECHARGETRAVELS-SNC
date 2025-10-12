
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Car, 
  Users, 
  MapPin, 
  Star, 
  Clock,
  Camera,
  Utensils,
  Bed
} from 'lucide-react'

export interface TourPackage {
  id: string
  title: string
  location: string
  description: string[]
  image: string
  tier: 'semi-luxury' | 'budget'
  price: number
  originalPrice?: number
  duration: string
  inclusions: {
    vehicle: string
    guide: string
    accommodation: string
    meals?: string
    extras?: string[]
  }
  highlights: string[]
  maxParticipants: number
  rating: number
  reviewCount: number
}

interface TourPackageCardProps {
  package: TourPackage
  onSelect: (packageData: TourPackage) => void
}

const TourPackageCard = ({ package: pkg, onSelect }: TourPackageCardProps) => {
  const tierColors = {
    'semi-luxury': 'bg-gradient-to-r from-amber-500 to-orange-500',
    'budget': 'bg-gradient-to-r from-green-500 to-emerald-500'
  }

  const tierLabels = {
    'semi-luxury': 'Semi-Luxury',
    'budget': 'Budget-Friendly'
  }

  return (
    <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 group">
      <div className="relative">
        <img
          src={pkg.image}
          alt={`${pkg.title} - ${tierLabels[pkg.tier]}`}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        
        <div className="absolute top-4 left-4">
          <Badge className={`${tierColors[pkg.tier]} text-white font-semibold`}>
            {tierLabels[pkg.tier]}
          </Badge>
        </div>

        <div className="absolute top-4 right-4 bg-black/70 text-white px-2 py-1 rounded-md">
          <div className="flex items-center gap-1">
            <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
            <span className="text-sm font-medium">{pkg.rating}</span>
            <span className="text-xs opacity-80">({pkg.reviewCount})</span>
          </div>
        </div>

        {pkg.originalPrice && (
          <div className="absolute bottom-4 right-4 bg-red-500 text-white px-2 py-1 rounded-md text-sm font-medium">
            Save ${pkg.originalPrice - pkg.price}
          </div>
        )}
      </div>

      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-xl font-playfair font-bold text-gray-900 mb-1">
              {pkg.title}
            </CardTitle>
            <div className="flex items-center text-gray-600 mb-2">
              <MapPin className="w-4 h-4 mr-1" />
              <span className="text-sm font-montserrat">{pkg.location}</span>
            </div>
          </div>
          <div className="text-right">
            {pkg.originalPrice && (
              <div className="text-sm text-gray-500 line-through font-montserrat">
                ${pkg.originalPrice}
              </div>
            )}
            <div className="text-2xl font-bold text-green-600 font-playfair">
              ${pkg.price}
            </div>
            <div className="text-xs text-gray-500 font-montserrat">per person</div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Description */}
        <div className="space-y-1">
          {pkg.description.map((line, index) => (
            <p key={index} className="text-sm text-gray-700 font-montserrat leading-relaxed">
              {line}
            </p>
          ))}
        </div>

        {/* Key Info */}
        <div className="flex items-center justify-between text-sm text-gray-600 py-2 border-t border-gray-100">
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            <span className="font-montserrat">{pkg.duration}</span>
          </div>
          <div className="flex items-center gap-1">
            <Users className="w-4 h-4" />
            <span className="font-montserrat">Max {pkg.maxParticipants}</span>
          </div>
        </div>

        {/* Inclusions */}
        <div className="space-y-2">
          <h4 className="font-semibold text-gray-800 font-montserrat text-sm">What's Included:</h4>
          <div className="grid grid-cols-1 gap-1 text-xs text-gray-600">
            <div className="flex items-center gap-2">
              <Car className="w-3 h-3 text-blue-500" />
              <span className="font-montserrat">{pkg.inclusions.vehicle}</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-3 h-3 text-green-500" />
              <span className="font-montserrat">{pkg.inclusions.guide}</span>
            </div>
            <div className="flex items-center gap-2">
              <Bed className="w-3 h-3 text-purple-500" />
              <span className="font-montserrat">{pkg.inclusions.accommodation}</span>
            </div>
            {pkg.inclusions.meals && (
              <div className="flex items-center gap-2">
                <Utensils className="w-3 h-3 text-orange-500" />
                <span className="font-montserrat">{pkg.inclusions.meals}</span>
              </div>
            )}
          </div>
        </div>

        {/* Highlights */}
        {pkg.highlights.length > 0 && (
          <div className="space-y-2">
            <h4 className="font-semibold text-gray-800 font-montserrat text-sm">Highlights:</h4>
            <div className="flex flex-wrap gap-1">
              {pkg.highlights.slice(0, 3).map((highlight, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {highlight}
                </Badge>
              ))}
              {pkg.highlights.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{pkg.highlights.length - 3} more
                </Badge>
              )}
            </div>
          </div>
        )}

        {/* Action Button */}
        <Button 
          onClick={() => onSelect(pkg)}
          className={`w-full ${tierColors[pkg.tier]} hover:opacity-90 text-white font-semibold transition-all duration-300 transform hover:scale-105`}
        >
          Select & Book
        </Button>
      </CardContent>
    </Card>
  )
}

export default TourPackageCard
