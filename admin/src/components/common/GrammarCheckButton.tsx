import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Check, Loader2, Sparkles } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { GoogleGenerativeAI } from '@google/generative-ai';

interface GrammarCheckButtonProps {
    text: string;
    onCorrected: (correctedText: string) => void;
    variant?: 'default' | 'outline' | 'ghost';
    size?: 'default' | 'sm' | 'lg';
    showImprove?: boolean;
}

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || 'AIzaSyBMXM3xNrL8zKu1fi1dbdj0VbkJK2MRxgM';

export const GrammarCheckButton: React.FC<GrammarCheckButtonProps> = ({
    text,
    onCorrected,
    variant = 'outline',
    size = 'sm',
    showImprove = false
}) => {
    const [isChecking, setIsChecking] = useState(false);
    const { toast } = useToast();

    const checkGrammar = async () => {
        if (!text || text.trim().length === 0) {
            toast({
                title: "No text to check",
                description: "Please enter some text first",
                variant: "destructive"
            });
            return;
        }

        setIsChecking(true);

        try {
            const genAI = new GoogleGenerativeAI(API_KEY);
            const model = genAI.getGenerativeModel({ model: "gemini-pro" });

            const prompt = showImprove
                ? `Improve this text - fix grammar, enhance clarity, make it more engaging while keeping the same meaning. Return ONLY the improved text without explanations:\n\n${text}`
                : `Check and fix any grammar, spelling, and punctuation errors in this text. Return ONLY the corrected text without explanations:\n\n${text}`;

            const result = await model.generateContent(prompt);
            const response = await result.response;
            const correctedText = response.text().trim();

            if (correctedText === text) {
                toast({
                    title: "✓ Perfect!",
                    description: "No errors found. Your text is already great!",
                });
            } else {
                onCorrected(correctedText);
                toast({
                    title: "✓ Text improved!",
                    description: showImprove ? "Your text has been enhanced" : "Grammar and spelling corrected",
                });
            }
        } catch (error) {
            console.error('Grammar check error:', error);
            toast({
                title: "Error",
                description: "Failed to check grammar. Please try again.",
                variant: "destructive"
            });
        } finally {
            setIsChecking(false);
        }
    };

    return (
        <Button
            type="button"
            variant={variant}
            size={size}
            onClick={checkGrammar}
            disabled={isChecking || !text}
            className="gap-2"
        >
            {isChecking ? (
                <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Checking...
                </>
            ) : (
                <>
                    {showImprove ? (
                        <>
                            <Sparkles className="h-4 w-4" />
                            Improve Text
                        </>
                    ) : (
                        <>
                            <Check className="h-4 w-4" />
                            Check Grammar
                        </>
                    )}
                </>
            )}
        </Button>
    );
};

export default GrammarCheckButton;
