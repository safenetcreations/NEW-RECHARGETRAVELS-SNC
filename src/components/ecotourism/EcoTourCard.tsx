import { Link } from 'react-router-dom'
import { MapPin, Clock, Users, Leaf, TreePine, Heart } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { EcoTour } from '@/hooks/useEcoTours'

interface EcoTourCardProps {
  tour: EcoTour
}

const EcoTourCard = ({ tour }: EcoTourCardProps) => {
  const categoryLabels = {
    wildlife_conservation: 'Wildlife Conservation',
    agro_tourism: 'Agro-Tourism',
    community_homestays: 'Community Homestays',
    marine_protection: 'Marine Protection',
    forest_treks: 'Forest Treks'
  }

  const categoryIcons = {
    wildlife_conservation: TreePine,
    agro_tourism: Leaf,
    community_homestays: Heart,
    marine_protection: Users,
    forest_treks: TreePine
  }

  const CategoryIcon = categoryIcons[tour.category]

  return (
    <Card className="group overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
      <CardHeader className="p-0">
        <div className="relative overflow-hidden">
          <img 
            src={tour.hero_image_url || "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=300&fit=crop"} 
            alt={tour.name}
            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
          
          {/* Category Badge */}
          <Badge 
            variant="secondary" 
            className="absolute top-3 left-3 bg-white/90 text-primary hover:bg-white"
          >
            <CategoryIcon className="w-3 h-3 mr-1" />
            {categoryLabels[tour.category]}
          </Badge>

          {/* Featured Badge */}
          {tour.is_featured && (
            <Badge 
              variant="default" 
              className="absolute top-3 right-3 bg-primary text-white"
            >
              Featured
            </Badge>
          )}

          {/* Price */}
          <div className="absolute bottom-3 right-3 text-white">
            <div className="text-lg font-bold">${tour.price_per_person}</div>
            <div className="text-xs opacity-90">per person</div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-4">
        <h3 className="text-lg font-semibold mb-2 line-clamp-2 group-hover:text-primary transition-colors">
          {tour.name}
        </h3>
        
        <p className="text-muted-foreground text-sm mb-3 line-clamp-2">
          {tour.short_description}
        </p>

        {/* Tour Details */}
        <div className="space-y-2 text-sm text-muted-foreground">
          <div className="flex items-center">
            <MapPin className="w-4 h-4 mr-2 flex-shrink-0" />
            <span className="truncate">{tour.location}</span>
          </div>
          
          <div className="flex items-center">
            <Clock className="w-4 h-4 mr-2 flex-shrink-0" />
            <span>{tour.duration_text || `${tour.duration_days} days`}</span>
          </div>
          
          <div className="flex items-center">
            <Users className="w-4 h-4 mr-2 flex-shrink-0" />
            <span>Max {tour.group_size_max} people</span>
          </div>
        </div>

        {/* Impact Metrics */}
        <div className="mt-4 p-3 bg-green-50 rounded-lg">
          <div className="text-xs font-medium text-green-800 mb-2">Environmental Impact</div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            {tour.carbon_offset_kg > 0 && (
              <div className="flex items-center text-green-700">
                <Leaf className="w-3 h-3 mr-1" />
                <span>{tour.carbon_offset_kg}kg CO₂ offset</span>
              </div>
            )}
            {tour.trees_planted_per_booking > 0 && (
              <div className="flex items-center text-green-700">
                <TreePine className="w-3 h-3 mr-1" />
                <span>{tour.trees_planted_per_booking} trees planted</span>
              </div>
            )}
            {tour.community_fund_percentage > 0 && (
              <div className="flex items-center text-green-700">
                <Heart className="w-3 h-3 mr-1" />
                <span>{tour.community_fund_percentage}% to community</span>
              </div>
            )}
          </div>
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0">
        <Button asChild className="w-full">
          <Link to={`/tours/ecotourism/${tour.slug}`}>
            View Details
          </Link>
        </Button>
      </CardFooter>
    </Card>
  )
}

export default EcoTourCard