import React, { useEffect, useMemo, useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { collection, getDocs, query, where, doc, getDoc, updateDoc } from 'firebase/firestore'
import { auth, db } from '@/lib/firebase'
import { Driver, DocumentType, PhotoType, DriverTier } from '@/types/driver'
import type { DriverBooking } from '@/types/driver-booking'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Calendar, CheckCircle2, CheckSquare, MapPin, Star, Wallet, XCircle } from 'lucide-react'
import { recommendPricing, forecastAvailability } from '@/services/aiPricingService'
import { createOrUpdateDriverProfile } from '@/services/driverOnboardingService'

const roleDocs: Record<DriverTier, DocumentType[]> = {
  chauffeur_guide: ['slt_da_license', 'driving_license', 'national_id', 'police_clearance', 'medical_report', 'vehicle_revenue_license', 'vehicle_insurance'],
  national_guide: ['slt_da_license', 'driving_license', 'national_id', 'police_clearance', 'medical_report'],
  tourist_driver: ['driving_license', 'national_id', 'police_clearance', 'vehicle_revenue_license', 'vehicle_insurance'],
  freelance_driver: ['driving_license', 'national_id', 'vehicle_revenue_license', 'vehicle_insurance']
}

const prettyDoc: Record<string, string> = {
  national_id: 'National ID',
  driving_license: 'Driving License',
  slt_da_license: 'SLTDA Guide/Driver License',
  police_clearance: 'Police Clearance',
  medical_report: 'Medical Report',
  grama_niladari_certificate: 'Grama Niladhari Certificate',
  vehicle_revenue_license: 'Vehicle Revenue License',
  vehicle_insurance: 'Vehicle Insurance',
  vehicle_registration: 'Vehicle Registration',
  vehicle_permit: 'Vehicle Permit'
}

type DriverBookingWithId = DriverBooking & { id: string }

interface BookingStats {
  totalBookings: number
  completedBookings: number
  totalEarnings: number
}

const getTripAmount = (b: DriverBookingWithId) =>
  b.final_price ?? b.quoted_price ?? 0

const DriverDashboard: React.FC = () => {
  const [driver, setDriver] = useState<Driver | null>(null)
  const [docs, setDocs] = useState<any[]>([])
  const [photos, setPhotos] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [bookings, setBookings] = useState<DriverBookingWithId[]>([])
  const [upcomingTrips, setUpcomingTrips] = useState<DriverBookingWithId[]>([])
  const [stats, setStats] = useState<BookingStats>({
    totalBookings: 0,
    completedBookings: 0,
    totalEarnings: 0
  })
  const [updatingBookingId, setUpdatingBookingId] = useState<string | null>(null)

  useEffect(() => {
    const load = async () => {
      const userId = auth?.currentUser?.uid
      if (!userId) {
        setLoading(false)
        return
      }
      const driverRef = doc(db, 'drivers', userId)
      const snap = await getDoc(driverRef)
      if (snap.exists()) {
        setDriver({ id: snap.id, ...(snap.data() as any) })
      }
      const [docsSnap, photosSnap, bookingsSnap] = await Promise.all([
        getDocs(query(collection(db, 'driver_documents'), where('driver_id', '==', userId))),
        getDocs(query(collection(db, 'driver_photos'), where('driver_id', '==', userId))),
        getDocs(query(collection(db, 'driver_bookings'), where('driver_id', '==', userId)))
      ])

      setDocs(docsSnap.docs.map((d) => ({ id: d.id, ...d.data() })))
      setPhotos(photosSnap.docs.map((d) => ({ id: d.id, ...d.data() })))

      const allBookings = bookingsSnap.docs.map(
        (b) => ({ id: b.id, ...(b.data() as any) }) as DriverBookingWithId
      )
      setBookings(allBookings)

      if (allBookings.length > 0) {
        const completed = allBookings.filter((b) => b.booking_status === 'completed')
        const totalEarnings = completed.reduce(
          (sum, b) => sum + getTripAmount(b),
          0
        )
        setStats({
          totalBookings: allBookings.length,
          completedBookings: completed.length,
          totalEarnings
        })

        const todayStr = new Date().toISOString().split('T')[0]
        const upcoming = allBookings
          .filter(
            (b) =>
              ['pending', 'confirmed', 'in_progress'].includes(b.booking_status) &&
              b.pickup_date &&
              b.pickup_date >= todayStr
          )
          .sort((a, b) => a.pickup_date.localeCompare(b.pickup_date))
          .slice(0, 5)
        setUpcomingTrips(upcoming)
      } else {
        setStats({ totalBookings: 0, completedBookings: 0, totalEarnings: 0 })
        setUpcomingTrips([])
      }
      setLoading(false)
    }
    load()
  }, [])

  const handleBookingAction = async (
    bookingId: string,
    newStatus: DriverBooking['booking_status']
  ) => {
    setUpdatingBookingId(bookingId)
    try {
      const bookingRef = doc(db, 'driver_bookings', bookingId)
      await updateDoc(bookingRef, {
        booking_status: newStatus,
        updated_at: new Date().toISOString()
      })

      setBookings((prev) => {
        const updated = prev.map((b) =>
          b.id === bookingId ? { ...b, booking_status: newStatus } : b
        )

        const completed = updated.filter((b) => b.booking_status === 'completed')
        const totalEarnings = completed.reduce(
          (sum, b) => sum + getTripAmount(b),
          0
        )
        setStats({
          totalBookings: updated.length,
          completedBookings: completed.length,
          totalEarnings
        })

        const todayStr = new Date().toISOString().split('T')[0]
        const upcoming = updated
          .filter(
            (b) =>
              ['pending', 'confirmed', 'in_progress'].includes(b.booking_status) &&
              b.pickup_date &&
              b.pickup_date >= todayStr
          )
          .sort((a, b) => a.pickup_date.localeCompare(b.pickup_date))
          .slice(0, 5)
        setUpcomingTrips(upcoming)

        return updated
      })
    } catch (error) {
      console.error('Error updating booking status:', error)
    } finally {
      setUpdatingBookingId(null)
    }
  }

  const missingDocs = useMemo(() => {
    if (!driver) return []
    const required = roleDocs[driver.tier] || []
    const uploadedTypes = docs.map((d) => d.document_type)
    return required.filter((r) => !uploadedTypes.includes(r))
  }, [driver, docs])

  const recommended = driver ? recommendPricing(driver, { season: 'peak' }) : null
  const availabilityTip = forecastAvailability({ days: 14 })

  if (!auth?.currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-700">Please sign in to view your driver dashboard.</p>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-orange-500" />
      </div>
    )
  }

  if (!driver) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-700">No driver profile found. Please complete onboarding.</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-cyan-50">
      <Helmet>
        <title>Driver Dashboard | Recharge Travels</title>
      </Helmet>

      <div className="max-w-5xl mx-auto px-4 py-10 space-y-6">
        <div className="bg-white shadow-lg rounded-2xl p-6 border border-orange-100 flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">Welcome back</p>
            <h1 className="text-2xl font-bold text-gray-900">{driver.full_name || 'Driver'}</h1>
            <div className="flex gap-2 mt-2 text-xs">
              <Badge variant="outline">{driver.tier?.replace(/_/g, ' ')}</Badge>
              <Badge variant="secondary">Status: {driver.current_status}</Badge>
              <Badge variant="outline">Level {driver.verified_level || 1}</Badge>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-600">Completion rate</p>
            <p className="text-xl font-semibold text-orange-600">{driver.completion_rate ? `${Math.round(driver.completion_rate)}%` : '—'}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Documents</h3>
            <ul className="space-y-2 text-sm text-gray-700">
              {docs.map((d) => (
                <li key={d.id} className="flex items-center justify-between">
                  <span>{prettyDoc[d.document_type] || d.document_type}</span>
                  <Badge variant={d.verification_status === 'approved' ? 'secondary' : 'outline'}>
                    {d.verification_status}
                  </Badge>
                </li>
              ))}
              {missingDocs.length > 0 && (
                <li className="text-xs text-red-600">Missing: {missingDocs.map((m) => prettyDoc[m] || m).join(', ')}</li>
              )}
            </ul>
          </div>

          <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Photos</h3>
            <div className="grid grid-cols-2 gap-3">
              {photos.slice(0, 4).map((p) => (
                <div key={p.id} className="text-xs text-gray-700">
                  <img src={p.file_path} alt={p.photo_type} className="w-full h-24 object-cover rounded-lg border" />
                  <p className="mt-1 capitalize">{p.photo_type?.replace(/_/g, ' ')}</p>
                  <Badge variant={p.verification_status === 'approved' ? 'secondary' : 'outline'}>{p.verification_status}</Badge>
                </div>
              ))}
              {photos.length === 0 && <p className="text-sm text-gray-600">No photos uploaded yet.</p>}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm space-y-2">
            <h3 className="text-lg font-semibold text-gray-900 mb-2 flex items-center gap-2">
              <Wallet className="w-4 h-4 text-orange-500" />
              Trip Stats
            </h3>
            <div className="text-sm text-gray-700 space-y-1">
              <div className="flex items-center justify-between">
                <span>Total bookings</span>
                <span className="font-semibold">{stats.totalBookings}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Completed trips</span>
                <span className="font-semibold">{stats.completedBookings}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Total earnings</span>
                <span className="font-semibold">
                  {stats.totalEarnings > 0 ? `LKR ${stats.totalEarnings.toFixed(0)}` : '–'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span>Upcoming earnings (next {upcomingTrips.length} trips)</span>
                <span className="font-semibold">
                  {upcomingTrips.length > 0
                    ? `LKR ${upcomingTrips
                        .reduce((sum, b) => sum + getTripAmount(b), 0)
                        .toFixed(0)}`
                    : '–'}
                </span>
              </div>
            </div>
          </div>

// ...

          <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm space-y-2">
            <h3 className="text-lg font-semibold text-gray-900 mb-2 flex items-center gap-2">
              <Star className="w-4 h-4 text-yellow-500" />
              Rating & Availability
            </h3>
            <div className="text-sm text-gray-700 space-y-2">
              <div className="flex items-center justify-between">
                <span>Average rating</span>
                <span className="font-semibold">
                  {driver.average_rating ? `${driver.average_rating.toFixed(1)} ★` : 'Not rated yet'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span>Total reviews</span>
                <span className="font-semibold">{driver.total_reviews ?? 0}</span>
              </div>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              <Button asChild size="sm" variant="outline">
                <a href="/join-with-us">Update availability</a>
              </Button>
              <Button asChild size="sm" variant="outline">
                <a href="/wallet">View wallet</a>
              </Button>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-2 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-orange-500" />
              Upcoming Trips
            </h3>
            <div className="space-y-2 text-sm text-gray-700">
              {upcomingTrips.length === 0 && (
                <p className="text-sm text-gray-500">
                  No upcoming trips yet. Confirmed and in-progress bookings will show here.
                </p>
              )}

              {upcomingTrips.map((trip) => (
                <div
                  key={trip.id}
                  className="border border-gray-100 rounded-lg p-2 space-y-1"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-semibold text-gray-900">
                      {trip.pickup_date} · {trip.pickup_time}
                    </span>
                    <Badge variant="outline">
                      {trip.booking_status.replace('_', ' ')}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-gray-600">
                    <MapPin className="w-3 h-3 text-orange-500" />
                    <span className="truncate">
                      {trip.pickup_location}
                      {trip.dropoff_location ? ` → ${trip.dropoff_location}` : ''}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-gray-600 mt-1">
                    <span>
                      {trip.service_type === 'guided_tour'
                        ? 'Guided tour'
                        : trip.service_type === 'custom_package'
                        ? 'Custom package'
                        : 'Transport only'}
                      {' '}
                      {trip.passenger_count} pax
                    </span>
                    {getTripAmount(trip) > 0 && (
                      <span className="font-semibold text-orange-600">
                        Est. earnings LKR {getTripAmount(trip).toFixed(0)}
                      </span>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {trip.booking_status === 'pending' && (
                      <>
                        <Button
                          size="sm"
                          className="h-7 px-2 text-xs"
                          onClick={() => handleBookingAction(trip.id, 'confirmed')}
                          disabled={updatingBookingId === trip.id}
                        >
                          <CheckCircle2 className="w-3 h-3 mr-1" />
                          Accept
                        </Button>
                        <Button
                          size="sm"
                          className="h-7 px-2 text-xs"
                          variant="outline"
                          onClick={() => handleBookingAction(trip.id, 'cancelled')}
                          disabled={updatingBookingId === trip.id}
                        >
                          <XCircle className="w-3 h-3 mr-1" />
                          Reject
                        </Button>
                      </>
                    )}
                    {trip.booking_status === 'confirmed' && (
                      <>
                        <Button
                          size="sm"
                          className="h-7 px-2 text-xs"
                          onClick={() => handleBookingAction(trip.id, 'in_progress')}
                          disabled={updatingBookingId === trip.id}
                        >
                          <CheckCircle2 className="w-3 h-3 mr-1" />
                          In progress
                        </Button>
                        <Button
                          size="sm"
                          className="h-7 px-2 text-xs"
                          variant="outline"
                          onClick={() => handleBookingAction(trip.id, 'cancelled')}
                          disabled={updatingBookingId === trip.id}
                        >
                          <XCircle className="w-3 h-3 mr-1" />
                          Cancel
                        </Button>
                      </>
                    )}
                    {trip.booking_status === 'in_progress' && (
                      <Button
                        size="sm"
                        className="h-7 px-2 text-xs"
                        onClick={() => handleBookingAction(trip.id, 'completed')}
                        disabled={updatingBookingId === trip.id}
                      >
                        <CheckSquare className="w-3 h-3 mr-1" />
                        Mark done
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Recommended Pricing (AI)</h3>
          {recommended ? (
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-700">Hourly: LKR {recommended.hourly}</p>
                <p className="text-sm text-gray-700">Daily: LKR {recommended.daily}</p>
                {recommended.guideFee ? <p className="text-sm text-gray-700">Guide Fee: LKR {recommended.guideFee}</p> : null}
                <p className="text-xs text-gray-500 mt-1">Based on tier, season, rating.</p>
              </div>
              <Button
                size="sm"
                onClick={async () => {
                  await createOrUpdateDriverProfile(driver.id as string, {
                    hourly_rate: recommended.hourly,
                    daily_rate: recommended.daily
                  } as any)
                  setDriver({ ...driver, hourly_rate: recommended.hourly, daily_rate: recommended.daily })
                }}
              >
                Apply
              </Button>
            </div>
          ) : <p className="text-sm text-gray-600">No recommendation yet.</p>}
        </div>

        <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Availability Suggestion</h3>
          <p className="text-sm text-gray-700">{availabilityTip.message}</p>
          <div className="flex flex-wrap gap-2 mt-2">
            {availabilityTip.suggestedDates.map((d) => (
              <Badge key={d} variant="outline">{d}</Badge>
            ))}
          </div>
          <p className="text-xs text-gray-500 mt-1">Open these dates in your calendar for better matching.</p>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Profile Preview</h3>
          <p className="text-sm text-gray-600">Public profile at /drivers/{driver.id}</p>
          <div className="flex gap-3 mt-3">
            <Button asChild variant="outline">
              <a href={`/drivers/${driver.id}`} target="_blank" rel="noreferrer">View Public Profile</a>
            </Button>
            <Button asChild>
              <a href="/join-with-us">Update Documents</a>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DriverDashboard
