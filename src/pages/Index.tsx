
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
import ComprehensiveSEO from "@/components/seo/ComprehensiveSEO";
import { useLanguage } from "@/contexts/LanguageContext";

const Index = () => {
  const [hoveredRegion, setHoveredRegion] = useState<{name: string, description: string} | null>(null);
  const { t, language } = useLanguage();

  const handleLocationsChange = (locations: { pickup: string; dropoff: string }) => {
    console.log('Locations changed:', locations);
  };

  return (
    <>
      <ComprehensiveSEO
        title={t('home.hero.title') + " - Recharge Travels & Tours Ltd"}
        description={t('home.hero.description')}
        keywords={[
          'Sri Lanka travel',
          'Sri Lanka tours',
          'Sri Lanka destinations',
          'Sri Lanka safari',
          'Sri Lanka culture',
          'Sri Lanka beaches',
          'Sri Lanka temples',
          'Sri Lanka wildlife',
          'Sri Lanka tea plantations',
          'Sri Lanka itinerary',
          'visit Sri Lanka',
          'Sri Lanka guide',
          'Sri Lanka vacation',
          'Sri Lanka holidays',
          'Sri Lanka travel agency',
          'Ceylon travel',
          'Jaffna tours',
          'Indian Tamil tourism',
          'Palaly airport taxi'
        ]}
        canonicalUrl="/"
        ogImage="/images/sri-lanka-hero.jpg"
        alternateLanguages={[
          { lang: 'en', url: '/' },
          { lang: 'ta', url: '/ta/' },
          { lang: 'si', url: '/si/' }
        ]}
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

export default Index;
