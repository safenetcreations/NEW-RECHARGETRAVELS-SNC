import React, { useState, useMemo } from 'react';
import { 
  Star, 
  ThumbsUp, 
  MessageSquare, 
  Filter, 
  ChevronDown,
  ChevronUp,
  Image,
  Check,
  Clock,
  User,
  Calendar,
  Car,
  Sparkles,
  DollarSign,
  X
} from 'lucide-react';

// Types
interface VehicleReview {
  id: string;
  vehicleId: string;
  bookingId: string;
  customerId: string;
  customerName: string;
  customerAvatar?: string;
  rating: number;
  vehicleConditionRating: number;
  cleanlinessRating: number;
  valueForMoneyRating: number;
  ownerCommunicationRating: number;
  title?: string;
  comment: string;
  photos?: string[];
  recommend: boolean;
  isVerified: boolean;
  helpfulCount: number;
  createdAt: Date;
  ownerResponse?: {
    comment: string;
    respondedAt: Date;
  };
}

interface VehicleReviewsDisplayProps {
  vehicleId: string;
  vehicleName: string;
  initialReviews?: VehicleReview[];
  showWriteReview?: boolean;
  onWriteReview?: () => void;
}

// Mock data for demonstration
const mockReviews: VehicleReview[] = [
  {
    id: '1',
    vehicleId: 'v1',
    bookingId: 'b1',
    customerId: 'c1',
    customerName: 'Sarah Johnson',
    customerAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100',
    rating: 5,
    vehicleConditionRating: 5,
    cleanlinessRating: 5,
    valueForMoneyRating: 4,
    ownerCommunicationRating: 5,
    title: 'Perfect car for our family trip!',
    comment: 'We rented this Toyota Prius for a week-long family vacation and it was absolutely perfect. The car was spotless when we picked it up, ran smoothly throughout our trip, and the owner Kamal was incredibly helpful and responsive. He even gave us tips on the best routes and restaurants. Would definitely rent again!',
    photos: [
      'https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=400',
      'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=400',
    ],
    recommend: true,
    isVerified: true,
    helpfulCount: 12,
    createdAt: new Date('2024-11-20'),
    ownerResponse: {
      comment: 'Thank you so much, Sarah! It was a pleasure having you as our guest. We\'re thrilled you enjoyed your trip and hope to see you again soon!',
      respondedAt: new Date('2024-11-21'),
    },
  },
  {
    id: '2',
    vehicleId: 'v1',
    bookingId: 'b2',
    customerId: 'c2',
    customerName: 'Michael Chen',
    rating: 4,
    vehicleConditionRating: 4,
    cleanlinessRating: 5,
    valueForMoneyRating: 4,
    ownerCommunicationRating: 4,
    title: 'Great value, minor issues',
    comment: 'Overall a good experience. The car was clean and well-maintained. Only giving 4 stars because pickup was delayed by about 30 minutes. But the owner apologized and was very professional about it. Would still recommend.',
    recommend: true,
    isVerified: true,
    helpfulCount: 5,
    createdAt: new Date('2024-11-15'),
  },
  {
    id: '3',
    vehicleId: 'v1',
    bookingId: 'b3',
    customerId: 'c3',
    customerName: 'Emma Williams',
    customerAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100',
    rating: 5,
    vehicleConditionRating: 5,
    cleanlinessRating: 5,
    valueForMoneyRating: 5,
    ownerCommunicationRating: 5,
    title: 'Exceeded expectations!',
    comment: 'This was my first time renting through Recharge Travels and I couldn\'t be happier. The whole process was smooth, the car was exactly as described, and the price was very fair. The hybrid engine saved us so much on fuel during our hill country tour. Highly recommended!',
    photos: [
      'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=400',
    ],
    recommend: true,
    isVerified: true,
    helpfulCount: 8,
    createdAt: new Date('2024-11-10'),
    ownerResponse: {
      comment: 'Thank you Emma! So happy you had a great experience exploring the hill country. The Prius is indeed perfect for those winding roads. Safe travels!',
      respondedAt: new Date('2024-11-11'),
    },
  },
  {
    id: '4',
    vehicleId: 'v1',
    bookingId: 'b4',
    customerId: 'c4',
    customerName: 'David Thompson',
    rating: 3,
    vehicleConditionRating: 3,
    cleanlinessRating: 3,
    valueForMoneyRating: 3,
    ownerCommunicationRating: 4,
    comment: 'Average experience. The car was okay but showing its age. AC took a while to cool down. Owner was friendly though. Fine for basic transport but don\'t expect luxury.',
    recommend: false,
    isVerified: true,
    helpfulCount: 3,
    createdAt: new Date('2024-11-05'),
  },
];

const VehicleReviewsDisplay: React.FC<VehicleReviewsDisplayProps> = ({
  vehicleId,
  vehicleName,
  initialReviews = mockReviews,
  showWriteReview = true,
  onWriteReview,
}) => {
  const [reviews] = useState<VehicleReview[]>(initialReviews);
  const [sortBy, setSortBy] = useState<'recent' | 'highest' | 'lowest' | 'helpful'>('recent');
  const [filterRating, setFilterRating] = useState<number | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [expandedReviews, setExpandedReviews] = useState<Set<string>>(new Set());
  const [photoModal, setPhotoModal] = useState<{ photos: string[]; index: number } | null>(null);
  const [helpfulClicked, setHelpfulClicked] = useState<Set<string>>(new Set());

  // Calculate statistics
  const stats = useMemo(() => {
    if (reviews.length === 0) {
      return {
        average: 0,
        total: 0,
        distribution: [0, 0, 0, 0, 0],
        categories: {
          vehicleCondition: 0,
          cleanliness: 0,
          valueForMoney: 0,
          ownerCommunication: 0,
        },
        recommendPercent: 0,
      };
    }

    const distribution = [0, 0, 0, 0, 0];
    let vehicleConditionSum = 0;
    let cleanlinessSum = 0;
    let valueSum = 0;
    let communicationSum = 0;
    let recommendCount = 0;

    reviews.forEach(review => {
      distribution[review.rating - 1]++;
      vehicleConditionSum += review.vehicleConditionRating;
      cleanlinessSum += review.cleanlinessRating;
      valueSum += review.valueForMoneyRating;
      communicationSum += review.ownerCommunicationRating;
      if (review.recommend) recommendCount++;
    });

    const total = reviews.length;
    const average = reviews.reduce((sum, r) => sum + r.rating, 0) / total;

    return {
      average: Math.round(average * 10) / 10,
      total,
      distribution: distribution.reverse(), // 5 stars first
      categories: {
        vehicleCondition: Math.round((vehicleConditionSum / total) * 10) / 10,
        cleanliness: Math.round((cleanlinessSum / total) * 10) / 10,
        valueForMoney: Math.round((valueSum / total) * 10) / 10,
        ownerCommunication: Math.round((communicationSum / total) * 10) / 10,
      },
      recommendPercent: Math.round((recommendCount / total) * 100),
    };
  }, [reviews]);

  // Sort and filter reviews
  const sortedReviews = useMemo(() => {
    let filtered = [...reviews];
    
    // Apply rating filter
    if (filterRating !== null) {
      filtered = filtered.filter(r => r.rating === filterRating);
    }
    
    // Apply sorting
    switch (sortBy) {
      case 'recent':
        filtered.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
        break;
      case 'highest':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case 'lowest':
        filtered.sort((a, b) => a.rating - b.rating);
        break;
      case 'helpful':
        filtered.sort((a, b) => b.helpfulCount - a.helpfulCount);
        break;
    }
    
    return filtered;
  }, [reviews, sortBy, filterRating]);

  const toggleExpanded = (reviewId: string) => {
    setExpandedReviews(prev => {
      const next = new Set(prev);
      if (next.has(reviewId)) {
        next.delete(reviewId);
      } else {
        next.add(reviewId);
      }
      return next;
    });
  };

  const handleHelpful = (reviewId: string) => {
    setHelpfulClicked(prev => {
      const next = new Set(prev);
      if (next.has(reviewId)) {
        next.delete(reviewId);
      } else {
        next.add(reviewId);
      }
      return next;
    });
  };

  const StarDisplay: React.FC<{ rating: number; size?: 'sm' | 'md' | 'lg' }> = ({ 
    rating, 
    size = 'md' 
  }) => {
    const sizeClasses = { sm: 'w-3 h-3', md: 'w-4 h-4', lg: 'w-5 h-5' };
    return (
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`${sizeClasses[size]} ${
              star <= rating
                ? 'fill-yellow-400 text-yellow-400'
                : star - 0.5 <= rating
                  ? 'fill-yellow-400/50 text-yellow-400'
                  : 'text-gray-300'
            }`}
          />
        ))}
      </div>
    );
  };

  const RatingBar: React.FC<{ stars: number; count: number; total: number }> = ({ 
    stars, 
    count, 
    total 
  }) => {
    const percentage = total > 0 ? (count / total) * 100 : 0;
    return (
      <button
        onClick={() => setFilterRating(filterRating === stars ? null : stars)}
        className={`flex items-center gap-2 w-full hover:bg-gray-50 p-1 rounded transition-colors
          ${filterRating === stars ? 'bg-emerald-50' : ''}`}
        title={`Filter by ${stars} star reviews`}
      >
        <span className="text-sm w-8 text-gray-600">{stars}★</span>
        <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
          <div 
            className={`h-full rounded-full transition-all ${
              filterRating === stars ? 'bg-emerald-500' : 'bg-yellow-400'
            }`}
            style={{ width: `${percentage}%` }}
          />
        </div>
        <span className="text-sm text-gray-500 w-10 text-right">{count}</span>
      </button>
    );
  };

  const formatDate = (date: Date): string => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(date);
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b bg-gradient-to-r from-emerald-50 to-white">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">Customer Reviews</h2>
          {showWriteReview && (
            <button
              onClick={onWriteReview}
              className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg 
                       hover:bg-emerald-700 transition-colors font-medium"
            >
              <Star className="w-4 h-4" />
              Write a Review
            </button>
          )}
        </div>

        {/* Statistics Overview */}
        <div className="grid md:grid-cols-3 gap-6">
          {/* Average Rating */}
          <div className="text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-3 mb-2">
              <span className="text-5xl font-bold text-gray-900">{stats.average}</span>
              <div>
                <StarDisplay rating={stats.average} size="lg" />
                <p className="text-sm text-gray-500 mt-1">
                  Based on {stats.total} review{stats.total !== 1 ? 's' : ''}
                </p>
              </div>
            </div>
            <div className="flex items-center justify-center md:justify-start gap-2 text-emerald-600">
              <ThumbsUp className="w-4 h-4" />
              <span className="text-sm font-medium">{stats.recommendPercent}% recommend</span>
            </div>
          </div>

          {/* Rating Distribution */}
          <div className="space-y-1">
            {[5, 4, 3, 2, 1].map((stars, idx) => (
              <RatingBar
                key={stars}
                stars={stars}
                count={stats.distribution[idx]}
                total={stats.total}
              />
            ))}
          </div>

          {/* Category Ratings */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="flex items-center gap-2 text-gray-600">
                <Car className="w-4 h-4" /> Vehicle Condition
              </span>
              <span className="font-medium">{stats.categories.vehicleCondition}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="flex items-center gap-2 text-gray-600">
                <Sparkles className="w-4 h-4" /> Cleanliness
              </span>
              <span className="font-medium">{stats.categories.cleanliness}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="flex items-center gap-2 text-gray-600">
                <DollarSign className="w-4 h-4" /> Value for Money
              </span>
              <span className="font-medium">{stats.categories.valueForMoney}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="flex items-center gap-2 text-gray-600">
                <MessageSquare className="w-4 h-4" /> Communication
              </span>
              <span className="font-medium">{stats.categories.ownerCommunication}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Filters & Sort */}
      <div className="p-4 border-b bg-gray-50 flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-3 py-2 border rounded-lg text-sm font-medium
              ${showFilters ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 'bg-white border-gray-200 hover:bg-gray-50'}`}
          >
            <Filter className="w-4 h-4" />
            Filter
            {filterRating && (
              <span className="bg-emerald-600 text-white text-xs px-1.5 py-0.5 rounded-full">
                {filterRating}★
              </span>
            )}
          </button>
          
          {filterRating && (
            <button
              onClick={() => setFilterRating(null)}
              className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1"
            >
              <X className="w-4 h-4" />
              Clear filter
            </button>
          )}
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">Sort by:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
            className="px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            title="Sort reviews"
          >
            <option value="recent">Most Recent</option>
            <option value="highest">Highest Rated</option>
            <option value="lowest">Lowest Rated</option>
            <option value="helpful">Most Helpful</option>
          </select>
        </div>
      </div>

      {/* Reviews List */}
      <div className="divide-y">
        {sortedReviews.length === 0 ? (
          <div className="p-12 text-center">
            <Star className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No reviews yet</h3>
            <p className="text-gray-500 mb-4">
              Be the first to share your experience with this vehicle
            </p>
            {showWriteReview && (
              <button
                onClick={onWriteReview}
                className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
              >
                Write a Review
              </button>
            )}
          </div>
        ) : (
          sortedReviews.map((review) => {
            const isExpanded = expandedReviews.has(review.id);
            const isHelpful = helpfulClicked.has(review.id);
            const shouldTruncate = review.comment.length > 300;
            
            return (
              <div key={review.id} className="p-6">
                {/* Review Header */}
                <div className="flex items-start gap-4 mb-4">
                  {review.customerAvatar ? (
                    <img
                      src={review.customerAvatar}
                      alt={review.customerName}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center">
                      <User className="w-6 h-6 text-emerald-600" />
                    </div>
                  )}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-gray-900">{review.customerName}</span>
                      {review.isVerified && (
                        <span className="flex items-center gap-1 text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full">
                          <Check className="w-3 h-3" />
                          Verified
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-3 text-sm text-gray-500">
                      <StarDisplay rating={review.rating} size="sm" />
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {formatDate(review.createdAt)}
                      </span>
                    </div>
                  </div>
                  {review.recommend && (
                    <div className="flex items-center gap-1 text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full text-sm">
                      <ThumbsUp className="w-4 h-4" />
                      Recommends
                    </div>
                  )}
                </div>

                {/* Review Content */}
                {review.title && (
                  <h4 className="font-semibold text-gray-900 mb-2">{review.title}</h4>
                )}
                <p className="text-gray-700 leading-relaxed">
                  {shouldTruncate && !isExpanded
                    ? `${review.comment.substring(0, 300)}...`
                    : review.comment}
                </p>
                {shouldTruncate && (
                  <button
                    onClick={() => toggleExpanded(review.id)}
                    className="text-emerald-600 hover:text-emerald-700 text-sm font-medium mt-2 flex items-center gap-1"
                  >
                    {isExpanded ? (
                      <>Show less <ChevronUp className="w-4 h-4" /></>
                    ) : (
                      <>Read more <ChevronDown className="w-4 h-4" /></>
                    )}
                  </button>
                )}

                {/* Review Photos */}
                {review.photos && review.photos.length > 0 && (
                  <div className="flex gap-2 mt-4">
                    {review.photos.map((photo, idx) => (
                      <button
                        key={idx}
                        onClick={() => setPhotoModal({ photos: review.photos!, index: idx })}
                        className="relative group"
                        title="View photo"
                      >
                        <img
                          src={photo}
                          alt={`Review photo ${idx + 1}`}
                          className="w-20 h-20 rounded-lg object-cover"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors rounded-lg flex items-center justify-center">
                          <Image className="w-5 h-5 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                      </button>
                    ))}
                  </div>
                )}

                {/* Category Ratings */}
                <div className="flex flex-wrap gap-4 mt-4 text-sm">
                  <div className="flex items-center gap-1 text-gray-500">
                    <Car className="w-4 h-4" />
                    <span>Condition: {review.vehicleConditionRating}/5</span>
                  </div>
                  <div className="flex items-center gap-1 text-gray-500">
                    <Sparkles className="w-4 h-4" />
                    <span>Cleanliness: {review.cleanlinessRating}/5</span>
                  </div>
                  <div className="flex items-center gap-1 text-gray-500">
                    <DollarSign className="w-4 h-4" />
                    <span>Value: {review.valueForMoneyRating}/5</span>
                  </div>
                </div>

                {/* Helpful Button */}
                <div className="flex items-center gap-4 mt-4 pt-4 border-t">
                  <button
                    onClick={() => handleHelpful(review.id)}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm transition-colors
                      ${isHelpful 
                        ? 'bg-emerald-100 text-emerald-700' 
                        : 'text-gray-500 hover:bg-gray-100'}`}
                  >
                    <ThumbsUp className={`w-4 h-4 ${isHelpful ? 'fill-emerald-200' : ''}`} />
                    Helpful ({review.helpfulCount + (isHelpful ? 1 : 0)})
                  </button>
                </div>

                {/* Owner Response */}
                {review.ownerResponse && (
                  <div className="mt-4 ml-6 pl-4 border-l-2 border-emerald-200 bg-emerald-50/50 rounded-r-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <MessageSquare className="w-4 h-4 text-emerald-600" />
                      <span className="font-medium text-emerald-700">Owner Response</span>
                      <span className="text-xs text-gray-500">
                        • {formatDate(review.ownerResponse.respondedAt)}
                      </span>
                    </div>
                    <p className="text-gray-700 text-sm">{review.ownerResponse.comment}</p>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Load More */}
      {sortedReviews.length > 0 && (
        <div className="p-4 border-t text-center">
          <button className="text-emerald-600 hover:text-emerald-700 font-medium text-sm">
            Load more reviews
          </button>
        </div>
      )}

      {/* Photo Modal */}
      {photoModal && (
        <div 
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={() => setPhotoModal(null)}
        >
          <button
            onClick={() => setPhotoModal(null)}
            className="absolute top-4 right-4 p-2 text-white hover:bg-white/20 rounded-full"
            title="Close"
          >
            <X className="w-6 h-6" />
          </button>
          <img
            src={photoModal.photos[photoModal.index]}
            alt="Review photo"
            className="max-w-full max-h-[90vh] rounded-lg object-contain"
            onClick={(e) => e.stopPropagation()}
          />
          {photoModal.photos.length > 1 && (
            <div className="absolute bottom-4 flex gap-2">
              {photoModal.photos.map((_, idx) => (
                <button
                  key={idx}
                  onClick={(e) => {
                    e.stopPropagation();
                    setPhotoModal({ ...photoModal, index: idx });
                  }}
                  className={`w-3 h-3 rounded-full transition-colors
                    ${idx === photoModal.index ? 'bg-white' : 'bg-white/50 hover:bg-white/75'}`}
                  title={`View photo ${idx + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default VehicleReviewsDisplay;
