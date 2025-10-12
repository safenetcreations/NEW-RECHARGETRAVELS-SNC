# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

**Recharge Travels Sri Lanka** - Premium travel booking platform with React, TypeScript, and Firebase.

- **Dual-App Architecture**: Main customer site + separate admin panel
- **Backend**: Firebase (Auth, Firestore, Storage, Hosting)
- **APIs**: Google Maps, Google Places, Gemini AI (chatbot)
- **Path Aliases**: `@/*` → `src/*`

## Quick Start

```bash
# Install dependencies for both apps
npm run install:all

# Start development
npm run dev:all        # Run both main site and admin panel
npm run dev           # Run main site only (port 8080)
npm run dev:admin     # Run admin panel only

# Build & Deploy
npm run deploy:complete  # Full Firebase deployment (hosting + rules)
npm run deploy:firebase  # Deploy to Firebase using script
npm run deploy:gcloud    # Deploy to Google App Engine
```

## Essential Commands

### Development

```bash
npm run dev              # Main site on port 8080
npm run dev:admin        # Admin panel (separate port)
npm run dev:all          # Both apps concurrently
npm run preview          # Preview production build
npm run typecheck        # Check TypeScript types
```

### Building

```bash
npm run build            # Standard production build
npm run build:prod       # Optimized production build with NODE_ENV=production
npm run build:fast       # Fast build with minimal optimization
npm run build:admin      # Build admin panel only
npm run build:all        # Build both main site and admin
```

### Deployment

```bash
# Firebase Hosting (Multi-target)
npm run deploy:main      # Deploy main site to Firebase
npm run deploy:admin     # Deploy admin panel to Firebase  
npm run deploy:all       # Deploy both sites to Firebase
npm run deploy:complete  # Deploy sites + Firestore rules + indexes

# Firestore Configuration
npm run deploy:rules     # Deploy Firestore security rules only
npm run deploy:indexes   # Deploy Firestore indexes only

# Google Cloud
npm run deploy:gcloud    # Deploy to App Engine using app.yaml
```

### Data Seeding

```bash
# Seed experience data into Firestore
npm run seed:whale-watching
npm run seed:pilgrimage-tours
npm run seed:island-getaways
npm run seed:hikkaduwa-water-sports
npm run seed:hot-air-balloon-sigiriya
npm run seed:kalpitiya-kitesurfing
npm run seed:jungle-camping
npm run seed:lagoon-safari
npm run seed:cooking-class
```

### Maintenance

```bash
npm run clean            # Remove all node_modules and dist folders
npm run clean:build      # Remove dist folders only
npm run fresh-install    # Clean install everything
npm run lint:fix         # Auto-fix linting issues
```

## Architecture

### Directory Structure

```
/
├── src/                    # Main application source
│   ├── pages/             # Route components (destinations, experiences, transport)
│   ├── components/        # Reusable UI components
│   ├── services/          # Firebase, API, and business logic services
│   ├── hooks/             # Custom React hooks
│   ├── contexts/          # React contexts (Auth, etc.)
│   ├── lib/               # Core utilities and Firebase config
│   └── data/              # Static data and configurations
│
├── admin/                 # Admin panel (separate React app)
│   ├── src/               # Admin panel source
│   ├── dist/              # Admin build output
│   └── package.json       # Admin dependencies
│
├── scripts/               # Deployment and seed scripts
├── firebase.json          # Multi-target hosting config
├── firestore.rules        # Security rules
├── app.yaml              # Google App Engine config
└── .env.example          # Environment variables template
```

### Firebase Integration

- **Config**: `src/lib/firebase.ts` - Core Firebase initialization
- **Auth**: `src/services/firebaseAuthService.ts` - Authentication logic
- **Database**: `src/lib/firebase-db.ts` - Firestore operations
- **Services**: `src/services/firebase*.ts` - Domain-specific Firebase services

### Key Components

- **Booking System**: `src/components/BookingModal.tsx`, `src/components/EnhancedBookingModal.tsx`
- **Discovery**: `src/components/SriLankaDiscovery.tsx` - Interactive destination explorer
- **Admin Panel**: `admin/src/` - Complete admin interface with separate routing

## Deployment Configuration

### Firebase Hosting Targets

This project uses **multi-target hosting** with two separate sites:

1. **Main Site** (`target: main`): Customer-facing website → `dist/`
2. **Admin Panel** (`target: admin`): Management interface → `admin/dist/`

### Environment Variables

Create `.env` from `.env.example`:

```env
# Firebase (Required)
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=

# Google Maps (Required)
VITE_GOOGLE_MAPS_API_KEY=

# AI Services (Optional)
VITE_GEMINI_API_KEY=        # For AI chatbot
VITE_OPENAI_API_KEY=        # For Yalu AI assistant
```

### Google Cloud Deployment

- **Config**: `app.yaml` defines App Engine settings
- **Runtime**: Node.js 20
- **Static Files**: Served from `dist/` with caching headers
- **Auto-scaling**: 0-10 instances based on CPU usage

## Important Notes

### Build Optimization

- Code splitting configured for vendor, UI, maps, and utils chunks
- Terser minification for production builds
- Source maps disabled in production for smaller bundle size
- Chunk size warning limit set to 600KB

### TypeScript Configuration

- Relaxed strict mode (`noImplicitAny: false`, `strictNullChecks: false`)
- Incremental compilation enabled for faster rebuilds
- Path alias `@/` mapped to `src/` directory

### Firebase Multi-Target Hosting

When deploying, always specify the target:
- `firebase deploy --only hosting:main` for main site
- `firebase deploy --only hosting:admin` for admin panel
- Use npm scripts for convenience

### Admin Panel Access

The admin panel is a separate React application with its own:
- Dependencies (lighter weight, admin-specific)
- Build output (`admin/dist/`)
- Routing and authentication flow
- Vite configuration

### Data Seeding Scripts

All seed scripts are in `scripts/` and connect directly to Firestore. They populate:
- Experience packages (whale watching, tours, activities)
- Destination content
- Hotel and transport data

Run these after Firebase setup to populate initial data.

## Common Tasks

### Add a new page
1. Create component in `src/pages/`
2. Add route in `src/App.tsx`
3. Update navigation if needed

### Deploy a hotfix
```bash
npm run build:fast
npm run deploy:main
```

### Update admin panel only
```bash
cd admin
npm run build
cd ..
npm run deploy:admin
```

### Full production deployment
```bash
npm run build:all
npm run deploy:complete
```

### Check deployment status
- Main site: Visit Firebase hosting URL or custom domain
- Admin panel: Access via `/admin` route or separate admin subdomain
- Check GitHub Actions for automated deployment status

## Troubleshooting

### Port conflicts
- Main app runs on port 8080
- If occupied, update in `vite.config.ts`

### Firebase deployment fails
- Ensure you're logged in: `firebase login`
- Check project selection: `firebase use <project-id>`
- Verify `.firebaserc` has correct project IDs

### Build errors
- Run `npm run typecheck` to find TypeScript issues
- Check for missing environment variables
- Try `npm run fresh-install` for dependency issues

### Admin panel not loading
- Ensure admin dependencies installed: `cd admin && npm install`
- Check admin build output exists: `admin/dist/`
- Verify Firebase hosting targets configured correctly
