import type { CatalogDeliveryFilter } from '@/types/catalog-filters';
import type { HomeProduct } from '@/types/home';

export type CatalogProduct = HomeProduct & {
  categorySlug: string;
  subcategorySlug: string;
  sellerId: string;
  offers: Array<CatalogDeliveryFilter['id']>;
};
