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
    <section className="flex min-w-0 flex-col gap-[26px] pt-3.5">
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-xl leading-[30px] font-normal text-(--color-dark-800) xl:text-[28px] xl:leading-[34px]">
          {title}
        </h2>
        <Link
          href={href}
          className="hidden shrink-0 items-center gap-2 text-sm font-semibold text-(--color-primary-700) xl:inline-flex"
        >
          {t('pages.product.moreProducts')}
          <ProductIcon src="/icons/arrow-right.svg" width={17} height={17} />
        </Link>
      </div>
      <ul className="flex gap-6 overflow-x-auto xl:grid xl:grid-cols-5 xl:overflow-visible">
        {products.map((product) => (
          <li key={product.id} className="w-[170px] shrink-0 xl:w-auto xl:min-w-0">
            <RelatedProductCard product={product} />
          </li>
        ))}
      </ul>
    </section>
  );
}
