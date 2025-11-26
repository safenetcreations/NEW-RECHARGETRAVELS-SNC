import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { X, Mic, MicOff, Volume2, VolumeX, Sparkles, Heart, MapPin, Calendar, DollarSign, Users, Send, Globe, Loader2 } from 'lucide-react'
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
}

interface EnhancedYaluVoiceAgentProps {
  isOpen: boolean
  onClose: () => void
}

const EnhancedYaluVoiceAgent: React.FC<EnhancedYaluVoiceAgentProps> = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState<Message[]>([])
  const [inputText, setInputText] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [audioEnabled, setAudioEnabled] = useState(true)
  const [isListening, setIsListening] = useState(false)
  const [yaluMood, setYaluMood] = useState<'happy' | 'listening' | 'thinking' | 'speaking' | 'excited'>('happy')
  const [isProcessingVoice, setIsProcessingVoice] = useState(false)
  const [userName, setUserName] = useState<string | null>(null)

  // Trip Planning State
  const [planningStep, setPlanningStep] = useState<'none' | 'dates' | 'interests' | 'budget' | 'summary'>('none')
  const [tripData, setTripData] = useState({
    dates: '',
    duration: '',
    interests: [] as string[],
    budget: ''
  })

  const chatContainerRef = useRef<HTMLDivElement>(null)
  const audioRef = useRef<HTMLAudioElement>(null)
  const recognitionRef = useRef<any>(null)

  const openAIKey = import.meta.env.VITE_OPENAI_API_KEY
  const elevenLabsKey = import.meta.env.VITE_ELEVENLABS_API_KEY
  const pineconeKey = import.meta.env.VITE_PINECONE_API_KEY

  // Initialize with personalized greeting
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      // Check if we have user memory from Pinecone
      const storedUserName = localStorage.getItem('yalu_user_name')

      const greetingTime = new Date().getHours()
      const timeGreeting = greetingTime < 12 ? "Good morning" : greetingTime < 17 ? "Good afternoon" : "Good evening"

      const greetingText = storedUserName
        ? `${timeGreeting}, ${storedUserName}! Welcome back! 🙏 I'm Yalu, and I've been thinking about amazing new places to show you in Sri Lanka! Remember our last conversation about beaches? I found some hidden gems you'll love! 🏝️`
        : `${timeGreeting}! Welcome to Recharge Travels. I'm Yalu, your personal Sri Lankan travel companion, here to help you discover the magic of our beautiful island. What's your name?`

      const welcomeMessage: Message = {
        id: Date.now().toString(),
        text: greetingText,
        sender: 'yalu',
        timestamp: new Date(),
        emotion: 'happy',
        suggestions: storedUserName ? [
          "Show me those hidden beaches! 🏖️",
          "What's new in Colombo? 🌆",
          "Wildlife safari updates 🐘",
          "Local festival calendar 🎉"
        ] : [
          "I'm [your name] 👋",
          "First time in Sri Lanka 🌟",
          "Planning a vacation 🗓️",
          "Just exploring 🔍"
        ]
      }

      setMessages([welcomeMessage])
      setUserName(storedUserName)

      // Speak the greeting using ElevenLabs
      if (audioEnabled && elevenLabsKey) {
        speakWithElevenLabs(greetingText)
      }
    }
  }, [isOpen])

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

  const speakWithElevenLabs = async (text: string) => {
    if (!elevenLabsKey) return

    setIsProcessingVoice(true)
    setYaluMood('speaking')

    try {
      const response = await fetch('https://api.elevenlabs.io/v1/text-to-speech/h8iF6fuqRJODTFvWSevk', { // Your custom voice ID
        method: 'POST',
        headers: {
          'xi-api-key': elevenLabsKey,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text,
          model_id: 'eleven_monolingual_v1',
          voice_settings: {
            stability: 0.75,
            similarity_boost: 0.85,
            style: 0.5,
            use_speaker_boost: true
          }
        })
      })

      if (response.ok) {
        const audioBlob = await response.blob()
        const audioUrl = URL.createObjectURL(audioBlob)

        if (audioRef.current) {
          audioRef.current.src = audioUrl
          audioRef.current.play()
        }
      }
    } catch (error) {
      console.error('ElevenLabs error:', error)
      // Fallback to browser TTS
      if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(text)
        utterance.rate = 0.9
        utterance.pitch = 1.1
        utterance.lang = 'en-US'
        speechSynthesis.speak(utterance)
      }
    } finally {
      setIsProcessingVoice(false)
      setYaluMood('happy')
    }
  }

  const handleSend = async (text?: string) => {
    const messageText = text || inputText
    if (!messageText.trim() || isTyping || !openAIKey) return

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
      let systemPrompt = `You are Yalu, a warm, enthusiastic Sri Lankan travel assistant with deep local knowledge.
${userName ? `You're talking to ${userName}, whom you remember from previous conversations.` : ''}

Language: Respond in English.

Your knowledge includes:
- BEACHES: Mirissa (whale watching), Unawatuna (snorkeling), Hiriketiya (surfing), Arugam Bay (world-class surfing), Secret beaches like Coconut Tree Hill
- WILDLIFE: Yala (leopards), Udawalawe (elephants), Minneriya (elephant gathering), Wilpattu (less crowded)
- CULTURE: Temple of Tooth (Kandy), Sigiriya Rock, Dambulla Cave Temple, Galle Fort, Ancient cities
- HILL COUNTRY: Ella (Nine Arches Bridge), Nuwara Eliya (tea country), Adams Peak, Horton Plains
- FOOD: Kottu roti, hoppers, string hoppers, pol sambol, fish curry, lamprais
- TRANSPORT: Tuk-tuks, trains (scenic routes), buses, private drivers
- WEATHER: Best times to visit different coasts, monsoon seasons
- COSTS: Budget tips, typical prices, bargaining advice

Personality traits:
- Use local terms: machan (friend), ayubowan (hello), istuti (thanks)
- Share insider tips and hidden gems
- Be enthusiastic about Sri Lanka's beauty
- Give specific, actionable recommendations
- Remember user preferences from conversation

Keep responses concise but helpful (2-3 paragraphs max).`

      let nextStep = planningStep

      // Trip Planning Logic
      if (planningStep !== 'none') {
        if (planningStep === 'dates') {
          setTripData(prev => ({ ...prev, dates: messageText }))
          setPlanningStep('interests')
          nextStep = 'interests'
          systemPrompt += `\nThe user just provided their travel dates: "${messageText}". Acknowledge this and enthusiastically ask what they are interested in (Beaches, Wildlife, Culture, Adventure, etc.).`
        } else if (planningStep === 'interests') {
          setTripData(prev => ({ ...prev, interests: [messageText] }))
          setPlanningStep('budget')
          nextStep = 'budget'
          systemPrompt += `\nThe user is interested in: "${messageText}". Great choices! Now ask about their budget preference (Budget-friendly, Mid-range, or Luxury) to tailor the itinerary.`
        } else if (planningStep === 'budget') {
          setTripData(prev => ({ ...prev, budget: messageText }))
          setPlanningStep('summary')
          nextStep = 'summary'
          systemPrompt += `\nThe user has a "${messageText}" budget. 
          Based on their dates (${tripData.dates}), interests (${tripData.interests.join(', ')}), and budget, create a brief, exciting day-by-day itinerary summary. 
          End by asking if they would like to proceed with this plan or make changes.`
        } else if (planningStep === 'summary') {
          // If they agree, we can offer to move to WhatsApp
          if (messageText.toLowerCase().includes('yes') || messageText.toLowerCase().includes('good') || messageText.toLowerCase().includes('proceed')) {
            systemPrompt += `\nThe user is happy with the itinerary. Suggest they continue on WhatsApp to finalize the booking and get real-time support. Mention that a human agent can help them book this exact trip.`
          } else {
            systemPrompt += `\nThe user wants to make changes: "${messageText}". Adjust the itinerary accordingly and ask if it looks better.`
          }
        }
      } else {
        // Check if user wants to plan a trip
        if (messageText.toLowerCase().includes('plan') && (messageText.toLowerCase().includes('trip') || messageText.toLowerCase().includes('vacation') || messageText.toLowerCase().includes('itinerary'))) {
          setPlanningStep('dates')
          nextStep = 'dates'
          systemPrompt += `\nThe user wants to plan a trip! Enthusiastically accept and ask for their planned travel dates and duration.`
        }
      }

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
            ...messages.map(msg => ({
              role: msg.sender === 'user' ? 'user' : 'assistant',
              content: msg.text
            })),
            { role: 'user', content: messageText }
          ],
          temperature: 0.8,
          max_tokens: 400
        })
      })

      if (!response.ok) {
        throw new Error('Failed to get response')
      }

      const data = await response.json()
      let yaluResponse = data.choices[0].message.content

      // Store conversation in Pinecone for long-term memory
      if (pineconeKey) {
        // This would be implemented with a backend service
        console.log('Storing conversation in Pinecone...')
      }

      // Check for availability requests
      if (messageText.toLowerCase().includes('available') && (messageText.toLowerCase().includes('van') || messageText.toLowerCase().includes('car') || messageText.toLowerCase().includes('driver'))) {
        try {
          // Simple date extraction or default to tomorrow
          const tomorrow = new Date()
          tomorrow.setDate(tomorrow.getDate() + 1)
          const dateStr = tomorrow.toISOString().split('T')[0]

          const availability = await YaluFirebaseService.checkVehicleAvailability({
            date: dateStr,
            category: messageText.toLowerCase().includes('van') ? 'van' : 'car'
          })

          if (availability.success) {
            const vehicleInfo = YaluFirebaseService.formatVehicleResponse(availability)
            yaluResponse += `\n\n${vehicleInfo}`
            // Update the message text to include this info
            // This will be done when yaluMessage is created below
          }
        } catch (err) {
          console.error('Availability check error:', err)
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
        suggestions: generateContextualSuggestions(messageText, yaluResponse, nextStep),
        language: 'en'
      }

      setMessages(prev => [...prev, yaluMessage])
      setYaluMood('happy')

      // Speak the response
      if (audioEnabled && elevenLabsKey) {
        speakWithElevenLabs(yaluResponse)
      }

    } catch (error) {
      console.error('Error:', error)
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "Oh dear! I'm having trouble connecting right now. Please check if all API keys are properly set! 🙏",
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

  const generateContextualSuggestions = (userText: string, yaluResponse: string, currentStep: string): string[] => {
    const combined = (userText + ' ' + yaluResponse).toLowerCase()

    // Trip Planning Suggestions
    if (currentStep === 'dates') {
      return ["Next month", "In December", "For 10 days", "2 weeks in January"]
    } else if (currentStep === 'interests') {
      return ["Beaches & Relaxation 🏖️", "Wildlife & Nature 🐘", "Culture & History 🛕", "Adventure & Hiking 🥾"]
    } else if (currentStep === 'budget') {
      return ["Budget-friendly 💰", "Mid-range comfort 🏨", "Luxury experience ✨"]
    } else if (currentStep === 'summary') {
      return ["Looks perfect! ✅", "Change dates 📅", "Add more beach time 🏖️", "Continue on WhatsApp 📱"]
    }

    if (combined.includes('beach')) {
      return ["Compare beaches 🏖️", "Beach accommodations 🏨", "Water activities 🏄", "Best time to visit 📅"]
    } else if (combined.includes('wildlife') || combined.includes('safari')) {
      return ["Book safari tour 🚙", "Best parks to visit 🦁", "Photography tips 📸", "What to pack 🎒"]
    } else if (combined.includes('food') || combined.includes('restaurant')) {
      return ["Must-try dishes 🍛", "Street food guide 🥘", "Cooking classes 👨‍🍳", "Vegetarian options 🥗"]
    } else if (combined.includes('budget') || combined.includes('cost')) {
      return ["Daily budget breakdown 💰", "Money-saving tips 💡", "Free activities 🆓", "Haggling guide 🤝"]
    }

    return ["Plan a trip ✈️", "Hidden gems 💎", "Local experiences 🎭", "Transport options 🚂"]
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

  const handleWhatsAppRedirect = () => {
    const message = `Hi Recharge Travels! I've been planning a trip with Yalu.
    
*Dates:* ${tripData.dates}
*Interests:* ${tripData.interests.join(', ')}
*Budget:* ${tripData.budget}

I'd like to book this or get more details!`

    const encodedMessage = encodeURIComponent(message)
    window.open(`https://wa.me/94777123456?text=${encodedMessage}`, '_blank')
  }

  const handleSuggestionClick = (suggestion: string) => {
    if (suggestion.includes('Continue on WhatsApp')) {
      handleWhatsAppRedirect()
      return
    }
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
                      : 'bg-white shadow-lg border border-orange-100 text-gray-800'
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
              <QuickAction icon={MapPin} label="Destinations" onClick={() => handleSuggestionClick("Show me must-visit destinations")} />
              <QuickAction icon={Calendar} label="Itinerary" onClick={() => handleSuggestionClick("Plan a 7-day itinerary")} />
              <QuickAction icon={DollarSign} label="Budget" onClick={() => handleSuggestionClick("Budget travel tips")} />
              <QuickAction icon={Users} label="Family" onClick={() => handleSuggestionClick("Family-friendly activities")} />
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

            {!openAIKey && (
              <p className="text-xs text-red-500 mt-2">⚠️ OpenAI API key not found</p>
            )}
            {audioEnabled && !elevenLabsKey && (
              <p className="text-xs text-orange-500 mt-1">ℹ️ Using browser voice (add ElevenLabs key for better quality)</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Hidden audio element for ElevenLabs */}
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

export default EnhancedYaluVoiceAgent
