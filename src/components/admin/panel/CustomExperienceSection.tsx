import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Save,
  Plus,
  Trash2,
  Edit2,
  Image as ImageIcon,
  Star,
  Upload,
  Eye,
  X,
  ChevronDown,
  ChevronUp,
  Settings,
  FileText,
  MessageSquare,
  Phone,
  Mail,
  Globe,
  Sparkles,
  ArrowUpDown
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { customExperiencePageService, type CustomExperiencePageContent } from '@/services/customExperiencePageService';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { toast } from 'sonner';
import { Checkbox } from '@/components/ui/checkbox';

const CustomExperienceSection = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [content, setContent] = useState<CustomExperiencePageContent | null>(null);
  const [activeTab, setActiveTab] = useState('hero');
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    hero: true,
    features: false,
    benefits: false,
    testimonials: false,
    form: false,
    contact: false,
    seo: false
  });

  const [editingFeature, setEditingFeature] = useState<any>(null);
  const [editingBenefit, setEditingBenefit] = useState<any>(null);
  const [editingTestimonial, setEditingTestimonial] = useState<any>(null);
  const [editingQuestion, setEditingQuestion] = useState<any>(null);

  useEffect(() => {
    loadContent();
  }, []);

  const loadContent = async () => {
    try {
      setLoading(true);
      const pageContent = await customExperiencePageService.getPageContent();
      setContent(pageContent);
      toast.success('Content loaded successfully');
    } catch (error) {
      console.error('Error loading content:', error);
      toast.error('Failed to load content');
    } finally {
      setLoading(false);
    }
  };

  const saveContent = async () => {
    if (!content) return;

    try {
      setSaving(true);
      await customExperiencePageService.updatePageContent(content);
      toast.success('Content saved successfully!');
    } catch (error) {
      console.error('Error saving content:', error);
      toast.error('Failed to save content');
    } finally {
      setSaving(false);
    }
  };

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const addFeature = () => {
    if (!content) return;
    const newFeature = {
      id: Date.now().toString(),
      icon: '✨',
      title: 'New Feature',
      description: 'Feature description'
    };
    setContent({
      ...content,
      features: [...content.features, newFeature]
    });
    setEditingFeature(newFeature);
  };

  const updateFeature = (id: string, updates: any) => {
    if (!content) return;
    setContent({
      ...content,
      features: content.features.map(f => f.id === id ? { ...f, ...updates } : f)
    });
  };

  const deleteFeature = (id: string) => {
    if (!content) return;
    if (confirm('Are you sure you want to delete this feature?')) {
      setContent({
        ...content,
        features: content.features.filter(f => f.id !== id)
      });
      toast.success('Feature deleted');
    }
  };

  const moveFeature = (index: number, direction: 'up' | 'down') => {
    if (!content) return;
    const newFeatures = [...content.features];
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= newFeatures.length) return;
    [newFeatures[index], newFeatures[newIndex]] = [newFeatures[newIndex], newFeatures[index]];
    setContent({ ...content, features: newFeatures });
  };

  const addBenefit = () => {
    if (!content) return;
    const newBenefit = {
      id: Date.now().toString(),
      title: 'New Benefit',
      description: 'Benefit description',
      image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800'
    };
    setContent({
      ...content,
      benefits: [...content.benefits, newBenefit]
    });
    setEditingBenefit(newBenefit);
  };

  const updateBenefit = (id: string, updates: any) => {
    if (!content) return;
    setContent({
      ...content,
      benefits: content.benefits.map(b => b.id === id ? { ...b, ...updates } : b)
    });
  };

  const deleteBenefit = (id: string) => {
    if (!content) return;
    if (confirm('Are you sure you want to delete this benefit?')) {
      setContent({
        ...content,
        benefits: content.benefits.filter(b => b.id !== id)
      });
      toast.success('Benefit deleted');
    }
  };

  const moveBenefit = (index: number, direction: 'up' | 'down') => {
    if (!content) return;
    const newBenefits = [...content.benefits];
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= newBenefits.length) return;
    [newBenefits[index], newBenefits[newIndex]] = [newBenefits[newIndex], newBenefits[index]];
    setContent({ ...content, benefits: newBenefits });
  };

  const addTestimonial = () => {
    if (!content) return;
    const newTestimonial = {
      id: Date.now().toString(),
      name: 'Customer Name',
      location: 'Location',
      text: 'Testimonial text',
      rating: 5,
      avatar: 'https://i.pravatar.cc/150?img=1'
    };
    setContent({
      ...content,
      testimonials: [...content.testimonials, newTestimonial]
    });
    setEditingTestimonial(newTestimonial);
  };

  const updateTestimonial = (id: string, updates: any) => {
    if (!content) return;
    setContent({
      ...content,
      testimonials: content.testimonials.map(t => t.id === id ? { ...t, ...updates } : t)
    });
  };

  const deleteTestimonial = (id: string) => {
    if (!content) return;
    if (confirm('Are you sure you want to delete this testimonial?')) {
      setContent({
        ...content,
        testimonials: content.testimonials.filter(t => t.id !== id)
      });
      toast.success('Testimonial deleted');
    }
  };

  const addCustomQuestion = () => {
    if (!content) return;
    const newQuestion = {
      id: Date.now().toString(),
      question: 'New Question',
      type: 'text' as const,
      required: false
    };
    setContent({
      ...content,
      formConfig: {
        ...content.formConfig,
        customQuestions: [...content.formConfig.customQuestions, newQuestion]
      }
    });
    setEditingQuestion(newQuestion);
  };

  const updateCustomQuestion = (id: string, updates: any) => {
    if (!content) return;
    setContent({
      ...content,
      formConfig: {
        ...content.formConfig,
        customQuestions: content.formConfig.customQuestions.map(q => q.id === id ? { ...q, ...updates } : q)
      }
    });
  };

  const deleteCustomQuestion = (id: string) => {
    if (!content) return;
    if (confirm('Are you sure you want to delete this question?')) {
      setContent({
        ...content,
        formConfig: {
          ...content.formConfig,
          customQuestions: content.formConfig.customQuestions.filter(q => q.id !== id)
        }
      });
      toast.success('Question deleted');
    }
  };

  if (loading || !content) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading content...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Custom Experience Page</h1>
          <p className="text-gray-600">Manage all content for the custom experience page</p>
        </div>
        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={() => window.open('/custom-experience', '_blank')}
            className="border-2"
          >
            <Eye className="mr-2 w-4 h-4" />
            Preview Page
          </Button>
          <Button
            onClick={saveContent}
            disabled={saving}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg"
          >
            {saving ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                Saving...
              </>
            ) : (
              <>
                <Save className="mr-2 w-4 h-4" />
                Save All Changes
              </>
            )}
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid grid-cols-4 lg:grid-cols-7 gap-2 bg-gray-100 p-2 rounded-xl">
          <TabsTrigger value="hero" className="data-[state=active]:bg-white">Hero</TabsTrigger>
          <TabsTrigger value="features" className="data-[state=active]:bg-white">Features</TabsTrigger>
          <TabsTrigger value="benefits" className="data-[state=active]:bg-white">Benefits</TabsTrigger>
          <TabsTrigger value="testimonials" className="data-[state=active]:bg-white">Testimonials</TabsTrigger>
          <TabsTrigger value="form" className="data-[state=active]:bg-white">Form</TabsTrigger>
          <TabsTrigger value="contact" className="data-[state=active]:bg-white">Contact</TabsTrigger>
          <TabsTrigger value="seo" className="data-[state=active]:bg-white">SEO</TabsTrigger>
        </TabsList>

        {/* Hero Section */}
        <TabsContent value="hero" className="space-y-6">
          <Card className="border-2">
            <CardHeader className="bg-gradient-to-r from-amber-50 to-orange-50">
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="w-6 h-6 text-amber-600" />
                Hero Section
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="space-y-2">
                <Label htmlFor="hero-title" className="text-base font-semibold">Hero Title</Label>
                <Input
                  id="hero-title"
                  value={content.hero.title}
                  onChange={(e) => setContent({
                    ...content,
                    hero: { ...content.hero, title: e.target.value }
                  })}
                  className="text-lg h-12 border-2"
                  placeholder="Design Your Dream Sri Lankan Adventure"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="hero-subtitle" className="text-base font-semibold">Hero Subtitle</Label>
                <Textarea
                  id="hero-subtitle"
                  value={content.hero.subtitle}
                  onChange={(e) => setContent({
                    ...content,
                    hero: { ...content.hero, subtitle: e.target.value }
                  })}
                  rows={3}
                  className="text-base border-2"
                  placeholder="Let our expert travel designers create..."
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="hero-bg" className="text-base font-semibold">Background Image URL</Label>
                <div className="flex gap-2">
                  <Input
                    id="hero-bg"
                    value={content.hero.backgroundImage}
                    onChange={(e) => setContent({
                      ...content,
                      hero: { ...content.hero, backgroundImage: e.target.value }
                    })}
                    className="h-12 border-2"
                    placeholder="https://images.unsplash.com/..."
                  />
                  <Button variant="outline" size="icon" className="h-12 w-12 border-2">
                    <Upload className="w-5 h-5" />
                  </Button>
                </div>
                {content.hero.backgroundImage && (
                  <div className="mt-3 rounded-lg overflow-hidden border-2 border-gray-200">
                    <img
                      src={content.hero.backgroundImage}
                      alt="Hero background preview"
                      className="w-full h-48 object-cover"
                    />
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="hero-cta" className="text-base font-semibold">CTA Button Text</Label>
                <Input
                  id="hero-cta"
                  value={content.hero.ctaText}
                  onChange={(e) => setContent({
                    ...content,
                    hero: { ...content.hero, ctaText: e.target.value }
                  })}
                  className="h-12 border-2"
                  placeholder="Start Planning"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Features Section */}
        <TabsContent value="features" className="space-y-6">
          <Card className="border-2">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Star className="w-6 h-6 text-blue-600" />
                  Features ({content.features.length})
                </CardTitle>
                <Button onClick={addFeature} size="sm" className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="mr-2 w-4 h-4" />
                  Add Feature
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {content.features.map((feature, index) => (
                  <Card key={feature.id} className="border-2 hover:border-blue-300 transition-colors">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="text-4xl">{feature.icon}</div>
                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => moveFeature(index, 'up')}
                            disabled={index === 0}
                            className="h-8 w-8"
                          >
                            <ChevronUp className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => moveFeature(index, 'down')}
                            disabled={index === content.features.length - 1}
                            className="h-8 w-8"
                          >
                            <ChevronDown className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setEditingFeature(feature)}
                            className="h-8 w-8 hover:bg-blue-100"
                          >
                            <Edit2 className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => deleteFeature(feature.id)}
                            className="h-8 w-8 hover:bg-red-100 hover:text-red-600"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                      <h4 className="font-bold text-lg mb-2">{feature.title}</h4>
                      <p className="text-gray-600 text-sm">{feature.description}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Benefits Section */}
        <TabsContent value="benefits" className="space-y-6">
          <Card className="border-2">
            <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <ImageIcon className="w-6 h-6 text-purple-600" />
                  Benefits ({content.benefits.length})
                </CardTitle>
                <Button onClick={addBenefit} size="sm" className="bg-purple-600 hover:bg-purple-700">
                  <Plus className="mr-2 w-4 h-4" />
                  Add Benefit
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              {content.benefits.map((benefit, index) => (
                <Card key={benefit.id} className="border-2 hover:border-purple-300 transition-colors">
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row gap-6">
                      <div className="md:w-1/3">
                        <img
                          src={benefit.image}
                          alt={benefit.title}
                          className="w-full h-48 object-cover rounded-lg border-2 border-gray-200"
                        />
                        <Input
                          value={benefit.image}
                          onChange={(e) => updateBenefit(benefit.id, { image: e.target.value })}
                          placeholder="Image URL"
                          className="mt-3 h-10 text-sm border-2"
                        />
                      </div>
                      <div className="md:w-2/3 space-y-4">
                        <div className="flex items-start justify-between">
                          <Input
                            value={benefit.title}
                            onChange={(e) => updateBenefit(benefit.id, { title: e.target.value })}
                            className="text-xl font-bold h-12 border-2"
                            placeholder="Benefit Title"
                          />
                          <div className="flex gap-2 ml-3">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => moveBenefit(index, 'up')}
                              disabled={index === 0}
                            >
                              <ChevronUp className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => moveBenefit(index, 'down')}
                              disabled={index === content.benefits.length - 1}
                            >
                              <ChevronDown className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => deleteBenefit(benefit.id)}
                              className="hover:bg-red-100 hover:text-red-600"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                        <Textarea
                          value={benefit.description}
                          onChange={(e) => updateBenefit(benefit.id, { description: e.target.value })}
                          rows={4}
                          className="border-2"
                          placeholder="Benefit Description"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Testimonials Section */}
        <TabsContent value="testimonials" className="space-y-6">
          <Card className="border-2">
            <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="w-6 h-6 text-green-600" />
                  Testimonials ({content.testimonials.length})
                </CardTitle>
                <Button onClick={addTestimonial} size="sm" className="bg-green-600 hover:bg-green-700">
                  <Plus className="mr-2 w-4 h-4" />
                  Add Testimonial
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              {content.testimonials.map((testimonial) => (
                <Card key={testimonial.id} className="border-2 hover:border-green-300 transition-colors">
                  <CardContent className="p-6">
                    <div className="flex gap-6">
                      <div className="flex-shrink-0">
                        <img
                          src={testimonial.avatar}
                          alt={testimonial.name}
                          className="w-20 h-20 rounded-full border-2 border-gray-200"
                        />
                        <Input
                          value={testimonial.avatar}
                          onChange={(e) => updateTestimonial(testimonial.id, { avatar: e.target.value })}
                          placeholder="Avatar URL"
                          className="mt-2 h-10 text-xs border-2"
                        />
                      </div>

                      <div className="flex-1 space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <Input
                            value={testimonial.name}
                            onChange={(e) => updateTestimonial(testimonial.id, { name: e.target.value })}
                            placeholder="Customer Name"
                            className="h-10 border-2"
                          />
                          <Input
                            value={testimonial.location}
                            onChange={(e) => updateTestimonial(testimonial.id, { location: e.target.value })}
                            placeholder="Location"
                            className="h-10 border-2"
                          />
                        </div>

                        <Textarea
                          value={testimonial.text}
                          onChange={(e) => updateTestimonial(testimonial.id, { text: e.target.value })}
                          rows={3}
                          placeholder="Testimonial text"
                          className="border-2"
                        />

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Label>Rating:</Label>
                            <div className="flex gap-1">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                  key={star}
                                  onClick={() => updateTestimonial(testimonial.id, { rating: star })}
                                  className="transition-transform hover:scale-125"
                                >
                                  <Star
                                    className={`w-6 h-6 ${star <= testimonial.rating ? 'text-amber-500 fill-current' : 'text-gray-300'}`}
                                  />
                                </button>
                              ))}
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => deleteTestimonial(testimonial.id)}
                            className="hover:bg-red-100 hover:text-red-600"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Form Configuration */}
        <TabsContent value="form" className="space-y-6">
          <Card className="border-2">
            <CardHeader className="bg-gradient-to-r from-orange-50 to-red-50">
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-6 h-6 text-orange-600" />
                Form Configuration
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-8">
              {/* Custom Questions */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold">Custom Questions</h3>
                  <Button onClick={addCustomQuestion} size="sm" className="bg-orange-600 hover:bg-orange-700">
                    <Plus className="mr-2 w-4 h-4" />
                    Add Question
                  </Button>
                </div>

                <div className="space-y-4">
                  {content.formConfig.customQuestions.map((question) => (
                    <Card key={question.id} className="border-2 hover:border-orange-300 transition-colors">
                      <CardContent className="p-4">
                        <div className="space-y-4">
                          <div className="flex gap-3">
                            <Input
                              value={question.question}
                              onChange={(e) => updateCustomQuestion(question.id, { question: e.target.value })}
                              placeholder="Question text"
                              className="flex-1 h-10 border-2"
                            />
                            <Select
                              value={question.type}
                              onValueChange={(value) => updateCustomQuestion(question.id, { type: value })}
                            >
                              <SelectTrigger className="w-[150px] h-10 border-2">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="text">Text</SelectItem>
                                <SelectItem value="textarea">Textarea</SelectItem>
                                <SelectItem value="select">Select</SelectItem>
                                <SelectItem value="multiselect">Multi-select</SelectItem>
                              </SelectContent>
                            </Select>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => deleteCustomQuestion(question.id)}
                              className="hover:bg-red-100 hover:text-red-600 h-10 w-10"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>

                          <div className="flex items-center gap-6">
                            <div className="flex items-center gap-2">
                              <Checkbox
                                id={`required-${question.id}`}
                                checked={question.required}
                                onCheckedChange={(checked) =>
                                  updateCustomQuestion(question.id, { required: checked })
                                }
                              />
                              <Label htmlFor={`required-${question.id}`} className="cursor-pointer">
                                Required
                              </Label>
                            </div>

                            {(question.type === 'select' || question.type === 'multiselect') && (
                              <div className="flex-1">
                                <Input
                                  value={question.options?.join(', ') || ''}
                                  onChange={(e) => updateCustomQuestion(question.id, {
                                    options: e.target.value.split(',').map(o => o.trim()).filter(Boolean)
                                  })}
                                  placeholder="Options (comma separated)"
                                  className="h-10 border-2"
                                />
                              </div>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}

                  {content.formConfig.customQuestions.length === 0 && (
                    <div className="text-center py-12 text-gray-400">
                      <FileText className="w-16 h-16 mx-auto mb-4 opacity-30" />
                      <p>No custom questions yet. Click "Add Question" to create one.</p>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Contact Section */}
        <TabsContent value="contact" className="space-y-6">
          <Card className="border-2">
            <CardHeader className="bg-gradient-to-r from-cyan-50 to-blue-50">
              <CardTitle className="flex items-center gap-2">
                <Phone className="w-6 h-6 text-cyan-600" />
                Contact Information
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="contact-phone" className="text-base font-semibold flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    Phone Number
                  </Label>
                  <Input
                    id="contact-phone"
                    value={content.contact.phone}
                    onChange={(e) => setContent({
                      ...content,
                      contact: { ...content.contact, phone: e.target.value }
                    })}
                    className="h-12 border-2"
                    placeholder="+94 7777 21 999"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contact-email" className="text-base font-semibold flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    Email Address
                  </Label>
                  <Input
                    id="contact-email"
                    type="email"
                    value={content.contact.email}
                    onChange={(e) => setContent({
                      ...content,
                      contact: { ...content.contact, email: e.target.value }
                    })}
                    className="h-12 border-2"
                    placeholder="custom@rechargetravels.com"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contact-whatsapp" className="text-base font-semibold flex items-center gap-2">
                    <MessageSquare className="w-4 h-4" />
                    WhatsApp Number
                  </Label>
                  <Input
                    id="contact-whatsapp"
                    value={content.contact.whatsapp}
                    onChange={(e) => setContent({
                      ...content,
                      contact: { ...content.contact, whatsapp: e.target.value }
                    })}
                    className="h-12 border-2"
                    placeholder="94777721999"
                  />
                  <p className="text-xs text-gray-500">Enter without + or spaces</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contact-availability" className="text-base font-semibold flex items-center gap-2">
                    <Globe className="w-4 h-4" />
                    Availability
                  </Label>
                  <Input
                    id="contact-availability"
                    value={content.contact.availability}
                    onChange={(e) => setContent({
                      ...content,
                      contact: { ...content.contact, availability: e.target.value }
                    })}
                    className="h-12 border-2"
                    placeholder="Available 24/7"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* SEO Section */}
        <TabsContent value="seo" className="space-y-6">
          <Card className="border-2">
            <CardHeader className="bg-gradient-to-r from-indigo-50 to-purple-50">
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-6 h-6 text-indigo-600" />
                SEO Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="space-y-2">
                <Label htmlFor="seo-title" className="text-base font-semibold">Page Title</Label>
                <Input
                  id="seo-title"
                  value={content.seo.title}
                  onChange={(e) => setContent({
                    ...content,
                    seo: { ...content.seo, title: e.target.value }
                  })}
                  className="h-12 border-2"
                  placeholder="Custom Sri Lanka Travel Experiences | Recharge Travels"
                />
                <p className="text-xs text-gray-500">Recommended: 50-60 characters</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="seo-description" className="text-base font-semibold">Meta Description</Label>
                <Textarea
                  id="seo-description"
                  value={content.seo.description}
                  onChange={(e) => setContent({
                    ...content,
                    seo: { ...content.seo, description: e.target.value }
                  })}
                  rows={3}
                  className="border-2"
                  placeholder="Design your perfect Sri Lankan adventure..."
                />
                <p className="text-xs text-gray-500">Recommended: 150-160 characters</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="seo-keywords" className="text-base font-semibold">Keywords</Label>
                <Textarea
                  id="seo-keywords"
                  value={content.seo.keywords.join(', ')}
                  onChange={(e) => setContent({
                    ...content,
                    seo: {
                      ...content.seo,
                      keywords: e.target.value.split(',').map(k => k.trim()).filter(Boolean)
                    }
                  })}
                  rows={3}
                  className="border-2"
                  placeholder="custom sri lanka tours, bespoke travel sri lanka..."
                />
                <p className="text-xs text-gray-500">Separate keywords with commas</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Feature Editor Modal */}
      <Dialog open={!!editingFeature} onOpenChange={(open) => !open && setEditingFeature(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Feature</DialogTitle>
          </DialogHeader>
          {editingFeature && (
            <div className="space-y-6">
              <div className="space-y-2">
                <Label>Icon (Emoji)</Label>
                <Input
                  value={editingFeature.icon}
                  onChange={(e) => setEditingFeature({ ...editingFeature, icon: e.target.value })}
                  className="text-4xl h-16 text-center border-2"
                  placeholder="✨"
                />
              </div>

              <div className="space-y-2">
                <Label>Title</Label>
                <Input
                  value={editingFeature.title}
                  onChange={(e) => setEditingFeature({ ...editingFeature, title: e.target.value })}
                  className="h-12 border-2"
                />
              </div>

              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea
                  value={editingFeature.description}
                  onChange={(e) => setEditingFeature({ ...editingFeature, description: e.target.value })}
                  rows={3}
                  className="border-2"
                />
              </div>

              <div className="flex justify-end gap-3">
                <Button variant="outline" onClick={() => setEditingFeature(null)}>
                  Cancel
                </Button>
                <Button
                  onClick={() => {
                    updateFeature(editingFeature.id, editingFeature);
                    setEditingFeature(null);
                    toast.success('Feature updated');
                  }}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  Save Changes
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Save Button Fixed at Bottom */}
      <motion.div
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        className="fixed bottom-6 right-6 z-50"
      >
        <Button
          onClick={saveContent}
          disabled={saving}
          size="lg"
          className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-2xl hover:shadow-blue-500/50 px-8 py-6 rounded-full"
        >
          {saving ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
              Saving...
            </>
          ) : (
            <>
              <Save className="mr-2 w-5 h-5" />
              Save All Changes
            </>
          )}
        </Button>
      </motion.div>
    </div>
  );
};

export default CustomExperienceSection;
