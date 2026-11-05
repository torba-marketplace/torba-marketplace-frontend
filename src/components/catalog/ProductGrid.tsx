import { ProductCard } from '@/components/home/ProductCard';
import type { HomeProduct } from '@/types/home';

type ProductGridProps = {
  products: HomeProduct[];
  emptyMessage: string;
};

export function ProductGrid({ products, emptyMessage }: ProductGridProps) {
  if (products.length === 0) {
    return <p className="py-12 text-center text-(--color-muted)">{emptyMessage}</p>;
  }

  return (
    <ul className="grid grid-cols-2 gap-x-6 gap-y-8 lg:grid-cols-4">
      {products.map((product) => (
        <li key={product.id} className="h-full">
          <ProductCard product={product} />
        </li>
      ))}
    </ul>
  );
}
