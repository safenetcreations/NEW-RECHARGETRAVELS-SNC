import React, { useState, Suspense, lazy } from 'react';
import { Helmet } from 'react-helmet-async';
import { AdminGuard } from '@/components/admin/AdminGuard';
import AdminSidebar from '@/components/admin/panel/AdminSidebar';
import AdminHeader from '@/components/admin/panel/AdminHeader';
import LoadingSpinner from '@/components/LoadingSpinner';

const DashboardSection = lazy(() => import('@/components/admin/panel/DashboardSection'));
const ContentSection = lazy(() => import('@/components/admin/panel/ContentSection'));
const ImageSection = lazy(() => import('@/components/admin/panel/ImageSection'));
const UsersManagement = lazy(() => import('@/components/admin/panel/UsersManagement'));
const SettingsSection = lazy(() => import('@/components/admin/panel/SettingsSection'));
const HotelsManagement = lazy(() => import('@/components/admin/panel/HotelsManagement'));
const BookingsManagement = lazy(() => import('@/components/admin/panel/BookingsManagement'));
const ToursSection = lazy(() => import('@/components/admin/panel/ToursSection'));
const ToursManagement = lazy(() => import('@/components/admin/panel/ToursManagement'));
const ActivitiesSection = lazy(() => import('@/components/admin/panel/ActivitiesSection'));
const DriversManagement = lazy(() => import('@/components/admin/panel/DriversManagement'));
const ReviewsSection = lazy(() => import('@/components/admin/panel/ReviewsSection'));
const PagesSection = lazy(() => import('@/components/admin/panel/PagesSection'));
const PagesManagement = lazy(() => import('@/components/admin/panel/PagesManagement'));
const PostsSection = lazy(() => import('@/components/admin/panel/PostsSection'));
const EditPost = lazy(() => import('@/pages/admin/EditPost'));
const MediaSection = lazy(() => import('@/components/admin/panel/MediaSection'));
const AnalyticsSection = lazy(() => import('@/components/admin/panel/AnalyticsSection'));
const EmailTemplatesSection = lazy(() => import('@/components/admin/panel/EmailTemplatesSection'));
const FeaturedDestinationsSection = lazy(() => import('@/components/admin/panel/FeaturedDestinationsSection'));
const TravelPackagesSection = lazy(() => import('@/components/admin/panel/TravelPackagesSection'));
const ExperienceManagement = lazy(() => import('@/components/experiences/ExperienceManagement'));
const AITest = lazy(() => import('@/components/admin/panel/AITest'));
const HeroSectionManager = lazy(() => import('@/components/admin/panel/HeroSectionManager'));
const TestimonialsManager = lazy(() => import('@/components/admin/panel/TestimonialsManager'));
const WhyChooseUsManager = lazy(() => import('@/components/admin/panel/WhyChooseUsManager'));
const HomepageStatsManager = lazy(() => import('@/components/admin/panel/HomepageStatsManager'));
const AboutSriLankaManagement = lazy(() => import('@/components/admin/panel/AboutSriLankaManagement'));
const LuxuryExperiencesManager = lazy(() => import('@/components/admin/panel/LuxuryExperiencesManager'));
const TravelGuideManager = lazy(() => import('@/components/admin/panel/TravelGuideManager'));
const BlogManager = lazy(() => import('@/components/admin/panel/BlogManager'));
const BlogEditor = lazy(() => import('@/components/admin/panel/BlogEditor'));
const AIContentGenerator = lazy(() => import('@/components/admin/panel/AIContentGenerator'));
const DestinationContentManager = lazy(() => import('@/components/admin/panel/DestinationContentManager'));
const DriverVerificationQueue = lazy(() => import('@/components/admin/panel/DriverVerificationQueue'));
const NegomboDestinationManagement = lazy(
  () => import('@/components/admin/panel/NegomboDestinationManagement'),
);
const AdamsPeakDestinationManagement = lazy(
  () => import('@/components/admin/panel/AdamsPeakDestinationManagement'),
);
const SocialMediaManager = lazy(() => import('@/components/admin/panel/SocialMediaManager'));
const GroupTransportBookingsManagement = lazy(
  () => import('@/components/admin/panel/GroupTransportBookingsManagement'),
);
const ContentManagementDashboard = lazy(
  () => import('@/components/cms/ContentManagementDashboard'),
);
const TripBuilderManager = lazy(() => import('@/components/admin/panel/TripBuilderManager'));

const AdminPanel: React.FC = () => {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
        case 'about-sri-lanka':
          return <AboutSriLankaManagement />;
        case 'why-choose-us':
          return <WhyChooseUsManager />;
        case 'homepage-stats':
          return <HomepageStatsManager />;
        case 'featured-destinations':
          return <FeaturedDestinationsSection />;
        case 'travel-packages':
          return <TravelPackagesSection />;
        case 'luxury-experiences':
          return <LuxuryExperiencesManager />;
        case 'travel-guide':
          return <TravelGuideManager />;
        case 'destination-content':
          return <DestinationContentManager />;
        case 'negombo-destination':
          return <NegomboDestinationManagement />;
        case 'adams-peak-destination':
          return <AdamsPeakDestinationManagement />;
        // Services
        case 'hotels':
          return <HotelsManagement />;
        case 'tours':
          return <ToursManagement />;
        case 'tours-old':
          return <ToursSection />;
        case 'activities':
          return <ActivitiesSection />;
        case 'experiences':
          return <div className="p-6"><h2 className="text-2xl font-bold">Experiences Manager - Use Luxury Experiences instead</h2></div>;
        case 'drivers':
          return <DriversManagement />;
        case 'driver-verification':
          return <DriverVerificationQueue />;
        case 'bookings':
          return <BookingsManagement />;
        case 'reviews':
          return <ReviewsSection />;
        case 'users':
          return <UsersManagement />;
        // Content
        case 'content':
          return <ContentSection />;
        case 'cms':
          return <ContentSection />;
        case 'images':
          return <ImageSection />;
        case 'pages':
          return <PagesManagement />;
        case 'posts':
          return <PostsSection />;
        case 'edit-post':
          return <EditPost />;
        case 'media':
          return <MediaSection />;
        case 'analytics':
          return <AnalyticsSection />;
        case 'email-templates':
          return <EmailTemplatesSection />;
        case 'settings':
          return <SettingsSection />;
        case 'ai-test':
          return <AITest />;
        // Legacy CMS dashboard (includes Group Transport CMS)
        case 'content-dashboard':
          return <ContentManagementDashboard />;
        // Group Transport bookings (new panel)
        case 'group-transport-bookings':
          return <GroupTransportBookingsManagement />;
        // Blog System
        case 'blog-manager':
          return <BlogManager onNavigate={setActiveSection} />;
        case 'blog-editor':
          return <BlogEditor onNavigate={setActiveSection} />;
        case 'ai-content-generator':
          return <AIContentGenerator onNavigate={setActiveSection} />;
        // Social Media
        case 'social-media':
          return <SocialMediaManager />;
        // Trip Builder
        case 'trip-builder':
          return <TripBuilderManager />;
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

        <div className="flex min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-blue-50">
          <AdminSidebar
            activeSection={activeSection}
            onSectionChange={setActiveSection}
            isMobileMenuOpen={isMobileMenuOpen}
            onMobileMenuClose={() => setIsMobileMenuOpen(false)}
          />

          <main className="flex-1 overflow-y-auto bg-gradient-to-br from-slate-50/50 via-purple-50/30 to-blue-50/50 lg:ml-0">
            <AdminHeader
              activeSection={activeSection}
              onMobileMenuToggle={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            />
            <div className="p-4 sm:p-6 lg:p-8">
              <div className="max-w-7xl mx-auto">
                <Suspense fallback={<LoadingSpinner />}>
                  {renderActiveSection()}
                </Suspense>
              </div>
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
