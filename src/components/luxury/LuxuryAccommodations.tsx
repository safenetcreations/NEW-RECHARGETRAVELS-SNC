
import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Building2, MapPin, Users, Wifi, Car, Utensils, Waves, 
  Mountain, TreePine, Crown, Star, ArrowRight, Eye, Bed
} from 'lucide-react'

const LuxuryAccommodations = () => {
  const [selectedProperty, setSelectedProperty] = useState<string>('')

  const luxuryProperties = [
    {
      id: 'oceanfront-estate',
      name: 'Royal Oceanfront Estate',
      location: 'Galle - Private Beach',
      type: '7-Star Private Villa',
      bedrooms: 12,
      guests: 24,
      pricePerNight: 15000,
      image: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&h=600&fit=crop',
      features: [
        'Private 2km beach frontage',
        '15-person dedicated staff',
        'Helicopter landing pad',
        'Private yacht berth',
        'Michelin-starred chef',
        'Security detail included',
        'Spa and wellness center',
        'Private temple access'
      ],
      amenities: ['Private Beach', 'Helicopter Pad', 'Yacht Berth', 'Full Staff', 'Security', 'Spa Center'],
      description: 'Colonial mansion transformed into the ultimate luxury retreat with unparalleled ocean views and complete privacy.'
    },
    {
      id: 'mountain-sanctuary',
      name: 'Himalayan Cloud Sanctuary',
      location: 'Ella - Mountain Peak',
      type: '7-Star Mountain Estate',
      bedrooms: 8,
      guests: 16,
      pricePerNight: 12000,
      image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop',
      features: [
        '360° panoramic mountain views',
        'Private cloud forest reserve',
        'Traditional royal architecture',
        'Dedicated butler service',
        'Private meditation pavilions',
        'Infinity pools on multiple levels',
        'Helicopter access only',
        'Personal yoga instructor'
      ],
      amenities: ['Cloud Forest', 'Infinity Pools', 'Helicopter Access', 'Butler Service', 'Yoga Studio', 'Meditation Pavilions'],
      description: 'Elevated sanctuary among the clouds offering complete serenity and breathtaking views of Sri Lanka\'s central highlands.'
    },
    {
      id: 'royal-palace',
      name: 'Ancient Royal Palace Suite',
      location: 'Kandy - Sacred City',
      type: 'Historic Royal Residence',
      bedrooms: 6,
      guests: 12,
      pricePerNight: 18000,
      image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&h=600&fit=crop',
      features: [
        'Authentic royal palace architecture',
        'Sacred temple within grounds',
        'Historical significance & heritage',
        'Royal ceremony experiences',
        'Traditional dance performances',
        'Royal chef preparing ancient recipes',
        'Exclusive access to sacred sites',
        'Personal historian guide'
      ],
      amenities: ['Sacred Temple', 'Royal Ceremonies', 'Historic Significance', 'Cultural Performances', 'Royal Chef', 'Historian Guide'],
      description: 'Live like royalty in an authentic palace where ancient Sri Lankan kings once resided, complete with sacred temple access.'
    },
    {
      id: 'tree-house-luxury',
      name: 'Canopy Tree House Collection',
      location: 'Sinharaja - Rainforest',
      type: '7-Star Eco-Luxury Resort',
      bedrooms: 10,
      guests: 20,
      pricePerNight: 10000,
      image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=600&fit=crop',
      features: [
        'Suspended luxury tree houses',
        'UNESCO rainforest location',
        'Endemic wildlife encounters',
        'Canopy walkways and bridges',
        'Zero-impact eco luxury',
        'Expert naturalist guides',
        'Organic farm-to-table cuisine',
        'Private research expeditions'
      ],
      amenities: ['Canopy Walkways', 'Wildlife Encounters', 'Eco-Luxury', 'Expert Guides', 'Organic Cuisine', 'Research Access'],
      description: 'The world\'s most luxurious tree house experience in Sri Lanka\'s last remaining rainforest with unprecedented access to endemic wildlife.'
    },
    {
      id: 'private-island',
      name: 'Exclusive Private Island Resort',
      location: 'Southern Coast - Private Island',
      type: '7-Star Island Resort',
      bedrooms: 15,
      guests: 30,
      pricePerNight: 25000,
      image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&h=600&fit=crop',
      features: [
        'Complete island buyout available',
        'Multiple villa accommodations',
        'Private coral reef and diving',
        'Seaplane and yacht access',
        'Marine biologist on staff',
        'World-class spa treatments',
        'Private beach club',
        'Underwater restaurant option'
      ],
      amenities: ['Island Buyout', 'Coral Reef', 'Seaplane Access', 'Marine Biologist', 'Underwater Restaurant', 'Beach Club'],
      description: 'Your own private tropical island paradise with world-class amenities and complete seclusion in the Indian Ocean.'
    },
    {
      id: 'safari-lodge',
      name: 'Royal Safari Lodge & Spa',
      location: 'Yala - Private Concession',
      type: '7-Star Safari Lodge',
      bedrooms: 8,
      guests: 16,
      pricePerNight: 8000,
      image: 'https://images.unsplash.com/photo-1549366021-9f761d040a94?w=800&h=600&fit=crop',
      features: [
        'Private wildlife concession',
        'Guaranteed leopard encounters',
        'Expert wildlife photographers',
        'Luxury safari vehicles',
        'Elevated viewing platforms',
        'Night safari experiences',
        'Wildlife conservation participation',
        'Veterinary team access'
      ],
      amenities: ['Private Concession', 'Leopard Encounters', 'Photography Team', 'Night Safaris', 'Conservation Access', 'Vet Team'],
      description: 'The ultimate safari experience with guaranteed leopard sightings and exclusive access to protected wildlife areas.'
    }
  ]

  const handleViewProperty = (propertyId: string) => {
    setSelectedProperty(propertyId)
    // In a real app, this would open a detailed view or booking modal
  }

  return (
    <section className="py-32 bg-gradient-to-b from-slate-50 to-white">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-20">
          <Badge className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-semibold px-6 py-2 mb-6">
            <Building2 className="w-4 h-4 mr-2" />
            7-Star Villa Collection
          </Badge>
          <h2 className="text-6xl md:text-7xl font-bold text-navy mb-8 font-playfair">
            Extraordinary Estates
          </h2>
          <p className="text-2xl text-slate-600 max-w-4xl mx-auto leading-relaxed">
            Each property in our collection represents the pinnacle of luxury accommodation, 
            offering unparalleled privacy, service, and exclusive access to Sri Lanka's most extraordinary locations.
          </p>
        </div>

        {/* Property Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-7xl mx-auto">
          {luxuryProperties.map((property) => (
            <Card 
              key={property.id}
              className="overflow-hidden hover:shadow-2xl transition-all duration-500 hover:scale-105 cursor-pointer bg-white border-0 shadow-xl"
              onClick={() => handleViewProperty(property.id)}
            >
              {/* Property Image */}
              <div className="relative h-80 overflow-hidden">
                <img
                  src={property.image}
                  alt={property.name}
                  className="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute top-4 left-4">
                  <Badge className="bg-gradient-to-r from-gold to-amber-500 text-navy font-semibold">
                    {property.type}
                  </Badge>
                </div>
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 flex items-center space-x-1">
                  <Star className="w-4 h-4 fill-gold text-gold" />
                  <span className="text-sm font-bold">7★</span>
                </div>
                <div className="absolute bottom-4 left-4 text-white">
                  <div className="text-3xl font-bold">${property.pricePerNight.toLocaleString()}</div>
                  <div className="text-sm opacity-80">per night</div>
                </div>
              </div>

              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-2xl font-bold text-navy mb-2 font-playfair">
                      {property.name}
                    </CardTitle>
                    <CardDescription className="flex items-center text-slate-600 mb-2">
                      <MapPin className="w-4 h-4 mr-1" />
                      {property.location}
                    </CardDescription>
                  </div>
                  <Crown className="w-8 h-8 text-gold" />
                </div>

                {/* Property Stats */}
                <div className="flex items-center space-x-6 text-sm text-slate-600 mt-4">
                  <div className="flex items-center space-x-1">
                    <Bed className="w-4 h-4" />
                    <span>{property.bedrooms} Bedrooms</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Users className="w-4 h-4" />
                    <span>Up to {property.guests} Guests</span>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-6">
                {/* Description */}
                <p className="text-slate-600 leading-relaxed">
                  {property.description}
                </p>

                {/* Key Features */}
                <div className="space-y-3">
                  <h4 className="font-semibold text-navy">Exclusive Features:</h4>
                  <div className="grid grid-cols-1 gap-2">
                    {property.features.slice(0, 4).map((feature, idx) => (
                      <div key={idx} className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-gold rounded-full"></div>
                        <span className="text-sm text-slate-600">{feature}</span>
                      </div>
                    ))}
                    {property.features.length > 4 && (
                      <div className="text-sm text-gold font-medium">
                        +{property.features.length - 4} more exclusive amenities
                      </div>
                    )}
                  </div>
                </div>

                {/* Amenities Tags */}
                <div className="space-y-3">
                  <h4 className="font-semibold text-navy">Premium Amenities:</h4>
                  <div className="flex flex-wrap gap-2">
                    {property.amenities.map((amenity, idx) => (
                      <Badge 
                        key={idx}
                        variant="outline" 
                        className="border-gold/30 text-slate-600 hover:bg-gold/10"
                      >
                        {amenity}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-4 pt-4">
                  <Button 
                    className="flex-1 bg-gradient-to-r from-gold to-amber-500 text-navy font-semibold hover:shadow-xl transition-all duration-300"
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    View Property
                  </Button>
                  <Button 
                    variant="outline"
                    className="flex-1 border-gold text-gold hover:bg-gold hover:text-navy transition-all duration-300"
                  >
                    Check Availability
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Property Services */}
        <div className="mt-20 bg-gradient-to-r from-navy to-slate-800 rounded-3xl p-12 text-white">
          <div className="text-center mb-12">
            <h3 className="text-4xl font-bold mb-4 font-playfair">Included with Every Property</h3>
            <p className="text-xl opacity-90 max-w-3xl mx-auto">
              Our 7-star service standards ensure every aspect of your stay exceeds expectations
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-gold to-amber-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-navy" />
              </div>
              <h4 className="font-semibold mb-2">Dedicated Staff</h4>
              <p className="text-sm opacity-80">Personal butler, chef, housekeeping, and concierge services</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-gold to-amber-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Car className="w-8 h-8 text-navy" />
              </div>
              <h4 className="font-semibold mb-2">Luxury Transport</h4>
              <p className="text-sm opacity-80">Fleet of luxury vehicles with professional chauffeurs</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-gold to-amber-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Utensils className="w-8 h-8 text-navy" />
              </div>
              <h4 className="font-semibold mb-2">Gourmet Cuisine</h4>
              <p className="text-sm opacity-80">Personal chef creating bespoke culinary experiences</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-gold to-amber-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Crown className="w-8 h-8 text-navy" />
              </div>
              <h4 className="font-semibold mb-2">VIP Services</h4>
              <p className="text-sm opacity-80">24/7 concierge, security, and exclusive access arrangements</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default LuxuryAccommodations
