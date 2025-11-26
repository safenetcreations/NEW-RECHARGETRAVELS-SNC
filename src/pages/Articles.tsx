
import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import SEOHead from '../components/cms/SEOHead'
import Breadcrumbs from '../components/cms/Breadcrumbs'
import ArticleCard from '../components/cms/ArticleCard'
import SearchBar, { SearchFilters } from '../components/cms/SearchBar'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { getArticles } from '@/lib/cms-queries';
import type { Article } from '@/lib/firebase-cms';
import { ChevronLeft, ChevronRight, BookOpen } from 'lucide-react'

const Articles = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const [articles, setArticles] = useState<Article[]>([])
  const [loading, setLoading] = useState(true)
  const [searching, setSearching] = useState(false)
  const [totalPages, setTotalPages] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalCount, setTotalCount] = useState(0)
  const [selectedContentType, setSelectedContentType] = useState<string>('')

  const contentTypes = [
    { value: '', label: 'All Articles' },
    { value: 'guide', label: 'Travel Guides' },
    { value: 'itinerary', label: 'Itineraries' },
    { value: 'logistics', label: 'Travel Logistics' },
    { value: 'festival', label: 'Festivals & Events' },
    { value: 'blog', label: 'Travel Blog' }
  ]

  const loadArticles = async (page = 1, contentType = '', search?: string, filters?: SearchFilters) => {
    try {
      setSearching(!!search)
      
      if (search || filters) {
        // Use search endpoint when we implement it
        console.log('Search not implemented yet:', { search, filters })
        return
      }

      const result = await getArticles(page, 12, contentType || undefined)
      setArticles(result.articles)
      setTotalPages(result.totalPages)
      setCurrentPage(result.currentPage)
      setTotalCount(result.totalCount)
    } catch (error) {
      console.error('Failed to load articles:', error)
    } finally {
      setLoading(false)
      setSearching(false)
    }
  }

  useEffect(() => {
    const page = parseInt(searchParams.get('page') || '1')
    const type = searchParams.get('type') || ''
    setCurrentPage(page)
    setSelectedContentType(type)
    loadArticles(page, type)
  }, [searchParams])

  const handleSearch = (query: string, filters: SearchFilters) => {
    loadArticles(1, selectedContentType, query, filters)
  }

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams)
    params.set('page', page.toString())
    setSearchParams(params)
  }

  const handleContentTypeChange = (type: string) => {
    const params = new URLSearchParams()
    if (type) params.set('type', type)
    params.set('page', '1')
    setSearchParams(params)
  }

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "Sri Lanka Travel Articles",
    "description": "Travel guides, itineraries, and tips for exploring Sri Lanka",
    "url": `${window.location.origin}/articles`,
    "mainEntity": {
      "@type": "ItemList",
      "numberOfItems": totalCount,
      "itemListElement": articles.map((article, index) => ({
        "@type": "Article",
        "position": index + 1,
        "headline": article.title,
        "description": article.body_md?.substring(0, 200),
        "url": `${window.location.origin}/articles/${article.slug}`,
        "image": article.og_image_url,
        "datePublished": article.published_at,
        "dateModified": article.updated_at,
        "author": {
          "@type": "Organization",
          "name": "Recharge Travels"
        }
      }))
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-soft-beige">
        <div className="container mx-auto px-4 py-12">
          <div className="flex items-center justify-center">
            <BookOpen className="h-8 w-8 animate-spin" />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-soft-beige">
      <SEOHead
        title="Sri Lanka Travel Articles & Guides"
        description="Comprehensive travel guides, itineraries, and expert tips for exploring Sri Lanka. Plan your perfect Sri Lankan adventure with our detailed articles."
        structuredData={structuredData}
        canonicalUrl={`${window.location.origin}/articles`}
      />

      <div className="container mx-auto px-4 py-12">
        <Breadcrumbs 
          items={[
            { label: 'Articles' }
          ]}
        />

        <div className="mb-8">
          <h1 className="text-4xl font-bold text-granite-gray mb-4">
            Travel Articles & Guides
          </h1>
          <p className="text-lg text-granite-gray/70 max-w-2xl">
            Expert travel advice, detailed itineraries, and insider tips to help you 
            make the most of your Sri Lankan adventure. From logistics to hidden gems, 
            we've got you covered.
          </p>
        </div>

        <div className="mb-8">
          <SearchBar onSearch={handleSearch} loading={searching} />
        </div>

        <div className="mb-6">
          <div className="flex flex-wrap gap-2">
            {contentTypes.map((type) => (
              <Badge
                key={type.value}
                variant={selectedContentType === type.value ? 'default' : 'secondary'}
                className="cursor-pointer hover:bg-teal-600 hover:text-white transition-colors"
                onClick={() => handleContentTypeChange(type.value)}
              >
                {type.label}
              </Badge>
            ))}
          </div>
        </div>

        {articles.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {articles.map((article) => (
                <ArticleCard key={article.id} article={article} />
              ))}
            </div>

            {totalPages > 1 && (
              <div className="flex items-center justify-center space-x-4">
                <Button
                  variant="outline"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="h-4 w-4 mr-2"  />
                  Previous
                </Button>

                <span className="text-sm text-gray-600">
                  Page {currentPage} of {totalPages}
                </span>

                <Button
                  variant="outline"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  Next
                  <ChevronRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">No articles found.</p>
            <p className="text-gray-500 text-sm mt-2">Try adjusting your search criteria.</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default Articles
