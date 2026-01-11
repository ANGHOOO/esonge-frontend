import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { CartPage } from './CartPage';
import { useCart } from '@/stores';
import type { Product } from '@/mocks/products';

const mockProduct1: Product = {
  id: 'test-001',
  name: '테스트 상품 1',
  price: 10000,
  images: ['/test1.jpg'],
  category: 'test',
  categoryName: '테스트',
  origin: '국내산',
  grade: '상',
  freeShipping: false,
  stock: 10,
  createdAt: '2024-01-01',
  salesCount: 0,
  rating: 4.5,
  reviewCount: 0,
};

const mockProduct2: Product = {
  id: 'test-002',
  name: '테스트 상품 2',
  price: 30000,
  images: ['/test2.jpg'],
  category: 'test',
  categoryName: '테스트',
  origin: '국내산',
  grade: '특상',
  freeShipping: true,
  stock: 5,
  createdAt: '2024-01-01',
  salesCount: 0,
  rating: 4.8,
  reviewCount: 0,
};

const renderCartPage = () => {
  return render(
    <BrowserRouter>
      <CartPage />
    </BrowserRouter>
  );
};

describe('CartPage', () => {
  beforeEach(() => {
    useCart.getState().clearCart();
  });

  describe('empty cart', () => {
    it('should render empty state when cart is empty', () => {
      renderCartPage();

      expect(screen.getByText('장바구니가 비어있습니다')).toBeInTheDocument();
      expect(screen.getByText('원하는 상품을 장바구니에 담아보세요')).toBeInTheDocument();
      expect(screen.getByText('쇼핑하러 가기')).toBeInTheDocument();
    });

    it('should not render clear button when cart is empty', () => {
      renderCartPage();

      expect(screen.queryByText('전체 삭제')).not.toBeInTheDocument();
    });
  });

  describe('cart with items', () => {
    beforeEach(() => {
      useCart.getState().addItem(mockProduct1, 2);
      useCart.getState().addItem(mockProduct2, 1);
    });

    it('should render cart items', () => {
      renderCartPage();

      expect(screen.getByText('테스트 상품 1')).toBeInTheDocument();
      expect(screen.getByText('테스트 상품 2')).toBeInTheDocument();
    });

    it('should render item count', () => {
      renderCartPage();

      // Text is split by <strong> tag: "총 <strong>2</strong>개 상품"
      expect(screen.getByText('2', { selector: 'strong' })).toBeInTheDocument();
    });

    it('should render clear all button', () => {
      renderCartPage();

      expect(screen.getByText('전체 삭제')).toBeInTheDocument();
    });

    it('should render order summary', () => {
      renderCartPage();

      expect(screen.getByText('주문 요약')).toBeInTheDocument();
      expect(screen.getByText('상품 금액')).toBeInTheDocument();
      expect(screen.getByText('배송비')).toBeInTheDocument();
      expect(screen.getByText('총 결제금액')).toBeInTheDocument();
    });

    it('should calculate total price correctly', () => {
      renderCartPage();

      // mockProduct1: 10000 * 2 = 20000
      // mockProduct2: 30000 * 1 = 30000
      // Total: 50000 (appears multiple times in summary)
      const priceElements = screen.getAllByText('50,000원');
      expect(priceElements.length).toBeGreaterThan(0);
    });

    it('should show free shipping when product has freeShipping', () => {
      renderCartPage();

      // mockProduct2 has freeShipping: true
      expect(screen.getByText('무료')).toBeInTheDocument();
    });

    it('should render checkout button', () => {
      renderCartPage();

      expect(screen.getByRole('button', { name: '주문하기' })).toBeInTheDocument();
    });

    it('should render continue shopping link', () => {
      renderCartPage();

      expect(screen.getByText('쇼핑 계속하기')).toBeInTheDocument();
    });
  });

  describe('cart actions', () => {
    beforeEach(() => {
      useCart.getState().addItem(mockProduct1, 2);
    });

    it('should clear cart when clear button is clicked', async () => {
      const user = userEvent.setup();
      renderCartPage();

      const clearButton = screen.getByText('전체 삭제');
      await user.click(clearButton);

      expect(screen.getByText('장바구니가 비어있습니다')).toBeInTheDocument();
    });
  });

  describe('shipping fee calculation', () => {
    it('should show shipping fee for orders under 50000', () => {
      useCart.getState().addItem(mockProduct1, 1); // 10000
      renderCartPage();

      // Should show 3000 won shipping fee
      expect(screen.getByText('3,000원')).toBeInTheDocument();
    });

    it('should show free shipping progress when applicable', () => {
      useCart.getState().addItem(mockProduct1, 3); // 30000
      renderCartPage();

      // Need 20000 more for free shipping
      expect(screen.getByText(/20,000원 더 담으면/)).toBeInTheDocument();
      expect(screen.getByText('무료배송!')).toBeInTheDocument();
    });

    it('should not show progress bar when free shipping is achieved', () => {
      useCart.getState().addItem(mockProduct2, 1); // Has free shipping
      renderCartPage();

      expect(screen.queryByText(/더 담으면/)).not.toBeInTheDocument();
    });
  });
});
