/**
 * Responsive Components & Utilities
 * Professional device-aware rendering system for Recharge Travels
 * 
 * Usage Examples:
 * 
 * 1. Conditional Rendering:
 *    <MobileOnly>
 *      <MobileNavigation />
 *    </MobileOnly>
 *    <DesktopOnly>
 *      <DesktopSidebar />
 *    </DesktopOnly>
 * 
 * 2. With Fallback:
 *    <MobileOnly fallback={<DesktopMenu />}>
 *      <MobileMenu />
 *    </MobileOnly>
 * 
 * 3. Using Hooks:
 *    const { isMobile, isTablet, isDesktop } = useDevice();
 *    const padding = useResponsiveValue('p-2', 'p-4', 'p-8');
 * 
 * 4. Responsive Container:
 *    <ResponsiveContainer mobileClass="px-4" tabletClass="px-8" desktopClass="px-16">
 *      <Content />
 *    </ResponsiveContainer>
 */

// Re-export all conditional components
export {
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
} from './DeviceConditional';

// Re-export hooks
export {
  useDevice,
  useIsMobile,
  useIsTablet,
  useIsDesktop,
  useIsTouchDevice,
  useResponsiveValue,
  useBreakpointValue,
  BREAKPOINTS,
  type DeviceInfo,
  type DeviceType,
  type DeviceCapabilities,
  type Orientation
} from '@/hooks/useDevice';

// Re-export context
export {
  DeviceProvider,
  useDeviceContext,
  useSafeDeviceContext
} from '@/contexts/DeviceContext';

import React, { ReactNode, memo, HTMLAttributes } from 'react';
import { useDevice, useResponsiveValue } from '@/hooks/useDevice';
import { cn } from '@/lib/utils';

interface ResponsiveContainerProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  mobileClass?: string;
  tabletClass?: string;
  desktopClass?: string;
  as?: keyof JSX.IntrinsicElements;
}

/**
 * ResponsiveContainer - Container with device-specific classes
 * Automatically applies different classes based on device type
 */
export const ResponsiveContainer = memo(function ResponsiveContainer({
  children,
  mobileClass = '',
  tabletClass = '',
  desktopClass = '',
  className = '',
  as: Component = 'div',
  ...props
}: ResponsiveContainerProps) {
  const responsiveClass = useResponsiveValue(mobileClass, tabletClass, desktopClass);
  
  return React.createElement(
    Component,
    { className: cn(className, responsiveClass), ...props },
    children
  );
});

interface ResponsiveGridProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  mobileCols?: number;
  tabletCols?: number;
  desktopCols?: number;
  gap?: string;
}

/**
 * ResponsiveGrid - Grid with responsive column counts
 */
export const ResponsiveGrid = memo(function ResponsiveGrid({
  children,
  mobileCols = 1,
  tabletCols = 2,
  desktopCols = 3,
  gap = 'gap-4',
  className = '',
  ...props
}: ResponsiveGridProps) {
  const cols = useResponsiveValue(mobileCols, tabletCols, desktopCols);
  
  return (
    <div 
      className={cn('grid', gap, className)}
      style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}
      {...props}
    >
      {children}
    </div>
  );
});

interface ResponsiveTextProps extends HTMLAttributes<HTMLElement> {
  children: ReactNode;
  mobileSize?: string;
  tabletSize?: string;
  desktopSize?: string;
  as?: 'p' | 'span' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
}

/**
 * ResponsiveText - Text with responsive font sizes
 */
export const ResponsiveText = memo(function ResponsiveText({
  children,
  mobileSize = 'text-sm',
  tabletSize = 'text-base',
  desktopSize = 'text-lg',
  className = '',
  as: Component = 'p',
  ...props
}: ResponsiveTextProps) {
  const textSize = useResponsiveValue(mobileSize, tabletSize, desktopSize);
  
  return React.createElement(
    Component,
    { className: cn(textSize, className), ...props },
    children
  );
});

interface ResponsiveSpacingProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode;
  mobilePadding?: string;
  tabletPadding?: string;
  desktopPadding?: string;
  mobileMargin?: string;
  tabletMargin?: string;
  desktopMargin?: string;
}

/**
 * ResponsiveSpacing - Container with responsive padding/margin
 */
export const ResponsiveSpacing = memo(function ResponsiveSpacing({
  children,
  mobilePadding = 'p-4',
  tabletPadding = 'p-6',
  desktopPadding = 'p-8',
  mobileMargin = '',
  tabletMargin = '',
  desktopMargin = '',
  className = '',
  ...props
}: ResponsiveSpacingProps) {
  const padding = useResponsiveValue(mobilePadding, tabletPadding, desktopPadding);
  const margin = useResponsiveValue(mobileMargin, tabletMargin, desktopMargin);
  
  return (
    <div className={cn(padding, margin, className)} {...props}>
      {children}
    </div>
  );
});

/**
 * DeviceDebugger - Development tool to display current device info
 * Only renders in development mode
 */
export const DeviceDebugger = memo(function DeviceDebugger() {
  const device = useDevice();
  
  if (process.env.NODE_ENV !== 'development') return null;
  
  return (
    <div className="fixed bottom-4 right-4 z-[9999] bg-black/90 text-white text-xs p-3 rounded-lg shadow-xl font-mono max-w-[200px]">
      <div className="font-bold mb-2 text-emerald-400">Device Info</div>
      <div className="space-y-1">
        <div>Type: <span className="text-yellow-400">{device.type}</span></div>
        <div>Size: {device.width}×{device.height}</div>
        <div>Orientation: {device.orientation}</div>
        <div>Touch: {device.capabilities.hasTouch ? '✓' : '✗'}</div>
        <div>Online: {device.capabilities.isOnline ? '✓' : '✗'}</div>
        <div className="pt-1 border-t border-white/20 mt-1">
          <span className={device.isXs ? 'text-emerald-400' : ''}>xs</span>{' | '}
          <span className={device.isSm ? 'text-emerald-400' : ''}>sm</span>{' | '}
          <span className={device.isMd ? 'text-emerald-400' : ''}>md</span>{' | '}
          <span className={device.isLg ? 'text-emerald-400' : ''}>lg</span>{' | '}
          <span className={device.isXl ? 'text-emerald-400' : ''}>xl</span>{' | '}
          <span className={device.is2xl ? 'text-emerald-400' : ''}>2xl</span>
        </div>
      </div>
    </div>
  );
});

/**
 * Utility function to get responsive class string
 */
export function getResponsiveClasses(
  base: string,
  sm?: string,
  md?: string,
  lg?: string,
  xl?: string,
  xxl?: string
): string {
  return cn(
    base,
    sm && `sm:${sm}`,
    md && `md:${md}`,
    lg && `lg:${lg}`,
    xl && `xl:${xl}`,
    xxl && `2xl:${xxl}`
  );
}

/**
 * CSS-in-JS responsive styles generator
 */
export function createResponsiveStyles<T extends Record<string, unknown>>(
  mobile: T,
  tablet: Partial<T>,
  desktop: Partial<T>
): { mobile: T; tablet: T; desktop: T } {
  return {
    mobile,
    tablet: { ...mobile, ...tablet } as T,
    desktop: { ...mobile, ...tablet, ...desktop } as T
  };
}
