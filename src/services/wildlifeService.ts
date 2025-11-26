
// Re-export all wildlife service functions from their respective modules
export * from './wildlife/types';
export * from './wildlife/lodgeService';
export * from './wildlife/activityService';
export * from './wildlife/packageService';
export * from './wildlife/bookingService';
export * from './wildlife/reviewService';
export * from './wildlife/newsletterService';
export * from './wildlife/inquiryService';
export * from './wildlife/utils';

// Import and re-export default object for backward compatibility
import {
  getLodges,
  getLodgeById,
  getFeaturedLodges,
  getWildlifeActivities,
  getWildlifeActivityById,
  getFeaturedWildlifeActivities,
  createSafariPackage,
  getUserSafariPackages,
  updateSafariPackage,
  createWildlifeBooking,
  getUserWildlifeBookings,
  updateWildlifeBookingStatus,
  getWildlifeReviews,
  createWildlifeReview,
  subscribeWildlifeNewsletter,
  createInquiry,
  calculateWildlifePackagePrice,
  getBestWildlifeSeasons
} from './wildlife';

export default {
  getLodges,
  getLodgeById,
  getFeaturedLodges,
  getWildlifeActivities,
  getWildlifeActivityById,
  getFeaturedWildlifeActivities,
  createSafariPackage,
  getUserSafariPackages,
  updateSafariPackage,
  createWildlifeBooking,
  getUserWildlifeBookings,
  updateWildlifeBookingStatus,
  getWildlifeReviews,
  createWildlifeReview,
  subscribeWildlifeNewsletter,
  createInquiry,
  calculateWildlifePackagePrice,
  getBestWildlifeSeasons
};
