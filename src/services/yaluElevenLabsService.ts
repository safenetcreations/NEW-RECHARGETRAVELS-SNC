/**
 * YALU ElevenLabs Conversational AI Service
 * Handles real-time voice agent interactions using ElevenLabs Conversational AI
 */

// ElevenLabs Conversational AI Configuration
const ELEVENLABS_API_KEY = import.meta.env.VITE_ELEVENLABS_API_KEY || '';
const ELEVENLABS_AGENT_ID = import.meta.env.VITE_ELEVENLABS_AGENT_ID || '';

// Declare the ElevenLabs Convai global
declare global {
  interface Window {
    ElevenLabsConvai?: {
      init: (config: any) => any;
    };
  }
}

// Voice IDs for different emotional states
const VOICE_IDS = {
  default: 'pNInz6obpgDQGcFmaJgB', // Adam - warm male voice
  friendly: 'EXAVITQu4vr4xnSDxMaL', // Bella - friendly female
  professional: 'onwK4e9ZLuTAKqWW03F9', // Daniel - professional
  yalu: import.meta.env.VITE_ELEVENLABS_YALU_VOICE_ID || 'pNInz6obpgDQGcFmaJgB'
};

// Yalu's system prompt for conversational context
const YALU_SYSTEM_PROMPT = `You are Yalu, a friendly Sri Lankan leopard who serves as the AI travel companion for Recharge Travels.

PERSONALITY:
- Warm, enthusiastic, and genuinely helpful
- Use occasional Sri Lankan terms: "Ayubowan" (hello), "machan" (friend), "istuti" (thanks)
- Be conversational but efficient with specific, actionable advice
- Show genuine excitement about Sri Lanka

YOUR KNOWLEDGE:
- All Sri Lankan destinations: Colombo, Kandy, Galle, Ella, Sigiriya, Mirissa, Yala, etc.
- Wildlife safaris: Yala has world's highest leopard density, Minneriya for elephant gathering
- Best beaches: Mirissa for whales, Arugam Bay for surfing, Unawatuna for swimming
- Cultural sites: Temple of Tooth, Sigiriya Rock, Dambulla caves
- Scenic trains: Kandy-Ella route is world-famous
- Local food: Kottu, hoppers, rice & curry, crab curry

BOOKING INFO:
- Recharge Travels: www.rechargetravels.com
- WhatsApp: +94 777 721 999
- Email: concierge@rechargetravels.com

Keep responses short (1-2 sentences for voice), natural, and engaging. Ask follow-up questions to understand traveler needs.`;

export interface ConversationMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  audioUrl?: string;
}

export interface YaluConversationState {
  sessionId: string;
  messages: ConversationMessage[];
  userContext: {
    name?: string;
    interests: string[];
    budget?: string;
    travelDates?: string;
    groupSize?: number;
  };
  isActive: boolean;
}

// Event callbacks for the voice agent
export interface VoiceAgentCallbacks {
  onConnect?: () => void;
  onDisconnect?: () => void;
  onMessage?: (message: { role: 'user' | 'agent'; content: string }) => void;
  onModeChange?: (mode: { mode: 'speaking' | 'listening' | 'idle' }) => void;
  onError?: (error: Error) => void;
  onStatusChange?: (status: 'connecting' | 'connected' | 'disconnected') => void;
  onAudioStart?: () => void;
  onAudioEnd?: () => void;
}

class YaluElevenLabsService {
  private conversationState: YaluConversationState | null = null;
  private audioContext: AudioContext | null = null;
  private mediaRecorder: MediaRecorder | null = null;
  private audioChunks: Blob[] = [];

  // WebSocket for ElevenLabs Conversational AI
  private websocket: WebSocket | null = null;
  private mediaStream: MediaStream | null = null;
  private audioWorklet: AudioWorkletNode | null = null;
  private isConversationActive: boolean = false;
  private callbacks: VoiceAgentCallbacks = {};
  private audioQueue: ArrayBuffer[] = [];
  private isPlaying: boolean = false;

  constructor() {
    this.initializeAudioContext();
  }

  private async initializeAudioContext() {
    if (typeof window !== 'undefined') {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
  }

  /**
   * Set callbacks for voice agent events
   */
  setCallbacks(callbacks: VoiceAgentCallbacks) {
    this.callbacks = callbacks;
  }

  /**
   * Get the ElevenLabs Agent ID
   */
  getAgentId(): string {
    return ELEVENLABS_AGENT_ID;
  }

  /**
   * Start real-time voice conversation with ElevenLabs
   * This now triggers the widget-based approach
   */
  async startVoiceConversation(): Promise<void> {
    if (this.isConversationActive) {
      console.log('Conversation already active');
      return;
    }

    if (!ELEVENLABS_AGENT_ID) {
      throw new Error('ElevenLabs Agent ID not configured. Set VITE_ELEVENLABS_AGENT_ID in .env');
    }

    try {
      this.callbacks.onStatusChange?.('connecting');

      // Request microphone permission first
      await navigator.mediaDevices.getUserMedia({ audio: true });

      this.isConversationActive = true;
      this.callbacks.onConnect?.();
      this.callbacks.onStatusChange?.('connected');
      this.callbacks.onModeChange?.({ mode: 'listening' });

    } catch (error) {
      console.error('Failed to start voice conversation:', error);
      this.callbacks.onError?.(error as Error);
      this.callbacks.onStatusChange?.('disconnected');
      throw error;
    }
  }

  /**
   * Stop voice conversation
   */
  stopVoiceConversation() {
    this.isConversationActive = false;
    this.cleanup();
    this.callbacks.onDisconnect?.();
    this.callbacks.onStatusChange?.('disconnected');
  }

  /**
   * Cleanup resources
   */
  private cleanup() {
    // Close WebSocket
    if (this.websocket) {
      this.websocket.close();
      this.websocket = null;
    }

    // Stop media stream
    if (this.mediaStream) {
      this.mediaStream.getTracks().forEach(track => track.stop());
      this.mediaStream = null;
    }

    // Clear audio queue
    this.audioQueue = [];
    this.isPlaying = false;
  }

  /**
   * Check if conversation is active
   */
  isActive(): boolean {
    return this.isConversationActive;
  }

  /**
   * Start a new conversation session (for text chat)
   */
  async startConversation(): Promise<YaluConversationState> {
    const sessionId = `yalu_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    this.conversationState = {
      sessionId,
      messages: [{
        role: 'system',
        content: YALU_SYSTEM_PROMPT,
        timestamp: new Date()
      }],
      userContext: {
        interests: []
      },
      isActive: true
    };

    return this.conversationState;
  }

  /**
   * Convert text to speech using ElevenLabs (for text chat mode)
   */
  async textToSpeech(text: string, voiceId: string = VOICE_IDS.yalu): Promise<ArrayBuffer> {
    if (!ELEVENLABS_API_KEY) {
      throw new Error('ElevenLabs API key not configured');
    }

    const response = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`,
      {
        method: 'POST',
        headers: {
          'xi-api-key': ELEVENLABS_API_KEY,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          text,
          model_id: 'eleven_turbo_v2',
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.75,
            style: 0.4,
            use_speaker_boost: true
          }
        })
      }
    );

    if (!response.ok) {
      throw new Error(`ElevenLabs TTS error: ${response.status}`);
    }

    return response.arrayBuffer();
  }

  /**
   * Play audio buffer
   */
  async playAudio(audioBuffer: ArrayBuffer): Promise<void> {
    if (!this.audioContext) {
      await this.initializeAudioContext();
    }

    if (!this.audioContext) {
      console.error('AudioContext not available');
      return;
    }

    try {
      if (this.audioContext.state === 'suspended') {
        await this.audioContext.resume();
      }
      const decodedAudio = await this.audioContext.decodeAudioData(audioBuffer.slice(0));
      const source = this.audioContext.createBufferSource();
      source.buffer = decodedAudio;
      source.connect(this.audioContext.destination);
      source.start(0);
    } catch (error) {
      console.error('Audio playback error:', error);
    }
  }

  /**
   * Speak text using ElevenLabs (for text chat mode)
   */
  async speak(text: string): Promise<void> {
    try {
      const audioBuffer = await this.textToSpeech(text);
      await this.playAudio(audioBuffer);
    } catch (error) {
      console.error('Speak error:', error);
      // Fallback to browser TTS
      if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 0.9;
        utterance.pitch = 1.0;
        utterance.lang = 'en-US';
        window.speechSynthesis.speak(utterance);
      }
    }
  }

  /**
   * Get Yalu's response using OpenAI (for text chat mode fallback)
   */
  async getYaluResponse(userMessage: string): Promise<string> {
    const openAIKey = import.meta.env.VITE_OPENAI_API_KEY;

    if (!openAIKey) {
      return this.getFallbackResponse(userMessage);
    }

    if (!this.conversationState) {
      await this.startConversation();
    }

    // Add user message to history
    this.conversationState!.messages.push({
      role: 'user',
      content: userMessage,
      timestamp: new Date()
    });

    // Update user context based on message
    this.updateUserContext(userMessage);

    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${openAIKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: 'gpt-4-turbo-preview',
          messages: this.conversationState!.messages.map(m => ({
            role: m.role,
            content: m.content
          })),
          temperature: 0.8,
          max_tokens: 150 // Keep responses short for voice
        })
      });

      if (!response.ok) {
        throw new Error('OpenAI API error');
      }

      const data = await response.json();
      const yaluResponse = data.choices[0].message.content;

      // Add to conversation history
      this.conversationState!.messages.push({
        role: 'assistant',
        content: yaluResponse,
        timestamp: new Date()
      });

      return yaluResponse;
    } catch (error) {
      console.error('Yalu response error:', error);
      return this.getFallbackResponse(userMessage);
    }
  }

  /**
   * Update user context from conversation
   */
  private updateUserContext(message: string): void {
    if (!this.conversationState) return;

    const lower = message.toLowerCase();

    // Extract name
    const nameMatch = message.match(/(?:i'm|i am|my name is|call me)\s+(\w+)/i);
    if (nameMatch) {
      this.conversationState.userContext.name = nameMatch[1];
    }

    // Extract interests
    const interests = ['beach', 'wildlife', 'safari', 'culture', 'temple', 'food', 'adventure', 'hiking', 'surfing'];
    interests.forEach(interest => {
      if (lower.includes(interest) && !this.conversationState!.userContext.interests.includes(interest)) {
        this.conversationState!.userContext.interests.push(interest);
      }
    });

    // Extract budget
    if (lower.includes('budget') || lower.includes('cheap')) {
      this.conversationState.userContext.budget = 'budget';
    } else if (lower.includes('luxury') || lower.includes('premium')) {
      this.conversationState.userContext.budget = 'luxury';
    } else if (lower.includes('mid-range') || lower.includes('moderate')) {
      this.conversationState.userContext.budget = 'mid-range';
    }
  }

  /**
   * Get fallback response when API is unavailable
   */
  private getFallbackResponse(message: string): string {
    const lower = message.toLowerCase();

    if (lower.includes('hello') || lower.includes('hi')) {
      return "Ayubowan! I'm Yalu, your Sri Lankan travel companion. What kind of adventure are you dreaming of?";
    }
    if (lower.includes('beach')) {
      return "Sri Lanka has amazing beaches! Mirissa is perfect for whale watching, Arugam Bay for surfing, and Unawatuna for swimming. Which sounds exciting to you?";
    }
    if (lower.includes('safari') || lower.includes('leopard') || lower.includes('wildlife')) {
      return "Oh, safari is my specialty! Yala National Park has the world's highest leopard density. I'd recommend the 5:30 AM safari for best sightings. Want me to tell you more?";
    }
    if (lower.includes('train') || lower.includes('ella')) {
      return "The Kandy to Ella train is legendary! It's one of the world's most scenic journeys through tea plantations and mountains. Book the observation car for the best views!";
    }
    if (lower.includes('food') || lower.includes('eat')) {
      return "Sri Lankan food is incredible! You must try kottu roti, hoppers, and our famous rice & curry. Want recommendations for specific cities?";
    }
    if (lower.includes('book') || lower.includes('help') || lower.includes('plan')) {
      return "I'd love to help plan your trip! You can reach our concierge team on WhatsApp at +94 777 721 999 for personalized assistance. What destinations interest you?";
    }

    return "That sounds interesting! Tell me more about what you'd like to experience in Sri Lanka, and I'll share my local knowledge!";
  }

  /**
   * Start voice recording (legacy method for compatibility)
   */
  async startRecording(): Promise<void> {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      this.mediaRecorder = new MediaRecorder(stream);
      this.audioChunks = [];

      this.mediaRecorder.ondataavailable = (event) => {
        this.audioChunks.push(event.data);
      };

      this.mediaRecorder.start();
    } catch (error) {
      console.error('Recording start error:', error);
      throw error;
    }
  }

  /**
   * Stop recording and get transcription (legacy method)
   */
  async stopRecordingAndTranscribe(): Promise<string> {
    return new Promise((resolve, reject) => {
      if (!this.mediaRecorder) {
        reject(new Error('No active recording'));
        return;
      }

      this.mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(this.audioChunks, { type: 'audio/webm' });

        try {
          const transcript = await this.transcribeWithWebSpeech();
          resolve(transcript);
        } catch (error) {
          reject(error);
        }
      };

      this.mediaRecorder.stop();
    });
  }

  /**
   * Simple web speech transcription fallback
   */
  private transcribeWithWebSpeech(): Promise<string> {
    return new Promise((resolve, reject) => {
      if (!('webkitSpeechRecognition' in window)) {
        reject(new Error('Speech recognition not supported'));
        return;
      }

      const recognition = new (window as any).webkitSpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        resolve(transcript);
      };

      recognition.onerror = (event: any) => {
        reject(new Error(event.error));
      };

      recognition.start();
    });
  }

  /**
   * Get conversation history
   */
  getConversationHistory(): ConversationMessage[] {
    return this.conversationState?.messages.filter(m => m.role !== 'system') || [];
  }

  /**
   * Clear conversation
   */
  clearConversation(): void {
    this.conversationState = null;
  }

  /**
   * Get user context
   */
  getUserContext() {
    return this.conversationState?.userContext || { interests: [] };
  }
}

export const yaluElevenLabsService = new YaluElevenLabsService();
export default yaluElevenLabsService;







