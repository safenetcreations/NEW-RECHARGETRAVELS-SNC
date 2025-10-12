import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Search, Star, Trash2, CheckCircle, XCircle, Filter } from 'lucide-react';
import { getDocs, collection, query, orderBy, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { db } from '@/services/firebaseService';

interface Review {
  id: string;
  rating: number;
  comment?: string;
  review_text?: string;
  guest_name: string;
  guest_email: string;
  is_verified: boolean;
  created_at: string;
  table_name: string;
  item_name?: string;
}

const ReviewsSection: React.FC = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');

  const filterOptions = ['all', 'verified', 'unverified', 'high_rating', 'low_rating'];

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      
      // Fetch reviews from multiple collections
      const [hotelReviewsSnapshot, activityReviewsSnapshot, driverReviewsSnapshot] = await Promise.all([
        getDocs(query(collection(db, 'hotel_reviews'), orderBy('created_at', 'desc'))),
        getDocs(query(collection(db, 'activity_reviews'), orderBy('created_at', 'desc'))),
        getDocs(query(collection(db, 'driver_reviews'), orderBy('created_at', 'desc')))
      ]);

      const allReviews: Review[] = [];

      interface RawReview {
        id: string;
        rating: number;
        comment?: string;
        review_text?: string;
        guest_name: string;
        guest_email: string;
        is_verified: boolean;
        created_at: string;
        hotel_name?: string;
        activity_name?: string;
        driver_name?: string;
      }

      // Process hotel reviews
      hotelReviewsSnapshot.docs.forEach(docSnap => {
        const review = { id: docSnap.id, ...docSnap.data() } as RawReview;
        allReviews.push({
          ...review,
          comment: review.review_text || '',
          table_name: 'hotels',
          item_name: review.hotel_name || 'Unknown Hotel'
        });
      });

      // Process activity reviews
      activityReviewsSnapshot.docs.forEach(docSnap => {
        const review = { id: docSnap.id, ...docSnap.data() } as RawReview;
        allReviews.push({
          ...review,
          table_name: 'activities',
          item_name: review.activity_name || 'Unknown Activity'
        });
      });

      // Process driver reviews
      driverReviewsSnapshot.docs.forEach(docSnap => {
        const review = { id: docSnap.id, ...docSnap.data() } as RawReview;
        allReviews.push({
          ...review,
          table_name: 'drivers',
          item_name: review.driver_name || 'Unknown Driver'
        });
      });

      // Sort by creation date
      allReviews.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
      
      setReviews(allReviews);
    } catch (error) {
      console.error('Error fetching reviews:', error);
      toast.error('Failed to fetch reviews');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyReview = async (review: Review) => {
    try {
      let collectionName = '';
      if (review.table_name === 'hotels') collectionName = 'hotel_reviews';
      else if (review.table_name === 'activities') collectionName = 'activity_reviews';
      else if (review.table_name === 'drivers') collectionName = 'driver_reviews';
      
      await updateDoc(doc(db, collectionName, review.id), { is_verified: true });
      toast.success('Review verified successfully');
      fetchReviews();
    } catch (error) {
      console.error('Error verifying review:', error);
      toast.error('Failed to verify review');
    }
  };

  const handleDeleteReview = async (review: Review) => {
    if (!confirm('Are you sure you want to delete this review?')) return;
    
    try {
      let collectionName = '';
      if (review.table_name === 'hotels') collectionName = 'hotel_reviews';
      else if (review.table_name === 'activities') collectionName = 'activity_reviews';
      else if (review.table_name === 'drivers') collectionName = 'driver_reviews';
      
      await deleteDoc(doc(db, collectionName, review.id));
      toast.success('Review deleted successfully');
      fetchReviews();
    } catch (error) {
      console.error('Error deleting review:', error);
      toast.error('Failed to delete review');
    }
  };

  const filteredReviews = reviews.filter(review => {
    const matchesSearch = 
      review.guest_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.comment?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.item_name?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = 
      selectedFilter === 'all' ||
      (selectedFilter === 'verified' && review.is_verified) ||
      (selectedFilter === 'unverified' && !review.is_verified) ||
      (selectedFilter === 'high_rating' && review.rating >= 4) ||
      (selectedFilter === 'low_rating' && review.rating <= 2);
    
    return matchesSearch && matchesFilter;
  });

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={`w-4 h-4 ${
          index < rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'
        }`}
      />
    ));
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Reviews Management</h2>
          <p className="text-gray-600">Manage and moderate all reviews across the platform</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Star className="w-6 h-6 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Reviews</p>
                <p className="text-2xl font-bold text-gray-900">{reviews.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Verified Reviews</p>
                <p className="text-2xl font-bold text-gray-900">
                  {reviews.filter(r => r.is_verified).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Star className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Average Rating</p>
                <p className="text-2xl font-bold text-gray-900">
                  {(reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length || 0).toFixed(1)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <XCircle className="w-6 h-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Pending Verification</p>
                <p className="text-2xl font-bold text-gray-900">
                  {reviews.filter(r => !r.is_verified).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex gap-4 items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search reviews by guest name, comment, or item..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <select
              value={selectedFilter}
              onChange={(e) => setSelectedFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md bg-white"
            >
              {filterOptions.map(filter => (
                <option key={filter} value={filter}>
                  {filter === 'all' ? 'All Reviews' : 
                   filter === 'high_rating' ? 'High Rating (4-5)' :
                   filter === 'low_rating' ? 'Low Rating (1-2)' :
                   filter.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                </option>
              ))}
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Reviews List */}
      <div className="space-y-4">
        {filteredReviews.map((review) => (
          <Card key={`${review.table_name}-${review.id}`} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-semibold text-lg">{review.guest_name}</h3>
                    <Badge variant="outline">{review.table_name.slice(0, -1)}</Badge>
                    <Badge variant={review.is_verified ? "default" : "secondary"}>
                      {review.is_verified ? 'Verified' : 'Unverified'}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center gap-2 mb-2">
                    {renderStars(review.rating)}
                    <span className="text-sm text-gray-600">for {review.item_name}</span>
                  </div>
                  
                  <p className="text-gray-700 mb-2">{review.comment}</p>
                  
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span>{review.guest_email}</span>
                    <span>•</span>
                    <span>{new Date(review.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
                
                <div className="flex gap-2 ml-4">
                  {!review.is_verified && (
                    <Button
                      size="sm"
                      onClick={() => handleVerifyReview(review)}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <CheckCircle className="w-4 h-4 mr-1" />
                      Verify
                    </Button>
                  )}
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleDeleteReview(review)}
                  >
                    <Trash2 className="w-4 h-4 mr-1" />
                    Delete
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredReviews.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <p className="text-gray-500">No reviews found matching your criteria.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ReviewsSection;