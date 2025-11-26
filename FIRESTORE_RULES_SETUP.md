# Firebase Firestore Rules Setup

## Problem
You're getting `PERMISSION_DENIED` errors when trying to seed data because Firestore security rules are blocking write access.

## Solution

You need to update your Firestore security rules in the Firebase Console.

### Step 1: Go to Firebase Console

1. Open https://console.firebase.google.com/
2. Select your project: **recharge-travels-73e76**
3. Click on **Firestore Database** in the left menu
4. Click on the **Rules** tab

### Step 2: Update Security Rules

Replace your current rules with these (for development):

```javascript
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {

    // Wild Tours Collection
    match /wildTours/{tourId} {
      // Allow anyone to read wild tours
      allow read: if true;

      // Only authenticated users can write
      allow write: if request.auth != null;

      // Or for development, allow all writes (TEMPORARY - not for production)
      // allow write: if true;
    }

    // Default rule for other collections
    match /{document=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

### Step 3: For Production (Recommended)

Use these more secure rules:

```javascript
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {

    // Helper function to check if user is admin
    function isAdmin() {
      return request.auth != null &&
             get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }

    // Wild Tours Collection
    match /wildTours/{tourId} {
      // Anyone can read active tours
      allow read: if resource.data.isActive == true || isAdmin();

      // Only admins can create, update, delete
      allow create, update, delete: if isAdmin();
    }

    // Users Collection
    match /users/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth.uid == userId || isAdmin();
    }

    // Bookings Collection
    match /bookings/{bookingId} {
      allow read: if request.auth != null &&
                     (resource.data.userId == request.auth.uid || isAdmin());
      allow create: if request.auth != null;
      allow update, delete: if isAdmin();
    }

    // Default rule - deny all
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

### Step 4: Test Rules

Click **"Publish"** to save the rules.

### Alternative: Use Firebase Admin SDK

If you want to seed data without authentication, create a service account:

1. Go to **Project Settings** → **Service Accounts**
2. Click **Generate New Private Key**
3. Download the JSON file
4. Create a new seed script using Admin SDK:

```typescript
// scripts/seedWildToursWithAdmin.ts
import admin from 'firebase-admin';
import serviceAccount from './serviceAccountKey.json';

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount as admin.ServiceAccount)
});

const db = admin.firestore();

// Your seeding code here using admin.firestore()
```

## Quick Fix for Development

**Temporarily allow all writes** (NOT RECOMMENDED FOR PRODUCTION):

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true;  // ⚠️ WARNING: Open access
    }
  }
}
```

This will allow the seed script to run, but **remember to change this before going to production!**

## After Updating Rules

Run the seed script again:

```bash
npx tsx scripts/seedWildToursData.ts
```

## Need Help?

If you continue having issues:
1. Check Firebase Console → Firestore → Rules tab
2. Look at the "Rules playground" to test your rules
3. Make sure you're signed in if using authenticated writes
