import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Search, Calendar, User, Clock, Headphones } from 'lucide-react';
import { useBlogPosts, useBlogCategories } from '@/hooks/useBlog';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';

export default function Blog() {
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');
  
  const { data: posts, isLoading: postsLoading } = useBlogPosts(selectedCategory || undefined);
  const { data: categories } = useBlogCategories();

  const filteredPosts = posts?.filter(post => 
    post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    post.excerpt?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <>
      <Helmet>
        <title>Sri Lanka Travel Blog - Recharge Travels</title>
        <meta name="description" content="Discover Sri Lanka through our travel blog featuring destinations, wildlife, culture, food, and adventure guides." />
        <meta property="og:title" content="Sri Lanka Travel Blog - Recharge Travels" />
        <meta property="og:description" content="Expert travel guides and insights for your Sri Lankan adventure" />
      </Helmet>

      <div className="min-h-screen bg-background">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-r from-primary to-primary/80 text-primary-foreground py-20">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-4xl mx-auto">
              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                Sri Lanka Travel Blog
              </h1>
              <p className="text-xl md:text-2xl mb-8 opacity-90">
                Your ultimate guide to exploring the pearl of the Indian Ocean
              </p>
              
              {/* Search Bar */}
              <div className="relative max-w-2xl mx-auto">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
                <Input
                  type="text"
                  placeholder="Search travel articles, destinations, tips..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 py-4 text-lg bg-background text-foreground"
                />
              </div>
            </div>
          </div>
        </section>

        <div className="container mx-auto px-4 py-12">
          <div className="flex flex-col lg:flex-row gap-8">
            
            {/* Sidebar */}
            <aside className="lg:w-80">
              <div className="sticky top-8 space-y-6">
                
                {/* Categories */}
                <div className="bg-card rounded-lg p-6 border">
                  <h3 className="text-lg font-semibold mb-4">Categories</h3>
                  <div className="space-y-2">
                    <Button
                      variant={selectedCategory === '' ? 'default' : 'ghost'}
                      className="w-full justify-start"
                      onClick={() => setSelectedCategory('')}
                    >
                      All Categories
                    </Button>
                    {categories?.map((category) => (
                      <Button
                        key={category.id}
                        variant={selectedCategory === category.id ? 'default' : 'ghost'}
                        className="w-full justify-start"
                        onClick={() => setSelectedCategory(category.id)}
                      >
                        {category.name}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Newsletter Signup */}
                <div className="bg-gradient-to-br from-primary/10 to-secondary/10 rounded-lg p-6 border">
                  <h3 className="text-lg font-semibold mb-2">Stay Updated</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Get the latest travel guides and tips delivered to your inbox.
                  </p>
                  <div className="space-y-3">
                    <Input placeholder="Enter your email for travel updates" />
                    <Button className="w-full">Subscribe</Button>
                  </div>
                </div>
              </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1">
              {postsLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <Card key={i} className="animate-pulse">
                      <div className="aspect-video bg-muted rounded-t-lg" />
                      <CardContent className="p-6">
                        <div className="h-4 bg-muted rounded mb-2" />
                        <div className="h-4 bg-muted rounded mb-4 w-3/4" />
                        <div className="h-3 bg-muted rounded mb-2" />
                        <div className="h-3 bg-muted rounded w-1/2" />
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : filteredPosts && filteredPosts.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {filteredPosts.map((post) => (
                    <Card key={post.id} className="group hover:shadow-lg transition-shadow">
                      <Link to={`/blog/${post.slug}`}>
                        {post.featured_image && (
                          <div className="aspect-video overflow-hidden rounded-t-lg">
                            <img
                              src={post.featured_image}
                              alt={post.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          </div>
                        )}
                      </Link>
                      
                      <CardHeader>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                          <Calendar className="h-4 w-4" />
                          {formatDate(post.published_at || post.created_at)}
                          {post.reading_time && (
                            <>
                              <Clock className="h-4 w-4 ml-2" />
                              {post.reading_time} min read
                            </>
                          )}
                        </div>
                        
                        <Link to={`/blog/${post.slug}`}>
                          <h2 className="text-xl font-semibold group-hover:text-primary transition-colors">
                            {post.title}
                          </h2>
                        </Link>
                        
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <User className="h-4 w-4" />
                            {post.author}
                          </div>
                          {post.podcast_episode?.audio_url && (
                            <Badge variant="secondary" className="flex items-center gap-1">
                              <Headphones className="h-3 w-3" />
                              Podcast
                            </Badge>
                          )}
                        </div>
                      </CardHeader>
                      
                      <CardContent>
                        <p className="text-muted-foreground mb-4 line-clamp-3">
                          {post.excerpt}
                        </p>
                        
                        <div className="flex items-center justify-between">
                          {post.category && (
                            <Badge variant="outline">
                              {post.category.name}
                            </Badge>
                          )}
                          
                          <Link to={`/blog/${post.slug}`}>
                            <Button variant="ghost" size="sm">
                              Read More →
                            </Button>
                          </Link>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No articles found</h3>
                  <p className="text-muted-foreground">
                    Try adjusting your search or browse different categories.
                  </p>
                </div>
              )}
            </main>
          </div>
        </div>
      </div>
    </>
  );
}