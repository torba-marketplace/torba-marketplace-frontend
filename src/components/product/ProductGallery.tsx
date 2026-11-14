'use client';

import Image from 'next/image';
import { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useTranslation } from 'react-i18next';

import { ProductHeart } from '@/components/product/ProductHeart';
import { ProductIcon } from '@/components/product/ProductIcon';
import { localized } from '@/lib/localized';
import { useShopFlag } from '@/lib/shop-lists';
import { cn } from '@/lib/cn';
import type { ProductDetail } from '@/data/product-page';

type ProductGalleryProps = {
  product: ProductDetail;
};

type GalleryMotion = {
  current: number;
  previous: number | null;
  direction: 1 | -1;
  token: number;
};

const badgeClass = {
  new: 'bg-white text-(--color-dark-900)',
  trend: 'bg-(--color-red-200) text-(--color-red-600)',
  recommended: 'bg-(--color-primary-200) text-(--color-primary-700)',
} as const;

const idleMotion: GalleryMotion = { current: 0, previous: null, direction: 1, token: 0 };

function GalleryStage({
  images,
  motion,
  alt,
  fit,
  sizes,
  priority,
}: {
  images: string[];
  motion: GalleryMotion;
  alt: string;
  fit: string;
  sizes: string;
  priority?: boolean;
}) {
  const currentSrc = images[motion.current];
  const previousSrc = motion.previous === null ? null : images[motion.previous];
  const animate = previousSrc != null && previousSrc !== currentSrc;
  const enterClass = motion.direction === 1 ? 'gallery-in-next' : 'gallery-in-prev';
  const leaveClass = motion.direction === 1 ? 'gallery-out-next' : 'gallery-out-prev';

  return (
    <>
      {animate && previousSrc ? (
        <div
          key={`out-${motion.token}`}
          className={cn('pointer-events-none absolute inset-0', leaveClass)}
        >
          <Image src={previousSrc} alt="" fill className={fit} sizes={sizes} />
        </div>
      ) : null}
      {currentSrc ? (
        <div
          key={`in-${motion.token}-${motion.current}`}
          className={cn('pointer-events-none absolute inset-0', animate && enterClass)}
        >
          <Image
            src={currentSrc}
            alt={alt}
            fill
            priority={priority}
            className={fit}
            sizes={sizes}
          />
        </div>
      ) : null}
    </>
  );
}

export function ProductGallery({ product }: ProductGalleryProps) {
  const { t, i18n } = useTranslation();
  const [saved, toggleSaved] = useShopFlag('favorites', product.id);
  const [motion, setMotion] = useState<GalleryMotion>(idleMotion);
  const [expanded, setExpanded] = useState(false);
  const [galleryProductId, setGalleryProductId] = useState(product.id);
  const thumbsRef = useRef<Array<HTMLButtonElement | null>>([]);

  if (galleryProductId !== product.id) {
    setGalleryProductId(product.id);
    setMotion(idleMotion);
    setExpanded(false);
  }
  const title = localized(product.title, i18n.language);
  const count = product.images.length;
  const index = motion.current;

  const show = useCallback(
    (nextRaw: number) => {
      setMotion((current) => {
        if (count < 2) {
          return current;
        }

        const next = ((nextRaw % count) + count) % count;

        if (next === current.current) {
          return current;
        }

        return {
          current: next,
          previous: current.current,
          direction: nextRaw >= current.current ? 1 : -1,
          token: current.token + 1,
        };
      });
    },
    [count],
  );

  useEffect(() => {
    const thumb = thumbsRef.current[index];

    thumb?.scrollIntoView({
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
      inline: 'nearest',
      block: 'nearest',
    });
  }, [index]);

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
  }, [expanded, index, show]);

  return (
    <div className="flex w-full flex-col gap-4 xl:w-[752px] xl:shrink-0">
      <div className="relative h-[300px] overflow-hidden rounded-2xl bg-(--color-dark-100) xl:h-[568px]">
        <GalleryStage
          images={product.images}
          motion={motion}
          alt={title}
          fit="object-cover"
          sizes="(min-width: 1280px) 752px, 100vw"
          priority
        />

        {product.badge ? (
          <span
            className={cn(
              'absolute top-5 left-2.5 rounded-md px-2.5 py-1.5 text-xs leading-[18px] font-semibold shadow-[0px_0px_5.8px_0px_rgba(0,0,0,0.06)] xl:left-5',
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
              className="absolute top-1/2 left-[18px] z-10 hidden size-10 -translate-y-1/2 items-center justify-center rounded-lg bg-white xl:flex"
            >
              <ProductIcon src="/image/product/chevron-left.svg" width={20} height={20} />
            </button>
            <button
              type="button"
              aria-label={t('pages.product.galleryNext')}
              onClick={() => show(index + 1)}
              className="absolute top-1/2 right-[18px] z-10 hidden size-10 -translate-y-1/2 items-center justify-center rounded-lg bg-white xl:flex"
            >
              <ProductIcon src="/image/product/chevron-right-lg.svg" width={20} height={20} />
            </button>
          </>
        ) : null}

        <button
          type="button"
          aria-label={t('pages.product.galleryExpand')}
          onClick={() => setExpanded(true)}
          className="absolute inset-0 z-[1] md:hidden"
        />
        <span className="absolute bottom-5 left-2.5 z-10 rounded-md bg-white px-[11px] py-1.5 text-[11px] leading-none text-(--color-dark-800) xl:left-5">
          {index + 1} / {count}
        </span>
        <button
          type="button"
          aria-pressed={saved}
          aria-label={t('nav.favorites')}
          onClick={toggleSaved}
          className="absolute top-[13px] right-2 z-10 flex size-11 items-center justify-center rounded-lg bg-white xl:hidden"
        >
          <ProductHeart saved={saved} color="#1A1F1E" />
        </button>
        <button
          type="button"
          aria-label={t('pages.product.galleryExpand')}
          onClick={() => setExpanded(true)}
          className="absolute right-5 bottom-5 z-10 hidden size-8 items-center justify-center rounded-md bg-white md:flex"
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
                ref={(node) => {
                  thumbsRef.current[imageIndex] = node;
                }}
                type="button"
                aria-label={t('pages.product.galleryThumb', { index: imageIndex + 1 })}
                aria-current={active ? 'true' : undefined}
                onClick={() => show(imageIndex)}
                className={cn(
                  'relative h-[65px] w-20 shrink-0 overflow-hidden rounded-lg border-2 p-[3px] transition-colors duration-300 xl:h-[94px] xl:w-[116px]',
                  active ? 'border-(--color-primary-700)' : 'border-transparent',
                )}
              >
                <span className="relative block h-full overflow-hidden rounded-md">
                  <Image src={src} alt="" fill loading="lazy" className="object-cover" sizes="116px" />
                </span>
              </button>
            );
          })}
        </div>
      ) : null}

      {expanded
        ? createPortal(
            <div
              className="fixed inset-0 z-50 max-md:top-14 max-md:bg-white md:flex md:items-center md:justify-center md:bg-[rgba(16,23,21,0.45)] md:p-2.5"
              onClick={() => setExpanded(false)}
            >
              <div
                role="dialog"
                aria-modal="true"
                aria-label={title}
                onClick={(event) => event.stopPropagation()}
                className="flex h-full flex-col gap-4 bg-white px-4 py-6 md:hidden"
              >
                <div className="flex items-start justify-between gap-3">
                  <h2 className="min-w-0 truncate text-2xl leading-8 font-semibold text-(--color-dark-800)">
                    {title}
                  </h2>
                  <button
                    type="button"
                    aria-label={t('pages.product.galleryClose')}
                    onClick={() => setExpanded(false)}
                    className="flex size-8 shrink-0 items-center justify-center rounded-md"
                  >
                    <ProductIcon src="/image/product/lightbox-close.svg" width={20} height={20} />
                  </button>
                </div>
                <div className="relative min-h-0 flex-1 overflow-hidden border border-(--color-dark-100)">
                  <GalleryStage
                    images={product.images}
                    motion={motion}
                    alt={title}
                    fit="object-contain"
                    sizes="100vw"
                  />
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
                          onClick={() => show(imageIndex)}
                          className={cn(
                            'relative h-[65px] w-20 shrink-0 overflow-hidden rounded-lg border-2 p-[3px] transition-colors duration-300',
                            active ? 'border-(--color-primary-700)' : 'border-transparent',
                          )}
                        >
                          <span className="relative block h-full overflow-hidden rounded-md">
                            <Image
                              src={src}
                              alt=""
                              fill
                              loading="lazy"
                              className="object-cover"
                              sizes="80px"
                            />
                          </span>
                        </button>
                      );
                    })}
                  </div>
                ) : null}
              </div>
              <div
                role="dialog"
                aria-modal="true"
                aria-label={title}
                onClick={(event) => event.stopPropagation()}
                className="relative hidden w-full max-w-[1312px] flex-col items-center gap-4 rounded-3xl bg-white px-6 py-6 sm:px-10 md:flex"
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
                  <div className="relative h-[min(608px,62vh)] w-full max-w-[1080px] overflow-hidden border border-(--color-dark-100)">
                    <GalleryStage
                      images={product.images}
                      motion={motion}
                      alt={title}
                      fit="object-contain"
                      sizes="1080px"
                    />
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
                          onClick={() => show(imageIndex)}
                          className={cn(
                            'relative h-[75px] w-[92px] shrink-0 overflow-hidden rounded-lg border-2 p-[3px] transition-colors duration-300',
                            active ? 'border-(--color-primary-700)' : 'border-transparent',
                          )}
                        >
                          <span className="relative block h-full overflow-hidden rounded-md">
                            <Image
                              src={src}
                              alt=""
                              fill
                              loading="lazy"
                              className="object-cover"
                              sizes="92px"
                            />
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
