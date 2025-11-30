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
  // Using gpt-5.1 model
  private model: string = 'gpt-5.1';

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
        max_completion_tokens: 4000,
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

    return `Generate a highly SEO-optimized ${contentType} article about: "${topic}"

=== SEO REQUIREMENTS (MANDATORY) ===
1. TITLE: Create an SEO-optimized title (50-60 characters) that includes the primary keyword near the beginning
2. META TITLE: Unique meta title optimized for search engines (max 60 chars) with primary keyword
3. META DESCRIPTION: Compelling meta description (150-160 chars) with primary keyword and clear call-to-action
4. URL SLUG: Generate an SEO-friendly URL slug (lowercase, hyphens, no special chars)
5. HEADING STRUCTURE: Use proper H2 and H3 hierarchy with keywords in headings
6. KEYWORD DENSITY: Natural keyword placement (1-2% density) throughout the content
7. LSI KEYWORDS: Include 5-10 Latent Semantic Indexing (related) keywords
8. INTERNAL LINKING SUGGESTIONS: Suggest 3-5 related topics for internal links
9. SCHEMA MARKUP: Suggest appropriate schema type (Article, BlogPosting, TravelGuide, etc.)
10. FAQ SECTION: Include 3-5 frequently asked questions with answers for FAQ schema
11. IMAGE ALT TEXT: Suggest 3-5 descriptive, keyword-rich image alt texts

=== CONTENT REQUIREMENTS ===
- Tone: ${tone}
- Target word count: ${targetWordCount} words
- Category: ${category || 'Travel'}
- Focus: Sri Lanka tourism, travel experiences, destinations
${keywords.length > 0 ? `- Primary Keywords to include naturally: ${keywords.join(', ')}` : ''}

=== CONTENT STRUCTURE ===
- Compelling introduction with hook and primary keyword in first 100 words
- Clear H2 sections with descriptive, keyword-rich headings
- Bullet points and numbered lists for scannability
- Short paragraphs (2-4 sentences each)
- Strong conclusion with call-to-action
- Featured snippet optimized content (answer key questions directly)

Respond with a JSON object containing:
{
  "title": "SEO-optimized title with primary keyword (50-60 chars)",
  "slug": "seo-friendly-url-slug",
  "content": "Full article in Markdown with ## H2, ### H3 headings, bullet points, and proper structure",
  "excerpt": "Compelling 2-3 sentence summary with primary keyword",
  "metaTitle": "Unique SEO meta title (max 60 chars)",
  "metaDescription": "Meta description with keyword and CTA (150-160 chars)",
  "keywords": ["primary keyword", "secondary keywords", "total 5-8 keywords"],
  "lsiKeywords": ["related term 1", "related term 2", "5-10 LSI keywords"],
  "outline": ["H2 Section 1", "H2 Section 2", "H2 Section 3"],
  "faqSection": [
    {"question": "FAQ question 1?", "answer": "Detailed answer 1"},
    {"question": "FAQ question 2?", "answer": "Detailed answer 2"},
    {"question": "FAQ question 3?", "answer": "Detailed answer 3"}
  ],
  "schemaType": "TravelGuide or Article or BlogPosting",
  "internalLinkSuggestions": ["Related Topic 1", "Related Topic 2", "Related Topic 3"],
  "imageAltSuggestions": ["Descriptive alt text 1", "Alt text 2", "Alt text 3"]
}

Focus on creating content that:
- Ranks well on Google for target keywords
- Provides genuine value to readers planning Sri Lanka travel
- Includes practical tips, insider knowledge, and actionable advice
- Is structured for featured snippets and rich results
- Answers user intent comprehensively`;
  }

  private parseContentResponse(text: string, request: ContentGenerationRequest): ContentGenerationResponse {
    try {
      const parsed = JSON.parse(text);

      // Build FAQ section HTML if available
      let faqHtml = '';
      if (parsed.faqSection && Array.isArray(parsed.faqSection) && parsed.faqSection.length > 0) {
        faqHtml = '\n\n## Frequently Asked Questions\n\n';
        parsed.faqSection.forEach((faq: { question: string; answer: string }) => {
          faqHtml += `### ${faq.question}\n${faq.answer}\n\n`;
        });
      }

      // Append FAQ to content if not already included
      const contentWithFaq = parsed.content?.includes('Frequently Asked Questions')
        ? parsed.content
        : (parsed.content || '') + faqHtml;

      return {
        title: parsed.title || `${request.topic} - Travel Guide`,
        slug: parsed.slug || '',
        content: contentWithFaq,
        excerpt: parsed.excerpt || '',
        metaTitle: parsed.metaTitle || parsed.title?.slice(0, 60) || '',
        metaDescription: parsed.metaDescription || parsed.excerpt?.slice(0, 160) || '',
        keywords: parsed.keywords || [],
        lsiKeywords: parsed.lsiKeywords || [],
        outline: parsed.outline || [],
        faqSection: parsed.faqSection || [],
        schemaType: parsed.schemaType || 'Article',
        internalLinkSuggestions: parsed.internalLinkSuggestions || [],
        imageAltSuggestions: parsed.imageAltSuggestions || [],
        readingTime: Math.ceil((contentWithFaq?.split(/\s+/).length || 0) / 200),
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
        max_completion_tokens: 1000,
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
        max_completion_tokens: 4000,
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

    // DALL-E 3 supported sizes
    const sizeMap: Record<string, string> = {
      small: '1024x1024',
      medium: '1024x1024',
      large: '1792x1024'
    };

    const enhancedPrompt = `${request.prompt}, ${stylePrompts[request.style || 'realistic']}, travel photography, Sri Lanka tourism`;

    try {
      console.log('Generating image with DALL-E 3...');
      console.log('Prompt:', enhancedPrompt);

      const response = await this.makeRequest('/images/generations', {
        model: 'dall-e-3',
        prompt: enhancedPrompt,
        n: 1,
        size: sizeMap[request.size || 'medium'],
        quality: 'standard',
        response_format: 'url'
      });

      const imageUrl = response.data[0]?.url || '';
      console.log('Image generated successfully, URL length:', imageUrl.length);
      console.log('Image URL preview:', imageUrl.substring(0, 100) + '...');

      if (!imageUrl) {
        throw new Error('No image URL returned from DALL-E');
      }

      return {
        imageUrl,
        altText: request.prompt
      };
    } catch (error: any) {
      console.error('OpenAI image generation error:', error);
      throw new Error(`Failed to generate image: ${error.message}`);
    }
  }
}

export const openaiService = new OpenAIService();
export default openaiService;
