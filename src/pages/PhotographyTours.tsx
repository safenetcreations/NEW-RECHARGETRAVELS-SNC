import { useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { Camera, Filter, MapPin, Clock, Users, Zap } from 'lucide-react'
import PhotographyHero from '@/components/photography/PhotographyHero'
import PhotographyFilters from '@/components/photography/PhotographyFilters'
import PhotographyTourCard from '@/components/photography/PhotographyTourCard'
import { usePhotographyTours } from '@/hooks/usePhotographyTours'

const PhotographyTours = () => {
  const [filters, setFilters] = useState({
    genre: '',
    skillLevel: '',
    durationType: '',
    gearRental: false
  })

  const { data: tours, isLoading } = usePhotographyTours(filters)

  const featuredCategories = [
    {
      genre: 'cultural_temples',
      title: 'Cultural & Temples',
      description: 'Sacred architecture and ancient traditions',
      image: '/images/photography/temple-golden-hour.jpg',
      icon: <Camera className="w-6 h-6" />
    },
    {
      genre: 'wildlife_nature',
      title: 'Wildlife & Nature',
      description: 'Leopards, elephants, and exotic birds',
      image: '/images/photography/leopard-portrait.jpg',
      icon: <Zap className="w-6 h-6" />
    },
    {
      genre: 'scenic_trains',
      title: 'Scenic Train Journeys',
      description: 'Tea plantations and mountain vistas',
      image: '/images/photography/train-tea-hills.jpg',
      icon: <MapPin className="w-6 h-6" />
    },
    {
      genre: 'street_local',
      title: 'Street & Local Life',
      description: 'Urban culture and authentic moments',
      image: '/images/photography/pettah-market.jpg',
      icon: <Users className="w-6 h-6" />
    }
  ]

  return (
    <>
      <Helmet>
        <title>Sri Lanka Photography Tours - Temples, Wildlife, Trains & Street Life | Recharge Travels</title>
        <meta name="description" content="Professional photography tours in Sri Lanka. Capture temples, wildlife, scenic trains, and street life with expert guides and premium equipment rental." />
        <meta name="keywords" content="Sri Lanka photography tours, temple photography, wildlife photography, train photography, street photography, camera rental" />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "TouristTrip",
            "name": "Sri Lanka Photography Tours",
            "description": "Professional photography tours covering temples, wildlife, scenic trains, and street life in Sri Lanka",
            "provider": {
              "@type": "Organization",
              "name": "Recharge Travels"
            },
            "offers": {
              "@type": "Offer",
              "priceRange": "$80-$280",
              "availability": "https://schema.org/InStock"
            }
          })}
        </script>
      </Helmet>

      <main className="min-h-screen">
        {/* Hero Section */}
        <PhotographyHero />

        {/* Tagline */}
        <section className="py-16 bg-gradient-to-b from-background to-muted/30">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
              Capture Sri Lanka
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto">
              From Sacred Stones to City Streets
            </p>
            <div className="flex items-center justify-center gap-2 mt-8 text-muted-foreground">
              <Camera className="w-5 h-5" />
              <span>Professional guides • Premium gear • Post-processing workshops</span>
            </div>
          </div>
        </section>

        {/* Featured Categories */}
        <section className="py-16 bg-background">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center text-foreground mb-12">
              Photography Tour Categories
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
              {featuredCategories.map((category) => (
                <div
                  key={category.genre}
                  className="group relative overflow-hidden rounded-xl bg-card border border-border hover:shadow-lg transition-all duration-300 cursor-pointer"
                  onClick={() => setFilters(prev => ({ ...prev, genre: category.genre }))}
                >
                  <div className="aspect-[4/3] relative overflow-hidden">
                    <img
                      src={category.image}
                      alt={category.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute bottom-4 left-4 text-white">
                      <div className="flex items-center gap-2 mb-2">
                        {category.icon}
                        <h3 className="font-semibold">{category.title}</h3>
                      </div>
                      <p className="text-sm text-white/90">{category.description}</p>
                    </div>
                  </div>
                  <div className="p-4">
                    <button className="w-full bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90 transition-colors">
                      Explore Tours
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Filters and Tours */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="flex items-center gap-2 mb-8">
              <Filter className="w-5 h-5 text-muted-foreground" />
              <h2 className="text-2xl font-bold text-foreground">Filter Photography Tours</h2>
            </div>
            
            <PhotographyFilters filters={filters} onFiltersChange={setFilters} />

            {/* Tours Grid */}
            <div className="mt-12">
              {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="animate-pulse">
                      <div className="bg-muted rounded-xl h-96"></div>
                    </div>
                  ))}
                </div>
              ) : tours && tours.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {tours.map((tour) => (
                    <PhotographyTourCard key={tour.id} tour={tour} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Camera className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-foreground mb-2">No tours found</h3>
                  <p className="text-muted-foreground">Try adjusting your filters to see more results.</p>
                </div>
              )}
            </div>
          </div>
        </section>
      </main>
    </>
  )
}

export default PhotographyTours