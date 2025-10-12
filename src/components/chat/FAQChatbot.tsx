import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, Bot, User, HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

interface FAQItem {
  question: string;
  answer: string;
  keywords: string[];
  category: string;
}

const faqDatabase: FAQItem[] = [
  // Booking & Reservations
  {
    question: "How do I book a tour?",
    answer: "You can book a tour by visiting our tours section, selecting your preferred experience, and clicking the 'Book Now' button. Follow the simple booking process to select dates, number of travelers, and make payment.",
    keywords: ["book", "booking", "reserve", "reservation", "how to book"],
    category: "booking"
  },
  {
    question: "Can I cancel my booking?",
    answer: "Yes, you can cancel your booking up to 48 hours before the tour date for a full refund. Cancellations made within 48 hours may incur a cancellation fee. Please check our cancellation policy for specific tour types.",
    keywords: ["cancel", "cancellation", "refund", "cancel booking"],
    category: "booking"
  },
  {
    question: "What payment methods do you accept?",
    answer: "We accept all major credit cards (Visa, MasterCard, American Express), debit cards, PayPal, and bank transfers. For group bookings, we also offer installment payment options.",
    keywords: ["payment", "pay", "credit card", "payment method", "how to pay"],
    category: "payment"
  },
  
  // Tours & Experiences
  {
    question: "What is included in the tour price?",
    answer: "Tour prices typically include transportation, professional guide services, entrance fees to attractions, and activities mentioned in the itinerary. Meals are included as specified in each tour description. Personal expenses and tips are not included.",
    keywords: ["included", "price include", "what's included", "tour inclusions"],
    category: "tours"
  },
  {
    question: "Do you offer private tours?",
    answer: "Yes! We offer private tours for all our experiences. Private tours can be customized to your preferences, schedule, and group size. Contact us for personalized private tour arrangements.",
    keywords: ["private", "private tour", "customized", "personalized"],
    category: "tours"
  },
  {
    question: "What should I bring on the tour?",
    answer: "We recommend bringing comfortable walking shoes, sunscreen, a hat, camera, water bottle, and any personal medications. For specific tours like wildlife safaris or hiking, we'll send you a detailed packing list after booking.",
    keywords: ["bring", "what to bring", "pack", "packing list", "need"],
    category: "tours"
  },
  
  // Transportation
  {
    question: "Do you provide airport transfers?",
    answer: "Yes, we provide airport pickup and drop-off services from all major airports in Sri Lanka. You can add airport transfers when booking your tour or book them separately through our transport section.",
    keywords: ["airport", "transfer", "pickup", "drop", "airport transfer"],
    category: "transport"
  },
  {
    question: "What type of vehicles do you use?",
    answer: "We use modern, air-conditioned vehicles including cars, vans, and buses depending on group size. All vehicles are well-maintained, insured, and driven by experienced, licensed drivers.",
    keywords: ["vehicle", "car", "van", "bus", "transport", "transportation"],
    category: "transport"
  },
  
  // Accommodation
  {
    question: "Can you arrange accommodation?",
    answer: "Yes, we can arrange accommodation at carefully selected hotels, guesthouses, and resorts. We offer options ranging from budget to luxury properties, all meeting our quality standards.",
    keywords: ["hotel", "accommodation", "stay", "lodging", "where to stay"],
    category: "accommodation"
  },
  {
    question: "Are meals included in accommodation?",
    answer: "It depends on the package. Some accommodations include breakfast, while others offer half-board (breakfast and dinner) or full-board options. Check the specific details when booking.",
    keywords: ["meals", "food", "breakfast", "dinner", "lunch", "meal included"],
    category: "accommodation"
  },
  
  // Safety & Health
  {
    question: "Is Sri Lanka safe for tourists?",
    answer: "Yes, Sri Lanka is generally very safe for tourists. We prioritize your safety with experienced guides, safe transportation, and carefully selected activities. We also provide 24/7 support during your tour.",
    keywords: ["safe", "safety", "secure", "security", "dangerous"],
    category: "safety"
  },
  {
    question: "Do I need travel insurance?",
    answer: "We strongly recommend travel insurance that covers medical emergencies, trip cancellations, and lost luggage. While not mandatory, it provides peace of mind during your travels.",
    keywords: ["insurance", "travel insurance", "medical", "coverage"],
    category: "safety"
  },
  
  // Visa & Documentation
  {
    question: "Do I need a visa to visit Sri Lanka?",
    answer: "Most visitors need a visa to enter Sri Lanka. You can apply for an Electronic Travel Authorization (ETA) online before arrival. We can assist with visa information and the application process.",
    keywords: ["visa", "eta", "entry", "passport", "documentation"],
    category: "visa"
  },
  
  // Weather & Best Time
  {
    question: "What is the best time to visit Sri Lanka?",
    answer: "Sri Lanka can be visited year-round! The west and south coasts are best from December to March, while the east coast is ideal from April to September. The hill country is pleasant throughout the year.",
    keywords: ["best time", "when", "weather", "season", "climate"],
    category: "weather"
  },
  
  // Special Requirements
  {
    question: "Do you accommodate dietary restrictions?",
    answer: "Yes, we can accommodate various dietary requirements including vegetarian, vegan, halal, and gluten-free options. Please inform us of any dietary restrictions when booking.",
    keywords: ["diet", "vegetarian", "vegan", "food", "allergy", "halal", "dietary"],
    category: "special"
  },
  {
    question: "Are your tours suitable for children?",
    answer: "Many of our tours are family-friendly and suitable for children. We offer special family packages with activities designed for all ages. Check specific tour descriptions for age recommendations.",
    keywords: ["children", "kids", "family", "child", "age"],
    category: "special"
  },
  
  // Contact & Support
  {
    question: "How can I contact you during my tour?",
    answer: "We provide 24/7 support during your tour. You'll receive emergency contact numbers upon booking. Our team is always available via phone, WhatsApp, or email for any assistance.",
    keywords: ["contact", "phone", "emergency", "support", "help"],
    category: "contact"
  },
  {
    question: "Do you have a physical office?",
    answer: "Yes, we have offices in Colombo and Kandy. You're welcome to visit us for in-person consultations. Our main office hours are 9 AM to 6 PM, Monday through Saturday.",
    keywords: ["office", "location", "address", "visit", "where"],
    category: "contact"
  }
];

const quickReplies = [
  "How to book a tour?",
  "Cancellation policy",
  "Payment methods",
  "Airport transfers",
  "Best time to visit"
];

const FAQChatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hello! I'm your travel assistant. How can I help you today? You can ask me about bookings, tours, transportation, or any other travel-related questions.",
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
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
      inputRef.current.focus();
    }
  }, [isOpen]);

  const findBestAnswer = (query: string): string => {
    const lowerQuery = query.toLowerCase();
    
    // First, try exact question match
    const exactMatch = faqDatabase.find(faq => 
      faq.question.toLowerCase() === lowerQuery
    );
    if (exactMatch) return exactMatch.answer;

    // Then, try keyword matching with scoring
    let bestMatch: FAQItem | null = null;
    let highestScore = 0;

    faqDatabase.forEach(faq => {
      let score = 0;
      
      // Check if query contains the question
      if (lowerQuery.includes(faq.question.toLowerCase())) {
        score += 10;
      }
      
      // Check keywords
      faq.keywords.forEach(keyword => {
        if (lowerQuery.includes(keyword)) {
          score += 5;
        }
      });
      
      // Check if any word in the query matches words in the question
      const queryWords = lowerQuery.split(' ');
      const questionWords = faq.question.toLowerCase().split(' ');
      queryWords.forEach(qWord => {
        if (questionWords.includes(qWord) && qWord.length > 3) {
          score += 2;
        }
      });

      if (score > highestScore) {
        highestScore = score;
        bestMatch = faq;
      }
    });

    if (bestMatch && highestScore >= 5) {
      return bestMatch.answer;
    }

    // If no good match found, return a helpful response
    return "I'm not sure I understand your question. Could you please rephrase it or try asking about: bookings, tours, payment, transportation, accommodation, or visa requirements? You can also contact our support team for personalized assistance.";
  };

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputMessage,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    // Simulate bot typing and response
    setTimeout(() => {
      const botResponse = findBestAnswer(inputMessage);
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: botResponse,
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, 1000);
  };

  const handleQuickReply = (question: string) => {
    setInputMessage(question);
    handleSendMessage();
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
            className="fixed bottom-24 right-6 w-14 h-14 bg-blue-600 text-white rounded-full shadow-lg flex items-center justify-center hover:bg-blue-700 transition-colors z-40"
          >
            <HelpCircle className="w-6 h-6" />
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
            className="fixed bottom-24 right-6 w-96 h-[600px] bg-white rounded-2xl shadow-2xl flex flex-col z-50 overflow-hidden"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                  <Bot className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-semibold">Travel Assistant</h3>
                  <p className="text-xs opacity-90">Ask me anything!</p>
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
                    <div className={`flex gap-2 max-w-[80%] ${message.sender === 'user' ? 'flex-row-reverse' : ''}`}>
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                        message.sender === 'user' ? 'bg-orange-100' : 'bg-blue-100'
                      }`}>
                        {message.sender === 'user' ? (
                          <User className="w-5 h-5 text-orange-600" />
                        ) : (
                          <Bot className="w-5 h-5 text-blue-600" />
                        )}
                      </div>
                      <div className={`px-4 py-2 rounded-2xl ${
                        message.sender === 'user' 
                          ? 'bg-orange-500 text-white' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        <p className="text-sm">{message.text}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
                {isTyping && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex justify-start"
                  >
                    <div className="bg-gray-100 px-4 py-2 rounded-2xl">
                      <div className="flex gap-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                      </div>
                    </div>
                  </motion.div>
                )}
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>

            {/* Quick Replies */}
            {messages.length === 1 && (
              <div className="px-4 pb-2">
                <p className="text-xs text-gray-500 mb-2">Quick questions:</p>
                <div className="flex flex-wrap gap-2">
                  {quickReplies.map((reply, index) => (
                    <button
                      key={index}
                      onClick={() => handleQuickReply(reply)}
                      className="text-xs bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded-full transition-colors"
                    >
                      {reply}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Input */}
            <div className="p-4 border-t">
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
                  placeholder="Type your question..."
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  className="flex-1"
                />
                <Button
                  type="submit"
                  size="icon"
                  disabled={!inputMessage.trim() || isTyping}
                  className="bg-orange-500 hover:bg-orange-600"
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

export default FAQChatbot;