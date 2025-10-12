import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { walletService } from '@/services/walletService';
import { paymentGateway } from '@/services/paymentGateway';
import { Loader2, CreditCard, Smartphone, Building2, Wallet } from 'lucide-react';

interface RechargeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  suggestedAmount?: number;
}

const RECHARGE_AMOUNTS = [1000, 2500, 5000, 10000, 25000, 50000];

const PAYMENT_METHODS = [
  {
    id: 'card',
    name: 'Credit/Debit Card',
    icon: CreditCard,
    description: 'Visa, Mastercard, American Express',
    providers: ['stripe', 'payhere']
  },
  {
    id: 'bank_transfer',
    name: 'Bank Transfer',
    icon: Building2,
    description: 'Bank of Ceylon, Commercial Bank, Sampath Bank',
    providers: ['payhere', 'manual']
  },
  {
    id: 'mobile_money',
    name: 'Mobile Money',
    icon: Smartphone,
    description: 'Dialog, Mobitel, Hutch',
    providers: ['dialog', 'mobitel']
  }
];

export function RechargeModal({ isOpen, onClose, onSuccess, suggestedAmount }: RechargeModalProps) {
  const { user } = useAuth();
  const [amount, setAmount] = useState<number>(suggestedAmount || 5000);
  const [customAmount, setCustomAmount] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<string>('card');
  const [isProcessing, setIsProcessing] = useState(false);
  const [wallet, setWallet] = useState<any>(null);

  useEffect(() => {
    if (user?.uid) {
      loadWallet();
    }
  }, [user]);
  
  useEffect(() => {
    if (suggestedAmount && suggestedAmount > 0) {
      setAmount(suggestedAmount);
      setCustomAmount(suggestedAmount.toString());
    }
  }, [suggestedAmount]);

  const loadWallet = async () => {
    if (!user?.uid) return;
    
    const userWallet = await walletService.getUserWallet(user.uid);
    if (!userWallet) {
      // Create wallet if it doesn't exist
      const newWallet = await walletService.createWallet(user.uid);
      setWallet(newWallet);
    } else {
      setWallet(userWallet);
    }
  };

  const handleAmountSelect = (selectedAmount: number) => {
    setAmount(selectedAmount);
    setCustomAmount('');
  };

  const handleCustomAmountChange = (value: string) => {
    const numValue = parseInt(value) || 0;
    if (numValue > 0) {
      setAmount(numValue);
      setCustomAmount(value);
    }
  };

  const handleRecharge = async () => {
    if (!wallet || !user) {
      toast({
        title: 'Error',
        description: 'Unable to process recharge. Please try again.',
        variant: 'destructive'
      });
      return;
    }

    if (amount < 100) {
      toast({
        title: 'Invalid Amount',
        description: 'Minimum recharge amount is LKR 100',
        variant: 'destructive'
      });
      return;
    }

    setIsProcessing(true);

    try {
      // Create recharge transaction
      const transaction = await walletService.createRechargeTransaction(
        wallet.id,
        amount,
        paymentMethod,
        'payhere' // Default gateway for now
      );

      if (!transaction) {
        throw new Error('Failed to create recharge transaction');
      }

      // Process payment based on method
      let paymentSuccess = false;
      
      if (paymentMethod === 'card') {
        // Initiate card payment
        const paymentResponse = await paymentGateway.initiatePayHerePayment({
          amount: amount,
          currency: 'LKR',
          orderId: transaction.id,
          returnUrl: `${window.location.origin}/wallet?payment=success`,
          cancelUrl: `${window.location.origin}/wallet?payment=cancelled`,
          notifyUrl: `${window.location.origin}/api/payment/notify`,
          customerName: user.email?.split('@')[0] || 'Customer',
          customerEmail: user.email || '',
          items: 'Wallet Recharge'
        });

        if (paymentResponse.success && paymentResponse.paymentUrl) {
          // Redirect to payment gateway
          window.location.href = paymentResponse.paymentUrl;
          return;
        }
      } else {
        // For demo, simulate other payment methods
        await simulatePaymentProcessing(transaction.id);
        paymentSuccess = true;
      }

      if (paymentSuccess) {
        toast({
          title: 'Recharge Successful',
          description: `Your wallet has been recharged with ${walletService.formatCurrency(amount)}`,
        });
      }

      if (onSuccess) {
        onSuccess();
      }

      onClose();
    } catch (error) {
      console.error('Recharge error:', error);
      toast({
        title: 'Recharge Failed',
        description: 'Unable to process your recharge. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const simulatePaymentProcessing = async (transactionId: string) => {
    // Simulate payment gateway processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Update transaction status to completed
    await walletService.updateTransactionStatus(
      transactionId,
      'completed',
      `DEMO-${Date.now()}`
    );
  };

  const selectedMethodDetails = PAYMENT_METHODS.find(m => m.id === paymentMethod);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Wallet className="w-5 h-5" />
            Recharge Wallet
          </DialogTitle>
          <DialogDescription>
            Add funds to your wallet for quick and easy bookings
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Current Balance */}
          {wallet && (
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-600">Current Balance</p>
              <p className="text-2xl font-semibold">
                {walletService.formatCurrency(wallet.balance)}
              </p>
            </div>
          )}

          {/* Amount Selection */}
          <div className="space-y-3">
            <Label>Select Amount</Label>
            <div className="grid grid-cols-3 gap-2">
              {RECHARGE_AMOUNTS.map((presetAmount) => (
                <Button
                  key={presetAmount}
                  variant={amount === presetAmount && !customAmount ? 'default' : 'outline'}
                  onClick={() => handleAmountSelect(presetAmount)}
                  className="h-12"
                >
                  {walletService.formatCurrency(presetAmount, 'LKR').replace('LKR', '').trim()}
                </Button>
              ))}
            </div>
            
            <div className="flex items-center gap-2">
              <Label htmlFor="custom-amount" className="whitespace-nowrap">
                Or enter amount:
              </Label>
              <Input
                id="custom-amount"
                type="number"
                placeholder="Enter amount"
                value={customAmount}
                onChange={(e) => handleCustomAmountChange(e.target.value)}
                min="100"
                className="flex-1"
              />
            </div>
          </div>

          {/* Payment Method Selection */}
          <div className="space-y-3">
            <Label>Payment Method</Label>
            <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
              {PAYMENT_METHODS.map((method) => {
                const Icon = method.icon;
                return (
                  <div
                    key={method.id}
                    className="flex items-start space-x-3 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer"
                    onClick={() => setPaymentMethod(method.id)}
                  >
                    <RadioGroupItem value={method.id} id={method.id} />
                    <div className="flex-1">
                      <Label
                        htmlFor={method.id}
                        className="flex items-center gap-2 cursor-pointer"
                      >
                        <Icon className="w-4 h-4" />
                        {method.name}
                      </Label>
                      <p className="text-sm text-gray-600 mt-1">
                        {method.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </RadioGroup>
          </div>

          {/* Summary */}
          <div className="border-t pt-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span>Recharge Amount</span>
              <span>{walletService.formatCurrency(amount)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Payment Method</span>
              <span>{selectedMethodDetails?.name}</span>
            </div>
            <div className="flex justify-between font-semibold">
              <span>Total</span>
              <span>{walletService.formatCurrency(amount)}</span>
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isProcessing}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            onClick={handleRecharge}
            disabled={isProcessing || amount < 100}
            className="flex-1"
          >
            {isProcessing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              `Recharge ${walletService.formatCurrency(amount)}`
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}