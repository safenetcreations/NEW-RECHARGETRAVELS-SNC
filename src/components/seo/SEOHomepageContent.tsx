
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Clock, Star, Users, Compass, Camera, Leaf, Mountain } from 'lucide-react';

const SEOHomepageContent = () => {
  const sriLankaHighlights = [
    {
      icon: <Mountain className="h-6 w-6" />,
      title: "Ancient Heritage Sites",
      description: "Explore 8 UNESCO World Heritage Sites including Sigiriya Rock Fortress, Ancient City of Polonnaruwa, and Sacred City of Kandy",
      keywords: "UNESCO sites, Sigiriya, Polonnaruwa, Kandy, ancient temples, cultural heritage"
    },
    {
      icon: <Leaf className="h-6 w-6" />,
      title: "Wildlife & National Parks", 
      description: "Encounter Asian elephants, leopards, and diverse wildlife in Yala, Udawalawe, and Wilpattu National Parks",
      keywords: "wildlife safari, Yala National Park, elephants, leopards, bird watching"
    },
    {
      icon: <Camera className="h-6 w-6" />,
      title: "Pristine Beaches",
      description: "Relax on golden beaches of Mirissa, Unawatuna, and Bentota with perfect conditions for surfing and diving",
      keywords: "Sri Lanka beaches, Mirissa, Unawatuna, surfing, diving, water sports"
    },
    {
      icon: <Compass className="h-6 w-6" />,
      title: "Tea Plantations",
      description: "Journey through emerald tea estates in Nuwara Eliya and Ella, experiencing Ceylon tea culture firsthand",
      keywords: "Ceylon tea, Nuwara Eliya, Ella, tea plantations, hill country"
    }
  ];

  const popularDestinations = [
    {
      name: "Colombo",
      type: "Capital City",
      description: "Modern metropolis blending colonial architecture with contemporary Sri Lankan culture",
      attractions: ["Gangaramaya Temple", "Independence Square", "Pettah Market", "Galle Face Green"]
    },
    {
      name: "Kandy",
      type: "Cultural Capital", 
      description: "Sacred city home to the Temple of the Sacred Tooth Relic and traditional Kandyan culture",
      attractions: ["Temple of Tooth", "Royal Botanical Gardens", "Kandy Lake", "Cultural Dance Shows"]
    },
    {
      name: "Galle",
      type: "Historic Port City",
      description: "Colonial fort city with Dutch architecture and stunning coastal views",
      attractions: ["Galle Fort", "Dutch Reformed Church", "Maritime Museum", "Lighthouse"]  
    },
    {
      name: "Sigiriya",
      type: "Ancient Rock Fortress",
      description: "5th-century rock fortress with ancient frescoes and advanced hydraulic systems",
      attractions: ["Lion Rock", "Ancient Frescoes", "Water Gardens", "Summit Palace"]
    }
  ];

  const travelSeasons = [
    {
      season: "December to March",
      title: "Peak Season - West & South Coast",
      weather: "Dry, sunny weather perfect for beaches and cultural sites",
      destinations: ["Colombo", "Galle", "Mirissa", "Kandy", "Sigiriya"],
      activities: ["Beach holidays", "Wildlife safaris", "Cultural tours", "Water sports"]
    },
    {
      season: "April to September", 
      title: "East Coast Season",
      weather: "Ideal conditions for east coast beaches and hill country",
      destinations: ["Trincomalee", "Batticaloa", "Nuwara Eliya", "Ella"],
      activities: ["Hill country tours", "Tea plantation visits", "East coast beaches", "Hiking"]
    }
  ];

  const culturalExperiences = [
    "Traditional Kandyan dance performances and fire shows",
    "Buddhist temple visits and meditation experiences", 
    "Ayurvedic spa treatments and wellness retreats",
    "Cooking classes featuring authentic Sri Lankan cuisine",
    "Tea factory tours and tasting sessions",
    "Local craft workshops - batik, wood carving, gem cutting",
    "Festival celebrations - Esala Perahera, Vesak, Thai Pusam"
  ];

  return (
    <div className="bg-soft-beige">
      {/* Hero Content Section */}
      <section className="py-16 bg-gradient-to-br from-teal-50 to-blue-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-granite-gray mb-6">
              Discover Sri Lanka: The Pearl of the Indian Ocean
            </h1>
            <p className="text-lg md:text-xl text-granite-gray/80 mb-8 leading-relaxed">
              Embark on an extraordinary journey through Sri Lanka's diverse landscapes, ancient heritage, 
              and vibrant culture. From misty mountains and lush tea plantations to pristine beaches and 
              wildlife-rich national parks, experience the magic of this tropical paradise with our expert 
              local guides and customized travel experiences.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="text-center">
                <div className="text-2xl font-bold text-teal-600">2,500+</div>
                <div className="text-sm text-gray-600">Years of History</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-teal-600">26</div>
                <div className="text-sm text-gray-600">National Parks</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-teal-600">8</div>
                <div className="text-sm text-gray-600">UNESCO Sites</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-teal-600">1,300+</div>
                <div className="text-sm text-gray-600">Kilometers Coastline</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Sri Lanka Highlights */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-granite-gray mb-12">
            Why Choose Sri Lanka for Your Next Adventure?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {sriLankaHighlights.map((highlight, index) => (
              <Card key={index} className="h-full hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 bg-teal-100 rounded-lg text-teal-600">
                      {highlight.icon}
                    </div>
                    <CardTitle className="text-lg">{highlight.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">{highlight.description}</p>
                  <div className="text-xs text-gray-500 italic">
                    Keywords: {highlight.keywords}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Destinations */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-granite-gray mb-4">
            Top Sri Lanka Destinations to Explore
          </h2>
          <p className="text-center text-gray-600 mb-12 max-w-3xl mx-auto">
            From bustling cities to ancient ruins, pristine beaches to misty mountains, 
            Sri Lanka offers incredible diversity in a compact island nation. Explore our 
            most popular destinations and start planning your perfect Sri Lankan adventure.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {popularDestinations.map((destination, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-xl text-granite-gray">{destination.name}</CardTitle>
                      <Badge variant="secondary" className="mt-2">{destination.type}</Badge>
                    </div>
                    <MapPin className="h-5 w-5 text-teal-600" />
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">{destination.description}</p>
                  <div>
                    <h4 className="font-semibold text-sm text-granite-gray mb-2">Must-Visit Attractions:</h4>
                    <div className="flex flex-wrap gap-1">
                      {destination.attractions.map((attraction, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs">
                          {attraction}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Best Time to Visit */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-granite-gray mb-4">
            When to Visit Sri Lanka: Complete Seasonal Guide
          </h2>
          <p className="text-center text-gray-600 mb-12 max-w-3xl mx-auto">
            Sri Lanka's tropical climate offers year-round travel opportunities with two distinct 
            monsoon seasons affecting different regions. Plan your visit based on your preferred 
            destinations and activities for the best experience.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {travelSeasons.map((season, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <Clock className="h-6 w-6 text-teal-600" />
                    <div>
                      <CardTitle className="text-lg">{season.title}</CardTitle>
                      <p className="text-sm text-gray-500">{season.season}</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">{season.weather}</p>
                  <div className="mb-4">
                    <h4 className="font-semibold text-sm mb-2">Best Destinations:</h4>
                    <div className="flex flex-wrap gap-1 mb-3">
                      {season.destinations.map((dest, idx) => (
                        <Badge key={idx} variant="secondary" className="text-xs">
                          {dest}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm mb-2">Recommended Activities:</h4>
                    <div className="flex flex-wrap gap-1">
                      {season.activities.map((activity, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs">
                          {activity}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Cultural Experiences */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-granite-gray mb-4">
            Authentic Sri Lankan Cultural Experiences
          </h2>
          <p className="text-center text-gray-600 mb-12 max-w-3xl mx-auto">
            Immerse yourself in Sri Lanka's rich cultural heritage spanning over 2,500 years. 
            From ancient Buddhist traditions to colonial influences, experience the authentic 
            spirit of Sri Lankan culture through these unique activities and encounters.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {culturalExperiences.map((experience, index) => (
              <Card key={index} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <Star className="h-5 w-5 text-teal-600 mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-gray-700">{experience}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Travel Tips Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-granite-gray mb-12">
            Essential Sri Lanka Travel Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-teal-600" />
                  Visa & Entry Requirements
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="text-sm space-y-2 text-gray-600">
                  <li>• Electronic Travel Authorization (ETA) required for most countries</li>
                  <li>• Valid passport with 6+ months validity</li>
                  <li>• Tourist visa valid for 30 days (extendable)</li>
                  <li>• Proof of return ticket and accommodation</li>
                  <li>• Yellow fever vaccination required if arriving from infected areas</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-teal-600" />
                  Getting Around Sri Lanka
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="text-sm space-y-2 text-gray-600">
                  <li>• Private car with driver (most comfortable option)</li>
                  <li>• Train travel for scenic routes (hill country)</li>
                  <li>• Bus travel for budget-friendly local experience</li>
                  <li>• Tuk-tuks for short distances in cities</li>
                  <li>• Domestic flights for quick long-distance travel</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="h-5 w-5 text-teal-600" />
                  Local Customs & Etiquette
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="text-sm space-y-2 text-gray-600">
                  <li>• Dress modestly when visiting temples</li>
                  <li>• Remove shoes before entering religious sites</li>
                  <li>• Don't point feet toward Buddha statues</li>
                  <li>• Photography restrictions at some temples</li>
                  <li>• Bargaining is common in markets and with tuk-tuk drivers</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
};

export default SEOHomepageContent;
