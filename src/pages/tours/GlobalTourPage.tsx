// Global Tour Page Template
// Reusable tour detail page component

import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  Star,
  Check,
  X,
  ChevronLeft,
  ChevronRight,
  Share2,
  Heart,
  Download,
  MessageCircle,
  Phone,
  Mail,
  Shield,
  Award,
  Globe,
  Sun,
  Moon,
  Utensils,
  Camera,
  Plane
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getTourBySlug, getRelatedTours } from '@/services/globalTourService';
import { GlobalTour } from '@/types/global-tour';
import GlobalTourBookingForm from '@/components/tours/GlobalTourBookingForm';
import Header from '@/components/Header';
import RechargeFooter from '@/components/ui/RechargeFooter';

const GlobalTourPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [tour, setTour] = useState<GlobalTour | null>(null);
  const [relatedTours, setRelatedTours] = useState<GlobalTour[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showFullDescription, setShowFullDescription] = useState(false);

  useEffect(() => {
    const fetchTour = async () => {
      if (!slug) return;
      setIsLoading(true);
      try {
        const tourData = await getTourBySlug(slug);
        if (tourData) {
          setTour(tourData);
          // Fetch related tours
          const related = await getRelatedTours(tourData.id, tourData.category);
          setRelatedTours(related);
        }
      } catch (error) {
        console.error('Error fetching tour:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTour();
  }, [slug]);

  const handleNextImage = () => {
    if (!tour?.imageGallery?.length) return;
    setCurrentImageIndex((prev) => (prev + 1) % tour.imageGallery.length);
  };

  const handlePrevImage = () => {
    if (!tour?.imageGallery?.length) return;
    setCurrentImageIndex((prev) => (prev - 1 + tour.imageGallery.length) % tour.imageGallery.length);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: tour?.title,
          text: tour?.shortDescription,
          url: window.location.href
        });
      } catch (error) {
        console.log('Share cancelled');
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  if (!tour) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Tour Not Found</h1>
          <p className="text-gray-600 mb-8">The tour you're looking for doesn't exist or has been removed.</p>
          <Button onClick={() => navigate('/tours')} className="bg-emerald-600 hover:bg-emerald-700">
            Browse All Tours
          </Button>
        </div>
        <RechargeFooter />
      </div>
    );
  }

  const allImages = [tour.heroImage, ...(tour.imageGallery || [])].filter(Boolean);

  return (
    <div className="min-h-screen bg-gray-50">
      <Helmet>
        <title>{tour.seoTitle || `${tour.title} | Recharge Travels`}</title>
        <meta name="description" content={tour.seoDescription || tour.shortDescription} />
        <meta name="keywords" content={tour.seoKeywords?.join(', ')} />
        <meta property="og:title" content={tour.title} />
        <meta property="og:description" content={tour.shortDescription} />
        <meta property="og:image" content={tour.heroImage} />
      </Helmet>

      <Header />

      {/* Hero Section with Image Gallery */}
      <div className="relative h-[60vh] md:h-[70vh] overflow-hidden">
        <div className="absolute inset-0">
          {allImages.length > 0 && (
            <img
              src={allImages[currentImageIndex]}
              alt={tour.title}
              className="w-full h-full object-cover transition-all duration-500"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
        </div>

        {/* Image Navigation */}
        {allImages.length > 1 && (
          <>
            <button
              onClick={handlePrevImage}
              className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/40 transition-colors"
            >
              <ChevronLeft className="w-6 h-6 text-white" />
            </button>
            <button
              onClick={handleNextImage}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/40 transition-colors"
            >
              <ChevronRight className="w-6 h-6 text-white" />
            </button>
            <div className="absolute bottom-24 left-1/2 -translate-x-1/2 flex gap-2">
              {allImages.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentImageIndex(idx)}
                  className={`w-2 h-2 rounded-full transition-all ${idx === currentImageIndex ? 'w-8 bg-white' : 'bg-white/50'
                    }`}
                />
              ))}
            </div>
          </>
        )}

        {/* Hero Content */}
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12">
          <div className="container mx-auto">
            <div className="flex flex-wrap gap-2 mb-4">
              <Badge className="bg-emerald-600 text-white">{tour.region}</Badge>
              <Badge className="bg-white/20 text-white backdrop-blur-sm">{tour.category}</Badge>
              {tour.isFeatured && (
                <Badge className="bg-yellow-500 text-black">
                  <Star className="w-3 h-3 mr-1 fill-current" /> Featured
                </Badge>
              )}
            </div>
            <h1 className="text-3xl md:text-5xl font-bold text-white mb-2">{tour.title}</h1>
            <p className="text-lg md:text-xl text-white/90 mb-4">{tour.subtitle}</p>
            <div className="flex flex-wrap items-center gap-4 text-white/80">
              <span className="flex items-center gap-1">
                <MapPin className="w-4 h-4" /> {tour.location}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4" /> {tour.duration.days}D/{tour.duration.nights}N
              </span>
              <span className="flex items-center gap-1">
                <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" /> {tour.rating} ({tour.reviewCount} reviews)
              </span>
            </div>
          </div>
        </div>

        {/* Share & Favorite Buttons */}
        <div className="absolute top-24 right-4 flex gap-2">
          <button
            onClick={handleShare}
            className="p-3 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/40 transition-colors"
          >
            <Share2 className="w-5 h-5 text-white" />
          </button>
          <button className="p-3 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/40 transition-colors">
            <Heart className="w-5 h-5 text-white" />
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Tour Details */}
          <div className="lg:col-span-2 space-y-8">
            {/* Quick Info Bar */}
            <Card className="shadow-lg border-0 overflow-hidden">
              <CardContent className="p-0">
                <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-gray-100">
                  <div className="p-6 text-center">
                    <Calendar className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">Duration</p>
                    <p className="font-bold text-lg">{tour.duration.days} Days</p>
                  </div>
                  <div className="p-6 text-center">
                    <Users className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">Group Size</p>
                    <p className="font-bold text-lg">{tour.minGroupSize}-{tour.maxGroupSize}</p>
                  </div>
                  <div className="p-6 text-center">
                    <Globe className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">Region</p>
                    <p className="font-bold text-lg capitalize">{tour.region.replace('-', ' ')}</p>
                  </div>
                  <div className="p-6 text-center">
                    <Award className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">Rating</p>
                    <p className="font-bold text-lg">{tour.rating}/5</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Description */}
            <Card className="shadow-lg border-0">
              <CardContent className="p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">About This Tour</h2>
                <div className={`text-gray-600 leading-relaxed ${!showFullDescription && 'line-clamp-4'}`}>
                  {tour.description}
                </div>
                {tour.description.length > 300 && (
                  <button
                    onClick={() => setShowFullDescription(!showFullDescription)}
                    className="text-emerald-600 font-medium mt-2 hover:underline"
                  >
                    {showFullDescription ? 'Show Less' : 'Read More'}
                  </button>
                )}
              </CardContent>
            </Card>

            {/* Highlights */}
            {tour.highlights && tour.highlights.length > 0 && (
              <Card className="shadow-lg border-0">
                <CardContent className="p-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Tour Highlights</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {tour.highlights.map((highlight, idx) => (
                      <div key={idx} className="flex items-start gap-3 p-4 bg-emerald-50 rounded-xl">
                        <div className="p-2 bg-emerald-600 rounded-lg">
                          <Camera className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">{highlight.title}</h3>
                          <p className="text-sm text-gray-600">{highlight.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Itinerary */}
            <Card className="shadow-lg border-0">
              <CardContent className="p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Day-by-Day Itinerary</h2>
                <Tabs defaultValue="day-1" className="w-full">
                  <TabsList className="flex flex-wrap gap-2 mb-6 bg-transparent">
                    {tour.itinerary?.map((day) => (
                      <TabsTrigger
                        key={day.day}
                        value={`day-${day.day}`}
                        className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white px-4 py-2 rounded-full"
                      >
                        Day {day.day}
                      </TabsTrigger>
                    ))}
                  </TabsList>
                  {tour.itinerary?.map((day) => (
                    <TabsContent key={day.day} value={`day-${day.day}`}>
                      <div className="space-y-4">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-emerald-600 rounded-full flex items-center justify-center text-white font-bold">
                            {day.day}
                          </div>
                          <div>
                            <h3 className="text-xl font-bold text-gray-900">{day.title}</h3>
                            <p className="text-emerald-600 flex items-center gap-1">
                              <MapPin className="w-4 h-4" /> {day.location}
                            </p>
                          </div>
                        </div>
                        <p className="text-gray-600">{day.description}</p>
                        {day.activities && day.activities.length > 0 && (
                          <div className="flex flex-wrap gap-2">
                            {day.activities.map((activity, idx) => (
                              <Badge key={idx} variant="outline" className="border-emerald-200 text-emerald-700">
                                {activity}
                              </Badge>
                            ))}
                          </div>
                        )}
                        <div className="flex flex-wrap gap-6 pt-4 border-t">
                          <div className="flex items-center gap-2">
                            <Utensils className="w-5 h-5 text-gray-400" />
                            <span className="text-sm text-gray-600">
                              {day.meals.breakfast && 'B'}
                              {day.meals.lunch && 'L'}
                              {day.meals.dinner && 'D'}
                            </span>
                          </div>
                          {day.accommodation && (
                            <div className="flex items-center gap-2">
                              <Moon className="w-5 h-5 text-gray-400" />
                              <span className="text-sm text-gray-600">{day.accommodation}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </TabsContent>
                  ))}
                </Tabs>
              </CardContent>
            </Card>

            {/* Inclusions & Exclusions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="shadow-lg border-0 border-l-4 border-l-green-500">
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <Check className="w-5 h-5 text-green-600" /> What's Included
                  </h3>
                  <ul className="space-y-2">
                    {tour.inclusions?.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-gray-600">
                        <Check className="w-4 h-4 text-green-500 mt-1 flex-shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
              <Card className="shadow-lg border-0 border-l-4 border-l-red-500">
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <X className="w-5 h-5 text-red-600" /> What's Not Included
                  </h3>
                  <ul className="space-y-2">
                    {tour.exclusions?.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-gray-600">
                        <X className="w-4 h-4 text-red-500 mt-1 flex-shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Right Column - Booking Form */}
          <div className="lg:col-span-1">
            <GlobalTourBookingForm tour={tour} variant="sidebar" />
          </div>
        </div>

        {/* Related Tours */}
        {relatedTours.length > 0 && (
          <div className="mt-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">You May Also Like</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedTours.map((relTour) => (
                <Link
                  key={relTour.id}
                  to={`/tours/${relTour.slug}`}
                  className="group"
                >
                  <Card className="overflow-hidden hover:shadow-xl transition-shadow border-0">
                    <div className="relative h-48">
                      <img
                        src={relTour.heroImage}
                        alt={relTour.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                        <p className="text-white font-bold">{relTour.title}</p>
                        <p className="text-emerald-400 font-bold">${relTour.pricePerPersonUSD || relTour.priceUSD}/person</p>
                      </div>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      <RechargeFooter />
    </div>
  );
};

export default GlobalTourPage;
