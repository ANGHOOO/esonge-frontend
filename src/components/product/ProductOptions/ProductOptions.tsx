import { formatCurrency } from '@/utils/format';
import styles from './ProductOptions.module.css';

export interface ProductOptionsProps {
  price: number;
  stock: number;
  quantity: number;
  onQuantityChange: (quantity: number) => void;
  minQuantity?: number;
  maxQuantity?: number;
}

export function ProductOptions({
  price,
  stock,
  quantity,
  onQuantityChange,
  minQuantity = 1,
  maxQuantity,
}: ProductOptionsProps) {
  const effectiveMaxQuantity = maxQuantity ?? stock;
  const isOutOfStock = stock === 0;

  const handleDecrease = () => {
    if (quantity > minQuantity) {
      onQuantityChange(quantity - 1);
    }
  };

  const handleIncrease = () => {
    if (quantity < effectiveMaxQuantity) {
      onQuantityChange(quantity + 1);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);
    if (isNaN(value)) {
      return;
    }
    if (value < minQuantity) {
      onQuantityChange(minQuantity);
    } else if (value > effectiveMaxQuantity) {
      onQuantityChange(effectiveMaxQuantity);
    } else {
      onQuantityChange(value);
    }
  };

  const handleBlur = () => {
    if (quantity < minQuantity) {
      onQuantityChange(minQuantity);
    } else if (quantity > effectiveMaxQuantity) {
      onQuantityChange(effectiveMaxQuantity);
    }
  };

  const totalPrice = price * quantity;

  return (
    <div className={styles.container}>
      {/* Quantity Section */}
      <div className={styles.section}>
        <label className={styles.sectionLabel}>수량</label>
        <div className={styles.quantitySelector}>
          <button
            type="button"
            className={styles.quantityButton}
            onClick={handleDecrease}
            disabled={quantity <= minQuantity || isOutOfStock}
            aria-label="수량 감소"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14" />
            </svg>
          </button>
          <input
            type="number"
            className={styles.quantityInput}
            value={quantity}
            onChange={handleInputChange}
            onBlur={handleBlur}
            min={minQuantity}
            max={effectiveMaxQuantity}
            disabled={isOutOfStock}
            aria-label="수량"
          />
          <button
            type="button"
            className={styles.quantityButton}
            onClick={handleIncrease}
            disabled={quantity >= effectiveMaxQuantity || isOutOfStock}
            aria-label="수량 증가"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
          </button>
        </div>

        {/* Stock Warning */}
        {!isOutOfStock && stock <= 10 && (
          <div className={styles.stockWarning}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z"
              />
            </svg>
            <span>재고 {stock}개 남음</span>
          </div>
        )}
      </div>

      <div className={styles.divider} />

      {/* Total Price */}
      <div className={styles.totalSection}>
        <span className={styles.totalLabel}>총 상품 금액</span>
        <span className={styles.totalPrice}>{formatCurrency(totalPrice)}</span>
      </div>
    </div>
  );
}
