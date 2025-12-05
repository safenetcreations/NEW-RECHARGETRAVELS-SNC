import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Star,
  Phone,
  Mail,
  Shield,
  Award,
  Users,
  CheckCircle,
  ArrowRight,
  MessageCircle,
  Route,
  Globe,
  Car,
  Briefcase
} from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/ui/RechargeFooter';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

// Badge definitions for display
const BADGE_INFO: Record<string, { icon: string; color: string; name: string }> = {
  recharge_verified: { icon: '✓', color: 'bg-emerald-500', name: 'Verified' },
  sltda_verified: { icon: '🏛️', color: 'bg-blue-600', name: 'SLTDA' },
  tour_guide_license: { icon: '🎓', color: 'bg-purple-600', name: 'Guide' },
  five_star_driver: { icon: '⭐', color: 'bg-yellow-500', name: '5-Star' },
  safe_driver: { icon: '🛡️', color: 'bg-teal-500', name: 'Safe' },
  veteran_driver: { icon: '🎖️', color: 'bg-slate-600', name: 'Veteran' },
  wildlife_expert: { icon: '🦁', color: 'bg-lime-600', name: 'Wildlife' },
  cultural_guide: { icon: '🏺', color: 'bg-orange-500', name: 'Cultural' }
};

interface DriverCard {
  id: string;
  shortName: string;
  fullName: string;
  profilePhoto: string;
  rating: number;
  totalReviews: number;
  totalTrips: number;
  yearsExperience: number;
  tagline: string;
  languages: string[];
  specialties: string[];
  badges: string[];
  vehiclePreference: 'own_vehicle' | 'company_vehicle' | 'any_vehicle';
  isVerified: boolean;
  phone: string;
  whatsapp: string;
}

// Sample drivers - In production, fetch from Firebase
const sampleDrivers: DriverCard[] = [
  {
    id: 'driver-001',
    shortName: 'Kenny',
    fullName: 'Keneth Jayawardena',
    profilePhoto: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop',
    rating: 4.9,
    totalReviews: 127,
    totalTrips: 342,
    yearsExperience: 8,
    tagline: 'Your trusted guide to authentic Sri Lanka',
    languages: ['English', 'Sinhala', 'German'],
    specialties: ['Wildlife Safaris', 'Cultural Tours'],
    badges: ['recharge_verified', 'sltda_verified', 'tour_guide_license', 'five_star_driver', 'wildlife_expert'],
    vehiclePreference: 'own_vehicle',
    isVerified: true,
    phone: '+94 77 772 1999',
    whatsapp: '+94 77 772 1999'
  },
  {
    id: 'driver-002',
    shortName: 'Nilan',
    fullName: 'Nilan Perera',
    profilePhoto: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop',
    rating: 4.8,
    totalReviews: 89,
    totalTrips: 256,
    yearsExperience: 12,
    tagline: 'Expert in hill country and tea trails',
    languages: ['English', 'Sinhala', 'Tamil'],
    specialties: ['Hill Country', 'Tea Trails'],
    badges: ['recharge_verified', 'sltda_verified', 'veteran_driver', 'safe_driver'],
    vehiclePreference: 'own_vehicle',
    isVerified: true,
    phone: '+94 77 234 5678',
    whatsapp: '+94 77 234 5678'
  },
  {
    id: 'driver-003',
    shortName: 'Chaminda',
    fullName: 'Chaminda Rajapaksa',
    profilePhoto: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop',
    rating: 4.9,
    totalReviews: 64,
    totalTrips: 198,
    yearsExperience: 6,
    tagline: 'Adventure tours and beach destinations',
    languages: ['English', 'Sinhala', 'French'],
    specialties: ['Beach Tours', 'Adventure'],
    badges: ['recharge_verified', 'five_star_driver', 'cultural_guide'],
    vehiclePreference: 'company_vehicle',
    isVerified: true,
    phone: '+94 77 345 6789',
    whatsapp: '+94 77 345 6789'
  }
];

const Drivers = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleContactDriver = (driver: DriverCard) => {
    window.open(`https://wa.me/${driver.whatsapp.replace(/[^0-9]/g, '')}`, '_blank');
  };

  return (
    <>
      <Helmet>
        <title>Professional Drivers & Guides | Recharge Travels Sri Lanka</title>
        <meta name="description" content="Book experienced, licensed drivers and tour guides for your Sri Lanka adventure. SLTDA verified, multilingual professionals with years of experience." />
      </Helmet>

      <Header />

      <main className="min-h-screen bg-slate-50">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white py-20 overflow-hidden">
          <div className="absolute inset-0 opacity-20">
            <img
              src="https://images.unsplash.com/photo-1588001400947-6385aef4ab0e?w=1920&q=80"
              alt="Sri Lanka landscape"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-3xl mx-auto text-center">
              <Badge className="bg-emerald-500 text-white mb-6">
                <Shield className="w-3 h-3 mr-1" />
                Verified Professionals
              </Badge>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                Professional Drivers <span className="text-orange-400">&</span> Guides
              </h1>
              <p className="text-xl text-slate-300 mb-8">
                Experience Sri Lanka with our team of verified, experienced drivers and tour guides.
                SLTDA licensed, multilingual professionals at your service.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <a href="#drivers">
                  <Button size="lg" className="bg-orange-500 hover:bg-orange-600 text-white">
                    Browse Drivers
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </a>
                <a href="https://wa.me/94777721999" target="_blank" rel="noopener noreferrer">
                  <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Contact Us
                  </Button>
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Trust Indicators */}
        <section className="bg-white border-b py-8">
          <div className="container mx-auto px-4">
            <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-emerald-100 rounded-full">
                  <Shield className="w-6 h-6 text-emerald-600" />
                </div>
                <div>
                  <p className="font-bold text-slate-800">100% Verified</p>
                  <p className="text-sm text-slate-500">All drivers verified</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-3 bg-blue-100 rounded-full">
                  <Award className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="font-bold text-slate-800">SLTDA Licensed</p>
                  <p className="text-sm text-slate-500">Tourism authority approved</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-3 bg-amber-100 rounded-full">
                  <Star className="w-6 h-6 text-amber-600" />
                </div>
                <div>
                  <p className="font-bold text-slate-800">4.9/5 Rating</p>
                  <p className="text-sm text-slate-500">Average rating</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-3 bg-purple-100 rounded-full">
                  <Users className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <p className="font-bold text-slate-800">500+ Tours</p>
                  <p className="text-sm text-slate-500">Completed successfully</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Drivers Grid */}
        <section id="drivers" className="py-16">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">
                Meet Our Top-Rated Drivers
              </h2>
              <p className="text-slate-600 max-w-2xl mx-auto">
                Each driver is carefully vetted, trained, and verified to ensure you get the best experience.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {sampleDrivers.map((driver) => (
                <Card key={driver.id} className="group overflow-hidden hover:shadow-xl transition-all duration-300 border-0 shadow-lg">
                  {/* Driver Image */}
                  <div className="relative h-56 overflow-hidden bg-gradient-to-br from-slate-100 to-slate-200">
                    <img
                      src={driver.profilePhoto}
                      alt={driver.shortName}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    {/* Verified Badge */}
                    {driver.isVerified && (
                      <div className="absolute top-4 right-4 bg-emerald-500 text-white px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 shadow-lg">
                        <CheckCircle className="w-3 h-3" />
                        Verified
                      </div>
                    )}
                    {/* Rating Badge */}
                    <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-full flex items-center gap-1 shadow-lg">
                      <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                      <span className="font-bold text-slate-800">{driver.rating}</span>
                      <span className="text-slate-500 text-sm">({driver.totalReviews})</span>
                    </div>
                  </div>

                  <CardContent className="p-6">
                    {/* Name and Tagline */}
                    <h3 className="text-xl font-bold text-slate-800 mb-1">{driver.shortName}</h3>
                    <p className="text-slate-500 text-sm mb-4">{driver.tagline}</p>

                    {/* Quick Stats */}
                    <div className="flex items-center gap-4 mb-4 text-sm text-slate-600">
                      <div className="flex items-center gap-1">
                        <Route className="w-4 h-4 text-blue-500" />
                        <span>{driver.totalTrips} trips</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Briefcase className="w-4 h-4 text-purple-500" />
                        <span>{driver.yearsExperience} years</span>
                      </div>
                    </div>

                    {/* Languages */}
                    <div className="flex items-center gap-2 mb-4">
                      <Globe className="w-4 h-4 text-slate-400" />
                      <span className="text-sm text-slate-600">{driver.languages.join(', ')}</span>
                    </div>

                    {/* Vehicle Type */}
                    <div className="flex items-center gap-2 mb-4">
                      <Car className="w-4 h-4 text-slate-400" />
                      <span className="text-sm text-slate-600">
                        {driver.vehiclePreference === 'own_vehicle' ? 'Own Vehicle' : 'Drives Recharge Fleet'}
                      </span>
                    </div>

                    {/* Badges */}
                    <div className="flex flex-wrap gap-2 mb-6">
                      {driver.badges.slice(0, 4).map((badgeKey) => {
                        const badge = BADGE_INFO[badgeKey];
                        if (!badge) return null;
                        return (
                          <span
                            key={badgeKey}
                            className={`${badge.color} text-white px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1`}
                          >
                            <span>{badge.icon}</span>
                            <span>{badge.name}</span>
                          </span>
                        );
                      })}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3">
                      <Link to={`/driver/${driver.id}`} className="flex-1">
                        <Button variant="outline" className="w-full">
                          View Profile
                        </Button>
                      </Link>
                      <Button
                        className="flex-1 bg-emerald-500 hover:bg-emerald-600"
                        onClick={() => handleContactDriver(driver)}
                      >
                        <MessageCircle className="w-4 h-4 mr-2" />
                        Contact
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-slate-800 mb-4">How It Works</h2>
              <p className="text-slate-600 max-w-2xl mx-auto">
                Booking your perfect driver is simple and straightforward
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              <div className="text-center">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-orange-600">1</span>
                </div>
                <h3 className="text-lg font-semibold text-slate-800 mb-2">Browse Profiles</h3>
                <p className="text-slate-600 text-sm">
                  View driver profiles, check ratings, badges, and specialties to find your perfect match.
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-emerald-600">2</span>
                </div>
                <h3 className="text-lg font-semibold text-slate-800 mb-2">Contact Driver</h3>
                <p className="text-slate-600 text-sm">
                  Reach out via WhatsApp to discuss your trip details and get a personalized quote.
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-blue-600">3</span>
                </div>
                <h3 className="text-lg font-semibold text-slate-800 mb-2">Enjoy Your Trip</h3>
                <p className="text-slate-600 text-sm">
                  Confirm your booking and enjoy a safe, memorable journey through Sri Lanka.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Become a Driver CTA */}
        <section className="py-16 bg-slate-900 text-white">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <Badge className="bg-emerald-500 text-white mb-6">
                <Car className="w-3 h-3 mr-1" />
                Join Our Team
              </Badge>
              <h2 className="text-3xl font-bold mb-4">Are You a Professional Driver?</h2>
              <p className="text-xl text-slate-300 mb-8">
                Join Recharge Travels and connect with tourists from around the world.
                Get verified, receive bookings, and grow your business.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/driver/register">
                  <Button size="lg" className="bg-emerald-500 hover:bg-emerald-600 text-white">
                    Register as Driver
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
                <a href="https://wa.me/94777721999?text=Hi,%20I%20want%20to%20join%20as%20a%20driver" target="_blank" rel="noopener noreferrer">
                  <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Ask Questions First
                  </Button>
                </a>
              </div>
              <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                <div>
                  <p className="text-2xl font-bold text-emerald-400">100+</p>
                  <p className="text-sm text-slate-400">Active Drivers</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-emerald-400">$500+</p>
                  <p className="text-sm text-slate-400">Avg. Monthly Earnings</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-emerald-400">24/7</p>
                  <p className="text-sm text-slate-400">Support Available</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-emerald-400">Free</p>
                  <p className="text-sm text-slate-400">Registration</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-gradient-to-r from-orange-500 to-amber-500 text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to Explore Sri Lanka?</h2>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Book a verified professional driver today and experience the island like never before.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <a href="https://wa.me/94777721999" target="_blank" rel="noopener noreferrer">
                <Button size="lg" className="bg-white text-orange-600 hover:bg-slate-100">
                  <MessageCircle className="w-5 h-5 mr-2" />
                  Contact via WhatsApp
                </Button>
              </a>
              <div className="flex items-center gap-4 text-white/90">
                <a href="tel:+94777721999" className="flex items-center hover:text-white">
                  <Phone className="w-4 h-4 mr-1" />
                  <span>+94 77 772 1999</span>
                </a>
                <a href="mailto:info@rechargetravels.com" className="flex items-center hover:text-white">
                  <Mail className="w-4 h-4 mr-1" />
                  <span>info@rechargetravels.com</span>
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
};

export default Drivers;
