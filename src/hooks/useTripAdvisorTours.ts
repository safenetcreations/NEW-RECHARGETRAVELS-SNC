import { useEffect, useState } from 'react'
import { collection, getDocs } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { RECHARGE_TRIPADVISOR_URL, tripAdvisorTours, type TripAdvisorTour } from '@/data/tripAdvisorTours'

const COLLECTION_NAME = 'tours_tripadvisor'

export const useTripAdvisorTours = () => {
  const [tours, setTours] = useState<TripAdvisorTour[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const fetchTours = async () => {
      if (!db) {
        // If Firebase is not initialized, fall back to static data
        setTours(tripAdvisorTours)
        return
      }

      setIsLoading(true)
      setError(null)
      try {
        const snapshot = await getDocs(collection(db, COLLECTION_NAME))
        const fetched: TripAdvisorTour[] = snapshot.docs.map((doc) => {
          const data = doc.data()
          return {
            id: doc.id,
            title: data.title ?? '',
            priceUsd: Number(data.priceUsd ?? data.price ?? 0),
            rating: Number(data.rating ?? 0),
            reviews: Number(data.reviews ?? 0),
            region: data.region ?? 'central',
            location: data.location ?? '',
            duration: data.duration ?? '',
            description: data.description ?? '',
            image: data.image ?? '',
            tripAdvisorUrl: data.tripAdvisorUrl ?? '',
            badge: data.badge,
            operator: data.operator ?? 'Recharge Travels & Tours',
            operatorProfileUrl: data.operatorProfileUrl ?? RECHARGE_TRIPADVISOR_URL
          }
        })

        // Only keep Recharge-operated tours; fallback to static data if nothing fetched
        const filtered = fetched.filter(
          (tour) => (tour.operatorProfileUrl ?? RECHARGE_TRIPADVISOR_URL) === RECHARGE_TRIPADVISOR_URL
        )

        if (filtered.length > 0) {
          setTours(filtered)
        } else if (fetched.length > 0) {
          setTours(fetched)
        } else {
          setTours(tripAdvisorTours)
        }
      } catch (err: any) {
        console.error('Failed to load TripAdvisor tours:', err)
        setError(err)
        setTours(tripAdvisorTours)
      } finally {
        setIsLoading(false)
      }
    }

    fetchTours()
  }, [])

  return { tours, isLoading, error }
}
