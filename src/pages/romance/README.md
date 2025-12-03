# Sri Lanka Honeymoons & Destination Weddings Page

## Overview
A comprehensive, conversion-focused landing page that combines both honeymoon packages and destination wedding services for Recharge Travels Sri Lanka.

**Live URL**: https://www.rechargetravels.com/romance/honeymoons-weddings

## Features

### SEO & Performance
- ✅ Full SEO optimization with meta tags and structured data
- ✅ JSON-LD schema for Products, FAQs, and Organization
- ✅ Core Web Vitals optimized
- ✅ Lazy loading for images
- ✅ Mobile-first responsive design

### Content Sections
1. **Hero Section** - Stunning full-screen hero with CTAs
2. **Why Sri Lanka** - Value propositions for romance tourism
3. **Honeymoon Packages** - 3 tiers: Budget, Signature, Luxury
4. **Wedding Packages** - 3 tiers: Elopement, Beach, Cultural
5. **Sample Itinerary** - 10-day honeymoon itinerary
6. **Wedding Venues** - Beach, Tea Country, Cultural Triangle, North
7. **Add-ons** - Wedding extras and activities
8. **Gallery** - Visual showcase
9. **Testimonials** - Customer reviews
10. **FAQs** - Comprehensive Q&A (15 items)
11. **Contact Form** - Lead generation

### Technical Features
- 🏷️ AI-friendly with `data-block` attributes
- 🔥 Firebase/Firestore ready for CMS integration
- 💰 Live pricing capability
- 📱 Fully responsive across all devices
- ♿ Accessible with proper ARIA labels
- 🎨 Tailwind CSS with custom animations

## Package Details

### Honeymoon Packages
1. **Budget Bliss** - $899/couple, 7 nights
2. **Signature Romance** - $1,599/couple, 10 nights
3. **Ultra-Luxe Hideaways** - $3,999/couple, 12 nights

### Wedding Packages
1. **Intimate Elopement** - $1,499, up to 10 guests
2. **Signature Beach Wedding** - $4,999, up to 60 guests
3. **Grand Cultural Wedding** - $12,999, up to 200 guests

## File Structure
```
src/
├── pages/
│   └── romance/
│       ├── HoneymoonsWeddings.tsx  # Main component
│       └── README.md               # This file
├── types/
│   └── romance.ts                  # TypeScript interfaces
└── data/
    └── seed-honeymoons-weddings.json  # Content data
```

## CMS Integration (Future)

To make this page CMS-editable via Firebase:

1. **Create Firestore Collection**
   ```javascript
   // Collection: romanceLanding
   // Document ID: honeymoons-weddings
   ```

2. **Seed Data**
   ```bash
   # Use the seed-honeymoons-weddings.json file
   # Upload to Firestore using your preferred method
   ```

3. **Update Component**
   Replace the static import with Firestore query:
   ```typescript
   const [data, setData] = useState<RomanceLandingData | null>(null);
   
   useEffect(() => {
     const fetchData = async () => {
       const doc = await getDoc(doc(db, 'romanceLanding', 'honeymoons-weddings'));
       if (doc.exists()) {
         setData(doc.data() as RomanceLandingData);
       }
     };
     fetchData();
   }, []);
   ```

## Customization

### Images
Current implementation uses placeholder images from Unsplash. Replace with actual images:
```typescript
const images = {
  hero: 'your-hero-image-url',
  honeymoonBudget: 'your-budget-package-image',
  // ... etc
}
```

### Colors
Primary brand colors:
- Orange: `#ff9800` (accent)
- Blue: `#1e88e5` (primary)
- Customize in Tailwind classes

### Content
All content is stored in `seed-honeymoons-weddings.json`. Edit this file to update:
- Package details
- Pricing
- FAQs
- Testimonials
- Add-ons

## Deployment

1. **Build**
   ```bash
   npm run build
   ```

2. **Deploy to Firebase**
   ```bash
   firebase deploy --only hosting
   ```

3. **Verify**
   Visit: https://www.rechargetravels.com/romance/honeymoons-weddings

## Performance Tips

1. **Image Optimization**
   - Use WebP format with fallbacks
   - Implement proper srcset for responsive images
   - Compress all images to < 200KB

2. **Code Splitting**
   - Consider dynamic imports for heavy components
   - Lazy load the gallery section

3. **Caching**
   - Implement service worker for offline access
   - Use Firebase hosting caching headers

## Future Enhancements

1. **Real-time Availability**
   - Connect to booking system API
   - Show live pricing and availability

2. **Multi-language Support**
   - Add i18n for international couples
   - Support Sinhala/Tamil translations

3. **Enhanced Forms**
   - Multi-step form wizard
   - File uploads for requirements
   - Real-time quote calculator

4. **Social Proof**
   - Instagram feed integration
   - Video testimonials
   - Real wedding galleries

## Analytics Events

Track these key events:
- Package selection
- Form submissions
- FAQ interactions
- Gallery views
- Add-on interests

## Support

For updates or issues:
- Technical: Update via CMS or edit source files
- Content: Modify seed-honeymoons-weddings.json
- Styling: Edit Tailwind classes in component