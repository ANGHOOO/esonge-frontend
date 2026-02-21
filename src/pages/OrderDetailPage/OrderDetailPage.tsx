import { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { Package, Truck, ArrowLeft, X, MapPin, CreditCard, Calendar } from 'lucide-react';
import { toast } from 'sonner';
import { ROUTES } from '@/constants/routes';
import { Breadcrumbs } from '@/components/layout';
import { Button, Spinner } from '@/components/ui';
import { useOrders, useAuth } from '@/stores';
import { ORDER_STATUS_LABELS } from '@/mocks/orders';
import type { Order } from '@/mocks/orders';
import styles from './OrderDetailPage.module.css';

export function OrderDetailPage() {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { orders, isLoading, fetchOrders, getOrderById, cancelOrder } = useOrders();
  const [order, setOrder] = useState<Order | undefined>(undefined);

  const breadcrumbItems = [
    { label: '주문내역', href: ROUTES.ORDERS },
    { label: order?.orderNumber || '주문 상세' },
  ];

  useEffect(() => {
    if (isAuthenticated && orders.length === 0) {
      fetchOrders();
    }
  }, [isAuthenticated, orders.length, fetchOrders]);

  useEffect(() => {
    if (orderId && orders.length > 0) {
      const foundOrder = getOrderById(orderId);
      setOrder(foundOrder);
    }
  }, [orderId, orders, getOrderById]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ko-KR').format(price);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusClass = (status: Order['status']) => {
    switch (status) {
      case 'delivered':
        return styles.statusDelivered;
      case 'shipping':
        return styles.statusShipping;
      case 'cancelled':
        return styles.statusCancelled;
      default:
        return styles.statusPending;
    }
  };

  const handleCancelOrder = async () => {
    if (!order) return;

    if (window.confirm('주문을 취소하시겠습니까?')) {
      const success = await cancelOrder(order.id);
      if (success) {
        toast.success('주문이 취소되었습니다.');
        // Refresh order data
        const updatedOrder = getOrderById(order.id);
        setOrder(updatedOrder);
      } else {
        toast.error('주문 취소에 실패했습니다.');
      }
    }
  };

  const canCancel = order && (order.status === 'pending' || order.status === 'confirmed');

  // Not logged in
  if (!isAuthenticated) {
    return (
      <div className={styles.page}>
        <div className={styles.container}>
          <Breadcrumbs items={breadcrumbItems} />
          <div className={styles.emptyState}>
            <Package className={styles.emptyIcon} />
            <h2 className={styles.emptyTitle}>로그인이 필요합니다</h2>
            <p className={styles.emptyText}>주문 상세 정보를 확인하시려면 로그인해주세요.</p>
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
            <Spinner size="lg" />
            <span>주문 정보를 불러오는 중...</span>
          </div>
        </div>
      </div>
    );
  }

  // Order not found
  if (!order) {
    return (
      <div className={styles.page}>
        <div className={styles.container}>
          <Breadcrumbs items={breadcrumbItems} />
          <div className={styles.emptyState}>
            <Package className={styles.emptyIcon} />
            <h2 className={styles.emptyTitle}>주문을 찾을 수 없습니다</h2>
            <p className={styles.emptyText}>요청하신 주문 정보가 존재하지 않습니다.</p>
            <Link to={ROUTES.ORDERS}>
              <Button>
                <ArrowLeft size={16} />
                주문 목록으로
              </Button>
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

        {/* Back Button */}
        <Link to={ROUTES.ORDERS} className={styles.backLink}>
          <ArrowLeft size={16} />
          주문 목록으로 돌아가기
        </Link>

        {/* Order Header */}
        <div className={styles.header}>
          <div className={styles.headerInfo}>
            <h1 className={styles.orderNumber}>{order.orderNumber}</h1>
            <span className={styles.orderDate}>{formatDate(order.orderedAt)}</span>
          </div>
          <span className={`${styles.status} ${getStatusClass(order.status)}`}>
            {ORDER_STATUS_LABELS[order.status]}
          </span>
        </div>

        {/* Tracking Info */}
        {order.status === 'shipping' && order.trackingNumber && (
          <div className={styles.trackingCard}>
            <Truck size={20} />
            <div className={styles.trackingInfo}>
              <span className={styles.trackingLabel}>배송 추적</span>
              <span className={styles.trackingNumber}>
                {order.carrier} {order.trackingNumber}
              </span>
            </div>
          </div>
        )}

        {order.status === 'delivered' && order.deliveredAt && (
          <div className={styles.deliveredCard}>
            <Package size={20} />
            <div className={styles.deliveredInfo}>
              <span className={styles.deliveredLabel}>배송 완료</span>
              <span className={styles.deliveredDate}>{formatDate(order.deliveredAt)}</span>
            </div>
          </div>
        )}

        <div className={styles.content}>
          {/* Order Items Section */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>
              <Package size={18} />
              주문 상품
            </h2>
            <div className={styles.itemsList}>
              {order.items.map((item) => (
                <div key={item.product.id} className={styles.item}>
                  <Link
                    to={`${ROUTES.PRODUCTS}/${item.product.id}`}
                    className={styles.itemImageLink}
                  >
                    <img
                      src={item.product.images[0]}
                      alt={item.product.name}
                      className={styles.itemImage}
                    />
                  </Link>
                  <div className={styles.itemInfo}>
                    <Link to={`${ROUTES.PRODUCTS}/${item.product.id}`} className={styles.itemName}>
                      {item.product.name}
                    </Link>
                    <div className={styles.itemMeta}>
                      <span className={styles.itemPrice}>{formatPrice(item.price)}원</span>
                      <span className={styles.itemQuantity}>수량: {item.quantity}개</span>
                    </div>
                    <div className={styles.itemTotal}>
                      소계: {formatPrice(item.price * item.quantity)}원
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Shipping Address Section */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>
              <MapPin size={18} />
              배송지 정보
            </h2>
            <div className={styles.addressCard}>
              <div className={styles.addressRow}>
                <span className={styles.addressLabel}>받는 분</span>
                <span className={styles.addressValue}>{order.shippingAddress.recipient}</span>
              </div>
              <div className={styles.addressRow}>
                <span className={styles.addressLabel}>연락처</span>
                <span className={styles.addressValue}>{order.shippingAddress.phone}</span>
              </div>
              <div className={styles.addressRow}>
                <span className={styles.addressLabel}>주소</span>
                <span className={styles.addressValue}>
                  ({order.shippingAddress.zipCode}) {order.shippingAddress.address}{' '}
                  {order.shippingAddress.addressDetail}
                </span>
              </div>
            </div>
          </section>

          {/* Payment Info Section */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>
              <CreditCard size={18} />
              결제 정보
            </h2>
            <div className={styles.paymentCard}>
              <div className={styles.paymentRow}>
                <span className={styles.paymentLabel}>결제 수단</span>
                <span className={styles.paymentValue}>{order.paymentMethod}</span>
              </div>
              <div className={styles.paymentRow}>
                <span className={styles.paymentLabel}>상품 금액</span>
                <span className={styles.paymentValue}>{formatPrice(order.totalAmount)}원</span>
              </div>
              <div className={styles.paymentRow}>
                <span className={styles.paymentLabel}>배송비</span>
                <span className={styles.paymentValue}>
                  {order.shippingFee === 0 ? '무료' : `${formatPrice(order.shippingFee)}원`}
                </span>
              </div>
              <div className={`${styles.paymentRow} ${styles.paymentTotal}`}>
                <span className={styles.paymentLabel}>총 결제금액</span>
                <span className={styles.paymentTotalValue}>
                  {formatPrice(order.totalAmount + order.shippingFee)}원
                </span>
              </div>
            </div>
          </section>

          {/* Order Date Info */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>
              <Calendar size={18} />
              주문 일시
            </h2>
            <div className={styles.dateCard}>
              <div className={styles.dateRow}>
                <span className={styles.dateLabel}>주문일</span>
                <span className={styles.dateValue}>{formatDate(order.orderedAt)}</span>
              </div>
              {order.deliveredAt && (
                <div className={styles.dateRow}>
                  <span className={styles.dateLabel}>배송 완료일</span>
                  <span className={styles.dateValue}>{formatDate(order.deliveredAt)}</span>
                </div>
              )}
            </div>
          </section>
        </div>

        {/* Actions */}
        <div className={styles.actions}>
          {canCancel && (
            <Button variant="outline" onClick={handleCancelOrder}>
              <X size={16} />
              주문 취소
            </Button>
          )}
          <Link to={ROUTES.ORDERS}>
            <Button variant="secondary">목록으로</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
