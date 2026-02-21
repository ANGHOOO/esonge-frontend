import { useMemo } from 'react';
import { Heart } from 'lucide-react';
import { toast } from 'sonner';
import { ROUTES } from '@/constants/routes';
import { Breadcrumbs } from '@/components/layout';
import { EmptyState } from '@/components/ui';
import { ProductGrid } from '@/components/product';
import { useWishlist, useCart } from '@/stores';
import { products, type Product } from '@/mocks/products';
import styles from './WishlistPage.module.css';

export function WishlistPage() {
  const { productIds, toggleItem, clearWishlist } = useWishlist();
  const { addItem } = useCart();

  const wishlistProducts = useMemo(() => {
    return products.filter((product) => productIds.includes(product.id));
  }, [productIds]);

  const isEmpty = wishlistProducts.length === 0;

  const handleAddToCart = (product: Product) => {
    if (product.stock === 0) {
      toast.error('품절된 상품입니다.');
      return;
    }
    addItem(product);
    toast.success(`${product.name}이(가) 장바구니에 추가되었습니다.`);
  };

  const handleToggleWishlist = (product: Product) => {
    toggleItem(product.id);
    toast.success('찜 목록에서 삭제되었습니다.');
  };

  const handleClearAll = () => {
    clearWishlist();
    toast.success('찜 목록이 비워졌습니다.');
  };

  const breadcrumbItems = [{ label: '찜 목록' }];

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <Breadcrumbs items={breadcrumbItems} />

        <div className={styles.header}>
          <h1 className={styles.title}>찜 목록</h1>
          {!isEmpty && (
            <button type="button" className={styles.clearButton} onClick={handleClearAll}>
              전체 삭제
            </button>
          )}
        </div>

        {isEmpty ? (
          <EmptyState
            icon={<Heart />}
            title="찜한 상품이 없습니다"
            description="마음에 드는 상품을 찜해보세요"
            actionLabel="쇼핑하러 가기"
            onAction={() => (window.location.href = ROUTES.PRODUCTS)}
          />
        ) : (
          <div className={styles.content}>
            <p className={styles.count}>총 {wishlistProducts.length}개 상품</p>
            <ProductGrid
              products={wishlistProducts}
              onAddToCart={handleAddToCart}
              onToggleWishlist={handleToggleWishlist}
              wishlistIds={productIds}
            />
          </div>
        )}
      </div>
    </div>
  );
}
