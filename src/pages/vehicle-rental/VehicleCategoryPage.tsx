import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import {
    Users,
    Briefcase,
    CheckCircle2,
    ArrowRight,
    ArrowLeft,
    Calendar,
    MapPin,
    Shield,
    Star,
    Fuel,
    Gauge,
    Car,
    Globe,
    MessageCircle,
    Plus,
    Minus,
    ChevronLeft,
    ChevronRight,
} from 'lucide-react';

interface VehicleVariant {
    name: string;
    seats: number;
    bagsWithPassengers: number;
    maxPassengers: number;
    largeBags: number;
    smallBags: number;
    pricePerDay: number;
    image: string;
}

interface VehicleCategoryPageProps {
    categoryName: string;
    categorySlug: string;
    tagline: string;
    description: string;
    heroImages: string[];
    variants: VehicleVariant[];
    features: string[];
    idealFor: string[];
    addOns: { name: string; price: number; description: string }[];
}

const VehicleCategoryPage: React.FC<VehicleCategoryPageProps> = ({
    categoryName,
    categorySlug,
    tagline,
    description,
    heroImages,
    variants,
    features,
    idealFor,
    addOns,
}) => {
    const navigate = useNavigate();
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [selectedVariant, setSelectedVariant] = useState(0);
    const [pickupDate, setPickupDate] = useState('');
    const [returnDate, setReturnDate] = useState('');
    const [pickupLocation, setPickupLocation] = useState('bandaranaike-airport');
    const [withDriver, setWithDriver] = useState(true);
    const [selectedAddOns, setSelectedAddOns] = useState<string[]>([]);

    const nextImage = () => {
        setCurrentImageIndex((prev) => (prev + 1) % heroImages.length);
    };

    const prevImage = () => {
        setCurrentImageIndex((prev) => (prev - 1 + heroImages.length) % heroImages.length);
    };

    const toggleAddOn = (addOnName: string) => {
        setSelectedAddOns((prev) =>
            prev.includes(addOnName)
                ? prev.filter((a) => a !== addOnName)
                : [...prev, addOnName]
        );
    };

    const handleCheckAvailability = (e: React.FormEvent) => {
        e.preventDefault();
        const params = new URLSearchParams({
            type: categorySlug,
            variant: variants[selectedVariant].name,
            pickup: pickupLocation,
            start: pickupDate,
            end: returnDate,
            driver: withDriver ? 'yes' : 'no',
            addons: selectedAddOns.join(','),
        });
        navigate(`/vehicle-rental/booking?${params.toString()}`);
    };

    const currentVariant = variants[selectedVariant];

    return (
        <>
            <Helmet>
                <title>{categoryName} Vehicle Rental Sri Lanka | Recharge Travels</title>
                <meta name="description" content={`Rent ${categoryName} vehicles in Sri Lanka. ${description}`} />
                <link rel="canonical" href={`https://www.rechargetravels.com/vehicle-rental/${categorySlug}`} />
            </Helmet>

            <Header />

            <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50">
                {/* Hero Section with Image Gallery */}
                <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 pt-24 pb-16">
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-slate-900/50" />

                    <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        {/* Back Button */}
                        <Link
                            to="/vehicle-rental"
                            className="inline-flex items-center gap-2 text-gray-300 hover:text-white mb-6 transition-colors"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            Back to All Vehicles
                        </Link>

                        <div className="grid lg:grid-cols-2 gap-12 items-center">
                            {/* Left: Image Gallery */}
                            <div className="relative">
                                <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-slate-800">
                                    <img
                                        src={heroImages[currentImageIndex]}
                                        alt={`${categoryName} ${currentImageIndex + 1}`}
                                        className="w-full h-full object-cover"
                                    />

                                    {/* Navigation Arrows */}
                                    <button
                                        onClick={prevImage}
                                        className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/70 transition-colors"
                                    >
                                        <ChevronLeft className="w-6 h-6" />
                                    </button>
                                    <button
                                        onClick={nextImage}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/70 transition-colors"
                                    >
                                        <ChevronRight className="w-6 h-6" />
                                    </button>

                                    {/* Image Counter */}
                                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/60 text-white text-sm px-3 py-1 rounded-full">
                                        {currentImageIndex + 1} / {heroImages.length}
                                    </div>
                                </div>

                                {/* Thumbnail Strip */}
                                <div className="flex gap-2 mt-4 overflow-x-auto pb-2">
                                    {heroImages.map((img, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => setCurrentImageIndex(idx)}
                                            className={`flex-shrink-0 w-16 h-12 rounded-lg overflow-hidden border-2 transition-all ${idx === currentImageIndex ? 'border-amber-500' : 'border-transparent opacity-60 hover:opacity-100'
                                                }`}
                                        >
                                            <img src={img} alt="" className="w-full h-full object-cover" />
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Right: Category Info */}
                            <div>
                                <div className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/30 px-4 py-2 text-sm text-amber-300 mb-4">
                                    <Car className="w-4 h-4" />
                                    <span>{tagline}</span>
                                </div>

                                <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
                                    {categoryName}
                                    <span className="block text-2xl mt-2 text-amber-400">Vehicles</span>
                                </h1>

                                <p className="text-lg text-gray-300 mb-6">{description}</p>

                                {/* Variant Selection (if multiple) */}
                                {variants.length > 1 && (
                                    <div className="mb-6">
                                        <p className="text-sm text-gray-400 mb-3">Select Vehicle Type:</p>
                                        <div className="flex flex-wrap gap-3">
                                            {variants.map((variant, idx) => (
                                                <button
                                                    key={idx}
                                                    onClick={() => setSelectedVariant(idx)}
                                                    className={`px-4 py-2 rounded-xl font-medium transition-all ${idx === selectedVariant
                                                            ? 'bg-amber-500 text-white'
                                                            : 'bg-white/10 text-white hover:bg-white/20'
                                                        }`}
                                                >
                                                    {variant.name}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Vehicle Specs */}
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                                    <div className="bg-white/10 rounded-xl p-4 text-center">
                                        <Users className="w-6 h-6 text-amber-400 mx-auto mb-2" />
                                        <p className="text-2xl font-bold text-white">{currentVariant.seats}</p>
                                        <p className="text-xs text-gray-400">Seats</p>
                                    </div>
                                    <div className="bg-white/10 rounded-xl p-4 text-center">
                                        <Briefcase className="w-6 h-6 text-amber-400 mx-auto mb-2" />
                                        <p className="text-2xl font-bold text-white">{currentVariant.largeBags}</p>
                                        <p className="text-xs text-gray-400">Large Bags</p>
                                    </div>
                                    <div className="bg-white/10 rounded-xl p-4 text-center">
                                        <Briefcase className="w-5 h-5 text-amber-400 mx-auto mb-2" />
                                        <p className="text-2xl font-bold text-white">{currentVariant.smallBags}</p>
                                        <p className="text-xs text-gray-400">Small Bags</p>
                                    </div>
                                    <div className="bg-white/10 rounded-xl p-4 text-center">
                                        <Users className="w-6 h-6 text-green-400 mx-auto mb-2" />
                                        <p className="text-2xl font-bold text-white">{currentVariant.maxPassengers}</p>
                                        <p className="text-xs text-gray-400">Max Passengers</p>
                                    </div>
                                </div>

                                {/* Capacity Info */}
                                <div className="bg-white/5 rounded-xl p-4 mb-6 border border-white/10">
                                    <h4 className="text-white font-semibold mb-2">Capacity Options:</h4>
                                    <div className="space-y-2 text-sm text-gray-300">
                                        <p>✓ <strong>{currentVariant.bagsWithPassengers}</strong> passengers with luggage</p>
                                        <p>✓ <strong>{currentVariant.maxPassengers}</strong> passengers without luggage</p>
                                        <p>✓ <strong>{currentVariant.largeBags}</strong> large + <strong>{currentVariant.smallBags}</strong> small bags capacity</p>
                                    </div>
                                </div>

                                {/* Price */}
                                <div className="flex items-center gap-4">
                                    <div>
                                        <p className="text-sm text-gray-400">Starting from</p>
                                        <p className="text-3xl font-bold text-white">
                                            ${currentVariant.pricePerDay}
                                            <span className="text-lg text-gray-400">/day</span>
                                        </p>
                                    </div>
                                    <Link
                                        to="#booking"
                                        className="ml-auto inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold rounded-full hover:shadow-lg transition-all"
                                    >
                                        Book Now
                                        <ArrowRight className="w-5 h-5" />
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Features & Ideal For */}
                <section className="py-12 bg-white">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="grid md:grid-cols-2 gap-8">
                            {/* Features */}
                            <div className="bg-gradient-to-br from-slate-50 to-gray-50 rounded-2xl p-6">
                                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                                    Features Included
                                </h3>
                                <div className="grid grid-cols-2 gap-3">
                                    {features.map((feature, idx) => (
                                        <div key={idx} className="flex items-center gap-2 text-sm text-gray-700">
                                            <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" />
                                            {feature}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Ideal For */}
                            <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-6">
                                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                                    <Star className="w-5 h-5 text-amber-500" />
                                    Ideal For
                                </h3>
                                <div className="flex flex-wrap gap-2">
                                    {idealFor.map((item, idx) => (
                                        <span
                                            key={idx}
                                            className="inline-flex items-center px-3 py-1.5 bg-white rounded-full text-sm text-gray-700 shadow-sm"
                                        >
                                            {item}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Booking Engine */}
                <section id="booking" className="py-12 bg-gradient-to-b from-slate-900 to-slate-800">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-8">
                            <h2 className="text-3xl font-bold text-white mb-2">Book Your {categoryName}</h2>
                            <p className="text-gray-400">Check availability and request your booking</p>
                        </div>

                        <form onSubmit={handleCheckAvailability} className="bg-white rounded-2xl p-6 shadow-xl">
                            <div className="grid md:grid-cols-2 gap-6 mb-6">
                                {/* Pickup Location */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Pickup Location</label>
                                    <select
                                        value={pickupLocation}
                                        onChange={(e) => setPickupLocation(e.target.value)}
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                                    >
                                        <option value="bandaranaike-airport">Bandaranaike International Airport (CMB)</option>
                                        <option value="mattala-airport">Mattala Rajapaksa Airport (HRI)</option>
                                        <option value="colombo">Colombo City</option>
                                        <option value="negombo">Negombo</option>
                                        <option value="kandy">Kandy</option>
                                        <option value="galle">Galle</option>
                                        <option value="jaffna">Jaffna</option>
                                        <option value="other">Other Location</option>
                                    </select>
                                </div>

                                {/* Driver Option */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Driver Option</label>
                                    <div className="flex gap-3">
                                        <button
                                            type="button"
                                            onClick={() => setWithDriver(true)}
                                            className={`flex-1 py-3 rounded-xl font-medium transition-all ${withDriver
                                                    ? 'bg-amber-500 text-white'
                                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                                }`}
                                        >
                                            With Driver
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setWithDriver(false)}
                                            className={`flex-1 py-3 rounded-xl font-medium transition-all ${!withDriver
                                                    ? 'bg-amber-500 text-white'
                                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                                }`}
                                        >
                                            Self-Drive
                                        </button>
                                    </div>
                                </div>

                                {/* Pickup Date */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Pickup Date</label>
                                    <input
                                        type="date"
                                        value={pickupDate}
                                        onChange={(e) => setPickupDate(e.target.value)}
                                        min={new Date().toISOString().split('T')[0]}
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                                        required
                                    />
                                </div>

                                {/* Return Date */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Return Date</label>
                                    <input
                                        type="date"
                                        value={returnDate}
                                        onChange={(e) => setReturnDate(e.target.value)}
                                        min={pickupDate || new Date().toISOString().split('T')[0]}
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Self-Drive Notice */}
                            {!withDriver && (
                                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
                                    <p className="text-sm text-amber-800">
                                        <strong>Self-Drive Requirement:</strong> International tourists must obtain a Sri Lanka-issued
                                        Temporary Driving Licence. We can assist with the application process.
                                    </p>
                                </div>
                            )}

                            {/* Add-Ons */}
                            {addOns.length > 0 && (
                                <div className="mb-6">
                                    <h4 className="font-semibold text-gray-900 mb-3">Add-Ons (Optional)</h4>
                                    <div className="grid sm:grid-cols-2 gap-3">
                                        {addOns.map((addOn, idx) => (
                                            <button
                                                key={idx}
                                                type="button"
                                                onClick={() => toggleAddOn(addOn.name)}
                                                className={`flex items-center justify-between p-3 rounded-xl border-2 transition-all text-left ${selectedAddOns.includes(addOn.name)
                                                        ? 'border-amber-500 bg-amber-50'
                                                        : 'border-gray-200 hover:border-gray-300'
                                                    }`}
                                            >
                                                <div>
                                                    <p className="font-medium text-gray-900">{addOn.name}</p>
                                                    <p className="text-xs text-gray-500">{addOn.description}</p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="font-bold text-amber-600">+${addOn.price}</p>
                                                    {selectedAddOns.includes(addOn.name) ? (
                                                        <Minus className="w-5 h-5 text-amber-600 ml-auto" />
                                                    ) : (
                                                        <Plus className="w-5 h-5 text-gray-400 ml-auto" />
                                                    )}
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <button
                                type="submit"
                                className="w-full py-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold rounded-xl hover:shadow-lg transition-all flex items-center justify-center gap-2"
                            >
                                Check Availability
                                <ArrowRight className="w-5 h-5" />
                            </button>

                            <p className="text-center text-sm text-gray-500 mt-4">
                                We'll confirm availability within 2 hours. Payment only after confirmation.
                            </p>
                        </form>
                    </div>
                </section>

                {/* Trust Section */}
                <section className="py-12 bg-white">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex flex-wrap justify-center gap-8">
                            <div className="flex items-center gap-2 text-gray-600">
                                <Shield className="w-5 h-5 text-green-500" />
                                <span>Fully Insured</span>
                            </div>
                            <div className="flex items-center gap-2 text-gray-600">
                                <Globe className="w-5 h-5 text-blue-500" />
                                <span>Tourist Friendly</span>
                            </div>
                            <div className="flex items-center gap-2 text-gray-600">
                                <Star className="w-5 h-5 text-amber-500" />
                                <span>4.8+ Rating</span>
                            </div>
                            <div className="flex items-center gap-2 text-gray-600">
                                <MessageCircle className="w-5 h-5 text-purple-500" />
                                <span>24/7 Support</span>
                            </div>
                        </div>
                    </div>
                </section>
            </div>

            <Footer />
        </>
    );
};

export default VehicleCategoryPage;
