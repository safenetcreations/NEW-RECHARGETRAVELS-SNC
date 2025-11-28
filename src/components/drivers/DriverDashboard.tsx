
import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { collection, doc, getDoc, getDocs, query, where, orderBy } from 'firebase/firestore'
import { db, auth } from '@/lib/firebase'
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
      if (!auth.currentUser?.uid) return
      
      const driverRef = doc(db, 'drivers', auth.currentUser.uid)
      const driverSnap = await getDoc(driverRef)
      
      if (driverSnap.exists()) {
        setDriverData({ id: driverSnap.id, ...driverSnap.data() })
      }
    } catch (error) {
      console.error('Error fetching driver data:', error)
    }
  }

  const fetchBookings = async () => {
    try {
      if (!auth.currentUser?.uid) {
        setLoading(false)
        return
      }

      // Get driver document
      const driverRef = doc(db, 'drivers', auth.currentUser.uid)
      const driverSnap = await getDoc(driverRef)

      if (!driverSnap.exists()) {
        setLoading(false)
        return
      }

      const driverRecord = { id: driverSnap.id, ...driverSnap.data() } as any

      // Get driver bookings
      const bookingsQuery = query(
        collection(db, 'driver_bookings'),
        where('driver_id', '==', auth.currentUser.uid),
        orderBy('created_at', 'desc')
      )
      const bookingsSnap = await getDocs(bookingsQuery)
      
      const bookingsData = bookingsSnap.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as DriverBooking[]

      setBookings(bookingsData)
      
      // Calculate stats
      const total = bookingsData.length
      const completed = bookingsData.filter(b => b.booking_status === 'completed').length
      const pending = bookingsData.filter(b => b.booking_status === 'pending').length
      const earnings = bookingsData.reduce((sum, b) => sum + (b.final_price || 0), 0)

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
