import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Plus, 
  Save, 
  Trash2, 
  Edit3, 
  Train, 
  Leaf, 
  Ship, 
  Camera, 
  Mountain,
  Waves,
  ChefHat,
  Users,
  Eye
} from 'lucide-react';
import { db } from '@/lib/firebase';
import { collection, addDoc, updateDoc, deleteDoc, doc, getDocs, query, orderBy } from 'firebase/firestore';
import { toast } from 'sonner';

interface Experience {
  id?: string;
  title: string;
  slug: string;
  description: string;
  heroTagline: string;
  highlights: string[];
  suggestedTours: string[];
  travelTips: string[];
  seoMetaDescription: string;
  seoFocusKeyword: string;
  category: string;
  featured: boolean;
  active: boolean;
  heroImages: string[];
  pricing: {
    from: number;
    currency: string;
  };
  duration: string;
  difficulty: 'Easy' | 'Moderate' | 'Challenging';
  bestTime: string;
  location: string;
  maxParticipants: number;
  ageRestriction: string;
}

const experiences = [
  {
    title: "Scenic Train Rides",
    slug: "train-journeys",
    category: "Transportation",
    icon: Train,
    description: "Experience one of the most beautiful train rides in the world through tea plantations and misty mountains."
  },
  {
    title: "Tea Trail Towns", 
    slug: "tea-trails",
    category: "Cultural",
    icon: Leaf,
    description: "Explore the heritage of Ceylon tea in the cool hills from Nuwara Eliya to Haputale."
  },
  {
    title: "Whale Watching",
    slug: "whale-watching", 
    category: "Marine",
    icon: Waves,
    description: "Witness majestic blue whales and spinner dolphins along Sri Lanka's coast."
  },
  {
    title: "Pilgrimage Tours",
    slug: "pilgrimage-tours",
    category: "Cultural", 
    icon: Users,
    description: "Explore the island's most revered spiritual sites across all faiths."
  },
  {
    title: "Island Escapes",
    slug: "island-getaways",
    category: "Marine",
    icon: Ship,
    description: "Sail away to the quiet islands of the north and east."
  },
  {
    title: "Water Sports Hikkaduwa",
    slug: "hikkaduwa-water-sports",
    category: "Adventure",
    icon: Waves,
    description: "Dive into adventure with surfing, snorkeling, and water sports."
  },
  {
    title: "Hot Air Ballooning",
    slug: "hot-air-balloon-sigiriya", 
    category: "Adventure",
    icon: Eye,
    description: "Fly over ruins and rainforest in a magical balloon ride at sunrise."
  },
  {
    title: "Kite Surfing Kalpitiya",
    slug: "kalpitiya-kitesurfing",
    category: "Adventure", 
    icon: Mountain,
    description: "Ride the wind in Sri Lanka's ultimate kite surfing adventure."
  },
  {
    title: "Jungle Camping",
    slug: "jungle-camping",
    category: "Adventure",
    icon: Mountain,
    description: "Sleep under the stars in Sri Lanka's untamed forests."
  },
  {
    title: "Lagoon Canoe Safari",
    slug: "lagoon-safari",
    category: "Nature",
    icon: Ship,
    description: "Paddle into peace through mangrove forests and silent lagoons."
  },
  {
    title: "Cooking Classes",
    slug: "cooking-class-sri-lanka",
    category: "Cultural",
    icon: ChefHat,
    description: "Spice up your trip with hands-on cooking with a Sri Lankan chef."
  },
  {
    title: "Sea Cucumber Farming",
    slug: "sea-cucumber-farming",
    category: "Educational",
    icon: Waves,
    description: "Discover the secrets of sustainable marine aquaculture."
  }
];

const ExperiencesSection: React.FC = () => {
  const [selectedExperience, setSelectedExperience] = useState<string | null>(null);
  const [experienceData, setExperienceData] = useState<Experience>({
    title: '',
    slug: '',
    description: '',
    heroTagline: '',
    highlights: [],
    suggestedTours: [],
    travelTips: [],
    seoMetaDescription: '',
    seoFocusKeyword: '',
    category: '',
    featured: false,
    active: true,
    heroImages: [],
    pricing: { from: 0, currency: 'USD' },
    duration: '',
    difficulty: 'Easy',
    bestTime: '',
    location: '',
    maxParticipants: 0,
    ageRestriction: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [experiences_data, setExperiencesData] = useState<Experience[]>([]);
  const [newHighlight, setNewHighlight] = useState('');
  const [newTour, setNewTour] = useState('');
  const [newTip, setNewTip] = useState('');
  const [newImage, setNewImage] = useState('');

  // Load experience data from Firebase
  const loadExperienceData = async (slug: string) => {
    try {
      setIsLoading(true);
      const experiencesRef = collection(db, 'experiences');
      const q = query(experiencesRef, orderBy('title'));
      const querySnapshot = await getDocs(q);
      
      const experienceDoc = querySnapshot.docs.find(doc => doc.data().slug === slug);
      if (experienceDoc) {
        const data = { id: experienceDoc.id, ...experienceDoc.data() } as Experience;
        setExperienceData(data);
      } else {
        // Create default structure for new experience
        const defaultExp = experiences.find(exp => exp.slug === slug);
        if (defaultExp) {
          setExperienceData({
            title: defaultExp.title,
            slug: defaultExp.slug,
            description: defaultExp.description,
            heroTagline: '',
            highlights: [],
            suggestedTours: [],
            travelTips: [],
            seoMetaDescription: '',
            seoFocusKeyword: defaultExp.slug.replace('-', ' '),
            category: defaultExp.category,
            featured: false,
            active: true,
            heroImages: [],
            pricing: { from: 50, currency: 'USD' },
            duration: '1 day',
            difficulty: 'Easy',
            bestTime: 'Year round',
            location: 'Sri Lanka',
            maxParticipants: 10,
            ageRestriction: 'All ages'
          });
        }
      }
    } catch (error) {
      console.error('Error loading experience data:', error);
      toast.error('Failed to load experience data');
    } finally {
      setIsLoading(false);
    }
  };

  // Save experience data to Firebase
  const handleSave = async () => {
    try {
      setIsLoading(true);
      const experiencesRef = collection(db, 'experiences');
      
      if (experienceData.id) {
        // Update existing experience
        const { id, ...updateData } = experienceData;
        await updateDoc(doc(db, 'experiences', experienceData.id), updateData);
        toast.success('Experience updated successfully!');
      } else {
        // Create new experience
        const { id, ...newData } = experienceData;
        await addDoc(experiencesRef, newData);
        toast.success('Experience created successfully!');
      }
      
      // Reload data
      await loadExperienceData(experienceData.slug);
    } catch (error) {
      console.error('Error saving experience:', error);
      toast.error('Failed to save experience');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle form field updates
  const updateField = (field: keyof Experience, value: any) => {
    setExperienceData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Handle array field additions
  const addToArray = (field: 'highlights' | 'suggestedTours' | 'travelTips' | 'heroImages', value: string) => {
    if (value.trim()) {
      setExperienceData(prev => ({
        ...prev,
        [field]: [...prev[field], value.trim()]
      }));
      
      // Clear input
      if (field === 'highlights') setNewHighlight('');
      if (field === 'suggestedTours') setNewTour('');
      if (field === 'travelTips') setNewTip('');
      if (field === 'heroImages') setNewImage('');
    }
  };

  // Remove from array
  const removeFromArray = (field: 'highlights' | 'suggestedTours' | 'travelTips' | 'heroImages', index: number) => {
    setExperienceData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));
  };

  useEffect(() => {
    if (selectedExperience) {
      loadExperienceData(selectedExperience);
    }
  }, [selectedExperience]);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Experience Content Management</CardTitle>
          <CardDescription>
            Manage content for all experience pages including descriptions, highlights, tours, and SEO
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {experiences.map((experience) => (
              <Button
                key={experience.slug}
                variant={selectedExperience === experience.slug ? "default" : "outline"}
                className="h-auto p-4 flex flex-col items-center space-y-2"
                onClick={() => setSelectedExperience(experience.slug)}
              >
                <experience.icon className="h-6 w-6" />
                <div className="text-center">
                  <div className="font-semibold text-sm">{experience.title}</div>
                  <Badge variant="secondary" className="text-xs mt-1">
                    {experience.category}
                  </Badge>
                </div>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {selectedExperience && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Edit: {experienceData.title}</span>
              <Button onClick={handleSave} disabled={isLoading}>
                <Save className="h-4 w-4 mr-2" />
                {isLoading ? 'Saving...' : 'Save Changes'}
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="basic" className="space-y-6">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="basic">Basic Info</TabsTrigger>
                <TabsTrigger value="content">Content</TabsTrigger>
                <TabsTrigger value="media">Media</TabsTrigger>
                <TabsTrigger value="seo">SEO</TabsTrigger>
              </TabsList>

              <TabsContent value="basic" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Title</Label>
                    <Input
                      id="title"
                      value={experienceData.title}
                      onChange={(e) => updateField('title', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="slug">URL Slug</Label>
                    <Input
                      id="slug"
                      value={experienceData.slug}
                      onChange={(e) => updateField('slug', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Select value={experienceData.category} onValueChange={(value) => updateField('category', value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Adventure">Adventure</SelectItem>
                        <SelectItem value="Cultural">Cultural</SelectItem>
                        <SelectItem value="Nature">Nature</SelectItem>
                        <SelectItem value="Marine">Marine</SelectItem>
                        <SelectItem value="Transportation">Transportation</SelectItem>
                        <SelectItem value="Educational">Educational</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="difficulty">Difficulty</Label>
                    <Select value={experienceData.difficulty} onValueChange={(value: 'Easy' | 'Moderate' | 'Challenging') => updateField('difficulty', value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Easy">Easy</SelectItem>
                        <SelectItem value="Moderate">Moderate</SelectItem>
                        <SelectItem value="Challenging">Challenging</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="duration">Duration</Label>
                    <Input
                      id="duration"
                      value={experienceData.duration}
                      onChange={(e) => updateField('duration', e.target.value)}
                      placeholder="e.g., 2 hours, 1 day, 3 days"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      value={experienceData.location}
                      onChange={(e) => updateField('location', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="maxParticipants">Max Participants</Label>
                    <Input
                      id="maxParticipants"
                      type="number"
                      value={experienceData.maxParticipants}
                      onChange={(e) => updateField('maxParticipants', parseInt(e.target.value) || 0)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="pricing">Price From (USD)</Label>
                    <Input
                      id="pricing"
                      type="number"
                      value={experienceData.pricing.from}
                      onChange={(e) => updateField('pricing', { ...experienceData.pricing, from: parseInt(e.target.value) || 0 })}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="heroTagline">Hero Tagline</Label>
                  <Input
                    id="heroTagline"
                    value={experienceData.heroTagline}
                    onChange={(e) => updateField('heroTagline', e.target.value)}
                    placeholder="Compelling tagline for the hero section"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={experienceData.description}
                    onChange={(e) => updateField('description', e.target.value)}
                    rows={4}
                  />
                </div>
              </TabsContent>

              <TabsContent value="content" className="space-y-6">
                {/* Highlights */}
                <Card>
                  <CardHeader>
                    <CardTitle>Highlights</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex gap-2">
                      <Input
                        value={newHighlight}
                        onChange={(e) => setNewHighlight(e.target.value)}
                        placeholder="Add new highlight"
                      />
                      <Button onClick={() => addToArray('highlights', newHighlight)}>
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {experienceData.highlights.map((highlight, index) => (
                        <Badge key={index} variant="secondary" className="flex items-center gap-2">
                          {highlight}
                          <button
                            onClick={() => removeFromArray('highlights', index)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <Trash2 className="h-3 w-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Suggested Tours */}
                <Card>
                  <CardHeader>
                    <CardTitle>Suggested Tours</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex gap-2">
                      <Input
                        value={newTour}
                        onChange={(e) => setNewTour(e.target.value)}
                        placeholder="Add suggested tour"
                      />
                      <Button onClick={() => addToArray('suggestedTours', newTour)}>
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="space-y-2">
                      {experienceData.suggestedTours.map((tour, index) => (
                        <div key={index} className="flex items-center justify-between p-2 border rounded">
                          <span>{tour}</span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeFromArray('suggestedTours', index)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Travel Tips */}
                <Card>
                  <CardHeader>
                    <CardTitle>Travel Tips</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex gap-2">
                      <Input
                        value={newTip}
                        onChange={(e) => setNewTip(e.target.value)}
                        placeholder="Add travel tip"
                      />
                      <Button onClick={() => addToArray('travelTips', newTip)}>
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="space-y-2">
                      {experienceData.travelTips.map((tip, index) => (
                        <div key={index} className="flex items-center justify-between p-2 border rounded">
                          <span>{tip}</span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeFromArray('travelTips', index)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="media" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Hero Images</CardTitle>
                    <CardDescription>Add image URLs for the hero section carousel</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex gap-2">
                      <Input
                        value={newImage}
                        onChange={(e) => setNewImage(e.target.value)}
                        placeholder="Add image URL"
                      />
                      <Button onClick={() => addToArray('heroImages', newImage)}>
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {experienceData.heroImages.map((image, index) => (
                        <div key={index} className="relative">
                          <img
                            src={image}
                            alt={`Hero image ${index + 1}`}
                            className="w-full h-32 object-cover rounded"
                          />
                          <Button
                            variant="destructive"
                            size="sm"
                            className="absolute top-2 right-2"
                            onClick={() => removeFromArray('heroImages', index)}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="seo" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="seoKeyword">Focus Keyword</Label>
                  <Input
                    id="seoKeyword"
                    value={experienceData.seoFocusKeyword}
                    onChange={(e) => updateField('seoFocusKeyword', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="seoDescription">Meta Description</Label>
                  <Textarea
                    id="seoDescription"
                    value={experienceData.seoMetaDescription}
                    onChange={(e) => updateField('seoMetaDescription', e.target.value)}
                    rows={3}
                    maxLength={160}
                  />
                  <p className="text-sm text-gray-500">
                    {experienceData.seoMetaDescription.length}/160 characters
                  </p>
                </div>
                <div className="flex items-center space-x-4">
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={experienceData.featured}
                      onChange={(e) => updateField('featured', e.target.checked)}
                    />
                    <span>Featured Experience</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={experienceData.active}
                      onChange={(e) => updateField('active', e.target.checked)}
                    />
                    <span>Active/Published</span>
                  </label>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ExperiencesSection;