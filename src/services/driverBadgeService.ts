import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  addDoc,
  updateDoc,
  query,
  where,
  orderBy,
  deleteDoc,
  increment,
  serverTimestamp
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import {
  BadgeType,
  DriverBadge,
  DriverAchievement,
  DriverSocialProfile,
  DriverBatchOperation,
  BADGE_DEFINITIONS
} from '@/types/driver';

const BADGES_COLLECTION = 'driver_badges';
const ACHIEVEMENTS_COLLECTION = 'driver_achievements';
const SOCIAL_PROFILES_COLLECTION = 'driver_social_profiles';
const BATCH_OPERATIONS_COLLECTION = 'driver_batch_operations';
const DRIVERS_COLLECTION = 'drivers';

const nowIso = () => new Date().toISOString();

// ==========================================
// BADGE MANAGEMENT
// ==========================================

/**
 * Award a badge to a driver
 */
export async function awardBadge(
  driverId: string,
  badgeType: BadgeType,
  awardedBy: string = 'system',
  expiryDate?: string,
  criteriaMet?: Record<string, unknown>
): Promise<DriverBadge> {
  const definition = BADGE_DEFINITIONS[badgeType];
  if (!definition) {
    throw new Error(`Invalid badge type: ${badgeType}`);
  }

  // Check if badge already exists and is active
  const existingBadge = await getDriverBadge(driverId, badgeType);
  if (existingBadge?.is_active) {
    throw new Error(`Driver already has active badge: ${badgeType}`);
  }

  const badge: Omit<DriverBadge, 'id'> = {
    driver_id: driverId,
    ...definition,
    awarded_date: nowIso(),
    awarded_by: awardedBy,
    expiry_date: expiryDate,
    is_active: true,
    criteria_met: criteriaMet
  };

  const docRef = await addDoc(collection(db, BADGES_COLLECTION), badge);

  // Update social profile badges array
  await updateSocialProfileBadges(driverId);

  return { id: docRef.id, ...badge };
}

/**
 * Revoke a badge from a driver
 */
export async function revokeBadge(driverId: string, badgeType: BadgeType): Promise<void> {
  const badge = await getDriverBadge(driverId, badgeType);
  if (badge?.id) {
    await updateDoc(doc(db, BADGES_COLLECTION, badge.id), {
      is_active: false,
      revoked_at: nowIso()
    });
    await updateSocialProfileBadges(driverId);
  }
}

/**
 * Get a specific badge for a driver
 */
export async function getDriverBadge(
  driverId: string,
  badgeType: BadgeType
): Promise<DriverBadge | null> {
  const q = query(
    collection(db, BADGES_COLLECTION),
    where('driver_id', '==', driverId),
    where('badge_type', '==', badgeType),
    where('is_active', '==', true)
  );
  const snap = await getDocs(q);
  if (snap.empty) return null;
  return { id: snap.docs[0].id, ...snap.docs[0].data() } as DriverBadge;
}

/**
 * Get all badges for a driver
 */
export async function getDriverBadges(driverId: string, activeOnly = true): Promise<DriverBadge[]> {
  let q = query(
    collection(db, BADGES_COLLECTION),
    where('driver_id', '==', driverId),
    orderBy('awarded_date', 'desc')
  );

  if (activeOnly) {
    q = query(
      collection(db, BADGES_COLLECTION),
      where('driver_id', '==', driverId),
      where('is_active', '==', true),
      orderBy('awarded_date', 'desc')
    );
  }

  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() } as DriverBadge));
}

/**
 * Check and auto-award badges based on driver stats
 */
export async function checkAndAwardAutoBadges(driverId: string): Promise<DriverBadge[]> {
  const awarded: DriverBadge[] = [];

  // Get driver data
  const driverRef = doc(db, DRIVERS_COLLECTION, driverId);
  const driverSnap = await getDoc(driverRef);
  if (!driverSnap.exists()) return awarded;

  const driver = driverSnap.data();

  // Get social profile for stats
  const socialProfile = await getDriverSocialProfile(driverId);

  // Check SLTDA verified
  if (driver.is_sltda_approved && driver.sltda_license_expiry) {
    const expiry = new Date(driver.sltda_license_expiry);
    if (expiry > new Date()) {
      try {
        const badge = await awardBadge(driverId, 'sltda_verified', 'system', driver.sltda_license_expiry);
        awarded.push(badge);
      } catch { /* Already has badge */ }
    }
  }

  // Check police cleared
  if (driver.police_clearance_expiry) {
    const expiry = new Date(driver.police_clearance_expiry);
    if (expiry > new Date()) {
      try {
        const badge = await awardBadge(driverId, 'police_cleared', 'system', driver.police_clearance_expiry);
        awarded.push(badge);
      } catch { /* Already has badge */ }
    }
  }

  // Check 5-star driver
  if (driver.average_rating === 5.0 && (driver.total_reviews || 0) >= 5) {
    try {
      const badge = await awardBadge(driverId, 'five_star_driver', 'system', undefined, {
        rating: 5.0,
        reviews: driver.total_reviews
      });
      awarded.push(badge);
    } catch { /* Already has badge */ }
  }

  // Check top rated (4.8+ with 10+ reviews)
  if ((driver.average_rating || 0) >= 4.8 && (driver.total_reviews || 0) >= 10) {
    try {
      const badge = await awardBadge(driverId, 'top_rated', 'system', undefined, {
        rating: driver.average_rating,
        reviews: driver.total_reviews
      });
      awarded.push(badge);
    } catch { /* Already has badge */ }
  }

  // Check veteran driver (10+ years)
  if ((driver.years_experience || 0) >= 10) {
    try {
      const badge = await awardBadge(driverId, 'veteran_driver', 'system', undefined, {
        years: driver.years_experience
      });
      awarded.push(badge);
    } catch { /* Already has badge */ }
  }

  // Check language expert (3+ languages)
  if ((driver.specialty_languages?.length || 0) >= 3) {
    try {
      const badge = await awardBadge(driverId, 'language_expert', 'system', undefined, {
        languages: driver.specialty_languages
      });
      awarded.push(badge);
    } catch { /* Already has badge */ }
  }

  // Check trip milestones
  if (socialProfile) {
    const trips = socialProfile.total_trips || 0;

    if (trips >= 1) {
      try {
        const badge = await awardBadge(driverId, 'first_trip', 'system');
        awarded.push(badge);
      } catch { /* Already has badge */ }
    }

    if (trips >= 100) {
      try {
        const badge = await awardBadge(driverId, '100_trips', 'system', undefined, { trips });
        awarded.push(badge);
      } catch { /* Already has badge */ }
    }

    if (trips >= 500) {
      try {
        const badge = await awardBadge(driverId, '500_trips', 'system', undefined, { trips });
        awarded.push(badge);
      } catch { /* Already has badge */ }
    }

    if (trips >= 1000) {
      try {
        const badge = await awardBadge(driverId, '1000_trips', 'system', undefined, { trips });
        awarded.push(badge);
      } catch { /* Already has badge */ }
    }

    // Check quick responder (avg response < 5 min)
    if (socialProfile.response_time_avg && socialProfile.response_time_avg <= 5) {
      try {
        const badge = await awardBadge(driverId, 'quick_responder', 'system', undefined, {
          avgResponseTime: socialProfile.response_time_avg
        });
        awarded.push(badge);
      } catch { /* Already has badge */ }
    }

    // Check customer favorite (30%+ repeat rate)
    if (socialProfile.repeat_customer_rate && socialProfile.repeat_customer_rate >= 30) {
      try {
        const badge = await awardBadge(driverId, 'customer_favorite', 'system', undefined, {
          repeatRate: socialProfile.repeat_customer_rate
        });
        awarded.push(badge);
      } catch { /* Already has badge */ }
    }
  }

  return awarded;
}

// ==========================================
// SOCIAL PROFILE MANAGEMENT
// ==========================================

/**
 * Get or create a driver's social profile
 */
export async function getOrCreateSocialProfile(driverId: string): Promise<DriverSocialProfile> {
  const existing = await getDriverSocialProfile(driverId);
  if (existing) return existing;

  const newProfile: Omit<DriverSocialProfile, 'id'> = {
    driver_id: driverId,
    total_trips: 0,
    total_km_driven: 0,
    total_happy_customers: 0,
    repeat_customer_rate: 0,
    response_time_avg: 0,
    acceptance_rate: 100,
    badges: [],
    achievements: [],
    badge_showcase: [],
    profile_views: 0,
    profile_likes: 0,
    inquiry_count: 0,
    profile_completion: 0,
    last_active: nowIso(),
    created_at: nowIso(),
    updated_at: nowIso()
  };

  await setDoc(doc(db, SOCIAL_PROFILES_COLLECTION, driverId), newProfile);
  return { id: driverId, ...newProfile };
}

/**
 * Get a driver's social profile
 */
export async function getDriverSocialProfile(driverId: string): Promise<DriverSocialProfile | null> {
  const docRef = doc(db, SOCIAL_PROFILES_COLLECTION, driverId);
  const snap = await getDoc(docRef);
  if (!snap.exists()) return null;
  return { id: snap.id, ...snap.data() } as DriverSocialProfile;
}

/**
 * Update social profile
 */
export async function updateSocialProfile(
  driverId: string,
  updates: Partial<DriverSocialProfile>
): Promise<void> {
  const docRef = doc(db, SOCIAL_PROFILES_COLLECTION, driverId);
  await updateDoc(docRef, {
    ...updates,
    updated_at: nowIso()
  });
}

/**
 * Update badges array in social profile
 */
async function updateSocialProfileBadges(driverId: string): Promise<void> {
  const badges = await getDriverBadges(driverId, true);
  const badgeIds = badges.map(b => b.id).filter(Boolean) as string[];

  await getOrCreateSocialProfile(driverId);
  await updateSocialProfile(driverId, {
    badges: badgeIds,
    badge_showcase: badgeIds.slice(0, 5) // Top 5 badges
  });
}

/**
 * Increment profile view count
 */
export async function incrementProfileViews(driverId: string): Promise<void> {
  const docRef = doc(db, SOCIAL_PROFILES_COLLECTION, driverId);
  await updateDoc(docRef, {
    profile_views: increment(1),
    updated_at: nowIso()
  });
}

/**
 * Increment inquiry count
 */
export async function incrementInquiryCount(driverId: string): Promise<void> {
  const docRef = doc(db, SOCIAL_PROFILES_COLLECTION, driverId);
  await updateDoc(docRef, {
    inquiry_count: increment(1),
    updated_at: nowIso()
  });
}

/**
 * Calculate profile completion percentage
 */
export async function calculateProfileCompletion(driverId: string): Promise<number> {
  const driverRef = doc(db, DRIVERS_COLLECTION, driverId);
  const driverSnap = await getDoc(driverRef);
  if (!driverSnap.exists()) return 0;

  const driver = driverSnap.data();
  const socialProfile = await getDriverSocialProfile(driverId);

  let completed = 0;
  const totalFields = 20;

  // Basic info
  if (driver.full_name) completed++;
  if (driver.email) completed++;
  if (driver.phone) completed++;
  if (driver.biography) completed++;
  if (driver.specialty_languages?.length) completed++;
  if (driver.years_experience) completed++;
  if (driver.tier) completed++;

  // Documents
  if (driver.sltda_license_number) completed++;
  if (driver.drivers_license_number) completed++;
  if (driver.national_id_number) completed++;

  // Vehicle
  if (driver.vehicle_preference) completed++;

  // Rates
  if (driver.daily_rate) completed++;
  if (driver.hourly_rate) completed++;

  // Photos
  if (driver.profile_photo) completed++;
  if (driver.cover_image) completed++;

  // Social profile
  if (socialProfile?.tagline) completed++;
  if (socialProfile?.about_me) completed++;
  if (socialProfile?.photo_gallery?.length) completed++;
  if (socialProfile?.specialties?.length) completed++;
  if (socialProfile?.fun_facts?.length) completed++;

  const percentage = Math.round((completed / totalFields) * 100);

  // Update profile completion
  if (socialProfile) {
    await updateSocialProfile(driverId, { profile_completion: percentage });
  }

  return percentage;
}

// ==========================================
// ACHIEVEMENTS
// ==========================================

/**
 * Award an achievement
 */
export async function awardAchievement(
  driverId: string,
  achievement: Omit<DriverAchievement, 'id' | 'driver_id' | 'unlocked_date' | 'is_unlocked'>
): Promise<DriverAchievement> {
  const fullAchievement: Omit<DriverAchievement, 'id'> = {
    ...achievement,
    driver_id: driverId,
    unlocked_date: nowIso(),
    is_unlocked: true
  };

  const docRef = await addDoc(collection(db, ACHIEVEMENTS_COLLECTION), fullAchievement);
  return { id: docRef.id, ...fullAchievement };
}

/**
 * Get driver achievements
 */
export async function getDriverAchievements(driverId: string): Promise<DriverAchievement[]> {
  const q = query(
    collection(db, ACHIEVEMENTS_COLLECTION),
    where('driver_id', '==', driverId),
    orderBy('unlocked_date', 'desc')
  );
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() } as DriverAchievement));
}

// ==========================================
// BATCH OPERATIONS & ANALYTICS
// ==========================================

/**
 * Get or create batch operation record for a period
 */
export async function getOrCreateBatchOperation(
  driverId: string,
  periodType: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly',
  periodStart: string,
  periodEnd: string
): Promise<DriverBatchOperation> {
  const q = query(
    collection(db, BATCH_OPERATIONS_COLLECTION),
    where('driver_id', '==', driverId),
    where('period_type', '==', periodType),
    where('period_start', '==', periodStart)
  );

  const snap = await getDocs(q);
  if (!snap.empty) {
    return { id: snap.docs[0].id, ...snap.docs[0].data() } as DriverBatchOperation;
  }

  const newOp: Omit<DriverBatchOperation, 'id'> = {
    driver_id: driverId,
    period_type: periodType,
    period_start: periodStart,
    period_end: periodEnd,
    total_trips: 0,
    completed_trips: 0,
    cancelled_trips: 0,
    no_show_trips: 0,
    total_km: 0,
    total_hours: 0,
    gross_earnings: 0,
    platform_fees: 0,
    commission_paid: 0,
    bonuses_earned: 0,
    net_earnings: 0,
    tips_received: 0,
    average_rating: 0,
    on_time_rate: 100,
    acceptance_rate: 100,
    completion_rate: 100,
    response_time_avg: 0,
    created_at: nowIso()
  };

  const docRef = await addDoc(collection(db, BATCH_OPERATIONS_COLLECTION), newOp);
  return { id: docRef.id, ...newOp };
}

/**
 * Update batch operation metrics
 */
export async function updateBatchOperation(
  operationId: string,
  updates: Partial<DriverBatchOperation>
): Promise<void> {
  const docRef = doc(db, BATCH_OPERATIONS_COLLECTION, operationId);
  await updateDoc(docRef, updates);
}

/**
 * Get driver's batch operations history
 */
export async function getDriverBatchHistory(
  driverId: string,
  periodType?: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly',
  limit = 12
): Promise<DriverBatchOperation[]> {
  let q = query(
    collection(db, BATCH_OPERATIONS_COLLECTION),
    where('driver_id', '==', driverId),
    orderBy('period_start', 'desc')
  );

  if (periodType) {
    q = query(
      collection(db, BATCH_OPERATIONS_COLLECTION),
      where('driver_id', '==', driverId),
      where('period_type', '==', periodType),
      orderBy('period_start', 'desc')
    );
  }

  const snap = await getDocs(q);
  return snap.docs.slice(0, limit).map(d => ({ id: d.id, ...d.data() } as DriverBatchOperation));
}

/**
 * Get current month's batch operation
 */
export async function getCurrentMonthBatch(driverId: string): Promise<DriverBatchOperation> {
  const now = new Date();
  const periodStart = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-01`;
  const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
  const periodEnd = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${lastDay}`;

  return getOrCreateBatchOperation(driverId, 'monthly', periodStart, periodEnd);
}

// ==========================================
// HELPER FUNCTIONS
// ==========================================

/**
 * Get all available badge types
 */
export function getAllBadgeTypes(): BadgeType[] {
  return Object.keys(BADGE_DEFINITIONS) as BadgeType[];
}

/**
 * Get badge definition
 */
export function getBadgeDefinition(badgeType: BadgeType) {
  return BADGE_DEFINITIONS[badgeType];
}

/**
 * Check if badge is expired
 */
export function isBadgeExpired(badge: DriverBadge): boolean {
  if (!badge.expiry_date) return false;
  return new Date(badge.expiry_date) < new Date();
}

/**
 * Get expiring badges (within X days)
 */
export async function getExpiringBadges(driverId: string, days = 30): Promise<DriverBadge[]> {
  const badges = await getDriverBadges(driverId, true);
  const threshold = new Date();
  threshold.setDate(threshold.getDate() + days);

  return badges.filter(b => {
    if (!b.expiry_date) return false;
    const expiry = new Date(b.expiry_date);
    return expiry <= threshold && expiry > new Date();
  });
}
