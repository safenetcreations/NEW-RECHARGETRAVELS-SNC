
import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Calendar, MapPin, Share2, BookOpen, Clock } from 'lucide-react'
import SEOHead from '../components/cms/SEOHead'
import Breadcrumbs from '../components/cms/Breadcrumbs'
import ArticleCard from '../components/cms/ArticleCard'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { getArticle, getArticles } from '@/lib/cms-queries';
import type { Article } from '@/lib/firebase-cms';
import ReactMarkdown from 'react-markdown'

const ArticleDetail = () => {
  const { slug } = useParams<{ slug: string }>()
  const [article, setArticle] = useState<any>(null)
  const [relatedArticles, setRelatedArticles] = useState<Article[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadArticle = async () => {
      if (!slug) return

      try {
        const articleData = await getArticle(slug)
        setArticle(articleData)

        // Load related articles of same content type
        if (articleData.content_type) {
          const related = await getArticles(1, 4, articleData.content_type)
          setRelatedArticles(related.articles.filter(a => a.article_id !== articleData.article_id))
        }
      } catch (error) {
        console.error('Failed to load article:', error)
      } finally {
        setLoading(false)
      }
    }

    loadArticle()
  }, [slug])

  if (loading) {
    return (
      <div className="min-h-screen bg-soft-beige">
        <div className="container mx-auto px-4 py-12">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
            <div className="h-64 bg-gray-200 rounded mb-6"></div>
            <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          </div>
        </div>
      </div>
    )
  }

  if (!article) {
    return (
      <div className="min-h-screen bg-soft-beige">
        <div className="container mx-auto px-4 py-12">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Article Not Found</h1>
            <Link to="/articles">
              <Button>Browse All Articles</Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": article.title,
    "description": article.body_md?.substring(0, 200),
    "url": `${window.location.origin}/articles/${article.slug}`,
    "image": article.og_image_url,
    "datePublished": article.published_at,
    "dateModified": article.updated_at,
    "author": {
      "@type": "Organization",
      "name": "Recharge Travels"
    },
    "publisher": {
      "@type": "Organization",
      "name": "Recharge Travels"
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `${window.location.origin}/articles/${article.slug}`
    }
  }

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

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: article.title,
          text: article.body_md?.substring(0, 200) || '',
          url: window.location.href
        })
      } catch (error) {
        console.log('Error sharing:', error)
      }
    } else {
      navigator.clipboard.writeText(window.location.href)
    }
  }

  const estimateReadingTime = (text: string) => {
    const wordsPerMinute = 200
    const wordCount = text.split(' ').length
    return Math.ceil(wordCount / wordsPerMinute)
  }

  return (
    <div className="min-h-screen bg-soft-beige">
      <SEOHead
        title={article.meta_title || article.title}
        description={article.meta_description || article.body_md?.substring(0, 200)}
        ogImage={article.og_image_url}
        structuredData={structuredData}
        canonicalUrl={`${window.location.origin}/articles/${article.slug}`}
      />

      <div className="container mx-auto px-4 py-12">
        <Breadcrumbs 
          items={[
            { label: 'Articles', href: '/articles' },
            { label: article.content_type ? article.content_type.charAt(0).toUpperCase() + article.content_type.slice(1) : 'Article' },
            { label: article.title }
          ]}
        />

        {/* Hero Section */}
        <div className="mb-8">
          {article.og_image_url && (
            <div className="aspect-video rounded-2xl overflow-hidden mb-6">
              <img 
                src={article.og_image_url} 
                alt={article.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-4">
                {article.content_type && (
                  <Badge className={`text-sm ${getContentTypeColor(article.content_type)}`}>
                    {article.content_type}
                  </Badge>
                )}
                {article.region && (
                  <div className="flex items-center text-gray-600 text-sm">
                    <MapPin className="h-4 w-4 mr-1" />
                    {article.region.name}
                  </div>
                )}
              </div>

              <h1 className="text-4xl font-bold text-granite-gray mb-4">
                {article.title}
              </h1>

              <div className="flex items-center gap-6 text-sm text-gray-600 mb-6">
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-1" />
                  Published {formatDate(article.published_at || article.created_at)}
                </div>
                
                {article.body_md && (
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    {estimateReadingTime(article.body_md)} min read
                  </div>
                )}

                <div className="flex items-center">
                  <BookOpen className="h-4 w-4 mr-1" />
                  Article
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mb-6">
                {article.content_category?.map((cc: any) => (
                  <Badge key={cc.category.category_id} variant="outline">
                    {cc.category.name}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="flex gap-3">
              <Button variant="outline" onClick={handleShare}>
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
            </div>
          </div>
        </div>

        {/* Article Content */}
        {article.body_md && (
          <Card className="mb-8">
            <CardContent className="p-8">
              <div className="prose prose-lg max-w-none">
                <ReactMarkdown>{article.body_md}</ReactMarkdown>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Itinerary Stops (for itinerary articles) */}
        {article.itinerary_stop && article.itinerary_stop.length > 0 && (
          <Card className="mb-8">
            <CardHeader>
              <h2 className="text-2xl font-bold">Itinerary</h2>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {article.itinerary_stop.map((stop: any) => (
                  <div key={stop.stop_id} className="border-l-4 border-teal-500 pl-6">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="outline">Day {stop.day_number}</Badge>
                      {stop.destination && (
                        <Link 
                          to={`/destinations/${stop.destination.slug}`}
                          className="text-teal-600 hover:underline font-medium"
                        >
                          {stop.destination.name}
                        </Link>
                      )}
                    </div>
                    {stop.description && (
                      <p className="text-gray-700">{stop.description}</p>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Related Articles */}
        {relatedArticles.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-granite-gray mb-6">
              Related {article.content_type ? article.content_type.charAt(0).toUpperCase() + article.content_type.slice(1) + 's' : 'Articles'}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedArticles.map((relatedArticle) => (
                <ArticleCard key={relatedArticle.id} article={relatedArticle} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default ArticleDetail
