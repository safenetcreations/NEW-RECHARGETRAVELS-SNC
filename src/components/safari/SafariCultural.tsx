
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock } from 'lucide-react';
import { SelectedItem } from './SafariBuilder';

interface SafariCulturalProps {
  selectedItems: SelectedItem[];
  onAddItem: (item: SelectedItem) => void;
  onRemoveItem: (itemId: string) => void;
}

const SafariCultural: React.FC<SafariCulturalProps> = ({ 
  selectedItems, 
  onAddItem, 
  onRemoveItem 
}) => {
  const culturalOptions = [
    {
      id: 'sigiriya',
      name: 'Sigiriya Rock Fortress',
      description: 'Climb the magnificent \'Lion Rock\' for jaw-dropping 360-degree jungle views.',
      price: 50,
      duration: '3 hours',
      type: 'UNESCO Site'
    },
    {
      id: 'temple-tooth',
      name: 'Temple of the Sacred Tooth',
      description: 'Experience the spiritual heart of Sri Lanka at this beautiful temple in Kandy.',
      price: 30,
      duration: '2 hours',
      type: 'Sacred Site'
    },
    {
      id: 'galle-fort',
      name: 'Galle Fort Walking Tour',
      description: 'Wander charming cobbled streets of this Dutch colonial UNESCO Heritage Site.',
      price: 40,
      duration: '3 hours',
      type: 'Historic'
    }
  ];

  const handleCulturalSelection = (cultural: any) => {
    const itemId = `cultural-${cultural.id}`;
    const isSelected = selectedItems.some(item => item.id === itemId);

    if (isSelected) {
      onRemoveItem(itemId);
    } else {
      onAddItem({
        id: itemId,
        name: cultural.name,
        price: cultural.price,
        type: 'cultural'
      });
    }
  };

  return (
    <div>
      <h3 className="font-lora text-2xl font-semibold mb-6 text-green-900">
        Enrich Your Journey
      </h3>
      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
        {culturalOptions.map((cultural) => {
          const itemId = `cultural-${cultural.id}`;
          const isSelected = selectedItems.some(item => item.id === itemId);

          return (
            <Card 
              key={cultural.id} 
              className={`group cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${
                isSelected ? 'ring-2 ring-purple-500 bg-purple-50' : 'hover:shadow-lg'
              }`}
              onClick={() => handleCulturalSelection(cultural)}
            >
              <div className="relative h-48 bg-gradient-to-br from-purple-200 to-pink-300 rounded-t-lg overflow-hidden">
                <Badge className="absolute top-3 right-3 bg-purple-600 text-white font-semibold">
                  ${cultural.price}/person
                </Badge>
              </div>
              
              <CardContent className="p-4">
                <h3 className="font-lora text-lg font-semibold mb-2 text-green-900">
                  {cultural.name}
                </h3>
                <p className="text-sm text-gray-700 mb-4">
                  {cultural.description}
                </p>
                
                <div className="flex items-center text-sm text-blue-600 mb-4">
                  <Clock className="w-4 h-4 mr-1" />
                  🏛️ {cultural.type} • {cultural.duration}
                </div>
                
                <Button
                  className={`w-full ${
                    isSelected 
                      ? 'bg-purple-600 hover:bg-purple-700' 
                      : 'bg-green-600 hover:bg-green-700'
                  }`}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCulturalSelection(cultural);
                  }}
                >
                  {isSelected ? 'Selected' : 'Select Experience'}
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default SafariCultural;
