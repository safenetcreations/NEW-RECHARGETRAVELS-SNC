
import { Location } from '../types';

export const calculateDistance = (from: Location, to: Location): number => {
  const R = 6371; // Earth's radius in km
  const dLat = toRad(to.lat - from.lat);
  const dLon = toRad(to.lng - from.lng);
  
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(from.lat)) * Math.cos(toRad(to.lat)) * 
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

const toRad = (deg: number): number => {
  return deg * (Math.PI / 180);
};

export const estimateDuration = (distance: number, traffic: 'low' | 'medium' | 'high' = 'medium'): number => {
  const speeds = {
    low: 50,    // km/h
    medium: 40, // km/h
    high: 25    // km/h
  };
  
  const speed = speeds[traffic];
  return Math.ceil((distance / speed) * 60); // minutes
};

export const getTrafficLevel = (dateTime: Date): 'low' | 'medium' | 'high' => {
  const hour = dateTime.getHours();
  const dayOfWeek = dateTime.getDay();
  
  // Weekend
  if (dayOfWeek === 0 || dayOfWeek === 6) {
    return hour >= 10 && hour <= 20 ? 'medium' : 'low';
  }
  
  // Weekday rush hours
  if ((hour >= 7 && hour <= 9) || (hour >= 17 && hour <= 19)) {
    return 'high';
  }
  
  // Weekday normal hours
  if (hour >= 10 && hour <= 16) {
    return 'medium';
  }
  
  return 'low';
};

export const generateBookingReference = (): string => {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `SLT${timestamp}${random}`;
};

export const isAirportTransfer = (pickupAddress: string, dropoffAddress: string): boolean => {
  const airportKeywords = ['airport', 'katunayake', 'ratmalana'];
  const pickup = pickupAddress.toLowerCase();
  const dropoff = dropoffAddress.toLowerCase();
  
  return airportKeywords.some(keyword => 
    pickup.includes(keyword) || dropoff.includes(keyword)
  );
};

export const getVehicleImage = (vehicleType: string): string => {
  const images = {
    sedan: '/images/vehicles/sedan.jpg',
    suv: '/images/vehicles/suv.jpg',
    van: '/images/vehicles/van.jpg',
    luxury: '/images/vehicles/luxury.jpg'
  };
  
  return images[vehicleType as keyof typeof images] || images.sedan;
};
