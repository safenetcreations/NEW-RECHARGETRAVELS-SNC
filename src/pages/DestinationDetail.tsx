
import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { MapPin, Calendar, Share2, ExternalLink } from 'lucide-react'
import SEOHead from '../components/cms/SEOHead'
import Breadcrumbs from '../components/cms/Breadcrumbs'
import DestinationCard from '../components/cms/DestinationCard'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { getDestination, getRelatedDestinations } from '@/lib/cms-queries';
import type { Destination } from '@/lib/firebase-cms';
import ReactMarkdown from 'react-markdown'

const DestinationDetail = () => {
  const { slug } = useParams<{ slug: string }>()
  const [destination, setDestination] = useState<any>(null)
  const [relatedDestinations, setRelatedDestinations] = useState<Destination[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadDestination = async () => {
      if (!slug) return

      try {
        const destData = await getDestination(slug)
        setDestination(destData)

        // Load related destinations
        if (destData.region) {
          const related = await getRelatedDestinations(destData.region.id, destData.id)
          setRelatedDestinations(related as Destination[])
        }
      } catch (error) {
        console.error('Failed to load destination:', error)
      } finally {
        setLoading(false)
      }
    }

    loadDestination()
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

  if (!destination) {
    return (
      <div className="min-h-screen bg-soft-beige">
        <div className="container mx-auto px-4 py-12">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Destination Not Found</h1>
            <Link to="/destinations">
              <Button>Browse All Destinations</Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "TouristDestination",
    "name": destination.name,
    "description": destination.summary || destination.meta_description,
    "url": `${window.location.origin}/destinations/${destination.slug}`,
    "image": destination.og_image_url,
    "geo": destination.latitude && destination.longitude ? {
      "@type": "GeoCoordinates",
      "latitude": destination.latitude,
      "longitude": destination.longitude
    } : undefined,
    "containedInPlace": destination.region ? {
      "@type": "AdministrativeArea",
      "name": destination.region.name
    } : undefined,
    "touristType": destination.content_category?.map((cc: any) => cc.category.name)
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: destination.name,
          text: destination.summary || '',
          url: window.location.href
        })
      } catch (error) {
        console.log('Error sharing:', error)
      }
    } else {
      // Fallback to copying URL
      navigator.clipboard.writeText(window.location.href)
    }
  }

  return (
    <div className="min-h-screen bg-soft-beige">
      <SEOHead
        title={destination.meta_title || destination.name}
        description={destination.meta_description || destination.summary}
        ogImage={destination.og_image_url}
        structuredData={structuredData}
        canonicalUrl={`${window.location.origin}/destinations/${destination.slug}`}
      />

      <div className="container mx-auto px-4 py-12">
        <Breadcrumbs 
          items={[
            { label: 'Destinations', href: '/destinations' },
            { label: destination.region?.name || 'Unknown Region' },
            { label: destination.name }
          ]}
        />

        {/* Hero Section */}
        <div className="mb-8">
          {destination.og_image_url && (
            <div className="aspect-video rounded-2xl overflow-hidden mb-6">
              <img 
                src={destination.og_image_url} 
                alt={destination.name}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-4">
                <Badge variant="secondary" className="text-sm">
                  {destination.dest_type}
                </Badge>
                {destination.region && (
                  <div className="flex items-center text-gray-600 text-sm">
                    <MapPin className="h-4 w-4 mr-1" />
                    {destination.region.name}
                  </div>
                )}
              </div>

              <h1 className="text-4xl font-bold text-granite-gray mb-4">
                {destination.name}
              </h1>

              {destination.summary && (
                <p className="text-lg text-granite-gray/70 mb-6 max-w-3xl">
                  {destination.summary}
                </p>
              )}

              <div className="flex flex-wrap gap-2 mb-6">
                {destination.content_category?.map((cc: any) => (
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
              
              {destination.latitude && destination.longitude && (
                <Button asChild>
                  <a
                    href={`https://www.google.com/maps?q=${destination.latitude},${destination.longitude}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    View on Map
                  </a>
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Content */}
        {destination.body_md && (
          <Card className="mb-8">
            <CardContent className="p-8">
              <div className="prose prose-lg max-w-none">
                <ReactMarkdown>{destination.body_md}</ReactMarkdown>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Related Destinations */}
        {relatedDestinations.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-granite-gray mb-6">
              More in {destination.region?.name}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {relatedDestinations.map((relatedDest) => (
                <DestinationCard key={relatedDest.id} destination={relatedDest} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default DestinationDetail
