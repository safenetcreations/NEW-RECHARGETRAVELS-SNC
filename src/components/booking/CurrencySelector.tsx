import React, { useState, useEffect } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';

interface Currency {
  code: string;
  name: string;
  symbol: string;
  rate: number;
}

const currencies: Currency[] = [
  { code: 'USD', name: 'US Dollar', symbol: '$', rate: 1 },
  { code: 'LKR', name: 'Sri Lankan Rupee', symbol: 'Rs', rate: 300 },
  { code: 'EUR', name: 'Euro', symbol: '€', rate: 0.92 },
  { code: 'GBP', name: 'British Pound', symbol: '£', rate: 0.79 },
  { code: 'INR', name: 'Indian Rupee', symbol: '₹', rate: 83 },
  { code: 'AUD', name: 'Australian Dollar', symbol: 'A$', rate: 1.52 },
  { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$', rate: 1.36 }
];

interface CurrencySelectorProps {
  onCurrencyChange: (currency: Currency) => void;
  defaultCurrency?: string;
}

export const CurrencySelector: React.FC<CurrencySelectorProps> = ({ 
  onCurrencyChange, 
  defaultCurrency = 'USD' 
}) => {
  const [selectedCurrency, setSelectedCurrency] = useState<Currency>(
    currencies.find(c => c.code === defaultCurrency) || currencies[0]
  );

  useEffect(() => {
    // Auto-detect user's location and set currency
    const detectUserCurrency = async () => {
      try {
        const response = await fetch('https://ipapi.co/json/');
        const data = await response.json();
        const countryCode = data.country_code;
        
        let detectedCurrency = 'USD';
        switch (countryCode) {
          case 'LK': detectedCurrency = 'LKR'; break;
          case 'IN': detectedCurrency = 'INR'; break;
          case 'GB': detectedCurrency = 'GBP'; break;
          case 'AU': detectedCurrency = 'AUD'; break;
          case 'CA': detectedCurrency = 'CAD'; break;
          case 'DE':
          case 'FR':
          case 'IT':
          case 'ES': detectedCurrency = 'EUR'; break;
          default: detectedCurrency = 'USD';
        }
        
        const currency = currencies.find(c => c.code === detectedCurrency);
        if (currency) {
          setSelectedCurrency(currency);
          onCurrencyChange(currency);
        }
      } catch (error) {
        console.log('Could not detect user location, using default currency');
      }
    };

    detectUserCurrency();
  }, [onCurrencyChange]);

  const handleCurrencyChange = (currencyCode: string) => {
    const currency = currencies.find(c => c.code === currencyCode);
    if (currency) {
      setSelectedCurrency(currency);
      onCurrencyChange(currency);
    }
  };

  const convertPrice = (price: number, fromCurrency: Currency = currencies[0]) => {
    const usdPrice = price / fromCurrency.rate;
    return (usdPrice * selectedCurrency.rate).toFixed(2);
  };

  return (
    <div className="flex items-center gap-2">
      <Select value={selectedCurrency.code} onValueChange={handleCurrencyChange}>
        <SelectTrigger className="w-[140px]">
          <SelectValue>
            <div className="flex items-center gap-2">
              <span>{selectedCurrency.symbol}</span>
              <span>{selectedCurrency.code}</span>
            </div>
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          {currencies.map((currency) => (
            <SelectItem key={currency.code} value={currency.code}>
              <div className="flex items-center justify-between w-full">
                <span>{currency.symbol} {currency.code}</span>
                <span className="text-muted-foreground text-sm ml-2">
                  {currency.name}
                </span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      
      <Badge variant="outline" className="text-xs">
        Auto-detected
      </Badge>
    </div>
  );
};

export const useCurrency = () => {
  const [currency, setCurrency] = useState<Currency>(currencies[0]);
  
  const convertPrice = (price: number, fromCurrencyCode: string = 'USD') => {
    const fromCurrency = currencies.find(c => c.code === fromCurrencyCode) || currencies[0];
    const usdPrice = price / fromCurrency.rate;
    return (usdPrice * currency.rate).toFixed(2);
  };

  const formatPrice = (price: number, fromCurrencyCode: string = 'USD') => {
    const convertedPrice = convertPrice(price, fromCurrencyCode);
    return `${currency.symbol}${convertedPrice}`;
  };

  return {
    currency,
    setCurrency,
    convertPrice,
    formatPrice,
    currencies
  };
};