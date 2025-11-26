
import { useState } from 'react';
import { Sparkles, TreePine, Waves, Bird, Play, ChevronDown, Car, Plane, Building2, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import HeroSearchBar from './HeroSearchBar';
import TransferBookingForm from '../modules/transfers/components/TransferBookingForm';

interface HeroSectionProps {
  hoveredRegion: {name: string, description: string} | null;
  onLocationsChange: (locations: { pickup: string; dropoff: string }) => void;
}

const HeroSection = ({ hoveredRegion, onLocationsChange }: HeroSectionProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  return (
    <>
      {/* Modern Transfer Booking Section */}
      <section className="w-full relative py-20 overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-blue-900/20 dark:to-indigo-900/20">
        {/* Dynamic Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/30 to-indigo-600/30 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-tr from-purple-400/20 to-pink-600/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-cyan-400/10 to-blue-500/10 rounded-full blur-2xl animate-pulse delay-500"></div>
        </div>
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-6xl mx-auto">
            {/* Section Header */}
            <div className="text-center mb-12">
              <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-500/10 to-indigo-500/10 backdrop-blur-sm rounded-full px-6 py-3 mb-6 border border-blue-200/30">
                <Car className="w-5 h-5 text-blue-600" />
                <span className="text-sm font-semibold text-blue-700 dark:text-blue-300">Premium Transfer Service</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-indigo-800 bg-clip-text text-transparent mb-4">
                Book Your Perfect Ride
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                Experience seamless transfers across Sri Lanka with our premium fleet and professional drivers
              </p>
            </div>

            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-indigo-500/5 rounded-3xl blur-xl"></div>
              <div className="relative backdrop-blur-xl bg-white/70 dark:bg-slate-800/70 border border-white/20 dark:border-slate-700/30 rounded-3xl shadow-2xl overflow-hidden transition-all duration-700 ease-out">
                
                {!isExpanded ? (
                  /* Modern Compact View */
                  <div 
                    className="p-8 cursor-pointer hover:bg-gradient-to-r hover:from-blue-50/50 hover:to-indigo-50/50 transition-all duration-500 group"
                    onClick={() => setIsExpanded(true)}
                  >
                    {/* Main Content Row */}
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center space-x-6">
                        <div className="relative w-16 h-16 bg-gradient-to-br from-blue-500 via-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform duration-300">
                          <Car className="w-8 h-8 text-white" />
                          <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white animate-pulse"></div>
                        </div>
                        <div>
                          <h3 className="text-2xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-indigo-800 bg-clip-text text-transparent mb-2">
                            Premium Transfer Service
                          </h3>
                          <p className="text-gray-600 text-base">Professional rides across beautiful Sri Lanka</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-4">
                        <div className="hidden lg:flex flex-col text-right space-y-1">
                          <div className="flex items-center space-x-2 text-sm text-blue-600 font-medium">
                            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                            <span>Available 24/7</span>
                          </div>
                          <div className="flex items-center space-x-2 text-sm text-green-600 font-medium">
                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse delay-300"></div>
                            <span>Instant Booking</span>
                          </div>
                        </div>
                        <Button 
                          variant="outline" 
                          size="lg"
                          className="border-2 border-blue-500 text-blue-600 hover:bg-blue-500 hover:text-white font-semibold px-8 py-4 rounded-xl transition-all duration-300 group-hover:scale-105 shadow-lg hover:shadow-xl"
                        >
                          <Car className="w-5 h-5 mr-2" />
                          Book Transfer Now
                          <ChevronDown className="w-5 h-5 ml-2 transition-transform duration-300 group-hover:rotate-180" />
                        </Button>
                      </div>
                    </div>

                    {/* Interactive Feature Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100 hover:shadow-lg transition-all duration-300">
                        <div className="flex items-center space-x-3 mb-3">
                          <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center">
                            <Plane className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <h4 className="font-semibold text-blue-900">Airport Transfers</h4>
                            <p className="text-sm text-blue-600">Flight tracking included</p>
                          </div>
                        </div>
                      </div>

                      <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 border border-purple-100 hover:shadow-lg transition-all duration-300">
                        <div className="flex items-center space-x-3 mb-3">
                          <div className="w-10 h-10 bg-purple-500 rounded-xl flex items-center justify-center">
                            <Building2 className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <h4 className="font-semibold text-purple-900">Hotel Pickups</h4>
                            <p className="text-sm text-purple-600">Door-to-door service</p>
                          </div>
                        </div>
                      </div>

                      <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-100 hover:shadow-lg transition-all duration-300">
                        <div className="flex items-center space-x-3 mb-3">
                          <div className="w-10 h-10 bg-green-500 rounded-xl flex items-center justify-center">
                            <MapPin className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <h4 className="font-semibold text-green-900">Custom Routes</h4>
                            <p className="text-sm text-green-600">Flexible destinations</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Enhanced CTA Section */}
                    <div className="text-center bg-gradient-to-r from-blue-500/10 to-indigo-500/10 rounded-2xl p-8 border border-blue-200/30 hover:shadow-lg transition-all duration-300">
                      <div className="mb-4">
                        <span className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-orange-500 to-red-500 text-white text-sm font-semibold rounded-full">
                          <Sparkles className="w-4 h-4 mr-2" />
                          Special Launch Offer - 20% Off First Booking
                        </span>
                      </div>
                      <p className="text-xl font-bold text-gray-900 mb-2">Ready to explore Sri Lanka in luxury?</p>
                      <p className="text-gray-600 mb-6">Click anywhere to start your premium transfer booking in under 2 minutes</p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                        <div className="bg-white/80 rounded-xl p-4 border border-blue-100">
                          <h4 className="font-semibold text-gray-900 mb-2">🚗 Instant Booking</h4>
                          <p className="text-sm text-gray-600">Book now, travel anytime - No waiting, No hassle</p>
                        </div>
                        <div className="bg-white/80 rounded-xl p-4 border border-blue-100">
                          <h4 className="font-semibold text-gray-900 mb-2">💯 Best Price Guarantee</h4>
                          <p className="text-sm text-gray-600">Lowest rates + Premium service guaranteed</p>
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap items-center justify-center space-x-6">
                        <div className="flex items-center space-x-2 text-sm font-medium text-blue-600">
                          <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                          <span>Free Cancellation</span>
                        </div>
                        <div className="flex items-center space-x-2 text-sm font-medium text-green-600">
                          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse delay-500"></div>
                          <span>No Hidden Fees</span>
                        </div>
                        <div className="flex items-center space-x-2 text-sm font-medium text-purple-600">
                          <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse delay-1000"></div>
                          <span>Live GPS Tracking</span>
                        </div>
                        <div className="flex items-center space-x-2 text-sm font-medium text-orange-600">
                          <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse delay-1500"></div>
                          <span>24/7 Support</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  /* Enhanced Expanded View */
                  <div className="animate-fade-in">
                    {/* Modern Header */}
                    <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-8 text-white">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-6">
                          <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                            <Car className="w-8 h-8 text-white" />
                          </div>
                          <div>
                            <h2 className="text-3xl font-bold mb-2">Book Your Transfer</h2>
                            <p className="text-blue-100 text-lg">Premium transport across Sri Lanka</p>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="lg"
                          onClick={() => setIsExpanded(false)}
                          className="text-white hover:bg-white/10 rounded-xl"
                        >
                          <ChevronDown className="w-6 h-6 rotate-180" />
                        </Button>
                      </div>
                    </div>
                    
                    {/* Enhanced Form Container */}
                    <div className="p-8 bg-gradient-to-br from-gray-50 to-blue-50">
                      <TransferBookingForm />
                    </div>
                  </div>
                )}
                
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default HeroSection;
