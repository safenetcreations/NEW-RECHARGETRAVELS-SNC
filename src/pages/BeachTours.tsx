import React from 'react';
import { Helmet } from 'react-helmet-async';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, MapPin, Users, Star, Waves, Anchor, Fish, Sunrise } from 'lucide-react';

const BeachTours = () => {
  return (
    <>
      <Helmet>
        <title>Beach Tours in Sri Lanka - Recharge Travels</title>
        <meta name="description" content="Explore pristine beaches and coastal wonders of Sri Lanka with our beach tours." />
      </Helmet>
      
      <div className="min-h-screen bg-background">
        <Header />
        
        {/* Hero Section */}
        <section 
          className="relative h-screen flex items-center justify-center bg-cover bg-center"
          style={{
            backgroundImage: `linear-gradient(rgba(0,100,200,0.3), rgba(0,150,255,0.4)), url('https://images.unsplash.com/photo-1507525428034-b723cf961d3e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2073&q=80')`
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-ocean-light/20 via-transparent to-ocean-deep/40"></div>
          <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto">
            <h1 className="text-6xl md:text-7xl font-cinzel font-bold mb-6 animate-fade-in">
              Beach Paradise
            </h1>
            <p className="text-xl md:text-2xl font-playfair mb-8 animate-fade-in opacity-90">
              Discover pristine shores, crystal waters, and endless coastal adventures
            </p>
            <Button 
              size="lg" 
              className="bg-ocean-deep hover:bg-ocean-light text-white px-8 py-4 text-lg animate-scale-in"
            >
              Explore Our Beaches
            </Button>
          </div>
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
            <Waves className="w-8 h-8 text-white" />
          </div>
        </section>

        {/* Beach Destinations */}
        <section className="py-20 bg-gradient-to-br from-background via-ocean-light/5 to-background">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-5xl font-cinzel font-bold text-ocean-deep mb-6">Coastal Wonders</h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto font-playfair">
                From golden beaches to vibrant coral reefs, explore Sri Lanka's stunning coastline
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {beachDestinations.map((destination, index) => (
                <Card 
                  key={index} 
                  className="group hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 bg-white/90 backdrop-blur border-ocean-light/20"
                >
                  <div className="relative overflow-hidden">
                    <img 
                      src={destination.image} 
                      alt={destination.name}
                      className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-ocean-deep/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    <div className="absolute bottom-4 left-4 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                      <div className="flex items-center space-x-2">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span className="text-sm font-medium">{destination.rating}</span>
                      </div>
                    </div>
                  </div>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-2xl font-cinzel text-ocean-deep group-hover:text-ocean-light transition-colors">
                      {destination.name}
                    </CardTitle>
                    <div className="flex items-center text-muted-foreground">
                      <MapPin className="w-4 h-4 mr-2" />
                      <span className="text-sm">{destination.location}</span>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-muted-foreground leading-relaxed">
                      {destination.description}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {destination.activities.map((activity, i) => (
                        <span 
                          key={i}
                          className="px-3 py-1 bg-ocean-light/10 text-ocean-deep text-xs rounded-full border border-ocean-light/20"
                        >
                          {activity}
                        </span>
                      ))}
                    </div>
                    <div className="flex items-center justify-between pt-4">
                      <div className="text-2xl font-bold text-ocean-deep">
                        ${destination.price}
                        <span className="text-sm font-normal text-muted-foreground">/person</span>
                      </div>
                      <Button className="bg-ocean-deep hover:bg-ocean-light">
                        Book Now
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Beach Activities */}
        <section className="py-20 bg-gradient-to-r from-ocean-deep to-ocean-light text-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-5xl font-cinzel font-bold mb-6">Ocean Adventures</h2>
              <p className="text-xl max-w-3xl mx-auto font-playfair">
                Immerse yourself in thrilling water sports and peaceful coastal experiences
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {beachActivities.map((activity, index) => (
                <div 
                  key={index}
                  className="text-center group hover:scale-105 transition-transform duration-300"
                >
                  <div className="bg-white/10 backdrop-blur rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6 group-hover:bg-white/20 transition-colors">
                    <activity.icon className="w-12 h-12" />
                  </div>
                  <h3 className="text-2xl font-cinzel font-bold mb-4">{activity.name}</h3>
                  <p className="text-ocean-light/90 leading-relaxed">{activity.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Best Time to Visit */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <div className="bg-gradient-to-br from-ocean-light/10 to-ocean-deep/10 rounded-2xl p-12 border border-ocean-light/20">
                <Sunrise className="w-16 h-16 mx-auto mb-6 text-ocean-deep" />
                <h2 className="text-4xl font-cinzel font-bold text-ocean-deep mb-6">Perfect Beach Weather</h2>
                <p className="text-xl text-muted-foreground mb-8 font-playfair leading-relaxed">
                  Sri Lanka's beaches offer year-round beauty with ideal conditions from November to April 
                  on the west and south coasts, and May to September on the east coast.
                </p>
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="bg-white/50 rounded-lg p-6 border border-ocean-light/20">
                    <h3 className="font-bold text-ocean-deep mb-2">West & South Coast</h3>
                    <p className="text-sm text-muted-foreground">November - April</p>
                  </div>
                  <div className="bg-white/50 rounded-lg p-6 border border-ocean-light/20">
                    <h3 className="font-bold text-ocean-deep mb-2">East Coast</h3>
                    <p className="text-sm text-muted-foreground">May - September</p>
                  </div>
                  <div className="bg-white/50 rounded-lg p-6 border border-ocean-light/20">
                    <h3 className="font-bold text-ocean-deep mb-2">Water Temperature</h3>
                    <p className="text-sm text-muted-foreground">26-28°C Year Round</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      <Footer />
    </>
  );
};

const beachDestinations = [
  {
    name: "Unawatuna Beach",
    location: "Galle District",
    image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?ixlib=rb-4.0.3",
    description: "A crescent-shaped bay with golden sand, perfect for swimming and snorkeling among coral reefs.",
    activities: ["Snorkeling", "Swimming", "Sunset Views"],
    price: 75,
    rating: 4.8
  },
  {
    name: "Mirissa Beach",
    location: "Matara District", 
    image: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?ixlib=rb-4.0.3",
    description: "Famous for whale watching and pristine beaches with coconut palm-lined shores.",
    activities: ["Whale Watching", "Surfing", "Beach Relaxation"],
    price: 95,
    rating: 4.9
  },
  {
    name: "Bentota Beach",
    location: "Galle District",
    image: "https://images.unsplash.com/photo-1571601035754-79c2fee2d912?ixlib=rb-4.0.3",
    description: "A water sports paradise with calm lagoons and endless golden beaches.",
    activities: ["Water Sports", "River Safari", "Ayurveda Spa"],
    price: 85,
    rating: 4.7
  },
  {
    name: "Arugam Bay",
    location: "Eastern Province",
    image: "https://images.unsplash.com/photo-1544926810-c0d1b04b5fff?ixlib=rb-4.0.3",
    description: "World-renowned surf destination with consistent waves and laid-back atmosphere.",
    activities: ["Surfing", "Yoga", "Beach Walks"],
    price: 65,
    rating: 4.6
  },
  {
    name: "Hikkaduwa Beach",
    location: "Galle District",
    image: "https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?ixlib=rb-4.0.3",
    description: "Vibrant coral reefs and diverse marine life make this a snorkeler's paradise.",
    activities: ["Snorkeling", "Diving", "Glass Bottom Boat"],
    price: 70,
    rating: 4.5
  },
  {
    name: "Nilaveli Beach",
    location: "Trincomalee",
    image: "https://images.unsplash.com/photo-1573843981267-be1999ff37cd?ixlib=rb-4.0.3",
    description: "Untouched white sand beaches with crystal clear waters and Pigeon Island nearby.",
    activities: ["Island Hopping", "Snorkeling", "Beach Picnics"],
    price: 80,
    rating: 4.8
  }
];

const beachActivities = [
  {
    name: "Surfing",
    icon: Waves,
    description: "Ride the perfect waves at world-class surf breaks along both coasts."
  },
  {
    name: "Snorkeling",
    icon: Fish,
    description: "Explore vibrant coral reefs teeming with tropical marine life."
  },
  {
    name: "Sailing",
    icon: Anchor,
    description: "Navigate pristine waters with traditional catamarans and luxury yachts."
  },
  {
    name: "Beach Relaxation",
    icon: Sunrise,
    description: "Unwind on pristine beaches with golden sand and swaying palm trees."
  }
];

export default BeachTours;