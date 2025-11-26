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
  Leaf,
  BookOpen,
  Shield,
  Sparkles
} from 'lucide-react';
import { Link } from 'react-router-dom';

const AyurvedaWellnessTour: React.FC = () => {
  const { t, language } = useLanguage();

  const tourData = {
    title: "Ayurveda Wellness & Healing",
    description: "Experience traditional Ayurvedic treatments and wellness experiences in serene settings across Sri Lanka.",
    duration: "6 days / 5 nights",
    price: 1200,
    currency: "USD",
    groupSize: "2-8 people",
    difficulty: "Easy",
    rating: 4.8,
    reviewCount: 92,
    category: "wellness",
    destinations: ["Colombo", "Kandy", "Bentota"],
    highlights: [
      "Ayurvedic consultations",
      "Traditional treatments",
      "Yoga and meditation",
      "Herbal medicine workshops",
      "Wellness cuisine"
    ],
    itinerary: [
      {
        day: 1,
        title: "Arrival & Wellness Assessment",
        description: "Welcome to your wellness journey! Begin with Ayurvedic consultation and wellness assessment.",
        activities: ["Airport pickup", "Ayurvedic consultation", "Wellness assessment", "Welcome dinner"]
      },
      {
        day: 2,
        title: "Colombo Wellness Center",
        description: "Full day of Ayurvedic treatments and wellness activities in Colombo.",
        activities: ["Morning yoga", "Ayurvedic massage", "Meditation session", "Wellness workshop"]
      },
      {
        day: 3,
        title: "Colombo to Kandy",
        description: "Travel to Kandy and continue your wellness journey in the hill country.",
        activities: ["Transfer to Kandy", "Herbal garden visit", "Evening meditation", "Wellness dinner"]
      },
      {
        day: 4,
        title: "Kandy Wellness Retreat",
        description: "Immerse yourself in traditional Ayurvedic treatments and spiritual practices.",
        activities: ["Sunrise yoga", "Ayurvedic treatments", "Spice workshop", "Temple meditation"]
      },
      {
        day: 5,
        title: "Kandy to Bentota",
        description: "Journey to the coastal wellness resort for beachside healing experiences.",
        activities: ["Transfer to Bentota", "Beach meditation", "Ayurvedic spa", "Sunset yoga"]
      },
      {
        day: 6,
        title: "Departure with Wellness",
        description: "Final wellness session and departure with renewed energy and wellness knowledge.",
        activities: ["Final treatment", "Wellness consultation", "Herbal pack preparation", "Departure"]
      }
    ],
    included: [
      "Ayurvedic resort accommodation",
      "Daily wellness treatments",
      "Yoga and meditation sessions",
      "Wellness meals (vegetarian)",
      "Expert Ayurvedic consultation",
      "Herbal supplements and medicines",
      "Wellness workshops and classes"
    ],
    excluded: [
      "International flights",
      "Personal expenses",
      "Additional treatments",
      "Tips for therapists",
      "Travel insurance"
    ],
    treatments: [
      {
        name: "Abhyanga Massage",
        description: "Traditional full-body oil massage for relaxation and detoxification",
        duration: "90 minutes"
      },
      {
        name: "Shirodhara",
        description: "Warm oil therapy for the forehead to calm the mind and nervous system",
        duration: "60 minutes"
      },
      {
        name: "Panchakarma",
        description: "Five-fold detoxification therapy for deep cleansing",
        duration: "120 minutes"
      },
      {
        name: "Herbal Steam Bath",
        description: "Steam therapy with medicinal herbs for purification",
        duration: "45 minutes"
      }
    ],
    images: [
      "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1563720360172-67b8f3dce741?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=600&fit=crop"
    ]
  };

  return (
    <>
      <ComprehensiveSEO
        title={`${tourData.title} - Recharge Travels & Tours Ltd`}
        description={tourData.description}
        keywords={[
          'Ayurveda Sri Lanka',
          'wellness tours Sri Lanka',
          'Ayurvedic treatments',
          'yoga meditation Sri Lanka',
          'wellness retreat Sri Lanka',
          'healing tours',
          'spa treatments Sri Lanka'
        ]}
        canonicalUrl="/tours/ayurveda-wellness"
        ogImage={tourData.images[0]}
        alternateLanguages={[
          { lang: 'en', url: '/tours/ayurveda-wellness' },
          { lang: 'ta', url: '/ta/tours/ayurveda-wellness' },
          { lang: 'si', url: '/si/tours/ayurveda-wellness' }
        ]}
      />
      
      <Header />
      
      <main className="min-h-screen bg-gradient-to-br from-green-50 via-white to-teal-50">
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
                <Button size="lg" className="bg-green-500 hover:bg-green-600 text-white">
                  <Calendar className="w-5 h-5 mr-2" />
                  Book Wellness Tour
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
                      <Sparkles className="w-5 h-5 text-green-500" />
                      Wellness Highlights
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 gap-4">
                      {tourData.highlights.map((highlight, index) => (
                        <div key={index} className="flex items-start gap-3">
                          <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0" />
                          <span className="text-gray-700">{highlight}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Treatments */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Leaf className="w-5 h-5 text-green-500" />
                      Ayurvedic Treatments
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 gap-6">
                      {tourData.treatments.map((treatment, index) => (
                        <div key={index} className="border border-green-200 rounded-lg p-4">
                          <h4 className="font-semibold text-lg text-gray-900 mb-2">
                            {treatment.name}
                          </h4>
                          <p className="text-gray-600 mb-3">{treatment.description}</p>
                          <Badge variant="outline" className="text-green-600 border-green-300">
                            {treatment.duration}
                          </Badge>
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
                      Wellness Itinerary
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {tourData.itinerary.map((day) => (
                        <div key={day.day} className="border-l-4 border-green-500 pl-6">
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
                      Wellness Destinations
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
                    <Button className="w-full bg-green-500 hover:bg-green-600">
                      Book Wellness Tour
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
            <h2 className="text-3xl font-bold text-center mb-12">Wellness Gallery</h2>
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
        <section className="py-16 px-4 bg-gradient-to-r from-green-500 to-teal-500">
          <div className="max-w-4xl mx-auto text-center text-white">
            <h2 className="text-3xl font-bold mb-6">Ready to Begin Your Wellness Journey?</h2>
            <p className="text-xl mb-8">
              Experience the healing power of Ayurveda in the serene settings of Sri Lanka.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-white text-green-500 hover:bg-gray-100">
                <Calendar className="w-5 h-5 mr-2" />
                Book Wellness Tour
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

export default AyurvedaWellnessTour; 