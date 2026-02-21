import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Minus, Plus, X, AlertCircle } from 'lucide-react';
import { ROUTES } from '@/constants/routes';
import type { CartItem as CartItemType } from '@/stores/useCart';
import styles from './CartItem.module.css';

export interface CartItemProps {
  item: CartItemType;
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemove: (productId: string) => void;
}

export function CartItem({ item, onUpdateQuantity, onRemove }: CartItemProps) {
  const { product, quantity } = item;
  const [imageError, setImageError] = useState(false);

  const isLowStock = product.stock > 0 && product.stock <= 5;
  const isOverStock = quantity > product.stock;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ko-KR').format(price);
  };

  const handleDecrease = () => {
    if (quantity > 1) {
      onUpdateQuantity(product.id, quantity - 1);
    }
  };

  const handleIncrease = () => {
    if (quantity < product.stock) {
      onUpdateQuantity(product.id, quantity + 1);
    }
  };

  const subtotal = product.price * quantity;

  return (
    <div className={styles.item}>
      {/* Product Image */}
      <Link to={`${ROUTES.PRODUCTS}/${product.id}`} className={styles.imageLink}>
        {imageError ? (
          <div className={styles.imagePlaceholder}>
            <span>이미지 없음</span>
          </div>
        ) : (
          <img
            src={product.images[0]}
            alt={product.name}
            className={styles.image}
            onError={() => setImageError(true)}
          />
        )}
      </Link>

      {/* Product Info */}
      <div className={styles.info}>
        <span className={styles.category}>{product.categoryName}</span>
        <Link to={`${ROUTES.PRODUCTS}/${product.id}`} className={styles.name}>
          {product.name}
        </Link>

        {/* Price */}
        <div className={styles.priceRow}>
          {product.originalPrice && product.originalPrice > product.price && (
            <span className={styles.originalPrice}>{formatPrice(product.originalPrice)}원</span>
          )}
          <span className={styles.price}>{formatPrice(product.price)}원</span>
        </div>

        {/* Stock Warning */}
        {isLowStock && (
          <div className={styles.stockWarning}>
            <AlertCircle className={styles.warningIcon} />
            <span>재고 {product.stock}개 남음</span>
          </div>
        )}
        {isOverStock && (
          <div className={styles.stockError}>
            <AlertCircle className={styles.warningIcon} />
            <span>재고 부족 (최대 {product.stock}개)</span>
          </div>
        )}
      </div>

      {/* Quantity Controls */}
      <div className={styles.quantityControls}>
        <button
          type="button"
          className={styles.quantityButton}
          onClick={handleDecrease}
          disabled={quantity <= 1}
          aria-label="수량 감소"
        >
          <Minus />
        </button>
        <span className={styles.quantity}>{quantity}</span>
        <button
          type="button"
          className={styles.quantityButton}
          onClick={handleIncrease}
          disabled={quantity >= product.stock}
          aria-label="수량 증가"
        >
          <Plus />
        </button>
      </div>

      {/* Subtotal */}
      <div className={styles.subtotal}>
        <span className={styles.subtotalLabel}>소계</span>
        <span className={styles.subtotalPrice}>{formatPrice(subtotal)}원</span>
      </div>

      {/* Remove Button */}
      <button
        type="button"
        className={styles.removeButton}
        onClick={() => onRemove(product.id)}
        aria-label="상품 삭제"
      >
        <X />
      </button>
    </div>
  );
}
