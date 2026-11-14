'use client';

import { CartSidebar } from '@/components/cart/CartSidebar';
import { siteConfig } from '@/config/site';
import { I18nProvider } from '@/i18n/I18nProvider';
import { CartProvider } from '@/lib/cart-store';

type ProvidersProps = {
  children: React.ReactNode;
};

export function Providers({ children }: ProvidersProps) {
  return (
    <I18nProvider locale={siteConfig.defaultLocale}>
      <CartProvider>
        {children}
        <CartSidebar />
      </CartProvider>
    </I18nProvider>
  );
}
