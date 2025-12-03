import React, { useState, useEffect } from 'react';
import { doc, getDoc, setDoc, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

// Reuse the interface from the main component
interface HeroSlide {
  id: string;
  image: string;
  title: string;
  subtitle: string;
}

interface Attraction {
  id: string;
  name: string;
  description: string;
  image: string;
  category: string;
  rating: number;
  duration: string;
  price: string;
  highlights: string[];
}

interface Activity {
  id: string;
  name: string;
  description: string;
  icon: any;
  price: string;
  duration: string;
  popular?: boolean;
}

interface FAQ {
  id: string;
  question: string;
  answer: string;
}

interface Itinerary {
  id: string;
  title: string;
  duration: string;
  description: string;
  highlights: string[];
  price: string;
}

interface TravelTip {
  id: string;
  title: string;
  icon: any;
  tips: string[];
}

interface MataraContent {
  hero: {
    slides: HeroSlide[];
    title: string;
    subtitle: string;
  };
  overview: {
    title: string;
    description: string;
    highlights: string[];
  };
  seo: {
    title: string;
    description: string;
    keywords: string;
  };
  attractions: Attraction[];
  activities: Activity[];
  itineraries: Itinerary[];
  faqs: FAQ[];
  gallery: string[];
  travelTips: TravelTip[];
}

const AdminMatara = () => {
  const [content, setContent] = useState<MataraContent | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const docRef = doc(db, 'destinations', 'matara');
    const unsubscribe = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        setContent(docSnap.data() as MataraContent);
      } else {
        // Handle case where document doesn't exist
        setContent(null);
      }
      setLoading(false);
    }, (error) => {
      console.error("Error fetching document: ", error);
      toast.error("Failed to fetch content.");
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleSave = async () => {
    if (content) {
      try {
        const docRef = doc(db, 'destinations', 'matara');
        await setDoc(docRef, content, { merge: true });
        toast.success('Content saved successfully!');
      } catch (error) {
        console.error("Error saving document: ", error);
        toast.error('Failed to save content.');
      }
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, ...path: string[]) => {
    const [mainKey, index, subKey, subIndex, field] = path;
    
    if (!content) return;

    const newContent = { ...content };
    let current: any = newContent;

    for (let i = 0; i < path.length - 1; i++) {
      current = current[path[i]];
    }
    current[path[path.length - 1]] = e.target.value;

    setContent(newContent);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!content) {
    return <div>No content found for Matara.</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Edit Matara Page Content</h1>
      
      <Accordion type="multiple" collapsible className="space-y-4">
        {/* SEO Section */}
        <AccordionItem value="seo">
          <AccordionTrigger>SEO</AccordionTrigger>
          <AccordionContent>
            <Card>
              <CardHeader><CardTitle>SEO</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label>Title</label>
                  <Input value={content.seo.title} onChange={(e) => handleInputChange(e, 'seo', 'title')} />
                </div>
                <div>
                  <label>Description</label>
                  <Textarea value={content.seo.description} onChange={(e) => handleInputChange(e, 'seo', 'description')} />
                </div>
                <div>
                  <label>Keywords</label>
                  <Input value={content.seo.keywords} onChange={(e) => handleInputChange(e, 'seo', 'keywords')} />
                </div>
              </CardContent>
            </Card>
          </AccordionContent>
        </AccordionItem>

        {/* Hero Section */}
        <AccordionItem value="hero">
          <AccordionTrigger>Hero Section</AccordionTrigger>
          <AccordionContent>
            <Card>
              <CardHeader><CardTitle>Hero Section</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label>Title</label>
                  <Input value={content.hero.title} onChange={(e) => handleInputChange(e, 'hero', 'title')} />
                </div>
                <div>
                  <label>Subtitle</label>
                  <Input value={content.hero.subtitle} onChange={(e) => handleInputChange(e, 'hero', 'subtitle')} />
                </div>
                {content.hero.slides.map((slide, index) => (
                  <div key={slide.id} className="border p-4 rounded-md">
                    <h4 className="font-semibold">Slide {index + 1}</h4>
                    <div>
                      <label>Image URL</label>
                      <Input value={slide.image} onChange={(e) => handleInputChange(e, 'hero', 'slides', index.toString(), 'image')} />
                    </div>
                    <div>
                      <label>Title</label>
                      <Input value={slide.title} onChange={(e) => handleInputChange(e, 'hero', 'slides', index.toString(), 'title')} />
                    </div>
                    <div>
                      <label>Subtitle</label>
                      <Input value={slide.subtitle} onChange={(e) => handleInputChange(e, 'hero', 'slides', index.toString(), 'subtitle')} />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </AccordionContent>
        </AccordionItem>

        {/* Overview Section */}
        <AccordionItem value="overview">
          <AccordionTrigger>Overview Section</AccordionTrigger>
          <AccordionContent>
            <Card>
              <CardHeader><CardTitle>Overview Section</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label>Title</label>
                  <Input value={content.overview.title} onChange={(e) => handleInputChange(e, 'overview', 'title')} />
                </div>
                <div>
                  <label>Description</label>
                  <Textarea value={content.overview.description} onChange={(e) => handleInputChange(e, 'overview', 'description')} />
                </div>
                <div>
                  <label>Highlights (comma-separated)</label>
                  <Textarea 
                    value={content.overview.highlights.join(', ')} 
                    onChange={(e) => {
                      const newContent = {...content};
                      newContent.overview.highlights = e.target.value.split(',').map(s => s.trim());
                      setContent(newContent);
                    }} 
                  />
                </div>
              </CardContent>
            </Card>
          </AccordionContent>
        </AccordionItem>

        {/* Attractions Section */}
        <AccordionItem value="attractions">
          <AccordionTrigger>Attractions</AccordionTrigger>
          <AccordionContent>
            {content.attractions.map((attraction, index) => (
              <Card key={attraction.id} className="mb-4">
                <CardHeader><CardTitle>{attraction.name}</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label>Name</label>
                    <Input value={attraction.name} onChange={(e) => handleInputChange(e, 'attractions', index.toString(), 'name')} />
                  </div>
                  <div>
                    <label>Description</label>
                    <Textarea value={attraction.description} onChange={(e) => handleInputChange(e, 'attractions', index.toString(), 'description')} />
                  </div>
                  <div>
                    <label>Image URL</label>
                    <Input value={attraction.image} onChange={(e) => handleInputChange(e, 'attractions', index.toString(), 'image')} />
                  </div>
                  {/* Add more fields as needed */}
                </CardContent>
              </Card>
            ))}
          </AccordionContent>
        </AccordionItem>

        {/* Add more sections for Activities, Itineraries, FAQs, etc. following the same pattern */}

      </Accordion>

      <Button onClick={handleSave} className="mt-6">Save Changes</Button>
    </div>
  );
};

export default AdminMatara;
