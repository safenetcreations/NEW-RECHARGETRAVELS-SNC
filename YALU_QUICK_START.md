# 🚀 Yalu AI Assistant - Quick Start Guide

## 📋 Implementation Steps

### Step 1: Set Up MCP Server (Backend)

```bash
# Create MCP server directory
mkdir yalu-mcp-server
cd yalu-mcp-server

# Initialize project
npm init -y

# Install dependencies
npm install @modelcontextprotocol/sdk typescript @types/node
npm install @pinecone-database/pinecone ioredis openai
npm install @supabase/supabase-js dotenv

# Install dev dependencies
npm install -D tsx nodemon
```

### Step 2: Create MCP Server Configuration

Create `package.json` scripts:
```json
{
  "scripts": {
    "start": "tsx src/index.ts",
    "dev": "nodemon --exec tsx src/index.ts",
    "build": "tsc"
  }
}
```

Create `.env`:
```env
# MCP Server
PORT=3000

# OpenAI
OPENAI_API_KEY=your_openai_key

# Pinecone Vector DB
PINECONE_API_KEY=your_pinecone_key
PINECONE_ENVIRONMENT=your_environment

# Redis
REDIS_URL=redis://localhost:6379

# Supabase
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Step 3: Implement Basic MCP Server

Create `src/index.ts`:
```typescript
import { YaluMCPServer } from './server'

const server = new YaluMCPServer()
server.start().catch(console.error)
```

Copy the MCP server implementation from `YALU_MCP_IMPLEMENTATION.md`.

### Step 4: Set Up Supabase Functions

Create these edge functions in your Supabase project:

#### `yalu-enhanced-ai`
```typescript
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { Configuration, OpenAIApi } from 'https://esm.sh/openai@3.2.1'

serve(async (req) => {
  const { message, context, mcpTools } = await req.json()
  
  // Initialize OpenAI
  const openai = new OpenAIApi(new Configuration({
    apiKey: Deno.env.get('OPENAI_API_KEY')
  }))
  
  // Create system prompt with Yalu's personality
  const systemPrompt = `You are Yalu, a warm and knowledgeable Sri Lankan travel assistant. 
Your personality traits:
- Warmth: ${context.personality.warmth}
- Enthusiasm: ${context.personality.enthusiasm}
- Cultural Pride: ${context.personality.culturalPride}

You have access to the user's travel preferences and history:
${JSON.stringify(context.userMemory)}

Respond in a friendly, helpful manner with local insights. Use Sinhala greetings occasionally.
Always provide specific, actionable recommendations.`

  const response = await openai.createChatCompletion({
    model: 'gpt-4-turbo-preview',
    messages: [
      { role: 'system', content: systemPrompt },
      ...context.conversationHistory,
      { role: 'user', content: message }
    ],
    temperature: 0.8,
    max_tokens: 500
  })
  
  const yaluResponse = response.data.choices[0].message.content
  
  // Generate contextual suggestions
  const suggestions = generateSuggestions(context.analysis.intent)
  
  return new Response(JSON.stringify({
    message: yaluResponse,
    suggestions,
    emotion: detectEmotion(yaluResponse)
  }), {
    headers: { 'Content-Type': 'application/json' }
  })
})
```

#### `yalu-text-to-speech`
```typescript
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

serve(async (req) => {
  const { text, rate, pitch, emotion } = await req.json()
  
  // Use ElevenLabs API
  const response = await fetch('https://api.elevenlabs.io/v1/text-to-speech/yalu-voice-id', {
    method: 'POST',
    headers: {
      'Accept': 'audio/mpeg',
      'xi-api-key': Deno.env.get('ELEVENLABS_API_KEY'),
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      text,
      model_id: 'eleven_multilingual_v2',
      voice_settings: {
        stability: 0.75,
        similarity_boost: 0.85,
        style: emotion === 'excited' ? 0.8 : 0.5,
        use_speaker_boost: true
      }
    })
  })
  
  const audioBuffer = await response.arrayBuffer()
  const base64Audio = btoa(String.fromCharCode(...new Uint8Array(audioBuffer)))
  
  return new Response(JSON.stringify({
    audio: base64Audio
  }), {
    headers: { 'Content-Type': 'application/json' }
  })
})
```

### Step 5: Integrate with Frontend

Update your main app to use Enhanced Yalu:

```tsx
// src/App.tsx
import EnhancedYaluChatbot from './components/EnhancedYaluChatbot'

function App() {
  const [yaluOpen, setYaluOpen] = useState(false)
  
  return (
    <div>
      {/* Your existing app content */}
      
      {/* Yalu Floating Button */}
      <button
        onClick={() => setYaluOpen(true)}
        className="fixed bottom-6 right-6 w-16 h-16 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full shadow-lg flex items-center justify-center hover:scale-110 transition-transform"
      >
        <span className="text-2xl">🐆</span>
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

### Step 6: Configure Environment Variables

Add to your `.env` file:
```env
# Yalu Configuration
VITE_MCP_SERVER_URL=ws://localhost:3000
VITE_ELEVENLABS_API_KEY=your_elevenlabs_key
VITE_OPENAI_API_KEY=your_openai_key
```

### Step 7: Create Voice for Yalu

1. Sign up for ElevenLabs
2. Create a new voice with Sri Lankan English accent
3. Train it with sample recordings
4. Get the voice ID and update in your code

### Step 8: Initialize Vector Database

```bash
# Create Pinecone index
curl -X POST https://controller.your-environment.pinecone.io/databases \
  -H "Api-Key: YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "yalu-memory",
    "dimension": 1536,
    "metric": "cosine"
  }'
```

### Step 9: Deploy

#### Deploy MCP Server:
```bash
# Using Railway
railway init
railway add
railway up

# Or using Heroku
heroku create yalu-mcp-server
git push heroku main
```

#### Deploy Supabase Functions:
```bash
supabase functions deploy yalu-enhanced-ai
supabase functions deploy yalu-text-to-speech
supabase functions deploy yalu-speech-to-text
```

### Step 10: Test Yalu

1. Open your app
2. Click the Yalu button (🐆)
3. Test these interactions:
   - "Hi Yalu!"
   - "I want to visit beaches"
   - "Plan a 7-day itinerary"
   - "Book a hotel in Galle"
   - Use voice input

## 🎯 Quick Features to Test

### 1. Memory System
```
User: "My name is John"
Yalu: "Nice to meet you, John! I'll remember that."
[Close and reopen]
Yalu: "Welcome back, John!"
```

### 2. Learning System
```
User: "I prefer budget travel"
Yalu: [Recommends budget options in future conversations]
```

### 3. Personality Adaptation
```
User: "I'm worried about safety"
Yalu: [Becomes more empathetic and reassuring]
```

### 4. Voice Commands
- Click microphone
- Say: "Show me wildlife tours"
- Yalu responds with voice

## 🚨 Common Issues & Solutions

### Issue: MCP Server Connection Failed
```bash
# Check if server is running
curl http://localhost:3000/health

# Check WebSocket connection
wscat -c ws://localhost:3000
```

### Issue: Voice Not Working
1. Check microphone permissions
2. Verify ElevenLabs API key
3. Test with console.log in voice functions

### Issue: Memory Not Persisting
1. Check Pinecone connection
2. Verify user ID is being passed
3. Check Redis connection

## 📊 Monitoring Yalu

### Track Performance:
```typescript
// Add to your code
window.yaluAnalytics = {
  conversations: 0,
  avgResponseTime: 0,
  userSatisfaction: 0,
  popularTopics: []
}
```

### View Logs:
```bash
# MCP Server logs
pm2 logs yalu-mcp-server

# Supabase function logs
supabase functions logs yalu-enhanced-ai
```

## 🎉 Success Checklist

- [ ] MCP server running and connected
- [ ] Voice input/output working
- [ ] Memory persisting between sessions
- [ ] Personality adapting to conversation
- [ ] Booking integration functional
- [ ] Suggestions contextually relevant
- [ ] Learning from user feedback

## 🚀 Next Steps

1. **Train Yalu's Knowledge**
   - Add more Sri Lankan destinations
   - Update seasonal information
   - Add local events and festivals

2. **Enhance Personality**
   - Add more emotional states
   - Implement humor appropriately
   - Add cultural stories

3. **Expand Capabilities**
   - Multi-language support (Sinhala, Tamil)
   - Image recognition for landmarks
   - Real-time availability checking

4. **Analytics Dashboard**
   - Track user satisfaction
   - Monitor popular queries
   - Identify improvement areas

---

**Need Help?** Check the detailed documentation in:
- `YALU_AI_ASSISTANT_PLAN.md` - Complete vision and features
- `YALU_MCP_IMPLEMENTATION.md` - Technical implementation
- `YALU_KNOWLEDGE_BASE.md` - Sri Lankan travel knowledge

Happy travels with Yalu! 🐆🇱🇰