import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, Clock, MapPin, Users, Car, Hotel, Utensils, ChevronRight, Check, Plus } from 'lucide-react';
import { DatePicker } from '@/components/ui/date-picker';
import { addDays } from 'date-fns';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Helmet } from 'react-helmet-async';

interface Vehicle {
  id: string;
  name: string;
  type: string;
  capacity: number;
  pricePerDay: number;
  features: string[];
  image: string;
}

interface Hotel {
  id: string;
  name: string;
  rating: number;
  location: string;
  pricePerNight: number;
  amenities: string[];
  image: string;
}

interface AdditionalService {
  id: string;
  name: string;
  price: number;
  description: string;
  icon: string;
}

const ExperienceBooking: React.FC = () => {
  const { experienceSlug } = useParams();
  const navigate = useNavigate();

  const [activeStep, setActiveStep] = useState(1);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [selectedHotel, setSelectedHotel] = useState<Hotel | null>(null);
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [bookingData, setBookingData] = useState({
    startDate: new Date(),
    endDate: addDays(new Date(), 3),
    adults: 2,
    children: 0,
    specialRequests: ''
  });

  // Sample data - in production, this would come from Firebase
  const vehicles: Vehicle[] = [
    {
      id: 'v1',
      name: 'Toyota Prius Hybrid',
      type: 'Economy',
      capacity: 4,
      pricePerDay: 45,
      features: ['AC', 'GPS', 'Bluetooth', 'Eco-friendly'],
      image: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=500'
    },
    {
      id: 'v2',
      name: 'Toyota Hiace Van',
      type: 'Van',
      capacity: 10,
      pricePerDay: 85,
      features: ['AC', 'Spacious', 'Luggage space', 'Driver included'],
      image: 'https://images.unsplash.com/photo-1583267746897-2cf415887172?w=500'
    },
    {
      id: 'v3',
      name: 'Land Cruiser',
      type: 'SUV',
      capacity: 7,
      pricePerDay: 120,
      features: ['4WD', 'AC', 'GPS', 'Premium comfort'],
      image: 'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=500'
    }
  ];

  const hotels: Hotel[] = [
    {
      id: 'h1',
      name: 'Cinnamon Grand Colombo',
      rating: 5,
      location: 'Colombo City Center',
      pricePerNight: 150,
      amenities: ['Pool', 'Spa', 'Restaurant', 'Bar', 'Gym'],
      image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=500'
    },
    {
      id: 'h2',
      name: 'Jetwing Blue',
      rating: 4,
      location: 'Negombo Beach',
      pricePerNight: 95,
      amenities: ['Beach Access', 'Pool', 'Restaurant', 'Wi-Fi'],
      image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=500'
    },
    {
      id: 'h3',
      name: 'Heritage Kandalama',
      rating: 5,
      location: 'Dambulla',
      pricePerNight: 180,
      amenities: ['Lake View', 'Pool', 'Spa', 'Nature Tours'],
      image: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=500'
    }
  ];

  const additionalServices: AdditionalService[] = [
    {
      id: 's1',
      name: 'Traditional Sri Lankan Breakfast',
      price: 15,
      description: 'Hoppers, string hoppers, and curry',
      icon: 'breakfast'
    },
    {
      id: 's2',
      name: 'Professional Tour Guide',
      price: 50,
      description: 'English-speaking certified guide',
      icon: 'guide'
    },
    {
      id: 's3',
      name: 'Travel Insurance',
      price: 25,
      description: 'Comprehensive coverage for your trip',
      icon: 'insurance'
    },
    {
      id: 's4',
      name: 'Airport Transfer',
      price: 40,
      description: 'Pick-up and drop-off service',
      icon: 'transfer'
    }
  ];

  const calculateTotalPrice = () => {
    const days = Math.ceil((bookingData.endDate.getTime() - bookingData.startDate.getTime()) / (1000 * 60 * 60 * 24));
    let total = 0;

    if (selectedVehicle) {
      total += selectedVehicle.pricePerDay * days;
    }

    if (selectedHotel) {
      total += selectedHotel.pricePerNight * days;
    }

    selectedServices.forEach(serviceId => {
      const service = additionalServices.find(s => s.id === serviceId);
      if (service) {
        total += service.price;
      }
    });

    return total;
  };

  const steps = [
    { number: 1, title: 'Trip Details', icon: Calendar },
    { number: 2, title: 'Vehicle Selection', icon: Car },
    { number: 3, title: 'Accommodation', icon: Hotel },
    { number: 4, title: 'Additional Services', icon: Plus },
    { number: 5, title: 'Review & Payment', icon: Check }
  ];

  const renderStepContent = () => {
    switch (activeStep) {
      case 1:
        return (
          <div className="space-y-6">
            <h3 className="text-2xl font-semibold mb-6">When would you like to travel?</h3>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Start Date
                </label>
                <DatePicker
                  date={bookingData.startDate}
                  onDateChange={(date) => date && setBookingData({ ...bookingData, startDate: date })}
                  minDate={new Date()}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  End Date
                </label>
                <DatePicker
                  date={bookingData.endDate}
                  onDateChange={(date) => date && setBookingData({ ...bookingData, endDate: date })}
                  minDate={addDays(bookingData.startDate, 1)}
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Number of Adults
                </label>
                <select
                  value={bookingData.adults}
                  onChange={(e) => setBookingData({ ...bookingData, adults: parseInt(e.target.value) })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8].map(num => (
                    <option key={num} value={num}>{num} {num === 1 ? 'Adult' : 'Adults'}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Number of Children
                </label>
                <select
                  value={bookingData.children}
                  onChange={(e) => setBookingData({ ...bookingData, children: parseInt(e.target.value) })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                >
                  {[0, 1, 2, 3, 4, 5, 6].map(num => (
                    <option key={num} value={num}>{num} {num === 1 ? 'Child' : 'Children'}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Special Requests (Optional)
              </label>
              <textarea
                value={bookingData.specialRequests}
                onChange={(e) => setBookingData({ ...bookingData, specialRequests: e.target.value })}
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="Any special requirements or preferences for your trip..."
              />
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <h3 className="text-2xl font-semibold mb-6">Choose your vehicle</h3>
            
            <div className="grid md:grid-cols-3 gap-6">
              {vehicles.map((vehicle) => (
                <motion.div
                  key={vehicle.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`border-2 rounded-xl overflow-hidden cursor-pointer transition-all ${
                    selectedVehicle?.id === vehicle.id
                      ? 'border-orange-500 shadow-lg'
                      : 'border-gray-200 hover:border-orange-300'
                  }`}
                  onClick={() => setSelectedVehicle(vehicle)}
                >
                  <img
                    src={vehicle.image}
                    alt={vehicle.name}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-4">
                    <h4 className="font-semibold text-lg">{vehicle.name}</h4>
                    <p className="text-sm text-gray-600 mb-2">{vehicle.type} • {vehicle.capacity} passengers</p>
                    <div className="flex flex-wrap gap-2 mb-3">
                      {vehicle.features.map((feature, index) => (
                        <span key={index} className="text-xs bg-gray-100 px-2 py-1 rounded">
                          {feature}
                        </span>
                      ))}
                    </div>
                    <p className="text-2xl font-bold text-orange-600">${vehicle.pricePerDay}/day</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <h3 className="text-2xl font-semibold mb-6">Select your accommodation</h3>
            
            <div className="space-y-4">
              {hotels.map((hotel) => (
                <motion.div
                  key={hotel.id}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  className={`border-2 rounded-xl overflow-hidden cursor-pointer transition-all ${
                    selectedHotel?.id === hotel.id
                      ? 'border-orange-500 shadow-lg'
                      : 'border-gray-200 hover:border-orange-300'
                  }`}
                  onClick={() => setSelectedHotel(hotel)}
                >
                  <div className="flex flex-col md:flex-row">
                    <img
                      src={hotel.image}
                      alt={hotel.name}
                      className="w-full md:w-64 h-48 md:h-40 object-cover"
                    />
                    <div className="p-6 flex-grow">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h4 className="font-semibold text-xl">{hotel.name}</h4>
                          <p className="text-gray-600 flex items-center mt-1">
                            <MapPin className="w-4 h-4 mr-1" />
                            {hotel.location}
                          </p>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center">
                            {[...Array(hotel.rating)].map((_, i) => (
                              <span key={i} className="text-yellow-400">★</span>
                            ))}
                          </div>
                          <p className="text-2xl font-bold text-orange-600 mt-1">
                            ${hotel.pricePerNight}/night
                          </p>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2 mt-3">
                        {hotel.amenities.map((amenity, index) => (
                          <span key={index} className="text-sm bg-gray-100 px-3 py-1 rounded-full">
                            {amenity}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <h3 className="text-2xl font-semibold mb-6">Enhance your experience</h3>
            
            <div className="grid md:grid-cols-2 gap-4">
              {additionalServices.map((service) => (
                <div
                  key={service.id}
                  className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                    selectedServices.includes(service.id)
                      ? 'border-orange-500 bg-orange-50'
                      : 'border-gray-200 hover:border-orange-300'
                  }`}
                  onClick={() => {
                    setSelectedServices(prev =>
                      prev.includes(service.id)
                        ? prev.filter(id => id !== service.id)
                        : [...prev, service.id]
                    );
                  }}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-grow">
                      <h4 className="font-semibold text-lg">{service.name}</h4>
                      <p className="text-gray-600 text-sm mt-1">{service.description}</p>
                    </div>
                    <div className="text-right ml-4">
                      <p className="text-xl font-bold text-orange-600">+${service.price}</p>
                      <div className={`w-6 h-6 rounded-full border-2 mt-2 flex items-center justify-center ${
                        selectedServices.includes(service.id)
                          ? 'bg-orange-500 border-orange-500'
                          : 'border-gray-300'
                      }`}>
                        {selectedServices.includes(service.id) && (
                          <Check className="w-4 h-4 text-white" />
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <h3 className="text-2xl font-semibold mb-6">Review your booking</h3>
            
            <div className="bg-gray-50 rounded-xl p-6 space-y-4">
              <div className="border-b pb-4">
                <h4 className="font-semibold text-lg mb-2">Trip Details</h4>
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Duration:</span>
                    <span className="ml-2 font-medium">
                      {Math.ceil((bookingData.endDate.getTime() - bookingData.startDate.getTime()) / (1000 * 60 * 60 * 24))} days
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-600">Travelers:</span>
                    <span className="ml-2 font-medium">
                      {bookingData.adults} adults, {bookingData.children} children
                    </span>
                  </div>
                </div>
              </div>

              {selectedVehicle && (
                <div className="border-b pb-4">
                  <h4 className="font-semibold text-lg mb-2">Vehicle</h4>
                  <div className="flex justify-between items-center">
                    <span>{selectedVehicle.name}</span>
                    <span className="font-semibold">${selectedVehicle.pricePerDay}/day</span>
                  </div>
                </div>
              )}

              {selectedHotel && (
                <div className="border-b pb-4">
                  <h4 className="font-semibold text-lg mb-2">Accommodation</h4>
                  <div className="flex justify-between items-center">
                    <span>{selectedHotel.name}</span>
                    <span className="font-semibold">${selectedHotel.pricePerNight}/night</span>
                  </div>
                </div>
              )}

              {selectedServices.length > 0 && (
                <div className="border-b pb-4">
                  <h4 className="font-semibold text-lg mb-2">Additional Services</h4>
                  {selectedServices.map(serviceId => {
                    const service = additionalServices.find(s => s.id === serviceId);
                    return service ? (
                      <div key={service.id} className="flex justify-between items-center">
                        <span>{service.name}</span>
                        <span className="font-semibold">${service.price}</span>
                      </div>
                    ) : null;
                  })}
                </div>
              )}

              <div className="pt-2">
                <div className="flex justify-between items-center text-xl font-bold">
                  <span>Total Price</span>
                  <span className="text-orange-600">${calculateTotalPrice()}</span>
                </div>
              </div>
            </div>

            <button className="w-full bg-orange-500 text-white py-4 rounded-xl font-semibold text-lg hover:bg-orange-600 transition-colors">
              Proceed to Payment
            </button>
          </div>
        );

      default:
        return null;
    }
  };

  // Experience details (would come from Firebase in production)
  const experienceDetails = {
    'whale-watching': {
      title: 'Whale Watching Experience',
      description: 'Encounter the majestic blue whales and dolphins in their natural habitat off the coast of Sri Lanka',
      image: 'https://images.unsplash.com/photo-1568430462989-44163eb1752f?w=1920&h=800&fit=crop',
      duration: 'Half Day (4-5 hours)',
      location: 'Mirissa / Trincomalee',
      highlights: [
        'Blue whale sightings',
        'Dolphin encounters',
        'Professional marine biologist guide',
        'Breakfast included',
        'Safety equipment provided'
      ],
      basePrice: 75
    }
  };

  const currentExperience = experienceDetails[experienceSlug || 'whale-watching'];

  return (
    <>
      <Helmet>
        <title>Book {currentExperience.title} - Recharge Travels</title>
        <meta name="description" content={`Book your ${currentExperience.title} with Recharge Travels. Customize your experience with vehicle, accommodation and additional services.`} />
      </Helmet>

      <Header />

      <div className="min-h-screen bg-gray-50">
        {/* Experience Header */}
        <div className="relative h-64 md:h-80 overflow-hidden">
          <img 
            src={currentExperience.image} 
            alt={currentExperience.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-black/20 flex items-end">
            <div className="container mx-auto px-4 pb-8 text-white">
              <h1 className="text-3xl md:text-4xl font-bold mb-2">
                Book Your {currentExperience.title}
              </h1>
              <p className="text-lg opacity-90">
                {currentExperience.description}
              </p>
              <div className="flex items-center gap-4 mt-4">
                <span className="flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  {currentExperience.duration}
                </span>
                <span className="flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  {currentExperience.location}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between max-w-4xl mx-auto">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <div key={step.number} className="flex items-center">
                  <div
                    className={`flex items-center justify-center w-12 h-12 rounded-full transition-all ${
                      activeStep >= step.number
                        ? 'bg-orange-500 text-white'
                        : 'bg-gray-200 text-gray-400'
                    }`}
                  >
                    <Icon className="w-6 h-6" />
                  </div>
                  <div className="ml-3 hidden md:block">
                    <p className={`text-sm font-medium ${
                      activeStep >= step.number ? 'text-gray-900' : 'text-gray-400'
                    }`}>
                      {step.title}
                    </p>
                  </div>
                  {index < steps.length - 1 && (
                    <div
                      className={`w-24 h-1 mx-4 transition-all ${
                        activeStep > step.number ? 'bg-orange-500' : 'bg-gray-200'
                      }`}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-lg p-8">
          <motion.div
            key={activeStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {renderStepContent()}
          </motion.div>

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8 pt-8 border-t">
            <button
              onClick={() => activeStep > 1 ? setActiveStep(activeStep - 1) : navigate(-1)}
              className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              {activeStep === 1 ? 'Cancel' : 'Previous'}
            </button>
            
            {activeStep < 5 && (
              <button
                onClick={() => setActiveStep(activeStep + 1)}
                className="px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors flex items-center"
              >
                Next
                <ChevronRight className="w-5 h-5 ml-2" />
              </button>
            )}
          </div>
        </div>
      </div>
      </div>

      <Footer />
    </>
  );
};

export default ExperienceBooking;
