import {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  updateDoc,
  deleteDoc,
  writeBatch
} from 'firebase/firestore';
import { db } from '../config/firebase';

// ==========================================
// TYPES & INTERFACES
// ==========================================

export type TimeSlot = 'morning' | 'afternoon' | 'evening' | 'full_day';
export type AvailabilityStatus = 'available' | 'booked' | 'unavailable' | 'tentative';

export interface DriverAvailability {
  id?: string;
  driver_id: string;
  date: string;  // YYYY-MM-DD format
  time_slots: {
    morning: AvailabilityStatus;    // 6 AM - 12 PM
    afternoon: AvailabilityStatus;  // 12 PM - 6 PM
    evening: AvailabilityStatus;    // 6 PM - 10 PM
  };
  full_day_status: AvailabilityStatus;
  booking_id?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface BlockedPeriod {
  id?: string;
  driver_id: string;
  start_date: string;
  end_date: string;
  reason: 'vacation' | 'maintenance' | 'personal' | 'medical' | 'other';
  description?: string;
  created_at: string;
}

export interface AvailabilitySettings {
  driver_id: string;
  default_availability: 'available' | 'unavailable';
  working_days: number[]; // 0-6 (Sunday-Saturday)
  start_time: string;     // HH:MM
  end_time: string;       // HH:MM
  max_bookings_per_day: number;
  advance_booking_days: number; // How far in advance can book
  minimum_notice_hours: number; // Minimum hours before booking
  auto_confirm: boolean;
  updated_at: string;
}

export interface DayAvailability {
  date: string;
  status: AvailabilityStatus;
  slots: {
    morning: AvailabilityStatus;
    afternoon: AvailabilityStatus;
    evening: AvailabilityStatus;
  };
  booking_id?: string;
  is_blocked: boolean;
  block_reason?: string;
}

// ==========================================
// DEFAULT SETTINGS
// ==========================================

export const DEFAULT_AVAILABILITY_SETTINGS: Omit<AvailabilitySettings, 'driver_id' | 'updated_at'> = {
  default_availability: 'available',
  working_days: [1, 2, 3, 4, 5, 6], // Monday to Saturday
  start_time: '06:00',
  end_time: '22:00',
  max_bookings_per_day: 2,
  advance_booking_days: 60,
  minimum_notice_hours: 24,
  auto_confirm: false
};

// ==========================================
// AVAILABILITY SERVICE
// ==========================================

const AVAILABILITY_COLLECTION = 'driver_availability';
const BLOCKED_PERIODS_COLLECTION = 'driver_blocked_periods';
const SETTINGS_COLLECTION = 'driver_availability_settings';

export const driverAvailabilityService = {
  // ==========================================
  // AVAILABILITY MANAGEMENT
  // ==========================================

  // Get availability for a specific date
  async getAvailability(driverId: string, date: string): Promise<DriverAvailability | null> {
    const docId = `${driverId}_${date}`;
    const docRef = doc(db, AVAILABILITY_COLLECTION, docId);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) return null;
    return { id: docSnap.id, ...docSnap.data() } as DriverAvailability;
  },

  // Get availability for a date range
  async getAvailabilityRange(driverId: string, startDate: string, endDate: string): Promise<DriverAvailability[]> {
    const q = query(
      collection(db, AVAILABILITY_COLLECTION),
      where('driver_id', '==', driverId),
      where('date', '>=', startDate),
      where('date', '<=', endDate),
      orderBy('date', 'asc')
    );

    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as DriverAvailability));
  },

  // Set availability for a specific date
  async setAvailability(
    driverId: string,
    date: string,
    slots: { morning?: AvailabilityStatus; afternoon?: AvailabilityStatus; evening?: AvailabilityStatus },
    notes?: string
  ): Promise<void> {
    const docId = `${driverId}_${date}`;
    const existing = await this.getAvailability(driverId, date);
    const now = new Date().toISOString();

    const availability: DriverAvailability = {
      id: docId,
      driver_id: driverId,
      date,
      time_slots: {
        morning: slots.morning || existing?.time_slots.morning || 'available',
        afternoon: slots.afternoon || existing?.time_slots.afternoon || 'available',
        evening: slots.evening || existing?.time_slots.evening || 'available'
      },
      full_day_status: 'available',
      notes: notes || existing?.notes,
      created_at: existing?.created_at || now,
      updated_at: now
    };

    // Determine full day status
    const statuses = Object.values(availability.time_slots);
    if (statuses.every(s => s === 'booked')) {
      availability.full_day_status = 'booked';
    } else if (statuses.every(s => s === 'unavailable')) {
      availability.full_day_status = 'unavailable';
    } else if (statuses.some(s => s === 'booked')) {
      availability.full_day_status = 'tentative';
    }

    await setDoc(doc(db, AVAILABILITY_COLLECTION, docId), availability);
  },

  // Set full day availability
  async setFullDayAvailability(
    driverId: string,
    date: string,
    status: AvailabilityStatus,
    notes?: string
  ): Promise<void> {
    await this.setAvailability(driverId, date, {
      morning: status,
      afternoon: status,
      evening: status
    }, notes);
  },

  // Set availability for multiple dates (batch)
  async setAvailabilityBatch(
    driverId: string,
    dates: string[],
    status: AvailabilityStatus,
    notes?: string
  ): Promise<void> {
    const batch = writeBatch(db);
    const now = new Date().toISOString();

    for (const date of dates) {
      const docId = `${driverId}_${date}`;
      const availability: DriverAvailability = {
        id: docId,
        driver_id: driverId,
        date,
        time_slots: {
          morning: status,
          afternoon: status,
          evening: status
        },
        full_day_status: status,
        notes,
        created_at: now,
        updated_at: now
      };
      batch.set(doc(db, AVAILABILITY_COLLECTION, docId), availability);
    }

    await batch.commit();
  },

  // Mark slot as booked
  async markAsBooked(
    driverId: string,
    date: string,
    bookingId: string,
    slots: TimeSlot[]
  ): Promise<void> {
    const docId = `${driverId}_${date}`;
    const existing = await this.getAvailability(driverId, date);
    const now = new Date().toISOString();

    const timeSlots = existing?.time_slots || { morning: 'available', afternoon: 'available', evening: 'available' };

    if (slots.includes('full_day') || (slots.includes('morning') && slots.includes('afternoon') && slots.includes('evening'))) {
      timeSlots.morning = 'booked';
      timeSlots.afternoon = 'booked';
      timeSlots.evening = 'booked';
    } else {
      if (slots.includes('morning')) timeSlots.morning = 'booked';
      if (slots.includes('afternoon')) timeSlots.afternoon = 'booked';
      if (slots.includes('evening')) timeSlots.evening = 'booked';
    }

    const allBooked = Object.values(timeSlots).every(s => s === 'booked');

    await setDoc(doc(db, AVAILABILITY_COLLECTION, docId), {
      id: docId,
      driver_id: driverId,
      date,
      time_slots: timeSlots,
      full_day_status: allBooked ? 'booked' : 'tentative',
      booking_id: bookingId,
      created_at: existing?.created_at || now,
      updated_at: now
    });
  },

  // Cancel booking and free up slots
  async cancelBooking(driverId: string, date: string, slots: TimeSlot[]): Promise<void> {
    const docId = `${driverId}_${date}`;
    const existing = await this.getAvailability(driverId, date);

    if (!existing) return;

    const timeSlots = { ...existing.time_slots };

    if (slots.includes('full_day')) {
      timeSlots.morning = 'available';
      timeSlots.afternoon = 'available';
      timeSlots.evening = 'available';
    } else {
      if (slots.includes('morning')) timeSlots.morning = 'available';
      if (slots.includes('afternoon')) timeSlots.afternoon = 'available';
      if (slots.includes('evening')) timeSlots.evening = 'available';
    }

    await updateDoc(doc(db, AVAILABILITY_COLLECTION, docId), {
      time_slots: timeSlots,
      full_day_status: 'available',
      booking_id: null,
      updated_at: new Date().toISOString()
    });
  },

  // ==========================================
  // BLOCKED PERIODS
  // ==========================================

  // Block a period
  async blockPeriod(
    driverId: string,
    startDate: string,
    endDate: string,
    reason: BlockedPeriod['reason'],
    description?: string
  ): Promise<string> {
    const blockRef = doc(collection(db, BLOCKED_PERIODS_COLLECTION));
    const block: BlockedPeriod = {
      id: blockRef.id,
      driver_id: driverId,
      start_date: startDate,
      end_date: endDate,
      reason,
      description,
      created_at: new Date().toISOString()
    };

    await setDoc(blockRef, block);

    // Mark all dates in range as unavailable
    const dates = this.getDatesBetween(startDate, endDate);
    await this.setAvailabilityBatch(driverId, dates, 'unavailable', `Blocked: ${reason}`);

    return blockRef.id;
  },

  // Get blocked periods
  async getBlockedPeriods(driverId: string): Promise<BlockedPeriod[]> {
    const q = query(
      collection(db, BLOCKED_PERIODS_COLLECTION),
      where('driver_id', '==', driverId),
      orderBy('start_date', 'desc')
    );

    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as BlockedPeriod));
  },

  // Remove blocked period
  async removeBlockedPeriod(blockId: string): Promise<void> {
    const blockDoc = await getDoc(doc(db, BLOCKED_PERIODS_COLLECTION, blockId));
    if (!blockDoc.exists()) return;

    const block = blockDoc.data() as BlockedPeriod;

    // Mark dates as available again
    const dates = this.getDatesBetween(block.start_date, block.end_date);
    await this.setAvailabilityBatch(block.driver_id, dates, 'available');

    await deleteDoc(doc(db, BLOCKED_PERIODS_COLLECTION, blockId));
  },

  // ==========================================
  // SETTINGS
  // ==========================================

  // Get driver settings
  async getSettings(driverId: string): Promise<AvailabilitySettings> {
    const docRef = doc(db, SETTINGS_COLLECTION, driverId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return docSnap.data() as AvailabilitySettings;
    }

    // Return defaults if not set
    return {
      driver_id: driverId,
      ...DEFAULT_AVAILABILITY_SETTINGS,
      updated_at: new Date().toISOString()
    };
  },

  // Save driver settings
  async saveSettings(driverId: string, settings: Partial<AvailabilitySettings>): Promise<void> {
    const current = await this.getSettings(driverId);
    await setDoc(doc(db, SETTINGS_COLLECTION, driverId), {
      ...current,
      ...settings,
      driver_id: driverId,
      updated_at: new Date().toISOString()
    });
  },

  // ==========================================
  // CALENDAR VIEW HELPERS
  // ==========================================

  // Get calendar data for a month
  async getMonthCalendar(driverId: string, year: number, month: number): Promise<DayAvailability[]> {
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);

    const startStr = this.formatDate(startDate);
    const endStr = this.formatDate(endDate);

    const [availability, blockedPeriods, settings] = await Promise.all([
      this.getAvailabilityRange(driverId, startStr, endStr),
      this.getBlockedPeriods(driverId),
      this.getSettings(driverId)
    ]);

    const availabilityMap = new Map(availability.map(a => [a.date, a]));
    const calendar: DayAvailability[] = [];

    for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
      const dateStr = this.formatDate(d);
      const dayOfWeek = d.getDay();

      // Check if blocked
      const block = blockedPeriods.find(b =>
        dateStr >= b.start_date && dateStr <= b.end_date
      );

      const avail = availabilityMap.get(dateStr);

      let status: AvailabilityStatus;
      let slots = { morning: 'available' as AvailabilityStatus, afternoon: 'available' as AvailabilityStatus, evening: 'available' as AvailabilityStatus };

      if (block) {
        status = 'unavailable';
        slots = { morning: 'unavailable', afternoon: 'unavailable', evening: 'unavailable' };
      } else if (avail) {
        status = avail.full_day_status;
        slots = avail.time_slots;
      } else if (!settings.working_days.includes(dayOfWeek)) {
        status = 'unavailable';
        slots = { morning: 'unavailable', afternoon: 'unavailable', evening: 'unavailable' };
      } else {
        status = settings.default_availability as AvailabilityStatus;
        if (status === 'unavailable') {
          slots = { morning: 'unavailable', afternoon: 'unavailable', evening: 'unavailable' };
        }
      }

      calendar.push({
        date: dateStr,
        status,
        slots,
        booking_id: avail?.booking_id,
        is_blocked: !!block,
        block_reason: block?.reason
      });
    }

    return calendar;
  },

  // Check if driver is available for booking
  async checkAvailability(
    driverId: string,
    date: string,
    slots: TimeSlot[]
  ): Promise<{ available: boolean; conflicts: TimeSlot[] }> {
    const avail = await this.getAvailability(driverId, date);
    const settings = await this.getSettings(driverId);

    // Check minimum notice
    const bookingDate = new Date(date);
    const now = new Date();
    const hoursUntilBooking = (bookingDate.getTime() - now.getTime()) / (1000 * 60 * 60);

    if (hoursUntilBooking < settings.minimum_notice_hours) {
      return { available: false, conflicts: slots };
    }

    // Check advance booking limit
    const daysInAdvance = Math.ceil(hoursUntilBooking / 24);
    if (daysInAdvance > settings.advance_booking_days) {
      return { available: false, conflicts: slots };
    }

    // Check working day
    const dayOfWeek = bookingDate.getDay();
    if (!settings.working_days.includes(dayOfWeek)) {
      return { available: false, conflicts: slots };
    }

    // Check slot availability
    const conflicts: TimeSlot[] = [];

    if (!avail) {
      // No explicit availability set - use default
      if (settings.default_availability === 'unavailable') {
        return { available: false, conflicts: slots };
      }
      return { available: true, conflicts: [] };
    }

    if (slots.includes('full_day')) {
      if (avail.full_day_status !== 'available') {
        Object.entries(avail.time_slots).forEach(([slot, status]) => {
          if (status !== 'available') conflicts.push(slot as TimeSlot);
        });
      }
    } else {
      slots.forEach(slot => {
        if (slot !== 'full_day' && avail.time_slots[slot] !== 'available') {
          conflicts.push(slot);
        }
      });
    }

    return {
      available: conflicts.length === 0,
      conflicts
    };
  },

  // Find available drivers for a date
  async findAvailableDrivers(date: string, slots: TimeSlot[]): Promise<string[]> {
    // This would typically query all drivers - for now returns placeholder
    // In a real implementation, you'd query by date and filter
    const q = query(
      collection(db, AVAILABILITY_COLLECTION),
      where('date', '==', date)
    );

    const snapshot = await getDocs(q);
    const availableDrivers: string[] = [];

    snapshot.docs.forEach(doc => {
      const avail = doc.data() as DriverAvailability;
      let isAvailable = true;

      if (slots.includes('full_day')) {
        isAvailable = avail.full_day_status === 'available';
      } else {
        slots.forEach(slot => {
          if (slot !== 'full_day' && avail.time_slots[slot as keyof typeof avail.time_slots] !== 'available') {
            isAvailable = false;
          }
        });
      }

      if (isAvailable) {
        availableDrivers.push(avail.driver_id);
      }
    });

    return availableDrivers;
  },

  // ==========================================
  // UTILITY FUNCTIONS
  // ==========================================

  formatDate(date: Date): string {
    return date.toISOString().split('T')[0];
  },

  getDatesBetween(startDate: string, endDate: string): string[] {
    const dates: string[] = [];
    const current = new Date(startDate);
    const end = new Date(endDate);

    while (current <= end) {
      dates.push(this.formatDate(current));
      current.setDate(current.getDate() + 1);
    }

    return dates;
  },

  getTimeSlotLabel(slot: TimeSlot): string {
    const labels: Record<TimeSlot, string> = {
      morning: 'Morning (6 AM - 12 PM)',
      afternoon: 'Afternoon (12 PM - 6 PM)',
      evening: 'Evening (6 PM - 10 PM)',
      full_day: 'Full Day'
    };
    return labels[slot];
  },

  getStatusColor(status: AvailabilityStatus): string {
    const colors: Record<AvailabilityStatus, string> = {
      available: 'bg-green-100 text-green-800 border-green-300',
      booked: 'bg-blue-100 text-blue-800 border-blue-300',
      unavailable: 'bg-gray-100 text-gray-500 border-gray-300',
      tentative: 'bg-yellow-100 text-yellow-800 border-yellow-300'
    };
    return colors[status];
  }
};

export default driverAvailabilityService;
