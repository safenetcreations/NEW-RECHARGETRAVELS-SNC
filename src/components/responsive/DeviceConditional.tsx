import React, { ReactNode, memo } from 'react';
import { useDevice, DeviceType, BREAKPOINTS } from '@/hooks/useDevice';

interface ConditionalProps {
  children: ReactNode;
  fallback?: ReactNode;
}

interface ResponsiveShowProps extends ConditionalProps {
  on: DeviceType | DeviceType[];
}

interface BreakpointProps extends ConditionalProps {
  min?: keyof typeof BREAKPOINTS;
  max?: keyof typeof BREAKPOINTS;
}

/**
 * MobileOnly - Renders children only on mobile devices (< 768px)
 * Perfect for mobile-specific navigation, touch-friendly UI elements
 */
export const MobileOnly = memo(function MobileOnly({ children, fallback = null }: ConditionalProps) {
  const { isMobile } = useDevice();
  return <>{isMobile ? children : fallback}</>;
});

/**
 * TabletOnly - Renders children only on tablet devices (768px - 1023px)
 * Use for tablet-specific layouts and components
 */
export const TabletOnly = memo(function TabletOnly({ children, fallback = null }: ConditionalProps) {
  const { isTablet } = useDevice();
  return <>{isTablet ? children : fallback}</>;
});

/**
 * DesktopOnly - Renders children only on desktop devices (>= 1024px)
 * Use for complex features, hover interactions, large data displays
 */
export const DesktopOnly = memo(function DesktopOnly({ children, fallback = null }: ConditionalProps) {
  const { isDesktop } = useDevice();
  return <>{isDesktop ? children : fallback}</>;
});

/**
 * MobileAndTablet - Renders on both mobile and tablet (< 1024px)
 * Use for touch-friendly UI that works on all portable devices
 */
export const MobileAndTablet = memo(function MobileAndTablet({ children, fallback = null }: ConditionalProps) {
  const { isMobile, isTablet } = useDevice();
  return <>{(isMobile || isTablet) ? children : fallback}</>;
});

/**
 * TabletAndDesktop - Renders on tablet and desktop (>= 768px)
 * Use for features that need more screen real estate
 */
export const TabletAndDesktop = memo(function TabletAndDesktop({ children, fallback = null }: ConditionalProps) {
  const { isTablet, isDesktop } = useDevice();
  return <>{(isTablet || isDesktop) ? children : fallback}</>;
});

/**
 * ResponsiveShow - Flexible component to show content on specific device types
 * @param on - Device type or array of device types to show on
 */
export const ResponsiveShow = memo(function ResponsiveShow({ 
  children, 
  fallback = null, 
  on 
}: ResponsiveShowProps) {
  const { type } = useDevice();
  const deviceTypes = Array.isArray(on) ? on : [on];
  return <>{deviceTypes.includes(type) ? children : fallback}</>;
});

/**
 * ResponsiveHide - Hide content on specific device types
 * @param on - Device type or array of device types to hide on
 */
export const ResponsiveHide = memo(function ResponsiveHide({ 
  children, 
  fallback = null, 
  on 
}: ResponsiveShowProps) {
  const { type } = useDevice();
  const deviceTypes = Array.isArray(on) ? on : [on];
  return <>{!deviceTypes.includes(type) ? children : fallback}</>;
});

/**
 * Breakpoint - Show content within specific breakpoint range
 * @param min - Minimum breakpoint (inclusive)
 * @param max - Maximum breakpoint (exclusive)
 */
export const Breakpoint = memo(function Breakpoint({ 
  children, 
  fallback = null,
  min,
  max 
}: BreakpointProps) {
  const { width } = useDevice();
  
  const minWidth = min ? BREAKPOINTS[min] : 0;
  const maxWidth = max ? BREAKPOINTS[max] : Infinity;
  
  const isInRange = width >= minWidth && width < maxWidth;
  
  return <>{isInRange ? children : fallback}</>;
});

/**
 * TouchDevice - Renders only on touch-capable devices
 * Use for touch-specific interactions
 */
export const TouchDevice = memo(function TouchDevice({ children, fallback = null }: ConditionalProps) {
  const { capabilities } = useDevice();
  return <>{capabilities.hasTouch ? children : fallback}</>;
});

/**
 * HoverDevice - Renders only on devices with hover capability
 * Use for hover-dependent features like tooltips
 */
export const HoverDevice = memo(function HoverDevice({ children, fallback = null }: ConditionalProps) {
  const { capabilities } = useDevice();
  return <>{capabilities.hasHover ? children : fallback}</>;
});

/**
 * PortraitOnly - Renders only in portrait orientation
 */
export const PortraitOnly = memo(function PortraitOnly({ children, fallback = null }: ConditionalProps) {
  const { orientation } = useDevice();
  return <>{orientation === 'portrait' ? children : fallback}</>;
});

/**
 * LandscapeOnly - Renders only in landscape orientation
 */
export const LandscapeOnly = memo(function LandscapeOnly({ children, fallback = null }: ConditionalProps) {
  const { orientation } = useDevice();
  return <>{orientation === 'landscape' ? children : fallback}</>;
});

/**
 * ReducedMotion - Renders when user prefers reduced motion
 * Use for accessibility-friendly animations
 */
export const ReducedMotion = memo(function ReducedMotion({ children, fallback = null }: ConditionalProps) {
  const { capabilities } = useDevice();
  return <>{capabilities.prefersReducedMotion ? children : fallback}</>;
});

/**
 * OnlineOnly - Renders only when device is online
 */
export const OnlineOnly = memo(function OnlineOnly({ children, fallback = null }: ConditionalProps) {
  const { capabilities } = useDevice();
  return <>{capabilities.isOnline ? children : fallback}</>;
});

/**
 * OfflineOnly - Renders only when device is offline
 */
export const OfflineOnly = memo(function OfflineOnly({ children, fallback = null }: ConditionalProps) {
  const { capabilities } = useDevice();
  return <>{!capabilities.isOnline ? children : fallback}</>;
});

// Export all components
export default {
  MobileOnly,
  TabletOnly,
  DesktopOnly,
  MobileAndTablet,
  TabletAndDesktop,
  ResponsiveShow,
  ResponsiveHide,
  Breakpoint,
  TouchDevice,
  HoverDevice,
  PortraitOnly,
  LandscapeOnly,
  ReducedMotion,
  OnlineOnly,
  OfflineOnly
};
