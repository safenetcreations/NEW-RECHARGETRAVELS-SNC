import {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  query,
  where,
  updateDoc,
} from 'firebase/firestore';
import { db } from '../config/firebase';

// ==========================================
// TYPES & INTERFACES
// ==========================================

export type VehicleType = 'sedan' | 'suv' | 'van' | 'mini_coach' | 'luxury';
export type TripType = 'airport_transfer' | 'day_tour' | 'multi_day' | 'hourly' | 'custom';
export type DriverTier = 'freelance_driver' | 'tourist_driver' | 'national_guide' | 'chauffeur_guide';

export interface PricingConfig {
  id: string;

  // Base rates per vehicle type (per day in LKR)
  base_rates: {
    sedan: number;
    suv: number;
    van: number;
    mini_coach: number;
    luxury: number;
  };

  // Per kilometer rate by vehicle type
  km_rates: {
    sedan: number;
    suv: number;
    van: number;
    mini_coach: number;
    luxury: number;
  };

  // Driver tier multipliers
  tier_multipliers: {
    freelance_driver: number;
    tourist_driver: number;
    national_guide: number;
    chauffeur_guide: number;
  };

  // Trip type multipliers
  trip_multipliers: {
    airport_transfer: number;
    day_tour: number;
    multi_day: number;
    hourly: number;
    custom: number;
  };

  // Time-based surcharges
  night_surcharge_percent: number;     // 10 PM - 6 AM
  weekend_surcharge_percent: number;   // Saturday, Sunday
  holiday_surcharge_percent: number;   // Public holidays

  // Extras
  ac_surcharge_per_day: number;
  wifi_surcharge_per_day: number;
  child_seat_per_day: number;
  luggage_extra_per_piece: number;

  // Minimum charges
  minimum_fare: number;
  minimum_km: number;

  // Platform fees
  platform_fee_fixed: number;
  platform_commission_percent: number;

  // Discounts
  multi_day_discount_percent: number;  // Discount for 3+ days
  repeat_customer_discount: number;    // Discount for returning customers

  // Fuel adjustment
  fuel_adjustment_percent: number;     // Dynamic fuel price adjustment

  updated_at: string;
  updated_by?: string;
}

export interface PriceQuote {
  id?: string;
  driver_id?: string;
  customer_id?: string;

  // Trip details
  trip_type: TripType;
  vehicle_type: VehicleType;
  driver_tier: DriverTier;

  // Route
  pickup_location: string;
  dropoff_location: string;
  waypoints?: string[];

  // Distance & time
  estimated_km: number;
  estimated_hours: number;
  estimated_days: number;

  // Date/time
  pickup_date: string;
  pickup_time: string;
  return_date?: string;

  // Passengers
  passenger_count: number;
  luggage_count: number;

  // Options
  with_ac: boolean;
  with_wifi: boolean;
  child_seats: number;

  // Breakdown
  base_fare: number;
  distance_fare: number;
  tier_adjustment: number;
  trip_type_adjustment: number;
  time_surcharge: number;
  extras_total: number;
  subtotal: number;
  discount_amount: number;
  platform_fee: number;
  total_price: number;

  // Driver earnings
  driver_earnings: number;
  platform_commission: number;

  // Quote validity
  quote_valid_until: string;
  is_expired: boolean;

  created_at: string;
}

export interface PriceBreakdown {
  base_fare: number;
  distance_fare: number;
  tier_adjustment: number;
  trip_type_adjustment: number;
  time_surcharge: number;
  extras: {
    ac: number;
    wifi: number;
    child_seats: number;
    luggage: number;
  };
  extras_total: number;
  subtotal: number;
  discount: {
    type: string;
    percent: number;
    amount: number;
  } | null;
  platform_fee: number;
  total: number;
  driver_earnings: number;
  platform_commission: number;
}

// ==========================================
// DEFAULT PRICING CONFIG
// ==========================================

export const DEFAULT_PRICING_CONFIG: PricingConfig = {
  id: 'default',

  base_rates: {
    sedan: 8000,      // LKR per day
    suv: 12000,
    van: 15000,
    mini_coach: 25000,
    luxury: 35000
  },

  km_rates: {
    sedan: 45,        // LKR per km
    suv: 55,
    van: 65,
    mini_coach: 85,
    luxury: 120
  },

  tier_multipliers: {
    freelance_driver: 1.0,
    tourist_driver: 1.15,
    national_guide: 1.35,
    chauffeur_guide: 1.5
  },

  trip_multipliers: {
    airport_transfer: 0.8,   // Shorter, fixed route
    day_tour: 1.0,
    multi_day: 0.95,         // Slight discount
    hourly: 1.2,             // Premium for flexibility
    custom: 1.1
  },

  night_surcharge_percent: 25,
  weekend_surcharge_percent: 10,
  holiday_surcharge_percent: 20,

  ac_surcharge_per_day: 1500,
  wifi_surcharge_per_day: 500,
  child_seat_per_day: 1000,
  luggage_extra_per_piece: 500,

  minimum_fare: 3500,
  minimum_km: 50,

  platform_fee_fixed: 300,
  platform_commission_percent: 10,

  multi_day_discount_percent: 10,
  repeat_customer_discount: 5,

  fuel_adjustment_percent: 0,

  updated_at: new Date().toISOString()
};

// ==========================================
// PRICING SERVICE
// ==========================================

const CONFIG_COLLECTION = 'pricing_config';
const QUOTES_COLLECTION = 'price_quotes';

export const driverPricingService = {
  // Get current pricing configuration
  async getPricingConfig(): Promise<PricingConfig> {
    try {
      const configDoc = await getDoc(doc(db, CONFIG_COLLECTION, 'default'));
      if (configDoc.exists()) {
        return configDoc.data() as PricingConfig;
      }
      // Return and save default if not exists
      await this.savePricingConfig(DEFAULT_PRICING_CONFIG);
      return DEFAULT_PRICING_CONFIG;
    } catch (error) {
      console.error('Error getting pricing config:', error);
      return DEFAULT_PRICING_CONFIG;
    }
  },

  // Save pricing configuration (admin)
  async savePricingConfig(config: PricingConfig): Promise<void> {
    await setDoc(doc(db, CONFIG_COLLECTION, 'default'), {
      ...config,
      updated_at: new Date().toISOString()
    });
  },

  // Calculate price for a trip
  async calculatePrice(params: {
    trip_type: TripType;
    vehicle_type: VehicleType;
    driver_tier: DriverTier;
    estimated_km: number;
    estimated_days?: number;
    pickup_date: string;
    pickup_time: string;
    with_ac?: boolean;
    with_wifi?: boolean;
    child_seats?: number;
    extra_luggage?: number;
    is_repeat_customer?: boolean;
  }): Promise<PriceBreakdown> {
    const config = await this.getPricingConfig();

    const {
      trip_type,
      vehicle_type,
      driver_tier,
      estimated_km,
      estimated_days = 1,
      pickup_date,
      pickup_time,
      with_ac = true,
      with_wifi = false,
      child_seats = 0,
      extra_luggage = 0,
      is_repeat_customer = false
    } = params;

    // Base fare calculation
    const base_rate = config.base_rates[vehicle_type];
    const base_fare = base_rate * estimated_days;

    // Distance fare
    const km_rate = config.km_rates[vehicle_type];
    const effective_km = Math.max(estimated_km, config.minimum_km * estimated_days);
    const distance_fare = effective_km * km_rate;

    // Tier adjustment
    const tier_multiplier = config.tier_multipliers[driver_tier];
    const tier_adjustment = (base_fare + distance_fare) * (tier_multiplier - 1);

    // Trip type adjustment
    const trip_multiplier = config.trip_multipliers[trip_type];
    const trip_type_adjustment = (base_fare + distance_fare) * (trip_multiplier - 1);

    // Time-based surcharges
    let time_surcharge = 0;
    const pickupHour = parseInt(pickup_time.split(':')[0]);
    const pickupDay = new Date(pickup_date).getDay();

    // Night surcharge (10 PM - 6 AM)
    if (pickupHour >= 22 || pickupHour < 6) {
      time_surcharge += (base_fare + distance_fare) * (config.night_surcharge_percent / 100);
    }

    // Weekend surcharge
    if (pickupDay === 0 || pickupDay === 6) {
      time_surcharge += (base_fare + distance_fare) * (config.weekend_surcharge_percent / 100);
    }

    // Extras
    const extras = {
      ac: with_ac ? config.ac_surcharge_per_day * estimated_days : 0,
      wifi: with_wifi ? config.wifi_surcharge_per_day * estimated_days : 0,
      child_seats: child_seats * config.child_seat_per_day * estimated_days,
      luggage: extra_luggage * config.luggage_extra_per_piece
    };
    const extras_total = extras.ac + extras.wifi + extras.child_seats + extras.luggage;

    // Subtotal before discounts
    const subtotal = base_fare + distance_fare + tier_adjustment + trip_type_adjustment + time_surcharge + extras_total;

    // Discounts
    let discount: PriceBreakdown['discount'] = null;

    if (estimated_days >= 3 && config.multi_day_discount_percent > 0) {
      discount = {
        type: 'Multi-day booking',
        percent: config.multi_day_discount_percent,
        amount: subtotal * (config.multi_day_discount_percent / 100)
      };
    } else if (is_repeat_customer && config.repeat_customer_discount > 0) {
      discount = {
        type: 'Returning customer',
        percent: config.repeat_customer_discount,
        amount: subtotal * (config.repeat_customer_discount / 100)
      };
    }

    const discount_amount = discount?.amount || 0;

    // Platform fee
    const platform_fee = config.platform_fee_fixed;

    // Total
    let total = subtotal - discount_amount + platform_fee;

    // Apply minimum fare
    if (total < config.minimum_fare) {
      total = config.minimum_fare;
    }

    // Apply fuel adjustment
    if (config.fuel_adjustment_percent !== 0) {
      total = total * (1 + config.fuel_adjustment_percent / 100);
    }

    // Round to nearest 100
    total = Math.ceil(total / 100) * 100;

    // Calculate driver earnings
    const platform_commission = (total - platform_fee) * (config.platform_commission_percent / 100);
    const driver_earnings = total - platform_fee - platform_commission;

    return {
      base_fare: Math.round(base_fare),
      distance_fare: Math.round(distance_fare),
      tier_adjustment: Math.round(tier_adjustment),
      trip_type_adjustment: Math.round(trip_type_adjustment),
      time_surcharge: Math.round(time_surcharge),
      extras,
      extras_total: Math.round(extras_total),
      subtotal: Math.round(subtotal),
      discount,
      platform_fee,
      total: Math.round(total),
      driver_earnings: Math.round(driver_earnings),
      platform_commission: Math.round(platform_commission)
    };
  },

  // Generate a price quote
  async generateQuote(params: {
    driver_id?: string;
    customer_id?: string;
    trip_type: TripType;
    vehicle_type: VehicleType;
    driver_tier: DriverTier;
    pickup_location: string;
    dropoff_location: string;
    waypoints?: string[];
    estimated_km: number;
    estimated_hours: number;
    estimated_days: number;
    pickup_date: string;
    pickup_time: string;
    return_date?: string;
    passenger_count: number;
    luggage_count: number;
    with_ac: boolean;
    with_wifi: boolean;
    child_seats: number;
    is_repeat_customer?: boolean;
  }): Promise<PriceQuote> {
    const breakdown = await this.calculatePrice({
      trip_type: params.trip_type,
      vehicle_type: params.vehicle_type,
      driver_tier: params.driver_tier,
      estimated_km: params.estimated_km,
      estimated_days: params.estimated_days,
      pickup_date: params.pickup_date,
      pickup_time: params.pickup_time,
      with_ac: params.with_ac,
      with_wifi: params.with_wifi,
      child_seats: params.child_seats,
      extra_luggage: Math.max(0, params.luggage_count - 2), // First 2 luggage free
      is_repeat_customer: params.is_repeat_customer
    });

    const quoteRef = doc(collection(db, QUOTES_COLLECTION));
    const now = new Date();
    const validUntil = new Date(now.getTime() + 24 * 60 * 60 * 1000); // 24 hours

    const quote: PriceQuote = {
      id: quoteRef.id,
      driver_id: params.driver_id,
      customer_id: params.customer_id,
      trip_type: params.trip_type,
      vehicle_type: params.vehicle_type,
      driver_tier: params.driver_tier,
      pickup_location: params.pickup_location,
      dropoff_location: params.dropoff_location,
      waypoints: params.waypoints,
      estimated_km: params.estimated_km,
      estimated_hours: params.estimated_hours,
      estimated_days: params.estimated_days,
      pickup_date: params.pickup_date,
      pickup_time: params.pickup_time,
      return_date: params.return_date,
      passenger_count: params.passenger_count,
      luggage_count: params.luggage_count,
      with_ac: params.with_ac,
      with_wifi: params.with_wifi,
      child_seats: params.child_seats,
      base_fare: breakdown.base_fare,
      distance_fare: breakdown.distance_fare,
      tier_adjustment: breakdown.tier_adjustment,
      trip_type_adjustment: breakdown.trip_type_adjustment,
      time_surcharge: breakdown.time_surcharge,
      extras_total: breakdown.extras_total,
      subtotal: breakdown.subtotal,
      discount_amount: breakdown.discount?.amount || 0,
      platform_fee: breakdown.platform_fee,
      total_price: breakdown.total,
      driver_earnings: breakdown.driver_earnings,
      platform_commission: breakdown.platform_commission,
      quote_valid_until: validUntil.toISOString(),
      is_expired: false,
      created_at: now.toISOString()
    };

    await setDoc(quoteRef, quote);
    return quote;
  },

  // Get quote by ID
  async getQuoteById(quoteId: string): Promise<PriceQuote | null> {
    const quoteDoc = await getDoc(doc(db, QUOTES_COLLECTION, quoteId));
    if (!quoteDoc.exists()) return null;

    const quote = quoteDoc.data() as PriceQuote;
    quote.is_expired = new Date() > new Date(quote.quote_valid_until);
    return quote;
  },

  // Quick price estimate (without saving)
  async getQuickEstimate(params: {
    vehicle_type: VehicleType;
    estimated_km: number;
    estimated_days?: number;
  }): Promise<{ min: number; max: number }> {
    const config = await this.getPricingConfig();
    const { vehicle_type, estimated_km, estimated_days = 1 } = params;

    const base = config.base_rates[vehicle_type] * estimated_days;
    const distance = config.km_rates[vehicle_type] * Math.max(estimated_km, config.minimum_km);

    const baseTotal = base + distance + config.platform_fee_fixed;

    // Min = freelance driver, no extras
    const min = Math.ceil(baseTotal / 100) * 100;

    // Max = chauffeur guide, with AC, weekend surcharge
    const max = Math.ceil((baseTotal * config.tier_multipliers.chauffeur_guide * 1.1 + config.ac_surcharge_per_day * estimated_days) / 100) * 100;

    return { min, max };
  },

  // Get popular routes with prices
  async getPopularRoutes(): Promise<Array<{
    route: string;
    from: string;
    to: string;
    estimated_km: number;
    price_range: { min: number; max: number };
  }>> {
    const routes = [
      { route: 'Colombo Airport Transfer', from: 'Colombo City', to: 'BIA Airport', estimated_km: 35 },
      { route: 'Colombo to Kandy', from: 'Colombo', to: 'Kandy', estimated_km: 120 },
      { route: 'Colombo to Galle', from: 'Colombo', to: 'Galle', estimated_km: 130 },
      { route: 'Colombo to Sigiriya', from: 'Colombo', to: 'Sigiriya', estimated_km: 170 },
      { route: 'Kandy to Ella', from: 'Kandy', to: 'Ella', estimated_km: 140 },
      { route: 'Colombo to Yala', from: 'Colombo', to: 'Yala National Park', estimated_km: 300 }
    ];

    const routesWithPrices = await Promise.all(
      routes.map(async (route) => ({
        ...route,
        price_range: await this.getQuickEstimate({
          vehicle_type: 'sedan',
          estimated_km: route.estimated_km
        })
      }))
    );

    return routesWithPrices;
  },

  // Format price for display
  formatPrice(amount: number): string {
    return new Intl.NumberFormat('en-LK', {
      style: 'currency',
      currency: 'LKR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  }
};

export default driverPricingService;
