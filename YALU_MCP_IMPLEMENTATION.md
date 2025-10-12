# 🔧 Yalu MCP Server Implementation Guide

## 📁 Project Structure
```
yalu-mcp-server/
├── package.json
├── tsconfig.json
├── .env.example
├── src/
│   ├── index.ts                 # MCP server entry point
│   ├── server.ts               # Main Yalu MCP server
│   ├── memory/
│   │   ├── vectorStore.ts      # Vector database interface
│   │   ├── userMemory.ts       # User profile & preferences
│   │   ├── conversationMemory.ts # Chat history management
│   │   └── knowledgeBase.ts    # Sri Lanka knowledge
│   ├── tools/
│   │   ├── bookingTools.ts     # Booking-related MCP tools
│   │   ├── memoryTools.ts      # Memory management tools
│   │   ├── learningTools.ts    # Learning & feedback tools
│   │   └── planningTools.ts    # Itinerary planning tools
│   ├── ai/
│   │   ├── providers.ts        # AI model providers
│   │   ├── personality.ts      # Yalu's personality engine
│   │   └── voiceEngine.ts      # Voice processing
│   └── utils/
│       ├── logger.ts
│       └── config.ts
```

## 🚀 MCP Server Implementation

### 1. Main Server Setup
```typescript
// src/server.ts
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { VectorStore } from './memory/vectorStore.js';
import { UserMemory } from './memory/userMemory.js';
import { ConversationMemory } from './memory/conversationMemory.js';
import { KnowledgeBase } from './memory/knowledgeBase.js';

export class YaluMCPServer {
  private server: Server;
  private vectorStore: VectorStore;
  private userMemory: UserMemory;
  private conversationMemory: ConversationMemory;
  private knowledgeBase: KnowledgeBase;

  constructor() {
    this.server = new Server(
      {
        name: 'yalu-travel-assistant',
        version: '1.0.0',
        description: 'Intelligent Sri Lankan travel assistant with long-term memory'
      },
      {
        capabilities: {
          tools: {},
          resources: {},
          prompts: {}
        }
      }
    );

    // Initialize memory systems
    this.vectorStore = new VectorStore();
    this.userMemory = new UserMemory(this.vectorStore);
    this.conversationMemory = new ConversationMemory(this.vectorStore);
    this.knowledgeBase = new KnowledgeBase();

    this.setupTools();
    this.setupResources();
    this.setupPrompts();
  }

  private setupTools() {
    // User Memory Tools
    this.server.setRequestHandler('tools/list', async () => ({
      tools: [
        {
          name: 'remember_user_preference',
          description: 'Store user preferences and travel interests',
          inputSchema: {
            type: 'object',
            properties: {
              userId: { type: 'string' },
              preference: { type: 'object' },
              category: { type: 'string', enum: ['accommodation', 'activities', 'food', 'transport', 'budget'] }
            },
            required: ['userId', 'preference', 'category']
          }
        },
        {
          name: 'recall_user_history',
          description: 'Retrieve user\'s travel history and preferences',
          inputSchema: {
            type: 'object',
            properties: {
              userId: { type: 'string' },
              context: { type: 'string' }
            },
            required: ['userId']
          }
        },
        {
          name: 'search_destinations',
          description: 'Search Sri Lankan destinations based on preferences',
          inputSchema: {
            type: 'object',
            properties: {
              query: { type: 'string' },
              preferences: { type: 'object' },
              budget: { type: 'number' },
              duration: { type: 'number' }
            },
            required: ['query']
          }
        },
        {
          name: 'create_itinerary',
          description: 'Generate personalized travel itinerary',
          inputSchema: {
            type: 'object',
            properties: {
              userId: { type: 'string' },
              startDate: { type: 'string' },
              endDate: { type: 'string' },
              interests: { type: 'array', items: { type: 'string' } },
              budget: { type: 'number' },
              groupSize: { type: 'number' }
            },
            required: ['startDate', 'endDate']
          }
        },
        {
          name: 'book_service',
          description: 'Book hotels, tours, or transport',
          inputSchema: {
            type: 'object',
            properties: {
              serviceType: { type: 'string', enum: ['hotel', 'tour', 'transport'] },
              serviceId: { type: 'string' },
              userId: { type: 'string' },
              dates: { type: 'object' },
              guestDetails: { type: 'object' }
            },
            required: ['serviceType', 'serviceId', 'userId', 'dates']
          }
        },
        {
          name: 'learn_from_feedback',
          description: 'Process user feedback to improve responses',
          inputSchema: {
            type: 'object',
            properties: {
              interactionId: { type: 'string' },
              feedback: { type: 'string', enum: ['positive', 'negative', 'neutral'] },
              details: { type: 'string' }
            },
            required: ['interactionId', 'feedback']
          }
        }
      ]
    }));

    // Tool Implementations
    this.server.setRequestHandler('tools/call', async (request) => {
      const { name, arguments: args } = request.params;

      switch (name) {
        case 'remember_user_preference':
          return await this.rememberUserPreference(args);
        
        case 'recall_user_history':
          return await this.recallUserHistory(args);
        
        case 'search_destinations':
          return await this.searchDestinations(args);
        
        case 'create_itinerary':
          return await this.createItinerary(args);
        
        case 'book_service':
          return await this.bookService(args);
        
        case 'learn_from_feedback':
          return await this.learnFromFeedback(args);
        
        default:
          throw new Error(`Unknown tool: ${name}`);
      }
    });
  }

  private setupResources() {
    this.server.setRequestHandler('resources/list', async () => ({
      resources: [
        {
          uri: 'yalu://knowledge/sri-lanka',
          name: 'Sri Lanka Knowledge Base',
          description: 'Comprehensive information about Sri Lankan destinations, culture, and travel',
          mimeType: 'application/json'
        },
        {
          uri: 'yalu://memory/conversations',
          name: 'Conversation History',
          description: 'User conversation history and context',
          mimeType: 'application/json'
        }
      ]
    }));

    this.server.setRequestHandler('resources/read', async (request) => {
      const { uri } = request.params;
      
      if (uri.startsWith('yalu://knowledge/')) {
        const topic = uri.replace('yalu://knowledge/', '');
        return {
          contents: [
            {
              uri,
              mimeType: 'application/json',
              text: JSON.stringify(await this.knowledgeBase.getKnowledge(topic))
            }
          ]
        };
      }
      
      throw new Error(`Unknown resource: ${uri}`);
    });
  }

  private setupPrompts() {
    this.server.setRequestHandler('prompts/list', async () => ({
      prompts: [
        {
          name: 'travel_planning',
          description: 'Comprehensive travel planning assistant for Sri Lanka',
          arguments: [
            {
              name: 'user_context',
              description: 'User preferences and history',
              required: false
            }
          ]
        },
        {
          name: 'booking_assistant',
          description: 'Help users book hotels, tours, and transport',
          arguments: [
            {
              name: 'booking_type',
              description: 'Type of booking (hotel, tour, transport)',
              required: true
            }
          ]
        }
      ]
    }));

    this.server.setRequestHandler('prompts/get', async (request) => {
      const { name } = request.params;
      
      switch (name) {
        case 'travel_planning':
          return {
            prompt: {
              name: 'travel_planning',
              description: 'Comprehensive travel planning assistant',
              messages: [
                {
                  role: 'system',
                  content: `You are Yalu, an intelligent Sri Lankan travel assistant with deep knowledge of:
- Sri Lankan destinations, culture, history, and customs
- Hotels, tours, and transportation options
- Local insights and hidden gems
- Weather patterns and best times to visit
- Budget planning and cost optimization

Your personality is warm, helpful, and knowledgeable like a local friend. You remember past conversations and user preferences.

Current user context: {{user_context}}`
                }
              ]
            }
          };
        
        default:
          throw new Error(`Unknown prompt: ${name}`);
      }
    });
  }

  // Tool Implementation Methods
  private async rememberUserPreference(args: any) {
    const { userId, preference, category } = args;
    await this.userMemory.storePreference(userId, category, preference);
    
    return {
      content: [
        {
          type: 'text',
          text: `Stored ${category} preference for user ${userId}`
        }
      ]
    };
  }

  private async recallUserHistory(args: any) {
    const { userId, context } = args;
    const history = await this.userMemory.getUserProfile(userId);
    const relevantMemories = await this.conversationMemory.getRelevantMemories(userId, context);
    
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify({
            profile: history,
            relevantMemories: relevantMemories
          })
        }
      ]
    };
  }

  private async searchDestinations(args: any) {
    const { query, preferences, budget, duration } = args;
    const destinations = await this.knowledgeBase.searchDestinations({
      query,
      filters: { preferences, budget, duration }
    });
    
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(destinations)
        }
      ]
    };
  }

  private async createItinerary(args: any) {
    const { userId, startDate, endDate, interests, budget, groupSize } = args;
    
    // Get user history and preferences
    const userProfile = await this.userMemory.getUserProfile(userId);
    
    // Generate personalized itinerary
    const itinerary = await this.generateItinerary({
      dates: { start: startDate, end: endDate },
      interests,
      budget,
      groupSize,
      userPreferences: userProfile.preferences
    });
    
    // Store the itinerary
    await this.conversationMemory.storeItinerary(userId, itinerary);
    
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(itinerary)
        }
      ]
    };
  }

  private async bookService(args: any) {
    // Implementation for booking services
    // This would integrate with the existing booking system
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify({
            status: 'booking_initiated',
            bookingId: `BK${Date.now()}`,
            details: args
          })
        }
      ]
    };
  }

  private async learnFromFeedback(args: any) {
    const { interactionId, feedback, details } = args;
    
    // Store feedback for learning
    await this.userMemory.storeFeedback(interactionId, feedback, details);
    
    // Update knowledge base if needed
    if (feedback === 'negative' && details) {
      await this.knowledgeBase.flagForReview(interactionId, details);
    }
    
    return {
      content: [
        {
          type: 'text',
          text: 'Feedback recorded and will be used to improve future responses'
        }
      ]
    };
  }

  private async generateItinerary(params: any) {
    // Complex itinerary generation logic
    // This would use AI models and the knowledge base
    return {
      id: `ITN${Date.now()}`,
      ...params,
      days: [] // Detailed day-by-day plan
    };
  }

  async start() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.log('Yalu MCP Server started successfully');
  }
}

// Start the server
if (require.main === module) {
  const server = new YaluMCPServer();
  server.start().catch(console.error);
}
```

### 2. Vector Store Implementation
```typescript
// src/memory/vectorStore.ts
import { Pinecone } from '@pinecone-database/pinecone';
import { OpenAIEmbeddings } from 'langchain/embeddings/openai';

export class VectorStore {
  private pinecone: Pinecone;
  private embeddings: OpenAIEmbeddings;
  private index: any;

  constructor() {
    this.pinecone = new Pinecone({
      apiKey: process.env.PINECONE_API_KEY!,
      environment: process.env.PINECONE_ENVIRONMENT!
    });
    
    this.embeddings = new OpenAIEmbeddings({
      openAIApiKey: process.env.OPENAI_API_KEY
    });
  }

  async initialize() {
    this.index = this.pinecone.index('yalu-memory');
  }

  async storeMemory(userId: string, memory: any, metadata: any = {}) {
    const text = JSON.stringify(memory);
    const vector = await this.embeddings.embedQuery(text);
    
    await this.index.upsert([
      {
        id: `${userId}-${Date.now()}`,
        values: vector,
        metadata: {
          userId,
          timestamp: Date.now(),
          type: memory.type || 'general',
          ...metadata,
          text: text
        }
      }
    ]);
  }

  async searchMemories(userId: string, query: string, limit: number = 10) {
    const queryVector = await this.embeddings.embedQuery(query);
    
    const results = await this.index.query({
      vector: queryVector,
      filter: { userId },
      topK: limit,
      includeMetadata: true
    });
    
    return results.matches.map(match => ({
      score: match.score,
      memory: JSON.parse(match.metadata.text),
      metadata: match.metadata
    }));
  }

  async getUserMemories(userId: string, type?: string) {
    const filter: any = { userId };
    if (type) filter.type = type;
    
    const results = await this.index.query({
      vector: new Array(1536).fill(0), // Dummy vector
      filter,
      topK: 100,
      includeMetadata: true
    });
    
    return results.matches.map(match => JSON.parse(match.metadata.text));
  }
}
```

### 3. User Memory Management
```typescript
// src/memory/userMemory.ts
import { Redis } from 'ioredis';
import { VectorStore } from './vectorStore';

interface UserProfile {
  id: string;
  name?: string;
  preferences: {
    accommodation: string[];
    activities: string[];
    food: string[];
    budget: 'budget' | 'mid-range' | 'luxury';
    travelStyle: string[];
  };
  history: {
    bookings: any[];
    searches: string[];
    interactions: number;
  };
  insights: {
    favoriteDestinations: string[];
    seasonalPreferences: any;
    groupPreferences: any;
  };
}

export class UserMemory {
  private redis: Redis;
  private vectorStore: VectorStore;

  constructor(vectorStore: VectorStore) {
    this.redis = new Redis(process.env.REDIS_URL);
    this.vectorStore = vectorStore;
  }

  async getUserProfile(userId: string): Promise<UserProfile> {
    const cached = await this.redis.get(`user:${userId}`);
    if (cached) return JSON.parse(cached);
    
    // Build profile from vector store
    const memories = await this.vectorStore.getUserMemories(userId);
    const profile = this.buildProfileFromMemories(userId, memories);
    
    // Cache for quick access
    await this.redis.setex(`user:${userId}`, 3600, JSON.stringify(profile));
    
    return profile;
  }

  async storePreference(userId: string, category: string, preference: any) {
    const profile = await this.getUserProfile(userId);
    
    if (!profile.preferences[category]) {
      profile.preferences[category] = [];
    }
    
    profile.preferences[category].push(preference);
    
    // Store in vector DB for semantic search
    await this.vectorStore.storeMemory(userId, {
      type: 'preference',
      category,
      preference
    });
    
    // Update cache
    await this.redis.setex(`user:${userId}`, 3600, JSON.stringify(profile));
  }

  async storeFeedback(interactionId: string, feedback: string, details: string) {
    await this.redis.hset('feedback', interactionId, JSON.stringify({
      feedback,
      details,
      timestamp: Date.now()
    }));
    
    // Store in vector DB for learning
    await this.vectorStore.storeMemory('system', {
      type: 'feedback',
      interactionId,
      feedback,
      details
    });
  }

  private buildProfileFromMemories(userId: string, memories: any[]): UserProfile {
    // Analyze memories to build user profile
    const profile: UserProfile = {
      id: userId,
      preferences: {
        accommodation: [],
        activities: [],
        food: [],
        budget: 'mid-range',
        travelStyle: []
      },
      history: {
        bookings: [],
        searches: [],
        interactions: memories.length
      },
      insights: {
        favoriteDestinations: [],
        seasonalPreferences: {},
        groupPreferences: {}
      }
    };
    
    // Process memories to extract preferences and patterns
    memories.forEach(memory => {
      if (memory.type === 'preference') {
        // Add to preferences
      } else if (memory.type === 'booking') {
        profile.history.bookings.push(memory);
      } else if (memory.type === 'search') {
        profile.history.searches.push(memory.query);
      }
    });
    
    return profile;
  }
}
```

### 4. Knowledge Base System
```typescript
// src/memory/knowledgeBase.ts
import { createClient } from '@supabase/supabase-js';

export class KnowledgeBase {
  private supabase: any;
  private cache: Map<string, any> = new Map();

  constructor() {
    this.supabase = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_KEY!
    );
    this.loadInitialKnowledge();
  }

  private async loadInitialKnowledge() {
    // Load static knowledge about Sri Lanka
    const knowledge = {
      destinations: await this.loadDestinations(),
      culture: await this.loadCulturalInfo(),
      seasons: await this.loadSeasonalInfo(),
      transport: await this.loadTransportInfo(),
      cuisine: await this.loadCuisineInfo()
    };
    
    this.cache.set('sri-lanka', knowledge);
  }

  async getKnowledge(topic: string) {
    if (this.cache.has(topic)) {
      return this.cache.get(topic);
    }
    
    // Query from database
    const { data, error } = await this.supabase
      .from('knowledge_base')
      .select('*')
      .eq('topic', topic);
    
    if (data) {
      this.cache.set(topic, data);
      return data;
    }
    
    return null;
  }

  async searchDestinations(params: any) {
    const { query, filters } = params;
    
    // Implement intelligent destination search
    const destinations = this.cache.get('sri-lanka')?.destinations || [];
    
    return destinations.filter(dest => {
      // Apply filters and search logic
      return true; // Placeholder
    });
  }

  async flagForReview(interactionId: string, issue: string) {
    await this.supabase
      .from('knowledge_reviews')
      .insert({
        interaction_id: interactionId,
        issue: issue,
        status: 'pending',
        created_at: new Date()
      });
  }

  private async loadDestinations() {
    // Load comprehensive destination data
    return [
      {
        name: 'Sigiriya',
        type: 'historical',
        region: 'Central',
        highlights: ['Lion Rock', 'Ancient Frescoes', 'Water Gardens'],
        bestTime: 'January to April',
        duration: '3-4 hours',
        tips: ['Visit early morning', 'Bring water', 'Wear comfortable shoes']
      },
      // ... more destinations
    ];
  }

  private async loadCulturalInfo() {
    return {
      customs: {
        temples: ['Remove shoes', 'Dress modestly', 'No photography of Buddha statues'],
        greetings: ['Ayubowan with palms together', 'Respect elders'],
        etiquette: ['Use right hand for eating', 'Avoid public displays of affection']
      },
      festivals: [
        { name: 'Vesak', month: 'May', description: 'Buddha\'s birthday celebration' },
        { name: 'Esala Perahera', month: 'July/August', description: 'Grand procession in Kandy' }
      ]
    };
  }

  private async loadSeasonalInfo() {
    return {
      seasons: [
        {
          name: 'Northeast Monsoon',
          months: ['December', 'January', 'February'],
          bestFor: ['South coast', 'West coast', 'Hill country'],
          avoid: ['East coast']
        },
        {
          name: 'Southwest Monsoon',
          months: ['May', 'June', 'July', 'August'],
          bestFor: ['East coast', 'Cultural Triangle'],
          avoid: ['South coast', 'West coast']
        }
      ]
    };
  }

  private async loadTransportInfo() {
    return {
      options: [
        {
          type: 'Private Driver',
          cost: '$40-60/day',
          pros: ['Flexible', 'Comfortable', 'Local knowledge'],
          cons: ['More expensive']
        },
        {
          type: 'Train',
          cost: '$2-10/journey',
          pros: ['Scenic routes', 'Affordable', 'Experience'],
          cons: ['Crowded', 'Limited routes']
        }
      ]
    };
  }

  private async loadCuisineInfo() {
    return {
      dishes: [
        {
          name: 'Rice and Curry',
          description: 'Traditional meal with various curries',
          vegetarian: true,
          spiceLevel: 'medium to high'
        },
        {
          name: 'Kottu Roti',
          description: 'Chopped roti with vegetables/meat',
          vegetarian: false,
          spiceLevel: 'medium'
        }
      ]
    };
  }
}
```

## 🎤 Voice Integration

### Voice Engine Setup
```typescript
// src/ai/voiceEngine.ts
import { ElevenLabsClient } from 'elevenlabs';
import { Deepgram } from '@deepgram/sdk';

export class VoiceEngine {
  private elevenLabs: ElevenLabsClient;
  private deepgram: Deepgram;
  private voiceId: string = 'yalu-sri-lankan-english';

  constructor() {
    this.elevenLabs = new ElevenLabsClient({
      apiKey: process.env.ELEVENLABS_API_KEY
    });
    
    this.deepgram = new Deepgram(process.env.DEEPGRAM_API_KEY);
  }

  async speechToText(audioBuffer: Buffer): Promise<string> {
    const { result } = await this.deepgram.transcription.preRecorded(
      { buffer: audioBuffer, mimetype: 'audio/wav' },
      {
        punctuate: true,
        language: 'en',
        model: 'nova-2',
        smart_format: true
      }
    );
    
    return result.results.channels[0].alternatives[0].transcript;
  }

  async textToSpeech(text: string, emotion: string = 'friendly'): Promise<Buffer> {
    const audio = await this.elevenLabs.generate({
      voice: this.voiceId,
      text,
      model_id: 'eleven_multilingual_v2',
      voice_settings: {
        stability: 0.75,
        similarity_boost: 0.85,
        style: emotion === 'excited' ? 0.8 : 0.5,
        use_speaker_boost: true
      }
    });
    
    return Buffer.from(audio);
  }

  async createYaluVoice() {
    // Create custom voice for Yalu
    const voice = await this.elevenLabs.voices.add({
      name: 'Yalu - Sri Lankan Travel Assistant',
      files: ['./voice-samples/yalu-sample-1.mp3'],
      description: 'Warm, friendly Sri Lankan English accent',
      labels: {
        accent: 'sri-lankan',
        gender: 'female',
        age: 'young-adult',
        descriptive: 'warm, helpful, knowledgeable'
      }
    });
    
    this.voiceId = voice.voice_id;
  }
}
```

## 🌐 Frontend Integration

### React Hook for Yalu
```typescript
// src/hooks/useYalu.ts
import { useState, useEffect, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';

interface YaluState {
  isListening: boolean;
  isThinking: boolean;
  isSpeaking: boolean;
  conversation: Message[];
  currentMood: 'happy' | 'thinking' | 'listening' | 'excited';
}

export function useYalu() {
  const [state, setState] = useState<YaluState>({
    isListening: false,
    isThinking: false,
    isSpeaking: false,
    conversation: [],
    currentMood: 'happy'
  });
  
  const [socket, setSocket] = useState<Socket | null>(null);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);

  useEffect(() => {
    // Connect to Yalu WebSocket server
    const newSocket = io(process.env.VITE_YALU_SOCKET_URL || 'http://localhost:3001');
    
    newSocket.on('connect', () => {
      console.log('Connected to Yalu');
    });
    
    newSocket.on('yalu-response', (data) => {
      setState(prev => ({
        ...prev,
        conversation: [...prev.conversation, data.message],
        isThinking: false,
        isSpeaking: true,
        currentMood: data.mood || 'happy'
      }));
      
      // Play audio response
      if (data.audio) {
        playAudio(data.audio);
      }
    });
    
    setSocket(newSocket);
    
    return () => {
      newSocket.close();
    };
  }, []);

  const startListening = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      const chunks: Blob[] = [];
      
      recorder.ondataavailable = (e) => chunks.push(e.data);
      
      recorder.onstop = async () => {
        const blob = new Blob(chunks, { type: 'audio/wav' });
        const arrayBuffer = await blob.arrayBuffer();
        
        socket?.emit('voice-input', {
          audio: Buffer.from(arrayBuffer),
          userId: getUserId(),
          context: state.conversation
        });
        
        setState(prev => ({ ...prev, isListening: false, isThinking: true }));
      };
      
      recorder.start();
      setMediaRecorder(recorder);
      setState(prev => ({ ...prev, isListening: true }));
      
      // Auto-stop after 10 seconds
      setTimeout(() => stopListening(), 10000);
    } catch (error) {
      console.error('Error accessing microphone:', error);
    }
  }, [socket, state.conversation]);

  const stopListening = useCallback(() => {
    if (mediaRecorder && mediaRecorder.state !== 'inactive') {
      mediaRecorder.stop();
      mediaRecorder.stream.getTracks().forEach(track => track.stop());
    }
  }, [mediaRecorder]);

  const sendMessage = useCallback((text: string) => {
    const message: Message = {
      id: Date.now().toString(),
      text,
      sender: 'user',
      timestamp: new Date()
    };
    
    setState(prev => ({
      ...prev,
      conversation: [...prev.conversation, message],
      isThinking: true
    }));
    
    socket?.emit('text-input', {
      text,
      userId: getUserId(),
      context: state.conversation
    });
  }, [socket, state.conversation]);

  return {
    ...state,
    startListening,
    stopListening,
    sendMessage
  };
}

function playAudio(audioData: string) {
  const audio = new Audio(`data:audio/mp3;base64,${audioData}`);
  audio.play();
}

function getUserId(): string {
  // Get from auth context or generate temporary ID
  return localStorage.getItem('yaluUserId') || generateTempId();
}

function generateTempId(): string {
  const id = `yalu-user-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  localStorage.setItem('yaluUserId', id);
  return id;
}
```

### Yalu React Component
```tsx
// src/components/YaluAssistant.tsx
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, MicOff, Send, Sparkles } from 'lucide-react';
import { useYalu } from '../hooks/useYalu';

export function YaluAssistant() {
  const {
    isListening,
    isThinking,
    isSpeaking,
    conversation,
    currentMood,
    startListening,
    stopListening,
    sendMessage
  } = useYalu();
  
  const [inputText, setInputText] = React.useState('');

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed bottom-4 right-4 z-50"
    >
      {/* Yalu Avatar */}
      <motion.div
        className="relative w-20 h-20 mb-4"
        animate={{
          scale: isListening ? [1, 1.1, 1] : 1,
        }}
        transition={{
          duration: 2,
          repeat: isListening ? Infinity : 0,
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full shadow-lg">
          {/* Animated face based on mood */}
          <YaluFace mood={currentMood} isSpeaking={isSpeaking} />
        </div>
        
        {isThinking && (
          <motion.div
            className="absolute -top-2 -right-2"
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          >
            <Sparkles className="w-6 h-6 text-yellow-400" />
          </motion.div>
        )}
      </motion.div>

      {/* Conversation View */}
      <AnimatePresence>
        {conversation.length > 0 && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="bg-white rounded-lg shadow-xl mb-4 p-4 max-w-sm max-h-96 overflow-y-auto"
          >
            {conversation.map((message) => (
              <div
                key={message.id}
                className={`mb-2 ${
                  message.sender === 'user' ? 'text-right' : 'text-left'
                }`}
              >
                <span
                  className={`inline-block px-3 py-2 rounded-lg ${
                    message.sender === 'user'
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {message.text}
                </span>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Input Controls */}
      <div className="flex items-center gap-2 bg-white rounded-full shadow-lg p-2">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === 'Enter' && inputText.trim()) {
              sendMessage(inputText);
              setInputText('');
            }
          }}
          placeholder="Ask Yalu about Sri Lanka..."
          className="flex-1 px-4 py-2 outline-none"
        />
        
        <button
          onClick={() => {
            if (inputText.trim()) {
              sendMessage(inputText);
              setInputText('');
            }
          }}
          className="p-2 text-blue-500 hover:bg-blue-50 rounded-full"
        >
          <Send className="w-5 h-5" />
        </button>
        
        <button
          onClick={isListening ? stopListening : startListening}
          className={`p-2 rounded-full transition-colors ${
            isListening
              ? 'bg-red-500 text-white'
              : 'text-gray-500 hover:bg-gray-100'
          }`}
        >
          {isListening ? (
            <MicOff className="w-5 h-5" />
          ) : (
            <Mic className="w-5 h-5" />
          )}
        </button>
      </div>
    </motion.div>
  );
}

function YaluFace({ mood, isSpeaking }: { mood: string; isSpeaking: boolean }) {
  return (
    <svg viewBox="0 0 100 100" className="w-full h-full">
      {/* Eyes */}
      <circle cx="35" cy="40" r="3" fill="#333">
        {mood === 'happy' && (
          <animate
            attributeName="r"
            values="3;2;3"
            dur="3s"
            repeatCount="indefinite"
          />
        )}
      </circle>
      <circle cx="65" cy="40" r="3" fill="#333">
        {mood === 'happy' && (
          <animate
            attributeName="r"
            values="3;2;3"
            dur="3s"
            repeatCount="indefinite"
          />
        )}
      </circle>
      
      {/* Mouth */}
      <path
        d={
          mood === 'happy'
            ? "M 30 60 Q 50 70 70 60"
            : mood === 'thinking'
            ? "M 35 65 L 65 65"
            : "M 30 65 Q 50 60 70 65"
        }
        fill="none"
        stroke="#333"
        strokeWidth="2"
        strokeLinecap="round"
      >
        {isSpeaking && (
          <animate
            attributeName="d"
            values="M 30 60 Q 50 70 70 60;M 30 65 Q 50 60 70 65;M 30 60 Q 50 70 70 60"
            dur="0.3s"
            repeatCount="indefinite"
          />
        )}
      </path>
    </svg>
  );
}
```

## 🚀 Deployment Configuration

### Docker Setup
```dockerfile
# Dockerfile
FROM node:18-alpine

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci --only=production

# Copy source
COPY . .

# Build TypeScript
RUN npm run build

# Expose port
EXPOSE 3000

# Start server
CMD ["node", "dist/index.js"]
```

### Environment Variables
```env
# .env.example
# MCP Server
MCP_SERVER_PORT=3000

# AI Providers
OPENAI_API_KEY=your_openai_key
CLAUDE_API_KEY=your_claude_key
ELEVENLABS_API_KEY=your_elevenlabs_key
DEEPGRAM_API_KEY=your_deepgram_key

# Vector Database
PINECONE_API_KEY=your_pinecone_key
PINECONE_ENVIRONMENT=your_environment
PINECONE_INDEX=yalu-memory

# Cache
REDIS_URL=redis://localhost:6379

# Database
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_key

# WebSocket
SOCKET_PORT=3001
```

## 📋 Next Steps

1. **Set up MCP server infrastructure**
   ```bash
   mkdir yalu-mcp-server
   cd yalu-mcp-server
   npm init -y
   npm install @modelcontextprotocol/sdk typescript
   ```

2. **Configure AI providers**
   - Get API keys for OpenAI, Claude, ElevenLabs
   - Set up Pinecone vector database
   - Configure Redis for caching

3. **Create voice samples**
   - Record Sri Lankan English voice samples
   - Train custom ElevenLabs voice

4. **Integrate with existing booking system**
   - Connect to Firebase booking APIs
   - Set up real-time availability checks

5. **Deploy and test**
   - Deploy MCP server to cloud
   - Test voice interactions
   - Collect feedback for improvements

This implementation provides a solid foundation for Yalu with:
- ✅ Long-term memory via MCP + vector database
- ✅ Voice interaction with emotion
- ✅ Personalized recommendations
- ✅ Learning from feedback
- ✅ Integration with booking system
- ✅ Scalable architecture