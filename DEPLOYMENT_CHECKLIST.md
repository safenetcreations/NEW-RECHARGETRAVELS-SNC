# ✅ Firebase Deployment Checklist

## Pre-Deployment Checklist

### 🔍 Code Review
- [ ] All features tested locally
- [ ] No console errors in browser
- [ ] TypeScript compilation successful
- [ ] ESLint warnings resolved
- [ ] Environment variables configured

### 🧪 Testing
- [ ] Run `npm test` (if tests exist)
- [ ] Test critical user flows
- [ ] Verify API endpoints work
- [ ] Check responsive design
- [ ] Test on multiple browsers

### 📋 Configuration
- [ ] `.env` variables updated
- [ ] Firebase project selected: `firebase use recharge-travels-73e76`
- [ ] API keys valid and not expired
- [ ] Payment gateway in correct mode (sandbox/production)

## Deployment Steps

### 1️⃣ Prepare Build
```bash
# Update dependencies
npm install

# Build main app
npm run build

# Build admin app (if changed)
cd admin && npm run build && cd ..
```

### 2️⃣ Deploy to Firebase

#### Option A: Using Script (Recommended)
```bash
# Deploy everything
./scripts/deploy-firebase.sh all

# OR deploy only hosting
./scripts/deploy-firebase.sh hosting
```

#### Option B: Manual Deploy
```bash
# Deploy hosting only
firebase deploy --only hosting

# Deploy with functions and rules
firebase deploy
```

#### Option C: GitHub Actions
```bash
# Push to main branch
git add .
git commit -m "feat: deploy to production"
git push origin main
```

## Post-Deployment Verification

### 🌐 Site Verification
- [ ] Main site loads: https://recharge-travels-73e76.web.app
- [ ] Admin panel loads: https://recharge-travels-73e76-admin.web.app
- [ ] All pages accessible
- [ ] Images and assets load
- [ ] Forms submit correctly

### 🔒 Security Checks
- [ ] Authentication works
- [ ] Protected routes secured
- [ ] API endpoints authenticated
- [ ] Firestore rules enforced
- [ ] No sensitive data exposed

### 📊 Monitoring
- [ ] Check Firebase Console for errors
- [ ] Monitor Firestore usage
- [ ] Review Functions logs
- [ ] Check Analytics data
- [ ] Verify payment integration

## Common Issues & Solutions

### 🚫 Build Fails
```bash
# Clear cache
rm -rf node_modules dist
npm install
npm run build
```

### 🚫 Deploy Fails
```bash
# Re-authenticate
firebase login --reauth

# Check project
firebase projects:list
firebase use recharge-travels-73e76
```

### 🚫 404 Errors
```bash
# Check firebase.json rewrites
# Ensure SPA routing configured
```

## Emergency Rollback

```bash
# List recent releases
firebase hosting:releases:list

# Rollback to previous version
firebase hosting:rollback

# OR specify version
firebase hosting:clone SOURCE_VERSION_ID
```

## Final Steps

- [ ] Update version number in package.json
- [ ] Create git tag for release
- [ ] Document any configuration changes
- [ ] Notify team of deployment
- [ ] Monitor for 30 minutes post-deployment

---

## Quick Deploy Commands

```bash
# Full deployment
./scripts/deploy-firebase.sh all

# Hosting only
./scripts/deploy-firebase.sh hosting

# Functions only
firebase deploy --only functions

# Rules only
firebase deploy --only firestore:rules
```

## Support Contacts

- Firebase Issues: Check Firebase Console → Support
- Build Issues: Review build logs in terminal
- Runtime Issues: Check browser console and Firebase Functions logs

---

**Remember**: Always backup production data before major deployments!