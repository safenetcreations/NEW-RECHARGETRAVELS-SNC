/**
 * AI Provider Factory
 * Factory pattern for selecting and using AI providers
 */

import type {
  AIProvider,
  AIService,
  ContentGenerationRequest,
  ContentGenerationResponse,
  SEOOptimizationRequest,
  SEOOptimizationResponse,
  ContentEnhancementRequest,
  ContentEnhancementResponse,
  ImageGenerationRequest,
  ImageGenerationResponse,
  ResearchRequest,
  ResearchResponse
} from './types';

import { geminiService } from './geminiService';
import { openaiService } from './openaiService';
import { perplexityService } from './perplexityService';

// Provider instances
const providers: Record<AIProvider, AIService> = {
  gemini: geminiService,
  openai: openaiService,
  perplexity: perplexityService
};

// Default provider preference order
const DEFAULT_PROVIDER_ORDER: AIProvider[] = ['gemini', 'openai', 'perplexity'];

// Check which providers are configured
export function getAvailableProviders(): AIProvider[] {
  const available: AIProvider[] = [];

  if (import.meta.env.VITE_GEMINI_API_KEY) {
    available.push('gemini');
  }
  if (import.meta.env.VITE_OPENAI_API_KEY) {
    available.push('openai');
  }
  if (import.meta.env.VITE_PERPLEXITY_API_KEY) {
    available.push('perplexity');
  }

  return available;
}

// Get provider instance
export function getProvider(provider: AIProvider): AIService {
  const service = providers[provider];
  if (!service) {
    throw new Error(`Unknown AI provider: ${provider}`);
  }
  return service;
}

// Get the best available provider
export function getBestAvailableProvider(
  preferred?: AIProvider,
  preferenceOrder: AIProvider[] = DEFAULT_PROVIDER_ORDER
): AIProvider | null {
  const available = getAvailableProviders();

  if (preferred && available.includes(preferred)) {
    return preferred;
  }

  for (const provider of preferenceOrder) {
    if (available.includes(provider)) {
      return provider;
    }
  }

  return null;
}

/**
 * Main AI Factory class
 */
class AIProviderFactory {
  private defaultProvider: AIProvider | null = null;

  constructor() {
    this.defaultProvider = getBestAvailableProvider();
  }

  /**
   * Generate content using specified or best available provider
   */
  async generateContent(
    request: ContentGenerationRequest,
    preferredProvider?: AIProvider
  ): Promise<ContentGenerationResponse> {
    const provider = this.resolveProvider(preferredProvider);
    const service = getProvider(provider);

    console.log(`Generating content with ${provider}...`);

    try {
      return await service.generateContent(request);
    } catch (error: any) {
      // Try fallback to another provider
      const fallback = this.getFallbackProvider(provider);
      if (fallback) {
        console.log(`Falling back to ${fallback}...`);
        return await getProvider(fallback).generateContent(request);
      }
      throw error;
    }
  }

  /**
   * Optimize SEO using specified or best available provider
   */
  async optimizeSEO(
    request: SEOOptimizationRequest,
    preferredProvider?: AIProvider
  ): Promise<SEOOptimizationResponse> {
    const provider = this.resolveProvider(preferredProvider);
    const service = getProvider(provider);

    if (!service.optimizeSEO) {
      throw new Error(`Provider ${provider} does not support SEO optimization`);
    }

    return await service.optimizeSEO(request);
  }

  /**
   * Enhance content using specified or best available provider
   */
  async enhanceContent(
    request: ContentEnhancementRequest,
    preferredProvider?: AIProvider
  ): Promise<ContentEnhancementResponse> {
    const provider = this.resolveProvider(preferredProvider);
    const service = getProvider(provider);

    if (!service.enhanceContent) {
      throw new Error(`Provider ${provider} does not support content enhancement`);
    }

    return await service.enhanceContent(request);
  }

  /**
   * Generate image (only supported by OpenAI currently)
   */
  async generateImage(
    request: ImageGenerationRequest
  ): Promise<ImageGenerationResponse> {
    const available = getAvailableProviders();

    if (available.includes('openai')) {
      const service = getProvider('openai');
      if (service.generateImage) {
        return await service.generateImage(request);
      }
    }

    throw new Error('Image generation requires OpenAI API key');
  }

  /**
   * Research a topic (best with Perplexity)
   */
  async research(
    request: ResearchRequest,
    preferredProvider: AIProvider = 'perplexity'
  ): Promise<ResearchResponse> {
    const available = getAvailableProviders();

    // Perplexity is best for research due to web access
    if (available.includes('perplexity') && preferredProvider === 'perplexity') {
      const service = perplexityService;
      if (service.research) {
        return await service.research(request);
      }
    }

    // Fallback: generate a research-style response with another provider
    const provider = this.resolveProvider(preferredProvider !== 'perplexity' ? preferredProvider : undefined);
    const service = getProvider(provider);

    if (service.research) {
      return await service.research(request);
    }

    // Last resort: convert to content generation
    const contentResponse = await service.generateContent({
      topic: `Research summary: ${request.topic}`,
      contentType: 'guide',
      tone: 'informative',
      targetWordCount: 500
    });

    return {
      summary: contentResponse.content,
      keyFacts: contentResponse.keywords,
      sources: [],
      relatedTopics: []
    };
  }

  /**
   * Generate a complete blog post with all components
   */
  async generateCompleteBlogPost(
    topic: string,
    options: {
      contentType?: ContentGenerationRequest['contentType'];
      tone?: ContentGenerationRequest['tone'];
      keywords?: string[];
      category?: string;
      generateImage?: boolean;
      preferredProvider?: AIProvider;
    } = {}
  ): Promise<{
    content: ContentGenerationResponse;
    seo: SEOOptimizationResponse;
    image?: ImageGenerationResponse;
    research?: ResearchResponse;
  }> {
    const {
      contentType = 'blog',
      tone = 'informative',
      keywords = [],
      category,
      generateImage = false,
      preferredProvider
    } = options;

    // Step 1: Research the topic (if Perplexity is available)
    let research: ResearchResponse | undefined;
    const available = getAvailableProviders();
    if (available.includes('perplexity')) {
      try {
        research = await this.research({ topic, depth: 'standard' });
        // Add research facts to keywords
        if (research.keyFacts.length > 0) {
          keywords.push(...research.keyFacts.slice(0, 3).map(f => f.split(' ').slice(0, 3).join(' ')));
        }
      } catch (e) {
        console.warn('Research failed, continuing without:', e);
      }
    }

    // Step 2: Generate content
    const content = await this.generateContent({
      topic,
      contentType,
      tone,
      keywords,
      category
    }, preferredProvider);

    // Step 3: Optimize SEO
    const seo = await this.optimizeSEO({
      title: content.title,
      content: content.content,
      targetKeywords: content.keywords
    }, preferredProvider);

    // Step 4: Generate image (optional)
    let image: ImageGenerationResponse | undefined;
    if (generateImage && available.includes('openai')) {
      try {
        image = await this.generateImage({
          prompt: `${topic} Sri Lanka travel photography`,
          style: 'realistic',
          size: 'large'
        });
      } catch (e) {
        console.warn('Image generation failed:', e);
      }
    }

    return { content, seo, image, research };
  }

  private resolveProvider(preferred?: AIProvider): AIProvider {
    const provider = getBestAvailableProvider(preferred);
    if (!provider) {
      throw new Error('No AI providers configured. Please add API keys to environment variables.');
    }
    return provider;
  }

  private getFallbackProvider(excludeProvider: AIProvider): AIProvider | null {
    const available = getAvailableProviders();
    const filtered = available.filter(p => p !== excludeProvider);
    return filtered[0] || null;
  }

  /**
   * Check provider availability
   */
  isProviderAvailable(provider: AIProvider): boolean {
    return getAvailableProviders().includes(provider);
  }

  /**
   * Get provider info
   */
  getProviderInfo(): {
    available: AIProvider[];
    default: AIProvider | null;
    capabilities: Record<AIProvider, string[]>;
  } {
    return {
      available: getAvailableProviders(),
      default: this.defaultProvider,
      capabilities: {
        gemini: ['content', 'seo', 'enhance'],
        openai: ['content', 'seo', 'enhance', 'image'],
        perplexity: ['content', 'research', 'fact-check']
      }
    };
  }
}

// Export singleton instance
export const aiFactory = new AIProviderFactory();
export default aiFactory;

// Export types for convenience
export type { AIProvider, ContentGenerationRequest, ContentGenerationResponse };
