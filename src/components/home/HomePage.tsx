'use client';

import { ArrowRight, ArrowUpRight, Plus } from '@untitledui/icons';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';

import { getHomeFeed } from '@/data/getHomeFeed';
import type { HomeFeed } from '@/types/home';
import { BannerSlider } from '@/components/home/BannerSlider';
import { ProductCard } from '@/components/home/ProductCard';
import { Button } from '@/components/ui/Button';
import { localized } from '@/lib/localized';

const CAMPAIGN_WIDTH = 534;
const CAMPAIGN_HEIGHT = 370;
const CATEGORY_ICON_SIZE = 44;

export function HomePage() {
  const { t, i18n } = useTranslation();
  const [feed, setFeed] = useState<HomeFeed | null>(null);

  useEffect(() => {
    void getHomeFeed().then(setFeed);
  }, []);

  if (!feed) {
    return null;
  }

  const wideBanners = feed.banners.filter((banner) => banner.variant === 'wide');
  const sideBanner = feed.banners.find((banner) => banner.variant === 'side');

  return (
    <div className="-mx-4 flex flex-1 flex-col sm:-mx-6 lg:-mx-8">
      <section
        aria-label={t('pages.home.banners')}
        className="bg-white px-4 pt-8 pb-14 sm:px-6 lg:px-16"
      >
        <div className="mx-auto grid max-w-7xl items-start gap-4 lg:grid-cols-[minmax(0,755fr)_minmax(0,533fr)] lg:gap-10">
          {wideBanners.length > 0 ? <BannerSlider banners={wideBanners} /> : null}

          {sideBanner ? (
            <div className="relative h-fit overflow-hidden rounded-2xl">
              <Image
                src={sideBanner.imageUrl}
                alt={localized(sideBanner.title, i18n.language)}
                width={CAMPAIGN_WIDTH}
                height={CAMPAIGN_HEIGHT}
                className="h-auto w-full"
                priority
              />
              <Link
                href={sideBanner.href}
                className="absolute bottom-[9.73%] left-[9%] flex h-[11.35%] w-[24.77%] items-center justify-center gap-1.5 rounded-lg bg-white text-sm font-semibold text-(--color-ink)"
              >
                <ArrowUpRight className="size-[1.1em] shrink-0" aria-hidden />
                {t('pages.home.campaignCta')}
              </Link>
            </div>
          ) : null}
        </div>
      </section>

      <div className="flex flex-1 flex-col bg-white px-4 pt-8 pb-14 sm:px-6 lg:px-16">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-12">
          <section className="flex flex-col gap-6">
            <div className="flex items-end justify-between gap-4">
              <h2 className="text-display-xs font-semibold text-dark-800">
                {t('pages.home.popularCategories')}
              </h2>
              <Link
                href="/catalog"
                className="inline-flex items-center gap-1.5 text-sm font-medium text-(--color-brand) hover:text-(--color-brand-hover)"
              >
                {t('pages.home.catalogLink')}
                <ArrowRight className="size-4" aria-hidden />
              </Link>
            </div>
            <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
              {feed.popularCategories.map((category) => (
                <li key={category.id}>
                  <Link
                    href={`/catalog?category=${category.slug}`}
                    className="flex h-24 items-center gap-3 rounded-xl bg-primary-100 p-4"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element -- local SVG icons */}
                    <img
                      src={category.imageUrl}
                      alt=""
                      width={CATEGORY_ICON_SIZE}
                      height={CATEGORY_ICON_SIZE}
                      className="size-11 shrink-0"
                      aria-hidden
                    />
                    <span className="min-w-0 text-md leading-6 font-semibold text-primary-900">
                      {localized(category.name, i18n.language)}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>

          <section className="flex flex-col">
            <div className="flex flex-col gap-6">
              <div className="flex items-end justify-between gap-4">
                <h2 className="text-display-xs font-semibold text-dark-800">
                  {t('pages.home.trending')}
                </h2>
                <Link
                  href="/catalog"
                  className="inline-flex items-center gap-1.5 text-sm font-medium text-(--color-brand) hover:text-(--color-brand-hover)"
                >
                  {t('pages.home.trendingLink')}
                  <ArrowRight className="size-4" aria-hidden />
                </Link>
              </div>
              <ul className="grid grid-cols-2 gap-x-6 gap-y-8 lg:grid-cols-4">
                {feed.trending.map((product) => (
                  <li key={product.id} className="h-full">
                    <ProductCard product={product} />
                  </li>
                ))}
              </ul>
            </div>
            <div className="mt-8 flex justify-center">
              <Button
                hierarchy="secondary"
                size="md"
                iconLeading={<Plus aria-hidden />}
                className="border-0 bg-primary-100 text-primary-700 shadow-none hover:bg-primary-200"
              >
                {t('pages.home.showMore')}
              </Button>
            </div>
          </section>

          <section
            aria-label={t('pages.home.sellerInviteTitle')}
            className="flex flex-col items-start justify-between gap-6 rounded-2xl bg-primary-100 px-8 py-10 sm:flex-row sm:items-center sm:px-10 sm:py-10"
          >
            <div className="flex  flex-col gap-2">
              <h2 className="text-display-sm font-semibold text-dark-800">
                {t('pages.home.sellerInviteTitle')}
              </h2>
              <p className="text-md font-normal text-dark-600">
                <Trans
                  i18nKey="pages.home.sellerInviteSubtitle"
                  components={{
                    brand: (
                      <span className="font-[family-name:var(--font-bruno)] text-md leading-6 font-normal text-dark-600" />
                    ),
                  }}
                />
              </p>
            </div>
            <Button
              href="/catalog"
              hierarchy="primary"
              size="md"
              iconLeading={<ArrowRight aria-hidden />}
              className="shrink-0"
            >
              {t('pages.home.sellerInviteCta')}
            </Button>
          </section>
        </div>
      </div>
    </div>
  );
}
