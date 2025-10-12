import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Clock, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useFeaturedPosts } from '@/hooks/useBlog';

export default function BlogHero() {
  const { data: posts, isLoading } = useFeaturedPosts();
  const featuredPost = posts?.[0];

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (isLoading || !featuredPost) {
    return (
      <section className="relative bg-gradient-to-r from-primary to-primary/80 text-primary-foreground py-20">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Sri Lanka Travel Blog
            </h1>
            <p className="text-xl md:text-2xl mb-8 opacity-90">
              Your ultimate guide to exploring the pearl of the Indian Ocean
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="relative min-h-[70vh] flex items-center">
      {/* Background Image */}
      <div className="absolute inset-0">
        {featuredPost.featured_image ? (
          <img
            src={featuredPost.featured_image}
            alt={featuredPost.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-r from-primary to-primary/80" />
        )}
        <div className="absolute inset-0 bg-black/50" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4">
        <div className="max-w-4xl">
          <div className="flex items-center gap-4 mb-4">
            <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
              Featured Article
            </Badge>
            {featuredPost.category && (
              <Badge variant="outline" className="bg-white/20 text-white border-white/30">
                {featuredPost.category.name}
              </Badge>
            )}
          </div>
          
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-4 leading-tight">
            {featuredPost.title}
          </h1>
          
          {featuredPost.excerpt && (
            <p className="text-lg md:text-xl text-white/90 mb-6 max-w-2xl">
              {featuredPost.excerpt}
            </p>
          )}
          
          <div className="flex items-center gap-6 text-white/80 mb-8">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4" />
              <span>{featuredPost.author}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span>{formatDate(featuredPost.published_at || featuredPost.created_at)}</span>
            </div>
            {featuredPost.reading_time && (
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span>{featuredPost.reading_time} min read</span>
              </div>
            )}
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <Link to={`/blog/${featuredPost.slug}`}>
              <Button size="lg" className="bg-white text-primary hover:bg-white/90">
                Read Full Article
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            
            <Link to="/blog">
              <Button 
                size="lg" 
                variant="outline" 
                className="border-white text-white hover:bg-white hover:text-primary"
              >
                Browse All Articles
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}