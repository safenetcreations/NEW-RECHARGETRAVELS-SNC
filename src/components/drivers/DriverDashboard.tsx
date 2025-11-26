
import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { dbService, authService, storageService } from '@/lib/firebase-services'
import { useAuth } from '@/hooks/useAuth'
import type { DriverBooking } from '@/types/driver-booking'
import DriverStatsCards from './DriverStatsCards'
import DriverVerificationStatus from './DriverVerificationStatus'
import DriverBookingsList from './DriverBookingsList'
import DriverProfileTab from './DriverProfileTab'
import DriverDocumentsTab from './DriverDocumentsTab'

interface DriverStats {
  totalBookings: number
  completedBookings: number
  pendingBookings: number
  totalEarnings: number
  averageRating: number
  verificationStatus: string
}

const DriverDashboard = () => {
  const { user } = useAuth()
  const [driverData, setDriverData] = useState<any>(null)
  const [bookings, setBookings] = useState<DriverBooking[]>([])
  const [stats, setStats] = useState<DriverStats>({
    totalBookings: 0,
    completedBookings: 0,
    pendingBookings: 0,
    totalEarnings: 0,
    averageRating: 0,
    verificationStatus: 'pending'
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user) {
      fetchDriverData()
      fetchBookings()
    }
  }, [user])

  const fetchDriverData = async () => {
    try {
      const { data, error } = await supabase
        .from('drivers')
        .select('*')
        .eq('email', user?.email)
        .single()

      if (error) throw error
      setDriverData(data)
    } catch (error) {
      console.error('Error fetching driver data:', error)
    }
  }

  const fetchBookings = async () => {
    try {
      const { data: driverRecord } = await supabase
        .from('drivers')
        .select('id, rating, overall_verification_status')
        .eq('email', user?.email)
        .single()

      if (!driverRecord) return

      const { data, error } = await supabase
        .from('driver_bookings')
        .select(`
          *,
          customers:customer_id(first_name, last_name, phone_number)
        `)
        .eq('driver_id', driverRecord.id)
        .order('created_at', { ascending: false })

      if (error) throw error

      setBookings(data || [])
      
      // Calculate stats
      const total = data?.length || 0
      const completed = data?.filter(b => b.booking_status === 'completed').length || 0
      const pending = data?.filter(b => b.booking_status === 'pending').length || 0
      const earnings = data?.reduce((sum, b) => sum + (b.final_price || 0), 0) || 0

      setStats({
        totalBookings: total,
        completedBookings: completed,
        pendingBookings: pending,
        totalEarnings: earnings,
        averageRating: driverRecord?.rating || 0,
        verificationStatus: driverRecord?.overall_verification_status || 'pending'
      })

    } catch (error) {
      console.error('Error fetching bookings:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Loading dashboard...</div>
      </div>
    )
  }

  if (!driverData) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-8">
          <h2 className="text-xl font-semibold mb-4">Complete Your Driver Registration</h2>
          <p className="text-gray-600 mb-6">
            You need to complete your driver registration to access the dashboard.
          </p>
          <Button asChild>
            <a href="/driver-registration">Complete Registration</a>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Welcome back, {driverData.first_name}!
        </h1>
        <p className="text-gray-600">Manage your bookings and profile</p>
      </div>

      <DriverStatsCards stats={stats} />
      <DriverVerificationStatus verificationStatus={stats.verificationStatus} />

      <Tabs defaultValue="bookings" className="space-y-4">
        <TabsList>
          <TabsTrigger value="bookings">Recent Bookings</TabsTrigger>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
        </TabsList>

        <TabsContent value="bookings">
          <DriverBookingsList bookings={bookings} />
        </TabsContent>

        <TabsContent value="profile">
          <DriverProfileTab driverData={driverData} />
        </TabsContent>

        <TabsContent value="documents">
          <DriverDocumentsTab driverData={driverData} />
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default DriverDashboard
