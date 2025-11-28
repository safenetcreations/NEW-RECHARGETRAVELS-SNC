
import { useState } from 'react';
import Header from "@/components/Header";
import Footer from "@/components/Footer";
// import HeroSection from "@/components/HeroSection";
import LuxuryHeroSection from "@/components/homepage/LuxuryHeroSection";
// import ModernHeroSection from "@/components/homepage/ModernHeroSection";
import FeaturedDestinations from "@/components/homepage/FeaturedDestinations";
import LuxuryExperiences from "@/components/homepage/LuxuryExperiences";
import TripAdvisorHighlights from "@/components/homepage/TripAdvisorHighlights";
// import EnhancedLuxuryExperiences from "@/components/homepage/EnhancedLuxuryExperiences";
// import TravelPackages from "@/components/homepage/TravelPackages"; // Removed - Best Value Deals section
import EcotourismPromo from "@/components/homepage/EcotourismPromo";
import FeaturedExperiencesStrip from "@/components/homepage/FeaturedExperiencesStrip";
import WellnessPackagesSection from "@/components/homepage/WellnessPackagesSection";
import AboutSriLanka from "@/pages/AboutSriLanka";
import TravelGuide from "@/components/homepage/TravelGuide";
// import WhyChooseUs from "@/components/homepage/WhyChooseUs"; // Removed - redundant with footer
import LuxuryBlogSection from "@/components/homepage/LuxuryBlogSection";
// import NewsletterSection from "@/components/homepage/NewsletterSection"; // Removed - using Best Value Deals in footer
import ReviewsSection from "@/components/homepage/ReviewsSection";
import ComprehensiveSEO from "@/components/seo/ComprehensiveSEO";
import InteractiveTripBuilder from "@/components/trip-builder/InteractiveTripBuilder";
// import QuoteCalculator from "@/components/quote-calculator/QuoteCalculator";
import { useLanguage } from "@/contexts/LanguageContext";
import HomepageSchema from "@/components/seo/HomepageSchema";

const Index = () => {
  const [hoveredRegion, setHoveredRegion] = useState<{ name: string, description: string } | null>(null);
  const { t, language } = useLanguage();

  const handleLocationsChange = (locations: { pickup: string; dropoff: string }) => {
    console.log('Locations changed:', locations);
  };

  const baseUrl = typeof window !== 'undefined'
    ? window.location.origin
    : 'https://recharge-travels-73e76.web.app';

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

      <HomepageSchema />

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
              "item": baseUrl
            }
          ]
        })}
      </script>

      <Header />

      <div className="w-full overflow-x-hidden">
        {/* Hero Section with 4 Booking Tabs */}
        <LuxuryHeroSection />

        {/* Interactive Trip Builder */}
        <InteractiveTripBuilder />

        {/* Quote Calculator - temporarily disabled */}
        {/* <QuoteCalculator /> */}

        {/* Featured Destinations */}
        <FeaturedDestinations />

        {/* TripAdvisor tours showcase */}
        <TripAdvisorHighlights />

        {/* Luxury Experiences */}
        <LuxuryExperiences />

        {/* Wellness Packages Section */}
        <WellnessPackagesSection />

        {/* Ecotourism Promotion Section */}
        <EcotourismPromo />

        {/* Featured Experiences Strip */}
        <FeaturedExperiencesStrip />

        {/* About Sri Lanka - Enhanced Section */}
        <AboutSriLanka />

        {/* Travel Guide */}
        <TravelGuide />

        {/* Luxury Blog Section - Auto-updates from Admin Panel */}
        <LuxuryBlogSection />

        {/* Reviews Section - Above Footer */}
        <ReviewsSection />

        {/* Newsletter removed - Best Value Deals section is in footer */}
      </div>

      <Footer />
    </>
  );
};

export default Index;
