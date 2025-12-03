/**
 * Perplexity AI Service
 * Integration with Perplexity AI for research and fact-checking
 */

import type {
  AIService,
  AIProvider,
  ContentGenerationRequest,
  ContentGenerationResponse,
  ResearchRequest,
  ResearchResponse
} from './types';

const PERPLEXITY_API_KEY = import.meta.env.VITE_PERPLEXITY_API_KEY || '';
const PERPLEXITY_API_URL = 'https://api.perplexity.ai';

class PerplexityService implements AIService {
  provider: AIProvider = 'perplexity';
  private apiKey: string;
  private model: string = 'llama-3.1-sonar-large-128k-online'; // Best for research with web access

  constructor() {
    this.apiKey = PERPLEXITY_API_KEY;
  }

  private async makeRequest(endpoint: string, body: object): Promise<any> {
    if (!this.apiKey) {
      throw new Error('Perplexity API key not configured');
    }

    const response = await fetch(`${PERPLEXITY_API_URL}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`
      },
      body: JSON.stringify(body)
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Unknown error' }));
      throw new Error(error.error || `Perplexity API error: ${response.status}`);
    }

    return response.json();
  }

  async generateContent(request: ContentGenerationRequest): Promise<ContentGenerationResponse> {
    const systemPrompt = `You are an expert travel content writer with access to the latest information about Sri Lanka tourism.
Research and create engaging, accurate, SEO-optimized content.
Always cite sources when possible and include up-to-date information.
Respond with valid JSON.`;

    const userPrompt = this.buildContentPrompt(request);

    try {
      const response = await this.makeRequest('/chat/completions', {
        model: this.model,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.5,
        max_tokens: 4000
      });

      const content = response.choices[0]?.message?.content || '{}';
      return this.parseContentResponse(content, request);
    } catch (error: any) {
      console.error('Perplexity content generation error:', error);
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

    return `Research and generate a ${contentType} article about: "${topic}"

Requirements:
- Tone: ${tone}
- Target word count: ${targetWordCount} words
- Category: ${category || 'Travel'}
${keywords.length > 0 ? `- Include these keywords: ${keywords.join(', ')}` : ''}

Important: Use your web search capabilities to find the most current information.
Include recent data, statistics, and facts about Sri Lanka.

Respond with JSON:
{
  "title": "SEO-optimized, engaging title",
  "content": "Full article in Markdown with ## and ### headings, bullet points, and citations where relevant",
  "excerpt": "2-3 sentence summary",
  "metaTitle": "SEO meta title (max 60 chars)",
  "metaDescription": "SEO meta description (max 160 chars)",
  "keywords": ["keyword1", "keyword2", "keyword3", "keyword4", "keyword5"],
  "outline": ["Section 1", "Section 2", "Section 3"],
  "sources": ["Source 1", "Source 2"]
}`;
  }

  private parseContentResponse(text: string, request: ContentGenerationRequest): ContentGenerationResponse {
    try {
      // Clean up potential markdown code blocks
      let cleanText = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();

      // Try to extract JSON from the response
      const jsonMatch = cleanText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        cleanText = jsonMatch[0];
      }

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
      console.warn('Failed to parse Perplexity response as JSON');
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

  /**
   * Research a topic using Perplexity's web search capabilities
   */
  async research(request: ResearchRequest): Promise<ResearchResponse> {
    const depthPrompts: Record<string, string> = {
      quick: 'Provide a brief overview with key facts.',
      standard: 'Provide a comprehensive summary with multiple sources and detailed facts.',
      comprehensive: 'Provide an in-depth analysis with extensive research, multiple perspectives, and verified sources.'
    };

    const prompt = `Research the following topic about Sri Lanka travel: "${request.topic}"

${depthPrompts[request.depth || 'standard']}

Respond with JSON:
{
  "summary": "Comprehensive summary of the topic",
  "keyFacts": [
    "Important fact 1",
    "Important fact 2",
    "Important fact 3",
    "Important fact 4",
    "Important fact 5"
  ],
  "sources": [
    {
      "title": "Source title",
      "url": "Source URL",
      "snippet": "Relevant excerpt from source"
    }
  ],
  "relatedTopics": ["Related topic 1", "Related topic 2", "Related topic 3"]
}`;

    try {
      const response = await this.makeRequest('/chat/completions', {
        model: this.model,
        messages: [
          {
            role: 'system',
            content: 'You are a research assistant with web search capabilities. Provide accurate, well-sourced information. Respond with valid JSON.'
          },
          { role: 'user', content: prompt }
        ],
        temperature: 0.3,
        max_tokens: 2000
      });

      const content = response.choices[0]?.message?.content || '{}';

      // Clean and parse JSON
      let cleanContent = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      const jsonMatch = cleanContent.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        cleanContent = jsonMatch[0];
      }

      return JSON.parse(cleanContent);
    } catch (error: any) {
      console.error('Perplexity research error:', error);
      throw new Error(`Failed to research topic: ${error.message}`);
    }
  }

  /**
   * Get trending travel topics
   */
  async getTrendingTopics(count: number = 10): Promise<string[]> {
    const prompt = `What are the top ${count} trending travel topics related to Sri Lanka tourism right now?
Consider recent news, seasonal events, and popular destinations.

Respond with JSON:
{
  "topics": ["Topic 1", "Topic 2", "Topic 3"]
}`;

    try {
      const response = await this.makeRequest('/chat/completions', {
        model: this.model,
        messages: [
          {
            role: 'system',
            content: 'You are a travel trend analyst. Respond with valid JSON.'
          },
          { role: 'user', content: prompt }
        ],
        temperature: 0.5,
        max_tokens: 500
      });

      const content = response.choices[0]?.message?.content || '{}';
      const cleanContent = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      const parsed = JSON.parse(cleanContent);

      return parsed.topics || [];
    } catch (error: any) {
      console.error('Perplexity trending topics error:', error);
      return [];
    }
  }

  /**
   * Fact-check content
   */
  async factCheck(content: string): Promise<{
    accuracy: number;
    issues: string[];
    corrections: string[];
  }> {
    const prompt = `Fact-check the following content about Sri Lanka travel:

${content.slice(0, 3000)}

Verify facts, statistics, and claims against current information.

Respond with JSON:
{
  "accuracy": 85,
  "issues": ["Issue 1 found", "Issue 2 found"],
  "corrections": ["Correction for issue 1", "Correction for issue 2"]
}`;

    try {
      const response = await this.makeRequest('/chat/completions', {
        model: this.model,
        messages: [
          {
            role: 'system',
            content: 'You are a fact-checker with web search capabilities. Be thorough and accurate. Respond with valid JSON.'
          },
          { role: 'user', content: prompt }
        ],
        temperature: 0.2,
        max_tokens: 1000
      });

      const responseContent = response.choices[0]?.message?.content || '{}';
      const cleanContent = responseContent.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();

      return JSON.parse(cleanContent);
    } catch (error: any) {
      console.error('Perplexity fact-check error:', error);
      return {
        accuracy: 0,
        issues: ['Unable to fact-check content'],
        corrections: []
      };
    }
  }
}

// Export singleton instance
export const perplexityService = new PerplexityService();
export default perplexityService;
