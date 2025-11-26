/**
 * AI Content Tools - Admin Panel Component
 * Provides UI for all AI-powered content generation features
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  FileText,
  Image,
  MapPin,
  HelpCircle,
  MessageSquare,
  Search,
  Loader2,
  Copy,
  Check,
  RefreshCw,
  Download,
  Globe,
  Wand2,
  CalendarDays,
  Languages
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { geminiService } from '@/services/ai/geminiService';

type TabType = 'content' | 'itinerary' | 'description' | 'faq' | 'seo' | 'image' | 'review' | 'translate';

const AIContentTools = () => {
  const [activeTab, setActiveTab] = useState<TabType>('content');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form states
  const [contentForm, setContentForm] = useState({
    topic: '',
    contentType: 'guide' as 'blog' | 'news' | 'guide' | 'review',
    tone: 'informative' as 'professional' | 'casual' | 'informative' | 'persuasive',
    wordCount: 1500,
    keywords: ''
  });

  const [itineraryForm, setItineraryForm] = useState({
    destination: '',
    duration: 5,
    travelStyle: 'cultural' as 'luxury' | 'budget' | 'adventure' | 'family' | 'honeymoon' | 'cultural',
    interests: ''
  });

  const [descriptionForm, setDescriptionForm] = useState({
    type: 'destination' as 'destination' | 'tour' | 'activity' | 'hotel' | 'experience',
    name: '',
    details: '',
    length: 'medium' as 'short' | 'medium' | 'long'
  });

  const [faqForm, setFaqForm] = useState({
    topic: '',
    context: '',
    count: 10
  });

  const [seoForm, setSeoForm] = useState({
    title: '',
    content: '',
    keywords: ''
  });

  const [imageForm, setImageForm] = useState({
    prompt: '',
    style: 'realistic' as 'realistic' | 'artistic' | 'minimalist' | 'vibrant',
    imageUrl: ''
  });

  const [reviewForm, setReviewForm] = useState({
    reviewText: '',
    rating: 4,
    reviewerName: '',
    tone: 'professional' as 'professional' | 'friendly' | 'apologetic'
  });

  const [translateForm, setTranslateForm] = useState({
    content: '',
    targetLanguage: 'sinhala' as 'sinhala' | 'tamil'
  });

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleGenerateContent = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await geminiService.generateContent({
        topic: contentForm.topic,
        contentType: contentForm.contentType,
        tone: contentForm.tone,
        targetWordCount: contentForm.wordCount,
        keywords: contentForm.keywords.split(',').map(k => k.trim()).filter(Boolean)
      });
      setResult(response);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateItinerary = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await geminiService.generateItinerary({
        destination: itineraryForm.destination,
        duration: itineraryForm.duration,
        travelStyle: itineraryForm.travelStyle,
        interests: itineraryForm.interests.split(',').map(i => i.trim()).filter(Boolean)
      });
      setResult(response);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateDescription = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await geminiService.generateDescription({
        type: descriptionForm.type,
        name: descriptionForm.name,
        details: JSON.parse(descriptionForm.details || '{}'),
        length: descriptionForm.length,
        includeHighlights: true,
        includePracticalInfo: true
      });
      setResult(response);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateFAQs = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await geminiService.generateFAQs({
        topic: faqForm.topic,
        context: faqForm.context,
        count: faqForm.count
      });
      setResult(response);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleOptimizeSEO = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await geminiService.optimizeSEO({
        title: seoForm.title,
        content: seoForm.content,
        targetKeywords: seoForm.keywords.split(',').map(k => k.trim()).filter(Boolean)
      });
      setResult(response);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateImage = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await geminiService.generateImage({
        prompt: imageForm.prompt,
        style: imageForm.style
      });
      setResult(response);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAnalyzeImage = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await geminiService.analyzeImage({
        imageUrl: imageForm.imageUrl,
        analyzeFor: ['tags', 'location', 'quality', 'content', 'seo']
      });
      setResult(response);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateReviewResponse = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await geminiService.generateReviewResponse({
        reviewText: reviewForm.reviewText,
        rating: reviewForm.rating,
        reviewerName: reviewForm.reviewerName,
        tone: reviewForm.tone
      });
      setResult(response);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleTranslate = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await geminiService.translateContent(
        translateForm.content,
        translateForm.targetLanguage
      );
      setResult({ translatedContent: response });
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'content', label: 'Content', icon: FileText },
    { id: 'itinerary', label: 'Itinerary', icon: CalendarDays },
    { id: 'description', label: 'Description', icon: Wand2 },
    { id: 'faq', label: 'FAQs', icon: HelpCircle },
    { id: 'seo', label: 'SEO', icon: Search },
    { id: 'image', label: 'Images', icon: Image },
    { id: 'review', label: 'Reviews', icon: MessageSquare },
    { id: 'translate', label: 'Translate', icon: Languages }
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">AI Content Tools</h1>
        </div>
        <p className="text-gray-600">
          Generate high-quality travel content using Google Gemini AI
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Panel */}
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <Tabs value={activeTab} onValueChange={(v) => { setActiveTab(v as TabType); setResult(null); }}>
            <TabsList className="flex flex-wrap gap-1 mb-6">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <TabsTrigger
                    key={tab.id}
                    value={tab.id}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-sm"
                  >
                    <Icon className="w-4 h-4" />
                    {tab.label}
                  </TabsTrigger>
                );
              })}
            </TabsList>

            {/* Content Generation */}
            <TabsContent value="content" className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Topic</label>
                <input
                  type="text"
                  value={contentForm.topic}
                  onChange={(e) => setContentForm({ ...contentForm, topic: e.target.value })}
                  placeholder="e.g., Best beaches in Sri Lanka"
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                  <select
                    value={contentForm.contentType}
                    onChange={(e) => setContentForm({ ...contentForm, contentType: e.target.value as any })}
                    className="w-full px-3 py-2 border rounded-lg"
                  >
                    <option value="blog">Blog Post</option>
                    <option value="guide">Travel Guide</option>
                    <option value="news">News Article</option>
                    <option value="review">Review</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tone</label>
                  <select
                    value={contentForm.tone}
                    onChange={(e) => setContentForm({ ...contentForm, tone: e.target.value as any })}
                    className="w-full px-3 py-2 border rounded-lg"
                  >
                    <option value="informative">Informative</option>
                    <option value="professional">Professional</option>
                    <option value="casual">Casual</option>
                    <option value="persuasive">Persuasive</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Keywords (comma-separated)</label>
                <input
                  type="text"
                  value={contentForm.keywords}
                  onChange={(e) => setContentForm({ ...contentForm, keywords: e.target.value })}
                  placeholder="beach, tourism, Sri Lanka"
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>
              <Button onClick={handleGenerateContent} disabled={loading || !contentForm.topic} className="w-full">
                {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Sparkles className="w-4 h-4 mr-2" />}
                Generate Content
              </Button>
            </TabsContent>

            {/* Itinerary Generation */}
            <TabsContent value="itinerary" className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Destination</label>
                <input
                  type="text"
                  value={itineraryForm.destination}
                  onChange={(e) => setItineraryForm({ ...itineraryForm, destination: e.target.value })}
                  placeholder="e.g., Cultural Triangle, Colombo to Ella"
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Duration (days)</label>
                  <input
                    type="number"
                    value={itineraryForm.duration}
                    onChange={(e) => setItineraryForm({ ...itineraryForm, duration: parseInt(e.target.value) })}
                    min={1}
                    max={30}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Travel Style</label>
                  <select
                    value={itineraryForm.travelStyle}
                    onChange={(e) => setItineraryForm({ ...itineraryForm, travelStyle: e.target.value as any })}
                    className="w-full px-3 py-2 border rounded-lg"
                  >
                    <option value="luxury">Luxury</option>
                    <option value="budget">Budget</option>
                    <option value="adventure">Adventure</option>
                    <option value="family">Family</option>
                    <option value="honeymoon">Honeymoon</option>
                    <option value="cultural">Cultural</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Interests (comma-separated)</label>
                <input
                  type="text"
                  value={itineraryForm.interests}
                  onChange={(e) => setItineraryForm({ ...itineraryForm, interests: e.target.value })}
                  placeholder="wildlife, temples, beaches"
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>
              <Button onClick={handleGenerateItinerary} disabled={loading || !itineraryForm.destination} className="w-full">
                {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <CalendarDays className="w-4 h-4 mr-2" />}
                Generate Itinerary
              </Button>
            </TabsContent>

            {/* Description Generation */}
            <TabsContent value="description" className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                  <select
                    value={descriptionForm.type}
                    onChange={(e) => setDescriptionForm({ ...descriptionForm, type: e.target.value as any })}
                    className="w-full px-3 py-2 border rounded-lg"
                  >
                    <option value="destination">Destination</option>
                    <option value="tour">Tour</option>
                    <option value="activity">Activity</option>
                    <option value="hotel">Hotel</option>
                    <option value="experience">Experience</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Length</label>
                  <select
                    value={descriptionForm.length}
                    onChange={(e) => setDescriptionForm({ ...descriptionForm, length: e.target.value as any })}
                    className="w-full px-3 py-2 border rounded-lg"
                  >
                    <option value="short">Short (50-100 words)</option>
                    <option value="medium">Medium (150-250 words)</option>
                    <option value="long">Long (300-500 words)</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                  type="text"
                  value={descriptionForm.name}
                  onChange={(e) => setDescriptionForm({ ...descriptionForm, name: e.target.value })}
                  placeholder="e.g., Sigiriya Rock Fortress"
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Details (JSON)</label>
                <textarea
                  value={descriptionForm.details}
                  onChange={(e) => setDescriptionForm({ ...descriptionForm, details: e.target.value })}
                  placeholder='{"location": "Central Province", "type": "UNESCO Heritage Site"}'
                  rows={3}
                  className="w-full px-3 py-2 border rounded-lg font-mono text-sm"
                />
              </div>
              <Button onClick={handleGenerateDescription} disabled={loading || !descriptionForm.name} className="w-full">
                {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Wand2 className="w-4 h-4 mr-2" />}
                Generate Description
              </Button>
            </TabsContent>

            {/* FAQ Generation */}
            <TabsContent value="faq" className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Topic</label>
                <input
                  type="text"
                  value={faqForm.topic}
                  onChange={(e) => setFaqForm({ ...faqForm, topic: e.target.value })}
                  placeholder="e.g., Yala Safari Tour"
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Context</label>
                <textarea
                  value={faqForm.context}
                  onChange={(e) => setFaqForm({ ...faqForm, context: e.target.value })}
                  placeholder="Describe the tour/service..."
                  rows={3}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Number of FAQs</label>
                <input
                  type="number"
                  value={faqForm.count}
                  onChange={(e) => setFaqForm({ ...faqForm, count: parseInt(e.target.value) })}
                  min={5}
                  max={20}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>
              <Button onClick={handleGenerateFAQs} disabled={loading || !faqForm.topic} className="w-full">
                {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <HelpCircle className="w-4 h-4 mr-2" />}
                Generate FAQs
              </Button>
            </TabsContent>

            {/* SEO Optimization */}
            <TabsContent value="seo" className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input
                  type="text"
                  value={seoForm.title}
                  onChange={(e) => setSeoForm({ ...seoForm, title: e.target.value })}
                  placeholder="Page/article title"
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Content</label>
                <textarea
                  value={seoForm.content}
                  onChange={(e) => setSeoForm({ ...seoForm, content: e.target.value })}
                  placeholder="Paste your content here..."
                  rows={5}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Target Keywords</label>
                <input
                  type="text"
                  value={seoForm.keywords}
                  onChange={(e) => setSeoForm({ ...seoForm, keywords: e.target.value })}
                  placeholder="keyword1, keyword2"
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>
              <Button onClick={handleOptimizeSEO} disabled={loading || !seoForm.content} className="w-full">
                {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Search className="w-4 h-4 mr-2" />}
                Optimize SEO
              </Button>
            </TabsContent>

            {/* Image Tools */}
            <TabsContent value="image" className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Image Prompt</label>
                <textarea
                  value={imageForm.prompt}
                  onChange={(e) => setImageForm({ ...imageForm, prompt: e.target.value })}
                  placeholder="Describe the image you want to generate..."
                  rows={3}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Style</label>
                <select
                  value={imageForm.style}
                  onChange={(e) => setImageForm({ ...imageForm, style: e.target.value as any })}
                  className="w-full px-3 py-2 border rounded-lg"
                >
                  <option value="realistic">Realistic</option>
                  <option value="artistic">Artistic</option>
                  <option value="minimalist">Minimalist</option>
                  <option value="vibrant">Vibrant</option>
                </select>
              </div>
              <Button onClick={handleGenerateImage} disabled={loading || !imageForm.prompt} className="w-full mb-4">
                {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Image className="w-4 h-4 mr-2" />}
                Generate Image
              </Button>
              <hr className="my-4" />
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Analyze Image URL</label>
                <input
                  type="url"
                  value={imageForm.imageUrl}
                  onChange={(e) => setImageForm({ ...imageForm, imageUrl: e.target.value })}
                  placeholder="https://example.com/image.jpg"
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>
              <Button onClick={handleAnalyzeImage} disabled={loading || !imageForm.imageUrl} variant="outline" className="w-full">
                {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Search className="w-4 h-4 mr-2" />}
                Analyze Image
              </Button>
            </TabsContent>

            {/* Review Response */}
            <TabsContent value="review" className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Review Text</label>
                <textarea
                  value={reviewForm.reviewText}
                  onChange={(e) => setReviewForm({ ...reviewForm, reviewText: e.target.value })}
                  placeholder="Paste the customer review..."
                  rows={4}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Rating</label>
                  <select
                    value={reviewForm.rating}
                    onChange={(e) => setReviewForm({ ...reviewForm, rating: parseInt(e.target.value) })}
                    className="w-full px-3 py-2 border rounded-lg"
                  >
                    {[1, 2, 3, 4, 5].map(r => (
                      <option key={r} value={r}>{r} Star{r > 1 ? 's' : ''}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tone</label>
                  <select
                    value={reviewForm.tone}
                    onChange={(e) => setReviewForm({ ...reviewForm, tone: e.target.value as any })}
                    className="w-full px-3 py-2 border rounded-lg"
                  >
                    <option value="professional">Professional</option>
                    <option value="friendly">Friendly</option>
                    <option value="apologetic">Apologetic</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Reviewer Name (optional)</label>
                <input
                  type="text"
                  value={reviewForm.reviewerName}
                  onChange={(e) => setReviewForm({ ...reviewForm, reviewerName: e.target.value })}
                  placeholder="Customer name"
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>
              <Button onClick={handleGenerateReviewResponse} disabled={loading || !reviewForm.reviewText} className="w-full">
                {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <MessageSquare className="w-4 h-4 mr-2" />}
                Generate Response
              </Button>
            </TabsContent>

            {/* Translation */}
            <TabsContent value="translate" className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Content to Translate</label>
                <textarea
                  value={translateForm.content}
                  onChange={(e) => setTranslateForm({ ...translateForm, content: e.target.value })}
                  placeholder="Enter content in English..."
                  rows={5}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Target Language</label>
                <select
                  value={translateForm.targetLanguage}
                  onChange={(e) => setTranslateForm({ ...translateForm, targetLanguage: e.target.value as any })}
                  className="w-full px-3 py-2 border rounded-lg"
                >
                  <option value="sinhala">Sinhala (සිංහල)</option>
                  <option value="tamil">Tamil (தமிழ்)</option>
                </select>
              </div>
              <Button onClick={handleTranslate} disabled={loading || !translateForm.content} className="w-full">
                {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Languages className="w-4 h-4 mr-2" />}
                Translate
              </Button>
            </TabsContent>
          </Tabs>
        </div>

        {/* Output Panel */}
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Generated Output</h2>
            {result && (
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleCopy(JSON.stringify(result, null, 2))}
                >
                  {copied ? <Check className="w-4 h-4 mr-1" /> : <Copy className="w-4 h-4 mr-1" />}
                  {copied ? 'Copied!' : 'Copy JSON'}
                </Button>
                <Button size="sm" variant="outline" onClick={() => setResult(null)}>
                  <RefreshCw className="w-4 h-4 mr-1" />
                  Clear
                </Button>
              </div>
            )}
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
              {error}
            </div>
          )}

          {loading && (
            <div className="flex flex-col items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-purple-600 mb-4" />
              <p className="text-gray-600">Generating with AI...</p>
            </div>
          )}

          {!loading && !result && !error && (
            <div className="flex flex-col items-center justify-center py-12 text-gray-400">
              <Sparkles className="w-12 h-12 mb-4" />
              <p>Generated content will appear here</p>
            </div>
          )}

          {result && (
            <AnimatePresence>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4 overflow-auto max-h-[600px]"
              >
                <pre className="bg-gray-50 p-4 rounded-lg overflow-x-auto text-sm">
                  {JSON.stringify(result, null, 2)}
                </pre>

                {/* Quick Preview for specific types */}
                {result.title && (
                  <div className="border-t pt-4">
                    <h3 className="font-semibold text-lg mb-2">{result.title}</h3>
                    {result.excerpt && <p className="text-gray-600 mb-2">{result.excerpt}</p>}
                    {result.shortDescription && <p className="text-gray-600">{result.shortDescription}</p>}
                  </div>
                )}

                {result.imageUrl && (
                  <div className="border-t pt-4">
                    <img src={result.imageUrl} alt={result.altText || 'Generated'} className="rounded-lg max-w-full" />
                  </div>
                )}

                {result.response && (
                  <div className="border-t pt-4">
                    <h4 className="font-medium mb-2">Suggested Response:</h4>
                    <p className="text-gray-700 bg-blue-50 p-3 rounded-lg">{result.response}</p>
                  </div>
                )}

                {result.translatedContent && (
                  <div className="border-t pt-4">
                    <h4 className="font-medium mb-2">Translation:</h4>
                    <p className="text-gray-700 bg-green-50 p-3 rounded-lg">{result.translatedContent}</p>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          )}
        </div>
      </div>
    </div>
  );
};

export default AIContentTools;
