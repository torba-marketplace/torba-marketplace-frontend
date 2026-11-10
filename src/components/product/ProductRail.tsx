'use client';

import Link from 'next/link';
import { useTranslation } from 'react-i18next';

import { ProductIcon } from '@/components/product/ProductIcon';
import { RelatedProductCard } from '@/components/product/RelatedProductCard';
import type { RelatedCard } from '@/data/product-page';

type ProductRailProps = {
  title: string;
  href: string;
  products: RelatedCard[];
};

export function ProductRail({ title, href, products }: ProductRailProps) {
  const { t } = useTranslation();

  if (products.length === 0) {
    return null;
  }

  return (
    <section className="flex flex-col gap-[26px] pt-3.5">
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-[28px] leading-[34px] font-normal text-(--color-dark-800)">{title}</h2>
        <Link
          href={href}
          className="inline-flex shrink-0 items-center gap-2 text-sm font-semibold text-(--color-primary-700)"
        >
          {t('pages.product.moreProducts')}
          <ProductIcon src="/icons/arrow-right.svg" width={17} height={17} />
        </Link>
      </div>
      <ul className="grid grid-cols-2 gap-6 sm:grid-cols-3 xl:grid-cols-5">
        {products.map((product) => (
          <li key={product.id} className="min-w-0">
            <RelatedProductCard product={product} />
          </li>
        ))}
      </ul>
    </section>
  );
}
