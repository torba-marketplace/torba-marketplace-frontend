'use client';

import { ChevronDown, Globe01, Mail01 } from '@untitledui/icons';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useRef, useState, useSyncExternalStore, type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';

import { Container } from '@/components/ui/Container';
import { Logo } from '@/components/ui/Logo';
import { isAppLocale } from '@/i18n/config';
import { siteConfig, type AppLocale } from '@/config/site';
import { cn } from '@/lib/cn';

const SOCIAL_ICON_SIZE = 18;

const languageName: Record<AppLocale, string> = {
  uk: 'Українська',
  en: 'English',
};

const columns = [
  {
    title: 'footer.forYou',
    links: [
      { label: 'footer.categories', href: '/catalog' },
      { label: 'footer.new', href: '/new' },
      { label: 'footer.trends', href: '/trends' },
      { label: 'footer.recommended', href: '/recommended' },
    ],
  },
  {
    title: 'footer.useful',
    links: [
      { label: 'footer.about', href: '/about' },
      { label: 'footer.payments', href: '/payments' },
      { label: 'footer.warranty', href: '/warranty' },
    ],
  },
  {
    title: 'footer.help',
    links: [
      { label: 'footer.faq', href: '/faq' },
      { label: 'footer.delivery', href: '/delivery' },
      { label: 'footer.contacts', href: '/contacts' },
    ],
  },
] as const;

const legalLinks = [
  { label: 'footer.privacy', href: '/privacy' },
  { label: 'footer.terms', href: '/terms' },
] as const;

function useCopyrightYear() {
  return useSyncExternalStore(
    () => () => {},
    () => new Date().getFullYear(),
    () => null,
  );
}

export function Footer() {
  const { t } = useTranslation();
  const year = useCopyrightYear();

  return (
    <footer className="mt-auto border-t border-(--color-border) bg-(--color-canvas)">
      <Container className="flex flex-col gap-10 pt-12 pb-6">
        <div className="grid gap-10 lg:grid-cols-[minmax(14rem,17rem)_repeat(3,minmax(0,1fr))] lg:gap-16">
          <div className="min-w-0">
            <Logo />
            <p className="mt-4 max-w-68 text-sm leading-5 text-(--color-muted)">
              {t('footer.tagline')}
            </p>
            <div className="mt-6 flex items-center gap-4 text-(--color-ink)">
              <SocialLink href={siteConfig.links.instagram} label={t('footer.instagram')}>
                <InstagramIcon />
              </SocialLink>
              <SocialLink href={siteConfig.links.facebook} label={t('footer.facebook')}>
                <Image
                  src="/icons/FacebookIcon.svg"
                  alt=""
                  width={SOCIAL_ICON_SIZE}
                  height={SOCIAL_ICON_SIZE}
                  className="size-[18px]"
                  unoptimized
                  aria-hidden
                />
              </SocialLink>
              <SocialLink href={siteConfig.links.email} label={t('footer.email')}>
                <Mail01 className="size-[18px]" aria-hidden />
              </SocialLink>
            </div>
          </div>

          {columns.map((column) => (
            <div key={column.title} className="min-w-0">
              <h2 className="text-sm font-semibold text-(--color-ink)">{t(column.title)}</h2>
              <ul className="mt-4 space-y-3">
                {column.links.map((item) => (
                  <li key={item.label}>
                    <Link
                      href={item.href}
                      className="text-sm text-(--color-muted) transition-colors hover:text-(--color-ink)"
                    >
                      {t(item.label)}
                    </Link>
                  </li>
                ))}
              </ul>
              {column.title === 'footer.help' ? <FooterLanguage /> : null}
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-3 border-t border-(--color-border) pt-6 text-sm text-(--color-muted) sm:flex-row sm:items-center sm:justify-between">
          <p>
            ©{year === null ? '' : ` ${year}`} {t('brand.name')}. {t('footer.rights')}
          </p>
          <div className="flex flex-wrap items-center gap-x-8 gap-y-2">
            {legalLinks.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="transition-colors hover:text-(--color-ink)"
              >
                {t(item.label)}
              </Link>
            ))}
          </div>
        </div>
      </Container>
    </footer>
  );
}

function FooterLanguage() {
  const { i18n, t } = useTranslation();
  const rootRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const current: AppLocale = isAppLocale(i18n.language) ? i18n.language : siteConfig.defaultLocale;

  useEffect(() => {
    if (!open) {
      return;
    }

    const onPointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener('pointerdown', onPointerDown);
    return () => document.removeEventListener('pointerdown', onPointerDown);
  }, [open]);

  return (
    <div ref={rootRef} className="relative mt-4">
      <button
        type="button"
        className="inline-flex items-center gap-2 text-sm text-(--color-ink)"
        aria-expanded={open}
        aria-haspopup="listbox"
        onClick={() => setOpen((value) => !value)}
      >
        <Globe01 className="size-4" aria-hidden />
        {t('footer.region')}
        <ChevronDown
          className={cn('size-4 text-(--color-muted)', open && 'rotate-180')}
          aria-hidden
        />
      </button>
      {open ? (
        <ul
          role="listbox"
          aria-label={t('footer.region')}
          className="absolute bottom-full left-0 z-10 mb-2 min-w-40 rounded-lg border border-(--color-border) bg-(--color-surface) p-1 shadow-lg"
        >
          {siteConfig.locales.map((locale) => (
            <li key={locale}>
              <button
                type="button"
                role="option"
                aria-selected={locale === current}
                className={cn(
                  'flex w-full rounded-md px-3 py-2 text-left text-sm',
                  locale === current
                    ? 'bg-(--color-brand-muted) text-(--color-brand)'
                    : 'hover:bg-(--color-surface-muted)',
                )}
                onClick={() => {
                  void i18n.changeLanguage(locale);
                  setOpen(false);
                }}
              >
                {languageName[locale]}
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}

function SocialLink({
  href,
  label,
  children,
}: {
  href: string;
  label: string;
  children: ReactNode;
}) {
  const external = href.startsWith('http');

  return (
    <a
      href={href}
      aria-label={label}
      className="transition-colors hover:text-(--color-brand)"
      {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
    >
      {children}
    </a>
  );
}

function InstagramIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="size-[18px]"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      aria-hidden
    >
      <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.2" cy="6.8" r="0.8" fill="currentColor" stroke="none" />
    </svg>
  );
}
