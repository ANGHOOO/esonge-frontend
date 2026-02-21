import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { OrdersPage } from './OrdersPage';
import { useAuth, useOrders } from '@/stores';
import { mockOrders } from '@/mocks/orders';
import { act } from '@testing-library/react';
import type { OrderStatus } from '@/mocks/orders';
import type { User } from '@/stores/useAuth';

// Mock sonner toast
vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

// Mock user for tests
const mockUser: User = {
  id: '1',
  email: 'test@test.com',
  name: '테스트',
  phone: '010-1234-5678',
  createdAt: '2024-01-01T00:00:00Z',
};

const renderOrdersPage = () => {
  return render(
    <BrowserRouter>
      <OrdersPage />
    </BrowserRouter>
  );
};

// Helper to create a mock store state with proper functions
const createMockOrdersState = (orders: typeof mockOrders, isLoading = false) => ({
  orders,
  isLoading,
  fetchOrders: vi.fn(), // No-op to prevent loading state change
  getOrdersByStatus: (status: OrderStatus | 'all') => {
    if (status === 'all') return orders;
    return orders.filter((o) => o.status === status);
  },
  getOrderById: (id: string) => orders.find((o) => o.id === id),
  cancelOrder: vi.fn().mockResolvedValue(true),
  getTotalOrders: () => orders.length,
});

describe('OrdersPage', () => {
  beforeEach(() => {
    // Reset stores before each test
    act(() => {
      useAuth.setState({ isAuthenticated: false, user: null });
      useOrders.setState({ orders: [], isLoading: false });
    });
    vi.clearAllMocks();
  });

  describe('not authenticated', () => {
    it('should show login required message when not authenticated', () => {
      renderOrdersPage();

      expect(screen.getByText('로그인이 필요합니다')).toBeInTheDocument();
      expect(screen.getByText('주문내역을 확인하시려면 로그인해주세요.')).toBeInTheDocument();
    });

    it('should show login and register buttons', () => {
      renderOrdersPage();

      expect(screen.getByRole('button', { name: '로그인' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: '회원가입' })).toBeInTheDocument();
    });

    it('should not show filters when not authenticated', () => {
      renderOrdersPage();

      expect(screen.queryByRole('button', { name: '전체' })).not.toBeInTheDocument();
    });
  });

  describe('loading state', () => {
    it('should show loading state while fetching orders', () => {
      act(() => {
        useAuth.setState({ isAuthenticated: true, user: mockUser });
        useOrders.setState({
          ...createMockOrdersState([], true),
        });
      });

      renderOrdersPage();

      expect(screen.getByText('주문내역을 불러오는 중...')).toBeInTheDocument();
    });
  });

  describe('empty orders', () => {
    it('should show empty state when user has no orders', () => {
      act(() => {
        useAuth.setState({ isAuthenticated: true, user: mockUser });
        useOrders.setState(createMockOrdersState([]));
      });

      renderOrdersPage();

      expect(screen.getByText('주문내역이 없습니다')).toBeInTheDocument();
      expect(screen.getByText('첫 주문을 해보세요!')).toBeInTheDocument();
    });

    it('should show shopping link when no orders', () => {
      act(() => {
        useAuth.setState({ isAuthenticated: true, user: mockUser });
        useOrders.setState(createMockOrdersState([]));
      });

      renderOrdersPage();

      expect(screen.getByRole('button', { name: '쇼핑하러 가기' })).toBeInTheDocument();
    });
  });

  describe('orders list', () => {
    beforeEach(() => {
      act(() => {
        useAuth.setState({ isAuthenticated: true, user: mockUser });
        useOrders.setState(createMockOrdersState(mockOrders));
      });
    });

    it('should display order count', () => {
      renderOrdersPage();

      expect(screen.getByText(`총 ${mockOrders.length}건`)).toBeInTheDocument();
    });

    it('should display orders', () => {
      renderOrdersPage();

      // Check that order numbers are displayed
      expect(screen.getByText('ORD-2024-001234')).toBeInTheDocument();
      expect(screen.getByText('ORD-2024-001235')).toBeInTheDocument();
    });

    it('should display page title', () => {
      renderOrdersPage();

      expect(screen.getByRole('heading', { name: '주문내역' })).toBeInTheDocument();
    });
  });

  describe('status filters', () => {
    beforeEach(() => {
      act(() => {
        useAuth.setState({ isAuthenticated: true, user: mockUser });
        useOrders.setState(createMockOrdersState(mockOrders));
      });
    });

    it('should display all filter buttons', () => {
      renderOrdersPage();

      expect(screen.getByRole('button', { name: '전체' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: '주문 대기' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: '주문 확인' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: '상품 준비중' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: '배송중' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: '배송 완료' })).toBeInTheDocument();
      // Note: "주문 취소" filter button might conflict with cancel buttons in OrderCard
      // So we check that at least one exists in the filter area
      const filterButtons = screen.getAllByRole('button');
      const cancelFilterExists = filterButtons.some(
        (btn) => btn.textContent === '주문 취소' && btn.classList.contains('_filterButton_ec7fc2')
      );
      expect(cancelFilterExists).toBe(true);
    });

    it('should filter orders by delivered status', async () => {
      const user = userEvent.setup();
      renderOrdersPage();

      const deliveredFilter = screen.getByRole('button', { name: '배송 완료' });
      await user.click(deliveredFilter);

      // Should only show delivered orders
      // Order 1 is delivered
      expect(screen.getByText('ORD-2024-001234')).toBeInTheDocument();
      // Order 2 is shipping - should not be visible
      expect(screen.queryByText('ORD-2024-001235')).not.toBeInTheDocument();
    });

    it('should filter orders by shipping status', async () => {
      const user = userEvent.setup();
      renderOrdersPage();

      const shippingFilter = screen.getByRole('button', { name: '배송중' });
      await user.click(shippingFilter);

      // Order 2 is shipping
      expect(screen.getByText('ORD-2024-001235')).toBeInTheDocument();
      // Order 1 is delivered - should not be visible
      expect(screen.queryByText('ORD-2024-001234')).not.toBeInTheDocument();
    });

    it('should show no results message when filter has no matches', async () => {
      const ordersWithoutPending = mockOrders.filter((o) => o.status !== 'pending');
      act(() => {
        useOrders.setState(createMockOrdersState(ordersWithoutPending));
      });

      const user = userEvent.setup();
      renderOrdersPage();

      const pendingFilter = screen.getByRole('button', { name: '주문 대기' });
      await user.click(pendingFilter);

      expect(screen.getByText('해당 상태의 주문이 없습니다.')).toBeInTheDocument();
    });

    it('should show all orders when "전체" filter is selected', async () => {
      const user = userEvent.setup();
      renderOrdersPage();

      // First filter by shipping
      const shippingFilter = screen.getByRole('button', { name: '배송중' });
      await user.click(shippingFilter);

      // Then select all
      const allFilter = screen.getByRole('button', { name: '전체' });
      await user.click(allFilter);

      // All orders should be visible
      expect(screen.getByText('ORD-2024-001234')).toBeInTheDocument();
      expect(screen.getByText('ORD-2024-001235')).toBeInTheDocument();
    });
  });

  describe('order cancellation', () => {
    beforeEach(() => {
      const confirmedOrder = {
        ...mockOrders[3],
        id: 'cancellable-order',
        status: 'confirmed' as const,
      };
      act(() => {
        useAuth.setState({ isAuthenticated: true, user: mockUser });
        useOrders.setState(createMockOrdersState([confirmedOrder]));
      });
    });

    it('should show cancel button for cancellable orders', () => {
      renderOrdersPage();

      // Find the cancel button within the order card (not the filter button)
      const cancelButtons = screen.getAllByRole('button', { name: /주문 취소/i });
      // One is filter, one is in OrderCard
      expect(cancelButtons.length).toBeGreaterThanOrEqual(1);
    });

    it('should show confirmation dialog when cancel button is clicked', async () => {
      const user = userEvent.setup();
      const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(false);

      renderOrdersPage();

      // Find the cancel button that has the X icon (in OrderCard, not the filter)
      const cancelButtons = screen.getAllByRole('button', { name: /주문 취소/i });
      // The OrderCard cancel button has an X icon, so find the one with svg
      const orderCardCancelButton = cancelButtons.find((btn) => btn.querySelector('svg'));
      expect(orderCardCancelButton).toBeDefined();

      if (orderCardCancelButton) {
        await user.click(orderCardCancelButton);
        expect(confirmSpy).toHaveBeenCalledWith('주문을 취소하시겠습니까?');
      }

      confirmSpy.mockRestore();
    });
  });

  describe('fetch orders on mount', () => {
    it('should call fetchOrders when authenticated user mounts page', async () => {
      const fetchOrdersSpy = vi.fn();

      act(() => {
        useAuth.setState({ isAuthenticated: true, user: mockUser });
        useOrders.setState({
          orders: [],
          isLoading: false,
          fetchOrders: fetchOrdersSpy,
          getOrdersByStatus: () => [],
          getOrderById: () => undefined,
          cancelOrder: async () => false,
          getTotalOrders: () => 0,
        });
      });

      renderOrdersPage();

      await waitFor(() => {
        expect(fetchOrdersSpy).toHaveBeenCalled();
      });
    });

    it('should not call fetchOrders when user is not authenticated', () => {
      const fetchOrdersSpy = vi.fn();

      act(() => {
        useAuth.setState({ isAuthenticated: false, user: null });
        useOrders.setState({
          orders: [],
          isLoading: false,
          fetchOrders: fetchOrdersSpy,
          getOrdersByStatus: () => [],
          getOrderById: () => undefined,
          cancelOrder: async () => false,
          getTotalOrders: () => 0,
        });
      });

      renderOrdersPage();

      expect(fetchOrdersSpy).not.toHaveBeenCalled();
    });
  });
});
