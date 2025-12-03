import React, { useState, useEffect } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Save, Plus, Trash2, MessageCircle, Sparkles, RefreshCw } from 'lucide-react';

interface YaluConfig {
  // Basic Settings
  name: string;
  greeting: string;
  personality: string;

  // Contact Info
  whatsappNumber: string;
  phoneNumber: string;
  email: string;

  // Quick Actions
  quickActions: {
    label: string;
    query: string;
    icon: string;
  }[];

  // Suggestions by category
  suggestions: {
    initial: string[];
    beaches: string[];
    wildlife: string[];
    culture: string[];
    general: string[];
  };

  // Knowledge Base
  knowledgeBase: {
    category: string;
    question: string;
    answer: string;
  }[];

  // Fallback Responses
  fallbackResponses: {
    trigger: string;
    response: string;
  }[];

  // Settings
  settings: {
    enabled: boolean;
    showOnMobile: boolean;
    autoGreet: boolean;
    greetingDelay: number;
  };
}

const defaultConfig: YaluConfig = {
  name: 'Yalu',
  greeting: "Ayubowan! I'm Yalu, your Sri Lankan travel companion. How can I help you discover Sri Lanka?",
  personality: 'Warm, enthusiastic Sri Lankan leopard who loves helping travelers discover the island.',
  whatsappNumber: '+94777721999',
  phoneNumber: '+94777721999',
  email: 'concierge@rechargetravels.com',
  quickActions: [
    { label: 'Plan Trip', query: 'Help me plan a trip to Sri Lanka', icon: 'compass' },
    { label: 'Beaches', query: 'What are the best beaches in Sri Lanka?', icon: 'waves' },
    { label: 'Safari', query: 'Tell me about wildlife safaris', icon: 'tree-pine' },
    { label: 'Train Rides', query: 'Tell me about the scenic train journeys', icon: 'train' },
  ],
  suggestions: {
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
  },
  knowledgeBase: [
    {
      category: 'Destinations',
      question: 'What are the best places to visit in Sri Lanka?',
      answer: 'Sri Lanka has amazing destinations! Sigiriya Rock Fortress, Kandy\'s Temple of the Tooth, the beaches of Mirissa, tea plantations in Ella, and wildlife safaris in Yala are must-visits.'
    },
    {
      category: 'Wildlife',
      question: 'Where can I see leopards?',
      answer: 'Yala National Park has the world\'s highest leopard density! I recommend the 5:30 AM safari for best sightings. Wilpattu is another great option with fewer crowds.'
    },
    {
      category: 'Beaches',
      question: 'Best beaches in Sri Lanka?',
      answer: 'Mirissa is perfect for whale watching, Arugam Bay for surfing, Unawatuna for swimming, and Bentota for water sports. Each offers a unique experience!'
    }
  ],
  fallbackResponses: [
    {
      trigger: 'hello|hi|hey',
      response: "Ayubowan! I'm Yalu, your Sri Lankan travel companion. What kind of adventure are you dreaming of?"
    },
    {
      trigger: 'beach',
      response: "Sri Lanka has amazing beaches! Mirissa is perfect for whale watching, Arugam Bay for surfing, and Unawatuna for swimming. Which sounds exciting to you?"
    },
    {
      trigger: 'safari|leopard|wildlife',
      response: "Oh, safari is my specialty! Yala National Park has the world's highest leopard density. I'd recommend the 5:30 AM safari for best sightings. Want me to tell you more?"
    },
    {
      trigger: 'train|ella',
      response: "The Kandy to Ella train is legendary! It's one of the world's most scenic journeys through tea plantations and mountains. Book the observation car for the best views!"
    },
    {
      trigger: 'food|eat',
      response: "Sri Lankan food is incredible! You must try kottu roti, hoppers, and our famous rice & curry. Want recommendations for specific cities?"
    },
    {
      trigger: 'book|help|plan',
      response: "I'd love to help plan your trip! You can reach our concierge team on WhatsApp at +94 777 721 999 for personalized assistance. What destinations interest you?"
    }
  ],
  settings: {
    enabled: true,
    showOnMobile: true,
    autoGreet: false,
    greetingDelay: 3000
  }
};

const YaluManager: React.FC = () => {
  const [config, setConfig] = useState<YaluConfig>(defaultConfig);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<'general' | 'quickActions' | 'suggestions' | 'knowledge' | 'fallbacks' | 'settings'>('general');

  useEffect(() => {
    loadConfig();
  }, []);

  const loadConfig = async () => {
    try {
      const docRef = doc(db, 'settings', 'yalu-config');
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setConfig({ ...defaultConfig, ...docSnap.data() } as YaluConfig);
      }
    } catch (error) {
      console.error('Error loading Yalu config:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveConfig = async () => {
    setSaving(true);
    try {
      await setDoc(doc(db, 'settings', 'yalu-config'), config);
      alert('Yalu configuration saved successfully!');
    } catch (error) {
      console.error('Error saving config:', error);
      alert('Error saving configuration. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const addQuickAction = () => {
    setConfig({
      ...config,
      quickActions: [...config.quickActions, { label: '', query: '', icon: 'sparkles' }]
    });
  };

  const removeQuickAction = (index: number) => {
    setConfig({
      ...config,
      quickActions: config.quickActions.filter((_, i) => i !== index)
    });
  };

  const addKnowledgeItem = () => {
    setConfig({
      ...config,
      knowledgeBase: [...config.knowledgeBase, { category: '', question: '', answer: '' }]
    });
  };

  const removeKnowledgeItem = (index: number) => {
    setConfig({
      ...config,
      knowledgeBase: config.knowledgeBase.filter((_, i) => i !== index)
    });
  };

  const addFallbackResponse = () => {
    setConfig({
      ...config,
      fallbackResponses: [...config.fallbackResponses, { trigger: '', response: '' }]
    });
  };

  const removeFallbackResponse = (index: number) => {
    setConfig({
      ...config,
      fallbackResponses: config.fallbackResponses.filter((_, i) => i !== index)
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="w-8 h-8 animate-spin text-amber-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center text-2xl">
            🐆
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Yalu AI Assistant</h1>
            <p className="text-gray-500">Configure your AI travel companion chatbot</p>
          </div>
        </div>
        <button
          onClick={saveConfig}
          disabled={saving}
          className="flex items-center gap-2 px-6 py-3 bg-amber-500 hover:bg-amber-600 text-white rounded-lg font-medium transition disabled:opacity-50"
        >
          {saving ? <RefreshCw className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex gap-4">
          {[
            { id: 'general', label: 'General' },
            { id: 'quickActions', label: 'Quick Actions' },
            { id: 'suggestions', label: 'Suggestions' },
            { id: 'knowledge', label: 'Knowledge Base' },
            { id: 'fallbacks', label: 'Fallback Responses' },
            { id: 'settings', label: 'Settings' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-3 font-medium border-b-2 transition ${
                activeTab === tab.id
                  ? 'border-amber-500 text-amber-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        {/* General Tab */}
        {activeTab === 'general' && (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Bot Name</label>
              <input
                type="text"
                value={config.name}
                onChange={(e) => setConfig({ ...config, name: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Welcome Greeting</label>
              <textarea
                value={config.greeting}
                onChange={(e) => setConfig({ ...config, greeting: e.target.value })}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Personality Description</label>
              <textarea
                value={config.personality}
                onChange={(e) => setConfig({ ...config, personality: e.target.value })}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                placeholder="Describe Yalu's personality for AI prompts..."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">WhatsApp Number</label>
                <input
                  type="text"
                  value={config.whatsappNumber}
                  onChange={(e) => setConfig({ ...config, whatsappNumber: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                <input
                  type="text"
                  value={config.phoneNumber}
                  onChange={(e) => setConfig({ ...config, phoneNumber: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  value={config.email}
                  onChange={(e) => setConfig({ ...config, email: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                />
              </div>
            </div>
          </div>
        )}

        {/* Quick Actions Tab */}
        {activeTab === 'quickActions' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <p className="text-gray-600">Quick action buttons shown in the chat header</p>
              <button
                onClick={addQuickAction}
                className="flex items-center gap-2 px-4 py-2 bg-amber-100 text-amber-700 rounded-lg hover:bg-amber-200 transition"
              >
                <Plus className="w-4 h-4" />
                Add Action
              </button>
            </div>

            {config.quickActions.map((action, index) => (
              <div key={index} className="flex gap-4 items-start p-4 bg-gray-50 rounded-lg">
                <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Label</label>
                    <input
                      type="text"
                      value={action.label}
                      onChange={(e) => {
                        const updated = [...config.quickActions];
                        updated[index].label = e.target.value;
                        setConfig({ ...config, quickActions: updated });
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                      placeholder="e.g., Plan Trip"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-xs font-medium text-gray-500 mb-1">Query</label>
                    <input
                      type="text"
                      value={action.query}
                      onChange={(e) => {
                        const updated = [...config.quickActions];
                        updated[index].query = e.target.value;
                        setConfig({ ...config, quickActions: updated });
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                      placeholder="e.g., Help me plan a trip to Sri Lanka"
                    />
                  </div>
                </div>
                <button
                  onClick={() => removeQuickAction(index)}
                  className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Suggestions Tab */}
        {activeTab === 'suggestions' && (
          <div className="space-y-6">
            {Object.entries(config.suggestions).map(([category, items]) => (
              <div key={category}>
                <label className="block text-sm font-medium text-gray-700 mb-2 capitalize">
                  {category} Suggestions
                </label>
                <div className="space-y-2">
                  {items.map((item, index) => (
                    <div key={index} className="flex gap-2">
                      <input
                        type="text"
                        value={item}
                        onChange={(e) => {
                          const updated = { ...config.suggestions };
                          (updated as any)[category][index] = e.target.value;
                          setConfig({ ...config, suggestions: updated });
                        }}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
                      />
                      <button
                        onClick={() => {
                          const updated = { ...config.suggestions };
                          (updated as any)[category] = (updated as any)[category].filter((_: any, i: number) => i !== index);
                          setConfig({ ...config, suggestions: updated });
                        }}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={() => {
                      const updated = { ...config.suggestions };
                      (updated as any)[category] = [...(updated as any)[category], ''];
                      setConfig({ ...config, suggestions: updated });
                    }}
                    className="text-sm text-amber-600 hover:text-amber-700"
                  >
                    + Add suggestion
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Knowledge Base Tab */}
        {activeTab === 'knowledge' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <p className="text-gray-600">Add Q&A pairs for Yalu to reference</p>
              <button
                onClick={addKnowledgeItem}
                className="flex items-center gap-2 px-4 py-2 bg-amber-100 text-amber-700 rounded-lg hover:bg-amber-200 transition"
              >
                <Plus className="w-4 h-4" />
                Add Knowledge
              </button>
            </div>

            {config.knowledgeBase.map((item, index) => (
              <div key={index} className="p-4 bg-gray-50 rounded-lg space-y-3">
                <div className="flex gap-4">
                  <div className="flex-1">
                    <label className="block text-xs font-medium text-gray-500 mb-1">Category</label>
                    <input
                      type="text"
                      value={item.category}
                      onChange={(e) => {
                        const updated = [...config.knowledgeBase];
                        updated[index].category = e.target.value;
                        setConfig({ ...config, knowledgeBase: updated });
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                      placeholder="e.g., Destinations, Wildlife, Food"
                    />
                  </div>
                  <button
                    onClick={() => removeKnowledgeItem(index)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg h-fit"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Question</label>
                  <input
                    type="text"
                    value={item.question}
                    onChange={(e) => {
                      const updated = [...config.knowledgeBase];
                      updated[index].question = e.target.value;
                      setConfig({ ...config, knowledgeBase: updated });
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                    placeholder="e.g., Where can I see leopards?"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Answer</label>
                  <textarea
                    value={item.answer}
                    onChange={(e) => {
                      const updated = [...config.knowledgeBase];
                      updated[index].answer = e.target.value;
                      setConfig({ ...config, knowledgeBase: updated });
                    }}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                    placeholder="Yalu's response..."
                  />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Fallback Responses Tab */}
        {activeTab === 'fallbacks' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-gray-600">Fallback responses when AI is unavailable</p>
                <p className="text-xs text-gray-400">Triggers use regex patterns (e.g., hello|hi|hey)</p>
              </div>
              <button
                onClick={addFallbackResponse}
                className="flex items-center gap-2 px-4 py-2 bg-amber-100 text-amber-700 rounded-lg hover:bg-amber-200 transition"
              >
                <Plus className="w-4 h-4" />
                Add Response
              </button>
            </div>

            {config.fallbackResponses.map((item, index) => (
              <div key={index} className="p-4 bg-gray-50 rounded-lg space-y-3">
                <div className="flex gap-4">
                  <div className="flex-1">
                    <label className="block text-xs font-medium text-gray-500 mb-1">
                      Trigger Pattern (regex)
                    </label>
                    <input
                      type="text"
                      value={item.trigger}
                      onChange={(e) => {
                        const updated = [...config.fallbackResponses];
                        updated[index].trigger = e.target.value;
                        setConfig({ ...config, fallbackResponses: updated });
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm font-mono"
                      placeholder="e.g., hello|hi|hey"
                    />
                  </div>
                  <button
                    onClick={() => removeFallbackResponse(index)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg h-fit"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Response</label>
                  <textarea
                    value={item.response}
                    onChange={(e) => {
                      const updated = [...config.fallbackResponses];
                      updated[index].response = e.target.value;
                      setConfig({ ...config, fallbackResponses: updated });
                    }}
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                    placeholder="Yalu's response..."
                  />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">Enable Yalu</p>
                <p className="text-sm text-gray-500">Show the Yalu chatbot on the website</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={config.settings.enabled}
                  onChange={(e) => setConfig({
                    ...config,
                    settings: { ...config.settings, enabled: e.target.checked }
                  })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-amber-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500"></div>
              </label>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">Show on Mobile</p>
                <p className="text-sm text-gray-500">Display the chatbot on mobile devices</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={config.settings.showOnMobile}
                  onChange={(e) => setConfig({
                    ...config,
                    settings: { ...config.settings, showOnMobile: e.target.checked }
                  })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-amber-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500"></div>
              </label>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">Auto Greet</p>
                <p className="text-sm text-gray-500">Automatically open chat with greeting after delay</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={config.settings.autoGreet}
                  onChange={(e) => setConfig({
                    ...config,
                    settings: { ...config.settings, autoGreet: e.target.checked }
                  })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-amber-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500"></div>
              </label>
            </div>

            {config.settings.autoGreet && (
              <div className="p-4 bg-gray-50 rounded-lg">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Greeting Delay (ms)
                </label>
                <input
                  type="number"
                  value={config.settings.greetingDelay}
                  onChange={(e) => setConfig({
                    ...config,
                    settings: { ...config.settings, greetingDelay: parseInt(e.target.value) || 3000 }
                  })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                  min={1000}
                  step={1000}
                />
                <p className="text-xs text-gray-500 mt-1">Time in milliseconds before auto-greeting (1000ms = 1 second)</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default YaluManager;
