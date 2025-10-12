import React from 'react';
import { Helmet } from 'react-helmet-async';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, MapPin, Users, Star, Mountain, Coffee, Train, Sunrise } from 'lucide-react';

const HillCountry = () => {
  return (
    <>
      <Helmet>
        <title>Hill Country Tours in Sri Lanka - Recharge Travels</title>
        <meta name="description" content="Experience the cool climate and tea plantations of Sri Lanka's highlands." />
      </Helmet>
      
      <div className="min-h-screen bg-background">
        <Header />
        
        {/* Hero Section */}
        <section 
          className="relative h-screen flex items-center justify-center bg-cover bg-center"
          style={{
            backgroundImage: `linear-gradient(rgba(34,139,34,0.3), rgba(107,142,35,0.4)), url('https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80')`
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-tea-light/20 via-transparent to-tea-deep/40"></div>
          <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto">
            <h1 className="text-6xl md:text-7xl font-cinzel font-bold mb-6 animate-fade-in">
              Misty Mountains
            </h1>
            <p className="text-xl md:text-2xl font-playfair mb-8 animate-fade-in opacity-90">
              Journey through emerald tea estates and mist-covered peaks
            </p>
            <Button 
              size="lg" 
              className="bg-tea-deep hover:bg-tea-light text-white px-8 py-4 text-lg animate-scale-in"
            >
              Explore Hill Country
            </Button>
          </div>
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
            <Mountain className="w-8 h-8 text-white" />
          </div>
        </section>

        {/* Hill Country Destinations */}
        <section className="py-20 bg-gradient-to-br from-background via-tea-light/5 to-background">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-5xl font-cinzel font-bold text-tea-deep mb-6">Highland Treasures</h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto font-playfair">
                Discover cool climate retreats, rolling tea plantations, and breathtaking mountain vistas
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {hillCountryDestinations.map((destination, index) => (
                <Card 
                  key={index} 
                  className="group hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 bg-white/90 backdrop-blur border-tea-light/20"
                >
                  <div className="relative overflow-hidden">
                    <img 
                      src={destination.image} 
                      alt={destination.name}
                      className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-tea-deep/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    <div className="absolute bottom-4 left-4 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                      <div className="flex items-center space-x-2">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span className="text-sm font-medium">{destination.rating}</span>
                      </div>
                    </div>
                  </div>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-2xl font-cinzel text-tea-deep group-hover:text-tea-light transition-colors">
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
                          className="px-3 py-1 bg-tea-light/10 text-tea-deep text-xs rounded-full border border-tea-light/20"
                        >
                          {activity}
                        </span>
                      ))}
                    </div>
                    <div className="flex items-center justify-between pt-4">
                      <div className="text-2xl font-bold text-tea-deep">
                        ${destination.price}
                        <span className="text-sm font-normal text-muted-foreground">/person</span>
                      </div>
                      <Button className="bg-tea-deep hover:bg-tea-light">
                        Book Now
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Tea Culture Experience */}
        <section className="py-20 bg-gradient-to-r from-tea-deep to-tea-light text-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-5xl font-cinzel font-bold mb-6">Ceylon Tea Heritage</h2>
              <p className="text-xl max-w-3xl mx-auto font-playfair">
                Experience the art of tea cultivation from leaf to cup in the world's finest tea gardens
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {teaExperiences.map((experience, index) => (
                <div 
                  key={index}
                  className="text-center group hover:scale-105 transition-transform duration-300"
                >
                  <div className="bg-white/10 backdrop-blur rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6 group-hover:bg-white/20 transition-colors">
                    <experience.icon className="w-12 h-12" />
                  </div>
                  <h3 className="text-2xl font-cinzel font-bold mb-4">{experience.name}</h3>
                  <p className="text-tea-light/90 leading-relaxed">{experience.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Mountain Railway */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="bg-gradient-to-br from-tea-light/10 to-tea-deep/10 rounded-2xl p-12 border border-tea-light/20">
                <div className="grid md:grid-cols-2 gap-12 items-center">
                  <div>
                    <Train className="w-16 h-16 mb-6 text-tea-deep" />
                    <h2 className="text-4xl font-cinzel font-bold text-tea-deep mb-6">Scenic Train Journey</h2>
                    <p className="text-xl text-muted-foreground mb-8 font-playfair leading-relaxed">
                      Experience one of the world's most beautiful train rides through misty mountains, 
                      cascading waterfalls, and endless tea plantations. The journey from Kandy to Ella 
                      is considered among the most scenic railway routes globally.
                    </p>
                    <div className="space-y-4">
                      <div className="flex items-center">
                        <div className="w-3 h-3 bg-tea-deep rounded-full mr-3"></div>
                        <span className="text-muted-foreground">Kandy to Ella via Nanu Oya</span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-3 h-3 bg-tea-deep rounded-full mr-3"></div>
                        <span className="text-muted-foreground">9 Arch Bridge viewpoint</span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-3 h-3 bg-tea-deep rounded-full mr-3"></div>
                        <span className="text-muted-foreground">Cloud forest passages</span>
                      </div>
                    </div>
                  </div>
                  <div className="relative">
                    <img 
                      src="https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?ixlib=rb-4.0.3"
                      alt="Mountain Railway"
                      className="rounded-xl shadow-2xl"
                    />
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

const hillCountryDestinations = [
  {
    name: "Ella",
    location: "Badulla District",
    image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3",
    description: "A charming hill station with dramatic viewpoints, waterfalls, and the famous Nine Arch Bridge.",
    activities: ["Little Adam's Peak", "Nine Arch Bridge", "Ravana Falls"],
    price: 85,
    rating: 4.9
  },
  {
    name: "Nuwara Eliya",
    location: "Central Province",
    image: "https://images.unsplash.com/photo-1514890547357-a9ee288728e0?ixlib=rb-4.0.3",
    description: "The 'Little England' of Sri Lanka with colonial charm and pristine tea estates.",
    activities: ["Tea Factory Tours", "Lake Gregory", "Strawberry Fields"],
    price: 95,
    rating: 4.8
  },
  {
    name: "Kandy",
    location: "Central Province",
    image: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?ixlib=rb-4.0.3",
    description: "The cultural capital surrounded by mountains and home to the Temple of the Tooth.",
    activities: ["Temple of Tooth", "Royal Botanical Gardens", "Cultural Shows"],
    price: 75,
    rating: 4.7
  },
  {
    name: "Haputale",
    location: "Badulla District",
    image: "https://images.unsplash.com/photo-1505142468610-359e7d316be0?ixlib=rb-4.0.3",
    description: "A peaceful town offering spectacular views of the southern plains and coast.",
    activities: ["Lipton's Seat", "Dambatenne Tea Factory", "Adisham Bungalow"],
    price: 70,
    rating: 4.6
  },
  {
    name: "Horton Plains",
    location: "Nuwara Eliya District",
    image: "https://images.unsplash.com/photo-1515238152791-8216bfdf89a7?ixlib=rb-4.0.3",
    description: "A UNESCO World Heritage site with unique cloud forest ecosystem and World's End cliff.",
    activities: ["World's End", "Baker's Falls", "Cloud Forest Trekking"],
    price: 65,
    rating: 4.8
  },
  {
    name: "Adam's Peak",
    location: "Ratnapura District",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3",
    description: "Sacred mountain pilgrimage site with breathtaking sunrise views from the summit.",
    activities: ["Night Climbing", "Sunrise Viewing", "Pilgrimage Trail"],
    price: 55,
    rating: 4.9
  }
];

const teaExperiences = [
  {
    name: "Tea Plucking",
    icon: Coffee,
    description: "Join tea pluckers in the misty morning hours to learn the art of selecting the perfect leaves."
  },
  {
    name: "Factory Tours",
    icon: Mountain,
    description: "Witness the transformation from fresh leaf to aromatic Ceylon tea in historic factories."
  },
  {
    name: "Tea Tasting",
    icon: Sunrise,
    description: "Savor the subtle flavors and aromas of world-renowned Ceylon tea varieties."
  },
  {
    name: "Plantation Walks",
    icon: Train,
    description: "Stroll through emerald tea gardens while learning about sustainable cultivation methods."
  }
];

export default HillCountry;