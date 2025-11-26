import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useAboutSriLankaContent } from '@/hooks/useAboutSriLankaContent';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Globe, Users, Leaf, Award, MapPin, Camera, 
  Play, X, ChevronLeft, ChevronRight, Star,
  Calendar, Clock, Palmtree, Mountain, Waves,
  Sunrise, UtensilsCrossed, Heart, Quote
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

/**
 * ABOUT SRI LANKA PAGE - LUXURY EDITION
 * 
 * This page showcases Sri Lanka's beauty, culture, and experiences
 * with a modern, luxury travel website design.
 * 
 * Features:
 * - Full-screen hero with parallax effect
 * - Statistics section with animated counters
 * - Highlights grid with hover effects
 * - Featured destinations with image galleries
 * - Video tour section
 * - Photo gallery with lightbox
 * - Testimonials carousel
 * - Cultural & natural information
 * - Call-to-action sections
 * 
 * All content is editable from the admin panel
 */

const AboutSriLanka: React.FC = () => {
  const { content, loading, error } = useAboutSriLankaContent();
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);
  const [selectedGalleryImage, setSelectedGalleryImage] = useState<number | null>(null);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-teal-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-6"></div>
          <p className="text-xl text-gray-600 font-medium">Loading Sri Lanka information...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-orange-50">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="text-red-600 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Something went wrong</h2>
          <p className="text-red-600 mb-4">Error loading content: {error}</p>
          <Button onClick={() => window.location.reload()}>Reload Page</Button>
        </div>
      </div>
    );
  }

  const stats = [
    { icon: Globe, ...(content.stats?.area ?? {}) },
    { icon: Users, ...(content.stats?.population ?? {}) },
    { icon: Leaf, ...(content.stats?.species ?? {}) },
    { icon: Award, ...(content.stats?.unesco ?? {}) }
  ];

  const contentAny = content as any;

  const destinations = contentAny.destinations ?? [];
  const experiences = contentAny.experiences ?? [];
  const gallery = contentAny.gallery ?? [];
  const testimonials = contentAny.testimonials ?? [];
  const videoTours = contentAny.videoTours ?? [];

  // Navigation functions for gallery
  const nextGalleryImage = () => {
    if (selectedGalleryImage !== null) {
      setSelectedGalleryImage((selectedGalleryImage + 1) % gallery.length);
    }
  };

  const prevGalleryImage = () => {
    if (selectedGalleryImage !== null) {
      setSelectedGalleryImage((selectedGalleryImage - 1 + gallery.length) % gallery.length);
    }
  };

  // Navigation for testimonials
  const nextTestimonial = () => {
    setCurrentTestimonial((currentTestimonial + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentTestimonial((currentTestimonial - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <>
      {/* SEO Meta Tags */}
      <Helmet>
        <title>{content.seoTitle}</title>
        <meta name="description" content={content.seoDescription} />
        <meta name="keywords" content={content.seoKeywords} />
        <meta property="og:title" content={content.seoTitle} />
        <meta property="og:description" content={content.seoDescription} />
        <meta property="og:image" content={content.heroImage} />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={content.seoTitle} />
        <meta name="twitter:description" content={content.seoDescription} />
        <meta name="twitter:image" content={content.heroImage} />
        <link rel="canonical" href="https://recharge-travels.com/about/sri-lanka" />
      </Helmet>

      <div className="bg-white">
        {/* Hero Section - Full Screen with Parallax */}
        <section className="relative h-screen flex items-center justify-center overflow-hidden">
          <motion.div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url(${content.heroImage})` }}
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            transition={{ duration: 1.5 }}
          >
            <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70"></div>
          </motion.div>
          
          <div className="relative z-10 text-center text-white max-w-5xl mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.3 }}
            >
              <Badge className="mb-6 bg-white/20 backdrop-blur-sm text-white border-white/30 px-6 py-2 text-sm font-semibold">
                Discover Paradise
              </Badge>
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6 font-playfair leading-tight">
                {content.heroTitle}
              </h1>
              <p className="text-xl md:text-3xl mb-10 opacity-95 font-light tracking-wide">
                {content.heroSubtitle}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  size="lg" 
                  className="bg-white text-blue-600 hover:bg-blue-50 px-8 py-6 text-lg font-semibold rounded-full shadow-xl"
                  onClick={() => document.getElementById('explore')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  Explore Now
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="border-2 border-white text-white hover:bg-white/10 px-8 py-6 text-lg font-semibold rounded-full backdrop-blur-sm"
                  onClick={() => document.getElementById('video-tours')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  <Play className="w-5 h-5 mr-2" />
                  Watch Video
                </Button>
              </div>
            </motion.div>
          </div>

          {/* Scroll Indicator */}
          <motion.div
            className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
            animate={{ y: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
          >
            <div className="w-8 h-12 border-2 border-white/50 rounded-full flex justify-center pt-2">
              <div className="w-1 h-3 bg-white/70 rounded-full"></div>
            </div>
          </motion.div>
        </section>

        {/* Main Content Section */}
        <section id="explore" className="py-24 bg-gradient-to-br from-blue-50 via-white to-teal-50">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              {/* Content */}
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
              >
                <Badge className="mb-4 bg-blue-100 text-blue-700 px-4 py-1">About Sri Lanka</Badge>
                <h2 className="text-4xl md:text-6xl font-bold text-gray-900 mt-4 mb-6 font-playfair">
                  {content.heroTitle}
                </h2>
                <p className="text-xl text-gray-700 mb-6 leading-relaxed">
                  {content.mainDescription}
                </p>
                <p className="text-xl text-gray-700 mb-8 leading-relaxed">
                  {content.secondaryDescription}
                </p>
                <div className="flex gap-4">
                  <Button 
                    size="lg" 
                    className="bg-blue-600 hover:bg-blue-700 text-white px-8 rounded-full"
                  >
                    <MapPin className="w-5 h-5 mr-2" />
                    View Destinations
                  </Button>
                  <Button 
                    size="lg" 
                    variant="outline"
                    className="border-2 border-blue-600 text-blue-600 hover:bg-blue-50 px-8 rounded-full"
                  >
                    <Calendar className="w-5 h-5 mr-2" />
                    Plan Your Trip
                  </Button>
                </div>
              </motion.div>

              {/* Stats Grid */}
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="grid grid-cols-2 gap-6"
              >
                {stats.map((stat, index) => {
                  const IconComponent = stat.icon;
                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.6, delay: index * 0.1 }}
                      whileHover={{ scale: 1.05, boxShadow: "0 20px 40px rgba(0,0,0,0.1)" }}
                      className="text-center p-8 bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all cursor-pointer"
                    >
                      <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-4">
                        <IconComponent className="w-8 h-8 text-white" />
                      </div>
                      <div className="text-4xl font-bold text-gray-900 mb-2">{stat.value}</div>
                      <div className="text-sm font-semibold text-gray-700 mb-1">{stat.label}</div>
                      <div className="text-xs text-gray-500">{stat.desc}</div>
                    </motion.div>
                  );
                })}
              </motion.div>
            </div>
          </div>
        </section>

        {/* Highlights Section */}
        <section className="py-24 bg-white">
          <div className="container mx-auto px-4 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="text-center mb-16"
            >
              <Badge className="mb-4 bg-orange-100 text-orange-700 px-4 py-1">What to Experience</Badge>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 font-playfair">
                What Makes Sri Lanka Special
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Discover the unique experiences that make Sri Lanka a truly remarkable destination
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {content.highlights.map((highlight, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  whileHover={{ scale: 1.05, y: -5 }}
                  className="bg-gradient-to-br from-orange-50 via-yellow-50 to-orange-50 p-8 rounded-2xl border border-orange-100 hover:shadow-2xl transition-all cursor-pointer"
                >
                  <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-yellow-500 rounded-full flex items-center justify-center mb-4">
                    <Star className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-lg font-bold text-gray-900 mb-2">{highlight}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Destinations Section */}
        {destinations.length > 0 && (
          <section className="py-24 bg-gradient-to-br from-gray-50 to-blue-50">
            <div className="container mx-auto px-4 lg:px-8">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="text-center mb-16"
              >
                <Badge className="mb-4 bg-blue-100 text-blue-700 px-4 py-1">Top Destinations</Badge>
                <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 font-playfair">
                  Must-Visit Places
                </h2>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                  Explore the most iconic and breathtaking destinations across the island
                </p>
              </motion.div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {destinations.map((destination: any, index: number) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    whileHover={{ y: -10 }}
                    className="group cursor-pointer"
                  >
                    <Card className="overflow-hidden border-0 shadow-xl hover:shadow-2xl transition-all duration-500">
                      <div className="relative h-80 overflow-hidden">
                        <img
                          src={destination.image}
                          alt={destination.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                        <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                          <h3 className="text-2xl font-bold mb-2">{destination.name}</h3>
                          <p className="text-sm opacity-90 line-clamp-2">{destination.description}</p>
                        </div>
                        <Badge className="absolute top-4 right-4 bg-white/20 backdrop-blur-sm text-white border-white/30">
                          <MapPin className="w-3 h-3 mr-1" />
                          {destination.region || 'Sri Lanka'}
                        </Badge>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Video Tours Section */}
        {videoTours.length > 0 && (
          <section id="video-tours" className="py-24 bg-gray-900 text-white relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-5">
              <div className="absolute inset-0" style={{ 
                backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
                backgroundSize: '40px 40px'
              }}></div>
            </div>

            <div className="container mx-auto px-4 lg:px-8 relative z-10">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="text-center mb-16"
              >
                <Badge className="mb-4 bg-white/10 backdrop-blur-sm text-white border-white/20 px-4 py-1">
                  Virtual Experience
                </Badge>
                <h2 className="text-4xl md:text-5xl font-bold mb-4 font-playfair">
                  Explore Sri Lanka in Video
                </h2>
                <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                  Take a virtual journey through Sri Lanka's most stunning landscapes
                </p>
              </motion.div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {videoTours.map((video: any, index: number) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    whileHover={{ scale: 1.05 }}
                    className="relative group cursor-pointer"
                    onClick={() => setSelectedVideo(video.url)}
                  >
                    <div className="relative h-64 rounded-2xl overflow-hidden">
                      <img
                        src={video.thumbnail}
                        alt={video.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-colors"></div>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                          <Play className="w-8 h-8 text-white ml-1" />
                        </div>
                      </div>
                      <div className="absolute bottom-0 left-0 right-0 p-6">
                        <h3 className="text-lg font-bold text-white">{video.title}</h3>
                        <p className="text-sm text-gray-200 opacity-90">{video.duration || '2:30'}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Video Modal */}
            <AnimatePresence>
              {selectedVideo && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4"
                  onClick={() => setSelectedVideo(null)}
                >
                  <motion.div
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0.8 }}
                    className="relative w-full max-w-6xl aspect-video"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute -top-12 right-0 text-white hover:bg-white/10"
                      onClick={() => setSelectedVideo(null)}
                    >
                      <X className="w-6 h-6" />
                    </Button>
                    <iframe
                      src={selectedVideo}
                      className="w-full h-full rounded-xl"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    ></iframe>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </section>
        )}

        {/* Photo Gallery Section */}
        {gallery.length > 0 && (
          <section className="py-24 bg-white">
            <div className="container mx-auto px-4 lg:px-8">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="text-center mb-16"
              >
                <Badge className="mb-4 bg-purple-100 text-purple-700 px-4 py-1">
                  <Camera className="w-3 h-3 mr-1 inline" />
                  Photo Gallery
                </Badge>
                <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 font-playfair">
                  Stunning Visuals
                </h2>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                  A visual journey through Sri Lanka's most photogenic locations
                </p>
              </motion.div>

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {gallery.map((image: any, index: number) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: index * 0.05 }}
                    whileHover={{ scale: 1.05, zIndex: 10 }}
                    className="relative h-64 rounded-xl overflow-hidden cursor-pointer shadow-lg hover:shadow-2xl transition-all"
                    onClick={() => setSelectedGalleryImage(index)}
                  >
                    <img
                      src={image.url}
                      alt={image.caption || `Sri Lanka Gallery ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 hover:opacity-100 transition-opacity">
                      <div className="absolute bottom-0 left-0 right-0 p-4">
                        <p className="text-white text-sm font-medium">{image.caption}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Gallery Lightbox */}
            <AnimatePresence>
              {selectedGalleryImage !== null && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4"
                  onClick={() => setSelectedGalleryImage(null)}
                >
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-4 right-4 text-white hover:bg-white/10 z-10"
                    onClick={() => setSelectedGalleryImage(null)}
                  >
                    <X className="w-6 h-6" />
                  </Button>
                  
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute left-4 text-white hover:bg-white/10 z-10"
                    onClick={(e) => { e.stopPropagation(); prevGalleryImage(); }}
                  >
                    <ChevronLeft className="w-8 h-8" />
                  </Button>
                  
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-4 text-white hover:bg-white/10 z-10"
                    onClick={(e) => { e.stopPropagation(); nextGalleryImage(); }}
                  >
                    <ChevronRight className="w-8 h-8" />
                  </Button>

                  <motion.div
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0.8 }}
                    className="relative max-w-6xl w-full"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <img
                      src={gallery[selectedGalleryImage].url}
                      alt={gallery[selectedGalleryImage].caption}
                      className="w-full h-auto max-h-[80vh] object-contain rounded-lg"
                    />
                    {gallery[selectedGalleryImage].caption && (
                      <div className="mt-4 text-center">
                        <p className="text-white text-lg">{gallery[selectedGalleryImage].caption}</p>
                        <p className="text-gray-400 text-sm mt-1">
                          {selectedGalleryImage + 1} / {gallery.length}
                        </p>
                      </div>
                    )}
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </section>
        )}

        {/* Cultural & Natural Info Section */}
        <section className="py-24 bg-gradient-to-br from-teal-50 to-blue-50">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="relative"
              >
                <div className="absolute -top-8 -left-8 w-24 h-24 bg-gradient-to-br from-orange-400 to-red-500 rounded-full opacity-20 blur-2xl"></div>
                <Card className="p-8 shadow-2xl border-0 relative z-10">
                  <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl flex items-center justify-center mb-6">
                    <Palmtree className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-3xl font-bold text-gray-900 mb-6">Cultural Heritage</h3>
                  <p className="text-lg text-gray-700 leading-relaxed mb-6">
                    {content.culturalInfo}
                  </p>
                  <Button className="bg-orange-600 hover:bg-orange-700 text-white rounded-full">
                    Learn More
                  </Button>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="relative"
              >
                <div className="absolute -top-8 -right-8 w-24 h-24 bg-gradient-to-br from-green-400 to-teal-500 rounded-full opacity-20 blur-2xl"></div>
                <Card className="p-8 shadow-2xl border-0 relative z-10">
                  <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-teal-500 rounded-2xl flex items-center justify-center mb-6">
                    <Mountain className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-3xl font-bold text-gray-900 mb-6">Natural Wonders</h3>
                  <p className="text-lg text-gray-700 leading-relaxed mb-6">
                    {content.naturalInfo}
                  </p>
                  <Button className="bg-green-600 hover:bg-green-700 text-white rounded-full">
                    Explore Nature
                  </Button>
                </Card>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        {testimonials.length > 0 && (
          <section className="py-24 bg-gray-900 text-white relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-5">
              <div className="absolute inset-0" style={{ 
                backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
                backgroundSize: '40px 40px'
              }}></div>
            </div>

            <div className="container mx-auto px-4 lg:px-8 relative z-10">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="text-center mb-16"
              >
                <Badge className="mb-4 bg-white/10 backdrop-blur-sm text-white border-white/20 px-4 py-1">
                  <Heart className="w-3 h-3 mr-1 inline" />
                  Testimonials
                </Badge>
                <h2 className="text-4xl md:text-5xl font-bold mb-4 font-playfair">
                  What Our Travelers Say
                </h2>
                <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                  Real experiences from real travelers who explored Sri Lanka with us
                </p>
              </motion.div>

              <div className="max-w-4xl mx-auto relative">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentTestimonial}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.5 }}
                    className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-12 text-center"
                  >
                    <Quote className="w-12 h-12 text-blue-400 mx-auto mb-6" />
                    <p className="text-2xl text-white mb-8 italic leading-relaxed">
                      "{testimonials[currentTestimonial].text}"
                    </p>
                    <div className="flex items-center justify-center gap-4 mb-4">
                      {testimonials[currentTestimonial].avatar && (
                        <img
                          src={testimonials[currentTestimonial].avatar}
                          alt={testimonials[currentTestimonial].name}
                          className="w-16 h-16 rounded-full border-2 border-white/30"
                        />
                      )}
                      <div className="text-left">
                        <div className="font-bold text-lg">{testimonials[currentTestimonial].name}</div>
                        <div className="text-gray-300">{testimonials[currentTestimonial].location}</div>
                      </div>
                    </div>
                    <div className="flex justify-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                  </motion.div>
                </AnimatePresence>

                {/* Navigation */}
                <div className="flex justify-center gap-4 mt-8">
                  <Button
                    variant="outline"
                    size="icon"
                    className="rounded-full border-white/20 text-white hover:bg-white/10"
                    onClick={prevTestimonial}
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </Button>
                  <div className="flex items-center gap-2">
                    {testimonials.map((_: any, index: number) => (
                      <button
                        key={index}
                        onClick={() => setCurrentTestimonial(index)}
                        className={`w-2 h-2 rounded-full transition-all ${
                          index === currentTestimonial ? 'bg-white w-8' : 'bg-white/30'
                        }`}
                      />
                    ))}
                  </div>
                  <Button
                    variant="outline"
                    size="icon"
                    className="rounded-full border-white/20 text-white hover:bg-white/10"
                    onClick={nextTestimonial}
                  >
                    <ChevronRight className="w-5 h-5" />
                  </Button>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Call to Action Section */}
        <section className="py-24 bg-gradient-to-r from-blue-600 via-teal-600 to-blue-600 text-white relative overflow-hidden">
          {/* Animated Background Elements */}
          <motion.div
            className="absolute inset-0 opacity-20"
            animate={{
              backgroundPosition: ['0% 0%', '100% 100%'],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              repeatType: 'reverse',
            }}
            style={{
              backgroundImage: 'radial-gradient(circle, white 2px, transparent 2px)',
              backgroundSize: '50px 50px',
            }}
          />

          <div className="container mx-auto px-4 lg:px-8 text-center relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-4xl md:text-6xl font-bold mb-6 font-playfair">
                Ready to Explore Sri Lanka?
              </h2>
              <p className="text-xl md:text-2xl mb-12 opacity-95 max-w-3xl mx-auto">
                Start planning your unforgettable journey to the Pearl of the Indian Ocean
              </p>
              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <a 
                  href="https://wa.me/94777721999?text=Hello%20Recharge%20Travels,%20I'm%20interested%20in%20Sri%20Lanka%20tours" 
                  className="inline-flex items-center justify-center px-10 py-5 bg-green-600 hover:bg-green-700 rounded-full font-semibold text-lg transition-all hover:scale-105 shadow-2xl"
                >
                  📱 WhatsApp +94 77 77 21 999
                </a>
                <a 
                  href="/tours" 
                  className="inline-flex items-center justify-center px-10 py-5 bg-white text-blue-600 hover:bg-gray-100 rounded-full font-semibold text-lg transition-all hover:scale-105 shadow-2xl"
                >
                  <MapPin className="w-5 h-5 mr-2" />
                  Explore Tours
                </a>
              </div>
            </motion.div>
          </div>
        </section>
      </div>
    </>
  );
};

export default AboutSriLanka;
