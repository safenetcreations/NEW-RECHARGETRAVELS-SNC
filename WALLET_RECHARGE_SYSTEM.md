# Wallet Recharge System Documentation

## Overview
The Recharge Travels platform now includes a comprehensive wallet system that allows users to:
- Add funds to their digital wallet
- Make instant bookings using wallet balance
- Track transaction history
- Manage payment methods

## Features Implemented

### 1. Database Schema (Firebase Firestore)
Created four collections:
- `userWallets` - Stores user wallet information and balance
- `rechargeTransactions` - Records all wallet transactions
- `walletPaymentMethods` - Stores saved payment methods
- `walletBookingPayments` - Links wallet payments to bookings

### 2. User Interface Components

#### Wallet Balance Display
- Location: Header (for logged-in users)
- Shows current balance in LKR
- Quick recharge button
- Click to view full wallet dashboard

#### Recharge Modal
- Multiple recharge amount options (LKR 1,000 to 50,000)
- Custom amount input
- Payment method selection:
  - Credit/Debit Card (via PayHere)
  - Bank Transfer
  - Mobile Money (Dialog/Mobitel)

#### Transaction History Page
- Route: `/wallet` or `/wallet/transactions`
- Features:
  - View all transactions
  - Filter by type (recharge, payment, refund)
  - Export to CSV
  - Transaction status badges
  - Quick stats overview

#### Wallet Payment in Booking Flow
- Added payment step to booking process
- Users can choose between wallet or card payment
- Automatic balance checking
- Insufficient funds handling with recharge prompt

### 3. Services

#### Wallet Service (`walletService.ts`)
- Core wallet operations
- Transaction management
- Balance checking
- Currency formatting

#### Payment Gateway Service (`paymentGateway.ts`)
- PayHere integration (Sri Lankan payment gateway)
- Mobile money support
- Bank transfer handling
- Stripe integration placeholder

## Setup Instructions

### 1. Deploy Firestore Security Rules
```bash
# Install Firebase CLI if not already installed
npm install -g firebase-tools

# Login to Firebase
firebase login

# Deploy security rules
firebase deploy --only firestore:rules
```

### 2. Environment Variables
Add these to your `.env` file:
```env
VITE_PAYHERE_MERCHANT_ID=your_merchant_id
VITE_PAYHERE_MERCHANT_SECRET=your_merchant_secret
VITE_PAYMENT_ENV=sandbox
```

### 3. Payment Gateway Setup

#### PayHere (Recommended for Sri Lanka)
1. Sign up at https://www.payhere.lk
2. Get sandbox credentials
3. Configure webhook URL: `{your-domain}/api/payment/notify`

#### Mobile Money Integration
- Dialog: Contact Dialog Business Solutions
- Mobitel: Contact Mobitel Enterprise Services

## User Flow

### Recharging Wallet
1. User clicks wallet balance or recharge button
2. Selects amount and payment method
3. Completes payment on gateway
4. Wallet balance updates automatically

### Making Booking with Wallet
1. User proceeds through booking flow
2. At payment step, selects "Wallet"
3. System checks balance
4. If sufficient: Payment processed instantly
5. If insufficient: Prompts to recharge

### Viewing Transactions
1. User clicks "My Wallet" in user menu
2. Views balance and recent transactions
3. Can filter, search, and export data

## Security Features
- Firestore Security Rules on all wallet collections
- Users can only view/modify their own data
- Payment gateway webhook verification
- Transaction status tracking
- Automatic balance updates via Firestore transactions

## Testing

### Test Credentials
For PayHere sandbox testing:
- Card Number: 4916217501611292
- CVV: 123
- Expiry: Any future date

### Test Scenarios
1. **Successful Recharge**: Use test card above
2. **Failed Payment**: Use card number 4111111111111111
3. **Insufficient Balance**: Try booking with empty wallet
4. **Transaction History**: Make multiple transactions and verify listing

## API Endpoints Needed (Backend)

The following endpoints should be implemented in your backend:

```javascript
// Payment webhook handler
POST /api/payment/notify
- Verify payment status
- Update transaction status
- Update wallet balance

// Get wallet balance (optional, currently handled by Supabase RLS)
GET /api/wallet/balance

// Process wallet payment (optional, currently handled by Supabase)
POST /api/wallet/pay
```

## Troubleshooting

### Common Issues

1. **Wallet not created for existing users**
   - Wallets are automatically created on first access
   - Check Firebase console to verify wallet creation

2. **Payment gateway errors**
   - Check environment variables
   - Verify merchant credentials
   - Check webhook URL configuration

3. **Balance not updating**
   - Verify Firestore transactions are completing
   - Check Firebase console for transaction logs
   - Ensure security rules allow the operation

## Future Enhancements

1. **Wallet-to-Wallet Transfers**
   - Allow users to send money to each other

2. **Loyalty Points Integration**
   - Convert loyalty points to wallet balance

3. **Automated Refunds**
   - Process booking cancellation refunds to wallet

4. **Multi-Currency Support**
   - Support USD, EUR alongside LKR

5. **Recurring Payments**
   - Auto-recharge options

## Support

For technical support or integration assistance:
- Email: support@rechargetravels.lk
- Documentation: This file
- Payment Gateway Support: PayHere - support@payhere.lk