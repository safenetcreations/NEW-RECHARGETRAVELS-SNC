
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { SelectedItem } from './SafariBuilder';

interface SafariTransportProps {
  selectedItems: SelectedItem[];
  onAddItem: (item: SelectedItem) => void;
  onRemoveItem: (itemId: string) => void;
}

const SafariTransport: React.FC<SafariTransportProps> = ({ 
  selectedItems, 
  onAddItem, 
  onRemoveItem 
}) => {
  const transportOptions = [
    {
      id: 'safari-jeep',
      name: '4x4 Safari Jeep',
      description: 'Modified open-top jeep built for rugged terrain and optimal wildlife viewing.',
      price: 200,
      features: 'Expert Driver-Tracker Included',
      gradient: 'from-green-800 to-blue-800'
    },
    {
      id: 'private-suv',
      name: 'Private SUV/Sedan',
      description: 'Air-conditioned comfort for travel between parks with personal chauffeur-guide.',
      price: 150,
      features: 'WiFi & Refreshments Included',
      gradient: 'from-gray-600 to-green-800'
    },
    {
      id: 'tuk-tuk',
      name: 'Playful Tuk-Tuk',
      description: 'For local transfers and exploring towns - embrace the vibrant spirit of Sri Lanka!',
      price: 50,
      features: 'Fun & Authentic',
      gradient: 'from-yellow-500 to-amber-300'
    }
  ];

  const handleTransportSelection = (transport: any) => {
    const itemId = `transport-${transport.id}`;
    const isSelected = selectedItems.some(item => item.id === itemId);

    if (isSelected) {
      onRemoveItem(itemId);
    } else {
      onAddItem({
        id: itemId,
        name: transport.name,
        price: transport.price,
        type: 'transport'
      });
    }
  };

  return (
    <div>
      <h3 className="font-lora text-2xl font-semibold mb-6 text-green-900">
        Choose Your Safari Vehicle
      </h3>
      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
        {transportOptions.map((transport) => {
          const itemId = `transport-${transport.id}`;
          const isSelected = selectedItems.some(item => item.id === itemId);

          return (
            <Card 
              key={transport.id} 
              className={`group cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${
                isSelected ? 'ring-2 ring-orange-500 bg-orange-50' : 'hover:shadow-lg'
              }`}
              onClick={() => handleTransportSelection(transport)}
            >
              <div className={`relative h-48 bg-gradient-to-br ${transport.gradient} rounded-t-lg overflow-hidden`}>
                <Badge className="absolute top-3 right-3 bg-orange-600 text-white font-semibold">
                  ${transport.price}/day
                </Badge>
              </div>
              
              <CardContent className="p-4">
                <h3 className="font-lora text-lg font-semibold mb-2 text-green-900">
                  {transport.name}
                </h3>
                <p className="text-sm text-gray-700 mb-4">
                  {transport.description}
                </p>
                
                <p className="text-sm font-semibold text-yellow-600 mb-4">
                  🚙 {transport.features}
                </p>
                
                <Button
                  className={`w-full ${
                    isSelected 
                      ? 'bg-orange-600 hover:bg-orange-700' 
                      : 'bg-green-600 hover:bg-green-700'
                  }`}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleTransportSelection(transport);
                  }}
                >
                  {isSelected ? 'Selected' : 'Select Transport'}
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default SafariTransport;
