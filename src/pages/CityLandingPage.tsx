import React, { useState } from 'react'
import { useParams } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { MapPin, Star, Clock, Phone, Globe, Calendar, Users, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { APIProvider, Map, Marker } from '@vis.gl/react-google-maps'
import { useCityData } from '@/hooks/useCityData'
import LoadingSpinner from '@/components/LoadingSpinner'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import CityBookingWidget from '@/components/destinations/CityBookingWidget'

const CityLandingPage = () => {
  const { citySlug } = useParams<{ citySlug: string }>()
  const [selectedCategory, setSelectedCategory] = useState('all')
  const { data: cityData, isLoading, error } = useCityData(citySlug!)
  
  const city = cityData?.city
  const experiences = cityData?.experiences || []
  const accommodations = cityData?.accommodations || []
  const insights = cityData?.insights || []

  if (isLoading) {
    return <LoadingSpinner fullScreen message="Loading city information..." />
  }

  if (error || !city) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">City Not Found</h1>
          <p className="text-gray-600 mb-6">The city you're looking for doesn't exist or isn't available yet.</p>
          <Button onClick={() => window.location.href = '/destinations'}>
            Back to Destinations
          </Button>
        </div>
      </div>
    )
  }

  const restaurants = experiences?.filter(exp => exp.category === 'restaurant') || []
  const activities = experiences?.filter(exp => exp.category === 'activity') || []
  const entertainment = experiences?.filter(exp => exp.category === 'entertainment' || exp.category === 'nightlife') || []

  const cityCenter = {
    lat: city.latitude || 6.9271,
    lng: city.longitude || 79.8612
  }

  const renderExperienceCard = (experience: any) => (
    <Card key={experience.id} className="group hover:shadow-lg transition-all duration-300">
      <div className="relative h-48 overflow-hidden rounded-t-lg">
        {experience.images && experience.images.length > 0 ? (
          <img
            src={experience.images[0]}
            alt={experience.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
            <MapPin className="h-12 w-12 text-primary/60" />
          </div>
        )}
        <div className="absolute top-3 right-3">
          <Badge className="bg-primary text-white">
            ${experience.price_per_person || 'Contact'}
          </Badge>
        </div>
        {experience.rating > 0 && (
          <div className="absolute top-3 left-3 flex items-center space-x-1 bg-white/90 rounded-full px-2 py-1">
            <Star className="h-3 w-3 text-yellow-500 fill-current" />
            <span className="text-xs font-semibold">{experience.rating}</span>
          </div>
        )}
      </div>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg group-hover:text-primary transition-colors">
          {experience.name}
        </CardTitle>
        {experience.location_name && (
          <div className="flex items-center text-sm text-muted-foreground">
            <MapPin className="h-3 w-3 mr-1" />
            {experience.location_name}
          </div>
        )}
      </CardHeader>
      <CardContent className="pt-0">
        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
          {experience.description}
        </p>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4 text-xs text-muted-foreground">
            {experience.duration && (
              <div className="flex items-center">
                <Clock className="h-3 w-3 mr-1" />
                {experience.duration}
              </div>
            )}
            {experience.price_level && (
              <div className="flex">
                {'$'.repeat(experience.price_level)}
              </div>
            )}
          </div>
          <Button size="sm" className="ml-auto">
            Book Now
            <ArrowRight className="h-3 w-3 ml-1" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )

  return (
    <>
      <Helmet>
        <title>Discover {city.name} – Restaurants, Activities & Bookings | Recharge Travels</title>
        <meta name="description" content={`Explore ${city.name}, Sri Lanka. Book restaurants, activities, hotels and experiences. Discover the best of ${city.name} with insider tips and local recommendations.`} />
        <meta property="og:title" content={`Discover ${city.name} – Restaurants, Activities & Bookings | Recharge Travels`} />
        <meta property="og:description" content={`Explore ${city.name}, Sri Lanka. Book restaurants, activities, hotels and experiences.`} />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "TouristAttraction",
            "name": city.name,
            "address": {
              "@type": "PostalAddress",
              "addressCountry": "LK",
              "addressLocality": city.name
            },
            "geo": {
              "@type": "GeoCoordinates",
              "latitude": city.latitude,
              "longitude": city.longitude
            }
          })}
        </script>
      </Helmet>

      <Header />

      {/* Hero Section */}
      <section className="relative h-[60vh] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/90 to-secondary/90 z-10"></div>
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200')] bg-cover bg-center"></div>
        <div className="relative z-20 h-full flex items-center justify-center text-center text-white">
          <div className="max-w-4xl mx-auto px-4">
            <h1 className="text-5xl md:text-6xl font-bold mb-4">{city.name}</h1>
            <p className="text-xl mb-6">
              Discover amazing restaurants, activities & experiences in {city.name}
            </p>
            <div className="flex items-center justify-center space-x-6 text-sm">
              <div className="flex items-center">
                <MapPin className="h-4 w-4 mr-1" />
                {city.country}
              </div>
              <div className="flex items-center">
                <Users className="h-4 w-4 mr-1" />
                Population: 750,000+
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3 space-y-12">
            {/* Interactive Map */}
            <section>
              <h2 className="text-3xl font-bold mb-6">Explore {city.name}</h2>
              <div className="h-96 rounded-lg overflow-hidden shadow-lg">
                <APIProvider apiKey="AIzaSyBjjw7Zm7z_Z0VhZ2L1VhZ2L1VhZ2L1VhZ">
                  <Map
                    defaultCenter={cityCenter}
                    defaultZoom={13}
                    mapId="city-map"
                  >
                    <Marker position={cityCenter} />
                    {experiences?.map((exp, index) => 
                      exp.latitude && exp.longitude && (
                        <Marker
                          key={index}
                          position={{ lat: exp.latitude, lng: exp.longitude }}
                        />
                      )
                    )}
                  </Map>
                </APIProvider>
              </div>
            </section>

            {/* Restaurants Section */}
            <section>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-3xl font-bold">Top Restaurants</h2>
                <Button variant="outline">View All</Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {restaurants.slice(0, 6).map(renderExperienceCard)}
              </div>
            </section>

            {/* Activities Section */}
            <section>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-3xl font-bold">Activities & Experiences</h2>
                <Button variant="outline">View All</Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {activities.slice(0, 6).map(renderExperienceCard)}
              </div>
            </section>

            {/* Entertainment Section */}
            <section>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-3xl font-bold">Entertainment & Nightlife</h2>
                <Button variant="outline">View All</Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {entertainment.slice(0, 4).map(renderExperienceCard)}
              </div>
            </section>

            {/* Accommodations Section */}
            <section>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-3xl font-bold">Where to Stay</h2>
                <Button variant="outline">View All</Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {accommodations?.slice(0, 3).map((accommodation: any) => (
                  <Card key={accommodation.id} className="group hover:shadow-lg transition-all duration-300">
                    <div className="relative h-48 overflow-hidden rounded-t-lg">
                      {accommodation.images && accommodation.images.length > 0 ? (
                        <img
                          src={accommodation.images[0]}
                          alt={accommodation.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                          <MapPin className="h-12 w-12 text-primary/60" />
                        </div>
                      )}
                      <Badge className="absolute top-3 right-3 capitalize">
                        {accommodation.type}
                      </Badge>
                    </div>
                    <CardHeader>
                      <CardTitle className="group-hover:text-primary transition-colors">
                        {accommodation.name}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                        {accommodation.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="text-lg font-semibold">
                          ${accommodation.price_per_night}/night
                        </div>
                        <Button size="sm">Check Availability</Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>

            {/* Local Insights */}
            <section>
              <h2 className="text-3xl font-bold mb-6">Local Insights</h2>
              <div className="space-y-4">
                {insights?.slice(0, 5).map((insight: any, index: number) => (
                  <Card key={index}>
                    <CardHeader>
                      <CardTitle className="text-lg">{insight.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground">{insight.content}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>
          </div>

          {/* Sidebar with Booking Widget */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <CityBookingWidget city={city} />
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  )
}

export default CityLandingPage