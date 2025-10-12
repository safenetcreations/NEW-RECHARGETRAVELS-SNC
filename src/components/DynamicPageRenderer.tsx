import React from 'react';
import { Helmet } from 'react-helmet-async';
import { usePageContent } from '@/hooks/usePageContent';
import PageSection from './PageSection';
import { motion } from 'framer-motion';

interface DynamicPageRendererProps {
  fallbackComponent?: React.ReactNode;
  className?: string;
}

const DynamicPageRenderer: React.FC<DynamicPageRendererProps> = ({
  fallbackComponent,
  className = ""
}) => {
  const { content, loading, error } = usePageContent();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading page content...</p>
        </div>
      </div>
    );
  }

  if (error || !content) {
    if (fallbackComponent) {
      return <>{fallbackComponent}</>;
    }
    
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Page Not Found</h1>
          <p className="text-gray-600 mb-6">
            {error || 'The page you are looking for does not exist or is not published.'}
          </p>
          <a
            href="/"
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Go Home
          </a>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{content.metaTitle}</title>
        <meta name="description" content={content.metaDescription} />
        <meta name="keywords" content={content.metaKeywords} />
        {content.seoData?.ogTitle && (
          <meta property="og:title" content={content.seoData.ogTitle} />
        )}
        {content.seoData?.ogDescription && (
          <meta property="og:description" content={content.seoData.ogDescription} />
        )}
        {content.seoData?.ogImage && (
          <meta property="og:image" content={content.seoData.ogImage} />
        )}
        <meta property="og:type" content="website" />
        {content.seoData?.twitterCard && (
          <meta name="twitter:card" content={content.seoData.twitterCard} />
        )}
        <meta name="twitter:title" content={content.metaTitle} />
        <meta name="twitter:description" content={content.metaDescription} />
        {content.seoData?.ogImage && (
          <meta name="twitter:image" content={content.seoData.ogImage} />
        )}
      </Helmet>

      <div className={className}>
        {/* Hero Section (if exists) */}
        {content.heroTitle && content.heroImage && (
          <motion.section
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="relative h-screen flex items-center justify-center overflow-hidden"
          >
            <div 
              className="absolute inset-0 bg-cover bg-center bg-no-repeat"
              style={{ backgroundImage: `url(${content.heroImage})` }}
            >
              <div className="absolute inset-0 bg-black bg-opacity-50"></div>
            </div>
            
            <div className="relative z-10 text-center text-white max-w-4xl mx-auto px-4">
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="text-5xl md:text-7xl font-bold mb-6 font-playfair"
                dangerouslySetInnerHTML={{ __html: content.heroTitle }}
              />
              {content.heroSubtitle && (
                <motion.p
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                  className="text-xl md:text-2xl mb-8 opacity-90"
                  dangerouslySetInnerHTML={{ __html: content.heroSubtitle }}
                />
              )}
            </div>
          </motion.section>
        )}

        {/* Content Sections */}
        {content.sections && content.sections.length > 0 && (
          <div>
            {content.sections
              .sort((a, b) => a.order - b.order)
              .map((section) => (
                <PageSection
                  key={section.id}
                  section={section}
                  className="py-20"
                />
              ))}
          </div>
        )}

        {/* Fallback content if no sections */}
        {(!content.sections || content.sections.length === 0) && (
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="py-20"
          >
            <div className="container mx-auto px-4 lg:px-8">
              <div className="max-w-4xl mx-auto">
                <h1 className="text-4xl font-bold text-gray-900 mb-6">
                  {content.title}
                </h1>
                <div className="prose prose-lg max-w-none">
                  <p className="text-lg text-gray-700 leading-relaxed">
                    This page is managed through the admin panel. Please add content sections to display here.
                  </p>
                </div>
              </div>
            </div>
          </motion.section>
        )}
      </div>
    </>
  );
};

export default DynamicPageRenderer; 