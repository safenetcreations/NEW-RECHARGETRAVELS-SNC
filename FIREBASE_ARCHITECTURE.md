# Firebase Integration Architecture

## System Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                     Firebase Cloud Platform                      │
│                                                                   │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │              │  │              │  │              │          │
│  │  Firestore   │  │  Storage     │  │  Functions   │          │
│  │  Database    │  │  (Images)    │  │  (Backend)   │          │
│  │              │  │              │  │              │          │
│  └──────────────┘  └──────────────┘  └──────────────┘          │
│                                                                   │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │              │  │              │  │              │          │
│  │  Auth        │  │  Hosting     │  │  Analytics   │          │
│  │              │  │              │  │              │          │
│  └──────────────┘  └──────────────┘  └──────────────┘          │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │
                ┌─────────────┴─────────────┐
                │                           │
                ▼                           ▼
┌───────────────────────────┐   ┌───────────────────────────┐
│                           │   │                           │
│    Admin Panel App        │   │    Main Website App       │
│  (React + TypeScript)     │   │  (React + TypeScript)     │
│                           │   │                           │
│  Hosted at:               │   │  Hosted at:               │
│  recharge-travels-        │   │  recharge-travels-        │
│  admin.web.app            │   │  73e76.web.app            │
│                           │   │                           │
└───────────────────────────┘   └───────────────────────────┘
```

## Firestore Database Structure

```
recharge-travels-73e76 (Project)
│
├── users/ (Collection)
│   └── {userId}/ (Document)
│       ├── email: string
│       ├── displayName: string
│       ├── role: string
│       ├── createdAt: timestamp
│       └── lastLogin: timestamp
│
├── bookings/ (Collection)
│   └── {bookingId}/ (Document)
│       ├── userId: string
│       ├── tourId: string
│       ├── status: string
│       ├── amount: number
│       ├── participants: number
│       ├── bookingDate: timestamp
│       └── ...
│
├── tours/ (Collection)
│   └── {tourId}/ (Document)
│       ├── name: string
│       ├── description: string
│       ├── price: number
│       ├── duration: string
│       ├── images: array
│       ├── category: string
│       └── ...
│
├── hotels/ (Collection)
│   └── {hotelId}/ (Document)
│       ├── name: string
│       ├── location: string
│       ├── rating: number
│       ├── amenities: array
│       ├── rooms: array
│       └── ...
│
├── activities/ (Collection)
│   └── {activityId}/ (Document)
│       ├── name: string
│       ├── description: string
│       ├── duration: string
│       ├── difficulty: string
│       └── ...
│
├── drivers/ (Collection)
│   └── {driverId}/ (Document)
│       ├── name: string
│       ├── vehicleType: string
│       ├── rating: number
│       ├── availability: array
│       └── ...
│
├── reviews/ (Collection)
│   └── {reviewId}/ (Document)
│       ├── userId: string
│       ├── tourId: string
│       ├── rating: number
│       ├── comment: string
│       ├── createdAt: timestamp
│       └── ...
│
├── pages/ (Collection)
│   └── {pageId}/ (Document)
│       ├── slug: string
│       ├── title: string
│       ├── content: string
│       ├── metaDescription: string
│       └── ...
│
├── posts/ (Blog Posts Collection)
│   └── {postId}/ (Document)
│       ├── title: string
│       ├── slug: string
│       ├── content: string
│       ├── author: string
│       ├── category: string
│       ├── tags: array
│       ├── featuredImage: string
│       ├── publishedAt: timestamp
│       └── ...
│
├── destinations/ (Collection)
│   └── {destinationId}/ (Document)
│       ├── name: string
│       ├── slug: string
│       ├── description: string
│       ├── highlights: array
│       ├── images: array
│       └── ...
│
└── settings/ (Collection)
    ├── general/ (Document)
    │   ├── siteName: string
    │   ├── siteDescription: string
    │   ├── contactEmail: string
    │   └── ...
    │
    ├── socialMedia/ (Document) ⭐ NEW!
    │   ├── youtube: object
    │   │   ├── enabled: boolean
    │   │   ├── channelId: string
    │   │   ├── channelName: string
    │   │   ├── livestreamUrl: string
    │   │   ├── subscribersCount: string
    │   │   ├── livestreamTitle: string
    │   │   └── livestreamDescription: string
    │   │
    │   ├── instagram: object
    │   │   ├── enabled: boolean
    │   │   ├── username: string
    │   │   ├── profileUrl: string
    │   │   ├── followersCount: string
    │   │   └── postsCount: string
    │   │
    │   ├── facebook: object
    │   ├── tiktok: object
    │   ├── whatsapp: object
    │   └── telegram: object
    │
    ├── homepage/ (Document)
    │   ├── hero: object
    │   ├── featuredDestinations: array
    │   ├── testimonials: array
    │   ├── stats: object
    │   └── ...
    │
    └── emailTemplates/ (Document)
        ├── bookingConfirmation: string
        ├── welcomeEmail: string
        ├── newsletterWelcome: string
        └── ...
```

## Admin Panel Integration Flow

```
┌────────────────────────────────────────────────────────────┐
│                    Admin Panel Frontend                     │
│                                                              │
│  ┌─────────────────────────────────────────────────────┐   │
│  │                  Authentication                      │   │
│  │  ┌─────────────┐  ┌─────────────┐  ┌────────────┐  │   │
│  │  │   Firebase  │  │   Google    │  │   Email/   │  │   │
│  │  │     Auth    │  │     OAuth   │  │  Password  │  │   │
│  │  └─────────────┘  └─────────────┘  └────────────┘  │   │
│  └─────────────────────────────────────────────────────┘   │
│                              │                              │
│                              ▼                              │
│  ┌─────────────────────────────────────────────────────┐   │
│  │              Admin Panel Sections                   │   │
│  │                                                      │   │
│  │  Dashboard │ CMS │ Content │ Services │ Management  │   │
│  │                                                      │   │
│  │  ┌──────────────────────────────────────────────┐  │   │
│  │  │        Social Media Manager (NEW!)           │  │   │
│  │  │  ┌────────────────────────────────────────┐  │  │   │
│  │  │  │  YouTube │ Instagram │ Facebook        │  │  │   │
│  │  │  │  TikTok  │ WhatsApp  │ Telegram        │  │  │   │
│  │  │  └────────────────────────────────────────┘  │  │   │
│  │  └──────────────────────────────────────────────┘  │   │
│  └─────────────────────────────────────────────────────┘   │
│                              │                              │
│                              ▼                              │
│  ┌─────────────────────────────────────────────────────┐   │
│  │            Firebase SDK Integration                 │   │
│  │  ┌─────────────┐  ┌─────────────┐  ┌────────────┐  │   │
│  │  │  Firestore  │  │   Storage   │  │  Functions │  │   │
│  │  │   Client    │  │    Client   │  │   Client   │  │   │
│  │  └─────────────┘  └─────────────┘  └────────────┘  │   │
│  └─────────────────────────────────────────────────────┘   │
└────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌────────────────────────────────────────────────────────────┐
│                     Firebase Backend                        │
│                                                              │
│  ┌─────────────────────────────────────────────────────┐   │
│  │              Firestore Database                     │   │
│  │  ┌──────────────────────────────────────────────┐  │   │
│  │  │  Real-time data sync with frontend apps      │  │   │
│  │  │  Collections: users, bookings, tours, etc.   │  │   │
│  │  │  Document-based NoSQL structure              │  │   │
│  │  └──────────────────────────────────────────────┘  │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                              │
│  ┌─────────────────────────────────────────────────────┐   │
│  │           Cloud Functions (Backend Logic)           │   │
│  │  ┌──────────────────────────────────────────────┐  │   │
│  │  │  • Email Notifications                       │  │   │
│  │  │  • Booking Confirmations                     │  │   │
│  │  │  • WhatsApp Messages                         │  │   │
│  │  │  • Newsletter Management                     │  │   │
│  │  │  • Data Validation                           │  │   │
│  │  └──────────────────────────────────────────────┘  │   │
│  └─────────────────────────────────────────────────────┘   │
└────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌────────────────────────────────────────────────────────────┐
│                  Main Website Frontend                      │
│                                                              │
│  Consumes data from Firebase Firestore                      │
│  Displays social media integrations                         │
│  Shows tours, hotels, bookings, etc.                        │
└────────────────────────────────────────────────────────────┘
```

## Data Flow: Social Media Manager

```
┌────────────────────────────────────────────────────────────┐
│                  Admin Opens Social Media Manager           │
└────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌────────────────────────────────────────────────────────────┐
│          Component loads configuration from Firestore       │
│          Path: settings/socialMedia                         │
└────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌────────────────────────────────────────────────────────────┐
│     Admin edits platform configurations                     │
│     • Enable/disable platforms                              │
│     • Update URLs and credentials                           │
│     • Modify follower/subscriber counts                     │
└────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌────────────────────────────────────────────────────────────┐
│          Admin clicks "Save Changes"                        │
└────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌────────────────────────────────────────────────────────────┐
│     Data is saved to Firestore (setDoc with merge)         │
│     Path: settings/socialMedia                             │
└────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌────────────────────────────────────────────────────────────┐
│          Success toast notification shown                   │
└────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌────────────────────────────────────────────────────────────┐
│     Main website automatically reflects changes             │
│     (if using real-time listeners)                          │
└────────────────────────────────────────────────────────────┘
```

## Security Model

```
┌────────────────────────────────────────────────────────────┐
│                  Firebase Security Rules                    │
│                                                              │
│  ┌─────────────────────────────────────────────────────┐   │
│  │            Firestore Security Rules                 │   │
│  │                                                      │   │
│  │  • Admin users: Full read/write access             │   │
│  │  • Regular users: Read access to public data       │   │
│  │  • Unauthenticated: Read-only for public content   │   │
│  │                                                      │   │
│  │  Example:                                           │   │
│  │  match /settings/{document=**} {                    │   │
│  │    allow read: if true;                             │   │
│  │    allow write: if isAdmin();                       │   │
│  │  }                                                   │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                              │
│  ┌─────────────────────────────────────────────────────┐   │
│  │              Storage Security Rules                 │   │
│  │                                                      │   │
│  │  • Image uploads: Admin only                        │   │
│  │  • Public images: Anyone can read                   │   │
│  │  • Size limits: 5MB per file                        │   │
│  │  • File types: images/* only                        │   │
│  └─────────────────────────────────────────────────────┘   │
└────────────────────────────────────────────────────────────┘
```

## Deployment Pipeline

```
┌────────────────────────────────────────────────────────────┐
│                    Local Development                        │
│                                                              │
│  1. npm run dev (Main app on localhost:5173)               │
│  2. npm run dev:admin (Admin on localhost:5174)            │
└────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌────────────────────────────────────────────────────────────┐
│                     Build Process                           │
│                                                              │
│  1. npm run build (Builds main app → dist/)                │
│  2. npm run build:admin (Builds admin → admin/dist/)       │
│  3. Or: npm run build:all (Builds both)                    │
└────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌────────────────────────────────────────────────────────────┐
│                  Firebase Deployment                        │
│                                                              │
│  1. firebase deploy --only hosting:main                     │
│  2. firebase deploy --only hosting:admin                    │
│  3. firebase deploy --only functions                        │
│  4. Or: npm run deploy:all (Deploys everything)            │
└────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌────────────────────────────────────────────────────────────┐
│                   Production Apps                           │
│                                                              │
│  Main: https://recharge-travels-73e76.web.app              │
│  Admin: https://recharge-travels-admin.web.app             │
└────────────────────────────────────────────────────────────┘
```

## Performance Optimization

```
┌────────────────────────────────────────────────────────────┐
│                  Optimization Strategies                    │
│                                                              │
│  ┌─────────────────────────────────────────────────────┐   │
│  │              Frontend Optimization                  │   │
│  │  • Lazy loading of components                       │   │
│  │  • Code splitting with React.lazy()                 │   │
│  │  • Image optimization and lazy loading              │   │
│  │  • Compression (gzip/brotli)                        │   │
│  │  • CDN delivery via Firebase Hosting                │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                              │
│  ┌─────────────────────────────────────────────────────┐   │
│  │            Database Optimization                    │   │
│  │  • Indexed queries on frequently used fields        │   │
│  │  • Pagination for large datasets                    │   │
│  │  • Caching with React Query                         │   │
│  │  • Real-time listeners only where needed            │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                              │
│  ┌─────────────────────────────────────────────────────┐   │
│  │             Function Optimization                   │   │
│  │  • Cold start minimization                          │   │
│  │  • Memory allocation tuning                         │   │
│  │  • Async processing where possible                  │   │
│  └─────────────────────────────────────────────────────┘   │
└────────────────────────────────────────────────────────────┘
```

---

**Architecture Version**: 2.0.0
**Last Updated**: November 27, 2025
**Status**: Production Ready ✅
