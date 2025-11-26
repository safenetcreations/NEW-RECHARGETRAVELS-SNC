import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Search, Edit, Trash2, Eye, Calendar } from 'lucide-react';

const PostsSection: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const mockPosts = [
    {
      id: '1',
      title: 'Top 10 Places to Visit in Sri Lanka',
      slug: 'top-10-places-sri-lanka',
      excerpt: 'Discover the most beautiful destinations across the pearl of the Indian Ocean.',
      status: 'published',
      published_at: '2024-01-15',
      tags: ['Travel', 'Sri Lanka', 'Tourism'],
      featured_image: '/api/placeholder/300/200'
    },
    {
      id: '2',
      title: 'Ceylon Tea: A Journey Through History',
      slug: 'ceylon-tea-history',
      excerpt: 'Learn about the rich heritage of Ceylon tea and its significance to Sri Lankan culture.',
      status: 'draft',
      published_at: null,
      tags: ['Culture', 'Tea', 'History'],
      featured_image: null
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published': return 'bg-green-100 text-green-800';
      case 'draft': return 'bg-yellow-100 text-yellow-800';
      case 'archived': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Blog Posts</h2>
        <Button className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Create Post
        </Button>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search posts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <div className="grid gap-4">
        {mockPosts.map((post) => (
          <Card key={post.id}>
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <CardTitle className="text-lg">{post.title}</CardTitle>
                    <Badge className={getStatusColor(post.status)}>
                      {post.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">/{post.slug}</p>
                  {post.excerpt && (
                    <p className="text-sm text-muted-foreground">{post.excerpt}</p>
                  )}
                </div>
                {post.featured_image && (
                  <img 
                    src={post.featured_image} 
                    alt={post.title}
                    className="w-16 h-16 object-cover rounded ml-4"
                  />
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {post.tags.length > 0 && (
                  <div className="flex items-center gap-2 flex-wrap">
                    {post.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    {post.published_at && (
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        Published {post.published_at}
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm">
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm" className="text-destructive">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default PostsSection;