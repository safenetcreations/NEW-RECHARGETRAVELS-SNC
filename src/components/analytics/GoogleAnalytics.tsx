import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

// Google Analytics 4 Configuration
const GA_TRACKING_ID = 'G-XXXXXXXXXX'; // Replace with your actual GA4 tracking ID
const GA_MEASUREMENT_ID = 'G-XXXXXXXXXX'; // Replace with your actual measurement ID

declare global {
  interface Window {
    gtag: (...args: any[]) => void;
    dataLayer: any[];
  }
}

// Initialize Google Analytics
export const initializeGA = () => {
  if (typeof window !== 'undefined' && !window.gtag) {
    // Create dataLayer
    window.dataLayer = window.dataLayer || [];
    
    // Define gtag function
    window.gtag = (...args) => {
      window.dataLayer.push(args);
    };
    
    // Set timestamp
    window.gtag('js', new Date());
    window.gtag('config', GA_TRACKING_ID, {
      page_title: document.title,
      page_location: window.location.href,
      send_page_view: true
    });

    // Load Google Analytics script
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`;
    document.head.appendChild(script);
  }
};

// Track page views
export const trackPageView = (url: string, title?: string) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('config', GA_TRACKING_ID, {
      page_path: url,
      page_title: title || document.title,
      page_location: window.location.href
    });
  }
};

// Track custom events
export const trackEvent = (
  action: string,
  category: string,
  label?: string,
  value?: number
) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value
    });
  }
};

// Track booking events
export const trackBooking = (tourName: string, price: number, currency: string = 'USD') => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'begin_checkout', {
      currency: currency,
      value: price,
      items: [{
        item_name: tourName,
        price: price,
        currency: currency,
        quantity: 1
      }]
    });
  }
};

// Track form submissions
export const trackFormSubmission = (formName: string, formType: string) => {
  trackEvent('form_submit', 'engagement', `${formName}_${formType}`);
};

// Track button clicks
export const trackButtonClick = (buttonName: string, page: string) => {
  trackEvent('click', 'engagement', `${buttonName}_${page}`);
};

// Track phone calls
export const trackPhoneCall = (phoneNumber: string) => {
  trackEvent('phone_call', 'engagement', phoneNumber);
};

// Track WhatsApp clicks
export const trackWhatsAppClick = (message: string) => {
  trackEvent('whatsapp_click', 'engagement', message);
};

// Track email clicks
export const trackEmailClick = (emailType: string) => {
  trackEvent('email_click', 'engagement', emailType);
};

// Track social media clicks
export const trackSocialClick = (platform: string, action: string) => {
  trackEvent('social_click', 'engagement', `${platform}_${action}`);
};

// Track destination views
export const trackDestinationView = (destinationName: string) => {
  trackEvent('view_item', 'destination', destinationName);
};

// Track tour views
export const trackTourView = (tourName: string, category: string) => {
  trackEvent('view_item', 'tour', `${tourName}_${category}`);
};

// Track search events
export const trackSearch = (searchTerm: string, resultsCount: number) => {
  trackEvent('search', 'engagement', searchTerm, resultsCount);
};

// Track user engagement
export const trackEngagement = (action: string, content: string) => {
  trackEvent(action, 'engagement', content);
};

// Google Analytics Component
const GoogleAnalytics: React.FC = () => {
  const location = useLocation();

  useEffect(() => {
    // Initialize GA on component mount
    initializeGA();
  }, []);

  useEffect(() => {
    // Track page views on route changes
    if (typeof window !== 'undefined' && window.gtag) {
      trackPageView(location.pathname + location.search);
    }
  }, [location]);

  return null; // This component doesn't render anything
};

export default GoogleAnalytics; 
