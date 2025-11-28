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
const NationalParksManager = lazy(() => import('@/components/cms/NationalParksManager'));
const WildToursManager = lazy(() => import('@/components/cms/WildToursManager'));
const DestinationContentManager = lazy(() => import('@/components/cms/DestinationContentManager'));

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
                <Route path="/panel" element={<AdminPanel />} />
                <Route path="/dashboard" element={<AdminPanel />} />
                <Route path="/bookings" element={<AdminPanel />} />
                <Route path="/hotels" element={<AdminPanel />} />
                <Route path="/tours" element={<AdminPanel />} />
                <Route path="/users" element={<AdminPanel />} />
                <Route path="/content" element={<AdminPanel />} />
                <Route path="/settings" element={<AdminPanel />} />
                <Route path="/wildlife" element={<WildlifeAdmin />} />
                <Route path="/cultural" element={<CulturalHeritageAdmin />} />
                <Route path="/ayurveda" element={<AyurvedaWellnessAdmin />} />
                <Route path="/culinary" element={<CulinaryToursManager />} />
                <Route path="/hillcountry" element={<HillCountryToursManager />} />
                <Route path="/cultural" element={<CulturalToursManager />} />
                <Route path="/photography" element={<PhotographyToursManager />} />
                <Route path="/beach" element={<BeachToursManager />} />
                <Route path="/ecotourism" element={<EcotourismToursManager />} />
                <Route path="/ramayana" element={<RamayanaToursManager />} />
                <Route path="/nationalparks" element={<NationalParksManager />} />
                <Route path="/wildtours" element={<WildToursManager />} />
                <Route path="/destinations" element={<DestinationContentManager />} />
                <Route path="/posts" element={<PostsSection />} />
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