'use client';

import { I18nProvider } from '@/i18n/I18nProvider';
import { siteConfig } from '@/config/site';

type ProvidersProps = {
  children: React.ReactNode;
};

export function Providers({ children }: ProvidersProps) {
  return <I18nProvider locale={siteConfig.defaultLocale}>{children}</I18nProvider>;
}
