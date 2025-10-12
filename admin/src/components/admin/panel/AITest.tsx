import React, { useState, useEffect } from 'react';
import { aiService } from '@/services/aiService';
import { toast } from 'sonner';

const AITest: React.FC = () => {
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const testAI = async () => {
      setLoading(true);
      toast.info('Testing AI content generation...');

      const prompt = `
        Generate content for a featured destination based on the following topic: "A luxury beach resort in the Maldives".
        The response should be a JSON object with the following structure:
        {
          "name": "Name of the destination",
          "category": "Beach",
          "price": 1200,
          "title": "A catchy title for the destination",
          "description": "A detailed description of the destination (2-3 sentences).",
          "duration": "e.g., '4-5 Days'",
          "rating": 4.9,
          "features": ["Private beach", "Overwater villas", "Spa"],
          "image": "A placeholder image URL from unsplash.com"
        }
        Only return the JSON object, with no other text or markdown.
      `;

      try {
        const responseText = await aiService.generateContent(prompt);
        setResult(responseText);
        toast.success('AI content generation test successful!');
      } catch (error) {
        console.error(error);
        setResult(`Error: ${error.message}`);
        toast.error('AI content generation test failed.');
      } finally {
        setLoading(false);
      }
    };

    testAI();
  }, []);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">AI Generation Test</h2>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <pre className="p-4 bg-gray-100 rounded">{result}</pre>
      )}
    </div>
  );
};

export default AITest;
