import React, { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { X, Mic, MicOff, Volume2, VolumeX, Sparkles, Heart, MapPin, Calendar, DollarSign, Users, Send, Globe, Loader2, Car, Brain, Zap, AlertCircle, Compass, Camera, Utensils, Hotel, Plane, Clock, Sun, Cloud, Info, Phone, MessageCircle, Shield, Palmtree, Ship } from 'lucide-react'
import { cn } from '@/lib/utils'
import { YaluFirebaseService } from '@/services/yaluFirebaseService'

interface Message {
  id: string
  text: string
  sender: 'user' | 'yalu'
  timestamp: Date
  emotion?: 'happy' | 'thinking' | 'excited' | 'empathetic' | 'helpful' | 'curious' | 'alert'
  suggestions?: string[]
  visualData?: any
  actionButtons?: Array<{
    label: string
    action: string
    icon?: any
  }>
  toolCalls?: string[]
  language?: string
}

interface UserContext {
  name?: string
  country?: string
  detectedLanguage?: string
  interests: string[]
  budget?: 'budget' | 'mid-range' | 'luxury'
  travelDates?: { start?: Date; end?: Date }
  groupSize?: number
  previousQueries: string[]
  currentIntent?: string
  sessionId: string
  isReturningUser?: boolean
}

interface YaluRechargeAgentProps {
  isOpen: boolean
  onClose: () => void
}

// Comprehensive language mappings per spec
const LANGUAGE_GREETINGS = {
  // Brazil
  'BR': { greeting: 'Olá', language: 'pt', name: 'Portuguese' },
  // India - Northern states
  'IN-RJ': { greeting: 'Namaste', language: 'hi', name: 'Hindi' }, // Rajasthan
  'IN-UP': { greeting: 'Namaste', language: 'hi', name: 'Hindi' }, // Uttar Pradesh
  'IN-UK': { greeting: 'Namaste', language: 'hi', name: 'Hindi' }, // Uttarakhand
  'IN-MP': { greeting: 'Namaste', language: 'hi', name: 'Hindi' }, // Madhya Pradesh
  'IN-HP': { greeting: 'Namaste', language: 'hi', name: 'Hindi' }, // Himachal Pradesh
  'IN-HR': { greeting: 'Ram Ram', language: 'hi', name: 'Hindi' }, // Haryana
  'IN-DL': { greeting: 'Namaste', language: 'hi', name: 'Hindi' }, // Delhi
  'IN-PB': { greeting: 'Sat Sri Akaal', language: 'pa', name: 'Punjabi' }, // Punjab
  'IN-JK': { greeting: 'As-salamu alaykum', language: 'ks', name: 'Kashmiri' }, // J&K
  'IN-LA': { greeting: 'Jullay', language: 'lbj', name: 'Ladakhi' }, // Ladakh
  'IN-BR': { greeting: 'Pranam', language: 'hi', name: 'Hindi' }, // Bihar
  'IN-CT': { greeting: 'Jai Johar', language: 'hi', name: 'Hindi' }, // Chhattisgarh
  'IN-JH': { greeting: 'Johar', language: 'hi', name: 'Hindi' }, // Jharkhand
  // India - Southern states
  'IN-TN': { greeting: 'Hello', language: 'ta', name: 'Tamil' }, // Tamil Nadu
  'IN-KA': { greeting: 'Namaskara', language: 'kn', name: 'Kannada' }, // Karnataka
  'IN-KL': { greeting: 'Namaskaram', language: 'ml', name: 'Malayalam' }, // Kerala
  'IN-AP': { greeting: 'Namaste', language: 'te', name: 'Telugu' }, // Andhra Pradesh
  'IN-TG': { greeting: 'Namaste', language: 'te', name: 'Telugu' }, // Telangana
  // Sri Lanka
  'LK': { greeting: 'Hello', language: 'si', name: 'Sinhala' }, // Could be Tamil based on user
  // Other countries
  'US': { greeting: 'Hello', language: 'en', name: 'English' },
  'GB': { greeting: 'Hello', language: 'en', name: 'English' },
  'AU': { greeting: 'G\'day', language: 'en', name: 'English' },
  'DE': { greeting: 'Hallo', language: 'de', name: 'German' },
  'FR': { greeting: 'Bonjour', language: 'fr', name: 'French' },
  'CN': { greeting: '你好', language: 'zh', name: 'Chinese' },
  'JP': { greeting: 'こんにちは', language: 'ja', name: 'Japanese' },
  'RU': { greeting: 'Здравствуйте', language: 'ru', name: 'Russian' },
  'AE': { greeting: 'مرحبا', language: 'ar', name: 'Arabic' },
  // Default
  'default': { greeting: 'Hello', language: 'en', name: 'English' }
}

// Recharge Travels knowledge base
const RECHARGE_KNOWLEDGE = {
  services: {
    airport_transfers: {
      locations: ['CMB (Colombo)', 'JAF (Jaffna)', 'DIW (Dickwella)'],
      vehicles: ['Sedans', 'Vans', 'SUVs', '45-seat coaches'],
      availability: '24/7 dispatch'
    },
    tours: {
      types: ['Private tours', 'Group tours', 'Standard', 'Premium', 'Luxury'],
      special: ['Jaffna cultural tour', 'Delft Island day-trip', 'Kayts cycling'],
      wildlife: ['Yala Safari', 'Wilpattu Safari', 'Minneriya', 'Kaudulla', 'Pigeon Island snorkeling']
    },
    vehicles: {
      chauffeur_driven: true,
      self_drive: 'Available on request (min age 23)',
      fleet: ['Cars', 'Vans', 'SUVs', 'Coaches']
    },
    accommodation: {
      partners: ['3★ hotels', '4★ hotels', '5★ resorts'],
      booking: 'Dynamic pricing available'
    }
  },
  sri_lanka_2025: {
    visa: {
      eta_required: true,
      duration: '30 days on arrival',
      extension: 'Up to 6 months',
      fees: 'USD 92-180 depending on passport'
    },
    visitor_stats: {
      ytd_arrivals: '1.3 million (as of July 22, 2025)',
      trend: 'Strongest since 2018'
    },
    seasons: {
      west_south: 'Dec-Mar (dry season, whale watching)',
      east: 'May-Sep (dry season, surfing Arugam Bay)'
    },
    highlights: [
      'Sigiriya Rock Fortress',
      'Ella Nine-Arch Bridge',
      'Jaffna Heritage Trail',
      'Kandy Esala Perahera',
      'Minneriya Elephant Gathering',
      'Tea Estates',
      'Ravana Falls'
    ],
    transport: {
      domestic_flights: 'CMB ↔ JAF, BIA ↔ DIW',
      ferry: 'NEW: KKS-Nagapattinam ferry (since Aug 17, 2024)'
    }
  },
  company_info: {
    established: '2014',
    awards: 'TripAdvisor Certificate of Excellence 2017-19',
    reviews: '250+ 5-star reviews',
    social: '24k Facebook followers',
    rating: '4.5-star Google rating',
    slogan: 'Recharge Travels – Redefine your journey, refresh your soul'
  }
}

const YaluRechargeAgent: React.FC<YaluRechargeAgentProps> = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState<Message[]>([])
  const [inputText, setInputText] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [audioEnabled, setAudioEnabled] = useState(true)
  const [isListening, setIsListening] = useState(false)
  const [yaluMood, setYaluMood] = useState<'happy' | 'listening' | 'thinking' | 'speaking' | 'excited' | 'alert'>('happy')
  const [userContext, setUserContext] = useState<UserContext>({
    interests: [],
    previousQueries: [],
    sessionId: `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  })
  const [showVisualData, setShowVisualData] = useState<any>(null)
  const [isProcessingVoice, setIsProcessingVoice] = useState(false)
  
  const chatContainerRef = useRef<HTMLDivElement>(null)
  const audioRef = useRef<HTMLAudioElement>(null)
  const recognitionRef = useRef<any>(null)
  
  const openAIKey = import.meta.env.VITE_OPENAI_API_KEY
  const elevenLabsKey = import.meta.env.VITE_ELEVENLABS_API_KEY
  const pineconeKey = import.meta.env.VITE_PINECONE_API_KEY

  // Initialize with proper multi-language greeting
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      initializeGreeting()
    }
  }, [isOpen])

  // Initialize greeting based on geolocation
  const initializeGreeting = async () => {
    try {
      // Get geolocation data (in production, use ipwhois.io or ipgeolocation.io)
      const geoData = await getGeolocation()
      
      // Determine greeting based on location
      const countryCode = geoData.country_code || 'US'
      const region = geoData.region_code || ''
      const lookupKey = region ? `${countryCode}-${region}` : countryCode
      
      const greetingInfo = LANGUAGE_GREETINGS[lookupKey] || LANGUAGE_GREETINGS[countryCode] || LANGUAGE_GREETINGS.default
      
      // Build the multi-part greeting as specified
      const nativeGreeting = greetingInfo.greeting
      const fullGreeting = `${nativeGreeting}. Welcome to Recharge Travels. I'm Yalu, your AI assistant. How may I help you?`
      
      // Update user context
      setUserContext(prev => ({
        ...prev,
        country: countryCode,
        detectedLanguage: greetingInfo.language
      }))
      
      // Create welcome message
      const welcomeMessage: Message = {
        id: Date.now().toString(),
        text: fullGreeting,
        sender: 'yalu',
        timestamp: new Date(),
        emotion: 'happy',
        language: greetingInfo.language,
        suggestions: [
          "Plan Sri Lanka trip 🗺️",
          "Check visa requirements 📋",
          "Airport transfers 🚗",
          "Wildlife safaris 🦁"
        ],
        actionButtons: [
          { label: "Tours", action: "browse-tours", icon: Compass },
          { label: "Vehicles", action: "check-vehicles", icon: Car },
          { label: "Contact", action: "contact-human", icon: Phone }
        ]
      }
      
      setMessages([welcomeMessage])
      
      // Speak the greeting
      if (audioEnabled && elevenLabsKey) {
        await speakWithElevenLabs(fullGreeting, greetingInfo.language)
      }
      
    } catch (error) {
      console.error('Geolocation error:', error)
      // Fallback greeting
      const fallbackGreeting = "Hello. Welcome to Recharge Travels. I'm Yalu, your AI assistant. How may I help you?"
      setMessages([{
        id: Date.now().toString(),
        text: fallbackGreeting,
        sender: 'yalu',
        timestamp: new Date(),
        emotion: 'happy',
        suggestions: ["Explore Sri Lanka 🇱🇰", "Our services 📋", "Contact us 📞", "Travel tips 💡"]
      }])
    }
  }

  // Mock geolocation function (replace with actual API call)
  const getGeolocation = async () => {
    // In production, call ipwhois.io or ipgeolocation.io
    // For demo, return mock data
    return {
      country_code: 'LK',
      region_code: 'WP',
      country: 'Sri Lanka',
      region: 'Western Province'
    }
  }

  // Generate response with Recharge Travels knowledge
  const generateResponse = async (query: string): Promise<string> => {
    const systemPrompt = `You are Yalu AI Assistant for Recharge Travels & Tours Ltd., Jaffna, Sri Lanka.
    
Company Info:
- Established: 2014
- Awards: TripAdvisor Certificate of Excellence 2017-19
- 250+ 5-star reviews, 24k Facebook followers, 4.5-star Google rating
- Slogan: "Recharge Travels – Redefine your journey, refresh your soul"

Your personality:
- Warm, polite, human-sounding
- Short sentences, active voice
- Never robotic - like a seasoned Sri Lankan tour guide talking to a friend
- Use emojis only if user does first

Current Sri Lanka Info (2025):
- Visa: All tourists need ETA (30 days, extendable to 6 months, USD 92-180)
- Visitors: 1.3 million YTD (July 22, 2025), strongest since 2018
- Seasons: West/South dry Dec-Mar (whale watching), East dry May-Sep (surfing)
- NEW: KKS-Nagapattinam ferry since Aug 17, 2024

Our Services:
1. Airport transfers (CMB, JAF, DIW) - 24/7
2. Private & group tours (standard/premium/luxury)
3. Northern Province specials (Jaffna cultural, Delft Island, Kayts cycling)
4. Wildlife safaris (Yala, Wilpattu, Minneriya)
5. Chauffeur-driven hire, self-drive (min age 23)
6. Hotel partnerships (3★/4★/5★)

Always end with: "How else may I assist you?"`

    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${openAIKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4-turbo-preview',
          messages: [
            { role: 'system', content: systemPrompt },
            ...messages.slice(-5).map(m => ({
              role: m.sender === 'user' ? 'user' : 'assistant',
              content: m.text
            })),
            { role: 'user', content: query }
          ],
          temperature: 0.7,
          max_tokens: 400
        })
      })
      
      if (!response.ok) throw new Error('API request failed')
      
      const data = await response.json()
      return data.choices[0].message.content
    } catch (error) {
      console.error('OpenAI error:', error)
      return getFallbackResponse(query)
    }
  }

  // Fallback responses based on Recharge knowledge
  const getFallbackResponse = (query: string): string => {
    const lowerQuery = query.toLowerCase()
    
    if (lowerQuery.includes('visa') || lowerQuery.includes('eta')) {
      return "All tourists to Sri Lanka need an Electronic Travel Authorization (ETA). It's valid for 30 days on arrival and can be extended up to 6 months. Fees range from USD 92-180 depending on your passport. You can apply online before travel. How else may I assist you?"
    }
    
    if (lowerQuery.includes('airport') || lowerQuery.includes('transfer')) {
      return "We provide 24/7 airport transfers from Colombo (CMB), Jaffna (JAF), and Dickwella (DIW). Our fleet includes sedans, vans, SUVs, and 45-seat coaches. Would you like to check availability for specific dates? How else may I assist you?"
    }
    
    if (lowerQuery.includes('jaffna') || lowerQuery.includes('north')) {
      return "Our Northern Province specials include the Jaffna cultural tour, Delft Island day-trip, and Kayts cycling adventure. We're based in Jaffna since 2014 and know every hidden gem! Interested in exploring the north? How else may I assist you?"
    }
    
    return "I'd be happy to help you explore Sri Lanka with Recharge Travels. We offer airport transfers, private tours, wildlife safaris, and vehicle hire. What specific information can I provide? How else may I assist you?"
  }

  // Enhanced ElevenLabs integration with break tags for long text
  const speakWithElevenLabs = async (text: string, language: string = 'en') => {
    if (!elevenLabsKey || !audioEnabled) return
    
    setIsProcessingVoice(true)
    setYaluMood('speaking')
    
    try {
      // Add break tags for texts longer than 300 chars
      let processedText = text
      if (text.length > 300) {
        processedText = text.split('. ').join('. <break time="300ms"/> ')
      }
      
      const response = await fetch(
        'https://api.elevenlabs.io/v1/text-to-speech/h8iF6fuqRJODTFvWSevk',
        {
          method: 'POST',
          headers: {
            'xi-api-key': elevenLabsKey,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            text: processedText,
            model_id: 'eleven_multilingual_v2',
            voice_settings: {
              stability: 0.5,
              similarity_boost: 0.75,
              style: 0.3,
              use_speaker_boost: true
            },
            language_code: language
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
      }
    } catch (error) {
      console.error('Voice synthesis error:', error)
    } finally {
      setIsProcessingVoice(false)
      setYaluMood('happy')
    }
  }

  // Handle tool calls
  const handleToolCall = async (action: string, params?: any) => {
    switch (action) {
      case 'searchTours':
        // Call Pinecone for tour search
        return "I found several tours matching your interests. Our most popular are the Jaffna cultural tour and wildlife safaris at Yala and Wilpattu. Would you like details on any specific tour?"
        
      case 'vehicleAvailability':
        // Check real-time fleet inventory
        {
          const vehicleData = await YaluFirebaseService.checkVehicleAvailability({
            date: params?.date || new Date().toISOString().split('T')[0],
            passengers: params?.passengers || 4
          })
          return YaluFirebaseService.formatVehicleResponse(vehicleData)
        }
        
      case 'quoteTour':
        // Calculate tour pricing
        {
          const priceData = await YaluFirebaseService.calculateTourPrice({
            tourId: params?.tourId || 'jaffna-cultural-tour',
            pax: params?.pax || 2,
            date: params?.date || new Date().toISOString().split('T')[0]
          })
          return YaluFirebaseService.formatTourPriceResponse(priceData)
        }
        
      case 'bookService':
        // Initiate booking
        return "I'll help you book this service. Please provide your contact details and our team will confirm within 15 minutes."
        
      default:
        return null
    }
  }

  // Handle message sending
  const handleSend = async (text?: string) => {
    const messageText = text || inputText
    if (!messageText.trim() || isTyping) return

    const userMessage: Message = {
      id: Date.now().toString(),
      text: messageText,
      sender: 'user',
      timestamp: new Date(),
      language: userContext.detectedLanguage
    }

    setMessages(prev => [...prev, userMessage])
    setInputText('')
    setIsTyping(true)
    setYaluMood('thinking')

    try {
      // Check for specific intents that require tool calls
      const lowerText = messageText.toLowerCase()
      let response: string
      const toolCalls: string[] = []
      
      if (lowerText.includes('vehicle') || lowerText.includes('car') || lowerText.includes('transfer')) {
        response = await handleToolCall('vehicleAvailability')
        toolCalls.push('vehicleAvailability')
      } else if (lowerText.includes('price') || lowerText.includes('cost') || lowerText.includes('quote')) {
        response = await handleToolCall('quoteTour')
        toolCalls.push('quoteTour')
      } else if (lowerText.includes('book') || lowerText.includes('reserve')) {
        response = await handleToolCall('bookService')
        toolCalls.push('bookService')
      } else {
        response = await generateResponse(messageText)
      }
      
      // Update user context
      setUserContext(prev => ({
        ...prev,
        previousQueries: [...prev.previousQueries, messageText].slice(-10)
      }))
      
      // Determine emotion
      let emotion: Message['emotion'] = 'helpful'
      if (response.includes('exciting') || response.includes('wonderful')) {
        emotion = 'excited'
      } else if (response.includes('sorry') || response.includes('apologize')) {
        emotion = 'empathetic'
      }

      const yaluMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: response,
        sender: 'yalu',
        timestamp: new Date(),
        emotion,
        toolCalls: toolCalls.length > 0 ? toolCalls : undefined,
        suggestions: generateContextualSuggestions(messageText, response),
        language: userContext.detectedLanguage
      }

      setMessages(prev => [...prev, yaluMessage])
      setYaluMood('happy')
      
      // Speak the response
      if (audioEnabled) {
        await speakWithElevenLabs(response, userContext.detectedLanguage || 'en')
      }

    } catch (error) {
      console.error('Error:', error)
      
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "I apologize for the technical difficulty. Please try again or contact our 24/7 support team directly. How else may I assist you?",
        sender: 'yalu',
        timestamp: new Date(),
        emotion: 'empathetic',
        actionButtons: [
          { label: "Retry", action: "retry", icon: Zap },
          { label: "Contact Support", action: "contact-human", icon: Phone }
        ]
      }
      
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsTyping(false)
    }
  }

  // Generate contextual suggestions
  const generateContextualSuggestions = (query: string, response: string): string[] => {
    const combined = (query + ' ' + response).toLowerCase()
    
    if (combined.includes('visa') || combined.includes('eta')) {
      return ["Apply for ETA online 🌐", "Visa extension process 📋", "Entry requirements 📝", "Tourist police contacts 👮"]
    }
    
    if (combined.includes('jaffna') || combined.includes('north')) {
      return ["Jaffna food tour 🍛", "Delft Island ferry ⛴️", "Nallur temple timings 🛕", "KKS-India ferry info 🚢"]
    }
    
    if (combined.includes('wildlife') || combined.includes('safari')) {
      return ["Best safari times 🦁", "Yala vs Wilpattu 🐆", "What to bring 🎒", "Photography tips 📸"]
    }
    
    if (combined.includes('beach') || combined.includes('coast')) {
      return ["Whale watching season 🐋", "Surf spots 🏄", "Beach hotels 🏨", "Water activities 🏊"]
    }
    
    return ["Our tour packages 📦", "Vehicle options 🚗", "Current promotions 🎉", "Contact team 📞"]
  }

  // Initialize speech recognition
  useEffect(() => {
    if (typeof window !== 'undefined' && 'webkitSpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition
      const recognition = new SpeechRecognition()
      
      recognition.continuous = false
      recognition.interimResults = true
      
      recognition.onresult = (event: any) => {
        const transcript = Array.from(event.results)
          .map((result: any) => result[0].transcript)
          .join('')
        
        setInputText(transcript)
        
        if (event.results[event.results.length - 1].isFinal) {
          handleSend(transcript)
        }
      }
      
      recognition.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error)
        setIsListening(false)
        setYaluMood('alert')
      }
      
      recognition.onend = () => {
        setIsListening(false)
      }
      
      recognitionRef.current = recognition
    }
  }, [userContext.detectedLanguage])

  // Handle voice input
  const handleVoiceInput = () => {
    if (!recognitionRef.current) return
    
    if (isListening) {
      recognitionRef.current.stop()
      setIsListening(false)
    } else {
      // Set recognition language based on detected language
      if (userContext.detectedLanguage) {
        recognitionRef.current.lang = userContext.detectedLanguage === 'si' ? 'si-LK' :
                                     userContext.detectedLanguage === 'ta' ? 'ta-LK' :
                                     userContext.detectedLanguage === 'hi' ? 'hi-IN' : 'en-US'
      }
      recognitionRef.current.start()
      setIsListening(true)
      setYaluMood('listening')
    }
  }

  // Handle action button clicks
  const handleActionClick = (action: string) => {
    switch (action) {
      case 'browse-tours':
        handleSend("Show me your tour packages")
        break
      case 'check-vehicles':
        handleSend("What vehicles are available?")
        break
      case 'contact-human':
        handleSend("I'd like to speak with a human agent")
        break
      case 'retry':
        handleSend(messages[messages.length - 2]?.text || "Hello")
        break
      default:
        handleSend(action)
    }
  }

  // Auto-scroll
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight
    }
  }, [messages])

  if (!isOpen) return null

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9, y: 20 }}
      className="fixed bottom-4 right-4 z-50"
    >
      <Card className="w-[500px] h-[700px] shadow-2xl border-0 overflow-hidden bg-gradient-to-br from-white to-orange-50">
        <CardHeader className="bg-gradient-to-r from-amber-500 to-orange-600 text-white p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <YaluAvatar mood={yaluMood} />
              <div>
                <CardTitle className="text-xl font-bold flex items-center gap-2">
                  Yalu AI Assistant
                  <Shield className="h-4 w-4 opacity-70" />
                </CardTitle>
                <p className="text-sm opacity-90 flex items-center gap-2">
                  Recharge Travels & Tours Ltd.
                  <span className="text-xs bg-white/20 px-2 py-0.5 rounded">Est. 2014</span>
                </p>
              </div>
            </div>
            <button onClick={onClose} className="text-white/80 hover:text-white">
              <X className="h-5 w-5" />
            </button>
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
                    "max-w-[85%] rounded-2xl px-4 py-3",
                    message.sender === 'user' 
                      ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white' 
                      : 'bg-white shadow-lg border border-orange-100'
                  )}>
                    <p className="text-sm leading-relaxed whitespace-pre-wrap text-gray-800">
                      {message.text}
                    </p>
                    
                    {/* Tool calls indicator */}
                    {message.toolCalls && message.toolCalls.length > 0 && (
                      <div className="mt-2 flex items-center gap-2 text-xs text-gray-500">
                        <Sparkles className="h-3 w-3" />
                        <span>Live data from: {message.toolCalls.join(', ')}</span>
                      </div>
                    )}
                    
                    {/* Visual data display */}
                    {message.visualData && (
                      <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                        {/* Render visual data based on type */}
                      </div>
                    )}
                    
                    {/* Action buttons */}
                    {message.actionButtons && (
                      <div className="mt-3 flex flex-wrap gap-2">
                        {message.actionButtons.map((button, idx) => {
                          const Icon = button.icon
                          return (
                            <button
                              key={idx}
                              onClick={() => handleActionClick(button.action)}
                              className="flex items-center gap-2 px-3 py-1.5 bg-orange-100 hover:bg-orange-200 rounded-lg transition-all text-sm text-gray-700"
                            >
                              {Icon && <Icon className="h-4 w-4" />}
                              {button.label}
                            </button>
                          )
                        })}
                      </div>
                    )}
                    
                    {/* Suggestions */}
                    {message.suggestions && (
                      <div className="mt-3 grid grid-cols-2 gap-2">
                        {message.suggestions.map((suggestion, idx) => (
                          <button
                            key={idx}
                            onClick={() => handleSend(suggestion)}
                            className="text-left px-3 py-2 text-xs bg-orange-50 hover:bg-orange-100 rounded-lg transition-all text-gray-700 border border-orange-200"
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
                      Preparing response...
                    </span>
                  </div>
                </div>
              </motion.div>
            )}
            
            {isProcessingVoice && (
              <div className="flex items-center gap-2 text-orange-600 text-sm">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Generating voice response...</span>
              </div>
            )}
          </div>
          
          {/* Quick Actions Bar */}
          <div className="px-4 py-2 bg-gradient-to-r from-orange-50 to-amber-50 border-t border-orange-100">
            <div className="flex items-center justify-between text-xs text-gray-600 mb-2">
              <span className="flex items-center gap-1">
                <Palmtree className="h-3 w-3" />
                Quick Actions
              </span>
              <span className="flex items-center gap-1">
                <Globe className="h-3 w-3" />
                {userContext.country ? `Detected: ${userContext.country}` : 'Global'}
              </span>
            </div>
            <div className="flex gap-2 overflow-x-auto pb-1">
              <QuickAction icon={Plane} label="Transfers" onClick={() => handleSend("Airport transfer options")} />
              <QuickAction icon={Compass} label="Tours" onClick={() => handleSend("Show tour packages")} />
              <QuickAction icon={Car} label="Vehicles" onClick={() => handleSend("Vehicle availability")} />
              <QuickAction icon={Hotel} label="Hotels" onClick={() => handleSend("Hotel partners")} />
              <QuickAction icon={Info} label="Visa" onClick={() => handleSend("Visa requirements")} />
              <QuickAction icon={Ship} label="Ferry" onClick={() => handleSend("KKS-Nagapattinam ferry")} />
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
                placeholder="Ask about Sri Lanka travel, tours, or transfers..."
                className="flex-1 px-4 py-2 border border-orange-200 rounded-full focus:outline-none focus:ring-2 focus:ring-orange-400"
                disabled={isTyping || isListening}
              />
              
              <button
                onClick={() => handleSend()}
                disabled={isTyping || !inputText.trim()}
                className="p-2 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-full hover:opacity-90 disabled:opacity-50"
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
              <span className="flex items-center gap-1">
                <Shield className="h-3 w-3" />
                TripAdvisor Excellence • 250+ 5★ Reviews
              </span>
              <span>Since 2014</span>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Hidden audio element */}
      <audio ref={audioRef} className="hidden" />
    </motion.div>
  )
}

// Enhanced Yalu Avatar with Recharge branding
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
const QuickAction: React.FC<{ icon: any; label: string; onClick: () => void }> = ({ 
  icon: Icon, 
  label, 
  onClick
}) => {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-orange-50 border border-orange-200 rounded-full transition-all whitespace-nowrap text-xs text-gray-700"
    >
      <Icon className="h-3.5 w-3.5 text-orange-600" />
      <span>{label}</span>
    </button>
  )
}

export default YaluRechargeAgent
