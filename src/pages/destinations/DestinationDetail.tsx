import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import {
  MapPin, Clock, DollarSign, Star, Calendar, Phone, Share2, Heart,
  Play, Camera, Navigation, Globe, Sun, Cloud, Users, Award,
  Mountain, Sunset, TreePine, Car, UtensilsCrossed, Bed, Compass,
  Info, BookOpen, Video, Map, Activity, Ticket
} from 'lucide-react';
import { GoogleMap, LoadScript, Marker, InfoWindow } from '@react-google-maps/api';
import BookingModal from '../../components/BookingModal';
import { DestinationData, getDestinationBySlug } from '../../data/destinationDetails';
import {
  COMPANY,
  createTouristAttractionSchema,
  createBreadcrumbSchema,
  createOrganizationSchema,
  createImageGallerySchema,
  createVideoSchema,
  createSpeakableSchema,
  createHowToSchema
} from '@/utils/schemaMarkup';


const DestinationDetail: React.FC = () => {
  const { destinationId } = useParams<{ destinationId: string }>();
  const navigate = useNavigate();
  
  const [destination, setDestination] = useState<DestinationData | null>(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState<any>(null);
  const [showMap, setShowMap] = useState(false);
  const [favorites, setFavorites] = useState<string[]>([]);


  useEffect(() => {
    // Load destination data based on ID
    if (destinationId) {
      const data = getDestinationBySlug(destinationId);
      if (data) {
        setDestination(data);
      } else {
        // Redirect if destination not found
        navigate('/about/sri-lanka');
      }
    }
  }, [destinationId, navigate]);

  if (!destination) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  const canonicalUrl = `https://www.rechargetravels.com/destinations/${destination.slug || destinationId || ''}`;

  const HeroSection = () => (
    <div className="relative h-screen">
      {/* Hero Background */}
      <div className="absolute inset-0">
        <img
          src={destination.heroImage}
          alt={destination.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/60"></div>
      </div>

      {/* Hero Content */}
      <div className="relative z-10 h-full flex items-center">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl">
            <div className="mb-6">
              <span className="inline-block bg-red-600 text-white px-4 py-2 rounded-full text-sm font-medium">
                UNESCO World Heritage Site
              </span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-4 leading-tight">
              {destination.name}
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-200 mb-8 font-light">
              {destination.subtitle}
            </p>
            
            <div className="flex flex-wrap items-center gap-6 mb-8 text-white">
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                <span>{destination.location.province}</span>
              </div>
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5 text-yellow-400" />
                <span>{destination.rating} ({destination.reviews.toLocaleString()} reviews)</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                <span>{destination.hours.open} - {destination.hours.close}</span>
              </div>
              <div className="flex items-center gap-2">
                <DollarSign className="w-5 h-5" />
                <span>From LKR {destination.pricing.foreignAdult.toLocaleString()}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-4">
              <button
                onClick={() => setIsBookingOpen(true)}
                className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white px-8 py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center gap-3"
              >
                <Calendar className="w-6 h-6" />
                Book Your Visit
              </button>
              
              <button
                onClick={() => window.open('tel:+94777721999', '_self')}
                className="bg-white/20 backdrop-blur-sm border border-white/30 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-white/30 transition-all duration-300 flex items-center gap-3"
              >
                <Phone className="w-6 h-6" />
                Call Guide
              </button>
              
              {destination.heroVideo && (
                <button
                  onClick={() => setSelectedVideo(destination.heroVideo)}
                  className="bg-black/20 backdrop-blur-sm border border-white/30 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-black/30 transition-all duration-300 flex items-center gap-3"
                >
                  <Play className="w-6 h-6" />
                  Watch Video
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
        <div className="animate-bounce">
          <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white rounded-full mt-2"></div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <Helmet>
        <title>{destination.name} - {destination.subtitle} | Recharge Travels</title>
        <meta name="description" content={destination.description} />
        <meta name="keywords" content={`${destination.name}, Sri Lanka, tourism, UNESCO, heritage, travel, ${destination.location.province}, things to do`} />

        {/* Open Graph */}
        <meta property="og:title" content={`${destination.name} - ${destination.subtitle}`} />
        <meta property="og:description" content={destination.description} />
        <meta property="og:image" content={destination.heroImage} />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:type" content="place" />
        <meta property="og:locale" content="en_US" />
        <meta property="og:site_name" content="Recharge Travels" />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`${destination.name} - ${destination.subtitle}`} />
        <meta name="twitter:description" content={destination.description} />
        <meta name="twitter:image" content={destination.heroImage} />

        <link rel="canonical" href={canonicalUrl} />

        {/* TouristAttraction Schema */}
        <script type="application/ld+json">
          {JSON.stringify(createTouristAttractionSchema({
            name: destination.name,
            description: destination.description,
            image: [destination.heroImage, ...(destination.gallery || [])],
            latitude: destination.location.lat,
            longitude: destination.location.lng,
            address: `${destination.location.address}, ${destination.location.province}, Sri Lanka`,
            openingHours: `${destination.hours.days} ${destination.hours.open}-${destination.hours.close}`,
            priceRange: `LKR ${destination.pricing.foreignAdult}`,
            rating: { value: Number(destination.rating), count: Number(destination.reviews) },
            url: canonicalUrl
          }))}
        </script>

        {/* Breadcrumb Schema */}
        <script type="application/ld+json">
          {JSON.stringify(createBreadcrumbSchema([
            { name: 'Home', url: COMPANY.url },
            { name: 'Destinations', url: `${COMPANY.url}/about/sri-lanka` },
            { name: destination.name, url: canonicalUrl }
          ]))}
        </script>

        {/* Organization Schema */}
        <script type="application/ld+json">
          {JSON.stringify(createOrganizationSchema())}
        </script>

        {/* Image Gallery Schema */}
        {destination.gallery && destination.gallery.length > 0 && (
          <script type="application/ld+json">
            {JSON.stringify(createImageGallerySchema(
              destination.gallery.map((img: string, idx: number) => ({
                url: img,
                caption: `${destination.name} - Image ${idx + 1}`,
                description: `Beautiful view of ${destination.name} in Sri Lanka`
              }))
            ))}
          </script>
        )}

        {/* Video Schema */}
        {destination.heroVideo && (
          <script type="application/ld+json">
            {JSON.stringify(createVideoSchema({
              name: `${destination.name} - Virtual Tour`,
              description: `Explore ${destination.name}, ${destination.subtitle}. A visual journey through one of Sri Lanka's most iconic destinations.`,
              thumbnailUrl: destination.heroImage,
              uploadDate: '2024-01-15',
              contentUrl: destination.heroVideo,
              embedUrl: destination.heroVideo.replace('watch?v=', 'embed/')
            }))}
          </script>
        )}

        {/* Speakable Schema for Voice Search */}
        <script type="application/ld+json">
          {JSON.stringify(createSpeakableSchema(
            canonicalUrl,
            ['h1', '.hero-description', '.overview-content']
          ))}
        </script>

        {/* Place Schema for Google Maps integration */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Place",
            "@id": `${canonicalUrl}#place`,
            "name": destination.name,
            "description": destination.longDescription || destination.description,
            "image": destination.heroImage,
            "url": canonicalUrl,
            "telephone": COMPANY.phone,
            "address": {
              "@type": "PostalAddress",
              "addressLocality": destination.location.address,
              "addressRegion": destination.location.province,
              "addressCountry": "LK"
            },
            "geo": {
              "@type": "GeoCoordinates",
              "latitude": destination.location.lat,
              "longitude": destination.location.lng
            },
            "openingHoursSpecification": {
              "@type": "OpeningHoursSpecification",
              "dayOfWeek": destination.hours.days?.split('-').map((d: string) => d.trim()) || ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
              "opens": destination.hours.open,
              "closes": destination.hours.close
            },
            "publicAccess": true,
            "isAccessibleForFree": false,
            "aggregateRating": {
              "@type": "AggregateRating",
              "ratingValue": Number(destination.rating),
              "reviewCount": Number(destination.reviews),
              "bestRating": 5,
              "worstRating": 1
            },
            "containedInPlace": {
              "@type": "Country",
              "name": "Sri Lanka"
            },
            "touristType": ["Cultural Tourism", "Heritage Tourism", "Adventure Tourism"]
          })}
        </script>

        {/* HowTo Schema - Visit Guide */}
        <script type="application/ld+json">
          {JSON.stringify(createHowToSchema(
            `How to Visit ${destination.name}`,
            `Complete guide to planning your visit to ${destination.name}, ${destination.subtitle} in Sri Lanka`,
            [
              { name: 'Plan Your Visit Date', text: `Check the best time to visit ${destination.name}. Opening hours: ${destination.hours.open} - ${destination.hours.close}, ${destination.hours.days}.`, image: destination.heroImage },
              { name: 'Book Transportation', text: `Arrange transport to ${destination.location.address}. Contact Recharge Travels at ${COMPANY.phone} for private transfers or guided tours.` },
              { name: 'Purchase Entry Tickets', text: `Entry fees: Foreign Adults LKR ${destination.pricing.foreignAdult}, Foreign Children LKR ${destination.pricing.foreignChild || 'Half price'}.` },
              { name: 'Explore the Site', text: `Spend ${destination.visitDuration || '2-3 hours'} exploring the highlights: ${destination.highlights?.slice(0, 3).join(', ') || destination.name}.` },
              { name: 'Capture Memories', text: 'Photography is usually permitted. Hire a local guide for deeper insights into the history and significance.' }
            ],
            { totalTime: destination.visitDuration || 'PT3H', estimatedCost: `LKR ${destination.pricing.foreignAdult}`, currency: 'LKR' }
          ))}
        </script>
      </Helmet>

      <div className="min-h-screen bg-gray-50">
        <HeroSection />
        
        {/* Navigation Tabs */}
        <div className="sticky top-0 z-40 bg-white shadow-md">
          <div className="container mx-auto px-4">
            <div className="flex overflow-x-auto">
              {[
                { id: 'overview', label: 'Overview', icon: Info },
                { id: 'activities', label: 'Activities', icon: Activity },
                { id: 'videos', label: 'Videos', icon: Video },
                { id: 'location', label: 'Location', icon: Map },
                { id: 'accommodation', label: 'Stay', icon: Bed },
                { id: 'dining', label: 'Dining', icon: UtensilsCrossed },
                { id: 'plan', label: 'Plan Visit', icon: Compass }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-6 py-4 whitespace-nowrap font-medium border-b-2 transition-colors ${
                    activeTab === tab.id
                      ? 'border-red-600 text-red-600'
                      : 'border-transparent text-gray-600 hover:text-red-600'
                  }`}
                >
                  <tab.icon className="w-5 h-5" />
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Content Sections */}
        <div className="container mx-auto px-4 py-12">
          {activeTab === 'overview' && (
            <div className="max-w-4xl mx-auto space-y-12">
              {/* Overview Content */}
              <div className="prose prose-lg max-w-none">
                <p className="text-xl text-gray-700 leading-relaxed">
                  {destination.longDescription}
                </p>
              </div>

              {/* Highlights */}
              <div>
                <h3 className="text-2xl font-bold mb-6">Highlights</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  {destination.highlights.map((highlight, index) => (
                    <div key={index} className="flex items-start gap-3 p-4 bg-white rounded-lg shadow-sm">
                      <Award className="w-6 h-6 text-red-600 mt-1 flex-shrink-0" />
                      <span className="text-gray-700">{highlight}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* History Section */}
              <div className="bg-white rounded-xl p-8 shadow-sm">
                <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
                  <BookOpen className="w-8 h-8 text-red-600" />
                  Historical Significance
                </h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-lg mb-2">Period</h4>
                    <p className="text-gray-700">{destination.history.period}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-lg mb-2">Significance</h4>
                    <p className="text-gray-700">{destination.history.significance}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-lg mb-2">Architecture</h4>
                    <p className="text-gray-700">{destination.history.architecture}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-lg mb-2">Discovery</h4>
                    <p className="text-gray-700">{destination.history.discovery}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'activities' && (
            <div className="space-y-8">
              <h2 className="text-3xl font-bold text-center mb-12">Activities & Experiences</h2>
              <div className="grid lg:grid-cols-3 gap-8">
                {destination.activities.map((activity) => (
                  <div key={activity.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                    <img
                      src={activity.image}
                      alt={activity.name}
                      className="w-full h-48 object-cover"
                    />
                    <div className="p-6">
                      <div className="flex justify-between items-start mb-3">
                        <h3 className="text-xl font-bold">{activity.name}</h3>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          activity.difficulty === 'Easy' ? 'bg-green-100 text-green-800' :
                          activity.difficulty === 'Moderate' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {activity.difficulty}
                        </span>
                      </div>
                      <p className="text-gray-600 mb-4">{activity.description}</p>
                      <div className="flex justify-between items-center mb-4">
                        <div className="flex items-center gap-2 text-gray-500">
                          <Clock className="w-4 h-4" />
                          <span className="text-sm">{activity.duration}</span>
                        </div>
                        <div className="font-bold text-red-600">{activity.price}</div>
                      </div>
                      <button
                        onClick={() => {
                          setSelectedActivity(activity);
                          setIsBookingOpen(true);
                        }}
                        className="w-full bg-gradient-to-r from-red-600 to-red-700 text-white py-3 rounded-lg font-semibold hover:from-red-700 hover:to-red-800 transition-colors"
                      >
                        Book This Activity
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'videos' && (
            <div className="space-y-8">
              <h2 className="text-3xl font-bold text-center mb-12">Videos & Virtual Tours</h2>
              
              {/* Featured Video */}
              <div className="max-w-4xl mx-auto">
                <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                  <div className="aspect-video relative">
                    {selectedVideo ? (
                      <iframe
                        src={`https://www.youtube.com/embed/${selectedVideo}?autoplay=1`}
                        className="w-full h-full"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    ) : (
                      <div className="relative w-full h-full bg-gray-900 flex items-center justify-center cursor-pointer"
                           onClick={() => setSelectedVideo(destination.youtubeVideos[0]?.id)}>
                        <img
                          src={destination.youtubeVideos[0]?.thumbnail}
                          alt="Video thumbnail"
                          className="w-full h-full object-cover opacity-80"
                        />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-20 h-20 bg-red-600 rounded-full flex items-center justify-center hover:bg-red-700 transition-colors">
                            <Play className="w-8 h-8 text-white ml-1" />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Video Gallery */}
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {destination.youtubeVideos.map((video) => (
                  <div key={video.id} className="bg-white rounded-lg shadow-lg overflow-hidden cursor-pointer hover:shadow-xl transition-shadow"
                       onClick={() => setSelectedVideo(video.id)}>
                    <div className="aspect-video relative">
                      <img
                        src={video.thumbnail}
                        alt={video.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity bg-black/30">
                        <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center">
                          <Play className="w-6 h-6 text-white ml-0.5" />
                        </div>
                      </div>
                      <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                        {video.duration}
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-sm mb-2 line-clamp-2">{video.title}</h3>
                      <p className="text-xs text-gray-500">{video.views} views</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'location' && (
            <div className="space-y-8">
              <h2 className="text-3xl font-bold text-center mb-12">Location & Getting There</h2>
              
              {/* Map */}
              <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="h-96">
                  <LoadScript googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY || 'your-api-key'}>
                    <GoogleMap
                      mapContainerStyle={{ width: '100%', height: '100%' }}
                      center={{ lat: destination.location.lat, lng: destination.location.lng }}
                      zoom={15}
                    >
                      <Marker
                        position={{ lat: destination.location.lat, lng: destination.location.lng }}
                        title={destination.name}
                      />
                    </GoogleMap>
                  </LoadScript>
                </div>
              </div>

              {/* Transportation Info */}
              <div className="grid lg:grid-cols-2 gap-8">
                <div className="bg-white rounded-xl p-8 shadow-lg">
                  <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
                    <Car className="w-8 h-8 text-red-600" />
                    How to Get There
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-gray-800">From Colombo</h4>
                      <p className="text-gray-600">{destination.transportation.fromColombo}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800">From Kandy</h4>
                      <p className="text-gray-600">{destination.transportation.fromKandy}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800">From Negombo</h4>
                      <p className="text-gray-600">{destination.transportation.fromNegombo}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl p-8 shadow-lg">
                  <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
                    <Navigation className="w-8 h-8 text-red-600" />
                    Local Transport
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    {destination.transportation.localTransport.map((transport, index) => (
                      <div key={index} className="bg-gray-50 rounded-lg p-4 text-center">
                        <span className="font-medium text-gray-800">{transport}</span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-6">
                    <button
                      onClick={() => window.open(`https://www.google.com/maps/dir/?api=1&destination=${destination.location.lat},${destination.location.lng}`, '_blank')}
                      className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                    >
                      <Navigation className="w-5 h-5" />
                      Get Directions
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'accommodation' && (
            <div className="space-y-8">
              <h2 className="text-3xl font-bold text-center mb-12">Where to Stay</h2>
              <div className="grid lg:grid-cols-2 gap-8">
                {destination.accommodation.map((hotel) => (
                  <div key={hotel.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                    <img
                      src={hotel.image}
                      alt={hotel.name}
                      className="w-full h-48 object-cover"
                    />
                    <div className="p-6">
                      <div className="flex justify-between items-start mb-3">
                        <h3 className="text-xl font-bold">{hotel.name}</h3>
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 text-yellow-400 fill-current" />
                          <span className="text-sm font-medium">{hotel.rating}</span>
                        </div>
                      </div>
                      <p className="text-gray-600 mb-2">{hotel.type}</p>
                      <div className="flex justify-between items-center mb-4">
                        <span className="text-gray-500 text-sm">{hotel.distance} from attraction</span>
                        <span className="font-bold text-green-600">{hotel.price}</span>
                      </div>
                      <button className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-blue-800 transition-colors">
                        Check Availability
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'plan' && (
            <div className="max-w-4xl mx-auto space-y-8">
              <h2 className="text-3xl font-bold text-center mb-12">Plan Your Visit</h2>
              
              {/* Best Time to Visit */}
              <div className="bg-white rounded-xl p-8 shadow-lg">
                <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
                  <Sun className="w-8 h-8 text-yellow-600" />
                  Best Time to Visit
                </h3>
                <div className="grid md:grid-cols-3 gap-6">
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">Months</h4>
                    <p className="text-gray-600">{destination.bestTimeToVisit.months}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">Weather</h4>
                    <p className="text-gray-600">{destination.bestTimeToVisit.weather}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">Crowds</h4>
                    <p className="text-gray-600">{destination.bestTimeToVisit.crowdLevel}</p>
                  </div>
                </div>
              </div>

              {/* Tips */}
              <div className="bg-white rounded-xl p-8 shadow-lg">
                <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
                  <Info className="w-8 h-8 text-blue-600" />
                  Visitor Tips
                </h3>
                <div className="space-y-4">
                  {destination.tips.map((tip, index) => (
                    <div key={index} className="flex items-start gap-3 p-4 bg-blue-50 rounded-lg">
                      <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-1">
                        {index + 1}
                      </div>
                      <span className="text-gray-700">{tip}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Pricing */}
              <div className="bg-white rounded-xl p-8 shadow-lg">
                <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
                  <Ticket className="w-8 h-8 text-green-600" />
                  Entry Fees
                </h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-4">Local Visitors</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Adult</span>
                        <span className="font-semibold">LKR {destination.pricing.localAdult.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Child</span>
                        <span className="font-semibold">LKR {destination.pricing.localChild.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-4">Foreign Visitors</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Adult</span>
                        <span className="font-semibold">LKR {destination.pricing.foreignAdult.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Child</span>
                        <span className="font-semibold">LKR {destination.pricing.foreignChild.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modals */}
        <BookingModal
          isOpen={isBookingOpen}
          onClose={() => setIsBookingOpen(false)}
          type="tour"
          itemTitle={selectedActivity ? `${selectedActivity.name} - ${destination.name}` : `Visit ${destination.name}`}
        />
        
        {/* Video Modal */}
        {selectedVideo && (
          <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4" onClick={() => setSelectedVideo(null)}>
            <div className="max-w-6xl w-full aspect-video" onClick={(e) => e.stopPropagation()}>
              <iframe
                src={`https://www.youtube.com/embed/${selectedVideo}?autoplay=1`}
                className="w-full h-full rounded-lg"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
            <button
              onClick={() => setSelectedVideo(null)}
              className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors"
            >
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}
        
        {/* Floating Action Buttons */}
        <div className="fixed bottom-6 right-6 z-40 space-y-4">
          <button
            onClick={() => setIsBookingOpen(true)}
            className="w-14 h-14 bg-red-600 hover:bg-red-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center group"
          >
            <Calendar className="w-6 h-6" />
          </button>
          
          <button
            onClick={() => window.open('tel:+94777721999', '_self')}
            className="w-14 h-14 bg-green-600 hover:bg-green-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center group"
          >
            <Phone className="w-6 h-6" />
          </button>
          
          <button
            onClick={() => {
              if (navigator.share) {
                navigator.share({
                  title: destination.name,
                  text: destination.description,
                  url: window.location.href
                });
              }
            }}
            className="w-14 h-14 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center group"
          >
            <Share2 className="w-6 h-6" />
          </button>
        </div>
      </div>
    </>
  );
};

export default DestinationDetail;
