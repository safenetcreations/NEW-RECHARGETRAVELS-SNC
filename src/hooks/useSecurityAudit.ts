
import { useCallback } from 'react';
import { dbService, authService, storageService } from '@/lib/firebase-services';

export const useSecurityAudit = () => {
  const logSecurityEvent = useCallback(async (
    eventType: string,
    tableName: string,
    recordId?: string,
    details: Record<string, any> = {},
    success: boolean = true,
    errorMessage?: string
  ) => {
    try {
      // Get user agent and IP (IP will be set server-side)
      const userAgent = navigator.userAgent;
      
      await supabase.rpc('log_security_event', {
        p_event_type: eventType,
        p_table_name: tableName,
        p_record_id: recordId || null,
        p_details: details,
        p_success: success,
        p_error_message: errorMessage || null
      });
    } catch (error) {
      console.error('Failed to log security event:', error);
      // Don't throw - security logging should not break the app
    }
  }, []);

  const logAuthEvent = useCallback(async (
    action: 'login' | 'logout' | 'signup' | 'password_reset',
    success: boolean,
    details: Record<string, any> = {},
    errorMessage?: string
  ) => {
    await logSecurityEvent(
      `auth_${action}`,
      'auth.users',
      undefined,
      details,
      success,
      errorMessage
    );
  }, [logSecurityEvent]);

  const logBookingEvent = useCallback(async (
    action: 'create' | 'update' | 'cancel',
    bookingId: string,
    success: boolean,
    details: Record<string, any> = {},
    errorMessage?: string
  ) => {
    await logSecurityEvent(
      `booking_${action}`,
      'bookings',
      bookingId,
      details,
      success,
      errorMessage
    );
  }, [logSecurityEvent]);

  const logSuspiciousActivity = useCallback(async (
    activity: string,
    details: Record<string, any> = {}
  ) => {
    await logSecurityEvent(
      'suspicious_activity',
      'security',
      undefined,
      { activity, ...details },
      true
    );
  }, [logSecurityEvent]);

  return {
    logSecurityEvent,
    logAuthEvent,
    logBookingEvent,
    logSuspiciousActivity
  };
};
