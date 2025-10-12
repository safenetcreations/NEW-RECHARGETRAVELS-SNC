
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Car, Plane, Ship, Users, Star, Crown, ArrowRight, 
  MapPin, Clock, Shield, Zap
} from 'lucide-react'

const LuxuryTransportation = () => {
  const luxuryFleet = [
    {
      category: 'Land Luxury',
      icon: Car,
      color: 'from-slate-600 to-gray-800',
      vehicles: [
        {
          name: 'Rolls-Royce Phantom VIII',
          type: 'Ultra-Luxury Sedan',
          passengers: 4,
          features: ['Starlight Headliner', 'Champagne Cooler', 'Massage Seats', 'Privacy Glass'],
          pricePerDay: 2500,
          image: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=600&h=400&fit=crop'
        },
        {
          name: 'Rolls-Royce Cullinan',
          type: 'Luxury SUV',
          passengers: 5,
          features: ['All-Terrain Capability', 'Rear Lounge Seats', 'Picnic Tables', 'Viewing Suite'],
          pricePerDay: 2800,
          image: 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=600&h=400&fit=crop'
        },
        {
          name: 'Mercedes-Maybach S680',
          type: 'Executive Sedan',
          passengers: 4,
          features: ['Executive Rear Seats', 'Burmester Sound', 'Ambient Lighting', 'Air Suspension'],
          pricePerDay: 1800,
          image: 'https://images.unsplash.com/photo-1563720223185-11003d516935?w=600&h=400&fit=crop'
        }
      ]
    },
    {
      category: 'Aviation Excellence',
      icon: Plane,
      color: 'from-blue-600 to-indigo-800',
      vehicles: [
        {
          name: 'Augusta Westland AW139',
          type: 'VIP Helicopter',
          passengers: 8,
          features: ['Panoramic Windows', 'Leather Interior', 'Climate Control', 'Advanced Avionics'],
          pricePerHour: 5000,
          image: 'https://images.unsplash.com/photo-1540979388789-6cee28a1cdc9?w=600&h=400&fit=crop'
        },
        {
          name: 'Cessna Citation X+',
          type: 'Private Jet',
          passengers: 12,
          features: ['Fastest Civilian Aircraft', 'Full Kitchen', 'Master Suite', 'Conference Area'],
          pricePerHour: 8500,
          image: 'https://images.unsplash.com/photo-1540962351504-03099e0a754b?w=600&h=400&fit=crop'
        },
        {
          name: 'Seaplane DHC-6',
          type: 'Luxury Seaplane',
          passengers: 9,
          features: ['Water Landing Capability', 'Scenic Flight Routes', 'Premium Interior', 'Professional Pilots'],
          pricePerHour: 3500,
          image: 'https://images.unsplash.com/photo-1556075798-4825dfaaf498?w=600&h=400&fit=crop'
        }
      ]
    },
    {
      category: 'Marine Luxury',
      icon: Ship,
      color: 'from-teal-600 to-cyan-800',
      vehicles: [
        {
          name: 'Sunseeker 88 Yacht',
          type: 'Luxury Motor Yacht',
          passengers: 12,
          features: ['Master Suite', 'Sky Lounge', 'Water Sports Equipment', 'Professional Crew'],
          pricePerDay: 15000,
          image: 'https://images.unsplash.com/photo-1569263979104-865ab7cd8d13?w=600&h=400&fit=crop'
        },
        {
          name: 'Traditional Luxury Dhow',
          type: 'Cultural Sailing Vessel',
          passengers: 16,
          features: ['Traditional Design', 'Modern Amenities', 'Cultural Experience', 'Sunset Cruises'],
          pricePerDay: 3500,
          image: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=600&h=400&fit=crop'
        },
        {
          name: 'Speed Boat Interceptor',
          type: 'High-Performance Vessel',
          passengers: 8,
          features: ['Twin Engines', 'Premium Seating', 'Water Sports', 'Island Hopping'],
          pricePerDay: 2500,
          image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=600&h=400&fit=crop'
        }
      ]
    }
  ]

  const transportServices = [
    {
      title: 'Airport VIP Services',
      description: 'Fast-track immigration, private lounges, and seamless transfers',
      icon: Plane,
      features: ['Private Immigration', 'VIP Lounges', 'Baggage Handling', 'Meet & Greet']
    },
    {
      title: 'Personal Chauffeurs',
      description: 'Professional, multilingual drivers with security training',
      icon: Users,
      features: ['Security Trained', 'Multilingual', 'Local Expertise', 'Discretion Guaranteed']
    },
    {
      title: 'Route Planning',
      description: 'Optimized luxury travel routes with exclusive access points',
      icon: MapPin,
      features: ['Exclusive Routes', 'Traffic Avoidance', 'Scenic Options', 'Time Optimization']
    },
    {
      title: '24/7 Support',
      description: 'Round-the-clock transportation coordination and support',
      icon: Clock,
      features: ['24/7 Availability', 'Emergency Response', 'Real-time Tracking', 'Instant Communication']
    }
  ]

  return (
    <section className="py-32 bg-gradient-to-b from-navy to-slate-900 text-white">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-20">
          <Badge className="bg-gradient-to-r from-gold to-amber-500 text-navy font-semibold px-6 py-2 mb-6">
            <Car className="w-4 h-4 mr-2" />
            Elite Transportation Fleet
          </Badge>
          <h2 className="text-6xl md:text-7xl font-bold mb-8 font-playfair">
            Luxury in Motion
          </h2>
          <p className="text-2xl text-ivory/90 max-w-4xl mx-auto leading-relaxed">
            Experience unparalleled comfort and style with our world-class transportation fleet. 
            From Rolls-Royce luxury to private helicopters and yachts.
          </p>
        </div>

        {/* Fleet Categories */}
        <div className="space-y-20">
          {luxuryFleet.map((category, categoryIndex) => {
            const IconComponent = category.icon
            
            return (
              <div key={category.category} className="space-y-12">
                {/* Category Header */}
                <div className="text-center">
                  <div className={`w-20 h-20 bg-gradient-to-r ${category.color} rounded-full flex items-center justify-center mx-auto mb-6`}>
                    <IconComponent className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="text-4xl font-bold mb-4 font-playfair">{category.category}</h3>
                </div>

                {/* Vehicles Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {category.vehicles.map((vehicle, vehicleIndex) => (
                    <Card key={vehicle.name} className="bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/15 transition-all duration-300 overflow-hidden">
                      {/* Vehicle Image */}
                      <div className="relative h-48 overflow-hidden">
                        <img
                          src={vehicle.image}
                          alt={vehicle.name}
                          className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 flex items-center space-x-1">
                          <Star className="w-4 h-4 fill-gold text-gold" />
                          <Crown className="w-4 h-4 text-gold" />
                        </div>
                      </div>

                      <CardHeader className="text-white">
                        <CardTitle className="text-xl font-bold font-playfair">{vehicle.name}</CardTitle>
                        <CardDescription className="text-ivory/80">{vehicle.type}</CardDescription>
                        <div className="flex items-center space-x-4 text-sm">
                          <div className="flex items-center space-x-1">
                            <Users className="w-4 h-4 text-gold" />
                            <span>{vehicle.passengers} passengers</span>
                          </div>
                        </div>
                      </CardHeader>

                      <CardContent className="text-white space-y-4">
                        {/* Price */}
                        <div className="text-center py-4 bg-white/5 rounded-lg">
                          <div className="text-3xl font-bold text-gold">
                            ${vehicle.pricePerDay?.toLocaleString() || vehicle.pricePerHour?.toLocaleString()}
                          </div>
                          <div className="text-sm text-ivory/70">
                            per {vehicle.pricePerDay ? 'day' : 'hour'}
                          </div>
                        </div>

                        {/* Features */}
                        <div className="space-y-2">
                          <h4 className="font-semibold text-gold">Premium Features:</h4>
                          <div className="space-y-1">
                            {vehicle.features.map((feature, idx) => (
                              <div key={idx} className="flex items-center space-x-2">
                                <div className="w-1.5 h-1.5 bg-gold rounded-full"></div>
                                <span className="text-sm text-ivory/90">{feature}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* CTA Button */}
                        <Button className="w-full bg-gradient-to-r from-gold to-amber-500 text-navy font-semibold hover:shadow-xl transition-all duration-300">
                          Reserve Now
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )
          })}
        </div>

        {/* Transportation Services */}
        <div className="mt-32">
          <div className="text-center mb-16">
            <h3 className="text-4xl font-bold mb-6 font-playfair">Premium Transportation Services</h3>
            <p className="text-xl text-ivory/80 max-w-3xl mx-auto">
              Beyond exceptional vehicles, we provide comprehensive luxury transportation services 
              that ensure every journey is seamless and extraordinary.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {transportServices.map((service, index) => {
              const IconComponent = service.icon
              
              return (
                <Card key={service.title} className="bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/15 transition-all duration-300">
                  <CardHeader className="text-center">
                    <div className="w-16 h-16 bg-gradient-to-r from-gold to-amber-500 rounded-full flex items-center justify-center mx-auto mb-4">
                      <IconComponent className="w-8 h-8 text-navy" />
                    </div>
                    <CardTitle className="text-lg font-semibold">{service.title}</CardTitle>
                    <CardDescription className="text-ivory/80 text-sm">
                      {service.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {service.features.map((feature, idx) => (
                        <div key={idx} className="flex items-center space-x-2">
                          <Shield className="w-3 h-3 text-gold" />
                          <span className="text-xs text-ivory/90">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>

        {/* Call to Action */}
        <div className="mt-20 text-center">
          <div className="bg-gradient-to-r from-gold/20 to-amber-500/20 backdrop-blur-sm rounded-3xl p-12 border border-gold/30">
            <h3 className="text-4xl font-bold mb-6 font-playfair">Ready to Experience Luxury Travel?</h3>
            <p className="text-xl text-ivory/80 mb-8 max-w-2xl mx-auto">
              Our transportation specialists will coordinate every detail of your luxury travel experience, 
              ensuring seamless connections and unparalleled comfort throughout your Sri Lankan journey.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-gradient-to-r from-gold to-amber-500 text-navy font-bold px-8 py-3 hover:shadow-xl transition-all duration-300">
                <Car className="w-5 h-5 mr-2" />
                Plan Transportation
              </Button>
              <Button size="lg" variant="outline" className="border-2 border-gold text-gold hover:bg-gold hover:text-navy font-semibold px-8 py-3 transition-all duration-300">
                View Full Fleet
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default LuxuryTransportation
