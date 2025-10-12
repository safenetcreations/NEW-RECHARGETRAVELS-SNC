
import React from 'react'
import DashboardStats from './DashboardStats'
import RecentBookingsTable from './RecentBookingsTable'
import SalesPerformanceChart from './SalesPerformanceChart'
import AIScoreManager from './AIScoreManager'

interface Booking {
  id: string
  user_id: string
  hotel_id: string
  check_in_date: string
  amount?: number
}

interface DashboardContentProps {
  totalHotels: number
  activeHotels: number
  totalUsers: number
  totalBookings: number
  totalRevenue: number
  recentBookings: Booking[]
}

const DashboardContent: React.FC<DashboardContentProps> = ({
  totalHotels,
  activeHotels,
  totalUsers,
  totalBookings,
  totalRevenue,
  recentBookings
}) => {
  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <DashboardStats
        totalHotels={totalHotels}
        activeHotels={activeHotels}
        totalUsers={totalUsers}
        totalBookings={totalBookings}
        totalRevenue={totalRevenue}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <RecentBookingsTable bookings={recentBookings} />
        <AIScoreManager />
      </div>

      <SalesPerformanceChart />
    </main>
  )
}

export default DashboardContent
