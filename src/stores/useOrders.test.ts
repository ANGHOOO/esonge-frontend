import { describe, it, expect, beforeEach } from 'vitest';
import { act } from '@testing-library/react';
import { useOrders } from './useOrders';
import { mockOrders } from '@/mocks/orders';

describe('useOrders', () => {
  beforeEach(() => {
    // Reset store before each test
    act(() => {
      useOrders.setState({ orders: [], isLoading: false });
    });
  });

  describe('fetchOrders', () => {
    it('should set isLoading to true while fetching', async () => {
      const fetchPromise = useOrders.getState().fetchOrders();

      // Check loading state immediately
      expect(useOrders.getState().isLoading).toBe(true);

      await fetchPromise;

      expect(useOrders.getState().isLoading).toBe(false);
    });

    it('should populate orders after fetching', async () => {
      await act(async () => {
        await useOrders.getState().fetchOrders();
      });

      const { orders } = useOrders.getState();
      expect(orders).toHaveLength(mockOrders.length);
      expect(orders).toEqual(mockOrders);
    });
  });

  describe('getOrderById', () => {
    beforeEach(async () => {
      await act(async () => {
        await useOrders.getState().fetchOrders();
      });
    });

    it('should return order when id exists', () => {
      const order = useOrders.getState().getOrderById('order-001');
      expect(order).toBeDefined();
      expect(order?.id).toBe('order-001');
      expect(order?.orderNumber).toBe('ORD-2024-001234');
    });

    it('should return undefined when id does not exist', () => {
      const order = useOrders.getState().getOrderById('non-existent-id');
      expect(order).toBeUndefined();
    });
  });

  describe('getOrdersByStatus', () => {
    beforeEach(async () => {
      await act(async () => {
        await useOrders.getState().fetchOrders();
      });
    });

    it('should return all orders when status is "all"', () => {
      const orders = useOrders.getState().getOrdersByStatus('all');
      expect(orders).toHaveLength(mockOrders.length);
    });

    it('should return only delivered orders when status is "delivered"', () => {
      const orders = useOrders.getState().getOrdersByStatus('delivered');
      const allDelivered = orders.every((order) => order.status === 'delivered');
      expect(allDelivered).toBe(true);
      expect(orders.length).toBeGreaterThan(0);
    });

    it('should return only shipping orders when status is "shipping"', () => {
      const orders = useOrders.getState().getOrdersByStatus('shipping');
      const allShipping = orders.every((order) => order.status === 'shipping');
      expect(allShipping).toBe(true);
    });

    it('should return only cancelled orders when status is "cancelled"', () => {
      const orders = useOrders.getState().getOrdersByStatus('cancelled');
      const allCancelled = orders.every((order) => order.status === 'cancelled');
      expect(allCancelled).toBe(true);
    });

    it('should return empty array when no orders match the status', () => {
      // Set orders to only have delivered orders
      act(() => {
        useOrders.setState({
          orders: mockOrders.filter((o) => o.status === 'delivered'),
        });
      });

      const orders = useOrders.getState().getOrdersByStatus('pending');
      expect(orders).toHaveLength(0);
    });
  });

  describe('cancelOrder', () => {
    beforeEach(async () => {
      await act(async () => {
        await useOrders.getState().fetchOrders();
      });
    });

    it('should return false when order does not exist', async () => {
      const result = await act(async () => {
        return useOrders.getState().cancelOrder('non-existent-id');
      });

      expect(result).toBe(false);
    });

    it('should return false when order is in shipping status', async () => {
      // order-002 has status 'shipping'
      const result = await act(async () => {
        return useOrders.getState().cancelOrder('order-002');
      });

      expect(result).toBe(false);

      // Verify order status is unchanged
      const order = useOrders.getState().getOrderById('order-002');
      expect(order?.status).toBe('shipping');
    });

    it('should return false when order is in delivered status', async () => {
      // order-001 has status 'delivered'
      const result = await act(async () => {
        return useOrders.getState().cancelOrder('order-001');
      });

      expect(result).toBe(false);

      // Verify order status is unchanged
      const order = useOrders.getState().getOrderById('order-001');
      expect(order?.status).toBe('delivered');
    });

    it('should successfully cancel order with pending status', async () => {
      // Set up an order with pending status
      act(() => {
        useOrders.setState({
          orders: [
            {
              ...mockOrders[0],
              id: 'pending-order',
              status: 'pending',
            },
          ],
        });
      });

      const result = await act(async () => {
        return useOrders.getState().cancelOrder('pending-order');
      });

      expect(result).toBe(true);

      const order = useOrders.getState().getOrderById('pending-order');
      expect(order?.status).toBe('cancelled');
    });

    it('should successfully cancel order with confirmed status', async () => {
      // order-004 has status 'confirmed'
      const result = await act(async () => {
        return useOrders.getState().cancelOrder('order-004');
      });

      expect(result).toBe(true);

      const order = useOrders.getState().getOrderById('order-004');
      expect(order?.status).toBe('cancelled');
    });

    it('should not affect other orders when cancelling one order', async () => {
      const ordersBefore = useOrders.getState().orders.map((o) => ({ id: o.id, status: o.status }));

      // Cancel order-004 (confirmed)
      await act(async () => {
        await useOrders.getState().cancelOrder('order-004');
      });

      const ordersAfter = useOrders.getState().orders;

      // Check that only order-004 changed
      ordersBefore.forEach(({ id, status }) => {
        const orderAfter = ordersAfter.find((o) => o.id === id);
        if (id === 'order-004') {
          expect(orderAfter?.status).toBe('cancelled');
        } else {
          expect(orderAfter?.status).toBe(status);
        }
      });
    });
  });

  describe('getTotalOrders', () => {
    it('should return 0 when no orders', () => {
      const total = useOrders.getState().getTotalOrders();
      expect(total).toBe(0);
    });

    it('should return correct count after fetching', async () => {
      await act(async () => {
        await useOrders.getState().fetchOrders();
      });

      const total = useOrders.getState().getTotalOrders();
      expect(total).toBe(mockOrders.length);
    });
  });
});
