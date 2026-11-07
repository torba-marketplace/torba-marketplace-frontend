import { catalogCategories } from '@/config/categories';
import { catalogFiltersMock } from '@/data/catalog-filters';
import { findLocation } from '@/config/locations';
import type { LocalizedText } from '@/lib/localized';
import type { CatalogProduct } from '@/types/catalog';
import type { ProductBadge } from '@/types/home';

const images = [
  '/image/home/product-1.png',
  '/image/home/product-2.png',
  '/image/home/product-3.png',
  '/image/home/product-4.png',
  '/image/home/product-5.png',
  '/image/home/product-6.png',
  '/image/home/product-7.png',
  '/image/home/product-8.png',
] as const;

const inStock: LocalizedText = { uk: 'В наявності', en: 'In stock' };
const unavailable: LocalizedText = { uk: 'Недоступно', en: 'Unavailable' };
const deliveryDate: LocalizedText = { uk: 'Доставка 20 січня', en: 'Delivery Jan 20' };

const badges: Array<ProductBadge | undefined> = [undefined, 'new', 'trend', 'recommended'];

function dayStamp(index: number): string {
  const date = new Date(Date.UTC(2026, 9, 28));
  date.setUTCDate(date.getUTCDate() - index);

  return date.toISOString();
}

// Temporary catalog listings for the category page.
// TODO: replace with GET /api/catalog/products when the Python API is available.
export function createCatalogProducts(): CatalogProduct[] {
  const products: CatalogProduct[] = [];

  for (const filters of catalogFiltersMock) {
    const category = catalogCategories.find((item) => item.slug === filters.categorySlug);

    if (!category) {
      continue;
    }

    const sellerQueue = filters.sellers.flatMap((seller) =>
      Array.from({ length: seller.count }, () => seller),
    );
    const deliveryCount = filters.delivery.find((item) => item.id === 'delivery')?.count ?? 0;
    const pickupCount = filters.delivery.find((item) => item.id === 'pickup')?.count ?? 0;
    const location = findLocation(filters.locationId);
    let index = 0;

    for (const subcategory of filters.subcategories) {
      const child = category.children.find((item) => item.slug === subcategory.slug);

      if (!child) {
        continue;
      }

      for (let itemIndex = 0; itemIndex < subcategory.count; itemIndex += 1) {
        const seller = sellerQueue[index] ?? filters.sellers[0];
        const span = filters.price.max - filters.price.min;
        const price =
          filters.totalCount <= 1
            ? filters.price.min
            : filters.price.min + Math.round((span * index) / (filters.totalCount - 1));
        const offers: CatalogProduct['offers'] = [];

        if (index < deliveryCount) {
          offers.push('delivery');
        }

        if (index >= filters.totalCount - pickupCount) {
          offers.push('pickup');
        }

        products.push({
          id: `${category.slug}-${child.slug}-${itemIndex + 1}`,
          title: `${child.name.uk} ${itemIndex + 1}`,
          price: { amount: price, currency: 'UAH' },
          oldPrice:
            index % 2 === 0 ? { amount: Math.round(price * 1.35), currency: 'UAH' } : undefined,
          imageUrl: images[index % images.length],
          location: location.city.uk,
          createdAt: dayStamp(index),
          badge: badges[index % badges.length],
          categoryName: category.name,
          categorySlug: category.slug,
          subcategorySlug: child.slug,
          availability: index % 4 === 3 ? unavailable : index % 3 === 0 ? deliveryDate : inStock,
          sellerId: seller.id,
          sellerName: seller.name,
          offers,
        });

        index += 1;
      }
    }
  }

  return products;
}

export const catalogProducts = createCatalogProducts();
