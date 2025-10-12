import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { motion } from 'framer-motion';
import { 
  Heart, 
  Users, 
  Clock, 
  MapPin, 
  Camera, 
  Baby, 
  Star, 
  Droplets,
  Leaf,
  AlertTriangle,
  CheckCircle,
  Shield,
  Award,
  Sparkles,
  Info,
  Calendar,
  Utensils,
  Bus
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Alert, AlertDescription } from '@/components/ui/alert';
import EnhancedBookingModal from '@/components/EnhancedBookingModal';

const PinnawalaFamilyExperience = () => {
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState('');
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const heroImages = [
    {
      url: "https://images.unsplash.com/photo-1574482620811-1aa16ffe3c82?auto=format&fit=crop&q=80",
      caption: "Baby elephants playing at Pinnawala Orphanage"
    },
    {
      url: "https://images.unsplash.com/photo-1564760055775-d63b17a55c44?auto=format&fit=crop&q=80",
      caption: "Elephant bath time at the river"
    },
    {
      url: "https://images.unsplash.com/photo-1585970480901-90d6bb2a48b5?auto=format&fit=crop&q=80",
      caption: "Feeding time with the orphaned elephants"
    }
  ];

  const dailySchedule = [
    {
      time: "8:15 AM",
      activity: "Morning Feeding",
      duration: "45 minutes",
      highlight: "Watch baby elephants being bottle-fed",
      kidsFactor: "Kids love seeing babies drink from giant bottles!"
    },
    {
      time: "10:00 AM",
      activity: "Bath Time at River",
      duration: "2 hours",
      highlight: "Elephants walk through town to river",
      kidsFactor: "Most exciting part - elephants playing in water!"
    },
    {
      time: "12:00 PM",
      activity: "Lunch Break",
      duration: "1 hour",
      highlight: "Restaurant overlooking elephants",
      kidsFactor: "Eat lunch while watching elephants"
    },
    {
      time: "1:15 PM",
      activity: "Afternoon Feeding",
      duration: "45 minutes",
      highlight: "Adult elephants eating fruits",
      kidsFactor: "See how much elephants can eat!"
    },
    {
      time: "2:00 PM",
      activity: "Second Bath Time",
      duration: "2 hours",
      highlight: "Another chance to see river bathing",
      kidsFactor: "Perfect for afternoon visitors"
    },
    {
      time: "5:00 PM",
      activity: "Evening Feeding",
      duration: "30 minutes",
      highlight: "Final feeding of the day",
      kidsFactor: "Peaceful end to the visit"
    }
  ];

  const familyPackages = [
    {
      title: "Morning Explorer Package",
      price: "$25",
      priceUnit: "per adult",
      childPrice: "$12 per child (3-12 years)",
      duration: "Half Day (8 AM - 12 PM)",
      includes: [
        "Entrance tickets to orphanage",
        "Guided tour with elephant facts",
        "Prime viewing spots for feeding",
        "River bathing experience",
        "Kids' elephant education booklet",
        "Photo opportunities"
      ],
      highlights: ["Baby elephant feeding", "Morning bath time", "Less crowded"]
    },
    {
      title: "Full Day Experience",
      price: "$45",
      priceUnit: "per adult",
      childPrice: "$22 per child",
      duration: "Full Day (8 AM - 5 PM)",
      includes: [
        "All feeding sessions",
        "Both bathing times",
        "Lunch at riverside restaurant",
        "Elephant dung paper factory visit",
        "Souvenir for each child",
        "Professional photo package"
      ],
      highlights: ["Complete elephant schedule", "Educational activities", "Memorable photos"]
    },
    {
      title: "VIP Family Package",
      price: "$75",
      priceUnit: "per adult",
      childPrice: "$40 per child",
      duration: "Premium Experience",
      includes: [
        "Private guide for your family",
        "Behind-the-scenes tour",
        "Meet the mahouts (elephant keepers)",
        "Special feeding participation",
        "Premium viewing areas",
        "Personalized certificate",
        "Transport from Colombo/Kandy"
      ],
      highlights: ["Exclusive access", "Personal interaction", "Educational focus"]
    }
  ];

  const visitorTips = {
    "Best Practices": [
      "Arrive 30 minutes before feeding times",
      "Wear comfortable walking shoes",
      "Bring sun protection (hat, sunscreen)",
      "Keep a safe distance from elephants",
      "Follow all staff instructions",
      "No flash photography near elephants"
    ],
    "What to Bring": [
      "Camera with zoom lens",
      "Water bottles (refillable stations available)",
      "Light snacks for kids",
      "Hand sanitizer",
      "Small backpack for belongings",
      "Change of clothes (in case of splashing)"
    ],
    "Photo Tips": [
      "Best photos during river bathing",
      "Early morning has better lighting",
      "Capture feeding time interactions",
      "Video the elephant walk to river",
      "Let kids take their own photos",
      "Buy official photos for close-ups"
    ]
  };

  const educationalHighlights = [
    {
      topic: "Orphan Care",
      description: "Learn how orphaned baby elephants are rescued and cared for",
      kidLesson: "Understanding animal welfare and conservation"
    },
    {
      topic: "Elephant Behavior",
      description: "Observe social interactions and family bonds",
      kidLesson: "How elephants communicate and play together"
    },
    {
      topic: "Conservation Efforts",
      description: "Discover Sri Lanka's elephant protection programs",
      kidLesson: "Why protecting wildlife is important"
    },
    {
      topic: "Daily Care Routine",
      description: "See how 90+ elephants are fed and maintained",
      kidLesson: "Responsibility and caring for animals"
    }
  ];

  const ageRecommendations = [
    {
      ageGroup: "2-4 years",
      recommendation: "Perfect first elephant experience",
      tips: ["Stroller-friendly paths", "Feeding times are highlights", "Bring snacks and drinks"],
      bestTime: "Morning visit when cooler"
    },
    {
      ageGroup: "5-8 years",
      recommendation: "Ideal age for learning and interaction",
      tips: ["They'll love the baby elephants", "Great photo opportunities", "Educational questions encouraged"],
      bestTime: "Full day to see everything"
    },
    {
      ageGroup: "9-12 years",
      recommendation: "Educational and entertaining",
      tips: ["Can understand conservation message", "Interested in elephant facts", "May want souvenirs"],
      bestTime: "Include paper factory visit"
    },
    {
      ageGroup: "Teens & Adults",
      recommendation: "Appreciation for conservation work",
      tips: ["Photography opportunities", "Behind-the-scenes interest", "Conservation discussions"],
      bestTime: "VIP package for deeper experience"
    }
  ];

  const faqs = [
    {
      question: "Is it ethical to visit Pinnawala?",
      answer: "Pinnawala is a government-run facility that has cared for orphaned elephants since 1975. While it has evolved into a tourist attraction, entrance fees support elephant care and conservation efforts. The facility provides necessary care for elephants that cannot survive in the wild."
    },
    {
      question: "Can we touch or feed the elephants?",
      answer: "Direct touching is not allowed for safety reasons. However, during special experiences, supervised feeding opportunities may be available. The staff prioritizes both visitor safety and elephant welfare."
    },
    {
      question: "How close can we get to the elephants?",
      answer: "Visitors can get quite close during river bathing and feeding times, typically within 10-15 feet, but barriers ensure safe distances. Photo opportunities are excellent without needing direct contact."
    },
    {
      question: "Is it suitable for toddlers?",
      answer: "Yes! The facility has paved paths suitable for strollers. Toddlers especially enjoy watching baby elephants. Just ensure constant supervision and stay behind barriers."
    },
    {
      question: "What's the best time to visit?",
      answer: "Morning feeding (8:15 AM) and bath time (10 AM) are the most popular. For smaller crowds, consider the afternoon sessions. Avoid weekends and holidays when possible."
    },
    {
      question: "Are there facilities for families?",
      answer: "Yes, there are clean restrooms, baby changing facilities, restaurants with kids' menus, and shaded seating areas throughout the orphanage."
    }
  ];

  const handleBookPackage = (packageTitle: string) => {
    setSelectedPackage(packageTitle);
    setIsBookingOpen(true);
  };

  return (
    <>
      <Helmet>
        <title>Pinnawala Elephant Orphanage Family Visit | Recharge Travels</title>
        <meta name="description" content="Visit Pinnawala Elephant Orphanage with your family. Watch baby elephants being fed, enjoy river bathing time, and learn about elephant conservation in Sri Lanka." />
        <meta name="keywords" content="Pinnawala Elephant Orphanage, family activities Sri Lanka, elephant experience, kids activities, wildlife education" />
        <meta property="og:title" content="Pinnawala Elephant Orphanage - Family Experience" />
        <meta property="og:description" content="A heartwarming family experience at Asia's most renowned elephant orphanage. Perfect for children of all ages." />
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
              <Badge className="mb-4 bg-blue-600/90 text-white px-4 py-1">
                <Heart className="w-4 h-4 mr-1" />
                Elephant Orphanage
              </Badge>
              <h1 className="text-5xl md:text-6xl font-bold mb-6">
                Pinnawala Elephant Orphanage Experience
              </h1>
              <p className="text-xl mb-8 text-gray-100">
                Get up close with rescued elephants and their babies in a heartwarming family adventure
              </p>
              <div className="flex gap-4 justify-center">
                <Button 
                  size="lg" 
                  onClick={() => handleBookPackage("Full Day Experience")}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Heart className="w-5 h-5 mr-2" />
                  Book Family Visit
                </Button>
                <Button 
                  size="lg" 
                  variant="outline"
                  className="bg-white/10 backdrop-blur-sm text-white border-white/30 hover:bg-white/20"
                  onClick={() => document.getElementById('schedule')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  View Daily Schedule
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

        {/* Why Visit Pinnawala */}
        <section className="py-16 px-4 bg-white">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-4xl font-bold mb-4">Why Families Love Pinnawala</h2>
              <p className="text-lg text-gray-600">A unique blend of wildlife encounter, education, and conservation</p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-6">
              {[
                {
                  icon: Baby,
                  title: "Baby Elephant Encounters",
                  description: "Watch adorable baby elephants being bottle-fed and playing together"
                },
                {
                  icon: Droplets,
                  title: "River Bathing Spectacle",
                  description: "See the entire herd walk through town and enjoy their river bath"
                },
                {
                  icon: Camera,
                  title: "Incredible Photo Moments",
                  description: "Countless opportunities for family photos with elephants"
                },
                {
                  icon: Leaf,
                  title: "Conservation Education",
                  description: "Learn about elephant rescue and rehabilitation efforts"
                },
                {
                  icon: Shield,
                  title: "Safe Family Environment",
                  description: "Well-organized facility with safety barriers and clear pathways"
                },
                {
                  icon: Calendar,
                  title: "Predictable Schedule",
                  description: "Fixed feeding and bathing times make planning easy"
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
                      <feature.icon className="w-12 h-12 text-blue-600 mb-4" />
                      <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                      <p className="text-gray-600">{feature.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Daily Schedule */}
        <section id="schedule" className="py-16 px-4 bg-gray-50">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-4xl font-bold mb-4">Daily Elephant Schedule</h2>
              <p className="text-lg text-gray-600">Plan your visit around these exciting activities</p>
            </motion.div>

            <div className="space-y-4">
              {dailySchedule.map((schedule, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="overflow-hidden">
                    <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-xl flex items-center gap-3">
                          <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                            {schedule.time}
                          </div>
                          {schedule.activity}
                        </CardTitle>
                        <Badge variant="outline">
                          <Clock className="w-3 h-3 mr-1" />
                          {schedule.duration}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-6">
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <h4 className="font-semibold mb-2 flex items-center gap-2">
                            <Star className="w-4 h-4 text-blue-600" />
                            Highlight
                          </h4>
                          <p className="text-gray-600">{schedule.highlight}</p>
                        </div>
                        <div>
                          <h4 className="font-semibold mb-2 flex items-center gap-2">
                            <Baby className="w-4 h-4 text-pink-600" />
                            Kids Love This Because
                          </h4>
                          <p className="text-gray-600">{schedule.kidsFactor}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            <Alert className="mt-8">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <strong>Pro Tip:</strong> The 10 AM river bathing is the most spectacular event. Arrive by 9:30 AM to secure good viewing spots along the riverbank!
              </AlertDescription>
            </Alert>
          </div>
        </section>

        {/* Educational Value */}
        <section className="py-16 px-4 bg-white">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-4xl font-bold mb-4">Educational Experience</h2>
              <p className="text-lg text-gray-600">What your family will learn at Pinnawala</p>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-6">
              {educationalHighlights.map((item, index) => (
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
                        <Award className="w-5 h-5 text-blue-600" />
                        {item.topic}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <p className="text-gray-600">{item.description}</p>
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <p className="text-sm font-semibold text-blue-900 mb-1">Kids Learn:</p>
                        <p className="text-sm text-blue-800">{item.kidLesson}</p>
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
              <h2 className="text-4xl font-bold mb-4">Age-Specific Guide</h2>
              <p className="text-lg text-gray-600">Tailored recommendations for different age groups</p>
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
                      <CardTitle className="flex items-center justify-between">
                        <span className="flex items-center gap-2">
                          <Users className="w-5 h-5 text-blue-600" />
                          {age.ageGroup}
                        </span>
                      </CardTitle>
                      <p className="text-gray-600 mt-2">{age.recommendation}</p>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <h4 className="font-semibold mb-2">Tips for this age:</h4>
                        <ul className="space-y-1">
                          {age.tips.map((tip, idx) => (
                            <li key={idx} className="flex items-start gap-2 text-sm">
                              <CheckCircle className="w-4 h-4 text-green-600 mt-0.5" />
                              <span className="text-gray-600">{tip}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="bg-blue-50 p-3 rounded-lg">
                        <p className="text-sm">
                          <strong>Best time to visit:</strong> {age.bestTime}
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
              <h2 className="text-4xl font-bold mb-4">Family Visit Packages</h2>
              <p className="text-lg text-gray-600">Choose the perfect experience for your family</p>
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
                        <span className="text-3xl font-bold text-blue-600">{pkg.price}</span>
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
                              <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                                <div className="w-2 h-2 bg-blue-600 rounded-full" />
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

        {/* Visitor Tips */}
        <section className="py-16 px-4 bg-gray-50">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-4xl font-bold mb-4">Essential Visitor Tips</h2>
              <p className="text-lg text-gray-600">Make the most of your Pinnawala visit</p>
            </motion.div>

            <Tabs defaultValue="best-practices" className="space-y-8">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="best-practices">Best Practices</TabsTrigger>
                <TabsTrigger value="what-to-bring">What to Bring</TabsTrigger>
                <TabsTrigger value="photo-tips">Photo Tips</TabsTrigger>
              </TabsList>

              {Object.entries(visitorTips).map(([key, tips]) => (
                <TabsContent 
                  key={key} 
                  value={key.toLowerCase().replace(' ', '-')}
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
                            <CheckCircle className="w-5 h-5 text-blue-600 mt-0.5" />
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
              <p className="text-lg text-gray-600">Everything you need to know about visiting Pinnawala</p>
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
        <section className="py-20 px-4 bg-gradient-to-br from-blue-600 to-indigo-700 text-white">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl font-bold mb-6">
                Ready to Meet the Elephants?
              </h2>
              <p className="text-xl mb-8 text-blue-100">
                Create unforgettable memories with gentle giants at Pinnawala
              </p>
              <div className="flex gap-4 justify-center flex-wrap">
                <Button 
                  size="lg" 
                  variant="secondary"
                  onClick={() => handleBookPackage("Full Day Experience")}
                >
                  <Heart className="w-5 h-5 mr-2" />
                  Book Family Visit
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
        itemTitle={selectedPackage || "Full Day Experience"}
      />
    </>
  );
};

export default PinnawalaFamilyExperience;