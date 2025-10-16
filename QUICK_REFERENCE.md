# Quick Reference Card - Optimization Commands

## Daily Operations
```bash
# Development
npm run dev                    # Start dev server (localhost:8080)

# Build & Preview
npm run build                  # Production build
npm run preview                # Preview build (localhost:4173)
```

## Optimization Tools
```bash
# Run full optimization
./optimize-codebase.sh         # Clean unused files

# Check performance
./performance-check.sh         # Bundle size & health check

# Type checking
npm run typecheck              # Check TypeScript errors
```

## Deployment
```bash
# Deploy main site
npm run deploy:main

# Deploy admin panel
npm run deploy:admin

# Deploy everything
npm run deploy:all
```

## Analysis Tools
```bash
# Check bundle size
du -sh dist

# Analyze bundle (install first)
npm install -D rollup-plugin-visualizer
npx vite-bundle-visualizer

# Lighthouse audit
npm run preview                # Start preview server first
npx lighthouse http://localhost:4173 --view
```

## Troubleshooting
```bash
# Clean everything
npm run clean
npm install

# Clean just builds
npm run clean:build

# Skip TypeScript check
npx vite build                 # Build without tsc check
```

## Current Status
- ✅ Build Size: 11MB (2.76MB JS, 272KB CSS)
- ✅ Chunks: 13 intelligent splits
- ✅ Build Time: ~8.67s
- ✅ Gzip: 60-70% compression
- ✅ Old Files: 0 (cleaned)
- ✅ Console.logs: Removed in production

## Performance Targets
- Bundle Size: < 15MB (✅ Current: 11MB)
- Build Time: < 15s (✅ Current: 8.67s)
- Lighthouse: > 85 (Test needed)
- Load Time: < 3s (Test needed)

## Quick Wins Available
1. Refactor destinations → Template system (~500KB savings)
2. Choose one map library (~150KB savings)
3. Further split vendor-other.js (~better caching)

---
Last Updated: 2025-10-15
Status: ✅ Production Ready
