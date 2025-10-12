import { useState } from 'react';
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import LuxuryHeroSection from "@/components/homepage/LuxuryHeroSection";
import FeaturedDestinations from "@/components/homepage/FeaturedDestinations";
import LuxuryExperiences from "@/components/homepage/LuxuryExperiences";
import TravelPackages from "@/components/homepage/TravelPackages";
import TestimonialsSection from "@/components/homepage/TestimonialsSection";
import AboutSriLanka from "@/components/homepage/AboutSriLanka";
import TravelGuide from "@/components/homepage/TravelGuide";
import WhyChooseUs from "@/components/homepage/WhyChooseUs";
import BlogSection from "@/components/homepage/BlogSection";
import NewsletterSection from "@/components/homepage/NewsletterSection";
import SEOHead from "@/components/cms/SEOHead";
import { SEOService } from "@/lib/seo-service";

const LuxuryHomepage = () => {
  const [hoveredRegion, setHoveredRegion] = useState<{name: string, description: string} | null>(null);

  const handleLocationsChange = (locations: { pickup: string; dropoff: string }) => {
    console.log('Locations changed:', locations);
  };

  const seoData = SEOService.generateSeoData('homepage', {});

  return (
    <>
      <SEOHead
        title={seoData.title}
        description={seoData.description}
        structuredData={seoData.structuredData}
        canonicalUrl={seoData.canonicalUrl}
        ogImage="/images/sri-lanka-hero.jpg"
      />
      
      <Header />
      
      <div className="w-full overflow-x-hidden">
        {/* Hero Section with Transfer Booking */}
        <LuxuryHeroSection 
          hoveredRegion={hoveredRegion}
          onLocationsChange={handleLocationsChange}
        />

        {/* Featured Destinations */}
        <FeaturedDestinations />

        {/* Luxury Experiences */}
        <LuxuryExperiences />

        {/* Travel Packages */}
        <TravelPackages />

        {/* Testimonials */}
        <TestimonialsSection />

        {/* About Sri Lanka */}
        <AboutSriLanka />

        {/* Travel Guide */}
        <TravelGuide />

        {/* Why Choose Us */}
        <WhyChooseUs />

        {/* Blog Section */}
        <BlogSection />

        {/* Newsletter */}
        <NewsletterSection />
      </div>

      <Footer />
    </>
  );
};

export default LuxuryHomepage;