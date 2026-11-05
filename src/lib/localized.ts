import type { AppLocale } from '@/config/site';

export type LocalizedText = Record<AppLocale, string>;

export function localized(text: LocalizedText, locale: string): string {
  if (locale === 'en' || locale === 'uk') {
    return text[locale];
  }

  return text.uk;
}
