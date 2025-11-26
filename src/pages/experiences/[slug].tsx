import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { collection, doc, getDoc, getDocs, query, where, orderBy, limit } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import EnhancedBookingModal from '@/components/EnhancedBookingModal';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Skeleton } from '@/components/ui/skeleton';
import { MapContainer, TileLayer, Polyline, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { 
  MapPin,
  Clock,
  DollarSign,
  Play,
  ChevronRight,
  Phone,
  Mail,
  Loader2,
  Navigation
} from 'lucide-react';
import type { Experience, Tour, FAQ } from '@/types/experience';

// Fix Leaflet default marker icons
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

const ExperiencePage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedTour, setSelectedTour] = useState<Tour | null>(null);

  // Fetch experience data from Firestore
  const { data: experience, isLoading: experienceLoading } = useQuery({
    queryKey: ['experience', slug],
    queryFn: async () => {
      if (!slug) throw new Error('No slug provided');
      
      const docRef = doc(db, 'experiences', slug);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return docSnap.data() as Experience;
      }
      
      // Fallback to local data if Firestore doesn't have it yet
      try {
        const response = await fetch(`/src/data/seed-${slug}.json`);
        if (response.ok) {
          return response.json() as Promise<Experience>;
        }
      } catch (error) {
        console.error('Error loading fallback data:', error);
      }
      
      throw new Error('Experience not found');
    },
    enabled: !!slug,
  });

  // Fetch live tours
  const { data: tours, isLoading: toursLoading } = useQuery({
    queryKey: ['tours', slug],
    queryFn: async () => {
      if (!slug) return [];
      
      const toursQuery = query(
        collection(db, 'tours'),
        where('experienceSlug', '==', slug),
        where('isPublished', '==', true),
        orderBy('salePriceUSD', 'asc'),
        limit(6)
      );
      const querySnapshot = await getDocs(toursQuery);
      return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Tour));
    },
    enabled: !!slug,
  });

  // Fetch FAQs
  const { data: faqs, isLoading: faqsLoading } = useQuery({
    queryKey: ['faqs', experience?.faqTag],
    queryFn: async () => {
      if (!experience?.faqTag) return [];
      
      const faqsQuery = query(
        collection(db, 'faqs'),
        where('tag', '==', experience.faqTag),
        orderBy('order', 'asc')
      );
      const querySnapshot = await getDocs(faqsQuery);
      return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as FAQ));
    },
    enabled: !!experience?.faqTag,
  });

  const handleBookTour = (tour: Tour) => {
    setSelectedTour(tour);
    setShowBookingModal(true);
  };

  if (experienceLoading) {
    return (
      <div className="min-h-screen">
        <Header />
        <div className="container max-w-7xl mx-auto px-4 py-12">
          <div className="space-y-8">
            <Skeleton className="h-96 w-full" />
            <Skeleton className="h-32 w-3/4" />
            <Skeleton className="h-48 w-full" />
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!experience) {
    return (
      <div className="min-h-screen">
        <Header />
        <div className="container max-w-7xl mx-auto px-4 py-12">
          <p className="text-center text-gray-600">Experience not found.</p>
        </div>
        <Footer />
      </div>
    );
  }

  // Generate JSON-LD structured data
  const jsonLdTouristAttraction = {
    "@context": "https://schema.org",
    "@type": "TouristAttraction",
    "name": experience.name,
    "description": experience.seo.description,
    "image": experience.heroImageURL,
    "address": {
      "@type": "PostalAddress",
      "addressCountry": "LK"
    }
  };

  const jsonLdBreadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://rechargetravels.com"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Experiences",
        "item": "https://rechargetravels.com/experiences"
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": experience.name,
        "item": `https://rechargetravels.com/experiences/${experience.slug}`
      }
    ]
  };

  const jsonLdFAQPage = faqs && faqs.length > 0 ? {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  } : null;

  const jsonLdItemList = tours && tours.length > 0 ? {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "itemListElement": tours.map((tour, index) => ({
      "@type": "Product",
      "position": index + 1,
      "name": tour.title,
      "description": tour.description || tour.title,
      "offers": {
        "@type": "Offer",
        "price": tour.salePriceUSD,
        "priceCurrency": "USD"
      }
    }))
  } : null;

  return (
    <>
      <Helmet>
        <title>{experience.seo.title}</title>
        <meta name="description" content={experience.seo.description} />
        <link rel="canonical" href={`https://rechargetravels.com/experiences/${experience.slug}`} />
        
        {/* Open Graph */}
        <meta property="og:title" content={experience.seo.title} />
        <meta property="og:description" content={experience.seo.description} />
        <meta property="og:image" content={experience.heroImageURL} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`https://rechargetravels.com/experiences/${experience.slug}`} />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={experience.seo.title} />
        <meta name="twitter:description" content={experience.seo.description} />
        <meta name="twitter:image" content={experience.heroImageURL} />
        
        {/* Preload hero image */}
        <link rel="preload" as="image" href={experience.heroImageURL} />
        
        {/* JSON-LD */}
        <script type="application/ld+json">
          {JSON.stringify(jsonLdTouristAttraction)}
        </script>
        <script type="application/ld+json">
          {JSON.stringify(jsonLdBreadcrumb)}
        </script>
        {jsonLdFAQPage && (
          <script type="application/ld+json">
            {JSON.stringify(jsonLdFAQPage)}
          </script>
        )}
        {jsonLdItemList && (
          <script type="application/ld+json">
            {JSON.stringify(jsonLdItemList)}
          </script>
        )}
      </Helmet>

      <div className="min-h-screen bg-white">
        <Header />

        {/* Hero Section */}
        <section data-block="hero" className="relative h-[60vh] min-h-[400px] overflow-hidden">
          <div className="absolute inset-0">
            <img
              src={experience.heroImageURL}
              alt={experience.name}
              className="w-full h-full object-cover"
              loading="eager"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
          </div>
          <div className="relative container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-end pb-12">
            <motion.h1 
              className="text-4xl md:text-5xl lg:text-6xl font-bold text-white tracking-tight drop-shadow-lg"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              {experience.name}
            </motion.h1>
          </div>
        </section>

        {/* Intro Section */}
        <section data-block="intro" className="py-12 md:py-16">
          <div className="container max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div 
              className="prose prose-lg mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <p className="text-gray-700 leading-relaxed">
                {experience.introParagraph}
              </p>
            </motion.div>
          </div>
        </section>

        {/* Highlights Section */}
        <section data-block="highlights" className="py-12 bg-gray-50">
          <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div 
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              {experience.highlights.map((highlight, index) => (
                <motion.div
                  key={index}
                  className="bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transition-all duration-200"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 * index }}
                  whileHover={{ y: -5 }}
                >
                  <div className="text-4xl mb-4">{highlight.icon}</div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {highlight.title}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {highlight.blurb60}
                  </p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Routes Section */}
        <section data-block="routes" className="py-12 md:py-16">
          <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
              Tour Routes
            </h2>
            <div className="space-y-8">
              {experience.routes.map((route, index) => (
                <Card key={index} className="overflow-hidden shadow-md hover:shadow-xl transition-all duration-200">
                  <div className="grid md:grid-cols-2 gap-0">
                    <div className="h-64 md:h-auto">
                      <MapContainer
                        center={[7.8731, 80.7718]} // Sri Lanka center
                        zoom={7}
                        className="h-full w-full"
                        scrollWheelZoom={false}
                      >
                        <TileLayer
                          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        />
                      </MapContainer>
                    </div>
                    <CardContent className="p-6">
                      <h3 className="text-xl font-semibold text-gray-900 mb-4">
                        {route.routeName}
                      </h3>
                      <div className="space-y-3">
                        <div className="flex items-center gap-2 text-gray-600">
                          <Clock className="w-4 h-4" />
                          <span>Duration: {route.duration}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                          <MapPin className="w-4 h-4" />
                          <span>Distance: {route.distanceKm} km</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                          <Navigation className="w-4 h-4" />
                          <span>Transport: {route.bestClass}</span>
                        </div>
                      </div>
                    </CardContent>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Gallery Section */}
        <section data-block="gallery" className="py-12 bg-gray-50">
          <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
              Photo Gallery
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {experience.galleryImages.map((image, index) => (
                <motion.div
                  key={index}
                  className="relative overflow-hidden rounded-2xl shadow-md hover:shadow-xl transition-all duration-200"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.1 * index }}
                  whileHover={{ scale: 1.05 }}
                >
                  <img
                    src={image.url}
                    alt={image.alt}
                    className="w-full h-64 object-cover"
                    loading="lazy"
                  />
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Live Tours Section */}
        <section data-block="live-tours" className="py-12 md:py-16">
          <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
              Available Tours
            </h2>
            {toursLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <Skeleton key={i} className="h-80 rounded-2xl" />
                ))}
              </div>
            ) : tours && tours.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {tours.map((tour) => (
                  <Card key={tour.id} className="overflow-hidden shadow-md hover:shadow-xl transition-all duration-200">
                    <div className="relative h-48">
                      <img
                        src={tour.thumbnail}
                        alt={tour.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-2 left-2 flex flex-wrap gap-2">
                        {tour.badges.map((badge, idx) => (
                          <Badge key={idx} variant="secondary" className="bg-white/90">
                            {badge}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <CardContent className="p-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {tour.title}
                      </h3>
                      <div className="flex items-center gap-2 text-gray-600 mb-4">
                        <Clock className="w-4 h-4" />
                        <span className="text-sm">{tour.duration}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-2xl font-bold text-primary">
                            From US${tour.salePriceUSD}
                          </span>
                          {tour.regularPriceUSD && tour.regularPriceUSD > tour.salePriceUSD && (
                            <span className="text-sm text-gray-500 line-through ml-2">
                              US${tour.regularPriceUSD}
                            </span>
                          )}
                        </div>
                        <Button 
                          size="sm"
                          onClick={() => handleBookTour(tour)}
                          className="bg-primary hover:bg-primary/90"
                        >
                          Book Now
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-600">No tours available at the moment.</p>
            )}
          </div>
        </section>

        {/* Video Section */}
        {experience.videoURL && (
          <section data-block="video" className="py-12 bg-gray-50">
            <div className="container max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
                Experience Video
              </h2>
              <div className="relative pb-[56.25%] h-0 overflow-hidden rounded-2xl shadow-lg">
                <iframe
                  src={experience.videoURL}
                  title={`${experience.name} Video`}
                  className="absolute top-0 left-0 w-full h-full"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </div>
          </section>
        )}

        {/* FAQs Section */}
        <section data-block="faqs" className="py-12 md:py-16">
          <div className="container max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
              Frequently Asked Questions
            </h2>
            {faqsLoading ? (
              <div className="space-y-4">
                {[...Array(4)].map((_, i) => (
                  <Skeleton key={i} className="h-20" />
                ))}
              </div>
            ) : faqs && faqs.length > 0 ? (
              <Accordion type="single" collapsible className="w-full">
                {faqs.map((faq) => (
                  <AccordionItem key={faq.id} value={faq.id || `faq-${faq.order}`}>
                    <AccordionTrigger className="text-left">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent>
                      <p className="text-gray-600">{faq.answer}</p>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            ) : (
              <p className="text-center text-gray-600">No FAQs available yet.</p>
            )}
          </div>
        </section>

        {/* CTA Section */}
        <section data-block="cta" className="relative py-24 overflow-hidden">
          <div 
            className="absolute inset-0 bg-cover bg-center bg-fixed"
            style={{ backgroundImage: `url(${experience.heroImageURL})` }}
          >
            <div className="absolute inset-0 bg-black/60" />
          </div>
          <div className="relative container max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
                {experience.ctaHeadline}
              </h2>
              <p className="text-xl text-white/90 mb-8">
                {experience.ctaSub}
              </p>
              <Button 
                size="lg" 
                className="bg-accent hover:bg-accent/90 text-white"
                onClick={() => window.location.href = '/contact'}
              >
                Contact Us Now
                <ChevronRight className="ml-2 h-5 w-5" />
              </Button>
            </motion.div>
          </div>
        </section>

        {/* Contact Form Section */}
        <section data-block="form" className="py-12 md:py-16 bg-gray-50">
          <div className="container max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="text-2xl text-center">
                  Quick Inquiry Form
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form className="space-y-6" name={`${experience.slug}-inquiry`} method="POST" data-netlify="true">
                  <input type="hidden" name="form-name" value={`${experience.slug}-inquiry`} />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        name="name"
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email *
                      </label>
                      <input
                        type="email"
                        name="email"
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Preferred Date
                      </label>
                      <input
                        type="date"
                        name="date"
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Message
                    </label>
                    <textarea
                      name="message"
                      rows={4}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                      placeholder={`Tell us about your ${experience.name.toLowerCase()} interests...`}
                    />
                  </div>
                  <Button type="submit" className="w-full bg-primary hover:bg-primary/90">
                    Send Inquiry
                  </Button>
                </form>
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <div className="flex flex-col sm:flex-row justify-center items-center gap-4 text-sm text-gray-600">
                    <a href="tel:+94123456789" className="flex items-center gap-2 hover:text-primary">
                      <Phone className="w-4 h-4" />
                      +94 12 345 6789
                    </a>
                    <a href="mailto:info@rechargetravels.com" className="flex items-center gap-2 hover:text-primary">
                      <Mail className="w-4 h-4" />
                      info@rechargetravels.com
                    </a>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        <Footer />

        {/* Booking Modal */}
        <AnimatePresence>
          {showBookingModal && selectedTour && (
            <EnhancedBookingModal
              isOpen={showBookingModal}
              onClose={() => {
                setShowBookingModal(false);
                setSelectedTour(null);
              }}
              type="tour"
              itemTitle={selectedTour.title}
              tourData={{
                id: selectedTour.id || '',
                name: selectedTour.title,
                price: selectedTour.salePriceUSD,
                duration: selectedTour.duration,
                description: selectedTour.description,
                features: selectedTour.highlights
              }}
            />
          )}
        </AnimatePresence>
      </div>
    </>
  );
};

export default ExperiencePage;