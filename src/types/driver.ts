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

// ==========================================
// DRIVER BADGES & SOCIAL PROFILE SYSTEM
// ==========================================

export type BadgeType =
  | 'sltda_verified'      // SLTDA License Verified
  | 'police_cleared'      // Police Clearance Valid
  | 'five_star_driver'    // Maintained 5.0 rating
  | 'top_rated'           // 4.8+ rating with 10+ reviews
  | 'early_bird'          // Punctual driver (95%+ on-time)
  | 'safe_driver'         // Zero accidents/complaints
  | '100_trips'           // Completed 100 trips
  | '500_trips'           // Completed 500 trips
  | '1000_trips'          // Completed 1000 trips
  | 'language_expert'     // Speaks 3+ languages
  | 'luxury_specialist'   // Certified for luxury vehicles
  | 'wildlife_expert'     // Safari & wildlife certified
  | 'cultural_guide'      // Cultural tour specialist
  | 'first_trip'          // Completed first trip
  | 'quick_responder'     // Fast booking acceptance
  | 'customer_favorite'   // High repeat booking rate
  | 'veteran_driver';     // 10+ years experience

export interface DriverBadge {
  id?: string;
  driver_id: string;
  badge_type: BadgeType;
  badge_name: string;
  badge_description: string;
  badge_icon: string;         // Emoji or icon name
  badge_color: string;        // Tailwind color class
  awarded_date: string;
  awarded_by?: string;        // Admin ID or 'system'
  expiry_date?: string;       // Some badges expire (e.g., sltda_verified)
  is_active: boolean;
  criteria_met?: Record<string, unknown>; // Data that triggered the badge
}

export type AchievementType =
  | 'milestone'           // Trip milestones
  | 'rating'              // Rating achievements
  | 'certification'       // Professional certifications
  | 'special'             // Special recognitions
  | 'seasonal';           // Limited time achievements

export interface DriverAchievement {
  id?: string;
  driver_id: string;
  achievement_type: AchievementType;
  title: string;
  description: string;
  icon: string;
  unlocked_date: string;
  progress_current?: number;
  progress_target?: number;
  is_unlocked: boolean;
  reward_points?: number;
}

export interface DriverSocialProfile {
  id?: string;
  driver_id: string;

  // Profile Enhancement
  tagline?: string;             // Short catchy phrase
  about_me?: string;            // Extended bio
  fun_facts?: string[];         // Personal touches
  specialties?: string[];       // Tour specialties (wildlife, cultural, etc.)

  // Social Proof
  featured_reviews?: string[];  // IDs of best reviews to showcase
  testimonial_video?: string;   // Video testimonial URL
  photo_gallery?: string[];     // Portfolio photos

  // Stats (denormalized for quick display)
  total_trips: number;
  total_km_driven: number;
  total_happy_customers: number;
  repeat_customer_rate: number;
  response_time_avg: number;    // Minutes
  acceptance_rate: number;      // Percentage

  // Badges & Achievements
  badges: string[];             // Badge IDs
  achievements: string[];       // Achievement IDs
  badge_showcase: string[];     // Top 5 badges to display

  // Engagement
  profile_views: number;
  profile_likes: number;
  inquiry_count: number;

  // Completion tracking
  profile_completion: number;   // Percentage
  last_active: string;

  created_at?: string;
  updated_at?: string;
}

// Badge definitions with metadata
export const BADGE_DEFINITIONS: Record<BadgeType, Omit<DriverBadge, 'id' | 'driver_id' | 'awarded_date' | 'awarded_by' | 'is_active' | 'expiry_date' | 'criteria_met'>> = {
  sltda_verified: {
    badge_type: 'sltda_verified',
    badge_name: 'SLTDA Verified',
    badge_description: 'Licensed by Sri Lanka Tourism Development Authority',
    badge_icon: '🏛️',
    badge_color: 'bg-emerald-100 text-emerald-800 border-emerald-300'
  },
  police_cleared: {
    badge_type: 'police_cleared',
    badge_name: 'Police Cleared',
    badge_description: 'Valid police clearance certificate',
    badge_icon: '🛡️',
    badge_color: 'bg-blue-100 text-blue-800 border-blue-300'
  },
  five_star_driver: {
    badge_type: 'five_star_driver',
    badge_name: '5-Star Driver',
    badge_description: 'Maintained perfect 5.0 rating',
    badge_icon: '⭐',
    badge_color: 'bg-yellow-100 text-yellow-800 border-yellow-300'
  },
  top_rated: {
    badge_type: 'top_rated',
    badge_name: 'Top Rated',
    badge_description: '4.8+ rating with 10+ reviews',
    badge_icon: '🏆',
    badge_color: 'bg-amber-100 text-amber-800 border-amber-300'
  },
  early_bird: {
    badge_type: 'early_bird',
    badge_name: 'Early Bird',
    badge_description: '95%+ on-time arrival rate',
    badge_icon: '🌅',
    badge_color: 'bg-orange-100 text-orange-800 border-orange-300'
  },
  safe_driver: {
    badge_type: 'safe_driver',
    badge_name: 'Safe Driver',
    badge_description: 'Zero accidents or safety complaints',
    badge_icon: '🛡️',
    badge_color: 'bg-green-100 text-green-800 border-green-300'
  },
  '100_trips': {
    badge_type: '100_trips',
    badge_name: '100 Trips',
    badge_description: 'Completed 100 successful trips',
    badge_icon: '💯',
    badge_color: 'bg-purple-100 text-purple-800 border-purple-300'
  },
  '500_trips': {
    badge_type: '500_trips',
    badge_name: '500 Trips',
    badge_description: 'Completed 500 successful trips',
    badge_icon: '🎯',
    badge_color: 'bg-indigo-100 text-indigo-800 border-indigo-300'
  },
  '1000_trips': {
    badge_type: '1000_trips',
    badge_name: '1000 Trips',
    badge_description: 'Elite driver with 1000+ trips',
    badge_icon: '👑',
    badge_color: 'bg-gradient-to-r from-yellow-200 to-amber-200 text-amber-900 border-amber-400'
  },
  language_expert: {
    badge_type: 'language_expert',
    badge_name: 'Language Expert',
    badge_description: 'Fluent in 3+ languages',
    badge_icon: '🗣️',
    badge_color: 'bg-cyan-100 text-cyan-800 border-cyan-300'
  },
  luxury_specialist: {
    badge_type: 'luxury_specialist',
    badge_name: 'Luxury Specialist',
    badge_description: 'Certified for luxury vehicle service',
    badge_icon: '✨',
    badge_color: 'bg-rose-100 text-rose-800 border-rose-300'
  },
  wildlife_expert: {
    badge_type: 'wildlife_expert',
    badge_name: 'Wildlife Expert',
    badge_description: 'Safari & wildlife tour specialist',
    badge_icon: '🦁',
    badge_color: 'bg-lime-100 text-lime-800 border-lime-300'
  },
  cultural_guide: {
    badge_type: 'cultural_guide',
    badge_name: 'Cultural Guide',
    badge_description: 'Expert in Sri Lankan heritage & culture',
    badge_icon: '🏺',
    badge_color: 'bg-amber-100 text-amber-800 border-amber-300'
  },
  first_trip: {
    badge_type: 'first_trip',
    badge_name: 'First Trip',
    badge_description: 'Completed first successful trip',
    badge_icon: '🎉',
    badge_color: 'bg-pink-100 text-pink-800 border-pink-300'
  },
  quick_responder: {
    badge_type: 'quick_responder',
    badge_name: 'Quick Responder',
    badge_description: 'Average response time under 5 minutes',
    badge_icon: '⚡',
    badge_color: 'bg-yellow-100 text-yellow-800 border-yellow-300'
  },
  customer_favorite: {
    badge_type: 'customer_favorite',
    badge_name: 'Customer Favorite',
    badge_description: 'High repeat booking rate (30%+)',
    badge_icon: '❤️',
    badge_color: 'bg-red-100 text-red-800 border-red-300'
  },
  veteran_driver: {
    badge_type: 'veteran_driver',
    badge_name: 'Veteran Driver',
    badge_description: '10+ years of driving experience',
    badge_icon: '🎖️',
    badge_color: 'bg-slate-100 text-slate-800 border-slate-300'
  }
};

// ==========================================
// DRIVER ORDERS & BATCH OPERATIONS
// ==========================================

export type OrderStatus =
  | 'assigned'      // Driver assigned to booking
  | 'accepted'      // Driver accepted the booking
  | 'declined'      // Driver declined
  | 'started'       // Trip in progress
  | 'completed'     // Trip completed
  | 'cancelled'     // Cancelled by customer/driver
  | 'no_show';      // Customer didn't show

export interface DriverOrder {
  id?: string;
  driver_id: string;
  booking_id: string;
  customer_id: string;

  // Order lifecycle
  order_status: OrderStatus;
  assigned_at: string;
  acceptance_deadline?: string;   // 2-hour window
  accepted_at?: string;
  started_at?: string;
  completed_at?: string;
  cancelled_at?: string;
  cancellation_reason?: string;

  // Trip details
  pickup_location: string;
  dropoff_location: string;
  pickup_time: string;
  estimated_duration: number;     // Minutes
  actual_duration?: number;
  estimated_km: number;
  actual_km?: number;

  // Financials
  base_fare: number;
  extras?: number;
  tips?: number;
  total_fare: number;
  driver_earnings: number;
  platform_fee: number;
  commission: number;

  // Verification
  trip_photos?: string[];         // Before/after photos
  customer_signature?: string;
  driver_notes?: string;
  customer_feedback?: string;

  created_at?: string;
  updated_at?: string;
}

export interface DriverBatchOperation {
  id?: string;
  driver_id: string;

  // Period
  period_type: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly';
  period_start: string;
  period_end: string;

  // Trip metrics
  total_trips: number;
  completed_trips: number;
  cancelled_trips: number;
  no_show_trips: number;
  total_km: number;
  total_hours: number;

  // Financial metrics
  gross_earnings: number;
  platform_fees: number;
  commission_paid: number;
  bonuses_earned: number;
  net_earnings: number;
  tips_received: number;

  // Performance metrics
  average_rating: number;
  on_time_rate: number;
  acceptance_rate: number;
  completion_rate: number;
  response_time_avg: number;

  // Rankings
  rank_in_tier?: number;
  rank_overall?: number;

  created_at?: string;
}

// ==========================================
// COMMISSION & PAYMENT SETTLEMENT
// ==========================================

export interface CommissionSettings {
  platform_fee_fixed: number;       // e.g., 300 LKR per booking
  commission_percentage: number;    // e.g., 10%

  // Bonus rates
  completion_bonus_rate: number;    // +5% for 100% on-time
  rating_bonus_rate: number;        // +3% for 4.8+ stars
  batch_bonus_rate: number;         // +2% for 10+ trips/month
  referral_bonus: number;           // Fixed amount per referral

  // Thresholds
  rating_bonus_threshold: number;   // 4.8
  batch_bonus_threshold: number;    // 10 trips

  // Payment settings
  min_payout_amount: number;
  payout_frequency: 'daily' | 'weekly' | 'biweekly' | 'monthly';
  payout_hold_days: number;         // Days to hold before payout
}

export type PaymentStatus = 'pending' | 'processing' | 'completed' | 'failed' | 'on_hold';

export interface DriverPaymentSettlement {
  id?: string;
  driver_id: string;

  // Period
  settlement_period: string;        // e.g., "2024-01-W1"
  period_start: string;
  period_end: string;

  // Earnings breakdown
  gross_earnings: number;
  total_trips: number;

  // Deductions
  platform_fees: number;
  commission_amount: number;
  deductions_other?: number;
  deduction_notes?: string;

  // Bonuses
  completion_bonus: number;
  rating_bonus: number;
  batch_bonus: number;
  referral_bonus: number;
  other_bonus: number;
  total_bonuses: number;

  // Final amount
  net_payout: number;

  // Payment info
  payment_status: PaymentStatus;
  payment_method?: 'bank_transfer' | 'mobile_money' | 'cash' | 'wallet';
  bank_account?: string;
  bank_reference?: string;
  payment_date?: string;
  payment_notes?: string;

  // Approval
  approved_by?: string;
  approved_at?: string;

  created_at?: string;
  updated_at?: string;
}
