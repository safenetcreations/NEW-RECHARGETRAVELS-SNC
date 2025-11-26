import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

const LanguageSwitcher: React.FC = () => {
  const { language } = useLanguage();

  return (
    <div
      className="rounded-full bg-white/80 px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-slate-600 shadow-sm"
      aria-label="Site language"
    >
      {language === 'en' ? 'English' : 'English'}
    </div>
  );
};

export default LanguageSwitcher; 
