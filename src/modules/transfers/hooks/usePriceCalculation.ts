
import { useState, useCallback } from 'react';
import { priceService, type PriceBreakdown, type PriceCalculationRequest } from '../services/priceService';

export const usePriceCalculation = () => {
  const [isCalculating, setIsCalculating] = useState(false);
  const [priceBreakdown, setPriceBreakdown] = useState<PriceBreakdown | null>(null);
  const [error, setError] = useState<string | null>(null);

  const calculatePrice = useCallback(async (request: PriceCalculationRequest) => {
    setIsCalculating(true);
    setError(null);
    
    try {
      const breakdown = await priceService.calculatePrice(request);
      setPriceBreakdown(breakdown);
      return breakdown;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to calculate price';
      setError(errorMessage);
      setPriceBreakdown(null);
      throw err;
    } finally {
      setIsCalculating(false);
    }
  }, []);

  const clearPrice = useCallback(() => {
    setPriceBreakdown(null);
    setError(null);
  }, []);

  return {
    calculatePrice,
    clearPrice,
    isCalculating,
    priceBreakdown,
    error
  };
};
