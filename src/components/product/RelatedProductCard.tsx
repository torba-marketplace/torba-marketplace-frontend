'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Button } from '@/components/ui/Button';
import { ProductIcon } from '@/components/product/ProductIcon';
import { figmaMoney, type RelatedCard } from '@/data/product-page';
import { localized } from '@/lib/localized';
import { cn } from '@/lib/cn';

type RelatedProductCardProps = {
  product: RelatedCard;
};

const badgeClass = {
  new: 'bg-white text-(--color-dark-900)',
  trend: 'gap-0.5 bg-(--color-red-200) text-(--color-red-600)',
  recommended: 'gap-1 bg-(--color-primary-200) text-(--color-primary-700)',
} as const;

export function RelatedProductCard({ product }: RelatedProductCardProps) {
  const { t, i18n } = useTranslation();
  const [saved, setSaved] = useState(false);

  return (
    <article className="flex h-full flex-col gap-[13px]">
      <div className="relative h-[254px] overflow-hidden rounded-xl">
        <Image
          src={product.imageUrl}
          alt={product.title}
          fill
          className="object-cover"
          sizes="(min-width: 1280px) 243px, 50vw"
        />
        {product.badge ? (
          <span
            className={cn(
              'absolute top-[15.5px] left-3 inline-flex items-center rounded-md px-2.5 py-1.5 text-xs leading-[18px] font-semibold shadow-[0px_0px_5.8px_0px_rgba(0,0,0,0.06)]',
              badgeClass[product.badge],
            )}
          >
            {product.badge === 'trend' ? (
              <ProductIcon src="/image/product/fire.svg" width={16} height={16} />
            ) : null}
            {product.badge === 'recommended' ? (
              <ProductIcon src="/image/product/brand-dot.svg" width={5} height={5} />
            ) : null}
            {t(`pages.product.badge.${product.badge}`)}
          </span>
        ) : null}
        <button
          type="button"
          aria-pressed={saved}
          aria-label={t('nav.favorites')}
          onClick={() => setSaved((value) => !value)}
          className="absolute top-3 right-3 flex size-8 items-center justify-center rounded-full bg-white shadow-[0px_0px_5.8px_0px_rgba(0,0,0,0.06)]"
        >
          <ProductIcon src="/image/product/heart-card.svg" width={18} height={18} />
        </button>
      </div>

      <div className="flex flex-col gap-1.5">
        <div className="flex items-start justify-between gap-2 text-xs leading-[18px] font-semibold">
          <p className="max-w-[100px] truncate text-(--color-dark-600)">
            {localized(product.category, i18n.language)}
          </p>
          <p
            className={cn(
              'shrink-0 text-right',
              product.inStock ? 'text-(--color-accent-green)' : 'text-(--color-dark-600)',
            )}
          >
            {localized(product.availability, i18n.language)}
          </p>
        </div>
        <Link
          href={`/product/${product.id}`}
          className="truncate text-md leading-6 font-normal text-(--color-dark-900)"
        >
          {product.title}
        </Link>
        <div className="flex items-end justify-between gap-2">
          <div className="flex min-w-0 flex-col gap-1.5">
            <p className="flex flex-wrap items-center gap-2">
              <span className="text-md leading-6 font-medium text-(--color-dark-900)">
                {figmaMoney(product.price.amount)}
              </span>
              {product.oldPrice ? (
                <span className="text-xs leading-[18px] text-(--color-dark-400)">
                  {figmaMoney(product.oldPrice.amount)}
                </span>
              ) : null}
            </p>
            <p className="inline-flex min-w-0 items-center gap-1 text-xs leading-[18px] text-(--color-dark-600)">
              <ProductIcon src="/image/product/shield-seller.svg" width={15} height={15} />
              <span className="truncate">{product.sellerName}</span>
            </p>
          </div>
          <Button
            hierarchy="primary"
            size="sm"
            iconOnly
            aria-label={t('nav.cart')}
            className="shrink-0"
          >
            <ProductIcon src="/image/product/cart.svg" width={20} height={20} />
          </Button>
        </div>
      </div>
    </article>
  );
}
