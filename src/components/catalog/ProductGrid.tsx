import { ProductCard } from '@/components/home/ProductCard';
import type { HomeProduct } from '@/types/home';

import { cn } from '@/lib/cn';

type ProductGridProps = {
  products: HomeProduct[];
  emptyMessage: string;
  columns?: 3 | 4;
};

export function ProductGrid({ products, emptyMessage, columns = 4 }: ProductGridProps) {
  if (products.length === 0) {
    return <p className="py-12 text-center text-(--color-muted)">{emptyMessage}</p>;
  }

  return (
    <ul
      className={cn(
        'grid grid-cols-2 gap-x-6 gap-y-8',
        columns === 3 ? 'lg:grid-cols-3' : 'lg:grid-cols-4',
      )}
    >
      {products.map((product) => (
        <li key={product.id} className="h-full">
          <ProductCard product={product} titleVariant="catalog" />
        </li>
      ))}
    </ul>
  );
}
