
// Configuration for Google Maps usage
export const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || "";

export const googleMapsLibraries: ("places" | "drawing" | "geometry" | "visualization")[] = ['places'];

// Configuration for API usage
export const MAPS_CONFIG = {
  useServerProxy: false,
  allowedDomains: ['localhost', 'lovableproject.com'],
  maxRequestsPerMinute: 60
};

// Check if we're in secure mode (when no API key is provided)
export const isSecureMode = () => {
  const hasApiKey = GOOGLE_MAPS_API_KEY && GOOGLE_MAPS_API_KEY !== "";
  const hasServerKey = (window as any).googleMapsApiKey; // Check for server-provided key
  return !hasApiKey && !hasServerKey;
};

// Enable demo mode only when no API key is available
export const isDemoMode = () => {
  const hasApiKey = GOOGLE_MAPS_API_KEY && GOOGLE_MAPS_API_KEY !== "";
  const hasServerKey = (window as any).googleMapsApiKey; // Check for server-provided key
  return !hasApiKey && !hasServerKey;
};

// Get the effective API key (either from env or server)
export const getEffectiveApiKey = () => {
  if (GOOGLE_MAPS_API_KEY) return GOOGLE_MAPS_API_KEY;
  if ((window as any).googleMapsApiKey) return (window as any).googleMapsApiKey;
  return null;
};

// Declare global variable for server-provided API key
declare global {
  interface Window {
    googleMapsApiKey?: string;
    google?: any;
    initGoogleMaps?: () => void;
  }
}
