import { lazy, Suspense, memo } from 'react';
import { Link } from 'react-router-dom';
import {
    MapPin,
    Calendar,
    MessageCircle,
    Compass,
    Car,
    Hotel,
    ArrowRight,
    Star,
    Phone
} from 'lucide-react';
import { Button } from '@/components/ui/button';

// Lazy load heavy components
const FeaturedDestinations = lazy(() => import("@/components/homepage/FeaturedDestinations"));

const MobileHome = memo(() => {
    return (
        <div className="flex flex-col min-h-screen bg-slate-50 pb-20">
            {/* Mobile Hero - Static & Lightweight */}
            <section className="relative h-[60vh] min-h-[400px] overflow-hidden bg-slate-900">
                <img
                    src="/mobile-hero.jpg"
                    alt="Sri Lanka Travel"
                    className="absolute inset-0 w-full h-full object-cover"
                    width="800"
                    height="600"
                    loading="eager"
                    fetchPriority="high"
                    decoding="async"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/80" />

                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                    <span className="inline-block px-3 py-1 mb-3 text-xs font-bold tracking-wider uppercase bg-orange-500 rounded-full">
                        #1 Travel Agency
                    </span>
                    <h1 className="text-4xl font-bold mb-2 leading-tight">
                        Discover <br /> <span className="text-orange-400">Sri Lanka</span>
                    </h1>
                    <p className="text-lg text-gray-200 mb-6 max-w-[80%]">
                        Luxury tours, safaris, and private transfers tailored for you.
                    </p>

                    <div className="flex gap-3">
                        <Link to="/book-now" className="flex-1">
                            <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold h-12 rounded-xl shadow-lg">
                                <Calendar className="w-4 h-4 mr-2" />
                                Plan My Trip
                            </Button>
                        </Link>
                        <a href="https://wa.me/94777721999" className="flex-none">
                            <Button size="icon" className="h-12 w-12 bg-green-500 hover:bg-green-600 rounded-xl shadow-lg">
                                <MessageCircle className="w-6 h-6 text-white" />
                            </Button>
                        </a>
                    </div>
                </div>
            </section>

            {/* Quick Navigation Grid */}
            <section className="px-4 -mt-8 relative z-10">
                <div className="bg-white rounded-2xl shadow-xl p-4 grid grid-cols-4 gap-2">
                    {[
                        { icon: Compass, label: 'Tours', href: '/tours', color: 'text-orange-500', bg: 'bg-orange-50' },
                        { icon: Car, label: 'Transport', href: '/transport/airport-transfers', color: 'text-blue-500', bg: 'bg-blue-50' },
                        { icon: Hotel, label: 'Hotels', href: '/hotels', color: 'text-purple-500', bg: 'bg-purple-50' },
                        { icon: MapPin, label: 'Places', href: '/destinations', color: 'text-emerald-500', bg: 'bg-emerald-50' },
                    ].map((item, idx) => (
                        <Link key={idx} to={item.href} className="flex flex-col items-center gap-2 p-2">
                            <div className={`w-12 h-12 rounded-xl ${item.bg} flex items-center justify-center`}>
                                <item.icon className={`w-6 h-6 ${item.color}`} />
                            </div>
                            <span className="text-xs font-medium text-slate-600">{item.label}</span>
                        </Link>
                    ))}
                </div>
            </section>

            {/* Airport Transfer Teaser (Lightweight) */}
            <section className="px-4 mt-8">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold text-slate-900">Airport Transfers</h2>
                    <Link to="/transport/airport-transfers" className="text-sm text-emerald-600 font-medium flex items-center">
                        View All <ArrowRight className="w-4 h-4 ml-1" />
                    </Link>
                </div>

                <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center">
                            <Car className="w-6 h-6 text-blue-600" />
                        </div>
                        <div>
                            <h3 className="font-bold text-slate-900">Private Chauffeur</h3>
                            <p className="text-xs text-slate-500">Fixed prices, 24/7 service</p>
                        </div>
                    </div>
                    <Link to="/transport/airport-transfers">
                        <Button variant="outline" className="w-full border-blue-200 text-blue-700 hover:bg-blue-50">
                            Book Transfer
                        </Button>
                    </Link>
                </div>
            </section>

            {/* Featured Destinations (Lazy Loaded) */}
            <section className="mt-8">
                <div className="px-4 mb-4">
                    <h2 className="text-xl font-bold text-slate-900">Popular Destinations</h2>
                </div>
                <Suspense fallback={<div className="h-64 bg-slate-100 animate-pulse mx-4 rounded-2xl" />}>
                    <div className="mobile-destinations-wrapper">
                        <FeaturedDestinations />
                    </div>
                </Suspense>
            </section>

            {/* Contact Bar */}
            <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 p-4 pb-safe z-50 flex items-center justify-between shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]">
                <div className="flex flex-col">
                    <span className="text-xs text-slate-500">Need help planning?</span>
                    <span className="text-sm font-bold text-slate-900">Talk to an expert</span>
                </div>
                <a href="tel:+94777721999">
                    <Button className="rounded-full bg-slate-900 text-white px-6">
                        <Phone className="w-4 h-4 mr-2" />
                        Call Now
                    </Button>
                </a>
            </div>
        </div>
    );
});

MobileHome.displayName = 'MobileHome';

export default MobileHome;
