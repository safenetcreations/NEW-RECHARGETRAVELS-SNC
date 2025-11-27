// Minimal Gemini image service stub for the admin panel
// Returns a placeholder image so builds succeed without real AI wiring.

interface GenerateImageOptions {
  prompt: string;
  style: string;
  size: string;
}

export const geminiService = {
  async generateImage({ prompt }: GenerateImageOptions) {
    return {
      imageUrl:
        'https://via.placeholder.com/1024x640.png?text=AI+Image+Preview',
      altText: prompt || 'AI generated travel image placeholder',
    } as const;
  },
};

export default geminiService;
