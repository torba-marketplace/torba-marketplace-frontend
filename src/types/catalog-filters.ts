export type CatalogFilterCount = {
  slug: string;
  count: number;
};

export type CatalogSellerFilter = {
  id: string;
  name: string;
  count: number;
};

export type CatalogDeliveryFilter = {
  id: 'delivery' | 'pickup';
  count: number;
};

export type CatalogPriceFilter = {
  min: number;
  max: number;
  currency: 'UAH';
};

/** Sidebar filters for one catalog category. Subcategory names live in catalogCategories. */
export type CatalogCategoryFilters = {
  categorySlug: string;
  totalCount: number;
  price: CatalogPriceFilter;
  subcategories: CatalogFilterCount[];
  sellers: CatalogSellerFilter[];
  locationId: string;
  delivery: CatalogDeliveryFilter[];
};
