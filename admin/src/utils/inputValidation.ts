export const validateInput = (input: string): boolean => {
  return input.length > 0 && input.length < 1000;
};

export const validateEmail = (email: string): boolean => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

export const validatePhone = (phone: string): boolean => {
  return /^[\d\s-+()]+$/.test(phone);
};

export const sanitizeInput = (input: string): string => {
  return input.trim().replace(/<[^>]*>/g, '');
};
