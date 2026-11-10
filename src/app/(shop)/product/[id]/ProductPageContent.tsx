'use client';

import { use } from 'react';
import { useTranslation } from 'react-i18next';

import { ProductBreadcrumbs } from '@/components/product/ProductBreadcrumbs';
import { ProductDetails } from '@/components/product/ProductDetails';
import { ProductGallery } from '@/components/product/ProductGallery';
import { ProductRail } from '@/components/product/ProductRail';
import { PurchasePanel } from '@/components/product/PurchasePanel';
import { PagePlaceholder } from '@/components/ui/PagePlaceholder';
import { catalogCategories } from '@/config/categories';
import { getProductDetail } from '@/data/product-page';
import { catalogHref } from '@/lib/catalog-query';

type ProductPageContentProps = {
  params: Promise<{ id: string }>;
};

export function ProductPageContent({ params }: ProductPageContentProps) {
  const { id } = use(params);
  const { t } = useTranslation();
  const product = getProductDetail(id);

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
    <div className="catalog-frame flex w-full flex-col gap-[30px] pt-7 pb-14">
      <ProductBreadcrumbs product={product} />
      <section className="flex flex-col gap-8 xl:flex-row xl:items-start xl:gap-12">
        <ProductGallery product={product} />
        <PurchasePanel product={product} />
      </section>
      <ProductDetails product={product} />
      <ProductRail title={t('pages.product.similar')} href={moreHref} products={product.similar} />
      <ProductRail title={t('pages.product.recent')} href={moreHref} products={product.recent} />
    </div>
  );
}
