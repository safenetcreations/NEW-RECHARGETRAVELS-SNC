
import { useState, useEffect } from 'react';
import { dbService, authService, storageService } from '@/lib/firebase-services';
import { toast } from 'sonner';

export interface RamayanaSite {
  id: string;
  name: string;
  slug: string;
  location: string;
  significance: string;
  mythology_story: string;
  ritual_highlights?: string;
  puja_timings?: string;
  latitude?: number;
  longitude?: number;
  hero_image_url?: string;
  gallery_images?: string[];
  best_visit_times?: string;
  special_requirements?: string;
  is_featured: boolean;
  order_index: number;
}

export interface RamayanaPackage {
  id: string;
  name: string;
  slug: string;
  tier: 'vip' | 'standard';
  operator: string;
  duration_days: number;
  price_per_person: number;
  currency: string;
  description?: string;
  inclusions?: string[];
  exclusions?: string[];
  accommodation_type?: string;
  transport_type?: string;
  guide_languages?: string[];
  max_participants: number;
  min_participants: number;
  sites_covered?: number[];
  special_features?: string[];
  is_featured: boolean;
}

export interface RamayanaBooking {
  id: string;
  package_id: string;
  user_name: string;
  user_email: string;
  phone_number?: string;
  number_of_pilgrims: number;
  preferred_start_date: string;
  guide_language: string;
  special_requests?: string;
  puja_preferences?: string;
  total_amount: number;
  currency: string;
  booking_status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  payment_status: 'pending' | 'paid' | 'refunded';
}

// Helper function to safely convert Json to string array
const jsonToStringArray = (jsonData: any): string[] => {
  if (Array.isArray(jsonData)) {
    return jsonData.filter(item => typeof item === 'string');
  }
  return [];
};

// Helper function to safely convert Json to number array
const jsonToNumberArray = (jsonData: any): number[] => {
  if (Array.isArray(jsonData)) {
    return jsonData.filter(item => typeof item === 'number');
  }
  return [];
};

export const useRamayanaSites = () => {
  const [sites, setSites] = useState<RamayanaSite[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSites = async () => {
      try {
        const { data, error } = await supabase
          .from('ramayana_sites')
          .select('*')
          .eq('is_active', true)
          .order('order_index');

        if (error) throw error;
        
        // Transform the data to match our interface
        const transformedSites: RamayanaSite[] = (data || []).map((site) => ({
          id: site.id,
          name: site.name,
          slug: site.slug,
          location: site.location,
          significance: site.significance,
          mythology_story: site.mythology_story,
          ritual_highlights: site.ritual_highlights,
          puja_timings: site.puja_timings,
          latitude: site.latitude,
          longitude: site.longitude,
          hero_image_url: site.hero_image_url,
          gallery_images: jsonToStringArray(site.gallery_images),
          best_visit_times: site.best_visit_times,
          special_requirements: site.special_requirements,
          is_featured: site.is_featured,
          order_index: site.order_index
        }));
        
        setSites(transformedSites);
      } catch (err) {
        console.error('Error fetching Ramayana sites:', err);
        setError('Failed to load pilgrimage sites');
        toast.error('Failed to load pilgrimage sites');
      } finally {
        setLoading(false);
      }
    };

    fetchSites();
  }, []);

  return { sites, loading, error };
};

export const useRamayanaPackages = () => {
  const [packages, setPackages] = useState<RamayanaPackage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const { data, error } = await supabase
          .from('ramayana_packages')
          .select('*')
          .eq('is_active', true)
          .order('is_featured', { ascending: false });

        if (error) throw error;
        
        // Transform the data to match our interface
        const transformedPackages: RamayanaPackage[] = (data || []).map((pkg) => ({
          id: pkg.id,
          name: pkg.name,
          slug: pkg.slug,
          tier: (pkg.tier === 'vip' || pkg.tier === 'standard') ? pkg.tier : 'standard',
          operator: pkg.operator,
          duration_days: pkg.duration_days,
          price_per_person: pkg.price_per_person,
          currency: pkg.currency,
          description: pkg.description,
          inclusions: jsonToStringArray(pkg.inclusions),
          exclusions: jsonToStringArray(pkg.exclusions),
          accommodation_type: pkg.accommodation_type,
          transport_type: pkg.transport_type,
          guide_languages: jsonToStringArray(pkg.guide_languages),
          max_participants: pkg.max_participants,
          min_participants: pkg.min_participants,
          sites_covered: jsonToNumberArray(pkg.sites_covered),
          special_features: jsonToStringArray(pkg.special_features),
          is_featured: pkg.is_featured
        }));
        
        setPackages(transformedPackages);
      } catch (err) {
        console.error('Error fetching Ramayana packages:', err);
        setError('Failed to load pilgrimage packages');
        toast.error('Failed to load pilgrimage packages');
      } finally {
        setLoading(false);
      }
    };

    fetchPackages();
  }, []);

  return { packages, loading, error };
};

export const useCreateRamayanaBooking = () => {
  const [loading, setLoading] = useState(false);

  const createBooking = async (bookingData: Omit<RamayanaBooking, 'id' | 'booking_status' | 'payment_status'>) => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('ramayana_bookings')
        .insert([{
          ...bookingData,
          confirmation_number: `RAM-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`
        }])
        .select()
        .single();

      if (error) throw error;
      
      toast.success('Pilgrimage booking created successfully!');
      return { success: true, booking: data };
    } catch (err) {
      console.error('Error creating Ramayana booking:', err);
      toast.error('Failed to create booking. Please try again.');
      return { success: false, error: err };
    } finally {
      setLoading(false);
    }
  };

  return { createBooking, loading };
};
