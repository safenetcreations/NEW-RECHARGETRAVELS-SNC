import { db, auth } from '@/lib/firebase';
import { 
  collection, 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  query, 
  where, 
  orderBy, 
  limit,
  getDocs,
  addDoc,
  serverTimestamp,
  Timestamp,
  runTransaction,
  onSnapshot
} from 'firebase/firestore';

export interface Wallet {
  id: string;
  userId: string;
  balance: number;
  currency: string;
  status: 'active' | 'suspended' | 'closed';
  createdAt: Date;
  updatedAt: Date;
}

export interface RechargeTransaction {
  id: string;
  walletId: string;
  amount: number;
  currency: string;
  transactionType: 'recharge' | 'payment' | 'refund' | 'withdrawal';
  paymentMethod: 'card' | 'bank_transfer' | 'paypal' | 'dialog' | 'mobitel' | 'wallet';
  paymentGateway?: string;
  paymentGatewayRef?: string;
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled';
  description?: string;
  metadata?: any;
  createdAt: Date;
  completedAt?: Date;
}

export interface PaymentMethod {
  id: string;
  userId: string;
  methodType: 'card' | 'bank_account' | 'mobile_money';
  provider: string;
  lastFour?: string;
  holderName?: string;
  isDefault: boolean;
  isActive: boolean;
  metadata?: any;
  createdAt: Date;
  updatedAt: Date;
}

class FirebaseWalletService {
  private walletsCollection = 'userWallets';
  private transactionsCollection = 'rechargeTransactions';
  private paymentMethodsCollection = 'walletPaymentMethods';
  private bookingPaymentsCollection = 'walletBookingPayments';

  // Get user wallet
  async getUserWallet(userId: string): Promise<Wallet | null> {
    try {
      const walletQuery = query(
        collection(db, this.walletsCollection),
        where('userId', '==', userId),
        where('currency', '==', 'LKR'),
        limit(1)
      );
      
      const querySnapshot = await getDocs(walletQuery);
      
      if (querySnapshot.empty) {
        // Create wallet if it doesn't exist
        return await this.createWallet(userId);
      }
      
      const walletDoc = querySnapshot.docs[0];
      const walletData = walletDoc.data();
      
      return {
        id: walletDoc.id,
        userId: walletData.userId,
        balance: walletData.balance,
        currency: walletData.currency,
        status: walletData.status,
        createdAt: walletData.createdAt?.toDate() || new Date(),
        updatedAt: walletData.updatedAt?.toDate() || new Date()
      };
    } catch (error) {
      console.error('Error fetching wallet:', error);
      return null;
    }
  }

  // Create wallet for user
  async createWallet(userId: string, currency: string = 'LKR'): Promise<Wallet | null> {
    try {
      const newWallet = {
        userId,
        currency,
        balance: 0,
        status: 'active' as const,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };
      
      const docRef = await addDoc(collection(db, this.walletsCollection), newWallet);
      
      return {
        id: docRef.id,
        userId,
        currency,
        balance: 0,
        status: 'active',
        createdAt: new Date(),
        updatedAt: new Date()
      };
    } catch (error) {
      console.error('Error creating wallet:', error);
      return null;
    }
  }

  // Get wallet transactions
  async getWalletTransactions(walletId: string, limitCount: number = 50): Promise<RechargeTransaction[]> {
    try {
      const transactionsQuery = query(
        collection(db, this.transactionsCollection),
        where('walletId', '==', walletId),
        orderBy('createdAt', 'desc'),
        limit(limitCount)
      );
      
      const querySnapshot = await getDocs(transactionsQuery);
      
      return querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          walletId: data.walletId,
          amount: data.amount,
          currency: data.currency,
          transactionType: data.transactionType,
          paymentMethod: data.paymentMethod,
          paymentGateway: data.paymentGateway,
          paymentGatewayRef: data.paymentGatewayRef,
          status: data.status,
          description: data.description,
          metadata: data.metadata,
          createdAt: data.createdAt?.toDate() || new Date(),
          completedAt: data.completedAt?.toDate()
        };
      });
    } catch (error) {
      console.error('Error fetching transactions:', error);
      return [];
    }
  }

  // Create recharge transaction
  async createRechargeTransaction(
    walletId: string,
    amount: number,
    paymentMethod: string,
    paymentGateway?: string
  ): Promise<RechargeTransaction | null> {
    try {
      const newTransaction = {
        walletId,
        amount,
        currency: 'LKR',
        transactionType: 'recharge',
        paymentMethod,
        paymentGateway,
        status: 'pending',
        description: `Wallet recharge of LKR ${amount}`,
        createdAt: serverTimestamp(),
        metadata: {}
      };
      
      const docRef = await addDoc(collection(db, this.transactionsCollection), newTransaction);
      
      return {
        id: docRef.id,
        walletId,
        amount,
        currency: 'LKR',
        transactionType: 'recharge',
        paymentMethod: paymentMethod as any,
        paymentGateway,
        status: 'pending',
        description: `Wallet recharge of LKR ${amount}`,
        createdAt: new Date(),
        metadata: {}
      };
    } catch (error) {
      console.error('Error creating recharge transaction:', error);
      return null;
    }
  }

  // Update transaction status with automatic balance update
  async updateTransactionStatus(
    transactionId: string,
    status: 'processing' | 'completed' | 'failed' | 'cancelled',
    paymentGatewayRef?: string
  ): Promise<boolean> {
    try {
      await runTransaction(db, async (transaction) => {
        const transactionRef = doc(db, this.transactionsCollection, transactionId);
        const transactionDoc = await transaction.get(transactionRef);
        
        if (!transactionDoc.exists()) {
          throw new Error('Transaction not found');
        }
        
        const transactionData = transactionDoc.data();
        
        // Update transaction
        const updateData: any = {
          status,
          updatedAt: serverTimestamp()
        };
        
        if (status === 'completed') {
          updateData.completedAt = serverTimestamp();
        }
        
        if (paymentGatewayRef) {
          updateData.paymentGatewayRef = paymentGatewayRef;
        }
        
        transaction.update(transactionRef, updateData);
        
        // If transaction is completed and it's a recharge, update wallet balance
        if (status === 'completed' && transactionData.transactionType === 'recharge') {
          const walletQuery = query(
            collection(db, this.walletsCollection),
            where('__name__', '==', transactionData.walletId),
            limit(1)
          );
          
          const walletSnapshot = await getDocs(walletQuery);
          
          if (!walletSnapshot.empty) {
            const walletRef = walletSnapshot.docs[0].ref;
            const walletData = walletSnapshot.docs[0].data();
            
            transaction.update(walletRef, {
              balance: walletData.balance + transactionData.amount,
              updatedAt: serverTimestamp()
            });
          }
        }
      });
      
      return true;
    } catch (error) {
      console.error('Error updating transaction status:', error);
      return false;
    }
  }

  // Get payment methods
  async getPaymentMethods(userId: string): Promise<PaymentMethod[]> {
    try {
      const methodsQuery = query(
        collection(db, this.paymentMethodsCollection),
        where('userId', '==', userId),
        where('isActive', '==', true),
        orderBy('isDefault', 'desc')
      );
      
      const querySnapshot = await getDocs(methodsQuery);
      
      return querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          userId: data.userId,
          methodType: data.methodType,
          provider: data.provider,
          lastFour: data.lastFour,
          holderName: data.holderName,
          isDefault: data.isDefault,
          isActive: data.isActive,
          metadata: data.metadata,
          createdAt: data.createdAt?.toDate() || new Date(),
          updatedAt: data.updatedAt?.toDate() || new Date()
        };
      });
    } catch (error) {
      console.error('Error fetching payment methods:', error);
      return [];
    }
  }

  // Add payment method
  async addPaymentMethod(
    userId: string,
    methodType: 'card' | 'bank_account' | 'mobile_money',
    provider: string,
    details: {
      lastFour?: string;
      holderName?: string;
      metadata?: any;
    }
  ): Promise<PaymentMethod | null> {
    try {
      const newMethod = {
        userId,
        methodType,
        provider,
        lastFour: details.lastFour,
        holderName: details.holderName,
        metadata: details.metadata || {},
        isDefault: false,
        isActive: true,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };
      
      const docRef = await addDoc(collection(db, this.paymentMethodsCollection), newMethod);
      
      return {
        id: docRef.id,
        userId,
        methodType,
        provider,
        lastFour: details.lastFour,
        holderName: details.holderName,
        isDefault: false,
        isActive: true,
        metadata: details.metadata || {},
        createdAt: new Date(),
        updatedAt: new Date()
      };
    } catch (error) {
      console.error('Error adding payment method:', error);
      return null;
    }
  }

  // Check if user has sufficient balance
  async checkBalance(walletId: string, amount: number): Promise<boolean> {
    try {
      const walletDoc = await getDoc(doc(db, this.walletsCollection, walletId));
      
      if (!walletDoc.exists()) {
        return false;
      }
      
      const walletData = walletDoc.data();
      return walletData.balance >= amount;
    } catch (error) {
      console.error('Error checking balance:', error);
      return false;
    }
  }

  // Create wallet payment for booking
  async createBookingPayment(
    walletId: string,
    bookingId: string,
    amount: number
  ): Promise<boolean> {
    try {
      await runTransaction(db, async (transaction) => {
        // Check wallet balance
        const walletRef = doc(db, this.walletsCollection, walletId);
        const walletDoc = await transaction.get(walletRef);
        
        if (!walletDoc.exists()) {
          throw new Error('Wallet not found');
        }
        
        const walletData = walletDoc.data();
        
        if (walletData.balance < amount) {
          throw new Error('Insufficient balance');
        }
        
        // Create payment transaction
        const transactionRef = doc(collection(db, this.transactionsCollection));
        transaction.set(transactionRef, {
          walletId,
          amount,
          currency: 'LKR',
          transactionType: 'payment',
          paymentMethod: 'wallet',
          status: 'completed',
          description: `Payment for booking ${bookingId}`,
          metadata: { bookingId },
          createdAt: serverTimestamp(),
          completedAt: serverTimestamp()
        });
        
        // Record booking payment
        const bookingPaymentRef = doc(collection(db, this.bookingPaymentsCollection));
        transaction.set(bookingPaymentRef, {
          walletId,
          bookingId,
          amount,
          currency: 'LKR',
          status: 'completed',
          createdAt: serverTimestamp()
        });
        
        // Update wallet balance
        transaction.update(walletRef, {
          balance: walletData.balance - amount,
          updatedAt: serverTimestamp()
        });
      });
      
      return true;
    } catch (error) {
      console.error('Error creating booking payment:', error);
      return false;
    }
  }

  // Format currency
  formatCurrency(amount: number, currency: string = 'LKR'): string {
    return new Intl.NumberFormat('en-LK', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2
    }).format(amount);
  }

  // Subscribe to wallet balance changes (real-time updates)
  subscribeToWalletBalance(userId: string, callback: (wallet: Wallet | null) => void): () => void {
    const walletQuery = query(
      collection(db, this.walletsCollection),
      where('userId', '==', userId),
      where('currency', '==', 'LKR'),
      limit(1)
    );
    
    const unsubscribe = onSnapshot(walletQuery, (snapshot) => {
      if (snapshot.empty) {
        callback(null);
      } else {
        const walletDoc = snapshot.docs[0];
        const walletData = walletDoc.data();
        
        callback({
          id: walletDoc.id,
          userId: walletData.userId,
          balance: walletData.balance,
          currency: walletData.currency,
          status: walletData.status,
          createdAt: walletData.createdAt?.toDate() || new Date(),
          updatedAt: walletData.updatedAt?.toDate() || new Date()
        });
      }
    }, (error) => {
      console.error('Error subscribing to wallet balance:', error);
      callback(null);
    });
    
    return unsubscribe;
  }
}

export const firebaseWalletService = new FirebaseWalletService();