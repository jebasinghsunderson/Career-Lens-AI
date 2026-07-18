import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'English' | 'Hindi' | null;

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>(() => {
    // Optionally load from localStorage, but for now we want it to pop up always or if not set.
    return (localStorage.getItem('app_lang') as Language) || null;
  });

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang);
    if (lang) {
      localStorage.setItem('app_lang', lang);
    }
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage }}>
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
