# Firebase Migration Guide

## Overview
This project has been migrated from Supabase to Firebase, consolidating all backend services under Google's ecosystem for better integration and simplified deployment.

## Migration Summary

### 1. Authentication
- **Before**: Supabase Auth
- **After**: Firebase Authentication
- **Changes**: 
  - Email/password authentication
  - Google Sign-In support
  - Email verification
  - Password reset functionality
  - User profiles stored in Firestore

### 2. Database
- **Before**: Supabase PostgreSQL
- **After**: Firebase Firestore
- **Collections**:
  - `users` - User profiles and preferences
  - `userWallets` - Digital wallet information
  - `rechargeTransactions` - Wallet transaction history
  - `walletPaymentMethods` - Saved payment methods
  - `walletBookingPayments` - Booking payment records
  - `bookings` - Travel bookings
  - `tours`, `hotels`, `activities` - Travel content
  - `drivers`, `vehicles` - Transport services
  - `reviews` - Customer reviews

### 3. Security
- **Firestore Security Rules**: Comprehensive rules for all collections
- **Row-Level Security**: Implemented via Firestore rules
- **Admin Access**: Role-based access control

### 4. Real-time Features
- **Before**: Supabase real-time subscriptions
- **After**: Firestore real-time listeners
- **Example**: Live wallet balance updates

## Setup Instructions

### 1. Firebase Project Setup
```bash
1. Go to https://console.firebase.google.com
2. Create a new project or select existing
3. Enable Authentication (Email/Password + Google)
4. Enable Firestore Database
5. Enable Storage (if needed)
6. Get your configuration from Project Settings
```

### 2. Environment Variables
Create a `.env` file with your Firebase configuration:
```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

### 3. Deploy Firestore Rules
```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login to Firebase
firebase login

# Initialize Firebase in project
firebase init

# Deploy rules
firebase deploy --only firestore:rules
```

### 4. Install Dependencies
```bash
npm install
```

## Key Changes for Developers

### 1. Authentication
```typescript
// Before (Supabase)
import { supabase } from '@/integrations/supabase/client';
const { data, error } = await supabase.auth.signIn({ email, password });

// After (Firebase)
import { firebaseAuthService } from '@/services/firebaseAuthService';
const { user, error } = await firebaseAuthService.signIn(email, password);
```

### 2. Database Queries
```typescript
// Before (Supabase)
const { data } = await supabase
  .from('user_wallets')
  .select('*')
  .eq('user_id', userId);

// After (Firebase)
const walletQuery = query(
  collection(db, 'userWallets'),
  where('userId', '==', userId)
);
const querySnapshot = await getDocs(walletQuery);
```

### 3. Real-time Subscriptions
```typescript
// Before (Supabase)
const subscription = supabase
  .from('user_wallets')
  .on('UPDATE', handleUpdate)
  .subscribe();

// After (Firebase)
const unsubscribe = onSnapshot(walletQuery, (snapshot) => {
  // Handle updates
});
```

## Payment Integration

### PayHere (Sri Lankan Gateway)
- Configure webhook URL: `https://your-domain.com/api/payment/notify`
- Update merchant credentials in environment variables
- Test with sandbox credentials before production

### Mobile Money
- Dialog/Mobitel integration pending
- Contact providers for API access

## Deployment

### Firebase Hosting
```bash
npm run build:prod
firebase deploy --only hosting
```

### Google Cloud Run (Alternative)
```bash
gcloud run deploy recharge-travels \
  --source . \
  --region asia-south1 \
  --allow-unauthenticated
```

## Migration Checklist

- [x] Remove Supabase dependencies from package.json
- [x] Create Firebase service files
- [x] Update AuthContext to use Firebase
- [x] Convert wallet service to Firestore
- [x] Create Firestore security rules
- [x] Update environment variables
- [x] Remove Supabase integration folder
- [ ] Test all authentication flows
- [ ] Test wallet operations
- [ ] Test booking flows
- [ ] Deploy to Firebase

## Troubleshooting

### Common Issues

1. **Authentication Errors**
   - Ensure Firebase Auth is enabled in console
   - Check API keys in environment variables
   - Verify domain is authorized in Firebase console

2. **Firestore Permission Errors**
   - Deploy security rules: `firebase deploy --only firestore:rules`
   - Check user authentication status
   - Verify user roles in Firestore

3. **Wallet Balance Not Updating**
   - Check Firestore transactions are configured
   - Verify real-time listeners are active
   - Ensure proper error handling

## Support

For migration support:
- Firebase Documentation: https://firebase.google.com/docs
- Project Issues: https://github.com/your-repo/issues

---

**Note**: All Supabase-specific code has been removed. The application now runs entirely on Firebase and Google Cloud services.