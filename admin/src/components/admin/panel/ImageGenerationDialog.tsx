import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Sparkles } from 'lucide-react';

interface ImageGenerationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onImageGenerated: (newImage: any) => void;
}

const ImageGenerationDialog: React.FC<ImageGenerationDialogProps> = ({ isOpen, onClose, onImageGenerated }) => {
  const [prompt, setPrompt] = useState('');
  const [style, setStyle] = useState('photorealistic');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [apiKey, setApiKey] = useState<string | null>(null);

  useEffect(() => {
    const fetchApiKey = async () => {
      try {
        const response = await fetch('/api/get-api-key');
        const data = await response.json();
        setApiKey(data.apiKey);
      } catch (err) {
        setError('Error fetching API key');
      }
    };

    if (isOpen) {
      fetchApiKey();
    }
  }, [isOpen]);

  const handleGenerate = async () => {
    setIsGenerating(true);
    setError(null);
    setGeneratedImage(null);

    try {
      if (!apiKey) {
        setError('API key not found');
        setIsGenerating(false);
        return;
      }

      const result = await google.generativeai.images.generate({ prompt, styles: [style] });
      if (result.error) {
        setError(result.error);
      } else {
        setGeneratedImage(result.path);
      }
    } catch (err) {
      setError('An unexpected error occurred.');
    }

    setIsGenerating(false);
  };

  const handleSave = () => {
    if (generatedImage) {
      const newImage = {
        id: Date.now(),
        name: prompt.substring(0, 20) + '...',
        url: generatedImage,
        size: 'N/A',
        uploaded: new Date().toISOString().split('T')[0],
      };
      onImageGenerated(newImage);
      alert(`Image generated at: ${generatedImage}\n\nPlease manually move this image to the public/lovable-uploads directory and update the URL in the database.`);
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Sparkles className="w-5 h-5 mr-2" />
            Generate AI Image
          </DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="prompt" className="text-right">
              Prompt
            </Label>
            <Input
              id="prompt"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="col-span-3"
              placeholder="e.g., A beautiful beach in Sri Lanka"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="style" className="text-right">
              Style
            </Label>
            <Select value={style} onValueChange={setStyle}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select a style" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="photorealistic">Photorealistic</SelectItem>
                <SelectItem value="watercolor">Watercolor</SelectItem>
                <SelectItem value="oil-painting">Oil Painting</SelectItem>
                <SelectItem value="sketch">Sketch</SelectItem>
                <SelectItem value="pixel-art">Pixel Art</SelectItem>
                <SelectItem value="anime">Anime</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        {error && (
          <div className="my-4 text-red-500">
            <p>Error: {error}</p>
          </div>
        )}
        {generatedImage && (
          <div className="my-4">
            <img src={generatedImage} alt="Generated image" className="rounded-lg" />
          </div>
        )}
        <DialogFooter>
          {generatedImage ? (
            <Button onClick={handleSave}>Save Image</Button>
          ) : (
            <Button onClick={handleGenerate} disabled={isGenerating || !apiKey}>
              {isGenerating ? 'Generating...' : 'Generate'}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ImageGenerationDialog;
