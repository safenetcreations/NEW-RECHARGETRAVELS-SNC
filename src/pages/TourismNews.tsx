import React, { useState, useEffect, useMemo } from 'react'
import { Helmet } from 'react-helmet-async'
import { collection, query, orderBy, limit, getDocs, where, Timestamp, startAfter, DocumentSnapshot } from 'firebase/firestore'
import { httpsCallable } from 'firebase/functions'
import { db, functions } from '@/lib/firebase'
import { toast } from 'sonner'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { 
  Newspaper, 
  ExternalLink, 
  Clock, 
  Tag, 
  TrendingUp,
  Search,
  Filter,
  Loader2,
  Globe,
  Building2,
  Plane,
  Calendar,
  ChevronDown,
  X,
  RefreshCw
} from 'lucide-react'
import { formatDistanceToNow, format } from 'date-fns'

interface NewsArticle {
  id: string
  title: string
  summary: string
  content: string
  source: string
  sourceId: string
  url: string
  imageUrl: string | null
  publishedAt: Timestamp
  category: string
  tags: string[]
  relevanceScore: number
  isActive?: boolean
}

const ITEMS_PER_PAGE = 12

const TourismNews = () => {
  const [news, setNews] = useState<NewsArticle[]>([])
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [lastDoc, setLastDoc] = useState<DocumentSnapshot | null>(null)
  const [hasMore, setHasMore] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [selectedSource, setSelectedSource] = useState<string>('all')
  const [refreshing, setRefreshing] = useState(false)

  const refreshNews = async () => {
    if (!functions) {
      toast.error('Firebase not initialized. Please refresh the page.')
      return
    }
    setRefreshing(true)
    try {
      // Use forceNewsRefresh for more aggressive fetching
      const forceRefresh = httpsCallable(functions, 'forceNewsRefresh')
      const result = await forceRefresh()
      const data = result.data as { total: number; sources: number; activated?: number; totalInDatabase?: number }

      if (data.total > 0) {
        toast.success(`Fetched ${data.total} new articles from ${data.sources} sources!`)
      } else if (data.totalInDatabase && data.totalInDatabase > 0) {
        toast.info(`${data.totalInDatabase} articles already in database. No new articles found.`)
      } else {
        toast.info('No new tourism articles found. RSS sources may not have relevant content.')
      }

      // Reload news after fetch
      setLastDoc(null)
      setHasMore(true)
      await fetchNews(false)
    } catch (error: any) {
      console.error('Error refreshing news:', error)
      toast.error(error.message || 'Failed to refresh news. Please try again.')
    } finally {
      setRefreshing(false)
    }
  }

  // Get unique sources from loaded news
  const sources = useMemo(() => {
    const sourceSet = new Set(news.map(n => n.source))
    return Array.from(sourceSet).sort()
  }, [news])

  const categories = ['all', 'government', 'media', 'business', 'travel']

  useEffect(() => {
    fetchNews()
  }, [])

  const fetchNews = async (loadMore = false) => {
    if (loadMore && !lastDoc) {
      return
    }

    if (loadMore) {
      setLoadingMore(true)
    } else {
      setLoading(true)
    }

    try {
      const newsRef = collection(db, 'tourismNews')
      const constraints = [
        orderBy('publishedAt', 'desc'),
        limit(ITEMS_PER_PAGE)
      ]

      if (loadMore && lastDoc) {
        constraints.push(startAfter(lastDoc))
      }

      const q = query(newsRef, ...constraints)

      const snapshot = await getDocs(q)
      console.log('News snapshot size:', snapshot.size)
      
      const articles: NewsArticle[] = snapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() } as NewsArticle))
        .filter(article => article.isActive !== false)

      if (loadMore) {
        setNews(prev => [...prev, ...articles])
      } else {
        setNews(articles)
      }

      setLastDoc(snapshot.docs[snapshot.docs.length - 1] || null)
      setHasMore(snapshot.docs.length === ITEMS_PER_PAGE)

    } catch (err) {
      console.error('Error fetching news:', err)
    } finally {
      setLoading(false)
      setLoadingMore(false)
    }
  }

  // Filter news based on search and category
  const filteredNews = useMemo(() => {
    return news.filter(article => {
      const matchesSearch = searchTerm === '' || 
        article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        article.summary.toLowerCase().includes(searchTerm.toLowerCase()) ||
        article.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))

      const matchesCategory = selectedCategory === 'all' || article.category === selectedCategory
      const matchesSource = selectedSource === 'all' || article.source === selectedSource

      return matchesSearch && matchesCategory && matchesSource
    })
  }, [news, searchTerm, selectedCategory, selectedSource])

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

  const clearFilters = () => {
    setSearchTerm('')
    setSelectedCategory('all')
    setSelectedSource('all')
  }

  // Generate structured data for SEO
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "Sri Lanka Tourism News & Updates",
    "description": "Latest tourism news, government announcements, and travel updates from Sri Lanka",
    "url": "https://www.rechargetravels.com/news",
    "publisher": {
      "@type": "Organization",
      "name": "Recharge Travels",
      "logo": "https://www.rechargetravels.com/logo-v2.png"
    },
    "mainEntity": {
      "@type": "ItemList",
      "itemListElement": filteredNews.slice(0, 10).map((article, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "item": {
          "@type": "NewsArticle",
          "headline": article.title,
          "description": article.summary,
          "url": article.url,
          "datePublished": article.publishedAt?.toDate().toISOString(),
          "publisher": {
            "@type": "Organization",
            "name": article.source
          }
        }
      }))
    }
  }

  return (
    <>
      <Helmet>
        <title>Sri Lanka Tourism News & Updates | Latest Travel News - Recharge Travels</title>
        <meta name="description" content="Stay updated with the latest Sri Lanka tourism news, government announcements, new hotel openings, visa updates, and travel industry news. Your source for Sri Lanka travel updates." />
        <meta name="keywords" content="Sri Lanka tourism news, Sri Lanka travel news, tourism ministry announcements, Sri Lanka visa news, Sri Lanka hotel news, travel updates Sri Lanka" />
        <link rel="canonical" href="https://www.rechargetravels.com/news" />
        <meta property="og:title" content="Sri Lanka Tourism News & Updates" />
        <meta property="og:description" content="Latest tourism news, government announcements, and travel updates from Sri Lanka" />
        <meta property="og:type" content="website" />
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      </Helmet>
      <main className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
        {/* Hero Section */}
        <section className="relative pt-24 pb-12 px-4 sm:px-6 lg:px-8">
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_50%,rgba(249,115,22,0.15),transparent_50%)]" />
          </div>

          <div className="max-w-7xl mx-auto relative z-10">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 rounded-full border border-orange-500/40 bg-orange-500/10 px-4 py-2 mb-6 backdrop-blur-xl">
                <Newspaper className="h-4 w-4 text-orange-400" />
                <span className="text-xs font-bold uppercase tracking-widest text-orange-200">News Archive</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight mb-6">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
                  Sri Lanka Tourism
                </span>
                <br />
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-orange-400 to-amber-400">
                  News & Updates
                </span>
              </h1>

              <p className="text-lg text-slate-300 max-w-3xl mx-auto mb-8">
                Stay informed with the latest news from Sri Lanka's tourism industry. 
                Updated twice daily with government announcements, new developments, and travel updates.
              </p>

              {/* Refresh Button */}
              <Button
                onClick={refreshNews}
                disabled={refreshing}
                size="lg"
                className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 text-white font-bold rounded-full shadow-lg shadow-orange-500/30 transition-all hover:scale-105"
              >
                {refreshing ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Fetching Latest News...
                  </>
                ) : (
                  <>
                    <RefreshCw className="w-5 h-5 mr-2" />
                    Get Latest News
                  </>
                )}
              </Button>
            </div>

            {/* Pillar shortcuts */}
            <div className="bg-slate-900/70 border border-slate-700/60 rounded-2xl p-4 mb-6 text-center">
              <p className="text-xs uppercase tracking-[0.3em] text-slate-400 font-semibold mb-3">Explore Pillars</p>
              <div className="flex flex-wrap gap-3 justify-center text-sm">
                {[
                  { title: 'Tours', href: '/tours' },
                  { title: 'Destinations', href: '/destinations' },
                  { title: 'Experiences', href: '/experiences' },
                  { title: 'Transport', href: '/transport' },
                  { title: 'Family Activities', href: '/family-activities' },
                  { title: 'Scenic', href: '/scenic' }
                ].map(link => (
                  <a
                    key={link.href}
                    href={link.href}
                    className="rounded-full border border-slate-700 bg-slate-800/70 px-3 py-1.5 font-semibold text-slate-200 hover:border-orange-400 hover:text-orange-300 transition"
                  >
                    {link.title}
                  </a>
                ))}
              </div>
            </div>

            {/* Search and Filters */}
            <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-700 rounded-2xl p-6 mb-8">
              <div className="flex flex-col lg:flex-row gap-4">
                {/* Search */}
                <div className="flex-1 relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <Input
                    type="text"
                    placeholder="Search news, topics, keywords..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-12 h-12 bg-slate-800 border-slate-600 text-white placeholder:text-slate-500 rounded-xl"
                  />
                </div>

                {/* Category Filter */}
                <div className="relative">
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="h-12 px-4 pr-10 bg-slate-800 border border-slate-600 text-white rounded-xl appearance-none cursor-pointer min-w-[160px]"
                  >
                    {categories.map(cat => (
                      <option key={cat} value={cat}>
                        {cat === 'all' ? 'All Categories' : cat.charAt(0).toUpperCase() + cat.slice(1)}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
                </div>

                {/* Source Filter */}
                {sources.length > 0 && (
                  <div className="relative">
                    <select
                      value={selectedSource}
                      onChange={(e) => setSelectedSource(e.target.value)}
                      className="h-12 px-4 pr-10 bg-slate-800 border border-slate-600 text-white rounded-xl appearance-none cursor-pointer min-w-[180px]"
                    >
                      <option value="all">All Sources</option>
                      {sources.map(source => (
                        <option key={source} value={source}>{source}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
                  </div>
                )}

                {/* Clear Filters */}
                {(searchTerm || selectedCategory !== 'all' || selectedSource !== 'all') && (
                  <Button
                    variant="outline"
                    onClick={clearFilters}
                    className="h-12 border-slate-600 text-slate-300 hover:bg-slate-800"
                  >
                    <X className="w-4 h-4 mr-2" />
                    Clear
                  </Button>
                )}
              </div>

              {/* Results count */}
              <div className="mt-4 text-sm text-slate-400">
                Showing {filteredNews.length} of {news.length} articles
              </div>
            </div>
          </div>
        </section>

        {/* News Grid */}
        <section className="pb-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="w-10 h-10 animate-spin text-orange-500" />
              </div>
            ) : filteredNews.length === 0 ? (
              <div className="text-center py-20">
                <Newspaper className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">No news found</h3>
                <p className="text-slate-400">Try adjusting your search or filters</p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredNews.map((article, index) => (
                    <article
                      key={article.id}
                      className="group relative overflow-hidden rounded-2xl bg-slate-900/60 backdrop-blur-xl border border-slate-700/70 transition-all duration-500 hover:scale-[1.02] hover:border-slate-500 hover:shadow-2xl hover:shadow-orange-500/10"
                    >
                      <a
                        href={article.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block"
                      >
                        {/* Image */}
                        <div className="relative h-48 overflow-hidden">
                          {article.imageUrl ? (
                            <img
                              src={article.imageUrl}
                              alt={article.title}
                              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                              loading="lazy"
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

                          {/* Gradient overlay */}
                          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent" />
                        </div>

                        {/* Content */}
                        <div className="p-5">
                          <h2 className="text-lg font-bold text-white mb-2 line-clamp-2 group-hover:text-orange-300 transition-colors">
                            {article.title}
                          </h2>

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
                              <Calendar className="w-3 h-3" />
                              {article.publishedAt && format(article.publishedAt.toDate(), 'MMM d, yyyy')}
                            </div>

                            <div className="flex items-center gap-1 text-xs text-orange-400 group-hover:text-orange-300">
                              <span>{article.source}</span>
                              <ExternalLink className="w-3 h-3" />
                            </div>
                          </div>
                        </div>
                      </a>
                    </article>
                  ))}
                </div>

                {/* Load More */}
                {hasMore && selectedCategory === 'all' && selectedSource === 'all' && searchTerm === '' && (
                  <div className="text-center mt-12">
                    <Button
                      onClick={() => fetchNews(true)}
                      disabled={loadingMore}
                      size="lg"
                      className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 text-white font-bold rounded-full"
                    >
                      {loadingMore ? (
                        <>
                          <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                          Loading...
                        </>
                      ) : (
                        <>
                          Load More News
                          <ChevronDown className="w-5 h-5 ml-2" />
                        </>
                      )}
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>
        </section>
      </main>
    </>
  )
}

export default TourismNews
