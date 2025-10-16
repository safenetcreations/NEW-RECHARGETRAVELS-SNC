import { useCallback, useEffect, useState } from 'react'
import { dbService } from '@/lib/firebase-services'
import {
  LuxuryLevel,
  TourAccommodation,
  TourCategory,
  TourInclusion,
  TourItinerary,
  TourPackage,
  TourPackageWithDetails,
  TourPricing
} from '@/types/tour-package'

interface TourPackageFilters {
  category?: string
  luxury_level?: string
  min_price?: number
  max_price?: number
  search?: string
}

const toDate = (value: any): Date => {
  if (!value) return new Date(0)
  if (typeof value === 'string') return new Date(value)
  if (value?.toDate) return value.toDate()
  return new Date(0)
}

const normalizePackage = (record: any): TourPackage => ({
  id: record.id,
  name: record.name ?? 'Untitled Package',
  category: (record.category ?? 'wildlife') as TourCategory,
  duration_days: Number(record.duration_days ?? 0),
  luxury_level: (record.luxury_level ?? 'luxury') as LuxuryLevel,
  base_price: Number(record.base_price ?? 0),
  description: record.description ?? '',
  highlights: record.highlights ?? [],
  is_active: record.is_active ?? false,
  created_at: record.created_at ?? record.createdAt ?? new Date().toISOString(),
  updated_at: record.updated_at ?? record.updatedAt ?? new Date().toISOString()
})

export const useTourPackages = (filters: TourPackageFilters = {}) => {
  const [tourPackages, setTourPackages] = useState<TourPackage[]>([])
  const [selectedPackage, setSelectedPackage] = useState<TourPackageWithDetails | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const applyFilters = useCallback(
    (packages: TourPackage[]): TourPackage[] => {
      return packages
        .filter((pkg) => {
          if (filters.category && filters.category !== 'all' && pkg.category !== filters.category) {
            return false
          }
          if (
            filters.luxury_level &&
            filters.luxury_level !== 'all' &&
            pkg.luxury_level !== filters.luxury_level
          ) {
            return false
          }
          if (filters.min_price !== undefined && pkg.base_price < filters.min_price) {
            return false
          }
          if (filters.max_price !== undefined && pkg.base_price > filters.max_price) {
            return false
          }
          if (filters.search) {
            const haystack = `${pkg.name} ${pkg.description ?? ''}`.toLowerCase()
            if (!haystack.includes(filters.search.toLowerCase())) {
              return false
            }
          }
          return true
        })
        .sort((a, b) => toDate(b.created_at).getTime() - toDate(a.created_at).getTime())
    },
    [filters]
  )

  const fetchTourPackages = useCallback(async () => {
    setIsLoading(true)
    setError(null)

    try {
      const records = await dbService.list('tour_packages')
      const normalized = (records as any[]).map(normalizePackage)
      setTourPackages(applyFilters(normalized))
    } catch (err) {
      console.error('Error fetching tour packages:', err)
      setError(err instanceof Error ? err.message : 'Failed to fetch tour packages')
    } finally {
      setIsLoading(false)
    }
  }, [applyFilters])

  const fetchTourPackageDetails = useCallback(async (id: string) => {
    setIsLoading(true)
    setError(null)

    try {
      const pkg = await dbService.get('tour_packages', id)
      if (!pkg) {
        setSelectedPackage(null)
        return
      }

      const [itineraryRaw, inclusionsRaw, accommodationsRaw, pricingRaw] = await Promise.all([
        dbService.list('tour_itinerary', [{ field: 'tour_package_id', operator: '==', value: id }]),
        dbService.list('tour_inclusions', [{ field: 'tour_package_id', operator: '==', value: id }]),
        dbService.list('tour_accommodations', [{ field: 'tour_package_id', operator: '==', value: id }]),
        dbService.list('tour_pricing', [{ field: 'tour_package_id', operator: '==', value: id }])
      ])

      const packageWithDetails: TourPackageWithDetails = {
        ...normalizePackage(pkg),
        itinerary: itineraryRaw as TourItinerary[],
        inclusions: (inclusionsRaw as TourInclusion[]).map((inclusion) => ({
          ...inclusion,
          inclusion_type: inclusion.inclusion_type as TourInclusion['inclusion_type']
        })),
        accommodations: (accommodationsRaw as TourAccommodation[]).map((accommodation) => ({
          ...accommodation,
          luxury_level: accommodation.luxury_level as LuxuryLevel
        })),
        pricing: (pricingRaw as TourPricing[]).map((pricing) => ({
          ...pricing,
          luxury_level: pricing.luxury_level as LuxuryLevel
        }))
      }

      setSelectedPackage(packageWithDetails)
    } catch (err) {
      console.error('Error fetching tour package details:', err)
      setError(err instanceof Error ? err.message : 'Failed to fetch tour package details')
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    void fetchTourPackages()
  }, [fetchTourPackages])

  return {
    tourPackages,
    selectedPackage,
    isLoading,
    error,
    fetchTourPackages,
    fetchTourPackageDetails,
    refetch: fetchTourPackages
  }
}
