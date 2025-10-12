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
  TreePine,
  Sunrise,
  AlertTriangle,
  CheckCircle,
  Baby,
  Footprints,
  Sparkles,
  Shield,
  Award,
  Zap,
  Info
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Alert, AlertDescription } from '@/components/ui/alert';
import EnhancedBookingModal from '@/components/EnhancedBookingModal';

const SigiriyaFamilyAdventure = () => {
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState('');
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const heroImages = [
    {
      url: "https://images.unsplash.com/photo-1588598198321-9735fd6aebf4?auto=format&fit=crop&q=80",
      caption: "Family hiking up Sigiriya Rock Fortress"
    },
    {
      url: "https://images.unsplash.com/photo-1624295415952-5def75be0339?auto=format&fit=crop&q=80",
      caption: "Panoramic view from Sigiriya summit"
    },
    {
      url: "https://images.unsplash.com/photo-1566296440929-f4e192e9d0a0?auto=format&fit=crop&q=80",
      caption: "Kids exploring ancient frescoes"
    }
  ];

  const climbingStages = [
    {
      stage: "Boulder Gardens",
      difficulty: "Easy",
      time: "20 minutes",
      highlights: ["Ancient pools", "Boulder caves", "Monastery ruins"],
      kidsFactor: "Great for exploration and photo ops"
    },
    {
      stage: "Terrace Gardens", 
      difficulty: "Easy-Moderate",
      time: "15 minutes",
      highlights: ["Water gardens", "Fountain systems", "Symmetrical design"],
      kidsFactor: "Kids love the ancient fountains"
    },
    {
      stage: "Mirror Wall & Frescoes",
      difficulty: "Moderate",
      time: "25 minutes", 
      highlights: ["Ancient paintings", "Mirror wall graffiti", "Spiral staircase"],
      kidsFactor: "Educational and fascinating for older kids"
    },
    {
      stage: "Lion's Paws Platform",
      difficulty: "Moderate",
      time: "10 minutes",
      highlights: ["Giant lion paws", "Rest area", "Photo opportunities"],
      kidsFactor: "Perfect rest spot before final climb"
    },
    {
      stage: "Summit Climb",
      difficulty: "Challenging",
      time: "15 minutes",
      highlights: ["Metal stairways", "Ancient palace ruins", "360° views"],
      kidsFactor: "Achievement moment for the whole family!"
    }
  ];

  const familyPackages = [
    {
      title: "Family Explorer Package",
      price: "$40",
      priceUnit: "per adult",
      childPrice: "$15 per child (5-12 years)",
      duration: "Half Day",
      includes: [
        "Skip-the-line entrance tickets",
        "Family-friendly guide",
        "Water bottles and snacks",
        "Kids' activity booklet",
        "Rest stop arrangements"
      ],
      highlights: ["Pace adjusted for kids", "Educational activities", "Photo assistance"]
    },
    {
      title: "Adventure & Culture Combo",
      price: "$75",
      priceUnit: "per adult",
      childPrice: "$30 per child",
      duration: "Full Day",
      includes: [
        "Sigiriya Rock climb",
        "Museum visit",
        "Traditional lunch",
        "Pidurangala Rock sunset",
        "Transport included"
      ],
      highlights: ["Two climbs in one day", "Cultural immersion", "Sunset experience"]
    }
  ];

  const preparationTips = {
    "What to Bring": [
      "Comfortable walking shoes with good grip",
      "Lightweight backpack with water",
      "Sunscreen and hats",
      "Light snacks for energy",
      "Camera with strap",
      "Small first-aid kit"
    ],
    "Best Time to Visit": [
      "Early morning (7 AM) - cooler and less crowded",
      "Late afternoon (3 PM) - better for photos",
      "Avoid midday sun (11 AM - 2 PM)",
      "Check weather forecast for clear days"
    ],
    "Fitness Preparation": [
      "Practice stair climbing at home",
      "Take regular family walks",
      "Build stamina gradually",
      "Involve kids in preparation"
    ]
  };

  const ageRecommendations = [
    {
      ageGroup: "4-6 years",
      recommendation: "Can do with assistance",
      tips: ["Take frequent breaks", "Carry if needed on steep sections", "Focus on lower gardens"],
      difficulty: "Moderate"
    },
    {
      ageGroup: "7-10 years",
      recommendation: "Perfect age for adventure",
      tips: ["They'll love the challenge", "Keep them hydrated", "Use buddy system"],
      difficulty: "Easy-Moderate"
    },
    {
      ageGroup: "11-14 years",
      recommendation: "Ideal for full experience",
      tips: ["Can appreciate history", "May help younger siblings", "Great photo opportunities"],
      difficulty: "Easy"
    },
    {
      ageGroup: "15+ years",
      recommendation: "Adult-like experience",
      tips: ["Can explore independently", "Appreciate cultural significance", "Help with family photos"],
      difficulty: "Easy"
    }
  ];

  const faqs = [
    {
      question: "Is Sigiriya Rock climb safe for young children?",
      answer: "Yes, with proper supervision. The climb has railings and safety measures. Children as young as 4-5 can complete it with breaks. Consider carrying very young children on difficult sections."
    },
    {
      question: "How long does the climb take with kids?",
      answer: "With children, plan for 2-3 hours including breaks. The actual climb is about 1.5 hours, but kids need rest stops, snack breaks, and time to explore."
    },
    {
      question: "Are there facilities on the rock?",
      answer: "There are no toilets or shops on the rock itself. Use facilities at the entrance. There are shaded rest areas at various points during the climb."
    },
    {
      question: "What if my child can't complete the climb?",
      answer: "You can turn back at any point. Many families enjoy just the lower gardens and lion's paws platform without going to the summit. Every level offers something special."
    },
    {
      question: "Is it better to hire a guide for families?",
      answer: "Yes, a family-friendly guide can pace the climb appropriately, share kid-friendly stories, help with photos, and ensure you don't miss key features."
    }
  ];

  const handleBookPackage = (packageTitle: string) => {
    setSelectedPackage(packageTitle);
    setIsBookingOpen(true);
  };

  return (
    <>
      <Helmet>
        <title>Climb Sigiriya Rock with Kids - Family Adventure | Recharge Travels</title>
        <meta name="description" content="Take your family on a memorable climb up Sigiriya Rock Fortress. A fun and educational outdoor adventure for children and adults alike." />
        <meta name="keywords" content="Sigiriya Rock, family hike, kid-friendly Sigiriya, Sri Lanka UNESCO sites" />
        <meta property="og:title" content="Sigiriya Family Adventure - Climb the Lion Rock" />
        <meta property="og:description" content="Create unforgettable family memories climbing Sri Lanka's iconic Sigiriya Rock. Safe, educational, and exciting for all ages." />
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
              <Badge className="mb-4 bg-orange-600/90 text-white px-4 py-1">
                <Mountain className="w-4 h-4 mr-1" />
                Family Adventure
              </Badge>
              <h1 className="text-5xl md:text-6xl font-bold mb-6">
                Conquer Sigiriya Rock as a Family
              </h1>
              <p className="text-xl mb-8 text-gray-100">
                An unforgettable climbing adventure suitable for kids and adults, with ancient history at every step
              </p>
              <div className="flex gap-4 justify-center">
                <Button 
                  size="lg" 
                  onClick={() => handleBookPackage("Family Explorer Package")}
                  className="bg-orange-500 hover:bg-orange-600"
                >
                  <Users className="w-5 h-5 mr-2" />
                  Book Family Climb
                </Button>
                <Button 
                  size="lg" 
                  variant="outline"
                  className="bg-white/10 backdrop-blur-sm text-white border-white/30 hover:bg-white/20"
                  onClick={() => document.getElementById('stages')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  View Climb Stages
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

        {/* Why Sigiriya for Families */}
        <section className="py-16 px-4 bg-white">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-4xl font-bold mb-4">Why Sigiriya is Perfect for Family Adventures</h2>
              <p className="text-lg text-gray-600">Combine physical activity, education, and breathtaking views in one epic journey</p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-6">
              {[
                {
                  icon: Award,
                  title: "Achievement & Confidence",
                  description: "Reaching the summit gives kids a huge confidence boost and sense of accomplishment"
                },
                {
                  icon: TreePine,
                  title: "Natural Playground",
                  description: "Ancient gardens, caves, and ruins provide endless exploration opportunities"
                },
                {
                  icon: Camera,
                  title: "Incredible Photo Moments",
                  description: "Every level offers stunning family photo opportunities with unique backdrops"
                },
                {
                  icon: Sparkles,
                  title: "Living History Lesson",
                  description: "Kids learn about ancient civilizations through real-life exploration"
                },
                {
                  icon: Shield,
                  title: "Safe Adventure",
                  description: "Well-maintained paths with railings and regular rest stops for families"
                },
                {
                  icon: Zap,
                  title: "Energy & Exercise",
                  description: "Great physical activity that doesn't feel like exercise to kids"
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
                      <feature.icon className="w-12 h-12 text-orange-600 mb-4" />
                      <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                      <p className="text-gray-600">{feature.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Climbing Stages */}
        <section id="stages" className="py-16 px-4 bg-gray-50">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-4xl font-bold mb-4">The Climb: Stage by Stage</h2>
              <p className="text-lg text-gray-600">Understanding each stage helps families plan and pace their adventure</p>
            </motion.div>

            <div className="space-y-6">
              {climbingStages.map((stage, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="overflow-hidden">
                    <CardHeader className="bg-gradient-to-r from-orange-50 to-orange-100">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-xl flex items-center gap-2">
                          <div className="w-8 h-8 bg-orange-600 text-white rounded-full flex items-center justify-center font-bold">
                            {index + 1}
                          </div>
                          {stage.stage}
                        </CardTitle>
                        <div className="flex gap-2">
                          <Badge variant={stage.difficulty === "Easy" ? "secondary" : stage.difficulty === "Moderate" ? "default" : "destructive"}>
                            {stage.difficulty}
                          </Badge>
                          <Badge variant="outline">
                            <Clock className="w-3 h-3 mr-1" />
                            {stage.time}
                          </Badge>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-6">
                      <div className="grid md:grid-cols-3 gap-4">
                        <div>
                          <h4 className="font-semibold mb-2 flex items-center gap-2">
                            <Footprints className="w-4 h-4 text-orange-600" />
                            Highlights
                          </h4>
                          <ul className="space-y-1">
                            {stage.highlights.map((highlight, idx) => (
                              <li key={idx} className="text-sm text-gray-600 flex items-center gap-2">
                                <div className="w-1.5 h-1.5 bg-orange-400 rounded-full" />
                                {highlight}
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div className="md:col-span-2">
                          <h4 className="font-semibold mb-2 flex items-center gap-2">
                            <Baby className="w-4 h-4 text-blue-600" />
                            Kids Factor
                          </h4>
                          <p className="text-gray-600">{stage.kidsFactor}</p>
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
                <strong>Important:</strong> The climb involves 1,200+ steps. Take your time, enjoy regular breaks, and remember - it's not a race! The journey is as rewarding as reaching the summit.
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
              <p className="text-lg text-gray-600">Tailored advice for different age groups</p>
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
                          <Users className="w-5 h-5 text-orange-600" />
                          Ages {age.ageGroup}
                        </span>
                        <Badge variant={age.difficulty === "Easy" ? "secondary" : "default"}>
                          {age.difficulty}
                        </Badge>
                      </CardTitle>
                      <p className="text-gray-600 mt-2">{age.recommendation}</p>
                    </CardHeader>
                    <CardContent>
                      <h4 className="font-semibold mb-2">Tips for this age group:</h4>
                      <ul className="space-y-2">
                        {age.tips.map((tip, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-sm">
                            <CheckCircle className="w-4 h-4 text-green-600 mt-0.5" />
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

        {/* Family Packages */}
        <section className="py-16 px-4 bg-gray-50">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-4xl font-bold mb-4">Family Climbing Packages</h2>
              <p className="text-lg text-gray-600">Choose the perfect package for your family's Sigiriya adventure</p>
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
                        <span className="text-3xl font-bold text-orange-600">{pkg.price}</span>
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
                        Book This Package
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Preparation Tips */}
        <section className="py-16 px-4 bg-white">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-4xl font-bold mb-4">Preparing Your Family for the Climb</h2>
              <p className="text-lg text-gray-600">Essential tips to ensure everyone enjoys the adventure</p>
            </motion.div>

            <Tabs defaultValue="what-to-bring" className="space-y-8">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="what-to-bring">What to Bring</TabsTrigger>
                <TabsTrigger value="best-time">Best Time</TabsTrigger>
                <TabsTrigger value="fitness">Fitness Prep</TabsTrigger>
              </TabsList>

              {Object.entries(preparationTips).map(([key, tips]) => (
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
              <p className="text-lg text-gray-600">Common concerns about climbing Sigiriya with children</p>
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
        <section className="py-20 px-4 bg-gradient-to-br from-orange-600 to-orange-800 text-white">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl font-bold mb-6">
                Ready to Conquer the Lion Rock?
              </h2>
              <p className="text-xl mb-8 text-orange-100">
                Give your family an adventure they'll talk about for years to come
              </p>
              <div className="flex gap-4 justify-center flex-wrap">
                <Button 
                  size="lg" 
                  variant="secondary"
                  onClick={() => handleBookPackage("Family Explorer Package")}
                >
                  <Mountain className="w-5 h-5 mr-2" />
                  Book Family Adventure
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
        itemTitle={selectedPackage || "Family Explorer Package"}
      />
    </>
  );
};

export default SigiriyaFamilyAdventure;