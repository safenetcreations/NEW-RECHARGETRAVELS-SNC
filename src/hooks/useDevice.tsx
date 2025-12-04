import { useState, useEffect, useCallback, useMemo } from 'react';

// Professional breakpoints following industry standards
export const BREAKPOINTS = {
  xs: 0,      // Extra small phones
  sm: 480,    // Small phones
  md: 768,    // Tablets
  lg: 1024,   // Small laptops / large tablets
  xl: 1280,   // Desktops
  '2xl': 1536 // Large desktops
} as const;

export type DeviceType = 'mobile' | 'tablet' | 'desktop';
export type Orientation = 'portrait' | 'landscape';

export interface DeviceCapabilities {
  hasTouch: boolean;
  hasHover: boolean;
  hasFinePointer: boolean;
  hasCoarsePointer: boolean;
  prefersReducedMotion: boolean;
  prefersReducedData: boolean;
  prefersDarkMode: boolean;
  isStandalone: boolean; // PWA mode
  isOnline: boolean;
  connectionType: string | null;
  deviceMemory: number | null;
  hardwareConcurrency: number;
}

export interface DeviceInfo {
  // Device type detection
  type: DeviceType;
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;

  // Screen dimensions
  width: number;
  height: number;
  orientation: Orientation;

  // Breakpoint helpers
  isXs: boolean;  // < 480px
  isSm: boolean;  // 480px - 767px
  isMd: boolean;  // 768px - 1023px
  isLg: boolean;  // 1024px - 1279px
  isXl: boolean;  // 1280px - 1535px
  is2xl: boolean; // >= 1536px

  // Range helpers
  isSmAndUp: boolean;
  isMdAndUp: boolean;
  isLgAndUp: boolean;
  isXlAndUp: boolean;
  isSmAndDown: boolean;
  isMdAndDown: boolean;
  isLgAndDown: boolean;

  // Device capabilities
  capabilities: DeviceCapabilities;

  // User agent parsing (for specific device detection)
  isIOS: boolean;
  isAndroid: boolean;
  isSafari: boolean;
  isChrome: boolean;
  isFirefox: boolean;

  // Viewport info
  viewportScale: number;
  pixelRatio: number;
}

// Detect device type based on screen width and user agent
function detectDeviceType(width: number): DeviceType {
  if (width < BREAKPOINTS.md) return 'mobile';
  if (width < BREAKPOINTS.lg) return 'tablet';
  return 'desktop';
}

// Parse user agent for specific device info
function parseUserAgent() {
  if (typeof window === 'undefined') {
    return { isIOS: false, isAndroid: false, isSafari: false, isChrome: false, isFirefox: false };
  }

  const ua = navigator.userAgent.toLowerCase();
  return {
    isIOS: /iphone|ipad|ipod/.test(ua) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1),
    isAndroid: /android/.test(ua),
    isSafari: /safari/.test(ua) && !/chrome/.test(ua),
    isChrome: /chrome/.test(ua) && !/edge/.test(ua),
    isFirefox: /firefox/.test(ua)
  };
}

// Detect device capabilities
function detectCapabilities(): DeviceCapabilities {
  if (typeof window === 'undefined') {
    return {
      hasTouch: false,
      hasHover: true,
      hasFinePointer: true,
      hasCoarsePointer: false,
      prefersReducedMotion: false,
      prefersReducedData: false,
      prefersDarkMode: false,
      isStandalone: false,
      isOnline: true,
      connectionType: null,
      deviceMemory: null,
      hardwareConcurrency: 4
    };
  }

  const hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  const hasHover = window.matchMedia('(hover: hover)').matches;
  const hasFinePointer = window.matchMedia('(pointer: fine)').matches;
  const hasCoarsePointer = window.matchMedia('(pointer: coarse)').matches;
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const prefersReducedData = window.matchMedia('(prefers-reduced-data: reduce)').matches;
  const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const isStandalone = window.matchMedia('(display-mode: standalone)').matches;

  // Network info (experimental API)
  const connection = (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection;

  return {
    hasTouch,
    hasHover,
    hasFinePointer,
    hasCoarsePointer,
    prefersReducedMotion,
    prefersReducedData,
    prefersDarkMode,
    isStandalone,
    isOnline: navigator.onLine,
    connectionType: connection?.effectiveType || null,
    deviceMemory: (navigator as any).deviceMemory || null,
    hardwareConcurrency: navigator.hardwareConcurrency || 4
  };
}

/**
 * Professional device detection hook
 * Provides comprehensive device information for responsive design
 */
export function useDevice(): DeviceInfo {
  const [dimensions, setDimensions] = useState(() => {
    if (typeof window === 'undefined') {
      return { width: 375, height: 667 }; // Default to mobile size for SSR/Initial render safety
    }
    return { width: window.innerWidth, height: window.innerHeight };
  });

  const [capabilities, setCapabilities] = useState<DeviceCapabilities>(detectCapabilities);
  const [isOnline, setIsOnline] = useState(typeof navigator !== 'undefined' ? navigator.onLine : true);

  // Handle resize with debounce for performance
  useEffect(() => {
    if (typeof window === 'undefined') return;

    let timeoutId: NodeJS.Timeout;

    const handleResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        setDimensions({
          width: window.innerWidth,
          height: window.innerHeight
        });
      }, 100); // Debounce 100ms
    };

    // Also listen to orientation change for mobile devices
    const handleOrientationChange = () => {
      // Wait for the orientation change to complete
      setTimeout(() => {
        setDimensions({
          width: window.innerWidth,
          height: window.innerHeight
        });
      }, 100);
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleOrientationChange);

    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleOrientationChange);
    };
  }, []);

  // Handle online/offline status
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Update capabilities when media queries change
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const queries = [
      window.matchMedia('(hover: hover)'),
      window.matchMedia('(prefers-reduced-motion: reduce)'),
      window.matchMedia('(prefers-color-scheme: dark)')
    ];

    const handleChange = () => {
      setCapabilities(detectCapabilities());
    };

    queries.forEach(mq => {
      mq.addEventListener('change', handleChange);
    });

    return () => {
      queries.forEach(mq => {
        mq.removeEventListener('change', handleChange);
      });
    };
  }, []);

  // Memoize the device info object
  const deviceInfo = useMemo<DeviceInfo>(() => {
    const { width, height } = dimensions;
    const type = detectDeviceType(width);
    const userAgent = parseUserAgent();

    return {
      // Device type
      type,
      isMobile: type === 'mobile',
      isTablet: type === 'tablet',
      isDesktop: type === 'desktop',

      // Screen dimensions
      width,
      height,
      orientation: width > height ? 'landscape' : 'portrait',

      // Exact breakpoint
      isXs: width < BREAKPOINTS.sm,
      isSm: width >= BREAKPOINTS.sm && width < BREAKPOINTS.md,
      isMd: width >= BREAKPOINTS.md && width < BREAKPOINTS.lg,
      isLg: width >= BREAKPOINTS.lg && width < BREAKPOINTS.xl,
      isXl: width >= BREAKPOINTS.xl && width < BREAKPOINTS['2xl'],
      is2xl: width >= BREAKPOINTS['2xl'],

      // Range helpers (mobile-first approach)
      isSmAndUp: width >= BREAKPOINTS.sm,
      isMdAndUp: width >= BREAKPOINTS.md,
      isLgAndUp: width >= BREAKPOINTS.lg,
      isXlAndUp: width >= BREAKPOINTS.xl,
      isSmAndDown: width < BREAKPOINTS.md,
      isMdAndDown: width < BREAKPOINTS.lg,
      isLgAndDown: width < BREAKPOINTS.xl,

      // Capabilities
      capabilities: {
        ...capabilities,
        isOnline
      },

      // User agent
      ...userAgent,

      // Viewport info
      viewportScale: typeof window !== 'undefined'
        ? (window.visualViewport?.scale || 1)
        : 1,
      pixelRatio: typeof window !== 'undefined'
        ? window.devicePixelRatio || 1
        : 1
    };
  }, [dimensions, capabilities, isOnline]);

  return deviceInfo;
}

/**
 * Simple hook for mobile detection (backward compatible)
 */
export function useIsMobile(): boolean {
  const { isMobile } = useDevice();
  return isMobile;
}

/**
 * Simple hook for tablet detection
 */
export function useIsTablet(): boolean {
  const { isTablet } = useDevice();
  return isTablet;
}

/**
 * Simple hook for desktop detection
 */
export function useIsDesktop(): boolean {
  const { isDesktop } = useDevice();
  return isDesktop;
}

/**
 * Hook for checking if touch device
 */
export function useIsTouchDevice(): boolean {
  const { capabilities } = useDevice();
  return capabilities.hasTouch;
}

/**
 * Hook for responsive value selection
 * Returns value based on current device type
 */
export function useResponsiveValue<T>(
  mobileValue: T,
  tabletValue: T,
  desktopValue: T
): T {
  const { type } = useDevice();

  switch (type) {
    case 'mobile':
      return mobileValue;
    case 'tablet':
      return tabletValue;
    case 'desktop':
      return desktopValue;
  }
}

/**
 * Hook for breakpoint-based value selection
 */
export function useBreakpointValue<T>(values: {
  base: T;
  sm?: T;
  md?: T;
  lg?: T;
  xl?: T;
  '2xl'?: T;
}): T {
  const device = useDevice();

  if (device.is2xl && values['2xl'] !== undefined) return values['2xl'];
  if (device.isXlAndUp && values.xl !== undefined) return values.xl;
  if (device.isLgAndUp && values.lg !== undefined) return values.lg;
  if (device.isMdAndUp && values.md !== undefined) return values.md;
  if (device.isSmAndUp && values.sm !== undefined) return values.sm;

  return values.base;
}

export default useDevice;
