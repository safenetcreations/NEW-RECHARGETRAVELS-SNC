
import { useState, useCallback } from 'react';
import { dbService, authService, storageService } from '@/lib/firebase-services';

interface RateLimitOptions {
  maxAttempts: number;
  windowMinutes: number;
  action: string;
}

export const useRateLimit = () => {
  const [isBlocked, setIsBlocked] = useState(false);
  const [attemptsRemaining, setAttemptsRemaining] = useState<number | null>(null);
  const [blockUntil, setBlockUntil] = useState<Date | null>(null);

  const checkRateLimit = useCallback(async (
    identifier: string, 
    options: RateLimitOptions
  ): Promise<boolean> => {
    try {
      // First check if we're currently blocked
      const { data: existing } = await supabase
        .from('rate_limits')
        .select('*')
        .eq('identifier', identifier)
        .eq('action_type', options.action)
        .single();

      const now = new Date();
      
      if (existing) {
        const windowStart = new Date(existing.first_attempt_at);
        const windowEnd = new Date(windowStart.getTime() + options.windowMinutes * 60 * 1000);
        
        // Check if we're still in the same window
        if (now < windowEnd) {
          if (existing.attempt_count >= options.maxAttempts) {
            setIsBlocked(true);
            setBlockUntil(windowEnd);
            setAttemptsRemaining(0);
            return false;
          }
          
          // Increment attempt count
          const { error } = await supabase
            .from('rate_limits')
            .update({
              attempt_count: existing.attempt_count + 1,
              last_attempt_at: now.toISOString(),
              blocked_until: existing.attempt_count + 1 >= options.maxAttempts ? windowEnd.toISOString() : null
            })
            .eq('id', existing.id);

          if (error) throw error;
          
          setAttemptsRemaining(options.maxAttempts - (existing.attempt_count + 1));
          
          if (existing.attempt_count + 1 >= options.maxAttempts) {
            setIsBlocked(true);
            setBlockUntil(windowEnd);
            return false;
          }
          
          return true;
        } else {
          // Window expired, reset
          const { error } = await supabase
            .from('rate_limits')
            .update({
              attempt_count: 1,
              first_attempt_at: now.toISOString(),
              last_attempt_at: now.toISOString(),
              blocked_until: null
            })
            .eq('id', existing.id);

          if (error) throw error;
          setAttemptsRemaining(options.maxAttempts - 1);
          return true;
        }
      } else {
        // First attempt
        const { error } = await supabase
          .from('rate_limits')
          .insert({
            identifier,
            action_type: options.action,
            attempt_count: 1,
            first_attempt_at: now.toISOString(),
            last_attempt_at: now.toISOString()
          });

        if (error) throw error;
        setAttemptsRemaining(options.maxAttempts - 1);
        return true;
      }
    } catch (error) {
      console.error('Rate limit check failed:', error);
      // Allow by default if rate limiting fails
      return true;
    }
  }, []);

  const resetRateLimit = useCallback(async (identifier: string, action: string) => {
    try {
      await supabase
        .from('rate_limits')
        .delete()
        .eq('identifier', identifier)
        .eq('action_type', action);
      
      setIsBlocked(false);
      setAttemptsRemaining(null);
      setBlockUntil(null);
    } catch (error) {
      console.error('Failed to reset rate limit:', error);
    }
  }, []);

  return {
    checkRateLimit,
    resetRateLimit,
    isBlocked,
    attemptsRemaining,
    blockUntil
  };
};
