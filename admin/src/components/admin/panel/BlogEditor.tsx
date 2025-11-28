import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
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
  Save,
  Eye,
  ArrowLeft,
  Image as ImageIcon,
  Sparkles,
  Upload,
  Loader2,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import {
  getDocs,
  collection,
  query,
  orderBy,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  Timestamp
} from 'firebase/firestore';
import { db } from '@/services/firebaseService';
import { useToast } from '@/components/ui/use-toast';
import { GeminiToolbar } from '@/components/common/GeminiToolbar';
import { UniversalImageGenerator } from '@/components/common/UniversalImageGenerator';

interface BlogCategory {
  id: string;
  name: string;
  slug: string;
}

interface BlogEditorProps {
  postId?: string;
  onNavigate?: (section: string) => void;
}

const BlogEditor: React.FC<BlogEditorProps> = ({ postId, onNavigate }) => {
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [categories, setCategories] = useState<BlogCategory[]>([]);
  const { toast } = useToast();

  // Form state
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [content, setContent] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [featuredImage, setFeaturedImage] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [authorName, setAuthorName] = useState('Recharge Travels');
  const [status, setStatus] = useState<'draft' | 'published'>('draft');

  // SEO fields
  const [metaTitle, setMetaTitle] = useState('');
  const [metaDescription, setMetaDescription] = useState('');
  const [keywords, setKeywords] = useState<string[]>([]);
  const [keywordInput, setKeywordInput] = useState('');

  useEffect(() => {
    fetchCategories();
    if (postId) {
      fetchPost(postId);
    }
  }, [postId]);

  // Auto-generate slug from title
  useEffect(() => {
    if (!postId && title) {
      const generatedSlug = title
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-')
        .trim();
      setSlug(generatedSlug);
    }
  }, [title, postId]);

  const fetchCategories = async () => {
    try {
      const q = query(collection(db, 'blog_categories'), orderBy('name'));
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map(docSnap => ({
        id: docSnap.id,
        ...docSnap.data()
      })) as BlogCategory[];
      setCategories(data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchPost = async (id: string) => {
    setLoading(true);
    try {
      const docRef = doc(db, 'blogs', id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        setTitle(data.title || '');
        setSlug(data.slug || '');
        setContent(data.content || '');
        setExcerpt(data.excerpt || '');
        setFeaturedImage(data.featuredImage || '');
        setCategoryId(data.category?.id || '');
        setTags(data.tags || []);
        setAuthorName(data.author?.name || 'Recharge Travels');
        setStatus(data.status || 'draft');
        setMetaTitle(data.seo?.metaTitle || '');
        setMetaDescription(data.seo?.metaDescription || '');
        setKeywords(data.seo?.keywords || []);
      }
    } catch (error) {
      console.error('Error fetching post:', error);
      toast({ title: 'Error loading post', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const calculateReadingTime = (text: string): number => {
    const wordsPerMinute = 200;
    const wordCount = text.split(/\s+/).length;
    return Math.ceil(wordCount / wordsPerMinute);
  };

  const handleSave = async (publishStatus?: 'draft' | 'published') => {
    if (!title.trim()) {
      toast({ title: 'Please enter a title', variant: 'destructive' });
      return;
    }

    setSaving(true);
    const finalStatus = publishStatus || status;
    const selectedCategory = categories.find(c => c.id === categoryId);

    const postData = {
      title,
      slug,
      content,
      excerpt: excerpt || content.slice(0, 200),
      featuredImage,
      category: selectedCategory ? { id: selectedCategory.id, name: selectedCategory.name } : null,
      tags,
      author: { name: authorName },
      status: finalStatus,
      readingTime: calculateReadingTime(content),
      viewCount: 0,
      seo: {
        metaTitle: metaTitle || title.slice(0, 60),
        metaDescription: metaDescription || excerpt?.slice(0, 160) || content.slice(0, 160),
        keywords
      },
      aiGenerated: false,
      updatedAt: Timestamp.now()
    };

    try {
      if (postId) {
        await updateDoc(doc(db, 'blogs', postId), postData);
        toast({ title: 'Post updated successfully' });
      } else {
        const newPostId = `post_${Date.now()}`;
        await setDoc(doc(db, 'blogs', newPostId), {
          ...postData,
          createdAt: Timestamp.now(),
          publishedAt: finalStatus === 'published' ? Timestamp.now() : null
        });
        toast({ title: 'Post created successfully' });
      }

      if (finalStatus === 'published') {
        toast({ title: 'Post published!' });
      }
    } catch (error) {
      console.error('Error saving post:', error);
      toast({ title: 'Error saving post', variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tag: string) => {
    setTags(tags.filter(t => t !== tag));
  };

  const handleAddKeyword = () => {
    if (keywordInput.trim() && !keywords.includes(keywordInput.trim())) {
      setKeywords([...keywords, keywordInput.trim()]);
      setKeywordInput('');
    }
  };

  const handleRemoveKeyword = (keyword: string) => {
    setKeywords(keywords.filter(k => k !== keyword));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => onNavigate?.('blog-manager')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <h2 className="text-2xl font-bold">
            {postId ? 'Edit Blog Post' : 'Create New Blog Post'}
          </h2>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => handleSave('draft')}
            disabled={saving}
          >
            {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
            Save Draft
          </Button>
          <Button
            onClick={() => handleSave('published')}
            disabled={saving}
            className="bg-green-600 hover:bg-green-700"
          >
            {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <CheckCircle className="w-4 h-4 mr-2" />}
            Publish
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Content</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter post title..."
                  className="text-lg font-medium"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="slug">URL Slug</Label>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">/blog/</span>
                  <Input
                    id="slug"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    placeholder="url-slug"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="excerpt">Excerpt</Label>
                <Textarea
                  id="excerpt"
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                  placeholder="Brief description of the post..."
                  rows={3}
                />
              </div>

              {/* AI Tools for Excerpt */}
              {excerpt && (
                <GeminiToolbar
                  content={excerpt}
                  onContentUpdate={setExcerpt}
                  contentType="blog"
                  showImageButton={false}
                  className="mb-2"
                />
              )}

              <div className="space-y-2">
                <Label htmlFor="content">Content (Markdown)</Label>

                {/* AI Toolbar for Content */}
                {content && (
                  <GeminiToolbar
                    content={content}
                    onContentUpdate={setContent}
                    contentType="blog"
                    showImageButton={false}
                    className="mb-3"
                  />
                )}

                <Textarea
                  id="content"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Write your blog post content in Markdown..."
                  rows={20}
                  className="font-mono text-sm"
                />
                <p className="text-sm text-muted-foreground">
                  Supports Markdown formatting. Use ## for headings, **bold**, *italic*, etc.
                  <br />
                  <span className="text-purple-600 font-medium">✨ Use the AI assistant above to improve your content!</span>
                </p>
              </div>
            </CardContent>
          </Card>

          {/* SEO Settings */}
          <Card>
            <CardHeader>
              <CardTitle>SEO Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="metaTitle">Meta Title</Label>
                <Input
                  id="metaTitle"
                  value={metaTitle}
                  onChange={(e) => setMetaTitle(e.target.value)}
                  placeholder="SEO title (max 60 characters)"
                  maxLength={60}
                />
                <p className="text-sm text-muted-foreground">{metaTitle.length}/60 characters</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="metaDescription">Meta Description</Label>
                <Textarea
                  id="metaDescription"
                  value={metaDescription}
                  onChange={(e) => setMetaDescription(e.target.value)}
                  placeholder="SEO description (max 160 characters)"
                  maxLength={160}
                  rows={3}
                />
                <p className="text-sm text-muted-foreground">{metaDescription.length}/160 characters</p>
              </div>

              <div className="space-y-2">
                <Label>Keywords</Label>
                <div className="flex gap-2">
                  <Input
                    value={keywordInput}
                    onChange={(e) => setKeywordInput(e.target.value)}
                    placeholder="Add keyword"
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddKeyword())}
                  />
                  <Button type="button" variant="outline" onClick={handleAddKeyword}>
                    Add
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {keywords.map(keyword => (
                    <Badge
                      key={keyword}
                      variant="secondary"
                      className="cursor-pointer"
                      onClick={() => handleRemoveKeyword(keyword)}
                    >
                      {keyword} ×
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Featured Image */}
          <Card>
            <CardHeader>
              <CardTitle>Featured Image</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {featuredImage ? (
                <div className="relative">
                  <img
                    src={featuredImage}
                    alt="Featured"
                    className="w-full h-40 object-cover rounded-lg"
                  />
                  <Button
                    variant="destructive"
                    size="sm"
                    className="absolute top-2 right-2"
                    onClick={() => setFeaturedImage('')}
                  >
                    Remove
                  </Button>
                </div>
              ) : (
                <div className="border-2 border-dashed rounded-lg p-8 text-center">
                  <ImageIcon className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">No image selected</p>
                </div>
              )}

              {/* AI Image Generator */}
              <UniversalImageGenerator
                title={title || 'Blog Post'}
                description={excerpt || content.substring(0, 200)}
                onImageGenerated={setFeaturedImage}
                imageType="blog"
                suggestedPrompts={[
                  `${title} - professional blog header`,
                  'Sri Lanka travel blog image',
                  'Beautiful Sri Lankan landscape'
                ]}
              />

              <div className="relative">
                <Label className="text-xs text-muted-foreground">Or enter image URL manually:</Label>
                <Input
                  value={featuredImage}
                  onChange={(e) => setFeaturedImage(e.target.value)}
                  placeholder="Image URL..."
                  className="mt-1"
                />
              </div>
            </CardContent>
          </Card>

          {/* Category & Tags */}
          <Card>
            <CardHeader>
              <CardTitle>Category & Tags</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
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

              <div className="space-y-2">
                <Label>Tags</Label>
                <div className="flex gap-2">
                  <Input
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    placeholder="Add tag"
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                  />
                  <Button type="button" variant="outline" onClick={handleAddTag}>
                    Add
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {tags.map(tag => (
                    <Badge
                      key={tag}
                      variant="outline"
                      className="cursor-pointer"
                      onClick={() => handleRemoveTag(tag)}
                    >
                      {tag} ×
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Author */}
          <Card>
            <CardHeader>
              <CardTitle>Author</CardTitle>
            </CardHeader>
            <CardContent>
              <Input
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
                placeholder="Author name"
              />
            </CardContent>
          </Card>

          {/* Post Info */}
          <Card>
            <CardHeader>
              <CardTitle>Post Info</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Reading Time:</span>
                <span>{calculateReadingTime(content)} min</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Word Count:</span>
                <span>{content.split(/\s+/).filter(w => w).length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Status:</span>
                <Badge variant={status === 'published' ? 'default' : 'secondary'}>
                  {status}
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default BlogEditor;
