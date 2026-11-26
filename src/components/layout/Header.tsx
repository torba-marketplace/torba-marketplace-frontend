'use client';

import {
  ChevronDown,
  Heart,
  LayoutGrid01,
  MarkerPin01,
  SearchMd,
  ShoppingBag01,
  User01,
} from '@untitledui/icons';
import {
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
  type ReactNode,
  type RefObject,
} from 'react';
import { useTranslation } from 'react-i18next';

import { CategoryMenu } from '@/components/layout/CategoryMenu';
import { LocationMenu } from '@/components/layout/LocationMenu';
import { MegaMenu } from '@/components/layout/MegaMenu';
import { Container } from '@/components/ui/Container';
import { Input } from '@/components/ui/Input';
import { Logo } from '@/components/ui/Logo';
import { featuredCategories } from '@/config/categories';
import { defaultLocationId, findLocation } from '@/config/locations';
import { useAccountPanel } from '@/lib/account-panel';
import { useCart } from '@/lib/cart-store';
import { countForm } from '@/lib/cart-summary';
import { cn } from '@/lib/cn';
import { localized } from '@/lib/localized';

type HeaderPanel = 'categories' | 'location' | null;

function isApplePlatform() {
  return /Mac|iPhone|iPad|iPod/.test(navigator.platform) || navigator.userAgent.includes('Mac');
}

function useIsApplePlatform() {
  return useSyncExternalStore(
    () => () => {},
    isApplePlatform,
    () => false,
  );
}

function subscribeMdUp(onStoreChange: () => void) {
  const media = window.matchMedia('(min-width: 768px)');
  media.addEventListener('change', onStoreChange);
  return () => media.removeEventListener('change', onStoreChange);
}

function useIsMdUp() {
  return useSyncExternalStore(
    subscribeMdUp,
    () => window.matchMedia('(min-width: 768px)').matches,
    () => true,
  );
}

function focusVisibleSearch(
  desktopRef: RefObject<HTMLInputElement | null>,
  mobileRef: RefObject<HTMLInputElement | null>,
) {
  const desktop = desktopRef.current;
  const mobile = mobileRef.current;

  if (desktop && desktop.getClientRects().length > 0) {
    desktop.focus();
    return;
  }

  mobile?.focus();
}

export function Header() {
  const { t, i18n } = useTranslation();
  const { isOpen: cartOpen, items, openCart, closeCart } = useCart();
  const { isOpen: accountOpen, openAccount, closeAccount } = useAccountPanel();
  const cartCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const cartAriaLabel =
    cartCount > 0
      ? `${t('nav.cart')}, ${t(`cart.count.${countForm(cartCount)}`, { count: cartCount })}`
      : t('nav.cart');
  const rootRef = useRef<HTMLElement>(null);
  const desktopSearchRef = useRef<HTMLInputElement>(null);
  const mobileSearchRef = useRef<HTMLInputElement>(null);
  const [openPanel, setOpenPanel] = useState<HeaderPanel>(null);
  const [categorySlug, setCategorySlug] = useState<string | null>(null);
  // TODO: lift selected city into shared context/store + localStorage so catalog
  // location filters (and other pages) stay in sync across reloads and routes.
  const [locationId, setLocationId] = useState(defaultLocationId);
  const isApple = useIsApplePlatform();
  const isMdUp = useIsMdUp();

  const location = findLocation(locationId);
  const locationLabel = localized(location.city, i18n.language);
  const categoriesOpen = openPanel === 'categories';
  const locationOpen = openPanel === 'location';
  const menuOpen = openPanel !== null || categorySlug !== null;
  const locationAriaLabel = `${t('nav.location')}: ${locationLabel}`;
  const showMobileLocationMenu = locationOpen && !isMdUp;
  const showDesktopLocationMenu = locationOpen && isMdUp;

  const selectLocation = (id: string) => {
    setLocationId(id);
    setOpenPanel(null);
  };

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const key = typeof event.key === 'string' ? event.key.toLowerCase() : '';

      if (key !== 'k' || event.altKey || !(event.metaKey || event.ctrlKey)) {
        return;
      }

      event.preventDefault();
      focusVisibleSearch(desktopSearchRef, mobileSearchRef);
    };

    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, []);

  useEffect(() => {
    if (!menuOpen) {
      return;
    }

    const close = () => {
      setOpenPanel(null);
      setCategorySlug(null);
    };

    const onPointerDown = (event: PointerEvent) => {
      if (rootRef.current?.contains(event.target as Node)) {
        return;
      }
      close();
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        close();
      }
    };

    document.addEventListener('pointerdown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('pointerdown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [menuOpen]);

  const togglePanel = (panel: Exclude<HeaderPanel, null>) => {
    setCategorySlug(null);
    setOpenPanel((current) => (current === panel ? null : panel));
  };

  const toggleCategory = (slug: string) => {
    setOpenPanel(null);
    setCategorySlug((current) => (current === slug ? null : slug));
  };

  return (
    <header
      ref={rootRef}
      className="sticky top-0 z-40 overflow-x-clip border-b border-(--color-border) bg-(--color-surface)"
    >
      <Container className="md:hidden">
        <div className="relative flex h-14 items-center gap-2">
          <Logo variant="mark" priority />
          <Input
            ref={mobileSearchRef}
            variant="search"
            size="sm"
            type="search"
            iconLeading={<SearchMd aria-hidden />}
            placeholder={t('nav.searchPlaceholder')}
            aria-label={t('nav.searchPlaceholder')}
            className="min-w-0 flex-1"
          />
          <button
            type="button"
            className={cn(
              'inline-flex size-10 shrink-0 items-center justify-center rounded-lg transition-colors',
              locationOpen
                ? 'text-(--color-brand)'
                : 'text-(--color-dark-900) hover:bg-(--color-surface-muted)',
            )}
            aria-expanded={locationOpen}
            aria-controls="header-location-menu"
            aria-label={locationAriaLabel}
            onClick={() => togglePanel('location')}
          >
            <MarkerPin01 className="size-5" aria-hidden />
          </button>
          <button
            type="button"
            className="inline-flex size-10 shrink-0 items-center justify-center rounded-lg border border-(--color-border) text-(--color-ink)"
            aria-label={cartAriaLabel}
            aria-expanded={cartOpen}
            aria-controls="cart-sidebar"
            onClick={openCart}
          >
            <CartGlyph count={cartCount} />
          </button>
          {showMobileLocationMenu ? (
            <LocationMenu
              selectedId={locationId}
              onSelect={selectLocation}
              className="left-0 right-0 w-full max-w-none"
            />
          ) : null}
        </div>
      </Container>

      <Container className="hidden h-20 items-center gap-4 md:flex lg:gap-7">
        <Logo priority />

        <Input
          ref={desktopSearchRef}
          variant="search"
          size="md"
          type="search"
          iconLeading={<SearchMd aria-hidden />}
          trailing={<SearchShortcut isApple={isApple} />}
          placeholder={t('nav.searchPlaceholder')}
          aria-label={t('nav.searchPlaceholder')}
          aria-keyshortcuts={isApple ? 'Meta+K' : 'Control+K'}
          className="min-w-0 flex-1"
        />

        <div className="ml-auto flex items-center gap-4">
          <HeaderAction
            icon={<Heart className="size-5" aria-hidden />}
            label={t('nav.favorites')}
          />
          <HeaderAction
            icon={<CartGlyph count={cartCount} />}
            label={t('nav.cart')}
            ariaLabel={cartAriaLabel}
            expanded={cartOpen}
            controlsId="cart-sidebar"
            onClick={() => {
              closeAccount();
              openCart();
            }}
          />
          <HeaderAction
            icon={<User01 className="size-5" aria-hidden />}
            label={t('nav.account')}
            expanded={accountOpen}
            controlsId="account-sidebar"
            onClick={() => {
              closeCart();
              openAccount();
            }}
          />
        </div>
      </Container>

      <div className="relative hidden border-t border-(--color-border) md:block">
        <Container className="flex h-11 items-center gap-5">
          <button
            type="button"
            className={cn(
              'inline-flex h-11 shrink-0 items-center gap-2 text-[13px] leading-5 font-semibold transition-colors',
              categoriesOpen ? 'text-(--color-brand)' : 'text-dark-800 hover:text-(--color-brand)',
            )}
            aria-expanded={categoriesOpen}
            aria-controls="header-mega-menu"
            onClick={() => togglePanel('categories')}
          >
            <LayoutGrid01 className="size-4 shrink-0" aria-hidden />
            {t('nav.allCategories')}
          </button>

          <nav
            className="hidden min-w-0 flex-1 items-center gap-5 self-stretch lg:flex"
            aria-label={t('nav.catalog')}
          >
            {featuredCategories().map((category) => {
              const open = categorySlug === category.slug;
              return (
                <div key={category.slug} className="relative flex h-full shrink-0 items-center">
                  <button
                    type="button"
                    className={cn(
                      'inline-flex h-11 items-center text-sm leading-5 font-normal transition-colors',
                      open ? 'text-(--color-brand)' : 'text-dark-900 hover:text-(--color-brand)',
                    )}
                    aria-expanded={open}
                    aria-controls={`header-category-${category.slug}`}
                    onClick={() => toggleCategory(category.slug)}
                  >
                    {localized(category.name, i18n.language)}
                  </button>
                  {open ? (
                    <CategoryMenu category={category} onNavigate={() => setCategorySlug(null)} />
                  ) : null}
                </div>
              );
            })}
          </nav>

          <div className="relative ml-auto flex h-11 shrink-0 items-center">
            <button
              type="button"
              className={cn(
                'inline-flex h-11 items-center gap-1.5 text-xs leading-5 font-normal transition-colors',
                locationOpen ? 'text-(--color-brand)' : 'text-dark-600 hover:text-(--color-brand)',
              )}
              aria-expanded={locationOpen}
              aria-controls="header-location-menu"
              aria-label={locationAriaLabel}
              onClick={() => togglePanel('location')}
            >
              <MarkerPin01 className="size-4 shrink-0" aria-hidden />
              {locationLabel}
              <ChevronDown className="size-3.5 shrink-0" aria-hidden />
            </button>
            {showDesktopLocationMenu ? (
              <LocationMenu selectedId={locationId} onSelect={selectLocation} />
            ) : null}
          </div>
        </Container>

        {categoriesOpen ? (
          <div className="absolute inset-x-0 top-full z-50 border-b border-(--color-border) bg-(--color-surface) shadow-lg">
            <Container>
              <MegaMenu onNavigate={() => setOpenPanel(null)} />
            </Container>
          </div>
        ) : null}
      </div>
    </header>
  );
}

function SearchShortcut({ isApple }: { isApple: boolean }) {
  return (
    <span
      aria-hidden
      className="header-search-shortcut pointer-events-none inline-flex items-center gap-0.5 font-sans font-medium text-(--color-muted)"
    >
      <span className="inline-flex items-center justify-center text-[12px]/none">
        {isApple ? '⌘' : 'Ctrl'}
      </span>
      <span className="inline-flex size-4 items-center justify-center text-[14px]/none">K</span>
    </span>
  );
}

function CartGlyph({ count }: { count: number }) {
  const label = count > 99 ? '99+' : String(count);

  return (
    <span className="relative inline-flex">
      <ShoppingBag01 className="size-5" aria-hidden />
      {count > 0 ? (
        <span
          aria-hidden
          className="absolute -top-1.5 -right-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-(--color-brand) px-1 text-[10px] leading-none font-semibold text-white ring-2 ring-(--color-surface)"
        >
          {label}
        </span>
      ) : null}
    </span>
  );
}

function HeaderAction({
  icon,
  label,
  ariaLabel,
  onClick,
  expanded,
  controlsId,
}: {
  icon: ReactNode;
  label: string;
  ariaLabel?: string;
  onClick?: () => void;
  expanded?: boolean;
  controlsId?: string;
}) {
  return (
    <button
      type="button"
      className="inline-flex w-14 flex-col items-center gap-1 text-(--color-ink)"
      aria-label={ariaLabel}
      aria-expanded={expanded}
      aria-controls={controlsId}
      onClick={onClick}
    >
      {icon}
      <span className="text-xs font-medium">{label}</span>
    </button>
  );
}
