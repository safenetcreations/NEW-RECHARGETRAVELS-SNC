import React, { useState } from 'react';
import {
  Brain, Sparkles, Wand2, FileText, Image, MessageSquare,
  TrendingUp, Globe, Loader2, Copy, Check, RefreshCw,
  Settings, ChevronDown, Send, Zap, AlertCircle, BookOpen,
  Instagram, Twitter, Facebook, Linkedin, PenTool, Target
} from 'lucide-react';

type AIProvider = 'gemini' | 'openai' | 'perplexity';
type ContentType = 'blog' | 'tour' | 'seo' | 'social' | 'email' | 'description';

interface GenerationResult {
  content: string;
  provider: AIProvider;
  timestamp: Date;
}

const AIContentHub: React.FC = () => {
  const [selectedProvider, setSelectedProvider] = useState<AIProvider>('gemini');
  const [contentType, setContentType] = useState<ContentType>('blog');
  const [prompt, setPrompt] = useState('');
  const [topic, setTopic] = useState('');
  const [keywords, setKeywords] = useState('');
  const [tone, setTone] = useState('professional');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<GenerationResult | null>(null);
  const [copied, setCopied] = useState(false);
  const [history, setHistory] = useState<GenerationResult[]>([]);

  const providers = [
    { id: 'gemini' as AIProvider, name: 'Google Gemini', icon: '✨', color: 'from-blue-500 to-purple-600' },
    { id: 'openai' as AIProvider, name: 'ChatGPT (GPT-4)', icon: '🤖', color: 'from-emerald-500 to-teal-600' },
    { id: 'perplexity' as AIProvider, name: 'Perplexity AI', icon: '🔮', color: 'from-orange-500 to-pink-600' },
  ];

  const contentTypes = [
    { id: 'blog' as ContentType, name: 'Blog Post', icon: FileText, description: 'Full blog articles' },
    { id: 'tour' as ContentType, name: 'Tour Description', icon: Globe, description: 'Tour packages' },
    { id: 'seo' as ContentType, name: 'SEO Content', icon: TrendingUp, description: 'Meta & keywords' },
    { id: 'social' as ContentType, name: 'Social Media', icon: MessageSquare, description: 'Posts & captions' },
    { id: 'email' as ContentType, name: 'Email Template', icon: Send, description: 'Marketing emails' },
    { id: 'description' as ContentType, name: 'Descriptions', icon: PenTool, description: 'Short copy' },
  ];

  const tones = [
    { id: 'professional', name: 'Professional' },
    { id: 'casual', name: 'Casual & Friendly' },
    { id: 'luxurious', name: 'Luxury & Exclusive' },
    { id: 'adventurous', name: 'Adventurous' },
    { id: 'informative', name: 'Informative' },
  ];

  const quickPrompts = {
    blog: [
      'Write a travel blog about the best time to visit Sri Lanka',
      'Create an article about hidden gems in Sri Lanka',
      'Write about Sri Lankan cuisine and food experiences',
    ],
    tour: [
      'Describe a 7-day cultural tour of Sri Lanka',
      'Create a wildlife safari tour description',
      'Write about a luxury tea country experience',
    ],
    seo: [
      'Generate SEO meta description for Sri Lanka tours',
      'Create keywords for beach holiday packages',
      'Write title tags for adventure tours',
    ],
    social: [
      'Create Instagram captions for Sigiriya',
      'Write Twitter thread about Sri Lanka travel tips',
      'Generate Facebook post for whale watching tour',
    ],
    email: [
      'Write welcome email for new customers',
      'Create booking confirmation email template',
      'Write promotional email for monsoon discounts',
    ],
    description: [
      'Describe Sigiriya Rock Fortress for tourists',
      'Write a short description for Yala Safari',
      'Create hotel amenities description',
    ],
  };

  const generateContent = async () => {
    if (!prompt && !topic) {
      alert('Please enter a prompt or topic');
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      // Build the full prompt based on content type
      let systemPrompt = '';
      const fullPrompt = prompt || `Write about: ${topic}`;

      switch (contentType) {
        case 'blog':
          systemPrompt = `You are a travel content writer for Recharge Travels Sri Lanka. Write an engaging, SEO-friendly blog post. Tone: ${tone}. Include headings, bullet points where appropriate. Keywords to include: ${keywords || 'Sri Lanka, travel, tourism'}`;
          break;
        case 'tour':
          systemPrompt = `You are a travel package copywriter. Create an enticing tour description that highlights unique experiences, includes itinerary highlights, what's included, and a compelling call to action. Tone: ${tone}. For Recharge Travels Sri Lanka.`;
          break;
        case 'seo':
          systemPrompt = `You are an SEO expert. Generate SEO-optimized content including: meta title (60 chars), meta description (155 chars), 10 relevant keywords, and H1/H2 suggestions. Focus on: ${keywords || 'Sri Lanka travel'}`;
          break;
        case 'social':
          systemPrompt = `You are a social media manager for a Sri Lanka travel company. Create engaging posts with emojis, hashtags, and compelling hooks. Tone: ${tone}. Generate content for Instagram, Twitter, and Facebook.`;
          break;
        case 'email':
          systemPrompt = `You are an email marketing specialist for Recharge Travels. Write a professional email with subject line, preheader, body content, and CTA. Tone: ${tone}. Include personalization placeholders like {{name}}.`;
          break;
        case 'description':
          systemPrompt = `You are a tourism copywriter. Write concise, compelling descriptions that inspire travel. Focus on sensory details and unique selling points. Tone: ${tone}. 100-200 words.`;
          break;
      }

      // Mock AI response - in production, call actual APIs
      // For Gemini: https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent
      // For OpenAI: https://api.openai.com/v1/chat/completions
      // For Perplexity: https://api.perplexity.ai/chat/completions

      await new Promise(resolve => setTimeout(resolve, 2000));

      const mockResponses: Record<ContentType, string> = {
        blog: `# Discover the Magic of Sri Lanka: A Complete Travel Guide

Sri Lanka, the "Pearl of the Indian Ocean," offers an incredible tapestry of experiences that captivate every traveler. From ancient temples to pristine beaches, this island nation promises unforgettable adventures.

## Why Visit Sri Lanka?

🌴 **Diverse Landscapes**: From misty hill country to tropical coastlines
🐘 **Wildlife Encounters**: Home to leopards, elephants, and blue whales
🏛️ **Rich Heritage**: 8 UNESCO World Heritage Sites
🍛 **Culinary Delights**: Authentic Ceylon cuisine and world-famous tea

## Top Experiences

1. **Sigiriya Rock Fortress** - The iconic ancient citadel
2. **Yala National Park** - Best leopard sightings in the world
3. **Kandy Temple** - Sacred Temple of the Tooth Relic
4. **Ella Train Journey** - Scenic railway through tea country
5. **Mirissa Whale Watching** - Encounter majestic blue whales

## Best Time to Visit

The ideal time depends on your destination:
- **West & South Coast**: November to April
- **East Coast**: April to September
- **Hill Country**: Year-round (mornings are best)

---

*Ready to explore Sri Lanka? Contact Recharge Travels for personalized tour packages tailored to your interests.*`,

        tour: `## 7-Day Cultural Heritage Tour of Sri Lanka

**Experience the Soul of Sri Lanka**

Embark on an enchanting journey through Sri Lanka's most treasured cultural sites. This carefully curated 7-day tour takes you from ancient kingdoms to colonial heritage, revealing the rich tapestry of Sri Lankan civilization.

### Tour Highlights ✨

🏛️ Explore UNESCO World Heritage Sites
🐘 Witness elephants at Pinnawala Sanctuary
🌿 Walk through lush tea plantations
🏔️ Conquer the iconic Sigiriya Rock Fortress
🙏 Experience sacred Kandy Temple ceremonies

### Itinerary Overview

**Day 1-2**: Colombo → Negombo → Anuradhapura
**Day 3-4**: Sigiriya → Polonnaruwa → Dambulla
**Day 5-6**: Kandy → Nuwara Eliya
**Day 7**: Hill Country → Colombo

### What's Included

✅ All accommodation (4-5 star hotels)
✅ Private air-conditioned transport
✅ English-speaking guide
✅ Daily breakfast & dinner
✅ All entrance fees
✅ Airport transfers

### Price: From $899 per person

*Book now and receive a complimentary spa experience!*`,

        seo: `## SEO Optimization Package

### Meta Title (58 characters)
Sri Lanka Tours & Holidays 2024 | Luxury Travel | Book Now

### Meta Description (153 characters)
Discover Sri Lanka with expert-guided tours. Safari adventures, beach escapes & cultural journeys. Best prices guaranteed. Free cancellation. Book today!

### Primary Keywords
1. Sri Lanka tours
2. Sri Lanka holiday packages
3. Sri Lanka travel agency
4. Best Sri Lanka tours
5. Sri Lanka safari tours

### Secondary Keywords
6. Luxury Sri Lanka holidays
7. Sri Lanka beach resorts
8. Cultural tours Sri Lanka
9. Sri Lanka honeymoon packages
10. Cheap Sri Lanka tours

### Heading Structure
**H1**: Unforgettable Sri Lanka Tours & Holiday Packages
**H2**: Popular Tour Categories
**H2**: Why Choose Recharge Travels
**H2**: Customer Reviews
**H3**: Wildlife Safari Tours
**H3**: Beach Holiday Packages
**H3**: Cultural Heritage Tours`,

        social: `## Instagram Post 📸

🌴 Paradise found in Sri Lanka! 🇱🇰

Imagine waking up to this view every morning... Azure waters, golden sands, and endless adventures waiting for you.

From ancient temples to pristine beaches, Sri Lanka offers it all! ✨

📍 Mirissa Beach
🏷️ Tag someone who needs this vacation!

#SriLanka #TravelSriLanka #BeachLife #TravelGoals #Wanderlust #Paradise #IslandLife #TravelPhotography #RechargeYourSoul #VisitSriLanka

---

## Twitter Thread 🐦

🧵 Why Sri Lanka should be your next destination (A Thread)

1/ 🐘 Home to the highest density of elephants in Asia. You can see them roaming freely in national parks!

2/ 🐳 One of the best places in the world to spot blue whales - the largest animals on Earth!

3/ 🏛️ 8 UNESCO World Heritage Sites packed into one small island

4/ 🍵 The world's finest Ceylon tea, fresh from misty mountain plantations

5/ 🌊 Incredible surf spots for beginners and pros alike

Ready to explore? DM us for custom tour packages! 🌴

---

## Facebook Post 📘

🌟 SPECIAL OFFER: 20% OFF All Sri Lanka Tours!

Planning your 2024 adventure? Now's the perfect time! 

✈️ 7-Day Cultural Tour: $799 (was $999)
🏖️ Beach & Safari Combo: $899 (was $1,125)
🐘 Wildlife Explorer: $699 (was $875)

Limited time only! Message us to book.
🔗 www.rechargetravels.com`,

        email: `Subject: Your Sri Lanka Adventure Awaits, {{name}}! 🌴

Preheader: Exclusive deals on handcrafted tours - Save up to 30%!

---

Dear {{name}},

We hope this email finds you dreaming of your next adventure! At Recharge Travels, we believe that travel isn't just about destinations—it's about creating memories that last a lifetime.

**Your Personalized Sri Lanka Journey**

Based on your interests, we've curated these experiences just for you:

🐘 **Wildlife Safari Adventure** (5 Days)
Encounter elephants, leopards & sloth bears
*From $599* | Save 25%

🏛️ **Cultural Heritage Trail** (7 Days)
Explore 8 UNESCO World Heritage Sites
*From $799* | Save 30%

🌊 **Beach & Wellness Retreat** (6 Days)
Relax, rejuvenate, and reconnect
*From $699* | Save 20%

**Why Book With Us?**
✓ 24/7 Support during your trip
✓ Handpicked local guides
✓ Flexible cancellation policy
✓ Best price guarantee

[BOOK YOUR ADVENTURE →]

Questions? Reply to this email or WhatsApp us at +94 77 340 1305.

Warm regards,
The Recharge Travels Team

---
Unsubscribe | Update Preferences`,

        description: `**Sigiriya Rock Fortress - The Eighth Wonder of the World**

Rising majestically from the central plains of Sri Lanka, Sigiriya stands as a testament to ancient ingenuity and artistic brilliance. This 5th-century rock fortress, perched atop a 200-meter volcanic plug, offers visitors a journey through time.

Marvel at the world-famous Sigiriya Frescoes—sensuous paintings of celestial maidens that have endured for over 1,500 years. Pass through the iconic Lion's Gate, where massive paws carved in stone once supported a colossal lion figure.

At the summit, discover the remains of a royal palace with sophisticated water gardens, pools, and fountains that still function today. The panoramic views of the surrounding jungle and distant mountains create an unforgettable finale to your climb.

*Best visited at sunrise for cooler temperatures and magical lighting.*`,
      };

      const generatedContent = mockResponses[contentType];

      const newResult: GenerationResult = {
        content: generatedContent,
        provider: selectedProvider,
        timestamp: new Date(),
      };

      setResult(newResult);
      setHistory(prev => [newResult, ...prev.slice(0, 9)]);

    } catch (error) {
      console.error('AI generation error:', error);
      alert('Failed to generate content. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async () => {
    if (!result) return;
    await navigator.clipboard.writeText(result.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
            <Brain className="w-7 h-7 text-purple-600" />
            AI Content Hub
          </h1>
          <p className="text-gray-500">Generate content with AI - powered by Gemini, ChatGPT & Perplexity</p>
        </div>
      </div>

      {/* Provider Selection */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h3 className="font-semibold text-gray-900 mb-4">Select AI Provider</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {providers.map((provider) => (
            <button
              key={provider.id}
              onClick={() => setSelectedProvider(provider.id)}
              className={`p-4 rounded-xl border-2 transition-all ${
                selectedProvider === provider.id
                  ? 'border-purple-500 bg-purple-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">{provider.icon}</span>
                <div className="text-left">
                  <p className="font-medium text-gray-900">{provider.name}</p>
                  <p className="text-xs text-gray-500">Click to select</p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Content Type & Settings */}
        <div className="lg:col-span-1 space-y-6">
          {/* Content Type */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Content Type</h3>
            <div className="space-y-2">
              {contentTypes.map((type) => (
                <button
                  key={type.id}
                  onClick={() => setContentType(type.id)}
                  className={`w-full p-3 rounded-xl flex items-center gap-3 transition-all ${
                    contentType === type.id
                      ? 'bg-purple-50 border-2 border-purple-500'
                      : 'bg-gray-50 hover:bg-gray-100 border-2 border-transparent'
                  }`}
                >
                  <type.icon className={`w-5 h-5 ${contentType === type.id ? 'text-purple-600' : 'text-gray-400'}`} />
                  <div className="text-left">
                    <p className="font-medium text-gray-900">{type.name}</p>
                    <p className="text-xs text-gray-500">{type.description}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Tone Selection */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Tone & Style</h3>
            <select
              value={tone}
              onChange={(e) => setTone(e.target.value)}
              className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              {tones.map((t) => (
                <option key={t.id} value={t.id}>{t.name}</option>
              ))}
            </select>
          </div>

          {/* Quick Prompts */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Quick Prompts</h3>
            <div className="space-y-2">
              {quickPrompts[contentType]?.map((qp, idx) => (
                <button
                  key={idx}
                  onClick={() => setPrompt(qp)}
                  className="w-full p-3 rounded-lg bg-gray-50 text-left text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                >
                  {qp}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="lg:col-span-2 space-y-6">
          {/* Input Area */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Generate Content</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Topic or Prompt
                </label>
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Describe what you want to generate..."
                  className="w-full p-4 rounded-xl border border-gray-200 focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                  rows={4}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Keywords (optional)
                </label>
                <input
                  type="text"
                  value={keywords}
                  onChange={(e) => setKeywords(e.target.value)}
                  placeholder="e.g., Sri Lanka, luxury, safari, beach"
                  className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>

              <button
                onClick={generateContent}
                disabled={loading || (!prompt && !topic)}
                className="w-full py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Generating with {providers.find(p => p.id === selectedProvider)?.name}...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    Generate Content
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Result Area */}
          {result && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900">Generated Content</h3>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-500">
                    {providers.find(p => p.id === result.provider)?.icon} {providers.find(p => p.id === result.provider)?.name}
                  </span>
                  <button
                    onClick={copyToClipboard}
                    className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
                  >
                    {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4 text-gray-600" />}
                  </button>
                  <button
                    onClick={generateContent}
                    className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
                  >
                    <RefreshCw className="w-4 h-4 text-gray-600" />
                  </button>
                </div>
              </div>
              
              <div className="prose prose-sm max-w-none bg-gray-50 rounded-xl p-4 max-h-[500px] overflow-y-auto">
                <pre className="whitespace-pre-wrap font-sans text-gray-700">
                  {result.content}
                </pre>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AIContentHub;
