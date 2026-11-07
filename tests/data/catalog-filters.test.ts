import { describe, expect, it } from 'vitest';

import { catalogCategories } from '@/config/categories';
import { catalogFiltersMock, getCatalogFilters } from '@/data/catalog-filters';
import { findLocation } from '@/config/locations';

describe('catalogFiltersMock', () => {
  it('covers every current category and subcategory', () => {
    expect(catalogFiltersMock.map((item) => item.categorySlug)).toEqual(
      catalogCategories.map((category) => category.slug),
    );

    for (const category of catalogCategories) {
      const filters = catalogFiltersMock.find((item) => item.categorySlug === category.slug);

      expect(filters?.subcategories.map((item) => item.slug)).toEqual(
        category.children.map((child) => child.slug),
      );
      expect(filters?.subcategories.reduce((sum, item) => sum + item.count, 0)).toBe(
        filters?.totalCount,
      );
      expect(findLocation(filters!.locationId).id).toBe(filters?.locationId);
    }
  });

  it('returns furniture filters with the design price range', async () => {
    const filters = await getCatalogFilters('furniture');

    expect(filters.price).toEqual({ min: 80, max: 8750, currency: 'UAH' });
    expect(filters.totalCount).toBe(10);
    expect(filters.sellers.map((seller) => seller.name)).toEqual([
      'CHARGE34',
      'superstore',
      'MegaMarty',
      'Non Di',
    ]);
  });
});
