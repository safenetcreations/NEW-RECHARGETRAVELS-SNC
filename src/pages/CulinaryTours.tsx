import React from 'react';
import { Helmet } from 'react-helmet-async';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, MapPin, Users, Star, Carrot, ChefHat, Flame, Utensils } from 'lucide-react';

const CulinaryTours = () => {
  return (
    <>
      <Helmet>
        <title>Culinary Tours in Sri Lanka - Recharge Travels</title>
        <meta name="description" content="Savor the authentic flavors and spices of Sri Lankan cuisine with our culinary tours." />
      </Helmet>
      
      <div className="min-h-screen bg-background">
        <Header />
        
        {/* Hero Section */}
        <section 
          className="relative h-screen flex items-center justify-center bg-cover bg-center"
          style={{
            backgroundImage: `linear-gradient(rgba(139,69,19,0.3), rgba(160,82,45,0.4)), url('https://images.unsplash.com/photo-1596040033229-a9821ebd058d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80')`
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-spice-light/20 via-transparent to-spice-deep/40"></div>
          <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto">
            <h1 className="text-6xl md:text-7xl font-cinzel font-bold mb-6 animate-fade-in">
              Flavors of Ceylon
            </h1>
            <p className="text-xl md:text-2xl font-playfair mb-8 animate-fade-in opacity-90">
              Embark on a sensory journey through Sri Lanka's aromatic spice gardens and culinary traditions
            </p>
            <Button 
              size="lg" 
              className="bg-spice-deep hover:bg-spice-light text-white px-8 py-4 text-lg animate-scale-in"
            >
              Taste Sri Lanka
            </Button>
          </div>
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
            <ChefHat className="w-8 h-8 text-white" />
          </div>
        </section>

        {/* Culinary Experiences */}
        <section className="py-20 bg-gradient-to-br from-background via-spice-light/5 to-background">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-5xl font-cinzel font-bold text-spice-deep mb-6">Culinary Adventures</h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto font-playfair">
                From street food tours to royal kitchen experiences, discover the rich tapestry of Sri Lankan flavors
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {culinaryExperiences.map((experience, index) => (
                <Card 
                  key={index} 
                  className="group hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 bg-white/90 backdrop-blur border-spice-light/20"
                >
                  <div className="relative overflow-hidden">
                    <img 
                      src={experience.image} 
                      alt={experience.name}
                      className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-spice-deep/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    <div className="absolute bottom-4 left-4 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                      <div className="flex items-center space-x-2">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span className="text-sm font-medium">{experience.rating}</span>
                      </div>
                    </div>
                  </div>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-2xl font-cinzel text-spice-deep group-hover:text-spice-light transition-colors">
                      {experience.name}
                    </CardTitle>
                    <div className="flex items-center text-muted-foreground">
                      <MapPin className="w-4 h-4 mr-2" />
                      <span className="text-sm">{experience.location}</span>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-muted-foreground leading-relaxed">
                      {experience.description}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {experience.highlights.map((highlight, i) => (
                        <span 
                          key={i}
                          className="px-3 py-1 bg-spice-light/10 text-spice-deep text-xs rounded-full border border-spice-light/20"
                        >
                          {highlight}
                        </span>
                      ))}
                    </div>
                    <div className="flex items-center justify-between pt-4">
                      <div className="text-2xl font-bold text-spice-deep">
                        ${experience.price}
                        <span className="text-sm font-normal text-muted-foreground">/person</span>
                      </div>
                      <Button className="bg-spice-deep hover:bg-spice-light">
                        Book Tour
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Spice Garden Experience */}
        <section className="py-20 bg-gradient-to-r from-spice-deep to-spice-light text-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-5xl font-cinzel font-bold mb-6">Spice Island Heritage</h2>
              <p className="text-xl max-w-3xl mx-auto font-playfair">
                Discover why Sri Lanka was known as the Spice Island through guided spice garden tours
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {spiceExperiences.map((spice, index) => (
                <div 
                  key={index}
                  className="text-center group hover:scale-105 transition-transform duration-300"
                >
                  <div className="bg-white/10 backdrop-blur rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6 group-hover:bg-white/20 transition-colors">
                    <spice.icon className="w-12 h-12" />
                  </div>
                  <h3 className="text-2xl font-cinzel font-bold mb-4">{spice.name}</h3>
                  <p className="text-spice-light/90 leading-relaxed">{spice.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Traditional Cooking Class */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="bg-gradient-to-br from-spice-light/10 to-spice-deep/10 rounded-2xl p-12 border border-spice-light/20">
                <div className="grid md:grid-cols-2 gap-12 items-center">
                  <div>
                    <Utensils className="w-16 h-16 mb-6 text-spice-deep" />
                    <h2 className="text-4xl font-cinzel font-bold text-spice-deep mb-6">Hands-On Cooking</h2>
                    <p className="text-xl text-muted-foreground mb-8 font-playfair leading-relaxed">
                      Learn the secrets of authentic Sri Lankan cuisine from local home cooks and master chefs. 
                      From grinding spices on a traditional stone to perfecting the art of hoppers and curries, 
                      take home culinary skills that last a lifetime.
                    </p>
                    <div className="space-y-4">
                      <div className="flex items-center">
                        <div className="w-3 h-3 bg-spice-deep rounded-full mr-3"></div>
                        <span className="text-muted-foreground">Traditional spice grinding techniques</span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-3 h-3 bg-spice-deep rounded-full mr-3"></div>
                        <span className="text-muted-foreground">Authentic curry and rice preparation</span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-3 h-3 bg-spice-deep rounded-full mr-3"></div>
                        <span className="text-muted-foreground">Recipe cards and spice samples to take home</span>
                      </div>
                    </div>
                  </div>
                  <div className="relative">
                    <img 
                      src="https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?ixlib=rb-4.0.3"
                      alt="Cooking Class"
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

const culinaryExperiences = [
  {
    name: "Colombo Street Food Safari",
    location: "Colombo",
    image: "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?ixlib=rb-4.0.3",
    description: "Navigate bustling markets and street corners to taste authentic kottu, hoppers, and tropical fruits.",
    highlights: ["Kottu Roti", "Hoppers", "Fresh Juices", "Local Markets"],
    price: 45,
    rating: 4.8
  },
  {
    name: "Royal Palace Dining",
    location: "Kandy",
    image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?ixlib=rb-4.0.3",
    description: "Experience a regal feast with traditional Kandyan cuisine served on banana leaves.",
    highlights: ["Royal Recipes", "Banana Leaf Serving", "Cultural Performance", "Palace Setting"],
    price: 85,
    rating: 4.9
  },
  {
    name: "Spice Garden Tour & Lunch",
    location: "Matale",
    image: "https://images.unsplash.com/photo-1506976785307-8732e854ad03?ixlib=rb-4.0.3",
    description: "Walk through aromatic spice gardens and enjoy a farm-to-table lunch with fresh ingredients.",
    highlights: ["Spice Garden Walk", "Fresh Spices", "Farm Lunch", "Cooking Demo"],
    price: 65,
    rating: 4.7
  },
  {
    name: "Tea Country High Tea",
    location: "Nuwara Eliya",
    image: "https://images.unsplash.com/photo-1571934811356-5cc061b6821f?ixlib=rb-4.0.3",
    description: "Savor colonial-style high tea with Ceylon tea and traditional cakes in the cool mountains.",
    highlights: ["Ceylon Tea", "Colonial Setting", "Fresh Scones", "Mountain Views"],
    price: 55,
    rating: 4.6
  },
  {
    name: "Fisherman's Feast",
    location: "Negombo",
    image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?ixlib=rb-4.0.3",
    description: "Join local fishermen for the catch of the day and learn to prepare fresh seafood curries.",
    highlights: ["Fresh Seafood", "Fishing Experience", "Coastal Cooking", "Beach Setting"],
    price: 70,
    rating: 4.8
  },
  {
    name: "Village Home Cooking",
    location: "Rural Villages",
    image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?ixlib=rb-4.0.3",
    description: "Learn family recipes passed down through generations in authentic village homes.",
    highlights: ["Family Recipes", "Village Life", "Traditional Methods", "Home Setting"],
    price: 50,
    rating: 4.9
  }
];

const spiceExperiences = [
  {
    name: "Cinnamon",
    icon: Carrot,
    description: "Discover the true Ceylon cinnamon that made Sri Lanka famous across ancient trade routes."
  },
  {
    name: "Cardamom",
    icon: Flame,
    description: "Experience the queen of spices growing wild in the misty mountains."
  },
  {
    name: "Black Pepper",
    icon: ChefHat,
    description: "Learn about the king of spices that brought traders from around the world."
  },
  {
    name: "Curry Leaves",
    icon: Utensils,
    description: "Understand the aromatic foundation of every authentic Sri Lankan curry."
  }
];

export default CulinaryTours;