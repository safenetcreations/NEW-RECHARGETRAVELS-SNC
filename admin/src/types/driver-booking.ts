
export interface DriverBooking {
  id: string
  customer_id: string
  driver_id: string
  vehicle_id: string
  
  // Trip details
  pickup_location: string
  dropoff_location?: string
  pickup_date: string
  pickup_time: string
  return_date?: string
  return_time?: string
  passenger_count: number
  
  // Service details
  service_type: 'transport_only' | 'guided_tour' | 'custom_package'
  duration_days?: number
  special_requirements?: string
  estimated_distance_km?: number
  
  // Pricing
  quoted_price?: number
  final_price?: number
  currency?: string
  
  // Status and communication
  booking_status: 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled'
  customer_notes?: string
  driver_notes?: string
  admin_notes?: string
  
  // Communication
  whatsapp_shared?: boolean
  whatsapp_shared_at?: string
  
  // Admin management
  confirmed_by?: string
  confirmed_at?: string
  
  // Metadata
  created_at: string
  updated_at: string
}

export interface DriverBookingFormData {
  service_type: 'transport_only' | 'guided_tour' | 'custom_package'
  pickup_location: string
  dropoff_location?: string
  pickup_date: string
  pickup_time: string
  return_date?: string
  return_time?: string
  passenger_count: number
  duration_days?: number
  special_requirements?: string
  estimated_distance_km?: number
  customer_notes?: string
}

export interface Customer {
  id: string
  user_id: string
  first_name?: string
  last_name?: string
  phone_number?: string
  preferred_language?: string
  created_at: string
  updated_at: string
  is_active: boolean
}

export interface UserProfile {
  id: string
  email: string
  user_type: 'driver' | 'customer' | 'admin'
  first_name?: string
  last_name?: string
  phone_number?: string
  created_at: string
  updated_at: string
  is_active: boolean
  last_login?: string
}
