export const CATALOG_PAGE_SIZE = 9;

export const CATALOG_SORTS = ['recommended', 'price-asc', 'price-desc', 'newest'] as const;

export type CatalogSort = (typeof CATALOG_SORTS)[number];

export const CATALOG_DELIVERY = ['delivery', 'pickup'] as const;

export type CatalogDeliveryId = (typeof CATALOG_DELIVERY)[number];

export type CatalogQuery = {
  category: string | null;
  sub: string | null;
  min: number | null;
  max: number | null;
  sellers: string[];
  delivery: CatalogDeliveryId[];
  page: number;
  sort: CatalogSort;
};

type SearchParamsLike = {
  get(name: string): string | null;
};

export type CatalogPriceBounds = {
  min: number;
  max: number;
};

function readNumber(value: string | null): number | null {
  if (value === null || value.trim() === '') {
    return null;
  }

  const parsed = Number(value);

  return Number.isFinite(parsed) ? parsed : null;
}

function readList(value: string | null): string[] {
  if (!value) {
    return [];
  }

  return [
    ...new Set(
      value
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean),
    ),
  ];
}

function readPage(value: string | null): number {
  const parsed = Number(value);

  if (!Number.isInteger(parsed) || parsed < 1) {
    return 1;
  }

  return parsed;
}

function readSort(value: string | null): CatalogSort {
  if (value && CATALOG_SORTS.includes(value as CatalogSort)) {
    return value as CatalogSort;
  }

  return 'recommended';
}

function readDelivery(value: string | null): CatalogDeliveryId[] {
  const allowed = new Set<string>(CATALOG_DELIVERY);

  return readList(value).filter((item): item is CatalogDeliveryId => allowed.has(item));
}

export function parseCatalogQuery(params: SearchParamsLike): CatalogQuery {
  const category = params.get('category')?.trim() || null;
  const sub = params.get('sub')?.trim() || null;

  return {
    category,
    sub,
    min: readNumber(params.get('min')),
    max: readNumber(params.get('max')),
    sellers: readList(params.get('sellers')),
    delivery: readDelivery(params.get('delivery')),
    page: readPage(params.get('page')),
    sort: readSort(params.get('sort')),
  };
}

export function serializeCatalogQuery(
  query: CatalogQuery,
  price?: CatalogPriceBounds,
): URLSearchParams {
  const params = new URLSearchParams();

  if (query.category) {
    params.set('category', query.category);
  }

  if (query.sub) {
    params.set('sub', query.sub);
  }

  if (query.min !== null && query.min !== price?.min) {
    params.set('min', String(query.min));
  }

  if (query.max !== null && query.max !== price?.max) {
    params.set('max', String(query.max));
  }

  if (query.sellers.length > 0) {
    params.set('sellers', query.sellers.join(','));
  }

  if (query.delivery.length > 0) {
    params.set('delivery', query.delivery.join(','));
  }

  if (query.page > 1) {
    params.set('page', String(query.page));
  }

  if (query.sort !== 'recommended') {
    params.set('sort', query.sort);
  }

  return params;
}

export function catalogHref(query: CatalogQuery, price?: CatalogPriceBounds): string {
  const search = serializeCatalogQuery(query, price).toString();

  return search ? `/catalog?${search}` : '/catalog';
}
