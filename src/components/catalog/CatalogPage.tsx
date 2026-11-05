'use client';

import { ChevronLeft, ChevronRight } from '@untitledui/icons';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { CatalogFilters } from '@/components/catalog/CatalogFilters';
import { ProductGrid } from '@/components/catalog/ProductGrid';
import { catalogCategories, categoryHref } from '@/config/categories';
import { catalogFiltersMock } from '@/data/catalog-filters';
import { catalogProducts } from '@/data/catalog-products';
import {
  CATALOG_PAGE_SIZE,
  CATALOG_SORTS,
  catalogHref,
  parseCatalogQuery,
  type CatalogQuery,
  type CatalogSort,
} from '@/lib/catalog-query';
import { filterCatalogProducts, paginateCatalog } from '@/lib/filter-catalog';
import { localized } from '@/lib/localized';
import { cn } from '@/lib/cn';

export function CatalogPage() {
  const { t, i18n } = useTranslation();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const query = useMemo(() => parseCatalogQuery(searchParams), [searchParams]);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const listingRef = useRef<HTMLDivElement>(null);
  const pageBeforePaint = useRef(query.page);
  const category = catalogCategories.find((item) => item.slug === query.category) ?? null;
  const filters = catalogFiltersMock.find((item) => item.categorySlug === query.category) ?? null;

  useEffect(() => {
    if (query.category) {
      return;
    }

    router.replace(catalogHref({ ...query, category: 'furniture' }), { scroll: false });
  }, [query, router]);

  const filtered = useMemo(() => {
    if (!category || !filters) {
      return [];
    }

    return filterCatalogProducts(
      catalogProducts,
      { ...query, category: category.slug },
      filters.price,
    );
  }, [category, filters, query]);

  const page = paginateCatalog(filtered, query.page, CATALOG_PAGE_SIZE);

  useEffect(() => {
    if (!filters || query.page === page.page) {
      return;
    }

    router.replace(catalogHref({ ...query, page: page.page }, filters.price), { scroll: false });
  }, [filters, page.page, query, router]);

  useLayoutEffect(() => {
    if (pageBeforePaint.current === query.page) {
      return;
    }

    pageBeforePaint.current = query.page;
    const listing = listingRef.current;

    if (!listing) {
      return;
    }

    const header = document.querySelector('header');
    const offset = header?.getBoundingClientRect().height ?? 0;
    const top = listing.getBoundingClientRect().top + window.scrollY - offset;

    window.scrollTo({ top: Math.max(0, top), behavior: 'auto' });
  }, [query.page]);

  const commit = (next: CatalogQuery) => {
    const nextFilters = catalogFiltersMock.find((item) => item.categorySlug === next.category);
    const href = catalogHref(next, nextFilters?.price);
    router.push(href === '/catalog' ? pathname : href, { scroll: false });
  };

  if (!query.category) {
    return null;
  }

  if (!category || !filters) {
    return <p className="py-16 text-center text-(--color-muted)">{t('pages.catalog.notFound')}</p>;
  }

  const categoryLabel = localized(category.name, i18n.language);
  const subcategory = category.children.find((item) => item.slug === query.sub) ?? null;
  const allLabel = t('pages.catalog.allInCategory', {
    category: categoryLabel.charAt(0).toLowerCase() + categoryLabel.slice(1),
  });

  return (
    <div className="catalog-frame flex w-full flex-1 flex-col pb-8">
      <nav
        aria-label={t('nav.home')}
        className="mt-7 flex h-[15px] items-center gap-1.5 text-sm leading-[15px] text-(--color-dark-400)"
      >
        <Link href="/" className="hover:text-(--color-dark-800)">
          {t('nav.home')}
        </Link>
        <ChevronRight className="size-3.5" aria-hidden />
        {subcategory ? (
          <Link href={categoryHref(category.slug)} className="hover:text-(--color-dark-800)">
            {categoryLabel}
          </Link>
        ) : (
          <span className="text-(--color-dark-800)">{categoryLabel}</span>
        )}
        {subcategory ? (
          <>
            <ChevronRight className="size-3.5" aria-hidden />
            <span className="text-(--color-dark-800)">
              {localized(subcategory.name, i18n.language)}
            </span>
          </>
        ) : null}
      </nav>

      <div ref={listingRef} className="mt-[30px] flex items-start gap-8 pt-3">
        <aside className="hidden w-[310px] shrink-0 lg:block">
          <CatalogFilters
            category={category}
            filters={filters}
            query={query}
            onQueryChange={commit}
          />
        </aside>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h1 className="font-[family-name:var(--second-family)] text-[28px] leading-[1.29] font-normal text-(--color-dark-800)">
              {categoryLabel}
            </h1>
            <div className="flex items-center gap-2">
              <button
                type="button"
                className="inline-flex h-10 items-center rounded-lg border border-(--color-dark-200) px-3 text-sm font-semibold text-(--color-dark-800) lg:hidden"
                onClick={() => setFiltersOpen(true)}
              >
                {t('pages.catalog.filters')}
              </button>
              <label className="sr-only" htmlFor="catalog-sort">
                {t('pages.catalog.sort.label')}
              </label>
              <select
                id="catalog-sort"
                className="h-10 rounded-lg border border-(--color-dark-200) bg-white px-3 text-sm text-(--color-dark-800)"
                value={query.sort}
                onChange={(event) =>
                  commit({ ...query, sort: event.target.value as CatalogSort, page: 1 })
                }
              >
                {CATALOG_SORTS.map((sort) => (
                  <option key={sort} value={sort}>
                    {t(
                      `pages.catalog.sort.${sort === 'price-asc' ? 'priceAsc' : sort === 'price-desc' ? 'priceDesc' : sort}`,
                    )}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <ActiveFilters
            allLabel={allLabel}
            subcategoryLabel={subcategory ? localized(subcategory.name, i18n.language) : null}
            query={query}
            filters={filters}
            onQueryChange={commit}
            removeLabel={(name) => t('pages.catalog.removeFilter', { name })}
            deliveryLabel={(id) =>
              id === 'delivery' ? t('pages.catalog.delivery') : t('pages.catalog.pickup')
            }
            resetLabel={t('pages.catalog.reset')}
          />

          <div className="mt-6">
            <ProductGrid
              products={page.items}
              emptyMessage={t('pages.catalog.noProducts')}
              columns={3}
            />
          </div>

          <Pagination
            page={page.page}
            pageCount={page.pageCount}
            shownLabel={t('pages.catalog.shown', {
              from: page.from,
              to: page.to,
              total: page.total,
            })}
            onPage={(nextPage) => commit({ ...query, page: nextPage })}
          />
        </div>
      </div>

      {filtersOpen ? (
        <div className="fixed inset-0 z-50 flex flex-col bg-white lg:hidden">
          <div className="flex items-center justify-between border-b border-(--color-dark-200) px-4 py-3">
            <h2 className="text-md font-semibold text-(--color-dark-800)">
              {t('pages.catalog.filters')}
            </h2>
            <button
              type="button"
              className="text-sm font-medium text-(--color-primary-700)"
              onClick={() => setFiltersOpen(false)}
            >
              {t('pages.catalog.closeFilters')}
            </button>
          </div>
          <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4">
            <CatalogFilters
              category={category}
              filters={filters}
              query={query}
              onQueryChange={commit}
            />
          </div>
          <div className="border-t border-(--color-dark-200) p-4 pb-6">
            <button
              type="button"
              className="h-11 w-full rounded-lg bg-(--color-primary-700) text-sm font-semibold text-white"
              onClick={() => setFiltersOpen(false)}
            >
              {t('pages.catalog.showResults', { count: page.total })}
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function ActiveFilters({
  allLabel,
  subcategoryLabel,
  query,
  filters,
  onQueryChange,
  removeLabel,
  deliveryLabel,
  resetLabel,
}: {
  allLabel: string;
  subcategoryLabel: string | null;
  query: CatalogQuery;
  filters: (typeof catalogFiltersMock)[number];
  onQueryChange: (next: CatalogQuery) => void;
  removeLabel: (name: string) => string;
  deliveryLabel: (id: CatalogQuery['delivery'][number]) => string;
  resetLabel: string;
}) {
  const chips: Array<{ key: string; label: string; next: CatalogQuery }> = [
    {
      key: 'sub',
      label: subcategoryLabel ?? allLabel,
      next: { ...query, sub: null, page: 1 },
    },
  ];

  if (query.min !== null || query.max !== null) {
    const min = query.min ?? filters.price.min;
    const max = query.max ?? filters.price.max;
    chips.push({
      key: 'price',
      label: `${min}–${max}`,
      next: { ...query, min: null, max: null, page: 1 },
    });
  }

  for (const sellerId of query.sellers) {
    const seller = filters.sellers.find((item) => item.id === sellerId);

    if (!seller) {
      continue;
    }

    chips.push({
      key: seller.id,
      label: seller.name,
      next: {
        ...query,
        sellers: query.sellers.filter((id) => id !== seller.id),
        page: 1,
      },
    });
  }

  for (const option of query.delivery) {
    chips.push({
      key: option,
      label: deliveryLabel(option),
      next: {
        ...query,
        delivery: query.delivery.filter((id) => id !== option),
        page: 1,
      },
    });
  }

  const removable = subcategoryLabel ? chips : chips.filter((chip) => chip.key !== 'sub');

  if (removable.length === 0) {
    return null;
  }

  return (
    <div className="mt-4 flex flex-wrap items-center gap-2">
      {removable.map((chip) => (
        <button
          key={chip.key}
          type="button"
          className="inline-flex h-[33px] items-center gap-2 rounded-[6px] bg-(--color-primary-100) px-3 font-[family-name:var(--font-family)] text-[12px] font-medium text-(--color-primary-700)"
          aria-label={removeLabel(chip.label)}
          onClick={() => onQueryChange(chip.next)}
        >
          {chip.label}
          {/* eslint-disable-next-line @next/next/no-img-element -- local svg icon */}
          <img src="/icons/close.svg" alt="" width={13} height={13} />
        </button>
      ))}
      <button
        type="button"
        className="text-sm font-medium text-(--color-primary-700)"
        onClick={() =>
          onQueryChange({
            ...query,
            sub: null,
            min: null,
            max: null,
            sellers: [],
            delivery: [],
            page: 1,
          })
        }
      >
        {resetLabel}
      </button>
    </div>
  );
}

function Pagination({
  page,
  pageCount,
  shownLabel,
  onPage,
}: {
  page: number;
  pageCount: number;
  shownLabel: string;
  onPage: (page: number) => void;
}) {
  return (
    <div className="mt-8 flex flex-col items-center gap-3">
      {pageCount > 1 ? (
        <div className="flex items-center gap-1">
          <button
            type="button"
            className="inline-flex size-9 items-center justify-center rounded-lg text-(--color-dark-600) disabled:opacity-40"
            disabled={page <= 1}
            onClick={() => onPage(page - 1)}
          >
            <ChevronLeft className="size-4" aria-hidden />
          </button>
          {Array.from({ length: pageCount }, (_, index) => index + 1).map((item) => (
            <button
              key={item}
              type="button"
              aria-current={item === page ? 'page' : undefined}
              className={cn(
                'inline-flex size-9 items-center justify-center rounded-lg text-sm',
                item === page
                  ? 'bg-(--color-primary-700) font-semibold text-white'
                  : 'text-(--color-dark-600)',
              )}
              onClick={() => onPage(item)}
            >
              {item}
            </button>
          ))}
          <button
            type="button"
            className="inline-flex size-9 items-center justify-center rounded-lg text-(--color-dark-600) disabled:opacity-40"
            disabled={page >= pageCount}
            onClick={() => onPage(page + 1)}
          >
            <ChevronRight className="size-4" aria-hidden />
          </button>
        </div>
      ) : null}
      <p className="text-sm text-(--color-dark-400)">{shownLabel}</p>
    </div>
  );
}
