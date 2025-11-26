import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';
import { Booking } from '../../../services/firebaseBookingService';

interface BookingFormDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Partial<Booking>) => void;
  booking?: Booking | null;
}

const BookingFormDialog: React.FC<BookingFormDialogProps> = ({
  isOpen,
  onClose,
  onSubmit,
  booking,
}) => {
  const [formData, setFormData] = useState({
    userId: '',
    tourId: '',
    hotelId: '',
    bookingDate: '',
    status: 'pending',
    totalPrice: 0,
  });

  const statuses = ['pending', 'confirmed', 'cancelled'];

  useEffect(() => {
    if (booking) {
      setFormData({
        userId: booking.userId || '',
        tourId: booking.tourId || '',
        hotelId: booking.hotelId || '',
        bookingDate: booking.bookingDate || '',
        status: booking.status || 'pending',
        totalPrice: booking.totalPrice || 0,
      });
    } else {
      setFormData({
        userId: '',
        tourId: '',
        hotelId: '',
        bookingDate: '',
        status: 'pending',
        totalPrice: 0,
      });
    }
  }, [booking, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleNumberChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: parseFloat(value) || 0 }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.userId.trim()) {
      toast.error('Please enter a user ID');
      return;
    }

    onSubmit(formData);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            {booking ? 'Edit Booking' : 'Create New Booking'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="userId">User ID *</Label>
              <Input
                id="userId"
                name="userId"
                value={formData.userId}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <Label htmlFor="tourId">Tour ID</Label>
              <Input
                id="tourId"
                name="tourId"
                value={formData.tourId}
                onChange={handleChange}
              />
            </div>

            <div>
              <Label htmlFor="hotelId">Hotel ID</Label>
              <Input
                id="hotelId"
                name="hotelId"
                value={formData.hotelId}
                onChange={handleChange}
              />
            </div>

            <div>
              <Label htmlFor="bookingDate">Booking Date</Label>
              <Input
                id="bookingDate"
                name="bookingDate"
                type="date"
                value={formData.bookingDate}
                onChange={handleChange}
              />
            </div>

            <div>
              <Label htmlFor="status">Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value) => handleSelectChange('status', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {statuses.map((status) => (
                    <SelectItem key={status} value={status}>
                      {status}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="totalPrice">Total Price ($)</Label>
              <Input
                id="totalPrice"
                type="number"
                min="0"
                step="1"
                value={formData.totalPrice}
                onChange={(e) => handleNumberChange('totalPrice', e.target.value)}
              />
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
            >
              {booking ? 'Update Booking' : 'Create Booking'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default BookingFormDialog;
