import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { X, Mic, MicOff, Volume2, VolumeX, Sparkles, Heart, MapPin, Calendar, DollarSign, Users, Send, Globe, Loader2, Car } from 'lucide-react'
import { cn } from '@/lib/utils'
import { YaluFirebaseService } from '@/services/yaluFirebaseService'

interface Message {
  id: string
  text: string
  sender: 'user' | 'yalu'
  timestamp: Date
  emotion?: 'happy' | 'thinking' | 'excited' | 'empathetic' | 'helpful' | 'curious'
  suggestions?: string[]
  language?: string
  toolCalls?: any[]
}

interface YaluEdgeAgentProps {
  isOpen: boolean
  onClose: () => void
}

const YaluEdgeAgent: React.FC<YaluEdgeAgentProps> = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState<Message[]>([])
  const [inputText, setInputText] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [audioEnabled, setAudioEnabled] = useState(true)
  const [isListening, setIsListening] = useState(false)
  const [yaluMood, setYaluMood] = useState<'happy' | 'listening' | 'thinking' | 'speaking' | 'excited'>('happy')
  const [isProcessingVoice, setIsProcessingVoice] = useState(false)
  const [userName, setUserName] = useState<string | null>(null)
  const [sessionId] = useState(() => `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`)
  
  const chatContainerRef = useRef<HTMLDivElement>(null)
  const audioRef = useRef<HTMLAudioElement>(null)
  const recognitionRef = useRef<any>(null)

  // Initialize with personalized greeting based on language
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const storedUserName = localStorage.getItem('yalu_user_name')

      const greetingTime = new Date().getHours()
      const timeGreeting = greetingTime < 12 ? "Good morning" : greetingTime < 17 ? "Good afternoon" : "Good evening"

      const greetingText = storedUserName
        ? `${timeGreeting}, ${storedUserName}! Welcome back! 🙏 I'm Yalu, and I've been planning new Sri Lankan experiences just for you.`
        : `${timeGreeting}! Welcome to Recharge Travels. I'm Yalu, your dedicated Sri Lankan travel assistant. What's your name?`

      const welcomeMessage: Message = {
        id: Date.now().toString(),
        text: greetingText,
        sender: 'yalu',
        timestamp: new Date(),
        emotion: 'happy',
        language: 'en',
        suggestions: storedUserName
          ? [
              "Check vehicle availability 🚗",
              "Tour prices for my group 💰",
              "Popular tours this month 🌟",
              "Weekend getaway ideas 🏖️"
            ]
          : [
              "I'm [your name] 👋",
              "First time in Sri Lanka 🌟",
              "Planning a vacation 🗓️",
              "Just exploring 🔍"
            ]
      }

      setMessages([welcomeMessage])
      setUserName(storedUserName)

      if (audioEnabled) {
        speakResponse(greetingText)
      }
    }
  }, [audioEnabled, isOpen, messages.length])

  // Initialize speech recognition
  useEffect(() => {
    if (typeof window !== 'undefined' && 'webkitSpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition
      recognitionRef.current = new SpeechRecognition()
      recognitionRef.current.continuous = false
      recognitionRef.current.interimResults = false
      recognitionRef.current.lang = 'en-US'

      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript
        setInputText(transcript)
        setIsListening(false)
        handleSend(transcript)
      }

      recognitionRef.current.onerror = () => {
        setIsListening(false)
      }
    }
  }, [])

  // Auto-scroll
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight
    }
  }, [messages])

  // Save conversation on unmount
  useEffect(() => {
    return () => {
      if (messages.length > 0) {
        YaluFirebaseService.storeConversation(
          sessionId,
          messages.map(m => ({ role: m.sender, content: m.text })),
          'en',
          userName || undefined
        )
      }
    }
  }, [messages, sessionId, userName])

  const callEdgeFunction = async (text: string, conversationHistory: any[]) => {
    try {
      // Use Firebase Functions URL in production
      const functionsUrl = import.meta.env.PROD 
        ? 'https://us-central1-recharge-travels-73e76.cloudfunctions.net/yaluEdgeAgent'
        : '/api/yalu-edge-agent'
      
      const response = await fetch(functionsUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: text,
          conversation_history: conversationHistory,
          session_id: sessionId,
          language: 'en'
        })
      })

      if (response.headers.get('content-type')?.includes('audio')) {
        // Handle audio response
        const audioBlob = await response.blob()
        const audioUrl = URL.createObjectURL(audioBlob)
        
        if (audioRef.current) {
          audioRef.current.src = audioUrl
          audioRef.current.play()
        }
      } else {
        // Handle JSON response (fallback)
        const data = await response.json()
        return data
      }
    } catch (error) {
      console.error('Edge function error:', error)
      // Fallback to direct API calls
      return null
    }
  }

  const handleSend = async (text?: string) => {
    const messageText = text || inputText
    if (!messageText.trim() || isTyping) return

    // Check if this is a name introduction
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
      language: 'en'
    }

    setMessages(prev => [...prev, userMessage])
    setInputText('')
    setIsTyping(true)
    setYaluMood('thinking')

    try {
      // Check for tool-based queries
      const lowerText = messageText.toLowerCase()
      let toolResponse = null

      // Vehicle availability check
      if (lowerText.includes('vehicle') || lowerText.includes('car') || lowerText.includes('van')) {
        const dateMatch = messageText.match(/(\d{4}-\d{2}-\d{2})|tomorrow|today|next week/)
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
          passengers: parseInt(messageText.match(/(\d+)\s*(?:people|passengers|pax)/)?.[1] || '4')
        })

        toolResponse = YaluFirebaseService.formatVehicleResponse(vehicleData)
      }

      // Tour pricing check
      else if (lowerText.includes('price') || lowerText.includes('cost') || lowerText.includes('how much')) {
        const paxMatch = messageText.match(/(\d+)\s*(?:people|persons|pax)/)
        const pax = paxMatch ? parseInt(paxMatch[1]) : 2

        // For demo, using a sample tour ID
        const priceData = await YaluFirebaseService.calculateTourPrice({
          tourId: 'sigiriya-day-tour',
          pax,
          date: new Date().toISOString().split('T')[0]
        })

        toolResponse = YaluFirebaseService.formatTourPriceResponse(priceData)
      }

      // Tour search
      else if (lowerText.includes('tour') || lowerText.includes('trip') || lowerText.includes('excursion')) {
        const searchData = await YaluFirebaseService.searchTours({
          query: messageText,
          category: lowerText.includes('beach') ? 'beach' : 
                   lowerText.includes('wildlife') ? 'wildlife' : 
                   lowerText.includes('culture') ? 'culture' : undefined
        })

        toolResponse = YaluFirebaseService.formatTourSearchResponse(searchData)
      }

      let yaluResponse = toolResponse || ''
      
      // If no tool response, use edge function or fallback
      if (!toolResponse) {
        const edgeResponse = await callEdgeFunction(
          messageText,
          messages.map(m => ({ role: m.sender, content: m.text }))
        )

        if (edgeResponse?.text) {
          yaluResponse = edgeResponse.text
        } else {
          // Fallback response
          yaluResponse = getLocalResponse(messageText)
        }
      }

      // Determine emotion
      let emotion: Message['emotion'] = 'happy'
      if (yaluResponse.includes('wonderful') || yaluResponse.includes('amazing')) emotion = 'excited'
      else if (yaluResponse.includes('understand') || yaluResponse.includes('worry')) emotion = 'empathetic'
      else if (yaluResponse.includes('?')) emotion = 'curious'

      const yaluMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: yaluResponse,
        sender: 'yalu',
        timestamp: new Date(),
        emotion,
        suggestions: generateContextualSuggestions(messageText, yaluResponse),
        language: 'en',
        toolCalls: toolResponse ? ['firebase-function'] : []
      }

      setMessages(prev => [...prev, yaluMessage])
      setYaluMood('happy')

      // Speak the response if no edge audio
      if (audioEnabled && !toolResponse) {
        speakResponse(yaluResponse)
      }

    } catch (error) {
      console.error('Error:', error)
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "I apologize for the technical issue. How else may I assist you?",
        sender: 'yalu',
        timestamp: new Date(),
        emotion: 'empathetic'
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsTyping(false)
      setYaluMood('happy')
    }
  }

  const getLocalResponse = (query: string): string => {
    const responses = {
      greeting: "Hello! How may I assist you with your Sri Lankan travel plans today?",
      beaches: "Sri Lanka has amazing beaches! The south coast (Mirissa, Unawatuna) is best from November to April, while the east coast (Arugam Bay, Pasikudah) is perfect from May to September.",
      wildlife: "For wildlife, I recommend Yala National Park for leopards, Udawalawe for elephants, and Minneriya for the famous elephant gathering. Would you like me to check safari availability?",
      default: "I'd be happy to help you explore Sri Lanka! You can ask me about beaches, wildlife, cultural sites, tours, or vehicle rentals. How may I assist you?"
    }

    const lowerQuery = query.toLowerCase()

    if (lowerQuery.includes('hello') || lowerQuery.includes('hi')) return responses.greeting
    if (lowerQuery.includes('beach')) return responses.beaches
    if (lowerQuery.includes('wildlife') || lowerQuery.includes('safari')) return responses.wildlife

    return responses.default
  }

  const speakResponse = async (text: string) => {
    const elevenLabsKey = import.meta.env.VITE_ELEVENLABS_API_KEY
    
    if (!elevenLabsKey) {
      // Fallback to browser TTS if no ElevenLabs key
      if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(text)
        utterance.rate = 0.9
        utterance.pitch = 1.1
        utterance.lang = 'en-US'
        speechSynthesis.speak(utterance)
      }
      return
    }
    
    setIsProcessingVoice(true)
    setYaluMood('speaking')
    
    try {
      const response = await fetch(
        'https://api.elevenlabs.io/v1/text-to-speech/h8iF6fuqRJODTFvWSevk', // Your custom voice
        {
          method: 'POST',
          headers: {
            'xi-api-key': elevenLabsKey,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            text,
            model_id: 'eleven_multilingual_v2',
            voice_settings: {
              stability: 0.5,
              similarity_boost: 0.8,
              style: 0.25,
              use_speaker_boost: true
            }
          })
        }
      )
      
      if (response.ok) {
        const audioBlob = await response.blob()
        const audioUrl = URL.createObjectURL(audioBlob)
        
        if (audioRef.current) {
          audioRef.current.src = audioUrl
          audioRef.current.play()
        }
      } else {
        // Fallback to browser TTS if ElevenLabs fails
        if ('speechSynthesis' in window) {
          const utterance = new SpeechSynthesisUtterance(text)
          utterance.rate = 0.9
          utterance.pitch = 1.1
          speechSynthesis.speak(utterance)
        }
      }
    } catch (error) {
      console.error('ElevenLabs error:', error)
      // Fallback to browser TTS
      if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(text)
        utterance.rate = 0.9
        utterance.pitch = 1.1
        speechSynthesis.speak(utterance)
      }
    } finally {
      setIsProcessingVoice(false)
      setYaluMood('happy')
    }
  }

  const generateContextualSuggestions = (userText: string, yaluResponse: string): string[] => {
    const combined = (userText + ' ' + yaluResponse).toLowerCase()
    
    if (combined.includes('vehicle') || combined.includes('car')) {
      return ["Check for tomorrow 📅", "Need a larger vehicle 🚐", "Add driver guide 👨‍✈️", "Multi-day rental 📆"]
    } else if (combined.includes('price') || combined.includes('cost')) {
      return ["Include meals 🍛", "Group discount? 👥", "Payment options 💳", "Cancellation policy 📋"]
    } else if (combined.includes('tour')) {
      return ["Check availability 📅", "Private tour option 🎯", "Reviews & photos 📸", "Similar tours 🔄"]
    }
    
    return ["Vehicle rental 🚗", "Popular tours 🌟", "This week's deals 🎉", "Contact support 📞"]
  }

  const handleVoiceInput = () => {
    if (!recognitionRef.current) return
    
    if (isListening) {
      recognitionRef.current.stop()
      setIsListening(false)
    } else {
      recognitionRef.current.start()
      setIsListening(true)
      setYaluMood('listening')
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
                <CardTitle className="text-xl font-bold">Yalu AI Assistant</CardTitle>
                <p className="text-sm opacity-90">Recharge Travels Sri Lanka</p>
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
                    "max-w-[80%] rounded-2xl px-4 py-3",
                    message.sender === 'user' 
                      ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white' 
                      : 'bg-white shadow-lg border border-orange-100 text-gray-800'
                  )}>
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.text}</p>
                    
                    {message.toolCalls && message.toolCalls.length > 0 && (
                      <div className="mt-2 flex items-center gap-1 text-xs opacity-70">
                        <Sparkles className="h-3 w-3" />
                        <span>Live data</span>
                      </div>
                    )}
                    
                    {message.suggestions && (
                      <div className="mt-3 space-y-2">
                        {message.suggestions.map((suggestion, idx) => (
                          <button
                            key={idx}
                            onClick={() => handleSuggestionClick(suggestion)}
                            className="block w-full text-left px-3 py-2 text-sm bg-orange-100 hover:bg-orange-200 rounded-lg transition-colors text-gray-700"
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
                </div>
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
            <div className="flex gap-2 overflow-x-auto pb-2">
              <QuickAction icon={Car} label="Vehicles" onClick={() => handleSuggestionClick("Check vehicle availability for tomorrow")} />
              <QuickAction icon={MapPin} label="Tours" onClick={() => handleSuggestionClick("Show popular tours")} />
              <QuickAction icon={DollarSign} label="Pricing" onClick={() => handleSuggestionClick("Tour prices for 4 people")} />
              <QuickAction icon={Calendar} label="Available" onClick={() => handleSuggestionClick("What's available this weekend?")} />
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
                placeholder="Ask anything about Sri Lanka..."
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
            
            <div className="mt-2 text-xs text-gray-500 text-center">
              Powered by AI • Real-time data from Firebase
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Hidden audio element for voice playback */}
      <audio ref={audioRef} className="hidden" />
    </motion.div>
  )
}

// Yalu Avatar Component
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
          <Sparkles className="w-4 h-4 text-yellow-300" />
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
    </motion.div>
  )
}

// Quick Action Button
const QuickAction: React.FC<{ icon: any; label: string; onClick: () => void }> = ({ icon: Icon, label, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-2 px-3 py-1.5 bg-white border rounded-full hover:bg-orange-50 transition-colors whitespace-nowrap text-sm"
    >
      <Icon className="h-4 w-4 text-orange-600" />
      <span className="text-gray-700">{label}</span>
    </button>
  )
}

export default YaluEdgeAgent
