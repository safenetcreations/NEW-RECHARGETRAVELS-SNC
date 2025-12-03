/**
 * Mobile Detection Hook (Backward Compatible)
 * This file now re-exports from the comprehensive useDevice system
 * for backward compatibility with existing components
 */

// Re-export from the new comprehensive device detection system
export { useIsMobile } from './useDevice';

// Also export additional hooks for convenience
export { 
  useIsTablet, 
  useIsDesktop, 
  useDevice,
  useIsTouchDevice,
  useResponsiveValue,
  useBreakpointValue,
  BREAKPOINTS 
} from './useDevice';

// Legacy constant export for backward compatibility
export const MOBILE_BREAKPOINT = 768;
