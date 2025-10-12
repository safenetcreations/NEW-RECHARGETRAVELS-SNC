# 🚀 Recharge Travels Sri Lanka - Deployment Workflow

## Last Updated: July 31, 2025

### 🎯 Recent Deployment Status
- **Live URL**: https://recharge-travels-73e76.web.app
- **Deploy Time**: July 31, 2025
- **Build Time**: 67 seconds (fast build)
- **Bundle Size**: ~10MB (1.8MB gzipped)

## 📋 Development Workflow

### 1. Local Development
```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Run type checking (currently times out - use build:fast instead)
npm run typecheck
```

### 2. Build Process

#### Fast Build (Recommended)
```bash
# Skip TypeScript checking for faster builds
npm run build:fast
```

#### Standard Build (May timeout)
```bash
# Full build with TypeScript checking
npm run build
```

#### Build Scripts Available
- `build` - Full TypeScript + Vite build
- `build:fast` - Fast build without TypeScript checking
- `build:prod` - Production optimized build
- `build:dev` - Development build
- `build:admin` - Admin panel build
- `build:all` - Build both main and admin apps

### 3. Deployment Process

#### Deploy to Firebase (Recommended)
```bash
# Using npm script
npm run deploy:main

# Direct Firebase deployment (if already built)
npx firebase-tools deploy --only hosting:main

# Deploy everything
npm run deploy:all
```

#### Deploy to Google Cloud
```bash
npm run deploy:gcloud
```

## 🐛 Known Issues & Solutions

### 1. TypeScript Compilation Timeout
**Problem**: Project has 819 TypeScript files causing timeouts

**Solution**: 
- Use `npm run build:fast` for quick builds
- Added incremental compilation to tsconfig.json
- Consider splitting into smaller modules

### 2. Large Bundle Size
**Problem**: Main bundle is 7.1MB (1.3MB gzipped)

**Solution**:
- Implemented code splitting in vite.config.fast.ts
- Lazy load heavy components
- Review and remove unused dependencies

### 3. Missing Fonts
**Warning**: BebasNeue and OpenSauceSans fonts not found

**Solution**:
- Add font files to `public/fonts/` directory
- Or remove font references from CSS

### 4. Tailwind Warning
**Warning**: `duration-[10s]` class ambiguity

**Solution**:
- Replace with `duration-[10000ms]` in DroneFlythroughHero.tsx

## 🔧 Configuration Files

### Key Config Files Modified
1. **tsconfig.json** - Added incremental compilation
2. **vite.config.fast.ts** - Fast build configuration
3. **package.json** - Added build:fast script
4. **.firebaserc** - Firebase project configuration

### Environment Variables
```env
# Firebase Config (already set)
VITE_FIREBASE_API_KEY=xxx
VITE_FIREBASE_AUTH_DOMAIN=xxx
VITE_FIREBASE_PROJECT_ID=recharge-travels-73e76

# Google Maps
VITE_GOOGLE_MAPS_API_KEY=xxx

# Payment Gateway
VITE_PAYHERE_MERCHANT_ID=xxx
VITE_STRIPE_PUBLIC_KEY=xxx
```

## 📊 Performance Metrics

### Build Performance
- **Fast Build**: ~67 seconds
- **Standard Build**: Timeouts (>5 minutes)
- **Files**: 3,833 modules transformed
- **Output**: 21 files deployed

### Bundle Analysis
```
Main chunks:
- index.js: 7.1MB (1.3MB gzipped)
- firebase.js: 845KB (180KB gzipped)
- react-vendor.js: 259KB (65KB gzipped)
- ui-components.js: 255KB (54KB gzipped)
```

## 🚀 Deployment Checklist

- [x] Run fast build: `npm run build:fast`
- [x] Check build output in `dist/` folder
- [x] Deploy to Firebase: `npx firebase-tools deploy`
- [x] Verify live site: https://recharge-travels-73e76.web.app
- [x] Update workflow documentation
- [ ] Monitor performance metrics
- [ ] Set up CI/CD pipeline

## 📝 Git Workflow

### Commit Changes
```bash
# Stage specific files
git add package.json tsconfig.json vite.config.fast.ts

# Or stage all changes
git add .

# Commit with message
git commit -m "Optimize build performance and deploy to Firebase"

# Push to GitHub
git push origin main
```

### GitHub Actions
- Firebase deployment workflow exists at `.github/workflows/firebase-deploy.yml`
- Triggers on push to main branch
- Automatically deploys to Firebase hosting

## 🆘 Troubleshooting

### If build fails:
1. Clear node_modules: `rm -rf node_modules && npm install`
2. Clear build cache: `rm -rf dist .tsbuildinfo`
3. Use fast build: `npm run build:fast`
4. Increase memory: `NODE_OPTIONS="--max-old-space-size=8192" npm run build`

### If deployment fails:
1. Check Firebase login: `firebase login`
2. Verify project: `firebase use recharge-travels-73e76`
3. Use direct deployment: `npx firebase-tools deploy --only hosting:main`

## 📈 Next Steps

1. **Optimize Bundle Size**
   - Implement route-based code splitting
   - Lazy load heavy components
   - Tree shake unused code

2. **Fix TypeScript Performance**
   - Split into smaller packages
   - Use project references
   - Enable strict mode gradually

3. **Set Up Monitoring**
   - Google Analytics
   - Performance monitoring
   - Error tracking with Sentry

4. **Improve CI/CD**
   - Automate deployments
   - Add testing stage
   - Set up staging environment

---

**Last successful deployment**: July 31, 2025
**Deployed by**: Claude Code Assistant
**Live at**: https://recharge-travels-73e76.web.app