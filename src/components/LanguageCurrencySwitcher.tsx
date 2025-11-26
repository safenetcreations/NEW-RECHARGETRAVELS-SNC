
import React, { useState, useEffect } from 'react';
import { Globe } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface CountryInfo {
  code: string;
  name: string;
  flag: string;
  currency: string;
  currencySymbol: string;
  language: string;
}

const supportedCountries: CountryInfo[] = [
  { code: 'LK', name: 'Sri Lanka', flag: '🇱🇰', currency: 'LKR', currencySymbol: 'Rs', language: 'English' },
  { code: 'US', name: 'United States', flag: '🇺🇸', currency: 'USD', currencySymbol: '$', language: 'English' },
  { code: 'GB', name: 'United Kingdom', flag: '🇬🇧', currency: 'GBP', currencySymbol: '£', language: 'English' },
  { code: 'IN', name: 'India', flag: '🇮🇳', currency: 'INR', currencySymbol: '₹', language: 'English' },
  { code: 'JP', name: 'Japan', flag: '🇯🇵', currency: 'JPY', currencySymbol: '¥', language: 'English' },
  { code: 'AU', name: 'Australia', flag: '🇦🇺', currency: 'AUD', currencySymbol: 'A$', language: 'English' },
  { code: 'CA', name: 'Canada', flag: '🇨🇦', currency: 'CAD', currencySymbol: 'C$', language: 'English' },
  { code: 'DE', name: 'Germany', flag: '🇩🇪', currency: 'EUR', currencySymbol: '€', language: 'English' },
  { code: 'FR', name: 'France', flag: '🇫🇷', currency: 'EUR', currencySymbol: '€', language: 'English' },
];

const LanguageCurrencySwitcher = () => {
  const [currentCountry, setCurrentCountry] = useState<CountryInfo>(supportedCountries[0]);
  const [isDetecting, setIsDetecting] = useState(true);

  useEffect(() => {
    const detectLocationAndCurrency = async () => {
      try {
        // Try to get user's country from browser/IP
        const response = await fetch('https://ipapi.co/json/').catch(() => null);
        
        if (response?.ok) {
          const data = await response.json();
          const detectedCountry = supportedCountries.find(
            country => country.code === data.country_code
          );
          
          if (detectedCountry) {
            setCurrentCountry(detectedCountry);
          }
        }
      } catch (error) {
        console.log('Geolocation detection failed, using default');
      } finally {
        setIsDetecting(false);
      }
    };

    detectLocationAndCurrency();
  }, []);

  const handleCountryChange = (countryCode: string) => {
    const selectedCountry = supportedCountries.find(country => country.code === countryCode);
    if (selectedCountry) {
      setCurrentCountry(selectedCountry);
      // Store in localStorage for persistence
      localStorage.setItem('preferred-country', countryCode);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center space-x-2 px-3 py-2 rounded-md hover:bg-white/10 transition-colors duration-300 border-0 bg-transparent">
        <span className="text-lg">{isDetecting ? '🌍' : currentCountry.flag}</span>
        <Globe className="h-4 w-4 text-gray-600" />
        <span className="font-medium text-sm text-gray-700">
          {isDetecting ? 'Detecting...' : `${currentCountry.currencySymbol} | EN`}
        </span>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent className="w-64 bg-white border border-gray-200 shadow-lg z-[1001]">
        <DropdownMenuLabel className="font-semibold">Region & Language</DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        {supportedCountries.map((country) => (
          <DropdownMenuItem 
            key={country.code} 
            onClick={() => handleCountryChange(country.code)}
            className="cursor-pointer focus:bg-gray-50"
          >
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center space-x-3">
                <span className="text-lg">{country.flag}</span>
                <div className="flex flex-col">
                  <span className="font-medium text-sm">{country.name}</span>
                  <span className="text-xs text-gray-500">{country.currency} • {country.language}</span>
                </div>
              </div>
              <span className="font-semibold text-[#f39c12]">{country.currencySymbol}</span>
            </div>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LanguageCurrencySwitcher;
