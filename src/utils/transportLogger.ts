export interface TransportBookingLog {
  id: string;
  timestamp: string;
  userId?: string;
  bookingType: 'bus' | 'car' | 'van' | 'taxi';
  action: 'create' | 'update' | 'cancel' | 'error';
  data: any;
  error?: string;
  status: 'success' | 'error' | 'pending';
}

class TransportLogger {
  private logs: TransportBookingLog[] = [];
  private maxLogs = 1000;

  log(entry: Omit<TransportBookingLog, 'id' | 'timestamp'>): void {
    const logEntry: TransportBookingLog = {
      id: crypto.randomUUID(),
      timestamp: new Date().toISOString(),
      ...entry
    };

    // Add to memory logs
    this.logs.unshift(logEntry);
    
    // Keep only latest logs
    if (this.logs.length > this.maxLogs) {
      this.logs = this.logs.slice(0, this.maxLogs);
    }

    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.log('[Transport Booking]', logEntry);
    }

    // Store in localStorage for debugging
    try {
      localStorage.setItem('transport_logs', JSON.stringify(this.logs.slice(0, 100)));
    } catch (error) {
      console.warn('Failed to store transport logs:', error);
    }
  }

  getLogs(filter?: { 
    bookingType?: string; 
    action?: string; 
    status?: string;
    userId?: string;
  }): TransportBookingLog[] {
    if (!filter) return this.logs;
    
    return this.logs.filter(log => {
      return (!filter.bookingType || log.bookingType === filter.bookingType) &&
             (!filter.action || log.action === filter.action) &&
             (!filter.status || log.status === filter.status) &&
             (!filter.userId || log.userId === filter.userId);
    });
  }

  getErrorLogs(): TransportBookingLog[] {
    return this.getLogs({ status: 'error' });
  }

  clearLogs(): void {
    this.logs = [];
    localStorage.removeItem('transport_logs');
  }

  exportLogs(): string {
    return JSON.stringify(this.logs, null, 2);
  }
}

export const transportLogger = new TransportLogger();

// Helper functions for common logging scenarios
export const logTransportBooking = (
  bookingType: TransportBookingLog['bookingType'],
  action: TransportBookingLog['action'],
  data: any,
  userId?: string,
  error?: string
) => {
  transportLogger.log({
    bookingType,
    action,
    data: sanitizeLogData(data),
    userId,
    error,
    status: error ? 'error' : 'success'
  });
};

// Sanitize sensitive data before logging
const sanitizeLogData = (data: any): any => {
  if (!data) return data;
  
  const sensitiveFields = ['password', 'token', 'apiKey', 'secret', 'cardNumber', 'cvv'];
  const sanitized = { ...data };
  
  sensitiveFields.forEach(field => {
    if (sanitized[field]) {
      sanitized[field] = '[REDACTED]';
    }
  });
  
  return sanitized;
};
