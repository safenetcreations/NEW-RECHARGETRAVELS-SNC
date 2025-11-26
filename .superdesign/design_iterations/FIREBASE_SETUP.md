# Firebase Setup Guide for Recharge Travels Admin Panel

## Overview
This guide helps you set up Firebase Firestore security rules and configure your Firebase project for the Ayurveda & Wellness admin panel.

---

## Step 1: Configure Firestore Security Rules

Go to **Firebase Console** > **Firestore Database** > **Rules** and paste these rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // Site Content (hero, philosophy, cta, settings)
    // Anyone can read, only authenticated users can write
    match /siteContent/{document} {
      allow read: if true;
      allow write: if request.auth != null;
    }

    // Retreats Collection
    match /retreats/{retreatId} {
      allow read: if true;
      allow write: if request.auth != null;
    }

    // Treatments Collection
    match /treatments/{treatmentId} {
      allow read: if true;
      allow write: if request.auth != null;
    }

    // Testimonials Collection
    match /testimonials/{testimonialId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

Click **Publish** to save the rules.

---

## Step 2: Enable Authentication

1. Go to **Firebase Console** > **Authentication** > **Sign-in method**
2. Enable **Email/Password** authentication
3. Click **Save**

---

## Step 3: Create Admin Account

**Option A: Via Admin Panel**
1. Open `admin_panel_1.html` in your browser
2. Enter your admin email and password
3. Click "Create Admin Account" link
4. You'll be automatically logged in

**Option B: Via Firebase Console**
1. Go to **Firebase Console** > **Authentication** > **Users**
2. Click **Add user**
3. Enter email and password
4. Click **Add user**

---

## Step 4: Initialize Default Data

1. Log into the admin panel
2. Click **Dashboard** in the sidebar
3. Click **Initialize Data** button
4. This will populate all default content

---

## Database Structure

```
firestore/
├── siteContent/
│   ├── hero/
│   │   ├── title: string
│   │   ├── subtitle: string
│   │   ├── label: string
│   │   ├── ctaText: string
│   │   ├── backgroundImage: string (URL)
│   │   └── updatedAt: timestamp
│   │
│   ├── philosophy/
│   │   ├── label: string
│   │   ├── title: string
│   │   ├── description: string
│   │   ├── pillars: array[string]
│   │   └── updatedAt: timestamp
│   │
│   ├── cta/
│   │   ├── label: string
│   │   ├── title: string
│   │   ├── subtitle: string
│   │   ├── primaryButton: string
│   │   ├── secondaryButton: string
│   │   └── updatedAt: timestamp
│   │
│   └── settings/
│       ├── siteName: string
│       ├── contactEmail: string
│       ├── contactPhone: string
│       ├── social/
│       │   ├── instagram: string
│       │   ├── facebook: string
│       │   ├── twitter: string
│       │   └── linkedin: string
│       └── updatedAt: timestamp
│
├── retreats/
│   └── {retreatId}/
│       ├── title: string
│       ├── category: string
│       ├── duration: string
│       ├── description: string
│       ├── price: number
│       ├── image: string (URL)
│       ├── order: number
│       ├── createdAt: timestamp
│       └── updatedAt: timestamp
│
├── treatments/
│   └── {treatmentId}/
│       ├── name: string
│       ├── icon: string (Lucide icon name)
│       ├── description: string
│       ├── order: number
│       ├── createdAt: timestamp
│       └── updatedAt: timestamp
│
└── testimonials/
    └── {testimonialId}/
        ├── author: string
        ├── location: string
        ├── quote: string
        ├── rating: number (1-5)
        ├── createdAt: timestamp
        └── updatedAt: timestamp
```

---

## Files Overview

| File | Purpose |
|------|---------|
| `admin_panel_1.html` | Admin dashboard for content management |
| `ayurveda_wellness_dynamic.html` | Public-facing page (fetches from Firebase) |
| `ayurveda_wellness_1.html` | Static version (no Firebase) |
| `ayurveda_wellness_theme.css` | Shared theme/styling |

---

## How to Use

### Admin Panel
1. Open `admin_panel_1.html`
2. Login with your admin credentials
3. Navigate using the sidebar:
   - **Dashboard** - Overview & quick actions
   - **Hero Section** - Edit hero banner
   - **Philosophy** - Edit philosophy content
   - **Retreats** - Add/Edit/Delete retreats
   - **Treatments** - Add/Edit/Delete treatments
   - **Testimonials** - Add/Edit/Delete testimonials
   - **CTA Section** - Edit call-to-action
   - **Settings** - Site settings & social links

### Public Page
- The `ayurveda_wellness_dynamic.html` automatically loads content from Firebase
- Changes made in admin panel reflect immediately on the public page

---

## Troubleshooting

### "Permission denied" errors
- Make sure you're logged in to the admin panel
- Verify Firestore rules are published correctly

### Content not loading
- Check browser console for errors
- Verify Firebase project ID matches your config
- Ensure Firestore is enabled in your Firebase project

### Images not showing
- Verify image URLs are valid and accessible
- Use HTTPS URLs for images

---

## Security Notes

1. **Never share your Firebase config** with API keys in public repositories
2. **Use environment variables** in production
3. **Restrict API key access** in Firebase Console > Project Settings > API keys
4. **Add domain restrictions** to your API key for production

---

## Production Deployment

For production, consider:
1. Setting up Firebase Hosting
2. Adding custom domain
3. Enabling Firebase App Check
4. Setting up automated backups
5. Adding rate limiting rules

```bash
# Deploy to Firebase Hosting
firebase init hosting
firebase deploy
```

---

## Support

For issues with:
- **Firebase**: https://firebase.google.com/docs
- **Firestore**: https://firebase.google.com/docs/firestore
- **Authentication**: https://firebase.google.com/docs/auth
