import { useState, useEffect, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import {
  ProductImageGallery,
  ProductInfo,
  ProductOptions,
  ProductActions,
  ProductTabs,
  RelatedProducts,
} from '@/components/product';
import type { TabId } from '@/components/product';
import { useCart, useWishlist } from '@/stores';
import { getProductById, type Product } from '@/mocks/products';
import { ROUTES } from '@/constants/routes';
import styles from './ProductDetailPage.module.css';

export function ProductDetailPage() {
  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();
  const tabsRef = useRef<HTMLDivElement>(null);
  const { addItem } = useCart();
  const { isInWishlist, toggleItem: toggleWishlist } = useWishlist();

  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<TabId>('description');

  const isWishlisted = productId ? isInWishlist(productId) : false;

  useEffect(() => {
    const loadProduct = async () => {
      setIsLoading(true);

      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 300));

      if (productId) {
        const foundProduct = getProductById(productId);
        setProduct(foundProduct || null);
      }

      setIsLoading(false);
    };

    loadProduct();
    setQuantity(1);
    window.scrollTo(0, 0);
  }, [productId]);

  const handleQuantityChange = (newQuantity: number) => {
    setQuantity(newQuantity);
  };

  const handleAddToCart = () => {
    if (!product) return;
    if (product.stock === 0) {
      toast.error('품절된 상품입니다.');
      return;
    }
    addItem(product, quantity);
    toast.success(`${product.name}이(가) 장바구니에 추가되었습니다.`);
  };

  const handleBuyNow = () => {
    if (!product) return;
    if (product.stock === 0) {
      toast.error('품절된 상품입니다.');
      return;
    }
    addItem(product, quantity);
    navigate(ROUTES.CART);
  };

  const handleWishlistToggle = () => {
    if (!productId) return;
    toggleWishlist(productId);
    if (isWishlisted) {
      toast.success('찜 목록에서 삭제되었습니다.');
    } else {
      toast.success('찜 목록에 추가되었습니다.');
    }
  };

  const handleReviewClick = () => {
    setActiveTab('reviews');
    if (tabsRef.current) {
      tabsRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleTabChange = (tab: TabId) => {
    setActiveTab(tab);
  };

  if (isLoading) {
    return (
      <div className={styles.loading}>
        <div className={styles.spinner} />
        <span>상품을 불러오는 중...</span>
      </div>
    );
  }

  if (!product) {
    return (
      <div className={styles.notFound}>
        <svg
          className={styles.notFoundIcon}
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
          />
        </svg>
        <h1 className={styles.notFoundTitle}>상품을 찾을 수 없습니다</h1>
        <p className={styles.notFoundText}>요청하신 상품이 존재하지 않거나 삭제되었습니다.</p>
        <Link to="/products" className={styles.backButton}>
          상품 목록으로 돌아가기
        </Link>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <main className={styles.main}>
        {/* Breadcrumb */}
        <nav className={styles.breadcrumb}>
          <Link to="/" className={styles.breadcrumbLink}>
            홈
          </Link>
          <span className={styles.breadcrumbSeparator}>/</span>
          <Link to="/products" className={styles.breadcrumbLink}>
            상품
          </Link>
          <span className={styles.breadcrumbSeparator}>/</span>
          <Link to={`/products?category=${product.category}`} className={styles.breadcrumbLink}>
            {product.categoryName}
          </Link>
          <span className={styles.breadcrumbSeparator}>/</span>
          <span className={styles.breadcrumbCurrent}>{product.name}</span>
        </nav>

        {/* Product Section */}
        <section className={styles.productSection}>
          {/* Left Column - Image Gallery */}
          <div className={styles.imageColumn}>
            <ProductImageGallery images={product.images} productName={product.name} />
          </div>

          {/* Right Column - Product Info & Actions */}
          <div className={styles.infoColumn}>
            <ProductInfo product={product} onReviewClick={handleReviewClick} />

            <div className={styles.divider} />

            <ProductOptions
              price={product.price}
              stock={product.stock}
              quantity={quantity}
              onQuantityChange={handleQuantityChange}
            />

            <ProductActions
              productId={product.id}
              productName={product.name}
              stock={product.stock}
              isWishlisted={isWishlisted}
              onAddToCart={handleAddToCart}
              onBuyNow={handleBuyNow}
              onWishlistToggle={handleWishlistToggle}
            />
          </div>
        </section>

        {/* Tabs Section */}
        <section className={styles.tabsSection} ref={tabsRef}>
          <ProductTabs product={product} activeTab={activeTab} onTabChange={handleTabChange} />
        </section>

        {/* Related Products Section */}
        <section className={styles.relatedSection}>
          <RelatedProducts currentProductId={product.id} category={product.category} />
        </section>
      </main>
    </div>
  );
}
