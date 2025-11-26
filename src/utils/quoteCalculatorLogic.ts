/**
 * RECHARGE TRAVELS - QUOTE CALCULATOR ENGINE
 * ==========================================
 * Core calculation logic for instant tour quotes
 */

import {
  CURRENCY_RATES,
  SEASONS,
  VEHICLES,
  ACCOMMODATION_TIERS,
  DESTINATIONS,
  ACTIVITIES,
  ADDITIONAL_SERVICES,
  DISCOUNTS,
  PAYMENT_TERMS,
  getDistance,
  Vehicle,
} from '@/config/quoteCalculatorPricing';

// ============================================
// TYPES
// ============================================
export interface TripDetails {
  adults: number;
  children: number;
  childrenAges: number[];
  startDate: string;
  endDate: string;
  days: number;
  nights: number;
  destinations: string[];
  vehicle: string;
  airportPickup: boolean;
  airportDropoff: boolean;
  accommodationTier: string;
  rooms: number;
  activities: string[];
  services: string[];
  isReturningCustomer: boolean;
  specialRequests: string;
  currency: string;
}

interface BreakdownItem {
  name: string;
  quantity: number | string;
  unitPrice: number;
  total: number;
  type?: string;
  destination?: string;
  duration?: string;
  includes?: string[];
  description?: string;
}

interface DiscountItem {
  name: string;
  total: number;
}

interface Breakdown {
  transport: { items: BreakdownItem[]; subtotal: number };
  accommodation: { items: BreakdownItem[]; subtotal: number };
  entranceFees: { items: BreakdownItem[]; subtotal: number };
  activities: { items: BreakdownItem[]; subtotal: number };
  services: { items: BreakdownItem[]; subtotal: number };
  discounts: { items: DiscountItem[]; subtotal: number };
}

interface Totals {
  subtotal: number;
  discounts: number;
  seasonalAdjustment: number;
  grandTotal: number;
  deposit: number;
  balance: number;
}

export interface Quote {
  tripSummary: {
    travelers: { adults: number; children: number; total: number };
    dates: { start: string; end: string; days: number; nights: number };
    destinations: { id: string; name: string; icon: string }[];
    vehicle: string;
    accommodation: string;
  };
  breakdown: Breakdown;
  totals: {
    subtotal: number;
    discounts: number;
    seasonalAdjustment: number;
    grandTotal: number;
    deposit: number;
    balance: number;
    seasonLabel: string;
    currencies: Record<string, number>;
    perPerson: number;
    perDay: number;
  };
  payment: {
    deposit: number;
    depositCurrencies: Record<string, number>;
    balance: number;
    balanceDueDays: number;
  };
  inclusions: string[];
  exclusions: string[];
  validUntil: string;
  quoteId: string;
  generatedAt: string;
}

// ============================================
// MAIN CALCULATOR CLASS
// ============================================
class QuoteCalculator {
  private trip: TripDetails;
  private breakdown: Breakdown;
  private totals: Totals;
  private seasonalMultiplier: number = 1;
  private seasonLabel: string = '';

  constructor(tripDetails: TripDetails) {
    this.trip = tripDetails;
    this.breakdown = {
      transport: { items: [], subtotal: 0 },
      accommodation: { items: [], subtotal: 0 },
      entranceFees: { items: [], subtotal: 0 },
      activities: { items: [], subtotal: 0 },
      services: { items: [], subtotal: 0 },
      discounts: { items: [], subtotal: 0 },
    };
    this.totals = {
      subtotal: 0,
      discounts: 0,
      seasonalAdjustment: 0,
      grandTotal: 0,
      deposit: 0,
      balance: 0,
    };
  }

  calculate(): Quote {
    this.calculateTransport();
    this.calculateAccommodation();
    this.calculateEntranceFees();
    this.calculateActivities();
    this.calculateAdditionalServices();
    this.applySeasonalPricing();
    this.applyDiscounts();
    this.calculateTotals();

    return this.generateQuote();
  }

  private calculateTransport(): void {
    const { vehicle, destinations, days } = this.trip;
    const vehicleData = VEHICLES[vehicle];

    if (!vehicleData) return;

    const rentalCost = vehicleData.pricePerDay * days;
    this.breakdown.transport.items.push({
      name: `${vehicleData.name} - ${days} days`,
      quantity: days,
      unitPrice: vehicleData.pricePerDay,
      total: rentalCost,
      type: 'rental',
    });

    const totalDistance = this.calculateTotalDistance(destinations);
    const fuelCost = totalDistance * vehicleData.fuelCostPerKm;

    this.breakdown.transport.items.push({
      name: `Fuel estimate (${totalDistance} km)`,
      quantity: totalDistance,
      unitPrice: vehicleData.fuelCostPerKm,
      total: fuelCost,
      type: 'fuel',
    });

    if (this.trip.airportPickup) {
      this.breakdown.transport.items.push({
        name: 'Airport Pickup',
        quantity: 1,
        unitPrice: ADDITIONAL_SERVICES.airportPickup.price!,
        total: ADDITIONAL_SERVICES.airportPickup.price!,
        type: 'transfer',
      });
    }

    if (this.trip.airportDropoff) {
      this.breakdown.transport.items.push({
        name: 'Airport Drop-off',
        quantity: 1,
        unitPrice: ADDITIONAL_SERVICES.airportDropoff.price!,
        total: ADDITIONAL_SERVICES.airportDropoff.price!,
        type: 'transfer',
      });
    }

    this.breakdown.transport.subtotal = this.breakdown.transport.items.reduce(
      (sum, item) => sum + item.total, 0
    );
  }

  private calculateTotalDistance(destinations: string[]): number {
    if (!destinations || destinations.length === 0) return 0;

    let totalDistance = 0;

    if (destinations[0]) {
      const firstDest = DESTINATIONS[destinations[0]];
      if (firstDest) {
        totalDistance += firstDest.distanceFromColombo;
      }
    }

    for (let i = 0; i < destinations.length - 1; i++) {
      const distance = getDistance(destinations[i], destinations[i + 1]);
      totalDistance += distance || 50;
    }

    const lastDest = DESTINATIONS[destinations[destinations.length - 1]];
    if (lastDest) {
      totalDistance += lastDest.distanceFromColombo;
    }

    return totalDistance;
  }

  private calculateAccommodation(): void {
    const { accommodationTier, nights, adults, children, rooms } = this.trip;

    const tier = ACCOMMODATION_TIERS[accommodationTier];
    if (!tier) return;

    const roomsNeeded = rooms || this.calculateRoomsNeeded(adults, children);
    const roomBreakdown = this.calculateRoomDistribution(adults, children, roomsNeeded);

    roomBreakdown.forEach(room => {
      const pricePerNight = tier.pricePerNight[room.type as keyof typeof tier.pricePerNight];
      const total = pricePerNight * nights * room.count;

      this.breakdown.accommodation.items.push({
        name: `${tier.name} - ${room.type} room`,
        quantity: `${room.count} room(s) x ${nights} nights`,
        unitPrice: pricePerNight,
        total: total,
        type: room.type,
      });
    });

    this.breakdown.accommodation.subtotal = this.breakdown.accommodation.items.reduce(
      (sum, item) => sum + item.total, 0
    );
  }

  private calculateRoomsNeeded(adults: number, children: number): number {
    const totalPax = adults + children;
    if (totalPax <= 2) return 1;
    if (totalPax <= 3) return 1;
    if (totalPax <= 4) return 2;
    return Math.ceil(totalPax / 2);
  }

  private calculateRoomDistribution(adults: number, children: number, rooms: number): { type: string; count: number }[] {
    const totalPax = adults + children;

    if (rooms === 1) {
      if (totalPax <= 2) return [{ type: 'double', count: 1 }];
      if (totalPax <= 3) return [{ type: 'triple', count: 1 }];
      return [{ type: 'family', count: 1 }];
    }

    return [{ type: 'double', count: rooms }];
  }

  private calculateEntranceFees(): void {
    const { destinations, adults, children } = this.trip;

    destinations.forEach(destId => {
      const dest = DESTINATIONS[destId];
      if (!dest || !dest.entranceFee) return;

      const adultFee = dest.entranceFee.adult;
      const childFee = dest.entranceFee.child;

      if (adultFee > 0 || childFee > 0) {
        const adultTotal = adultFee * adults;
        const childTotal = childFee * children;

        this.breakdown.entranceFees.items.push({
          name: `${dest.name} - Adults`,
          quantity: adults,
          unitPrice: adultFee,
          total: adultTotal,
          destination: destId,
        });

        if (children > 0 && childFee > 0) {
          this.breakdown.entranceFees.items.push({
            name: `${dest.name} - Children`,
            quantity: children,
            unitPrice: childFee,
            total: childTotal,
            destination: destId,
          });
        }
      }
    });

    this.breakdown.entranceFees.subtotal = this.breakdown.entranceFees.items.reduce(
      (sum, item) => sum + item.total, 0
    );
  }

  private calculateActivities(): void {
    const { activities, adults, children } = this.trip;

    if (!activities || activities.length === 0) return;

    activities.forEach(activityId => {
      const activity = ACTIVITIES[activityId];
      if (!activity) return;

      const totalPax = adults + (activity.childPrice ? children : 0);
      let price = activity.pricePerPerson;

      if (typeof price === 'object') {
        price = price.secondClass;
      }

      const total = (price as number) * totalPax;

      this.breakdown.activities.items.push({
        name: activity.name,
        quantity: totalPax,
        unitPrice: price as number,
        total: total,
        duration: activity.duration,
        includes: activity.includes,
      });
    });

    this.breakdown.activities.subtotal = this.breakdown.activities.items.reduce(
      (sum, item) => sum + item.total, 0
    );
  }

  private calculateAdditionalServices(): void {
    const { services, days } = this.trip;

    if (!services || services.length === 0) return;

    services.forEach(serviceId => {
      const service = ADDITIONAL_SERVICES[serviceId];
      if (!service) return;

      let total: number;
      let quantity = 1;
      let unitPrice = service.price || service.pricePerDay || 0;

      if (service.pricePerDay) {
        quantity = days;
        total = service.pricePerDay * days;
      } else {
        total = service.price || 0;
      }

      this.breakdown.services.items.push({
        name: service.name,
        quantity: quantity,
        unitPrice: unitPrice,
        total: total,
        description: service.description,
      });
    });

    this.breakdown.services.subtotal = this.breakdown.services.items.reduce(
      (sum, item) => sum + item.total, 0
    );
  }

  private applySeasonalPricing(): void {
    const { startDate } = this.trip;
    if (!startDate) return;

    const month = new Date(startDate).getMonth() + 1;

    let season = SEASONS.low;
    if (SEASONS.peak.months.includes(month)) {
      season = SEASONS.peak;
    } else if (SEASONS.shoulder.months.includes(month)) {
      season = SEASONS.shoulder;
    }

    this.seasonalMultiplier = season.multiplier;
    this.seasonLabel = season.label;

    if (season.multiplier !== 1) {
      const adjustment = this.breakdown.accommodation.subtotal * (season.multiplier - 1);
      this.totals.seasonalAdjustment = adjustment;
    }
  }

  private applyDiscounts(): void {
    const { adults, children, startDate, isReturningCustomer } = this.trip;
    const totalPax = adults + children;
    const subtotal = this.getSubtotal();

    if (totalPax >= 15 && DISCOUNTS.group[15]) {
      this.addDiscount('Group Discount (15+ travelers)', subtotal * DISCOUNTS.group[15]);
    } else if (totalPax >= 10 && DISCOUNTS.group[10]) {
      this.addDiscount('Group Discount (10+ travelers)', subtotal * DISCOUNTS.group[10]);
    } else if (totalPax >= 6 && DISCOUNTS.group[6]) {
      this.addDiscount('Group Discount (6+ travelers)', subtotal * DISCOUNTS.group[6]);
    }

    if (startDate) {
      const daysUntilTrip = Math.floor(
        (new Date(startDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
      );
      if (daysUntilTrip >= DISCOUNTS.earlyBird.daysInAdvance) {
        this.addDiscount(
          'Early Bird Discount (60+ days advance)',
          subtotal * DISCOUNTS.earlyBird.discount
        );
      }
    }

    if (isReturningCustomer) {
      this.addDiscount('Returning Customer Discount', subtotal * DISCOUNTS.returning.discount);
    }

    if (this.trip.days >= DISCOUNTS.longStay.daysMin) {
      this.addDiscount(
        `Long Stay Discount (${DISCOUNTS.longStay.daysMin}+ days)`,
        subtotal * DISCOUNTS.longStay.discount
      );
    }

    this.breakdown.discounts.subtotal = this.breakdown.discounts.items.reduce(
      (sum, item) => sum + item.total, 0
    );
  }

  private addDiscount(name: string, amount: number): void {
    this.breakdown.discounts.items.push({
      name: name,
      total: -Math.abs(amount),
    });
  }

  private getSubtotal(): number {
    return (
      this.breakdown.transport.subtotal +
      this.breakdown.accommodation.subtotal +
      this.breakdown.entranceFees.subtotal +
      this.breakdown.activities.subtotal +
      this.breakdown.services.subtotal
    );
  }

  private calculateTotals(): void {
    this.totals.subtotal = this.getSubtotal();
    this.totals.discounts = Math.abs(this.breakdown.discounts.subtotal);

    this.totals.grandTotal =
      this.totals.subtotal +
      this.totals.seasonalAdjustment -
      this.totals.discounts;

    this.totals.deposit = Math.round(this.totals.grandTotal * PAYMENT_TERMS.depositPercentage);
    this.totals.balance = this.totals.grandTotal - this.totals.deposit;
  }

  private generateQuote(): Quote {
    return {
      tripSummary: {
        travelers: {
          adults: this.trip.adults,
          children: this.trip.children,
          total: this.trip.adults + this.trip.children,
        },
        dates: {
          start: this.trip.startDate,
          end: this.trip.endDate,
          days: this.trip.days,
          nights: this.trip.nights,
        },
        destinations: this.trip.destinations.map(id => ({
          id,
          name: DESTINATIONS[id]?.name || id,
          icon: DESTINATIONS[id]?.icon || '📍',
        })),
        vehicle: VEHICLES[this.trip.vehicle]?.name || '',
        accommodation: ACCOMMODATION_TIERS[this.trip.accommodationTier]?.name || '',
      },
      breakdown: this.breakdown,
      totals: {
        ...this.totals,
        seasonLabel: this.seasonLabel,
        currencies: this.convertToCurrencies(this.totals.grandTotal),
        perPerson: Math.round(this.totals.grandTotal / (this.trip.adults + this.trip.children)),
        perDay: Math.round(this.totals.grandTotal / this.trip.days),
      },
      payment: {
        deposit: this.totals.deposit,
        depositCurrencies: this.convertToCurrencies(this.totals.deposit),
        balance: this.totals.balance,
        balanceDueDays: PAYMENT_TERMS.balanceDueDays,
      },
      inclusions: this.generateInclusions(),
      exclusions: this.generateExclusions(),
      validUntil: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      quoteId: this.generateQuoteId(),
      generatedAt: new Date().toISOString(),
    };
  }

  private convertToCurrencies(amountUSD: number): Record<string, number> {
    return {
      USD: Math.round(amountUSD),
      EUR: Math.round(amountUSD * CURRENCY_RATES.EUR),
      GBP: Math.round(amountUSD * CURRENCY_RATES.GBP),
      AUD: Math.round(amountUSD * CURRENCY_RATES.AUD),
    };
  }

  private generateInclusions(): string[] {
    const inclusions = [
      'Air-conditioned private vehicle',
      'Experienced English-speaking driver',
      'All fuel and tolls',
      'Vehicle insurance',
      'Airport transfers',
      '24/7 support hotline',
    ];

    if (this.breakdown.accommodation.subtotal > 0) {
      inclusions.push('Accommodation with breakfast');
    }

    if (this.breakdown.entranceFees.subtotal > 0) {
      inclusions.push('All entrance fees as per itinerary');
    }

    if (this.breakdown.activities.subtotal > 0) {
      inclusions.push('Activities as per itinerary');
    }

    return inclusions;
  }

  private generateExclusions(): string[] {
    return [
      'International flights',
      'Travel insurance',
      'Visa fees (if applicable)',
      'Personal expenses',
      'Tips for driver/guides',
      'Lunch and dinner (unless specified)',
      'Camera/video permits at some sites',
      'Optional activities not in itinerary',
    ];
  }

  private generateQuoteId(): string {
    const prefix = 'RCT';
    const date = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const random = Math.random().toString(36).substr(2, 6).toUpperCase();
    return `${prefix}-${date}-${random}`;
  }
}

// ============================================
// HELPER FUNCTIONS
// ============================================

export const getRecommendedVehicle = (totalPax: number): Vehicle | null => {
  const vehicles = Object.values(VEHICLES);
  const suitable = vehicles.filter(v => v.maxPassengers >= totalPax);

  if (suitable.length === 0) {
    return VEHICLES.miniBus;
  }

  return suitable.sort((a, b) => a.pricePerDay - b.pricePerDay)[0];
};

export const getSuggestedDuration = (destinations: string[]): number => {
  if (!destinations || destinations.length === 0) return 0;

  return destinations.reduce((total, destId) => {
    const dest = DESTINATIONS[destId];
    return total + (dest?.suggestedDuration || 0.5);
  }, 0);
};

export const getDestinationsByRegion = (): Record<string, { id: string; name: string; region: string; icon: string }[]> => {
  const regions: Record<string, { id: string; name: string; region: string; icon: string }[]> = {};

  Object.entries(DESTINATIONS).forEach(([id, dest]) => {
    if (!regions[dest.region]) {
      regions[dest.region] = [];
    }
    regions[dest.region].push({ id, name: dest.name, region: dest.region, icon: dest.icon });
  });

  return regions;
};

export const getActivitiesByDestination = (destId: string) => {
  return Object.entries(ACTIVITIES)
    .filter(([, activity]) => activity.destination === destId)
    .map(([id, activity]) => ({ id, ...activity }));
};

export const formatCurrency = (amount: number, currency: string = 'USD'): string => {
  const symbols: Record<string, string> = {
    USD: '$',
    EUR: '€',
    GBP: '£',
    AUD: 'A$',
  };

  return `${symbols[currency] || '$'}${amount.toLocaleString()}`;
};

export const validateTripDetails = (trip: Partial<TripDetails>): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];

  if (!trip.adults || trip.adults < 1) {
    errors.push('At least 1 adult is required');
  }

  if (!trip.destinations || trip.destinations.length === 0) {
    errors.push('Select at least one destination');
  }

  if (!trip.startDate) {
    errors.push('Start date is required');
  }

  if (!trip.days || trip.days < 1) {
    errors.push('Trip duration must be at least 1 day');
  }

  if (!trip.vehicle) {
    errors.push('Please select a vehicle');
  }

  if (!trip.accommodationTier) {
    errors.push('Please select accommodation type');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

export const getQuickQuote = (pax: number, days: number, tier: string = 'standard'): {
  low: number;
  mid: number;
  high: number;
  perPerson: number;
  perDay: number;
} => {
  const vehicleRate = pax <= 3 ? 55 : pax <= 6 ? 75 : 120;
  const accommodationRate = ACCOMMODATION_TIERS[tier]?.pricePerNight.double || 65;
  const estimatedEntranceFees = 50 * pax;
  const rooms = Math.ceil(pax / 2);

  const estimate = (vehicleRate * days) +
                   (accommodationRate * (days - 1) * rooms) +
                   estimatedEntranceFees;

  return {
    low: Math.round(estimate * 0.9),
    mid: Math.round(estimate),
    high: Math.round(estimate * 1.2),
    perPerson: Math.round(estimate / pax),
    perDay: Math.round(estimate / days),
  };
};

export default QuoteCalculator;
