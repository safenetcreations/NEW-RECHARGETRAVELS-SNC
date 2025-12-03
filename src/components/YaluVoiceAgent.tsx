import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Mic,
  Volume2,
  Send,
  Phone,
  MessageCircle,
  Sparkles,
  Heart,
  ChevronDown,
  Compass,
  Camera,
  Waves,
  TreePine
} from 'lucide-react';
import { cn } from '@/lib/utils';
import yaluElevenLabsService from '@/services/yaluElevenLabsService';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'yalu';
  timestamp: Date;
  emotion?: 'happy' | 'thinking' | 'excited' | 'listening';
}

interface YaluVoiceAgentProps {
  isOpen: boolean;
  onClose: () => void;
}

const QUICK_ACTIONS = [
  { icon: Compass, label: 'Plan Trip', query: 'Help me plan a trip to Sri Lanka' },
  { icon: Waves, label: 'Beaches', query: 'What are the best beaches in Sri Lanka?' },
  { icon: TreePine, label: 'Safari', query: 'Tell me about wildlife safaris' },
  { icon: Camera, label: 'Train Rides', query: 'Tell me about the scenic train journeys' }
];

const SUGGESTIONS = {
  initial: [
    "I'm planning my first trip",
    "Best time to visit?",
    "Safari adventures",
    "Beach recommendations"
  ],
  beaches: [
    "Best for surfing",
    "Family-friendly beaches",
    "Whale watching spots",
    "Secluded beaches"
  ],
  wildlife: [
    "See leopards",
    "Elephant gathering",
    "Bird watching",
    "Book a safari"
  ],
  culture: [
    "Temple visits",
    "Sigiriya Rock",
    "Festival calendar",
    "Cooking classes"
  ],
  general: [
    "Tell me more",
    "Book this experience",
    "Other options?",
    "Talk to concierge"
  ]
};

const YaluVoiceAgent: React.FC<YaluVoiceAgentProps> = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [yaluMood, setYaluMood] = useState<'happy' | 'listening' | 'thinking' | 'excited'>('happy');
  const [currentSuggestions, setCurrentSuggestions] = useState(SUGGESTIONS.initial);
  const [showScrollButton, setShowScrollButton] = useState(false);

  const chatContainerRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Initialize with welcome message
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const storedName = localStorage.getItem('yalu_user_name');
      const hour = new Date().getHours();
      const timeGreeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

      const welcomeText = storedName
        ? `${timeGreeting}, ${storedName}! Welcome back! I'm Yalu. What adventure shall we plan today?`
        : `Ayubowan! ${timeGreeting}! I'm Yalu, your Sri Lankan travel companion. How can I help you discover Sri Lanka?`;

      const welcomeMessage: Message = {
        id: Date.now().toString(),
        text: welcomeText,
        sender: 'yalu',
        timestamp: new Date(),
        emotion: 'happy'
      };

      setMessages([welcomeMessage]);
      yaluElevenLabsService.startConversation();
    }
  }, [isOpen]);

  // Initialize speech recognition
  useEffect(() => {
    if (typeof window !== 'undefined' && 'webkitSpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event: any) => {
        const transcript = Array.from(event.results)
          .map((result: any) => result[0].transcript)
          .join('');

        setInputText(transcript);

        if (event.results[event.results.length - 1].isFinal) {
          handleSend(transcript);
          setIsListening(false);
        }
      };

      recognitionRef.current.onerror = () => {
        setIsListening(false);
        setYaluMood('happy');
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
        setYaluMood('happy');
      };
    }
  }, []);

  // Auto-scroll
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  // Handle scroll button visibility
  const handleScroll = useCallback(() => {
    if (chatContainerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = chatContainerRef.current;
      setShowScrollButton(scrollHeight - scrollTop - clientHeight > 100);
    }
  }, []);

  const scrollToBottom = () => {
    chatContainerRef.current?.scrollTo({
      top: chatContainerRef.current.scrollHeight,
      behavior: 'smooth'
    });
  };

  // Handle sending message
  const handleSend = async (text?: string) => {
    const messageText = text || inputText;
    if (!messageText.trim() || isTyping) return;

    const nameMatch = messageText.match(/(?:i'm|i am|my name is|call me)\s+(\w+)/i);
    if (nameMatch) {
      localStorage.setItem('yalu_user_name', nameMatch[1]);
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      text: messageText,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);
    setYaluMood('thinking');

    try {
      const response = await yaluElevenLabsService.getYaluResponse(messageText);

      const yaluMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: response,
        sender: 'yalu',
        timestamp: new Date(),
        emotion: detectEmotion(response)
      };

      setMessages(prev => [...prev, yaluMessage]);
      updateSuggestions(messageText, response);
    } catch (error) {
      console.error('Response error:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "I'm having a small issue. You can reach our concierge on WhatsApp at +94 777 721 999!",
        sender: 'yalu',
        timestamp: new Date(),
        emotion: 'happy'
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
      setYaluMood('happy');
    }
  };

  const detectEmotion = (text: string): Message['emotion'] => {
    if (text.includes('excited') || text.includes('amazing') || text.includes('wonderful')) {
      return 'excited';
    }
    return 'happy';
  };

  const updateSuggestions = (query: string, response: string) => {
    const combined = (query + ' ' + response).toLowerCase();

    if (combined.includes('beach') || combined.includes('coast') || combined.includes('sea')) {
      setCurrentSuggestions(SUGGESTIONS.beaches);
    } else if (combined.includes('safari') || combined.includes('wildlife') || combined.includes('leopard')) {
      setCurrentSuggestions(SUGGESTIONS.wildlife);
    } else if (combined.includes('temple') || combined.includes('culture') || combined.includes('history')) {
      setCurrentSuggestions(SUGGESTIONS.culture);
    } else {
      setCurrentSuggestions(SUGGESTIONS.general);
    }
  };

  // Handle voice input toggle (speech-to-text)
  const handleVoiceToggle = () => {
    if (!recognitionRef.current) {
      alert('Voice input is not supported in your browser. Please use Chrome.');
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
      setYaluMood('happy');
    } else {
      recognitionRef.current.start();
      setIsListening(true);
      setYaluMood('listening');
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    if (suggestion.includes('concierge')) {
      window.open('https://wa.me/94777721999', '_blank');
      return;
    }
    handleSend(suggestion);
  };

  const handleQuickAction = (query: string) => {
    handleSend(query);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 100, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 100, scale: 0.9 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className="fixed bottom-4 right-4 z-[9999] w-[420px] max-w-[calc(100vw-32px)]"
      >
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-amber-100">
          {/* Header */}
          <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <YaluAvatar mood={yaluMood} isSpeaking={isSpeaking} />
                <div>
                  <h3 className="text-white font-bold text-lg">Yalu</h3>
                  <p className="text-white/80 text-xs">Your Sri Lankan Travel Companion</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="text-white/80 hover:text-white p-1 rounded-full hover:bg-white/10 transition"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Quick Actions */}
            <div className="flex gap-2 mt-3 overflow-x-auto pb-1">
              {QUICK_ACTIONS.map((action) => (
                <button
                  key={action.label}
                  onClick={() => handleQuickAction(action.query)}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-white/15 hover:bg-white/25 rounded-full text-white text-xs whitespace-nowrap transition"
                >
                  <action.icon className="h-3.5 w-3.5" />
                  {action.label}
                </button>
              ))}
            </div>
          </div>

          {/* Chat Messages */}
          <div
            ref={chatContainerRef}
            onScroll={handleScroll}
            className="h-[350px] overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-amber-50/30 to-white"
          >
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={cn(
                  'flex gap-3',
                  message.sender === 'user' ? 'justify-end' : 'justify-start'
                )}
              >
                {message.sender === 'yalu' && (
                  <YaluAvatar mood={message.emotion || 'happy'} small />
                )}

                <div
                  className={cn(
                    'max-w-[80%] rounded-2xl px-4 py-3',
                    message.sender === 'user'
                      ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white'
                      : 'bg-white shadow-md border border-amber-100 text-slate-800'
                  )}
                >
                  <p className="text-sm leading-relaxed">{message.text}</p>
                </div>
              </motion.div>
            ))}

            {isTyping && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex gap-3"
              >
                <YaluAvatar mood="thinking" small />
                <div className="bg-white shadow-md rounded-2xl px-4 py-3 border border-amber-100">
                  <div className="flex items-center gap-2">
                    <div className="flex gap-1">
                      {[0, 0.2, 0.4].map((delay, i) => (
                        <motion.div
                          key={i}
                          animate={{ y: [0, -5, 0] }}
                          transition={{ duration: 0.6, repeat: Infinity, delay }}
                          className="w-2 h-2 bg-amber-400 rounded-full"
                        />
                      ))}
                    </div>
                    <span className="text-xs text-slate-500">Yalu is thinking...</span>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Suggestions */}
            {messages.length > 0 && !isTyping && (
              <div className="flex flex-wrap gap-2 pt-2">
                {currentSuggestions.map((suggestion, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="px-3 py-1.5 text-xs bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-full text-slate-700 transition"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Scroll to bottom button */}
          {showScrollButton && (
            <button
              onClick={scrollToBottom}
              className="absolute bottom-24 right-4 p-2 bg-amber-500 text-white rounded-full shadow-lg"
            >
              <ChevronDown className="h-4 w-4" />
            </button>
          )}

          {/* Input Area */}
          <div className="p-4 border-t border-amber-100 bg-white">
            <div className="flex gap-2">
              {/* Text Input */}
              <input
                ref={inputRef}
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder={isListening ? 'Listening...' : 'Type your message...'}
                className="flex-1 px-4 py-2 border border-amber-200 rounded-full focus:outline-none focus:ring-2 focus:ring-amber-400 text-sm"
                disabled={isTyping || isListening}
              />

              {/* Send Button */}
              <button
                onClick={() => handleSend()}
                disabled={isTyping || !inputText.trim()}
                className="p-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-full hover:opacity-90 disabled:opacity-50 transition"
              >
                <Send className="h-5 w-5" />
              </button>

              {/* Mic Button */}
              <button
                onClick={handleVoiceToggle}
                disabled={isTyping}
                className={cn(
                  'p-3 rounded-full transition-all',
                  isListening
                    ? 'bg-red-500 text-white animate-pulse'
                    : 'bg-amber-100 text-amber-600 hover:bg-amber-200'
                )}
                title="Speech to text"
              >
                <Mic className="h-5 w-5" />
              </button>
            </div>

            {isListening && (
              <div className="mt-2 text-center">
                <span className="text-xs text-amber-600 flex items-center justify-center gap-2">
                  <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                  Listening... Speak now
                </span>
              </div>
            )}

            {/* Contact options */}
            <div className="flex justify-center gap-4 mt-3 pt-3 border-t border-amber-100">
              <a
                href="https://wa.me/94777721999"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-xs text-slate-600 hover:text-amber-600 transition"
              >
                <MessageCircle className="h-4 w-4" />
                WhatsApp
              </a>
              <a
                href="tel:+94777721999"
                className="flex items-center gap-1.5 text-xs text-slate-600 hover:text-amber-600 transition"
              >
                <Phone className="h-4 w-4" />
                Call Us
              </a>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

// Yalu Avatar Component
const YaluAvatar: React.FC<{
  mood: string;
  small?: boolean;
  isSpeaking?: boolean;
}> = ({ mood, small = false, isSpeaking = false }) => {
  const size = small ? 'w-10 h-10' : 'w-12 h-12';

  return (
    <motion.div
      className={cn(
        'relative rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg flex-shrink-0',
        size
      )}
      animate={
        mood === 'listening'
          ? { scale: [1, 1.1, 1] }
          : isSpeaking
          ? { scale: [1, 1.05, 1] }
          : {}
      }
      transition={{
        duration: mood === 'listening' ? 1.5 : 0.5,
        repeat: mood === 'listening' || isSpeaking ? Infinity : 0
      }}
    >
      <span className={small ? 'text-lg' : 'text-xl'}>🐆</span>

      {mood === 'thinking' && (
        <motion.div
          className="absolute -top-1 -right-1"
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
        >
          <Sparkles className="w-4 h-4 text-yellow-300" />
        </motion.div>
      )}

      {mood === 'excited' && (
        <motion.div
          className="absolute -bottom-1 -right-1"
          animate={{ scale: [1, 1.3, 1] }}
          transition={{ duration: 0.8, repeat: Infinity }}
        >
          <Heart className="w-4 h-4 text-red-500 fill-red-500" />
        </motion.div>
      )}

      {mood === 'listening' && (
        <motion.div
          className="absolute inset-0 rounded-full border-2 border-red-400"
          animate={{ scale: [1, 1.3, 1], opacity: [0.8, 0, 0.8] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
      )}

      {isSpeaking && (
        <motion.div
          className="absolute -right-1 -bottom-1 bg-green-500 rounded-full p-1"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 0.3, repeat: Infinity }}
        >
          <Volume2 className="w-3 h-3 text-white" />
        </motion.div>
      )}
    </motion.div>
  );
};

export default YaluVoiceAgent;




