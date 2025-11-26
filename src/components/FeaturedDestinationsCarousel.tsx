
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { MapPin, Star, Clock, Users, ArrowRight, Heart } from 'lucide-react';

interface Destination {
  id: string;
  name: string;
  location: string;
  image: string;
  rating: number;
  duration: string;
  groupSize: string;
  price: number;
  description: string;
  highlights: string[];
}

const featuredDestinations: Destination[] = [
  {
    id: '1',
    name: 'Yala National Park Safari',
    location: 'Southern Province',
    image: 'https://images.unsplash.com/photo-1564760055775-d63b17a55c44?w=600&h=400&fit=crop&auto=format&q=80',
    rating: 4.8,
    duration: '6 hours',
    groupSize: '2-8 people',
    price: 120,
    description: 'Experience Sri Lanka\'s premier wildlife sanctuary with the highest leopard density in the world.',
    highlights: ['Leopard spotting', 'Elephant herds', 'Bird watching']
  },
  {
    id: '2',
    name: 'Sigiriya Rock Fortress',
    location: 'Central Province', 
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&h=400&fit=crop&auto=format&q=80',
    rating: 4.9,
    duration: '4 hours',
    groupSize: '2-15 people',
    price: 85,
    description: 'Climb the ancient rock fortress and marvel at the 5th-century palace ruins and frescoes.',
    highlights: ['Ancient frescoes', 'Palace ruins', 'Panoramic views']
  },
  {
    id: '3',
    name: 'Kandy Cultural Tour',
    location: 'Central Province',
    image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&h=400&fit=crop&auto=format&q=80',
    rating: 4.7,
    duration: '8 hours',
    groupSize: '2-12 people',
    price: 95,
    description: 'Explore the last royal capital and visit the sacred Temple of the Tooth Relic.',
    highlights: ['Temple of the Tooth', 'Royal Botanical Gardens', 'Traditional dance']
  },
  {
    id: '4',
    name: 'Galle Fort Heritage Walk',
    location: 'Southern Province',
    image: 'https://images.unsplash.com/photo-1566552881560-0be862a7c445?w=600&h=400&fit=crop&auto=format&q=80',
    rating: 4.6,
    duration: '3 hours',
    groupSize: '2-10 people',
    price: 60,
    description: 'Walk through the UNESCO World Heritage Dutch fort and colonial architecture.',
    highlights: ['Dutch architecture', 'Ocean views', 'Historic museums']
  },
  {
    id: '5',
    name: 'Mirissa Whale Watching',
    location: 'Southern Province',
    image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=600&h=400&fit=crop&auto=format&q=80',
    rating: 4.8,
    duration: '5 hours',
    groupSize: '2-20 people',
    price: 110,
    description: 'Spot blue whales, sperm whales, and dolphins in their natural habitat.',
    highlights: ['Blue whales', 'Dolphin pods', 'Ocean adventure']
  },
  {
    id: '6',
    name: 'Ella Nine Arches Bridge',
    location: 'Uva Province',
    image: 'https://images.unsplash.com/photo-1566552881560-0be862a7c445?w=600&h=400&fit=crop&auto=format&q=80',
    rating: 4.7,
    duration: '2 hours', 
    groupSize: '2-20 people',
    price: 45,
    description: 'Visit the iconic railway bridge surrounded by lush tea plantations and stunning mountain views.',
    highlights: ['Tea plantations', 'Mountain views', 'Railway heritage']
  }
];

const FeaturedDestinationsCarousel = () => {
  const [hoveredDestination, setHoveredDestination] = useState<string | null>(null);

  return (
    <section className="w-full bg-gradient-to-br from-white via-soft-beige/20 to-coconut-cream py-20 relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-wild-orange/5 rounded-full -translate-x-36 -translate-y-36"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-jungle-green/5 rounded-full translate-x-48 translate-y-48"></div>
      <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-peacock-teal/5 rounded-full -translate-x-32 -translate-y-32"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 bg-wild-orange/10 rounded-full px-6 py-3 mb-6">
            <Star className="h-5 w-5 text-wild-orange" />
            <span className="text-sm font-semibold text-wild-orange">Handpicked Experiences</span>
          </div>
          
          <h2 className="text-5xl md:text-6xl font-bold text-granite-gray mb-6">
            Featured <span className="bg-gradient-to-r from-wild-orange to-jungle-green bg-clip-text text-transparent">Destinations</span>
          </h2>
          <p className="text-xl text-granite-gray/70 max-w-3xl mx-auto leading-relaxed">
            Embark on extraordinary journeys to Sri Lanka's most captivating destinations. 
            From ancient wonders to pristine wilderness, each location tells a unique story.
          </p>
        </div>

        <Carousel className="w-full max-w-7xl mx-auto">
          <CarouselContent className="-ml-3 md:-ml-6">
            {featuredDestinations.map((destination, index) => (
              <CarouselItem key={destination.id} className="pl-3 md:pl-6 basis-full md:basis-1/2 lg:basis-1/3">
                <Card 
                  className="group h-full overflow-hidden bg-white shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border-0 rounded-2xl"
                  onMouseEnter={() => setHoveredDestination(destination.id)}
                  onMouseLeave={() => setHoveredDestination(null)}
                >
                  <div className="relative overflow-hidden rounded-t-2xl">
                    <img 
                      src={destination.image} 
                      alt={destination.name}
                      className="w-full h-56 object-cover transition-all duration-700 group-hover:scale-110"
                    />
                    
                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    
                    {/* Price Badge */}
                    <div className="absolute top-4 left-4 bg-gradient-to-r from-wild-orange to-orange-600 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg transform group-hover:scale-110 transition-transform duration-300">
                      ${destination.price}
                    </div>
                    
                    {/* Rating Badge */}
                    <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm text-granite-gray px-3 py-2 rounded-full text-sm font-semibold flex items-center shadow-lg">
                      <Star className="h-4 w-4 text-yellow-500 fill-current mr-1" />
                      {destination.rating}
                    </div>
                    
                    {/* Wishlist Heart */}
                    <div className="absolute bottom-4 right-4 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-4 group-hover:translate-y-0 cursor-pointer hover:bg-wild-orange hover:text-white">
                      <Heart className="h-5 w-5" />
                    </div>
                  </div>
                  
                  <CardContent className="p-6">
                    <div className="mb-4">
                      <h3 className="text-xl font-bold text-granite-gray mb-2 group-hover:text-wild-orange transition-colors duration-300">
                        {destination.name}
                      </h3>
                      <div className="flex items-center text-granite-gray/60 text-sm">
                        <MapPin className="h-4 w-4 mr-2 text-wild-orange" />
                        {destination.location}
                      </div>
                    </div>

                    <p className="text-granite-gray/70 text-sm mb-6 line-clamp-2 leading-relaxed">
                      {destination.description}
                    </p>

                    <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
                      <div className="flex items-center text-granite-gray/60">
                        <Clock className="h-4 w-4 mr-2 text-jungle-green" />
                        <span className="font-medium">{destination.duration}</span>
                      </div>
                      <div className="flex items-center text-granite-gray/60">
                        <Users className="h-4 w-4 mr-2 text-peacock-teal" />
                        <span className="font-medium">{destination.groupSize}</span>
                      </div>
                    </div>

                    <div className="mb-6">
                      <div className="flex flex-wrap gap-2">
                        {destination.highlights.slice(0, 3).map((highlight, idx) => (
                          <span 
                            key={idx}
                            className="bg-gradient-to-r from-jungle-green/10 to-wild-orange/10 text-jungle-green text-xs px-3 py-1 rounded-full border border-jungle-green/20 font-medium"
                          >
                            {highlight}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <Button 
                        asChild
                        className="flex-1 bg-gradient-to-r from-wild-orange to-orange-600 hover:from-orange-600 hover:to-wild-orange text-white font-bold transform transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl"
                      >
                        <Link to="/destinations">
                          Explore
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                      </Button>
                      
                      <Button 
                        variant="outline" 
                        size="default"
                        className="px-4 border-2 border-peacock-teal text-peacock-teal hover:bg-peacock-teal hover:text-white transition-all duration-300 hover:scale-105"
                        onClick={() => {
                          window.open(`https://www.google.com/maps?q=${destination.location}`, '_blank')
                        }}
                      >
                        <MapPin className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="hidden md:flex -left-16 w-12 h-12 bg-white/90 backdrop-blur-sm border-2 border-wild-orange/20 hover:bg-wild-orange hover:text-white hover:border-wild-orange" />
          <CarouselNext className="hidden md:flex -right-16 w-12 h-12 bg-white/90 backdrop-blur-sm border-2 border-wild-orange/20 hover:bg-wild-orange hover:text-white hover:border-wild-orange" />
        </Carousel>

        <div className="text-center mt-12">
          <Button 
            asChild
            size="lg"
            className="bg-gradient-to-r from-jungle-green to-peacock-teal hover:from-peacock-teal hover:to-jungle-green text-white font-bold px-8 py-4 transform transition-all duration-300 hover:scale-105 shadow-xl hover:shadow-2xl rounded-full"
          >
            <Link to="/destinations">
              View All Destinations
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedDestinationsCarousel;
