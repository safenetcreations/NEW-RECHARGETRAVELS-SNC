
import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useAboutSriLankaContent } from '@/hooks/useAboutSriLankaContent';
import { motion } from 'framer-motion';
import { Globe, Users, Leaf, Award } from 'lucide-react';

const AboutSriLanka: React.FC = () => {
  const { content, loading, error } = useAboutSriLankaContent();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading Sri Lanka information...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600">Error loading content: {error}</p>
        </div>
      </div>
    );
  }

  const stats = [
    { icon: Globe, ...content.stats.area },
    { icon: Users, ...content.stats.population },
    { icon: Leaf, ...content.stats.species },
    { icon: Award, ...content.stats.unesco }
  ];

  return (
    <>
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
      </Helmet>

      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${content.heroImage})` }}
        >
          <div className="absolute inset-0 bg-black bg-opacity-50"></div>
        </div>
        
        <div className="relative z-10 text-center text-white max-w-4xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-7xl font-bold mb-6 font-playfair">
              {content.heroTitle}
            </h1>
            <p className="text-xl md:text-2xl mb-8 opacity-90">
              {content.heroSubtitle}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main Content Section */}
      <section className="py-20 bg-gradient-to-br from-blue-50 to-teal-50">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Content */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <span className="text-blue-600 font-semibold text-sm uppercase tracking-wider">About Sri Lanka</span>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mt-4 mb-6 font-playfair">
                {content.heroTitle}
              </h2>
              <p className="text-lg text-gray-700 mb-6 leading-relaxed">
                {content.mainDescription}
              </p>
              <p className="text-lg text-gray-700 mb-8 leading-relaxed">
                {content.secondaryDescription}
              </p>
            </motion.div>

            {/* Stats Grid */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
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
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    className="text-center p-6 bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow"
                  >
                    <IconComponent className="w-8 h-8 text-blue-600 mx-auto mb-3" />
                    <div className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</div>
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
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">What Makes Sri Lanka Special</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Discover the unique experiences that make Sri Lanka a truly remarkable destination
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {content.highlights.map((highlight, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-gradient-to-br from-orange-50 to-yellow-50 p-6 rounded-lg border border-orange-100 hover:shadow-lg transition-shadow"
              >
                <div className="text-orange-600 font-semibold text-center">{highlight}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Cultural & Natural Info Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h3 className="text-3xl font-bold text-gray-900 mb-6">Cultural Heritage</h3>
              <p className="text-lg text-gray-700 leading-relaxed">
                {content.culturalInfo}
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <h3 className="text-3xl font-bold text-gray-900 mb-6">Natural Wonders</h3>
              <p className="text-lg text-gray-700 leading-relaxed">
                {content.naturalInfo}
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-teal-600 text-white">
        <div className="container mx-auto px-4 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl font-bold mb-6">Ready to Explore Sri Lanka?</h2>
            <p className="text-xl mb-8 opacity-90">
              Start planning your unforgettable journey to the Pearl of the Indian Ocean
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="https://wa.me/94777721999?text=Hello%20Recharge%20Travels,%20I'm%20interested%20in%20Sri%20Lanka%20tours" 
                className="inline-flex items-center justify-center px-8 py-4 bg-green-600 hover:bg-green-700 rounded-full font-semibold text-lg transition-colors"
              >
                📱 WhatsApp +94 77 77 21 999
              </a>
              <a 
                href="/tours" 
                className="inline-flex items-center justify-center px-8 py-4 bg-white text-blue-600 hover:bg-gray-100 rounded-full font-semibold text-lg transition-colors"
              >
                Explore Tours
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
};

export default AboutSriLanka;
