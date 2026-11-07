import { Suspense } from 'react';

import { CatalogPage } from '@/components/catalog/CatalogPage';

export default function Page() {
  return (
    <Suspense fallback={null}>
      <CatalogPage />
    </Suspense>
  );
}
