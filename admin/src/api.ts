// API key management utilities
// Note: These functions are placeholders for API key management

export const saveApiKey = async (apiKey: string) => {
  try {
    // Store API key in localStorage for now
    localStorage.setItem('VITE_GEMINI_API_KEY', apiKey);
    return { success: true };
  } catch (error) {
    return { success: false, error };
  }
};

export const getApiKey = async () => {
  try {
    const apiKey = localStorage.getItem('VITE_GEMINI_API_KEY') || import.meta.env.VITE_GEMINI_API_KEY;
    return { success: true, apiKey };
  } catch (error) {
    return { success: false, error };
  }
};
