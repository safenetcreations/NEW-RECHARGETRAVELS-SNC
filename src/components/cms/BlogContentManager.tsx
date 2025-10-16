
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Sparkles, 
  FileText, 
  Calendar, 
  Eye,
  Edit,
  Trash2,
  Plus,
  Loader2
} from 'lucide-react';
import { useBlogPosts, useBlogCategories, useGenerateContent } from '@/hooks/useBlog';
import { toast } from 'sonner';

export const BlogContentManager = () => {
  const [topic, setTopic] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [keywords, setKeywords] = useState('');
  const [autoPublish, setAutoPublish] = useState(false);
  const [activeTab, setActiveTab] = useState('generator');

  const { data: blogPosts, isLoading: postsLoading } = useBlogPosts();
  const { data: categories, isLoading: categoriesLoading } = useBlogCategories();
  const generateContent = useGenerateContent();

  const handleGenerateContent = async () => {
    if (!topic.trim()) {
      toast.error('Please enter a topic');
      return;
    }

    if (!selectedCategory) {
      toast.error('Please select a category');
      return;
    }

    const keywordArray = keywords.split(',').map(k => k.trim()).filter(k => k);
    
    try {
      await generateContent.mutateAsync({
        topic: topic.trim(),
        categoryId: selectedCategory,
        keywords: keywordArray,
        autoPublish
      });
      
      toast.success('Content generated successfully!');
      setTopic('');
      setKeywords('');
      setSelectedCategory('');
      setAutoPublish(false);
    } catch (error) {
      toast.error('Failed to generate content');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Blog Content Manager</h2>
          <p className="text-muted-foreground">
            Generate AI-powered blog content and manage your articles
          </p>
        </div>
        <Badge variant="secondary" className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
          <Sparkles className="w-4 h-4 mr-1" />
          AI Powered
        </Badge>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="generator">AI Generator</TabsTrigger>
          <TabsTrigger value="articles">Articles</TabsTrigger>
          <TabsTrigger value="calendar">Content Calendar</TabsTrigger>
        </TabsList>

        <TabsContent value="generator" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="w-5 h-5" />
                AI Content Generator
              </CardTitle>
              <CardDescription>
                Generate high-quality, SEO-optimized blog posts about Sri Lankan travel destinations
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="topic">Topic</Label>
                <Input
                  id="topic"
                  placeholder="e.g., Best beaches in Mirissa, Sigiriya Rock Fortress guide"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories?.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="keywords">Keywords (comma-separated)</Label>
                <Textarea
                  id="keywords"
                  placeholder="e.g., Sri Lanka beaches, Mirissa whales, beach activities"
                  value={keywords}
                  onChange={(e) => setKeywords(e.target.value)}
                  rows={3}
                />
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="auto-publish"
                  checked={autoPublish}
                  onCheckedChange={setAutoPublish}
                />
                <Label htmlFor="auto-publish">Auto-publish when generated</Label>
              </div>

              <Button 
                onClick={handleGenerateContent}
                disabled={generateContent.isPending || !topic.trim() || !selectedCategory}
                className="w-full"
              >
                {generateContent.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Generating Content...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 mr-2" />
                    Generate Blog Post
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>How It Works</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm font-medium">1</div>
                <div>
                  <h4 className="font-medium">AI Analysis</h4>
                  <p className="text-sm text-muted-foreground">Google Gemini analyzes your topic and keywords</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm font-medium">2</div>
                <div>
                  <h4 className="font-medium">Content Generation</h4>
                  <p className="text-sm text-muted-foreground">Creates SEO-optimized content tailored for Sri Lankan travel</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm font-medium">3</div>
                <div>
                  <h4 className="font-medium">Auto-Publishing</h4>
                  <p className="text-sm text-muted-foreground">Optionally publishes and schedules social media posts</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="articles" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Blog Articles
                </div>
                <Button size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  New Article
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {postsLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="w-6 h-6 animate-spin" />
                </div>
              ) : (
                <div className="space-y-4">
                  {blogPosts?.map((post) => (
                    <div key={post.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-semibold text-foreground">{post.title}</h3>
                          <p className="text-sm text-muted-foreground mt-1">{post.excerpt}</p>
                          <div className="flex items-center gap-4 mt-2">
                            <Badge variant="outline">{post.category?.name}</Badge>
                            <span className="text-xs text-muted-foreground">
                              {post.published_at ? new Date(post.published_at).toLocaleDateString() : 'Draft'}
                            </span>
                            {post.reading_time && (
                              <span className="text-xs text-muted-foreground">
                                {post.reading_time} min read
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button size="sm" variant="outline">
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button size="sm" variant="outline">
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button size="sm" variant="outline">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="calendar" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Content Calendar
              </CardTitle>
              <CardDescription>
                Plan and schedule your blog content generation
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Calendar className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="font-semibold mb-2">Content Calendar Coming Soon</h3>
                <p className="text-sm text-muted-foreground">
                  Schedule content generation, plan editorial calendar, and manage publishing dates
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
