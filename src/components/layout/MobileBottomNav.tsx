'use client';

import { Heart, LayoutGrid01, User01 } from '@untitledui/icons';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { MegaMenu } from '@/components/layout/MegaMenu';
import { Container } from '@/components/ui/Container';
import { cn } from '@/lib/cn';

export function MobileBottomNav() {
  const { t } = useTranslation();
  const rootRef = useRef<HTMLDivElement>(null);
  const [catalogOpen, setCatalogOpen] = useState(false);

  useEffect(() => {
    if (!catalogOpen) {
      return;
    }

    const onPointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setCatalogOpen(false);
      }
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setCatalogOpen(false);
      }
    };

    document.addEventListener('pointerdown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('pointerdown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [catalogOpen]);

  return (
    <div ref={rootRef} className="md:hidden">
      {catalogOpen ? (
        <div
          id="mobile-catalog-menu"
          className="fixed inset-x-0 top-14 bottom-16 z-40 overflow-y-auto border-y border-(--color-border) bg-(--color-surface)"
        >
          <Container className="py-2">
            <MegaMenu onNavigate={() => setCatalogOpen(false)} />
          </Container>
        </div>
      ) : null}

      <nav
        className="fixed inset-x-0 bottom-0 z-40 border-t border-(--color-border) bg-(--color-surface)"
        aria-label={t('nav.catalog')}
      >
        <ul className="mx-auto flex h-16 max-w-7xl items-stretch px-2">
          <li className="flex flex-1">
            <button
              type="button"
              className={cn(
                'flex flex-1 flex-col items-center justify-center gap-1 text-xs font-medium transition-colors',
                catalogOpen ? 'text-(--color-brand)' : 'text-(--color-ink)',
              )}
              aria-expanded={catalogOpen}
              aria-controls="mobile-catalog-menu"
              onClick={() => setCatalogOpen((open) => !open)}
            >
              <LayoutGrid01 className="size-5" aria-hidden />
              {t('nav.catalog')}
            </button>
          </li>
          <li className="flex flex-1">
            <button
              type="button"
              className="flex flex-1 flex-col items-center justify-center gap-1 text-xs font-medium text-(--color-ink)"
            >
              <Heart className="size-5" aria-hidden />
              {t('nav.favorites')}
            </button>
          </li>
          <li className="flex flex-1">
            <button
              type="button"
              className="flex flex-1 flex-col items-center justify-center gap-1 text-xs font-medium text-(--color-ink)"
            >
              <User01 className="size-5" aria-hidden />
              {t('nav.account')}
            </button>
          </li>
        </ul>
      </nav>
    </div>
  );
}
