import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { motion } from 'framer-motion';
import { 
  TreePine, 
  Users, 
  Clock, 
  MapPin, 
  Camera, 
  Heart, 
  Star, 
  Binoculars,
  Sunrise,
  AlertTriangle,
  CheckCircle,
  Baby,
  Shield,
  Award,
  Sparkles,
  Info,
  Car,
  Sun,
  Coffee
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Alert, AlertDescription } from '@/components/ui/alert';
import EnhancedBookingModal from '@/components/EnhancedBookingModal';

const UdawalaweElephantSafari = () => {
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState('');
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const heroImages = [
    {
      url: "https://images.unsplash.com/photo-1564760055775-d63b17a55c44?auto=format&fit=crop&q=80",
      caption: "Wild elephants in their natural habitat at Udawalawe"
    },
    {
      url: "https://images.unsplash.com/photo-1585970480901-90d6bb2a48b5?auto=format&fit=crop&q=80",
      caption: "Family watching elephant herd at the reservoir"
    },
    {
      url: "https://images.unsplash.com/photo-1589656966895-2f33e7653819?auto=format&fit=crop&q=80",
      caption: "Close encounter with baby elephants"
    }
  ];

  const wildlifeToSpot = [
    {
      animal: "Asian Elephants",
      bestTime: "Early morning & late afternoon",
      likelihood: "Almost guaranteed",
      familyFact: "Baby elephants are especially playful in the morning!"
    },
    {
      animal: "Water Buffalo",
      bestTime: "Throughout the day",
      likelihood: "Very likely",
      familyFact: "Often seen cooling off in mud pools"
    },
    {
      animal: "Crocodiles",
      bestTime: "Midday near water",
      likelihood: "Common",
      familyFact: "Safely viewed from vehicle - kids love spotting them!"
    },
    {
      animal: "Peacocks",
      bestTime: "Morning and evening",
      likelihood: "Common",
      familyFact: "Males display their beautiful feathers to impress"
    },
    {
      animal: "Eagles & Birds",
      bestTime: "Throughout the day",
      likelihood: "Very common",
      familyFact: "Over 180 bird species - bring binoculars!"
    },
    {
      animal: "Monitor Lizards",
      bestTime: "Sunny spots",
      likelihood: "Common",
      familyFact: "Can grow up to 2 meters - impressive to see!"
    }
  ];

  const familyPackages = [
    {
      title: "Morning Family Safari",
      price: "$35",
      priceUnit: "per adult",
      childPrice: "$20 per child (4-12 years)",
      duration: "3-4 hours",
      includes: [
        "Hotel pickup at 5:30 AM",
        "Park entrance fees",
        "4x4 safari jeep with roof",
        "Expert wildlife guide",
        "Binoculars for kids",
        "Light breakfast pack",
        "Unlimited photo stops"
      ],
      highlights: ["Best elephant sightings", "Cooler weather", "Active wildlife"]
    },
    {
      title: "Full Day Adventure",
      price: "$65",
      priceUnit: "per adult",
      childPrice: "$35 per child",
      duration: "6-7 hours",
      includes: [
        "Two safari sessions",
        "Visit to Elephant Transit Home",
        "Picnic lunch in the park",
        "Professional photographer guide",
        "Kids' wildlife activity book",
        "Refreshments throughout",
        "Certificate of safari completion"
      ],
      highlights: ["Complete experience", "Baby elephant feeding time", "Photography guidance"]
    },
    {
      title: "Sunset Special",
      price: "$40",
      priceUnit: "per adult",
      childPrice: "$22 per child",
      duration: "3-4 hours",
      includes: [
        "Afternoon pickup (2:30 PM)",
        "Golden hour photography",
        "Evening snacks and drinks",
        "Wildlife tracking game",
        "Sunset viewing spot",
        "Night safari experience"
      ],
      highlights: ["Magical lighting", "Active elephants", "Cooler evening breeze"]
    }
  ];

  const safariTips = {
    "What to Bring": [
      "Sun hats and sunscreen (essential!)",
      "Lightweight, neutral-colored clothing",
      "Camera with zoom lens",
      "Binoculars (or rent from us)",
      "Water bottles (refillable)",
      "Light snacks for kids",
      "Insect repellent",
      "Small towel for dust"
    ],
    "Photography Tips": [
      "Bring extra batteries and memory cards",
      "Use burst mode for action shots",
      "Keep camera ready at all times",
      "Respect animals - no flash photography",
      "Let kids use disposable cameras",
      "Best light is early morning/late afternoon"
    ],
    "Safari Etiquette": [
      "Stay seated in the vehicle at all times",
      "Keep voices low near animals",
      "Follow guide's instructions immediately",
      "No feeding or touching wildlife",
      "Take all litter with you",
      "Respect animal's space and behavior"
    ]
  };

  const ageRecommendations = [
    {
      ageGroup: "2-5 years",
      recommendation: "Perfect introduction to wildlife",
      tips: ["Morning safaris are best", "Bring favorite snacks", "Nap time consideration"],
      safetyNote: "Must be held securely by adult"
    },
    {
      ageGroup: "6-10 years",
      recommendation: "Ideal age for maximum enjoyment",
      tips: ["Give them binoculars", "Wildlife checklist game", "Let them ask questions"],
      safetyNote: "Can sit independently with seatbelt"
    },
    {
      ageGroup: "11-15 years",
      recommendation: "Great for photography interest",
      tips: ["Teach photography basics", "Wildlife behavior discussions", "Conservation education"],
      safetyNote: "Can help spot animals for younger siblings"
    },
    {
      ageGroup: "All ages",
      recommendation: "Multi-generational adventure",
      tips: ["Everyone finds something to enjoy", "Shared family memories", "Suitable for grandparents too"],
      safetyNote: "Comfortable seating for all ages"
    }
  ];

  const faqs = [
    {
      question: "Is it safe for young children?",
      answer: "Absolutely! All safaris are conducted in secure 4x4 vehicles with experienced guides. Children must remain seated and supervised. The vehicles maintain safe distances from all wildlife."
    },
    {
      question: "What if we don't see elephants?",
      answer: "Udawalawe has one of the highest elephant densities in Sri Lanka. Sightings are almost guaranteed, especially during morning safaris. Our guides know the best spots and elephant movement patterns."
    },
    {
      question: "How bumpy is the ride?",
      answer: "The main tracks are well-maintained, but expect some bumpy sections. It's part of the adventure! Vehicles have good suspension. If you have back problems or are pregnant, inform your guide."
    },
    {
      question: "Can we get out of the vehicle?",
      answer: "For safety reasons, visitors must remain in the vehicle throughout the safari, except at designated safe zones like the visitor center or viewing platforms."
    },
    {
      question: "What about bathroom breaks for kids?",
      answer: "There are clean facilities at the park entrance and visitor center. Safaris include a comfort stop. For emergencies, guides know safe stopping points."
    },
    {
      question: "Is food provided?",
      answer: "Breakfast/snack packs are included in our packages. Bring extra snacks for kids. No single-use plastics allowed in the park - we provide reusable containers."
    }
  ];

  const handleBookPackage = (packageTitle: string) => {
    setSelectedPackage(packageTitle);
    setIsBookingOpen(true);
  };

  return (
    <>
      <Helmet>
        <title>Udawalawe Elephant Safari for Families | Wild Adventure | Recharge Travels</title>
        <meta name="description" content="Experience an unforgettable family safari in Udawalawe National Park. See wild elephants up close in a safe, educational adventure perfect for all ages." />
        <meta name="keywords" content="Udawalawe safari, elephant watching, family safari Sri Lanka, wildlife tour, kids safari" />
        <meta property="og:title" content="Udawalawe Elephant Safari - Family Wildlife Adventure" />
        <meta property="og:description" content="Join a family-friendly safari to see wild elephants and exotic wildlife in Udawalawe National Park. Safe, exciting, and educational for all ages." />
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
                <TreePine className="w-4 h-4 mr-1" />
                Wildlife Safari
              </Badge>
              <h1 className="text-5xl md:text-6xl font-bold mb-6">
                Udawalawe Elephant Safari Adventure
              </h1>
              <p className="text-xl mb-8 text-gray-100">
                Get up close with wild elephants in their natural habitat - a thrilling and safe experience for the whole family
              </p>
              <div className="flex gap-4 justify-center">
                <Button 
                  size="lg" 
                  onClick={() => handleBookPackage("Morning Family Safari")}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <Binoculars className="w-5 h-5 mr-2" />
                  Book Family Safari
                </Button>
                <Button 
                  size="lg" 
                  variant="outline"
                  className="bg-white/10 backdrop-blur-sm text-white border-white/30 hover:bg-white/20"
                  onClick={() => document.getElementById('wildlife')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  View Wildlife Guide
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

        {/* Why Udawalawe for Families */}
        <section className="py-16 px-4 bg-white">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-4xl font-bold mb-4">Why Udawalawe is Perfect for Family Safaris</h2>
              <p className="text-lg text-gray-600">The best place in Sri Lanka to see wild elephants with children</p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-6">
              {[
                {
                  icon: Award,
                  title: "Guaranteed Elephant Sightings",
                  description: "Home to over 400 elephants with the highest viewing success rate in Sri Lanka"
                },
                {
                  icon: Shield,
                  title: "Safe Safari Experience",
                  description: "Well-maintained vehicles, experienced guides, and established safety protocols"
                },
                {
                  icon: Sunrise,
                  title: "Short Safari Duration",
                  description: "3-4 hour safaris perfect for children's attention spans and comfort"
                },
                {
                  icon: Camera,
                  title: "Incredible Photo Opportunities",
                  description: "Open landscapes make it easy to spot and photograph wildlife"
                },
                {
                  icon: Heart,
                  title: "Educational Experience",
                  description: "Learn about elephant behavior, conservation, and ecosystem"
                },
                {
                  icon: Sparkles,
                  title: "Baby Elephant Encounters",
                  description: "Frequently see playful baby elephants with their families"
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

        {/* Wildlife Guide */}
        <section id="wildlife" className="py-16 px-4 bg-gray-50">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-4xl font-bold mb-4">Wildlife You'll Encounter</h2>
              <p className="text-lg text-gray-600">A guide to the amazing animals your family will see</p>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-6">
              {wildlifeToSpot.map((wildlife, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="overflow-hidden hover:shadow-lg transition-shadow">
                    <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50">
                      <CardTitle className="flex items-center justify-between">
                        <span className="text-xl">{wildlife.animal}</span>
                        <Badge variant="secondary">{wildlife.likelihood}</Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-6">
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-green-600" />
                          <span className="text-sm font-medium">Best viewing time:</span>
                          <span className="text-sm text-gray-600">{wildlife.bestTime}</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <Baby className="w-4 h-4 text-blue-600 mt-0.5" />
                          <div>
                            <span className="text-sm font-medium">Fun fact for kids:</span>
                            <p className="text-sm text-gray-600">{wildlife.familyFact}</p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            <Alert className="mt-8">
              <Camera className="h-4 w-4" />
              <AlertDescription>
                <strong>Photography Tip:</strong> The open grasslands of Udawalawe provide excellent visibility and photography opportunities. Morning light (6-8 AM) creates magical golden hour shots!
              </AlertDescription>
            </Alert>
          </div>
        </section>

        {/* Age Recommendations */}
        <section className="py-16 px-4 bg-white">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-4xl font-bold mb-4">Safari Suitability by Age</h2>
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
                      <CardTitle className="flex items-center gap-2">
                        <Users className="w-5 h-5 text-green-600" />
                        {age.ageGroup}
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
                      <div className="bg-amber-50 p-3 rounded-lg">
                        <p className="text-sm flex items-start gap-2">
                          <Shield className="w-4 h-4 text-amber-600 mt-0.5" />
                          <span className="text-amber-800">{age.safetyNote}</span>
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Safari Packages */}
        <section className="py-16 px-4 bg-gray-50">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-4xl font-bold mb-4">Family Safari Packages</h2>
              <p className="text-lg text-gray-600">Choose the perfect wildlife adventure for your family</p>
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
                        Book This Safari
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Safari Tips */}
        <section className="py-16 px-4 bg-white">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-4xl font-bold mb-4">Essential Safari Tips</h2>
              <p className="text-lg text-gray-600">Everything you need to know for a perfect safari experience</p>
            </motion.div>

            <Tabs defaultValue="what-to-bring" className="space-y-8">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="what-to-bring">What to Bring</TabsTrigger>
                <TabsTrigger value="photography-tips">Photography</TabsTrigger>
                <TabsTrigger value="safari-etiquette">Safari Etiquette</TabsTrigger>
              </TabsList>

              {Object.entries(safariTips).map(([key, tips]) => (
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
                            <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
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
        <section className="py-16 px-4 bg-gray-50">
          <div className="max-w-3xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-4xl font-bold mb-4">Frequently Asked Questions</h2>
              <p className="text-lg text-gray-600">Common questions about family safaris at Udawalawe</p>
            </motion.div>

            <Accordion type="single" collapsible className="space-y-4">
              {faqs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`} className="border rounded-lg px-6 bg-white">
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
        <section className="py-20 px-4 bg-gradient-to-br from-green-600 to-emerald-700 text-white">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl font-bold mb-6">
                Ready for Your Wildlife Adventure?
              </h2>
              <p className="text-xl mb-8 text-green-100">
                Create magical memories with elephants and wildlife in their natural habitat
              </p>
              <div className="flex gap-4 justify-center flex-wrap">
                <Button 
                  size="lg" 
                  variant="secondary"
                  onClick={() => handleBookPackage("Morning Family Safari")}
                >
                  <Binoculars className="w-5 h-5 mr-2" />
                  Book Family Safari
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
        itemTitle={selectedPackage || "Morning Family Safari"}
      />
    </>
  );
};

export default UdawalaweElephantSafari;