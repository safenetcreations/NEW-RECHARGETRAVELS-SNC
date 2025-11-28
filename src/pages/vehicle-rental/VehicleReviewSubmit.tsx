import React, { useState, useEffect } from 'react';
import { 
  Star, 
  Upload, 
  X, 
  Camera, 
  Car, 
  MessageSquare, 
  Sparkles, 
  DollarSign,
  Check,
  AlertCircle,
  ChevronLeft,
  Loader2,
  ThumbsUp,
  Heart
} from 'lucide-react';
import { Link, useParams, useNavigate } from 'react-router-dom';

interface ReviewFormData {
  overallRating: number;
  vehicleConditionRating: number;
  cleanlinessRating: number;
  valueForMoneyRating: number;
  ownerCommunicationRating: number;
  title: string;
  comment: string;
  photos: File[];
  recommend: boolean;
}

interface BookingDetails {
  id: string;
  reference: string;
  vehicleId: string;
  vehicleName: string;
  vehicleImage: string;
  vehicleType: string;
  ownerName: string;
  pickupDate: string;
  returnDate: string;
  totalDays: number;
  totalAmount: number;
}

const VehicleReviewSubmit: React.FC = () => {
  const { bookingId } = useParams<{ bookingId: string }>();
  const navigate = useNavigate();
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [booking, setBooking] = useState<BookingDetails | null>(null);
  const [hoveredRating, setHoveredRating] = useState<{ category: string; value: number } | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string[]>([]);
  
  const [formData, setFormData] = useState<ReviewFormData>({
    overallRating: 0,
    vehicleConditionRating: 0,
    cleanlinessRating: 0,
    valueForMoneyRating: 0,
    ownerCommunicationRating: 0,
    title: '',
    comment: '',
    photos: [],
    recommend: true,
  });

  // Rating categories configuration
  const ratingCategories = [
    { 
      key: 'vehicleConditionRating' as keyof ReviewFormData, 
      label: 'Vehicle Condition', 
      icon: Car,
      description: 'Mechanical condition, age, performance'
    },
    { 
      key: 'cleanlinessRating' as keyof ReviewFormData, 
      label: 'Cleanliness', 
      icon: Sparkles,
      description: 'Interior and exterior cleanliness'
    },
    { 
      key: 'valueForMoneyRating' as keyof ReviewFormData, 
      label: 'Value for Money', 
      icon: DollarSign,
      description: 'Was it worth the price?'
    },
    { 
      key: 'ownerCommunicationRating' as keyof ReviewFormData, 
      label: 'Owner Communication', 
      icon: MessageSquare,
      description: 'Responsiveness and helpfulness'
    },
  ];

  // Load booking details
  useEffect(() => {
    const loadBooking = async () => {
      setIsLoading(true);
      try {
        // Simulate API call - replace with actual service call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock booking data
        setBooking({
          id: bookingId || 'VB-001',
          reference: 'VB-2024-001234',
          vehicleId: 'v123',
          vehicleName: 'Toyota Prius 2022',
          vehicleImage: 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=400',
          vehicleType: 'Sedan',
          ownerName: 'Kamal Perera',
          pickupDate: 'Nov 20, 2025',
          returnDate: 'Nov 25, 2025',
          totalDays: 5,
          totalAmount: 375,
        });
      } catch (err) {
        setError('Failed to load booking details');
      } finally {
        setIsLoading(false);
      }
    };
    
    loadBooking();
  }, [bookingId]);

  const handleRatingChange = (category: string, value: number) => {
    setFormData(prev => ({ ...prev, [category]: value }));
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    
    const newFiles = Array.from(files).slice(0, 5 - formData.photos.length);
    const newPreviews = newFiles.map(file => URL.createObjectURL(file));
    
    setFormData(prev => ({
      ...prev,
      photos: [...prev.photos, ...newFiles],
    }));
    setPhotoPreview(prev => [...prev, ...newPreviews]);
  };

  const removePhoto = (index: number) => {
    URL.revokeObjectURL(photoPreview[index]);
    setFormData(prev => ({
      ...prev,
      photos: prev.photos.filter((_, i) => i !== index),
    }));
    setPhotoPreview(prev => prev.filter((_, i) => i !== index));
  };

  // Calculate overall rating as average
  const calculateOverallRating = (): number => {
    const ratings = [
      formData.vehicleConditionRating,
      formData.cleanlinessRating,
      formData.valueForMoneyRating,
      formData.ownerCommunicationRating,
    ].filter(r => r > 0);
    
    if (ratings.length === 0) return 0;
    return Math.round((ratings.reduce((a, b) => a + b, 0) / ratings.length) * 10) / 10;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate
    const hasAllRatings = ratingCategories.every(
      cat => (formData[cat.key] as number) > 0
    );
    
    if (!hasAllRatings) {
      setError('Please rate all categories');
      return;
    }
    
    if (formData.comment.length < 20) {
      setError('Please write at least 20 characters in your review');
      return;
    }
    
    setIsSubmitting(true);
    setError(null);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const reviewData = {
        vehicleId: booking?.vehicleId,
        bookingId: booking?.id,
        rating: calculateOverallRating(),
        vehicleConditionRating: formData.vehicleConditionRating,
        cleanlinessRating: formData.cleanlinessRating,
        valueForMoneyRating: formData.valueForMoneyRating,
        ownerCommunicationRating: formData.ownerCommunicationRating,
        title: formData.title,
        comment: formData.comment,
        recommend: formData.recommend,
        photos: [], // Would upload photos first
        isVerified: true,
        isPublic: true,
      };
      
      console.log('Submitting review:', reviewData);
      
      setIsSubmitted(true);
    } catch (err) {
      setError('Failed to submit review. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getRatingLabel = (rating: number): string => {
    if (rating === 0) return 'Select rating';
    if (rating === 1) return 'Poor';
    if (rating === 2) return 'Fair';
    if (rating === 3) return 'Good';
    if (rating === 4) return 'Very Good';
    return 'Excellent';
  };

  const StarRating: React.FC<{
    category: string;
    value: number;
    onChange: (value: number) => void;
    size?: 'sm' | 'md' | 'lg';
  }> = ({ category, value, onChange, size = 'md' }) => {
    const sizeClasses = {
      sm: 'w-5 h-5',
      md: 'w-7 h-7',
      lg: 'w-10 h-10',
    };
    
    const displayValue = hoveredRating?.category === category 
      ? hoveredRating.value 
      : value;
    
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            title={`Rate ${star} star${star > 1 ? 's' : ''}`}
            onMouseEnter={() => setHoveredRating({ category, value: star })}
            onMouseLeave={() => setHoveredRating(null)}
            onClick={() => onChange(star)}
            className="transition-transform hover:scale-110 focus:outline-none focus:scale-110"
          >
            <Star
              className={`${sizeClasses[size]} transition-colors ${
                star <= displayValue
                  ? 'fill-yellow-400 text-yellow-400'
                  : 'text-gray-300'
              }`}
            />
          </button>
        ))}
        <span className={`ml-2 font-medium ${
          displayValue > 0 ? 'text-gray-900' : 'text-gray-400'
        } ${size === 'lg' ? 'text-lg' : 'text-sm'}`}>
          {getRatingLabel(displayValue)}
        </span>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-emerald-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading booking details...</p>
        </div>
      </div>
    );
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-8 text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Check className="w-10 h-10 text-green-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Thank You for Your Review!
          </h1>
          <p className="text-gray-600 mb-6">
            Your feedback helps other travelers make informed decisions and helps vehicle owners improve their service.
          </p>
          
          <div className="bg-emerald-50 rounded-xl p-4 mb-6">
            <p className="text-emerald-800 font-medium">🎁 You earned 50 points!</p>
            <p className="text-sm text-emerald-600">Use them for discounts on your next booking.</p>
          </div>
          
          <div className="flex gap-3">
            <Link
              to="/vehicle-rental/my-bookings"
              className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors"
            >
              My Bookings
            </Link>
            <Link
              to="/vehicle-rental"
              className="flex-1 px-4 py-3 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700 transition-colors"
            >
              Book Again
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => navigate(-1)}
              title="Go back"
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Leave a Review</h1>
              <p className="text-sm text-gray-500">Share your experience with other travelers</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-6">
        {/* Booking Summary Card */}
        {booking && (
          <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6">
            <div className="flex gap-4">
              <img
                src={booking.vehicleImage}
                alt={booking.vehicleName}
                className="w-24 h-20 rounded-lg object-cover"
              />
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">{booking.vehicleName}</h3>
                <p className="text-sm text-gray-500">{booking.vehicleType} • Owned by {booking.ownerName}</p>
                <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                  <span>{booking.pickupDate} - {booking.returnDate}</span>
                  <span>•</span>
                  <span>{booking.totalDays} days</span>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500">Total paid</p>
                <p className="font-semibold text-gray-900">${booking.totalAmount}</p>
              </div>
            </div>
          </div>
        )}

        {/* Error Alert */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6 flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
            <p className="text-red-700">{error}</p>
            <button 
              onClick={() => setError(null)}
              title="Dismiss error"
              className="ml-auto p-1 hover:bg-red-100 rounded"
            >
              <X className="w-4 h-4 text-red-600" />
            </button>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Overall Rating - Large */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 text-center">
              How was your overall experience?
            </h2>
            <div className="flex justify-center">
              <StarRating
                category="overall"
                value={calculateOverallRating()}
                onChange={() => {}} // Calculated, not editable
                size="lg"
              />
            </div>
            <p className="text-center text-sm text-gray-500 mt-2">
              This is calculated from your ratings below
            </p>
          </div>

          {/* Category Ratings */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Rate Your Experience
            </h2>
            <div className="space-y-6">
              {ratingCategories.map((category) => {
                const Icon = category.icon;
                return (
                  <div key={category.key} className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center shrink-0">
                      <Icon className="w-5 h-5 text-gray-600" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium text-gray-900">{category.label}</span>
                      </div>
                      <p className="text-sm text-gray-500 mb-2">{category.description}</p>
                      <StarRating
                        category={category.key}
                        value={formData[category.key] as number}
                        onChange={(value) => handleRatingChange(category.key, value)}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Review Title */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <label className="block text-lg font-semibold text-gray-900 mb-2">
              Review Title (Optional)
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="Summarize your experience in a few words"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              maxLength={100}
            />
            <p className="text-sm text-gray-500 mt-1 text-right">
              {formData.title.length}/100
            </p>
          </div>

          {/* Review Comment */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <label className="block text-lg font-semibold text-gray-900 mb-2">
              Your Review <span className="text-red-500">*</span>
            </label>
            <textarea
              value={formData.comment}
              onChange={(e) => setFormData(prev => ({ ...prev, comment: e.target.value }))}
              placeholder="Share details about your rental experience. What did you like? What could be improved? How was the vehicle condition?"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 min-h-[150px] resize-y"
              required
              minLength={20}
            />
            <div className="flex justify-between items-center mt-2">
              <p className={`text-sm ${formData.comment.length < 20 ? 'text-red-500' : 'text-gray-500'}`}>
                {formData.comment.length < 20 
                  ? `Minimum 20 characters required (${20 - formData.comment.length} more needed)`
                  : `${formData.comment.length} characters`}
              </p>
            </div>
          </div>

          {/* Photo Upload */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Add Photos (Optional)</h2>
                <p className="text-sm text-gray-500">Share up to 5 photos of your experience</p>
              </div>
              <span className="text-sm text-gray-500">{formData.photos.length}/5</span>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
              {photoPreview.map((preview, index) => (
                <div key={index} className="relative aspect-square rounded-lg overflow-hidden group">
                  <img
                    src={preview}
                    alt={`Preview ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => removePhoto(index)}
                    title={`Remove photo ${index + 1}`}
                    className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full 
                             opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
              
              {formData.photos.length < 5 && (
                <label className="aspect-square border-2 border-dashed border-gray-300 rounded-lg 
                               flex flex-col items-center justify-center cursor-pointer
                               hover:border-emerald-500 hover:bg-emerald-50 transition-colors">
                  <Camera className="w-8 h-8 text-gray-400 mb-2" />
                  <span className="text-sm text-gray-500">Add Photo</span>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handlePhotoUpload}
                    className="hidden"
                    title="Upload photos"
                  />
                </label>
              )}
            </div>
          </div>

          {/* Recommendation */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Would you recommend this vehicle?
            </h2>
            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, recommend: true }))}
                className={`flex-1 flex items-center justify-center gap-3 p-4 rounded-xl border-2 transition-all
                  ${formData.recommend 
                    ? 'border-emerald-500 bg-emerald-50 text-emerald-700' 
                    : 'border-gray-200 hover:border-gray-300'}`}
              >
                <ThumbsUp className={`w-6 h-6 ${formData.recommend ? 'fill-emerald-200' : ''}`} />
                <span className="font-medium">Yes, I recommend</span>
              </button>
              <button
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, recommend: false }))}
                className={`flex-1 flex items-center justify-center gap-3 p-4 rounded-xl border-2 transition-all
                  ${!formData.recommend 
                    ? 'border-red-500 bg-red-50 text-red-700' 
                    : 'border-gray-200 hover:border-gray-300'}`}
              >
                <ThumbsUp className={`w-6 h-6 rotate-180 ${!formData.recommend ? 'fill-red-200' : ''}`} />
                <span className="font-medium">No, not recommended</span>
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-6 py-3 text-gray-700 font-medium hover:bg-gray-100 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-emerald-600 text-white 
                       font-medium rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <Heart className="w-5 h-5" />
                  Submit Review
                </>
              )}
            </button>
          </div>

          {/* Terms */}
          <p className="text-center text-sm text-gray-500">
            By submitting this review, you agree to our{' '}
            <Link to="/terms" className="text-emerald-600 hover:underline">Review Guidelines</Link>
            {' '}and{' '}
            <Link to="/privacy" className="text-emerald-600 hover:underline">Privacy Policy</Link>.
          </p>
        </form>
      </div>
    </div>
  );
};

export default VehicleReviewSubmit;
