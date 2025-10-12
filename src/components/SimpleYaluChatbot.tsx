import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { X, Mic, MicOff, Volume2, VolumeX, Sparkles, Heart, MapPin, Calendar, DollarSign, Users, Send } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Message {
  id: string
  text: string
  sender: 'user' | 'yalu'
  timestamp: Date
  emotion?: 'happy' | 'thinking' | 'excited' | 'empathetic' | 'helpful' | 'curious'
  suggestions?: string[]
}

interface SimpleYaluChatbotProps {
  isOpen: boolean
  onClose: () => void
}

const SimpleYaluChatbot: React.FC<SimpleYaluChatbotProps> = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState<Message[]>([])
  const [inputText, setInputText] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [audioEnabled, setAudioEnabled] = useState(true)
  const [yaluMood, setYaluMood] = useState<'happy' | 'listening' | 'thinking' | 'speaking' | 'excited'>('happy')
  
  const chatContainerRef = useRef<HTMLDivElement>(null)
  const openAIKey = import.meta.env.VITE_OPENAI_API_KEY

  // Initialize with greeting
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const greetingTime = new Date().getHours()
      const greeting = greetingTime < 12 ? "Good morning" : greetingTime < 17 ? "Good afternoon" : "Good evening"
      
      const welcomeMessage: Message = {
        id: Date.now().toString(),
        text: `${greeting}! 🙏 I'm Yalu, your personal Sri Lankan travel companion! I know every hidden beach, every elephant gathering spot, and every delicious kottu roti place on our beautiful island! 🏝️ What kind of adventure are you dreaming of?`,
        sender: 'yalu',
        timestamp: new Date(),
        emotion: 'happy',
        suggestions: [
          "First time in Sri Lanka 🌟",
          "Beach paradise please! 🏖️",
          "Wildlife & elephants 🐘",
          "Culture & temples 🛕"
        ]
      }
      setMessages([welcomeMessage])
    }
  }, [isOpen])

  // Auto-scroll
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight
    }
  }, [messages])

  const handleSend = async () => {
    if (!inputText.trim() || isTyping || !openAIKey) return

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      sender: 'user',
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputText('')
    setIsTyping(true)
    setYaluMood('thinking')

    try {
      // Call OpenAI API directly
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
              content: `You are Yalu, a warm, enthusiastic Sri Lankan travel assistant.
You have deep knowledge about:
- All Sri Lankan destinations (beaches, wildlife parks, cultural sites, hill country)
- Local culture, customs, festivals, and food
- Practical travel info (weather, transport, costs, safety)
- Hidden gems and local secrets

Personality:
- Warm and friendly like a local friend
- Enthusiastic about sharing Sri Lanka's beauty
- Add relevant emojis naturally
- Give specific, actionable recommendations

Keep responses concise but helpful (2-3 paragraphs max).`
            },
            ...messages.map(msg => ({
              role: msg.sender === 'user' ? 'user' : 'assistant',
              content: msg.text
            })),
            { role: 'user', content: inputText }
          ],
          temperature: 0.8,
          max_tokens: 400
        })
      })

      if (!response.ok) {
        throw new Error('Failed to get response')
      }

      const data = await response.json()
      const yaluResponse = data.choices[0].message.content

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
        suggestions: generateSuggestions(inputText)
      }

      setMessages(prev => [...prev, yaluMessage])
      setYaluMood('happy')

      // Simple text-to-speech using browser API
      if (audioEnabled && 'speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(yaluResponse)
        utterance.rate = 0.9
        utterance.pitch = 1.1
        speechSynthesis.speak(utterance)
      }

    } catch (error) {
      console.error('Error:', error)
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "Oh dear! I'm having trouble connecting right now. Make sure your OpenAI API key is set in the .env file! 🙏",
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

  const generateSuggestions = (text: string): string[] => {
    const lowerText = text.toLowerCase()
    if (lowerText.includes('beach')) {
      return ["Best time to visit beaches?", "South vs East coast?", "Hidden beaches", "Beach activities"]
    } else if (lowerText.includes('wildlife') || lowerText.includes('safari')) {
      return ["Yala vs Udawalawe?", "See elephants", "Best safari times", "Wildlife photography"]
    } else if (lowerText.includes('culture') || lowerText.includes('temple')) {
      return ["Temple etiquette", "Cultural triangle", "Festival calendar", "UNESCO sites"]
    }
    return ["7-day itinerary", "Budget tips", "Best time to visit", "Must-see places"]
  }

  const handleSuggestionClick = (suggestion: string) => {
    setInputText(suggestion)
    setTimeout(() => handleSend(), 100)
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
                <CardTitle className="text-xl font-bold">Yalu</CardTitle>
                <p className="text-sm opacity-90">Your Sri Lankan Travel Companion</p>
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
                      : 'bg-white shadow-lg border border-orange-100'
                  )}>
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.text}</p>
                    
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
          </div>
          
          {/* Quick Actions */}
          <div className="px-4 py-2 border-t bg-gray-50">
            <div className="flex gap-2 overflow-x-auto pb-2">
              <QuickAction icon={MapPin} label="Destinations" onClick={() => handleSuggestionClick("Show me must-visit destinations")} />
              <QuickAction icon={Calendar} label="Itinerary" onClick={() => handleSuggestionClick("Plan a 7-day itinerary")} />
              <QuickAction icon={DollarSign} label="Budget" onClick={() => handleSuggestionClick("Budget travel tips")} />
              <QuickAction icon={Users} label="Family" onClick={() => handleSuggestionClick("Family-friendly activities")} />
            </div>
          </div>
          
          {/* Input */}
          <div className="p-4 border-t bg-white">
            <div className="flex gap-2">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Ask me anything about Sri Lanka..."
                className="flex-1 px-4 py-2 border border-orange-200 rounded-full focus:outline-none focus:ring-2 focus:ring-orange-400"
                disabled={isTyping}
              />
              <button
                onClick={handleSend}
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
            {!openAIKey && (
              <p className="text-xs text-red-500 mt-2">⚠️ OpenAI API key not found in .env file</p>
            )}
          </div>
        </CardContent>
      </Card>
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

export default SimpleYaluChatbot
