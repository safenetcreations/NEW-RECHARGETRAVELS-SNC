import React, { useState, useEffect } from 'react'
import { collection, query, orderBy, limit, getDocs, doc, getDoc, deleteDoc, updateDoc } from 'firebase/firestore'
import { httpsCallable } from 'firebase/functions'
import { db, functions } from '@/lib/firebase'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  Newspaper, 
  RefreshCw, 
  Loader2, 
  Clock, 
  Globe, 
  ExternalLink,
  Trash2,
  Eye,
  EyeOff,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  Calendar
} from 'lucide-react'
import { toast } from 'sonner'
import { formatDistanceToNow, format } from 'date-fns'

interface NewsArticle {
  id: string
  title: string
  summary: string
  source: string
  url: string
  publishedAt: any
  fetchedAt: any
  category: string
  tags: string[]
  isActive: boolean
}

interface AggregatorStats {
  lastFetch: any
  totalArticles: number
  successfulSources: number
}

const NewsAggregatorSection = () => {
  const [news, setNews] = useState<NewsArticle[]>([])
  const [stats, setStats] = useState<AggregatorStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [fetching, setFetching] = useState(false)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    setLoading(true)
    try {
      // Fetch latest news
      const newsRef = collection(db, 'tourismNews')
      const q = query(newsRef, orderBy('fetchedAt', 'desc'), limit(20))
      const snapshot = await getDocs(q)
      
      const articles: NewsArticle[] = []
      snapshot.forEach(doc => {
        articles.push({ id: doc.id, ...doc.data() } as NewsArticle)
      })
      setNews(articles)

      // Fetch aggregator stats
      const statsDoc = await getDoc(doc(db, 'settings', 'newsAggregator'))
      if (statsDoc.exists()) {
        setStats(statsDoc.data() as AggregatorStats)
      }
    } catch (error) {
      console.error('Error fetching data:', error)
      toast.error('Failed to load news data')
    } finally {
      setLoading(false)
    }
  }

  const triggerManualFetch = async () => {
    setFetching(true)
    try {
      const manualFetch = httpsCallable(functions, 'manualNewsFetch')
      const result = await manualFetch()
      toast.success(`Fetched ${(result.data as any).total} new articles from ${(result.data as any).sources} sources`)
      await fetchData()
    } catch (error: any) {
      console.error('Error triggering fetch:', error)
      toast.error(error.message || 'Failed to fetch news')
    } finally {
      setFetching(false)
    }
  }

  const toggleArticleVisibility = async (article: NewsArticle) => {
    try {
      await updateDoc(doc(db, 'tourismNews', article.id), {
        isActive: !article.isActive
      })
      setNews(prev => prev.map(a => 
        a.id === article.id ? { ...a, isActive: !a.isActive } : a
      ))
      toast.success(article.isActive ? 'Article hidden' : 'Article visible')
    } catch (error) {
      console.error('Error updating article:', error)
      toast.error('Failed to update article')
    }
  }

  const deleteArticle = async (articleId: string) => {
    if (!confirm('Are you sure you want to delete this article?')) return

    try {
      await deleteDoc(doc(db, 'tourismNews', articleId))
      setNews(prev => prev.filter(a => a.id !== articleId))
      toast.success('Article deleted')
    } catch (error) {
      console.error('Error deleting article:', error)
      toast.error('Failed to delete article')
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Newspaper className="w-7 h-7 text-orange-500" />
            Tourism News Aggregator
          </h2>
          <p className="text-gray-600">Automatically fetches Sri Lanka tourism news twice daily (9 AM & 6 PM)</p>
        </div>
        <Button 
          onClick={triggerManualFetch} 
          disabled={fetching}
          className="bg-orange-500 hover:bg-orange-600"
        >
          {fetching ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Fetching...
            </>
          ) : (
            <>
              <RefreshCw className="w-4 h-4 mr-2" />
              Fetch Now
            </>
          )}
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-orange-100 rounded-xl">
                <Newspaper className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{news.length}</p>
                <p className="text-sm text-gray-500">Total Articles</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-100 rounded-xl">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{news.filter(n => n.isActive).length}</p>
                <p className="text-sm text-gray-500">Active Articles</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 rounded-xl">
                <Globe className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats?.successfulSources || 0}</p>
                <p className="text-sm text-gray-500">Active Sources</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-purple-100 rounded-xl">
                <Clock className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm font-bold">
                  {stats?.lastFetch 
                    ? formatDistanceToNow(stats.lastFetch.toDate(), { addSuffix: true })
                    : 'Never'
                  }
                </p>
                <p className="text-sm text-gray-500">Last Fetch</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Schedule Info */}
      <Card className="bg-blue-50 border-blue-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-800">
            <Calendar className="w-5 h-5" />
            Automatic Fetch Schedule
          </CardTitle>
        </CardHeader>
        <CardContent className="text-blue-900">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span><strong>Morning:</strong> 9:00 AM Sri Lanka Time (IST)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
              <span><strong>Evening:</strong> 6:00 PM Sri Lanka Time (IST)</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* News List */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Articles</CardTitle>
          <CardDescription>Latest fetched tourism news from all sources</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {news.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <Newspaper className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No articles yet. Click "Fetch Now" to get started.</p>
              </div>
            ) : (
              news.map(article => (
                <div 
                  key={article.id}
                  className={`flex items-start gap-4 p-4 rounded-lg border ${
                    article.isActive ? 'bg-white border-gray-200' : 'bg-gray-50 border-gray-200 opacity-60'
                  }`}
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${
                        article.category === 'government' ? 'bg-blue-100 text-blue-700' :
                        article.category === 'business' ? 'bg-green-100 text-green-700' :
                        'bg-purple-100 text-purple-700'
                      }`}>
                        {article.category}
                      </span>
                      <span className="text-xs text-gray-500">{article.source}</span>
                      {!article.isActive && (
                        <span className="px-2 py-0.5 text-xs bg-red-100 text-red-700 rounded-full">Hidden</span>
                      )}
                    </div>
                    
                    <h4 className="font-medium text-gray-900 line-clamp-1">{article.title}</h4>
                    <p className="text-sm text-gray-500 line-clamp-1 mt-1">{article.summary}</p>
                    
                    <div className="flex items-center gap-4 mt-2 text-xs text-gray-400">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {article.publishedAt && format(article.publishedAt.toDate(), 'MMM d, yyyy HH:mm')}
                      </span>
                      {article.tags && article.tags.length > 0 && (
                        <span className="flex items-center gap-1">
                          <TrendingUp className="w-3 h-3" />
                          {article.tags.slice(0, 3).join(', ')}
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 shrink-0">
                    <a
                      href={article.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 text-gray-400 hover:text-blue-500 transition-colors"
                      title="View original"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                    <button
                      onClick={() => toggleArticleVisibility(article)}
                      className="p-2 text-gray-400 hover:text-orange-500 transition-colors"
                      title={article.isActive ? 'Hide article' : 'Show article'}
                    >
                      {article.isActive ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                    <button
                      onClick={() => deleteArticle(article.id)}
                      className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                      title="Delete article"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* News Sources */}
      <Card>
        <CardHeader>
          <CardTitle>Configured News Sources</CardTitle>
          <CardDescription>RSS feeds being monitored for tourism news</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { name: 'Daily Mirror - Travel', category: 'Media' },
              { name: 'Sunday Times - Travel', category: 'Media' },
              { name: 'The Island', category: 'Media' },
              { name: 'Ada Derana', category: 'Media' },
              { name: 'EconomyNext', category: 'Business' },
              { name: 'Daily FT', category: 'Business' },
              { name: 'Colombo Gazette', category: 'Media' },
              { name: 'NewsFirst', category: 'Media' },
              { name: 'Ceylon Today', category: 'Media' },
              { name: 'Lanka Business Online', category: 'Business' },
            ].map((source, i) => (
              <div key={i} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <div>
                  <p className="font-medium text-sm">{source.name}</p>
                  <p className="text-xs text-gray-500">{source.category}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default NewsAggregatorSection
