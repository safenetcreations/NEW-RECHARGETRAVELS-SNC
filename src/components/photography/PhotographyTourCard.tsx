import { Link } from 'react-router-dom'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { MapPin, Clock, Users, Camera } from 'lucide-react'
import { PhotographyTour } from '@/hooks/usePhotographyTours'

interface PhotographyTourCardProps {
  tour: PhotographyTour
}

const PhotographyTourCard = ({ tour }: PhotographyTourCardProps) => {
  const genreDisplayName = {
    cultural_temples: 'Cultural & Temples',
    wildlife_nature: 'Wildlife & Nature',
    scenic_trains: 'Scenic Trains',
    street_local: 'Street & Local'
  }[tour.genre]

  const skillLevelDisplayName = {
    beginner: 'Beginner',
    intermediate: 'Intermediate',
    pro: 'Professional'
  }[tour.skill_level]

  const durationDisplayName = {
    half_day: 'Half Day',
    full_day: 'Full Day',
    multi_day: 'Multi Day'
  }[tour.duration_type]

  return (
    <div className="group bg-card border border-border rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300">
      {/* Tour Image */}
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={tour.hero_image_url || 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop'}
          alt={tour.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
        />
        <div className="absolute top-4 left-4 flex gap-2">
          <Badge variant="secondary" className="bg-background/90 backdrop-blur-sm">
            {genreDisplayName}
          </Badge>
          {tour.is_featured && (
            <Badge className="bg-primary text-primary-foreground">
              Featured
            </Badge>
          )}
        </div>
        {tour.gear_rental_available && (
          <div className="absolute top-4 right-4">
            <div className="bg-background/90 backdrop-blur-sm rounded-full p-2">
              <Camera className="w-4 h-4 text-foreground" />
            </div>
          </div>
        )}
      </div>

      {/* Tour Info */}
      <div className="p-6 space-y-4">
        <div>
          <h3 className="text-xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
            {tour.title}
          </h3>
          <p className="text-muted-foreground text-sm line-clamp-2">
            {tour.description}
          </p>
        </div>

        {/* Tour Details */}
        <div className="space-y-2 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 flex-shrink-0" />
            <span>{tour.location}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 flex-shrink-0" />
            <span>{durationDisplayName} ({tour.duration_hours}h)</span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 flex-shrink-0" />
            <span>{tour.min_participants}-{tour.max_participants} people</span>
          </div>
        </div>

        {/* Skill Level & Inclusions */}
        <div className="flex flex-wrap gap-2">
          <Badge variant="outline" className="text-xs">
            {skillLevelDisplayName}
          </Badge>
          {tour.inclusions && Array.isArray(tour.inclusions) && tour.inclusions.slice(0, 2).map((inclusion, index) => (
            <Badge key={index} variant="outline" className="text-xs">
              {inclusion}
            </Badge>
          ))}
          {tour.inclusions && Array.isArray(tour.inclusions) && tour.inclusions.length > 2 && (
            <Badge variant="outline" className="text-xs">
              +{tour.inclusions.length - 2} more
            </Badge>
          )}
        </div>

        {/* Pricing */}
        <div className="flex items-center justify-between pt-4 border-t border-border">
          <div>
            <div className="text-2xl font-bold text-foreground">
              ${tour.price_standard}
              <span className="text-sm font-normal text-muted-foreground"> /person</span>
            </div>
            {tour.price_pro && (
              <div className="text-sm text-muted-foreground">
                Pro package: ${tour.price_pro}
              </div>
            )}
          </div>
          
          <Button asChild>
            <Link to={`/tours/photography/${tour.slug}`}>
              View Details
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}

export default PhotographyTourCard