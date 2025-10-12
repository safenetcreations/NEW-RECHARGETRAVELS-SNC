
import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Star, Phone, Mail, Clock, Award, MessageCircle } from 'lucide-react'
import { getDriver } from '@/lib/vehicle-service'
import type { Driver } from '@/types/vehicle'
import { toast } from 'sonner'

const DriverProfile = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [driver, setDriver] = useState<Driver | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (id) {
      loadDriver()
    }
  }, [id])

  const loadDriver = async () => {
    if (!id) return
    
    try {
      const driverData = await getDriver(id)
      setDriver(driverData)
    } catch (error) {
      console.error('Error loading driver:', error)
      toast.error('Failed to load driver profile')
      navigate('/vehicles')
    } finally {
      setLoading(false)
    }
  }

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < Math.floor(rating) 
            ? 'fill-yellow-400 text-yellow-400' 
            : 'text-gray-300'
        }`}
      />
    ))
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 rounded-full bg-gray-200 animate-pulse mx-auto mb-4" />
          <p className="text-granite-gray">Loading driver profile...</p>
        </div>
      </div>
    )
  }

  if (!driver) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 rounded-full bg-gray-200 mx-auto mb-4" />
          <h2 className="text-2xl font-semibold mb-2">Driver not found</h2>
          <Button onClick={() => navigate('/vehicles')}>
            Back to Vehicles
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Back Button */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <Button variant="ghost" onClick={() => navigate(-1)}>
            ← Back
          </Button>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Driver Info */}
            <div className="lg:col-span-2 space-y-6">
              {/* Driver Profile Card */}
              <Card>
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row items-start gap-6">
                    <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden flex-shrink-0">
                      {driver.photo_url ? (
                        <img
                          src={driver.photo_url}
                          alt={driver.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-4xl font-bold text-gray-400">
                          {driver.name[0]}
                        </span>
                      )}
                    </div>

                    <div className="flex-1">
                      <h1 className="text-3xl font-bold mb-2">{driver.name}</h1>
                      
                      <div className="flex items-center gap-2 mb-3">
                        <div className="flex items-center">
                          {renderStars(driver.rating)}
                        </div>
                        <span className="font-semibold">{driver.rating.toFixed(1)}</span>
                        <span className="text-gray-600">({driver.total_reviews} reviews)</span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div className="flex items-center gap-2 text-gray-600">
                          <Clock className="h-4 w-4" />
                          <span>{driver.experience_years} years experience</span>
                        </div>
                        {driver.license_number && (
                          <div className="flex items-center gap-2 text-gray-600">
                            <Award className="h-4 w-4" />
                            <span>License: {driver.license_number}</span>
                          </div>
                        )}
                      </div>

                      <div className="flex flex-wrap gap-2 mb-4">
                        {driver.languages.map((language, index) => (
                          <Badge key={index} variant="outline">
                            {language}
                          </Badge>
                        ))}
                      </div>

                      {driver.bio && (
                        <p className="text-gray-700 leading-relaxed">{driver.bio}</p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Reviews */}
              {driver.reviews && driver.reviews.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MessageCircle className="h-5 w-5" />
                      Customer Reviews
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {driver.reviews
                        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
                        .slice(0, 10)
                        .map(review => (
                        <div key={review.id} className="border-b pb-4 last:border-b-0">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <p className="font-semibold">
                                {review.guest_name || 'Anonymous'}
                              </p>
                              <div className="flex items-center gap-1">
                                {renderStars(review.rating)}
                              </div>
                            </div>
                            <p className="text-sm text-gray-500">
                              {new Date(review.created_at).toLocaleDateString()}
                            </p>
                          </div>
                          {review.comment && (
                            <p className="text-gray-700">{review.comment}</p>
                          )}
                          {review.is_verified && (
                            <Badge variant="outline" className="mt-2 text-xs">
                              Verified Review
                            </Badge>
                          )}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Right Column - Contact & Stats */}
            <div className="space-y-6">
              {/* Contact Info */}
              <Card>
                <CardHeader>
                  <CardTitle>Contact Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {driver.phone && (
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-wild-orange" />
                      <span>{driver.phone}</span>
                    </div>
                  )}
                  {driver.email && (
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-wild-orange" />
                      <span>{driver.email}</span>
                    </div>
                  )}
                  
                  <div className="pt-2">
                    <p className="text-sm text-gray-600">
                      Available for bookings through our vehicle rental service
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Driver Stats */}
              <Card>
                <CardHeader>
                  <CardTitle>Driver Statistics</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center">
                    <p className="text-3xl font-bold text-wild-orange">{driver.rating.toFixed(1)}</p>
                    <p className="text-sm text-gray-600">Average Rating</p>
                  </div>
                  
                  <div className="text-center">
                    <p className="text-3xl font-bold text-jungle-green">{driver.total_reviews}</p>
                    <p className="text-sm text-gray-600">Total Reviews</p>
                  </div>
                  
                  <div className="text-center">
                    <p className="text-3xl font-bold text-blue-600">{driver.experience_years}</p>
                    <p className="text-sm text-gray-600">Years Experience</p>
                  </div>

                  <div className="text-center">
                    <p className="text-3xl font-bold text-purple-600">{driver.languages.length}</p>
                    <p className="text-sm text-gray-600">Languages Spoken</p>
                  </div>
                </CardContent>
              </Card>

              {/* Action Buttons */}
              <div className="space-y-3">
                <Button 
                  onClick={() => navigate('/vehicles')}
                  className="w-full bg-wild-orange hover:bg-wild-orange/90"
                >
                  Book Vehicle with This Driver
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => navigate(-1)}
                  className="w-full"
                >
                  Back to Vehicle
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DriverProfile
