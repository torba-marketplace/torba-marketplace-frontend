'use client';

import { use, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import { ProductBreadcrumbs } from '@/components/product/ProductBreadcrumbs';
import { ProductDetails } from '@/components/product/ProductDetails';
import { ProductGallery } from '@/components/product/ProductGallery';
import { ProductRail } from '@/components/product/ProductRail';
import { PurchasePanel } from '@/components/product/PurchasePanel';
import { PagePlaceholder } from '@/components/ui/PagePlaceholder';
import { catalogCategories } from '@/config/categories';
import { getProductDetail, relatedCardFor, type RelatedCard } from '@/data/product-page';
import { catalogHref } from '@/lib/catalog-query';
import { rememberProductView, useRecentProductIds } from '@/lib/shop-lists';

type ProductPageContentProps = {
  params: Promise<{ id: string }>;
};

export function ProductPageContent({ params }: ProductPageContentProps) {
  const { id } = use(params);
  const { t } = useTranslation();
  const product = getProductDetail(id);
  const recentIds = useRecentProductIds();
  const seenCards = recentIds
    .filter((itemId) => itemId !== id)
    .map((itemId) => relatedCardFor(itemId))
    .filter((card): card is RelatedCard => card !== null);
  const recentProducts = product
    ? [
        ...seenCards,
        ...product.recent.filter(
          (card) => card.id !== id && !seenCards.some((item) => item.id === card.id),
        ),
      ].slice(0, 5)
    : [];

  useEffect(() => {
    if (getProductDetail(id)) {
      rememberProductView(id);
    }
  }, [id]);

  if (!product) {
    return (
      <PagePlaceholder
        title={`${t('pages.product.title')} · ${id}`}
        description={t('pages.product.description')}
      />
    );
  }

  const knownCategory = catalogCategories.some((item) => item.slug === product.categorySlug);
  const moreHref = catalogHref({
    category: knownCategory ? product.categorySlug : null,
    sub: null,
    min: null,
    max: null,
    sellers: [],
    delivery: [],
    page: 1,
    sort: 'recommended',
  });

  return (
    <div className="catalog-frame flex w-full flex-col gap-4 py-6 xl:gap-[30px] xl:pt-7 xl:pb-14">
      <ProductBreadcrumbs product={product} />
      <section className="flex flex-col gap-4 xl:flex-row xl:items-start xl:gap-12">
        <ProductGallery product={product} />
        <PurchasePanel product={product} />
      </section>
      <ProductDetails product={product} />
      <ProductRail title={t('pages.product.similar')} href={moreHref} products={product.similar} />
      <ProductRail title={t('pages.product.recent')} href={moreHref} products={recentProducts} />
    </div>
  );
}
