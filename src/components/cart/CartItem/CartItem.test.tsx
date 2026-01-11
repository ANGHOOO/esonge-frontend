import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { CartItem } from './CartItem';
import type { CartItem as CartItemType } from '@/stores/useCart';
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

const mockProductLowStock: Product = {
  ...mockProduct,
  id: 'test-002',
  name: '재고 부족 상품',
  stock: 3,
};

const mockProductWithDiscount: Product = {
  ...mockProduct,
  id: 'test-003',
  name: '할인 상품',
  originalPrice: 30000,
  price: 25000,
};

const createCartItem = (product: Product, quantity: number): CartItemType => ({
  product,
  quantity,
  addedAt: new Date().toISOString(),
});

const renderCartItem = (item: CartItemType, onUpdateQuantity = vi.fn(), onRemove = vi.fn()) => {
  return render(
    <BrowserRouter>
      <CartItem item={item} onUpdateQuantity={onUpdateQuantity} onRemove={onRemove} />
    </BrowserRouter>
  );
};

describe('CartItem', () => {
  describe('rendering', () => {
    it('should render product name', () => {
      const item = createCartItem(mockProduct, 2);
      renderCartItem(item);

      expect(screen.getByText('테스트 버섯')).toBeInTheDocument();
    });

    it('should render product category', () => {
      const item = createCartItem(mockProduct, 2);
      renderCartItem(item);

      expect(screen.getByText('버섯류')).toBeInTheDocument();
    });

    it('should render product price', () => {
      const item = createCartItem(mockProduct, 2);
      renderCartItem(item);

      expect(screen.getByText('25,000원')).toBeInTheDocument();
    });

    it('should render product image', () => {
      const item = createCartItem(mockProduct, 2);
      renderCartItem(item);

      const image = screen.getByAltText('테스트 버섯');
      expect(image).toBeInTheDocument();
      expect(image).toHaveAttribute('src', '/test-image.jpg');
    });

    it('should render quantity', () => {
      const item = createCartItem(mockProduct, 3);
      renderCartItem(item);

      expect(screen.getByText('3')).toBeInTheDocument();
    });

    it('should render subtotal correctly', () => {
      const item = createCartItem(mockProduct, 2);
      renderCartItem(item);

      // 25000 * 2 = 50000
      expect(screen.getByText('50,000원')).toBeInTheDocument();
    });

    it('should render link to product detail', () => {
      const item = createCartItem(mockProduct, 2);
      renderCartItem(item);

      const links = screen.getAllByRole('link');
      expect(links[0]).toHaveAttribute('href', '/products/test-001');
    });
  });

  describe('discount display', () => {
    it('should display original price when product has discount', () => {
      const item = createCartItem(mockProductWithDiscount, 1);
      renderCartItem(item);

      expect(screen.getByText('30,000원')).toBeInTheDocument();
      // Current price appears twice (in price and subtotal)
      const priceElements = screen.getAllByText('25,000원');
      expect(priceElements.length).toBeGreaterThan(0);
    });
  });

  describe('quantity controls', () => {
    it('should render decrease button', () => {
      const item = createCartItem(mockProduct, 2);
      renderCartItem(item);

      expect(screen.getByRole('button', { name: '수량 감소' })).toBeInTheDocument();
    });

    it('should render increase button', () => {
      const item = createCartItem(mockProduct, 2);
      renderCartItem(item);

      expect(screen.getByRole('button', { name: '수량 증가' })).toBeInTheDocument();
    });

    it('should call onUpdateQuantity when decrease button is clicked', async () => {
      const user = userEvent.setup();
      const onUpdateQuantity = vi.fn();
      const item = createCartItem(mockProduct, 3);
      renderCartItem(item, onUpdateQuantity);

      const decreaseButton = screen.getByRole('button', { name: '수량 감소' });
      await user.click(decreaseButton);

      expect(onUpdateQuantity).toHaveBeenCalledWith('test-001', 2);
    });

    it('should call onUpdateQuantity when increase button is clicked', async () => {
      const user = userEvent.setup();
      const onUpdateQuantity = vi.fn();
      const item = createCartItem(mockProduct, 3);
      renderCartItem(item, onUpdateQuantity);

      const increaseButton = screen.getByRole('button', { name: '수량 증가' });
      await user.click(increaseButton);

      expect(onUpdateQuantity).toHaveBeenCalledWith('test-001', 4);
    });

    it('should disable decrease button when quantity is 1', () => {
      const item = createCartItem(mockProduct, 1);
      renderCartItem(item);

      const decreaseButton = screen.getByRole('button', { name: '수량 감소' });
      expect(decreaseButton).toBeDisabled();
    });

    it('should disable increase button when quantity equals stock', () => {
      const item = createCartItem(mockProduct, 10); // stock is 10
      renderCartItem(item);

      const increaseButton = screen.getByRole('button', { name: '수량 증가' });
      expect(increaseButton).toBeDisabled();
    });

    it('should not call onUpdateQuantity when decrease is clicked at quantity 1', async () => {
      const user = userEvent.setup();
      const onUpdateQuantity = vi.fn();
      const item = createCartItem(mockProduct, 1);
      renderCartItem(item, onUpdateQuantity);

      const decreaseButton = screen.getByRole('button', { name: '수량 감소' });
      await user.click(decreaseButton);

      expect(onUpdateQuantity).not.toHaveBeenCalled();
    });
  });

  describe('remove button', () => {
    it('should render remove button', () => {
      const item = createCartItem(mockProduct, 2);
      renderCartItem(item);

      expect(screen.getByRole('button', { name: '상품 삭제' })).toBeInTheDocument();
    });

    it('should call onRemove when remove button is clicked', async () => {
      const user = userEvent.setup();
      const onRemove = vi.fn();
      const item = createCartItem(mockProduct, 2);
      renderCartItem(item, vi.fn(), onRemove);

      const removeButton = screen.getByRole('button', { name: '상품 삭제' });
      await user.click(removeButton);

      expect(onRemove).toHaveBeenCalledWith('test-001');
    });
  });

  describe('stock warnings', () => {
    it('should show low stock warning when stock is 5 or less', () => {
      const item = createCartItem(mockProductLowStock, 1);
      renderCartItem(item);

      expect(screen.getByText('재고 3개 남음')).toBeInTheDocument();
    });

    it('should show over stock error when quantity exceeds stock', () => {
      const productWithLimitedStock: Product = {
        ...mockProduct,
        stock: 2,
      };
      const item = createCartItem(productWithLimitedStock, 5);
      renderCartItem(item);

      expect(screen.getByText('재고 부족 (최대 2개)')).toBeInTheDocument();
    });

    it('should not show stock warning for normal stock levels', () => {
      const item = createCartItem(mockProduct, 2); // stock is 10
      renderCartItem(item);

      expect(screen.queryByText(/재고.*남음/)).not.toBeInTheDocument();
      expect(screen.queryByText(/재고 부족/)).not.toBeInTheDocument();
    });
  });
});
