import { useState, useEffect } from 'react';
import { B2BLanguage, b2bTranslations, countryLanguageMap } from '@/i18n/b2b-translations';

const LANGUAGE_KEY = 'b2b_language_preference';

export const useB2BLanguage = () => {
    const [language, setLanguage] = useState<B2BLanguage>('en');
    const [isAutoDetected, setIsAutoDetected] = useState(false);
    const [loading, setLoading] = useState(true);

    // Load saved language or detect location
    useEffect(() => {
        const initLanguage = async () => {
            // 1. Check Local Storage
            const savedLang = localStorage.getItem(LANGUAGE_KEY) as B2BLanguage;
            if (savedLang && b2bTranslations[savedLang]) {
                console.log('Loaded saved language:', savedLang);
                setLanguage(savedLang);
                setLoading(false);
                return;
            }

            // 2. Geo-Detection via IP
            try {
                const response = await fetch('https://ipapi.co/json/');
                const data = await response.json();

                if (data.country_code) {
                    const detectedLang = countryLanguageMap[data.country_code];
                    console.log('Detected country:', data.country_code, 'Language:', detectedLang);

                    if (detectedLang && b2bTranslations[detectedLang]) {
                        setLanguage(detectedLang);
                        setIsAutoDetected(true);
                        // Don't save auto-detected to localStorage yet, wait for user confirmation/interaction
                    }
                }
            } catch (error) {
                console.warn('Geo-detection failed, falling back to browser language:', error);

                // 3. Fallback to Browser Language
                const browserLang = navigator.language.split('-')[0] as B2BLanguage;
                if (b2bTranslations[browserLang]) {
                    setLanguage(browserLang);
                }
            } finally {
                setLoading(false);
            }
        };

        initLanguage();
    }, []);

    // Update language function
    const changeLanguage = (lang: B2BLanguage) => {
        setLanguage(lang);
        localStorage.setItem(LANGUAGE_KEY, lang);

        // Update HTML dir attribute for RTL languages
        if (lang === 'ar') {
            document.documentElement.dir = 'rtl';
        } else {
            document.documentElement.dir = 'ltr';
        }
    };

    // Translation helper
    const t = b2bTranslations[language] || b2bTranslations.en;

    return {
        language,
        setLanguage: changeLanguage,
        t,
        loading,
        isAutoDetected,
        dir: language === 'ar' ? 'rtl' : 'ltr'
    };
};
