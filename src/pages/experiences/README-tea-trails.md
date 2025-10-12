# Tea Trails Experience Page

## Overview
A production-ready, SEO-optimized experience page for Sri Lanka Tea Trails with Firestore CMS integration, live tour pricing feeds, and comprehensive performance optimization.

## Features
- 🔥 **Firestore CMS Integration** - All content editable from Firebase console
- 💰 **Live Tour Pricing** - Real-time pricing from Firestore tours collection
- 🚀 **Performance Optimized** - Lazy loading, responsive images, < 180KB bundle
- 📱 **Mobile-First Design** - Fully responsive with touch-optimized interactions
- 🔍 **SEO Ready** - JSON-LD structured data, meta tags, canonical URLs
- 🎨 **Modern UI** - Tailwind CSS with smooth animations and hover effects
- 🗺️ **Interactive Maps** - Leaflet integration for route visualization
- 📧 **Contact Form** - Integrated contact form with validation

## Tech Stack
- React with TypeScript
- Firestore for CMS
- React Query for data fetching
- Tailwind CSS for styling
- Framer Motion for animations
- Leaflet for maps
- React Helmet for SEO

## Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Set Up Firebase
Create a `.env` file with your Firebase config:
```env
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-auth-domain
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-storage-bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
VITE_FIREBASE_APP_ID=your-app-id
```

### 3. Seed Initial Data
```bash
# Run the seed script to populate Firestore
npx tsx src/scripts/seedTeaTrails.ts
```

### 4. Run Development Server
```bash
npm run dev
```

### 5. Deploy to Firebase
```bash
npm run build
firebase deploy
```

## Firestore Schema

### Collection: `experiences`
Document ID: `tea-trails`
```json
{
  "slug": "tea-trails",
  "name": "Sri Lanka Tea Trails",
  "heroImageURL": "https://...",
  "seo": {
    "title": "...",
    "description": "..."
  },
  "introParagraph": "...",
  "highlights": [
    {
      "icon": "🌿",
      "title": "Estate Walks",
      "blurb60": "..."
    }
  ],
  "routes": [...],
  "galleryImages": [...],
  "faqTag": "tea-trails",
  "ctaHeadline": "...",
  "ctaSub": "...",
  "videoURL": "..."
}
```

### Collection: `tours`
```json
{
  "experienceSlug": "tea-trails",
  "title": "Ultimate Tea Trail Experience",
  "thumbnail": "https://...",
  "badges": ["Bestseller", "Small Group"],
  "duration": "3 Days",
  "salePriceUSD": 299,
  "regularPriceUSD": 399,
  "highlights": [...],
  "isPublished": true
}
```

## Page Sections

1. **Hero Section** (60vh)
   - Full-width hero image with gradient overlay
   - Dynamic content from Firestore
   - CTA buttons with smooth hover effects

2. **Intro Section**
   - Prose content with max-width for readability
   - Pulls from `introParagraph` field

3. **Highlights Grid**
   - 4-column responsive grid
   - Icon-based feature cards
   - Hover animations

4. **Routes Section**
   - Interactive Leaflet maps
   - Route details with duration/distance
   - Booking CTAs

5. **Gallery**
   - Masonry-style image grid
   - Lazy loading with blur-up effect
   - Hover overlays with alt text

6. **Live Tours Feed**
   - Real-time pricing from Firestore
   - Filters by experienceSlug
   - Shows up to 6 tours sorted by price

7. **Video Embed**
   - Responsive 16:9 YouTube embed
   - Only shows if videoURL is present

8. **FAQs**
   - Accordion component
   - SEO-friendly with FAQPage schema

9. **CTA Section**
   - Parallax background effect
   - Strong call-to-action messaging

10. **Contact Form**
    - Form validation
    - Firebase integration ready

## Performance Optimizations

- **Images**: Responsive srcSet with WebP fallbacks
- **Lazy Loading**: Non-critical images loaded on scroll
- **Code Splitting**: Dynamic imports for heavy components
- **Bundle Size**: Optimized to stay under 180KB
- **Caching**: React Query with stale-while-revalidate

## SEO Features

- Dynamic meta tags from Firestore
- Open Graph and Twitter Card support
- JSON-LD structured data:
  - TouristAttraction
  - BreadcrumbList
  - FAQPage
  - ItemList (for tours)
- Canonical URL
- Sitemap ready

## AI-Friendly Architecture

All sections wrapped with `data-block` attributes for easy AI updates:
```html
<section data-block="hero">...</section>
<section data-block="intro">...</section>
<!-- etc -->
```

## Customization

### Update Content
1. Go to Firebase Console
2. Navigate to Firestore
3. Edit the `experiences/tea-trails` document
4. Changes reflect immediately on the site

### Add New Tours
1. Add documents to the `tours` collection
2. Set `experienceSlug: "tea-trails"`
3. Set `isPublished: true`
4. Tours appear automatically sorted by price

### Modify Styling
- Colors: Update Tailwind classes
- Spacing: Adjust padding/margin utilities
- Animations: Modify Framer Motion variants

## Monitoring

- Use Firebase Analytics for user tracking
- Monitor Core Web Vitals in Chrome DevTools
- Check bundle size with `npm run build`

## Support

For issues or questions:
- Check browser console for errors
- Verify Firebase configuration
- Ensure Firestore security rules allow reads
- Test with mock data if Firestore fails