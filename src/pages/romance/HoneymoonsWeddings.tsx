import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import {
  Heart,
  MapPin,
  Calendar,
  Users,
  Star,
  Check,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Camera,
  Plane,
  Hotel,
  Car,
  Coffee,
  Waves,
  Mountain,
  TreePine,
  Music,
  Palette,
  Phone,
  Mail,
  ArrowRight,
  Clock,
  DollarSign,
  Plus,
  X,
  Send
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import type { RomanceLandingData } from '@/types/romance';
import seedData from '@/data/seed-honeymoons-weddings.json';

// Import images (these would be in your public folder or CDN)
const images = {
  hero: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=3870',
  honeymoonBudget: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?q=80&w=3870',
  honeymoonSignature: 'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?q=80&w=3870',
  honeymoonLuxury: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=3870',
  weddingElopement: 'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?q=80&w=3870',
  weddingSignature: 'https://images.unsplash.com/photo-1606800052052-a08af7148866?q=80&w=3870',
  weddingGrand: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?q=80&w=3870',
  gallery1: 'https://images.unsplash.com/photo-1529636798458-92182e662485?q=80&w=3870',
  gallery2: 'https://images.unsplash.com/photo-1522413452208-996ff3f3e740?q=80&w=3870',
  gallery3: 'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=3870',
  gallery4: 'https://images.unsplash.com/photo-1583037189850-1921ae7c6c22?q=80&w=3870'
};

const HoneymoonsWeddings: React.FC = () => {
  const [data] = useState<RomanceLandingData>(seedData as RomanceLandingData);
  const [selectedPackageType, setSelectedPackageType] = useState<'honeymoon' | 'wedding'>('honeymoon');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    packageType: '',
    preferredDate: '',
    guests: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Generate JSON-LD structured data
  const generateJSONLD = () => {
    const jsonLd = {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'WebPage',
          '@id': `https://rechargetravels.com/romance/${data.slug}`,
          name: data.seo.title,
          description: data.seo.description,
          url: `https://rechargetravels.com/romance/${data.slug}`,
          isPartOf: {
            '@type': 'WebSite',
            '@id': 'https://rechargetravels.com/#website',
            name: 'Recharge Travels Sri Lanka',
            url: 'https://rechargetravels.com'
          }
        },
        {
          '@type': 'FAQPage',
          mainEntity: data.faq.map(item => ({
            '@type': 'Question',
            name: item.q,
            acceptedAnswer: {
              '@type': 'Answer',
              text: item.a
            }
          }))
        },
        ...data.honeymoons.tiers.map(tier => ({
          '@type': 'Product',
          name: `${tier.name} Honeymoon Package`,
          description: tier.highlights.join(', '),
          offers: {
            '@type': 'Offer',
            price: tier.priceFromUSD,
            priceCurrency: 'USD',
            availability: 'https://schema.org/InStock',
            priceValidUntil: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString()
          }
        })),
        ...data.weddings.packages.map(pkg => ({
          '@type': 'Product',
          name: `${pkg.name} Wedding Package`,
          description: pkg.includes.join(', '),
          offers: {
            '@type': 'Offer',
            price: pkg.priceFromUSD,
            priceCurrency: 'USD',
            availability: 'https://schema.org/InStock',
            priceValidUntil: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString()
          }
        }))
      ]
    };
    return JSON.stringify(jsonLd);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setShowSuccess(true);
      setFormData({
        name: '',
        email: '',
        phone: '',
        packageType: '',
        preferredDate: '',
        guests: '',
        message: ''
      });
      
      setTimeout(() => setShowSuccess(false), 5000);
    }, 1500);
  };

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <>
      <Helmet>
        <title>{data.seo.title}</title>
        <meta name="description" content={data.seo.description} />
        <meta property="og:title" content={data.seo.title} />
        <meta property="og:description" content={data.seo.description} />
        <meta property="og:image" content={data.seo.ogImageURL} />
        <meta property="og:type" content="website" />
        <link rel="canonical" href={`https://rechargetravels.com/romance/${data.slug}`} />
        <script type="application/ld+json">{generateJSONLD()}</script>
      </Helmet>

      {/* Hero Section */}
      <section data-block="hero" className="relative h-screen min-h-[600px] overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={images.hero}
            alt="Romantic Sri Lanka"
            className="w-full h-full object-cover"
            loading="eager"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/50" />
        </div>
        
        <div className="relative z-10 h-full flex items-center justify-center text-white">
          <div className="text-center max-w-4xl mx-auto px-4">
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6"
            >
              {data.hero.headline}
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-xl md:text-2xl mb-8 font-light"
            >
              {data.hero.subheadline}
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Button
                size="lg"
                onClick={() => scrollToSection('form')}
                className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-6 text-lg"
              >
                {data.hero.ctaPrimary}
                <Heart className="ml-2 h-5 w-5" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => scrollToSection('packages')}
                className="border-white text-white hover:bg-white hover:text-black px-8 py-6 text-lg"
              >
                {data.hero.ctaSecondary}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </motion.div>
          </div>
        </div>
        
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <ChevronDown className="h-8 w-8 text-white" />
        </div>
      </section>

      {/* Why Sri Lanka for Romance */}
      <section data-block="why-sri-lanka-for-romance" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Why Choose Sri Lanka for Your
              <span className="text-orange-500"> Love Story?</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              From pristine beaches to misty mountains, ancient temples to luxury resorts, 
              Sri Lanka offers the perfect backdrop for romance
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: Waves, title: 'Pristine Beaches', desc: 'Miles of golden sand and turquoise waters' },
              { icon: Mountain, title: 'Hill Country Romance', desc: 'Tea estates and cool mountain retreats' },
              { icon: Hotel, title: 'Luxury Resorts', desc: 'World-class accommodations and spas' },
              { icon: Heart, title: 'Intimate Experiences', desc: 'Private dinners and exclusive activities' }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <item.icon className="h-10 w-10 text-orange-500" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                <p className="text-gray-600">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Packages Section */}
      <section data-block="packages" id="packages" className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Choose Your Perfect
              <span className="text-orange-500"> Package</span>
            </h2>
          </motion.div>

          <Tabs defaultValue="honeymoon" className="mb-16">
            <TabsList className="grid w-full max-w-md mx-auto grid-cols-2">
              <TabsTrigger value="honeymoon">Honeymoon Packages</TabsTrigger>
              <TabsTrigger value="wedding">Wedding Packages</TabsTrigger>
            </TabsList>

            {/* Honeymoon Packages */}
            <TabsContent value="honeymoon" className="mt-12">
              <div className="text-center mb-8">
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                  {data.honeymoons.intro}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {data.honeymoons.tiers.map((tier, index) => (
                  <motion.div
                    key={tier.id}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: index * 0.1 }}
                  >
                    <Card className={`h-full ${index === 1 ? 'border-orange-500 border-2' : ''}`}>
                      {index === 1 && (
                        <div className="bg-orange-500 text-white text-center py-2 text-sm font-semibold">
                          MOST POPULAR
                        </div>
                      )}
                      <CardHeader>
                        <CardTitle className="text-2xl">{tier.name}</CardTitle>
                        <CardDescription>
                          <div className="flex items-baseline gap-2 mt-2">
                            <span className="text-3xl font-bold text-gray-900">
                              ${tier.priceFromUSD.toLocaleString()}
                            </span>
                            <span className="text-gray-600">/ couple</span>
                          </div>
                          <Badge variant="secondary" className="mt-2">
                            {tier.nights} nights
                          </Badge>
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        <div>
                          <h4 className="font-semibold mb-3">Highlights</h4>
                          <ul className="space-y-2">
                            {tier.highlights.map((highlight, i) => (
                              <li key={i} className="flex items-start gap-2">
                                <Sparkles className="h-4 w-4 text-orange-500 mt-0.5 flex-shrink-0" />
                                <span className="text-sm">{highlight}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                        
                        <Separator />
                        
                        <div>
                          <h4 className="font-semibold mb-3">What's Included</h4>
                          <ul className="space-y-2">
                            {tier.whatsIncluded.map((item, i) => (
                              <li key={i} className="flex items-start gap-2">
                                <Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                                <span className="text-sm">{item}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                        
                        <Button
                          className="w-full"
                          onClick={() => {
                            setFormData({ ...formData, packageType: tier.slug });
                            scrollToSection('form');
                          }}
                        >
                          Choose This Package
                        </Button>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </TabsContent>

            {/* Wedding Packages */}
            <TabsContent value="wedding" className="mt-12">
              <div className="text-center mb-8">
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                  {data.weddings.intro}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {data.weddings.packages.map((pkg, index) => (
                  <motion.div
                    key={pkg.id}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: index * 0.1 }}
                  >
                    <Card className={`h-full ${index === 1 ? 'border-orange-500 border-2' : ''}`}>
                      {index === 1 && (
                        <div className="bg-orange-500 text-white text-center py-2 text-sm font-semibold">
                          MOST POPULAR
                        </div>
                      )}
                      <CardHeader>
                        <CardTitle className="text-2xl">{pkg.name}</CardTitle>
                        <CardDescription>
                          <div className="flex items-baseline gap-2 mt-2">
                            <span className="text-3xl font-bold text-gray-900">
                              ${pkg.priceFromUSD.toLocaleString()}
                            </span>
                            <span className="text-gray-600">/ package</span>
                          </div>
                          <Badge variant="secondary" className="mt-2">
                            Up to {pkg.guestsUpTo} guests
                          </Badge>
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        <div>
                          <h4 className="font-semibold mb-3">What's Included</h4>
                          <ul className="space-y-2">
                            {pkg.includes.map((item, i) => (
                              <li key={i} className="flex items-start gap-2">
                                <Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                                <span className="text-sm">{item}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                        
                        <Button
                          className="w-full"
                          onClick={() => {
                            setFormData({ ...formData, packageType: pkg.slug });
                            scrollToSection('form');
                          }}
                        >
                          Choose This Package
                        </Button>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>

              <div className="mt-8 p-6 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-800">
                  <strong>Note:</strong> {data.weddings.complianceNote}
                </p>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Sample Itinerary */}
      <section data-block="honeymoon-itinerary" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Sample Honeymoon
              <span className="text-orange-500"> Itinerary</span>
            </h2>
          </motion.div>

          {data.honeymoons.sampleItineraries.map((itinerary, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="max-w-4xl mx-auto"
            >
              <h3 className="text-2xl font-semibold mb-6 text-center text-gray-800">{itinerary.title}</h3>
              
              <Accordion type="single" collapsible className="w-full">
                {itinerary.days.map((day) => (
                  <AccordionItem key={day.day} value={`day-${day.day}`}>
                    <AccordionTrigger className="text-left hover:no-underline">
                      <div className="flex items-center gap-4">
                        <Badge className="bg-rose-500 text-white">
                          Day {day.day}
                        </Badge>
                        <span className="font-medium text-rose-700">{day.title}</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <p className="text-rose-600 pl-20">{day.detail}</p>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Wedding Venues */}
      <section data-block="wedding-venues" className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Stunning Wedding
              <span className="text-orange-500"> Venues</span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {data.weddings.venues.map((venue, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
              >
                <Card className="h-full hover:shadow-xl transition-shadow">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MapPin className="h-5 w-5 text-orange-500" />
                      {venue.type}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {venue.examples.map((example, i) => (
                        <li key={i} className="text-gray-600">• {example}</li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Add-ons */}
      <section data-block="add-ons" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Enhance Your
              <span className="text-orange-500"> Experience</span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            <div>
              <h3 className="text-2xl font-semibold mb-6 flex items-center gap-2">
                <Sparkles className="h-6 w-6 text-orange-500" />
                Wedding Add-Ons
              </h3>
              <ul className="space-y-3">
                {data.weddings.addOns.map((addon, index) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="flex items-start gap-3"
                  >
                    <Plus className="h-5 w-5 text-orange-500 mt-0.5" />
                    <span>{addon}</span>
                  </motion.li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-2xl font-semibold mb-6 flex items-center gap-2">
                <Heart className="h-6 w-6 text-orange-500" />
                Activities & Experiences
              </h3>
              <ul className="space-y-3">
                {data.activitiesAddOns.map((activity, index) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="flex items-start gap-3"
                  >
                    <Plus className="h-5 w-5 text-orange-500 mt-0.5" />
                    <span>{activity}</span>
                  </motion.li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Gallery */}
      <section data-block="gallery" className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Picture Your Perfect
              <span className="text-orange-500"> Moments</span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[images.gallery1, images.gallery2, images.gallery3, images.gallery4].map((img, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="relative aspect-square overflow-hidden rounded-lg group cursor-pointer"
              >
                <img
                  src={img}
                  alt={`Romance in Sri Lanka ${index + 1}`}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section data-block="testimonials" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Love Stories from
              <span className="text-orange-500"> Happy Couples</span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {data.testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
              >
                <Card className="h-full">
                  <CardContent className="pt-6">
                    <div className="flex gap-1 mb-4">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-5 w-5 fill-orange-500 text-orange-500" />
                      ))}
                    </div>
                    <p className="text-gray-600 mb-4 italic">"{testimonial.text}"</p>
                    <p className="font-semibold">— {testimonial.name}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section data-block="faqs" className="py-20">
        <div className="max-w-4xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Frequently Asked
              <span className="text-orange-500"> Questions</span>
            </h2>
          </motion.div>

          <Accordion type="single" collapsible className="w-full">
            {data.faq.map((item, index) => (
              <AccordionItem key={index} value={`faq-${index}`}>
                <AccordionTrigger className="text-left">
                  {item.q}
                </AccordionTrigger>
                <AccordionContent>
                  <p className="text-gray-600">{item.a}</p>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* CTA Section */}
      <section data-block="cta" className="py-20 bg-orange-500">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              {data.cta.headline}
            </h2>
            <Button
              size="lg"
              variant="secondary"
              onClick={() => scrollToSection('form')}
              className="bg-white text-orange-500 hover:bg-gray-100"
            >
              {data.cta.button}
              <Heart className="ml-2 h-5 w-5" />
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Contact Form */}
      <section data-block="form" id="form" className="py-20">
        <div className="max-w-4xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Start Planning Your
              <span className="text-orange-500"> Dream Experience</span>
            </h2>
          </motion.div>

          <Card>
            <CardContent className="p-8">
              <form onSubmit={handleFormSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">Your Name *</Label>
                    <Input
                      id="name"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="John & Jane Doe"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="couple@example.com"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+1 234 567 8900"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="packageType">Package Interest</Label>
                    <Select
                      value={formData.packageType}
                      onValueChange={(value) => setFormData({ ...formData, packageType: value })}
                    >
                      <SelectTrigger id="packageType">
                        <SelectValue placeholder="Select a package" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="honeymoon-budget-bliss">Budget Bliss Honeymoon</SelectItem>
                        <SelectItem value="honeymoon-signature-romance">Signature Romance Honeymoon</SelectItem>
                        <SelectItem value="honeymoon-ultra-luxe">Ultra-Luxe Honeymoon</SelectItem>
                        <SelectItem value="wedding-elopement">Intimate Elopement</SelectItem>
                        <SelectItem value="wedding-signature-beach">Signature Beach Wedding</SelectItem>
                        <SelectItem value="wedding-grand-cultural">Grand Cultural Wedding</SelectItem>
                        <SelectItem value="custom">Custom Package</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="preferredDate">Preferred Date</Label>
                    <Input
                      id="preferredDate"
                      type="date"
                      value={formData.preferredDate}
                      onChange={(e) => setFormData({ ...formData, preferredDate: e.target.value })}
                      min={new Date().toISOString().split('T')[0]}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="guests">Number of Guests (for weddings)</Label>
                    <Input
                      id="guests"
                      type="number"
                      value={formData.guests}
                      onChange={(e) => setFormData({ ...formData, guests: e.target.value })}
                      placeholder="50"
                      min="2"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">Tell Us About Your Dream</Label>
                  <Textarea
                    id="message"
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Share your vision, special requests, or any questions..."
                    rows={4}
                  />
                </div>

                <Button
                  type="submit"
                  size="lg"
                  className="w-full"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>Sending...</>
                  ) : (
                    <>
                      Send My Request
                      <Send className="ml-2 h-5 w-5" />
                    </>
                  )}
                </Button>
              </form>

              {showSuccess && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg"
                >
                  <p className="text-green-800">
                    {data.contactForm.successMessage}
                  </p>
                </motion.div>
              )}
            </CardContent>
          </Card>

          <div className="mt-8 text-center space-y-4">
            <p className="text-gray-600">Prefer to speak directly?</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="tel:+94777721999"
                className="inline-flex items-center gap-2 text-orange-500 hover:text-orange-600"
              >
                <Phone className="h-5 w-5" />
                +94 7777 21 999
              </a>
              <a
                href="mailto:romance@rechargetravels.com"
                className="inline-flex items-center gap-2 text-orange-500 hover:text-orange-600"
              >
                <Mail className="h-5 w-5" />
                romance@rechargetravels.com
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default HoneymoonsWeddings;