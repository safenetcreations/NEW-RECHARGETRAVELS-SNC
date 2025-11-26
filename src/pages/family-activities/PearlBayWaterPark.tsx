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
  Zap,
  Sun,
  AlertTriangle,
  CheckCircle,
  Baby,
  Shield,
  Award,
  Sparkles,
  Info,
  Utensils,
  Car,
  Droplets
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Alert, AlertDescription } from '@/components/ui/alert';
import EnhancedBookingModal from '@/components/EnhancedBookingModal';

const PearlBayWaterPark = () => {
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState('');
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const heroImages = [
    {
      url: "https://images.unsplash.com/photo-1575428652377-a2d80e2277fc?auto=format&fit=crop&q=80",
      caption: "Family enjoying water slides at Pearl Bay"
    },
    {
      url: "https://images.unsplash.com/photo-1506953823976-52e1fdc0149a?auto=format&fit=crop&q=80",
      caption: "Kids playing in the wave pool"
    },
    {
      url: "https://images.unsplash.com/photo-1519452575417-564c1401ecc0?auto=format&fit=crop&q=80",
      caption: "Go-karting track excitement"
    }
  ];

  const attractions = [
    {
      name: "Wave Pool",
      type: "Water",
      ageGroup: "All ages",
      thrill: "Moderate",
      description: "Sri Lanka's largest wave pool with gentle to moderate waves",
      kidsFactor: "Kids love jumping waves in shallow areas"
    },
    {
      name: "Lazy River",
      type: "Water",
      ageGroup: "All ages",
      thrill: "Relaxing",
      description: "Float around the park on tubes in a gentle current",
      kidsFactor: "Perfect for toddlers with parents"
    },
    {
      name: "Multi-Slide Tower",
      type: "Water",
      ageGroup: "8+ years",
      thrill: "High",
      description: "Six different slides including racing slides and spirals",
      kidsFactor: "Race your siblings down parallel slides!"
    },
    {
      name: "Kids' Splash Zone",
      type: "Water",
      ageGroup: "2-10 years",
      thrill: "Low",
      description: "Shallow pools with mini slides, fountains, and water toys",
      kidsFactor: "Safe water play for little ones"
    },
    {
      name: "Go-Kart Track",
      type: "Land",
      ageGroup: "6+ years",
      thrill: "Moderate",
      description: "Professional karting track with junior and adult karts",
      kidsFactor: "Feel like a real race car driver!"
    },
    {
      name: "Adventure Playground",
      type: "Land",
      ageGroup: "4-12 years",
      thrill: "Low",
      description: "Climbing frames, swings, and zip lines",
      kidsFactor: "Dry fun when kids need a water break"
    }
  ];

  const familyPackages = [
    {
      title: "Splash Day Pass",
      price: "$25",
      priceUnit: "per adult",
      childPrice: "$15 per child (3-12 years)",
      duration: "Full Day",
      includes: [
        "All water park attractions",
        "Locker rental",
        "Life jackets provided",
        "Access to rest areas",
        "Free parking",
        "Shower facilities"
      ],
      highlights: ["Water park only", "Best value", "Flexible timing"]
    },
    {
      title: "Adventure Combo",
      price: "$40",
      priceUnit: "per adult",
      childPrice: "$25 per child",
      duration: "Full Day",
      includes: [
        "Water park access",
        "30 min go-karting",
        "Adventure playground",
        "Lunch meal combo",
        "Priority queue passes",
        "Photo package"
      ],
      highlights: ["Water + karting", "Skip lines", "Meals included"]
    },
    {
      title: "VIP Family Package",
      price: "$150",
      priceUnit: "per family",
      childPrice: "(2 adults + 2 kids)",
      duration: "Full Day",
      includes: [
        "All attractions unlimited",
        "Private cabana rental",
        "Dedicated attendant",
        "All meals & snacks",
        "Unlimited go-karting",
        "Professional photos",
        "VIP parking"
      ],
      highlights: ["Ultimate comfort", "No queues", "Private space"]
    }
  ];

  const safetyFeatures = {
    "Water Safety": [
      "Certified lifeguards at all pools",
      "Free life jackets for kids",
      "Shallow areas clearly marked",
      "Regular water quality testing",
      "First aid stations nearby",
      "Height restrictions enforced"
    ],
    "Go-Kart Safety": [
      "Safety briefing mandatory",
      "Helmets and gear provided",
      "Speed limited for juniors",
      "Track marshals present",
      "Separate junior track",
      "Parent supervision allowed"
    ],
    "General Safety": [
      "Non-slip surfaces everywhere",
      "Shaded rest areas",
      "Security personnel on-site",
      "Lost child protocols",
      "Medical team available",
      "CCTV monitoring"
    ]
  };

  const parkTips = [
    {
      category: "What to Bring",
      items: [
        "Swimwear and extra clothes",
        "Waterproof sunscreen SPF 50+",
        "Water shoes or flip-flops",
        "Towels (or rent on-site)",
        "Waterproof phone pouch",
        "Cash for extras"
      ]
    },
    {
      category: "Best Times",
      items: [
        "Weekdays are less crowded",
        "Arrive at opening (9 AM)",
        "Avoid public holidays",
        "Morning for water activities",
        "Afternoon for go-karting",
        "Check weather forecast"
      ]
    },
    {
      category: "Food & Drinks",
      items: [
        "Multiple restaurants on-site",
        "Kids' menu available",
        "Vegetarian options",
        "No outside food policy",
        "Free drinking water stations",
        "Ice cream and snack bars"
      ]
    },
    {
      category: "Facilities",
      items: [
        "Family changing rooms",
        "Baby care rooms",
        "Locker rentals available",
        "Towel rental service",
        "Photography service",
        "Souvenir shop"
      ]
    }
  ];

  const ageZones = [
    {
      ageGroup: "Toddlers (2-4 years)",
      bestAttractions: ["Kids' splash zone", "Lazy river with parent", "Playground"],
      tips: ["Stay in shallow areas", "Frequent diaper checks", "Bring swim diapers"],
      parentNote: "One parent per child in water"
    },
    {
      ageGroup: "Young Kids (5-8 years)",
      bestAttractions: ["Wave pool edges", "Junior slides", "Junior go-karts"],
      tips: ["Life jacket recommended", "Stay within arm's reach", "Apply sunscreen hourly"],
      parentNote: "Close supervision required"
    },
    {
      ageGroup: "Tweens (9-12 years)",
      bestAttractions: ["All water slides", "Wave pool", "Racing go-karts"],
      tips: ["Can explore more freely", "Set meeting points", "Buddy system works"],
      parentNote: "Check-in every hour"
    },
    {
      ageGroup: "Teens (13+ years)",
      bestAttractions: ["Extreme slides", "Deep wave pool", "Competitive karting"],
      tips: ["More independence", "Phone in waterproof case", "Set meal times"],
      parentNote: "Enjoy your own activities too!"
    }
  ];

  const faqs = [
    {
      question: "Is the water park suitable for non-swimmers?",
      answer: "Yes! The park has many shallow areas, a lazy river, and free life jackets. Lifeguards are stationed everywhere. The kids' zone has water depths from 1-3 feet, perfect for non-swimmers."
    },
    {
      question: "Are there height/age restrictions?",
      answer: "Yes, some slides have minimum height requirements (usually 4 feet). Go-karting requires children to be at least 6 years old. Junior karts are available for ages 6-12, and adult karts for 13+."
    },
    {
      question: "Can we bring our own food?",
      answer: "Outside food isn't allowed for hygiene reasons, but the park has several restaurants with kid-friendly options, including pizza, burgers, rice dishes, and healthy choices. Special dietary needs can be accommodated."
    },
    {
      question: "What about babies and toddlers?",
      answer: "There's a dedicated toddler pool with mini slides and water features. Baby changing facilities and nursing rooms are available. Swim diapers are required and sold on-site."
    },
    {
      question: "Is photography allowed?",
      answer: "Yes, but only with phones/cameras in the dry areas. For safety, cameras aren't allowed on slides. Professional photographers offer photo packages throughout the park."
    },
    {
      question: "What if it rains?",
      answer: "Light rain doesn't affect operations - you're getting wet anyway! In case of thunderstorms, water activities pause but indoor areas and restaurants remain open. Rain checks are provided for severe weather closures."
    }
  ];

  const handleBookPackage = (packageTitle: string) => {
    setSelectedPackage(packageTitle);
    setIsBookingOpen(true);
  };

  return (
    <>
      <Helmet>
        <title>Pearl Bay Water Park & Go-Karting | Family Fun Day | Recharge Travels</title>
        <meta name="description" content="Splash into fun at Pearl Bay Water Park! Enjoy water slides, wave pools, and go-karting in Sri Lanka's premier family entertainment destination near Colombo." />
        <meta name="keywords" content="Pearl Bay water park, family water park Sri Lanka, go-karting Colombo, kids activities, water slides" />
        <meta property="og:title" content="Pearl Bay Water Park - Ultimate Family Fun Destination" />
        <meta property="og:description" content="Cool off with thrilling water slides, wave pools, and exciting go-kart racing. Perfect family day out with activities for all ages!" />
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
                Water Park Adventure
              </Badge>
              <h1 className="text-5xl md:text-6xl font-bold mb-6">
                Pearl Bay Water Park & Karting
              </h1>
              <p className="text-xl mb-8 text-gray-100">
                Sri Lanka's ultimate family fun destination with thrilling water slides, wave pools, and high-speed go-karting
              </p>
              <div className="flex gap-4 justify-center">
                <Button 
                  size="lg" 
                  onClick={() => handleBookPackage("Adventure Combo")}
                  className="bg-cyan-600 hover:bg-cyan-700"
                >
                  <Droplets className="w-5 h-5 mr-2" />
                  Book Your Splash Day
                </Button>
                <Button 
                  size="lg" 
                  variant="outline"
                  className="bg-white/10 backdrop-blur-sm text-white border-white/30 hover:bg-white/20"
                  onClick={() => document.getElementById('attractions')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  View Attractions
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

        {/* Why Pearl Bay */}
        <section className="py-16 px-4 bg-white">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-4xl font-bold mb-4">Why Families Choose Pearl Bay</h2>
              <p className="text-lg text-gray-600">The perfect combination of water fun and adventure activities</p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-6">
              {[
                {
                  icon: Shield,
                  title: "Safety First",
                  description: "Certified lifeguards, modern safety equipment, and child-friendly design"
                },
                {
                  icon: Waves,
                  title: "Variety of Attractions",
                  description: "From gentle splash zones to thrilling slides - something for every age"
                },
                {
                  icon: Car,
                  title: "Go-Karting Thrills",
                  description: "Professional track with junior and adult karts for racing excitement"
                },
                {
                  icon: Sun,
                  title: "All-Day Entertainment",
                  description: "Water park, dry rides, and dining options for a full day of fun"
                },
                {
                  icon: Heart,
                  title: "Family Facilities",
                  description: "Family changing rooms, baby care areas, and kid-friendly amenities"
                },
                {
                  icon: Award,
                  title: "Value for Money",
                  description: "Affordable packages with multiple attractions included"
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

        {/* Attractions */}
        <section id="attractions" className="py-16 px-4 bg-gray-50">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-4xl font-bold mb-4">Park Attractions</h2>
              <p className="text-lg text-gray-600">Exciting activities for the whole family</p>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-6">
              {attractions.map((attraction, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="h-full hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-xl">{attraction.name}</CardTitle>
                        <div className="flex gap-2">
                          <Badge variant={attraction.type === "Water" ? "default" : "secondary"}>
                            {attraction.type}
                          </Badge>
                          <Badge variant={
                            attraction.thrill === "High" ? "destructive" : 
                            attraction.thrill === "Moderate" ? "default" : "outline"
                          }>
                            {attraction.thrill}
                          </Badge>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">Ages: {attraction.ageGroup}</p>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <p className="text-gray-600">{attraction.description}</p>
                      <div className="bg-cyan-50 p-3 rounded-lg">
                        <p className="text-sm flex items-start gap-2">
                          <Baby className="w-4 h-4 text-cyan-600 mt-0.5" />
                          <span className="text-cyan-800">{attraction.kidsFactor}</span>
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            <Alert className="mt-8">
              <Zap className="h-4 w-4" />
              <AlertDescription>
                <strong>Thrill Seeker Tip:</strong> Try the "Kamikaze" slide for the ultimate adrenaline rush, or race your family down the multi-lane slides!
              </AlertDescription>
            </Alert>
          </div>
        </section>

        {/* Age Zones */}
        <section className="py-16 px-4 bg-white">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-4xl font-bold mb-4">Age-Specific Fun Zones</h2>
              <p className="text-lg text-gray-600">Tailored experiences for every family member</p>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-6">
              {ageZones.map((zone, index) => (
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
                        {zone.ageGroup}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <h4 className="font-semibold mb-2">Best Attractions:</h4>
                        <div className="flex flex-wrap gap-2">
                          {zone.bestAttractions.map((attraction, idx) => (
                            <Badge key={idx} variant="secondary">
                              {attraction}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-2">Safety Tips:</h4>
                        <ul className="space-y-1">
                          {zone.tips.map((tip, idx) => (
                            <li key={idx} className="flex items-start gap-2 text-sm">
                              <CheckCircle className="w-4 h-4 text-green-600 mt-0.5" />
                              <span className="text-gray-600">{tip}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="bg-amber-50 p-3 rounded-lg">
                        <p className="text-sm flex items-start gap-2">
                          <Shield className="w-4 h-4 text-amber-600" />
                          <span className="text-amber-800">{zone.parentNote}</span>
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
              <h2 className="text-4xl font-bold mb-4">Family Fun Packages</h2>
              <p className="text-lg text-gray-600">Choose the perfect day out for your family</p>
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
                        Book This Package
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Safety & Tips */}
        <section className="py-16 px-4 bg-white">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-4xl font-bold mb-4">Safety & Park Information</h2>
              <p className="text-lg text-gray-600">Everything you need for a safe and fun visit</p>
            </motion.div>

            <Tabs defaultValue="water-safety" className="space-y-8">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="water-safety">Water Safety</TabsTrigger>
                <TabsTrigger value="go-kart-safety">Karting Safety</TabsTrigger>
                <TabsTrigger value="general-safety">General Safety</TabsTrigger>
              </TabsList>

              {Object.entries(safetyFeatures).map(([key, features]) => (
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
                        {features.map((feature, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                            <span className="text-gray-600">{feature}</span>
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

        {/* Park Tips */}
        <section className="py-16 px-4 bg-gray-50">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-4xl font-bold mb-4">Insider Tips</h2>
              <p className="text-lg text-gray-600">Make the most of your Pearl Bay visit</p>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-6">
              {parkTips.map((tip, index) => (
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
                        {tip.items.map((item, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <div className="w-5 h-5 rounded-full bg-cyan-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                              <div className="w-2 h-2 bg-cyan-600 rounded-full" />
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
              <p className="text-lg text-gray-600">Common questions about Pearl Bay</p>
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
                Ready to Make a Splash?
              </h2>
              <p className="text-xl mb-8 text-cyan-100">
                Beat the heat and create amazing family memories at Pearl Bay
              </p>
              <div className="flex gap-4 justify-center flex-wrap">
                <Button 
                  size="lg" 
                  variant="secondary"
                  onClick={() => handleBookPackage("Adventure Combo")}
                >
                  <Waves className="w-5 h-5 mr-2" />
                  Book Your Adventure
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
        itemTitle={selectedPackage || "Adventure Combo"}
      />
    </>
  );
};

export default PearlBayWaterPark;