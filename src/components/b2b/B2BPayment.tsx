import { useState } from 'react';
import { 
  CreditCard, 
  Lock, 
  CheckCircle, 
  Loader2,
  AlertCircle,
  Shield
} from 'lucide-react';
import { useB2BAuth } from '@/contexts/B2BAuthContext';

interface B2BPaymentProps {
  bookingId: string;
  amount: number;
  tourName: string;
  onPaymentSuccess?: () => void;
  onPaymentError?: (error: string) => void;
}

const B2BPayment = ({
  bookingId,
  amount,
  tourName,
  onPaymentSuccess,
  onPaymentError
}: B2BPaymentProps) => {
  const { token } = useB2BAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<'stripe' | 'bank'>('stripe');

  const handleStripePayment = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/b2b/payments/create-checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { Authorization: `Bearer ${token}` })
        },
        body: JSON.stringify({
          bookingId,
          amount,
          tourName
        })
      });

      const data = await response.json();

      if (data.success && data.checkoutUrl) {
        // Redirect to Stripe Checkout
        window.location.href = data.checkoutUrl;
      } else {
        setError(data.message || 'Failed to create payment session');
        onPaymentError?.(data.message);
      }
    } catch (err) {
      const message = 'Payment initialization failed. Please try again.';
      setError(message);
      onPaymentError?.(message);
    } finally {
      setLoading(false);
    }
  };

  const handleBankTransfer = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/b2b/payments/bank-transfer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { Authorization: `Bearer ${token}` })
        },
        body: JSON.stringify({ bookingId })
      });

      const data = await response.json();

      if (data.success) {
        onPaymentSuccess?.();
      } else {
        setError(data.message || 'Failed to initiate bank transfer');
      }
    } catch (err) {
      setError('Failed to process request');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-slate-200/50 overflow-hidden">
      {/* Header */}
      <div className="p-6 bg-gradient-to-r from-emerald-500 to-teal-500 text-white">
        <div className="flex items-center gap-3 mb-2">
          <Lock className="w-5 h-5" />
          <h3 className="text-lg font-bold">Secure Payment</h3>
        </div>
        <p className="text-white/80 text-sm">Complete your booking payment</p>
      </div>

      <div className="p-6">
        {/* Amount Summary */}
        <div className="bg-slate-50 rounded-xl p-4 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-slate-500">Amount to Pay</p>
              <p className="text-3xl font-bold text-slate-900">${amount.toFixed(2)}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-slate-500">Booking</p>
              <p className="text-sm font-medium text-slate-700">{tourName}</p>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        {/* Payment Methods */}
        <div className="space-y-3 mb-6">
          <p className="text-sm font-medium text-slate-700">Select Payment Method</p>
          
          <label className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${
            paymentMethod === 'stripe' 
              ? 'border-emerald-500 bg-emerald-50' 
              : 'border-slate-200 hover:border-slate-300'
          }`}>
            <input
              type="radio"
              name="paymentMethod"
              value="stripe"
              checked={paymentMethod === 'stripe'}
              onChange={() => setPaymentMethod('stripe')}
              className="w-5 h-5 text-emerald-500"
            />
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-slate-600" />
                <span className="font-medium text-slate-900">Credit/Debit Card</span>
              </div>
              <p className="text-sm text-slate-500 mt-1">Pay securely with Stripe</p>
            </div>
            <div className="flex gap-1">
              <img src="https://cdn.jsdelivr.net/gh/lipis/flag-icons/flags/4x3/us.svg" alt="Visa" className="h-6 w-auto rounded" />
              <span className="text-xs text-slate-400 px-2 py-1 bg-slate-100 rounded">Visa</span>
              <span className="text-xs text-slate-400 px-2 py-1 bg-slate-100 rounded">MC</span>
            </div>
          </label>

          <label className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${
            paymentMethod === 'bank' 
              ? 'border-emerald-500 bg-emerald-50' 
              : 'border-slate-200 hover:border-slate-300'
          }`}>
            <input
              type="radio"
              name="paymentMethod"
              value="bank"
              checked={paymentMethod === 'bank'}
              onChange={() => setPaymentMethod('bank')}
              className="w-5 h-5 text-emerald-500"
            />
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-slate-600" />
                <span className="font-medium text-slate-900">Bank Transfer</span>
              </div>
              <p className="text-sm text-slate-500 mt-1">Pay via wire transfer (2-3 business days)</p>
            </div>
          </label>
        </div>

        {/* Pay Button */}
        <button
          onClick={paymentMethod === 'stripe' ? handleStripePayment : handleBankTransfer}
          disabled={loading}
          className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 text-white py-4 rounded-xl font-semibold text-lg hover:from-emerald-600 hover:to-teal-600 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Processing...
            </>
          ) : paymentMethod === 'stripe' ? (
            <>
              <Lock className="w-5 h-5" />
              Pay ${amount.toFixed(2)} with Card
            </>
          ) : (
            <>
              <Shield className="w-5 h-5" />
              Request Bank Transfer Details
            </>
          )}
        </button>

        {/* Security Badge */}
        <div className="mt-4 flex items-center justify-center gap-2 text-xs text-slate-500">
          <Lock className="w-3 h-3" />
          <span>Secured by 256-bit SSL encryption</span>
        </div>
      </div>
    </div>
  );
};

export default B2BPayment;
