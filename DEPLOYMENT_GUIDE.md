# 🚀 Deployment Guide - Group Transport CMS

## Current Status

The build process is currently running with `npm run build:all`. This will:
1. ✅ Build the main application (frontend)
2. ✅ Build the admin panel
3. ✅ Compile all TypeScript files
4. ✅ Bundle and optimize all assets

## Deployment Steps

### Step 1: Wait for Build to Complete
The build is currently in progress. Once complete, you should see:
```
✓ built in XXXs
dist/index.html                   X.XX kB
dist/assets/index-XXXXX.js        XXX kB
```

### Step 2: Deploy to Firebase
Once the build completes successfully, run:

```bash
firebase deploy --only hosting,firestore:rules,firestore:indexes
```

This will deploy:
- ✅ Main website (hosting:main)
- ✅ Admin panel (hosting:admin)
- ✅ Firestore security rules
- ✅ Firestore indexes

**OR** use the npm script:
```bash
npm run deploy:complete
```

### Step 3: Verify Deployment

After deployment completes, you'll see URLs like:
```
✔  Deploy complete!

Project Console: https://console.firebase.google.com/project/your-project/overview
Hosting URL (main): https://your-project.web.app
Hosting URL (admin): https://admin-your-project.web.app
```

## Required Firestore Rules

Before or after deploying, make sure your `firestore.rules` file includes the new Group Transport collections:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Allow public read access
    function isPublic() {
      return true;
    }
    
    // Allow admin write access
    function isAdmin() {
      return request.auth != null && request.auth.token.admin == true;
    }
    
    // Group Transport Collections
    match /groupTransportHero/{document=**} {
      allow read: if isPublic();
      allow write: if isAdmin();
    }
    
    match /groupTransportVehicles/{document=**} {
      allow read: if isPublic();
      allow write: if isAdmin();
    }
    
    match /groupTransportFeatures/{document=**} {
      allow read: if isPublic();
      allow write: if isAdmin();
    }
    
    match /groupTransportBenefits/{document=**} {
      allow read: if isPublic();
      allow write: if isAdmin();
    }
    
    match /page-content/group-transport-settings {
      allow read: if isPublic();
      allow write: if isAdmin();
    }
    
    // Add your other existing rules here...
  }
}
```

## Deployment Checklist

### Pre-Deployment
- [x] Build main app ✓ (in progress)
- [x] Build admin panel ✓ (in progress)
- [ ] Update Firestore rules (add Group Transport collections)
- [ ] Test locally before deploying

### During Deployment
- [ ] Run deployment command
- [ ] Wait for completion (usually 2-5 minutes)
- [ ] Note the hosting URLs

### Post-Deployment
- [ ] Visit main site and verify Group Transport page
- [ ] Login to admin panel
- [ ] Navigate to Transport tab in CMS
- [ ] Add test content
- [ ] Verify content appears on live site
- [ ] Test all CRUD operations (Create, Read, Update, Delete)

## Manual Deployment Steps

If automated deployment has issues, you can deploy manually:

### 1. Build Both Apps
```bash
# Build main app
npm run build

# Build admin panel
npm run build:admin
```

### 2. Deploy Main Site
```bash
firebase deploy --only hosting:main
```

### 3. Deploy Admin Panel
```bash
firebase deploy --only hosting:admin
```

### 4. Deploy Firestore Rules
```bash
firebase deploy --only firestore:rules
```

### 5. Deploy Firestore Indexes
```bash
firebase deploy --only firestore:indexes
```

## Quick Commands Reference

```bash
# Full deployment (recommended)
npm run deploy:complete

# Deploy only main site
npm run deploy:main

# Deploy only admin panel
npm run deploy:admin

# Deploy only Firestore rules
npm run deploy:rules

# Deploy everything
npm run deploy:all

# Build without deploying
npm run build:all
```

## Troubleshooting

### Build Errors

**TypeScript Errors:**
```bash
# Fix TypeScript errors first
npm run typecheck
```

**Linting Errors:**
```bash
# Fix linting issues
npm run lint:fix
```

### Deployment Errors

**"No Firebase project selected":**
```bash
# Select/initialize Firebase project
firebase use --add
```

**"Permission denied":**
```bash
# Re-authenticate with Firebase
firebase login
```

**"Build folder not found":**
```bash
# Ensure build completed successfully
npm run build:all
ls -la dist
ls -la admin/dist
```

### Firestore Rules Errors

If you get permission errors after deployment:

1. Check Firebase Console → Firestore → Rules
2. Ensure new collections are included
3. Redeploy rules:
```bash
npm run deploy:rules
```

## Testing After Deployment

### Main Site
1. Visit: `https://your-project.web.app/transport/group-transport`
2. Verify page loads correctly
3. Check hero carousel rotates
4. Verify vehicles display
5. Test booking form

### Admin Panel
1. Visit: `https://admin-your-project.web.app`
2. Login with admin credentials
3. Navigate to: Content Management → Transport
4. Test creating a hero slide
5. Test creating a vehicle
6. Verify changes appear on main site

## Post-Deployment Tasks

1. **Add Initial Content**
   - Use admin panel to add real content
   - Or run seed script (if available)

2. **Verify SEO**
   - Check page meta tags
   - Verify sitemap includes new page
   - Submit to Google Search Console

3. **Monitor Performance**
   - Check Firebase Console for usage
   - Monitor Firestore read/write operations
   - Check Hosting bandwidth

4. **Test on Multiple Devices**
   - Desktop browsers
   - Mobile phones
   - Tablets

## Emergency Rollback

If deployment has critical issues:

```bash
# View deployment history
firebase hosting:clone

# Rollback to previous version
# (Use Firebase Console for GUI rollback)
```

## Support

If you encounter issues:

1. Check build logs for errors
2. Verify Firebase project settings
3. Test locally first: `npm run dev:all`
4. Check browser console for errors
5. Review Firestore rules in Firebase Console

---

## Current Build Status

🔄 **Building both applications...**

The build process typically takes 2-5 minutes depending on:
- Project size
- Number of dependencies
- Build optimizations
- System resources

Once the build completes, you'll see success messages and can proceed with deployment!

---

**Next Steps After Build:**
1. Wait for build completion
2. Run `firebase deploy --only hosting,firestore:rules,firestore:indexes`
3. Verify deployment URLs
4. Test the live site
5. Add content via admin panel

🎉 **You're almost there!**
