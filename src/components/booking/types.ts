
export interface TourData {
  id: string;
  name: string;
  price: number;
  duration: string;
  description: string;
  features: string[];
}

export interface EnhancedBookingFormData {
  // Basic info
  name: string;
  email: string;
  phone: string;
  guests: string;
  
  // Trip details
  startDate: string;
  endDate: string;
  budget: string;
  interests: string[];
  
  // Transport details
  pickup: string;
  destination: string;
  
  // Preferences
  accommodation: string;
  dietaryRestrictions: string;
  message: string;
  
  // Payment details
  paymentMethod?: 'wallet' | 'card';
}

export interface EnhancedBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  type?: 'tour' | 'transport' | 'custom';
  itemTitle?: string;
  tourData?: TourData;
  preSelectedService?: string;
  experienceType?: string;
  experienceDetails?: {
    name: string;
    price: string | number;
    duration: string;
    image: string;
  };
}
