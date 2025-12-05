import { useState, useCallback } from 'react';
import { useB2BAuth } from '@/contexts/B2BAuthContext';
import {
  B2BTour,
  B2BBooking,
  B2BBookingRequest,
  B2BApiResponse,
  B2BPriceCalculation
} from '@/types/b2b';

const B2B_API_BASE = '/api/b2b';

export const useB2BApi = () => {
  const { token } = useB2BAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getAuthHeaders = useCallback(() => ({
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
  }), [token]);

  // Tours API
  const getTours = useCallback(async (params?: {
    category?: string;
    minPrice?: number;
    maxPrice?: number;
    page?: number;
    limit?: number;
  }): Promise<B2BApiResponse<B2BTour[]>> => {
    setLoading(true);
    setError(null);
    try {
      const queryParams = new URLSearchParams();
      if (params?.category) queryParams.append('category', params.category);
      if (params?.minPrice) queryParams.append('minPrice', params.minPrice.toString());
      if (params?.maxPrice) queryParams.append('maxPrice', params.maxPrice.toString());
      if (params?.page) queryParams.append('page', params.page.toString());
      if (params?.limit) queryParams.append('limit', params.limit.toString());

      const response = await fetch(`${B2B_API_BASE}/tours?${queryParams}`, {
        headers: getAuthHeaders(),
      });
      return await response.json();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch tours';
      setError(message);
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  }, [getAuthHeaders]);

  const getTourById = useCallback(async (tourId: string): Promise<B2BApiResponse<B2BTour>> => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${B2B_API_BASE}/tours/${tourId}`, {
        headers: getAuthHeaders(),
      });
      return await response.json();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch tour';
      setError(message);
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  }, [getAuthHeaders]);

  // Bookings API
  const createBooking = useCallback(async (
    bookingData: B2BBookingRequest
  ): Promise<B2BApiResponse<B2BBooking>> => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${B2B_API_BASE}/bookings`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(bookingData),
      });
      return await response.json();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to create booking';
      setError(message);
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  }, [getAuthHeaders]);

  const getBookings = useCallback(async (params?: {
    status?: string;
    page?: number;
    limit?: number;
  }): Promise<B2BApiResponse<B2BBooking[]>> => {
    setLoading(true);
    setError(null);
    try {
      const queryParams = new URLSearchParams();
      if (params?.status) queryParams.append('status', params.status);
      if (params?.page) queryParams.append('page', params.page.toString());
      if (params?.limit) queryParams.append('limit', params.limit.toString());

      const response = await fetch(`${B2B_API_BASE}/bookings?${queryParams}`, {
        headers: getAuthHeaders(),
      });
      return await response.json();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch bookings';
      setError(message);
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  }, [getAuthHeaders]);

  const cancelBooking = useCallback(async (
    bookingId: string
  ): Promise<B2BApiResponse> => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${B2B_API_BASE}/bookings/${bookingId}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });
      return await response.json();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to cancel booking';
      setError(message);
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  }, [getAuthHeaders]);

  // Price Calculator (client-side preview)
  const calculatePrice = useCallback((
    basePrice: number,
    guestCount: number
  ): B2BPriceCalculation => {
    const discountPercentage = 15;
    const grossCents = Math.round(basePrice * guestCount * 100);
    const discountCents = Math.floor(grossCents * (discountPercentage / 100));
    const netCents = grossCents - discountCents;

    return {
      originalPrice: grossCents / 100,
      discountPercentage,
      discount: discountCents / 100,
      finalPrice: netCents / 100,
    };
  }, []);

  // Document Upload
  const uploadDocument = useCallback(async (
    bookingId: string,
    file: File
  ): Promise<B2BApiResponse<{ downloadUrl: string }>> => {
    setLoading(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('bookingId', bookingId);

      const response = await fetch(`${B2B_API_BASE}/documents/upload`, {
        method: 'POST',
        headers: {
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: formData,
      });
      return await response.json();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to upload document';
      setError(message);
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  }, [token]);

  return {
    loading,
    error,
    getTours,
    getTourById,
    createBooking,
    getBookings,
    cancelBooking,
    calculatePrice,
    uploadDocument,
  };
};
