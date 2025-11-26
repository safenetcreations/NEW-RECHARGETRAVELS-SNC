import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import AyurvedaSidebar from '@/components/admin/ayurveda/AyurvedaSidebar';
import AyurvedaHeader from '@/components/admin/ayurveda/AyurvedaHeader';
import AyurvedaDashboard from '@/components/admin/ayurveda/AyurvedaDashboard';
import HeroSection from '@/components/admin/ayurveda/HeroSection';
import PhilosophySection from '@/components/admin/ayurveda/PhilosophySection';
import RetreatsSection from '@/components/admin/ayurveda/RetreatsSection';
import TreatmentsSection from '@/components/admin/ayurveda/TreatmentsSection';
import TestimonialsSection from '@/components/admin/ayurveda/TestimonialsSection';
import CtaSection from '@/components/admin/ayurveda/CtaSection';
import SettingsSection from '@/components/admin/ayurveda/SettingsSection';

const AyurvedaWellnessAdmin: React.FC = () => {
  const [activeSection, setActiveSection] = useState('dashboard');

  const renderActiveSection = () => {
    switch (activeSection) {
      case 'dashboard':
        return <AyurvedaDashboard />;
      case 'hero':
        return <HeroSection />;
      case 'philosophy':
        return <PhilosophySection />;
      case 'retreats':
        return <RetreatsSection />;
      case 'treatments':
        return <TreatmentsSection />;
      case 'testimonials':
        return <TestimonialsSection />;
      case 'cta':
        return <CtaSection />;
      case 'settings':
        return <SettingsSection />;
      default:
        return <AyurvedaDashboard />;
    }
  };

  return (
    <>
      <Helmet>
        <title>Ayurveda & Wellness Admin | Recharge Travels</title>
        <meta name="description" content="Manage Ayurveda & Wellness retreats, treatments, and content" />
      </Helmet>

      <div className="flex min-h-screen bg-gradient-to-br from-emerald-50 via-amber-50 to-orange-50">
        <AyurvedaSidebar
          activeSection={activeSection}
          onSectionChange={setActiveSection}
        />

        <main className="flex-1 overflow-y-auto">
          <AyurvedaHeader activeSection={activeSection} />
          <div className="p-6">
            {renderActiveSection()}
          </div>
        </main>
      </div>
    </>
  );
};

export default AyurvedaWellnessAdmin;
