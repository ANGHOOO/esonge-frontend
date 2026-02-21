import { create } from 'zustand';
import type { Order, OrderStatus } from '@/mocks/orders';
import { mockOrders } from '@/mocks/orders';

interface OrdersState {
  orders: Order[];
  isLoading: boolean;

  // Actions
  fetchOrders: () => Promise<void>;
  getOrderById: (id: string) => Order | undefined;
  getOrdersByStatus: (status: OrderStatus | 'all') => Order[];
  cancelOrder: (orderId: string) => Promise<boolean>;
  getTotalOrders: () => number;
}

export const useOrders = create<OrdersState>()((set, get) => ({
  orders: [],
  isLoading: false,

  fetchOrders: async () => {
    set({ isLoading: true });
    // Mock API delay
    await new Promise((resolve) => setTimeout(resolve, 500));
    set({ orders: mockOrders, isLoading: false });
  },

  getOrderById: (id: string) => {
    return get().orders.find((order) => order.id === id);
  },

  getOrdersByStatus: (status: OrderStatus | 'all') => {
    const { orders } = get();
    if (status === 'all') return orders;
    return orders.filter((order) => order.status === status);
  },

  cancelOrder: async (orderId: string) => {
    // Mock API delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    const order = get().getOrderById(orderId);
    if (!order) return false;

    // 배송 중이거나 배송 완료된 주문은 취소 불가
    if (order.status === 'shipping' || order.status === 'delivered') {
      return false;
    }

    set((state) => ({
      orders: state.orders.map((o) =>
        o.id === orderId ? { ...o, status: 'cancelled' as OrderStatus } : o
      ),
    }));

    return true;
  },

  getTotalOrders: () => {
    return get().orders.length;
  },
}));
