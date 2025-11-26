
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import SafariLodges from './SafariLodges';
import SafariActivities from './SafariActivities';
import SafariTransport from './SafariTransport';
import SafariCultural from './SafariCultural';
import SafariPackageSummary from './SafariPackageSummary';

export interface SelectedItem {
  id: string;
  name: string;
  price: number;
  type: 'lodge' | 'activity' | 'transport' | 'cultural';
  nights?: number;
}

const SafariBuilder: React.FC = () => {
  const [selectedItems, setSelectedItems] = useState<SelectedItem[]>([]);

  const addItem = (item: SelectedItem) => {
    setSelectedItems(prev => [...prev, item]);
  };

  const removeItem = (itemId: string) => {
    setSelectedItems(prev => prev.filter(item => item.id !== itemId));
  };

  const updateItem = (itemId: string, updates: Partial<SelectedItem>) => {
    setSelectedItems(prev => 
      prev.map(item => item.id === itemId ? { ...item, ...updates } : item)
    );
  };

  const totalPrice = selectedItems.reduce((sum, item) => {
    if (item.type === 'lodge' && item.nights) {
      return sum + (item.price * item.nights);
    }
    return sum + item.price;
  }, 0);

  return (
    <section id="safari-builder" className="py-20 bg-gradient-to-b from-amber-50 to-white">
      <div className="container mx-auto px-6">
        <h2 className="font-montserrat text-4xl font-bold text-center mb-16 text-green-900">
          Build Your Safari Adventure
        </h2>
        
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="flex-1">
            <Tabs defaultValue="lodges" className="w-full">
              <TabsList className="grid w-full grid-cols-4 mb-8 bg-green-100">
                <TabsTrigger value="lodges" className="text-sm font-semibold">🏨 Accommodation</TabsTrigger>
                <TabsTrigger value="activities" className="text-sm font-semibold">🦁 Experiences</TabsTrigger>
                <TabsTrigger value="transport" className="text-sm font-semibold">🚗 Transport</TabsTrigger>
                <TabsTrigger value="cultural" className="text-sm font-semibold">🏛️ Cultural</TabsTrigger>
              </TabsList>
              
              <TabsContent value="lodges">
                <SafariLodges 
                  selectedItems={selectedItems} 
                  onAddItem={addItem} 
                  onRemoveItem={removeItem}
                  onUpdateItem={updateItem}
                />
              </TabsContent>
              
              <TabsContent value="activities">
                <SafariActivities 
                  selectedItems={selectedItems} 
                  onAddItem={addItem} 
                  onRemoveItem={removeItem}
                />
              </TabsContent>
              
              <TabsContent value="transport">
                <SafariTransport 
                  selectedItems={selectedItems} 
                  onAddItem={addItem} 
                  onRemoveItem={removeItem}
                />
              </TabsContent>
              
              <TabsContent value="cultural">
                <SafariCultural 
                  selectedItems={selectedItems} 
                  onAddItem={addItem} 
                  onRemoveItem={removeItem}
                />
              </TabsContent>
            </Tabs>
          </div>
          
          <div className="lg:w-80">
            <SafariPackageSummary 
              selectedItems={selectedItems}
              totalPrice={totalPrice}
              onRemoveItem={removeItem}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default SafariBuilder;
