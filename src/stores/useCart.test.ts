import { describe, it, expect, beforeEach } from 'vitest';
import { act } from '@testing-library/react';
import { useCart } from './useCart';
import type { Product } from '@/mocks/products';

// Mock product data
const mockProduct: Product = {
  id: 'test-001',
  name: '테스트 상품',
  price: 10000,
  images: ['/test.jpg'],
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

const mockProductFreeShipping: Product = {
  ...mockProduct,
  id: 'test-002',
  name: '무료배송 상품',
  price: 30000,
  freeShipping: true,
};

const mockExpensiveProduct: Product = {
  ...mockProduct,
  id: 'test-003',
  name: '고가 상품',
  price: 60000,
};

describe('useCart', () => {
  beforeEach(() => {
    // Reset store before each test
    act(() => {
      useCart.getState().clearCart();
    });
  });

  describe('addItem', () => {
    it('should add a new item to cart', () => {
      act(() => {
        useCart.getState().addItem(mockProduct, 1);
      });

      const { items } = useCart.getState();
      expect(items).toHaveLength(1);
      expect(items[0].product.id).toBe('test-001');
      expect(items[0].quantity).toBe(1);
    });

    it('should increase quantity when adding existing item', () => {
      act(() => {
        useCart.getState().addItem(mockProduct, 1);
        useCart.getState().addItem(mockProduct, 2);
      });

      const { items } = useCart.getState();
      expect(items).toHaveLength(1);
      expect(items[0].quantity).toBe(3);
    });

    it('should not exceed stock limit when adding items', () => {
      const lowStockProduct: Product = { ...mockProduct, stock: 3 };

      act(() => {
        useCart.getState().addItem(lowStockProduct, 5);
      });

      const { items } = useCart.getState();
      expect(items[0].quantity).toBe(3); // Limited to stock
    });

    it('should not exceed stock when adding to existing item', () => {
      const lowStockProduct: Product = { ...mockProduct, stock: 5 };

      act(() => {
        useCart.getState().addItem(lowStockProduct, 3);
        useCart.getState().addItem(lowStockProduct, 4);
      });

      const { items } = useCart.getState();
      expect(items[0].quantity).toBe(5); // Limited to stock
    });

    it('should add multiple different products', () => {
      act(() => {
        useCart.getState().addItem(mockProduct, 1);
        useCart.getState().addItem(mockProductFreeShipping, 2);
      });

      const { items } = useCart.getState();
      expect(items).toHaveLength(2);
    });
  });

  describe('removeItem', () => {
    it('should remove item from cart', () => {
      act(() => {
        useCart.getState().addItem(mockProduct, 1);
        useCart.getState().removeItem('test-001');
      });

      const { items } = useCart.getState();
      expect(items).toHaveLength(0);
    });

    it('should only remove specified item', () => {
      act(() => {
        useCart.getState().addItem(mockProduct, 1);
        useCart.getState().addItem(mockProductFreeShipping, 1);
        useCart.getState().removeItem('test-001');
      });

      const { items } = useCart.getState();
      expect(items).toHaveLength(1);
      expect(items[0].product.id).toBe('test-002');
    });

    it('should do nothing when removing non-existent item', () => {
      act(() => {
        useCart.getState().addItem(mockProduct, 1);
        useCart.getState().removeItem('non-existent');
      });

      const { items } = useCart.getState();
      expect(items).toHaveLength(1);
    });
  });

  describe('updateQuantity', () => {
    it('should update item quantity', () => {
      act(() => {
        useCart.getState().addItem(mockProduct, 1);
        useCart.getState().updateQuantity('test-001', 5);
      });

      const { items } = useCart.getState();
      expect(items[0].quantity).toBe(5);
    });

    it('should not allow quantity below 1', () => {
      act(() => {
        useCart.getState().addItem(mockProduct, 3);
        useCart.getState().updateQuantity('test-001', 0);
      });

      const { items } = useCart.getState();
      expect(items[0].quantity).toBe(1);
    });

    it('should not allow quantity above stock', () => {
      const lowStockProduct: Product = { ...mockProduct, stock: 5 };

      act(() => {
        useCart.getState().addItem(lowStockProduct, 1);
        useCart.getState().updateQuantity('test-001', 10);
      });

      const { items } = useCart.getState();
      expect(items[0].quantity).toBe(5);
    });
  });

  describe('clearCart', () => {
    it('should remove all items from cart', () => {
      act(() => {
        useCart.getState().addItem(mockProduct, 1);
        useCart.getState().addItem(mockProductFreeShipping, 2);
        useCart.getState().clearCart();
      });

      const { items } = useCart.getState();
      expect(items).toHaveLength(0);
    });
  });

  describe('getTotalItems', () => {
    it('should return 0 for empty cart', () => {
      const total = useCart.getState().getTotalItems();
      expect(total).toBe(0);
    });

    it('should return total quantity of all items', () => {
      act(() => {
        useCart.getState().addItem(mockProduct, 2);
        useCart.getState().addItem(mockProductFreeShipping, 3);
      });

      const total = useCart.getState().getTotalItems();
      expect(total).toBe(5);
    });
  });

  describe('getTotalPrice', () => {
    it('should return 0 for empty cart', () => {
      const total = useCart.getState().getTotalPrice();
      expect(total).toBe(0);
    });

    it('should calculate correct total price', () => {
      act(() => {
        useCart.getState().addItem(mockProduct, 2); // 10000 * 2 = 20000
        useCart.getState().addItem(mockProductFreeShipping, 1); // 30000 * 1 = 30000
      });

      const total = useCart.getState().getTotalPrice();
      expect(total).toBe(50000);
    });
  });

  describe('getShippingFee', () => {
    it('should return 0 for empty cart', () => {
      const fee = useCart.getState().getShippingFee();
      expect(fee).toBe(0);
    });

    it('should return 3000 for order under 50000', () => {
      act(() => {
        useCart.getState().addItem(mockProduct, 1); // 10000
      });

      const fee = useCart.getState().getShippingFee();
      expect(fee).toBe(3000);
    });

    it('should return 0 for order 50000 or more', () => {
      act(() => {
        useCart.getState().addItem(mockExpensiveProduct, 1); // 60000
      });

      const fee = useCart.getState().getShippingFee();
      expect(fee).toBe(0);
    });

    it('should return 0 when cart contains free shipping item', () => {
      act(() => {
        useCart.getState().addItem(mockProduct, 1); // 10000, no free shipping
        useCart.getState().addItem(mockProductFreeShipping, 1); // 30000, free shipping
      });

      const fee = useCart.getState().getShippingFee();
      expect(fee).toBe(0);
    });
  });

  describe('getFinalPrice', () => {
    it('should return total price plus shipping fee', () => {
      act(() => {
        useCart.getState().addItem(mockProduct, 2); // 20000 + 3000 shipping
      });

      const finalPrice = useCart.getState().getFinalPrice();
      expect(finalPrice).toBe(23000);
    });

    it('should return total price without shipping for large orders', () => {
      act(() => {
        useCart.getState().addItem(mockExpensiveProduct, 1); // 60000, no shipping
      });

      const finalPrice = useCart.getState().getFinalPrice();
      expect(finalPrice).toBe(60000);
    });
  });

  describe('isInCart', () => {
    it('should return false for item not in cart', () => {
      const result = useCart.getState().isInCart('test-001');
      expect(result).toBe(false);
    });

    it('should return true for item in cart', () => {
      act(() => {
        useCart.getState().addItem(mockProduct, 1);
      });

      const result = useCart.getState().isInCart('test-001');
      expect(result).toBe(true);
    });
  });

  describe('getItemQuantity', () => {
    it('should return 0 for item not in cart', () => {
      const quantity = useCart.getState().getItemQuantity('test-001');
      expect(quantity).toBe(0);
    });

    it('should return correct quantity for item in cart', () => {
      act(() => {
        useCart.getState().addItem(mockProduct, 3);
      });

      const quantity = useCart.getState().getItemQuantity('test-001');
      expect(quantity).toBe(3);
    });
  });
});
