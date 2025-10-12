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

interface Destination {
  id: string;
  name: string;
  category: string;
  price: number;
  title: string;
  description: string;
  duration: string;
  rating: number;
  features: string[];
  image: string;
  is_active: boolean;
  created_at: string;
}

interface Props {
  destination?: Destination | null;
  onSubmit: (data: Omit<Destination, 'id' | 'created_at'> | Partial<Destination>) => void;
  onCancel: () => void;
}

const FeaturedDestinationForm: React.FC<Props> = ({ destination, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    category: 'Nature',
    price: 0,
    title: '',
    description: '',
    duration: '',
    rating: 0,
    features: '',
    image: '',
    is_active: true,
  });
  const [aiPrompt, setAiPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isAiDialogOpen, setIsAiDialogOpen] = useState(false);

  useEffect(() => {
    if (destination) {
      setFormData({
        name: destination.name,
        category: destination.category,
        price: destination.price,
        title: destination.title,
        description: destination.description,
        duration: destination.duration,
        rating: destination.rating,
        features: destination.features.join(','),
        image: destination.image,
        is_active: destination.is_active,
      });
    }
  }, [destination]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSwitchChange = (checked: boolean) => {
    setFormData(prev => ({ ...prev, is_active: checked }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const submissionData = {
      ...formData,
      price: Number(formData.price),
      rating: Number(formData.rating),
      features: formData.features.split(',').map(s => s.trim()),
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
      Generate content for a featured destination based on the following topic: "${aiPrompt}".
      The response should be a JSON object with the following structure:
      {
        "name": "Name of the destination",
        "category": "One of: Heritage, Nature, Culture, Beach, Wildlife",
        "price": 100,
        "title": "A catchy title for the destination",
        "description": "A detailed description of the destination (2-3 sentences).",
        "duration": "e.g., 'Half Day', '2-3 Days'",
        "rating": 4.8,
        "features": ["Feature 1", "Feature 2", "Feature 3"],
        "image": "A placeholder image URL from unsplash.com"
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
        category: generatedData.category || prev.category,
        price: generatedData.price || prev.price,
        title: generatedData.title || prev.title,
        description: generatedData.description || prev.description,
        duration: generatedData.duration || prev.duration,
        rating: generatedData.rating || prev.rating,
        features: (generatedData.features || []).join(','),
        image: generatedData.image || prev.image,
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
        <CardTitle>{destination ? 'Edit Destination' : 'Create New Destination'}</CardTitle>
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
                <DialogTitle>Generate Destination Content</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <p className="text-sm text-gray-500">
                  Enter a topic or a few keywords, and the AI will generate the content for you.
                  For example: "A serene beach getaway in the south of Sri Lanka".
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
              <Label htmlFor="title">Title</Label>
              <Input id="title" name="title" value={formData.title} onChange={handleChange} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <select id="category" name="category" value={formData.category} onChange={(e) => setFormData(prev => ({...prev, category: e.target.value}))} className="w-full p-2 border rounded-md">
                <option value="Nature">Nature</option>
                <option value="Heritage">Heritage</option>
                <option value="Culture">Culture</option>
                <option value="Beach">Beach</option>
                <option value="Wildlife">Wildlife</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="price">Price</Label>
              <Input id="price" name="price" type="number" value={formData.price} onChange={handleChange} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="duration">Duration</Label>
              <Input id="duration" name="duration" value={formData.duration} onChange={handleChange} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="rating">Rating (0-5)</Label>
              <Input id="rating" name="rating" type="number" step="0.1" min="0" max="5" value={formData.rating} onChange={handleChange} required />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" name="description" value={formData.description} onChange={handleChange} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="image">Image URL</Label>
            <Input id="image" name="image" value={formData.image} onChange={handleChange} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="features">Features (comma-separated)</Label>
            <Input id="features" name="features" value={formData.features} onChange={handleChange} />
          </div>
          <div className="flex items-center space-x-2">
            <Switch id="is_active" checked={formData.is_active} onCheckedChange={handleSwitchChange} />
            <Label htmlFor="is_active">Active</Label>
          </div>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
            <Button type="submit">{destination ? 'Update' : 'Create'}</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default FeaturedDestinationForm;
