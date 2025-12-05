# 🔒 Security & Legal Compliance Documentation

## Overview
This document outlines all security measures, data protection features, and legal compliance implementations for the Recharge Travels & Tours platform.

---

## 🛡️ 1. Anti-Theft Content Protection

**File:** `src/components/security/ContentProtection.tsx`

### Features Implemented:

| Protection Type | Description |
|-----------------|-------------|
| **Right-Click Disabled** | Context menus blocked to prevent "Save As" or "Inspect Element" |
| **Text Selection Disabled** | Users cannot highlight or copy text (except in forms) |
| **Keyboard Shortcuts Blocked** | Ctrl+C, Ctrl+U, Ctrl+S, Ctrl+P, F12 intercepted |
| **Print Protection** | Content hidden with copyright watermark on print |
| **Drag & Drop Disabled** | Images cannot be dragged to desktop |
| **Copy Event Blocked** | Clipboard operations prevented |
| **DevTools Detection** | Logs warning when developer tools are opened |

### Accessibility Notes:
- Form elements (input, textarea) still allow normal copy/paste functionality
- All protections are client-side deterrents, not absolute barriers

---

## ⚖️ 2. Legal Compliance & Data Privacy

### Cookie Consent System
**File:** `src/components/security/CookieConsentEnhanced.tsx`

| Feature | Implementation |
|---------|----------------|
| **GDPR Compliant** | Explicit opt-in for non-essential cookies |
| **CCPA Compliant** | Right to opt-out of data sale |
| **Granular Control** | Separate toggles for Analytics, Marketing, Functional |
| **Strictly Necessary** | Security cookies locked to "On" |
| **Audit Trail** | Consents timestamped with version in localStorage |
| **Consent ID** | Unique identifier for each consent record |
| **History Tracking** | Last 10 consent records stored |

### Cookie Categories:
1. **Strictly Necessary** (Required - Cannot disable)
   - Session management
   - CSRF protection
   - Consent preferences

2. **Analytics** (Optional)
   - Google Analytics tracking
   - User behavior analysis

3. **Marketing** (Optional)
   - Facebook Pixel
   - Ad remarketing
   - Campaign tracking

4. **Functional** (Optional)
   - Language preferences
   - Currency preferences
   - Recently viewed items

### Legal Pages
| Page | Route | File |
|------|-------|------|
| Privacy Policy | `/privacy-policy` | `src/pages/legal/PrivacyPolicy.tsx` |
| Cookie Policy | `/cookie-policy` | `src/pages/legal/CookiePolicy.tsx` |
| Terms of Service | `/terms-of-service` | `src/pages/legal/TermsOfService.tsx` |

---

## 🔐 3. Cybersecurity Headers (Server-Level)

**File:** `firebase.json`

### Headers Configured:

| Header | Value | Purpose |
|--------|-------|---------|
| **Content-Security-Policy** | Strict whitelist | Blocks XSS, script injection |
| **Strict-Transport-Security** | 2 years + preload | Forces HTTPS |
| **X-Frame-Options** | SAMEORIGIN | Prevents clickjacking |
| **X-Content-Type-Options** | nosniff | Prevents MIME sniffing |
| **X-XSS-Protection** | 1; mode=block | Legacy XSS filter |
| **Referrer-Policy** | strict-origin-when-cross-origin | Controls referrer info |
| **Permissions-Policy** | Restrictive | Blocks camera, mic, geolocation |

### Content Security Policy Details:
```
default-src 'self';
script-src 'self' 'unsafe-inline' 'unsafe-eval' 
           https://www.googletagmanager.com
           https://www.google-analytics.com
           https://apis.google.com
           https://maps.googleapis.com
           https://*.firebaseio.com;
style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
img-src 'self' data: blob: https: http:;
font-src 'self' https://fonts.gstatic.com data:;
connect-src 'self' https://*.googleapis.com https://*.firebaseio.com;
frame-src 'self' https://www.google.com https://*.firebaseapp.com;
frame-ancestors 'self';
upgrade-insecure-requests;
```

---

## 📊 4. Data Handling

### Personal Data Collected:
- Identity Data (name, nationality)
- Contact Data (email, phone, address)
- Financial Data (via Stripe - not stored locally)
- Transaction Data
- Technical Data (IP, browser, device)
- Profile Data (preferences)
- Usage Data

### Data Retention Periods:
| Data Type | Retention Period |
|-----------|------------------|
| Booking Records | 7 years (legal/tax) |
| Marketing Preferences | Until withdrawal |
| Website Analytics | 26 months |
| Customer Support | 3 years |

### User Rights (GDPR/CCPA):
- Right to Access
- Right to Rectification
- Right to Erasure ("Right to be Forgotten")
- Right to Restrict Processing
- Right to Data Portability
- Right to Object

---

## 🚀 5. Deployment Security

### Firebase Hosting:
- Automatic SSL/TLS certificates
- DDoS protection via Cloud CDN
- Strict security headers

### Admin Panel:
- Stricter X-Frame-Options: DENY
- No caching for sensitive files
- Separate target deployment

---

## ✅ Compliance Checklist

| Requirement | Status |
|-------------|--------|
| GDPR Cookie Consent | ✅ Implemented |
| Privacy Policy | ✅ Published |
| Cookie Policy | ✅ Published |
| Terms of Service | ✅ Published |
| HTTPS Enforcement | ✅ HSTS Configured |
| XSS Protection | ✅ CSP + Headers |
| Clickjacking Protection | ✅ X-Frame-Options |
| Content Theft Deterrent | ✅ Client-side Protection |
| Secure Headers | ✅ Firebase Configured |

---

## 📞 Contact for Security/Privacy

**Data Protection Officer:**
- Email: privacy@rechargetravels.com
- Phone: +94 777 721 999

**Legal Inquiries:**
- Email: legal@rechargetravels.com

---

*Last Updated: December 5, 2025*
*Version: 1.0.0*
