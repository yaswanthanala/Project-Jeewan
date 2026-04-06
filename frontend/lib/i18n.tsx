'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { dictionaries, Locale, TranslationKey } from './locales';

type LanguageContextType = {
  locale: Locale;
  setLocale: (l: Locale) => void;
  t: (key: TranslationKey) => string;
};

const LanguageContext = createContext<LanguageContextType>({
  locale: 'en',
  setLocale: () => {},
  t: (key) => dictionaries['en'][key] || key,
});

export const LanguageProvider = ({ children }: { children: React.ReactNode }) => {
  const [locale, setLocaleState] = useState<Locale>('en');

  useEffect(() => {
    // Load from local storage if previously set
    const saved = localStorage.getItem('jeewan-lang') as Locale;
    if (saved && dictionaries[saved]) {
      setLocaleState(saved);
    }
  }, []);

  const setLocale = (l: Locale) => {
    setLocaleState(l);
    localStorage.setItem('jeewan-lang', l);
  };

  const t = (key: TranslationKey) => {
    return dictionaries[locale][key] || dictionaries['en'][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
