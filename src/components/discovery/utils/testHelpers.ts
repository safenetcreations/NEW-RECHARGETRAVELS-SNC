import { TouristLocation } from '../types';

// Test data generator for comprehensive testing
export const generateTestLocation = (override: Partial<TouristLocation> = {}): TouristLocation => ({
  id: Date.now(),
  name: 'Test Location',
  type: 'cultural',
  lat: 7.8731,
  lng: 80.7718,
  description: 'A beautiful test location for testing purposes',
  wikipedia: 'https://en.wikipedia.org/wiki/Test_Location',
  rating: 4.5,
  reviews: 100,
  priceRange: '$50-100',
  openingHours: '8:00 AM - 6:00 PM',
  bestTimeToVisit: 'All year',
  accessibility: 'Good',
  languages: ['English', 'Sinhala'],
  facilities: ['Parking', 'Restrooms'],
  weatherSensitive: false,
  crowdLevel: 'Medium',
  photography: 'Allowed',
  imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop',
  ...override
});

// Performance testing utilities
export const measurePerformance = (name: string, fn: () => void): number => {
  const startTime = performance.now();
  fn();
  const endTime = performance.now();
  const duration = endTime - startTime;
  
  console.log(`⏱️ ${name}: ${duration.toFixed(2)}ms`);
  return duration;
};

// Image loading test
export const testImageLoading = (imageUrl: string): Promise<boolean> => {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      console.log(`✅ Image loaded successfully: ${imageUrl}`);
      resolve(true);
    };
    img.onerror = () => {
      console.log(`❌ Image failed to load: ${imageUrl}`);
      resolve(false);
    };
    img.src = imageUrl;
  });
};

// Google Maps API test
export const testGoogleMapsAPI = (): boolean => {
  const hasGoogleMaps = typeof window !== 'undefined' && 
                       window.google && 
                       window.google.maps;
  
  if (hasGoogleMaps) {
    console.log('✅ Google Maps API is available');
    return true;
  } else {
    console.log('❌ Google Maps API is not available');
    return false;
  }
};

// Booking functionality test
export const testBookingFlow = async (location: TouristLocation): Promise<boolean> => {
  try {
    // Simulate booking API call
    console.log(`📅 Testing booking for ${location.name}`);
    
    // Mock API response delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    console.log('✅ Booking flow test completed successfully');
    return true;
  } catch (error) {
    console.log('❌ Booking flow test failed:', error);
    return false;
  }
};

// Responsive design test
export const testResponsiveDesign = (): void => {
  const breakpoints = {
    mobile: '(max-width: 768px)',
    tablet: '(min-width: 769px) and (max-width: 1024px)',
    desktop: '(min-width: 1025px)'
  };
  
  Object.entries(breakpoints).forEach(([name, query]) => {
    if (window.matchMedia(query).matches) {
      console.log(`📱 Current breakpoint: ${name}`);
    }
  });
};

// Filter functionality test
export const testFilters = (locations: TouristLocation[]): void => {
  console.log('🔍 Testing filter functionality...');
  
  // Test type filter
  const types = [...new Set(locations.map(loc => loc.type))];
  types.forEach(type => {
    const filtered = locations.filter(loc => loc.type === type);
    console.log(`📊 ${type}: ${filtered.length} locations`);
  });
  
  // Test rating filter
  const highRated = locations.filter(loc => loc.rating >= 4.5);
  console.log(`⭐ High rated (4.5+): ${highRated.length} locations`);
  
  console.log('✅ Filter tests completed');
};

// Search functionality test
export const testSearch = (locations: TouristLocation[], query: string): TouristLocation[] => {
  console.log(`🔎 Testing search for: "${query}"`);
  
  const results = locations.filter(location => 
    location.name.toLowerCase().includes(query.toLowerCase()) ||
    location.description.toLowerCase().includes(query.toLowerCase())
  );
  
  console.log(`📝 Search results: ${results.length} matches`);
  return results;
};

// Live updates test
export const testLiveUpdates = (): void => {
  console.log('🔴 Testing live updates functionality...');
  
  const startTime = Date.now();
  const testInterval = setInterval(() => {
    const elapsed = Date.now() - startTime;
    console.log(`🔄 Live update tick: ${Math.floor(elapsed / 1000)}s`);
    
    if (elapsed > 5000) { // Test for 5 seconds
      clearInterval(testInterval);
      console.log('✅ Live updates test completed');
    }
  }, 1000);
};

// Accessibility test
export const testAccessibility = (): void => {
  console.log('♿ Testing accessibility features...');
  
  // Check for alt texts
  const images = document.querySelectorAll('img');
  const imagesWithoutAlt = Array.from(images).filter(img => !img.alt);
  
  if (imagesWithoutAlt.length > 0) {
    console.log(`⚠️ ${imagesWithoutAlt.length} images missing alt text`);
  } else {
    console.log('✅ All images have alt text');
  }
  
  // Check for proper heading structure
  const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
  console.log(`📝 Found ${headings.length} headings`);
  
  // Check for keyboard navigation
  const focusableElements = document.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
  console.log(`⌨️ Found ${focusableElements.length} focusable elements`);
  
  console.log('✅ Accessibility test completed');
};

// Memory usage test
export const testMemoryUsage = (): void => {
  if ('performance' in window && 'memory' in (window.performance as any)) {
    const memory = (window.performance as any).memory;
    console.log('💾 Memory usage:', {
      used: `${Math.round(memory.usedJSHeapSize / 1048576)}MB`,
      total: `${Math.round(memory.totalJSHeapSize / 1048576)}MB`,
      limit: `${Math.round(memory.jsHeapSizeLimit / 1048576)}MB`
    });
  } else {
    console.log('❌ Memory usage API not available');
  }
};

// Comprehensive test suite
export const runComprehensiveTests = async (locations: TouristLocation[]): Promise<void> => {
  console.log('🧪 Running comprehensive test suite...');
  
  // Performance tests
  measurePerformance('Location filtering', () => {
    testFilters(locations);
  });
  
  // Functionality tests
  testGoogleMapsAPI();
  testResponsiveDesign();
  testSearch(locations, 'temple');
  testLiveUpdates();
  
  // Accessibility and performance
  testAccessibility();
  testMemoryUsage();
  
  // Image loading tests
  const sampleImages = locations.slice(0, 3).map(loc => loc.imageUrl).filter(Boolean) as string[];
  const imageResults = await Promise.all(sampleImages.map(testImageLoading));
  const successfulLoads = imageResults.filter(Boolean).length;
  console.log(`📸 Image loading: ${successfulLoads}/${sampleImages.length} successful`);
  
  // Booking tests
  if (locations.length > 0) {
    await testBookingFlow(locations[0]);
  }
  
  console.log('🎉 Comprehensive test suite completed!');
};

// Debug utilities
export const debugInfo = {
  logLocation: (location: TouristLocation) => {
    console.table({
      Name: location.name,
      Type: location.type,
      Rating: location.rating,
      'Price Range': location.priceRange,
      'Has Image': !!location.imageUrl,
      'Has Coordinates': !!(location.lat && location.lng)
    });
  },
  
  logPerformanceMetrics: () => {
    if ('performance' in window) {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      console.table({
        'Page Load Time': `${Math.round(navigation.loadEventEnd - navigation.fetchStart)}ms`,
        'DOM Content Loaded': `${Math.round(navigation.domContentLoadedEventEnd - navigation.fetchStart)}ms`,
        'First Paint': `${Math.round(navigation.responseEnd - navigation.fetchStart)}ms`
      });
    }
  },
  
  logUserAgent: () => {
    console.log('🌐 User Agent:', navigator.userAgent);
    console.log('📱 Platform:', navigator.platform);
    console.log('💻 Screen:', `${screen.width}x${screen.height}`);
  }
};