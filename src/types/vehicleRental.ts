// Vehicle Rental Platform Types

// ============ ENUMS ============
export type VehicleType = 'sedan' | 'suv' | 'van' | 'mini-coach' | 'luxury' | 'convertible' | 'hatchback' | 'pickup';
export type FuelType = 'petrol' | 'diesel' | 'hybrid' | 'electric';
export type TransmissionType = 'manual' | 'automatic';
export type OwnerVerificationStatus = 'incomplete' | 'pending_verification' | 'pending_admin_review' | 'verified' | 'rejected' | 'suspended';
export type VehicleStatus = 'draft' | 'pending_review' | 'active' | 'suspended' | 'maintenance' | 'inactive';
export type DocumentType = 'registration' | 'insurance' | 'roadworthiness' | 'tax' | 'pollution' | 'authorization_letter' | 'owner_id' | 'driving_license';
export type DocumentStatus = 'pending' | 'verified' | 'rejected' | 'expired';
export type BookingStatus = 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled' | 'disputed';
export type RentalPeriodType = 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly';
export type AvailabilityStatus = 'available' | 'booked' | 'maintenance' | 'personal' | 'blocked';

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
