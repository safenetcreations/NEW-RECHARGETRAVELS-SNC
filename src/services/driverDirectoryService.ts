import {
  collection,
  doc,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  where
} from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { Driver } from '@/types/driver'

const DRIVER_COLLECTION = 'drivers'
const DRIVER_REVIEWS_COLLECTION = 'driver_reviews'
const DRIVER_AVAILABILITY_COLLECTION = 'driver_availability'

export async function fetchDrivers(filters?: {
  tier?: string
  minRating?: number
  language?: string
}) {
  const baseRef = collection(db, DRIVER_COLLECTION)
  const constraints = []

  if (filters?.tier) constraints.push(where('tier', '==', filters.tier))
  if (filters?.minRating) constraints.push(where('average_rating', '>=', filters.minRating))
  if (constraints.length > 0) {
    const snap = await getDocs(query(baseRef, ...constraints, limit(50)))
    return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Driver))
  }

  const snap = await getDocs(query(baseRef, orderBy('average_rating', 'desc'), limit(50)))
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Driver))
}

export async function fetchDriverById(id: string) {
  const ref = doc(db, DRIVER_COLLECTION, id)
  const snap = await getDoc(ref)
  if (!snap.exists()) return null
  return { id: snap.id, ...snap.data() } as Driver
}

export async function fetchDriverReviews(driverId: string, max = 6) {
  const snap = await getDocs(
    query(collection(db, DRIVER_REVIEWS_COLLECTION), where('driver_id', '==', driverId), orderBy('review_date', 'desc'), limit(max))
  )
  return snap.docs.map((d) => d.data())
}

export async function fetchAvailabilityPreview(driverId: string, days = 7) {
  const today = new Date()
  const dates: string[] = []
  for (let i = 0; i < days; i++) {
    const d = new Date(today)
    d.setDate(today.getDate() + i)
    dates.push(d.toISOString().split('T')[0])
  }

  const snap = await getDocs(
    query(
      collection(db, DRIVER_AVAILABILITY_COLLECTION),
      where('driver_id', '==', driverId),
      where('date', 'in', dates)
    )
  )

  return snap.docs.map((d) => d.data())
}
