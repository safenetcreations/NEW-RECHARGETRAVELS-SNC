import React, { createContext, useContext, useState, ReactNode } from 'react';

export type Language = 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Translation data
const translations = {
  en: {
    // Navigation
    'nav.home': 'Home',
    'nav.about': 'About',
    'nav.tours': 'Our Tours',
    'nav.experiences': 'Experiences',
    'nav.transport': 'Transport',
    'nav.book_now': 'Book Now',
    'nav.contact': 'Contact Us',
    
    // Common
    'common.book_now': 'Book Now',
    'common.learn_more': 'Learn More',
    'common.view_details': 'View Details',
    'common.get_quote': 'Get Free Quote',
    'common.contact_us': 'Contact Us',
    'common.whatsapp': 'WhatsApp',
    'common.call_us': 'Call Us',
    'common.email_us': 'Email Us',
    
    // Homepage
    'home.hero.title': 'Discover Sri Lanka',
    'home.hero.subtitle': 'Your Gateway to Paradise Island',
    'home.hero.description': 'Experience the magic of Sri Lanka with our expert-guided tours, luxury accommodations, and unforgettable adventures.',
    'home.hero.cta': 'Start Your Journey',
    
    // Tours
    'tours.cultural': 'Cultural Tours',
    'tours.beach': 'Beach Tours',
    'tours.luxury': 'Luxury Tours',
    'tours.honeymoon': 'Honeymoon Packages',
    'tours.wildlife': 'Wildlife Safaris',
    'tours.photography': 'Photography Tours',
    'tours.ecotourism': 'Eco Tourism',
    
    // Destinations
    'destinations.colombo': 'Colombo',
    'destinations.kandy': 'Kandy',
    'destinations.galle': 'Galle',
    'destinations.sigiriya': 'Sigiriya',
    'destinations.ella': 'Ella',
    'destinations.jaffna': 'Jaffna',
    
    // Contact
    'contact.title': 'Contact Us',
    'contact.description': 'Get in touch with our travel experts',
    'contact.phone': 'Phone',
    'contact.email': 'Email',
    'contact.address': 'Address',
    'contact.form.name': 'Full Name',
    'contact.form.email': 'Email Address',
    'contact.form.message': 'Message',
    'contact.form.send': 'Send Message',
    
    // Footer
    'footer.company': 'Recharge Travels & Tours Ltd',
    'footer.description': 'Your trusted partner for unforgettable Sri Lanka adventures',
    'footer.quick_links': 'Quick Links',
    'footer.contact_info': 'Contact Info',
    'footer.follow_us': 'Follow Us',
    'footer.copyright': '© 2024 Recharge Travels. All rights reserved.',
  }
} as const;

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en');

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  const value: LanguageContextType = {
    language,
    setLanguage,
    t
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}; 
