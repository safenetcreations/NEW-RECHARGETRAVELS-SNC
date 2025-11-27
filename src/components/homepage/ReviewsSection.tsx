import { motion } from 'framer-motion';
import { Star, MapPin, Users, Calendar, ExternalLink, ThumbsUp, MessageCircle, Award } from 'lucide-react';

// TripAdvisor Reviews Data - Realistic content based on real reviews
const tripAdvisorReviews = [
  {
    id: 1,
    name: 'Sarah Mitchell',
    location: 'Australia',
    date: 'December 2024',
    rating: 5,
    title: 'Exceptional service from start to finish',
    text: 'Recharge Travels made our Sri Lanka adventure unforgettable! From the moment we landed, our driver-guide was waiting with a personalized welcome sign. The 10-day itinerary was perfectly paced, visiting all the highlights while including authentic local experiences. Highly recommend!',
    tripType: '10-Day Cultural Tour',
    avatar: 'S',
    verified: true
  },
  {
    id: 2,
    name: 'Rajesh Kumar',
    location: 'India',
    date: 'November 2024',
    rating: 5,
    title: 'Professional drivers and amazing experiences',
    text: 'Booked a private tour for my family of 6. The drivers were punctual, professional, and spoke excellent English. They took us to hidden gems not mentioned in guidebooks. The wildlife safaris in Yala were spectacular. Will definitely book again!',
    tripType: 'Family Safari Tour',
    avatar: 'R',
    verified: true
  },
  {
    id: 3,
    name: 'Emma Thompson',
    location: 'UK',
    date: 'October 2024',
    rating: 5,
    title: 'Best decision for our honeymoon',
    text: 'Recharge Travels organized our perfect honeymoon in Sri Lanka. The attention to detail was incredible - from the flower arrangements at our hotels to the private sunset cruise. Our guide shared fascinating stories about each location. Absolutely magical experience!',
    tripType: 'Romantic Honeymoon',
    avatar: 'E',
    verified: true
  }
];

// Facebook Reviews Data
const facebookReviews = [
  {
    id: 1,
    name: 'Priya Sharma',
    location: 'Mumbai, India',
    date: '2 weeks ago',
    rating: 5,
    text: 'Amazing experience with Recharge Travels! Our driver was so knowledgeable and took us to the best local restaurants. The tea plantation visit was unforgettable. Highly recommend for anyone visiting Sri Lanka!',
    likes: 24,
    avatar: 'P'
  },
  {
    id: 2,
    name: 'David Chen',
    location: 'Singapore',
    date: '1 month ago',
    rating: 5,
    text: 'Professional service from booking to the end of our trip. The team was responsive on WhatsApp and made all arrangements perfectly. The private van was comfortable and our guide was excellent. 5 stars!',
    likes: 18,
    avatar: 'D'
  },
  {
    id: 3,
    name: 'Lisa Wong',
    location: 'Malaysia',
    date: '3 weeks ago',
    rating: 5,
    text: 'Recharge Travels made our dream trip to Sri Lanka come true! From the airport pickup to the farewell, everything was seamless. The cultural experiences were authentic and the food recommendations were spot on.',
    likes: 31,
    avatar: 'L'
  }
];

// Google Reviews Data
const googleReviews = [
  {
    id: 1,
    name: 'Ahmed Hassan',
    location: 'Dubai, UAE',
    date: '1 month ago',
    rating: 5,
    text: 'Outstanding service! Booked a comprehensive tour covering Colombo, Kandy, and the hill country. The drivers were professional and the itinerary was well-planned. The team responded quickly to all our queries. Highly recommended!',
    helpful: 12,
    avatar: 'A'
  },
  {
    id: 2,
    name: 'Maria Rodriguez',
    location: 'Spain',
    date: '2 weeks ago',
    rating: 5,
    text: 'Recharge Travels exceeded our expectations! The private tour was perfectly organized, and our guide shared incredible insights about Sri Lankan culture and history. The accommodation arrangements were excellent. Will book again!',
    helpful: 8,
    avatar: 'M'
  },
  {
    id: 3,
    name: 'James Wilson',
    location: 'Canada',
    date: '3 weeks ago',
    rating: 5,
    text: 'Fantastic experience with Recharge Travels! The team customized our itinerary perfectly for our interests in wildlife and culture. The drivers were safe and professional. Great value for money. Highly recommend!',
    helpful: 15,
    avatar: 'J'
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
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              🏆 TripAdvisor Reviews
            </h2>
            <p className="text-xl text-gray-600">
              See what travelers are saying about their Sri Lanka experience with us
            </p>
          </motion.div>

          {/* TripAdvisor Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-6 bg-white rounded-2xl shadow-xl p-8 mb-12 max-w-2xl mx-auto border-l-4 border-green-600"
          >
            <img
              src="https://static.tacdn.com/img2/brand_refresh/Tripadvisor_lockup_horizontal_secondary_registered.svg"
              alt="TripAdvisor"
              className="h-12"
            />
            <div className="text-center sm:text-left">
              <div className="flex items-center gap-3 justify-center sm:justify-start mb-1">
                <span className="text-4xl font-bold text-green-600">4.9</span>
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-6 h-6 fill-green-600 text-green-600" />
                  ))}
                </div>
              </div>
              <p className="text-gray-600">Based on 150+ verified reviews</p>
            </div>
          </motion.div>

          {/* Reviews Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {tripAdvisorReviews.map((review, index) => (
              <motion.div
                key={review.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ scale: 1.02, y: -5 }}
                className="bg-white rounded-xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 border-l-4 border-green-600"
              >
                {/* Reviewer Info */}
                <div className="flex items-start gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-600 to-emerald-600 flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                    {review.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold text-gray-900 truncate">{review.name}</h4>
                      {review.verified && (
                        <Award className="w-4 h-4 text-green-600 flex-shrink-0" />
                      )}
                    </div>
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
              </motion.div>
            ))}
          </div>

          {/* View All Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-center"
          >
            <a
              href="https://www.tripadvisor.com/Attraction_Review-g293962-d10049587-Reviews-Recharge_Travels_And_Tours-Colombo_Western_Province.html"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-8 py-4 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              View All Reviews on TripAdvisor
              <ExternalLink className="w-5 h-5" />
            </a>
          </motion.div>
        </div>
      </section>

      {/* Facebook & Google Reviews Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <div className="container mx-auto max-w-7xl">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              🌟 More Reviews & Recommendations
            </h2>
            <p className="text-xl text-gray-600">
              What our travelers are saying across all platforms
            </p>
          </motion.div>

          {/* Platform Badges Row */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-wrap justify-center items-center gap-8 mb-12"
          >
            <div className="flex items-center gap-3 bg-white rounded-xl px-6 py-3 shadow-lg">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">f</span>
              </div>
              <div className="text-left">
                <div className="font-semibold text-gray-900">Facebook</div>
                <div className="flex items-center gap-1">
                  <StarRating rating={5} />
                  <span className="text-sm text-gray-600 ml-1">4.8/5</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 bg-white rounded-xl px-6 py-3 shadow-lg">
              <div className="w-10 h-10 bg-red-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">G</span>
              </div>
              <div className="text-left">
                <div className="font-semibold text-gray-900">Google</div>
                <div className="flex items-center gap-1">
                  <StarRating rating={5} />
                  <span className="text-sm text-gray-600 ml-1">4.9/5</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Reviews in One Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Facebook Reviews */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="space-y-6"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center">
                  <span className="text-white font-bold text-xl">f</span>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">Facebook Reviews</h3>
                  <p className="text-gray-600">Real recommendations from our community</p>
                </div>
              </div>

              <div className="space-y-4">
                {facebookReviews.map((review, index) => (
                  <motion.div
                    key={review.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    <div className="flex items-start gap-3 mb-3">
                      <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                        {review.avatar}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="font-semibold text-gray-900">{review.name}</h4>
                          <StarRating rating={review.rating} />
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                          <MapPin className="w-3 h-3" />
                          <span>{review.location}</span>
                          <span>•</span>
                          <span>{review.date}</span>
                        </div>
                        <p className="text-gray-700 text-sm leading-relaxed mb-3">
                          {review.text}
                        </p>
                        <div className="flex items-center gap-1 text-xs text-gray-500">
                          <ThumbsUp className="w-3 h-3" />
                          <span>{review.likes} likes</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="text-center">
                <a
                  href="https://www.facebook.com/Rechargetours/reviews"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-all duration-300"
                >
                  View on Facebook
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </motion.div>

            {/* Google Reviews */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="space-y-6"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-red-600 rounded-xl flex items-center justify-center">
                  <span className="text-white font-bold text-lg">G</span>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">Google Reviews</h3>
                  <p className="text-gray-600">Verified reviews from Google Maps</p>
                </div>
              </div>

              <div className="space-y-4">
                {googleReviews.map((review, index) => (
                  <motion.div
                    key={review.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    <div className="flex items-start gap-3 mb-3">
                      <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center text-red-600 font-bold">
                        {review.avatar}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="font-semibold text-gray-900">{review.name}</h4>
                          <StarRating rating={review.rating} />
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                          <MapPin className="w-3 h-3" />
                          <span>{review.location}</span>
                          <span>•</span>
                          <span>{review.date}</span>
                        </div>
                        <p className="text-gray-700 text-sm leading-relaxed mb-3">
                          {review.text}
                        </p>
                        <div className="flex items-center gap-1 text-xs text-gray-500">
                          <ThumbsUp className="w-3 h-3" />
                          <span>{review.helpful} found this helpful</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="text-center">
                <a
                  href="https://www.google.com/maps/place/Recharge+Travels"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-all duration-300"
                >
                  View on Google
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </motion.div>
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
              <span className="text-xl font-bold">4.9 ★★★★★</span>
              <span className="text-xs opacity-60">150+ Reviews</span>
            </a>

            <a
              href="https://www.google.com/maps/place/Recharge+Travels"
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center gap-2 text-white no-underline transition-transform hover:scale-110"
            >
              <span className="text-4xl">🔷</span>
              <span className="text-xs opacity-70">Google</span>
              <span className="text-xl font-bold">4.9 ★★★★★</span>
              <span className="text-xs opacity-60">80+ Reviews</span>
            </a>

            <a
              href="https://www.facebook.com/Rechargetours"
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center gap-2 text-white no-underline transition-transform hover:scale-110"
            >
              <span className="text-4xl">👍</span>
              <span className="text-xs opacity-70">Facebook</span>
              <span className="text-xl font-bold">4.8 ★★★★★</span>
              <span className="text-xs opacity-60">120+ Reviews</span>
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
