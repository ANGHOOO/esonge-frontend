import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Package, ShoppingBag, Filter } from 'lucide-react';
import { toast } from 'sonner';
import { ROUTES } from '@/constants/routes';
import { Breadcrumbs } from '@/components/layout';
import { Button } from '@/components/ui';
import { OrderCard } from '@/components/order';
import { useOrders, useAuth } from '@/stores';
import type { OrderStatus } from '@/mocks/orders';
import { ORDER_STATUS_LABELS } from '@/mocks/orders';
import styles from './OrdersPage.module.css';

type FilterStatus = OrderStatus | 'all';

const STATUS_FILTERS: { value: FilterStatus; label: string }[] = [
  { value: 'all', label: '전체' },
  { value: 'pending', label: ORDER_STATUS_LABELS.pending },
  { value: 'confirmed', label: ORDER_STATUS_LABELS.confirmed },
  { value: 'preparing', label: ORDER_STATUS_LABELS.preparing },
  { value: 'shipping', label: ORDER_STATUS_LABELS.shipping },
  { value: 'delivered', label: ORDER_STATUS_LABELS.delivered },
  { value: 'cancelled', label: ORDER_STATUS_LABELS.cancelled },
];

export function OrdersPage() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { orders, isLoading, fetchOrders, getOrdersByStatus, cancelOrder } = useOrders();
  const [selectedStatus, setSelectedStatus] = useState<FilterStatus>('all');

  const breadcrumbItems = [{ label: '주문내역' }];

  useEffect(() => {
    if (isAuthenticated) {
      fetchOrders();
    }
  }, [isAuthenticated, fetchOrders]);

  const handleCancelOrder = async (orderId: string) => {
    if (window.confirm('주문을 취소하시겠습니까?')) {
      const success = await cancelOrder(orderId);
      if (success) {
        toast.success('주문이 취소되었습니다.');
      } else {
        toast.error('주문 취소에 실패했습니다.');
      }
    }
  };

  const filteredOrders = getOrdersByStatus(selectedStatus);

  // Not logged in
  if (!isAuthenticated) {
    return (
      <div className={styles.page}>
        <div className={styles.container}>
          <Breadcrumbs items={breadcrumbItems} />
          <div className={styles.emptyState}>
            <Package className={styles.emptyIcon} />
            <h2 className={styles.emptyTitle}>로그인이 필요합니다</h2>
            <p className={styles.emptyText}>주문내역을 확인하시려면 로그인해주세요.</p>
            <div className={styles.emptyActions}>
              <Button onClick={() => navigate(ROUTES.LOGIN)}>로그인</Button>
              <Button variant="outline" onClick={() => navigate(ROUTES.REGISTER)}>
                회원가입
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Loading
  if (isLoading) {
    return (
      <div className={styles.page}>
        <div className={styles.container}>
          <Breadcrumbs items={breadcrumbItems} />
          <div className={styles.loading}>
            <div className={styles.spinner} />
            <span>주문내역을 불러오는 중...</span>
          </div>
        </div>
      </div>
    );
  }

  // Empty orders
  if (orders.length === 0) {
    return (
      <div className={styles.page}>
        <div className={styles.container}>
          <Breadcrumbs items={breadcrumbItems} />
          <div className={styles.emptyState}>
            <ShoppingBag className={styles.emptyIcon} />
            <h2 className={styles.emptyTitle}>주문내역이 없습니다</h2>
            <p className={styles.emptyText}>첫 주문을 해보세요!</p>
            <Link to={ROUTES.PRODUCTS}>
              <Button>쇼핑하러 가기</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <Breadcrumbs items={breadcrumbItems} />

        <div className={styles.header}>
          <h1 className={styles.title}>주문내역</h1>
          <span className={styles.orderCount}>총 {orders.length}건</span>
        </div>

        {/* Filters */}
        <div className={styles.filters}>
          <Filter size={16} className={styles.filterIcon} />
          <div className={styles.filterButtons}>
            {STATUS_FILTERS.map((filter) => (
              <button
                key={filter.value}
                type="button"
                className={`${styles.filterButton} ${
                  selectedStatus === filter.value ? styles.filterButtonActive : ''
                }`}
                onClick={() => setSelectedStatus(filter.value)}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>

        {/* Orders List */}
        <div className={styles.ordersList}>
          {filteredOrders.length === 0 ? (
            <div className={styles.noResults}>
              <p>해당 상태의 주문이 없습니다.</p>
            </div>
          ) : (
            filteredOrders.map((order) => (
              <OrderCard key={order.id} order={order} onCancelOrder={handleCancelOrder} />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
