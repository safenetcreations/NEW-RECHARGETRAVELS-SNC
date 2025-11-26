import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Eye, EyeOff, Save, X } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
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
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { wildToursService, WildTourFirestore } from '@/services/firebaseWildToursService';
import { toast } from 'sonner';

const categories = [
  { value: 'elephant', label: 'Elephant Safari Tours' },
  { value: 'leopard', label: 'Leopard Watching Safaris' },
  { value: 'whale', label: 'Blue Whale Watching' },
  { value: 'dolphin', label: 'Kalpitiya Dolphin Tours' },
  { value: 'birds', label: 'Birdwatching Expeditions' },
  { value: 'underwater', label: 'Underwater Snorkel/Dive Tours' }
];

const WildToursAdmin = () => {
  const [tours, setTours] = useState<WildTourFirestore[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTour, setEditingTour] = useState<WildTourFirestore | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const [formData, setFormData] = useState<Partial<WildTourFirestore>>({
    title: '',
    location: '',
    description: [''],
    category: 'elephant',
    tier: 'budget',
    price: 0,
    originalPrice: 0,
    duration: '',
    image: '',
    inclusions: {
      vehicle: '',
      guide: '',
      accommodation: '',
      meals: '',
      extras: []
    },
    highlights: [''],
    maxParticipants: 1,
    rating: 4.0,
    reviewCount: 0,
    itinerary: [],
    faq: [],
    bestTime: '',
    difficulty: '',
    included: [''],
    excluded: [''],
    cancellationPolicy: ''
  });

  useEffect(() => {
    loadTours();
  }, []);

  const loadTours = async () => {
    setLoading(true);
    try {
      const data = await wildToursService.getAllTours();
      setTours(data);
    } catch (error) {
      console.error('Error loading tours:', error);
      toast.error('Failed to load tours');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (tour?: WildTourFirestore) => {
    if (tour) {
      setEditingTour(tour);
      setFormData(tour);
    } else {
      setEditingTour(null);
      setFormData({
        title: '',
        location: '',
        description: [''],
        category: 'elephant',
        tier: 'budget',
        price: 0,
        originalPrice: 0,
        duration: '',
        image: '',
        inclusions: {
          vehicle: '',
          guide: '',
          accommodation: '',
          meals: '',
          extras: []
        },
        highlights: [''],
        maxParticipants: 1,
        rating: 4.0,
        reviewCount: 0,
        itinerary: [],
        faq: [],
        bestTime: '',
        difficulty: '',
        included: [''],
        excluded: [''],
        cancellationPolicy: ''
      });
    }
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingTour(null);
  };

  const handleSaveTour = async () => {
    try {
      // Validation
      if (!formData.title || !formData.location || !formData.category) {
        toast.error('Please fill in all required fields');
        return;
      }

      if (editingTour) {
        await wildToursService.updateTour(editingTour.id, formData);
        toast.success('Tour updated successfully');
      } else {
        await wildToursService.createTour(formData as Omit<WildTourFirestore, 'id' | 'createdAt' | 'updatedAt'>);
        toast.success('Tour created successfully');
      }

      await loadTours();
      handleCloseDialog();
    } catch (error) {
      console.error('Error saving tour:', error);
      toast.error('Failed to save tour');
    }
  };

  const handleDeleteTour = async (tourId: string) => {
    if (window.confirm('Are you sure you want to delete this tour?')) {
      try {
        await wildToursService.deleteTour(tourId);
        toast.success('Tour deleted successfully');
        await loadTours();
      } catch (error) {
        console.error('Error deleting tour:', error);
        toast.error('Failed to delete tour');
      }
    }
  };

  const handleArrayFieldChange = (field: 'description' | 'highlights' | 'included' | 'excluded', index: number, value: string) => {
    const array = [...(formData[field] as string[])];
    array[index] = value;
    setFormData({ ...formData, [field]: array });
  };

  const addArrayField = (field: 'description' | 'highlights' | 'included' | 'excluded') => {
    const array = [...(formData[field] as string[])];
    array.push('');
    setFormData({ ...formData, [field]: array });
  };

  const removeArrayField = (field: 'description' | 'highlights' | 'included' | 'excluded', index: number) => {
    const array = [...(formData[field] as string[])];
    array.splice(index, 1);
    setFormData({ ...formData, [field]: array });
  };

  const filteredTours = selectedCategory === 'all'
    ? tours
    : tours.filter(tour => tour.category === selectedCategory);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Wild Tours Management</h2>
          <p className="text-gray-600 mt-1">Manage wildlife safari tours and packages</p>
        </div>
        <Button onClick={() => handleOpenDialog()} className="bg-green-600 hover:bg-green-700">
          <Plus className="w-4 h-4 mr-2" />
          Add New Tour
        </Button>
      </div>

      {/* Category Filter */}
      <div className="flex gap-2 flex-wrap">
        <Button
          variant={selectedCategory === 'all' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setSelectedCategory('all')}
        >
          All Categories
        </Button>
        {categories.map(cat => (
          <Button
            key={cat.value}
            variant={selectedCategory === cat.value ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedCategory(cat.value)}
          >
            {cat.label}
          </Button>
        ))}
      </div>

      {/* Tours Grid */}
      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="text-gray-600 mt-4">Loading tours...</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTours.map(tour => (
            <Card key={tour.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <img
                src={tour.image}
                alt={tour.title}
                className="w-full h-48 object-cover"
              />
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg mb-2">{tour.title}</CardTitle>
                    <div className="flex gap-2 mb-2">
                      <Badge variant={tour.tier === 'semi-luxury' ? 'default' : 'secondary'}>
                        {tour.tier === 'semi-luxury' ? 'Semi-Luxury' : 'Budget'}
                      </Badge>
                      <Badge variant="outline">{tour.category}</Badge>
                    </div>
                    <p className="text-sm text-gray-600">{tour.location}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-xl font-bold text-green-600">${tour.price}</div>
                    <div className="text-xs text-gray-500">{tour.duration}</div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleOpenDialog(tour)}
                    className="flex-1"
                  >
                    <Edit className="w-3 h-3 mr-1" />
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDeleteTour(tour.id)}
                    className="flex-1 text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-3 h-3 mr-1" />
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Edit/Create Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingTour ? 'Edit Tour' : 'Create New Tour'}</DialogTitle>
            <DialogDescription>
              {editingTour ? 'Update tour details below' : 'Fill in the tour details below'}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            {/* Basic Information */}
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Title *</Label>
                <Input
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Premium Elephant Safari"
                />
              </div>

              <div className="space-y-2">
                <Label>Location *</Label>
                <Input
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder="Udawalawe & Minneriya"
                />
              </div>

              <div className="space-y-2">
                <Label>Category *</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => setFormData({ ...formData, category: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(cat => (
                      <SelectItem key={cat.value} value={cat.value}>
                        {cat.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Tier *</Label>
                <Select
                  value={formData.tier}
                  onValueChange={(value: 'semi-luxury' | 'budget') => setFormData({ ...formData, tier: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="semi-luxury">Semi-Luxury</SelectItem>
                    <SelectItem value="budget">Budget-Friendly</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Price (USD) *</Label>
                <Input
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                  placeholder="180"
                />
              </div>

              <div className="space-y-2">
                <Label>Original Price (Optional)</Label>
                <Input
                  type="number"
                  value={formData.originalPrice || ''}
                  onChange={(e) => setFormData({ ...formData, originalPrice: parseFloat(e.target.value) || 0 })}
                  placeholder="220"
                />
              </div>

              <div className="space-y-2">
                <Label>Duration *</Label>
                <Input
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                  placeholder="2 Days, 1 Night"
                />
              </div>

              <div className="space-y-2">
                <Label>Max Participants</Label>
                <Input
                  type="number"
                  value={formData.maxParticipants}
                  onChange={(e) => setFormData({ ...formData, maxParticipants: parseInt(e.target.value) })}
                />
              </div>

              <div className="space-y-2">
                <Label>Image URL *</Label>
                <Input
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                />
              </div>

              <div className="space-y-2">
                <Label>Best Time to Visit</Label>
                <Input
                  value={formData.bestTime || ''}
                  onChange={(e) => setFormData({ ...formData, bestTime: e.target.value })}
                  placeholder="December to April"
                />
              </div>

              <div className="space-y-2">
                <Label>Difficulty Level</Label>
                <Select
                  value={formData.difficulty || 'easy'}
                  onValueChange={(value) => setFormData({ ...formData, difficulty: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="easy">Easy</SelectItem>
                    <SelectItem value="moderate">Moderate</SelectItem>
                    <SelectItem value="challenging">Challenging</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Rating</Label>
                <Input
                  type="number"
                  step="0.1"
                  min="0"
                  max="5"
                  value={formData.rating}
                  onChange={(e) => setFormData({ ...formData, rating: parseFloat(e.target.value) })}
                />
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label>Description Points *</Label>
              {(formData.description as string[]).map((desc, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    value={desc}
                    onChange={(e) => handleArrayFieldChange('description', index, e.target.value)}
                    placeholder="Private luxury jeep with expert naturalist guide"
                  />
                  {(formData.description as string[]).length > 1 && (
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={() => removeArrayField('description', index)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              ))}
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={() => addArrayField('description')}
              >
                <Plus className="w-3 h-3 mr-1" />
                Add Point
              </Button>
            </div>

            {/* Highlights */}
            <div className="space-y-2">
              <Label>Highlights</Label>
              {(formData.highlights as string[]).map((highlight, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    value={highlight}
                    onChange={(e) => handleArrayFieldChange('highlights', index, e.target.value)}
                    placeholder="300+ elephants"
                  />
                  {(formData.highlights as string[]).length > 1 && (
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={() => removeArrayField('highlights', index)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              ))}
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={() => addArrayField('highlights')}
              >
                <Plus className="w-3 h-3 mr-1" />
                Add Highlight
              </Button>
            </div>

            {/* Inclusions */}
            <div className="space-y-4">
              <Label>Inclusions</Label>
              <div className="grid md:grid-cols-2 gap-4">
                <Input
                  placeholder="Vehicle"
                  value={formData.inclusions?.vehicle || ''}
                  onChange={(e) => setFormData({
                    ...formData,
                    inclusions: { ...formData.inclusions!, vehicle: e.target.value }
                  })}
                />
                <Input
                  placeholder="Guide"
                  value={formData.inclusions?.guide || ''}
                  onChange={(e) => setFormData({
                    ...formData,
                    inclusions: { ...formData.inclusions!, guide: e.target.value }
                  })}
                />
                <Input
                  placeholder="Accommodation"
                  value={formData.inclusions?.accommodation || ''}
                  onChange={(e) => setFormData({
                    ...formData,
                    inclusions: { ...formData.inclusions!, accommodation: e.target.value }
                  })}
                />
                <Input
                  placeholder="Meals"
                  value={formData.inclusions?.meals || ''}
                  onChange={(e) => setFormData({
                    ...formData,
                    inclusions: { ...formData.inclusions!, meals: e.target.value }
                  })}
                />
              </div>
            </div>

            {/* Cancellation Policy */}
            <div className="space-y-2">
              <Label>Cancellation Policy</Label>
              <Textarea
                value={formData.cancellationPolicy || ''}
                onChange={(e) => setFormData({ ...formData, cancellationPolicy: e.target.value })}
                placeholder="Free cancellation up to 24 hours before departure..."
                rows={3}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={handleCloseDialog}>
              Cancel
            </Button>
            <Button onClick={handleSaveTour} className="bg-green-600 hover:bg-green-700">
              <Save className="w-4 h-4 mr-2" />
              {editingTour ? 'Update Tour' : 'Create Tour'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default WildToursAdmin;
