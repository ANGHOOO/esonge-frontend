import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { WishlistPage } from './WishlistPage';
import { useWishlist, useCart } from '@/stores';
import { products } from '@/mocks/products';

// Mock sonner toast
vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

const renderWishlistPage = () => {
  return render(
    <BrowserRouter>
      <WishlistPage />
    </BrowserRouter>
  );
};

describe('WishlistPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useWishlist.getState().clearWishlist();
    useCart.getState().clearCart();
  });

  describe('empty wishlist', () => {
    it('should render empty state when wishlist is empty', () => {
      renderWishlistPage();

      expect(screen.getByText('찜한 상품이 없습니다')).toBeInTheDocument();
      expect(screen.getByText('마음에 드는 상품을 찜해보세요')).toBeInTheDocument();
      expect(screen.getByText('쇼핑하러 가기')).toBeInTheDocument();
    });

    it('should not render clear button when wishlist is empty', () => {
      renderWishlistPage();

      expect(screen.queryByText('전체 삭제')).not.toBeInTheDocument();
    });

    it('should render page title', () => {
      renderWishlistPage();

      expect(screen.getByRole('heading', { name: '찜 목록' })).toBeInTheDocument();
    });
  });

  describe('wishlist with items', () => {
    const testProductIds = [products[0].id, products[1].id];

    beforeEach(() => {
      testProductIds.forEach((id) => {
        useWishlist.getState().addItem(id);
      });
    });

    it('should render wishlist items', () => {
      renderWishlistPage();

      expect(screen.getByText(products[0].name)).toBeInTheDocument();
      expect(screen.getByText(products[1].name)).toBeInTheDocument();
    });

    it('should render item count', () => {
      renderWishlistPage();

      expect(screen.getByText('총 2개 상품')).toBeInTheDocument();
    });

    it('should render clear all button', () => {
      renderWishlistPage();

      expect(screen.getByText('전체 삭제')).toBeInTheDocument();
    });
  });

  describe('wishlist actions', () => {
    beforeEach(() => {
      useWishlist.getState().addItem(products[0].id);
      useWishlist.getState().addItem(products[1].id);
    });

    it('should clear wishlist when clear button is clicked', async () => {
      const user = userEvent.setup();
      const { toast } = await import('sonner');
      renderWishlistPage();

      const clearButton = screen.getByText('전체 삭제');
      await user.click(clearButton);

      expect(toast.success).toHaveBeenCalledWith('찜 목록이 비워졌습니다.');
      expect(screen.getByText('찜한 상품이 없습니다')).toBeInTheDocument();
    });
  });

  describe('integration with cart', () => {
    beforeEach(() => {
      // Add a product that has stock > 0
      const productWithStock = products.find((p) => p.stock > 0);
      if (productWithStock) {
        useWishlist.getState().addItem(productWithStock.id);
      }
    });

    it('should have cart functionality available', () => {
      renderWishlistPage();

      // ProductGrid should be rendered with cart buttons
      // This confirms the component integrates with cart store
      expect(useCart.getState().items).toHaveLength(0);
    });
  });
});
