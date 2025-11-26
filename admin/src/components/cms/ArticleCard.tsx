
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { MapPin, Calendar, BookOpen } from 'lucide-react'
import { Article } from '@/lib/firebase-services'
import { Link } from 'react-router-dom'

interface ArticleCardProps {
  article: Article
}

const ArticleCard = ({ article }: ArticleCardProps) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const getContentTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      guide: 'bg-blue-100 text-blue-800',
      itinerary: 'bg-green-100 text-green-800',
      logistics: 'bg-yellow-100 text-yellow-800',
      festival: 'bg-purple-100 text-purple-800',
      blog: 'bg-gray-100 text-gray-800'
    }
    return colors[type] || 'bg-gray-100 text-gray-800'
  }

  return (
    <Link to={`/articles/${article.slug}`}>
      <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
        {article.og_image_url && (
          <div className="aspect-video overflow-hidden">
            <img 
              src={article.og_image_url} 
              alt={article.title}
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
            />
          </div>
        )}
        
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <h3 className="text-xl font-bold text-gray-900 line-clamp-2">
              {article.title}
            </h3>
            {article.content_type && (
              <Badge className={`ml-2 shrink-0 ${getContentTypeColor(article.content_type)}`}>
                {article.content_type}
              </Badge>
            )}
          </div>
          
          <div className="flex items-center justify-between text-sm text-gray-600">
            {article.region && (
              <div className="flex items-center">
                <MapPin className="h-4 w-4 mr-1" />
                {article.region.name}
              </div>
            )}
            <div className="flex items-center">
              <BookOpen className="h-4 w-4 mr-1" />
              Article
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="pt-0">
          {article.body_md && (
            <p className="text-gray-700 text-sm line-clamp-3 mb-3">
              {article.body_md.substring(0, 150)}...
            </p>
          )}
          
          <div className="flex items-center justify-between text-xs text-gray-500">
            <div className="flex items-center">
              <Calendar className="h-3 w-3 mr-1" />
              {formatDate(article.created_at)}
            </div>
            
            <div className="text-teal-600 font-medium">
              Read More
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}

export default ArticleCard
