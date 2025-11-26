import { useParams } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { MapPin, Clock, Users, Leaf, TreePine, Heart, Star, CheckCircle, Calendar, DollarSign } from 'lucide-react'
import { useEcoTour, useEcoAccommodations } from '@/hooks/useEcoTours'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import EcoBookingWidget from '@/components/ecotourism/EcoBookingWidget'
import SustainabilityMetrics from '@/components/ecotourism/SustainabilityMetrics'
import CommunitySpotlight from '@/components/ecotourism/CommunitySpotlight'
import InteractiveEcoMap from '@/components/ecotourism/InteractiveEcoMap'

const EcoTourDetail = () => {
  const { slug } = useParams<{ slug: string }>()
  const { data: tour, isLoading: tourLoading } = useEcoTour(slug!)
  const { data: accommodations } = useEcoAccommodations(tour?.location)

  if (tourLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary" />
      </div>
    )
  }

  if (!tour) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Tour not found</h1>
          <p className="text-muted-foreground">The eco tour you're looking for doesn't exist.</p>
        </div>
      </div>
    )
  }

  const categoryLabels = {
    wildlife_conservation: 'Wildlife Conservation',
    agro_tourism: 'Agro-Tourism',
    community_homestays: 'Community Homestays',
    marine_protection: 'Marine Protection',
    forest_treks: 'Forest Treks'
  }

  return (
    <>
      <Helmet>
        <title>{tour.name} - Eco Tour Sri Lanka | Recharge Travels</title>
        <meta name="description" content={tour.description.substring(0, 160)} />
        <meta name="keywords" content={`${tour.name}, eco tourism Sri Lanka, ${categoryLabels[tour.category]}, sustainable travel, ${tour.location}`} />
        <link rel="canonical" href={`https://rechargetravels.com/tours/ecotourism/${tour.slug}`} />
        
        {/* JSON-LD Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "TouristTrip",
            "name": tour.name,
            "description": tour.description,
            "provider": {
              "@type": "Organization",
              "name": "Recharge Travels"
            },
            "offers": {
              "@type": "Offer",
              "price": tour.price_per_person,
              "priceCurrency": tour.currency,
              "availability": "InStock"
            },
            "duration": `P${tour.duration_days}D`,
            "location": {
              "@type": "Place",
              "name": tour.location
            }
          })}
        </script>
      </Helmet>

      <main>
        {/* Hero Gallery */}
        <section className="relative h-[60vh] overflow-hidden">
          <img 
            src={tour.hero_image_url || "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1200&h=600&fit=crop"} 
            alt={tour.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
          
          <div className="absolute bottom-8 left-8 text-white">
            <Badge className="mb-3 bg-white/20 text-white border-white/20">
              {categoryLabels[tour.category]}
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-2">{tour.name}</h1>
            <div className="flex items-center space-x-4 text-lg">
              <div className="flex items-center">
                <MapPin className="w-5 h-5 mr-2" />
                {tour.location}
              </div>
              <div className="flex items-center">
                <Clock className="w-5 h-5 mr-2" />
                {tour.duration_text}
              </div>
              <div className="flex items-center">
                <Users className="w-5 h-5 mr-2" />
                Max {tour.group_size_max}
              </div>
            </div>
          </div>
        </section>

        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Overview & Impact */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Leaf className="w-5 h-5 mr-2 text-green-600" />
                    Overview & Environmental Impact
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-lg leading-relaxed">{tour.description}</p>
                  
                  {tour.environmental_goals && (
                    <div className="p-4 bg-green-50 rounded-lg">
                      <h4 className="font-semibold text-green-800 mb-2">Environmental Goals</h4>
                      <p className="text-green-700">{tour.environmental_goals}</p>
                    </div>
                  )}

                  <SustainabilityMetrics 
                    carbonOffset={tour.carbon_offset_kg}
                    treesPlanted={tour.trees_planted_per_booking}
                    communityFund={tour.community_fund_percentage}
                    impactMetrics={tour.impact_metrics}
                  />
                </CardContent>
              </Card>

              {/* Tabs for Details */}
              <Tabs defaultValue="inclusions" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="inclusions">Inclusions</TabsTrigger>
                  <TabsTrigger value="itinerary">Itinerary</TabsTrigger>
                  <TabsTrigger value="practices">Green Practices</TabsTrigger>
                  <TabsTrigger value="community">Community</TabsTrigger>
                </TabsList>

                <TabsContent value="inclusions" className="mt-6">
                  <Card>
                    <CardContent className="p-6">
                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <h4 className="font-semibold mb-3 flex items-center text-green-600">
                            <CheckCircle className="w-4 h-4 mr-2" />
                            What's Included
                          </h4>
                          <ul className="space-y-2">
                            {tour.inclusions.map((item, index) => (
                              <li key={index} className="flex items-start">
                                <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                                <span className="text-sm">{item}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                        
                        {tour.exclusions.length > 0 && (
                          <div>
                            <h4 className="font-semibold mb-3 text-red-600">What's Not Included</h4>
                            <ul className="space-y-2">
                              {tour.exclusions.map((item, index) => (
                                <li key={index} className="flex items-start">
                                  <span className="w-4 h-4 text-red-500 mr-2 mt-0.5">×</span>
                                  <span className="text-sm">{item}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="itinerary" className="mt-6">
                  <Card>
                    <CardContent className="p-6">
                      {tour.itinerary.length > 0 ? (
                        <div className="space-y-4">
                          {tour.itinerary.map((day, index) => (
                            <div key={index} className="border-l-2 border-primary/20 pl-4 pb-4">
                              <div className="flex items-center mb-2">
                                <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">
                                  {day.day}
                                </div>
                                <h4 className="font-semibold">{day.title}</h4>
                              </div>
                              <ul className="space-y-1 ml-11">
                                {day.activities.map((activity, actIndex) => (
                                  <li key={actIndex} className="text-sm text-muted-foreground">
                                    • {activity}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-muted-foreground">Detailed itinerary will be provided upon booking.</p>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="practices" className="mt-6">
                  <Card>
                    <CardContent className="p-6">
                      <div className="grid md:grid-cols-2 gap-6">
                        {tour.green_practices.map((practice, index) => (
                          <div key={index} className="flex items-start space-x-3">
                            <Leaf className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                            <div>
                              <span className="font-medium">{practice}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="community" className="mt-6">
                  <CommunitySpotlight partners={tour.community_partners} />
                </TabsContent>
              </Tabs>

              {/* Interactive Map */}
              {tour.latitude && tour.longitude && (
                <InteractiveEcoMap 
                  location={{
                    lat: tour.latitude,
                    lng: tour.longitude,
                    name: tour.location
                  }}
                  accommodations={accommodations}
                />
              )}

              {/* FAQ Section */}
              {tour.faq.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Frequently Asked Questions</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Accordion type="single" collapsible className="w-full">
                      {tour.faq.map((faq, index) => (
                        <AccordionItem key={index} value={`item-${index}`}>
                          <AccordionTrigger>{faq.question}</AccordionTrigger>
                          <AccordionContent>{faq.answer}</AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-8 space-y-6">
                <EcoBookingWidget tour={tour} accommodations={accommodations} />
                
                {/* Quick Tour Info */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Tour Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Duration</span>
                      <span className="font-medium">{tour.duration_text}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Group Size</span>
                      <span className="font-medium">{tour.group_size_min}-{tour.group_size_max} people</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Difficulty</span>
                      <span className="font-medium">{tour.difficulty_level || 'Moderate'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Best Season</span>
                      <span className="font-medium">{tour.best_season || 'Year-round'}</span>
                    </div>
                    <div className="flex justify-between items-center pt-2 border-t">
                      <span className="text-muted-foreground">Price</span>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-primary">${tour.price_per_person}</div>
                        <div className="text-xs text-muted-foreground">per person</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Special Requirements */}
                {tour.special_requirements && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Special Requirements</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">{tour.special_requirements}</p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}

export default EcoTourDetail