import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useFeaturedPosts } from '@/hooks/useBlog';
import BlogCard from './BlogCard';

export default function FeaturedPosts() {
  const { data: posts, isLoading } = useFeaturedPosts();

  if (isLoading) {
    return (
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Latest Travel Stories</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Discover the latest insights, guides, and stories from Sri Lanka
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-card rounded-lg animate-pulse">
                <div className="aspect-video bg-muted rounded-t-lg" />
                <div className="p-6 space-y-3">
                  <div className="h-4 bg-muted rounded w-3/4" />
                  <div className="h-4 bg-muted rounded w-1/2" />
                  <div className="h-3 bg-muted rounded" />
                  <div className="h-3 bg-muted rounded w-2/3" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (!posts || posts.length === 0) {
    return null;
  }

  const featuredPost = posts[0];
  const otherPosts = posts.slice(1, 6);

  return (
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Latest Travel Stories</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Discover the latest insights, guides, and stories from Sri Lanka
          </p>
        </div>
        
        {/* Featured Post */}
        <div className="mb-12">
          <BlogCard post={featuredPost} featured />
        </div>
        
        {/* Other Posts */}
        {otherPosts.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {otherPosts.map((post) => (
              <BlogCard key={post.id} post={post} />
            ))}
          </div>
        )}
        
        {/* View All Button */}
        <div className="text-center">
          <Link to="/blog">
            <Button size="lg" variant="outline">
              View All Articles
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
