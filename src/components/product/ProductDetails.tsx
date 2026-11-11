'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { ProductIcon } from '@/components/product/ProductIcon';
import { localized } from '@/lib/localized';
import { cn } from '@/lib/cn';
import type { ProductDetail } from '@/data/product-page';

type ProductDetailsProps = {
  product: ProductDetail;
};

export function ProductDetails({ product }: ProductDetailsProps) {
  const { t, i18n } = useTranslation();
  const [tab, setTab] = useState<'description' | 'specs'>('description');
  const [expanded, setExpanded] = useState(false);
  const locale = i18n.language;
  const description = product.description;

  return (
    <section className="flex flex-col gap-7">
      <div className="flex h-[49px] items-start gap-9 border-b border-(--color-dark-150)">
        <button
          type="button"
          onClick={() => setTab('description')}
          className={cn(
            'inline-flex h-full items-center text-sm leading-5',
            tab === 'description'
              ? 'border-b-2 border-(--color-primary-700) font-semibold text-(--color-primary-700)'
              : 'font-normal text-(--color-dark-600)',
          )}
        >
          {t('pages.product.descriptionTab')}
        </button>
        <button
          type="button"
          onClick={() => setTab('specs')}
          className={cn(
            'inline-flex h-full items-center text-sm leading-5',
            tab === 'specs'
              ? 'border-b-2 border-(--color-primary-700) font-semibold text-(--color-primary-700)'
              : 'font-normal text-(--color-dark-600)',
          )}
        >
          {t('pages.product.specsTab')}
        </button>
      </div>

      <div className="flex flex-col gap-16 xl:flex-row xl:items-start">
        <div className="w-full xl:w-[752px] xl:shrink-0">
          {tab === 'description' ? (
            <div className="flex flex-col gap-[18px]">
              {description ? (
                <>
                  <h2 className="text-2xl leading-8 font-semibold text-(--color-dark-800)">
                    {localized(description.title, locale)}
                  </h2>
                  <p className="text-sm leading-5 text-(--color-dark-600)">
                    {localized(description.lead, locale)}
                  </p>
                  {description.rest ? (
                    <>
                      <p
                        className={cn(
                          'text-sm leading-5 text-(--color-dark-600)',
                          expanded ? '' : 'line-clamp-3',
                        )}
                      >
                        {localized(description.rest, locale)}
                      </p>
                      <button
                        type="button"
                        onClick={() => setExpanded((value) => !value)}
                        className="inline-flex items-center gap-2 text-sm leading-5 font-semibold text-(--color-primary-700)"
                      >
                        {expanded ? t('pages.product.readLess') : t('pages.product.readMore')}
                        <span
                          className={cn(
                            'inline-flex transition-transform duration-200',
                            expanded && 'rotate-180',
                          )}
                        >
                          <ProductIcon src="/icons/Arrow_Down_SM.svg" width={20} height={20} />
                        </span>
                      </button>
                    </>
                  ) : null}
                </>
              ) : (
                <p className="text-sm leading-5 text-(--color-dark-600)">
                  {localized(product.title, locale)}
                </p>
              )}
            </div>
          ) : (
            <dl className="grid grid-cols-2 gap-4 pt-1.5">
              {product.specs.map((spec) => (
                <div key={spec.label.uk} className="flex flex-col gap-[7px]">
                  <dt className="text-[11px] leading-normal text-(--color-dark-600)">
                    {localized(spec.label, locale)}
                  </dt>
                  <dd className="text-xs leading-normal font-medium text-(--color-dark-800)">
                    {localized(spec.value, locale)}
                  </dd>
                </div>
              ))}
            </dl>
          )}
        </div>

        <aside className="flex flex-1 flex-col gap-3.5 rounded-xl bg-(--color-dark-100) p-[26px]">
          <ProductIcon src="/image/product/shield.svg" width={29} height={29} />
          <h2 className="text-[18px] leading-normal font-semibold text-(--color-dark-800)">
            {t('pages.product.protectionTitle')}
          </h2>
          <p className="text-[13px] leading-[1.75] text-(--color-dark-600)">
            {t('pages.product.protectionBody')}
          </p>
          <Link
            href="/warranty"
            className="text-xs font-semibold text-(--color-primary-700)"
          >
            {t('pages.product.protectionLink')}
          </Link>
        </aside>
      </div>
    </section>
  );
}
