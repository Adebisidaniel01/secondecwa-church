import React, { createContext, useContext, useState, ReactNode } from 'react';

type Language = 'en' | 'yo';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations: Record<Language, Record<string, string>> = {
  en: {
    // Navigation
    'nav.home': 'Home',
    'nav.about': 'About',
    'nav.sermons': 'Sermons',
    'nav.videos': 'Videos',
    'nav.gallery': 'Gallery',
    'nav.events': 'Events',
    'nav.ministries': 'Ministries',
    'nav.contact': 'Contact',
    'nav.admin': 'Admin',
    'nav.give': 'Give',
    'nav.tagline': 'Faith, hope & Love.',
    
    // Footer
    'footer.quickLinks': 'Quick Links',
    'footer.contact': 'Contact Us',
    'footer.followUs': 'Follow Us',
    'footer.newsletter': 'Newsletter',
    'footer.newsletterText': 'Subscribe to our newsletter for updates',
    'footer.rights': 'All rights reserved.',
    
    // Common
    'common.readMore': 'Read More',
    'common.register': 'Register',
    'common.submit': 'Submit',
    'common.loading': 'Loading...',
    'common.viewAll': 'View All',
  },
  yo: {
    // Navigation
    'nav.home': 'Ilé',
    'nav.about': 'Nípa Wa',
    'nav.sermons': 'Àwọn Ìwàásù',
    'nav.videos': 'Àwọn Fídíò',
    'nav.gallery': 'Àwòrán',
    'nav.events': 'Àwọn Ìṣẹ̀lẹ̀',
    'nav.ministries': 'Àwọn Iṣẹ́ Ìjọ',
    'nav.contact': 'Kàn Sí Wa',
    'nav.admin': 'Alábòjútó',
    'nav.give': 'Fún Wa',
    'nav.tagline': 'Ìgbàgbọ́, Ìrètí àti Ìfẹ́.',
    
    // Footer
    'footer.quickLinks': 'Àwọn Ọ̀nà Yára',
    'footer.contact': 'Kàn Sí Wa',
    'footer.followUs': 'Tẹ̀lé Wa',
    'footer.newsletter': 'Ìwé Ìròyìn',
    'footer.newsletterText': 'Forúkọ sílẹ̀ fún ìwé ìròyìn wa fún àwọn ìmúdójúíwọ̀n',
    'footer.rights': 'Gbogbo ẹ̀tọ́ ni a dáàbò bò.',
    
    // Common
    'common.readMore': 'Kà Síwájú',
    'common.register': 'Forúkọsílẹ̀',
    'common.submit': 'Fi Ránṣẹ́',
    'common.loading': 'Ń gbé...',
    'common.viewAll': 'Wo Gbogbo',
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<Language>('en');

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
