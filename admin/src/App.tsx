import { Routes, Route, Navigate } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { HelmetProvider } from 'react-helmet-async'
import { Toaster } from "@/components/ui/toaster"
import { Toaster as SonnerToaster } from 'sonner'
import { AuthProvider } from '@/contexts/AuthContext'
import AdminLogin from '@/pages/AdminLogin'
import AdminPanel from '@/pages/admin/AdminPanel'
import CulturalHeritageAdmin from '@/pages/admin/CulturalHeritageAdmin'
import WildlifeAdmin from '@/pages/admin/WildlifeAdmin'
import CreatePost from '@/pages/admin/CreatePost'
import PostsSection from '@/components/admin/panel/PostsSection'
import './App.css'

const queryClient = new QueryClient()

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
              <Route path="/posts" element={<PostsSection />} />
              <Route path="/posts/new" element={<CreatePost />} />
            </Routes>
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
  )
}

export default App