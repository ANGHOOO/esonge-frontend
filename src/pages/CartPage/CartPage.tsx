import { Link } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';
import { ROUTES } from '@/constants/routes';
import { Breadcrumbs } from '@/components/layout';
import { EmptyState, Button } from '@/components/ui';
import styles from './CartPage.module.css';

export function CartPage() {
  // TODO: Replace with actual cart state from Zustand store
  const cartItems: unknown[] = [];
  const isEmpty = cartItems.length === 0;

  const breadcrumbItems = [{ label: '장바구니' }];

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <Breadcrumbs items={breadcrumbItems} />

        <h1 className={styles.title}>장바구니</h1>

        {isEmpty ? (
          <EmptyState
            icon={<ShoppingCart />}
            title="장바구니가 비어있습니다"
            description="원하는 상품을 장바구니에 담아보세요"
            actionLabel="쇼핑하러 가기"
            onAction={() => (window.location.href = ROUTES.PRODUCTS)}
          />
        ) : (
          <div className={styles.content}>
            {/* Cart Items */}
            <div className={styles.cartItems}>
              <p className={styles.placeholder}>장바구니 상품 목록이 여기에 표시됩니다</p>
            </div>

            {/* Cart Summary */}
            <aside className={styles.summary}>
              <h2 className={styles.summaryTitle}>주문 요약</h2>
              <div className={styles.summaryRow}>
                <span>상품 금액</span>
                <span>0원</span>
              </div>
              <div className={styles.summaryRow}>
                <span>배송비</span>
                <span>0원</span>
              </div>
              <div className={styles.summaryDivider} />
              <div className={styles.summaryTotal}>
                <span>총 결제금액</span>
                <span>0원</span>
              </div>
              <Link to={ROUTES.CHECKOUT}>
                <Button size="lg" fullWidth>
                  주문하기
                </Button>
              </Link>
            </aside>
          </div>
        )}
      </div>
    </div>
  );
}
