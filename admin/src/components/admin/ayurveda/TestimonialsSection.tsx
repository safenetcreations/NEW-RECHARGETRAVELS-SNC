import React, { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, MessageSquareQuote, Star } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { toast } from 'sonner';
import {
  getAllTestimonials,
  createTestimonial,
  updateTestimonial,
  deleteTestimonial,
  Testimonial
} from '@/services/ayurveda/ayurvedaService';

const TestimonialsSection: React.FC = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedTestimonial, setSelectedTestimonial] = useState<Testimonial | null>(null);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    author: '',
    location: '',
    quote: '',
    rating: 5,
    isActive: true
  });

  useEffect(() => {
    loadTestimonials();
  }, []);

  const loadTestimonials = async () => {
    setLoading(true);
    const { data } = await getAllTestimonials();
    if (data) {
      setTestimonials(data);
    }
    setLoading(false);
  };

  const resetForm = () => {
    setFormData({
      author: '',
      location: '',
      quote: '',
      rating: 5,
      isActive: true
    });
    setSelectedTestimonial(null);
  };

  const openModal = (testimonial?: Testimonial) => {
    if (testimonial) {
      setSelectedTestimonial(testimonial);
      setFormData({
        author: testimonial.author,
        location: testimonial.location,
        quote: testimonial.quote,
        rating: testimonial.rating,
        isActive: testimonial.isActive
      });
    } else {
      resetForm();
    }
    setModalOpen(true);
  };

  const handleSave = async () => {
    if (!formData.author || !formData.quote) {
      toast.error('Please fill in all required fields');
      return;
    }

    setSaving(true);

    if (selectedTestimonial?.id) {
      const { error } = await updateTestimonial(selectedTestimonial.id, formData);
      if (error) {
        toast.error('Failed to update testimonial');
      } else {
        toast.success('Testimonial updated successfully!');
        loadTestimonials();
        setModalOpen(false);
      }
    } else {
      const { error } = await createTestimonial(formData);
      if (error) {
        toast.error('Failed to create testimonial');
      } else {
        toast.success('Testimonial created successfully!');
        loadTestimonials();
        setModalOpen(false);
      }
    }

    setSaving(false);
  };

  const handleDelete = async () => {
    if (!selectedTestimonial?.id) return;

    const { error } = await deleteTestimonial(selectedTestimonial.id);
    if (error) {
      toast.error('Failed to delete testimonial');
    } else {
      toast.success('Testimonial deleted successfully!');
      loadTestimonials();
    }
    setDeleteDialogOpen(false);
    setSelectedTestimonial(null);
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-4 h-4 ${star <= rating ? 'fill-amber-400 text-amber-400' : 'text-gray-300'}`}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <Card className="border-0 shadow-md">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-emerald-900">
            <MessageSquareQuote className="w-5 h-5" />
            Manage Testimonials
          </CardTitle>
          <Button
            onClick={() => openModal()}
            className="bg-amber-500 hover:bg-amber-600"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Testimonial
          </Button>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="animate-pulse space-y-4">
              {[1, 2].map((i) => (
                <div key={i} className="h-24 bg-gray-100 rounded-lg"></div>
              ))}
            </div>
          ) : testimonials.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <MessageSquareQuote className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No testimonials found. Click "Add Testimonial" to create one.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase">Author</th>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase">Location</th>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase">Quote</th>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase">Rating</th>
                    <th className="text-right py-3 px-4 text-xs font-semibold text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {testimonials.map((testimonial) => (
                    <tr key={testimonial.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4 font-medium text-gray-900">{testimonial.author}</td>
                      <td className="py-3 px-4 text-gray-600">{testimonial.location}</td>
                      <td className="py-3 px-4 text-gray-600 max-w-xs truncate">"{testimonial.quote.substring(0, 60)}..."</td>
                      <td className="py-3 px-4">{renderStars(testimonial.rating)}</td>
                      <td className="py-3 px-4">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openModal(testimonial)}
                            className="border-emerald-200 hover:bg-emerald-50"
                          >
                            <Pencil className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSelectedTestimonial(testimonial);
                              setDeleteDialogOpen(true);
                            }}
                            className="border-red-200 hover:bg-red-50 text-red-600"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add/Edit Modal */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {selectedTestimonial ? 'Edit Testimonial' : 'Add New Testimonial'}
            </DialogTitle>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="author">Author Name *</Label>
              <Input
                id="author"
                value={formData.author}
                onChange={(e) => setFormData(prev => ({ ...prev, author: e.target.value }))}
                placeholder="e.g., Sarah Mitchell"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Location *</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                placeholder="e.g., London, United Kingdom"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="quote">Quote *</Label>
              <Textarea
                id="quote"
                value={formData.quote}
                onChange={(e) => setFormData(prev => ({ ...prev, quote: e.target.value }))}
                placeholder="Enter the testimonial quote..."
                className="min-h-[120px]"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="rating">Rating (1-5) *</Label>
              <Select
                value={formData.rating.toString()}
                onValueChange={(value) => setFormData(prev => ({ ...prev, rating: parseInt(value) }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select rating" />
                </SelectTrigger>
                <SelectContent>
                  {[5, 4, 3, 2, 1].map((rating) => (
                    <SelectItem key={rating} value={rating.toString()}>
                      {rating} Star{rating !== 1 ? 's' : ''}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={saving}
              className="bg-emerald-600 hover:bg-emerald-700"
            >
              {saving ? 'Saving...' : 'Save Testimonial'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Testimonial</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete the testimonial from "{selectedTestimonial?.author}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default TestimonialsSection;
