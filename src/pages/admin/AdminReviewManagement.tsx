/**
 * Admin Review Management Page
 * Allows administrators to moderate, approve, reject, and manage vehicle reviews
 */
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Star,
  MessageSquare,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  Search,
  Car,
  User,
  Calendar,
  Eye,
  EyeOff,
  Trash2,
  Flag,
  BarChart3,
  Filter,
  RefreshCw,
  AlertCircle,
  Shield,
  Image as ImageIcon,
  ExternalLink
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { db } from '@/lib/firebase';
import {
  collection,
  query,
  where,
  orderBy,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
  limit,
  startAfter,
  getCountFromServer
} from 'firebase/firestore';
import type { VehicleReview, Vehicle } from '../../types/vehicleRental';

// Extended review type for admin
interface AdminReview extends VehicleReview {
  vehicleData?: Vehicle;
  customerEmail?: string;
  ownerEmail?: string;
  moderationStatus?: 'pending' | 'approved' | 'rejected' | 'flagged';
  moderationNote?: string;
  moderatedBy?: string;
  moderatedAt?: Date;
}

const REVIEWS_PER_PAGE = 20;

const AdminReviewManagement: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  // State
  const [reviews, setReviews] = useState<AdminReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalReviews, setTotalReviews] = useState(0);

  // Filter State
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'approved' | 'rejected' | 'flagged'>('all');
  const [filterRating, setFilterRating] = useState<number | 'all'>('all');
  const [filterVisibility, setFilterVisibility] = useState<'all' | 'public' | 'hidden'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'highest' | 'lowest'>('newest');

  // Modal State
  const [selectedReview, setSelectedReview] = useState<AdminReview | null>(null);
  const [showModerationModal, setShowModerationModal] = useState(false);
  const [moderationAction, setModerationAction] = useState<'approve' | 'reject' | 'flag' | null>(null);
  const [moderationNote, setModerationNote] = useState('');
  const [processing, setProcessing] = useState(false);

  // Stats
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
    flagged: 0,
    averageRating: 0
  });

  // Fetch reviews
  const fetchReviews = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      // Get total count
      const countQuery = query(collection(db, 'vehicle_reviews'));
      const countSnap = await getCountFromServer(countQuery);
      setTotalReviews(countSnap.data().count);

      // Build query based on filters
      const reviewsQuery = query(
        collection(db, 'vehicle_reviews'),
        orderBy('createdAt', sortBy === 'oldest' ? 'asc' : 'desc'),
        limit(REVIEWS_PER_PAGE * 5) // Fetch more for client-side filtering
      );

      const reviewsSnap = await getDocs(reviewsQuery);
      const allReviews: AdminReview[] = [];

      // Collect vehicle IDs for batch fetch
      const vehicleIds = new Set<string>();
      reviewsSnap.forEach((reviewDoc) => {
        const reviewData = reviewDoc.data() as VehicleReview;
        vehicleIds.add(reviewData.vehicleId);
        allReviews.push({
          ...reviewData,
          id: reviewDoc.id,
          moderationStatus: (reviewData as AdminReview).moderationStatus || 'pending'
        });
      });

      // Fetch vehicle data
      if (vehicleIds.size > 0) {
        const vehicleChunks: string[][] = [];
        const vehicleIdArray = Array.from(vehicleIds);
        for (let i = 0; i < vehicleIdArray.length; i += 10) {
          vehicleChunks.push(vehicleIdArray.slice(i, i + 10));
        }

        const vehicleMap = new Map<string, Vehicle>();
        for (const chunk of vehicleChunks) {
          const vehiclesQuery = query(
            collection(db, 'vehicles'),
            where('__name__', 'in', chunk)
          );
          const vehiclesSnap = await getDocs(vehiclesQuery);
          vehiclesSnap.forEach((vehicleDoc) => {
            vehicleMap.set(vehicleDoc.id, vehicleDoc.data() as Vehicle);
          });
        }

        // Attach vehicle data to reviews
        allReviews.forEach(review => {
          review.vehicleData = vehicleMap.get(review.vehicleId);
        });
      }

      setReviews(allReviews);
      calculateStats(allReviews);
    } catch (err) {
      console.error('Error fetching reviews:', err);
      setError('Failed to load reviews. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [sortBy]);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  const calculateStats = (reviewsList: AdminReview[]) => {
    const total = reviewsList.length;
    const pending = reviewsList.filter(r => !r.moderationStatus || r.moderationStatus === 'pending').length;
    const approved = reviewsList.filter(r => r.moderationStatus === 'approved').length;
    const rejected = reviewsList.filter(r => r.moderationStatus === 'rejected').length;
    const flagged = reviewsList.filter(r => r.moderationStatus === 'flagged').length;
    const avgRating = total > 0
      ? reviewsList.reduce((sum, r) => sum + r.rating, 0) / total
      : 0;

    setStats({
      total,
      pending,
      approved,
      rejected,
      flagged,
      averageRating: avgRating
    });
  };

  // Filter reviews
  const filteredReviews = reviews.filter(review => {
    // Status filter
    if (filterStatus !== 'all') {
      const status = review.moderationStatus || 'pending';
      if (status !== filterStatus) return false;
    }

    // Rating filter
    if (filterRating !== 'all' && review.rating !== filterRating) return false;

    // Visibility filter
    if (filterVisibility === 'public' && !review.isPublic) return false;
    if (filterVisibility === 'hidden' && review.isPublic) return false;

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const matchesContent = review.comment?.toLowerCase().includes(query) ||
        review.title?.toLowerCase().includes(query);
      const matchesVehicle = review.vehicleData &&
        `${review.vehicleData.make} ${review.vehicleData.model}`.toLowerCase().includes(query);
      if (!matchesContent && !matchesVehicle) return false;
    }

    return true;
  });

  // Sort reviews
  const sortedReviews = [...filteredReviews].sort((a, b) => {
    switch (sortBy) {
      case 'newest':
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      case 'oldest':
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      case 'highest':
        return b.rating - a.rating;
      case 'lowest':
        return a.rating - b.rating;
      default:
        return 0;
    }
  });

  // Pagination
  const totalPages = Math.ceil(sortedReviews.length / REVIEWS_PER_PAGE);
  const paginatedReviews = sortedReviews.slice(
    (currentPage - 1) * REVIEWS_PER_PAGE,
    currentPage * REVIEWS_PER_PAGE
  );

  // Moderation actions
  const handleModeration = async (action: 'approve' | 'reject' | 'flag') => {
    if (!selectedReview || !user?.uid) return;

    setProcessing(true);
    try {
      const reviewRef = doc(db, 'vehicle_reviews', selectedReview.id);
      await updateDoc(reviewRef, {
        moderationStatus: action === 'approve' ? 'approved' : action === 'reject' ? 'rejected' : 'flagged',
        isPublic: action === 'approve',
        moderationNote: moderationNote.trim() || null,
        moderatedBy: user.uid,
        moderatedAt: new Date()
      });

      // Update local state
      setReviews(prev => prev.map(r =>
        r.id === selectedReview.id
          ? {
            ...r,
            moderationStatus: action === 'approve' ? 'approved' : action === 'reject' ? 'rejected' : 'flagged',
            isPublic: action === 'approve',
            moderationNote: moderationNote.trim() || undefined,
            moderatedBy: user.uid,
            moderatedAt: new Date()
          }
          : r
      ));

      // Update stats
      const newStatus = action === 'approve' ? 'approved' : action === 'reject' ? 'rejected' : 'flagged';
      const updatedReviews: AdminReview[] = reviews.map(r =>
        r.id === selectedReview.id
          ? { ...r, moderationStatus: newStatus as 'pending' | 'approved' | 'rejected' | 'flagged' }
          : r
      );
      calculateStats(updatedReviews);

      setShowModerationModal(false);
      setSelectedReview(null);
      setModerationNote('');
    } catch (err) {
      console.error('Error moderating review:', err);
      setError('Failed to moderate review. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  // Toggle visibility
  const handleToggleVisibility = async (reviewId: string, currentVisibility: boolean) => {
    try {
      const reviewRef = doc(db, 'vehicle_reviews', reviewId);
      await updateDoc(reviewRef, {
        isPublic: !currentVisibility
      });

      setReviews(prev => prev.map(r =>
        r.id === reviewId ? { ...r, isPublic: !currentVisibility } : r
      ));
    } catch (err) {
      console.error('Error toggling visibility:', err);
      setError('Failed to update visibility. Please try again.');
    }
  };

  // Delete review
  const handleDeleteReview = async (reviewId: string) => {
    if (!confirm('Are you sure you want to permanently delete this review? This action cannot be undone.')) return;

    try {
      await deleteDoc(doc(db, 'vehicle_reviews', reviewId));
      setReviews(prev => prev.filter(r => r.id !== reviewId));
      calculateStats(reviews.filter(r => r.id !== reviewId));
    } catch (err) {
      console.error('Error deleting review:', err);
      setError('Failed to delete review. Please try again.');
    }
  };

  // Format date
  const formatDate = (date: Date | string | { toDate: () => Date }) => {
    const d = typeof date === 'object' && 'toDate' in date
      ? date.toDate()
      : new Date(date as string | Date);
    return d.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Render star rating
  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-4 h-4 ${star <= rating
              ? 'text-yellow-400 fill-yellow-400'
              : 'text-gray-300'
              }`}
          />
        ))}
      </div>
    );
  };

  // Get status badge
  const getStatusBadge = (status?: string) => {
    switch (status) {
      case 'approved':
        return (
          <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" />
            Approved
          </span>
        );
      case 'rejected':
        return (
          <span className="px-2 py-1 bg-red-100 text-red-700 text-xs rounded-full flex items-center gap-1">
            <XCircle className="w-3 h-3" />
            Rejected
          </span>
        );
      case 'flagged':
        return (
          <span className="px-2 py-1 bg-orange-100 text-orange-700 text-xs rounded-full flex items-center gap-1">
            <Flag className="w-3 h-3" />
            Flagged
          </span>
        );
      default:
        return (
          <span className="px-2 py-1 bg-yellow-100 text-yellow-700 text-xs rounded-full flex items-center gap-1">
            <AlertTriangle className="w-3 h-3" />
            Pending
          </span>
        );
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-12 h-12 text-[#004643] animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading reviews...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-[#004643] text-white py-8">
        <div className="container mx-auto px-4">
          <button
            onClick={() => navigate('/admin')}
            className="flex items-center text-white/80 hover:text-white mb-4"
            title="Go back to admin dashboard"
          >
            <ChevronLeft className="w-5 h-5 mr-1" />
            Back to Admin
          </button>
          <div className="flex items-center gap-3">
            <Shield className="w-8 h-8" />
            <div>
              <h1 className="text-3xl font-bold">Review Management</h1>
              <p className="text-white/80 mt-1">
                Moderate, approve, or reject customer reviews
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Error Alert */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3"
            >
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-red-800">{error}</p>
              </div>
              <button
                onClick={() => setError(null)}
                className="text-red-500 hover:text-red-700"
                title="Dismiss error"
              >
                ×
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-4">
            <p className="text-sm text-gray-500">Total Reviews</p>
            <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-4">
            <p className="text-sm text-gray-500">Pending</p>
            <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-4">
            <p className="text-sm text-gray-500">Approved</p>
            <p className="text-2xl font-bold text-green-600">{stats.approved}</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-4">
            <p className="text-sm text-gray-500">Rejected</p>
            <p className="text-2xl font-bold text-red-600">{stats.rejected}</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-4">
            <p className="text-sm text-gray-500">Flagged</p>
            <p className="text-2xl font-bold text-orange-600">{stats.flagged}</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-4">
            <p className="text-sm text-gray-500">Avg Rating</p>
            <div className="flex items-center gap-2">
              <p className="text-2xl font-bold text-gray-900">{stats.averageRating.toFixed(1)}</p>
              <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
          <div className="flex flex-wrap gap-4">
            {/* Search */}
            <div className="flex-1 min-w-[200px]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search reviews..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#004643] focus:border-transparent"
                />
              </div>
            </div>

            {/* Status Filter */}
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as typeof filterStatus)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#004643] focus:border-transparent"
              title="Filter by moderation status"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending Review</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
              <option value="flagged">Flagged</option>
            </select>

            {/* Rating Filter */}
            <select
              value={filterRating}
              onChange={(e) => setFilterRating(e.target.value === 'all' ? 'all' : Number(e.target.value))}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#004643] focus:border-transparent"
              title="Filter by rating"
            >
              <option value="all">All Ratings</option>
              <option value="5">5 Stars</option>
              <option value="4">4 Stars</option>
              <option value="3">3 Stars</option>
              <option value="2">2 Stars</option>
              <option value="1">1 Star</option>
            </select>

            {/* Visibility Filter */}
            <select
              value={filterVisibility}
              onChange={(e) => setFilterVisibility(e.target.value as typeof filterVisibility)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#004643] focus:border-transparent"
              title="Filter by visibility"
            >
              <option value="all">All Visibility</option>
              <option value="public">Public</option>
              <option value="hidden">Hidden</option>
            </select>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#004643] focus:border-transparent"
              title="Sort reviews"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="highest">Highest Rating</option>
              <option value="lowest">Lowest Rating</option>
            </select>

            {/* Refresh */}
            <button
              onClick={fetchReviews}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2"
              title="Refresh reviews"
            >
              <RefreshCw className="w-4 h-4" />
              Refresh
            </button>
          </div>
        </div>

        {/* Reviews Table */}
        {sortedReviews.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <MessageSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Reviews Found</h3>
            <p className="text-gray-500">
              {reviews.length === 0
                ? "No reviews have been submitted yet."
                : "No reviews match your current filters."}
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Review
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Vehicle
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Rating
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {paginatedReviews.map((review) => (
                    <tr key={review.id} className="hover:bg-gray-50">
                      <td className="px-4 py-4">
                        <div className="max-w-md">
                          {review.title && (
                            <p className="font-medium text-gray-900 mb-1">{review.title}</p>
                          )}
                          <p className="text-sm text-gray-600 line-clamp-2">{review.comment}</p>
                          {review.photos && review.photos.length > 0 && (
                            <div className="flex items-center gap-1 mt-1 text-xs text-gray-500">
                              <ImageIcon className="w-3 h-3" />
                              {review.photos.length} photo(s)
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        {review.vehicleData ? (
                          <div className="flex items-center gap-2">
                            <Car className="w-4 h-4 text-gray-400" />
                            <span className="text-sm text-gray-900">
                              {review.vehicleData.make} {review.vehicleData.model}
                            </span>
                          </div>
                        ) : (
                          <span className="text-sm text-gray-400">Unknown</span>
                        )}
                      </td>
                      <td className="px-4 py-4">
                        {renderStars(review.rating)}
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex flex-col gap-1">
                          {getStatusBadge(review.moderationStatus)}
                          {review.isPublic ? (
                            <span className="flex items-center gap-1 text-xs text-green-600">
                              <Eye className="w-3 h-3" />
                              Visible
                            </span>
                          ) : (
                            <span className="flex items-center gap-1 text-xs text-gray-400">
                              <EyeOff className="w-3 h-3" />
                              Hidden
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <span className="text-sm text-gray-600">
                          {formatDate(review.createdAt)}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center justify-end gap-2">
                          {/* Quick Approve */}
                          {(!review.moderationStatus || review.moderationStatus === 'pending') && (
                            <button
                              onClick={() => {
                                setSelectedReview(review);
                                setModerationAction('approve');
                                setShowModerationModal(true);
                              }}
                              className="p-2 text-green-600 hover:bg-green-50 rounded-lg"
                              title="Approve review"
                            >
                              <CheckCircle2 className="w-4 h-4" />
                            </button>
                          )}
                          {/* Quick Reject */}
                          {(!review.moderationStatus || review.moderationStatus === 'pending') && (
                            <button
                              onClick={() => {
                                setSelectedReview(review);
                                setModerationAction('reject');
                                setShowModerationModal(true);
                              }}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                              title="Reject review"
                            >
                              <XCircle className="w-4 h-4" />
                            </button>
                          )}
                          {/* Flag */}
                          <button
                            onClick={() => {
                              setSelectedReview(review);
                              setModerationAction('flag');
                              setShowModerationModal(true);
                            }}
                            className="p-2 text-orange-600 hover:bg-orange-50 rounded-lg"
                            title="Flag for review"
                          >
                            <Flag className="w-4 h-4" />
                          </button>
                          {/* Toggle Visibility */}
                          <button
                            onClick={() => handleToggleVisibility(review.id, review.isPublic)}
                            className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                            title={review.isPublic ? "Hide review" : "Show review"}
                          >
                            {review.isPublic ? (
                              <EyeOff className="w-4 h-4" />
                            ) : (
                              <Eye className="w-4 h-4" />
                            )}
                          </button>
                          {/* Delete */}
                          <button
                            onClick={() => handleDeleteReview(review.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                            title="Delete review permanently"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-6">
            <p className="text-sm text-gray-500">
              Showing {(currentPage - 1) * REVIEWS_PER_PAGE + 1} to{' '}
              {Math.min(currentPage * REVIEWS_PER_PAGE, sortedReviews.length)} of{' '}
              {sortedReviews.length} reviews
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                title="Previous page"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter(page => {
                  return page === 1 ||
                    page === totalPages ||
                    Math.abs(page - currentPage) <= 1;
                })
                .map((page, index, arr) => (
                  <React.Fragment key={page}>
                    {index > 0 && arr[index - 1] !== page - 1 && (
                      <span className="px-2 text-gray-400">...</span>
                    )}
                    <button
                      onClick={() => setCurrentPage(page)}
                      className={`w-10 h-10 rounded-lg font-medium ${currentPage === page
                        ? 'bg-[#004643] text-white'
                        : 'border border-gray-300 hover:bg-gray-50'
                        }`}
                      title={`Page ${page}`}
                    >
                      {page}
                    </button>
                  </React.Fragment>
                ))}

              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                title="Next page"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

        {/* Moderation Guidelines */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-xl p-6">
          <h3 className="font-semibold text-blue-900 mb-3 flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            Review Moderation Guidelines
          </h3>
          <ul className="space-y-2 text-blue-800 text-sm">
            <li>• <strong>Approve:</strong> Genuine, helpful reviews that follow community guidelines</li>
            <li>• <strong>Reject:</strong> Spam, fake reviews, or content that violates policies</li>
            <li>• <strong>Flag:</strong> Reviews that need further investigation or contain questionable content</li>
            <li>• <strong>Hide:</strong> Temporarily hide reviews while investigating issues</li>
            <li>• <strong>Delete:</strong> Only for severe policy violations (cannot be undone)</li>
          </ul>
        </div>
      </div>

      {/* Moderation Modal */}
      <AnimatePresence>
        {showModerationModal && selectedReview && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowModerationModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-xl shadow-xl max-w-lg w-full"
              onClick={e => e.stopPropagation()}
            >
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-xl font-semibold text-gray-900">
                  {moderationAction === 'approve' && 'Approve Review'}
                  {moderationAction === 'reject' && 'Reject Review'}
                  {moderationAction === 'flag' && 'Flag Review'}
                </h3>
              </div>

              <div className="p-6">
                {/* Review Preview */}
                <div className="bg-gray-50 rounded-lg p-4 mb-4">
                  <div className="flex items-center gap-2 mb-2">
                    {renderStars(selectedReview.rating)}
                    <span className="text-sm text-gray-500">
                      {selectedReview.rating.toFixed(1)} stars
                    </span>
                  </div>
                  {selectedReview.title && (
                    <p className="font-medium text-gray-900 mb-1">{selectedReview.title}</p>
                  )}
                  <p className="text-sm text-gray-600">{selectedReview.comment}</p>
                </div>

                {/* Moderation Note */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Moderation Note (optional)
                  </label>
                  <textarea
                    value={moderationNote}
                    onChange={(e) => setModerationNote(e.target.value)}
                    placeholder="Add a note about this moderation decision..."
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#004643] focus:border-transparent resize-none"
                  />
                </div>

                {/* Warning for rejection */}
                {moderationAction === 'reject' && (
                  <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
                    <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-red-700">
                      Rejected reviews will be hidden from public view. The reviewer may be notified.
                    </p>
                  </div>
                )}
              </div>

              <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
                <button
                  onClick={() => {
                    setShowModerationModal(false);
                    setModerationNote('');
                  }}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                  title="Cancel moderation"
                >
                  Cancel
                </button>
                <button
                  onClick={() => moderationAction && handleModeration(moderationAction)}
                  disabled={processing}
                  className={`px-4 py-2 rounded-lg text-white flex items-center gap-2 disabled:opacity-50 ${moderationAction === 'approve'
                    ? 'bg-green-600 hover:bg-green-700'
                    : moderationAction === 'reject'
                      ? 'bg-red-600 hover:bg-red-700'
                      : 'bg-orange-600 hover:bg-orange-700'
                    }`}
                  title={`Confirm ${moderationAction}`}
                >
                  {processing ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : moderationAction === 'approve' ? (
                    <CheckCircle2 className="w-4 h-4" />
                  ) : moderationAction === 'reject' ? (
                    <XCircle className="w-4 h-4" />
                  ) : (
                    <Flag className="w-4 h-4" />
                  )}
                  {moderationAction === 'approve' && 'Approve'}
                  {moderationAction === 'reject' && 'Reject'}
                  {moderationAction === 'flag' && 'Flag'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminReviewManagement;
