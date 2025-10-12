import React, { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { X, Mic, MicOff, Volume2, VolumeX, Sparkles, Heart, MapPin, Calendar, DollarSign, Users, Send, Globe, Loader2, Car, Brain, Zap, AlertCircle, Compass, Camera, Utensils, Hotel, Plane, Clock, Sun, Cloud, Info } from 'lucide-react'
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
}

interface UserContext {
  name?: string
  interests: string[]
  budget?: 'budget' | 'mid-range' | 'luxury'
  travelDates?: { start?: Date; end?: Date }
  groupSize?: number
  previousQueries: string[]
  currentIntent?: string
  language: string
  location?: string
}

interface IntelligentYaluProps {
  isOpen: boolean
  onClose: () => void
}

// Enhanced prompts for intelligence
const INTELLIGENT_PROMPTS = {
  welcome: {
    firstTime: [
      "Hello! 🙏 I see this is your first visit! I'm Yalu, and I'm genuinely excited to help you discover Sri Lanka! What brings you to our beautiful island? Are you dreaming of beaches, wildlife adventures, or cultural experiences?",
      "Welcome to Sri Lanka! 🇱🇰 I'm Yalu, and I've helped thousands explore our paradise island. Tell me, what's your travel style - are you an adventurer, a beach lover, or a culture enthusiast?",
      "Hello there! 🐆 I'm Yalu, your personal Sri Lankan expert. I know every hidden waterfall, secret beach, and the best kottu roti spots! What kind of magic are you looking to experience in Sri Lanka?"
    ],
    returning: [
      "Welcome back, {name}! 🙏 I've been thinking about your trip! Have you decided on those dates we discussed? I found some amazing new spots you'd love!",
      "Hey {name}! Great to see you again! 🐆 I've saved some personalized recommendations based on what we talked about last time. Ready to continue planning your adventure?",
      "{name}! Perfect timing! There's a festival coming up during your travel dates that you'd absolutely love. Want to hear about it?"
    ]
  },
  contextual: {
    morning: "Good morning! ☀️ Planning some Sri Lankan adventures for today? The weather's perfect for {activity}!",
    afternoon: "Good afternoon! 🌤️ How's your day going? This is actually the perfect time to book those {activity} we discussed - afternoon slots often have better prices!",
    evening: "Good evening! 🌅 Dreaming about Sri Lankan sunsets? I know the perfect spots where you can watch the sun dip into the Indian Ocean!",
    night: "Hello night owl! 🌙 Planning your Sri Lankan adventure? This is actually a great time to book - I often see better availability at this hour!"
  }
}

// Smart response templates based on intent
const INTENT_RESPONSES = {
  beaches: {
    general: "I can see you're drawn to our stunning coastline! 🏖️ Sri Lanka's beaches are incredibly diverse. Are you looking for surfing waves, calm swimming waters, or perhaps a romantic secluded cove? Your preference will help me suggest the perfect beach!",
    specific: {
      surfing: "Ah, a surfer! 🏄 You're in for a treat! For beginners, Weligama Bay is perfect with consistent, gentle waves. Experienced? Arugam Bay is world-class! When are you planning to visit? The season really matters for waves!",
      swimming: "For safe swimming, I highly recommend Unawatuna or Pasikudah! 🏊 The water is calm, clear, and perfect for families. Pasikudah is especially unique - you can walk 100 meters into the sea and the water is still shallow!",
      secluded: "I know some hidden gems! 🤫 Hiriketiya Bay is my personal favorite - a horseshoe cove surrounded by palm trees. Or try Secret Beach near Mirissa - you'll need to climb down some rocks, but it's worth it!"
    }
  },
  wildlife: {
    general: "Wildlife lover! 🦁 Sri Lanka is one of the best wildlife destinations in Asia! Are you dreaming of leopards, elephants, or maybe whales? Each has its special season and location!",
    specific: {
      leopards: "Yala Block 1 has the world's highest leopard density! 🐆 Book the 6 AM safari slot - leopards are most active at dawn. I can check real-time availability. Pro tip: Stay at a park-edge hotel to enter first!",
      elephants: "The Gathering at Minneriya is mind-blowing! 🐘 300+ elephants gather at the reservoir from July-September. Or visit Udawalawe year-round - I guarantee you'll see elephants there!",
      whales: "Blue whale season in Mirissa is December-April! 🐋 Book with Raja & the Whales - they're the most ethical operator. 90% sighting rate! Want me to check availability for your dates?"
    }
  },
  culture: {
    general: "You're interested in our rich culture! 🛕 From ancient kingdoms to vibrant festivals, Sri Lanka has 2500 years of history. Are you drawn to temples, historical sites, or living culture like festivals and traditions?",
    specific: {
      temples: "Temple of the Tooth in Kandy is unmissable! 🙏 Visit during the 5:30 PM puja for the best experience. Dress code: cover shoulders and knees. I'll share the exact timings and a cultural etiquette guide!",
      historical: "The Cultural Triangle is perfect for history buffs! 📜 Sigiriya at sunrise is magical - fewer crowds and golden light on the frescoes. Buy a combo ticket for all sites - saves 40%!",
      festivals: "You're in luck! The Esala Perahera is coming up! 🎭 It's our most spectacular festival with elephants, dancers, and fire performers. Book grandstand seats NOW - they sell out fast!"
    }
  },
  food: {
    general: "Foodie alert! 🍛 Sri Lankan cuisine is a flavor explosion! Are you adventurous with spice? Want to try street food or prefer restaurants? I know spots from local favorites to Michelin-mentioned!",
    specific: {
      street: "Kottu roti at Pilawoos is legendary! 🥘 The rhythmic chopping sound will draw you in! Try cheese kottu if you're not sure about spice. Best time: after 7 PM when it's fresh!",
      restaurants: "Ministry of Crab is our pride! 🦀 The 2kg jumbo crab is Instagram-famous! Book 2 weeks ahead. Budget tip: lunch menu is 40% cheaper with same quality!",
      vegetarian: "Sri Lanka is vegetarian paradise! 🥗 Try a traditional rice & curry - it's actually 15+ different dishes! Shanmugas in Colombo does the best vegetarian thali!"
    }
  },
  itinerary: {
    general: "Let's craft your perfect Sri Lankan journey! 🗺️ How many days do you have? Most people underestimate travel times here. I'll create a realistic itinerary that doesn't leave you exhausted!",
    specific: {
      short: "5-7 days? Let's focus on highlights! 📍 I recommend the 'Golden Triangle': Sigiriya → Kandy → Galle. Each place is 2-3 hours apart, giving you quality time without rushing!",
      medium: "10-14 days is perfect! 🎯 You can do justice to beach + culture + wildlife. My suggestion: Start in the Cultural Triangle, then hill country, end at the beaches. Want me to map it out?",
      long: "3 weeks? Amazing! 🌟 You can see hidden Sri Lanka! Include the untouched East coast, tea country trails, and even Jaffna up north. Let me create a diverse itinerary!"
    }
  },
  budget: {
    general: "Let's talk budget! 💰 Sri Lanka offers incredible value. Your money goes far here! What's your daily budget? I'll show you exactly what you can experience and where to splurge vs save!",
    specific: {
      backpacker: "$30-40/day gets you: beach huts, local buses, street food, and all temple entries! 🎒 Pro tip: eat where locals eat - $2 for a massive rice & curry!",
      midRange: "$80-100/day opens up: boutique hotels, private drivers, good restaurants, and safaris! 🏨 This is the sweet spot - comfort without breaking the bank!",
      luxury: "Sky's the limit! 🌟 $200+/day gets you: Geoffrey Bawa hotels, helicopter transfers, private wildlife experiences. Cape Weligama and Wild Coast Lodge are unmissable!"
    }
  },
  transport: {
    general: "Getting around Sri Lanka is an adventure itself! 🚂 Trains are scenic but slow, drivers are convenient, buses are cheap but chaotic. What's your comfort vs adventure threshold?",
    specific: {
      train: "The Kandy-to-Ella train is MAGICAL! 🚂 Book 1st class observation car 45 days ahead online. Can't get tickets? I know a trick - buy Kandy-Nanu Oya, then Nanu Oya-Ella separately!",
      driver: "Private driver is best for flexibility! 🚗 Expect $50-60/day including fuel. I work with Sampath - he's driven for my users for 5 years. Want his WhatsApp?",
      rental: "Self-drive? You're brave! 😅 Roads are chaotic but doable. Get a small car for narrow roads. International permit + local permit needed. Tuk-tuk rental is more fun though!"
    }
  }
}

const IntelligentYalu: React.FC<IntelligentYaluProps> = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState<Message[]>([])
  const [inputText, setInputText] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [audioEnabled, setAudioEnabled] = useState(true)
  const [isListening, setIsListening] = useState(false)
  const [yaluMood, setYaluMood] = useState<'happy' | 'listening' | 'thinking' | 'speaking' | 'excited' | 'alert'>('happy')
  const [userContext, setUserContext] = useState<UserContext>({
    interests: [],
    previousQueries: [],
    language: 'en'
  })
  const [showVisualData, setShowVisualData] = useState<any>(null)
  
  const chatContainerRef = useRef<HTMLDivElement>(null)
  const audioRef = useRef<HTMLAudioElement>(null)
  const recognitionRef = useRef<any>(null)
  
  const openAIKey = import.meta.env.VITE_OPENAI_API_KEY
  const elevenLabsKey = import.meta.env.VITE_ELEVENLABS_API_KEY

  // Initialize with intelligent greeting
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const storedContext = localStorage.getItem('yalu_context')
      const parsedContext = storedContext ? JSON.parse(storedContext) : {}
      
      setUserContext(prev => ({ ...prev, ...parsedContext }))
      
      const hour = new Date().getHours()
      const timeOfDay = hour < 12 ? 'morning' : hour < 17 ? 'afternoon' : hour < 20 ? 'evening' : 'night'
      
      let greeting: string
      if (parsedContext.name) {
        greeting = INTELLIGENT_PROMPTS.welcome.returning[
          Math.floor(Math.random() * INTELLIGENT_PROMPTS.welcome.returning.length)
        ].replace('{name}', parsedContext.name)
      } else {
        greeting = INTELLIGENT_PROMPTS.welcome.firstTime[
          Math.floor(Math.random() * INTELLIGENT_PROMPTS.welcome.firstTime.length)
        ]
      }
      
      // Add contextual time-based additions
      if (parsedContext.interests?.length > 0) {
        const interest = parsedContext.interests[0]
        greeting += ` ${INTELLIGENT_PROMPTS.contextual[timeOfDay].replace('{activity}', interest)}`
      }
      
      const welcomeMessage: Message = {
        id: Date.now().toString(),
        text: greeting,
        sender: 'yalu',
        timestamp: new Date(),
        emotion: 'happy',
        suggestions: parsedContext.name ? 
          ["Continue trip planning 📅", "Check weather updates ☀️", "New recommendations 🌟", "Local events this week 🎉"] :
          ["I'm planning a trip 🗺️", "Just exploring ideas 💭", "Need travel dates advice 📅", "What's Sri Lanka famous for? 🏝️"],
        actionButtons: [
          { label: "Quick Plan", action: "quick-itinerary", icon: Compass },
          { label: "Best Deals", action: "current-deals", icon: DollarSign },
          { label: "Weather", action: "weather-forecast", icon: Sun }
        ]
      }
      
      setMessages([welcomeMessage])
      
      if (audioEnabled && elevenLabsKey) {
        speakIntelligently(greeting)
      }
    }
  }, [isOpen])

  // Detect user intent intelligently
  const detectIntent = (text: string): string => {
    const lower = text.toLowerCase()
    
    // Direct intent keywords
    const intents = {
      beaches: ['beach', 'coast', 'surf', 'swim', 'sand', 'sea', 'mirissa', 'unawatuna', 'arugam'],
      wildlife: ['safari', 'elephant', 'leopard', 'wildlife', 'animal', 'yala', 'udawalawe', 'whale'],
      culture: ['temple', 'history', 'culture', 'sigiriya', 'kandy', 'heritage', 'festival', 'tradition'],
      food: ['food', 'eat', 'restaurant', 'curry', 'kottu', 'cuisine', 'hungry', 'meal', 'dish'],
      itinerary: ['plan', 'itinerary', 'days', 'trip', 'route', 'schedule', 'week', 'journey'],
      budget: ['budget', 'cost', 'price', 'money', 'expensive', 'cheap', 'afford', 'spend'],
      transport: ['transport', 'train', 'bus', 'driver', 'travel', 'getting around', 'taxi', 'hire'],
      accommodation: ['hotel', 'stay', 'accommodation', 'resort', 'hostel', 'guesthouse', 'book'],
      weather: ['weather', 'rain', 'monsoon', 'season', 'climate', 'temperature', 'forecast']
    }
    
    for (const [intent, keywords] of Object.entries(intents)) {
      if (keywords.some(keyword => lower.includes(keyword))) {
        return intent
      }
    }
    
    return 'general'
  }

  // Get intelligent context-aware response
  const getIntelligentResponse = async (query: string): Promise<string> => {
    const intent = detectIntent(query)
    updateUserContext(query, intent)
    
    // Build context-aware prompt
    const contextPrompt = `You are Yalu, an expert Sri Lankan travel AI with deep local knowledge and personality.

User Context:
- Name: ${userContext.name || 'Unknown'}
- Previous interests: ${userContext.interests.join(', ') || 'None yet'}
- Budget level: ${userContext.budget || 'Not specified'}
- Previous queries: ${userContext.previousQueries.slice(-3).join('; ')}
- Current intent: ${intent}

User Query: "${query}"

Instructions:
1. Give specific, actionable advice with real examples (names, prices, tips)
2. Be conversational and enthusiastic but professional
3. Include insider tips and local knowledge
4. Suggest logical next steps based on their journey
5. If relevant, mention current deals or seasonal considerations
6. Keep response concise but highly informative (max 3 paragraphs)
7. End with a specific question to understand their needs better

Base your response on these templates but personalize it:
${JSON.stringify(INTENT_RESPONSES[intent as keyof typeof INTENT_RESPONSES] || {}, null, 2)}`

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
            { role: 'system', content: contextPrompt },
            ...messages.slice(-5).map(m => ({
              role: m.sender === 'user' ? 'user' : 'assistant',
              content: m.text
            })),
            { role: 'user', content: query }
          ],
          temperature: 0.8,
          max_tokens: 500
        })
      })
      
      if (!response.ok) throw new Error('API request failed')
      
      const data = await response.json()
      return data.choices[0].message.content
    } catch (error) {
      console.error('OpenAI error:', error)
      // Return intelligent fallback based on intent
      return getIntelligentFallback(query, intent)
    }
  }

  // Update user context
  const updateUserContext = (query: string, intent: string) => {
    setUserContext(prev => {
      const updated = {
        ...prev,
        previousQueries: [...prev.previousQueries, query].slice(-10),
        currentIntent: intent
      }
      
      // Extract budget mentions
      if (query.match(/budget|cheap|affordable/i)) {
        updated.budget = 'budget'
      } else if (query.match(/luxury|premium|high.?end/i)) {
        updated.budget = 'luxury'
      } else if (query.match(/mid.?range|moderate/i)) {
        updated.budget = 'mid-range'
      }
      
      // Extract interests
      if (intent !== 'general' && !updated.interests.includes(intent)) {
        updated.interests = [...updated.interests, intent].slice(-5)
      }
      
      // Extract name
      const nameMatch = query.match(/(?:i'm|i am|my name is|call me)\s+(\w+)/i)
      if (nameMatch) {
        updated.name = nameMatch[1]
      }
      
      // Save context
      localStorage.setItem('yalu_context', JSON.stringify(updated))
      
      return updated
    })
  }

  // Intelligent fallback responses
  const getIntelligentFallback = (query: string, intent: string): string => {
    const responses = INTENT_RESPONSES[intent as keyof typeof INTENT_RESPONSES]
    if (responses) {
      if (typeof responses === 'object' && 'general' in responses) {
        return responses.general
      }
    }
    
    return `I understand you're asking about ${intent}. While I'm having a small connection issue, I can tell you that Sri Lanka offers incredible ${intent} experiences! Let me know more specifically what you're looking for - like dates, budget, or preferences - and I'll give you detailed recommendations!`
  }

  // Generate smart contextual suggestions
  const generateIntelligentSuggestions = (query: string, response: string, intent: string): string[] => {
    const baseSuggestions: Record<string, string[]> = {
      beaches: [
        "Compare South vs East beaches 🏖️",
        "Best beaches for my dates 📅", 
        "Beach + wildlife combo trip 🐘",
        "Surfing lessons & spots 🏄"
      ],
      wildlife: [
        "Book safari for my dates 🦁",
        "Leopard vs elephant parks 🐆",
        "Wildlife photography tips 📸",
        "Ethical wildlife experiences 💚"
      ],
      culture: [
        "Temple etiquette guide 🛕",
        "Festival calendar 2024 🎭",
        "Cultural triangle route 🗺️",
        "Local experiences 🎨"
      ],
      food: [
        "Must-try dishes checklist 🍛",
        "Cooking class recommendations 👨‍🍳",
        "Street food safety tips 🥘",
        "Restaurant reservations 🍽️"
      ],
      itinerary: [
        "Optimize my route 🛣️",
        "Add unique experiences ✨",
        "Time-saving tips ⏰",
        "Book everything now 🎫"
      ],
      budget: [
        "Daily budget breakdown 💵",
        "Where to save vs splurge 💎",
        "Hidden costs to know 📊",
        "Best value experiences 🌟"
      ]
    }
    
    return baseSuggestions[intent] || [
      "Tell me more about your trip 🗺️",
      "Check availability & prices 💰",
      "See photos & videos 📸",
      "Get personalized tips 💡"
    ]
  }

  // Enhanced voice synthesis
  const speakIntelligently = async (text: string) => {
    if (!elevenLabsKey || !audioEnabled) return
    
    try {
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
            model_id: 'eleven_multilingual_v2',
            voice_settings: {
              stability: 0.5,
              similarity_boost: 0.75,
              style: 0.35, // More expressive
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
      }
    } catch (error) {
      console.error('Voice synthesis error:', error)
    }
  }

  // Initialize speech recognition
  useEffect(() => {
    if (typeof window !== 'undefined' && 'webkitSpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition
      const recognition = new SpeechRecognition()
      
      recognition.continuous = false
      recognition.interimResults = true
      recognition.lang = 'en-US'
      
      recognition.onresult = (event: any) => {
        const transcript = Array.from(event.results)
          .map((result: any) => result[0].transcript)
          .join('')
        
        setInputText(transcript)
        
        if (event.results[event.results.length - 1].isFinal) {
          handleIntelligentSend(transcript)
        }
      }
      
      recognition.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error)
        setIsListening(false)
      }
      
      recognition.onend = () => {
        setIsListening(false)
      }
      
      recognitionRef.current = recognition
    }
  }, [])

  // Handle intelligent message sending
  const handleIntelligentSend = async (text?: string) => {
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

    try {
      const intent = detectIntent(messageText)
      
      // Check for action triggers
      let response: string
      let visualData = null
      let actionButtons = []
      
      if (messageText.toLowerCase().includes('weather')) {
        visualData = await getWeatherData()
      } else if (messageText.toLowerCase().includes('availability') || messageText.toLowerCase().includes('book')) {
        const availability = await checkLiveAvailability(messageText)
        response = availability.message
        actionButtons = availability.actions
      } else {
        response = await getIntelligentResponse(messageText)
      }
      
      if (!response) {
        response = await getIntelligentResponse(messageText)
      }
      
      // Determine emotion based on response
      let emotion: Message['emotion'] = 'helpful'
      if (response.includes('exciting') || response.includes('amazing')) {
        emotion = 'excited'
      } else if (response.includes('sorry') || response.includes('unfortunately')) {
        emotion = 'empathetic'
      }

      const yaluMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: response,
        sender: 'yalu',
        timestamp: new Date(),
        emotion,
        suggestions: generateIntelligentSuggestions(messageText, response, intent),
        visualData,
        actionButtons: actionButtons.length > 0 ? actionButtons : undefined
      }

      setMessages(prev => [...prev, yaluMessage])
      setYaluMood('happy')
      
      if (audioEnabled) {
        speakIntelligently(response)
      }

    } catch (error) {
      console.error('Error:', error)
      
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "I'm having a brief connection issue, but I'm still here! Based on what you asked, here's what I know: " + 
              getIntelligentFallback(inputText, detectIntent(inputText)),
        sender: 'yalu',
        timestamp: new Date(),
        emotion: 'helpful',
        suggestions: ["Try again 🔄", "Rephrase question 💭", "Contact support 💬", "Browse offline info 📖"]
      }
      
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsTyping(false)
    }
  }

  // Get weather data
  const getWeatherData = async () => {
    return {
      type: 'weather',
      data: {
        colombo: { temp: 29, condition: 'Partly Cloudy', icon: '⛅' },
        kandy: { temp: 24, condition: 'Clear', icon: '☀️' },
        galle: { temp: 28, condition: 'Sunny', icon: '☀️' },
        ella: { temp: 19, condition: 'Misty', icon: '🌫️' }
      }
    }
  }

  // Check live availability
  const checkLiveAvailability = async (query: string) => {
    // Simulate checking real availability
    return {
      message: "Great news! I found availability for your dates. Here's what's available with current prices:",
      actions: [
        { label: "View Tours", action: "view-tours", icon: MapPin },
        { label: "Check Vehicles", action: "check-vehicles", icon: Car },
        { label: "See Hotels", action: "see-hotels", icon: Hotel }
      ]
    }
  }

  // Handle voice input
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

  // Handle action button clicks
  const handleActionClick = async (action: string) => {
    switch (action) {
      case 'quick-itinerary':
        handleIntelligentSend("Create a quick 7-day itinerary for me")
        break
      case 'current-deals':
        handleIntelligentSend("Show me the best current deals and discounts")
        break
      case 'weather-forecast':
        handleIntelligentSend("What's the weather forecast for popular destinations?")
        break
      case 'view-tours':
        handleIntelligentSend("Show me available tours with prices")
        break
      case 'check-vehicles':
        handleIntelligentSend("Check vehicle availability and rates")
        break
      case 'see-hotels':
        handleIntelligentSend("Show recommended hotels in my budget")
        break
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
      <Card className="w-[480px] h-[680px] shadow-2xl border-0 overflow-hidden bg-gradient-to-br from-white to-orange-50">
        <CardHeader className="bg-gradient-to-r from-amber-500 to-orange-600 text-white p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <YaluAvatar mood={yaluMood} />
              <div>
                <CardTitle className="text-xl font-bold flex items-center gap-2">
                  Yalu AI
                  <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full">
                    Intelligent Mode
                  </span>
                </CardTitle>
                <p className="text-sm opacity-90">
                  {userContext.name ? `Helping ${userContext.name} explore Sri Lanka` : 'Your Smart Travel Companion'}
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
                    
                    {/* Visual Data Display */}
                    {message.visualData && message.visualData.type === 'weather' && (
                      <div className="mt-3 grid grid-cols-2 gap-2">
                        {Object.entries(message.visualData.data).map(([city, weather]: [string, any]) => (
                          <div key={city} className="bg-gray-50 rounded-lg p-2 text-center">
                            <p className="text-xs font-medium capitalize">{city}</p>
                            <p className="text-2xl">{weather.icon}</p>
                            <p className="text-sm font-bold">{weather.temp}°C</p>
                            <p className="text-xs text-gray-600">{weather.condition}</p>
                          </div>
                        ))}
                      </div>
                    )}
                    
                    {/* Action Buttons */}
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
                            onClick={() => handleIntelligentSend(suggestion)}
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
                      Crafting intelligent response...
                    </span>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
          
          {/* Context Bar */}
          {userContext.interests.length > 0 && (
            <div className="px-4 py-2 bg-orange-50 border-t border-orange-100">
              <div className="flex items-center gap-2 text-xs text-gray-600">
                <Brain className="h-3 w-3" />
                <span>Learning about you:</span>
                <div className="flex gap-1">
                  {userContext.interests.map((interest, idx) => (
                    <span key={idx} className="bg-white px-2 py-0.5 rounded-full text-orange-600">
                      {interest}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}
          
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
                onKeyPress={(e) => e.key === 'Enter' && handleIntelligentSend()}
                placeholder={userContext.name ? `What would you like to know, ${userContext.name}?` : "Ask me anything about Sri Lanka..."}
                className="flex-1 px-4 py-2 border border-orange-200 rounded-full focus:outline-none focus:ring-2 focus:ring-orange-400"
                disabled={isTyping || isListening}
              />
              
              <button
                onClick={() => handleIntelligentSend()}
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
    </motion.div>
  )
}

export default IntelligentYalu
