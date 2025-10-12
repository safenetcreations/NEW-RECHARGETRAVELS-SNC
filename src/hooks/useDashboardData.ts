
import { useState, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { dbService, authService, storageService } from '@/lib/firebase-services'
import { toast } from 'sonner'

export const useDashboardData = () => {
  const [totalHotels, setTotalHotels] = useState(0)
  const [activeHotels, setActiveHotels] = useState(0)
  const [totalUsers, setTotalUsers] = useState(0)
  const [totalBookings, setTotalBookings] = useState(0)
  const [totalRevenue, setTotalRevenue] = useState(0)
  const [recentBookings, setRecentBookings] = useState<any[]>([])

  const { data: hotelsData, isLoading: hotelsLoading, error: hotelsError } = useQuery({
    queryKey: ['adminHotels'],
    queryFn: async () => {
      const { data, error } = await dbService.list('hotels'('*')
      if (error) {
        toast.error(`Error fetching hotels: ${error.message}`)
        throw error
      }
      return data
    }
  })

  const { data: usersData, isLoading: usersLoading, error: usersError } = useQuery({
    queryKey: ['adminUsers'],
    queryFn: async () => {
      const { data, error } = await dbService.list('user_profiles'('*')
      if (error) {
        toast.error(`Error fetching users: ${error.message}`)
        throw error
      }
      return data
    }
  })

  const { data: bookingsData, isLoading: bookingsLoading, error: bookingsError } = useQuery({
    queryKey: ['adminBookings'],
    queryFn: async () => {
      const { data, error } = await dbService.list('bookings'('*')
      if (error) {
        toast.error(`Error fetching bookings: ${error.message}`)
        throw error
      }
      return data
    }
  })

  useEffect(() => {
    if (hotelsData) {
      setTotalHotels(hotelsData.length)
      setActiveHotels(hotelsData.filter((hotel) => hotel.is_active).length)
    }
    if (usersData) {
      setTotalUsers(usersData.length)
    }
    if (bookingsData) {
      setTotalBookings(bookingsData.length)
      // Calculate total revenue (simplified, assuming each booking is $100 for example)
      setTotalRevenue(bookingsData.length * 100)

      // Get recent bookings (last 5)
      const sortedBookings = [...bookingsData].sort((a, b) => {
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      })
      setRecentBookings(sortedBookings.slice(0, 5))
    }
  }, [hotelsData, usersData, bookingsData])

  return {
    totalHotels,
    activeHotels,
    totalUsers,
    totalBookings,
    totalRevenue,
    recentBookings,
    isLoading: hotelsLoading || usersLoading || bookingsLoading
  }
}
