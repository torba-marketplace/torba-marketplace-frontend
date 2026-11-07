import { catalogCategories, type CatalogCategory } from '@/config/categories';
import type { CatalogCategoryFilters, CatalogFilterCount } from '@/types/catalog-filters';

type CategoryFilterSeed = {
  totalCount: number;
  price: { min: number; max: number };
  subcategoryCounts: Record<string, number>;
  sellers: CatalogCategoryFilters['sellers'];
  locationId: string;
  delivery: CatalogCategoryFilters['delivery'];
};

const sellers = {
  charge34: 'CHARGE34',
  superstore: 'superstore',
  megamarty: 'MegaMarty',
  nonDi: 'Non Di',
} as const;

// Temporary FE mock for the catalog filter sidebar.
// TODO: replace with GET /api/catalog/filters?category= when the Python API is available.
const filterSeeds: Record<string, CategoryFilterSeed> = {
  furniture: {
    totalCount: 10,
    price: { min: 80, max: 8750 },
    subcategoryCounts: { chairs: 2, sofas: 2, beds: 2, storage: 2, tables: 2 },
    sellers: [
      { id: 'charge34', name: sellers.charge34, count: 3 },
      { id: 'superstore', name: sellers.superstore, count: 3 },
      { id: 'megamarty', name: sellers.megamarty, count: 3 },
      { id: 'non-di', name: sellers.nonDi, count: 1 },
    ],
    locationId: 'irpin',
    delivery: [
      { id: 'delivery', count: 3 },
      { id: 'pickup', count: 3 },
    ],
  },
  clothing: {
    totalCount: 20,
    price: { min: 250, max: 6900 },
    subcategoryCounts: { tshirts: 4, shirts: 3, trousers: 5, outerwear: 2, shoes: 6 },
    sellers: [
      { id: 'charge34', name: sellers.charge34, count: 6 },
      { id: 'superstore', name: sellers.superstore, count: 8 },
      { id: 'megamarty', name: sellers.megamarty, count: 4 },
      { id: 'non-di', name: sellers.nonDi, count: 2 },
    ],
    locationId: 'lviv',
    delivery: [
      { id: 'delivery', count: 12 },
      { id: 'pickup', count: 5 },
    ],
  },
  electronics: {
    totalCount: 20,
    price: { min: 499, max: 56000 },
    subcategoryCounts: { scooters: 3, kitchen: 4, laptops: 6, chargers: 5, smartwatches: 2 },
    sellers: [
      { id: 'charge34', name: sellers.charge34, count: 7 },
      { id: 'superstore', name: sellers.superstore, count: 5 },
      { id: 'megamarty', name: sellers.megamarty, count: 6 },
      { id: 'non-di', name: sellers.nonDi, count: 2 },
    ],
    locationId: 'kyiv',
    delivery: [
      { id: 'delivery', count: 14 },
      { id: 'pickup', count: 4 },
    ],
  },
  lighting: {
    totalCount: 15,
    price: { min: 180, max: 14800 },
    subcategoryCounts: { lamps: 5, fixtures: 3, led: 4, chandeliers: 2, nightlights: 1 },
    sellers: [
      { id: 'charge34', name: sellers.charge34, count: 4 },
      { id: 'superstore', name: sellers.superstore, count: 5 },
      { id: 'megamarty', name: sellers.megamarty, count: 4 },
      { id: 'non-di', name: sellers.nonDi, count: 2 },
    ],
    locationId: 'odesa',
    delivery: [
      { id: 'delivery', count: 9 },
      { id: 'pickup', count: 3 },
    ],
  },
  power: {
    totalCount: 16,
    price: { min: 390, max: 89900 },
    subcategoryCounts: { stations: 4, generators: 2, powerbanks: 6, solar: 3, inverters: 1 },
    sellers: [
      { id: 'charge34', name: sellers.charge34, count: 8 },
      { id: 'superstore', name: sellers.superstore, count: 3 },
      { id: 'megamarty', name: sellers.megamarty, count: 4 },
      { id: 'non-di', name: sellers.nonDi, count: 1 },
    ],
    locationId: 'dnipro',
    delivery: [
      { id: 'delivery', count: 11 },
      { id: 'pickup', count: 2 },
    ],
  },
  garden: {
    totalCount: 18,
    price: { min: 120, max: 24000 },
    subcategoryCounts: { equipment: 3, irrigation: 2, plants: 8, pools: 1, tools: 4 },
    sellers: [
      { id: 'charge34', name: sellers.charge34, count: 4 },
      { id: 'superstore', name: sellers.superstore, count: 7 },
      { id: 'megamarty', name: sellers.megamarty, count: 5 },
      { id: 'non-di', name: sellers.nonDi, count: 2 },
    ],
    locationId: 'vinnytsia',
    delivery: [
      { id: 'delivery', count: 10 },
      { id: 'pickup', count: 6 },
    ],
  },
};

function subcategoryCounts(
  category: CatalogCategory,
  counts: Record<string, number>,
): CatalogFilterCount[] {
  return category.children.map((child) => {
    const count = counts[child.slug];

    if (count === undefined) {
      throw new Error(`Missing filter count for ${category.slug}/${child.slug}`);
    }

    return { slug: child.slug, count };
  });
}

export const catalogFiltersMock: CatalogCategoryFilters[] = catalogCategories.map((category) => {
  const seed = filterSeeds[category.slug];

  if (!seed) {
    throw new Error(`Missing catalog filters for ${category.slug}`);
  }

  return {
    categorySlug: category.slug,
    totalCount: seed.totalCount,
    price: { ...seed.price, currency: 'UAH' },
    subcategories: subcategoryCounts(category, seed.subcategoryCounts),
    sellers: seed.sellers,
    locationId: seed.locationId,
    delivery: seed.delivery,
  };
});

/**
 * Catalog filter sidebar for a category.
 * Swap the mock for `fetch(`${API}/catalog/filters?category=${categorySlug}`)` when the backend is ready.
 */
export async function getCatalogFilters(categorySlug: string): Promise<CatalogCategoryFilters> {
  const filters = catalogFiltersMock.find((item) => item.categorySlug === categorySlug);

  if (!filters) {
    throw new Error(`Unknown category filters: ${categorySlug}`);
  }

  return filters;
}
