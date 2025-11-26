
import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import StarRating from '@/components/hotels/StarRating'
import { HotelReview } from '@/types/hotel'

interface HotelReviewsProps {
  reviews: HotelReview[]
}

const HotelReviews: React.FC<HotelReviewsProps> = ({ reviews }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Guest Reviews</CardTitle>
      </CardHeader>
      <CardContent>
        {reviews.length > 0 ? (
          <div className="space-y-4">
            {reviews.map((review) => (
              <div key={review.id} className="border-b border-gray-200 pb-4 last:border-b-0">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <StarRating rating={review.rating} />
                    <h4 className="font-semibold text-gray-900">{review.title}</h4>
                  </div>
                  <span className="text-sm text-gray-500">
                    {new Date(review.created_at).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-gray-700">{review.review_text}</p>
                {review.pros && (
                  <p className="text-green-600 text-sm mt-2"><strong>Pros:</strong> {review.pros}</p>
                )}
                {review.cons && (
                  <p className="text-red-600 text-sm"><strong>Cons:</strong> {review.cons}</p>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-600">No reviews yet. Be the first to review this hotel!</p>
        )}
      </CardContent>
    </Card>
  )
}

export default HotelReviews
