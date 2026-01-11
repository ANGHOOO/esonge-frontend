import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingCart } from 'lucide-react';
import { ROUTES } from '@/constants/routes';
import { Badge } from '@/components/ui';
import type { Product } from '@/mocks/products';
import styles from './ProductCard.module.css';

export interface ProductCardProps {
  product: Product;
  onAddToCart?: (product: Product) => void;
  onToggleWishlist?: (product: Product) => void;
  isInWishlist?: boolean;
}

export function ProductCard({
  product,
  onAddToCart,
  onToggleWishlist,
  isInWishlist = false,
}: ProductCardProps) {
  const [imageError, setImageError] = useState(false);

  const discountPercent =
    product.originalPrice && product.originalPrice > product.price
      ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
      : 0;

  const isOutOfStock = product.stock === 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isOutOfStock && onAddToCart) {
      onAddToCart(product);
    }
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onToggleWishlist?.(product);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ko-KR').format(price);
  };

  return (
    <Link
      to={`${ROUTES.PRODUCTS}/${product.id}`}
      className={styles.card}
      aria-label={`${product.name} 상품 보기`}
    >
      {/* Image Container */}
      <div className={styles.imageContainer}>
        {imageError ? (
          <div className={styles.imagePlaceholder}>
            <span>이미지 없음</span>
          </div>
        ) : (
          <img
            src={product.images[0]}
            alt={product.name}
            className={styles.image}
            loading="lazy"
            onError={() => setImageError(true)}
          />
        )}

        {/* Out of Stock Overlay */}
        {isOutOfStock && (
          <div className={styles.outOfStockOverlay}>
            <span>품절</span>
          </div>
        )}

        {/* Badges */}
        <div className={styles.badges}>
          {discountPercent > 0 && (
            <Badge variant="error" size="sm">
              {discountPercent}%
            </Badge>
          )}
          {product.freeShipping && (
            <Badge variant="primary" size="sm">
              무료배송
            </Badge>
          )}
          {product.grade === '특상' && (
            <Badge variant="success" size="sm">
              특상
            </Badge>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          className={`${styles.wishlistButton} ${isInWishlist ? styles.active : ''}`}
          onClick={handleToggleWishlist}
          aria-label={isInWishlist ? '찜 해제' : '찜하기'}
          type="button"
        >
          <Heart className={isInWishlist ? styles.heartFilled : styles.heartOutline} />
        </button>
      </div>

      {/* Content */}
      <div className={styles.content}>
        {/* Category */}
        <span className={styles.category}>{product.categoryName}</span>

        {/* Product Name */}
        <h3 className={styles.name}>{product.name}</h3>

        {/* Price */}
        <div className={styles.priceContainer}>
          {product.originalPrice && product.originalPrice > product.price && (
            <span className={styles.originalPrice}>{formatPrice(product.originalPrice)}원</span>
          )}
          <span className={styles.price}>{formatPrice(product.price)}원</span>
        </div>

        {/* Rating & Reviews */}
        {product.reviewCount > 0 && (
          <div className={styles.rating}>
            <span className={styles.stars}>★ {product.rating.toFixed(1)}</span>
            <span className={styles.reviewCount}>({product.reviewCount})</span>
          </div>
        )}

        {/* Add to Cart Button */}
        <button
          className={`${styles.addToCartButton} ${isOutOfStock ? styles.disabled : ''}`}
          onClick={handleAddToCart}
          disabled={isOutOfStock}
          type="button"
        >
          <ShoppingCart className={styles.cartIcon} />
          <span>{isOutOfStock ? '품절' : '장바구니'}</span>
        </button>
      </div>
    </Link>
  );
}
