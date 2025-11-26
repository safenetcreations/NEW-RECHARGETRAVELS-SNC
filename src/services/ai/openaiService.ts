/**
 * OpenAI Service
 * Integration with OpenAI's GPT models for content generation
 */

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
  ImageGenerationResponse
} from './types';

const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY || '';
const OPENAI_API_URL = 'https://api.openai.com/v1';

class OpenAIService implements AIService {
  provider: AIProvider = 'openai';
  private apiKey: string;
  private model: string = 'gpt-4-turbo-preview'; // Latest GPT-4 Turbo

  constructor() {
    this.apiKey = OPENAI_API_KEY;
  }

  private async makeRequest(endpoint: string, body: object): Promise<any> {
    if (!this.apiKey) {
      throw new Error('OpenAI API key not configured');
    }

    const response = await fetch(`${OPENAI_API_URL}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`
      },
      body: JSON.stringify(body)
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: { message: 'Unknown error' } }));
      throw new Error(error.error?.message || `OpenAI API error: ${response.status}`);
    }

    return response.json();
  }

  async generateContent(request: ContentGenerationRequest): Promise<ContentGenerationResponse> {
    const systemPrompt = `You are an expert travel content writer specializing in Sri Lanka tourism.
You create engaging, SEO-optimized content that captures readers' attention while providing valuable information.
Always respond with valid JSON.`;

    const userPrompt = this.buildContentPrompt(request);

    try {
      const response = await this.makeRequest('/chat/completions', {
        model: this.model,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.7,
        max_tokens: 4000,
        response_format: { type: 'json_object' }
      });

      const content = response.choices[0]?.message?.content || '{}';
      return this.parseContentResponse(content, request);
    } catch (error: any) {
      console.error('OpenAI content generation error:', error);
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

    return `Generate a ${contentType} article about: "${topic}"

Requirements:
- Tone: ${tone}
- Target word count: ${targetWordCount} words
- Category: ${category || 'Travel'}
${keywords.length > 0 ? `- Include these keywords naturally: ${keywords.join(', ')}` : ''}

Respond with a JSON object containing:
{
  "title": "SEO-optimized, engaging title",
  "content": "Full article content in Markdown format with proper headings (##, ###), paragraphs, bullet points",
  "excerpt": "Compelling 2-3 sentence summary",
  "metaTitle": "SEO meta title (max 60 chars)",
  "metaDescription": "SEO meta description (max 160 chars)",
  "keywords": ["keyword1", "keyword2", "keyword3", "keyword4", "keyword5"],
  "outline": ["Section 1", "Section 2", "Section 3"]
}

Focus on:
- Engaging, informative content about Sri Lanka
- Practical tips and insider knowledge
- SEO-friendly structure with clear headings
- Compelling introduction and conclusion`;
  }

  private parseContentResponse(text: string, request: ContentGenerationRequest): ContentGenerationResponse {
    try {
      const parsed = JSON.parse(text);

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
      console.warn('Failed to parse OpenAI response as JSON');
      return {
        title: `${request.topic} - Travel Guide`,
        content: text,
        excerpt: text.slice(0, 200) + '...',
        metaTitle: request.topic.slice(0, 60),
        metaDescription: text.slice(0, 160),
        keywords: request.keywords || [],
        readingTime: Math.ceil(text.split(/\s+/).length / 200),
        provider: this.provider
      };
    }
  }

  async optimizeSEO(request: SEOOptimizationRequest): Promise<SEOOptimizationResponse> {
    const prompt = `Analyze this content for SEO and provide optimization suggestions.

Title: ${request.title}
Target Keywords: ${request.targetKeywords?.join(', ') || 'None specified'}

Content (first 3000 chars):
${request.content.slice(0, 3000)}

Respond with JSON:
{
  "metaTitle": "Optimized meta title (max 60 chars)",
  "metaDescription": "Optimized meta description (max 160 chars)",
  "suggestedKeywords": ["keyword1", "keyword2", "keyword3", "keyword4", "keyword5"],
  "headingStructure": ["Suggested H2 headings"],
  "seoScore": 85,
  "suggestions": ["Actionable SEO suggestion 1", "Suggestion 2"]
}`;

    try {
      const response = await this.makeRequest('/chat/completions', {
        model: this.model,
        messages: [
          { role: 'system', content: 'You are an SEO expert. Respond with valid JSON only.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.3,
        max_tokens: 1000,
        response_format: { type: 'json_object' }
      });

      return JSON.parse(response.choices[0]?.message?.content || '{}');
    } catch (error: any) {
      console.error('OpenAI SEO optimization error:', error);
      throw new Error(`Failed to optimize SEO: ${error.message}`);
    }
  }

  async enhanceContent(request: ContentEnhancementRequest): Promise<ContentEnhancementResponse> {
    const actionPrompts: Record<string, string> = {
      rewrite: 'Rewrite this content to be more engaging while maintaining the same information',
      expand: `Expand this content to approximately ${request.targetLength || 2000} words with more detail and examples`,
      summarize: 'Summarize this content concisely while keeping all key points',
      improve: 'Improve the clarity, flow, readability, and engagement of this content'
    };

    const prompt = `${actionPrompts[request.action]}:

${request.content}

Respond with JSON:
{
  "enhancedContent": "The improved content in Markdown format...",
  "changes": ["Brief description of change 1", "Change 2", "Change 3"]
}`;

    try {
      const response = await this.makeRequest('/chat/completions', {
        model: this.model,
        messages: [
          { role: 'system', content: 'You are a professional content editor. Respond with valid JSON only.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.5,
        max_tokens: 4000,
        response_format: { type: 'json_object' }
      });

      return JSON.parse(response.choices[0]?.message?.content || '{}');
    } catch (error: any) {
      console.error('OpenAI content enhancement error:', error);
      throw new Error(`Failed to enhance content: ${error.message}`);
    }
  }

  async generateImage(request: ImageGenerationRequest): Promise<ImageGenerationResponse> {
    const stylePrompts: Record<string, string> = {
      realistic: 'photorealistic, high quality, detailed',
      artistic: 'artistic, creative, stylized illustration',
      minimalist: 'minimalist, clean, simple design',
      vibrant: 'vibrant colors, dynamic, eye-catching'
    };

    const sizeMap: Record<string, string> = {
      small: '512x512',
      medium: '1024x1024',
      large: '1792x1024'
    };

    const enhancedPrompt = `${request.prompt}, ${stylePrompts[request.style || 'realistic']}, travel photography, Sri Lanka tourism`;

    try {
      const response = await this.makeRequest('/images/generations', {
        model: 'dall-e-3',
        prompt: enhancedPrompt,
        n: 1,
        size: sizeMap[request.size || 'medium'],
        quality: 'standard'
      });

      return {
        imageUrl: response.data[0]?.url || '',
        altText: request.prompt
      };
    } catch (error: any) {
      console.error('OpenAI image generation error:', error);
      throw new Error(`Failed to generate image: ${error.message}`);
    }
  }
}

// Export singleton instance
export const openaiService = new OpenAIService();
export default openaiService;
