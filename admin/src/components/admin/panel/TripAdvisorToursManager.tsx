import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { Plus, Edit, Trash2, Save, RefreshCw, ExternalLink, Star, MapPin, AlertTriangle, CheckCircle } from 'lucide-react';
import { db } from '@/lib/firebase';
import { doc, collection, getDocs, addDoc, updateDoc, deleteDoc, query, orderBy, writeBatch } from 'firebase/firestore';
import ImageUpload from '@/components/ui/image-upload';

// Types
interface TripAdvisorTour {
  id: string;
  title: string;
  priceUsd: number;
  rating: number;
  reviews: number;
  region: string;
  location: string;
  duration: string;
  description: string;
  image: string;
  tripAdvisorUrl: string;
  operator: string;
  operatorProfileUrl: string;
  badge?: string;
  isActive: boolean;
  sortOrder: number;
}

const REGIONS = [
  { value: 'north', label: 'North' },
  { value: 'south', label: 'South' },
  { value: 'east', label: 'East' },
  { value: 'west', label: 'West' },
  { value: 'central', label: 'Central' },
];

const RECHARGE_PROFILE_URL = 'https://www.tripadvisor.com/Attraction_Review-g293962-d10049587-Reviews-Recharge_Travels_And_Tours-Colombo_Western_Province.html';
const JAFFNA_PROFILE_URL = 'https://www.tripadvisor.com/Attraction_Review-g304135-d33101952-Reviews-Jaffna_Recharge_Travels-Jaffna_Northern_Province.html';

// Check if URL is valid TripAdvisor product URL (not just profile)
const isValidProductUrl = (url: string): boolean => {
  if (!url) return false;
  // Valid product URLs contain AttractionProductReview
  return url.includes('AttractionProductReview');
};

const TripAdvisorToursManager: React.FC = () => {
  const [tours, setTours] = useState<TripAdvisorTour[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingTour, setEditingTour] = useState<TripAdvisorTour | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [filterRegion, setFilterRegion] = useState<string>('all');
  const [filterUrlStatus, setFilterUrlStatus] = useState<string>('all');

  useEffect(() => {
    loadTours();
  }, []);

  const loadTours = async () => {
    setLoading(true);
    try {
      const toursQuery = query(collection(db, 'tours_tripadvisor'), orderBy('sortOrder', 'asc'));
      const snapshot = await getDocs(toursQuery);
      const toursList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        isActive: doc.data().isActive ?? true,
        sortOrder: doc.data().sortOrder ?? 0
      } as TripAdvisorTour));
      setTours(toursList);
    } catch (error) {
      console.error('Error loading tours:', error);
      toast.error('Failed to load tours');
    } finally {
      setLoading(false);
    }
  };

  const saveTour = async (tourData: Omit<TripAdvisorTour, 'id'>) => {
    setSaving(true);
    try {
      await addDoc(collection(db, 'tours_tripadvisor'), {
        ...tourData,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      toast.success('Tour added successfully');
      loadTours();
      setShowAddForm(false);
    } catch (error) {
      console.error('Error adding tour:', error);
      toast.error('Failed to add tour');
    } finally {
      setSaving(false);
    }
  };

  const updateTour = async (id: string, updates: Partial<TripAdvisorTour>) => {
    setSaving(true);
    try {
      await updateDoc(doc(db, 'tours_tripadvisor', id), {
        ...updates,
        updatedAt: new Date()
      });
      toast.success('Tour updated successfully');
      loadTours();
      setEditingTour(null);
    } catch (error) {
      console.error('Error updating tour:', error);
      toast.error('Failed to update tour');
    } finally {
      setSaving(false);
    }
  };

  const deleteTour = async (id: string) => {
    if (!confirm('Are you sure you want to delete this tour?')) return;
    try {
      await deleteDoc(doc(db, 'tours_tripadvisor', id));
      toast.success('Tour deleted successfully');
      loadTours();
    } catch (error) {
      console.error('Error deleting tour:', error);
      toast.error('Failed to delete tour');
    }
  };

  // Filter tours
  const filteredTours = tours.filter(tour => {
    if (filterRegion !== 'all' && tour.region !== filterRegion) return false;
    if (filterUrlStatus === 'valid' && !isValidProductUrl(tour.tripAdvisorUrl)) return false;
    if (filterUrlStatus === 'invalid' && isValidProductUrl(tour.tripAdvisorUrl)) return false;
    return true;
  });

  // Stats
  const validUrlCount = tours.filter(t => isValidProductUrl(t.tripAdvisorUrl)).length;
  const invalidUrlCount = tours.length - validUrlCount;

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">TripAdvisor Tours Manager</h2>
          <p className="text-gray-600">Manage tours displayed on homepage and /tours/tripadvisor page</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={loadTours} variant="outline">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
          <Button onClick={() => setShowAddForm(true)} className="bg-emerald-600 hover:bg-emerald-700">
            <Plus className="w-4 h-4 mr-2" />
            Add Tour
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-4">
            <div className="text-2xl font-bold text-gray-900">{tours.length}</div>
            <div className="text-sm text-gray-600">Total Tours</div>
          </CardContent>
        </Card>
        <Card className="border-green-200 bg-green-50">
          <CardContent className="pt-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <div className="text-2xl font-bold text-green-700">{validUrlCount}</div>
            </div>
            <div className="text-sm text-green-600">Valid Product URLs</div>
          </CardContent>
        </Card>
        <Card className="border-amber-200 bg-amber-50">
          <CardContent className="pt-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-600" />
              <div className="text-2xl font-bold text-amber-700">{invalidUrlCount}</div>
            </div>
            <div className="text-sm text-amber-600">Need Correct URL</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="text-2xl font-bold text-gray-900">{tours.filter(t => t.isActive).length}</div>
            <div className="text-sm text-gray-600">Active Tours</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-4">
          <div className="flex flex-wrap gap-4">
            <div className="w-48">
              <Label>Filter by Region</Label>
              <Select value={filterRegion} onValueChange={setFilterRegion}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Regions</SelectItem>
                  {REGIONS.map(r => (
                    <SelectItem key={r.value} value={r.value}>{r.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="w-48">
              <Label>Filter by URL Status</Label>
              <Select value={filterUrlStatus} onValueChange={setFilterUrlStatus}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All URLs</SelectItem>
                  <SelectItem value="valid">Valid Product URLs</SelectItem>
                  <SelectItem value="invalid">Invalid/Profile URLs</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Add/Edit Form */}
      {(showAddForm || editingTour) && (
        <TourForm
          tour={editingTour}
          onSubmit={(data) => editingTour ? updateTour(editingTour.id, data) : saveTour(data)}
          onCancel={() => { setShowAddForm(false); setEditingTour(null); }}
          saving={saving}
        />
      )}

      {/* Tours List */}
      <Card>
        <CardHeader>
          <CardTitle>Tours ({filteredTours.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredTours.map((tour) => (
              <div
                key={tour.id}
                className={`flex gap-4 p-4 border rounded-lg ${
                  !isValidProductUrl(tour.tripAdvisorUrl) ? 'border-amber-300 bg-amber-50' : 'bg-white'
                }`}
              >
                {/* Image */}
                <div className="w-32 h-24 flex-shrink-0 overflow-hidden rounded-lg bg-gray-100">
                  {tour.image ? (
                    <img src={tour.image} alt={tour.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      No Image
                    </div>
                  )}
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-semibold text-gray-900 line-clamp-1">{tour.title}</h3>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <Badge variant={tour.isActive ? 'default' : 'secondary'}>
                        {tour.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                      {isValidProductUrl(tour.tripAdvisorUrl) ? (
                        <Badge className="bg-green-100 text-green-800">Valid URL</Badge>
                      ) : (
                        <Badge className="bg-amber-100 text-amber-800">
                          <AlertTriangle className="w-3 h-3 mr-1" />
                          Needs URL
                        </Badge>
                      )}
                    </div>
                  </div>

                  <div className="mt-1 flex items-center gap-4 text-sm text-gray-600">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {tour.location}
                    </span>
                    <span>{tour.duration}</span>
                    <span className="font-semibold text-emerald-600">${tour.priceUsd}</span>
                    <span className="flex items-center gap-1">
                      <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                      {tour.rating} ({tour.reviews} reviews)
                    </span>
                  </div>

                  <div className="mt-2">
                    <div className="flex items-center gap-2 text-xs">
                      <span className="text-gray-500">URL:</span>
                      <a
                        href={tour.tripAdvisorUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`truncate max-w-md hover:underline ${
                          isValidProductUrl(tour.tripAdvisorUrl) ? 'text-emerald-600' : 'text-amber-600'
                        }`}
                      >
                        {tour.tripAdvisorUrl}
                      </a>
                      <ExternalLink className="w-3 h-3 flex-shrink-0" />
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-2">
                  <Button size="sm" variant="outline" onClick={() => setEditingTour(tour)}>
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="destructive" onClick={() => deleteTour(tour.id)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}

            {filteredTours.length === 0 && (
              <div className="text-center py-12 text-gray-500">
                No tours found. Add your first tour to get started.
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Help Section */}
      <Card className="bg-blue-50 border-blue-200">
        <CardHeader>
          <CardTitle className="text-blue-800">How to Get Correct TripAdvisor URLs</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-blue-700 space-y-2">
          <p><strong>Valid URL format:</strong> Must contain <code className="bg-blue-100 px-1 rounded">AttractionProductReview</code></p>
          <p><strong>Example:</strong> <code className="bg-blue-100 px-1 rounded text-xs">https://www.tripadvisor.com/AttractionProductReview-g293962-d33108820-Tour_Name-Location.html</code></p>
          <p><strong>Steps to get correct URL:</strong></p>
          <ol className="list-decimal ml-4 space-y-1">
            <li>Go to your TripAdvisor business profile</li>
            <li>Click on the specific tour/product you want to link</li>
            <li>Copy the URL from your browser - it should contain "AttractionProductReview"</li>
            <li>Paste that URL in the TripAdvisor URL field for the tour</li>
          </ol>
          <p className="text-amber-700 mt-4"><strong>Note:</strong> URLs pointing to your company profile page (Attraction_Review) will not work for direct booking.</p>
        </CardContent>
      </Card>
    </div>
  );
};

// Tour Form Component
interface TourFormProps {
  tour?: TripAdvisorTour | null;
  onSubmit: (data: Omit<TripAdvisorTour, 'id'>) => void;
  onCancel: () => void;
  saving: boolean;
}

const TourForm: React.FC<TourFormProps> = ({ tour, onSubmit, onCancel, saving }) => {
  const [formData, setFormData] = useState({
    title: tour?.title || '',
    priceUsd: tour?.priceUsd || 0,
    rating: tour?.rating || 4.5,
    reviews: tour?.reviews || 0,
    region: tour?.region || 'central',
    location: tour?.location || '',
    duration: tour?.duration || '',
    description: tour?.description || '',
    image: tour?.image || '',
    tripAdvisorUrl: tour?.tripAdvisorUrl || '',
    operator: tour?.operator || 'Recharge Travels & Tours',
    operatorProfileUrl: tour?.operatorProfileUrl || RECHARGE_PROFILE_URL,
    badge: tour?.badge || '',
    isActive: tour?.isActive ?? true,
    sortOrder: tour?.sortOrder || 0,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.tripAdvisorUrl) {
      toast.error('TripAdvisor URL is required');
      return;
    }
    onSubmit(formData);
  };

  const urlIsValid = isValidProductUrl(formData.tripAdvisorUrl);

  return (
    <Card className="border-emerald-200">
      <CardHeader>
        <CardTitle>{tour ? 'Edit Tour' : 'Add New Tour'}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <Label>Tour Title *</Label>
              <Input
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Full Day Tour to Sigiriya and Dambulla"
                required
              />
            </div>

            <div className="col-span-2">
              <Label className="flex items-center gap-2">
                TripAdvisor URL *
                {formData.tripAdvisorUrl && (
                  urlIsValid ? (
                    <Badge className="bg-green-100 text-green-800">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Valid Product URL
                    </Badge>
                  ) : (
                    <Badge className="bg-amber-100 text-amber-800">
                      <AlertTriangle className="w-3 h-3 mr-1" />
                      Not a Product URL
                    </Badge>
                  )
                )}
              </Label>
              <Input
                value={formData.tripAdvisorUrl}
                onChange={(e) => setFormData(prev => ({ ...prev, tripAdvisorUrl: e.target.value }))}
                placeholder="https://www.tripadvisor.com/AttractionProductReview-g..."
                required
                className={formData.tripAdvisorUrl && !urlIsValid ? 'border-amber-500' : ''}
              />
              {formData.tripAdvisorUrl && !urlIsValid && (
                <p className="text-xs text-amber-600 mt-1">
                  This URL doesn't look like a product URL. Make sure to copy the URL from the specific tour page, not your profile page.
                </p>
              )}
            </div>

            <div>
              <Label>Price (USD) *</Label>
              <Input
                type="number"
                value={formData.priceUsd}
                onChange={(e) => setFormData(prev => ({ ...prev, priceUsd: parseFloat(e.target.value) || 0 }))}
                min={0}
                required
              />
            </div>

            <div>
              <Label>Duration</Label>
              <Input
                value={formData.duration}
                onChange={(e) => setFormData(prev => ({ ...prev, duration: e.target.value }))}
                placeholder="Full day, 6-8 hours"
              />
            </div>

            <div>
              <Label>Region</Label>
              <Select
                value={formData.region}
                onValueChange={(value) => setFormData(prev => ({ ...prev, region: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {REGIONS.map(r => (
                    <SelectItem key={r.value} value={r.value}>{r.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Location</Label>
              <Input
                value={formData.location}
                onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                placeholder="Sigiriya, Central Province"
              />
            </div>

            <div>
              <Label>Rating (0-5)</Label>
              <Input
                type="number"
                value={formData.rating}
                onChange={(e) => setFormData(prev => ({ ...prev, rating: parseFloat(e.target.value) || 0 }))}
                min={0}
                max={5}
                step={0.1}
              />
            </div>

            <div>
              <Label>Reviews Count</Label>
              <Input
                type="number"
                value={formData.reviews}
                onChange={(e) => setFormData(prev => ({ ...prev, reviews: parseInt(e.target.value) || 0 }))}
                min={0}
              />
            </div>

            <div>
              <Label>Badge (optional)</Label>
              <Input
                value={formData.badge}
                onChange={(e) => setFormData(prev => ({ ...prev, badge: e.target.value }))}
                placeholder="Best Seller, New, etc."
              />
            </div>

            <div>
              <Label>Sort Order</Label>
              <Input
                type="number"
                value={formData.sortOrder}
                onChange={(e) => setFormData(prev => ({ ...prev, sortOrder: parseInt(e.target.value) || 0 }))}
              />
            </div>
          </div>

          <div>
            <Label>Description</Label>
            <Textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Brief description of the tour..."
              rows={3}
            />
          </div>

          <div>
            <Label>Tour Image</Label>
            <ImageUpload
              value={formData.image}
              onChange={(url) => setFormData(prev => ({ ...prev, image: url }))}
              onRemove={() => setFormData(prev => ({ ...prev, image: '' }))}
              folder="tripadvisor-tours"
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="isActive"
              checked={formData.isActive}
              onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
            />
            <Label htmlFor="isActive">Active (show on website)</Label>
          </div>

          <div className="flex gap-2">
            <Button type="submit" disabled={saving} className="bg-emerald-600 hover:bg-emerald-700">
              <Save className="w-4 h-4 mr-2" />
              {saving ? 'Saving...' : (tour ? 'Update Tour' : 'Add Tour')}
            </Button>
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default TripAdvisorToursManager;
