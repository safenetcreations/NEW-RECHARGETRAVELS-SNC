
import React, { useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Star, Clock, Users, MapPin } from 'lucide-react'
import { useActivities } from '@/hooks/useActivities'
import { useActivityCategories } from '@/hooks/useActivityCategories'
import { ActivityFilters } from '@/types/activity'
import ActivityFiltersComponent from '@/components/activities/ActivityFilters'
import ActivitySearch from '@/components/activities/ActivitySearch'
import LoadingSpinner from '@/components/LoadingSpinner'

const Activities = () => {
  const [filters, setFilters] = useState<Partial<ActivityFilters>>({})
  const { data: activities, isLoading, error } = useActivities(filters)
  const { data: categories } = useActivityCategories()

  console.log('Activities data:', activities)
  console.log('Categories data:', categories)
  console.log('Loading state:', isLoading)
  console.log('Error state:', error)

  const formatDuration = (minutes: number) => {
    if (minutes < 60) return `${minutes}m`
    const hours = Math.floor(minutes / 60)
    const remainingMinutes = minutes % 60
    return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`
  }

  const getDifficultyColor = (difficulty?: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-800'
      case 'moderate': return 'bg-yellow-100 text-yellow-800'
      case 'hard': return 'bg-orange-100 text-orange-800'
      case 'extreme': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  if (isLoading) {
    return <LoadingSpinner fullScreen message="Loading activities..." />
  }

  if (error) {
    console.error('Error loading activities:', error)
  }

  return (
    <>
      <Helmet>
        <title>Activities & Excursions - Sri Lanka Travel</title>
        <meta name="description" content="Discover amazing activities and excursions in Sri Lanka. From adventure sports to cultural experiences." />
      </Helmet>

      <div className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-green-600 to-blue-600 text-white py-16">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              Activities & Excursions
            </h1>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              Discover unforgettable experiences across Sri Lanka's diverse landscapes
            </p>
            <ActivitySearch onFiltersChange={setFilters} />
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Filters Sidebar */}
            <div className="lg:w-1/4">
              <ActivityFiltersComponent
                filters={filters}
                onFiltersChange={setFilters}
                categories={categories || []}
              />
            </div>

            {/* Activities Grid */}
            <div className="lg:w-3/4">
              {/* Show error message if there's an error */}
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                  <p className="text-red-800">Error loading activities. Please try again later.</p>
                </div>
              )}

              {/* Show sample activities if no data */}
              {(!activities || activities.length === 0) && !isLoading && (
                <div className="space-y-6">
                  <div className="text-center py-8">
                    <h3 className="text-xl font-semibold mb-2">No activities found in database</h3>
                    <p className="text-gray-600 mb-6">Here are some popular Sri Lankan activities:</p>
                  </div>
                  
                  {/* Sample Activities */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[
                      {
                        id: 'safari-yala',
                        name: 'Yala National Park Safari',
                        description: 'Experience Sri Lanka\'s premier wildlife sanctuary with leopards, elephants, and diverse bird species.',
                        location: 'Yala National Park',
                        price: 85,
                        duration: 360,
                        difficulty: 'easy',
                        rating: 4.8,
                        category: 'Wildlife Safari',
                        image: 'https://images.unsplash.com/photo-1474377207190-a7d8b3334068?w=400'
                      },
                      {
                        id: 'temple-kandy',
                        name: 'Temple of the Tooth Cultural Tour',
                        description: 'Visit the sacred Temple of the Tooth Relic and explore Kandy\'s rich cultural heritage.',
                        location: 'Kandy',
                        price: 45,
                        duration: 180,
                        difficulty: 'easy',
                        rating: 4.6,
                        category: 'Cultural Heritage',
                        image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400'
                      },
                      {
                        id: 'adams-peak',
                        name: 'Adam\'s Peak Sunrise Hike',
                        description: 'Challenge yourself with this sacred mountain climb for a breathtaking sunrise view.',
                        location: 'Adam\'s Peak',
                        price: 35,
                        duration: 480,
                        difficulty: 'hard',
                        rating: 4.9,
                        category: 'Adventure',
                        image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400'
                      },
                      {
                        id: 'whale-watching',
                        name: 'Whale & Dolphin Watching',
                        description: 'Spot blue whales, sperm whales, and dolphins in the waters off Mirissa.',
                        location: 'Mirissa',
                        price: 65,
                        duration: 240,
                        difficulty: 'easy',
                        rating: 4.7,
                        category: 'Marine Life',
                        image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400'
                      },
                      {
                        id: 'tea-plantation',
                        name: 'Hill Country Tea Plantation Tour',
                        description: 'Explore lush tea gardens and learn about Ceylon tea production in Nuwara Eliya.',
                        location: 'Nuwara Eliya',
                        price: 40,
                        duration: 300,
                        difficulty: 'moderate',
                        rating: 4.5,
                        category: 'Cultural Experience',
                        image: 'https://images.unsplash.com/photo-1556075798-4825dfaaf498?w=400'
                      },
                      {
                        id: 'sigiriya-rock',
                        name: 'Sigiriya Rock Fortress Climb',
                        description: 'Climb the ancient rock fortress and marvel at the engineering marvel of Sigiriya.',
                        location: 'Sigiriya',
                        price: 55,
                        duration: 240,
                        difficulty: 'moderate',
                        rating: 4.8,
                        category: 'Historical Sites',
                        image: 'https://images.unsplash.com/photo-1582650625119-3a31f8fa2699?w=400'
                      }
                    ].map((activity) => (
                      <Card key={activity.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                        <div className="relative h-48 bg-gray-200">
                          <img
                            src={activity.image}
                            alt={activity.name}
                            className="w-full h-full object-cover"
                          />
                          <Badge className={`absolute top-2 right-2 ${getDifficultyColor(activity.difficulty)}`}>
                            {activity.difficulty}
                          </Badge>
                        </div>
                        
                        <CardContent className="p-4">
                          <div className="flex items-center gap-2 mb-2">
                            <div className="flex items-center">
                              <Star className="h-4 w-4 text-yellow-400 fill-current" />
                              <span className="text-sm text-gray-600 ml-1">
                                {activity.rating}
                              </span>
                            </div>
                            <Badge variant="outline" className="text-xs">
                              {activity.category}
                            </Badge>
                          </div>
                          
                          <h3 className="font-semibold text-lg mb-2 line-clamp-2">
                            {activity.name}
                          </h3>
                          
                          <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                            {activity.description}
                          </p>
                          
                          <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                            <div className="flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              {formatDuration(activity.duration)}
                            </div>
                            <div className="flex items-center gap-1">
                              <MapPin className="h-4 w-4" />
                              {activity.location}
                            </div>
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <div className="text-lg font-bold text-green-600">
                              ${activity.price}
                            </div>
                            <Button size="sm" className="bg-green-600 hover:bg-green-700">
                              View Details
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              {/* Show actual activities if data exists */}
              {activities && activities.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {activities.map((activity) => (
                    <Card key={activity.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                      <div className="relative h-48 bg-gray-200">
                        {activity.media?.[0] ? (
                          <img
                            src={activity.media[0].file_url}
                            alt={activity.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400">
                            No Image
                          </div>
                        )}
                        {activity.difficulty && (
                          <Badge className={`absolute top-2 right-2 ${getDifficultyColor(activity.difficulty)}`}>
                            {activity.difficulty}
                          </Badge>
                        )}
                      </div>
                      
                      <CardContent className="p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="flex items-center">
                            <Star className="h-4 w-4 text-yellow-400 fill-current" />
                            <span className="text-sm text-gray-600 ml-1">
                              {activity.average_rating.toFixed(1)} ({activity.review_count})
                            </span>
                          </div>
                          {activity.category && (
                            <Badge variant="outline" className="text-xs">
                              {activity.category.icon} {activity.category.name}
                            </Badge>
                          )}
                        </div>
                        
                        <h3 className="font-semibold text-lg mb-2 line-clamp-2">
                          {activity.name}
                        </h3>
                        
                        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                          {activity.description}
                        </p>
                        
                        <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                          {activity.duration && (
                            <div className="flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              {formatDuration(activity.duration)}
                            </div>
                          )}
                          <div className="flex items-center gap-1">
                            <Users className="h-4 w-4" />
                            Up to {activity.max_capacity}
                          </div>
                          {activity.location_info && (
                            <div className="flex items-center gap-1">
                              <MapPin className="h-4 w-4" />
                              {activity.location_info.name}
                            </div>
                          )}
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="text-lg font-bold text-green-600">
                            ${activity.price}
                          </div>
                          <Button size="sm" className="bg-green-600 hover:bg-green-700">
                            View Details
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Activities
