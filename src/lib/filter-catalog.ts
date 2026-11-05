import {
  CATALOG_PAGE_SIZE,
  type CatalogPriceBounds,
  type CatalogQuery,
  type CatalogSort,
} from '@/lib/catalog-query';
import type { CatalogProduct } from '@/types/catalog';

export type CatalogPageSlice<T> = {
  items: T[];
  page: number;
  pageCount: number;
  from: number;
  to: number;
  total: number;
};

function priceWindow(query: CatalogQuery, bounds: CatalogPriceBounds) {
  const min = query.min ?? bounds.min;
  const max = query.max ?? bounds.max;

  return { min: Math.min(min, max), max: Math.max(min, max) };
}

function sortProducts(products: CatalogProduct[], sort: CatalogSort): CatalogProduct[] {
  const next = [...products];

  if (sort === 'price-asc') {
    next.sort((a, b) => a.price.amount - b.price.amount);
  } else if (sort === 'price-desc') {
    next.sort((a, b) => b.price.amount - a.price.amount);
  } else if (sort === 'newest') {
    next.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }

  return next;
}

export function filterCatalogProducts(
  products: CatalogProduct[],
  query: CatalogQuery,
  bounds: CatalogPriceBounds,
): CatalogProduct[] {
  const { min, max } = priceWindow(query, bounds);

  const filtered = products.filter((product) => {
    if (query.category && product.categorySlug !== query.category) {
      return false;
    }

    if (query.sub && product.subcategorySlug !== query.sub) {
      return false;
    }

    if (product.price.amount < min || product.price.amount > max) {
      return false;
    }

    if (query.sellers.length > 0 && !query.sellers.includes(product.sellerId)) {
      return false;
    }

    if (query.delivery.length > 0 && !query.delivery.every((id) => product.offers.includes(id))) {
      return false;
    }

    return true;
  });

  return sortProducts(filtered, query.sort);
}

export function paginateCatalog<T>(
  items: T[],
  page: number,
  pageSize = CATALOG_PAGE_SIZE,
): CatalogPageSlice<T> {
  const total = items.length;
  const pageCount = Math.max(1, Math.ceil(total / pageSize));
  const current = Math.min(Math.max(page, 1), pageCount);
  const start = total === 0 ? 0 : (current - 1) * pageSize;
  const slice = items.slice(start, start + pageSize);

  return {
    items: slice,
    page: current,
    pageCount,
    from: total === 0 ? 0 : start + 1,
    to: start + slice.length,
    total,
  };
}
