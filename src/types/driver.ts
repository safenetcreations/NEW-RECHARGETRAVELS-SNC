export type DriverStatus = 'incomplete' | 'pending_verification' | 'verified' | 'suspended' | 'inactive';

export type VerificationLevel = 1 | 2 | 3;

export type EmploymentMode = 'gig' | 'contract' | 'full_time';

export type DriverTier =
  | 'chauffeur_guide' // Chauffeur Tourist Guide Lecturer (small groups, premium)
  | 'national_guide' // National Tourist Guide Lecturer (larger groups)
  | 'tourist_driver' // SLITHM-trained tourist driver (not for guiding at sites)
  | 'freelance_driver'; // Standard freelance driver (point-to-point/transfer)

export type DocumentType =
  | 'national_id'
  | 'driving_license'
  | 'slt_da_license'
  | 'police_clearance'
  | 'medical_report'
  | 'grama_niladari_certificate'
  | 'vehicle_revenue_license'
  | 'vehicle_insurance'
  | 'vehicle_registration'
  | 'vehicle_permit';

export type PhotoType =
  | 'selfie_with_id'
  | 'profile_photo'
  | 'vehicle_front'
  | 'vehicle_back'
  | 'vehicle_side'
  | 'vehicle_interior'
  | 'business_card'
  | 'video_intro';

export interface Driver {
  id?: string;
  user_id: string;
  full_name: string;
  email?: string;
  phone?: string;
  tier: DriverTier;
  sltda_license_number?: string;
  sltda_license_expiry?: string;
  drivers_license_number?: string;
  drivers_license_expiry?: string;
  national_id_number?: string;
  national_id_expiry?: string;
  police_clearance_expiry?: string;
  medical_report_expiry?: string;
  years_experience?: number;
  current_status: DriverStatus;
  verified_level?: VerificationLevel;
  verification_date?: string;
  verified_by_admin_id?: string;
  biography?: string;
  specialty_languages?: string[];
  employment_mode?: EmploymentMode;
  hourly_rate?: number;
  daily_rate?: number;
  contract_rate?: number;
  vehicle_preference?: 'own_vehicle' | 'company_vehicle';
  is_guide?: boolean;
  is_chauffeur?: boolean;
  is_sltda_approved?: boolean;
  social_insta?: string;
  social_facebook?: string;
  live_video_url?: string;
  average_rating?: number;
  total_reviews?: number;
  completion_rate?: number;
  created_at?: string;
  updated_at?: string;
}

export interface DriverDocument {
  id?: string;
  driver_id: string;
  document_type: DocumentType;
  file_path: string;
  upload_date: string;
  expiry_date?: string;
  verification_status: 'pending' | 'approved' | 'rejected' | 'expired';
  verified_by_admin_id?: string;
  verification_date?: string;
  rejection_reason?: string;
  notes?: string;
}

export interface DriverPhoto {
  id?: string;
  driver_id: string;
  photo_type: PhotoType;
  file_path: string;
  upload_date: string;
  verification_status: 'pending' | 'approved' | 'rejected';
  verified_by_admin_id?: string;
  is_mobile_capture?: boolean;
  device_metadata?: Record<string, unknown>;
}

export interface DriverAvailability {
  id?: string;
  driver_id: string;
  date: string;
  time_slot: 'morning' | 'afternoon' | 'evening' | 'full_day' | 'custom';
  availability_status: 'available' | 'booked' | 'unavailable';
  max_passengers?: number;
  notes?: string;
  auto_update_flag?: boolean;
}

export interface DriverVehicle {
  id?: string;
  driver_id: string;
  vehicle_type: 'sedan' | 'suv' | 'van' | 'mini_coach' | 'luxury';
  registration_number: string;
  make_model_year: string;
  seat_capacity: number;
  ac_available?: boolean;
  wifi_available?: boolean;
  charger_ports?: number;
  insurance_expiry?: string;
  service_history_link?: string;
  vehicle_photos_array?: string[];
  verification_status?: 'pending' | 'approved' | 'rejected';
}

export interface DriverWallet {
  id?: string;
  driver_id: string;
  balance: number;
  currency: string;
  wallet_bypass?: boolean; // for full-time/contract drivers
  updated_at?: string;
}
