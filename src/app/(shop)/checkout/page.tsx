'use client';

import { useTranslation } from 'react-i18next';

import { PagePlaceholder } from '@/components/ui/PagePlaceholder';

export default function CheckoutPage() {
  const { t } = useTranslation();

  return (
    <PagePlaceholder
      title={t('pages.checkout.title')}
      description={t('pages.checkout.description')}
    />
  );
}
