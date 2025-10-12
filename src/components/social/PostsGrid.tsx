
import React from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { SocialPost, SocialPlatform, UserSocialAccount } from '@/services/socialMediaService'
import { 
  RefreshCw, 
  ExternalLink,
  Heart,
  MessageCircle,
  Share,
  Star,
  Eye,
  Bookmark,
  MousePointer
} from 'lucide-react'

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

interface PostsGridProps {
  posts: SocialPost[]
  platforms: SocialPlatform[]
  connectedAccounts: UserSocialAccount[]
  loading: boolean
  syncing: boolean
  onSyncPosts: () => void
}

export const PostsGrid = ({ posts, platforms, connectedAccounts, loading, syncing, onSyncPosts }: PostsGridProps) => {
  const renderEngagementMetrics = (metrics: any) => {
    const items = []
    
    if (metrics.likes !== undefined) {
      items.push(
        <div key="likes" className="flex items-center gap-1">
          <Heart className="h-4 w-4" />
          {metrics.likes} likes
        </div>
      )
    }
    
    if (metrics.comments !== undefined) {
      items.push(
        <div key="comments" className="flex items-center gap-1">
          <MessageCircle className="h-4 w-4" />
          {metrics.comments} comments
        </div>
      )
    }
    
    if (metrics.shares !== undefined) {
      items.push(
        <div key="shares" className="flex items-center gap-1">
          <Share className="h-4 w-4" />
          {metrics.shares} shares
        </div>
      )
    }

    if (metrics.rating !== undefined) {
      items.push(
        <div key="rating" className="flex items-center gap-1">
          <Star className="h-4 w-4" />
          {metrics.rating}/5 rating
        </div>
      )
    }

    if (metrics.views !== undefined) {
      items.push(
        <div key="views" className="flex items-center gap-1">
          <Eye className="h-4 w-4" />
          {metrics.views} views
        </div>
      )
    }

    if (metrics.saves !== undefined) {
      items.push(
        <div key="saves" className="flex items-center gap-1">
          <Bookmark className="h-4 w-4" />
          {metrics.saves} saves
        </div>
      )
    }

    if (metrics.clicks !== undefined) {
      items.push(
        <div key="clicks" className="flex items-center gap-1">
          <MousePointer className="h-4 w-4" />
          {metrics.clicks} clicks
        </div>
      )
    }

    return items
  }

  if (loading) {
    return (
      <div className="text-center py-20">
        <RefreshCw className="h-16 w-16 mx-auto text-blue-600 animate-spin mb-4" />
        <p className="text-gray-600">Loading your social media posts...</p>
      </div>
    )
  }

  if (connectedAccounts.length === 0) {
    return (
      <div className="text-center py-20">
        <h3 className="text-2xl font-semibold text-gray-600 mb-3">No social media accounts connected</h3>
        <p className="text-gray-500">Connect your social media accounts above to start displaying your posts</p>
      </div>
    )
  }

  if (posts.length === 0) {
    return (
      <div className="text-center py-20">
        <h3 className="text-2xl font-semibold text-gray-600">No posts found</h3>
        <p className="text-gray-500 mb-4">Try syncing your posts or connecting more accounts</p>
        <Button onClick={onSyncPosts} disabled={syncing}>
          {syncing ? 'Syncing...' : 'Sync Posts Now'}
        </Button>
      </div>
    )
  }

  return (
    <>
      {/* Sync Button */}
      <div className="mb-6 flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Your Social Media Posts</h2>
        <Button onClick={onSyncPosts} disabled={syncing} className="bg-blue-600 hover:bg-blue-700">
          <RefreshCw className={`h-4 w-4 mr-2 ${syncing ? 'animate-spin' : ''}`} />
          {syncing ? 'Syncing...' : 'Sync Posts'}
        </Button>
      </div>

      {/* Posts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        {posts.map((post) => {
          const platform = platforms.find(p => p.id === post.platform_id)
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

                {Object.keys(post.engagement_metrics).length > 0 && (
                  <div className="flex flex-wrap gap-4 text-sm text-gray-600 pt-4 border-t border-gray-100">
                    {renderEngagementMetrics(post.engagement_metrics)}
                  </div>
                )}
              </CardContent>
            </Card>
          )
        })}
      </div>
    </>
  )
}
