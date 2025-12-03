// B2B Portal Types

export interface B2BAgency {
  id: string;
  agencyName: string;
  email: string;
  phone: string;
  country: string;
  companySize?: string;
  taxId?: string;
  status: 'pending' | 'active' | 'suspended';
  emailVerified: boolean;
  subscriptionTier: 'free' | 'basic' | 'premium';
  totalBookings: number;
  totalRevenue: number;
  createdAt: Date;
}

export interface B2BTour {
  id: string;
  tourName: string;
  category: string;
  description: string;
  itinerary: B2BItineraryDay[];
  priceUSD: number;
  duration: string;
  maxCapacity: number;
  availableDates: string[];
  meetingPoint: string;
  departureTime: string;
  images: string[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface B2BItineraryDay {
  day: number;
  title: string;
  description: string;
  activities: string[];
  meals?: string[];
  accommodation?: string;
}

export interface B2BBooking {
  id: string;
  agencyId: string;
  tourId: string;
  tourName: string;
  guestCount: number;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  tourDate: string;
  originalPrice: number;
  discountPercentage: number;
  discount: number;
  finalPrice: number;
  specialRequests?: string;
  isAirportTransfer: boolean;
  isEmergency: boolean;
  status: 'pending' | 'confirmed' | 'cancelled';
  paymentStatus: 'pending' | 'paid' | 'refunded';
  documents: B2BDocument[];
  createdAt: Date;
  cancelledAt?: Date;
}

export interface B2BDocument {
  id: string;
  bookingId: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  downloadUrl: string;
  uploadedAt: Date;
}

export interface B2BLoginCredentials {
  email: string;
  password: string;
}

export interface B2BRegisterData {
  agencyName: string;
  email: string;
  phone: string;
  password: string;
  country: string;
  companySize?: string;
  taxId?: string;
}

export interface B2BAuthResponse {
  success: boolean;
  message: string;
  token?: string;
  agency?: Partial<B2BAgency>;
}

export interface B2BBookingRequest {
  tourId: string;
  guestCount: number;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  tourDate: string;
  specialRequests?: string;
  isAirportTransfer?: boolean;
  isEmergency?: boolean;
}

export interface B2BPriceCalculation {
  originalPrice: number;
  discountPercentage: number;
  discount: number;
  finalPrice: number;
}

// API Response types
export interface B2BApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
  total?: number;
  page?: number;
  limit?: number;
}
