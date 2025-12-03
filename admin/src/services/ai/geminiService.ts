/**
 * Gemini AI Service
 * Integration with Google's Gemini Pro for content generation
 * and Imagen 3 for image generation
 */

import { GoogleGenerativeAI } from '@google/generative-ai';
import type {
  AIService,
  AIProvider,
  ContentGenerationRequest,
  ContentGenerationResponse,
  SEOOptimizationRequest,
  SEOOptimizationResponse,
  ContentEnhancementRequest,
  ContentEnhancementResponse,
  ImageGenerationRequest,
  ImageGenerationResponse,
  ItineraryGenerationRequest,
  ItineraryGenerationResponse,
  FAQGenerationRequest,
  FAQGenerationResponse,
  ReviewResponseRequest,
  ReviewResponseResponse,
  DescriptionGenerationRequest,
  DescriptionGenerationResponse,
  ImageAnalysisRequest,
  ImageAnalysisResponse
} from './types';

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || '';

class GeminiService implements AIService {
  provider: AIProvider = 'gemini';
  private client: GoogleGenerativeAI | null = null;
  private model: any = null;
  private imageModel: any = null;

  constructor() {
    this.initializeClient();
  }

  private initializeClient(): void {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY || '';
    if (apiKey) {
      this.client = new GoogleGenerativeAI(apiKey);
      // Use gemini-1.5-pro-latest for best quality content generation
      this.model = this.client.getGenerativeModel({ model: 'gemini-1.5-pro-latest' });
      // Gemini 3 Pro Image Preview for high-quality image generation (Nano Banana Pro)
      this.imageModel = this.client.getGenerativeModel({
        model: 'gemini-2.0-flash-exp',
        generationConfig: {
          responseModalities: ['TEXT', 'IMAGE']
        } as any
      });
    }
  }

  private ensureInitialized(): void {
    // Re-initialize if needed
    if (!this.client || !this.model) {
      this.initializeClient();
    }
    if (!this.client || !this.model) {
      throw new Error('Gemini API key not configured. Please add VITE_GEMINI_API_KEY to your .env file.');
    }
  }

  async generateContent(request: ContentGenerationRequest): Promise<ContentGenerationResponse> {
    this.ensureInitialized();

    const prompt = this.buildContentPrompt(request);

    try {
      console.log('Starting Gemini content generation...');
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      console.log('Gemini response received, length:', text.length);

      return this.parseContentResponse(text, request);
    } catch (error: any) {
      console.error('Gemini content generation error:', error);
      // Provide more helpful error messages
      if (error.message?.includes('API key')) {
        throw new Error('Gemini API key is invalid or not configured. Please check your VITE_GEMINI_API_KEY in the .env file.');
      }
      if (error.message?.includes('quota') || error.message?.includes('rate')) {
        throw new Error('API rate limit exceeded. Please wait a moment and try again.');
      }
      if (error.message?.includes('blocked') || error.message?.includes('safety')) {
        throw new Error('Content was blocked by safety filters. Try rephrasing your topic.');
      }
      throw new Error(`Failed to generate content: ${error.message}`);
    }
  }

  private buildContentPrompt(request: ContentGenerationRequest): string {
    const {
      topic,
      contentType,
      tone,
      targetWordCount = 1500,
      keywords = [],
      category
    } = request;

    return `You are an expert SEO content writer and digital marketing specialist specializing in Sri Lanka tourism.

TASK: Generate a fully SEO-optimized ${contentType} article about: "${topic}"

REQUIREMENTS:
- Tone: ${tone}
- Target word count: ${targetWordCount} words
- Category: ${category || 'Travel'}
${keywords.length > 0 ? `- Primary keywords to include: ${keywords.join(', ')}` : ''}

SEO REQUIREMENTS (MANDATORY):
1. Title must include the primary keyword and be compelling (50-60 characters)
2. Meta description must be action-oriented with keyword (150-160 characters)
3. Content must have proper H2 and H3 heading structure
4. Include internal linking suggestions
5. Use keyword density of 1-2% naturally
6. Include LSI (Latent Semantic Indexing) keywords
7. Add schema markup suggestions for the content type
8. Include a compelling call-to-action (CTA)

CONTENT STRUCTURE:
- Eye-catching introduction with hook
- Clear H2 sections with descriptive headings
- Bullet points and numbered lists for readability
- Image alt text suggestions
- FAQ section with 3-5 common questions
- Strong conclusion with CTA

Your response MUST be in the following JSON format (no markdown code blocks, just valid JSON):
{
  "title": "SEO-optimized title with primary keyword (50-60 chars)",
  "content": "Full article in Markdown with ## H2 and ### H3 headings, bullet points, FAQs section, and CTA",
  "excerpt": "Compelling meta excerpt for social sharing (2-3 sentences)",
  "metaTitle": "SEO meta title with keyword | Brand (max 60 chars)",
  "metaDescription": "Action-oriented meta description with keyword and CTA (max 160 chars)",
  "keywords": ["primary keyword", "secondary keyword", "LSI keyword 1", "LSI keyword 2", "long-tail keyword"],
  "outline": ["Introduction", "H2 Section 1", "H2 Section 2", "H2 Section 3", "FAQs", "Conclusion"],
  "seoScore": 95,
  "schemaType": "Article or TravelBlog or FAQ",
  "suggestedInternalLinks": ["Related topic 1", "Related topic 2"],
  "imageAltSuggestions": ["Alt text 1", "Alt text 2", "Alt text 3"]
}

FOCUS ON:
- Google ranking factors and E-E-A-T principles
- User search intent satisfaction
- Mobile-friendly formatting
- Engaging, informative content about Sri Lanka
- Local SEO optimization for travel queries
- Featured snippet optimization`;
  }

  private parseContentResponse(text: string, request: ContentGenerationRequest): ContentGenerationResponse {
    try {
      // Clean up the response - remove any markdown code blocks
      const cleanText = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();

      const parsed = JSON.parse(cleanText);

      return {
        title: parsed.title || `${request.topic} - Travel Guide`,
        content: parsed.content || '',
        excerpt: parsed.excerpt || '',
        metaTitle: parsed.metaTitle || parsed.title?.slice(0, 60) || '',
        metaDescription: parsed.metaDescription || parsed.excerpt?.slice(0, 160) || '',
        keywords: parsed.keywords || [],
        outline: parsed.outline || [],
        readingTime: Math.ceil((parsed.content?.split(/\s+/).length || 0) / 200),
        provider: this.provider
      };
    } catch (e) {
      // If JSON parsing fails, treat as plain text
      console.warn('Failed to parse Gemini response as JSON, using raw text');
      const wordCount = text.split(/\s+/).length;

      return {
        title: `${request.topic} - Travel Guide`,
        content: text,
        excerpt: text.slice(0, 200) + '...',
        metaTitle: request.topic.slice(0, 60),
        metaDescription: text.slice(0, 160),
        keywords: request.keywords || [],
        readingTime: Math.ceil(wordCount / 200),
        provider: this.provider
      };
    }
  }

  async optimizeSEO(request: SEOOptimizationRequest): Promise<SEOOptimizationResponse> {
    this.ensureInitialized();

    const prompt = `Analyze this content for SEO and provide optimization suggestions:

Title: ${request.title}
Target Keywords: ${request.targetKeywords?.join(', ') || 'None specified'}

Content:
${request.content.slice(0, 3000)}

Respond in JSON format:
{
  "metaTitle": "Optimized meta title (max 60 chars)",
  "metaDescription": "Optimized meta description (max 160 chars)",
  "suggestedKeywords": ["keyword1", "keyword2", "keyword3", "keyword4", "keyword5"],
  "headingStructure": ["Suggested H2", "Suggested H3"],
  "seoScore": 85,
  "suggestions": ["Suggestion 1", "Suggestion 2", "Suggestion 3"]
}`;

    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      const cleanText = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      return JSON.parse(cleanText);
    } catch (error: any) {
      console.error('Gemini SEO optimization error:', error);
      throw new Error(`Failed to optimize SEO: ${error.message}`);
    }
  }

  async enhanceContent(request: ContentEnhancementRequest): Promise<ContentEnhancementResponse> {
    this.ensureInitialized();

    const actionPrompts: Record<string, string> = {
      rewrite: 'Rewrite this content to be more engaging while maintaining the same information',
      expand: `Expand this content to approximately ${request.targetLength || 2000} words with more detail`,
      summarize: 'Summarize this content concisely while keeping key points',
      improve: 'Improve the clarity, flow, and readability of this content'
    };

    const prompt = `${actionPrompts[request.action]}:

${request.content}

Respond in JSON format:
{
  "enhancedContent": "The improved content...",
  "changes": ["Change 1", "Change 2", "Change 3"]
}`;

    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      const cleanText = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      return JSON.parse(cleanText);
    } catch (error: any) {
      console.error('Gemini content enhancement error:', error);
      throw new Error(`Failed to enhance content: ${error.message}`);
    }
  }

  /**
   * Generate image using Google Imagen 3
   */
  async generateImage(request: ImageGenerationRequest): Promise<ImageGenerationResponse> {
    this.ensureInitialized();

    const stylePrompts: Record<string, string> = {
      realistic: 'photorealistic, high quality, detailed photography',
      artistic: 'artistic, creative, stylized illustration, digital art',
      minimalist: 'minimalist, clean, simple design, modern',
      vibrant: 'vibrant colors, dynamic, eye-catching, colorful'
    };

    const sizeConfig: Record<string, { width: number; height: number }> = {
      small: { width: 512, height: 512 },
      medium: { width: 1024, height: 1024 },
      large: { width: 1536, height: 1024 }
    };

    const style = stylePrompts[request.style || 'realistic'];
    const size = sizeConfig[request.size || 'medium'];

    // Enhanced prompt for travel photography
    const enhancedPrompt = `${request.prompt}, ${style}, professional travel photography, Sri Lanka, beautiful landscape, high resolution, stunning composition`;

    try {
      // Try Imagen 3 API first
      const result = await this.generateImageWithImagen(enhancedPrompt, size);
      return result;
    } catch (imagenError: any) {
      console.log('Imagen API not available, trying alternative method...');

      // Fallback: Generate image description for use with other services
      try {
        const descriptionResult = await this.generateImageDescription(request.prompt);
        return descriptionResult;
      } catch (fallbackError: any) {
        console.error('Image generation failed:', fallbackError);
        throw new Error(`Image generation failed: ${imagenError.message}`);
      }
    }
  }

  /**
   * Generate image with Gemini 2.0 Flash (Nano Banana Pro compatible)
   * Uses chat-based approach with responseModalities for image generation
   */
  private async generateImageWithImagen(
    prompt: string,
    size: { width: number; height: number }
  ): Promise<ImageGenerationResponse> {
    // Using the REST API for Gemini 2.0 Flash with image generation
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${GEMINI_API_KEY}`;

    // Enhance prompt with aspect ratio
    const aspectRatio = size.width > size.height ? '16:9' : size.width === size.height ? '1:1' : '9:16';
    const enhancedPrompt = `Generate a high-quality ${aspectRatio} image: ${prompt}`;

    console.log('Calling Gemini 2.0 Flash for image generation...');
    console.log('Prompt:', enhancedPrompt.substring(0, 80) + '...');

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              { text: enhancedPrompt }
            ]
          }
        ],
        generationConfig: {
          responseModalities: ['TEXT', 'IMAGE'],
          temperature: 1.0
        }
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('Gemini API error:', errorData);
      throw new Error(errorData.error?.message || `Gemini API error: ${response.status}`);
    }

    const data = await response.json();
    console.log('Gemini API response received');

    // Parse response - look for inline_data with image
    if (data.candidates && data.candidates.length > 0) {
      const candidate = data.candidates[0];
      if (candidate.content && candidate.content.parts) {
        for (const part of candidate.content.parts) {
          if (part.inlineData && part.inlineData.mimeType?.startsWith('image/')) {
            const imageUrl = `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
            console.log('Image found in response!');
            return {
              imageUrl,
              altText: prompt.slice(0, 100)
            };
          }
        }
      }
    }

    throw new Error('No image generated from Gemini');
  }

  /**
   * Fallback: Generate an optimized image description/prompt
   * This can be used with other image generation services
   */
  private async generateImageDescription(topic: string): Promise<ImageGenerationResponse> {
    const prompt = `Create a detailed image description for a travel blog featured image about: "${topic}"

The image should be suitable for a Sri Lanka travel website. Provide:
1. A detailed visual description
2. Suggested Unsplash search query

Respond in JSON:
{
  "description": "Detailed visual description...",
  "unsplashQuery": "search query for unsplash",
  "suggestedAltText": "Alt text for accessibility"
}`;

    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      const cleanText = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      const parsed = JSON.parse(cleanText);

      // Use Unsplash API to find a relevant image
      const unsplashUrl = `https://source.unsplash.com/1600x900/?${encodeURIComponent(parsed.unsplashQuery || topic + ' Sri Lanka travel')}`;

      return {
        imageUrl: unsplashUrl,
        altText: parsed.suggestedAltText || topic
      };
    } catch (error: any) {
      // Ultimate fallback - return a generic travel image
      const fallbackQuery = encodeURIComponent(`${topic} Sri Lanka travel landscape`);
      return {
        imageUrl: `https://source.unsplash.com/1600x900/?${fallbackQuery}`,
        altText: topic
      };
    }
  }

  /**
   * Generate image prompt suggestions
   */
  async generateImagePrompts(topic: string, count: number = 5): Promise<string[]> {
    this.ensureInitialized();

    const prompt = `Generate ${count} creative image prompts for a travel blog about: "${topic}"

Each prompt should be detailed and suitable for AI image generation, focusing on Sri Lanka travel photography.

Respond with a JSON array of prompts:
["prompt 1", "prompt 2", "prompt 3", "prompt 4", "prompt 5"]`;

    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      const cleanText = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      return JSON.parse(cleanText);
    } catch (error: any) {
      console.error('Error generating image prompts:', error);
      return [
        `Beautiful ${topic} in Sri Lanka, travel photography`,
        `Stunning landscape of ${topic}, vibrant colors`,
        `${topic} at golden hour, professional photography`
      ];
    }
  }

  /**
   * Generate a complete travel itinerary
   */
  async generateItinerary(request: ItineraryGenerationRequest): Promise<ItineraryGenerationResponse> {
    this.ensureInitialized();

    const styleDescriptions: Record<string, string> = {
      luxury: 'high-end accommodations, exclusive experiences, private transfers, fine dining',
      budget: 'affordable options, hostels, local transport, street food experiences',
      adventure: 'hiking, wildlife, outdoor activities, off-the-beaten-path locations',
      family: 'kid-friendly activities, comfortable accommodations, safe experiences, educational visits',
      honeymoon: 'romantic settings, private experiences, spa treatments, scenic destinations',
      cultural: 'temples, heritage sites, local traditions, authentic experiences'
    };

    const prompt = `You are an expert Sri Lanka travel planner. Create a detailed ${request.duration}-day itinerary for ${request.destination}.

Travel Style: ${request.travelStyle} (${styleDescriptions[request.travelStyle]})
${request.interests?.length ? `Interests: ${request.interests.join(', ')}` : ''}
${request.budget ? `Budget: ${request.budget.min}-${request.budget.max} ${request.budget.currency}` : ''}
Include Accommodation: ${request.includeAccommodation !== false}
Include Meals: ${request.includeMeals !== false}
Include Transport: ${request.includeTransport !== false}

Create a comprehensive, realistic itinerary with accurate Sri Lankan locations, distances, and timings.

Respond in JSON format:
{
  "title": "Engaging itinerary title",
  "overview": "2-3 sentence overview of the trip",
  "highlights": ["highlight1", "highlight2", "highlight3", "highlight4", "highlight5"],
  "days": [
    {
      "day": 1,
      "title": "Day title",
      "description": "Day overview",
      "activities": [
        {
          "time": "08:00 AM",
          "activity": "Activity name",
          "location": "Exact location in Sri Lanka",
          "duration": "2 hours",
          "tips": "Helpful tip"
        }
      ],
      "meals": {
        "breakfast": "Restaurant/location",
        "lunch": "Restaurant/location",
        "dinner": "Restaurant/location"
      },
      "accommodation": "Hotel name and location",
      "transportMode": "Private car / Train / etc"
    }
  ],
  "includedServices": ["service1", "service2"],
  "excludedServices": ["excluded1", "excluded2"],
  "packingList": ["item1", "item2", "item3"],
  "bestTimeToVisit": "Best months to visit",
  "estimatedCost": { "amount": 1500, "currency": "USD" },
  "tips": ["tip1", "tip2", "tip3"]
}`;

    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      const cleanText = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      return JSON.parse(cleanText);
    } catch (error: any) {
      console.error('Gemini itinerary generation error:', error);
      throw new Error(`Failed to generate itinerary: ${error.message}`);
    }
  }

  /**
   * Generate FAQs for a tour/destination/activity
   */
  async generateFAQs(request: FAQGenerationRequest): Promise<FAQGenerationResponse> {
    this.ensureInitialized();

    const prompt = `Generate ${request.count || 10} frequently asked questions and detailed answers about: "${request.topic}"

Context: ${request.context}
${request.targetAudience ? `Target Audience: ${request.targetAudience}` : ''}

Focus on practical, helpful questions that travelers actually ask about Sri Lanka tourism.

Categories to cover:
- Booking & Pricing
- What's Included
- Best Time to Visit
- What to Bring
- Safety & Health
- Accessibility
- Cancellation Policy

Respond in JSON format:
{
  "faqs": [
    {
      "question": "Detailed question?",
      "answer": "Comprehensive, helpful answer with specific information",
      "category": "Category name"
    }
  ]
}`;

    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      const cleanText = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      return JSON.parse(cleanText);
    } catch (error: any) {
      console.error('Gemini FAQ generation error:', error);
      throw new Error(`Failed to generate FAQs: ${error.message}`);
    }
  }

  /**
   * Generate a professional response to a customer review
   */
  async generateReviewResponse(request: ReviewResponseRequest): Promise<ReviewResponseResponse> {
    this.ensureInitialized();

    const toneGuides: Record<string, string> = {
      professional: 'formal, courteous, business-like',
      friendly: 'warm, personable, conversational',
      apologetic: 'sincere apology, empathetic, solution-focused'
    };

    const prompt = `Generate a thoughtful response to this customer review for a Sri Lanka travel company.

Review (${request.rating}/5 stars):
"${request.reviewText}"

${request.reviewerName ? `Reviewer: ${request.reviewerName}` : ''}
${request.businessName ? `Business: ${request.businessName}` : 'Business: Recharge Travels'}
Tone: ${request.tone || 'professional'} (${toneGuides[request.tone || 'professional']})

Guidelines:
- Thank the reviewer by name if provided
- Address specific points they mentioned
- For negative reviews: acknowledge concerns, apologize sincerely, offer solutions
- For positive reviews: express gratitude, highlight what made their experience special
- Keep response 2-4 sentences
- Sound genuine, not template-like

Respond in JSON format:
{
  "response": "The response text",
  "sentiment": "positive" | "neutral" | "negative",
  "keyPoints": ["key point addressed 1", "key point addressed 2"]
}`;

    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      const cleanText = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      return JSON.parse(cleanText);
    } catch (error: any) {
      console.error('Gemini review response error:', error);
      throw new Error(`Failed to generate review response: ${error.message}`);
    }
  }

  /**
   * Generate descriptions for destinations, tours, activities, etc.
   */
  async generateDescription(request: DescriptionGenerationRequest): Promise<DescriptionGenerationResponse> {
    this.ensureInitialized();

    const lengthGuides: Record<string, string> = {
      short: '50-100 words',
      medium: '150-250 words',
      long: '300-500 words'
    };

    const typePrompts: Record<string, string> = {
      destination: 'a travel destination in Sri Lanka',
      tour: 'a tour package',
      activity: 'a tourist activity or experience',
      hotel: 'a hotel or accommodation',
      experience: 'a unique travel experience'
    };

    const prompt = `Generate compelling descriptions for ${typePrompts[request.type]}: "${request.name}"

Details provided:
${JSON.stringify(request.details, null, 2)}

Requirements:
- Short description: ${lengthGuides.short} - punchy, engaging, perfect for cards
- Long description: ${lengthGuides[request.length || 'medium']} - detailed, informative, SEO-friendly
${request.includeHighlights ? '- Include 5-7 key highlights' : ''}
${request.includePracticalInfo ? '- Include practical information (duration, best time, difficulty, etc.)' : ''}

Write in an engaging, professional tone suitable for a premium travel website.

Respond in JSON format:
{
  "shortDescription": "Concise, engaging summary",
  "longDescription": "Detailed description with proper paragraphs",
  ${request.includeHighlights ? '"highlights": ["highlight1", "highlight2", "highlight3", "highlight4", "highlight5"],' : ''}
  ${request.includePracticalInfo ? '"practicalInfo": { "Duration": "value", "Best Time": "value", "Difficulty": "value" },' : ''}
  "tags": ["tag1", "tag2", "tag3", "tag4", "tag5"]
}`;

    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      const cleanText = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      return JSON.parse(cleanText);
    } catch (error: any) {
      console.error('Gemini description generation error:', error);
      throw new Error(`Failed to generate description: ${error.message}`);
    }
  }

  /**
   * Analyze an image for tags, content, quality, and SEO optimization
   */
  async analyzeImage(request: ImageAnalysisRequest): Promise<ImageAnalysisResponse> {
    this.ensureInitialized();

    // Use Gemini 1.5 Flash for image analysis (supports vision)
    const visionModel = this.client!.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const analysisTypes = request.analyzeFor.join(', ');

    const prompt = `Analyze this image for a Sri Lanka travel website. Provide analysis for: ${analysisTypes}

Requirements:
- Tags: Generate 10-15 relevant tags for categorization and search
- Location: If recognizable, identify the Sri Lankan location
- Quality: Rate image quality 1-100 (sharpness, composition, lighting)
- Content: Describe what's in the image
- SEO: Generate SEO-optimized alt text and caption

Respond in JSON format:
{
  "tags": ["tag1", "tag2", "tag3"],
  "suggestedLocation": "Location name if identifiable or null",
  "qualityScore": 85,
  "contentDescription": "Detailed description of what's in the image",
  "suggestedAltText": "SEO-friendly alt text (max 125 chars)",
  "suggestedCaption": "Engaging caption for social media or website",
  "isAppropriate": true
}`;

    try {
      // Fetch the image and convert to base64
      const imageResponse = await fetch(request.imageUrl);
      const imageBuffer = await imageResponse.arrayBuffer();
      const base64Image = btoa(
        new Uint8Array(imageBuffer).reduce((data, byte) => data + String.fromCharCode(byte), '')
      );

      const mimeType = imageResponse.headers.get('content-type') || 'image/jpeg';

      const result = await visionModel.generateContent([
        prompt,
        {
          inlineData: {
            mimeType,
            data: base64Image
          }
        }
      ]);

      const response = await result.response;
      const text = response.text();

      const cleanText = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      return JSON.parse(cleanText);
    } catch (error: any) {
      console.error('Gemini image analysis error:', error);
      // Return a basic response if vision fails
      return {
        tags: ['travel', 'sri-lanka', 'tourism'],
        contentDescription: 'Travel image',
        suggestedAltText: 'Sri Lanka travel destination',
        suggestedCaption: 'Discover the beauty of Sri Lanka',
        isAppropriate: true
      };
    }
  }

  /**
   * Generate SEO metadata for any content type
   */
  async generateSEOMetadata(content: {
    title: string;
    description: string;
    type: string;
    keywords?: string[];
  }): Promise<{
    metaTitle: string;
    metaDescription: string;
    keywords: string[];
    schema: Record<string, any>;
  }> {
    this.ensureInitialized();

    const prompt = `Generate SEO metadata for this Sri Lanka travel content:

Title: ${content.title}
Description: ${content.description}
Type: ${content.type}
${content.keywords?.length ? `Target Keywords: ${content.keywords.join(', ')}` : ''}

Requirements:
- Meta title: Max 60 characters, include primary keyword
- Meta description: Max 160 characters, compelling call-to-action
- Keywords: 8-12 relevant keywords
- Schema: Generate appropriate JSON-LD schema markup

Respond in JSON format:
{
  "metaTitle": "SEO title",
  "metaDescription": "SEO description",
  "keywords": ["keyword1", "keyword2"],
  "schema": {
    "@context": "https://schema.org",
    "@type": "TouristAttraction",
    ...
  }
}`;

    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      const cleanText = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      return JSON.parse(cleanText);
    } catch (error: any) {
      console.error('Gemini SEO metadata error:', error);
      throw new Error(`Failed to generate SEO metadata: ${error.message}`);
    }
  }

  /**
   * Translate content to Sinhala or Tamil
   */
  async translateContent(content: string, targetLanguage: 'sinhala' | 'tamil'): Promise<string> {
    this.ensureInitialized();

    const prompt = `Translate this Sri Lanka travel content to ${targetLanguage}.
Maintain the same tone and style. Keep proper nouns (place names, hotel names) in their original form.

Content:
${content}

Respond with ONLY the translated text, no JSON or formatting.`;

    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      return response.text().trim();
    } catch (error: any) {
      console.error('Gemini translation error:', error);
      throw new Error(`Failed to translate content: ${error.message}`);
    }
  }
}

// Export singleton instance
export const geminiService = new GeminiService();
export default geminiService;
