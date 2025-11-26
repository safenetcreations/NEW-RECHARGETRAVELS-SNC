import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plane, Car, MapPin, Mountain, CheckCircle2, Users, Clock, Shield, Star } from 'lucide-react';
import { TransportBookingProvider } from '@/contexts/TransportBookingContext';
import AirportTransferTab from './hero-tabs/AirportTransferTab';
import PersonalDriverTab from './hero-tabs/PersonalDriverTab';
import ToursTab from './hero-tabs/ToursTab';
import TrailServiceTab from './hero-tabs/TrailServiceTab';

const tabs = [
  { id: 'airport', label: 'Airport Transfer', icon: Plane, description: 'To/From Airport' },
  { id: 'driver', label: 'Personal Driver', icon: Car, description: 'Hire a Driver' },
  { id: 'tours', label: 'Tours', icon: MapPin, description: 'Explore Sri Lanka' },
  { id: 'trail', label: 'Trail Service', icon: Mountain, description: 'Adventure Trails' }
];

const trustBadges = [
  { icon: CheckCircle2, label: '24/7 Support', value: 'Always Available' },
  { icon: Users, label: 'Happy Customers', value: '10,000+' },
  { icon: Clock, label: 'Years Experience', value: '15+' },
  { icon: Shield, label: 'Licensed & Insured', value: 'SLTDA Approved' }
];

const ModernHeroSection = () => {
  const [activeTab, setActiveTab] = useState('airport');

  return (
    <TransportBookingProvider>
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1920&q=80"
            alt="Sri Lanka"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/50 to-emerald-900/60" />
        </div>

        {/* Animated Background Elements */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <motion.div
            className="absolute top-20 left-20 w-72 h-72 bg-emerald-500/20 rounded-full blur-3xl"
            animate={{
              y: [0, 30, 0],
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          <motion.div
            className="absolute bottom-20 right-20 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl"
            animate={{
              y: [0, -40, 0],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </div>

        {/* Content */}
        <div className="relative z-10 container mx-auto px-4 py-20">
          {/* Header */}
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full mb-6">
              <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
              <span className="text-white text-sm font-medium">Trusted by 10,000+ travelers</span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 leading-tight">
              Explore <span className="text-emerald-400">Sri Lanka</span>
              <br />Your Way
            </h1>
            <p className="text-lg md:text-xl text-gray-200 max-w-2xl mx-auto">
              Premium transport services across the island. Airport transfers, personal drivers,
              guided tours, and adventure trails.
            </p>
          </motion.div>

          {/* Booking Card with Tabs */}
          <motion.div
            className="max-w-5xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl overflow-hidden">
              {/* Tab Navigation */}
              <div className="flex flex-wrap border-b border-gray-200">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setActiveTab(tab.id)}
                      aria-selected={isActive}
                      role="tab"
                      className={`flex-1 min-w-[130px] flex items-center justify-center gap-2 px-3 py-4 lg:py-5 font-medium transition-all duration-300 ${
                        isActive
                          ? 'text-emerald-600 bg-emerald-50/80 border-b-2 border-emerald-600'
                          : 'text-gray-600 hover:text-emerald-600 hover:bg-gray-50'
                      }`}
                    >
                      <Icon className={`w-5 h-5 ${isActive ? 'text-emerald-600' : 'text-gray-400'}`} />
                      <div className="text-left hidden md:block">
                        <div className="text-sm font-semibold">{tab.label}</div>
                        <div className="text-xs text-gray-400">{tab.description}</div>
                      </div>
                      <span className="md:hidden text-xs">{tab.label.split(' ')[0]}</span>
                    </button>
                  );
                })}
              </div>

              {/* Tab Content */}
              <div className="p-4 md:p-6 lg:p-8">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    {activeTab === 'airport' && <AirportTransferTab />}
                    {activeTab === 'driver' && <PersonalDriverTab />}
                    {activeTab === 'tours' && <ToursTab />}
                    {activeTab === 'trail' && <TrailServiceTab />}
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </motion.div>

          {/* Trust Badges */}
          <motion.div
            className="mt-12 grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 max-w-5xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            {trustBadges.map((badge, index) => {
              const Icon = badge.icon;
              return (
                <motion.div
                  key={index}
                  className="bg-white/10 backdrop-blur-md rounded-xl p-4 text-center border border-white/20"
                  whileHover={{ scale: 1.05, backgroundColor: 'rgba(255,255,255,0.15)' }}
                  transition={{ duration: 0.2 }}
                >
                  <Icon className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
                  <div className="text-white font-bold text-lg">{badge.value}</div>
                  <div className="text-gray-300 text-sm">{badge.label}</div>
                </motion.div>
              );
            })}
          </motion.div>

          {/* Scroll Indicator */}
          <motion.div
            className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.5 }}
          >
            <motion.div
              className="w-6 h-10 border-2 border-white/50 rounded-full flex items-start justify-center p-2"
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <motion.div className="w-1.5 h-1.5 bg-white rounded-full" />
            </motion.div>
          </motion.div>
        </div>
      </section>
    </TransportBookingProvider>
  );
};

export default ModernHeroSection;
