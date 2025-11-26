
export interface TourPackage {
  id: string;
  name: string;
  category: TourCategory;
  duration_days: number;
  luxury_level: LuxuryLevel;
  base_price: number;
  description?: string;
  highlights?: string[];
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface TourItinerary {
  id: string;
  tour_package_id: string;
  day_number: number;
  title: string;
  description?: string;
  activities?: string[];
  meals_included?: string[];
  accommodation?: string;
  transport_details?: string;
  special_notes?: string;
  created_at: string;
}

export interface TourInclusion {
  id: string;
  tour_package_id: string;
  inclusion_type: 'accommodation' | 'meals' | 'transport' | 'activities' | 'guide' | 'other' | 'excluded';
  item: string;
  description?: string;
  is_premium: boolean;
}

export interface TourAccommodation {
  id: string;
  tour_package_id: string;
  hotel_name: string;
  location: string;
  nights: number;
  room_type?: string;
  star_rating?: number;
  luxury_level?: LuxuryLevel;
  check_in_day?: number;
  check_out_day?: number;
}

export interface TourPricing {
  id: string;
  tour_package_id: string;
  luxury_level: LuxuryLevel;
  base_price_per_person: number;
  single_supplement_percentage?: number;
  peak_season_surcharge_percentage?: number;
  group_discount_6plus_percentage?: number;
  group_discount_10plus_percentage?: number;
  child_discount_percentage?: number;
  currency: string;
}

export interface TourAddon {
  id: string;
  name: string;
  description?: string;
  price_per_person?: number;
  price_per_day?: number;
  price_per_trip?: number;
  category?: string;
  is_active: boolean;
}

export interface TourPackageAddon {
  id: string;
  tour_package_id: string;
  addon_id: string;
  is_recommended: boolean;
}

export interface TourSeasonalPricing {
  id: string;
  tour_package_id: string;
  season_name: string;
  start_date: string;
  end_date: string;
  price_multiplier: number;
  is_active: boolean;
}

export interface TourPackageWithDetails extends TourPackage {
  itinerary?: TourItinerary[];
  inclusions?: TourInclusion[];
  accommodations?: TourAccommodation[];
  pricing?: TourPricing[];
  addons?: TourPackageAddon[];
  seasonal_pricing?: TourSeasonalPricing[];
}

export type TourCategory = 'wildlife' | 'cultural' | 'beach' | 'adventure' | 'wellness' | 'tea';
export type LuxuryLevel = 'luxury' | 'semi-luxury' | 'budget';
