import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { motion } from 'framer-motion';
import { 
  Bike, 
  Users, 
  Clock, 
  MapPin, 
  Camera, 
  Heart, 
  Star, 
  TreePine,
  Sunrise,
  AlertTriangle,
  CheckCircle,
  Baby,
  Map,
  Sparkles,
  Shield,
  Award,
  Sun,
  Info,
  Compass
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Alert, AlertDescription } from '@/components/ui/alert';
import EnhancedBookingModal from '@/components/EnhancedBookingModal';

const PolonnaruwaFamilyCycling = () => {
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState('');
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const heroImages = [
    {
      url: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&q=80",
      caption: "Family cycling among ancient ruins"
    },
    {
      url: "https://images.unsplash.com/photo-1544191696-102dbdaeeaa0?auto=format&fit=crop&q=80",
      caption: "Kids on bikes exploring temples"
    },
    {
      url: "https://images.unsplash.com/photo-1545558014-8692077e9b5c?auto=format&fit=crop&q=80",
      caption: "Cycling through historical pathways"
    }
  ];

  const cyclingRoutes = [
    {
      name: "Royal Palace Circuit",
      distance: "3 km",
      duration: "1.5 hours",
      difficulty: "Easy",
      highlights: ["Royal Palace ruins", "Audience Hall", "Bathing Pool", "Council Chamber"],
      kidsSuitability: "Perfect for beginners"
    },
    {
      name: "Sacred Quadrangle Tour",
      distance: "2 km",
      duration: "1 hour",
      difficulty: "Easy",
      highlights: ["Vatadage", "Hatadage", "Gal Potha", "Satmahal Prasada"],
      kidsSuitability: "Short and fascinating"
    },
    {
      name: "Northern Monuments Route",
      distance: "5 km",
      duration: "2.5 hours",
      difficulty: "Moderate",
      highlights: ["Rankot Vihara", "Alahana Pirivena", "Kiri Vihara", "Lankatilaka"],
      kidsSuitability: "Good for active kids"
    },
    {
      name: "Complete Ancient City Tour",
      distance: "8 km",
      duration: "4 hours",
      difficulty: "Moderate",
      highlights: ["All major sites", "Parakrama Samudra", "Statue of King", "Museum"],
      kidsSuitability: "For experienced young cyclists"
    }
  ];

  const bikeOptions = [
    {
      type: "Kids' Bikes",
      sizes: "12-24 inch wheels",
      features: ["Adjustable seats", "Training wheels available", "Colorful designs", "Safety bells"],
      age: "3-10 years"
    },
    {
      type: "Teen Bikes",
      sizes: "26 inch wheels",
      features: ["Geared options", "Hand brakes", "Comfortable seats", "Water bottle holders"],
      age: "11-16 years"
    },
    {
      type: "Family Tandems",
      sizes: "Adult + Child",
      features: ["Parent controls steering", "Child can pedal along", "Extra stable", "Fun bonding experience"],
      age: "5+ years with adult"
    },
    {
      type: "Child Seats/Trailers",
      sizes: "For toddlers",
      features: ["Secure harnesses", "Sun protection", "Storage space", "Smooth ride"],
      age: "1-4 years"
    }
  ];

  const familyPackages = [
    {
      title: "Family Cycling Explorer",
      price: "$35",
      priceUnit: "per adult",
      childPrice: "$15 per child",
      duration: "Half Day",
      includes: [
        "Quality bikes for all ages",
        "Safety helmets and gear",
        "Expert guide",
        "Water and snacks",
        "Entrance tickets"
      ],
      highlights: ["Flexible pace", "Photo stops", "Kid-friendly route"]
    },
    {
      title: "Adventure & Picnic Package",
      price: "$55",
      priceUnit: "per adult",
      childPrice: "$25 per child",
      duration: "Full Day",
      includes: [
        "Premium bikes",
        "Complete safety kit",
        "Guided tour",
        "Picnic lunch by the lake",
        "Support vehicle"
      ],
      highlights: ["Lakeside picnic", "Extended exploration", "Emergency support"]
    }
  ];

  const safetyCyclingTips = [
    {
      category: "Before You Start",
      tips: [
        "Check bike sizes - feet should touch ground",
        "Adjust seats for comfortable reach",
        "Test brakes with kids",
        "Apply sunscreen generously"
      ]
    },
    {
      category: "During the Ride",
      tips: [
        "Stay together as a group",
        "Adults lead and sweep",
        "Regular water breaks",
        "Use hand signals"
      ]
    },
    {
      category: "Safety Rules",
      tips: [
        "Helmets mandatory for all",
        "Single file on narrow paths",
        "Dismount at crowded areas",
        "Respect archaeological sites"
      ]
    },
    {
      category: "Emergency Prep",
      tips: [
        "Carry first-aid basics",
        "Know nearest rest points",
        "Have guide's contact",
        "Identify support vehicle location"
      ]
    }
  ];

  const mustSeeStops = [
    {
      site: "Gal Vihara",
      description: "Giant Buddha statues carved from granite",
      whyKidsLove: "Impressive size and perfect photo opportunity",
      cyclingTip: "Park bikes at designated area and walk"
    },
    {
      site: "Royal Palace",
      description: "7-story palace ruins with massive walls",
      whyKidsLove: "Like exploring a real castle",
      cyclingTip: "Wide paths suitable for all skill levels"
    },
    {
      site: "Lotus Pond",
      description: "Ancient stepped bathing pool shaped like a lotus",
      whyKidsLove: "Unique design and great for imagination",
      cyclingTip: "Perfect rest stop with shaded areas"
    },
    {
      site: "Monkey Kingdom",
      description: "Areas with friendly toque macaque monkeys",
      whyKidsLove: "Wildlife watching opportunities",
      cyclingTip: "Keep snacks secured in bags"
    }
  ];

  const faqs = [
    {
      question: "Can young children who just learned to ride join?",
      answer: "Yes! We have routes suitable for beginners. The Royal Palace Circuit is mostly flat with wide paths. Training wheels are available for those still building confidence."
    },
    {
      question: "What if my child gets tired mid-way?",
      answer: "Our support vehicle follows the group and can transport tired children. We also have strategic rest stops with shaded areas. Parent-child tandems are another great option."
    },
    {
      question: "Are the bikes well-maintained and safe?",
      answer: "Absolutely. All bikes are regularly serviced with working brakes and proper tire pressure. Child bikes have additional safety features like chain guards and cushioned handlebars."
    },
    {
      question: "How hot does it get while cycling?",
      answer: "Morning rides (7-10 AM) are coolest. Afternoon rides can be warm but manageable with regular breaks. We provide water and recommend light, breathable clothing."
    },
    {
      question: "Can we explore at our own pace?",
      answer: "Yes! While we have suggested routes, families can take breaks whenever needed. Our guides adapt to your family's pace and interests."
    }
  ];

  const handleBookPackage = (packageTitle: string) => {
    setSelectedPackage(packageTitle);
    setIsBookingOpen(true);
  };

  return (
    <>
      <Helmet>
        <title>Polonnaruwa Family Cycling Tour - Ancient City Adventure | Recharge Travels</title>
        <meta name="description" content="Explore the ancient city of Polonnaruwa by bike. Family-friendly cycling through Sri Lanka's historical ruins and sacred sites." />
        <meta name="keywords" content="Polonnaruwa cycling, ancient city bike tour, family cycling Sri Lanka" />
        <meta property="og:title" content="Family Cycling Adventure in Polonnaruwa" />
        <meta property="og:description" content="Pedal through history! Family-friendly cycling tours exploring ancient Polonnaruwa's temples, palaces, and monuments." />
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
              <Badge className="mb-4 bg-green-600/90 text-white px-4 py-1">
                <Bike className="w-4 h-4 mr-1" />
                Family Cycling Adventure
              </Badge>
              <h1 className="text-5xl md:text-6xl font-bold mb-6">
                Cycle Through Ancient Polonnaruwa
              </h1>
              <p className="text-xl mb-8 text-gray-100">
                A fun family bike ride through 1000-year-old ruins, perfect for kids and history lovers alike
              </p>
              <div className="flex gap-4 justify-center">
                <Button 
                  size="lg" 
                  onClick={() => handleBookPackage("Family Cycling Explorer")}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <Bike className="w-5 h-5 mr-2" />
                  Book Cycling Tour
                </Button>
                <Button 
                  size="lg" 
                  variant="outline"
                  className="bg-white/10 backdrop-blur-sm text-white border-white/30 hover:bg-white/20"
                  onClick={() => document.getElementById('routes')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  View Routes
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

        {/* Why Cycling in Polonnaruwa */}
        <section className="py-16 px-4 bg-white">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-4xl font-bold mb-4">Why Families Love Cycling in Polonnaruwa</h2>
              <p className="text-lg text-gray-600">The perfect blend of adventure, education, and family fun</p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-6">
              {[
                {
                  icon: TreePine,
                  title: "Flat, Safe Paths",
                  description: "Well-maintained cycling paths through the archaeological park, perfect for all skill levels"
                },
                {
                  icon: Map,
                  title: "Compact Ancient City",
                  description: "All major sites within easy cycling distance, making it ideal for family exploration"
                },
                {
                  icon: Sun,
                  title: "Shaded Routes",
                  description: "Many paths have tree cover, providing natural shade during your ride"
                },
                {
                  icon: Camera,
                  title: "Photo Opportunities",
                  description: "Stop anywhere for family photos with ancient ruins as stunning backdrops"
                },
                {
                  icon: Sparkles,
                  title: "Interactive Learning",
                  description: "Kids learn history through active exploration rather than passive viewing"
                },
                {
                  icon: Heart,
                  title: "Family Bonding",
                  description: "Create memories cycling together through a UNESCO World Heritage site"
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
                      <feature.icon className="w-12 h-12 text-green-600 mb-4" />
                      <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                      <p className="text-gray-600">{feature.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Cycling Routes */}
        <section id="routes" className="py-16 px-4 bg-gray-50">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-4xl font-bold mb-4">Family-Friendly Cycling Routes</h2>
              <p className="text-lg text-gray-600">Choose the perfect route for your family's cycling adventure</p>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-6">
              {cyclingRoutes.map((route, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="h-full hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-center justify-between mb-2">
                        <CardTitle className="text-xl">{route.name}</CardTitle>
                        <Badge variant={route.difficulty === "Easy" ? "secondary" : "default"}>
                          {route.difficulty}
                        </Badge>
                      </div>
                      <div className="flex gap-4 text-sm text-gray-600">
                        <span className="flex items-center gap-1">
                          <Compass className="w-4 h-4" />
                          {route.distance}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {route.duration}
                        </span>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <h4 className="font-semibold mb-2">Route Highlights:</h4>
                        <ul className="space-y-1">
                          {route.highlights.map((highlight, idx) => (
                            <li key={idx} className="flex items-center gap-2 text-sm text-gray-600">
                              <div className="w-1.5 h-1.5 bg-green-600 rounded-full" />
                              {highlight}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="pt-2 border-t">
                        <p className="text-sm text-gray-600">
                          <span className="font-semibold">Kids Suitability:</span> {route.kidsSuitability}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Bike Options */}
        <section className="py-16 px-4 bg-white">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-4xl font-bold mb-4">Bikes for Every Family Member</h2>
              <p className="text-lg text-gray-600">Quality bikes and safety equipment for all ages</p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {bikeOptions.map((bike, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="h-full">
                    <CardHeader>
                      <CardTitle className="text-lg">{bike.type}</CardTitle>
                      <Badge variant="outline">{bike.age}</Badge>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-600 mb-3">{bike.sizes}</p>
                      <h4 className="font-semibold mb-2 text-sm">Features:</h4>
                      <ul className="space-y-1">
                        {bike.features.map((feature, idx) => (
                          <li key={idx} className="text-sm text-gray-600 flex items-center gap-2">
                            <CheckCircle className="w-3 h-3 text-green-600" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Must-See Stops */}
        <section className="py-16 px-4 bg-gray-50">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-4xl font-bold mb-4">Must-See Stops for Families</h2>
              <p className="text-lg text-gray-600">Don't miss these kid-friendly highlights</p>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-6">
              {mustSeeStops.map((stop, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="h-full">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <MapPin className="w-5 h-5 text-green-600" />
                        {stop.site}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <p className="text-gray-600">{stop.description}</p>
                      <div className="bg-blue-50 p-3 rounded-lg">
                        <h4 className="font-semibold text-sm mb-1 flex items-center gap-2">
                          <Heart className="w-4 h-4 text-blue-600" />
                          Why Kids Love It
                        </h4>
                        <p className="text-sm text-gray-600">{stop.whyKidsLove}</p>
                      </div>
                      <div className="bg-green-50 p-3 rounded-lg">
                        <h4 className="font-semibold text-sm mb-1 flex items-center gap-2">
                          <Bike className="w-4 h-4 text-green-600" />
                          Cycling Tip
                        </h4>
                        <p className="text-sm text-gray-600">{stop.cyclingTip}</p>
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
              <h2 className="text-4xl font-bold mb-4">Family Cycling Packages</h2>
              <p className="text-lg text-gray-600">Complete packages designed for family fun and safety</p>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-8">
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
                        <span className="text-3xl font-bold text-green-600">{pkg.price}</span>
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
                              <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                                <div className="w-2 h-2 bg-green-600 rounded-full" />
                              </div>
                              <span className="text-gray-600">{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-2">Package Highlights:</h4>
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

        {/* Safety Tips */}
        <section className="py-16 px-4 bg-gray-50">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-4xl font-bold mb-4">Safety First: Family Cycling Tips</h2>
              <p className="text-lg text-gray-600">Ensuring a safe and enjoyable experience for everyone</p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {safetyCyclingTips.map((category, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="h-full">
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        {category.category === "Before You Start" && <Shield className="w-5 h-5 text-blue-600" />}
                        {category.category === "During the Ride" && <Bike className="w-5 h-5 text-green-600" />}
                        {category.category === "Safety Rules" && <AlertTriangle className="w-5 h-5 text-orange-600" />}
                        {category.category === "Emergency Prep" && <Heart className="w-5 h-5 text-red-600" />}
                        {category.category}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {category.tips.map((tip, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-sm">
                            <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-1.5" />
                            <span className="text-gray-600">{tip}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            <Alert className="mt-8">
              <Info className="h-4 w-4" />
              <AlertDescription>
                <strong>Pro Tip:</strong> Start with the shorter routes to gauge your family's comfort level. You can always extend your ride if everyone is enjoying it!
              </AlertDescription>
            </Alert>
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
              <p className="text-lg text-gray-600">Everything you need to know about family cycling in Polonnaruwa</p>
            </motion.div>

            <Accordion type="single" collapsible className="space-y-4">
              {faqs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`} className="border rounded-lg px-6">
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
        <section className="py-20 px-4 bg-gradient-to-br from-green-600 to-green-800 text-white">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl font-bold mb-6">
                Ready to Pedal Through History?
              </h2>
              <p className="text-xl mb-8 text-green-100">
                Give your family an active adventure through ancient ruins they'll never forget
              </p>
              <div className="flex gap-4 justify-center flex-wrap">
                <Button 
                  size="lg" 
                  variant="secondary"
                  onClick={() => handleBookPackage("Family Cycling Explorer")}
                >
                  <Bike className="w-5 h-5 mr-2" />
                  Book Cycling Adventure
                </Button>
                <Button 
                  size="lg" 
                  variant="outline"
                  className="bg-transparent text-white border-white hover:bg-white/10"
                >
                  <Map className="w-5 h-5 mr-2" />
                  Download Route Map
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
        itemTitle={selectedPackage || "Family Cycling Explorer"}
      />
    </>
  );
};

export default PolonnaruwaFamilyCycling;