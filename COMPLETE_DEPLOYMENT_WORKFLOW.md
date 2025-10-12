# Complete Deployment Workflow - Recharge Travels

This document outlines the complete deployment process for both the main website and admin panel.

## 🚀 Quick Deploy (All Sites)

To deploy everything with one command:

```bash
npm run deploy:all
```

This will:
1. Build the main website
2. Build the admin panel
3. Deploy both to Firebase hosting
4. Update Firestore security rules
5. Deploy cloud functions (if any)

## 📦 Project Structure

```
rechargetravels-sri-lankashalli-create-in-github/
├── src/                    # Main website source
├── admin/                  # Admin panel (separate app)
│   ├── src/               # Admin source files
│   ├── dist/              # Admin build output
│   └── package.json       # Admin dependencies
├── dist/                   # Main website build output
├── firebase.json           # Multi-site hosting config
├── .firebaserc            # Firebase project config
└── package.json           # Main dependencies & scripts
```

## 🔧 Available Commands

### Development
```bash
# Run main website locally (port 5173)
npm run dev

# Run admin panel locally (port 5174)
npm run dev:admin

# Run both simultaneously
npm run dev:all
```

### Building
```bash
# Build main website only
npm run build

# Build admin panel only
npm run build:admin

# Build both
npm run build:all
```

### Deployment
```bash
# Deploy everything (recommended)
npm run deploy:all

# Deploy main website only
npm run deploy:main

# Deploy admin panel only
npm run deploy:admin

# Deploy with Firebase CLI directly
firebase deploy
```

## 📝 Step-by-Step Deployment

### 1. Install Dependencies
```bash
# Install all dependencies for both apps
npm run install:all
```

### 2. Build Both Applications
```bash
# This builds both the main site and admin panel
npm run build:all
```

### 3. Deploy to Firebase
```bash
# Deploy everything
npm run deploy:all
```

## 🌐 Live URLs

After deployment, your sites will be available at:

- **Main Website**: https://recharge-travels-73e76.web.app
- **Admin Panel**: https://recharge-travels-admin.web.app

## 🔄 GitHub Actions (Automatic Deployment)

The project is configured to automatically deploy when you push to the main branch:

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Update content"
   git push origin main
   ```

2. **Automatic Deployment**
   - GitHub Actions will trigger
   - Both sites will be built
   - Deployed to Firebase automatically

## 📋 Deployment Checklist

Before deploying, ensure:

- [ ] All changes are saved
- [ ] Code is tested locally
- [ ] Environment variables are set in GitHub secrets
- [ ] Firebase project is properly configured
- [ ] Build completes without errors

## 🛠️ Manual Deployment Scripts

### Deploy Main Website Only
```bash
#!/bin/bash
echo "Building main website..."
npm run build

echo "Deploying to Firebase..."
firebase deploy --only hosting:main

echo "Main website deployed!"
```

### Deploy Admin Panel Only
```bash
#!/bin/bash
echo "Building admin panel..."
cd admin && npm run build && cd ..

echo "Deploying admin to Firebase..."
firebase deploy --only hosting:admin

echo "Admin panel deployed!"
```

### Deploy Everything
```bash
#!/bin/bash
echo "Building all applications..."
npm run build:all

echo "Deploying to Firebase..."
firebase deploy

echo "All sites deployed successfully!"
```

## 🔐 Environment Variables

Required environment variables (set in GitHub Secrets):

```
VITE_FIREBASE_API_KEY
VITE_FIREBASE_AUTH_DOMAIN
VITE_FIREBASE_PROJECT_ID
VITE_FIREBASE_STORAGE_BUCKET
VITE_FIREBASE_MESSAGING_SENDER_ID
VITE_FIREBASE_APP_ID
VITE_FIREBASE_MEASUREMENT_ID
VITE_GOOGLE_MAPS_API_KEY
FIREBASE_SERVICE_ACCOUNT (for GitHub Actions)
```

## 🚨 Troubleshooting

### Build Errors
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
rm -rf admin/node_modules admin/package-lock.json
npm run install:all
```

### Deployment Errors
```bash
# Check Firebase login
firebase login

# List projects
firebase projects:list

# Use correct project
firebase use recharge-travels-73e76
```

### Permission Errors
```bash
# Re-authenticate
firebase login:reauth

# Check hosting targets
firebase target:apply hosting main recharge-travels-73e76
firebase target:apply hosting admin recharge-travels-admin
```

## 📊 Monitoring Deployments

1. **GitHub Actions**: https://github.com/nanthan77/rechargetravels-sri-lankashalli-create-in-github/actions
2. **Firebase Console**: https://console.firebase.google.com/project/recharge-travels-73e76/hosting
3. **Live Sites**:
   - Main: https://recharge-travels-73e76.web.app
   - Admin: https://recharge-travels-admin.web.app

## 🎯 Best Practices

1. **Always test locally** before deploying
2. **Use feature branches** for major changes
3. **Deploy to staging** first (if available)
4. **Monitor deployment status** in GitHub Actions
5. **Check live sites** after deployment
6. **Keep backups** of important data

## 📱 Mobile App Deployment (Future)

When ready for mobile apps:

```bash
# Build for Android
cd mobile && flutter build apk

# Build for iOS
cd mobile && flutter build ios

# Deploy to stores
# Use respective store deployment tools
```

## 🆘 Support

If you encounter issues:

1. Check the [GitHub Actions logs](https://github.com/nanthan77/rechargetravels-sri-lankashalli-create-in-github/actions)
2. Review [Firebase Console](https://console.firebase.google.com/project/recharge-travels-73e76/hosting) for errors
3. Check browser console for runtime errors
4. Verify all environment variables are set correctly

---

**Last Updated**: January 2025
**Maintained by**: Recharge Travels Development Team