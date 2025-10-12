
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useSecurityAudit } from '@/hooks/useSecurityAudit';
import { validateBookingData, sanitizeInput } from '@/utils/inputValidation';
import { dbService, authService, storageService } from '@/lib/firebase-services';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';

interface SecureBookingFormProps {
  bookingType: 'hotel' | 'tour' | 'activity';
  itemId: string;
  onSuccess?: (bookingId: string) => void;
}

export const SecureBookingForm: React.FC<SecureBookingFormProps> = ({
  bookingType,
  itemId,
  onSuccess
}) => {
  const { user } = useAuth();
  const { logBookingEvent, logSuspiciousActivity } = useSecurityAudit();
  const { toast } = useToast();
  
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    user_name: '',
    user_email: '',
    check_in_date: '',
    check_out_date: '',
    number_of_guests: 1,
    special_requests: '',
    total_price: 0
  });
  
  const [errors, setErrors] = useState<string[]>([]);
  const [csrfToken, setCsrfToken] = useState('');

  useEffect(() => {
    // Generate CSRF token
    const token = crypto.randomUUID();
    setCsrfToken(token);
    sessionStorage.setItem('booking_csrf_token', token);
  }, []);

  const handleInputChange = (field: string, value: string | number) => {
    // Sanitize input
    const sanitizedValue = typeof value === 'string' ? sanitizeInput(value) : value;
    
    setFormData(prev => ({
      ...prev,
      [field]: sanitizedValue
    }));
    
    // Clear errors when user starts typing
    if (errors.length > 0) {
      setErrors([]);
    }
  };

  const validateForm = (): boolean => {
    const validation = validateBookingData(formData);
    
    if (!validation.isValid) {
      setErrors(validation.errors);
      return false;
    }
    
    // CSRF token validation
    const storedToken = sessionStorage.getItem('booking_csrf_token');
    if (!storedToken || storedToken !== csrfToken) {
      setErrors(['Security validation failed. Please refresh the page.']);
      logSuspiciousActivity('csrf_token_mismatch', { 
        bookingType,
        itemId,
        userId: user?.uid
      });
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    
    try {
      // Prepare booking data
      const bookingData = {
        ...formData,
        user_id: user?.uid,
        booking_type: bookingType,
        [`${bookingType}_id`]: itemId,
        status: 'pending'
      };
      
      // Insert booking
      const { data, error } = await supabase
        .from('bookings')
        .insert([bookingData])
        .select()
        .single();
      
      if (error) {
        throw error;
      }
      
      // Log successful booking
      await logBookingEvent('create', data.id, true, {
        bookingType,
        itemId,
        totalPrice: formData.total_price
      });
      
      // Clear CSRF token
      sessionStorage.removeItem('booking_csrf_token');
      
      toast({
        title: 'Booking Created',
        description: 'Your booking has been successfully created.',
      });
      
      if (onSuccess) {
        onSuccess(data.id);
      }
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      
      await logBookingEvent('create', '', false, {
        bookingType,
        itemId,
        error: errorMessage
      }, errorMessage);
      
      toast({
        title: 'Booking Failed',
        description: 'Failed to create booking. Please try again.',
        variant: 'destructive'
      });
      
      setErrors([errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input type="hidden" name="csrf_token" value={csrfToken} />
      
      {errors.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <h4 className="text-red-800 font-medium mb-2">Please fix the following errors:</h4>
          <ul className="text-red-700 text-sm space-y-1">
            {errors.map((error, index) => (
              <li key={index}>• {error}</li>
            ))}
          </ul>
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="user_name">Full Name *</Label>
          <Input
            id="user_name"
            type="text"
            required
            value={formData.user_name}
            onChange={(e) => handleInputChange('user_name', e.target.value)}
            maxLength={100}
          />
        </div>
        
        <div>
          <Label htmlFor="user_email">Email Address *</Label>
          <Input
            id="user_email"
            type="email"
            required
            value={formData.user_email}
            onChange={(e) => handleInputChange('user_email', e.target.value)}
            maxLength={254}
          />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="check_in_date">Check-in Date *</Label>
          <Input
            id="check_in_date"
            type="date"
            required
            value={formData.check_in_date}
            onChange={(e) => handleInputChange('check_in_date', e.target.value)}
            min={new Date().toISOString().split('T')[0]}
          />
        </div>
        
        <div>
          <Label htmlFor="check_out_date">Check-out Date *</Label>
          <Input
            id="check_out_date"
            type="date"
            required
            value={formData.check_out_date}
            onChange={(e) => handleInputChange('check_out_date', e.target.value)}
            min={formData.check_in_date || new Date().toISOString().split('T')[0]}
          />
        </div>
      </div>
      
      <div>
        <Label htmlFor="number_of_guests">Number of Guests *</Label>
        <Input
          id="number_of_guests"
          type="number"
          required
          min="1"
          max="20"
          value={formData.number_of_guests}
          onChange={(e) => handleInputChange('number_of_guests', parseInt(e.target.value))}
        />
      </div>
      
      <div>
        <Label htmlFor="special_requests">Special Requests</Label>
        <Textarea
          id="special_requests"
          value={formData.special_requests}
          onChange={(e) => handleInputChange('special_requests', e.target.value)}
          maxLength={500}
          placeholder="Any special requirements or requests..."
        />
      </div>
      
      <Button
        type="submit"
        disabled={loading}
        className="w-full"
      >
        {loading ? 'Creating Booking...' : 'Create Secure Booking'}
      </Button>
    </form>
  );
};
