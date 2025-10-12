# Admin Panel Setup Guide

The admin panel has been successfully separated from the main website. Here's what you need to do to complete the setup:

## 1. Create Admin Hosting Site in Firebase

Run these commands to create a separate hosting site for the admin panel:

```bash
# Login to Firebase (if not already logged in)
firebase login

# List current hosting sites
firebase hosting:sites:list

# Create new hosting site for admin
firebase hosting:sites:create recharge-travels-admin

# Apply the target configuration
firebase target:apply hosting admin recharge-travels-admin
```

## 2. Deploy Both Sites

```bash
# Install dependencies for both apps
npm run install:all

# Build both applications
npm run build:all

# Deploy to Firebase (both sites)
firebase deploy --only hosting
```

## 3. Access Your Sites

After deployment:
- **Main Site**: https://recharge-travels-73e76.web.app
- **Admin Site**: https://recharge-travels-admin.web.app

## 4. Development

To run the applications locally:

```bash
# Run main site (port 5173)
npm run dev

# Run admin site (port 5174)
npm run dev:admin
```

## Project Structure

```
/
├── src/              # Main customer-facing website
├── admin/            # Separate admin application
│   ├── src/
│   ├── package.json
│   └── vite.config.ts
├── firebase.json     # Multi-site hosting configuration
└── .firebaserc       # Firebase project configuration
```

## GitHub Actions

The workflow has been updated to automatically deploy both sites when you push to the main branch. Both the main site and admin site will be built and deployed separately.

## Security Benefits

By separating the admin panel:
- Reduced bundle size for customer-facing site
- Better security isolation
- Independent deployment and scaling
- Easier to implement admin-specific authentication
- Can add IP restrictions or additional security layers to admin site

## Next Steps

1. Run the Firebase commands above to create the admin hosting site
2. Deploy both applications
3. Update any environment variables or configurations as needed
4. Consider adding additional security measures to the admin site (IP whitelist, etc.)