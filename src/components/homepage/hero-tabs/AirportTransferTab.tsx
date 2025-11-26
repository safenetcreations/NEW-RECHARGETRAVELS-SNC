import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Calendar, Users, Luggage, ArrowRight, Plane, ArrowLeft, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTransportBooking } from '@/contexts/TransportBookingContext';
import VehicleSelector from '@/components/booking/VehicleSelector';
import TransportBookingModal from '@/components/booking/TransportBookingModal';

type Step = 'form' | 'vehicles' | 'confirmation';

const AirportTransferTab = () => {
  const { airports, locations, vehicles, calculateAirportTransferPrice, loading } = useTransportBooking();
  const [step, setStep] = useState<Step>('form');
  const [transferType, setTransferType] = useState<'toAirport' | 'fromAirport'>('fromAirport');
  const [selectedVehicle, setSelectedVehicle] = useState<string | null>(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [formData, setFormData] = useState({
    airport: 'CMB',
    location: '',
    date: '',
    time: '',
    passengers: 2,
    luggage: 2
  });

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep('vehicles');
  };

  const handleVehicleSelect = (vehicleId: string) => {
    setSelectedVehicle(vehicleId);
    setShowBookingModal(true);
  };

  const handleBookingComplete = () => {
    setShowBookingModal(false);
    setStep('confirmation');
  };

  const handleBackToForm = () => {
    setStep('form');
    setSelectedVehicle(null);
  };

  const handleStartOver = () => {
    setStep('form');
    setSelectedVehicle(null);
    setFormData({
      airport: 'CMB',
      location: '',
      date: '',
      time: '',
      passengers: 2,
      luggage: 2
    });
  };

  const getSelectedVehicleDetails = () => {
    return vehicles.find(v => v.id === selectedVehicle);
  };

  const getCalculatedPrice = () => {
    if (!selectedVehicle) return 0;
    return calculateAirportTransferPrice(selectedVehicle, formData.airport, formData.location.toLowerCase().replace(/\s+/g, '-'));
  };

  // Use context data or fallback to defaults
  const airportOptions = airports.length > 0 ? airports : [
    { id: 'CMB', name: 'Bandaranaike International Airport', code: 'CMB' },
    { id: 'HRI', name: 'Mattala Rajapaksa International Airport', code: 'HRI' }
  ];

  const locationOptions = locations.length > 0 ? locations.map(l => l.name) : [
    'Colombo City',
    'Kandy',
    'Galle',
    'Negombo',
    'Sigiriya',
    'Ella',
    'Nuwara Eliya',
    'Bentota',
    'Mirissa',
    'Arugam Bay'
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
        <span className="ml-3 text-gray-600">Loading...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <AnimatePresence mode="wait">
        {step === 'form' && (
          <motion.div
            key="form"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3 }}
          >
            {/* Transfer Type Toggle */}
            <div className="flex gap-4 p-1 bg-gray-100 rounded-lg mb-6">
              <button
                onClick={() => setTransferType('fromAirport')}
                className={`flex-1 py-3 px-6 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 ${
                  transferType === 'fromAirport'
                    ? 'bg-emerald-600 text-white shadow-lg'
                    : 'text-gray-600 hover:bg-gray-200'
                }`}
              >
                <Plane className="w-5 h-5" />
                From Airport
              </button>
              <button
                onClick={() => setTransferType('toAirport')}
                className={`flex-1 py-3 px-6 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 ${
                  transferType === 'toAirport'
                    ? 'bg-emerald-600 text-white shadow-lg'
                    : 'text-gray-600 hover:bg-gray-200'
                }`}
              >
                <Plane className="w-5 h-5 transform rotate-45" />
                To Airport
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <MapPin className="w-4 h-4 inline mr-1" />
                  Airport
                </label>
                <select
                  value={formData.airport}
                  onChange={(e) => setFormData({ ...formData, airport: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                >
                  {airportOptions.map((airport) => (
                    <option key={airport.id} value={airport.id}>
                      {airport.name} ({airport.code})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <MapPin className="w-4 h-4 inline mr-1" />
                  {transferType === 'fromAirport' ? 'Drop-off Location' : 'Pick-up Location'}
                </label>
                <input
                  type="text"
                  list="locations"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder="Enter city or hotel name"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                  required
                />
                <datalist id="locations">
                  {locationOptions.map((location) => (
                    <option key={location} value={location} />
                  ))}
                </datalist>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    <Calendar className="w-4 h-4 inline mr-1" />
                    Date
                  </label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Time
                  </label>
                  <input
                    type="time"
                    value={formData.time}
                    onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    <Users className="w-4 h-4 inline mr-1" />
                    Passengers
                  </label>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, passengers: Math.max(1, formData.passengers - 1) })}
                      className="w-10 h-10 rounded-lg border border-gray-300 hover:bg-gray-100 transition-all flex items-center justify-center font-bold"
                    >
                      -
                    </button>
                    <span className="flex-1 text-center font-semibold text-lg">{formData.passengers}</span>
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, passengers: Math.min(12, formData.passengers + 1) })}
                      className="w-10 h-10 rounded-lg border border-gray-300 hover:bg-gray-100 transition-all flex items-center justify-center font-bold"
                    >
                      +
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    <Luggage className="w-4 h-4 inline mr-1" />
                    Luggage
                  </label>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, luggage: Math.max(0, formData.luggage - 1) })}
                      className="w-10 h-10 rounded-lg border border-gray-300 hover:bg-gray-100 transition-all flex items-center justify-center font-bold"
                    >
                      -
                    </button>
                    <span className="flex-1 text-center font-semibold text-lg">{formData.luggage}</span>
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, luggage: Math.min(15, formData.luggage + 1) })}
                      className="w-10 h-10 rounded-lg border border-gray-300 hover:bg-gray-100 transition-all flex items-center justify-center font-bold"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>

              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button
                  type="submit"
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-6 text-lg font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
                >
                  Check Availability & Prices
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </motion.div>

              <p className="text-center text-sm text-gray-500">
                Free cancellation up to 24 hours before transfer • Professional drivers • Meet & Greet service
              </p>
            </form>
          </motion.div>
        )}

        {step === 'vehicles' && (
          <motion.div
            key="vehicles"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {/* Back Button */}
            <button
              onClick={handleBackToForm}
              className="flex items-center gap-2 text-emerald-600 hover:text-emerald-700 font-medium mb-4"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to search
            </button>

            {/* Summary */}
            <div className="bg-emerald-50 rounded-lg p-4 mb-6">
              <h3 className="font-semibold text-emerald-800 mb-2">Transfer Details</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="text-gray-500">From:</span>
                  <p className="font-medium">{transferType === 'fromAirport' ? airportOptions.find(a => a.id === formData.airport)?.name : formData.location}</p>
                </div>
                <div>
                  <span className="text-gray-500">To:</span>
                  <p className="font-medium">{transferType === 'toAirport' ? airportOptions.find(a => a.id === formData.airport)?.name : formData.location}</p>
                </div>
                <div>
                  <span className="text-gray-500">Date & Time:</span>
                  <p className="font-medium">{formData.date} at {formData.time}</p>
                </div>
                <div>
                  <span className="text-gray-500">Travelers:</span>
                  <p className="font-medium">{formData.passengers} passengers, {formData.luggage} bags</p>
                </div>
              </div>
            </div>

            {/* Vehicle Selection */}
            <VehicleSelector
              vehicles={vehicles}
              selectedVehicle={selectedVehicle}
              onSelect={handleVehicleSelect}
              passengerCount={formData.passengers}
              luggageCount={formData.luggage}
              calculatePrice={(vehicleId) => calculateAirportTransferPrice(vehicleId, formData.airport, formData.location.toLowerCase().replace(/\s+/g, '-'))}
            />
          </motion.div>
        )}

        {step === 'confirmation' && (
          <motion.div
            key="confirmation"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className="text-center py-8"
          >
            <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-emerald-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">Booking Request Sent!</h3>
            <p className="text-gray-600 mb-6">
              We've received your booking request. Our team will contact you shortly to confirm the details.
            </p>
            <Button
              onClick={handleStartOver}
              className="bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              Book Another Transfer
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Booking Modal */}
      {showBookingModal && selectedVehicle && (
        <TransportBookingModal
          isOpen={showBookingModal}
          onClose={() => setShowBookingModal(false)}
          bookingType="airport-transfer"
          bookingDetails={{
            transferType,
            airport: formData.airport,
            airportName: airportOptions.find(a => a.id === formData.airport)?.name || '',
            location: formData.location,
            date: formData.date,
            time: formData.time,
            passengers: formData.passengers,
            luggage: formData.luggage,
            vehicle: getSelectedVehicleDetails(),
            price: getCalculatedPrice()
          }}
          onBookingComplete={handleBookingComplete}
        />
      )}
    </div>
  );
};

export default AirportTransferTab;
