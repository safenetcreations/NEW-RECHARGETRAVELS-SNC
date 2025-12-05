import { useState, useEffect, memo, lazy, Suspense } from 'react';
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AirportTransferSection from "@/components/homepage/AirportTransferSection";
import ComprehensiveSEO from "@/components/seo/ComprehensiveSEO";
import HomepageSchema from "@/components/seo/HomepageSchema";
import { prefetchCommonRoutes } from "@/utils/routePrefetch";
import { getBaseUrl } from "@/utils/seoSchemaHelpers";
import { useIsMobile } from "@/hooks/use-mobile";

import MobileHome from "@/pages/MobileHome";

// Lazy load heavy components
const LuxuryHeroSection = lazy(() => import("@/components/homepage/LuxuryHeroSection"));
const InteractiveTripBuilder = lazy(() => import("@/components/trip-builder/InteractiveTripBuilder"));
const FeaturedDestinations = lazy(() => import("@/components/homepage/FeaturedDestinations"));
const LuxuryExperiences = lazy(() => import("@/components/homepage/LuxuryExperiences"));
// MobileHome is now statically imported to improve LCP on mobile

// Lazy load below-the-fold components for faster initial paint
const TripAdvisorHighlights = lazy(() => import("@/components/homepage/TripAdvisorHighlights"));
const EcotourismPromo = lazy(() => import("@/components/homepage/EcotourismPromo"));
const FeaturedExperiencesStrip = lazy(() => import("@/components/homepage/FeaturedExperiencesStrip"));
const WellnessPackagesSection = lazy(() => import("@/components/homepage/WellnessPackagesSection"));
const AboutSriLanka = lazy(() => import("@/pages/AboutSriLanka"));
const TravelGuide = lazy(() => import("@/components/homepage/TravelGuide"));
const LuxuryBlogSection = lazy(() => import("@/components/homepage/LuxuryBlogSection"));
const ReviewsSection = lazy(() => import("@/components/homepage/ReviewsSection"));

// Minimal fallback for lazy components
const LazyFallback = memo(() => (
  <div className="min-h-[200px] bg-slate-50 animate-pulse" />
));
LazyFallback.displayName = 'LazyFallback';

const Index = memo(() => {
  // Detect mobile screen
  const isMobile = useIsMobile();

  // Prefetch common routes after homepage loads - Desktop only
  useEffect(() => {
    if (isMobile) return;

    // Wait for homepage to fully render, then prefetch
    const timer = setTimeout(() => {
      prefetchCommonRoutes();
    }, 3000); // Increased delay to 3s to prioritize main content
    return () => clearTimeout(timer);
  }, [isMobile]);

  const baseUrl = getBaseUrl();

  if (isMobile) {
    return (
      <>
        <ComprehensiveSEO
          title="Travel Agency Colombo | Sri Lanka Tours & Safaris | Recharge Travels"
          description="Your Premium Guide to Sri Lanka's Wonders. Recharge Travels is Colombo's #1 rated travel agency. Book luxury Sri Lanka tours, Yala safaris, and airport transfers."
          keywords={['travel agency Colombo', 'Sri Lanka tours', 'Colombo airport transfer']}
          canonicalUrl="/"
          ogImage="https://www.rechargetravels.com/logo-v2.png"
        />
        <HomepageSchema />
        <Header />
        <MobileHome />
        <Footer />
      </>
    );
  }

  return (
    <>
      <ComprehensiveSEO
        title="Travel Agency Colombo | Sri Lanka Tours & Safaris | Recharge Travels"
        description="Your Premium Guide to Sri Lanka's Wonders. Recharge Travels is Colombo's #1 rated travel agency (4.9★ from 2,847+ reviews). Book luxury Sri Lanka tours, Yala safaris, Colombo airport transfers, whale watching, and cultural experiences. 24/7 support. Best price guaranteed!"
        keywords={[
          'travel agency Colombo',
          'Sri Lanka travel agency',
          'Colombo airport transfer',
          'Sri Lanka tours',
          'Yala safari booking',
          'Sri Lanka safari',
          'whale watching Mirissa',
          'Sri Lanka beaches',
          'Sigiriya tours',
          'Kandy tours',
          'Sri Lanka wildlife',
          'Sri Lanka tea plantations',
          'visit Sri Lanka',
          'Sri Lanka vacation',
          'Sri Lanka holidays',
          'Ceylon travel',
          'luxury travel sri lanka',
          'private driver sri lanka',
          'best time to visit sri lanka',
          'Sri Lanka tour packages',
          'Colombo city tours'
        ]}
        canonicalUrl="/"
        ogImage="https://www.rechargetravels.com/logo-v2.png"
        alternateLanguages={[
          { lang: 'en', url: '/' },
          { lang: 'ta', url: '/ta/' },
          { lang: 'si', url: '/si/' }
        ]}
      />

      <HomepageSchema />

      {/* H1 with Local SEO: Primary GBP Category + City */}
      <h1 className="sr-only">Travel Agency Colombo | Sri Lanka Tours & Safaris | Recharge Travels - Book Luxury Tours, Yala Safaris, Airport Transfers</h1>

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
        {/* Hero Section with 4 Booking Tabs - Desktop Only (heavy images) */}
        <LuxuryHeroSection />

        {/* Airport Transfer Booking Section - First on mobile, after hero on desktop */}
        <AirportTransferSection />

        <Suspense fallback={<LazyFallback />}>
          {/* Interactive Trip Builder */}
          <InteractiveTripBuilder />

          {/* Featured Destinations */}
          <FeaturedDestinations />

          {/* Luxury Experiences */}
          <LuxuryExperiences />
        </Suspense>

        {/* Below-the-fold lazy loaded sections */}
        <Suspense fallback={<LazyFallback />}>
          {/* Wellness Packages Section */}
          <WellnessPackagesSection />

          {/* Ecotourism Promotion Section */}
          <EcotourismPromo />

          {/* Featured Experiences Strip */}
          <FeaturedExperiencesStrip />

          {/* About Sri Lanka - Enhanced Section */}
          <AboutSriLanka embedded={true} />

          {/* TripAdvisor tours showcase */}
          <TripAdvisorHighlights />

          {/* Travel Guide */}
          <TravelGuide />

          {/* Reviews Section - Above Footer */}
          <ReviewsSection />

          {/* Luxury Blog Section - Auto-updates from Admin Panel */}
          <LuxuryBlogSection />
        </Suspense>
      </div>

      <Footer />
    </>
  );
});

Index.displayName = 'Index';

export default Index;
