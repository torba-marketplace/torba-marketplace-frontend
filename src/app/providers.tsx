'use client';

import { AccountSidebar } from '@/components/account/AccountSidebar';
import { CartSidebar } from '@/components/cart/CartSidebar';
import { siteConfig } from '@/config/site';
import { I18nProvider } from '@/i18n/I18nProvider';
import { AccountPanelProvider } from '@/lib/account-panel';
import { CartProvider } from '@/lib/cart-store';

type ProvidersProps = {
  children: React.ReactNode;
};

export function Providers({ children }: ProvidersProps) {
  return (
    <I18nProvider locale={siteConfig.defaultLocale}>
      <CartProvider>
        <AccountPanelProvider>
          {children}
          <AccountSidebar />
        </AccountPanelProvider>
        <CartSidebar />
      </CartProvider>
    </I18nProvider>
  );
}
