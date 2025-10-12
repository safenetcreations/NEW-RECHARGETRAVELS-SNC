
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { X, Calculator, Percent, DollarSign } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { createSafariPackage } from '@/services/wildlifeService';
import { SelectedItem } from './SafariBuilder';

interface SafariPackageSummaryProps {
  selectedItems: SelectedItem[];
  totalPrice: number;
  onRemoveItem: (itemId: string) => void;
}

const SafariPackageSummary: React.FC<SafariPackageSummaryProps> = ({ 
  selectedItems, 
  totalPrice, 
  onRemoveItem 
}) => {
  const { toast } = useToast();
  const [realtimePrice, setRealtimePrice] = useState(totalPrice);
  const [priceBreakdown, setPriceBreakdown] = useState({
    subtotal: 0,
    taxes: 0,
    serviceCharge: 0,
    discount: 0,
    total: 0
  });

  // Real-time price calculation with detailed breakdown
  useEffect(() => {
    const calculateDetailedPrice = () => {
      const subtotal = selectedItems.reduce((sum, item) => {
        if (item.type === 'lodge' && item.nights) {
          return sum + (item.price * item.nights);
        }
        return sum + item.price;
      }, 0);

      const serviceCharge = subtotal * 0.05; // 5% service charge
      const taxes = subtotal * 0.12; // 12% taxes
      const discount = calculateDiscount(subtotal, selectedItems.length);
      const total = subtotal + serviceCharge + taxes - discount;

      setPriceBreakdown({
        subtotal,
        taxes,
        serviceCharge,
        discount,
        total
      });

      setRealtimePrice(total);
    };

    calculateDetailedPrice();
  }, [selectedItems]);

  const calculateDiscount = (subtotal: number, itemCount: number): number => {
    // Progressive discount based on package size
    if (itemCount >= 5) return subtotal * 0.15; // 15% for 5+ items
    if (itemCount >= 3) return subtotal * 0.10; // 10% for 3+ items
    if (subtotal > 1000) return 50; // $50 discount for packages over $1000
    return 0;
  };

  const handleProceedToBooking = async () => {
    if (selectedItems.length === 0) {
      toast({
        title: "No items selected",
        description: "Please select at least one item to proceed with booking.",
        variant: "destructive",
      });
      return;
    }

    try {
      const packageData = {
        lodges: selectedItems.filter(item => item.type === 'lodge'),
        activities: selectedItems.filter(item => item.type === 'activity'),
        transport: selectedItems.filter(item => item.type === 'transport'),
        cultural: selectedItems.filter(item => item.type === 'cultural')
      };
      
      const { error } = await createSafariPackage({
        name: 'Custom Safari Package',
        start_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        end_date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        total_participants: 2,
        package_data: packageData,
        subtotal: priceBreakdown.subtotal,
        taxes: priceBreakdown.taxes,
        total_amount: priceBreakdown.total
      });

      if (error) {
        throw error;
      }

      toast({
        title: "Package Saved!",
        description: "Your safari package has been saved successfully.",
      });

    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save package. Please try again.",
        variant: "destructive",
      });
    }
  };

  const getItemPrice = (item: SelectedItem) => {
    if (item.type === 'lodge' && item.nights) {
      return item.price * item.nights;
    }
    return item.price;
  };

  return (
    <Card className="sticky top-24 shadow-xl border-2 border-yellow-200">
      <CardHeader className="bg-gradient-to-r from-green-800 to-blue-800 text-white rounded-t-lg">
        <CardTitle className="font-lora text-xl flex items-center">
          <Calculator className="w-5 h-5 mr-2" />
          Your Safari Package
        </CardTitle>
      </CardHeader>
      
      <CardContent className="p-6">
        <div className="space-y-4 mb-6">
          {selectedItems.length === 0 ? (
            <p className="text-gray-500 italic text-center py-4">
              No items selected yet
            </p>
          ) : (
            selectedItems.map((item) => (
              <div key={item.id} className="flex items-start justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm text-gray-900 truncate">
                    {item.name}
                  </p>
                  {item.type === 'lodge' && item.nights && (
                    <p className="text-xs text-gray-600">
                      {item.nights} nights × ${item.price}
                    </p>
                  )}
                  <Badge variant="outline" className="text-xs mt-1">
                    {item.type}
                  </Badge>
                </div>
                <div className="flex items-center space-x-2 ml-2">
                  <span className="font-semibold text-sm">
                    ${getItemPrice(item)}
                  </span>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => onRemoveItem(item.id)}
                    className="p-1 h-6 w-6 hover:bg-red-100"
                  >
                    <X className="h-3 w-3 text-red-500" />
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
        
        {/* Real-time Price Breakdown */}
        {selectedItems.length > 0 && (
          <div className="border-t pt-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span>Subtotal:</span>
              <span>${priceBreakdown.subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Service Charge (5%):</span>
              <span>${priceBreakdown.serviceCharge.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Taxes (12%):</span>
              <span>${priceBreakdown.taxes.toFixed(2)}</span>
            </div>
            {priceBreakdown.discount > 0 && (
              <div className="flex justify-between text-sm text-green-600">
                <span className="flex items-center">
                  <Percent className="w-3 h-3 mr-1" />
                  Discount:
                </span>
                <span>-${priceBreakdown.discount.toFixed(2)}</span>
              </div>
            )}
            <hr className="my-2" />
            <div className="flex justify-between items-center">
              <span className="font-bold text-lg flex items-center">
                <DollarSign className="w-4 h-4 mr-1" />
                Total:
              </span>
              <span className="font-bold text-2xl text-yellow-600">
                ${priceBreakdown.total.toFixed(2)}
              </span>
            </div>
            <p className="text-xs text-gray-500">
              *Prices update in real-time as you modify your selection
            </p>
          </div>
        )}
        
        <div className="mt-6">
          <Button 
            onClick={handleProceedToBooking}
            className="w-full bg-gradient-to-r from-green-800 to-blue-800 hover:from-green-700 hover:to-blue-700 text-white font-bold py-3 rounded-xl"
            disabled={selectedItems.length === 0}
          >
            Proceed to Booking
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default SafariPackageSummary;
