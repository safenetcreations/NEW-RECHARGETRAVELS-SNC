export const validateInput = (input: string): boolean => {
  return input.length > 0 && input.length < 1000;
};

export const sanitizeInput = (input: string): string => {
  return input.trim().replace(/<[^>]*>/g, '');
};

export const validateTourData = (data: any): boolean => {
  if (!data.name || !data.description || !data.price) return false;
  if (data.price < 0) return false;
  return true;
};

export const validateSiteData = (data: any): boolean => {
  if (!data.name || !data.location) return false;
  return true;
};

export const sanitizeTourData = (data: any): any => {
  return {
    ...data,
    name: sanitizeInput(data.name || ''),
    description: sanitizeInput(data.description || ''),
    location: sanitizeInput(data.location || ''),
    highlights: data.highlights?.map((h: string) => sanitizeInput(h)) || []
  };
};

export const sanitizeSiteData = (data: any): any => {
  return {
    ...data,
    name: sanitizeInput(data.name || ''),
    location: sanitizeInput(data.location || ''),
    description: sanitizeInput(data.description || '')
  };
};

export const generateCSRFToken = (): string => {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
};

export const validateCSRFToken = (token: string, storedToken: string): boolean => {
  return token === storedToken && token.length > 0;
};

export const formRateLimiter = (() => {
  const attempts: { [key: string]: number[] } = {};
  
  const checkLimit = (userId: string, maxAttempts: number = 5, windowMs: number = 60000): boolean => {
    const now = Date.now();
    const userAttempts = attempts[userId] || [];
    
    // Clean old attempts
    const recentAttempts = userAttempts.filter(time => now - time < windowMs);
    
    if (recentAttempts.length >= maxAttempts) {
      return false;
    }
    
    recentAttempts.push(now);
    attempts[userId] = recentAttempts;
    return true;
  };
  
  return {
    canSubmit: (formId: string) => checkLimit(formId, 5, 60000),
    checkLimit
  };
})();