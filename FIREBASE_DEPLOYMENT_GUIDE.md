# 🚀 Firebase Deployment Guide

## Overview

This guide covers the complete Firebase deployment workflow for Recharge Travels, including hosting, functions, and Firestore configuration.

## 📋 Prerequisites

1. **Firebase CLI**
   ```bash
   npm install -g firebase-tools
   ```

2. **Firebase Login**
   ```bash
   firebase login
   ```

3. **GitHub Repository Access** (for automated deployments)

## 🔧 Local Deployment

### Quick Deploy
```bash
# Deploy everything (hosting, functions, rules)
./scripts/deploy-firebase.sh all

# Deploy only hosting
./scripts/deploy-firebase.sh hosting

# Deploy specific target
./scripts/deploy-firebase.sh hosting:main
./scripts/deploy-firebase.sh hosting:admin
```

### Manual Commands
```bash
# Build the project
npm run build

# Build admin panel
cd admin && npm run build && cd ..

# Deploy to Firebase
firebase deploy --only hosting
firebase deploy --only hosting:main
firebase deploy --only hosting:admin
firebase deploy --only functions
firebase deploy --only firestore:rules
firebase deploy --only firestore:indexes
```

## 🤖 Automated Deployment (GitHub Actions)

### Setup GitHub Secrets

1. Go to your GitHub repository
2. Navigate to Settings → Secrets and variables → Actions
3. Add the following secrets:

| Secret Name | Description | How to Get |
|------------|-------------|------------|
| `FIREBASE_SERVICE_ACCOUNT` | Service account JSON | Firebase Console → Project Settings → Service Accounts → Generate New Private Key |
| `FIREBASE_TOKEN` | Firebase CI token | Run `firebase login:ci` |
| `VITE_FIREBASE_API_KEY` | Firebase API key | Firebase Console → Project Settings → General |
| `VITE_FIREBASE_AUTH_DOMAIN` | Auth domain | Firebase Console → Project Settings → General |
| `VITE_FIREBASE_PROJECT_ID` | Project ID | Firebase Console → Project Settings → General |
| `VITE_FIREBASE_STORAGE_BUCKET` | Storage bucket | Firebase Console → Project Settings → General |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | Sender ID | Firebase Console → Project Settings → General |
| `VITE_FIREBASE_APP_ID` | App ID | Firebase Console → Project Settings → General |
| `VITE_FIREBASE_MEASUREMENT_ID` | Analytics ID | Firebase Console → Project Settings → General |
| `VITE_GOOGLE_MAPS_API_KEY` | Google Maps API | Google Cloud Console |
| `VITE_PAYHERE_MERCHANT_ID` | PayHere merchant ID | PayHere Dashboard |
| `VITE_PAYHERE_MERCHANT_SECRET` | PayHere secret | PayHere Dashboard |
| `VITE_PAYMENT_ENV` | Payment environment | `sandbox` or `production` |

### Automatic Deployment Triggers

1. **Production Deploy** (on push to main)
   - Builds and deploys main app
   - Builds and deploys admin app
   - Deploys functions (if changed)
   - Updates Firestore rules and indexes

2. **Preview Deploy** (on pull request)
   - Creates preview channel
   - Posts preview URL as PR comment

3. **Manual Deploy** (workflow dispatch)
   ```yaml
   # Trigger from GitHub Actions tab
   # Options:
   - Deploy Functions: true/false
   - Deploy Rules: true/false
   ```

## 📁 Project Structure

```
├── dist/                    # Main app build output
├── admin/dist/             # Admin app build output
├── functions/lib/          # Functions build output
├── firebase.json           # Firebase configuration
├── firestore.rules         # Security rules
├── firestore.indexes.json  # Database indexes
└── .github/workflows/      # GitHub Actions
```

## 🌐 Deployment URLs

### Production
- Main Site: https://recharge-travels-73e76.web.app
- Admin Panel: https://recharge-travels-73e76-admin.web.app
- Alternative: https://recharge-travels-73e76.firebaseapp.com

### Preview Channels
- Format: `https://recharge-travels-73e76--pr-{number}-{hash}.web.app`

## 🔒 Security Considerations

1. **Environment Variables**
   - Never commit `.env` files
   - Use GitHub secrets for CI/CD
   - Rotate API keys regularly

2. **Service Account**
   - Store securely in GitHub secrets
   - Limit permissions to required services
   - Never commit to repository

3. **Firestore Rules**
   - Review before deployment
   - Test with emulator first
   - Monitor security warnings

## 🐛 Troubleshooting

### Build Failures
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
npm run build
```

### Deployment Errors
```bash
# Check Firebase login
firebase login --reauth

# Verify project
firebase projects:list
firebase use recharge-travels-73e76

# Test locally
firebase serve --only hosting
```

### GitHub Actions Issues
1. Check secret configuration
2. Verify service account permissions
3. Review workflow logs in Actions tab

## 📊 Monitoring

1. **Firebase Console**
   - Hosting: View deployment history
   - Functions: Monitor logs and errors
   - Firestore: Check usage and rules

2. **GitHub Actions**
   - View deployment status
   - Check build logs
   - Monitor PR previews

## 🔄 Rollback Procedure

### Hosting Rollback
```bash
# List releases
firebase hosting:releases:list

# Rollback to previous
firebase hosting:rollback
```

### Functions Rollback
```bash
# Via Firebase Console
# Functions → Version History → Rollback
```

## 📝 Best Practices

1. **Before Deployment**
   - Run tests locally
   - Build project successfully
   - Check environment variables
   - Review security rules

2. **Deployment Process**
   - Use feature branches
   - Create PR for review
   - Test preview deployment
   - Merge to main for production

3. **After Deployment**
   - Verify all features work
   - Check console for errors
   - Monitor performance
   - Update documentation

## 🚨 Emergency Contacts

- Firebase Support: https://firebase.google.com/support
- GitHub Status: https://www.githubstatus.com
- Team Lead: [Your Contact]

---

## Quick Reference

```bash
# Local development
npm run dev

# Build all
npm run build
cd admin && npm run build && cd ..

# Deploy all
./scripts/deploy-firebase.sh all

# Deploy hosting only
./scripts/deploy-firebase.sh hosting

# Deploy specific service
firebase deploy --only hosting:main
firebase deploy --only functions
firebase deploy --only firestore:rules
```

Remember: Always test locally before deploying to production!