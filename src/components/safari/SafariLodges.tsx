
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { getLodges, type Lodge } from '@/services/wildlifeService';
import { SelectedItem } from './SafariBuilder';

interface SafariLodgesProps {
  selectedItems: SelectedItem[];
  onAddItem: (item: SelectedItem) => void;
  onRemoveItem: (itemId: string) => void;
  onUpdateItem: (itemId: string, updates: Partial<SelectedItem>) => void;
}

const SafariLodges: React.FC<SafariLodgesProps> = ({ 
  selectedItems, 
  onAddItem, 
  onRemoveItem,
  onUpdateItem 
}) => {
  const [lodges, setLodges] = useState<Lodge[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadLodges = async () => {
      const { data } = await getLodges();
      setLodges(data || []);
      setLoading(false);
    };
    
    loadLodges();
  }, []);

  const handleLodgeSelection = (lodge: Lodge, nights: number = 2) => {
    const itemId = `lodge-${lodge.id}`;
    const isSelected = selectedItems.some(item => item.id === itemId);

    if (isSelected) {
      onRemoveItem(itemId);
    } else {
      onAddItem({
        id: itemId,
        name: lodge.name,
        price: lodge.price_per_night,
        type: 'lodge',
        nights
      });
    }
  };

  const updateNights = (lodgeId: string, nights: number) => {
    const itemId = `lodge-${lodgeId}`;
    onUpdateItem(itemId, { nights });
  };

  if (loading) {
    return <div className="text-center py-8">Loading lodges...</div>;
  }

  // Group lodges by category
  const premiumLodges = lodges.filter(lodge => 
    lodge.lodge_categories?.slug === 'luxury' || lodge.price_per_night >= 400
  );
  const ecoLodges = lodges.filter(lodge => 
    lodge.lodge_categories?.slug === 'eco' || lodge.price_per_night < 400
  );

  const renderLodgeGrid = (lodgeList: Lodge[], title: string) => (
    <div className="mb-12">
      <h3 className="font-lora text-2xl font-semibold mb-6 text-green-900">{title}</h3>
      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
        {lodgeList.map((lodge) => {
          const itemId = `lodge-${lodge.id}`;
          const isSelected = selectedItems.some(item => item.id === itemId);
          const selectedItem = selectedItems.find(item => item.id === itemId);

          return (
            <Card 
              key={lodge.id} 
              className={`group cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${
                isSelected ? 'ring-2 ring-yellow-500 bg-yellow-50' : 'hover:shadow-lg'
              }`}
              onClick={() => handleLodgeSelection(lodge)}
            >
              <div className="relative h-48 bg-gradient-to-br from-amber-200 to-yellow-400 rounded-t-lg overflow-hidden">
                <Badge className="absolute top-3 right-3 bg-yellow-600 text-white font-semibold">
                  ${lodge.price_per_night}/night
                </Badge>
                {lodge.is_featured && (
                  <Badge className="absolute top-3 left-3 bg-green-600 text-white">
                    Featured
                  </Badge>
                )}
              </div>
              
              <CardContent className="p-4">
                <h3 className="font-lora text-lg font-semibold mb-2 text-green-900">
                  {lodge.name}
                </h3>
                <p className="text-sm text-gray-600 mb-2">{lodge.location}</p>
                <p className="text-sm text-gray-700 mb-4 line-clamp-2">
                  {lodge.description}
                </p>
                
                {isSelected && (
                  <div className="mt-4 p-3 bg-yellow-50 rounded-lg border">
                    <Label htmlFor={`nights-${lodge.id}`} className="text-sm font-medium">
                      Number of nights:
                    </Label>
                    <Input
                      id={`nights-${lodge.id}`}
                      type="number"
                      min="1"
                      max="14"
                      value={selectedItem?.nights || 2}
                      onChange={(e) => updateNights(lodge.id, parseInt(e.target.value) || 2)}
                      className="mt-1 w-20"
                      onClick={(e) => e.stopPropagation()}
                    />
                  </div>
                )}
                
                <Button
                  className={`w-full mt-4 ${
                    isSelected 
                      ? 'bg-yellow-600 hover:bg-yellow-700' 
                      : 'bg-green-600 hover:bg-green-700'
                  }`}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleLodgeSelection(lodge);
                  }}
                >
                  {isSelected ? 'Selected' : 'Select Lodge'}
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );

  return (
    <div>
      {renderLodgeGrid(premiumLodges, 'Premier National Park Lodges')}
      {renderLodgeGrid(ecoLodges, 'Unique Eco-Lodges')}
    </div>
  );
};

export default SafariLodges;
