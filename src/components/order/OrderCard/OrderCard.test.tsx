import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { OrderCard } from './OrderCard';
import type { Order } from '@/mocks/orders';
import type { Product } from '@/mocks/products';

const mockProduct: Product = {
  id: 'product-001',
  name: '테스트 상품',
  price: 50000,
  images: ['/test-image.jpg'],
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
  ...mockProduct,
  id: 'product-002',
  name: '테스트 상품 2',
  price: 30000,
};

const createMockOrder = (overrides: Partial<Order> = {}): Order => ({
  id: 'order-001',
  orderNumber: 'ORD-2024-001234',
  items: [
    {
      product: mockProduct,
      quantity: 1,
      price: 50000,
    },
  ],
  status: 'pending',
  shippingAddress: {
    recipient: '홍길동',
    phone: '010-1234-5678',
    zipCode: '12345',
    address: '서울시 강남구',
    addressDetail: '101호',
  },
  totalAmount: 50000,
  shippingFee: 3000,
  paymentMethod: '신용카드',
  orderedAt: '2024-10-15T10:30:00Z',
  ...overrides,
});

const renderOrderCard = (order: Order, onCancelOrder?: (orderId: string) => void) => {
  return render(
    <BrowserRouter>
      <OrderCard order={order} onCancelOrder={onCancelOrder} />
    </BrowserRouter>
  );
};

describe('OrderCard', () => {
  describe('order information display', () => {
    it('should render order number', () => {
      const order = createMockOrder();
      renderOrderCard(order);

      expect(screen.getByText('ORD-2024-001234')).toBeInTheDocument();
    });

    it('should render order date in Korean format', () => {
      const order = createMockOrder({ orderedAt: '2024-10-15T10:30:00Z' });
      renderOrderCard(order);

      expect(screen.getByText('2024년 10월 15일')).toBeInTheDocument();
    });

    it('should render product name', () => {
      const order = createMockOrder();
      renderOrderCard(order);

      expect(screen.getByText('테스트 상품')).toBeInTheDocument();
    });

    it('should render product price and quantity', () => {
      const order = createMockOrder();
      renderOrderCard(order);

      expect(screen.getByText('50,000원')).toBeInTheDocument();
      expect(screen.getByText('수량: 1개')).toBeInTheDocument();
    });

    it('should render total payment amount including shipping', () => {
      const order = createMockOrder({ totalAmount: 50000, shippingFee: 3000 });
      renderOrderCard(order);

      // Total: 50000 + 3000 = 53000
      expect(screen.getByText('53,000원')).toBeInTheDocument();
    });
  });

  describe('status display', () => {
    it('should display pending status', () => {
      const order = createMockOrder({ status: 'pending' });
      renderOrderCard(order);

      expect(screen.getByText('주문 대기')).toBeInTheDocument();
    });

    it('should display confirmed status', () => {
      const order = createMockOrder({ status: 'confirmed' });
      renderOrderCard(order);

      expect(screen.getByText('주문 확인')).toBeInTheDocument();
    });

    it('should display preparing status', () => {
      const order = createMockOrder({ status: 'preparing' });
      renderOrderCard(order);

      expect(screen.getByText('상품 준비중')).toBeInTheDocument();
    });

    it('should display shipping status', () => {
      const order = createMockOrder({ status: 'shipping' });
      renderOrderCard(order);

      expect(screen.getByText('배송중')).toBeInTheDocument();
    });

    it('should display delivered status', () => {
      const order = createMockOrder({ status: 'delivered' });
      renderOrderCard(order);

      expect(screen.getByText('배송 완료')).toBeInTheDocument();
    });

    it('should display cancelled status', () => {
      const order = createMockOrder({ status: 'cancelled' });
      renderOrderCard(order);

      expect(screen.getByText('주문 취소')).toBeInTheDocument();
    });
  });

  describe('shipping information', () => {
    it('should display tracking info when status is shipping', () => {
      const order = createMockOrder({
        status: 'shipping',
        trackingNumber: '123456789',
        carrier: 'CJ대한통운',
      });
      renderOrderCard(order);

      expect(screen.getByText('CJ대한통운 123456789')).toBeInTheDocument();
    });

    it('should not display tracking info when status is not shipping', () => {
      const order = createMockOrder({
        status: 'pending',
        trackingNumber: '123456789',
        carrier: 'CJ대한통운',
      });
      renderOrderCard(order);

      expect(screen.queryByText('CJ대한통운 123456789')).not.toBeInTheDocument();
    });

    it('should display delivery completion info when delivered', () => {
      const order = createMockOrder({
        status: 'delivered',
        deliveredAt: '2024-10-17T14:00:00Z',
      });
      renderOrderCard(order);

      expect(screen.getByText('2024년 10월 17일 배송 완료')).toBeInTheDocument();
    });
  });

  describe('cancel button', () => {
    it('should show cancel button when status is pending', () => {
      const order = createMockOrder({ status: 'pending' });
      const onCancelOrder = vi.fn();
      renderOrderCard(order, onCancelOrder);

      expect(screen.getByRole('button', { name: /주문 취소/i })).toBeInTheDocument();
    });

    it('should show cancel button when status is confirmed', () => {
      const order = createMockOrder({ status: 'confirmed' });
      const onCancelOrder = vi.fn();
      renderOrderCard(order, onCancelOrder);

      expect(screen.getByRole('button', { name: /주문 취소/i })).toBeInTheDocument();
    });

    it('should not show cancel button when status is preparing', () => {
      const order = createMockOrder({ status: 'preparing' });
      const onCancelOrder = vi.fn();
      renderOrderCard(order, onCancelOrder);

      expect(screen.queryByRole('button', { name: /주문 취소/i })).not.toBeInTheDocument();
    });

    it('should not show cancel button when status is shipping', () => {
      const order = createMockOrder({ status: 'shipping' });
      const onCancelOrder = vi.fn();
      renderOrderCard(order, onCancelOrder);

      expect(screen.queryByRole('button', { name: /주문 취소/i })).not.toBeInTheDocument();
    });

    it('should not show cancel button when status is delivered', () => {
      const order = createMockOrder({ status: 'delivered' });
      const onCancelOrder = vi.fn();
      renderOrderCard(order, onCancelOrder);

      expect(screen.queryByRole('button', { name: /주문 취소/i })).not.toBeInTheDocument();
    });

    it('should not show cancel button when no onCancelOrder handler provided', () => {
      const order = createMockOrder({ status: 'pending' });
      renderOrderCard(order);

      expect(screen.queryByRole('button', { name: /주문 취소/i })).not.toBeInTheDocument();
    });

    it('should call onCancelOrder when cancel button is clicked', async () => {
      const user = userEvent.setup();
      const order = createMockOrder({ status: 'pending' });
      const onCancelOrder = vi.fn();
      renderOrderCard(order, onCancelOrder);

      const cancelButton = screen.getByRole('button', { name: /주문 취소/i });
      await user.click(cancelButton);

      expect(onCancelOrder).toHaveBeenCalledWith('order-001');
    });
  });

  describe('expand/collapse for multiple items', () => {
    it('should not show expand button for single item order', () => {
      const order = createMockOrder();
      renderOrderCard(order);

      expect(screen.queryByText(/외.*개 상품/)).not.toBeInTheDocument();
    });

    it('should show expand button for multi-item order', () => {
      const order = createMockOrder({
        items: [
          { product: mockProduct, quantity: 1, price: 50000 },
          { product: mockProduct2, quantity: 2, price: 30000 },
        ],
      });
      renderOrderCard(order);

      expect(screen.getByText(/외 1개 상품/)).toBeInTheDocument();
    });

    it('should expand to show additional items when clicked', async () => {
      const user = userEvent.setup();
      const order = createMockOrder({
        items: [
          { product: mockProduct, quantity: 1, price: 50000 },
          { product: mockProduct2, quantity: 2, price: 30000 },
        ],
      });
      renderOrderCard(order);

      // Initially second item is hidden (not fully visible)
      const expandButton = screen.getByText(/외 1개 상품/);
      await user.click(expandButton);

      // After expanding, second item name should be visible
      expect(screen.getByText('테스트 상품 2')).toBeInTheDocument();
    });

    it('should collapse expanded items when clicked again', async () => {
      const user = userEvent.setup();
      const order = createMockOrder({
        items: [
          { product: mockProduct, quantity: 1, price: 50000 },
          { product: mockProduct2, quantity: 2, price: 30000 },
        ],
      });
      renderOrderCard(order);

      const expandButton = screen.getByText(/외 1개 상품/);

      // Expand
      await user.click(expandButton);
      expect(screen.getByText('테스트 상품 2')).toBeInTheDocument();

      // Collapse
      await user.click(expandButton);

      // The expanded items section should not be in the document
      // Note: The first product is always visible, only expanded section is hidden
      const expandedSection = screen.queryByText('수량: 2개');
      expect(expandedSection).not.toBeInTheDocument();
    });
  });

  describe('order detail link', () => {
    it('should render order detail button', () => {
      const order = createMockOrder();
      renderOrderCard(order);

      expect(screen.getByRole('button', { name: '주문 상세' })).toBeInTheDocument();
    });

    it('should have correct link to order detail page', () => {
      const order = createMockOrder({ id: 'order-001' });
      renderOrderCard(order);

      const detailLink = screen.getByRole('link', { name: /주문 상세/i });
      expect(detailLink).toHaveAttribute('href', '/orders/order-001');
    });
  });
});
