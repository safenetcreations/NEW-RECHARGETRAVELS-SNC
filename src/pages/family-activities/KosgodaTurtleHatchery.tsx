import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { motion } from 'framer-motion';
import { 
  Waves, 
  Users, 
  Clock, 
  MapPin, 
  Camera, 
  Heart, 
  Star, 
  Fish,
  Sunrise,
  AlertTriangle,
  CheckCircle,
  Baby,
  Shield,
  Award,
  Sparkles,
  Info,
  Sun,
  Moon,
  Leaf
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Alert, AlertDescription } from '@/components/ui/alert';
import EnhancedBookingModal from '@/components/EnhancedBookingModal';

const KosgodaTurtleHatchery = () => {
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState('');
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const heroImages = [
    {
      url: "https://images.unsplash.com/photo-1591025207163-942350e47db2?auto=format&fit=crop&q=80",
      caption: "Baby sea turtles making their way to the ocean"
    },
    {
      url: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?auto=format&fit=crop&q=80",
      caption: "Children releasing baby turtles at sunset"
    },
    {
      url: "https://images.unsplash.com/photo-1618477388954-7852f32655ec?auto=format&fit=crop&q=80",
      caption: "Green sea turtle in the conservation pools"
    }
  ];

  const turtleSpecies = [
    {
      name: "Green Sea Turtle",
      localName: "Kaila kasba",
      size: "Up to 1.5m",
      status: "Endangered",
      funFact: "They're not green outside - they get their name from green fat!"
    },
    {
      name: "Hawksbill Turtle",
      localName: "Potu kasba",
      size: "Up to 1m",
      status: "Critically Endangered",
      funFact: "Their beautiful shells were once used to make jewelry"
    },
    {
      name: "Olive Ridley",
      localName: "Dara kasba",
      size: "Up to 70cm",
      status: "Vulnerable",
      funFact: "The smallest sea turtle species in Sri Lanka"
    },
    {
      name: "Loggerhead Turtle",
      localName: "Gal kasba",
      size: "Up to 1.2m",
      status: "Vulnerable",
      funFact: "Has the strongest jaw to crush hard-shelled prey"
    },
    {
      name: "Leatherback Turtle",
      localName: "Yakka kasba",
      size: "Up to 2m",
      status: "Vulnerable",
      funFact: "The largest turtle - can weigh as much as a small car!"
    }
  ];

  const conservationActivities = [
    {
      activity: "Egg Protection",
      description: "See how eggs are collected from beaches and protected",
      kidActivity: "Learn why turtle eggs need human help"
    },
    {
      activity: "Hatchling Care",
      description: "Watch tiny baby turtles in their first days of life",
      kidActivity: "Count baby turtles and learn their names"
    },
    {
      activity: "Turtle Hospital",
      description: "Visit injured turtles being nursed back to health",
      kidActivity: "See how vets help sick turtles"
    },
    {
      activity: "Release Program",
      description: "Participate in releasing baby turtles to the sea",
      kidActivity: "The highlight - help baby turtles reach the ocean!"
    },
    {
      activity: "Touch Tank",
      description: "Safely interact with some turtle species",
      kidActivity: "Gentle touching under supervision"
    },
    {
      activity: "Education Center",
      description: "Interactive displays about turtle conservation",
      kidActivity: "Games and quizzes about turtle facts"
    }
  ];

  const familyPackages = [
    {
      title: "Morning Conservation Tour",
      price: "$20",
      priceUnit: "per adult",
      childPrice: "$10 per child (4-12 years)",
      duration: "2 hours",
      includes: [
        "Guided tour of hatchery",
        "Meet all 5 turtle species",
        "Touch tank experience",
        "Feed the turtles",
        "Conservation talk",
        "Certificate of visit"
      ],
      highlights: ["Educational focus", "Hands-on experience", "Morning feeding time"]
    },
    {
      title: "Sunset Release Experience",
      price: "$35",
      priceUnit: "per adult",
      childPrice: "$18 per child",
      duration: "3 hours",
      includes: [
        "Full hatchery tour",
        "Baby turtle release ceremony",
        "Beach conservation walk",
        "Sunset photography",
        "Refreshments included",
        "Adoption certificate"
      ],
      highlights: ["Magical sunset release", "Photography opportunities", "Memorable experience"]
    },
    {
      title: "Marine Biologist for a Day",
      price: "$60",
      priceUnit: "per adult",
      childPrice: "$30 per child",
      duration: "Half day",
      includes: [
        "Behind-the-scenes access",
        "Help with daily operations",
        "Egg collection demonstration",
        "Turtle health check participation",
        "Lunch with the team",
        "Special conservation kit",
        "Multiple turtle releases"
      ],
      highlights: ["VIP experience", "Educational activities", "Hands-on conservation"]
    }
  ];

  const visitorGuidelines = {
    "Do's": [
      "Listen carefully to guide instructions",
      "Use hand sanitizer before touching",
      "Take photos without flash",
      "Ask questions - guides love curious kids!",
      "Support by buying from gift shop",
      "Spread awareness about conservation"
    ],
    "Don'ts": [
      "Don't pick up turtles without permission",
      "No flash photography near turtles",
      "Don't make loud noises",
      "No plastic items near tanks",
      "Don't feed without supervision",
      "No touching turtle eggs"
    ],
    "What to Bring": [
      "Biodegradable sunscreen",
      "Hat and sunglasses",
      "Camera (no flash)",
      "Water bottle",
      "Comfortable footwear",
      "Light jacket for evening visits"
    ]
  };

  const ageRecommendations = [
    {
      ageGroup: "3-6 years",
      recommendation: "Perfect first wildlife experience",
      tips: ["Short attention span friendly", "Love the baby turtles", "Touch tank is highlight"],
      bestActivity: "Morning tour with touch tank"
    },
    {
      ageGroup: "7-10 years",
      recommendation: "Ideal age for learning",
      tips: ["Very curious about conservation", "Can understand threats to turtles", "Love release ceremony"],
      bestActivity: "Sunset release experience"
    },
    {
      ageGroup: "11-14 years",
      recommendation: "Deep conservation interest",
      tips: ["Appreciate ecological importance", "Good for school projects", "Can help younger kids"],
      bestActivity: "Marine biologist program"
    },
    {
      ageGroup: "All ages",
      recommendation: "Multi-generational appeal",
      tips: ["Something for everyone", "Great family photos", "Shared conservation values"],
      bestActivity: "Any package works well"
    }
  ];

  const faqs = [
    {
      question: "When is the best time to see baby turtle releases?",
      answer: "Baby turtle releases typically happen during sunset (around 5:30-6:30 PM) when it's cooler and safer for the hatchlings. The hatchery schedules releases based on when babies are ready, usually every few days."
    },
    {
      question: "Can children touch the turtles?",
      answer: "Yes, in designated touch tanks with supervision. Children can gently touch certain turtle species that are comfortable with human interaction. Hands must be sanitized first, and guides show the proper way to interact."
    },
    {
      question: "Is the hatchery ethical?",
      answer: "Kosgoda Turtle Hatchery is a registered conservation center that works with the government. They rescue eggs from beaches where they might be eaten or sold, and release all healthy turtles back to the ocean."
    },
    {
      question: "What happens if it rains?",
      answer: "The hatchery has covered areas for most activities. Light rain doesn't affect tours, and baby turtle releases still happen. Heavy rain might postpone releases, but there's plenty to see indoors."
    },
    {
      question: "How long do baby turtles stay at the hatchery?",
      answer: "Baby turtles are kept for only 2-3 days after hatching to gain strength, then released. This gives them a better chance of survival while maintaining their natural instincts."
    },
    {
      question: "Can we adopt a turtle?",
      answer: "Yes! The hatchery offers symbolic adoption programs where you can name a turtle and receive updates. The adoption fee supports conservation efforts."
    }
  ];

  const handleBookPackage = (packageTitle: string) => {
    setSelectedPackage(packageTitle);
    setIsBookingOpen(true);
  };

  return (
    <>
      <Helmet>
        <title>Kosgoda Turtle Hatchery Family Experience | Sea Turtle Conservation | Recharge Travels</title>
        <meta name="description" content="Visit Kosgoda Turtle Hatchery with your family. Release baby turtles, learn about conservation, and create magical memories while helping endangered sea turtles." />
        <meta name="keywords" content="Kosgoda turtle hatchery, sea turtle conservation, family activities Sri Lanka, turtle release, marine conservation" />
        <meta property="og:title" content="Kosgoda Turtle Hatchery - Family Conservation Experience" />
        <meta property="og:description" content="Help save endangered sea turtles! A hands-on conservation experience perfect for families with children of all ages." />
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
              <Badge className="mb-4 bg-cyan-600/90 text-white px-4 py-1">
                <Waves className="w-4 h-4 mr-1" />
                Marine Conservation
              </Badge>
              <h1 className="text-5xl md:text-6xl font-bold mb-6">
                Kosgoda Sea Turtle Conservation
              </h1>
              <p className="text-xl mb-8 text-gray-100">
                Help save endangered sea turtles in a hands-on family experience that makes a real difference
              </p>
              <div className="flex gap-4 justify-center">
                <Button 
                  size="lg" 
                  onClick={() => handleBookPackage("Sunset Release Experience")}
                  className="bg-cyan-600 hover:bg-cyan-700"
                >
                  <Fish className="w-5 h-5 mr-2" />
                  Book Turtle Experience
                </Button>
                <Button 
                  size="lg" 
                  variant="outline"
                  className="bg-white/10 backdrop-blur-sm text-white border-white/30 hover:bg-white/20"
                  onClick={() => document.getElementById('conservation')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  Learn About Turtles
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

        {/* Why Visit Turtle Hatchery */}
        <section className="py-16 px-4 bg-white">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-4xl font-bold mb-4">Why Families Love the Turtle Hatchery</h2>
              <p className="text-lg text-gray-600">A unique blend of education, conservation, and unforgettable experiences</p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-6">
              {[
                {
                  icon: Heart,
                  title: "Save Baby Turtles",
                  description: "Participate in releasing baby turtles and directly contribute to species survival"
                },
                {
                  icon: Baby,
                  title: "Perfect for All Ages",
                  description: "From toddlers to grandparents, everyone finds joy in helping turtles"
                },
                {
                  icon: Award,
                  title: "Educational Adventure",
                  description: "Learn about marine ecosystems and conservation in an engaging way"
                },
                {
                  icon: Camera,
                  title: "Magical Photo Moments",
                  description: "Sunset turtle releases create once-in-a-lifetime photo opportunities"
                },
                {
                  icon: Shield,
                  title: "Safe & Supervised",
                  description: "Expert guides ensure safe interaction for both visitors and turtles"
                },
                {
                  icon: Sparkles,
                  title: "Make a Difference",
                  description: "Your visit directly funds turtle conservation efforts"
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
                      <feature.icon className="w-12 h-12 text-cyan-600 mb-4" />
                      <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                      <p className="text-gray-600">{feature.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Turtle Species */}
        <section className="py-16 px-4 bg-gray-50">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-4xl font-bold mb-4">Meet the Sea Turtles</h2>
              <p className="text-lg text-gray-600">Five amazing species call Sri Lankan waters home</p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {turtleSpecies.map((turtle, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="h-full hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        <span>{turtle.name}</span>
                        <Badge variant={turtle.status === "Critically Endangered" ? "destructive" : "secondary"}>
                          {turtle.status}
                        </Badge>
                      </CardTitle>
                      <p className="text-sm text-gray-600 italic">{turtle.localName}</p>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex items-center gap-2">
                        <Fish className="w-4 h-4 text-cyan-600" />
                        <span className="text-sm font-medium">Size:</span>
                        <span className="text-sm text-gray-600">{turtle.size}</span>
                      </div>
                      <div className="bg-cyan-50 p-3 rounded-lg">
                        <p className="text-sm font-semibold text-cyan-900 mb-1">Fun Fact:</p>
                        <p className="text-sm text-cyan-800">{turtle.funFact}</p>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Conservation Activities */}
        <section id="conservation" className="py-16 px-4 bg-white">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-4xl font-bold mb-4">Conservation Activities</h2>
              <p className="text-lg text-gray-600">Hands-on experiences that educate and inspire</p>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-6">
              {conservationActivities.map((activity, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="h-full">
                    <CardHeader>
                      <CardTitle className="text-xl">{activity.activity}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <p className="text-gray-600">{activity.description}</p>
                      <div className="bg-blue-50 p-3 rounded-lg">
                        <p className="text-sm flex items-start gap-2">
                          <Baby className="w-4 h-4 text-blue-600 mt-0.5" />
                          <span className="text-blue-800">{activity.kidActivity}</span>
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            <Alert className="mt-8">
              <Sunrise className="h-4 w-4" />
              <AlertDescription>
                <strong>Special Experience:</strong> The baby turtle release at sunset is truly magical. Watch as tiny hatchlings instinctively make their way to the ocean as the sun sets over the Indian Ocean!
              </AlertDescription>
            </Alert>
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
              <h2 className="text-4xl font-bold mb-4">Age-Appropriate Activities</h2>
              <p className="text-lg text-gray-600">Tailored experiences for every family member</p>
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
                        <Users className="w-5 h-5 text-cyan-600" />
                        {age.ageGroup}
                      </CardTitle>
                      <p className="text-gray-600 mt-2">{age.recommendation}</p>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <h4 className="font-semibold mb-2">Why this age loves it:</h4>
                        <ul className="space-y-1">
                          {age.tips.map((tip, idx) => (
                            <li key={idx} className="flex items-start gap-2 text-sm">
                              <CheckCircle className="w-4 h-4 text-green-600 mt-0.5" />
                              <span className="text-gray-600">{tip}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="bg-cyan-50 p-3 rounded-lg">
                        <p className="text-sm">
                          <strong>Best activity:</strong> {age.bestActivity}
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
              <h2 className="text-4xl font-bold mb-4">Family Conservation Packages</h2>
              <p className="text-lg text-gray-600">Choose your turtle conservation adventure</p>
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
                        <span className="text-3xl font-bold text-cyan-600">{pkg.price}</span>
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
                              <div className="w-5 h-5 rounded-full bg-cyan-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                                <div className="w-2 h-2 bg-cyan-600 rounded-full" />
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
                        Book This Experience
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Visitor Guidelines */}
        <section className="py-16 px-4 bg-gray-50">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-4xl font-bold mb-4">Visitor Guidelines</h2>
              <p className="text-lg text-gray-600">Help us protect these amazing creatures</p>
            </motion.div>

            <Tabs defaultValue="dos" className="space-y-8">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="dos">Do's</TabsTrigger>
                <TabsTrigger value="donts">Don'ts</TabsTrigger>
                <TabsTrigger value="what-to-bring">What to Bring</TabsTrigger>
              </TabsList>

              {Object.entries(visitorGuidelines).map(([key, guidelines]) => (
                <TabsContent 
                  key={key} 
                  value={key.toLowerCase().replace("'", "")}
                  className="space-y-6"
                >
                  <Card>
                    <CardHeader>
                      <CardTitle>{key}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="grid md:grid-cols-2 gap-3">
                        {guidelines.map((guideline, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <CheckCircle className="w-5 h-5 text-cyan-600 mt-0.5" />
                            <span className="text-gray-600">{guideline}</span>
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
              <p className="text-lg text-gray-600">Everything about the turtle hatchery experience</p>
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
        <section className="py-20 px-4 bg-gradient-to-br from-cyan-600 to-blue-700 text-white">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl font-bold mb-6">
                Ready to Save Sea Turtles?
              </h2>
              <p className="text-xl mb-8 text-cyan-100">
                Join us for an unforgettable conservation experience that makes a real difference
              </p>
              <div className="flex gap-4 justify-center flex-wrap">
                <Button 
                  size="lg" 
                  variant="secondary"
                  onClick={() => handleBookPackage("Sunset Release Experience")}
                >
                  <Waves className="w-5 h-5 mr-2" />
                  Book Turtle Experience
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
        itemTitle={selectedPackage || "Sunset Release Experience"}
      />
    </>
  );
};

export default KosgodaTurtleHatchery;