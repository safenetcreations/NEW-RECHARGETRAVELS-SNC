
// Enhanced input validation and sanitization utilities

// Basic input sanitization
export const sanitizeInput = (input: string): string => {
  if (!input || typeof input !== 'string') return '';
  
  return input
    .trim()
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .replace(/javascript:/gi, '') // Remove javascript: protocols
    .replace(/on\w+=/gi, '') // Remove event handlers
    .substring(0, 1000); // Limit length
};

// Email validation with comprehensive regex
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email) && email.length <= 254;
};

// Phone number validation (international format)
export const validatePhone = (phone: string): boolean => {
  const phoneRegex = /^\+?[\d\s-()]{10,15}$/;
  return phoneRegex.test(phone.replace(/\s/g, ''));
};

// Password strength validation
export const validatePassword = (password: string): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long');
  }
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }
  if (!/\d/.test(password)) {
    errors.push('Password must contain at least one number');
  }
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push('Password must contain at least one special character');
  }
  if (password.length > 128) {
    errors.push('Password must be less than 128 characters');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

// URL validation
export const validateURL = (url: string): boolean => {
  try {
    const urlObj = new URL(url);
    return ['http:', 'https:'].includes(urlObj.protocol);
  } catch {
    return false;
  }
};

// Name validation
export const validateName = (name: string): boolean => {
  const nameRegex = /^[a-zA-Z\s\-']{2,50}$/;
  return nameRegex.test(name.trim());
};

// Booking validation
export const validateBookingData = (data: any): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  if (!data.user_name || !validateName(data.user_name)) {
    errors.push('Valid name is required');
  }
  
  if (!data.user_email || !validateEmail(data.user_email)) {
    errors.push('Valid email is required');
  }
  
  if (data.total_price && (isNaN(data.total_price) || data.total_price < 0)) {
    errors.push('Valid price is required');
  }
  
  if (data.check_in_date && new Date(data.check_in_date) < new Date()) {
    errors.push('Check-in date cannot be in the past');
  }
  
  if (data.check_out_date && data.check_in_date && 
      new Date(data.check_out_date) <= new Date(data.check_in_date)) {
    errors.push('Check-out date must be after check-in date');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

// Rate limiting helper
export const checkRateLimit = (identifier: string, maxAttempts: number = 5, windowMinutes: number = 15): boolean => {
  const key = `rate_limit_${identifier}`;
  const now = Date.now();
  const windowMs = windowMinutes * 60 * 1000;
  
  const stored = localStorage.getItem(key);
  if (!stored) {
    localStorage.setItem(key, JSON.stringify({ count: 1, firstAttempt: now }));
    return true;
  }
  
  const data = JSON.parse(stored);
  if (now - data.firstAttempt > windowMs) {
    // Reset window
    localStorage.setItem(key, JSON.stringify({ count: 1, firstAttempt: now }));
    return true;
  }
  
  if (data.count >= maxAttempts) {
    return false;
  }
  
  data.count += 1;
  localStorage.setItem(key, JSON.stringify(data));
  return true;
};

// XSS prevention helper
export const escapeHtml = (text: string): string => {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
};
