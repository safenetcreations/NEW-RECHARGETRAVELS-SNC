import { Routes, Route, Navigate, Link, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import './App.css'

function SimpleApp() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    // Check if user is logged in
    const authStatus = localStorage.getItem('adminAuth')
    if (authStatus === 'true') {
      setIsAuthenticated(true)
    }
  }, [])

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    // Simple authentication - in production, use proper auth
    localStorage.setItem('adminAuth', 'true')
    setIsAuthenticated(true)
    navigate('/dashboard')
  }

  const handleLogout = () => {
    localStorage.removeItem('adminAuth')
    setIsAuthenticated(false)
    navigate('/login')
  }

  if (!isAuthenticated && window.location.pathname !== '/login') {
    return <Navigate to="/login" replace />
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={
          <div className="flex items-center justify-center min-h-screen">
            <div className="bg-white p-8 rounded-lg shadow-md w-96">
              <h1 className="text-2xl font-bold mb-6">Admin Login</h1>
              <form onSubmit={handleLogin}>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    className="w-full px-3 py-2 border rounded-lg"
                    placeholder="admin@rechargetravels.com"
                    required
                  />
                </div>
                <div className="mb-6">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Password
                  </label>
                  <input
                    type="password"
                    className="w-full px-3 py-2 border rounded-lg"
                    placeholder="********"
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-blue-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-600"
                >
                  Login
                </button>
              </form>
            </div>
          </div>
        } />
        <Route path="/dashboard" element={
          <div>
            <nav className="bg-white shadow-md">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                  <div className="flex items-center">
                    <h1 className="text-xl font-semibold">Recharge Travels Admin</h1>
                  </div>
                  <div className="flex items-center space-x-4">
                    <Link to="/bookings" className="text-gray-700 hover:text-gray-900">Bookings</Link>
                    <Link to="/hotels" className="text-gray-700 hover:text-gray-900">Hotels</Link>
                    <Link to="/users" className="text-gray-700 hover:text-gray-900">Users</Link>
                    <button
                      onClick={handleLogout}
                      className="text-red-600 hover:text-red-800"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              </div>
            </nav>
            <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
              <div className="px-4 py-6 sm:px-0">
                <h2 className="text-2xl font-bold mb-4">Admin Dashboard</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-white p-6 rounded-lg shadow">
                    <h3 className="text-lg font-semibold mb-2">Total Bookings</h3>
                    <p className="text-3xl font-bold text-blue-600">0</p>
                  </div>
                  <div className="bg-white p-6 rounded-lg shadow">
                    <h3 className="text-lg font-semibold mb-2">Active Users</h3>
                    <p className="text-3xl font-bold text-green-600">0</p>
                  </div>
                  <div className="bg-white p-6 rounded-lg shadow">
                    <h3 className="text-lg font-semibold mb-2">Revenue</h3>
                    <p className="text-3xl font-bold text-purple-600">$0</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        } />
        <Route path="/bookings" element={
          <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold mb-4">Bookings Management</h2>
            <p>Bookings management coming soon...</p>
          </div>
        } />
        <Route path="/hotels" element={
          <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold mb-4">Hotels Management</h2>
            <p>Hotels management coming soon...</p>
          </div>
        } />
        <Route path="/users" element={
          <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold mb-4">Users Management</h2>
            <p>Users management coming soon...</p>
          </div>
        } />
      </Routes>
    </div>
  )
}

export default SimpleApp