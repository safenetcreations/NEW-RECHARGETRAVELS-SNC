
export interface WildlifePackage {
  id: string;
  name: string;
  category: 'safari' | 'marine' | 'conservation' | 'birding';
  duration: string;
  location: string;
  price: number;
  rating: number;
  participants: number;
  difficulty: 'Easy' | 'Moderate' | 'Challenging';
  isUnescoSite: boolean;
  features: string[];
  description: string;
  image: string;
  highlights: string[];
  created_at?: string;
  updated_at?: string;
}

export interface Lodge {
  id: string;
  name: string;
  slug: string;
  category_id: string;
  location: string;
  description: string;
  features: string[];
  price_per_night: number;
  capacity: number;
  images: string[];
  coordinates?: { lat: number; lng: number };
  is_featured: boolean;
  is_active: boolean;
  amenities: Record<string, any>;
  policies: Record<string, any>;
  lodge_categories?: {
    name: string;
    slug: string;
    description: string;
  };
}

export interface WildlifeActivity {
  id: string;
  name: string;
  slug: string;
  type_id: string;
  description: string;
  duration: string;
  price_per_person: number;
  min_participants: number;
  max_participants: number;
  location: string;
  best_time: string;
  difficulty_level: 'Easy' | 'Moderate' | 'Challenging';
  includes: string[];
  images: string[];
  is_featured: boolean;
  is_active: boolean;
  activity_types?: {
    name: string;
    slug: string;
    icon: string;
  };
}

export interface SafariPackage {
  id: string;
  user_id?: string;
  name?: string;
  start_date: string;
  end_date: string;
  total_participants: number;
  package_data: any;
  subtotal: number;
  taxes: number;
  total_amount: number;
  status: 'draft' | 'saved' | 'booked';
}

export interface WildlifeBooking {
  id: string;
  booking_number: string;
  package_id: string;
  user_id: string;
  booking_date: string;
  start_date: string;
  end_date: string;
  total_participants: number;
  subtotal: number;
  discount_amount: number;
  total_amount: number;
  payment_status: 'pending' | 'partial' | 'paid' | 'refunded';
  booking_status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  payment_details: Record<string, any>;
  special_requests?: string;
  safari_packages?: {
    name: string;
    package_data: any;
  };
}
