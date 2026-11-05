import type { Metadata } from 'next';
import { Bruno_Ace, Inter, Roboto } from 'next/font/google';

import { Providers } from '@/app/providers';
import { siteConfig } from '@/config/site';

import './globals.css';

const bodyFont = Inter({
  variable: '--font-body',
  subsets: ['latin', 'cyrillic'],
});

const brandFont = Bruno_Ace({
  variable: '--font-bruno',
  weight: '400',
  subsets: ['latin'],
});

const secondFont = Roboto({
  variable: '--font-roboto',
  weight: '400',
  subsets: ['latin', 'cyrillic'],
});

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s · ${siteConfig.name}`,
  },
  description: siteConfig.description,
  icons: {
    icon: '/icons/Brandmark.svg',
  },
};

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html
      lang={siteConfig.defaultLocale}
      className={`${bodyFont.variable} ${brandFont.variable} ${secondFont.variable} h-full`}
    >
      <body className="min-h-full antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
