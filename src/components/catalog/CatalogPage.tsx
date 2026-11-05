'use client';

import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { CategoryFilters } from '@/components/catalog/CategoryFilters';
import { ProductGrid } from '@/components/catalog/ProductGrid';
import { homeMock } from '@/data/home';
import { localized } from '@/lib/localized';

export function CatalogPage() {
  const { t, i18n } = useTranslation();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const categories = useMemo(() => {
    const seen = new Set<string>();

    return homeMock.trending.flatMap((product) => {
      const value = product.categoryName.uk;

      if (seen.has(value)) {
        return [];
      }

      seen.add(value);
      return [{ value, label: localized(product.categoryName, i18n.language) }];
    });
  }, [i18n.language]);

  const products = homeMock.trending.filter(
    (product) => selectedCategory === null || product.categoryName.uk === selectedCategory,
  );

  return (
    <div className="flex flex-1 flex-col gap-8 py-8">
      <header className="flex flex-col gap-3">
        <h1 className="text-display-sm font-semibold text-(--color-ink) sm:text-display-md">
          {t('pages.catalog.title')}
        </h1>
        <p className="text-md text-(--color-muted)">{t('pages.catalog.description')}</p>
      </header>

      <CategoryFilters
        categories={categories}
        allLabel={t('pages.catalog.allCategories')}
        label={t('pages.catalog.categoriesLabel')}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
      />

      <ProductGrid products={products} emptyMessage={t('pages.catalog.noProducts')} />
    </div>
  );
}
