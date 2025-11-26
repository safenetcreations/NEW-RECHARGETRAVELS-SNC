
import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  MapPin, 
  Clock, 
  DollarSign, 
  Star, 
  Users, 
  Camera,
  Calendar,
  ArrowLeft,
  ExternalLink,
  Youtube,
  Newspaper,
  Info,
  TreePine,
  Mountain,
  Waves
} from 'lucide-react';
import { nationalParks } from '@/data/wildlifeToursData';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import BookingWidget from '@/components/wildTours/BookingWidget';

const ParkLandingPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  
  const park = nationalParks.find(p => p.slug === slug);
  
  if (!park) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Park Not Found</h1>
          <Link to="/tours/wildtours" className="text-emerald-600 hover:text-emerald-700">
            Back to Wild Tours
          </Link>
        </div>
      </div>
    );
  }

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "TouristAttraction",
    "name": park.name,
    "description": park.detailedDescription,
    "image": park.images,
    "address": {
      "@type": "PostalAddress",
      "addressLocality": park.location.nearestCity,
      "addressRegion": park.province,
      "addressCountry": "Sri Lanka"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": park.location.lat,
      "longitude": park.location.lng
    },
    "openingHours": park.operatingHours,
    "offers": {
      "@type": "Offer",
      "price": park.fees.entrance_fee,
      "priceCurrency": "USD",
      "availability": "InStock"
    }
  };

  return (
    <>
      <Helmet>
        <title>{park.name} – National Park Tours Sri Lanka | Recharge Travels</title>
        <meta 
          name="description" 
          content={`Visit ${park.name} in ${park.province}. ${park.description} Distance: ${park.location.distanceFromColombo}km from Colombo. Book your wildlife tour today.`}
        />
        <meta name="keywords" content={`${park.name}, ${park.province}, Sri Lanka national parks, wildlife tours, ${park.attractions.join(', ')}`} />
        <link rel="canonical" href={`${window.location.origin}/tours/wildtours/parks/${park.slug}`} />
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      </Helmet>

      <Header />

      {/* Hero Section */}
      <section className="relative h-screen overflow-hidden">
        {/* Background Video/Image */}
        <div className="absolute inset-0">
          {park.videoUrl ? (
            <iframe
              src={park.videoUrl.replace('watch?v=', 'embed/')}
              className="w-full h-full object-cover"
              allow="autoplay; encrypted-media"
              allowFullScreen
            />
          ) : (
            <img 
              src={park.images[0]} 
              alt={park.name}
              className="w-full h-full object-cover"
            />
          )}
          <div className="absolute inset-0 bg-black/40" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 h-full flex items-center justify-center text-center text-white">
          <div className="max-w-4xl mx-auto px-4">
            <Badge className="mb-4 bg-white/20 text-white border-white/30">
              {park.classification}
            </Badge>
            <h1 className="text-5xl md:text-7xl font-playfair font-bold mb-6">
              {park.name}
            </h1>
            <p className="text-xl md:text-2xl font-montserrat mb-8 max-w-2xl mx-auto">
              {park.description}
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700" asChild>
                <a href="#booking">
                  <Calendar className="w-5 h-5 mr-2" />
                  Book Your Visit
                </a>
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-gray-900" asChild>
                <a href={park.liveFeatures.googleMapsUrl} target="_blank" rel="noopener noreferrer">
                  <MapPin className="w-5 h-5 mr-2" />
                  View on Map
                </a>
              </Button>
            </div>
          </div>
        </div>

        {/* Back Navigation */}
        <div className="absolute top-6 left-6 z-20">
          <Button variant="outline" size="sm" className="bg-white/10 border-white/30 text-white hover:bg-white hover:text-gray-900" asChild>
            <Link to="/tours/wildtours#national-parks">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Parks
            </Link>
          </Button>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-12">
              {/* Quick Info Cards */}
              <div className="grid md:grid-cols-3 gap-6">
                <Card className="text-center">
                  <CardContent className="p-6">
                    <MapPin className="w-8 h-8 text-emerald-600 mx-auto mb-4" />
                    <h3 className="font-bold text-gray-900 mb-2">Location</h3>
                    <p className="text-sm text-gray-600">{park.location.nearestCity}</p>
                    <p className="text-sm text-gray-600">{park.province}</p>
                  </CardContent>
                </Card>
                
                <Card className="text-center">
                  <CardContent className="p-6">
                    <DollarSign className="w-8 h-8 text-emerald-600 mx-auto mb-4" />
                    <h3 className="font-bold text-gray-900 mb-2">Entrance Fee</h3>
                    <p className="text-lg font-bold text-emerald-600">${park.fees.entrance_fee}</p>
                    <p className="text-sm text-gray-600">Per person</p>
                  </CardContent>
                </Card>
                
                <Card className="text-center">
                  <CardContent className="p-6">
                    <Clock className="w-8 h-8 text-emerald-600 mx-auto mb-4" />
                    <h3 className="font-bold text-gray-900 mb-2">Operating Hours</h3>
                    <p className="text-sm text-gray-600">{park.operatingHours}</p>
                  </CardContent>
                </Card>
              </div>

              {/* Detailed Content Tabs */}
              <Tabs defaultValue="overview" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="wildlife">Wildlife</TabsTrigger>
                  <TabsTrigger value="facilities">Facilities</TabsTrigger>
                  <TabsTrigger value="media">Media</TabsTrigger>
                </TabsList>
                
                <TabsContent value="overview" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Info className="w-5 h-5" />
                        About {park.name}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-700 leading-relaxed mb-6">
                        {park.detailedDescription}
                      </p>
                      
                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <h4 className="font-bold text-gray-900 mb-3">Best Time to Visit</h4>
                          <p className="text-gray-600 mb-1">
                            <Calendar className="w-4 h-4 inline mr-2" />
                            {park.bestTimeToVisit}
                          </p>
                          <p className="text-gray-600">
                            <Star className="w-4 h-4 inline mr-2" />
                            Peak Season: {park.peakSeason}
                          </p>
                        </div>
                        
                        <div>
                          <h4 className="font-bold text-gray-900 mb-3">Distance Info</h4>
                          <p className="text-gray-600 mb-1">
                            <MapPin className="w-4 h-4 inline mr-2" />
                            {park.location.distanceFromColombo}km from Colombo
                          </p>
                          <p className="text-gray-600">
                            <MapPin className="w-4 h-4 inline mr-2" />
                            Near {park.location.nearestCity}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="wildlife" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Wildlife & Attractions</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <h4 className="font-bold text-gray-900 mb-3">Key Attractions</h4>
                          <div className="space-y-2">
                            {park.attractions.map((attraction, index) => (
                              <div key={index} className="flex items-center gap-2">
                                <Star className="w-4 h-4 text-amber-500" />
                                <span className="capitalize">{attraction}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                        
                        <div>
                          <h4 className="font-bold text-gray-900 mb-3">Wildlife Species</h4>
                          <div className="space-y-2">
                            {park.wildlife.map((species, index) => (
                              <div key={index} className="flex items-center gap-2">
                                <TreePine className="w-4 h-4 text-green-600" />
                                <span>{species}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="facilities" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Facilities & Fees</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <h4 className="font-bold text-gray-900 mb-3">Available Facilities</h4>
                          <div className="space-y-2">
                            {park.facilities.map((facility, index) => (
                              <div key={index} className="flex items-center gap-2">
                                <Info className="w-4 h-4 text-blue-600" />
                                <span>{facility}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                        
                        <div>
                          <h4 className="font-bold text-gray-900 mb-3">Fees & Charges</h4>
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <span>Entrance Fee:</span>
                              <span className="font-bold">${park.fees.entrance_fee}</span>
                            </div>
                            {park.fees.jeep_hire && (
                              <div className="flex justify-between">
                                <span>Jeep Hire:</span>
                                <span className="font-bold">${park.fees.jeep_hire}</span>
                              </div>
                            )}
                            {park.fees.guide_fee && (
                              <div className="flex justify-between">
                                <span>Guide Fee:</span>
                                <span className="font-bold">${park.fees.guide_fee}</span>
                              </div>
                            )}
                            {park.fees.camera_fee && (
                              <div className="flex justify-between">
                                <span>Camera Fee:</span>
                                <span className="font-bold">${park.fees.camera_fee}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="media" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Live Features & Media</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                          <Button className="w-full" asChild>
                            <a href={park.liveFeatures.googleMapsUrl} target="_blank" rel="noopener noreferrer">
                              <MapPin className="w-4 h-4 mr-2" />
                              Interactive Map & Live Traffic
                            </a>
                          </Button>
                          
                          {park.liveFeatures.youtubePlaylist && (
                            <Button variant="outline" className="w-full" asChild>
                              <a href={park.liveFeatures.youtubePlaylist} target="_blank" rel="noopener noreferrer">
                                <Youtube className="w-4 h-4 mr-2" />
                                Wildlife Highlights Videos
                              </a>
                            </Button>
                          )}
                          
                          {park.liveFeatures.newsRssUrl && (
                            <Button variant="outline" className="w-full">
                              <Newspaper className="w-4 h-4 mr-2" />
                              Latest Park News
                            </Button>
                          )}
                        </div>
                        
                        <div>
                          <h4 className="font-bold text-gray-900 mb-3">Photo Gallery</h4>
                          <div className="grid grid-cols-2 gap-2">
                            {park.images.map((image, index) => (
                              <img 
                                key={index}
                                src={image}
                                alt={`${park.name} ${index + 1}`}
                                className="w-full h-24 object-cover rounded-lg hover:scale-105 transition-transform cursor-pointer"
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>

              {/* Interactive Map */}
              <Card>
                <CardHeader>
                  <CardTitle>Interactive Park Map</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
                    <iframe
                      src={`https://www.google.com/maps/embed/v1/place?key=YOUR_API_KEY&q=${park.location.lat},${park.location.lng}&zoom=12`}
                      width="100%"
                      height="400"
                      style={{ border: 0 }}
                      allowFullScreen
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      className="rounded-lg"
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar - Booking Widget */}
            <div className="lg:col-span-1">
              <div id="booking" className="sticky top-6">
                <BookingWidget 
                  onBookingSubmit={(data) => {
                    console.log('Park booking:', { ...data, parkId: park.id });
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
};

export default ParkLandingPage;
