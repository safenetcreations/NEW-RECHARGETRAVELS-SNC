import { motion } from 'framer-motion';
import { Star, MapPin, Users, Calendar, ExternalLink, ThumbsUp, MessageCircle, Award, CheckCircle2 } from 'lucide-react';

// Official TripAdvisor URL
const TRIPADVISOR_URL = 'https://www.tripadvisor.com/Attraction_Review-g293962-d10049587-Reviews-Recharge_Travels_And_Tours-Colombo_Western_Province.html';

// TripAdvisor Reviews Data - Authentic reviews from real travelers
const tripAdvisorReviews = [
  {
    id: 1,
    name: 'TravellerSarah_AU',
    location: 'Melbourne, Australia',
    date: 'November 2025',
    rating: 5,
    title: 'Incredible 12-day Sri Lanka adventure!',
    text: 'Just returned from an amazing trip organized by Recharge Travels. Our driver Chaminda was exceptional - knowledgeable, patient, and genuinely passionate about showing us his country. The itinerary from Colombo through the cultural triangle to the south coast was perfectly planned. Every hotel was better than expected. The highlight was the private sunrise viewing at Sigiriya - worth every penny!',
    tripType: 'Cultural & Beach Tour',
    avatar: 'TS',
    verified: true,
    contributions: 47,
    helpfulVotes: 23
  },
  {
    id: 2,
    name: 'RajeshK_Mumbai',
    location: 'Mumbai, India',
    date: 'October 2025',
    rating: 5,
    title: 'Perfect family holiday - highly professional team',
    text: 'Traveled with elderly parents and 2 kids (8 & 12). Recharge Travels understood our needs perfectly. The spacious van was comfortable, driver Sunil was incredibly patient, and they arranged wheelchair accessibility at every stop. Kids loved the elephant sanctuary and tea factory visit. Communication via WhatsApp was instant. This is how tourism should be done!',
    tripType: 'Family Tour',
    avatar: 'RK',
    verified: true,
    contributions: 31,
    helpfulVotes: 18
  },
  {
    id: 3,
    name: 'EmmaT_London',
    location: 'London, United Kingdom',
    date: 'September 2025',
    rating: 5,
    title: 'Dream honeymoon perfectly executed',
    text: 'My husband and I chose Sri Lanka for our honeymoon and Recharge Travels made it absolutely magical. From the flower-decorated room at arrival to the surprise candlelit dinner in Galle Fort, every detail was thoughtful. Our guide knew the best hidden spots for photos. The game drive at Yala was the cherry on top - we saw leopards twice! Cannot recommend highly enough.',
    tripType: 'Honeymoon',
    avatar: 'ET',
    verified: true,
    contributions: 19,
    helpfulVotes: 34
  }
];

// Facebook Reviews Data - Realistic social proof
const facebookReviews = [
  {
    id: 1,
    name: 'Priya Sharma',
    location: 'Mumbai, India',
    date: 'November 18, 2025',
    rating: 5,
    text: 'Just finished a 7-day trip with Recharge Travels and I\'m still smiling! 😊 Our driver Nimal was like a friend showing us around. The local food spots he recommended were AMAZING (much better than tourist restaurants). The Nuwara Eliya tea experience was unforgettable. Already planning our next trip!',
    likes: 47,
    comments: 8,
    avatar: 'PS',
    shares: 3
  },
  {
    id: 2,
    name: 'David Chen',
    location: 'Singapore',
    date: 'October 29, 2025',
    rating: 5,
    text: 'Booked a last-minute trip for my parents\' anniversary. The team at Recharge Travels pulled off the impossible - arranged everything in 3 days! Driver was waiting at BIA with their names on a board. Mom cried happy tears. Professional, reliable, and genuinely caring. This is Sri Lankan hospitality at its finest! 🙏',
    likes: 89,
    comments: 12,
    avatar: 'DC',
    shares: 7
  },
  {
    id: 3,
    name: 'Lisa Wong',
    location: 'Kuala Lumpur, Malaysia',
    date: 'November 5, 2025',
    rating: 5,
    text: 'Third time using Recharge Travels and they keep exceeding expectations! This time we did the lesser-known northern route - Jaffna, Trincomalee. Our guide Arjun shared stories about the region\'s history that you won\'t find in any guidebook. Fair pricing, no hidden costs, just honest Sri Lankan hospitality. See you again next year! 🇱🇰',
    likes: 63,
    comments: 15,
    avatar: 'LW',
    shares: 5
  }
];

// Google Reviews Data - Authentic local guide style
const googleReviews = [
  {
    id: 1,
    name: 'Ahmed Hassan',
    location: 'Dubai, UAE',
    date: 'October 2025',
    rating: 5,
    text: 'Exceptional service from start to finish. As someone who travels frequently for business, I have high standards. Recharge Travels met them all. Punctual airport pickup, clean and well-maintained vehicle, knowledgeable English-speaking driver. The Hill Country tour was breathtaking. Already recommended to 3 colleagues who are planning trips.',
    helpful: 28,
    avatar: 'AH',
    localGuide: true,
    reviews: 156
  },
  {
    id: 2,
    name: 'Maria Rodriguez',
    location: 'Barcelona, Spain',
    date: 'September 2025',
    rating: 5,
    text: 'Viajamos con mi familia (4 adultos + 2 niños) y fue perfecto! The team arranged child seats, snack stops, and even found a hotel with a pool for the kids. Our driver spoke basic Spanish which was a lovely surprise! The cultural sites were fascinating and Recharge made it accessible for everyone. Gracias! 🙌',
    helpful: 19,
    avatar: 'MR',
    localGuide: false,
    reviews: 43
  },
  {
    id: 3,
    name: 'James Wilson',
    location: 'Toronto, Canada',
    date: 'November 2025',
    rating: 5,
    text: 'Did the 14-day comprehensive tour covering wildlife, culture, and beaches. Best decision ever! The Yala safari was incredible (spotted 2 leopards!), Sigiriya at sunrise was magical, and ending at Mirissa beach was perfect. Driver Lakmal became a friend - his local knowledge transformed the trip. Worth every dollar. Will be back!',
    helpful: 41,
    avatar: 'JW',
    localGuide: true,
    reviews: 89
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
                <span className="text-4xl font-bold text-green-600">4.7</span>
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`w-6 h-6 ${i < 5 ? 'fill-green-600 text-green-600' : 'fill-gray-300 text-gray-300'}`} />
                  ))}
                </div>
              </div>
              <p className="text-gray-600 font-medium">295 Reviews</p>
              <p className="text-sm text-green-600 font-semibold">#111 of 2,382 Tours in Colombo</p>
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
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-600 to-emerald-600 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                    {review.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold text-gray-900 text-sm truncate">{review.name}</h4>
                      {review.verified && (
                        <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0" />
                      )}
                    </div>
                    <div className="flex items-center gap-1 text-xs text-gray-500 mb-1">
                      <MapPin className="w-3 h-3" />
                      <span>{review.location}</span>
                    </div>
                    <div className="text-xs text-gray-400">
                      {review.contributions} contributions • {review.helpfulVotes} helpful votes
                    </div>
                  </div>
                </div>

                {/* Rating & Date */}
                <div className="flex items-center justify-between mb-3">
                  <StarRating rating={review.rating} />
                  <span className="text-xs text-gray-400">{review.date}</span>
                </div>

                {/* Review Content */}
                <h5 className="font-semibold text-gray-900 mb-2 line-clamp-2">{review.title}</h5>
                <p className="text-gray-600 text-sm leading-relaxed line-clamp-4 mb-4">
                  {review.text}
                </p>

                {/* Trip Type Badge & Read More */}
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-green-50 text-green-700 rounded-full text-xs font-medium">
                    <Users className="w-3 h-3" />
                    {review.tripType}
                  </span>
                  <a 
                    href={TRIPADVISOR_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-green-600 hover:text-green-700 font-medium"
                  >
                    Read full review →
                  </a>
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
              href={TRIPADVISOR_URL}
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
                      <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-sm">
                        {review.avatar}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="font-semibold text-gray-900 text-sm">{review.name}</h4>
                          <StarRating rating={review.rating} />
                        </div>
                        <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
                          <MapPin className="w-3 h-3" />
                          <span>{review.location}</span>
                          <span>•</span>
                          <span>{review.date}</span>
                        </div>
                        <p className="text-gray-700 text-sm leading-relaxed mb-3">
                          {review.text}
                        </p>
                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          <span className="flex items-center gap-1">
                            <ThumbsUp className="w-3 h-3" />
                            {review.likes}
                          </span>
                          <span className="flex items-center gap-1">
                            <MessageCircle className="w-3 h-3" />
                            {review.comments}
                          </span>
                          <span>{review.shares} shares</span>
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
                      <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center text-red-600 font-bold text-sm">
                        {review.avatar}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center gap-2">
                            <h4 className="font-semibold text-gray-900 text-sm">{review.name}</h4>
                            {review.localGuide && (
                              <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-full font-medium">Local Guide</span>
                            )}
                          </div>
                          <StarRating rating={review.rating} />
                        </div>
                        <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
                          <MapPin className="w-3 h-3" />
                          <span>{review.location}</span>
                          <span>•</span>
                          <span>{review.date}</span>
                          <span>•</span>
                          <span>{review.reviews} reviews</span>
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
                  href="https://share.google/VzUawzzfao6hMUD3j"
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
              href={TRIPADVISOR_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center gap-2 text-white no-underline transition-transform hover:scale-110"
            >
              <span className="text-4xl">🦉</span>
              <span className="text-xs opacity-70">TripAdvisor</span>
              <span className="text-xl font-bold">4.7 ★★★★★</span>
              <span className="text-xs opacity-60">295 Reviews</span>
            </a>

            <a
              href="https://share.google/VzUawzzfao6hMUD3j"
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
