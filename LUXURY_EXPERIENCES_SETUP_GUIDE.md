# Luxury Experiences Setup Guide

## Current Status

The `/experiences` page at https://recharge-travels-73e76.web.app/experiences shows "No experiences found matching your criteria" because:

1. ✅ **Route configured correctly** - Maps to `LuxuryExperiences.tsx`
2. ✅ **Service layer working** - `luxuryExperienceService` is properly configured
3. ✅ **Admin panel exists** - `LuxuryExperiencesManager.tsx` is available
4. ❌ **No data in Firebase** - `luxuryExperiences` collection is empty

## Issues Discovered

### Data Type Mismatch

There are **TWO different LuxuryExperience type definitions**:

1. **Admin CMS Type** (`/admin/src/types/cms.ts`):
   - Simpler structure: title, description, image, link, order
   - Used by admin panel's `LuxuryExperiencesManager`
   - Saves to `luxuryExperiences` collection

2. **Main App Type** (`/src/types/luxury-experience.ts`):
   - Complex structure: full details like itinerary, pricing, locations, gallery
   - Used by `/experiences` page
   - Reads from same `luxuryExperiences` collection

**This mismatch means the admin panel creates simple records, but the main site expects detailed records.**

## Solutions

### Option 1: Use Admin Panel (Recommended for Long-term)

**Steps:**

1. Access the admin panel at: `https://recharge-travels-73e76.web.app/admin` (or local admin)

2. Navigate to **Luxury Experiences Manager**

3. Click "Add New Experience"

4. Fill in the form (you'll need to update the form to match the complex type)

**Note:** The `LuxuryExperienceForm.tsx` needs to be updated to support all fields from the main app type.

### Option 2: Manual Firebase Console (Quick Fix)

1. Go to https://console.firebase.google.com/project/recharge-travels-73e76/firestore

2. Navigate to `luxuryExperiences` collection

3. Click "Add document"

4. Use the sample data from `/scripts/seed-luxury-experiences.ts`

5. Add each experience manually

### Option 3: Seed Script with Admin Auth (Technical)

**Current Issue:**
```
Permission Denied: Missing or insufficient permissions
```

**Firestore Rules** (line 227-230 of `firestore.rules`):
```javascript
match /luxuryExperiences/{experienceId} {
  allow read: if true; // Public can read
  allow write: if isAdmin(); // Only  admin can write
}
```

**Solution:** The seed script needs to authenticate as an admin user. This requires:

1. Creating a Service Account
2. Using Admin SDK credentials
3. Running the script server-side

#### Implementing Admin Auth for Seed Script:

```typescript
// scripts/seed-luxury-experiences-admin.ts
import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore, Timestamp } from 'firebase-admin/firestore';
import * as serviceAccount from './service-account-key.json';

// Initialize Firebase Admin
const app = initializeApp({
  credential: cert(serviceAccount as any)
});

const db = getFirestore(app);

// ... rest of the seed script
```

**To get service account credentials:**
1. Go to Firebase Console > Project Settings > Service Accounts
2. Click "Generate new private key"
3. Save as `scripts/service-account-key.json`
4. **IMPORTANT:** Add to `.gitignore`

### Option 4: Temporary Rule Change (Not Recommended for Production)

Temporarily modify `firestore.rules`:

```javascript
match /luxuryExperiences/{experienceId} {
  allow read: if true;
  allow write: if true; // TEMPORARY - allows anyone to write
}
```

Then:
1. Deploy rules: `firebase deploy --only firestore:rules`
2. Run seed script: `npx tsx scripts/seed-luxury-experiences.ts`
3. **IMMEDIATELY** revert rules and redeploy

**⚠️ WARNING:** This exposes your database. Only use for testing, and revert immediately.

## Recommended Action Plan

### Immediate (Quick Fix):
1. Use **Option 2** (Manual Firebase Console) to add 2-3 sample experiences
2. Test that the `/experiences` page displays them correctly

### Short-term (Fix Admin Panel):
1. Update `LuxuryExperienceForm.tsx` to include all fields from the main type
2. Unify the two type definitions or create appropriate transformers
3. Use admin panel to manage experiences going forward

### Long-term (Best Practice):
1. Implement **Option 3** with proper admin authentication
2. Create a complete seed/migration script for all CMS content
3. Set up proper data validation and transformation layers

## Sample Data Structure

Here's one complete experience example that matches the main app type:

```json
{
  "title": "Private Yala Safari Experience",
  "subtitle": "Exclusive Wildlife Encounters in Sri Lanka's Premier National Park",
  "category": "luxury-safari",
  "slug": "private-yala-safari-experience",
  "heroImage": "https://images.unsplash.com/photo-1516426122078-c23e76319801",
  "gallery": [
    {
      "url": "https://images.unsplash.com/photo-1516426122078-c23e76319801",
      "alt": "Leopard in Yala",
      "caption": "Spot the elusive leopard",
      "order": 1
    }
  ],
  "shortDescription": "Experience the thrill of a private safari...",
  "fullDescription": "Embark on an unforgettable journey...",
  "highlights": [
    "Highest leopard density in the world",
    "Private luxury 4x4 safari vehicle",
    "Expert naturalist guide"
  ],
  "duration": "6-8 hours",
  "groupSize": "Up to 6 people",
  "price": {
    "amount": 450,
    "currency": "USD",
    "per": "vehicle"
  },
  "status": "published",
  "featured": true,
  "popular": true,
  "new": false
}
```

## Next Steps

Choose your approach and I can help you implement it:

1. **Quick fix:** I'll guide you through manually adding experiences via Firebase Console
2. **Admin panel fix:** I'll update the form and types to match
3. **Seed script with admin:** I'll set up proper authentication for the seed script
4. **Temporary rules:** I can guide you through the temporary rule change (use with caution)

Which approach would you like to take?

---

## Files Modified/Created

- ✅ `/scripts/seed-luxury-experiences.ts` - Seed script with 6 sample experiences
- 📋 This guide - Complete documentation of the issue and solutions

## Related Files to Check

- `/src/pages/LuxuryExperiences.tsx` - Main experiences listing page
- `/src/services/luxuryExperienceService.ts` - Data service layer
- `/admin/src/components/admin/panel/LuxuryExperiencesManager.tsx` - Admin panel manager
- `/admin/src/components/admin/panel/LuxuryExperienceForm.tsx` - Admin form (needs updating)
- `/src/types/luxury-experience.ts` - Main app type definition
- `/admin/src/types/cms.ts` - Admin CMS type definition (lines 451-470)
- `/firestore.rules` - Security rules (lines 227-230 for luxuryExperiences)
