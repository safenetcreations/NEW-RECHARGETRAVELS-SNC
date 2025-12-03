import React, { useState, useEffect } from 'react'
import { collection, query, orderBy, limit, getDocs, Timestamp } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { Link } from 'react-router-dom'
import { 
  Newspaper, 
  ExternalLink, 
  Clock, 
  Tag, 
  TrendingUp,
  ChevronRight,
  Loader2,
  Globe,
  Building2,
  Plane
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { formatDistanceToNow } from 'date-fns'

interface NewsArticle {
  id: string
  title: string
  summary: string
  source: string
  sourceId: string
  url: string
  imageUrl: string | null
  publishedAt: Timestamp
  fetchedAt: Timestamp
  category: string
  tags: string[]
  relevanceScore: number
  isActive?: boolean
}

export const TourismNewsSection = () => {
  const [news, setNews] = useState<NewsArticle[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const newsRef = collection(db, 'tourismNews')
        const q = query(
          newsRef,
          orderBy('publishedAt', 'desc'),
          limit(6)
        )
        
        const snapshot = await getDocs(q)
        console.log('Tourism news snapshot size:', snapshot.size)
        
        const articles: NewsArticle[] = snapshot.docs
          .map(doc => ({ id: doc.id, ...doc.data() } as NewsArticle))
          .filter(article => article.isActive !== false)
        
        setNews(articles)
      } catch (err) {
        console.error('Error fetching news:', err)
        setError('Unable to load news')
      } finally {
        setLoading(false)
      }
    }

    fetchNews()
  }, [])

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'government': return <Building2 className="w-4 h-4" />
      case 'business': return <TrendingUp className="w-4 h-4" />
      case 'travel': return <Plane className="w-4 h-4" />
      default: return <Globe className="w-4 h-4" />
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'government': return 'from-blue-600 to-blue-500'
      case 'business': return 'from-emerald-600 to-emerald-500'
      case 'travel': return 'from-orange-600 to-orange-500'
      default: return 'from-purple-600 to-purple-500'
    }
  }

  if (loading) {
    return (
      <div className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
        </div>
      </div>
    )
  }

  // Show section even if empty - with placeholder

  return (
    <div className="relative py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-slate-950 to-slate-900">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 rounded-full border border-orange-500/40 bg-orange-500/10 px-4 py-2 mb-6 backdrop-blur-xl">
            <Newspaper className="h-4 w-4 text-orange-400" />
            <span className="text-xs font-bold uppercase tracking-widest text-orange-200">Tourism News</span>
          </div>
          
          <h2 className="text-4xl sm:text-5xl font-black tracking-tight mb-4">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
              Latest Tourism Updates
            </span>
          </h2>
          
          <p className="text-lg text-slate-300 max-w-2xl mx-auto">
            Stay informed with the latest news from Sri Lanka's tourism industry, government announcements, and travel updates
          </p>
        </div>

        {/* News Grid */}
        {news.length === 0 ? (
          <div className="text-center py-16 mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-slate-800 rounded-full mb-6">
              <Newspaper className="w-10 h-10 text-slate-500" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Coming Soon</h3>
            <p className="text-slate-400 max-w-md mx-auto mb-6">
              We're setting up our news aggregator to bring you the latest tourism updates from Sri Lanka.
              News will be fetched automatically twice daily.
            </p>
            <div className="flex items-center justify-center gap-4 text-sm text-slate-500">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>9:00 AM</span>
              </div>
              <span>&</span>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>6:00 PM IST</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {news.map((article, index) => (
            <a
              key={article.id}
              href={article.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative overflow-hidden rounded-2xl bg-slate-900/60 backdrop-blur-xl border border-slate-700/70 transition-all duration-500 hover:scale-[1.02] hover:border-slate-500 hover:shadow-2xl hover:shadow-orange-500/10"
            >
              {/* Image */}
              <div className="relative h-48 overflow-hidden">
                {article.imageUrl ? (
                  <img
                    src={article.imageUrl}
                    alt={article.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none'
                    }}
                  />
                ) : (
                  <div className={`w-full h-full bg-gradient-to-br ${getCategoryColor(article.category)} flex items-center justify-center`}>
                    <Newspaper className="w-16 h-16 text-white/30" />
                  </div>
                )}
                
                {/* Category Badge */}
                <div className={`absolute top-4 left-4 flex items-center gap-1.5 bg-gradient-to-r ${getCategoryColor(article.category)} px-3 py-1 rounded-full`}>
                  {getCategoryIcon(article.category)}
                  <span className="text-xs text-white font-semibold capitalize">{article.category}</span>
                </div>
                
                {/* Featured Badge for top article */}
                {index === 0 && (
                  <div className="absolute top-4 right-4 flex items-center gap-1.5 bg-yellow-500 px-3 py-1 rounded-full">
                    <TrendingUp className="w-3 h-3 text-yellow-900" />
                    <span className="text-xs text-yellow-900 font-bold">Featured</span>
                  </div>
                )}
                
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent" />
              </div>
              
              {/* Content */}
              <div className="p-5">
                <h3 className="text-lg font-bold text-white mb-2 line-clamp-2 group-hover:text-orange-300 transition-colors">
                  {article.title}
                </h3>
                
                <p className="text-sm text-slate-400 line-clamp-2 mb-4">
                  {article.summary}
                </p>
                
                {/* Tags */}
                {article.tags && article.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {article.tags.slice(0, 3).map((tag, i) => (
                      <span
                        key={i}
                        className="inline-flex items-center gap-1 text-xs bg-slate-800 text-slate-300 px-2 py-1 rounded-full"
                      >
                        <Tag className="w-3 h-3" />
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
                
                {/* Meta */}
                <div className="flex items-center justify-between pt-4 border-t border-slate-700/50">
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <Clock className="w-3 h-3" />
                    {article.publishedAt && formatDistanceToNow(article.publishedAt.toDate(), { addSuffix: true })}
                  </div>
                  
                  <div className="flex items-center gap-1 text-xs text-orange-400 group-hover:text-orange-300">
                    <span>{article.source}</span>
                    <ExternalLink className="w-3 h-3" />
                  </div>
                </div>
              </div>
            </a>
          ))}
          </div>
        )}

        {/* View All Button */}
        <div className="text-center">
          <Link to="/news">
            <Button
              size="lg"
              className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 text-white font-bold rounded-full shadow-lg shadow-orange-500/30 transition-all hover:scale-105"
            >
              <Newspaper className="w-5 h-5 mr-2" />
              View All News & Archive
              <ChevronRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default TourismNewsSection
