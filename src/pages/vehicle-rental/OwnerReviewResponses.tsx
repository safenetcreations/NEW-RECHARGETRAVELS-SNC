/**
 * Owner Review Responses Page
 * Allows vehicle owners to view and respond to customer reviews
 */
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Star,
  MessageSquare,
  Send,
  Clock,
  CheckCircle2,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Search,
  Car,
  User,
  Calendar,
  ThumbsUp,
  Edit3,
  Trash2,
  BarChart3,
  TrendingUp,
  TrendingDown,
  RefreshCw
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
  updateDoc
} from 'firebase/firestore';
import type { VehicleReview, Vehicle } from '../../types/vehicleRental';

interface ReviewWithVehicle extends VehicleReview {
  vehicleData?: Vehicle;
  customerName?: string;
  helpfulVotes?: number;
}

const REVIEWS_PER_PAGE = 10;

const OwnerReviewResponses: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  // State
  const [reviews, setReviews] = useState<ReviewWithVehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  // Filter State
  const [filterStatus, setFilterStatus] = useState<'all' | 'responded' | 'pending'>('all');
  const [filterRating, setFilterRating] = useState<number | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedVehicle, setSelectedVehicle] = useState<string>('all');

  // Response State
  const [respondingTo, setRespondingTo] = useState<string | null>(null);
  const [responseText, setResponseText] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [editingResponse, setEditingResponse] = useState<string | null>(null);

  // Stats
  const [stats, setStats] = useState({
    totalReviews: 0,
    averageRating: 0,
    pendingResponses: 0,
    respondedCount: 0,
    ratingTrend: 0
  });

  // Vehicle list for filter
  const [vehicles, setVehicles] = useState<{ id: string; name: string }[]>([]);

  const calculateStats = useCallback((reviewsList: ReviewWithVehicle[]) => {
    const total = reviewsList.length;
    const avgRating = total > 0
      ? reviewsList.reduce((sum, r) => sum + r.rating, 0) / total
      : 0;
    const pending = reviewsList.filter(r => !r.ownerResponse).length;
    const responded = total - pending;

    // Calculate rating trend (compare last 30 days to previous 30 days)
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const sixtyDaysAgo = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000);

    const recentReviews = reviewsList.filter(r => {
      const date = r.createdAt instanceof Date ? r.createdAt : new Date(r.createdAt);
      return date >= thirtyDaysAgo;
    });
    const olderReviews = reviewsList.filter(r => {
      const date = r.createdAt instanceof Date ? r.createdAt : new Date(r.createdAt);
      return date >= sixtyDaysAgo && date < thirtyDaysAgo;
    });

    const recentAvg = recentReviews.length > 0
      ? recentReviews.reduce((sum, r) => sum + r.rating, 0) / recentReviews.length
      : 0;
    const olderAvg = olderReviews.length > 0
      ? olderReviews.reduce((sum, r) => sum + r.rating, 0) / olderReviews.length
      : 0;

    const trend = recentAvg - olderAvg;

    setStats({
      totalReviews: total,
      averageRating: avgRating,
      pendingResponses: pending,
      respondedCount: responded,
      ratingTrend: trend
    });
  }, []);

  // Fetch vehicles and reviews function
  const fetchVehiclesAndReviews = useCallback(async () => {
    if (!user?.uid) return;

    setLoading(true);
    setError(null);

    try {
      // First, get all vehicles owned by this user
      const vehiclesQuery = query(
        collection(db, 'vehicles'),
        where('ownerId', '==', user.uid)
      );
      const vehiclesSnap = await getDocs(vehiclesQuery);

      const vehiclesList: { id: string; name: string; data: Vehicle }[] = [];
      vehiclesSnap.forEach((vehicleDoc) => {
        const vehicleData = vehicleDoc.data() as Vehicle;
        vehiclesList.push({
          id: vehicleDoc.id,
          name: `${vehicleData.make} ${vehicleData.model} (${vehicleData.year})`,
          data: vehicleData
        });
      });

      setVehicles(vehiclesList.map(v => ({ id: v.id, name: v.name })));

      if (vehiclesList.length === 0) {
        setReviews([]);
        setLoading(false);
        return;
      }

      // Fetch reviews for all owner's vehicles
      const vehicleIds = vehiclesList.map(v => v.id);
      const allReviews: ReviewWithVehicle[] = [];

      // Firestore doesn't support 'in' queries with more than 10 items
      const chunks: string[][] = [];
      for (let i = 0; i < vehicleIds.length; i += 10) {
        chunks.push(vehicleIds.slice(i, i + 10));
      }

      for (const chunk of chunks) {
        const reviewsQuery = query(
          collection(db, 'vehicle_reviews'),
          where('vehicleId', 'in', chunk),
          orderBy('createdAt', 'desc')
        );

        const reviewsSnap = await getDocs(reviewsQuery);
        reviewsSnap.forEach((reviewDoc) => {
          const reviewData = reviewDoc.data() as VehicleReview;
          const vehicle = vehiclesList.find(v => v.id === reviewData.vehicleId);
          allReviews.push({
            ...reviewData,
            id: reviewDoc.id,
            vehicleData: vehicle?.data
          });
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
  }, [user?.uid, calculateStats]);

  // Fetch owner's vehicles and reviews
  useEffect(() => {
    if (user?.uid) {
      fetchVehiclesAndReviews();
    }
  }, [user?.uid, fetchVehiclesAndReviews]);

  // Filter reviews
  const filteredReviews = reviews.filter(review => {
    // Status filter
    if (filterStatus === 'responded' && !review.ownerResponse) return false;
    if (filterStatus === 'pending' && review.ownerResponse) return false;

    // Rating filter
    if (filterRating !== 'all' && review.rating !== filterRating) return false;

    // Vehicle filter
    if (selectedVehicle !== 'all' && review.vehicleId !== selectedVehicle) return false;

    // Search filter
    if (searchQuery) {
      const queryLower = searchQuery.toLowerCase();
      const matchesContent = review.comment?.toLowerCase().includes(queryLower) ||
        review.title?.toLowerCase().includes(queryLower);
      const matchesVehicle = review.vehicleData &&
        `${review.vehicleData.make} ${review.vehicleData.model}`.toLowerCase().includes(queryLower);
      if (!matchesContent && !matchesVehicle) return false;
    }

    return true;
  });

  // Pagination
  const totalPages = Math.ceil(filteredReviews.length / REVIEWS_PER_PAGE);
  const paginatedReviews = filteredReviews.slice(
    (currentPage - 1) * REVIEWS_PER_PAGE,
    currentPage * REVIEWS_PER_PAGE
  );

  // Submit owner response
  const handleSubmitResponse = async (reviewId: string) => {
    if (!responseText.trim() || !user?.uid) return;

    setSubmitting(true);
    try {
      const reviewRef = doc(db, 'vehicle_reviews', reviewId);
      await updateDoc(reviewRef, {
        ownerResponse: {
          comment: responseText.trim(),
          respondedAt: new Date()
        }
      });

      // Update local state
      setReviews(prev => prev.map(r =>
        r.id === reviewId
          ? {
            ...r,
            ownerResponse: {
              comment: responseText.trim(),
              respondedAt: new Date()
            }
          }
          : r
      ));

      setResponseText('');
      setRespondingTo(null);
      setEditingResponse(null);

      // Recalculate stats
      const updatedReviews = reviews.map(r =>
        r.id === reviewId
          ? { ...r, ownerResponse: { comment: responseText.trim(), respondedAt: new Date() } }
          : r
      );
      calculateStats(updatedReviews);
    } catch (err) {
      console.error('Error submitting response:', err);
      setError('Failed to submit response. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  // Delete owner response
  const handleDeleteResponse = async (reviewId: string) => {
    if (!confirm('Are you sure you want to delete this response?')) return;

    try {
      const reviewRef = doc(db, 'vehicle_reviews', reviewId);
      await updateDoc(reviewRef, {
        ownerResponse: null
      });

      // Update local state
      setReviews(prev => prev.map(r =>
        r.id === reviewId ? { ...r, ownerResponse: undefined } : r
      ));

      // Recalculate stats
      const updatedReviews = reviews.map(r =>
        r.id === reviewId ? { ...r, ownerResponse: undefined } : r
      );
      calculateStats(updatedReviews);
    } catch (err) {
      console.error('Error deleting response:', err);
      setError('Failed to delete response. Please try again.');
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
      day: 'numeric'
    });
  };

  // Render star rating
  const renderStars = (rating: number, size: 'sm' | 'md' = 'sm') => {
    const sizeClass = size === 'sm' ? 'w-4 h-4' : 'w-5 h-5';
    return (
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`${sizeClass} ${star <= rating
              ? 'text-yellow-400 fill-yellow-400'
              : 'text-gray-300'
              }`}
          />
        ))}
      </div>
    );
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-12 h-12 text-[#004643] animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading your reviews...</p>
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
            onClick={() => navigate(-1)}
            className="flex items-center text-white/80 hover:text-white mb-4"
            title="Go back to previous page"
          >
            <ChevronLeft className="w-5 h-5 mr-1" />
            Back
          </button>
          <h1 className="text-3xl font-bold">Review Responses</h1>
          <p className="text-white/80 mt-2">
            Manage and respond to customer reviews for your vehicles
          </p>
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
                title="Dismiss error message"
              >
                ×
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Reviews</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalReviews}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <MessageSquare className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Average Rating</p>
                <div className="flex items-center gap-2">
                  <p className="text-2xl font-bold text-gray-900">
                    {stats.averageRating.toFixed(1)}
                  </p>
                  {renderStars(Math.round(stats.averageRating))}
                </div>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Star className="w-6 h-6 text-yellow-600 fill-yellow-600" />
              </div>
            </div>
            {stats.ratingTrend !== 0 && (
              <div className={`flex items-center gap-1 mt-2 text-sm ${stats.ratingTrend > 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                {stats.ratingTrend > 0 ? (
                  <TrendingUp className="w-4 h-4" />
                ) : (
                  <TrendingDown className="w-4 h-4" />
                )}
                <span>{Math.abs(stats.ratingTrend).toFixed(1)} vs last month</span>
              </div>
            )}
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Pending Responses</p>
                <p className="text-2xl font-bold text-orange-600">{stats.pendingResponses}</p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <Clock className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Response Rate</p>
                <p className="text-2xl font-bold text-green-600">
                  {stats.totalReviews > 0
                    ? Math.round((stats.respondedCount / stats.totalReviews) * 100)
                    : 0}%
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6 text-green-600" />
              </div>
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
              onChange={(e) => setFilterStatus(e.target.value as 'all' | 'responded' | 'pending')}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#004643] focus:border-transparent"
              title="Filter reviews by response status"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending Response</option>
              <option value="responded">Responded</option>
            </select>

            {/* Rating Filter */}
            <select
              value={filterRating}
              onChange={(e) => setFilterRating(e.target.value === 'all' ? 'all' : Number(e.target.value))}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#004643] focus:border-transparent"
              title="Filter reviews by star rating"
            >
              <option value="all">All Ratings</option>
              <option value="5">5 Stars</option>
              <option value="4">4 Stars</option>
              <option value="3">3 Stars</option>
              <option value="2">2 Stars</option>
              <option value="1">1 Star</option>
            </select>

            {/* Vehicle Filter */}
            {vehicles.length > 1 && (
              <select
                value={selectedVehicle}
                onChange={(e) => setSelectedVehicle(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#004643] focus:border-transparent"
                title="Filter reviews by vehicle"
              >
                <option value="all">All Vehicles</option>
                {vehicles.map((vehicle) => (
                  <option key={vehicle.id} value={vehicle.id}>
                    {vehicle.name}
                  </option>
                ))}
              </select>
            )}

            {/* Refresh */}
            <button
              onClick={fetchVehiclesAndReviews}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2"
              title="Refresh reviews list"
            >
              <RefreshCw className="w-4 h-4" />
              Refresh
            </button>
          </div>
        </div>

        {/* Reviews List */}
        {filteredReviews.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <MessageSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Reviews Found</h3>
            <p className="text-gray-500">
              {reviews.length === 0
                ? "You haven't received any reviews yet."
                : "No reviews match your current filters."}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {paginatedReviews.map((review) => (
              <motion.div
                key={review.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-xl shadow-sm overflow-hidden"
              >
                {/* Review Header */}
                <div className="p-6 border-b border-gray-100">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      {/* Reviewer Avatar */}
                      <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
                        <User className="w-6 h-6 text-gray-500" />
                      </div>

                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-semibold text-gray-900">
                            {review.customerName || 'Customer'}
                          </span>
                          {review.isVerified && (
                            <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3" />
                              Verified Booking
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-3 text-sm text-gray-500">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {formatDate(review.createdAt)}
                          </span>
                          {review.vehicleData && (
                            <span className="flex items-center gap-1">
                              <Car className="w-4 h-4" />
                              {review.vehicleData.make} {review.vehicleData.model}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Rating */}
                    <div className="text-right">
                      {renderStars(review.rating, 'md')}
                      <p className="text-sm text-gray-500 mt-1">
                        {review.rating.toFixed(1)} out of 5
                      </p>
                    </div>
                  </div>
                </div>

                {/* Review Content */}
                <div className="p-6">
                  {review.title && (
                    <h4 className="font-semibold text-gray-900 mb-2">{review.title}</h4>
                  )}
                  <p className="text-gray-700">{review.comment}</p>

                  {/* Sub-ratings */}
                  {(review.vehicleConditionRating || review.cleanlinessRating ||
                    review.valueForMoneyRating || review.ownerCommunicationRating) && (
                      <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-3">
                        {review.vehicleConditionRating && (
                          <div className="text-sm">
                            <span className="text-gray-500">Condition:</span>
                            <span className="ml-1 font-medium">{review.vehicleConditionRating}/5</span>
                          </div>
                        )}
                        {review.cleanlinessRating && (
                          <div className="text-sm">
                            <span className="text-gray-500">Cleanliness:</span>
                            <span className="ml-1 font-medium">{review.cleanlinessRating}/5</span>
                          </div>
                        )}
                        {review.valueForMoneyRating && (
                          <div className="text-sm">
                            <span className="text-gray-500">Value:</span>
                            <span className="ml-1 font-medium">{review.valueForMoneyRating}/5</span>
                          </div>
                        )}
                        {review.ownerCommunicationRating && (
                          <div className="text-sm">
                            <span className="text-gray-500">Communication:</span>
                            <span className="ml-1 font-medium">{review.ownerCommunicationRating}/5</span>
                          </div>
                        )}
                      </div>
                    )}

                  {/* Review Photos */}
                  {review.photos && review.photos.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-2">
                      {review.photos.map((photo, index) => (
                        <div
                          key={index}
                          className="w-20 h-20 rounded-lg overflow-hidden bg-gray-100"
                        >
                          <img
                            src={photo}
                            alt={`Review photo ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Helpful count */}
                  {review.helpfulVotes && review.helpfulVotes > 0 && (
                    <div className="mt-3 flex items-center gap-1 text-sm text-gray-500">
                      <ThumbsUp className="w-4 h-4" />
                      <span>{review.helpfulVotes} people found this helpful</span>
                    </div>
                  )}
                </div>

                {/* Owner Response Section */}
                <div className="bg-gray-50 p-6">
                  {review.ownerResponse && editingResponse !== review.id ? (
                    /* Existing Response */
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="w-5 h-5 text-green-500" />
                          <span className="font-medium text-gray-900">Your Response</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-gray-500">
                            {review.ownerResponse.respondedAt &&
                              formatDate(review.ownerResponse.respondedAt)}
                          </span>
                          <button
                            onClick={() => {
                              setEditingResponse(review.id);
                              setResponseText(review.ownerResponse?.comment || '');
                            }}
                            className="p-1 text-gray-400 hover:text-gray-600"
                            title="Edit your response"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteResponse(review.id)}
                            className="p-1 text-gray-400 hover:text-red-600"
                            title="Delete your response"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      <p className="text-gray-700 bg-white p-4 rounded-lg">
                        {review.ownerResponse.comment}
                      </p>
                    </div>
                  ) : respondingTo === review.id || editingResponse === review.id ? (
                    /* Response Form */
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {editingResponse ? 'Edit Your Response' : 'Write Your Response'}
                      </label>
                      <textarea
                        value={responseText}
                        onChange={(e) => setResponseText(e.target.value)}
                        placeholder="Thank you for your feedback..."
                        rows={4}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#004643] focus:border-transparent resize-none"
                      />
                      <div className="flex items-center justify-between mt-3">
                        <p className="text-sm text-gray-500">
                          Responding professionally helps build trust with future renters.
                        </p>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => {
                              setRespondingTo(null);
                              setEditingResponse(null);
                              setResponseText('');
                            }}
                            className="px-4 py-2 text-gray-600 hover:text-gray-800"
                            title="Cancel response"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={() => handleSubmitResponse(review.id)}
                            disabled={!responseText.trim() || submitting}
                            className="px-4 py-2 bg-[#004643] text-white rounded-lg hover:bg-[#004643]/90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                            title={editingResponse ? "Update response" : "Submit response"}
                          >
                            {submitting ? (
                              <RefreshCw className="w-4 h-4 animate-spin" />
                            ) : (
                              <Send className="w-4 h-4" />
                            )}
                            {editingResponse ? 'Update' : 'Submit'}
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    /* Respond Button */
                    <button
                      onClick={() => {
                        setRespondingTo(review.id);
                        setResponseText('');
                      }}
                      className="flex items-center gap-2 px-4 py-2 bg-[#004643] text-white rounded-lg hover:bg-[#004643]/90"
                      title="Write a response to this review"
                    >
                      <MessageSquare className="w-4 h-4" />
                      Respond to Review
                    </button>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-8">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              title="Go to previous page"
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
                    title={`Go to page ${page}`}
                  >
                    {page}
                  </button>
                </React.Fragment>
              ))}

            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              title="Go to next page"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* Response Tips */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-xl p-6">
          <h3 className="font-semibold text-blue-900 mb-3 flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            Tips for Great Review Responses
          </h3>
          <ul className="space-y-2 text-blue-800 text-sm">
            <li>• <strong>Respond quickly:</strong> Try to respond within 24-48 hours</li>
            <li>• <strong>Thank the reviewer:</strong> Always start with appreciation for their feedback</li>
            <li>• <strong>Be professional:</strong> Even with negative reviews, maintain a courteous tone</li>
            <li>• <strong>Address concerns:</strong> If there were issues, acknowledge them and explain steps taken</li>
            <li>• <strong>Invite them back:</strong> End with an invitation for future rentals</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default OwnerReviewResponses;
