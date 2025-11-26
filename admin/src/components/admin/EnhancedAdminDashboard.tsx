
import React, { useState } from 'react'
import { useDashboardData } from '@/hooks/useDashboardData'
import DashboardHeader from './DashboardHeader'
import DashboardContent from './DashboardContent'

const EnhancedAdminDashboard: React.FC = () => {
  const [showSettings, setShowSettings] = useState(false)
  const { data, isLoading } = useDashboardData()
  
  // Mock data for missing properties
  const totalHotels = 45
  const activeHotels = 42
  const totalUsers = data.activeUsers
  const totalBookings = data.totalBookings
  const totalRevenue = data.totalRevenue
  const recentBookings = [
    { id: 1, customer: 'John Doe', amount: 1500, status: 'confirmed' },
    { id: 2, customer: 'Jane Smith', amount: 2200, status: 'pending' }
  ]

  const handleSettingsClick = () => {
    setShowSettings(!showSettings)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader 
        onSettingsClick={handleSettingsClick}
        showSettings={showSettings}
      />
      
      <DashboardContent
        totalHotels={totalHotels}
        activeHotels={activeHotels}
        totalUsers={totalUsers}
        totalBookings={totalBookings}
        totalRevenue={totalRevenue}
        recentBookings={recentBookings}
      />
    </div>
  )
}

export default EnhancedAdminDashboard
