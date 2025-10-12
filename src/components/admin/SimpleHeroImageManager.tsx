import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Save, Trash2, Copy } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

interface HeroImage {
  image: string;
  title: string;
  subtitle: string;
  description: string;
}

export default function SimpleHeroImageManager() {
  const [heroImages, setHeroImages] = useState<HeroImage[]>([
    {
      image: '',
      title: '',
      subtitle: '',
      description: ''
    }
  ]);
  const [generatedCode, setGeneratedCode] = useState('');
  const { toast } = useToast();

  const handleImageUrlChange = (index: number, url: string) => {
    const updated = [...heroImages];
    updated[index].image = url;
    setHeroImages(updated);
  };

  const handleFieldChange = (index: number, field: keyof HeroImage, value: string) => {
    const updated = [...heroImages];
    updated[index][field] = value;
    setHeroImages(updated);
  };

  const addNewSlide = () => {
    setHeroImages([...heroImages, {
      image: '',
      title: '',
      subtitle: '',
      description: ''
    }]);
  };

  const removeSlide = (index: number) => {
    setHeroImages(heroImages.filter((_, i) => i !== index));
  };

  const generateCode = () => {
    const validImages = heroImages.filter(img => img.image && img.title);
    if (validImages.length === 0) {
      toast({
        title: "Error",
        description: "Please add at least one image with a title",
        variant: "destructive",
      });
      return;
    }

    const code = `const heroSlides = ${JSON.stringify(validImages, null, 2)};`;
    setGeneratedCode(code);
    
    toast({
      title: "Success",
      description: "Code generated! Copy it and replace the heroSlides array in LuxuryHeroSection.tsx",
    });
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedCode);
    toast({
      title: "Copied!",
      description: "Code copied to clipboard",
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>Simple Hero Image Configuration</span>
          <Button onClick={addNewSlide} variant="outline">
            Add New Slide
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="bg-yellow-50 p-4 rounded-lg">
          <p className="text-sm text-yellow-800">
            <strong>Instructions:</strong> Add your image URLs and details below, then generate the code to update your site.
          </p>
        </div>

        {heroImages.map((image, index) => (
          <div key={index} className="border rounded-lg p-4 space-y-4">
            <div className="flex justify-between items-start">
              <h3 className="text-lg font-semibold">Slide {index + 1}</h3>
              {heroImages.length > 1 && (
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => removeSlide(index)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              )}
            </div>

            <div className="grid gap-4">
              <div>
                <Label>Image URL</Label>
                <Input
                  value={image.image}
                  onChange={(e) => handleImageUrlChange(index, e.target.value)}
                  placeholder="https://example.com/image.jpg"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Upload your image to any image hosting service (Imgur, Cloudinary, etc.) and paste the URL here
                </p>
              </div>

              <div>
                <Label>Title</Label>
                <Input
                  value={image.title}
                  onChange={(e) => handleFieldChange(index, 'title', e.target.value)}
                  placeholder="e.g., Sigiriya Rock Fortress"
                />
              </div>

              <div>
                <Label>Subtitle</Label>
                <Input
                  value={image.subtitle}
                  onChange={(e) => handleFieldChange(index, 'subtitle', e.target.value)}
                  placeholder="e.g., The Eighth Wonder of the World"
                />
              </div>

              <div>
                <Label>Description</Label>
                <textarea
                  value={image.description}
                  onChange={(e) => handleFieldChange(index, 'description', e.target.value)}
                  placeholder="e.g., Spectacular aerial drone view..."
                  className="w-full px-3 py-2 border rounded-md"
                  rows={2}
                />
              </div>

              {image.image && (
                <div className="mt-2">
                  <Label>Preview</Label>
                  <img
                    src={image.image}
                    alt={image.title || 'Preview'}
                    className="w-full h-48 object-cover rounded"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                      toast({
                        title: "Invalid Image URL",
                        description: `Could not load image for slide ${index + 1}`,
                        variant: "destructive",
                      });
                    }}
                  />
                </div>
              )}
            </div>
          </div>
        ))}

        <div className="border-t pt-6">
          <Button 
            onClick={generateCode} 
            className="w-full bg-green-600 hover:bg-green-700"
          >
            <Save className="w-4 h-4 mr-2" />
            Generate Code
          </Button>
        </div>

        {generatedCode && (
          <div className="border rounded-lg p-4 bg-gray-50">
            <div className="flex justify-between items-center mb-2">
              <Label>Generated Code</Label>
              <Button
                size="sm"
                variant="outline"
                onClick={copyToClipboard}
              >
                <Copy className="w-4 h-4 mr-1" />
                Copy
              </Button>
            </div>
            <pre className="text-xs overflow-x-auto bg-white p-3 rounded border">
              {generatedCode}
            </pre>
            <p className="text-sm text-gray-600 mt-2">
              Copy this code and I'll update your LuxuryHeroSection.tsx file
            </p>
          </div>
        )}

        <div className="bg-blue-50 p-4 rounded-lg space-y-2">
          <h4 className="font-semibold text-blue-900">Image Hosting Options:</h4>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• <a href="https://imgur.com" target="_blank" rel="noopener noreferrer" className="underline">Imgur</a> - Free, no signup required</li>
            <li>• <a href="https://cloudinary.com" target="_blank" rel="noopener noreferrer" className="underline">Cloudinary</a> - Free tier available</li>
            <li>• <a href="https://postimages.org" target="_blank" rel="noopener noreferrer" className="underline">PostImages</a> - Free, direct links</li>
            <li>• Upload to any service and get the direct image URL</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}