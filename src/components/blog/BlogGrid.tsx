import React from 'react';
import { motion } from 'framer-motion';
import { Search } from 'lucide-react';
import EnhancedBlogCard from './EnhancedBlogCard';
import type { BlogPost } from '@/hooks/useBlog';

interface BlogGridProps {
  posts: BlogPost[];
  isLoading?: boolean;
  showFeatured?: boolean;
}

const BlogGrid: React.FC<BlogGridProps> = ({
  posts,
  isLoading = false,
  showFeatured = true
}) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="bg-card rounded-xl overflow-hidden border animate-pulse"
          >
            <div className="aspect-video bg-muted" />
            <div className="p-6">
              <div className="flex gap-4 mb-4">
                <div className="h-4 w-24 bg-muted rounded" />
                <div className="h-4 w-16 bg-muted rounded" />
              </div>
              <div className="h-6 w-3/4 bg-muted rounded mb-3" />
              <div className="h-4 w-full bg-muted rounded mb-2" />
              <div className="h-4 w-2/3 bg-muted rounded mb-4" />
              <div className="flex justify-between items-center pt-4 border-t">
                <div className="h-4 w-24 bg-muted rounded" />
                <div className="h-8 w-24 bg-muted rounded" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!posts || posts.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-16"
      >
        <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-muted flex items-center justify-center">
          <Search className="h-10 w-10 text-muted-foreground" />
        </div>
        <h3 className="text-xl font-semibold mb-2">No articles found</h3>
        <p className="text-muted-foreground max-w-md mx-auto">
          Try adjusting your search or browse different categories to find what you're looking for.
        </p>
      </motion.div>
    );
  }

  // Separate featured post (first post) from regular posts
  const featuredPost = showFeatured ? posts[0] : null;
  const regularPosts = showFeatured ? posts.slice(1) : posts;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
    >
      {/* Featured Post - Full Width on Large Screens */}
      {featuredPost && (
        <EnhancedBlogCard
          post={featuredPost}
          featured={true}
          index={0}
        />
      )}

      {/* Regular Posts Grid */}
      {regularPosts.map((post, index) => (
        <EnhancedBlogCard
          key={post.id}
          post={post}
          index={index + 1}
        />
      ))}
    </motion.div>
  );
};

export default BlogGrid;
