import React from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useTourPackages } from '@/hooks/useTourPackages';
import { 
  Calendar, 
  MapPin, 
  Clock, 
  DollarSign, 
  Users, 
  Car, 
  Utensils, 
  Bed, 
  Camera,
  CheckCircle,
  XCircle,
  StarIcon
} from 'lucide-react';
import { toast } from 'sonner';

const TourPackageDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { selectedPackage, fetchTourPackageDetails, isLoading } = useTourPackages();

  React.useEffect(() => {
    if (id) {
      fetchTourPackageDetails(id);
    }
  }, [id, fetchTourPackageDetails]);

  const handleBookNow = () => {
    toast.success('Booking request submitted! Our team will contact you soon.');
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (!selectedPackage) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Tour Package Not Found</h2>
          <p className="text-gray-600">The requested tour package could not be found.</p>
        </div>
      </div>
    );
  }

  const getCategoryColor = (category: string) => {
    const colors = {
      'wildlife': 'bg-green-100 text-green-800',
      'cultural': 'bg-purple-100 text-purple-800',
      'beach': 'bg-blue-100 text-blue-800',
      'adventure': 'bg-red-100 text-red-800',
      'wellness': 'bg-teal-100 text-teal-800',
      'tea': 'bg-amber-100 text-amber-800',
    };
    return colors[category as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getLuxuryLevelColor = (level: string) => {
    const colors = {
      'luxury': 'bg-amber-100 text-amber-800 border-amber-300',
      'semi-luxury': 'bg-blue-100 text-blue-800 border-blue-300',
      'budget': 'bg-green-100 text-green-800 border-green-300',
    };
    return colors[level as keyof typeof colors] || 'bg-gray-100 text-gray-800 border-gray-300';
  };

  const getInclusionIcon = (type: string) => {
    const icons = {
      'accommodation': Bed,
      'meals': Utensils,
      'transport': Car,
      'activities': Camera,
      'guide': Users,
      'other': CheckCircle
    };
    return icons[type as keyof typeof icons] || CheckCircle;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{selectedPackage.name}</h1>
            <div className="flex items-center gap-4 mb-4">
              <Badge className={getCategoryColor(selectedPackage.category)}>
                {selectedPackage.category}
              </Badge>
              <Badge variant="outline" className={getLuxuryLevelColor(selectedPackage.luxury_level)}>
                {selectedPackage.luxury_level.charAt(0).toUpperCase() + selectedPackage.luxury_level.slice(1)}
              </Badge>
              <div className="flex items-center text-gray-600">
                <Clock className="h-4 w-4 mr-1" />
                {selectedPackage.duration_days} days
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-green-600">
              ${selectedPackage.base_price}
            </div>
            <div className="text-gray-500">per person</div>
            <Button 
              className="mt-4 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600"
              onClick={handleBookNow}
              size="lg"
            >
              Book Now
            </Button>
          </div>
        </div>

        {selectedPackage.description && (
          <p className="text-gray-700 text-lg leading-relaxed">{selectedPackage.description}</p>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Highlights */}
          {selectedPackage.highlights && selectedPackage.highlights.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Tour Highlights</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {selectedPackage.highlights.map((highlight, index) => (
                    <li key={index} className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span>{highlight}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          {/* Itinerary */}
          {selectedPackage.itinerary && selectedPackage.itinerary.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Day-by-Day Itinerary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {selectedPackage.itinerary
                    .sort((a, b) => a.day_number - b.day_number)
                    .map((day) => (
                    <div key={day.id} className="border-l-4 border-orange-200 pl-4">
                      <div className="flex items-center mb-2">
                        <div className="bg-orange-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-3">
                          {day.day_number}
                        </div>
                        <h3 className="text-lg font-semibold">{day.title}</h3>
                      </div>
                      {day.description && (
                        <p className="text-gray-700 mb-3">{day.description}</p>
                      )}
                      {day.activities && day.activities.length > 0 && (
                        <div className="mb-3">
                          <h4 className="font-medium text-gray-900 mb-1">Activities:</h4>
                          <ul className="list-disc list-inside text-gray-700 space-y-1">
                            {day.activities.map((activity, index) => (
                              <li key={index}>{activity}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                      {day.meals_included && day.meals_included.length > 0 && (
                        <div className="mb-3">
                          <h4 className="font-medium text-gray-900 mb-1">Meals:</h4>
                          <div className="flex gap-2">
                            {day.meals_included.map((meal, index) => (
                              <Badge key={index} variant="secondary">{meal}</Badge>
                            ))}
                          </div>
                        </div>
                      )}
                      {day.accommodation && (
                        <div className="mb-3">
                          <h4 className="font-medium text-gray-900 mb-1">Accommodation:</h4>
                          <p className="text-gray-700">{day.accommodation}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Accommodations */}
          {selectedPackage.accommodations && selectedPackage.accommodations.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Accommodations</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {selectedPackage.accommodations.map((accommodation) => (
                    <div key={accommodation.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-lg font-semibold">{accommodation.hotel_name}</h3>
                        {accommodation.star_rating && (
                          <div className="flex items-center">
                            {[...Array(accommodation.star_rating)].map((_, i) => (
                              <StarIcon key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            ))}
                          </div>
                        )}
                      </div>
                      <div className="flex items-center text-gray-600 mb-2">
                        <MapPin className="h-4 w-4 mr-1" />
                        {accommodation.location}
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <span>{accommodation.nights} nights</span>
                        {accommodation.room_type && <span>• {accommodation.room_type}</span>}
                        {accommodation.luxury_level && (
                          <Badge variant="outline">
                            {accommodation.luxury_level}
                          </Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Inclusions */}
          {selectedPackage.inclusions && selectedPackage.inclusions.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>What's Included</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {selectedPackage.inclusions
                    .filter(inclusion => inclusion.inclusion_type !== 'excluded')
                    .map((inclusion) => {
                      const IconComponent = getInclusionIcon(inclusion.inclusion_type);
                      return (
                        <div key={inclusion.id} className="flex items-start">
                          <IconComponent className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                          <div>
                            <div className="font-medium">{inclusion.item}</div>
                            {inclusion.description && (
                              <div className="text-sm text-gray-600">{inclusion.description}</div>
                            )}
                          </div>
                        </div>
                      );
                  })}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Exclusions */}
          {selectedPackage.inclusions && selectedPackage.inclusions.some(i => i.inclusion_type === 'excluded') && (
            <Card>
              <CardHeader>
                <CardTitle>Not Included</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {selectedPackage.inclusions
                    .filter(inclusion => inclusion.inclusion_type === 'excluded')
                    .map((inclusion) => (
                      <div key={inclusion.id} className="flex items-start">
                        <XCircle className="h-5 w-5 text-red-500 mr-2 mt-0.5 flex-shrink-0" />
                        <div>
                          <div className="font-medium">{inclusion.item}</div>
                          {inclusion.description && (
                            <div className="text-sm text-gray-600">{inclusion.description}</div>
                          )}
                        </div>
                      </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Pricing Details */}
          {selectedPackage.pricing && selectedPackage.pricing.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Pricing Details</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {selectedPackage.pricing.map((pricing) => (
                    <div key={pricing.id} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="font-medium capitalize">{pricing.luxury_level}</span>
                        <span className="font-bold">${pricing.base_price_per_person}</span>
                      </div>
                      <div className="text-sm text-gray-600 space-y-1">
                        {pricing.single_supplement_percentage && (
                          <div>Single supplement: +{pricing.single_supplement_percentage}%</div>
                        )}
                        {pricing.peak_season_surcharge_percentage && (
                          <div>Peak season: +{pricing.peak_season_surcharge_percentage}%</div>
                        )}
                        {pricing.group_discount_6plus_percentage && (
                          <div>Group 6+: -{pricing.group_discount_6plus_percentage}%</div>
                        )}
                        {pricing.child_discount_percentage && (
                          <div>Child discount: -{pricing.child_discount_percentage}%</div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Contact */}
          <Card>
            <CardHeader>
              <CardTitle>Need Help?</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <div className="font-medium">Call us</div>
                  <div className="text-gray-600">+94 77 123 4567</div>
                </div>
                <div>
                  <div className="font-medium">Email</div>
                  <div className="text-gray-600">info@rechargetravels.com</div>
                </div>
                <Button variant="outline" className="w-full">
                  Contact Us
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default TourPackageDetail;
