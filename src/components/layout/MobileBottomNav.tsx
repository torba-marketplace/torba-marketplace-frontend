'use client';

import { Heart, LayoutGrid01, User01 } from '@untitledui/icons';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslation } from 'react-i18next';

import { useAccountPanel } from '@/lib/account-panel';
import { useCart } from '@/lib/cart-store';
import { cn } from '@/lib/cn';

const itemClass =
  'flex h-[66px] flex-1 flex-col items-center justify-center gap-1 text-xs leading-4 font-medium';

export function MobileBottomNav() {
  const { t } = useTranslation();
  const pathname = usePathname();
  const { isOpen: accountOpen, openAccount, closeAccount } = useAccountPanel();
  const { closeCart } = useCart();

  if (pathname === '/checkout') {
    return null;
  }

  const catalogActive = pathname === '/catalog' || pathname.startsWith('/catalog/');
  const favoritesActive = pathname === '/favorites';

  const closePanels = () => {
    closeAccount();
    closeCart();
  };

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-40 border-t border-(--color-border) bg-(--color-surface) pb-[env(safe-area-inset-bottom)] md:hidden"
      aria-label={t('nav.mobile')}
    >
      <ul className="mx-auto flex max-w-7xl items-stretch">
        <li className="flex flex-1">
          <Link
            href="/catalog"
            className={cn(itemClass, catalogActive ? 'text-(--color-brand)' : 'text-(--color-ink)')}
            aria-current={catalogActive ? 'page' : undefined}
            onClick={closePanels}
          >
            <LayoutGrid01 className="size-6" aria-hidden />
            {t('nav.catalog')}
          </Link>
        </li>
        <li className="flex flex-1">
          <Link
            href="/favorites"
            className={cn(
              itemClass,
              favoritesActive ? 'text-(--color-brand)' : 'text-(--color-ink)',
            )}
            aria-current={favoritesActive ? 'page' : undefined}
            onClick={closePanels}
          >
            <Heart className="size-6" aria-hidden />
            {t('nav.favorites')}
          </Link>
        </li>
        <li className="flex flex-1">
          <button
            type="button"
            className={cn(itemClass, accountOpen ? 'text-(--color-brand)' : 'text-(--color-ink)')}
            aria-expanded={accountOpen}
            aria-controls="account-sidebar"
            onClick={() => {
              closeCart();
              openAccount();
            }}
          >
            <User01 className="size-6" aria-hidden />
            {t('nav.account')}
          </button>
        </li>
      </ul>
    </nav>
  );
}
