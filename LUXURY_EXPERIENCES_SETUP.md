# Sri Lankan Luxury Experiences - Setup Guide

## Overview
The homepage now features **authentic Sri Lankan luxury experiences** with proper integration to the `/experiences` page and Firebase backend.

## What's Been Updated

### 1. Homepage Luxury Section
**File:** `src/components/homepage/EnhancedLuxuryExperiences.tsx`

**Sri Lankan Experiences Featured:**
1. **Hot Air Balloon Sigiriya** - Soar above ancient wonders
2. **Ceylon Tea Trails** - Heritage bungalow experience
3. **Private Island Getaways** - Secluded paradise
4. **Luxury Wildlife Safaris** - Leopard & elephant encounters
5. **Sri Lankan Culinary Journey** - Spice garden to table
6. **Blue Whale & Dolphin Watching** - Mirissa marine magic

**Features:**
- Beautiful framer-motion animations
- Gradient backgrounds and floating effects
- Two CTA buttons:
  - "View All Experiences" → `/experiences`
  - "Create Custom Experience" → `/custom-experience`
- Sri Lanka-specific content and imagery

### 2. Data Structure
**File:** `src/data/sriLankanLuxuryExperiences.ts`

Clean, reusable data structure for the 6 featured experiences with:
- Proper links to existing experience pages
- Sri Lankan-specific descriptions
- Authentic activity features
- Correct durations and group sizes

### 3. Seed Script for Firebase
**File:** `scripts/seedSriLankanExperiences.ts`

Comprehensive seed script with 6 detailed luxury experiences including:
- Full descriptions and itineraries
- Pricing information ($125 - $2500 per person/night)
- Included/excluded items
- Highlights and best times to visit
- Physical requirements
- Cancellation policies
- Gallery images
- Location coordinates

## How to Seed Firebase

### Step 1: Compile the TypeScript File
```bash
npx tsx scripts/seedSriLankanExperiences.ts
```

### Step 2: Verify in Firebase Console
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select project: `new-recharge-travels-snc`
3. Navigate to Firestore Database
4. Check the `luxuryExperiences` collection
5. You should see 6 new documents

## Current Page Connections

### Homepage → Experiences
- **Homepage Section:** EnhancedLuxuryExperiences component
- **Link:** "View All Experiences" button → `/experiences`
- **Individual Cards:** Each experience links to its detail page

### Experiences Included
| Experience | Route | Status |
|------------|-------|--------|
| Hot Air Balloon Sigiriya | `/experiences/hot-air-balloon-sigiriya` | ✅ Exists |
| Ceylon Tea Trails | `/experiences/tea-trails` | ✅ Exists |
| Private Island Getaways | `/experiences/island-getaways` | ✅ Exists |
| Luxury Wildlife Safaris | `/tours/wildtours` | ✅ Exists |
| Cooking Class | `/experiences/cooking-class-sri-lanka` | ✅ Exists |
| Whale Watching | `/experiences/whale-watching` | ✅ Exists |

## Admin Panel

The admin panel for managing luxury experiences already exists at:
- **Frontend:** `admin/src/components/experiences/ExperienceManagement.tsx`
- **Form:** `admin/src/components/experiences/ExperienceForm.tsx`

### Admin Features
- Create/Edit/Delete experiences
- Upload images to Firebase Storage
- Set pricing and availability
- Manage categories and featured status
- Handle custom experience requests

## Testing Checklist

### Homepage
- [ ] Visit `http://localhost:8085/`
- [ ] Scroll to "Luxury Experiences" section
- [ ] Verify 6 Sri Lankan experiences display
- [ ] Check animations work (floating badge, stagger cards)
- [ ] Click "View All Experiences" button
- [ ] Should navigate to `/experiences`

### Individual Experience Links
- [ ] Click each experience card
- [ ] Should navigate to respective detail page
- [ ] Verify content loads correctly

### Experiences Page
- [ ] Visit `http://localhost:8085/experiences`
- [ ] Should see all published experiences from Firebase
- [ ] Filter by category works
- [ ] Search functionality works

## Firestore Security Rules

### Development Rules (Current)
```javascript
match /luxuryExperiences/{docId} {
  allow read: if true;
  allow write: if true;
}
```

### Production Rules (Recommended)
```javascript
match /luxuryExperiences/{docId} {
  allow read: if resource.data.status == 'published';
  allow create, update, delete: if isAdmin();
}

function isAdmin() {
  return request.auth != null &&
         get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
}
```

## Pricing Summary

| Experience | Duration | Price | Group Size |
|------------|----------|-------|------------|
| Hot Air Balloon | 3-4 hours | $375 pp | Up to 8 |
| Tea Trails | 2-3 days | $450 pp/night | 2-8 guests |
| Private Island | 2-7 days | $2500/night | Up to 12 |
| Wildlife Safari | 2-3 days | $550 pp/night | Up to 6 |
| Culinary Class | 6 hours | $185 pp | Up to 10 |
| Whale Watching | 4-5 hours | $125 pp | Max 20 |

## Next Steps

1. **Seed Firebase** (if not done):
   ```bash
   npx tsx scripts/seedSriLankanExperiences.ts
   ```

2. **Update Security Rules** (for production):
   - Copy rules from `firestore.rules.production`
   - Update in Firebase Console

3. **Test All Links**:
   - Homepage → Experiences page
   - Each individual experience page
   - Admin panel functionality

4. **Deploy**:
   ```bash
   ./DEPLOY_NOW.sh
   ```

## Files Modified/Created

### Modified
- `src/components/homepage/EnhancedLuxuryExperiences.tsx` - Updated with Sri Lankan content
- `src/pages/Index.tsx` - Using EnhancedLuxuryExperiences

### Created
- `src/data/sriLankanLuxuryExperiences.ts` - Data structure
- `scripts/seedSriLankanExperiences.ts` - Firebase seed script
- `LUXURY_EXPERIENCES_SETUP.md` - This documentation

## Support

For issues or questions:
1. Check Firebase Console for data
2. Verify all routes in `src/App.tsx`
3. Check console for any errors
4. Ensure dev server is running on `http://localhost:8085/`

---

**Status:** ✅ Ready to seed and test
**Server:** http://localhost:8085/
**Admin:** Already exists with full CRUD functionality
