import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { HelmetProvider } from 'react-helmet-async';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as SonnerToaster } from 'sonner';
import { AuthProvider } from '@/contexts/AuthContext';
import LoadingSpinner from '@/components/LoadingSpinner';
import './App.css';

const AdminLogin = lazy(() => import('@/pages/AdminLogin'));
const AdminPanel = lazy(() => import('@/pages/admin/AdminPanel'));
const CulturalHeritageAdmin = lazy(() => import('@/pages/admin/CulturalHeritageAdmin'));
const WildlifeAdmin = lazy(() => import('@/pages/admin/WildlifeAdmin'));
const AyurvedaWellnessAdmin = lazy(() => import('@/pages/admin/AyurvedaWellnessAdmin'));
const CreatePost = lazy(() => import('@/pages/admin/CreatePost'));
const PostsSection = lazy(() => import('@/components/admin/panel/PostsSection'));
const CulinaryToursManager = lazy(() => import('@/components/cms/CulinaryToursManager'));
const HillCountryToursManager = lazy(() => import('@/components/cms/HillCountryToursManager'));
const CulturalToursManager = lazy(() => import('@/components/cms/CulturalToursManager'));
const PhotographyToursManager = lazy(() => import('@/components/cms/PhotographyToursManager'));
const BeachToursManager = lazy(() => import('@/components/cms/BeachToursManager'));
const EcotourismToursManager = lazy(() => import('@/components/cms/EcotourismToursManager'));
const RamayanaToursManager = lazy(() => import('@/components/cms/RamayanaToursManager'));
const CookingClassManager = lazy(() => import('@/components/cms/CookingClassManager'));
const NationalParksManager = lazy(() => import('@/components/cms/NationalParksManager'));
const WildToursManager = lazy(() => import('@/components/cms/WildToursManager'));
const DestinationContentManager = lazy(() => import('@/components/cms/DestinationContentManager'));

// Section-specific routes - each renders AdminPanel with a specific section
const AdminPanelWithSection = ({ section }: { section: string }) => <AdminPanel initialSection={section} />;

const queryClient = new QueryClient();

// Add error boundary
window.addEventListener('error', (event) => {
  console.error('🔴 Global error caught:', event.error);
});

window.addEventListener('unhandledrejection', (event) => {
  console.error('🔴 Unhandled promise rejection:', event.reason);
});

function App() {
  console.log('🚀 Admin App starting...');

  return (
    <QueryClientProvider client={queryClient}>
      <HelmetProvider>
        <AuthProvider>
          <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-blue-50">
            <Suspense fallback={<LoadingSpinner />}>
              <Routes>
                <Route path="/" element={<Navigate to="/login" replace />} />
                <Route path="/login" element={<AdminLogin />} />
                <Route path="/signup" element={<AdminLogin />} />

                {/* Main Admin Panel Routes - each with direct URL */}
                <Route path="/panel" element={<AdminPanel />} />
                <Route path="/dashboard" element={<AdminPanelWithSection section="dashboard" />} />

                {/* Overview */}
                <Route path="/analytics" element={<AdminPanelWithSection section="analytics" />} />

                {/* Landing Page CMS */}
                <Route path="/hero-section" element={<AdminPanelWithSection section="hero-section" />} />
                <Route path="/featured-destinations" element={<AdminPanelWithSection section="featured-destinations" />} />
                <Route path="/luxury-experiences" element={<AdminPanelWithSection section="luxury-experiences" />} />
                <Route path="/travel-packages" element={<AdminPanelWithSection section="travel-packages" />} />
                <Route path="/testimonials" element={<AdminPanelWithSection section="testimonials" />} />
                <Route path="/about-section" element={<AdminPanelWithSection section="about-section" />} />
                <Route path="/about-sri-lanka" element={<AdminPanelWithSection section="about-sri-lanka" />} />
                <Route path="/travel-guide" element={<AdminPanelWithSection section="travel-guide" />} />
                <Route path="/book-now" element={<AdminPanelWithSection section="book-now" />} />
                <Route path="/whale-booking" element={<AdminPanelWithSection section="whale-booking" />} />
                <Route path="/hot-air-balloon" element={<AdminPanelWithSection section="hot-air-balloon" />} />
                <Route path="/jungle-camping" element={<AdminPanelWithSection section="jungle-camping" />} />
                <Route path="/kalpitiya-kitesurfing" element={<AdminPanelWithSection section="kalpitiya-kitesurfing" />} />
                <Route path="/private-charters" element={<AdminPanelWithSection section="private-charters" />} />
                <Route path="/sea-cucumber-farming" element={<AdminPanelWithSection section="sea-cucumber-farming" />} />
                <Route path="/private-tours" element={<AdminPanelWithSection section="private-tours" />} />
                <Route path="/group-transport" element={<AdminPanelWithSection section="group-transport" />} />
                <Route path="/train-booking" element={<AdminPanelWithSection section="train-booking" />} />
                <Route path="/ayurveda-wellness" element={<AdminPanelWithSection section="ayurveda-wellness" />} />
                <Route path="/tea-trails" element={<AdminPanelWithSection section="tea-trails" />} />
                <Route path="/pilgrimage-tours" element={<AdminPanelWithSection section="pilgrimage-tours" />} />
                <Route path="/why-choose-us" element={<AdminPanelWithSection section="why-choose-us" />} />
                <Route path="/homepage-stats" element={<AdminPanelWithSection section="homepage-stats" />} />

                {/* Blog System */}
                <Route path="/blog-manager" element={<AdminPanelWithSection section="blog-manager" />} />
                <Route path="/ai-content-generator" element={<AdminPanelWithSection section="ai-content-generator" />} />

                {/* Content */}
                <Route path="/content-dashboard" element={<AdminPanelWithSection section="content-dashboard" />} />
                <Route path="/pages" element={<AdminPanelWithSection section="pages" />} />
                <Route path="/posts" element={<AdminPanelWithSection section="posts" />} />
                <Route path="/media" element={<AdminPanelWithSection section="media" />} />
                <Route path="/social-media" element={<AdminPanelWithSection section="social-media" />} />
                <Route path="/trip-builder" element={<AdminPanelWithSection section="trip-builder" />} />

                {/* Services */}
                <Route path="/hotels" element={<AdminPanelWithSection section="hotels" />} />
                <Route path="/tours" element={<AdminPanelWithSection section="tours" />} />
                <Route path="/activities" element={<AdminPanelWithSection section="activities" />} />
                <Route path="/drivers" element={<AdminPanelWithSection section="drivers" />} />
                <Route path="/driver-verification" element={<AdminPanelWithSection section="driver-verification" />} />
                <Route path="/vendor-approvals" element={<AdminPanelWithSection section="vendor-approvals" />} />

                {/* Management */}
                <Route path="/bookings" element={<AdminPanelWithSection section="bookings" />} />
                <Route path="/group-transport-bookings" element={<AdminPanelWithSection section="group-transport-bookings" />} />
                <Route path="/customers" element={<AdminPanelWithSection section="customers" />} />
                <Route path="/reviews" element={<AdminPanelWithSection section="reviews" />} />
                <Route path="/users" element={<AdminPanelWithSection section="users" />} />

                {/* Finance */}
                <Route path="/driver-analytics" element={<AdminPanelWithSection section="driver-analytics" />} />
                <Route path="/commission-settings" element={<AdminPanelWithSection section="commission-settings" />} />
                <Route path="/payment-settlements" element={<AdminPanelWithSection section="payment-settlements" />} />
                <Route path="/driver-wallets" element={<AdminPanelWithSection section="driver-wallets" />} />

                {/* System */}
                <Route path="/email-templates" element={<AdminPanelWithSection section="email-templates" />} />
                <Route path="/settings" element={<AdminPanelWithSection section="settings" />} />
                <Route path="/ai-test" element={<AdminPanelWithSection section="ai-test" />} />

                {/* Standalone pages */}
                <Route path="/wildlife" element={<WildlifeAdmin />} />
                <Route path="/cultural" element={<CulturalHeritageAdmin />} />
                <Route path="/ayurveda" element={<AyurvedaWellnessAdmin />} />
                <Route path="/culinary" element={<CulinaryToursManager />} />
                <Route path="/hillcountry" element={<HillCountryToursManager />} />
                <Route path="/photography" element={<PhotographyToursManager />} />
                <Route path="/beach" element={<BeachToursManager />} />
                <Route path="/ecotourism" element={<EcotourismToursManager />} />
                <Route path="/ramayana" element={<RamayanaToursManager />} />
                <Route path="/cooking-class" element={<CookingClassManager />} />
                <Route path="/nationalparks" element={<AdminPanelWithSection section="nationalparks" />} />
                <Route path="/wildtours" element={<WildToursManager />} />
                <Route path="/cultural-tours" element={<CulturalToursManager />} />
                <Route path="/destinations" element={<DestinationContentManager />} />
                <Route path="/posts/new" element={<CreatePost />} />
              </Routes>
            </Suspense>
            <Toaster />
            <SonnerToaster
              position="top-right"
              toastOptions={{
                style: {
                  background: 'white',
                  color: '#1f2937',
                  border: '1px solid #e5e7eb',
                  borderRadius: '12px',
                  boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                },
                duration: 4000,
              }}
              richColors
            />
          </div>
        </AuthProvider>
      </HelmetProvider>
    </QueryClientProvider>
  );
}

export default App;