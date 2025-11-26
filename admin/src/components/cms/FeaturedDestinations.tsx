
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import DestinationCard from './DestinationCard'
import { getFeaturedDestinations, type Destination } from '@/lib/cms-queries'
import { ArrowRight } from 'lucide-react'

const FeaturedDestinations = () => {
  const [destinations, setDestinations] = useState<Destination[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadFeaturedDestinations = async () => {
      try {
        const { data } = await getFeaturedDestinations()
        setDestinations(data || [])
      } catch (error) {
        console.error('Failed to load featured destinations:', error)
      } finally {
        setLoading(false)
      }
    }

    loadFeaturedDestinations()
  }, [])

  if (loading) {
    return (
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="h-64 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </section>
    )
  }

  if (destinations.length === 0) {
    return null
  }

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-granite-gray mb-2">
              Featured Destinations
            </h2>
            <p className="text-granite-gray/70">
              Discover the most beautiful places in Sri Lanka
            </p>
          </div>
          
          <Link to="/destinations">
            <Button variant="outline">
              View All Destinations
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {destinations.map((destination) => (
            <DestinationCard key={destination.dest_id} destination={destination} />
          ))}
        </div>
      </div>
    </section>
  )
}

export default FeaturedDestinations
