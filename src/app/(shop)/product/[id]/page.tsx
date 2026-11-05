import { Suspense } from 'react';

import { ProductPageContent } from '@/app/(shop)/product/[id]/ProductPageContent';

export default function ProductPage({ params }: PageProps<'/product/[id]'>) {
  return (
    <Suspense fallback={null}>
      <ProductPageContent params={params} />
    </Suspense>
  );
}
