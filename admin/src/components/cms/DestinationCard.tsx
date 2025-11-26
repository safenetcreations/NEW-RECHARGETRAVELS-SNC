
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { MapPin, Calendar } from 'lucide-react'
import { Destination } from '@/lib/cms-queries'
import { Link } from 'react-router-dom'

interface DestinationCardProps {
  destination: Destination
}

const DestinationCard = ({ destination }: DestinationCardProps) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  return (
    <Link to={`/destinations/${destination.slug}`}>
      <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
        {destination.og_image_url && (
          <div className="aspect-video overflow-hidden">
            <img 
              src={destination.og_image_url} 
              alt={destination.name}
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
            />
          </div>
        )}
        
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <h3 className="text-xl font-bold text-gray-900 line-clamp-2">
              {destination.name}
            </h3>
            <Badge variant="secondary" className="ml-2 shrink-0">
              {destination.dest_type}
            </Badge>
          </div>
          
          {destination.region && (
            <div className="flex items-center text-gray-600 text-sm">
              <MapPin className="h-4 w-4 mr-1" />
              {destination.region.name}
            </div>
          )}
        </CardHeader>
        
        <CardContent className="pt-0">
          {destination.summary && (
            <p className="text-gray-700 text-sm line-clamp-3 mb-3">
              {destination.summary}
            </p>
          )}
          
          <div className="flex items-center justify-between text-xs text-gray-500">
            <div className="flex items-center">
              <Calendar className="h-3 w-3 mr-1" />
              {formatDate(destination.created_at)}
            </div>
            
            {destination.latitude && destination.longitude && (
              <div className="text-teal-600 font-medium">
                View Location
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}

export default DestinationCard
