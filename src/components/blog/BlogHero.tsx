import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Clock, User, Calendar, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useFeaturedPosts } from '@/hooks/useBlog';

export default function BlogHero() {
  const { data: posts, isLoading } = useFeaturedPosts();
  const featuredPost = posts?.[0];

  // Helper functions to handle both field name formats
  const getFeaturedImage = () => featuredPost?.featuredImage || featuredPost?.featured_image;

  const getAuthorName = () => {
    if (!featuredPost?.author) return 'Recharge Travels';
    if (typeof featuredPost.author === 'string') return featuredPost.author;
    if (typeof featuredPost.author === 'object' && featuredPost.author?.name) return featuredPost.author.name;
    return 'Recharge Travels';
  };

  const getReadingTime = () => featuredPost?.readingTime || featuredPost?.reading_time;

  const getPublishedDate = () => {
    const date = featuredPost?.publishedAt || featuredPost?.published_at || featuredPost?.createdAt || featuredPost?.created_at;
    if (!date) return null;
    // Handle Firebase Timestamp
    if (date?.toDate) return date.toDate();
    return date;
  };

  const formatDate = (dateValue: any) => {
    if (!dateValue) return '';
    const date = dateValue instanceof Date ? dateValue : new Date(dateValue);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (isLoading) {
    return (
      <section className="relative min-h-[70vh] flex items-center bg-gradient-to-br from-primary/20 via-background to-secondary/20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl animate-pulse">
            <div className="h-8 w-32 bg-muted rounded-full mb-6" />
            <div className="h-12 w-3/4 bg-muted rounded-lg mb-4" />
            <div className="h-8 w-1/2 bg-muted rounded-lg mb-6" />
            <div className="h-20 w-full bg-muted rounded-lg mb-8" />
            <div className="h-12 w-40 bg-muted rounded-lg" />
          </div>
        </div>
      </section>
    );
  }

  if (!featuredPost) {
    return (
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="relative bg-gradient-to-br from-primary via-primary/90 to-primary/80 text-primary-foreground py-24 overflow-hidden"
      >
        {/* Decorative Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-1/2 -right-1/4 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
          <div className="absolute -bottom-1/2 -left-1/4 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
        </div>

        <div className="relative container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-center max-w-4xl mx-auto"
          >
            <Badge className="mb-6 bg-white/20 text-white border-white/30">
              <Sparkles className="w-4 h-4 mr-2" />
              Travel Blog
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              Sri Lanka Travel Blog
            </h1>
            <p className="text-xl md:text-2xl mb-8 opacity-90 max-w-2xl mx-auto">
              Your ultimate guide to exploring the pearl of the Indian Ocean. Discover destinations, wildlife, culture, and adventure.
            </p>
            <Link to="/blog#posts">
              <Button size="lg" variant="secondary" className="group">
                Explore Articles
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </motion.section>
    );
  }

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="relative min-h-[75vh] flex items-center overflow-hidden"
    >
      {/* Background Image */}
      <div className="absolute inset-0">
        {getFeaturedImage() ? (
          <motion.img
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            src={getFeaturedImage()}
            alt={featuredPost.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-primary via-primary/90 to-primary/80" />
        )}
        {/* Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />
      </div>

      {/* Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-primary/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 left-1/4 w-48 h-48 bg-secondary/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-20">
        <div className="max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="flex flex-wrap items-center gap-3 mb-6"
          >
            <Badge className="bg-primary/90 text-primary-foreground border-0 shadow-lg">
              <Sparkles className="w-3 h-3 mr-1" />
              Latest Post
            </Badge>
            {featuredPost.category && (
              <Badge variant="outline" className="bg-white/10 text-white border-white/30 backdrop-blur-sm">
                {featuredPost.category.name}
              </Badge>
            )}
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight"
          >
            {featuredPost.title}
          </motion.h1>

          {featuredPost.excerpt && (
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="text-lg md:text-xl text-white/90 mb-8 max-w-2xl line-clamp-3"
            >
              {featuredPost.excerpt}
            </motion.p>
          )}

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="flex flex-wrap items-center gap-6 text-white/80 mb-8"
          >
            <div className="flex items-center gap-2">
              <User className="h-5 w-5" />
              <span className="font-medium">{getAuthorName()}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              <span>{formatDate(getPublishedDate())}</span>
            </div>
            {getReadingTime() && (
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                <span>{getReadingTime()} min read</span>
              </div>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="flex flex-col sm:flex-row gap-4"
          >
            <Link to={`/blog/${featuredPost.slug}`}>
              <Button size="lg" className="group bg-white text-primary hover:bg-white/90 shadow-xl">
                Read Full Article
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>

            <Link to="/blog#posts">
              <Button
                size="lg"
                variant="outline"
                className="border-white/50 text-white hover:bg-white/20 backdrop-blur-sm"
              >
                Browse All Articles
              </Button>
            </Link>
          </motion.div>
        </div>
      </div>

      {/* Bottom Gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
    </motion.section>
  );
}
