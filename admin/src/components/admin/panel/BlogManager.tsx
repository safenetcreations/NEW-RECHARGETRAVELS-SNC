import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  PlusCircle,
  Search,
  Edit,
  Trash2,
  Eye,
  Sparkles,
  RefreshCw,
  Save,
  X,
  CheckCircle,
  Loader2,
  ImageIcon,
  ExternalLink,
  FileText,
  Upload
} from 'lucide-react';
import { getDocs, collection, deleteDoc, doc, setDoc, updateDoc, Timestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '@/services/firebaseService';
import { useToast } from '@/components/ui/use-toast';
import { getAIService } from '@/services/ai/aiProviderFactory';

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  featuredImage?: string;
  category: {
    id: string;
    name: string;
  };
  author: {
    name: string;
  };
  status: 'draft' | 'published';
  publishedAt?: any;
  createdAt: any;
  readingTime: number;
  viewCount: number;
  aiGenerated: boolean;
  seo?: {
    metaTitle: string;
    metaDescription: string;
    keywords: string[];
  };
}

interface BlogCategory {
  id: string;
  name: string;
}

interface BlogManagerProps {
  onNavigate?: (section: string, params?: Record<string, string>) => void;
}

const BLOG_CATEGORIES: BlogCategory[] = [
  { id: 'travel-tips', name: 'Travel Tips' },
  { id: 'destinations', name: 'Destinations' },
  { id: 'culture', name: 'Culture & Heritage' },
  { id: 'wildlife', name: 'Wildlife & Nature' },
  { id: 'adventure', name: 'Adventure' },
  { id: 'food', name: 'Food & Cuisine' },
  { id: 'beaches', name: 'Beaches' },
  { id: 'ayurveda', name: 'Ayurveda & Wellness' },
];

const BlogManager: React.FC<BlogManagerProps> = ({ onNavigate }) => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const { toast } = useToast();

  // Editor state
  const [showEditor, setShowEditor] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [saving, setSaving] = useState(false);

  // Form fields
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [content, setContent] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [featuredImage, setFeaturedImage] = useState('');
  const [categoryId, setCategoryId] = useState('travel-tips');
  const [authorName, setAuthorName] = useState('Recharge Travels');
  const [metaTitle, setMetaTitle] = useState('');
  const [metaDescription, setMetaDescription] = useState('');
  const [keywords, setKeywords] = useState('');

  // AI Generator state
  const [showAIGenerator, setShowAIGenerator] = useState(false);
  const [aiTopic, setAiTopic] = useState('');
  const [aiProvider, setAiProvider] = useState<'gemini' | 'openai'>('gemini');
  const [aiGenerating, setAiGenerating] = useState(false);

  // Image upload state
  const [imageUploading, setImageUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchPosts();
  }, []);

  // Image upload handler - No size limit, Firebase handles large files
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const fileSizeMB = (file.size / 1024 / 1024).toFixed(2);
    console.log('File selected:', file.name, 'Size:', fileSizeMB, 'MB', 'Type:', file.type);

    // Only validate file type
    if (!file.type.startsWith('image/')) {
      toast({ title: 'Please select an image file', variant: 'destructive' });
      return;
    }

    setImageUploading(true);
    toast({ title: `Uploading ${fileSizeMB}MB image...` });

    try {
      const fileName = `blog-images/${Date.now()}_${file.name.replace(/[^a-zA-Z0-9.]/g, '_')}`;
      const storageRef = ref(storage, fileName);

      console.log('Uploading to:', fileName);
      await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(storageRef);
      console.log('Upload successful, URL:', downloadURL);

      setFeaturedImage(downloadURL);
      toast({ title: 'Image uploaded successfully!' });
    } catch (error: any) {
      console.error('Image upload error:', error);
      toast({ title: `Upload failed: ${error.message}`, variant: 'destructive' });
    } finally {
      setImageUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  // Auto-generate slug from title
  useEffect(() => {
    if (title && !editingPost) {
      const generatedSlug = title
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-')
        .trim();
      setSlug(generatedSlug);
    }
  }, [title, editingPost]);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const snapshot = await getDocs(collection(db, 'blogs'));
      const data = snapshot.docs.map(docSnap => ({
        id: docSnap.id,
        ...docSnap.data()
      })) as BlogPost[];

      // Sort by createdAt on client side with safe date handling
      data.sort((a, b) => {
        try {
          const getTime = (val: any): number => {
            if (!val) return 0;
            if (val.toDate) return val.toDate().getTime();
            if (val.seconds) return val.seconds * 1000;
            const d = new Date(val);
            return isNaN(d.getTime()) ? 0 : d.getTime();
          };
          return getTime(b.createdAt) - getTime(a.createdAt);
        } catch {
          return 0;
        }
      });

      setPosts(data);
    } catch (error) {
      console.error('Error fetching blog posts:', error);
      // Don't show error toast if collection is just empty
      setPosts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this blog post?')) {
      try {
        await deleteDoc(doc(db, 'blogs', id));
        setPosts(posts.filter(post => post.id !== id));
        toast({ title: 'Blog post deleted successfully' });
      } catch (error) {
        console.error('Error deleting post:', error);
        toast({ title: 'Error deleting post', variant: 'destructive' });
      }
    }
  };

  const resetForm = () => {
    setTitle('');
    setSlug('');
    setContent('');
    setExcerpt('');
    setFeaturedImage('');
    setCategoryId('travel-tips');
    setAuthorName('Recharge Travels');
    setMetaTitle('');
    setMetaDescription('');
    setKeywords('');
    setEditingPost(null);
  };

  const openNewPost = () => {
    resetForm();
    setShowEditor(true);
  };

  const openEditPost = (post: BlogPost) => {
    setEditingPost(post);
    setTitle(post.title || '');
    setSlug(post.slug || '');
    setContent(post.content || '');
    setExcerpt(post.excerpt || '');
    setFeaturedImage(post.featuredImage || '');
    setCategoryId(post.category?.id || 'travel-tips');
    setAuthorName(post.author?.name || 'Recharge Travels');
    setMetaTitle(post.seo?.metaTitle || '');
    setMetaDescription(post.seo?.metaDescription || '');
    setKeywords(post.seo?.keywords?.join(', ') || '');
    setShowEditor(true);
  };

  const calculateReadingTime = (text: string): number => {
    const wordCount = text.split(/\s+/).filter(w => w).length;
    return Math.ceil(wordCount / 200);
  };

  const handleSave = async (publishStatus: 'draft' | 'published') => {
    if (!title.trim()) {
      toast({ title: 'Please enter a title', variant: 'destructive' });
      return;
    }
    if (!content.trim()) {
      toast({ title: 'Please enter content', variant: 'destructive' });
      return;
    }

    setSaving(true);
    const selectedCategory = BLOG_CATEGORIES.find(c => c.id === categoryId);

    const postData: any = {
      title,
      slug: slug || title.toLowerCase().replace(/\s+/g, '-'),
      // Save content in both formats for compatibility
      content,
      body_md: content, // For BlogPost page which uses body_md
      excerpt: excerpt || content.slice(0, 200),
      // Save image in both formats for compatibility
      featuredImage,
      featured_image: featuredImage, // For BlogPost page which uses featured_image
      category: selectedCategory ? { id: selectedCategory.id, name: selectedCategory.name } : { id: 'travel-tips', name: 'Travel Tips' },
      author: { name: authorName },
      status: publishStatus,
      // Save reading time in both formats
      readingTime: calculateReadingTime(content),
      reading_time: calculateReadingTime(content),
      viewCount: editingPost?.viewCount || 0,
      aiGenerated: editingPost?.aiGenerated || false,
      seo: {
        metaTitle: metaTitle || title.slice(0, 60),
        metaDescription: metaDescription || excerpt?.slice(0, 160) || content.slice(0, 160),
        keywords: keywords.split(',').map(k => k.trim()).filter(k => k)
      },
      updatedAt: Timestamp.now(),
      updated_at: new Date().toISOString()
    };

    try {
      if (editingPost) {
        await updateDoc(doc(db, 'blogs', editingPost.id), postData);
        toast({ title: `Post ${publishStatus === 'published' ? 'published' : 'saved'} successfully!` });
      } else {
        const newPostId = `post_${Date.now()}`;
        const now = new Date();
        await setDoc(doc(db, 'blogs', newPostId), {
          ...postData,
          createdAt: Timestamp.now(),
          created_at: now.toISOString(),
          publishedAt: publishStatus === 'published' ? Timestamp.now() : null,
          published_at: publishStatus === 'published' ? now.toISOString() : null
        });
        toast({ title: `Post ${publishStatus === 'published' ? 'published' : 'created'} successfully!` });
      }

      setShowEditor(false);
      resetForm();
      fetchPosts();
    } catch (error) {
      console.error('Error saving post:', error);
      toast({ title: 'Error saving post', variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  // AI Content Generation
  const handleAIGenerate = async () => {
    if (!aiTopic.trim()) {
      toast({ title: 'Please enter a topic', variant: 'destructive' });
      return;
    }

    setAiGenerating(true);
    try {
      const aiService = getAIService(aiProvider);
      const response = await aiService.generateContent({
        topic: aiTopic,
        contentType: 'blog',
        tone: 'informative',
        targetWordCount: 1500,
        keywords: aiTopic.split(' ').slice(0, 5),
        category: 'Travel'
      });

      // Fill form with AI-generated content
      setTitle(response.title);
      setSlug(response.slug || response.title.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-'));
      setContent(response.content);
      setExcerpt(response.excerpt);
      setMetaTitle(response.metaTitle);
      setMetaDescription(response.metaDescription);
      setKeywords(response.keywords.join(', '));

      setShowAIGenerator(false);
      setShowEditor(true);
      toast({ title: 'AI content generated successfully!' });
    } catch (error: any) {
      console.error('AI generation error:', error);
      toast({ title: `AI generation failed: ${error.message}`, variant: 'destructive' });
    } finally {
      setAiGenerating(false);
    }
  };

  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.author?.name?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || post.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const formatDate = (date: any) => {
    if (!date) return 'N/A';
    try {
      let d: Date;
      if (date.toDate) {
        d = date.toDate();
      } else if (date.seconds) {
        d = new Date(date.seconds * 1000);
      } else {
        d = new Date(date);
      }
      if (isNaN(d.getTime())) return 'N/A';
      return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
    } catch {
      return 'N/A';
    }
  };

  return (
    <div className="space-y-6 bg-white min-h-screen p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Blog Manager</h2>
          <p className="text-sm text-gray-500">Manage your blog posts with AI-powered content generation</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => setShowAIGenerator(true)}
            className="border-purple-300 text-purple-700 hover:bg-purple-50"
          >
            <Sparkles className="w-4 h-4 mr-2" />
            AI Generate
          </Button>
          <Button onClick={openNewPost} className="bg-blue-600 hover:bg-blue-700 text-white">
            <PlusCircle className="w-4 h-4 mr-2" />
            New Post
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card className="bg-gray-50 border-gray-200">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search posts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-white"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[160px] bg-white">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="published">Published</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" onClick={fetchPosts} className="bg-white">
              <RefreshCw className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-white border-gray-200">
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-gray-900">{posts.length}</div>
            <p className="text-sm text-gray-500">Total Posts</p>
          </CardContent>
        </Card>
        <Card className="bg-white border-gray-200">
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-green-600">
              {posts.filter(p => p.status === 'published').length}
            </div>
            <p className="text-sm text-gray-500">Published</p>
          </CardContent>
        </Card>
        <Card className="bg-white border-gray-200">
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-amber-600">
              {posts.filter(p => p.status === 'draft').length}
            </div>
            <p className="text-sm text-gray-500">Drafts</p>
          </CardContent>
        </Card>
        <Card className="bg-white border-gray-200">
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-purple-600">
              {posts.filter(p => p.aiGenerated).length}
            </div>
            <p className="text-sm text-gray-500">AI Generated</p>
          </CardContent>
        </Card>
      </div>

      {/* Posts Table */}
      <Card className="bg-white border-gray-200">
        <CardHeader>
          <CardTitle className="text-gray-900">Blog Posts ({filteredPosts.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[350px]">Title</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-gray-400" />
                    <span className="text-gray-500">Loading posts...</span>
                  </TableCell>
                </TableRow>
              ) : filteredPosts.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8">
                    <FileText className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                    <p className="text-gray-500">No posts found</p>
                    <Button variant="link" onClick={openNewPost} className="mt-2 text-blue-600">
                      Create your first post
                    </Button>
                  </TableCell>
                </TableRow>
              ) : (
                filteredPosts.map(post => (
                  <TableRow key={post.id} className="hover:bg-gray-50">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        {post.featuredImage ? (
                          <img src={post.featuredImage} alt="" className="w-12 h-8 object-cover rounded" />
                        ) : (
                          <div className="w-12 h-8 bg-gray-100 rounded flex items-center justify-center">
                            <ImageIcon className="w-4 h-4 text-gray-400" />
                          </div>
                        )}
                        <div>
                          <div className="font-medium text-gray-900 flex items-center gap-2">
                            {post.title}
                            {post.aiGenerated && <Sparkles className="w-3 h-3 text-purple-500" />}
                          </div>
                          <div className="text-sm text-gray-500">{post.readingTime || 5} min read</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-gray-600 border-gray-300">
                        {post.category?.name || 'Uncategorized'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={post.status === 'published' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}>
                        {post.status === 'published' ? 'Published' : 'Draft'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-gray-600">{formatDate(post.publishedAt || post.createdAt)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => window.open(`https://rechargetravels.com/blog/${post.slug}`, '_blank')}
                          className="text-gray-500 hover:text-gray-700"
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openEditPost(post)}
                          className="text-blue-500 hover:text-blue-700"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(post.id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* AI Generator Dialog */}
      <Dialog open={showAIGenerator} onOpenChange={setShowAIGenerator}>
        <DialogContent className="sm:max-w-[500px] bg-white">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-gray-900">
              <Sparkles className="w-5 h-5 text-purple-500" />
              AI Content Generator
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label className="text-gray-700">AI Provider</Label>
              <Select value={aiProvider} onValueChange={(v: any) => setAiProvider(v)}>
                <SelectTrigger className="bg-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="gemini">Gemini 2.0 Flash</SelectItem>
                  <SelectItem value="openai">OpenAI GPT-5.1</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-gray-700">Blog Topic *</Label>
              <Textarea
                value={aiTopic}
                onChange={(e) => setAiTopic(e.target.value)}
                placeholder="e.g., Best beaches in Sri Lanka for 2024, Top wildlife safari experiences, Ayurveda retreat guide..."
                rows={3}
                className="bg-white"
              />
              <p className="text-xs text-gray-500">
                Enter a specific topic about Sri Lanka travel. The AI will generate a full SEO-optimized blog post.
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAIGenerator(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleAIGenerate}
              disabled={aiGenerating || !aiTopic.trim()}
              className="bg-purple-600 hover:bg-purple-700 text-white"
            >
              {aiGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2" />
                  Generate Content
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Blog Editor Dialog */}
      <Dialog open={showEditor} onOpenChange={setShowEditor}>
        <DialogContent className="sm:max-w-[900px] max-h-[90vh] overflow-y-auto bg-white">
          <DialogHeader>
            <DialogTitle className="text-gray-900">
              {editingPost ? 'Edit Blog Post' : 'Create New Blog Post'}
            </DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 py-4">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-4">
              <div className="space-y-2">
                <Label className="text-gray-700">Title *</Label>
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter post title..."
                  className="text-lg font-medium bg-white text-gray-900 border-gray-300"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-gray-700">URL Slug</Label>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500">/blog/</span>
                  <Input
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    placeholder="url-slug"
                    className="bg-white text-gray-900 border-gray-300"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-gray-700">Excerpt</Label>
                <Textarea
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                  placeholder="Brief description of the post..."
                  rows={2}
                  className="bg-white text-gray-900 border-gray-300"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-gray-700">Content (Markdown) *</Label>
                <Textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Write your blog post content in Markdown format...

## Heading 2
### Heading 3

- Bullet point
- Another bullet

**Bold text** and *italic text*

> Blockquote

1. Numbered list
2. Another item"
                  rows={15}
                  className="font-mono text-sm bg-white text-gray-900 border-gray-300"
                />
                <p className="text-xs text-gray-500">
                  Supports Markdown: ## headings, **bold**, *italic*, - bullets, &gt; quotes
                </p>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-4">
              {/* Featured Image */}
              <div className="space-y-2">
                <Label className="text-gray-700">Featured Image</Label>
                {featuredImage ? (
                  <div className="relative">
                    <img src={featuredImage} alt="Featured" className="w-full h-32 object-cover rounded-lg" />
                    <Button
                      variant="destructive"
                      size="sm"
                      className="absolute top-2 right-2"
                      onClick={() => setFeaturedImage('')}
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-gray-200 rounded-lg p-4 text-center">
                    <ImageIcon className="w-6 h-6 mx-auto mb-2 text-gray-400" />
                    <p className="text-xs text-gray-500">No image</p>
                  </div>
                )}

                {/* Upload Button */}
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageUpload}
                  accept="image/*"
                  className="hidden"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={imageUploading}
                  className="w-full border-blue-300 text-blue-700 hover:bg-blue-50"
                >
                  {imageUploading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Upload className="w-4 h-4 mr-2" />
                      Upload Image
                    </>
                  )}
                </Button>

                <div className="text-center text-xs text-gray-400">or</div>

                <Input
                  value={featuredImage}
                  onChange={(e) => setFeaturedImage(e.target.value)}
                  placeholder="Paste image URL here..."
                  className="text-sm bg-white text-gray-900"
                />
              </div>

              {/* Category */}
              <div className="space-y-2">
                <Label className="text-gray-700">Category</Label>
                <Select value={categoryId} onValueChange={setCategoryId}>
                  <SelectTrigger className="bg-white text-gray-900 border-gray-300">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {BLOG_CATEGORIES.map(cat => (
                      <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Author */}
              <div className="space-y-2">
                <Label className="text-gray-700">Author</Label>
                <Input
                  value={authorName}
                  onChange={(e) => setAuthorName(e.target.value)}
                  placeholder="Author name"
                  className="bg-white text-gray-900 border-gray-300"
                />
              </div>

              {/* SEO Fields */}
              <div className="border-t border-gray-200 pt-4 space-y-3">
                <Label className="text-gray-900 font-semibold">SEO Settings</Label>
                <div className="space-y-2">
                  <Label className="text-xs text-gray-600">Meta Title</Label>
                  <Input
                    value={metaTitle}
                    onChange={(e) => setMetaTitle(e.target.value)}
                    placeholder="SEO title (max 60 chars)"
                    maxLength={60}
                    className="text-sm bg-white text-gray-900 border-gray-300"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs text-gray-600">Meta Description</Label>
                  <Textarea
                    value={metaDescription}
                    onChange={(e) => setMetaDescription(e.target.value)}
                    placeholder="SEO description (max 160 chars)"
                    maxLength={160}
                    rows={2}
                    className="text-sm bg-white text-gray-900 border-gray-300"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs text-gray-600">Keywords</Label>
                  <Input
                    value={keywords}
                    onChange={(e) => setKeywords(e.target.value)}
                    placeholder="keyword1, keyword2, keyword3"
                    className="text-sm bg-white text-gray-900 border-gray-300"
                  />
                </div>
              </div>

              {/* Post Info */}
              <div className="border-t border-gray-200 pt-4 space-y-2 text-sm">
                <div className="flex justify-between text-gray-600">
                  <span>Reading Time:</span>
                  <span className="font-medium">{calculateReadingTime(content)} min</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Word Count:</span>
                  <span className="font-medium">{content.split(/\s+/).filter(w => w).length}</span>
                </div>
              </div>
            </div>
          </div>
          <DialogFooter className="border-t border-gray-200 pt-4">
            <Button variant="outline" onClick={() => setShowEditor(false)}>
              Cancel
            </Button>
            <Button
              variant="outline"
              onClick={() => handleSave('draft')}
              disabled={saving}
              className="border-amber-300 text-amber-700 hover:bg-amber-50"
            >
              {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
              Save Draft
            </Button>
            <Button
              onClick={() => handleSave('published')}
              disabled={saving}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <CheckCircle className="w-4 h-4 mr-2" />}
              Publish
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BlogManager;
