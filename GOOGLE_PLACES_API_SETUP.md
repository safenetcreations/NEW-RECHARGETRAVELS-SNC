# Google Places API Setup Guide

## 🚨 Current Status
The Google Places API is integrated but may not be working due to configuration issues. This guide will help you fix it.

## 📋 Prerequisites

1. Google Cloud Platform account
2. Billing enabled on your GCP project
3. Access to Firebase/Supabase dashboard

## 🔧 Setup Steps

### 1. Enable Google Places API

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Select your project or create a new one
3. Navigate to **APIs & Services** → **Library**
4. Search for **"Places API"**
5. Click on **Places API** and then **ENABLE**
6. Also enable **Maps JavaScript API** if not already enabled

### 2. Configure API Key

#### In Google Cloud Console:
1. Go to **APIs & Services** → **Credentials**
2. Find your API key or create a new one
3. Click on the API key to edit it

#### API Key Restrictions:
1. **Application restrictions**:
   - For development: `None` (temporary)
   - For production: `HTTP referrers`
   - Add these referrers:
     ```
     https://www.rechargetravels.com/*
     https://recharge-travels-73e76.web.app/*
     https://recharge-travels-admin.web.app/*
     http://localhost:5173/*
     http://localhost:5174/*
     ```

2. **API restrictions**:
   - Select "Restrict key"
   - Choose these APIs:
     - Maps JavaScript API
     - Places API
     - Geocoding API (optional)

### 3. Update Environment Variables

#### Local Development (.env):
```bash
VITE_GOOGLE_MAPS_API_KEY=your_api_key_here
```

#### Supabase Edge Functions:
1. Go to your Supabase dashboard
2. Navigate to **Edge Functions**
3. Find `google-places-api-handler`
4. Add environment variable:
   ```
   GOOGLE_MAPS_API_KEY=your_api_key_here
   ```

#### Firebase (for production):
Already configured in GitHub Secrets as `VITE_GOOGLE_MAPS_API_KEY`

### 4. Test the Implementation

1. **Check Browser Console**:
   - Open the transfer booking form
   - Open browser DevTools (F12)
   - Look for console messages:
     - ✅ "Google Places API working"
     - ❌ "REQUEST_DENIED" or errors

2. **Common Issues**:
   - **REQUEST_DENIED**: API key restrictions are too strict
   - **This API project is not authorized**: Places API not enabled
   - **You have exceeded your daily request quota**: Billing not enabled

### 5. Fallback Mechanism

The current implementation has multiple fallbacks:

1. **Primary**: Google Maps JavaScript API (client-side)
2. **Secondary**: Supabase Edge Function (server-side proxy)
3. **Tertiary**: Local Sri Lankan locations list

## 🔍 Debugging Steps

### 1. Verify API Key in Browser
```javascript
// In browser console:
console.log(import.meta.env.VITE_GOOGLE_MAPS_API_KEY)
```

### 2. Test Places API Directly
```bash
curl "https://maps.googleapis.com/maps/api/place/autocomplete/json?input=Colombo&key=YOUR_API_KEY&components=country:lk"
```

### 3. Check Supabase Function Logs
1. Go to Supabase Dashboard
2. Navigate to Edge Functions
3. Check logs for `google-places-api-handler`

## 📱 Enhanced Features

The enhanced location input includes:
- Real-time Google Places autocomplete
- Sri Lankan location bias
- Popular locations dropdown
- Visual feedback for API status
- Graceful fallback to local suggestions
- Session token optimization

## 🚀 Deployment

After fixing the API configuration:

```bash
# Deploy to production
npm run deploy:all
```

## 📞 Support

If issues persist:
1. Check Google Cloud Console for API errors
2. Verify billing is enabled
3. Ensure all required APIs are enabled
4. Check browser console for detailed errors

---

**Note**: The Google Places API requires billing to be enabled on your Google Cloud project, even though it includes a generous free tier ($200/month credit).