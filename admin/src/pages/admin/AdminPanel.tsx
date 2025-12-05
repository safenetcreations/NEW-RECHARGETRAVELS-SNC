import React, { useState, useEffect, Suspense, lazy } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate, useLocation } from 'react-router-dom';
import { AdminGuard } from '@/components/admin/AdminGuard';
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
const VendorApprovals = lazy(() => import('@/components/admin/panel/VendorApprovals'));
const CommissionSettingsPanel = lazy(() => import('@/components/admin/panel/CommissionSettingsPanel'));
const PaymentSettlementsPanel = lazy(() => import('@/components/admin/panel/PaymentSettlementsPanel'));
const DriverAnalyticsDashboard = lazy(() => import('@/components/admin/panel/DriverAnalyticsDashboard'));
const BookNowManager = lazy(() => import('@/components/admin/panel/BookNowManager'));
const WhaleBookingManager = lazy(() => import('@/components/admin/panel/WhaleBookingManager'));
const JungleCampingManager = lazy(() => import('@/components/admin/panel/JungleCampingManager'));
const HotAirBalloonManager = lazy(() => import('@/components/admin/panel/HotAirBalloonManager'));
const KalpitiyaKitesurfingManager = lazy(() => import('@/components/admin/panel/KalpitiyaKitesurfingManager'));
const PrivateChartersManager = lazy(() => import('@/components/admin/panel/PrivateChartersManager'));
const SeaCucumberManager = lazy(() => import('@/components/admin/panel/SeaCucumberManager'));
const AboutSectionManager = lazy(() => import('@/components/admin/panel/AboutSectionManager'));
const NationalParksManager = lazy(() => import('@/components/cms/NationalParksManager'));
const AyurvedaManager = lazy(() => import('@/components/admin/panel/AyurvedaManager'));
const TeaTrailsManager = lazy(() => import('@/components/admin/panel/TeaTrailsManager'));
const PilgrimageManager = lazy(() => import('@/components/admin/panel/PilgrimageManager'));
const CustomerCrmManager = lazy(() => import('@/components/admin/panel/CustomerCrmManager'));
const PrivateToursManager = lazy(() => import('@/components/admin/panel/PrivateToursManager'));
const GroupTransportManager = lazy(() => import('@/components/admin/panel/GroupTransportManager'));
const TrainBookingManager = lazy(() => import('@/components/admin/panel/TrainBookingManager'));
const GlobalToursManager = lazy(() => import('@/components/admin/panel/GlobalToursManager'));
const GlobalTourBookingsManager = lazy(() => import('@/components/admin/panel/GlobalTourBookingsManager'));
const EnhancedDashboard = lazy(() => import('@/components/admin/panel/EnhancedDashboard'));
const B2BDashboard = lazy(() => import('@/components/admin/panel/B2BDashboard'));
const AIContentHub = lazy(() => import('@/components/admin/panel/AIContentHub'));
const EmailQueueManager = lazy(() => import('@/components/admin/panel/EmailQueueManager'));
const ModernNavigation = lazy(() => import('@/components/admin/panel/ModernNavigation'));
const PropertyListingsManager = lazy(() => import('@/components/admin/panel/PropertyListingsManager'));
const FleetVehiclesManager = lazy(() => import('@/components/admin/panel/FleetVehiclesManager'));
const YaluManager = lazy(() => import('@/components/admin/panel/YaluManager'));
const WildToursManager = lazy(() => import('@/components/cms/WildToursManager'));
const ExclusiveAccessAdmin = lazy(() => import('@/pages/admin/ExclusiveAccessAdmin'));

interface AdminPanelProps {
  initialSection?: string;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ initialSection }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeSection, setActiveSection] = useState(initialSection || 'dashboard');

  // Sync active section with URL/initialSection
  useEffect(() => {
    if (initialSection) {
      setActiveSection(initialSection);
    }
  }, [initialSection]);

  // Handle section change with URL update
  const handleSectionChange = (section: string) => {
    setActiveSection(section);
    // Update URL to match section
    navigate(`/${section}`, { replace: true });
  };

  console.log('🎯 AdminPanel component rendering, activeSection:', activeSection);

  const renderActiveSection = () => {
    try {
      console.log('🎯 Rendering section:', activeSection);

      switch (activeSection) {
        case 'dashboard':
          return <DashboardSection onNavigate={setActiveSection} />;
        // Landing Page CMS
        case 'hero-section':
          return <HeroSectionManager />;
        case 'testimonials':
          return <TestimonialsManager />;
        case 'about-section':
          return <AboutSectionManager />;
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
        case 'exclusive-access':
          return <ExclusiveAccessAdmin />;
        case 'travel-guide':
          return <TravelGuideManager />;
        case 'book-now':
          return <BookNowManager />;
        case 'wild-tours':
          return <WildToursManager />;
        case 'whale-booking':
          return <WhaleBookingManager />;
        case 'jungle-camping':
          return <JungleCampingManager />;
        case 'hot-air-balloon':
          return <HotAirBalloonManager />;
        case 'kalpitiya-kitesurfing':
          return <KalpitiyaKitesurfingManager />;
        case 'private-charters':
          return <PrivateChartersManager />;
        case 'sea-cucumber-farming':
          return <SeaCucumberManager />;
        case 'ayurveda-wellness':
          return <AyurvedaManager />;
        case 'tea-trails':
          return <TeaTrailsManager />;
        case 'pilgrimage-tours':
          return <PilgrimageManager />;
        case 'private-tours':
          return <PrivateToursManager />;
        case 'group-transport':
          return <GroupTransportManager />;
        case 'train-booking':
          return <TrainBookingManager />;
        case 'destination-content':
          return <DestinationContentManager />;
        case 'negombo-destination':
          return <NegomboDestinationManagement />;
        case 'adams-peak-destination':
          return <AdamsPeakDestinationManagement />;
        // Global Tours
        case 'global-tours':
          return <GlobalToursManager />;
        case 'global-tour-bookings':
          return <GlobalTourBookingsManager />;
        // Services
        case 'hotels':
          return <HotelsManagement />;
        case 'property-listings':
          return <PropertyListingsManager />;
        case 'fleet-vehicles':
          return <FleetVehiclesManager />;
        case 'tours':
          return <ToursManagement />;
        case 'tours-old':
          return <ToursSection />;
        case 'nationalparks':
          return <NationalParksManager />;
        case 'activities':
          return <ActivitiesSection />;
        case 'experiences':
          return <div className="p-6"><h2 className="text-2xl font-bold">Experiences Manager - Use Luxury Experiences instead</h2></div>;
        case 'drivers':
          return <DriversManagement />;
        case 'driver-verification':
          return <DriverVerificationQueue />;
        case 'vendor-approvals':
          return <VendorApprovals />;
        case 'bookings':
          return <BookingsManagement />;
        case 'customers':
          return <CustomerCrmManager />;
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
        // Finance
        case 'commission-settings':
          return <CommissionSettingsPanel />;
        case 'payment-settlements':
          return <PaymentSettlementsPanel />;
        case 'driver-wallets':
          return <div className="p-6"><h2 className="text-2xl font-bold">Driver Wallets - Coming Soon</h2><p className="text-gray-600 mt-2">View and manage driver wallet balances</p></div>;
        case 'driver-analytics':
          return <DriverAnalyticsDashboard />;
        // B2B Portal
        case 'b2b-dashboard':
          return <B2BDashboard />;
        case 'b2b-agencies':
          return <div className="p-6"><h2 className="text-2xl font-bold">B2B Agency Management</h2><p className="text-gray-600 mt-2">Manage B2B partner agencies - Use Firebase Console or B2B API endpoints</p></div>;
        case 'b2b-bookings':
          return <div className="p-6"><h2 className="text-2xl font-bold">B2B Bookings</h2><p className="text-gray-600 mt-2">View B2B partner bookings - Use Firebase Console or B2B API endpoints</p></div>;
        case 'b2b-tours':
          return <div className="p-6"><h2 className="text-2xl font-bold">B2B Tours</h2><p className="text-gray-600 mt-2">Manage B2B tour packages - Use Firebase Console or B2B API endpoints</p></div>;
        case 'b2b-analytics':
          return <div className="p-6"><h2 className="text-2xl font-bold">B2B Analytics</h2><p className="text-gray-600 mt-2">B2B performance analytics coming soon</p></div>;
        // AI Tools
        case 'ai-hub':
        case 'ai-image-generator':
        case 'ai-seo-optimizer':
        case 'ai-chatbot':
          return <AIContentHub />;
        case 'yalu-manager':
          return <YaluManager />;
        // Email Management
        case 'email-queue':
          return <EmailQueueManager />;
        // Enhanced Dashboard
        case 'enhanced-dashboard':
          return <EnhancedDashboard />;
        default:
          return <EnhancedDashboard />;
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

        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-slate-100">
          {/* Modern Top Navigation */}
          <ModernNavigation />

          {/* Main Content Area - Full Width */}
          <main className="min-h-[calc(100vh-64px)]">
            <div className="max-w-[1600px] mx-auto">
              <Suspense fallback={<LoadingSpinner />}>
                {renderActiveSection()}
              </Suspense>
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
