import React from 'react';
import { Button } from '@/components/ui/button';

interface Category {
  id: string;
  name: string;
  description: string;
  emoji: string;
  gradient: string;
  textColor: string;
}

interface CategoriesSectionProps {
  onCategorySelect: (category: string) => void;
}

const CategoriesSection: React.FC<CategoriesSectionProps> = ({ onCategorySelect }) => {
  const categories: Category[] = [
    {
      id: 'beaches',
      name: 'Beaches',
      description: 'Pristine coastlines with golden sands',
      emoji: '🏖️',
      gradient: 'from-blue-400 to-blue-600',
      textColor: 'text-blue-600'
    },
    {
      id: 'temples',
      name: 'Temples',
      description: 'Ancient Buddhist and Hindu heritage',
      emoji: '🏛️',
      gradient: 'from-orange-400 to-red-600',
      textColor: 'text-red-600'
    },
    {
      id: 'wildlife',
      name: 'Wildlife',
      description: 'Elephants, leopards, and exotic birds',
      emoji: '🐘',
      gradient: 'from-green-400 to-green-600',
      textColor: 'text-green-600'
    },
    {
      id: 'hill-country',
      name: 'Hill Country',
      description: 'Tea plantations and mountain views',
      emoji: '⛰️',
      gradient: 'from-purple-400 to-purple-600',
      textColor: 'text-purple-600'
    },
    {
      id: 'cultural',
      name: 'Cultural Sites',
      description: 'UNESCO World Heritage locations',
      emoji: '🏺',
      gradient: 'from-yellow-400 to-orange-600',
      textColor: 'text-orange-600'
    },
    {
      id: 'adventure',
      name: 'Adventure',
      description: 'Hiking, surfing, and water sports',
      emoji: '🎋',
      gradient: 'from-teal-400 to-teal-600',
      textColor: 'text-teal-600'
    }
  ];

  return (
    <section id="destinations" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 fade-in-up">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">Explore Sri Lanka</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Discover the diverse experiences our beautiful island has to offer
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map((category, index) => (
            <div
              key={category.id}
              className={`category-card bg-gradient-to-br ${category.gradient} rounded-2xl p-8 text-white cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-xl fade-in-up`}
              style={{ animationDelay: `${index * 100}ms` }}
              onClick={() => onCategorySelect(category.id)}
            >
              <div className="text-6xl mb-4">{category.emoji}</div>
              <h3 className="text-2xl font-bold mb-2">{category.name}</h3>
              <p className="opacity-90 mb-4 leading-relaxed">{category.description}</p>
              <Button
                className={`bg-white ${category.textColor} hover:bg-gray-100 px-6 py-2 rounded-full font-semibold transition-all duration-300 hover:scale-105`}
                onClick={(e) => {
                  e.stopPropagation();
                  onCategorySelect(category.id);
                }}
              >
                Explore
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoriesSection;