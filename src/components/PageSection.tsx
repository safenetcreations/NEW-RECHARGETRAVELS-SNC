import React from 'react';
import { motion } from 'framer-motion';

interface PageSectionProps {
  section: {
    id: string;
    type: 'text' | 'image' | 'hero' | 'stats' | 'gallery' | 'cta';
    heading?: string;
    content?: string;
    image?: string;
    imageAlt?: string;
    order: number;
    settings?: Record<string, any>;
  };
  className?: string;
}

const PageSection: React.FC<PageSectionProps> = ({ section, className = "" }) => {
  const renderTextSection = () => (
    <div className="prose prose-lg max-w-none">
      {section.heading && (
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-3xl font-bold text-gray-900 mb-6"
          dangerouslySetInnerHTML={{ __html: section.heading }}
        />
      )}
      {section.content && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-lg text-gray-700 leading-relaxed"
          dangerouslySetInnerHTML={{ __html: section.content }}
        />
      )}
    </div>
  );

  const renderImageSection = () => (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="relative"
    >
      {section.image && (
        <div className="rounded-lg overflow-hidden shadow-lg">
          <img
            src={section.image}
            alt={section.imageAlt || 'Page content image'}
            className="w-full h-auto object-cover"
            loading="lazy"
          />
        </div>
      )}
      {section.heading && (
        <motion.h3
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-xl font-semibold text-gray-900 mt-4"
          dangerouslySetInnerHTML={{ __html: section.heading }}
        />
      )}
      {section.content && (
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-gray-600 mt-2"
          dangerouslySetInnerHTML={{ __html: section.content }}
        />
      )}
    </motion.div>
  );

  const renderHeroSection = () => (
    <motion.section
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
      className="relative h-screen flex items-center justify-center overflow-hidden"
    >
      {section.image && (
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${section.image})` }}
        >
          <div className="absolute inset-0 bg-black bg-opacity-50"></div>
        </div>
      )}
      
      <div className="relative z-10 text-center text-white max-w-4xl mx-auto px-4">
        {section.heading && (
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-5xl md:text-7xl font-bold mb-6 font-playfair"
            dangerouslySetInnerHTML={{ __html: section.heading }}
          />
        )}
        {section.content && (
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-xl md:text-2xl mb-8 opacity-90"
            dangerouslySetInnerHTML={{ __html: section.content }}
          />
        )}
      </div>
    </motion.section>
  );

  const renderStatsSection = () => {
    // Parse stats from content (assuming JSON format)
    let stats = [];
    try {
      if (section.content) {
        stats = JSON.parse(section.content);
      }
    } catch (e) {
      console.warn('Failed to parse stats content:', e);
    }

    return (
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="py-20 bg-gradient-to-br from-blue-50 to-teal-50"
      >
        <div className="container mx-auto px-4 lg:px-8">
          {section.heading && (
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-4xl font-bold text-gray-900 text-center mb-12"
              dangerouslySetInnerHTML={{ __html: section.heading }}
            />
          )}
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat: any, index: number) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="text-center p-6 bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow"
              >
                <div className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</div>
                <div className="text-sm font-semibold text-gray-700 mb-1">{stat.label}</div>
                <div className="text-xs text-gray-500">{stat.desc}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>
    );
  };

  const renderGallerySection = () => {
    // Parse gallery images from content (assuming JSON format)
    let images = [];
    try {
      if (section.content) {
        images = JSON.parse(section.content);
      }
    } catch (e) {
      console.warn('Failed to parse gallery content:', e);
    }

    return (
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="py-20 bg-white"
      >
        <div className="container mx-auto px-4 lg:px-8">
          {section.heading && (
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-4xl font-bold text-gray-900 text-center mb-12"
              dangerouslySetInnerHTML={{ __html: section.heading }}
            />
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {images.map((image: any, index: number) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow"
              >
                <img
                  src={image.url}
                  alt={image.alt || 'Gallery image'}
                  className="w-full h-64 object-cover"
                  loading="lazy"
                />
                {image.caption && (
                  <div className="p-4 bg-white">
                    <p className="text-sm text-gray-600">{image.caption}</p>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>
    );
  };

  const renderCTASection = () => (
    <motion.section
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
      className="py-20 bg-gradient-to-r from-blue-600 to-teal-600 text-white"
    >
      <div className="container mx-auto px-4 lg:px-8 text-center">
        {section.heading && (
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-4xl font-bold mb-6"
            dangerouslySetInnerHTML={{ __html: section.heading }}
          />
        )}
        {section.content && (
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl mb-8 opacity-90"
            dangerouslySetInnerHTML={{ __html: section.content }}
          />
        )}
        {section.settings?.ctaButton && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <a
              href={section.settings.ctaButton.url}
              className="inline-flex items-center justify-center px-8 py-4 bg-white text-blue-600 hover:bg-gray-100 rounded-full font-semibold text-lg transition-colors"
            >
              {section.settings.ctaButton.text}
            </a>
          </motion.div>
        )}
      </div>
    </motion.section>
  );

  const renderSection = () => {
    switch (section.type) {
      case 'hero':
        return renderHeroSection();
      case 'text':
        return renderTextSection();
      case 'image':
        return renderImageSection();
      case 'stats':
        return renderStatsSection();
      case 'gallery':
        return renderGallerySection();
      case 'cta':
        return renderCTASection();
      default:
        return renderTextSection();
    }
  };

  return (
    <div className={className}>
      {renderSection()}
    </div>
  );
};

export default PageSection; 