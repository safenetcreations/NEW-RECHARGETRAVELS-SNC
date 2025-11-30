import { geminiService } from './geminiService';
import { openaiService } from './openaiService';
import { perplexityService } from './perplexityService';
import { ContentGenerationRequest, AIService } from './types';

export type AdminAIProvider = 'gemini' | 'openai' | 'perplexity';

interface GenerateContentOptions {
  topic: string;
  contentType?: string;
  tone?: string;
  targetWordCount?: number;
  keywords?: string[];
  generateOutlineFirst?: boolean;
  category?: string | undefined;
}

// Get AI service by provider name
export function getAIService(provider: AdminAIProvider = 'gemini'): AIService {
  switch (provider) {
    case 'openai':
      return openaiService;
    case 'perplexity':
      return perplexityService;
    case 'gemini':
    default:
      return geminiService;
  }
}

export const aiFactory = {
  async generateContent(
    options: GenerateContentOptions,
    provider: AdminAIProvider = 'gemini'
  ) {
    const request: ContentGenerationRequest = {
      topic: options.topic,
      contentType: (options.contentType as any) || 'blog',
      tone: (options.tone as any) || 'informative',
      targetWordCount: options.targetWordCount,
      keywords: options.keywords,
      generateOutlineFirst: options.generateOutlineFirst,
      category: options.category,
    };

    if (provider === 'gemini') {
      return await geminiService.generateContent(request);
    }

    if (provider === 'openai') {
      return await openaiService.generateContent(request);
    }

    if (provider === 'perplexity') {
      return await perplexityService.generateContent(request);
    }

    const wordCount = request.targetWordCount ?? 1500;
    return {
      title: request.topic || 'AI Generated Title',
      content: 'This provider is not yet configured.',
      excerpt: 'Provider not configured.',
      metaTitle: request.topic || 'AI Generated Meta Title',
      metaDescription: 'Provider not configured.',
      keywords: request.keywords ?? [],
      outline: [],
      readingTime: Math.max(1, Math.round(wordCount / 200)),
      provider,
    };
  },
};

export default aiFactory;
