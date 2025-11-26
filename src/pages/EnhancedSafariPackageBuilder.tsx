
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import SafariHero from '@/components/safari/SafariHero';
import SafariSteps from '@/components/safari/SafariSteps';
import SafariBuilder from '@/components/safari/SafariBuilder';
import SafariFeatures from '@/components/safari/SafariFeatures';
import SafariTestimonials from '@/components/safari/SafariTestimonials';
import SafariNewsletter from '@/components/safari/SafariNewsletter';
import FloatingWildlife from '@/components/safari/FloatingWildlife';
import LoadingScreen from '@/components/safari/LoadingScreen';

const EnhancedSafariPackageBuilder: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <>
      <Helmet>
        <title>Craft Your Ultimate Wildlife Safari in Sri Lanka - Recharge Travel</title>
        <meta name="description" content="Design your dream safari in Sri Lanka with our interactive package builder. Choose lodges, activities, and experiences for your perfect wildlife adventure." />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=Montserrat+Alternates:wght@400;700;800&family=Lora:wght@400;600&family=Poppins:wght@300;400;600;700&display=swap" rel="stylesheet" />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white overflow-x-hidden">
        <FloatingWildlife />
        <SafariHero />
        <SafariSteps />
        <SafariBuilder />
        <SafariFeatures />
        <SafariTestimonials />
        <SafariNewsletter />
      </div>
    </>
  );
};

export default EnhancedSafariPackageBuilder;
