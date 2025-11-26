
import React from 'react'
import { CreditCard, Calendar, MapPin, Users, Hotel as HotelIcon } from 'lucide-react'
import StatCard from './StatCard'

interface DashboardStatsProps {
  totalHotels: number
  activeHotels: number
  totalUsers: number
  totalBookings: number
  totalRevenue: number
}

const DashboardStats: React.FC<DashboardStatsProps> = ({
  totalHotels,
  activeHotels,
  totalUsers,
  totalBookings,
  totalRevenue
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatCard
        title="Total Hotels"
        value={totalHotels}
        icon={<HotelIcon className="h-6 w-6 text-gray-700" />}
        link="/admin/hotels"
      />
      <StatCard
        title="Active Hotels"
        value={activeHotels}
        icon={<MapPin className="h-6 w-6 text-green-500" />}
        color="text-green-500"
        link="/admin/hotels"
      />
      <StatCard
        title="Total Users"
        value={totalUsers}
        icon={<Users className="h-6 w-6 text-blue-500" />}
        color="text-blue-500"
        link="/admin/users"
      />
      <StatCard
        title="Total Bookings"
        value={totalBookings}
        icon={<Calendar className="h-6 w-6 text-purple-500" />}
        color="text-purple-500"
        link="/admin/bookings"
      />
      <StatCard
        title="Total Revenue"
        value={`$${totalRevenue}`}
        icon={<CreditCard className="h-6 w-6 text-teal-500" />}
        color="text-teal-500"
      />
    </div>
  )
}

export default DashboardStats
