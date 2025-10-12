
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
