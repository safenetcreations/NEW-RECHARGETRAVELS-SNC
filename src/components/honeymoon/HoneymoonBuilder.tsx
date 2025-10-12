
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Heart, MapPin, Calendar, Users, Sparkles } from 'lucide-react'

const HoneymoonBuilder = () => {
  const [selectedOptions, setSelectedOptions] = useState({
    duration: '',
    accommodation: '',
    activities: [],
    transport: ''
  })

  return (
    <section id="builder" className="py-20 bg-gradient-to-br from-rose-100 to-amber-50">
      <div className="max-w-6xl mx-auto px-6 md:px-10">
        <div className="text-center mb-16">
          <h2 className="font-serif text-4xl md:text-5xl tracking-tight mb-6 text-rose-900">
            Design Your Perfect Honeymoon
          </h2>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
            Create a bespoke honeymoon experience that reflects your unique love story. 
            Every detail is crafted to perfection, just for you.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Builder Form */}
          <div className="space-y-8">
            <Card className="p-8 bg-white/80 backdrop-blur-sm shadow-xl rounded-2xl border-0">
              <h3 className="text-2xl font-bold mb-6 text-rose-900 flex items-center">
                <Calendar className="w-6 h-6 mr-3 text-rose-600" />
                Duration & Timing
              </h3>
              <div className="grid grid-cols-2 gap-4">
                {['5 Days', '7 Days', '10 Days', '14 Days'].map((duration) => (
                  <Button
                    key={duration}
                    variant={selectedOptions.duration === duration ? "default" : "outline"}
                    onClick={() => setSelectedOptions(prev => ({ ...prev, duration }))}
                    className="rounded-full"
                  >
                    {duration}
                  </Button>
                ))}
              </div>
            </Card>

            <Card className="p-8 bg-white/80 backdrop-blur-sm shadow-xl rounded-2xl border-0">
              <h3 className="text-2xl font-bold mb-6 text-rose-900 flex items-center">
                <MapPin className="w-6 h-6 mr-3 text-rose-600" />
                Accommodation Style
              </h3>
              <div className="space-y-4">
                {[
                  { name: 'Luxury Beach Resort', desc: 'Oceanfront suites with private pools' },
                  { name: 'Boutique Villa', desc: 'Private villa with personal butler' },
                  { name: 'Tea Estate Bungalow', desc: 'Colonial charm in the hills' },
                  { name: 'Safari Lodge', desc: 'Luxury tented accommodation' }
                ].map((option) => (
                  <div
                    key={option.name}
                    className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                      selectedOptions.accommodation === option.name
                        ? 'border-rose-400 bg-rose-50'
                        : 'border-gray-200 hover:border-rose-300'
                    }`}
                    onClick={() => setSelectedOptions(prev => ({ ...prev, accommodation: option.name }))}
                  >
                    <div className="font-semibold text-rose-900">{option.name}</div>
                    <div className="text-sm text-gray-600">{option.desc}</div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Preview */}
          <div className="space-y-8">
            <Card className="p-8 bg-gradient-to-br from-rose-600 to-amber-500 text-white shadow-2xl rounded-2xl border-0">
              <div className="text-center">
                <Sparkles className="w-12 h-12 mx-auto mb-4 animate-pulse" />
                <h3 className="text-2xl font-bold mb-4">Your Magical Journey</h3>
                <div className="space-y-3 text-rose-100">
                  {selectedOptions.duration && (
                    <div className="flex items-center justify-center">
                      <Calendar className="w-4 h-4 mr-2" />
                      {selectedOptions.duration} of Paradise
                    </div>
                  )}
                  {selectedOptions.accommodation && (
                    <div className="flex items-center justify-center">
                      <MapPin className="w-4 h-4 mr-2" />
                      {selectedOptions.accommodation}
                    </div>
                  )}
                </div>
                
                <div className="mt-8 pt-6 border-t border-rose-400/30">
                  <div className="text-3xl font-bold mb-2">From $4,500</div>
                  <div className="text-rose-200 text-sm">Complete luxury package for two</div>
                </div>
                
                <Button 
                  className="mt-6 w-full bg-white text-rose-600 hover:bg-rose-50 font-semibold py-3 rounded-full"
                >
                  <Heart className="w-4 h-4 mr-2" />
                  Get Your Custom Quote
                </Button>
              </div>
            </Card>

            <div className="text-center">
              <div className="inline-flex items-center space-x-2 text-rose-700 bg-white px-6 py-3 rounded-full shadow-lg">
                <Users className="w-5 h-5" />
                <span className="font-medium">Trusted by 500+ couples</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default HoneymoonBuilder
