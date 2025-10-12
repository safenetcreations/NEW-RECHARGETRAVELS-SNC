
import { useState, useEffect, useCallback } from 'react';
import { dbService, authService, storageService } from '@/lib/firebase-services';
import { TourPackage, TourPackageWithDetails, TourCategory, LuxuryLevel } from '@/types/tour-package';

interface TourPackageFilters {
  category?: string;
  luxury_level?: string;
  min_price?: number;
  max_price?: number;
  search?: string;
}

export const useTourPackages = (filters: TourPackageFilters = {}) => {
  const [tourPackages, setTourPackages] = useState<TourPackage[]>([]);
  const [selectedPackage, setSelectedPackage] = useState<TourPackageWithDetails | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTourPackages = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      let query = supabase
        .from('tour_packages')
        .select('*')
        .eq('is_active', true);

      // Apply filters
      if (filters.category && filters.category !== 'all') {
        query = query.eq('category', filters.category);
      }
      
      if (filters.luxury_level && filters.luxury_level !== 'all') {
        query = query.eq('luxury_level', filters.luxury_level);
      }
      
      if (filters.min_price !== undefined) {
        query = query.gte('base_price', filters.min_price);
      }
      
      if (filters.max_price !== undefined) {
        query = query.lte('base_price', filters.max_price);
      }
      
      if (filters.search) {
        query = query.or(`name.ilike.%${filters.search}%,description.ilike.%${filters.search}%`);
      }

      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      // Cast the data to proper types
      const typedData: TourPackage[] = (data || []).map(item => ({
        ...item,
        category: item.category as TourCategory,
        luxury_level: item.luxury_level as LuxuryLevel
      }));

      setTourPackages(typedData);
    } catch (err) {
      console.error('Error fetching tour packages:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch tour packages');
    } finally {
      setIsLoading(false);
    }
  }, [filters]);

  const fetchTourPackageDetails = useCallback(async (id: string) => {
    setIsLoading(true);
    setError(null);

    try {
      // Fetch main package data
      const { data: packageData, error: packageError } = await supabase
        .from('tour_packages')
        .select('*')
        .eq('id', id)
        .single();

      if (packageError) throw packageError;

      // Fetch related data
      const [itineraryRes, inclusionsRes, accommodationsRes, pricingRes] = await Promise.all([
        dbService.list('tour_itinerary'('*').eq('tour_package_id', id),
        dbService.list('tour_inclusions'('*').eq('tour_package_id', id),
        dbService.list('tour_accommodations'('*').eq('tour_package_id', id),
        dbService.list('tour_pricing'('*').eq('tour_package_id', id)
      ]);

      const packageWithDetails: TourPackageWithDetails = {
        ...packageData,
        category: packageData.category as TourCategory,
        luxury_level: packageData.luxury_level as LuxuryLevel,
        itinerary: itineraryRes.data || [],
        inclusions: (inclusionsRes.data || []).map(inclusion => ({
          ...inclusion,
          inclusion_type: inclusion.inclusion_type as any
        })),
        accommodations: (accommodationsRes.data || []).map(accommodation => ({
          ...accommodation,
          luxury_level: accommodation.luxury_level as LuxuryLevel
        })),
        pricing: (pricingRes.data || []).map(pricing => ({
          ...pricing,
          luxury_level: pricing.luxury_level as LuxuryLevel
        }))
      };

      setSelectedPackage(packageWithDetails);
    } catch (err) {
      console.error('Error fetching tour package details:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch tour package details');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTourPackages();
  }, [fetchTourPackages]);

  return {
    tourPackages,
    selectedPackage,
    isLoading,
    error,
    fetchTourPackages,
    fetchTourPackageDetails,
    refetch: fetchTourPackages
  };
};
