// Vehicle Rental Platform Types - International USD Platform

// ============ ENUMS ============
export type VehicleType = 'sedan' | 'suv' | 'van' | 'mini-coach' | 'luxury' | 'convertible' | 'hatchback' | 'pickup';
export type FuelType = 'petrol' | 'diesel' | 'hybrid' | 'electric';
export type TransmissionType = 'manual' | 'automatic';
export type OwnerVerificationStatus = 'incomplete' | 'pending_verification' | 'pending_admin_review' | 'verified' | 'rejected' | 'suspended';
export type VehicleStatus = 'draft' | 'pending_review' | 'active' | 'suspended' | 'maintenance' | 'inactive';
export type DocumentType = 'registration' | 'insurance' | 'roadworthiness' | 'tax' | 'pollution' | 'authorization_letter' | 'owner_id' | 'driving_license' | 'passport' | 'international_license';
export type DocumentStatus = 'pending' | 'verified' | 'rejected' | 'expired';
export type BookingStatus = 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled' | 'disputed';
export type RentalPeriodType = 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly';
export type AvailabilityStatus = 'available' | 'booked' | 'maintenance' | 'personal' | 'blocked';

// ============ INSURANCE PACKAGES (USD) ============
export type InsurancePackage = 'none' | 'basic' | 'silver' | 'gold';

export interface InsuranceOption {
  id: InsurancePackage;
  name: string;
  pricePerDay: number; // USD
  coverage: string[];
  deductible: number; // USD
  commission: number; // percentage (10%, 20%, 15%)
  recommended?: boolean;
}

export const INSURANCE_PACKAGES: InsuranceOption[] = [
  {
    id: 'basic',
    name: 'Basic Protection',
    pricePerDay: 6, // $6/day
    coverage: ['Third-party liability', 'Basic collision damage'],
    deductible: 500,
    commission: 10
  },
  {
    id: 'silver',
    name: 'Silver Protection',
    pricePerDay: 14, // $14/day
    coverage: ['Third-party liability', 'Collision damage waiver', 'Theft protection', 'Roadside assistance'],
    deductible: 200,
    commission: 20,
    recommended: true
  },
  {
    id: 'gold',
    name: 'Gold Protection',
    pricePerDay: 30, // $30/day
    coverage: ['Full comprehensive', 'Zero deductible', '24/7 roadside assistance', 'Personal effects coverage', 'Medical coverage'],
    deductible: 0,
    commission: 15
  }
];

// ============ DELIVERY OPTIONS (USD) ============
export type DeliveryType = 'self_pickup' | 'airport' | 'hotel' | 'city' | 'custom';

export interface DeliveryOption {
  id: DeliveryType;
  name: string;
  price: number; // USD
  description: string;
  estimatedTime?: string;
}

export const DELIVERY_OPTIONS: DeliveryOption[] = [
  { id: 'self_pickup', name: 'Self Pickup', price: 0, description: 'Pick up from owner location' },
  { id: 'airport', name: 'Airport Delivery', price: 45, description: 'Delivery to Bandaranaike International Airport (CMB)', estimatedTime: '45-60 min' },
  { id: 'hotel', name: 'Hotel Delivery', price: 35, description: 'Delivery to your hotel in Colombo area', estimatedTime: '30-45 min' },
  { id: 'city', name: 'City Delivery', price: 25, description: 'Delivery within city limits', estimatedTime: '20-30 min' },
  { id: 'custom', name: 'Custom Location', price: 50, description: 'Delivery to any location island-wide', estimatedTime: 'Varies' }
];

// ============ ADDITIONAL SERVICES (USD) ============
export type AdditionalService = 'gps' | 'child_seat' | 'wifi_hotspot' | 'fuel_delivery' | 'vehicle_wash' | 'extra_driver';

export interface ServiceOption {
  id: AdditionalService;
  name: string;
  pricePerDay: number; // USD
  oneTime?: boolean; // If true, charged once not per day
  commission: number; // percentage
  description: string;
}

export const ADDITIONAL_SERVICES: ServiceOption[] = [
  { id: 'gps', name: 'GPS Navigation', pricePerDay: 4, commission: 30, description: 'Portable GPS device with Sri Lanka maps' },
  { id: 'child_seat', name: 'Child Seat', pricePerDay: 5, commission: 40, description: 'Age-appropriate child safety seat' },
  { id: 'wifi_hotspot', name: 'WiFi Hotspot', pricePerDay: 6, commission: 35, description: 'Unlimited 4G data for up to 5 devices' },
  { id: 'fuel_delivery', name: 'Fuel Delivery', pricePerDay: 15, oneTime: true, commission: 40, description: 'Full tank delivered on request' },
  { id: 'vehicle_wash', name: 'Vehicle Wash', pricePerDay: 12, oneTime: true, commission: 30, description: 'Premium wash before/after rental' },
  { id: 'extra_driver', name: 'Additional Driver', pricePerDay: 10, commission: 25, description: 'Add another authorized driver' }
];

// ============ CORPORATE ACCOUNTS ============
export interface CorporateAccount {
  id: string;
  companyName: string;
  contactPerson: string;
  email: string;
  phone: string;
  registrationNumber: string;
  
  // Pricing
  discountPercentage: number; // e.g., 20% bulk discount
  monthlyFee: number; // $17/month dedicated support
  creditLimit: number;
  
  // Usage
  totalRentals: number;
  totalSpend: number;
  activeBookings: number;
  
  status: 'pending' | 'active' | 'suspended';
  createdAt: Date;
}

// ============ COMMISSION STRUCTURE (USD) ============
export interface CommissionStructure {
  // Duration-based rates
  hourlyCommission: number; // 20%
  dailyCommission: number; // 15%
  weeklyCommission: number; // 12%
  monthlyCommission: number; // 10%
  
  // Service fee (charged to guest)
  guestServiceFee: number; // 10%
  
  // Insurance commissions
  basicInsuranceCommission: number; // 10%
  silverInsuranceCommission: number; // 20%
  goldInsuranceCommission: number; // 15%
  
  // Add-on commissions
  deliveryCommission: number; // 100% (platform keeps)
  gpsCommission: number; // 30%
  fuelDeliveryCommission: number; // 40%
  vehicleWashCommission: number; // 30%
}

export const DEFAULT_COMMISSION: CommissionStructure = {
  hourlyCommission: 20,
  dailyCommission: 15,
  weeklyCommission: 12,
  monthlyCommission: 10,
  guestServiceFee: 10,
  basicInsuranceCommission: 10,
  silverInsuranceCommission: 20,
  goldInsuranceCommission: 15,
  deliveryCommission: 100,
  gpsCommission: 30,
  fuelDeliveryCommission: 40,
  vehicleWashCommission: 30
};

// ============ PAYMENT TIMELINE ============
export interface PaymentTimeline {
  bookingId: string;
  totalOwnerPayout: number;
  
  // First payout (50% within 6 hours of pickup)
  firstPayoutAmount: number;
  firstPayoutDue: Date;
  firstPayoutStatus: 'pending' | 'processing' | 'paid';
  firstPayoutDate?: Date;
  
  // Second payout (50% after 72 hours)
  secondPayoutAmount: number;
  secondPayoutDue: Date;
  secondPayoutStatus: 'pending' | 'processing' | 'paid' | 'adjusted';
  secondPayoutDate?: Date;
  
  // Adjustments
  damageDeduction?: number;
  bonusAmount?: number;
  adjustmentReason?: string;
  
  // Weekly bulk option
  weeklyBulkPayout?: boolean; // Owner gets 88% instead of 85%
}

// ============ SECURITY & KYC (International) ============
export interface CustomerKYC {
  customerId: string;
  
  // Layer 1: Digital KYC
  passportNumber: string;
  passportCountry: string;
  passportExpiry: Date;
  passportVerified: boolean;
  selfieUrl: string;
  biometricMatch: boolean;
  livenessCheck: boolean;
  
  // Layer 2: International License
  licenseNumber: string;
  licenseCountry: string;
  licenseExpiry: Date;
  licenseVerified: boolean;
  internationalDrivingPermit?: string;
  
  // Layer 3: Fraud Detection
  riskScore: number; // 0-100
  fraudFlags: string[];
  sanctionsCheck: boolean;
  previousBookings: number;
  previousIssues: number;
  
  // Verification timing
  verificationTime: number; // seconds
  verifiedAt?: Date;
  verifiedBy: 'auto' | 'manual';
}

// ============ REVENUE BREAKDOWN ============
export interface BookingRevenueBreakdown {
  bookingId: string;
  
  // Customer pays
  baseRental: number;
  serviceFee: number; // 10% of rental
  insuranceCost: number;
  deliveryCost: number;
  additionalServicesCost: number;
  securityDeposit: number;
  totalCustomerPays: number;
  
  // Platform earns (Take-Rate)
  rentalCommission: number; // 15% of base
  serviceFeeEarned: number; // 100%
  insuranceCommission: number; // 10-20%
  deliveryFeeEarned: number; // 100%
  servicesCommission: number;
  totalPlatformEarns: number;
  takeRatePercentage: number; // Total / Customer payment
  
  // Owner receives
  rentalPayout: number; // 85% of base
  insurancePayout: number; // 80-90%
  servicesPayout: number;
  totalOwnerReceives: number;
  
  // Payout schedule
  immediatePayout: number; // 50% within 6 hours
  finalPayout: number; // 50% after 72 hours
}

// ============ VEHICLE OWNER ============
export interface VehicleOwner {
  id: string;
  userId: string; // Link to Firebase Auth user
  
  // Personal Info
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  whatsapp?: string;
  profilePhoto?: string;
  
  // Address
  address: {
    line1: string;
    line2?: string;
    city: string;
    district: string;
    postalCode: string;
  };
  
  // Identity
  nationalId?: string;
  passportNumber?: string;
  drivingLicenseNumber?: string;
  
  // Bank Details
  bankDetails: {
    bankName: string;
    accountNumber: string;
    accountHolderName: string;
    branchCode: string;
    verified: boolean;
  };
  
  // Business Info
  businessLicense?: string;
  taxId?: string;
  
  // Profile
  bio?: string;
  languages: string[];
  yearsOfExperience?: number;
  
  // Verification
  verificationStatus: OwnerVerificationStatus;
  verificationSteps: {
    step1_registration: boolean;
    step2_id_verification: boolean;
    step3_address_verification: boolean;
    step4_bank_verification: boolean;
    step5_profile_completion: boolean;
    step6_admin_verification: boolean;
  };
  verificationNotes?: string;
  verifiedAt?: Date;
  verifiedBy?: string;
  
  // Stats
  totalVehicles: number;
  totalBookings: number;
  totalEarnings: number;
  rating: number;
  reviewCount: number;
  
  // Timestamps
  createdAt: Date;
  updatedAt: Date;
}

// ============ VEHICLE ============
export interface Vehicle {
  id: string;
  ownerId: string;
  
  // Basic Info
  registrationNumber: string;
  make: string;
  model: string;
  year: number;
  color: string;
  vehicleType: VehicleType;
  
  // Specifications
  fuelType: FuelType;
  transmission: TransmissionType;
  engineCapacity: number; // in cc
  mileage: number; // km per liter
  seatingCapacity: number;
  luggageCapacity: number; // in bags
  
  // Features & Amenities
  features: string[];
  amenities: {
    airConditioning: boolean;
    wifi: boolean;
    bluetooth: boolean;
    usbCharging: boolean;
    gps: boolean;
    childSeat: boolean;
    sunroof: boolean;
    backupCamera: boolean;
    parkingSensors: boolean;
    cruiseControl: boolean;
  };
  
  // Photos
  photos: VehiclePhoto[];
  
  // Ownership
  isOwnVehicle: boolean;
  authorizationLetterId?: string; // If third-party vehicle
  
  // Status
  status: VehicleStatus;
  condition: 'excellent' | 'good' | 'fair';
  damageHistory?: string;
  lastServiceDate?: Date;
  nextServiceDue?: Date;
  
  // Service Area
  serviceAreas: string[]; // Cities/districts
  pickupLocations: {
    address: string;
    city: string;
    coordinates?: { lat: number; lng: number };
  }[];
  deliveryAvailable: boolean;
  deliveryFee?: number;
  
  // Reviews
  rating: number;
  reviewCount: number;
  
  // Timestamps
  createdAt: Date;
  updatedAt: Date;
  approvedAt?: Date;
  approvedBy?: string;
}

// ============ VEHICLE PHOTO ============
export interface VehiclePhoto {
  id: string;
  vehicleId: string;
  url: string;
  type: 'exterior_front' | 'exterior_back' | 'exterior_left' | 'exterior_right' | 'interior' | 'dashboard' | 'document_extracted' | 'other';
  isPrimary: boolean;
  isAutoExtracted: boolean; // From document OCR
  uploadedAt: Date;
}

// ============ VEHICLE DOCUMENT ============
export interface VehicleDocument {
  id: string;
  vehicleId?: string;
  ownerId: string;
  
  documentType: DocumentType;
  documentNumber?: string;
  fileUrl: string;
  fileName: string;
  
  // OCR Data
  ocrExtracted: boolean;
  ocrData?: {
    vehicleNumber?: string;
    ownerName?: string;
    make?: string;
    model?: string;
    year?: string;
    engineNumber?: string;
    chassisNumber?: string;
    extractedPhoto?: string;
    rawText?: string;
  };
  
  // Validity
  issueDate?: Date;
  expiryDate?: Date;
  isExpired: boolean;
  expiryAlertSent: boolean;
  
  // Verification
  status: DocumentStatus;
  verificationNotes?: string;
  verifiedAt?: Date;
  verifiedBy?: string;
  
  // Timestamps
  uploadedAt: Date;
  updatedAt: Date;
}

// ============ VEHICLE PRICING ============
export interface VehiclePricing {
  id: string;
  vehicleId: string;
  
  // Base Rates (in LKR)
  hourlyRate: number;
  dailyRate: number;
  weeklyRate: number;
  monthlyRate: number;
  yearlyRate?: number;
  
  // Additional Costs
  driverCostPerDay?: number;
  fuelPolicy: 'full_to_full' | 'same_to_same' | 'prepaid';
  mileageLimit?: number; // km per day
  extraMileageCharge?: number; // per km
  
  // Discounts
  weekendDiscount?: number; // percentage
  longTermDiscount?: number; // percentage for weekly+
  
  // Deposits & Fees
  securityDeposit: number;
  cleaningFee?: number;
  lateFeePerHour?: number;
  
  // Insurance Options
  basicInsuranceIncluded: boolean;
  premiumInsuranceFee?: number;
  
  isActive: boolean;
  updatedAt: Date;
}

// ============ VEHICLE AVAILABILITY ============
export interface VehicleAvailability {
  id: string;
  vehicleId: string;
  
  date: Date;
  status: AvailabilityStatus;
  
  // Time slots for hourly rentals
  timeSlots?: {
    hour: number; // 0-23
    status: AvailabilityStatus;
    bookingId?: string;
  }[];
  
  bookingId?: string;
  note?: string;
  
  createdAt: Date;
  updatedAt: Date;
}

// ============ VEHICLE RENTAL BOOKING ============
export interface VehicleRentalBooking {
  id: string;
  vehicleId: string;
  ownerId: string;
  customerId: string;
  
  // Rental Period
  rentalType: RentalPeriodType;
  startDate: Date;
  endDate: Date;
  startTime?: string; // For hourly rentals
  endTime?: string;
  totalHours?: number;
  totalDays?: number;
  
  // Driver Option
  withDriver: boolean;
  driverId?: string;
  
  // Pickup/Drop-off
  pickupLocation: {
    address: string;
    city: string;
    coordinates?: { lat: number; lng: number };
  };
  dropoffLocation: {
    address: string;
    city: string;
    coordinates?: { lat: number; lng: number };
  };
  deliveryRequired: boolean;
  
  // Pricing Breakdown
  baseAmount: number;
  driverCost: number;
  deliveryFee: number;
  insuranceFee: number;
  otherFees: number;
  discount: number;
  platformFee: number; // 15% commission
  totalAmount: number;
  
  // Security Deposit
  securityDeposit: number;
  depositStatus: 'pending' | 'held' | 'released' | 'deducted';
  depositDeduction?: number;
  depositDeductionReason?: string;
  
  // Payment
  paymentStatus: 'pending' | 'partial' | 'paid' | 'refunded';
  paymentMethod?: 'card' | 'bank_transfer' | 'cash' | 'wallet';
  paymentTransactionId?: string;
  
  // Status
  status: BookingStatus;
  statusHistory: {
    status: BookingStatus;
    timestamp: Date;
    note?: string;
    updatedBy?: string;
  }[];
  
  // Vehicle Condition
  pickupCondition?: {
    mileage: number;
    fuelLevel: number;
    photos: string[];
    notes: string;
    recordedAt: Date;
  };
  returnCondition?: {
    mileage: number;
    fuelLevel: number;
    photos: string[];
    notes: string;
    recordedAt: Date;
  };
  
  // Review
  customerReview?: {
    rating: number;
    comment: string;
    createdAt: Date;
  };
  ownerReview?: {
    rating: number;
    comment: string;
    createdAt: Date;
  };
  
  // Customer Info
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  customerNationalId?: string;
  customerDrivingLicense?: string; // Required for self-drive
  
  // Special Requests
  specialRequests?: string;
  
  // Cancellation
  cancellationReason?: string;
  cancellationFee?: number;
  refundAmount?: number;
  
  // Timestamps
  createdAt: Date;
  updatedAt: Date;
  confirmedAt?: Date;
  startedAt?: Date;
  completedAt?: Date;
  cancelledAt?: Date;
}

// ============ VEHICLE REVIEW ============
export interface VehicleReview {
  id: string;
  vehicleId: string;
  bookingId: string;
  customerId: string;
  
  rating: number; // 1-5
  vehicleConditionRating: number;
  cleanlinessRating: number;
  valueForMoneyRating: number;
  ownerCommunicationRating: number;
  
  title?: string;
  comment: string;
  
  photos?: string[];
  
  ownerResponse?: {
    comment: string;
    respondedAt: Date;
  };
  
  isVerified: boolean;
  isPublic: boolean;
  
  createdAt: Date;
  updatedAt: Date;
}

// ============ OWNER EARNINGS ============
export interface OwnerEarnings {
  id: string;
  ownerId: string;
  bookingId: string;
  
  bookingAmount: number;
  platformFee: number;
  ownerEarnings: number;
  driverPayout?: number;
  
  payoutStatus: 'pending' | 'processing' | 'paid' | 'failed';
  payoutDate?: Date;
  payoutTransactionId?: string;
  
  createdAt: Date;
}

// ============ VEHICLE BATCH (Monthly Analytics) ============
export interface VehicleBatch {
  id: string;
  vehicleId: string;
  ownerId: string;
  
  month: number;
  year: number;
  
  totalBookings: number;
  totalRentalDays: number;
  totalDistance: number;
  totalRevenue: number;
  ownerEarnings: number;
  avgDailyRate: number;
  avgRating: number;
  onTimeReturnRate: number;
  damageIncidents: number;
  
  createdAt: Date;
}

// ============ SEARCH FILTERS ============
export interface VehicleSearchFilters {
  vehicleType?: VehicleType[];
  seatingCapacity?: { min?: number; max?: number };
  rentalPeriod?: RentalPeriodType;
  withDriver?: boolean;
  priceRange?: { min?: number; max?: number };
  amenities?: string[];
  ownerRating?: number;
  city?: string;
  startDate?: Date;
  endDate?: Date;
  sortBy?: 'price_low' | 'price_high' | 'rating' | 'popular' | 'newest';
}

// ============ DASHBOARD STATS ============
export interface OwnerDashboardStats {
  totalVehicles: number;
  activeVehicles: number;
  pendingBookings: number;
  activeBookings: number;
  completedBookings: number;
  totalEarnings: number;
  monthlyEarnings: number;
  pendingPayouts: number;
  avgRating: number;
  utilizationRate: number;
  upcomingExpiringDocuments: number;
}

export interface AdminDashboardStats {
  totalOwners: number;
  pendingOwnerVerifications: number;
  totalVehicles: number;
  pendingVehicleApprovals: number;
  activeBookings: number;
  totalBookings: number;
  totalRevenue: number;
  platformEarnings: number;
  expiringDocuments: number;
  disputedBookings: number;
}
