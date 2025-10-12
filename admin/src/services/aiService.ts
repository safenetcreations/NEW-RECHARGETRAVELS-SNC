import { getAI, getGenerativeModel, GoogleAIBackend } from 'firebase/ai';
import { app } from './firebaseService'; // Import the app instance

// Initialize the Gemini Developer API backend service
// Make sure to enable the "Vertex AI API" in your Google Cloud project
// and link your Firebase project to a billing account.
const ai = getAI(app, { backend: new GoogleAIBackend() });

// Create a `GenerativeModel` instance
const model = getGenerativeModel(ai, { model: "gemini-1.5-flash" });

export const aiService = {
  generateContent: async (prompt: string) => {
    try {
      const result = await model.generateContent(prompt);
      // The response is complex, we need to extract the text.
      // This part might need adjustment based on the actual response structure.
      // The `response` object has a `text()` method to get the text.
      const response = await result.response;
      const text = response.text();
      return text;
    } catch (error) {
      console.error('Error generating content with AI:', error);
      throw new Error('Failed to generate content.');
    }
  }
};
