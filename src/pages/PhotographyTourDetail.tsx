import { useParams } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { MapPin, Clock, Users, Camera, Star, CheckCircle } from 'lucide-react'
import { usePhotographyTour } from '@/hooks/usePhotographyTours'
import PhotographyBookingWidget from '@/components/photography/PhotographyBookingWidget'
import SampleShotList from '@/components/photography/SampleShotList'
import PhotoLocationMap from '@/components/photography/PhotoLocationMap'
import GearRentalOptions from '@/components/photography/GearRentalOptions'

const PhotographyTourDetail = () => {
  const { slug } = useParams<{ slug: string }>()
  const { data: tour, isLoading } = usePhotographyTour(slug!)

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!tour) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-2">Tour not found</h1>
          <p className="text-muted-foreground">The photography tour you're looking for doesn't exist.</p>
        </div>
      </div>
    )
  }

  const genreDisplayName = {
    cultural_temples: 'Cultural & Temples',
    wildlife_nature: 'Wildlife & Nature', 
    scenic_trains: 'Scenic Train Journeys',
    street_local: 'Street & Local Life'
  }[tour.genre]

  const skillLevelDisplayName = {
    beginner: 'Beginner',
    intermediate: 'Intermediate',
    pro: 'Professional'
  }[tour.skill_level]

  const durationDisplayName = {
    half_day: 'Half Day',
    full_day: 'Full Day',
    multi_day: 'Multi Day'
  }[tour.duration_type]

  return (
    <>
      <Helmet>
        <title>{tour.seo_title || tour.title} | Recharge Travels</title>
        <meta name="description" content={tour.seo_description || tour.description} />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "TouristTrip",
            "name": tour.title,
            "description": tour.description,
            "image": tour.hero_image_url,
            "offers": {
              "@type": "Offer",
              "price": tour.price_standard,
              "priceCurrency": tour.currency,
              "availability": "https://schema.org/InStock"
            },
            "provider": {
              "@type": "Organization",
              "name": "Recharge Travels"
            }
          })}
        </script>
      </Helmet>

      <main className="min-h-screen pt-20">
        {/* Hero Gallery */}
        <section className="relative h-[60vh] overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-3 h-full gap-1">
            <div className="md:col-span-2 relative">
              <img
                src={tour.hero_image_url || 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=1200&h=600&fit=crop'}
                alt={tour.title}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="hidden md:grid grid-rows-2 gap-1">
              {tour.gallery_images && Array.isArray(tour.gallery_images) && tour.gallery_images.slice(0, 2).map((image, index) => (
                <div key={index} className="relative overflow-hidden">
                  <img
                    src={typeof image === 'string' ? image : 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop'}
                    alt={`Gallery ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
          <div className="absolute bottom-8 left-8 text-white">
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-medium">
                {genreDisplayName}
              </span>
              <span className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-sm">
                {skillLevelDisplayName}
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">{tour.title}</h1>
            <div className="flex items-center gap-6 text-white/90">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                <span>{tour.location}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>{durationDisplayName} ({tour.duration_hours}h)</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                <span>{tour.min_participants}-{tour.max_participants} people</span>
              </div>
            </div>
          </div>
        </section>

        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-12">
              {/* Overview */}
              <section>
                <h2 className="text-3xl font-bold text-foreground mb-6">Tour Overview</h2>
                <p className="text-lg text-muted-foreground mb-4">{tour.description}</p>
                <div className="prose prose-gray max-w-none">
                  <p>{tour.detailed_description}</p>
                </div>
              </section>

              {/* Inclusions */}
              <section>
                <h2 className="text-3xl font-bold text-foreground mb-6">What's Included</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {tour.inclusions && Array.isArray(tour.inclusions) && tour.inclusions.map((inclusion, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                      <span className="text-muted-foreground">{inclusion}</span>
                    </div>
                  ))}
                </div>
              </section>

              {/* Gear Rental */}
              {tour.gear_rental_available && (
                <section>
                  <h2 className="text-3xl font-bold text-foreground mb-6">Camera Gear Rental</h2>
                  <GearRentalOptions gearOptions={tour.gear_options} />
                </section>
              )}

              {/* Sample Shots */}
              <section>
                <h2 className="text-3xl font-bold text-foreground mb-6">Expected Shots</h2>
                <SampleShotList sampleShots={tour.sample_shots} />
              </section>

              {/* Photography Tips */}
              {tour.photography_tips && (
                <section>
                  <h2 className="text-3xl font-bold text-foreground mb-6">Photography Tips</h2>
                  <div className="bg-blue-50 border-l-4 border-blue-400 p-6 rounded-r-lg">
                    <div className="flex items-start">
                      <Camera className="w-6 h-6 text-blue-400 mr-3 mt-1 flex-shrink-0" />
                      <div>
                        <h3 className="text-lg font-semibold text-blue-900 mb-2">Pro Tips</h3>
                        <p className="text-blue-800">{tour.photography_tips}</p>
                      </div>
                    </div>
                  </div>
                </section>
              )}

              {/* Regulations */}
              {tour.regulations && (
                <section>
                  <h2 className="text-3xl font-bold text-foreground mb-6">Regulations & Requirements</h2>
                  <div className="bg-amber-50 border-l-4 border-amber-400 p-6 rounded-r-lg">
                    <p className="text-amber-800">{tour.regulations}</p>
                  </div>
                </section>
              )}

              {/* Best Times */}
              {tour.best_times && (
                <section>
                  <h2 className="text-3xl font-bold text-foreground mb-6">Best Times to Shoot</h2>
                  <div className="bg-green-50 border-l-4 border-green-400 p-6 rounded-r-lg">
                    <p className="text-green-800">{tour.best_times}</p>
                  </div>
                </section>
              )}

              {/* Location Map */}
              <section>
                <h2 className="text-3xl font-bold text-foreground mb-6">Photo Locations</h2>
                <PhotoLocationMap 
                  locations={tour.photo_locations}
                  meetingPoint={{ 
                    name: tour.meeting_point || tour.location,
                    lat: tour.latitude || 0,
                    lng: tour.longitude || 0
                  }}
                />
              </section>

              {/* FAQ */}
              <section>
                <h2 className="text-3xl font-bold text-foreground mb-6">Frequently Asked Questions</h2>
                <div className="space-y-4">
                  <div className="border border-border rounded-lg p-6">
                    <h3 className="font-semibold text-foreground mb-2">Do you provide camera gear?</h3>
                    <p className="text-muted-foreground">
                      Yes, we offer professional camera and lens rental for all skill levels. 
                      Check our gear rental options above for available equipment and pricing.
                    </p>
                  </div>
                  <div className="border border-border rounded-lg p-6">
                    <h3 className="font-semibold text-foreground mb-2">Can I bring my own equipment?</h3>
                    <p className="text-muted-foreground">
                      Absolutely! You're welcome to bring your own camera gear. Our guides will help you 
                      optimize your settings for the best shots regardless of your equipment.
                    </p>
                  </div>
                  <div className="border border-border rounded-lg p-6">
                    <h3 className="font-semibold text-foreground mb-2">What if the weather is bad?</h3>
                    <p className="text-muted-foreground">
                      We monitor weather conditions closely and will reschedule if necessary. 
                      Sometimes overcast conditions can create unique photography opportunities!
                    </p>
                  </div>
                </div>
              </section>
            </div>

            {/* Booking Widget */}
            <div className="lg:col-span-1">
              <div className="sticky top-24">
                <PhotographyBookingWidget tour={tour} />
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}

export default PhotographyTourDetail