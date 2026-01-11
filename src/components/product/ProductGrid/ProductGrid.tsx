import { ProductCard } from '../ProductCard';
import { Skeleton } from '@/components/ui';
import type { Product } from '@/mocks/products';
import styles from './ProductGrid.module.css';

export interface ProductGridProps {
  products: Product[];
  onAddToCart?: (product: Product) => void;
  onToggleWishlist?: (product: Product) => void;
  wishlistIds?: string[];
  isLoading?: boolean;
  emptyMessage?: string;
}

export function ProductGrid({
  products,
  onAddToCart,
  onToggleWishlist,
  wishlistIds = [],
  isLoading = false,
  emptyMessage = '상품이 없습니다.',
}: ProductGridProps) {
  if (isLoading) {
    return (
      <div className={styles.grid}>
        {Array.from({ length: 8 }).map((_, index) => (
          <ProductCardSkeleton key={index} />
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className={styles.empty}>
        <p>{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className={styles.grid}>
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          onAddToCart={onAddToCart}
          onToggleWishlist={onToggleWishlist}
          isInWishlist={wishlistIds.includes(product.id)}
        />
      ))}
    </div>
  );
}

function ProductCardSkeleton() {
  return (
    <div className={styles.skeleton}>
      <Skeleton variant="rectangular" className={styles.skeletonImage} />
      <div className={styles.skeletonContent}>
        <Skeleton variant="text" width="40%" height={12} />
        <Skeleton variant="text" width="100%" height={16} />
        <Skeleton variant="text" width="60%" height={20} />
        <Skeleton variant="rectangular" width="100%" height={36} />
      </div>
    </div>
  );
}
