
import React from 'react';
import { Link } from 'react-router-dom';
import { Car, MapPin, Clock, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export const TransferHomePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Airport & Hotel Transfers in Sri Lanka
            </h1>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              Reliable, professional transportation with experienced drivers and modern vehicles
            </p>
            <Link to="/transport/book">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
                Book Your Transfer Now
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">
            Why Choose Our Transfer Service?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="text-center">
              <CardContent className="p-6">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Car className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Professional Drivers</h3>
                <p className="text-gray-600">
                  Experienced, licensed drivers who know Sri Lanka inside out
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="p-6">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MapPin className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Real-time Tracking</h3>
                <p className="text-gray-600">
                  Track your driver's location in real-time for peace of mind
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="p-6">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Clock className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">24/7 Availability</h3>
                <p className="text-gray-600">
                  Round-the-clock service for all your transfer needs
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="p-6">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-8 h-8 text-orange-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Transparent Pricing</h3>
                <p className="text-gray-600">
                  No hidden fees, know your fare upfront with detailed breakdown
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gray-100">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Book Your Transfer?</h2>
          <p className="text-lg text-gray-600 mb-8">
            Get started with our easy booking process and enjoy a comfortable ride
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/transport/book">
              <Button size="lg" className="w-full sm:w-auto">
                Book Now
              </Button>
            </Link>
            <Link to="/transport/my-bookings">
              <Button variant="outline" size="lg" className="w-full sm:w-auto">
                View My Bookings
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
