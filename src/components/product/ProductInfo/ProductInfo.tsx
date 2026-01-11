import { Badge } from '@/components/ui';
import { formatCurrency } from '@/utils/format';
import type { Product } from '@/mocks/products';
import styles from './ProductInfo.module.css';

export interface ProductInfoProps {
  product: Product;
  onReviewClick?: () => void;
}

export function ProductInfo({ product, onReviewClick }: ProductInfoProps) {
  const {
    name,
    categoryName,
    price,
    originalPrice,
    origin,
    grade,
    weight,
    freeShipping,
    stock,
    rating,
    reviewCount,
    detail,
  } = product;

  const discountPercentage =
    originalPrice && originalPrice > price
      ? Math.round(((originalPrice - price) / originalPrice) * 100)
      : 0;

  const getStockStatus = () => {
    if (stock === 0) {
      return { status: 'outOfStock', text: '품절', className: styles.outOfStock };
    }
    if (stock <= 5) {
      return { status: 'lowStock', text: `${stock}개 남음`, className: styles.lowStock };
    }
    return { status: 'inStock', text: '재고 있음', className: styles.inStock };
  };

  const stockInfo = getStockStatus();

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(
          <svg
            key={i}
            className={`${styles.star} ${styles.starFilled}`}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z"
              clipRule="evenodd"
            />
          </svg>
        );
      } else if (i === fullStars && hasHalfStar) {
        stars.push(
          <svg
            key={i}
            className={`${styles.star} ${styles.starFilled}`}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z"
              clipRule="evenodd"
            />
          </svg>
        );
      } else {
        stars.push(
          <svg
            key={i}
            className={`${styles.star} ${styles.starEmpty}`}
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z"
            />
          </svg>
        );
      }
    }

    return stars;
  };

  return (
    <div className={styles.container}>
      {/* Category */}
      <span className={styles.category}>{categoryName}</span>

      {/* Title */}
      <h1 className={styles.title}>{name}</h1>

      {/* Rating */}
      <div className={styles.ratingWrapper}>
        <div className={styles.stars}>{renderStars(rating)}</div>
        <span className={styles.ratingScore}>{rating.toFixed(1)}</span>
        <button className={styles.reviewLink} onClick={onReviewClick} type="button">
          <span className={styles.reviewCount}>리뷰 {reviewCount.toLocaleString()}개</span>
        </button>
      </div>

      <div className={styles.divider} />

      {/* Price */}
      <div className={styles.priceSection}>
        <div className={styles.priceRow}>
          {discountPercentage > 0 && (
            <span className={styles.discountBadge}>{discountPercentage}%</span>
          )}
          <span className={styles.currentPrice}>{formatCurrency(price)}</span>
          {originalPrice && originalPrice > price && (
            <span className={styles.originalPrice}>{formatCurrency(originalPrice)}</span>
          )}
        </div>
      </div>

      {/* Badges */}
      <div className={styles.badges}>
        <Badge variant="primary">{grade}급</Badge>
        <Badge variant="default">{origin}</Badge>
        {weight && <Badge variant="default">{weight}</Badge>}
      </div>

      {/* Shipping Info */}
      {freeShipping ? (
        <div className={styles.shippingInfo}>
          <svg
            className={styles.shippingIcon}
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M8.25 18.75a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 0 1-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 0 0-3.213-9.193 2.056 2.056 0 0 0-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 0 0-10.026 0 1.106 1.106 0 0 0-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12"
            />
          </svg>
          <span className={styles.shippingText}>
            <span className={styles.shippingHighlight}>무료배송</span> | 오후 2시 이전 주문 시 당일
            발송
          </span>
        </div>
      ) : (
        <div className={styles.shippingInfo}>
          <svg
            className={styles.shippingIcon}
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M8.25 18.75a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 0 1-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 0 0-3.213-9.193 2.056 2.056 0 0 0-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 0 0-10.026 0 1.106 1.106 0 0 0-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12"
            />
          </svg>
          <span className={styles.shippingText}>
            배송비 3,000원 | 50,000원 이상 구매 시 무료배송
          </span>
        </div>
      )}

      {/* Stock Status */}
      <div className={`${styles.stockStatus} ${stockInfo.className}`}>
        {stockInfo.status === 'inStock' && (
          <svg
            className={styles.stockIcon}
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
            />
          </svg>
        )}
        {stockInfo.status === 'lowStock' && (
          <svg
            className={styles.stockIcon}
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
        )}
        {stockInfo.status === 'outOfStock' && (
          <svg
            className={styles.stockIcon}
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
            />
          </svg>
        )}
        <span className={styles.stockText}>{stockInfo.text}</span>
      </div>

      <div className={styles.divider} />

      {/* Product Info Table */}
      <div className={styles.infoTable}>
        <div className={styles.infoRow}>
          <span className={styles.infoLabel}>원산지</span>
          <span className={styles.infoValue}>{detail?.origin || origin}</span>
        </div>
        <div className={styles.infoRow}>
          <span className={styles.infoLabel}>중량</span>
          <span className={styles.infoValue}>{weight || '-'}</span>
        </div>
        <div className={styles.infoRow}>
          <span className={styles.infoLabel}>등급</span>
          <span className={styles.infoValue}>{grade}급</span>
        </div>
        {detail?.manufacturer && (
          <div className={styles.infoRow}>
            <span className={styles.infoLabel}>판매자</span>
            <span className={styles.infoValue}>{detail.manufacturer}</span>
          </div>
        )}
        {detail?.shelfLife && (
          <div className={styles.infoRow}>
            <span className={styles.infoLabel}>유통기한</span>
            <span className={styles.infoValue}>{detail.shelfLife}</span>
          </div>
        )}
        {detail?.storageMethod && (
          <div className={styles.infoRow}>
            <span className={styles.infoLabel}>보관방법</span>
            <span className={styles.infoValue}>{detail.storageMethod}</span>
          </div>
        )}
      </div>
    </div>
  );
}
