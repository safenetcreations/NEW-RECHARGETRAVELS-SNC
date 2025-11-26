
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { LoadScript } from '@react-google-maps/api';
import { BookingForm } from '../components/BookingForm/BookingForm';
import { useBookings } from '../hooks';
import type { BookingFormData } from '../types';
import { GOOGLE_MAPS_API_KEY, googleMapsLibraries } from '@/lib/googleMapsConfig';

export const BookingPage: React.FC = () => {
  const navigate = useNavigate();
  const { createBooking, isCreating } = useBookings();

  const handleBookingSubmit = async (data: BookingFormData) => {
    try {
      console.log('Submitting booking:', data);
      await createBooking(data);
      toast.success('Booking created successfully!');
      navigate('/transport/my-bookings');
    } catch (error) {
      console.error('Booking submission error:', error);
      toast.error('Failed to create booking. Please try again.');
    }
  };

  if (!GOOGLE_MAPS_API_KEY) {
    console.error('Google Maps API key is not configured');
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-800">Google Maps API key is not configured. Please check your configuration.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <LoadScript
      googleMapsApiKey={GOOGLE_MAPS_API_KEY}
      libraries={googleMapsLibraries}
      loadingElement={
        <div className="min-h-screen bg-gray-50 py-8">
          <div className="max-w-4xl mx-auto px-4">
            <div className="text-center">Loading Google Maps...</div>
          </div>
        </div>
      }
    >
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Book Your Transfer</h1>
            <p className="text-gray-600">
              Fill in the details below to book your airport or hotel transfer
            </p>
          </div>

          <BookingForm 
            onSubmit={handleBookingSubmit}
            isLoading={isCreating}
          />
        </div>
      </div>
    </LoadScript>
  );
};
