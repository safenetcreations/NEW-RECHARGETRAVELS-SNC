
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
import AboutSriLankaAdmin from '@/components/admin/AboutSriLankaAdmin';
import PageManagementSystem from '@/components/admin/PageManagementSystem';
import CustomExperienceSection from '@/components/admin/panel/CustomExperienceSection';
import CustomExperienceSubmissions from '@/components/admin/panel/CustomExperienceSubmissions';
import TrainJourneysSection from '@/components/admin/panel/TrainJourneysSection';
import AIContentTools from '@/components/admin/AIContentTools';

const AdminPanel: React.FC = () => {
  const [activeSection, setActiveSection] = useState('dashboard');

  const renderActiveSection = () => {
    switch (activeSection) {
      case 'dashboard':
        return <DashboardSection />;
      case 'hotels':
        return <HotelsSection />;
      case 'tours':
        return <ToursSection />;
      case 'activities':
        return <ActivitiesSection />;
      case 'drivers':
        return <DriversSection />;
      case 'bookings':
        return <BookingsSection />;
      case 'reviews':
        return <ReviewsSection />;
      case 'users':
        return <UsersSection />;
      case 'content':
        return <ContentSection />;
      case 'cms':
        return <ContentSection />;
      case 'about-sri-lanka':
        return <AboutSriLankaAdmin />;
      case 'custom-experience':
        return <CustomExperienceSection />;
      case 'custom-experience-submissions':
        return <CustomExperienceSubmissions />;
      case 'train-journeys':
        return <TrainJourneysSection />;
      case 'page-management':
        return <PageManagementSystem />;
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
      case 'ai-tools':
        return <AIContentTools />;
      case 'settings':
        return <SettingsSection />;
      default:
        return <DashboardSection />;
    }
  };

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
};

export default AdminPanel;
