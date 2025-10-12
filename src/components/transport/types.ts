
import { z } from 'zod';

export const transportFormSchema = z.object({
  serviceType: z.enum(['airport-pickup', 'airport-dropoff', 'hotel-transfer', 'custom-journey']),
  pickupLocation: z.string().min(3, 'Pickup location is required.'),
  dropoffLocation: z.string().min(3, 'Drop-off location is required.'),
  pickupDate: z.string().min(1, 'Pickup date is required.'),
  pickupTime: z.string().min(1, 'Pickup time is required.'),
  passengers: z.string().min(1),
  vehicleType: z.string(),
  flightNumber: z.string().optional(),
  childSeat: z.boolean().default(false),
  specialRequests: z.string().optional(),
  contactName: z.string().min(2, 'Name is required.'),
  contactEmail: z.string().email('Invalid email address.'),
  contactPhone: z.string().min(10, 'A valid phone number is required.')
});

export type TransportFormValues = z.infer<typeof transportFormSchema>;

export const vehicleTypes = [
  { id: 'sedan', name: 'Sedan (1-2 passengers)' },
  { id: 'minivan', name: 'Minivan (3-6 passengers)' },
  { id: 'hiace', name: 'HIACE HIGH ROOF VAN (7-9 passengers)' },
  { id: 'minibus', name: 'Mini Bus (10-15 passengers)' },
  { id: 'minicoach', name: 'Mini Coach (16+ passengers)' }
];

export interface TransportBookingFormProps {
  onLocationsChange?: (locations: { pickup: string; dropoff: string }) => void;
}
