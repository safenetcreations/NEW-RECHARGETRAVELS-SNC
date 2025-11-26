/**
 * RECHARGE TRAVELS - useQuoteCalculator Hook
 * ===========================================
 * React hook for managing quote calculator state
 */

import { useState, useCallback, useMemo } from 'react';
import QuoteCalculator, {
  getRecommendedVehicle,
  getSuggestedDuration,
  validateTripDetails,
  getQuickQuote,
  TripDetails,
  Quote,
} from '@/utils/quoteCalculatorLogic';
import { VEHICLES, ACCOMMODATION_TIERS, CURRENCY_RATES, Vehicle } from '@/config/quoteCalculatorPricing';

const initialTripState: TripDetails = {
  adults: 2,
  children: 0,
  childrenAges: [],
  startDate: '',
  endDate: '',
  days: 0,
  nights: 0,
  destinations: [],
  vehicle: 'sedan',
  airportPickup: true,
  airportDropoff: true,
  accommodationTier: 'standard',
  rooms: 0,
  activities: [],
  services: [],
  isReturningCustomer: false,
  specialRequests: '',
  currency: 'USD',
};

interface QuickEstimate {
  low: number;
  mid: number;
  high: number;
  perPerson: number;
  perDay: number;
}

interface UseQuoteCalculatorReturn {
  trip: TripDetails;
  quote: Quote | null;
  isCalculating: boolean;
  errors: string[];
  step: number;
  quickEstimate: QuickEstimate | null;
  recommendedVehicle: Vehicle | null;
  suggestedDays: number;
  isStepComplete: boolean;
  updateTrip: (field: keyof TripDetails, value: unknown) => void;
  updateTripBatch: (updates: Partial<TripDetails>) => void;
  toggleDestination: (destinationId: string) => void;
  reorderDestinations: (fromIndex: number, toIndex: number) => void;
  toggleActivity: (activityId: string) => void;
  toggleService: (serviceId: string) => void;
  calculateQuote: () => Quote | null;
  resetForm: () => void;
  nextStep: () => void;
  prevStep: () => void;
  goToStep: (stepNum: number) => void;
  formatPrice: (amount: number) => string;
  convertCurrency: (amountUSD: number) => number;
}

export const useQuoteCalculator = (): UseQuoteCalculatorReturn => {
  const [trip, setTrip] = useState<TripDetails>(initialTripState);
  const [quote, setQuote] = useState<Quote | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const [step, setStep] = useState(1);

  const updateTrip = useCallback((field: keyof TripDetails, value: unknown) => {
    setTrip(prev => {
      const updated = { ...prev, [field]: value } as TripDetails;

      if (field === 'startDate' || field === 'days') {
        if (updated.startDate && updated.days) {
          const start = new Date(updated.startDate);
          const end = new Date(start);
          end.setDate(end.getDate() + updated.days);
          updated.endDate = end.toISOString().split('T')[0];
          updated.nights = updated.days > 0 ? updated.days - 1 : 0;
        }
      }

      if (field === 'adults' || field === 'children') {
        const totalPax = updated.adults + updated.children;
        const recommended = getRecommendedVehicle(totalPax);
        if (recommended && VEHICLES[updated.vehicle]?.maxPassengers < totalPax) {
          updated.vehicle = recommended.id;
        }
      }

      return updated;
    });
  }, []);

  const updateTripBatch = useCallback((updates: Partial<TripDetails>) => {
    setTrip(prev => ({ ...prev, ...updates }));
  }, []);

  const toggleDestination = useCallback((destinationId: string) => {
    setTrip(prev => {
      const destinations = prev.destinations.includes(destinationId)
        ? prev.destinations.filter(d => d !== destinationId)
        : [...prev.destinations, destinationId];

      const suggestedDays = Math.ceil(getSuggestedDuration(destinations)) + 1;

      return {
        ...prev,
        destinations,
        days: destinations.length > 0 ? Math.max(prev.days, suggestedDays) : prev.days,
      };
    });
  }, []);

  const reorderDestinations = useCallback((fromIndex: number, toIndex: number) => {
    setTrip(prev => {
      const destinations = [...prev.destinations];
      const [removed] = destinations.splice(fromIndex, 1);
      destinations.splice(toIndex, 0, removed);
      return { ...prev, destinations };
    });
  }, []);

  const toggleActivity = useCallback((activityId: string) => {
    setTrip(prev => {
      const activities = prev.activities.includes(activityId)
        ? prev.activities.filter(a => a !== activityId)
        : [...prev.activities, activityId];
      return { ...prev, activities };
    });
  }, []);

  const toggleService = useCallback((serviceId: string) => {
    setTrip(prev => {
      const services = prev.services.includes(serviceId)
        ? prev.services.filter(s => s !== serviceId)
        : [...prev.services, serviceId];
      return { ...prev, services };
    });
  }, []);

  const calculateQuote = useCallback((): Quote | null => {
    setIsCalculating(true);
    setErrors([]);

    try {
      const validation = validateTripDetails(trip);
      if (!validation.isValid) {
        setErrors(validation.errors);
        setIsCalculating(false);
        return null;
      }

      const calculator = new QuoteCalculator(trip);
      const result = calculator.calculate();

      setQuote(result);
      setIsCalculating(false);
      return result;
    } catch (error) {
      console.error('Quote calculation error:', error);
      setErrors(['An error occurred while calculating your quote.']);
      setIsCalculating(false);
      return null;
    }
  }, [trip]);

  const quickEstimate = useMemo((): QuickEstimate | null => {
    if (trip.adults < 1 || trip.days < 1) return null;

    const pax = trip.adults + trip.children;
    return getQuickQuote(pax, trip.days, trip.accommodationTier);
  }, [trip.adults, trip.children, trip.days, trip.accommodationTier]);

  const convertCurrency = useCallback((amountUSD: number): number => {
    const rate = CURRENCY_RATES[trip.currency] || 1;
    return Math.round(amountUSD * rate);
  }, [trip.currency]);

  const formatPrice = useCallback((amount: number): string => {
    const symbols: Record<string, string> = { USD: '$', EUR: '€', GBP: '£', AUD: 'A$' };
    const converted = convertCurrency(amount);
    return `${symbols[trip.currency] || '$'}${converted.toLocaleString()}`;
  }, [trip.currency, convertCurrency]);

  const resetForm = useCallback(() => {
    setTrip(initialTripState);
    setQuote(null);
    setErrors([]);
    setStep(1);
  }, []);

  const nextStep = useCallback(() => {
    setStep(prev => Math.min(prev + 1, 5));
  }, []);

  const prevStep = useCallback(() => {
    setStep(prev => Math.max(prev - 1, 1));
  }, []);

  const goToStep = useCallback((stepNum: number) => {
    setStep(stepNum);
  }, []);

  const isStepComplete = useMemo((): boolean => {
    switch (step) {
      case 1:
        return trip.adults >= 1 && trip.startDate !== '' && trip.days >= 1;
      case 2:
        return trip.destinations.length > 0;
      case 3:
        return !!trip.vehicle;
      case 4:
        return !!trip.accommodationTier;
      case 5:
        return true;
      default:
        return false;
    }
  }, [step, trip]);

  const recommendedVehicle = useMemo((): Vehicle | null => {
    return getRecommendedVehicle(trip.adults + trip.children);
  }, [trip.adults, trip.children]);

  const suggestedDays = useMemo((): number => {
    return Math.ceil(getSuggestedDuration(trip.destinations)) + 1;
  }, [trip.destinations]);

  return {
    trip,
    quote,
    isCalculating,
    errors,
    step,
    quickEstimate,
    recommendedVehicle,
    suggestedDays,
    isStepComplete,
    updateTrip,
    updateTripBatch,
    toggleDestination,
    reorderDestinations,
    toggleActivity,
    toggleService,
    calculateQuote,
    resetForm,
    nextStep,
    prevStep,
    goToStep,
    formatPrice,
    convertCurrency,
  };
};

export default useQuoteCalculator;
