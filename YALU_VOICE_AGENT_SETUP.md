# 🐆 YALU Voice AI Agent - Setup Guide

## Overview
YALU is your Sri Lankan travel companion - a conversational voice AI agent powered by ElevenLabs that helps users discover and plan trips to Sri Lanka.

## Features
- **Voice Interaction**: Full voice input/output using ElevenLabs Text-to-Speech
- **Conversational AI**: Powered by GPT-4 with Sri Lanka travel expertise
- **Knowledge Base**: Comprehensive knowledge of destinations, experiences, and travel tips
- **Contextual Memory**: Remembers user preferences across conversations
- **Quick Actions**: One-tap access to common queries
- **Smart Suggestions**: Context-aware follow-up suggestions

## Environment Variables

Add these to your `.env` file:

```env
# ElevenLabs Configuration
VITE_ELEVENLABS_API_KEY=your_elevenlabs_api_key
VITE_ELEVENLABS_AGENT_ID=your_agent_id
VITE_ELEVENLABS_YALU_VOICE_ID=your_custom_voice_id

# OpenAI Configuration (for conversational AI)
VITE_OPENAI_API_KEY=your_openai_api_key
```

## Getting ElevenLabs API Key

1. Go to [ElevenLabs](https://elevenlabs.io/)
2. Sign up or log in
3. Navigate to Profile → API Keys
4. Copy your API key

## Creating a Custom Voice for YALU

1. In ElevenLabs, go to **Voice Lab**
2. Click **Add Generative or Cloned Voice**
3. Choose **Voice Design** for a custom voice
4. Configure settings:
   - Gender: Male/Female (your choice)
   - Age: Middle-aged
   - Accent: South Asian English
   - Style: Warm, friendly, professional
5. Save and copy the Voice ID

## Setting Up ElevenLabs Conversational AI

For a full voice agent experience:

1. Go to ElevenLabs → **Conversational AI**
2. Create a new agent
3. Upload knowledge base (use the content from `scripts/build-yalu-knowledge-base.ts`)
4. Configure system prompt (included in the script)
5. Copy the Agent ID to your env file

## Components

### YaluFloatingButton
The floating button that appears on every page.
- Location: `src/components/YaluFloatingButton.tsx`
- Features: Pulse animation, tooltip, voice indicator

### YaluVoiceAgent
The main chat interface with voice capabilities.
- Location: `src/components/YaluVoiceAgent.tsx`
- Features: Voice input, TTS output, suggestions, quick actions

### yaluElevenLabsService
Service for ElevenLabs API integration.
- Location: `src/services/yaluElevenLabsService.ts`
- Features: TTS, conversation management, context tracking

## Knowledge Base

The knowledge base is defined in:
- `scripts/build-yalu-knowledge-base.ts`

Contains:
- 11+ Destinations (Colombo, Kandy, Galle, etc.)
- 6+ Experience types (Safaris, Whale watching, etc.)
- Practical travel info (Visa, currency, transport)
- 10+ FAQs
- Tour packages (Honeymoon, Family, Adventure, etc.)

## YALU's Personality

**Name**: Yalu  
**Species**: Sri Lankan Leopard 🐆  
**Role**: Travel Companion & Concierge  

**Traits**:
- Warm and enthusiastic
- Deeply knowledgeable about Sri Lanka
- Uses local terms (Ayubowan, machan, istuti)
- Gives specific, actionable advice
- Remembers user preferences

**Voice Style**:
- Friendly professional tone
- Slight Sri Lankan charm
- Enthusiastic about showing Sri Lanka

## Usage

The YALU button automatically appears on all pages. Users can:

1. **Click the leopard button** to open chat
2. **Type messages** in the input field
3. **Use voice** by clicking the microphone
4. **Click quick actions** for common queries
5. **Click suggestions** to continue conversation

## WhatsApp Integration

YALU encourages users to connect with the human concierge team for bookings:
- WhatsApp: +94 777 721 999
- Email: concierge@rechargetravels.com

## Customization

### Change Voice
Update `VITE_ELEVENLABS_YALU_VOICE_ID` in your env file.

### Update Knowledge
Edit `scripts/build-yalu-knowledge-base.ts` and rebuild.

### Modify Personality
Edit the system prompt in `src/services/yaluElevenLabsService.ts`.

## Troubleshooting

### Voice Not Working
- Check ElevenLabs API key is valid
- Ensure browser supports Web Audio API
- Check console for errors

### Slow Responses
- OpenAI API may have latency
- Reduce `max_tokens` in service for shorter responses

### Recognition Not Working
- Use Chrome browser (best support)
- Check microphone permissions
- Ensure HTTPS (required for mic access)

## Future Enhancements

- [ ] Multi-language support (Sinhala, Tamil)
- [ ] Real-time booking integration
- [ ] Weather API integration
- [ ] Push notifications for deals
- [ ] Video calls with concierge

---

Made with ❤️ by Recharge Travels

