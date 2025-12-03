import React, { createContext, useContext, useMemo, ReactNode } from 'react';
import { useDevice, DeviceInfo, DeviceType } from '@/hooks/useDevice';

// Context type
interface DeviceContextType extends DeviceInfo {
  // Additional context-specific helpers
  getResponsiveClass: (mobile: string, tablet: string, desktop: string) => string;
  getResponsiveStyle: <T>(mobile: T, tablet: T, desktop: T) => T;
}

// Create context with undefined default
const DeviceContext = createContext<DeviceContextType | undefined>(undefined);

// Provider props
interface DeviceProviderProps {
  children: ReactNode;
}

/**
 * DeviceProvider - Provides device information throughout the app
 * Wrap your app with this provider for optimal performance
 */
export function DeviceProvider({ children }: DeviceProviderProps) {
  const deviceInfo = useDevice();
  
  const contextValue = useMemo<DeviceContextType>(() => ({
    ...deviceInfo,
    
    // Helper to get responsive class names
    getResponsiveClass: (mobile: string, tablet: string, desktop: string) => {
      switch (deviceInfo.type) {
        case 'mobile': return mobile;
        case 'tablet': return tablet;
        case 'desktop': return desktop;
      }
    },
    
    // Helper to get responsive style values
    getResponsiveStyle: <T,>(mobile: T, tablet: T, desktop: T): T => {
      switch (deviceInfo.type) {
        case 'mobile': return mobile;
        case 'tablet': return tablet;
        case 'desktop': return desktop;
      }
    }
  }), [deviceInfo]);
  
  return (
    <DeviceContext.Provider value={contextValue}>
      {children}
    </DeviceContext.Provider>
  );
}

/**
 * Hook to access device context
 * Must be used within DeviceProvider
 */
export function useDeviceContext(): DeviceContextType {
  const context = useContext(DeviceContext);
  
  if (context === undefined) {
    throw new Error('useDeviceContext must be used within a DeviceProvider');
  }
  
  return context;
}

/**
 * Hook to safely access device context (returns null if not in provider)
 */
export function useSafeDeviceContext(): DeviceContextType | null {
  return useContext(DeviceContext) ?? null;
}

export default DeviceContext;
