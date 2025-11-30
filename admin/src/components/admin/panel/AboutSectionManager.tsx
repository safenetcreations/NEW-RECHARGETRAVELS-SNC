import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import {
  Save, Plus, Trash2, Globe, Users, Award, Star,
  MapPin, Camera, Settings, Eye, Car, Bus, Calendar,
  Building2, Plane, Trophy, Target, Sparkles, Quote,
  MessageCircle, Phone, Heart, TrendingUp, Image as ImageIcon,
  ChevronUp, ChevronDown, GripVertical
} from 'lucide-react';
import ImageUpload from '@/components/ui/image-upload';

/**
 * ABOUT RECHARGE TRAVELS - ADMIN PANEL
 *
 * Manages the "About Recharge Travels" company page content:
 * - Hero Section with slider images
 * - Company Stats (Years, Vehicles, Drivers, Travelers)
 * - Our Story section (Mission & Vision)
 * - Timeline/Journey through years
 * - Achievements
 * - Fleet Vehicles
 * - Customer Reviews
 * - Office Locations
 * - CTA Section
 */

// Type definitions
interface HeroSlide {
  id: string;
  image: string;
  title: string;
  subtitle: string;
  badge: string;
  isActive: boolean;
}

interface CompanyStat {
  id: string;
  label: string;
  value: string;
  icon: string;
}

interface StoryContent {
  badge: string;
  title: string;
  paragraph1: string;
  paragraph2: string;
  missionTitle: string;
  missionText: string;
  visionTitle: string;
  visionText: string;
}

interface TimelineEvent {
  id: string;
  yearRange: string;
  title: string;
  description: string;
  type: 'success' | 'crisis' | 'milestone';
  highlights: string[];
  location: string;
  images: string[]; // Array of image URLs for carousel
}

interface Achievement {
  id: string;
  icon: string;
  title: string;
  description: string;
}

interface FleetVehicle {
  id: string;
  name: string;
  description: string;
  image: string;
}

interface CustomerReview {
  id: string;
  rating: number;
  quote: string;
  author: string;
  platform: string;
}

interface OfficeLocation {
  id: string;
  name: string;
  address: string;
  icon: string;
}

interface CTAContent {
  title: string;
  subtitle: string;
  whatsappNumber: string;
  whatsappMessage: string;
}

interface AboutRechargeContent {
  heroSlides: HeroSlide[];
  stats: CompanyStat[];
  story: StoryContent;
  timeline: TimelineEvent[];
  achievements: Achievement[];
  fleet: FleetVehicle[];
  reviews: CustomerReview[];
  locations: OfficeLocation[];
  cta: CTAContent;
}

const defaultContent: AboutRechargeContent = {
  heroSlides: [
    {
      id: '1',
      image: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1920&q=80',
      title: 'Recharge Travels',
      subtitle: "Sri Lanka's Premier Tourist Transport & Experience Operator",
      badge: 'Est. 2014',
      isActive: true
    }
  ],
  stats: [
    { id: '1', label: 'Years of Service', value: '11+', icon: 'calendar' },
    { id: '2', label: 'Vehicles', value: '50+', icon: 'car' },
    { id: '3', label: 'Professional Drivers', value: '60+', icon: 'users' },
    { id: '4', label: 'Happy Travelers', value: '15,000+', icon: 'heart' }
  ],
  story: {
    badge: 'Our Story',
    title: 'A Journey of Resilience',
    paragraph1: "Founded in 2014, Recharge Travels began with a simple vision: to redefine Sri Lankan tourism through reliable transport services and curated travel experiences. From our first office in Colombo, we've grown to become one of the island's most trusted travel partners.",
    paragraph2: "Through the Easter Sunday attacks of 2019, the global pandemic, and Sri Lanka's economic crisis, we've persevered. Each challenge has only strengthened our commitment to excellence and our bond with our customers.",
    missionTitle: 'Our Mission',
    missionText: 'To provide safe, reliable, and memorable travel experiences across Sri Lanka, exceeding expectations with every journey.',
    visionTitle: 'Our Vision',
    visionText: "To be Sri Lanka's most trusted and innovative travel partner, known for excellence, integrity, and customer delight."
  },
  timeline: [
    {
      id: '1',
      yearRange: '2014',
      title: 'The Beginning',
      description: 'Recharge Travels launches in Colombo with a vision to redefine Sri Lankan tourism through reliable transport services and curated travel experiences.',
      type: 'milestone',
      highlights: ['First operations hub opens in Colombo', 'Focus on premium airport transfers and chauffeur services'],
      location: 'Colombo, Sri Lanka',
      images: []
    },
    {
      id: '2',
      yearRange: '2015',
      title: 'Expansion & Recognition',
      description: 'Second office opens in Colombo Bambalapitiya and Recharge Travels earns official Sri Lanka Tourism Development Authority certification.',
      type: 'success',
      highlights: ['SLTDA certification secured', 'Service network expands across Colombo'],
      location: 'Bambalapitiya, Colombo',
      images: []
    },
    {
      id: '3',
      yearRange: '2016',
      title: 'Growing Reputation',
      description: 'Building a strong reputation across Sri Lanka with consistent quality service and expanding customer base.',
      type: 'success',
      highlights: ['Customer base grows significantly', 'Positive reviews across platforms', 'Team expansion'],
      location: 'Colombo, Sri Lanka',
      images: []
    },
    {
      id: '4',
      yearRange: '2017',
      title: 'Award-Winning Service',
      description: 'TripAdvisor Certificate of Excellence awarded, recognizing consistent high-quality service and customer satisfaction.',
      type: 'success',
      highlights: ['First TripAdvisor Certificate of Excellence', 'Growing international clientele', 'Enhanced fleet quality'],
      location: 'Colombo, Sri Lanka',
      images: []
    },
    {
      id: '5',
      yearRange: '2018',
      title: 'Major Milestone',
      description: 'Flagship operations base opens on a 2-acre site near Bandaranaike International Airport, inaugurated by Tourism Minister John Amarathunga with MP Selvam Adaikalanathan.',
      type: 'success',
      highlights: ['Operations campus near CMB airport', 'Fleet surpasses 50 vehicles', '60+ professional drivers onboarded'],
      location: 'Katunayake, Sri Lanka',
      images: []
    },
    {
      id: '6',
      yearRange: '2019',
      title: 'Crisis & Remarkable Recovery',
      description: 'In the aftermath of the Easter Sunday attacks, Recharge Travels rebounds by supporting the Bohra Muslim community pilgrimage, mobilising 50 buses for 15,000 travellers.',
      type: 'crisis',
      highlights: ['Tourism demand collapses post-April attacks', 'Rapid recovery through community support operations', 'Logistics for 15,000 travellers delivered successfully', 'Jaffna branch opens at Cargills Square'],
      location: 'Island-wide operations',
      images: []
    },
    {
      id: '7',
      yearRange: '2020',
      title: 'Pandemic Begins',
      description: 'COVID-19 pandemic hits Sri Lanka. Airport closures halt tourism operations but the team remains committed.',
      type: 'crisis',
      highlights: ['Airport closed for extended period', 'Tourism industry shutdown', 'Team remains committed through uncertainty'],
      location: 'Sri Lanka',
      images: []
    },
    {
      id: '8',
      yearRange: '2021',
      title: 'Perseverance Through Crisis',
      description: 'Extended lockdowns and curfews test the company. Fleet faces challenges but the core team perseveres.',
      type: 'crisis',
      highlights: ['Six months of curfew', 'Maintaining fleet during closures', 'Planning for recovery'],
      location: 'Sri Lanka',
      images: []
    },
    {
      id: '9',
      yearRange: '2022',
      title: 'Economic Challenges & Restart',
      description: 'Sri Lanka faces its worst economic crisis. As borders reopen, Recharge Travels begins rebuilding operations.',
      type: 'crisis',
      highlights: ['Economic instability increases operating costs', 'Borders reopen for tourism', 'Gradual relaunch of services'],
      location: 'Sri Lanka',
      images: []
    },
    {
      id: '10',
      yearRange: '2023',
      title: 'Rebuilding Momentum',
      description: 'Tourism slowly returns to Sri Lanka. Recharge Travels retains its core team and maintains customer commitments.',
      type: 'milestone',
      highlights: ['Core operations protected', 'Customer trust maintained', 'Partnerships renewed'],
      location: 'Sri Lanka',
      images: []
    },
    {
      id: '11',
      yearRange: '2024',
      title: 'Strengthening Position',
      description: 'Recovery continues with renewed focus on quality service and customer experience excellence.',
      type: 'success',
      highlights: ['Fleet modernization begins', 'Enhanced customer service', 'Digital booking improvements'],
      location: 'Sri Lanka',
      images: []
    },
    {
      id: '12',
      yearRange: '2025',
      title: 'The Phoenix Rises',
      description: 'Recharge Travels returns to growth with renewed energy, repositioning as Sri Lanka\'s premier tourist transport and experience operator.',
      type: 'success',
      highlights: ['Fleet revitalisation plan underway', 'New concierge-driven guest experience', 'Expanded luxury services'],
      location: 'Sri Lanka',
      images: []
    }
  ],
  achievements: [
    { id: '1', icon: '🏆', title: 'TripAdvisor Excellence', description: 'Certificate of Excellence winner for 3 consecutive years (2017-2019)' },
    { id: '2', icon: '🤝', title: 'Major Partnerships', description: 'Trusted partner of GetTransfer, Booking.com, and other global platforms' },
    { id: '3', icon: '🚌', title: 'Large Scale Operations', description: 'Successfully managed transport for 15,000+ people in a single event' },
    { id: '4', icon: '⭐', title: 'Customer Satisfaction', description: 'Thousands of positive reviews across all major platforms' },
    { id: '5', icon: '✈️', title: 'Airport Specialists', description: '24/7 airport transfer services with strategic location near CMB' },
    { id: '6', icon: '🌍', title: 'Island-Wide Coverage', description: 'Operations in Colombo, Katunayake, and Jaffna' }
  ],
  fleet: [
    { id: '1', name: 'Luxury Sedans', description: 'Premium vehicles for executive travel and private transfers.', image: '' },
    { id: '2', name: 'SUVs', description: 'Spacious SUVs ideal for family itineraries and long-distance tours.', image: '' },
    { id: '3', name: 'Tourist Vans', description: 'Comfortable vans with ample luggage space for small groups.', image: '' },
    { id: '4', name: 'Tourist Buses', description: 'Large capacity coaches for events, pilgrimages, and corporate delegations.', image: '' }
  ],
  reviews: [
    { id: '1', rating: 5, quote: 'Excellent service! Professional drivers and well-maintained vehicles.', author: 'John D.', platform: 'TripAdvisor' },
    { id: '2', rating: 5, quote: 'Used Recharge Travels for our family vacation. They made our Sri Lanka tour unforgettable!', author: 'Sarah M.', platform: 'Google' },
    { id: '3', rating: 5, quote: 'Exceptional coordination and friendly staff. They handled our large group with ease.', author: 'Lakshmi P.', platform: 'Facebook' }
  ],
  locations: [
    { id: '1', name: 'Colombo Office', address: 'Bambalapitiya, Colombo', icon: 'building' },
    { id: '2', name: 'Katunayake HQ', address: 'Near CMB Airport', icon: 'plane' },
    { id: '3', name: 'Jaffna Branch', address: 'Cargills Square, Jaffna', icon: 'mappin' }
  ],
  cta: {
    title: 'Ready to Travel With Us?',
    subtitle: 'Experience the Recharge Travels difference - reliable, comfortable, and memorable journeys across Sri Lanka',
    whatsappNumber: '+94777721999',
    whatsappMessage: "Hello Recharge Travels, I'm interested in booking a transfer"
  }
};

// Helper to generate unique IDs
const generateId = () => Math.random().toString(36).substr(2, 9);

const AboutSectionManager: React.FC = () => {
  const [content, setContent] = useState<AboutRechargeContent>(defaultContent);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('hero');

  useEffect(() => {
    loadContent();
  }, []);

  const loadContent = async () => {
    setLoading(true);
    try {
      const docRef = doc(db, 'page-content', 'about-recharge-travels');
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data() as AboutRechargeContent;
        setContent({ ...defaultContent, ...data });
        toast.success('Content loaded successfully');
      } else {
        toast.info('Using default content - Save to create new');
      }
    } catch (error) {
      console.error('Error loading content:', error);
      toast.error('Failed to load content');
    } finally {
      setLoading(false);
    }
  };

  const saveContent = async () => {
    setSaving(true);
    try {
      const docRef = doc(db, 'page-content', 'about-recharge-travels');
      await setDoc(docRef, {
        ...content,
        updatedAt: new Date().toISOString()
      });
      toast.success('Content saved successfully!');
    } catch (error) {
      console.error('Error saving content:', error);
      toast.error('Failed to save content');
    } finally {
      setSaving(false);
    }
  };

  // Hero Slides Management
  const addHeroSlide = () => {
    setContent({
      ...content,
      heroSlides: [...content.heroSlides, {
        id: generateId(),
        image: '',
        title: 'New Slide Title',
        subtitle: 'Slide subtitle text',
        badge: 'Est. 2014',
        isActive: true
      }]
    });
  };

  const updateHeroSlide = (index: number, field: keyof HeroSlide, value: any) => {
    const slides = [...content.heroSlides];
    slides[index] = { ...slides[index], [field]: value };
    setContent({ ...content, heroSlides: slides });
  };

  const removeHeroSlide = (index: number) => {
    setContent({ ...content, heroSlides: content.heroSlides.filter((_, i) => i !== index) });
    toast.success('Slide removed');
  };

  // Stats Management
  const updateStat = (index: number, field: keyof CompanyStat, value: string) => {
    const stats = [...content.stats];
    stats[index] = { ...stats[index], [field]: value };
    setContent({ ...content, stats });
  };

  // Timeline Management
  const addTimelineEvent = () => {
    setContent({
      ...content,
      timeline: [...content.timeline, {
        id: generateId(),
        yearRange: '2025',
        title: 'New Event',
        description: '',
        type: 'milestone',
        highlights: [],
        location: 'Sri Lanka',
        images: []
      }]
    });
  };

  // Timeline Image Management
  const addTimelineImage = (eventIndex: number) => {
    const timeline = [...content.timeline];
    if (!timeline[eventIndex].images) {
      timeline[eventIndex].images = [];
    }
    timeline[eventIndex].images.push('');
    setContent({ ...content, timeline });
  };

  const updateTimelineImage = (eventIndex: number, imageIndex: number, url: string) => {
    const timeline = [...content.timeline];
    if (!timeline[eventIndex].images) {
      timeline[eventIndex].images = [];
    }
    timeline[eventIndex].images[imageIndex] = url;
    setContent({ ...content, timeline });
  };

  const removeTimelineImage = (eventIndex: number, imageIndex: number) => {
    const timeline = [...content.timeline];
    timeline[eventIndex].images = timeline[eventIndex].images.filter((_, i) => i !== imageIndex);
    setContent({ ...content, timeline });
    toast.success('Image removed');
  };

  const updateTimelineEvent = (index: number, field: keyof TimelineEvent, value: any) => {
    const timeline = [...content.timeline];
    timeline[index] = { ...timeline[index], [field]: value };
    setContent({ ...content, timeline });
  };

  const removeTimelineEvent = (index: number) => {
    setContent({ ...content, timeline: content.timeline.filter((_, i) => i !== index) });
    toast.success('Timeline event removed');
  };

  // Achievements Management
  const addAchievement = () => {
    setContent({
      ...content,
      achievements: [...content.achievements, {
        id: generateId(),
        icon: '🏆',
        title: 'New Achievement',
        description: ''
      }]
    });
  };

  const updateAchievement = (index: number, field: keyof Achievement, value: string) => {
    const achievements = [...content.achievements];
    achievements[index] = { ...achievements[index], [field]: value };
    setContent({ ...content, achievements });
  };

  const removeAchievement = (index: number) => {
    setContent({ ...content, achievements: content.achievements.filter((_, i) => i !== index) });
    toast.success('Achievement removed');
  };

  // Fleet Management
  const addFleetVehicle = () => {
    setContent({
      ...content,
      fleet: [...content.fleet, {
        id: generateId(),
        name: 'New Vehicle',
        description: '',
        image: ''
      }]
    });
  };

  const updateFleetVehicle = (index: number, field: keyof FleetVehicle, value: string) => {
    const fleet = [...content.fleet];
    fleet[index] = { ...fleet[index], [field]: value };
    setContent({ ...content, fleet });
  };

  const removeFleetVehicle = (index: number) => {
    setContent({ ...content, fleet: content.fleet.filter((_, i) => i !== index) });
    toast.success('Vehicle removed');
  };

  // Reviews Management
  const addReview = () => {
    setContent({
      ...content,
      reviews: [...content.reviews, {
        id: generateId(),
        rating: 5,
        quote: '',
        author: '',
        platform: 'Google'
      }]
    });
  };

  const updateReview = (index: number, field: keyof CustomerReview, value: any) => {
    const reviews = [...content.reviews];
    reviews[index] = { ...reviews[index], [field]: value };
    setContent({ ...content, reviews });
  };

  const removeReview = (index: number) => {
    setContent({ ...content, reviews: content.reviews.filter((_, i) => i !== index) });
    toast.success('Review removed');
  };

  // Locations Management
  const addLocation = () => {
    setContent({
      ...content,
      locations: [...content.locations, {
        id: generateId(),
        name: 'New Location',
        address: '',
        icon: 'building'
      }]
    });
  };

  const updateLocation = (index: number, field: keyof OfficeLocation, value: string) => {
    const locations = [...content.locations];
    locations[index] = { ...locations[index], [field]: value };
    setContent({ ...content, locations });
  };

  const removeLocation = (index: number) => {
    setContent({ ...content, locations: content.locations.filter((_, i) => i !== index) });
    toast.success('Location removed');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-6"></div>
          <p className="text-xl text-gray-600">Loading content...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <Card className="border-0 shadow-2xl bg-gradient-to-br from-blue-50 to-indigo-50">
        <CardHeader>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <CardTitle className="flex items-center gap-2 text-3xl">
                <Building2 className="w-8 h-8 text-blue-600" />
                About Recharge Travels
              </CardTitle>
              <CardDescription className="text-lg mt-2">
                Manage all content for the About Us company page - Hero, Stats, Story, Timeline, Fleet, Reviews
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Button onClick={loadContent} variant="outline" disabled={loading}>
                <Eye className="w-4 h-4 mr-2" />
                Reload
              </Button>
              <Button
                onClick={saveContent}
                disabled={saving}
                size="lg"
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg"
              >
                <Save className="w-5 h-5 mr-2" />
                {saving ? 'Saving...' : 'Save All Changes'}
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Main Content Tabs */}
      <Card className="shadow-xl">
        <CardContent className="pt-6">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-4 lg:grid-cols-9 mb-8">
              <TabsTrigger value="hero">Hero</TabsTrigger>
              <TabsTrigger value="stats">Stats</TabsTrigger>
              <TabsTrigger value="story">Story</TabsTrigger>
              <TabsTrigger value="timeline">Timeline</TabsTrigger>
              <TabsTrigger value="achievements">Awards</TabsTrigger>
              <TabsTrigger value="fleet">Fleet</TabsTrigger>
              <TabsTrigger value="reviews">Reviews</TabsTrigger>
              <TabsTrigger value="locations">Locations</TabsTrigger>
              <TabsTrigger value="cta">CTA</TabsTrigger>
            </TabsList>

            {/* HERO SECTION TAB */}
            <TabsContent value="hero" className="space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <ImageIcon className="w-5 h-5 text-blue-600" />
                        Hero Slider Images
                      </CardTitle>
                      <CardDescription>Manage hero section background images and text</CardDescription>
                    </div>
                    <Button onClick={addHeroSlide}>
                      <Plus className="w-4 h-4 mr-2" />
                      Add Slide
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {content.heroSlides.map((slide, index) => (
                      <Card key={slide.id} className="border-2 border-dashed">
                        <CardHeader className="pb-2">
                          <div className="flex justify-between items-center">
                            <div className="flex items-center gap-3">
                              <Badge variant={slide.isActive ? "default" : "secondary"}>
                                Slide {index + 1}
                              </Badge>
                              <div className="flex items-center gap-2">
                                <Switch
                                  checked={slide.isActive}
                                  onCheckedChange={(checked) => updateHeroSlide(index, 'isActive', checked)}
                                />
                                <span className="text-sm text-gray-500">Active</span>
                              </div>
                            </div>
                            <Button
                              onClick={() => removeHeroSlide(index)}
                              variant="ghost"
                              size="sm"
                              className="text-red-500 hover:text-red-700"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <div className="space-y-4">
                              <div>
                                <Label>Slide Title</Label>
                                <Input
                                  value={slide.title}
                                  onChange={(e) => updateHeroSlide(index, 'title', e.target.value)}
                                  placeholder="Recharge Travels"
                                  className="text-lg"
                                />
                              </div>
                              <div>
                                <Label>Subtitle</Label>
                                <Input
                                  value={slide.subtitle}
                                  onChange={(e) => updateHeroSlide(index, 'subtitle', e.target.value)}
                                  placeholder="Sri Lanka's Premier Tourist Transport"
                                />
                              </div>
                              <div>
                                <Label>Badge Text</Label>
                                <Input
                                  value={slide.badge}
                                  onChange={(e) => updateHeroSlide(index, 'badge', e.target.value)}
                                  placeholder="Est. 2014"
                                />
                              </div>
                            </div>
                            <div>
                              <Label>Background Image</Label>
                              <ImageUpload
                                value={slide.image}
                                onChange={(url) => updateHeroSlide(index, 'image', url)}
                                onRemove={() => updateHeroSlide(index, 'image', '')}
                                folder="about-recharge/hero"
                                helperText="Recommended: 1920x1080px (16:9)"
                              />
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* STATS TAB */}
            <TabsContent value="stats" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-green-600" />
                    Company Statistics
                  </CardTitle>
                  <CardDescription>Stats displayed in the hero section</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {content.stats.map((stat, index) => (
                      <Card key={stat.id} className="shadow-md">
                        <CardContent className="pt-6 space-y-3">
                          <div>
                            <Label>Value</Label>
                            <Input
                              value={stat.value}
                              onChange={(e) => updateStat(index, 'value', e.target.value)}
                              placeholder="11+"
                              className="text-2xl font-bold text-center"
                            />
                          </div>
                          <div>
                            <Label>Label</Label>
                            <Input
                              value={stat.label}
                              onChange={(e) => updateStat(index, 'label', e.target.value)}
                              placeholder="Years of Service"
                            />
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* STORY TAB */}
            <TabsContent value="story" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Heart className="w-5 h-5 text-red-500" />
                    Our Story Section
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <Label>Badge Text</Label>
                        <Input
                          value={content.story.badge}
                          onChange={(e) => setContent({
                            ...content,
                            story: { ...content.story, badge: e.target.value }
                          })}
                          placeholder="Our Story"
                        />
                      </div>
                      <div>
                        <Label>Section Title</Label>
                        <Input
                          value={content.story.title}
                          onChange={(e) => setContent({
                            ...content,
                            story: { ...content.story, title: e.target.value }
                          })}
                          placeholder="A Journey of Resilience"
                          className="text-xl"
                        />
                      </div>
                      <div>
                        <Label>First Paragraph</Label>
                        <Textarea
                          value={content.story.paragraph1}
                          onChange={(e) => setContent({
                            ...content,
                            story: { ...content.story, paragraph1: e.target.value }
                          })}
                          rows={4}
                        />
                      </div>
                      <div>
                        <Label>Second Paragraph</Label>
                        <Textarea
                          value={content.story.paragraph2}
                          onChange={(e) => setContent({
                            ...content,
                            story: { ...content.story, paragraph2: e.target.value }
                          })}
                          rows={4}
                        />
                      </div>
                    </div>
                    <div className="space-y-4">
                      <Card className="bg-blue-50 border-blue-200">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-lg flex items-center gap-2">
                            <Target className="w-5 h-5 text-blue-600" />
                            Mission
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          <Input
                            value={content.story.missionTitle}
                            onChange={(e) => setContent({
                              ...content,
                              story: { ...content.story, missionTitle: e.target.value }
                            })}
                            placeholder="Our Mission"
                          />
                          <Textarea
                            value={content.story.missionText}
                            onChange={(e) => setContent({
                              ...content,
                              story: { ...content.story, missionText: e.target.value }
                            })}
                            rows={3}
                          />
                        </CardContent>
                      </Card>
                      <Card className="bg-amber-50 border-amber-200">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-lg flex items-center gap-2">
                            <Sparkles className="w-5 h-5 text-amber-600" />
                            Vision
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          <Input
                            value={content.story.visionTitle}
                            onChange={(e) => setContent({
                              ...content,
                              story: { ...content.story, visionTitle: e.target.value }
                            })}
                            placeholder="Our Vision"
                          />
                          <Textarea
                            value={content.story.visionText}
                            onChange={(e) => setContent({
                              ...content,
                              story: { ...content.story, visionText: e.target.value }
                            })}
                            rows={3}
                          />
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* TIMELINE TAB */}
            <TabsContent value="timeline" className="space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <Calendar className="w-5 h-5 text-amber-600" />
                        Our Journey Timeline
                      </CardTitle>
                      <CardDescription>Company history and milestones</CardDescription>
                    </div>
                    <Button onClick={addTimelineEvent}>
                      <Plus className="w-4 h-4 mr-2" />
                      Add Event
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {content.timeline.map((event, index) => (
                      <Card key={event.id} className={`border-l-4 ${
                        event.type === 'success' ? 'border-green-500' :
                        event.type === 'crisis' ? 'border-red-500' : 'border-amber-500'
                      }`}>
                        <CardHeader className="pb-2">
                          <div className="flex justify-between items-start">
                            <div className="flex items-center gap-3">
                              <Badge className={
                                event.type === 'success' ? 'bg-green-500' :
                                event.type === 'crisis' ? 'bg-red-500' : 'bg-amber-500'
                              }>
                                {event.yearRange}
                              </Badge>
                              <select
                                value={event.type}
                                onChange={(e) => updateTimelineEvent(index, 'type', e.target.value)}
                                className="text-sm border rounded px-2 py-1"
                              >
                                <option value="milestone">Milestone</option>
                                <option value="success">Success</option>
                                <option value="crisis">Crisis</option>
                              </select>
                            </div>
                            <Button
                              onClick={() => removeTimelineEvent(index)}
                              variant="ghost"
                              size="sm"
                              className="text-red-500"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                              <Label>Year Range</Label>
                              <Input
                                value={event.yearRange}
                                onChange={(e) => updateTimelineEvent(index, 'yearRange', e.target.value)}
                                placeholder="2014"
                              />
                            </div>
                            <div>
                              <Label>Title</Label>
                              <Input
                                value={event.title}
                                onChange={(e) => updateTimelineEvent(index, 'title', e.target.value)}
                                placeholder="The Beginning"
                              />
                            </div>
                            <div>
                              <Label>Location</Label>
                              <Input
                                value={event.location}
                                onChange={(e) => updateTimelineEvent(index, 'location', e.target.value)}
                                placeholder="Colombo, Sri Lanka"
                              />
                            </div>
                          </div>
                          <div>
                            <Label>Description</Label>
                            <Textarea
                              value={event.description}
                              onChange={(e) => updateTimelineEvent(index, 'description', e.target.value)}
                              rows={2}
                            />
                          </div>
                          <div>
                            <Label>Highlights (one per line)</Label>
                            <Textarea
                              value={event.highlights.join('\n')}
                              onChange={(e) => updateTimelineEvent(index, 'highlights', e.target.value.split('\n').filter(h => h.trim()))}
                              rows={3}
                              placeholder="First operations hub opens&#10;Focus on premium airport transfers"
                            />
                          </div>

                          {/* Timeline Images Gallery */}
                          <div className="mt-6 pt-4 border-t">
                            <div className="flex justify-between items-center mb-4">
                              <div>
                                <Label className="text-lg font-semibold flex items-center gap-2">
                                  <Camera className="w-5 h-5 text-blue-600" />
                                  Milestone Images (Carousel)
                                </Label>
                                <p className="text-sm text-gray-500 mt-1">
                                  Add images to show in a carousel for this milestone. You can add 10+ images.
                                </p>
                              </div>
                              <Button
                                type="button"
                                onClick={() => addTimelineImage(index)}
                                size="sm"
                                variant="outline"
                                className="border-blue-500 text-blue-600 hover:bg-blue-50"
                              >
                                <Plus className="w-4 h-4 mr-1" />
                                Add Image
                              </Button>
                            </div>

                            {(event.images && event.images.length > 0) ? (
                              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                {event.images.map((image, imgIndex) => (
                                  <Card key={imgIndex} className="relative overflow-hidden group">
                                    <div className="aspect-video bg-gray-100">
                                      {image ? (
                                        <img
                                          src={image}
                                          alt={`${event.title} - Image ${imgIndex + 1}`}
                                          className="w-full h-full object-cover"
                                        />
                                      ) : (
                                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                                          <ImageIcon className="w-10 h-10" />
                                        </div>
                                      )}
                                    </div>
                                    <CardContent className="p-2">
                                      <ImageUpload
                                        value={image}
                                        onChange={(url) => updateTimelineImage(index, imgIndex, url)}
                                        onRemove={() => removeTimelineImage(index, imgIndex)}
                                        folder={`about-recharge/timeline/${event.yearRange}`}
                                        helperText="16:9 ratio recommended"
                                        compact
                                      />
                                    </CardContent>
                                    <Button
                                      type="button"
                                      onClick={() => removeTimelineImage(index, imgIndex)}
                                      variant="ghost"
                                      size="sm"
                                      className="absolute top-1 right-1 bg-red-500/80 hover:bg-red-600 text-white p-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                      <Trash2 className="w-3 h-3" />
                                    </Button>
                                  </Card>
                                ))}
                              </div>
                            ) : (
                              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                                <Camera className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                                <p className="text-gray-500 mb-3">No images yet. Add images to create a carousel.</p>
                                <Button
                                  type="button"
                                  onClick={() => addTimelineImage(index)}
                                  variant="outline"
                                >
                                  <Plus className="w-4 h-4 mr-2" />
                                  Add First Image
                                </Button>
                              </div>
                            )}

                            {event.images && event.images.length > 0 && (
                              <p className="text-sm text-gray-500 mt-2 text-right">
                                {event.images.filter(img => img).length} image(s) in carousel
                              </p>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* ACHIEVEMENTS TAB */}
            <TabsContent value="achievements" className="space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <Trophy className="w-5 h-5 text-yellow-600" />
                        Achievements & Awards
                      </CardTitle>
                    </div>
                    <Button onClick={addAchievement}>
                      <Plus className="w-4 h-4 mr-2" />
                      Add Achievement
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {content.achievements.map((achievement, index) => (
                      <Card key={achievement.id} className="shadow-md">
                        <CardHeader className="pb-2">
                          <div className="flex justify-between items-start">
                            <Badge variant="outline">#{index + 1}</Badge>
                            <Button
                              onClick={() => removeAchievement(index)}
                              variant="ghost"
                              size="sm"
                              className="text-red-500"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          <div>
                            <Label>Icon (Emoji)</Label>
                            <Input
                              value={achievement.icon}
                              onChange={(e) => updateAchievement(index, 'icon', e.target.value)}
                              placeholder="🏆"
                              maxLength={4}
                            />
                          </div>
                          <div>
                            <Label>Title</Label>
                            <Input
                              value={achievement.title}
                              onChange={(e) => updateAchievement(index, 'title', e.target.value)}
                              placeholder="TripAdvisor Excellence"
                            />
                          </div>
                          <div>
                            <Label>Description</Label>
                            <Textarea
                              value={achievement.description}
                              onChange={(e) => updateAchievement(index, 'description', e.target.value)}
                              rows={2}
                            />
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* FLEET TAB */}
            <TabsContent value="fleet" className="space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <Car className="w-5 h-5 text-blue-600" />
                        Fleet Vehicles
                      </CardTitle>
                    </div>
                    <Button onClick={addFleetVehicle}>
                      <Plus className="w-4 h-4 mr-2" />
                      Add Vehicle
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {content.fleet.map((vehicle, index) => (
                      <Card key={vehicle.id} className="shadow-md">
                        <CardHeader className="pb-2">
                          <div className="flex justify-between items-start">
                            <Badge>Vehicle {index + 1}</Badge>
                            <Button
                              onClick={() => removeFleetVehicle(index)}
                              variant="ghost"
                              size="sm"
                              className="text-red-500"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div>
                            <Label>Vehicle Name</Label>
                            <Input
                              value={vehicle.name}
                              onChange={(e) => updateFleetVehicle(index, 'name', e.target.value)}
                              placeholder="Luxury Sedans"
                            />
                          </div>
                          <div>
                            <Label>Description</Label>
                            <Textarea
                              value={vehicle.description}
                              onChange={(e) => updateFleetVehicle(index, 'description', e.target.value)}
                              rows={2}
                            />
                          </div>
                          <div>
                            <Label>Vehicle Image</Label>
                            <ImageUpload
                              value={vehicle.image}
                              onChange={(url) => updateFleetVehicle(index, 'image', url)}
                              onRemove={() => updateFleetVehicle(index, 'image', '')}
                              folder="about-recharge/fleet"
                              helperText="Recommended: 600x400px"
                            />
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* REVIEWS TAB */}
            <TabsContent value="reviews" className="space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <Quote className="w-5 h-5 text-amber-600" />
                        Customer Reviews
                      </CardTitle>
                    </div>
                    <Button onClick={addReview}>
                      <Plus className="w-4 h-4 mr-2" />
                      Add Review
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {content.reviews.map((review, index) => (
                      <Card key={review.id} className="shadow-md">
                        <CardHeader className="pb-2">
                          <div className="flex justify-between items-start">
                            <div className="flex gap-1">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`w-4 h-4 cursor-pointer ${i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                                  onClick={() => updateReview(index, 'rating', i + 1)}
                                />
                              ))}
                            </div>
                            <Button
                              onClick={() => removeReview(index)}
                              variant="ghost"
                              size="sm"
                              className="text-red-500"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          <div>
                            <Label>Review Text</Label>
                            <Textarea
                              value={review.quote}
                              onChange={(e) => updateReview(index, 'quote', e.target.value)}
                              rows={3}
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <Label>Author</Label>
                              <Input
                                value={review.author}
                                onChange={(e) => updateReview(index, 'author', e.target.value)}
                                placeholder="John D."
                              />
                            </div>
                            <div>
                              <Label>Platform</Label>
                              <select
                                value={review.platform}
                                onChange={(e) => updateReview(index, 'platform', e.target.value)}
                                className="w-full border rounded px-3 py-2"
                              >
                                <option value="TripAdvisor">TripAdvisor</option>
                                <option value="Google">Google</option>
                                <option value="Facebook">Facebook</option>
                                <option value="Booking.com">Booking.com</option>
                              </select>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* LOCATIONS TAB */}
            <TabsContent value="locations" className="space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <MapPin className="w-5 h-5 text-red-500" />
                        Office Locations
                      </CardTitle>
                    </div>
                    <Button onClick={addLocation}>
                      <Plus className="w-4 h-4 mr-2" />
                      Add Location
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {content.locations.map((location, index) => (
                      <Card key={location.id} className="shadow-md">
                        <CardHeader className="pb-2">
                          <div className="flex justify-between items-start">
                            <Badge variant="outline">Location {index + 1}</Badge>
                            <Button
                              onClick={() => removeLocation(index)}
                              variant="ghost"
                              size="sm"
                              className="text-red-500"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          <div>
                            <Label>Office Name</Label>
                            <Input
                              value={location.name}
                              onChange={(e) => updateLocation(index, 'name', e.target.value)}
                              placeholder="Colombo Office"
                            />
                          </div>
                          <div>
                            <Label>Address</Label>
                            <Input
                              value={location.address}
                              onChange={(e) => updateLocation(index, 'address', e.target.value)}
                              placeholder="Bambalapitiya, Colombo"
                            />
                          </div>
                          <div>
                            <Label>Icon Type</Label>
                            <select
                              value={location.icon}
                              onChange={(e) => updateLocation(index, 'icon', e.target.value)}
                              className="w-full border rounded px-3 py-2"
                            >
                              <option value="building">Building</option>
                              <option value="plane">Airport/Plane</option>
                              <option value="mappin">Map Pin</option>
                            </select>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* CTA TAB */}
            <TabsContent value="cta" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageCircle className="w-5 h-5 text-green-600" />
                    Call to Action Section
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <Label>CTA Title</Label>
                        <Input
                          value={content.cta.title}
                          onChange={(e) => setContent({
                            ...content,
                            cta: { ...content.cta, title: e.target.value }
                          })}
                          placeholder="Ready to Travel With Us?"
                          className="text-xl"
                        />
                      </div>
                      <div>
                        <Label>CTA Subtitle</Label>
                        <Textarea
                          value={content.cta.subtitle}
                          onChange={(e) => setContent({
                            ...content,
                            cta: { ...content.cta, subtitle: e.target.value }
                          })}
                          rows={3}
                        />
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <Label>WhatsApp Number</Label>
                        <Input
                          value={content.cta.whatsappNumber}
                          onChange={(e) => setContent({
                            ...content,
                            cta: { ...content.cta, whatsappNumber: e.target.value }
                          })}
                          placeholder="+94777721999"
                        />
                      </div>
                      <div>
                        <Label>WhatsApp Pre-filled Message</Label>
                        <Textarea
                          value={content.cta.whatsappMessage}
                          onChange={(e) => setContent({
                            ...content,
                            cta: { ...content.cta, whatsappMessage: e.target.value }
                          })}
                          rows={2}
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Sticky Save Button */}
          <div className="sticky bottom-0 bg-white border-t-2 pt-6 mt-8 flex justify-end gap-4">
            <Button onClick={loadContent} variant="outline" size="lg" disabled={loading}>
              Cancel & Reload
            </Button>
            <Button
              onClick={saveContent}
              disabled={saving}
              size="lg"
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg px-8"
            >
              <Save className="w-5 h-5 mr-2" />
              {saving ? 'Saving...' : 'Save All Changes'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AboutSectionManager;
