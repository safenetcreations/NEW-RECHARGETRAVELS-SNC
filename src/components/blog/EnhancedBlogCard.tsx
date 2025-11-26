import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, User, Headphones, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { BlogPost } from '@/hooks/useBlog';

interface EnhancedBlogCardProps {
  post: BlogPost;
  featured?: boolean;
  index?: number;
}

const EnhancedBlogCard: React.FC<EnhancedBlogCardProps> = ({
  post,
  featured = false,
  index = 0
}) => {
  // Helper to get author name (handle both string and object formats)
  const getAuthorName = () => {
    if (typeof post.author === 'string') return post.author;
    if (typeof post.author === 'object' && post.author?.name) return post.author.name;
    return 'Recharge Travels';
  };

  // Helper to get featured image (handle both field names)
  const getFeaturedImage = () => post.featuredImage || post.featured_image;

  // Helper to get reading time (handle both field names)
  const getReadingTime = () => post.readingTime || post.reading_time;

  // Helper to get date (handle both field names and Firebase Timestamp)
  const getPublishedDate = () => {
    const date = post.publishedAt || post.published_at || post.createdAt || post.created_at;
    if (!date) return null;
    // Handle Firebase Timestamp
    if (date?.toDate) return date.toDate();
    return date;
  };

  // Helper to get content excerpt
  const getExcerpt = () => post.excerpt || post.content?.slice(0, 150);

  const formatDate = (dateValue: any) => {
    if (!dateValue) return '';
    const date = dateValue instanceof Date ? dateValue : new Date(dateValue);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      className={featured ? 'col-span-full lg:col-span-2' : ''}
    >
      <Card className={`group overflow-hidden border hover:shadow-xl transition-all duration-300 h-full ${
        featured ? 'lg:flex lg:flex-row' : ''
      }`}>
        {/* Image Container */}
        <Link
          to={`/blog/${post.slug}`}
          className={`block overflow-hidden ${
            featured ? 'lg:w-1/2' : ''
          }`}
        >
          <div className={`relative overflow-hidden ${
            featured ? 'aspect-[16/10] lg:aspect-auto lg:h-full' : 'aspect-video'
          }`}>
            {getFeaturedImage() ? (
              <img
                src={getFeaturedImage()}
                alt={post.title}
                loading="lazy"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                <span className="text-muted-foreground">No Image</span>
              </div>
            )}

            {/* Category Badge Overlay */}
            {post.category && (
              <Badge
                className="absolute top-4 left-4 bg-background/90 backdrop-blur-sm text-foreground border-0"
              >
                {post.category.name}
              </Badge>
            )}

            {/* Podcast Badge */}
            {post.podcast_episode?.audio_url && (
              <Badge
                variant="secondary"
                className="absolute top-4 right-4 flex items-center gap-1"
              >
                <Headphones className="h-3 w-3" />
                Podcast
              </Badge>
            )}

            {/* Gradient Overlay on Hover */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>
        </Link>

        {/* Content */}
        <div className={`flex flex-col ${featured ? 'lg:w-1/2' : ''}`}>
          <CardHeader className="pb-2">
            {/* Meta Info */}
            <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground mb-3">
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                {formatDate(getPublishedDate())}
              </div>
              {getReadingTime() && (
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  {getReadingTime()} min
                </div>
              )}
            </div>

            {/* Title */}
            <Link to={`/blog/${post.slug}`}>
              <h2 className={`font-bold text-foreground group-hover:text-primary transition-colors line-clamp-2 ${
                featured ? 'text-2xl lg:text-3xl' : 'text-xl'
              }`}>
                {post.title}
              </h2>
            </Link>
          </CardHeader>

          <CardContent className="flex-1 flex flex-col">
            {/* Excerpt */}
            <p className={`text-muted-foreground mb-4 flex-1 ${
              featured ? 'line-clamp-4' : 'line-clamp-2'
            }`}>
              {getExcerpt()}
            </p>

            {/* Footer */}
            <div className="flex items-center justify-between mt-auto pt-4 border-t">
              {/* Author */}
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <User className="h-4 w-4" />
                <span>{getAuthorName()}</span>
              </div>

              {/* Read More */}
              <Link to={`/blog/${post.slug}`}>
                <Button
                  variant="ghost"
                  size="sm"
                  className="group/btn text-primary hover:text-primary"
                >
                  Read More
                  <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
                </Button>
              </Link>
            </div>
          </CardContent>
        </div>
      </Card>
    </motion.div>
  );
};

export default EnhancedBlogCard;
