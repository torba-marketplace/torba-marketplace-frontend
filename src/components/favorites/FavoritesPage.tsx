'use client';

import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { ProductGrid } from '@/components/catalog/ProductGrid';
import { catalogProducts } from '@/data/catalog-products';
import { homeMock } from '@/data/home';
import { useFavoriteIds } from '@/lib/shop-lists';
import type { HomeProduct } from '@/types/home';

const productsById = new Map<string, HomeProduct>();

for (const product of [...homeMock.trending, ...catalogProducts]) {
  if (!productsById.has(product.id)) {
    productsById.set(product.id, product);
  }
}

export function FavoritesPage() {
  const { t } = useTranslation();
  const ids = useFavoriteIds();
  const products = useMemo(
    () => ids.flatMap((id) => productsById.get(id) ?? []),
    [ids],
  );

  return (
    <section className="flex flex-col gap-6 py-6 md:py-10">
      <h1 className="text-[24px] leading-8 font-medium text-(--color-dark-800) lg:font-[family-name:var(--second-family)] lg:text-[28px] lg:leading-9 lg:font-normal">
        {t('pages.favorites.title')}
      </h1>
      <ProductGrid products={products} emptyMessage={t('pages.favorites.empty')} />
    </section>
  );
}
