'use client';

import { createInstance } from 'i18next';
import { useMemo } from 'react';
import { I18nextProvider, initReactI18next } from 'react-i18next';

import { defaultNS, fallbackLng } from '@/i18n/config';
import en from '@/i18n/locales/en/common.json';
import uk from '@/i18n/locales/uk/common.json';
import type { AppLocale } from '@/config/site';

type I18nProviderProps = {
  children: React.ReactNode;
  locale?: AppLocale;
};

export function I18nProvider({ children, locale = fallbackLng }: I18nProviderProps) {
  const i18n = useMemo(() => {
    const instance = createInstance();

    void instance.use(initReactI18next).init({
      lng: locale,
      fallbackLng,
      defaultNS,
      ns: [defaultNS],
      resources: {
        uk: { [defaultNS]: uk },
        en: { [defaultNS]: en },
      },
      interpolation: { escapeValue: false },
    });

    return instance;
  }, [locale]);

  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>;
}
