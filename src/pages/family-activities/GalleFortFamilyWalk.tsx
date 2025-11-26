import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { motion } from 'framer-motion';
import { 
  Castle, 
  Users, 
  Clock, 
  MapPin, 
  Camera, 
  Heart, 
  Star, 
  Compass,
  Anchor,
  AlertTriangle,
  CheckCircle,
  Baby,
  Shield,
  Award,
  Sparkles,
  Info,
  Coffee,
  ShoppingBag,
  Building
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Alert, AlertDescription } from '@/components/ui/alert';
import EnhancedBookingModal from '@/components/EnhancedBookingModal';

const GalleFortFamilyWalk = () => {
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState('');
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const heroImages = [
    {
      url: "https://images.unsplash.com/photo-1580063094466-893d9344aa52?auto=format&fit=crop&q=80",
      caption: "Family walking on the historic Galle Fort ramparts"
    },
    {
      url: "https://images.unsplash.com/photo-1552055569-7b098814acef?auto=format&fit=crop&q=80",
      caption: "Colorful colonial buildings inside the fort"
    },
    {
      url: "https://images.unsplash.com/photo-1624117171820-d0691189a680?auto=format&fit=crop&q=80",
      caption: "Lighthouse and ocean views from the fort walls"
    }
  ];

  const fortHighlights = [
    {
      landmark: "Fort Ramparts Walk",
      duration: "45 minutes",
      difficulty: "Easy - stroller friendly",
      highlights: ["Ocean views", "Sunset spots", "Clock tower"],
      kidsFactor: "Wide walls safe for kids to explore, cannons to see"
    },
    {
      landmark: "Dutch Reformed Church",
      duration: "15 minutes",
      difficulty: "Easy",
      highlights: ["1750s architecture", "Floor tombstones", "Peaceful courtyard"],
      kidsFactor: "Kids love the echo inside and old gravestones with stories"
    },
    {
      landmark: "Maritime Museum",
      duration: "30 minutes",
      difficulty: "Easy",
      highlights: ["Ship models", "Marine life exhibits", "Naval artifacts"],
      kidsFactor: "Interactive displays and giant whale skeleton"
    },
    {
      landmark: "Lighthouse & Beach",
      duration: "30 minutes",
      difficulty: "Easy with stairs",
      highlights: ["Iconic lighthouse", "Beach access", "Photo opportunities"],
      kidsFactor: "Beach play and lighthouse climbing (when open)"
    },
    {
      landmark: "Shopping Streets",
      duration: "1 hour",
      difficulty: "Easy",
      highlights: ["Boutique shops", "Art galleries", "Ice cream parlors"],
      kidsFactor: "Gelato shops, toy stores, and street performers"
    },
    {
      landmark: "Historical Mosque",
      duration: "20 minutes",
      difficulty: "Easy",
      highlights: ["Unique architecture", "Cultural diversity", "Peaceful atmosphere"],
      kidsFactor: "Beautiful white building and friendly locals"
    }
  ];

  const familyPackages = [
    {
      title: "Morning Heritage Walk",
      price: "$25",
      priceUnit: "per adult",
      childPrice: "$10 per child (5-12 years)",
      duration: "2.5 hours",
      includes: [
        "Expert family guide",
        "Fort entrance",
        "Kids' treasure hunt map",
        "Museum tickets",
        "Morning snack stop",
        "Photo assistance"
      ],
      highlights: ["Educational focus", "Cooler morning", "Less crowded"]
    },
    {
      title: "Sunset Adventure Tour",
      price: "$35",
      priceUnit: "per adult",
      childPrice: "$15 per child",
      duration: "3 hours",
      includes: [
        "Rampart walk at golden hour",
        "Ice cream treat",
        "Lighthouse visit",
        "Beach time",
        "Sunset viewing spot",
        "Family portrait session"
      ],
      highlights: ["Magical sunset", "Beach play", "Best photos"]
    },
    {
      title: "Full Day Explorer",
      price: "$55",
      priceUnit: "per adult",
      childPrice: "$25 per child",
      duration: "5-6 hours",
      includes: [
        "Complete fort tour",
        "All museum entries",
        "Lunch at family restaurant",
        "Shopping time",
        "Tuk-tuk ride experience",
        "Activity booklet for kids",
        "Souvenir per child"
      ],
      highlights: ["Comprehensive experience", "Flexible pace", "Multiple activities"]
    }
  ];

  const familyStops = {
    "Must-Visit Spots": [
      "Rampart walk for ocean views",
      "Clock Tower for photos",
      "Maritime Museum for education",
      "Ice cream at Dairy King",
      "Beach access near lighthouse",
      "Dutch Hospital shopping complex"
    ],
    "Kid-Friendly Cafes": [
      "Pedlar's Inn Cafe (garden seating)",
      "Fortaleza (ocean views)",
      "Heritage Cafe (courtyard)",
      "Church Street Social (kids menu)",
      "A Minute by Tuk Tuk (fun theme)",
      "Elita Restaurant (rooftop)"
    ],
    "Shopping for Families": [
      "Barefoot Gallery (crafts)",
      "Laksana (souvenirs)",
      "Exotic Roots (clothing)",
      "Stick No Bills (posters)",
      "Mimimango (eco-friendly toys)",
      "Shoba Display Gallery (gems)"
    ]
  };

  const walkingTips = [
    {
      category: "Stroller Users",
      tips: [
        "Most paths are paved and stroller-friendly",
        "Some areas have cobblestones - bring sturdy stroller",
        "Ramps available at major attractions",
        "Beach access has sand - consider carrier"
      ]
    },
    {
      category: "Safety Tips",
      tips: [
        "Stay away from rampart edges",
        "Hold hands on busy streets",
        "Watch for tuk-tuks and bikes",
        "Use sunscreen - limited shade"
      ]
    },
    {
      category: "Best Times",
      tips: [
        "Early morning (8-10 AM) for cool weather",
        "Late afternoon (4-6 PM) for sunset",
        "Avoid midday sun (11 AM-2 PM)",
        "Weekdays less crowded than weekends"
      ]
    },
    {
      category: "What to Bring",
      tips: [
        "Water bottles (refill stations available)",
        "Comfortable walking shoes",
        "Sun hats and sunglasses",
        "Small backpack for purchases",
        "Camera with full battery",
        "Cash for small vendors"
      ]
    }
  ];

  const ageRecommendations = [
    {
      ageGroup: "2-4 years",
      recommendation: "Short walks with breaks",
      tips: ["Morning tour best", "Bring stroller", "Ice cream motivator"],
      mustSee: "Beach and ramparts"
    },
    {
      ageGroup: "5-8 years",
      recommendation: "Perfect for treasure hunts",
      tips: ["Love the history stories", "Can walk longer", "Enjoy museums"],
      mustSee: "Maritime Museum and lighthouse"
    },
    {
      ageGroup: "9-12 years",
      recommendation: "Full historical experience",
      tips: ["Appreciate architecture", "Photo opportunities", "Shopping interest"],
      mustSee: "Complete fort circuit"
    },
    {
      ageGroup: "Teens",
      recommendation: "Instagram paradise",
      tips: ["Love the cafes", "Shopping time", "Historical appreciation"],
      mustSee: "Sunset spots and boutiques"
    }
  ];

  const faqs = [
    {
      question: "How long does it take to walk around the entire fort?",
      answer: "The complete rampart walk takes about 45-60 minutes at a leisurely pace. With kids, plan for 90 minutes with stops for photos, rest, and play. The full fort experience with museums and cafes can easily fill 4-5 hours."
    },
    {
      question: "Is Galle Fort safe for young children?",
      answer: "Yes, Galle Fort is very family-friendly. The main paths are safe, but always supervise children near the rampart walls as some areas don't have railings. The fort is car-free in many areas, making it safer for kids to explore."
    },
    {
      question: "Are there baby changing facilities?",
      answer: "Yes, most restaurants and cafes have baby changing facilities. The Dutch Hospital shopping complex has clean public restrooms with changing tables. Many hotels within the fort also allow visitors to use their facilities."
    },
    {
      question: "What's the best way to keep kids engaged?",
      answer: "We provide treasure hunt maps that turn the walk into an adventure. Kids love counting cannons, spotting different flags, finding the lighthouse, and the reward of ice cream. Street performers and artists also entertain along the way."
    },
    {
      question: "Can we swim at the beaches?",
      answer: "The small beach near the lighthouse is good for paddling but not ideal for swimming due to rocks. For proper beach time, Unawatuna Beach is just 10 minutes away by tuk-tuk and perfect for families."
    },
    {
      question: "Is the fort accessible for strollers/wheelchairs?",
      answer: "Most main areas are accessible with paved paths. Some historic buildings have steps, and cobblestone areas can be bumpy. The rampart walk is mostly smooth. We can advise on the most accessible route for your needs."
    }
  ];

  const handleBookPackage = (packageTitle: string) => {
    setSelectedPackage(packageTitle);
    setIsBookingOpen(true);
  };

  return (
    <>
      <Helmet>
        <title>Galle Fort Family Walking Tour | Historic Adventure | Recharge Travels</title>
        <meta name="description" content="Explore the UNESCO World Heritage Galle Fort with your family. Kid-friendly walking tours, treasure hunts, museums, and beach time in this historic Dutch colonial fort." />
        <meta name="keywords" content="Galle Fort family tour, kids activities Galle, UNESCO heritage site, family walking tour Sri Lanka, Dutch Fort" />
        <meta property="og:title" content="Galle Fort Family Walk - Historic Adventure for Kids" />
        <meta property="og:description" content="Discover 400 years of history in a fun family walking tour of Galle Fort. Perfect for all ages with beaches, ice cream, and adventure!" />
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
              <Badge className="mb-4 bg-amber-600/90 text-white px-4 py-1">
                <Castle className="w-4 h-4 mr-1" />
                UNESCO Heritage Site
              </Badge>
              <h1 className="text-5xl md:text-6xl font-bold mb-6">
                Galle Fort Family Adventure
              </h1>
              <p className="text-xl mb-8 text-gray-100">
                Step back in time exploring cobblestone streets, ancient ramparts, and hidden treasures perfect for curious kids
              </p>
              <div className="flex gap-4 justify-center">
                <Button 
                  size="lg" 
                  onClick={() => handleBookPackage("Morning Heritage Walk")}
                  className="bg-amber-600 hover:bg-amber-700"
                >
                  <Compass className="w-5 h-5 mr-2" />
                  Book Family Tour
                </Button>
                <Button 
                  size="lg" 
                  variant="outline"
                  className="bg-white/10 backdrop-blur-sm text-white border-white/30 hover:bg-white/20"
                  onClick={() => document.getElementById('highlights')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  Explore the Fort
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

        {/* Why Galle Fort for Families */}
        <section className="py-16 px-4 bg-white">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-4xl font-bold mb-4">Why Families Love Galle Fort</h2>
              <p className="text-lg text-gray-600">A perfect blend of history, culture, and family fun</p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-6">
              {[
                {
                  icon: Shield,
                  title: "Safe & Car-Free",
                  description: "Most areas are pedestrian-only, making it safe for kids to explore freely"
                },
                {
                  icon: Building,
                  title: "Living History",
                  description: "400-year-old fort with colorful colonial buildings and fascinating stories"
                },
                {
                  icon: Coffee,
                  title: "Family-Friendly Cafes",
                  description: "Plenty of restaurants with kids' menus, high chairs, and ocean views"
                },
                {
                  icon: Camera,
                  title: "Picture Perfect",
                  description: "Every corner offers Instagram-worthy family photo opportunities"
                },
                {
                  icon: ShoppingBag,
                  title: "Unique Shopping",
                  description: "Boutiques with handmade toys, books, and souvenirs kids will love"
                },
                {
                  icon: Anchor,
                  title: "Beach & Ocean",
                  description: "Easy access to beaches and stunning ocean views from the ramparts"
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
                      <feature.icon className="w-12 h-12 text-amber-600 mb-4" />
                      <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                      <p className="text-gray-600">{feature.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Fort Highlights */}
        <section id="highlights" className="py-16 px-4 bg-gray-50">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-4xl font-bold mb-4">Fort Walking Route</h2>
              <p className="text-lg text-gray-600">Key stops on your family adventure</p>
            </motion.div>

            <div className="space-y-6">
              {fortHighlights.map((stop, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="overflow-hidden">
                    <CardHeader className="bg-gradient-to-r from-amber-50 to-orange-50">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-xl flex items-center gap-2">
                          <MapPin className="w-5 h-5 text-amber-600" />
                          {stop.landmark}
                        </CardTitle>
                        <div className="flex gap-2">
                          <Badge variant="outline">
                            <Clock className="w-3 h-3 mr-1" />
                            {stop.duration}
                          </Badge>
                          <Badge variant="secondary">
                            {stop.difficulty}
                          </Badge>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-6">
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <h4 className="font-semibold mb-2 flex items-center gap-2">
                            <Star className="w-4 h-4 text-amber-600" />
                            Highlights
                          </h4>
                          <ul className="space-y-1">
                            {stop.highlights.map((highlight, idx) => (
                              <li key={idx} className="text-sm text-gray-600 flex items-center gap-2">
                                <div className="w-1.5 h-1.5 bg-amber-400 rounded-full" />
                                {highlight}
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <h4 className="font-semibold mb-2 flex items-center gap-2">
                            <Baby className="w-4 h-4 text-blue-600" />
                            Why Kids Love It
                          </h4>
                          <p className="text-gray-600">{stop.kidsFactor}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            <Alert className="mt-8">
              <Compass className="h-4 w-4" />
              <AlertDescription>
                <strong>Pro Tip:</strong> Start your walk at the main entrance near the cricket stadium. This gives you easy access to the ramparts and all major attractions in a logical loop.
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
              <h2 className="text-4xl font-bold mb-4">Age-Specific Recommendations</h2>
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
                        <Users className="w-5 h-5 text-amber-600" />
                        Ages {age.ageGroup}
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
                        <p className="text-sm">
                          <strong>Must see:</strong> {age.mustSee}
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
        <section className="py-16 px-4 bg-gray-50">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-4xl font-bold mb-4">Family Tour Packages</h2>
              <p className="text-lg text-gray-600">Choose your perfect Galle Fort adventure</p>
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
                        <span className="text-3xl font-bold text-amber-600">{pkg.price}</span>
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
                              <div className="w-5 h-5 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                                <div className="w-2 h-2 bg-amber-600 rounded-full" />
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
                        Book This Tour
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Family Stops & Tips */}
        <section className="py-16 px-4 bg-white">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-4xl font-bold mb-4">Family-Friendly Guide</h2>
              <p className="text-lg text-gray-600">Our curated list of must-visits inside the fort</p>
            </motion.div>

            <Tabs defaultValue="must-visit-spots" className="space-y-8">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="must-visit-spots">Must-Visit</TabsTrigger>
                <TabsTrigger value="kid-friendly-cafes">Cafes</TabsTrigger>
                <TabsTrigger value="shopping-for-families">Shopping</TabsTrigger>
              </TabsList>

              {Object.entries(familyStops).map(([key, stops]) => (
                <TabsContent 
                  key={key} 
                  value={key.toLowerCase().replace(/ /g, '-')}
                  className="space-y-6"
                >
                  <Card>
                    <CardHeader>
                      <CardTitle>{key}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="grid md:grid-cols-2 gap-3">
                        {stops.map((stop, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <CheckCircle className="w-5 h-5 text-amber-600 mt-0.5" />
                            <span className="text-gray-600">{stop}</span>
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

        {/* Walking Tips */}
        <section className="py-16 px-4 bg-gray-50">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-4xl font-bold mb-4">Practical Walking Tips</h2>
              <p className="text-lg text-gray-600">Make your fort exploration smooth and enjoyable</p>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-6">
              {walkingTips.map((tip, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="h-full">
                    <CardHeader>
                      <CardTitle className="text-lg">{tip.category}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {tip.tips.map((item, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <div className="w-5 h-5 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                              <div className="w-2 h-2 bg-amber-600 rounded-full" />
                            </div>
                            <span className="text-gray-600 text-sm">{item}</span>
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
              <p className="text-lg text-gray-600">Everything about visiting Galle Fort with kids</p>
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
        <section className="py-20 px-4 bg-gradient-to-br from-amber-600 to-orange-700 text-white">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl font-bold mb-6">
                Ready to Explore History?
              </h2>
              <p className="text-xl mb-8 text-amber-100">
                Take your family on a journey through 400 years of fascinating history
              </p>
              <div className="flex gap-4 justify-center flex-wrap">
                <Button 
                  size="lg" 
                  variant="secondary"
                  onClick={() => handleBookPackage("Morning Heritage Walk")}
                >
                  <Castle className="w-5 h-5 mr-2" />
                  Book Family Tour
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
        itemTitle={selectedPackage || "Morning Heritage Walk"}
      />
    </>
  );
};

export default GalleFortFamilyWalk;