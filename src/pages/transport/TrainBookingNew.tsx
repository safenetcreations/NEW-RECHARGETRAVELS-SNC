import { useState, useEffect, useRef, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { sendBookingNotifications, generateWhatsAppUrl, TrainBookingData } from '@/services/trainBookingNotificationService';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import ComprehensiveSEO from '@/components/seo/ComprehensiveSEO';
import { useToast } from '@/hooks/use-toast';
import {
  Train, Clock, MapPin, Calendar, Star, Users, ChevronRight, ChevronLeft,
  Camera, Info, AlertCircle, Phone, Mail, CheckCircle, Shield, Headphones,
  FileText, CreditCard, Ticket, ArrowRight, Loader2, Search, ArrowLeftRight,
  Mountain, Waves, Sunrise, Eye, Globe, Package
} from 'lucide-react';
import { db } from '@/lib/firebase';
import { collection, doc, getDoc, getDocs, addDoc, query, orderBy, where, Timestamp, runTransaction } from 'firebase/firestore';

// ==========================================
// TYPES
// ==========================================

interface TrainHeroSlide {
  id: string;
  image: string;
  title: string;
  subtitle: string;
  routeName?: string;
  isActive: boolean;
  order: number;
}

interface TrainSchedule {
  id: string;
  trainNumber: string;
  trainName: string;
  trainType: 'Express' | 'Intercity' | 'Slow' | 'Night Mail';
  departureStation: string;
  arrivalStation: string;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  distance: string;
  frequency: string;
  classes: {
    first: { available: boolean; price: number };
    secondReserved: { available: boolean; price: number };
    secondObservation: { available: boolean; price: number };
    third: { available: boolean; price: number };
  };
  amenities: string[];
  scenic: boolean;
  popular: boolean;
  isActive: boolean;
}

interface TrainBookingSettings {
  trustIndicators: {
    rating: string;
    bookings: string;
    support: string;
  };
  serviceFee: number;
  termsAndConditions: string[];
  cancellationPolicy: string;
}

// ==========================================
// STATIONS DATA - All Major Stations
// ==========================================

const stations = [
  // Colombo Area
  { id: 'colombo-fort', name: 'Colombo Fort', zone: 'Western' },
  { id: 'maradana', name: 'Maradana', zone: 'Western' },
  { id: 'mount-lavinia', name: 'Mount Lavinia', zone: 'Western' },
  // Hill Country
  { id: 'kandy', name: 'Kandy', zone: 'Central' },
  { id: 'peradeniya', name: 'Peradeniya Junction', zone: 'Central' },
  { id: 'nanu-oya', name: 'Nanu Oya (Nuwara Eliya)', zone: 'Hill Country' },
  { id: 'hatton', name: 'Hatton', zone: 'Hill Country' },
  { id: 'haputale', name: 'Haputale', zone: 'Hill Country' },
  { id: 'ella', name: 'Ella', zone: 'Hill Country' },
  { id: 'badulla', name: 'Badulla', zone: 'Hill Country' },
  { id: 'pattipola', name: 'Pattipola (Highest Station)', zone: 'Hill Country' },
  // Coastal Line
  { id: 'galle', name: 'Galle', zone: 'Southern' },
  { id: 'hikkaduwa', name: 'Hikkaduwa', zone: 'Southern' },
  { id: 'bentota', name: 'Bentota', zone: 'Southern' },
  { id: 'matara', name: 'Matara', zone: 'Southern' },
  { id: 'unawatuna', name: 'Unawatuna', zone: 'Southern' },
  // Northern Line
  { id: 'jaffna', name: 'Jaffna', zone: 'Northern' },
  { id: 'anuradhapura', name: 'Anuradhapura', zone: 'North Central' },
  { id: 'vavuniya', name: 'Vavuniya', zone: 'Northern' },
  { id: 'kilinochchi', name: 'Kilinochchi', zone: 'Northern' },
  // Eastern
  { id: 'trincomalee', name: 'Trincomalee', zone: 'Eastern' },
  { id: 'batticaloa', name: 'Batticaloa', zone: 'Eastern' },
  { id: 'polonnaruwa', name: 'Polonnaruwa', zone: 'Eastern' },
  // Other
  { id: 'negombo', name: 'Negombo', zone: 'Western' },
  { id: 'rambukkana', name: 'Rambukkana', zone: 'Central' },
  { id: 'kadugannawa', name: 'Kadugannawa', zone: 'Central' },
  { id: 'demodara', name: 'Demodara', zone: 'Hill Country' },
];

// ==========================================
// TRAIN SCHEDULES - Popular Routes
// ==========================================

const defaultTrainSchedules: TrainSchedule[] = [
  // Colombo to Kandy
  {
    id: 'intercity-1001',
    trainNumber: '1001',
    trainName: 'Intercity Express',
    trainType: 'Intercity',
    departureStation: 'colombo-fort',
    arrivalStation: 'kandy',
    departureTime: '06:55',
    arrivalTime: '09:30',
    duration: '2h 35m',
    distance: '120 km',
    frequency: 'Daily',
    classes: {
      first: { available: true, price: 800 },
      secondReserved: { available: true, price: 400 },
      secondObservation: { available: false, price: 0 },
      third: { available: true, price: 200 },
    },
    amenities: ['AC (1st Class)', 'Reserved Seats', 'Vendor Service'],
    scenic: true,
    popular: true,
    isActive: true,
  },
  {
    id: 'express-1003',
    trainNumber: '1003',
    trainName: 'Kandy Intercity',
    trainType: 'Express',
    departureStation: 'colombo-fort',
    arrivalStation: 'kandy',
    departureTime: '10:30',
    arrivalTime: '13:20',
    duration: '2h 50m',
    distance: '120 km',
    frequency: 'Daily',
    classes: {
      first: { available: true, price: 750 },
      secondReserved: { available: true, price: 380 },
      secondObservation: { available: false, price: 0 },
      third: { available: true, price: 180 },
    },
    amenities: ['Reserved Seats', 'Vendor Service'],
    scenic: true,
    popular: true,
    isActive: true,
  },
  {
    id: 'express-1005',
    trainNumber: '1005',
    trainName: 'Afternoon Express',
    trainType: 'Express',
    departureStation: 'colombo-fort',
    arrivalStation: 'kandy',
    departureTime: '15:35',
    arrivalTime: '18:30',
    duration: '2h 55m',
    distance: '120 km',
    frequency: 'Daily',
    classes: {
      first: { available: true, price: 750 },
      secondReserved: { available: true, price: 380 },
      secondObservation: { available: false, price: 0 },
      third: { available: true, price: 180 },
    },
    amenities: ['Reserved Seats', 'Vendor Service'],
    scenic: true,
    popular: false,
    isActive: true,
  },

  // Kandy to Ella (Most Scenic)
  {
    id: 'udarata-1005',
    trainNumber: '1005',
    trainName: 'Udarata Menike',
    trainType: 'Express',
    departureStation: 'kandy',
    arrivalStation: 'ella',
    departureTime: '08:47',
    arrivalTime: '15:45',
    duration: '6h 58m',
    distance: '120 km',
    frequency: 'Daily',
    classes: {
      first: { available: true, price: 1200 },
      secondReserved: { available: true, price: 600 },
      secondObservation: { available: true, price: 800 },
      third: { available: true, price: 300 },
    },
    amenities: ['Observation Car', 'Large Windows', 'Vendor Service', 'Most Scenic Route'],
    scenic: true,
    popular: true,
    isActive: true,
  },
  {
    id: 'podi-1015',
    trainNumber: '1015',
    trainName: 'Podi Menike',
    trainType: 'Express',
    departureStation: 'kandy',
    arrivalStation: 'ella',
    departureTime: '11:10',
    arrivalTime: '18:00',
    duration: '6h 50m',
    distance: '120 km',
    frequency: 'Daily',
    classes: {
      first: { available: true, price: 1200 },
      secondReserved: { available: true, price: 600 },
      secondObservation: { available: true, price: 800 },
      third: { available: true, price: 300 },
    },
    amenities: ['Observation Car', 'Large Windows', 'Vendor Service'],
    scenic: true,
    popular: true,
    isActive: true,
  },

  // Ella to Kandy (Return)
  {
    id: 'udarata-1006',
    trainNumber: '1006',
    trainName: 'Udarata Menike',
    trainType: 'Express',
    departureStation: 'ella',
    arrivalStation: 'kandy',
    departureTime: '06:40',
    arrivalTime: '13:30',
    duration: '6h 50m',
    distance: '120 km',
    frequency: 'Daily',
    classes: {
      first: { available: true, price: 1200 },
      secondReserved: { available: true, price: 600 },
      secondObservation: { available: true, price: 800 },
      third: { available: true, price: 300 },
    },
    amenities: ['Observation Car', 'Large Windows', 'Vendor Service'],
    scenic: true,
    popular: true,
    isActive: true,
  },
  {
    id: 'podi-1016',
    trainNumber: '1016',
    trainName: 'Podi Menike',
    trainType: 'Express',
    departureStation: 'ella',
    arrivalStation: 'kandy',
    departureTime: '09:20',
    arrivalTime: '16:10',
    duration: '6h 50m',
    distance: '120 km',
    frequency: 'Daily',
    classes: {
      first: { available: true, price: 1200 },
      secondReserved: { available: true, price: 600 },
      secondObservation: { available: true, price: 800 },
      third: { available: true, price: 300 },
    },
    amenities: ['Observation Car', 'Large Windows', 'Vendor Service'],
    scenic: true,
    popular: true,
    isActive: true,
  },

  // Colombo to Galle (Coastal)
  {
    id: 'ruhunu-8050',
    trainNumber: '8050',
    trainName: 'Ruhunu Kumari',
    trainType: 'Express',
    departureStation: 'colombo-fort',
    arrivalStation: 'galle',
    departureTime: '06:55',
    arrivalTime: '09:25',
    duration: '2h 30m',
    distance: '115 km',
    frequency: 'Daily',
    classes: {
      first: { available: true, price: 600 },
      secondReserved: { available: true, price: 320 },
      secondObservation: { available: false, price: 0 },
      third: { available: true, price: 180 },
    },
    amenities: ['Ocean Views', 'Reserved Seats', 'Vendor Service'],
    scenic: true,
    popular: true,
    isActive: true,
  },
  {
    id: 'coast-8054',
    trainNumber: '8054',
    trainName: 'Coastal Express',
    trainType: 'Express',
    departureStation: 'colombo-fort',
    arrivalStation: 'galle',
    departureTime: '15:45',
    arrivalTime: '18:20',
    duration: '2h 35m',
    distance: '115 km',
    frequency: 'Daily',
    classes: {
      first: { available: true, price: 600 },
      secondReserved: { available: true, price: 320 },
      secondObservation: { available: false, price: 0 },
      third: { available: true, price: 180 },
    },
    amenities: ['Sunset Views', 'Ocean Views', 'Vendor Service'],
    scenic: true,
    popular: true,
    isActive: true,
  },

  // Galle to Colombo (Return Coastal)
  {
    id: 'ruhunu-8051',
    trainNumber: '8051',
    trainName: 'Ruhunu Kumari',
    trainType: 'Express',
    departureStation: 'galle',
    arrivalStation: 'colombo-fort',
    departureTime: '06:30',
    arrivalTime: '09:05',
    duration: '2h 35m',
    distance: '115 km',
    frequency: 'Daily',
    classes: {
      first: { available: true, price: 600 },
      secondReserved: { available: true, price: 320 },
      secondObservation: { available: false, price: 0 },
      third: { available: true, price: 180 },
    },
    amenities: ['Ocean Views', 'Reserved Seats', 'Vendor Service'],
    scenic: true,
    popular: true,
    isActive: true,
  },

  // Colombo to Jaffna (Northern Line)
  {
    id: 'yal-4001',
    trainNumber: '4001',
    trainName: 'Yal Devi Express',
    trainType: 'Intercity',
    departureStation: 'colombo-fort',
    arrivalStation: 'jaffna',
    departureTime: '05:45',
    arrivalTime: '12:30',
    duration: '6h 45m',
    distance: '398 km',
    frequency: 'Daily',
    classes: {
      first: { available: true, price: 1400 },
      secondReserved: { available: true, price: 700 },
      secondObservation: { available: false, price: 0 },
      third: { available: true, price: 350 },
    },
    amenities: ['AC (1st Class)', 'Reserved Seats', 'Vendor Service', 'Long Distance'],
    scenic: false,
    popular: true,
    isActive: true,
  },
  {
    id: 'uttara-4003',
    trainNumber: '4003',
    trainName: 'Uttara Devi',
    trainType: 'Express',
    departureStation: 'colombo-fort',
    arrivalStation: 'jaffna',
    departureTime: '21:30',
    arrivalTime: '05:45',
    duration: '8h 15m',
    distance: '398 km',
    frequency: 'Daily',
    classes: {
      first: { available: true, price: 1400 },
      secondReserved: { available: true, price: 700 },
      secondObservation: { available: false, price: 0 },
      third: { available: true, price: 350 },
    },
    amenities: ['Night Train', 'Sleeper Berths', 'Reserved Seats'],
    scenic: false,
    popular: true,
    isActive: true,
  },

  // Jaffna to Colombo (Return)
  {
    id: 'yal-4002',
    trainNumber: '4002',
    trainName: 'Yal Devi Express',
    trainType: 'Intercity',
    departureStation: 'jaffna',
    arrivalStation: 'colombo-fort',
    departureTime: '06:00',
    arrivalTime: '12:45',
    duration: '6h 45m',
    distance: '398 km',
    frequency: 'Daily',
    classes: {
      first: { available: true, price: 1400 },
      secondReserved: { available: true, price: 700 },
      secondObservation: { available: false, price: 0 },
      third: { available: true, price: 350 },
    },
    amenities: ['AC (1st Class)', 'Reserved Seats', 'Vendor Service'],
    scenic: false,
    popular: true,
    isActive: true,
  },
  {
    id: 'uttara-4004',
    trainNumber: '4004',
    trainName: 'Uttara Devi',
    trainType: 'Express',
    departureStation: 'jaffna',
    arrivalStation: 'colombo-fort',
    departureTime: '20:00',
    arrivalTime: '04:30',
    duration: '8h 30m',
    distance: '398 km',
    frequency: 'Daily',
    classes: {
      first: { available: true, price: 1400 },
      secondReserved: { available: true, price: 700 },
      secondObservation: { available: false, price: 0 },
      third: { available: true, price: 350 },
    },
    amenities: ['Night Train', 'Sleeper Berths', 'Reserved Seats'],
    scenic: false,
    popular: true,
    isActive: true,
  },

  // Colombo to Badulla (Full Journey)
  {
    id: 'udarata-1005-full',
    trainNumber: '1005',
    trainName: 'Udarata Menike',
    trainType: 'Express',
    departureStation: 'colombo-fort',
    arrivalStation: 'badulla',
    departureTime: '05:55',
    arrivalTime: '16:30',
    duration: '10h 35m',
    distance: '292 km',
    frequency: 'Daily',
    classes: {
      first: { available: true, price: 1800 },
      secondReserved: { available: true, price: 900 },
      secondObservation: { available: true, price: 1200 },
      third: { available: true, price: 450 },
    },
    amenities: ['Complete Hill Country', 'Observation Car', 'Vendor Service', 'Epic Journey'],
    scenic: true,
    popular: true,
    isActive: true,
  },

  // Colombo to Trincomalee
  {
    id: 'trinco-6031',
    trainNumber: '6031',
    trainName: 'Trincomalee Express',
    trainType: 'Express',
    departureStation: 'colombo-fort',
    arrivalStation: 'trincomalee',
    departureTime: '06:05',
    arrivalTime: '12:50',
    duration: '6h 45m',
    distance: '257 km',
    frequency: 'Daily',
    classes: {
      first: { available: true, price: 1100 },
      secondReserved: { available: true, price: 550 },
      secondObservation: { available: false, price: 0 },
      third: { available: true, price: 280 },
    },
    amenities: ['Reserved Seats', 'Vendor Service'],
    scenic: false,
    popular: false,
    isActive: true,
  },

  // Colombo to Anuradhapura
  {
    id: 'rajarata-4011',
    trainNumber: '4011',
    trainName: 'Rajarata Rajini',
    trainType: 'Express',
    departureStation: 'colombo-fort',
    arrivalStation: 'anuradhapura',
    departureTime: '06:00',
    arrivalTime: '10:30',
    duration: '4h 30m',
    distance: '206 km',
    frequency: 'Daily',
    classes: {
      first: { available: true, price: 900 },
      secondReserved: { available: true, price: 450 },
      secondObservation: { available: false, price: 0 },
      third: { available: true, price: 230 },
    },
    amenities: ['Reserved Seats', 'Vendor Service', 'Historic Route'],
    scenic: false,
    popular: false,
    isActive: true,
  },

  // Nanu Oya to Ella (Short Scenic)
  {
    id: 'local-1020',
    trainNumber: '1020',
    trainName: 'Hill Country Local',
    trainType: 'Slow',
    departureStation: 'nanu-oya',
    arrivalStation: 'ella',
    departureTime: '09:30',
    arrivalTime: '13:00',
    duration: '3h 30m',
    distance: '65 km',
    frequency: 'Daily',
    classes: {
      first: { available: false, price: 0 },
      secondReserved: { available: true, price: 400 },
      secondObservation: { available: true, price: 600 },
      third: { available: true, price: 200 },
    },
    amenities: ['Best Photography', 'Nine Arch Bridge', 'Tea Plantations'],
    scenic: true,
    popular: true,
    isActive: true,
  },
];

// ==========================================
// DEFAULT HERO SLIDES
// ==========================================

const defaultHeroSlides: TrainHeroSlide[] = [
  {
    id: '1',
    image: 'https://images.unsplash.com/photo-1474487548417-781cb71495f3?auto=format&fit=crop&q=80&w=1920',
    title: 'Sri Lanka Railways',
    subtitle: 'Book Train Tickets Online',
    routeName: 'Official Partner',
    isActive: true,
    order: 1
  },
  {
    id: '2',
    image: 'https://images.unsplash.com/photo-1583417319070-4a69db38a482?auto=format&fit=crop&q=80&w=1920',
    title: 'Kandy to Ella',
    subtitle: 'World\'s Most Scenic Train Journey',
    routeName: 'Hill Country Express',
    isActive: true,
    order: 2
  },
  {
    id: '3',
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&q=80&w=1920',
    title: 'Colombo to Jaffna',
    subtitle: 'Northern Line Express - 6h 45m',
    routeName: 'Yal Devi',
    isActive: true,
    order: 3
  },
  {
    id: '4',
    image: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&q=80&w=1920',
    title: 'Coastal Express',
    subtitle: 'Colombo to Galle Along the Ocean',
    routeName: 'Ruhunu Kumari',
    isActive: true,
    order: 4
  },
  {
    id: '5',
    image: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=1920',
    title: 'Nine Arch Bridge',
    subtitle: 'Most Photographed Railway in Sri Lanka',
    routeName: 'Ella Heritage',
    isActive: true,
    order: 5
  }
];

// Default settings
const defaultSettings: TrainBookingSettings = {
  trustIndicators: {
    rating: '4.9/5',
    bookings: '15,000+',
    support: '24/7'
  },
  serviceFee: 500,
  termsAndConditions: [
    'Tickets are issued by Sri Lanka Railways',
    'E-ticket confirmation sent within 2 hours',
    'Arrive at station 30 minutes before departure',
    'Valid ID required for ticket collection',
    'Children under 3 travel free (no seat)',
    'Refund available up to 24 hours before departure',
  ],
  cancellationPolicy: 'Full refund if cancelled 24+ hours before departure. 50% refund if cancelled 12-24 hours before. No refund within 12 hours of departure.',
};

// Booking form schema
const bookingSchema = z.object({
  trainId: z.string().min(1, 'Please select a train'),
  travelDate: z.string().min(1, 'Travel date is required'),
  passengers: z.number().min(1).max(6),
  ticketClass: z.string().min(1, 'Please select ticket class'),
  customerName: z.string().min(2, 'Name is required'),
  customerEmail: z.string().email('Valid email is required'),
  customerPhone: z.string().min(10, 'Valid phone number is required'),
  passportNumber: z.string().optional(),
  specialRequests: z.string().optional(),
});

type BookingFormData = z.infer<typeof bookingSchema>;

// Generate booking reference
const generateBookingReference = async (): Promise<string> => {
  const counterRef = doc(db, 'counters', 'trainBookings');
  try {
    const newRef = await runTransaction(db, async (transaction) => {
      const counterDoc = await transaction.get(counterRef);
      let nextNumber = 1001;
      if (counterDoc.exists()) {
        nextNumber = (counterDoc.data().lastNumber || 1000) + 1;
      }
      transaction.set(counterRef, { lastNumber: nextNumber }, { merge: true });
      return `SLR${nextNumber.toString().padStart(6, '0')}`;
    });
    return newRef;
  } catch (error) {
    const prefix = 'SLR';
    const timestamp = Date.now().toString(36).toUpperCase();
    return `${prefix}${timestamp}`;
  }
};

// ==========================================
// MAIN COMPONENT
// ==========================================

const TrainBookingNew = () => {
  const { toast } = useToast();
  const navigate = useNavigate();

  // Hero slideshow state
  const [heroSlides, setHeroSlides] = useState<TrainHeroSlide[]>(defaultHeroSlides);
  const [currentSlide, setCurrentSlide] = useState(0);
  const slideIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Search state
  const [fromStation, setFromStation] = useState('');
  const [toStation, setToStation] = useState('');
  const [travelDate, setTravelDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  });
  const [searchResults, setSearchResults] = useState<TrainSchedule[]>([]);
  const [searching, setSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  // Booking state
  const [selectedTrain, setSelectedTrain] = useState<TrainSchedule | null>(null);
  const [selectedClass, setSelectedClass] = useState<string>('');
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Settings
  const [settings, setSettings] = useState<TrainBookingSettings>(defaultSettings);

  // Form
  const form = useForm<BookingFormData>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      passengers: 2,
    }
  });

  // Load data from Firebase
  useEffect(() => {
    const loadData = async () => {
      try {
        // Load hero slides
        const slidesQuery = query(
          collection(db, 'trainHeroSlides'),
          where('isActive', '==', true),
          orderBy('order', 'asc')
        );
        const slidesSnap = await getDocs(slidesQuery);
        if (!slidesSnap.empty) {
          setHeroSlides(slidesSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as TrainHeroSlide)));
        }

        // Load settings
        const settingsDoc = await getDoc(doc(db, 'cmsContent', 'trainBookingSettings'));
        if (settingsDoc.exists()) {
          setSettings({ ...defaultSettings, ...settingsDoc.data() as TrainBookingSettings });
        }
      } catch (error) {
        console.error('Error loading train booking data:', error);
      }
    };

    loadData();
  }, []);

  // Hero slideshow auto-advance
  useEffect(() => {
    slideIntervalRef.current = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % heroSlides.length);
    }, 5000);

    return () => {
      if (slideIntervalRef.current) {
        clearInterval(slideIntervalRef.current);
      }
    };
  }, [heroSlides.length]);

  const nextSlide = () => setCurrentSlide(prev => (prev + 1) % heroSlides.length);
  const prevSlide = () => setCurrentSlide(prev => (prev - 1 + heroSlides.length) % heroSlides.length);
  const goToSlide = (index: number) => setCurrentSlide(index);

  // Swap stations
  const swapStations = () => {
    const temp = fromStation;
    setFromStation(toStation);
    setToStation(temp);
  };

  // Search trains
  const searchTrains = () => {
    if (!fromStation || !toStation || !travelDate) {
      toast({
        title: 'Please fill all fields',
        description: 'Select departure, arrival stations and travel date',
        variant: 'destructive'
      });
      return;
    }

    setSearching(true);
    setHasSearched(true);

    // Simulate API call with timeout
    setTimeout(() => {
      const results = defaultTrainSchedules.filter(train =>
        train.departureStation === fromStation &&
        train.arrivalStation === toStation &&
        train.isActive
      );
      setSearchResults(results);
      setSearching(false);
    }, 1000);
  };

  // Get price for class
  const getClassPrice = (train: TrainSchedule, classType: string): number => {
    switch (classType) {
      case 'first': return train.classes.first.price;
      case 'secondReserved': return train.classes.secondReserved.price;
      case 'secondObservation': return train.classes.secondObservation.price;
      case 'third': return train.classes.third.price;
      default: return 0;
    }
  };

  // Get class display name
  const getClassDisplayName = (classType: string): string => {
    switch (classType) {
      case 'first': return '1st Class AC';
      case 'secondReserved': return '2nd Class Reserved';
      case 'secondObservation': return '2nd Class Observation';
      case 'third': return '3rd Class';
      default: return classType;
    }
  };

  // Select train for booking
  const handleSelectTrain = (train: TrainSchedule, classType: string) => {
    setSelectedTrain(train);
    setSelectedClass(classType);
    form.setValue('trainId', train.id);
    form.setValue('ticketClass', classType);
    form.setValue('travelDate', travelDate);
    setShowBookingForm(true);
    // Modal will overlay the page, no scroll needed
  };

  // Submit booking
  const handleSubmitBooking = async (data: BookingFormData) => {
    if (!selectedTrain) return;

    setSubmitting(true);

    try {
      const bookingReference = await generateBookingReference();
      const classPrice = getClassPrice(selectedTrain, selectedClass);
      const totalPrice = (classPrice * data.passengers) + settings.serviceFee;

      const fromStationName = stations.find(s => s.id === selectedTrain.departureStation)?.name || selectedTrain.departureStation;
      const toStationName = stations.find(s => s.id === selectedTrain.arrivalStation)?.name || selectedTrain.arrivalStation;

      const bookingData = {
        bookingReference,
        trainName: selectedTrain.trainName,
        trainNumber: selectedTrain.trainNumber,
        departureStation: fromStationName,
        arrivalStation: toStationName,
        departureTime: selectedTrain.departureTime,
        arrivalTime: selectedTrain.arrivalTime,
        travelDate: data.travelDate,
        selectedClass: getClassDisplayName(selectedClass),
        passengers: data.passengers,
        totalPrice: totalPrice,
        customerName: data.customerName,
        customerEmail: data.customerEmail,
        customerPhone: data.customerPhone,
        specialRequests: data.specialRequests || '',
        train: {
          id: selectedTrain.id,
          trainNumber: selectedTrain.trainNumber,
          trainName: selectedTrain.trainName,
          departureStation: fromStationName,
          arrivalStation: toStationName,
          departureTime: selectedTrain.departureTime,
          arrivalTime: selectedTrain.arrivalTime,
          duration: selectedTrain.duration,
        },
        customerInfo: {
          name: data.customerName,
          email: data.customerEmail,
          phone: data.customerPhone,
          passportNumber: data.passportNumber || '',
        },
        travelDetails: {
          travelDate: data.travelDate,
          passengers: data.passengers,
          ticketClass: getClassDisplayName(selectedClass),
          specialRequests: data.specialRequests || '',
        },
        pricing: {
          ticketPrice: classPrice,
          passengers: data.passengers,
          serviceFee: settings.serviceFee,
          totalPrice: totalPrice,
          currency: 'LKR',
        },
        status: 'confirmed',
        paymentStatus: 'pending',
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      };

      const docRef = await addDoc(collection(db, 'trainBookings'), bookingData);

      // Send notifications (email queue + admin notification)
      const notificationData: TrainBookingData = {
        id: docRef.id,
        bookingReference,
        trainName: selectedTrain.trainName,
        trainNumber: selectedTrain.trainNumber,
        departureStation: fromStationName,
        arrivalStation: toStationName,
        departureTime: selectedTrain.departureTime,
        arrivalTime: selectedTrain.arrivalTime,
        travelDate: data.travelDate,
        selectedClass: getClassDisplayName(selectedClass),
        passengers: data.passengers,
        totalPrice,
        customerName: data.customerName,
        customerEmail: data.customerEmail,
        customerPhone: data.customerPhone,
        specialRequests: data.specialRequests,
        status: 'confirmed'
      };

      // Queue notifications
      await sendBookingNotifications(notificationData);

      toast({
        title: '✅ Booking Confirmed!',
        description: 'Redirecting to your booking confirmation...',
        duration: 3000,
      });

      // Reset form state
      setShowBookingForm(false);
      setSelectedTrain(null);
      setSelectedClass('');
      form.reset();

      // Redirect to confirmation page
      setTimeout(() => {
        navigate(`/transport/train-booking/confirmation/${docRef.id}`);
      }, 500);

    } catch (error) {
      console.error('Error submitting booking:', error);
      toast({
        title: 'Booking Failed',
        description: 'There was an error. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setSubmitting(false);
    }
  };

  // Popular routes for quick search
  const popularRoutes = [
    { from: 'kandy', to: 'ella', label: 'Kandy → Ella', scenic: true },
    { from: 'ella', to: 'kandy', label: 'Ella → Kandy', scenic: true },
    { from: 'colombo-fort', to: 'kandy', label: 'Colombo → Kandy', scenic: true },
    { from: 'colombo-fort', to: 'galle', label: 'Colombo → Galle', scenic: true },
    { from: 'colombo-fort', to: 'jaffna', label: 'Colombo → Jaffna', scenic: false },
    { from: 'jaffna', to: 'colombo-fort', label: 'Jaffna → Colombo', scenic: false },
    { from: 'nanu-oya', to: 'ella', label: 'Nanu Oya → Ella', scenic: true },
    { from: 'colombo-fort', to: 'badulla', label: 'Colombo → Badulla', scenic: true },
  ];

  return (
    <>
      <ComprehensiveSEO
        title="Sri Lanka Train Tickets - Book Online | Sri Lanka Railways"
        description="Book Sri Lanka train tickets online. Colombo to Jaffna, Kandy to Ella, Coastal Line. Official booking partner with instant e-ticket confirmation."
        keywords={['Sri Lanka train tickets', 'Colombo Jaffna train', 'Kandy Ella train', 'book train Sri Lanka']}
        canonicalUrl="/transport/train-booking"
      />

      <Header />

      {/* Hero Section with Background */}
      <section className="relative min-h-[500px] md:min-h-[550px]">
        {/* Background Slideshow */}
        <div className="absolute inset-0 overflow-hidden">
          {heroSlides.map((slide, index) => (
            <div
              key={slide.id}
              className={`absolute inset-0 transition-opacity duration-1000 ${
                index === currentSlide ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url('${slide.image}')` }}
              />
              <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/70" />
            </div>
          ))}
        </div>

        {/* Hero Content - Static */}
        <div className="relative z-10 container mx-auto px-4 pt-24 pb-8">
          <div className="text-center text-white mb-6">
            <div className="inline-flex items-center gap-2 bg-blue-600/90 backdrop-blur-sm px-6 py-2 rounded-full mb-4">
              <Train className="w-5 h-5" />
              <span className="font-semibold">Sri Lanka Railways - Official Partner</span>
            </div>
            <h1 className="text-3xl md:text-5xl font-bold mb-2">
              {heroSlides[currentSlide]?.title || 'Book Train Tickets Online'}
            </h1>
            <p className="text-lg md:text-xl text-white/90">
              {heroSlides[currentSlide]?.subtitle || 'Scenic journeys across Sri Lanka'}
            </p>
          </div>

          {/* Trust Indicators */}
          <div className="flex flex-wrap justify-center gap-3 md:gap-4 mb-6 text-white text-sm">
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-lg">
              <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
              <span>{settings.trustIndicators.rating} Rating</span>
            </div>
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-lg">
              <Ticket className="w-4 h-4 text-emerald-400" />
              <span>{settings.trustIndicators.bookings} Booked</span>
            </div>
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-lg">
              <Shield className="w-4 h-4 text-blue-400" />
              <span>Secure</span>
            </div>
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-lg">
              <Headphones className="w-4 h-4 text-purple-400" />
              <span>{settings.trustIndicators.support}</span>
            </div>
          </div>
        </div>

        {/* Slide Navigation */}
        <button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-white/20 hover:bg-white/40 backdrop-blur-sm p-2 rounded-full text-white"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-white/20 hover:bg-white/40 backdrop-blur-sm p-2 rounded-full text-white"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-20 flex gap-2">
          {heroSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-2 h-2 rounded-full transition-all ${
                index === currentSlide ? 'bg-white w-6' : 'bg-white/50'
              }`}
            />
          ))}
        </div>
      </section>

      {/* STATIC SEARCH BOX - Always Visible */}
      <section className="bg-gray-100 py-8 -mt-4 relative z-30">
        <div className="container mx-auto px-4">
          <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-5xl mx-auto border border-gray-200">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Train className="w-6 h-6 text-blue-600" />
              Search Train Tickets
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
              {/* From Station */}
              <div className="md:col-span-4">
                <Label className="text-gray-700 font-semibold mb-2 block">From Station</Label>
                <select
                  value={fromStation}
                  onChange={(e) => setFromStation(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-gray-900 bg-white"
                >
                  <option value="">Select Departure</option>
                  {stations.map(station => (
                    <option key={station.id} value={station.id}>
                      {station.name} ({station.zone})
                    </option>
                  ))}
                </select>
              </div>

              {/* Swap Button */}
              <div className="md:col-span-1 flex justify-center">
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={swapStations}
                  className="rounded-full border-2 border-blue-200 hover:bg-blue-50 h-12 w-12"
                >
                  <ArrowLeftRight className="w-5 h-5 text-blue-600" />
                </Button>
              </div>

              {/* To Station */}
              <div className="md:col-span-4">
                <Label className="text-gray-700 font-semibold mb-2 block">To Station</Label>
                <select
                  value={toStation}
                  onChange={(e) => setToStation(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-gray-900 bg-white"
                >
                  <option value="">Select Arrival</option>
                  {stations.map(station => (
                    <option key={station.id} value={station.id}>
                      {station.name} ({station.zone})
                    </option>
                  ))}
                </select>
              </div>

              {/* Date */}
              <div className="md:col-span-2">
                <Label className="text-gray-700 font-semibold mb-2 block">Travel Date</Label>
                <input
                  type="date"
                  value={travelDate}
                  onChange={(e) => setTravelDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-gray-900 bg-white h-[50px]"
                  style={{ colorScheme: 'light' }}
                />
              </div>

              {/* Search Button */}
              <div className="md:col-span-1">
                <Button
                  onClick={searchTrains}
                  disabled={searching}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl h-[50px] font-semibold"
                >
                  {searching ? <Loader2 className="w-5 h-5 animate-spin" /> : <Search className="w-5 h-5" />}
                </Button>
              </div>
            </div>

            {/* Popular Routes */}
            <div className="mt-4 pt-4 border-t border-gray-100">
              <span className="text-sm text-gray-500 mr-2">Popular Routes:</span>
              <div className="flex flex-wrap gap-2 mt-2">
                {popularRoutes.map((route, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setFromStation(route.from);
                      setToStation(route.to);
                    }}
                    className="text-sm px-3 py-1.5 bg-blue-50 text-blue-700 rounded-full hover:bg-blue-100 transition-colors flex items-center gap-1 font-medium"
                  >
                    {route.scenic && <Mountain className="w-3 h-3" />}
                    {route.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Booking Form Modal */}
      <Dialog open={showBookingForm && !!selectedTrain} onOpenChange={(open) => {
        if (!open) {
          setShowBookingForm(false);
          setSelectedTrain(null);
        }
      }}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto p-0">
          {selectedTrain && (
            <>
              {/* Header */}
              <div className="bg-gradient-to-r from-blue-700 to-indigo-600 p-6 text-white sticky top-0 z-10">
                <div>
                  <DialogTitle className="text-2xl font-bold mb-1 text-white">Complete Your Booking</DialogTitle>
                  <p className="text-white/90">
                    {selectedTrain.trainName} ({selectedTrain.trainNumber})
                  </p>
                  <div className="flex items-center gap-3 mt-2 text-sm">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {stations.find(s => s.id === selectedTrain.departureStation)?.name}
                    </span>
                    <ArrowRight className="w-4 h-4" />
                    <span>{stations.find(s => s.id === selectedTrain.arrivalStation)?.name}</span>
                  </div>
                  <div className="flex items-center gap-4 mt-2 text-sm">
                    <span>{travelDate}</span>
                    <span>{selectedTrain.departureTime} - {selectedTrain.arrivalTime}</span>
                    <span>{selectedTrain.duration}</span>
                  </div>
                </div>
              </div>

              {/* Form */}
              <form onSubmit={form.handleSubmit(handleSubmitBooking)} className="p-6 space-y-6">
                <input type="hidden" {...form.register('trainId')} />
                <input type="hidden" {...form.register('ticketClass')} />
                <input type="hidden" {...form.register('travelDate')} />

                {/* Passenger Info */}
                <div>
                  <h3 className="font-semibold text-lg mb-4 flex items-center gap-2 text-gray-900">
                    <Users className="w-5 h-5 text-blue-600" />
                    Passenger Details
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-gray-700">Full Name *</Label>
                      <Input
                        {...form.register('customerName')}
                        placeholder="As per ID/Passport"
                        className="mt-1"
                      />
                      {form.formState.errors.customerName && (
                        <p className="text-red-500 text-sm mt-1">{form.formState.errors.customerName.message}</p>
                      )}
                    </div>
                    <div>
                      <Label className="text-gray-700">Email *</Label>
                      <Input
                        type="email"
                        {...form.register('customerEmail')}
                        placeholder="your@email.com"
                        className="mt-1"
                      />
                      {form.formState.errors.customerEmail && (
                        <p className="text-red-500 text-sm mt-1">{form.formState.errors.customerEmail.message}</p>
                      )}
                    </div>
                    <div>
                      <Label className="text-gray-700">Phone / WhatsApp *</Label>
                      <Input
                        type="tel"
                        {...form.register('customerPhone')}
                        placeholder="+94 XXX XXX XXX"
                        className="mt-1"
                      />
                      {form.formState.errors.customerPhone && (
                        <p className="text-red-500 text-sm mt-1">{form.formState.errors.customerPhone.message}</p>
                      )}
                    </div>
                    <div>
                      <Label className="text-gray-700">Passport Number (Optional)</Label>
                      <Input
                        {...form.register('passportNumber')}
                        placeholder="For international travelers"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label className="text-gray-700">Number of Passengers *</Label>
                      <Input
                        type="number"
                        {...form.register('passengers', { valueAsNumber: true })}
                        min="1"
                        max="6"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label className="text-gray-700">Special Requests</Label>
                      <Input
                        {...form.register('specialRequests')}
                        placeholder="Window seat, wheelchair access, etc."
                        className="mt-1"
                      />
                    </div>
                  </div>
                </div>

                {/* Price Summary */}
                <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                  <h4 className="font-semibold text-gray-900 mb-3">Price Summary</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between text-gray-700">
                      <span>{getClassDisplayName(selectedClass)} × {form.watch('passengers') || 1}</span>
                      <span>LKR {(getClassPrice(selectedTrain, selectedClass) * (form.watch('passengers') || 1)).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-gray-700">
                      <span>Booking Fee</span>
                      <span>LKR {settings.serviceFee.toLocaleString()}</span>
                    </div>
                    <div className="pt-2 border-t border-blue-200 flex justify-between font-bold text-lg text-blue-800">
                      <span>Total</span>
                      <span>LKR {((getClassPrice(selectedTrain, selectedClass) * (form.watch('passengers') || 1)) + settings.serviceFee).toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                {/* Submit */}
                <div className="flex gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setShowBookingForm(false);
                      setSelectedTrain(null);
                    }}
                    className="flex-1"
                    disabled={submitting}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1 bg-blue-600 hover:bg-blue-700"
                    disabled={submitting}
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <Ticket className="w-4 h-4 mr-2" />
                        Confirm & Pay
                      </>
                    )}
                  </Button>
                </div>

                <p className="text-xs text-gray-500 text-center">
                  E-ticket will be sent to your email within 2 hours
                </p>
              </form>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Search Results */}
      {hasSearched && (
        <section className="py-12 bg-gray-50">
          <div className="container mx-auto px-4">
            {searching ? (
              <div className="text-center py-16">
                <Loader2 className="w-12 h-12 text-blue-600 mx-auto mb-4 animate-spin" />
                <p className="text-xl text-gray-600">Searching available trains...</p>
              </div>
            ) : searchResults.length > 0 ? (
              <>
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">
                      {stations.find(s => s.id === fromStation)?.name} → {stations.find(s => s.id === toStation)?.name}
                    </h2>
                    <p className="text-gray-600">{searchResults.length} trains available on {travelDate}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  {searchResults.map(train => (
                    <Card key={train.id} className="bg-white overflow-hidden hover:shadow-lg transition-shadow">
                      <div className="p-6">
                        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                          {/* Train Info */}
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="text-xl font-bold text-gray-900">{train.trainName}</h3>
                              <Badge variant="outline" className="text-gray-600">#{train.trainNumber}</Badge>
                              <Badge className={train.trainType === 'Intercity' ? 'bg-blue-600' : train.trainType === 'Express' ? 'bg-emerald-600' : 'bg-gray-500'}>
                                {train.trainType}
                              </Badge>
                              {train.scenic && (
                                <Badge className="bg-purple-600 flex items-center gap-1">
                                  <Mountain className="w-3 h-3" /> Scenic
                                </Badge>
                              )}
                              {train.popular && (
                                <Badge className="bg-amber-500 flex items-center gap-1">
                                  <Star className="w-3 h-3" /> Popular
                                </Badge>
                              )}
                            </div>

                            {/* Time & Duration */}
                            <div className="flex items-center gap-6 text-lg">
                              <div className="text-center">
                                <p className="text-2xl font-bold text-gray-900">{train.departureTime}</p>
                                <p className="text-sm text-gray-500">{stations.find(s => s.id === train.departureStation)?.name}</p>
                              </div>
                              <div className="flex-1 flex items-center">
                                <div className="flex-1 border-t-2 border-dashed border-gray-300" />
                                <div className="px-3 text-sm text-gray-500 bg-white">
                                  <Clock className="w-4 h-4 inline mr-1" />
                                  {train.duration}
                                </div>
                                <div className="flex-1 border-t-2 border-dashed border-gray-300" />
                              </div>
                              <div className="text-center">
                                <p className="text-2xl font-bold text-gray-900">{train.arrivalTime}</p>
                                <p className="text-sm text-gray-500">{stations.find(s => s.id === train.arrivalStation)?.name}</p>
                              </div>
                            </div>

                            {/* Amenities */}
                            <div className="flex flex-wrap gap-2 mt-3">
                              {train.amenities.map((amenity, idx) => (
                                <span key={idx} className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded">
                                  {amenity}
                                </span>
                              ))}
                            </div>
                          </div>

                          {/* Class Selection */}
                          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 lg:gap-3">
                            {train.classes.first.available && (
                              <button
                                onClick={() => handleSelectTrain(train, 'first')}
                                className="p-3 border-2 border-gray-200 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition-all text-center group"
                              >
                                <p className="text-xs text-gray-500 mb-1">1st Class AC</p>
                                <p className="text-lg font-bold text-gray-900 group-hover:text-blue-600">
                                  LKR {train.classes.first.price.toLocaleString()}
                                </p>
                              </button>
                            )}
                            {train.classes.secondObservation.available && (
                              <button
                                onClick={() => handleSelectTrain(train, 'secondObservation')}
                                className="p-3 border-2 border-purple-200 bg-purple-50 rounded-xl hover:border-purple-500 transition-all text-center group relative"
                              >
                                <div className="absolute -top-2 -right-2 bg-purple-600 text-white text-xs px-2 py-0.5 rounded-full">Best Views</div>
                                <p className="text-xs text-gray-500 mb-1">2nd Observation</p>
                                <p className="text-lg font-bold text-purple-700">
                                  LKR {train.classes.secondObservation.price.toLocaleString()}
                                </p>
                              </button>
                            )}
                            {train.classes.secondReserved.available && (
                              <button
                                onClick={() => handleSelectTrain(train, 'secondReserved')}
                                className="p-3 border-2 border-gray-200 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition-all text-center group"
                              >
                                <p className="text-xs text-gray-500 mb-1">2nd Reserved</p>
                                <p className="text-lg font-bold text-gray-900 group-hover:text-blue-600">
                                  LKR {train.classes.secondReserved.price.toLocaleString()}
                                </p>
                              </button>
                            )}
                            {train.classes.third.available && (
                              <button
                                onClick={() => handleSelectTrain(train, 'third')}
                                className="p-3 border-2 border-gray-200 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition-all text-center group"
                              >
                                <p className="text-xs text-gray-500 mb-1">3rd Class</p>
                                <p className="text-lg font-bold text-gray-900 group-hover:text-blue-600">
                                  LKR {train.classes.third.price.toLocaleString()}
                                </p>
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </>
            ) : (
              <div className="text-center py-16 bg-white rounded-2xl">
                <Train className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-2">No Direct Trains Found</h3>
                <p className="text-gray-600 mb-6">
                  No trains available for {stations.find(s => s.id === fromStation)?.name} → {stations.find(s => s.id === toStation)?.name} on {travelDate}
                </p>
                <div className="flex flex-wrap justify-center gap-3">
                  <p className="text-sm text-gray-500">Try these popular routes:</p>
                  {popularRoutes.slice(0, 4).map((route, idx) => (
                    <Button
                      key={idx}
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setFromStation(route.from);
                        setToStation(route.to);
                        searchTrains();
                      }}
                    >
                      {route.label}
                    </Button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Popular Routes Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Popular Train Routes</h2>
            <p className="text-xl text-gray-600">Discover Sri Lanka's most scenic and popular railway journeys</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                from: 'Kandy',
                to: 'Ella',
                image: 'https://images.unsplash.com/photo-1474487548417-781cb71495f3?auto=format&fit=crop&q=80&w=400',
                duration: '6-7 hours',
                highlight: 'Nine Arch Bridge',
                scenic: true,
                price: 'LKR 300-1,200',
              },
              {
                from: 'Colombo',
                to: 'Jaffna',
                image: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&q=80&w=400',
                duration: '6h 45m',
                highlight: 'Northern Express',
                scenic: false,
                price: 'LKR 350-1,400',
              },
              {
                from: 'Colombo',
                to: 'Galle',
                image: 'https://images.unsplash.com/photo-1583417319070-4a69db38a482?auto=format&fit=crop&q=80&w=400',
                duration: '2.5 hours',
                highlight: 'Coastal Views',
                scenic: true,
                price: 'LKR 180-600',
              },
              {
                from: 'Colombo',
                to: 'Badulla',
                image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&q=80&w=400',
                duration: '10+ hours',
                highlight: 'Epic Journey',
                scenic: true,
                price: 'LKR 450-1,800',
              },
            ].map((route, idx) => (
              <Card key={idx} className="overflow-hidden hover:shadow-xl transition-all group cursor-pointer"
                onClick={() => {
                  const fromId = stations.find(s => s.name.includes(route.from))?.id || '';
                  const toId = stations.find(s => s.name.includes(route.to))?.id || '';
                  setFromStation(fromId);
                  setToStation(toId);
                  document.querySelector('.search-box')?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                <div className="relative h-48 overflow-hidden">
                  <img src={route.image} alt={`${route.from} to ${route.to}`} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                  {route.scenic && (
                    <Badge className="absolute top-3 right-3 bg-purple-600">
                      <Mountain className="w-3 h-3 mr-1" /> Scenic
                    </Badge>
                  )}
                  <div className="absolute bottom-3 left-3 right-3 text-white">
                    <h3 className="text-xl font-bold">{route.from} → {route.to}</h3>
                    <p className="text-sm text-white/80">{route.highlight}</p>
                  </div>
                </div>
                <CardContent className="p-4 bg-white">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2 text-gray-600">
                      <Clock className="w-4 h-4" />
                      <span className="text-sm">{route.duration}</span>
                    </div>
                    <span className="font-bold text-blue-600">{route.price}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Train Classes Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Train Classes</h2>
            <p className="text-xl text-gray-600">Choose the class that suits your journey</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            <Card className="bg-white">
              <CardHeader className="bg-gradient-to-r from-amber-500 to-amber-600 text-white">
                <CardTitle className="flex items-center gap-2">
                  <Star className="w-5 h-5" />
                  1st Class AC
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-500" />
                    Air-conditioned comfort
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-500" />
                    Reserved seating
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-500" />
                    Power outlets
                  </li>
                  <li className="flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-amber-500" />
                    Sealed windows (less views)
                  </li>
                </ul>
                <p className="mt-4 text-sm text-gray-500">Best for: Long journeys, business travelers</p>
              </CardContent>
            </Card>

            <Card className="bg-white ring-2 ring-purple-500">
              <CardHeader className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white">
                <CardTitle className="flex items-center gap-2">
                  <Eye className="w-5 h-5" />
                  2nd Class Observation
                </CardTitle>
                <Badge className="bg-white text-purple-700 mt-2">MOST POPULAR</Badge>
              </CardHeader>
              <CardContent className="p-6">
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-500" />
                    Extra-large windows
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-500" />
                    Best photography spots
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-500" />
                    Reserved seating
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-500" />
                    Scenic route only
                  </li>
                </ul>
                <p className="mt-4 text-sm text-gray-500">Best for: Kandy-Ella, photographers</p>
              </CardContent>
            </Card>

            <Card className="bg-white">
              <CardHeader className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
                <CardTitle className="flex items-center gap-2">
                  <Ticket className="w-5 h-5" />
                  2nd Class Reserved
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-500" />
                    Reserved seating
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-500" />
                    Opening windows
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-500" />
                    Good value
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-500" />
                    Available on all routes
                  </li>
                </ul>
                <p className="mt-4 text-sm text-gray-500">Best for: Budget travelers, all routes</p>
              </CardContent>
            </Card>

            <Card className="bg-white">
              <CardHeader className="bg-gradient-to-r from-gray-500 to-gray-600 text-white">
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  3rd Class
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-500" />
                    Lowest price
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-500" />
                    Local experience
                  </li>
                  <li className="flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-amber-500" />
                    Unreserved seating
                  </li>
                  <li className="flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-amber-500" />
                    Can be crowded
                  </li>
                </ul>
                <p className="mt-4 text-sm text-gray-500">Best for: Short trips, adventurous travelers</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Info Tabs */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <Tabs defaultValue="tips">
              <TabsList className="grid w-full grid-cols-3 mb-8">
                <TabsTrigger value="tips">Travel Tips</TabsTrigger>
                <TabsTrigger value="terms">Terms & Conditions</TabsTrigger>
                <TabsTrigger value="faq">FAQ</TabsTrigger>
              </TabsList>

              <TabsContent value="tips">
                <Card className="bg-white">
                  <CardContent className="p-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                          <Info className="w-5 h-5 text-blue-600" />
                          Essential Tips
                        </h4>
                        <ul className="space-y-2 text-gray-700">
                          <li>• Book 7-14 days ahead for observation cars</li>
                          <li>• Arrive 30 minutes before departure</li>
                          <li>• Bring snacks and water for long journeys</li>
                          <li>• Keep valuables with you at all times</li>
                          <li>• Trains can run 1-2 hours late</li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                          <Camera className="w-5 h-5 text-purple-600" />
                          Photography Tips
                        </h4>
                        <ul className="space-y-2 text-gray-700">
                          <li>• Right side for Kandy→Ella views</li>
                          <li>• Best light: 6:30-9:00 AM</li>
                          <li>• Use burst mode for bridges</li>
                          <li>• Get off at Demodara for Nine Arch Bridge</li>
                          <li>• Secure camera with strap near doors</li>
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="terms">
                <Card className="bg-white">
                  <CardContent className="p-6">
                    <ul className="space-y-3 text-gray-700">
                      {settings.termsAndConditions.map((term, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                          {term}
                        </li>
                      ))}
                    </ul>
                    <div className="mt-6 p-4 bg-amber-50 rounded-lg border border-amber-200">
                      <h4 className="font-semibold text-amber-800 mb-2 flex items-center gap-2">
                        <AlertCircle className="w-5 h-5" />
                        Cancellation Policy
                      </h4>
                      <p className="text-sm text-amber-700">{settings.cancellationPolicy}</p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="faq">
                <Card className="bg-white">
                  <CardContent className="p-6">
                    <Accordion type="single" collapsible>
                      <AccordionItem value="1">
                        <AccordionTrigger className="text-gray-900">How do I get my train ticket?</AccordionTrigger>
                        <AccordionContent className="text-gray-600">
                          After booking, you'll receive an e-ticket via email within 2 hours. Show this e-ticket (printed or on phone) at the station along with your ID.
                        </AccordionContent>
                      </AccordionItem>
                      <AccordionItem value="2">
                        <AccordionTrigger className="text-gray-900">Can I book tickets for same-day travel?</AccordionTrigger>
                        <AccordionContent className="text-gray-600">
                          We recommend booking at least 1 day in advance. Same-day bookings are possible but subject to availability. For scenic routes, book 1-2 weeks ahead.
                        </AccordionContent>
                      </AccordionItem>
                      <AccordionItem value="3">
                        <AccordionTrigger className="text-gray-900">What if I miss my train?</AccordionTrigger>
                        <AccordionContent className="text-gray-600">
                          Tickets are valid only for the booked train. If you miss it, you'll need to purchase a new ticket at the station for the next available train.
                        </AccordionContent>
                      </AccordionItem>
                      <AccordionItem value="4">
                        <AccordionTrigger className="text-gray-900">Are trains air-conditioned?</AccordionTrigger>
                        <AccordionContent className="text-gray-600">
                          Only 1st Class carriages are air-conditioned. 2nd and 3rd class have opening windows which many prefer for scenic routes to enjoy the fresh mountain air.
                        </AccordionContent>
                      </AccordionItem>
                      <AccordionItem value="5">
                        <AccordionTrigger className="text-gray-900">How early should I arrive at the station?</AccordionTrigger>
                        <AccordionContent className="text-gray-600">
                          Arrive at least 30 minutes before departure. For major stations like Colombo Fort or Kandy, arrive 45 minutes early during peak hours.
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-700 to-indigo-700">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Book Your Train Journey?
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Secure your seats now. Instant confirmation, e-tickets sent to your email.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              size="lg"
              className="bg-white text-blue-700 hover:bg-gray-100 px-8 py-6 text-lg"
            >
              <Ticket className="w-5 h-5 mr-2" />
              Search & Book Trains
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white/10 px-8 py-6 text-lg"
              onClick={() => window.open('https://wa.me/94777123456', '_blank')}
            >
              <Phone className="w-5 h-5 mr-2" />
              Need Help? WhatsApp
            </Button>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-12 bg-gray-900 text-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 text-center max-w-4xl mx-auto">
            <div className="flex flex-col items-center">
              <Phone className="w-8 h-8 mb-3 text-blue-400" />
              <h3 className="font-semibold mb-2">Call Us</h3>
              <p className="text-gray-300">+94 77 712 3456</p>
              <p className="text-sm text-gray-400">24/7 Support</p>
            </div>
            <div className="flex flex-col items-center">
              <Mail className="w-8 h-8 mb-3 text-blue-400" />
              <h3 className="font-semibold mb-2">Email Us</h3>
              <p className="text-gray-300">trains@rechargetravels.com</p>
              <p className="text-sm text-gray-400">Quick response</p>
            </div>
            <div className="flex flex-col items-center">
              <Globe className="w-8 h-8 mb-3 text-blue-400" />
              <h3 className="font-semibold mb-2">Visit Website</h3>
              <p className="text-gray-300">www.rechargetravels.com</p>
              <p className="text-sm text-gray-400">More experiences</p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
};

export default TrainBookingNew;
