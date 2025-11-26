
import { BookingFormData } from '../types';

export const validateBookingForm = (data: BookingFormData): string[] => {
  const errors: string[] = [];

  // Validate locations
  if (!data.pickupLocation?.address) {
    errors.push('Pickup location is required');
  }
  if (!data.dropoffLocation?.address) {
    errors.push('Drop-off location is required');
  }

  // Validate same location
  if (data.pickupLocation?.address === data.dropoffLocation?.address) {
    errors.push('Pickup and drop-off locations cannot be the same');
  }

  // Validate date and time
  if (data.pickupDate && data.pickupTime) {
    const pickupDateTime = new Date(`${data.pickupDate}T${data.pickupTime}`);
    const now = new Date();
    
    if (pickupDateTime < now) {
      errors.push('Pickup date and time must be in the future');
    }
  }

  // Validate passenger and luggage count
  const vehicleCapacity = getVehicleCapacity(data.vehicleType);
  if (data.passengerCount > vehicleCapacity.passengers) {
    errors.push(`Selected vehicle can only accommodate ${vehicleCapacity.passengers} passengers`);
  }
  if (data.luggageCount > vehicleCapacity.luggage) {
    errors.push(`Selected vehicle can only accommodate ${vehicleCapacity.luggage} pieces of luggage`);
  }

  // Validate return trip
  if (data.returnTrip) {
    if (!data.returnDate || !data.returnTime) {
      errors.push('Return date and time are required for return trip');
    } else if (data.pickupDate && data.pickupTime) {
      const pickupDateTime = new Date(`${data.pickupDate}T${data.pickupTime}`);
      const returnDateTime = new Date(`${data.returnDate}T${data.returnTime}`);
      if (returnDateTime <= pickupDateTime) {
        errors.push('Return trip must be after the initial trip');
      }
    }
  }

  // Validate contact information
  if (data.contactEmail && !isValidEmail(data.contactEmail)) {
    errors.push('Invalid email address');
  }
  if (data.contactPhone && !isValidPhone(data.contactPhone)) {
    errors.push('Invalid phone number');
  }

  return errors;
};

export const validateStep = (step: number, data: Partial<BookingFormData>): string[] => {
  const errors: string[] = [];

  switch (step) {
    case 1:
      if (!data.pickupLocation?.address) errors.push('Pickup location is required');
      if (!data.dropoffLocation?.address) errors.push('Drop-off location is required');
      if (!data.pickupDate) errors.push('Pickup date is required');
      if (!data.pickupTime) errors.push('Pickup time is required');
      break;
      
    case 2:
      if (!data.passengerCount || data.passengerCount < 1) errors.push('At least 1 passenger is required');
      if (!data.vehicleType) errors.push('Vehicle type is required');
      break;
      
    case 3:
      if (!data.contactName) errors.push('Contact name is required');
      if (!data.contactEmail) errors.push('Contact email is required');
      if (!data.contactPhone) errors.push('Contact phone is required');
      break;
  }

  return errors;
};

export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const isValidPhone = (phone: string): boolean => {
  const phoneRegex = /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/;
  return phoneRegex.test(phone);
};

export const getVehicleCapacity = (type: string) => {
  const capacities = {
    sedan: { passengers: 4, luggage: 3 },
    suv: { passengers: 6, luggage: 5 },
    van: { passengers: 8, luggage: 8 },
    luxury: { passengers: 4, luggage: 4 }
  };
  return capacities[type as keyof typeof capacities] || { passengers: 4, luggage: 3 };
};
