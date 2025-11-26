// Date utilities wrapper for date-fns v4
import * as dateFns from 'date-fns';

// Re-export commonly used functions
export const format = dateFns.format;
export const startOfWeek = dateFns.startOfWeek;
export const endOfWeek = dateFns.endOfWeek;
export const startOfMonth = dateFns.startOfMonth;
export const endOfMonth = dateFns.endOfMonth;
export const parseISO = dateFns.parseISO;
export const isValid = dateFns.isValid;
export const addDays = dateFns.addDays;
export const subDays = dateFns.subDays;
export const differenceInDays = dateFns.differenceInDays;

// Export all date-fns functions
export * from 'date-fns';