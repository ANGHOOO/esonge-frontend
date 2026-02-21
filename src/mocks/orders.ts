import type { Product } from './products';
import { products } from './products';

export type OrderStatus =
  | 'pending' // 주문 대기
  | 'confirmed' // 주문 확인
  | 'preparing' // 상품 준비중
  | 'shipping' // 배송중
  | 'delivered' // 배송 완료
  | 'cancelled'; // 주문 취소

export interface OrderItem {
  product: Product;
  quantity: number;
  price: number; // 주문 당시 가격
}

export interface OrderAddress {
  recipient: string;
  phone: string;
  zipCode: string;
  address: string;
  addressDetail: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  items: OrderItem[];
  status: OrderStatus;
  shippingAddress: OrderAddress;
  totalAmount: number;
  shippingFee: number;
  paymentMethod: string;
  orderedAt: string;
  deliveredAt?: string;
  trackingNumber?: string;
  carrier?: string;
}

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  pending: '주문 대기',
  confirmed: '주문 확인',
  preparing: '상품 준비중',
  shipping: '배송중',
  delivered: '배송 완료',
  cancelled: '주문 취소',
};

export const ORDER_STATUS_COLORS: Record<OrderStatus, string> = {
  pending: 'warning',
  confirmed: 'info',
  preparing: 'info',
  shipping: 'primary',
  delivered: 'success',
  cancelled: 'error',
};

// Mock 주문 데이터
export const mockOrders: Order[] = [
  {
    id: 'order-001',
    orderNumber: 'ORD-2024-001234',
    items: [
      {
        product: products[0], // 특선 자연산 송이버섯 선물세트
        quantity: 1,
        price: 890000,
      },
    ],
    status: 'delivered',
    shippingAddress: {
      recipient: '홍길동',
      phone: '010-1234-5678',
      zipCode: '12345',
      address: '강원특별자치도 춘천시 중앙로 1',
      addressDetail: '101동 1001호',
    },
    totalAmount: 890000,
    shippingFee: 0,
    paymentMethod: '신용카드',
    orderedAt: '2024-10-01T09:30:00Z',
    deliveredAt: '2024-10-03T14:20:00Z',
    trackingNumber: '123456789012',
    carrier: 'CJ대한통운',
  },
  {
    id: 'order-002',
    orderNumber: 'ORD-2024-001235',
    items: [
      {
        product: products[3], // 자연산 송이버섯 가정용 300g
        quantity: 2,
        price: 180000,
      },
      {
        product: products[9], // 자연산 능이버섯 500g
        quantity: 1,
        price: 95000,
      },
    ],
    status: 'shipping',
    shippingAddress: {
      recipient: '홍길동',
      phone: '010-1234-5678',
      zipCode: '12345',
      address: '강원특별자치도 춘천시 중앙로 1',
      addressDetail: '101동 1001호',
    },
    totalAmount: 455000,
    shippingFee: 0,
    paymentMethod: '카카오페이',
    orderedAt: '2024-10-10T15:45:00Z',
    trackingNumber: '987654321098',
    carrier: '한진택배',
  },
  {
    id: 'order-003',
    orderNumber: 'ORD-2024-001236',
    items: [
      {
        product: products[15], // 강원 부사 사과 5kg
        quantity: 1,
        price: 45000,
      },
    ],
    status: 'preparing',
    shippingAddress: {
      recipient: '홍길동',
      phone: '010-1234-5678',
      zipCode: '54321',
      address: '서울특별시 강남구 테헤란로 123',
      addressDetail: '10층',
    },
    totalAmount: 48000,
    shippingFee: 3000,
    paymentMethod: '네이버페이',
    orderedAt: '2024-10-12T10:00:00Z',
  },
  {
    id: 'order-004',
    orderNumber: 'ORD-2024-001237',
    items: [
      {
        product: products[12], // 산양산삼 5뿌리 세트
        quantity: 1,
        price: 580000,
      },
    ],
    status: 'confirmed',
    shippingAddress: {
      recipient: '홍길동',
      phone: '010-1234-5678',
      zipCode: '12345',
      address: '강원특별자치도 춘천시 중앙로 1',
      addressDetail: '101동 1001호',
    },
    totalAmount: 580000,
    shippingFee: 0,
    paymentMethod: '신용카드',
    orderedAt: '2024-10-14T08:20:00Z',
  },
  {
    id: 'order-005',
    orderNumber: 'ORD-2024-001100',
    items: [
      {
        product: products[6], // 냉동 송이버섯 슬라이스 500g
        quantity: 3,
        price: 85000,
      },
    ],
    status: 'cancelled',
    shippingAddress: {
      recipient: '홍길동',
      phone: '010-1234-5678',
      zipCode: '12345',
      address: '강원특별자치도 춘천시 중앙로 1',
      addressDetail: '101동 1001호',
    },
    totalAmount: 255000,
    shippingFee: 0,
    paymentMethod: '신용카드',
    orderedAt: '2024-09-20T11:30:00Z',
  },
];

export function getOrderById(id: string): Order | undefined {
  return mockOrders.find((order) => order.id === id);
}

export function getOrdersByStatus(status: OrderStatus): Order[] {
  return mockOrders.filter((order) => order.status === status);
}
