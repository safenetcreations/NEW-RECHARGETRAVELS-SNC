import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { X, Sparkles } from 'lucide-react';
import { aiService } from '@/services/aiService';
import { toast } from 'sonner';
import { TravelPackage, TravelPackageFormData } from '@/types/cms';

interface Props {
  travelPackage?: TravelPackage | null;
  onSubmit: (data: TravelPackageFormData) => void;
  onCancel: () => void;
}

const TravelPackageForm: React.FC<Props> = ({ travelPackage, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState<TravelPackageFormData>({
    name: '',
    duration: '',
    price: '',
    originalPrice: '',
    discount: '',
    image: '',
    rating: 0,
    reviews: 0,
    destinations: [],
    highlights: [],
    bestFor: '',
    isActive: true,
  });
  const [aiPrompt, setAiPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isAiDialogOpen, setIsAiDialogOpen] = useState(false);

  useEffect(() => {
    if (travelPackage) {
      setFormData({
        name: travelPackage.name,
        duration: travelPackage.duration,
        price: travelPackage.price,
        originalPrice: travelPackage.originalPrice || '',
        discount: travelPackage.discount || '',
        image: travelPackage.image,
        rating: travelPackage.rating,
        reviews: travelPackage.reviews,
        destinations: travelPackage.destinations,
        highlights: travelPackage.highlights,
        bestFor: travelPackage.bestFor || '',
        isActive: travelPackage.isActive,
      });
    }
  }, [travelPackage]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSwitchChange = (checked: boolean) => {
    setFormData(prev => ({ ...prev, isActive: checked }));
  };

  const handleArrayChange = (e: React.ChangeEvent<HTMLTextAreaElement>, field: 'destinations' | 'highlights') => {
    const values = e.target.value.split(',').map(s => s.trim());
    setFormData(prev => ({ ...prev, [field]: values }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const submissionData = {
      ...formData,
      rating: Number(formData.rating),
      reviews: Number(formData.reviews),
    };
    onSubmit(submissionData);
  };

  const handleGenerateContent = async () => {
    if (!aiPrompt) {
      toast.error('Please enter a prompt for the AI.');
      return;
    }

    setIsGenerating(true);
    toast.info('Generating content with AI...');

    const prompt = `
      Generate content for a travel package based on the following topic: "${aiPrompt}".
      The response should be a JSON object with the following structure:
      {
        "name": "Name of the travel package",
        "duration": "e.g., '7 Days / 6 Nights'",
        "price": "$1,299",
        "originalPrice": "$1,599",
        "discount": "e.g., '20% OFF'",
        "image": "A placeholder image URL from unsplash.com",
        "rating": 4.9,
        "reviews": 324,
        "destinations": ["Destination 1", "Destination 2", "Destination 3"],
        "highlights": ["Highlight 1", "Highlight 2", "Highlight 3"],
        "bestFor": "e.g., 'First-time visitors', 'Couples & Honeymooners'"
      }
      Only return the JSON object, with no other text or markdown.
    `;

    try {
      const responseText = await aiService.generateContent(prompt);
      const cleanedJson = responseText.replace(/```json\n|```/g, '').trim();
      const generatedData = JSON.parse(cleanedJson);

      setFormData(prev => ({
        ...prev,
        name: generatedData.name || prev.name,
        duration: generatedData.duration || prev.duration,
        price: generatedData.price || prev.price,
        originalPrice: generatedData.originalPrice || prev.originalPrice,
        discount: generatedData.discount || prev.discount,
        image: generatedData.image || prev.image,
        rating: generatedData.rating || prev.rating,
        reviews: generatedData.reviews || prev.reviews,
        destinations: generatedData.destinations || prev.destinations,
        highlights: generatedData.highlights || prev.highlights,
        bestFor: generatedData.bestFor || prev.bestFor,
      }));

      toast.success('AI content generated successfully!');
      setIsAiDialogOpen(false);
    } catch (error) {
      console.error(error);
      toast.error('Failed to generate AI content. Please check the console for details.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>{travelPackage ? 'Edit Travel Package' : 'Create New Travel Package'}</CardTitle>
        <div className="flex items-center gap-2">
          <Dialog open={isAiDialogOpen} onOpenChange={setIsAiDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <Sparkles className="w-4 h-4 mr-2" />
                Generate with AI
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Generate Travel Package Content</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <p className="text-sm text-gray-500">
                  Enter a topic or a few keywords, and the AI will generate the content for you.
                  For example: "A luxury wildlife safari in Yala National Park".
                </p>
                <Textarea
                  placeholder="Enter a prompt..."
                  value={aiPrompt}
                  onChange={(e) => setAiPrompt(e.target.value)}
                />
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAiDialogOpen(false)}>Cancel</Button>
                <Button onClick={handleGenerateContent} disabled={isGenerating}>
                  {isGenerating ? 'Generating...' : 'Generate'}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          <Button variant="ghost" size="icon" onClick={onCancel}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" name="name" value={formData.name} onChange={handleChange} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="duration">Duration</Label>
              <Input id="duration" name="duration" value={formData.duration} onChange={handleChange} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="price">Price</Label>
              <Input id="price" name="price" value={formData.price} onChange={handleChange} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="originalPrice">Original Price</Label>
              <Input id="originalPrice" name="originalPrice" value={formData.originalPrice} onChange={handleChange} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="discount">Discount</Label>
              <Input id="discount" name="discount" value={formData.discount} onChange={handleChange} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="image">Image URL</Label>
              <Input id="image" name="image" value={formData.image} onChange={handleChange} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="rating">Rating (0-5)</Label>
              <Input id="rating" name="rating" type="number" step="0.1" min="0" max="5" value={formData.rating} onChange={handleChange} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="reviews">Number of Reviews</Label>
              <Input id="reviews" name="reviews" type="number" value={formData.reviews} onChange={handleChange} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="bestFor">Best For</Label>
              <Input id="bestFor" name="bestFor" value={formData.bestFor} onChange={handleChange} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="destinations">Destinations (comma-separated)</Label>
            <Textarea
              id="destinations"
              name="destinations"
              value={formData.destinations.join(', ')}
              onChange={(e) => handleArrayChange(e, 'destinations')}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="highlights">Highlights (comma-separated)</Label>
            <Textarea
              id="highlights"
              name="highlights"
              value={formData.highlights.join(', ')}
              onChange={(e) => handleArrayChange(e, 'highlights')}
            />
          </div>
          <div className="flex items-center space-x-2">
            <Switch id="isActive" checked={formData.isActive} onCheckedChange={handleSwitchChange} />
            <Label htmlFor="isActive">Active</Label>
          </div>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
            <Button type="submit">{travelPackage ? 'Update' : 'Create'}</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default TravelPackageForm;
