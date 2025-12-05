import React, { useState } from 'react';
import { Star, Send, Camera, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import driverReviewService, { DriverReview } from '@/services/driverReviewService';

interface DriverReviewFormProps {
  driverId: string;
  bookingId: string;
  customerId: string;
  customerName: string;
  customerPhoto?: string;
  tripDate: string;
  tripRoute?: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

const RatingStars: React.FC<{
  rating: number;
  onChange: (rating: number) => void;
  size?: 'sm' | 'md' | 'lg';
}> = ({ rating, onChange, size = 'md' }) => {
  const [hoverRating, setHoverRating] = useState(0);
  const sizeClasses = {
    sm: 'w-5 h-5',
    md: 'w-7 h-7',
    lg: 'w-9 h-9'
  };

  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onChange(star)}
          onMouseEnter={() => setHoverRating(star)}
          onMouseLeave={() => setHoverRating(0)}
          className="focus:outline-none transition-transform hover:scale-110"
        >
          <Star
            className={`${sizeClasses[size]} ${
              star <= (hoverRating || rating)
                ? 'fill-yellow-400 text-yellow-400'
                : 'text-gray-300'
            }`}
          />
        </button>
      ))}
    </div>
  );
};

export const DriverReviewForm: React.FC<DriverReviewFormProps> = ({
  driverId,
  bookingId,
  customerId,
  customerName,
  customerPhoto,
  tripDate,
  tripRoute,
  onSuccess,
  onCancel
}) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [overallRating, setOverallRating] = useState(0);
  const [punctualityRating, setPunctualityRating] = useState(0);
  const [vehicleRating, setVehicleRating] = useState(0);
  const [communicationRating, setCommunicationRating] = useState(0);
  const [knowledgeRating, setKnowledgeRating] = useState(0);
  const [reviewTitle, setReviewTitle] = useState('');
  const [reviewText, setReviewText] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (overallRating === 0) {
      toast({
        title: 'Rating Required',
        description: 'Please provide an overall rating',
        variant: 'destructive'
      });
      return;
    }

    setIsSubmitting(true);

    try {
      await driverReviewService.submitReview({
        driver_id: driverId,
        booking_id: bookingId,
        customer_id: customerId,
        customer_name: customerName,
        customer_photo: customerPhoto,
        overall_rating: overallRating,
        punctuality_rating: punctualityRating || undefined,
        vehicle_rating: vehicleRating || undefined,
        communication_rating: communicationRating || undefined,
        knowledge_rating: knowledgeRating || undefined,
        review_title: reviewTitle || undefined,
        review_text: reviewText || undefined,
        trip_date: tripDate,
        trip_route: tripRoute
      });

      toast({
        title: 'Review Submitted',
        description: 'Thank you for your feedback!'
      });

      onSuccess?.();
    } catch (error) {
      console.error('Error submitting review:', error);
      toast({
        title: 'Error',
        description: 'Failed to submit review. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-xl">Rate Your Trip</CardTitle>
        {tripRoute && (
          <p className="text-sm text-muted-foreground">{tripRoute}</p>
        )}
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Overall Rating */}
          <div className="space-y-2">
            <Label className="text-base font-medium">Overall Experience *</Label>
            <div className="flex items-center gap-4">
              <RatingStars rating={overallRating} onChange={setOverallRating} size="lg" />
              <span className="text-sm text-muted-foreground">
                {overallRating > 0 ? `${overallRating}/5` : 'Select rating'}
              </span>
            </div>
          </div>

          {/* Detailed Ratings */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-muted/50 rounded-lg">
            <div className="space-y-1">
              <Label className="text-sm">Punctuality</Label>
              <RatingStars rating={punctualityRating} onChange={setPunctualityRating} size="sm" />
            </div>
            <div className="space-y-1">
              <Label className="text-sm">Vehicle Condition</Label>
              <RatingStars rating={vehicleRating} onChange={setVehicleRating} size="sm" />
            </div>
            <div className="space-y-1">
              <Label className="text-sm">Communication</Label>
              <RatingStars rating={communicationRating} onChange={setCommunicationRating} size="sm" />
            </div>
            <div className="space-y-1">
              <Label className="text-sm">Local Knowledge</Label>
              <RatingStars rating={knowledgeRating} onChange={setKnowledgeRating} size="sm" />
            </div>
          </div>

          {/* Review Title */}
          <div className="space-y-2">
            <Label htmlFor="reviewTitle">Review Title (optional)</Label>
            <Input
              id="reviewTitle"
              placeholder="Summarize your experience..."
              value={reviewTitle}
              onChange={(e) => setReviewTitle(e.target.value)}
              maxLength={100}
            />
          </div>

          {/* Review Text */}
          <div className="space-y-2">
            <Label htmlFor="reviewText">Your Review (optional)</Label>
            <Textarea
              id="reviewText"
              placeholder="Tell others about your experience..."
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              rows={4}
              maxLength={1000}
            />
            <p className="text-xs text-muted-foreground text-right">
              {reviewText.length}/1000 characters
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 justify-end pt-4">
            {onCancel && (
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancel
              </Button>
            )}
            <Button type="submit" disabled={isSubmitting || overallRating === 0}>
              {isSubmitting ? (
                <>Submitting...</>
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  Submit Review
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

// Review Display Component
interface ReviewDisplayProps {
  review: DriverReview;
  showResponse?: boolean;
  compact?: boolean;
}

export const ReviewDisplay: React.FC<ReviewDisplayProps> = ({
  review,
  showResponse = true,
  compact = false
}) => {
  return (
    <div className={`border rounded-lg ${compact ? 'p-3' : 'p-4'}`}>
      <div className="flex items-start gap-3">
        {/* Customer Avatar */}
        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-medium shrink-0">
          {review.customer_photo ? (
            <img
              src={review.customer_photo}
              alt={review.customer_name}
              className="w-full h-full rounded-full object-cover"
            />
          ) : (
            review.customer_name.charAt(0).toUpperCase()
          )}
        </div>

        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="font-medium">{review.customer_name}</p>
              <div className="flex items-center gap-2 mt-0.5">
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`w-4 h-4 ${
                        star <= review.overall_rating
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                {review.is_verified && (
                  <span className="text-xs bg-green-100 text-green-700 px-1.5 py-0.5 rounded">
                    Verified Trip
                  </span>
                )}
              </div>
            </div>
            <span className="text-xs text-muted-foreground shrink-0">
              {new Date(review.created_at).toLocaleDateString()}
            </span>
          </div>

          {/* Review Content */}
          {review.review_title && (
            <p className="font-medium mt-2">{review.review_title}</p>
          )}
          {review.review_text && (
            <p className="text-sm text-muted-foreground mt-1">{review.review_text}</p>
          )}

          {/* Trip Info */}
          {review.trip_route && (
            <p className="text-xs text-muted-foreground mt-2">
              Trip: {review.trip_route}
            </p>
          )}

          {/* Driver Response */}
          {showResponse && review.driver_response && (
            <div className="mt-3 pl-4 border-l-2 border-primary/30">
              <p className="text-xs font-medium text-primary">Driver Response</p>
              <p className="text-sm text-muted-foreground mt-1">{review.driver_response}</p>
            </div>
          )}

          {/* Helpful */}
          {!compact && review.helpful_count > 0 && (
            <p className="text-xs text-muted-foreground mt-2">
              {review.helpful_count} found this helpful
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

// Reviews List Component
interface ReviewsListProps {
  driverId: string;
}

export const ReviewsList: React.FC<ReviewsListProps> = ({ driverId }) => {
  const [reviews, setReviews] = React.useState<DriverReview[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [stats, setStats] = React.useState<{
    average: number;
    total: number;
    distribution: { [key: number]: number };
  } | null>(null);

  React.useEffect(() => {
    const loadReviews = async () => {
      try {
        const [reviewsData, statsData] = await Promise.all([
          driverReviewService.getDriverReviews(driverId),
          driverReviewService.getDriverStats(driverId)
        ]);
        setReviews(reviewsData);
        if (statsData) {
          setStats({
            average: statsData.average_rating,
            total: statsData.total_reviews,
            distribution: {
              5: statsData.rating_distribution.five_star,
              4: statsData.rating_distribution.four_star,
              3: statsData.rating_distribution.three_star,
              2: statsData.rating_distribution.two_star,
              1: statsData.rating_distribution.one_star
            }
          });
        }
      } catch (error) {
        console.error('Error loading reviews:', error);
      } finally {
        setLoading(false);
      }
    };

    loadReviews();
  }, [driverId]);

  if (loading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-24 bg-muted animate-pulse rounded-lg" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Rating Summary */}
      {stats && stats.total > 0 && (
        <div className="flex items-center gap-6 p-4 bg-muted/50 rounded-lg">
          <div className="text-center">
            <p className="text-3xl font-bold">{stats.average.toFixed(1)}</p>
            <div className="flex mt-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`w-4 h-4 ${
                    star <= Math.round(stats.average)
                      ? 'fill-yellow-400 text-yellow-400'
                      : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
            <p className="text-xs text-muted-foreground mt-1">{stats.total} reviews</p>
          </div>

          <div className="flex-1 space-y-1">
            {[5, 4, 3, 2, 1].map((rating) => {
              const count = stats.distribution[rating] || 0;
              const percent = stats.total > 0 ? (count / stats.total) * 100 : 0;
              return (
                <div key={rating} className="flex items-center gap-2 text-sm">
                  <span className="w-3">{rating}</span>
                  <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                  <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-yellow-400 rounded-full"
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                  <span className="w-8 text-xs text-muted-foreground">{count}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Reviews List */}
      {reviews.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          <p>No reviews yet</p>
        </div>
      ) : (
        <div className="space-y-3">
          {reviews.map((review) => (
            <ReviewDisplay key={review.id} review={review} />
          ))}
        </div>
      )}
    </div>
  );
};

export default DriverReviewForm;
