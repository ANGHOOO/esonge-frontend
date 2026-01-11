import { describe, it, expect, beforeEach } from 'vitest';
import { act } from '@testing-library/react';
import { useWishlist } from './useWishlist';

describe('useWishlist', () => {
  beforeEach(() => {
    // Reset store before each test
    act(() => {
      useWishlist.getState().clearWishlist();
    });
  });

  describe('addItem', () => {
    it('should add product id to wishlist', () => {
      act(() => {
        useWishlist.getState().addItem('product-001');
      });

      const { productIds } = useWishlist.getState();
      expect(productIds).toContain('product-001');
      expect(productIds).toHaveLength(1);
    });

    it('should not add duplicate product id', () => {
      act(() => {
        useWishlist.getState().addItem('product-001');
        useWishlist.getState().addItem('product-001');
      });

      const { productIds } = useWishlist.getState();
      expect(productIds).toHaveLength(1);
    });

    it('should add multiple different product ids', () => {
      act(() => {
        useWishlist.getState().addItem('product-001');
        useWishlist.getState().addItem('product-002');
        useWishlist.getState().addItem('product-003');
      });

      const { productIds } = useWishlist.getState();
      expect(productIds).toHaveLength(3);
    });
  });

  describe('removeItem', () => {
    it('should remove product id from wishlist', () => {
      act(() => {
        useWishlist.getState().addItem('product-001');
        useWishlist.getState().addItem('product-002');
        useWishlist.getState().removeItem('product-001');
      });

      const { productIds } = useWishlist.getState();
      expect(productIds).not.toContain('product-001');
      expect(productIds).toContain('product-002');
      expect(productIds).toHaveLength(1);
    });

    it('should do nothing when removing non-existent product id', () => {
      act(() => {
        useWishlist.getState().addItem('product-001');
        useWishlist.getState().removeItem('non-existent');
      });

      const { productIds } = useWishlist.getState();
      expect(productIds).toHaveLength(1);
    });
  });

  describe('toggleItem', () => {
    it('should add item if not in wishlist', () => {
      act(() => {
        useWishlist.getState().toggleItem('product-001');
      });

      const { productIds } = useWishlist.getState();
      expect(productIds).toContain('product-001');
    });

    it('should remove item if already in wishlist', () => {
      act(() => {
        useWishlist.getState().addItem('product-001');
        useWishlist.getState().toggleItem('product-001');
      });

      const { productIds } = useWishlist.getState();
      expect(productIds).not.toContain('product-001');
    });

    it('should toggle back and forth correctly', () => {
      act(() => {
        useWishlist.getState().toggleItem('product-001'); // add
      });
      expect(useWishlist.getState().productIds).toContain('product-001');

      act(() => {
        useWishlist.getState().toggleItem('product-001'); // remove
      });
      expect(useWishlist.getState().productIds).not.toContain('product-001');

      act(() => {
        useWishlist.getState().toggleItem('product-001'); // add again
      });
      expect(useWishlist.getState().productIds).toContain('product-001');
    });
  });

  describe('clearWishlist', () => {
    it('should remove all items from wishlist', () => {
      act(() => {
        useWishlist.getState().addItem('product-001');
        useWishlist.getState().addItem('product-002');
        useWishlist.getState().addItem('product-003');
        useWishlist.getState().clearWishlist();
      });

      const { productIds } = useWishlist.getState();
      expect(productIds).toHaveLength(0);
    });

    it('should work on empty wishlist', () => {
      act(() => {
        useWishlist.getState().clearWishlist();
      });

      const { productIds } = useWishlist.getState();
      expect(productIds).toHaveLength(0);
    });
  });

  describe('isInWishlist', () => {
    it('should return false for item not in wishlist', () => {
      const result = useWishlist.getState().isInWishlist('product-001');
      expect(result).toBe(false);
    });

    it('should return true for item in wishlist', () => {
      act(() => {
        useWishlist.getState().addItem('product-001');
      });

      const result = useWishlist.getState().isInWishlist('product-001');
      expect(result).toBe(true);
    });

    it('should return false after item is removed', () => {
      act(() => {
        useWishlist.getState().addItem('product-001');
        useWishlist.getState().removeItem('product-001');
      });

      const result = useWishlist.getState().isInWishlist('product-001');
      expect(result).toBe(false);
    });
  });

  describe('getTotalItems', () => {
    it('should return 0 for empty wishlist', () => {
      const total = useWishlist.getState().getTotalItems();
      expect(total).toBe(0);
    });

    it('should return correct count of items', () => {
      act(() => {
        useWishlist.getState().addItem('product-001');
        useWishlist.getState().addItem('product-002');
        useWishlist.getState().addItem('product-003');
      });

      const total = useWishlist.getState().getTotalItems();
      expect(total).toBe(3);
    });

    it('should update count after removing item', () => {
      act(() => {
        useWishlist.getState().addItem('product-001');
        useWishlist.getState().addItem('product-002');
        useWishlist.getState().removeItem('product-001');
      });

      const total = useWishlist.getState().getTotalItems();
      expect(total).toBe(1);
    });
  });
});
