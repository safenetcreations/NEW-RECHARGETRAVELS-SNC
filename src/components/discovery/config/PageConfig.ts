export interface SriLankaPageConfig {
  // Display Settings
  defaultView: 'thumbnail' | 'map' | 'card';
  enableLiveThumbnails: boolean;
  refreshInterval: number; // in milliseconds
  enableImageSelection: boolean;
  
  // Map Settings
  googleMapsApiKey: string;
  mapCenter: { lat: number; lng: number };
  defaultZoom: number;
  mapStyles: google.maps.MapTypeStyle[];
  enableCustomMarkers: boolean;
  
  // Booking Settings
  enableInstantBooking: boolean;
  phoneNumber: string;
  bookingEmailTemplate: string;
  
  // UI Customization
  theme: {
    primaryColor: string;
    secondaryColor: string;
    accentColor: string;
    gradients: {
      hero: string;
      cards: string;
      buttons: string;
    };
    fonts: {
      heading: string;
      body: string;
    };
  };
  
  // Content Settings
  title: string;
  subtitle: string;
  description: string;
  seoKeywords: string[];
  
  // Filter Settings
  enableProvinceFilter: boolean;
  enableTypeFilter: boolean;
  enableRatingFilter: boolean;
  enablePriceFilter: boolean;
  
  // Animation Settings
  enableAnimations: boolean;
  transitionDuration: number;
  hoverEffects: boolean;
  
  // Performance Settings
  lazyLoading: boolean;
  imageCacheSize: number;
  enableServiceWorker: boolean;
}

// Default configuration
export const defaultConfig: SriLankaPageConfig = {
  // Display Settings
  defaultView: 'thumbnail',
  enableLiveThumbnails: true,
  refreshInterval: 30000,
  enableImageSelection: true,
  
  // Map Settings
  googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY || '',
  mapCenter: { lat: 7.8731, lng: 80.7718 },
  defaultZoom: 8,
  mapStyles: [], // Default Google Maps styling
  enableCustomMarkers: true,
  
  // Booking Settings
  enableInstantBooking: true,
  phoneNumber: '+94777721999',
  bookingEmailTemplate: 'booking-confirmation',
  
  // UI Customization
  theme: {
    primaryColor: '#3B82F6',
    secondaryColor: '#1E40AF',
    accentColor: '#F59E0B',
    gradients: {
      hero: 'from-blue-600 to-purple-700',
      cards: 'from-white to-blue-50',
      buttons: 'from-orange-500 to-red-500'
    },
    fonts: {
      heading: 'Playfair Display',
      body: 'Inter'
    }
  },
  
  // Content Settings
  title: 'Discover Sri Lanka\'s Treasures',
  subtitle: 'Interactive exploration with live updates and instant booking',
  description: 'Explore Sri Lanka\'s most beautiful destinations with our interactive discovery guide featuring live image updates, Google Maps integration, and instant booking capabilities.',
  seoKeywords: ['Sri Lanka', 'travel', 'tourism', 'destinations', 'booking', 'interactive map', 'live updates'],
  
  // Filter Settings
  enableProvinceFilter: true,
  enableTypeFilter: true,
  enableRatingFilter: false,
  enablePriceFilter: false,
  
  // Animation Settings
  enableAnimations: true,
  transitionDuration: 300,
  hoverEffects: true,
  
  // Performance Settings
  lazyLoading: true,
  imageCacheSize: 50,
  enableServiceWorker: false
};

// Feature flags for easy enabling/disabling
export const features = {
  LIVE_THUMBNAILS: true,
  GOOGLE_MAPS: true,
  INSTANT_BOOKING: true,
  IMAGE_SELECTION: true,
  PROVINCE_FILTER: true,
  SOCIAL_SHARING: true,
  OFFLINE_SUPPORT: false,
  ANALYTICS: true,
  CHATBOT: false,
  VIRTUAL_TOURS: false,
  WEATHER_INTEGRATION: false,
  REVIEWS_SYSTEM: true
};

// Environment-specific overrides
export const getConfig = (environment: 'development' | 'staging' | 'production' = 'production'): SriLankaPageConfig => {
  const config = { ...defaultConfig };
  
  switch (environment) {
    case 'development':
      return {
        ...config,
        enableLiveThumbnails: false,
        refreshInterval: 60000,
        enableAnimations: false,
        lazyLoading: false
      };
      
    case 'staging':
      return {
        ...config,
        refreshInterval: 45000,
        enableServiceWorker: true
      };
      
    case 'production':
    default:
      return {
        ...config,
        enableServiceWorker: true,
        lazyLoading: true,
        imageCacheSize: 100
      };
  }
};

// Utility functions for dynamic configuration
export const updateTheme = (theme: Partial<SriLankaPageConfig['theme']>) => {
  const updatedTheme = { ...defaultConfig.theme, ...theme };
  
  // Apply CSS custom properties
  const root = document.documentElement;
  root.style.setProperty('--primary-color', updatedTheme.primaryColor);
  root.style.setProperty('--secondary-color', updatedTheme.secondaryColor);
  root.style.setProperty('--accent-color', updatedTheme.accentColor);
  
  return updatedTheme;
};

export const validateConfig = (config: Partial<SriLankaPageConfig>): boolean => {
  // Basic validation
  if (config.refreshInterval && config.refreshInterval < 10000) {
    console.warn('Refresh interval too low, minimum 10 seconds');
    return false;
  }
  
  if (config.imageCacheSize && config.imageCacheSize > 200) {
    console.warn('Image cache size too large, maximum 200');
    return false;
  }
  
  return true;
};

// Responsive breakpoints for dynamic adjustments
export const breakpoints = {
  mobile: '(max-width: 768px)',
  tablet: '(min-width: 769px) and (max-width: 1024px)',
  desktop: '(min-width: 1025px)'
};

// Performance monitoring settings
export const performance = {
  enableMetrics: true,
  trackImageLoad: true,
  trackUserInteractions: true,
  reportThreshold: 2000, // Report slow operations > 2s
  batchSize: 10 // Batch analytics events
};