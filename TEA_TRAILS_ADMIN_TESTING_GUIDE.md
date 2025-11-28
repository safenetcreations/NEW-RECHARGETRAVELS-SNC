# Tea Trails Admin Control Testing Guide

## Overview
This guide provides comprehensive testing instructions for the newly implemented Tea Trails experience page with full admin control functionality.

## Prerequisites
1. Firebase project configured with Firestore
2. Admin panel accessible at `/admin`
3. Valid admin credentials (see ADMIN_CREDENTIALS.md)

## Testing Checklist

### 1. Admin Panel Access
- [ ] Navigate to `/admin` and login with admin credentials
- [ ] Verify admin sidebar shows "Experience Pages" menu item
- [ ] Click "Experience Pages" and verify ExperienceContentManager loads

### 2. Experience Content Manager Interface
- [ ] Verify page title "Experience Content Manager" displays
- [ ] Check that experience selector dropdown shows available experiences
- [ ] Verify "Tea Trails" is available in the dropdown
- [ ] Select "Tea Trails" and verify content loads

### 3. Content Editing - Hero Section
- [ ] Verify hero section fields are populated with existing data
- [ ] Edit hero title and verify changes save to Firestore
- [ ] Edit hero subtitle and verify changes persist
- [ ] Update hero background image URL and verify display
- [ ] Test hero CTA button text and link updates

### 4. Content Editing - Overview Section
- [ ] Edit overview title and verify changes
- [ ] Update overview description and check formatting
- [ ] Modify overview highlights and verify bullet points
- [ ] Test overview stats (duration, difficulty, elevation)

### 5. Content Editing - Itinerary Section
- [ ] Add new itinerary day with title and description
- [ ] Edit existing itinerary items
- [ ] Delete itinerary items and verify removal
- [ ] Test itinerary image uploads and ordering

### 6. Content Editing - Gallery Section
- [ ] Add new gallery images with captions
- [ ] Edit existing gallery image captions
- [ ] Reorder gallery images via drag and drop
- [ ] Delete gallery images and verify removal

### 7. Content Editing - Routes Section
- [ ] Add new route with name, difficulty, and elevation
- [ ] Edit route descriptions and highlights
- [ ] Update route coordinates for map display
- [ ] Test route image uploads

### 8. Content Editing - Accommodations Section
- [ ] Add new accommodation with name and description
- [ ] Edit accommodation details and amenities
- [ ] Update accommodation images
- [ ] Test accommodation location coordinates

### 9. Content Editing - Pricing Section
- [ ] Update pricing tiers (Standard, Premium, Luxury)
- [ ] Edit pricing descriptions and inclusions
- [ ] Modify pricing amounts and currencies
- [ ] Test pricing CTA buttons

### 10. Content Editing - FAQ Section
- [ ] Add new FAQ questions and answers
- [ ] Edit existing FAQ content
- [ ] Reorder FAQ items
- [ ] Delete FAQ items

### 11. Content Editing - SEO Section
- [ ] Update page title and meta description
- [ ] Edit Open Graph tags
- [ ] Modify structured data
- [ ] Test SEO preview functionality

### 12. Frontend Display Testing
- [ ] Navigate to `/experiences/tea-trails` on main site
- [ ] Verify all admin-edited content displays correctly
- [ ] Test responsive design on mobile/tablet/desktop
- [ ] Check loading states and error handling
- [ ] Verify maps display with correct routes
- [ ] Test gallery lightbox functionality
- [ ] Check itinerary accordion interactions
- [ ] Verify booking buttons link correctly

### 13. Data Persistence Testing
- [ ] Make changes in admin panel
- [ ] Refresh admin panel and verify changes persist
- [ ] Clear browser cache and verify data loads from Firestore
- [ ] Test with multiple browser tabs/windows
- [ ] Verify real-time updates if multiple admins editing

### 14. Error Handling Testing
- [ ] Test with invalid image URLs
- [ ] Verify validation for required fields
- [ ] Test network connectivity issues
- [ ] Check Firestore permission errors
- [ ] Verify graceful degradation when data unavailable

### 15. Performance Testing
- [ ] Test page load times with large galleries
- [ ] Verify smooth scrolling and animations
- [ ] Check memory usage with many images
- [ ] Test with slow network connections

## Automated Testing Commands

### Seed Test Data
```bash
npm run seed:tea-trails
```

### Run All Tests
```bash
npm test
```

### Performance Testing
```bash
npm run performance-check
```

## Manual Testing Scenarios

### Scenario 1: Content Creation Workflow
1. Login to admin panel
2. Select "Tea Trails" experience
3. Add new itinerary day
4. Add gallery images
5. Update pricing information
6. Save all changes
7. Verify on frontend

### Scenario 2: Content Editing Workflow
1. Login to admin panel
2. Select "Tea Trails" experience
3. Edit hero section content
4. Modify overview description
5. Update route information
6. Save changes
7. Verify updates on frontend

### Scenario 3: Media Management
1. Login to admin panel
2. Select "Tea Trails" experience
3. Upload new gallery images
4. Add captions to images
5. Reorder gallery items
6. Delete old images
7. Verify gallery display on frontend

### Scenario 4: SEO Optimization
1. Login to admin panel
2. Select "Tea Trails" experience
3. Update page title and meta description
4. Modify Open Graph tags
5. Add structured data
6. Test search engine previews

## Troubleshooting

### Common Issues

**Admin panel not loading:**
- Check Firebase configuration
- Verify admin credentials
- Check browser console for errors

**Changes not saving:**
- Verify Firestore permissions
- Check network connectivity
- Review browser console for validation errors

**Frontend not updating:**
- Clear browser cache
- Check Firestore data directly
- Verify component re-rendering

**Images not displaying:**
- Verify image URLs are accessible
- Check CORS settings
- Test with different image formats

## Success Criteria

✅ All admin panel sections load without errors
✅ Content changes save to Firestore successfully
✅ Frontend displays updated content correctly
✅ All interactive elements function properly
✅ Responsive design works on all devices
✅ Performance meets acceptable thresholds
✅ Error handling works gracefully

## Next Steps

After completing testing:
1. Deploy to production
2. Monitor performance and user feedback
3. Plan similar admin controls for other experience pages
4. Consider adding content versioning and rollback features