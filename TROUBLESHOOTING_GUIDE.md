# Wild Tours - Troubleshooting Guide 🔧

## Issue 1: Firebase Permission Denied Error ❌

**Error Message:**
```
7 PERMISSION_DENIED: Missing or insufficient permissions
```

### Root Cause
Your Firestore security rules are blocking write access to the `wildTours` collection.

### Solutions (Choose One)

#### Solution A: Update Firestore Rules (Recommended for Development)

1. **Go to Firebase Console:**
   - Open https://console.firebase.google.com/
   - Select project: `recharge-travels-73e76`
   - Click **Firestore Database** → **Rules**

2. **Update Rules (Development Mode):**
   ```javascript
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /{document=**} {
         allow read, write: if true;
       }
     }
   }
   ```

3. **Click "Publish"**

4. **Run seed script again:**
   ```bash
   npx tsx scripts/seedWildToursData.ts
   ```

⚠️ **WARNING:** This allows open access. Use only for development!

#### Solution B: Seed with Authentication

1. **Create an admin user in Firebase Console:**
   - Go to Firebase Console → Authentication
   - Click "Add User"
   - Enter email and password
   - Remember these credentials

2. **Run the authenticated seed script:**
   ```bash
   npx tsx scripts/seedWildToursWithAuth.ts
   ```

3. **Enter your admin credentials when prompted**

#### Solution C: Production-Safe Rules

For production, use these secure rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // Helper function
    function isAdmin() {
      return request.auth != null &&
             exists(/databases/$(database)/documents/users/$(request.auth.uid)) &&
             get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }

    // Wild Tours - Public read, admin write
    match /wildTours/{tourId} {
      allow read: if true;
      allow write: if isAdmin();
    }

    // Users
    match /users/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth.uid == userId || isAdmin();
    }

    // Bookings
    match /bookings/{bookingId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null;
      allow update, delete: if isAdmin();
    }
  }
}
```

---

## Issue 2: Vite Module Not Found Error ❌

**Error Message:**
```
Cannot find package 'vite' imported from...
```

### Solution

Dependencies need to be installed:

```bash
# Install all dependencies
npm install

# If that doesn't work, try:
rm -rf node_modules package-lock.json
npm install

# Then start the dev server
npm run dev
```

---

## Issue 3: Page Loads But No Tours Display 🤔

### Possible Causes & Solutions

#### Cause A: No Data in Firebase
**Check:** Open Firebase Console → Firestore Database
**Solution:** Run the seed script

#### Cause B: Firebase Config Issue
**Check:** Console errors in browser dev tools
**Solution:** Verify `.env` file has correct Firebase credentials

#### Cause C: Fallback to Static Data Not Working
**Check:** Browser console for errors
**Solution:** The page should automatically fall back to static data if Firebase fails

---

## Issue 4: Admin Panel Not Showing Wild Tours Section 🔍

### Solution

1. **Check if component is imported:**
   - Look for `WildToursAdmin` import in admin panel
   - Make sure it's added to the admin routes

2. **Temporary workaround:**
   - Access directly via URL: `/admin/wild-tours`
   - Or add to admin navigation manually

---

## Issue 5: Tours Display But "Full Details" Button Doesn't Work 🚫

### Possible Causes

1. **Missing Accordion Component:**
   ```bash
   # Install shadcn accordion
   npx shadcn@latest add accordion
   ```

2. **Missing Dialog Component:**
   ```bash
   # Install shadcn dialog
   npx shadcn@latest add dialog
   ```

---

## Quick Diagnostic Commands

### Check Firebase Connection
```bash
# In browser console (when viewing the page)
console.log('Firebase DB:', db);
console.log('Firebase Auth:', auth);
```

### Check Data in Firestore
1. Go to Firebase Console
2. Click Firestore Database
3. Look for `wildTours` collection
4. Should see documents with tour data

### Check if Static Data Works
```bash
# In browser console
import { wildToursData } from './src/data/wildToursData';
console.log(wildToursData);
```

---

## Complete Reset Process 🔄

If everything is broken, start fresh:

```bash
# 1. Clean install
rm -rf node_modules package-lock.json
npm install

# 2. Update Firestore rules (see Solution A above)

# 3. Seed data
npx tsx scripts/seedWildToursData.ts

# 4. Start dev server
npm run dev

# 5. Open browser to http://localhost:5173/wildtours
```

---

## Still Having Issues? 🆘

### Check These Files Exist:
```bash
ls -la src/services/firebaseWildToursService.ts
ls -la src/components/admin/WildToursAdmin.tsx
ls -la src/components/wildTours/TourPackageCard.tsx
ls -la scripts/seedWildToursData.ts
```

### Check Dependencies:
```bash
npm list firebase
npm list react
npm list @radix-ui/react-dialog
npm list @radix-ui/react-accordion
```

### View Logs:
```bash
# Terminal logs when running dev server
# Browser console logs (F12 → Console)
```

---

## Common Solutions Summary

| Problem | Quick Fix |
|---------|-----------|
| Permission denied | Update Firestore rules to allow writes |
| Module not found | Run `npm install` |
| No tours showing | Check Firebase console, run seed script |
| Loading forever | Check browser console for errors |
| Admin panel missing | Check admin routes configuration |
| Button not working | Install missing shadcn components |

---

## Contact Support 📧

If you're still stuck:

1. Check browser console (F12 → Console)
2. Check terminal output
3. Check Firebase Console → Firestore → Data
4. Check Firebase Console → Authentication → Users
5. Share error messages for specific help

---

**Last Updated:** January 2025
**Status:** Ready to Help! 💪
