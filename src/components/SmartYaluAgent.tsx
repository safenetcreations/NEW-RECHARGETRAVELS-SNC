import React, { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { X, Mic, MicOff, Volume2, VolumeX, Sparkles, Heart, MapPin, Calendar, DollarSign, Users, Send, Globe, Loader2, Car, Brain, Zap, AlertCircle } from 'lucide-react'
import { cn } from '@/lib/utils'
import { YaluFirebaseService } from '@/services/yaluFirebaseService'

interface Message {
  id: string
  text: string
  sender: 'user' | 'yalu'
  timestamp: Date
  emotion?: 'happy' | 'thinking' | 'excited' | 'empathetic' | 'helpful' | 'curious' | 'alert'
  suggestions?: string[]
  language?: string
  aiProvider?: 'openai' | 'claude' | 'gemini' | 'cohere' | 'local'
  confidence?: number
}

interface SmartYaluAgentProps {
  isOpen: boolean
  onClose: () => void
}

// AI Provider configurations
const AI_PROVIDERS = {
  openai: {
    name: 'GPT-4',
    endpoint: 'https://api.openai.com/v1/chat/completions',
    model: 'gpt-4-turbo-preview',
    icon: '🧠'
  },
  claude: {
    name: 'Claude 3',
    endpoint: 'https://api.anthropic.com/v1/messages',
    model: 'claude-3-sonnet-20240229',
    icon: '🤖'
  },
  gemini: {
    name: 'Gemini Pro',
    endpoint: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent',
    icon: '✨'
  },
  cohere: {
    name: 'Command',
    endpoint: 'https://api.cohere.ai/v1/chat',
    model: 'command',
    icon: '🎯'
  }
}

// Language configurations with better support
const LANGUAGES = {
  en: { name: 'English', flag: '🇬🇧', greeting: 'Hello', code: 'en-US' },
  si: { name: 'Sinhala', flag: '🇱🇰', greeting: 'Hello', code: 'si-LK' },
  ta: { name: 'Tamil', flag: '🇱🇰', greeting: 'Hello', code: 'ta-IN' },
  hi: { name: 'हिन्दी', flag: '🇮🇳', greeting: 'नमस्ते', code: 'hi-IN' },
  de: { name: 'Deutsch', flag: '🇩🇪', greeting: 'Hallo', code: 'de-DE' },
  fr: { name: 'Français', flag: '🇫🇷', greeting: 'Bonjour', code: 'fr-FR' },
  zh: { name: '中文', flag: '🇨🇳', greeting: '你好', code: 'zh-CN' },
  ja: { name: '日本語', flag: '🇯🇵', greeting: 'こんにちは', code: 'ja-JP' },
  es: { name: 'Español', flag: '🇪🇸', greeting: 'Hola', code: 'es-ES' }
}

const SmartYaluAgent: React.FC<SmartYaluAgentProps> = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState<Message[]>([])
  const [inputText, setInputText] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [audioEnabled, setAudioEnabled] = useState(true)
  const [isListening, setIsListening] = useState(false)
  const [yaluMood, setYaluMood] = useState<'happy' | 'listening' | 'thinking' | 'speaking' | 'excited' | 'alert'>('happy')
  const [selectedLanguage, setSelectedLanguage] = useState('en')
  const [isProcessingVoice, setIsProcessingVoice] = useState(false)
  const [userName, setUserName] = useState<string | null>(null)
  const [sessionId] = useState(() => `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`)
  const [currentAIProvider, setCurrentAIProvider] = useState<keyof typeof AI_PROVIDERS>('openai')
  const [listeningError, setListeningError] = useState<string | null>(null)
  const [continuousListening, setContinuousListening] = useState(false)
  const [aiStatus, setAiStatus] = useState<'online' | 'degraded' | 'offline'>('online')
  
  const chatContainerRef = useRef<HTMLDivElement>(null)
  const audioRef = useRef<HTMLAudioElement>(null)
  const recognitionRef = useRef<any>(null)
  const messageQueueRef = useRef<string[]>([])
  const isProcessingRef = useRef(false)
  
  // Get API keys
  const openAIKey = import.meta.env.VITE_OPENAI_API_KEY
  const claudeKey = import.meta.env.VITE_CLAUDE_API_KEY
  const geminiKey = import.meta.env.VITE_GEMINI_API_KEY
  const cohereKey = import.meta.env.VITE_COHERE_API_KEY
  const elevenLabsKey = import.meta.env.VITE_ELEVENLABS_API_KEY

  // Initialize with smart greeting
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const storedUserName = localStorage.getItem('yalu_user_name')
      const lastLanguage = localStorage.getItem('yalu_language') || 'en'
      setSelectedLanguage(lastLanguage)
      
      const greetingTime = new Date().getHours()
      const timeGreeting = greetingTime < 12 ? "Good morning" : greetingTime < 17 ? "Good afternoon" : "Good evening"
      
      const greetingText = storedUserName 
        ? `${timeGreeting}, ${storedUserName}! 🙏 Welcome back! I'm Yalu, now smarter and faster than ever! I can understand you better in multiple languages. How can I help you explore Sri Lanka today?`
        : `${timeGreeting}! 🙏 I'm Yalu, your AI-powered Sri Lankan travel companion. I'm now smarter with multiple AI models and can understand you in several languages! What's your name, friend?`
      
      const welcomeMessage: Message = {
        id: Date.now().toString(),
        text: greetingText,
        sender: 'yalu',
        timestamp: new Date(),
        emotion: 'happy',
        language: selectedLanguage,
        aiProvider: 'openai',
        suggestions: storedUserName ? [
          "Voice commands 🎤",
          "Find me beaches 🏖️",
          "Plan my trip 📅",
          "Local tips 💡"
        ] : [
          "I'm [your name] 👋",
          "Speak to me 🎤",
          "Show me around 🗺️",
          "Help me plan 📋"
        ]
      }
      
      setMessages([welcomeMessage])
      setUserName(storedUserName)
      
      // Speak greeting
      if (audioEnabled) {
        speakWithElevenLabs(greetingText, selectedLanguage)
      }
      
      // Check AI status
      checkAIProviders()
    }
  }, [isOpen])

  // Enhanced speech recognition with better error handling
  useEffect(() => {
    if (typeof window !== 'undefined' && ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition
      const recognition = new SpeechRecognition()
      
      recognition.continuous = continuousListening
      recognition.interimResults = true
      recognition.maxAlternatives = 3
      recognition.lang = LANGUAGES[selectedLanguage as keyof typeof LANGUAGES].code
      
      let finalTranscript = ''
      let interimTranscript = ''
      
      recognition.onstart = () => {
        setListeningError(null)
        setYaluMood('listening')
        console.log('Speech recognition started')
      }
      
      recognition.onresult = (event: any) => {
        interimTranscript = ''
        
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript
          if (event.results[i].isFinal) {
            finalTranscript += transcript + ' '
            setInputText(finalTranscript.trim())
            
            // Auto-send if continuous listening
            if (continuousListening && finalTranscript.trim()) {
              handleSend(finalTranscript.trim())
              finalTranscript = ''
            }
          } else {
            interimTranscript += transcript
            setInputText(finalTranscript + interimTranscript)
          }
        }
      }
      
      recognition.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error)
        setIsListening(false)
        setYaluMood('alert')
        
        switch (event.error) {
          case 'network':
            setListeningError('Network error. Check your connection.')
            break
          case 'not-allowed':
            setListeningError('Microphone access denied. Please allow access.')
            break
          case 'no-speech':
            setListeningError('No speech detected. Try again.')
            break
          default:
            setListeningError(`Error: ${event.error}`)
        }
        
        setTimeout(() => setListeningError(null), 5000)
      }
      
      recognition.onend = () => {
        setIsListening(false)
        if (continuousListening && !listeningError) {
          // Restart for continuous listening
          setTimeout(() => {
            if (continuousListening) {
              recognition.start()
              setIsListening(true)
            }
          }, 100)
        }
      }
      
      recognitionRef.current = recognition
    } else {
      setListeningError('Speech recognition not supported in your browser')
    }
  }, [selectedLanguage, continuousListening])

  // Auto-scroll chat
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight
    }
  }, [messages])

  // Check AI provider status
  const checkAIProviders = async () => {
    let availableProviders = 0
    
    if (openAIKey) availableProviders++
    if (claudeKey) availableProviders++
    if (geminiKey) availableProviders++
    if (cohereKey) availableProviders++
    
    if (availableProviders === 0) {
      setAiStatus('offline')
    } else if (availableProviders < 2) {
      setAiStatus('degraded')
    } else {
      setAiStatus('online')
    }
  }

  // Smart AI provider selection based on query
  const selectBestAIProvider = (query: string): keyof typeof AI_PROVIDERS => {
    const lowerQuery = query.toLowerCase()
    
    // Use Claude for complex reasoning
    if (claudeKey && (lowerQuery.includes('plan') || lowerQuery.includes('itinerary') || lowerQuery.includes('compare'))) {
      return 'claude'
    }
    
    // Use Gemini for creative responses
    if (geminiKey && (lowerQuery.includes('suggest') || lowerQuery.includes('idea') || lowerQuery.includes('creative'))) {
      return 'gemini'
    }
    
    // Use Cohere for quick facts
    if (cohereKey && (lowerQuery.includes('what is') || lowerQuery.includes('how much') || lowerQuery.includes('when'))) {
      return 'cohere'
    }
    
    // Default to OpenAI or first available
    if (openAIKey) return 'openai'
    if (claudeKey) return 'claude'
    if (geminiKey) return 'gemini'
    if (cohereKey) return 'cohere'
    
    return 'openai'
  }

  // Enhanced AI response with fallback
  const getAIResponse = async (query: string, provider: keyof typeof AI_PROVIDERS, retryCount = 0): Promise<string> => {
    try {
      switch (provider) {
        case 'openai':
          if (!openAIKey) throw new Error('OpenAI key not available')
          return await getOpenAIResponse(query)
          
        case 'claude':
          if (!claudeKey) throw new Error('Claude key not available')
          return await getClaudeResponse(query)
          
        case 'gemini':
          if (!geminiKey) throw new Error('Gemini key not available')
          return await getGeminiResponse(query)
          
        case 'cohere':
          if (!cohereKey) throw new Error('Cohere key not available')
          return await getCohereResponse(query)
          
        default:
          throw new Error('No AI provider available')
      }
    } catch (error) {
      console.error(`${provider} failed:`, error)
      
      // Try fallback providers
      if (retryCount < 3) {
        const providers = Object.keys(AI_PROVIDERS) as (keyof typeof AI_PROVIDERS)[]
        const nextProvider = providers.find(p => p !== provider && hasAPIKey(p))
        
        if (nextProvider) {
          console.log(`Falling back to ${nextProvider}`)
          return await getAIResponse(query, nextProvider, retryCount + 1)
        }
      }
      
      throw error
    }
  }

  // Check if provider has API key
  const hasAPIKey = (provider: keyof typeof AI_PROVIDERS): boolean => {
    switch (provider) {
      case 'openai': return !!openAIKey
      case 'claude': return !!claudeKey
      case 'gemini': return !!geminiKey
      case 'cohere': return !!cohereKey
      default: return false
    }
  }

  // OpenAI response
  const getOpenAIResponse = async (query: string): Promise<string> => {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4-turbo-preview',
        messages: [
          {
            role: 'system',
            content: getSystemPrompt(selectedLanguage)
          },
          ...messages.map(m => ({
            role: m.sender === 'user' ? 'user' : 'assistant',
            content: m.text
          })),
          { role: 'user', content: query }
        ],
        temperature: 0.8,
        max_tokens: 500
      })
    })
    
    if (!response.ok) throw new Error('OpenAI request failed')
    const data = await response.json()
    return data.choices[0].message.content
  }

  // Claude response
  const getClaudeResponse = async (query: string): Promise<string> => {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': claudeKey!,
        'anthropic-version': '2023-06-01',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'claude-3-sonnet-20240229',
        max_tokens: 500,
        messages: [{
          role: 'user',
          content: query
        }],
        system: getSystemPrompt(selectedLanguage)
      })
    })
    
    if (!response.ok) throw new Error('Claude request failed')
    const data = await response.json()
    return data.content[0].text
  }

  // Gemini response
  const getGeminiResponse = async (query: string): Promise<string> => {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${geminiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: `${getSystemPrompt(selectedLanguage)}\n\nUser: ${query}`
          }]
        }]
      })
    })
    
    if (!response.ok) throw new Error('Gemini request failed')
    const data = await response.json()
    return data.candidates[0].content.parts[0].text
  }

  // Cohere response
  const getCohereResponse = async (query: string): Promise<string> => {
    const response = await fetch('https://api.cohere.ai/v1/chat', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${cohereKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'command',
        message: query,
        preamble: getSystemPrompt(selectedLanguage),
        conversation_id: sessionId,
        temperature: 0.8
      })
    })
    
    if (!response.ok) throw new Error('Cohere request failed')
    const data = await response.json()
    return data.text
  }

  // System prompt for all AI providers
  const getSystemPrompt = (lang: string): string => {
    return `You are Yalu, a smart, friendly, and knowledgeable Sri Lankan travel AI assistant powered by multiple AI models.

Language: Respond in ${LANGUAGES[lang as keyof typeof LANGUAGES].name}.
${lang !== 'en' ? 'But understand and respond in the requested language.' : ''}

Your expertise includes:
- All Sri Lankan destinations: beaches, wildlife parks, cultural sites, mountains
- Local insights: hidden gems, best times to visit, local customs
- Practical info: transport, costs, safety, weather
- Booking assistance: tours, vehicles, accommodations
- Cultural knowledge: festivals, food, traditions

Personality:
- Warm and enthusiastic about Sri Lanka
- Use local terms naturally: machan (friend), ayubowan (hello)
- Give specific, actionable advice
- Be concise but thorough
- Show personality with occasional emojis

Always end responses with helpful suggestions or next steps.`
  }

  // Enhanced ElevenLabs voice synthesis
  const speakWithElevenLabs = async (text: string, language: string) => {
    if (!elevenLabsKey || !audioEnabled) return
    
    setIsProcessingVoice(true)
    setYaluMood('speaking')
    
    try {
      // Use multilingual model for better language support
      const response = await fetch(
        'https://api.elevenlabs.io/v1/text-to-speech/h8iF6fuqRJODTFvWSevk',
        {
          method: 'POST',
          headers: {
            'xi-api-key': elevenLabsKey,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            text,
            model_id: 'eleven_multilingual_v2', // Better for multiple languages
            voice_settings: {
              stability: 0.5,
              similarity_boost: 0.75,
              style: 0.3,
              use_speaker_boost: true
            },
            // Language hint for better pronunciation
            language_code: LANGUAGES[language as keyof typeof LANGUAGES].code.split('-')[0]
          })
        }
      )
      
      if (response.ok) {
        const audioBlob = await response.blob()
        const audioUrl = URL.createObjectURL(audioBlob)
        
        if (audioRef.current) {
          audioRef.current.src = audioUrl
          await audioRef.current.play()
        }
      } else {
        // Fallback to browser TTS
        fallbackToBrowserTTS(text, language)
      }
    } catch (error) {
      console.error('ElevenLabs error:', error)
      fallbackToBrowserTTS(text, language)
    } finally {
      setIsProcessingVoice(false)
      setYaluMood('happy')
    }
  }

  // Fallback browser TTS with better language support
  const fallbackToBrowserTTS = (text: string, language: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.rate = 0.9
      utterance.pitch = 1.1
      utterance.lang = LANGUAGES[language as keyof typeof LANGUAGES].code
      
      // Try to find a voice for the language
      const voices = speechSynthesis.getVoices()
      const voice = voices.find(v => v.lang.startsWith(language))
      if (voice) utterance.voice = voice
      
      speechSynthesis.speak(utterance)
    }
  }

  // Enhanced message handling
  const handleSend = async (text?: string) => {
    const messageText = text || inputText
    if (!messageText.trim() || isTyping) return

    // Save language preference
    localStorage.setItem('yalu_language', selectedLanguage)

    // Check for name introduction
    if (!userName && (messageText.toLowerCase().includes('i\'m') || messageText.toLowerCase().includes('my name'))) {
      const nameMatch = messageText.match(/(?:i'm|my name is|i am)\s+(\w+)/i)
      if (nameMatch) {
        const extractedName = nameMatch[1]
        setUserName(extractedName)
        localStorage.setItem('yalu_user_name', extractedName)
      }
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      text: messageText,
      sender: 'user',
      timestamp: new Date(),
      language: selectedLanguage
    }

    setMessages(prev => [...prev, userMessage])
    setInputText('')
    setIsTyping(true)
    setYaluMood('thinking')

    try {
      // Check for tool-based queries first
      const toolResponse = await checkToolQueries(messageText)
      
      let yaluResponse: string
      let provider: keyof typeof AI_PROVIDERS
      
      if (toolResponse) {
        yaluResponse = toolResponse
        provider = 'openai' // Tool responses are considered OpenAI
      } else {
        // Select best AI provider
        provider = selectBestAIProvider(messageText)
        setCurrentAIProvider(provider)
        
        // Get AI response with fallback
        yaluResponse = await getAIResponse(messageText, provider)
      }

      // Determine emotion
      let emotion: Message['emotion'] = 'happy'
      if (yaluResponse.toLowerCase().includes('wonderful') || yaluResponse.toLowerCase().includes('amazing')) {
        emotion = 'excited'
      } else if (yaluResponse.toLowerCase().includes('sorry') || yaluResponse.toLowerCase().includes('unfortunately')) {
        emotion = 'empathetic'
      } else if (yaluResponse.includes('?')) {
        emotion = 'curious'
      }

      const yaluMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: yaluResponse,
        sender: 'yalu',
        timestamp: new Date(),
        emotion,
        suggestions: generateSmartSuggestions(messageText, yaluResponse),
        language: selectedLanguage,
        aiProvider: provider,
        confidence: 0.95
      }

      setMessages(prev => [...prev, yaluMessage])
      setYaluMood('happy')

      // Speak the response
      speakWithElevenLabs(yaluResponse, selectedLanguage)

    } catch (error) {
      console.error('Error:', error)
      
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: aiStatus === 'offline' 
          ? "I'm having trouble connecting to AI services. Please check your API keys in the settings."
          : "I encountered an issue, but I'm still here to help! Could you rephrase your question?",
        sender: 'yalu',
        timestamp: new Date(),
        emotion: 'alert',
        aiProvider: 'openai'
      }
      
      setMessages(prev => [...prev, errorMessage])
      setYaluMood('alert')
    } finally {
      setIsTyping(false)
    }
  }

  // Check for tool-based queries
  const checkToolQueries = async (query: string): Promise<string | null> => {
    const lowerQuery = query.toLowerCase()
    
    // Vehicle availability
    if (lowerQuery.includes('vehicle') || lowerQuery.includes('car') || lowerQuery.includes('van')) {
      const dateMatch = query.match(/(\d{4}-\d{2}-\d{2})|tomorrow|today|next week/)
      let date = new Date().toISOString().split('T')[0]
      
      if (dateMatch) {
        if (dateMatch[0] === 'tomorrow') {
          date = new Date(Date.now() + 86400000).toISOString().split('T')[0]
        } else if (dateMatch[0] === 'next week') {
          date = new Date(Date.now() + 604800000).toISOString().split('T')[0]
        } else if (dateMatch[0] !== 'today') {
          date = dateMatch[0]
        }
      }

      const vehicleData = await YaluFirebaseService.checkVehicleAvailability({
        date,
        passengers: parseInt(query.match(/(\d+)\s*(?:people|passengers|pax)/)?.[1] || '4')
      })

      return YaluFirebaseService.formatVehicleResponse(vehicleData)
    }

    // Tour pricing
    if (lowerQuery.includes('price') || lowerQuery.includes('cost')) {
      const paxMatch = query.match(/(\d+)\s*(?:people|persons|pax)/)
      const pax = paxMatch ? parseInt(paxMatch[1]) : 2

      const priceData = await YaluFirebaseService.calculateTourPrice({
        tourId: 'sigiriya-day-tour',
        pax,
        date: new Date().toISOString().split('T')[0]
      })

      return YaluFirebaseService.formatTourPriceResponse(priceData)
    }

    // Tour search
    if (lowerQuery.includes('tour') || lowerQuery.includes('trip')) {
      const searchData = await YaluFirebaseService.searchTours({
        query,
        category: lowerQuery.includes('beach') ? 'beach' : 
                 lowerQuery.includes('wildlife') ? 'wildlife' : undefined
      })

      return YaluFirebaseService.formatTourSearchResponse(searchData)
    }

    return null
  }

  // Generate smart contextual suggestions
  const generateSmartSuggestions = (userText: string, response: string): string[] => {
    const combined = (userText + ' ' + response).toLowerCase()
    const currentHour = new Date().getHours()
    
    // Time-based suggestions
    if (currentHour >= 6 && currentHour < 10) {
      if (combined.includes('breakfast') || combined.includes('morning')) {
        return ["Best breakfast spots 🍳", "Morning safari times 🦁", "Sunrise viewpoints 🌅", "Today's weather ☀️"]
      }
    }
    
    // Context-based suggestions
    if (combined.includes('beach')) {
      return ["Beach safety tips 🏊", "Nearby restaurants 🍽️", "Water sports 🏄", "Best photo spots 📸"]
    } else if (combined.includes('wildlife')) {
      return ["Book safari now 🚙", "What to bring 🎒", "Animal sighting tips 👀", "Photography guide 📷"]
    } else if (combined.includes('temple')) {
      return ["Dress code guide 👕", "Temple etiquette 🙏", "Nearby temples 🛕", "Festival dates 🎉"]
    } else if (combined.includes('food')) {
      return ["Local specialties 🍛", "Vegetarian options 🥗", "Street food safety 🥘", "Cooking classes 👨‍🍳"]
    }
    
    // Default smart suggestions
    return [
      "Voice command 🎤",
      "Switch language 🌐",
      "Live availability 📅",
      "Quick booking 🎫"
    ]
  }

  // Enhanced voice input handling
  const handleVoiceInput = () => {
    if (!recognitionRef.current) {
      setListeningError('Voice recognition not available')
      return
    }
    
    if (isListening) {
      recognitionRef.current.stop()
      setIsListening(false)
      setContinuousListening(false)
    } else {
      try {
        recognitionRef.current.start()
        setIsListening(true)
        setYaluMood('listening')
      } catch (error) {
        console.error('Failed to start recognition:', error)
        setListeningError('Failed to start voice recognition')
      }
    }
  }

  const handleSuggestionClick = (suggestion: string) => {
    setInputText(suggestion)
    setTimeout(() => handleSend(suggestion), 100)
  }

  if (!isOpen) return null

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9, y: 20 }}
      className="fixed bottom-4 right-4 z-50"
    >
      <Card className="w-[450px] h-[650px] shadow-2xl border-0 overflow-hidden bg-gradient-to-br from-white to-orange-50">
        <CardHeader className="bg-gradient-to-r from-amber-500 to-orange-600 text-white p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <YaluAvatar mood={yaluMood} />
              <div>
                <CardTitle className="text-xl font-bold flex items-center gap-2">
                  Yalu AI
                  <span className="text-xs opacity-80 flex items-center gap-1">
                    <Brain className="h-3 w-3" />
                    {AI_PROVIDERS[currentAIProvider].name}
                  </span>
                </CardTitle>
                <p className="text-sm opacity-90 flex items-center gap-2">
                  Your Smart Travel Assistant
                  {aiStatus === 'degraded' && <AlertCircle className="h-3 w-3" />}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {/* Language Selector */}
              <select
                value={selectedLanguage}
                onChange={(e) => {
                  setSelectedLanguage(e.target.value)
                  localStorage.setItem('yalu_language', e.target.value)
                }}
                className="bg-white/20 text-white border border-white/30 rounded px-2 py-1 text-sm backdrop-blur"
              >
                {Object.entries(LANGUAGES).map(([code, lang]) => (
                  <option key={code} value={code} className="text-gray-800">
                    {lang.flag} {lang.name}
                  </option>
                ))}
              </select>
              <button onClick={onClose} className="text-white/80 hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="p-0 flex flex-col h-[calc(100%-80px)]">
          {/* Messages */}
          <div ref={chatContainerRef} className="flex-1 overflow-y-auto p-4 space-y-4">
            <AnimatePresence>
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={cn("flex gap-3", message.sender === 'user' ? 'justify-end' : 'justify-start')}
                >
                  {message.sender === 'yalu' && <YaluAvatar mood={message.emotion || 'happy'} small />}
                  
                  <div className={cn(
                    "max-w-[80%] rounded-2xl px-4 py-3",
                    message.sender === 'user' 
                      ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white' 
                      : 'bg-white shadow-lg border border-orange-100 text-gray-800'
                  )}>
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.text}</p>
                    
                    {message.aiProvider && message.sender === 'yalu' && (
                      <div className="mt-2 flex items-center gap-2 text-xs opacity-60">
                        <span>{AI_PROVIDERS[message.aiProvider].icon}</span>
                        <span>Powered by {AI_PROVIDERS[message.aiProvider].name}</span>
                        {message.confidence && (
                          <span className="ml-auto">{Math.round(message.confidence * 100)}% confident</span>
                        )}
                      </div>
                    )}
                    
                    {message.suggestions && (
                      <div className="mt-3 grid grid-cols-2 gap-2">
                        {message.suggestions.map((suggestion, idx) => (
                          <button
                            key={idx}
                            onClick={() => handleSuggestionClick(suggestion)}
                            className="text-left px-3 py-2 text-xs bg-orange-100 hover:bg-orange-200 rounded-lg transition-all hover:scale-105 text-gray-700"
                          >
                            {suggestion}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            
            {isTyping && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-3">
                <YaluAvatar mood="thinking" small />
                <div className="bg-white shadow-md rounded-2xl px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div className="flex gap-1">
                      {[0, 0.2, 0.4].map((delay, i) => (
                        <motion.div
                          key={i}
                          animate={{ y: [0, -5, 0] }}
                          transition={{ duration: 0.6, repeat: Infinity, delay }}
                          className="w-2 h-2 bg-orange-400 rounded-full"
                        />
                      ))}
                    </div>
                    <span className="text-xs text-gray-500">
                      {AI_PROVIDERS[currentAIProvider].name} is thinking...
                    </span>
                  </div>
                </div>
              </motion.div>
            )}
            
            {listeningError && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 p-3 bg-red-100 text-red-700 rounded-lg text-sm"
              >
                <AlertCircle className="h-4 w-4" />
                <span>{listeningError}</span>
              </motion.div>
            )}
            
            {isProcessingVoice && (
              <div className="flex items-center gap-2 text-orange-600 text-sm">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Preparing voice response...</span>
              </div>
            )}
          </div>
          
          {/* Quick Actions */}
          <div className="px-4 py-2 border-t bg-gray-50">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-gray-600">Quick Actions</span>
              {aiStatus !== 'online' && (
                <span className={cn(
                  "text-xs flex items-center gap-1",
                  aiStatus === 'offline' ? 'text-red-600' : 'text-orange-600'
                )}>
                  <AlertCircle className="h-3 w-3" />
                  {aiStatus === 'offline' ? 'AI Offline' : 'Limited AI'}
                </span>
              )}
            </div>
            <div className="flex gap-2 overflow-x-auto pb-2">
              <QuickAction 
                icon={Mic} 
                label={isListening ? "Listening..." : "Voice"} 
                onClick={handleVoiceInput}
                active={isListening}
              />
              <QuickAction icon={Car} label="Vehicles" onClick={() => handleSuggestionClick("Check vehicle availability")} />
              <QuickAction icon={MapPin} label="Tours" onClick={() => handleSuggestionClick("Show me popular tours")} />
              <QuickAction icon={DollarSign} label="Prices" onClick={() => handleSuggestionClick("Tour prices for 4 people")} />
              <QuickAction 
                icon={Zap} 
                label="Continuous" 
                onClick={() => setContinuousListening(!continuousListening)}
                active={continuousListening}
              />
            </div>
          </div>
          
          {/* Input */}
          <div className="p-4 border-t bg-white">
            <div className="flex gap-2">
              <button
                onClick={handleVoiceInput}
                className={cn(
                  "p-2 rounded-full transition-all",
                  isListening 
                    ? "bg-red-500 text-white animate-pulse" 
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                )}
                disabled={isTyping}
              >
                {isListening ? <Mic className="h-5 w-5" /> : <MicOff className="h-5 w-5" />}
              </button>
              
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder={`Ask in ${LANGUAGES[selectedLanguage as keyof typeof LANGUAGES].name}...`}
                className="flex-1 px-4 py-2 border border-orange-200 rounded-full focus:outline-none focus:ring-2 focus:ring-orange-400"
                disabled={isTyping || isListening}
              />
              
              <button
                onClick={() => handleSend()}
                disabled={isTyping || !inputText.trim()}
                className="p-2 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-full hover:opacity-90 disabled:opacity-50 transition-all"
              >
                <Send className="h-5 w-5" />
              </button>
              
              <button
                onClick={() => setAudioEnabled(!audioEnabled)}
                className={cn(
                  "p-2 rounded-full transition-all border",
                  audioEnabled 
                    ? "bg-orange-100 text-orange-600 border-orange-200" 
                    : "bg-gray-100 text-gray-400 border-gray-200"
                )}
              >
                {audioEnabled ? <Volume2 className="h-5 w-5" /> : <VolumeX className="h-5 w-5" />}
              </button>
            </div>
            
            <div className="mt-2 flex items-center justify-between text-xs text-gray-500">
              <span>Powered by multiple AI models</span>
              {continuousListening && <span className="text-orange-600">🎤 Always listening</span>}
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Hidden audio element */}
      <audio ref={audioRef} className="hidden" />
    </motion.div>
  )
}

// Enhanced Yalu Avatar
const YaluAvatar: React.FC<{ mood: string; small?: boolean }> = ({ mood, small = false }) => {
  const size = small ? "w-10 h-10" : "w-12 h-12"
  
  return (
    <motion.div 
      className={cn(
        "relative rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg",
        size
      )}
      animate={mood === 'listening' ? { scale: [1, 1.1, 1] } : {}}
      transition={{ duration: 2, repeat: mood === 'listening' ? Infinity : 0 }}
    >
      <span className="text-xl">🐆</span>
      
      {mood === 'thinking' && (
        <motion.div
          className="absolute -top-1 -right-1"
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        >
          <Brain className="w-4 h-4 text-purple-400" />
        </motion.div>
      )}
      
      {mood === 'excited' && (
        <motion.div
          className="absolute -bottom-1 -right-1"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 1, repeat: Infinity }}
        >
          <Heart className="w-4 h-4 text-red-500" />
        </motion.div>
      )}
      
      {mood === 'listening' && (
        <motion.div
          className="absolute inset-0 rounded-full border-2 border-red-400"
          animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
      )}
      
      {mood === 'alert' && (
        <motion.div
          className="absolute -top-1 -right-1"
          animate={{ opacity: [1, 0, 1] }}
          transition={{ duration: 1, repeat: Infinity }}
        >
          <AlertCircle className="w-4 h-4 text-red-500" />
        </motion.div>
      )}
    </motion.div>
  )
}

// Quick Action Button
const QuickAction: React.FC<{ icon: any; label: string; onClick: () => void; active?: boolean }> = ({ 
  icon: Icon, 
  label, 
  onClick, 
  active = false 
}) => {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex items-center gap-2 px-3 py-1.5 border rounded-full transition-all whitespace-nowrap text-sm",
        active 
          ? "bg-orange-500 text-white border-orange-600"
          : "bg-white hover:bg-orange-50 text-gray-700"
      )}
    >
      <Icon className="h-4 w-4" />
      <span>{label}</span>
    </button>
  )
}

export default SmartYaluAgent
