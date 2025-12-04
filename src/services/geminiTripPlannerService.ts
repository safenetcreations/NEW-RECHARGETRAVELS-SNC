// Gemini AI Trip Planner Service
// Uses Google's Gemini AI to generate personalized Sri Lanka itineraries

import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { generateAIItinerary } from './aiTripPlannerService';

export interface TripPreferences {
  startDate: Date | null;
  endDate: Date | null;
  travelers: {
    adults: number;
    children: number;
  };
  interests: string[];
  budget: 'budget' | 'mid-range' | 'luxury' | 'ultra-luxury';
  pace: 'relaxed' | 'moderate' | 'active';
  specialRequests?: string;
}

export interface DayActivity {
  time: string;
  activity: string;
  description: string;
  duration: string;
  cost: number;
  tips?: string[];
}

export interface DayItinerary {
  day: number;
  date: string;
  location: string;
  description: string;
  activities: DayActivity[];
  accommodation: {
    name: string;
    type: string;
    rating: number;
    price: number;
    amenities: string[];
  };
  meals: {
    breakfast: string;
    lunch: string;
    dinner: string;
  };
  transport: string;
  weatherTip: string;
}

export interface GeneratedItinerary {
  title: string;
  summary: string;
  duration: number;
  highlights: string[];
  bestTimeToVisit: string;
  packingTips: string[];
  days: DayItinerary[];
  totalCost: {
    accommodation: number;
    activities: number;
    transport: number;
    meals: number;
    total: number;
    perPerson: number;
  };
  aiInsights: string[];
}

// Gemini API key - can be overridden from Firebase settings
const GEMINI_API_KEY = 'AIzaSyBMXM3xNrL8zKu1fi1dbdj0VbkJK2MRxgM';

// Get Gemini API key from Firebase settings or use default
export const getGeminiApiKey = async (): Promise<string | null> => {
  try {
    const settingsDoc = await getDoc(doc(db, 'settings', 'ai_config'));
    if (settingsDoc.exists()) {
      const data = settingsDoc.data();
      if (data?.gemini_api_key) {
        return data.gemini_api_key;
      }
    }
    // Use default API key if not configured in Firebase
    return GEMINI_API_KEY;
  } catch (error) {
    console.error('Error fetching Gemini API key:', error);
    // Return default key on error
    return GEMINI_API_KEY;
  }
};

// Get OpenAI API key from Firebase settings
export const getOpenAIApiKey = async (): Promise<string | null> => {
  try {
    const settingsDoc = await getDoc(doc(db, 'settings', 'ai_config'));
    if (settingsDoc.exists()) {
      const data = settingsDoc.data();
      if (data?.openai_api_key) {
        return data.openai_api_key;
      }
    }
    return null;
  } catch (error) {
    console.error('Error fetching OpenAI API key:', error);
    return null;
  }
};

// Sri Lanka travel knowledge base for context
const SRI_LANKA_CONTEXT = `
You are an expert Sri Lanka travel planner with deep knowledge of:

DESTINATIONS:
- Cultural Triangle: Sigiriya (Lion Rock), Polonnaruwa, Anuradhapura, Dambulla Cave Temple
- Hill Country: Kandy (Temple of Tooth), Nuwara Eliya (Little England), Ella (Nine Arch Bridge, Little Adam's Peak), Haputale
- Beaches: Mirissa (whale watching), Unawatuna, Bentota, Arugam Bay (surfing), Trincomalee, Tangalle
- Wildlife: Yala (leopards), Udawalawe (elephants), Minneriya (elephant gathering), Wilpattu, Sinharaja Rainforest
- Adventure: Kitulgala (white water rafting), Adam's Peak pilgrimage, Knuckles Range trekking

BEST TIMES:
- West/South Coast & Hill Country: December to March
- East Coast: April to September
- Cultural Triangle: Year-round, best January to April
- Whale Watching Mirissa: November to April
- Elephant Gathering Minneriya: July to October

TRANSPORT:
- Scenic train rides: Kandy-Ella (most scenic), Colombo-Galle (coastal)
- Private driver: Most flexible, $50-80/day
- Tuk-tuks: Great for short distances
- Domestic flights: Colombo to Jaffna, Trincomalee

ACCOMMODATION TYPES:
- Budget: $20-50/night (guesthouses, hostels)
- Mid-range: $50-150/night (boutique hotels, Airbnb)
- Luxury: $150-400/night (heritage hotels, resorts)
- Ultra-luxury: $400+/night (Aman, Cape Weligama, Wild Coast Tented Lodge)

LOCAL TIPS:
- Dress modestly at temples (cover shoulders and knees)
- Remove shoes before entering temples
- Best curry: rice and curry for lunch
- Coconut sambol, hoppers, kottu roti are must-try foods
- Tipping: 10% at restaurants
- Currency: Sri Lankan Rupee (LKR)
`;

// Generate itinerary using Gemini AI
export const generateGeminiItinerary = async (
  preferences: TripPreferences
): Promise<GeneratedItinerary> => {
  const apiKey = await getGeminiApiKey();

  if (!apiKey) {
    console.warn('No Gemini API key found, using fallback generation');
    return generateFallbackItinerary(preferences);
  }

  const { startDate, endDate, travelers, interests, budget, pace, specialRequests } = preferences;

  // Calculate duration
  const start = startDate || new Date();
  const end = endDate || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  const duration = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));

  const prompt = `
${SRI_LANKA_CONTEXT}

Create a detailed ${duration}-day Sri Lanka itinerary with these preferences:

TRIP DETAILS:
- Duration: ${duration} days
- Start Date: ${start.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
- Travelers: ${travelers.adults} adults${travelers.children > 0 ? `, ${travelers.children} children` : ''}
- Budget Level: ${budget}
- Pace: ${pace}
- Interests: ${interests.length > 0 ? interests.join(', ') : 'general sightseeing'}
${specialRequests ? `- Special Requests: ${specialRequests}` : ''}

Generate a JSON response with this exact structure:
{
  "title": "Catchy trip title",
  "summary": "2-3 sentence trip overview",
  "highlights": ["highlight1", "highlight2", "highlight3", "highlight4", "highlight5"],
  "bestTimeToVisit": "Best months for this itinerary",
  "packingTips": ["tip1", "tip2", "tip3"],
  "days": [
    {
      "day": 1,
      "date": "${start.toLocaleDateString()}",
      "location": "City/Area name",
      "description": "Day overview",
      "activities": [
        {
          "time": "09:00 AM",
          "activity": "Activity name",
          "description": "What you'll do",
          "duration": "2 hours",
          "cost": 30,
          "tips": ["tip1"]
        }
      ],
      "accommodation": {
        "name": "Hotel name",
        "type": "Hotel type",
        "rating": 4,
        "price": 80,
        "amenities": ["Pool", "Wifi", "Breakfast"]
      },
      "meals": {
        "breakfast": "Included at hotel",
        "lunch": "Local restaurant recommendation",
        "dinner": "Restaurant recommendation"
      },
      "transport": "How to get around",
      "weatherTip": "Weather advice for this location"
    }
  ],
  "totalCost": {
    "accommodation": 0,
    "activities": 0,
    "transport": 0,
    "meals": 0,
    "total": 0,
    "perPerson": 0
  },
  "aiInsights": ["insight1", "insight2", "insight3"]
}

IMPORTANT:
- Include realistic Sri Lankan hotel names and restaurants
- Calculate accurate costs in USD based on budget level
- Make the itinerary flow logically (minimize backtracking)
- Include the famous Kandy-Ella train if hill country is included
- Add cultural tips and local experiences
- Consider travel times between destinations
- For ${pace} pace, ${pace === 'relaxed' ? 'include rest time and fewer activities' : pace === 'active' ? 'maximize activities and experiences' : 'balance activities with downtime'}

Return ONLY valid JSON, no additional text.
`;

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: prompt,
                },
              ],
            },
          ],
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 8192,
          },
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.status}`);
    }

    const data = await response.json();
    const textContent = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!textContent) {
      throw new Error('No content in Gemini response');
    }

    // Extract JSON from response (handle markdown code blocks)
    let jsonStr = textContent;
    if (textContent.includes('```json')) {
      jsonStr = textContent.split('```json')[1].split('```')[0].trim();
    } else if (textContent.includes('```')) {
      jsonStr = textContent.split('```')[1].split('```')[0].trim();
    }

    const itinerary = JSON.parse(jsonStr) as GeneratedItinerary;

    // Ensure duration is set
    itinerary.duration = duration;

    // Calculate totals if not provided
    if (!itinerary.totalCost.total) {
      const totalPeople = travelers.adults + travelers.children * 0.5;
      itinerary.totalCost.accommodation = itinerary.days.reduce((sum, day) => sum + (day.accommodation?.price || 0), 0);
      itinerary.totalCost.activities = itinerary.days.reduce((sum, day) =>
        sum + day.activities.reduce((actSum, act) => actSum + (act.cost || 0), 0), 0) * totalPeople;
      itinerary.totalCost.transport = duration * 50;
      itinerary.totalCost.meals = duration * (budget === 'budget' ? 20 : budget === 'mid-range' ? 40 : budget === 'luxury' ? 80 : 120) * totalPeople;
      itinerary.totalCost.total = itinerary.totalCost.accommodation + itinerary.totalCost.activities + itinerary.totalCost.transport + itinerary.totalCost.meals;
      itinerary.totalCost.perPerson = Math.round(itinerary.totalCost.total / totalPeople);
    }

    return itinerary;
  } catch (error) {
    console.error('Gemini API error:', error);
    // Try OpenAI as backup
    console.log('Attempting OpenAI backup...');
    return generateOpenAIItinerary(preferences);
  }
};

// Generate itinerary using OpenAI ChatGPT as backup
const generateOpenAIItinerary = async (
  preferences: TripPreferences
): Promise<GeneratedItinerary> => {
  const apiKey = await getOpenAIApiKey();

  if (!apiKey) {
    console.warn('No OpenAI API key found, using fallback generation');
    return generateFallbackItinerary(preferences);
  }

  const { startDate, endDate, travelers, interests, budget, pace, specialRequests } = preferences;

  // Calculate duration
  const start = startDate || new Date();
  const end = endDate || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  const duration = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));

  const prompt = `
${SRI_LANKA_CONTEXT}

Create a detailed ${duration}-day Sri Lanka itinerary with these preferences:

TRIP DETAILS:
- Duration: ${duration} days
- Start Date: ${start.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
- Travelers: ${travelers.adults} adults${travelers.children > 0 ? `, ${travelers.children} children` : ''}
- Budget Level: ${budget}
- Pace: ${pace}
- Interests: ${interests.length > 0 ? interests.join(', ') : 'general sightseeing'}
${specialRequests ? `- Special Requests: ${specialRequests}` : ''}

Generate a JSON response with this exact structure:
{
  "title": "Catchy trip title",
  "summary": "2-3 sentence trip overview",
  "highlights": ["highlight1", "highlight2", "highlight3", "highlight4", "highlight5"],
  "bestTimeToVisit": "Best months for this itinerary",
  "packingTips": ["tip1", "tip2", "tip3"],
  "days": [
    {
      "day": 1,
      "date": "${start.toLocaleDateString()}",
      "location": "City/Area name",
      "description": "Day overview",
      "activities": [
        {
          "time": "09:00 AM",
          "activity": "Activity name",
          "description": "What you'll do",
          "duration": "2 hours",
          "cost": 30,
          "tips": ["tip1"]
        }
      ],
      "accommodation": {
        "name": "Hotel name",
        "type": "Hotel type",
        "rating": 4,
        "price": 80,
        "amenities": ["Pool", "Wifi", "Breakfast"]
      },
      "meals": {
        "breakfast": "Included at hotel",
        "lunch": "Local restaurant recommendation",
        "dinner": "Restaurant recommendation"
      },
      "transport": "How to get around",
      "weatherTip": "Weather advice for this location"
    }
  ],
  "totalCost": {
    "accommodation": 0,
    "activities": 0,
    "transport": 0,
    "meals": 0,
    "total": 0,
    "perPerson": 0
  },
  "aiInsights": ["insight1", "insight2", "insight3"]
}

IMPORTANT:
- Include realistic Sri Lankan hotel names and restaurants
- Calculate accurate costs in USD based on budget level
- Make the itinerary flow logically (minimize backtracking)
- Include the famous Kandy-Ella train if hill country is included
- Add cultural tips and local experiences
- Consider travel times between destinations
- For ${pace} pace, ${pace === 'relaxed' ? 'include rest time and fewer activities' : pace === 'active' ? 'maximize activities and experiences' : 'balance activities with downtime'}

Return ONLY valid JSON, no additional text.
`;

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'You are an expert Sri Lanka travel planner. Always respond with valid JSON only.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: 0.7,
        max_tokens: 4096,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    const textContent = data.choices?.[0]?.message?.content;

    if (!textContent) {
      throw new Error('No content in OpenAI response');
    }

    // Extract JSON from response (handle markdown code blocks)
    let jsonStr = textContent;
    if (textContent.includes('```json')) {
      jsonStr = textContent.split('```json')[1].split('```')[0].trim();
    } else if (textContent.includes('```')) {
      jsonStr = textContent.split('```')[1].split('```')[0].trim();
    }

    const itinerary = JSON.parse(jsonStr) as GeneratedItinerary;

    // Ensure duration is set
    itinerary.duration = duration;

    // Calculate totals if not provided
    if (!itinerary.totalCost.total) {
      const totalPeople = travelers.adults + travelers.children * 0.5;
      itinerary.totalCost.accommodation = itinerary.days.reduce((sum, day) => sum + (day.accommodation?.price || 0), 0);
      itinerary.totalCost.activities = itinerary.days.reduce((sum, day) =>
        sum + day.activities.reduce((actSum, act) => actSum + (act.cost || 0), 0), 0) * totalPeople;
      itinerary.totalCost.transport = duration * 50;
      itinerary.totalCost.meals = duration * (budget === 'budget' ? 20 : budget === 'mid-range' ? 40 : budget === 'luxury' ? 80 : 120) * totalPeople;
      itinerary.totalCost.total = itinerary.totalCost.accommodation + itinerary.totalCost.activities + itinerary.totalCost.transport + itinerary.totalCost.meals;
      itinerary.totalCost.perPerson = Math.round(itinerary.totalCost.total / totalPeople);
    }

    return itinerary;
  } catch (error) {
    console.error('OpenAI API error:', error);
    return generateFallbackItinerary(preferences);
  }
};

// Fallback itinerary generator (when API key is not available)
const generateFallbackItinerary = async (preferences: TripPreferences): Promise<GeneratedItinerary> => {
  const fallback = await generateAIItinerary(preferences);

  // Convert to new format
  return {
    ...fallback,
    bestTimeToVisit: 'December to March for west coast, April to September for east coast',
    packingTips: ['Light cotton clothes', 'Comfortable walking shoes', 'Sunscreen and hat', 'Modest clothing for temples'],
    days: fallback.days.map(day => ({
      ...day,
      description: `Explore the wonders of ${day.location}`,
      accommodation: {
        ...day.accommodation,
        amenities: ['WiFi', 'Air Conditioning', 'Breakfast Included'],
      },
      meals: {
        breakfast: day.meals[0] || 'Included at hotel',
        lunch: day.meals[1] || 'Local restaurant',
        dinner: day.meals[2] || 'Hotel restaurant',
      },
      transport: 'Private vehicle with driver',
      weatherTip: 'Check local weather before heading out',
    })),
    totalCost: {
      ...fallback.totalCost,
      perPerson: Math.round(fallback.totalCost.total / (preferences.travelers.adults + preferences.travelers.children * 0.5)),
    },
    aiInsights: [
      'Book accommodations in advance during peak season',
      'Carry cash for smaller establishments',
      'Respect local customs at religious sites',
    ],
  };
};

// Get best travel dates suggestions
export const getTravelDateSuggestions = (interests: string[]): { month: string; reason: string; rating: number }[] => {
  const suggestions: { month: string; reason: string; rating: number }[] = [];

  if (interests.includes('beach') || interests.includes('wildlife')) {
    suggestions.push(
      { month: 'December', reason: 'Perfect beach weather on west/south coast, start of whale watching season', rating: 5 },
      { month: 'January', reason: 'Peak season - great weather, ideal for Yala safari', rating: 5 },
      { month: 'February', reason: 'Excellent conditions, Perahera season in Kandy', rating: 5 },
      { month: 'March', reason: 'Last month of dry season on west coast', rating: 4 },
    );
  }

  if (interests.includes('cultural')) {
    suggestions.push(
      { month: 'January', reason: 'Thai Pongal festival, pleasant weather in Cultural Triangle', rating: 5 },
      { month: 'April', reason: 'Sinhala & Tamil New Year celebrations', rating: 5 },
      { month: 'July/August', reason: 'Kandy Esala Perahera - spectacular Buddhist festival', rating: 5 },
    );
  }

  if (interests.includes('nature') || interests.includes('train')) {
    suggestions.push(
      { month: 'January-March', reason: 'Best visibility in hill country, clear skies for train rides', rating: 5 },
      { month: 'July-September', reason: 'Elephant gathering at Minneriya - unique wildlife event', rating: 5 },
    );
  }

  if (interests.includes('adventure')) {
    suggestions.push(
      { month: 'December-April', reason: 'Ideal conditions for hiking Adam\'s Peak', rating: 5 },
      { month: 'May-September', reason: 'Best surfing in Arugam Bay', rating: 5 },
    );
  }

  // Default suggestions if no specific interests
  if (suggestions.length === 0) {
    suggestions.push(
      { month: 'January', reason: 'Peak season with best overall weather', rating: 5 },
      { month: 'February', reason: 'Great weather, fewer crowds than January', rating: 5 },
      { month: 'December', reason: 'Start of peak season, festive atmosphere', rating: 4 },
      { month: 'March', reason: 'Good weather, shoulder season pricing', rating: 4 },
    );
  }

  return suggestions.slice(0, 4);
};

// Sri Lanka public holidays and festivals
export const getSriLankaEvents = (year: number): { date: string; name: string; type: 'holiday' | 'festival' | 'event' }[] => {
  return [
    { date: `${year}-01-14`, name: 'Thai Pongal', type: 'festival' },
    { date: `${year}-01-15`, name: 'Duruthu Full Moon Poya', type: 'holiday' },
    { date: `${year}-02-04`, name: 'Independence Day', type: 'holiday' },
    { date: `${year}-04-13`, name: 'Sinhala & Tamil New Year Eve', type: 'festival' },
    { date: `${year}-04-14`, name: 'Sinhala & Tamil New Year', type: 'holiday' },
    { date: `${year}-05-01`, name: 'May Day', type: 'holiday' },
    { date: `${year}-05-23`, name: 'Vesak Full Moon Poya', type: 'holiday' },
    { date: `${year}-06-21`, name: 'Poson Full Moon Poya', type: 'holiday' },
    { date: `${year}-07-21`, name: 'Esala Full Moon Poya', type: 'holiday' },
    { date: `${year}-08-19`, name: 'Kandy Esala Perahera', type: 'festival' },
    { date: `${year}-11-14`, name: 'Deepavali', type: 'festival' },
    { date: `${year}-12-25`, name: 'Christmas Day', type: 'holiday' },
  ];
};
