
import { useState } from 'react';

interface POIFeature {
  type: string;
  properties: {
    name: string;
    [key: string]: any;
  };
  geometry: {
    type: string;
    coordinates: [number, number];
  };
}

const YOUTUBE_API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY || "";

export const useContentFetching = (geminiApiKey: string | null) => {
  const [geminiContent, setGeminiContent] = useState('✨ Generating insights...');
  const [wikipediaContent, setWikipediaContent] = useState('Loading history from Wikipedia...');
  const [youtubeContent, setYoutubeContent] = useState<any[]>([]);
  const [itineraryContent, setItineraryContent] = useState('Generating your travel plan...');

  const fetchGeminiInsights = async (poiName: string) => {
    if (!geminiApiKey) {
      setGeminiContent('To enable AI-powered insights, please add your Gemini API key to Supabase secrets.');
      return;
    }

    setGeminiContent('✨ Generating insights...');
    
    const prompt = `You are a knowledgeable and enthusiastic local tour guide in Sri Lanka. Provide a short, engaging summary (about 3-4 sentences) for a tourist visiting "${poiName}". Highlight what makes this place unique and a must-see. Do not use markdown.`;
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${geminiApiKey}`;
    const payload = { contents: [{ parts: [{ text: prompt }] }] };

    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      
      if (!response.ok) throw new Error(`API Error: ${response.status}`);
      
      const result = await response.json();
      const text = result.candidates[0].content.parts[0].text;
      setGeminiContent(text);
    } catch (error) {
      console.error("Gemini API Error:", error);
      setGeminiContent("Could not generate AI insights at this time. Please check the console for details.");
    }
  };

  const fetchWikipediaSummary = async (poiName: string) => {
    setWikipediaContent('Loading history...');
    
    try {
      const endpoint = `https://en.wikipedia.org/w/api.php?action=query&prop=extracts&exintro&explaintext&format=json&origin=*&titles=${encodeURIComponent(poiName)}`;
      const response = await fetch(endpoint);
      const data = await response.json();
      const pages = data.query.pages;
      const pageId = Object.keys(pages)[0];
      const extract = pages[pageId].extract;
      setWikipediaContent(extract || 'No summary found on Wikipedia for this location.');
    } catch (error) {
      setWikipediaContent('Could not fetch history from Wikipedia.');
    }
  };

  const fetchYouTubeVideos = async (poi: POIFeature) => {
    if (!YOUTUBE_API_KEY) {
      setYoutubeContent([]);
      return;
    }

    const [lng, lat] = poi.geometry.coordinates;
    const query = encodeURIComponent(poi.properties.name);
    const endpoint = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${query}&type=video&order=date&location=${lat},${lng}&locationRadius=20km&maxResults=6&key=${YOUTUBE_API_KEY}`;
    
    try {
      const response = await fetch(endpoint);
      const data = await response.json();
      setYoutubeContent(data.items || []);
    } catch (error) {
      setYoutubeContent([]);
    }
  };

  const generateItinerary = async (visiblePois: string[]) => {
    setItineraryContent('✨ Planning your day...');

    if (!geminiApiKey) {
      setItineraryContent('To enable the AI Itinerary Planner, please add your Gemini API key to Supabase secrets.');
      return;
    }

    if (visiblePois.length < 2) {
      setItineraryContent('Please select at least two categories of places using the filters at the top to generate an itinerary.');
      return;
    }

    const prompt = `You are an expert travel planner for Sri Lanka. Create a logical and efficient one-day itinerary that includes the following locations: ${visiblePois.join(', ')}. For each stop, provide a brief, engaging description (1-2 sentences) and suggest an ideal time to visit (e.g., "Morning," "Afternoon," "Evening"). Format the entire response as a list using markdown, with each location as a bolded heading.`;
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${geminiApiKey}`;
    const payload = { contents: [{ parts: [{ text: prompt }] }] };

    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      
      if (!response.ok) throw new Error(`API Error: ${response.status}`);
      
      const result = await response.json();
      let text = result.candidates[0].content.parts[0].text;
      
      text = text
        .replace(/\*\*(.*?)\*\*/g, '<h3>$1</h3>')
        .replace(/\*/g, '')
        .replace(/\n/g, '<br>');

      setItineraryContent(text);
    } catch (error) {
      console.error("Gemini Itinerary Error:", error);
      setItineraryContent("Could not generate an itinerary at this time. Please check the console for details.");
    }
  };

  return {
    geminiContent,
    wikipediaContent,
    youtubeContent,
    itineraryContent,
    fetchGeminiInsights,
    fetchWikipediaSummary,
    fetchYouTubeVideos,
    generateItinerary
  };
};
