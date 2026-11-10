'use client';

import Link from 'next/link';
import { useTranslation } from 'react-i18next';

import { ProductIcon } from '@/components/product/ProductIcon';
import { catalogCategories } from '@/config/categories';
import { catalogHref } from '@/lib/catalog-query';
import { localized } from '@/lib/localized';
import type { ProductDetail } from '@/data/product-page';

type ProductBreadcrumbsProps = {
  product: ProductDetail;
};

export function ProductBreadcrumbs({ product }: ProductBreadcrumbsProps) {
  const { t, i18n } = useTranslation();
  const knownCategory = catalogCategories.some((item) => item.slug === product.categorySlug);
  const categoryHref = knownCategory
    ? catalogHref({
        category: product.categorySlug,
        sub: null,
        min: null,
        max: null,
        sellers: [],
        delivery: [],
        page: 1,
        sort: 'recommended',
      })
    : '/catalog';

  return (
    <nav aria-label={t('pages.product.breadcrumbs')} className="flex items-center gap-2.5">
      <ol className="flex min-w-0 items-center gap-2.5">
        <li className="shrink-0">
          <Link
            href="/"
            className="text-xs leading-[18px] text-(--color-dark-600) hover:text-(--color-dark-800)"
          >
            {t('nav.home')}
          </Link>
        </li>
        <li className="shrink-0" aria-hidden>
          <ProductIcon src="/icons/chevron-right.svg" width={12} height={12} />
        </li>
        <li className="shrink-0">
          <Link
            href={categoryHref}
            className="text-xs leading-[18px] text-(--color-dark-600) hover:text-(--color-dark-800)"
          >
            {localized(product.category, i18n.language)}
          </Link>
        </li>
        <li className="shrink-0" aria-hidden>
          <ProductIcon src="/icons/chevron-right.svg" width={12} height={12} />
        </li>
        <li className="min-w-0 truncate text-xs leading-[18px] text-(--color-dark-800)">
          {localized(product.title, i18n.language)}
        </li>
      </ol>
    </nav>
  );
}
