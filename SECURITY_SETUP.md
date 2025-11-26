# 🔒 Firebase Security Setup - Production Ready

## ⚠️ WARNING: Current Rules Are INSECURE!

Your current rules allow **ANYONE** to read, modify, or delete your data:

```javascript
match /{document=**} {
  allow read, write: if true;  // ❌ DANGEROUS!
}
```

This is **ONLY for development testing**. Use these secure rules for production.

---

## 🎯 Two-Phase Setup Strategy

### Phase 1: Development (Current - For Testing Only)

**Use these TEMPORARY rules while you're setting up:**

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

✅ **Use this to:**
- Seed initial data
- Test the Wild Tours page
- Develop and debug

⚠️ **Replace within 24-48 hours!**

---

### Phase 2: Production (Secure Rules)

**Switch to these BEFORE going live:**

Use the rules in `firestore.rules.production` file.

---

## 🔐 Production Rules Explained

### 1. Wild Tours Collection
```javascript
match /wildTours/{tourId} {
  allow read: if resource.data.isActive == true || isAdmin();
  allow write: if isAdmin();
}
```

**Security:**
- ✅ Public can only read active tours
- ✅ Only admins can add/edit/delete tours
- ✅ Inactive tours hidden from public

### 2. Users Collection
```javascript
match /users/{userId} {
  allow read: if isOwner(userId) || isAdmin();
  allow update: if isOwner(userId) || isAdmin();
}
```

**Security:**
- ✅ Users can only see their own data
- ✅ Users can only edit their own data
- ✅ Admins can manage all users

### 3. Bookings Collection
```javascript
match /bookings/{bookingId} {
  allow read: if resource.data.userId == request.auth.uid || isAdmin();
  allow create: if isAuthenticated();
  allow update, delete: if isAdmin();
}
```

**Security:**
- ✅ Users can only see their own bookings
- ✅ Anyone authenticated can create bookings
- ✅ Only admins can modify/delete bookings

### 4. Public Content (Tours, Hotels, Activities)
```javascript
match /hotels/{hotelId} {
  allow read: if true;
  allow write: if isAdmin();
}
```

**Security:**
- ✅ Public can read (for browsing)
- ✅ Only admins can modify content

### 5. Reviews
```javascript
match /reviews/{reviewId} {
  allow read: if true;
  allow create: if isAuthenticated();
  allow update: if resource.data.userId == request.auth.uid;
  allow delete: if isAdmin();
}
```

**Security:**
- ✅ Anyone can read reviews
- ✅ Must be logged in to create reviews
- ✅ Can only edit your own reviews
- ✅ Only admins can delete reviews

---

## 📋 Step-by-Step Security Setup

### Step 1: Set Up Admin Users First

Before switching to secure rules, create admin users:

1. **Go to Firebase Console → Authentication**
2. **Add admin users** with email/password
3. **Go to Firestore Database**
4. **Create/Update user document:**
   ```javascript
   users/{userId}
   {
     email: "admin@rechargetravels.com",
     role: "admin",  // ← IMPORTANT!
     name: "Admin User",
     createdAt: timestamp
   }
   ```

### Step 2: Test with Development Rules

1. Use the open rules to seed data
2. Run: `npx tsx scripts/seedWildToursData.ts`
3. Test all features work

### Step 3: Switch to Production Rules

1. **Copy production rules:**
   ```bash
   cat firestore.rules.production
   ```

2. **Go to Firebase Console → Firestore → Rules**

3. **Replace ALL rules with production rules**

4. **Click "Publish"**

### Step 4: Test Security

Test that security works:

```javascript
// In browser console (when NOT logged in):

// ✅ Should work - reading tours
db.collection('wildTours').get()

// ❌ Should fail - writing tours
db.collection('wildTours').add({title: "Test"})

// ❌ Should fail - reading other users
db.collection('users').doc('someUserId').get()
```

---

## 🚨 Security Checklist

Before going to production, verify:

- [ ] Admin users created in Authentication
- [ ] Admin users have `role: "admin"` in Firestore
- [ ] Production rules published
- [ ] Tested: Public can read tours
- [ ] Tested: Public CANNOT write tours
- [ ] Tested: Users can only see own bookings
- [ ] Tested: Only admins can access admin panel
- [ ] Development rules are REPLACED (not just added to)

---

## 🎯 Quick Rules Comparison

| Feature | Development Rules | Production Rules |
|---------|------------------|------------------|
| Read tours | ✅ Anyone | ✅ Anyone (active only) |
| Write tours | ✅ Anyone | ❌ Admin only |
| Read users | ✅ Anyone | ❌ Own data or admin |
| Write users | ✅ Anyone | ❌ Own data or admin |
| Create bookings | ✅ Anyone | ❌ Authenticated only |
| Read bookings | ✅ Anyone | ❌ Own bookings or admin |

---

## 🔄 Switching Rules (Command Line)

### Deploy Development Rules
```bash
# For initial setup/testing
firebase deploy --only firestore:rules --force
```

### Deploy Production Rules
```bash
# Copy production rules to main file
cp firestore.rules.production firestore.rules

# Deploy
firebase deploy --only firestore:rules
```

---

## 🛡️ Additional Security Measures

### 1. Enable App Check (Recommended)
Prevents abuse from bots and unauthorized apps:

1. Firebase Console → App Check
2. Enable for your web app
3. Choose reCAPTCHA v3 or reCAPTCHA Enterprise

### 2. Set Up Rate Limiting
```javascript
// Add to your rules
match /bookings/{bookingId} {
  allow create: if isAuthenticated() &&
                   request.time > resource.data.lastBooking + duration.value(1, 'm');
}
```

### 3. Validate Data Structure
```javascript
match /wildTours/{tourId} {
  allow create: if isAdmin() &&
                   request.resource.data.keys().hasAll(['title', 'price', 'category']) &&
                   request.resource.data.price > 0;
}
```

### 4. Set Up Backup Rules
```javascript
// Allow read-only access if something breaks
match /{document=**} {
  allow read: if true;
  allow write: if false;  // Prevents damage
}
```

---

## 🆘 Emergency: Lock Down Everything

If you suspect a security breach:

```javascript
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if false;  // 🔒 LOCKDOWN
    }
  }
}
```

This blocks ALL access until you investigate.

---

## 📊 Monitoring Security

### Check Firebase Console:
1. **Firestore → Usage**
   - Monitor reads/writes
   - Look for unusual spikes

2. **Authentication → Users**
   - Review new user signups
   - Check for suspicious accounts

3. **Rules Playground**
   - Test rules before publishing
   - Simulate different user scenarios

---

## 🎓 Best Practices

1. **Never use open rules in production**
2. **Always require authentication for writes**
3. **Use helper functions for role checking**
4. **Test rules thoroughly before deploying**
5. **Monitor usage regularly**
6. **Keep admin credentials secure**
7. **Use environment variables for sensitive data**
8. **Enable multi-factor authentication for admins**

---

## 📝 When to Switch Rules

| Stage | Rules to Use | Why |
|-------|-------------|-----|
| Initial setup | Development (open) | Easy testing |
| Development | Development | Fast iteration |
| Staging | Production | Test security |
| Production | Production | Protect data |

**Timeline:** Switch to production rules within 24-48 hours of initial setup.

---

## ✅ Production Deployment Checklist

- [ ] Admin users created with proper roles
- [ ] Production rules tested in staging
- [ ] All features work with production rules
- [ ] Security tested (unauthorized access blocked)
- [ ] Backup plan ready
- [ ] Monitoring enabled
- [ ] Development rules removed
- [ ] Documentation updated

---

## 🚀 Ready to Deploy Secure Rules?

1. **Backup current data** (Export from Firestore)
2. **Create admin users** with proper roles
3. **Test production rules** in Firebase Rules Playground
4. **Deploy production rules**
5. **Test all features** still work
6. **Monitor for issues** in first 24 hours

---

**File to use:** `firestore.rules.production`

**Deploy command:**
```bash
cp firestore.rules.production firestore.rules
firebase deploy --only firestore:rules
```

---

**Your data will be secure! 🔒**
