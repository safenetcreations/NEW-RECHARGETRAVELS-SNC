import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { motion } from 'framer-motion';
import { 
  Palette, 
  Users, 
  Clock, 
  MapPin, 
  Camera, 
  Heart, 
  Star, 
  Brush,
  Drama,
  AlertTriangle,
  CheckCircle,
  Baby,
  Shield,
  Award,
  Sparkles,
  Info,
  Gift,
  Music,
  Smile
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Alert, AlertDescription } from '@/components/ui/alert';
import EnhancedBookingModal from '@/components/EnhancedBookingModal';

const SriLankaMaskWorkshop = () => {
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState('');
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const heroImages = [
    {
      url: "https://images.unsplash.com/photo-1609205065107-dd9cf72ba2f8?auto=format&fit=crop&q=80",
      caption: "Children painting traditional Sri Lankan masks"
    },
    {
      url: "https://images.unsplash.com/photo-1609201906033-8b3c5e3c0e7f?auto=format&fit=crop&q=80",
      caption: "Colorful display of traditional masks"
    },
    {
      url: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?auto=format&fit=crop&q=80",
      caption: "Master craftsman demonstrating mask carving"
    }
  ];

  const maskTypes = [
    {
      name: "Raksha Masks",
      meaning: "Demon masks",
      colors: "Red, black, yellow",
      story: "Used in festivals to ward off evil spirits",
      kidAppeal: "Scary but fun faces with big teeth!"
    },
    {
      name: "Kolam Masks",
      meaning: "Character masks",
      colors: "Natural wood tones",
      story: "Represent village characters in folk dramas",
      kidAppeal: "Funny characters like the village gossiper"
    },
    {
      name: "Sanni Masks",
      meaning: "Disease masks",
      colors: "Vibrant multi-colors",
      story: "18 masks representing different illnesses",
      kidAppeal: "Each mask has a unique silly expression"
    },
    {
      name: "Animal Masks",
      meaning: "Nature spirits",
      colors: "Browns, greens, oranges",
      story: "Peacocks, monkeys, and mythical birds",
      kidAppeal: "Kids love painting animal features"
    },
    {
      name: "Naga (Cobra) Mask",
      meaning: "Serpent king",
      colors: "Green with golden details",
      story: "Protector spirit in Buddhist culture",
      kidAppeal: "Cool snake design with multiple heads"
    }
  ];

  const workshopActivities = [
    {
      activity: "Welcome & History",
      duration: "20 minutes",
      description: "Learn about mask traditions through stories",
      kidsFocus: "Interactive storytelling with mask demonstrations"
    },
    {
      activity: "Design Selection",
      duration: "15 minutes",
      description: "Choose from templates or create your own",
      kidsFocus: "Kids pick their favorite character or animal"
    },
    {
      activity: "Base Preparation",
      duration: "20 minutes",
      description: "Prepare the mask base for painting",
      kidsFocus: "Hands-on sanding and priming (safe materials)"
    },
    {
      activity: "Painting Time",
      duration: "45 minutes",
      description: "Paint your mask with traditional colors",
      kidsFocus: "The fun part! Express creativity with guidance"
    },
    {
      activity: "Detail Work",
      duration: "30 minutes",
      description: "Add finishing touches and decorations",
      kidsFocus: "Glitter, sequins, and final details"
    },
    {
      activity: "Mask Dance Demo",
      duration: "20 minutes",
      description: "See traditional mask dances performed",
      kidsFocus: "Kids can try simple dance moves"
    }
  ];

  const familyPackages = [
    {
      title: "Basic Mask Making",
      price: "$30",
      priceUnit: "per person",
      childPrice: "$20 per child (5-12 years)",
      duration: "2 hours",
      includes: [
        "Pre-made mask base",
        "All painting materials",
        "Expert guidance",
        "Take home your mask",
        "Welcome drink",
        "Certificate of completion"
      ],
      highlights: ["Perfect introduction", "Quick and fun", "Great souvenir"]
    },
    {
      title: "Full Cultural Experience",
      price: "$50",
      priceUnit: "per person",
      childPrice: "$30 per child",
      duration: "3.5 hours",
      includes: [
        "Complete mask making",
        "Mask dance performance",
        "Traditional snacks",
        "Photo with dancers",
        "Mini mask keychain gift",
        "Cultural booklet"
      ],
      highlights: ["Complete experience", "Dance performance", "Extra activities"]
    },
    {
      title: "Master Artist Workshop",
      price: "$75",
      priceUnit: "per person",
      childPrice: "$45 per child",
      duration: "Half day",
      includes: [
        "Premium mask selection",
        "One-on-one with master",
        "Advanced techniques",
        "Lunch included",
        "Two masks per person",
        "Video of your experience",
        "Transport from hotel"
      ],
      highlights: ["VIP experience", "Learn from masters", "Multiple creations"]
    }
  ];

  const preparationTips = {
    "What to Wear": [
      "Old clothes or bring an apron",
      "Closed-toe shoes recommended",
      "Hair ties for long hair",
      "Comfortable clothing for sitting"
    ],
    "What We Provide": [
      "All art materials and tools",
      "Protective aprons",
      "Hand washing stations",
      "Safe, non-toxic paints",
      "Brushes of all sizes",
      "Drying and packing materials"
    ],
    "Good to Know": [
      "Masks need 2 hours to dry completely",
      "We can ship if not dry by departure",
      "Photography is encouraged",
      "Materials are child-safe",
      "Instructors speak English",
      "Wheelchair accessible venue"
    ]
  };

  const ageRecommendations = [
    {
      ageGroup: "4-6 years",
      recommendation: "Simple designs with help",
      tips: ["Parent participation helpful", "Focus on fun over perfection", "Shorter attention span considered"],
      bestMask: "Animal masks with basic colors"
    },
    {
      ageGroup: "7-10 years",
      recommendation: "Perfect age for full experience",
      tips: ["Can handle detailed work", "Love the stories behind masks", "Proud of their creations"],
      bestMask: "Character masks with personality"
    },
    {
      ageGroup: "11-14 years",
      recommendation: "Appreciate cultural significance",
      tips: ["Interested in techniques", "Can try complex designs", "Enjoy the artistic challenge"],
      bestMask: "Traditional demon or deity masks"
    },
    {
      ageGroup: "Adults",
      recommendation: "Full artistic and cultural immersion",
      tips: ["Can assist younger children", "Appreciate craftsmanship", "Great family bonding"],
      bestMask: "Any traditional design"
    }
  ];

  const faqs = [
    {
      question: "Do kids need artistic experience?",
      answer: "Not at all! The workshop is designed for all skill levels. Our instructors guide children step-by-step, and the focus is on fun and cultural experience rather than perfection. Even very young children can create beautiful masks with help."
    },
    {
      question: "Are the materials safe for children?",
      answer: "Yes, absolutely. We use only non-toxic, water-based paints and child-safe materials. All tools are age-appropriate, and sharp implements are only used by instructors. The venue is clean and well-ventilated."
    },
    {
      question: "Can we take the masks home immediately?",
      answer: "Masks need about 2 hours to dry completely. If you're leaving soon, we can arrange careful packing or shipping to your hotel. Small masks usually dry faster and can often be taken the same day."
    },
    {
      question: "What if my child loses interest halfway?",
      answer: "Our instructors are experienced with children and keep activities engaging. There's a play area for breaks, and parents can help complete the mask. The dance demonstration often re-energizes kids who need a break from painting."
    },
    {
      question: "Is photography allowed during the workshop?",
      answer: "Yes! We encourage photos and videos. The workshop is very photogenic, and kids love showing off their creations. We also have a photo spot with completed masks and traditional costumes."
    },
    {
      question: "Do you accommodate food allergies for snacks?",
      answer: "Yes, please inform us of any allergies when booking. Our traditional snacks include fruits, local sweets, and drinks. We can provide alternatives for common allergies."
    }
  ];

  const handleBookPackage = (packageTitle: string) => {
    setSelectedPackage(packageTitle);
    setIsBookingOpen(true);
  };

  return (
    <>
      <Helmet>
        <title>Sri Lankan Mask Making Workshop for Kids | Cultural Art Experience | Recharge Travels</title>
        <meta name="description" content="Join a fun family mask-making workshop in Sri Lanka. Kids learn traditional art, paint colorful masks, and discover cultural stories in this hands-on creative experience." />
        <meta name="keywords" content="Sri Lankan mask workshop, kids art activities, cultural workshop, family activities Colombo, traditional crafts" />
        <meta property="og:title" content="Traditional Mask Making Workshop - Fun Art for Kids" />
        <meta property="og:description" content="Create colorful Sri Lankan masks in a family-friendly workshop. Perfect activity for creative kids who love art and culture!" />
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
              <Badge className="mb-4 bg-purple-600/90 text-white px-4 py-1">
                <Palette className="w-4 h-4 mr-1" />
                Cultural Art Workshop
              </Badge>
              <h1 className="text-5xl md:text-6xl font-bold mb-6">
                Traditional Mask Making for Kids
              </h1>
              <p className="text-xl mb-8 text-gray-100">
                Create your own colorful Sri Lankan mask while learning ancient stories and traditions in a fun, hands-on workshop
              </p>
              <div className="flex gap-4 justify-center">
                <Button 
                  size="lg" 
                  onClick={() => handleBookPackage("Basic Mask Making")}
                  className="bg-purple-600 hover:bg-purple-700"
                >
                  <Brush className="w-5 h-5 mr-2" />
                  Book Workshop
                </Button>
                <Button 
                  size="lg" 
                  variant="outline"
                  className="bg-white/10 backdrop-blur-sm text-white border-white/30 hover:bg-white/20"
                  onClick={() => document.getElementById('masks')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  Explore Mask Types
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

        {/* Why Mask Making for Kids */}
        <section className="py-16 px-4 bg-white">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-4xl font-bold mb-4">Why Kids Love Mask Making</h2>
              <p className="text-lg text-gray-600">A perfect blend of creativity, culture, and hands-on fun</p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-6">
              {[
                {
                  icon: Palette,
                  title: "Creative Expression",
                  description: "Kids freely express themselves through colors and designs"
                },
                {
                  icon: Drama,
                  title: "Cultural Stories",
                  description: "Learn fascinating tales behind each mask character"
                },
                {
                  icon: Gift,
                  title: "Take Home Treasure",
                  description: "Create a unique souvenir that tells a story"
                },
                {
                  icon: Smile,
                  title: "Fun & Engaging",
                  description: "Hands-on activity that keeps kids entertained for hours"
                },
                {
                  icon: Award,
                  title: "Sense of Achievement",
                  description: "Pride in creating something beautiful with their own hands"
                },
                {
                  icon: Users,
                  title: "Family Bonding",
                  description: "Parents and kids create memories together"
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
                      <feature.icon className="w-12 h-12 text-purple-600 mb-4" />
                      <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                      <p className="text-gray-600">{feature.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Mask Types */}
        <section id="masks" className="py-16 px-4 bg-gray-50">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-4xl font-bold mb-4">Traditional Mask Types</h2>
              <p className="text-lg text-gray-600">Discover the colorful characters kids can create</p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {maskTypes.map((mask, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="h-full hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <CardTitle className="text-xl">{mask.name}</CardTitle>
                      <p className="text-sm text-gray-600 italic">{mask.meaning}</p>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex items-center gap-2">
                        <Palette className="w-4 h-4 text-purple-600" />
                        <span className="text-sm font-medium">Colors:</span>
                        <span className="text-sm text-gray-600">{mask.colors}</span>
                      </div>
                      <p className="text-sm text-gray-600">{mask.story}</p>
                      <div className="bg-purple-50 p-3 rounded-lg">
                        <p className="text-sm flex items-start gap-2">
                          <Baby className="w-4 h-4 text-purple-600 mt-0.5" />
                          <span className="text-purple-800">{mask.kidAppeal}</span>
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Workshop Activities */}
        <section className="py-16 px-4 bg-white">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-4xl font-bold mb-4">Workshop Journey</h2>
              <p className="text-lg text-gray-600">Step-by-step creative adventure</p>
            </motion.div>

            <div className="space-y-4">
              {workshopActivities.map((activity, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="overflow-hidden">
                    <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-xl flex items-center gap-3">
                          <div className="w-10 h-10 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold">
                            {index + 1}
                          </div>
                          {activity.activity}
                        </CardTitle>
                        <Badge variant="outline">
                          <Clock className="w-3 h-3 mr-1" />
                          {activity.duration}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-6">
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <h4 className="font-semibold mb-2">What happens:</h4>
                          <p className="text-gray-600">{activity.description}</p>
                        </div>
                        <div>
                          <h4 className="font-semibold mb-2 flex items-center gap-2">
                            <Sparkles className="w-4 h-4 text-purple-600" />
                            Kids Focus
                          </h4>
                          <p className="text-gray-600">{activity.kidsFocus}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            <Alert className="mt-8">
              <Music className="h-4 w-4" />
              <AlertDescription>
                <strong>Special Treat:</strong> At the end of the workshop, watch a mini performance of traditional mask dancing - kids can even try on performance masks for photos!
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
              <p className="text-lg text-gray-600">Tailored experiences for every young artist</p>
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
                        <Users className="w-5 h-5 text-purple-600" />
                        {age.ageGroup}
                      </CardTitle>
                      <p className="text-gray-600 mt-2">{age.recommendation}</p>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <h4 className="font-semibold mb-2">Workshop tips:</h4>
                        <ul className="space-y-1">
                          {age.tips.map((tip, idx) => (
                            <li key={idx} className="flex items-start gap-2 text-sm">
                              <CheckCircle className="w-4 h-4 text-green-600 mt-0.5" />
                              <span className="text-gray-600">{tip}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="bg-purple-50 p-3 rounded-lg">
                        <p className="text-sm">
                          <strong>Best mask choice:</strong> {age.bestMask}
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
              <h2 className="text-4xl font-bold mb-4">Workshop Packages</h2>
              <p className="text-lg text-gray-600">Choose your creative adventure</p>
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
                        <span className="text-3xl font-bold text-purple-600">{pkg.price}</span>
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
                              <div className="w-5 h-5 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                                <div className="w-2 h-2 bg-purple-600 rounded-full" />
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
                        Book This Workshop
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Preparation Tips */}
        <section className="py-16 px-4 bg-gray-50">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-4xl font-bold mb-4">Workshop Preparation</h2>
              <p className="text-lg text-gray-600">Everything you need to know before you arrive</p>
            </motion.div>

            <Tabs defaultValue="what-to-wear" className="space-y-8">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="what-to-wear">What to Wear</TabsTrigger>
                <TabsTrigger value="what-we-provide">We Provide</TabsTrigger>
                <TabsTrigger value="good-to-know">Good to Know</TabsTrigger>
              </TabsList>

              {Object.entries(preparationTips).map(([key, tips]) => (
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
                        {tips.map((tip, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <CheckCircle className="w-5 h-5 text-purple-600 mt-0.5" />
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
              <p className="text-lg text-gray-600">Common questions about the mask workshop</p>
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
        <section className="py-20 px-4 bg-gradient-to-br from-purple-600 to-pink-600 text-white">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl font-bold mb-6">
                Ready to Create Colorful Memories?
              </h2>
              <p className="text-xl mb-8 text-purple-100">
                Let your child's creativity shine in this unique cultural art experience
              </p>
              <div className="flex gap-4 justify-center flex-wrap">
                <Button 
                  size="lg" 
                  variant="secondary"
                  onClick={() => handleBookPackage("Basic Mask Making")}
                >
                  <Palette className="w-5 h-5 mr-2" />
                  Book Workshop
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
        itemTitle={selectedPackage || "Basic Mask Making"}
      />
    </>
  );
};

export default SriLankaMaskWorkshop;