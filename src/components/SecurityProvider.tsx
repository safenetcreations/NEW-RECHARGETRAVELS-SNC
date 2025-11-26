
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useSecureAuth } from '@/hooks/useSecureAuth';

interface SecurityContextType {
  securityHeaders: Record<string, string>;
  auditLog: (action: string, resource: string, details?: any) => void;
  validateCSP: () => boolean;
}

const SecurityContext = createContext<SecurityContextType | undefined>(undefined);

export const useSecurityContext = () => {
  const context = useContext(SecurityContext);
  if (!context) {
    throw new Error('useSecurityContext must be used within SecurityProvider');
  }
  return context;
};

interface SecurityProviderProps {
  children: React.ReactNode;
}

export const SecurityProvider: React.FC<SecurityProviderProps> = ({ children }) => {
  const { logSecurityEvent } = useSecureAuth();
  const [securityHeaders] = useState({
    'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline' https://maps.googleapis.com https://maps.gstatic.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https: blob:; connect-src 'self' https://nqnnsqbeyjeuyvwsywyc.supabase.co https://maps.googleapis.com;",
    'X-Frame-Options': 'DENY',
    'X-Content-Type-Options': 'nosniff',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
  });

  useEffect(() => {
    // Set security headers (this would typically be done on the server)
    Object.entries(securityHeaders).forEach(([key, value]) => {
      const meta = document.createElement('meta');
      meta.httpEquiv = key;
      meta.content = value;
      document.head.appendChild(meta);
    });

    // Monitor for suspicious activity
    const handleRightClick = (e: MouseEvent) => {
      // Allow right-click in development
      if (process.env.NODE_ENV === 'development') return;
      
      e.preventDefault();
      auditLog('suspicious_activity', 'right_click_attempt');
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      // Prevent common inspection shortcuts in production
      if (process.env.NODE_ENV === 'development') return;
      
      if (e.key === 'F12' || 
          (e.ctrlKey && e.shiftKey && e.key === 'I') ||
          (e.ctrlKey && e.shiftKey && e.key === 'C') ||
          (e.ctrlKey && e.key === 'U')) {
        e.preventDefault();
        auditLog('suspicious_activity', 'dev_tools_attempt');
      }
    };

    document.addEventListener('contextmenu', handleRightClick);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('contextmenu', handleRightClick);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const auditLog = async (action: string, resource: string, details?: any) => {
    try {
      await logSecurityEvent(action, resource, Date.now().toString(), details);
    } catch (error) {
      console.error('Failed to log security event:', error);
    }
  };

  const validateCSP = (): boolean => {
    const meta = document.querySelector('meta[http-equiv="Content-Security-Policy"]');
    return meta !== null;
  };

  const value = {
    securityHeaders,
    auditLog,
    validateCSP
  };

  return (
    <SecurityContext.Provider value={value}>
      {children}
    </SecurityContext.Provider>
  );
};
