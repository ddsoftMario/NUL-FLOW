
import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';

// Import translations
import en from './locales/en';
import nl from './locales/nl';
import fr from './locales/fr';
import de from './locales/de';
import da from './locales/da';
import es from './locales/es';
import ko from './locales/ko';
import zh from './locales/zh';
import pt from './locales/pt';

type Locale = 'en' | 'nl' | 'fr' | 'de' | 'da' | 'es' | 'ko' | 'zh' | 'pt';

export const LANGUAGES: Record<Locale, string> = {
  en: '🇺🇸 English',
  nl: '🇳🇱 Nederlands',
  fr: '🇫🇷 Français',
  de: '🇩🇪 Deutsch',
  da: '🇩🇰 Dansk',
  es: '🇪🇸 Español',
  ko: '🇰🇷 한국어',
  zh: '🇨🇳 中文',
  pt: '🇵🇹 Português',
};

const translations: Record<Locale, any> = { en, nl, fr, de, da, es, ko, zh, pt };

interface I18nContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string, replacements?: Record<string, string | number>) => string;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

export const I18nProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const getInitialLocale = (): Locale => {
    const savedLocale = localStorage.getItem('nul-flow-locale');
    if (savedLocale && Object.keys(LANGUAGES).includes(savedLocale)) {
      return savedLocale as Locale;
    }
    const browserLang = navigator.language.split(/[-_]/)[0];
    if (Object.keys(LANGUAGES).includes(browserLang)) {
        return browserLang as Locale;
    }
    return 'en';
  };
  
  const [locale, setLocaleState] = useState<Locale>(getInitialLocale);

  useEffect(() => {
    localStorage.setItem('nul-flow-locale', locale);
  }, [locale]);
  
  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale);
  };

  const t = useCallback((key: string, replacements?: Record<string, string | number>): string => {
    const keys = key.split('.');
    let result = translations[locale];
    let fallbackResult = translations.en;
    let found = true;

    for (const k of keys) {
      result = result?.[k];
      fallbackResult = fallbackResult?.[k];
      if (result === undefined) {
          found = false;
          break;
      }
    }
    
    if (!found || typeof result !== 'string') {
        result = fallbackResult;
    }

    if(result === undefined) {
        console.warn(`Translation key "${key}" not found in locale "${locale}" or fallback "en".`);
        return key;
    }
    
    let finalString = result;

    if (replacements) {
        Object.keys(replacements).forEach(rKey => {
            finalString = finalString.replace(new RegExp(`{{${rKey}}}`, 'g'), String(replacements[rKey]));
        });
    }

    return finalString;
  }, [locale]);

  return (
    <I18nContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </I18nContext.Provider>
  );
};

export const useTranslation = (): I18nContextType => {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useTranslation must be used within an I18nProvider');
  }
  return context;
};
