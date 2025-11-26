
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { sanitizeInput } from '@/utils/inputValidation';

interface CulturalSite {
  id: number;
  name: string;
  hours: string;
  price: string;
  duration: string;
  note: string;
}

interface CulturalSiteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (site: Omit<CulturalSite, 'id'>, csrfToken: string) => void;
  site?: CulturalSite | null;
  csrfToken: string;
}

const CulturalSiteModal: React.FC<CulturalSiteModalProps> = ({
  isOpen,
  onClose,
  onSave,
  site,
  csrfToken
}) => {
  const [formData, setFormData] = useState({
    name: '',
    hours: '',
    price: '',
    duration: '',
    note: ''
  });

  useEffect(() => {
    if (site) {
      setFormData({
        name: site.name,
        hours: site.hours,
        price: site.price,
        duration: site.duration,
        note: site.note
      });
    } else {
      setFormData({
        name: '',
        hours: '',
        price: '',
        duration: '',
        note: ''
      });
    }
  }, [site, isOpen]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    // Sanitize input on change
    const sanitizedValue = sanitizeInput(value);
    setFormData(prev => ({
      ...prev,
      [name]: sanitizedValue
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.hours || !formData.price) {
      alert('Please fill in all required fields');
      return;
    }

    onSave(formData, csrfToken);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-xl cultural-modal">
        <DialogHeader>
          <DialogTitle className="section-title">
            {site ? 'Edit Heritage Site' : 'Add New Heritage Site'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Hidden CSRF token */}
          <input type="hidden" value={csrfToken} />
          
          <div className="form-group">
            <Label htmlFor="name">Site Name</Label>
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

          <div className="form-group">
            <Label htmlFor="hours">Opening Hours</Label>
            <Input
              id="hours"
              name="hours"
              value={formData.hours}
              onChange={handleInputChange}
              placeholder="e.g., 7:00 AM - 5:30 PM"
              required
              maxLength={50}
              className="cultural-input"
            />
          </div>

          <div className="form-group">
            <Label htmlFor="price">Entry Fee</Label>
            <Input
              id="price"
              name="price"
              value={formData.price}
              onChange={handleInputChange}
              placeholder="e.g., ~$30 USD"
              required
              maxLength={20}
              className="cultural-input"
            />
          </div>

          <div className="form-group">
            <Label htmlFor="duration">Recommended Duration</Label>
            <Input
              id="duration"
              name="duration"
              value={formData.duration}
              onChange={handleInputChange}
              placeholder="e.g., 3-4 hours"
              maxLength={30}
              className="cultural-input"
            />
          </div>

          <div className="form-group">
            <Label htmlFor="note">Special Note/Tip</Label>
            <Input
              id="note"
              name="note"
              value={formData.note}
              onChange={handleInputChange}
              placeholder="e.g., Early morning visit recommended"
              maxLength={300}
              className="cultural-input"
            />
          </div>

          <div className="modal-actions">
            <Button type="submit" className="btn-primary">
              Save Site
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

export default CulturalSiteModal;
