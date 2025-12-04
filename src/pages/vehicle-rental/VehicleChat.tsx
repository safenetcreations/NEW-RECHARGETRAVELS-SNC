import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  MessageSquare, 
  Send, 
  Paperclip, 
  Image as ImageIcon,
  Phone,
  Video,
  MoreVertical,
  ArrowLeft,
  Check,
  CheckCheck,
  Clock,
  Car,
  User,
  Calendar,
  X,
  Smile,
  Search,
  Info
} from 'lucide-react';

// Types for messaging
interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  senderType: 'owner' | 'customer';
  senderAvatar?: string;
  content: string;
  type: 'text' | 'image' | 'file' | 'booking_request' | 'system';
  attachments?: Array<{
    type: 'image' | 'file';
    url: string;
    name: string;
    size?: number;
  }>;
  bookingData?: {
    vehicleId: string;
    vehicleName: string;
    startDate: Date;
    endDate: Date;
    totalAmount: number;
  };
  status: 'sending' | 'sent' | 'delivered' | 'read';
  createdAt: Date;
  readAt?: Date;
}

interface Conversation {
  id: string;
  bookingId?: string;
  vehicleId: string;
  vehicleName: string;
  vehicleImage: string;
  participants: {
    owner: {
      id: string;
      name: string;
      avatar?: string;
      isOnline: boolean;
      lastSeen?: Date;
    };
    customer: {
      id: string;
      name: string;
      avatar?: string;
      isOnline: boolean;
      lastSeen?: Date;
    };
  };
  lastMessage?: {
    content: string;
    senderId: string;
    createdAt: Date;
  };
  unreadCount: number;
  status: 'active' | 'archived' | 'closed';
  createdAt: Date;
  updatedAt: Date;
}

const VehicleChat: React.FC = () => {
  const { conversationId } = useParams<{ conversationId?: string }>();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [showConversationList, setShowConversationList] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAttachMenu, setShowAttachMenu] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Mock current user (replace with actual auth)
  const currentUser = {
    id: 'user-001',
    name: 'John Anderson',
    type: 'customer' as const
  };

  useEffect(() => {
    loadConversations();
  }, []);

  useEffect(() => {
    if (conversationId) {
      const conv = conversations.find(c => c.id === conversationId);
      if (conv) {
        setSelectedConversation(conv);
        loadMessages(conversationId);
        setShowConversationList(false);
      }
    }
  }, [conversationId, conversations]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const loadConversations = async () => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 800));

      const mockConversations: Conversation[] = [
        {
          id: 'conv-001',
          vehicleId: 'vehicle-001',
          vehicleName: '2024 Toyota Land Cruiser',
          vehicleImage: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=200',
          participants: {
            owner: {
              id: 'owner-001',
              name: 'Sunil Perera',
              avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100',
              isOnline: true
            },
            customer: {
              id: 'user-001',
              name: 'John Anderson',
              isOnline: true
            }
          },
          lastMessage: {
            content: 'Yes, the vehicle is available for those dates. Would you like to proceed with the booking?',
            senderId: 'owner-001',
            createdAt: new Date(Date.now() - 5 * 60 * 1000)
          },
          unreadCount: 1,
          status: 'active',
          createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
          updatedAt: new Date(Date.now() - 5 * 60 * 1000)
        },
        {
          id: 'conv-002',
          bookingId: 'booking-002',
          vehicleId: 'vehicle-002',
          vehicleName: '2023 Honda CR-V',
          vehicleImage: 'https://images.unsplash.com/photo-1568844293986-8c2a5c87f5b7?w=200',
          participants: {
            owner: {
              id: 'owner-002',
              name: 'Kumara Silva',
              isOnline: false,
              lastSeen: new Date(Date.now() - 2 * 60 * 60 * 1000)
            },
            customer: {
              id: 'user-001',
              name: 'John Anderson',
              isOnline: true
            }
          },
          lastMessage: {
            content: 'Thank you for choosing our vehicle! Have a great trip.',
            senderId: 'owner-002',
            createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
          },
          unreadCount: 0,
          status: 'active',
          createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
          updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
        },
        {
          id: 'conv-003',
          vehicleId: 'vehicle-003',
          vehicleName: '2023 Suzuki Jimny',
          vehicleImage: 'https://images.unsplash.com/photo-1609521263047-f8f205293f24?w=200',
          participants: {
            owner: {
              id: 'owner-003',
              name: 'Nimal Fernando',
              isOnline: true
            },
            customer: {
              id: 'user-001',
              name: 'John Anderson',
              isOnline: true
            }
          },
          lastMessage: {
            content: 'Is this vehicle suitable for off-road driving?',
            senderId: 'user-001',
            createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)
          },
          unreadCount: 0,
          status: 'active',
          createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
          updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)
        }
      ];

      setConversations(mockConversations);

      if (!conversationId && mockConversations.length > 0) {
        setSelectedConversation(mockConversations[0]);
        loadMessages(mockConversations[0].id);
      }
    } catch (error) {
      console.error('Error loading conversations:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadMessages = async (convId: string) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 500));

      const mockMessages: Message[] = [
        {
          id: 'msg-001',
          conversationId: convId,
          senderId: 'user-001',
          senderName: 'John Anderson',
          senderType: 'customer',
          content: 'Hi, I\'m interested in renting your Toyota Land Cruiser for a trip from December 1-4. Is it available?',
          type: 'text',
          status: 'read',
          createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
          readAt: new Date(Date.now() - 1.5 * 60 * 60 * 1000)
        },
        {
          id: 'msg-002',
          conversationId: convId,
          senderId: 'owner-001',
          senderName: 'Sunil Perera',
          senderType: 'owner',
          senderAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100',
          content: 'Hello John! Thank you for your interest. Let me check the availability for those dates.',
          type: 'text',
          status: 'read',
          createdAt: new Date(Date.now() - 1.5 * 60 * 60 * 1000),
          readAt: new Date(Date.now() - 1 * 60 * 60 * 1000)
        },
        {
          id: 'msg-003',
          conversationId: convId,
          senderId: 'owner-001',
          senderName: 'Sunil Perera',
          senderType: 'owner',
          senderAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100',
          content: 'Great news! The vehicle is available from December 1-4. The daily rate is $120 USD.',
          type: 'text',
          status: 'read',
          createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000),
          readAt: new Date(Date.now() - 45 * 60 * 1000)
        },
        {
          id: 'msg-004',
          conversationId: convId,
          senderId: 'user-001',
          senderName: 'John Anderson',
          senderType: 'customer',
          content: 'That sounds perfect! Can you provide airport pickup from Colombo International?',
          type: 'text',
          status: 'read',
          createdAt: new Date(Date.now() - 30 * 60 * 1000),
          readAt: new Date(Date.now() - 20 * 60 * 1000)
        },
        {
          id: 'msg-005',
          conversationId: convId,
          senderId: 'owner-001',
          senderName: 'Sunil Perera',
          senderType: 'owner',
          senderAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100',
          content: 'Absolutely! Airport delivery is available for $25 USD. I can have the vehicle waiting for you at the arrivals area.',
          type: 'text',
          status: 'read',
          createdAt: new Date(Date.now() - 15 * 60 * 1000)
        },
        {
          id: 'msg-006',
          conversationId: convId,
          senderId: 'owner-001',
          senderName: 'Sunil Perera',
          senderType: 'owner',
          senderAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100',
          content: 'Yes, the vehicle is available for those dates. Would you like to proceed with the booking?',
          type: 'text',
          status: 'delivered',
          createdAt: new Date(Date.now() - 5 * 60 * 1000)
        }
      ];

      setMessages(mockMessages);
    } catch (error) {
      console.error('Error loading messages:', error);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedConversation) return;

    setSending(true);
    const tempMessage: Message = {
      id: `msg-temp-${Date.now()}`,
      conversationId: selectedConversation.id,
      senderId: currentUser.id,
      senderName: currentUser.name,
      senderType: currentUser.type,
      content: newMessage,
      type: 'text',
      status: 'sending',
      createdAt: new Date()
    };

    setMessages(prev => [...prev, tempMessage]);
    setNewMessage('');

    try {
      await new Promise(resolve => setTimeout(resolve, 500));

      setMessages(prev => prev.map(msg => 
        msg.id === tempMessage.id 
          ? { ...msg, id: `msg-${Date.now()}`, status: 'sent' as const }
          : msg
      ));

      // Update conversation's last message
      setConversations(prev => prev.map(conv =>
        conv.id === selectedConversation.id
          ? {
              ...conv,
              lastMessage: {
                content: newMessage,
                senderId: currentUser.id,
                createdAt: new Date()
              },
              updatedAt: new Date()
            }
          : conv
      ));
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setSending(false);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0 || !selectedConversation) return;

    const file = files[0];
    const isImage = file.type.startsWith('image/');

    const tempMessage: Message = {
      id: `msg-temp-${Date.now()}`,
      conversationId: selectedConversation.id,
      senderId: currentUser.id,
      senderName: currentUser.name,
      senderType: currentUser.type,
      content: isImage ? 'Sent an image' : `Sent a file: ${file.name}`,
      type: isImage ? 'image' : 'file',
      attachments: [{
        type: isImage ? 'image' : 'file',
        url: URL.createObjectURL(file),
        name: file.name,
        size: file.size
      }],
      status: 'sending',
      createdAt: new Date()
    };

    setMessages(prev => [...prev, tempMessage]);
    setShowAttachMenu(false);

    // Simulate upload
    await new Promise(resolve => setTimeout(resolve, 1000));

    setMessages(prev => prev.map(msg =>
      msg.id === tempMessage.id
        ? { ...msg, id: `msg-${Date.now()}`, status: 'sent' as const }
        : msg
    ));
  };

  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const formatDate = (date: Date) => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return new Date(date).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric'
      });
    }
  };

  const getMessageStatusIcon = (status: Message['status']) => {
    switch (status) {
      case 'sending':
        return <Clock className="h-3 w-3 text-gray-400" />;
      case 'sent':
        return <Check className="h-3 w-3 text-gray-400" />;
      case 'delivered':
        return <CheckCheck className="h-3 w-3 text-gray-400" />;
      case 'read':
        return <CheckCheck className="h-3 w-3 text-blue-500" />;
      default:
        return null;
    }
  };

  const filteredConversations = conversations.filter(conv =>
    conv.vehicleName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    conv.participants.owner.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <MessageSquare className="h-12 w-12 text-emerald-600 animate-pulse mx-auto mb-4" />
          <p className="text-gray-600">Loading conversations...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Link to="/vehicle-rental/my-bookings" className="mr-4 p-2 hover:bg-white/10 rounded-lg md:hidden">
                <ArrowLeft className="h-5 w-5" />
              </Link>
              <div>
                <h1 className="text-xl font-bold flex items-center">
                  <MessageSquare className="h-6 w-6 mr-2" />
                  Messages
                </h1>
                <p className="text-sm text-emerald-100">Chat with vehicle owners</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto">
        <div className="flex h-[calc(100vh-120px)]">
          {/* Conversation List */}
          <div className={`w-full md:w-96 bg-white border-r ${showConversationList ? 'block' : 'hidden md:block'}`}>
            <div className="p-4 border-b">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search conversations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            <div className="overflow-y-auto h-[calc(100%-70px)]">
              {filteredConversations.length === 0 ? (
                <div className="p-8 text-center">
                  <MessageSquare className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">No conversations yet</p>
                </div>
              ) : (
                filteredConversations.map((conv) => {
                  const otherParticipant = currentUser.type === 'customer' 
                    ? conv.participants.owner 
                    : conv.participants.customer;

                  return (
                    <button
                      key={conv.id}
                      onClick={() => {
                        setSelectedConversation(conv);
                        loadMessages(conv.id);
                        setShowConversationList(false);
                      }}
                      className={`w-full p-4 flex items-start gap-3 hover:bg-gray-50 transition-colors border-b text-left ${
                        selectedConversation?.id === conv.id ? 'bg-emerald-50' : ''
                      }`}
                    >
                      <div className="relative">
                        <img
                          src={conv.vehicleImage}
                          alt={conv.vehicleName}
                          className="w-12 h-12 rounded-lg object-cover"
                        />
                        {otherParticipant.isOnline && (
                          <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h3 className="font-medium text-gray-900 truncate">
                            {otherParticipant.name}
                          </h3>
                          {conv.lastMessage && (
                            <span className="text-xs text-gray-500">
                              {formatDate(conv.lastMessage.createdAt)}
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-500 truncate">
                          {conv.vehicleName}
                        </p>
                        {conv.lastMessage && (
                          <p className="text-sm text-gray-600 truncate mt-1">
                            {conv.lastMessage.senderId === currentUser.id ? 'You: ' : ''}
                            {conv.lastMessage.content}
                          </p>
                        )}
                      </div>
                      {conv.unreadCount > 0 && (
                        <span className="bg-emerald-600 text-white text-xs font-bold px-2 py-1 rounded-full">
                          {conv.unreadCount}
                        </span>
                      )}
                    </button>
                  );
                })
              )}
            </div>
          </div>

          {/* Chat Area */}
          <div className={`flex-1 flex flex-col bg-gray-50 ${!showConversationList ? 'block' : 'hidden md:flex'}`}>
            {selectedConversation ? (
              <>
                {/* Chat Header */}
                <div className="bg-white px-4 py-3 border-b flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setShowConversationList(true)}
                      className="md:hidden p-2 hover:bg-gray-100 rounded-lg"
                      title="Back to conversations"
                    >
                      <ArrowLeft className="h-5 w-5" />
                    </button>
                    <img
                      src={selectedConversation.vehicleImage}
                      alt={selectedConversation.vehicleName}
                      className="w-10 h-10 rounded-lg object-cover"
                    />
                    <div>
                      <h3 className="font-medium text-gray-900">
                        {currentUser.type === 'customer'
                          ? selectedConversation.participants.owner.name
                          : selectedConversation.participants.customer.name}
                      </h3>
                      <p className="text-sm text-gray-500 flex items-center">
                        <Car className="h-3 w-3 mr-1" />
                        {selectedConversation.vehicleName}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Link
                      to={`/vehicle-rental/vehicle/${selectedConversation.vehicleId}`}
                      className="p-2 hover:bg-gray-100 rounded-lg text-gray-600"
                      title="View vehicle details"
                    >
                      <Info className="h-5 w-5" />
                    </Link>
                    <button
                      className="p-2 hover:bg-gray-100 rounded-lg text-gray-600"
                      title="More options"
                    >
                      <MoreVertical className="h-5 w-5" />
                    </button>
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {messages.map((message, index) => {
                    const isOwnMessage = message.senderId === currentUser.id;
                    const showAvatar = !isOwnMessage && (
                      index === 0 || messages[index - 1].senderId !== message.senderId
                    );

                    return (
                      <div
                        key={message.id}
                        className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
                      >
                        <div className={`flex items-end gap-2 max-w-[80%] ${isOwnMessage ? 'flex-row-reverse' : ''}`}>
                          {!isOwnMessage && showAvatar && message.senderAvatar && (
                            <img
                              src={message.senderAvatar}
                              alt={message.senderName}
                              className="w-8 h-8 rounded-full"
                            />
                          )}
                          {!isOwnMessage && !showAvatar && (
                            <div className="w-8" />
                          )}
                          <div className={`rounded-2xl px-4 py-2 ${
                            isOwnMessage 
                              ? 'bg-emerald-600 text-white rounded-br-md' 
                              : 'bg-white text-gray-900 rounded-bl-md shadow-sm'
                          }`}>
                            {message.type === 'image' && message.attachments?.[0] && (
                              <img
                                src={message.attachments[0].url}
                                alt="Attachment"
                                className="max-w-xs rounded-lg mb-2"
                              />
                            )}
                            <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                            <div className={`flex items-center justify-end gap-1 mt-1 ${
                              isOwnMessage ? 'text-emerald-100' : 'text-gray-400'
                            }`}>
                              <span className="text-xs">{formatTime(message.createdAt)}</span>
                              {isOwnMessage && getMessageStatusIcon(message.status)}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  <div ref={messagesEndRef} />
                </div>

                {/* Message Input */}
                <div className="bg-white border-t p-4">
                  <div className="flex items-end gap-2">
                    <div className="relative">
                      <button
                        onClick={() => setShowAttachMenu(!showAttachMenu)}
                        className="p-2 hover:bg-gray-100 rounded-lg text-gray-500"
                        title="Attach file"
                      >
                        <Paperclip className="h-5 w-5" />
                      </button>
                      {showAttachMenu && (
                        <div className="absolute bottom-12 left-0 bg-white rounded-lg shadow-lg border p-2 min-w-[150px]">
                          <button
                            onClick={() => fileInputRef.current?.click()}
                            className="w-full flex items-center gap-2 px-3 py-2 hover:bg-gray-50 rounded-lg text-left"
                          >
                            <ImageIcon className="h-4 w-4 text-blue-500" />
                            <span className="text-sm">Photo</span>
                          </button>
                          <button
                            onClick={() => fileInputRef.current?.click()}
                            className="w-full flex items-center gap-2 px-3 py-2 hover:bg-gray-50 rounded-lg text-left"
                          >
                            <Paperclip className="h-4 w-4 text-orange-500" />
                            <span className="text-sm">Document</span>
                          </button>
                        </div>
                      )}
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*,.pdf,.doc,.docx"
                        onChange={handleFileUpload}
                        className="hidden"
                        title="Upload file"
                        aria-label="Upload file"
                      />
                    </div>
                    <div className="flex-1">
                      <textarea
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            sendMessage();
                          }
                        }}
                        placeholder="Type a message..."
                        rows={1}
                        className="w-full px-4 py-2 border rounded-2xl focus:ring-2 focus:ring-emerald-500 resize-none"
                      />
                    </div>
                    <button
                      onClick={sendMessage}
                      disabled={!newMessage.trim() || sending}
                      className="p-3 bg-emerald-600 text-white rounded-full hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed"
                      title="Send message"
                    >
                      <Send className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <MessageSquare className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900">Select a conversation</h3>
                  <p className="text-gray-500 mt-1">Choose a conversation to start chatting</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VehicleChat;
