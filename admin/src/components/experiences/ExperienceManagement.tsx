import { useState, useEffect, Suspense, lazy } from 'react';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  EyeOff,
  Search,
  Filter,
  Download,
  Upload,
  Star,
  TrendingUp
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { luxuryExperienceService } from '@/services/luxuryExperienceService';
import type { LuxuryExperience, ExperienceCategory } from '@/types/luxury-experience';
import { toast } from 'sonner';
import LoadingSpinner from '@/components/LoadingSpinner';

const ExperienceForm = lazy(() => import('./ExperienceForm'));

const ExperienceManagement = () => {
  const [experiences, setExperiences] = useState<LuxuryExperience[]>([]);
  const [filteredExperiences, setFilteredExperiences] = useState<LuxuryExperience[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<ExperienceCategory | 'all'>('all');
  const [selectedStatus, setSelectedStatus] = useState<'all' | 'published' | 'draft' | 'archived'>('all');
  const [showForm, setShowForm] = useState(false);
  const [editingExperience, setEditingExperience] = useState<LuxuryExperience | null>(null);
  
  const categories = luxuryExperienceService.getCategories();

  useEffect(() => {
    loadExperiences();
  }, []);

  useEffect(() => {
    filterExperiences();
  }, [experiences, searchQuery, selectedCategory, selectedStatus]);

  const loadExperiences = async () => {
    try {
      setLoading(true);
      // For admin, we need to get all experiences, not just published
      const data = await luxuryExperienceService.getExperiences();
      setExperiences(data);
    } catch (error) {
      console.error('Error loading experiences:', error);
      toast.error('Failed to load experiences');
    } finally {
      setLoading(false);
    }
  };

  const filterExperiences = () => {
    let filtered = [...experiences];

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(exp => 
        exp.title.toLowerCase().includes(query) ||
        exp.shortDescription.toLowerCase().includes(query)
      );
    }

    // Category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(exp => exp.category === selectedCategory);
    }

    // Status filter
    if (selectedStatus !== 'all') {
      filtered = filtered.filter(exp => exp.status === selectedStatus);
    }

    setFilteredExperiences(filtered);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this experience?')) {
      return;
    }

    try {
      await luxuryExperienceService.deleteExperience(id);
      toast.success('Experience deleted successfully');
      loadExperiences();
    } catch (error) {
      console.error('Error deleting experience:', error);
      toast.error('Failed to delete experience');
    }
  };

  const handleStatusToggle = async (experience: LuxuryExperience) => {
    const newStatus = experience.status === 'published' ? 'draft' : 'published';
    try {
      await luxuryExperienceService.updateExperience(experience.id, { 
        status: newStatus,
        publishedAt: newStatus === 'published' ? new Date() : undefined
      });
      toast.success(`Experience ${newStatus === 'published' ? 'published' : 'unpublished'}`);
      loadExperiences();
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Failed to update status');
    }
  };

  const handleFeatureToggle = async (experience: LuxuryExperience) => {
    try {
      await luxuryExperienceService.updateExperience(experience.id, { 
        featured: !experience.featured 
      });
      toast.success(experience.featured ? 'Removed from featured' : 'Added to featured');
      loadExperiences();
    } catch (error) {
      console.error('Error updating featured status:', error);
      toast.error('Failed to update featured status');
    }
  };

  const handleEdit = (experience: LuxuryExperience) => {
    setEditingExperience(experience);
    setShowForm(true);
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingExperience(null);
    loadExperiences();
  };

  const exportExperiences = () => {
    const csv = [
      ['Title', 'Category', 'Status', 'Price', 'Duration', 'Featured', 'Created Date'],
      ...filteredExperiences.map(exp => [
        exp.title,
        exp.category,
        exp.status,
        exp.price.amount,
        exp.duration,
        exp.featured ? 'Yes' : 'No',
        new Date(exp.createdAt).toLocaleDateString()
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'experiences.csv';
    a.click();
  };

  // Statistics
  const stats = {
    total: experiences.length,
    published: experiences.filter(e => e.status === 'published').length,
    featured: experiences.filter(e => e.featured).length,
    avgPrice: experiences.reduce((acc, e) => acc + e.price.amount, 0) / experiences.length || 0
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Luxury Experiences</h1>
        <div className="flex gap-3">
          <Button variant="outline" onClick={exportExperiences}>
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button onClick={() => setShowForm(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Add Experience
          </Button>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Total Experiences
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{stats.total}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Published
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-green-600">{stats.published}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Featured
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-amber-600">{stats.featured}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Avg. Price
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">${stats.avgPrice.toFixed(0)}</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Search experiences..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={selectedCategory} onValueChange={(value: any) => setSelectedCategory(value)}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map(cat => (
                  <SelectItem key={cat.value} value={cat.value}>
                    {cat.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={selectedStatus} onValueChange={(value: any) => setSelectedStatus(value)}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="published">Published</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="archived">Archived</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Experience</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Featured</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-amber-500 mx-auto"></div>
                  </TableCell>
                </TableRow>
              ) : filteredExperiences.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                    No experiences found
                  </TableCell>
                </TableRow>
              ) : (
                filteredExperiences.map((experience) => (
                  <TableRow key={experience.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{experience.title}</p>
                        <p className="text-sm text-gray-500 line-clamp-1">
                          {experience.shortDescription}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {categories.find(c => c.value === experience.category)?.label}
                      </Badge>
                    </TableCell>
                    <TableCell>${experience.price.amount}</TableCell>
                    <TableCell>{experience.duration}</TableCell>
                    <TableCell>
                      <Badge 
                        variant={experience.status === 'published' ? 'default' : 'secondary'}
                      >
                        {experience.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleFeatureToggle(experience)}
                        className={experience.featured ? 'text-amber-600' : 'text-gray-400'}
                      >
                        <Star className={`w-4 h-4 ${experience.featured ? 'fill-current' : ''}`} />
                      </Button>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleStatusToggle(experience)}
                        >
                          {experience.status === 'published' ? (
                            <EyeOff className="w-4 h-4" />
                          ) : (
                            <Eye className="w-4 h-4" />
                          )}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(experience)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(experience.id)}
                          className="text-red-600 hover:text-red-700"
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

      {/* Form Dialog */}
      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingExperience ? 'Edit Experience' : 'Add New Experience'}
            </DialogTitle>
          </DialogHeader>
          <Suspense fallback={<LoadingSpinner />}>
            <ExperienceForm 
              experience={editingExperience}
              onClose={handleFormClose}
            />
          </Suspense>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ExperienceManagement;
