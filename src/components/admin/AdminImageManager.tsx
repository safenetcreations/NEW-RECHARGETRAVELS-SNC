import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Upload, Save, Trash2, RefreshCw, Image as ImageIcon, Globe, MapPin } from 'lucide-react';
import { collection, doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { touristLocations } from '@/components/discovery/data/touristLocations';

interface HeroImage {
  image: string;
  title: string;
  subtitle: string;
  description: string;
}

interface SiteImages {
  logo: string;
  favicon: string;
}

interface TouristLocationImage {
  id: number;
  name: string;
  imageUrl: string;
  type?: string;
  description?: string;
  rating?: number;
  reviews?: number;
  priceRange?: string;
  openingHours?: string;
  bestTimeToVisit?: string;
}

const AdminImageManager: React.FC = () => {
  const [heroImages, setHeroImages] = useState<HeroImage[]>([]);
  const [siteImages, setSiteImages] = useState<SiteImages>({ logo: '', favicon: '' });
  const [touristImages, setTouristImages] = useState<TouristLocationImage[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('hero');

  // Load initial data
  useEffect(() => {
    loadAllImages();
  }, []);

  const loadAllImages = async () => {
    setLoading(true);
    try {
      // Load hero images
      const heroDoc = await getDoc(doc(db, 'site-settings', 'hero-images'));
      if (heroDoc.exists()) {
        setHeroImages(heroDoc.data().images || []);
      } else {
        // Default hero images
        setHeroImages([
          {
            image: "https://i.imgur.com/AEnBWJf.jpeg",
            title: "Sigiriya Rock Fortress",
            subtitle: "The Eighth Wonder of the World",
            description: "Ancient royal citadel with spectacular views"
          },
          {
            image: "https://i.imgur.com/qHEsIhu.jpeg",
            title: "Wild Elephant Gathering",
            subtitle: "The Gathering at Minneriya",
            description: "Witness hundreds of elephants in their natural habitat"
          },
          {
            image: "https://i.imgur.com/rxmyNqN.jpeg",
            title: "Sri Lankan Leopard",
            subtitle: "Apex Predator of Yala",
            description: "Experience the thrill of spotting the elusive leopard"
          },
          {
            image: "https://i.imgur.com/kMQcYyh.jpeg",
            title: "Ravana Falls",
            subtitle: "Majestic Natural Wonder",
            description: "One of Sri Lanka's most beautiful waterfalls"
          },
          {
            image: "https://i.imgur.com/Xw8LQFR.jpeg",
            title: "Nine Arch Bridge",
            subtitle: "Colonial Engineering Marvel",
            description: "Iconic railway bridge amidst lush greenery"
          },
          {
            image: "https://i.imgur.com/0zQH7Yu.jpeg",
            title: "Arugam Bay",
            subtitle: "Surfer's Paradise",
            description: "World-class surfing destination"
          },
          {
            image: "https://i.imgur.com/UfKqznG.jpeg",
            title: "Tea Country Hills",
            subtitle: "Emerald Landscapes",
            description: "Rolling hills covered in tea plantations"
          }
        ]);
      }

      // Load site images
      const siteDoc = await getDoc(doc(db, 'site-settings', 'images'));
      if (siteDoc.exists()) {
        setSiteImages(siteDoc.data() as SiteImages);
      } else {
        setSiteImages({
          logo: 'https://i.imgur.com/kzqjJ57.png',
          favicon: 'https://i.imgur.com/kzqjJ57.png'
        });
      }

      // Load tourist location images
      const touristDoc = await getDoc(doc(db, 'site-settings', 'tourist-locations'));
      if (touristDoc.exists()) {
        setTouristImages(touristDoc.data().locations || []);
      } else {
        // Use default tourist locations
        setTouristImages(touristLocations.map(loc => ({
          id: loc.id,
          name: loc.name,
          imageUrl: loc.imageUrl || '',
          type: loc.type,
          description: loc.description,
          rating: loc.rating,
          reviews: loc.reviews,
          priceRange: loc.priceRange,
          openingHours: loc.openingHours,
          bestTimeToVisit: loc.bestTimeToVisit
        })));
      }
    } catch (error) {
      console.error('Error loading images:', error);
    }
    setLoading(false);
  };

  const saveHeroImages = async () => {
    setLoading(true);
    try {
      await setDoc(doc(db, 'site-settings', 'hero-images'), {
        images: heroImages,
        updatedAt: new Date().toISOString()
      });
      alert('Hero images saved successfully!');
    } catch (error) {
      console.error('Error saving hero images:', error);
      alert('Failed to save hero images');
    }
    setLoading(false);
  };

  const saveSiteImages = async () => {
    setLoading(true);
    try {
      await setDoc(doc(db, 'site-settings', 'images'), {
        ...siteImages,
        updatedAt: new Date().toISOString()
      });
      alert('Site images saved successfully!');
    } catch (error) {
      console.error('Error saving site images:', error);
      alert('Failed to save site images');
    }
    setLoading(false);
  };

  const saveTouristImages = async () => {
    setLoading(true);
    try {
      await setDoc(doc(db, 'site-settings', 'tourist-locations'), {
        locations: touristImages,
        updatedAt: new Date().toISOString()
      });
      alert('Tourist location images saved successfully!');
    } catch (error) {
      console.error('Error saving tourist images:', error);
      alert('Failed to save tourist images');
    }
    setLoading(false);
  };

  const updateHeroImage = (index: number, field: keyof HeroImage, value: string) => {
    const updated = [...heroImages];
    updated[index] = { ...updated[index], [field]: value };
    setHeroImages(updated);
  };

  const updateTouristLocation = (index: number, field: keyof TouristLocationImage, value: any) => {
    const updated = [...touristImages];
    updated[index] = { ...updated[index], [field]: value };
    setTouristImages(updated);
  };

  const addHeroImage = () => {
    setHeroImages([...heroImages, {
      image: '',
      title: '',
      subtitle: '',
      description: ''
    }]);
  };

  const removeHeroImage = (index: number) => {
    setHeroImages(heroImages.filter((_, i) => i !== index));
  };

  return (
    <div className="container mx-auto p-6">
      <Card className="max-w-6xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-2">
            <ImageIcon className="w-6 h-6" />
            Site Image Manager
          </CardTitle>
          <CardDescription>
            Manage all images across your website from one place
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="hero">Hero Images</TabsTrigger>
              <TabsTrigger value="site">Logo & Favicon</TabsTrigger>
              <TabsTrigger value="tourist">Tourist Locations</TabsTrigger>
            </TabsList>

            {/* Hero Images Tab */}
            <TabsContent value="hero" className="space-y-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Homepage Hero Background Images</h3>
                <div className="flex gap-2">
                  <Button onClick={addHeroImage} size="sm" variant="outline">
                    <Upload className="w-4 h-4 mr-2" />
                    Add Image
                  </Button>
                  <Button onClick={saveHeroImages} disabled={loading}>
                    <Save className="w-4 h-4 mr-2" />
                    Save All
                  </Button>
                </div>
              </div>

              <div className="space-y-4">
                {heroImages.map((hero, index) => (
                  <Card key={index} className="p-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Image URL</Label>
                        <Input
                          value={hero.image}
                          onChange={(e) => updateHeroImage(index, 'image', e.target.value)}
                          placeholder="https://i.imgur.com/example.jpg"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Title</Label>
                        <Input
                          value={hero.title}
                          onChange={(e) => updateHeroImage(index, 'title', e.target.value)}
                          placeholder="Sigiriya Rock Fortress"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Subtitle</Label>
                        <Input
                          value={hero.subtitle}
                          onChange={(e) => updateHeroImage(index, 'subtitle', e.target.value)}
                          placeholder="The Eighth Wonder"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Description</Label>
                        <Input
                          value={hero.description}
                          onChange={(e) => updateHeroImage(index, 'description', e.target.value)}
                          placeholder="Ancient royal citadel..."
                        />
                      </div>
                    </div>
                    <div className="mt-4 flex justify-between items-center">
                      {hero.image && (
                        <img 
                          src={hero.image} 
                          alt={hero.title} 
                          className="h-20 w-32 object-cover rounded"
                          onError={(e) => {
                            e.currentTarget.src = 'https://via.placeholder.com/320x200?text=Invalid+Image';
                          }}
                        />
                      )}
                      <Button
                        onClick={() => removeHeroImage(index)}
                        size="sm"
                        variant="destructive"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Site Images Tab */}
            <TabsContent value="site" className="space-y-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Logo & Favicon</h3>
                <Button onClick={saveSiteImages} disabled={loading}>
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="p-4">
                  <h4 className="font-semibold mb-4 flex items-center gap-2">
                    <Globe className="w-4 h-4" />
                    Logo
                  </h4>
                  <div className="space-y-4">
                    <div>
                      <Label>Logo URL</Label>
                      <Input
                        value={siteImages.logo}
                        onChange={(e) => setSiteImages({...siteImages, logo: e.target.value})}
                        placeholder="https://i.imgur.com/kzqjJ57.png"
                      />
                    </div>
                    {siteImages.logo && (
                      <div className="bg-gray-100 p-4 rounded flex justify-center">
                        <img 
                          src={siteImages.logo} 
                          alt="Logo Preview" 
                          className="h-16 w-auto"
                          onError={(e) => {
                            e.currentTarget.src = 'https://via.placeholder.com/200x100?text=Invalid+Logo';
                          }}
                        />
                      </div>
                    )}
                  </div>
                </Card>

                <Card className="p-4">
                  <h4 className="font-semibold mb-4 flex items-center gap-2">
                    <Globe className="w-4 h-4" />
                    Favicon
                  </h4>
                  <div className="space-y-4">
                    <div>
                      <Label>Favicon URL</Label>
                      <Input
                        value={siteImages.favicon}
                        onChange={(e) => setSiteImages({...siteImages, favicon: e.target.value})}
                        placeholder="https://i.imgur.com/kzqjJ57.png"
                      />
                    </div>
                    {siteImages.favicon && (
                      <div className="bg-gray-100 p-4 rounded flex justify-center">
                        <img 
                          src={siteImages.favicon} 
                          alt="Favicon Preview" 
                          className="h-8 w-8"
                          onError={(e) => {
                            e.currentTarget.src = 'https://via.placeholder.com/32x32?text=X';
                          }}
                        />
                      </div>
                    )}
                  </div>
                </Card>
              </div>
            </TabsContent>

            {/* Tourist Locations Tab */}
            <TabsContent value="tourist" className="space-y-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Tourist Location Thumbnails</h3>
                <Button onClick={saveTouristImages} disabled={loading}>
                  <Save className="w-4 h-4 mr-2" />
                  Save All
                </Button>
              </div>

              <div className="space-y-6">
                {touristImages.map((location, index) => (
                  <Card key={location.id} className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <h4 className="text-lg font-semibold flex items-center gap-2">
                        <MapPin className="w-5 h-5" />
                        {location.name}
                      </h4>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Left Column - Image and Basic Info */}
                      <div className="space-y-4">
                        <div>
                          <Label>Image URL</Label>
                          <Input
                            value={location.imageUrl}
                            onChange={(e) => updateTouristLocation(index, 'imageUrl', e.target.value)}
                            placeholder="https://example.com/image.jpg"
                          />
                        </div>
                        
                        {location.imageUrl && (
                          <img 
                            src={location.imageUrl} 
                            alt={location.name} 
                            className="w-full h-48 object-cover rounded"
                            onError={(e) => {
                              e.currentTarget.src = 'https://via.placeholder.com/400x300?text=' + encodeURIComponent(location.name);
                            }}
                          />
                        )}
                        
                        <div>
                          <Label>Type</Label>
                          <select
                            value={location.type || 'historical'}
                            onChange={(e) => updateTouristLocation(index, 'type', e.target.value)}
                            className="w-full px-3 py-2 border rounded-md"
                          >
                            <option value="historical">Historical</option>
                            <option value="temple">Temple</option>
                            <option value="colonial">Colonial</option>
                            <option value="wildlife">Wildlife</option>
                            <option value="beach">Beach</option>
                            <option value="hiking">Hiking</option>
                            <option value="landmark">Landmark</option>
                            <option value="hillstation">Hill Station</option>
                          </select>
                        </div>
                      </div>
                      
                      {/* Right Column - Details */}
                      <div className="space-y-4">
                        <div>
                          <Label>Description</Label>
                          <textarea
                            value={location.description || ''}
                            onChange={(e) => updateTouristLocation(index, 'description', e.target.value)}
                            placeholder="Enter location description..."
                            className="w-full px-3 py-2 border rounded-md"
                            rows={3}
                          />
                        </div>
                        
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <Label>Rating</Label>
                            <Input
                              type="number"
                              step="0.1"
                              min="0"
                              max="5"
                              value={location.rating || 4.5}
                              onChange={(e) => updateTouristLocation(index, 'rating', parseFloat(e.target.value))}
                            />
                          </div>
                          <div>
                            <Label>Reviews</Label>
                            <Input
                              type="number"
                              value={location.reviews || 0}
                              onChange={(e) => updateTouristLocation(index, 'reviews', parseInt(e.target.value))}
                            />
                          </div>
                        </div>
                        
                        <div>
                          <Label>Price Range</Label>
                          <Input
                            value={location.priceRange || ''}
                            onChange={(e) => updateTouristLocation(index, 'priceRange', e.target.value)}
                            placeholder="e.g., $10-15 or Free"
                          />
                        </div>
                        
                        <div>
                          <Label>Opening Hours</Label>
                          <Input
                            value={location.openingHours || ''}
                            onChange={(e) => updateTouristLocation(index, 'openingHours', e.target.value)}
                            placeholder="e.g., 7:00 AM - 5:30 PM"
                          />
                        </div>
                        
                        <div>
                          <Label>Best Time to Visit</Label>
                          <Input
                            value={location.bestTimeToVisit || ''}
                            onChange={(e) => updateTouristLocation(index, 'bestTimeToVisit', e.target.value)}
                            placeholder="e.g., Early morning"
                          />
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>

          {loading && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
              <div className="bg-white p-4 rounded-lg flex items-center gap-3">
                <RefreshCw className="w-5 h-5 animate-spin" />
                <span>Saving changes...</span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminImageManager;