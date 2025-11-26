# Experience Page Implementation Guide

This guide documents the implementation of CMS-editable experience pages for Recharge Travels, with a dynamic component system that supports any experience type.

## 🏗️ Architecture Overview

The experience pages are built with:
- **React + TypeScript** for type-safe component development
- **Firebase Firestore** for CMS functionality
- **React Query** for data fetching and caching
- **Tailwind CSS** for responsive styling
- **React Helmet** for SEO optimization

## 📁 File Structure

```
src/
├── types/
│   └── experience.ts          # TypeScript interfaces for experiences
├── data/
│   ├── seed-whale-watching.json  # Sample data for whale watching
│   └── seed-pilgrimage-tours.json # Sample data for pilgrimage tours
├── pages/
│   └── experiences/
│       ├── [slug].tsx         # Dynamic experience page component
│       ├── WhaleWatching.tsx  # Whale watching page wrapper
│       └── PilgrimageTours.tsx # Pilgrimage tours page wrapper
└── scripts/
    ├── seedWhaleWatchingData.ts  # Whale watching seeding script
    └── seedPilgrimageToursData.ts # Pilgrimage tours seeding script
```

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Set Up Firebase Environment Variables
Ensure your `.env` file contains:
```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

### 3. Seed Initial Data to Firestore

For whale watching:
```bash
npm run seed:whale-watching
```

For pilgrimage tours:
```bash
npm run seed:pilgrimage-tours
```

Each seed script will create:
- 1 experience document in the `experiences` collection
- 6 sample tour documents in the `tours` collection
- 6 FAQ documents in the `faqs` collection

### 4. Run Development Server
```bash
npm run dev
```

Visit the experience pages:
- Whale Watching: `http://localhost:5173/experiences/whale-watching`
- Pilgrimage Tours: `http://localhost:5173/experiences/pilgrimage-tours`

## 📊 Firestore Data Structure

### Experiences Collection
```javascript
{
  "slug": "whale-watching",
  "name": "Whale Watching in Sri Lanka",
  "heroImageURL": "https://...",
  "seo": {
    "title": "...",
    "description": "..."
  },
  "introParagraph": "...",
  "highlights": [
    {
      "icon": "🐋",
      "title": "Blue Whale Encounters",
      "blurb60": "..."
    }
  ],
  "routes": [...],
  "galleryImages": [...],
  "faqTag": "whale-watching",
  "ctaHeadline": "...",
  "ctaSub": "...",
  "videoURL": "https://youtube.com/embed/..."
}
```

### Tours Collection
```javascript
{
  "experienceSlug": "whale-watching",
  "title": "Mirissa Blue Whale Safari",
  "thumbnail": "https://...",
  "badges": ["Most Popular", "Eco-Certified"],
  "duration": "3-4 hours",
  "salePriceUSD": 65,
  "regularPriceUSD": 80,
  "isPublished": true,
  "description": "...",
  "highlights": [...]
}
```

### FAQs Collection
```javascript
{
  "tag": "whale-watching",
  "question": "When is the best time...",
  "answer": "The best time varies...",
  "order": 1
}
```

## 🎨 Page Sections

The experience page includes these data-block sections:

1. **Hero** (`data-block="hero"`) - Full-width hero image with title
2. **Intro** (`data-block="intro"`) - Introduction paragraph
3. **Highlights** (`data-block="highlights"`) - 4-column grid of key features
4. **Routes** (`data-block="routes"`) - Interactive maps with route details
5. **Gallery** (`data-block="gallery"`) - Masonry photo gallery
6. **Live Tours** (`data-block="live-tours"`) - Dynamic pricing feed
7. **Video** (`data-block="video"`) - YouTube embed (if URL provided)
8. **FAQs** (`data-block="faqs"`) - Accordion FAQ section
9. **CTA** (`data-block="cta"`) - Call-to-action with parallax background
10. **Form** (`data-block="form"`) - Contact inquiry form

## 🔧 CMS Editing

All content is editable via Firebase Console:

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select your project
3. Navigate to Firestore Database
4. Find the relevant collection (`experiences`, `tours`, or `faqs`)
5. Edit documents directly in the console

Changes are reflected immediately on the live site thanks to React Query's caching strategy.

## 🚀 Deployment

### Build for Production
```bash
npm run build:prod
```

### Deploy to Firebase
```bash
npm run deploy:firebase
```

### Deploy to Google Cloud
```bash
npm run deploy:gcloud
```

## 📈 Performance Optimization

- **Lazy Loading**: Images use native lazy loading
- **Code Splitting**: React Query ensures data is loaded on demand
- **WebP Images**: Use WebP format for all images
- **Responsive Images**: Implement srcSet for different screen sizes
- **Bundle Size**: Keep JavaScript bundle under 180KB

## 🔍 SEO Features

- **Meta Tags**: Dynamic title and description from CMS
- **Open Graph**: Social media preview optimization
- **Twitter Cards**: Enhanced Twitter sharing
- **JSON-LD**: Structured data for rich snippets
  - TouristAttraction schema
  - BreadcrumbList schema
  - FAQPage schema
  - ItemList schema (for tours)

## 🤖 AI-Friendly Architecture

Each section includes `data-block` attributes for easy identification:
```html
<section data-block="hero">...</section>
<section data-block="intro">...</section>
```

This allows AI agents to:
- Identify specific content blocks
- Make granular updates
- Understand page structure

## 🎯 Creating New Experience Pages

### Method 1: Using the Dynamic Component (Recommended)

1. **Create Seed Data JSON**:
   ```json
   // src/data/seed-new-experience.json
   {
     "slug": "new-experience",
     "name": "New Experience Name",
     "heroImageURL": "https://...",
     // ... follow the experience structure
   }
   ```

2. **Create Wrapper Component**:
   ```typescript
   // src/pages/experiences/NewExperience.tsx
   import React from 'react';
   import { useParams } from 'react-router-dom';
   import ExperiencePage from './[slug]';

   const NewExperience: React.FC = () => {
     const ExperiencePageWithSlug = () => {
       const originalParams = useParams();
       const RouterDom = require('react-router-dom');
       const originalUseParams = RouterDom.useParams;
       
       React.useLayoutEffect(() => {
         RouterDom.useParams = () => ({ ...originalParams, slug: 'new-experience' });
         return () => {
           RouterDom.useParams = originalUseParams;
         };
       }, [originalParams]);
       
       return <ExperiencePage />;
     };
     
     return <ExperiencePageWithSlug />;
   };

   export default NewExperience;
   ```

3. **Add Route**:
   ```typescript
   // src/App.tsx
   <Route path="/experiences/new-experience" element={<NewExperience />} />
   ```

4. **Create Seed Script**:
   ```typescript
   // scripts/seedNewExperienceData.ts
   // Follow the pattern in seedWhaleWatchingData.ts
   ```

5. **Add to package.json**:
   ```json
   "seed:new-experience": "cd scripts && npx ts-node seedNewExperienceData.ts"
   ```

6. **Run Seed Script**:
   ```bash
   npm run seed:new-experience
   ```

### Method 2: Direct Firestore Creation

Alternatively, you can create experiences directly in Firebase Console without a seed script:

1. Go to Firebase Console → Firestore
2. Create a new document in `experiences` collection
3. Use the experience slug as the document ID
4. Add all required fields following the Experience interface structure

## 📝 Maintenance

- **Update Tours**: Add/edit tours in Firestore `tours` collection
- **Update FAQs**: Modify questions in Firestore `faqs` collection
- **Change Images**: Update URLs in Firestore documents
- **Add Sections**: Extend the component with new data-block sections

## 🐛 Troubleshooting

**Issue**: Page shows "Experience not found"
- **Solution**: Check if the document exists in Firestore `experiences` collection

**Issue**: Tours not displaying
- **Solution**: Ensure tours have `isPublished: true` and matching `experienceSlug`

**Issue**: Images not loading
- **Solution**: Verify Firebase Storage URLs are publicly accessible

**Issue**: Build errors
- **Solution**: Run `npm run typecheck` to identify TypeScript issues

## 📞 Support

For technical support or questions about implementation:
- Review the `WhaleWatching.tsx` component as reference
- Check Firebase Console for data structure
- Ensure all environment variables are set correctly