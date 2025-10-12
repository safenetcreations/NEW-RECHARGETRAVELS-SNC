# Footer Display Issue - Troubleshooting Guide

## Issue Reported
Footer section not displaying on all pages.

## Recent Fixes Applied

### 1. Fixed AIFAQChatbot Rendering
**Issue**: AIFAQChatbot was always rendering, potentially causing performance issues
**Fix**: Changed to conditional rendering
```typescript
// Before:
<AIFAQChatbot />

// After:
{showChatbot && <AIFAQChatbot />}
```

### 2. Removed Undefined Component
**Issue**: `LeopardRunner` component was used but not defined
**Fix**: Removed the component reference from RechargeFooter.tsx

## How to Verify Footer is Working

### In Browser Dev Tools Console:
```javascript
// Check if footer element exists
document.querySelector('footer')

// Check if footer is visible
const footer = document.querySelector('footer');
console.log(footer ? 'Footer exists' : 'Footer missing');
console.log(window.getComputedStyle(footer).display);
```

### Check for React Errors:
1. Open browser developer tools (F12)
2. Go to Console tab
3. Look for red error messages
4. Check if footer component is mounting

## Common Issues and Solutions

### Issue 1: Footer Not Visible (but exists in DOM)
**Possible Causes:**
- CSS z-index issue
- Parent container overflow hidden
- Height/display CSS issue

**Solution:**
Check the parent containers:
```css
/* Make sure parent doesn't have these issues */
overflow: hidden; /* on parent */
height: 100vh; /* limiting container height */
position: fixed; /* that doesn't account for footer */
```

### Issue 2: Footer Not Rendering At All
**Possible Causes:**
- JavaScript error breaking React rendering
- Missing import
- Component crash

**Solution:**
1. Check browser console for errors
2. Verify Footer is imported in pages
3. Check RechargeFooter.tsx for syntax errors

### Issue 3: Footer Partially Rendered
**Possible Causes:**
- Framer Motion animation issues
- Component state errors
- Missing dependencies

**Solution:**
1. Check if framer-motion is installed: `npm list framer-motion`
2. Check Button component imports
3. Verify all icon imports from lucide-react

## Files Involved

### Main Footer Files:
1. `src/components/Footer.tsx` - Wrapper component
2. `src/components/ui/RechargeFooter.tsx` - Main footer implementation
3. `src/components/chat/AIFAQChatbot.tsx` - Chatbot (conditionally rendered)

### Footer Usage in Pages:
Footer should be imported and used like this:
```typescript
import Footer from '@/components/Footer'

// At the end of JSX:
return (
  <>
    <Header />
    {/* Page content */}
    <Footer />
  </>
)
```

## Quick Test

To test if footer is working, temporarily add this to any page:
```typescript
<div style={{
  background: 'red',
  color: 'white',
  padding: '20px',
  textAlign: 'center'
}}>
  FOOTER TEST - If you see this, footer area is rendering
</div>
<Footer />
```

## Dependencies to Check

Run these commands to verify dependencies:
```bash
npm list framer-motion
npm list lucide-react
npm list react-router-dom
```

## Browser Compatibility

The footer uses modern CSS features:
- CSS Grid
- Backdrop blur
- Custom gradients
- CSS variables

Test in:
- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)

## Next Steps if Issue Persists

1. Check browser console for specific errors
2. Take a screenshot showing the issue
3. Check if it's all pages or specific pages
4. Try incognito/private browsing (clears cache)
5. Clear browser cache and hard reload (Ctrl+Shift+R / Cmd+Shift+R)


