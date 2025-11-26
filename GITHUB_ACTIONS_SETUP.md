# GitHub Actions Setup for Automatic Firebase Deployment

This document explains how to set up automatic deployment from GitHub to Firebase Hosting for both the main website and admin panel.

## Prerequisites

1. **Firebase CLI installed locally**
   ```bash
   npm install -g firebase-tools
   ```

2. **Firebase project initialized**
   - Already completed in this project

3. **GitHub repository**
   - Repository must be pushed to GitHub

## Setup Steps

### 1. Generate Firebase Service Account Key

1. Go to [Firebase Console](https://console.firebase.google.com/project/recharge-travels-73e76/settings/serviceaccounts/adminsdk)
2. Click "Generate new private key"
3. Save the JSON file securely

### 2. Add GitHub Secrets

Go to your GitHub repository settings:
https://github.com/nanthan77/rechargetravels-sri-lankashalli-create-in-github/settings/secrets/actions

Add the following secrets:

#### Firebase Service Account (Required)
- **Name**: `FIREBASE_SERVICE_ACCOUNT`
- **Value**: Paste the entire content of the service account JSON file

#### Environment Variables (Required)
- `VITE_FIREBASE_API_KEY`: AIzaSyCxFnQfMo3rOWhgm1_yiRIh0Oez246U2N0
- `VITE_FIREBASE_AUTH_DOMAIN`: recharge-travels-73e76.firebaseapp.com
- `VITE_FIREBASE_PROJECT_ID`: recharge-travels-73e76
- `VITE_FIREBASE_STORAGE_BUCKET`: recharge-travels-73e76.firebasestorage.app
- `VITE_FIREBASE_MESSAGING_SENDER_ID`: 515581447537
- `VITE_FIREBASE_APP_ID`: 1:515581447537:web:b4f65bf9c2544c65d6fad0
- `VITE_FIREBASE_MEASUREMENT_ID`: G-W2MJBDFDG3
- `VITE_GOOGLE_MAPS_API_KEY`: AIzaSyC7VYA7MK4M3cgqQgyBzeFiLUSTkEt08a8

#### Payment Gateway (Optional - add when ready)
- `VITE_PAYHERE_MERCHANT_ID`: your_merchant_id
- `VITE_PAYHERE_MERCHANT_SECRET`: your_merchant_secret
- `VITE_PAYMENT_ENV`: sandbox

### 3. GitHub Actions Workflow

The workflow files are already created in `.github/workflows/`:
- `firebase-hosting-merge.yml` - Deploys on push to main branch
- `firebase-hosting-pull-request.yml` - Creates preview deployments for PRs

### 4. Enable GitHub Actions

1. Go to your repository on GitHub
2. Click on "Actions" tab
3. Enable workflows if prompted

## How It Works

1. **Push to main branch** → GitHub Actions triggers
2. **Install dependencies** → For both main site and admin panel
3. **Build both sites** → Creates production builds
4. **Deploy to Firebase** → Updates both live sites
5. **Deploy rules & indexes** → Updates Firestore configuration

## Multi-Site Deployment

This project deploys two separate sites:

1. **Main Website**
   - Source: `/src`
   - Build: `/dist`
   - URL: https://recharge-travels-73e76.web.app

2. **Admin Panel**
   - Source: `/admin/src`
   - Build: `/admin/dist`
   - URL: https://recharge-travels-admin.web.app

## Testing the Setup

1. Make a small change to any file
2. Commit and push to main branch:
   ```bash
   git add .
   git commit -m "Test automatic deployment"
   git push origin main
   ```
3. Check GitHub Actions tab to see the deployment progress
4. Once complete, visit both sites to verify deployment

## Manual Deployment Commands

If you need to deploy manually:

```bash
# Deploy everything (recommended)
npm run deploy:all

# Deploy main site only
npm run deploy:main

# Deploy admin panel only
npm run deploy:admin

# Deploy with the script (includes checks)
./scripts/deploy-all.sh
```

## Monitoring Deployments

1. **Check deployment status**:
   https://github.com/nanthan77/rechargetravels-sri-lankashalli-create-in-github/actions

2. **View deployment history**:
   https://console.firebase.google.com/project/recharge-travels-73e76/hosting

## Live Sites

- **Main Site**: https://recharge-travels-73e76.web.app
- **Admin Panel**: https://recharge-travels-admin.web.app

## Troubleshooting

### Build Failures
- Check that all environment variables are set in GitHub Secrets
- Ensure dependencies are correctly listed in both package.json files
- Verify Node.js version compatibility (using v18)

### TypeScript Errors
- The build process may show TypeScript errors but still complete
- Use `npx vite build` locally to bypass TypeScript checks if needed

### Deployment Failures
- Verify Firebase service account has correct permissions
- Check that Firebase project ID matches in all configurations
- Ensure hosting targets are correctly configured

### Permission Errors
- Ensure the service account has "Firebase Hosting Admin" role
- Check that GitHub Actions has permission to read secrets
- Run `firebase target:apply hosting main recharge-travels-73e76`
- Run `firebase target:apply hosting admin recharge-travels-admin`

## Security Notes

- Never commit the Firebase service account JSON file
- Keep all API keys in GitHub Secrets
- Use environment variables for sensitive data
- Admin panel has separate authentication

## Next Steps

1. Push your code to GitHub to trigger the first automatic deployment
2. Set up staging environment for testing (optional)
3. Configure deployment notifications (optional)
4. Add automated testing before deployment (optional)

---

**Last Updated**: January 2025
**Status**: Fully configured and ready for automatic deployments