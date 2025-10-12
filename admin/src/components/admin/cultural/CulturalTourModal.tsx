
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { X, Plus } from 'lucide-react';
import { sanitizeInput } from '@/utils/inputValidation';

interface CulturalTour {
  id: number;
  name: string;
  duration: string;
  price: number;
  highlights: string[];
}

interface CulturalTourModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (tour: Omit<CulturalTour, 'id'>, csrfToken: string) => void;
  tour?: CulturalTour | null;
  csrfToken: string;
}

const CulturalTourModal: React.FC<CulturalTourModalProps> = ({
  isOpen,
  onClose,
  onSave,
  tour,
  csrfToken
}) => {
  const [formData, setFormData] = useState({
    name: '',
    duration: '',
    price: '',
    highlights: [] as string[]
  });
  const [newHighlight, setNewHighlight] = useState('');

  useEffect(() => {
    if (tour) {
      setFormData({
        name: tour.name,
        duration: tour.duration,
        price: tour.price.toString(),
        highlights: [...tour.highlights]
      });
    } else {
      setFormData({
        name: '',
        duration: '',
        price: '',
        highlights: []
      });
    }
    setNewHighlight('');
  }, [tour, isOpen]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    // Sanitize input on change
    const sanitizedValue = sanitizeInput(value);
    setFormData(prev => ({
      ...prev,
      [name]: sanitizedValue
    }));
  };

  const addHighlight = () => {
    const sanitizedHighlight = sanitizeInput(newHighlight.trim());
    if (sanitizedHighlight && formData.highlights.length < 20) {
      setFormData(prev => ({
        ...prev,
        highlights: [...prev.highlights, sanitizedHighlight]
      }));
      setNewHighlight('');
    }
  };

  const removeHighlight = (index: number) => {
    setFormData(prev => ({
      ...prev,
      highlights: prev.highlights.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.duration || !formData.price) {
      alert('Please fill in all required fields');
      return;
    }

    const priceValue = parseFloat(formData.price);
    if (isNaN(priceValue) || priceValue < 0) {
      alert('Please enter a valid price');
      return;
    }

    onSave({
      name: formData.name,
      duration: formData.duration,
      price: priceValue,
      highlights: formData.highlights
    }, csrfToken);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl cultural-modal">
        <DialogHeader>
          <DialogTitle className="section-title">
            {tour ? 'Edit Tour Package' : 'Add New Tour Package'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Hidden CSRF token */}
          <input type="hidden" value={csrfToken} />
          
          <div className="form-group">
            <Label htmlFor="name">Tour Name</Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
              maxLength={100}
              className="cultural-input"
            />
          </div>

          <div className="form-grid">
            <div className="form-group">
              <Label htmlFor="duration">Duration</Label>
              <Input
                id="duration"
                name="duration"
                value={formData.duration}
                onChange={handleInputChange}
                placeholder="e.g., 7 Days / 6 Nights"
                required
                maxLength={50}
                className="cultural-input"
              />
            </div>

            <div className="form-group">
              <Label htmlFor="price">Starting Price (USD)</Label>
              <Input
                id="price"
                name="price"
                type="number"
                min="0"
                max="10000"
                step="0.01"
                value={formData.price}
                onChange={handleInputChange}
                required
                className="cultural-input"
              />
            </div>
          </div>

          <div className="form-group">
            <Label>Tour Highlights (Max 20)</Label>
            <div className="highlights-input">
              <div className="flex gap-2 mb-3">
                <Input
                  value={newHighlight}
                  onChange={(e) => setNewHighlight(sanitizeInput(e.target.value))}
                  placeholder="Add a highlight"
                  maxLength={200}
                  className="cultural-input flex-1"
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addHighlight())}
                />
                <Button 
                  type="button" 
                  onClick={addHighlight} 
                  className="btn-secondary"
                  disabled={formData.highlights.length >= 20}
                >
                  <Plus size={16} />
                  Add
                </Button>
              </div>
              
              <div className="highlights-list">
                {formData.highlights.map((highlight, idx) => (
                  <div key={idx} className="highlight-item">
                    <span className="highlight-text">{highlight}</span>
                    <button
                      type="button"
                      onClick={() => removeHighlight(idx)}
                      className="highlight-remove"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="modal-actions">
            <Button type="submit" className="btn-primary">
              Save Tour
            </Button>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CulturalTourModal;
