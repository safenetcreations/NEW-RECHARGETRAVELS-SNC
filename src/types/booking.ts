
export interface TransportBookingData {
  pickup: string;
  dropoff: string;
  date: string;
  time: string;
  passengers: string;
}

export interface DayTourBookingData {
  destination: string;
  date: string;
  passengers: string;
  preferences: string;
}

export interface MultiDayBookingData {
  destinations: string;
  startDate: string;
  endDate: string;
  passengers: string;
  accommodation: string;
}

export interface BookingWidgetProps {
  onLocationsChange?: (locations: { pickup: string; dropoff: string }) => void;
}

export enum BookingType {
  TOUR = 'TOUR',
  TRANSPORT = 'TRANSPORT',
  HOTEL = 'HOTEL',
  PACKAGE = 'PACKAGE'
}

export interface Booking {
  id: string;
  userId: string;
  type: BookingType;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  startDate: Date;
  endDate?: Date;
  guests: number;
  specialRequests?: string;
  pickupLocation?: string;
  dropoffLocation?: string;
  tourId?: string;
  vehicleId?: string;
  driverId?: string;
  hotelId?: string;
  totalPrice: number;
  currency: string;
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  createdAt?: Date;
  updatedAt?: Date;
}
