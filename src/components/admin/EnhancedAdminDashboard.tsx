
import React, { useState } from 'react'
import { useDashboardData } from '@/hooks/useDashboardData'
import DashboardHeader from './DashboardHeader'
import DashboardContent from './DashboardContent'

const EnhancedAdminDashboard: React.FC = () => {
  const [showSettings, setShowSettings] = useState(false)
  const {
    totalHotels,
    activeHotels,
    totalUsers,
    totalBookings,
    totalRevenue,
    recentBookings,
    isLoading
  } = useDashboardData()

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
