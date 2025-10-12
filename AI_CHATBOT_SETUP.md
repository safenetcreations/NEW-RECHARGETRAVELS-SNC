# AI FAQ Chatbot Setup Guide

## Overview
The Recharge Travels website now includes an AI-powered FAQ chatbot that uses Google's Gemini AI to answer questions about Sri Lankan travel. The chatbot has a comprehensive knowledge base covering visa requirements, transportation, attractions, safety, and Recharge Travels services.

## Setup Instructions

### 1. Get a Gemini API Key
1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy the generated API key

### 2. Configure the API Key
1. In the project root directory, create a `.env` file:
   ```bash
   cp .env.example .env
   ```

2. Open the `.env` file and add your Gemini API key:
   ```
   VITE_GEMINI_API_KEY=your_actual_api_key_here
   ```

3. Save the file

### 3. Rebuild and Deploy
1. Install dependencies (if not already done):
   ```bash
   npm install
   ```

2. Build the project:
   ```bash
   npm run build
   ```

3. Deploy to Firebase:
   ```bash
   firebase deploy --only hosting
   ```

## Testing the Chatbot

1. Visit your website
2. Look for the FAQ button in the footer or the floating chat button in the bottom-right corner
3. Click to open the chatbot
4. Try asking questions like:
   - "Can I smoke outside in Sri Lanka?"
   - "Do I need a visa?"
   - "What are the best beaches?"
   - "How do I get from the airport to Colombo?"

## Knowledge Base

The chatbot can answer questions about:
- Visa and entry requirements
- Transportation (buses, trains, tuk-tuks, taxis)
- Tourist attractions and activities
- Safety and health information
- Currency and money matters
- Weather and best times to visit
- Cultural customs and etiquette
- Smoking regulations
- Recharge Travels services
- And much more!

## Troubleshooting

### "AI service is not configured" Error
This means the Gemini API key is not set up correctly. Check:
1. The `.env` file exists in the project root
2. The API key is correctly added as `VITE_GEMINI_API_KEY=your_key`
3. You've rebuilt the project after adding the API key
4. The API key is valid and active

### Chatbot Not Appearing
1. Clear your browser cache
2. Try incognito/private browsing mode
3. Check the browser console for errors
4. Ensure JavaScript is enabled

### Styling Issues
If the chatbot appears with incorrect styling:
1. Hard refresh the page (Ctrl+Shift+R or Cmd+Shift+R)
2. Clear browser cache
3. Check for CSS conflicts in browser dev tools

## Customization

To add more FAQ content:
1. Edit `/src/components/chat/sriLankaKnowledgeBase.ts`
2. Add new Q&A pairs following the existing format
3. Rebuild and deploy

To modify the chatbot appearance:
1. Edit `/src/components/chat/AIFAQChatbot.tsx`
2. Adjust the Tailwind CSS classes
3. Rebuild and deploy