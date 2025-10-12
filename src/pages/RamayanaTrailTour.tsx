import React from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import ComprehensiveSEO from '@/components/seo/ComprehensiveSEO';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  MapPin, 
  Clock, 
  Users, 
  Star, 
  Heart, 
  Calendar,
  Phone,
  Mail,
  MessageCircle,
  Camera,
  BookOpen,
  Shield
} from 'lucide-react';
import { Link } from 'react-router-dom';

const RamayanaTrailTour: React.FC = () => {
  const { t, language } = useLanguage();

  const tourData = {
    title: "Ramayana Trail - Mythological Journey",
    description: "Follow the ancient Ramayana trail through Sri Lanka's sacred sites and temples, exploring the mythological connections between India and Sri Lanka.",
    duration: "8 days / 7 nights",
    price: 1650,
    currency: "USD",
    groupSize: "2-12 people",
    difficulty: "Easy",
    rating: 4.9,
    reviewCount: 78,
    category: "spiritual",
    destinations: ["Colombo", "Kandy", "Nuwara Eliya", "Ella", "Ravana Falls"],
    highlights: [
      "Visit Ramayana-related sites",
      "Temple blessings and ceremonies",
      "Mythological storytelling",
      "Sacred site exploration",
      "Spiritual experiences"
    ],
    itinerary: [
      {
        day: 1,
        title: "Arrival in Colombo",
        description: "Welcome to Sri Lanka! Transfer to your hotel and evening briefing about the Ramayana trail.",
        activities: ["Airport pickup", "Hotel check-in", "Ramayana trail briefing", "Welcome dinner"]
      },
      {
        day: 2,
        title: "Colombo to Kandy",
        description: "Travel to Kandy and visit the Temple of the Sacred Tooth Relic, a key site in the Ramayana story.",
        activities: ["Temple of the Sacred Tooth Relic", "Cultural dance show", "Kandy Lake walk"]
      },
      {
        day: 3,
        title: "Kandy to Nuwara Eliya",
        description: "Journey to the hill country and explore sites connected to the Ramayana mythology.",
        activities: ["Tea plantation visit", "Ramayana site exploration", "Mountain views"]
      },
      {
        day: 4,
        title: "Nuwara Eliya to Ella",
        description: "Continue to Ella and visit Ravana Falls, named after the demon king from Ramayana.",
        activities: ["Ravana Falls", "Nine Arch Bridge", "Tea factory tour"]
      },
      {
        day: 5,
        title: "Ella Exploration",
        description: "Full day exploring Ella's Ramayana connections and natural beauty.",
        activities: ["Ravana Cave", "Ella Rock hike", "Local temple visits"]
      },
      {
        day: 6,
        title: "Ella to Kandy",
        description: "Return to Kandy for more spiritual experiences and temple visits.",
        activities: ["Temple ceremonies", "Meditation session", "Cultural workshop"]
      },
      {
        day: 7,
        title: "Kandy to Colombo",
        description: "Return to Colombo with final Ramayana site visits and farewell dinner.",
        activities: ["Final temple visits", "Shopping for souvenirs", "Farewell dinner"]
      },
      {
        day: 8,
        title: "Departure",
        description: "Transfer to airport with spiritual blessings and memories of the Ramayana trail.",
        activities: ["Airport transfer", "Final blessings", "Departure"]
      }
    ],
    included: [
      "Luxury accommodation in spiritual retreats",
      "All meals (vegetarian options available)",
      "Spiritual guide and Ramayana expert",
      "Temple entrance fees and ceremony arrangements",
      "Transportation in air-conditioned vehicle",
      "Meditation and yoga sessions",
      "Traditional blessing ceremonies"
    ],
    excluded: [
      "International flights",
      "Personal expenses",
      "Tips for guides and drivers",
      "Optional activities",
      "Travel insurance"
    ],
    images: [
      "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1563720360172-67b8f3dce741?w=800&h=600&fit=crop"
    ]
  };

  return (
    <>
      <ComprehensiveSEO
        title={`${tourData.title} - Recharge Travels & Tours Ltd`}
        description={tourData.description}
        keywords={[
          'Ramayana trail Sri Lanka',
          'spiritual tours Sri Lanka',
          'mythological journey',
          'sacred sites Sri Lanka',
          'temple tours Sri Lanka',
          'Ravana falls',
          'spiritual experiences Sri Lanka'
        ]}
        canonicalUrl="/tours/ramayana-trail"
        ogImage={tourData.images[0]}
        alternateLanguages={[
          { lang: 'en', url: '/tours/ramayana-trail' },
          { lang: 'ta', url: '/ta/tours/ramayana-trail' },
          { lang: 'si', url: '/si/tours/ramayana-trail' }
        ]}
      />
      
      <Header />
      
      <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-teal-50">
        {/* Hero Section */}
        <section className="relative h-[70vh] overflow-hidden">
          <div className="absolute inset-0">
            <img
              src={tourData.images[0]}
              alt={tourData.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/40" />
          </div>
          
          <div className="relative z-10 h-full flex items-center justify-center">
            <div className="text-center text-white max-w-4xl mx-auto px-4">
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="text-4xl md:text-6xl font-bold mb-6"
              >
                {tourData.title}
              </motion.h1>
              
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto"
              >
                {tourData.description}
              </motion.p>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="flex flex-wrap justify-center gap-4 mb-8"
              >
                <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                  <Clock className="w-4 h-4 mr-2" />
                  {tourData.duration}
                </Badge>
                <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                  <Users className="w-4 h-4 mr-2" />
                  {tourData.groupSize}
                </Badge>
                <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                  <Star className="w-4 h-4 mr-2" />
                  {tourData.rating} ({tourData.reviewCount} reviews)
                </Badge>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                className="flex flex-col sm:flex-row gap-4 justify-center"
              >
                <Button size="lg" className="bg-orange-500 hover:bg-orange-600 text-white">
                  <Calendar className="w-5 h-5 mr-2" />
                  Book This Tour
                </Button>
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/20">
                  <MessageCircle className="w-5 h-5 mr-2" />
                  Get Quote
                </Button>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Tour Details */}
        <section className="py-16 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Main Content */}
              <div className="lg:col-span-2 space-y-8">
                {/* Highlights */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Heart className="w-5 h-5 text-red-500" />
                      Tour Highlights
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 gap-4">
                      {tourData.highlights.map((highlight, index) => (
                        <div key={index} className="flex items-start gap-3">
                          <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0" />
                          <span className="text-gray-700">{highlight}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Itinerary */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BookOpen className="w-5 h-5 text-blue-500" />
                      Detailed Itinerary
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {tourData.itinerary.map((day) => (
                        <div key={day.day} className="border-l-4 border-orange-500 pl-6">
                          <h4 className="font-semibold text-lg text-gray-900 mb-2">
                            Day {day.day}: {day.title}
                          </h4>
                          <p className="text-gray-600 mb-3">{day.description}</p>
                          <div className="flex flex-wrap gap-2">
                            {day.activities.map((activity, index) => (
                              <Badge key={index} variant="outline" className="text-sm">
                                {activity}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Destinations */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MapPin className="w-5 h-5 text-green-500" />
                      Destinations Covered
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-3">
                      {tourData.destinations.map((destination) => (
                        <Badge key={destination} variant="secondary" className="text-sm">
                          {destination}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Price Card */}
                <Card className="sticky top-6">
                  <CardHeader>
                    <CardTitle className="text-2xl font-bold text-gray-900">
                      ${tourData.price}
                      <span className="text-sm font-normal text-gray-500"> / person</span>
                    </CardTitle>
                    <CardDescription>
                      {tourData.duration} • {tourData.groupSize}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Button className="w-full bg-orange-500 hover:bg-orange-600">
                      Book Now
                    </Button>
                    <Button variant="outline" className="w-full">
                      Get Free Quote
                    </Button>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="flex-1">
                        <Phone className="w-4 h-4 mr-2" />
                        Call
                      </Button>
                      <Button variant="outline" size="sm" className="flex-1">
                        <MessageCircle className="w-4 h-4 mr-2" />
                        WhatsApp
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* What's Included */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Shield className="w-5 h-5 text-green-500" />
                      What's Included
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {tourData.included.map((item, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0" />
                          <span className="text-sm text-gray-700">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>

                {/* What's Not Included */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Shield className="w-5 h-5 text-red-500" />
                      What's Not Included
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {tourData.excluded.map((item, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0" />
                          <span className="text-sm text-gray-700">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Gallery */}
        <section className="py-16 px-4 bg-gray-50">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">Tour Gallery</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {tourData.images.map((image, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="relative overflow-hidden rounded-lg shadow-lg"
                >
                  <img
                    src={image}
                    alt={`${tourData.title} - Image ${index + 1}`}
                    className="w-full h-64 object-cover hover:scale-110 transition-transform duration-300"
                  />
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 px-4 bg-gradient-to-r from-orange-500 to-red-500">
          <div className="max-w-4xl mx-auto text-center text-white">
            <h2 className="text-3xl font-bold mb-6">Ready to Experience the Ramayana Trail?</h2>
            <p className="text-xl mb-8">
              Join us on this spiritual journey through Sri Lanka's sacred sites and ancient mythology.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-white text-orange-500 hover:bg-gray-100">
                <Calendar className="w-5 h-5 mr-2" />
                Book Your Journey
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/20">
                <MessageCircle className="w-5 h-5 mr-2" />
                Contact Us
              </Button>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </>
  );
};

export default RamayanaTrailTour; 