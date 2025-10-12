import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { motion } from 'framer-motion';
import { 
  Mountain, 
  Users, 
  Clock, 
  MapPin, 
  Camera, 
  Heart, 
  Star, 
  Anchor,
  TreePine,
  AlertTriangle,
  CheckCircle,
  Baby,
  Shield,
  Award,
  Sparkles,
  Info,
  Cloud,
  Flower,
  Ship
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Alert, AlertDescription } from '@/components/ui/alert';
import EnhancedBookingModal from '@/components/EnhancedBookingModal';

const NuwaraEliyaFamilyOuting = () => {
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState('');
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const heroImages = [
    {
      url: "https://images.unsplash.com/photo-1596402184320-417e7178b2cd?auto=format&fit=crop&q=80",
      caption: "Family boating on Gregory Lake"
    },
    {
      url: "https://images.unsplash.com/photo-1580277541917-a4c892d3e8fc?auto=format&fit=crop&q=80",
      caption: "Victoria Park gardens in bloom"
    },
    {
      url: "https://images.unsplash.com/photo-1589308078059-be1415eab4c3?auto=format&fit=crop&q=80",
      caption: "Horse riding in the hill country"
    }
  ];

  const activities = [
    {
      name: "Gregory Lake Boat Rides",
      type: "Water Activity",
      duration: "30-60 minutes",
      ageGroup: "All ages",
      description: "Paddle boats, speed boats, and swan boats on the scenic lake",
      kidsFactor: "Kids love steering the colorful swan boats!"
    },
    {
      name: "Victoria Park",
      type: "Nature Walk",
      duration: "1-2 hours",
      ageGroup: "All ages",
      description: "Beautiful gardens with flowers, birds, and play areas",
      kidsFactor: "Playground, mini train rides, and bird watching"
    },
    {
      name: "Pony & Horse Riding",
      type: "Adventure",
      duration: "15-30 minutes",
      ageGroup: "3+ years",
      description: "Gentle ponies for kids and horses for adults around the lake",
      kidsFactor: "Feel like a cowboy/cowgirl in the hills!"
    },
    {
      name: "Strawberry Picking",
      type: "Farm Activity",
      duration: "1 hour",
      ageGroup: "All ages",
      description: "Pick fresh strawberries at local farms",
      kidsFactor: "Eat as many as you pick - kids paradise!"
    },
    {
      name: "Mini Golf",
      type: "Family Game",
      duration: "45 minutes",
      ageGroup: "5+ years",
      description: "18-hole mini golf course with hill country themes",
      kidsFactor: "Fun competition for the whole family"
    },
    {
      name: "Tea Factory Visit",
      type: "Educational",
      duration: "1 hour",
      ageGroup: "6+ years",
      description: "Learn how Ceylon tea is made with tastings",
      kidsFactor: "See big machines and enjoy chocolate tea!"
    }
  ];

  const familyPackages = [
    {
      title: "Lake & Park Explorer",
      price: "$30",
      priceUnit: "per adult",
      childPrice: "$15 per child (3-12 years)",
      duration: "Half Day",
      includes: [
        "Gregory Lake boat ride",
        "Victoria Park entrance",
        "Mini train ride",
        "Playground access",
        "Garden picnic spot",
        "Photography assistance"
      ],
      highlights: ["Relaxed pace", "Nature focused", "Toddler friendly"]
    },
    {
      title: "Adventure Day Out",
      price: "$50",
      priceUnit: "per adult",
      childPrice: "$25 per child",
      duration: "Full Day",
      includes: [
        "All lake activities",
        "Horse/pony riding",
        "Strawberry farm visit",
        "Mini golf game",
        "Lunch at lake view restaurant",
        "Transport between venues"
      ],
      highlights: ["Action packed", "Variety of activities", "Memorable experiences"]
    },
    {
      title: "Hill Country Special",
      price: "$75",
      priceUnit: "per adult",
      childPrice: "$40 per child",
      duration: "Full Day Plus",
      includes: [
        "Complete lake experience",
        "Victoria Park tour",
        "Tea factory visit",
        "Horse riding lesson",
        "Strawberry picking",
        "High tea experience",
        "Professional family photos",
        "Souvenir pack"
      ],
      highlights: ["Complete experience", "Educational elements", "Premium service"]
    }
  ];

  const seasonalHighlights = {
    "April - May": {
      weather: "Pleasant spring weather",
      special: "Flowers in full bloom",
      activities: ["Garden visits", "Outdoor picnics", "Perfect photography"]
    },
    "June - August": {
      weather: "Cool and misty",
      special: "Mystical atmosphere",
      activities: ["Cozy indoor activities", "Hot chocolate stops", "Misty lake views"]
    },
    "September - November": {
      weather: "Clear skies",
      special: "Best mountain views",
      activities: ["All outdoor activities", "Clear lake reflections", "Hiking weather"]
    },
    "December - March": {
      weather: "Cool and dry",
      special: "Peak tourist season",
      activities: ["All activities available", "Festival atmosphere", "Horse races"]
    }
  };

  const practicalTips = {
    "What to Pack": [
      "Warm jackets for everyone",
      "Rain jackets or umbrellas",
      "Comfortable walking shoes",
      "Extra clothes for kids",
      "Sunscreen (UV is strong)",
      "Camera with extra battery"
    ],
    "Food & Snacks": [
      "Many family restaurants available",
      "Pack snacks for boat rides",
      "Try local corn on the cob",
      "Fresh strawberry treats",
      "Hot chocolate at cafes",
      "Kid-friendly menus everywhere"
    ],
    "Getting Around": [
      "Tuk-tuks readily available",
      "Walking distance between attractions",
      "Stroller-friendly paths",
      "Hotel shuttle services",
      "Bike rentals for older kids",
      "Guide services available"
    ]
  };

  const ageRecommendations = [
    {
      ageGroup: "Toddlers (2-4 years)",
      bestActivities: ["Swan boat rides", "Park playground", "Pony rides"],
      tips: ["Short activities", "Warm clothes essential", "Afternoon naps possible"],
      avoidance: "Long walks in cold weather"
    },
    {
      ageGroup: "Young Kids (5-8 years)",
      bestActivities: ["All boat types", "Mini golf", "Strawberry picking"],
      tips: ["They'll love the adventure", "Bring change of clothes", "Hot drinks for warmth"],
      avoidance: "Late evening activities"
    },
    {
      ageGroup: "Tweens (9-12 years)",
      bestActivities: ["Speed boats", "Horse riding", "Tea factory tour"],
      tips: ["Can handle longer activities", "Enjoy learning experiences", "Photo opportunities"],
      avoidance: "Too many 'kiddie' activities"
    },
    {
      ageGroup: "Teens (13+ years)",
      bestActivities: ["Adventure activities", "Photography spots", "Cycling"],
      tips: ["Give some independence", "Include their preferences", "Social media moments"],
      avoidance: "Over-scheduling"
    }
  ];

  const faqs = [
    {
      question: "What's the weather like in Nuwara Eliya?",
      answer: "Known as 'Little England,' it's cool year-round (10-20°C). Mornings and evenings can be quite chilly. Always pack warm clothes regardless of the season. Afternoon rain is common, so bring rain gear."
    },
    {
      question: "Is it suitable for very young children?",
      answer: "Yes! The cool climate is actually refreshing for kids used to coastal heat. Just ensure they're dressed warmly. Most activities are gentle and suitable for toddlers. The altitude (1,868m) rarely affects children."
    },
    {
      question: "How long should we stay in Nuwara Eliya?",
      answer: "2-3 days is ideal for families. This allows a relaxed pace with time for all major activities plus rest. Day trips from Kandy or Ella are possible but rushed with kids."
    },
    {
      question: "Are the boat rides safe for children?",
      answer: "Very safe! All boats have life jackets in children's sizes. Swan boats and paddle boats are stable and operated in calm water. Staff supervise all activities. Speed boats have age restrictions."
    },
    {
      question: "What's the best time of day for activities?",
      answer: "Morning (9-11 AM) is ideal - less crowded and good weather. Afternoons can get misty/rainy. Plan indoor activities for after lunch. Evening gets cold quickly after 5 PM."
    },
    {
      question: "Can we find vegetarian/kid-friendly food?",
      answer: "Absolutely! Nuwara Eliya has many family restaurants with diverse menus. Pizza, pasta, and Chinese food are widely available. Fresh vegetables and fruits are abundant. Many places offer kids' portions."
    }
  ];

  const handleBookPackage = (packageTitle: string) => {
    setSelectedPackage(packageTitle);
    setIsBookingOpen(true);
  };

  return (
    <>
      <Helmet>
        <title>Nuwara Eliya Family Outing | Lake & Park Adventures | Recharge Travels</title>
        <meta name="description" content="Enjoy a perfect family day in Nuwara Eliya with boat rides on Gregory Lake, Victoria Park visits, pony rides, and strawberry picking in Sri Lanka's hill country." />
        <meta name="keywords" content="Nuwara Eliya family activities, Gregory Lake boating, Victoria Park, kids activities hill country, family outing Sri Lanka" />
        <meta property="og:title" content="Nuwara Eliya Family Fun - Lake & Park Adventures" />
        <meta property="og:description" content="Create magical family memories in the cool hills of Nuwara Eliya with boat rides, park visits, and outdoor adventures perfect for all ages." />
      </Helmet>

      <Header />
      
      <main className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <section className="relative h-[70vh] overflow-hidden">
          <div className="absolute inset-0">
            <img 
              src={heroImages[activeImageIndex].url}
              alt={heroImages[activeImageIndex].caption}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/50" />
          </div>

          <div className="relative h-full flex items-center justify-center text-center text-white px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="max-w-3xl"
            >
              <Badge className="mb-4 bg-emerald-600/90 text-white px-4 py-1">
                <Mountain className="w-4 h-4 mr-1" />
                Hill Country Fun
              </Badge>
              <h1 className="text-5xl md:text-6xl font-bold mb-6">
                Nuwara Eliya Lake & Park Adventures
              </h1>
              <p className="text-xl mb-8 text-gray-100">
                Escape to the cool hills for boat rides, pony adventures, and family fun in Sri Lanka's "Little England"
              </p>
              <div className="flex gap-4 justify-center">
                <Button 
                  size="lg" 
                  onClick={() => handleBookPackage("Adventure Day Out")}
                  className="bg-emerald-600 hover:bg-emerald-700"
                >
                  <Ship className="w-5 h-5 mr-2" />
                  Book Family Adventure
                </Button>
                <Button 
                  size="lg" 
                  variant="outline"
                  className="bg-white/10 backdrop-blur-sm text-white border-white/30 hover:bg-white/20"
                  onClick={() => document.getElementById('activities')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  View Activities
                </Button>
              </div>
            </motion.div>
          </div>

          {/* Image indicators */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
            {heroImages.map((_, index) => (
              <button
                key={index}
                onClick={() => setActiveImageIndex(index)}
                className={`w-2 h-2 rounded-full transition-all ${
                  index === activeImageIndex ? 'bg-white w-8' : 'bg-white/50'
                }`}
              />
            ))}
          </div>
        </section>

        {/* Why Nuwara Eliya */}
        <section className="py-16 px-4 bg-white">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-4xl font-bold mb-4">Why Families Love Nuwara Eliya</h2>
              <p className="text-lg text-gray-600">Cool climate, stunning scenery, and endless family activities</p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-6">
              {[
                {
                  icon: Cloud,
                  title: "Cool Climate Escape",
                  description: "Refreshing break from coastal heat with temperatures around 15-20°C"
                },
                {
                  icon: Ship,
                  title: "Gregory Lake Activities",
                  description: "Boating, cycling, pony rides, and lakeside fun for all ages"
                },
                {
                  icon: Flower,
                  title: "Beautiful Gardens",
                  description: "Victoria Park with colorful flowers, birds, and play areas"
                },
                {
                  icon: TreePine,
                  title: "Scenic Beauty",
                  description: "Surrounded by tea plantations, mountains, and waterfalls"
                },
                {
                  icon: Heart,
                  title: "Family-Friendly Town",
                  description: "Safe, walkable town with plenty of restaurants and activities"
                },
                {
                  icon: Camera,
                  title: "Photo Paradise",
                  description: "Colonial architecture and natural beauty at every turn"
                }
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="h-full hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <feature.icon className="w-12 h-12 text-emerald-600 mb-4" />
                      <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                      <p className="text-gray-600">{feature.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Activities */}
        <section id="activities" className="py-16 px-4 bg-gray-50">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-4xl font-bold mb-4">Family Activities</h2>
              <p className="text-lg text-gray-600">Fun experiences for every family member</p>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-6">
              {activities.map((activity, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="h-full hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-xl">{activity.name}</CardTitle>
                        <Badge variant="outline">
                          <Clock className="w-3 h-3 mr-1" />
                          {activity.duration}
                        </Badge>
                      </div>
                      <div className="flex gap-2 mt-2">
                        <Badge variant="secondary">{activity.type}</Badge>
                        <Badge variant="default">{activity.ageGroup}</Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <p className="text-gray-600">{activity.description}</p>
                      <div className="bg-emerald-50 p-3 rounded-lg">
                        <p className="text-sm flex items-start gap-2">
                          <Sparkles className="w-4 h-4 text-emerald-600 mt-0.5" />
                          <span className="text-emerald-800">{activity.kidsFactor}</span>
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            <Alert className="mt-8">
              <Anchor className="h-4 w-4" />
              <AlertDescription>
                <strong>Insider Tip:</strong> Start with Gregory Lake activities in the morning when the weather is clearest. Save indoor activities for the afternoon when mist often rolls in!
              </AlertDescription>
            </Alert>
          </div>
        </section>

        {/* Seasonal Guide */}
        <section className="py-16 px-4 bg-white">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-4xl font-bold mb-4">Seasonal Highlights</h2>
              <p className="text-lg text-gray-600">Plan your visit for the best experience</p>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-6">
              {Object.entries(seasonalHighlights).map(([season, info], index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="h-full">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Cloud className="w-5 h-5 text-emerald-600" />
                        {season}
                      </CardTitle>
                      <p className="text-gray-600 mt-1">{info.weather}</p>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="bg-emerald-50 p-3 rounded-lg">
                        <p className="text-sm font-semibold text-emerald-900">Special Feature:</p>
                        <p className="text-sm text-emerald-800">{info.special}</p>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-2">Best Activities:</h4>
                        <ul className="space-y-1">
                          {info.activities.map((activity, idx) => (
                            <li key={idx} className="flex items-center gap-2 text-sm">
                              <CheckCircle className="w-4 h-4 text-green-600" />
                              <span className="text-gray-600">{activity}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Age Recommendations */}
        <section className="py-16 px-4 bg-gray-50">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-4xl font-bold mb-4">Age-Specific Recommendations</h2>
              <p className="text-lg text-gray-600">Tailored activities for every age group</p>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-6">
              {ageRecommendations.map((age, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="h-full">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Users className="w-5 h-5 text-emerald-600" />
                        {age.ageGroup}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <h4 className="font-semibold mb-2">Best Activities:</h4>
                        <div className="flex flex-wrap gap-2">
                          {age.bestActivities.map((activity, idx) => (
                            <Badge key={idx} variant="secondary">
                              {activity}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-2">Tips:</h4>
                        <ul className="space-y-1">
                          {age.tips.map((tip, idx) => (
                            <li key={idx} className="flex items-start gap-2 text-sm">
                              <CheckCircle className="w-4 h-4 text-green-600 mt-0.5" />
                              <span className="text-gray-600">{tip}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="bg-amber-50 p-3 rounded-lg">
                        <p className="text-sm">
                          <strong>Avoid:</strong> {age.avoidance}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Family Packages */}
        <section className="py-16 px-4 bg-white">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-4xl font-bold mb-4">Family Day Out Packages</h2>
              <p className="text-lg text-gray-600">Complete experiences for your Nuwara Eliya adventure</p>
            </motion.div>

            <div className="grid lg:grid-cols-3 gap-8">
              {familyPackages.map((pkg, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="h-full hover:shadow-xl transition-shadow">
                    <CardHeader>
                      <CardTitle className="text-2xl">{pkg.title}</CardTitle>
                      <div className="flex items-baseline gap-2">
                        <span className="text-3xl font-bold text-emerald-600">{pkg.price}</span>
                        <span className="text-gray-600">/{pkg.priceUnit}</span>
                      </div>
                      <p className="text-sm text-gray-600">{pkg.childPrice}</p>
                      <Badge variant="outline" className="mt-2">
                        <Clock className="w-4 h-4 mr-1" />
                        {pkg.duration}
                      </Badge>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <h4 className="font-semibold mb-2">Package Includes:</h4>
                        <ul className="space-y-2">
                          {pkg.includes.map((item, idx) => (
                            <li key={idx} className="flex items-start gap-2">
                              <div className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                                <div className="w-2 h-2 bg-emerald-600 rounded-full" />
                              </div>
                              <span className="text-gray-600 text-sm">{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-2">Highlights:</h4>
                        <div className="flex flex-wrap gap-2">
                          {pkg.highlights.map((highlight, idx) => (
                            <Badge key={idx} variant="secondary">
                              {highlight}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <Button 
                        className="w-full"
                        onClick={() => handleBookPackage(pkg.title)}
                      >
                        Book This Package
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Practical Tips */}
        <section className="py-16 px-4 bg-gray-50">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-4xl font-bold mb-4">Practical Tips</h2>
              <p className="text-lg text-gray-600">Everything you need for a perfect day out</p>
            </motion.div>

            <Tabs defaultValue="what-to-pack" className="space-y-8">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="what-to-pack">What to Pack</TabsTrigger>
                <TabsTrigger value="food-snacks">Food & Snacks</TabsTrigger>
                <TabsTrigger value="getting-around">Getting Around</TabsTrigger>
              </TabsList>

              {Object.entries(practicalTips).map(([key, tips]) => (
                <TabsContent 
                  key={key} 
                  value={key.toLowerCase().replace(/ & /g, '-').replace(/ /g, '-')}
                  className="space-y-6"
                >
                  <Card>
                    <CardHeader>
                      <CardTitle>{key}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="grid md:grid-cols-2 gap-3">
                        {tips.map((tip, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <CheckCircle className="w-5 h-5 text-emerald-600 mt-0.5" />
                            <span className="text-gray-600">{tip}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </TabsContent>
              ))}
            </Tabs>
          </div>
        </section>

        {/* FAQs */}
        <section className="py-16 px-4 bg-white">
          <div className="max-w-3xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-4xl font-bold mb-4">Frequently Asked Questions</h2>
              <p className="text-lg text-gray-600">Common questions about Nuwara Eliya family outings</p>
            </motion.div>

            <Accordion type="single" collapsible className="space-y-4">
              {faqs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`} className="border rounded-lg px-6 bg-gray-50">
                  <AccordionTrigger className="text-left font-semibold">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-600">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-4 bg-gradient-to-br from-emerald-600 to-green-700 text-white">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl font-bold mb-6">
                Ready for Hill Country Adventures?
              </h2>
              <p className="text-xl mb-8 text-emerald-100">
                Escape to the cool hills for unforgettable family memories
              </p>
              <div className="flex gap-4 justify-center flex-wrap">
                <Button 
                  size="lg" 
                  variant="secondary"
                  onClick={() => handleBookPackage("Adventure Day Out")}
                >
                  <Mountain className="w-5 h-5 mr-2" />
                  Book Family Day Out
                </Button>
                <Button 
                  size="lg" 
                  variant="outline"
                  className="bg-transparent text-white border-white hover:bg-white/10"
                >
                  <Info className="w-5 h-5 mr-2" />
                  Learn More
                </Button>
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />

      <EnhancedBookingModal
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
        type="tour"
        itemTitle={selectedPackage || "Adventure Day Out"}
      />
    </>
  );
};

export default NuwaraEliyaFamilyOuting;