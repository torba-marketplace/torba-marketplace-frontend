import { describe, expect, it } from 'vitest';

import { catalogProducts } from '@/data/catalog-products';
import type { CatalogQuery } from '@/lib/catalog-query';
import { filterCatalogProducts, paginateCatalog } from '@/lib/filter-catalog';
import type { CatalogProduct } from '@/types/catalog';

const bounds = { min: 0, max: 1000 };

function query(patch: Partial<CatalogQuery> = {}): CatalogQuery {
  return {
    category: 'furniture',
    sub: null,
    min: null,
    max: null,
    sellers: [],
    delivery: [],
    page: 1,
    sort: 'recommended',
    ...patch,
  };
}

function product(
  patch: Partial<CatalogProduct> & Pick<CatalogProduct, 'id' | 'price'>,
): CatalogProduct {
  return {
    title: patch.id,
    createdAt: '2026-10-01T00:00:00.000Z',
    categoryName: { uk: 'Меблі', en: 'Furniture' },
    availability: { uk: 'В наявності', en: 'In stock' },
    sellerName: 'CHARGE34',
    categorySlug: 'furniture',
    subcategorySlug: 'chairs',
    sellerId: 'charge34',
    offers: ['delivery'],
    ...patch,
    price: { amount: patch.price.amount, currency: 'UAH' },
  };
}

describe('filterCatalogProducts', () => {
  const products = [
    product({ id: 'chair', price: { amount: 100, currency: 'UAH' }, subcategorySlug: 'chairs' }),
    product({
      id: 'sofa',
      price: { amount: 800, currency: 'UAH' },
      subcategorySlug: 'sofas',
      sellerId: 'non-di',
      sellerName: 'Non Di',
      offers: ['pickup'],
    }),
    product({
      id: 'table',
      price: { amount: 400, currency: 'UAH' },
      subcategorySlug: 'tables',
      sellerId: 'superstore',
      offers: ['delivery', 'pickup'],
    }),
  ];

  it('keeps products of the selected subcategory, seller and price', () => {
    const result = filterCatalogProducts(
      products,
      query({ sub: 'tables', sellers: ['superstore'], min: 200, max: 500 }),
      bounds,
    );

    expect(result.map((item) => item.id)).toEqual(['table']);
  });

  it('requires every selected delivery option', () => {
    const result = filterCatalogProducts(
      products,
      query({ delivery: ['delivery', 'pickup'] }),
      bounds,
    );

    expect(result.map((item) => item.id)).toEqual(['table']);
  });

  it('sorts by price', () => {
    const result = filterCatalogProducts(products, query({ sort: 'price-desc' }), bounds);

    expect(result.map((item) => item.id)).toEqual(['sofa', 'table', 'chair']);
  });
});

describe('paginateCatalog', () => {
  it('returns the requested page window', () => {
    const page = paginateCatalog([1, 2, 3, 4, 5], 2, 2);

    expect(page).toMatchObject({ items: [3, 4], page: 2, pageCount: 3, from: 3, to: 4, total: 5 });
  });
});

describe('catalogProducts', () => {
  it('builds lighting lamps from the filter counts', () => {
    const lamps = catalogProducts.filter(
      (item) => item.categorySlug === 'lighting' && item.subcategorySlug === 'lamps',
    );

    expect(lamps).toHaveLength(5);
    expect(lamps.every((item) => item.sellerName.length > 0)).toBe(true);
  });
});
