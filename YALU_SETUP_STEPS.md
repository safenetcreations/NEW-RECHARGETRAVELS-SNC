# 🚀 Yalu Setup - Step by Step Guide

## Step 1: Add Your API Keys

Add these lines to your `.env` file (NOT .env.example):

```bash
# Yalu AI Assistant Configuration
# OpenAI API (for GPT-4)
VITE_OPENAI_API_KEY=your_openai_api_key_here

# ElevenLabs (for voice synthesis)
VITE_ELEVENLABS_API_KEY=your_elevenlabs_api_key_here

# Pinecone (for vector database - long-term memory)
VITE_PINECONE_API_KEY=your_pinecone_api_key_here
VITE_PINECONE_ENVIRONMENT=your_pinecone_environment_here
VITE_PINECONE_INDEX_NAME=yalu-memory

# MCP Server URL (will run locally first)
VITE_MCP_SERVER_URL=ws://localhost:3000
```

## Step 2: Create Supabase Edge Functions

Create these new Supabase functions for Yalu:

### 1. Create `yalu-enhanced-ai` function:

```bash
cd /Users/nanthan/Desktop/Recharge\ by\ Claude-21-07-25/rechargetravels-sri-lankashalli-create-in-github
npx supabase functions new yalu-enhanced-ai
```

Then add this code to `supabase/functions/yalu-enhanced-ai/index.ts`:

```typescript
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { message, context, mcpTools } = await req.json()
    
    const openAIResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4-turbo-preview',
        messages: [
          {
            role: 'system',
            content: `You are Yalu, a warm and knowledgeable Sri Lankan travel assistant. 
Your personality traits:
- Warmth: ${context.personality?.warmth || 0.9}
- Enthusiasm: ${context.personality?.enthusiasm || 0.85}
- Cultural Pride: ${context.personality?.culturalPride || 0.95}

You have deep knowledge about Sri Lankan:
- Destinations: beaches, wildlife parks, cultural sites, hill country
- Culture: customs, festivals, food, traditions
- Practical info: weather, transport, costs, safety

Always be helpful, friendly, and provide specific actionable advice.
Use occasional Sinhala greetings like "Ayubowan" (hello) or "Istuti" (thank you).`
          },
          ...(context.conversationHistory || []),
          { role: 'user', content: message }
        ],
        temperature: 0.8,
        max_tokens: 500
      })
    })

    const aiData = await openAIResponse.json()
    const yaluResponse = aiData.choices[0].message.content

    // Generate contextual suggestions based on the message
    const suggestions = generateSuggestions(message, context.analysis?.intent)

    return new Response(
      JSON.stringify({
        message: yaluResponse,
        suggestions,
        emotion: detectEmotion(yaluResponse)
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})

function generateSuggestions(message: string, intent?: string) {
  const lowMessage = message.toLowerCase()
  
  if (lowMessage.includes('beach')) {
    return [
      "Best beaches for this season 🏖️",
      "Beach activities and water sports 🏄",
      "Beachfront accommodation options 🏨",
      "Hidden beach gems 💎"
    ]
  } else if (lowMessage.includes('wildlife') || lowMessage.includes('safari')) {
    return [
      "Best time to see elephants 🐘",
      "Compare Yala vs Udawalawe 🦌",
      "Book a safari tour 🚙",
      "Wildlife photography tips 📸"
    ]
  } else if (lowMessage.includes('culture') || lowMessage.includes('temple')) {
    return [
      "UNESCO World Heritage sites 🏛️",
      "Temple etiquette guide 🛕",
      "Cultural triangle tour 🗺️",
      "Local festivals calendar 🎉"
    ]
  }
  
  return [
    "Popular destinations 🌟",
    "Plan my itinerary 📅",
    "Budget calculator 💰",
    "Weather forecast ☀️"
  ]
}

function detectEmotion(text: string): string {
  if (text.includes('wonderful') || text.includes('amazing') || text.includes('excited')) {
    return 'excited'
  } else if (text.includes('understand') || text.includes('worry') || text.includes('sorry')) {
    return 'empathetic'
  } else if (text.includes('?') && text.length < 100) {
    return 'curious'
  }
  return 'happy'
}
```

### 2. Create `yalu-text-to-speech` function:

```bash
npx supabase functions new yalu-text-to-speech
```

Add to `supabase/functions/yalu-text-to-speech/index.ts`:

```typescript
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { text, voice, emotion } = await req.json()
    
    // For now, return a success response
    // In production, integrate with ElevenLabs API
    return new Response(
      JSON.stringify({
        audio: null, // Base64 audio would go here
        message: 'Text-to-speech ready for implementation'
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})
```

### 3. Deploy the functions:

```bash
npx supabase functions deploy yalu-enhanced-ai
npx supabase functions deploy yalu-text-to-speech
```

## Step 3: Update Supabase Function Secrets

Add your OpenAI API key to Supabase:

```bash
npx supabase secrets set OPENAI_API_KEY=your_openai_api_key_here
```

## Step 4: Add Yalu to Your App

Edit your main App component or wherever you want Yalu to appear:

```tsx
// In src/App.tsx or your main layout component
import { useState } from 'react'
import EnhancedYaluChatbot from './components/EnhancedYaluChatbot'

function App() {
  const [yaluOpen, setYaluOpen] = useState(false)
  
  return (
    <div>
      {/* Your existing app content */}
      
      {/* Yalu Floating Button */}
      <button
        onClick={() => setYaluOpen(true)}
        className="fixed bottom-6 right-6 w-16 h-16 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full shadow-lg flex items-center justify-center hover:scale-110 transition-transform z-40"
        aria-label="Open Yalu Travel Assistant"
      >
        <span className="text-3xl">🐆</span>
      </button>
      
      {/* Enhanced Yalu Chatbot */}
      <EnhancedYaluChatbot 
        isOpen={yaluOpen} 
        onClose={() => setYaluOpen(false)} 
      />
    </div>
  )
}
```

## Step 5: Test Yalu

1. Start your development server:
```bash
npm run dev
```

2. Click the leopard button (🐆) in the bottom right

3. Test these interactions:
   - "Hi Yalu!"
   - "I want to visit beaches"
   - "What's the best time to visit?"
   - "Plan a 7-day trip for me"

## Optional: Set Up Pinecone (for memory)

1. Go to [pinecone.io](https://www.pinecone.io/)
2. Create a free account
3. Create a new index:
   - Name: `yalu-memory`
   - Dimensions: `1536`
   - Metric: `cosine`
4. Get your API key and environment
5. Add them to your `.env` file

## Optional: Set Up ElevenLabs (for voice)

1. Go to [elevenlabs.io](https://elevenlabs.io/)
2. Create an account
3. Get your API key
4. Add it to your `.env` file

## 🎉 That's it!

Yalu should now be working with:
- ✅ Basic chat functionality
- ✅ Sri Lankan travel knowledge
- ✅ Contextual suggestions
- ✅ Personality and emotions
- 🔄 Voice (when you add ElevenLabs)
- 🔄 Memory (when you add Pinecone)

## Need Help?

If you run into issues:
1. Check browser console for errors
2. Verify API keys are correct
3. Make sure Supabase functions are deployed
4. Check network tab for API calls

Share your API keys (privately) if you need help with specific setup!