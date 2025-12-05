/**
 * Payment Method Selector Component
 * UI for selecting and processing vehicle rental payments
 */
import React, { useState, useEffect } from 'react';
import {
  CreditCard,
  Building2,
  Wallet,
  Car,
  Check,
  Copy,
  Upload,
  Loader2,
  Info,
  ExternalLink,
  AlertCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import vehiclePaymentService, {
  PaymentMethod,
  PaymentIntent
} from '@/services/vehiclePaymentService';

interface PaymentMethodSelectorProps {
  bookingId: string;
  bookingReference: string;
  amount: number;
  securityDeposit?: number;
  onPaymentComplete?: (paymentId: string) => void;
  onPaymentError?: (error: string) => void;
}

const PAYMENT_ICONS: Record<PaymentMethod, React.ReactNode> = {
  payhere: <CreditCard className="w-5 h-5" />,
  stripe: <CreditCard className="w-5 h-5" />,
  bank_transfer: <Building2 className="w-5 h-5" />,
  cash: <Wallet className="w-5 h-5" />,
  card_on_pickup: <Car className="w-5 h-5" />
};

export const PaymentMethodSelector: React.FC<PaymentMethodSelectorProps> = ({
  bookingId,
  bookingReference,
  amount,
  securityDeposit = 0,
  onPaymentComplete,
  onPaymentError
}) => {
  const { toast } = useToast();
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>('payhere');
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentIntent, setPaymentIntent] = useState<PaymentIntent | null>(null);
  const [copied, setCopied] = useState(false);
  const [transferProof, setTransferProof] = useState<File | null>(null);
  const [transferReference, setTransferReference] = useState('');

  const totalAmount = amount + securityDeposit;
  const paymentMethods = vehiclePaymentService.getAvailablePaymentMethods();
  const bankDetails = vehiclePaymentService.getBankTransferDetails(bookingReference, totalAmount);
  const breakdown = vehiclePaymentService.calculatePaymentBreakdown(amount);

  // Handle PayHere payment
  const handlePayHerePayment = async () => {
    setIsProcessing(true);
    try {
      const intent = await vehiclePaymentService.createPaymentIntent({
        bookingId,
        amount: totalAmount,
        paymentMethod: 'payhere',
        successUrl: `${window.location.origin}/vehicle-rental/payment/success?booking=${bookingId}`,
        cancelUrl: `${window.location.origin}/vehicle-rental/payment/cancel?booking=${bookingId}`
      });

      setPaymentIntent(intent);

      // Get checkout params
      const checkout = vehiclePaymentService.getPayHereCheckout(intent, {
        firstName: 'Customer', // These should come from the booking
        lastName: 'Name',
        email: 'customer@email.com',
        phone: '0771234567',
        city: 'Colombo'
      });

      // Create and submit form
      const form = document.createElement('form');
      form.method = 'POST';
      form.action = checkout.actionUrl;
      form.target = '_blank';

      Object.entries(checkout.params).forEach(([key, value]) => {
        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = key;
        input.value = value;
        form.appendChild(input);
      });

      document.body.appendChild(form);
      form.submit();
      document.body.removeChild(form);

      toast({
        title: 'Payment Window Opened',
        description: 'Complete your payment in the new window'
      });
    } catch (error) {
      console.error('Payment error:', error);
      onPaymentError?.('Failed to initiate payment');
      toast({
        title: 'Payment Error',
        description: 'Failed to initiate payment. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setIsProcessing(false);
    }
  };

  // Handle bank transfer submission
  const handleBankTransferSubmit = async () => {
    if (!transferProof || !transferReference) {
      toast({
        title: 'Missing Information',
        description: 'Please upload proof of payment and enter the transfer reference',
        variant: 'destructive'
      });
      return;
    }

    setIsProcessing(true);
    try {
      // In production, upload the file first
      const proofUrl = URL.createObjectURL(transferProof); // Placeholder

      const paymentId = await vehiclePaymentService.createPayment({
        bookingId,
        bookingReference,
        customerId: '', // From context
        ownerId: '', // From booking
        vehicleId: '', // From booking
        paymentType: 'booking_payment',
        paymentMethod: 'bank_transfer',
        status: 'processing',
        amount: totalAmount,
        currency: 'LKR',
        platformFee: breakdown.platformFee,
        ownerPayout: breakdown.ownerPayout,
        bankTransferReference: transferReference,
        bankTransferProof: proofUrl
      });

      toast({
        title: 'Payment Submitted',
        description: 'Your payment is being verified. You will be notified once confirmed.'
      });

      onPaymentComplete?.(paymentId);
    } catch (error) {
      console.error('Bank transfer error:', error);
      toast({
        title: 'Submission Error',
        description: 'Failed to submit payment proof. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setIsProcessing(false);
    }
  };

  // Handle pay at pickup
  const handlePayAtPickup = async () => {
    setIsProcessing(true);
    try {
      const paymentId = await vehiclePaymentService.createPayment({
        bookingId,
        bookingReference,
        customerId: '',
        ownerId: '',
        vehicleId: '',
        paymentType: 'booking_payment',
        paymentMethod: selectedMethod,
        status: 'pending',
        amount: totalAmount,
        currency: 'LKR',
        platformFee: breakdown.platformFee,
        ownerPayout: breakdown.ownerPayout
      });

      toast({
        title: 'Booking Confirmed',
        description: `You will pay ${vehiclePaymentService.formatCurrency(totalAmount)} at pickup`
      });

      onPaymentComplete?.(paymentId);
    } catch (error) {
      console.error('Booking error:', error);
      toast({
        title: 'Error',
        description: 'Failed to complete booking. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setIsProcessing(false);
    }
  };

  // Copy bank details
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast({ title: 'Copied to clipboard' });
  };

  // Handle payment based on method
  const handlePayment = () => {
    switch (selectedMethod) {
      case 'payhere':
        handlePayHerePayment();
        break;
      case 'bank_transfer':
        handleBankTransferSubmit();
        break;
      case 'cash':
      case 'card_on_pickup':
        handlePayAtPickup();
        break;
      default:
        toast({
          title: 'Unsupported Method',
          description: 'This payment method is not available yet',
          variant: 'destructive'
        });
    }
  };

  return (
    <div className="space-y-6">
      {/* Amount Summary */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Payment Summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Rental Amount</span>
            <span>{vehiclePaymentService.formatCurrency(amount)}</span>
          </div>
          {securityDeposit > 0 && (
            <div className="flex justify-between">
              <span className="text-muted-foreground">Security Deposit (Refundable)</span>
              <span>{vehiclePaymentService.formatCurrency(securityDeposit)}</span>
            </div>
          )}
          <Separator />
          <div className="flex justify-between font-semibold text-lg">
            <span>Total</span>
            <span className="text-primary">{vehiclePaymentService.formatCurrency(totalAmount)}</span>
          </div>
        </CardContent>
      </Card>

      {/* Payment Method Selection */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Select Payment Method</CardTitle>
        </CardHeader>
        <CardContent>
          <RadioGroup
            value={selectedMethod}
            onValueChange={(v) => setSelectedMethod(v as PaymentMethod)}
            className="space-y-3"
          >
            {paymentMethods.map((method) => (
              <div
                key={method.method}
                className={`
                  flex items-start space-x-3 p-4 rounded-lg border-2 transition-colors cursor-pointer
                  ${selectedMethod === method.method ? 'border-primary bg-primary/5' : 'border-border'}
                  ${!method.available ? 'opacity-50 cursor-not-allowed' : 'hover:border-primary/50'}
                `}
                onClick={() => method.available && setSelectedMethod(method.method)}
              >
                <RadioGroupItem
                  value={method.method}
                  id={method.method}
                  disabled={!method.available}
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    {PAYMENT_ICONS[method.method]}
                    <Label htmlFor={method.method} className="font-medium cursor-pointer">
                      {method.label}
                    </Label>
                    {!method.available && (
                      <span className="text-xs bg-muted px-2 py-0.5 rounded">Coming Soon</span>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">{method.description}</p>
                </div>
              </div>
            ))}
          </RadioGroup>
        </CardContent>
      </Card>

      {/* Payment Method Specific Content */}
      {selectedMethod === 'bank_transfer' && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Building2 className="w-5 h-5" />
              Bank Transfer Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert>
              <Info className="w-4 h-4" />
              <AlertDescription>
                Transfer the exact amount and use the reference number provided
              </AlertDescription>
            </Alert>

            <div className="bg-muted/50 p-4 rounded-lg space-y-3">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-muted-foreground">Bank Name</p>
                  <p className="font-medium">{bankDetails.bankAccount.bankName}</p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => copyToClipboard(bankDetails.bankAccount.bankName)}
                >
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </Button>
              </div>

              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-muted-foreground">Account Name</p>
                  <p className="font-medium">{bankDetails.bankAccount.accountName}</p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => copyToClipboard(bankDetails.bankAccount.accountName)}
                >
                  <Copy className="w-4 h-4" />
                </Button>
              </div>

              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-muted-foreground">Account Number</p>
                  <p className="font-medium font-mono">{bankDetails.bankAccount.accountNumber}</p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => copyToClipboard(bankDetails.bankAccount.accountNumber)}
                >
                  <Copy className="w-4 h-4" />
                </Button>
              </div>

              <Separator />

              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-muted-foreground">Reference</p>
                  <p className="font-medium text-primary">{bankDetails.reference}</p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => copyToClipboard(bankDetails.reference)}
                >
                  <Copy className="w-4 h-4" />
                </Button>
              </div>

              <div>
                <p className="text-sm text-muted-foreground">Amount</p>
                <p className="font-bold text-xl text-primary">
                  {vehiclePaymentService.formatCurrency(bankDetails.amount)}
                </p>
              </div>
            </div>

            <Separator />

            {/* Upload Proof */}
            <div className="space-y-3">
              <Label>Upload Payment Proof</Label>
              <div className="flex items-center gap-3">
                <Input
                  type="file"
                  accept="image/*,.pdf"
                  onChange={(e) => setTransferProof(e.target.files?.[0] || null)}
                  className="flex-1"
                />
                {transferProof && (
                  <Check className="w-5 h-5 text-green-600" />
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Transfer Reference Number</Label>
              <Input
                placeholder="Enter your bank transfer reference"
                value={transferReference}
                onChange={(e) => setTransferReference(e.target.value)}
              />
            </div>
          </CardContent>
        </Card>
      )}

      {selectedMethod === 'payhere' && (
        <Alert>
          <CreditCard className="w-4 h-4" />
          <AlertDescription>
            You will be redirected to PayHere's secure payment page to complete your payment using Visa, Mastercard, or local bank accounts.
          </AlertDescription>
        </Alert>
      )}

      {(selectedMethod === 'cash' || selectedMethod === 'card_on_pickup') && (
        <Alert>
          <AlertCircle className="w-4 h-4" />
          <AlertDescription>
            <strong>Pay at Pickup:</strong> You will need to pay {vehiclePaymentService.formatCurrency(totalAmount)} when collecting the vehicle. Please bring valid ID and your booking confirmation.
          </AlertDescription>
        </Alert>
      )}

      {/* Submit Button */}
      <Button
        className="w-full"
        size="lg"
        onClick={handlePayment}
        disabled={isProcessing || (selectedMethod === 'bank_transfer' && (!transferProof || !transferReference))}
      >
        {isProcessing ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Processing...
          </>
        ) : selectedMethod === 'payhere' ? (
          <>
            <ExternalLink className="w-4 h-4 mr-2" />
            Pay {vehiclePaymentService.formatCurrency(totalAmount)}
          </>
        ) : selectedMethod === 'bank_transfer' ? (
          <>
            <Upload className="w-4 h-4 mr-2" />
            Submit Payment Proof
          </>
        ) : (
          <>
            <Check className="w-4 h-4 mr-2" />
            Confirm Booking
          </>
        )}
      </Button>

      {/* Security Note */}
      <p className="text-xs text-center text-muted-foreground">
        Your payment information is secure and encrypted. By proceeding, you agree to our terms and conditions.
      </p>
    </div>
  );
};

export default PaymentMethodSelector;
