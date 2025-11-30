import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Sparkles,
  Wand2,
  FileText,
  Image as ImageIcon,
  RefreshCw,
  Copy,
  Check,
  ArrowLeft,
  Loader2,
  Zap,
  Brain,
  Globe,
  Download,
  Palette
} from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { doc, setDoc, Timestamp, getDocs, collection } from 'firebase/firestore';
import { db } from '@/services/firebaseService';

type AIProvider = 'gemini' | 'openai' | 'perplexity';
type ContentType = 'blog' | 'news' | 'guide' | 'review';
type Tone = 'professional' | 'casual' | 'informative' | 'persuasive';
type ImageStyle = 'realistic' | 'artistic' | 'minimalist' | 'vibrant';
type ImageSize = 'small' | 'medium' | 'large';

interface GeneratedContent {
  title: string;
  content: string;
  excerpt: string;
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
  outline?: string[];
  readingTime: number;
  provider: AIProvider;
}

interface GeneratedImage {
  imageUrl: string;
  altText: string;
}

interface BlogCategory {
  id: string;
  name: string;
}

interface AIContentGeneratorProps {
  onNavigate?: (section: string, params?: Record<string, string>) => void;
}

const AIContentGenerator: React.FC<AIContentGeneratorProps> = ({ onNavigate }) => {
  const [activeTab, setActiveTab] = useState<'content' | 'image'>('content');

  // Content generation state
  const [loading, setLoading] = useState(false);
  const [topic, setTopic] = useState('');
  const [provider, setProvider] = useState<AIProvider>('gemini');
  const [contentType, setContentType] = useState<ContentType>('blog');
  const [tone, setTone] = useState<Tone>('informative');
  const [wordCount, setWordCount] = useState([1500]);
  const [keywords, setKeywords] = useState('');
  const [generateOutline, setGenerateOutline] = useState(true);
  const [categoryId, setCategoryId] = useState('');
  const [categories, setCategories] = useState<BlogCategory[]>([]);
  const [generatedContent, setGeneratedContent] = useState<GeneratedContent | null>(null);
  const [copied, setCopied] = useState(false);
  const [saving, setSaving] = useState(false);

  // Image generation state
  const [imagePrompt, setImagePrompt] = useState('');
  const [imageStyle, setImageStyle] = useState<ImageStyle>('realistic');
  const [imageSize, setImageSize] = useState<ImageSize>('large');
  const [generatingImage, setGeneratingImage] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<GeneratedImage | null>(null);
  const [generateWithContent, setGenerateWithContent] = useState(true);

  const { toast } = useToast();

  // Provider availability
  const providers = {
    gemini: { name: 'Gemini 2.0 Flash (Nano Banana Pro)', icon: Sparkles, available: true, color: 'text-blue-500', supportsImage: true },
    openai: { name: 'OpenAI GPT-5.1 + DALL-E 3', icon: Brain, available: !!import.meta.env.VITE_OPENAI_API_KEY, color: 'text-green-500', supportsImage: true },
    perplexity: { name: 'Perplexity AI', icon: Globe, available: !!import.meta.env.VITE_PERPLEXITY_API_KEY, color: 'text-purple-500', supportsImage: false }
  };

  const imageStyles = [
    { value: 'realistic', label: 'Realistic', description: 'Photorealistic travel photography' },
    { value: 'artistic', label: 'Artistic', description: 'Creative digital art style' },
    { value: 'minimalist', label: 'Minimalist', description: 'Clean and modern design' },
    { value: 'vibrant', label: 'Vibrant', description: 'Colorful and dynamic' }
  ];

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      // Simple query without orderBy to avoid index requirements
      const snapshot = await getDocs(collection(db, 'blog_categories'));
      let data = snapshot.docs.map(docSnap => ({
        id: docSnap.id,
        ...docSnap.data()
      })) as BlogCategory[];
      // Sort on client side
      data.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
      setCategories(data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleGenerate = async () => {
    if (!topic.trim()) {
      toast({ title: 'Please enter a topic', variant: 'destructive' });
      return;
    }

    setLoading(true);
    setGeneratedContent(null);
    setGeneratedImage(null);

    try {
      const { aiFactory } = await import('@/services/ai/aiProviderFactory');

      const result = await aiFactory.generateContent({
        topic,
        contentType,
        tone,
        targetWordCount: wordCount[0],
        keywords: keywords.split(',').map(k => k.trim()).filter(Boolean),
        generateOutlineFirst: generateOutline,
        category: categories.find(c => c.id === categoryId)?.name
      }, provider);

      setGeneratedContent(result);
      toast({ title: 'Content generated successfully!' });

      // Auto-generate image if enabled
      if (generateWithContent && providers[provider].supportsImage) {
        await handleGenerateImage(topic);
      }
    } catch (error: any) {
      console.error('AI generation error:', error);
      toast({
        title: 'Generation failed',
        description: error.message || 'Please try again or use a different provider',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateImage = async (promptOverride?: string) => {
    const prompt = promptOverride || imagePrompt;
    if (!prompt.trim()) {
      toast({ title: 'Please enter an image prompt', variant: 'destructive' });
      return;
    }

    setGeneratingImage(true);

    try {
      let result;

      // Use OpenAI DALL-E if OpenAI is selected and available, otherwise use Gemini
      if (provider === 'openai' && providers.openai.available) {
        console.log('Using OpenAI DALL-E 3 for image generation...');
        const { openaiService } = await import('@/services/ai/openaiService');
        result = await openaiService.generateImage({
          prompt,
          style: imageStyle,
          size: imageSize
        });
      } else {
        console.log('Using Gemini for image generation...');
        const { geminiService } = await import('@/services/ai/geminiService');
        result = await geminiService.generateImage({
          prompt,
          style: imageStyle,
          size: imageSize
        });
      }

      console.log('Image result:', result);
      setGeneratedImage(result);
      toast({ title: 'Image generated successfully!' });
    } catch (error: any) {
      console.error('Image generation error:', error);
      toast({
        title: 'Image generation failed',
        description: error.message || 'Please try again',
        variant: 'destructive'
      });
    } finally {
      setGeneratingImage(false);
    }
  };

  const handleCopy = async () => {
    if (generatedContent) {
      await navigator.clipboard.writeText(generatedContent.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast({ title: 'Content copied to clipboard!' });
    }
  };

  const handleDownloadImage = () => {
    if (generatedImage?.imageUrl) {
      const link = document.createElement('a');
      link.href = generatedImage.imageUrl;
      link.download = `ai-generated-image-${Date.now()}.png`;
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleSaveAsDraft = async () => {
    if (!generatedContent) return;

    setSaving(true);
    try {
      const selectedCategory = categories.find(c => c.id === categoryId);
      const slug = generatedContent.title
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-');

      const postId = `ai_${Date.now()}`;
      await setDoc(doc(db, 'blogs', postId), {
        title: generatedContent.title,
        slug,
        content: generatedContent.content,
        excerpt: generatedContent.excerpt,
        featuredImage: generatedImage?.imageUrl || '',
        category: selectedCategory ? { id: selectedCategory.id, name: selectedCategory.name } : null,
        tags: generatedContent.keywords,
        author: { name: 'Recharge Travels' },
        status: 'draft',
        readingTime: generatedContent.readingTime,
        viewCount: 0,
        seo: {
          metaTitle: generatedContent.metaTitle,
          metaDescription: generatedContent.metaDescription,
          keywords: generatedContent.keywords,
          ogImage: generatedImage?.imageUrl || ''
        },
        aiGenerated: true,
        aiProvider: generatedContent.provider,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      });

      toast({ title: 'Post saved as draft!' });
      onNavigate?.('blog-editor', { id: postId });
    } catch (error) {
      console.error('Error saving draft:', error);
      toast({ title: 'Error saving draft', variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => onNavigate?.('blog-manager')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <div>
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-purple-500" />
              AI Content Generator
            </h2>
            <p className="text-sm text-muted-foreground">
              Generate SEO-optimized content & images with AI
            </p>
          </div>
        </div>
      </div>

      {/* Main Tabs */}
      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'content' | 'image')}>
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="content" className="flex items-center gap-2">
            <FileText className="w-4 h-4" />
            Content
          </TabsTrigger>
          <TabsTrigger value="image" className="flex items-center gap-2">
            <ImageIcon className="w-4 h-4" />
            Image
          </TabsTrigger>
        </TabsList>

        {/* Content Generation Tab */}
        <TabsContent value="content" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Input Panel */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Content Settings</CardTitle>
                  <CardDescription>
                    Configure how the AI should generate your content
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* AI Provider Selection */}
                  <div className="space-y-3">
                    <Label>AI Provider</Label>
                    <div className="grid grid-cols-3 gap-3">
                      {(Object.entries(providers) as [AIProvider, typeof providers.gemini][]).map(([key, info]) => {
                        const Icon = info.icon;
                        return (
                          <Button
                            key={key}
                            variant={provider === key ? 'default' : 'outline'}
                            className={`flex flex-col h-auto py-4 ${!info.available ? 'opacity-50' : ''}`}
                            disabled={!info.available}
                            onClick={() => setProvider(key)}
                          >
                            <Icon className={`w-5 h-5 mb-1 ${info.color}`} />
                            <span className="text-xs">{info.name}</span>
                            {!info.available && (
                              <span className="text-[10px] text-muted-foreground">Not configured</span>
                            )}
                          </Button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Topic Input */}
                  <div className="space-y-2">
                    <Label htmlFor="topic">Topic / Heading *</Label>
                    <Textarea
                      id="topic"
                      value={topic}
                      onChange={(e) => setTopic(e.target.value)}
                      placeholder="e.g., Top 10 Beaches in Sri Lanka for 2024..."
                      rows={3}
                    />
                  </div>

                  {/* Content Type & Tone */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Content Type</Label>
                      <Select value={contentType} onValueChange={(v) => setContentType(v as ContentType)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="blog">Blog Post</SelectItem>
                          <SelectItem value="news">News Article</SelectItem>
                          <SelectItem value="guide">Travel Guide</SelectItem>
                          <SelectItem value="review">Review</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Tone</Label>
                      <Select value={tone} onValueChange={(v) => setTone(v as Tone)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="professional">Professional</SelectItem>
                          <SelectItem value="casual">Casual</SelectItem>
                          <SelectItem value="informative">Informative</SelectItem>
                          <SelectItem value="persuasive">Persuasive</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Category */}
                  <div className="space-y-2">
                    <Label>Category</Label>
                    <Select value={categoryId} onValueChange={setCategoryId}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map(cat => (
                          <SelectItem key={cat.id} value={cat.id}>
                            {cat.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Word Count */}
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <Label>Target Word Count</Label>
                      <span className="text-sm text-muted-foreground">{wordCount[0]} words</span>
                    </div>
                    <Slider
                      value={wordCount}
                      onValueChange={setWordCount}
                      min={500}
                      max={3000}
                      step={100}
                    />
                  </div>

                  {/* Keywords */}
                  <div className="space-y-2">
                    <Label htmlFor="keywords">Target Keywords (comma-separated)</Label>
                    <Input
                      id="keywords"
                      value={keywords}
                      onChange={(e) => setKeywords(e.target.value)}
                      placeholder="sri lanka, beaches, travel tips"
                    />
                  </div>

                  {/* Options */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="outline" className="cursor-pointer">
                        Generate outline first
                      </Label>
                      <Switch
                        id="outline"
                        checked={generateOutline}
                        onCheckedChange={setGenerateOutline}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="withImage" className="cursor-pointer">
                          Auto-generate featured image
                        </Label>
                        <p className="text-xs text-muted-foreground">
                          Using Gemini Imagen 3
                        </p>
                      </div>
                      <Switch
                        id="withImage"
                        checked={generateWithContent}
                        onCheckedChange={setGenerateWithContent}
                      />
                    </div>
                  </div>

                  {/* Generate Button */}
                  <Button
                    className="w-full"
                    size="lg"
                    onClick={handleGenerate}
                    disabled={loading || !topic.trim()}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Wand2 className="w-4 h-4 mr-2" />
                        Generate Content {generateWithContent && '& Image'}
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Output Panel */}
            <div className="space-y-6">
              {loading ? (
                <Card className="h-full min-h-[600px] flex items-center justify-center">
                  <div className="text-center space-y-4">
                    <div className="relative">
                      <Sparkles className="w-12 h-12 text-purple-500 mx-auto animate-pulse" />
                      <div className="absolute inset-0 w-12 h-12 mx-auto border-4 border-purple-200 border-t-purple-500 rounded-full animate-spin" />
                    </div>
                    <p className="text-lg font-medium">Generating content{generateWithContent && ' & image'}...</p>
                    <p className="text-sm text-muted-foreground">
                      This may take 30-60 seconds
                    </p>
                  </div>
                </Card>
              ) : generatedContent ? (
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle>Generated Content</CardTitle>
                        <CardDescription className="flex items-center gap-2 mt-1">
                          <Badge variant="secondary" className="flex items-center gap-1">
                            {providers[generatedContent.provider].icon && (
                              <span className={providers[generatedContent.provider].color}>
                                {React.createElement(providers[generatedContent.provider].icon, { className: 'w-3 h-3' })}
                              </span>
                            )}
                            {providers[generatedContent.provider].name}
                          </Badge>
                          <span>•</span>
                          <span>{generatedContent.readingTime} min read</span>
                        </CardDescription>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={handleCopy}>
                          {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                        </Button>
                        <Button variant="outline" size="sm" onClick={handleGenerate}>
                          <RefreshCw className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Generated Image Preview */}
                    {generatedImage && (
                      <div className="relative rounded-lg overflow-hidden border">
                        <img
                          src={generatedImage.imageUrl}
                          alt={generatedImage.altText}
                          className="w-full h-48 object-cover"
                        />
                        <div className="absolute top-2 right-2 flex gap-2">
                          <Button size="sm" variant="secondary" onClick={handleDownloadImage}>
                            <Download className="w-4 h-4" />
                          </Button>
                          <Button size="sm" variant="secondary" onClick={() => handleGenerateImage(topic)}>
                            <RefreshCw className="w-4 h-4" />
                          </Button>
                        </div>
                        <Badge className="absolute bottom-2 left-2 bg-black/50 text-white">
                          <ImageIcon className="w-3 h-3 mr-1" />
                          AI Generated
                        </Badge>
                      </div>
                    )}

                    <Tabs defaultValue="preview">
                      <TabsList>
                        <TabsTrigger value="preview">Preview</TabsTrigger>
                        <TabsTrigger value="seo">SEO</TabsTrigger>
                        <TabsTrigger value="raw">Raw Markdown</TabsTrigger>
                      </TabsList>

                      <TabsContent value="preview" className="space-y-4 mt-4">
                        <h2 className="text-2xl font-bold">{generatedContent.title}</h2>
                        <p className="text-muted-foreground italic">{generatedContent.excerpt}</p>
                        <div className="prose prose-sm max-w-none max-h-[300px] overflow-y-auto">
                          {generatedContent.content.split('\n').map((line, i) => {
                            if (line.startsWith('## ')) {
                              return <h2 key={i} className="text-xl font-bold mt-4">{line.replace('## ', '')}</h2>;
                            }
                            if (line.startsWith('### ')) {
                              return <h3 key={i} className="text-lg font-semibold mt-3">{line.replace('### ', '')}</h3>;
                            }
                            if (line.startsWith('- ')) {
                              return <li key={i} className="ml-4">{line.replace('- ', '')}</li>;
                            }
                            return line ? <p key={i}>{line}</p> : <br key={i} />;
                          })}
                        </div>
                      </TabsContent>

                      <TabsContent value="seo" className="space-y-4 mt-4">
                        <div className="space-y-2">
                          <Label>Meta Title</Label>
                          <p className="text-sm p-2 bg-muted rounded">{generatedContent.metaTitle}</p>
                        </div>
                        <div className="space-y-2">
                          <Label>Meta Description</Label>
                          <p className="text-sm p-2 bg-muted rounded">{generatedContent.metaDescription}</p>
                        </div>
                        <div className="space-y-2">
                          <Label>Keywords</Label>
                          <div className="flex flex-wrap gap-2">
                            {generatedContent.keywords.map(kw => (
                              <Badge key={kw} variant="outline">{kw}</Badge>
                            ))}
                          </div>
                        </div>
                      </TabsContent>

                      <TabsContent value="raw" className="mt-4">
                        <Textarea
                          value={generatedContent.content}
                          readOnly
                          rows={15}
                          className="font-mono text-sm"
                        />
                      </TabsContent>
                    </Tabs>

                    {/* Action Buttons */}
                    <div className="flex gap-3 pt-4 border-t">
                      <Button
                        className="flex-1"
                        onClick={handleSaveAsDraft}
                        disabled={saving}
                      >
                        {saving ? (
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        ) : (
                          <FileText className="w-4 h-4 mr-2" />
                        )}
                        Save as Draft
                      </Button>
                      <Button
                        variant="outline"
                        className="flex-1"
                        onClick={handleSaveAsDraft}
                      >
                        <Zap className="w-4 h-4 mr-2" />
                        Edit & Publish
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card className="h-full min-h-[600px] flex items-center justify-center">
                  <div className="text-center space-y-4 p-8">
                    <Sparkles className="w-16 h-16 text-muted-foreground/30 mx-auto" />
                    <h3 className="text-lg font-medium">Ready to Generate</h3>
                    <p className="text-sm text-muted-foreground max-w-xs mx-auto">
                      Enter a topic and configure your settings, then click "Generate Content" to create AI-powered blog posts.
                    </p>
                  </div>
                </Card>
              )}
            </div>
          </div>
        </TabsContent>

        {/* Image Generation Tab */}
        <TabsContent value="image" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Image Input Panel */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ImageIcon className="w-5 h-5 text-purple-500" />
                  AI Image Generator
                </CardTitle>
                <CardDescription>
                  Generate stunning travel images with Gemini Imagen 3
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Image Prompt */}
                <div className="space-y-2">
                  <Label htmlFor="imagePrompt">Image Description *</Label>
                  <Textarea
                    id="imagePrompt"
                    value={imagePrompt}
                    onChange={(e) => setImagePrompt(e.target.value)}
                    placeholder="e.g., Beautiful sunset over Sigiriya rock fortress with lush green jungle surroundings..."
                    rows={4}
                  />
                </div>

                {/* Style Selection */}
                <div className="space-y-3">
                  <Label>Image Style</Label>
                  <div className="grid grid-cols-2 gap-3">
                    {imageStyles.map((style) => (
                      <Button
                        key={style.value}
                        variant={imageStyle === style.value ? 'default' : 'outline'}
                        className="h-auto py-3 flex flex-col items-start"
                        onClick={() => setImageStyle(style.value as ImageStyle)}
                      >
                        <span className="font-medium">{style.label}</span>
                        <span className="text-xs opacity-70">{style.description}</span>
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Size Selection */}
                <div className="space-y-2">
                  <Label>Image Size</Label>
                  <Select value={imageSize} onValueChange={(v) => setImageSize(v as ImageSize)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="small">Small (512x512)</SelectItem>
                      <SelectItem value="medium">Medium (1024x1024)</SelectItem>
                      <SelectItem value="large">Large (1536x1024) - Recommended</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Generate Button */}
                <Button
                  className="w-full"
                  size="lg"
                  onClick={() => handleGenerateImage()}
                  disabled={generatingImage || !imagePrompt.trim()}
                >
                  {generatingImage ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Generating Image...
                    </>
                  ) : (
                    <>
                      <Palette className="w-4 h-4 mr-2" />
                      Generate Image
                    </>
                  )}
                </Button>

                {/* Quick Prompts */}
                <div className="space-y-2">
                  <Label className="text-xs text-muted-foreground">Quick Prompts</Label>
                  <div className="flex flex-wrap gap-2">
                    {[
                      'Sigiriya rock fortress at sunrise',
                      'Pristine beach in Mirissa',
                      'Tea plantations in Nuwara Eliya',
                      'Elephants in Yala National Park',
                      'Temple of the Tooth, Kandy'
                    ].map((prompt) => (
                      <Badge
                        key={prompt}
                        variant="outline"
                        className="cursor-pointer hover:bg-muted"
                        onClick={() => setImagePrompt(prompt)}
                      >
                        {prompt}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Image Output Panel */}
            <Card className="min-h-[500px]">
              <CardHeader>
                <CardTitle>Generated Image</CardTitle>
              </CardHeader>
              <CardContent>
                {generatingImage ? (
                  <div className="h-80 flex items-center justify-center">
                    <div className="text-center space-y-4">
                      <div className="relative">
                        <ImageIcon className="w-12 h-12 text-purple-500 mx-auto animate-pulse" />
                        <div className="absolute inset-0 w-12 h-12 mx-auto border-4 border-purple-200 border-t-purple-500 rounded-full animate-spin" />
                      </div>
                      <p className="text-lg font-medium">Creating your image...</p>
                      <p className="text-sm text-muted-foreground">
                        This may take 15-30 seconds
                      </p>
                    </div>
                  </div>
                ) : generatedImage ? (
                  <div className="space-y-4">
                    <div className="relative rounded-lg overflow-hidden border">
                      <img
                        src={generatedImage.imageUrl}
                        alt={generatedImage.altText}
                        className="w-full object-cover"
                        onError={(e) => {
                          console.error('Image failed to load:', generatedImage.imageUrl);
                          e.currentTarget.src = 'https://via.placeholder.com/800x600?text=Image+Failed+to+Load';
                        }}
                        onLoad={() => console.log('Image loaded successfully')}
                      />
                      <Badge className="absolute bottom-2 left-2 bg-black/50 text-white">
                        <Sparkles className="w-3 h-3 mr-1" />
                        {provider === 'openai' ? 'DALL-E 3' : 'Gemini 2.0 Flash'}
                      </Badge>
                    </div>
                    <div className="flex gap-3">
                      <Button className="flex-1" onClick={handleDownloadImage}>
                        <Download className="w-4 h-4 mr-2" />
                        Download
                      </Button>
                      <Button variant="outline" className="flex-1" onClick={() => handleGenerateImage()}>
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Regenerate
                      </Button>
                    </div>
                    <div className="p-3 bg-muted rounded-lg">
                      <Label className="text-xs">Alt Text</Label>
                      <p className="text-sm mt-1">{generatedImage.altText}</p>
                    </div>
                    <div className="p-3 bg-muted rounded-lg">
                      <Label className="text-xs">Image URL</Label>
                      <p className="text-xs mt-1 break-all text-muted-foreground">
                        {generatedImage.imageUrl.substring(0, 100)}...
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="h-80 flex items-center justify-center">
                    <div className="text-center space-y-4 p-8">
                      <ImageIcon className="w-16 h-16 text-muted-foreground/30 mx-auto" />
                      <h3 className="text-lg font-medium">No Image Yet</h3>
                      <p className="text-sm text-muted-foreground max-w-xs mx-auto">
                        Enter a description and click "Generate Image" to create AI-powered travel photos.
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AIContentGenerator;
