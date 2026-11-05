'use client';

import { ChevronLeft, ChevronRight } from '@untitledui/icons';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import type { HomeBanner } from '@/types/home';
import { cn } from '@/lib/cn';
import { localized } from '@/lib/localized';

const AUTOPLAY_MS = 5000;
const BANNER_WIDTH = 787;
const BANNER_HEIGHT = 432;

type BannerSliderProps = {
  banners: HomeBanner[];
};

export function BannerSlider({ banners }: BannerSliderProps) {
  const { t, i18n } = useTranslation();
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  const count = banners.length;
  const current = banners[index];

  useEffect(() => {
    if (count < 2 || paused) {
      return;
    }

    const timer = window.setInterval(() => {
      setIndex((prev) => (prev + 1) % count);
    }, AUTOPLAY_MS);

    return () => window.clearInterval(timer);
  }, [count, paused]);

  if (!current) {
    return null;
  }

  const goTo = (next: number) => {
    setIndex(((next % count) + count) % count);
  };

  const title = localized(current.title, i18n.language);

  return (
    <div
      className="relative min-h-0 overflow-hidden rounded-2xl"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
          setPaused(false);
        }
      }}
    >
      <Link href={current.href} className="relative block">
        <Image
          src={current.imageUrl}
          alt={title}
          width={BANNER_WIDTH}
          height={BANNER_HEIGHT}
          className="h-auto w-full object-cover"
          priority={index === 0}
        />
      </Link>

      {count > 1 ? (
        <>
          <div className="absolute bottom-[5%] left-1/2 flex -translate-x-1/2 items-center gap-2">
            {banners.map((banner, slideIndex) => {
              const active = slideIndex === index;
              return (
                <button
                  key={banner.id}
                  type="button"
                  aria-label={`${slideIndex + 1} / ${count}`}
                  aria-current={active ? 'true' : undefined}
                  className={cn(
                    'h-2 rounded-full transition-all',
                    active
                      ? 'w-6 bg-(--color-brand)'
                      : 'w-2 bg-(--color-dark-200) hover:bg-(--color-dark-300)',
                  )}
                  onClick={() => goTo(slideIndex)}
                />
              );
            })}
          </div>

          <button
            type="button"
            aria-label={t('pages.home.bannerPrev')}
            className="absolute right-[9.54%] bottom-[6.49%] inline-flex h-[10.81%] w-[5.3%] items-center justify-center rounded-lg bg-white text-(--color-brand)"
            onClick={() => goTo(index - 1)}
          >
            <ChevronLeft className="size-1/2" aria-hidden />
          </button>
          <button
            type="button"
            aria-label={t('pages.home.bannerNext')}
            className="absolute right-[3.18%] bottom-[6.49%] inline-flex h-[10.81%] w-[5.3%] items-center justify-center rounded-lg bg-white text-(--color-brand)"
            onClick={() => goTo(index + 1)}
          >
            <ChevronRight className="size-1/2" aria-hidden />
          </button>
        </>
      ) : null}
    </div>
  );
}
