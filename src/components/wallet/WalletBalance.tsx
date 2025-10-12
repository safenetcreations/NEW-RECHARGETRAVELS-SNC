import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Wallet, Plus, RefreshCw } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { walletService } from '@/services/walletService';
import { RechargeModal } from './RechargeModal';
import { useNavigate } from 'react-router-dom';

interface WalletBalanceProps {
  variant?: 'header' | 'full';
  showRechargeButton?: boolean;
}

export function WalletBalance({ 
  variant = 'header', 
  showRechargeButton = true 
}: WalletBalanceProps) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [wallet, setWallet] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showRechargeModal, setShowRechargeModal] = useState(false);

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
    loadWallet(); // Reload wallet to show updated balance
  };

  if (!user) {
    return null;
  }

  if (isLoading) {
    return (
      <div className="flex items-center gap-2 text-gray-500">
        <RefreshCw className="w-4 h-4 animate-spin" />
        <span className="text-sm">Loading...</span>
      </div>
    );
  }

  if (variant === 'header') {
    return (
      <>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/wallet')}
            className="flex items-center gap-2"
          >
            <Wallet className="w-4 h-4" />
            <span className="font-medium">
              {wallet ? walletService.formatCurrency(wallet.balance) : 'LKR 0.00'}
            </span>
          </Button>
          {showRechargeButton && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => setShowRechargeModal(true)}
              className="flex items-center gap-1"
            >
              <Plus className="w-3 h-3" />
              Recharge
            </Button>
          )}
        </div>

        <RechargeModal
          isOpen={showRechargeModal}
          onClose={() => setShowRechargeModal(false)}
          onSuccess={handleRechargeSuccess}
        />
      </>
    );
  }

  // Full variant for dashboard/profile pages
  return (
    <>
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-green-100 rounded-full">
              <Wallet className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">Wallet Balance</h3>
              <p className="text-sm text-gray-600">
                Available for instant bookings
              </p>
            </div>
          </div>
          <Button
            onClick={loadWallet}
            variant="ghost"
            size="sm"
            className="text-gray-500"
          >
            <RefreshCw className="w-4 h-4" />
          </Button>
        </div>

        <div className="mb-6">
          <p className="text-3xl font-bold text-green-600">
            {wallet ? walletService.formatCurrency(wallet.balance) : 'LKR 0.00'}
          </p>
          {wallet?.status !== 'active' && (
            <p className="text-sm text-red-600 mt-1">
              Wallet is {wallet?.status}
            </p>
          )}
        </div>

        <div className="flex gap-3">
          <Button
            onClick={() => setShowRechargeModal(true)}
            className="flex-1"
          >
            <Plus className="w-4 h-4 mr-2" />
            Recharge Wallet
          </Button>
          <Button
            variant="outline"
            onClick={() => navigate('/wallet/transactions')}
            className="flex-1"
          >
            View Transactions
          </Button>
        </div>

        {wallet && wallet.balance > 0 && (
          <div className="mt-4 p-3 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-800">
              💡 Use your wallet balance for instant bookings without entering payment details
            </p>
          </div>
        )}
      </div>

      <RechargeModal
        isOpen={showRechargeModal}
        onClose={() => setShowRechargeModal(false)}
        onSuccess={handleRechargeSuccess}
      />
    </>
  );
}