import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { OrderDetailPage } from './OrderDetailPage';
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

const renderOrderDetailPage = (orderId: string) => {
  return render(
    <BrowserRouter>
      <Routes>
        <Route path="*" element={<OrderDetailPage />} />
      </Routes>
    </BrowserRouter>,
    {
      wrapper: ({ children }) => {
        // Manually set the URL to include orderId
        window.history.pushState({}, '', `/orders/${orderId}`);
        return <>{children}</>;
      },
    }
  );
};

// Mock orderId variable that can be changed per test
let mockOrderId = 'order-001';

// Mock the useParams hook
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useParams: () => ({ orderId: mockOrderId }),
  };
});

// Helper to create a mock store state with proper functions
const createMockOrdersState = (orders: typeof mockOrders, isLoading = false) => ({
  orders,
  isLoading,
  fetchOrders: vi.fn(),
  getOrdersByStatus: (status: OrderStatus | 'all') => {
    if (status === 'all') return orders;
    return orders.filter((o) => o.status === status);
  },
  getOrderById: (id: string) => orders.find((o) => o.id === id),
  cancelOrder: vi.fn().mockResolvedValue(true),
  getTotalOrders: () => orders.length,
});

describe('OrderDetailPage', () => {
  beforeEach(() => {
    mockOrderId = 'order-001'; // Reset to default orderId
    act(() => {
      useAuth.setState({ isAuthenticated: false, user: null });
      useOrders.setState({ orders: [], isLoading: false });
    });
    vi.clearAllMocks();
  });

  describe('not authenticated', () => {
    it('should show login required message when not authenticated', () => {
      renderOrderDetailPage('order-001');

      expect(screen.getByText('로그인이 필요합니다')).toBeInTheDocument();
      expect(screen.getByText('주문 상세 정보를 확인하시려면 로그인해주세요.')).toBeInTheDocument();
    });

    it('should show login and register buttons', () => {
      renderOrderDetailPage('order-001');

      expect(screen.getByRole('button', { name: '로그인' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: '회원가입' })).toBeInTheDocument();
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

      renderOrderDetailPage('order-001');

      expect(screen.getByText('주문 정보를 불러오는 중...')).toBeInTheDocument();
    });
  });

  describe('order not found', () => {
    it('should show not found message when order does not exist', () => {
      act(() => {
        useAuth.setState({ isAuthenticated: true, user: mockUser });
        useOrders.setState(createMockOrdersState([]));
      });

      renderOrderDetailPage('non-existent');

      expect(screen.getByText('주문을 찾을 수 없습니다')).toBeInTheDocument();
      expect(screen.getByText('요청하신 주문 정보가 존재하지 않습니다.')).toBeInTheDocument();
    });
  });

  describe('order details display', () => {
    beforeEach(() => {
      act(() => {
        useAuth.setState({ isAuthenticated: true, user: mockUser });
        useOrders.setState(createMockOrdersState(mockOrders));
      });
    });

    it('should display order number', () => {
      renderOrderDetailPage('order-001');

      // Order number appears in breadcrumb and header, so use getAllByText
      const orderNumbers = screen.getAllByText('ORD-2024-001234');
      expect(orderNumbers.length).toBeGreaterThan(0);
    });

    it('should display order status', () => {
      renderOrderDetailPage('order-001');

      // order-001 has status 'delivered' - appears in status badge and delivery info
      const statusElements = screen.getAllByText(/배송 완료/);
      expect(statusElements.length).toBeGreaterThan(0);
    });

    it('should display section titles', () => {
      renderOrderDetailPage('order-001');

      expect(screen.getByText('주문 상품')).toBeInTheDocument();
      expect(screen.getByText('배송지 정보')).toBeInTheDocument();
      expect(screen.getByText('결제 정보')).toBeInTheDocument();
      expect(screen.getByText('주문 일시')).toBeInTheDocument();
    });

    it('should display shipping address', () => {
      renderOrderDetailPage('order-001');

      expect(screen.getByText('받는 분')).toBeInTheDocument();
      expect(screen.getByText('홍길동')).toBeInTheDocument();
      expect(screen.getByText('연락처')).toBeInTheDocument();
      expect(screen.getByText('010-1234-5678')).toBeInTheDocument();
    });

    it('should display payment method', () => {
      renderOrderDetailPage('order-001');

      expect(screen.getByText('결제 수단')).toBeInTheDocument();
      expect(screen.getByText('신용카드')).toBeInTheDocument();
    });

    it('should display total amount', () => {
      renderOrderDetailPage('order-001');

      expect(screen.getByText('총 결제금액')).toBeInTheDocument();
    });

    it('should display product information', () => {
      renderOrderDetailPage('order-001');

      // First order has one item - price appears in multiple places
      const priceElements = screen.getAllByText(/890,000원/);
      expect(priceElements.length).toBeGreaterThan(0);
    });
  });

  describe('shipping tracking', () => {
    it('should display tracking info for shipping orders', () => {
      // Set mockOrderId to order-002 (shipping status)
      mockOrderId = 'order-002';

      act(() => {
        useAuth.setState({ isAuthenticated: true, user: mockUser });
        useOrders.setState({
          ...createMockOrdersState(mockOrders),
          getOrderById: () => mockOrders[1], // shipping order
        });
      });

      renderOrderDetailPage('order-002');

      // order-002 has tracking number
      expect(screen.getByText(/배송 추적/)).toBeInTheDocument();
    });

    it('should display delivery completion info for delivered orders', () => {
      act(() => {
        useAuth.setState({ isAuthenticated: true, user: mockUser });
        useOrders.setState(createMockOrdersState(mockOrders));
      });

      renderOrderDetailPage('order-001');

      // order-001 is delivered - check for delivery completion section
      const deliveryElements = screen.getAllByText(/배송 완료/);
      expect(deliveryElements.length).toBeGreaterThan(0);
    });
  });

  describe('order cancellation', () => {
    it('should show cancel button for pending orders', () => {
      const pendingOrder = {
        ...mockOrders[0],
        id: 'order-001',
        status: 'pending' as const,
      };

      act(() => {
        useAuth.setState({ isAuthenticated: true, user: mockUser });
        useOrders.setState({
          ...createMockOrdersState([pendingOrder]),
          getOrderById: () => pendingOrder,
        });
      });

      renderOrderDetailPage('order-001');

      expect(screen.getByRole('button', { name: /주문 취소/i })).toBeInTheDocument();
    });

    it('should show cancel button for confirmed orders', () => {
      const confirmedOrder = {
        ...mockOrders[0],
        id: 'order-001',
        status: 'confirmed' as const,
      };

      act(() => {
        useAuth.setState({ isAuthenticated: true, user: mockUser });
        useOrders.setState({
          ...createMockOrdersState([confirmedOrder]),
          getOrderById: () => confirmedOrder,
        });
      });

      renderOrderDetailPage('order-001');

      expect(screen.getByRole('button', { name: /주문 취소/i })).toBeInTheDocument();
    });

    it('should not show cancel button for delivered orders', () => {
      act(() => {
        useAuth.setState({ isAuthenticated: true, user: mockUser });
        useOrders.setState(createMockOrdersState(mockOrders));
      });

      renderOrderDetailPage('order-001');

      // order-001 is delivered, so cancel button should not be present
      expect(screen.queryByRole('button', { name: /주문 취소/i })).not.toBeInTheDocument();
    });

    it('should show confirmation dialog when cancel button is clicked', async () => {
      const user = userEvent.setup();
      const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(false);

      const pendingOrder = {
        ...mockOrders[0],
        id: 'order-001',
        status: 'pending' as const,
      };

      act(() => {
        useAuth.setState({ isAuthenticated: true, user: mockUser });
        useOrders.setState({
          ...createMockOrdersState([pendingOrder]),
          getOrderById: () => pendingOrder,
        });
      });

      renderOrderDetailPage('order-001');

      const cancelButton = screen.getByRole('button', { name: /주문 취소/i });
      await user.click(cancelButton);

      expect(confirmSpy).toHaveBeenCalledWith('주문을 취소하시겠습니까?');
      confirmSpy.mockRestore();
    });
  });

  describe('navigation', () => {
    it('should have back to orders list link', () => {
      act(() => {
        useAuth.setState({ isAuthenticated: true, user: mockUser });
        useOrders.setState(createMockOrdersState(mockOrders));
      });

      renderOrderDetailPage('order-001');

      expect(screen.getByText('주문 목록으로 돌아가기')).toBeInTheDocument();
    });

    it('should have list button in actions', () => {
      act(() => {
        useAuth.setState({ isAuthenticated: true, user: mockUser });
        useOrders.setState(createMockOrdersState(mockOrders));
      });

      renderOrderDetailPage('order-001');

      expect(screen.getByRole('button', { name: '목록으로' })).toBeInTheDocument();
    });
  });
});
