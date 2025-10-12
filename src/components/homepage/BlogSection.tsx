import { motion } from 'framer-motion';
import { Calendar, User, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const BlogSection = () => {
  const posts = [
    {
      id: 1,
      title: "10 Hidden Gems in Sri Lanka That Most Tourists Miss",
      excerpt: "Discover secret beaches, ancient ruins, and local experiences off the beaten path",
      image: "https://images.unsplash.com/photo-1552055568-f6dcea098c4e?q=80&w=800",
      author: "Sarah Williams",
      date: "Jan 15, 2024",
      category: "Travel Tips"
    },
    {
      id: 2,
      title: "The Ultimate Guide to Sri Lankan Street Food",
      excerpt: "From kottu roti to hoppers, explore the flavors that define Sri Lankan cuisine",
      image: "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?q=80&w=800",
      author: "Michael Chen",
      date: "Jan 10, 2024",
      category: "Food & Culture"
    },
    {
      id: 3,
      title: "Best Time to Visit Each Region of Sri Lanka",
      excerpt: "Plan your perfect trip with our month-by-month weather and festival guide",
      image: "https://images.unsplash.com/photo-1570168007204-dfb528c6958f?q=80&w=800",
      author: "Emma Davis",
      date: "Jan 5, 2024",
      category: "Planning"
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="text-blue-600 font-semibold text-sm uppercase tracking-wider">Travel Insights</span>
          <h2 className="text-4xl font-bold text-gray-900 mt-4 mb-4 font-playfair">Latest from Our Blog</h2>
          <p className="text-xl text-gray-600">Tips, guides, and inspiration for your Sri Lankan adventure</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {posts.map((post, index) => (
            <motion.article
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group cursor-pointer"
            >
              <Link to={`/blog/${post.id}`}>
                <div className="relative h-56 mb-4 overflow-hidden rounded-xl">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-semibold">
                      {post.category}
                    </span>
                  </div>
                </div>
                
                <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                  {post.title}
                </h3>
                <p className="text-gray-600 mb-4 line-clamp-2">{post.excerpt}</p>
                
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1">
                      <User className="w-4 h-4" />
                      {post.author}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {post.date}
                    </span>
                  </div>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            </motion.article>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <Link to="/blog">
            <button className="px-6 py-3 border-2 border-gray-300 text-gray-700 hover:border-blue-600 hover:text-blue-600 rounded-lg transition-all">
              View All Articles
            </button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default BlogSection;