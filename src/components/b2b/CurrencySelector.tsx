import { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check, Globe } from 'lucide-react';
import { useCurrency } from '@/contexts/CurrencyContext';

interface CurrencySelectorProps {
  variant?: 'default' | 'compact' | 'dropdown';
  className?: string;
}

const CurrencySelector = ({ variant = 'default', className = '' }: CurrencySelectorProps) => {
  const { currency, setCurrency, currencies } = useCurrency();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (variant === 'compact') {
    return (
      <div className={`relative ${className}`} ref={dropdownRef}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-1 px-2 py-1 text-sm font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
        >
          <span>{currency.code}</span>
          <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>

        {isOpen && (
          <div className="absolute right-0 top-full mt-1 bg-white rounded-xl shadow-xl border border-slate-200 py-2 min-w-[160px] z-50">
            {currencies.map((c) => (
              <button
                key={c.code}
                onClick={() => {
                  setCurrency(c);
                  setIsOpen(false);
                }}
                className={`w-full px-4 py-2 text-left text-sm flex items-center justify-between hover:bg-slate-50 ${
                  c.code === currency.code ? 'text-emerald-600 font-medium' : 'text-slate-700'
                }`}
              >
                <span>{c.symbol} {c.code}</span>
                {c.code === currency.code && <Check className="w-4 h-4" />}
              </button>
            ))}
          </div>
        )}
      </div>
    );
  }

  if (variant === 'dropdown') {
    return (
      <select
        value={currency.code}
        onChange={(e) => {
          const selected = currencies.find(c => c.code === e.target.value);
          if (selected) setCurrency(selected);
        }}
        className={`px-3 py-2 border border-slate-300 rounded-lg bg-white text-sm focus:ring-2 focus:ring-emerald-500 ${className}`}
      >
        {currencies.map((c) => (
          <option key={c.code} value={c.code}>
            {c.symbol} {c.code} - {c.name}
          </option>
        ))}
      </select>
    );
  }

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-300 rounded-xl hover:border-slate-400 transition-colors"
      >
        <Globe className="w-4 h-4 text-slate-500" />
        <span className="font-medium text-slate-900">{currency.symbol} {currency.code}</span>
        <ChevronDown className={`w-4 h-4 text-slate-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute left-0 top-full mt-2 bg-white rounded-2xl shadow-xl border border-slate-200 py-2 min-w-[240px] z-50 max-h-[400px] overflow-y-auto">
          <div className="px-4 py-2 border-b border-slate-100">
            <p className="text-xs font-medium text-slate-500 uppercase">Select Currency</p>
          </div>
          {currencies.map((c) => (
            <button
              key={c.code}
              onClick={() => {
                setCurrency(c);
                setIsOpen(false);
              }}
              className={`w-full px-4 py-3 text-left flex items-center justify-between hover:bg-slate-50 transition-colors ${
                c.code === currency.code ? 'bg-emerald-50' : ''
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center text-lg">
                  {c.symbol}
                </span>
                <div>
                  <p className={`font-medium ${c.code === currency.code ? 'text-emerald-600' : 'text-slate-900'}`}>
                    {c.code}
                  </p>
                  <p className="text-xs text-slate-500">{c.name}</p>
                </div>
              </div>
              {c.code === currency.code && (
                <Check className="w-5 h-5 text-emerald-500" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default CurrencySelector;
