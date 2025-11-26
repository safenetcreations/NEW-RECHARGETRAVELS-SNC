import React, { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { 
  X, Mic, MicOff, Volume2, VolumeX, Sparkles, Heart, MapPin, 
  Calendar, DollarSign, Users, Send, Camera, TreePine, Waves,
  Sun, Moon, Star, Zap, Globe, Compass, Hotel, Car
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface Message {
  id: string
  text: string
  sender: 'user' | 'yalu'
  timestamp: Date
  emotion?: 'happy' | 'thinking' | 'excited' | 'empathetic' | 'helpful' | 'curious'
  suggestions?: string[]
  isTyping?: boolean
}

interface EnhancedYaluLeopardAgentProps {
  isOpen: boolean
  onClose: () => void
}

// Enhanced Sri Lankan knowledge base for faster responses
const quickResponses = {
  greeting: {
    patterns: ['hello', 'hi', 'hey', 'ayubowan'],
    responses: [
      "Hello! 🙏 Welcome to Sri Lanka! I'm Yalu, your friendly leopard guide! How can I make your Sri Lankan adventure unforgettable today?",
      "Hello there! 🐆 Ready to explore the Pearl of the Indian Ocean? I know all the best spots!",
      "Greetings, traveler! 🌴 From ancient ruins to pristine beaches, I'm here to guide you through paradise!"
    ]
  },
  beaches: {
    patterns: ['beach', 'coast', 'swimming', 'surf'],
    responses: [
      "🏖️ Sri Lanka's beaches are legendary! South coast (Nov-Apr): Mirissa for whales, Unawatuna for swimming, Weligama for surfing. East coast (May-Oct): Arugam Bay for world-class surf, Pasikudah for calm waters!",
      "🌊 Beach lover? Try Tangalle for untouched beauty, Hiriketiya for the vibe, or Nilaveli for crystal waters! Each coast has its season - which month are you visiting?"
    ]
  },
  wildlife: {
    patterns: ['safari', 'elephant', 'leopard', 'wildlife', 'animals'],
    responses: [
      "🐘 Wildlife adventures await! Yala for leopards (like me! 🐆), Udawalawe for elephants, Wilpattu for diversity, Minneriya for the great elephant gathering (Aug-Sep). Morning safaris are magical!",
      "🦌 Fun fact: Sri Lanka has the highest leopard density in the world! Plus 26 national parks with elephants, sloth bears, peacocks, and 400+ bird species!"
    ]
  },
  culture: {
    patterns: ['temple', 'culture', 'history', 'sigiriya', 'kandy'],
    responses: [
      "🛕 Cultural Triangle treasures: Sigiriya Rock Fortress (sunrise is breathtaking!), Sacred Kandy & Temple of Tooth, ancient Anuradhapura, cave temples of Dambulla. Dress modestly for temples!",
      "🎭 Experience living culture: Kandy Perahera festival (July/Aug), traditional mask making in Ambalangoda, tea ceremonies in Nuwara Eliya. Each tells a 2500-year story!"
    ]
  }
}

const EnhancedYaluLeopardAgent: React.FC<EnhancedYaluLeopardAgentProps> = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState<Message[]>([])
  const [inputText, setInputText] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [audioEnabled, setAudioEnabled] = useState(true)
  const [yaluMood, setYaluMood] = useState<'happy' | 'listening' | 'thinking' | 'speaking' | 'excited'>('happy')
  const [isListening, setIsListening] = useState(false)
  const [currentTime, setCurrentTime] = useState(new Date())
  
  const chatContainerRef = useRef<HTMLDivElement>(null)
  const openAIKey = import.meta.env.VITE_OPENAI_API_KEY
  const recognitionRef = useRef<any>(null)

  // Update time for dynamic greetings
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000)
    return () => clearInterval(timer)
  }, [])

  // Initialize with personalized greeting
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const hour = currentTime.getHours()
      const timeGreeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening"
      const emoji = hour < 6 ? "🌙" : hour < 12 ? "🌅" : hour < 17 ? "☀️" : hour < 20 ? "🌆" : "🌙"
      
      const welcomeMessage: Message = {
        id: Date.now().toString(),
        text: `${timeGreeting}! ${emoji} Hello! 🙏 I'm Yalu, your personal Sri Lankan leopard guide! 🐆 

I know every hidden waterfall, every secret beach, and every spot where elephants roam free! From spicy kottu roti to serene tea plantations, I'll help you experience the REAL Sri Lanka! 

What kind of adventure calls to your heart today? 🌴✨`,
        sender: 'yalu',
        timestamp: new Date(),
        emotion: 'excited',
        suggestions: [
          "🏖️ Beach Paradise",
          "🐘 Wildlife Safari", 
          "🏛️ Cultural Wonders",
          "🌄 Hill Country Magic"
        ]
      }
      setMessages([welcomeMessage])
      playWelcomeSound()
    }
  }, [isOpen, currentTime])

  // Auto-scroll with smooth animation
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        behavior: 'smooth'
      })
    }
  }, [messages])

  // Enhanced speech recognition setup
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition
      recognitionRef.current = new SpeechRecognition()
      recognitionRef.current.continuous = false
      recognitionRef.current.interimResults = true
      recognitionRef.current.lang = 'en-US'

      recognitionRef.current.onresult = (event: any) => {
        const transcript = Array.from(event.results)
          .map((result: any) => result[0])
          .map((result: any) => result.transcript)
          .join('')
        
        if (event.results[0].isFinal) {
          setInputText(transcript)
          setIsListening(false)
          handleSend(transcript)
        }
      }

      recognitionRef.current.onerror = () => {
        setIsListening(false)
      }
    }
  }, [])

  const playWelcomeSound = () => {
    if (audioEnabled) {
      // Play a subtle notification sound
      const audio = new Audio('data:audio/wav;base64,UklGRlQFAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YTAFAACAAIAAgACAAIAAgACAAIAA')
      audio.volume = 0.3
      audio.play().catch(() => {})
    }
  }

  const toggleListening = () => {
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

  // Quick response system for instant replies
  const getQuickResponse = (text: string): string | null => {
    const lowerText = text.toLowerCase()
    
    for (const [key, data] of Object.entries(quickResponses)) {
      if (data.patterns.some(pattern => lowerText.includes(pattern))) {
        return data.responses[Math.floor(Math.random() * data.responses.length)]
      }
    }
    return null
  }

  const handleSend = useCallback(async (text?: string) => {
    const messageText = text || inputText
    if (!messageText.trim() || isTyping) return

    const userMessage: Message = {
      id: Date.now().toString(),
      text: messageText,
      sender: 'user',
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputText('')
    setIsTyping(true)
    setYaluMood('thinking')

    // Check for quick response first
    const quickResponse = getQuickResponse(messageText)
    
    if (quickResponse) {
      // Simulate typing for natural feel
      setTimeout(() => {
        const yaluMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: quickResponse,
          sender: 'yalu',
          timestamp: new Date(),
          emotion: 'helpful',
          suggestions: generateSmartSuggestions(messageText)
        }
        setMessages(prev => [...prev, yaluMessage])
        setIsTyping(false)
        setYaluMood('happy')
        
        if (audioEnabled) {
          speakResponse(quickResponse)
        }
      }, 800)
      return
    }

    // Fall back to OpenAI for complex queries
    try {
      if (!openAIKey) throw new Error('No API key')

      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${openAIKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'system',
              content: `You are Yalu, an enthusiastic Sri Lankan leopard travel guide. You're warm, knowledgeable, and love sharing hidden gems. Keep responses concise (2-3 short paragraphs max), use emojis naturally, and always provide specific, actionable advice. Include costs in LKR and USD when relevant.`
            },
            ...messages.slice(-6).map(msg => ({
              role: msg.sender === 'user' ? 'user' : 'assistant',
              content: msg.text
            })),
            { role: 'user', content: messageText }
          ],
          temperature: 0.8,
          max_tokens: 300
        })
      })

      const data = await response.json()
      const yaluResponse = data.choices[0].message.content

      const yaluMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: yaluResponse,
        sender: 'yalu',
        timestamp: new Date(),
        emotion: 'helpful',
        suggestions: generateSmartSuggestions(messageText)
      }

      setMessages(prev => [...prev, yaluMessage])
      
      if (audioEnabled) {
        speakResponse(yaluResponse)
      }

    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "🙈 Oops! Having trouble connecting. But I still know plenty! Ask me about beaches, wildlife, temples, or food - I have quick answers ready!",
        sender: 'yalu',
        timestamp: new Date(),
        emotion: 'empathetic'
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsTyping(false)
      setYaluMood('happy')
    }
  }, [inputText, isTyping, messages, audioEnabled, openAIKey])

  const speakResponse = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.rate = 0.95
      utterance.pitch = 1.1
      utterance.volume = 0.8
      speechSynthesis.speak(utterance)
    }
  }

  const generateSmartSuggestions = (text: string): string[] => {
    const lowerText = text.toLowerCase()
    
    if (lowerText.includes('beach')) {
      return ["🏄 Best surf spots?", "🐋 Whale watching tours", "🏖️ Hidden beaches", "🌅 Beach hotels under $50"]
    } else if (lowerText.includes('wildlife') || lowerText.includes('safari')) {
      return ["🐆 See leopards like me!", "🐘 Elephant orphanage", "📸 Photography tips", "🏕️ Safari camping"]
    } else if (lowerText.includes('food')) {
      return ["🍛 Must-try dishes", "🌶️ Spice garden tours", "🍳 Cooking classes", "🥥 Street food safety"]
    } else if (lowerText.includes('budget')) {
      return ["💰 Daily costs breakdown", "🏨 Backpacker hostels", "🚌 Local transport", "🎟️ Free attractions"]
    }
    
    return ["📅 Perfect itinerary", "💎 Hidden gems", "🎒 Packing essentials", "🌦️ Weather now"]
  }

  const handleSuggestionClick = (suggestion: string) => {
    setInputText(suggestion)
    setTimeout(() => handleSend(suggestion), 100)
  }

  if (!isOpen) return null

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8, y: 50 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.8, y: 50 }}
      transition={{ type: "spring", damping: 25, stiffness: 300 }}
      className="fixed bottom-4 right-4 z-50"
    >
      <Card className="w-[480px] h-[700px] shadow-2xl border-0 overflow-hidden relative">
        {/* Animated gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-orange-400 via-amber-300 to-yellow-400 opacity-10" />
        
        {/* Leopard print pattern overlay */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-10 left-10 w-20 h-20 bg-black rounded-full" />
          <div className="absolute top-20 right-20 w-16 h-16 bg-black rounded-full" />
          <div className="absolute bottom-20 left-20 w-24 h-24 bg-black rounded-full" />
          <div className="absolute bottom-10 right-10 w-14 h-14 bg-black rounded-full" />
        </div>

        <CardHeader className="relative bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500 text-white p-4 shadow-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <EnhancedYaluAvatar mood={yaluMood} />
              <div>
                <h3 className="text-2xl font-bold flex items-center gap-2">
                  Yalu
                  <motion.span
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="text-lg"
                  >
                    🌴
                  </motion.span>
                </h3>
                <p className="text-sm opacity-90 italic">Your Sri Lankan Leopard Guide</p>
              </div>
            </div>
            <button 
              onClick={onClose} 
              className="text-white/80 hover:text-white transition-colors hover:scale-110 transform"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
          
          {/* Live status indicators */}
          <div className="flex gap-2 mt-2">
            <StatusBadge icon={Globe} text="Online" active />
            <StatusBadge icon={Zap} text="Fast Mode" active />
            <StatusBadge icon={Star} text="Local Expert" active />
          </div>
        </CardHeader>
        
        <CardContent className="p-0 flex flex-col h-[calc(100%-120px)] bg-gradient-to-b from-orange-50 to-amber-50">
          {/* Messages area with enhanced styling */}
          <div 
            ref={chatContainerRef} 
            className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-orange-300 scrollbar-track-orange-100"
          >
            <AnimatePresence mode="popLayout">
              {messages.map((message) => (
                <MessageBubble key={message.id} message={message} />
              ))}
            </AnimatePresence>
            
            {isTyping && <TypingIndicator />}
          </div>
          
          {/* Quick Actions Bar */}
          <div className="px-4 py-3 bg-gradient-to-r from-orange-100 to-amber-100 border-t border-orange-200">
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
              <QuickAction icon={Waves} label="Beaches" color="blue" onClick={() => handleSuggestionClick("Best beaches to visit this month?")} />
              <QuickAction icon={Camera} label="Safari" color="green" onClick={() => handleSuggestionClick("Wildlife safari recommendations")} />
              <QuickAction icon={Hotel} label="Hotels" color="purple" onClick={() => handleSuggestionClick("Boutique hotels under $100")} />
              <QuickAction icon={Car} label="Transport" color="red" onClick={() => handleSuggestionClick("Best way to travel around Sri Lanka")} />
              <QuickAction icon={MapPin} label="Itinerary" color="indigo" onClick={() => handleSuggestionClick("Plan my 7-day Sri Lanka trip")} />
            </div>
          </div>
          
          {/* Enhanced Input Area */}
          <div className="p-4 bg-white border-t border-orange-200">
            <div className="flex gap-2 items-center">
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={toggleListening}
                className={cn(
                  "p-3 rounded-full transition-all duration-300 shadow-md",
                  isListening 
                    ? "bg-red-500 text-white animate-pulse" 
                    : "bg-orange-100 text-orange-600 hover:bg-orange-200"
                )}
              >
                {isListening ? <Mic className="h-5 w-5" /> : <MicOff className="h-5 w-5" />}
              </motion.button>
              
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Ask about beaches, wildlife, culture, food..."
                className="flex-1 px-4 py-3 bg-orange-50 text-gray-800 placeholder-gray-500 border-2 border-orange-200 rounded-full focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all"
                disabled={isTyping || isListening}
              />
              
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => handleSend()}
                disabled={isTyping || !inputText.trim()}
                className="p-3 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-full hover:shadow-lg disabled:opacity-50 transition-all duration-300 shadow-md"
              >
                <Send className="h-5 w-5" />
              </motion.button>
              
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => setAudioEnabled(!audioEnabled)}
                className={cn(
                  "p-3 rounded-full transition-all duration-300 shadow-md",
                  audioEnabled 
                    ? "bg-orange-500 text-white" 
                    : "bg-gray-200 text-gray-500"
                )}
              >
                {audioEnabled ? <Volume2 className="h-5 w-5" /> : <VolumeX className="h-5 w-5" />}
              </motion.button>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

// Enhanced Yalu Avatar with animations
const EnhancedYaluAvatar: React.FC<{ mood: string }> = ({ mood }) => {
  return (
    <motion.div className="relative">
      <motion.div 
        className="w-16 h-16 rounded-full bg-gradient-to-br from-orange-400 to-amber-500 flex items-center justify-center shadow-xl relative overflow-hidden"
        animate={mood === 'listening' ? { scale: [1, 1.1, 1] } : {}}
        transition={{ duration: 2, repeat: mood === 'listening' ? Infinity : 0 }}
      >
        {/* Animated leopard spots */}
        <div className="absolute inset-0">
          <motion.div
            className="absolute top-2 left-2 w-3 h-3 bg-black/20 rounded-full"
            animate={{ scale: [1, 0.8, 1] }}
            transition={{ duration: 3, repeat: Infinity }}
          />
          <motion.div
            className="absolute bottom-2 right-2 w-2 h-2 bg-black/20 rounded-full"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 3, repeat: Infinity, delay: 0.5 }}
          />
        </div>
        
        <span className="text-3xl z-10">🐆</span>
      </motion.div>
      
      {/* Mood indicators */}
      {mood === 'thinking' && (
        <motion.div
          className="absolute -top-2 -right-2"
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        >
          <div className="relative">
            <Sparkles className="w-6 h-6 text-yellow-400" />
            <motion.div
              className="absolute inset-0"
              animate={{ scale: [1, 1.5, 1], opacity: [1, 0, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Sparkles className="w-6 h-6 text-yellow-300" />
            </motion.div>
          </div>
        </motion.div>
      )}
      
      {mood === 'excited' && (
        <motion.div
          className="absolute -bottom-1 -right-1 flex gap-1"
          animate={{ y: [0, -5, 0] }}
          transition={{ duration: 1, repeat: Infinity }}
        >
          <Heart className="w-4 h-4 text-red-500" />
          <Heart className="w-3 h-3 text-pink-500" />
        </motion.div>
      )}
      
      {mood === 'listening' && (
        <motion.div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
          <motion.div
            animate={{ scale: [0, 1, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-8 h-8 bg-orange-300/30 rounded-full"
          />
        </motion.div>
      )}
    </motion.div>
  )
}

// Message Bubble Component
const MessageBubble: React.FC<{ message: Message }> = ({ message }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.8 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{ type: "spring", damping: 20 }}
      className={cn("flex gap-3", message.sender === 'user' ? 'justify-end' : 'justify-start')}
    >
      {message.sender === 'yalu' && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-400 to-amber-500 flex items-center justify-center shadow-md">
            <span className="text-xl">🐆</span>
          </div>
        </motion.div>
      )}
      
      <motion.div
        className={cn(
          "max-w-[75%] rounded-2xl px-4 py-3 shadow-lg",
          message.sender === 'user' 
            ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white' 
            : 'bg-white border-2 border-orange-100 text-gray-800'
        )}
        whileHover={{ scale: 1.02 }}
        transition={{ type: "spring", stiffness: 500 }}
      >
        <p className={cn(
          "text-sm leading-relaxed whitespace-pre-wrap",
          message.sender === 'user' ? 'text-white' : 'text-gray-800'
        )}>{message.text}</p>
        
        {message.suggestions && (
          <motion.div 
            className="mt-3 space-y-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            {message.suggestions.map((suggestion, idx) => (
              <motion.button
                key={idx}
                whileHover={{ scale: 1.05, x: 5 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {}}
                className="block w-full text-left px-3 py-2 text-sm bg-gradient-to-r from-orange-100 to-amber-100 hover:from-orange-200 hover:to-amber-200 rounded-lg transition-all text-gray-700 font-medium shadow-sm"
              >
                {suggestion}
              </motion.button>
            ))}
          </motion.div>
        )}
        
        <div className="flex items-center justify-between mt-2">
          <span className={cn(
            "text-xs opacity-60",
            message.sender === 'user' ? 'text-white' : 'text-gray-600'
          )}>
            {message.timestamp.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
          </span>
          {message.emotion && (
            <span className="text-xs">
              {message.emotion === 'happy' && '😊'}
              {message.emotion === 'excited' && '🤩'}
              {message.emotion === 'thinking' && '🤔'}
              {message.emotion === 'helpful' && '💡'}
            </span>
          )}
        </div>
      </motion.div>
    </motion.div>
  )
}

// Typing Indicator
const TypingIndicator: React.FC = () => {
  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      className="flex gap-3"
    >
      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-400 to-amber-500 flex items-center justify-center shadow-md">
        <span className="text-xl">🐆</span>
      </div>
      <div className="bg-white shadow-lg rounded-2xl px-4 py-3 border-2 border-orange-100">
        <div className="flex gap-1 items-center">
          {[0, 0.2, 0.4].map((delay, i) => (
            <motion.div
              key={i}
              animate={{ 
                y: [0, -8, 0],
                backgroundColor: ['#FB923C', '#FCD34D', '#FB923C']
              }}
              transition={{ 
                duration: 1,
                repeat: Infinity, 
                delay,
                ease: "easeInOut"
              }}
              className="w-3 h-3 rounded-full"
            />
          ))}
        </div>
      </div>
    </motion.div>
  )
}

// Quick Action Button
const QuickAction: React.FC<{ 
  icon: any; 
  label: string; 
  color: string;
  onClick: () => void 
}> = ({ icon: Icon, label, color, onClick }) => {
  const colorClasses = {
    blue: 'bg-blue-100 text-blue-600 hover:bg-blue-200',
    green: 'bg-green-100 text-green-600 hover:bg-green-200',
    purple: 'bg-purple-100 text-purple-600 hover:bg-purple-200',
    red: 'bg-red-100 text-red-600 hover:bg-red-200',
    indigo: 'bg-indigo-100 text-indigo-600 hover:bg-indigo-200'
  }
  
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={cn(
        "flex items-center gap-2 px-4 py-2 rounded-full transition-all whitespace-nowrap text-sm font-medium shadow-sm",
        colorClasses[color as keyof typeof colorClasses]
      )}
    >
      <Icon className="h-4 w-4" />
      <span>{label}</span>
    </motion.button>
  )
}

// Status Badge Component
const StatusBadge: React.FC<{ icon: any; text: string; active?: boolean }> = ({ icon: Icon, text, active }) => {
  return (
    <motion.div
      animate={active ? { scale: [1, 1.05, 1] } : {}}
      transition={{ duration: 2, repeat: Infinity }}
      className={cn(
        "flex items-center gap-1 px-2 py-1 rounded-full text-xs",
        active ? "bg-white/20 text-white" : "bg-black/20 text-white/60"
      )}
    >
      <Icon className="h-3 w-3" />
      <span>{text}</span>
    </motion.div>
  )
}

export default EnhancedYaluLeopardAgent
