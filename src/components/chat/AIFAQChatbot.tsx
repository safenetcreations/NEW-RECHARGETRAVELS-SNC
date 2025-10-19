import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, Bot, User, HelpCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';

// Import the knowledge base from the external file
import { SRI_LANKA_FAQ_TEXT, ICON_LIST } from './sriLankaKnowledgeBase';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  icon?: string;
}

// Initialize Gemini AI - You'll need to add your API key to environment variables
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || '';

const AIFAQChatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'initial',
      text: "Welcome to Recharge Travels AI Assistant! I can answer your questions about traveling in Sri Lanka. Try asking 'Do I need a visa?' or 'What are the best beaches?'",
      sender: 'bot',
      timestamp: new Date(),
      icon: 'waving-hand'
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen]);

  const askGeminiAI = async (question: string) => {
    if (!API_KEY) {
      throw new Error('Gemini API key not configured');
    }

    // Dynamically import to avoid bundling CommonJS code at startup
    const { GoogleGenerativeAI } = await import('@google/generative-ai');
    const genAI = new GoogleGenerativeAI(API_KEY);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const prompt = `You are a helpful AI assistant for Recharge Travels, a Sri Lankan tour company. 
    
Based on the following FAQ document, answer the user's question. If the answer is not in the document, say you don't have that information.

FAQ DOCUMENT:
${SRI_LANKA_FAQ_TEXT}

USER QUESTION: ${question}

Provide your response in JSON format with two keys:
- "answer": Your helpful response (keep it concise and friendly)
- "icon": Choose ONE icon from this list that best matches your answer: ${JSON.stringify(ICON_LIST)}

Example response format:
{"answer": "Yes, most visitors need a visa...", "icon": "visa"}`;

    try {
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      // Try to parse JSON from the response
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        return {
          answer: parsed.answer || "I couldn't find specific information about that. Please try rephrasing your question.",
          icon: parsed.icon || 'question'
        };
      }
      
      // Fallback if JSON parsing fails
      return {
        answer: text,
        icon: 'question'
      };
    } catch (error: any) {
      console.error('Gemini AI error:', error);
      if (error.message?.includes('API key')) {
        throw new Error('API key issue. Please check configuration.');
      } else if (error.message?.includes('quota')) {
        throw new Error('API quota exceeded. Please try again later.');
      } else if (error.message?.includes('model')) {
        throw new Error('Model not available. Please contact support.');
      }
      throw error;
    }
  };

  const handleSendMessage = useCallback(async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputMessage,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const response = await askGeminiAI(inputMessage);
      
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: response.answer,
        sender: 'bot',
        timestamp: new Date(),
        icon: response.icon
      };
      
      setMessages(prev => [...prev, botMessage]);
    } catch (error: any) {
      console.error('Failed to get AI response:', error);
      
      let errorText = "Sorry, I couldn't process that request. Please try again.";
      
      if (!API_KEY) {
        errorText = "AI service is not configured. Please contact support for assistance.";
      } else if (error.message) {
        errorText = error.message;
      }
      
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: errorText,
        sender: 'bot',
        timestamp: new Date(),
        icon: 'question'
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  }, [inputMessage, isLoading]);

  const getIconComponent = (iconName?: string) => {
    // Map icon names to Lucide icons
    const iconMap: { [key: string]: any } = {
      'waving-hand': '👋',
      'visa': '📄',
      'airplane': '✈️',
      'money': '💰',
      'bus': '🚌',
      'train': '🚂',
      'car': '🚗',
      'beach': '🏖️',
      'temple': '🛕',
      'food': '🍽️',
      'health': '🏥',
      'camera': '📷',
      'map': '🗺️',
      'safety': '🛡️',
      'family': '👨‍👩‍👧‍👦',
      'mountain': '🏔️',
      'surfing': '🏄',
      'question': '❓',
      'info': 'ℹ️',
    };

    return iconMap[iconName || 'question'] || '💬';
  };

  return (
    <>
      {/* Floating Chat Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-24 right-6 w-16 h-16 bg-gradient-to-r from-teal-500 to-teal-600 text-white rounded-full shadow-2xl flex items-center justify-center hover:from-teal-600 hover:to-teal-700 transition-all z-40 group"
          >
            <div className="relative">
              <HelpCircle className="w-7 h-7 group-hover:scale-110 transition-transform" />
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-orange-500 rounded-full animate-pulse" />
            </div>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.3 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.3 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed bottom-24 right-6 w-[400px] h-[600px] bg-white rounded-2xl shadow-2xl flex flex-col z-50 overflow-hidden border border-gray-200"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-teal-600 to-teal-700 text-white p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                  <Bot className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">AI Travel Assistant</h3>
                  <p className="text-xs opacity-90">Powered by Gemini AI</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="hover:bg-white/20 p-2 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Messages */}
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {messages.map((message) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`flex gap-2 max-w-[85%] ${message.sender === 'user' ? 'flex-row-reverse' : ''}`}>
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                        message.sender === 'user' ? 'bg-orange-100' : 'bg-teal-100'
                      }`}>
                        {message.sender === 'user' ? (
                          <User className="w-5 h-5 text-orange-600" />
                        ) : (
                          <span className="text-sm">{getIconComponent(message.icon)}</span>
                        )}
                      </div>
                      <div className={`px-4 py-3 rounded-2xl ${
                        message.sender === 'user' 
                          ? 'bg-orange-500 text-white' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        <p className="text-sm leading-relaxed">{message.text}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
                {isLoading && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex justify-start"
                  >
                    <div className="flex gap-2 max-w-[85%]">
                      <div className="w-8 h-8 rounded-full bg-teal-100 flex items-center justify-center">
                        <Loader2 className="w-5 h-5 text-teal-600 animate-spin" />
                      </div>
                      <div className="bg-gray-100 px-4 py-3 rounded-2xl">
                        <div className="flex gap-1">
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>

            {/* Quick Questions */}
            {messages.length === 1 && (
              <div className="px-4 pb-2">
                <p className="text-xs text-gray-500 mb-2">Popular questions:</p>
                <div className="flex flex-wrap gap-2">
                  {[
                    "Do I need a visa?",
                    "Best time to visit?",
                    "Airport transfers",
                    "What currency to use?"
                  ].map((question, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        setInputMessage(question);
                        handleSendMessage();
                      }}
                      className="text-xs bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded-full transition-colors"
                    >
                      {question}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Input */}
            <div className="p-4 border-t bg-gray-50">
              <form 
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage();
                }}
                className="flex gap-2"
              >
                <Input
                  ref={inputRef}
                  type="text"
                  placeholder="Ask about your Sri Lanka trip..."
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  className="flex-1 bg-white"
                  disabled={isLoading}
                />
                <Button
                  type="submit"
                  size="icon"
                  disabled={!inputMessage.trim() || isLoading}
                  className="bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700"
                >
                  <Send className="w-5 h-5" />
                </Button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default AIFAQChatbot;