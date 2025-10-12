
import React, { useState } from 'react';
import { MapPin, Clock, Phone, Mail, Star, Calendar, Users, ExternalLink, Navigation } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface RestaurantDetailProps {
  restaurant: {
    id: string;
    name: string;
    cuisine: string;
    location: string;
    priceLevel: string;
    rating: number;
    description: string;
    image: string;
    chef?: string;
    specialties: string[];
    hours: string;
    phone: string;
    address: string;
    nearbyAttractions: string[];
  };
}

const RestaurantDetail: React.FC<RestaurantDetailProps> = ({ restaurant }) => {
  const [selectedDate, setSelectedDate] = useState('');
  const [partySize, setPartySize] = useState(2);
  const [selectedTime, setSelectedTime] = useState('');

  const timeSlots = ['6:00 PM', '6:30 PM', '7:00 PM', '7:30 PM', '8:00 PM', '8:30 PM', '9:00 PM'];

  const sampleMenu = [
    { category: 'Appetizers', items: [
      { name: 'Crab Cakes', price: 'Rs. 2,800', description: 'Fresh mud crab with spicy mayo' },
      { name: 'Prawn Tempura', price: 'Rs. 2,200', description: 'Crispy prawns with sweet chili' }
    ]},
    { category: 'Main Course', items: [
      { name: 'Grilled Fish', price: 'Rs. 3,500', description: 'Fresh catch with coconut curry' },
      { name: 'Beef Tenderloin', price: 'Rs. 4,200', description: 'Prime cut with island spices' }
    ]},
    { category: 'Desserts', items: [
      { name: 'Coconut Panna Cotta', price: 'Rs. 1,200', description: 'Tropical flavors with palm sugar' },
      { name: 'Chocolate Lava Cake', price: 'Rs. 1,400', description: 'Warm cake with vanilla ice cream' }
    ]}
  ];

  const handleReservation = () => {
    // In a real implementation, this would connect to a booking API
    alert(`Reservation request for ${partySize} people on ${selectedDate} at ${selectedTime}`);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Hero Gallery */}
      <div className="mb-8">
        <div className="aspect-video rounded-lg overflow-hidden mb-4">
          <img 
            src={restaurant.image} 
            alt={`${restaurant.name} restaurant ambience and signature dishes`}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="grid grid-cols-4 gap-2">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="aspect-square rounded-lg overflow-hidden">
              <img 
                src={restaurant.image} 
                alt={`${restaurant.name} interior view ${i}`}
                className="w-full h-full object-cover hover:scale-105 transition-transform cursor-pointer"
              />
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Overview */}
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-3xl text-luxury-darkwood mb-2">
                    {restaurant.name}
                  </CardTitle>
                  <div className="flex items-center gap-4 text-luxury-spice">
                    <span className="bg-luxury-gold text-luxury-darkwood px-3 py-1 rounded-full text-sm font-medium">
                      {restaurant.cuisine}
                    </span>
                    <div className="flex items-center">
                      <Star className="h-4 w-4 text-luxury-gold fill-current mr-1" />
                      <span className="font-medium">{restaurant.rating}</span>
                    </div>
                    <span className="font-medium">{restaurant.priceLevel}</span>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-luxury-spice leading-relaxed mb-4">
                {restaurant.description} Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
                Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, 
                quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
              </p>
              {restaurant.chef && (
                <div className="bg-luxury-cream p-4 rounded-lg">
                  <h4 className="font-semibold text-luxury-darkwood mb-2">Chef Spotlight</h4>
                  <p className="text-luxury-spice">Chef {restaurant.chef} brings decades of culinary expertise, 
                  blending traditional Sri Lankan flavors with contemporary techniques.</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Menu Highlights */}
          <Card>
            <CardHeader>
              <CardTitle className="text-luxury-darkwood">Menu Highlights</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {sampleMenu.map((section, index) => (
                  <div key={index}>
                    <h4 className="text-lg font-semibold text-luxury-mahogany mb-3">
                      {section.category}
                    </h4>
                    <div className="grid gap-4">
                      {section.items.map((item, itemIndex) => (
                        <div key={itemIndex} className="flex justify-between items-start">
                          <div className="flex-1">
                            <h5 className="font-medium text-luxury-darkwood">{item.name}</h5>
                            <p className="text-sm text-luxury-spice">{item.description}</p>
                          </div>
                          <span className="font-semibold text-luxury-bronze ml-4">
                            {item.price}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              <Button className="w-full mt-6 bg-luxury-mahogany hover:bg-luxury-darkwood text-white">
                <ExternalLink className="mr-2 h-4 w-4" />
                View Full Menu
              </Button>
            </CardContent>
          </Card>

          {/* Location & Map */}
          <Card>
            <CardHeader>
              <CardTitle className="text-luxury-darkwood">Location & Directions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <div className="flex items-start gap-2 mb-2">
                  <MapPin className="h-5 w-5 text-luxury-mahogany mt-0.5" />
                  <div>
                    <p className="font-medium text-luxury-darkwood">{restaurant.address}</p>
                    <p className="text-luxury-spice">{restaurant.location}, Sri Lanka</p>
                  </div>
                </div>
              </div>
              
              {/* Map Placeholder */}
              <div className="h-64 bg-luxury-cream rounded-lg flex items-center justify-center mb-4">
                <div className="text-center text-luxury-spice">
                  <Navigation className="h-8 w-8 mx-auto mb-2" />
                  <p>Interactive Map</p>
                  <p className="text-sm">Google Maps integration</p>
                </div>
              </div>

              <Button className="w-full bg-luxury-bronze hover:bg-luxury-mahogany text-white">
                <Navigation className="mr-2 h-4 w-4" />
                Get Directions
              </Button>
            </CardContent>
          </Card>

          {/* Nearby Attractions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-luxury-darkwood">Nearby Attractions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3">
                {restaurant.nearbyAttractions.map((attraction, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 bg-luxury-cream rounded-lg">
                    <MapPin className="h-4 w-4 text-luxury-mahogany" />
                    <span className="text-luxury-darkwood">{attraction}</span>
                    <span className="text-sm text-luxury-spice ml-auto">2.1 km</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Reservation Card */}
          <Card className="sticky top-4">
            <CardHeader>
              <CardTitle className="text-luxury-darkwood">Make a Reservation</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-luxury-darkwood mb-2">
                  Date
                </label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full px-3 py-2 border border-luxury-bronze rounded-lg focus:ring-2 focus:ring-luxury-saffron focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-luxury-darkwood mb-2">
                  Party Size
                </label>
                <select
                  value={partySize}
                  onChange={(e) => setPartySize(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-luxury-bronze rounded-lg focus:ring-2 focus:ring-luxury-saffron focus:border-transparent"
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8].map(size => (
                    <option key={size} value={size}>{size} {size === 1 ? 'Guest' : 'Guests'}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-luxury-darkwood mb-2">
                  Preferred Time
                </label>
                <select
                  value={selectedTime}
                  onChange={(e) => setSelectedTime(e.target.value)}
                  className="w-full px-3 py-2 border border-luxury-bronze rounded-lg focus:ring-2 focus:ring-luxury-saffron focus:border-transparent"
                >
                  <option value="">Select time</option>
                  {timeSlots.map(time => (
                    <option key={time} value={time}>{time}</option>
                  ))}
                </select>
              </div>

              <Button 
                onClick={handleReservation}
                className="w-full bg-luxury-mahogany hover:bg-luxury-darkwood text-white"
                disabled={!selectedDate || !selectedTime}
              >
                <Calendar className="mr-2 h-4 w-4" />
                Reserve Table
              </Button>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-luxury-darkwood">Contact & Hours</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <Clock className="h-5 w-5 text-luxury-mahogany" />
                <div>
                  <p className="font-medium text-luxury-darkwood">Opening Hours</p>
                  <p className="text-sm text-luxury-spice">{restaurant.hours}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-luxury-mahogany" />
                <div>
                  <p className="font-medium text-luxury-darkwood">Phone</p>
                  <p className="text-sm text-luxury-spice">{restaurant.phone}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-luxury-mahogany" />
                <div>
                  <p className="font-medium text-luxury-darkwood">Email</p>
                  <p className="text-sm text-luxury-spice">info@{restaurant.name.toLowerCase().replace(/\s+/g, '')}.lk</p>
                </div>
              </div>

              <div className="pt-4 border-t border-luxury-bronze">
                <p className="text-sm text-luxury-spice mb-2">Dress Code: Smart Casual</p>
                <p className="text-sm text-luxury-spice">Reservations recommended</p>
              </div>
            </CardContent>
          </Card>

          {/* Specialties */}
          <Card>
            <CardHeader>
              <CardTitle className="text-luxury-darkwood">Signature Dishes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {restaurant.specialties.map((specialty, index) => (
                  <div key={index} className="bg-luxury-cream px-3 py-2 rounded-lg">
                    <span className="text-luxury-darkwood font-medium">{specialty}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default RestaurantDetail;
