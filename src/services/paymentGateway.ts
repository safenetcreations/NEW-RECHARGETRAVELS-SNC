// Payment Gateway Integration Service
// This file provides integration with various payment gateways
// Currently supports: PayHere (Sri Lankan gateway), Stripe, PayPal

interface PaymentRequest {
  amount: number;
  currency: string;
  orderId: string;
  returnUrl: string;
  cancelUrl: string;
  notifyUrl: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  items?: string;
}

interface PaymentResponse {
  success: boolean;
  paymentUrl?: string;
  transactionId?: string;
  error?: string;
}

class PaymentGatewayService {
  private merchantId: string;
  private merchantSecret: string;
  private environment: 'sandbox' | 'production';

  constructor() {
    // These should be loaded from environment variables
    this.merchantId = import.meta.env.VITE_PAYHERE_MERCHANT_ID || '';
    this.merchantSecret = import.meta.env.VITE_PAYHERE_MERCHANT_SECRET || '';
    this.environment = import.meta.env.VITE_PAYMENT_ENV === 'production' ? 'production' : 'sandbox';
  }

  // PayHere Integration (Popular in Sri Lanka)
  async initiatePayHerePayment(request: PaymentRequest): Promise<PaymentResponse> {
    try {
      const hash = this.generatePayHereHash(request);
      
      const paymentData = {
        merchant_id: this.merchantId,
        return_url: request.returnUrl,
        cancel_url: request.cancelUrl,
        notify_url: request.notifyUrl,
        order_id: request.orderId,
        items: request.items || 'Wallet Recharge',
        currency: request.currency,
        amount: request.amount.toFixed(2),
        first_name: request.customerName.split(' ')[0],
        last_name: request.customerName.split(' ').slice(1).join(' ') || '',
        email: request.customerEmail,
        phone: request.customerPhone || '',
        address: '',
        city: '',
        country: 'Sri Lanka',
        hash: hash
      };

      // In production, you would submit this to PayHere's payment gateway
      // For now, return a simulated response
      return {
        success: true,
        paymentUrl: `https://sandbox.payhere.lk/pay/checkout?${new URLSearchParams(paymentData)}`,
        transactionId: `DEMO-${Date.now()}`
      };
    } catch (error) {
      console.error('PayHere payment initiation error:', error);
      return {
        success: false,
        error: 'Failed to initiate payment'
      };
    }
  }

  // Dialog/Mobitel Mobile Money Integration
  async initiateMobileMoneyPayment(
    provider: 'dialog' | 'mobitel',
    phoneNumber: string,
    amount: number,
    orderId: string
  ): Promise<PaymentResponse> {
    try {
      // Validate phone number format
      const phoneRegex = provider === 'dialog' ? /^07[678]\d{7}$/ : /^071\d{7}$/;
      if (!phoneRegex.test(phoneNumber)) {
        return {
          success: false,
          error: 'Invalid phone number format'
        };
      }

      // In production, integrate with Dialog/Mobitel APIs
      // For demo, simulate success
      return {
        success: true,
        transactionId: `${provider.toUpperCase()}-${Date.now()}`,
        paymentUrl: undefined // Mobile money doesn't use redirect URLs
      };
    } catch (error) {
      console.error('Mobile money payment error:', error);
      return {
        success: false,
        error: 'Failed to process mobile money payment'
      };
    }
  }

  // Bank Transfer Integration
  async initiateBankTransfer(
    bankCode: string,
    amount: number,
    orderId: string
  ): Promise<PaymentResponse> {
    try {
      // Generate unique reference for bank transfer
      const reference = `RT-${orderId}-${Date.now()}`;

      // In production, integrate with bank APIs or payment processor
      return {
        success: true,
        transactionId: reference,
        paymentUrl: undefined // Bank transfers typically don't have redirect URLs
      };
    } catch (error) {
      console.error('Bank transfer initiation error:', error);
      return {
        success: false,
        error: 'Failed to initiate bank transfer'
      };
    }
  }

  // Stripe Integration (International cards)
  async initiateStripePayment(request: PaymentRequest): Promise<PaymentResponse> {
    try {
      // In production, use Stripe SDK
      // const stripe = new Stripe(import.meta.env.VITE_STRIPE_SECRET_KEY);
      
      // For demo purposes
      return {
        success: true,
        paymentUrl: `https://checkout.stripe.com/demo/${request.orderId}`,
        transactionId: `STRIPE-${Date.now()}`
      };
    } catch (error) {
      console.error('Stripe payment error:', error);
      return {
        success: false,
        error: 'Failed to initiate Stripe payment'
      };
    }
  }

  // Verify payment status
  async verifyPayment(transactionId: string, gateway: string): Promise<boolean> {
    try {
      // In production, verify with respective gateway API
      // For demo, simulate success for completed transactions
      return transactionId.startsWith('DEMO-') || transactionId.includes('COMPLETED');
    } catch (error) {
      console.error('Payment verification error:', error);
      return false;
    }
  }

  // Generate PayHere hash for security
  private generatePayHereHash(request: PaymentRequest): string {
    // In production, use proper MD5 hashing with merchant secret
    // This is a simplified version
    const hashString = 
      this.merchantId +
      request.orderId +
      request.amount.toFixed(2) +
      request.currency +
      this.merchantSecret;
    
    // Use Web Crypto API or import crypto library for actual MD5
    return btoa(hashString).substring(0, 32).toUpperCase();
  }

  // Handle payment webhook/notification
  async handlePaymentNotification(data: any): Promise<boolean> {
    try {
      // Verify webhook signature
      // Update transaction status in database
      // Process business logic (update wallet balance, etc.)
      
      return true;
    } catch (error) {
      console.error('Payment notification handling error:', error);
      return false;
    }
  }
}

export const paymentGateway = new PaymentGatewayService();

// Payment method configurations for Sri Lanka
export const PAYMENT_METHODS_CONFIG = {
  card: {
    providers: ['payhere', 'stripe'],
    name: 'Credit/Debit Card',
    supportedCards: ['Visa', 'Mastercard', 'American Express'],
    localBanks: ['BOC', 'Commercial Bank', 'Sampath Bank', 'HNB', 'NSB']
  },
  mobile_money: {
    providers: ['dialog', 'mobitel', 'hutch'],
    name: 'Mobile Money',
    limits: {
      min: 100,
      max: 50000,
      daily: 100000
    }
  },
  bank_transfer: {
    providers: ['boc', 'commercial', 'sampath', 'hnb'],
    name: 'Bank Transfer',
    processingTime: '1-2 business days'
  }
};