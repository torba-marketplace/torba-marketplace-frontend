'use client';

import { Heart, ShieldTick, ShoppingCart01 } from '@untitledui/icons';
import Image from 'next/image';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';

import type { HomeProduct } from '@/types/home';
import { Button } from '@/components/ui/Button';
import { formatMoney } from '@/lib/format-money';
import { localized } from '@/lib/localized';

type ProductCardProps = {
  product: HomeProduct;
  titleVariant?: 'default' | 'catalog';
};

export function ProductCard({ product, titleVariant = 'default' }: ProductCardProps) {
  const { t, i18n } = useTranslation();
  const locale = i18n.language === 'en' ? 'en-US' : 'uk-UA';
  const inStock = product.availability.uk === 'В наявності';

  return (
    <article className="flex h-full w-full flex-col gap-[13px]">
      <div className="relative h-52 overflow-hidden rounded-xl sm:h-44 sm:rounded-2xl">
        {product.imageUrl ? (
          <Image
            src={product.imageUrl}
            alt={product.title}
            fill
            className="object-cover object-center"
            sizes="(max-width: 640px) 50vw, 25vw"
          />
        ) : null}

        {product.badge ? (
          <span
            className={
              product.badge === 'trend'
                ? 'absolute top-2 left-2 z-10 max-w-[75%] rounded-md bg-(--color-red-500) px-2 py-0.5 text-[11px] leading-4 font-medium text-white'
                : product.badge === 'recommended'
                  ? 'absolute top-2 left-2 z-10 max-w-[75%] rounded-md bg-(--color-accent-green) px-2 py-0.5 text-[11px] leading-4 font-medium text-white'
                  : 'absolute top-2 left-2 z-10 rounded-md bg-white px-2 py-0.5 text-xs font-medium text-(--color-ink)'
            }
          >
            {product.badge === 'trend'
              ? t('pages.catalog.badgeTrend')
              : product.badge === 'recommended'
                ? t('pages.catalog.badgeRecommended')
                : t('pages.home.badgeNew')}
          </span>
        ) : null}

        <button
          type="button"
          aria-label={t('nav.favorites')}
          className="absolute top-2 right-2 z-10 flex size-8 items-center justify-center rounded-lg bg-white/90 text-(--color-ink) shadow-sm"
        >
          <Heart className="size-4" aria-hidden />
        </button>
      </div>

      <div className="flex flex-1 flex-col gap-1.5">
        <div className="flex items-center justify-between gap-2">
          <p className="min-w-0 truncate text-xs text-(--color-muted)">
            {localized(product.categoryName, i18n.language)}
          </p>
          <p
            className={
              inStock
                ? 'shrink-0 text-xs font-semibold text-(--color-accent-green)'
                : 'shrink-0 text-xs text-(--color-muted)'
            }
          >
            {localized(product.availability, i18n.language)}
          </p>
        </div>

        <Link
          href={`/product/${product.id}`}
          className={
            titleVariant === 'catalog'
              ? 'block min-w-0 truncate font-[family-name:var(--font-family)] text-[16px] leading-[1.5] font-normal text-(--color-dark-900)'
              : 'block min-w-0 truncate text-sm font-semibold text-(--color-ink) hover:text-(--color-brand)'
          }
        >
          {product.title}
        </Link>

        <div className="mt-auto grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-2 gap-y-0.5">
          <div className="flex min-w-0 flex-col gap-0.5 sm:flex-row sm:items-baseline sm:gap-1.5">
            <span
              className={
                titleVariant === 'catalog'
                  ? 'shrink-0 font-[family-name:var(--font-family)] text-[16px] leading-[1.5] font-medium text-(--color-dark-900)'
                  : 'shrink-0 text-sm font-semibold text-(--color-ink) sm:text-md'
              }
            >
              {formatMoney(product.price, locale)}
            </span>
            {product.oldPrice ? (
              <span className="min-w-0 truncate font-[family-name:var(--font-family)] text-[12px] leading-[1.5] font-normal text-(--color-dark-400) line-through">
                {formatMoney(product.oldPrice, locale)}
              </span>
            ) : (
              <span className="invisible text-xs sm:hidden" aria-hidden>
                &nbsp;
              </span>
            )}
          </div>
          <Button
            hierarchy="primary"
            size="sm"
            iconOnly
            aria-label={t('nav.cart')}
            className="col-start-2 row-span-2 row-start-1 size-8 shrink-0 rounded-lg sm:size-9"
          >
            <ShoppingCart01 aria-hidden />
          </Button>
          <p className="inline-flex min-w-0 items-center gap-1 font-[family-name:var(--font-family)] text-[12px] leading-[1.5] font-normal text-(--color-dark-600)">
            <ShieldTick className="size-4 shrink-0" aria-hidden />
            <span className="truncate">{product.sellerName}</span>
          </p>
        </div>
      </div>
    </article>
  );
}
