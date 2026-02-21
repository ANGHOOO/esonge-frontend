import { Link } from 'react-router-dom';
import { ShoppingCart, Trash2 } from 'lucide-react';
import { ROUTES } from '@/constants/routes';
import { Breadcrumbs } from '@/components/layout';
import { EmptyState, Button } from '@/components/ui';
import { CartItem } from '@/components/cart';
import { useCart } from '@/stores';
import styles from './CartPage.module.css';

const FREE_SHIPPING_THRESHOLD = 50000;

export function CartPage() {
  const {
    items,
    removeItem,
    updateQuantity,
    clearCart,
    getTotalPrice,
    getShippingFee,
    getFinalPrice,
  } = useCart();

  const isEmpty = items.length === 0;
  const totalPrice = getTotalPrice();
  const shippingFee = getShippingFee();
  const finalPrice = getFinalPrice();
  const remainingForFreeShipping = FREE_SHIPPING_THRESHOLD - totalPrice;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ko-KR').format(price);
  };

  const breadcrumbItems = [{ label: '장바구니' }];

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <Breadcrumbs items={breadcrumbItems} />

        <div className={styles.header}>
          <h1 className={styles.title}>장바구니</h1>
          {!isEmpty && (
            <button type="button" className={styles.clearButton} onClick={clearCart}>
              <Trash2 />
              <span>전체 삭제</span>
            </button>
          )}
        </div>

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
              <div className={styles.itemCount}>
                총 <strong>{items.length}</strong>개 상품
              </div>
              {items.map((item) => (
                <CartItem
                  key={item.product.id}
                  item={item}
                  onUpdateQuantity={updateQuantity}
                  onRemove={removeItem}
                />
              ))}
            </div>

            {/* Cart Summary */}
            <aside className={styles.summary}>
              <h2 className={styles.summaryTitle}>주문 요약</h2>

              {/* Free Shipping Progress */}
              {remainingForFreeShipping > 0 && shippingFee > 0 && (
                <div className={styles.freeShippingNotice}>
                  <span>
                    {formatPrice(remainingForFreeShipping)}원 더 담으면 <strong>무료배송!</strong>
                  </span>
                  <div className={styles.progressBar}>
                    <div
                      className={styles.progressFill}
                      style={{
                        width: `${Math.min((totalPrice / FREE_SHIPPING_THRESHOLD) * 100, 100)}%`,
                      }}
                    />
                  </div>
                </div>
              )}

              <div className={styles.summaryRow}>
                <span>상품 금액</span>
                <span>{formatPrice(totalPrice)}원</span>
              </div>
              <div className={styles.summaryRow}>
                <span>배송비</span>
                <span className={shippingFee === 0 ? styles.free : ''}>
                  {shippingFee === 0 ? '무료' : `${formatPrice(shippingFee)}원`}
                </span>
              </div>
              <div className={styles.summaryDivider} />
              <div className={styles.summaryTotal}>
                <span>총 결제금액</span>
                <span>{formatPrice(finalPrice)}원</span>
              </div>
              <Link to={ROUTES.CHECKOUT}>
                <Button size="lg" fullWidth>
                  주문하기
                </Button>
              </Link>
              <Link to={ROUTES.PRODUCTS} className={styles.continueLink}>
                쇼핑 계속하기
              </Link>
            </aside>
          </div>
        )}
      </div>
    </div>
  );
}
