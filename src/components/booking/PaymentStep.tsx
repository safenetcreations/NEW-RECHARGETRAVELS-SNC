import React, { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Wallet, CreditCard, AlertCircle, CheckCircle } from 'lucide-react';
import { walletService } from '@/services/walletService';
import { useAuth } from '@/hooks/useAuth';
import { RechargeModal } from '../wallet/RechargeModal';

interface PaymentStepProps {
  totalAmount: number;
  currency?: string;
  onPaymentMethodSelect: (method: 'wallet' | 'card') => void;
  selectedPaymentMethod?: 'wallet' | 'card';
}

export const PaymentStep: React.FC<PaymentStepProps> = ({
  totalAmount,
  currency = 'USD',
  onPaymentMethodSelect,
  selectedPaymentMethod
}) => {
  const { user } = useAuth();
  const [wallet, setWallet] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showRechargeModal, setShowRechargeModal] = useState(false);
  
  // Convert USD to LKR (assuming 1 USD = 325 LKR, you may want to make this dynamic)
  const exchangeRate = 325;
  const amountInLKR = currency === 'USD' ? totalAmount * exchangeRate : totalAmount;

  useEffect(() => {
    if (user?.uid) {
      loadWallet();
    }
  }, [user]);

  const loadWallet = async () => {
    if (!user?.uid) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    try {
      let userWallet = await walletService.getUserWallet(user.uid);
      
      if (!userWallet) {
        // Create wallet if it doesn't exist
        userWallet = await walletService.createWallet(user.uid);
      }
      
      setWallet(userWallet);
    } catch (error) {
      console.error('Error loading wallet:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRechargeSuccess = () => {
    loadWallet();
    setShowRechargeModal(false);
  };

  const hasInsufficientBalance = wallet && wallet.balance < amountInLKR;

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Select Payment Method</h3>
        
        {/* Order Summary */}
        <Card className="p-4 mb-4 bg-gray-50">
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Total Amount:</span>
            <span className="text-xl font-bold">
              {currency === 'USD' ? `$${totalAmount}` : `LKR ${totalAmount}`}
            </span>
          </div>
          {currency === 'USD' && (
            <div className="text-sm text-gray-500 mt-1 text-right">
              ≈ {walletService.formatCurrency(amountInLKR)}
            </div>
          )}
        </Card>

        {/* Payment Methods */}
        <div className="space-y-3">
          {/* Wallet Payment Option */}
          <div 
            className={`border rounded-lg p-4 cursor-pointer transition-all ${
              selectedPaymentMethod === 'wallet' 
                ? 'border-orange-500 bg-orange-50' 
                : 'border-gray-200 hover:border-gray-300'
            }`}
            onClick={() => !hasInsufficientBalance && onPaymentMethodSelect('wallet')}
          >
            <div className="flex items-start gap-3">
              <div className="mt-1">
                <Wallet className={`w-5 h-5 ${
                  selectedPaymentMethod === 'wallet' ? 'text-orange-600' : 'text-gray-600'
                }`} />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">Pay with Wallet</h4>
                  {selectedPaymentMethod === 'wallet' && (
                    <CheckCircle className="w-5 h-5 text-orange-600" />
                  )}
                </div>
                <p className="text-sm text-gray-600 mt-1">
                  Instant payment using your wallet balance
                </p>
                
                {!isLoading && wallet && (
                  <div className="mt-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Available Balance:</span>
                      <span className={`font-medium ${
                        hasInsufficientBalance ? 'text-red-600' : 'text-green-600'
                      }`}>
                        {walletService.formatCurrency(wallet.balance)}
                      </span>
                    </div>
                    
                    {hasInsufficientBalance && (
                      <Alert className="mt-3 border-red-200 bg-red-50">
                        <AlertCircle className="w-4 h-4 text-red-600" />
                        <AlertDescription className="text-red-800">
                          Insufficient balance. You need {walletService.formatCurrency(amountInLKR - wallet.balance)} more.
                          <Button
                            size="sm"
                            variant="link"
                            className="text-red-800 underline ml-1 p-0 h-auto"
                            onClick={(e) => {
                              e.stopPropagation();
                              setShowRechargeModal(true);
                            }}
                          >
                            Recharge now
                          </Button>
                        </AlertDescription>
                      </Alert>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Card Payment Option */}
          <div 
            className={`border rounded-lg p-4 cursor-pointer transition-all ${
              selectedPaymentMethod === 'card' 
                ? 'border-orange-500 bg-orange-50' 
                : 'border-gray-200 hover:border-gray-300'
            }`}
            onClick={() => onPaymentMethodSelect('card')}
          >
            <div className="flex items-start gap-3">
              <div className="mt-1">
                <CreditCard className={`w-5 h-5 ${
                  selectedPaymentMethod === 'card' ? 'text-orange-600' : 'text-gray-600'
                }`} />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">Pay with Card</h4>
                  {selectedPaymentMethod === 'card' && (
                    <CheckCircle className="w-5 h-5 text-orange-600" />
                  )}
                </div>
                <p className="text-sm text-gray-600 mt-1">
                  Pay using credit or debit card
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Security Note */}
        <div className="mt-6 p-3 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-800 flex items-center gap-2">
            <AlertCircle className="w-4 h-4" />
            Your payment information is secure and encrypted
          </p>
        </div>
      </div>

      {/* Recharge Modal */}
      <RechargeModal
        isOpen={showRechargeModal}
        onClose={() => setShowRechargeModal(false)}
        onSuccess={handleRechargeSuccess}
        suggestedAmount={Math.ceil((amountInLKR - (wallet?.balance || 0)) / 100) * 100}
      />
    </div>
  );
};