import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
    Sparkles,
    Image,
    Check,
    TrendingUp,
    Lightbulb,
    Wand2,
    Loader2
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { GoogleGenerativeAI } from '@google/generative-ai';

interface GeminiToolbarProps {
    content: string;
    onContentUpdate: (newContent: string) => void;
    onImageGenerate?: () => void;
    contentType?: 'blog' | 'tour' | 'hotel' | 'destination' | 'general';
    showImageButton?: boolean;
    className?: string;
}

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || 'AIzaSyBMXM3xNrL8zKu1fi1dbdj0VbkJK2MRxgM';

export const GeminiToolbar: React.FC<GeminiToolbarProps> = ({
    content,
    onContentUpdate,
    onImageGenerate,
    contentType = 'general',
    showImageButton = true,
    className = ''
}) => {
    const [loading, setLoading] = useState<string | null>(null);
    const { toast } = useToast();

    const callGemini = async (prompt: string, action: string) => {
        if (!content?.trim()) {
            toast({
                title: "No content",
                description: "Please enter some content first",
                variant: "destructive"
            });
            return;
        }

        setLoading(action);
        try {
            const genAI = new GoogleGenerativeAI(API_KEY);
            const model = genAI.getGenerativeModel({ model: "gemini-pro" });

            const result = await model.generateContent(prompt);
            const response = await result.response;
            const newContent = response.text().trim();

            onContentUpdate(newContent);
            toast({
                title: "✓ Success!",
                description: `Content ${action} successfully`,
            });
        } catch (error) {
            console.error(`${action} error:`, error);
            toast({
                title: "Error",
                description: `Failed to ${action}. Please try again.`,
                variant: "destructive"
            });
        } finally {
            setLoading(null);
        }
    };

    const checkGrammar = () => {
        const prompt = `Fix grammar, spelling, and punctuation errors. Return ONLY the corrected text:\n\n${content}`;
        callGemini(prompt, 'grammar checked');
    };

    const improveSEO = () => {
        const typeContext = {
            blog: 'blog post',
            tour: 'tour package description',
            hotel: 'hotel description',
            destination: 'destination guide',
            general: 'content'
        };

        const prompt = `Optimize this ${typeContext[contentType]} for SEO:
    - Add relevant keywords naturally
    - Improve readability
    - Make it more engaging
    - Keep the core message
    
    Return ONLY the optimized text:\n\n${content}`;

        callGemini(prompt, 'SEO optimized');
    };

    const expandContent = () => {
        const prompt = `Expand this content with more details, examples, and information. Make it 2-3x longer while maintaining quality. Return ONLY the expanded text:\n\n${content}`;
        callGemini(prompt, 'expanded');
    };

    const improveWriting = () => {
        const prompt = `Improve this writing:
    - Make it more engaging and professional
    - Better word choices
    - Clearer sentences
    - More compelling
    
    Return ONLY the improved text:\n\n${content}`;

        callGemini(prompt, 'improved');
    };

    const generateSuggestions = async () => {
        setLoading('suggestions');
        try {
            const genAI = new GoogleGenerativeAI(API_KEY);
            const model = genAI.getGenerativeModel({ model: "gemini-pro" });

            const prompt = `Analyze this content and provide 5 specific improvement suggestions:
      
      Content: ${content}
      
      Format as:
      1. [Suggestion]
      2. [Suggestion]
      etc.`;

            const result = await model.generateContent(prompt);
            const response = await result.response;
            const suggestions = response.text();

            toast({
                title: "💡 AI Suggestions",
                description: suggestions,
                duration: 10000
            });
        } catch (error) {
            console.error('Suggestions error:', error);
            toast({
                title: "Error",
                description: "Failed to get suggestions",
                variant: "destructive"
            });
        } finally {
            setLoading(null);
        }
    };

    const isLoading = loading !== null;

    return (
        <div className={`flex flex-wrap gap-2 p-3 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950 dark:to-pink-950 rounded-lg border border-purple-200 dark:border-purple-800 ${className}`}>
            <div className="flex items-center gap-2 text-sm font-semibold text-purple-700 dark:text-purple-300 mr-2">
                <Sparkles className="h-4 w-4" />
                <span>AI Assistant:</span>
            </div>

            <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={checkGrammar}
                disabled={isLoading}
                className="gap-1"
            >
                {loading === 'grammar checked' ? (
                    <Loader2 className="h-3 w-3 animate-spin" />
                ) : (
                    <Check className="h-3 w-3" />
                )}
                Grammar
            </Button>

            <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={improveWriting}
                disabled={isLoading}
                className="gap-1"
            >
                {loading === 'improved' ? (
                    <Loader2 className="h-3 w-3 animate-spin" />
                ) : (
                    <Wand2 className="h-3 w-3" />
                )}
                Improve
            </Button>

            <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={improveSEO}
                disabled={isLoading}
                className="gap-1"
            >
                {loading === 'SEO optimized' ? (
                    <Loader2 className="h-3 w-3 animate-spin" />
                ) : (
                    <TrendingUp className="h-3 w-3" />
                )}
                SEO
            </Button>

            <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={expandContent}
                disabled={isLoading}
                className="gap-1"
            >
                {loading === 'expanded' ? (
                    <Loader2 className="h-3 w-3 animate-spin" />
                ) : (
                    <Sparkles className="h-3 w-3" />
                )}
                Expand
            </Button>

            <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={generateSuggestions}
                disabled={isLoading}
                className="gap-1"
            >
                {loading === 'suggestions' ? (
                    <Loader2 className="h-3 w-3 animate-spin" />
                ) : (
                    <Lightbulb className="h-3 w-3" />
                )}
                Suggest
            </Button>

            {showImageButton && onImageGenerate && (
                <Button
                    type="button"
                    size="sm"
                    variant="default"
                    onClick={onImageGenerate}
                    disabled={isLoading}
                    className="gap-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                >
                    <Image className="h-3 w-3" />
                    Generate Image
                </Button>
            )}
        </div>
    );
};

export default GeminiToolbar;
