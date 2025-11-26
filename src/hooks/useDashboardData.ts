import { useEffect, useState } from 'react'
import { dbService } from '@/lib/firebase-services'

type WithCreatedAt<T> = T & {
  created_at?: string
  createdAt?: any
}

const toDate = (value: any): Date | null => {
  if (!value) return null
  if (typeof value === 'string') return new Date(value)
  if (value?.toDate) return value.toDate()
  return null
}

export const useDashboardData = () => {
  const [totalHotels, setTotalHotels] = useState(0)
  const [activeHotels, setActiveHotels] = useState(0)
  const [totalUsers, setTotalUsers] = useState(0)
  const [totalBookings, setTotalBookings] = useState(0)
  const [totalRevenue, setTotalRevenue] = useState(0)
  const [recentBookings, setRecentBookings] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      try {
        setIsLoading(true)

        const [hotels, users, bookings] = await Promise.all([
          dbService.list('hotels'),
          dbService.list('user_profiles'),
          dbService.list('bookings')
        ])

        const hotelsList = (hotels as Array<{ is_active?: boolean }>) ?? []
        const usersList = (users as unknown[]) ?? []
        const bookingsList =
          (bookings as Array<WithCreatedAt<{ total_price?: number }>>) ?? []

        setTotalHotels(hotelsList.length)
        setActiveHotels(hotelsList.filter((hotel) => hotel.is_active).length)
        setTotalUsers(usersList.length)
        setTotalBookings(bookingsList.length)

        const total = bookingsList.reduce((sum, booking) => {
          const price = Number(booking.total_price ?? 0)
          return sum + (Number.isFinite(price) ? price : 0)
        }, 0)
        setTotalRevenue(total)

        const sorted = [...bookingsList].sort((a, b) => {
          const dateA = toDate(a.created_at ?? a.createdAt) ?? new Date(0)
          const dateB = toDate(b.created_at ?? b.createdAt) ?? new Date(0)
          return dateB.getTime() - dateA.getTime()
        })

        setRecentBookings(sorted.slice(0, 5))
      } catch (error) {
        console.error('Error loading dashboard data:', error)
      } finally {
        setIsLoading(false)
      }
    }

    void load()
  }, [])

  return {
    totalHotels,
    activeHotels,
    totalUsers,
    totalBookings,
    totalRevenue,
    recentBookings,
    isLoading
  }
}
