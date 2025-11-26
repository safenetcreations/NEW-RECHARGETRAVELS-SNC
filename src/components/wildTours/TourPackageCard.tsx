
import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Car,
  Users,
  MapPin,
  Star,
  Clock,
  Camera,
  Utensils,
  Bed,
  Calendar,
  CheckCircle,
  XCircle,
  Info,
  ChevronDown,
  ChevronUp
} from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'

export interface Itinerary {
  day: number
  title: string
  description: string
  activities: string[]
}

export interface FAQ {
  question: string
  answer: string
}

export interface TourPackage {
  id: string
  title: string
  location: string
  description: string[]
  image: string
  tier: 'semi-luxury' | 'budget'
  price: number
  originalPrice?: number
  duration: string
  inclusions: {
    vehicle: string
    guide: string
    accommodation: string
    meals?: string
    extras?: string[]
  }
  highlights: string[]
  maxParticipants: number
  rating: number
  reviewCount: number
  itinerary?: Itinerary[]
  faq?: FAQ[]
  bestTime?: string
  difficulty?: string
  included?: string[]
  excluded?: string[]
  cancellationPolicy?: string
}

interface TourPackageCardProps {
  package: TourPackage
  onSelect: (packageData: TourPackage) => void
}

const TourPackageCard = ({ package: pkg, onSelect }: TourPackageCardProps) => {
  const [showFullDetails, setShowFullDetails] = useState(false)

  const tierColors = {
    'semi-luxury': 'bg-gradient-to-r from-amber-500 to-orange-500',
    'budget': 'bg-gradient-to-r from-green-500 to-emerald-500'
  }

  const tierLabels = {
    'semi-luxury': 'Semi-Luxury',
    'budget': 'Budget-Friendly'
  }

  return (
    <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 group">
      <div className="relative">
        <img
          src={pkg.image}
          alt={`${pkg.title} - ${tierLabels[pkg.tier]}`}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        
        <div className="absolute top-4 left-4">
          <Badge className={`${tierColors[pkg.tier]} text-white font-semibold`}>
            {tierLabels[pkg.tier]}
          </Badge>
        </div>

        <div className="absolute top-4 right-4 bg-black/70 text-white px-2 py-1 rounded-md">
          <div className="flex items-center gap-1">
            <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
            <span className="text-sm font-medium">{pkg.rating}</span>
            <span className="text-xs opacity-80">({pkg.reviewCount})</span>
          </div>
        </div>

        {pkg.originalPrice && (
          <div className="absolute bottom-4 right-4 bg-red-500 text-white px-2 py-1 rounded-md text-sm font-medium">
            Save ${pkg.originalPrice - pkg.price}
          </div>
        )}
      </div>

      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-xl font-playfair font-bold text-gray-900 mb-1">
              {pkg.title}
            </CardTitle>
            <div className="flex items-center text-gray-600 mb-2">
              <MapPin className="w-4 h-4 mr-1" />
              <span className="text-sm font-montserrat">{pkg.location}</span>
            </div>
          </div>
          <div className="text-right">
            {pkg.originalPrice && (
              <div className="text-sm text-gray-500 line-through font-montserrat">
                ${pkg.originalPrice}
              </div>
            )}
            <div className="text-2xl font-bold text-green-600 font-playfair">
              ${pkg.price}
            </div>
            <div className="text-xs text-gray-500 font-montserrat">per person</div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Description */}
        <div className="space-y-1">
          {pkg.description.map((line, index) => (
            <p key={index} className="text-sm text-gray-700 font-montserrat leading-relaxed">
              {line}
            </p>
          ))}
        </div>

        {/* Key Info */}
        <div className="flex items-center justify-between text-sm text-gray-600 py-2 border-t border-gray-100">
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            <span className="font-montserrat">{pkg.duration}</span>
          </div>
          <div className="flex items-center gap-1">
            <Users className="w-4 h-4" />
            <span className="font-montserrat">Max {pkg.maxParticipants}</span>
          </div>
        </div>

        {/* Inclusions */}
        <div className="space-y-2">
          <h4 className="font-semibold text-gray-800 font-montserrat text-sm">What's Included:</h4>
          <div className="grid grid-cols-1 gap-1 text-xs text-gray-600">
            <div className="flex items-center gap-2">
              <Car className="w-3 h-3 text-blue-500" />
              <span className="font-montserrat">{pkg.inclusions.vehicle}</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-3 h-3 text-green-500" />
              <span className="font-montserrat">{pkg.inclusions.guide}</span>
            </div>
            <div className="flex items-center gap-2">
              <Bed className="w-3 h-3 text-purple-500" />
              <span className="font-montserrat">{pkg.inclusions.accommodation}</span>
            </div>
            {pkg.inclusions.meals && (
              <div className="flex items-center gap-2">
                <Utensils className="w-3 h-3 text-orange-500" />
                <span className="font-montserrat">{pkg.inclusions.meals}</span>
              </div>
            )}
          </div>
        </div>

        {/* Highlights */}
        {pkg.highlights.length > 0 && (
          <div className="space-y-2">
            <h4 className="font-semibold text-gray-800 font-montserrat text-sm">Highlights:</h4>
            <div className="flex flex-wrap gap-1">
              {pkg.highlights.slice(0, 3).map((highlight, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {highlight}
                </Badge>
              ))}
              {pkg.highlights.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{pkg.highlights.length - 3} more
                </Badge>
              )}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button
                variant="outline"
                className="flex-1 font-montserrat text-sm"
              >
                <Info className="w-4 h-4 mr-1" />
                Full Details
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="text-2xl font-playfair">{pkg.title}</DialogTitle>
                <DialogDescription className="flex items-center gap-2 text-base">
                  <MapPin className="w-4 h-4" />
                  {pkg.location}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-6 mt-4">
                {/* Image */}
                <img
                  src={pkg.image}
                  alt={pkg.title}
                  className="w-full h-64 object-cover rounded-lg"
                />

                {/* Pricing and Quick Info */}
                <div className="grid md:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600 font-playfair">${pkg.price}</div>
                    <div className="text-sm text-gray-600">per person</div>
                    {pkg.originalPrice && (
                      <div className="text-sm text-gray-500 line-through">${pkg.originalPrice}</div>
                    )}
                  </div>
                  <div className="text-center border-l border-r border-gray-300">
                    <Clock className="w-6 h-6 mx-auto mb-1 text-blue-600" />
                    <div className="font-semibold">{pkg.duration}</div>
                    <div className="text-sm text-gray-600">Duration</div>
                  </div>
                  <div className="text-center">
                    <Users className="w-6 h-6 mx-auto mb-1 text-purple-600" />
                    <div className="font-semibold">Max {pkg.maxParticipants}</div>
                    <div className="text-sm text-gray-600">Participants</div>
                  </div>
                </div>

                {/* Additional Info */}
                {(pkg.bestTime || pkg.difficulty) && (
                  <div className="flex flex-wrap gap-4 text-sm">
                    {pkg.bestTime && (
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-amber-600" />
                        <span className="font-semibold">Best Time:</span>
                        <span className="text-gray-700">{pkg.bestTime}</span>
                      </div>
                    )}
                    {pkg.difficulty && (
                      <div className="flex items-center gap-2">
                        <Info className="w-4 h-4 text-blue-600" />
                        <span className="font-semibold">Difficulty:</span>
                        <Badge variant="outline">{pkg.difficulty}</Badge>
                      </div>
                    )}
                  </div>
                )}

                {/* Itinerary */}
                {pkg.itinerary && pkg.itinerary.length > 0 && (
                  <div>
                    <h3 className="text-xl font-bold font-playfair mb-4 flex items-center gap-2">
                      <Calendar className="w-5 h-5 text-amber-600" />
                      Day-by-Day Itinerary
                    </h3>
                    <Accordion type="single" collapsible className="space-y-2">
                      {pkg.itinerary.map((day) => (
                        <AccordionItem key={day.day} value={`day-${day.day}`} className="border rounded-lg px-4">
                          <AccordionTrigger className="hover:no-underline">
                            <div className="flex items-center gap-3 text-left">
                              <div className="bg-amber-100 text-amber-700 font-bold rounded-full w-8 h-8 flex items-center justify-center">
                                {day.day}
                              </div>
                              <div>
                                <div className="font-semibold font-montserrat">{day.title}</div>
                                <div className="text-sm text-gray-600">{day.description}</div>
                              </div>
                            </div>
                          </AccordionTrigger>
                          <AccordionContent>
                            <ul className="space-y-2 ml-11 mt-2">
                              {day.activities.map((activity, idx) => (
                                <li key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                                  <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                                  <span>{activity}</span>
                                </li>
                              ))}
                            </ul>
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  </div>
                )}

                {/* Included & Excluded */}
                <div className="grid md:grid-cols-2 gap-6">
                  {pkg.included && pkg.included.length > 0 && (
                    <div>
                      <h4 className="font-bold font-montserrat mb-3 flex items-center gap-2 text-green-700">
                        <CheckCircle className="w-5 h-5" />
                        What's Included
                      </h4>
                      <ul className="space-y-2">
                        {pkg.included.map((item, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-sm">
                            <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                            <span className="text-gray-700">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {pkg.excluded && pkg.excluded.length > 0 && (
                    <div>
                      <h4 className="font-bold font-montserrat mb-3 flex items-center gap-2 text-red-700">
                        <XCircle className="w-5 h-5" />
                        What's Not Included
                      </h4>
                      <ul className="space-y-2">
                        {pkg.excluded.map((item, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-sm">
                            <XCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                            <span className="text-gray-700">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                {/* FAQ */}
                {pkg.faq && pkg.faq.length > 0 && (
                  <div>
                    <h3 className="text-xl font-bold font-playfair mb-4">Frequently Asked Questions</h3>
                    <Accordion type="single" collapsible className="space-y-2">
                      {pkg.faq.map((item, idx) => (
                        <AccordionItem key={idx} value={`faq-${idx}`} className="border rounded-lg px-4">
                          <AccordionTrigger className="text-left font-semibold font-montserrat">
                            {item.question}
                          </AccordionTrigger>
                          <AccordionContent className="text-gray-700 leading-relaxed">
                            {item.answer}
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  </div>
                )}

                {/* Cancellation Policy */}
                {pkg.cancellationPolicy && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h4 className="font-bold font-montserrat mb-2 flex items-center gap-2 text-blue-700">
                      <Info className="w-5 h-5" />
                      Cancellation Policy
                    </h4>
                    <p className="text-sm text-gray-700 leading-relaxed">{pkg.cancellationPolicy}</p>
                  </div>
                )}

                {/* Book Button */}
                <Button
                  onClick={() => {
                    onSelect(pkg)
                  }}
                  size="lg"
                  className={`w-full ${tierColors[pkg.tier]} hover:opacity-90 text-white font-semibold text-lg py-6`}
                >
                  Book This Tour Now
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          <Button
            onClick={() => onSelect(pkg)}
            className={`flex-1 ${tierColors[pkg.tier]} hover:opacity-90 text-white font-semibold transition-all duration-300 transform hover:scale-105`}
          >
            Select & Book
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

export default TourPackageCard
