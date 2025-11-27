import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Send, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { useBlogPosts, useBlogCategories } from '@/hooks/useBlog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import BlogHero from '@/components/blog/BlogHero';
import BlogCategories from '@/components/blog/BlogCategories';
import BlogGrid from '@/components/blog/BlogGrid';
import BlogSearch from '@/components/blog/BlogSearch';
import BlogSEO from '@/components/seo/BlogSEO';
import { newsletterService } from '@/services/newsletterService';

export default function Blog() {
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('latest');
  const [email, setEmail] = useState('');
  const [subscribeStatus, setSubscribeStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [subscribeMessage, setSubscribeMessage] = useState('');

  const { data: posts, isLoading: postsLoading } = useBlogPosts(selectedCategory || undefined);
  const { data: categories } = useBlogCategories();

  // Calculate post counts per category
  const postCounts = useMemo(() => {
    if (!posts) return {};
    const counts: Record<string, number> = {};
    posts.forEach(post => {
      if (post.category?.id) {
        counts[post.category.id] = (counts[post.category.id] || 0) + 1;
      }
    });
    return counts;
  }, [posts]);

  // Filter and sort posts
  const filteredPosts = useMemo(() => {
    if (!posts) return [];

    const search = searchQuery.toLowerCase();

    const getAuthorName = (author: (typeof posts)[number]['author']) => {
      if (!author) return '';
      if (typeof author === 'string') return author;
      return author.name || '';
    };

    let filtered = posts.filter(post => {
      const titleMatch = post.title.toLowerCase().includes(search);
      const excerptMatch = post.excerpt?.toLowerCase().includes(search) ?? false;
      const authorName = getAuthorName(post.author).toLowerCase();
      const authorMatch = authorName.includes(search);

      return titleMatch || excerptMatch || authorMatch;
    });

    // Sort posts
    switch (sortBy) {
      case 'oldest':
        filtered = [...filtered].sort((a, b) =>
          new Date(a.published_at || a.created_at).getTime() -
          new Date(b.published_at || b.created_at).getTime()
        );
        break;
      case 'popular':
        // For now, keep default order - can be enhanced with view counts
        break;
      case 'reading_time':
        filtered = [...filtered].sort((a, b) =>
          (a.reading_time || 5) - (b.reading_time || 5)
        );
        break;
      default: // 'latest'
        filtered = [...filtered].sort((a, b) =>
          new Date(b.published_at || b.created_at).getTime() -
          new Date(a.published_at || a.created_at).getTime()
        );
    }

    return filtered;
  }, [posts, searchQuery, sortBy]);

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) return;

    setSubscribeStatus('loading');
    setSubscribeMessage('');

    try {
      const result = await newsletterService.subscribe({
        email,
        source: 'blog'
      });

      setSubscribeStatus(result.success ? 'success' : 'error');
      setSubscribeMessage(result.message);

      if (result.success) {
        setEmail('');
        setTimeout(() => {
          setSubscribeStatus('idle');
          setSubscribeMessage('');
        }, 5000);
      }
    } catch (error) {
      setSubscribeStatus('error');
      setSubscribeMessage('Something went wrong. Please try again.');
    }
  };

  return (
    <>
      <BlogSEO />

      <div className="min-h-screen bg-background">
        {/* Hero Section - Latest Blog Post */}
        <BlogHero />

        {/* Categories Filter */}
        {categories && categories.length > 0 && (
          <BlogCategories
            categories={categories}
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
            postCounts={postCounts}
          />
        )}

        {/* Main Content */}
        <section id="posts" className="py-12 md:py-16">
          <div className="container mx-auto px-4">
            {/* Search and Sort */}
            <div className="mb-10">
              <BlogSearch
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                sortBy={sortBy}
                onSortChange={setSortBy}
              />
            </div>

            {/* Blog Posts Grid */}
            <BlogGrid
              posts={filteredPosts}
              isLoading={postsLoading}
              showFeatured={!searchQuery && !selectedCategory}
            />

            {/* Load More Button */}
            {filteredPosts.length >= 9 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center mt-12"
              >
                <Button variant="outline" size="lg" className="px-8">
                  Load More Articles
                </Button>
              </motion.div>
            )}
          </div>
        </section>

        {/* Newsletter Section */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="py-16 md:py-24 bg-gradient-to-br from-primary/5 via-background to-secondary/5"
        >
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto text-center">
              <motion.div
                initial={{ scale: 0.9 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-primary/10 flex items-center justify-center"
              >
                <Mail className="w-8 h-8 text-primary" />
              </motion.div>

              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Stay Updated with Our Travel Insights
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                Subscribe to get the latest travel guides, destination tips, and exclusive offers delivered to your inbox.
              </p>

              <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                <Input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={subscribeStatus === 'loading'}
                  className="flex-1 py-6"
                />
                <Button
                  type="submit"
                  size="lg"
                  className="group min-w-[140px]"
                  disabled={subscribeStatus === 'loading'}
                >
                  {subscribeStatus === 'loading' ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Subscribing...
                    </>
                  ) : subscribeStatus === 'success' ? (
                    <>
                      <CheckCircle className="mr-2 h-4 w-4" />
                      Subscribed!
                    </>
                  ) : (
                    <>
                      Subscribe
                      <Send className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </>
                  )}
                </Button>
              </form>

              <AnimatePresence>
                {subscribeMessage && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className={`flex items-center justify-center gap-2 mt-4 text-sm ${
                      subscribeStatus === 'success' ? 'text-green-600' : 'text-red-500'
                    }`}
                  >
                    {subscribeStatus === 'success' ? (
                      <CheckCircle className="w-4 h-4" />
                    ) : (
                      <AlertCircle className="w-4 h-4" />
                    )}
                    {subscribeMessage}
                  </motion.div>
                )}
              </AnimatePresence>

              <p className="text-sm text-muted-foreground mt-4">
                Get notified when we publish new travel guides. No spam, unsubscribe at any time.
              </p>
            </div>
          </div>
        </motion.section>
      </div>
    </>
  );
}
