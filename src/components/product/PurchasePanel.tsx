'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';

import { ProductHeart } from '@/components/product/ProductHeart';
import { ProductIcon } from '@/components/product/ProductIcon';
import {
  discountPercent,
  figmaMoney,
  type ProductDetail,
} from '@/data/product-page';
import { catalogCategories } from '@/config/categories';
import { catalogHref } from '@/lib/catalog-query';
import { localized } from '@/lib/localized';
import { useShopFlag } from '@/lib/shop-lists';
import { cn } from '@/lib/cn';

type PurchasePanelProps = {
  product: ProductDetail;
};

const focusClass =
  'outline-none focus-visible:ring-2 focus-visible:ring-(--color-brand)/40';

export function PurchasePanel({ product }: PurchasePanelProps) {
  const { t, i18n } = useTranslation();
  const [saved, toggleSaved] = useShopFlag('favorites', product.id);
  const [inCart, toggleCart] = useShopFlag('cart', product.id);
  const locale = i18n.language;
  const knownCategory = catalogCategories.some((item) => item.slug === product.categorySlug);
  const sellerHref = catalogHref({
    category: knownCategory ? product.categorySlug : null,
    sub: null,
    min: null,
    max: null,
    sellers: product.seller.id ? [product.seller.id] : [],
    delivery: [],
    page: 1,
    sort: 'recommended',
  });

  return (
    <div className="flex min-w-0 flex-1 flex-col gap-4 xl:gap-[22px]">
      <div className="flex flex-col gap-3">
        <p className="text-sm leading-5 text-(--color-dark-600)">{product.brand}</p>
        <h1 className="text-2xl leading-8 font-semibold text-(--color-dark-800) xl:text-[30px] xl:leading-[38px]">
          {localized(product.title, locale)}
        </h1>
        {product.variant ? (
          <p className="text-sm leading-5 text-(--color-dark-600)">
            {localized(product.variant, locale)}
          </p>
        ) : null}
        <div className="flex flex-wrap items-center gap-3">
          <span
            className={cn(
              'rounded-md px-[9px] py-[5px] text-xs leading-[18px] font-semibold',
              product.inStock
                ? 'bg-[#edf4ee] text-(--color-accent-green)'
                : 'bg-(--color-dark-100) text-(--color-dark-600)',
            )}
          >
            {localized(product.availability, locale)}
          </span>
          {product.deliveryPromise ? (
            <p className="text-xs text-(--color-dark-600)">
              {localized(product.deliveryPromise.prefix, locale)}
              <span className="font-bold">
                {localized(product.deliveryPromise.emphasis, locale)}
              </span>
              {localized(product.deliveryPromise.suffix, locale)}
            </p>
          ) : null}
        </div>
      </div>

      <div className="flex flex-col gap-2 xl:gap-3">
        <p className="text-2xl leading-8 font-semibold text-(--color-dark-800) xl:text-[30px] xl:leading-[38px]">
          {figmaMoney(product.price.amount)}
        </p>
        {product.oldPrice ? (
          <div className="flex items-center gap-3">
            <p className="text-md leading-6 text-(--color-dark-400) line-through xl:text-[17px] xl:leading-none">
              {figmaMoney(product.oldPrice.amount)}
            </p>
            <p className="text-[11px] leading-none text-(--color-accent-green)">
              {t('pages.product.discount', {
                percent: discountPercent(product.price, product.oldPrice),
              })}
            </p>
          </div>
        ) : null}
      </div>

      <div className="flex flex-col items-stretch gap-2 xl:flex-row xl:items-start xl:gap-3">
        <Link
          href={`/checkout?product=${product.id}`}
          className={cn(
            'inline-flex h-11 w-full items-center justify-center rounded-lg border border-(--color-primary-700) bg-(--color-primary-700) px-[18px] text-md leading-6 font-semibold text-white hover:bg-(--color-primary-800) xl:flex-1',
            focusClass,
          )}
        >
          {t('pages.product.buyNow')}
        </Link>
        <button
          type="button"
          aria-pressed={inCart}
          onClick={toggleCart}
          className={cn(
            'inline-flex h-11 w-full items-center justify-center gap-2 rounded-lg border border-(--color-dark-300) bg-(--color-primary-100) px-[18px] text-md leading-6 font-semibold text-(--color-primary-700) xl:flex-1',
            focusClass,
          )}
        >
          <ProductIcon src="/icons/Shopping_Bag_01.svg" width={20} height={20} />
          {inCart ? t('pages.product.addedToCart') : t('pages.product.addToCart')}
        </button>
        <button
          type="button"
          aria-pressed={saved}
          aria-label={t('nav.favorites')}
          onClick={toggleSaved}
          className={cn(
            'hidden size-11 shrink-0 items-center justify-center rounded-lg xl:inline-flex',
            saved ? 'bg-(--color-primary-100)' : 'bg-white',
            focusClass,
          )}
        >
          <ProductHeart saved={saved} color="#2459DF" />
        </button>
      </div>

      {product.delivery || product.pickup ? (
        <div className="flex flex-col gap-[18px] border-y border-(--color-dark-150) py-[19px]">
          {product.delivery ? (
            <div className="flex items-center gap-3">
              <ProductIcon src="/image/product/nova-poshta.png" width={20} height={20} />
              <div className="flex flex-col gap-[5px]">
                <p className="text-sm leading-5 font-semibold text-(--color-dark-800)">
                  {t('pages.product.delivery')}
                </p>
                <p className="text-xs text-(--color-dark-600)">
                  <span className="font-bold">{localized(product.delivery.free, locale)}</span>
                  {localized(product.delivery.details, locale)}
                </p>
                <Link
                  href="/delivery"
                  className="hidden text-xs leading-normal font-semibold text-(--color-primary-700) xl:inline"
                >
                  {t('pages.product.deliveryTerms')}
                </Link>
              </div>
            </div>
          ) : null}
          {product.pickup ? (
            <div className="flex items-center gap-3">
              <ProductIcon src="/icons/map-pin.svg" width={20} height={20} />
              <div className="flex flex-col gap-[5px]">
                <p className="text-sm leading-5 font-semibold text-(--color-dark-800)">
                  {t('pages.product.pickup')}
                </p>
                <p className="text-xs text-(--color-dark-600)">
                  {localized(product.pickup, locale)}
                </p>
                <Link
                  href="/delivery"
                  className="hidden text-xs leading-normal font-semibold text-(--color-primary-700) xl:inline"
                >
                  {t('pages.product.deliveryTerms')}
                </Link>
              </div>
            </div>
          ) : null}
        </div>
      ) : null}

      <div className="flex flex-col gap-4 rounded-xl border border-(--color-dark-150) p-4 xl:p-[22px]">
        <div className="flex items-center gap-3">
          {product.seller.avatarUrl ? (
            <Image
              src={product.seller.avatarUrl}
              alt=""
              width={48}
              height={48}
              className="size-9 rounded-full object-cover xl:size-12"
            />
          ) : (
            <span className="size-9 rounded-full bg-(--color-dark-100) xl:size-12" />
          )}
          <div className="flex min-w-0 flex-col gap-1.5">
            <p className="flex items-center gap-1.5 text-sm leading-5 text-(--color-dark-800) xl:text-md xl:leading-6">
              {product.seller.name}
              {product.seller.verified ? (
                <ProductIcon src="/icons/badge-check.svg" width={16} height={16} />
              ) : null}
            </p>
            {product.seller.meta ? (
              <p className="text-xs text-(--color-dark-600)">
                {localized(product.seller.meta, locale)}
              </p>
            ) : null}
          </div>
        </div>
        {product.seller.sold || product.seller.dispatch ? (
          <p className="flex flex-wrap gap-2.5 text-[11px] text-(--color-dark-600)">
            {product.seller.sold ? <span>{localized(product.seller.sold, locale)}</span> : null}
            {product.seller.dispatch ? (
              <span>{localized(product.seller.dispatch, locale)}</span>
            ) : null}
          </p>
        ) : null}
        <Link
          href={sellerHref}
          className="inline-flex items-center gap-2 text-sm leading-5 font-semibold text-(--color-primary-700)"
        >
          {t('pages.product.sellerItems')}
          <ProductIcon src="/icons/Arrow_Right_SM.svg" width={20} height={20} />
        </Link>
      </div>
    </div>
  );
}
