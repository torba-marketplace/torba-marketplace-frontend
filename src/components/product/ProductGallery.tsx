'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { useTranslation } from 'react-i18next';

import { ProductIcon } from '@/components/product/ProductIcon';
import { localized } from '@/lib/localized';
import { cn } from '@/lib/cn';
import type { ProductDetail } from '@/data/product-page';

type ProductGalleryProps = {
  product: ProductDetail;
};

const badgeClass = {
  new: 'bg-white text-(--color-dark-900)',
  trend: 'bg-(--color-red-200) text-(--color-red-600)',
  recommended: 'bg-(--color-primary-200) text-(--color-primary-700)',
} as const;

export function ProductGallery({ product }: ProductGalleryProps) {
  const { t, i18n } = useTranslation();
  const [index, setIndex] = useState(0);
  const [expanded, setExpanded] = useState(false);
  const title = localized(product.title, i18n.language);
  const image = product.images[index] ?? product.images[0];
  const count = product.images.length;

  function show(next: number) {
    if (count === 0) {
      return;
    }

    setIndex((next + count) % count);
  }

  useEffect(() => {
    if (!expanded) {
      return;
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setExpanded(false);
      }

      if (event.key === 'ArrowLeft') {
        show(index - 1);
      }

      if (event.key === 'ArrowRight') {
        show(index + 1);
      }
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [expanded, index, count]);

  return (
    <div className="flex w-full flex-col gap-4 xl:w-[752px] xl:shrink-0">
      <div className="relative aspect-[752/568] overflow-hidden rounded-2xl bg-(--color-dark-100) xl:h-[568px] xl:aspect-auto">
        {image ? (
          <Image
            src={image}
            alt={title}
            fill
            priority
            className="object-cover"
            sizes="(min-width: 1280px) 752px, 100vw"
          />
        ) : null}

        {product.badge ? (
          <span
            className={cn(
              'absolute top-5 left-5 rounded-md px-2.5 py-1.5 text-xs leading-[18px] font-semibold shadow-[0px_0px_5.8px_0px_rgba(0,0,0,0.06)]',
              badgeClass[product.badge],
            )}
          >
            {t(`pages.product.badge.${product.badge}`)}
          </span>
        ) : null}

        {count > 1 ? (
          <>
            <button
              type="button"
              aria-label={t('pages.product.galleryPrev')}
              onClick={() => show(index - 1)}
              className="absolute top-1/2 left-[18px] flex size-10 -translate-y-1/2 items-center justify-center rounded-lg bg-white"
            >
              <ProductIcon src="/image/product/chevron-left.svg" width={20} height={20} />
            </button>
            <button
              type="button"
              aria-label={t('pages.product.galleryNext')}
              onClick={() => show(index + 1)}
              className="absolute top-1/2 right-[18px] flex size-10 -translate-y-1/2 items-center justify-center rounded-lg bg-white"
            >
              <ProductIcon src="/image/product/chevron-right-lg.svg" width={20} height={20} />
            </button>
          </>
        ) : null}

        <span className="absolute bottom-5 left-5 rounded-md bg-white px-[11px] py-1.5 text-[11px] leading-none text-(--color-dark-800)">
          {index + 1} / {count}
        </span>
        <button
          type="button"
          aria-label={t('pages.product.galleryExpand')}
          onClick={() => setExpanded(true)}
          className="absolute right-5 bottom-5 flex size-8 items-center justify-center rounded-md bg-white"
        >
          <ProductIcon src="/icons/expand.svg" width={16} height={16} />
        </button>
      </div>

      {count > 1 ? (
        <div className="flex gap-3 overflow-x-auto">
          {product.images.map((src, imageIndex) => {
            const active = imageIndex === index;

            return (
              <button
                key={src}
                type="button"
                aria-label={t('pages.product.galleryThumb', { index: imageIndex + 1 })}
                aria-current={active ? 'true' : undefined}
                onClick={() => setIndex(imageIndex)}
                className={cn(
                  'relative h-[94px] w-[116px] shrink-0 overflow-hidden rounded-lg border-2 p-[3px]',
                  active ? 'border-(--color-primary-700)' : 'border-transparent',
                )}
              >
                <span className="relative block h-full overflow-hidden rounded-md">
                  <Image src={src} alt="" fill className="object-cover" sizes="116px" />
                </span>
              </button>
            );
          })}
        </div>
      ) : null}

      {expanded && image
        ? createPortal(
            <div
              className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(16,23,21,0.45)] p-2.5"
              onClick={() => setExpanded(false)}
            >
          <div
            role="dialog"
            aria-modal="true"
            aria-label={title}
            onClick={(event) => event.stopPropagation()}
            className="relative flex w-full max-w-[1312px] flex-col items-center gap-4 rounded-3xl bg-white px-6 py-6 sm:px-10"
          >
            <h2 className="max-w-full truncate px-8 text-2xl leading-8 font-semibold text-(--color-dark-800)">
              {title}
            </h2>
            <button
              type="button"
              aria-label={t('pages.product.galleryClose')}
              onClick={() => setExpanded(false)}
              className="absolute top-[30px] right-[30px]"
            >
              <ProductIcon src="/image/product/lightbox-close.svg" width={20} height={20} />
            </button>

            <div className="flex w-full items-center justify-center gap-6">
              {count > 1 ? (
                <button
                  type="button"
                  aria-label={t('pages.product.galleryPrev')}
                  onClick={() => show(index - 1)}
                  className="flex size-10 shrink-0 items-center justify-center rounded-lg"
                >
                  <ProductIcon src="/image/product/chevron-left.svg" width={20} height={20} />
                </button>
              ) : null}
              <div className="relative h-[min(608px,62vh)] w-full max-w-[1080px] border border-(--color-dark-100)">
                <Image src={image} alt={title} fill className="object-contain" sizes="1080px" />
              </div>
              {count > 1 ? (
                <button
                  type="button"
                  aria-label={t('pages.product.galleryNext')}
                  onClick={() => show(index + 1)}
                  className="flex size-10 shrink-0 items-center justify-center rounded-lg"
                >
                  <ProductIcon src="/image/product/chevron-right-lg.svg" width={20} height={20} />
                </button>
              ) : null}
            </div>

            {count > 1 ? (
              <div className="flex max-w-full gap-3 overflow-x-auto">
                {product.images.map((src, imageIndex) => {
                  const active = imageIndex === index;

                  return (
                    <button
                      key={src}
                      type="button"
                      aria-label={t('pages.product.galleryThumb', { index: imageIndex + 1 })}
                      aria-current={active ? 'true' : undefined}
                      onClick={() => setIndex(imageIndex)}
                      className={cn(
                        'relative h-[75px] w-[92px] shrink-0 overflow-hidden rounded-lg border-2 p-[3px]',
                        active ? 'border-(--color-primary-700)' : 'border-transparent',
                      )}
                    >
                      <span className="relative block h-full overflow-hidden rounded-md">
                        <Image src={src} alt="" fill className="object-cover" sizes="92px" />
                      </span>
                    </button>
                  );
                })}
              </div>
            ) : null}
          </div>
            </div>,
            document.body,
          )
        : null}
    </div>
  );
}
