
import React from 'react';
import { PriceCalculation } from '../../types';
import { formatCurrency } from '../../utils/formatting';

interface PriceSummaryProps {
  price: PriceCalculation;
  className?: string;
}

export const PriceSummary: React.FC<PriceSummaryProps> = ({
  price,
  className = ''
}) => {
  return (
    <div className={`bg-white border rounded-lg p-4 ${className}`}>
      <h3 className="font-semibold text-gray-900 mb-4">Price Breakdown</h3>
      
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Base Price</span>
          <span>{formatCurrency(price.basePrice, price.currency)}</span>
        </div>
        
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Distance ({price.distance?.toFixed(1)} km)</span>
          <span>{formatCurrency(price.distancePrice, price.currency)}</span>
        </div>

        {price.surcharges && Object.entries(price.surcharges).map(([key, value]) => (
          value > 0 && (
            <div key={key} className="flex justify-between text-sm">
              <span className="text-gray-600">
                {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
              </span>
              <span>{formatCurrency(value, price.currency)}</span>
            </div>
          )
        ))}

        {price.discounts && Object.entries(price.discounts).map(([key, value]) => (
          value > 0 && (
            <div key={key} className="flex justify-between text-sm text-green-600">
              <span>
                {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
              </span>
              <span>-{formatCurrency(value, price.currency)}</span>
            </div>
          )
        ))}

        <div className="border-t pt-2 mt-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Subtotal</span>
            <span>{formatCurrency(price.subtotal, price.currency)}</span>
          </div>
          
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Taxes & Fees</span>
            <span>{formatCurrency(price.taxes, price.currency)}</span>
          </div>
        </div>

        <div className="border-t pt-2 mt-2">
          <div className="flex justify-between font-semibold text-lg">
            <span>Total</span>
            <span className="text-blue-600">{formatCurrency(price.total, price.currency)}</span>
          </div>
        </div>
      </div>

      <div className="mt-4 p-3 bg-blue-50 rounded text-sm text-blue-700">
        <p>💡 Price includes all taxes and fees. No hidden charges!</p>
      </div>
    </div>
  );
};
