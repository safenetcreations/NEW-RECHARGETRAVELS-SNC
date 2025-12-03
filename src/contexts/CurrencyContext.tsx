import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface Currency {
  code: string;
  symbol: string;
  name: string;
  rate: number; // Rate relative to USD
}

export const SUPPORTED_CURRENCIES: Currency[] = [
  { code: 'USD', symbol: '$', name: 'US Dollar', rate: 1 },
  { code: 'EUR', symbol: '€', name: 'Euro', rate: 0.92 },
  { code: 'GBP', symbol: '£', name: 'British Pound', rate: 0.79 },
  { code: 'AUD', symbol: 'A$', name: 'Australian Dollar', rate: 1.53 },
  { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar', rate: 1.36 },
  { code: 'INR', symbol: '₹', name: 'Indian Rupee', rate: 83.12 },
  { code: 'LKR', symbol: 'Rs', name: 'Sri Lankan Rupee', rate: 323.50 },
  { code: 'AED', symbol: 'د.إ', name: 'UAE Dirham', rate: 3.67 },
  { code: 'SGD', symbol: 'S$', name: 'Singapore Dollar', rate: 1.34 },
  { code: 'CHF', symbol: 'Fr', name: 'Swiss Franc', rate: 0.88 },
];

interface CurrencyContextType {
  currency: Currency;
  setCurrency: (currency: Currency) => void;
  convertFromUSD: (amountUSD: number) => number;
  convertToUSD: (amount: number) => number;
  formatPrice: (amountUSD: number, showCode?: boolean) => string;
  currencies: Currency[];
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export const CurrencyProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currency, setCurrencyState] = useState<Currency>(SUPPORTED_CURRENCIES[0]); // USD default

  useEffect(() => {
    // Load saved currency preference
    const saved = localStorage.getItem('b2b_currency');
    if (saved) {
      const savedCurrency = SUPPORTED_CURRENCIES.find(c => c.code === saved);
      if (savedCurrency) {
        setCurrencyState(savedCurrency);
      }
    }
  }, []);

  const setCurrency = (newCurrency: Currency) => {
    setCurrencyState(newCurrency);
    localStorage.setItem('b2b_currency', newCurrency.code);
  };

  const convertFromUSD = (amountUSD: number): number => {
    return Math.round(amountUSD * currency.rate * 100) / 100;
  };

  const convertToUSD = (amount: number): number => {
    return Math.round((amount / currency.rate) * 100) / 100;
  };

  const formatPrice = (amountUSD: number, showCode: boolean = false): string => {
    const converted = convertFromUSD(amountUSD);
    const formatted = new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(converted);
    
    if (showCode) {
      return `${currency.symbol}${formatted} ${currency.code}`;
    }
    return `${currency.symbol}${formatted}`;
  };

  return (
    <CurrencyContext.Provider
      value={{
        currency,
        setCurrency,
        convertFromUSD,
        convertToUSD,
        formatPrice,
        currencies: SUPPORTED_CURRENCIES,
      }}
    >
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = () => {
  const context = useContext(CurrencyContext);
  if (context === undefined) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
};
