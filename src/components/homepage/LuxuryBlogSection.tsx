import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
  Calendar,
  User,
  ArrowRight,
  ArrowLeft,
  Clock,
  Sparkles,
  BookOpen,
  TrendingUp
} from 'lucide-react';
import { Link } from 'react-router-dom';
import useEmblaCarousel from 'embla-carousel-react';
import { collection, query, getDocs, orderBy, limit } from 'firebase/firestore';
import { db } from '@/lib/firebase';

interface BlogPost {
  id: string;
  title: string;
  slug?: string;
  excerpt?: string;
  content?: string;
  image?: string;
  featuredImage?: string;
  featured_image?: string;
  author?: string | { name: string };
  readingTime?: number;
  reading_time?: number;
  publishedAt?: any;
  date?: string;
  category?: string | { name: string };
}

// Always show these posts
const DEFAULT_POSTS: BlogPost[] = [
  {
    id: '1',
    title: "10 Hidden Gems in Sri Lanka That Most Tourists Miss",
    slug: "hidden-gems-sri-lanka",
    excerpt: "Discover secret beaches, ancient ruins, and local experiences off the beaten path that will make your journey unforgettable.",
    image: "https://images.unsplash.com/photo-1552055568-f6dcea098c4e?q=80&w=800",
    author: "Sarah Williams",
    readingTime: 8,
    date: "Jan 15, 2024",
    category: "Travel Tips"
  },
  {
    id: '2',
    title: "The Ultimate Guide to Sri Lankan Street Food",
    slug: "sri-lankan-street-food-guide",
    excerpt: "From kottu roti to hoppers, explore the flavors that define Sri Lankan cuisine and where to find the best local delicacies.",
    image: "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?q=80&w=800",
    author: "Michael Chen",
    readingTime: 12,
    date: "Jan 10, 2024",
    category: "Food & Culture"
  },
  {
    id: '3',
    title: "Best Time to Visit Each Region of Sri Lanka",
    slug: "best-time-visit-sri-lanka",
    excerpt: "Plan your perfect trip with our month-by-month weather and festival guide for every region of this beautiful island.",
    image: "https://images.unsplash.com/photo-1570168007204-dfb528c6958f?q=80&w=800",
    author: "Emma Davis",
    readingTime: 10,
    date: "Jan 5, 2024",
    category: "Planning"
  }
];

const LuxuryBlogSection: React.FC = () => {
  const [posts, setPosts] = useState<BlogPost[]>(DEFAULT_POSTS);
  const [activeIndex, setActiveIndex] = useState(0);

  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: 'start' });

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => setActiveIndex(emblaApi.selectedScrollSnap());
    emblaApi.on('select', onSelect);
    return () => { emblaApi.off('select', onSelect); };
  }, [emblaApi]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        // Try blogs collection
        const q = query(collection(db, 'blogs'), orderBy('publishedAt', 'desc'), limit(6));
        const snapshot = await getDocs(q);
        if (!snapshot.empty) {
          const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as BlogPost[];
          setPosts(data);
          return;
        }
        // Try blog_posts collection
        const q2 = query(collection(db, 'blog_posts'), orderBy('date', 'desc'), limit(6));
        const snapshot2 = await getDocs(q2);
        if (!snapshot2.empty) {
          const data = snapshot2.docs.map(doc => ({ id: doc.id, ...doc.data() })) as BlogPost[];
          setPosts(data);
        }
      } catch (error) {
        console.log('Using default posts');
      }
    };
    fetchPosts();
  }, []);

  // Helper functions
  const getImage = (post: BlogPost) =>
    post.image || post.featuredImage || post.featured_image || 'https://images.unsplash.com/photo-1552055568-f6dcea098c4e?q=80&w=800';

  const getAuthor = (author: any) => {
    if (!author) return 'Recharge Travels';
    if (typeof author === 'string') return author;
    return author.name || 'Recharge Travels';
  };

  const getCategory = (cat: any) => {
    if (!cat) return 'Travel';
    if (typeof cat === 'string') return cat;
    return cat.name || 'Travel';
  };

  const getDate = (post: BlogPost) => {
    if (post.date) return post.date;
    if (post.publishedAt) {
      try {
        const d = post.publishedAt.toDate ? post.publishedAt.toDate() : new Date(post.publishedAt);
        return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
      } catch { return 'Recently'; }
    }
    return 'Recently';
  };

  const featuredPost = posts[0];
  const otherPosts = posts.slice(1);

  return (
    <section className="relative py-20 bg-slate-900">
      {/* Background decorations */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-amber-500/50 to-transparent" />
      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-amber-500/50 to-transparent" />
      <div className="absolute top-20 left-10 w-72 h-72 bg-amber-500/5 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-teal-500/5 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/20 rounded-full px-4 py-2 mb-4">
            <BookOpen className="w-4 h-4 text-amber-400" />
            <span className="text-amber-300 text-sm font-medium uppercase tracking-wider">Travel Insights</span>
            <Sparkles className="w-4 h-4 text-amber-400" />
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
            Stories from <span className="text-amber-400">Paradise</span>
          </h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            Expert guides, insider tips, and captivating tales to inspire your Sri Lankan adventure
          </p>
        </motion.div>

        {/* Featured Post */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <Link to={`/blog/${featuredPost?.slug || featuredPost?.id}`}>
            <div className="group rounded-2xl overflow-hidden bg-slate-800/50 border border-slate-700 hover:border-amber-500/50 transition-all">
              <div className="grid md:grid-cols-2">
                {/* Image */}
                <div className="relative h-64 md:h-80 overflow-hidden">
                  <img
                    src={getImage(featuredPost)}
                    alt={featuredPost?.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-amber-500 text-slate-900 rounded-full text-sm font-bold">
                      <TrendingUp className="w-4 h-4" />
                      Featured
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 md:p-8 flex flex-col justify-center">
                  <span className="text-amber-400 text-sm font-medium uppercase tracking-wider mb-2">
                    {getCategory(featuredPost?.category)}
                  </span>
                  <h3 className="text-xl md:text-2xl font-bold text-white mb-3 group-hover:text-amber-400 transition-colors">
                    {featuredPost?.title}
                  </h3>
                  <p className="text-slate-400 mb-4 line-clamp-2">
                    {featuredPost?.excerpt || 'Discover more about this amazing destination...'}
                  </p>
                  <div className="flex items-center gap-4 text-sm text-slate-500 mb-4">
                    <span className="flex items-center gap-1">
                      <User className="w-4 h-4" />
                      {getAuthor(featuredPost?.author)}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {getDate(featuredPost)}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {featuredPost?.readingTime || featuredPost?.reading_time || 5} min
                    </span>
                  </div>
                  <span className="text-amber-400 font-medium flex items-center gap-2 group-hover:gap-3 transition-all">
                    Read Article <ArrowRight className="w-4 h-4" />
                  </span>
                </div>
              </div>
            </div>
          </Link>
        </motion.div>

        {/* Other Posts Carousel */}
        {otherPosts.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="overflow-hidden" ref={emblaRef}>
              <div className="flex -ml-4">
                {otherPosts.map((post) => (
                  <div key={post.id} className="flex-shrink-0 w-full md:w-1/2 pl-4">
                    <Link to={`/blog/${post.slug || post.id}`}>
                      <div className="group rounded-xl overflow-hidden bg-slate-800/50 border border-slate-700 hover:border-amber-500/50 transition-all h-full">
                        <div className="relative h-48 overflow-hidden">
                          <img
                            src={getImage(post)}
                            alt={post.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                          <div className="absolute top-3 left-3">
                            <span className="px-2 py-1 bg-slate-900/80 rounded text-white text-xs font-medium">
                              {getCategory(post.category)}
                            </span>
                          </div>
                          <div className="absolute top-3 right-3">
                            <span className="px-2 py-1 bg-slate-900/80 rounded text-white text-xs flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {post.readingTime || post.reading_time || 5} min
                            </span>
                          </div>
                        </div>
                        <div className="p-5">
                          <h3 className="text-lg font-bold text-white mb-2 group-hover:text-amber-400 transition-colors line-clamp-2">
                            {post.title}
                          </h3>
                          <p className="text-slate-400 text-sm mb-3 line-clamp-2">
                            {post.excerpt || 'Discover more...'}
                          </p>
                          <div className="flex items-center justify-between text-xs text-slate-500">
                            <span>{getAuthor(post.author)}</span>
                            <span>{getDate(post)}</span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </div>
                ))}
              </div>
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-center gap-4 mt-8">
              <button
                onClick={scrollPrev}
                className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-white hover:bg-amber-500 hover:border-amber-500 transition-all"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div className="flex gap-2">
                {otherPosts.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => emblaApi?.scrollTo(i)}
                    className={`w-2 h-2 rounded-full transition-all ${i === activeIndex ? 'w-6 bg-amber-500' : 'bg-slate-600'}`}
                  />
                ))}
              </div>
              <button
                onClick={scrollNext}
                className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-white hover:bg-amber-500 hover:border-amber-500 transition-all"
              >
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </motion.div>
        )}

        {/* View All Button */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <Link to="/blog">
            <button className="inline-flex items-center gap-2 px-6 py-3 bg-amber-500 text-slate-900 font-bold rounded-full hover:bg-amber-400 transition-all">
              <BookOpen className="w-5 h-5" />
              Explore All Articles
              <ArrowRight className="w-5 h-5" />
            </button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default LuxuryBlogSection;
