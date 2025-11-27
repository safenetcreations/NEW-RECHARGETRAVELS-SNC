import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, User, Clock, Headphones } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { BlogPost } from '@/hooks/useBlog';

interface BlogCardProps {
  post: BlogPost;
  featured?: boolean;
}

export default function BlogCard({ post, featured = false }: BlogCardProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (featured) {
    return (
      <Card className="group hover:shadow-xl transition-all duration-300 overflow-hidden">
        <Link to={`/blog/${post.slug}`}>
          {post.featured_image && (
            <div className="aspect-[16/9] overflow-hidden">
              <img
                src={post.featured_image}
                alt={post.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
          )}
        </Link>
        
        <CardHeader className="p-6">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
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
            <h2 className="text-2xl font-bold group-hover:text-primary transition-colors line-clamp-2">
              {post.title}
            </h2>
          </Link>
          
          <div className="flex items-center gap-4 text-sm text-muted-foreground mt-2">
            <div className="flex items-center gap-1">
              <User className="h-4 w-4" />
              {typeof post.author === 'string' ? post.author : post.author?.name || 'Recharge Travels'}
            </div>
            {post.podcast_episode?.audio_url && (
              <Badge variant="secondary" className="flex items-center gap-1">
                <Headphones className="h-3 w-3" />
                Podcast Available
              </Badge>
            )}
          </div>
        </CardHeader>
        
        <CardContent className="px-6 pb-6">
          {post.excerpt && (
            <p className="text-muted-foreground mb-4 line-clamp-3">
              {post.excerpt}
            </p>
          )}
          
          <div className="flex items-center justify-between">
            {post.category && (
              <Badge variant="outline">
                {post.category.name}
              </Badge>
            )}
            
            <Link to={`/blog/${post.slug}`}>
              <Button variant="ghost" className="group/btn">
                Read More
                <span className="ml-1 group-hover/btn:translate-x-1 transition-transform">→</span>
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="group hover:shadow-lg transition-shadow h-full">
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
          <h3 className="text-lg font-semibold group-hover:text-primary transition-colors line-clamp-2">
            {post.title}
          </h3>
        </Link>
        
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <User className="h-4 w-4" />
            {typeof post.author === 'string' ? post.author : post.author?.name || 'Recharge Travels'}
          </div>
          {post.podcast_episode?.audio_url && (
            <Badge variant="secondary" className="flex items-center gap-1">
              <Headphones className="h-3 w-3" />
              Podcast
            </Badge>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="flex-1 flex flex-col">
        {post.excerpt && (
          <p className="text-muted-foreground mb-4 line-clamp-3 flex-1">
            {post.excerpt}
          </p>
        )}
        
        <div className="flex items-center justify-between mt-auto">
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
  );
}