import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { ProductCard } from './ProductCard';
import type { Product } from '@/mocks/products';

const mockProduct: Product = {
  id: 'test-001',
  name: '테스트 버섯',
  price: 25000,
  images: ['/test-image.jpg'],
  category: 'mushroom',
  categoryName: '버섯류',
  origin: '국내산',
  grade: '상',
  freeShipping: false,
  stock: 10,
  createdAt: '2024-01-01',
  salesCount: 100,
  rating: 4.5,
  reviewCount: 25,
};

const mockProductWithDiscount: Product = {
  ...mockProduct,
  id: 'test-002',
  name: '할인 상품',
  originalPrice: 30000,
  price: 24000,
};

const mockProductOutOfStock: Product = {
  ...mockProduct,
  id: 'test-003',
  name: '품절 상품',
  stock: 0,
};

const mockProductWithFreeShipping: Product = {
  ...mockProduct,
  id: 'test-004',
  name: '무료배송 상품',
  freeShipping: true,
};

const mockProductPremium: Product = {
  ...mockProduct,
  id: 'test-005',
  name: '특상 상품',
  grade: '특상',
};

const renderProductCard = (product: Product = mockProduct, props = {}) => {
  return render(
    <BrowserRouter>
      <ProductCard product={product} {...props} />
    </BrowserRouter>
  );
};

describe('ProductCard', () => {
  describe('rendering', () => {
    it('should render product name', () => {
      renderProductCard();

      expect(screen.getByText('테스트 버섯')).toBeInTheDocument();
    });

    it('should render product category', () => {
      renderProductCard();

      expect(screen.getByText('버섯류')).toBeInTheDocument();
    });

    it('should render product price', () => {
      renderProductCard();

      expect(screen.getByText('25,000원')).toBeInTheDocument();
    });

    it('should render product image', () => {
      renderProductCard();

      const image = screen.getByAltText('테스트 버섯');
      expect(image).toBeInTheDocument();
      expect(image).toHaveAttribute('src', '/test-image.jpg');
    });

    it('should render rating and review count', () => {
      renderProductCard();

      expect(screen.getByText('★ 4.5')).toBeInTheDocument();
      expect(screen.getByText('(25)')).toBeInTheDocument();
    });

    it('should render link to product detail', () => {
      renderProductCard();

      const link = screen.getByRole('link', { name: '테스트 버섯 상품 보기' });
      expect(link).toHaveAttribute('href', '/products/test-001');
    });
  });

  describe('discount display', () => {
    it('should display discount percentage when product has original price', () => {
      renderProductCard(mockProductWithDiscount);

      // (30000 - 24000) / 30000 * 100 = 20%
      expect(screen.getByText('20%')).toBeInTheDocument();
    });

    it('should display original price with strikethrough', () => {
      renderProductCard(mockProductWithDiscount);

      expect(screen.getByText('30,000원')).toBeInTheDocument();
      expect(screen.getByText('24,000원')).toBeInTheDocument();
    });
  });

  describe('badges', () => {
    it('should display free shipping badge', () => {
      renderProductCard(mockProductWithFreeShipping);

      expect(screen.getByText('무료배송')).toBeInTheDocument();
    });

    it('should display premium grade badge', () => {
      renderProductCard(mockProductPremium);

      expect(screen.getByText('특상')).toBeInTheDocument();
    });
  });

  describe('out of stock', () => {
    it('should display sold out overlay', () => {
      renderProductCard(mockProductOutOfStock);

      // "품절" appears in both overlay and button
      const soldOutElements = screen.getAllByText('품절');
      expect(soldOutElements.length).toBe(2);
    });

    it('should disable add to cart button when out of stock', () => {
      renderProductCard(mockProductOutOfStock);

      const cartButton = screen.getByRole('button', { name: /품절/ });
      expect(cartButton).toBeDisabled();
    });
  });

  describe('add to cart', () => {
    it('should render add to cart button', () => {
      renderProductCard();

      expect(screen.getByRole('button', { name: /장바구니/ })).toBeInTheDocument();
    });

    it('should call onAddToCart when cart button is clicked', async () => {
      const user = userEvent.setup();
      const onAddToCart = vi.fn();
      renderProductCard(mockProduct, { onAddToCart });

      const cartButton = screen.getByRole('button', { name: /장바구니/ });
      await user.click(cartButton);

      expect(onAddToCart).toHaveBeenCalledWith(mockProduct);
    });

    it('should not call onAddToCart when product is out of stock', async () => {
      const user = userEvent.setup();
      const onAddToCart = vi.fn();
      renderProductCard(mockProductOutOfStock, { onAddToCart });

      const cartButton = screen.getByRole('button', { name: /품절/ });
      await user.click(cartButton);

      expect(onAddToCart).not.toHaveBeenCalled();
    });
  });

  describe('wishlist', () => {
    it('should render wishlist button', () => {
      renderProductCard();

      expect(screen.getByRole('button', { name: '찜하기' })).toBeInTheDocument();
    });

    it('should show different label when in wishlist', () => {
      renderProductCard(mockProduct, { isInWishlist: true });

      expect(screen.getByRole('button', { name: '찜 해제' })).toBeInTheDocument();
    });

    it('should call onToggleWishlist when wishlist button is clicked', async () => {
      const user = userEvent.setup();
      const onToggleWishlist = vi.fn();
      renderProductCard(mockProduct, { onToggleWishlist });

      const wishlistButton = screen.getByRole('button', { name: '찜하기' });
      await user.click(wishlistButton);

      expect(onToggleWishlist).toHaveBeenCalledWith(mockProduct);
    });
  });

  describe('no reviews', () => {
    it('should not display rating when product has no reviews', () => {
      const productWithNoReviews: Product = {
        ...mockProduct,
        reviewCount: 0,
      };
      renderProductCard(productWithNoReviews);

      expect(screen.queryByText(/★/)).not.toBeInTheDocument();
    });
  });
});
