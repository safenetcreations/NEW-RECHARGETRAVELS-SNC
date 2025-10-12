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
  Users,
  Baby,
  Heart,
  Camera,
  Clock,
  DollarSign,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';
import { db } from '@/lib/firebase';
import { collection, addDoc, updateDoc, deleteDoc, doc, getDocs, query, orderBy } from 'firebase/firestore';
import { toast } from 'sonner';

interface FamilyActivity {
  id?: string;
  title: string;
  slug: string;
  description: string;
  heroHeading: string;
  highlights: string[];
  ageRecommendations: {
    ageGroup: string;
    suitability: string;
    tips: string[];
  }[];
  packages: {
    title: string;
    adultPrice: string;
    childPrice: string;
    duration: string;
    includes: string[];
    highlights: string[];
  }[];
  safetyTips: string[];
  whatToBring: string[];
  bestTime: string;
  duration: string;
  difficulty: 'Easy' | 'Moderate' | 'Challenging';
  location: string;
  seoMetaDescription: string;
  seoFocusKeyword: string;
  featured: boolean;
  active: boolean;
  heroImages: string[];
  faqs: { question: string; answer: string; }[];
}

const familyActivities = [
  {
    title: "Scenic Train Rides",
    slug: "family-train-journeys",
    icon: Users,
    description: "Famous scenic train journeys ideal for families and kids"
  },
  {
    title: "Sigiriya Rock Adventure",
    slug: "sigiriya-family-adventure", 
    icon: Users,
    description: "Memorable climb up Sigiriya Rock Fortress for the whole family"
  },
  {
    title: "Polonnaruwa Cycling",
    slug: "polonnaruwa-family-cycling",
    icon: Users,
    description: "Family-friendly cycling through historical ruins"
  },
  {
    title: "Udawalawe Safari",
    slug: "udawalawe-elephant-safari",
    icon: Users,
    description: "Family jeep safari to watch elephants and wildlife"
  },
  {
    title: "Pinnawala Elephants",
    slug: "pinnawala-family-experience",
    icon: Users,
    description: "Watch elephants bathe and feed them safely"
  },
  {
    title: "Turtle Hatchery",
    slug: "kosgoda-turtle-hatchery",
    icon: Users,
    description: "Marine conservation experience with baby turtles"
  },
  {
    title: "Galle Fort Walk", 
    slug: "galle-fort-family-walk",
    icon: Users,
    description: "Colonial charm and coastal fun for families"
  },
  {
    title: "Mask Making Workshop",
    slug: "sri-lanka-mask-workshop",
    icon: Users,
    description: "Traditional Sri Lankan mask-making experience"
  },
  {
    title: "Pearl Bay Water Park",
    slug: "pearl-bay-water-park",
    icon: Users,
    description: "Water slides, karting, and fun rides"
  },
  {
    title: "Nuwara Eliya Parks",
    slug: "nuwara-eliya-family-outing",
    icon: Users,
    description: "Paddle boats, pony rides, and playgrounds"
  }
];

const FamilyActivitiesSection: React.FC = () => {
  const [selectedActivity, setSelectedActivity] = useState<string | null>(null);
  const [activityData, setActivityData] = useState<FamilyActivity>({
    title: '',
    slug: '',
    description: '',
    heroHeading: '',
    highlights: [],
    ageRecommendations: [],
    packages: [],
    safetyTips: [],
    whatToBring: [],
    bestTime: '',
    duration: '',
    difficulty: 'Easy',
    location: '',
    seoMetaDescription: '',
    seoFocusKeyword: '',
    featured: false,
    active: true,
    heroImages: [],
    faqs: []
  });
  const [isLoading, setIsLoading] = useState(false);
  const [newHighlight, setNewHighlight] = useState('');
  const [newSafetyTip, setNewSafetyTip] = useState('');
  const [newItem, setNewItem] = useState('');
  const [newImage, setNewImage] = useState('');
  const [newFaq, setNewFaq] = useState({ question: '', answer: '' });
  const [newAgeGroup, setNewAgeGroup] = useState({
    ageGroup: '',
    suitability: '',
    tips: ['']
  });
  const [newPackage, setNewPackage] = useState({
    title: '',
    adultPrice: '',
    childPrice: '',
    duration: '',
    includes: [''],
    highlights: ['']
  });

  // Load activity data from Firebase
  const loadActivityData = async (slug: string) => {
    try {
      setIsLoading(true);
      const activitiesRef = collection(db, 'family-activities');
      const q = query(activitiesRef, orderBy('title'));
      const querySnapshot = await getDocs(q);
      
      const activityDoc = querySnapshot.docs.find(doc => doc.data().slug === slug);
      if (activityDoc) {
        const data = { id: activityDoc.id, ...activityDoc.data() } as FamilyActivity;
        setActivityData(data);
      } else {
        // Create default structure for new activity
        const defaultActivity = familyActivities.find(act => act.slug === slug);
        if (defaultActivity) {
          setActivityData({
            title: defaultActivity.title,
            slug: defaultActivity.slug,
            description: defaultActivity.description,
            heroHeading: '',
            highlights: [],
            ageRecommendations: [],
            packages: [],
            safetyTips: [],
            whatToBring: [],
            bestTime: '',
            duration: '',
            difficulty: 'Easy',
            location: '',
            seoMetaDescription: '',
            seoFocusKeyword: defaultActivity.slug.replace(/-/g, ' '),
            featured: false,
            active: true,
            heroImages: [],
            faqs: []
          });
        }
      }
    } catch (error) {
      console.error('Error loading family activity data:', error);
      toast.error('Failed to load activity data');
    } finally {
      setIsLoading(false);
    }
  };

  // Save activity data to Firebase
  const handleSave = async () => {
    try {
      setIsLoading(true);
      const activitiesRef = collection(db, 'family-activities');
      
      if (activityData.id) {
        // Update existing activity
        const { id, ...updateData } = activityData;
        await updateDoc(doc(db, 'family-activities', activityData.id), updateData);
        toast.success('Family activity updated successfully!');
      } else {
        // Create new activity
        const { id, ...newData } = activityData;
        await addDoc(activitiesRef, newData);
        toast.success('Family activity created successfully!');
      }
      
      // Reload data
      await loadActivityData(activityData.slug);
    } catch (error) {
      console.error('Error saving family activity:', error);
      toast.error('Failed to save activity');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle form field updates
  const updateField = (field: keyof FamilyActivity, value: any) => {
    setActivityData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Handle array field additions
  const addToArray = (field: 'highlights' | 'safetyTips' | 'whatToBring' | 'heroImages', value: string) => {
    if (value.trim()) {
      setActivityData(prev => ({
        ...prev,
        [field]: [...prev[field], value.trim()]
      }));
      
      // Clear input
      if (field === 'highlights') setNewHighlight('');
      if (field === 'safetyTips') setNewSafetyTip('');
      if (field === 'whatToBring') setNewItem('');
      if (field === 'heroImages') setNewImage('');
    }
  };

  // Remove from array
  const removeFromArray = (field: 'highlights' | 'safetyTips' | 'whatToBring' | 'heroImages', index: number) => {
    setActivityData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));
  };

  // Add FAQ
  const addFaq = () => {
    if (newFaq.question.trim() && newFaq.answer.trim()) {
      setActivityData(prev => ({
        ...prev,
        faqs: [...prev.faqs, { ...newFaq }]
      }));
      setNewFaq({ question: '', answer: '' });
    }
  };

  // Remove FAQ
  const removeFaq = (index: number) => {
    setActivityData(prev => ({
      ...prev,
      faqs: prev.faqs.filter((_, i) => i !== index)
    }));
  };

  // Add Age Recommendation
  const addAgeRecommendation = () => {
    if (newAgeGroup.ageGroup.trim() && newAgeGroup.suitability.trim()) {
      setActivityData(prev => ({
        ...prev,
        ageRecommendations: [...prev.ageRecommendations, { ...newAgeGroup }]
      }));
      setNewAgeGroup({ ageGroup: '', suitability: '', tips: [''] });
    }
  };

  // Remove Age Recommendation
  const removeAgeRecommendation = (index: number) => {
    setActivityData(prev => ({
      ...prev,
      ageRecommendations: prev.ageRecommendations.filter((_, i) => i !== index)
    }));
  };

  // Add Package
  const addPackage = () => {
    if (newPackage.title.trim() && newPackage.adultPrice.trim()) {
      setActivityData(prev => ({
        ...prev,
        packages: [...prev.packages, { ...newPackage }]
      }));
      setNewPackage({
        title: '',
        adultPrice: '',
        childPrice: '',
        duration: '',
        includes: [''],
        highlights: ['']
      });
    }
  };

  // Remove Package
  const removePackage = (index: number) => {
    setActivityData(prev => ({
      ...prev,
      packages: prev.packages.filter((_, i) => i !== index)
    }));
  };

  useEffect(() => {
    if (selectedActivity) {
      loadActivityData(selectedActivity);
    }
  }, [selectedActivity]);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Family-Friendly Activities Content Management</CardTitle>
          <CardDescription>
            Manage content for family activities including train rides, safaris, cultural experiences, and more
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {familyActivities.map((activity) => (
              <Button
                key={activity.slug}
                variant={selectedActivity === activity.slug ? "default" : "outline"}
                className="h-auto p-4 flex flex-col items-center space-y-2"
                onClick={() => setSelectedActivity(activity.slug)}
              >
                <activity.icon className="h-6 w-6" />
                <div className="text-center">
                  <div className="font-semibold text-xs">{activity.title}</div>
                </div>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {selectedActivity && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Edit: {activityData.title}</span>
              <Button onClick={handleSave} disabled={isLoading}>
                <Save className="h-4 w-4 mr-2" />
                {isLoading ? 'Saving...' : 'Save Changes'}
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="basic" className="space-y-6">
              <TabsList className="grid w-full grid-cols-6">
                <TabsTrigger value="basic">Basic Info</TabsTrigger>
                <TabsTrigger value="content">Content</TabsTrigger>
                <TabsTrigger value="age">Age Groups</TabsTrigger>
                <TabsTrigger value="packages">Packages</TabsTrigger>
                <TabsTrigger value="media">Media</TabsTrigger>
                <TabsTrigger value="seo">SEO</TabsTrigger>
              </TabsList>

              <TabsContent value="basic" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Title</Label>
                    <Input
                      id="title"
                      value={activityData.title}
                      onChange={(e) => updateField('title', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="slug">URL Slug</Label>
                    <Input
                      id="slug"
                      value={activityData.slug}
                      onChange={(e) => updateField('slug', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      value={activityData.location}
                      onChange={(e) => updateField('location', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="duration">Duration</Label>
                    <Input
                      id="duration"
                      value={activityData.duration}
                      onChange={(e) => updateField('duration', e.target.value)}
                      placeholder="e.g., Half Day, 2-3 hours"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="difficulty">Difficulty</Label>
                    <Select value={activityData.difficulty} onValueChange={(value: 'Easy' | 'Moderate' | 'Challenging') => updateField('difficulty', value)}>
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
                    <Label htmlFor="bestTime">Best Time to Visit</Label>
                    <Input
                      id="bestTime"
                      value={activityData.bestTime}
                      onChange={(e) => updateField('bestTime', e.target.value)}
                      placeholder="e.g., Year round, Morning hours"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="heroHeading">Hero Heading</Label>
                  <Input
                    id="heroHeading"
                    value={activityData.heroHeading}
                    onChange={(e) => updateField('heroHeading', e.target.value)}
                    placeholder="Compelling headline for the hero section"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={activityData.description}
                    onChange={(e) => updateField('description', e.target.value)}
                    rows={4}
                  />
                </div>
              </TabsContent>

              <TabsContent value="content" className="space-y-6">
                {/* Highlights */}
                <Card>
                  <CardHeader>
                    <CardTitle>Activity Highlights</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex gap-2">
                      <Input
                        value={newHighlight}
                        onChange={(e) => setNewHighlight(e.target.value)}
                        placeholder="Add activity highlight"
                      />
                      <Button onClick={() => addToArray('highlights', newHighlight)}>
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {activityData.highlights.map((highlight, index) => (
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

                {/* Safety Tips & What to Bring */}
                <div className="grid md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Safety Tips</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex gap-2">
                        <Input
                          value={newSafetyTip}
                          onChange={(e) => setNewSafetyTip(e.target.value)}
                          placeholder="Add safety tip"
                        />
                        <Button onClick={() => addToArray('safetyTips', newSafetyTip)}>
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="space-y-2">
                        {activityData.safetyTips.map((tip, index) => (
                          <div key={index} className="flex items-center justify-between p-2 border rounded">
                            <span className="text-sm">{tip}</span>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeFromArray('safetyTips', index)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>What to Bring</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex gap-2">
                        <Input
                          value={newItem}
                          onChange={(e) => setNewItem(e.target.value)}
                          placeholder="Add item"
                        />
                        <Button onClick={() => addToArray('whatToBring', newItem)}>
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="space-y-2">
                        {activityData.whatToBring.map((item, index) => (
                          <div key={index} className="flex items-center justify-between p-2 border rounded">
                            <span className="text-sm">{item}</span>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeFromArray('whatToBring', index)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* FAQs */}
                <Card>
                  <CardHeader>
                    <CardTitle>Frequently Asked Questions</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Input
                        value={newFaq.question}
                        onChange={(e) => setNewFaq({ ...newFaq, question: e.target.value })}
                        placeholder="Question"
                      />
                      <Textarea
                        value={newFaq.answer}
                        onChange={(e) => setNewFaq({ ...newFaq, answer: e.target.value })}
                        placeholder="Answer"
                        rows={2}
                      />
                      <Button onClick={addFaq}>
                        <Plus className="h-4 w-4 mr-2" />
                        Add FAQ
                      </Button>
                    </div>
                    <div className="space-y-2">
                      {activityData.faqs.map((faq, index) => (
                        <div key={index} className="border rounded p-3">
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <p className="font-semibold text-sm">{faq.question}</p>
                              <p className="text-sm text-gray-600 mt-1">{faq.answer}</p>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeFaq(index)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="age" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Age Recommendations</CardTitle>
                    <CardDescription>Add age-specific recommendations and tips</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3 border rounded p-4">
                      <div className="grid grid-cols-2 gap-3">
                        <Input
                          value={newAgeGroup.ageGroup}
                          onChange={(e) => setNewAgeGroup({ ...newAgeGroup, ageGroup: e.target.value })}
                          placeholder="Age group (e.g., 4-6 years)"
                        />
                        <Input
                          value={newAgeGroup.suitability}
                          onChange={(e) => setNewAgeGroup({ ...newAgeGroup, suitability: e.target.value })}
                          placeholder="Suitability (e.g., Highly suitable)"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Tips for this age group:</Label>
                        {newAgeGroup.tips.map((tip, idx) => (
                          <div key={idx} className="flex gap-2">
                            <Input
                              value={tip}
                              onChange={(e) => {
                                const newTips = [...newAgeGroup.tips];
                                newTips[idx] = e.target.value;
                                setNewAgeGroup({ ...newAgeGroup, tips: newTips });
                              }}
                              placeholder="Add tip"
                            />
                            {idx === newAgeGroup.tips.length - 1 && (
                              <Button
                                size="sm"
                                onClick={() => setNewAgeGroup({ ...newAgeGroup, tips: [...newAgeGroup.tips, ''] })}
                              >
                                <Plus className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        ))}
                      </div>
                      <Button onClick={addAgeRecommendation} className="w-full">
                        Add Age Recommendation
                      </Button>
                    </div>

                    <div className="space-y-3">
                      {activityData.ageRecommendations.map((ageRec, index) => (
                        <div key={index} className="border rounded p-4 space-y-2">
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-semibold">{ageRec.ageGroup}</h4>
                              <p className="text-sm text-gray-600">{ageRec.suitability}</p>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeAgeRecommendation(index)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                          <div className="pl-4">
                            <p className="text-sm font-medium mb-1">Tips:</p>
                            <ul className="space-y-1">
                              {ageRec.tips.map((tip, tipIdx) => (
                                <li key={tipIdx} className="text-sm text-gray-600 flex items-start gap-2">
                                  <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-1.5" />
                                  {tip}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="packages" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Family Packages</CardTitle>
                    <CardDescription>Add package options with pricing and inclusions</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3 border rounded p-4">
                      <div className="grid grid-cols-2 gap-3">
                        <Input
                          value={newPackage.title}
                          onChange={(e) => setNewPackage({ ...newPackage, title: e.target.value })}
                          placeholder="Package title"
                        />
                        <Input
                          value={newPackage.duration}
                          onChange={(e) => setNewPackage({ ...newPackage, duration: e.target.value })}
                          placeholder="Duration (e.g., Full Day)"
                        />
                        <Input
                          value={newPackage.adultPrice}
                          onChange={(e) => setNewPackage({ ...newPackage, adultPrice: e.target.value })}
                          placeholder="Adult price (e.g., $45)"
                        />
                        <Input
                          value={newPackage.childPrice}
                          onChange={(e) => setNewPackage({ ...newPackage, childPrice: e.target.value })}
                          placeholder="Child price (e.g., $20)"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label>Package Includes:</Label>
                        {newPackage.includes.map((item, idx) => (
                          <div key={idx} className="flex gap-2">
                            <Input
                              value={item}
                              onChange={(e) => {
                                const newIncludes = [...newPackage.includes];
                                newIncludes[idx] = e.target.value;
                                setNewPackage({ ...newPackage, includes: newIncludes });
                              }}
                              placeholder="Included item"
                            />
                            {idx === newPackage.includes.length - 1 && (
                              <Button
                                size="sm"
                                onClick={() => setNewPackage({ ...newPackage, includes: [...newPackage.includes, ''] })}
                              >
                                <Plus className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        ))}
                      </div>

                      <div className="space-y-2">
                        <Label>Package Highlights:</Label>
                        {newPackage.highlights.map((highlight, idx) => (
                          <div key={idx} className="flex gap-2">
                            <Input
                              value={highlight}
                              onChange={(e) => {
                                const newHighlights = [...newPackage.highlights];
                                newHighlights[idx] = e.target.value;
                                setNewPackage({ ...newPackage, highlights: newHighlights });
                              }}
                              placeholder="Package highlight"
                            />
                            {idx === newPackage.highlights.length - 1 && (
                              <Button
                                size="sm"
                                onClick={() => setNewPackage({ ...newPackage, highlights: [...newPackage.highlights, ''] })}
                              >
                                <Plus className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        ))}
                      </div>

                      <Button onClick={addPackage} className="w-full">
                        Add Package
                      </Button>
                    </div>

                    <div className="space-y-3">
                      {activityData.packages.map((pkg, index) => (
                        <div key={index} className="border rounded p-4 space-y-3">
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-semibold text-lg">{pkg.title}</h4>
                              <div className="flex gap-4 text-sm text-gray-600">
                                <span>Adult: {pkg.adultPrice}</span>
                                <span>Child: {pkg.childPrice}</span>
                                <span>Duration: {pkg.duration}</span>
                              </div>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removePackage(index)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                          <div className="grid md:grid-cols-2 gap-4">
                            <div>
                              <p className="text-sm font-medium mb-1">Includes:</p>
                              <ul className="space-y-1">
                                {pkg.includes.map((item, idx) => (
                                  <li key={idx} className="text-sm text-gray-600 flex items-start gap-2">
                                    <CheckCircle className="w-3 h-3 text-green-600 mt-0.5" />
                                    {item}
                                  </li>
                                ))}
                              </ul>
                            </div>
                            <div>
                              <p className="text-sm font-medium mb-1">Highlights:</p>
                              <div className="flex flex-wrap gap-1">
                                {pkg.highlights.map((highlight, idx) => (
                                  <Badge key={idx} variant="secondary" className="text-xs">
                                    {highlight}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          </div>
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
                      {activityData.heroImages.map((image, index) => (
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
                    value={activityData.seoFocusKeyword}
                    onChange={(e) => updateField('seoFocusKeyword', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="seoDescription">Meta Description</Label>
                  <Textarea
                    id="seoDescription"
                    value={activityData.seoMetaDescription}
                    onChange={(e) => updateField('seoMetaDescription', e.target.value)}
                    rows={3}
                    maxLength={160}
                  />
                  <p className="text-sm text-gray-500">
                    {activityData.seoMetaDescription.length}/160 characters
                  </p>
                </div>
                <div className="flex items-center space-x-4">
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={activityData.featured}
                      onChange={(e) => updateField('featured', e.target.checked)}
                    />
                    <span>Featured Activity</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={activityData.active}
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

export default FamilyActivitiesSection;