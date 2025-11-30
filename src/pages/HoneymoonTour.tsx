
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calendar,
  Clock,
  Users,
  MapPin,
  Star,
  Check,
  X,
  ChevronDown,
  ChevronUp,
  Share2,
  Heart,
  Download,
  Phone,
  Mail,
  MessageSquare
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import EnhancedBookingModal from '@/components/EnhancedBookingModal';
import { toast } from 'sonner';

import { luxuryExperienceService } from '@/services/luxuryExperienceService';
import type { LuxuryExperience } from '@/types/luxury-experience';

// Mock data for the honeymoon tour
const mockHoneymoonTour = {
  id: 'honeymoon-sri-lanka',
  slug: 'honeymoon-in-paradise',
  title: 'Honeymoon in Paradise: Sri Lanka',
  subtitle: 'A romantic journey through the pearl of the Indian Ocean.',
  heroImage: '/images/honeymoon/hero.jpg',
  gallery: [
    { url: '/images/honeymoon/gallery-1.jpg', alt: 'Couple on a beach' },
    { url: '/images/honeymoon/gallery-2.jpg', alt: 'Luxury hotel room' },
    { url: '/images/honeymoon/gallery-3.jpg', alt: 'Candlelit dinner' },
    { url: '/images/honeymoon/gallery-4.jpg', alt: 'Exploring tea plantations' },
  ],
  shortDescription: 'Experience the ultimate romantic getaway with our exclusive honeymoon package in Sri Lanka. From pristine beaches to lush tea plantations, create memories that will last a lifetime.',
  fullDescription: 'Embark on a journey of love and discovery with our specially curated honeymoon package. This tour is designed to provide an intimate and unforgettable experience, blending relaxation, adventure, and luxury. Explore ancient cities, witness breathtaking sunsets, and indulge in world-class cuisine. Our team is dedicated to making your honeymoon as seamless and magical as possible.',
  duration: '10 Days / 9 Nights',
  groupSize: '2 (Couple)',
  locations: [
    { name: 'Negombo', coordinates: { lat: 7.211, lng: 79.838 } },
    { name: 'Sigiriya', coordinates: { lat: 7.957, lng: 80.760 } },
    { name: 'Kandy', coordinates: { lat: 7.290, lng: 80.633 } },
    { name: 'Ella', coordinates: { lat: 6.866, lng: 81.046 } },
    { name: 'Mirissa', coordinates: { lat: 5.948, lng: 80.457 } },
  ],
  price: { amount: 2499, per: 'couple' },
  inclusions: [
    { title: 'Luxury Accommodation', description: '9 nights in 5-star hotels and boutique villas.' },
    { title: 'Private Chauffeur', description: 'A dedicated air-conditioned vehicle with an English-speaking guide.' },
    { title: 'Romantic Dinners', description: 'Including a private beach dinner and a candlelit meal in the highlands.' },
    { title: 'Couples Spa Treatment', description: 'A rejuvenating 90-minute spa session.' },
    { title: 'All Breakfasts & Dinners', description: 'Daily breakfast and dinner at your hotels.' },
    { title: 'Entrance Fees', description: 'All specified site entrance fees are included.' },
  ],
  exclusions: [
    'International airfare',
    'Lunches',
    'Personal expenses',
    'Tips and gratuities',
  ],
  itinerary: [
    { day: 1, title: 'Arrival and Relaxation', description: 'Arrive in Sri Lanka and transfer to a luxury beachfront hotel in Negombo.', activities: [], meals: ['Dinner'] },
    { day: 2, title: 'Journey to Sigiriya', description: 'Travel to the cultural triangle and check into your private villa.', activities: [], meals: ['Breakfast', 'Dinner'] },
    // ... more itinerary days
  ],
  highlights: ['Private Candlelit Dinners', 'Couples Spa Treatment', 'Luxury Boutique Hotels', 'Scenic Train Journey'],
  testimonials: [],
  availability: { minimumNotice: 48 },
  cancellationPolicy: 'Free cancellation up to 30 days before the tour.',
  difficulty: 'easy',
};

const HoneymoonTour = () => {
  const [experience, setExperience] = useState<LuxuryExperience | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<string>('');
  const [showAllInclusions, setShowAllInclusions] = useState(false);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [isFavorite, setIsFavorite] = useState(false);
  const navigate = useNavigate();
  const { slug } = useParams();

  useEffect(() => {
    const loadExperience = async () => {
      try {
        setLoading(true);
        let data = await luxuryExperienceService.getExperienceBySlug('honeymoon-in-paradise');
        if (!data) {
          data = await luxuryExperienceService.getExperienceBySlugForAdmin('honeymoon-in-paradise');
        }

        if (data) {
          setExperience(data);
          setSelectedImage(data.heroImage);
        } else {
          toast.error('Honeymoon tour not found');
          navigate('/tours');
        }
      } catch (error) {
        console.error('Error loading experience:', error);
        toast.error('Failed to load honeymoon tour');
      } finally {
        setLoading(false);
      }
    };

    loadExperience();
  }, []);


  const handleShare = async () => {
    try {
      await navigator.share({
        title: experience?.title,
        text: experience?.shortDescription,
        url: window.location.href
      });
    } catch (error) {
      // Fallback: copy to clipboard
      await navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard');
    }
  };

  const handleFavorite = () => {
    setIsFavorite(!isFavorite);
    toast.success(isFavorite ? 'Removed from favorites' : 'Added to favorites');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-500"></div>
      </div>
    );
  }

  if (!experience) {
    return null;
  }

  const visibleInclusions = showAllInclusions ? experience.inclusions : experience.inclusions.slice(0, 6);

  return (
    <div className="min-h-screen bg-pink-50">
      {/* Hero Section with Gallery */}
      <section className="relative">
        <div className="grid grid-cols-1 lg:grid-cols-2 h-[60vh] lg:h-[70vh]">
          {/* Main Image */}
          <div className="relative h-full">
            <img 
              src={selectedImage}
              alt={experience.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
            
            {/* Actions */}
            <div className="absolute top-4 right-4 flex gap-2">
              <Button
                variant="secondary"
                size="icon"
                className="bg-white/90 backdrop-blur-sm"
                onClick={handleShare}
              >
                <Share2 className="w-4 h-4" />
              </Button>
              <Button
                variant="secondary"
                size="icon"
                className={`backdrop-blur-sm ${isFavorite ? 'bg-red-500 text-white' : 'bg-white/90'}`}
                onClick={handleFavorite}
              >
                <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
              </Button>
            </div>
          </div>

          {/* Gallery Grid */}
          <div className="grid grid-cols-2 h-full">
            {experience.gallery.slice(0, 4).map((image, index) => (
              <div 
                key={index}
                className="relative cursor-pointer overflow-hidden group"
                onClick={() => setSelectedImage(image.url)}
              >
                <img 
                  src={image.url}
                  alt={image.alt}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors" />
                {index === 3 && experience.gallery.length > 4 && (
                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center text-white">
                    <span className="text-2xl font-semibold">+{experience.gallery.length - 4} photos</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="relative -mt-20 z-10">
        <div className="container mx-auto px-4">
          <div className="bg-white rounded-t-3xl shadow-xl">
            {/* Header */}
            <div className="p-8 lg:p-12 border-b">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                  <h1 className="text-4xl lg:text-5xl font-bold mb-4 text-pink-800">{experience.title}</h1>
                  <p className="text-xl text-gray-600 mb-6">{experience.subtitle}</p>
                  
                  {/* Quick Info */}
                  <div className="flex flex-wrap gap-6 text-gray-600">
                    <div className="flex items-center gap-2">
                      <Clock className="w-5 h-5 text-pink-500" />
                      <span>{experience.duration}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="w-5 h-5 text-pink-500" />
                      <span>{experience.groupSize}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-5 h-5 text-pink-500" />
                      <span>{experience.locations[0]?.name}</span>
                    </div>
                    {experience.difficulty && (
                      <Badge variant="secondary" className="capitalize bg-pink-100 text-pink-800">
                        {experience.difficulty}
                      </Badge>
                    )}
                  </div>

                  {/* Highlights */}
                  <div className="mt-6 flex flex-wrap gap-2">
                    {experience.highlights.slice(0, 3).map((highlight, index) => (
                      <Badge key={index} variant="outline" className="text-sm border-pink-300 text-pink-800">
                        {highlight}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Price Card */}
                <div className="lg:col-span-1">
                  <Card className="sticky top-24 border-pink-200">
                    <CardContent className="p-6">
                      <div className="text-center mb-6">
                        <p className="text-gray-600 mb-1">Starting from</p>
                        <p className="text-4xl font-bold text-pink-600">
                          ${experience.price.amount}
                        </p>
                        <p className="text-gray-500">per {experience.price.per}</p>
                      </div>
                      
                      <Button 
                        size="lg" 
                        className="w-full bg-pink-500 hover:bg-pink-600 text-white mb-3"
                        onClick={() => setShowBookingModal(true)}
                      >
                        Book Your Dream Honeymoon
                      </Button>
                      
                      <div className="space-y-2 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          <Check className="w-4 h-4 text-green-500" />
                          <span>Free cancellation</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Check className="w-4 h-4 text-green-500" />
                          <span>Instant confirmation</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Check className="w-4 h-4 text-green-500" />
                          <span>Best price guarantee</span>
                        </div>
                      </div>

                      <div className="mt-6 pt-6 border-t space-y-3">
                        <Button variant="outline" size="sm" className="w-full">
                          <Phone className="w-4 h-4 mr-2" />
                          Call for Inquiry
                        </Button>
                        <Button variant="outline" size="sm" className="w-full">
                          <MessageSquare className="w-4 h-4 mr-2" />
                          Chat with Expert
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>

            {/* Tabs Content */}
            <div className="p-8 lg:p-12">
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                    <TabsList className="grid grid-cols-4 w-full max-w-2xl mb-8">
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="itinerary">Itinerary</TabsTrigger>
                    <TabsTrigger value="inclusions">What's Included</TabsTrigger>
                    <TabsTrigger value="reviews">Reviews</TabsTrigger>
                    </TabsList>

                <TabsContent value="overview" className="space-y-8">
                  {/* Description */}
                  <div>
                    <h2 className="text-2xl font-semibold mb-4">Experience Overview</h2>
                    <div className="prose prose-lg max-w-none text-gray-600">
                      <p>{experience.fullDescription}</p>
                    </div>
                  </div>

                  {/* Locations Map */}
                  {experience.locations.length > 0 && (
                    <div>
                      <h2 className="text-2xl font-semibold mb-4">Locations</h2>
                      <div className="bg-gray-100 rounded-xl h-96 flex items-center justify-center">
                        {/* Add actual map integration here */}
                        <div className="text-center">
                          <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                          <p className="text-gray-500">Interactive map coming soon</p>
                        </div>
                      </div>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="itinerary" className="space-y-6">
                  <h2 className="text-2xl font-semibold mb-4">Day by Day Itinerary</h2>
                  {experience.itinerary?.map((day, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="border-l-4 border-pink-500 pl-6"
                    >
                      <h3 className="text-xl font-semibold mb-2">
                        Day {day.day}: {day.title}
                      </h3>
                      <p className="text-gray-600 mb-4">{day.description}</p>
                      
                      {day.activities && day.activities.length > 0 && (
                        <div className="space-y-3">
                          {day.activities.map((activity, actIndex) => (
                            <div key={actIndex} className="flex gap-4">
                              <span className="text-pink-600 font-medium whitespace-nowrap">
                                {activity.time}
                              </span>
                              <div>
                                <p className="font-medium">{activity.title}</p>
                                <p className="text-sm text-gray-600">{activity.description}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      {day.meals && day.meals.length > 0 && (
                        <div className="mt-4 flex items-center gap-2 text-sm text-gray-600">
                          <span className="font-medium">Meals:</span>
                          {day.meals.join(', ')}
                        </div>
                      )}
                    </motion.div>
                  ))}
                </TabsContent>

                <TabsContent value="inclusions" className="space-y-8">
                  <div>
                    <h2 className="text-2xl font-semibold mb-6">What's Included</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {visibleInclusions.map((inclusion, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className="flex gap-4 p-4 bg-green-50 rounded-lg"
                        >
                          <Check className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                          <div>
                            <p className="font-medium text-green-900">{inclusion.title}</p>
                            <p className="text-sm text-green-700 mt-1">{inclusion.description}</p>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                    
                    {experience.inclusions.length > 6 && (
                      <Button
                        variant="outline"
                        onClick={() => setShowAllInclusions(!showAllInclusions)}
                        className="mt-4"
                      >
                        {showAllInclusions ? (
                          <>Show Less <ChevronUp className="ml-2 w-4 h-4" /></>
                        ) : (
                          <>Show All ({experience.inclusions.length} items) <ChevronDown className="ml-2 w-4 h-4" /></>
                        )}
                      </Button>
                    )}
                  </div>

                  {experience.exclusions.length > 0 && (
                    <div>
                      <h2 className="text-2xl font-semibold mb-6">What's Not Included</h2>
                      <div className="space-y-3">
                        {experience.exclusions.map((exclusion, index) => (
                          <div key={index} className="flex gap-3 text-gray-600">
                            <X className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                            <span>{exclusion}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="reviews" className="space-y-8">
                  <div>
                    <h2 className="text-2xl font-semibold mb-6">Guest Reviews</h2>
                    
                    {experience.testimonials?.length > 0 ? (
                        <>
                        {/* Review Summary */}
                        <div className="bg-pink-50 rounded-xl p-6 mb-8">
                        <div className="flex items-center gap-4">
                            <div className="text-5xl font-bold text-pink-600">4.9</div>
                            <div>
                            <div className="flex gap-1 mb-1">
                                {[...Array(5)].map((_, i) => (
                                <Star key={i} className="w-5 h-5 fill-pink-400 text-pink-400" />
                                ))}
                            </div>
                            <p className="text-gray-600">Based on {experience.testimonials?.length || 0} reviews</p>
                            </div>
                        </div>
                        </div>

                        {/* Individual Reviews */}
                        <div className="space-y-6">
                        {experience.testimonials?.map((review, index) => (
                            <motion.div
                            key={review.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="border-b pb-6 last:border-0"
                            >
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                                <span className="text-lg font-semibold text-gray-600">
                                    {review.author[0]}
                                </span>
                                </div>
                                <div className="flex-1">
                                <div className="flex items-center gap-4 mb-2">
                                    <h4 className="font-semibold">{review.author}</h4>
                                    <span className="text-sm text-gray-500">{review.country}</span>
                                    <div className="flex gap-0.5">
                                    {[...Array(review.rating)].map((_, i) => (
                                        <Star key={i} className="w-4 h-4 fill-pink-400 text-pink-400" />
                                    ))}
                                    </div>
                                </div>
                                <p className="text-gray-600">{review.comment}</p>
                                <p className="text-sm text-gray-500 mt-2">
                                    Experienced in {review.experienceDate}
                                </p>
                                </div>
                            </div>
                            </motion.div>
                        ))}
                        </div>
                        </>
                    ) : (
                        <p>No reviews yet.</p>
                    )}
                  </div>
                </TabsContent>
                </Tabs>
            </div>
          </div>
        </div>
      </section>

      {/* Booking Modal */}
      <EnhancedBookingModal
        isOpen={showBookingModal}
        onClose={() => setShowBookingModal(false)}
        type="tour"
        itemTitle={experience.title}
        tourData={{
          id: experience.id ?? 'honeymoon-experience',
          name: experience.title,
          price: experience.price.amount,
          duration: experience.duration,
          description: experience.shortDescription ?? '',
          features: experience.highlights ?? []
        }}
      />
    </div>
  );
};

export default HoneymoonTour;
