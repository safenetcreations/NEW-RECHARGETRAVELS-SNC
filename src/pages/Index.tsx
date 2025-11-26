
import { useState } from 'react';
import Header from "@/components/Header";
import Footer from "@/components/Footer";
// import HeroSection from "@/components/HeroSection";
import LuxuryHeroSection from "@/components/homepage/LuxuryHeroSection";
// import ModernHeroSection from "@/components/homepage/ModernHeroSection";
import FeaturedDestinations from "@/components/homepage/FeaturedDestinations";
import LuxuryExperiences from "@/components/homepage/LuxuryExperiences";
// import EnhancedLuxuryExperiences from "@/components/homepage/EnhancedLuxuryExperiences";
import TravelPackages from "@/components/homepage/TravelPackages";
import TestimonialsSection from "@/components/homepage/TestimonialsSection";
import AboutSriLanka from "@/components/homepage/AboutSriLanka";
import TravelGuide from "@/components/homepage/TravelGuide";
import WhyChooseUs from "@/components/homepage/WhyChooseUs";
import BlogSection from "@/components/homepage/BlogSection";
import NewsletterSection from "@/components/homepage/NewsletterSection";
import ReviewsSection from "@/components/homepage/ReviewsSection";
import ComprehensiveSEO from "@/components/seo/ComprehensiveSEO";
import InteractiveTripBuilder from "@/components/trip-builder/InteractiveTripBuilder";
// import QuoteCalculator from "@/components/quote-calculator/QuoteCalculator";
import { useLanguage } from "@/contexts/LanguageContext";

const Index = () => {
  const [hoveredRegion, setHoveredRegion] = useState<{ name: string, description: string } | null>(null);
  const { t, language } = useLanguage();

  const handleLocationsChange = (locations: { pickup: string; dropoff: string }) => {
    console.log('Locations changed:', locations);
  };

  return (
    <>
      <ComprehensiveSEO
        title={t('home.hero.title') + " - Recharge Travels & Tours Ltd"}
        description="Discover the beauty of Sri Lanka with Recharge Travels. We offer luxury tours, wildlife safaris, cultural experiences, and personalized travel packages. Book your dream vacation today."
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
          'Palaly airport taxi',
          'luxury travel sri lanka',
          'private driver sri lanka',
          'best time to visit sri lanka'
        ]}
        canonicalUrl="/"
        ogImage="https://i.imgur.com/AEnBWJf.jpeg"
        alternateLanguages={[
          { lang: 'en', url: '/' },
          { lang: 'ta', url: '/ta/' },
          { lang: 'si', url: '/si/' }
        ]}
      />

      <h1 className="sr-only">Recharge Travels - Luxury Sri Lanka Tours & Travel Agency</h1>

      {/* Breadcrumb Structured Data for Homepage */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          "itemListElement": [
            {
              "@type": "ListItem",
              "position": 1,
              "name": "Home",
              "item": "https://www.rechargetravels.com/"
            }
          ]
        })}
      </script>

      <Header />

      <div className="w-full overflow-x-hidden">
        {/* Hero Section with Booking Widget */}
        <LuxuryHeroSection />

        {/* Interactive Trip Builder */}
        <InteractiveTripBuilder />

        {/* Quote Calculator - temporarily disabled */}
        {/* <QuoteCalculator /> */}

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

        {/* Reviews Section - Above Footer */}
        <ReviewsSection />

        {/* Newsletter */}
        <NewsletterSection />
      </div>

      <Footer />
    </>
  );
};

export default Index;
