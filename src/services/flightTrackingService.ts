/**
 * Flight Tracking Service
 * Integrates with AviationStack API for real-time flight data
 *
 * API Documentation: https://aviationstack.com/documentation
 * Free tier: 100 requests/month
 */

import type { FlightInfo } from './airportTransferService';

// API Configuration
// Store your API key in environment variables or Firebase config
const AVIATION_STACK_API_KEY = import.meta.env.VITE_AVIATION_STACK_API_KEY || '';
const AVIATION_STACK_BASE_URL = 'https://api.aviationstack.com/v1';

// Cache for flight results (5 minute TTL)
const flightCache = new Map<string, { data: FlightInfo | null; timestamp: number }>();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

// Sri Lankan airlines and common routes
export const COMMON_AIRLINES: { [code: string]: string } = {
  'UL': 'SriLankan Airlines',
  'EK': 'Emirates',
  'QR': 'Qatar Airways',
  'SQ': 'Singapore Airlines',
  'AI': 'Air India',
  'CX': 'Cathay Pacific',
  'TG': 'Thai Airways',
  'MH': 'Malaysia Airlines',
  'BA': 'British Airways',
  'LH': 'Lufthansa',
  'FZ': 'Flydubai',
  'WY': 'Oman Air',
  'GF': 'Gulf Air',
  'KU': 'Kuwait Airways',
  '9W': 'Jet Airways',
  'IT': 'Tigerair Taiwan',
};

// Get airline name from flight number
export const getAirlineFromFlightNumber = (flightNumber: string): string => {
  const airlineCode = flightNumber.substring(0, 2).toUpperCase();
  return COMMON_AIRLINES[airlineCode] || 'Unknown Airline';
};

// Parse flight number format
export const parseFlightNumber = (input: string): string => {
  // Remove spaces and convert to uppercase
  const cleaned = input.replace(/\s+/g, '').toUpperCase();
  // Match pattern: 2 letters + numbers (e.g., UL504, EK650)
  const match = cleaned.match(/^([A-Z]{2})(\d{1,4})$/);
  if (match) {
    return `${match[1]}${match[2]}`;
  }
  return cleaned;
};

// Debounce helper for search
let searchTimeout: ReturnType<typeof setTimeout> | null = null;

export const debounceFlightSearch = (
  flightNumber: string,
  callback: (result: FlightInfo | null) => void,
  delay: number = 500
): void => {
  if (searchTimeout) {
    clearTimeout(searchTimeout);
  }
  searchTimeout = setTimeout(async () => {
    const result = await searchFlight(flightNumber);
    callback(result);
  }, delay);
};

/**
 * Search for flight information using AviationStack API
 */
export const searchFlight = async (flightNumber: string): Promise<FlightInfo | null> => {
  const parsedFlight = parseFlightNumber(flightNumber);

  if (parsedFlight.length < 3) {
    return null;
  }

  // Check cache first
  const cached = flightCache.get(parsedFlight);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data;
  }

  // If no API key, return mock data
  if (!AVIATION_STACK_API_KEY) {
    console.warn('No AviationStack API key configured. Using mock data.');
    return getMockFlightData(parsedFlight);
  }

  try {
    const response = await fetch(
      `${AVIATION_STACK_BASE_URL}/flights?access_key=${AVIATION_STACK_API_KEY}&flight_iata=${parsedFlight}`
    );

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();

    if (data.error) {
      console.error('AviationStack API error:', data.error);
      return getMockFlightData(parsedFlight);
    }

    if (!data.data || data.data.length === 0) {
      // Flight not found, cache null result
      flightCache.set(parsedFlight, { data: null, timestamp: Date.now() });
      return null;
    }

    // Get the most relevant flight (arriving at CMB or JAF)
    const sriLankaFlights = data.data.filter((f: any) =>
      f.arrival?.iata === 'CMB' || f.arrival?.iata === 'JAF'
    );
    const flight = sriLankaFlights[0] || data.data[0];

    const flightInfo: FlightInfo = {
      flightNumber: flight.flight?.iata || parsedFlight,
      airline: flight.airline?.name || getAirlineFromFlightNumber(parsedFlight),
      origin: flight.departure?.iata || '',
      originCity: flight.departure?.airport || '',
      destination: flight.arrival?.iata || 'CMB',
      destinationCity: flight.arrival?.airport || 'Bandaranaike International Airport',
      scheduledArrival: flight.arrival?.scheduled || '',
      estimatedArrival: flight.arrival?.estimated || flight.arrival?.scheduled || '',
      actualArrival: flight.arrival?.actual || undefined,
      status: mapFlightStatus(flight.flight_status),
      terminal: flight.arrival?.terminal || undefined,
      gate: flight.arrival?.gate || undefined,
      delayMinutes: calculateDelayMinutes(flight.arrival?.scheduled, flight.arrival?.estimated)
    };

    // Cache the result
    flightCache.set(parsedFlight, { data: flightInfo, timestamp: Date.now() });

    return flightInfo;
  } catch (error) {
    console.error('Flight search error:', error);
    // Return mock data on error
    return getMockFlightData(parsedFlight);
  }
};

// Map API status to our status type
const mapFlightStatus = (status: string): FlightInfo['status'] => {
  const statusMap: { [key: string]: FlightInfo['status'] } = {
    'scheduled': 'scheduled',
    'active': 'en-route',
    'landed': 'landed',
    'cancelled': 'cancelled',
    'diverted': 'delayed',
    'delayed': 'delayed',
  };
  return statusMap[status?.toLowerCase()] || 'scheduled';
};

// Calculate delay in minutes
const calculateDelayMinutes = (scheduled?: string, estimated?: string): number | undefined => {
  if (!scheduled || !estimated) return undefined;
  try {
    const scheduledTime = new Date(scheduled).getTime();
    const estimatedTime = new Date(estimated).getTime();
    const diffMinutes = Math.round((estimatedTime - scheduledTime) / 60000);
    return diffMinutes > 0 ? diffMinutes : undefined;
  } catch {
    return undefined;
  }
};

/**
 * Mock flight data for development/testing when API key is not available
 */
const getMockFlightData = (flightNumber: string): FlightInfo | null => {
  const airline = getAirlineFromFlightNumber(flightNumber);

  // Common flight routes to Sri Lanka
  const mockFlights: { [key: string]: Partial<FlightInfo> } = {
    'UL504': { origin: 'SIN', originCity: 'Singapore Changi', scheduledArrival: '06:30', status: 'on-time' },
    'UL306': { origin: 'BOM', originCity: 'Mumbai', scheduledArrival: '11:00', status: 'on-time' },
    'UL882': { origin: 'LHR', originCity: 'London Heathrow', scheduledArrival: '14:15', status: 'on-time' },
    'EK650': { origin: 'DXB', originCity: 'Dubai', scheduledArrival: '09:45', status: 'on-time' },
    'EK652': { origin: 'DXB', originCity: 'Dubai', scheduledArrival: '15:30', status: 'delayed', delayMinutes: 25 },
    'QR668': { origin: 'DOH', originCity: 'Doha Hamad', scheduledArrival: '10:20', status: 'on-time' },
    'SQ468': { origin: 'SIN', originCity: 'Singapore Changi', scheduledArrival: '16:00', status: 'scheduled' },
    'AI273': { origin: 'MAA', originCity: 'Chennai', scheduledArrival: '12:30', status: 'on-time' },
    'FZ557': { origin: 'DXB', originCity: 'Dubai', scheduledArrival: '05:15', status: 'on-time' },
    'MH179': { origin: 'KUL', originCity: 'Kuala Lumpur', scheduledArrival: '18:45', status: 'scheduled' },
  };

  const mockData = mockFlights[flightNumber];

  // Generate arrival time for today
  const today = new Date();
  const getArrivalDateTime = (time: string): string => {
    const [hours, minutes] = time.split(':');
    today.setHours(parseInt(hours), parseInt(minutes), 0, 0);
    return today.toISOString();
  };

  if (mockData) {
    return {
      flightNumber,
      airline,
      origin: mockData.origin || '',
      originCity: mockData.originCity || '',
      destination: 'CMB',
      destinationCity: 'Bandaranaike International Airport',
      scheduledArrival: getArrivalDateTime(mockData.scheduledArrival || '12:00'),
      estimatedArrival: mockData.delayMinutes
        ? getArrivalDateTime(addMinutesToTime(mockData.scheduledArrival || '12:00', mockData.delayMinutes))
        : getArrivalDateTime(mockData.scheduledArrival || '12:00'),
      status: mockData.status || 'scheduled',
      terminal: 'T1',
      delayMinutes: mockData.delayMinutes
    };
  }

  // Return generic mock for unknown flight numbers
  return {
    flightNumber,
    airline,
    origin: '---',
    originCity: 'International',
    destination: 'CMB',
    destinationCity: 'Bandaranaike International Airport',
    scheduledArrival: getArrivalDateTime('12:00'),
    estimatedArrival: getArrivalDateTime('12:00'),
    status: 'scheduled',
    terminal: 'T1'
  };
};

// Helper to add minutes to time string
const addMinutesToTime = (time: string, minutes: number): string => {
  const [h, m] = time.split(':').map(Number);
  const totalMinutes = h * 60 + m + minutes;
  const newH = Math.floor(totalMinutes / 60) % 24;
  const newM = totalMinutes % 60;
  return `${newH.toString().padStart(2, '0')}:${newM.toString().padStart(2, '0')}`;
};

/**
 * Format arrival time for display
 */
export const formatArrivalTime = (isoString: string): string => {
  try {
    const date = new Date(isoString);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  } catch {
    return isoString;
  }
};

/**
 * Get status badge color
 */
export const getStatusColor = (status: FlightInfo['status']): string => {
  const colors: { [key: string]: string } = {
    'on-time': 'bg-green-100 text-green-700',
    'scheduled': 'bg-blue-100 text-blue-700',
    'en-route': 'bg-blue-100 text-blue-700',
    'landed': 'bg-green-100 text-green-700',
    'delayed': 'bg-amber-100 text-amber-700',
    'cancelled': 'bg-red-100 text-red-700',
  };
  return colors[status] || 'bg-gray-100 text-gray-700';
};

/**
 * Get human-readable status text
 */
export const getStatusText = (status: FlightInfo['status'], delayMinutes?: number): string => {
  if (status === 'delayed' && delayMinutes) {
    return `Delayed ${delayMinutes} min`;
  }
  const statusText: { [key: string]: string } = {
    'on-time': 'On Time',
    'scheduled': 'Scheduled',
    'en-route': 'In Flight',
    'landed': 'Landed',
    'delayed': 'Delayed',
    'cancelled': 'Cancelled',
  };
  return statusText[status] || status;
};

export default {
  searchFlight,
  debounceFlightSearch,
  parseFlightNumber,
  getAirlineFromFlightNumber,
  formatArrivalTime,
  getStatusColor,
  getStatusText,
  COMMON_AIRLINES,
};
