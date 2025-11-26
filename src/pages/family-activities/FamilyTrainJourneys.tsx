import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { motion } from 'framer-motion';
import { 
  Train, 
  MapPin, 
  Clock, 
  Users, 
  Baby, 
  Calendar, 
  Star, 
  Camera,
  Mountain,
  TreePine,
  Sunrise,
  Heart,
  Info,
  AlertTriangle,
  Sparkles,
  Coffee,
  Package
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import EnhancedBookingModal from '@/components/EnhancedBookingModal';

const FamilyTrainJourneys = () => {
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState('');
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const heroImages = [
    {
      url: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&q=80",
      caption: "Blue train winding through tea plantations"
    },
    {
      url: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80",
      caption: "Kids enjoying scenic train views"
    },
    {
      url: "https://images.unsplash.com/photo-1601999109686-3d10cdb5f04e?auto=format&fit=crop&q=80",
      caption: "Family adventure on Sri Lankan railways"
    }
  ];

  const trainRoutes = [
    {
      name: "Kandy to Ella",
      duration: "7 hours",
      highlights: ["Nine Arch Bridge", "Tea plantations", "Waterfalls", "Mountain views"],
      childFriendly: "Highly recommended",
      bestSeats: "Right side for best views"
    },
    {
      name: "Colombo to Kandy",
      duration: "3 hours",
      highlights: ["River views", "Historic stations", "Jungle scenery", "Temple views"],
      childFriendly: "Perfect for young kids",
      bestSeats: "Window seats on either side"
    },
    {
      name: "Ella to Badulla",
      duration: "2 hours",
      highlights: ["Demodara Loop", "Rural villages", "Tea estates", "Mountain tunnels"],
      childFriendly: "Short and scenic",
      bestSeats: "Left side for loop views"
    }
  ];

  const familyPackages = [
    {
      title: "Family Train Adventure",
      price: "$45",
      priceUnit: "per adult",
      childPrice: "$20 per child",
      duration: "Full Day",
      includes: [
        "Reserved family seating",
        "Kid-friendly snacks",
        "Activity booklet for children",
        "Photo stops",
        "Local guide"
      ],
      highlights: ["Family compartment", "Child safety measures", "Entertainment pack"]
    },
    {
      title: "Scenic Rail & Tea Estate",
      price: "$65",
      priceUnit: "per adult", 
      childPrice: "$30 per child",
      duration: "Full Day + Tea Tour",
      includes: [
        "Train journey",
        "Tea factory visit",
        "Family lunch",
        "Tea tasting for adults",
        "Kids' activities at estate"
      ],
      highlights: ["Educational tour", "Hands-on activities", "Family photos"]
    }
  ];

  const kidsTips = [
    {
      category: "Entertainment",
      tips: [
        "Bring coloring books and crayons",
        "Download offline games on tablets",
        "Pack travel-sized board games",
        "Prepare 'I Spy' game lists"
      ]
    },
    {
      category: "Comfort",
      tips: [
        "Bring small pillows for naps",
        "Pack extra clothes",
        "Carry wet wipes and hand sanitizer",
        "Bring favorite blanket or toy"
      ]
    },
    {
      category: "Snacks",
      tips: [
        "Pack variety of healthy snacks",
        "Bring refillable water bottles",
        "Include some local treats",
        "Avoid messy foods"
      ]
    },
    {
      category: "Safety",
      tips: [
        "Keep kids away from open doors",
        "Hold hands when moving between cars",
        "Choose seats away from doors",
        "Bring basic first-aid supplies"
      ]
    }
  ];

  const faqs = [
    {
      question: "Are Sri Lankan trains safe for young children?",
      answer: "Yes, trains are generally safe for children. Choose first or second-class compartments for more space and comfort. Always supervise children, especially near doors and when the train is moving."
    },
    {
      question: "What's the best age for kids to enjoy scenic train rides?",
      answer: "Children aged 4 and above typically enjoy train journeys more as they can appreciate the views and stay engaged longer. However, even toddlers can enjoy shorter routes with proper planning."
    },
    {
      question: "Should we book seats in advance for family travel?",
      answer: "Yes, absolutely! Book first or second-class seats in advance to ensure your family sits together. Reserved seats provide more comfort and security for children."
    },
    {
      question: "What facilities are available for families on trains?",
      answer: "Most long-distance trains have toilets (though basic). First-class has more spacious seating. There's no dedicated changing area, so plan accordingly. Food vendors pass through carriages regularly."
    },
    {
      question: "How can we keep kids entertained during long journeys?",
      answer: "The scenery itself is entertaining! Also bring books, games, tablets with downloaded content, snacks, and activity books. Many kids enjoy taking photos and spotting wildlife or landmarks."
    }
  ];

  const handleBookPackage = (packageTitle: string) => {
    setSelectedPackage(packageTitle);
    setIsBookingOpen(true);
  };

  return (
    <>
      <Helmet>
        <title>Family-Friendly Scenic Train Rides in Sri Lanka | Recharge Travels</title>
        <meta name="description" content="Experience Sri Lanka's famous scenic train journeys — ideal for families and kids. Discover breathtaking views from Kandy to Ella and more." />
        <meta name="keywords" content="Sri Lanka train rides, family train journey, Kandy to Ella, kid-friendly travel Sri Lanka" />
        <meta property="og:title" content="Family Scenic Train Adventures - Sri Lanka" />
        <meta property="og:description" content="Create magical memories on Sri Lanka's scenic railways. Family-friendly train journeys through tea country with activities for kids." />
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
                <Users className="w-4 h-4 mr-1" />
                Family Adventure
              </Badge>
              <h1 className="text-5xl md:text-6xl font-bold mb-6">
                Scenic Train Rides for Families
              </h1>
              <p className="text-xl mb-8 text-gray-100">
                All aboard for Sri Lanka's most spectacular family railway adventure through mountains, tea plantations, and misty valleys
              </p>
              <div className="flex gap-4 justify-center">
                <Button 
                  size="lg" 
                  onClick={() => handleBookPackage("Family Train Adventure")}
                  className="bg-orange-500 hover:bg-orange-600"
                >
                  <Train className="w-5 h-5 mr-2" />
                  Book Family Journey
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

        {/* Why Train Travel with Kids */}
        <section className="py-16 px-4 bg-white">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-4xl font-bold mb-4">Why Kids Love Sri Lankan Train Journeys</h2>
              <p className="text-lg text-gray-600">An adventure that combines fun, education, and unforgettable family moments</p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-6">
              {[
                {
                  icon: Mountain,
                  title: "Spectacular Scenery",
                  description: "Watch your children's eyes light up as trains wind through emerald tea plantations and misty mountains"
                },
                {
                  icon: Train,
                  title: "Adventure & Excitement", 
                  description: "The rhythmic motion, tunnel passages, and bridge crossings create an exciting journey for young minds"
                },
                {
                  icon: Camera,
                  title: "Photo Opportunities",
                  description: "Countless Instagram-worthy moments with the family against stunning backdrops at every turn"
                },
                {
                  icon: Users,
                  title: "Quality Family Time",
                  description: "Disconnect from devices and enjoy conversations while watching the world go by together"
                },
                {
                  icon: Baby,
                  title: "Kid-Friendly Duration",
                  description: "Routes available from 2-7 hours, allowing you to choose based on your children's age and patience"
                },
                {
                  icon: Heart,
                  title: "Cultural Experience",
                  description: "Meet friendly locals, taste railway snacks, and experience authentic Sri Lankan hospitality"
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

        {/* Train Routes */}
        <section id="routes" className="py-16 px-4 bg-gray-50">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-4xl font-bold mb-4">Family-Friendly Train Routes</h2>
              <p className="text-lg text-gray-600">Choose the perfect scenic journey for your family adventure</p>
            </motion.div>

            <Tabs defaultValue="kandy-ella" className="space-y-8">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="kandy-ella">Kandy to Ella</TabsTrigger>
                <TabsTrigger value="colombo-kandy">Colombo to Kandy</TabsTrigger>
                <TabsTrigger value="ella-badulla">Ella to Badulla</TabsTrigger>
              </TabsList>

              {trainRoutes.map((route, index) => (
                <TabsContent 
                  key={index} 
                  value={route.name.toLowerCase().replace(' to ', '-')}
                  className="space-y-6"
                >
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        <span className="flex items-center gap-2">
                          <Train className="w-6 h-6 text-blue-600" />
                          {route.name}
                        </span>
                        <Badge variant="secondary">
                          <Clock className="w-4 h-4 mr-1" />
                          {route.duration}
                        </Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <h4 className="font-semibold mb-3 flex items-center gap-2">
                            <Sparkles className="w-5 h-5 text-yellow-500" />
                            Journey Highlights
                          </h4>
                          <ul className="space-y-2">
                            {route.highlights.map((highlight, idx) => (
                              <li key={idx} className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-blue-600 rounded-full" />
                                {highlight}
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div className="space-y-4">
                          <div>
                            <h4 className="font-semibold mb-2 flex items-center gap-2">
                              <Baby className="w-5 h-5 text-green-600" />
                              Child-Friendly Rating
                            </h4>
                            <p className="text-gray-600">{route.childFriendly}</p>
                          </div>
                          <div>
                            <h4 className="font-semibold mb-2 flex items-center gap-2">
                              <Info className="w-5 h-5 text-blue-600" />
                              Best Seats for Families
                            </h4>
                            <p className="text-gray-600">{route.bestSeats}</p>
                          </div>
                        </div>
                      </div>
                      <Button 
                        className="w-full md:w-auto"
                        onClick={() => handleBookPackage(`${route.name} Family Journey`)}
                      >
                        Book This Route
                      </Button>
                    </CardContent>
                  </Card>
                </TabsContent>
              ))}
            </Tabs>
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
              <h2 className="text-4xl font-bold mb-4">Family Train Packages</h2>
              <p className="text-lg text-gray-600">Specially designed packages for families with children</p>
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
                              <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                                <div className="w-2 h-2 bg-green-600 rounded-full" />
                              </div>
                              <span className="text-gray-600">{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-2">Family Highlights:</h4>
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
                        <Package className="w-4 h-4 mr-2" />
                        Book Package
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Tips for Parents */}
        <section className="py-16 px-4 bg-gray-50">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-4xl font-bold mb-4">Parent's Guide to Train Travel</h2>
              <p className="text-lg text-gray-600">Essential tips for a smooth and enjoyable family train journey</p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {kidsTips.map((category, index) => (
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
                        {category.category === "Entertainment" && <Sparkles className="w-5 h-5 text-purple-600" />}
                        {category.category === "Comfort" && <Heart className="w-5 h-5 text-pink-600" />}
                        {category.category === "Snacks" && <Coffee className="w-5 h-5 text-orange-600" />}
                        {category.category === "Safety" && <AlertTriangle className="w-5 h-5 text-red-600" />}
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
              <p className="text-lg text-gray-600">Everything parents need to know about train travel with kids</p>
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
        <section className="py-20 px-4 bg-gradient-to-br from-blue-600 to-blue-800 text-white">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl font-bold mb-6">
                Ready for a Family Railway Adventure?
              </h2>
              <p className="text-xl mb-8 text-blue-100">
                Create lasting memories as your family journey through Sri Lanka's most beautiful landscapes by train
              </p>
              <div className="flex gap-4 justify-center flex-wrap">
                <Button 
                  size="lg" 
                  variant="secondary"
                  onClick={() => handleBookPackage("Family Train Adventure")}
                >
                  <Train className="w-5 h-5 mr-2" />
                  Book Family Journey
                </Button>
                <Button 
                  size="lg" 
                  variant="outline"
                  className="bg-transparent text-white border-white hover:bg-white/10"
                >
                  <MapPin className="w-5 h-5 mr-2" />
                  View All Routes
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
        itemTitle={selectedPackage || "Family Train Adventure"}
      />
    </>
  );
};

export default FamilyTrainJourneys;