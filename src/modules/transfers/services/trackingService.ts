import type { TrackingData, Location, Notification } from '../types'
import { authService, dbService } from '@/lib/firebase-services'

const toDate = (value: any): Date => {
  if (!value) return new Date(0)
  if (value instanceof Date) return value
  if (typeof value === 'string') return new Date(value)
  if (value?.toDate) return value.toDate()
  return new Date(0)
}

const normalizeTrackingRecord = (record: any): TrackingData => ({
  id: record.id,
  bookingId: record.booking_id ?? record.bookingId ?? '',
  driverId: record.driver_id ?? record.driverId ?? '',
  latitude: Number(record.latitude ?? 0),
  longitude: Number(record.longitude ?? 0),
  heading: record.heading !== undefined ? Number(record.heading) : undefined,
  speed: record.speed_kmh !== undefined ? Number(record.speed_kmh) : undefined,
  accuracy: record.accuracy ? Number(record.accuracy) : 10,
  timestamp: toDate(record.created_at ?? record.createdAt)
})

export const trackingService = {
  async updateDriverLocation(
    bookingId: string,
    driverId: string,
    location: { latitude: number; longitude: number; heading?: number; speed?: number }
  ): Promise<void> {
    await dbService.create('driver_locations', {
      booking_id: bookingId,
      driver_id: driverId,
      latitude: location.latitude,
      longitude: location.longitude,
      heading: location.heading,
      speed_kmh: location.speed
    })
  },

  async getTrackingHistory(bookingId: string): Promise<TrackingData[]> {
    const records = await dbService.list('driver_locations', [
      { field: 'booking_id', operator: '==', value: bookingId }
    ])

    return (records as any[])
      .map(normalizeTrackingRecord)
      .sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime())
  },

  async getLatestDriverLocation(bookingId: string): Promise<TrackingData | null> {
    const history = await this.getTrackingHistory(bookingId)
    if (history.length === 0) return null
    return history[history.length - 1]
  },

  subscribeToDriverLocation(
    bookingId: string,
    callback: (location: TrackingData) => void
  ): () => void {
    const unsubscribe = dbService.subscribe(
      'driver_locations',
      (records) => {
        const sorted = (records as any[])
          .filter((record) => record.booking_id === bookingId)
          .map(normalizeTrackingRecord)
          .sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime())

        const latest = sorted[sorted.length - 1]
        if (latest) {
          callback(latest)
        }
      },
      [{ field: 'booking_id', operator: '==', value: bookingId }]
    )

    return unsubscribe
  },

  subscribeToTracking(
    bookingId: string,
    onUpdate: (data: TrackingData) => void,
    _onError: (error: Error) => void
  ): () => void {
    return this.subscribeToDriverLocation(bookingId, onUpdate)
  },

  async updateLocation(
    bookingId: string,
    location: Omit<TrackingData, 'id' | 'bookingId' | 'driverId' | 'timestamp'>
  ): Promise<void> {
    const user = authService.getCurrentUser()
    if (!user?.uid) {
      throw new Error('User not authenticated')
    }

    await this.updateDriverLocation(bookingId, user.uid, {
      latitude: location.latitude,
      longitude: location.longitude,
      heading: location.heading,
      speed: location.speed
    })
  },

  async searchLocations(query: string): Promise<Location[]> {
    if (!query) {
      return []
    }

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5`
      )

      if (!response.ok) {
        throw new Error(`Location search failed: ${response.statusText}`)
      }

      const results = (await response.json()) as Array<{ lat: string; lon: string; display_name: string }>

      return results.map((result) => ({
        lat: Number(result.lat),
        lng: Number(result.lon),
        address: result.display_name,
        name: result.display_name
      }))
    } catch (error) {
      console.error('Location search service error:', error)
      return []
    }
  },

  subscribeToNotifications(
    bookingId: string,
    callback: (notification: Notification) => void
  ): () => void {
    console.log('Notifications subscription not implemented for booking:', bookingId)
    return () => {}
  }
}
