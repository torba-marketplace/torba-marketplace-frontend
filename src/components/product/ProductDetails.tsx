'use client';

import Link from 'next/link';
import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { ProductIcon } from '@/components/product/ProductIcon';
import { localized } from '@/lib/localized';
import { cn } from '@/lib/cn';
import type { ProductDetail } from '@/data/product-page';

type ProductDetailsProps = {
  product: ProductDetail;
};

type ProductTab = 'description' | 'specs';

export function ProductDetails({ product }: ProductDetailsProps) {
  const { t, i18n } = useTranslation();
  const [tab, setTab] = useState<ProductTab>('description');
  const [expanded, setExpanded] = useState(false);
  const descriptionTabRef = useRef<HTMLButtonElement>(null);
  const specsTabRef = useRef<HTMLButtonElement>(null);
  const locale = i18n.language;
  const description = product.description;

  const selectTab = (next: ProductTab) => {
    setTab(next);
    (next === 'description' ? descriptionTabRef : specsTabRef).current?.focus();
  };

  return (
    <section className="flex flex-col gap-4 xl:gap-7">
      <div
        role="tablist"
        aria-label={`${t('pages.product.descriptionTab')} / ${t('pages.product.specsTab')}`}
        className="flex h-[49px] items-start gap-9 border-b border-(--color-dark-150)"
        onKeyDown={(event) => {
          if (event.key !== 'ArrowRight' && event.key !== 'ArrowLeft') {
            return;
          }

          event.preventDefault();
          selectTab(tab === 'description' ? 'specs' : 'description');
        }}
      >
        <button
          ref={descriptionTabRef}
          id="product-tab-description"
          type="button"
          role="tab"
          aria-selected={tab === 'description'}
          aria-controls="product-panel-description"
          tabIndex={tab === 'description' ? 0 : -1}
          onClick={() => selectTab('description')}
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
          ref={specsTabRef}
          id="product-tab-specs"
          type="button"
          role="tab"
          aria-selected={tab === 'specs'}
          aria-controls="product-panel-specs"
          tabIndex={tab === 'specs' ? 0 : -1}
          onClick={() => selectTab('specs')}
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

      <div className="flex min-w-0 flex-col gap-4 xl:flex-row xl:items-start xl:gap-16">
        <div
          role="tabpanel"
          id={tab === 'description' ? 'product-panel-description' : 'product-panel-specs'}
          aria-labelledby={tab === 'description' ? 'product-tab-description' : 'product-tab-specs'}
          className="w-full min-w-0 xl:w-[752px] xl:shrink-0"
        >
          {tab === 'description' ? (
            <div className="flex flex-col gap-4 xl:gap-[18px]">
              {description ? (
                <>
                  <h2 className="text-xl leading-[30px] font-semibold text-(--color-dark-800) xl:text-2xl xl:leading-8">
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
            <dl className="grid grid-cols-1 gap-4 pt-1.5 xl:grid-cols-2">
              {product.specs.map((spec) => (
                <div key={spec.label.uk} className="flex flex-col gap-[7px]">
                  <dt className="text-[11px] leading-normal text-(--color-dark-600)">
                    {localized(spec.label, locale)}
                  </dt>
                  <dd className="text-xs leading-normal font-medium wrap-break-word text-(--color-dark-800)">
                    {localized(spec.value, locale)}
                  </dd>
                </div>
              ))}
            </dl>
          )}
        </div>

        <aside className="flex min-w-0 flex-1 flex-col gap-3.5 rounded-xl bg-(--color-dark-100) px-[15px] py-[26px] xl:p-[26px]">
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
