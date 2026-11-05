'use client';

import { useTranslation } from 'react-i18next';

import { PagePlaceholder } from '@/components/ui/PagePlaceholder';

type StubShopPageProps = {
  pageKey: string;
};

export function StubShopPage({ pageKey }: StubShopPageProps) {
  const { t } = useTranslation();

  return (
    <PagePlaceholder
      title={t(`pages.${pageKey}.title`)}
      description={t(`pages.${pageKey}.description`)}
    />
  );
}
