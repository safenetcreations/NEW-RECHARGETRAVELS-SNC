import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Calendar, User, ArrowRight, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import useEmblaCarousel from 'embla-carousel-react';
import { getDocs, collection, query, orderBy, where } from 'firebase/firestore';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';
import { db } from '@/services/firebaseService';

interface Post {
  id: string;
  title: string;
  excerpt: string;
  image: string;
  author: string;
  date: string;
  category: string;
}

const BlogSection: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const q = query(
          collection(db, 'blog_posts'),
          orderBy('date', 'desc')
        );
        const snapshot = await getDocs(q);
        if (snapshot.empty) {
          // Use fallback data if firestore is empty
          setPosts(fallbackPosts);
        } else {
          const data = snapshot.docs.map(docSnap => ({ id: docSnap.id, ...docSnap.data() })) as Post[];
          setPosts(data);
        }
      } catch (error) {
        console.error('Error fetching blog posts:', error);
        setPosts(fallbackPosts); // Use fallback data on error
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  const fallbackPosts: Post[] = [
    {
      id: '1',
      title: "10 Hidden Gems in Sri Lanka That Most Tourists Miss",
      excerpt: "Discover secret beaches, ancient ruins, and local experiences off the beaten path",
      image: "https://images.unsplash.com/photo-1552055568-f6dcea098c4e?q=80&w=800",
      author: "Sarah Williams",
      date: "Jan 15, 2024",
      category: "Travel Tips"
    },
    {
      id: '2',
      title: "The Ultimate Guide to Sri Lankan Street Food",
      excerpt: "From kottu roti to hoppers, explore the flavors that define Sri Lankan cuisine",
      image: "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?q=80&w=800",
      author: "Michael Chen",
      date: "Jan 10, 2024",
      category: "Food & Culture"
    },
    {
      id: '3',
      title: "Best Time to Visit Each Region of Sri Lanka",
      excerpt: "Plan your perfect trip with our month-by-month weather and festival guide",
      image: "https://images.unsplash.com/photo-1570168007204-dfb528c6958f?q=80&w=800",
      author: "Emma Davis",
      date: "Jan 5, 2024",
      category: "Planning"
    }
  ];

  return (
    <section className="py-20 bg-gray-50">
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

        <div className="relative">
          <div className="overflow-hidden" ref={emblaRef}>
            <div className="flex">
              {(loading ? fallbackPosts : posts).map((post) => (
                <div className="flex-grow-0 flex-shrink-0 w-full md:w-1/2 lg:w-1/3 p-4" key={post.id}>
                  <motion.article
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="group cursor-pointer bg-white rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300 overflow-hidden"
                  >
                    <Link to={`/blog/${post.id}`}>
                      <div className="relative h-56 overflow-hidden">
                        <LazyLoadImage
                          alt={post.title}
                          effect="blur"
                          src={post.image}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                        <div className="absolute top-4 left-4">
                          <span className="px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-semibold">
                            {post.category}
                          </span>
                        </div>
                      </div>
                      <div className="p-6">
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
                      </div>
                    </Link>
                  </motion.article>
                </div>
              ))}
            </div>
          </div>

          <div className="absolute top-1/2 -translate-y-1/2 flex justify-between w-full px-4">
            <button onClick={scrollPrev} className="bg-white/80 hover:bg-white rounded-full p-2 shadow-md">
              <ArrowLeft className="w-6 h-6 text-gray-800" />
            </button>
            <button onClick={scrollNext} className="bg-white/80 hover:bg-white rounded-full p-2 shadow-md">
              <ArrowRight className="w-6 h-6 text-gray-800" />
            </button>
          </div>
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
