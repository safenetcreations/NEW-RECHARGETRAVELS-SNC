
import React from 'react';
import { useParams } from 'react-router-dom';
import { MapPin, Phone, Car, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useBookingTracking } from '../hooks';

export const TrackingPage: React.FC = () => {
  const { bookingNumber } = useParams<{ bookingNumber: string }>();
  const { trackingData, isConnected, error } = useBookingTracking(bookingNumber || '');

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-full max-w-md">
          <CardContent className="text-center p-6">
            <p className="text-red-600 mb-4">Error loading tracking information</p>
            <p className="text-gray-600">{error}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Track Your Transfer</h1>
          <p className="text-gray-600">Booking #{bookingNumber}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Map Placeholder */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  Live Location
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[400px] bg-gray-100 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">Map integration coming soon</p>
                    {trackingData && (
                      <p className="text-sm text-gray-500 mt-2">
                        Last location: {trackingData.latitude.toFixed(4)}, {trackingData.longitude.toFixed(4)}
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Booking Details */}
          <div className="space-y-6">
            {/* Status Card */}
            <Card>
              <CardHeader>
                <CardTitle>Trip Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${
                    isConnected ? 'bg-green-500' : 'bg-gray-400'
                  }`} />
                  <span className="font-medium">
                    {isConnected ? 'Driver En Route' : 'Waiting for Driver'}
                  </span>
                </div>
                {trackingData && (
                  <div className="mt-4 space-y-2">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Clock className="w-4 h-4" />
                      Last updated: {new Date(trackingData.timestamp).toLocaleTimeString()}
                    </div>
                    {trackingData.speed && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Car className="w-4 h-4" />
                        Speed: {trackingData.speed} km/h
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Driver Details Card */}
            <Card>
              <CardHeader>
                <CardTitle>Driver Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-600">Driver Name</p>
                    <p className="font-medium">Driver details will appear here</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Vehicle</p>
                    <p className="font-medium">Vehicle details will appear here</p>
                  </div>
                  <div className="pt-2">
                    <button className="flex items-center gap-2 text-blue-600 hover:text-blue-700">
                      <Phone className="w-4 h-4" />
                      Contact Driver
                    </button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Booking Details Card */}
            <Card>
              <CardHeader>
                <CardTitle>Booking Details</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-600">Booking Number</p>
                    <p className="font-medium">{bookingNumber}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Pickup Location</p>
                    <p className="font-medium">Details will load here</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Drop-off Location</p>
                    <p className="font-medium">Details will load here</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};
