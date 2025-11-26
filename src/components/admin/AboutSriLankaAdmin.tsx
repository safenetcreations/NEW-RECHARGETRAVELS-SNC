import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { 
  Save, 
  Plus, 
  Trash2, 
  Globe, 
  Users, 
  Leaf, 
  Award,
  MapPin,
  Camera,
  FileText,
  Settings
} from 'lucide-react';

interface AboutSriLankaContent {
  heroTitle: string;
  heroSubtitle: string;
  heroImage: string;
  mainDescription: string;
  secondaryDescription: string;
  stats: {
    area: { value: string; label: string; desc: string };
    population: { value: string; label: string; desc: string };
    species: { value: string; label: string; desc: string };
    unesco: { value: string; label: string; desc: string };
  };
  highlights: string[];
  culturalInfo: string;
  naturalInfo: string;
  seoTitle: string;
  seoDescription: string;
  seoKeywords: string;
}

const defaultContent: AboutSriLankaContent = {
  heroTitle: "The Pearl of the Indian Ocean",
  heroSubtitle: "Discover Sri Lanka's Rich Heritage and Natural Beauty",
  heroImage: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=1920",
  mainDescription: "Sri Lanka, a teardrop-shaped island in the Indian Ocean, offers an incredible diversity of experiences within its compact borders. From misty mountains and lush rainforests to golden beaches and ancient ruins, this tropical paradise has captivated travelers for centuries.",
  secondaryDescription: "With a history spanning over 2,500 years, Sri Lanka boasts eight UNESCO World Heritage Sites, a rich cultural tapestry influenced by Buddhism, Hinduism, and colonial heritage, and some of the world's finest tea, spices, and gemstones.",
  stats: {
    area: { value: "65,610", label: "Square Kilometers", desc: "Compact island paradise" },
    population: { value: "22M", label: "Population", desc: "Warm & welcoming people" },
    species: { value: "3,000+", label: "Endemic Species", desc: "Biodiversity hotspot" },
    unesco: { value: "8", label: "UNESCO Sites", desc: "World heritage treasures" }
  },
  highlights: [
    "Ancient Buddhist temples and stupas",
    "Pristine beaches and coral reefs",
    "Misty tea plantations",
    "Wildlife safaris in national parks",
    "Spice gardens and plantations",
    "Colonial architecture",
    "Traditional Ayurvedic treatments",
    "Adventure sports and activities"
  ],
  culturalInfo: "Sri Lanka's cultural heritage is a fascinating blend of indigenous traditions and foreign influences. The island has been a crossroads of trade routes for centuries, resulting in a unique cultural mosaic that includes Buddhist temples, Hindu kovils, Islamic mosques, and Christian churches.",
  naturalInfo: "From the central highlands with their cool climate and tea estates to the coastal plains with palm-fringed beaches, Sri Lanka's diverse geography supports an incredible variety of ecosystems. The island is home to numerous national parks and wildlife sanctuaries.",
  seoTitle: "About Sri Lanka - The Pearl of the Indian Ocean | Recharge Travels",
  seoDescription: "Discover Sri Lanka's rich history, diverse culture, and stunning natural beauty. Learn about the island's UNESCO World Heritage Sites, wildlife, and unique experiences.",
  seoKeywords: "Sri Lanka, travel, tourism, culture, history, UNESCO, wildlife, beaches, temples, tea plantations"
};

const AboutSriLankaAdmin: React.FC = () => {
  const [content, setContent] = useState<AboutSriLankaContent>(defaultContent);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadContent();
  }, []);

  const loadContent = async () => {
    setLoading(true);
    try {
      const docRef = doc(db, 'page-content', 'about-sri-lanka');
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        setContent(docSnap.data() as AboutSriLankaContent);
      }
    } catch (error) {
      console.error('Error loading content:', error);
      toast({
        title: "Error",
        description: "Failed to load content",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const saveContent = async () => {
    setSaving(true);
    try {
      const docRef = doc(db, 'page-content', 'about-sri-lanka');
      await setDoc(docRef, content);
      toast({
        title: "Success",
        description: "About Sri Lanka content saved successfully!"
      });
    } catch (error) {
      console.error('Error saving content:', error);
      toast({
        title: "Error",
        description: "Failed to save content",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  const updateHighlight = (index: number, value: string) => {
    const newHighlights = [...content.highlights];
    newHighlights[index] = value;
    setContent({ ...content, highlights: newHighlights });
  };

  const addHighlight = () => {
    setContent({
      ...content,
      highlights: [...content.highlights, '']
    });
  };

  const removeHighlight = (index: number) => {
    const newHighlights = content.highlights.filter((_, i) => i !== index);
    setContent({ ...content, highlights: newHighlights });
  };

  const updateStat = (statKey: keyof AboutSriLankaContent['stats'], field: 'value' | 'label' | 'desc', value: string) => {
    setContent({
      ...content,
      stats: {
        ...content.stats,
        [statKey]: {
          ...content.stats[statKey],
          [field]: value
        }
      }
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Loading content...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="w-5 h-5" />
            About Sri Lanka Content Management
          </CardTitle>
          <CardDescription>
            Manage the content for the About Sri Lanka page
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="hero">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="hero">Hero Section</TabsTrigger>
              <TabsTrigger value="content">Main Content</TabsTrigger>
              <TabsTrigger value="stats">Statistics</TabsTrigger>
              <TabsTrigger value="seo">SEO</TabsTrigger>
            </TabsList>

            <TabsContent value="hero" className="space-y-4">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Hero Title</Label>
                  <Input
                    value={content.heroTitle}
                    onChange={(e) => setContent({
                      ...content,
                      heroTitle: e.target.value
                    })}
                    placeholder="Enter hero title"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Hero Subtitle</Label>
                  <Input
                    value={content.heroSubtitle}
                    onChange={(e) => setContent({
                      ...content,
                      heroSubtitle: e.target.value
                    })}
                    placeholder="Enter hero subtitle"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Hero Image URL</Label>
                  <Input
                    value={content.heroImage}
                    onChange={(e) => setContent({
                      ...content,
                      heroImage: e.target.value
                    })}
                    placeholder="Enter hero image URL"
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="content" className="space-y-4">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Main Description</Label>
                  <Textarea
                    value={content.mainDescription}
                    onChange={(e) => setContent({
                      ...content,
                      mainDescription: e.target.value
                    })}
                    rows={4}
                    placeholder="Enter main description"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Secondary Description</Label>
                  <Textarea
                    value={content.secondaryDescription}
                    onChange={(e) => setContent({
                      ...content,
                      secondaryDescription: e.target.value
                    })}
                    rows={4}
                    placeholder="Enter secondary description"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Cultural Information</Label>
                  <Textarea
                    value={content.culturalInfo}
                    onChange={(e) => setContent({
                      ...content,
                      culturalInfo: e.target.value
                    })}
                    rows={4}
                    placeholder="Enter cultural information"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Natural Information</Label>
                  <Textarea
                    value={content.naturalInfo}
                    onChange={(e) => setContent({
                      ...content,
                      naturalInfo: e.target.value
                    })}
                    rows={4}
                    placeholder="Enter natural information"
                  />
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <Label>Highlights</Label>
                    <Button onClick={addHighlight} size="sm" className="flex items-center gap-2">
                      <Plus className="w-4 h-4" />
                      Add Highlight
                    </Button>
                  </div>
                  
                  <div className="space-y-2">
                    {content.highlights.map((highlight, index) => (
                      <div key={index} className="flex gap-2">
                        <Input
                          value={highlight}
                          onChange={(e) => updateHighlight(index, e.target.value)}
                          placeholder="Enter highlight"
                        />
                        <Button
                          onClick={() => removeHighlight(index)}
                          variant="destructive"
                          size="sm"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="stats" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Area Stats */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Globe className="w-4 h-4" />
                      Area Statistics
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div>
                      <Label>Value</Label>
                      <Input
                        value={content.stats.area.value}
                        onChange={(e) => updateStat('area', 'value', e.target.value)}
                        placeholder="e.g., 65,610"
                      />
                    </div>
                    <div>
                      <Label>Label</Label>
                      <Input
                        value={content.stats.area.label}
                        onChange={(e) => updateStat('area', 'label', e.target.value)}
                        placeholder="e.g., Square Kilometers"
                      />
                    </div>
                    <div>
                      <Label>Description</Label>
                      <Input
                        value={content.stats.area.desc}
                        onChange={(e) => updateStat('area', 'desc', e.target.value)}
                        placeholder="e.g., Compact island paradise"
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Population Stats */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="w-4 h-4" />
                      Population Statistics
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div>
                      <Label>Value</Label>
                      <Input
                        value={content.stats.population.value}
                        onChange={(e) => updateStat('population', 'value', e.target.value)}
                        placeholder="e.g., 22M"
                      />
                    </div>
                    <div>
                      <Label>Label</Label>
                      <Input
                        value={content.stats.population.label}
                        onChange={(e) => updateStat('population', 'label', e.target.value)}
                        placeholder="e.g., Population"
                      />
                    </div>
                    <div>
                      <Label>Description</Label>
                      <Input
                        value={content.stats.population.desc}
                        onChange={(e) => updateStat('population', 'desc', e.target.value)}
                        placeholder="e.g., Warm & welcoming people"
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Species Stats */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Leaf className="w-4 h-4" />
                      Species Statistics
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div>
                      <Label>Value</Label>
                      <Input
                        value={content.stats.species.value}
                        onChange={(e) => updateStat('species', 'value', e.target.value)}
                        placeholder="e.g., 3,000+"
                      />
                    </div>
                    <div>
                      <Label>Label</Label>
                      <Input
                        value={content.stats.species.label}
                        onChange={(e) => updateStat('species', 'label', e.target.value)}
                        placeholder="e.g., Endemic Species"
                      />
                    </div>
                    <div>
                      <Label>Description</Label>
                      <Input
                        value={content.stats.species.desc}
                        onChange={(e) => updateStat('species', 'desc', e.target.value)}
                        placeholder="e.g., Biodiversity hotspot"
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* UNESCO Stats */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Award className="w-4 h-4" />
                      UNESCO Statistics
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div>
                      <Label>Value</Label>
                      <Input
                        value={content.stats.unesco.value}
                        onChange={(e) => updateStat('unesco', 'value', e.target.value)}
                        placeholder="e.g., 8"
                      />
                    </div>
                    <div>
                      <Label>Label</Label>
                      <Input
                        value={content.stats.unesco.label}
                        onChange={(e) => updateStat('unesco', 'label', e.target.value)}
                        placeholder="e.g., UNESCO Sites"
                      />
                    </div>
                    <div>
                      <Label>Description</Label>
                      <Input
                        value={content.stats.unesco.desc}
                        onChange={(e) => updateStat('unesco', 'desc', e.target.value)}
                        placeholder="e.g., World heritage treasures"
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="seo" className="space-y-4">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>SEO Title</Label>
                  <Input
                    value={content.seoTitle}
                    onChange={(e) => setContent({
                      ...content,
                      seoTitle: e.target.value
                    })}
                    placeholder="Enter SEO title"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>SEO Description</Label>
                  <Textarea
                    value={content.seoDescription}
                    onChange={(e) => setContent({
                      ...content,
                      seoDescription: e.target.value
                    })}
                    rows={3}
                    placeholder="Enter SEO description"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>SEO Keywords</Label>
                  <Input
                    value={content.seoKeywords}
                    onChange={(e) => setContent({
                      ...content,
                      seoKeywords: e.target.value
                    })}
                    placeholder="Enter SEO keywords (comma separated)"
                  />
                </div>
              </div>
            </TabsContent>
          </Tabs>
          
          <div className="mt-6 pt-6 border-t">
            <Button onClick={saveContent} disabled={saving} className="flex items-center gap-2">
              <Save className="w-4 h-4" />
              {saving ? 'Saving...' : 'Save Content'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AboutSriLankaAdmin; 