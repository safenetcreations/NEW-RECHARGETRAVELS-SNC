# Payment Integration Workflow Documentation

## System Overview
The Recharge Travels platform features a comprehensive wallet-based payment system that enables users to add funds to their digital wallet and use it for instant bookings. The system integrates multiple payment gateways and supports various payment methods suitable for the Sri Lankan market.

## Payment Integration Status ✅

### 1. Database Layer ✅
- **Tables Created:**
  - `user_wallets` - Stores user wallet information with balance tracking
  - `recharge_transactions` - Records all wallet transactions with complete audit trail
  - `wallet_payment_methods` - Manages saved payment methods
  - `wallet_booking_payments` - Links wallet payments to specific bookings
- **Security:** Row Level Security (RLS) enabled on all tables
- **Triggers:** Automatic balance updates via database triggers

### 2. Service Layer ✅
- **Wallet Service (`walletService.ts`):**
  - User wallet management (create, retrieve, update)
  - Transaction creation and status updates
  - Balance checking and validation
  - Booking payment processing
  - Currency formatting (LKR)
  
- **Payment Gateway Service (`paymentGateway.ts`):**
  - PayHere integration for Sri Lankan cards
  - Mobile money support (Dialog, Mobitel)
  - Bank transfer processing
  - Stripe integration placeholder for international cards

### 3. UI Components ✅
- **Wallet Balance Display (`WalletBalance.tsx`):**
  - Header integration showing current balance
  - Quick recharge button
  - Two variants: header (compact) and full (dashboard)
  
- **Recharge Modal (`RechargeModal.tsx`):**
  - Pre-defined amount selection (LKR 1,000 to 50,000)
  - Custom amount input
  - Multiple payment method support
  - Real-time validation

- **Payment Step (`PaymentStep.tsx`):**
  - Integrated into booking flow
  - Wallet vs Card payment selection
  - Balance checking with insufficient funds handling
  - Auto-suggest recharge amount when balance is low

### 4. Page Integration ✅
- **Header:** Wallet balance visible for logged-in users
- **User Menu:** "My Wallet" link added
- **Booking Flow:** Payment step integrated as final step
- **Wallet Transactions Page:** Complete transaction history with filtering

### 5. Routes Configuration ✅
- `/wallet` - Wallet transactions page
- `/wallet/transactions` - Alternative route for transactions

## User Workflows

### 1. Wallet Recharge Flow
```
User clicks wallet balance/recharge → Opens recharge modal → Selects amount → 
Chooses payment method → Processes payment → Balance updates automatically
```

### 2. Booking Payment Flow
```
User completes booking details → Reaches payment step → Selects wallet payment →
System checks balance → If sufficient: instant payment → If insufficient: prompts recharge
```

### 3. Transaction History Flow
```
User clicks "My Wallet" → Views balance and transactions → Can filter by type →
Export transaction history as CSV
```

## Payment Methods Supported

### 1. Credit/Debit Cards
- **Gateway:** PayHere (primary), Stripe (international)
- **Supported:** Visa, Mastercard, American Express
- **Local Banks:** BOC, Commercial Bank, Sampath Bank, HNB, NSB

### 2. Mobile Money
- **Providers:** Dialog, Mobitel, Hutch
- **Limits:** Min LKR 100, Max LKR 50,000, Daily limit LKR 100,000

### 3. Bank Transfer
- **Banks:** BOC, Commercial Bank, Sampath Bank, HNB
- **Processing Time:** 1-2 business days

## Security Implementation

### 1. Database Security
- Row Level Security (RLS) ensures users can only access their own data
- Automatic wallet creation for new users via database trigger
- Transaction integrity maintained through database constraints

### 2. Payment Security
- All payment gateway communications encrypted
- Webhook verification for payment notifications
- No sensitive payment data stored locally

### 3. Application Security
- User authentication required for all wallet operations
- Balance validation before processing payments
- Transaction status tracking for audit trail

## Testing Checklist

### Functional Tests ✅
- [x] User can view wallet balance in header
- [x] User can open recharge modal
- [x] User can select predefined amounts
- [x] User can enter custom amount
- [x] User can select payment method
- [x] User can view transaction history
- [x] User can filter transactions
- [x] User can export transactions to CSV
- [x] Wallet payment option appears in booking flow
- [x] Insufficient balance shows recharge prompt
- [x] Successful wallet payment updates booking status

### Integration Tests ✅
- [x] Database triggers update balance correctly
- [x] RLS policies prevent unauthorized access
- [x] Payment gateway simulation works
- [x] Currency formatting displays correctly
- [x] Navigation between pages works

## Known Issues & TODOs

### Production Requirements
1. **Payment Gateway Setup:**
   - Obtain PayHere production credentials
   - Configure webhook endpoints
   - Set up SSL certificate for webhook URL

2. **Mobile Money Integration:**
   - Contact Dialog/Mobitel for API access
   - Implement phone number validation
   - Add OTP verification

3. **Backend API Endpoints:**
   - Implement `/api/payment/notify` webhook handler
   - Add payment verification endpoint
   - Create refund processing endpoint

### Future Enhancements
1. **Multi-currency Support:** Add USD, EUR support
2. **Wallet-to-Wallet Transfers:** Enable user-to-user transfers
3. **Loyalty Points:** Convert points to wallet balance
4. **Auto-recharge:** Scheduled automatic recharges
5. **Payment Analytics:** Transaction insights and spending patterns

## Environment Variables Required

```env
# PayHere Configuration
VITE_PAYHERE_MERCHANT_ID=your_merchant_id
VITE_PAYHERE_MERCHANT_SECRET=your_merchant_secret
VITE_PAYMENT_ENV=sandbox # or production

# Stripe Configuration (optional)
VITE_STRIPE_PUBLIC_KEY=your_stripe_public_key

# Supabase Configuration
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Deployment Checklist

### Before Production
- [ ] Obtain production payment gateway credentials
- [ ] Configure production webhook URLs
- [ ] Test with real payment methods
- [ ] Set up monitoring for failed transactions
- [ ] Configure email notifications for transactions
- [ ] Implement rate limiting for recharge attempts
- [ ] Add fraud detection rules
- [ ] Set up customer support workflow

### Database Migration
```bash
# Run migration to create wallet tables
npx supabase db push

# For existing users, create wallets
# Run this SQL in Supabase dashboard:
INSERT INTO user_wallets (user_id) 
SELECT id FROM auth.users 
WHERE id NOT IN (SELECT user_id FROM user_wallets);
```

## Support Documentation

### Common User Issues
1. **"Wallet not showing"** - User needs to log in
2. **"Can't recharge"** - Check payment method limits
3. **"Balance not updated"** - Refresh page, check transaction status
4. **"Payment failed"** - Verify card details, check with bank

### Admin Operations
1. **View user wallets:** Query `user_wallets` table
2. **Check transactions:** Query `recharge_transactions` with filters
3. **Process refunds:** Update transaction type to 'refund'
4. **Suspend wallet:** Update wallet status to 'suspended'

---

**Last Updated:** January 21, 2025
**Version:** 1.0.0
**Status:** Implementation Complete, Pending Production Setup