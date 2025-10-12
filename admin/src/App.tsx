import { Routes, Route, Navigate } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { HelmetProvider } from 'react-helmet-async'
import { Toaster } from "@/components/ui/toaster"
import { AuthProvider } from '@/contexts/AuthContext'
import AdminAccess from '@/pages/AdminAccess'
import AdminPanel from '@/pages/admin/AdminPanel'
import CulturalHeritageAdmin from '@/pages/admin/CulturalHeritageAdmin'
import WildlifeAdmin from '@/pages/admin/WildlifeAdmin'
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
          <div className="min-h-screen bg-gray-50">
            <Routes>
              <Route path="/" element={<Navigate to="/login" replace />} />
              <Route path="/login" element={<AdminAccess />} />
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
            </Routes>
            <Toaster />
          </div>
        </AuthProvider>
      </HelmetProvider>
    </QueryClientProvider>
  )
}

export default App