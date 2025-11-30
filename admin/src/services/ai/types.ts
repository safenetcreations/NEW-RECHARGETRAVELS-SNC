/**
 * AI Service Types
 * Shared types for all AI provider integrations
 */

export type AIProvider = 'gemini' | 'openai' | 'perplexity';

export interface AIProviderConfig {
    provider: AIProvider;
    apiKey: string;
    model?: string;
}

export interface ContentGenerationRequest {
    topic: string;
    contentType: 'blog' | 'news' | 'guide' | 'review';
    tone: 'professional' | 'casual' | 'informative' | 'persuasive';
    targetWordCount?: number;
    keywords?: string[];
    generateOutlineFirst?: boolean;
    category?: string;
    language?: string;
}

export interface ContentGenerationResponse {
    title: string;
    slug?: string;
    content: string;
    excerpt: string;
    metaTitle: string;
    metaDescription: string;
    keywords: string[];
    lsiKeywords?: string[];
    outline?: string[];
    faqSection?: { question: string; answer: string }[];
    schemaType?: string;
    internalLinkSuggestions?: string[];
    imageAltSuggestions?: string[];
    readingTime: number;
    provider: AIProvider;
}

export interface SEOOptimizationRequest {
    content: string;
    title: string;
    targetKeywords?: string[];
}

export interface SEOOptimizationResponse {
    metaTitle: string;
    metaDescription: string;
    suggestedKeywords: string[];
    headingStructure: string[];
    seoScore: number;
    suggestions: string[];
}

export interface ContentEnhancementRequest {
    content: string;
    action: 'rewrite' | 'expand' | 'summarize' | 'improve';
    targetLength?: number;
}

export interface ContentEnhancementResponse {
    enhancedContent: string;
    changes: string[];
}

export interface ImageGenerationRequest {
    prompt: string;
    style?: 'realistic' | 'artistic' | 'minimalist' | 'vibrant';
    size?: 'small' | 'medium' | 'large';
}

export interface ImageGenerationResponse {
    imageUrl: string;
    altText: string;
}

export interface ResearchRequest {
    topic: string;
    depth?: 'quick' | 'standard' | 'comprehensive';
}

export interface ResearchResponse {
    summary: string;
    keyFacts: string[];
    sources: {
        title: string;
        url: string;
        snippet: string;
    }[];
    relatedTopics: string[];
}

export interface AIServiceError {
    code: string;
    message: string;
    provider: AIProvider;
    retryable: boolean;
}

// Travel-specific content types
export interface ItineraryGenerationRequest {
    destination: string;
    duration: number; // days
    travelStyle: 'luxury' | 'budget' | 'adventure' | 'family' | 'honeymoon' | 'cultural';
    interests?: string[];
    budget?: { min: number; max: number; currency: string };
    includeAccommodation?: boolean;
    includeMeals?: boolean;
    includeTransport?: boolean;
}

export interface ItineraryDay {
    day: number;
    title: string;
    description: string;
    activities: {
        time: string;
        activity: string;
        location: string;
        duration: string;
        tips?: string;
    }[];
    meals?: { breakfast?: string; lunch?: string; dinner?: string };
    accommodation?: string;
    transportMode?: string;
}

export interface ItineraryGenerationResponse {
    title: string;
    overview: string;
    highlights: string[];
    days: ItineraryDay[];
    includedServices: string[];
    excludedServices: string[];
    packingList: string[];
    bestTimeToVisit: string;
    estimatedCost?: { amount: number; currency: string };
    tips: string[];
}

export interface FAQGenerationRequest {
    topic: string;
    context: string; // Description of the tour/destination/activity
    targetAudience?: string;
    count?: number; // Number of FAQs to generate
}

export interface FAQ {
    question: string;
    answer: string;
    category?: string;
}

export interface FAQGenerationResponse {
    faqs: FAQ[];
}

export interface ReviewResponseRequest {
    reviewText: string;
    rating: number; // 1-5
    reviewerName?: string;
    businessName?: string;
    tone?: 'professional' | 'friendly' | 'apologetic';
}

export interface ReviewResponseResponse {
    response: string;
    sentiment: 'positive' | 'neutral' | 'negative';
    keyPoints: string[];
}

export interface DescriptionGenerationRequest {
    type: 'destination' | 'tour' | 'activity' | 'hotel' | 'experience';
    name: string;
    details: Record<string, any>;
    length?: 'short' | 'medium' | 'long';
    includeHighlights?: boolean;
    includePracticalInfo?: boolean;
}

export interface DescriptionGenerationResponse {
    shortDescription: string;
    longDescription: string;
    highlights?: string[];
    practicalInfo?: Record<string, string>;
    tags?: string[];
}

export interface ImageAnalysisRequest {
    imageUrl: string;
    analyzeFor: ('tags' | 'location' | 'quality' | 'content' | 'seo')[];
}

export interface ImageAnalysisResponse {
    tags: string[];
    suggestedLocation?: string;
    qualityScore?: number;
    contentDescription: string;
    suggestedAltText: string;
    suggestedCaption: string;
    isAppropriate: boolean;
}

export interface AIService {
    provider: AIProvider;
    generateContent(request: ContentGenerationRequest): Promise<ContentGenerationResponse>;
    optimizeSEO?(request: SEOOptimizationRequest): Promise<SEOOptimizationResponse>;
    enhanceContent?(request: ContentEnhancementRequest): Promise<ContentEnhancementResponse>;
    generateImage?(request: ImageGenerationRequest): Promise<ImageGenerationResponse>;
    research?(request: ResearchRequest): Promise<ResearchResponse>;
    // Travel-specific methods
    generateItinerary?(request: ItineraryGenerationRequest): Promise<ItineraryGenerationResponse>;
    generateFAQs?(request: FAQGenerationRequest): Promise<FAQGenerationResponse>;
    generateReviewResponse?(request: ReviewResponseRequest): Promise<ReviewResponseResponse>;
    generateDescription?(request: DescriptionGenerationRequest): Promise<DescriptionGenerationResponse>;
    analyzeImage?(request: ImageAnalysisRequest): Promise<ImageAnalysisResponse>;
}
