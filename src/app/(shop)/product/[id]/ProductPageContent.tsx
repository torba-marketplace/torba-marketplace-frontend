'use client';

import { use } from 'react';
import { useTranslation } from 'react-i18next';

import { PagePlaceholder } from '@/components/ui/PagePlaceholder';

type ProductPageContentProps = {
  params: Promise<{ id: string }>;
};

export function ProductPageContent({ params }: ProductPageContentProps) {
  const { id } = use(params);
  const { t } = useTranslation();

  return (
    <PagePlaceholder
      title={`${t('pages.product.title')} · ${id}`}
      description={t('pages.product.description')}
    />
  );
}
