import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
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
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
  Sparkles,
  Filter,
  RefreshCw,
  ExternalLink
} from 'lucide-react';
import { getDocs, collection, query, orderBy, deleteDoc, doc, where } from 'firebase/firestore';
import { db } from '@/services/firebaseService';
import { useToast } from '@/components/ui/use-toast';

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt?: string;
  featuredImage?: string;
  category: {
    id: string;
    name: string;
  };
  author: {
    name: string;
    avatar?: string;
  };
  status: 'draft' | 'published' | 'scheduled';
  publishedAt?: string;
  createdAt: string;
  readingTime: number;
  viewCount: number;
  aiGenerated: boolean;
}

interface BlogCategory {
  id: string;
  name: string;
  postCount: number;
}

interface BlogManagerProps {
  onNavigate?: (section: string, params?: Record<string, string>) => void;
}

const BlogManager: React.FC<BlogManagerProps> = ({ onNavigate }) => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [categories, setCategories] = useState<BlogCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const { toast } = useToast();

  useEffect(() => {
    fetchPosts();
    fetchCategories();
  }, [statusFilter, categoryFilter]);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      let q = query(
        collection(db, 'blogs'),
        orderBy('createdAt', 'desc')
      );

      const snapshot = await getDocs(q);
      let data = snapshot.docs.map(docSnap => ({
        id: docSnap.id,
        ...docSnap.data()
      })) as BlogPost[];

      // Client-side filtering (Firestore has limitations on compound queries)
      if (statusFilter !== 'all') {
        data = data.filter(post => post.status === statusFilter);
      }
      if (categoryFilter !== 'all') {
        data = data.filter(post => post.category?.id === categoryFilter);
      }

      setPosts(data);
    } catch (error) {
      console.error('Error fetching blog posts:', error);
      toast({ title: 'Error fetching posts', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

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

  const filteredPosts = posts.filter(post =>
    post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    post.author?.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
      published: 'default',
      draft: 'secondary',
      scheduled: 'outline'
    };
    return (
      <Badge variant={variants[status] || 'secondary'}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Blog Manager</h2>
          <p className="text-sm text-muted-foreground">
            Manage your blog posts, categories, and content
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => onNavigate?.('ai-content-generator')}
            className="border-purple-200 text-purple-700 hover:bg-purple-50"
          >
            <Sparkles className="w-4 h-4 mr-2" />
            AI Generator
          </Button>
          <Button
            onClick={() => onNavigate?.('blog-editor')}
            className="bg-primary hover:bg-primary/90"
          >
            <PlusCircle className="w-4 h-4 mr-2" />
            New Post
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search posts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="published">Published</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="scheduled">Scheduled</SelectItem>
              </SelectContent>
            </Select>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map(cat => (
                  <SelectItem key={cat.id} value={cat.id}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button variant="outline" onClick={fetchPosts}>
              <RefreshCw className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{posts.length}</div>
            <p className="text-sm text-muted-foreground">Total Posts</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-green-600">
              {posts.filter(p => p.status === 'published').length}
            </div>
            <p className="text-sm text-muted-foreground">Published</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-amber-600">
              {posts.filter(p => p.status === 'draft').length}
            </div>
            <p className="text-sm text-muted-foreground">Drafts</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-purple-600">
              {posts.filter(p => p.aiGenerated).length}
            </div>
            <p className="text-sm text-muted-foreground">AI Generated</p>
          </CardContent>
        </Card>
      </div>

      {/* Posts Table */}
      <Card>
        <CardHeader>
          <CardTitle>Blog Posts ({filteredPosts.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[300px]">Title</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Author</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Views</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8">
                    <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2" />
                    Loading posts...
                  </TableCell>
                </TableRow>
              ) : filteredPosts.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8">
                    <p className="text-muted-foreground">No posts found</p>
                    <Button
                      variant="link"
                      onClick={() => onNavigate?.('blog-editor')}
                      className="mt-2"
                    >
                      Create your first post
                    </Button>
                  </TableCell>
                </TableRow>
              ) : (
                filteredPosts.map(post => (
                  <TableRow key={post.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        {post.featuredImage && (
                          <img
                            src={post.featuredImage}
                            alt=""
                            className="w-12 h-8 object-cover rounded"
                          />
                        )}
                        <div>
                          <div className="font-medium flex items-center gap-2">
                            {post.title}
                            {post.aiGenerated && (
                              <Sparkles className="w-3 h-3 text-purple-500" />
                            )}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {post.readingTime || 5} min read
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{post.category?.name || 'Uncategorized'}</Badge>
                    </TableCell>
                    <TableCell>{post.author?.name || 'Unknown'}</TableCell>
                    <TableCell>{getStatusBadge(post.status)}</TableCell>
                    <TableCell>{post.viewCount || 0}</TableCell>
                    <TableCell>{formatDate(post.publishedAt || post.createdAt)}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => window.open(`/blog/${post.slug}`, '_blank')}
                          >
                            <Eye className="w-4 h-4 mr-2" />
                            View
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => onNavigate?.('blog-editor', { id: post.id })}
                          >
                            <Edit className="w-4 h-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleDelete(post.id)}
                            className="text-red-600"
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default BlogManager;
