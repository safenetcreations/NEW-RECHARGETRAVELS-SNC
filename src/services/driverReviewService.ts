import {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  updateDoc,
  deleteDoc,
  Timestamp,
  runTransaction,
  writeBatch
} from 'firebase/firestore';
import { db } from '../config/firebase';

// ==========================================
// TYPES & INTERFACES
// ==========================================

export interface DriverReview {
  id?: string;
  driver_id: string;
  booking_id: string;
  customer_id: string;
  customer_name: string;
  customer_photo?: string;

  // Ratings (1-5 stars)
  overall_rating: number;
  punctuality_rating?: number;
  vehicle_rating?: number;
  communication_rating?: number;
  knowledge_rating?: number;

  // Written review
  review_text?: string;
  review_title?: string;

  // Trip context
  trip_type?: 'airport_transfer' | 'day_tour' | 'multi_day' | 'custom';
  trip_date: string;
  trip_route?: string;

  // Media
  photos?: string[];

  // Status
  status: 'pending' | 'published' | 'flagged' | 'removed';
  is_verified: boolean;
  is_featured: boolean;

  // Driver response
  driver_response?: string;
  driver_response_date?: string;

  // Helpful votes
  helpful_count: number;
  not_helpful_count: number;

  // Admin
  moderated_by?: string;
  moderated_at?: string;
  moderation_notes?: string;

  created_at: string;
  updated_at: string;
}

export interface ReviewStats {
  driver_id: string;
  total_reviews: number;
  average_rating: number;
  rating_distribution: {
    five_star: number;
    four_star: number;
    three_star: number;
    two_star: number;
    one_star: number;
  };
  average_punctuality: number;
  average_vehicle: number;
  average_communication: number;
  average_knowledge: number;
  featured_reviews: string[];
  last_review_date?: string;
}

export interface ReviewSummary {
  id: string;
  customer_name: string;
  customer_photo?: string;
  overall_rating: number;
  review_text?: string;
  trip_date: string;
  is_verified: boolean;
  helpful_count: number;
  created_at: string;
}

// ==========================================
// REVIEW SERVICE
// ==========================================

const REVIEWS_COLLECTION = 'driver_reviews';
const REVIEW_STATS_COLLECTION = 'driver_review_stats';

export const driverReviewService = {
  // Submit a new review
  async submitReview(review: Omit<DriverReview, 'id' | 'created_at' | 'updated_at' | 'status' | 'is_verified' | 'is_featured' | 'helpful_count' | 'not_helpful_count'>): Promise<string> {
    const reviewRef = doc(collection(db, REVIEWS_COLLECTION));
    const now = new Date().toISOString();

    const newReview: DriverReview = {
      ...review,
      id: reviewRef.id,
      status: 'published', // Auto-publish reviews
      is_verified: true, // Verified if booking exists
      is_featured: false,
      helpful_count: 0,
      not_helpful_count: 0,
      created_at: now,
      updated_at: now
    };

    await setDoc(reviewRef, newReview);

    // Update driver's review stats
    await this.updateDriverStats(review.driver_id);

    return reviewRef.id;
  },

  // Get review by ID
  async getReviewById(reviewId: string): Promise<DriverReview | null> {
    const reviewDoc = await getDoc(doc(db, REVIEWS_COLLECTION, reviewId));
    if (!reviewDoc.exists()) return null;
    return { id: reviewDoc.id, ...reviewDoc.data() } as DriverReview;
  },

  // Get all reviews for a driver
  async getDriverReviews(driverId: string, limitCount: number = 20): Promise<DriverReview[]> {
    const q = query(
      collection(db, REVIEWS_COLLECTION),
      where('driver_id', '==', driverId),
      where('status', '==', 'published'),
      orderBy('created_at', 'desc'),
      limit(limitCount)
    );

    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as DriverReview));
  },

  // Get featured reviews for a driver
  async getFeaturedReviews(driverId: string, limitCount: number = 3): Promise<DriverReview[]> {
    const q = query(
      collection(db, REVIEWS_COLLECTION),
      where('driver_id', '==', driverId),
      where('is_featured', '==', true),
      where('status', '==', 'published'),
      orderBy('created_at', 'desc'),
      limit(limitCount)
    );

    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as DriverReview));
  },

  // Get reviews by customer
  async getCustomerReviews(customerId: string): Promise<DriverReview[]> {
    const q = query(
      collection(db, REVIEWS_COLLECTION),
      where('customer_id', '==', customerId),
      orderBy('created_at', 'desc')
    );

    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as DriverReview));
  },

  // Check if customer already reviewed a booking
  async hasReviewedBooking(bookingId: string): Promise<boolean> {
    const q = query(
      collection(db, REVIEWS_COLLECTION),
      where('booking_id', '==', bookingId),
      limit(1)
    );

    const snapshot = await getDocs(q);
    return !snapshot.empty;
  },

  // Add driver response to review
  async addDriverResponse(reviewId: string, response: string): Promise<void> {
    await updateDoc(doc(db, REVIEWS_COLLECTION, reviewId), {
      driver_response: response,
      driver_response_date: new Date().toISOString(),
      updated_at: new Date().toISOString()
    });
  },

  // Mark review as helpful
  async markHelpful(reviewId: string, isHelpful: boolean): Promise<void> {
    const reviewRef = doc(db, REVIEWS_COLLECTION, reviewId);
    const field = isHelpful ? 'helpful_count' : 'not_helpful_count';

    await runTransaction(db, async (transaction) => {
      const reviewDoc = await transaction.get(reviewRef);
      if (!reviewDoc.exists()) throw new Error('Review not found');

      const currentCount = reviewDoc.data()[field] || 0;
      transaction.update(reviewRef, {
        [field]: currentCount + 1,
        updated_at: new Date().toISOString()
      });
    });
  },

  // Toggle featured status (admin)
  async toggleFeatured(reviewId: string, isFeatured: boolean): Promise<void> {
    await updateDoc(doc(db, REVIEWS_COLLECTION, reviewId), {
      is_featured: isFeatured,
      updated_at: new Date().toISOString()
    });
  },

  // Flag review for moderation
  async flagReview(reviewId: string, reason: string): Promise<void> {
    await updateDoc(doc(db, REVIEWS_COLLECTION, reviewId), {
      status: 'flagged',
      moderation_notes: reason,
      updated_at: new Date().toISOString()
    });
  },

  // Remove review (admin)
  async removeReview(reviewId: string, adminId: string, reason: string): Promise<void> {
    const review = await this.getReviewById(reviewId);
    if (!review) throw new Error('Review not found');

    await updateDoc(doc(db, REVIEWS_COLLECTION, reviewId), {
      status: 'removed',
      moderated_by: adminId,
      moderated_at: new Date().toISOString(),
      moderation_notes: reason,
      updated_at: new Date().toISOString()
    });

    // Update driver stats
    await this.updateDriverStats(review.driver_id);
  },

  // Get driver review stats
  async getDriverStats(driverId: string): Promise<ReviewStats | null> {
    const statsDoc = await getDoc(doc(db, REVIEW_STATS_COLLECTION, driverId));
    if (!statsDoc.exists()) return null;
    return statsDoc.data() as ReviewStats;
  },

  // Update driver's review statistics
  async updateDriverStats(driverId: string): Promise<ReviewStats> {
    const reviews = await this.getDriverReviews(driverId, 1000);
    const publishedReviews = reviews.filter(r => r.status === 'published');

    const stats: ReviewStats = {
      driver_id: driverId,
      total_reviews: publishedReviews.length,
      average_rating: 0,
      rating_distribution: {
        five_star: 0,
        four_star: 0,
        three_star: 0,
        two_star: 0,
        one_star: 0
      },
      average_punctuality: 0,
      average_vehicle: 0,
      average_communication: 0,
      average_knowledge: 0,
      featured_reviews: [],
      last_review_date: publishedReviews[0]?.created_at
    };

    if (publishedReviews.length > 0) {
      // Calculate averages
      let totalRating = 0;
      let totalPunctuality = 0;
      let totalVehicle = 0;
      let totalCommunication = 0;
      let totalKnowledge = 0;
      let punctualityCount = 0;
      let vehicleCount = 0;
      let communicationCount = 0;
      let knowledgeCount = 0;

      publishedReviews.forEach(review => {
        totalRating += review.overall_rating;

        // Distribution
        if (review.overall_rating === 5) stats.rating_distribution.five_star++;
        else if (review.overall_rating === 4) stats.rating_distribution.four_star++;
        else if (review.overall_rating === 3) stats.rating_distribution.three_star++;
        else if (review.overall_rating === 2) stats.rating_distribution.two_star++;
        else stats.rating_distribution.one_star++;

        // Sub-ratings
        if (review.punctuality_rating) {
          totalPunctuality += review.punctuality_rating;
          punctualityCount++;
        }
        if (review.vehicle_rating) {
          totalVehicle += review.vehicle_rating;
          vehicleCount++;
        }
        if (review.communication_rating) {
          totalCommunication += review.communication_rating;
          communicationCount++;
        }
        if (review.knowledge_rating) {
          totalKnowledge += review.knowledge_rating;
          knowledgeCount++;
        }

        // Featured reviews
        if (review.is_featured && review.id) {
          stats.featured_reviews.push(review.id);
        }
      });

      stats.average_rating = Math.round((totalRating / publishedReviews.length) * 10) / 10;
      stats.average_punctuality = punctualityCount > 0 ? Math.round((totalPunctuality / punctualityCount) * 10) / 10 : 0;
      stats.average_vehicle = vehicleCount > 0 ? Math.round((totalVehicle / vehicleCount) * 10) / 10 : 0;
      stats.average_communication = communicationCount > 0 ? Math.round((totalCommunication / communicationCount) * 10) / 10 : 0;
      stats.average_knowledge = knowledgeCount > 0 ? Math.round((totalKnowledge / knowledgeCount) * 10) / 10 : 0;
    }

    // Save stats
    await setDoc(doc(db, REVIEW_STATS_COLLECTION, driverId), stats);

    // Update driver's average rating in main profile
    try {
      const driverRef = doc(db, 'drivers', driverId);
      await updateDoc(driverRef, {
        average_rating: stats.average_rating,
        total_reviews: stats.total_reviews,
        updated_at: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error updating driver rating:', error);
    }

    return stats;
  },

  // Get recent reviews across all drivers (for admin/homepage)
  async getRecentReviews(limitCount: number = 10): Promise<DriverReview[]> {
    const q = query(
      collection(db, REVIEWS_COLLECTION),
      where('status', '==', 'published'),
      orderBy('created_at', 'desc'),
      limit(limitCount)
    );

    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as DriverReview));
  },

  // Get flagged reviews (for admin moderation)
  async getFlaggedReviews(): Promise<DriverReview[]> {
    const q = query(
      collection(db, REVIEWS_COLLECTION),
      where('status', '==', 'flagged'),
      orderBy('created_at', 'desc')
    );

    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as DriverReview));
  },

  // Get review summary for display
  getReviewSummary(review: DriverReview): ReviewSummary {
    return {
      id: review.id || '',
      customer_name: review.customer_name,
      customer_photo: review.customer_photo,
      overall_rating: review.overall_rating,
      review_text: review.review_text,
      trip_date: review.trip_date,
      is_verified: review.is_verified,
      helpful_count: review.helpful_count,
      created_at: review.created_at
    };
  }
};

export default driverReviewService;
