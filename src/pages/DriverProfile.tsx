import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Star,
  Shield,
  Car,
  Users,
  MapPin,
  Clock,
  Phone,
  CheckCircle,
  Award,
  Globe,
  Calendar,
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Languages,
  Briefcase,
  ThumbsUp,
  MessageCircle,
  Verified,
  Sparkles,
  Route,
  Timer,
  UserCheck,
  CarFront,
  Settings,
  Mail
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Header from '@/components/Header';
import Footer from '@/components/ui/RechargeFooter';
import { db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';

// Badge definitions for display
const BADGE_INFO: Record<string, { icon: string; color: string; name: string }> = {
  recharge_verified: { icon: '✓', color: 'bg-emerald-500', name: 'Recharge Verified' },
  sltda_verified: { icon: '🏛️', color: 'bg-blue-600', name: 'SLTDA Licensed' },
  tour_guide_license: { icon: '🎓', color: 'bg-purple-600', name: 'Tour Guide License' },
  police_cleared: { icon: '🛡️', color: 'bg-green-600', name: 'Police Cleared' },
  five_star_driver: { icon: '⭐', color: 'bg-yellow-500', name: '5-Star Driver' },
  top_rated: { icon: '🏆', color: 'bg-amber-500', name: 'Top Rated' },
  safe_driver: { icon: '🛡️', color: 'bg-teal-500', name: 'Safe Driver' },
  veteran_driver: { icon: '🎖️', color: 'bg-slate-600', name: 'Veteran Driver' },
  language_expert: { icon: '🗣️', color: 'bg-cyan-500', name: 'Multilingual' },
  wildlife_expert: { icon: '🦁', color: 'bg-lime-600', name: 'Wildlife Expert' },
  cultural_guide: { icon: '🏺', color: 'bg-orange-500', name: 'Cultural Guide' },
  luxury_specialist: { icon: '✨', color: 'bg-rose-500', name: 'Luxury Specialist' },
  early_bird: { icon: '🌅', color: 'bg-orange-400', name: 'Early Bird' },
  '100_trips': { icon: '💯', color: 'bg-purple-500', name: '100+ Trips' },
  '500_trips': { icon: '🎯', color: 'bg-indigo-500', name: '500+ Trips' },
  quick_responder: { icon: '⚡', color: 'bg-yellow-400', name: 'Quick Responder' }
};

interface DriverProfileData {
  id: string;
  shortName: string;
  fullName: string;
  profilePhoto: string;
  heroImages: string[];
  rating: number;
  totalReviews: number;
  totalTrips: number;
  yearsExperience: number;
  bio: string;
  tagline: string;
  languages: string[];
  specialties: string[];
  badges: string[];
  vehiclePreference: 'own_vehicle' | 'company_vehicle' | 'any_vehicle';
  ownVehicle?: {
    type: string;
    make: string;
    model: string;
    year: number;
    seats: number;
    features: string[];
    images: string[];
    registrationNumber: string;
  };
  coverageAreas: string[];
  responseTime: string;
  acceptanceRate: number;
  completionRate: number;
  isVerified: boolean;
  isSLTDAApproved: boolean;
  isTourGuide: boolean;
  phone: string;
  whatsapp: string;
  email?: string;
}

// Mock data - In production, fetch from Firebase
const mockDriverProfile: DriverProfileData = {
  id: 'driver-001',
  shortName: 'Kenny',
  fullName: 'Keneth Jayawardena',
  profilePhoto: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop',
  heroImages: [
    'https://images.unsplash.com/photo-1588001400947-6385aef4ab0e?w=1200&h=600&fit=crop',
    'https://images.unsplash.com/photo-1596402184320-417e7178b2cd?w=1200&h=600&fit=crop',
    'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=1200&h=600&fit=crop',
    'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=1200&h=600&fit=crop',
    'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=1200&h=600&fit=crop'
  ],
  rating: 4.9,
  totalReviews: 127,
  totalTrips: 342,
  yearsExperience: 8,
  bio: 'Born and raised in Kandy, I have been sharing the beauty of Sri Lanka with travelers for over 8 years. My passion is creating unforgettable experiences through personalized tours that reveal the authentic soul of our island. Whether it\'s wildlife safaris, cultural heritage sites, or hidden local gems, I ensure every journey becomes a treasured memory.',
  tagline: 'Your trusted guide to authentic Sri Lanka',
  languages: ['English', 'Sinhala', 'German', 'French'],
  specialties: ['Wildlife Safaris', 'Cultural Tours', 'Photography Tours', 'Hill Country Trails'],
  badges: ['recharge_verified', 'sltda_verified', 'tour_guide_license', 'five_star_driver', 'safe_driver', 'veteran_driver', 'wildlife_expert'],
  vehiclePreference: 'own_vehicle',
  ownVehicle: {
    type: 'SUV',
    make: 'Toyota',
    model: 'Land Cruiser Prado',
    year: 2022,
    seats: 7,
    features: ['Air Conditioning', 'WiFi Hotspot', 'USB Charging', 'Cooler Box', 'First Aid Kit', 'GPS Navigation'],
    images: [
      'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800&h=500&fit=crop',
      'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&h=500&fit=crop'
    ],
    registrationNumber: 'CAB-XXXX'
  },
  coverageAreas: ['Central Province', 'Cultural Triangle', 'Hill Country', 'Southern Coast', 'Wildlife Parks'],
  responseTime: '< 30 mins',
  acceptanceRate: 98,
  completionRate: 100,
  isVerified: true,
  isSLTDAApproved: true,
  isTourGuide: true,
  phone: '+94 77 772 1999',
  whatsapp: '+94 77 772 1999',
  email: 'kenny@rechargetravels.com'
};

const DriverProfile = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [driver, setDriver] = useState<DriverProfileData | null>(null);
  const [currentHeroIndex, setCurrentHeroIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDriver = async () => {
      try {
        // In production, fetch from Firebase
        // const docRef = doc(db, 'drivers', id);
        // const docSnap = await getDoc(docRef);
        // if (docSnap.exists()) setDriver(docSnap.data() as DriverProfileData);

        // Using mock data for now
        setTimeout(() => {
          setDriver(mockDriverProfile);
          setLoading(false);
        }, 500);
      } catch (error) {
        console.error('Error fetching driver:', error);
        setLoading(false);
      }
    };

    fetchDriver();
  }, [id]);

  // Auto-rotate hero images
  useEffect(() => {
    if (!driver) return;
    const interval = setInterval(() => {
      setCurrentHeroIndex((prev) => (prev + 1) % driver.heroImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [driver]);

  const nextHeroImage = () => {
    if (driver) {
      setCurrentHeroIndex((prev) => (prev + 1) % driver.heroImages.length);
    }
  };

  const prevHeroImage = () => {
    if (driver) {
      setCurrentHeroIndex((prev) => (prev - 1 + driver.heroImages.length) % driver.heroImages.length);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600">Loading driver profile...</p>
        </div>
      </div>
    );
  }

  if (!driver) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <p className="text-slate-600 text-xl mb-4">Driver not found</p>
          <Button onClick={() => navigate('/drivers')}>Back to Drivers</Button>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{driver.shortName} - Professional Driver & Guide | Recharge Travels</title>
        <meta name="description" content={`${driver.tagline}. ${driver.yearsExperience} years experience. Rated ${driver.rating}/5 by ${driver.totalReviews} travelers.`} />
      </Helmet>

      <Header />

      <main className="min-h-screen bg-slate-50">
        {/* Hero Section with 5 Rotating Images */}
        <section className="relative h-[70vh] overflow-hidden">
          {/* Background Images */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentHeroIndex}
              initial={{ opacity: 0, scale: 1.1 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.7 }}
              className="absolute inset-0"
            >
              <img
                src={driver.heroImages[currentHeroIndex]}
                alt={`${driver.shortName}'s tour`}
                className="w-full h-full object-cover"
              />
            </motion.div>
          </AnimatePresence>

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/20 z-10" />

          {/* Navigation Arrows */}
          <button
            onClick={prevHeroImage}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-white/20 hover:bg-white/40 backdrop-blur-sm p-3 rounded-full transition-all"
          >
            <ChevronLeft className="w-6 h-6 text-white" />
          </button>
          <button
            onClick={nextHeroImage}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-white/20 hover:bg-white/40 backdrop-blur-sm p-3 rounded-full transition-all"
          >
            <ChevronRight className="w-6 h-6 text-white" />
          </button>

          {/* Image Indicators */}
          <div className="absolute bottom-32 left-1/2 -translate-x-1/2 z-20 flex gap-2">
            {driver.heroImages.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentHeroIndex(idx)}
                className={`w-2 h-2 rounded-full transition-all ${
                  idx === currentHeroIndex ? 'bg-white w-8' : 'bg-white/50'
                }`}
              />
            ))}
          </div>

          {/* Back Button */}
          <div className="absolute top-24 left-4 z-20">
            <Button variant="ghost" className="text-white hover:bg-white/20" onClick={() => navigate('/drivers')}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Drivers
            </Button>
          </div>

          {/* Driver Info Overlay */}
          <div className="absolute bottom-0 left-0 right-0 z-20 p-8">
            <div className="container mx-auto">
              <div className="flex flex-col md:flex-row items-end md:items-center justify-between gap-6">
                {/* Driver Basic Info */}
                <div className="flex items-center gap-6">
                  {/* Profile Photo */}
                  <div className="relative">
                    <img
                      src={driver.profilePhoto}
                      alt={driver.shortName}
                      className="w-24 h-24 md:w-32 md:h-32 rounded-full border-4 border-white object-cover shadow-xl"
                    />
                    {driver.isVerified && (
                      <div className="absolute -bottom-2 -right-2 bg-emerald-500 p-2 rounded-full border-2 border-white">
                        <CheckCircle className="w-5 h-5 text-white" />
                      </div>
                    )}
                  </div>

                  {/* Name and Quick Stats */}
                  <div className="text-white">
                    <h1 className="text-3xl md:text-4xl font-bold mb-2">{driver.shortName}</h1>
                    <p className="text-white/80 text-lg mb-3">{driver.tagline}</p>
                    <div className="flex flex-wrap items-center gap-4">
                      <div className="flex items-center gap-1">
                        <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                        <span className="font-semibold">{driver.rating}</span>
                        <span className="text-white/70">({driver.totalReviews} reviews)</span>
                      </div>
                      <div className="flex items-center gap-1 text-white/80">
                        <Route className="w-4 h-4" />
                        <span>{driver.totalTrips} trips</span>
                      </div>
                      <div className="flex items-center gap-1 text-white/80">
                        <Briefcase className="w-4 h-4" />
                        <span>{driver.yearsExperience} years</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* CTA Button */}
                <div className="flex-shrink-0">
                  <a href={`https://wa.me/${driver.whatsapp.replace(/[^0-9]/g, '')}`} target="_blank" rel="noopener noreferrer">
                    <Button size="lg" className="bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-6 text-lg shadow-lg">
                      <MessageCircle className="w-5 h-5 mr-2" />
                      Contact {driver.shortName}
                    </Button>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Badges Section */}
        <section className="bg-white border-b">
          <div className="container mx-auto px-4 py-6">
            <div className="flex flex-wrap items-center justify-center gap-3">
              {driver.badges.map((badgeKey) => {
                const badge = BADGE_INFO[badgeKey];
                if (!badge) return null;
                return (
                  <div
                    key={badgeKey}
                    className={`${badge.color} text-white px-4 py-2 rounded-full flex items-center gap-2 shadow-md`}
                  >
                    <span className="text-lg">{badge.icon}</span>
                    <span className="font-medium text-sm">{badge.name}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Main Content */}
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* About Section */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <UserCheck className="w-5 h-5 text-orange-500" />
                    About {driver.shortName}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-600 leading-relaxed mb-6">{driver.bio}</p>

                  {/* Languages */}
                  <div className="mb-6">
                    <h4 className="font-semibold text-slate-800 mb-3 flex items-center gap-2">
                      <Languages className="w-4 h-4 text-orange-500" />
                      Languages Spoken
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {driver.languages.map((lang) => (
                        <Badge key={lang} variant="secondary" className="bg-slate-100">
                          <Globe className="w-3 h-3 mr-1" />
                          {lang}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Specialties */}
                  <div>
                    <h4 className="font-semibold text-slate-800 mb-3 flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-orange-500" />
                      Tour Specialties
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {driver.specialties.map((specialty) => (
                        <Badge key={specialty} className="bg-orange-100 text-orange-700 hover:bg-orange-200">
                          {specialty}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Vehicle Section */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CarFront className="w-5 h-5 text-orange-500" />
                    Vehicle Information
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {driver.vehiclePreference === 'own_vehicle' && driver.ownVehicle ? (
                    <div>
                      {/* Own Vehicle Display */}
                      <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-xl p-4 mb-6">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge className="bg-emerald-500">
                            <Car className="w-3 h-3 mr-1" />
                            Own Vehicle
                          </Badge>
                          <span className="text-sm text-emerald-700">This driver operates with their personal vehicle</span>
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-6">
                        {/* Vehicle Image */}
                        <div className="relative rounded-xl overflow-hidden">
                          <img
                            src={driver.ownVehicle.images[0]}
                            alt={`${driver.ownVehicle.make} ${driver.ownVehicle.model}`}
                            className="w-full h-64 object-cover"
                          />
                          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                            <p className="text-white font-semibold text-lg">
                              {driver.ownVehicle.year} {driver.ownVehicle.make} {driver.ownVehicle.model}
                            </p>
                            <p className="text-white/80 text-sm">{driver.ownVehicle.type}</p>
                          </div>
                        </div>

                        {/* Vehicle Details */}
                        <div className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div className="bg-slate-50 rounded-lg p-4 text-center">
                              <Users className="w-6 h-6 text-slate-600 mx-auto mb-2" />
                              <p className="text-2xl font-bold text-slate-800">{driver.ownVehicle.seats}</p>
                              <p className="text-sm text-slate-500">Seats</p>
                            </div>
                            <div className="bg-slate-50 rounded-lg p-4 text-center">
                              <Calendar className="w-6 h-6 text-slate-600 mx-auto mb-2" />
                              <p className="text-2xl font-bold text-slate-800">{driver.ownVehicle.year}</p>
                              <p className="text-sm text-slate-500">Year</p>
                            </div>
                          </div>

                          <div>
                            <h5 className="font-medium text-slate-700 mb-2">Features</h5>
                            <div className="flex flex-wrap gap-2">
                              {driver.ownVehicle.features.map((feature) => (
                                <Badge key={feature} variant="outline" className="text-xs">
                                  <CheckCircle className="w-3 h-3 mr-1 text-emerald-500" />
                                  {feature}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div>
                      {/* Drives Company/Any Vehicle */}
                      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6 text-center">
                        <Settings className="w-12 h-12 text-blue-500 mx-auto mb-3" />
                        <h4 className="text-lg font-semibold text-slate-800 mb-2">
                          {driver.vehiclePreference === 'company_vehicle' ? 'Drives Recharge Vehicles' : 'Flexible Vehicle Driver'}
                        </h4>
                        <p className="text-slate-600 mb-4">
                          {driver.vehiclePreference === 'company_vehicle'
                            ? 'This driver is certified to operate any vehicle from the Recharge Travels fleet.'
                            : 'This professional driver can operate various vehicle types based on your tour requirements.'}
                        </p>
                        <div className="flex flex-wrap justify-center gap-3">
                          <Badge variant="outline">Sedans</Badge>
                          <Badge variant="outline">SUVs</Badge>
                          <Badge variant="outline">Vans</Badge>
                          <Badge variant="outline">Mini Coaches</Badge>
                          <Badge variant="outline">Luxury Vehicles</Badge>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Coverage Areas */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-orange-500" />
                    Coverage Areas
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {driver.coverageAreas.map((area) => (
                      <div key={area} className="flex items-center gap-2 bg-slate-50 rounded-lg p-3">
                        <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                        <span className="text-slate-700">{area}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Customer Reviews Placeholder */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Star className="w-5 h-5 text-orange-500" />
                    Customer Reviews
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-xl p-8 text-center">
                    <MessageCircle className="w-12 h-12 text-amber-500 mx-auto mb-4" />
                    <h4 className="text-lg font-semibold text-slate-800 mb-2">Reviews Coming Soon</h4>
                    <p className="text-slate-600 mb-4">
                      After completing your tour with {driver.shortName}, you'll be able to share your experience here.
                    </p>
                    <div className="flex justify-center gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star key={star} className="w-8 h-8 text-amber-300" />
                      ))}
                    </div>
                    <p className="text-sm text-slate-500 mt-4">
                      Current Rating: <span className="font-semibold text-amber-600">{driver.rating}/5</span> from {driver.totalReviews} reviews
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Sidebar */}
            <div className="space-y-6">
              {/* Quick Stats Card */}
              <Card className="sticky top-24">
                <CardHeader className="bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-t-lg">
                  <CardTitle className="text-center">Driver Statistics</CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    {/* Rating */}
                    <div className="flex items-center justify-between p-3 bg-amber-50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
                        <span className="text-slate-700">Rating</span>
                      </div>
                      <span className="font-bold text-lg">{driver.rating}/5</span>
                    </div>

                    {/* Total Trips */}
                    <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <Route className="w-5 h-5 text-blue-500" />
                        <span className="text-slate-700">Total Trips</span>
                      </div>
                      <span className="font-bold text-lg">{driver.totalTrips}</span>
                    </div>

                    {/* Experience */}
                    <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <Award className="w-5 h-5 text-purple-500" />
                        <span className="text-slate-700">Experience</span>
                      </div>
                      <span className="font-bold text-lg">{driver.yearsExperience} years</span>
                    </div>

                    {/* Response Time */}
                    <div className="flex items-center justify-between p-3 bg-emerald-50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <Timer className="w-5 h-5 text-emerald-500" />
                        <span className="text-slate-700">Response Time</span>
                      </div>
                      <span className="font-bold text-lg">{driver.responseTime}</span>
                    </div>

                    {/* Acceptance Rate */}
                    <div className="flex items-center justify-between p-3 bg-cyan-50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <ThumbsUp className="w-5 h-5 text-cyan-500" />
                        <span className="text-slate-700">Acceptance Rate</span>
                      </div>
                      <span className="font-bold text-lg">{driver.acceptanceRate}%</span>
                    </div>

                    {/* Completion Rate */}
                    <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-5 h-5 text-green-500" />
                        <span className="text-slate-700">Completion Rate</span>
                      </div>
                      <span className="font-bold text-lg">{driver.completionRate}%</span>
                    </div>
                  </div>

                  {/* Contact Button */}
                  <div className="mt-6 space-y-3">
                    <a href={`https://wa.me/${driver.whatsapp.replace(/[^0-9]/g, '')}`} target="_blank" rel="noopener noreferrer" className="block">
                      <Button className="w-full bg-emerald-500 hover:bg-emerald-600">
                        <MessageCircle className="w-4 h-4 mr-2" />
                        WhatsApp {driver.shortName}
                      </Button>
                    </a>
                    <a href={`tel:${driver.phone}`} className="block">
                      <Button variant="outline" className="w-full">
                        <Phone className="w-4 h-4 mr-2" />
                        Call Now
                      </Button>
                    </a>
                  </div>
                </CardContent>
              </Card>

              {/* Verification Card */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Verification Status</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-full ${driver.isVerified ? 'bg-emerald-100' : 'bg-slate-100'}`}>
                      <Verified className={`w-4 h-4 ${driver.isVerified ? 'text-emerald-600' : 'text-slate-400'}`} />
                    </div>
                    <div>
                      <p className="font-medium text-sm">Recharge Verified</p>
                      <p className="text-xs text-slate-500">{driver.isVerified ? 'Identity confirmed' : 'Pending verification'}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-full ${driver.isSLTDAApproved ? 'bg-blue-100' : 'bg-slate-100'}`}>
                      <Shield className={`w-4 h-4 ${driver.isSLTDAApproved ? 'text-blue-600' : 'text-slate-400'}`} />
                    </div>
                    <div>
                      <p className="font-medium text-sm">SLTDA Licensed</p>
                      <p className="text-xs text-slate-500">{driver.isSLTDAApproved ? 'Tourism authority approved' : 'Not applicable'}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-full ${driver.isTourGuide ? 'bg-purple-100' : 'bg-slate-100'}`}>
                      <Award className={`w-4 h-4 ${driver.isTourGuide ? 'text-purple-600' : 'text-slate-400'}`} />
                    </div>
                    <div>
                      <p className="font-medium text-sm">Tour Guide License</p>
                      <p className="text-xs text-slate-500">{driver.isTourGuide ? 'Certified guide' : 'Driver only'}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Contact Info Card */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Contact Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="w-4 h-4 text-slate-400" />
                    <span>{driver.phone}</span>
                  </div>
                  {driver.email && (
                    <div className="flex items-center gap-2 text-sm">
                      <Mail className="w-4 h-4 text-slate-400" />
                      <span>{driver.email}</span>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
};

export default DriverProfile;
