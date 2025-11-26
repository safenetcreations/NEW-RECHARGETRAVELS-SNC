
// Updated TasteQuiz component
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Flame, Wine, Leaf, Fish, Apple, Soup } from 'lucide-react';

interface TasteProfile {
  spiceLevel: 'mild' | 'medium' | 'hot';
  atmosphere: 'casual' | 'elegant' | 'adventure';
  ingredients: string[];
}

interface TasteQuizProps {
  onComplete: (profile: TasteProfile) => void;
}

export const TasteQuiz: React.FC<TasteQuizProps> = ({ onComplete }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Partial<TasteProfile>>({});

  const questions = [
    {
      id: 'spiceLevel',
      title: "What's your spice tolerance?",
      subtitle: "Choose your heat level preference",
      options: [
        { value: 'mild', label: 'Mild & Subtle', icon: <Leaf className="w-6 h-6" />, description: 'Gentle flavors that let ingredients shine' },
        { value: 'medium', label: 'Medium Heat', icon: <Wine className="w-6 h-6" />, description: 'Balanced spice with complex flavors' },
        { value: 'hot', label: 'Bring the Fire!', icon: <Flame className="w-6 h-6" />, description: 'Bold, intense, and fiery dishes' }
      ]
    },
    {
      id: 'atmosphere',
      title: "What's your ideal dining vibe?",
      subtitle: "Select your preferred restaurant atmosphere",
      options: [
        { value: 'casual', label: 'Relaxed & Casual', icon: <Soup className="w-6 h-6" />, description: 'Comfortable, laid-back dining' },
        { value: 'elegant', label: 'Sophisticated & Elegant', icon: <Wine className="w-6 h-6" />, description: 'Fine dining with refined service' },
        { value: 'adventure', label: 'Authentic & Adventurous', icon: <Flame className="w-6 h-6" />, description: 'Local experiences and street food' }
      ]
    },
    {
      id: 'ingredients',
      title: "Which ingredients excite you most?",
      subtitle: "Select all that appeal to your palate (multiple selections allowed)",
      multiple: true,
      options: [
        { value: 'seafood', label: 'Fresh Seafood', icon: <Fish className="w-6 h-6" />, description: 'Ocean-fresh fish and shellfish' },
        { value: 'coconut', label: 'Coconut', icon: <Apple className="w-6 h-6" />, description: 'Rich coconut milk and tropical flavors' },
        { value: 'curry', label: 'Curry Spices', icon: <Soup className="w-6 h-6" />, description: 'Aromatic spice blends and curry leaves' },
        { value: 'vegetarian', label: 'Fresh Vegetables', icon: <Leaf className="w-6 h-6" />, description: 'Garden-fresh produce and plant-based dishes' }
      ]
    }
  ];

  const handleAnswer = (questionId: string, value: string | string[], isMultiple = false) => {
    const newAnswers = { ...answers };
    
    if (isMultiple && questionId === 'ingredients') {
      const currentValues = (newAnswers.ingredients as string[]) || [];
      if (Array.isArray(value)) {
        newAnswers.ingredients = value;
      } else {
        if (currentValues.includes(value)) {
          newAnswers.ingredients = currentValues.filter(v => v !== value);
        } else {
          newAnswers.ingredients = [...currentValues, value];
        }
      }
    } else {
      if (questionId === 'spiceLevel') {
        newAnswers.spiceLevel = value as 'mild' | 'medium' | 'hot';
      } else if (questionId === 'atmosphere') {
        newAnswers.atmosphere = value as 'casual' | 'elegant' | 'adventure';
      }
    }
    
    setAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      onComplete(answers as TasteProfile);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const currentQ = questions[currentQuestion];
  const currentAnswer = answers[currentQ.id as keyof TasteProfile];
  const canProceed = currentQ.multiple 
    ? Array.isArray(currentAnswer) && currentAnswer.length > 0
    : currentAnswer !== undefined;

  return (
    <div className="max-w-2xl mx-auto">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between text-sm text-luxury-spice mb-2">
          <span>Question {currentQuestion + 1} of {questions.length}</span>
          <span>{Math.round(((currentQuestion + 1) / questions.length) * 100)}%</span>
        </div>
        <div className="w-full bg-luxury-cream rounded-full h-2">
          <div 
            className="bg-luxury-mahogany h-2 rounded-full transition-all duration-500"
            style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Question Card */}
      <Card className="mb-8 border-luxury-bronze">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-cinzel text-luxury-darkwood">
            {currentQ.title}
          </CardTitle>
          <p className="text-luxury-spice">{currentQ.subtitle}</p>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            {currentQ.options.map((option) => {
              const isSelected = currentQ.multiple
                ? Array.isArray(currentAnswer) && currentAnswer.includes(option.value)
                : currentAnswer === option.value;

              return (
                <button
                  key={option.value}
                  onClick={() => handleAnswer(currentQ.id, option.value, currentQ.multiple)}
                  className={`p-4 rounded-lg border-2 transition-all duration-300 text-left hover:scale-[1.02] ${
                    isSelected
                      ? 'border-luxury-mahogany bg-luxury-cream text-luxury-darkwood shadow-md'
                      : 'border-luxury-bronze/30 hover:border-luxury-bronze bg-white'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div className={`flex-shrink-0 p-2 rounded-full ${
                      isSelected ? 'bg-luxury-mahogany text-white' : 'bg-luxury-cream text-luxury-mahogany'
                    }`}>
                      {option.icon}
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-1">{option.label}</h3>
                      <p className="text-sm opacity-80">{option.description}</p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Navigation Buttons */}
      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={handlePrevious}
          disabled={currentQuestion === 0}
          className="px-6"
        >
          Previous
        </Button>
        <Button
          onClick={handleNext}
          disabled={!canProceed}
          className="bg-luxury-mahogany hover:bg-luxury-darkwood text-white px-6"
        >
          {currentQuestion === questions.length - 1 ? 'Complete Quiz' : 'Next Question'}
        </Button>
      </div>
    </div>
  );
};
