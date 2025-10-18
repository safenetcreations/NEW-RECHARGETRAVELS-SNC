
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Camera, 
  Clock, 
  Users, 
  MapPin, 
  Star, 
  Binoculars,
  TreePine,
  Heart,
  Award,
  Shield,
  Calendar,
  Loader2
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { 
  getLodges, 
  getWildlifeActivities, 
  subscribeWildlifeNewsletter,
  createInquiry 
} from '@/services/wildlifeService';

const WildlifeExperience: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [lodges, setLodges] = useState([]);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const categories = [
    { id: 'all', name: 'All Experiences', icon: TreePine },
    { id: 'lodges', name: 'Luxury Lodges', icon: Award },
    { id: 'activities', name: 'Safari Activities', icon: Binoculars },
    { id: 'conservation', name: 'Conservation', icon: Shield },
    { id: 'cultural', name: 'Cultural Experiences', icon: Camera }
  ];

  useEffect(() => {
    loadWildlifeData();
  }, []);

  const loadWildlifeData = async () => {
    setLoading(true);
    try {
      const [lodgesResult, activitiesResult] = await Promise.all([
        getLodges(),
        getWildlifeActivities()
      ]);

      if (lodgesResult.error) {
        console.error('Error loading lodges:', lodgesResult.error);
      } else {
        setLodges(lodgesResult.data || []);
      }

      if (activitiesResult.error) {
        console.error('Error loading activities:', activitiesResult.error);
      } else {
        setActivities(activitiesResult.data || []);
      }
    } catch (error) {
      console.error('Error loading wildlife data:', error);
      toast({
        title: "Error",
        description: "Failed to load wildlife experiences. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleNewsletterSubscribe = async (email: string) => {
    try {
      const { error } = await subscribeWildlifeNewsletter({
        email,
        source: 'wildlife_experience_page'
      });
      
      if (error) {
        throw error;
      }

      toast({
        title: "Subscribed!",
        description: "You've been subscribed to our wildlife newsletter.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to subscribe. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleContactExpert = async () => {
    try {
      const { error } = await createInquiry({
        name: "Wildlife Inquiry",
        email: "contact@example.com",
        message: "I'm interested in learning more about your wildlife experiences.",
        inquiry_type: "general"
      });

      if (error) {
        throw error;
      }

      toast({
        title: "Inquiry Sent!",
        description: "Our wildlife experts will contact you soon.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send inquiry. Please try again.",
        variant: "destructive",
      });
    }
  };

  const getFilteredItems = () => {
    if (selectedCategory === 'all') {
      return [...lodges, ...activities];
    } else if (selectedCategory === 'lodges') {
      return lodges;
    } else if (selectedCategory === 'activities') {
      return activities;
    }
    return [];
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty?.toLowerCase()) {
      case 'easy': return 'bg-green-100 text-green-800';
      case 'moderate': return 'bg-yellow-100 text-yellow-800';
      case 'challenging': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const renderExperienceCard = (item: any, type: 'lodge' | 'activity') => {
    const isLodge = type === 'lodge';
    
    return (
      <Card key={item.id} className="overflow-hidden hover:shadow-xl transition-shadow duration-300">
        <div className="relative h-48">
          <img 
                            src={item.images?.[0] || 'https://images.unsplash.com/photo-1563720360172-67b8f3dce741?w=400&h=300&fit=crop'} 
            alt={item.name}
            className="w-full h-full object-cover"
          />
          {item.is_featured && (
            <Badge className="absolute top-3 left-3 bg-blue-600 text-white">
              Featured
            </Badge>
          )}
          <div className="absolute top-3 right-3 bg-white/90 rounded-full px-2 py-1 flex items-center">
            <Star className="w-4 h-4 text-yellow-400 mr-1" />
            <span className="text-sm font-medium">4.8</span>
          </div>
        </div>

        <CardHeader>
          <div className="flex justify-between items-start mb-2">
            <CardTitle className="text-xl">{item.name}</CardTitle>
            {!isLodge && item.difficulty_level && (
              <Badge className={getDifficultyColor(item.difficulty_level)}>
                {item.difficulty_level}
              </Badge>
            )}
          </div>
          <CardDescription className="text-gray-600">
            {item.description}
          </CardDescription>
        </CardHeader>

        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
              {isLodge ? (
                <>
                  <div className="flex items-center">
                    <Users className="w-4 h-4 mr-2" />
                    Up to {item.capacity} guests
                  </div>
                  <div className="flex items-center">
                    <MapPin className="w-4 h-4 mr-2" />
                    {item.location}
                  </div>
                </>
              ) : (
                <>
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-2" />
                    {item.duration}
                  </div>
                  <div className="flex items-center">
                    <Users className="w-4 h-4 mr-2" />
                    {item.min_participants}-{item.max_participants} people
                  </div>
                  <div className="flex items-center col-span-2">
                    <MapPin className="w-4 h-4 mr-2" />
                    {item.location}
                  </div>
                </>
              )}
            </div>

            <div>
              <h4 className="font-semibold mb-2">Features:</h4>
              <div className="flex flex-wrap gap-1">
                {(isLodge ? item.features : item.includes)?.slice(0, 3).map((feature: string, index: number) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {feature}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t">
              <div>
                <span className="text-2xl font-bold text-green-600">
                  ${isLodge ? item.price_per_night : item.price_per_person}
                </span>
                <span className="text-gray-500 text-sm">
                  /{isLodge ? 'night' : 'person'}
                </span>
              </div>
              <div className="space-x-2">
                <Button variant="outline" size="sm">
                  Details
                </Button>
                <Button size="sm" className="bg-wild-orange hover:bg-wild-orange/90">
                  Book Now
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Wildlife Experiences - Exotic Packages | Recharge Travels</title>
        <meta name="description" content="Discover Sri Lanka's incredible wildlife through our expertly curated exotic packages. From leopard safaris to whale watching adventures." />
      </Helmet>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-green-800 to-green-600 text-white py-20">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative container mx-auto px-4 text-center">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Wildlife Experiences
            </h1>
            <p className="text-xl md:text-2xl mb-8 leading-relaxed">
              Embark on extraordinary wildlife adventures in Sri Lanka's pristine wilderness. 
              From majestic leopards to gentle giants, discover nature's most incredible creatures.
            </p>
            <div className="flex flex-wrap justify-center gap-4 mb-8">
              <Badge variant="secondary" className="text-lg px-4 py-2">
                <Award className="w-5 h-5 mr-2" />
                Expert Guides
              </Badge>
              <Badge variant="secondary" className="text-lg px-4 py-2">
                <Shield className="w-5 h-5 mr-2" />
                Conservation Focused
              </Badge>
              <Badge variant="secondary" className="text-lg px-4 py-2">
                <Camera className="w-5 h-5 mr-2" />
                Photo Opportunities
              </Badge>
            </div>
            <Button size="lg" className="bg-wild-orange hover:bg-wild-orange/90 text-white px-8 py-3 text-lg">
              <Calendar className="w-5 h-5 mr-2" />
              Plan Your Adventure
            </Button>
          </div>
        </div>
      </section>

      {/* Categories Filter */}
      <section className="py-8 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-4">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`flex items-center gap-2 px-6 py-3 rounded-full font-medium transition-all ${
                  selectedCategory === category.id
                    ? 'bg-wild-orange text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                <category.icon className="w-5 h-5" />
                {category.name}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Wildlife Experiences Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Exotic Wildlife Experiences
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Choose from our carefully crafted wildlife experiences, each designed to offer 
              unique encounters with Sri Lanka's incredible biodiversity.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {getFilteredItems().map((item) => {
              const isLodge = 'price_per_night' in item;
              return renderExperienceCard(item, isLodge ? 'lodge' : 'activity');
            })}
          </div>

          {getFilteredItems().length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No experiences found for the selected category.</p>
            </div>
          )}
        </div>
      </section>

      {/* Conservation Message */}
      <section className="py-16 bg-green-50">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <Shield className="w-16 h-16 text-green-600 mx-auto mb-6" />
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Conservation Through Tourism
            </h2>
            <p className="text-lg text-gray-700 mb-8">
              Every wildlife experience you book directly supports local conservation efforts 
              and community development. Together, we're protecting Sri Lanka's incredible 
              biodiversity for future generations.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <TreePine className="w-12 h-12 text-green-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Habitat Protection</h3>
                <p className="text-gray-600">Supporting park conservation and anti-poaching efforts</p>
              </div>
              <div className="text-center">
                <Users className="w-12 h-12 text-green-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Community Support</h3>
                <p className="text-gray-600">Providing sustainable livelihoods for local communities</p>
              </div>
              <div className="text-center">
                <Heart className="w-12 h-12 text-green-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Wildlife Care</h3>
                <p className="text-gray-600">Funding rescue and rehabilitation programs</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-gray-900 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready for Your Wildlife Adventure?
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Contact our wildlife specialists to customize your perfect exotic package 
            or get expert advice on the best experiences for your interests.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-wild-orange hover:bg-wild-orange/90"
              onClick={handleContactExpert}
            >
              <Users className="w-5 h-5 mr-2" />
              Speak to an Expert
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-gray-900">
              <Calendar className="w-5 h-5 mr-2" />
              View All Packages
            </Button>
          </div>
        </div>
      </section>
    </>
  );
};

export default WildlifeExperience;
