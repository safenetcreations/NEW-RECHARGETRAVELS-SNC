import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { format } from '@/lib/date-utils';
import { useAuth } from '@/hooks/useAuth';
import { walletService, RechargeTransaction } from '@/services/walletService';
import { WalletBalance } from '@/components/wallet/WalletBalance';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  ArrowDownRight, 
  ArrowUpRight, 
  Clock, 
  CheckCircle, 
  XCircle,
  RefreshCw,
  Download,
  Filter
} from 'lucide-react';

export default function WalletTransactions() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [wallet, setWallet] = useState<any>(null);
  const [transactions, setTransactions] = useState<RechargeTransaction[]>([]);
  const [filteredTransactions, setFilteredTransactions] = useState<RechargeTransaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<'all' | 'recharge' | 'payment' | 'refund'>('all');

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    loadWalletData();
  }, [user, navigate]);

  useEffect(() => {
    filterTransactions();
  }, [transactions, activeFilter]);

  const loadWalletData = async () => {
    if (!user?.uid) return;

    setIsLoading(true);
    try {
      const userWallet = await walletService.getUserWallet(user.uid);
      if (userWallet) {
        setWallet(userWallet);
        const walletTransactions = await walletService.getWalletTransactions(userWallet.id);
        setTransactions(walletTransactions);
      }
    } catch (error) {
      console.error('Error loading wallet data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filterTransactions = () => {
    if (activeFilter === 'all') {
      setFilteredTransactions(transactions);
    } else {
      setFilteredTransactions(
        transactions.filter(t => t.transactionType === activeFilter)
      );
    }
  };

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'recharge':
        return <ArrowDownRight className="w-4 h-4 text-green-600" />;
      case 'payment':
        return <ArrowUpRight className="w-4 h-4 text-red-600" />;
      case 'refund':
        return <ArrowDownRight className="w-4 h-4 text-blue-600" />;
      default:
        return null;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return (
          <Badge variant="default" className="bg-green-100 text-green-800">
            <CheckCircle className="w-3 h-3 mr-1" />
            Completed
          </Badge>
        );
      case 'pending':
        return (
          <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
            <Clock className="w-3 h-3 mr-1" />
            Pending
          </Badge>
        );
      case 'failed':
        return (
          <Badge variant="destructive">
            <XCircle className="w-3 h-3 mr-1" />
            Failed
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getAmountDisplay = (transaction: RechargeTransaction) => {
    const prefix = transaction.transactionType === 'payment' ? '-' : '+';
    const colorClass = transaction.transactionType === 'payment' 
      ? 'text-red-600' 
      : 'text-green-600';
    
    return (
      <span className={`font-semibold ${colorClass}`}>
        {prefix}{walletService.formatCurrency(transaction.amount)}
      </span>
    );
  };

  const exportTransactions = () => {
    const csv = [
      ['Date', 'Type', 'Amount', 'Status', 'Description', 'Reference'],
      ...filteredTransactions.map(t => [
        format(new Date(t.createdAt), 'yyyy-MM-dd HH:mm'),
        t.transactionType,
        t.amount.toString(),
        t.status,
        t.description || '',
        t.paymentGatewayRef || ''
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `wallet-transactions-${format(new Date(), 'yyyy-MM-dd')}.csv`;
    a.click();
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center h-64">
          <RefreshCw className="w-8 h-8 animate-spin text-gray-400" />
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Wallet & Transactions</h1>
        <p className="text-gray-600">
          Manage your wallet balance and view transaction history
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3 mb-8">
        <div className="md:col-span-2">
          <WalletBalance variant="full" />
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Quick Stats</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <p className="text-sm text-gray-600">Total Recharged</p>
              <p className="text-2xl font-semibold text-green-600">
                {walletService.formatCurrency(
                  transactions
                    .filter(t => t.transactionType === 'recharge' && t.status === 'completed')
                    .reduce((sum, t) => sum + t.amount, 0)
                )}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Spent</p>
              <p className="text-2xl font-semibold text-red-600">
                {walletService.formatCurrency(
                  transactions
                    .filter(t => t.transactionType === 'payment' && t.status === 'completed')
                    .reduce((sum, t) => sum + t.amount, 0)
                )}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Transactions</p>
              <p className="text-2xl font-semibold">{transactions.length}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Transaction History</CardTitle>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={loadWalletData}
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={exportTransactions}
              >
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
          <CardDescription>
            View all your wallet transactions and payment history
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeFilter} onValueChange={(value: any) => setActiveFilter(value)}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="all">
                All ({transactions.length})
              </TabsTrigger>
              <TabsTrigger value="recharge">
                Recharges ({transactions.filter(t => t.transactionType === 'recharge').length})
              </TabsTrigger>
              <TabsTrigger value="payment">
                Payments ({transactions.filter(t => t.transactionType === 'payment').length})
              </TabsTrigger>
              <TabsTrigger value="refund">
                Refunds ({transactions.filter(t => t.transactionType === 'refund').length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value={activeFilter} className="mt-6">
              {filteredTransactions.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <Filter className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                  <p>No transactions found</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredTransactions.map((transaction) => (
                    <div
                      key={transaction.id}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-start gap-3">
                        <div className="p-2 bg-gray-100 rounded-full">
                          {getTransactionIcon(transaction.transactionType)}
                        </div>
                        <div>
                          <p className="font-medium">
                            {transaction.description || 
                             `${transaction.transactionType.charAt(0).toUpperCase() + transaction.transactionType.slice(1)} Transaction`}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <p className="text-sm text-gray-600">
                              {format(new Date(transaction.createdAt), 'MMM dd, yyyy • hh:mm a')}
                            </p>
                            {transaction.paymentGatewayRef && (
                              <span className="text-xs text-gray-500">
                                • Ref: {transaction.paymentGatewayRef}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          {getAmountDisplay(transaction)}
                          <p className="text-xs text-gray-500 mt-1">
                            via {transaction.paymentMethod.replace('_', ' ')}
                          </p>
                        </div>
                        {getStatusBadge(transaction.status)}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}