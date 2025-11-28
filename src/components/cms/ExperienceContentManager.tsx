import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import {
  Plus,
  Edit3,
  Trash2,
  Eye,
  Save,
  Image as ImageIcon,
  MapPin,
  Clock,
  DollarSign,
  Users,
  Star,
  Globe,
  Camera,
  FileText,
  Settings,
  Play,
  X
} from 'lucide-react';

interface ExperienceData {
  id: string;
  slug: string;
  name: string;
  heroImageURL: string;
  seo: {
    title: string;
    description: string;
  };
  introParagraph: string;
  highlights: Array<{
    icon: string;
    title: string;
    blurb60: string;
  }>;
  routes: Array<{
    routeName: string;
    duration: string;
    distanceKm: number;
    bestClass: string;
    mapGPXUrl?: string;
  }>;
  galleryImages: Array<{
    url: string;
    alt: string;
  }>;
  faqTag: string;
  ctaHeadline: string;
  ctaSub: string;
  videoURL?: string;
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface TourData {
  id: string;
  experienceSlug: string;
  title: string;
  thumbnail: string;
  badges: string[];
  duration: string;
  salePriceUSD: number;
  regularPriceUSD?: number;
  highlights: string[];
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export const ExperienceContentManager: React.FC = () => {
  const [experiences, setExperiences] = useState<ExperienceData[]>([]);
  const [tours, setTours] = useState<TourData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedExperience, setSelectedExperience] = useState<ExperienceData | null>(null);
  const [editingExperience, setEditingExperience] = useState<ExperienceData | null>(null);
  const [showExperienceDialog, setShowExperienceDialog] = useState(false);
  const [showTourDialog, setShowTourDialog] = useState(false);
  const [activeTab, setActiveTab] = useState('experiences');

  // Load experiences and tours
  useEffect(() => {
    loadExperiences();
    loadTours();
  }, []);

  const loadExperiences = async () => {
    try {
      const experiencesRef = collection(db, 'experiences');
      const q = query(experiencesRef, orderBy('updatedAt', 'desc'));
      const querySnapshot = await getDocs(q);

      const experiencesData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
        updatedAt: doc.data().updatedAt?.toDate() || new Date()
      })) as ExperienceData[];

      setExperiences(experiencesData);
    } catch (error) {
      console.error('Error loading experiences:', error);
      toast.error('Failed to load experiences');
    }
  };

  const loadTours = async () => {
    try {
      const toursRef = collection(db, 'tours');
      const q = query(toursRef, orderBy('updatedAt', 'desc'));
      const querySnapshot = await getDocs(q);

      const toursData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
        updatedAt: doc.data().updatedAt?.toDate() || new Date()
      })) as TourData[];

      setTours(toursData);
    } catch (error) {
      console.error('Error loading tours:', error);
      toast.error('Failed to load tours');
    } finally {
      setLoading(false);
    }
  };

  const saveExperience = async (experienceData: Partial<ExperienceData>) => {
    try {
      const now = new Date();
      const data = {
        ...experienceData,
        updatedAt: now,
        createdAt: experienceData.createdAt || now
      };

      if (editingExperience) {
        await updateDoc(doc(db, 'experiences', editingExperience.id), data);
        toast.success('Experience updated successfully');
      } else {
        const newDocRef = doc(collection(db, 'experiences'));
        await setDoc(newDocRef, { ...data, id: newDocRef.id });
        toast.success('Experience created successfully');
      }

      setShowExperienceDialog(false);
      setEditingExperience(null);
      loadExperiences();
    } catch (error) {
      console.error('Error saving experience:', error);
      toast.error('Failed to save experience');
    }
  };

  const deleteExperience = async (experienceId: string) => {
    if (!confirm('Are you sure you want to delete this experience?')) return;

    try {
      await deleteDoc(doc(db, 'experiences', experienceId));
      toast.success('Experience deleted successfully');
      loadExperiences();
    } catch (error) {
      console.error('Error deleting experience:', error);
      toast.error('Failed to delete experience');
    }
  };

  const toggleExperiencePublish = async (experience: ExperienceData) => {
    try {
      await updateDoc(doc(db, 'experiences', experience.id), {
        isPublished: !experience.isPublished,
        updatedAt: new Date()
      });
      toast.success(`Experience ${!experience.isPublished ? 'published' : 'unpublished'}`);
      loadExperiences();
    } catch (error) {
      console.error('Error toggling publish status:', error);
      toast.error('Failed to update publish status');
    }
  };

  const ExperienceForm: React.FC<{
    experience: ExperienceData | null;
    onSave: (data: Partial<ExperienceData>) => void;
    onCancel: () => void;
  }> = ({ experience, onSave, onCancel }) => {
    const [formData, setFormData] = useState<Partial<ExperienceData>>(experience || {
      slug: '',
      name: '',
      heroImageURL: '',
      seo: { title: '', description: '' },
      introParagraph: '',
      highlights: [{ icon: '', title: '', blurb60: '' }],
      routes: [{ routeName: '', duration: '', distanceKm: 0, bestClass: '' }],
      galleryImages: [{ url: '', alt: '' }],
      faqTag: '',
      ctaHeadline: '',
      ctaSub: '',
      videoURL: '',
      isPublished: false
    });

    const updateFormData = (field: string, value: any) => {
      setFormData(prev => ({ ...prev, [field]: value }));
    };

    const updateNestedField = (parent: string, field: string, value: any) => {
      setFormData(prev => ({
        ...prev,
        [parent]: { ...prev[parent], [field]: value }
      }));
    };

    const addHighlight = () => {
      setFormData(prev => ({
        ...prev,
        highlights: [...(prev.highlights || []), { icon: '', title: '', blurb60: '' }]
      }));
    };

    const updateHighlight = (index: number, field: string, value: string) => {
      setFormData(prev => ({
        ...prev,
        highlights: prev.highlights?.map((h, i) =>
          i === index ? { ...h, [field]: value } : h
        )
      }));
    };

    const removeHighlight = (index: number) => {
      setFormData(prev => ({
        ...prev,
        highlights: prev.highlights?.filter((_, i) => i !== index)
      }));
    };

    return (
      <div className="space-y-6 max-h-[70vh] overflow-y-auto">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="slug">Slug</Label>
            <Input
              id="slug"
              value={formData.slug || ''}
              onChange={(e) => updateFormData('slug', e.target.value)}
              placeholder="tea-trails"
            />
          </div>
          <div>
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={formData.name || ''}
              onChange={(e) => updateFormData('name', e.target.value)}
              placeholder="Sri Lanka Tea Trails"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="heroImageURL">Hero Image URL</Label>
          <Input
            id="heroImageURL"
            value={formData.heroImageURL || ''}
            onChange={(e) => updateFormData('heroImageURL', e.target.value)}
            placeholder="https://..."
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="seoTitle">SEO Title</Label>
            <Input
              id="seoTitle"
              value={formData.seo?.title || ''}
              onChange={(e) => updateNestedField('seo', 'title', e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="seoDescription">SEO Description</Label>
            <Input
              id="seoDescription"
              value={formData.seo?.description || ''}
              onChange={(e) => updateNestedField('seo', 'description', e.target.value)}
            />
          </div>
        </div>

        <div>
          <Label htmlFor="introParagraph">Intro Paragraph</Label>
          <Textarea
            id="introParagraph"
            value={formData.introParagraph || ''}
            onChange={(e) => updateFormData('introParagraph', e.target.value)}
            rows={4}
          />
        </div>

        <div>
          <Label>Highlights</Label>
          {formData.highlights?.map((highlight, index) => (
            <div key={index} className="grid grid-cols-12 gap-2 mt-2 p-3 border rounded">
              <Input
                placeholder="Icon"
                value={highlight.icon}
                onChange={(e) => updateHighlight(index, 'icon', e.target.value)}
                className="col-span-2"
              />
              <Input
                placeholder="Title"
                value={highlight.title}
                onChange={(e) => updateHighlight(index, 'title', e.target.value)}
                className="col-span-4"
              />
              <Input
                placeholder="Description"
                value={highlight.blurb60}
                onChange={(e) => updateHighlight(index, 'blurb60', e.target.value)}
                className="col-span-5"
              />
              <Button
                type="button"
                variant="destructive"
                size="sm"
                onClick={() => removeHighlight(index)}
                className="col-span-1"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
          <Button type="button" variant="outline" onClick={addHighlight} className="mt-2">
            <Plus className="h-4 w-4 mr-2" />
            Add Highlight
          </Button>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="ctaHeadline">CTA Headline</Label>
            <Input
              id="ctaHeadline"
              value={formData.ctaHeadline || ''}
              onChange={(e) => updateFormData('ctaHeadline', e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="ctaSub">CTA Subtext</Label>
            <Input
              id="ctaSub"
              value={formData.ctaSub || ''}
              onChange={(e) => updateFormData('ctaSub', e.target.value)}
            />
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Switch
            id="isPublished"
            checked={formData.isPublished || false}
            onCheckedChange={(checked) => updateFormData('isPublished', checked)}
          />
          <Label htmlFor="isPublished">Published</Label>
        </div>

        <div className="flex justify-end space-x-2">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button onClick={() => onSave(formData)}>
            <Save className="h-4 w-4 mr-2" />
            Save Experience
          </Button>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold">Experience Content Manager</h2>
          <p className="text-muted-foreground">Manage all experience pages with full admin control</p>
        </div>
        <Button onClick={() => setShowExperienceDialog(true)}>
          <Plus className="h-4 w-4 mr-2" />
          New Experience
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="experiences">Experiences</TabsTrigger>
          <TabsTrigger value="tours">Tours</TabsTrigger>
        </TabsList>

        <TabsContent value="experiences" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {experiences.map((experience) => (
              <Card key={experience.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{experience.name}</CardTitle>
                      <CardDescription>{experience.slug}</CardDescription>
                    </div>
                    <Badge variant={experience.isPublished ? "default" : "secondary"}>
                      {experience.isPublished ? "Published" : "Draft"}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {experience.introParagraph}
                    </p>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">
                        {experience.highlights?.length || 0} highlights
                      </span>
                      <div className="flex space-x-1">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => window.open(`/experiences/${experience.slug}`, '_blank')}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setEditingExperience(experience);
                            setShowExperienceDialog(true);
                          }}
                        >
                          <Edit3 className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => toggleExperiencePublish(experience)}
                        >
                          <Globe className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => deleteExperience(experience.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="tours" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {tours.map((tour) => (
              <Card key={tour.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="text-lg">{tour.title}</CardTitle>
                  <CardDescription>{tour.experienceSlug}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">{tour.duration}</span>
                      <span className="font-semibold text-green-600">
                        ${tour.salePriceUSD}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <Badge variant={tour.isPublished ? "default" : "secondary"}>
                        {tour.isPublished ? "Published" : "Draft"}
                      </Badge>
                      <div className="flex space-x-1">
                        <Button size="sm" variant="outline">
                          <Edit3 className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="destructive">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Experience Dialog */}
      <Dialog open={showExperienceDialog} onOpenChange={setShowExperienceDialog}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingExperience ? 'Edit Experience' : 'Create New Experience'}
            </DialogTitle>
            <DialogDescription>
              Manage all aspects of your experience page content
            </DialogDescription>
          </DialogHeader>
          <ExperienceForm
            experience={editingExperience}
            onSave={saveExperience}
            onCancel={() => {
              setShowExperienceDialog(false);
              setEditingExperience(null);
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};