import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { AdminGuard } from '@/components/admin/AdminGuard';
import AdminSidebar from '@/components/admin/panel/AdminSidebar';
import AdminHeader from '@/components/admin/panel/AdminHeader';
import DashboardSection from '@/components/admin/panel/DashboardSection';
import ContentSection from '@/components/admin/panel/ContentSection';
import ImageSection from '@/components/admin/panel/ImageSection';
import UsersSection from '@/components/admin/panel/UsersSection';
import SettingsSection from '@/components/admin/panel/SettingsSection';
import HotelsSection from '@/components/admin/panel/HotelsSection';
import BookingsSection from '@/components/admin/panel/BookingsSection';
import ToursSection from '@/components/admin/panel/ToursSection';
import ActivitiesSection from '@/components/admin/panel/ActivitiesSection';
import DriversSection from '@/components/admin/panel/DriversSection';
import ReviewsSection from '@/components/admin/panel/ReviewsSection';
import PagesSection from '@/components/admin/panel/PagesSection';
import PostsSection from '@/components/admin/panel/PostsSection';
import MediaSection from '@/components/admin/panel/MediaSection';
import AnalyticsSection from '@/components/admin/panel/AnalyticsSection';
import EmailTemplatesSection from '@/components/admin/panel/EmailTemplatesSection';
import FeaturedDestinationsSection from '@/components/admin/panel/FeaturedDestinationsSection';
import TravelPackagesSection from '@/components/admin/panel/TravelPackagesSection';
import ExperienceManagement from '@/components/experiences/ExperienceManagement';
import AITest from '@/components/admin/panel/AITest';
import HeroSectionManager from '@/components/admin/panel/HeroSectionManager';
import TestimonialsManager from '@/components/admin/panel/TestimonialsManager';
import WhyChooseUsManager from '@/components/admin/panel/WhyChooseUsManager';
import HomepageStatsManager from '@/components/admin/panel/HomepageStatsManager';

const AdminPanel: React.FC = () => {
  const [activeSection, setActiveSection] = useState('ai-test');

  console.log('🎯 AdminPanel component rendering, activeSection:', activeSection);

  const renderActiveSection = () => {
    try {
      console.log('🎯 Rendering section:', activeSection);

      switch (activeSection) {
        case 'dashboard':
          return <DashboardSection />;
        // Landing Page CMS
        case 'hero-section':
          return <HeroSectionManager />;
        case 'testimonials':
          return <TestimonialsManager />;
        case 'about-section':
          return <div className="p-6"><h2 className="text-2xl font-bold">About Section Manager - Coming Soon</h2></div>;
        case 'why-choose-us':
          return <WhyChooseUsManager />;
        case 'homepage-stats':
          return <HomepageStatsManager />;
        // Services
        case 'hotels':
          return <HotelsSection />;
        case 'tours':
          return <ToursSection />;
        case 'activities':
          return <ActivitiesSection />;
        case 'experiences':
          return <ExperienceManagement />;
        case 'drivers':
          return <DriversSection />;
        case 'bookings':
          return <BookingsSection />;
        case 'reviews':
          return <ReviewsSection />;
        case 'users':
          return <UsersSection />;
        // Content
        case 'content':
          return <ContentSection />;
        case 'cms':
          return <ContentSection />;
        case 'images':
          return <ImageSection />;
        case 'pages':
          return <PagesSection />;
        case 'posts':
          return <PostsSection />;
        case 'media':
          return <MediaSection />;
        case 'analytics':
          return <AnalyticsSection />;
        case 'email-templates':
          return <EmailTemplatesSection />;
        case 'settings':
          return <SettingsSection />;
        case 'featured-destinations':
          return <FeaturedDestinationsSection />;
        case 'travel-packages':
          return <TravelPackagesSection />;
        case 'ai-test':
          return <AITest />;
        default:
          return <DashboardSection />;
      }
    } catch (error) {
      console.error('🔴 Error rendering section:', error);
      return (
        <div className="p-6">
          <h1 className="text-2xl font-bold text-red-600">Error Loading Section</h1>
          <p className="text-gray-600">There was an error loading the {activeSection} section.</p>
          <pre className="mt-4 p-4 bg-gray-100 rounded text-sm">{error?.toString()}</pre>
        </div>
      );
    }
  };

  try {
    return (
      <AdminGuard>
        <Helmet>
          <title>Admin Panel - Recharge Travels</title>
          <meta name="description" content="Complete admin panel for managing website content" />
        </Helmet>

        <div className="flex min-h-screen bg-gray-50">
          <AdminSidebar 
            activeSection={activeSection} 
            onSectionChange={setActiveSection} 
          />
          
          <main className="flex-1 overflow-y-auto">
            <AdminHeader activeSection={activeSection} />
            <div className="p-6">
              {renderActiveSection()}
            </div>
          </main>
        </div>
      </AdminGuard>
    );
  } catch (error) {
    console.error('🔴 Error in AdminPanel component:', error);
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Admin Panel Error</h1>
          <p className="text-gray-600 mb-4">There was an error loading the admin panel.</p>
          <pre className="p-4 bg-gray-100 rounded text-sm max-w-2xl overflow-auto">{error?.toString()}</pre>
        </div>
      </div>
    );
  }
};

export default AdminPanel;
