
import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Crown, Diamond, Gem, Star, Plane, Building2, Car, Ship, 
  Shield, Users, Calendar, MapPin, CheckCircle, ArrowRight, Sparkles, Globe
} from 'lucide-react'

interface LuxuryPackagesProps {
  selectedCurrency: string
}

const LuxuryPackages = ({ selectedCurrency }: LuxuryPackagesProps) => {
  const [selectedPackage, setSelectedPackage] = useState<string>('')

  const currencySymbols = {
    USD: '$',
    EUR: '€', 
    GBP: '£',
    CHF: 'CHF '
  }

  const exchangeRates = {
    USD: 1,
    EUR: 0.85,
    GBP: 0.73,
    CHF: 0.92
  }

  const formatPrice = (usdPrice: number) => {
    const rate = exchangeRates[selectedCurrency as keyof typeof exchangeRates] || 1
    const symbol = currencySymbols[selectedCurrency as keyof typeof currencySymbols] || '$'
    const convertedPrice = Math.round(usdPrice * rate)
    return `${symbol}${convertedPrice.toLocaleString()}`
  }

  const luxuryPackages = [
    {
      id: 'platinum',
      tier: 'Platinum Luxury',
      subtitle: 'Distinguished Excellence',
      priceRange: [25000, 50000],
      duration: '7-14 Days',
      maxGuests: '2-8 Guests',
      color: 'from-amber-400 to-gold',
      borderColor: 'border-gold/30',
      icon: Crown,
      features: [
        'Private jet transfers within Sri Lanka',
        'Exclusive temple access with high monks', 
        'Private cooking classes with celebrity chefs',
        'Helicopter safaris with wildlife experts',
        'Royal treatment suites in historic palaces',
        'Personal photographer and videographer',
        '24/7 personal concierge service',
        'Private archaeological site tours',
        'Luxury safari lodge accommodations',
        'Custom gem cutting workshops'
      ],
      exclusiveAccess: [
        'Private temple ceremonies',
        'Closed archaeological sites',
        'Royal palace suites',
        'Celebrity chef experiences'
      ]
    },
    {
      id: 'diamond',
      tier: 'Diamond Elite',
      subtitle: 'Unparalleled Luxury',
      priceRange: [50000, 100000],
      duration: '10-21 Days', 
      maxGuests: '2-12 Guests',
      color: 'from-blue-500 to-indigo-600',
      borderColor: 'border-blue-400/30',
      icon: Diamond,
      features: [
        'International private jet pickup',
        'Complete island buyouts for events',
        'Private audience with cultural dignitaries',
        'Exclusive archaeological site access',
        'Custom jewelry creation with Sri Lankan gems',
        'Private yacht charters around the coast',
        'Dedicated security detail',
        'Presidential suite accommodations',
        'Private museum and gallery viewings',
        'Michelin-starred chef residencies'
      ],
      exclusiveAccess: [
        'Island buyouts',
        'Cultural dignitary meetings',
        'Private yacht fleet',
        'Security protection services'
      ]
    },
    {
      id: 'royal',
      tier: 'Royal Sovereign',
      subtitle: 'Beyond Imagination',
      priceRange: [100000, 500000],
      duration: '14-30 Days',
      maxGuests: '2-20 Guests',
      color: 'from-purple-500 to-pink-600',
      borderColor: 'border-purple-400/30',
      icon: Gem,
      features: [
        'Presidential suite accommodations',
        'Government VIP protocol arrangements',
        'Private museum and gallery viewings',
        'Exclusive tea estate purchases/partnerships',
        'Custom luxury property rental arrangements',
        'International celebrity chef experiences',
        'Diplomatic-level cultural exchanges',
        'Private island development consultation',
        'Luxury real estate investment tours',
        'Custom documentary production'
      ],
      exclusiveAccess: [
        'Government VIP protocols',
        'Diplomatic exchanges',
        'Private investment opportunities',
        'Custom documentary production'
      ]
    }
  ]

  return (
    <section className="py-32 bg-gradient-to-b from-ivory to-white">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-20">
          <Badge className="bg-gradient-to-r from-gold to-amber-500 text-navy font-semibold px-6 py-2 mb-6">
            <Sparkles className="w-4 h-4 mr-2" />
            Million-Dollar Experiences
          </Badge>
          <h2 className="text-6xl md:text-7xl font-bold text-navy mb-8 font-playfair">
            Ultra-Luxury Packages
          </h2>
          <p className="text-2xl text-slate-600 max-w-4xl mx-auto leading-relaxed">
            Meticulously crafted experiences that transcend traditional luxury travel. 
            Each package is uniquely designed for the world's most discerning travelers.
          </p>
        </div>

        {/* Package Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 max-w-7xl mx-auto">
          {luxuryPackages.map((pkg, index) => {
            const IconComponent = pkg.icon
            const isPopular = pkg.id === 'diamond'
            
            return (
              <Card 
                key={pkg.id}
                className={`relative overflow-hidden transition-all duration-500 hover:shadow-2xl hover:scale-105 cursor-pointer ${pkg.borderColor} border-2 bg-white ${
                  isPopular ? 'transform scale-110 shadow-2xl' : ''
                }`}
                onClick={() => setSelectedPackage(pkg.id)}
              >
                {isPopular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
                    <Badge className="bg-gradient-to-r from-gold to-amber-500 text-navy font-bold px-8 py-2">
                      Most Exclusive
                    </Badge>
                  </div>
                )}

                <CardHeader className="text-center pb-6 pt-8">
                  <div className={`w-20 h-20 bg-gradient-to-r ${pkg.color} rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg`}>
                    <IconComponent className="w-10 h-10 text-white" />
                  </div>
                  
                  <CardTitle className="text-3xl font-bold text-navy mb-2 font-playfair">
                    {pkg.tier}
                  </CardTitle>
                  <CardDescription className="text-lg font-medium text-slate-600 mb-4">
                    {pkg.subtitle}
                  </CardDescription>
                  
                  <div className="space-y-2">
                    <div className="text-4xl font-bold text-navy">
                      {formatPrice(pkg.priceRange[0])} - {formatPrice(pkg.priceRange[1])}
                    </div>
                    <div className="text-sm text-slate-500">Per experience package</div>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-6">
                  {/* Package Details */}
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4 text-gold" />
                      <span>{pkg.duration}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Users className="w-4 h-4 text-gold" />
                      <span>{pkg.maxGuests}</span>
                    </div>
                  </div>

                  {/* Key Features */}
                  <div className="space-y-3">
                    <h4 className="font-semibold text-navy">Included Experiences:</h4>
                    <div className="space-y-2">
                      {pkg.features.slice(0, 6).map((feature, idx) => (
                        <div key={idx} className="flex items-start space-x-2">
                          <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                          <span className="text-sm text-slate-600">{feature}</span>
                        </div>
                      ))}
                      {pkg.features.length > 6 && (
                        <div className="text-sm text-gold font-medium">
                          +{pkg.features.length - 6} more exclusive experiences
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Exclusive Access */}
                  <div className="space-y-3 pt-4 border-t border-slate-100">
                    <h4 className="font-semibold text-navy flex items-center">
                      <Shield className="w-4 h-4 mr-2 text-gold" />
                      Exclusive Access:
                    </h4>
                    <div className="grid grid-cols-1 gap-1">
                      {pkg.exclusiveAccess.map((access, idx) => (
                        <div key={idx} className="text-sm text-slate-600 bg-gold/5 px-3 py-1 rounded">
                          {access}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* CTA Button */}
                  <Button 
                    className={`w-full mt-6 bg-gradient-to-r ${pkg.color} text-white font-semibold py-3 hover:shadow-xl transition-all duration-300`}
                  >
                    Begin Planning Experience
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Additional Information */}
        <div className="text-center mt-16 space-y-4">
          <p className="text-lg text-slate-600 max-w-3xl mx-auto">
            All packages are fully customizable and can be extended up to 6 months for the ultimate Sri Lankan immersion experience.
          </p>
          <div className="flex justify-center space-x-8 text-sm text-slate-500">
            <div className="flex items-center space-x-2">
              <Shield className="w-4 h-4 text-gold" />
              <span>Complete Privacy & Security</span>
            </div>
            <div className="flex items-center space-x-2">
              <Star className="w-4 h-4 text-gold" />
              <span>24/7 Concierge Support</span>
            </div>
            <div className="flex items-center space-x-2">
              <Globe className="w-4 h-4 text-gold" />
              <span>Global Coordination</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default LuxuryPackages
