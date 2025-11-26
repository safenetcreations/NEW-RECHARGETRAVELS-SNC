
// User Types
export interface User {
  id: string;
  email: string;
  phone: string;
  fullName: string;
  userType: 'customer' | 'driver' | 'admin';
  countryCode: string;
  isTourist: boolean;
  profileImageUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Location Types
export interface Location {
  lat: number;
  lng: number;
  address: string;
  placeId?: string;
  name?: string;
}

// Vehicle Types
export interface Vehicle {
  id: string;
  driverId: string;
  vehicleType: 'sedan' | 'suv' | 'van' | 'luxury';
  make: string;
  model: string;
  year: number;
  licensePlate: string;
  passengerCapacity: number;
  luggageCapacity: number;
  basePrice: number;
  pricePerKm: number;
  isActive: boolean;
  imageUrl?: string;
}

// Booking Types
export interface Booking {
  id: string;
  bookingNumber: string;
  userId: string;
  driverId?: string;
  pickupLocation: Location;
  dropoffLocation: Location;
  pickupDatetime: Date;
  passengerCount: number;
  luggageCount: number;
  vehicleType: Vehicle['vehicleType'];
  totalPrice: number;
  status: BookingStatus;
  specialRequirements?: string;
  flightNumber?: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  contactWhatsapp?: string;
  distance?: number;
  duration?: number;
  createdAt: Date;
  updatedAt: Date;
}

export type BookingStatus = 
  | 'pending'
  | 'confirmed'
  | 'in_progress'
  | 'completed'
  | 'cancelled';

// Review Types
export interface Review {
  id: string;
  bookingId: string;
  userId: string;
  driverId: string;
  overallRating: number;
  driverRating: number;
  vehicleRating: number;
  punctualityRating: number;
  cleanlinessRating: number;
  communicationRating: number;
  reviewText?: string;
  tripHighlights?: string[];
  wouldRecommend: boolean;
  isVerified: boolean;
  createdAt: Date;
}

// Tracking Types
export interface TrackingData {
  id: string;
  bookingId: string;
  driverId: string;
  latitude: number;
  longitude: number;
  heading?: number;
  speed?: number;
  accuracy?: number;
  timestamp: Date;
}

// Form Types
export interface BookingFormData {
  pickupLocation: {
    address: string;
    coordinates?: Location;
  };
  dropoffLocation: {
    address: string;
    coordinates?: Location;
  };
  pickupDate: string;
  pickupTime: string;
  passengerCount: number;
  luggageCount: number;
  vehicleType: Vehicle['vehicleType'];
  specialRequirements?: string;
  flightNumber?: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  contactWhatsapp?: string;
  returnTrip?: boolean;
  returnDate?: string;
  returnTime?: string;
}

// Price Calculation Types
export interface PriceCalculation {
  basePrice: number;
  distancePrice: number;
  vehicleTypeMultiplier: number;
  surcharges?: {
    nightSurcharge?: number;
    airportFee?: number;
    waitingTime?: number;
  };
  discounts?: {
    promoCode?: number;
    loyaltyDiscount?: number;
  };
  subtotal: number;
  taxes: number;
  total: number;
  currency: string;
  distance?: number;
}

// API Response Types
export interface ApiResponse<T> {
  data?: T;
  error?: {
    message: string;
    code: string;
  };
  meta?: {
    page?: number;
    pageSize?: number;
    total?: number;
  };
}

// Dashboard Types
export interface DashboardStats {
  totalBookings: number;
  activeBookings: number;
  completedBookings: number;
  totalRevenue: number;
  averageRating: number;
  totalDrivers: number;
  activeDrivers: number;
  totalVehicles: number;
}

// Filter Types
export interface BookingFilters {
  status?: BookingStatus[];
  dateRange?: {
    start: Date;
    end: Date;
  };
  vehicleType?: Vehicle['vehicleType'][];
  searchQuery?: string;
  userId?: string;
  driverId?: string;
}

// Notification Types
export interface Notification {
  id: string;
  userId: string;
  type: 'booking_confirmation' | 'driver_assigned' | 'pickup_reminder' | 'review_request';
  title: string;
  message: string;
  data?: Record<string, any>;
  read: boolean;
  createdAt: Date;
}
