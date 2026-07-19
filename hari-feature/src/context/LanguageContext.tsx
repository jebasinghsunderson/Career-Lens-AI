import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import enDict from '../i18n/en.json';
import { type Language, LANG_PREFIX_MAP } from '../i18n/languages';

// Re-export Language type for convenience
export type { Language };
export { LANG_PREFIX_MAP };


interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  isLoading: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    return (sessionStorage.getItem('app_lang') as Language) || null;
  });

  const [isLoading, setIsLoading] = useState(false);
  const [currentTranslations, setCurrentTranslations] = useState<Record<string, string>>(enDict);

  // In-memory cache for downloaded language files
  const translationsCache = useRef<Record<string, Record<string, string>>>({});

  const loadLanguage = useCallback(async (lang: Language) => {
    if (!lang) return;

    const prefix = LANG_PREFIX_MAP[lang];
    if (!prefix) return;

    // Use English dict directly without fetching
    if (prefix === 'en') {
      setCurrentTranslations(enDict);
      return;
    }

    // Use cached version if available
    if (translationsCache.current[prefix]) {
      setCurrentTranslations(translationsCache.current[prefix]);
      return;
    }

    setIsLoading(true);
    try {
      // Dynamic import for code-splitting — Vite creates separate chunks per language
      const module = await import(`../i18n/${prefix}.json`);
      const dict = module.default || module;

      translationsCache.current[prefix] = dict;
      setCurrentTranslations(dict);
    } catch (error) {
      console.error(`Failed to load language dictionary for ${lang} (${prefix}.json):`, error);
      // Fall back to English on error
      setCurrentTranslations(enDict);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (language) {
      loadLanguage(language);
    } else {
      // No language selected yet — show English as default until user picks
      setCurrentTranslations(enDict);
    }
  }, [language, loadLanguage]);

  const handleSetLanguage = (lang: Language) => {
    setLanguageState(lang);
    if (lang) {
      sessionStorage.setItem('app_lang', lang);
    }
  };

  const t = useCallback(
    (key: string): string => {
      const val = currentTranslations[key];
      // Use undefined check so intentionally empty strings are allowed (e.g. landing.the)
      return val !== undefined ? val : key;
    },
    [currentTranslations]
  );

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t, isLoading }}>
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
