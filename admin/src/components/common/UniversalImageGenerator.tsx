import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Image, Loader2, Sparkles, Download, Copy, Check } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface UniversalImageGeneratorProps {
    title: string;
    description?: string;
    onImageGenerated: (imageUrl: string) => void;
    suggestedPrompts?: string[];
    imageType?: 'blog' | 'tour' | 'hotel' | 'destination' | 'card' | 'hero';
}

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || 'AIzaSyBMXM3xNrL8zKu1fi1dbdj0VbkJK2MRxgM';

export const UniversalImageGenerator: React.FC<UniversalImageGeneratorProps> = ({
    title,
    description,
    onImageGenerated,
    suggestedPrompts = [],
    imageType = 'blog'
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [prompt, setPrompt] = useState('');
    const [generating, setGenerating] = useState(false);
    const [generatedImage, setGeneratedImage] = useState<string | null>(null);
    const [copied, setCopied] = useState(false);
    const { toast } = useToast();

    const imageStyles = {
        blog: 'professional blog header image, high quality, vibrant colors, 16:9 aspect ratio',
        tour: 'professional tour promotional image, exciting and inviting, travel photography style',
        hotel: 'luxury hotel photography, professional hospitality marketing, clean and elegant',
        destination: 'stunning destination photography, professional travel guide style, breathtaking scenery',
        card: 'eye-catching card image, modern and clean, professional marketing',
        hero: 'dramatic hero banner image, cinematic, professional website header'
    };

    const generateAutoPrompt = () => {
        const basePrompt = `${title}${description ? `: ${description}` : ''}`;
        const styleAddition = imageStyles[imageType];
        return `${basePrompt}, ${styleAddition}, high resolution, professional photography`;
    };

    const generateImage = async () => {
        const finalPrompt = prompt || generateAutoPrompt();

        if (!finalPrompt.trim()) {
            toast({
                title: "No prompt",
                description: "Please enter a prompt or use auto-generate",
                variant: "destructive"
            });
            return;
        }

        setGenerating(true);

        try {
            // Using Gemini's Imagen API
            const response = await fetch(
                `https://generativelanguage.googleapis.com/v1beta/models/imagen-3.0-generate-001:predict?key=${API_KEY}`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        instances: [{
                            prompt: finalPrompt
                        }],
                        parameters: {
                            sampleCount: 1,
                            aspectRatio: imageType === 'card' ? '1:1' : '16:9',
                            personGeneration: 'allow_adult'
                        }
                    })
                }
            );

            if (!response.ok) {
                // Fallback to placeholder image service with AI-style
                const fallbackUrl = `https://images.unsplash.com/photo-${Date.now()}?w=1200&h=675&fit=crop`;
                setGeneratedImage(fallbackUrl);

                toast({
                    title: "⚠️ Using Fallback",
                    description: "Gemini Imagen not available. Using Unsplash instead.",
                });
                return;
            }

            const data = await response.json();
            const imageUrl = data.predictions[0].bytesBase64Encoded
                ? `data:image/png;base64,${data.predictions[0].bytesBase64Encoded}`
                : data.predictions[0].url;

            setGeneratedImage(imageUrl);

            toast({
                title: "✓ Image Generated!",
                description: "Your AI-generated image is ready",
            });
        } catch (error) {
            console.error('Image generation error:', error);

            // Better fallback using Unsplash with keywords from prompt
            const keywords = finalPrompt.split(',')[0].replace(/\s+/g, '+');
            const fallbackUrl = `https://source.unsplash.com/1600x900/?${keywords},srilanka,travel`;
            setGeneratedImage(fallbackUrl);

            toast({
                title: "Using High-Quality Fallback",
                description: "Generated placeholder from Unsplash",
            });
        } finally {
            setGenerating(false);
        }
    };

    const useImage = () => {
        if (generatedImage) {
            onImageGenerated(generatedImage);
            toast({
                title: "✓ Image Applied",
                description: "Image has been set successfully",
            });
            setIsOpen(false);
            setGeneratedImage(null);
            setPrompt('');
        }
    };

    const downloadImage = () => {
        if (generatedImage) {
            const link = document.createElement('a');
            link.href = generatedImage;
            link.download = `${title.replace(/\s+/g, '-').toLowerCase()}-ai-generated.png`;
            link.click();

            toast({
                title: "✓ Downloaded",
                description: "Image saved to your downloads",
            });
        }
    };

    const copyPrompt = () => {
        navigator.clipboard.writeText(prompt || generateAutoPrompt());
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);

        toast({
            title: "✓ Copied",
            description: "Prompt copied to clipboard",
        });
    };

    return (
        <>
            <Button
                type="button"
                onClick={() => {
                    setIsOpen(true);
                    if (!prompt) setPrompt(generateAutoPrompt());
                }}
                className="gap-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
            >
                <Sparkles className="h-4 w-4" />
                Generate AI Image
            </Button>

            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <Image className="h-5 w-5" />
                            AI Image Generator
                        </DialogTitle>
                        <DialogDescription>
                            Generate a professional image using Gemini AI for: <strong>{title}</strong>
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4 mt-4">
                        {/* Prompt Input */}
                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <Label>Image Prompt</Label>
                                <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={copyPrompt}
                                    className="h-7"
                                >
                                    {copied ? (
                                        <>
                                            <Check className="h-3 w-3 mr-1" />
                                            Copied
                                        </>
                                    ) : (
                                        <>
                                            <Copy className="h-3 w-3 mr-1" />
                                            Copy
                                        </>
                                    )}
                                </Button>
                            </div>
                            <Textarea
                                value={prompt}
                                onChange={(e) => setPrompt(e.target.value)}
                                placeholder="Describe the image you want to generate..."
                                rows={4}
                                className="resize-none"
                            />
                            <p className="text-xs text-muted-foreground mt-1">
                                Auto-generated prompt based on your content. Edit to customize.
                            </p>
                        </div>

                        {/* Suggested Prompts */}
                        {suggestedPrompts.length > 0 && (
                            <div>
                                <Label className="mb-2 block">Quick Suggestions:</Label>
                                <div className="flex flex-wrap gap-2">
                                    {suggestedPrompts.map((suggestion, index) => (
                                        <Button
                                            key={index}
                                            size="sm"
                                            variant="outline"
                                            onClick={() => setPrompt(suggestion)}
                                            className="text-xs"
                                        >
                                            {suggestion}
                                        </Button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Generate Button */}
                        <Button
                            onClick={generateImage}
                            disabled={generating}
                            className="w-full"
                            size="lg"
                        >
                            {generating ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Generating Image...
                                </>
                            ) : (
                                <>
                                    <Sparkles className="mr-2 h-4 w-4" />
                                    Generate Image with AI
                                </>
                            )}
                        </Button>

                        {/* Generated Image Preview */}
                        {generatedImage && (
                            <div className="space-y-3">
                                <Label>Generated Image:</Label>
                                <div className="relative rounded-lg overflow-hidden border-2 border-purple-200 dark:border-purple-800">
                                    <img
                                        src={generatedImage}
                                        alt="AI Generated"
                                        className="w-full object-cover"
                                    />
                                </div>

                                {/* Action Buttons */}
                                <div className="flex gap-2">
                                    <Button
                                        onClick={useImage}
                                        className="flex-1 bg-green-600 hover:bg-green-700"
                                    >
                                        <Check className="mr-2 h-4 w-4" />
                                        Use This Image
                                    </Button>
                                    <Button
                                        onClick={downloadImage}
                                        variant="outline"
                                        className="flex-1"
                                    >
                                        <Download className="mr-2 h-4 w-4" />
                                        Download
                                    </Button>
                                    <Button
                                        onClick={generateImage}
                                        variant="outline"
                                    >
                                        <Sparkles className="mr-2 h-4 w-4" />
                                        Regenerate
                                    </Button>
                                </div>
                            </div>
                        )}
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
};

export default UniversalImageGenerator;
