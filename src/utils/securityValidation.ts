
import { sanitizeInput, validateEmail, validatePhone } from './inputValidation';

// CSRF Token Management
let csrfToken: string | null = null;

export const generateCSRFToken = (): string => {
  const token = crypto.randomUUID();
  csrfToken = token;
  sessionStorage.setItem('csrf_token', token);
  return token;
};

export const validateCSRFToken = (token: string): boolean => {
  const storedToken = sessionStorage.getItem('csrf_token');
  return token === storedToken && token === csrfToken;
};

// Enhanced Input Validation
export const validateTourData = (data: any): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  if (!data.name || data.name.length < 3 || data.name.length > 100) {
    errors.push('Tour name must be between 3 and 100 characters');
  }
  
  if (!data.duration || data.duration.length < 3 || data.duration.length > 50) {
    errors.push('Duration must be between 3 and 50 characters');
  }
  
  if (!data.price || isNaN(data.price) || data.price < 0 || data.price > 10000) {
    errors.push('Price must be a valid number between 0 and 10000');
  }
  
  if (data.highlights && (!Array.isArray(data.highlights) || data.highlights.length > 20)) {
    errors.push('Highlights must be an array with maximum 20 items');
  }
  
  // Validate each highlight
  if (data.highlights) {
    data.highlights.forEach((highlight: string, index: number) => {
      if (!highlight || highlight.length > 200) {
        errors.push(`Highlight ${index + 1} must be between 1 and 200 characters`);
      }
    });
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

export const validateSiteData = (data: any): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  if (!data.name || data.name.length < 3 || data.name.length > 100) {
    errors.push('Site name must be between 3 and 100 characters');
  }
  
  if (!data.hours || data.hours.length < 3 || data.hours.length > 50) {
    errors.push('Hours must be between 3 and 50 characters');
  }
  
  if (!data.price || data.price.length > 20) {
    errors.push('Price must be provided and less than 20 characters');
  }
  
  if (data.duration && data.duration.length > 30) {
    errors.push('Duration must be less than 30 characters');
  }
  
  if (data.note && data.note.length > 300) {
    errors.push('Note must be less than 300 characters');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

export const validateUserData = (data: any): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  if (!data.name || data.name.length < 2 || data.name.length > 100) {
    errors.push('Name must be between 2 and 100 characters');
  }
  
  if (!validateEmail(data.email)) {
    errors.push('Valid email address is required');
  }
  
  if (!validatePhone(data.phone)) {
    errors.push('Valid phone number is required');
  }
  
  const allowedRoles = ['admin', 'manager', 'guide', 'staff', 'customer'];
  if (!allowedRoles.includes(data.role)) {
    errors.push('Invalid role specified');
  }
  
  const allowedStatuses = ['active', 'inactive'];
  if (!allowedStatuses.includes(data.status)) {
    errors.push('Invalid status specified');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

// Sanitize form data for database operations
export const sanitizeTourData = (data: any) => {
  return {
    name: sanitizeInput(data.name),
    duration: sanitizeInput(data.duration),
    price: parseFloat(data.price),
    highlights: Array.isArray(data.highlights) 
      ? data.highlights.slice(0, 20).map((h: string) => sanitizeInput(h))
      : []
  };
};

export const sanitizeSiteData = (data: any) => {
  return {
    name: sanitizeInput(data.name),
    hours: sanitizeInput(data.hours),
    price: sanitizeInput(data.price),
    duration: sanitizeInput(data.duration || ''),
    note: sanitizeInput(data.note || '')
  };
};

export const sanitizeUserData = (data: any) => {
  return {
    name: sanitizeInput(data.name),
    email: sanitizeInput(data.email.toLowerCase()),
    phone: sanitizeInput(data.phone),
    role: sanitizeInput(data.role),
    status: sanitizeInput(data.status)
  };
};

// Rate limiting for form submissions
class FormRateLimiter {
  private submissions: Map<string, number[]> = new Map();
  private readonly maxSubmissions = 5;
  private readonly timeWindow = 60000; // 1 minute

  canSubmit(identifier: string): boolean {
    const now = Date.now();
    const userSubmissions = this.submissions.get(identifier) || [];
    
    // Remove old submissions outside the time window
    const recentSubmissions = userSubmissions.filter(time => now - time < this.timeWindow);
    
    if (recentSubmissions.length >= this.maxSubmissions) {
      return false;
    }
    
    recentSubmissions.push(now);
    this.submissions.set(identifier, recentSubmissions);
    return true;
  }
}

export const formRateLimiter = new FormRateLimiter();
