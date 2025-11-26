
import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { SocialPost, SocialPlatform } from '@/services/socialMediaService'
import { 
  ExternalLink,
  Heart,
  MessageCircle,
  Share,
  Star,
  Eye,
  Bookmark,
  MousePointer,
  ThumbsUp
} from 'lucide-react'
import { toast } from 'sonner'

const platformIcons = {
  facebook: 'f',
  instagram: '📷',
  twitter: '𝕏',
  youtube: '▶',
  tripadvisor: '🦉',
  google: 'G',
  tiktok: '♪',
  linkedin: 'in',
  pinterest: 'P'
}

const getPlatformColorClass = (platform: string) => {
  const colors: Record<string, string> = {
    facebook: 'bg-blue-600',
    instagram: 'bg-purple-600',
    twitter: 'bg-blue-400',
    youtube: 'bg-red-600',
    tripadvisor: 'bg-green-600',
    google: 'bg-blue-500',
    tiktok: 'bg-black',
    linkedin: 'bg-blue-700',
    pinterest: 'bg-red-500'
  }
  return colors[platform] || 'bg-gray-500'
}

interface PublicPostsGridProps {
  posts: SocialPost[]
  platforms: SocialPlatform[]
  loading: boolean
  onFilterPlatform: (platform: string) => void
}

export const PublicPostsGrid = ({ posts, platforms, loading, onFilterPlatform }: PublicPostsGridProps) => {
  const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set())
  const [sharedPosts, setSharedPosts] = useState<Set<string>>(new Set())

  const handleLike = (postId: string) => {
    setLikedPosts(prev => {
      const newLiked = new Set(prev)
      if (newLiked.has(postId)) {
        newLiked.delete(postId)
        toast.success('Like removed')
      } else {
        newLiked.add(postId)
        toast.success('Post liked!')
      }
      return newLiked
    })
  }

  const handleShare = (post: SocialPost) => {
    if (navigator.share) {
      navigator.share({
        title: `Recharge Travels - ${post.content.substring(0, 50)}...`,
        text: post.content,
        url: post.post_url || window.location.href
      })
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(post.post_url || window.location.href)
      toast.success('Link copied to clipboard!')
    }
    
    setSharedPosts(prev => new Set([...prev, post.id]))
  }

  const renderEngagementMetrics = (metrics: any) => {
    const items = []
    
    if (metrics.likes !== undefined) {
      items.push(
        <div key="likes" className="flex items-center gap-1 text-gray-600">
          <Heart className="h-4 w-4" />
          {metrics.likes}
        </div>
      )
    }
    
    if (metrics.comments !== undefined) {
      items.push(
        <div key="comments" className="flex items-center gap-1 text-gray-600">
          <MessageCircle className="h-4 w-4" />
          {metrics.comments}
        </div>
      )
    }
    
    if (metrics.shares !== undefined) {
      items.push(
        <div key="shares" className="flex items-center gap-1 text-gray-600">
          <Share className="h-4 w-4" />
          {metrics.shares}
        </div>
      )
    }

    if (metrics.views !== undefined) {
      items.push(
        <div key="views" className="flex items-center gap-1 text-gray-600">
          <Eye className="h-4 w-4" />
          {metrics.views}
        </div>
      )
    }

    return items
  }

  if (loading) {
    return (
      <div className="text-center py-20">
        <div className="inline-block animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mb-4"></div>
        <p className="text-gray-600">Loading latest posts...</p>
      </div>
    )
  }

  if (posts.length === 0) {
    return (
      <div className="text-center py-20">
        <h3 className="text-2xl font-semibold text-gray-600 mb-3">No posts available</h3>
        <p className="text-gray-500">Check back soon for our latest updates!</p>
      </div>
    )
  }

  return (
    <>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Latest from #RechargeLife</h2>
        <p className="text-gray-600">Follow our adventures across social media</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        {posts.map((post) => {
          const platform = platforms.find(p => p.id === post.platform_id)
          const isLiked = likedPosts.has(post.id)
          const isShared = sharedPosts.has(post.id)
          
          return (
            <Card key={post.id} className="overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold ${getPlatformColorClass(platform?.name || '')}`}>
                    {platformIcons[platform?.name as keyof typeof platformIcons] || '📱'}
                  </div>
                  <div className="flex-1">
                    <div className="font-bold text-gray-900">{post.author_name}</div>
                    <div className="text-sm text-gray-600">{new Date(post.posted_at).toLocaleDateString()}</div>
                  </div>
                  {post.post_url && (
                    <Button variant="ghost" size="sm" asChild>
                      <a href={post.post_url} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    </Button>
                  )}
                </div>
              </CardHeader>
              
              <CardContent>
                <p className="text-gray-700 leading-relaxed mb-4">{post.content}</p>
                
                {post.media_urls.length > 0 && (
                  <div className="mb-4">
                    <img 
                      src={post.thumbnail_url || post.media_urls[0]} 
                      alt="Post media"
                      className="w-full h-64 object-cover rounded-lg"
                    />
                  </div>
                )}

                {post.hashtags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {post.hashtags.map(tag => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        #{tag}
                      </Badge>
                    ))}
                  </div>
                )}

                {/* Engagement Metrics */}
                {Object.keys(post.engagement_metrics).length > 0 && (
                  <div className="flex flex-wrap gap-4 text-sm mb-4 pt-4 border-t border-gray-100">
                    {renderEngagementMetrics(post.engagement_metrics)}
                  </div>
                )}

                {/* Public Interaction Buttons */}
                <div className="flex gap-2 pt-4 border-t border-gray-100">
                  <Button
                    variant={isLiked ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleLike(post.id)}
                    className={isLiked ? "bg-red-500 hover:bg-red-600" : ""}
                  >
                    <Heart className={`h-4 w-4 mr-2 ${isLiked ? 'fill-current' : ''}`} />
                    {isLiked ? 'Liked' : 'Like'}
                  </Button>
                  
                  <Button
                    variant={isShared ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleShare(post)}
                    className={isShared ? "bg-blue-500 hover:bg-blue-600" : ""}
                  >
                    <Share className="h-4 w-4 mr-2" />
                    Share
                  </Button>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </>
  )
}
