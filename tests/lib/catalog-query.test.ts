import { describe, expect, it } from 'vitest';

import { catalogHref, parseCatalogQuery, serializeCatalogQuery } from '@/lib/catalog-query';

function params(search: string) {
  return new URLSearchParams(search);
}

describe('parseCatalogQuery', () => {
  it('reads category filters from the query string', () => {
    const query = parseCatalogQuery(
      params(
        'category=lighting&sub=lamps&min=200&max=9000&sellers=charge34,non-di&delivery=delivery,pickup&page=2&sort=price-asc',
      ),
    );

    expect(query).toEqual({
      category: 'lighting',
      sub: 'lamps',
      min: 200,
      max: 9000,
      sellers: ['charge34', 'non-di'],
      delivery: ['delivery', 'pickup'],
      page: 2,
      sort: 'price-asc',
    });
  });

  it('drops invalid values and uses defaults', () => {
    const query = parseCatalogQuery(
      params('page=0&sort=popular&min=abc&delivery=courier,delivery&sellers=charge34,charge34'),
    );

    expect(query.page).toBe(1);
    expect(query.sort).toBe('recommended');
    expect(query.min).toBeNull();
    expect(query.delivery).toEqual(['delivery']);
    expect(query.sellers).toEqual(['charge34']);
    expect(query.category).toBeNull();
  });
});

describe('serializeCatalogQuery', () => {
  it('omits default price, page and sort', () => {
    const search = serializeCatalogQuery(
      {
        category: 'lighting',
        sub: 'lamps',
        min: 180,
        max: 14800,
        sellers: [],
        delivery: [],
        page: 1,
        sort: 'recommended',
      },
      { min: 180, max: 14800 },
    );

    expect(search.toString()).toBe('category=lighting&sub=lamps');
  });

  it('round-trips a shared catalog link', () => {
    const original = parseCatalogQuery(
      params('category=furniture&sellers=charge34,non-di&min=100&page=3&sort=newest'),
    );
    const href = catalogHref(original, { min: 80, max: 8750 });

    expect(href).toBe(
      '/catalog?category=furniture&min=100&sellers=charge34%2Cnon-di&page=3&sort=newest',
    );
    expect(parseCatalogQuery(params(href.slice('/catalog?'.length)))).toEqual(original);
  });
});
