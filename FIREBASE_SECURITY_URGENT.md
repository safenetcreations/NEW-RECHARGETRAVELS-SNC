# 🚨 URGENT: Firebase Security Alert

## ⚠️ CRITICAL ACTION REQUIRED

Your Firebase credentials were exposed publicly. Follow these steps **IMMEDIATELY**:

---

## 🔴 Step 1: Secure Your Firebase Project (DO THIS NOW)

### A. Restrict API Key Access
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project: `recharge-travels-73e76`
3. Navigate to: **APIs & Services** → **Credentials**
4. Find your API key: `AIzaSyCxFnQfMo3rOWhgm1_yiRIh0Oez246U2N0`
5. Click **Edit** and add **Application restrictions**:
   - Select "HTTP referrers (websites)"
   - Add your domains:
     ```
     https://rechargetravels.com/*
     https://www.rechargetravels.com/*
     http://localhost:5173/*
     ```

### B. Set Up Firebase Security Rules

**Firestore Rules** - Go to Firebase Console → Firestore Database → Rules:
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Require authentication for all reads/writes
    match /{document=**} {
      allow read: if request.auth != null;
      allow write: if request.auth != null &&
                      request.auth.token.email.matches('.*@rechargetravels.com');
    }

    // Public read-only for certain collections
    match /tours/{tourId} {
      allow read: if true;
      allow write: if request.auth != null &&
                      request.auth.token.email.matches('.*@rechargetravels.com');
    }

    match /destinations/{destId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

**Storage Rules** - Go to Firebase Console → Storage → Rules:
```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      // Public read, authenticated write
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

### C. Enable Firebase App Check
1. Go to Firebase Console → App Check
2. Enable reCAPTCHA v3
3. Register your web app
4. Add this to your code (already in your project):
```typescript
import { initializeAppCheck, ReCaptchaV3Provider } from "firebase/app-check";

const appCheck = initializeAppCheck(app, {
  provider: new ReCaptchaV3Provider('your-recaptcha-site-key'),
  isTokenAutoRefreshEnabled: true
});
```

---

## 🟡 Step 2: Rotate Credentials (RECOMMENDED)

Since your credentials are public, consider creating a new Firebase project:

1. Create new Firebase project
2. Copy all data from old project
3. Update environment variables
4. Deploy with new credentials
5. Delete old project after migration

**OR** use Firebase App Check + security rules to limit damage.

---

## 🟢 Step 3: Set Up Environment Variables Properly

### Create `.env` file (NEVER commit this):
```bash
# Firebase Configuration
VITE_FIREBASE_API_KEY=AIzaSyCxFnQfMo3rOWhgm1_yiRIh0Oez246U2N0
VITE_FIREBASE_AUTH_DOMAIN=recharge-travels-73e76.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=recharge-travels-73e76
VITE_FIREBASE_STORAGE_BUCKET=recharge-travels-73e76.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=515581447537
VITE_FIREBASE_APP_ID=1:515581447537:web:b4f65bf9c2544c65d6fad0
VITE_FIREBASE_MEASUREMENT_ID=G-W2MJBDFDG3

# Database URL (optional)
VITE_FIREBASE_DATABASE_URL=https://recharge-travels-73e76-default-rtdb.firebaseio.com
```

### Update `firebase.ts` to remove fallback values:
```typescript
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};
```

---

## 📋 Step 4: Verify .gitignore

Your `.gitignore` already includes `.env` files (✅ Good!):
```
.env
.env.local
.env.production
.env.development
```

**Make sure `.env` is NEVER committed to git!**

---

## 🔒 Step 5: Set Up CI/CD Secrets

### GitHub Actions
1. Go to your GitHub repo
2. Settings → Secrets and variables → Actions
3. Add secrets:
   - `VITE_FIREBASE_API_KEY`
   - `VITE_FIREBASE_AUTH_DOMAIN`
   - etc.

### Firebase Hosting Environment Variables
```bash
firebase functions:config:set \
  firebase.api_key="YOUR_KEY" \
  firebase.auth_domain="YOUR_DOMAIN"
```

---

## 🛡️ Additional Security Measures

### 1. Enable Firebase Authentication Security
- Go to Firebase Console → Authentication → Settings
- Enable **Email enumeration protection**
- Set up **Password policies**
- Enable **Multi-factor authentication**

### 2. Monitor Firebase Usage
- Set up **Budget alerts** in Google Cloud Console
- Monitor **Firestore usage** daily
- Check **Authentication logs** for suspicious activity

### 3. Implement Rate Limiting
```typescript
// In your functions
import { RateLimiter } from 'limiter';
const limiter = new RateLimiter({ tokensPerInterval: 100, interval: "hour" });
```

### 4. Add IP Restrictions (if possible)
- Limit API access to known IP ranges
- Use Cloud Armor for DDoS protection

---

## ✅ Checklist

- [ ] Restrict Firebase API key to specific domains
- [ ] Update Firestore security rules
- [ ] Update Storage security rules
- [ ] Enable Firebase App Check
- [ ] Create `.env` file with credentials
- [ ] Remove hardcoded fallback values from `firebase.ts`
- [ ] Verify `.env` is in `.gitignore`
- [ ] Set up CI/CD secrets
- [ ] Enable authentication security features
- [ ] Set up monitoring and alerts
- [ ] Consider rotating credentials

---

## 🆘 If You Notice Suspicious Activity

1. **Immediately disable** the exposed API key
2. **Check Firebase Console** for:
   - Unusual Firestore reads/writes
   - Unexpected Storage uploads
   - New authentication sign-ups
3. **Review audit logs** in Google Cloud Console
4. **Contact Firebase Support** if needed

---

## 📚 Resources

- [Firebase Security Rules](https://firebase.google.com/docs/rules)
- [Firebase App Check](https://firebase.google.com/docs/app-check)
- [Google Cloud API Security](https://cloud.google.com/docs/security/api-best-practices)
- [Firebase Best Practices](https://firebase.google.com/docs/guides)

---

**Last Updated:** $(date)
**Priority:** 🚨 CRITICAL
