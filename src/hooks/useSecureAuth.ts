
import { useAuth } from '@/hooks/useAuth';
import { useEffect, useState } from 'react';
import { dbService, authService, storageService } from '@/lib/firebase-services';

interface SecurityCheck {
  isValid: boolean;
  role: string;
  permissions: string[];
  lastLogin: string | null;
}

export const useSecureAuth = () => {
  const { user } = useAuth();
  const [securityCheck, setSecurityCheck] = useState<SecurityCheck | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      validateSession();
    } else {
      setSecurityCheck(null);
      setLoading(false);
    }
  }, [user]);

  const validateSession = async () => {
    try {
      // Verify session is still valid
      const { data: { session: currentSession }, error } = await supabase.auth.getSession();
      
      if (error || !currentSession) {
        throw new Error('Invalid session');
      }

      // Get user profile with proper error handling - using existing profiles table
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('is_admin, email, full_name')
        .eq('id', user.uid)
        .single();

      if (profileError) {
        console.error('Profile fetch error:', profileError);
        // Don't default to any permissions on error
        setSecurityCheck({
          isValid: false,
          role: 'guest',
          permissions: [],
          lastLogin: null
        });
        return;
      }

      // Determine role based on available data
      let role = 'customer';
      if (profile?.is_admin) {
        role = 'admin';
      } else if (user.email?.includes('admin')) {
        // Fallback admin check
        role = 'admin';
      }

      // Define permissions based on role with strict validation
      const getPermissions = (userRole: string): string[] => {
        switch (userRole) {
          case 'admin':
            return ['read', 'write', 'delete', 'admin'];
          case 'manager':
            return ['read', 'write'];
          case 'guide':
            return ['read'];
          case 'customer':
            return ['read'];
          default:
            return []; // No permissions for unknown roles
        }
      };

      setSecurityCheck({
        isValid: true,
        role: role,
        permissions: getPermissions(role),
        lastLogin: null // Not available in current schema
      });

    } catch (error) {
      console.error('Security validation failed:', error);
      setSecurityCheck({
        isValid: false,
        role: 'guest',
        permissions: [],
        lastLogin: null
      });
      
      // Log security event with proper error handling
      try {
        await supabase.rpc('log_security_event', {
          p_action: 'auth_validation_failed',
          p_resource_type: 'auth',
          p_resource_id: user?.uid || 'unknown',
          p_success: false,
          p_error_message: error instanceof Error ? error.message : 'Unknown error'
        });
      } catch (logError) {
        console.error('Failed to log security event:', logError);
        // Continue without logging if RPC function doesn't exist
      }
    } finally {
      setLoading(false);
    }
  };

  const logSecurityEvent = async (
    eventType: string, 
    tableName: string, 
    recordId: string, 
    details: Record<string, any> = {}
  ) => {
    try {
      await supabase.rpc('log_security_event', {
        p_action: eventType,
        p_resource_type: tableName,
        p_resource_id: recordId,
        p_success: true,
        p_metadata: details
      });
    } catch (error) {
      console.error('Failed to log security event:', error);
      // Continue without logging if RPC function doesn't exist
    }
  };

  const hasPermission = (permission: string): boolean => {
    return securityCheck?.permissions.includes(permission) || false;
  };

  const requireAuth = (): boolean => {
    if (!securityCheck?.isValid) {
      throw new Error('Authentication required');
    }
    return true;
  };

  const requirePermission = (permission: string): boolean => {
    requireAuth();
    if (!hasPermission(permission)) {
      throw new Error(`Permission '${permission}' required`);
    }
    return true;
  };

  const isAdmin = (): boolean => {
    return securityCheck?.role === 'admin' && hasPermission('admin');
  };

  return {
    securityCheck,
    loading,
    hasPermission,
    requireAuth,
    requirePermission,
    isAdmin,
    logSecurityEvent,
    validateSession
  };
};
