import { motion } from 'framer-motion';
import { Star, MapPin, Users, Calendar, ExternalLink } from 'lucide-react';

// TripAdvisor Reviews Data
const tripAdvisorReviews = [
  {
    id: 1,
    name: 'Anura De Zoysa Trip',
    location: 'Singapore',
    date: 'November 2024',
    rating: 5,
    title: 'Friendly, caring and accommodating',
    text: 'Our driver Mr Anura De Zoysa arrived at our hotel on time. He was friendly, caring and accommodating to all our needs as we were traveling with a 2yr old. He even took care of our daughter a few times!',
    tripType: '8-Day Trip',
    avatar: 'A'
  },
  {
    id: 2,
    name: 'Kethees Experience',
    location: 'UK',
    date: 'October 2024',
    rating: 5,
    title: '100% recommend this service',
    text: 'We had our trip tailored to everywhere we wished to see, including Colombo, Yala, Kandy, Trinco and Jaffna. Kethees took us to really nice places to eat and acted as our guide.',
    tripType: 'Family Trip',
    avatar: 'K'
  },
  {
    id: 3,
    name: 'Perfect Package Trip',
    location: 'India',
    date: 'September 2024',
    rating: 5,
    title: 'Professional and Reliable',
    text: 'Perfect package and an amazing staff. Experienced and polite Drivers. Our driver Mr.Mohammed was very helpful in planning our journey. Definitely recommend!',
    tripType: 'Group of 5',
    avatar: 'P'
  }
];

const ReviewsSection = () => {
  const StarRating = ({ rating }: { rating: number }) => (
    <div className="flex gap-1">
      {[...Array(rating)].map((_, i) => (
        <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
      ))}
    </div>
  );

  return (
    <div className="bg-gradient-to-b from-white via-slate-50 to-white">
      {/* TripAdvisor Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
        <div className="container mx-auto max-w-7xl">
          {/* Header */}
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              🏆 TripAdvisor Reviews
            </h2>
            <p className="text-xl text-gray-600">
              See what travelers are saying about their Sri Lanka experience with us
            </p>
          </div>

          {/* TripAdvisor Badge */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 bg-white rounded-2xl shadow-xl p-8 mb-12 max-w-2xl mx-auto border-l-4 border-green-600">
            <img
              src="https://static.tacdn.com/img2/brand_refresh/Tripadvisor_lockup_horizontal_secondary_registered.svg"
              alt="TripAdvisor"
              className="h-12"
            />
            <div className="text-center sm:text-left">
              <div className="flex items-center gap-3 justify-center sm:justify-start mb-1">
                <span className="text-4xl font-bold text-green-600">5.0</span>
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-6 h-6 fill-green-600 text-green-600" />
                  ))}
                </div>
              </div>
              <p className="text-gray-600">Based on 50+ reviews</p>
            </div>
          </div>

          {/* Reviews Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {tripAdvisorReviews.map((review) => (
              <div
                key={review.id}
                className="bg-white rounded-xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 border-l-4 border-green-600 hover:-translate-y-2"
              >
                {/* Reviewer Info */}
                <div className="flex items-start gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-600 to-emerald-600 flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                    {review.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-gray-900 truncate">{review.name}</h4>
                    <div className="flex items-center gap-1 text-sm text-gray-500 mb-1">
                      <MapPin className="w-3 h-3" />
                      <span>{review.location}</span>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-gray-400">
                      <Calendar className="w-3 h-3" />
                      <span>{review.date}</span>
                    </div>
                  </div>
                </div>

                {/* Rating */}
                <StarRating rating={review.rating} />

                {/* Review Content */}
                <h5 className="font-semibold text-gray-900 mt-3 mb-2">{review.title}</h5>
                <p className="text-gray-600 text-sm leading-relaxed line-clamp-4">
                  {review.text}
                </p>

                {/* Trip Type Badge */}
                <div className="mt-4">
                  <span className="inline-flex items-center gap-2 px-3 py-1 bg-green-50 text-green-700 rounded-full text-xs font-medium">
                    <Users className="w-3 h-3" />
                    {review.tripType}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* View All Button */}
          <div className="text-center">
            <a
              href="https://www.tripadvisor.com/Attraction_Review-g293962-d10049587-Reviews-Recharge_Travels_And_Tours-Colombo_Western_Province.html"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-8 py-4 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              View All Reviews on TripAdvisor
              <ExternalLink className="w-5 h-5" />
            </a>
          </div>
        </div>
      </section>

      {/* Trust Badges Strip */}
      <section className="py-12 px-4 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900">
        <div className="container mx-auto max-w-7xl">
          <h3 className="text-white text-center text-xl mb-8 opacity-90">
            Trusted by Travelers Worldwide
          </h3>

          <div className="flex flex-wrap justify-center items-center gap-12">
            <a
              href="https://www.tripadvisor.com/Attraction_Review-g293962-d10049587-Reviews-Recharge_Travels_And_Tours-Colombo_Western_Province.html"
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center gap-2 text-white no-underline transition-transform hover:scale-110"
            >
              <span className="text-4xl">🦉</span>
              <span className="text-xs opacity-70">TripAdvisor</span>
              <span className="text-xl font-bold">5.0 ★★★★★</span>
              <span className="text-xs opacity-60">50+ Reviews</span>
            </a>

            <a
              href="https://www.google.com/maps/place/Recharge+Travels"
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center gap-2 text-white no-underline transition-transform hover:scale-110"
            >
              <span className="text-4xl">🔷</span>
              <span className="text-xs opacity-70">Google</span>
              <span className="text-xl font-bold">5.0 ★★★★★</span>
              <span className="text-xs opacity-60">30+ Reviews</span>
            </a>

            <a
              href="https://www.facebook.com/Rechargetours"
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center gap-2 text-white no-underline transition-transform hover:scale-110"
            >
              <span className="text-4xl">👍</span>
              <span className="text-xs opacity-70">Facebook</span>
              <span className="text-xl font-bold">5.0 ★★★★★</span>
              <span className="text-xs opacity-60">40+ Recommendations</span>
            </a>

            <div className="flex flex-col items-center gap-2 text-white">
              <span className="text-4xl">🏅</span>
              <span className="text-xs opacity-70">SLTDA</span>
              <span className="text-xl font-bold">Licensed</span>
              <span className="text-xs opacity-60">Tour Operator</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ReviewsSection;
